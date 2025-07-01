import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    // Find the purchase by orderId, include user & category
    const purchase = await prisma.purchase.findUnique({
      where: { orderId },
      include: { user: true, category: true },
    });

    if (!purchase) {
      console.error('Purchase not found for orderId:', orderId);
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }

    // Only process if not already success and email not sent
    if (purchase.status === 'success' && purchase.emailSent) {
      console.log('Purchase already processed:', orderId);
      return NextResponse.json({ status: 'already processed' });
    }

    // If payment is successful (settlement/capture)
    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      // Update purchase status, transactionId, downloadLink, emailSent
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          status: 'success',
          transactionId,
          paymentType,
          downloadLink: purchase.category.driveLink,
          emailSent: true,
        },
      });
      console.log('Purchase updated to success:', orderId);

      // Kirim email bundle jika kategori bundle, jika tidak kirim email biasa
      if (purchase.user.email) {
        try {
          if (
            purchase.category.name.toLowerCase().includes('bundle') ||
            purchase.category.slug === 'bundle-7-kategori'
          ) {
            // Kirim email bundle 7 kategori
            const bundleLinks = [
              { name: 'Bisnis & Enterpreneurship', driveLink: 'https://drive.google.com/drive/folders/1o_O_lwAVqiyZxJEBnE-9aws5lScSMmH-?usp=drive_link' },
              { name: 'Digital Marketing', driveLink: 'https://drive.google.com/drive/folders/1SU3EbZ1TCsZ4TL1RTb3rcd_Bc4eeq5vj?usp=drive_link' },
              { name: 'Kesehatan & Lifestyle', driveLink: 'https://drive.google.com/drive/folders/13kHX_d1BjAtS1mxObgia91-zyhVkeMu7?usp=drive_link' },
              { name: 'Keuangan & Investasi', driveLink: 'https://drive.google.com/drive/folders/1Qnlow_bAjXCwnpHOy2b1t0c809ETPRZI?usp=drive_link' },
              { name: 'Kreatif & Desain', driveLink: 'https://drive.google.com/drive/folders/1ZK5V5sj33pQecTkgxuKHBqgCbLDXaYF1?usp=drive_link' },
              { name: 'Pendidikan & Pengembangan Diri', driveLink: 'https://drive.google.com/drive/folders/1hVzrqSDMcQhGVO_f_v9GU7634aiXShRi?usp=drive_link' },
              { name: 'Teknologi & Programming', driveLink: 'https://drive.google.com/drive/folders/1ul9fwSLw_FPHRlj2y4BjXI4-XGWDOyU8?usp=drive_link' },
            ];
            const { sendBundleEmail } = await import('@/lib/email');
            await sendBundleEmail({
              userEmail: purchase.user.email,
              userName: purchase.user.name || purchase.user.email,
              orderId: purchase.orderId,
              bundleLinks,
            });
            console.log('Bundle email sent to:', purchase.user.email);
          } else {
            await sendEbookEmail({
              userEmail: purchase.user.email,
              userName: purchase.user.name || purchase.user.email,
              categoryName: purchase.category.name,
              driveLink: purchase.category.driveLink,
              orderId: purchase.orderId,
            });
            console.log('Ebook email sent to:', purchase.user.email);
          }
        } catch (emailErr) {
          console.error('Failed to send ebook/bundle email:', emailErr);
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
