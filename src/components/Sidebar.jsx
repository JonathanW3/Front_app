import WebPOSLogo from './WebPOSLogo'
import './Sidebar.css'

export default function Sidebar({
  agents,
  selectedAgent,
  onSelectAgent,
  onNewChat,
  sidebarOpen,
  getAgentIcon,
  organizationName,
  onChangeOrganization,
}) {
  const handleAgentClick = (agent) => {
    onSelectAgent(agent)
    // Auto-close sidebar on mobile
    if (window.innerWidth <= 768) {
      // Dispatch custom event for parent to handle
      window.dispatchEvent(new CustomEvent('closeSidebar'))
    }
  }

  return (
    <nav
      className={`sidebar ${sidebarOpen ? '' : 'closed'}`}
      role="navigation"
      aria-label="Panel de agentes"
    >
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <WebPOSLogo size={28} white />
        </div>
        <div className="sidebar-logo-text">
          <h2>WebPOS</h2>
          <span>INTELIGENCIA ARTIFICIAL</span>
        </div>
      </div>

      {/* New Chat */}
      <div className="sidebar-new-chat">
        <button
          className="btn-new-chat"
          onClick={onNewChat}
          aria-label="Iniciar nueva conversación"
        >
          <span className="plus-icon">+</span> Nueva Conversación
        </button>
      </div>

      {/* Organization Badge */}
      {organizationName && (
        <div className="sidebar-org-badge">
          <div className="sidebar-org-info">
            <span className="sidebar-org-label">ORGANIZACIÓN</span>
            <span className="sidebar-org-name">{organizationName}</span>
          </div>
          <button
            className="btn-change-org"
            onClick={onChangeOrganization}
            aria-label="Cambiar organización"
            title="Cambiar organización"
          >
            ↩
          </button>
        </div>
      )}

      {/* Agents Label */}
      <div className="sidebar-agents-label" id="agents-label">Agentes disponibles</div>

      {/* Agents List */}
      <div className="sidebar-agents-list" role="listbox" aria-labelledby="agents-label">
        {agents.map((agent) => (
          <button
            key={agent.id}
            className={`agent-btn ${selectedAgent?.id === agent.id ? 'active' : ''}`}
            onClick={() => handleAgentClick(agent)}
            role="option"
            aria-selected={selectedAgent?.id === agent.id}
            aria-label={`Agente ${agent.name}, modelo ${agent.llm_model}`}
          >
            <div className="agent-btn-icon">
              {getAgentIcon(agent.id)}
            </div>
            <div className="agent-btn-info">
              <div className="agent-btn-name">{agent.name}</div>
              <div className="agent-btn-model">
                <span className={`status-dot ${selectedAgent?.id === agent.id ? 'active' : ''}`} />
                {agent.llm_model}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-avatar">U</div>
        <div className="sidebar-footer-info">
          <div className="sidebar-footer-name">Usuario</div>
          <div className="sidebar-footer-status">Conectado</div>
        </div>
        <div className="online-dot" aria-label="Estado: en línea" />
      </div>
    </nav>
  )
}
