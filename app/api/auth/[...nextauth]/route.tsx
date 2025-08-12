// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// Diğer sağlayıcıları (Credentials, Github vb.) buraya import edebilirsiniz.

const handler = NextAuth({
  providers: [
    // Kullanmak istediğiniz giriş yöntemlerini buraya ekleyin
    // ÖRNEK: Google ile giriş
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Buraya email/şifre için CredentialsProvider ekleyebilirsiniz
  ],
  // secret, pages, callbacks gibi diğer ayarları buraya ekleyebilirsiniz.
});

export { handler as GET, handler as POST };