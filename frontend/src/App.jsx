import { useEffect, useState } from 'react'
import { PhaseCtx, phaseOf } from './phase'
import TimeSwitch from './components/TimeSwitch'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Cursor from './components/Cursor'
import Marquee from './components/Marquee'
import Stats from './components/Stats'
import Work from './components/Work'
import Experience from './components/Experience'
import Stack from './components/Stack'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AIAgent from './components/AIAgent'

export default function App() {
  const [mode, setMode] = useState('auto')
  const [auto, setAuto] = useState(phaseOf())
  useEffect(() => { const t = setInterval(() => setAuto(phaseOf()), 60000); return () => clearInterval(t) }, [])
  const phase = mode === 'auto' ? auto : mode
  useEffect(() => { document.documentElement.dataset.phase = phase }, [phase])
  return (
    <PhaseCtx.Provider value={phase}>
    <main className="relative bg-bg">
      <Cursor />
      <Navbar />
      <Hero />
      <Marquee />
      <Stats />
      <Work />
      <Experience />
      <Stack />
      <div id="contact"><Contact /></div>
      <Footer />
      <AIAgent />
      <TimeSwitch mode={mode} setMode={setMode} auto={auto} />
    </main>
    </PhaseCtx.Provider>
  )
}
