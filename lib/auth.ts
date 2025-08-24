import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "./drizzle"
import { users } from "./schema"
import { eq } from "drizzle-orm"

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Sudah dihapus, bisa tambahkan Drizzle adapter jika ingin
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[AUTH] Email/password kosong");
          return null;
        }

        const userArr = await db.select().from(users).where(eq(users.email, credentials.email));
        const user = userArr[0];

        if (!user || !user.password) {
          console.error("[AUTH] User tidak ditemukan atau password kosong", credentials.email);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          console.error("[AUTH] Password salah", credentials.email);
          return null;
        }

        // Tambahkan log user yang dikembalikan
        console.log("[AUTH] User dikembalikan ke NextAuth authorize:", {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = (token.image as string) || null;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow sign in for Google provider
      if (account?.provider === "google") {
        return true
      }
      // Allow sign in for Credentials provider
      if (account?.provider === "credentials") {
        return true
      }
      return true
    },
  },
  debug: process.env.NODE_ENV === "development",
}
