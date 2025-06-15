from rest_framework import serializers
from .models import SystemActivity, DashboardMetrics, UserActivity, ErrorLog
from apps.authentication.serializers import UserSerializer

class SystemActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SystemActivity
        fields = [
            'id', 'activity_type', 'user', 'description',
            'timestamp', 'metadata', 'ip_address', 'user_agent'
        ]
        read_only_fields = ['timestamp']

class DashboardMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardMetrics
        fields = [
            'id', 'date', 'total_users', 'active_users',
            'total_jobs', 'active_jobs', 'total_applications',
            'total_companies', 'system_performance', 'created_at'
        ]
        read_only_fields = ['created_at']

class UserActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserActivity
        fields = [
            'id', 'user', 'activity_type', 'description',
            'timestamp', 'metadata', 'session_id', 'ip_address'
        ]
        read_only_fields = ['timestamp']

class ErrorLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ErrorLog
        fields = [
            'id', 'error_type', 'message', 'stack_trace',
            'user', 'timestamp', 'resolution_status', 'notes'
        ]
        read_only_fields = ['timestamp'] 