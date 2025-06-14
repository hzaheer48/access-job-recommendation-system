from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    user_type = models.CharField(
        max_length=20,
        choices=[
            ('job_seeker', 'Job Seeker'),
            ('admin', 'Admin')
        ],
        default='job_seeker'
    )
    is_verified = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    experience_level = models.CharField(
        max_length=50,
        choices=[
            ('entry', 'Entry Level'),
            ('mid', 'Mid Level'),
            ('senior', 'Senior Level'),
            ('executive', 'Executive')
        ],
        blank=True
    )
    profile_details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    # Profile visibility settings
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('private', 'Private'),
            ('connections', 'Connections Only')
        ],
        default='public'
    )
    show_email = models.BooleanField(default=False)
    show_phone = models.BooleanField(default=False)
    show_location = models.BooleanField(default=True)
    show_resume = models.BooleanField(default=True)
    show_social_links = models.BooleanField(default=True)
    show_experience = models.BooleanField(default=True)
    show_education = models.BooleanField(default=True)
    show_skills = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['user_type']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email

    def update_last_login(self):
        self.last_login = timezone.now()
        self.save(update_fields=['last_login'])

    def get_profile_completion_percentage(self):
        """Calculate profile completion percentage"""
        fields = [
            self.first_name, self.last_name, self.phone,
            self.location, self.bio, self.resume,
            self.linkedin_url, self.github_url
        ]
        completed = sum(1 for field in fields if field)
        return (completed / len(fields)) * 100

    def get_visible_profile_data(self, requesting_user=None):
        """Get profile data based on visibility settings"""
        if not requesting_user or requesting_user == self:
            return self.get_full_profile_data()
            
        if self.profile_visibility == 'private':
            return {'name': self.get_full_name()}
            
        if self.profile_visibility == 'connections':
            # TODO: Implement connection check
            return {'name': self.get_full_name()}
            
        data = {'name': self.get_full_name()}
        
        if self.show_email:
            data['email'] = self.email
        if self.show_phone:
            data['phone'] = self.phone
        if self.show_location:
            data['location'] = self.location
        if self.show_resume:
            data['resume'] = self.resume.url if self.resume else None
        if self.show_social_links:
            data['linkedin_url'] = self.linkedin_url
            data['github_url'] = self.github_url
            data['portfolio_url'] = self.portfolio_url
        if self.show_experience:
            data['experience'] = self.workexperience_set.all()
        if self.show_education:
            data['education'] = self.education_set.all()
        if self.show_skills:
            data['skills'] = self.userskill_set.all()
            
        return data

    def get_full_profile_data(self):
        """Get complete profile data"""
        return {
            'name': self.get_full_name(),
            'email': self.email,
            'phone': self.phone,
            'location': self.location,
            'bio': self.bio,
            'resume': self.resume.url if self.resume else None,
            'linkedin_url': self.linkedin_url,
            'github_url': self.github_url,
            'portfolio_url': self.portfolio_url,
            'experience': self.workexperience_set.all(),
            'education': self.education_set.all(),
            'skills': self.userskill_set.all(),
            'profile_visibility': self.profile_visibility,
            'show_email': self.show_email,
            'show_phone': self.show_phone,
            'show_location': self.show_location,
            'show_resume': self.show_resume,
            'show_social_links': self.show_social_links,
            'show_experience': self.show_experience,
            'show_education': self.show_education,
            'show_skills': self.show_skills
        }

    def add_resume_version(self, file_obj, parsed_data=None):
        """Add a new resume version"""
        # Get the next version number
        last_version = ResumeVersion.objects.filter(user=self).order_by('-version_number').first()
        version_number = (last_version.version_number + 1) if last_version else 1
        
        # Create new version
        version = ResumeVersion.objects.create(
            user=self,
            file=file_obj,
            version_number=version_number,
            is_current=True,
            parsed_data=parsed_data or {}
        )
        
        # Update current resume
        self.resume = file_obj
        self.save()
        
        return version
    
    def get_resume_versions(self):
        """Get all resume versions"""
        return self.resume_versions.all()
    
    def get_current_resume_version(self):
        """Get current resume version"""
        return self.resume_versions.filter(is_current=True).first()

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(
        max_length=50,
        choices=[
            ('technical', 'Technical'),
            ('soft', 'Soft Skills'),
            ('language', 'Language'),
            ('other', 'Other')
        ]
    )
    description = models.TextField(blank=True)
    aliases = models.JSONField(default=list, blank=True)  # Alternative names for the skill
    popularity_score = models.FloatField(default=0.0)  # Based on job market demand
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        
    def __str__(self):
        return self.name
        
    @classmethod
    def validate_skill_name(cls, name):
        """Validate and normalize skill name"""
        # First check exact match
        try:
            return cls.objects.get(name__iexact=name)
        except cls.DoesNotExist:
            # Check aliases
            try:
                return cls.objects.filter(aliases__icontains=name).first()
            except:
                return None
                
    @classmethod
    def suggest_skills(cls, partial_name, limit=5):
        """Suggest skills based on partial name"""
        return cls.objects.filter(
            models.Q(name__icontains=partial_name) |
            models.Q(aliases__icontains=partial_name)
        ).order_by('-popularity_score')[:limit]
        
    @classmethod
    def get_trending_skills(cls, category=None, limit=10):
        """Get trending skills based on popularity score"""
        queryset = cls.objects.all()
        if category:
            queryset = queryset.filter(category=category)
        return queryset.order_by('-popularity_score')[:limit]
        
    @classmethod
    def update_popularity_scores(cls):
        """Update popularity scores based on job market data"""
        # This would typically integrate with a job market API
        # For now, we'll use a simple algorithm based on user adoption
        for skill in cls.objects.all():
            user_count = UserSkill.objects.filter(skill=skill).count()
            skill.popularity_score = user_count
            skill.save()

