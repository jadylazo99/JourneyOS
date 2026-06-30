import { WeightInput } from '@/components/ui/WeightInput'
import { TodayFlowButton } from './TodayFlowButton'
import type { WeighInSkipReason } from '@/modules/daily'

interface WeighInPromptProps {
  value: string
  onChange: (value: string) => void
  onLog: () => void
  onSkip: (reason: WeighInSkipReason) => void
  canLog: boolean
}

export function WeighInPrompt({ value, onChange, onLog, onSkip, canLog }: WeighInPromptProps) {
  return (
    <div className="space-y-4">
      <p className="text-white/55 text-sm leading-relaxed">Want to log today's weight?</p>

      <WeightInput
        value={value}
        onChange={onChange}
        onSubmit={onLog}
        placeholder="236.8"
        size="md"
      />

      <TodayFlowButton label="Log Weight" onClick={onLog} disabled={!canLog} />

      <div className="grid grid-cols-1 gap-2 pt-1">
        <TodayFlowButton label="Skip Today" onClick={() => onSkip('today')} variant="secondary" />
        <TodayFlowButton
          label="Skip Until I'm Home"
          onClick={() => onSkip('until_home')}
          variant="secondary"
        />
        <TodayFlowButton label="Not Now" onClick={() => onSkip('not_now')} variant="ghost" />
      </div>
    </div>
  )
}
