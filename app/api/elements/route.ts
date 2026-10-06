import { NextResponse } from 'next/server';
import { listElements } from '../../../src/lib/db';

export async function GET() {
  const elements = await listElements();
  return NextResponse.json({ data: elements });
}
