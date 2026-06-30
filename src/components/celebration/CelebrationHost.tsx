import { dismissActiveCelebration } from '@/modules/achievements'
import { useWeightStore } from '@/modules/weight'
import { CelebrationOverlay } from './CelebrationOverlay'

export function CelebrationHost() {
  const weightCelebration = useWeightStore((s) => s.pendingCelebration)

  return (
    <CelebrationOverlay
      celebration={weightCelebration}
      onContinue={dismissActiveCelebration}
    />
  )
}
