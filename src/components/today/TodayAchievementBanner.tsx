import { AnimatePresence, motion } from 'framer-motion'
import { useAchievementStore } from '@/modules/achievements'
import { getLocalDateKey } from '@/modules/daily/date'

export function TodayAchievementBanner() {
  const banners = useAchievementStore((s) => s.todayBanners)
  const dismiss = useAchievementStore((s) => s.dismissTodayBanner)
  const today = getLocalDateKey()

  const todayBanners = banners.filter((b) => b.dateKey === today)
  const banner = todayBanners[0]

  if (!banner) return null

  return (
    <AnimatePresence>
      <motion.div
        key={banner.id}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="mx-auto max-w-[560px] w-full mb-4"
      >
        <div
          className="rounded-2xl border border-accent/30 px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(59, 130, 246, 0.12)' }}
        >
          <span className="text-2xl shrink-0">{banner.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{banner.title}</p>
            <p className="text-xs text-white/55 mt-0.5 truncate">{banner.description}</p>
          </div>
          <button
            type="button"
            onClick={() => dismiss(banner.id)}
            className="text-xs font-medium text-white/45 hover:text-white/70 shrink-0"
          >
            Nice
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
