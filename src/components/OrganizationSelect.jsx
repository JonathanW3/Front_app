import WebPOSLogo from './WebPOSLogo'
import './OrganizationSelect.css'

export default function OrganizationSelect({
  organizations,
  isLoading,
  onSelect,
}) {
  return (
    <div className="org-select-screen">
      <div className="org-select-container">
        {/* Header */}
        <div className="org-select-header">
          <div className="org-select-logo">
            <WebPOSLogo size={40} white />
          </div>
          <h1 className="org-select-title">WebPOS IA</h1>
          <p className="org-select-subtitle">
            Selecciona tu organización para comenzar
          </p>
        </div>

        {/* Organization Grid */}
        {isLoading ? (
          <div className="org-select-loading">
            <div className="org-loading-spinner" />
            <p>Cargando organizaciones...</p>
          </div>
        ) : organizations.length === 0 ? (
          <div className="org-select-empty">
            <p>No hay organizaciones disponibles</p>
          </div>
        ) : (
          <div className="org-select-grid">
            {organizations.map((org) => (
              <button
                key={org.name}
                className="org-card"
                onClick={() => onSelect(org)}
              >
                <div className="org-card-icon">
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <div className="org-card-info">
                  <div className="org-card-name">{org.name}</div>
                  <div className="org-card-count">
                    {org.agent_count} {org.agent_count === 1 ? 'agente' : 'agentes'}
                  </div>
                </div>
                <div className="org-card-arrow">→</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
