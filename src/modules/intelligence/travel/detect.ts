const TIMEZONE_COUNTRY: Record<string, { label: string; flag: string }> = {
  'Europe/Rome': { label: 'Italy', flag: '🇮🇹' },
  'Europe/Paris': { label: 'France', flag: '🇫🇷' },
  'Europe/London': { label: 'United Kingdom', flag: '🇬🇧' },
  'Europe/Berlin': { label: 'Germany', flag: '🇩🇪' },
  'Europe/Madrid': { label: 'Spain', flag: '🇪🇸' },
  'America/New_York': { label: 'United States', flag: '🇺🇸' },
  'America/Los_Angeles': { label: 'United States', flag: '🇺🇸' },
  'America/Chicago': { label: 'United States', flag: '🇺🇸' },
  'America/Denver': { label: 'United States', flag: '🇺🇸' },
  'America/Toronto': { label: 'Canada', flag: '🇨🇦' },
  'America/Mexico_City': { label: 'Mexico', flag: '🇲🇽' },
  'America/Sao_Paulo': { label: 'Brazil', flag: '🇧🇷' },
  'Asia/Tokyo': { label: 'Japan', flag: '🇯🇵' },
  'Asia/Seoul': { label: 'South Korea', flag: '🇰🇷' },
  'Asia/Shanghai': { label: 'China', flag: '🇨🇳' },
  'Asia/Dubai': { label: 'UAE', flag: '🇦🇪' },
  'Australia/Sydney': { label: 'Australia', flag: '🇦🇺' },
  'Pacific/Auckland': { label: 'New Zealand', flag: '🇳🇿' },
}

export type TravelLocation = {
  timezone: string
  countryLabel: string
  flag: string
  isAbroad: boolean
}

export function resolveTravelLocation(
  currentTimezone: string,
  homeTimezone: string,
): TravelLocation {
  const mapped = TIMEZONE_COUNTRY[currentTimezone]
  const isAbroad = currentTimezone !== homeTimezone
  if (mapped) {
    return {
      timezone: currentTimezone,
      countryLabel: mapped.label,
      flag: mapped.flag,
      isAbroad,
    }
  }
  const region = currentTimezone.split('/').pop()?.replace(/_/g, ' ') ?? 'somewhere new'
  return {
    timezone: currentTimezone,
    countryLabel: region,
    flag: '🌍',
    isAbroad,
  }
}

export function detectDateChange(lastDateKey: string, currentDateKey: string): boolean {
  return lastDateKey !== '' && lastDateKey !== currentDateKey
}

export function detectTimezoneChange(lastTz: string, currentTz: string): boolean {
  return lastTz !== '' && lastTz !== currentTz
}
