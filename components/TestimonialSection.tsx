"use client";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Testimonial {
  name: string;
  username: string;
  avatar: string;
  message: string;
  verified?: boolean;
  rating: number;
}

const initialTestimonials: Testimonial[] = [
  {
    name: "Andi",
    username: "@andiedu",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    message: "EbookHub sangat membantu belajar dan koleksi ebooknya selalu update!",
    verified: true,
    rating: 5,
  },
  {
    name: "Siti",
    username: "@siti_ebook",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    message: "Bundel 7 kategori sangat worth it, ebook baru langsung masuk ke Drive!",
    verified: true,
    rating: 5,
  },
];

export function TestimonialSection() {
  const { data: session } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll effect
  useEffect(() => {
    if (!scrollRef.current) return;
    const scroll = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 1) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 2, behavior: "smooth" });
      }
    };
    scrollInterval.current = setInterval(scroll, 30);
    return () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
  }, [testimonials.length]);

  // Navigasi panah
  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = session?.user;
    const displayName = user?.name || name;
    const displayUsername = user?.email ? `@${user.email.split("@")[0]}` : (username || "@anonim");
    const displayAvatar = user?.image || avatar || "https://randomuser.me/api/portraits/lego/1.jpg";
    if (!displayName || !message) return;
    setTestimonials([
      {
        name: displayName,
        username: displayUsername,
        avatar: displayAvatar,
        message,
        verified: !!user,
        rating,
      },
      ...testimonials,
    ]);
    setName("");
    setUsername("");
    setAvatar("");
    setMessage("");
    setRating(5);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }

  return (
    <section className="py-16 bg-black" id="testimoni">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center">Apa kata mereka?</h2>
        <form onSubmit={handleSubmit} className="mb-10 bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            {!session?.user && (
              <input
                type="text"
                placeholder="Nama Anda"
                className="flex-1 px-4 py-2 rounded border border-gray-700 bg-gray-900 text-white"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            )}
            {!session?.user && (
              <input
                type="text"
                placeholder="@username (opsional)"
                className="flex-1 px-4 py-2 rounded border border-gray-700 bg-gray-900 text-white"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            )}
            {!session?.user && (
              <input
                type="text"
                placeholder="Link foto profil (opsional)"
                className="flex-1 px-4 py-2 rounded border border-gray-700 bg-gray-900 text-white"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
              />
            )}
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? "text-yellow-400" : "text-gray-700"}
                  aria-label={`Beri rating ${star} bintang`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            placeholder="Tulis testimoni Anda..."
            className="px-4 py-2 rounded border border-gray-700 bg-gray-900 text-white min-h-[60px]"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
          <button type="submit" className="self-end px-6 py-2 bg-pink-600 text-white font-bold rounded-lg shadow hover:bg-pink-700 transition">Kirim Testimoni</button>
          {success && <div className="text-green-400 font-semibold text-sm mt-2">Testimoni berhasil dikirim!</div>}
        </form>
        <div className="relative">
          <button
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white rounded-full p-2 shadow-lg hidden md:block"
            onClick={() => scrollByAmount(-320)}
            style={{ left: -24 }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div ref={scrollRef} className="flex gap-x-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex-shrink-0 w-80 flex flex-col h-full min-h-[220px] shadow-lg">
                <div className="flex items-center mb-3">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-800" />
                  <div className="ml-3">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white text-lg">{t.name}</span>
                      {t.verified && (
                        <svg className="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a2 2 0 0 1 1.73 1l.54.93a2 2 0 0 0 1.1.9l1.03.34a2 2 0 0 1 1.18 2.6l-.34 1.03a2 2 0 0 0 0 1.26l.34 1.03a2 2 0 0 1-1.18 2.6l-1.03.34a2 2 0 0 0-1.1.9l-.54.93A2 2 0 0 1 10 18a2 2 0 0 1-1.73-1l-.54-.93a2 2 0 0 0-1.1-.9l-1.03-.34a2 2 0 0 1-1.18-2.6l.34-1.03a2 2 0 0 0 0-1.26l-.34-1.03a2 2 0 0 1 1.18-2.6l1.03-.34a2 2 0 0 0 1.1-.9l.54-.93A2 2 0 0 1 10 2zm-1 8.59l-1.3-1.3a1 1 0 1 1 1.42-1.42l.59.58 2.3-2.29a1 1 0 1 1 1.42 1.42l-3 3a1 1 0 0 1-1.42 0z" /></svg>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">{t.username}</div>
                  </div>
                </div>
                <div className="text-gray-200 text-base mb-2 flex-1">{t.message}</div>
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={star <= t.rating ? "text-yellow-400" : "text-gray-700"}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white rounded-full p-2 shadow-lg hidden md:block"
            onClick={() => scrollByAmount(320)}
            style={{ right: -24 }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
