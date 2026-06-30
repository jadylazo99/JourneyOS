import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { WEEKDAY_OPTIONS } from '@/modules/onboarding/types'

interface OnboardingDayChipsProps {
  selected: string[]
  onChange: (days: string[]) => void
}

export function OnboardingDayChips({ selected, onChange }: OnboardingDayChipsProps) {
  const toggle = (day: string) => {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day))
    } else {
      onChange([...selected, day])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {WEEKDAY_OPTIONS.map((day) => {
        const active = selected.includes(day)
        return (
          <motion.button
            key={day}
            type="button"
            onClick={() => toggle(day)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200',
              active
                ? 'bg-white text-primary shadow-glass'
                : 'text-white/70 border border-white/15 hover:border-white/30',
            )}
            style={!active ? { background: 'rgba(255, 255, 255, 0.06)' } : undefined}
          >
            {day.slice(0, 3)}
          </motion.button>
        )
      })}
    </div>
  )
}
