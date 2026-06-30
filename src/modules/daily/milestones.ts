import type { DayRecord, MilestoneDefinition, MilestoneId } from './types'
import { getRollingConsistencyScore } from './consistency'

export const MILESTONES: MilestoneDefinition[] = [
  { id: 'first_weigh_in', title: 'First Weigh-In', description: 'You logged your first weight.' },
  { id: 'lost_first_pound', title: 'First Pound', description: 'You lost your first pound.' },
  { id: 'lost_5_pounds', title: '5 Pounds Down', description: 'Five pounds of progress.' },
  { id: 'lost_10_pounds', title: '10 Pounds Down', description: 'Ten pounds of progress.' },
  { id: 'goal_weight', title: 'Goal Weight', description: 'You reached your goal weight.' },
  { id: 'consistent_7_days', title: '7 Consistent Days', description: 'A week of showing up.' },
  { id: 'consistent_30_days', title: '30 Consistent Days', description: 'A month of consistency.' },
  { id: 'consistent_100_days', title: '100 Consistent Days', description: 'One hundred days strong.' },
  { id: 'workout_pr', title: 'Workout PR', description: 'New personal record.' },
  { id: 'study_milestone', title: 'Study Milestone', description: 'Learning milestone reached.' },
  { id: 'debt_milestone', title: 'Debt Milestone', description: 'Debt progress celebrated.' },
  { id: 'savings_milestone', title: 'Savings Milestone', description: 'Savings goal reached.' },
]

export type MilestoneCheckContext = {
  records: DayRecord[]
  currentWeight?: number
  startWeight?: number
  goalWeight?: number
  achievedMilestones: MilestoneId[]
}

export function checkMilestones(ctx: MilestoneCheckContext): MilestoneId[] {
  const newlyAchieved: MilestoneId[] = []
  const achieved = new Set(ctx.achievedMilestones)

  const weighIns = ctx.records.filter((r) => r.weighIn.logged && r.weighIn.weight != null)
  if (weighIns.length >= 1 && !achieved.has('first_weigh_in')) {
    newlyAchieved.push('first_weigh_in')
  }

  if (ctx.startWeight != null && ctx.currentWeight != null) {
    const lost = ctx.startWeight - ctx.currentWeight
    if (lost >= 1 && !achieved.has('lost_first_pound')) newlyAchieved.push('lost_first_pound')
    if (lost >= 5 && !achieved.has('lost_5_pounds')) newlyAchieved.push('lost_5_pounds')
    if (lost >= 10 && !achieved.has('lost_10_pounds')) newlyAchieved.push('lost_10_pounds')
  }

  if (
    ctx.goalWeight != null &&
    ctx.currentWeight != null &&
    ctx.currentWeight <= ctx.goalWeight &&
    !achieved.has('goal_weight')
  ) {
    newlyAchieved.push('goal_weight')
  }

  const rolling = getRollingConsistencyScore(ctx.records, 7)
  const activeDays = ctx.records.filter((r) => r.consistencyEvents.length > 0).length

  if (rolling >= 70 && !achieved.has('consistent_7_days')) newlyAchieved.push('consistent_7_days')
  if (activeDays >= 30 && !achieved.has('consistent_30_days')) newlyAchieved.push('consistent_30_days')
  if (activeDays >= 100 && !achieved.has('consistent_100_days')) newlyAchieved.push('consistent_100_days')

  return newlyAchieved
}

export function getMilestoneById(id: MilestoneId): MilestoneDefinition | undefined {
  return MILESTONES.find((m) => m.id === id)
}
