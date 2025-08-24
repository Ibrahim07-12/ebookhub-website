import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { purchases, users, categories } from '@/lib/schema';
import { eq } from 'drizzle-orm';
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
    const purchaseArr = await db.select().from(purchases).where(eq(purchases.orderId, order_id));
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
      console.error('Purchase not found for order_id:', order_id);
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }

    // Update status jika pembayaran sukses
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      await db.update(purchases).set({ status: 'success' }).where(eq(purchases.orderId, order_id));
      // Kirim email link download ke user (handle null email)
      if (user?.email) {
        await sendEbookEmail({
          userEmail: user.email,
          userName: user.name || user.email,
          categoryName: category?.name || '',
          driveLink: category?.driveLink || '',
          orderId: order_id,
        });
      } else {
        console.error('User email is null, cannot send ebook email.');
      }
    } else if (transaction_status === 'pending') {
      await db.update(purchases).set({ status: 'pending' }).where(eq(purchases.orderId, order_id));
    } else if (transaction_status === 'expire' || transaction_status === 'cancel') {
      await db.update(purchases).set({ status: 'failed' }).where(eq(purchases.orderId, order_id));
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
