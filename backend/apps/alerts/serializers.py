from rest_framework import serializers
from .models import Alert, JobAlert, JobAlertMatch, JobAlertStats
from apps.authentication.serializers import UserSerializer

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'
        read_only_fields = ('last_sent',)

class JobAlertSerializer(serializers.ModelSerializer):
    userId = serializers.IntegerField(source='user.id')
    name = serializers.CharField(source='name')
    criteria = serializers.JSONField(source='criteria')
    frequency = serializers.CharField(source='frequency')
    status = serializers.CharField(source='status')
    lastSent = serializers.DateTimeField(source='last_sent')
    nextScheduled = serializers.DateTimeField(source='next_scheduled')
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')

    class Meta:
        model = JobAlert
        fields = [
            'id', 'userId', 'name', 'criteria', 'frequency',
            'status', 'lastSent', 'nextScheduled', 'createdAt',
            'updatedAt'
        ]
        read_only_fields = ['createdAt', 'updatedAt']

class JobAlertMatchSerializer(serializers.ModelSerializer):
    alertId = serializers.IntegerField(source='alert.id')
    jobId = serializers.IntegerField(source='job.id')
    matchScore = serializers.FloatField(source='match_score')
    matchReasons = serializers.JSONField(source='match_reasons')
    status = serializers.CharField(source='status')
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')

    class Meta:
        model = JobAlertMatch
        fields = [
            'id', 'alertId', 'jobId', 'matchScore', 'matchReasons',
            'status', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['createdAt', 'updatedAt']

class JobAlertStatsSerializer(serializers.ModelSerializer):
    userId = serializers.IntegerField(source='user.id')
    totalAlerts = serializers.IntegerField(source='total_alerts')
    activeAlerts = serializers.IntegerField(source='active_alerts')
    totalMatches = serializers.IntegerField(source='total_matches')
    matchesByStatus = serializers.JSONField(source='matches_by_status')
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')

    class Meta:
        model = JobAlertStats
        fields = [
            'id', 'userId', 'totalAlerts', 'activeAlerts',
            'totalMatches', 'matchesByStatus', 'createdAt',
            'updatedAt'
        ]
        read_only_fields = ['createdAt', 'updatedAt']