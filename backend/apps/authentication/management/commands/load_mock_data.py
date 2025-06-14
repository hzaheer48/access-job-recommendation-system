from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.authentication.models import Skill, Education, WorkExperience
from apps.jobs.models import JobListing, Company, Bookmark, SavedSearch, JobSkillRequirement
from django.utils import timezone
from datetime import datetime
import json
from apps.applications.models import JobApplication, Interview
from apps.recommendations.models import JobRecommendation, SkillGapAnalysis
from apps.alerts.models import Alert
from apps.notifications.models import Notification, NotificationPreference
from apps.skills.models import SkillAssessment, AssessmentQuestion, LearningResource
from apps.analytics.models import SystemActivity, DashboardMetrics, UserActivity, ErrorLog

User = get_user_model()

class Command(BaseCommand):
    help = 'Loads mock data into the database'

    def handle(self, *args, **kwargs):
        self.stdout.write('Loading mock data...')

        # Create users
        user_data = {
            'john.doe@example.com': {
                'password': 'testpass123',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': 'job_seeker',
                'education': [
                    {
                        'degree': 'Bachelor of Science',
                        'field': 'Computer Science',
                        'institution': 'University of Technology',
                        'graduation_year': 2020
                    }
                ],
                'work_experience': [
                    {
                        'title': 'Software Developer',
                        'company': 'Tech Solutions Inc.',
                        'start_date': '2020-06-01',
                        'end_date': '2022-12-31',
                        'description': 'Full-stack development using React and Django'
                    }
                ]
            },
            'jane.smith@example.com': {
                'password': 'testpass123',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'role': 'recruiter',
                'company': 'Tech Solutions Inc.'
            }
        }

        users = {}
        for email, data in user_data.items():
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'role': data['role']
                }
            )
            if created:
                user.set_password(data['password'])
                user.save()
                self.stdout.write(f'Created user: {email}')
            users[email] = user

        # Create skills
        skills_data = [
            'Python', 'JavaScript', 'React', 'Django', 'Node.js',
            'SQL', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning'
        ]

        skills = {}
        for skill_name in skills_data:
            skill, created = Skill.objects.get_or_create(name=skill_name)
            if created:
                self.stdout.write(f'Created skill: {skill_name}')
            skills[skill_name] = skill

        # Create companies
        companies_data = [
            {
                'name': 'Tech Solutions Inc.',
                'description': 'A leading technology company',
                'industry': 'Technology',
                'location': 'New York, NY',
                'website': 'https://techsolutions.com'
            },
            {
                'name': 'Innovative Systems',
                'description': 'Innovative software solutions',
                'industry': 'Software',
                'location': 'San Francisco, CA',
                'website': 'https://innovativesystems.com'
            }
        ]

        companies = {}
        for company_data in companies_data:
            company, created = Company.objects.get_or_create(
                name=company_data['name'],
                defaults=company_data
            )
            if created:
                self.stdout.write(f'Created company: {company_data["name"]}')
            companies[company_data['name']] = company

        # Create job listings
        jobs_data = [
            {
                'title': 'Senior Full Stack Developer',
                'company': 'Tech Solutions Inc.',
                'description': 'Looking for an experienced full stack developer',
                'requirements': '5+ years of experience with React and Django',
                'location': 'New York, NY',
                'salary_min': 120000,
                'salary_max': 150000,
                'job_type': 'full_time',
                'skills': ['Python', 'JavaScript', 'React', 'Django']
            },
            {
                'title': 'Frontend Developer',
                'company': 'Innovative Systems',
                'description': 'Join our frontend team',
                'requirements': '3+ years of React experience',
                'location': 'San Francisco, CA',
                'salary_min': 90000,
                'salary_max': 120000,
                'job_type': 'full_time',
                'skills': ['JavaScript', 'React']
            }
        ]

        jobs = {}
        for job_data in jobs_data:
            company = companies[job_data['company']]
            job, created = JobListing.objects.get_or_create(
                title=job_data['title'],
                company=company,
                defaults={
                    'description': job_data['description'],
                    'requirements': job_data['requirements'],
                    'location': job_data['location'],
                    'salary_min': job_data['salary_min'],
                    'salary_max': job_data['salary_max'],
                    'job_type': job_data['job_type'],
                    'posted_by': users['jane.smith@example.com']
                }
            )
            if created:
                for skill_name in job_data['skills']:
                    JobSkillRequirement.objects.create(
                        job=job,
                        skill=skills[skill_name],
                        is_required=True,
                        proficiency_level=3
                    )
                self.stdout.write(f'Created job: {job_data["title"]}')
            jobs[job_data['title']] = job

        # Create job applications
        application, created = JobApplication.objects.get_or_create(
            user=users['john.doe@example.com'],
            job=jobs['Senior Full Stack Developer'],
            defaults={
                'status': 'applied',
                'cover_letter': 'I am very interested in this position.',
                'resume': 'resume.pdf'
            }
        )
        if created:
            self.stdout.write(f'Created application for {jobs["Senior Full Stack Developer"].title}')

        # Create recommendations
        recommendation, created = JobRecommendation.objects.get_or_create(
            user=users['john.doe@example.com'],
            job=jobs['Senior Full Stack Developer'],
            defaults={
                'match_score': 85,
                'reason': 'Strong match with your skills and experience'
            }
        )
        if created:
            self.stdout.write(f'Created recommendation for {jobs["Senior Full Stack Developer"].title}')

        # Skill Gap Analysis
        analysis_data = {
            'target_job_title': 'Senior Full Stack Developer',
            'missing_skills': [
                {'name': 'PostgreSQL', 'importance': 'critical'},
                {'name': 'AWS', 'importance': 'high'}
            ],
            'learning_resources': [
                {'title': 'PostgreSQL for Beginners', 'url': 'https://example.com/postgresql'},
                {'title': 'AWS Fundamentals', 'url': 'https://example.com/aws'}
            ]
        }
        user = User.objects.get(email='john.doe@example.com')
        analysis, created = SkillGapAnalysis.objects.get_or_create(
            user=user,
            target_job_title=analysis_data['target_job_title'],
            defaults={
                'missing_skills': analysis_data['missing_skills'],
                'learning_resources': analysis_data['learning_resources']
            }
        )
        if created:
            self.stdout.write(f'Created skill gap analysis for {analysis_data["target_job_title"]}')

        # Create alerts
        alert, created = Alert.objects.get_or_create(
            user=user,
            keywords='Python, Django',
            location_filter='New York',
            frequency='daily',
            last_sent=timezone.now()
        )
        if created:
            self.stdout.write(f'Created alert for {user.email}')

        # Create bookmarks
        bookmarks_data = [
            {
                'user': 'john.doe@example.com',
                'job': 'Senior Full Stack Developer',
                'notes': 'Interesting position with good benefits'
            }
        ]

        for bookmark_data in bookmarks_data:
            user = users[bookmark_data['user']]
            job = jobs[bookmark_data['job']]
            bookmark, created = Bookmark.objects.get_or_create(
                user=user,
                job=job,
                defaults={'notes': bookmark_data['notes']}
            )
            if created:
                self.stdout.write(f'Created bookmark for {bookmark_data["job"]}')

        # Create saved searches
        saved_searches_data = [
            {
                'user': 'john.doe@example.com',
                'name': 'Python Jobs',
                'criteria': {
                    'keywords': ['Python', 'Django'],
                    'location': 'New York',
                    'employment_type': 'Full-time'
                }
            }
        ]

        for search_data in saved_searches_data:
            user = users[search_data['user']]
            saved_search, created = SavedSearch.objects.get_or_create(
                user=user,
                name=search_data['name'],
                defaults={
                    'criteria': search_data['criteria'],
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(f'Created saved search: {search_data["name"]}')

        # Create notifications
        notifications_data = [
            {
                'user': 'john.doe@example.com',
                'type': 'application_status',
                'title': 'Application Status Updated',
                'message': 'Your application for Senior Full Stack Developer has been reviewed',
                'related_job': 'Senior Full Stack Developer'
            }
        ]

        for notification_data in notifications_data:
            user = users[notification_data['user']]
            job = jobs[notification_data['related_job']]
            notification, created = Notification.objects.get_or_create(
                user=user,
                type=notification_data['type'],
                title=notification_data['title'],
                defaults={
                    'message': notification_data['message'],
                    'job': job,
                    'is_read': False
                }
            )
            if created:
                self.stdout.write(f'Created notification: {notification_data["title"]}')

        # Create notification preferences
        for user in users.values():
            pref, created = NotificationPreference.objects.get_or_create(
                user=user,
                defaults={
                    'email_notifications': True,
                    'push_notifications': True,
                    'job_matches': True,
                    'application_updates': True,
                    'interview_reminders': True,
                    'job_alerts': True,
                    'system_notifications': True
                }
            )
            if created:
                self.stdout.write(f'Created notification preferences for {user.email}')

        # Load Skills
        skills = [
            'JavaScript', 'React', 'Node.js', 'Python', 'SQL',
            'TypeScript', 'CSS', 'HTML', 'AWS', 'Docker',
            'Kubernetes', 'PostgreSQL', 'MongoDB', 'Git',
            'REST API', 'GraphQL', 'Redux', 'Vue.js', 'Angular',
            'Django', 'Flask', 'FastAPI', 'Express.js', 'Next.js'
        ]

        for skill_name in skills:
            skill, created = Skill.objects.get_or_create(name=skill_name, defaults={'category': 'technical'})
            if created:
                self.stdout.write(f'Created skill: {skill_name}')

        # === Load Education and Work Experience for Users ===
        # Only for users with profile data in mockUsers
        user_profiles = {
            'john.doe@example.com': {
                'education': [
                    {
                        'institution': 'University of Technology',
                        'degree': 'Bachelor of Science',
                        'field_of_study': 'Computer Science',
                        'start_date': '2018-09-01',
                        'end_date': '2022-05-15',
                        'gpa': 3.8
                    }
                ],
                'work_experience': [
                    {
                        'company': 'Tech Startup Inc.',
                        'position': 'Frontend Developer',
                        'description': 'Developed responsive web applications using React and TypeScript',
                        'start_date': '2022-06-01',
                        'end_date': '2023-12-31',
                        'location': 'San Francisco, CA',
                        'employment_type': 'full_time'
                    }
                ]
            }
        }
        for email, profile in user_profiles.items():
            try:
                user = User.objects.get(email=email)
                for edu in profile['education']:
                    Education.objects.get_or_create(
                        user=user,
                        institution=edu['institution'],
                        degree=edu['degree'],
                        field_of_study=edu['field_of_study'],
                        start_date=edu['start_date'],
                        end_date=edu['end_date'],
                        gpa=edu['gpa']
                    )
                for exp in profile['work_experience']:
                    WorkExperience.objects.get_or_create(
                        user=user,
                        company=exp['company'],
                        position=exp['position'],
                        description=exp['description'],
                        start_date=exp['start_date'],
                        end_date=exp['end_date'],
                        location=exp['location'],
                        employment_type=exp['employment_type']
                    )
                self.stdout.write(f'Loaded education and work experience for {email}')
            except User.DoesNotExist:
                self.stdout.write(f'User {email} not found for profile loading')

        # === Load Applications and Interviews ===
        applications_data = [
            {
                'user_email': 'john.doe@example.com',
                'job_title': 'Senior Full Stack Developer',
                'cover_letter': 'I am excited to apply for the Senior Full Stack Developer position...',
                'status': 'reviewed',
                'applied_date': '2024-01-19T15:30:00Z',
                'notes': 'Really interested in this role',
                'interviews': [
                    {
                        'interview_type': 'phone',
                        'scheduled_date': '2024-01-25T10:00:00Z',
                        'duration_minutes': 30,
                        'interviewer_name': 'Recruiter',
                        'notes': 'Initial screening call'
                    }
                ]
            },
            {
                'user_email': 'john.doe@example.com',
                'job_title': 'Frontend Developer',
                'cover_letter': '',
                'status': 'applied',
                'applied_date': '2024-01-21T09:15:00Z',
                'notes': 'Applied after seeing on job board',
                'interviews': []
            }
        ]
        for app in applications_data:
            try:
                user = User.objects.get(email=app['user_email'])
                job = jobs[app['job_title']]
                application, created = JobApplication.objects.get_or_create(
                    job=job,
                    user=user,
                    defaults={
                        'cover_letter': app['cover_letter'],
                        'status': app['status'],
                        'applied_date': app['applied_date'],
                        'notes': app['notes']
                    }
                )
                for interview in app['interviews']:
                    Interview.objects.get_or_create(
                        application=application,
                        interview_type=interview['interview_type'],
                        scheduled_date=interview['scheduled_date'],
                        duration_minutes=interview['duration_minutes'],
                        interviewer_name=interview['interviewer_name'],
                        notes=interview['notes']
                    )
                self.stdout.write(f'Loaded application for {user.email} to {job.title}')
            except Exception as e:
                self.stdout.write(f'Error loading application: {e}')

        # === Load Recommendations and Skill Gap Analysis ===
        recommendations_data = [
            {
                'user_email': 'john.doe@example.com',
                'job_title': 'Senior Full Stack Developer',
                'score': 0.95,
                'reason': 'Strong match for JavaScript and React skills',
            },
            {
                'user_email': 'john.doe@example.com',
                'job_title': 'Frontend Developer',
                'score': 0.88,
                'reason': 'Perfect match for React and TypeScript skills',
            }
        ]
        for rec in recommendations_data:
            try:
                user = User.objects.get(email=rec['user_email'])
                job = jobs[rec['job_title']]
                JobRecommendation.objects.get_or_create(
                    user=user,
                    job=job,
                    defaults={
                        'match_score': rec['score'],
                        'reason': rec['reason']
                    }
                )
                self.stdout.write(f'Loaded recommendation for {user.email} to {job.title}')
            except Exception as e:
                self.stdout.write(f'Error loading recommendation: {e}')

        # === Load Alerts (basic fields only) ===
        alerts_data = [
            {
                'user_email': 'john.doe@example.com',
                'keywords': 'full stack, developer',
                'location_filter': 'San Francisco',
                'frequency': 'daily',
                'last_sent': '2024-01-22T08:00:00Z'
            },
            {
                'user_email': 'john.doe@example.com',
                'keywords': 'react, frontend',
                'location_filter': 'Remote',
                'frequency': 'weekly',
                'last_sent': None
            }
        ]
        for alert in alerts_data:
            try:
                user = User.objects.get(email=alert['user_email'])
                Alert.objects.get_or_create(
                    user=user,
                    keywords=alert['keywords'],
                    location_filter=alert['location_filter'],
                    frequency=alert['frequency'],
                    last_sent=alert['last_sent']
                )
                self.stdout.write(f'Loaded alert for {user.email}')
            except Exception as e:
                self.stdout.write(f'Error loading alert: {e}')

        # === Skipped: Bookmarks, Saved Searches, Admin/Analytics, Skill Assessment, Notifications ===
        # No corresponding Django models found for these types. Skipping.

        self.stdout.write(self.style.SUCCESS('Successfully loaded mock data')) 