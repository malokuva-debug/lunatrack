'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Check } from 'lucide-react'
import { useCycleStore } from '@/store/cycleStore'
import { MOOD_EMOJIS, COMMON_SYMPTOMS } from '@/types'
import type { MoodType, PainLevel, EnergyLevel } from '@/types'
import { cn } from '@/lib/utils'
import { todayStr } from '@/lib/utils'

const MOODS: MoodType[] = ['happy', 'neutral', 'sad', 'anxious', 'irritable', 'energetic', 'tired']
const FLOWS = ['none', 'spotting', 'light', 'medium', 'heavy'] as const
const ENERGIES: EnergyLevel[] = ['low', 'medium', 'high']

interface SymptomLoggerProps {
  date?: string
  onSave?: () => void
}

export function SymptomLogger({ date = todayStr(), onSave }: SymptomLoggerProps) {
  const { saveSymptomLog, getSymptomLog } = useCycleStore()
  const existing = getSymptomLog(date)

  const [mood,        setMood]        = useState<MoodType | undefined>(existing?.mood)
  const [pain,        setPain]        = useState<PainLevel>(existing?.pain ?? 0)
  const [energy,      setEnergy]      = useState<EnergyLevel | undefined>(existing?.energy)
  const [flow,        setFlow]        = useState<typeof FLOWS[number]>(existing?.flow ?? 'none')
  const [symptoms,    setSymptoms]    = useState<string[]>(existing?.symptoms ?? [])
  const [notes,       setNotes]       = useState(existing?.notes ?? '')
  const [saved,       setSaved]       = useState(false)

  const toggleSymptom = (s: string) =>
    setSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  const handleSave = () => {
    saveSymptomLog({ date, mood, pain, energy, flow, symptoms, notes })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onSave?.()
  }

  return (
    <div className="space-y-6">
      {/* Date header */}
      <div className="text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest">Logging for</p>
        <p className="font-display text-lg font-semibold text-gray-800 dark:text-gray-100">
          {format(new Date(date + 'T00:00:00'), 'EEEE, MMM d')}
        </p>
      </div>

      {/* Mood */}
      <section>
        <Label>How are you feeling?</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(mood === m ? undefined : m)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border transition-all text-xs',
                mood === m
                  ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 shadow-luna'
                  : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400'
              )}
            >
              <span className="text-xl">{MOOD_EMOJIS[m]}</span>
              <span className="capitalize">{m}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Pain level */}
      <section>
        <Label>Pain level</Label>
        <div className="flex gap-2 mt-2">
          {([0, 1, 2, 3, 4, 5] as PainLevel[]).map((p) => (
            <button
              key={p}
              onClick={() => setPain(p)}
              className={cn(
                'flex-1 py-2.5 rounded-2xl text-sm font-semibold border transition-all',
                pain === p
                  ? 'bg-rose-500 border-rose-500 text-white shadow-luna'
                  : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400'
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-1 px-1">
          <span className="text-[10px] text-gray-400">None</span>
          <span className="text-[10px] text-gray-400">Severe</span>
        </div>
      </section>

      {/* Energy */}
      <section>
        <Label>Energy</Label>
        <div className="flex gap-2 mt-2">
          {ENERGIES.map((e) => (
            <button
              key={e}
              onClick={() => setEnergy(energy === e ? undefined : e)}
              className={cn(
                'flex-1 py-2.5 rounded-2xl text-sm font-semibold border capitalize transition-all',
                energy === e
                  ? 'bg-amber-400 border-amber-400 text-white'
                  : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400'
              )}
            >
              {e === 'low' ? '🪫' : e === 'medium' ? '🔋' : '⚡'} {e}
            </button>
          ))}
        </div>
      </section>

      {/* Flow */}
      <section>
        <Label>Flow</Label>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {FLOWS.map((f) => (
            <button
              key={f}
              onClick={() => setFlow(f)}
              className={cn(
                'px-3 py-1.5 rounded-2xl text-xs font-medium border capitalize transition-all',
                flow === f
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Symptoms */}
      <section>
        <Label>Symptoms</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {COMMON_SYMPTOMS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className={cn(
                'px-3 py-1.5 rounded-2xl text-xs font-medium border transition-all',
                symptoms.includes(s)
                  ? 'bg-purple-100 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                  : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section>
        <Label>Notes</Label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How are you really doing today…"
          rows={3}
          className="w-full mt-2 px-4 py-3 rounded-2xl text-sm bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 transition-all"
        />
      </section>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={cn(
          'w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2',
          saved
            ? 'bg-green-500 text-white'
            : 'bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-luna hover:shadow-luna-lg active:scale-[0.98]'
        )}
      >
        {saved ? (
          <><Check size={16} /> Saved!</>
        ) : (
          'Save Log'
        )}
      </button>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{children}</p>
  )
}
