import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FlagIcon } from '@heroicons/react/24/outline'
import { Card, PageHeader, Section } from '@/components/ui'
import {
  WeeklyReviewPanel,
  MonthlyReviewPanel,
  LearnedPatternsPanel,
  JourneyRecommendationsPanel,
} from '@/components/intelligence'
import { useIntelligenceStore, weeklyReviewId, monthlyReviewId } from '@/modules/intelligence'
import { useProfileStore } from '@/modules/profile'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export function JourneyPage() {
  const hydrateIntelligence = useIntelligenceStore((s) => s.hydrate)
  const hydrateProfile = useProfileStore((s) => s.hydrate)
  const pendingWeekly = useIntelligenceStore((s) => s.pendingWeeklyReview)
  const pendingMonthly = useIntelligenceStore((s) => s.pendingMonthlyReview)
  const markWeeklySeen = useIntelligenceStore((s) => s.markWeeklyReviewSeen)
  const markMonthlySeen = useIntelligenceStore((s) => s.markMonthlyReviewSeen)
  const mainGoal = useProfileStore((s) => s.profile.mainGoal)

  useEffect(() => {
    hydrateProfile()
    hydrateIntelligence()
  }, [hydrateProfile, hydrateIntelligence])

  return (
    <motion.div
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.08 }}
      className="space-y-6"
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <PageHeader
          title="Journey"
          subtitle="Insights, reviews, and your long-term path"
        />
      </motion.div>

      {pendingWeekly && (
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
          <WeeklyReviewPanel
            review={pendingWeekly}
            onDismiss={() => markWeeklySeen(weeklyReviewId(pendingWeekly))}
          />
        </motion.div>
      )}

      {pendingMonthly && (
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
          <MonthlyReviewPanel
            review={pendingMonthly}
            onDismiss={() => markMonthlySeen(monthlyReviewId(pendingMonthly))}
          />
        </motion.div>
      )}

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-accent/10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <FlagIcon className="h-5 w-5 text-blue" />
              <p className="text-sm font-medium text-primary">Current focus</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {mainGoal || 'Set your main goal in Profile to personalize your journey.'}
            </p>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <Section title="Recommendations" description="Gentle suggestions — never guilt">
          <JourneyRecommendationsPanel />
        </Section>
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <Section title="Insights" description="Patterns JourneyOS has noticed">
          <LearnedPatternsPanel />
        </Section>
      </motion.div>
    </motion.div>
  )
}
