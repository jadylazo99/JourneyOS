import { loadOnboardingData } from '@/modules/onboarding/storage'
import { isModuleEnabled } from '@/modules/modules/engine'
import { emptyWorkSchedule } from '@/modules/onboarding/storage'
import { shouldAskWeighIn } from '../flow'
import { getModeJourney } from '../modeJourney'
import { getNextExam, examCountdownLabel } from '@/modules/intelligence/memory/exams'
import {
  buildScheduleContext,
  type ScheduleContext,
} from '../schedule'
import type { DayModeId, DayRecord } from '../types'
import { getTaskPoints } from './momentum'
import type { GuidedFlowState, GuidedTask, GuidedTaskType } from './types'

export type GuidedContext = {
  record: DayRecord
  dayMode: DayModeId
  schedule: ScheduleContext
  firstName: string
  petName: string | null
  petsAtHome: boolean
  nutritionEnabled: boolean
  fitnessEnabled: boolean
  petsEnabled: boolean
  weightEnabled: boolean
  studyEnabled: boolean
  studyMessage?: string
  breakfastName?: string
  lunchReminder?: string
  dinnerName?: string
}

function taskId(type: GuidedTaskType, suffix = ''): string {
  return `guided-${type}${suffix ? `-${suffix}` : ''}`
}

function makeTask(
  ctx: GuidedContext,
  type: GuidedTaskType,
  title: string,
  message: string,
  actionLabel: string,
  opts?: Partial<GuidedTask>,
): GuidedTask {
  const maxPoints = getTaskPoints(ctx.dayMode, type)
  return {
    id: taskId(type, opts?.phase),
    type,
    title,
    message,
    status: 'pending',
    maxPoints,
    earnedPoints: 0,
    actionLabel,
    ...opts,
  }
}

function buildContext(record: DayRecord): GuidedContext {
  const data = loadOnboardingData()
  const profile = data?.profile
  const dayMode = record.dayMode.mode

  const workSchedule =
    profile && isModuleEnabled(profile, 'work')
      ? profile.workSchedule
      : { ...emptyWorkSchedule(), works: false }

  const petName =
    profile && isModuleEnabled(profile, 'pets')
      ? profile.pets.find((p) => p.name)?.name ?? null
      : null

  const schedule = buildScheduleContext(
    workSchedule,
    profile?.wakeUpTime ?? '07:00',
    profile?.bedtime ?? '22:00',
    petName,
    profile && isModuleEnabled(profile, 'fitness') && profile.gymAccess === true
      ? true
      : false,
  )

  const nextExam = profile && isModuleEnabled(profile, 'study')
    ? getNextExam(profile.journeyMemory.study)
    : null

  const petsAtHome =
    profile != null &&
    isModuleEnabled(profile, 'pets') &&
    profile.vacation.travelingWithPets === false

  return {
    record,
    dayMode,
    schedule,
    firstName: profile?.firstName || 'there',
    petName,
    petsAtHome,
    nutritionEnabled: profile ? isModuleEnabled(profile, 'nutrition') : false,
    fitnessEnabled: profile ? isModuleEnabled(profile, 'fitness') : false,
    petsEnabled: profile ? isModuleEnabled(profile, 'pets') : false,
    weightEnabled: profile ? isModuleEnabled(profile, 'weight_loss') : false,
    studyEnabled: profile ? isModuleEnabled(profile, 'study') : false,
    studyMessage: nextExam ? examCountdownLabel(nextExam) : undefined,
  }
}

