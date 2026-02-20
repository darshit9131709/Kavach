# Authentication API Documentation

## Overview

Kavach uses NextAuth.js with JWT session strategy and Credentials Provider. Users are stored in MongoDB with bcrypt password hashing.

## User Model

**Location**: `src/models/User.js`

**Fields**:
- `name` (String, required, 2-100 characters)
- `email` (String, required, unique, validated)
- `password` (String, required, min 6 characters, hashed with bcrypt)
- `role` (String, enum: 'user', 'company', 'admin', default: 'user')
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated via timestamps)

**Methods**:
- `comparePassword(candidatePassword)` - Compare plain password with hashed password

## API Endpoints

### 1. Register User

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "accountType": "individual" // required: "individual" | "company"
}
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-02-19T..."
  }
}
```

**Error Responses**:
- `400` - Validation error (missing fields, invalid email, short password, invalid accountType)
- `409` - User already exists
- `500` - Server error

### 2. Sign In (NextAuth)

**Endpoint**: `POST /api/auth/signin`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: NextAuth handles the response and sets session cookie.

### 3. Get Session

**Endpoint**: `GET /api/auth/session`

**Response**:
```json
{
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "expires": "2026-03-21T..."
}
```

### 4. Sign Out

**Endpoint**: `POST /api/auth/signout`

**Response**: Clears session cookie.

## Session Structure

The JWT token and session include:
- `id` - User MongoDB ID
- `email` - User email
- `name` - User name
- `role` - User role ('user', 'company', 'admin')

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with salt rounds of 12
2. **Password Field**: Password field is excluded from queries by default (`select: false`)
3. **JWT Strategy**: Sessions use JWT tokens (not database sessions)
4. **Session Expiry**: Sessions expire after 30 days
5. **Input Validation**: Email format, password length, and role validation

## Rate Limiting (Recommended for Production)

Rate limiting is not implemented yet, but you should add it before production to protect:

- `POST /api/auth/register`
- credentials sign-in attempts (NextAuth)
- `POST /api/sos`
- `POST /api/location`
- `POST /api/chat`
- trusted contacts and helplines mutation endpoints

Suggested approach:
- Apply **per-IP** and (when authenticated) **per-user** limits.
- In multi-instance deployments, use a shared store (Redis/KV) rather than in-memory limits.

## Usage Examples

### Register a User

```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'securepassword123',
    accountType: 'individual'
  })
});

const data = await response.json();
```

### Sign In with NextAuth

```javascript
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: 'jane@example.com',
  password: 'securepassword123',
  redirect: false
});
```

### Get Session

```javascript
import { getSession } from 'next-auth/react';

const session = await getSession();
if (session) {
  console.log('User role:', session.user.role);
}
```

## Environment Variables Required

- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_URL` - Base URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET` - Secret key for JWT signing (generate random string)
