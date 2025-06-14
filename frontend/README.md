# Access Job Recommendation System - Frontend

A modern React TypeScript application for AI-powered job recommendations with comprehensive job seeker and admin functionality.

## Features

### Job Seeker Features
- **Authentication**: Secure login/register with role-based access
- **AI-Powered Recommendations**: Personalized job suggestions with explainable AI
- **Job Search & Filtering**: Advanced search with multiple filters
- **Application Tracking**: Track job applications and interview stages
- **Profile Management**: Complete profile with skills, education, and experience
- **Skill Gap Analysis**: Identify missing skills and get learning recommendations
- **Job Alerts**: Create and manage custom job alerts
- **Bookmarks**: Save interesting job listings
- **Resume Parsing**: Upload resume and auto-populate profile (simulated)

### Admin Features
- **Dashboard**: System overview with comprehensive metrics and analytics
- **User Management**: Complete CRUD operations for user accounts with role management
- **Job Management**: Full job posting management with filtering, sorting, and status controls
- **Analytics**: Interactive charts and KPIs with export functionality (CSV/PDF)
- **Settings**: Complete system configuration for ML engine, notifications, and security
- **Performance Monitoring**: Real-time system performance metrics and uptime tracking

### Technical Features
- **TypeScript**: Full type safety and better developer experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Mock Data**: Comprehensive mock backend simulation
- **Error Handling**: Robust error handling with user-friendly modals
- **Loading States**: Smooth loading indicators for better UX
- **Route Protection**: Role-based route protection
- **Context Management**: Global state management with React Context

## Tech Stack

- **React 19**: Latest React with hooks
- **TypeScript**: Type-safe JavaScript
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code linting and formatting

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure AI Resume Parsing (Optional)**:
   - Copy the environment template:
     ```bash
     cp .env.example .env.local
     ```
   - Get your Novita AI API key from [https://novita.ai/settings/key-management](https://novita.ai/settings/key-management)
   - Add your API key to `.env.local`:
     ```
     REACT_APP_NOVITA_API_KEY=your_actual_api_key_here
     ```
   - **Note**: Without the API key, the resume parser will use mock data for demonstration

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Run linting**:
   ```bash
   npm run lint
   ```

## Demo Accounts

The application includes demo accounts for testing:

### Job Seeker Account
- **Email**: john.doe@example.com
- **Password**: password123
- **Features**: Full profile, recommendations, applications

### Admin Account
- **Email**: admin@accessjobs.com
- **Password**: password123
- **Features**: Full admin dashboard and user management

## Project Structure

```
src/
├── components/          # Reusable components
│   └── shared/         # Shared components (Header, Modal, Loading, etc.)
├── context/            # React Context for state management
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── jobSeeker/     # Job seeker pages
│   └── admin/         # Admin pages
├── services/          # API services and mock data
├── types/             # TypeScript type definitions
└── App.tsx            # Main app component
```

## Key Components

### Authentication
- Login/Register forms with validation
- Protected routes with role-based access
- Persistent authentication state

### Job Seeker Dashboard
- Personalized job recommendations with AI explanations
- Recent activity overview
- Quick action buttons
- Statistics cards

### AI Recommendations
- Skill-based job matching
- Explainable AI with match reasons
- User feedback collection for ML improvement
- Recommendation scoring system

### AI-Powered Resume Parsing
- **Novita AI Integration**: Uses Novita AI's LLM API for intelligent resume parsing
- **Automatic Data Extraction**: Extracts skills, experience, education, and professional summary
- **Smart Fallback**: Falls back to mock data when API key is not configured
- **Multiple File Formats**: Supports PDF, DOC, DOCX, and TXT files
- **Error Handling**: Comprehensive validation and user-friendly error messages
- **Real-time Processing**: Processes resumes with visual feedback and loading states

### Admin Dashboard
- System metrics and analytics
- User management with full CRUD
- Job posting management
- System activity monitoring

## State Management

The application uses React Context for global state management:

- **AppContext**: Main application state (user, auth, modals, loading)
- **Persistent Storage**: User data persisted in localStorage
- **Loading States**: Global loading indicators for API calls
- **Modal System**: Centralized modal management for alerts and confirmations

## API Simulation

All backend functionality is simulated using mock data and services:

- **Mock Users**: Predefined user accounts with different roles
- **Mock Jobs**: Comprehensive job listings with realistic data
- **Mock Applications**: Application tracking with status updates
- **Simulated Delays**: Realistic API response times
- **Error Simulation**: Error handling scenarios

## Responsive Design

The application is fully responsive:

- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Enhanced layouts for tablets
- **Desktop**: Full-featured desktop experience
- **Accessibility**: ARIA labels and keyboard navigation

## Development Guidelines

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Functional components with hooks
- Proper error boundaries

### UI/UX
- Consistent design language
- Loading states for all async operations
- Error handling with user-friendly messages
- No native browser alerts (custom modal system)

### Performance
- Code splitting and lazy loading ready
- Optimized bundle size
- Efficient re-renders with proper dependencies

## Future Enhancements

- Real backend API integration
- Advanced search filters
- File upload functionality
- Email notifications
- Real-time chat support
- Advanced analytics dashboard
- Mobile app version
- Third-party integrations (LinkedIn, GitHub)

## Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run eject`: Eject from Create React App (not recommended)

## Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_VERSION=1.0.0
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## License

This project is part of the Access Job Recommendation System and is intended for demonstration purposes.
