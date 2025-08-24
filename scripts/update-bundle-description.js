
const { db } = require('../lib/drizzle');
const { categories } = require('../lib/schema');
const { eq } = require('drizzle-orm');

async function main() {
  await db.update(categories)
    .set({ description: 'Akses ratusan ebook dari 7 kategori: Bisnis, Marketing, Kesehatan, Keuangan, Kreatif, Pendidikan, Teknologi. Semua update ebook baru otomatis masuk ke Drive Anda!' })
    .where(eq(categories.name, 'Bundle Special 7 Kategori'));
  console.log(`Deskripsi bundle 7 kategori diubah.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
