import type { Pet } from '@/modules/onboarding/types'

interface PetRemindersSectionProps {
  pet: Pet
}

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const due = new Date(dateStr)
  const now = new Date()
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function PetRemindersSection({ pet }: PetRemindersSectionProps) {
  const upcoming = [
    ...pet.vaccineReminders.map((v) => ({
      id: v.id,
      label: v.name,
      due: v.dueDate,
      type: 'Vaccine',
    })),
    ...pet.groomingSchedule.map((g) => ({
      id: g.id,
      label: g.label,
      due: '',
      type: 'Grooming',
    })),
    ...pet.medications.map((m) => ({
      id: m.id,
      label: m.name,
      due: m.schedule,
      type: 'Medication',
    })),
  ]

  if (upcoming.length === 0) {
    return (
      <p className="text-sm text-white/35 text-center py-6">
        Add vaccine reminders or grooming schedules in Profile.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {upcoming.map((item) => {
        const days = item.due ? daysUntil(item.due) : null
        return (
          <li
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-xs text-accent/70 uppercase tracking-wider">{item.type}</p>
              <p className="text-sm text-white/80 mt-0.5">{item.label}</p>
            </div>
            {days !== null && (
              <span
                className={`text-xs font-medium tabular-nums shrink-0 ${
                  days <= 7 ? 'text-amber-400/90' : 'text-white/35'
                }`}
              >
                {days <= 0 ? 'Due' : `${days}d`}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
