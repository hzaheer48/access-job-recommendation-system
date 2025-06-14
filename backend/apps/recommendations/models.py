from django.db import models
from apps.authentication.models import User
from apps.jobs.models import Job

class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    score = models.FloatField()
    reason = models.TextField(blank=True, null=True)
    date_generated = models.DateTimeField(auto_now_add=True)