class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='users')
    proficiency_level = models.IntegerField(
        choices=[(1, 'Beginner'), (2, 'Intermediate'), (3, 'Advanced'), (4, 'Expert')],
        validators=[MinValueValidator(1), MaxValueValidator(4)]
    )
    verified = models.BooleanField(default=False)  # Whether the skill has been verified
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_skills'
    )
    years_of_experience = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        validators=[MinValueValidator(0)],
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-proficiency_level', 'skill__name']
        unique_together = ['user', 'skill']
        
    def __str__(self):
        return f"{self.user.email} - {self.skill.name} ({self.get_proficiency_level_display()})"
        
    @classmethod
    def suggest_skills_for_user(cls, user, limit=5):
        """Suggest skills for a user based on their profile and job market trends"""
        # Get user's current skills
        current_skills = set(cls.objects.filter(user=user).values_list('skill__name', flat=True))
        
        # Get trending skills in user's field
        trending_skills = Skill.get_trending_skills(
            category='technical'  # This could be determined based on user's profile
        )
        
        # Filter out skills user already has
        suggested_skills = [
            skill for skill in trending_skills
            if skill.name not in current_skills
        ][:limit]
        
        return suggested_skills

class Education(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='education')
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=100)
    field_of_study = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    gpa = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(4)],
        null=True,
        blank=True
    )
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['user', 'start_date']),
            models.Index(fields=['institution']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.degree} at {self.institution}"

    def clean(self):
        if self.is_current and self.end_date:
            raise ValidationError("Current education cannot have an end date")
        if not self.is_current and not self.end_date:
            raise ValidationError("Non-current education must have an end date")

class WorkExperience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='work_experience')
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    location = models.CharField(max_length=100, blank=True)
    employment_type = models.CharField(
        max_length=50,
        choices=[
            ('full_time', 'Full Time'),
            ('part_time', 'Part Time'),
            ('contract', 'Contract'),
            ('internship', 'Internship'),
            ('freelance', 'Freelance')
        ],
        default='full_time'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['user', 'start_date']),
            models.Index(fields=['company']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.position} at {self.company}"

    def clean(self):
        if self.is_current and self.end_date:
            raise ValidationError("Current position cannot have an end date")
        if not self.is_current and not self.end_date:
            raise ValidationError("Non-current position must have an end date")

    def get_duration(self):
        """Calculate the duration of the work experience"""
        end = self.end_date or timezone.now().date()
        duration = end - self.start_date
        years = duration.days // 365
        months = (duration.days % 365) // 30
        return f"{years}y {months}m"

class ResumeVersion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resume_versions')
    file = models.FileField(upload_to='resumes/versions/')
    version_number = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_current = models.BooleanField(default=False)
    parsed_data = models.JSONField(default=dict, blank=True)  # Store parsed resume data
    
    class Meta:
        ordering = ['-version_number']
        unique_together = ['user', 'version_number']
        
    def save(self, *args, **kwargs):
        if self.is_current:
            # Set all other versions to not current
            ResumeVersion.objects.filter(user=self.user).update(is_current=False)
        super().save(*args, **kwargs)
