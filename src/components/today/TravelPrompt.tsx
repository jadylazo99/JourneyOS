import { motion } from 'framer-motion'
import { DAY_TYPE_LABELS } from '@/modules/daily'
import type { DayType } from '@/modules/daily'

interface TravelPromptProps {
  onSelect: (type: DayType) => void
}

const TRAVEL_OPTIONS: DayType[] = ['travel', 'vacation', 'normal', 'rest']

export function TravelPrompt({ onSelect }: TravelPromptProps) {
  return (
    <div className="space-y-4">
      <p className="text-white/55 text-sm leading-relaxed">
        It looks like you're traveling. How should I plan today?
      </p>
      <div className="grid grid-cols-2 gap-2">
        {TRAVEL_OPTIONS.map((type) => (
          <motion.button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            whileTap={{ scale: 0.97 }}
            className="h-12 rounded-2xl text-sm font-medium text-white/80 border border-white/15 hover:border-white/30 transition-colors"
            style={{ background: 'rgba(255, 255, 255, 0.06)' }}
          >
            {DAY_TYPE_LABELS[type]}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
