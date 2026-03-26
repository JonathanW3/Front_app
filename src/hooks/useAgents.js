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
  const [organizations, setOrganizations] = useState([])
  const [selectedOrganization, setSelectedOrganization] = useState(null)
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true)
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)

  const getAgentIcon = useCallback(
    (id) => agentIcons[id] || agentIcons.default,
    []
  )

  // Load organizations list
  const loadOrganizations = useCallback(async () => {
    setIsLoadingOrgs(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/agents/organizations`)
      const orgs = response.data.organizations || []
      setOrganizations(orgs)
      return orgs
    } catch (err) {
      onError?.('Error al cargar organizaciones: ' + err.message)
      return []
    } finally {
      setIsLoadingOrgs(false)
    }
  }, [onError])

  // Load agents filtered by organization
  const loadAgents = useCallback(async (orgName) => {
    try {
      const url = orgName
        ? `${API_BASE_URL}/agents?organization=${encodeURIComponent(orgName)}`
        : `${API_BASE_URL}/agents`
      const response = await axios.get(url)
      const list = response.data.agents || []
      setAgents(list)
      if (list.length > 0) {
        setSelectedAgent(list[0])
      } else {
        setSelectedAgent(null)
      }
      return list
    } catch (err) {
      onError?.('Error al cargar agentes: ' + err.message)
      return []
    }
  }, [onError])

  // Select organization and load its agents
  const selectOrganization = useCallback((org) => {
    setSelectedOrganization(org)
    setSelectedAgent(null)
    setAgents([])
    loadAgents(org.name)
  }, [loadAgents])

  // Go back to organization selection
  const clearOrganization = useCallback(() => {
    setSelectedOrganization(null)
    setSelectedAgent(null)
    setAgents([])
  }, [])

  const selectAgent = useCallback((agent) => {
    setSelectedAgent(agent)
  }, [])

  // Load organizations on mount
  useEffect(() => {
    loadOrganizations()
  }, [loadOrganizations])

  return {
    organizations,
    selectedOrganization,
    selectOrganization,
    clearOrganization,
    isLoadingOrgs,
    agents,
    selectedAgent,
    selectAgent,
    getAgentIcon,
    loadAgents,
  }
}
