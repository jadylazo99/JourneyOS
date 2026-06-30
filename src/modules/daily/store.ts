import { create } from 'zustand'
import { recordIntelligenceObservation, useIntelligenceStore } from '@/modules/intelligence'
import { applyVacationToToday } from '@/modules/intelligence/vacation/engine'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { isModuleEnabled } from '@/modules/modules/engine'
import { emptyWorkSchedule } from '@/modules/onboarding/storage'
import { getCoachMessage } from './detector'
import {
  addConsistencyEvent,
  getDayConsistencyScore,
  getConsistencyHighlights,
  getRollingConsistencyScore,
} from './consistency'
import {
  getActiveFlowSteps,
  getNextFlowStep,
  getPrevFlowStep,
  shouldAskWeighIn,
  shouldShowModePrompt,
} from './flow'
import { useWeightStore } from '@/modules/weight/store'
import { useAchievementStore } from '@/modules/achievements/store'
import { useNutritionStore } from '@/modules/nutrition/store'
import type { NutritionTodaySummary } from '@/modules/nutrition/types'
import { applyDayMode, createDayMode } from './dayMode'
import { inferDayMode, confirmDayMode } from './dayModeEngine'
import { getModeJourney, getModeLabel } from './modeJourney'
import { checkMilestones } from './milestones'
import { parseWeightExact } from '@/utils/weight'
import {
  buildScheduleContext,
  getScheduledFocus,
  getScheduledNextAction,
  getWorkBlock,
  type ScheduleContext,
  type WorkBlock,
} from './schedule'
import {
  createDayRecord,
  isRecordLocked,
  loadDailyStore,
  saveDailyStore,
} from './storage'
import { getDeviceTimezone, getGreeting, getLocalDateKey, formatDisplayDate } from './date'
import { sanitizeWeightInput, isValidWeightString } from '@/utils/weight'
import {
  generateGuidedTasks,
  mergeGuidedTasks,
  getCurrentTask,
  computeMomentum,
  getJourneyMessage,
  pointsForStatus,
} from './guided'
import { withDaySnapshot } from './snapshot'
import { reconcileTravelWeighIn, syncHomeTimezoneAfterTravel } from './reset'
import { getMilestoneById } from './milestones'
import { milestoneToAchievement } from '@/modules/achievements/consistency'
import type { GuidedTask, GuidedTaskStatus } from './guided'
import type {
  DayModeId,
  DayRecord,
  FlowStepId,
  LifeEngineSettings,
  MilestoneId,
  ModeJourneyConfig,
  WeighInSkipReason,
} from './types'

interface DailyStore {
  hydrated: boolean
  todayRecord: DayRecord | null
  flowStep: FlowStepId
  direction: 1 | -1
  showModePrompt: boolean
  showWeighIn: boolean
  activeFlowSteps: FlowStepId[]
  achievedMilestones: MilestoneId[]
  newMilestones: MilestoneId[]
  weighInInput: string
  homeTimezone: string
  lifeEngineSettings: LifeEngineSettings

  hydrate: () => void
  getFirstName: () => string
  getMainGoal: () => string
  getGreetingText: () => string
  getDateLabel: () => string
  getFocusText: () => string
  getJourneyItems: () => string[]
  getModeJourneyConfig: () => ModeJourneyConfig | null
  getNextActionContent: () => { title: string; body: string }
  getCelebrateContent: () => { score: number; highlights: string[]; message: string }
  getDayModeLabel: () => string
  getWorkBlockDisplay: () => WorkBlock | null
  getScheduleContext: () => ScheduleContext | null
  canProceed: () => boolean
  nextStep: () => void
  prevStep: () => void
  confirmTodayMode: (mode: DayModeId) => void
  setTodayMode: (mode: DayModeId) => void
  setVacationMode: (enabled: boolean) => void
  setSickMode: (enabled: boolean) => void
  logWeight: (weight: number) => void
  skipWeighIn: (reason: WeighInSkipReason) => void
  setWeighInInput: (value: string) => void
  saveTodayRecord: (record: DayRecord) => void
  refreshFlowSteps: () => void
  isNutritionEnabled: () => boolean
  getNutritionTodaySummary: () => NutritionTodaySummary | null
  logWater: (oz?: number) => void
  logProtein: (grams?: number) => void
  getAllRecords: () => DayRecord[]
  getRecord: (dateKey: string) => DayRecord | null
  processMilestones: () => void
  updateDayNotes: (dateKey: string, notes: string) => void
  ensureGuidedFlow: () => void
  getGuidedTasks: () => GuidedTask[]
  getCurrentGuidedTask: () => GuidedTask | null
  getMomentumSummary: () => ReturnType<typeof computeMomentum>
  getGuidedJourneyMessage: () => string
  setGuidedTaskStatus: (taskId: string, status: GuidedTaskStatus) => void
  completeGuidedTask: (taskId: string) => void
  needsModePrompt: () => boolean
  isGuidedDayComplete: () => boolean
}

