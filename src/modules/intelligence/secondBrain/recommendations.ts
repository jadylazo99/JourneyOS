import { getLocalDateKey } from '@/modules/daily/date'
import { loadDailyStore } from '@/modules/daily/storage'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import { isModuleEnabled } from '@/modules/modules/engine'
import { getNextExam, examCountdownLabel } from '../memory/exams'
import { isVacationDayMode } from '../vacation/engine'
import type { Recommendation } from '../types'

function parseTimeToMinutes(time: string): number | null {
  const m = time.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

function nowMinutes(): number {
  const n = new Date()
  return n.getHours() * 60 + n.getMinutes()
}

export function getRecommendations(): Recommendation[] {
  const recs: Recommendation[] = []
  const profile = loadOnboardingData()?.profile
  if (!profile) return recs

  const daily = loadDailyStore()
  const todayKey = getLocalDateKey()
  const record = daily.records[todayKey]
  if (!record) return recs

  const dayMode = record.dayMode.mode
  if (isVacationDayMode(dayMode) || dayMode === 'sick' || dayMode === 'rest') {
    return recs
  }

  const nutritionOn = isModuleEnabled(profile, 'nutrition')
  const fitnessOn = isModuleEnabled(profile, 'fitness')
  const waterOz = record.nutrition?.waterOz ?? 0

  if (nutritionOn && waterOz < 8) {
    recs.push({
      id: 'rec_water',
      priority: 90,
      title: 'Hydration',
      message: "You haven't logged water yet today. A glass now is a gentle win.",
      kind: 'water',
      actions: [
        { id: 'complete', label: 'Log water' },
        { id: 'dismiss', label: 'Later' },
      ],
      module: 'nutrition',
    })
  }

  if (fitnessOn && profile.fitness.workoutTime) {
    const workoutMin = parseTimeToMinutes(profile.fitness.workoutTime)
    const now = nowMinutes()
    const workoutTask = record.guidedFlow?.tasks?.find((t) => t.type === 'workout')
    const workoutPending =
      workoutTask &&
      workoutTask.status !== 'completed' &&
      workoutTask.status !== 'skipped' &&
      workoutTask.status !== 'not_needed'

    if (workoutMin !== null && now > workoutMin + 30 && workoutPending) {
      recs.push({
        id: 'rec_workout_passed',
        priority: 80,
        title: 'Workout window',
        message: 'Your usual workout time passed. No pressure — pick what fits now.',
        kind: 'workout',
        actions: [
          { id: 'short_version', label: 'Short workout' },
          { id: 'walk_instead', label: 'Walk instead' },
          { id: 'reschedule', label: 'Reschedule' },
          { id: 'dismiss', label: 'Skip today' },
        ],
        module: 'fitness',
      })
    }
  }

  const proteinGoal = profile.nutritionGoals.protein
  const proteinGrams = record.nutrition?.proteinGrams ?? 0
  if (nutritionOn && proteinGrams < proteinGoal * 0.3 && nowMinutes() > 12 * 60) {
    recs.push({
      id: 'rec_protein',
      priority: 70,
      title: 'Protein',
      message: 'A protein-forward meal or snack could help you feel steady today.',
      kind: 'protein',
      actions: [
        { id: 'complete', label: 'Log protein' },
        { id: 'dismiss', label: 'Not now' },
      ],
      module: 'nutrition',
    })
  }

  const studyOn = isModuleEnabled(profile, 'study')
  const nextExam = studyOn ? getNextExam(profile.journeyMemory.study) : null
  if (nextExam && nextExam.daysUntil <= 7) {
    const studyTask = record.guidedFlow?.tasks?.find((t) => t.type === 'study')
    const studyPending =
      !studyTask ||
      (studyTask.status !== 'completed' && studyTask.status !== 'skipped')
    if (studyPending) {
      recs.push({
        id: 'rec_study',
        priority: 75,
        title: 'Study focus',
        message: `${examCountdownLabel(nextExam)} — a short session still counts.`,
        kind: 'study',
        actions: [
          { id: 'complete', label: 'Study now' },
          { id: 'dismiss', label: 'Later' },
        ],
        module: 'study',
      })
    }
  }

  if (isModuleEnabled(profile, 'pets') && profile.pets.length > 0) {
    const petTask = record.guidedFlow?.tasks?.find((t) => t.type === 'pet_walk')
    const petPending =
      petTask &&
      petTask.status === 'pending' &&
      nowMinutes() > 10 * 60
    if (petPending) {
      recs.push({
        id: 'rec_pet',
        priority: 65,
        title: 'Pet care',
        message: `A walk with ${profile.pets[0]?.name ?? 'your pet'} could be a nice break.`,
        kind: 'pet',
        actions: [
          { id: 'complete', label: 'Mark done' },
          { id: 'dismiss', label: 'Later' },
        ],
        module: 'pets',
      })
    }
  }

  return recs.sort((a, b) => b.priority - a.priority)
}

export function getTopRecommendation(): Recommendation | null {
  const recs = getRecommendations()
  return recs[0] ?? null
}
