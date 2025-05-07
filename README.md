# 🌟 Mali



## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🔍 Overview

Mali is a robust web application that leverages a modern tech stack to deliver a seamless user experience. Designed with scalability and performance in mind, it provides a solid foundation for building complex web applications.

## ✨ Features

- 🔐 Secure authentication using NextAuth and JWT
- 🌐 Internationalization support with next-intl
- 🗄️ Dual database architecture with PostgreSQL and MongoDB
- 🔄 State management with Redux Toolkit and Redux Persist
- 📱 Responsive design for all devices
- 🚀 CI/CD pipeline with GitHub Actions
- 🐳 Containerization with Docker
- 📚 API documentation with Swagger

## 🛠 Tech Stack

### Frontend
- **Next.js**: React framework for server-rendered applications
- **Redux Toolkit**: State management
- **Redux Persist**: Persist and rehydrate Redux store
- **next-intl**: Internationalization

### Backend
- **Next.js API Routes**: API endpoint handling
- **Prisma**: ORM for database access
- **bcrypt**: Password hashing
- **NextAuth.js**: Authentication
- **JWT**: Token-based authentication

### Databases
- **PostgreSQL**: Primary relational database
- **MongoDB**: NoSQL database for specific data requirements

### DevOps & Tools
- **Docker**: Containerization
- **GitHub Actions**: CI/CD workflows
- **Swagger**: API documentation

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16.x or later)
- npm or yarn
- Docker and Docker Compose
- PostgreSQL (if running locally)
- MongoDB (if running locally)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mali.git
   cd mali
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Next Auth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret

   # PostgreSQL
   DATABASE_URL="postgresql://username:password@localhost:5432/mali"

   # MongoDB
   MONGODB_URI="mongodb://localhost:27017/mali"

   # Other environment variables
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

2. Setup databases:
   
   **Using Docker:**
   ```bash
   docker-compose up -d
   ```
   
   **Manually:**
   - Create PostgreSQL database named 'mali'
   - Create MongoDB database named 'mali'

3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

## 📁 Project Structure

```
mali/
├── .github/
│   └── workflows/       # GitHub Actions workflows
├── components/          # React components
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   └── [locale]/        # Localized pages
├── prisma/              # Prisma schema and migrations
├── public/              # Static assets
├── redux/               # Redux store configuration
├── styles/              # CSS/SCSS files
├── utils/               # Utility functions
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore file
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Docker configuration
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

## 💻 Development

1. Start the development server:
   npm i 
   npx prisma migrate dev
   npx prisma generate
   npm run dev

   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run Prisma migrations

## 📚 API Documentation

API documentation is available via Swagger UI at `/api-docs` when the server is running. 

You can also generate and export the API documentation:

```bash
npm run swagger-generate
```

## 🚢 Deployment

### Using Docker

1. Build the Docker image:
   ```bash
   docker build -t mali:latest .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 mali:latest
   ```

### Using GitHub Actions

The project includes GitHub Actions workflows for CI/CD:

- `.github/workflows/ci.yml`: Runs tests and linting on PRs
- `.github/workflows/deploy.yml`: Deploys to production on merge to main

