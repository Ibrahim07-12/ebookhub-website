import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendEbookEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify Midtrans signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error('MIDTRANS_SERVER_KEY not found');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      transaction_id,
      payment_type,
      transaction_time
    } = body;

    // Create signature hash for verification
    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    // Verify signature (skip verification if using dummy key for development)
    if (serverKey !== 'dummy-server-key' && hash !== signature_key) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('Midtrans webhook received:', {
      order_id,
      transaction_status,
      payment_type,
      transaction_time
    });

    // Find the purchase by order_id
    const purchase = await prisma.purchase.findUnique({
      where: { orderId: order_id },
      include: {
        user: true,
        category: true
      }
    });

    if (!purchase) {
      console.error('Purchase not found for order_id:', order_id);
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }

    // Update purchase status based on transaction_status
    let newStatus: string;
    
    switch (transaction_status) {
      case 'capture':
      case 'settlement':
        newStatus = 'success';
        break;
      case 'pending':
        newStatus = 'pending';
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
      case 'failure':
        newStatus = 'failed';
        break;
      default:
        newStatus = 'pending';
    }

    // Update purchase in database
    const updatedPurchase = await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        status: newStatus,
        transactionId: transaction_id,
        paymentType: payment_type,
        updatedAt: new Date()
      },
      include: {
        user: true,
        category: true
      }
    });

    // If payment is successful, send ebook email
    if (newStatus === 'success' && purchase.status !== 'success') {
      try {
        await sendEbookEmail({
          userEmail: updatedPurchase.user.email!,
          userName: updatedPurchase.user.name || 'Customer',
          categoryName: updatedPurchase.category.name,
          driveLink: updatedPurchase.category.driveLink || '',
          orderId: order_id
        });
        
        console.log('Ebook email sent to:', updatedPurchase.user.email);
      } catch (emailError) {
        console.error('Failed to send ebook email:', emailError);
        // Don't fail the webhook if email fails
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
