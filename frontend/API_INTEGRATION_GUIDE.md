# API Integration Guide

This guide provides comprehensive documentation for integrating the backend API endpoints into the frontend React application.

## Table of Contents

1. [API Configuration](#api-configuration)
2. [Authentication](#authentication)
3. [API Endpoints Overview](#api-endpoints-overview)
4. [Using API Hooks](#using-api-hooks)
5. [Error Handling](#error-handling)
6. [Examples](#examples)
7. [Best Practices](#best-practices)

## API Configuration

The API is configured in `src/services/api.ts` with the following base URL:

```typescript
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1'
```

### Environment Variables

Create a `.env` file in the frontend root directory:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## Authentication

### JWT Token Management

The API uses JWT tokens for authentication. Tokens are automatically:
- Added to request headers via interceptors
- Refreshed when expired
- Stored in localStorage

### Authentication Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/token/` | POST | Get JWT token |
| `/auth/token/refresh/` | POST | Refresh JWT token |
| `/auth/register/` | POST | User registration |
| `/auth/login/` | POST | User login |
| `/auth/logout/` | POST | User logout |
| `/auth/profile/` | GET/PUT | Get/Update user profile |
| `/auth/upload-resume/` | POST | Upload resume |
| `/auth/password-reset/` | POST | Request password reset |
| `/auth/password-reset/confirm/` | POST | Confirm password reset |
| `/auth/verify-email/` | POST | Request email verification |
| `/auth/verify-email/confirm/` | POST | Confirm email verification |

## API Endpoints Overview

### 1. Authentication & User Management

#### Users (`/auth/users/`)
- `GET /auth/users/` - List all users
- `POST /auth/users/` - Create new user
- `GET /auth/users/{id}/` - Get specific user
- `PUT /auth/users/{id}/` - Update user
- `PATCH /auth/users/{id}/` - Partial update user
- `DELETE /auth/users/{id}/` - Delete user

#### Skills (`/auth/skills/`)
- `GET /auth/skills/` - List all skills
- `POST /auth/skills/` - Create new skill
- `GET /auth/skills/{id}/` - Get specific skill
- `PUT /auth/skills/{id}/` - Update skill
- `DELETE /auth/skills/{id}/` - Delete skill

#### User Skills (`/auth/user-skills/`)
- `GET /auth/user-skills/` - List user skills
- `POST /auth/user-skills/` - Add user skill
- `GET /auth/user-skills/{id}/` - Get specific user skill
- `PUT /auth/user-skills/{id}/` - Update user skill
- `DELETE /auth/user-skills/{id}/` - Delete user skill

#### Education (`/auth/education/`)
- `GET /auth/education/` - List education records
- `POST /auth/education/` - Add education record
- `GET /auth/education/{id}/` - Get specific education record
- `PUT /auth/education/{id}/` - Update education record
- `DELETE /auth/education/{id}/` - Delete education record

#### Experience (`/auth/experience/`)
- `GET /auth/experience/` - List work experience
- `POST /auth/experience/` - Add work experience
- `GET /auth/experience/{id}/` - Get specific experience
- `PUT /auth/experience/{id}/` - Update experience
- `DELETE /auth/experience/{id}/` - Delete experience

### 2. Jobs Management

#### Jobs (`/jobs/jobs/`)
- `GET /jobs/jobs/` - List all jobs
- `POST /jobs/jobs/` - Create new job
- `GET /jobs/jobs/{id}/` - Get specific job
- `PUT /jobs/jobs/{id}/` - Update job
- `DELETE /jobs/jobs/{id}/` - Delete job

#### Companies (`/jobs/companies/`)
- `GET /jobs/companies/` - List all companies
- `POST /jobs/companies/` - Create new company
- `GET /jobs/companies/{id}/` - Get specific company
- `PUT /jobs/companies/{id}/` - Update company
- `DELETE /jobs/companies/{id}/` - Delete company

#### Skill Requirements (`/jobs/skill-requirements/`)
- `GET /jobs/skill-requirements/` - List skill requirements
- `POST /jobs/skill-requirements/` - Create skill requirement
- `GET /jobs/skill-requirements/{id}/` - Get specific requirement
- `PUT /jobs/skill-requirements/{id}/` - Update requirement
- `DELETE /jobs/skill-requirements/{id}/` - Delete requirement

### 3. Applications Management

#### Applications (`/applications/`)
- `GET /applications/` - List all applications
- `POST /applications/` - Create new application
- `GET /applications/{id}/` - Get specific application
- `PUT /applications/{id}/` - Update application
- `DELETE /applications/{id}/` - Delete application
- `GET /applications/stats/` - Get application statistics

#### Interviews (`/applications/interviews/`)
- `GET /applications/interviews/` - List all interviews
- `POST /applications/interviews/` - Create new interview
- `GET /applications/interviews/{id}/` - Get specific interview
- `PUT /applications/interviews/{id}/` - Update interview
- `DELETE /applications/interviews/{id}/` - Delete interview

### 4. Recommendations

#### Recommendations (`/recommendations/`)
- `GET /recommendations/` - List recommendations
- `POST /recommendations/` - Create recommendation
- `GET /recommendations/{id}/` - Get specific recommendation
- `PUT /recommendations/{id}/` - Update recommendation
- `DELETE /recommendations/{id}/` - Delete recommendation
- `POST /recommendations/feedback/` - Submit feedback
- `GET /recommendations/skill-gaps/` - Get skill gap analysis
- `GET /recommendations/explain/{job_id}/` - Get recommendation explanation
- `POST /recommendations/retrain/` - Retrain ML model

### 5. Alerts & Notifications

#### Alerts (`/alerts/`)
- `GET /alerts/` - List all alerts
- `POST /alerts/` - Create new alert
- `GET /alerts/{id}/` - Get specific alert
- `PUT /alerts/{id}/` - Update alert
- `DELETE /alerts/{id}/` - Delete alert

#### Notifications (`/alerts/notifications/`)
- `GET /alerts/notifications/` - List notifications
- `POST /alerts/notifications/` - Create notification
- `GET /alerts/notifications/{id}/` - Get specific notification
- `PUT /alerts/notifications/{id}/` - Update notification
- `DELETE /alerts/notifications/{id}/` - Delete notification
- `POST /alerts/notifications/{id}/read/` - Mark notification as read

### 6. Analytics (Admin Only)

- `GET /analytics/dashboard/` - Dashboard metrics
- `GET /analytics/users/` - User management data
- `POST /analytics/users/{id}/status/` - Update user status
- `GET /analytics/jobs/pending/` - Pending jobs
- `POST /analytics/jobs/{id}/approve/` - Approve job
- `GET /analytics/analytics/` - Detailed analytics
- `GET /analytics/system-logs/` - System logs

## Using API Hooks

The `apiHooks.ts` file provides React hooks for easy API integration:

### Basic Usage

```typescript
import { useAuth, useJobs, useApplications } from '../services/apiHooks';

function MyComponent() {
  const { login, getProfile } = useAuth();
  const { getJobs } = useJobs();
  const { createApplication } = useApplications();

  // Login user
  const handleLogin = async (credentials) => {
    try {
      const result = await login.execute(credentials);
      console.log('Login successful:', result);
    } catch (error) {
      console.error('Login failed:', login.error);
    }
  };

  // Fetch jobs
  const handleFetchJobs = async () => {
    try {
      const jobs = await getJobs.execute({ page: 1, page_size: 10 });
      console.log('Jobs:', jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', getJobs.error);
    }
  };

  return (
    <div>
      {login.loading && <p>Logging in...</p>}
      {getJobs.loading && <p>Loading jobs...</p>}
      {/* Your component JSX */}
    </div>
  );
}
```

### Using Fetch Hook

```typescript
import { useFetch } from '../services/apiHooks';
import { jobsAPI } from '../services/api';

function JobsList() {
  const { data: jobs, loading, error } = useFetch(jobsAPI.getJobs);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {jobs?.map(job => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
}
```

### Using Pagination Hook

```typescript
import { usePagination } from '../services/apiHooks';
import { jobsAPI } from '../services/api';

function InfiniteJobsList() {
  const {
    data: jobs,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  } = usePagination(jobsAPI.getJobs);

  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>{job.title}</div>
      ))}
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

## Error Handling

### Global Error Handling

The API interceptor automatically handles:
- Token refresh on 401 errors
- Redirects to login on refresh failure

### Component-Level Error Handling

```typescript
const { data, loading, error, execute } = useApiCall(someAPI.someMethod);

const handleSubmit = async (formData) => {
  try {
    await execute(formData);
    // Success handling
  } catch (err) {
    // Error is also available in the error state
    console.error('Operation failed:', error);
  }
};
```

## Examples

### 1. User Registration

```typescript
import { useAuth } from '../services/apiHooks';

function RegisterForm() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register.execute(formData);
      // Redirect to login or dashboard
    } catch (error) {
      // Handle registration error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={register.loading}>
        {register.loading ? 'Registering...' : 'Register'}
      </button>
      {register.error && <p className="error">{register.error}</p>}
    </form>
  );
}
```

### 2. Job Application

```typescript
import { useApplications } from '../services/apiHooks';

function ApplyToJob({ jobId }) {
  const { createApplication } = useApplications();

  const handleApply = async () => {
    try {
      await createApplication.execute({
        job_id: jobId,
        cover_letter: 'My cover letter...',
        status: 'applied'
      });
      // Show success message
    } catch (error) {
      // Handle application error
    }
  };

  return (
    <button onClick={handleApply} disabled={createApplication.loading}>
      {createApplication.loading ? 'Applying...' : 'Apply Now'}
    </button>
  );
}
```

### 3. Skills Management

```typescript
import { useSkills } from '../services/apiHooks';

function SkillsManager() {
  const { getUserSkills, addUserSkill, deleteUserSkill } = useSkills();
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const userSkills = await getUserSkills.execute();
        setSkills(userSkills);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      }
    };
    fetchSkills();
  }, []);

  const handleAddSkill = async (skillData) => {
    try {
      const newSkill = await addUserSkill.execute(skillData);
      setSkills([...skills, newSkill]);
    } catch (error) {
      console.error('Failed to add skill:', error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await deleteUserSkill.execute(skillId);
      setSkills(skills.filter(skill => skill.id !== skillId));
    } catch (error) {
      console.error('Failed to delete skill:', error);
    }
  };

  return (
    <div>
      {/* Skills list and management UI */}
    </div>
  );
}
```

## Best Practices

### 1. Environment Configuration
- Always use environment variables for API URLs
- Have different configurations for development, staging, and production

### 2. Error Handling
- Always handle errors at the component level
- Provide user-friendly error messages
- Log errors for debugging

### 3. Loading States
- Show loading indicators during API calls
- Disable buttons/forms during submission
- Provide feedback for long-running operations

### 4. Data Management
- Use React Query or SWR for advanced caching and synchronization
- Implement optimistic updates where appropriate
- Cache frequently accessed data

### 5. Security
- Never store sensitive data in localStorage
- Validate all user inputs
- Handle token expiration gracefully

### 6. Performance
- Implement pagination for large datasets
- Use debouncing for search functionality
- Lazy load components and data when possible

### 7. Testing
- Mock API calls in tests
- Test error scenarios
- Test loading states

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS settings allow frontend domain
2. **401 Unauthorized**: Check token validity and refresh logic
3. **Network Errors**: Verify API URL and network connectivity
4. **Validation Errors**: Check request data format and required fields

### Debug Tips

1. Use browser dev tools to inspect network requests
2. Check console for error messages
3. Verify API responses match expected format
4. Test API endpoints directly using tools like Postman

This integration guide provides a comprehensive foundation for connecting your React frontend with the Django backend API. Follow the patterns and examples provided to ensure consistent and reliable API integration throughout your application.