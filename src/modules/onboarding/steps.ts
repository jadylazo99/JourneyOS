import { isValidWeightString } from '@/utils/weight'
import type {
  OnboardingProfile,
  OnboardingStep,
  OnboardingStepId,
  OnboardingSection,
} from './types'
import { SCHEDULE_VARIABILITY_OPTIONS } from './types'

const BASE_STEPS: OnboardingStep[] = [
  {
    id: 'firstName',
    title: "What's your first name?",
    subtitle: 'We\'ll use this to personalize your experience.',
    inputType: 'text',
    placeholder: 'First name',
    field: 'firstName',
  },
  {
    id: 'birthday',
    title: 'When were you born?',
    subtitle: 'Helps us tailor recommendations to your life stage.',
    inputType: 'date',
    field: 'birthday',
  },
  {
    id: 'height',
    title: 'How tall are you?',
    subtitle: 'Select your height.',
    inputType: 'height',
    field: 'height',
  },
  {
    id: 'currentWeight',
    title: 'What is your current weight?',
    subtitle: 'Enter your exact weight, e.g. 236.8 lb.',
    inputType: 'weight',
    placeholder: '236.8',
    field: 'currentWeight',
  },
  {
    id: 'goalWeight',
    title: 'What is your goal weight?',
    subtitle: 'Where you want to be, e.g. 210.5 lb.',
    inputType: 'weight',
    placeholder: '210.5',
    field: 'goalWeight',
  },
  {
    id: 'mainGoal',
    title: 'What is your main goal?',
    subtitle: 'The one thing that matters most right now.',
    inputType: 'textarea',
    placeholder: 'Describe your main goal…',
    field: 'mainGoal',
  },
  {
    id: 'wakeUpTime',
    title: 'What time do you usually wake up?',
    inputType: 'time',
    field: 'wakeUpTime',
  },
  {
    id: 'bedtime',
    title: 'What time do you usually go to bed?',
    inputType: 'time',
    field: 'bedtime',
  },
  {
    id: 'works',
    title: 'Do you work?',
    inputType: 'yesNo',
    field: 'works',
  },
  {
    id: 'gymAccess',
    title: 'Do you have gym access?',
    inputType: 'yesNo',
    field: 'gymAccess',
  },
  {
    id: 'foodsLove',
    title: 'Foods you love',
    subtitle: 'Separate with commas.',
    inputType: 'textarea',
    placeholder: 'Avocado, salmon, dark chocolate…',
    field: 'foodsLove',
    optional: true,
  },
  {
    id: 'foodsDislike',
    title: 'Foods you dislike',
    subtitle: 'Separate with commas.',
    inputType: 'textarea',
    placeholder: 'Mushrooms, cilantro…',
    field: 'foodsDislike',
    optional: true,
  },
  {
    id: 'allergies',
    title: 'Any allergies?',
    subtitle: 'Leave blank if none.',
    inputType: 'textarea',
    placeholder: 'Peanuts, shellfish…',
    field: 'allergies',
    optional: true,
  },
  {
    id: 'hasPets',
    title: 'Do you have pets?',
    inputType: 'yesNo',
    field: 'hasPets',
  },
]

function workScheduleSteps(profile: OnboardingProfile): OnboardingStep[] {
  if (!profile.workSchedule.works) return []

  const steps: OnboardingStep[] = [
    {
      id: 'workDays',
      title: 'Which days do you usually work?',
      subtitle: 'Select all that apply.',
      inputType: 'daySelect',
    },
    {
      id: 'workStartTime',
      title: 'What time do you usually start work?',
      inputType: 'time',
      workScheduleField: 'startTime',
    },
    {
      id: 'workEndTime',
      title: 'What time do you usually finish work?',
      inputType: 'time',
      workScheduleField: 'endTime',
    },
    {
      id: 'scheduleVariability',
      title: 'Does your schedule change sometimes?',
      inputType: 'select',
      workScheduleField: 'variability',
      selectOptions: SCHEDULE_VARIABILITY_OPTIONS,
    },
  ]

  if (profile.workSchedule.variability === 'sometimes_late') {
    steps.push({
      id: 'workLatestEndTime',
      title: 'What is your latest usual end time?',
      subtitle: 'When you work late, how late does it usually go?',
      inputType: 'time',
      workScheduleField: 'latestEndTime',
    })
  }

  return steps
}

