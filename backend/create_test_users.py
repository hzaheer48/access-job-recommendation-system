#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.authentication.models import User

def create_test_users():
    """Create test users for development and testing."""
    
    # Create a job seeker user
    job_seeker, created = User.objects.get_or_create(
        email='jobseeker@example.com',
        defaults={
            'username': 'jobseeker',
            'first_name': 'John',
            'last_name': 'Doe',
            'user_type': 'job_seeker',
            'is_active': True,
            'is_verified': True,
            'phone': '+1234567890',
            'location': 'New York, NY',
            'bio': 'Experienced software developer looking for new opportunities.',
            'experience_level': 'mid',
        }
    )
    if created:
        job_seeker.set_password('password123')
        job_seeker.save()
        print(f"Created job seeker user: {job_seeker.email}")
    else:
        print(f"Job seeker user already exists: {job_seeker.email}")
    
    # Create an admin user
    admin_user, created = User.objects.get_or_create(
        email='admin@example.com',
        defaults={
            'username': 'admin',
            'first_name': 'Admin',
            'last_name': 'User',
            'user_type': 'admin',
            'is_active': True,
            'is_verified': True,
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin_user.set_password('password123')
        admin_user.save()
        print(f"Created admin user: {admin_user.email}")
    else:
        print(f"Admin user already exists: {admin_user.email}")
    
    # Create another job seeker for testing
    job_seeker2, created = User.objects.get_or_create(
        email='jane@example.com',
        defaults={
            'username': 'jane_smith',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'user_type': 'job_seeker',
            'is_active': True,
            'is_verified': True,
            'phone': '+1987654321',
            'location': 'San Francisco, CA',
            'bio': 'Frontend developer with 3 years of experience in React.',
            'experience_level': 'mid',
        }
    )
    if created:
        job_seeker2.set_password('password123')
        job_seeker2.save()
        print(f"Created job seeker user: {job_seeker2.email}")
    else:
        print(f"Job seeker user already exists: {job_seeker2.email}")
    
    print("\n=== Test Users Created ===")
    print("Job Seeker 1:")
    print(f"  Email: {job_seeker.email}")
    print(f"  Password: password123")
    print(f"  Type: {job_seeker.user_type}")
    
    print("\nJob Seeker 2:")
    print(f"  Email: {job_seeker2.email}")
    print(f"  Password: password123")
    print(f"  Type: {job_seeker2.user_type}")
    
    print("\nAdmin User:")
    print(f"  Email: {admin_user.email}")
    print(f"  Password: password123")
    print(f"  Type: {admin_user.user_type}")
    print(f"  Is Staff: {admin_user.is_staff}")
    print(f"  Is Superuser: {admin_user.is_superuser}")
    
    print("\nYou can now use these credentials to test the login functionality.")

if __name__ == '__main__':
    create_test_users()