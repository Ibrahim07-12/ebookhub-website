const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.category.updateMany({
    where: { name: 'Bundle Special 7 Kategori' },
    data: { price: 60000 },
  });
  console.log(`Harga bundle 7 kategori diubah ke 60.000. Jumlah kategori terupdate: ${result.count}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
