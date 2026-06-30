import { WEIGHT_MILESTONE_STEP } from './constants'
import type { WeightEntry, WeightMilestone, WeightProgress, NextMilestoneInfo } from './types'

export function formatWeightValue(weight: number, unit: 'lb' | 'kg' = 'lb'): string {
  const str = weight.toString()
  return `${str} ${unit}`
}

export function getLatestEntry(entries: WeightEntry[]): WeightEntry | null {
  if (entries.length === 0) return null
  return [...entries].sort((a, b) => {
    const d = b.dateKey.localeCompare(a.dateKey)
    if (d !== 0) return d
    return b.time.localeCompare(a.time)
  })[0]
}

export function getStartWeight(
  entries: WeightEntry[],
  onboardingStart?: number | null,
): number | null {
  if (entries.length === 0) return onboardingStart ?? null
  const oldest = [...entries].sort((a, b) => {
    const d = a.dateKey.localeCompare(b.dateKey)
    if (d !== 0) return d
    return a.time.localeCompare(b.time)
  })[0]
  return oldest.weight
}

export function computeWeightProgress(
  entries: WeightEntry[],
  goalWeight: number | null,
  onboardingStart?: number | null,
): WeightProgress {
  const startWeight = getStartWeight(entries, onboardingStart)
  const latest = getLatestEntry(entries)
  const currentWeight = latest?.weight ?? onboardingStart ?? null

  if (startWeight == null || currentWeight == null || goalWeight == null) {
    return {
      startWeight,
      currentWeight,
      goalWeight,
      totalPoundsToLose: null,
      poundsLost: null,
      poundsRemaining: null,
      percentComplete: null,
    }
  }

  const totalPoundsToLose = startWeight - goalWeight
  const poundsLost = startWeight - currentWeight
  const poundsRemaining = currentWeight - goalWeight
  const percentComplete =
    totalPoundsToLose > 0 ? (poundsLost / totalPoundsToLose) * 100 : 0

  return {
    startWeight,
    currentWeight,
    goalWeight,
    totalPoundsToLose,
    poundsLost,
    poundsRemaining,
    percentComplete: Math.max(0, Math.min(100, percentComplete)),
  }
}

export function generateWeightMilestones(
  startWeight: number,
  goalWeight: number,
  step = WEIGHT_MILESTONE_STEP,
): number[] {
  const targets: number[] = []
  let target = startWeight - step
  while (target > goalWeight) {
    targets.push(target)
    target -= step
  }
  if (goalWeight !== startWeight) {
    targets.push(goalWeight)
  }
  return targets
}

export function buildMilestoneList(
  startWeight: number,
  goalWeight: number,
  currentWeight: number,
): WeightMilestone[] {
  return generateWeightMilestones(startWeight, goalWeight).map((targetWeight) => ({
    targetWeight,
    poundsFromStart: startWeight - targetWeight,
    reached: currentWeight <= targetWeight,
  }))
}

export function getNextMilestone(
  startWeight: number,
  currentWeight: number,
  goalWeight: number,
): NextMilestoneInfo {
  const milestones = generateWeightMilestones(startWeight, goalWeight)
  const reached = milestones.filter((t) => currentWeight <= t)
  const nextTarget = milestones.find((t) => currentWeight > t) ?? null
  const previousTarget =
    reached.length > 0 ? reached[reached.length - 1] : startWeight

  if (nextTarget == null) {
    return {
      targetWeight: goalWeight,
      poundsRemaining: Math.max(0, currentWeight - goalWeight),
      progressPercent: currentWeight <= goalWeight ? 100 : 0,
      previousTarget,
    }
  }

  const span = previousTarget - nextTarget
  const traveled = previousTarget - currentWeight
  const progressPercent = span > 0 ? Math.max(0, Math.min(100, (traveled / span) * 100)) : 0

  return {
    targetWeight: nextTarget,
    poundsRemaining: currentWeight - nextTarget,
    progressPercent,
    previousTarget,
  }
}

export function getNewlyReachedMilestones(
  startWeight: number,
  goalWeight: number,
  previousWeight: number,
  newWeight: number,
  alreadyCelebrated: number[],
): number[] {
  const milestones = generateWeightMilestones(startWeight, goalWeight)
  const celebrated = new Set(alreadyCelebrated)

  return milestones.filter((target) => {
    if (celebrated.has(target)) return false
    return previousWeight > target && newWeight <= target
  })
}

export function getChartData(entries: WeightEntry[]): { date: string; weight: number }[] {
  return [...entries]
    .sort((a, b) => {
      const d = a.dateKey.localeCompare(b.dateKey)
      if (d !== 0) return d
      return a.time.localeCompare(b.time)
    })
    .map((e) => ({
      date: e.dateKey,
      weight: e.weight,
    }))
}
