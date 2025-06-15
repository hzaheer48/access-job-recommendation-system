# Frontend API Integration

This document provides a complete guide for the frontend API integration with the Django backend for the Job Recommendation System.

## 🚀 Quick Start

### 1. Environment Setup

1. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your backend API URL:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api/v1
   ```

3. Install dependencies (if not already done):
   ```bash
   npm install
   ```

### 2. Basic Usage

```typescript
import { useAuth, useJobs } from './services/apiHooks';

function MyComponent() {
  const { login, getProfile } = useAuth();
  const { getJobs } = useJobs();
  
  // Use the hooks in your component
}
```

## 📁 File Structure

```
src/
├── services/
│   ├── api.ts              # Core API configuration and endpoints
│   ├── apiHooks.ts         # React hooks for API integration
│   └── index.ts            # Service exports
├── components/
│   └── examples/
│       └── ApiExamples.tsx # Example components
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🔧 API Configuration

### Core API Setup (`src/services/api.ts`)

The API is configured with:
- Automatic JWT token management
- Request/response interceptors
- Error handling
- Token refresh logic

```typescript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Available API Modules

1. **Authentication API** (`authAPI`)
2. **User Management API** (`userAPI`)
3. **Skills API** (`skillsAPI`)
4. **Education API** (`educationAPI`)
5. **Experience API** (`experienceAPI`)
6. **Jobs API** (`jobsAPI`)
7. **Applications API** (`applicationsAPI`)
8. **Alerts API** (`alertsAPI`)
9. **Recommendations API** (`recommendationsAPI`)
10. **Analytics API** (`analyticsAPI`)

## 🎣 React Hooks

### Basic Hook Usage

```typescript
import { useAuth } from '../services/apiHooks';

