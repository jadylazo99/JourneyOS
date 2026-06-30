import { motion } from 'framer-motion'

interface MomentumDisplayProps {
  score: number
  possible: number
  completedCount: number
  totalCount: number
}

export function MomentumDisplay({
  score,
  possible,
  completedCount,
  totalCount,
}: MomentumDisplayProps) {
  const pct = possible > 0 ? Math.min(100, Math.round((score / possible) * 100)) : 0

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-11 w-11 shrink-0">
        <svg className="h-11 w-11 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="3"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${pct} 100`}
            initial={{ strokeDasharray: '0 100' }}
            animate={{ strokeDasharray: `${pct} 100` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white tabular-nums">
          {score}
        </span>
      </div>
      <div>
        <p className="text-xs font-semibold text-white/80">Momentum</p>
        <p className="text-[10px] text-white/40 tabular-nums">
          {completedCount}/{totalCount} steps
        </p>
      </div>
    </div>
  )
}
