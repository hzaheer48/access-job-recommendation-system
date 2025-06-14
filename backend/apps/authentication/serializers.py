from rest_framework import serializers
from .models import User, Skill, UserSkill, Education, WorkExperience, ResumeVersion, ResumeTemplate

class UserSerializer(serializers.ModelSerializer):
    resumeVersions = serializers.SerializerMethodField()
    selectedTemplate = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'resumeVersions', 'selectedTemplate']
        read_only_fields = ['id']

    def get_resumeVersions(self, obj):
        resume_versions = ResumeVersion.objects.filter(user=obj)
        return ResumeVersionSerializer(resume_versions, many=True).data

    def get_selectedTemplate(self, obj):
        selected_template = ResumeTemplate.objects.filter(user=obj).first()
        if selected_template:
            return ResumeTemplateSerializer(selected_template).data
        return None

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