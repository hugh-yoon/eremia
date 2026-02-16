import CircleProgress from '../components/CircleProgress'
import Icon from '../components/Icon'
import { getStreak } from '../utils'

export default function HomeScreen({ plans, activePlanId, onSelectPlan, onNewPlan }) {
  return (
    <div style={page} className="slide-up">
      {/* Header — hidden on desktop where sidebar shows branding */}
      <div className="mobile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 3 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>Eremia</span>
            <span style={{ fontSize: 14, color: '#6C63FF', fontWeight: 600, letterSpacing: '0.05em' }}>ἐρημία</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', fontStyle: 'italic' }}>Solitude in the Word</p>
        </div>
        {plans.length > 0 && (
          <button
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(108,99,255,0.2)',
              border: '1.5px solid rgba(108,99,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
            className="ripple"
            onClick={onNewPlan}
          >
            <Icon name="plus" size={20} color="#fff" />
          </button>
        )}
      </div>

      {/* Empty state */}
      {plans.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', padding: '30px 10px' }}>
          <div style={{ fontSize: 34, color: 'rgba(108,99,255,0.35)', letterSpacing: '0.08em', fontWeight: 300, marginBottom: 18 }}>
            ἐρημία
          </div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', lineHeight: 1.65, marginBottom: 8 }}>
            "He went up on the mountain by himself to pray."
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginBottom: 34, letterSpacing: '0.06em' }}>
            Matthew 14:23
          </p>
          <button style={primaryBtn} className="ripple" onClick={onNewPlan}>
            Begin Your First Plan
          </button>
        </div>
      ) : (
        <div style={planGrid}>
          {plans.map(plan => {
            const isMultiTrack = plan.type === 'multi-track'
            const isActive = plan.id === activePlanId
            const total = isMultiTrack
              ? (plan.scheduleData || []).reduce((sum, m) => sum + m.days.length * 4, 0)
              : (plan.chapters?.length || 0)
            const done = Object.keys(plan.completed || {}).length
            const pct = total > 0 ? Math.round((done / total) * 100) : 0

            const subtitle = isMultiTrack
              ? `Month ${plan.currentMonth}/12 · 4 tracks/day`
              : `${plan.selectedDuration} · ${plan.chaptersPerDay} ch/day`
            const detailA = isMultiTrack
              ? `${done} passages`
              : `${done}/${total} ch`
            const detailB = isMultiTrack
              ? `Mo. ${plan.currentMonth}`
              : `${plan.books?.length || 0} books`

            return (
              <div
                key={plan.id}
                style={{
                  background: isActive ? 'rgba(108,99,255,0.1)' : 'rgba(255,255,255,0.035)',
                  border: isActive ? '1.5px solid rgba(108,99,255,0.22)' : '1.5px solid rgba(255,255,255,0.07)',
                  borderRadius: 20, padding: '18px', cursor: 'pointer',
                }}
                className="ripple slide-up"
                onClick={() => onSelectPlan(plan.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ flex: 1, paddingRight: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      {isActive && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6C63FF', flexShrink: 0 }} />}
                      {isMultiTrack && (
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.4)', borderRadius: 5, padding: '1px 6px', textTransform: 'uppercase' }}>4-Track</div>
                      )}
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{plan.name}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{subtitle}</span>
                  </div>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <CircleProgress pct={pct} size={54} stroke={4} color={isActive ? '#6C63FF' : 'rgba(255,255,255,0.3)'} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? '#a89fff' : 'rgba(255,255,255,0.4)' }}>{pct}%</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 100, height: 5, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{
                    background: isActive ? '#6C63FF' : 'rgba(255,255,255,0.25)',
                    borderRadius: 100, height: '100%',
                    width: `${pct}%`, transition: 'width 0.5s ease'
                  }} />
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>{detailA}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>🔥 {getStreak(plan.completedDates)} streak</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>{detailB}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const planGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 12,
}
const page = { padding: 'clamp(18px, 3vw, 40px) clamp(18px, 4vw, 48px) 40px', display: 'flex', flexDirection: 'column', gap: 18, minHeight: '100%' }
const primaryBtn = {
  width: '100%', background: 'linear-gradient(135deg,#6C63FF,#9b95ff)',
  border: 'none', borderRadius: 16, color: '#fff', cursor: 'pointer',
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700,
  padding: '16px 24px', boxShadow: '0 4px 20px rgba(108,99,255,0.3)',
}