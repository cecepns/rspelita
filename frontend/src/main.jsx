import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'
import App from './App.jsx'
import FullPageSplash from './components/layout/FullPageSplash.jsx'

function AppWithProviders() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic',
      disable: () => window.innerWidth < 768,
    })
  }, [])

  return (
    <FullPageSplash>
      <App />
    </FullPageSplash>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>,
)
