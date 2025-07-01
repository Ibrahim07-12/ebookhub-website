const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  // Cek apakah sudah ada kategori bundle
  const existing = await prisma.category.findFirst({
    where: {
      slug: 'bundle-7-kategori',
    },
  });
  if (existing) {
    console.log('Kategori bundle sudah ada.');
    await prisma.$disconnect();
    return;
  }
  await prisma.category.create({
    data: {
      name: 'Bundle 7 Kategori',
      slug: 'bundle-7-kategori',
      description: 'Akses semua ebook dari 7 kategori sekaligus.',
      image: '',
      ebookCount: 0,
      price: 60000,
      originalPrice: 120000,
      driveLink: '',
    },
  });
  console.log('Kategori bundle berhasil ditambahkan!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
