import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed categories
  const categories = [
    {
      name: "Bisnis & Entrepreneurship",
      description: "Panduan lengkap untuk membangun dan mengembangkan bisnis Anda",
      image: "/images/business-entrepreneurship.jpg",
      slug: "bisnis-entrepreneurship",
      ebookCount: 100,
      price: 15000,
      originalPrice: 15000,
      driveLink: "https://drive.google.com/drive/folders/1o_O_lwAVqiyZxJEBnE-9aws5lScSMmH-?usp=drive_link"
    },
    {
      name: "Digital Marketing",
      description: "Strategi marketing digital untuk meningkatkan penjualan online",
      image: "/images/digital-marketing.jpg",
      slug: "digital-marketing",
      ebookCount: 100,
      price: 12000,
      originalPrice: 12000,
      driveLink: "https://drive.google.com/drive/folders/1SU3EbZ1TCsZ4TL1RTb3rcd_Bc4eeq5vj?usp=drive_link"
    },
    {
      name: "Kesehatan & Lifestyle",
      description: "Tips kesehatan, gaya hidup sehat, dan wellness untuk kehidupan yang lebih baik",
      image: "/images/health-lifestyle.jpg",
      slug: "kesehatan-lifestyle",
      ebookCount: 100,
      price: 10000,
      originalPrice: 10000,
      driveLink: "https://drive.google.com/drive/folders/13kHX_d1BjAtS1mxObgia91-zyhVkeMu7?usp=drive_link"
    },
    {
      name: "Keuangan & Investasi",
      description: "Panduan mengelola keuangan pribadi dan strategi investasi yang menguntungkan",
      image: "/images/finance-investment.jpg",
      slug: "keuangan-investasi",
      ebookCount: 100,
      price: 15000,
      originalPrice: 15000,
      driveLink: "https://drive.google.com/drive/folders/1Qnlow_bAjXCwnpHOy2b1t0c809ETPRZI?usp=drive_link"
    },
    {
      name: "Kreatif & Desain",
      description: "Teknik desain grafis, UI/UX, dan pengembangan kreativitas visual",
      image: "/images/creative-design.jpg",
      slug: "kreatif-desain",
      ebookCount: 100,
      price: 12000,
      originalPrice: 12000,
      driveLink: "https://drive.google.com/drive/folders/1ZK5V5sj33pQecTkgxuKHBqgCbLDXaYF1?usp=drive_link"
    },
    {
      name: "Pendidikan & Pengembangan Diri",
      description: "Pengembangan diri, skill building, dan pembelajaran berkelanjutan",
      image: "/images/education-self-development.jpg",
      slug: "pendidikan-pengembangan-diri",
      ebookCount: 100,
      price: 10000,
      originalPrice: 10000,
      driveLink: "https://drive.google.com/drive/folders/1hVzrqSDMcQhGVO_f_v9GU7634aiXShRi?usp=drive_link"
    },
    {
      name: "Teknologi & Programming",
      description: "Panduan programming, teknologi terbaru, dan pengembangan software",
      image: "/images/technology-programming.jpg",
      slug: "teknologi-programming",
      ebookCount: 100,
      price: 15000,
      originalPrice: 15000,
      driveLink: "https://drive.google.com/drive/folders/1ul9fwSLw_FPHRlj2y4BjXI4-XGWDOyU8?usp=drive_link"
    }
  ]

  console.log('🌱 Starting seed...')

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        image: category.image,
        slug: category.slug,
        ebookCount: category.ebookCount,
        price: category.price,
        originalPrice: category.originalPrice,
        driveLink: category.driveLink,
      },
      create: {
        name: category.name,
        description: category.description,
        image: category.image,
        slug: category.slug,
        ebookCount: category.ebookCount,
        price: category.price,
        originalPrice: category.originalPrice,
        driveLink: category.driveLink,
      },
    })
    console.log(`✅ Created/Updated category: ${category.name}`)
  }

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
