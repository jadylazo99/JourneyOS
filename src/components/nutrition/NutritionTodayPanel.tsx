import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SparklesIcon } from '@heroicons/react/24/outline'
import type { NutritionTodaySummary } from '@/modules/nutrition/types'
import { FoodCard } from './FoodCard'

function ProgressBar({
  label,
  current,
  goal,
  unit,
}: {
  label: string
  current: number
  goal: number
  unit: string
}) {
  const percent = goal > 0 ? Math.min(100, (current / goal) * 100) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
          {label}
        </p>
        <p className="text-xs text-white/60 tabular-nums">
          {current} / {goal} {unit}
        </p>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-blue to-accent"
        />
      </div>
    </div>
  )
}

interface NutritionTodayPanelProps {
  summary: NutritionTodaySummary
  onLogWater?: () => void
  onLogProtein?: () => void
}

export function NutritionTodayPanel({
  summary,
  onLogWater,
  onLogProtein,
}: NutritionTodayPanelProps) {
  return (
    <div
      className="rounded-2xl border border-white/15 p-4 space-y-4"
      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent/80">
          Nutrition today
        </p>
        <Link
          to="/food"
          className="text-[11px] font-medium text-white/45 hover:text-white/70 transition-colors"
        >
          Food ideas →
        </Link>
      </div>

      <ProgressBar
        label="Protein"
        current={summary.proteinGrams}
        goal={summary.proteinGoal}
        unit="g"
      />
      <ProgressBar
        label="Water"
        current={summary.waterOz}
        goal={summary.waterGoal}
        unit="oz"
      />

      <div className="flex gap-2">
        {onLogProtein && (
          <button
            type="button"
            onClick={onLogProtein}
            className="flex-1 rounded-xl bg-white/10 py-2 text-xs font-medium text-white/80 hover:bg-white/15 transition-colors"
          >
            + Protein
          </button>
        )}
        {onLogWater && (
          <button
            type="button"
            onClick={onLogWater}
            className="flex-1 rounded-xl bg-white/10 py-2 text-xs font-medium text-white/80 hover:bg-white/15 transition-colors"
          >
            + Water
          </button>
        )}
      </div>

      {summary.breakfast && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-2">
            Breakfast idea
          </p>
          <FoodCard meal={summary.breakfast} variant="dark" />
        </div>
      )}

      {summary.lunchReminder && (
        <p className="text-sm text-white/70 leading-relaxed">
          {summary.lunchReminder}
        </p>
      )}

      {summary.dinnerIdea && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-2">
            Dinner idea
          </p>
          <FoodCard meal={summary.dinnerIdea} variant="dark" />
        </div>
      )}
    </div>
  )
}

export function SuggestMealsButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={loading}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-blue px-6 py-4 text-sm font-semibold text-white shadow-card-lg disabled:opacity-60"
    >
      <SparklesIcon className="h-5 w-5" />
      Suggest Meals For Me
    </motion.button>
  )
}
