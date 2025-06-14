from rest_framework import serializers
from .models import SkillAssessment, AssessmentQuestion, LearningResource, AssessmentTemplate, Assessment, AssessmentResult, AssessmentAnswer
from apps.authentication.serializers import UserSerializer, SkillSerializer

class AssessmentQuestionSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    
    class Meta:
        model = AssessmentQuestion
        fields = '__all__'

class SkillAssessmentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skill = SkillSerializer(read_only=True)
    
    class Meta:
        model = SkillAssessment
        fields = [
            'id', 'user', 'skill', 'score', 'level',
            'completed_at', 'time_spent', 'questions_answered',
            'correct_answers'
        ]
        read_only_fields = ['completed_at']

class LearningResourceSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    
    class Meta:
        model = LearningResource
        fields = [
            'id', 'skill', 'title', 'type', 'url',
            'provider', 'duration', 'difficulty', 'cost',
            'description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class AssessmentTemplateSerializer(serializers.ModelSerializer):
    questions = AssessmentQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = AssessmentTemplate
        fields = '__all__'

class AssessmentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentAnswer
        fields = '__all__'

class AssessmentResultSerializer(serializers.ModelSerializer):
    answers = AssessmentAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = AssessmentResult
        fields = '__all__'

class AssessmentSerializer(serializers.ModelSerializer):
    template = AssessmentTemplateSerializer(read_only=True)
    results = AssessmentResultSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = '__all__' 