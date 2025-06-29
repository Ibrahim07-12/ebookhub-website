"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams?.get('order_id');

  const handleRetryPayment = () => {
    if (orderId) {
      // Redirect back to payment page to retry
      router.push(`/payment/retry?order_id=${orderId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="h-12 w-12 text-red-600" />
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Pembayaran Gagal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Maaf, terjadi kesalahan saat memproses pembayaran Anda. 
              Silakan coba lagi atau hubungi customer service kami.
            </p>
          </motion.div>

          {/* Error Details */}
          {orderId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Detail Error
              </h3>
              <div className="text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Order ID:</span>
                  <span className="font-mono text-sm">{orderId}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Possible Causes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-4">
              Kemungkinan Penyebab:
            </h3>
            <ul className="text-left text-orange-700 dark:text-orange-300 space-y-2 text-sm">
              <li>• Saldo kartu kredit/debit tidak mencukupi</li>
              <li>• Koneksi internet terputus saat transaksi</li>
              <li>• Pembayaran dibatalkan oleh pengguna</li>
              <li>• Masalah teknis pada payment gateway</li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <button
              onClick={handleRetryPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Coba Lagi</span>
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali ke Beranda</span>
            </button>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Butuh bantuan? Hubungi customer service kami di{" "}
              <a 
                href="mailto:support@ebookblajr.com" 
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                support@ebookblajr.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
