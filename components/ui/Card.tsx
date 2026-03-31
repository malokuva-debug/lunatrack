import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  glass?: boolean
}

export function Card({ children, className, onClick, glass }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-3xl shadow-card dark:shadow-card-dark transition-all duration-200',
        glass
          ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/10'
          : 'bg-white dark:bg-gray-900',
        onClick && 'cursor-pointer active:scale-[0.98] hover:shadow-luna',
        className
      )}
    >
      {children}
    </div>
  )
}

interface SectionHeaderProps {
  title: string
  action?: ReactNode
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-display text-lg font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      {action}
    </div>
  )
}
