# Access Job Recommendation System

An AI-powered job recommendation system that connects job seekers with opportunities using advanced machine learning algorithms and explainable AI technology.

## 🚀 Live Demo

The application is fully implemented and ready to run locally with comprehensive mock data and complete functionality for both job seekers and administrators.

### Demo Accounts

**Job Seeker Account:**
- Email: `john.doe@example.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@accessjobs.com`
- Password: `password123`

## ✨ Features

### For Job Seekers
- **🤖 AI-Powered Recommendations**: Get personalized job suggestions with explainable AI reasoning
- **🔍 Advanced Job Search**: Filter by location, salary, job type, experience level, and skills
- **📄 Resume Parsing**: Upload resume files with automatic data extraction and profile population
- **📊 Skills Gap Analysis**: Identify missing skills and get learning path recommendations
- **📝 Application Tracking**: Monitor application status with progress indicators
- **⭐ Job Bookmarking**: Save interesting positions for later review
- **👤 Profile Management**: Comprehensive profile with experience, education, and preferences
- **🎯 Match Analysis**: See why jobs are recommended with detailed skill matching

### For Administrators
- **📈 Analytics Dashboard**: Comprehensive system metrics with KPIs, charts, and export functionality
- **👥 User Management**: Complete user CRUD operations with role management
- **💼 Job Management**: Full job posting management with filtering, sorting, and status controls
- **📊 Advanced Analytics**: Interactive charts for application status, search queries, and job categories
- **⚙️ System Settings**: Complete configuration interface for ML engine, notifications, and security
- **📋 Performance Monitoring**: Real-time system performance metrics and uptime tracking
- **📤 Data Export**: CSV and PDF export capabilities for analytics and reports

### Technical Features
- **🔐 Role-Based Access Control**: Secure authentication with job seeker and admin roles
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI/UX**: Clean, professional interface built with Tailwind CSS
- **⚡ Real-time Updates**: Dynamic content with simulated API responses
- **🛡️ Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **🔄 State Management**: Centralized state with React Context and useReducer

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router Dom** for navigation
- **Tailwind CSS** for styling
- **React Context + useReducer** for state management
- **ESLint + Prettier** for code quality

### Development Tools
- **Vite** for fast development and building
- **TypeScript** for type safety
- **PostCSS** for CSS processing
- **Node.js** runtime environment

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   └── shared/       # Common components (Modal, Loading, Header, etc.)
│   ├── context/          # React Context for state management
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── jobSeeker/    # Job seeker dashboard and features
│   │   └── admin/        # Admin dashboard and management
│   ├── services/         # API services and mock data
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── index.tsx         # Application entry point
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/access-job-recommendation-system.git
   cd access-job-recommendation-system
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

### Run Linting

```bash
npm run lint
```

## 🎯 How to Use

### Job Seekers

1. **Sign In**: Use the demo account or register as a new job seeker
2. **Complete Profile**: Add your skills, experience, and preferences
3. **Upload Resume**: Use the resume parser to automatically populate your profile
   - Drag and drop PDF, DOC, or DOCX files
   - Automatic extraction of skills, experience, and education
   - Review and edit the auto-populated information
4. **Browse Jobs**: Search and filter through available positions
5. **Get Recommendations**: View AI-powered job suggestions with explanations
6. **Apply**: Submit applications with cover letters
7. **Track Progress**: Monitor application status and interview stages
8. **Analyze Skills**: Get personalized learning recommendations

### Administrators

1. **Admin Access**: Sign in with admin credentials
2. **Dashboard Overview**: Monitor system metrics and activity
3. **Manage Users**: View, activate, or deactivate user accounts
4. **Manage Jobs**: Create, edit, and manage job postings
5. **View Analytics**: Access detailed reports and insights
6. **System Settings**: Configure platform parameters

## 🧪 Mock Data

The application includes comprehensive mock data for demonstration:

- **50+ Users** with realistic profiles and preferences
- **100+ Job Listings** from major tech companies
- **200+ Applications** with various statuses
- **Resume Parsing Data** with multiple profile scenarios (senior developer, data analyst, generic)
- **AI Recommendations** with explainable reasoning
- **Skills Analysis** with learning paths
- **Admin Analytics** with performance metrics

## 🔧 Configuration

### Environment Variables

The application runs entirely in the browser with mock data. No external API keys required for demo purposes.

### Customization

- **Colors**: Modify `tailwind.config.js` for theme customization
- **Mock Data**: Update `src/services/mockData.ts` for different data sets
- **Routes**: Add new routes in `src/App.tsx`
- **Components**: Create reusable components in `src/components/`

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with side navigation
- **Tablet**: Adapted layout with touch-friendly interactions
- **Mobile**: Condensed interface with hamburger menu

## 🔒 Security Features

- Role-based route protection
- Input validation and sanitization
- Secure authentication flow
- Protected admin functionality
- Type-safe data handling

## 🎨 UI/UX Highlights

- **Minimalist Design**: Clean, professional interface
- **Intuitive Navigation**: Clear information architecture
- **Interactive Elements**: Hover states, transitions, and animations
- **Accessibility**: Semantic HTML and keyboard navigation
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: Graceful error messages and recovery

## 🤖 AI Features

### Recommendation Engine
- Skill-based job matching
- Experience level analysis
- Location and salary preferences
- Industry alignment scoring

### Explainable AI
- Detailed reasoning for recommendations
- Skill gap identification
- Learning path suggestions
- Match percentage calculations

### User Feedback Loop
- Like/dislike feedback collection
- Recommendation improvement simulation
- Personalized learning suggestions

## 📊 Analytics & Reporting

### User Analytics
- Application success rates
- Popular job categories
- Search patterns and trends
- User engagement metrics

### System Performance
- Response time monitoring
- Error rate tracking
- Uptime statistics
- Recommendation accuracy

## 🛣️ Roadmap

### Planned Features
- Real backend API integration
- Machine learning model training
- Email notifications
- Chat functionality
- Video interviewing
- Skills assessments

### Technical Improvements
- Unit and integration testing
- CI/CD pipeline
- Docker containerization
- Performance optimization
- SEO enhancements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React and TypeScript communities
- Tailwind CSS for the design system
- Job posting data inspired by real companies
- AI/ML community for recommendation algorithms

## 📞 Support

For questions, suggestions, or issues:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Made with ❤️ for connecting talent with opportunities through AI-powered job matching.**