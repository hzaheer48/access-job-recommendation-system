from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/jobs/', include('apps.jobs.urls')),
    path('api/applications/', include('apps.applications.urls')),
    path('api/recommendations/', include('apps.recommendations.urls')),
    path('api/alerts/', include('apps.alerts.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/skills/', include('apps.skills.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
] 