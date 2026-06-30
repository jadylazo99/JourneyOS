import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  useAchievementStore,
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORY_LABELS,
  type AchievementCategory,
  type AchievementDefinition,
} from '@/modules/achievements'
import { isAchievementCategoryVisible } from '@/modules/modules'
import { useProfileStore } from '@/modules/profile'
import { Card } from '@/components/ui'

const CATEGORY_ORDER: AchievementCategory[] = [
  'weight',
  'fitness',
  'nutrition',
  'study',
  'finance',
  'pets',
  'mindset',
  'journey',
]

function groupAchievementsByCategory(): Record<AchievementCategory, AchievementDefinition[]> {
  const grouped = {} as Record<AchievementCategory, AchievementDefinition[]>
  for (const achievement of ACHIEVEMENTS) {
    if (!grouped[achievement.category]) grouped[achievement.category] = []
    grouped[achievement.category].push(achievement)
  }
  return grouped
}

const ACHIEVEMENTS_BY_CATEGORY = groupAchievementsByCategory()

function AchievementBadge({
  achievement,
  unlocked,
  index,
}: {
  achievement: AchievementDefinition
  unlocked: boolean
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      className={`rounded-2xl border p-4 transition-colors ${
        unlocked
          ? 'border-blue/20 bg-gradient-to-br from-blue/[0.06] to-accent/[0.04]'
          : 'border-slate-100 bg-slate-50/50 opacity-60'
      }`}
    >
      <span className="text-2xl mb-2 block">{achievement.icon}</span>
      <p className="text-sm font-semibold text-primary leading-snug">{achievement.title}</p>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{achievement.description}</p>
    </motion.div>
  )
}

export function AchievementsSection() {
  const profile = useProfileStore((s) => s.profile)
  const unlocked = useAchievementStore((s) => s.unlocked)
  const isUnlocked = useAchievementStore((s) => s.isAchievementUnlocked)
  const unlockedCount = unlocked.length
  const grouped = ACHIEVEMENTS_BY_CATEGORY

  const visibleCategories = CATEGORY_ORDER.filter((category) =>
    isAchievementCategoryVisible(profile, category),
  )

  if (visibleCategories.length === 0) {
    return (
      <Card className="text-center py-10">
        <p className="text-sm text-slate-500">
          Enable modules in Profile to unlock achievement categories.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-slate-500">
          {unlockedCount} unlocked
        </p>
      </div>

      {visibleCategories.map((category) => {
        const items = grouped[category]
        if (!items?.length) return null

        return (
          <div key={category}>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
              {ACHIEVEMENT_CATEGORY_LABELS[category]}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {items.map((achievement, i) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={isUnlocked(achievement.id)}
                  index={i}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function AchievementsSummaryCard() {
  const profile = useProfileStore((s) => s.profile)
  const unlockedCount = useAchievementStore((s) => s.unlocked.length)
  const total = useMemo(
    () =>
      CATEGORY_ORDER.filter((cat) => isAchievementCategoryVisible(profile, cat)).reduce(
        (sum, cat) => sum + (ACHIEVEMENTS_BY_CATEGORY[cat]?.length ?? 0),
        0,
      ),
    [profile],
  )

  return (
    <Card padding="sm" className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Achievements
        </p>
        <p className="text-2xl font-semibold text-primary tabular-nums mt-1">
          {unlockedCount}
          <span className="text-base font-normal text-slate-400"> / {total}</span>
        </p>
      </div>
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue to-accent flex items-center justify-center text-xl">
        🏆
      </div>
    </Card>
  )
}
