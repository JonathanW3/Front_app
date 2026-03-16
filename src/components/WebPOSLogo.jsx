export default function WebPOSLogo({ size = 40, white = false }) {
  const c1 = white ? 'rgba(255,255,255,0.9)' : '#2196F3'
  const c2 = white ? 'rgba(255,255,255,0.6)' : '#42A5F5'
  const c3 = white ? 'rgba(255,255,255,0.4)' : '#64B5F6'
  const c4 = white ? 'rgba(255,255,255,0.3)' : '#90CAF9'

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" stroke={c1} strokeWidth="3" />
      <ellipse cx="50" cy="50" rx="30" ry="45" stroke={c2} strokeWidth="2" />
      <ellipse cx="50" cy="50" rx="12" ry="45" stroke={c3} strokeWidth="1.5" />
      <line x1="5" y1="50" x2="95" y2="50" stroke={c2} strokeWidth="1.5" />
      <line x1="10" y1="30" x2="90" y2="30" stroke={c4} strokeWidth="1" />
      <line x1="10" y1="70" x2="90" y2="70" stroke={c4} strokeWidth="1" />
    </svg>
  )
}
