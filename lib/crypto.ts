// Simple obfuscation utility
export function encodeSecret(text: string): string {
  return Buffer.from(text).toString('base64')
    .split('').reverse().join('')
}

export function decodeSecret(encoded: string): string {
  return Buffer.from(
    encoded.split('').reverse().join(''),
    'base64'
  ).toString('utf-8')
}

// Advanced obfuscation with XOR
export function xorEncode(text: string, key: string): string {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    )
  }
  return Buffer.from(result).toString('base64')
}

export function xorDecode(encoded: string, key: string): string {
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
  let result = ''
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(
      decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    )
  }
  return result
}
