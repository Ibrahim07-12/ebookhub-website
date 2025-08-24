'use client';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function AboutSection() {
  const router = useRouter();
  const { data: session } = useSession();
  const [bundle, setBundle] = useState<any>(null);
  const BUNDLE_ID = "cmenx3kgr0007u4y0j30ofkg5";

  useEffect(() => {
    async function fetchBundle() {
      try {
        const res = await fetch(`/api/categories/${BUNDLE_ID}`);
        if (res.ok) {
          const data = await res.json();
          setBundle(data);
        }
      } catch (err) {}
    }
    fetchBundle();
  }, []);

  const handleBundleClick = () => {
    if (!session?.user) {
      router.push("/auth/login?callbackUrl=/payment/bundle");
    } else {
      router.push("/payment/bundle");
    }
  };
  return (
    <section id="about" className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Tentang <span className="italic text-blue-600">EbookBlajr</span></h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          <span className="font-bold text-blue-600">EbookBlajr</span> adalah platform jual beli ebook edukasi digital dengan sistem bundel kategori. Setiap pembelian bundel kategori akan terus mendapatkan update ebook terbaru tanpa biaya tambahan—ebook baru otomatis masuk ke Google Drive Anda!
        </p>
        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <div className="text-xl font-bold text-white mb-1">{bundle ? bundle.name : "Bundel Spesial!"}</div>
            <div className="text-2xl md:text-3xl font-extrabold text-white mb-2">{bundle ? bundle.name : "7 Kategori Ebook"} Hanya <span className="bg-white/20 px-2 py-1 rounded">{bundle ? `Rp${bundle.price?.toLocaleString('id-ID')}` : "Rp60.000"}</span></div>
            <div className="text-white/80">{bundle ? bundle.description : "Akses ratusan ebook dari 7 kategori: Bisnis, Marketing, Kesehatan, Keuangan, Kreatif, Pendidikan, Teknologi. Semua update ebook baru otomatis masuk ke Drive Anda!"}</div>
          </div>
          <button
            onClick={handleBundleClick}
            className="mt-4 md:mt-0 px-6 py-3 bg-white text-pink-600 font-bold rounded-lg shadow hover:bg-pink-50 transition"
          >
            Beli Bundel Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
