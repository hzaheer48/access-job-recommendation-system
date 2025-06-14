from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillAssessmentViewSet, AssessmentQuestionViewSet, LearningResourceViewSet, AssessmentTemplateViewSet, AssessmentViewSet, AssessmentResultViewSet, AssessmentAnswerViewSet

router = DefaultRouter()
router.register(r'assessments', SkillAssessmentViewSet, basename='skill-assessment')
router.register(r'questions', AssessmentQuestionViewSet, basename='assessment-question')
router.register(r'resources', LearningResourceViewSet, basename='learning-resource')
router.register(r'assessment-templates', AssessmentTemplateViewSet, basename='assessmenttemplate')
router.register(r'assessments', AssessmentViewSet, basename='assessment')
router.register(r'assessment-questions', AssessmentQuestionViewSet, basename='assessmentquestion')
router.register(r'assessment-results', AssessmentResultViewSet, basename='assessmentresult')
router.register(r'assessment-answers', AssessmentAnswerViewSet, basename='assessmentanswer')

urlpatterns = [
    path('', include(router.urls)),
] 