import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { CelebrationHost } from '@/components/celebration'
import { useDailyReset } from '@/hooks/useDailyReset'
import { useWeightStore } from '@/modules/weight'
import { useAchievementStore } from '@/modules/achievements'
import { useDailyStore } from '@/modules/daily'
import { useProfileStore } from '@/modules/profile'
import { useNutritionStore } from '@/modules/nutrition'
import { useFitnessStore } from '@/modules/fitness'
import { usePetsStore } from '@/modules/pets'
import { useIntelligenceStore } from '@/modules/intelligence'

export function AppLayout() {
  useDailyReset()

  const hydrateWeight = useWeightStore((s) => s.hydrate)
  const hydrateAchievements = useAchievementStore((s) => s.hydrate)
  const hydrateDaily = useDailyStore((s) => s.hydrate)
  const hydrateProfile = useProfileStore((s) => s.hydrate)
  const hydrateNutrition = useNutritionStore((s) => s.hydrate)
  const hydrateFitness = useFitnessStore((s) => s.hydrate)
  const hydratePets = usePetsStore((s) => s.hydrate)
  const hydrateIntelligence = useIntelligenceStore((s) => s.hydrate)

  useEffect(() => {
    hydrateProfile()
    hydrateDaily()
    hydrateWeight()
    hydrateAchievements()
    hydrateNutrition()
    hydrateFitness()
    hydratePets()
    hydrateIntelligence()
  }, [hydrateProfile, hydrateDaily, hydrateWeight, hydrateAchievements, hydrateNutrition, hydrateFitness, hydratePets, hydrateIntelligence])

  return (
    <div className="flex min-h-dvh min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl lg:max-w-4xl px-5 pt-6 pb-28 md:px-8 md:pt-10 md:pb-10 safe-top">
            <Outlet />
          </div>
        </main>

        <BottomNav />
      </div>

      <CelebrationHost />
    </div>
  )
}
