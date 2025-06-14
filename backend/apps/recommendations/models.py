from django.db import models
from apps.authentication.models import User
from apps.jobs.models import JobListing

class JobMatch(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_matches')
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE)
    matchScore = models.FloatField()
    matchingSkills = models.JSONField()  # List of matching skills with scores
    missingSkills = models.JSONField()  # List of missing skills
    skillGaps = models.JSONField()  # Detailed skill gap analysis
    recommendations = models.JSONField()  # List of recommendations
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-matchScore']
        unique_together = ['user', 'job']

    def __str__(self):
        return f"Match for {self.user.email} - {self.job.title}"

class JobSimilarity(models.Model):
    job1 = models.ForeignKey(JobListing, on_delete=models.CASCADE, related_name='similarities_as_job1')
    job2 = models.ForeignKey(JobListing, on_delete=models.CASCADE, related_name='similarities_as_job2')
    similarityScore = models.FloatField()
    commonSkills = models.JSONField()  # List of common skills
    commonRequirements = models.JSONField()  # List of common requirements
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-similarityScore']
        unique_together = ['job1', 'job2']

    def __str__(self):
        return f"Similarity between {self.job1.title} and {self.job2.title}"

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
