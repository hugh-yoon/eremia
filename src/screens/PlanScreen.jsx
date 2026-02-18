import { useState } from 'react'
import CircleProgress from '../components/CircleProgress'
import Icon from '../components/Icon'
import ScriptureSheet from '../components/ScriptureSheet'
import { todayStr } from '../utils'

export default function PlanScreen({ plan, onToggleChapter, onOpenNote, onDelete, subTab = 'reading', onSubTabChange }) {
  const setSubTab = (v) => onSubTabChange?.(v)
  const [expandedBook, setExpandedBook] = useState(null)
  const [scripturePassage, setScripturePassage] = useState(null)

  const total = plan.chapters.length
  const done = Object.keys(plan.completed || {}).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const remaining = total - done
  const daysLeft = Math.ceil(remaining / plan.chaptersPerDay)

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

  // Group chapters by book
  const grouped = plan.chapters.reduce((g, ch) => {
    if (!g[ch.book]) g[ch.book] = []
    g[ch.book].push(ch)
    return g
  }, {})

  const notedChapters = Object.entries(plan.notes || {}).filter(([, v]) => v?.trim())

  return (
    <div style={page} className="slide-up">
      {/* Hero */}
      <div style={heroCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 6 }}>
              Active Plan
            </p>
            <h2 style={{ fontSize: 21, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>{plan.name}</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
              {plan.selectedDuration} · {plan.chaptersPerDay} ch/day
            </p>
          </div>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <CircleProgress pct={pct} size={72} stroke={6} color="#a89fff" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#a89fff' }}>{pct}%</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
          {[{ v: streak, l: 'Streak' }, { v: done, l: 'Done' }, { v: daysLeft, l: 'Days Left' }].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: '12px 0', textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{s.v}</div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 100, height: 4, overflow: 'hidden' }}>
          <div style={{ background: '#a89fff', borderRadius: 100, height: '100%', width: `${pct}%`, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{done} of {total}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{remaining} remaining</span>
        </div>
      </div>

      {/* Sub tabs */}
      <div style={segControl}>
        <button className={`seg-btn ${subTab === 'reading' ? 'active' : ''}`} onClick={() => setSubTab('reading')}>Reading</button>
        <button className={`seg-btn ${subTab === 'notes' ? 'active' : ''}`} onClick={() => setSubTab('notes')}>
          Notes{notedChapters.length > 0 ? ` (${notedChapters.length})` : ''}
        </button>
      </div>

      {/* Reading tab */}
      {subTab === 'reading' && (
        <div>
          {Object.entries(grouped).map(([book, chapters]) => {
            const bookDone = chapters.filter(ch => plan.completed?.[ch.key]).length
            const bookPct = Math.round((bookDone / chapters.length) * 100)
            const isExp = expandedBook === book

            return (
              <div key={book} style={bookCard}>
                <div className="book-row ripple" onClick={() => setExpandedBook(isExp ? null : book)}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{book}</span>
                      {bookPct === 100 && (
                        <span style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.22)', borderRadius: 6, fontSize: 10, fontWeight: 700, padding: '2px 8px' }}>
                          ✓ Done
                        </span>
                      )}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 100, height: 3, maxWidth: 120, overflow: 'hidden' }}>
                      <div style={{ background: '#6C63FF', borderRadius: 100, height: '100%', width: `${bookPct}%` }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{bookDone}/{chapters.length}</span>
                    <div style={{ transform: isExp ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                      <Icon name="chevronDown" size={16} color="rgba(255,255,255,0.25)" />
                    </div>
                  </div>
                </div>

                {isExp && (
                  <div style={{ padding: '0 16px 10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {chapters.map(ch => {
                      const isDone = !!plan.completed?.[ch.key]
                      const hasNote = !!(plan.notes?.[ch.key]?.trim())
                      return (
                        <div key={ch.key} className="chapter-item" onClick={() => onToggleChapter(plan.id, ch.key)}>
                          <div style={{
                            width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                            border: isDone ? '1.5px solid #6C63FF' : '1.5px solid rgba(255,255,255,0.18)',
                            background: isDone ? '#6C63FF' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                          }}>
                            {isDone && (
                              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <span style={{
                            flex: 1, fontSize: 14, fontWeight: 500,
                            color: isDone ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.85)',
                            textDecoration: isDone ? 'line-through' : 'none',
                          }}>
                            Chapter {ch.chapter}
                          </span>
                          {hasNote && <Icon name="edit" size={13} color="#6C63FF" />}
                          <button
                            style={scriptureBtn}
                            onClick={e => {
                              e.stopPropagation()
                              setScripturePassage({ book, chapter: ch.chapter, reference: ch.chapter.toString() })
                            }}
                          >
                            Scripture
                          </button>
                          <button
                            style={noteBtn}
                            onClick={e => { e.stopPropagation(); onOpenNote(plan.id, ch.key) }}
                          >
                            {hasNote ? 'Edit' : '+ Note'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}

          <button style={deleteBtn} onClick={() => onDelete(plan.id)}>
            <Icon name="trash" size={14} color="#ff6b6b" /> Delete Plan
          </button>
        </div>
      )}

      {/* Notes tab */}
      {subTab === 'notes' && (
        <div>
          {notedChapters.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 0', gap: 10 }}>
              <Icon name="edit" size={32} color="rgba(255,255,255,0.1)" />
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                No notes yet. Add reflections while reading.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notedChapters.map(([key, note]) => {
                const lastDash = key.lastIndexOf('-')
                const book = key.slice(0, lastDash)
                const chapter = key.slice(lastDash + 1)
                return (
                  <div key={key} style={noteCard} className="ripple" onClick={() => onOpenNote(plan.id, key)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#6C63FF', textTransform: 'uppercase' }}>
                        {key.replace(/-(\d+)$/, ' · Ch $1')}
                      </span>
                      <Icon name="chevronRight" size={14} color="rgba(255,255,255,0.2)" />
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                      {note.length > 110 ? note.slice(0, 110) + '…' : note}
                    </p>
                    <button
                      style={{ ...scriptureBtn, marginTop: 10 }}
                      onClick={e => {
                        e.stopPropagation()
                        setScripturePassage({ book, reference: chapter })
                      }}
                    >
                      Scripture
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
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

const page = { padding: 'clamp(18px, 3vw, 40px) clamp(18px, 4vw, 48px) 40px', display: 'flex', flexDirection: 'column', gap: 18, minHeight: '100%', maxWidth: 780 }
const heroCard = {
  background: 'linear-gradient(135deg,#1a1440 0%,#110f2a 100%)',
  border: '1.5px solid rgba(108,99,255,0.18)', borderRadius: 24, padding: '20px',
}
const segControl = {
  display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, gap: 2,
}
const bookCard = {
  background: 'rgba(255,255,255,0.025)', border: '1.5px solid rgba(255,255,255,0.06)',
  borderRadius: 16, overflow: 'hidden', marginBottom: 8,
}
const noteBtn = {
  background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.28)',
  borderRadius: 8, color: '#a89fff', cursor: 'pointer',
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700,
  padding: '5px 11px', flexShrink: 0,
}
const scriptureBtn = {
  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
  borderRadius: 8, color: '#34d399', cursor: 'pointer',
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700,
  padding: '5px 11px', flexShrink: 0,
}
const deleteBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  width: '100%', padding: '14px',
  background: 'rgba(255,107,107,0.06)', border: '1.5px solid rgba(255,107,107,0.14)',
  borderRadius: 14, color: '#ff6b6b', cursor: 'pointer',
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, marginTop: 6,
}
const noteCard = {
  background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.07)',
  borderRadius: 16, padding: '16px', cursor: 'pointer',
}