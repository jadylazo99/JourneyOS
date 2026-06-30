import { motion } from 'framer-motion'
import type { Recommendation, RecommendationAction } from '@/modules/intelligence'

interface RecommendationBannerProps {
  recommendation: Recommendation
  onAction: (action: RecommendationAction) => void
  onDismiss: () => void
}

export function RecommendationBanner({
  recommendation,
  onAction,
  onDismiss,
}: RecommendationBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[560px] mx-auto w-full mb-4"
    >
      <div
        className="rounded-2xl px-4 py-3 border border-white/15"
        style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-accent/80">
          {recommendation.title}
        </p>
        <p className="text-sm text-white/70 mt-1 leading-relaxed">{recommendation.message}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {recommendation.actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => {
                if (action.id === 'dismiss') onDismiss()
                else onAction(action.id)
              }}
              className="rounded-full px-3 py-1.5 text-xs font-medium border border-white/20 text-white/80 hover:border-white/40 transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
