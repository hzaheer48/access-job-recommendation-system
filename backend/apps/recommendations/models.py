from django.db import models
from apps.authentication.models import User
from apps.jobs.models import JobListing

class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    score = models.FloatField()
    reason = models.TextField(blank=True, null=True)
    date_generated = models.DateTimeField(auto_now_add=True)

class UserJobInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    interaction_type = models.CharField(choices=[('view', 'View'), ('like', 'Like'), ('dislike', 'Dislike'), ('apply', 'Apply'), ('bookmark', 'Bookmark')])
    timestamp = models.DateTimeField(auto_now_add=True)

class JobRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    score = models.FloatField()  # Recommendation confidence score
    explanation = models.TextField()  # XAI explanation
    created_at = models.DateTimeField(auto_now_add=True)
    is_viewed = models.BooleanField(default=False)

class SkillGapAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    target_job_title = models.CharField(max_length=200)
    missing_skills = models.JSONField()  # List of skills with importance scores
    learning_resources = models.JSONField()  # Suggested courses/resources
    created_at = models.DateTimeField(auto_now_add=True)
