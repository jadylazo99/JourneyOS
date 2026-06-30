import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import type { SelectOption } from '@/modules/onboarding/types'

interface OnboardingOptionSelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
}

export function OnboardingOptionSelect({ options, value, onChange }: OnboardingOptionSelectProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => {
        const active = value === option.value
        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'w-full text-left px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200',
              active
                ? 'bg-white text-primary shadow-glass'
                : 'text-white/75 border border-white/15 hover:border-white/30',
            )}
            style={!active ? { background: 'rgba(255, 255, 255, 0.06)' } : undefined}
          >
            {option.label}
          </motion.button>
        )
      })}
    </div>
  )
}
