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
        categoryId: categoryId,
        orderId: orderId,
        amount: amount,
        status: 'pending',
        paymentMethod: 'midtrans',
      },
    });

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        userEmail: session.user.email!,
        userName: session.user.name || 'Customer',
        categoryName: category.name,
        orderId: orderId,
        amount: amount
      });
      console.log('Order confirmation email sent to:', session.user.email);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order if email fails
    }

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
    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: session.user.name || 'Customer',
        email: session.user.email,
      },
      item_details: [
        {
          id: categoryId,
          price: amount,
          quantity: 1,
          name: `Ebook ${category.name}`,
          category: 'Digital Product',
        },
      ],
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL}/payment/success?order_id=${orderId}`,
        error: `${process.env.NEXTAUTH_URL}/payment/error?order_id=${orderId}`,
        pending: `${process.env.NEXTAUTH_URL}/payment/pending?order_id=${orderId}`,
      },
    };

    // Create transaction with Midtrans
    const midtransResponse = await fetch(midtransBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(midtransServerKey + ':').toString('base64')}`,
      },
      body: JSON.stringify(midtransPayload),
    });

    const midtransData = await midtransResponse.json();

    if (!midtransResponse.ok) {
      console.error('Midtrans error:', midtransData);
      
      // Delete the purchase record if Midtrans fails
      await prisma.purchase.delete({
        where: { id: purchase.id },
      });

      return NextResponse.json(
        { error: 'Failed to create payment transaction' },
        { status: 500 }
      );
    }

    // Update purchase record with Midtrans token
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { 
        snapToken: midtransData.token,
      },
    });

    return NextResponse.json({
      token: midtransData.token,
      redirect_url: midtransData.redirect_url,
      order_id: orderId,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
