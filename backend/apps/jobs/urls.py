from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobListingViewSet, CompanyViewSet, JobSkillRequirementViewSet, BookmarkViewSet, SavedSearchViewSet

router = DefaultRouter()
router.register(r'jobs', JobListingViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'skill-requirements', JobSkillRequirementViewSet)
router.register(r'bookmarks', BookmarkViewSet, basename='bookmark')
router.register(r'saved-searches', SavedSearchViewSet, basename='saved-search')

urlpatterns = [
    path('', include(router.urls)),
]