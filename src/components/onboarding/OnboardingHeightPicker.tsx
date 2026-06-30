import { cn } from '@/utils/cn'

const FEET = [4, 5, 6, 7]
const INCHES = Array.from({ length: 12 }, (_, i) => i)

function parseHeight(height: string): { feet: number; inches: number } {
  const match = height.match(/(\d+)[''′]?\s*(\d+)/)
  if (match) {
    return { feet: parseInt(match[1], 10), inches: parseInt(match[2], 10) }
  }
  return { feet: 5, inches: 8 }
}

function formatHeight(feet: number, inches: number): string {
  return `${feet}'${inches}"`
}

interface OnboardingHeightPickerProps {
  value: string
  onChange: (value: string) => void
}

export function OnboardingHeightPicker({ value, onChange }: OnboardingHeightPickerProps) {
  const { feet, inches } = parseHeight(value || "5'8\"")

  const update = (f: number, i: number) => onChange(formatHeight(f, i))

  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <label className="block text-xs font-medium text-white/45 uppercase tracking-wider mb-2 text-center">
          Feet
        </label>
        <div
          className="rounded-2xl border border-white/15 overflow-hidden"
          style={{ background: 'rgba(255, 255, 255, 0.06)' }}
        >
          <select
            value={feet}
            onChange={(e) => update(parseInt(e.target.value, 10), inches)}
            className={cn(
              'w-full h-14 px-3 text-center text-xl font-semibold text-white appearance-none',
              'bg-transparent focus:outline-none cursor-pointer',
            )}
          >
            {FEET.map((f) => (
              <option key={f} value={f} className="bg-[#0f172a] text-white">
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-end pb-4 text-2xl font-light text-white/30">′</div>

      <div className="flex-1">
        <label className="block text-xs font-medium text-white/45 uppercase tracking-wider mb-2 text-center">
          Inches
        </label>
        <div
          className="rounded-2xl border border-white/15 overflow-hidden"
          style={{ background: 'rgba(255, 255, 255, 0.06)' }}
        >
          <select
            value={inches}
            onChange={(e) => update(feet, parseInt(e.target.value, 10))}
            className={cn(
              'w-full h-14 px-3 text-center text-xl font-semibold text-white appearance-none',
              'bg-transparent focus:outline-none cursor-pointer',
            )}
          >
            {INCHES.map((i) => (
              <option key={i} value={i} className="bg-[#0f172a] text-white">
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-end pb-4 text-2xl font-light text-white/30">″</div>
    </div>
  )
}

export { formatHeight, parseHeight }
