import { NextResponse } from 'next/server';

import { checkAuth, unauthorizedResponse } from '@/lib/auth';

/**
 * Lets the admin page confirm that a stored token is still accepted before it
 * shows the authorized UI. This endpoint performs no mutation.
 */
export async function GET(request: Request) {
  if (!checkAuth(request)) return unauthorizedResponse();
  return NextResponse.json({ data: { authorized: true } });
}
