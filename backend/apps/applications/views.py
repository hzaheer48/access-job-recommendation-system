from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import JobApplication, Interview, InterviewFeedback, InterviewPreparation, InterviewSchedule
from .serializers import (
    JobApplicationSerializer,
    InterviewFeedbackSerializer,
    InterviewPreparationSerializer,
    InterviewScheduleSerializer
)
from rest_framework.views import APIView

# Create your views here.

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def submit_feedback(self, request, pk=None):
        application = self.get_object()
        serializer = InterviewFeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(application=application, interviewer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def create_preparation(self, request, pk=None):
        application = self.get_object()
        serializer = InterviewPreparationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(application=application)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def schedule_interview(self, request, pk=None):
        application = self.get_object()
        serializer = InterviewScheduleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(application=application)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ApplicationStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        total_applications = JobApplication.objects.filter(user=user).count()
        interviews_scheduled = InterviewSchedule.objects.filter(application__user=user).count()
        feedback_received = InterviewFeedback.objects.filter(application__user=user).count()
        
        return Response({
            'total_applications': total_applications,
            'interviews_scheduled': interviews_scheduled,
            'feedback_received': feedback_received
        })

class InterviewFeedbackViewSet(viewsets.ModelViewSet):
    queryset = InterviewFeedback.objects.all()
    serializer_class = InterviewFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

class InterviewPreparationViewSet(viewsets.ModelViewSet):
    queryset = InterviewPreparation.objects.all()
    serializer_class = InterviewPreparationSerializer
    permission_classes = [permissions.IsAuthenticated]

class InterviewScheduleViewSet(viewsets.ModelViewSet):
    queryset = InterviewSchedule.objects.all()
    serializer_class = InterviewScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
