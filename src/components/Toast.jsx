import './Toast.css'

const icons = {
  success: '✓',
  error: '⚠',
  info: 'ℹ',
}

export default function Toast({ toasts, onRemove }) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
          <span className="toast-icon">{icons[toast.type] || icons.info}</span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => onRemove(toast.id)}
            aria-label="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
