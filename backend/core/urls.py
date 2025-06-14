"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from jobs.views import JobViewSet, JobSkillViewSet
from applications.views import ApplicationViewSet
from users.views import UserViewSet, SkillViewSet, UserSkillViewSet
from recommendations.views import RecommendationViewSet
from alerts.views import AlertViewSet

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'job-skills', JobSkillViewSet, basename='jobskill')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'users', UserViewSet, basename='user')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'user-skills', UserSkillViewSet, basename='userskill')
router.register(r'recommendations', RecommendationViewSet, basename='recommendation')
router.register(r'alerts', AlertViewSet, basename='alert')

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
