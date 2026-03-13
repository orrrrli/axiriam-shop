import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getItems, createItem } from '@/lib/services/inventory.service';
import { validateItemBody } from '@/lib/utils/inventory';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') return null;
  return session;
}

export async function GET() {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ items: await getItems() });
  } catch (error) {
    console.error('GET /api/admin/inventory/items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const validationError = validateItemBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError.message, code: validationError.code, field: validationError.field }, { status: 400 });
    }
    return NextResponse.json({ item: await createItem(body) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/inventory/items:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
