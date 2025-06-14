from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.JobApplicationViewSet, basename='application')
router.register(r'interviews', views.InterviewViewSet, basename='interview')

urlpatterns = [
    # Application statistics
    path('stats/', views.ApplicationStatsView.as_view(), name='application-stats'),
    
    # Include router URLs
    path('', include(router.urls)),
]