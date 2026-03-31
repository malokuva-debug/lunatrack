'use client'

import { Droplets, Flower2, Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatDate, pluralize } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { CyclePrediction } from '@/types'

interface EventRowProps {
  icon: React.ReactNode
  label: string
  date: string
  daysAway: number
  colorClass: string
}

function EventRow({ icon, label, date, daysAway, colorClass }: EventRowProps) {
  const isPast = daysAway < 0
  const isToday = daysAway === 0

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800/60 last:border-0">
      <div className={cn('p-2 rounded-xl', colorClass)}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(date)}</p>
      </div>
      <div className="text-right shrink-0">
        {isToday ? (
          <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
            Today
          </span>
        ) : isPast ? (
          <span className="text-xs text-gray-400">Past</span>
        ) : (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            in {pluralize(daysAway, 'day')}
          </span>
        )}
      </div>
    </div>
  )
}

interface UpcomingEventsProps {
  prediction: CyclePrediction
  daysUntilPeriod: number
  daysUntilOvulation: number
}

export function UpcomingEvents({
  prediction,
  daysUntilPeriod,
  daysUntilOvulation,
}: UpcomingEventsProps) {
  return (
    <Card className="px-4 py-2">
      <EventRow
        icon={<Droplets size={16} className="text-rose-500" />}
        label="Next Period"
        date={prediction.nextPeriodStart}
        daysAway={daysUntilPeriod}
        colorClass="bg-rose-50 dark:bg-rose-950/40"
      />
      <EventRow
        icon={<Flower2 size={16} className="text-sky-500" />}
        label="Ovulation"
        date={prediction.ovulationDay}
        daysAway={daysUntilOvulation}
        colorClass="bg-sky-50 dark:bg-sky-950/40"
      />
      <EventRow
        icon={<Star size={16} className="text-green-500" />}
        label="Fertile Window"
        date={prediction.fertileWindowStart}
        daysAway={daysUntilOvulation - 5}
        colorClass="bg-green-50 dark:bg-green-950/40"
      />
    </Card>
  )
}
