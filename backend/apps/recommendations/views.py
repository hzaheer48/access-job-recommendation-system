from django.shortcuts import render
from rest_framework import viewsets, filters, permissions
from rest_framework.permissions import IsAuthenticated
from .models import Recommendation, JobMatch, JobSimilarity
from .serializers import RecommendationSerializer, JobMatchSerializer, JobSimilaritySerializer
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class RecommendationViewSet(viewsets.ModelViewSet):
    serializer_class = RecommendationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['score', 'date_generated']
    ordering = ['-score']  # Default ordering by score descending

    def get_queryset(self):
        if self.request.user.is_staff:
            return Recommendation.objects.all()
        return Recommendation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RecommendationFeedbackView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        return Response({'message': 'Feedback received.'})

class SkillGapAnalysisView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'gaps': []})

class RecommendationExplanationView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, job_id):
        return Response({'explanation': f'Explanation for job {job_id}'})

class ModelRetrainingView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        return Response({'message': 'Model retraining started.'})

class JobMatchViewSet(viewsets.ModelViewSet):
    queryset = JobMatch.objects.all()
    serializer_class = JobMatchSerializer
    permission_classes = [permissions.IsAuthenticated]

class JobSimilarityViewSet(viewsets.ModelViewSet):
    queryset = JobSimilarity.objects.all()
    serializer_class = JobSimilaritySerializer
    permission_classes = [permissions.IsAuthenticated]
