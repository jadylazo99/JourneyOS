import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface PlaceholderBlockProps {
  label: string
  height?: string
  className?: string
  children?: ReactNode
}

export function PlaceholderBlock({
  label,
  height = 'h-24',
  className,
  children,
}: PlaceholderBlockProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-slate-200 bg-slate-50/60',
        'flex flex-col items-center justify-center gap-1',
        height,
        className,
      )}
    >
      {children ?? (
        <span className="text-xs font-medium text-slate-400">{label}</span>
      )}
    </div>
  )
}