function LoginComponent() {
  const { login } = useAuth();
  
  const handleLogin = async (credentials) => {
    try {
      const result = await login.execute(credentials);
      // Handle success
    } catch (error) {
      // Handle error (also available in login.error)
    }
  };
  
  return (
    <button 
      onClick={() => handleLogin({ email, password })}
      disabled={login.loading}
    >
      {login.loading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

### Available Hooks

- `useAuth()` - Authentication operations
- `useUsers()` - User management
- `useSkills()` - Skills management
- `useEducation()` - Education records
- `useExperience()` - Work experience
- `useJobs()` - Job listings
- `useApplications()` - Job applications
- `useAlerts()` - Alerts and notifications
- `useRecommendations()` - Job recommendations
- `useAnalytics()` - Analytics (admin only)

### Utility Hooks

- `useFetch()` - Fetch data on component mount
- `usePagination()` - Handle paginated data with infinite scroll
- `useApiCall()` - Generic API call hook

## 📋 Complete API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/token/` | Get JWT token |
| POST | `/auth/token/refresh/` | Refresh JWT token |
| POST | `/auth/register/` | User registration |
| POST | `/auth/login/` | User login |
| POST | `/auth/logout/` | User logout |
| GET | `/auth/profile/` | Get user profile |
| PUT | `/auth/profile/` | Update user profile |
| POST | `/auth/upload-resume/` | Upload resume |
| POST | `/auth/password-reset/` | Request password reset |
| POST | `/auth/password-reset/confirm/` | Confirm password reset |
| POST | `/auth/password-reset/validate-token/` | Validate reset token |
| POST | `/auth/verify-email/` | Request email verification |
| POST | `/auth/verify-email/confirm/` | Confirm email verification |

### User Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/users/` | List all users |
| POST | `/auth/users/` | Create new user |
| GET | `/auth/users/{id}/` | Get specific user |
| PUT | `/auth/users/{id}/` | Update user |
| PATCH | `/auth/users/{id}/` | Partial update user |
| DELETE | `/auth/users/{id}/` | Delete user |

### Skills Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/skills/` | List all skills |
| POST | `/auth/skills/` | Create new skill |
| GET | `/auth/skills/{id}/` | Get specific skill |
| PUT | `/auth/skills/{id}/` | Update skill |
| DELETE | `/auth/skills/{id}/` | Delete skill |
| GET | `/auth/user-skills/` | List user skills |
| POST | `/auth/user-skills/` | Add user skill |
| GET | `/auth/user-skills/{id}/` | Get specific user skill |
| PUT | `/auth/user-skills/{id}/` | Update user skill |
| DELETE | `/auth/user-skills/{id}/` | Delete user skill |

### Education Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/education/` | List education records |
| POST | `/auth/education/` | Add education record |
| GET | `/auth/education/{id}/` | Get specific education record |
| PUT | `/auth/education/{id}/` | Update education record |
| DELETE | `/auth/education/{id}/` | Delete education record |

### Experience Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/experience/` | List work experience |
| POST | `/auth/experience/` | Add work experience |
| GET | `/auth/experience/{id}/` | Get specific experience |
| PUT | `/auth/experience/{id}/` | Update experience |
| DELETE | `/auth/experience/{id}/` | Delete experience |

### Jobs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs/jobs/` | List all jobs |
| POST | `/jobs/jobs/` | Create new job |
| GET | `/jobs/jobs/{id}/` | Get specific job |
| PUT | `/jobs/jobs/{id}/` | Update job |
| DELETE | `/jobs/jobs/{id}/` | Delete job |
| GET | `/jobs/companies/` | List all companies |
| POST | `/jobs/companies/` | Create new company |
| GET | `/jobs/companies/{id}/` | Get specific company |
| PUT | `/jobs/companies/{id}/` | Update company |
| DELETE | `/jobs/companies/{id}/` | Delete company |
| GET | `/jobs/skill-requirements/` | List skill requirements |
| POST | `/jobs/skill-requirements/` | Create skill requirement |
| GET | `/jobs/skill-requirements/{id}/` | Get specific requirement |
| PUT | `/jobs/skill-requirements/{id}/` | Update requirement |
| DELETE | `/jobs/skill-requirements/{id}/` | Delete requirement |

### Applications Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/applications/` | List all applications |
| POST | `/applications/` | Create new application |
| GET | `/applications/{id}/` | Get specific application |
| PUT | `/applications/{id}/` | Update application |
| DELETE | `/applications/{id}/` | Delete application |
| GET | `/applications/stats/` | Get application statistics |
| GET | `/applications/interviews/` | List all interviews |
| POST | `/applications/interviews/` | Create new interview |
| GET | `/applications/interviews/{id}/` | Get specific interview |
| PUT | `/applications/interviews/{id}/` | Update interview |
| DELETE | `/applications/interviews/{id}/` | Delete interview |

### Recommendations Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recommendations/` | List recommendations |
| POST | `/recommendations/` | Create recommendation |
| GET | `/recommendations/{id}/` | Get specific recommendation |
| PUT | `/recommendations/{id}/` | Update recommendation |
| DELETE | `/recommendations/{id}/` | Delete recommendation |
| POST | `/recommendations/feedback/` | Submit feedback |
| GET | `/recommendations/skill-gaps/` | Get skill gap analysis |
| GET | `/recommendations/explain/{job_id}/` | Get recommendation explanation |
| POST | `/recommendations/retrain/` | Retrain ML model |

### Alerts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/alerts/` | List all alerts |
| POST | `/alerts/` | Create new alert |
| GET | `/alerts/{id}/` | Get specific alert |
| PUT | `/alerts/{id}/` | Update alert |
| DELETE | `/alerts/{id}/` | Delete alert |
| GET | `/alerts/notifications/` | List notifications |
| POST | `/alerts/notifications/` | Create notification |
| GET | `/alerts/notifications/{id}/` | Get specific notification |
| PUT | `/alerts/notifications/{id}/` | Update notification |
| DELETE | `/alerts/notifications/{id}/` | Delete notification |
| POST | `/alerts/notifications/{id}/read/` | Mark notification as read |

### Analytics Endpoints (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/dashboard/` | Dashboard metrics |
| GET | `/analytics/users/` | User management data |
| POST | `/analytics/users/{id}/status/` | Update user status |
| GET | `/analytics/jobs/pending/` | Pending jobs |
| POST | `/analytics/jobs/{id}/approve/` | Approve job |
| GET | `/analytics/analytics/` | Detailed analytics |
| GET | `/analytics/system-logs/` | System logs |

## 💡 Usage Examples

### 1. User Authentication

```typescript
import { useAuth } from '../services/apiHooks';

function LoginForm() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  const handleSubmit = async (formData) => {
    try {
      if (isLogin) {
        await login.execute(formData);
      } else {
        await register.execute(formData);
      }
      // Redirect to dashboard
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    // Form JSX
  );
}
```

### 2. Job Listings with Pagination

```typescript
import { usePagination } from '../services/apiHooks';
import { jobsAPI } from '../services/api';

function JobsList() {
  const {
    data: jobs,
    loading,
    hasMore,
    loadMore
  } = usePagination(jobsAPI.getJobs);
  
  return (
    <div>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          Load More
        </button>
      )}
    </div>
  );
}
```

### 3. Job Application

```typescript
import { useApplications } from '../services/apiHooks';

function ApplyButton({ jobId }) {
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
      // Handle error
    }
  };
  
  return (
    <button onClick={handleApply} disabled={createApplication.loading}>
      {createApplication.loading ? 'Applying...' : 'Apply Now'}
    </button>
  );
}
```

### 4. Skills Management

```typescript
import { useSkills } from '../services/apiHooks';

function SkillsManager() {
  const { getUserSkills, addUserSkill, deleteUserSkill } = useSkills();
  const [skills, setSkills] = useState([]);
  
  useEffect(() => {
    const fetchSkills = async () => {
      const userSkills = await getUserSkills.execute();
      setSkills(userSkills);
    };
    fetchSkills();
  }, []);
  
  const handleAddSkill = async (skillData) => {
    const newSkill = await addUserSkill.execute(skillData);
    setSkills([...skills, newSkill]);
  };
  
  return (
    // Skills management UI
  );
}
```

### 5. Recommendations with Feedback

```typescript
import { useRecommendations } from '../services/apiHooks';

function RecommendationsList() {
  const { getRecommendations, submitFeedback } = useRecommendations();
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      const recs = await getRecommendations.execute();
      setRecommendations(recs);
    };
    fetchRecommendations();
  }, []);
  
  const handleFeedback = async (recId, feedback) => {
    await submitFeedback.execute({
      recommendation_id: recId,
      feedback_type: feedback
    });
    // Update UI
  };
  
  return (
    // Recommendations UI with feedback buttons
  );
}
```

## 🔒 Authentication Flow

1. **Login**: User provides credentials
2. **Token Storage**: JWT tokens stored in localStorage
3. **Auto-Refresh**: Tokens automatically refreshed when expired
4. **Logout**: Tokens cleared and user redirected

```typescript
// Automatic token management in api.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🚨 Error Handling

### Global Error Handling

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // Handle token refresh or redirect to login
    }
    return Promise.reject(error);
  }
);
```

### Component-Level Error Handling

```typescript
const { data, loading, error, execute } = useApiCall(someAPI.method);

// Error is automatically captured in the error state
if (error) {
  return <div>Error: {error}</div>;
}
```

## 🎯 Best Practices

### 1. Environment Configuration
- Use environment variables for all API URLs
- Have separate configurations for dev/staging/production

### 2. Error Handling
- Always handle errors at component level
- Provide user-friendly error messages
- Log errors for debugging

### 3. Loading States
- Show loading indicators during API calls
- Disable forms/buttons during submission

### 4. Data Management
- Use pagination for large datasets
- Implement caching for frequently accessed data
- Use optimistic updates where appropriate

### 5. Security
- Never store sensitive data in localStorage
- Validate all user inputs
- Handle token expiration gracefully

## 🧪 Testing

### Mock API Calls

```typescript
// In your tests
jest.mock('../services/api', () => ({
  authAPI: {
    login: jest.fn().mockResolvedValue({ data: { token: 'mock-token' } })
  }
}));
```

### Test Components

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';

test('handles login submission', async () => {
  render(<LoginForm />);
  
  fireEvent.click(screen.getByText('Login'));
  
  await waitFor(() => {
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
});
```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS settings allow frontend domain
   - Check if API URL is correct

2. **401 Unauthorized**
   - Check if token is valid
   - Verify token refresh logic

3. **Network Errors**
   - Verify API URL and connectivity
   - Check if backend server is running

4. **Type Errors**
   - Ensure TypeScript types match API responses
   - Update type definitions as needed

### Debug Tips

1. Use browser dev tools to inspect network requests
2. Check console for error messages
3. Verify API responses match expected format
4. Test endpoints directly with Postman/curl

## 📚 Additional Resources

- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Example Components](./src/components/examples/ApiExamples.tsx)
- [Backend API Documentation](../backend/README.md)

This comprehensive integration provides a robust foundation for connecting your React frontend with the Django backend API. The hooks and utilities make it easy to implement consistent API patterns throughout your application.