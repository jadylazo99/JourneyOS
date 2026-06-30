import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'
import { WEEKDAY_OPTIONS } from '@/modules/onboarding/types'

const inputClass = cn(
  'w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3',
  'text-sm text-primary placeholder:text-slate-400',
  'focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue/40',
)

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
      {children}
    </label>
  )
}

export function FieldInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  )
}

export function FieldTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(inputClass, 'resize-none')}
    />
  )
}

export function FieldTime({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  )
}

export function FieldSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputClass, 'appearance-none cursor-pointer')}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export function YesNoToggle({
  value,
  onChange,
  yesLabel = 'Yes',
  noLabel = 'No',
}: {
  value: boolean | null
  onChange: (v: boolean) => void
  yesLabel?: string
  noLabel?: string
}) {
  return (
    <div className="flex gap-2">
      {[true, false].map((option) => {
        const active = value === option
        return (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              'flex-1 rounded-2xl py-3 text-sm font-medium transition-all',
              active
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-50 text-slate-500 border border-slate-200',
            )}
          >
            {option ? yesLabel : noLabel}
          </button>
        )
      })}
    </div>
  )
}

export function DayChips({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (days: string[]) => void
}) {
  const toggle = (day: string) => {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day))
    } else {
      onChange([...selected, day])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {WEEKDAY_OPTIONS.map((day) => {
        const active = selected.includes(day)
        return (
          <motion.button
            key={day}
            type="button"
            onClick={() => toggle(day)}
            whileTap={{ scale: 0.96 }}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors',
              active
                ? 'bg-blue text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
            )}
          >
            {day.slice(0, 3)}
          </motion.button>
        )
      })}
    </div>
  )
}

export function TagListEditor({
  label,
  items,
  onChange,
  placeholder = 'Add item…',
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const trimmed = draft.trim()
    if (!trimmed || items.includes(trimmed)) return
    onChange([...items, trimmed])
    setDraft('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-blue/10 pl-3 pr-1.5 py-1 text-xs font-medium text-blue"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i !== item))}
                className="rounded-full p-0.5 hover:bg-blue/20"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(inputClass, 'flex-1')}
        />
        <button
          type="button"
          onClick={add}
          className="rounded-2xl bg-primary px-4 text-white shrink-0 hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export function ModuleToggle({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'w-full rounded-2xl border p-4 text-left transition-all',
        enabled
          ? 'border-blue/30 bg-blue/[0.04]'
          : 'border-slate-100 bg-slate-50/50 opacity-70',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
        <div
          className={cn(
            'h-6 w-11 rounded-full shrink-0 transition-colors relative',
            enabled ? 'bg-blue' : 'bg-slate-200',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              enabled ? 'translate-x-[22px]' : 'translate-x-0.5',
            )}
          />
        </div>
      </div>
    </button>
  )
}
