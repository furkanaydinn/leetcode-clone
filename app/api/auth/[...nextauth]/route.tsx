// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma'; // Prisma client'ınızın yolu
import bcrypt from 'bcrypt';

const handler = NextAuth({
  providers: [
    // 1. Google Provider'ınız burada kalabilir
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // 2. Email/Şifre için CredentialsProvider'ı EKLEYİN
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Kullanıcı giriş yapmaya çalıştığında bu kod çalışır
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Geçersiz giriş bilgileri');
        }

        // Kullanıcıyı veritabanında ara (register rotasının kaydettiği kullanıcı)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('Geçersiz giriş bilgileri');
        }

        // Gelen şifre ile veritabanındaki hash'lenmiş şifreyi karşılaştır
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) {
          throw new Error('Geçersiz giriş bilgileri');
        }

        // Her şey doğruysa, kullanıcı objesini döndür
        return user;
      }
    })
  ],
  // Session yönetimi ve diğer ayarlar
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };