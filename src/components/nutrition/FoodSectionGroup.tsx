import { FOOD_SECTION_LABELS, type FoodSection, type MealSuggestion } from '@/modules/nutrition'
import { FoodCard } from './FoodCard'

interface FoodSectionGroupProps {
  section: FoodSection
  meals: MealSuggestion[]
}

export function FoodSectionGroup({ section, meals }: FoodSectionGroupProps) {
  if (meals.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
        {FOOD_SECTION_LABELS[section]}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {meals.map((meal, i) => (
          <FoodCard key={meal.id} meal={meal} index={i} />
        ))}
      </div>
    </section>
  )
}
