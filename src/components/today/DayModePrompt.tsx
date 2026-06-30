import { motion } from 'framer-motion'
import { MODE_PROMPT_OPTIONS } from '@/modules/daily/types'
import type { DayModeId } from '@/modules/daily'

interface DayModePromptProps {
  onSelect: (mode: DayModeId) => void
}

export function DayModePrompt({ onSelect }: DayModePromptProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 mb-2">
        <p className="text-xl font-semibold text-white">Good Morning ☀️</p>
        <p className="text-sm text-white/55">How does today look?</p>
      </div>

      <div className="space-y-2">
        {MODE_PROMPT_OPTIONS.map(({ mode, label }) => (
          <motion.button
            key={mode}
            type="button"
            onClick={() => onSelect(mode)}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-white/80 border border-white/15 hover:border-white/30 text-left transition-colors"
            style={{ background: 'rgba(255, 255, 255, 0.06)' }}
          >
            <span className="h-4 w-4 rounded-full border-2 border-white/30 shrink-0" />
            {label}
          </motion.button>
        ))}
      </div>

      <p className="text-xs text-white/35 text-center pt-2">
        Remember my answer today only
      </p>
    </div>
  )
}
