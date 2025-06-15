from django.shortcuts import render
from rest_framework import viewsets, filters, permissions
from rest_framework.permissions import IsAuthenticated
from .models import Alert, JobAlert, JobAlertMatch, JobAlertStats
from .serializers import AlertSerializer, JobAlertSerializer, JobAlertMatchSerializer, JobAlertStatsSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class AlertViewSet(viewsets.ModelViewSet):
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['keywords', 'location_filter']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Alert.objects.all()
        return Alert.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AlertNotificationViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    def list(self, request):
        return Response([])

class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        return Response({'message': f'Notification {pk} marked as read.'})

class JobAlertViewSet(viewsets.ModelViewSet):
    queryset = JobAlert.objects.all()
    serializer_class = JobAlertSerializer
    permission_classes = [permissions.IsAuthenticated]

class JobAlertMatchViewSet(viewsets.ModelViewSet):
    queryset = JobAlertMatch.objects.all()
    serializer_class = JobAlertMatchSerializer
    permission_classes = [permissions.IsAuthenticated]

class JobAlertStatsViewSet(viewsets.ModelViewSet):
    queryset = JobAlertStats.objects.all()
    serializer_class = JobAlertStatsSerializer
    permission_classes = [permissions.IsAuthenticated]
