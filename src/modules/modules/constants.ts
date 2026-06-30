import type { ModuleId } from '@/modules/onboarding/types'

export const ALL_MODULE_IDS: ModuleId[] = [
  'weight_loss',
  'fitness',
  'nutrition',
  'study',
  'finance',
  'pets',
  'travel',
  'sleep',
  'mental_wellness',
  'work',
  'home',
]

export const MODULE_LABELS: Record<ModuleId, string> = {
  weight_loss: 'Weight Loss',
  fitness: 'Fitness',
  nutrition: 'Nutrition',
  study: 'Study',
  finance: 'Finance',
  pets: 'Pets',
  travel: 'Travel',
  sleep: 'Sleep',
  mental_wellness: 'Mental Wellness',
  work: 'Work',
  home: 'Home',
}

export const MODULE_DESCRIPTIONS: Record<ModuleId, string> = {
  weight_loss: 'Weigh-ins, milestones, and weight progress',
  fitness: 'Workouts and movement goals',
  nutrition: 'Food preferences and nutrition tracking',
  study: 'Learning goals and study achievements',
  finance: 'Savings, debt, and money milestones',
  pets: 'Pet care and daily needs',
  travel: 'Travel days and vacation mode',
  sleep: 'Wake-up and bedtime routines',
  mental_wellness: 'Mindset and wellbeing',
  work: 'Work schedule and busy day planning',
  home: 'Home and life admin',
}

export const DEFAULT_ENABLED_MODULES: ModuleId[] = [...ALL_MODULE_IDS]
