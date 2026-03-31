'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Bell, Droplets } from 'lucide-react'
import { useCycleStore } from '@/store/cycleStore'
import { useCycleData } from '@/hooks/useCycleData'
import { Onboarding } from '@/components/Onboarding'
import { CycleRing } from '@/components/dashboard/CycleRing'
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents'
import { PhaseInsightCard } from '@/components/dashboard/PhaseInsightCard'
import { SectionHeader } from '@/components/ui/Card'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const { isOnboarded, settings } = useCycleStore()
  const { prediction, todayInfo, dayOfCycle, daysUntilPeriod, daysUntilOvulation } = useCycleData()
  const { isInstallable, install } = usePWAInstall()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Prevent flash of wrong content on SSR
  if (!mounted) return null

  if (!isOnboarded) return <Onboarding />

  const activeSettings = settings!

  // Fertile window day numbers (for ring markers)
  const ovulationDayNum = activeSettings.averageCycleLength - 14
  const fertileStartNum = ovulationDayNum - 5

  return (
    <div className="px-4 pt-8 pb-4 space-y-6 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-rose-400 flex items-center justify-center shadow-luna">
            <Droplets size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-gray-800 dark:text-gray-100 leading-none">Luna</h1>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{format(new Date(), 'EEEE, MMMM d')}</p>
          </div>
        </div>
        <button className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-card dark:shadow-card-dark">
          <Bell size={18} className="text-gray-400 dark:text-gray-500" />
        </button>
      </div>

      {/* PWA install banner */}
      {isInstallable && (
        <div
          className="bg-gradient-to-r from-rose-500 to-rose-400 rounded-2xl p-3 flex items-center justify-between cursor-pointer shadow-luna"
          onClick={install}
        >
          <div>
            <p className="text-white font-semibold text-sm">Install Luna</p>
            <p className="text-rose-100 text-xs">Track offline, anytime</p>
          </div>
          <span className="text-white text-xs font-medium bg-white/20 px-3 py-1.5 rounded-xl">Install</span>
        </div>
      )}

      {/* Cycle ring */}
      <div className="flex justify-center">
        <CycleRing
          dayOfCycle={dayOfCycle}
          cycleLength={activeSettings.averageCycleLength}
          phase={todayInfo.phase}
          periodLength={activeSettings.averagePeriodLength}
          fertileStart={fertileStartNum}
          fertileEnd={ovulationDayNum}
          ovulationDay={ovulationDayNum}
        />
      </div>

      {/* Status chips */}
      <div className="flex gap-2 justify-center flex-wrap">
        {todayInfo.isPeriodDay && (
          <Chip label="🩸 Period Day" colorClass="bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300" />
        )}
        {todayInfo.isOvulation && (
          <Chip label="🌊 Ovulation Day" colorClass="bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300" />
        )}
        {todayInfo.isFertile && !todayInfo.isOvulation && (
          <Chip label="🌿 Fertile Window" colorClass="bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-300" />
        )}
        {todayInfo.isPMS && (
          <Chip label="💜 PMS Phase" colorClass="bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300" />
        )}
      </div>

      {/* Phase insight */}
      <section>
        <SectionHeader title="Today's Insight" />
        <PhaseInsightCard phase={todayInfo.phase} />
      </section>

      {/* Upcoming events */}
      <section>
        <SectionHeader title="Coming Up" />
        <UpcomingEvents
          prediction={prediction}
          daysUntilPeriod={daysUntilPeriod}
          daysUntilOvulation={daysUntilOvulation}
        />
      </section>
    </div>
  )
}

function Chip({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={cn('px-3 py-1.5 rounded-full text-xs font-semibold', colorClass)}>
      {label}
    </span>
  )
}
