from django.db import models
from apps.authentication.models import User
from apps.jobs.models import JobListing

class JobApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    cover_letter = models.TextField(blank=True)
    custom_resume = models.FileField(upload_to='application_resumes/', blank=True)
    status = models.CharField(choices=[
        ('applied', 'Applied'),
        ('reviewed', 'Under Review'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('interviewed', 'Interviewed'),
        ('offered', 'Offered'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn')
    ], default='applied')
    applied_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)

class ApplicationStatusHistory(models.Model):
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    changed_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

class Interview(models.Model):
    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE)
    interview_type = models.CharField(choices=[('phone', 'Phone'), ('video', 'Video'), ('in_person', 'In Person'), ('technical', 'Technical')])
    scheduled_date = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    interviewer_name = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    feedback = models.TextField(blank=True)

    def __str__(self):
        return f"Interview for {self.application.user.email} - {self.application.job.title} at {self.scheduled_date}"

# Create your models here.
