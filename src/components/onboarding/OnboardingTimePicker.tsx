import { cn } from '@/utils/cn'
import type { KeyboardEvent } from 'react'

interface OnboardingTimePickerProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
}

function formatDisplayTime(value: string): string | null {
  if (!value) return null
  const [hours, minutes] = value.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return `${h}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function OnboardingTimePicker({ value, onChange, onSubmit }: OnboardingTimePickerProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault()
      onSubmit()
    }
  }

  const display = formatDisplayTime(value)

  return (
    <div className="space-y-4">
      {display && (
        <p className="text-center text-4xl font-semibold text-white tabular-nums tracking-tight">
          {display}
        </p>
      )}

      <div
        className={cn('relative rounded-2xl border border-white/15 overflow-hidden h-14')}
        style={{ background: 'rgba(255, 255, 255, 0.06)' }}
      >
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full h-full px-4 text-base font-medium text-white',
            'bg-transparent focus:outline-none',
            '[color-scheme:dark]',
            '[&::-webkit-calendar-picker-indicator]:opacity-60',
            '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
            '[&::-webkit-calendar-picker-indicator]:invert',
          )}
        />
      </div>
    </div>
  )
}
