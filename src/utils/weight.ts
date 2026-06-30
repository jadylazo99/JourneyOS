/** Weight input helpers — preserve exact decimal values, never round. */

export function sanitizeWeightInput(raw: string): string {
  let value = raw.replace(/[^\d.]/g, '')
  const dotIndex = value.indexOf('.')
  if (dotIndex !== -1) {
    const before = value.slice(0, dotIndex + 1)
    const after = value.slice(dotIndex + 1).replace(/\./g, '')
    value = before + after
  }
  const [whole, decimal] = value.split('.')
  if (decimal !== undefined) {
    value = `${whole}.${decimal.slice(0, 1)}`
  }
  return value
}

export function isValidWeightString(value: string): boolean {
  if (!value.trim()) return false
  if (!/^\d+(\.\d)?$/.test(value)) return false
  const num = parseFloat(value)
  return !isNaN(num) && num > 0
}

export function parseWeightExact(value: string): number | null {
  const sanitized = sanitizeWeightInput(value)
  if (!isValidWeightString(sanitized)) return null
  return parseFloat(sanitized)
}

export function formatWeightLb(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return ''
  return `${num} lb`
}
