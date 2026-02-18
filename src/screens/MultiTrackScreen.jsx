import { useState } from 'react'
import CircleProgress from '../components/CircleProgress'
import Icon from '../components/Icon'
import ScriptureSheet from '../components/ScriptureSheet'
import { todayStr } from '../utils'

const TRACK_COLORS = ['#6C63FF', '#f59e0b', '#10b981', '#f43f5e']
const TRACK_BG = [
  'rgba(108,99,255,0.12)', 'rgba(245,158,11,0.12)',
  'rgba(16,185,129,0.12)', 'rgba(244,63,94,0.12)'
]
const TRACK_BORDER = [
  'rgba(108,99,255,0.25)', 'rgba(245,158,11,0.25)',
  'rgba(16,185,129,0.25)', 'rgba(244,63,94,0.25)'
]

export default function MultiTrackScreen({ plan, onTogglePassage, onOpenNote, onDelete, subTab: externalSubTab, onSubTabChange }) {
  // Map parent's subTab values into local ones; 'notes' passes through, others default to 'today'
  const [localSubTab, setLocalSubTab] = useState(
    externalSubTab === 'notes' ? 'notes' : 'today'
  )
  const subTab = externalSubTab === 'notes' ? 'notes' : localSubTab
  const setSubTab = (v) => {
    setLocalSubTab(v)
    if (v === 'notes') onSubTabChange?.('notes')
    else onSubTabChange?.('plan')
  }
  const [scripturePassage, setScripturePassage] = useState(null)

  const monthData = plan.scheduleData  // NAVIGATORS_PLAN.months
  const currentMonth = plan.currentMonth || 1
  const monthIdx = currentMonth - 1
  const month = monthData[monthIdx]

  // Flatten all passages for overall progress
  const allKeys = monthData.flatMap(m =>
    m.days.flatMap((day, di) =>
      day.map((_, ti) => `m${m.month}-d${di + 1}-t${ti}`)
    )
  )
  const totalPassages = allKeys.length
  const donePassages = Object.keys(plan.completed || {}).length
  const overallPct = totalPassages > 0 ? Math.round((donePassages / totalPassages) * 100) : 0

  // Current month progress
  const monthKeys = month.days.flatMap((day, di) =>
    day.map((_, ti) => `m${currentMonth}-d${di + 1}-t${ti}`)
  )
  const monthDone = monthKeys.filter(k => plan.completed?.[k]).length
  const monthPct = Math.round((monthDone / monthKeys.length) * 100)

  // Find "today" reading = first incomplete day in current month
  const todayDayIdx = month.days.findIndex((day, di) =>
    day.some((_, ti) => !plan.completed?.[`m${currentMonth}-d${di + 1}-t${ti}`])
  )
  const todayDayNum = todayDayIdx >= 0 ? todayDayIdx + 1 : 25

  // Streak
  const streak = (() => {
    const dates = [...new Set(plan.completedDates || [])].sort().reverse()
    let s = 0
    const today = new Date(todayStr())
    for (let i = 0; i < dates.length; i++) {
      const exp = new Date(today); exp.setDate(today.getDate() - i)
      if (new Date(dates[i]).toDateString() === exp.toDateString()) s++
      else break
    }
    return s
  })()

  const handleToggle = (key) => {
    onTogglePassage(plan.id, key)
  }

  return (
    <div style={page} className="slide-up">

      {/* Header */}
      <div style={heroCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <p style={eyebrow}>Multi-Track Plan</p>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>{plan.name}</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
              4 tracks · 25 days/month · 12 months
            </p>
          </div>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <CircleProgress pct={overallPct} size={66} stroke={5} color="#a89fff" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#a89fff' }}>{overallPct}%</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
          {[
            { v: streak, l: 'Streak' },
            { v: `${currentMonth}/12`, l: 'Month' },
            { v: monthDone, l: 'Done' },
            { v: `${monthPct}%`, l: 'Progress' }
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: '10px 0', textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>{s.v}</div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 100, height: 4, overflow: 'hidden' }}>
          <div style={{ background: '#6C63FF', borderRadius: 100, height: '100%', width: `${overallPct}%`, transition: 'width 0.5s ease' }} />
        </div>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 6, textAlign: 'right', fontWeight: 600 }}>
          {donePassages} of {totalPassages} passages
        </p>
      </div>

      {/* Month selector */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {monthData.map((m, i) => {
          const mKeys = m.days.flatMap((day, di) => day.map((_, ti) => `m${m.month}-d${di + 1}-t${ti}`))
          const mDone = mKeys.filter(k => plan.completed?.[k]).length
          const mPct = Math.round((mDone / mKeys.length) * 100)
          const isCurrent = m.month === currentMonth
          return (
            <button
              key={m.month}
              onClick={() => onTogglePassage(plan.id, '__month__' + m.month)}
              style={{
                flexShrink: 0, padding: '7px 12px', borderRadius: 10,
                background: isCurrent ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.04)',
                border: isCurrent ? '1.5px solid rgba(108,99,255,0.4)' : '1.5px solid rgba(255,255,255,0.07)',
                color: isCurrent ? '#a89fff' : 'rgba(255,255,255,0.3)',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700,
                cursor: 'pointer', position: 'relative',
              }}
            >
              M{m.month}
              {mPct === 100 && (
                <span style={{ position: 'absolute', top: -4, right: -4, width: 10, height: 10, background: '#10b981', borderRadius: '50%', border: '1.5px solid #0E0E14' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Sub tabs */}
      <div style={segControl}>
        <button className={`seg-btn ${subTab === 'today' ? 'active' : ''}`} onClick={() => setSubTab('today')}>Today</button>
        <button className={`seg-btn ${subTab === 'month' ? 'active' : ''}`} onClick={() => setSubTab('month')}>Month {currentMonth}</button>
        <button className={`seg-btn ${subTab === 'notes' ? 'active' : ''}`} onClick={() => setSubTab('notes')}>Notes</button>
      </div>

      {/* TODAY TAB — current day's 4 passages */}
      {subTab === 'today' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Month {currentMonth} · Day {todayDayNum}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
              {month.tracks.join(' · ')}
            </span>
          </div>

          {todayDayIdx >= 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {month.days[todayDayIdx].map((passage, ti) => {
                const key = `m${currentMonth}-d${todayDayNum}-t${ti}`
                const isDone = !!plan.completed?.[key]
                const hasNote = !!(plan.notes?.[key]?.trim())
                const color = TRACK_COLORS[ti]
                const bg = TRACK_BG[ti]
                const border = TRACK_BORDER[ti]
                return (
                  <div key={ti} style={{ background: isDone ? 'rgba(255,255,255,0.025)' : bg, border: `1.5px solid ${isDone ? 'rgba(255,255,255,0.07)' : border}`, borderRadius: 16, padding: '14px 16px', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div
                        onClick={() => handleToggle(key)}
                        style={{
                          width: 24, height: 24, borderRadius: 8, flexShrink: 0, cursor: 'pointer',
                          border: isDone ? `1.5px solid ${color}` : `1.5px solid ${color}`,
                          background: isDone ? color : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}
                      >
                        {isDone && (
                          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color, textTransform: 'uppercase' }}>
                          Track {ti + 1}
                        </span>
                        <div style={{ fontSize: 16, fontWeight: 700, color: isDone ? 'rgba(255,255,255,0.3)' : '#fff', textDecoration: isDone ? 'line-through' : 'none' }}>
                          {passage.t} {passage.p}
                        </div>
                      </div>
                      {hasNote && <Icon name="edit" size={14} color={color} />}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setScripturePassage({ book: passage.t, reference: passage.p })
                      }}
                      style={scriptureBtn}
                    >
                      Scripture
                    </button>
                    <button
                      onClick={() => onOpenNote(plan.id, key, `${passage.t} ${passage.p}`)}
                      style={{ ...noteBtn, borderColor: isDone ? 'rgba(255,255,255,0.1)' : border, color: isDone ? 'rgba(255,255,255,0.25)' : color }}
                    >
                      {hasNote ? '✎ Edit note' : '+ Solitude note'}
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={emptyState}>
              <div style={{ fontSize: 28 }}>🎉</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Month {currentMonth} complete!</p>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>Move to month {Math.min(currentMonth + 1, 12)} to continue.</p>
            </div>
          )}
        </div>
      )}

      {/* MONTH TAB — all 25 days */}
      {subTab === 'month' && (
        <div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {month.tracks.map((t, ti) => (
              <div key={ti} style={{ display: 'flex', alignItems: 'center', gap: 5, background: TRACK_BG[ti], border: `1px solid ${TRACK_BORDER[ti]}`, borderRadius: 8, padding: '4px 10px' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: TRACK_COLORS[ti] }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: TRACK_COLORS[ti] }}>{t}</span>
              </div>
            ))}
          </div>

          {month.days.map((day, di) => {
            const dayNum = di + 1
            const dayKeys = day.map((_, ti) => `m${currentMonth}-d${dayNum}-t${ti}`)
            const dayDone = dayKeys.filter(k => plan.completed?.[k]).length
            const allDone = dayDone === 4
            const isToday = di === todayDayIdx

            return (
              <div key={di} style={{
                background: isToday ? 'rgba(108,99,255,0.07)' : 'rgba(255,255,255,0.02)',
                border: isToday ? '1.5px solid rgba(108,99,255,0.2)' : '1.5px solid rgba(255,255,255,0.05)',
                borderRadius: 14, padding: '12px 14px', marginBottom: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: isToday ? '#a89fff' : 'rgba(255,255,255,0.5)' }}>
                      Day {dayNum}
                    </span>
                    {isToday && <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(108,99,255,0.25)', color: '#a89fff', padding: '2px 8px', borderRadius: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Today</span>}
                    {allDone && <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>✓ Done</span>}
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{dayDone}/4</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {day.map((passage, ti) => {
                    const key = `m${currentMonth}-d${dayNum}-t${ti}`
                    const isDone = !!plan.completed?.[key]
                    return (
                      <div
                        key={ti}
                        onClick={() => handleToggle(key)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 7,
                          background: isDone ? 'rgba(255,255,255,0.03)' : TRACK_BG[ti],
                          border: `1px solid ${isDone ? 'rgba(255,255,255,0.06)' : TRACK_BORDER[ti]}`,
                          borderRadius: 10, padding: '7px 10px', cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        className="ripple"
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: 5, flexShrink: 0,
                          border: `1.5px solid ${TRACK_COLORS[ti]}`,
                          background: isDone ? TRACK_COLORS[ti] : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {isDone && (
                            <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: isDone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.75)', lineHeight: 1.3, textDecoration: isDone ? 'line-through' : 'none' }}>
                          {passage.t} {passage.p}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* NOTES TAB */}
      {subTab === 'notes' && (
        <div>
          {Object.entries(plan.notes || {}).filter(([, v]) => v?.trim()).length === 0 ? (
            <div style={emptyState}>
              <Icon name="edit" size={32} color="rgba(255,255,255,0.1)" />
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, fontStyle: 'italic', marginTop: 12 }}>
                No notes yet. Add reflections while reading.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(plan.notes || {}).filter(([, v]) => v?.trim()).map(([key, note]) => (
                <div key={key} style={noteCard} className="ripple"
                  onClick={() => onOpenNote(plan.id, key, key.replace(/m\d+-d\d+-t\d+/, s => {
                    const [, m, d, t] = s.match(/m(\d+)-d(\d+)-t(\d+)/)
                    return `Month ${m} · Day ${d} · Track ${+t + 1}`
                  }))}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#6C63FF', textTransform: 'uppercase' }}>
                      {key.replace(/m(\d+)-d(\d+)-t(\d+)/, (_, m, d, t) => `Month ${m} · Day ${d} · Track ${+t + 1}`)}
                    </span>
                    <Icon name="chevronRight" size={14} color="rgba(255,255,255,0.2)" />
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
                    {note.length > 110 ? note.slice(0, 110) + '…' : note}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab !== 'notes' && (
        <button style={deleteBtn} onClick={() => onDelete(plan.id)}>
          <Icon name="trash" size={14} color="#ff6b6b" /> Delete Plan
        </button>
      )}

      {/* Scripture modal */}
      {scripturePassage && (
        <ScriptureSheet
          passage={scripturePassage}
          onClose={() => setScripturePassage(null)}
        />
      )}
    </div>
  )
}

const page = { padding: 'clamp(18px, 3vw, 40px) clamp(18px, 4vw, 48px) 40px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: '100%', maxWidth: 780 }
const heroCard = {
  background: 'linear-gradient(135deg,#1a1440 0%,#110f2a 100%)',
  border: '1.5px solid rgba(108,99,255,0.18)', borderRadius: 24, padding: '18px',
}
const eyebrow = { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 5 }
const segControl = { display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, gap: 2 }
const noteBtn = {
  background: 'transparent', border: '1px solid',
  borderRadius: 8, cursor: 'pointer',
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700,
  padding: '5px 12px', width: '100%',
}
const scriptureBtn = {
  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
  borderRadius: 8, color: '#34d399', cursor: 'pointer',
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700,
  padding: '5px 12px', marginRight: 6, flexShrink: 0,
}
const deleteBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  width: '100%', padding: '14px',
  background: 'rgba(255,107,107,0.06)', border: '1.5px solid rgba(255,107,107,0.14)',
  borderRadius: 14, color: '#ff6b6b', cursor: 'pointer',
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, marginTop: 6,
}
const emptyState = { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: 8 }
const noteCard = {
  background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.07)',
  borderRadius: 16, padding: '14px 16px', cursor: 'pointer',
}