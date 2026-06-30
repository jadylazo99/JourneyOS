import { cn } from '@/utils/cn'
import type { KeyboardEvent } from 'react'

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  type?: 'text' | 'number'
  autoFocus?: boolean
}

export function OnboardingTextInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  type = 'text',
  autoFocus = true,
}: TextInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={cn(
        'w-full h-14 px-4 rounded-2xl text-base text-white',
        'border border-white/15 placeholder:text-white/30',
        'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50',
        'transition-all duration-200',
      )}
      style={{ background: 'rgba(255, 255, 255, 0.06)' }}
    />
  )
}
