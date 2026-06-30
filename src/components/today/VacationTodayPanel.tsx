import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDailyStore } from '@/modules/daily'
import { getLocalDateKey } from '@/modules/daily/date'
import { useProfileStore } from '@/modules/profile'
import { WeightInput } from '@/components/ui'
import { parseWeightExact } from '@/utils/weight'
import {
  isVacationPausedToday,
  shouldAutoActivateVacation,
} from '@/modules/intelligence/vacation/engine'

export function VacationTodayPanel() {
  const vacation = useProfileStore((s) => s.profile.vacation)
  const pauseVacationToday = useProfileStore((s) => s.pauseVacationToday)
  const resumeVacationToday = useProfileStore((s) => s.resumeVacationToday)
  const endVacationEarly = useProfileStore((s) => s.endVacationEarly)
  const pets = useProfileStore((s) => s.profile.pets)
  const isModuleEnabled = useProfileStore((s) => s.isModuleEnabled)

  const todayRecord = useDailyStore((s) => s.todayRecord)
  const updateDayNotes = useDailyStore((s) => s.updateDayNotes)
  const logWeight = useDailyStore((s) => s.logWeight)
  const setWeighInInput = useDailyStore((s) => s.setWeighInInput)
  const weighInInput = useDailyStore((s) => s.weighInInput)
  const lifeEngineSettings = useDailyStore((s) => s.lifeEngineSettings)

  const [memoryNote, setMemoryNote] = useState(todayRecord?.notes ?? '')
  const [savedNote, setSavedNote] = useState(false)
  const [showWeight, setShowWeight] = useState(false)

  const todayKey = getLocalDateKey()
  const scheduled = shouldAutoActivateVacation(vacation, todayKey)
  const paused = isVacationPausedToday(vacation, todayKey)
  const vacationActive =
    todayRecord?.dayMode.mode === 'vacation' ||
    (lifeEngineSettings.vacationModeEnabled && !paused)

  if (!vacationActive && !scheduled) return null

  const timezone = vacation.timezone.trim()
  const petsAtHome =
    isModuleEnabled('pets') &&
    vacation.travelingWithPets === false &&
    pets.some((p) => p.name.trim())
  const petNames = pets.map((p) => p.name.trim()).filter(Boolean).join(' & ')

  const handleSaveNote = () => {
    if (!todayRecord) return
    updateDayNotes(todayRecord.dateKey, memoryNote.trim())
    setSavedNote(true)
    setTimeout(() => setSavedNote(false), 2000)
  }

  const handleToggleToday = () => {
    if (paused || !lifeEngineSettings.vacationModeEnabled) {
      resumeVacationToday()
    } else {
      pauseVacationToday()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-blue-400/30 p-5 mb-4 space-y-4"
      style={{ background: 'rgba(59, 130, 246, 0.12)', backdropFilter: 'blur(20px)' }}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-200/80 mb-1">
          Vacation mode
        </p>
        {timezone && (
          <p className="text-white/40 text-xs">{timezone}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleToggleToday}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition-colors"
        >
          {paused || !lifeEngineSettings.vacationModeEnabled
            ? 'Turn vacation mode on today'
            : 'Turn vacation mode off today'}
        </button>
        {scheduled && (
          <button
            type="button"
            onClick={endVacationEarly}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/[0.06] transition-colors"
          >
            End vacation early
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-white/5 px-3 py-2">
          <p className="text-white/40 text-[10px] uppercase tracking-wider">Walking</p>
          <p className="text-white/80">Explore on foot</p>
        </div>
        <div className="rounded-xl bg-white/5 px-3 py-2">
          <p className="text-white/40 text-[10px] uppercase tracking-wider">Hydration</p>
          <p className="text-white/80">Keep drinking water</p>
        </div>
        {isModuleEnabled('nutrition') && (
          <div className="rounded-xl bg-white/5 px-3 py-2 col-span-2">
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Meals</p>
            <p className="text-white/80">Protein-first when you eat — no pressure</p>
          </div>
        )}
        {petsAtHome && (
          <div className="rounded-xl bg-white/5 px-3 py-2 col-span-2">
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Pets at home</p>
            <p className="text-white/80">
              Check in on care for {petNames || 'your pets'} while you&apos;re away.
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Memory or photo note (optional)
          </span>
          <textarea
            value={memoryNote}
            onChange={(e) => setMemoryNote(e.target.value)}
            placeholder="What stood out today?"
            rows={2}
            className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 resize-none"
          />
        </label>
        <button
          type="button"
          onClick={handleSaveNote}
          className="mt-2 w-full rounded-xl bg-white/10 py-2 text-sm font-medium text-white hover:bg-white/15 transition-colors"
        >
          {savedNote ? 'Saved!' : 'Save memory note'}
        </button>
      </div>

      {isModuleEnabled('weight_loss') && (
        <div>
          {!showWeight ? (
            <button
              type="button"
              onClick={() => setShowWeight(true)}
              className="text-xs text-white/45 hover:text-white/65 transition-colors"
            >
              Optional: log weight today
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Optional weigh-in
              </p>
              <WeightInput value={weighInInput} onChange={setWeighInInput} />
              <button
                type="button"
                onClick={() => {
                  const w = parseWeightExact(weighInInput)
                  if (w !== null) {
                    logWeight(w)
                    setShowWeight(false)
                  }
                }}
                className="w-full rounded-xl bg-white/10 py-2 text-sm font-medium text-white hover:bg-white/15 transition-colors"
              >
                Log weight
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
