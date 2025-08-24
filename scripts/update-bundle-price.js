
const { db } = require('../lib/drizzle');
const { categories } = require('../lib/schema');
const { eq } = require('drizzle-orm');

async function main() {
  const result = await db.update(categories)
    .set({ price: 60000 })
    .where(eq(categories.name, 'Bundle Special 7 Kategori'));
  console.log(`Harga bundle 7 kategori diubah ke 60.000.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
