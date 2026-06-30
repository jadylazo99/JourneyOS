import { observationsForKind, observationsOnWeekday } from './observations'
import { loadOnboardingData } from '@/modules/onboarding/storage'
import type { IntelligenceObservation, LearnedPattern } from '../types'

function patternId(kind: string, suffix = ''): string {
  return `pat_${kind}${suffix ? `_${suffix}` : ''}`
}

function weekdayFromDateKey(dateKey: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[new Date(dateKey + 'T12:00:00').getDay()]
}

export function derivePatterns(observations: IntelligenceObservation[]): LearnedPattern[] {
  const patterns: LearnedPattern[] = []
  const now = new Date().toISOString()

  const workoutAfterWork = observationsForKind(observations, 'workout_completed').filter((o) => {
    const hour = new Date(o.timestamp).getHours()
    return hour >= 17
  })
  if (workoutAfterWork.length >= 3) {
    patterns.push({
      id: patternId('workout_after_work'),
      kind: 'workout_after_work',
      label: 'Normally works out after work',
      confidence: Math.min(95, 60 + workoutAfterWork.length * 5),
      evidenceCount: workoutAfterWork.length,
      lastSeen: workoutAfterWork[0]?.timestamp ?? now,
    })
  }

  for (const day of ['Thursday', 'Sunday']) {
    const skips = observationsOnWeekday(
      observationsForKind(observations, 'task_skipped'),
      day,
    )
    if (skips.length >= 2) {
      patterns.push({
        id: patternId('skip_weekday', day.toLowerCase()),
        kind: 'skip_weekday',
        label: day === 'Thursday' ? 'Usually skips Thursdays' : `Often skips ${day}s`,
        confidence: Math.min(90, 55 + skips.length * 8),
        evidenceCount: skips.length,
        lastSeen: skips[0]?.timestamp ?? now,
        metadata: { weekday: day },
      })
    }
  }

  const mealPrep = observationsOnWeekday(
    observationsForKind(observations, 'meal_prep'),
    'Sunday',
  )
  if (mealPrep.length >= 2) {
    patterns.push({
      id: patternId('meal_prep_day'),
      kind: 'meal_prep_day',
      label: 'Always meal preps Sunday',
      confidence: Math.min(92, 58 + mealPrep.length * 10),
      evidenceCount: mealPrep.length,
      lastSeen: mealPrep[0]?.timestamp ?? now,
      metadata: { weekday: 'Sunday' },
    })
  }

  const petWalks = observationsForKind(observations, 'pet_walk_before_breakfast')
  if (petWalks.length >= 2) {
    patterns.push({
      id: patternId('pet_walk_before_breakfast'),
      kind: 'pet_walk_before_breakfast',
      label: 'Normally walks dog before breakfast',
      confidence: Math.min(88, 50 + petWalks.length * 12),
      evidenceCount: petWalks.length,
      lastSeen: petWalks[0]?.timestamp ?? now,
    })
  }

  const travelEvents = observationsForKind(observations, 'timezone_change')
  if (travelEvents.length >= 2) {
    patterns.push({
      id: patternId('frequent_travel'),
      kind: 'frequent_travel',
      label: 'Frequently travels',
      confidence: Math.min(90, 50 + travelEvents.length * 15),
      evidenceCount: travelEvents.length,
      lastSeen: travelEvents[0]?.timestamp ?? now,
    })
  }

  const bedtimes = observationsForKind(observations, 'bedtime_logged')
  if (bedtimes.length >= 3) {
    const hours = bedtimes.map((o) => Number(o.payload.hour ?? 23))
    const avg = hours.reduce((a, b) => a + b, 0) / hours.length
    const label =
      avg >= 22.5
        ? 'Normally sleeps around 11 PM'
        : avg >= 21.5
          ? 'Normally sleeps around 10 PM'
          : `Typically sleeps around ${Math.round(avg)}:00`
    patterns.push({
      id: patternId('typical_bedtime'),
      kind: 'typical_bedtime',
      label,
      confidence: Math.min(85, 45 + bedtimes.length * 8),
      evidenceCount: bedtimes.length,
      lastSeen: bedtimes[0]?.timestamp ?? now,
      metadata: { avgHour: avg },
    })
  }

  const wakes = observationsForKind(observations, 'wake_logged')
  if (wakes.length >= 3) {
    const hours = wakes.map((o) => Number(o.payload.hour ?? 7))
    const avg = hours.reduce((a, b) => a + b, 0) / hours.length
    patterns.push({
      id: patternId('typical_wake'),
      kind: 'typical_wake',
      label: `Usually wakes around ${Math.round(avg)}:00`,
      confidence: Math.min(85, 45 + wakes.length * 8),
      evidenceCount: wakes.length,
      lastSeen: wakes[0]?.timestamp ?? now,
      metadata: { avgHour: avg },
    })
  }

  const profile = loadOnboardingData()?.profile
  if (profile?.bedtime) {
    const hour = Number(profile.bedtime.split(':')[0])
    if (!Number.isNaN(hour)) {
      const label =
        hour >= 22
          ? hour === 23
            ? 'Normally sleeps around 11 PM'
            : `Normally sleeps around ${hour}:00`
          : `Typically sleeps around ${hour}:00`
      patterns.push({
        id: patternId('typical_bedtime_profile'),
        kind: 'typical_bedtime',
        label,
        confidence: 70,
        evidenceCount: 1,
        lastSeen: now,
        metadata: { hour, source: 'profile' },
      })
    }
  }
  if (profile?.wakeUpTime) {
    const hour = Number(profile.wakeUpTime.split(':')[0])
    if (!Number.isNaN(hour) && !patterns.some((p) => p.kind === 'typical_wake')) {
      patterns.push({
        id: patternId('typical_wake_profile'),
        kind: 'typical_wake',
        label: `Usually wakes around ${hour}:00`,
        confidence: 70,
        evidenceCount: 1,
        lastSeen: now,
        metadata: { hour, source: 'profile' },
      })
    }
  }

  return patterns.slice(0, 50)
}

export function weekdayLabelFromDateKey(dateKey: string): string {
  return weekdayFromDateKey(dateKey)
}
