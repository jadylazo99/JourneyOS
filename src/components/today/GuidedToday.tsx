import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDailyStore } from '@/modules/daily'
import { usePetsStore } from '@/modules/pets'
import { useProfileStore } from '@/modules/profile'
import { StudyTodayPanel } from './StudyTodayPanel'
import { VacationTodayPanel } from './VacationTodayPanel'
import { useIntelligenceStore } from '@/modules/intelligence'
import { getVacationGreeting, isVacationPausedToday } from '@/modules/intelligence/vacation/engine'
import { TravelIntelligencePrompt } from '@/components/intelligence'
import { MomentumDisplay } from './MomentumDisplay'
import { GuidedStepCard } from './GuidedStepCard'
import { ViewFullDay } from './ViewFullDay'
import { DayModePrompt } from './DayModePrompt'
import { DayModeSelector } from './DayModeSelector'
import { TodayFlowButton } from './TodayFlowButton'
import { TodayCompleteState } from './TodayCompleteState'

export function GuidedToday() {
  const todayRecord = useDailyStore((s) => s.todayRecord)
  const getGreetingText = useDailyStore((s) => s.getGreetingText)
  const getDateLabel = useDailyStore((s) => s.getDateLabel)
  const confirmTodayMode = useDailyStore((s) => s.confirmTodayMode)
  const setTodayMode = useDailyStore((s) => s.setTodayMode)
  const needsModePrompt = useDailyStore((s) => s.needsModePrompt)
  const ensureGuidedFlow = useDailyStore((s) => s.ensureGuidedFlow)
  const getCurrentGuidedTask = useDailyStore((s) => s.getCurrentGuidedTask)
  const getGuidedTasks = useDailyStore((s) => s.getGuidedTasks)
  const getMomentumSummary = useDailyStore((s) => s.getMomentumSummary)
  const getGuidedJourneyMessage = useDailyStore((s) => s.getGuidedJourneyMessage)
  const isGuidedDayComplete = useDailyStore((s) => s.isGuidedDayComplete)
  const isModuleEnabled = useProfileStore((s) => s.isModuleEnabled)
  const vacation = useProfileStore((s) => s.profile.vacation)
  const firstName = useProfileStore((s) => s.profile.firstName)
  const lifeEngineSettings = useDailyStore((s) => s.lifeEngineSettings)
  const ensurePetTasks = usePetsStore((s) => s.ensureTodayTasks)

  const showTravel = useIntelligenceStore((s) => s.showTravelPrompt)
  const travelCountry = useIntelligenceStore((s) => s.travelCountryLabel)
  const travelFlag = useIntelligenceStore((s) => s.travelFlag)
  const respondToTravel = useIntelligenceStore((s) => s.respondToTravel)

  useEffect(() => {
    if (todayRecord?.dayMode.userConfirmed) {
      ensureGuidedFlow()
      ensurePetTasks(todayRecord.dayMode.mode)
    }
  }, [
    todayRecord?.dateKey,
    todayRecord?.dayMode.mode,
    todayRecord?.dayMode.userConfirmed,
    ensureGuidedFlow,
    ensurePetTasks,
  ])

  if (!todayRecord) return null

  const momentum = getMomentumSummary()
  const tasks = getGuidedTasks()
  const currentTask = getCurrentGuidedTask()
  const journeyMessage = getGuidedJourneyMessage()
  const showMode = needsModePrompt() && !showTravel
  const allDone = isGuidedDayComplete()
  const showMainFlow = !showTravel && !showMode

  const handleTravelSelect = (response: Parameters<typeof respondToTravel>[0]) => {
    const mode = respondToTravel(response)
    if (mode) confirmTodayMode(mode)
  }

  const showStudyPanel = isModuleEnabled('study') && showMainFlow && !allDone
  const vacationToday =
    todayRecord.dayMode.mode === 'vacation' ||
    (lifeEngineSettings.vacationModeEnabled && !isVacationPausedToday(vacation))
  const headerGreeting = vacationToday
    ? getVacationGreeting(vacation, firstName || 'there')
    : getGreetingText()

  return (
    <div className="flex flex-col flex-1 max-w-[560px] mx-auto w-full">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 space-y-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
            {headerGreeting}
          </h1>
          {vacationToday && vacation.destination.trim() && (
            <p className="text-sm text-white/55 mt-1">{vacation.destination.trim()}</p>
          )}
          <p className="text-sm text-white/45 mt-1">{getDateLabel()}</p>
        </div>

        {showMainFlow && (
          <div className="flex items-center justify-between gap-3">
            <DayModeSelector
              currentMode={todayRecord.dayMode.mode}
              onSelect={setTodayMode}
            />
            {tasks.length > 0 && (
              <MomentumDisplay
                score={momentum.score}
                possible={momentum.possible}
                completedCount={momentum.completedCount}
                totalCount={momentum.totalCount}
              />
            )}
          </div>
        )}
      </motion.header>

      {vacationToday && showMainFlow && <VacationTodayPanel />}

      {showStudyPanel && <StudyTodayPanel />}

      <div className="flex-1 flex flex-col justify-center min-h-[280px]">
        <AnimatePresence mode="wait">
          {showTravel ? (
            <motion.div
              key="travel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full"
            >
              <div
                className="rounded-[32px] p-6 md:p-8 border border-white/20"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)' }}
              >
                <TravelIntelligencePrompt
                  countryLabel={travelCountry}
                  flag={travelFlag}
                  onSelect={handleTravelSelect}
                />
              </div>
            </motion.div>
          ) : showMode ? (
            <motion.div
              key="mode"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full"
            >
              <div
                className="rounded-[32px] p-6 md:p-8 border border-white/20"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(24px)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-accent/80 mb-4">
                  Plan your day
                </p>
                <DayModePrompt onSelect={confirmTodayMode} />
              </div>
            </motion.div>
          ) : allDone ? (
            <TodayCompleteState
              key="done"
              momentumScore={momentum.score}
              journeyMessage={journeyMessage}
              tasks={tasks}
            />
          ) : currentTask ? (
            <GuidedStepCard key={currentTask.id} task={currentTask} />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full text-center py-8"
            >
              <p className="text-white/60 text-sm">Getting your next step ready…</p>
              <div className="mt-4">
                <TodayFlowButton label="Continue" onClick={() => ensureGuidedFlow()} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showMainFlow && tasks.length > 0 && !allDone && (
        <ViewFullDay tasks={tasks} />
      )}
    </div>
  )
}
