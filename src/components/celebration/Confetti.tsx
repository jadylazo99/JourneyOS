import { useMemo } from 'react'
import { motion } from 'framer-motion'

type Particle = {
  id: number
  x: number
  delay: number
  duration: number
  color: string
  size: number
  rotation: number
}

const COLORS = ['#2563EB', '#60A5FA', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6']

export function Confetti({ active }: { active: boolean }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 64 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 2.2 + Math.random() * 1.4,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
  }, [])

  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{
            opacity: 1,
            y: -20,
            x: `${p.x}vw`,
            rotate: p.rotation,
            scale: 0,
          }}
          animate={{
            opacity: [1, 1, 0],
            y: ['0vh', '110vh'],
            rotate: p.rotation + 720,
            scale: [0, 1, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.12, 0.8, 0.2, 1],
          }}
          className="absolute top-0 block rounded-sm"
          style={{
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  )
}
