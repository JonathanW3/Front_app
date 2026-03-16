import { useRef } from 'react'
import Watermark from './Watermark'
import WebPOSLogo from './WebPOSLogo'
import MessageBubble from './MessageBubble'
import ScrollToBottom from './ScrollToBottom'
import './ChatArea.css'

const starterPrompts = [
  { icon: '👋', text: 'Hola, ¿cómo puedes ayudarme?' },
  { icon: '⚡', text: '¿Cuáles son tus capacidades?' },
  { icon: '📄', text: 'Necesito información sobre facturación' },
  { icon: '📊', text: 'Genera un reporte de ventas' },
]

export default function ChatArea({
  messages,
  selectedAgent,
  isLoading,
  messagesEndRef,
  inputRef,
  setInputMessage,
  chatAreaRef,
}) {

  return (
    <div className="chat-area" ref={chatAreaRef}>
      <Watermark />
      <div className="chat-area-inner">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-state-logo">
              <WebPOSLogo size={50} />
            </div>
            <h2>Bienvenido a WebPOS IA</h2>
            <p>
              Plataforma de inteligencia artificial para facturación
              electrónica y gestión empresarial
            </p>
            {selectedAgent && (
              <div className="connected-text">
                Conectado con: {selectedAgent.name}
              </div>
            )}
            {selectedAgent && (
              <div className="starter-grid">
                {starterPrompts.map((s, i) => (
                  <button
                    key={i}
                    className="starter-btn"
                    onClick={() => {
                      setInputMessage(s.text)
                      inputRef?.current?.focus()
                    }}
                  >
                    <span className="starter-icon">{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Messages */
          <div className="messages-list" aria-live="polite" aria-relevant="additions">
            {messages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                msg={msg}
                agentName={selectedAgent?.name}
              />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="typing-row" aria-label="El asistente está escribiendo">
                <div className="msg-avatar assistant">
                  <WebPOSLogo size={22} />
                </div>
                <div className="typing-bubble">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ScrollToBottom scrollContainerRef={chatAreaRef} />
    </div>
  )
}
