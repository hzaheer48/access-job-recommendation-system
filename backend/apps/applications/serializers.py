from rest_framework import serializers
from .models import JobApplication, InterviewFeedback, InterviewPreparation, InterviewSchedule
from apps.authentication.serializers import UserSerializer
from apps.jobs.serializers import JobListingSerializer

class InterviewFeedbackSerializer(serializers.ModelSerializer):
    interviewer = UserSerializer(read_only=True)

    class Meta:
        model = InterviewFeedback
        fields = '__all__'
        read_only_fields = ['createdAt', 'updatedAt']

class InterviewPreparationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewPreparation
        fields = '__all__'
        read_only_fields = ['createdAt', 'updatedAt']

class InterviewScheduleSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = InterviewSchedule
        fields = '__all__'
        read_only_fields = ['createdAt', 'updatedAt']

class JobApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    job = JobListingSerializer(read_only=True)
    feedback = InterviewFeedbackSerializer(many=True, read_only=True)
    preparation = InterviewPreparationSerializer(many=True, read_only=True)
    schedule = InterviewScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['applied_date', 'last_updated']