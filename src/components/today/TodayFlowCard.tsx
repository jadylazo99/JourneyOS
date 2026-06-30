import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface TodayFlowCardProps {
  stepKey: string
  direction: 1 | -1
  children: ReactNode
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
    scale: 0.96,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
    scale: 0.96,
  }),
}

export function TodayFlowCard({ stepKey, direction, children }: TodayFlowCardProps) {
  return (
    <motion.div
      key={stepKey}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-[560px] mx-auto"
    >
      <div
        className="rounded-[32px] p-6 md:p-8 shadow-glass-lg border border-white/20"
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
