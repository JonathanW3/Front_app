import { useState, useRef, useEffect, useCallback } from 'react'
import WebPOSLogo from './WebPOSLogo'
import './InputBar.css'

export default function InputBar({
  inputMessage,
  setInputMessage,
  onSend,
  onKeyDown,
  selectedAgent,
  isLoading,
  inputRef: externalInputRef,
}) {
  const [focused, setFocused] = useState(false)
  const internalRef = useRef(null)
  const textareaRef = externalInputRef || internalRef

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const maxHeight = 6 * 24 // ~6 lines
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px'
  }, [textareaRef])

  useEffect(() => {
    adjustHeight()
  }, [inputMessage, adjustHeight])

  const handleChange = (e) => {
    setInputMessage(e.target.value)
  }

  const canSend = inputMessage.trim() && selectedAgent && !isLoading

  return (
    <div className="input-area">
      <div className={`input-wrapper ${focused ? 'focused' : ''}`}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputMessage}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={
            selectedAgent
              ? `Escribe tu mensaje a ${selectedAgent.name}...`
              : 'Selecciona un agente...'
          }
          disabled={!selectedAgent || isLoading}
          aria-label="Campo de mensaje"
        />
        <button
          className={`btn-send ${canSend ? 'active' : 'disabled'}`}
          onClick={() => onSend()}
          disabled={!canSend}
          aria-label={isLoading ? 'Enviando mensaje' : 'Enviar mensaje'}
        >
          {isLoading ? <div className="spinner" /> : '➤'}
        </button>
      </div>
      <div className="input-footer" aria-hidden="true">
        <WebPOSLogo size={12} />
        WebPOS IA • Facturación Electrónica Inteligente
      </div>
    </div>
  )
}
