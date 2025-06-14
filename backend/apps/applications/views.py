from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Application, Interview
from .serializers import ApplicationSerializer, InterviewSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # If user is staff/admin, show all applications
        if self.request.user.is_staff:
            return Application.objects.all()
        # Otherwise, show only user's applications
        return Application.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user to the current user
        serializer.save(user=self.request.user)

class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Interview.objects.all()
        return Interview.objects.filter(application__user=self.request.user)

class ApplicationStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = Application.objects.count()
        user_total = Application.objects.filter(user=request.user).count()
        return Response({
            'total_applications': total,
            'your_applications': user_total
        })
