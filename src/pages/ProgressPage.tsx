import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageHeader, Section } from '@/components/ui'
import {
  WeightSection,
  WeightChart,
  StudySection,
  AchievementsSection,
  AchievementsSummaryCard,
  JourneyCalendar,
} from '@/components/progress'
import { useDailyStore } from '@/modules/daily'
import { useWeightStore } from '@/modules/weight'
import { useAchievementStore } from '@/modules/achievements'
import { useProfileStore } from '@/modules/profile'
import { useStudyStore } from '@/modules/study'

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export function ProgressPage() {
  const hydrateWeight = useWeightStore((s) => s.hydrate)
  const hydrateAchievements = useAchievementStore((s) => s.hydrate)
  const hydrateProfile = useProfileStore((s) => s.hydrate)
  const hydrateDaily = useDailyStore((s) => s.hydrate)
  const hydrateStudy = useStudyStore((s) => s.hydrate)
  const weightHydrated = useWeightStore((s) => s.hydrated)
  const achievementsHydrated = useAchievementStore((s) => s.hydrated)
  const profileHydrated = useProfileStore((s) => s.hydrated)
  const dailyHydrated = useDailyStore((s) => s.hydrated)
  const isModuleEnabled = useProfileStore((s) => s.isModuleEnabled)

  useEffect(() => {
    hydrateWeight()
    hydrateAchievements()
    hydrateProfile()
    hydrateDaily()
    hydrateStudy()
  }, [hydrateWeight, hydrateAchievements, hydrateProfile, hydrateDaily, hydrateStudy])

  if (!weightHydrated || !achievementsHydrated || !profileHydrated || !dailyHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue animate-spin" />
      </div>
    )
  }

  const showWeight = isModuleEnabled('weight_loss')
  const showStudy = isModuleEnabled('study')

  return (
    <motion.div
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.07 }}
      className="space-y-8 pb-4"
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.45 }}>
        <PageHeader
          title="Progress"
          subtitle="Track your journey across focus areas"
        />
      </motion.div>

      {showWeight && (
        <motion.div variants={fadeUp} transition={{ duration: 0.45 }}>
          <Section title="Weight" description="Your trend and next 5 lb milestone">
            <div className="space-y-4">
              <WeightSection />
              <WeightChart />
            </div>
          </Section>
        </motion.div>
      )}

      {showStudy && (
        <motion.div variants={fadeUp} transition={{ duration: 0.45 }}>
          <Section title="Study" description="Sessions, streaks, and practice scores">
            <StudySection />
          </Section>
        </motion.div>
      )}

      <motion.div variants={fadeUp} transition={{ duration: 0.45 }}>
        <AchievementsSummaryCard />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.45 }}>
        <Section title="Achievements">
          <AchievementsSection />
        </Section>
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.45 }}>
        <Section title="History" description="Tap a date to see how that day went">
          <JourneyCalendar />
        </Section>
      </motion.div>
    </motion.div>
  )
}
