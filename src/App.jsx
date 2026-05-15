import './App.css'
import Navbar from './components/Navbar'
import FrameScroll from './components/FrameScroll'
import About from './components/About'
import Works from './components/Works'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <main className="relative bg-[#000000]">
      <Navbar />
      <FrameScroll />
      <About />
      <Services />
      <Works />
      <Contact />
      <Footer />
    </main>
  )
}

export default App
