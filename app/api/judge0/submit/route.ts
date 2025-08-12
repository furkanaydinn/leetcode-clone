import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { source_code, language_id } = await req.json()

  try {
    const response = await fetch(
      'http://localhost:2358/submissions/?base64_encoded=false&wait=true',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_code, language_id }),
      }
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}