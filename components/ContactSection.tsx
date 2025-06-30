import React from "react";
import { Mail, Instagram, Twitter } from "lucide-react";

export function ContactSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950" id="contact">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Hubungi Kami
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Ada pertanyaan, kritik, atau saran? Silakan hubungi kami melalui salah
          satu kontak berikut:
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          <a
            href="mailto:support@ebookblajr.com"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition text-lg justify-center"
          >
            <Mail className="w-5 h-5" /> support@ebookblajr.com
          </a>
          <a
            href="https://instagram.com/ebookblajr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-lg shadow hover:from-pink-600 hover:to-yellow-600 transition text-lg justify-center"
          >
            <Instagram className="w-5 h-5" /> @ebookblajr
          </a>
          <a
            href="https://twitter.com/ebookblajr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition text-lg justify-center"
          >
            <Twitter className="w-5 h-5" /> @ebookblajr
          </a>
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-sm mt-4">
          Kami akan membalas pesan Anda secepat mungkin pada jam kerja.
        </div>
      </div>
    </section>
  );
}
