import { NextResponse } from 'next/server';

// Piston API'nin URL'si
const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

export async function POST(request: Request) {
  try {
    // Frontend'den gelen isteğin body'sini JSON olarak oku
    const { language, sourceCode, version = "*" } = await request.json();

    // Gerekli bilgiler eksikse hata döndür
    if (!language || !sourceCode) {
      return NextResponse.json(
        { message: 'Language and source code are required.' },
        { status: 400 }
      );
    }

    // Piston API'sine gönderilecek veri yapısı
    const pistonRequestBody = {
      language: language,
      version: version, // Belirtilmezse en son sürümü kullanır
      files: [
        {
          name: "main", // Dosya adı önemli değil ama olması gerekiyor
          content: sourceCode,
        },
      ],
    };

    // Piston API'sine POST isteği gönder
    const response = await fetch(PISTON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pistonRequestBody),
    });

    // Cevabı JSON olarak al
    const data = await response.json();

    // Piston'dan gelen sonucu frontend'e geri gönder
    return NextResponse.json(data);

  } catch (error) {
    console.error("Piston API Error:", error);
    // Herhangi bir hata durumunda sunucu hatası olarak geri bildirim yap
    return NextResponse.json(
      { message: 'An error occurred while executing the code.' },
      { status: 500 }
    );
  }
}