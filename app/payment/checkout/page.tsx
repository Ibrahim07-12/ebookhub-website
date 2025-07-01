'use client';
import { Suspense, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const BUNDLE_ORIGINAL_PRICE = 120000;
const BUNDLE_DISCOUNT_PRICE = 60000;
const BUNDLE_SAVING = BUNDLE_ORIGINAL_PRICE - BUNDLE_DISCOUNT_PRICE;

function PaymentCheckoutContent() {
  const searchParams = useSearchParams();
  const bundle = searchParams.get('bundle');
  const [loading, setLoading] = useState(false);

  const handlePay = useCallback(async () => {
    setLoading(true);
    try {
      let bundleName = '';
      let amount = 0;
      if (bundle === 'bundel-spesial-7-kategori') {
        bundleName = 'Bundel Spesial 7 Kategori';
        amount = BUNDLE_DISCOUNT_PRICE;
      }
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isBundle: true,
          bundleName,
          amount,
        }),
      });
      const data = await res.json();
      if (data.error && data.midtransRes) {
        alert('Gagal memulai pembayaran: ' + (data.midtransRes.status_message || data.error));
        return;
      }
      if (!data.snapToken && !data.snap_token) throw new Error('Gagal mendapatkan snap token');
      const snapToken = data.snapToken || data.snap_token;
      const snapJsUrl = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js';
      if (typeof window !== 'undefined' && window.snap) {
        window.snap.pay(snapToken);
      } else {
        const script = document.createElement('script');
        script.src = snapJsUrl;
        script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
        script.onload = () => {
          if (window.snap) {
            window.snap.pay(snapToken);
          }
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert('Gagal memulai pembayaran: ' + msg);
    } finally {
      setLoading(false);
    }
  }, []);

  if (bundle === 'bundel-spesial-7-kategori') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B1120]">
        <h1 className="text-4xl font-bold text-white mb-4">Checkout Pembayaran</h1>
        <p className="text-lg text-gray-300 mb-8">Selesaikan pembayaran untuk mendapatkan akses ke ebook premium</p>
        <div className="bg-[#181C2A] rounded-xl p-8 flex flex-col md:flex-row gap-8 w-full max-w-3xl">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-white mb-2">Ringkasan Pesanan</h2>
            <div className="mb-4 p-4 rounded-lg bg-[#23263A]">
              <div className="text-lg font-bold text-white mb-1">Bundel Spesial 7 Kategori</div>
              <div className="text-white/80 mb-2">Akses ratusan ebook dari 7 kategori: Bisnis, Marketing, Kesehatan, Keuangan, Kreatif, Pendidikan, Teknologi. Semua update ebook baru otomatis masuk ke Drive Anda!</div>
              <div className="text-white/60 text-sm mb-2">0+ Premium Ebooks</div>
              <div className="mb-2">
                <span className="text-gray-400 line-through mr-2">Rp {BUNDLE_ORIGINAL_PRICE.toLocaleString('id-ID')}</span>
                <span className="text-2xl font-bold text-blue-400">Rp {BUNDLE_DISCOUNT_PRICE.toLocaleString('id-ID')}</span>
              </div>
              <div className="text-green-400 font-semibold mb-2">Hemat Rp {BUNDLE_SAVING.toLocaleString('id-ID')}</div>
            </div>
            <div className="text-xl font-bold text-white mt-4">Total Pembayaran <span className="text-blue-400">Rp {BUNDLE_DISCOUNT_PRICE.toLocaleString('id-ID')}</span></div>
            <div className="text-green-400 font-semibold mb-4">Hemat Rp {BUNDLE_SAVING.toLocaleString('id-ID')}!</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-white mb-4">Metode Pembayaran</h2>
            <div className="bg-[#23263A] rounded-lg p-4 w-full mb-4">
              <div className="text-white font-bold mb-2">Midtrans Payment Gateway</div>
              <ul className="text-gray-300 text-sm mb-2 list-disc list-inside">
                <li>Pembayaran 100% aman dan terenkripsi</li>
                <li>Akses langsung setelah pembayaran berhasil</li>
                <li>Link download dikirim ke email</li>
              </ul>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition mb-2 disabled:opacity-60"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? 'Memproses...' : `Bayar Sekarang - Rp ${BUNDLE_DISCOUNT_PRICE.toLocaleString('id-ID')}`}
            </button>
            <div className="text-xs text-gray-400 text-center">Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami</div>
          </div>
        </div>
      </div>
    );
  }
  // Jika bukan bundle, bisa tambahkan checkout kategori lain di sini
  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-[#0B1120]">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout tidak ditemukan</h1>
        <p>Silakan kembali dan pilih paket yang ingin dibeli.</p>
      </div>
    </div>
  );
}

export default function PaymentCheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white bg-[#0B1120]">Loading...</div>}>
      <PaymentCheckoutContent />
    </Suspense>
  );
}
