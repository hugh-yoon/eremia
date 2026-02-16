import { useState } from 'react'
import Icon from './Icon'

export default function JournalSheet({ plan, chapterKey, label, onSave, onClose }) {
  const [text, setText] = useState(plan?.notes?.[chapterKey] || '')
  // label may be passed directly (for multi-track) or derived from chapterKey (for custom)
  const displayLabel = label || chapterKey.replace(/-(\d+)$/, ' · Chapter $1')

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(10px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      className="fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: '100%',
          background: '#1c1830',
          border: '1.5px solid rgba(108,99,255,0.18)',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px 44px',
        }}
        className="slide-up"
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
              color: '#6C63FF', textTransform: 'uppercase', marginBottom: 4,
            }}>
              Solitude Note
            </p>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
              {displayLabel}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: 'none',
              borderRadius: 10,
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Icon name="x" size={18} color="rgba(255,255,255,0.4)" />
          </button>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={7}
          autoFocus
          placeholder="What did the Father speak to you in this passage?…"
          style={{ marginBottom: 16 }}
        />

        <button
          onClick={() => onSave(text)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #6C63FF, #9b95ff)',
            border: 'none', borderRadius: 16,
            color: '#fff', cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 15, fontWeight: 700,
            padding: '16px 24px',
            boxShadow: '0 4px 20px rgba(108,99,255,0.3)',
          }}
          className="ripple"
        >
          Save Note
        </button>
      </div>
    </div>
  )
}
