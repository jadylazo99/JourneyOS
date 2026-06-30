import { cn } from '@/utils/cn'
import type { KeyboardEvent } from 'react'

interface OnboardingDatePickerProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
}

export function OnboardingDatePicker({ value, onChange, onSubmit }: OnboardingDatePickerProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault()
      onSubmit()
    }
  }

  const displayValue = value
    ? new Date(value + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="space-y-3">
      {displayValue && (
        <p className="text-center text-sm font-medium text-accent/90">{displayValue}</p>
      )}

      <div
        className={cn('relative rounded-2xl border border-white/15 overflow-hidden h-14')}
        style={{ background: 'rgba(255, 255, 255, 0.06)' }}
      >
        <input
          type="date"
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
