from django.db import models
from apps.authentication.models import User, Skill

class Company(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True)
    industry = models.CharField(max_length=100)
    size = models.CharField(max_length=50, choices=[
        ('startup', 'Startup'),
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large')
    ])
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class JobListing(models.Model):
    title = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='job_listings')
    description = models.TextField()
    requirements = models.TextField()
    benefits = models.TextField(blank=True)
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=100)
    job_type = models.CharField(max_length=50, choices=[
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship')
    ])
    experience_level = models.CharField(max_length=50, choices=[
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior Level'),
        ('executive', 'Executive')
    ])
    remote_option = models.CharField(max_length=50, choices=[
        ('on_site', 'On-site'),
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid')
    ])
    posted_date = models.DateTimeField(auto_now_add=True)
    application_deadline = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    view_count = models.IntegerField(default=0)
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='posted_jobs')

    def __str__(self):
        return f"{self.title} at {self.company.name}"

class JobSkillRequirement(models.Model):
    job = models.ForeignKey(JobListing, on_delete=models.CASCADE, related_name='skill_requirements')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    is_required = models.BooleanField(default=True)
    proficiency_level = models.IntegerField(choices=[
        (1, 'Beginner'),
        (2, 'Intermediate'),
        (3, 'Advanced'),
        (4, 'Expert')
    ])

    class Meta:
        unique_together = ('job', 'skill')
