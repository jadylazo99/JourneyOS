import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { getLocalDateKey } from '@/modules/daily/date'
import { useProfileStore } from '@/modules/profile'
import { useStudyStore } from '@/modules/study'
import { FOCUS_AREA_OPTIONS } from '@/modules/modules/focusAreas'
import { useIntelligenceStore } from '@/modules/intelligence'
import type { NotificationKind } from '@/modules/intelligence'
import { SCHEDULE_VARIABILITY_OPTIONS } from '@/modules/onboarding/types'
import type { GymType } from '@/modules/onboarding/types'
import { CollapsibleSection } from './CollapsibleSection'
import {
  FieldLabel,
  FieldInput,
  FieldTextarea,
  FieldTime,
  FieldSelect,
  YesNoToggle,
  DayChips,
  TagListEditor,
  ModuleToggle,
} from './ProfileInputs'
import { WeightInput } from '@/components/ui'

export function ProfileHero() {
  const firstName = useProfileStore((s) => s.profile.firstName)
  const mainGoal = useProfileStore((s) => s.profile.mainGoal)
  const initial = firstName?.charAt(0)?.toUpperCase() || 'J'

  return (
    <div className="rounded-3xl bg-gradient-to-br from-primary via-primary to-blue p-6 text-white shadow-card-lg">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-2xl font-semibold shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight truncate">
            {firstName || 'Your Journey'}
          </h2>
          {mainGoal ? (
            <p className="text-sm text-white/60 mt-1 line-clamp-2">{mainGoal}</p>
          ) : (
            <p className="text-sm text-white/40 mt-1">Set your main goal below</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function ProfileIdentitySection() {
  const profile = useProfileStore((s) => s.profile)
  const updateField = useProfileStore((s) => s.updateField)

  return (
    <CollapsibleSection title="About You" description="Name and birthday" defaultOpen>
      <div>
        <FieldLabel>First name</FieldLabel>
        <FieldInput
          value={profile.firstName}
          onChange={(v) => updateField('firstName', v)}
          placeholder="First name"
        />
      </div>
      <div>
        <FieldLabel>Birthday</FieldLabel>
        <FieldInput
          type="date"
          value={profile.birthday}
          onChange={(v) => updateField('birthday', v)}
        />
      </div>
    </CollapsibleSection>
  )
}

export function ProfileHealthSection() {
  const profile = useProfileStore((s) => s.profile)
  const updateField = useProfileStore((s) => s.updateField)
  const updatePreferredUnits = useProfileStore((s) => s.updatePreferredUnits)
  const weightEnabled = useProfileStore((s) => s.isModuleEnabled('weight_loss'))

  return (
    <CollapsibleSection
      title="Health & Weight"
      description="Height, weight, and preferred units"
      badge={weightEnabled ? undefined : 'Module off'}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Height</FieldLabel>
          <FieldInput
            value={profile.height}
            onChange={(v) => updateField('height', v)}
            placeholder={"5'8\""}
          />
        </div>
        <div>
          <FieldLabel>Height unit</FieldLabel>
          <FieldSelect
            value={profile.preferredUnits.height}
            onChange={(v) =>
              updatePreferredUnits({ height: v as 'ft_in' | 'cm' })
            }
            options={[
              { value: 'ft_in', label: 'Feet & inches' },
              { value: 'cm', label: 'Centimeters' },
            ]}
          />
        </div>
      </div>

      {weightEnabled && (
        <>
          <div>
            <FieldLabel>Current weight</FieldLabel>
            <WeightInput
              value={profile.currentWeight}
              onChange={(v) => updateField('currentWeight', v)}
              placeholder="132.4"
              variant="light"
              size="md"
              unit={profile.preferredUnits.weight}
            />
          </div>
          <div>
            <FieldLabel>Goal weight</FieldLabel>
            <WeightInput
              value={profile.goalWeight}
              onChange={(v) => updateField('goalWeight', v)}
              placeholder="140"
              variant="light"
              size="md"
              unit={profile.preferredUnits.weight}
            />
          </div>
        </>
      )}

      <div>
        <FieldLabel>Weight unit</FieldLabel>
        <FieldSelect
          value={profile.preferredUnits.weight}
          onChange={(v) => updatePreferredUnits({ weight: v as 'lb' | 'kg' })}
          options={[
            { value: 'lb', label: 'Pounds (lb)' },
            { value: 'kg', label: 'Kilograms (kg)' },
          ]}
        />
      </div>
    </CollapsibleSection>
  )
}

export function ProfileGoalsSection() {
  const mainGoal = useProfileStore((s) => s.profile.mainGoal)
  const focusAreas = useProfileStore((s) => s.profile.focusAreas)
  const updateField = useProfileStore((s) => s.updateField)

  if (!focusAreas.includes('custom')) return null

  return (
    <CollapsibleSection title="Custom Focus" description="Describe your personal focus area">
      <FieldTextarea
        value={mainGoal}
        onChange={(v) => updateField('mainGoal', v)}
        placeholder="Describe what you are working toward…"
        rows={3}
      />
    </CollapsibleSection>
  )
}

export function ProfileModulesSection() {
  const focusAreas = useProfileStore((s) => s.profile.focusAreas)
  const toggleFocusArea = useProfileStore((s) => s.toggleFocusArea)

  return (
    <CollapsibleSection
      title="Focus Areas"
      description="Choose what JourneyOS tracks and recommends for you"
      defaultOpen
    >
      <div className="space-y-2">
        {FOCUS_AREA_OPTIONS.map((option) => (
          <ModuleToggle
            key={option.id}
            label={option.label}
            description={option.description}
            enabled={focusAreas.includes(option.id)}
            onToggle={() => toggleFocusArea(option.id)}
          />
        ))}
      </div>
    </CollapsibleSection>
  )
}

export function ProfileStudySettingsSection() {
  const studyEnabled = useProfileStore((s) => s.isModuleEnabled('study'))
  const studyingFor = useStudyStore((s) => s.studyingFor)
  const examDate = useStudyStore((s) => s.examDate)
  const dailyGoalMinutes = useStudyStore((s) => s.dailyGoalMinutes)
  const updateSettings = useStudyStore((s) => s.updateSettings)
  const hydrate = useStudyStore((s) => s.hydrate)

  useEffect(() => {
    if (studyEnabled) hydrate()
  }, [studyEnabled, hydrate])

  if (!studyEnabled) {
    return (
      <CollapsibleSection title="Study" description="Enable Study in Focus Areas">
        <p className="text-sm text-slate-500">
          Turn on the Study focus area to track sessions, goals, and exam dates.
        </p>
      </CollapsibleSection>
    )
  }

  return (
    <CollapsibleSection title="Study" description="What you are learning and your daily goal">
      <div>
        <FieldLabel>What are you studying for?</FieldLabel>
        <FieldInput
          value={studyingFor}
          onChange={(v) => updateSettings({ studyingFor: v })}
          placeholder="e.g. Nursing license, Spanish, Calculus"
        />
      </div>
      <div>
        <FieldLabel>Exam or test date (optional)</FieldLabel>
        <FieldInput
          type="date"
          value={examDate}
          onChange={(v) => updateSettings({ examDate: v })}
        />
      </div>
      <div>
        <FieldLabel>Daily study goal (minutes)</FieldLabel>
        <FieldInput
          type="number"
          value={String(dailyGoalMinutes)}
          onChange={(v) => updateSettings({ dailyGoalMinutes: Math.max(0, Number(v) || 0) })}
          placeholder="30"
        />
      </div>
    </CollapsibleSection>
  )
}

export function ProfileScheduleSection() {
  const profile = useProfileStore((s) => s.profile)
  const updateField = useProfileStore((s) => s.updateField)

  return (
    <CollapsibleSection title="Sleep Schedule" description="Wake-up and bedtime">
      <div>
        <FieldLabel>Wake-up time</FieldLabel>
        <FieldTime
          value={profile.wakeUpTime}
          onChange={(v) => updateField('wakeUpTime', v)}
        />
      </div>
      <div>
        <FieldLabel>Bedtime</FieldLabel>
        <FieldTime
          value={profile.bedtime}
          onChange={(v) => updateField('bedtime', v)}
        />
      </div>
    </CollapsibleSection>
  )
}

export function ProfileWorkScheduleSection() {
  const profile = useProfileStore((s) => s.profile)
  const updateWorkSchedule = useProfileStore((s) => s.updateWorkSchedule)
  const setWorkDays = useProfileStore((s) => s.setWorkDays)
  const workEnabled = useProfileStore((s) => s.isModuleEnabled('work'))

  if (!workEnabled) {
    return (
      <CollapsibleSection title="Work Schedule" description="Enable the Work module to configure">
        <p className="text-sm text-slate-500">
          Turn on the Work module above to set your work days and hours.
        </p>
      </CollapsibleSection>
    )
  }

  const schedule = profile.workSchedule

  return (
    <CollapsibleSection title="Work Schedule" description="Days, hours, and variability">
      <div>
        <FieldLabel>Do you work?</FieldLabel>
        <YesNoToggle
          value={schedule.works}
          onChange={(v) => updateWorkSchedule({ works: v })}
        />
      </div>

      {schedule.works && (
        <>
          <div>
            <FieldLabel>Work days</FieldLabel>
            <DayChips selected={schedule.days} onChange={setWorkDays} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Start time</FieldLabel>
              <FieldTime
                value={schedule.startTime}
                onChange={(v) => updateWorkSchedule({ startTime: v })}
              />
            </div>
            <div>
              <FieldLabel>End time</FieldLabel>
              <FieldTime
                value={schedule.endTime}
                onChange={(v) => updateWorkSchedule({ endTime: v })}
              />
            </div>
          </div>
          <div>
            <FieldLabel>Schedule variability</FieldLabel>
            <FieldSelect
              value={schedule.variability}
              onChange={(v) =>
                updateWorkSchedule({
                  variability: v as typeof schedule.variability,
                })
              }
              options={[
                { value: '', label: 'Select…' },
                ...SCHEDULE_VARIABILITY_OPTIONS,
              ]}
            />
          </div>
          {schedule.variability === 'sometimes_late' && (
            <div>
              <FieldLabel>Latest end time</FieldLabel>
              <FieldTime
                value={schedule.latestEndTime}
                onChange={(v) => updateWorkSchedule({ latestEndTime: v })}
              />
            </div>
          )}
        </>
      )}
    </CollapsibleSection>
  )
}

export function ProfileFitnessSection() {
  const fitness = useProfileStore((s) => s.profile.fitness)
  const updateFitness = useProfileStore((s) => s.updateFitness)
  const fitnessEnabled = useProfileStore((s) => s.isModuleEnabled('fitness'))

  if (!fitnessEnabled) {
    return (
      <CollapsibleSection title="Fitness" description="Enable Fitness module to configure">
        <p className="text-sm text-slate-500">
          Turn on the Fitness module to set up workouts and gym access.
        </p>
      </CollapsibleSection>
    )
  }

  return (
    <CollapsibleSection title="Fitness" description="Gym access, schedule, and limitations">
      <div>
        <FieldLabel>Gym access type</FieldLabel>
        <FieldSelect
          value={fitness.gymType}
          onChange={(v) => updateFitness({ gymType: v as GymType })}
          options={[
            { value: 'none', label: 'No gym' },
            { value: 'home', label: 'Home gym' },
            { value: 'apartment', label: 'Apartment gym' },
            { value: 'commercial', label: 'Commercial gym' },
          ]}
        />
      </div>
      <div>
        <FieldLabel>Workout days</FieldLabel>
        <DayChips
          selected={fitness.workoutDays}
          onChange={(days) => updateFitness({ workoutDays: days })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Workout time</FieldLabel>
          <FieldTime
            value={fitness.workoutTime}
            onChange={(v) => updateFitness({ workoutTime: v })}
          />
        </div>
        <div>
          <FieldLabel>Session length (min)</FieldLabel>
          <FieldInput
            type="number"
            value={String(fitness.workoutLengthMinutes)}
            onChange={(v) => updateFitness({ workoutLengthMinutes: Number(v) || 45 })}
          />
        </div>
      </div>
      <TagListEditor
        label="Injuries or limitations"
        items={fitness.injuriesOrLimitations}
        onChange={(items) => updateFitness({ injuriesOrLimitations: items })}
        placeholder="e.g. knee, lower back…"
      />
      <TagListEditor
        label="Available equipment"
        items={fitness.equipment}
        onChange={(items) => updateFitness({ equipment: items })}
        placeholder="Add equipment…"
      />
    </CollapsibleSection>
  )
}

export function ProfileFoodSection() {
  const food = useProfileStore((s) => s.profile.foodPreferences)
  const updateFood = useProfileStore((s) => s.updateFoodPreferences)
  const nutritionEnabled = useProfileStore((s) => s.isModuleEnabled('nutrition'))

  if (!nutritionEnabled) {
    return (
      <CollapsibleSection title="Food Preferences" description="Enable Nutrition module to edit">
        <p className="text-sm text-slate-500">
          Turn on the Nutrition module to manage food preferences.
        </p>
      </CollapsibleSection>
    )
  }

  return (
    <CollapsibleSection title="Food Preferences" description="Likes, dislikes, and habits">
      <TagListEditor
        label="Foods you love"
        items={food.foodsLove}
        onChange={(items) => updateFood({ foodsLove: items })}
        placeholder="Add a food…"
      />
      <TagListEditor
        label="Foods you dislike"
        items={food.foodsDislike}
        onChange={(items) => updateFood({ foodsDislike: items })}
        placeholder="Add a food…"
      />
      <TagListEditor
        label="Allergies"
        items={food.allergies}
        onChange={(items) => updateFood({ allergies: items })}
        placeholder="Add an allergy…"
      />
      <TagListEditor
        label="Favorite restaurants"
        items={food.favoriteRestaurants}
        onChange={(items) => updateFood({ favoriteRestaurants: items })}
        placeholder="Add a restaurant…"
      />
      <TagListEditor
        label="Meal prep habits"
        items={food.mealPrepHabits}
        onChange={(items) => updateFood({ mealPrepHabits: items })}
        placeholder="Add a habit…"
      />
    </CollapsibleSection>
  )
}

export function ProfileNutritionGoalsSection() {
  const goals = useProfileStore((s) => s.profile.nutritionGoals)
  const updateGoals = useProfileStore((s) => s.updateNutritionGoals)
  const nutritionEnabled = useProfileStore((s) => s.isModuleEnabled('nutrition'))

  if (!nutritionEnabled) {
    return (
      <CollapsibleSection title="Nutrition Goals" description="Enable Nutrition module to edit">
        <p className="text-sm text-slate-500">
          Turn on the Nutrition module to set calorie, protein, and water goals.
        </p>
      </CollapsibleSection>
    )
  }

  return (
    <CollapsibleSection title="Nutrition Goals" description="Daily targets — no obsession required">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <FieldLabel>Calories</FieldLabel>
          <FieldInput
            type="number"
            value={String(goals.calories)}
            onChange={(v) => updateGoals({ calories: Number(v) || 0 })}
            placeholder="2000"
          />
        </div>
        <div>
          <FieldLabel>Protein (g)</FieldLabel>
          <FieldInput
            type="number"
            value={String(goals.protein)}
            onChange={(v) => updateGoals({ protein: Number(v) || 0 })}
            placeholder="150"
          />
        </div>
        <div>
          <FieldLabel>Water (oz)</FieldLabel>
          <FieldInput
            type="number"
            value={String(goals.waterOz)}
            onChange={(v) => updateGoals({ waterOz: Number(v) || 0 })}
            placeholder="80"
          />
        </div>
      </div>
    </CollapsibleSection>
  )
}

export function ProfilePetsSection() {
  const pets = useProfileStore((s) => s.profile.pets)
  const addPet = useProfileStore((s) => s.addPet)
  const updatePet = useProfileStore((s) => s.updatePet)
  const removePet = useProfileStore((s) => s.removePet)
  const petsEnabled = useProfileStore((s) => s.isModuleEnabled('pets'))

  if (!petsEnabled) {
    return (
      <CollapsibleSection title="Pets" description="Enable Pets module to manage">
        <p className="text-sm text-slate-500">
          Turn on the Pets module to add and manage your pets.
        </p>
      </CollapsibleSection>
    )
  }

  return (
    <CollapsibleSection title="Pets" description={`${pets.length} pet${pets.length === 1 ? '' : 's'}`}>
      <Link
        to="/pets"
        className="block rounded-2xl border border-blue/20 bg-blue/5 px-4 py-3 text-sm font-medium text-blue hover:bg-blue/10 transition-colors mb-4"
      >
        Open Pets page →
      </Link>
      {pets.map((pet, index) => (
        <div
          key={pet.id ?? index}
          className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pet {index + 1}
            </p>
            {pets.length > 0 && (
              <button
                type="button"
                onClick={() => removePet(index)}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Name</FieldLabel>
              <FieldInput
                value={pet.name}
                onChange={(v) => updatePet(index, { name: v })}
                placeholder="Max"
              />
            </div>
            <div>
              <FieldLabel>Type</FieldLabel>
              <FieldInput
                value={pet.type}
                onChange={(v) => updatePet(index, { type: v })}
                placeholder="Dog"
              />
            </div>
          </div>
          <div>
            <FieldLabel>Breed (optional)</FieldLabel>
            <FieldInput
              value={pet.breed ?? ''}
              onChange={(v) => updatePet(index, { breed: v })}
              placeholder="Golden Retriever"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Birthday (optional)</FieldLabel>
              <FieldInput
                type="date"
                value={pet.birthday ?? ''}
                onChange={(v) => updatePet(index, { birthday: v })}
              />
            </div>
            <div>
              <FieldLabel>Weight (optional)</FieldLabel>
              <FieldInput
                value={pet.weight ?? ''}
                onChange={(v) => updatePet(index, { weight: v })}
                placeholder="65 lb"
              />
            </div>
          </div>
          <div>
            <FieldLabel>Food (optional)</FieldLabel>
            <FieldInput
              value={pet.food ?? ''}
              onChange={(v) => updatePet(index, { food: v })}
              placeholder="Brand or diet…"
            />
          </div>
          <div>
            <FieldLabel>Notes</FieldLabel>
            <FieldTextarea
              value={pet.notes ?? ''}
              onChange={(v) => updatePet(index, { notes: v })}
              placeholder="Any extra notes…"
              rows={2}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPet}
        className="w-full rounded-2xl border border-dashed border-slate-200 py-3 text-sm font-medium text-blue hover:bg-blue/5 transition-colors"
      >
        + Add pet
      </button>
    </CollapsibleSection>
  )
}

export function ProfileVacationSection() {
  const vacation = useProfileStore((s) => s.profile.vacation)
  const updateVacation = useProfileStore((s) => s.updateVacation)
  const endVacationEarly = useProfileStore((s) => s.endVacationEarly)
  const todayKey = getLocalDateKey()
  const inRange =
    vacation.startDate &&
    todayKey >= vacation.startDate &&
    todayKey <= (vacation.endDate || vacation.startDate)

  return (
    <CollapsibleSection title="Vacation" description="Plan time away and vacation mode">
      <div>
        <FieldLabel>Trip name</FieldLabel>
        <FieldInput
          value={vacation.name}
          onChange={(v) => updateVacation({ name: v })}
          placeholder="Summer getaway, family visit…"
        />
      </div>
      <div>
        <FieldLabel>Destination</FieldLabel>
        <FieldInput
          value={vacation.destination}
          onChange={(v) => updateVacation({ destination: v })}
          placeholder="City, region, or country"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Start date</FieldLabel>
          <FieldInput
            type="date"
            value={vacation.startDate}
            onChange={(v) => updateVacation({ startDate: v })}
          />
        </div>
        <div>
          <FieldLabel>End date</FieldLabel>
          <FieldInput
            type="date"
            value={vacation.endDate}
            onChange={(v) => updateVacation({ endDate: v })}
          />
        </div>
      </div>
      <div>
        <FieldLabel>Timezone (optional)</FieldLabel>
        <FieldInput
          value={vacation.timezone}
          onChange={(v) => updateVacation({ timezone: v })}
          placeholder="America/New_York, Europe/Paris…"
        />
      </div>
      <div>
        <FieldLabel>Traveling with pets?</FieldLabel>
        <YesNoToggle
          value={vacation.travelingWithPets}
          onChange={(v) => updateVacation({ travelingWithPets: v })}
        />
        <p className="text-xs text-slate-500 mt-1.5">
          If pets stay home, Today will remind you to check on their care.
        </p>
      </div>
      <div>
        <FieldLabel>Notes (optional)</FieldLabel>
        <FieldTextarea
          value={vacation.notes}
          onChange={(v) => updateVacation({ notes: v })}
          placeholder="Flight info, hotel, sitter contact…"
          rows={2}
        />
      </div>
      {vacation.active && inRange && (
        <div className="rounded-2xl border border-blue/20 bg-blue/5 p-4 space-y-3">
          <p className="text-sm font-medium text-slate-800">
            Vacation mode is active through{' '}
            {vacation.endDate || vacation.startDate}.
          </p>
          <button
            type="button"
            onClick={endVacationEarly}
            className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-white transition-colors"
          >
            End vacation early
          </button>
        </div>
      )}
    </CollapsibleSection>
  )
}

function ExamDatesEditor({
  exams,
  onChange,
}: {
  exams: { id: string; name: string; date: string }[]
  onChange: (exams: { id: string; name: string; date: string }[]) => void
}) {
  const addExam = () => {
    onChange([
      ...exams,
      { id: `exam-${Date.now()}`, name: '', date: '' },
    ])
  }

  const updateExam = (id: string, field: 'name' | 'date', value: string) => {
    onChange(exams.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const removeExam = (id: string) => {
    onChange(exams.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-2 pt-2">
      <FieldLabel>Exam countdown dates</FieldLabel>
      {exams.length === 0 && (
        <p className="text-xs text-slate-400">Add exams for countdown on Today.</p>
      )}
      {exams.map((exam) => (
        <div key={exam.id} className="flex gap-2 items-end">
          <div className="flex-1">
            <FieldInput
              value={exam.name}
              onChange={(v) => updateExam(exam.id, 'name', v)}
              placeholder="Exam name"
            />
          </div>
          <div className="w-36">
            <FieldInput
              type="date"
              value={exam.date}
              onChange={(v) => updateExam(exam.id, 'date', v)}
            />
          </div>
          <button
            type="button"
            onClick={() => removeExam(exam.id)}
            className="text-xs text-slate-400 hover:text-red-500 pb-2.5"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addExam}
        className="text-xs font-medium text-blue hover:text-blue/80"
      >
        + Add exam
      </button>
    </div>
  )
}

export function ProfileThemeSection() {
  const theme = useProfileStore((s) => s.profile.theme)
  const updateTheme = useProfileStore((s) => s.updateTheme)

  return (
    <CollapsibleSection title="Theme" description="Appearance preferences">
      <FieldSelect
        value={theme.mode}
        onChange={(v) => updateTheme({ mode: v as typeof theme.mode })}
        options={[
          { value: 'system', label: 'System default' },
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
      />
    </CollapsibleSection>
  )
}

const NOTIFICATION_LABELS: Record<NotificationKind, string> = {
  workout: 'Workout',
  meal: 'Meal',
  water: 'Water',
  protein: 'Protein',
  pet: 'Pet reminders',
  study: 'Study',
  finance: 'Finance',
  travel: 'Travel',
  medication: 'Medication',
  appointment: 'Appointments',
  morning_greeting: 'Morning greeting',
  night_reflection: 'Night reflection',
}

export function ProfileMemorySection() {
  const memory = useProfileStore((s) => s.profile.journeyMemory)
  const fitness = useProfileStore((s) => s.profile.fitness)
  const updateMemory = useProfileStore((s) => s.updateJourneyMemory)
  const updateFitness = useProfileStore((s) => s.updateFitness)

  return (
    <CollapsibleSection
      title="Journey Memory"
      description="Everything JourneyOS remembers — editable anytime"
    >
      <TagListEditor
        label="Favorite exercises"
        items={memory.fitnessExtras.favoriteExercises}
        onChange={(items) =>
          updateMemory({ fitnessExtras: { ...memory.fitnessExtras, favoriteExercises: items } })
        }
        placeholder="Add exercise…"
      />
      <TagListEditor
        label="Exercises disliked"
        items={memory.fitnessExtras.dislikedExercises}
        onChange={(items) =>
          updateMemory({ fitnessExtras: { ...memory.fitnessExtras, dislikedExercises: items } })
        }
        placeholder="Add exercise…"
      />
      <TagListEditor
        label="Preferred workout order"
        items={memory.fitnessExtras.preferredWorkoutOrder}
        onChange={(items) =>
          updateMemory({ fitnessExtras: { ...memory.fitnessExtras, preferredWorkoutOrder: items } })
        }
        placeholder="e.g. Warm-up, Strength…"
      />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div>
          <FieldLabel>Workout time</FieldLabel>
          <FieldTime
            value={fitness.workoutTime}
            onChange={(v) => updateFitness({ workoutTime: v })}
          />
        </div>
        <div>
          <FieldLabel>Workout length (min)</FieldLabel>
          <FieldInput
            type="number"
            value={String(fitness.workoutLengthMinutes)}
            onChange={(v) => updateFitness({ workoutLengthMinutes: Number(v) || 45 })}
          />
        </div>
      </div>
      <TagListEditor
        label="Study subjects"
        items={memory.study.subjects}
        onChange={(items) => updateMemory({ study: { ...memory.study, subjects: items } })}
        placeholder="Add subject…"
      />
      <TagListEditor
        label="Study goals"
        items={memory.study.studyGoals}
        onChange={(items) => updateMemory({ study: { ...memory.study, studyGoals: items } })}
        placeholder="Add goal…"
      />
      <ExamDatesEditor
        exams={memory.study.examDates}
        onChange={(examDates) => updateMemory({ study: { ...memory.study, examDates } })}
      />
      <TagListEditor
        label="Financial goals"
        items={memory.finance.savingsGoals}
        onChange={(items) =>
          updateMemory({ finance: { ...memory.finance, savingsGoals: items } })
        }
        placeholder="Add savings goal…"
      />
      <TagListEditor
        label="House goals"
        items={memory.home.projects}
        onChange={(items) => updateMemory({ home: { ...memory.home, projects: items } })}
        placeholder="Add project…"
      />
      <TagListEditor
        label="Travel habits"
        items={memory.travel.frequentDestinations}
        onChange={(items) =>
          updateMemory({ travel: { ...memory.travel, frequentDestinations: items } })
        }
        placeholder="Add destination…"
      />
    </CollapsibleSection>
  )
}

export function ProfileNotificationsSection() {
  const prefs = useIntelligenceStore((s) => s.data.notifications)
  const updatePrefs = useIntelligenceStore((s) => s.updateNotificationPreferences)
  const setKind = useIntelligenceStore((s) => s.setNotificationKind)

  return (
    <CollapsibleSection
      title="Notifications"
      description="Quiet hours, weekends, vacation — timezone aware"
    >
      <div>
        <FieldLabel>Notifications enabled</FieldLabel>
        <YesNoToggle value={prefs.enabled} onChange={(v) => updatePrefs({ enabled: v })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Quiet hours start</FieldLabel>
          <FieldTime
            value={prefs.quietHoursStart}
            onChange={(v) => updatePrefs({ quietHoursStart: v })}
          />
        </div>
        <div>
          <FieldLabel>Quiet hours end</FieldLabel>
          <FieldTime
            value={prefs.quietHoursEnd}
            onChange={(v) => updatePrefs({ quietHoursEnd: v })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Weekends</FieldLabel>
          <YesNoToggle
            value={prefs.weekendsEnabled}
            onChange={(v) => updatePrefs({ weekendsEnabled: v })}
          />
        </div>
        <div>
          <FieldLabel>While on vacation</FieldLabel>
          <YesNoToggle
            value={prefs.vacationEnabled}
            onChange={(v) => updatePrefs({ vacationEnabled: v })}
          />
        </div>
      </div>
      <div>
        <FieldLabel>Timezone aware</FieldLabel>
        <YesNoToggle
          value={prefs.timezoneAware}
          onChange={(v) => updatePrefs({ timezoneAware: v })}
        />
      </div>
      <div className="space-y-2 pt-2">
        {(Object.keys(NOTIFICATION_LABELS) as NotificationKind[]).map((kind) => (
          <ModuleToggle
            key={kind}
            label={NOTIFICATION_LABELS[kind]}
            description=""
            enabled={prefs.kinds[kind]}
            onToggle={() => setKind(kind, !prefs.kinds[kind])}
          />
        ))}
      </div>
    </CollapsibleSection>
  )
}
