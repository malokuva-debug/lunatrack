'use client'

import { create } from 'zustand'
import { format } from 'date-fns'
import type { CycleSettings, CycleStore, PeriodEntry, SymptomLog } from '@/types'
import { generateId } from '@/lib/utils'
import * as storage from '@/lib/storage'

// ─── Default settings ────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: CycleSettings = {
  averageCycleLength: 28,
  averagePeriodLength: 5,
  lastPeriodStart: format(new Date(), 'yyyy-MM-dd'),
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCycleStore = create<CycleStore>((set, get) => ({
  // ─── Initial state ────────────────────────────────────────────────────────
  settings: null,
  periodEntries: [],
  symptomLogs: [],
  isOnboarded: false,
  isDarkMode: false,

  // ─── Settings ─────────────────────────────────────────────────────────────
  saveSettings: (settings: CycleSettings) => {
    set({ settings, isOnboarded: true })
    storage.saveSettings(settings)
  },

  updateSettings: (partial: Partial<CycleSettings>) => {
    const current = get().settings ?? DEFAULT_SETTINGS
    const updated = { ...current, ...partial }
    set({ settings: updated })
    storage.saveSettings(updated)
  },

  // ─── Period entries ───────────────────────────────────────────────────────
  addPeriodEntry: (entryData) => {
    const entry: PeriodEntry = {
      ...entryData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ periodEntries: [...s.periodEntries, entry] }))
    storage.savePeriodEntry(entry)
    // Auto-update lastPeriodStart if this is more recent
    const settings = get().settings ?? DEFAULT_SETTINGS
    if (entryData.startDate >= settings.lastPeriodStart) {
      get().updateSettings({ lastPeriodStart: entryData.startDate })
    }
  },

  removePeriodEntry: (id: string) => {
    set((s) => ({ periodEntries: s.periodEntries.filter((e) => e.id !== id) }))
    storage.deletePeriodEntry(id)
  },

  // ─── Symptom logs ─────────────────────────────────────────────────────────
  saveSymptomLog: (logData) => {
    const existing = get().symptomLogs.find((l) => l.date === logData.date)
    const now = new Date().toISOString()
    const log: SymptomLog = {
      ...logData,
      id: existing?.id ?? generateId(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    }
    set((s) => ({
      symptomLogs: existing
        ? s.symptomLogs.map((l) => (l.date === log.date ? log : l))
        : [...s.symptomLogs, log],
    }))
    storage.saveSymptomLog(log)
  },

  getSymptomLog: (date: string) => {
    return get().symptomLogs.find((l) => l.date === date)
  },

  // ─── UI ───────────────────────────────────────────────────────────────────
  toggleDarkMode: () => {
    const next = !get().isDarkMode
    set({ isDarkMode: next })
    storage.savePreference('darkMode', next)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next)
    }
  },

  // ─── Hydration ────────────────────────────────────────────────────────────
  hydrate: async () => {
    const [settings, periods, symptoms, darkMode] = await Promise.all([
      storage.loadSettings(),
      storage.loadPeriodEntries(),
      storage.loadSymptomLogs(),
      storage.loadPreference<boolean>('darkMode'),
    ])
    set({
      settings: settings ?? null,
      periodEntries: periods,
      symptomLogs: symptoms,
      isOnboarded: !!settings,
      isDarkMode: darkMode ?? false,
    })
    if (darkMode && typeof document !== 'undefined') {
      document.documentElement.classList.add('dark')
    }
  },
}))
