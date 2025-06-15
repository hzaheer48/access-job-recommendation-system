from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.AlertViewSet, basename='alert')
router.register(r'notifications', views.AlertNotificationViewSet, basename='notification')
router.register(r'job-alerts', views.JobAlertViewSet, basename='jobalert')
router.register(r'job-alert-matches', views.JobAlertMatchViewSet, basename='jobalertmatch')
router.register(r'job-alert-stats', views.JobAlertStatsViewSet, basename='jobalertstats')

urlpatterns = [
    # Mark notification as read
    path('notifications/<int:pk>/read/', views.MarkNotificationReadView.as_view(), name='mark-notification-read'),
    
    # Include router URLs
    path('', include(router.urls)),
]