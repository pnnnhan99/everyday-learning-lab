import { NextResponse } from 'next/server';
import { listElements, updateElement, deleteElement } from '@/lib/db';
import { validateElement } from '@/types/game';

export async function GET() {
  return NextResponse.json({ data: await listElements() });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = validateElement({ ...(typeof body === 'object' && body !== null ? body : {}), id });
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const updated = await updateElement(id, parsed.value);
  if (!updated) return NextResponse.json({ error: 'Element not found' }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const removed = await deleteElement(id);
  if (!removed) return NextResponse.json({ error: 'Element not found' }, { status: 404 });
  return NextResponse.json({ data: { id } });
}
