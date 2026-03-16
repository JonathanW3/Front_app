import { useState, useEffect, useCallback } from 'react'
import './ScrollToBottom.css'

export default function ScrollToBottom({ scrollContainerRef }) {
  const [visible, setVisible] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef?.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setVisible(distanceFromBottom > 200)
  }, [scrollContainerRef])

  useEffect(() => {
    const el = scrollContainerRef?.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    return () => el.removeEventListener('scroll', checkScroll)
  }, [scrollContainerRef, checkScroll])

  const scrollToBottom = () => {
    const el = scrollContainerRef?.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      className="scroll-to-bottom"
      onClick={scrollToBottom}
      aria-label="Ir al último mensaje"
      title="Ir al último mensaje"
    >
      ↓
    </button>
  )
}
