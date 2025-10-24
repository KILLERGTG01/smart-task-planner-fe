# 🚀 Smart Task Planner

> AI-powered project planning and task scheduling made simple

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://www.smarttaskplanner.anurag-goel.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.13-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![AWS Amplify](https://img.shields.io/badge/AWS%20Amplify-Deployed-orange?style=for-the-badge&logo=aws-amplify)](https://aws.amazon.com/amplify/)

## 🌟 Overview

Smart Task Planner is an intelligent project management tool that transforms your goals into actionable, time-sequenced task plans. Using AI-powered analysis, it breaks down complex projects into manageable tasks with proper dependencies, duration estimates, and realistic timelines.

**🔗 Live Application:** [https://www.smarttaskplanner.anurag-goel.com](https://www.smarttaskplanner.anurag-goel.com)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Planning**: Transform any goal into a structured project plan
- **Smart Task Sequencing**: Automatic dependency resolution and task ordering
- **Timeline Visualization**: Beautiful, colorful timeline with task relationships
- **Duration Estimation**: AI calculates realistic timeframes for each task
- **Date Calculations**: Real completion dates based on dependencies and current date

### 🎨 User Experience
- **Modern UI/UX**: Clean, responsive design with gradient accents
- **Interactive Timeline**: Visual task flow with connecting lines and progress indicators
- **Color-Coded Tasks**: Each task gets a unique color for easy identification
- **Dependency Visualization**: Clear display of task relationships and prerequisites
- **Mobile Responsive**: Optimized for all screen sizes

### 🔧 Technical Features
- **Auth0 Authentication**: Secure user authentication with Google OAuth
- **User Plan History**: Save and access your plans from anywhere
- **Protected Routes**: Secure access to user-specific features
- **Real-time Processing**: Instant plan generation and display
- **Error Handling**: Graceful error management with user-friendly messages
- **TypeScript**: Full type safety throughout the application
- **Performance Optimized**: Fast loading and smooth interactions

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 15.5.5](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.6.2](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4.13](https://tailwindcss.com/)
- **Forms**: [React Hook Form 7.48.2](https://react-hook-form.com/) + [Zod 3.22.4](https://zod.dev/)
- **HTTP Client**: [Axios 1.7.7](https://axios-http.com/)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Build Tool**: Next.js built-in bundler
- **CSS Processing**: PostCSS with Autoprefixer

### Deployment
- **Platform**: [AWS Amplify](https://aws.amazon.com/amplify/)
- **Domain**: Custom domain with SSL
- **CI/CD**: Automatic deployments from Git

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-task-planner-fe.git
   cd smart-task-planner-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain.auth0.com
   NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
   NEXT_PUBLIC_AUTH0_AUDIENCE=https://smarttask-api
   NEXT_PUBLIC_AUTH0_REDIRECT_URI=http://localhost:3000/auth/callback
   AUTH0_CLIENT_ID=your-auth0-client-id
   AUTH0_CLIENT_SECRET=your-auth0-client-secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
smart-task-planner-fe/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── GoalForm.tsx     # Goal input form
│   │   │   ├── TaskTimeline.tsx # Main timeline visualization
│   │   │   ├── TaskCard.tsx     # Individual task display
│   │   │   └── Nav.tsx          # Navigation component
│   │   ├── lib/                 # Utility functions and configurations
│   │   │   ├── axios.ts         # HTTP client setup
│   │   │   └── types.ts         # TypeScript type definitions
│   │   ├── globals.css          # Global styles and Tailwind imports
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Home page component
│   └── types/                   # Additional type definitions
├── public/                      # Static assets
├── .env                        # Environment variables
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── next.config.ts              # Next.js configuration
```

## 🎨 Component Architecture

### TaskTimeline Component
The heart of the application, featuring:
- **Smart Scheduling Algorithm**: Calculates start/end dates based on dependencies
- **Visual Timeline**: Connected task flow with numbered sequence
- **Color Management**: Automatic color assignment from predefined palette
- **Responsive Design**: Adapts to different screen sizes
- **Progress Tracking**: Ready for future progress updates

### GoalForm Component
- **Form Validation**: Zod schema validation with React Hook Form
- **User-Friendly Interface**: Clean input fields with helpful placeholders
- **Loading States**: Visual feedback during plan generation
- **Error Handling**: Displays validation errors and API failures

## 🔄 API Integration

The application integrates with a backend API for plan generation:

### Endpoints
- `POST /api/generate` - Generate task plan from goal description

### Request Format
```json
{
  "goal": "Launch MVP in 4 weeks",
  "title": "Product Launch Plan"
}
```

### Response Format
```json
{
  "message": "Plan generated successfully",
  "plan": [
    {
      "task": "Define Product Scope and MVP",
      "duration_days": 1,
      "depends_on": []
    },
    {
      "task": "Develop Core Features",
      "duration_days": 5,
      "depends_on": ["Define Product Scope and MVP"]
    }
  ],
  "saved": false
}
```

## 🎯 Key Features Explained

### 1. Smart Task Sequencing
The application uses a topological sorting algorithm to:
- Resolve task dependencies
- Calculate optimal start dates
- Prevent circular dependencies
- Ensure logical task flow

### 2. Timeline Visualization
- **Visual Hierarchy**: Tasks are displayed in execution order
- **Dependency Lines**: Visual connections between related tasks
- **Color Coding**: Each task gets a unique color for easy tracking
- **Date Display**: Shows both relative and absolute dates

### 3. Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Flexible Layout**: Adapts to different screen sizes
- **Touch Friendly**: Large touch targets for mobile users

## 🚀 Deployment

### AWS Amplify Deployment

The application is deployed on AWS Amplify with the following configuration:

1. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

2. **Environment Variables**
   - `NEXT_PUBLIC_BACKEND_URL`: Backend API URL
   - Other environment-specific configurations

3. **Custom Domain**
   - Domain: `smarttaskplanner.anurag-goel.com`
   - SSL Certificate: Automatically managed by AWS
   - CDN: CloudFront distribution for global performance

### Manual Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel: `vercel --prod`
   - Netlify: Drag and drop `.next` folder
   - AWS Amplify: Connect Git repository

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Strategy
- **Component Testing**: React Testing Library for UI components
- **Integration Testing**: API integration tests
- **E2E Testing**: Playwright for end-to-end scenarios
- **Type Checking**: TypeScript for compile-time error detection

## 🔧 Development

### Code Style
- **ESLint**: Enforces code quality and consistency
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking enabled
- **Conventional Commits**: Standardized commit messages

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Run linting and type checking
4. Submit pull request
5. Automated deployment on merge

## 📈 Performance

### Optimization Features
- **Static Generation**: Pre-rendered pages for fast loading
- **Code Splitting**: Automatic bundle optimization
- **Image Optimization**: Next.js built-in image optimization
- **CSS Optimization**: Tailwind CSS purging for minimal bundle size

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: ~147KB (gzipped)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests for new functionality**
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the existing code style
- Keep commits atomic and well-described

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anurag Goel**
- Website: [anurag-goel.com](https://anurag-goel.com)
- GitHub: [@anurag-goel](https://github.com/anurag-goel)
- LinkedIn: [Anurag Goel](https://linkedin.com/in/anurag-goel)

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel** for inspiration on modern web development
- **AWS Amplify** for reliable hosting and deployment
- **Open Source Community** for the incredible tools and libraries

## 📞 Support

If you have any questions or need help:

1. **Check the documentation** in this README
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Contact the author** through the provided links

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

[Live Demo](https://www.smarttaskplanner.anurag-goel.com) • [Report Bug](https://github.com/yourusername/smart-task-planner-fe/issues) • [Request Feature](https://github.com/yourusername/smart-task-planner-fe/issues)

</div>