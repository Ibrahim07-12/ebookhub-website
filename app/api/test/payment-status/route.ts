import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle';
import { purchases, users, categories } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { sendEbookEmail } from '@/lib/email';

// This is a test endpoint to simulate Midtrans webhook for testing purposes
// Should be removed in production
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Find the purchase
    const purchaseArr = await db.select().from(purchases).where(eq(purchases.orderId, orderId));
    const purchase = purchaseArr[0];
    let user = null;
    let category = null;
    if (purchase) {
      if (purchase.userId) {
        const userArr = await db.select().from(users).where(eq(users.id, purchase.userId));
        user = userArr[0] || null;
      }
      if (purchase.categoryId) {
        const categoryArr = await db.select().from(categories).where(eq(categories.id, purchase.categoryId));
        category = categoryArr[0] || null;
      }
    }

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    // Only allow the owner to update the status
    if (purchase.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update purchase status
    await db.update(purchases).set({
      status: status,
      transactionId: `TEST-${Date.now()}`,
      paymentType: 'bank_transfer',
      updatedAt: new Date()
    }).where(eq(purchases.id, purchase.id));
    // Fetch updated purchase
    const updatedArr = await db.select().from(purchases).where(eq(purchases.id, purchase.id));
    const updatedPurchase = updatedArr[0];

    // If payment is successful, send ebook email
    if (status === 'success' && purchase.status !== 'success') {
      try {
        await sendEbookEmail({
          userEmail: user?.email || '',
          userName: user?.name || 'Customer',
          categoryName: category?.name || '',
          driveLink: category?.driveLink || '',
          orderId: orderId
        });
        
        console.log('Test ebook email sent to:', user?.email);
      } catch (emailError) {
        console.error('Failed to send test ebook email:', emailError);
        return NextResponse.json(
          { error: 'Failed to send email', purchase: updatedPurchase },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: 'Status updated successfully',
      purchase: { ...updatedPurchase, user, category },
      emailSent: status === 'success'
    });

  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
