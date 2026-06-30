import { cn } from '@/utils/cn'
import type { KeyboardEvent } from 'react'

interface TextAreaInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
}

export function OnboardingTextArea({
  value,
  onChange,
  onSubmit,
  placeholder,
}: TextAreaInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      rows={4}
      autoFocus
      className={cn(
        'w-full px-4 py-3 rounded-2xl text-base text-white resize-none',
        'border border-white/15 placeholder:text-white/30',
        'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50',
        'transition-all duration-200',
      )}
      style={{ background: 'rgba(255, 255, 255, 0.06)' }}
    />
  )
}
