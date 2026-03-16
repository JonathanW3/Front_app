import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = '/api'

const agentIcons = {
  ventas: '💼',
  soporte: '🛠️',
  contabilidad: '📊',
  default: '🤖',
}

export default function useAgents({ onError }) {
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)

  const getAgentIcon = useCallback(
    (id) => agentIcons[id] || agentIcons.default,
    []
  )

  const loadAgents = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/agents`)
      const list = response.data.agents || []
      setAgents(list)
      if (list.length > 0) {
        setSelectedAgent(list[0])
      }
      return list
    } catch (err) {
      onError?.('Error al cargar agentes: ' + err.message)
      return []
    }
  }, [onError])

  const selectAgent = useCallback((agent) => {
    setSelectedAgent(agent)
  }, [])

  useEffect(() => {
    loadAgents()
  }, [loadAgents])

  return {
    agents,
    selectedAgent,
    selectAgent,
    getAgentIcon,
    loadAgents,
  }
}
