from rest_framework import serializers
from .models import JobListing, Company, JobSkillRequirement, Bookmark, SavedSearch
from apps.authentication.serializers import SkillSerializer, UserSerializer

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class JobSkillRequirementSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    skill_id = serializers.PrimaryKeyRelatedField(
        queryset=JobSkillRequirement.objects.all(),
        source='skill',
        write_only=True
    )

    class Meta:
        model = JobSkillRequirement
        fields = ['id', 'skill', 'skill_id', 'is_required', 'proficiency_level']

class JobListingSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        source='company',
        write_only=True
    )
    skill_requirements = JobSkillRequirementSerializer(many=True, read_only=True)
    posted_by = UserSerializer(read_only=True)
    days_until_deadline = serializers.SerializerMethodField()

    class Meta:
        model = JobListing
        fields = [
            'id', 'title', 'company', 'company_id', 'description', 'requirements',
            'benefits', 'salary_min', 'salary_max', 'location', 'job_type',
            'experience_level', 'remote_option', 'posted_date', 'application_deadline',
            'is_active', 'is_featured', 'view_count', 'skill_requirements',
            'days_until_deadline', 'posted_by'
        ]
        read_only_fields = ['posted_date', 'view_count']

    def get_days_until_deadline(self, obj):
        if obj.application_deadline:
            from django.utils import timezone
            now = timezone.now()
            delta = obj.application_deadline - now
            return max(0, delta.days)
        return None

class BookmarkSerializer(serializers.ModelSerializer):
    job = JobListingSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Bookmark
        fields = ['id', 'job', 'user', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

class SavedSearchSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SavedSearch
        fields = ['id', 'name', 'criteria', 'created_at', 'last_used', 'is_active', 'user']
        read_only_fields = ['user', 'created_at', 'last_used']