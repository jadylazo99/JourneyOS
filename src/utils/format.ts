export function formatPercent(value: number | null, decimals = 1): string {
  if (value == null) return '—'
  return `${value.toFixed(decimals)}%`
}

export function formatPounds(value: number | null, suffix = ' lb', decimals = 1): string {
  if (value == null) return '—'
  return `${value.toFixed(decimals)}${suffix}`
}

export function formatWeightNumber(value: number | null, decimals = 1): string {
  if (value == null) return '—'
  return value.toFixed(decimals)
}
