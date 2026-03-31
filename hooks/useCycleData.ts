'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { useCycleStore } from '@/store/cycleStore'
import { computePredictions, getDayInfo, getCurrentCycleDay, daysUntil } from '@/lib/cycleCalculations'
import type { CyclePrediction, DayInfo } from '@/types'

const DEFAULT_SETTINGS = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  lastPeriodStart: format(new Date(), 'yyyy-MM-dd'),
}

export function useCycleData() {
  const { settings, symptomLogs } = useCycleStore()
  const activeSettings = settings ?? DEFAULT_SETTINGS

  const prediction = useMemo<CyclePrediction>(
    () => computePredictions(activeSettings),
    [activeSettings]
  )

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const todayInfo = useMemo<DayInfo>(
    () => getDayInfo(todayStr, activeSettings, prediction),
    [todayStr, activeSettings, prediction]
  )

  const dayOfCycle = useMemo(
    () => getCurrentCycleDay(activeSettings.lastPeriodStart),
    [activeSettings.lastPeriodStart]
  )

  const daysUntilPeriod = useMemo(
    () => daysUntil(prediction.nextPeriodStart),
    [prediction.nextPeriodStart]
  )

  const daysUntilOvulation = useMemo(
    () => daysUntil(prediction.ovulationDay),
    [prediction.ovulationDay]
  )

  const getDayInfoForDate = (dateStr: string): DayInfo => {
    const info = getDayInfo(dateStr, activeSettings, prediction)
    info.symptomLog = symptomLogs.find((l) => l.date === dateStr)
    return info
  }

  return {
    settings: activeSettings,
    prediction,
    todayInfo,
    dayOfCycle,
    daysUntilPeriod,
    daysUntilOvulation,
    getDayInfoForDate,
  }
}
