import { JADY_EQUIPMENT } from './constants'
import type { WorkoutExercise, WorkoutPlan } from './types'

function ex(
  id: string,
  name: string,
  partial: Partial<WorkoutExercise> & { kind: WorkoutExercise['kind'] },
): WorkoutExercise {
  return { id, name, ...partial }
}

export const JADY_WEEKLY_PLAN: WorkoutPlan[] = [
  {
    id: 'jady-mon',
    weekday: 'Monday',
    title: 'Lower Body Strength',
    estimatedMinutes: 55,
    exercises: [
      ex('mon-wu', '5 min treadmill warm-up', { kind: 'cardio', duration: '5 min' }),
      ex('mon-lp', 'Leg Press', { kind: 'strength', sets: 4, reps: '12', restSeconds: 90 }),
      ex('mon-rdl', 'Romanian Deadlift', { kind: 'strength', sets: 4, reps: '10', restSeconds: 90 }),
      ex('mon-wl', 'Walking Lunges', { kind: 'strength', sets: 3, reps: '12 each leg', restSeconds: 60 }),
      ex('mon-le', 'Leg Extension', { kind: 'strength', sets: 3, reps: '15', restSeconds: 60 }),
      ex('mon-lc', 'Leg Curl', { kind: 'strength', sets: 3, reps: '15', restSeconds: 60 }),
      ex('mon-cd', '10 min incline walk', { kind: 'cardio', duration: '10 min' }),
    ],
  },
  {
    id: 'jady-tue',
    weekday: 'Tuesday',
    title: 'Upper Body Push',
    estimatedMinutes: 50,
    exercises: [
      ex('tue-wu', '5 min treadmill', { kind: 'cardio', duration: '5 min' }),
      ex('tue-dcp', 'Dumbbell Chest Press', { kind: 'strength', sets: 4, reps: '10', restSeconds: 90 }),
      ex('tue-sp', 'Shoulder Press', { kind: 'strength', sets: 4, reps: '10', restSeconds: 90 }),
      ex('tue-pf', 'Pec Fly', { kind: 'strength', sets: 3, reps: '15', restSeconds: 60 }),
      ex('tue-tp', 'Tricep Pushdown', { kind: 'strength', sets: 4, reps: '12', restSeconds: 60 }),
      ex('tue-lr', 'Lateral Raises', { kind: 'strength', sets: 3, reps: '15', restSeconds: 45 }),
      ex('tue-cd', '10 min bike', { kind: 'cardio', duration: '10 min' }),
    ],
  },
  {
    id: 'jady-wed',
    weekday: 'Wednesday',
    title: 'Cardio + Full Body',
    estimatedMinutes: 55,
    exercises: [
      ex('wed-wu', '5 min warm-up', { kind: 'cardio', duration: '5 min' }),
      ex('wed-gs', 'Goblet Squats', { kind: 'strength', sets: 4, reps: '12', restSeconds: 60 }),
      ex('wed-lpd', 'Lat Pulldown', { kind: 'strength', sets: 4, reps: '10', restSeconds: 60 }),
      ex('wed-sr', 'Seated Row', { kind: 'strength', sets: 4, reps: '10', restSeconds: 60 }),
      ex('wed-ip', 'Incline Push-ups', { kind: 'strength', sets: 3, reps: '10', restSeconds: 45 }),
      ex('wed-pl', 'Plank', { kind: 'strength', sets: 3, reps: '45 sec', restSeconds: 45 }),
      ex('wed-sc', '15 min Stair Climber', { kind: 'cardio', duration: '15 min' }),
    ],
  },
  {
    id: 'jady-thu',
    weekday: 'Thursday',
    title: 'Glutes + Hamstrings',
    estimatedMinutes: 50,
    exercises: [
      ex('thu-ht', 'Hip Thrust', { kind: 'strength', sets: 4, reps: '12', restSeconds: 90 }),
      ex('thu-bss', 'Bulgarian Split Squat', { kind: 'strength', sets: 3, reps: '10', restSeconds: 60 }),
      ex('thu-rdl', 'Romanian Deadlift', { kind: 'strength', sets: 4, reps: '10', restSeconds: 90 }),
      ex('thu-ck', 'Cable Kickbacks', { kind: 'strength', sets: 3, reps: '15', restSeconds: 45 }),
      ex('thu-ha', 'Hip Abduction', { kind: 'strength', sets: 3, reps: '20', restSeconds: 45 }),
      ex('thu-cd', '10 min incline walk', { kind: 'cardio', duration: '10 min' }),
    ],
  },
  {
    id: 'jady-fri',
    weekday: 'Friday',
    title: 'Upper Body Pull + Conditioning',
    estimatedMinutes: 50,
    exercises: [
      ex('fri-lpd', 'Lat Pulldown', { kind: 'strength', sets: 4, reps: '12', restSeconds: 60 }),
      ex('fri-sr', 'Seated Row', { kind: 'strength', sets: 4, reps: '12', restSeconds: 60 }),
      ex('fri-sar', 'Single Arm Row', { kind: 'strength', sets: 3, reps: '12', restSeconds: 60 }),
      ex('fri-fp', 'Face Pull', { kind: 'strength', sets: 3, reps: '15', restSeconds: 45 }),
      ex('fri-hc', 'Hammer Curl', { kind: 'strength', sets: 3, reps: '12', restSeconds: 45 }),
      ex('fri-hb', 'Heavy Bag — 10 rounds (30s on / 30s off)', { kind: 'cardio', duration: '10 min' }),
    ],
  },
  {
    id: 'jady-sat',
    weekday: 'Saturday',
    title: 'Short Workout OR Active Recovery',
    subtitle: 'Choose what feels right',
    estimatedMinutes: 45,
    exercises: [
      ex('sat-walk', '45–60 min walk', { kind: 'activity', duration: '45–60 min', notes: 'With Bruno if you like' }),
      ex('sat-tm', '30 min treadmill', { kind: 'cardio', duration: '30 min' }),
      ex('sat-hb', '20 min heavy bag', { kind: 'cardio', duration: '20 min' }),
    ],
  },
  {
    id: 'jady-sun',
    weekday: 'Sunday',
    title: 'Rest + Reset',
    isRestDay: true,
    estimatedMinutes: 30,
    exercises: [
      ex('sun-walk', '30 min walk', { kind: 'activity', duration: '30 min' }),
      ex('sun-st', 'Stretch', { kind: 'mobility', duration: '10 min' }),
      ex('sun-mp', 'Meal prep', { kind: 'rest', duration: '—', notes: 'Set up the week' }),
      ex('sun-rst', 'Reset', { kind: 'rest', duration: '—', notes: 'Ease into the new week' }),
    ],
  },
]

export function getJadyDefaults() {
  return {
    gymType: 'apartment' as const,
    gymAccess: true,
    equipment: [...JADY_EQUIPMENT],
    workoutDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workoutTime: '07:00',
    workoutLengthMinutes: 55,
  }
}

export function isJadyProfile(firstName: string): boolean {
  return firstName.trim().toLowerCase() === 'jady'
}
