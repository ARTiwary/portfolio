import './App.css'
import Navbar from './components/Navbar'
import FrameScroll from './components/FrameScroll'
import About from './components/About'
import Works from './components/Works'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import React from 'react';
import AIAgent from './components/AIAgent';

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
      
      {/* 🤖 Floating Custom AI Agent Widget */}
      <AIAgent />
    </main>
  )
}

export default App