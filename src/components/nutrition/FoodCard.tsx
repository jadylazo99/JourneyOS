import { motion } from 'framer-motion'
import type { MealSuggestion, MealTag } from '@/modules/nutrition/types'

const TAG_STYLES: Record<MealTag, string> = {
  'High Protein': 'bg-blue/15 text-blue',
  Quick: 'bg-accent/15 text-blue',
  'Meal Prep': 'bg-emerald-500/15 text-emerald-700',
  Restaurant: 'bg-blue/10 text-blue',
  'Low Effort': 'bg-slate-500/10 text-slate-600',
}

interface FoodCardProps {
  meal: MealSuggestion
  index?: number
  variant?: 'light' | 'dark'
  onTap?: () => void
}

export function FoodCard({ meal, index = 0, variant = 'light', onTap }: FoodCardProps) {
  const isDark = variant === 'dark'

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      className={`w-full text-left rounded-2xl border p-4 transition-shadow hover:shadow-card-lg ${
        isDark
          ? 'border-white/15 bg-white/[0.06] hover:bg-white/[0.09]'
          : 'border-slate-100 bg-gradient-to-br from-primary/[0.03] to-blue/[0.06] hover:border-blue/20'
      }`}
    >
      <p className={`text-sm font-semibold leading-snug ${isDark ? 'text-white' : 'text-primary'}`}>
        {meal.name}
      </p>

      {meal.calories > 0 && (
        <div className={`flex gap-4 mt-2 text-xs tabular-nums ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
          <span>{meal.calories} cal</span>
          <span>{meal.protein}g protein</span>
        </div>
      )}

      {meal.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {meal.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                isDark ? 'bg-white/10 text-white/70' : TAG_STYLES[tag]
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  )
}
