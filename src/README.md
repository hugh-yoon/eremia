# Eremia — ἐρημία

> *"He went up on the mountain by himself to pray."* — Matthew 14:23

A Bible reading plan tracker PWA. Solitude in the Word.

---

## Getting Started in Cursor

### 1. Prerequisites

Make sure you have **Node.js 18+** installed.
Check with: `node -v`

If you don't have it, download from [nodejs.org](https://nodejs.org).

---

### 2. Open the project

Open this folder in Cursor:

```
File → Open Folder → select the `eremia` folder
```

---

### 3. Install dependencies

Open the terminal in Cursor (`Ctrl+`` ` or `Cmd+`` `):

```bash
npm install
```

---

### 4. Run the dev server

```bash
npm run dev
```

Visit **http://localhost:5173** in your browser.

The app hot-reloads as you edit files.

---

### 5. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder — this is what you deploy.

---

## Project Structure

```
eremia/
├── public/
│   ├── favicon.svg          # Browser favicon
│   └── icons/
│       ├── icon-192.png     # PWA icon (Android)
│       ├── icon-512.png     # PWA icon (splash screen)
│       └── apple-touch-icon.png  # iOS home screen icon
│
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # Root component + state management
│   ├── index.css            # Global styles
│   ├── data.js              # Bible books + chapter counts
│   ├── utils.js             # Helper functions
│   ├── useStorage.js        # localStorage persistence hook
│   │
│   ├── components/
│   │   ├── Icon.jsx         # SVG icon system
│   │   ├── CircleProgress.jsx
│   │   ├── Toast.jsx
│   │   └── JournalSheet.jsx # Bottom sheet for notes
│   │
│   └── screens/
│       ├── HomeScreen.jsx   # Plans list
│       ├── CreateScreen.jsx # New plan wizard
│       └── PlanScreen.jsx   # Active plan + reading list
│
├── index.html
├── vite.config.js           # Vite + PWA config
└── package.json
```

---

## Deploying (Free options)

### Option A — Vercel (Recommended, easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Vercel auto-detects Vite — just click **Deploy**
4. Done. You get a live HTTPS URL instantly.

### Option B — Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy**

### Option C — Deploy manually

```bash
npm run build
```

Upload the `dist/` folder to any static host (GitHub Pages, Cloudflare Pages, etc.)

---

## Installing as a Mobile App (PWA)

Once deployed to a live HTTPS URL:

### iPhone / iPad
1. Open the URL in **Safari**
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **Add** — Eremia appears as an app icon

### Android
1. Open the URL in **Chrome**
2. Tap the **three dots menu**
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **Install**

---

## Replacing the App Icons

The current icons are generated placeholders. To use custom icons:

1. Design a 1024×1024 PNG icon
2. Use [realfavicongenerator.net](https://realfavicongenerator.net) to generate all sizes
3. Replace the files in `public/icons/`

---

## Next Steps / Ideas

- [ ] User accounts + cloud sync (Supabase)
- [ ] Push notifications for daily reading reminders
- [ ] Bible verse lookup integration (Bible API)
- [ ] Share prayer requests (connect to church community)
- [ ] React Native / Expo port for App Store distribution
- [ ] Streak leaderboard for church groups
