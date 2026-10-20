import { NextResponse } from 'next/server';
import { listReactions, findReactionPair, createReaction, deleteReaction, listElements } from '@/lib/db';
import { validateReaction } from '@/types/game';
import { checkAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const e1 = searchParams.get('e1');
  const e2 = searchParams.get('e2');
  if (e1 && e2) {
    const reaction = await findReactionPair(e1, e2);
    if (!reaction) return NextResponse.json({ data: null }, { status: 404 });
    return NextResponse.json({ data: reaction });
  }
  const reactions = await listReactions();
  return NextResponse.json({ data: reactions });
}

export async function POST(request: Request) {
  if (!checkAuth(request)) return unauthorizedResponse();
  const body = await request.json().catch(() => null);
  const parsed = validateReaction(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const elements = await listElements();
  if (!elements.some((e) => e.id === parsed.value.element1Id) || !elements.some((e) => e.id === parsed.value.element2Id)) {
    return NextResponse.json({ error: 'Referenced element not found' }, { status: 404 });
  }
  try {
    const created = await createReaction(parsed.value);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Create failed';
    return NextResponse.json({ error: message }, { status: message.includes('already exists') ? 409 : 400 });
  }
}

export async function DELETE(request: Request) {
  if (!checkAuth(request)) return unauthorizedResponse();
  const { searchParams } = new URL(request.url);
  const e1 = searchParams.get('e1');
  const e2 = searchParams.get('e2');
  if (!e1 || !e2) return NextResponse.json({ error: 'e1 and e2 query params are required' }, { status: 400 });
  try {
    const removed = await deleteReaction(e1, e2);
    if (!removed) return NextResponse.json({ error: 'Reaction not found' }, { status: 404 });
    return NextResponse.json({ data: { e1, e2 } });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
