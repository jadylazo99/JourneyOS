import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TodayFlowButton } from './TodayFlowButton'
import { ViewFullDay } from './ViewFullDay'
import type { GuidedTask } from '@/modules/daily/guided'

interface TodayCompleteStateProps {
  momentumScore: number
  journeyMessage: string
  tasks: GuidedTask[]
}

export function TodayCompleteState({
  momentumScore,
  journeyMessage,
  tasks,
}: TodayCompleteStateProps) {
  const [showReview, setShowReview] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-[560px] mx-auto w-full"
    >
      <div
        className="rounded-[32px] p-8 text-center border border-white/20"
        style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)' }}
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="text-5xl block mb-4"
        >
          ✨
        </motion.span>
        <p className="text-2xl md:text-3xl font-semibold text-white">Amazing work.</p>
        <p className="text-base text-white/55 mt-2">Today&apos;s journey is complete.</p>
        <p className="text-sm text-white/45 mt-3 leading-relaxed">{journeyMessage}</p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3">
          <span className="text-3xl font-semibold text-white tabular-nums">{momentumScore}</span>
          <span className="text-xs text-white/40 text-left leading-tight">
            momentum
            <br />
            today
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <TodayFlowButton
            label={showReview ? 'Hide review' : 'Review Today'}
            onClick={() => {
              setShowReview((v) => !v)
              setShowPreview(false)
            }}
          />
          <TodayFlowButton
            label={showPreview ? 'Hide preview' : 'Preview Tomorrow'}
            onClick={() => {
              setShowPreview((v) => !v)
              setShowReview(false)
            }}
            variant="secondary"
          />
          <Link to="/progress" className="block pt-1">
            <span className="text-xs font-medium text-white/40 hover:text-white/60 transition-colors">
              View Progress →
            </span>
          </Link>
        </div>
      </div>

      {showReview && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <ViewFullDay tasks={tasks} defaultOpen />
        </motion.div>
      )}

      {showPreview && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-5 text-center"
        >
          <p className="text-sm font-medium text-white/70">Tomorrow starts fresh.</p>
          <p className="text-xs text-white/40 mt-2 leading-relaxed">
            Your next guided steps will adapt to your day mode, schedule, and enabled modules.
            Rest well tonight.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
