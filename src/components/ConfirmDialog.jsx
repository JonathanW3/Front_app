import { useEffect, useRef } from 'react'
import './ConfirmDialog.css'

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}) {
  const dialogRef = useRef(null)
  const confirmBtnRef = useRef(null)

  useEffect(() => {
    confirmBtnRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel()
        return
      }
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button:not([disabled])'
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        ref={dialogRef}
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-msg"
        onClick={(e) => e.stopPropagation()}
      >
        <p id="confirm-msg" className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            className="confirm-btn-ok"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
