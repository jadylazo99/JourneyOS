import { motion } from 'framer-motion'

interface TodayFlowButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  fullWidth?: boolean
}

export function TodayFlowButton({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = true,
}: TodayFlowButtonProps) {
  const base = 'h-12 px-5 rounded-2xl text-sm font-medium transition-all duration-200'
  const width = fullWidth ? 'w-full' : ''

  const styles = {
    primary: 'bg-white text-primary font-semibold shadow-glass disabled:opacity-35',
    secondary:
      'text-white/80 border border-white/15 disabled:opacity-35',
    ghost: 'text-white/60 hover:text-white/80',
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`${base} ${width} ${styles[variant]} ${variant === 'secondary' ? '' : ''}`}
      style={variant === 'secondary' ? { background: 'rgba(255, 255, 255, 0.08)' } : undefined}
    >
      {label}
    </motion.button>
  )
}
