'use client'

import { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DayInfo } from '@/types'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

interface CalendarGridProps {
  getDayInfo: (dateStr: string) => DayInfo
  onDayPress: (dayInfo: DayInfo) => void
  selectedDate?: string
}

function DayCell({
  dayInfo,
  isSelected,
  onPress,
}: {
  dayInfo: DayInfo
  isSelected: boolean
  onPress: () => void
}) {
  const d = parseISO(dayInfo.date)
  const today = isToday(d)

  const dotColors: string[] = []
  if (dayInfo.isPeriodDay) dotColors.push('bg-rose-500')
  else if (dayInfo.isOvulation) dotColors.push('bg-sky-500')
  else if (dayInfo.isFertile) dotColors.push('bg-green-500')
  else if (dayInfo.isPMS) dotColors.push('bg-purple-400')

  const hasLog = !!dayInfo.symptomLog

  return (
    <button
      onClick={onPress}
      className={cn(
        'relative flex flex-col items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 mx-auto',
        isSelected && 'ring-2 ring-rose-400 ring-offset-1',
        today && !isSelected && 'ring-2 ring-gray-300 dark:ring-gray-600',
        dayInfo.isPeriodDay && 'bg-rose-500 text-white',
        !dayInfo.isPeriodDay && dayInfo.isOvulation && 'bg-sky-500 text-white',
        !dayInfo.isPeriodDay && !dayInfo.isOvulation && dayInfo.isFertile && 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300',
        !dayInfo.isPeriodDay && !dayInfo.isOvulation && !dayInfo.isFertile && dayInfo.isPMS && 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300',
        !dayInfo.isPeriodDay && !dayInfo.isOvulation && !dayInfo.isFertile && !dayInfo.isPMS && 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200',
      )}
    >
      <span className="text-xs font-medium leading-none">{format(d, 'd')}</span>
      {hasLog && (
        <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-amber-400" />
      )}
    </button>
  )
}

export function CalendarGrid({ getDayInfo, onDayPress, selectedDate }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end   = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const leadingBlanks = getDay(startOfMonth(currentMonth))

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-card dark:shadow-card-dark p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <h2 className="font-display font-semibold text-gray-800 dark:text-gray-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRight size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <p key={d} className="text-center text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            {d}
          </p>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((d) => {
          const dateStr  = format(d, 'yyyy-MM-dd')
          const dayInfo  = getDayInfo(dateStr)
          return (
            <DayCell
              key={dateStr}
              dayInfo={dayInfo}
              isSelected={selectedDate === dateStr}
              onPress={() => onDayPress(dayInfo)}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
        {[
          { color: 'bg-rose-500',     label: 'Period' },
          { color: 'bg-green-100 dark:bg-green-800',    label: 'Fertile' },
          { color: 'bg-sky-500',      label: 'Ovulation' },
          { color: 'bg-purple-100 dark:bg-purple-900',  label: 'PMS' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={cn('w-2.5 h-2.5 rounded-full', color)} />
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
