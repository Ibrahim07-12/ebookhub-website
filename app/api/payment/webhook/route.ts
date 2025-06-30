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

    // Find the purchase by order_id, include user & category
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

    // Update status jika pembayaran sukses
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      await prisma.purchase.update({
        where: { orderId: order_id },
        data: { status: 'success' },
      });

      // Kirim email link download ke user (handle null email)
      if (purchase.user.email) {
        await sendEbookEmail({
          userEmail: purchase.user.email,
          userName: purchase.user.name || purchase.user.email,
          categoryName: purchase.category.name,
          driveLink: purchase.category.driveLink,
          orderId: order_id,
        });
      } else {
        console.error('User email is null, cannot send ebook email.');
      }
    } else if (transaction_status === 'pending') {
      await prisma.purchase.update({
        where: { orderId: order_id },
        data: { status: 'pending' },
      });
    } else if (transaction_status === 'expire' || transaction_status === 'cancel') {
      await prisma.purchase.update({
        where: { orderId: order_id },
        data: { status: 'failed' },
      });
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
