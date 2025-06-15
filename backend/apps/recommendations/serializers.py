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
    matchScore = serializers.FloatField(source='match_score')
    matchingSkills = serializers.JSONField(source='matching_skills')
    missingSkills = serializers.JSONField(source='missing_skills')
    skillGaps = serializers.SerializerMethodField()
    recommendations = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')

    class Meta:
        model = JobMatch
        fields = [
            'id', 'user', 'job', 'matchScore', 'matchingSkills',
            'missingSkills', 'skillGaps', 'recommendations',
            'createdAt', 'updatedAt'
        ]
        read_only_fields = ['createdAt', 'updatedAt']

    def get_skillGaps(self, obj):
        gaps = []
        for skill, levels in obj.skill_gaps.items():
            gaps.append({
                'skill': skill,
                'requiredLevel': levels['required'],
                'userLevel': levels['user']
            })
        return gaps

    def get_recommendations(self, obj):
        recommendations = []
        for rec in obj.recommendations:
            recommendations.append({
                'skill': rec['skill'],
                'reason': rec['reason'],
                'priority': rec['priority']
            })
        return recommendations

class JobSimilaritySerializer(serializers.ModelSerializer):
    job1 = JobListingSerializer(read_only=True)
    job2 = JobListingSerializer(read_only=True)
    similarityScore = serializers.FloatField(source='similarity_score')
    commonSkills = serializers.JSONField(source='common_skills')
    commonRequirements = serializers.JSONField(source='common_requirements')
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')

    class Meta:
        model = JobSimilarity
        fields = [
            'id', 'job1', 'job2', 'similarityScore',
            'commonSkills', 'commonRequirements', 'createdAt',
            'updatedAt'
        ]
        read_only_fields = ['createdAt', 'updatedAt']