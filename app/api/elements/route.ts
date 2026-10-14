import { NextResponse } from 'next/server';
import { listElements, createElement } from '@/lib/db';
import { validateElement } from '@/types/game';

export async function GET() {
  const elements = await listElements();
  return NextResponse.json({ data: elements });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = validateElement(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    const created = await createElement(parsed.value);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Create failed' }, { status: 409 });
  }
}

