import { cn } from '@/lib/utils'

type BadgeVariant = 'period' | 'fertile' | 'ovulation' | 'pms' | 'follicular' | 'luteal' | 'default'

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  period:     'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  fertile:    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  ovulation:  'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  pms:        'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  follicular: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  luteal:     'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  default:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
}

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  className?: string
}

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
