import { getModeJourney } from './modeJourney'
import { shouldPromptForMode } from './dayModeEngine'
import type { DayRecord, FlowStepId } from './types'

const BASE_FLOW: FlowStepId[] = [
  'greeting',
  'mode_prompt',
  'ready',
  'weigh_in',
  'focus',
  'next_action',
  'celebrate',
  'done',
]

export function getActiveFlowSteps(
  _record: DayRecord,
  options: { showModePrompt: boolean; showWeighIn: boolean },
): FlowStepId[] {
  return BASE_FLOW.filter((step) => {
    if (step === 'mode_prompt') return options.showModePrompt
    if (step === 'weigh_in') return options.showWeighIn
    return true
  })
}

export function getNextFlowStep(
  current: FlowStepId,
  activeSteps: FlowStepId[],
): FlowStepId | null {
  const index = activeSteps.indexOf(current)
  if (index === -1 || index >= activeSteps.length - 1) return null
  return activeSteps[index + 1]
}

export function getPrevFlowStep(
  current: FlowStepId,
  activeSteps: FlowStepId[],
): FlowStepId | null {
  const index = activeSteps.indexOf(current)
  if (index <= 0) return null
  return activeSteps[index - 1]
}

export function shouldAskWeighIn(
  record: DayRecord,
  options?: { homeTimezone?: string; currentTimezone?: string },
): boolean {
  const journey = getModeJourney(record.dayMode.mode)
  if (journey.hideWeighIn) return false
  if (record.weighIn.logged) return false

  if (record.weighIn.deferUntilHome) {
    const home = options?.homeTimezone
    const current = options?.currentTimezone
    if (home && current && home === current) {
      return !record.weighIn.logged
    }
    return false
  }

  if (record.weighIn.asked && record.weighIn.skipped === 'today') return false
  if (record.weighIn.asked && record.weighIn.skipped === 'not_now') return false
  if (record.weighIn.asked && !record.weighIn.logged) return false

  return true
}

export function shouldShowModePrompt(record: DayRecord): boolean {
  return shouldPromptForMode(record.dayMode)
}
