'use client'

import { Card } from '@/components/ui/Card'
import { PHASE_DESCRIPTIONS, PHASE_BG } from '@/lib/cycleCalculations'
import type { CyclePhase } from '@/types'
import { cn } from '@/lib/utils'

interface PhaseInsightCardProps {
  phase: CyclePhase
}

const PHASE_TIPS: Record<CyclePhase, string[]> = {
  menstrual:  ['Rest more', 'Stay hydrated', 'Heat therapy'],
  follicular: ['Start new projects', 'Exercise freely', 'Socialise'],
  ovulation:  ['Peak performance', 'High energy', 'Connect'],
  luteal:     ['Journaling', 'Light exercise', 'Meal prep'],
  pms:        ['Self-care', 'Reduce caffeine', 'Breathe deep'],
}

const PHASE_EMOJIS: Record<CyclePhase, string> = {
  menstrual:  '🌙',
  follicular: '🌱',
  ovulation:  '☀️',
  luteal:     '🍂',
  pms:        '🌧️',
}

export function PhaseInsightCard({ phase }: PhaseInsightCardProps) {
  const { title, body } = PHASE_DESCRIPTIONS[phase]
  const tips = PHASE_TIPS[phase]

  return (
    <Card className={cn('p-4', PHASE_BG[phase])}>
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none mt-0.5">{PHASE_EMOJIS[phase]}</span>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-gray-800 dark:text-gray-100 text-sm">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            {body}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tips.map((tip) => (
              <span
                key={tip}
                className="text-[10px] font-medium bg-white/60 dark:bg-black/20 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
              >
                {tip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
