"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Download, Mail, ArrowLeft } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<any>(null);
  
  const orderId = searchParams?.get('order_id');

  useEffect(() => {
    if (orderId) {
      fetchPurchaseDetails();
    } else {
      router.push('/');
    }
  }, [orderId]);

  const fetchPurchaseDetails = async () => {
    try {
      const response = await fetch(`/api/payment/status?order_id=${orderId}`);
      const data = await response.json();
      
      if (response.ok) {
        setPurchase(data);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching purchase details:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Pembayaran Berhasil!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Terima kasih atas pembelian Anda. Transaksi telah berhasil diproses.
            </p>
          </motion.div>

          {/* Purchase Details */}
          {purchase && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Detail Pembelian
              </h3>
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Order ID:</span>
                  <span className="font-mono text-sm">{purchase.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Kategori:</span>
                  <span className="font-semibold">{purchase.category?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Jumlah:</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(purchase.amount)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Mail className="h-5 w-5" />
              <span className="font-semibold">Link download sedang dikirim ke email Anda</span>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mohon periksa inbox dan folder spam email Anda
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 space-y-4"
          >
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali ke Beranda</span>
            </button>
            
            <button
              onClick={() => router.push('/my-purchases')}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Lihat Pembelian Saya</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
