import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';

// Midtrans configuration
const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
const midtransIsProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const midtransBaseUrl = midtransIsProduction 
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { categoryId, amount } = await request.json();

    if (!categoryId || !amount) {
      return NextResponse.json(
        { error: 'Category ID and amount are required' },
        { status: 400 }
      );
    }

    // Get category details
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if amount matches category price
    if (amount !== category.price) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create purchase record in database
    const purchase = await prisma.purchase.create({
      data: {
        userId: session.user.id,
        categoryId: category.id,
        orderId,
        amount,
        status: 'pending',
      },
    });

    // Send order confirmation email
    // try {
    //   await sendOrderConfirmationEmail({
    //     userEmail: session.user.email!,
    //     userName: session.user.name || 'Customer',
    //     categoryName: category.name,
    //     orderId: orderId,
    //     amount: amount
    //   });
    //   console.log('Order confirmation email sent to:', session.user.email);
    // } catch (emailError) {
    //   console.error('Failed to send order confirmation email:', emailError);
    //   // Don't fail the order if email fails
    // }

    // For now, return dummy response since we don't have real Midtrans keys
    if (!midtransServerKey || midtransServerKey.includes('dummy')) {
      return NextResponse.json({
        message: 'Payment simulation - Midtrans keys not configured',
        token: 'dummy-token',
        redirect_url: `/payment/success?order_id=${orderId}`,
        order_id: orderId,
      });
    }

    // Prepare Midtrans payload
    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        email: session.user.email,
        first_name: session.user.name || session.user.email,
      },
      item_details: [
        {
          id: category.id,
          price: amount,
          quantity: 1,
          name: category.name,
        },
      ],
    };

    // Call Midtrans Snap API
    const response = await fetch(midtransBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization':
          'Basic ' + Buffer.from(midtransServerKey + ':').toString('base64'),
      },
      body: JSON.stringify(payload),
    });
    const midtransRes = await response.json();

    if (!midtransRes.token) {
      return NextResponse.json({ error: 'Failed to create transaction', midtransRes }, { status: 500 });
    }

    // Return snap_token to frontend
    return NextResponse.json({ snap_token: midtransRes.token, redirect_url: midtransRes.redirect_url, orderId });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
