export default function Watermark() {
  const items = []
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 5; col++) {
      items.push(
        <div
          key={`${row}-${col}`}
          className="watermark-text"
          style={{
            top: `${row * 14 + 2}%`,
            left: `${col * 24 + (row % 2 ? 12 : 0)}%`,
          }}
        >
          WebPOS IA
        </div>
      )
    }
  }
  return <div className="watermark" aria-hidden="true">{items}</div>
}
