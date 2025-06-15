from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SystemActivityViewSet, DashboardMetricsViewSet, UserActivityViewSet, ErrorLogViewSet

router = DefaultRouter()
router.register(r'system-activities', SystemActivityViewSet, basename='system-activity')
router.register(r'metrics', DashboardMetricsViewSet, basename='dashboard-metrics')
router.register(r'user-activities', UserActivityViewSet, basename='user-activity')
router.register(r'error-logs', ErrorLogViewSet, basename='error-log')

urlpatterns = [
    path('', include(router.urls)),
]