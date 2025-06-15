from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Skill, UserSkill, Education, WorkExperience, ResumeVersion, ResumeTemplate
from .serializers import UserSerializer, SkillSerializer, UserSkillSerializer, EducationSerializer, WorkExperienceSerializer, ResumeVersionSerializer, ResumeTemplateSerializer
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
import jwt
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=True, methods=['get'])
    def skills(self, request, pk=None):
        user = self.get_object()
        user_skills = UserSkill.objects.filter(user=user)
        serializer = UserSkillSerializer(user_skills, many=True)
        return Response(serializer.data)

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

class UserSkillViewSet(viewsets.ModelViewSet):
    serializer_class = UserSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return UserSkill.objects.all()
        return UserSkill.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Education.objects.all()
        return Education.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WorkExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return WorkExperience.objects.all()
        return WorkExperience.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ResumeVersionViewSet(viewsets.ModelViewSet):
    queryset = ResumeVersion.objects.all()
    serializer_class = ResumeVersionSerializer
    permission_classes = [IsAuthenticated]

class ResumeTemplateViewSet(viewsets.ModelViewSet):
    queryset = ResumeTemplate.objects.all()
    serializer_class = ResumeTemplateSerializer
    permission_classes = [IsAuthenticated]

class LoginRateThrottle(AnonRateThrottle):
    rate = '5/hour'

class PasswordResetRateThrottle(AnonRateThrottle):
    rate = '3/hour'

class EmailVerificationRateThrottle(AnonRateThrottle):
    rate = '3/hour'

class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data['password'])
            user.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get('resume')
        if not file_obj:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        file_path = default_storage.save(f'resumes/{file_obj.name}', file_obj)
        request.user.resume_url = file_path
        request.user.save()
        return Response({'resume_url': file_path}, status=status.HTTP_200_OK)

class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PasswordResetRateThrottle]
    
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Generate reset token
        token = get_random_string(length=32)
        # Store token in cache with 1-hour expiration
        cache.set(f'password_reset_{token}', user.id, timeout=3600)
        
        # Send reset email
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        send_mail(
            'Password Reset Request',
            f'Click the following link to reset your password: {reset_url}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)

class PasswordResetValidateTokenView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        user_id = cache.get(f'password_reset_{token}')
        
        if not user_id:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response({'valid': True}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        user_id = cache.get(f'password_reset_{token}')
        if not user_id:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(id=user_id)
            user.set_password(new_password)
            user.save()
            
            # Delete the token from cache
            cache.delete(f'password_reset_{token}')
            
            return Response({'message': 'Password successfully reset'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class EmailVerificationView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [EmailVerificationRateThrottle]
    
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            if user.is_verified:
                return Response({'message': 'Email already verified'}, status=status.HTTP_200_OK)
                
            # Generate verification token
            token = get_random_string(length=32)
            # Store token in cache with 24-hour expiration
            cache.set(f'email_verify_{token}', user.id, timeout=86400)
            
            # Send verification email
            verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
            send_mail(
                'Verify Your Email',
                f'Click the following link to verify your email: {verify_url}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            
            return Response({'message': 'Verification email sent'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class EmailVerificationConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        user_id = cache.get(f'email_verify_{token}')
        
        if not user_id:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(id=user_id)
            user.is_verified = True
            user.save()
            
            # Delete the token from cache
            cache.delete(f'email_verify_{token}')
            
            return Response({'message': 'Email successfully verified'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
