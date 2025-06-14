from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Recommendation
from .serializers import RecommendationSerializer

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
