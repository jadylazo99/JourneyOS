import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { parseWeightExact } from '@/utils/weight'
import { useDailyStore } from '@/modules/daily'
import type { GuidedTask } from '@/modules/daily/guided'
import { WeightInput } from '@/components/ui/WeightInput'
import { TodayFlowButton } from './TodayFlowButton'
import { GuidedTaskActionSheet } from './GuidedTaskActionSheet'

interface GuidedStepCardProps {
  task: GuidedTask
}

export function GuidedStepCard({ task }: GuidedStepCardProps) {
  const completeGuidedTask = useDailyStore((s) => s.completeGuidedTask)
  const setGuidedTaskStatus = useDailyStore((s) => s.setGuidedTaskStatus)
  const logWeight = useDailyStore((s) => s.logWeight)
  const skipWeighIn = useDailyStore((s) => s.skipWeighIn)
  const weighInInput = useDailyStore((s) => s.weighInInput)
  const setWeighInInput = useDailyStore((s) => s.setWeighInInput)

  const [sheetOpen, setSheetOpen] = useState(false)

  const handlePrimary = () => {
    if (task.link) return
    if (task.type === 'weigh_in') {
      const w = parseWeightExact(weighInInput)
      if (w !== null) logWeight(w)
      return
    }
    completeGuidedTask(task.id)
  }

  const isWeighIn = task.type === 'weigh_in'
  const canLogWeight = parseWeightExact(weighInInput) !== null

  return (
    <>
      <motion.div
        key={task.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35 }}
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
          <p className="text-xs font-semibold uppercase tracking-wider text-accent/80 mb-3">
            Next best step
          </p>

          <h2 className="text-2xl font-semibold text-white leading-tight">{task.title}</h2>
          {task.subtitle && (
            <p className="text-xs text-white/45 mt-1 uppercase tracking-wider">{task.subtitle}</p>
          )}
          <p className="text-sm text-white/60 mt-4 leading-relaxed">{task.message}</p>

          {isWeighIn && (
            <div className="mt-5 space-y-3">
              <WeightInput
                value={weighInInput}
                onChange={setWeighInInput}
                onSubmit={handlePrimary}
                placeholder="236.8"
                size="md"
              />
              <div className="grid grid-cols-1 gap-2">
                <TodayFlowButton
                  label="Skip Today"
                  onClick={() => {
                    skipWeighIn('today')
                    setGuidedTaskStatus(task.id, 'skipped')
                  }}
                  variant="secondary"
                />
                <TodayFlowButton
                  label="Skip Until I'm Home"
                  onClick={() => {
                    skipWeighIn('until_home')
                    setGuidedTaskStatus(task.id, 'skipped')
                  }}
                  variant="secondary"
                />
                <TodayFlowButton
                  label="Not Now"
                  onClick={() => {
                    skipWeighIn('not_now')
                    setGuidedTaskStatus(task.id, 'skipped')
                  }}
                  variant="ghost"
                />
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {task.link ? (
              <Link to={task.link} className="block">
                <span className="flex h-12 w-full items-center justify-center rounded-2xl bg-white text-sm font-semibold text-primary shadow-glass">
                  {task.actionLabel}
                </span>
              </Link>
            ) : (
              <TodayFlowButton
                label={task.actionLabel}
                onClick={handlePrimary}
                disabled={isWeighIn && !canLogWeight}
              />
            )}

            {!isWeighIn && (
              <TodayFlowButton
                label="More options"
                onClick={() => setSheetOpen(true)}
                variant="secondary"
              />
            )}
          </div>
        </div>
      </motion.div>

      <GuidedTaskActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={(status) => setGuidedTaskStatus(task.id, status)}
      />
    </>
  )
}
