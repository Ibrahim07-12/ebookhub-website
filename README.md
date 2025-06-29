# 📚 Ebook Hub Website

> Modern e-commerce platform for digital ebook sales with integrated payment system and automated delivery

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

## 🚀 Live Demo

**🌐 Website:** [Coming Soon - Deploy to Vercel](https://your-domain.vercel.app)

## 📋 Features

### 🎯 Core Features
- **7 Ebook Categories** with discounted pricing
- **Dual Authentication** (Google OAuth + Custom)
- **Midtrans Payment Integration** (Sandbox & Production)
- **Automated Email Delivery** (Order confirmation + Ebook download)
- **Purchase History Dashboard** 
- **Real-time Payment Status** tracking
- **Responsive Design** (Mobile & Desktop)

### 💡 Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Prisma ORM** with MySQL
- **NextAuth.js** for authentication
- **Nodemailer** for email service
- **Railway** for database hosting

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | Full-stack Framework | 15.3.4 |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety | 5.0+ |
| [Tailwind CSS](https://tailwindcss.com/) | Styling | 3.4+ |
| [Prisma](https://www.prisma.io/) | Database ORM | 5.0+ |
| [NextAuth.js](https://next-auth.js.org/) | Authentication | 4.24+ |
| [Framer Motion](https://www.framer.com/motion/) | Animations | 11.0+ |
| [Midtrans](https://midtrans.com/) | Payment Gateway | Latest |
| [Nodemailer](https://nodemailer.com/) | Email Service | 6.9+ |
| [Railway](https://railway.app/) | Database Hosting | - |
| [Vercel](https://vercel.com/) | Deployment | - |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL database (Railway recommended)
- Gmail account for email service
- Midtrans account for payments
- Google Cloud Console for OAuth

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ibrahim07-12/ebookhub-website.git
cd ebookhub-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
# Copy environment variables template
cp .env.example .env.local
```

4. **Configure environment variables in .env.local**
```env
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Midtrans
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_IS_PRODUCTION=false

# Email
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-app-password"
```

5. **Database setup**
```bash
npx prisma db push
npx prisma generate
npm run seed
```

6. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📊 Database Schema

### Categories
- 7 predefined ebook categories
- Pricing with discount system
- Google Drive integration for file storage

### Purchases
- Order tracking with unique order IDs
- Payment status management
- Email delivery automation

## 🎨 Features Overview

### 🏠 Homepage
- Modern hero section with call-to-action
- Category grid with discount badges
- Responsive design with smooth animations

### 🔐 Authentication
- Google OAuth integration
- Custom login/register forms
- Password validation and security

### 💳 Payment Flow
- Midtrans payment gateway integration
- Real-time status updates
- Professional success/error pages

### 📊 Dashboard
- Purchase history tracking
- Download link management
- Order status monitoring

## 🔧 API Documentation

### Public Endpoints
```
GET  /api/categories          # Get all categories
GET  /api/categories/[id]     # Get category by ID
```

### Protected Endpoints
```
POST /api/payment/create      # Create payment
GET  /api/payment/status      # Check payment status
GET  /api/purchase           # Get user purchases
```

### Webhook Endpoints
```
POST /api/payment/webhook     # Midtrans notification
POST /api/webhook/midtrans    # Alternative webhook
```

## 📧 Email System

- **Order Confirmation** - Professional HTML template sent after order creation
- **Ebook Delivery** - Download instructions with Google Drive links
- **Gmail SMTP** integration with app passwords

## 🚀 Deployment

### Quick Deploy to Vercel

1. **Deploy to Vercel**
```bash
npx vercel
```

2. **Configure environment variables** in Vercel dashboard
3. **Update external services** (Google OAuth, Midtrans webhook URLs)

📖 **Detailed deployment guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🧪 Testing

```bash
# Development server
npm run dev

# Production build test
npm run build

# Database seeding
npm run seed
```

## 🛡️ Security

- Environment variables for sensitive data
- Protected API routes with authentication
- Input validation and sanitization
- Webhook signature verification
- SQL injection prevention with Prisma

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 💬 Support

- **Documentation**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/Ibrahim07-12/ebookhub-website/issues)

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

⭐ **Star this repo if you find it helpful!**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
