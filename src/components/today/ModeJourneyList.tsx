import { motion } from 'framer-motion'

interface ModeJourneyListProps {
  items: string[]
  modeKey: string
}

export function ModeJourneyList({ items, modeKey }: ModeJourneyListProps) {
  return (
    <motion.ul
      key={modeKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-2 pt-2"
    >
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          className="flex items-start gap-2.5 text-sm text-white/65"
        >
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
          {item}
        </motion.li>
      ))}
    </motion.ul>
  )
}
