from rest_framework import serializers
from .models import User, Skill, UserSkill, Education, WorkExperience, ResumeVersion, ResumeTemplate

class UserSerializer(serializers.ModelSerializer):
    resumeVersions = serializers.SerializerMethodField()
    selectedTemplate = serializers.SerializerMethodField()
    role = serializers.CharField(source='user_type')
    isActive = serializers.BooleanField(source='is_active')
    createdAt = serializers.DateTimeField(source='created_at')
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 'isActive',
            'createdAt', 'profile', 'resumeVersions', 'selectedTemplate',
            'user_type', 'is_verified', 'phone', 'location', 'bio',
            'resume', 'linkedin_url', 'github_url', 'portfolio_url',
            'experience_level', 'profile_details', 'updated_at',
            'last_login', 'profile_visibility', 'show_email',
            'show_phone', 'show_location', 'show_resume',
            'show_social_links', 'show_experience', 'show_education',
            'show_skills'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_login']

    def get_resumeVersions(self, obj):
        resume_versions = ResumeVersion.objects.filter(user=obj)
        return ResumeVersionSerializer(resume_versions, many=True).data

    def get_selectedTemplate(self, obj):
        selected_template = ResumeTemplate.objects.filter(user=obj).first()
        if selected_template:
            return ResumeTemplateSerializer(selected_template).data
        return None

    def get_profile(self, obj):
        return {
            'skills': UserSkillSerializer(obj.userskill_set.all(), many=True).data,
            'education': EducationSerializer(obj.education_set.all(), many=True).data,
            'experience': WorkExperienceSerializer(obj.workexperience_set.all(), many=True).data
        }

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class UserSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSkill
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = '__all__'

class ResumeTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeTemplate
        fields = '__all__'
        read_only_fields = ['createdAt', 'updatedAt']

class ResumeVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeVersion
        fields = '__all__'
        read_only_fields = ['createdAt', 'updatedAt']