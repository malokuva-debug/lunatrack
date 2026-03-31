# 🌙 Luna – Cycle Tracker

A **production-ready, mobile-first Progressive Web App** for menstrual cycle tracking. Built with Next.js 14, Tailwind CSS, TypeScript, and IndexedDB for fully offline, private-by-default storage.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🩸 **Period Tracking** | Log period start, length, cycle length |
| 🔮 **Smart Predictions** | Next period, ovulation, fertile window, PMS phase |
| 📅 **Calendar View** | Monthly view with color-coded phases |
| 🏠 **Dashboard** | Cycle ring, today's phase, upcoming events |
| 📝 **Symptom Logging** | Mood, pain, energy, flow, custom symptoms |
| 📴 **Offline-First** | Full PWA with IndexedDB – works without internet |
| 🌙 **Dark Mode** | Full dark mode support |
| 📦 **Data Export** | Export all data as JSON |
| 🔒 **100% Private** | Everything stored locally, no tracking |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/luna-cycle-tracker.git
cd luna-cycle-tracker

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 PWA Setup

The app is PWA-ready out of the box. To install on mobile:

1. Open the app in Chrome/Safari on your phone
2. Tap the "Share" button → "Add to Home Screen"
3. Or tap the install banner that appears in the app

### Generating App Icons

```bash
# With node-canvas installed:
npm install canvas --save-dev
node scripts/generate-icons.js

# Without canvas, use any online tool:
# https://realfavicongenerator.net
# Place generated icons in /public/icons/
```

---

## 🌐 Deploy to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/luna-cycle-tracker)

### Manual deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

No environment variables are required for the basic app (all local-only).

---

## 🔧 Configuration

### Enabling Supabase (Optional Cloud Sync)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema (see `supabase/schema.sql` if included)
3. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. The app will automatically detect Supabase and enable cloud sync.
   If not configured, it falls back to local-only mode.

---

## 🗂️ Project Structure

```
luna-cycle-tracker/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout + PWA meta
│   ├── page.tsx            # Home / Dashboard
│   ├── calendar/page.tsx   # Calendar view
│   ├── log/page.tsx        # Symptom logger
│   ├── settings/page.tsx   # Settings + data export
│   └── globals.css         # Global styles
│
├── components/
│   ├── dashboard/          # Home screen components
│   │   ├── CycleRing.tsx
│   │   ├── PhaseInsightCard.tsx
│   │   └── UpcomingEvents.tsx
│   ├── calendar/
│   │   ├── CalendarGrid.tsx
│   │   └── DayDetailSheet.tsx
│   ├── log/
│   │   └── SymptomLogger.tsx
│   ├── ui/
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── BottomNav.tsx
│   └── Onboarding.tsx
│
├── lib/
│   ├── cycleCalculations.ts   # Core cycle math
│   ├── storage.ts             # IndexedDB layer
│   └── utils.ts               # Shared helpers
│
├── hooks/
│   ├── useCycleData.ts        # Derived cycle data hook
│   └── usePWAInstall.ts       # PWA install prompt
│
├── store/
│   └── cycleStore.ts          # Zustand global store
│
├── types/
│   └── index.ts               # TypeScript definitions
│
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw-custom.js           # Push notification handler
│   └── icons/                 # App icons (add your own)
│
├── scripts/
│   └── generate-icons.js      # Icon generation helper
│
├── next.config.js             # Next.js + PWA config
├── tailwind.config.js         # Tailwind theme
└── tsconfig.json
```

---

## 🧮 Cycle Calculations

```
Ovulation day  = lastPeriodStart + (cycleLength - 14)
Fertile window = ovulationDay - 5 → ovulationDay
PMS phase      = ovulationDay + 1 → nextPeriodStart - 1
Next period    = lastPeriodStart + cycleLength
```

Phases:
- **Menstrual** – Days 1 → periodLength
- **Follicular** – Days periodLength+1 → fertileWindowStart-1
- **Ovulation** – Fertile window through ovulation day
- **Luteal** – Post-ovulation through cycleLength-3
- **PMS** – Last 3 days before next period

---

## 🌍 Internationalization (i18n Ready)

The project is structured for multi-language support. To add a language:

1. Create `/locales/[lang].json` with translated strings
2. Use `next-intl` or a similar library
3. The `PHASE_DESCRIPTIONS`, `PHASE_LABELS` etc. in `lib/cycleCalculations.ts` are the main string sources

---

## 📋 Tech Stack

- **Framework** – Next.js 14 (App Router)
- **Language** – TypeScript
- **Styling** – Tailwind CSS with custom design tokens
- **State** – Zustand
- **Storage** – IndexedDB via `idb`
- **Dates** – `date-fns`
- **PWA** – `next-pwa` (Workbox-based)
- **Icons** – Lucide React
- **Fonts** – Fraunces (display) + DM Sans (body)

---

## 📄 License

MIT – use freely, build something great.

---

*Luna is a private health app. No data is ever sent to external servers unless you explicitly configure Supabase.*
