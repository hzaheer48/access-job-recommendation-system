from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Alert
from .serializers import AlertSerializer
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
