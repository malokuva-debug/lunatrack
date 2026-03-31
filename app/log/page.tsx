'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SymptomLogger } from '@/components/log/SymptomLogger'
import { todayStr } from '@/lib/utils'

function LogContent() {
  const params = useSearchParams()
  const date = params.get('date') || todayStr()

  return (
    <div className="px-4 pt-8 pb-4 space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100">Daily Log</h1>
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-card dark:shadow-card-dark p-5">
        <SymptomLogger date={date} />
      </div>
    </div>
  )
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" /></div>}>
      <LogContent />
    </Suspense>
  )
}
