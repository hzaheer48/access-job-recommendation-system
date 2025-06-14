from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.authentication.models import User, Skill

class SkillAssessment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skill_assessments')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    level = models.CharField(max_length=50, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert')
    ])
    completed_at = models.DateTimeField(auto_now_add=True)
    time_spent = models.IntegerField(help_text='Time spent in minutes')
    questions_answered = models.IntegerField()
    correct_answers = models.IntegerField()

    class Meta:
        ordering = ['-completed_at']
        unique_together = ['user', 'skill']

    def __str__(self):
        return f"{self.user.email} - {self.skill.name} Assessment"

class AssessmentTemplate(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=50)
    difficulty = models.CharField(max_length=50, choices=[
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard')
    ])
    duration = models.IntegerField(help_text='Duration in minutes')
    tags = models.JSONField(default=list)
    questions = models.ManyToManyField('AssessmentQuestion', related_name='templates')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Assessment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessments')
    template = models.ForeignKey(AssessmentTemplate, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    status = models.CharField(max_length=50, choices=[
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed')
    ], default='pending')
    score = models.FloatField(null=True, blank=True)
    maxScore = models.FloatField()
    duration = models.IntegerField(help_text='Duration in minutes')
    startTime = models.DateTimeField(null=True, blank=True)
    endTime = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.type} Assessment"

class AssessmentQuestion(models.Model):
    question = models.TextField()
    type = models.CharField(max_length=50, choices=[
        ('multiple_choice', 'Multiple Choice'),
        ('text', 'Text'),
        ('code', 'Code')
    ])
    points = models.IntegerField(default=1)
    difficulty = models.CharField(max_length=50, choices=[
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard')
    ])
    category = models.CharField(max_length=100, default='General')
    options = models.JSONField(null=True, blank=True)
    correctAnswer = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'difficulty']

    def __str__(self):
        return f"{self.category} - {self.question[:50]}..."

class AssessmentResult(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='results')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.FloatField()
    maxScore = models.FloatField()
    percentage = models.FloatField()
    timeTaken = models.IntegerField(help_text='Time taken in minutes')
    answers = models.JSONField()  # Stores AssessmentAnswer objects
    feedback = models.JSONField()  # Stores feedback object with strengths, weaknesses, recommendations
    completedAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completedAt']

    def __str__(self):
        return f"{self.user.email} - {self.assessment.type} Result"

class AssessmentAnswer(models.Model):
    result = models.ForeignKey(AssessmentResult, on_delete=models.CASCADE, related_name='detailed_answers')
    questionId = models.CharField(max_length=100)
    answer = models.TextField()
    points = models.FloatField()
    isCorrect = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Answer for Question {self.questionId}"

class LearningResource(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='learning_resources')
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=[
        ('course', 'Course'),
        ('tutorial', 'Tutorial'),
        ('documentation', 'Documentation'),
        ('book', 'Book'),
        ('video', 'Video')
    ])
    url = models.URLField()
    provider = models.CharField(max_length=100)
    duration = models.CharField(max_length=50, help_text='e.g., "8 hours", "Self-paced"')
    difficulty = models.CharField(max_length=50, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ])
    cost = models.CharField(max_length=50, choices=[
        ('free', 'Free'),
        ('paid', 'Paid')
    ])
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['skill', 'difficulty', 'title']

    def __str__(self):
        return f"{self.title} - {self.skill.name}" 