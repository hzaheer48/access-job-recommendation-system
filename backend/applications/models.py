from django.db import models
from users.models import User
from jobs.models import Job

class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    cover_letter = models.TextField(blank=True, null=True)
    resume_snapshot_url = models.URLField(blank=True, null=True)
    date_applied = models.DateTimeField(auto_now_add=True)

# Create your models here.
