import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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
    const purchase = await prisma.purchase.findUnique({
      where: { orderId: orderId },
      include: {
        user: true,
        category: true
      }
    });

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
    const updatedPurchase = await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        status: status,
        transactionId: `TEST-${Date.now()}`,
        paymentType: 'bank_transfer',
        updatedAt: new Date()
      },
      include: {
        user: true,
        category: true
      }
    });

    // If payment is successful, send ebook email
    if (status === 'success' && purchase.status !== 'success') {
      try {
        await sendEbookEmail({
          userEmail: updatedPurchase.user.email!,
          userName: updatedPurchase.user.name || 'Customer',
          categoryName: updatedPurchase.category.name,
          driveLink: updatedPurchase.category.driveLink || '',
          orderId: orderId
        });
        
        console.log('Test ebook email sent to:', updatedPurchase.user.email);
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
      purchase: updatedPurchase,
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
