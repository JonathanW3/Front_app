import { useState, useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = '/api'

export default function useSessions({ selectedAgent, onError, onSuccess, onLoadHistory }) {
  const [sessions, setSessions] = useState([])
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showDocumentsModal, setShowDocumentsModal] = useState(false)
  const [agentDocuments, setAgentDocuments] = useState({ count: 0 })
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  const loadSessions = useCallback(async () => {
    if (!selectedAgent) return
    try {
      const response = await axios.get(`${API_BASE_URL}/sessions`, {
        params: { agent_id: selectedAgent.id },
      })
      setSessions(response.data.sessions || [])
      setShowSessionModal(true)
    } catch (err) {
      onError?.('Error al cargar sesiones: ' + err.message)
    }
  }, [selectedAgent, onError])

  const loadDocuments = useCallback(async () => {
    if (!selectedAgent) return
    try {
      const response = await axios.get(`${API_BASE_URL}/chromadb/agents/${selectedAgent.id}`)
      setAgentDocuments(response.data)
      setShowDocumentsModal(true)
    } catch (err) {
      onError?.('Error al cargar documentos: ' + err.message)
    }
  }, [selectedAgent, onError])

  const loadSessionHistory = useCallback(async (agentId, sessionIdToLoad) => {
    try {
      setIsLoadingSession(true)
      const response = await axios.get(`${API_BASE_URL}/sessions/${agentId}/${sessionIdToLoad}`)
      const history = response.data.history || []
      const loadedMessages = history.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: msg.model,
      }))
      onLoadHistory?.(loadedMessages, sessionIdToLoad)
      setShowSessionModal(false)
      onSuccess?.('Sesión cargada correctamente')
    } catch (err) {
      onError?.('Error al cargar historial: ' + err.message)
    } finally {
      setIsLoadingSession(false)
    }
  }, [onError, onSuccess, onLoadHistory])

  return {
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
  }
}
