import { motion } from 'framer-motion'
import { useAchievementStore, getAchievementDef } from '@/modules/achievements'
import { isModuleEnabled, isAchievementCategoryVisible } from '@/modules/modules'
import { useProfileStore } from '@/modules/profile'

function formatTimelineDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function JourneyTimeline() {
  const profile = useProfileStore((s) => s.profile)
  const events = useAchievementStore((s) => s.getTimeline()).filter((event) => {
    if (
      !isModuleEnabled(profile, 'pets') &&
      (event.icon === '🐾' || event.title.endsWith(' Added'))
    ) {
      return false
    }
    if (event.achievementId) {
      const def = getAchievementDef(event.achievementId)
      if (def && !isAchievementCategoryVisible(profile, def.category)) return false
    }
    if (
      !isModuleEnabled(profile, 'travel') &&
      (event.category === 'travel' || event.title.includes('Vacation'))
    ) {
      return false
    }
    return true
  })

  if (events.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-card">
        <p className="text-sm text-slate-500">
          Your journey timeline will grow as you hit milestones and unlock achievements.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.35 }}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card hover:shadow-card-lg transition-shadow duration-300"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-blue/10 flex items-center justify-center text-2xl shrink-0">
              {event.icon ?? '✨'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-primary">{event.title}</p>
              <p className="text-[11px] text-slate-400 mt-1 tabular-nums">
                {formatTimelineDate(event.dateKey)}
              </p>
              {event.description && (
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
