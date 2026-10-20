import { NextResponse } from 'next/server';
import { getElementById, updateElement, deleteElement } from '@/lib/db';
import { validateElement } from '@/types/game';
import { checkAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const element = await getElementById(id);
  if (!element) return NextResponse.json({ error: 'Element not found' }, { status: 404 });
  return NextResponse.json({ data: element });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!checkAuth(request)) return unauthorizedResponse();
  const { id } = await context.params;
   
  // Check if element exists
  const existingElement = await getElementById(id);
  if (!existingElement) {
    return NextResponse.json({ error: 'Element not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = validateElement({ ...(typeof body === 'object' && body !== null ? body : {}), id });
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    const updated = await updateElement(id, parsed.value);
    if (!updated) return NextResponse.json({ error: 'Element not found' }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!checkAuth(request)) return unauthorizedResponse();
  const { id } = await context.params;
  try {
    const removed = await deleteElement(id);
    if (!removed) return NextResponse.json({ error: 'Element not found' }, { status: 404 });
    return NextResponse.json({ data: { id } });
  } catch (err) {
    if (err instanceof Error && err.message.includes('FOREIGN KEY')) {
      return NextResponse.json(
        { error: 'Element is referenced by reactions and cannot be deleted' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
