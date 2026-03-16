import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import WebPOSLogo from './WebPOSLogo'
import './MessageBubble.css'

const COLLAPSE_THRESHOLD = 500

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = String(children).replace(/\n$/, '')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="code-block-wrapper">
      <button
        className="code-copy-btn"
        onClick={handleCopy}
        aria-label={copied ? 'Código copiado' : 'Copiar código'}
        title={copied ? 'Copiado' : 'Copiar código'}
      >
        {copied ? '✓' : '⎘'}
      </button>
      <pre>
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

export default function MessageBubble({ msg, agentName }) {
  const [collapsed, setCollapsed] = useState(true)
  const [copiedMsg, setCopiedMsg] = useState(false)

  const isLong = msg.content.length > COLLAPSE_THRESHOLD
  const displayContent = isLong && collapsed
    ? msg.content.slice(0, COLLAPSE_THRESHOLD) + '...'
    : msg.content

  const handleCopyMessage = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(msg.content)
      setCopiedMsg(true)
      setTimeout(() => setCopiedMsg(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = msg.content
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedMsg(true)
      setTimeout(() => setCopiedMsg(false), 2000)
    }
  }, [msg.content])

  const markdownComponents = {
    pre({ children }) {
      // Extract code content from the pre > code structure
      const codeChild = children?.props
      return (
        <CodeBlock className={codeChild?.className}>
          {codeChild?.children || children}
        </CodeBlock>
      )
    },
  }

  return (
    <div className={`message-row ${msg.role}`}>
      {/* Avatar */}
      <div className={`msg-avatar ${msg.role}`}>
        {msg.role === 'user' ? '👤' : <WebPOSLogo size={22} />}
      </div>

      {/* Content */}
      <div className="msg-content">
        <div className="msg-header">
          <span className="msg-role">
            {msg.role === 'user' ? 'Tú' : agentName || 'Asistente'}
          </span>
          <span>{msg.timestamp}</span>
        </div>
        <div className={`msg-bubble ${msg.role}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {displayContent}
          </ReactMarkdown>

          {/* Collapse toggle */}
          {isLong && (
            <button
              className="msg-collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Ver mensaje completo' : 'Colapsar mensaje'}
            >
              {collapsed ? 'Ver más ▼' : 'Ver menos ▲'}
            </button>
          )}
        </div>

        {/* Actions row */}
        <div className="msg-actions">
          {msg.model && (
            <div className="msg-model">
              <span className="msg-model-dot" />
              {msg.model}
            </div>
          )}
          {msg.role === 'assistant' && (
            <button
              className="msg-copy-btn"
              onClick={handleCopyMessage}
              aria-label={copiedMsg ? 'Respuesta copiada' : 'Copiar respuesta'}
              title={copiedMsg ? 'Copiado' : 'Copiar respuesta'}
            >
              {copiedMsg ? '✓ Copiado' : '⎘ Copiar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
