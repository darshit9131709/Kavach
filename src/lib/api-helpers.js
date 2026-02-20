import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasRole } from '@/lib/auth-helpers';
import { AuthError, ValidationError } from '@/lib/errors';

export async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new ValidationError('Invalid JSON body');
  }
}

export function apiJson(payload, status = 200) {
  return NextResponse.json(payload, { status });
}

export async function requireSession(unauthorizedMessage = 'Unauthorized') {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new AuthError(unauthorizedMessage, 401);
  }
  return session;
}

export function requireRole(session, role, forbiddenMessage = 'Forbidden') {
  if (!hasRole(session?.user?.role, role)) {
    throw new AuthError(forbiddenMessage, 403);
  }
}

/**
 * Map common known errors to a response.
 * IMPORTANT: Keep response shape consistent with existing routes.
 */
export function handleApiError(error, fallbackMessage, fallbackStatus = 500) {
  // Custom errors
  if (error?.status && typeof error.status === 'number') {
    return apiJson({ error: error.message }, error.status);
  }

  // Mongoose validation errors
  if (error?.name === 'ValidationError' && error?.errors) {
    const errors = Object.values(error.errors).map((err) => err.message);
    return apiJson({ error: errors.join(', ') }, 400);
  }

  // Mongo duplicate key
  if (error?.code === 11000) {
    // Caller should provide a meaningful fallbackMessage for duplicates
    return apiJson({ error: fallbackMessage }, 409);
  }

  return apiJson({ error: fallbackMessage }, fallbackStatus);
}

