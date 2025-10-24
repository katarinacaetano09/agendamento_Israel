export function sanitizeHex(hex: string | undefined | null) {
  if (!hex) return null
  const cleaned = hex.replace('#', '').trim()
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) return `#${cleaned.toLowerCase()}`
  return null
}

export function hexToRgb(hex: string) {
  const c = hex.replace('#', '')
  return {
    r: parseInt(c.substring(0, 2), 16),
    g: parseInt(c.substring(2, 4), 16),
    b: parseInt(c.substring(4, 6), 16)
  }
}

export function luminanceFromHex(hex: string) {
  const s = sanitizeHex(hex)
  if (!s) return 0.5
  const { r, g, b } = hexToRgb(s)
  const rs = r / 255
  const gs = g / 255
  const bs = b / 255
  const a = [rs, gs, bs].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  if (a.length < 3 || a.some(v => Number.isNaN(v))) return 0.5
  return 0.2126 * a[0]! + 0.7152 * a[1]! + 0.0722 * a[2]!
}

export function readableTextColor(hex: string | undefined | null) {
  const s = sanitizeHex(hex)
  if (!s) return '#000000'
  const lum = luminanceFromHex(s)
  return lum > 0.5 ? '#000000' : '#ffffff'
}
