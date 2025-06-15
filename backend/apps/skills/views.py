from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SkillAssessment, AssessmentQuestion, LearningResource, AssessmentTemplate, Assessment, AssessmentResult, AssessmentAnswer
from .serializers import (
    SkillAssessmentSerializer,
    AssessmentQuestionSerializer,
    LearningResourceSerializer,
    AssessmentTemplateSerializer,
    AssessmentSerializer,
    AssessmentResultSerializer,
    AssessmentAnswerSerializer
)

class SkillAssessmentViewSet(viewsets.ModelViewSet):
    serializer_class = SkillAssessmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SkillAssessment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def submit_answers(self, request, pk=None):
        assessment = self.get_object()
        answers = request.data.get('answers', [])
        # Here you would implement the logic to grade the assessment
        # For now, we'll just return the submitted answers
        return Response({'answers': answers})

class AssessmentTemplateViewSet(viewsets.ModelViewSet):
    queryset = AssessmentTemplate.objects.all()
    serializer_class = AssessmentTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class AssessmentQuestionViewSet(viewsets.ModelViewSet):
    queryset = AssessmentQuestion.objects.all()
    serializer_class = AssessmentQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

class AssessmentResultViewSet(viewsets.ModelViewSet):
    queryset = AssessmentResult.objects.all()
    serializer_class = AssessmentResultSerializer
    permission_classes = [permissions.IsAuthenticated]

class AssessmentAnswerViewSet(viewsets.ModelViewSet):
    queryset = AssessmentAnswer.objects.all()
    serializer_class = AssessmentAnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

class LearningResourceViewSet(viewsets.ModelViewSet):
    serializer_class = LearningResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        skill_id = self.request.query_params.get('skill_id')
        if skill_id:
            return LearningResource.objects.filter(skill_id=skill_id)
        return LearningResource.objects.all() 