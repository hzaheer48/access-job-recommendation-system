from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.JobViewSet, basename='job')
router.register(r'companies', views.CompanyViewSet, basename='company')

urlpatterns = [
    # Job search endpoints
    path('search/', views.JobSearchView.as_view(), name='job-search'),
    
    # Include router URLs
    path('', include(router.urls)),
]