from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobApplicationViewSet, InterviewFeedbackViewSet, InterviewPreparationViewSet, InterviewScheduleViewSet, ApplicationStatsView

router = DefaultRouter()
router.register(r'applications', JobApplicationViewSet)
router.register(r'interview-feedback', InterviewFeedbackViewSet)
router.register(r'interview-preparation', InterviewPreparationViewSet)
router.register(r'interview-schedule', InterviewScheduleViewSet)

urlpatterns = [
    # Application statistics
    path('stats/', ApplicationStatsView.as_view(), name='application-stats'),
    
    # Include router URLs
    path('', include(router.urls)),
]