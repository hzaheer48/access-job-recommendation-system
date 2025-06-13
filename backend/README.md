# Job Recommendation System Backend

This is the backend API for the Job Recommendation System, built with Django and Django REST Framework.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd access-job-recommendation-system/backend
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the database**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser (admin)**
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to create an admin user.

## Running the Development Server

1. **Start the development server**
   ```bash
   python manage.py runserver
   ```
   The server will start at `http://127.0.0.1:8000/`

2. **Access the API endpoints**
   - API Root: `http://127.0.0.1:8000/api/`
   - Admin Interface: `http://127.0.0.1:8000/admin/`

## API Endpoints

### Authentication Required
All endpoints require authentication. Use the following endpoints for authentication:
- Login: `http://127.0.0.1:8000/api-auth/login/`
- Logout: `http://127.0.0.1:8000/api-auth/logout/`

### Available Endpoints

1. **Users**
   - List/Create Users: `GET/POST /api/users/`
   - User Details: `GET/PUT/DELETE /api/users/{id}/`
   - User Skills: `GET /api/users/{id}/skills/`

2. **Skills**
   - List/Create Skills: `GET/POST /api/skills/`
   - Skill Details: `GET/PUT/DELETE /api/skills/{id}/`

3. **User Skills**
   - List/Create User Skills: `GET/POST /api/user-skills/`
   - User Skill Details: `GET/PUT/DELETE /api/user-skills/{id}/`

4. **Jobs**
   - List/Create Jobs: `GET/POST /api/jobs/`
   - Job Details: `GET/PUT/DELETE /api/jobs/{id}/`
   - Filter Jobs: `GET /api/jobs/?title=developer&company=tech&location=new%20york`

5. **Job Skills**
   - List/Create Job Skills: `GET/POST /api/job-skills/`
   - Job Skill Details: `GET/PUT/DELETE /api/job-skills/{id}/`

6. **Applications**
   - List/Create Applications: `GET/POST /api/applications/`
   - Application Details: `GET/PUT/DELETE /api/applications/{id}/`

## Testing the API

You can test the API using tools like:
- [Postman](https://www.postman.com/)
- [cURL](https://curl.se/)
- [Django REST Framework's built-in browser interface](http://127.0.0.1:8000/api/)

Example cURL command:
```bash
# List all jobs
curl -H "Authorization: Token your-auth-token" http://127.0.0.1:8000/api/jobs/

# Create a new job
curl -X POST -H "Authorization: Token your-auth-token" \
     -H "Content-Type: application/json" \
     -d '{"title":"Software Developer","company_name":"Tech Corp","description":"Job description"}' \
     http://127.0.0.1:8000/api/jobs/
```

## Project Structure

```
backend/
├── applications/     # Job applications module
├── core/            # Project settings and configuration
├── jobs/            # Jobs module
├── users/           # Users and skills module
├── manage.py        # Django management script
├── requirements.txt # Project dependencies
└── README.md        # This file
```

## Common Issues and Solutions

1. **Database Migration Issues**
   ```bash
   # Reset migrations if needed
   python manage.py migrate --fake
   python manage.py migrate
   ```

2. **Port Already in Use**
   ```bash
   # Use a different port
   python manage.py runserver 8001
   ```

3. **Authentication Issues**
   - Ensure you're including the authentication token in your requests
   - Check if your token is expired
   - Verify you're using the correct credentials

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[Your License Here] 