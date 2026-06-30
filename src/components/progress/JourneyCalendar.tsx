import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useDailyStore } from '@/modules/daily'
import { loadDailyStore } from '@/modules/daily/storage'
import {
  getCalendarMonthDays,
  getDayStatusConfig,
  getMonthGridPadding,
  isTodayKey,
} from '@/modules/calendar'
import { DayDetailsSheet } from './DayDetailsSheet'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function JourneyCalendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const todayUpdated = useDailyStore((s) => s.todayRecord?.updatedAt)
  const records = useMemo(() => loadDailyStore().records, [year, month, selectedDate, todayUpdated])

  const days = getCalendarMonthDays(year, month)
  const padding = getMonthGridPadding(year, month)
  const monthLabel = new Date(year, month).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  return (
    <>
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={prevMonth}
            className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold text-primary tabular-nums">{monthLabel}</p>
          <button
            type="button"
            onClick={nextMonth}
            className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400 py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: padding }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map((dateKey) => {
            const record = records[dateKey]
            const config = getDayStatusConfig(record, dateKey)
            const today = isTodayKey(dateKey)
            const dayNum = Number(dateKey.split('-')[2])

            return (
              <motion.button
                key={dateKey}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedDate(dateKey)}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                  today ? 'ring-2 ring-blue/40 ring-offset-1' : ''
                }`}
                style={{ background: config.bgColor }}
              >
                <span
                  className={`text-sm font-medium tabular-nums ${
                    today ? 'text-blue' : 'text-slate-700'
                  }`}
                >
                  {dayNum}
                </span>
                {record && (
                  <span
                    className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full"
                    style={{ background: config.color }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-slate-100">
          {(['strong', 'vacation', 'rest', 'empty', 'missed'] as const).map((key) => {
            const labels = {
              strong: 'Strong',
              vacation: 'Travel',
              rest: 'Rest',
              empty: 'No data',
              missed: 'Missed',
            }
            const colors = {
              strong: '#22c55e',
              vacation: '#3b82f6',
              rest: '#f59e0b',
              empty: '#94a3b8',
              missed: '#ef4444',
            }
            return (
              <div key={key} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: colors[key] }}
                />
                {labels[key]}
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDate && (
          <DayDetailsSheet
            dateKey={selectedDate}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
