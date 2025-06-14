from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.RecommendationViewSet, basename='recommendation')

urlpatterns = [
    # Recommendation endpoints
    path('feedback/', views.RecommendationFeedbackView.as_view(), name='recommendation-feedback'),
    path('skill-gaps/', views.SkillGapAnalysisView.as_view(), name='skill-gaps'),
    path('explain/<int:job_id>/', views.RecommendationExplanationView.as_view(), name='recommendation-explain'),
    path('retrain/', views.ModelRetrainingView.as_view(), name='model-retrain'),
    
    # Include router URLs
    path('', include(router.urls)),
]