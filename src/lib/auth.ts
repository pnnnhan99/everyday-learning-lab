import { NextRequest, NextResponse } from 'next/server';

export enum AuthLevel {
  NONE,
  ADMIN
}

export function authorizeRequest(request: NextRequest, _requiredLevel: AuthLevel = AuthLevel.ADMIN) {
  // In development, bypass authorization for convenience
  // NOTE: This is NOT secure and should only be used in local development
  if (process.env.NODE_ENV !== 'production') {
    return { authorized: true };
  }

  // In production, require admin key
  const adminKey = process.env.API_ADMIN_KEY;
  if (!adminKey) {
    // Misconfiguration - admin key not set
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Server misconfiguration: admin key not configured' },
        { status: 500 }
      )
    }
  }

  // Check for admin key in headers
  const providedKey = request.headers.get('X-Admin-Key');
  if (!providedKey || providedKey !== adminKey) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: admin key required' },
        { status: 401 }
      )
    }
  }

  return { authorized: true }
}