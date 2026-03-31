import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { CycleSettings, PeriodEntry, SymptomLog } from '@/types'

// ─── DB Schema ────────────────────────────────────────────────────────────────

interface LunaDB extends DBSchema {
  settings: {
    key: string
    value: CycleSettings
  }
  periods: {
    key: string
    value: PeriodEntry
    indexes: { 'by-date': string }
  }
  symptoms: {
    key: string
    value: SymptomLog
    indexes: { 'by-date': string }
  }
  preferences: {
    key: string
    value: unknown
  }
}

const DB_NAME    = 'luna-cycle-db'
const DB_VERSION = 1

let _db: IDBPDatabase<LunaDB> | null = null

async function getDB(): Promise<IDBPDatabase<LunaDB>> {
  if (_db) return _db
  _db = await openDB<LunaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings')
      }
      // Periods store
      if (!db.objectStoreNames.contains('periods')) {
        const periodStore = db.createObjectStore('periods', { keyPath: 'id' })
        periodStore.createIndex('by-date', 'startDate')
      }
      // Symptoms store
      if (!db.objectStoreNames.contains('symptoms')) {
        const symStore = db.createObjectStore('symptoms', { keyPath: 'id' })
        symStore.createIndex('by-date', 'date')
      }
      // Preferences store
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences')
      }
    },
  })
  return _db
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function loadSettings(): Promise<CycleSettings | undefined> {
  try {
    const db = await getDB()
    return await db.get('settings', 'main')
  } catch { return undefined }
}

export async function saveSettings(settings: CycleSettings): Promise<void> {
  const db = await getDB()
  await db.put('settings', settings, 'main')
}

// ─── Preferences ──────────────────────────────────────────────────────────────

export async function loadPreference<T>(key: string): Promise<T | undefined> {
  try {
    const db = await getDB()
    return (await db.get('preferences', key)) as T | undefined
  } catch { return undefined }
}

export async function savePreference(key: string, value: unknown): Promise<void> {
  const db = await getDB()
  await db.put('preferences', value, key)
}

// ─── Period Entries ───────────────────────────────────────────────────────────

export async function loadPeriodEntries(): Promise<PeriodEntry[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('periods', 'by-date')
  } catch { return [] }
}

export async function savePeriodEntry(entry: PeriodEntry): Promise<void> {
  const db = await getDB()
  await db.put('periods', entry)
}

export async function deletePeriodEntry(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('periods', id)
}

// ─── Symptom Logs ─────────────────────────────────────────────────────────────

export async function loadSymptomLogs(): Promise<SymptomLog[]> {
  try {
    const db = await getDB()
    return await db.getAllFromIndex('symptoms', 'by-date')
  } catch { return [] }
}

export async function saveSymptomLog(log: SymptomLog): Promise<void> {
  const db = await getDB()
  await db.put('symptoms', log)
}

export async function getSymptomByDate(date: string): Promise<SymptomLog | undefined> {
  try {
    const db = await getDB()
    const all = await db.getAllFromIndex('symptoms', 'by-date', date)
    return all[0]
  } catch { return undefined }
}

// ─── Full data export ─────────────────────────────────────────────────────────

export async function exportAllData(): Promise<string> {
  const [settings, periods, symptoms] = await Promise.all([
    loadSettings(),
    loadPeriodEntries(),
    loadSymptomLogs(),
  ])
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    settings,
    periods,
    symptoms,
  }
  return JSON.stringify(payload, null, 2)
}
