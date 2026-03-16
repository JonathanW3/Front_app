# RAG Chat Frontend - React

Frontend de chat para interactuar con agentes del sistema RAG Multi-Agent.

## 🚀 Inicio Rápido

### Instalación

```bash
cd front_app
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Producción

```bash
npm run build
npm run preview
```

## 📋 Características

- ✅ **Selector de Agentes**: Elige entre todos los agentes configurados
- 💬 **Chat en Tiempo Real**: Interfaz de mensajería fluida
- 🎨 **UI Moderna**: Diseño atractivo con gradientes y animaciones
- 📱 **Responsivo**: Funciona en desktop y móvil
- 🔄 **Auto-scroll**: Se desplaza automáticamente a nuevos mensajes
- 🗑️ **Limpieza de Chat**: Reinicia la conversación con un click
- 📊 **Indicadores**: Muestra modelo LLM, RAG y SQLite del agente
- ⚡ **Indicador de Escritura**: Animación mientras el agente responde
- 🚨 **Manejo de Errores**: Mensajes claros de error

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool y dev server
- **Axios** - Cliente HTTP
- **CSS moderno** - Gradientes, animaciones, flexbox

## 📡 API Backend

La aplicación se conecta a la API FastAPI en `http://localhost:8000`:

- `GET /api/agents` - Listar agentes
- `POST /api/chat` - Enviar mensajes

El proxy de Vite redirige `/api/*` a `http://localhost:8000/*`

## 🎨 Personalización

### Cambiar colores

Edita `src/App.css` y modifica los gradientes:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Cambiar puerto

Edita `vite.config.js`:

```js
server: {
  port: 3000  // Cambia a tu puerto preferido
}
```

## 📦 Estructura

```
front_app/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos del chat
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── index.html           # HTML base
├── package.json         # Dependencias
├── vite.config.js       # Configuración Vite
└── README.md            # Este archivo
```

## 🔧 Requisitos

- Node.js 16+ 
- npm o yarn
- Backend RAG API corriendo en puerto 8000

## 🐛 Troubleshooting

### Error de conexión a la API

Verifica que el backend esté corriendo:
```bash
cd ..
uvicorn app.main:app --reload
```

### Puerto 3000 ocupado

Cambia el puerto en `vite.config.js` o cierra la aplicación que lo usa.

### Errores de CORS

El proxy de Vite debe manejar CORS automáticamente. Si hay problemas, verifica la configuración del backend.

## 📄 Licencia

MIT
