# AccessJobs - Frontend

A beautiful, modern job recommendation system frontend built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Beautiful UI/UX** - Modern, responsive design with Tailwind CSS
- **TypeScript** - Full type safety and better development experience
- **Authentication System** - Login/register with demo accounts
- **Job Search & Recommendations** - AI-powered job matching
- **Application Tracking** - Track your job applications
- **Profile Management** - Manage your skills, experience, and preferences
- **Admin Dashboard** - Administrative interface for job and user management
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Accessibility** - Built with accessibility best practices
- **Linting & Formatting** - ESLint and Prettier for code quality

## 🛠 Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Heroicons** - Beautiful SVG icons
- **ESLint & Prettier** - Code linting and formatting

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## 🎭 Demo Accounts

### Job Seeker Account
- **Email:** john.doe@email.com
- **Password:** password123
- **Features:** Browse jobs, get recommendations, apply to positions, track applications

### Admin Account
- **Email:** admin@accessjobs.com
- **Password:** password123
- **Features:** Manage jobs, view users, analytics dashboard, system administration

## 🎨 Design System

The application uses a comprehensive design system with:

- **Color Palette:** Primary blue, secondary grays, success green, warning amber, danger red
- **Typography:** Inter font family for modern, readable text
- **Components:** Reusable UI components with consistent styling
- **Animations:** Smooth transitions and micro-interactions
- **Responsive Breakpoints:** Mobile-first design with Tailwind's breakpoint system

## 📱 Pages & Features

### Public Pages
- **Landing Page** - Hero section, features overview, call-to-action
- **Login/Register** - Authentication with form validation
- **Job Listings** - Public job browsing

### Job Seeker Pages
- **Dashboard** - Personalized job recommendations
- **Job Search** - Advanced search with filters
- **Job Details** - Detailed job information and application
- **Applications** - Track application status and interviews
- **Profile** - Manage skills, experience, and preferences
- **Bookmarks** - Saved jobs and notes

### Admin Pages
- **Admin Dashboard** - System overview and analytics
- **Job Management** - Create, edit, and manage job postings
- **User Management** - View and manage user accounts
- **Analytics** - Detailed system metrics and reporting

## 🔐 Security Features

- **Protected Routes** - Authentication-based route protection
- **Form Validation** - Client-side and server-side validation
- **XSS Protection** - Safe rendering of user content
- **CSRF Protection** - Cross-site request forgery prevention

## 🎯 Mock Data

The application includes comprehensive mock data:
- **Users:** Job seekers and admin users with detailed profiles
- **Jobs:** Realistic job postings with company information
- **Applications:** Sample application tracking data
- **Recommendations:** AI-powered job matching simulation

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, Modal)
│   ├── layout/         # Layout components (Header, Footer)
│   ├── auth/           # Authentication components
│   └── jobs/           # Job-related components
├── pages/              # Page components
├── context/            # React context providers
├── data/               # Mock data and API functions
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

## 🚀 Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your preferred hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy job hunting! 🎯**
