import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useStudyStore } from '@/modules/study'

export function StudyTodayPanel() {
  const hydrate = useStudyStore((s) => s.hydrate)
  const hydrated = useStudyStore((s) => s.hydrated)
  const studyingFor = useStudyStore((s) => s.studyingFor)
  const dailyGoalMinutes = useStudyStore((s) => s.dailyGoalMinutes)
  const minutesStudiedToday = useStudyStore((s) => s.minutesStudiedToday)
  const logSession = useStudyStore((s) => s.logSession)

  const [minutes, setMinutes] = useState('30')
  const [notes, setNotes] = useState('')
  const [practiceScore, setPracticeScore] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const handleLog = () => {
    const value = Number(minutes)
    if (!value || value <= 0) return
    logSession(value, {
      notes: notes.trim() || undefined,
      practiceScore: practiceScore.trim() ? Number(practiceScore) : undefined,
    })
    setNotes('')
    setPracticeScore('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!hydrated) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-white/20 p-5 mb-4"
      style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-accent/80 mb-1">
        Study
      </p>
      <p className="text-white text-lg font-semibold leading-snug">
        {studyingFor || 'Log a study session'}
      </p>
      <p className="text-white/50 text-sm mt-1">
        {minutesStudiedToday} / {dailyGoalMinutes} min today
      </p>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Minutes studied
          </span>
          <input
            type="number"
            min={1}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Notes (optional)
          </span>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you cover?"
            className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Practice test score (optional)
          </span>
          <input
            type="number"
            min={0}
            max={100}
            value={practiceScore}
            onChange={(e) => setPracticeScore(e.target.value)}
            placeholder="e.g. 85"
            className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
          />
        </label>
        <button
          type="button"
          onClick={handleLog}
          className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-primary"
        >
          {saved ? 'Logged!' : 'Log study session'}
        </button>
      </div>
    </motion.div>
  )
}
