import { getTodayWeekdayName } from '@/modules/daily/schedule'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { isModuleEnabled } from '@/modules/modules/engine'
import { DEFAULT_WEEKLY_PLAN, getPlanForWeekday } from './defaultPlan'
import type {
  AdaptiveWorkoutResult,
  FitnessContext,
  WorkoutExercise,
  WorkoutPlan,
} from './types'
import type { DayModeId } from '@/modules/daily/types'
import type { UserProfile } from '@/modules/onboarding/types'

export function buildFitnessContext(
  profile: UserProfile,
  dayMode: DayModeId = 'normal',
): FitnessContext {
  return {
    fitnessEnabled: isModuleEnabled(profile, 'fitness'),
    weightLossEnabled: isModuleEnabled(profile, 'weight_loss'),
    gymAccess: profile.gymAccess === true,
    gymType: profile.fitness?.gymType ?? 'none',
    workoutDays: profile.fitness?.workoutDays ?? [],
    workoutTime: profile.fitness?.workoutTime ?? '07:00',
    workoutLengthMinutes: profile.fitness?.workoutLengthMinutes ?? 45,
    injuriesOrLimitations: profile.fitness?.injuriesOrLimitations ?? [],
    equipment: profile.fitness?.equipment ?? [],
    petName:
      isModuleEnabled(profile, 'pets') && profile.pets[0]?.name
        ? profile.pets[0].name
        : null,
    dayMode,
    todayWeekday: getTodayWeekdayName(),
  }
}

export function getFitnessContextFromStorage(dayMode: DayModeId = 'normal'): FitnessContext | null {
  const data = loadOnboardingData()
  if (!data?.profile) return null
  return buildFitnessContext(data.profile, dayMode)
}

function shortenExercises(exercises: WorkoutExercise[]): WorkoutExercise[] {
  return exercises
    .filter((e) => e.kind === 'strength' || e.kind === 'cardio')
    .slice(0, 4)
    .map((e) =>
      e.kind === 'strength' && e.sets
        ? { ...e, sets: Math.max(2, e.sets - 1) }
        : e,
    )
}

function walkWorkout(petName: string | null): WorkoutExercise[] {
  const label = petName ? `Walk with ${petName}` : 'Easy walk'
  return [
    {
      id: 'walk-main',
      name: label,
      kind: 'activity',
      duration: '30 min',
      notes: 'Keep it easy. Movement counts.',
    },
  ]
}

function recoveryWorkout(): WorkoutExercise[] {
  return [
    { id: 'rec-st', name: 'Gentle stretching', kind: 'mobility', duration: '10 min' },
    { id: 'rec-walk', name: 'Light walk', kind: 'activity', duration: '20 min' },
  ]
}

function personalizeSaturdayExercises(
  exercises: WorkoutExercise[],
  petName: string | null,
): WorkoutExercise[] {
  if (!petName) return exercises
  return exercises.map((e) =>
    e.name.includes('Bruno') || e.name.includes('walk')
      ? { ...e, name: e.name.replace('Bruno', petName) }
      : e.name.includes('45–60 min walk')
        ? { ...e, name: `45–60 min walk with ${petName}` }
        : e,
  )
}

function applyInjuryFilter(
  exercises: WorkoutExercise[],
  limitations: string[],
): WorkoutExercise[] {
  if (limitations.length === 0) return exercises
  const blocked = limitations.map((l) => l.toLowerCase())
  return exercises.filter((e) => {
    const name = e.name.toLowerCase()
    return !blocked.some((b) => name.includes(b) || b.includes(name))
  })
}

export function adaptWorkout(
  plan: WorkoutPlan,
  ctx: FitnessContext,
): AdaptiveWorkoutResult {
  let exercises = [...plan.exercises]
  if (ctx.petName) {
    exercises = personalizeSaturdayExercises(exercises, ctx.petName)
  }
  exercises = applyInjuryFilter(exercises, ctx.injuriesOrLimitations)

  const base = {
    plan,
    skipOffered: true,
    exercises,
    title: plan.title,
    subtitle: plan.subtitle ?? '',
    estimatedMinutes: plan.estimatedMinutes,
  }

  switch (ctx.dayMode) {
    case 'vacation':
      return {
        ...base,
        showWorkout: false,
        variant: 'walk',
        title: 'Walking Goal',
        subtitle: 'Enjoy your time away',
        exercises: walkWorkout(ctx.petName),
        estimatedMinutes: 30,
        message: 'Gym workouts are paused on vacation. A walk is perfect today.',
        walkingGoal: 'Aim for 30–45 minutes of easy walking.',
        skipOffered: false,
      }

    case 'sick':
      return {
        ...base,
        showWorkout: false,
        variant: 'rest',
        title: 'Rest & Hydrate',
        subtitle: 'Healing comes first',
        exercises: [],
        estimatedMinutes: 0,
        message: 'No workout today. Rest, hydrate, and recover.',
        skipOffered: false,
      }

    case 'recovery':
      return {
        ...base,
        showWorkout: true,
        variant: 'recovery',
        title: 'Light Recovery',
        subtitle: 'Ease back in gently',
        exercises: recoveryWorkout(),
        estimatedMinutes: 30,
        message: 'Stretching and a light walk — nothing demanding.',
      }

    case 'busy_workday':
      return {
        ...base,
        showWorkout: true,
        variant: 'short',
        title: `${plan.title} — Short Version`,
        subtitle: 'Essentials only',
        exercises: shortenExercises(exercises),
        estimatedMinutes: Math.min(25, plan.estimatedMinutes),
        message: 'Busy day? This shorter session still counts.',
      }

    case 'rest':
      if (plan.isRestDay) {
        return {
          ...base,
          showWorkout: true,
          variant: 'recovery',
          title: plan.title,
          exercises,
          estimatedMinutes: plan.estimatedMinutes,
          message: 'Rest day — gentle movement only.',
        }
      }
      return {
        ...base,
        showWorkout: true,
        variant: 'walk',
        title: 'Active Recovery',
        exercises: walkWorkout(ctx.petName),
        estimatedMinutes: 30,
        message: 'Rest day. A walk or light mobility is enough.',
      }

    default:
      if (!ctx.gymAccess && ctx.gymType === 'none') {
        return {
          ...base,
          showWorkout: true,
          variant: 'walk',
          title: 'Home Movement',
          subtitle: 'No gym needed',
          exercises: walkWorkout(ctx.petName),
          estimatedMinutes: 30,
          message: 'Bodyweight and walking — still progress.',
        }
      }
      return {
        ...base,
        showWorkout: true,
        variant: 'full',
        title: plan.title,
        subtitle: plan.subtitle ?? '',
        exercises,
        estimatedMinutes: ctx.workoutLengthMinutes || plan.estimatedMinutes,
      }
  }
}

export function getTodayAdaptiveWorkout(dayMode: DayModeId = 'normal'): AdaptiveWorkoutResult | null {
  const data = loadOnboardingData()
  if (!data?.profile || !isModuleEnabled(data.profile, 'fitness')) return null

  const ctx = buildFitnessContext(data.profile, dayMode)
  const plan = getPlanForWeekday(ctx.todayWeekday, false)
  if (!plan) return null

  return adaptWorkout(plan, ctx)
}

export function getWeeklyPlan(): WorkoutPlan[] {
  return DEFAULT_WEEKLY_PLAN
}
