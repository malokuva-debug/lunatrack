import type { Metadata, Viewport } from 'next'
import './globals.css'
import { BottomNav } from '@/components/BottomNav'
import { HydrationProvider } from './HydrationProvider'

export const metadata: Metadata = {
  title: 'Luna – Cycle Tracker',
  description: 'Your private, offline-first period & cycle tracking companion',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Luna',
  },
  icons: {
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  keywords: ['period tracker', 'cycle tracker', 'menstrual', 'ovulation', 'fertility'],
  authors: [{ name: 'Luna App' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f43f5e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-startup-image" href="/icons/splash.png" />
      </head>
      <body className="bg-luna-gradient dark:bg-luna-gradient-dark min-h-screen">
        <HydrationProvider>
          <div className="mx-auto max-w-md min-h-screen relative">
            <main className="pb-24 min-h-screen">
              {children}
            </main>
            <BottomNav />
          </div>
        </HydrationProvider>
      </body>
    </html>
  )
}
