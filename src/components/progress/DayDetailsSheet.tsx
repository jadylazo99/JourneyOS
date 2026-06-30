import { useMemo, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { getDayDetails } from '@/modules/calendar'
import { useDailyStore } from '@/modules/daily'
import { getLocalDateKey } from '@/modules/daily/date'
import { isRecordLocked } from '@/modules/daily/storage'

interface DayDetailsSheetProps {
  dateKey: string
  onClose: () => void
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  if (value == null || value === '' || value === 0) return null
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-400 shrink-0">{label}</span>
      <span className="text-sm text-primary text-right">{value}</span>
    </div>
  )
}

export function DayDetailsSheet({ dateKey, onClose }: DayDetailsSheetProps) {
  const details = useMemo(() => getDayDetails(dateKey), [dateKey])
  const updateNotes = useDailyStore((s) => s.updateDayNotes)
  const isToday = dateKey === getLocalDateKey()
  const todayUpdated = useDailyStore((s) =>
    isToday ? s.todayRecord?.updatedAt : null,
  )
  const record = useMemo(
    () => useDailyStore.getState().getRecord(dateKey),
    [dateKey, todayUpdated],
  )
  const canEditNotes = isToday && record && !isRecordLocked(record)

  if (!details) return null

  const petSummary =
    details.petTasks.length > 0
      ? `${details.petTasks.filter((t) => t.status === 'completed').length}/${details.petTasks.length} done`
      : null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white px-5 pt-6 pb-10 safe-bottom"
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-lg font-semibold text-primary">{details.displayDate}</p>
            <p className="text-xs text-slate-400 mt-0.5">{details.dayModeLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {!details.hasData ? (
          <p className="text-sm text-slate-500 text-center py-8">
            No journey data for this day yet.
          </p>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl bg-gradient-to-br from-primary to-blue p-4 text-white">
              <p className="text-xs text-white/60 uppercase tracking-wider">Momentum</p>
              <p className="text-3xl font-semibold tabular-nums mt-1">{details.momentumScore}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 p-4">
              <DetailRow label="Day mode" value={details.dayModeLabel} />
              <DetailRow
                label="Weight"
                value={
                  details.weightLogged
                    ? `${details.weight} lb`
                    : undefined
                }
              />
              <DetailRow
                label="Workout"
                value={
                  details.workout?.completed
                    ? details.workout.title ?? 'Completed'
                    : details.workout?.skipped
                      ? 'Skipped (no penalty)'
                      : undefined
                }
              />
              <DetailRow label="Water" value={details.waterOz ? `${details.waterOz} oz` : undefined} />
              <DetailRow label="Protein" value={details.proteinGrams ? `${details.proteinGrams}g` : undefined} />
              <DetailRow label="Pet tasks" value={petSummary} />
            </div>

            {details.highlights.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Activity
                </p>
                <ul className="space-y-1.5">
                  {details.highlights.map((h) => (
                    <li key={h} className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {details.meals && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Meals
                </p>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  {details.meals.breakfast && (
                    <li>Breakfast: {details.meals.breakfast.name}</li>
                  )}
                  {details.meals.lunchReminder && (
                    <li>Lunch: {details.meals.lunchReminder}</li>
                  )}
                  {details.meals.dinnerIdea && (
                    <li>Dinner: {details.meals.dinnerIdea.name}</li>
                  )}
                </ul>
              </div>
            )}

            {details.achievements.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Achievements
                </p>
                <ul className="space-y-2">
                  {details.achievements.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-xl bg-slate-50 px-3 py-2.5 flex items-center gap-3"
                    >
                      <span className="text-lg">{a.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-primary">{a.title}</p>
                        {a.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {canEditNotes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Notes
                </p>
                <textarea
                  value={record?.notes ?? ''}
                  onChange={(e) => updateNotes(dateKey, e.target.value)}
                  placeholder="Add a note about today..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-primary placeholder:text-slate-400 focus:outline-none focus:border-blue/40 resize-none"
                />
              </div>
            )}

            {!canEditNotes && details.notes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Notes
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">{details.notes}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </>
  )
}
