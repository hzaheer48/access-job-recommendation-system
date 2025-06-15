from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from .models import SystemActivity, DashboardMetrics, UserActivity, ErrorLog
from .serializers import SystemActivitySerializer, DashboardMetricsSerializer, UserActivitySerializer, ErrorLogSerializer

class DashboardMetricsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'metrics': {}})

class UserManagementView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'users': []})

class UpdateUserStatusView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        return Response({'message': f'User {pk} status updated.'})

class PendingJobsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'pending_jobs': []})

class ApproveJobView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        return Response({'message': f'Job {pk} approved.'})

class DetailedAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'analytics': {}})

class SystemLogsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'logs': []})

class SystemActivityViewSet(viewsets.ModelViewSet):
    serializer_class = SystemActivitySerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return SystemActivity.objects.all()

class DashboardMetricsViewSet(viewsets.ModelViewSet):
    serializer_class = DashboardMetricsSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return DashboardMetrics.objects.all()

    @action(detail=False, methods=['get'])
    def latest(self, request):
        metrics = self.get_queryset().order_by('-date').first()
        if metrics:
            serializer = self.get_serializer(metrics)
            return Response(serializer.data)
        return Response({'error': 'No metrics available'}, status=status.HTTP_404_NOT_FOUND)

class UserActivityViewSet(viewsets.ModelViewSet):
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return UserActivity.objects.filter(user_id=user_id)
        return UserActivity.objects.all()

class ErrorLogViewSet(viewsets.ModelViewSet):
    serializer_class = ErrorLogSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return ErrorLog.objects.all()

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        error_log = self.get_object()
        error_log.resolution_status = 'resolved'
        error_log.notes = request.data.get('notes', '')
        error_log.save()
        return Response({'status': 'success'}) 