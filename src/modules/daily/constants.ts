export const DAILY_STORAGE_KEY = 'journeyos_daily_records'

export const DAY_MODE_LABELS: Record<string, string> = {
  normal: 'Normal',
  busy_workday: 'Busy Workday',
  gym: 'Gym Day',
  rest: 'Rest Day',
  vacation: 'Vacation',
  travel: 'Travel',
  sick: 'Sick',
  recovery: 'Recovery',
  custom: 'Custom',
}

/** @deprecated use DAY_MODE_LABELS */
export const DAY_TYPE_LABELS = DAY_MODE_LABELS

export const CONSISTENCY_POINTS: Record<string, number> = {
  opened_app: 10,
  logged_weight: 15,
  skipped_weigh_in: 8,
  completed_flow: 12,
  walked_pet: 12,
  completed_workout: 20,
  studied: 15,
  drank_water: 5,
}

export function emptyLifeEngineSettings() {
  return {
    vacationModeEnabled: false,
    sickModeEnabled: false,
  }
}
