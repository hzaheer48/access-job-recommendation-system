from django.db import models
from apps.authentication.models import User
from apps.jobs.models import Job

class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    cover_letter = models.TextField(blank=True, null=True)
    resume_snapshot_url = models.URLField(blank=True, null=True)
    date_applied = models.DateTimeField(auto_now_add=True)

class Interview(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    scheduled_at = models.DateTimeField()
    interview_type = models.CharField(max_length=50)  # e.g., phone, onsite, video
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Interview for {self.application.user.email} - {self.application.job.title} at {self.scheduled_at}"

# Create your models here.
