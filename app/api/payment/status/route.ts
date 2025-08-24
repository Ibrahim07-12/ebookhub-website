import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle';
import { purchases, categories, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Find purchase record
    const purchaseArr = await db.select().from(purchases).where(eq(purchases.orderId, orderId));
    const purchase = purchaseArr[0];
    let category = null;
    let user = null;
    if (purchase) {
      if (purchase.categoryId) {
        const categoryArr = await db.select().from(categories).where(eq(categories.id, purchase.categoryId));
        category = categoryArr[0] || null;
      }
      if (purchase.userId) {
        const userArr = await db.select().from(users).where(eq(users.id, purchase.userId));
        user = userArr[0] || null;
      }
    }

    if (!purchase || purchase.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

  return NextResponse.json({ ...purchase, category, user });

  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
