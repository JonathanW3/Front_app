import { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = '/api'

export default function useChat({ selectedAgent, onError, onSuccess }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const chatAreaRef = useRef(null)

  // Create new session ID for agent
  const newSessionId = useCallback((agent) => {
    return `web_${agent.id}_${Date.now()}`
  }, [])

  // Initialize session when agent changes
  useEffect(() => {
    if (selectedAgent) {
      setSessionId(newSessionId(selectedAgent))
      setMessages([])
    }
  }, [selectedAgent, newSessionId])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (text) => {
    const msg = text || inputMessage
    if (!msg.trim() || !selectedAgent || isLoading) return

    const userMessage = {
      role: 'user',
      content: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: msg,
        agent_id: selectedAgent.id,
        session_id: sessionId,
        use_rag: selectedAgent.use_rag !== false,
        use_sql: false,
        use_charts: selectedAgent.use_charts || false,
        temperature: 0.7,
      })

      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: response.data.model_used,
        charts: response.data.charts || [],
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      onError?.('Error al enviar mensaje: ' + (err.response?.data?.detail || err.message))
    } finally {
      setIsLoading(false)
    }
  }, [inputMessage, selectedAgent, isLoading, sessionId, onError])

  const clearChat = useCallback(() => {
    setMessages([])
    if (selectedAgent) {
      setSessionId(newSessionId(selectedAgent))
    }
    onSuccess?.('Nueva conversación iniciada')
  }, [selectedAgent, newSessionId, onSuccess])

  const loadHistory = useCallback((loadedMessages, loadedSessionId) => {
    setMessages(loadedMessages)
    setSessionId(loadedSessionId)
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sessionId,
    messagesEndRef,
    inputRef,
    chatAreaRef,
    sendMessage,
    clearChat,
    loadHistory,
    handleKeyDown,
  }
}