function normalTasks(ctx: GuidedContext): GuidedTask[] {
  const tasks: GuidedTask[] = []
  const journey = getModeJourney(ctx.dayMode)
  const pet = ctx.petName

  if (ctx.weightEnabled && shouldAskWeighIn(ctx.record)) {
    tasks.push(
      makeTask(ctx, 'weigh_in', 'Optional weigh-in', 'Want to log your weight today?', 'Log weight'),
    )
  }

  tasks.push(
    makeTask(
      ctx,
      'water',
      'Morning water',
      'Start with a glass of water before the day picks up speed.',
      'Log water',
      { phase: 'before_work' },
    ),
  )

  if (ctx.petsEnabled && pet) {
    tasks.push(
      makeTask(
        ctx,
        'pet_walk',
        `Walk ${pet}`,
        `Morning walk with ${pet} — fresh air for both of you.`,
        'Mark done',
        { phase: 'before_work' },
      ),
    )
  }

  if (ctx.studyEnabled) {
    tasks.push(
      makeTask(
        ctx,
        'study',
        ctx.studyMessage ? 'Study focus' : 'Study session',
        ctx.studyMessage ?? 'One focused block moves the needle.',
        'Mark done',
        { phase: 'before_work', subtitle: ctx.studyMessage },
      ),
    )
  }

  if (ctx.nutritionEnabled) {
    tasks.push(
      makeTask(
        ctx,
        'breakfast',
        'Breakfast',
        ctx.breakfastName
          ? `Idea: ${ctx.breakfastName}`
          : 'Fuel up with something satisfying.',
        'Log meal',
        { phase: 'before_work' },
      ),
    )
  }

  if (ctx.schedule.isWorkDay && ctx.schedule.workBlock) {
    tasks.push(
      makeTask(
        ctx,
        'work_block',
        'Work block',
        `Protected focus: ${ctx.schedule.workBlock.display}`,
        'Got it',
        { phase: 'before_work', subtitle: ctx.schedule.workBlock.label },
      ),
    )
  }

  tasks.push(
    makeTask(
      ctx,
      'hydration',
      'Water check',
      'Quick hydration check — even a few sips count.',
      'Log water',
      { phase: 'during_work' },
    ),
  )

  if (ctx.nutritionEnabled) {
    tasks.push(
      makeTask(
        ctx,
        'lunch',
        ctx.schedule.isWorkDay ? 'Lunch / meal prep' : 'Lunch',
        ctx.lunchReminder ?? 'Step away and eat something nourishing.',
        'Log lunch',
        { phase: 'during_work' },
      ),
    )
  }

  tasks.push(
    makeTask(
      ctx,
      'movement',
      'Movement break',
      'Ten minutes of movement — walk, stretch, or stand.',
      'Done',
      { phase: 'during_work' },
    ),
  )

  if (ctx.fitnessEnabled && !journey.hideWorkoutPressure) {
    tasks.push(
      makeTask(ctx, 'workout', "Today's workout", 'Your session is ready when you are.', 'Start workout', {
        phase: 'after_work',
        link: '/workout',
      }),
    )
  }

  if (ctx.nutritionEnabled) {
    tasks.push(
      makeTask(
        ctx,
        'dinner',
        'Dinner idea',
        ctx.dinnerName ? `Consider: ${ctx.dinnerName}` : 'Something simple and satisfying tonight.',
        'Log dinner',
        { phase: 'after_work' },
      ),
    )

    tasks.push(
      makeTask(
        ctx,
        'protein',
        'Protein check',
        'Hit your protein goal if you can — no pressure.',
        'Log protein',
        { phase: 'after_work' },
      ),
    )
  }

  if (ctx.petsEnabled && pet) {
    tasks.push(
      makeTask(
        ctx,
        'pet_evening',
        `Evening care — ${pet}`,
        'Feed, play, or wind down together.',
        'Mark done',
        { phase: 'evening' },
      ),
    )
  }

  tasks.push(
    makeTask(
      ctx,
      'reflection',
      'Night reflection',
      'Notice one thing that went well today. Small steps still count.',
      'Reflect',
      { phase: 'evening' },
    ),
  )

  return tasks
}

