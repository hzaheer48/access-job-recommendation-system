from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecommendationViewSet, ModelRetrainingView, JobMatchViewSet, JobSimilarityViewSet, RecommendationFeedbackView, SkillGapAnalysisView, RecommendationExplanationView

router = DefaultRouter()
router.register(r'recommendations', RecommendationViewSet)
router.register(r'job-matches', JobMatchViewSet)
router.register(r'job-similarities', JobSimilarityViewSet)

urlpatterns = [
    # Recommendation endpoints
    path('feedback/', RecommendationFeedbackView.as_view(), name='recommendation-feedback'),
    path('skill-gaps/', SkillGapAnalysisView.as_view(), name='skill-gaps'),
    path('explain/<int:job_id>/', RecommendationExplanationView.as_view(), name='recommendation-explain'),
    path('retrain/', ModelRetrainingView.as_view(), name='retrain-model'),
    
    # Include router URLs
    path('', include(router.urls)),
]