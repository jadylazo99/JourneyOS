import type { OnboardingStep, OnboardingProfile, WorkSchedule } from '@/modules/onboarding/types'
import { getStepValue } from '@/modules/onboarding/steps'
import { OnboardingTextInput } from './OnboardingTextInput'
import { OnboardingTextArea } from './OnboardingTextArea'
import { OnboardingYesNo } from './OnboardingYesNo'
import { OnboardingHeightPicker, formatHeight } from './OnboardingHeightPicker'
import { OnboardingWeightInput } from './OnboardingWeightInput'
import { OnboardingDatePicker } from './OnboardingDatePicker'
import { OnboardingTimePicker } from './OnboardingTimePicker'
import { OnboardingDayChips } from './OnboardingDayChips'
import { OnboardingOptionSelect } from './OnboardingOptionSelect'
import { useEffect } from 'react'

interface OnboardingStepInputProps {
  step: OnboardingStep
  profile: OnboardingProfile
  onFieldChange: <K extends keyof OnboardingProfile>(field: K, value: OnboardingProfile[K]) => void
  onWorkScheduleChange: (partial: Partial<WorkSchedule>) => void
  onWorkDaysChange: (days: string[]) => void
  onPetChange: (index: number, field: 'name' | 'type' | 'birthday', value: string) => void
  onPetCountChange: (count: number) => void
  onSubmit: () => void
}

function HeightField({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  useEffect(() => {
    if (!value) onChange(formatHeight(5, 8))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <OnboardingHeightPicker value={value || formatHeight(5, 8)} onChange={onChange} />
}

export function OnboardingStepInput({
  step,
  profile,
  onFieldChange,
  onWorkScheduleChange,
  onWorkDaysChange,
  onPetChange,
  onPetCountChange,
  onSubmit,
}: OnboardingStepInputProps) {
  const value = getStepValue(step, profile)

  if (step.id === 'workDays') {
    return (
      <OnboardingDayChips
        selected={profile.workSchedule.days}
        onChange={onWorkDaysChange}
      />
    )
  }

  if (step.inputType === 'select' && step.selectOptions && step.workScheduleField) {
    return (
      <OnboardingOptionSelect
        options={step.selectOptions}
        value={String(profile.workSchedule[step.workScheduleField] ?? '')}
        onChange={(val) =>
          onWorkScheduleChange({
            [step.workScheduleField!]: val,
          } as Partial<WorkSchedule>)
        }
      />
    )
  }

  if (step.inputType === 'yesNo' && step.field) {
    return (
      <OnboardingYesNo
        value={profile[step.field] as boolean | null}
        onChange={(val) => onFieldChange(step.field!, val)}
      />
    )
  }

  if (step.inputType === 'height' && step.field) {
    return (
      <HeightField
        value={profile.height}
        onChange={(val) => onFieldChange('height', val)}
      />
    )
  }

  if (step.inputType === 'weight' && step.field) {
    return (
      <OnboardingWeightInput
        value={String(value)}
        onChange={(val) => onFieldChange(step.field!, val)}
        onSubmit={onSubmit}
        placeholder={step.placeholder}
      />
    )
  }

  if (step.inputType === 'date' && step.field) {
    return (
      <OnboardingDatePicker
        value={String(value)}
        onChange={(val) => onFieldChange(step.field!, val)}
        onSubmit={onSubmit}
      />
    )
  }

  if ((step.inputType === 'time' && step.field) || step.workScheduleField) {
    const scheduleValue = step.workScheduleField
      ? String(profile.workSchedule[step.workScheduleField] ?? '')
      : String(value)

    return (
      <OnboardingTimePicker
        value={scheduleValue}
        onChange={(val) => {
          if (step.workScheduleField) {
            onWorkScheduleChange({ [step.workScheduleField]: val } as Partial<WorkSchedule>)
          } else if (step.field) {
            onFieldChange(step.field, val)
          }
        }}
        onSubmit={onSubmit}
      />
    )
  }

  if (step.inputType === 'textarea' && step.field) {
    return (
      <OnboardingTextArea
        value={String(value)}
        onChange={(val) => onFieldChange(step.field!, val)}
        onSubmit={onSubmit}
        placeholder={step.placeholder}
      />
    )
  }

  if (step.id === 'petCount') {
    return (
      <OnboardingTextInput
        type="number"
        value={profile.petCount > 0 ? String(profile.petCount) : ''}
        onChange={(val) => {
          const num = parseInt(val, 10)
          if (!isNaN(num)) onPetCountChange(num)
          else if (val === '') onPetCountChange(0)
        }}
        onSubmit={onSubmit}
        placeholder={step.placeholder}
      />
    )
  }

  if (step.petIndex !== undefined) {
    const index = step.petIndex
    if (step.id.startsWith('petName-')) {
      return (
        <OnboardingTextInput
          value={profile.pets[index]?.name ?? ''}
          onChange={(val) => onPetChange(index, 'name', val)}
          onSubmit={onSubmit}
          placeholder={step.placeholder}
        />
      )
    }
    if (step.id.startsWith('petType-')) {
      return (
        <OnboardingTextInput
          value={profile.pets[index]?.type ?? ''}
          onChange={(val) => onPetChange(index, 'type', val)}
          onSubmit={onSubmit}
          placeholder={step.placeholder}
        />
      )
    }
    if (step.id.startsWith('petBirthday-')) {
      return (
        <OnboardingDatePicker
          value={profile.pets[index]?.birthday ?? ''}
          onChange={(val) => onPetChange(index, 'birthday', val)}
          onSubmit={onSubmit}
        />
      )
    }
  }

  if (step.field) {
    return (
      <OnboardingTextInput
        value={String(value)}
        onChange={(val) => onFieldChange(step.field!, val as OnboardingProfile[typeof step.field])}
        onSubmit={onSubmit}
        placeholder={step.placeholder}
      />
    )
  }

  return null
}
