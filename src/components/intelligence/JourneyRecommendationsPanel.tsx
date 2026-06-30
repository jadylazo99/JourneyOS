import { motion } from 'framer-motion'
import { Card } from '@/components/ui'
import { getRecommendations } from '@/modules/intelligence'

export function JourneyRecommendationsPanel() {
  const recommendations = getRecommendations().slice(0, 3)

  if (recommendations.length === 0) {
    return (
      <Card padding="sm">
        <p className="text-sm text-slate-500 leading-relaxed">
          You&apos;re in a good rhythm. JourneyOS will offer gentle suggestions when something might help.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec, index) => (
        <motion.div
          key={rec.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.35 }}
        >
          <Card padding="sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue">{rec.title}</p>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{rec.message}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
