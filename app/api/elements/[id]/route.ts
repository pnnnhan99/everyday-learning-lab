import { NextResponse, NextRequest } from 'next/server';
import { listElements, updateElement, deleteElement, getElementById } from '@/lib/db';
import { validateElement } from '@/types/game';
import { authorizeRequest } from '@/lib/auth';

export async function GET() {
  return NextResponse.json({ data: await listElements() });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Authorization check
  const auth = authorizeRequest(request);
  if (!auth.authorized) return auth.response;

  const { id } = await context.params;
   
  // Check if element exists
  const existingElement = await getElementById(id);
  if (!existingElement) {
    return NextResponse.json({ error: 'Element not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = validateElement({ ...(typeof body === 'object' && body !== null ? body : {}), id });
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const updated = await updateElement(id, parsed.value);
  if (!updated) return NextResponse.json({ error: 'Element not found' }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Authorization check
  const auth = authorizeRequest(request);
  if (!auth.authorized) return auth.response;

  const { id } = await context.params;
   
  // Check if element exists
  const existingElement = await getElementById(id);
  if (!existingElement) {
    return NextResponse.json({ error: 'Element not found' }, { status: 404 });
  }

  const removed = await deleteElement(id);
  if (!removed) return NextResponse.json({ error: 'Element not found' }, { status: 404 });
  return NextResponse.json({ data: { id } });
}