import { useState } from 'react'
import { YouVersionProvider, BibleTextView } from '@youversion/platform-react-ui'
import Icon from './Icon'

const VERSIONS = [
  { id: 111, name: 'NIV', label: 'New International Version' },
  { id: 2692, name: 'NASB', label: 'New American Standard (2020)' },
]

export default function ScriptureSheet({ passage, onClose }) {
  const [version, setVersion] = useState(VERSIONS[0].id)

  const appKey = (import.meta.env.VITE_YOUVERSION_APP_KEY || '').trim()
  const reference = convertToPassageId(passage.book, passage.reference)

  if (!appKey) {
    return (
      <div style={overlay} onClick={onClose}>
        <div style={sheet} onClick={(e) => e.stopPropagation()} className="scripture-sheet-down">
          <div style={header}>
            <div style={{ flex: 1 }}>
              <h3 style={title}>{passage.book} {passage.reference}</h3>
            </div>
            <button style={closeBtn} onClick={onClose}>
              <Icon name="x" size={20} color="rgba(255,255,255,0.5)" />
            </button>
          </div>
          <div style={content}>
            <div style={errorBox}>
              Add VITE_YOUVERSION_APP_KEY to your .env file.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!reference) {
    return (
      <div style={overlay} onClick={onClose}>
        <div style={sheet} onClick={(e) => e.stopPropagation()} className="scripture-sheet-down">
          <div style={header}>
            <div style={{ flex: 1 }}>
              <h3 style={title}>{passage.book} {passage.reference}</h3>
            </div>
            <button style={closeBtn} onClick={onClose}>
              <Icon name="x" size={20} color="rgba(255,255,255,0.5)" />
            </button>
          </div>
          <div style={content}>
            <div style={errorBox}>
              Could not resolve book &quot;{passage.book}&quot;.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={(e) => e.stopPropagation()} className="scripture-sheet-down">
        <div style={header}>
          <div style={{ flex: 1 }}>
            <h3 style={title}>{passage.book} {passage.reference}</h3>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {VERSIONS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  style={{
                    ...versionBtn,
                    background: version === v.id ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.05)',
                    color: version === v.id ? '#a89fff' : 'rgba(255,255,255,0.4)',
                    border: version === v.id ? '1.5px solid #6C63FF' : '1.5px solid rgba(255,255,255,0.08)',
                  }}
                  onClick={() => setVersion(v.id)}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
          <button type="button" style={closeBtn} onClick={onClose}>
            <Icon name="x" size={20} color="rgba(255,255,255,0.5)" />
          </button>
        </div>

        <div style={content}>
          <YouVersionProvider appKey={appKey} theme="dark">
            <div className="scripture-container" style={scriptureText}>
              <BibleTextView reference={reference} versionId={version} />
            </div>
          </YouVersionProvider>
        </div>
      </div>
    </div>
  )
}

function convertToPassageId(book, reference) {
  const bookIds = {
    Genesis: 'GEN', Exodus: 'EXO', Leviticus: 'LEV', Numbers: 'NUM', Deuteronomy: 'DEU',
    Joshua: 'JOS', Judges: 'JDG', Ruth: 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
    '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
    Ezra: 'EZR', Nehemiah: 'NEH', Esther: 'EST', Job: 'JOB',
    Psalms: 'PSA', Proverbs: 'PRO', Ecclesiastes: 'ECC', 'Song of Solomon': 'SNG',
    Isaiah: 'ISA', Jeremiah: 'JER', Lamentations: 'LAM', Ezekiel: 'EZK', Daniel: 'DAN',
    Hosea: 'HOS', Joel: 'JOL', Amos: 'AMO', Obadiah: 'OBA', Jonah: 'JON',
    Micah: 'MIC', Nahum: 'NAM', Habakkuk: 'HAB', Zephaniah: 'ZEP', Haggai: 'HAG',
    Zechariah: 'ZEC', Malachi: 'MAL',
    Matthew: 'MAT', Mark: 'MRK', Luke: 'LUK', John: 'JHN',
    Acts: 'ACT', Romans: 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
    Galatians: 'GAL', Ephesians: 'EPH', Philippians: 'PHP', Colossians: 'COL',
    '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI', '2 Timothy': '2TI',
    Titus: 'TIT', Philemon: 'PHM', Hebrews: 'HEB', James: 'JAS',
    '1 Peter': '1PE', '2 Peter': '2PE', '1 John': '1JN', '2 John': '2JN', '3 John': '3JN',
    Jude: 'JUD', Revelation: 'REV',
  }

  const normalizedBook = book.trim().toLowerCase()
  const bookId = Object.entries(bookIds).find(
    ([key]) => key.toLowerCase() === normalizedBook
  )?.[1]

  if (!bookId) return null

  const cleanRef = reference.replace(/\s/g, '')
  if (cleanRef.includes(':')) {
    const [chapter, verses] = cleanRef.split(':')
    return `${bookId}.${chapter}.${verses}`
  }
  return `${bookId}.${cleanRef}`
}

const overlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'flex-start', zIndex: 1000,
}

const sheet = {
  background: 'linear-gradient(160deg, #1a1825 0%, #0E0E14 100%)',
  borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  width: '100%', maxHeight: '85vh',
  display: 'flex', flexDirection: 'column',
  boxShadow: '0 4px 40px rgba(0,0,0,0.5)',
}

const header = {
  padding: '24px 20px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  display: 'flex', alignItems: 'flex-start', gap: 16,
}

const title = {
  fontSize: 18, fontWeight: 800, color: '#fff', margin: 0,
}

const closeBtn = {
  background: 'rgba(255,255,255,0.06)', border: 'none',
  borderRadius: 10, width: 36, height: 36,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flexShrink: 0,
}

const versionBtn = {
  padding: '6px 12px', borderRadius: 8,
  fontSize: 11, fontWeight: 700, cursor: 'pointer',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  transition: 'all 0.15s',
}

const content = {
  padding: '20px 28px 40px',
  overflowY: 'auto', overflowX: 'hidden',
  flex: 1,
  WebkitOverflowScrolling: 'touch',
}

const errorBox = {
  padding: 20,
  background: 'rgba(255,107,107,0.1)',
  border: '1px solid rgba(255,107,107,0.3)',
  borderRadius: 12,
  color: '#ff6b6b',
  textAlign: 'center',
}

const scriptureText = {
  fontSize: 15,
  lineHeight: 1.8,
  color: 'rgba(255,255,255,0.85)',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  minWidth: 0,
}
