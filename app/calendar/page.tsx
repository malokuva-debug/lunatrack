'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'
import { DayDetailSheet } from '@/components/calendar/DayDetailSheet'
import { useCycleData } from '@/hooks/useCycleData'
import type { DayInfo } from '@/types'

export default function CalendarPage() {
  const { getDayInfoForDate } = useCycleData()
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null)

  const handleDayPress = (info: DayInfo) => {
    setSelectedDay(info)
  }

  const handleLogSymptoms = () => {
    setSelectedDay(null)
    router.push(`/log?date=${selectedDay?.date ?? ''}`)
  }

  return (
    <div className="px-4 pt-8 pb-4 space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100">Calendar</h1>
      <CalendarGrid
        getDayInfo={getDayInfoForDate}
        onDayPress={handleDayPress}
        selectedDate={selectedDay?.date}
      />

      {selectedDay && (
        <DayDetailSheet
          dayInfo={selectedDay}
          onClose={() => setSelectedDay(null)}
          onLogSymptoms={handleLogSymptoms}
        />
      )}
    </div>
  )
}
