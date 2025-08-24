
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/drizzle';
import { purchases, users, categories } from '../../../../lib/schema';
import { eq } from 'drizzle-orm';
import { sendEbookEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Midtrans webhook received:', JSON.stringify(body, null, 2));

    // Extract orderId and transaction status from Midtrans payload
    const orderId = body.order_id;
    const transactionStatus = body.transaction_status;
    const transactionId = body.transaction_id;
    const paymentType = body.payment_type;

    // Log extracted values
    console.log('Webhook orderId:', orderId);
    console.log('Webhook transactionStatus:', transactionStatus);

    if (!orderId) {
      console.error('No order_id in payload');
      return NextResponse.json({ error: 'No order_id in payload' }, { status: 400 });
    }

    // Find the purchase by orderId
    const purchaseArr = await db.select().from(purchases).where(eq(purchases.orderId, orderId));
    const purchase = purchaseArr[0];

    if (!purchase) {
      console.error('Purchase not found for orderId:', orderId);
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }

    // Only process if not already success and email not sent
    if (purchase.status === 'success' && purchase.emailSent) {
      console.log('Purchase already processed:', orderId);
      return NextResponse.json({ status: 'already processed' });
    }

    // Get user and category
    const userArr = await db.select().from(users).where(eq(users.id, purchase.userId));
    const user = userArr[0];
    const categoryArr = await db.select().from(categories).where(eq(categories.id, purchase.categoryId));
    const category = categoryArr[0];

    // If payment is successful (settlement/capture)
    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      // Update purchase status, transactionId, downloadLink, emailSent
      await db.update(purchases)
        .set({
          status: 'success',
          transactionId,
          paymentType,
          downloadLink: category?.driveLink,
          emailSent: true,
        })
        .where(eq(purchases.id, purchase.id));
      console.log('Purchase updated to success:', orderId);

      // Send email with ebook link (handle null email)
      if (user?.email) {
        try {
          await sendEbookEmail({
            userEmail: user.email,
            userName: user.name || user.email,
            categoryName: category?.name ?? '',
            driveLink: category?.driveLink ?? '',
            orderId: purchase.orderId,
          });
          console.log('Ebook email sent to:', user.email);
        } catch (emailErr) {
          console.error('Failed to send ebook email:', emailErr);
        }
      } else {
        console.error('User email is null, cannot send ebook email.');
      }
    } else {
      // If not success, log status
      console.log('Payment not successful, status:', transactionStatus);
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
