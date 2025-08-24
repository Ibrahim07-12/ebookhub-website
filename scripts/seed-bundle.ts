import { db } from '../lib/drizzle';
import { categories } from '../lib/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const seedCategories = [
    {
      id: 'bisnis-entrepreneurship',
      name: 'Bisnis & Entrepreneurship',
      slug: 'bisnis-entrepreneurship',
      description: 'Ebook bisnis dan entrepreneurship, 100+ ebook.',
      image: '',
      ebookCount: 100,
      price: 15000,
      originalPrice: 30000,
      driveLink: 'https://drive.google.com/drive/folders/1o_O_lwAVqiyZxJEBnE-9aws5lScSMmH-?usp=drive_link',
    },
    {
      id: 'digital-marketing',
      name: 'Digital Marketing',
      slug: 'digital-marketing',
      description: 'Ebook digital marketing, 100+ ebook.',
      image: '',
      ebookCount: 100,
      price: 12000,
      originalPrice: 24000,
      driveLink: 'https://drive.google.com/drive/folders/1SU3EbZ1TCsZ4TL1RTb3rcd_Bc4eeq5vj?usp=drive_link',
    },
    {
      id: 'kesehatan-lifestyle',
      name: 'Kesehatan & Lifestyle',
      slug: 'kesehatan-lifestyle',
      description: 'Ebook kesehatan dan lifestyle, 100+ ebook.',
      image: '',
      ebookCount: 100,
      price: 10000,
      originalPrice: 20000,
      driveLink: 'https://drive.google.com/drive/folders/13kHX_d1BjAtS1mxObgia91-zyhVkeMu7?usp=drive_link',
    },
    {
      id: 'keuangan-investasi',
      name: 'Keuangan & Investasi',
      slug: 'keuangan-investasi',
      description: 'Ebook keuangan dan investasi, 100+ ebook.',
      image: '',
      ebookCount: 100,
      price: 15000,
      originalPrice: 30000,
      driveLink: 'https://drive.google.com/drive/folders/1Qnlow_bAjXCwnpHOy2b1t0c809ETPRZI?usp=drive_link',
    },
    {
      id: 'kreatif-desain',
      name: 'Kreatif & Desain',
      slug: 'kreatif-desain',
      description: 'Ebook kreatif dan desain, 100+ ebook.',
      image: '',
      ebookCount: 100,
      price: 12000,
      originalPrice: 24000,
      driveLink: 'https://drive.google.com/drive/folders/1ZK5V5sj33pQecTkgxuKHBqgCbLDXaYF1?usp=drive_link',
    },
    {
      id: 'pendidikan-pengembangan-diri',
      name: 'Pendidikan & Pengembangan Diri',
      slug: 'pendidikan-pengembangan-diri',
      description: 'Ebook pendidikan dan pengembangan diri, 100+ ebook.',
      image: '',
      ebookCount: 100,
      price: 10000,
      originalPrice: 20000,
      driveLink: 'https://drive.google.com/drive/folders/1hVzrqSDMcQhGVO_f_v9GU7634aiXShRi?usp=drive_link',
    },
    {
      id: 'teknologi-programming',
      name: 'Teknologi & Programming',
      slug: 'teknologi-programming',
      description: 'Ebook teknologi dan programming, 100+ ebook.',
      image: '',
      ebookCount: 100,
      price: 15000,
      originalPrice: 30000,
      driveLink: 'https://drive.google.com/drive/folders/1ul9fwSLw_FPHRlj2y4BjXI4-XGWDOyU8?usp=drive_link',
    },
    {
      id: 'bundle-special-7-kategori',
      name: 'Bundle Special 7 Kategori',
      slug: 'bundle-special-7-kategori',
      description: 'Akses semua ebook dari 7 kategori sekaligus, 700+ ebook.',
      image: '',
      ebookCount: 700,
      price: 70000,
      originalPrice: 105000,
      driveLink: 'https://drive.google.com/drive/folders/12y1UhgfJHQNf2fYwpflKN8C6cMo8u9yV?usp=drive_link',
    },
  ];

  for (const cat of seedCategories) {
    const existing = await db.select().from(categories).where(eq(categories.slug, cat.slug)).limit(1);
    if (existing.length === 0) {
      await db.insert(categories).values(cat);
      console.log(`Kategori ${cat.name} berhasil ditambahkan!`);
    } else {
      console.log(`Kategori ${cat.name} sudah ada.`);
    }
  }

  console.log('🎉 Seed bundle completed!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
