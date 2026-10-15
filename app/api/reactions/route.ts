import { NextResponse, NextRequest } from 'next/server';
import { listReactions, findReactionPair, createReaction, deleteReaction, getElementById, reactionExists } from '@/lib/db';
import { validateReaction } from '@/types/game';
import { authorizeRequest } from '@/lib/auth';

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

export async function POST(request: NextRequest) {
  // Authorization check
  const auth = authorizeRequest(request);
  if (!auth.authorized) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = validateReaction(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { element1Id, element2Id } = parsed.value;

  // Validate that both elements exist
  const [element1, element2] = await Promise.all([
    getElementById(element1Id),
    getElementById(element2Id),
  ]);

  if (!element1) {
    return NextResponse.json(
      { error: `Referenced element not found: ${element1Id}` },
      { status: 400 }
    );
  }

  if (!element2) {
    return NextResponse.json(
      { error: `Referenced element not found: ${element2Id}` },
      { status: 400 }
    );
  }

  // Validate that no duplicate normalized pair exists
  if (await reactionExists(element1Id, element2Id)) {
    return NextResponse.json(
      { error: 'Duplicate reaction: this element pair already exists' },
      { status: 409 }
    );
  }

  const created = await createReaction(parsed.value);
  return NextResponse.json({ data: created }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  // Authorization check
  const auth = authorizeRequest(request);
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const e1 = searchParams.get('e1');
  const e2 = searchParams.get('e2');
  if (!e1 || !e2) return NextResponse.json({ error: 'e1 and e2 query params are required' }, { status: 400 });
   
  // Optional: Check if reaction exists before attempting delete (for better error message)
  const exists = await reactionExists(e1, e2);
  if (!exists) {
    return NextResponse.json({ error: 'Reaction not found' }, { status: 404 });
  }
  
  const removed = await deleteReaction(e1, e2);
  if (!removed) return NextResponse.json({ error: 'Reaction not found' }, { status: 404 });
  return NextResponse.json({ data: { e1, e2 } });
}