function busyTasks(ctx: GuidedContext): GuidedTask[] {
  const tasks: GuidedTask[] = []

  tasks.push(
    makeTask(ctx, 'water', 'Water', 'Stay hydrated between commitments.', 'Log water'),
  )

  if (ctx.nutritionEnabled) {
    tasks.push(
      makeTask(ctx, 'lunch', 'Meal prep lunch', 'Grab your prepped lunch or something quick.', 'Log lunch'),
    )
  }

  tasks.push(
    makeTask(ctx, 'movement', '10-minute movement', 'A short walk or stretch — just ten minutes.', 'Done'),
  )

  if (ctx.nutritionEnabled) {
    tasks.push(makeTask(ctx, 'dinner', 'Dinner', 'Keep dinner simple tonight.', 'Log dinner'))
  }

  tasks.push(
    makeTask(ctx, 'reflection', 'Night reflection', 'Close the day without pressure.', 'Reflect'),
  )

  return tasks
}

function vacationTasks(ctx: GuidedContext): GuidedTask[] {
  const tasks: GuidedTask[] = []

  tasks.push(
    makeTask(ctx, 'walking_goal', 'Walking goal', 'Explore on foot — no step target, just move.', 'Mark done'),
  )

  tasks.push(
    makeTask(
      ctx,
      'movement',
      'Stretch or hotel gym',
      'Optional light movement — walk, stretch, or use a hotel gym if you feel like it.',
      'Mark done',
    ),
  )

  tasks.push(
    makeTask(ctx, 'hydration', 'Hydration', 'Travel days dehydrate quickly. Drink up.', 'Log water'),
  )

  if (ctx.nutritionEnabled) {
    tasks.push(
      makeTask(ctx, 'protein', 'Protein first', 'Prioritize protein when you eat today.', 'Log protein'),
    )
  }

  if (ctx.petsAtHome && ctx.petName) {
    tasks.push(
      makeTask(
        ctx,
        'check_in',
        'Pets at home',
        `Check in on care for ${ctx.petName} while you're away.`,
        'Mark done',
      ),
    )
  }

  tasks.push(
    makeTask(
      ctx,
      'enjoy',
      'Enjoy your trip',
      `${ctx.firstName}, be present. Structure can wait.`,
      'Got it',
    ),
  )

  tasks.push(
    makeTask(
      ctx,
      'photo_memory',
      'Photo memory',
      'Capture one moment from today — optional and pressure-free.',
      'Mark done',
    ),
  )

  tasks.push(
    makeTask(ctx, 'reflection', 'Gentle check-in', 'How are you feeling? No wrong answers.', 'Reflect'),
  )

  return tasks
}

function sickTasks(ctx: GuidedContext): GuidedTask[] {
  return [
    makeTask(ctx, 'rest', 'Rest', 'Your only job today is to heal.', 'Resting'),
    makeTask(ctx, 'water', 'Water', 'Sip water throughout the day.', 'Log water'),
    makeTask(
      ctx,
      'medication',
      'Medication',
      'Take what you need — add reminders in Profile later.',
      'Mark done',
    ),
    makeTask(ctx, 'sleep', 'Prioritize sleep', 'Early wind-down tonight if you can.', 'Got it'),
    makeTask(ctx, 'check_in', 'Gentle check-in', 'How are you feeling? Be kind to yourself.', 'Check in'),
  ]
}

function restTasks(ctx: GuidedContext): GuidedTask[] {
  const tasks: GuidedTask[] = [
    makeTask(ctx, 'rest', 'Rest day', 'Recovery is progress. No performance required.', 'Got it'),
    makeTask(ctx, 'walking_goal', 'Light walk', 'Optional gentle movement — or skip entirely.', 'Mark done'),
    makeTask(ctx, 'water', 'Hydration', 'Keep water nearby today.', 'Log water'),
  ]

  if (ctx.petsEnabled && ctx.petName) {
    tasks.push(
      makeTask(ctx, 'pet_walk', `Walk ${ctx.petName}`, 'A relaxed walk — no rush.', 'Mark done'),
    )
  }

  tasks.push(makeTask(ctx, 'reflection', 'Check-in', 'Notice how your body feels.', 'Reflect'))

  return tasks
}

