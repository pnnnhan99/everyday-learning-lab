import { NextResponse } from 'next/server';
import { listElements, createElement } from '@/lib/db';
import { validateElement } from '@/types/game';
import { checkAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET() {
  const elements = await listElements();
  return NextResponse.json({ data: elements });
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorizedResponse();
  const body = await request.json().catch(() => null);
  const parsed = validateElement(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    const created = await createElement(parsed.value);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === 'Element id already exists') {
      return NextResponse.json({ error: 'Element id already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}
