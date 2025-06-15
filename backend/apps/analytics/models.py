from django.db import models
from apps.authentication.models import User
from apps.jobs.models import JobListing
from apps.applications.models import JobApplication

class SystemActivity(models.Model):
    ACTIVITY_TYPES = [
        ('user_registration', 'User Registration'),
        ('user_login', 'User Login'),
        ('job_posted', 'Job Posted'),
        ('job_updated', 'Job Updated'),
        ('application_submitted', 'Application Submitted'),
        ('application_updated', 'Application Updated'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('search_performed', 'Search Performed'),
        ('skill_assessment_completed', 'Skill Assessment Completed'),
        ('system_error', 'System Error'),
    ]

    type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'System Activities'

    def __str__(self):
        return f"{self.type} - {self.timestamp}"

class DashboardMetrics(models.Model):
    date = models.DateField(unique=True)
    total_users = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    total_jobs = models.IntegerField(default=0)
    active_jobs = models.IntegerField(default=0)
    total_applications = models.IntegerField(default=0)
    applications_by_status = models.JSONField(default=dict)
    top_search_queries = models.JSONField(default=list)
    popular_job_categories = models.JSONField(default=list)
    system_performance = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = 'Dashboard Metrics'

    def __str__(self):
        return f"Dashboard Metrics for {self.date}"

class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=50)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)
    session_id = models.CharField(max_length=100, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'User Activities'

    def __str__(self):
        return f"{self.user.email} - {self.activity_type} - {self.timestamp}"

class ErrorLog(models.Model):
    ERROR_TYPES = [
        ('system', 'System Error'),
        ('application', 'Application Error'),
        ('security', 'Security Error'),
        ('performance', 'Performance Error'),
    ]

    type = models.CharField(max_length=50, choices=ERROR_TYPES)
    message = models.TextField()
    stack_trace = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)
    resolution_notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.type} - {self.timestamp}" 