import { AnimatePresence } from 'framer-motion'
import { useDailyStore } from '@/modules/daily'
import { parseWeightExact } from '@/utils/weight'
import type { FlowStepId } from '@/modules/daily'
import { TodayFlowCard } from './TodayFlowCard'
import { TodayFlowButton } from './TodayFlowButton'
import { DayModePrompt } from './DayModePrompt'
import { WeighInPrompt } from './WeighInPrompt'
import { ModeJourneyList } from './ModeJourneyList'
import { NutritionTodayPanel } from '@/components/nutrition'
import { FitnessTodayPanel } from '@/components/fitness'
import { PetsTodayPanel } from '@/components/pets'
import { useFitnessStore } from '@/modules/fitness'
import { usePetsStore } from '@/modules/pets'

function StepContent({ step }: { step: FlowStepId }) {
  const {
    getGreetingText,
    getDateLabel,
    getDayModeLabel,
    getFocusText,
    getJourneyItems,
    getNextActionContent,
    getCelebrateContent,
    nextStep,
    confirmTodayMode,
    logWeight,
    skipWeighIn,
    weighInInput,
    setWeighInInput,
    canProceed,
    getWorkBlockDisplay,
    todayRecord,
    isNutritionEnabled,
    getNutritionTodaySummary,
    logWater,
    logProtein,
  } = useDailyStore()

  const fitnessEnabled = useFitnessStore((s) => s.isFitnessEnabled())
  const getTodayWorkout = useFitnessStore((s) => s.getTodayWorkout)
  const fitnessCompleted = useFitnessStore((s) => s.isTodayCompleted())
  const todaySkip = useFitnessStore((s) => s.todaySkip)
  const petsEnabled = usePetsStore((s) => s.isPetsEnabled())
  const modeKey = todayRecord?.dayMode.mode ?? 'normal'
  const fitnessWorkout = fitnessEnabled ? getTodayWorkout(modeKey) : null

  switch (step) {
    case 'greeting':
      return (
        <div className="text-center space-y-3">
          <p className="text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
            {getGreetingText()}
          </p>
          <p className="text-sm text-white/45">{getDateLabel()}</p>
        </div>
      )

    case 'mode_prompt':
      return <DayModePrompt onSelect={confirmTodayMode} />

    case 'ready':
      return (
        <div className="text-center space-y-6">
          <p className="text-xl font-medium text-white/90">Ready to begin?</p>
          <p className="text-sm text-white/45">{getDayModeLabel()} mode</p>
          <TodayFlowButton label="Continue" onClick={nextStep} />
        </div>
      )

    case 'weigh_in':
      return (
        <WeighInPrompt
          value={weighInInput}
          onChange={setWeighInInput}
          onLog={() => {
            const w = parseWeightExact(weighInInput)
            if (w !== null) logWeight(w)
          }}
          onSkip={skipWeighIn}
          canLog={canProceed()}
        />
      )

    case 'focus': {
      const workBlock = getWorkBlockDisplay()
      const journeyItems = getJourneyItems()
      const nutritionSummary = isNutritionEnabled() ? getNutritionTodaySummary() : null
      return (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent/80">
            Today's Journey
          </p>
          <p className="text-xs text-white/40 mb-1">{getDayModeLabel()} mode</p>
          {workBlock && (
            <div
              className="rounded-2xl border border-white/15 px-4 py-3"
              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
            >
              <p className="text-xs font-medium text-accent/80 uppercase tracking-wider">
                {workBlock.label}
              </p>
              <p className="text-base font-semibold text-white mt-1 tabular-nums">
                {workBlock.display}
              </p>
            </div>
          )}
          <p className="text-lg text-white/90 leading-relaxed">{getFocusText()}</p>
          {nutritionSummary && (
            <NutritionTodayPanel
              summary={nutritionSummary}
              onLogWater={() => logWater()}
              onLogProtein={() => logProtein()}
            />
          )}
          {fitnessWorkout && (
            <FitnessTodayPanel
              workout={fitnessWorkout}
              completed={fitnessCompleted}
              skippedMessage={todaySkip?.message}
            />
          )}
          {petsEnabled && <PetsTodayPanel dayMode={modeKey} />}
          <ModeJourneyList items={journeyItems} modeKey={modeKey} />
        </div>
      )
    }

    case 'next_action': {
      const action = getNextActionContent()
      return (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent/80">
            Next best action
          </p>
          <p className="text-lg font-medium text-white">{action.title}</p>
          <p className="text-sm text-white/55 leading-relaxed">{action.body}</p>
        </div>
      )
    }

    case 'celebrate': {
      const { score, highlights, message } = getCelebrateContent()
      return (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent/80">
            Celebrate progress
          </p>
          <p className="text-lg text-white/90 leading-relaxed">{message}</p>
          <div
            className="rounded-2xl border border-white/10 p-4"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <p className="text-3xl font-semibold text-white tabular-nums">{score}</p>
            <p className="text-xs text-white/40 mt-1">Consistency today</p>
          </div>
          {highlights.length > 0 && (
            <ul className="space-y-1.5">
              {highlights.map((h) => (
                <li key={h} className="text-sm text-white/60 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    }

    case 'done':
      return (
        <div className="text-center space-y-3 py-4">
          <p className="text-2xl font-semibold text-white">Done.</p>
          <p className="text-sm text-white/50">Small steps still count. See you tomorrow.</p>
        </div>
      )

    default:
      return null
  }
}

function getStepTitle(step: FlowStepId): string | null {
  const titles: Partial<Record<FlowStepId, string>> = {
    mode_prompt: 'Plan your day',
    weigh_in: 'Quick check-in',
    focus: "Today's Journey",
    next_action: 'Next best action',
    celebrate: 'Celebrate progress',
  }
  return titles[step] ?? null
}

export function TodayConversation() {
  const {
    flowStep,
    direction,
    todayRecord,
    nextStep,
    prevStep,
    activeFlowSteps,
  } = useDailyStore()

  if (!todayRecord) return null

  const cardKey = `${todayRecord.dayMode.mode}-${flowStep}`
  const stepIndex = activeFlowSteps.indexOf(flowStep)
  const isFirst = stepIndex <= 0
  const isLast = flowStep === 'done'
  const showNav =
    flowStep !== 'ready' &&
    flowStep !== 'mode_prompt' &&
    flowStep !== 'weigh_in' &&
    !isLast
  const title = getStepTitle(flowStep)

  return (
    <div className="flex flex-col flex-1 justify-center">
      <AnimatePresence mode="wait" custom={direction}>
        <TodayFlowCard stepKey={cardKey} direction={direction}>
          {title && flowStep !== 'greeting' && flowStep !== 'ready' && flowStep !== 'done' && (
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
              {title}
            </p>
          )}
          <StepContent step={flowStep} />
        </TodayFlowCard>
      </AnimatePresence>

      {showNav && (
        <div className="flex gap-3 mt-6 max-w-[560px] mx-auto w-full">
          {!isFirst && (
            <TodayFlowButton label="Back" onClick={prevStep} variant="secondary" fullWidth={false} />
          )}
          <TodayFlowButton
            label={flowStep === 'celebrate' ? 'Finish' : 'Continue'}
            onClick={nextStep}
            fullWidth={isFirst}
          />
        </div>
      )}

      {flowStep === 'greeting' && (
        <div className="mt-6 max-w-[560px] mx-auto w-full">
          <TodayFlowButton label="Continue" onClick={nextStep} />
        </div>
      )}
    </div>
  )
}
