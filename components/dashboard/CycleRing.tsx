'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { CYCLE_PHASE_LABELS } from '@/types'
import type { CyclePhase } from '@/types'

interface CycleRingProps {
  dayOfCycle: number
  cycleLength: number
  phase: CyclePhase
  periodLength: number
  fertileStart: number  // day number
  fertileEnd: number
  ovulationDay: number
}

const PHASE_STOP_COLORS: Record<CyclePhase, [string, string]> = {
  menstrual:  ['#f43f5e', '#fb7185'],
  follicular: ['#ec4899', '#f9a8d4'],
  ovulation:  ['#0ea5e9', '#38bdf8'],
  luteal:     ['#f59e0b', '#fbbf24'],
  pms:        ['#a855f7', '#c084fc'],
}

export function CycleRing({
  dayOfCycle,
  cycleLength,
  phase,
  periodLength,
  fertileStart,
  fertileEnd,
  ovulationDay,
}: CycleRingProps) {
  const [colorA, colorB] = PHASE_STOP_COLORS[phase]

  // SVG ring parameters
  const size = 220
  const strokeWidth = 14
  const r = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r

  // Progress: current day / cycle length
  const progress = Math.min(dayOfCycle / cycleLength, 1)
  const dashOffset = circumference * (1 - progress)

  // Small dot markers for phase transitions
  const dayToDeg = (day: number) => ((day - 1) / cycleLength) * 360 - 90

  const dotPos = (day: number) => {
    const rad = (dayToDeg(day) * Math.PI) / 180
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    }
  }

  const gradientId = `ring-gradient-${phase}`

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorA} />
              <stop offset="100%" stopColor={colorB} />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-100 dark:text-gray-800"
          />

          {/* Fertile window arc (green) */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#22c55e"
            strokeWidth={strokeWidth - 4}
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference * (1 - (fertileEnd - fertileStart + 1) / cycleLength)
            }
            strokeLinecap="round"
            opacity={0.35}
            transform={`rotate(${dayToDeg(fertileStart) + 90} ${cx} ${cy})`}
          />

          {/* Progress arc */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-in-out"
          />

          {/* Ovulation dot */}
          {(() => {
            const p = dotPos(ovulationDay)
            return (
              <circle
                cx={p.x} cy={p.y} r={6}
                fill="#0ea5e9"
                stroke="white"
                strokeWidth={2}
                className="rotate-90"
                style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(90deg)` }}
              />
            )
          })()}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <p className="text-5xl font-display font-bold text-gray-800 dark:text-gray-100 leading-none">
            {dayOfCycle}
          </p>
          <p className="text-xs font-body text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Day of cycle
          </p>
          <div
            className="mt-1 px-3 py-0.5 rounded-full text-xs font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }}
          >
            {CYCLE_PHASE_LABELS[phase]}
          </div>
        </div>
      </div>
    </div>
  )
}
