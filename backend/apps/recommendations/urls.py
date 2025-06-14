from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecommendationViewSet, RetrainModelView, JobMatchViewSet, JobSimilarityViewSet

router = DefaultRouter()
router.register(r'recommendations', RecommendationViewSet)
router.register(r'job-matches', JobMatchViewSet)
router.register(r'job-similarities', JobSimilarityViewSet)

urlpatterns = [
    # Recommendation endpoints
    path('feedback/', views.RecommendationFeedbackView.as_view(), name='recommendation-feedback'),
    path('skill-gaps/', views.SkillGapAnalysisView.as_view(), name='skill-gaps'),
    path('explain/<int:job_id>/', views.RecommendationExplanationView.as_view(), name='recommendation-explain'),
    path('retrain/', RetrainModelView.as_view(), name='retrain-model'),
    
    # Include router URLs
    path('', include(router.urls)),
]