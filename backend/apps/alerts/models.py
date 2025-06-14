from django.db import models
from apps.authentication.models import User
from apps.jobs.models import JobListing

class JobAlert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_alerts')
    name = models.CharField(max_length=200)
    criteria = models.JSONField()  # Stores detailed search criteria
    frequency = models.CharField(max_length=50, choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly')
    ])
    status = models.CharField(max_length=50, choices=[
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('deleted', 'Deleted')
    ], default='active')
    lastSent = models.DateTimeField(null=True, blank=True)
    nextScheduled = models.DateTimeField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-createdAt']

    def __str__(self):
        return f"{self.user.email} - {self.name}"

class JobAlertMatch(models.Model):
    alert = models.ForeignKey(JobAlert, on_delete=models.CASCADE, related_name='matches')
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    matchScore = models.FloatField()
    matchReasons = models.JSONField()  # List of reasons why the job matches
    status = models.CharField(max_length=50, choices=[
        ('new', 'New'),
        ('viewed', 'Viewed'),
        ('applied', 'Applied'),
        ('ignored', 'Ignored')
    ], default='new')
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-matchScore']
        unique_together = ['alert', 'job']

    def __str__(self):
        return f"Match for {self.alert.name} - {self.job.title}"

class JobAlertStats(models.Model):
    alert = models.ForeignKey(JobAlert, on_delete=models.CASCADE, related_name='stats')
    totalAlerts = models.IntegerField(default=0)
    activeAlerts = models.IntegerField(default=0)
    matchesByFrequency = models.JSONField(default=dict)  # Counts by frequency
    matchesByStatus = models.JSONField(default=dict)  # Counts by status
    lastUpdated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-lastUpdated']

    def __str__(self):
        return f"Stats for {self.alert.name}"

# Keep the existing Alert model for backward compatibility
class Alert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    keywords = models.CharField(max_length=200)
    location_filter = models.CharField(max_length=100, blank=True, null=True)
    frequency = models.CharField(max_length=50)
    last_sent = models.DateTimeField(blank=True, null=True)

# Create your models here.
