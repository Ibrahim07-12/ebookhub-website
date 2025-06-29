import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  {
    name: "Programming & Technology",
    description: "Comprehensive collection of programming tutorials, web development guides, software engineering principles, and latest technology trends. Perfect for developers, students, and tech enthusiasts.",
    price: 50000,
    originalPrice: 150000,
    driveLink: "https://drive.google.com/drive/folders/your-programming-folder",
    ebookCount: 150,
    image: "/images/programming.jpg"
  },
  {
    name: "Business & Entrepreneurship", 
    description: "Essential business strategies, startup guides, marketing principles, leadership skills, and entrepreneurship insights from successful business leaders and industry experts.",
    price: 75000,
    originalPrice: 200000,
    driveLink: "https://drive.google.com/drive/folders/your-business-folder",
    ebookCount: 120,
    image: "/images/business.jpg"
  },
  {
    name: "Personal Development",
    description: "Transform your life with books on productivity, motivation, habits, goal setting, time management, and personal growth from renowned authors and life coaches.",
    price: 45000,
    originalPrice: 120000,
    driveLink: "https://drive.google.com/drive/folders/your-personal-dev-folder",
    ebookCount: 100,
    image: "/images/personal-dev.jpg"
  },
  {
    name: "Health & Fitness",
    description: "Complete health and wellness guides covering nutrition, exercise routines, mental health, yoga, meditation, and healthy lifestyle practices for optimal well-being.",
    price: 60000,
    originalPrice: 180000,
    driveLink: "https://drive.google.com/drive/folders/your-health-folder",
    ebookCount: 90,
    image: "/images/health.jpg"
  },
  {
    name: "Finance & Investment",
    description: "Master your finances with expert guides on personal finance, investment strategies, cryptocurrency, stock market analysis, and wealth building techniques.",
    price: 80000,
    originalPrice: 250000,
    driveLink: "https://drive.google.com/drive/folders/your-finance-folder",
    ebookCount: 110,
    image: "/images/finance.jpg"
  },
  {
    name: "Design & Creativity",
    description: "Unleash your creative potential with books on graphic design, UI/UX principles, photography, digital art, creative writing, and innovative design thinking.",
    price: 55000,
    originalPrice: 160000,
    driveLink: "https://drive.google.com/drive/folders/your-design-folder",
    ebookCount: 85,
    image: "/images/design.jpg"
  },
  {
    name: "Marketing & Sales",
    description: "Advanced marketing strategies, digital marketing techniques, sales psychology, social media marketing, content creation, and customer acquisition methods.",
    price: 70000,
    originalPrice: 190000,
    driveLink: "https://drive.google.com/drive/folders/your-marketing-folder",
    ebookCount: 95,
    image: "/images/marketing.jpg"
  }
]

async function main() {
  console.log('🌱 Starting seed...')
  
  // Clear existing categories
  await prisma.category.deleteMany()
  console.log('🗑️  Cleared existing categories')
  
  // Create categories
  for (const category of categories) {
    const created = await prisma.category.create({
      data: category,
    })
    console.log(`✅ Created category: ${created.name}`)
  }
  
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
