from rest_framework import serializers
from .models import Notification, NotificationPreference
from apps.jobs.serializers import JobListingSerializer
from apps.applications.serializers import JobApplicationSerializer
from apps.authentication.serializers import UserSerializer

class NotificationSerializer(serializers.ModelSerializer):
    job = JobListingSerializer(read_only=True)
    application = JobApplicationSerializer(read_only=True)
    userId = serializers.IntegerField(source='user.id')
    type = serializers.CharField(source='type')
    title = serializers.CharField(source='title')
    message = serializers.CharField(source='message')
    isRead = serializers.BooleanField(source='is_read')
    createdAt = serializers.DateTimeField(source='created_at')
    metadata = serializers.JSONField(source='metadata')
    
    class Meta:
        model = Notification
        fields = [
            'id', 'userId', 'type', 'title', 'message',
            'isRead', 'createdAt', 'job', 'application',
            'metadata'
        ]
        read_only_fields = ['createdAt']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    userId = serializers.IntegerField(source='user.id')
    emailNotifications = serializers.BooleanField(source='email_notifications')
    pushNotifications = serializers.BooleanField(source='push_notifications')
    jobMatches = serializers.BooleanField(source='job_matches')
    applicationUpdates = serializers.BooleanField(source='application_updates')
    interviewReminders = serializers.BooleanField(source='interview_reminders')
    jobAlerts = serializers.BooleanField(source='job_alerts')
    systemNotifications = serializers.BooleanField(source='system_notifications')
    updatedAt = serializers.DateTimeField(source='updated_at')

    class Meta:
        model = NotificationPreference
        fields = [
            'id', 'userId', 'emailNotifications', 'pushNotifications',
            'jobMatches', 'applicationUpdates', 'interviewReminders',
            'jobAlerts', 'systemNotifications', 'updatedAt'
        ]
        read_only_fields = ['updatedAt'] 