import {
  addDays,
  differenceInDays,
  format,
  parseISO,
  isWithinInterval,
  startOfDay,
} from 'date-fns'
import type { CyclePhase, CyclePrediction, CycleSettings, DayInfo } from '@/types'

// ─── Core Calculations ────────────────────────────────────────────────────────

/**
 * Compute predictions for the next cycle from given settings.
 * Ovulation ≈ lastPeriodStart + (cycleLength - 14)
 * Fertile window = ovulationDay - 5 .. ovulationDay
 * PMS = ovulationDay + 1 .. nextPeriodStart - 1
 */
export function computePredictions(settings: CycleSettings): CyclePrediction {
  const lastStart = parseISO(settings.lastPeriodStart)
  const cycleLen = settings.averageCycleLength
  const periodLen = settings.averagePeriodLength

  const nextPeriodStart = addDays(lastStart, cycleLen)
  const nextPeriodEnd   = addDays(nextPeriodStart, periodLen - 1)
  const ovulationDay    = addDays(lastStart, cycleLen - 14)
  const fertileStart    = addDays(ovulationDay, -5)
  const fertileEnd      = ovulationDay
  const pmsStart        = addDays(ovulationDay, 1)

  return {
    nextPeriodStart: format(nextPeriodStart, 'yyyy-MM-dd'),
    nextPeriodEnd:   format(nextPeriodEnd,   'yyyy-MM-dd'),
    ovulationDay:    format(ovulationDay,    'yyyy-MM-dd'),
    fertileWindowStart: format(fertileStart, 'yyyy-MM-dd'),
    fertileWindowEnd:   format(fertileEnd,   'yyyy-MM-dd'),
    pmsStart:        format(pmsStart,        'yyyy-MM-dd'),
  }
}

/**
 * Current day of cycle (1-indexed) for "today"
 */
export function getCurrentCycleDay(lastPeriodStart: string): number {
  const start = parseISO(lastPeriodStart)
  const today = startOfDay(new Date())
  return differenceInDays(today, start) + 1
}

/**
 * Determine the phase for an arbitrary date.
 */
export function getPhaseForDate(
  date: Date,
  settings: CycleSettings
): CyclePhase {
  const lastStart = parseISO(settings.lastPeriodStart)
  const cycleLen  = settings.averageCycleLength
  const periodLen = settings.averagePeriodLength

  // day-of-cycle within nearest cycle (positive number 1..cycleLen)
  let daysDiff = differenceInDays(date, lastStart)
  // normalize to current or upcoming cycle
  while (daysDiff < 0) daysDiff += cycleLen
  const dayOfCycle = (daysDiff % cycleLen) + 1

  const ovulationDay   = cycleLen - 14           // e.g. day 14 for 28-day cycle
  const fertileStart   = ovulationDay - 5        // e.g. day 9
  const pmsStart       = ovulationDay + 1        // e.g. day 15

  if (dayOfCycle <= periodLen)      return 'menstrual'
  if (dayOfCycle <= fertileStart)   return 'follicular'
  if (dayOfCycle <= ovulationDay)   return 'ovulation'
  if (dayOfCycle <= cycleLen - 3)   return 'luteal'
  return 'pms'
}

/**
 * Full DayInfo for any calendar date
 */
export function getDayInfo(
  dateStr: string,
  settings: CycleSettings,
  prediction: CyclePrediction
): DayInfo {
  const date      = parseISO(dateStr)
  const lastStart = parseISO(settings.lastPeriodStart)
  const cycleLen  = settings.averageCycleLength
  const periodLen = settings.averagePeriodLength

  let daysDiff = differenceInDays(date, lastStart)
  while (daysDiff < 0) daysDiff += cycleLen
  const dayOfCycle = (daysDiff % cycleLen) + 1

  // Period days: current cycle
  const periodEnd = addDays(lastStart, periodLen - 1)
  const isPeriodDay = isWithinInterval(date, {
    start: lastStart,
    end: periodEnd,
  }) || isWithinInterval(date, {
    start: parseISO(prediction.nextPeriodStart),
    end:   parseISO(prediction.nextPeriodEnd),
  })

  const isFertile = isWithinInterval(date, {
    start: parseISO(prediction.fertileWindowStart),
    end:   parseISO(prediction.fertileWindowEnd),
  })

  const isOvulation = dateStr === prediction.ovulationDay

  const isPMS = isWithinInterval(date, {
    start: parseISO(prediction.pmsStart),
    end:   addDays(parseISO(prediction.nextPeriodStart), -1),
  })

  const phase = getPhaseForDate(date, settings)

  return {
    date: dateStr,
    phase,
    dayOfCycle,
    isPeriodDay,
    isFertile,
    isOvulation,
    isPMS,
  }
}

/**
 * Human-readable days until next event
 */
export function daysUntil(targetDateStr: string): number {
  const target = parseISO(targetDateStr)
  const today  = startOfDay(new Date())
  return differenceInDays(target, today)
}

/**
 * Phase description copy
 */
export const PHASE_DESCRIPTIONS: Record<CyclePhase, { title: string; body: string }> = {
  menstrual: {
    title: 'Menstrual Phase',
    body: 'Your body is shedding the uterine lining. Rest, stay hydrated, and be gentle with yourself.',
  },
  follicular: {
    title: 'Follicular Phase',
    body: 'Estrogen is rising. You may feel more energetic and creative — a great time for new projects.',
  },
  ovulation: {
    title: 'Ovulation',
    body: 'You\'re at peak fertility. Energy and libido are highest. A great time for social activities.',
  },
  luteal: {
    title: 'Luteal Phase',
    body: 'Progesterone rises. You may feel calmer and more introspective. Focus on self-care.',
  },
  pms: {
    title: 'PMS Phase',
    body: 'Your period is approaching. Mood swings, cravings and bloating are common. Be kind to yourself.',
  },
}

/**
 * Phase gradient classes for Tailwind
 */
export const PHASE_GRADIENTS: Record<CyclePhase, string> = {
  menstrual:  'from-rose-500 to-rose-400',
  follicular: 'from-blush-500 to-blush-400',
  ovulation:  'from-sky-500 to-sky-400',
  luteal:     'from-amber-500 to-amber-400',
  pms:        'from-purple-500 to-purple-400',
}

export const PHASE_BG: Record<CyclePhase, string> = {
  menstrual:  'bg-rose-50 dark:bg-rose-950/30',
  follicular: 'bg-pink-50 dark:bg-pink-950/30',
  ovulation:  'bg-sky-50 dark:bg-sky-950/30',
  luteal:     'bg-amber-50 dark:bg-amber-950/30',
  pms:        'bg-purple-50 dark:bg-purple-950/30',
}
