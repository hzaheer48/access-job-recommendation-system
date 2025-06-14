from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, InterviewFeedbackViewSet, InterviewPreparationViewSet, InterviewScheduleViewSet

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet)
router.register(r'interview-feedback', InterviewFeedbackViewSet)
router.register(r'interview-preparation', InterviewPreparationViewSet)
router.register(r'interview-schedule', InterviewScheduleViewSet)

urlpatterns = [
    # Application statistics
    path('stats/', views.ApplicationStatsView.as_view(), name='application-stats'),
    
    # Include router URLs
    path('', include(router.urls)),
]