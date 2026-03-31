'use client'

import { X, Droplets, Wind, Zap, Smile } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { PHASE_DESCRIPTIONS } from '@/lib/cycleCalculations'
import { MOOD_EMOJIS } from '@/types'
import { Badge } from '@/components/ui/Badge'
import type { DayInfo } from '@/types'
import { cn } from '@/lib/utils'

interface DayDetailSheetProps {
  dayInfo: DayInfo
  onClose: () => void
  onLogSymptoms: () => void
}

export function DayDetailSheet({ dayInfo, onClose, onLogSymptoms }: DayDetailSheetProps) {
  const { phase, dayOfCycle, isPeriodDay, isFertile, isOvulation, isPMS, symptomLog } = dayInfo
  const phaseInfo = PHASE_DESCRIPTIONS[phase]

  const tags: { label: string; variant: 'period' | 'fertile' | 'ovulation' | 'pms' | 'follicular' | 'luteal' | 'default' }[] = []
  if (isPeriodDay) tags.push({ label: 'Period Day', variant: 'period' })
  if (isOvulation) tags.push({ label: 'Ovulation', variant: 'ovulation' })
  if (isFertile && !isOvulation) tags.push({ label: 'Fertile Window', variant: 'fertile' })
  if (isPMS) tags.push({ label: 'PMS Phase', variant: 'pms' })
  if (!tags.length) tags.push({ label: phaseInfo.title, variant: 'default' })

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md p-6 pb-10 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-gray-800 dark:text-gray-100">
              {formatDate(dayInfo.date, 'EEEE, MMMM d')}
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
              Day {dayOfCycle} of your cycle
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((t) => (
            <Badge key={t.label} label={t.label} variant={t.variant} />
          ))}
        </div>

        {/* Phase description */}
        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-3 mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{phaseInfo.body}</p>
        </div>

        {/* Symptom log if exists */}
        {symptomLog ? (
          <div className="space-y-3 mb-5">
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-200">Your Log</h4>
            <div className="grid grid-cols-2 gap-2">
              {symptomLog.mood && (
                <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-950/30 rounded-2xl px-3 py-2">
                  <Smile size={14} className="text-pink-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {MOOD_EMOJIS[symptomLog.mood]} {symptomLog.mood}
                  </span>
                </div>
              )}
              {symptomLog.pain !== undefined && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 rounded-2xl px-3 py-2">
                  <Droplets size={14} className="text-red-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    Pain: {symptomLog.pain}/5
                  </span>
                </div>
              )}
              {symptomLog.energy && (
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 rounded-2xl px-3 py-2">
                  <Zap size={14} className="text-amber-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">
                    Energy: {symptomLog.energy}
                  </span>
                </div>
              )}
              {symptomLog.flow && symptomLog.flow !== 'none' && (
                <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/30 rounded-2xl px-3 py-2">
                  <Wind size={14} className="text-rose-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">
                    Flow: {symptomLog.flow}
                  </span>
                </div>
              )}
            </div>
            {symptomLog.symptoms && symptomLog.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {symptomLog.symptoms.map((s) => (
                  <span key={s} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            )}
            {symptomLog.notes && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">&ldquo;{symptomLog.notes}&rdquo;</p>
            )}
          </div>
        ) : null}

        {/* CTA */}
        <button
          onClick={onLogSymptoms}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-400 text-white font-semibold text-sm shadow-luna hover:shadow-luna-lg active:scale-[0.98] transition-all"
        >
          {symptomLog ? 'Edit Log' : 'Log Symptoms'}
        </button>
      </div>
    </div>
  )
}
