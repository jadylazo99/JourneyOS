import type { DayModeId, ModeJourneyConfig } from './types'

export const MODE_JOURNEYS: Record<DayModeId, ModeJourneyConfig> = {
  normal: {
    label: 'Normal',
    focus: 'Steady progress. Small steps still count.',
    journeyItems: [
      'Balance work and wellbeing',
      'Stay hydrated throughout the day',
      'One meaningful action toward your goal',
    ],
    nextAction: {
      title: 'Take one meaningful step',
      body: 'Pick one thing that matters and give it five minutes.',
    },
    hideWeighIn: false,
    hideWorkoutPressure: false,
    skipOptionalTasks: false,
  },
  busy_workday: {
    label: 'Busy Workday',
    focus: 'Essentials only. Protect your energy between commitments.',
    journeyItems: [
      'Skip optional tasks',
      'Recommend a 20-minute workout',
      'Delay meal prep',
      'Focus on essentials',
    ],
    nextAction: {
      title: 'Protect one pocket of calm',
      body: 'Find ten minutes between commitments. Breathe. Reset.',
    },
    hideWeighIn: false,
    hideWorkoutPressure: false,
    skipOptionalTasks: true,
  },
  gym: {
    label: 'Gym Day',
    focus: 'Move with intention. Your body is ready.',
    journeyItems: [
      'Prepare your session',
      'Hydrate before and after',
      'Prioritize recovery tonight',
    ],
    nextAction: {
      title: 'Prepare your session',
      body: "When you're ready, your workout module will guide you. For now, hydrate.",
    },
    hideWeighIn: false,
    hideWorkoutPressure: false,
    skipOptionalTasks: false,
  },
  rest: {
    label: 'Rest Day',
    focus: 'Recovery is progress. No pressure to perform.',
    journeyItems: ['No structured workout', 'Take a walk', 'Stretch gently', 'Recover'],
    nextAction: {
      title: 'Restore intentionally',
      body: 'A walk, a stretch, or stillness — whatever your body needs.',
    },
    hideWeighIn: false,
    hideWorkoutPressure: true,
    skipOptionalTasks: true,
  },
  vacation: {
    label: 'Vacation',
    focus: 'Be present. Structure can wait.',
    journeyItems: [
      'Weigh-ins hidden today',
      'Walking instead of workouts',
      'Capture a photo memory',
      'Stay hydrated',
      'Local restaurant suggestions coming soon',
    ],
    nextAction: {
      title: 'Be present',
      body: 'Explore, walk, and enjoy. Check in when it feels right.',
    },
    hideWeighIn: true,
    hideWorkoutPressure: true,
    skipOptionalTasks: true,
  },
  travel: {
    label: 'Travel',
    focus: 'New surroundings, same you. We adapt as you go.',
    journeyItems: [
      'Timezone adjusted automatically',
      'Local date and greeting updated',
      'Walking suggestions coming soon',
      'Keep today flexible',
    ],
    nextAction: {
      title: 'Settle in',
      body: "Adjust to your new rhythm. We'll keep today light and flexible.",
    },
    hideWeighIn: false,
    hideWorkoutPressure: true,
    skipOptionalTasks: true,
  },
  sick: {
    label: 'Sick',
    focus: 'Your only job today is to heal.',
    journeyItems: [
      'Rest',
      'Medication reminders coming soon',
      'Drink water',
      'Prioritize recovery',
      'Sleep',
    ],
    nextAction: {
      title: 'Rest and hydrate',
      body: 'Your consistency score still rewards showing up. Healing comes first.',
    },
    hideWeighIn: true,
    hideWorkoutPressure: true,
    skipOptionalTasks: true,
  },
  recovery: {
    label: 'Recovery',
    focus: 'Ease back in gently. Consistency beats intensity.',
    journeyItems: [
      'Light movement only',
      'Extra hydration',
      'Early wind-down',
      'No demanding tasks',
    ],
    nextAction: {
      title: 'Ease back in',
      body: 'Light movement or quiet focus — nothing demanding today.',
    },
    hideWeighIn: false,
    hideWorkoutPressure: true,
    skipOptionalTasks: true,
  },
  custom: {
    label: 'Custom',
    focus: 'Today is yours to shape.',
    journeyItems: ['Follow your own rhythm', 'Adjust as needed'],
    nextAction: {
      title: 'Your call',
      body: 'Do what feels right for today.',
    },
    hideWeighIn: false,
    hideWorkoutPressure: false,
    skipOptionalTasks: false,
  },
}

export function getModeJourney(mode: DayModeId): ModeJourneyConfig {
  return MODE_JOURNEYS[mode]
}

export function getModeLabel(mode: DayModeId): string {
  return MODE_JOURNEYS[mode].label
}
