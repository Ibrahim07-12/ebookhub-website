import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle';
import { purchases, categories } from '@/lib/schema';
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

    // Get user's purchases
    const userId = session.user.id;
    const purchaseArr = await db.select().from(purchases).where(eq(purchases.userId, userId));
    // Fetch all categories for user's purchases
    const categoryIds = purchaseArr.map(p => p.categoryId).filter((id): id is string => typeof id === 'string');
    let categoryArr: any[] = [];
    if (categoryIds.length > 0) {
      const { inArray } = await import('drizzle-orm');
      categoryArr = await db.select().from(categories).where(inArray(categories.id, categoryIds));
    }
    // Map category to purchase
    const purchasesWithCategory = purchaseArr.map(p => {
      const cat = categoryArr.find(c => c.id === p.categoryId) || {};
      return {
        ...p,
        category: cat,
      };
    });
    // Sort by createdAt desc
    purchasesWithCategory.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));
    return NextResponse.json(purchasesWithCategory);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}