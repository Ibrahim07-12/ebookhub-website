
const { db } = require('../lib/drizzle');
const { categories } = require('../lib/schema');
const { eq } = require('drizzle-orm');

async function main() {
  const catArr = await db.select().from(categories).where(eq(categories.name, 'Bundle Special 7 Kategori')).limit(1);
  const cat = catArr[0];
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
