// types/midtrans.d.ts

interface Window {
  snap?: {
    pay: (...args: any[]) => void;
    // Tambahkan method lain jika diperlukan
  };
}
