import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui'
import { FoodSectionGroup, SuggestMealsButton } from '@/components/nutrition'
import { useNutritionStore, FOOD_SECTION_ORDER } from '@/modules/nutrition'
import { useProfileStore } from '@/modules/profile'
import { Link } from 'react-router-dom'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export function FoodIdeasPage() {
  const hydrateNutrition = useNutritionStore((s) => s.hydrate)
  const hydrateProfile = useProfileStore((s) => s.hydrate)
  const nutritionHydrated = useNutritionStore((s) => s.hydrated)
  const profileHydrated = useProfileStore((s) => s.hydrated)
  const suggestions = useNutritionStore((s) => s.suggestions)
  const generateSuggestions = useNutritionStore((s) => s.generateSuggestions)
  const getSectionMeals = useNutritionStore((s) => s.getSectionMeals)
  const isModuleEnabled = useProfileStore((s) => s.isModuleEnabled)
  const firstName = useProfileStore((s) => s.profile.firstName)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    hydrateProfile()
    hydrateNutrition()
  }, [hydrateProfile, hydrateNutrition])

  if (!nutritionHydrated || !profileHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue animate-spin" />
      </div>
    )
  }

  if (!isModuleEnabled('nutrition')) {
    return (
      <div className="space-y-6">
        <PageHeader title="Food Ideas" subtitle="Personalized meals from your profile" />
        <div className="rounded-3xl bg-white shadow-card border border-slate-100 p-8 text-center">
          <p className="text-sm text-slate-500">
            Enable the Nutrition module in Profile to get personalized food ideas.
          </p>
          <Link
            to="/profile"
            className="inline-block mt-4 text-sm font-semibold text-blue hover:underline"
          >
            Go to Profile →
          </Link>
        </div>
      </div>
    )
  }

  const handleSuggest = () => {
    setGenerating(true)
    generateSuggestions()
    setTimeout(() => setGenerating(false), 400)
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.06 }}
      className="space-y-6 pb-4"
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <PageHeader
          title="Food Ideas"
          subtitle={
            firstName
              ? `Personalized for ${firstName} — no dislikes, no allergies`
              : 'Meals built from foods you love'
          }
        />
      </motion.div>

      <motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
        <SuggestMealsButton onClick={handleSuggest} loading={generating} />
      </motion.div>

      {FOOD_SECTION_ORDER.map((section) => (
        <motion.div key={section} variants={fadeUp} transition={{ duration: 0.4 }}>
          <FoodSectionGroup
            section={section}
            meals={suggestions[section] ?? getSectionMeals(section)}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
