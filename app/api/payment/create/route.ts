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

    const { categoryId, amount, isBundle, bundleName } = await request.json();

    if (!amount || (!isBundle && !categoryId)) {
      return NextResponse.json(
        { error: 'Amount is required, and categoryId is required for non-bundle.' },
        { status: 400 }
      );
    }

    // Get category details
    if (!isBundle) {
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
    }

    // HANDLE BUNDLE ORDER
    if (isBundle) {
      // Cari kategori bundle berdasarkan nama/slug persis
      const bundleCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { name: bundleName || "Bundel Spesial 7 Kategori" },
            { slug: bundleName?.toLowerCase().replace(/ /g, '-') || "bundel-spesial-7-kategori" },
            { slug: "bundel-spesial-7-kategori" },
            { name: "Bundel Spesial 7 Kategori" },
          ],
        },
      });
      if (!bundleCategory) {
        return NextResponse.json(
          { error: 'Bundle category not found' },
          { status: 404 }
        );
      }
      // Cek harga (pastikan number, bukan string)
      // console.log('amount:', amount, typeof amount, 'bundleCategory.price:', bundleCategory.price, typeof bundleCategory.price);
      // if (parseInt(amount) !== parseInt(bundleCategory.price)) {
      //   return NextResponse.json(
      //     { error: `Invalid amount for bundle. Dikirim: ${amount}, DB: ${bundleCategory.price}` },
      //     { status: 400 }
      //   );
      // }
      // Generate unique order ID
      const orderId = `ORDER-BUNDLE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      // Create purchase record
      const purchase = await prisma.purchase.create({
        data: {
          userId: session.user.id,
          categoryId: bundleCategory.id,
          orderId,
          amount: Number(amount),
          status: 'pending',
        },
      });
      // Prepare Midtrans payload
      const payload = {
        transaction_details: {
          order_id: orderId,
          gross_amount: Number(amount),
        },
        customer_details: {
          email: session.user.email,
          first_name: session.user.name || session.user.email,
        },
        item_details: [
          {
            id: bundleCategory.id,
            price: Number(amount),
            quantity: 1,
            name: bundleCategory.name,
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
      console.log('Midtrans response:', midtransRes); // Tambah log detail
      if (!midtransRes.token) {
        return NextResponse.json({ error: midtransRes.status_message || 'Failed to create transaction', midtransRes }, { status: 500 });
      }
      return NextResponse.json({ snapToken: midtransRes.token, redirect_url: midtransRes.redirect_url, orderId });
    }

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create purchase record in database
    const purchase = await prisma.purchase.create({
      data: {
        userId: session.user.id,
        categoryId: categoryId,
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
          id: categoryId,
          price: amount,
          quantity: 1,
          name: categoryId,
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
