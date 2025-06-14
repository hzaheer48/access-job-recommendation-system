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
    type = serializers.CharField(source='job_type')
    postedDate = serializers.DateTimeField(source='posted_date')
    deadline = serializers.DateTimeField(source='application_deadline')
    status = serializers.SerializerMethodField()
    isRemote = serializers.BooleanField(source='remote_option')
    isFeatured = serializers.BooleanField(source='is_featured')
    isUrgent = serializers.SerializerMethodField()
    requiredSkills = serializers.SerializerMethodField()
    skillLevels = serializers.SerializerMethodField()
    salary = serializers.SerializerMethodField()
    applicationCount = serializers.SerializerMethodField()
    viewCount = serializers.IntegerField(source='view_count')
    tags = serializers.SerializerMethodField()
    metadata = serializers.SerializerMethodField()

    class Meta:
        model = JobListing
        fields = [
            'id', 'title', 'company', 'company_id', 'description', 'requirements',
            'benefits', 'salary_min', 'salary_max', 'location', 'job_type',
            'experience_level', 'remote_option', 'posted_date', 'application_deadline',
            'is_active', 'is_featured', 'view_count', 'skill_requirements',
            'days_until_deadline', 'posted_by', 'type', 'postedDate', 'deadline',
            'status', 'isRemote', 'isFeatured', 'isUrgent', 'requiredSkills',
            'skillLevels', 'salary', 'applicationCount', 'viewCount', 'tags',
            'metadata'
        ]
        read_only_fields = ['posted_date', 'view_count', 'applicationCount']

    def get_days_until_deadline(self, obj):
        if obj.application_deadline:
            from django.utils import timezone
            now = timezone.now()
            delta = obj.application_deadline - now
            return max(0, delta.days)
        return None

    def get_status(self, obj):
        if not obj.is_active:
            return 'closed'
        if obj.application_deadline and obj.application_deadline < timezone.now():
            return 'closed'
        return 'active'

    def get_isUrgent(self, obj):
        if obj.application_deadline:
            from django.utils import timezone
            now = timezone.now()
            delta = obj.application_deadline - now
            return delta.days <= 7
        return False

    def get_requiredSkills(self, obj):
        return [req.skill.name for req in obj.skill_requirements.all()]

    def get_skillLevels(self, obj):
        return {req.skill.name: req.proficiency_level for req in obj.skill_requirements.all()}

    def get_salary(self, obj):
        return {
            'min': float(obj.salary_min) if obj.salary_min else None,
            'max': float(obj.salary_max) if obj.salary_max else None,
            'currency': 'USD'  # You might want to make this configurable
        }

    def get_applicationCount(self, obj):
        return obj.jobapplication_set.count()

    def get_tags(self, obj):
        # You might want to implement a proper tagging system
        return [obj.job_type, obj.experience_level, obj.remote_option]

    def get_metadata(self, obj):
        return {
            'created_at': obj.posted_date,
            'updated_at': obj.posted_date,  # You might want to add an updated_at field
            'company_size': obj.company.size if obj.company else None,
            'company_industry': obj.company.industry if obj.company else None
        }

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