'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Purchase {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  paymentType?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    description: string;
    image: string;
    driveLink: string;
  };
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'success':
      return (
        <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
          ✅ Berhasil
        </span>
      );
    case 'pending':
      return (
        <span className="px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
          ⏳ Pending
        </span>
      );
    case 'failed':
      return (
        <span className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
          ❌ Gagal
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
          ⚪ {status}
        </span>
      );
  }
};

export default function MyPurchases() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login');
      return;
    }

    fetchPurchases();
  }, [session, status, router]);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchase');
      if (!response.ok) {
        throw new Error('Failed to fetch purchases');
      }
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setError('Gagal memuat data pembelian');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Pembelian Saya</h1>
            <p className="text-gray-600">Riwayat pembelian ebook Anda</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 m-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {purchases.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Pembelian</h3>
                <p className="text-gray-600 mb-6">Anda belum melakukan pembelian ebook</p>
                <Link 
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Jelajahi Ebook
                </Link>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid gap-6">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <img
                              src={purchase.category.image}
                              alt={purchase.category.name}
                              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {purchase.category.name}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2">
                                {purchase.category.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <span>Order ID: {purchase.orderId}</span>
                                <span>•</span>
                                <span>{new Date(purchase.createdAt).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</span>
                                {purchase.paymentType && (
                                  <>
                                    <span>•</span>
                                    <span className="capitalize">{purchase.paymentType}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end space-y-3">
                          <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto">
                            <span className="text-lg font-bold text-gray-900">
                              Rp {purchase.amount.toLocaleString('id-ID')}
                            </span>
                            {getStatusBadge(purchase.status)}
                          </div>
                          
                          {purchase.status === 'success' && purchase.category.driveLink && (
                            <a
                              href={purchase.category.driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download Ebook
                            </a>
                          )}
                          
                          {purchase.status === 'pending' && (
                            <button
                              onClick={() => router.push(`/payment?order_id=${purchase.orderId}`)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              Lanjutkan Pembayaran
                            </button>
                          )}
                          
                          {purchase.status === 'failed' && (
                            <button
                              onClick={() => router.push(`/?category=${purchase.category.id}`)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Beli Ulang
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
