# LeetCode Clone

A modern coding platform built with Next.js, Prisma, and BetterAuth for practicing coding problems and improving programming skills.

## Features

- 🔐 **Authentication** - Secure user authentication with BetterAuth
- 🗄️ **Database** - SQLite database with Prisma ORM
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS and shadcn/ui
- 📊 **Problem Management** - Create and manage coding problems
- 👥 **User Management** - User registration, login, and profile management
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 🚀 **Code Execution** - Execute code in multiple programming languages using HackerEarth API

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite with Prisma ORM
- **Authentication**: BetterAuth
- **Code Execution**: HackerEarth API v4
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Package Manager**: npm

## Prerequisites

- Node.js 18+ 
- npm or yarn
- HackerEarth API credentials

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd leetcode-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-secret-key-here-change-in-production"
AUTH_URL="http://localhost:3000"

# HackerEarth API (Required for code execution)
HACKEREARTH_ID="your-hackerearth-client-id"
HACKEREARTH_SECRET="your-hackerearth-client-secret"
```

### 4. Get HackerEarth API Credentials

1. Go to [HackerEarth API Registration](https://www.hackerearth.com/docs/wiki/developers/v4)
2. Register your application to get a client ID and client secret
3. Add the credentials to your `.env` file

### 5. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to the database
npm run db:push

# Seed the database with initial data
npm run db:seed
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supported Programming Languages

The application supports code execution in the following languages:

- **Python 3** - Python 3.x
- **JavaScript (Node.js)** - JavaScript with Node.js runtime
- **Java 8** - Java with OpenJDK 8
- **C++17** - C++ with GCC 7.4.0
- **C** - C with GCC 7.4.0
- **C#** - C# with Mono 6.6.0.161
- **Go** - Go 1.13.5
- **Rust** - Rust 1.40.0
- **Ruby** - Ruby 2.7.0
- **PHP** - PHP 7.4.0
- **Swift** - Swift 5.2.3
- **Kotlin** - Kotlin 1.3.70
- **Scala** - Scala 2.13.1
- **TypeScript** - TypeScript with Node.js runtime

## Database Schema

The application uses the following main models:

- **User** - User accounts and authentication
- **Problem** - Coding problems with difficulty levels
- **Submission** - User code submissions and results
- **Account** - OAuth account connections (BetterAuth)
- **Session** - User sessions (BetterAuth)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with initial data

## Authentication

The application uses BetterAuth for authentication with the following features:

- Email/password authentication
- Session management
- Protected routes
- User registration and login

### Default Test User

After running the seed script, you can log in with:

- **Email**: `test@example.com`
- **Password**: `password`

## Project Structure

```
leetcode-clone/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── hackerearth/   # HackerEarth API integration
│   │   └── auth/          # Authentication routes
│   ├── auth/              # Authentication pages
│   ├── problems/          # Problem pages
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                  # Utility libraries
│   ├── auth.ts          # BetterAuth configuration
│   ├── hackerearth.ts   # HackerEarth API utilities
│   ├── prisma.ts        # Prisma client
│   └── ...
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema
│   └── seed.ts          # Database seed script
└── ...
```

## Code Execution

The application uses HackerEarth API v4 for code execution. This provides:

- **Asynchronous execution** - Code runs in the background
- **Multiple language support** - 15+ programming languages
- **Resource limits** - Memory and time limits for security
- **Real-time results** - Get execution status and output

### API Endpoints

- `POST /api/hackerearth/submit` - Submit code for execution
- Returns execution results including status, output, runtime, and memory usage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 