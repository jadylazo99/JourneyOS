import { WeightInput } from '@/components/ui/WeightInput'

interface OnboardingWeightInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
}

export function OnboardingWeightInput({
  value,
  onChange,
  onSubmit,
  placeholder = '236.8',
}: OnboardingWeightInputProps) {
  return (
    <WeightInput
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      placeholder={placeholder}
    />
  )
}
