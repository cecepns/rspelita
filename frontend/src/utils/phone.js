export function normalizePhoneDigits(raw) {
  if (!raw) return ''
  return String(raw).replace(/\D+/g, '')
}

export function toIndonesianMsisdn(raw) {
  const digits = normalizePhoneDigits(raw)
  if (!digits) return ''
  if (digits.startsWith('62')) return digits
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  if (digits.startsWith('8')) return `62${digits}`
  return digits
}

export function buildTelHref(raw) {
  const digits = normalizePhoneDigits(raw)
  if (!digits) return undefined
  return `tel:${digits}`
}

export function buildWhatsAppHref(raw) {
  const msisdn = toIndonesianMsisdn(raw)
  if (!msisdn) return undefined
  return `https://wa.me/${msisdn}`
}

