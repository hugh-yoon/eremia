import { useState } from 'react'
import Icon from '../components/Icon'
import { ALL_BOOKS, OT_BOOKS, NT_BOOKS, DURATION_PRESETS } from '../data'
import { NAVIGATORS_PLAN } from '../navigatorsPlan'
import { buildChapters, calcCPD, todayStr } from '../utils'

const EMPTY_FORM = {
  name: '', description: '', books: [],
  startDate: todayStr(), chaptersPerDay: 1,
  durationDays: 365, selectedDuration: '1 Year', startMonth: 1,
}

export default function CreateScreen({ onCreated, onBack }) {
  const [planType, setPlanType] = useState(null)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(EMPTY_FORM)
  const [bookSearch, setBookSearch] = useState('')
  const [bookSection, setBookSection] = useState('all')

  // ── Plan type selection ─────────────────────────────────────────────────────
  if (!planType) {
    return (
      <div style={page} className="slide-up">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:10, marginBottom:8 }}>
          <button style={backBtn} onClick={onBack}>
            <Icon name="chevronLeft" size={20} color="rgba(255,255,255,0.7)" />
          </button>
          <span style={{ fontSize:17, fontWeight:800, color:'#fff' }}>New Plan</span>
          <div style={{ width:36 }} />
        </div>

        <p style={{ fontSize:13, color:'rgba(255,255,255,0.28)', textAlign:'center', fontStyle:'italic', lineHeight:1.7 }}>
          Follow a curated multi-track plan or build your own.
        </p>

        {/* Navigators card */}
        <div style={{ background:'rgba(108,99,255,0.08)', border:'1.5px solid rgba(108,99,255,0.22)', borderRadius:20, padding:18, cursor:'pointer' }}
          className="ripple" onClick={() => setPlanType('navigators')}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div style={{ flex:1 }}>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', color:'#6C63FF', border:'1px solid #6C63FF', borderRadius:6, padding:'2px 8px', textTransform:'uppercase' }}>
                Multi-Track · Preset
              </span>
              <h3 style={{ fontSize:17, fontWeight:800, color:'#fff', marginTop:8, marginBottom:4 }}>Navigators Plan</h3>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.38)', lineHeight:1.65 }}>
                4 simultaneous passages daily across the whole Bible. 25 readings/month, 12 months.
              </p>
            </div>
            <Icon name="chevronRight" size={18} color="rgba(108,99,255,0.5)" />
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {['Matthew','Psalms','Genesis','Acts','+44 books'].map((t,i) => (
              <div key={t} style={{
                background: i < 4 ? 'rgba(108,99,255,0.18)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${i < 4 ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius:6, padding:'3px 8px', fontSize:10, fontWeight:700,
                color: i < 4 ? '#a89fff' : 'rgba(255,255,255,0.25)',
              }}>{t}</div>
            ))}
          </div>
        </div>

        {/* Custom card */}
        <div style={{ background:'rgba(16,185,129,0.06)', border:'1.5px solid rgba(16,185,129,0.18)', borderRadius:20, padding:18, cursor:'pointer' }}
          className="ripple" onClick={() => setPlanType('custom')}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div style={{ flex:1 }}>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', color:'#10b981', border:'1px solid #10b981', borderRadius:6, padding:'2px 8px', textTransform:'uppercase' }}>
                Custom · Your Pick
              </span>
              <h3 style={{ fontSize:17, fontWeight:800, color:'#fff', marginTop:8, marginBottom:4 }}>Custom Plan</h3>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.38)', lineHeight:1.65 }}>
                Choose any books, set your own pace. Read sequentially chapter by chapter.
              </p>
            </div>
            <Icon name="chevronRight" size={18} color="rgba(16,185,129,0.5)" />
          </div>
          <div style={{ display:'flex', gap:5 }}>
            {['Any books','Any pace','Any duration'].map(t => (
              <div key={t} style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:6, padding:'3px 8px', fontSize:10, fontWeight:700, color:'#34d399' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Navigators setup ────────────────────────────────────────────────────────
  if (planType === 'navigators') {
    return (
      <div style={page} className="slide-up">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:10, marginBottom:8 }}>
          <button style={backBtn} onClick={() => setPlanType(null)}>
            <Icon name="chevronLeft" size={20} color="rgba(255,255,255,0.7)" />
          </button>
          <span style={{ fontSize:17, fontWeight:800, color:'#fff' }}>Navigators Plan</span>
          <div style={{ width:36 }} />
        </div>

        <div style={{ background:'rgba(108,99,255,0.08)', border:'1.5px solid rgba(108,99,255,0.18)', borderRadius:20, padding:18 }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', color:'#6C63FF', textTransform:'uppercase', marginBottom:10 }}>Overview</p>
          <div style={{ display:'flex', gap:10, marginBottom:16, textAlign:'center' }}>
            {[['12','Months'],['300','Readings'],['4','Tracks/Day'],['48','Books']].map(([v,l]) => (
              <div key={l} style={{ flex:1 }}>
                <div style={{ fontSize:20, fontWeight:800, color:'#a89fff' }}>{v}</div>
                <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.28)', textTransform:'uppercase', marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:16 }}>
            {NAVIGATORS_PLAN.months.map(m => (
              <div key={m.month} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:40, fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.25)', flexShrink:0 }}>Mo. {m.month}</div>
                <div style={{ display:'flex', gap:4, flex:1, flexWrap:'wrap' }}>
                  {m.tracks.map((t,ti) => (
                    <div key={ti} style={{
                      background:['rgba(108,99,255,0.14)','rgba(245,158,11,0.1)','rgba(16,185,129,0.1)','rgba(244,63,94,0.1)'][ti],
                      border:`1px solid ${['rgba(108,99,255,0.25)','rgba(245,158,11,0.25)','rgba(16,185,129,0.25)','rgba(244,63,94,0.25)'][ti]}`,
                      borderRadius:6, padding:'2px 7px', fontSize:10, fontWeight:700,
                      color:['#a89fff','#fbbf24','#34d399','#fb7185'][ti],
                    }}>{t}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontStyle:'italic', lineHeight:1.65, marginBottom:16 }}>
            Each month has 25 readings — free days to catch up or study deeper.
          </p>

          <div style={{ textAlign:'center', fontSize:10, color:'rgba(255,255,255,0.15)', marginBottom:16 }}>
            ↓ Scroll down to start
          </div>

          <div>
            <label style={lbl}>Start at Month</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {NAVIGATORS_PLAN.months.map(m => (
                <button
                  key={m.month}
                  className={`dur-chip ${(form.startMonth||1) === m.month ? 'sel' : ''}`}
                  style={{ flexBasis:'calc(25% - 6px)', flexShrink:0 }}
                  onClick={() => setForm(f => ({ ...f, startMonth:m.month }))}
                >
                  M{m.month}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          style={{
            ...primaryBtn,
            position: 'sticky',
            bottom: 0,
            marginTop: 'auto',
            boxShadow: '0 -4px 20px rgba(14,14,20,0.8), 0 4px 20px rgba(108,99,255,0.25)',
          }}
          className="ripple"
          onClick={() => {
          onCreated({
            id: Date.now().toString(),
            name: NAVIGATORS_PLAN.name,
            description: NAVIGATORS_PLAN.description,
            type: 'multi-track',
            scheduleData: NAVIGATORS_PLAN.months,
            currentMonth: form.startMonth || 1,
            startDate: todayStr(),
            completed: {}, notes: {}, completedDates: [],
            createdAt: new Date().toISOString(),
          })
        }}>
          Start Navigators Plan ✦
        </button>
      </div>
    )
  }

  // ── Custom plan wizard ──────────────────────────────────────────────────────
  const totalChapters = buildChapters(form.books).length
  const effectiveCPD = form.selectedDuration === 'Custom'
    ? form.chaptersPerDay : calcCPD(totalChapters, form.durationDays)

  const handleBooksChange = (newBooks) => {
    const nt = buildChapters(newBooks).length
    setForm(f => ({
      ...f, books: newBooks,
      chaptersPerDay: f.selectedDuration !== 'Custom' && f.durationDays
        ? calcCPD(nt, f.durationDays) : f.chaptersPerDay
    }))
  }

  const filteredBooks = ALL_BOOKS.filter(b => {
    const sec = bookSection === 'all' || (bookSection === 'ot' ? OT_BOOKS.includes(b) : NT_BOOKS.includes(b))
    return sec && b.toLowerCase().includes(bookSearch.toLowerCase())
  })

  return (
    <div style={page} className="slide-up">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:10, marginBottom:-4 }}>
        <button style={backBtn} onClick={() => step === 1 ? setPlanType(null) : setStep(1)}>
          <Icon name="chevronLeft" size={20} color="rgba(255,255,255,0.7)" />
        </button>
        <span style={{ fontSize:17, fontWeight:800, color:'#fff' }}>{step === 1 ? 'Plan Details' : 'Select Books'}</span>
        <div style={{ width:36 }} />
      </div>

      <div style={{ display:'flex', gap:6 }}>
        {[1,2].map(s => (
          <div key={s} style={{ height:4, flex:1, borderRadius:4, background: s<=step ? '#10b981' : 'rgba(255,255,255,0.1)', transition:'background 0.3s' }} />
        ))}
      </div>

      {step === 1 && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={lbl}>Plan Name</label>
            <input placeholder="e.g. New Testament 2025" value={form.name}
              onChange={e => setForm(f => ({ ...f, name:e.target.value }))} />
          </div>
          <div>
            <label style={lbl}>Description <span style={{ color:'rgba(255,255,255,0.25)', fontWeight:400, fontSize:11, textTransform:'none' }}>(optional)</span></label>
            <input placeholder="A note about this plan…" value={form.description}
              onChange={e => setForm(f => ({ ...f, description:e.target.value }))} />
          </div>
          <div>
            <label style={lbl}>Start Date</label>
            <input type="date" value={form.startDate}
              onChange={e => setForm(f => ({ ...f, startDate:e.target.value }))} />
          </div>
          <div>
            <label style={lbl}>Duration</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {DURATION_PRESETS.map(p => (
                <button key={p.label}
                  className={`dur-chip ${form.selectedDuration === p.label ? 'sel' : ''}`}
                  style={{ flexBasis:'calc(33% - 6px)', flexShrink:0 }}
                  onClick={() => {
                    if (p.days === null) setForm(f => ({ ...f, selectedDuration:'Custom', durationDays:null }))
                    else setForm(f => ({ ...f, selectedDuration:p.label, durationDays:p.days, chaptersPerDay:calcCPD(totalChapters, p.days) }))
                  }}>{p.label}</button>
              ))}
            </div>
            {form.selectedDuration === 'Custom' && (
              <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:12 }}>
                <input type="number" min={1} max={50} value={form.chaptersPerDay}
                  onChange={e => setForm(f => ({ ...f, chaptersPerDay:Math.max(1, parseInt(e.target.value)||1) }))}
                  style={{ maxWidth:100 }} />
                <span style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>chapters / day</span>
              </div>
            )}
          </div>
          <button style={{ ...primaryBtn, background:'linear-gradient(135deg,#10b981,#34d399)', opacity:!form.name.trim()?0.4:1 }}
            className="ripple" onClick={() => form.name.trim() && setStep(2)}>
            Next — Choose Books →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {form.books.length > 0 && (
            <div style={{ background:'rgba(16,185,129,0.08)', border:'1.5px solid rgba(16,185,129,0.18)', borderRadius:16, padding:'14px 18px', display:'flex', justifyContent:'space-around' }}>
              {[[form.books.length,'Books'],[totalChapters,'Chapters'],[effectiveCPD,'Ch/Day'],[Math.ceil(totalChapters/effectiveCPD),'Days']].map(([v,l]) => (
                <div key={l} style={{ textAlign:'center', flex:1 }}>
                  <div style={{ fontSize:20, fontWeight:800, color:'#34d399' }}>{v}</div>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.28)', textTransform:'uppercase', marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display:'flex', gap:8 }}>
            {['OT','NT','All','Clear'].map(q => (
              <button key={q} style={quickBtn} className="ripple" onClick={() => {
                if (q==='OT') handleBooksChange([...OT_BOOKS])
                else if (q==='NT') handleBooksChange([...NT_BOOKS])
                else if (q==='All') handleBooksChange([...ALL_BOOKS])
                else handleBooksChange([])
              }}>{q}</button>
            ))}
          </div>
          <div style={{ display:'flex', background:'rgba(255,255,255,0.05)', borderRadius:12, padding:4, gap:2 }}>
            {[['all','All'],['ot','Old Test.'],['nt','New Test.']].map(([v,l]) => (
              <button key={v} className={`seg-btn ${bookSection===v?'active':''}`} onClick={() => setBookSection(v)}>{l}</button>
            ))}
          </div>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
              <Icon name="search" size={16} color="rgba(255,255,255,0.3)" />
            </div>
            <input placeholder="Search books…" value={bookSearch} onChange={e => setBookSearch(e.target.value)} style={{ paddingLeft:40 }} />
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, maxHeight:210, overflowY:'auto', paddingBottom:4 }}>
            {filteredBooks.map(book => (
              <button key={book} className={`book-chip ${form.books.includes(book)?'sel':''}`}
                onClick={() => handleBooksChange(form.books.includes(book) ? form.books.filter(b=>b!==book) : [...form.books,book])}>
                {book}
              </button>
            ))}
          </div>
          <button style={{ ...primaryBtn, background:'linear-gradient(135deg,#10b981,#34d399)', opacity:form.books.length===0?0.4:1 }}
            className="ripple" onClick={() => {
              if (!form.books.length) return
              const chapters = buildChapters(form.books)
              const cpd = form.selectedDuration==='Custom' ? form.chaptersPerDay : calcCPD(chapters.length, form.durationDays)
              onCreated({ id:Date.now().toString(), name:form.name, description:form.description, type:'custom', books:form.books, startDate:form.startDate, chaptersPerDay:cpd, durationDays:form.durationDays, selectedDuration:form.selectedDuration, chapters, completed:{}, notes:{}, completedDates:[], createdAt:new Date().toISOString() })
              setForm(EMPTY_FORM); setStep(1)
            }}>
            Create Plan ✦
          </button>
        </div>
      )}
    </div>
  )
}

const page = { padding:'clamp(18px, 3vw, 40px) clamp(18px, 4vw, 48px) calc(40px + env(safe-area-inset-bottom, 20px))', display:'flex', flexDirection:'column', gap:18, minHeight:'100%', maxWidth:640 }
const backBtn = { background:'rgba(255,255,255,0.06)', border:'none', borderRadius:10, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }
const lbl = { display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:8 }
const primaryBtn = { width:'100%', background:'linear-gradient(135deg,#6C63FF,#9b95ff)', border:'none', borderRadius:16, color:'#fff', cursor:'pointer', fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:15, fontWeight:700, padding:'16px 24px', boxShadow:'0 4px 20px rgba(108,99,255,0.25)' }
const quickBtn = { flex:1, padding:'9px 0', background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.08)', borderRadius:10, color:'rgba(255,255,255,0.5)', cursor:'pointer', fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:12, fontWeight:700 }