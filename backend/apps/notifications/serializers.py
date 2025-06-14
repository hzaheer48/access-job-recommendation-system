from rest_framework import serializers
from .models import Notification, NotificationPreference
from apps.jobs.serializers import JobListingSerializer
from apps.applications.serializers import JobApplicationSerializer

class NotificationSerializer(serializers.ModelSerializer):
    job = JobListingSerializer(read_only=True)
    application = JobApplicationSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'title', 'message', 'is_read',
            'created_at', 'job', 'application', 'metadata'
        ]
        read_only_fields = ['created_at']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = [
            'email_notifications', 'push_notifications',
            'job_matches', 'application_updates',
            'interview_reminders', 'job_alerts',
            'system_notifications', 'updated_at'
        ]
        read_only_fields = ['updated_at'] 