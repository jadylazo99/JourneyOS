import { motion } from 'framer-motion'
import type { Pet } from '@/modules/onboarding/types'
import type { PetProgressStats } from '@/modules/pets'

interface PetCardProps {
  pet: Pet
  stats: PetProgressStats
  selected?: boolean
  onClick: () => void
}

export function PetCard({ pet, stats, selected, onClick }: PetCardProps) {
  const age = pet.birthday
    ? new Date().getFullYear() - new Date(pet.birthday).getFullYear()
    : null

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left rounded-3xl border p-5 transition-all duration-300 ${
        selected
          ? 'border-accent/40 bg-white/10 shadow-lg shadow-blue/10'
          : 'border-white/10 bg-white/[0.05] hover:bg-white/[0.08]'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue/80 to-accent/60 flex items-center justify-center shrink-0">
          <span className="text-2xl">🐾</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-white truncate">{pet.name || 'Unnamed'}</p>
          <p className="text-sm text-white/45 mt-0.5">
            {[pet.type, pet.breed].filter(Boolean).join(' · ') || 'Add details'}
          </p>
          {age !== null && !isNaN(age) && (
            <p className="text-xs text-white/30 mt-1">{age} years old</p>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-4 pt-4 border-t border-white/10 text-xs text-white/40 tabular-nums">
        <span>{stats.walkStreak}d walk streak</span>
        <span>{stats.trainingDays} training days</span>
        <span>{stats.totalTasksCompleted} tasks done</span>
      </div>
    </motion.button>
  )
}
