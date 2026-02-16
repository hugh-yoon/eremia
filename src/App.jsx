import { useState } from 'react'
import { useStorage } from './useStorage'
import { todayStr } from './utils'
import HomeScreen from './screens/HomeScreen'
import CreateScreen from './screens/CreateScreen'
import PlanScreen from './screens/PlanScreen'
import MultiTrackScreen from './screens/MultiTrackScreen'
import JournalSheet from './components/JournalSheet'
import Toast from './components/Toast'
import Icon from './components/Icon'

export default function App() {
  const [plans, setPlans] = useStorage('eremia-plans', [])
  const [activePlanId, setActivePlanId] = useStorage('eremia-active-plan', null)
  const [tab, setTab] = useState('home')
  const [planSubTab, setPlanSubTab] = useState('reading') // 'reading' | 'notes' | 'streak'
  const [journalTarget, setJournalTarget] = useState(null) // { planId, chapterKey, label }
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const activePlan = plans.find(p => p.id === activePlanId) || null

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreated = (newPlan) => {
    setPlans(prev => [...prev, newPlan])
    setActivePlanId(newPlan.id)
    setTab('plan')
    showToast('Plan created ✦')
  }

  const handleSelectPlan = (planId) => {
    setActivePlanId(planId)
    setTab('plan')
  }

  // For custom plans: toggle chapter key
  const handleToggleChapter = (planId, key) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p
      const completed = { ...p.completed }
      const completedDates = [...(p.completedDates || [])]
      if (completed[key]) {
        delete completed[key]
      } else {
        completed[key] = todayStr()
        completedDates.push(todayStr())
      }
      return { ...p, completed, completedDates }
    }))
  }

  // For multi-track plans: toggle passage key OR switch month (key starts with __month__)
  const handleTogglePassage = (planId, key) => {
    if (key.startsWith('__month__')) {
      const monthNum = parseInt(key.replace('__month__', ''))
      setPlans(prev => prev.map(p =>
        p.id !== planId ? p : { ...p, currentMonth: monthNum }
      ))
      return
    }
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p
      const completed = { ...p.completed }
      const completedDates = [...(p.completedDates || [])]
      if (completed[key]) {
        delete completed[key]
      } else {
        completed[key] = todayStr()
        completedDates.push(todayStr())
      }
      return { ...p, completed, completedDates }
    }))
  }

  const handleSaveNote = (planId, key, text) => {
    setPlans(prev => prev.map(p =>
      p.id !== planId ? p : { ...p, notes: { ...p.notes, [key]: text } }
    ))
    showToast('Note saved')
  }

  const handleDeletePlan = (planId) => {
    if (!window.confirm('Delete this plan? This cannot be undone.')) return
    const rest = plans.filter(p => p.id !== planId)
    setPlans(rest)
    setActivePlanId(rest.length > 0 ? rest[0].id : null)
    setTab('home')
    showToast('Plan deleted')
  }

  const handleOpenNote = (planId, key, label) => {
    setJournalTarget({ planId, chapterKey: key, label })
  }

  // ── Tab bar ──────────────────────────────────────────────────────────────

  const tabItems = [
    { id: 'home',   icon: 'home',  label: 'Plans'   },
    { id: 'plan',   icon: 'book',  label: 'Reading' },
    { id: '_fab',   icon: 'plus',  label: ''        },
    { id: '_notes', icon: 'edit',  label: 'Notes'   },
  ]

  const handleTabPress = (id) => {
    if (id === 'home')   { setTab('home') }
    if (id === 'plan')   { setTab(activePlan ? 'plan' : 'home'); setPlanSubTab('reading') }
    if (id === 'create') { setTab('create') }
    if (id === '_fab')   { setTab('create') }
    if (id === '_notes') { setTab(activePlan ? 'plan' : 'home'); setPlanSubTab('notes') }
  }

  // ── Shared screen content ────────────────────────────────────────────────

  const screenContent = (
    <>
      {tab === 'home' && (
        <HomeScreen
          plans={plans}
          activePlanId={activePlanId}
          onSelectPlan={handleSelectPlan}
          onNewPlan={() => setTab('create')}
        />
      )}
      {tab === 'create' && (
        <CreateScreen
          onCreated={handleCreated}
          onBack={() => setTab('home')}
        />
      )}
      {tab === 'plan' && activePlan && (
        activePlan.type === 'multi-track' ? (
          <MultiTrackScreen
            plan={activePlan}
            onTogglePassage={handleTogglePassage}
            onOpenNote={handleOpenNote}
            onDelete={handleDeletePlan}
            subTab={planSubTab}
            onSubTabChange={setPlanSubTab}
          />
        ) : (
          <PlanScreen
            plan={activePlan}
            onToggleChapter={handleToggleChapter}
            onOpenNote={(planId, key) => handleOpenNote(planId, key, key.replace(/-(\d+)$/, ' · Chapter $1'))}
            onDelete={handleDeletePlan}
            subTab={planSubTab}
            onSubTabChange={setPlanSubTab}
          />
        )
      )}
      {tab === 'plan' && !activePlan && (
        <div style={styles.emptyPlan}>
          <Icon name="book" size={40} color="rgba(255,255,255,0.1)" />
          <p style={{ color: 'rgba(255,255,255,0.3)', marginTop: 16 }}>No plan selected.</p>
          <button style={styles.ghostBtn} onClick={() => setTab('home')}>Go to Plans</button>
        </div>
      )}
    </>
  )

  // ── Sidebar nav items (desktop) ──────────────────────────────────────────

  const navItems = [
    { id: 'home',    icon: 'home',  label: 'Plans'    },
    { id: 'plan',    icon: 'book',  label: 'Reading'  },
    { id: 'create',  icon: 'plus',  label: 'New Plan' },
    { id: '_notes',  icon: 'edit',  label: 'Notes'    },
  ]

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={styles.shell}>
      <Toast message={toast} />

      {journalTarget && (
        <JournalSheet
          plan={plans.find(p => p.id === journalTarget.planId)}
          chapterKey={journalTarget.chapterKey}
          label={journalTarget.label}
          onSave={(text) => {
            handleSaveNote(journalTarget.planId, journalTarget.chapterKey, text)
            setJournalTarget(null)
          }}
          onClose={() => setJournalTarget(null)}
        />
      )}

      {/* ── Desktop layout: sidebar + content ── */}
      <div className="sidebar-nav" style={styles.sidebar}>
        {/* Wordmark */}
        <div style={styles.sidebarBrand}>
          <span style={styles.sidebarLogo}>Eremia</span>
          <span style={styles.sidebarGreek}>ἐρημία</span>
        </div>

        {/* Nav links */}
        <nav style={styles.sidebarNav}>
          {navItems.map(({ id, icon, label }) => {
            const isActive =
              id === 'home'   ? tab === 'home' :
              id === 'plan'   ? tab === 'plan' && planSubTab === 'reading' :
              id === 'create' ? tab === 'create' :
              id === '_notes' ? tab === 'plan' && planSubTab === 'notes' :
              false
            return (
              <button
                key={id}
                style={{
                  ...styles.sidebarBtn,
                  background: isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
                  color: isActive ? '#a89fff' : 'rgba(255,255,255,0.4)',
                  borderLeft: isActive ? '2px solid #6C63FF' : '2px solid transparent',
                }}
                onClick={() => handleTabPress(id)}
                className="ripple"
              >
                <Icon name={icon} size={18} color={isActive ? '#a89fff' : 'rgba(255,255,255,0.4)'} />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Bottom verse */}
        <p style={styles.sidebarVerse}>
          "He went up on the mountain by himself to pray."
          <br /><span style={{ color: 'rgba(255,255,255,0.2)' }}>Matthew 14:23</span>
        </p>
      </div>

      {/* ── Main content area ── */}
      <div style={styles.main}>
        <div style={styles.screen} className="screen-content">
          {screenContent}
        </div>

        {/* ── Mobile bottom tab bar ── */}
        <div className="tab-bar-wrap" style={styles.tabBar}>
          {tabItems.map(({ id, icon, label }) => {
            if (id === '_fab') {
              return (
                <button key={id} className="tab-bar-btn" onClick={() => handleTabPress(id)}>
                  <div style={{ ...styles.fab, background: tab === 'create' ? '#5a52e0' : '#6C63FF' }}>
                    <Icon name="plus" size={20} color="#fff" />
                  </div>
                </button>
              )
            }
            const isActive =
              id === 'home'   ? tab === 'home' :
              id === 'plan'   ? tab === 'plan' && planSubTab === 'reading' :
              id === '_notes' ? tab === 'plan' && planSubTab === 'notes' :
              false
            return (
              <button
                key={id}
                className={`tab-bar-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleTabPress(id)}
              >
                <Icon name={icon} size={22} color={isActive ? '#6C63FF' : 'rgba(255,255,255,0.3)'} />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const styles = {
  // Full-bleed shell — row on desktop, column on mobile
  shell: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    width: '100%',
    background: '#0E0E14',
    overflow: 'hidden',
  },

  // ── Sidebar (desktop only, shown via CSS) ──
  sidebar: {
    flexDirection: 'column',
    width: 220,
    minWidth: 220,
    height: '100vh',
    background: 'rgba(10,8,20,0.98)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    padding: '32px 0 24px',
    flexShrink: 0,
  },
  sidebarBrand: {
    display: 'flex', alignItems: 'baseline', gap: 8,
    padding: '0 24px 32px',
  },
  sidebarLogo: {
    fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em',
  },
  sidebarGreek: {
    fontSize: 12, color: '#6C63FF', fontWeight: 600, letterSpacing: '0.05em',
  },
  sidebarNav: {
    display: 'flex', flexDirection: 'column', gap: 2, flex: 1,
  },
  sidebarBtn: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 24px',
    border: 'none', cursor: 'pointer', borderRadius: 0,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14, fontWeight: 600,
    textAlign: 'left', transition: 'all 0.15s',
  },
  sidebarVerse: {
    padding: '0 24px',
    fontSize: 11, lineHeight: 1.7,
    color: 'rgba(255,255,255,0.18)',
    fontStyle: 'italic',
  },

  // ── Main area — fills remaining space ──
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },

  // Scrollable content
  screen: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'linear-gradient(160deg, #13111f 0%, #0E0E14 55%)',
    width: '100%',
  },

  // Mobile bottom tab bar
  tabBar: {
    alignItems: 'stretch',
    background: 'rgba(12,10,22,0.97)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    flexShrink: 0,
  },
  fab: {
    width: 46, height: 46, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 18px rgba(108,99,255,0.5)',
    marginBottom: 4, transition: 'background 0.15s',
  },
  emptyPlan: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    height: '100%', gap: 12,
  },
  ghostBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 16, color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14, fontWeight: 600,
    padding: '12px 24px', marginTop: 8,
  },
}