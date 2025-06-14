from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Skill, UserSkill, Education, WorkExperience

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'user_type', 'is_verified', 'is_staff', 'date_joined')
    list_filter = ('user_type', 'is_verified', 'is_staff', 'is_active')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone', 'location', 'bio')}),
        ('Professional info', {'fields': ('resume', 'linkedin_url', 'github_url', 'portfolio_url', 'experience_level')}),
        ('Permissions', {'fields': ('user_type', 'is_verified', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'user_type'),
        }),
    )

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'created_at')
    list_filter = ('category',)
    search_fields = ('name', 'description')
    ordering = ('name',)

@admin.register(UserSkill)
class UserSkillAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill', 'proficiency_level', 'years_of_experience')
    list_filter = ('proficiency_level', 'skill__category')
    search_fields = ('user__email', 'skill__name')
    raw_id_fields = ('user', 'skill')

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('user', 'institution', 'degree', 'field_of_study', 'start_date', 'end_date', 'is_current')
    list_filter = ('is_current',)
    search_fields = ('user__email', 'institution', 'degree', 'field_of_study')
    raw_id_fields = ('user',)
    date_hierarchy = 'start_date'

@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'position', 'employment_type', 'start_date', 'end_date', 'is_current')
    list_filter = ('is_current', 'employment_type')
    search_fields = ('user__email', 'company', 'position')
    raw_id_fields = ('user',)
    date_hierarchy = 'start_date'
