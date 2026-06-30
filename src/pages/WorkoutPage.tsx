import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ClockIcon, FireIcon } from '@heroicons/react/24/outline'
import { useFitnessStore } from '@/modules/fitness'
import { useDailyStore } from '@/modules/daily'
import { useProfileStore } from '@/modules/profile'
import { ExerciseCard, WorkoutSkipSheet } from '@/components/fitness'
import type { WorkoutSkipReason } from '@/modules/fitness'

export function WorkoutPage() {
  const hydrateFitness = useFitnessStore((s) => s.hydrate)
  const hydrateProfile = useProfileStore((s) => s.hydrate)
  const fitnessHydrated = useFitnessStore((s) => s.hydrated)
  const profileHydrated = useProfileStore((s) => s.hydrated)
  const isModuleEnabled = useProfileStore((s) => s.isModuleEnabled)
  const todayRecord = useDailyStore((s) => s.todayRecord)

  const getTodayWorkout = useFitnessStore((s) => s.getTodayWorkout)
  const activeSession = useFitnessStore((s) => s.activeSession)
  const todaySkip = useFitnessStore((s) => s.todaySkip)
  const isTodayCompleted = useFitnessStore((s) => s.isTodayCompleted)
  const startSession = useFitnessStore((s) => s.startSession)
  const updateExercise = useFitnessStore((s) => s.updateExercise)
  const toggleExercise = useFitnessStore((s) => s.toggleExercise)
  const completeWorkout = useFitnessStore((s) => s.completeWorkout)
  const skipWorkout = useFitnessStore((s) => s.skipWorkout)
  const applyShortVersion = useFitnessStore((s) => s.applyShortVersion)

  const [skipOpen, setSkipOpen] = useState(false)

  useEffect(() => {
    hydrateFitness()
    hydrateProfile()
  }, [hydrateFitness, hydrateProfile])

  const dayMode = todayRecord?.dayMode.mode ?? 'normal'
  const workout = getTodayWorkout(dayMode)

  if (!fitnessHydrated || !profileHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue animate-spin" />
      </div>
    )
  }

  if (!isModuleEnabled('fitness')) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-blue p-8 text-white text-center shadow-card-lg">
          <p className="text-lg font-semibold">Fitness module is off</p>
          <p className="text-sm text-white/60 mt-2">
            Enable Fitness in Profile to access workouts.
          </p>
          <Link to="/profile" className="inline-block mt-4 text-sm font-semibold text-accent">
            Go to Profile →
          </Link>
        </div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="text-center py-16 text-slate-500">
        No workout plan available for today.
      </div>
    )
  }

  const inSession = activeSession != null
  const completed = isTodayCompleted()

  const handleSkip = (reason: WorkoutSkipReason) => {
    if (reason === 'short_version') {
      applyShortVersion()
    } else {
      skipWorkout(reason)
    }
  }

  const exercises = workout.exercises
  const exerciseStates = activeSession?.exerciseStates ?? {}
  const completedCount = Object.values(exerciseStates).filter((e) => e.completed).length

  return (
    <div className="min-h-[80vh] -mx-5 -mt-6 md:-mx-8 md:-mt-10">
      <div
        className="px-5 pt-8 pb-32 md:px-8 md:pt-12"
        style={{
          background: 'linear-gradient(165deg, #0F172A 0%, #1e3a8a 55%, #0F172A 100%)',
          minHeight: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto space-y-6"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
              {completed ? 'Completed' : inSession ? 'In progress' : "Today's session"}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              {workout.title}
            </h1>
            {workout.subtitle && (
              <p className="text-sm text-white/50 mt-1">{workout.subtitle}</p>
            )}
          </div>

          {workout.message && !completed && (
            <p className="text-sm text-white/60 leading-relaxed">{workout.message}</p>
          )}

          {workout.walkingGoal && (
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3">
              <p className="text-sm text-accent">{workout.walkingGoal}</p>
            </div>
          )}

          {!completed && workout.showWorkout && (
            <div className="flex gap-4 text-sm text-white/45">
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" />
                {workout.estimatedMinutes} min
              </span>
              <span className="flex items-center gap-1.5">
                <FireIcon className="h-4 w-4" />
                {exercises.length} exercises
              </span>
              {inSession && (
                <span className="text-accent tabular-nums">
                  {completedCount}/{exercises.length} done
                </span>
              )}
            </div>
          )}

          {todaySkip && (
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-4 text-center">
              <p className="text-sm text-white/70">{todaySkip.message}</p>
            </div>
          )}

          {completed && (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-6 text-center">
              <p className="text-2xl mb-2">💪</p>
              <p className="text-lg font-semibold text-white">Workout complete</p>
              <p className="text-sm text-white/50 mt-1">You showed up. That counts.</p>
            </div>
          )}

          {!completed && workout.showWorkout && !todaySkip && (
            <>
              {!inSession ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startSession(workout)}
                  className="w-full rounded-2xl bg-white py-4 text-base font-semibold text-primary shadow-lg"
                >
                  Start Workout
                </motion.button>
              ) : (
                <div className="space-y-3">
                  {exercises.map((exercise, i) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      state={exerciseStates[exercise.id] ?? { completed: false, weightUsed: '', notes: '' }}
                      index={i}
                      onToggle={() => toggleExercise(exercise.id)}
                      onUpdate={(partial) => updateExercise(exercise.id, partial)}
                    />
                  ))}

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={completeWorkout}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue to-accent py-4 text-base font-semibold text-white shadow-lg mt-4"
                  >
                    Complete Workout
                  </motion.button>
                </div>
              )}

              {!inSession && (
                <button
                  type="button"
                  onClick={() => setSkipOpen(true)}
                  className="w-full text-sm text-white/40 hover:text-white/60 py-2 transition-colors"
                >
                  Can't workout today?
                </button>
              )}
            </>
          )}

          {!workout.showWorkout && !todaySkip && !completed && (
            <div className="space-y-3">
              {exercises.map((exercise, i) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  state={{ completed: false, weightUsed: '', notes: '' }}
                  index={i}
                  onToggle={() => {}}
                  onUpdate={() => {}}
                  readOnly
                />
              ))}
              <button
                type="button"
                onClick={() => setSkipOpen(true)}
                className="w-full rounded-2xl border border-white/15 py-3 text-sm text-white/60"
              >
                Adjust today's plan
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <WorkoutSkipSheet
        open={skipOpen}
        onClose={() => setSkipOpen(false)}
        onSelect={handleSkip}
      />
    </div>
  )
}
