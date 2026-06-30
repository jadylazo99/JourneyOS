import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface YesNoInputProps {
  value: boolean | null
  onChange: (value: boolean) => void
}

export function OnboardingYesNo({ value, onChange }: YesNoInputProps) {
  return (
    <div className="flex gap-3">
      {([
        { label: 'Yes', val: true },
        { label: 'No', val: false },
      ] as const).map(({ label, val }) => (
        <motion.button
          key={label}
          type="button"
          onClick={() => onChange(val)}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'flex-1 h-14 rounded-2xl text-base font-medium transition-all duration-200',
            value === val
              ? 'bg-white text-primary shadow-glass'
              : 'text-white/70 border border-white/15 hover:border-white/25',
          )}
          style={
            value !== val ? { background: 'rgba(255, 255, 255, 0.06)' } : undefined
          }
        >
          {label}
        </motion.button>
      ))}
    </div>
  )
}
