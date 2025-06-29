"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentPendingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams?.get('order_id');

  const handleCheckStatus = () => {
    if (orderId) {
      // Refresh to check status
      window.location.reload();
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
          {/* Pending Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Clock className="h-12 w-12 text-yellow-600" />
          </motion.div>

          {/* Pending Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Pembayaran Diproses
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Pembayaran Anda sedang diproses. Mohon tunggu beberapa saat 
              atau cek status pembayaran Anda.
            </p>
          </motion.div>

          {/* Order Details */}
          {orderId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Detail Transaksi
              </h3>
              <div className="text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Order ID:</span>
                  <span className="font-mono text-sm">{orderId}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Status Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
              Status Pembayaran:
            </h3>
            <ul className="text-left text-blue-700 dark:text-blue-300 space-y-2 text-sm">
              <li>• Bank Transfer: Tunggu konfirmasi bank (5-15 menit)</li>
              <li>• E-Wallet: Proses otomatis (1-3 menit)</li>
              <li>• Credit Card: Verifikasi dalam proses</li>
              <li>• Virtual Account: Menunggu pembayaran</li>
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
              onClick={handleCheckStatus}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Cek Status Pembayaran</span>
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali ke Beranda</span>
            </button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pembayaran tidak berubah dalam 30 menit? Hubungi{" "}
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
