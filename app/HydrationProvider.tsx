'use client'

import { useEffect, ReactNode } from 'react'
import { useCycleStore } from '@/store/cycleStore'

export function HydrationProvider({ children }: { children: ReactNode }) {
  const hydrate = useCycleStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return <>{children}</>
}
