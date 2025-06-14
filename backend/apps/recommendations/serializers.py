from rest_framework import serializers
from .models import Recommendation, JobMatch, JobSimilarity
from apps.authentication.serializers import UserSerializer
from apps.jobs.serializers import JobListingSerializer

class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = '__all__'
        read_only_fields = ('date_generated',)

class JobMatchSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    job = JobListingSerializer(read_only=True)

    class Meta:
        model = JobMatch
        fields = '__all__'
        read_only_fields = ['createdAt', 'updatedAt']

class JobSimilaritySerializer(serializers.ModelSerializer):
    job1 = JobListingSerializer(read_only=True)
    job2 = JobListingSerializer(read_only=True)

    class Meta:
        model = JobSimilarity
        fields = '__all__'
        read_only_fields = ['createdAt', 'updatedAt']