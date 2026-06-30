import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpenIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { Card, PageHeader, Section } from '@/components/ui'
import { useProfileStore } from '@/modules/profile'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export function ResourcesPage() {
  const hydrate = useProfileStore((s) => s.hydrate)
  const hydrated = useProfileStore((s) => s.hydrated)
  const isModuleEnabled = useProfileStore((s) => s.isModuleEnabled)

  useEffect(() => {
    hydrate()
  }, [hydrate])

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
      transition={{ staggerChildren: 0.08 }}
      className="space-y-6"
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <PageHeader
          title="Resources"
          subtitle="Saved meals, workouts, routines, and tools"
        />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue to-accent flex items-center justify-center shrink-0">
            <BookOpenIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary">Your tools</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Meals, workouts, and pet care — based on your profile
            </p>
          </div>
        </Card>
      </motion.div>

      {isModuleEnabled('nutrition') && (
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
          <Link to="/food">
            <Card className="flex items-center gap-4 hover:shadow-card-lg transition-shadow duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-blue flex items-center justify-center shrink-0">
                <span className="text-xl">🍽️</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary">Food Ideas</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Personalized meals from your profile
                </p>
              </div>
            </Card>
          </Link>
        </motion.div>
      )}

      {isModuleEnabled('fitness') && (
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
          <Link to="/workout">
            <Card className="flex items-center gap-4 hover:shadow-card-lg transition-shadow duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-blue flex items-center justify-center shrink-0">
                <span className="text-xl">🏋️</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary">Today&apos;s Workout</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Guided session based on your plan
                </p>
              </div>
            </Card>
          </Link>
        </motion.div>
      )}

      {isModuleEnabled('pets') && (
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
          <Link to="/pets">
            <Card className="flex items-center gap-4 hover:shadow-card-lg transition-shadow duration-300">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-blue flex items-center justify-center shrink-0">
                <span className="text-xl">🐾</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary">Pets</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daily care, reminders, and progress
                </p>
              </div>
            </Card>
          </Link>
        </motion.div>
      )}

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <Section title="Saved items">
          <Card className="text-center py-8">
            <p className="text-sm text-slate-500">
              Saved meals and articles will appear here as you use JourneyOS.
            </p>
          </Card>
        </Section>
      </motion.div>
    </motion.div>
  )
}
