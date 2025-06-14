from rest_framework import serializers
from .models import Alert, JobAlert, JobAlertMatch, JobAlertStats

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'
        read_only_fields = ('last_sent',)

class JobAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobAlert
        fields = '__all__'
        read_only_fields = ['createdAt', 'updatedAt']

class JobAlertMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobAlertMatch
        fields = '__all__'
        read_only_fields = ['createdAt', 'updatedAt']

class JobAlertStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobAlertStats
        fields = '__all__'
        read_only_fields = ['lastUpdated']