import './App.css'
import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import FrameScroll from './components/FrameScroll'
import About from './components/About'
import Works from './components/Works'
import Tech_Stack from './components/Tech-Stack'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AIAgent from './components/AIAgent'
import Experience from './components/Experience'

// New page -> start at the top.
// URL with a hash (e.g. /#about) -> scroll to that section once Home has mounted.
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      const t = setTimeout(() => ScrollTrigger.refresh(), 100)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      ScrollTrigger.refresh()
      document.querySelector(hash)?.scrollIntoView()
    }, 300)
    return () => clearTimeout(t)
  }, [pathname, hash])

  return null
}

// The main portfolio page
function Home() {
  return (
    <>
      <Navbar />
      <div id="hero"><FrameScroll /></div>
      <div id="about"><About /></div>
      <div id="tech-stack"><Tech_Stack /></div>
      <div id="works"><Works /></div>
      <div id="contact"><Contact /></div>
      <Footer />
      <AIAgent />
    </>
  )
}

function App() {
  return (
    <main className="relative bg-[#000000]">
      <ScrollManager />
      <Routes>
        {/* Home has no Experience section, so nobody sees it by scrolling */}
        <Route path="/" element={<Home />} />
        {/* Only reachable by clicking "View full experience" (or visiting /experience) */}
        <Route path="/experience" element={<Experience />} />
      </Routes>
    </main>
  )
}

export default App