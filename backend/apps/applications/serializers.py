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
    jobId = serializers.IntegerField(source='job.id')
    userId = serializers.IntegerField(source='user.id')
    status = serializers.CharField(source='status')
    appliedDate = serializers.DateTimeField(source='applied_date')
    coverLetter = serializers.CharField(source='cover_letter')
    customResume = serializers.FileField(source='custom_resume')
    notes = serializers.CharField(source='notes')
    interviewStages = serializers.SerializerMethodField()
    last_updated = serializers.DateTimeField()

    class Meta:
        model = JobApplication
        fields = [
            'id', 'jobId', 'userId', 'status', 'appliedDate',
            'coverLetter', 'customResume', 'notes', 'interviewStages',
            'user', 'job', 'feedback', 'preparation', 'schedule',
            'last_updated'
        ]
        read_only_fields = ['applied_date', 'last_updated']

    def get_interviewStages(self, obj):
        stages = []
        for schedule in obj.schedule.all():
            stages.append({
                'id': schedule.id,
                'type': schedule.type,
                'status': schedule.status,
                'scheduledDate': schedule.scheduledDate,
                'duration': schedule.duration,
                'notes': schedule.notes,
                'participants': UserSerializer(schedule.participants.all(), many=True).data
            })
        return stages