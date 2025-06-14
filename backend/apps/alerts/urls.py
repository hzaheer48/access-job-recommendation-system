from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.AlertViewSet, basename='alert')
router.register(r'notifications', views.AlertNotificationViewSet, basename='notification')

urlpatterns = [
    # Mark notification as read
    path('notifications/<int:pk>/read/', views.MarkNotificationReadView.as_view(), name='mark-notification-read'),
    
    # Include router URLs
    path('', include(router.urls)),
]