import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Eksik bilgi kontrolü
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing info' }, { status: 400 });
    }

    // Kullanıcı zaten var mı kontrolü
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 422 });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 12);

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      }
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("KAYIT SIRASINDA HATA:", error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}