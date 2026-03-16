import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import InputBar from './components/InputBar'
import Modal from './components/Modal'
import Toast from './components/Toast'
import ConfirmDialog from './components/ConfirmDialog'
import useAgents from './hooks/useAgents'
import useChat from './hooks/useChat'
import useSessions from './hooks/useSessions'
import useToast from './hooks/useToast'
import './App.css'

function App() {
  const { toasts, addToast, removeToast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [confirmAction, setConfirmAction] = useState(null)

  const handleError = useCallback((msg) => {
    addToast(msg, 'error', 6000)
  }, [addToast])

  const handleSuccess = useCallback((msg) => {
    addToast(msg, 'success')
  }, [addToast])

  const {
    agents,
    selectedAgent,
    selectAgent,
    getAgentIcon,
  } = useAgents({ onError: handleError })

  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    messagesEndRef,
    inputRef,
    chatAreaRef,
    sendMessage,
    clearChat,
    loadHistory,
    handleKeyDown,
  } = useChat({
    selectedAgent,
    onError: handleError,
    onSuccess: handleSuccess,
  })

  const {
    sessions,
    showSessionModal,
    setShowSessionModal,
    showDocumentsModal,
    setShowDocumentsModal,
    agentDocuments,
    isLoadingSession,
    loadSessions,
    loadDocuments,
    loadSessionHistory,
  } = useSessions({
    selectedAgent,
    onError: handleError,
    onSuccess: handleSuccess,
    onLoadHistory: loadHistory,
  })

  // Listen for closeSidebar event (mobile agent selection)
  useEffect(() => {
    const handleCloseSidebar = () => setSidebarOpen(false)
    window.addEventListener('closeSidebar', handleCloseSidebar)
    return () => window.removeEventListener('closeSidebar', handleCloseSidebar)
  }, [])

  // Agent change with confirmation
  const handleSelectAgent = useCallback((agent) => {
    if (selectedAgent?.id === agent.id) return
    if (messages.length > 0) {
      setConfirmAction({
        message: `¿Cambiar al agente "${agent.name}"? Se perderá la conversación actual.`,
        onConfirm: () => {
          selectAgent(agent)
          setConfirmAction(null)
        },
      })
    } else {
      selectAgent(agent)
    }
  }, [selectedAgent, messages.length, selectAgent])

  // New chat with confirmation
  const handleNewChat = useCallback(() => {
    if (messages.length > 0) {
      setConfirmAction({
        message: '¿Iniciar nueva conversación? Se perderá la conversación actual.',
        onConfirm: () => {
          clearChat()
          setConfirmAction(null)
        },
      })
    } else {
      clearChat()
    }
  }, [messages.length, clearChat])

  return (
    <div className="app-layout">
      <h1 className="sr-only">WebPOS IA - Chat de Inteligencia Artificial</h1>

      {/* Sidebar */}
      <Sidebar
        agents={agents}
        selectedAgent={selectedAgent}
        onSelectAgent={handleSelectAgent}
        onNewChat={handleNewChat}
        sidebarOpen={sidebarOpen}
        getAgentIcon={getAgentIcon}
      />

      {/* Main Area */}
      <div className="main-area">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <button
              className={`btn-toggle-sidebar ${!sidebarOpen ? 'sidebar-closed' : ''}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? 'Cerrar panel lateral' : 'Abrir panel lateral'}
              aria-expanded={sidebarOpen}
            >
              ☰
            </button>
            {selectedAgent && (
              <div>
                <div className="top-bar-agent-name">
                  {selectedAgent.name}
                  <span className="online-indicator" aria-label="En línea" />
                </div>
                <div className="top-bar-agent-desc">{selectedAgent.description}</div>
              </div>
            )}
          </div>
          <div className="top-bar-badges">
            {selectedAgent?.use_rag !== false && selectedAgent?.use_rag && (
              <span className="badge badge-rag">📚 RAG</span>
            )}
            {selectedAgent?.sqlite_db_path && (
              <span className="badge badge-sql">🗄️ SQL</span>
            )}
            {selectedAgent && (
              <span className="badge badge-model">🤖 {selectedAgent.llm_model}</span>
            )}
            {messages.length > 0 && (
              <span className="badge badge-msgs">💬 {messages.length}</span>
            )}
            {selectedAgent && (
              <>
                <button
                  className="btn-topbar-action"
                  onClick={loadDocuments}
                  disabled={isLoading}
                  aria-label="Ver documentos del agente"
                  title="Ver documentos"
                >
                  📄
                </button>
                <button
                  className="btn-topbar-action"
                  onClick={loadSessions}
                  disabled={isLoading}
                  aria-label="Ver sesiones anteriores"
                  title="Ver sesiones"
                >
                  📋
                </button>
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <ChatArea
          messages={messages}
          selectedAgent={selectedAgent}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          inputRef={inputRef}
          setInputMessage={setInputMessage}
          chatAreaRef={chatAreaRef}
        />

        {/* Input */}
        <InputBar
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSend={sendMessage}
          onKeyDown={handleKeyDown}
          selectedAgent={selectedAgent}
          isLoading={isLoading}
          inputRef={inputRef}
        />
      </div>

      {/* Sessions Modal */}
      <Modal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        title={`📋 Sesiones de ${selectedAgent?.name || ''}`}
      >
        {sessions.length === 0 ? (
          <p className="sessions-empty">
            No hay sesiones activas para este agente
          </p>
        ) : (
          <div className="sessions-list">
            {sessions.map((session, idx) => (
              <div key={idx} className="session-item">
                <div>
                  <div className="session-id">{session.session_id}</div>
                  <div className="session-meta">
                    <span>💬 {session.message_count} mensajes</span>
                    {session.last_activity && (
                      <span>
                        🕒 {new Date(session.last_activity).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="btn-load-session"
                  onClick={() =>
                    loadSessionHistory(selectedAgent.id, session.session_id)
                  }
                  disabled={isLoadingSession}
                >
                  Cargar
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Documents Modal */}
      <Modal
        isOpen={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        title={`📄 Documentos de ${selectedAgent?.name || ''}`}
      >
        {agentDocuments.count === 0 ? (
          <p className="sessions-empty">
            No hay documentos vinculados a este agente
          </p>
        ) : (
          <div className="documents-info">
            <div className="document-stats">
              <div className="stat-card">
                <div className="stat-value">{agentDocuments.count}</div>
                <div className="stat-label">Chunks de documentos</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{agentDocuments.name || 'N/A'}</div>
                <div className="stat-label">Colección ChromaDB</div>
              </div>
            </div>
            <div className="document-note">
              💡 Los documentos están embedidos y listos para ser consultados mediante RAG
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Dialog */}
      {confirmAction && (
        <ConfirmDialog
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
          confirmText="Sí, continuar"
          cancelText="Cancelar"
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default App