function gymTasks(ctx: GuidedContext): GuidedTask[] {
  const tasks: GuidedTask[] = []

  if (ctx.weightEnabled && shouldAskWeighIn(ctx.record)) {
    tasks.push(
      makeTask(ctx, 'weigh_in', 'Optional weigh-in', 'Quick check-in before your session?', 'Log weight'),
    )
  }

  tasks.push(
    makeTask(ctx, 'water', 'Pre-workout water', 'Hydrate before you train.', 'Log water'),
  )

  if (ctx.fitnessEnabled) {
    tasks.push(
      makeTask(ctx, 'workout', "Today's gym session", 'Your workout is the focus today.', 'Start workout', {
        link: '/workout',
      }),
    )
  }

  if (ctx.nutritionEnabled) {
    tasks.push(
      makeTask(ctx, 'protein', 'Post-workout protein', 'Refuel after your session.', 'Log protein'),
    )
  }

  tasks.push(
    makeTask(ctx, 'reflection', 'Session check-in', 'Notice how your body feels after training.', 'Reflect'),
  )

  return tasks
}

export function mergeGuidedTasks(
  existing: GuidedTask[] | undefined,
  fresh: GuidedTask[],
): GuidedTask[] {
  if (!existing?.length) return fresh
  const byType = new Map(existing.map((t) => [t.type, t]))
  return fresh.map((task) => {
    const prev = byType.get(task.type)
    // Only preserve progress for tasks still pending reschedule on the same day
    if (prev && prev.status !== 'pending') {
      return {
        ...task,
        status: prev.status,
        earnedPoints: prev.earnedPoints,
      }
    }
    return task
  })
}

export function generateGuidedTasks(
  record: DayRecord,
  mealHints?: { breakfast?: string; lunch?: string; dinner?: string },
): GuidedFlowState {
  const ctx = buildContext(record)
  ctx.breakfastName = mealHints?.breakfast
  ctx.lunchReminder = mealHints?.lunch
  ctx.dinnerName = mealHints?.dinner

  let tasks: GuidedTask[]

  switch (ctx.dayMode) {
    case 'busy_workday':
      tasks = busyTasks(ctx)
      break
    case 'vacation':
    case 'travel':
      tasks = vacationTasks(ctx)
      break
    case 'sick':
      tasks = sickTasks(ctx)
      break
    case 'rest':
    case 'recovery':
      tasks = restTasks(ctx)
      break
    case 'gym':
      tasks = gymTasks(ctx)
      break
    default:
      tasks = normalTasks(ctx)
  }

  return {
    tasks,
    generationMode: ctx.dayMode,
  }
}

export function getCurrentTask(tasks: GuidedTask[]): GuidedTask | null {
  return tasks.find((t) => t.status === 'pending' || t.status === 'rescheduled') ?? null
}

export function computeMomentum(tasks: GuidedTask[]): {
  score: number
  possible: number
  completedCount: number
  totalCount: number
} {
  const active = tasks.filter((t) => t.status !== 'not_needed')
  const score = tasks.reduce((sum, t) => sum + t.earnedPoints, 0)
  const possible = active.reduce((sum, t) => sum + t.maxPoints, 0)
  const completedCount = tasks.filter(
    (t) => t.status === 'completed' || t.status === 'short',
  ).length

  return {
    score,
    possible,
    completedCount,
    totalCount: tasks.length,
  }
}

export function getJourneyMessage(
  dayMode: DayModeId,
  momentum: number,
  firstName: string,
): string {
  const journey = getModeJourney(dayMode)

  if (momentum >= 60) {
    return `${firstName}, you've built real momentum today. Keep going at your pace.`
  }
  if (momentum >= 30) {
    return 'Small steps still count. You are showing up.'
  }
  if (dayMode === 'sick' || dayMode === 'recovery') {
    return journey.focus
  }
  if (dayMode === 'vacation' || dayMode === 'travel') {
    return 'Be present. Structure can wait.'
  }
  return journey.focus
}
