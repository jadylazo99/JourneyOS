import type { WorkoutExercise, WorkoutPlan } from './types'

function ex(
  id: string,
  name: string,
  partial: Partial<WorkoutExercise> & { kind: WorkoutExercise['kind'] },
): WorkoutExercise {
  return { id, name, ...partial }
}

export const DEFAULT_WEEKLY_PLAN: WorkoutPlan[] = [
  {
    id: 'def-mon',
    weekday: 'Monday',
    title: 'Lower Body Strength',
    estimatedMinutes: 45,
    exercises: [
      ex('d-mon-wu', '5 min warm-up walk', { kind: 'cardio', duration: '5 min' }),
      ex('d-mon-sq', 'Squats', { kind: 'strength', sets: 4, reps: '10', restSeconds: 90 }),
      ex('d-mon-rdl', 'Romanian Deadlift', { kind: 'strength', sets: 3, reps: '10', restSeconds: 90 }),
      ex('d-mon-lu', 'Lunges', { kind: 'strength', sets: 3, reps: '12 each leg', restSeconds: 60 }),
      ex('d-mon-le', 'Leg Extension / Bodyweight', { kind: 'strength', sets: 3, reps: '15', restSeconds: 60 }),
    ],
  },
  {
    id: 'def-tue',
    weekday: 'Tuesday',
    title: 'Upper Body Push',
    estimatedMinutes: 45,
    exercises: [
      ex('d-tue-wu', '5 min warm-up', { kind: 'cardio', duration: '5 min' }),
      ex('d-tue-bp', 'Chest Press', { kind: 'strength', sets: 4, reps: '10', restSeconds: 90 }),
      ex('d-tue-sp', 'Shoulder Press', { kind: 'strength', sets: 3, reps: '10', restSeconds: 90 }),
      ex('d-tue-dip', 'Tricep Dips / Pushdowns', { kind: 'strength', sets: 3, reps: '12', restSeconds: 60 }),
      ex('d-tue-lr', 'Lateral Raises', { kind: 'strength', sets: 3, reps: '15', restSeconds: 45 }),
    ],
  },
  {
    id: 'def-wed',
    weekday: 'Wednesday',
    title: 'Cardio + Full Body',
    estimatedMinutes: 40,
    exercises: [
      ex('d-wed-wu', '5 min warm-up', { kind: 'cardio', duration: '5 min' }),
      ex('d-wed-gs', 'Goblet Squats', { kind: 'strength', sets: 3, reps: '12', restSeconds: 60 }),
      ex('d-wed-row', 'Rows', { kind: 'strength', sets: 3, reps: '10', restSeconds: 60 }),
      ex('d-wed-pu', 'Push-ups', { kind: 'strength', sets: 3, reps: '10', restSeconds: 45 }),
      ex('d-wed-pl', 'Plank', { kind: 'strength', sets: 3, reps: '45 sec', restSeconds: 45 }),
      ex('d-wed-cd', '15 min cardio', { kind: 'cardio', duration: '15 min' }),
    ],
  },
  {
    id: 'def-thu',
    weekday: 'Thursday',
    title: 'Glutes + Hamstrings',
    estimatedMinutes: 45,
    exercises: [
      ex('d-thu-ht', 'Hip Thrust / Glute Bridge', { kind: 'strength', sets: 4, reps: '12', restSeconds: 90 }),
      ex('d-thu-bss', 'Split Squats', { kind: 'strength', sets: 3, reps: '10', restSeconds: 60 }),
      ex('d-thu-rdl', 'Romanian Deadlift', { kind: 'strength', sets: 3, reps: '10', restSeconds: 90 }),
      ex('d-thu-kb', 'Kickbacks / Abduction', { kind: 'strength', sets: 3, reps: '15', restSeconds: 45 }),
    ],
  },
  {
    id: 'def-fri',
    weekday: 'Friday',
    title: 'Upper Body Pull + Conditioning',
    estimatedMinutes: 45,
    exercises: [
      ex('d-fri-pd', 'Lat Pulldown / Pull-ups', { kind: 'strength', sets: 4, reps: '10', restSeconds: 60 }),
      ex('d-fri-row', 'Rows', { kind: 'strength', sets: 4, reps: '10', restSeconds: 60 }),
      ex('d-fri-fp', 'Face Pulls', { kind: 'strength', sets: 3, reps: '15', restSeconds: 45 }),
      ex('d-fri-curl', 'Bicep Curls', { kind: 'strength', sets: 3, reps: '12', restSeconds: 45 }),
      ex('d-fri-cond', '10 min conditioning', { kind: 'cardio', duration: '10 min' }),
    ],
  },
  {
    id: 'def-sat',
    weekday: 'Saturday',
    title: 'Short Workout OR Active Recovery',
    estimatedMinutes: 30,
    exercises: [
      ex('d-sat-walk', '30–45 min walk', { kind: 'activity', duration: '30–45 min' }),
      ex('d-sat-mob', 'Light mobility', { kind: 'mobility', duration: '10 min' }),
    ],
  },
  {
    id: 'def-sun',
    weekday: 'Sunday',
    title: 'Rest + Reset',
    isRestDay: true,
    estimatedMinutes: 20,
    exercises: [
      ex('d-sun-walk', 'Easy walk', { kind: 'activity', duration: '20 min' }),
      ex('d-sun-st', 'Stretch', { kind: 'mobility', duration: '10 min' }),
    ],
  },
]

export function getPlanForWeekday(weekday: string, _useJady = false): WorkoutPlan | null {
  const plans = DEFAULT_WEEKLY_PLAN
  return plans.find((p) => p.weekday === weekday) ?? null
}
