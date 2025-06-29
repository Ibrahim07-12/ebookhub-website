"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Shield, Clock, CheckCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  ebookCount: number;
}

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const categoryId = searchParams?.get('categoryId');
  const categoryName = searchParams?.get('categoryName');
  const price = searchParams?.get('price');

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push('/');
      return;
    }

    if (!categoryId) {
      router.push('/');
      return;
    }

    fetchCategoryDetails();
  }, [status, session, categoryId]);

  const fetchCategoryDetails = async () => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setCategory(data);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePayment = async () => {
    if (!category || !session) return;
    
    setProcessing(true);
    
    try {
      // Create payment transaction
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: category.id,
          userId: session.user?.id,
          amount: category.price,
        }),
      });

      const data = await response.json();
      
      if (data.token) {
        // Redirect to Midtrans payment page
        window.location.href = data.redirect_url;
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
    } finally {
      setProcessing(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Kategori tidak ditemukan
          </h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Checkout Pembayaran
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Selesaikan pembayaran untuk mendapatkan akses ke ebook premium
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Ringkasan Pesanan
            </h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.ebookCount}+ Premium Ebooks
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(category.originalPrice)}
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatPrice(category.price)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total Pembayaran
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(category.price)}
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Hemat {formatPrice(category.originalPrice - category.price)}!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Metode Pembayaran
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 p-3 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Midtrans Payment Gateway
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Credit Card, Bank Transfer, E-Wallet, dll
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <Shield className="h-5 w-5 text-green-500" />
                <span>Pembayaran 100% aman dan terenkripsi</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="h-5 w-5 text-green-500" />
                <span>Akses langsung setelah pembayaran berhasil</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Link download dikirim ke email</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Bayar Sekarang - {formatPrice(category.price)}</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
