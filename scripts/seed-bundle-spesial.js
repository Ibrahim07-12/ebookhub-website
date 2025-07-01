const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  // Ambil semua kategori
  const allCategories = await prisma.category.findMany();
  // Filter kategori bundle/bundel (case-insensitive)
  const bundleCategories = allCategories.filter((cat) => {
    const name = cat.name.toLowerCase();
    const slug = cat.slug.toLowerCase();
    return (
      name.includes('bundle') ||
      name.includes('bundel') ||
      slug.includes('bundle') ||
      slug.includes('bundel')
    );
  });
  // Hapus kategori yang cocok
  for (const cat of bundleCategories) {
    await prisma.category.delete({ where: { id: cat.id } });
  }
  // Tambahkan kategori bundel spesial baru
  await prisma.category.create({
    data: {
      name: 'Bundel Spesial 7 Kategori',
      slug: 'bundel-spesial-7-kategori',
      description:
        'Akses ratusan ebook dari 7 kategori: Bisnis, Marketing, Kesehatan, Keuangan, Kreatif, Pendidikan, Teknologi. Semua update ebook baru otomatis masuk ke Drive Anda!',
      image: '',
      ebookCount: 0,
      price: 60000,
      originalPrice: 120000,
      driveLink: 'https://drive.google.com/drive/folders/12y1UhgfJHQNf2fYwpflKN8C6cMo8u9yV?usp=drive_link',
    },
  });
  console.log('Kategori Bundel Spesial 7 Kategori berhasil direset dan ditambahkan!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
