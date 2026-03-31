'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, PenLine, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/',          label: 'Home',     Icon: Home },
  { href: '/calendar',  label: 'Calendar', Icon: Calendar },
  { href: '/log',       label: 'Log',      Icon: PenLine },
  { href: '/settings',  label: 'Settings', Icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
      <div className="mx-auto max-w-md">
        <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 px-2 pt-2 pb-4">
          <div className="flex items-center justify-around">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-200',
                    active
                      ? 'text-rose-500'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  )}
                >
                  <div
                    className={cn(
                      'p-1.5 rounded-xl transition-all duration-200',
                      active && 'bg-rose-50 dark:bg-rose-950/50'
                    )}
                  >
                    <Icon
                      size={22}
                      strokeWidth={active ? 2.5 : 1.8}
                      className={cn(
                        'transition-all duration-200',
                        active && 'scale-110'
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-medium transition-all duration-200',
                      active ? 'font-semibold' : ''
                    )}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
