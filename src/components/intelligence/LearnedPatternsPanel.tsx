import { motion } from 'framer-motion'
import { Card } from '@/components/ui'
import { useIntelligenceStore } from '@/modules/intelligence'

export function LearnedPatternsPanel() {
  const patterns = useIntelligenceStore((s) => s.data.patterns)

  if (patterns.length === 0) {
    return (
      <Card padding="sm">
        <p className="text-sm text-slate-500 leading-relaxed">
          JourneyOS learns your rhythms over time — workout timing, travel habits, and more.
        </p>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card padding="sm">
        <ul className="space-y-2">
          {patterns.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 text-sm text-slate-600"
            >
              <span>{p.label}</span>
              <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                {p.confidence}%
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  )
}
