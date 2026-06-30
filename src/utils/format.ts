export function roundToDecimals(value: number, decimals = 1): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export function formatPercent(value: number | null, decimals = 1): string {
  if (value == null) return '—'
  return `${roundToDecimals(value, decimals).toFixed(decimals)}%`
}

export function formatPounds(value: number | null, suffix = ' lb', decimals = 1): string {
  if (value == null) return '—'
  return `${roundToDecimals(value, decimals).toFixed(decimals)}${suffix}`
}

export function formatWeightNumber(value: number | null, decimals = 1): string {
  if (value == null) return '—'
  return roundToDecimals(value, decimals).toFixed(decimals)
}
