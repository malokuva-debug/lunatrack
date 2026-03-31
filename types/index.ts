// ─── Core Data Types ─────────────────────────────────────────────────────────

export type CyclePhase =
  | 'menstrual'
  | 'follicular'
  | 'ovulation'
  | 'luteal'
  | 'pms'

export interface CycleSettings {
  averageCycleLength: number   // default 28
  averagePeriodLength: number  // default 5
  lastPeriodStart: string      // ISO date string YYYY-MM-DD
}

export interface PeriodEntry {
  id: string
  startDate: string            // ISO date YYYY-MM-DD
  endDate: string              // ISO date YYYY-MM-DD
  notes?: string
  createdAt: string
}

export type MoodType = 'happy' | 'neutral' | 'sad' | 'anxious' | 'irritable' | 'energetic' | 'tired'
export type PainLevel = 0 | 1 | 2 | 3 | 4 | 5
export type EnergyLevel = 'low' | 'medium' | 'high'

export interface SymptomLog {
  id: string
  date: string                 // ISO date YYYY-MM-DD
  mood?: MoodType
  pain?: PainLevel
  energy?: EnergyLevel
  flow?: 'none' | 'spotting' | 'light' | 'medium' | 'heavy'
  symptoms?: string[]          // e.g. ['cramps', 'headache', 'bloating']
  notes?: string
  createdAt: string
  updatedAt: string
}

// ─── Computed / Derived Types ─────────────────────────────────────────────────

export interface CyclePrediction {
  nextPeriodStart: string
  nextPeriodEnd: string
  ovulationDay: string
  fertileWindowStart: string
  fertileWindowEnd: string
  pmsStart: string
}

export interface DayInfo {
  date: string
  phase: CyclePhase
  dayOfCycle: number
  isPeriodDay: boolean
  isFertile: boolean
  isOvulation: boolean
  isPMS: boolean
  symptomLog?: SymptomLog
  prediction?: CyclePrediction
}

// ─── Store Types ──────────────────────────────────────────────────────────────

export interface CycleStore {
  // State
  settings: CycleSettings | null
  periodEntries: PeriodEntry[]
  symptomLogs: SymptomLog[]
  isOnboarded: boolean
  isDarkMode: boolean

  // Settings actions
  saveSettings: (settings: CycleSettings) => void
  updateSettings: (partial: Partial<CycleSettings>) => void

  // Period actions
  addPeriodEntry: (entry: Omit<PeriodEntry, 'id' | 'createdAt'>) => void
  removePeriodEntry: (id: string) => void

  // Symptom actions
  saveSymptomLog: (log: Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>) => void
  getSymptomLog: (date: string) => SymptomLog | undefined

  // UI actions
  toggleDarkMode: () => void

  // Hydration
  hydrate: () => void
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface NavItem {
  href: string
  label: string
  icon: string
}

export const CYCLE_PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: '#f43f5e',
  follicular: '#ec4899',
  ovulation: '#0ea5e9',
  luteal: '#f59e0b',
  pms: '#a855f7',
}

export const CYCLE_PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Menstrual',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal',
  pms: 'PMS',
}

export const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  anxious: '😰',
  irritable: '😤',
  energetic: '⚡',
  tired: '😴',
}

export const COMMON_SYMPTOMS = [
  'Cramps', 'Headache', 'Bloating', 'Breast tenderness',
  'Back pain', 'Nausea', 'Fatigue', 'Acne', 'Insomnia',
  'Food cravings', 'Spotting', 'Discharge',
]
