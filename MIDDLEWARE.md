# Middleware & Route Protection Documentation

## Overview

Kavach uses Next.js middleware with NextAuth JWT tokens to implement role-based access control (RBAC) for protected routes.

## Route Protection

Routes are protected based on URL patterns mapped to user roles:

- **User Routes** (`/user/*`, `/dashboard/*`) → Requires `user` role
- **Company Routes** (`/company/*`) → Requires `company` role  
- **Admin Routes** (`/admin/*`) → Requires `admin` role

## How It Works

1. **Middleware Intercepts Requests**: All requests (except API/auth routes and static files) are intercepted by middleware
2. **Token Extraction**: JWT token is extracted from the request using NextAuth's `getToken`
3. **Role Check**: User's role from token is compared with required role for the route
4. **Access Control**: 
   - If no token → Redirect to `/api/auth/signin`
   - If wrong role → Redirect to `/api/auth/signin` with `AccessDenied` error
   - If correct role → Allow access

## Route Structure

Since Next.js route groups `(user)`, `(company)`, `(admin)` don't appear in URLs, create routes with explicit prefixes:

```
app/
  (user)/
    user/
      dashboard/
        page.js        → URL: /user/dashboard (requires "user" role)
      profile/
        page.js        → URL: /user/profile (requires "user" role)
  
  (company)/
    company/
      dashboard/
        page.js        → URL: /company/dashboard (requires "company" role)
      settings/
        page.js        → URL: /company/settings (requires "company" role)
  
  (admin)/
    admin/
      dashboard/
        page.js        → URL: /admin/dashboard (requires "admin" role)
      users/
        page.js        → URL: /admin/users (requires "admin" role)
```

## Configuration

### Adding New Protected Routes

Edit `src/lib/route-config.js`:

```javascript
export const ROUTE_ROLE_MAP = {
  '/user': ROLES.USER,
  '/dashboard': ROLES.USER,
  '/company': ROLES.COMPANY,
  '/admin': ROLES.ADMIN,
  '/new-route': ROLES.USER, // Add new route here
};
```

### Adding Public Routes

Edit `src/lib/route-config.js`:

```javascript
export const PUBLIC_ROUTES = [
  '/',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/register',
  '/about', // Add public routes here
];
```

## Helper Functions

### `src/lib/auth-helpers.js`

- `hasRole(userRole, requiredRole)` - Check if user has specific role
- `isAdmin(userRole)` - Check if user is admin
- `isCompany(userRole)` - Check if user is company
- `isUser(userRole)` - Check if user has user role
- `getRequiredRole(pathname)` - Get required role for a route
- `requiresAuth(pathname)` - Check if route requires authentication
- `hasRouteAccess(userRole, pathname)` - Check if user can access route

### `src/lib/route-config.js`

- `ROUTE_ROLE_MAP` - Map of URL patterns to roles
- `PUBLIC_ROUTES` - List of public routes
- `isPublicRoute(pathname)` - Check if route is public

## Usage Examples

### In API Routes

```javascript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasRole } from '@/lib/auth-helpers';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (!hasRole(session.user.role, 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Admin-only logic here
}
```

### In Server Components

```javascript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasRole } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !hasRole(session.user.role, 'admin')) {
    redirect('/api/auth/signin');
  }
  
  return <div>Admin Content</div>;
}
```

## Middleware Matcher

The middleware only runs on routes matching the pattern:
- Excludes: `/api/auth/*`, `/_next/*`, static files, favicon

This ensures NextAuth API routes work correctly and static assets load without authentication checks.

## Security Notes

1. **JWT Tokens**: Roles are stored in JWT tokens, so they're verified on every request
2. **Server-Side Validation**: Always validate roles server-side, not just client-side
3. **Token Expiry**: Tokens expire after 30 days (configured in `auth.js`)
4. **Public Routes**: Explicitly define public routes to avoid accidental protection