function petSteps(count: number): OnboardingStep[] {
  const steps: OnboardingStep[] = [
    {
      id: 'petCount',
      title: 'How many pets do you have?',
      inputType: 'number',
      placeholder: '1',
      field: 'petCount',
    },
  ]

  for (let i = 0; i < count; i++) {
    steps.push(
      {
        id: `petName-${i}`,
        title: count > 1 ? `What's pet #${i + 1}'s name?` : "What's your pet's name?",
        inputType: 'text',
        placeholder: 'Name',
        petIndex: i,
      },
      {
        id: `petType-${i}`,
        title: count > 1 ? `What type of pet is #${i + 1}?` : 'What type of pet?',
        subtitle: 'Dog, cat, bird…',
        inputType: 'text',
        placeholder: 'Type',
        petIndex: i,
      },
      {
        id: `petBirthday-${i}`,
        title: count > 1 ? `Pet #${i + 1}'s birthday` : "Your pet's birthday",
        subtitle: 'Optional',
        inputType: 'date',
        optional: true,
        petIndex: i,
      },
    )
  }

  return steps
}

export function buildOnboardingSteps(profile: OnboardingProfile): OnboardingStep[] {
  const steps: OnboardingStep[] = []

  for (const step of BASE_STEPS) {
    steps.push(step)
    if (step.id === 'works') {
      steps.push(...workScheduleSteps(profile))
    }
  }

  if (profile.hasPets === true) {
    const count = Math.max(1, profile.petCount || 1)
    steps.push(...petSteps(count))
  }

  return steps
}

export function getStepValue(
  step: OnboardingStep,
  profile: OnboardingProfile,
): string | boolean | null {
  if (step.id === 'petCount') {
    return profile.petCount > 0 ? String(profile.petCount) : ''
  }

  if (step.id === 'workDays') {
    return profile.workSchedule.days.join(',')
  }

  if (step.workScheduleField) {
    const value = profile.workSchedule[step.workScheduleField]
    return typeof value === 'boolean' ? value : String(value ?? '')
  }

  if (step.petIndex !== undefined) {
    const pet = profile.pets[step.petIndex]
    if (!pet) return ''

    if (step.id.startsWith('petName-')) return pet.name
    if (step.id.startsWith('petType-')) return pet.type
    if (step.id.startsWith('petBirthday-')) return pet.birthday ?? ''
  }

  if (step.field) {
    const value = profile[step.field]
    if (typeof value === 'boolean' || value === null) return value
    if (typeof value === 'number') return String(value)
    if (typeof value === 'string') return value
    return ''
  }

  return ''
}

export function isStepValid(step: OnboardingStep, profile: OnboardingProfile): boolean {
  if (step.optional) return true

  if (step.id === 'workDays') {
    return profile.workSchedule.days.length > 0
  }

  if (step.inputType === 'weight' && step.field) {
    const value = profile[step.field] as string
    return isValidWeightString(value)
  }

  if (step.inputType === 'yesNo') {
    const value = getStepValue(step, profile)
    return value === true || value === false
  }

  if (step.inputType === 'number') {
    return profile.petCount >= 1 && profile.petCount <= 20
  }

  if (step.inputType === 'select' && step.workScheduleField) {
    return profile.workSchedule[step.workScheduleField] !== ''
  }

  if (step.workScheduleField) {
    const value = profile.workSchedule[step.workScheduleField]
    return typeof value === 'string' && value.trim().length > 0
  }

  const value = getStepValue(step, profile)
  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  return false
}

export function getSectionForStep(stepId: OnboardingStepId): OnboardingSection {
  if (stepId === 'firstName') return 'Getting to know you'
  if (
    stepId === 'birthday' ||
    stepId === 'height' ||
    stepId === 'currentWeight' ||
    stepId === 'goalWeight'
  ) {
    return 'Building your health profile'
  }
  if (stepId === 'mainGoal') return 'Modules'
  if (
    stepId === 'wakeUpTime' ||
    stepId === 'bedtime' ||
    stepId === 'works' ||
    stepId === 'workDays' ||
    stepId === 'workStartTime' ||
    stepId === 'workEndTime' ||
    stepId === 'scheduleVariability' ||
    stepId === 'workLatestEndTime' ||
    stepId === 'gymAccess'
  ) {
    return 'Lifestyle'
  }
  if (stepId === 'foodsLove' || stepId === 'foodsDislike' || stepId === 'allergies') {
    return 'Nutrition'
  }
  if (
    stepId === 'hasPets' ||
    stepId === 'petCount' ||
    stepId.startsWith('petName-') ||
    stepId.startsWith('petType-') ||
    stepId.startsWith('petBirthday-')
  ) {
    return 'Pets'
  }
  return 'Getting to know you'
}

export function getSectionForStepObject(step: OnboardingStep): OnboardingSection {
  return getSectionForStep(step.id)
}
