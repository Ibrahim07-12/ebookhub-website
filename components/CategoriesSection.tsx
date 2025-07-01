"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Code, Palette, Briefcase, Cpu, User, Heart, DollarSign, ShoppingCart, Percent } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  ebookCount: number;
  price: number;
  originalPrice: number;
  driveLink: string;
}

const iconMap: { [key: string]: any } = {
  "Teknologi & Programming": Code,
  "Kreatif & Desain": Palette,
  "Bisnis & Entrepreneurship": Briefcase,
  "Digital Marketing": Cpu,
  "Pendidikan & Pengembangan Diri": User,
  "Kesehatan & Lifestyle": Heart,
  "Keuangan & Investasi": DollarSign,
};

const colorMap: { [key: string]: { color: string; hoverColor: string } } = {
  "Teknologi & Programming": { color: "from-blue-500 to-blue-600", hoverColor: "hover:from-blue-600 hover:to-blue-700" },
  "Kreatif & Desain": { color: "from-purple-500 to-purple-600", hoverColor: "hover:from-purple-600 hover:to-purple-700" },
  "Bisnis & Entrepreneurship": { color: "from-green-500 to-green-600", hoverColor: "hover:from-green-600 hover:to-green-700" },
  "Digital Marketing": { color: "from-orange-500 to-orange-600", hoverColor: "hover:from-orange-600 hover:to-orange-700" },
  "Pendidikan & Pengembangan Diri": { color: "from-pink-500 to-pink-600", hoverColor: "hover:from-pink-600 hover:to-pink-700" },
  "Kesehatan & Lifestyle": { color: "from-red-500 to-red-600", hoverColor: "hover:from-red-600 hover:to-red-700" },
  "Keuangan & Investasi": { color: "from-yellow-500 to-yellow-600", hoverColor: "hover:from-yellow-600 hover:to-yellow-700" },
};

// Map for custom originalPrice display (not from DB)
const customOriginalPrices: { [key: string]: number } = {
  "Bisnis & Entrepreneurship": 40000,
  "Digital Marketing": 50000,
  "Kesehatan & Lifestyle": 45000,
  "Keuangan & Investasi": 50000,
  "Kreatif & Desain": 35000,
  "Pendidikan & Pengembangan Diri": 45000,
  "Teknologi & Programming": 40000,
};

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hapus 'Rp' dari formatPrice agar tidak double
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDiscountPercentage = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const handleBuyNow = (category: Category) => {
    if (status === "loading") {
      return; // Don't do anything while loading
    }
    
    if (!session) {
      // User not logged in, redirect to login with callback
      window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(`/payment?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}&price=${category.price}`)}`;
      return;
    }
    
    // User is logged in, redirect to payment page
    window.location.href = `/payment?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}&price=${category.price}`;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-300 rounded-2xl h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Pilih <span className="text-blue-600">Kategori Ebook</span> Favorit Anda
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Dapatkan koleksi premium ebook berkualitas tinggi dari para ahli. 
            Setiap kategori berisi 100+ ebook pilihan dengan harga spesial!
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories
            .filter(category => category.slug !== 'bundel-spesial-7-kategori')
            .map((category, index) => {
              const IconComponent = iconMap[category.name] || Briefcase;
              const colors = colorMap[category.name] || { color: "from-gray-500 to-gray-600", hoverColor: "hover:from-gray-600 hover:to-gray-700" };
              // Use custom originalPrice for display
              const displayOriginalPrice = customOriginalPrices[category.name] ?? category.originalPrice;
              const discountPercentage = displayOriginalPrice > 0 ? Math.round(((displayOriginalPrice - category.price) / displayOriginalPrice) * 100) : 0;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className={`relative bg-gradient-to-br ${colors.color} ${colors.hoverColor} rounded-2xl p-6 text-white shadow-xl transition-all duration-300 cursor-pointer group`}
                >
                  {/* Discount Badge */}
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
                    <Percent className="h-3 w-3" />
                    <span>% {discountPercentage} OFF</span>
                  </div>

                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-4">
                      <IconComponent className="h-12 w-12" />
                    </div>
                    {/* Category Info */}
                    <h3 className="text-xl font-bold mb-2 leading-tight">{category.name}</h3>
                    <p className="text-white/80 mb-4 text-sm line-clamp-2">{category.description}</p>
                    {/* Ebook Count */}
                    <div className="mb-4">
                      <div className="text-2xl font-bold">{category.ebookCount}+</div>
                      <div className="text-white/80 text-sm">Premium Ebooks</div>
                    </div>
                    {/* Price Section */}
                    <div className="mb-6">
                      <div className="flex flex-col gap-1 mb-2">
                        <span className="text-3xl font-extrabold text-white">Rp {formatPrice(category.price)}</span>
                        <span className="text-xl font-bold text-white/70 line-through">Rp {formatPrice(displayOriginalPrice)}</span>
                        <span className="mt-1 px-3 py-1 inline-block rounded-full bg-white/20 text-white text-xs font-semibold w-fit">Hemat Rp {formatPrice(displayOriginalPrice - category.price)}</span>
                      </div>
                    </div>
                    {/* Buy Button */}
                    <button 
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group-hover:bg-white group-hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleBuyNow(category)}
                      disabled={status === "loading"}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>
                        {status === "loading" ? "Loading..." : 
                         !session ? "Login & Beli" : 
                         "Beli Sekarang"}
                      </span>
                    </button>
                  </div>
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              );
            })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ingin semua kategori? Dapatkan paket bundle dengan diskon lebih besar!
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            Lihat Paket Bundle
          </button>
        </motion.div>
      </div>
    </section>
  );
}
