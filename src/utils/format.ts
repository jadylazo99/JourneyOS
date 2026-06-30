export function formatPercent(value: number | null, decimals = 1): string {
  if (value == null) return '—'
  return `${value.toFixed(decimals)}%`
}

export function formatPounds(value: number | null, suffix = ' lb'): string {
  if (value == null) return '—'
  return `${value}${suffix}`
}
