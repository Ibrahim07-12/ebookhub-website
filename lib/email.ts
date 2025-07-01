import nodemailer from 'nodemailer';

interface SendEbookEmailParams {
  userEmail: string;
  userName: string;
  categoryName: string;
  driveLink: string;
  orderId: string;
}

export async function sendEbookEmail({
  userEmail,
  userName,
  categoryName,
  driveLink,
  orderId
}: SendEbookEmailParams) {
  // Create transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password from .env
    },
  });

  // Email template
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ebook Purchase Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .download-btn { 
          display: inline-block; 
          background: #28a745; 
          color: white; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: 5px; 
          margin: 20px 0;
          font-weight: bold;
        }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .order-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Pembelian Berhasil!</h1>
          <p>Terima kasih atas pembelian Anda</p>
        </div>
        
        <div class="content">
          <h2>Halo ${userName}!</h2>
          
          <p>Pembayaran Anda telah berhasil diproses. Berikut adalah detail pembelian Anda:</p>
          
          <div class="order-info">
            <h3>📚 Detail Pembelian</h3>
            <p><strong>Kategori Ebook:</strong> ${categoryName}</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Status:</strong> ✅ Berhasil</p>
          </div>
          
          <p>Anda dapat mengunduh ebook Anda melalui link Google Drive di bawah ini:</p>
          
          <div style="text-align: center;">
            <a href="${driveLink}" class="download-btn" target="_blank">
              📥 Download Ebook Sekarang
            </a>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>📝 Instruksi Download:</h4>
            <ol>
              <li>Klik tombol "Download Ebook Sekarang" di atas</li>
              <li>Anda akan diarahkan ke Google Drive</li>
              <li>Klik "Download" atau "Unduh" untuk menyimpan file</li>
              <li>Nikmati ebook Anda!</li>
            </ol>
          </div>
          
          <p><strong>Catatan:</strong> Link download ini berlaku selamanya. Anda dapat mengaksesnya kapan saja.</p>
          
          <p>Jika Anda mengalami kesulitan dalam mengunduh atau memiliki pertanyaan, jangan ragu untuk menghubungi kami.</p>
          
          <p>Terima kasih telah berbelanja di toko ebook kami!</p>
        </div>
        
        <div class="footer">
          <p>Email ini dikirim otomatis, mohon jangan membalas email ini.</p>
          <p>© 2024 Ebook Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send email
  const mailOptions = {
    from: `"Ebook Store" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `✅ Ebook ${categoryName} - Download Link`,
    html: htmlTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Function to send order confirmation email (saat order dibuat)
export async function sendOrderConfirmationEmail({
  userEmail,
  userName,
  categoryName,
  orderId,
  amount
}: {
  userEmail: string;
  userName: string;
  categoryName: string;
  orderId: string;
  amount: number;
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Konfirmasi Pesanan</h1>
          <p>Pesanan Anda sedang diproses</p>
        </div>
        
        <div class="content">
          <h2>Halo ${userName}!</h2>
          
          <p>Terima kasih telah memesan ebook dari kami. Berikut adalah detail pesanan Anda:</p>
          
          <div class="order-info">
            <h3>📚 Detail Pesanan</h3>
            <p><strong>Kategori Ebook:</strong> ${categoryName}</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Jumlah:</strong> Rp ${amount.toLocaleString('id-ID')}</p>
            <p><strong>Status:</strong> ⏳ Menunggu Pembayaran</p>
          </div>
          
          <p>Silakan selesaikan pembayaran Anda. Setelah pembayaran berhasil, kami akan mengirimkan link download ebook ke email ini.</p>
          
          <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.</p>
        </div>
        
        <div class="footer">
          <p>Email ini dikirim otomatis, mohon jangan membalas email ini.</p>
          <p>© 2024 Ebook Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Ebook Store" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `📋 Konfirmasi Pesanan - ${categoryName} (${orderId})`,
    html: htmlTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

// Fungsi untuk mengirim email bundle 7 kategori
export async function sendBundleEmail({
  userEmail,
  userName,
  orderId,
  bundleLinks
}: {
  userEmail: string;
  userName: string;
  orderId: string;
  bundleLinks: { name: string; driveLink: string }[];
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bundle Ebook 7 Kategori</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ffb347 0%, #ff5e62 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .drive-link { margin-bottom: 12px; }
        .drive-link a { color: #1976d2; font-weight: bold; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Selamat! Pembelian Bundle 7 Kategori Berhasil</h1>
          <p>Terima kasih atas pembelian bundle ebook premium Anda</p>
        </div>
        <div class="content">
          <h2>Halo ${userName}!</h2>
          <p>Pembayaran Anda telah berhasil diproses. Berikut adalah link Google Drive untuk semua kategori:</p>
          <div class="order-info">
            <h3>📚 Link Download 7 Kategori</h3>
            <ul style="padding-left: 18px;">
              ${bundleLinks.map(link => `<li class="drive-link"><span>${link.name}:</span> <a href="${link.driveLink}" target="_blank">${link.driveLink}</a></li>`).join('')}
            </ul>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Status:</strong> ✅ Berhasil</p>
          </div>
          <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>📝 Instruksi Download:</h4>
            <ol>
              <li>Klik link pada masing-masing kategori di atas</li>
              <li>Anda akan diarahkan ke Google Drive</li>
              <li>Klik "Download" atau "Unduh" untuk menyimpan file</li>
              <li>Nikmati semua ebook premium Anda!</li>
            </ol>
          </div>
          <p><strong>Catatan:</strong> Semua link berlaku selamanya. Anda dapat mengaksesnya kapan saja.</p>
          <p>Jika Anda mengalami kesulitan dalam mengunduh atau memiliki pertanyaan, jangan ragu untuk menghubungi kami.</p>
          <p>Terima kasih telah berbelanja di toko ebook kami!</p>
        </div>
        <div class="footer">
          <p>Email ini dikirim otomatis, mohon jangan membalas email ini.</p>
          <p>© 2024 Ebook Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Ebook Store" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `✅ Bundle 7 Kategori Ebook - Semua Link Download`,
    html: htmlTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Bundle email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending bundle email:', error);
    throw error;
  }
}
