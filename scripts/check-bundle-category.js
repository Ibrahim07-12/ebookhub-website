const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cat = await prisma.category.findFirst({
    where: { name: 'Bundle Special 7 Kategori' },
  });
  if (!cat) {
    console.log('Kategori tidak ditemukan!');
  } else {
    console.log('Data kategori Bundle Special 7 Kategori:');
    console.log({
      id: cat.id,
      name: cat.name,
      price: cat.price,
      description: cat.description,
      slug: cat.slug,
      driveLink: cat.driveLink,
      ebookCount: cat.ebookCount,
      originalPrice: cat.originalPrice,
    });
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
