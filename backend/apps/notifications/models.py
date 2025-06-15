from django.db import models
from apps.authentication.models import User
from apps.jobs.models import JobListing
from apps.applications.models import JobApplication

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('job_match', 'Job Match'),
        ('application_update', 'Application Update'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('alert', 'Job Alert'),
        ('system', 'System Notification'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional related objects
    job = models.ForeignKey(JobListing, on_delete=models.SET_NULL, null=True, blank=True)
    application = models.ForeignKey(JobApplication, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Additional data
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.type} - {self.title}"

class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    job_matches = models.BooleanField(default=True)
    application_updates = models.BooleanField(default=True)
    interview_reminders = models.BooleanField(default=True)
    job_alerts = models.BooleanField(default=True)
    system_notifications = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification preferences for {self.user.email}" 