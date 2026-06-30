import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui'
import {
  ProfileHero,
  ProfileIdentitySection,
  ProfileHealthSection,
  ProfileGoalsSection,
  ProfileModulesSection,
  ProfileScheduleSection,
  ProfileWorkScheduleSection,
  ProfileFitnessSection,
  ProfileFoodSection,
  ProfileNutritionGoalsSection,
  ProfilePetsSection,
  ProfileVacationSection,
  ProfileThemeSection,
  ProfileMemorySection,
  ProfileNotificationsSection,
} from '@/components/profile'
import { useProfileStore } from '@/modules/profile'
import { useIntelligenceStore } from '@/modules/intelligence'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export function ProfilePage() {
  const hydrate = useProfileStore((s) => s.hydrate)
  const hydrateIntelligence = useIntelligenceStore((s) => s.hydrate)
  const hydrated = useProfileStore((s) => s.hydrated)

  useEffect(() => {
    hydrate()
    hydrateIntelligence()
  }, [hydrate, hydrateIntelligence])

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.05 }}
      className="space-y-4 pb-4"
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <PageHeader
          title="Profile"
          subtitle="Personalize JourneyOS to fit your life"
        />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileHero />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileModulesSection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileIdentitySection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileHealthSection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileGoalsSection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileScheduleSection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileWorkScheduleSection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileFitnessSection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileFoodSection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileNutritionGoalsSection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfilePetsSection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileVacationSection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileMemorySection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileNotificationsSection />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <ProfileThemeSection />
      </motion.div>

      <motion.p variants={fadeUp} className="text-center text-xs text-slate-400 pt-2 pb-2">
        Changes save automatically
      </motion.p>
    </motion.div>
  )
}