function getProfileContext() {
  const data = loadOnboardingData()
  const profile = data?.profile
  return {
    workSchedule: profile?.workSchedule,
    wakeUpTime: profile?.wakeUpTime ?? '07:00',
    bedtime: profile?.bedtime ?? '22:00',
    mainGoal: profile?.mainGoal ?? '',
    firstName: profile?.firstName || 'there',
    petName: profile?.pets?.[0]?.name ?? null,
    gymAccess: profile?.gymAccess === true,
    currentWeight: profile?.currentWeight,
    goalWeight: profile?.goalWeight,
  }
}

function computeFlowState(record: DayRecord, homeTimezone: string) {
  const profile = loadOnboardingData()?.profile
  const showModePrompt = shouldShowModePrompt(record) && !isRecordLocked(record)
  const showWeighIn =
    isModuleEnabled(profile, 'weight_loss') &&
    shouldAskWeighIn(record, {
      homeTimezone,
      currentTimezone: getDeviceTimezone(),
    }) &&
    !isRecordLocked(record)
  const activeFlowSteps = getActiveFlowSteps(record, { showModePrompt, showWeighIn })
  return { showModePrompt, showWeighIn, activeFlowSteps }
}

export const useDailyStore = create<DailyStore>((set, get) => ({
  hydrated: false,
  todayRecord: null,
  flowStep: 'greeting',
  direction: 1,
  showModePrompt: false,
  showWeighIn: false,
  activeFlowSteps: [],
  achievedMilestones: [],
  newMilestones: [],
  weighInInput: '',
  homeTimezone: getDeviceTimezone(),
  lifeEngineSettings: { vacationModeEnabled: false, sickModeEnabled: false },

  hydrate: () => {
    const store = loadDailyStore()
    const todayKey = getLocalDateKey()
    const currentTz = getDeviceTimezone()
    const profileCtx = getProfileContext()
    const pastRecords = Object.values(store.records)

    reconcileTravelWeighIn(store.homeTimezone, currentTz)
    syncHomeTimezoneAfterTravel()

    useIntelligenceStore.getState().hydrate()

    let todayRecord = store.records[todayKey]
    if (!todayRecord) {
      todayRecord = createDayRecord(currentTz)
    }

    if (!isRecordLocked(todayRecord)) {
      todayRecord = addConsistencyEvent(todayRecord, 'opened_app')

      const isAbroad = currentTz !== store.homeTimezone

      if (!todayRecord.dayMode.userConfirmed) {
        const inference = inferDayMode({
          settings: store.lifeEngineSettings,
          homeTimezone: store.homeTimezone,
          currentTimezone: currentTz,
          workSchedule: profileCtx.workSchedule,
          pastRecords,
        })
        todayRecord = applyDayMode(
          todayRecord,
          createDayMode(inference.mode, {
            source: 'auto',
            confidence: inference.confidence,
            signals: inference.signals,
            userConfirmed: false,
          }),
        )

        // At home: skip mode prompt — go straight to the next best step
        if (!isAbroad) {
          todayRecord = applyDayMode(
            todayRecord,
            confirmDayMode(todayRecord.dayMode, inference.mode),
          )
        }
      }

      todayRecord = { ...todayRecord, timezone: currentTz }
    }

    const vacationApplied = applyVacationToToday(todayRecord, store.lifeEngineSettings)
    todayRecord = vacationApplied.record
    store.lifeEngineSettings = vacationApplied.lifeEngineSettings

    store.records[todayKey] = todayRecord
    store.lastKnownTimezone = currentTz
    saveDailyStore(store)

    const flow = computeFlowState(todayRecord, store.homeTimezone)
    const flowStep = todayRecord.flowCompleted
      ? 'done'
      : flow.activeFlowSteps.includes(todayRecord.flowStep)
        ? todayRecord.flowStep
        : flow.activeFlowSteps[0]

    set({
      hydrated: true,
      todayRecord,
      flowStep,
      ...flow,
      homeTimezone: store.homeTimezone,
      lifeEngineSettings: store.lifeEngineSettings,
      achievedMilestones: store.achievedMilestones ?? [],
    })

    useAchievementStore.getState().processConsistency()
    get().ensureGuidedFlow()
  },

  refreshFlowSteps: () => {
    const record = get().todayRecord
    if (!record) return
    const flow = computeFlowState(record, get().homeTimezone)
    set(flow)
  },

  getFirstName: () => getProfileContext().firstName,
  getMainGoal: () => getProfileContext().mainGoal,
  getGreetingText: () => `${getGreeting()}, ${get().getFirstName()}.`,

  getDateLabel: () => {
    const record = get().todayRecord
    const date = formatDisplayDate()
    if (record?.dayMode.mode === 'travel') {
      return `${date} · ${record.timezone}`
    }
    return date
  },

  getModeJourneyConfig: () => {
    const record = get().todayRecord
    if (!record) return null
    return getModeJourney(record.dayMode.mode)
  },

  getJourneyItems: () => get().getModeJourneyConfig()?.journeyItems ?? [],

  getScheduleContext: () => {
    const data = loadOnboardingData()
    const profile = data?.profile
    if (!profile) return null

    const workSchedule = isModuleEnabled(profile, 'work')
      ? profile.workSchedule
      : { ...emptyWorkSchedule(), works: false }

    const petName = isModuleEnabled(profile, 'pets')
      ? profile.pets?.[0]?.name ?? null
      : null

    const gymAccess =
      isModuleEnabled(profile, 'fitness') && profile.gymAccess === true

    return buildScheduleContext(
      workSchedule,
      profile.wakeUpTime,
      profile.bedtime,
      petName,
      gymAccess,
    )
  },

  getWorkBlockDisplay: () => {
    const record = get().todayRecord
    if (!record || record.dayMode.mode !== 'busy_workday') return null
    const ctx = getProfileContext()
    if (!ctx.workSchedule) return null
    return getWorkBlock(ctx.workSchedule)
  },

  getFocusText: () => {
    const record = get().todayRecord
    if (!record) return ''
    const journey = getModeJourney(record.dayMode.mode)
    const scheduleCtx = get().getScheduleContext()

    if (record.dayMode.mode === 'busy_workday' && scheduleCtx) {
      return getScheduledFocus(record.dayMode.mode, scheduleCtx, get().getFirstName())
    }

    return journey.focus
  },

  getNextActionContent: () => {
    const record = get().todayRecord
    if (!record) return { title: '', body: '' }
    const journey = getModeJourney(record.dayMode.mode)
    const mainGoal = get().getMainGoal()
    const scheduleCtx = get().getScheduleContext()

    if (record.dayMode.mode === 'busy_workday' && scheduleCtx) {
      return getScheduledNextAction(scheduleCtx, mainGoal)
    }

    if (mainGoal && record.dayMode.mode === 'normal') {
      return {
        title: journey.nextAction.title,
        body: `Move toward: ${mainGoal}`,
      }
    }

    return journey.nextAction
  },

  getCelebrateContent: () => {
    const record = get().todayRecord
    const store = loadDailyStore()
    const allRecords = Object.values(store.records)
    const score = record ? getDayConsistencyScore(record) : 0
    const rolling = getRollingConsistencyScore(allRecords)
    return {
      score,
      highlights: record ? getConsistencyHighlights(record) : [],
      message: getCoachMessage(rolling),
    }
  },

  getDayModeLabel: () => {
    const record = get().todayRecord
    if (!record) return 'Normal'
    return getModeLabel(record.dayMode.mode)
  },

  canProceed: () => {
    const { flowStep, weighInInput, todayRecord } = get()
    if (!todayRecord || isRecordLocked(todayRecord)) return false
    if (flowStep === 'weigh_in') return isValidWeightString(weighInInput)
    return true
  },

  saveTodayRecord: (record: DayRecord) => {
    const store = loadDailyStore()
    const saved = withDaySnapshot(applyDayMode(record, record.dayMode))
    store.records[record.dateKey] = saved
    saveDailyStore(store)
    set({ todayRecord: saved })
  },

  nextStep: () => {
    const { flowStep, activeFlowSteps, todayRecord } = get()
    if (!todayRecord || isRecordLocked(todayRecord)) return

    const next = getNextFlowStep(flowStep, activeFlowSteps)
    if (!next) return

    let updated = { ...todayRecord, flowStep: next, updatedAt: new Date().toISOString() }

    if (next === 'done') {
      updated = addConsistencyEvent(updated, 'completed_flow')
      updated.flowCompleted = true
      get().processMilestones()
    }

    get().saveTodayRecord(updated)
    set({ flowStep: next, direction: 1 })
  },

  prevStep: () => {
    const { flowStep, activeFlowSteps, todayRecord } = get()
    if (!todayRecord || isRecordLocked(todayRecord)) return
    const prev = getPrevFlowStep(flowStep, activeFlowSteps)
    if (!prev) return
    set({ flowStep: prev, direction: -1 })
  },

  confirmTodayMode: (mode: DayModeId) => {
    const record = get().todayRecord
    if (!record || isRecordLocked(record)) return

    const dayMode = confirmDayMode(record.dayMode, mode)
    let updated = applyDayMode(record, dayMode)
    const flow = computeFlowState(updated, get().homeTimezone)
    const targetStep: FlowStepId = 'ready'

    updated = { ...updated, flowStep: targetStep }
    get().saveTodayRecord(updated)
    set({ todayRecord: updated, ...flow, flowStep: targetStep, direction: 1 })
    recordIntelligenceObservation('day_mode_confirmed', 'daily', { mode })
    get().ensureGuidedFlow()
  },

  setTodayMode: (mode: DayModeId) => {
    const record = get().todayRecord
    if (!record || isRecordLocked(record)) return

    const dayMode = confirmDayMode(record.dayMode, mode)
    const updated = applyDayMode(record, dayMode)
    get().saveTodayRecord(updated)

    const flow = computeFlowState(updated, get().homeTimezone)
    set({ todayRecord: updated, ...flow, direction: 1 })
    get().ensureGuidedFlow()
  },

  setVacationMode: (enabled: boolean) => {
    const store = loadDailyStore()
    store.lifeEngineSettings.vacationModeEnabled = enabled
    if (enabled) store.lifeEngineSettings.sickModeEnabled = false
    saveDailyStore(store)
    set({ lifeEngineSettings: { ...store.lifeEngineSettings } })

    const record = get().todayRecord
    if (!record || isRecordLocked(record)) return

    if (enabled) {
      get().setTodayMode('vacation')
    } else if (record.dayMode.mode === 'vacation') {
      get().setTodayMode('normal')
    } else {
      get().hydrate()
    }
  },

  setSickMode: (enabled: boolean) => {
    const store = loadDailyStore()
    store.lifeEngineSettings.sickModeEnabled = enabled
    if (enabled) store.lifeEngineSettings.vacationModeEnabled = false
    saveDailyStore(store)
    set({ lifeEngineSettings: { ...store.lifeEngineSettings } })

    const record = get().todayRecord
    if (record && !isRecordLocked(record) && !record.dayMode.userConfirmed) {
      get().hydrate()
    }
  },

  logWeight: (weight: number) => {
    const record = get().todayRecord
    if (!record || isRecordLocked(record)) return

    let updated = addConsistencyEvent(record, 'logged_weight')
    updated = {
      ...updated,
      weighIn: { asked: true, logged: true, weight, deferUntilHome: false },
      updatedAt: new Date().toISOString(),
    }

    get().saveTodayRecord(updated)

    useWeightStore.getState().addEntry(weight)
    useAchievementStore.getState().processWeightLog(weight)
    get().processMilestones()

    const weighTask = updated.guidedFlow?.tasks.find(
      (t) => t.type === 'weigh_in' && t.status === 'pending',
    )
    if (weighTask) {
      get().setGuidedTaskStatus(weighTask.id, 'completed')
    }

    const flow = computeFlowState(updated, get().homeTimezone)
    set({ ...flow })
  },

  skipWeighIn: (reason: WeighInSkipReason) => {
    const record = get().todayRecord
    if (!record || isRecordLocked(record)) return

    let updated = addConsistencyEvent(record, 'skipped_weigh_in')
    updated = {
      ...updated,
      weighIn: {
        asked: true,
        logged: false,
        skipped: reason,
        deferUntilHome: reason === 'until_home',
      },
      updatedAt: new Date().toISOString(),
    }

    get().saveTodayRecord(updated)
    const flow = computeFlowState(updated, get().homeTimezone)
    set(flow)
  },

  setWeighInInput: (value: string) => set({ weighInInput: sanitizeWeightInput(value) }),

  isNutritionEnabled: () => {
    const data = loadOnboardingData()
    return data?.profile ? isModuleEnabled(data.profile, 'nutrition') : false
  },

  getNutritionTodaySummary: () => {
    const record = get().todayRecord
    if (!record || !get().isNutritionEnabled()) return null
    useNutritionStore.getState().hydrate()
    return useNutritionStore.getState().getTodaySummary(
      record.nutrition?.proteinGrams ?? 0,
      record.nutrition?.waterOz ?? 0,
    )
  },

  logWater: (oz = 8) => {
    const record = get().todayRecord
    if (!record || isRecordLocked(record)) return

    const nutrition = {
      proteinGrams: record.nutrition?.proteinGrams ?? 0,
      waterOz: (record.nutrition?.waterOz ?? 0) + oz,
    }

    let updated = addConsistencyEvent(record, 'drank_water')
    updated = { ...updated, nutrition, updatedAt: new Date().toISOString() }
    get().saveTodayRecord(updated)
  },

  logProtein: (grams = 25) => {
    const record = get().todayRecord
    if (!record || isRecordLocked(record)) return

    const nutrition = {
      proteinGrams: (record.nutrition?.proteinGrams ?? 0) + grams,
      waterOz: record.nutrition?.waterOz ?? 0,
    }

    const updated = {
      ...record,
      nutrition,
      updatedAt: new Date().toISOString(),
    }
    get().saveTodayRecord(updated)
  },

  getAllRecords: () => Object.values(loadDailyStore().records),

  getRecord: (dateKey) => loadDailyStore().records[dateKey] ?? null,

  processMilestones: () => {
    const store = loadDailyStore()
    const records = Object.values(store.records)
    const profileCtx = getProfileContext()
    const todayRecord = get().todayRecord
    const currentWeight =
      todayRecord?.weighIn.logged && todayRecord.weighIn.weight != null
        ? todayRecord.weighIn.weight
        : parseWeightExact(profileCtx.currentWeight ?? '')

    const newly = checkMilestones({
      records,
      currentWeight: currentWeight ?? undefined,
      startWeight: parseWeightExact(profileCtx.currentWeight ?? '') ?? undefined,
      goalWeight: parseWeightExact(profileCtx.goalWeight ?? '') ?? undefined,
      achievedMilestones: store.achievedMilestones ?? [],
    })

    if (newly.length > 0) {
      store.achievedMilestones = [...(store.achievedMilestones ?? []), ...newly]
      saveDailyStore(store)
      set({ achievedMilestones: store.achievedMilestones, newMilestones: newly })

      const achievementStore = useAchievementStore.getState()
      for (const id of newly) {
        const achId = milestoneToAchievement(id)
        if (achId) {
          achievementStore.unlock(achId)
          continue
        }
        const def = getMilestoneById(id)
        if (def && !achievementStore.getTimeline().some((t) => t.title === def.title)) {
          achievementStore.addLifeEvent({
            title: def.title,
            description: def.description,
            icon: '🏅',
            category: 'journey',
          })
        }
      }
    }

    useAchievementStore.getState().processConsistency()
  },

  updateDayNotes: (dateKey, notes) => {
    const store = loadDailyStore()
    const record = store.records[dateKey]
    if (!record || isRecordLocked(record)) return
    store.records[dateKey] = {
      ...record,
      notes,
      updatedAt: new Date().toISOString(),
    }
    saveDailyStore(store)
    if (get().todayRecord?.dateKey === dateKey) {
      set({ todayRecord: store.records[dateKey] })
    }
  },

  ensureGuidedFlow: () => {
    const record = get().todayRecord
    if (!record || isRecordLocked(record)) return
    if (!record.dayMode.userConfirmed && shouldShowModePrompt(record)) return

    const needsRegen =
      !record.guidedFlow ||
      record.guidedFlow.generationMode !== record.dayMode.mode

    if (!needsRegen) return

    const summary = get().getNutritionTodaySummary()
    const fresh = generateGuidedTasks(record, {
      breakfast: summary?.breakfast?.name,
      lunch: summary?.lunchReminder ?? undefined,
      dinner: summary?.dinnerIdea?.name,
    })

    const merged = {
      ...fresh,
      tasks: mergeGuidedTasks(record.guidedFlow?.tasks, fresh.tasks),
    }

    const updated = { ...record, guidedFlow: merged, updatedAt: new Date().toISOString() }
    get().saveTodayRecord(updated)
  },

  getGuidedTasks: () => get().todayRecord?.guidedFlow?.tasks ?? [],

  getCurrentGuidedTask: () => {
    const tasks = get().getGuidedTasks()
    return getCurrentTask(tasks)
  },

  getMomentumSummary: () => computeMomentum(get().getGuidedTasks()),

  getGuidedJourneyMessage: () => {
    const { score } = get().getMomentumSummary()
    return getJourneyMessage(
      get().todayRecord?.dayMode.mode ?? 'normal',
      score,
      get().getFirstName(),
    )
  },

  setGuidedTaskStatus: (taskId, status) => {
    const record = get().todayRecord
    if (!record?.guidedFlow || isRecordLocked(record)) return

    const tasks = record.guidedFlow.tasks.map((t) => {
      if (t.id !== taskId) return t
      return {
        ...t,
        status,
        earnedPoints: pointsForStatus(t.maxPoints, status),
      }
    })

    const updated = {
      ...record,
      guidedFlow: { ...record.guidedFlow, tasks },
      updatedAt: new Date().toISOString(),
    }
    get().saveTodayRecord(updated)

    const task = tasks.find((t) => t.id === taskId)
    if (status === 'skipped' && task) {
      recordIntelligenceObservation('task_skipped', 'daily', {
        taskType: task.type,
        weekday: new Date(record.dateKey + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long' }),
      })
    }
    if ((status === 'completed' || status === 'short') && task?.type === 'workout') {
      recordIntelligenceObservation('workout_completed', 'fitness', {
        hour: new Date().getHours(),
      })
    }
    if (status === 'completed' && task?.type === 'pet_walk') {
      const hour = new Date().getHours()
      if (hour < 10) {
        recordIntelligenceObservation('pet_walk_before_breakfast', 'pets', {
          petName: task.title,
        })
      }
    }
    if (status === 'completed' && task?.type === 'study') {
      recordIntelligenceObservation('study_completed', 'daily', {})
    }

    if (status === 'completed' || status === 'short') {
      get().processMilestones()
      if (status === 'completed' && tasks.find((t) => t.id === taskId)?.type === 'reflection') {
        const record = get().todayRecord
        if (record && !isRecordLocked(record)) {
          get().saveTodayRecord({
            ...record,
            flowCompleted: true,
            updatedAt: new Date().toISOString(),
          })
        }
      }
    }
  },

  completeGuidedTask: (taskId) => {
    const task = get().getGuidedTasks().find((t) => t.id === taskId)
    if (!task) return

    if (task.type === 'water' || task.type === 'hydration') {
      get().logWater()
    } else if (task.type === 'protein') {
      get().logProtein()
    } else if (task.type === 'weigh_in') {
      return
    }

    get().setGuidedTaskStatus(taskId, 'completed')
  },

  needsModePrompt: () => {
    const record = get().todayRecord
    if (!record || isRecordLocked(record)) return false
    return shouldShowModePrompt(record) && !record.dayMode.userConfirmed
  },

  isGuidedDayComplete: () => {
    const tasks = get().getGuidedTasks()
    if (tasks.length === 0) return false
    return tasks.every(
      (t) => t.status !== 'pending' && t.status !== 'rescheduled',
    )
  },
}))
