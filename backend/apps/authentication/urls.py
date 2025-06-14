from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'skills', views.SkillViewSet, basename='skill')
router.register(r'user-skills', views.UserSkillViewSet, basename='userskill')
router.register(r'education', views.EducationViewSet, basename='education')
router.register(r'experience', views.WorkExperienceViewSet, basename='experience')

urlpatterns = [
    # Authentication endpoints
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('upload-resume/', views.ResumeUploadView.as_view(), name='upload-resume'),
    
    # Include router URLs
    path('', include(router.urls)),
]