import { NextResponse } from 'next/server';
import { listReactions, findReactionPair, createReaction, deleteReaction } from '@/lib/db';
import { validateReaction } from '@/types/game';

export async function GET(request: Request) {
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
  const body = await request.json().catch(() => null);
  const parsed = validateReaction(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const created = await createReaction(parsed.value);
  return NextResponse.json({ data: created }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const e1 = searchParams.get('e1');
  const e2 = searchParams.get('e2');
  if (!e1 || !e2) return NextResponse.json({ error: 'e1 and e2 query params are required' }, { status: 400 });
  const removed = await deleteReaction(e1, e2);
  if (!removed) return NextResponse.json({ error: 'Reaction not found' }, { status: 404 });
  return NextResponse.json({ data: { e1, e2 } });
}

