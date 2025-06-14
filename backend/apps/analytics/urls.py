from django.urls import path
from . import views

urlpatterns = [
    # Admin dashboard and analytics
    path('dashboard/', views.DashboardMetricsView.as_view(), name='dashboard'),
    path('users/', views.UserManagementView.as_view(), name='user-management'),
    path('users/<int:pk>/status/', views.UpdateUserStatusView.as_view(), name='update-user-status'),
    path('jobs/pending/', views.PendingJobsView.as_view(), name='pending-jobs'),
    path('jobs/<int:pk>/approve/', views.ApproveJobView.as_view(), name='approve-job'),
    path('analytics/', views.DetailedAnalyticsView.as_view(), name='detailed-analytics'),
    path('system-logs/', views.SystemLogsView.as_view(), name='system-logs'),
]