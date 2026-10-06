import { NextResponse } from 'next/server';
import { listReactions, findReactionPair } from '@/lib/db';

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
