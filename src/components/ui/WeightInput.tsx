import { cn } from '@/utils/cn'
import type { KeyboardEvent } from 'react'
import { sanitizeWeightInput, isValidWeightString } from '@/utils/weight'

interface WeightInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
  inputClassName?: string
  size?: 'md' | 'lg'
  variant?: 'dark' | 'light'
  unit?: string
}

export function WeightInput({
  value,
  onChange,
  onSubmit,
  placeholder = '132.4',
  autoFocus = false,
  className,
  inputClassName,
  size = 'lg',
  variant = 'dark',
  unit = 'lb',
}: WeightInputProps) {
  const handleChange = (raw: string) => {
    onChange(sanitizeWeightInput(raw))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit && isValidWeightString(value)) {
      e.preventDefault()
      onSubmit()
    }
  }

  const isLight = variant === 'light'

  return (
    <div
      className={cn(
        'flex items-center rounded-2xl border overflow-hidden',
        size === 'lg' ? 'h-14' : 'h-12',
        isLight
          ? 'border-slate-200 bg-slate-50/80'
          : 'border-white/15 h-16',
        className,
      )}
      style={isLight ? undefined : { background: 'rgba(255, 255, 255, 0.06)' }}
    >
      <input
        type="text"
        inputMode="decimal"
        step="0.1"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'flex-1 h-full px-4 font-semibold tabular-nums bg-transparent focus:outline-none',
          isLight
            ? 'text-sm text-primary placeholder:text-slate-400'
            : 'px-5 text-white placeholder:text-white/25',
          !isLight && (size === 'lg' ? 'text-3xl' : 'text-2xl'),
          inputClassName,
        )}
      />
      <span
        className={cn(
          'pr-4 font-medium shrink-0',
          isLight ? 'text-sm text-slate-400' : 'pr-5 text-white/45',
          !isLight && (size === 'lg' ? 'text-base' : 'text-sm'),
        )}
      >
        {unit}
      </span>
    </div>
  )
}
