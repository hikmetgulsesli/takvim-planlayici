import { EventProvider } from './contexts/EventContext'
import { CalendarPage } from './components/CalendarPage'

function App() {
  return (
    <EventProvider>
      <CalendarPage />
    </EventProvider>
  )
}

export default App
