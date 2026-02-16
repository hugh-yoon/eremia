# Eremia — ἐρημία

> _"He went up on the mountain by himself to pray."_
> — Matthew 14:23

**[→ Try it live](https://eremia-opal.vercel.app/)**

**Eremia** is a Bible reading plan tracker built for people who take their time in the Word seriously. No accounts required, no ads, no noise — just you, the Scripture, and a simple tool to help you stay faithful to the practice.

The name comes from the Greek word for _solitude_ — the same word used to describe the places Jesus withdrew to pray.

---

## What it does

Eremia lets you build and track structured Bible reading plans, including support for plans that read from multiple books simultaneously — the way serious readers have always studied Scripture.

**Custom plans**
Build any plan from scratch. Choose the books you want to read, set a duration (1 month to 2 years), and Eremia calculates your daily chapter count. Progress is tracked chapter by chapter, with a journaling space for notes and reflections on each passage.

**Navigators Bible Reading Plan**
The classic one-year plan from The Navigators, included in full. Four simultaneous reading tracks every day — a Gospel, an Epistle, Psalms or Proverbs, and an Old Testament book — covering the whole Bible in 300 readings, leaving free days each month for catch-up and deeper study.

**Across every screen**
Designed mobile-first as a Progressive Web App, but fully responsive — sidebar navigation on desktop, bottom tab bar on mobile. Install it to your home screen on iOS or Android and it behaves like a native app.

---

## Features

- Custom reading plan builder with book selection and duration presets
- Full Navigators Bible Reading Plan (12 months × 25 days × 4 tracks)
- Per-chapter and per-passage completion tracking
- Solitude Notes — a private journal for each passage you read
- Fully offline after first load (PWA with service worker caching)
- No account, no server, no data collection — everything stays on your device

---

## Stack

| Layer       | Choice                      | Why                                            |
| ----------- | --------------------------- | ---------------------------------------------- |
| UI          | React 18 + Vite             | Fast builds, hot reload, minimal config        |
| Styling     | Plain CSS + inline styles   | No runtime overhead, full control              |
| Persistence | `localStorage`              | Zero backend, works offline, private by design |
| PWA         | `vite-plugin-pwa` + Workbox | Install to home screen, offline caching        |
| Font        | Plus Jakarta Sans           | Clean, modern, legible at small sizes          |

No backend. No database. No authentication. The app is a static bundle — it can be hosted anywhere for free.

---

## Running locally

You'll need Node.js 18 or later.

```bash
git clone https://github.com/hughyoon/eremia.git
cd eremia
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

**Build for production**

```bash
npm run build
npm run preview   # preview the production build locally
```

The `dist/` folder is the deployable output — drop it on Vercel, Netlify, Cloudflare Pages, or any static host.

---

## Project structure

```
src/
├── App.jsx                  # Root layout, state, navigation
├── index.css                # Global styles, responsive breakpoints
├── data.js                  # Bible book names and chapter counts
├── navigatorsPlan.js        # Full Navigators plan data (300 days)
├── utils.js                 # Streak, progress, chapter helpers
├── useStorage.js            # localStorage persistence hook
│
├── screens/
│   ├── HomeScreen.jsx       # Plan list
│   ├── CreateScreen.jsx     # New plan wizard
│   ├── PlanScreen.jsx       # Custom plan reading view
│   └── MultiTrackScreen.jsx # Navigators plan reading view
│
└── components/
    ├── Icon.jsx             # Inline SVG icon system
    ├── CircleProgress.jsx   # Circular progress ring
    ├── Toast.jsx            # Notification toasts
    └── JournalSheet.jsx     # Bottom sheet note editor
```

---

## Installing as a mobile app (PWA)

**iPhone / iPad** — open [eremia-opal.vercel.app](https://eremia-opal.vercel.app/) in Safari → Share → Add to Home Screen

**Android** — open in Chrome → three-dot menu → Add to Home Screen

---

## Roadmap

- [ ] iCloud / cloud sync across devices
- [ ] Daily reading reminders (push notifications)
- [ ] Native iOS / macOS app via SwiftUI
- [ ] Community plans (share plans with your church)
- [ ] Bible API integration for in-app reading

---

## License

MIT — free to use, fork, and adapt.

---

_Built with the conviction that the best Bible app is one that gets out of the way._
