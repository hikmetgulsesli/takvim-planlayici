import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppContent from './App'
import { EventProvider } from './context/EventContext'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <EventProvider>
      <AppContent />
    </EventProvider>
  </StrictMode>,
)
