import { motion } from 'framer-motion'

interface VacationPetPromptProps {
  petNames: string[]
  onTraveling: () => void
  onNotTraveling: () => void
}

export function VacationPetPrompt({
  petNames,
  onTraveling,
  onNotTraveling,
}: VacationPetPromptProps) {
  const names = petNames.join(' & ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-accent/30 p-4 space-y-4"
      style={{ background: 'rgba(59, 130, 246, 0.08)' }}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent/80 mb-2">
          Vacation mode
        </p>
        <p className="text-sm text-white/80 leading-relaxed">
          Is {names || 'your pet'} traveling with you?
        </p>
      </div>
      <div className="flex gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onTraveling}
          className="flex-1 rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
        >
          Yes, with me
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onNotTraveling}
          className="flex-1 rounded-xl border border-white/15 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/[0.06] transition-colors"
        >
          Staying home
        </motion.button>
      </div>
    </motion.div>
  )
}
