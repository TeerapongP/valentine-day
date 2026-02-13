// Script to encode secrets
// Run: npx tsx scripts/encode-secrets.ts

function xorEncode(text: string, key: string): string {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    )
  }
  return Buffer.from(result).toString('base64')
}

const key = 'valentine2026'
const secret1 = '03112023'
const secret2 = '26062000'

console.log('Encoded secrets:')
console.log('SECRET_1:', xorEncode(secret1, key))
console.log('SECRET_2:', xorEncode(secret2, key))

// Verify decoding
function xorDecode(encoded: string, key: string): string {
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
  let result = ''
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(
      decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    )
  }
  return result
}

console.log('\nVerification:')
console.log('Decoded SECRET_1:', xorDecode(xorEncode(secret1, key), key))
console.log('Decoded SECRET_2:', xorDecode(xorEncode(secret2, key), key))
