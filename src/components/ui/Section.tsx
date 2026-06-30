import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface SectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function Section({ title, description, children, className }: SectionProps) {
  return (
    <section className={cn('space-y-3', className)}>
      {(title || description) && (
        <div className="px-1">
          {title && (
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
