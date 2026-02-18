import { useState, useEffect } from 'react'
import Icon from './Icon'

// Available Bible versions from API.Bible
const VERSIONS = [
  { id: 'de4e12af7f28f599-02', name: 'ESV', label: 'English Standard Version' },
  { id: '9879dbb7cfe39e4d-04', name: 'NIV', label: 'New International Version' },
  { id: 'de4e12af7f28f599-01', name: 'KJV', label: 'King James Version' },
  { id: 'c315fa9f71d4af3a-01', name: 'NASB', label: 'New American Standard' },
  { id: '7142879509583d59-04', name: 'NLT', label: 'New Living Translation' },
]

export default function ScriptureSheet({ passage, onClose }) {
  const [version, setVersion] = useState(VERSIONS[0].id)
  const [text, setText] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchScripture()
  }, [version, passage])

  const fetchScripture = async () => {
    setLoading(true)
    setError(null)

    const cacheKey = `scripture:${version}:${passage.book}:${passage.reference}`
    const cached = localStorage.getItem(cacheKey)
    
    if (cached) {
      setText(cached)
      setLoading(false)
      return
    }

    try {
      // You'll replace 'YOUR_API_KEY' with your actual API.Bible key
      const API_KEY = import.meta.env.VITE_BIBLE_API_KEY || 'YOUR_API_KEY'
      
      // Convert passage reference to API.Bible format
      const passageId = convertToPassageId(passage.book, passage.reference)
      
      const response = await fetch(
        `https://api.scripture.api.bible/v1/bibles/${version}/passages/${passageId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
        {
          headers: {
            'api-key': API_KEY
          }
        }
      )

      if (!response.ok) throw new Error('Failed to fetch scripture')

      const data = await response.json()
      const content = data.data.content

      localStorage.setItem(cacheKey, content)
      setText(content)
    } catch (err) {
      console.error('Scripture fetch error:', err)
      setError('Could not load scripture. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={(e) => e.stopPropagation()} className="slide-up">
        {/* Header */}
        <div style={header}>
          <div style={{ flex: 1 }}>
            <h3 style={title}>{passage.book} {passage.reference}</h3>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {VERSIONS.map(v => (
                <button
                  key={v.id}
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
          <button style={closeBtn} onClick={onClose}>
            <Icon name="x" size={20} color="rgba(255,255,255,0.5)" />
          </button>
        </div>

        {/* Content */}
        <div style={content}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)' }}>
              Loading scripture...
            </div>
          )}
          
          {error && (
            <div style={{
              padding: 20,
              background: 'rgba(255,107,107,0.1)',
              border: '1px solid rgba(255,107,107,0.3)',
              borderRadius: 12,
              color: '#ff6b6b',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}
          
          {!loading && !error && text && (
            <div 
              style={scriptureText}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Helper to convert book name + reference to API.Bible passage ID
function convertToPassageId(book, reference) {
  // Map book names to API.Bible book IDs
  const bookIds = {
    'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
    'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
    '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
    'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB',
    'Psalms': 'PSA', 'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG',
    'Isaiah': 'ISA', 'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
    'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
    'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP', 'Haggai': 'HAG',
    'Zechariah': 'ZEC', 'Malachi': 'MAL',
    'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN',
    'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
    'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
    '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI', '2 Timothy': '2TI',
    'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB', 'James': 'JAS',
    '1 Peter': '1PE', '2 Peter': '2PE', '1 John': '1JN', '2 John': '2JN', '3 John': '3JN',
    'Jude': 'JUD', 'Revelation': 'REV',
  }

  const bookId = bookIds[book]
  if (!bookId) return null

  // Convert reference like "1:1-17" or "1-2" to API format
  // API.Bible format: GEN.1.1-GEN.1.17 or GEN.1-GEN.2
  const cleanRef = reference.replace(/\s/g, '')
  
  if (cleanRef.includes(':')) {
    // Verse-level reference like "1:1-17"
    const [chapter, verses] = cleanRef.split(':')
    if (verses.includes('-')) {
      const [start, end] = verses.split('-')
      return `${bookId}.${chapter}.${start}-${bookId}.${chapter}.${end}`
    } else {
      return `${bookId}.${chapter}.${verses}`
    }
  } else if (cleanRef.includes('-')) {
    // Chapter range like "1-2"
    const [start, end] = cleanRef.split('-')
    return `${bookId}.${start}-${bookId}.${end}`
  } else {
    // Single chapter like "1"
    return `${bookId}.${cleanRef}`
  }
}

const overlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'flex-end', zIndex: 1000,
}

const sheet = {
  background: 'linear-gradient(160deg, #1a1825 0%, #0E0E14 100%)',
  borderTopLeftRadius: 24, borderTopRightRadius: 24,
  width: '100%', maxHeight: '85vh',
  display: 'flex', flexDirection: 'column',
  boxShadow: '0 -4px 40px rgba(0,0,0,0.5)',
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
  padding: '20px 20px 40px',
  overflowY: 'auto', flex: 1,
  WebkitOverflowScrolling: 'touch',
}

const scriptureText = {
  fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
}