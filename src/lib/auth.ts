import { NextResponse } from 'next/server';

export function checkAuth(request: Request): boolean {
  const expected = process.env.MAINTAINER_TOKEN;
  if (!expected) return false;
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) return false;
  return timingSafeEqual(header.slice(7), expected);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Browser-side session helpers live in `maintainerSession.ts` so client
// components never pull `next/server` into their bundle.

