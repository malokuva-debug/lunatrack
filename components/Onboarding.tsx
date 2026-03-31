'use client'

import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { ChevronRight, Droplets } from 'lucide-react'
import { useCycleStore } from '@/store/cycleStore'
import { cn } from '@/lib/utils'

export function Onboarding() {
  const { saveSettings } = useCycleStore()
  const [step, setStep] = useState(0)
  const [lastPeriodStart, setLastPeriodStart] = useState(
    format(subDays(new Date(), 14), 'yyyy-MM-dd')
  )
  const [cycleLength,  setCycleLength]  = useState(28)
  const [periodLength, setPeriodLength] = useState(5)

  const steps = [
    {
      title: 'Welcome to Luna 🌙',
      subtitle: 'Your private, offline-first cycle companion. Let\'s set things up in under a minute.',
      content: null,
    },
    {
      title: 'When did your last period start?',
      subtitle: 'This helps us predict your upcoming cycle accurately.',
      content: (
        <input
          type="date"
          value={lastPeriodStart}
          max={format(new Date(), 'yyyy-MM-dd')}
          onChange={(e) => setLastPeriodStart(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700"
        />
      ),
    },
    {
      title: 'How long is your cycle?',
      subtitle: 'Count from the first day of your period to the day before the next one.',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 border border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setCycleLength((v) => Math.max(21, v - 1))}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xl font-bold active:scale-95 transition-transform"
            >−</button>
            <div className="text-center">
              <p className="text-4xl font-display font-bold text-gray-800 dark:text-gray-100">{cycleLength}</p>
              <p className="text-xs text-gray-400">days</p>
            </div>
            <button
              onClick={() => setCycleLength((v) => Math.min(45, v + 1))}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xl font-bold active:scale-95 transition-transform"
            >+</button>
          </div>
          <p className="text-xs text-center text-gray-400 dark:text-gray-500">Most cycles are 21–35 days. Average is 28.</p>
        </div>
      ),
    },
    {
      title: 'How long does your period last?',
      subtitle: 'The number of days you typically bleed.',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 border border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setPeriodLength((v) => Math.max(2, v - 1))}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xl font-bold active:scale-95 transition-transform"
            >−</button>
            <div className="text-center">
              <p className="text-4xl font-display font-bold text-gray-800 dark:text-gray-100">{periodLength}</p>
              <p className="text-xs text-gray-400">days</p>
            </div>
            <button
              onClick={() => setPeriodLength((v) => Math.min(10, v + 1))}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xl font-bold active:scale-95 transition-transform"
            >+</button>
          </div>
          <p className="text-xs text-center text-gray-400 dark:text-gray-500">Most periods last 3–7 days. Average is 5.</p>
        </div>
      ),
    },
  ]

  const isLast = step === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      saveSettings({ lastPeriodStart, averageCycleLength: cycleLength, averagePeriodLength: periodLength })
    } else {
      setStep((s) => s + 1)
    }
  }

  return (
    <div className="min-h-screen bg-luna-gradient dark:bg-luna-gradient-dark flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500 to-rose-400 flex items-center justify-center shadow-luna-lg">
            <Droplets size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100">Luna</h1>
        </div>

        {/* Step indicator */}
        {step > 0 && (
          <div className="flex gap-1.5 justify-center">
            {steps.slice(1).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i < step ? 'bg-rose-500 w-6' : i === step - 1 ? 'bg-rose-400 w-6' : 'bg-gray-200 dark:bg-gray-700 w-3'
                )}
              />
            ))}
          </div>
        )}

        {/* Step content */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-card dark:shadow-card-dark space-y-4 animate-fade-in">
          <div className="space-y-1.5">
            <h2 className="font-display text-xl font-bold text-gray-800 dark:text-gray-100">
              {steps[step].title}
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
              {steps[step].subtitle}
            </p>
          </div>
          {steps[step].content}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-400 text-white font-semibold shadow-luna-lg hover:shadow-luna active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isLast ? 'Start Tracking 🎉' : (
            <>Next <ChevronRight size={18} /></>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600">
          All data stays on your device. 100% private.
        </p>
      </div>
    </div>
  )
}
