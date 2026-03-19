import { useState, useCallback } from 'react'
import createPlotlyComponent from 'react-plotly.js/factory'
import Plotly from 'plotly.js-dist-min'
import './ChartBlock.css'

const Plot = createPlotlyComponent(Plotly)

export default function ChartBlock({ chart, index }) {
  const [fullscreen, setFullscreen] = useState(false)

  const handleDownload = useCallback(() => {
    const graphDiv = document.getElementById(`chart-${index}`)
    if (graphDiv) {
      Plotly.downloadImage(graphDiv, {
        format: 'png',
        width: 1200,
        height: 700,
        filename: `grafico-${index + 1}`,
      })
    }
  }, [index])

  const layout = {
    ...chart.layout,
    autosize: true,
    margin: { t: 40, r: 30, b: 50, l: 60, ...(chart.layout?.margin || {}) },
    paper_bgcolor: 'transparent',
    plot_bgcolor: '#fafbfd',
    font: { family: 'Inter, system-ui, sans-serif', size: 12, color: '#334155' },
  }

  const config = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    locale: 'es',
  }

  return (
    <>
      <div className="chart-block">
        <div className="chart-toolbar">
          <span className="chart-label">Gráfico {index + 1}</span>
          <div className="chart-toolbar-actions">
            <button
              className="chart-action-btn"
              onClick={handleDownload}
              title="Descargar PNG"
              aria-label="Descargar gráfico como imagen"
            >
              Descargar
            </button>
            <button
              className="chart-action-btn"
              onClick={() => setFullscreen(true)}
              title="Ver en pantalla completa"
              aria-label="Expandir gráfico"
            >
              Expandir
            </button>
          </div>
        </div>
        <div className="chart-container">
          <Plot
            divId={`chart-${index}`}
            data={chart.data}
            layout={layout}
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
          />
        </div>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div className="chart-fullscreen-overlay" onClick={() => setFullscreen(false)}>
          <div className="chart-fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="chart-fullscreen-close"
              onClick={() => setFullscreen(false)}
              aria-label="Cerrar pantalla completa"
            >
              Cerrar
            </button>
            <Plot
              data={chart.data}
              layout={{ ...layout, height: undefined }}
              config={config}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler
            />
          </div>
        </div>
      )}
    </>
  )
}
