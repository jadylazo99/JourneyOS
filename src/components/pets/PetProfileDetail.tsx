import { motion } from 'framer-motion'
import type { Pet } from '@/modules/onboarding/types'
import type { PetProgressStats } from '@/modules/pets'

interface PetProfileDetailProps {
  pet: Pet
  stats: PetProgressStats
}

function ScheduleList({ title, items }: { title: string; items: { label: string; time?: string }[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.label} className="text-sm text-white/70 flex justify-between gap-2">
            <span>{item.label}</span>
            {item.time && <span className="text-white/35 tabular-nums">{item.time}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PetProfileDetail({ pet, stats }: PetProfileDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 p-5 space-y-5"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div className="grid grid-cols-2 gap-4 text-sm">
        {pet.birthday && (
          <div>
            <p className="text-xs text-white/35">Birthday</p>
            <p className="text-white/80 mt-0.5">{pet.birthday}</p>
          </div>
        )}
        {pet.weight && (
          <div>
            <p className="text-xs text-white/35">Weight</p>
            <p className="text-white/80 mt-0.5">{pet.weight}</p>
          </div>
        )}
        {pet.food && (
          <div className="col-span-2">
            <p className="text-xs text-white/35">Food</p>
            <p className="text-white/80 mt-0.5">{pet.food}</p>
          </div>
        )}
      </div>

      <ScheduleList title="Walks" items={pet.walkSchedule} />
      <ScheduleList title="Feeding" items={pet.feedingSchedule} />

      {pet.trainingGoals.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
            Training goals
          </p>
          <ul className="space-y-1">
            {pet.trainingGoals.map((g) => (
              <li key={g} className="text-sm text-white/70">{g}</li>
            ))}
          </ul>
        </div>
      )}

      <ScheduleList title="Grooming" items={pet.groomingSchedule} />

      {(pet.vetName || pet.vetPhone) && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Vet</p>
          <p className="text-sm text-white/70">{pet.vetName}</p>
          {pet.vetPhone && (
            <a href={`tel:${pet.vetPhone}`} className="text-sm text-accent mt-0.5 block">
              {pet.vetPhone}
            </a>
          )}
        </div>
      )}

      {pet.vaccineReminders.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
            Vaccine reminders
          </p>
          <ul className="space-y-1.5">
            {pet.vaccineReminders.map((v) => (
              <li key={v.id} className="text-sm text-white/70 flex justify-between">
                <span>{v.name}</span>
                <span className="text-white/35">{v.dueDate}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pet.medications.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
            Medications
          </p>
          <ul className="space-y-1.5">
            {pet.medications.map((m) => (
              <li key={m.id} className="text-sm text-white/70">
                {m.name} — {m.schedule}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pet.notes && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Notes</p>
          <p className="text-sm text-white/60 leading-relaxed">{pet.notes}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
        {[
          { label: 'Walk streak', value: stats.walkStreak },
          { label: 'Training days', value: stats.trainingDays },
          { label: 'Grooming done', value: stats.groomingCompleted },
          { label: 'Vet reminders', value: stats.vetRemindersCompleted },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-white/[0.04] px-3 py-2.5">
            <p className="text-lg font-semibold text-white tabular-nums">{value}</p>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
