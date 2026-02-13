import { NextRequest, NextResponse } from 'next/server'
import { xorDecode } from '@/lib/crypto'

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    
    // Obfuscated secrets - decoded at runtime
    const key = 'valentine2026'
    const secret1 = xorDecode('RlJdVFxEW10=', key) // 03112023
    const secret2 = xorDecode('RFdcU1xEWV4=', key) // 26062000
    
    const isValid = secret === secret1 || secret === secret2
    
    return NextResponse.json({ valid: isValid })
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }
}
