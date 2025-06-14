from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'jobs', views.JobListingViewSet, basename='job')
router.register(r'companies', views.CompanyViewSet, basename='company')
router.register(r'skill-requirements', views.JobSkillRequirementViewSet, basename='skill-requirement')

urlpatterns = [
    path('', include(router.urls)),
]