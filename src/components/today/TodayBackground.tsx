import { motion } from 'framer-motion'

export function TodayBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[calc(100dvh-7rem)] md:min-h-[calc(100dvh-5rem)] -mx-5 -mt-6 md:-mx-8 md:-mt-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#0f172a] to-[#1e3a8a]" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/25 blur-[90px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-[100px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/50 via-transparent to-white/[0.02]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-[calc(100dvh-7rem)] md:min-h-[calc(100dvh-5rem)] px-5 py-8 md:py-10">
        {children}
      </div>
    </div>
  )
}
