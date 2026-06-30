import { motion } from 'framer-motion'

interface OnboardingBackgroundProps {
  children: React.ReactNode
}

export function OnboardingBackground({ children }: OnboardingBackgroundProps) {
  return (
    <div className="relative min-h-dvh min-h-screen overflow-hidden safe-top">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#0f172a] to-[#1e3a8a]" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-blue-500/30 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 -left-40 w-[360px] h-[360px] rounded-full bg-accent/25 blur-[90px]"
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-24 right-1/4 w-[480px] h-[480px] rounded-full bg-indigo-600/20 blur-[110px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/60 via-transparent to-white/[0.03]" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}
