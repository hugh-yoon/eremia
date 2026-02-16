export default function Toast({ message }) {
  if (!message) return null
  return (
    <div style={{
      position: 'fixed',
      bottom: 96,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(108,99,255,0.95)',
      backdropFilter: 'blur(12px)',
      color: '#fff',
      fontSize: 13,
      fontWeight: 700,
      padding: '10px 22px',
      borderRadius: 100,
      zIndex: 999,
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(108,99,255,0.45)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }} className="fade-in">
      {message}
    </div>
  )
}
