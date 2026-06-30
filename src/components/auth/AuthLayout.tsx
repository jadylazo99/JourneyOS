import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh min-h-screen bg-gradient-to-br from-primary via-primary to-blue px-5 py-10 safe-top safe-bottom">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 text-center"
        >
          <Link to="/auth/sign-in" className="inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/15 border border-white/20 shadow-glass-lg">
            <span className="text-2xl font-bold text-white">J</span>
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-white/60">{subtitle}</p>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-3xl border border-white/10 bg-white p-6 shadow-glass-lg"
        >
          {children}
        </motion.div>

        {footer ? <div className="mt-6 text-center text-sm text-white/70">{footer}</div> : null}
      </div>
    </div>
  )
}

interface AuthFieldProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
}

export function AuthField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
}: AuthFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-primary outline-none transition-colors focus:border-blue focus:bg-white"
      />
    </label>
  )
}

interface AuthButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function AuthButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled,
}: AuthButtonProps) {
  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-blue to-accent text-white shadow-card'
      : 'bg-slate-100 text-primary hover:bg-slate-200'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition-opacity disabled:opacity-50 ${styles}`}
    >
      {children}
    </button>
  )
}

export function AuthError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  )
}
