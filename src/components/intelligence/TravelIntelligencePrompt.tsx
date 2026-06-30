import { motion } from 'framer-motion'
import type { TravelTripType } from '@/modules/intelligence'

interface TravelIntelligencePromptProps {
  countryLabel: string
  flag: string
  onSelect: (response: TravelTripType | 'never_ask') => void
}

const OPTIONS: { id: TravelTripType | 'never_ask'; label: string }[] = [
  { id: 'vacation', label: 'Vacation' },
  { id: 'work_trip', label: 'Work Trip' },
  { id: 'just_visiting', label: 'Just Visiting' },
  { id: 'never_ask', label: 'Never ask again' },
]

export function TravelIntelligencePrompt({
  countryLabel,
  flag,
  onSelect,
}: TravelIntelligencePromptProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-lg font-semibold text-white">
          Welcome to {countryLabel} {flag}
        </p>
        <p className="text-white/55 text-sm leading-relaxed mt-2">
          Looks like you're traveling. How should I plan today?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map(({ id, label }) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            whileTap={{ scale: 0.97 }}
            className={`h-12 rounded-2xl text-sm font-medium text-white/80 border border-white/15 hover:border-white/30 transition-colors ${
              id === 'never_ask' ? 'col-span-2 text-white/55' : ''
            }`}
            style={{ background: 'rgba(255, 255, 255, 0.06)' }}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
