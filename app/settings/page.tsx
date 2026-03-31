'use client'

import { useState } from 'react'
import { Moon, Sun, Download, Trash2, Bell, ChevronRight, Shield } from 'lucide-react'
import { useCycleStore } from '@/store/cycleStore'
import { exportAllData, downloadJSON } from '@/lib/storage'
import { downloadJSON as dl } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export default function SettingsPage() {
  const { settings, updateSettings, toggleDarkMode, isDarkMode } = useCycleStore()
  const [cycleLen, setCycleLen]   = useState(settings?.averageCycleLength ?? 28)
  const [periodLen, setPeriodLen] = useState(settings?.averagePeriodLength ?? 5)
  const [lastStart, setLastStart] = useState(settings?.lastPeriodStart ?? format(new Date(), 'yyyy-MM-dd'))
  const [saved, setSaved]         = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleSave = () => {
    updateSettings({ averageCycleLength: cycleLen, averagePeriodLength: periodLen, lastPeriodStart: lastStart })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const json = await exportAllData()
      dl(json, `luna-export-${format(new Date(), 'yyyy-MM-dd')}.json`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="px-4 pt-8 pb-4 space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>

      {/* Cycle settings */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Cycle</h2>
        <Card className="p-5 space-y-4">
          <SettingRow label="Last period started">
            <input
              type="date"
              value={lastStart}
              max={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setLastStart(e.target.value)}
              className="text-sm bg-transparent text-rose-500 font-medium focus:outline-none"
            />
          </SettingRow>

          <SettingRow label="Average cycle length">
            <Stepper
              value={cycleLen}
              onChange={setCycleLen}
              min={21} max={45}
              unit="days"
            />
          </SettingRow>

          <SettingRow label="Average period length">
            <Stepper
              value={periodLen}
              onChange={setPeriodLen}
              min={2} max={10}
              unit="days"
            />
          </SettingRow>

          <button
            onClick={handleSave}
            className={cn(
              'w-full py-3 rounded-2xl text-sm font-semibold transition-all',
              saved
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-luna active:scale-[0.98]'
            )}
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </Card>
      </section>

      {/* Appearance */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Appearance</h2>
        <Card className="p-1">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon size={18} className="text-gray-500" /> : <Sun size={18} className="text-amber-500" />}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <div className={cn(
              'w-11 h-6 rounded-full transition-colors flex items-center px-0.5',
              isDarkMode ? 'bg-rose-500 justify-end' : 'bg-gray-200 justify-start'
            )}>
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </div>
          </button>
        </Card>
      </section>

      {/* Data */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Data</h2>
        <Card className="p-1 space-y-0">
          <ActionRow
            icon={<Download size={18} className="text-sky-500" />}
            label="Export Data (JSON)"
            sublabel="Download all your cycle data"
            onClick={handleExport}
            loading={exporting}
          />
          <ActionRow
            icon={<Shield size={18} className="text-green-500" />}
            label="Privacy"
            sublabel="All data stays on your device"
          />
        </Card>
      </section>

      {/* About */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">About</h2>
        <Card className="p-5 text-center space-y-1">
          <p className="font-display text-gray-700 dark:text-gray-200 font-semibold">Luna Cycle Tracker</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Version 1.0.0 · Built with ❤️</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
            Luna is a private, offline-first period tracker. No data is ever sent to any server. Everything is stored locally on your device.
          </p>
        </Card>
      </section>
    </div>
  )
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      <div>{children}</div>
    </div>
  )
}

function Stepper({ value, onChange, min, max, unit }: {
  value: number; onChange: (v: number) => void; min: number; max: number; unit: string
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm flex items-center justify-center active:scale-95 transition-transform"
      >−</button>
      <span className="text-sm font-semibold text-rose-500 w-16 text-center">{value} {unit}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm flex items-center justify-center active:scale-95 transition-transform"
      >+</button>
    </div>
  )
}

function ActionRow({ icon, label, sublabel, onClick, loading }: {
  icon: React.ReactNode; label: string; sublabel?: string; onClick?: () => void; loading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick || loading}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors disabled:opacity-70 text-left"
    >
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
        {sublabel && <p className="text-xs text-gray-400 dark:text-gray-500">{sublabel}</p>}
      </div>
      {loading && <div className="w-4 h-4 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />}
      {onClick && !loading && <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />}
    </button>
  )
}
