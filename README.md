# Kavach - Women Safety SaaS Platform

A production-level women safety SaaS platform built with Next.js 14, MongoDB, and NextAuth.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with JWT session strategy
- **Styling**: Tailwind CSS

## Project Structure

```
kavach/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication routes
│   │   ├── (user)/          # User dashboard routes
│   │   ├── (company)/       # Company/organization routes
│   │   ├── (admin)/         # Admin panel routes
│   │   ├── api/             # API routes
│   │   │   └── auth/        # NextAuth API routes
│   │   ├── layout.js        # Root layout
│   │   └── page.js          # Home page
│   ├── components/          # Reusable React components
│   │   ├── ui/              # Reusable UI primitives (Badge, StatCard, etc.)
│   ├── lib/                 # Utility functions and configurations
│   │   ├── mongodb.js       # MongoDB connection
│   │   ├── auth.js          # NextAuth configuration
│   │   ├── api-helpers.js   # Shared API controller helpers (JSON/session/errors)
│   │   ├── errors.js        # Shared error types
│   │   ├── services/        # Feature services (DB/model operations)
│   │   ├── mocks/           # UI mock data for dashboards
│   │   └── data/            # Static curated data (e.g. store products)
│   │   └── utils.js         # Utility functions
│   ├── models/              # Mongoose models
│   └── middleware.js        # Next.js middleware
├── .env.example             # Environment variables template
└── package.json
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your MongoDB URI, NextAuth secret, and other required values

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Environment Variables

See `.env.example` for all required environment variables.

### Required Variables:
- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_URL` - Base URL of your application
- `NEXTAUTH_SECRET` - Secret key for NextAuth (generate a random string)
- `JWT_SECRET` - Secret key for JWT tokens

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Notes

- **Route Groups**: Using Next.js route groups `(auth)`, `(user)`, `(company)`, `(admin)` for organized routing without affecting URL structure
- **Separation of concerns**: API routes are thin controllers; domain logic lives in `src/lib/services/*`; persistence in `src/models/*`.
- **Production readiness**: Use strong secrets (`NEXTAUTH_SECRET`, `JWT_SECRET`), validate inputs, and add rate limiting before production.
