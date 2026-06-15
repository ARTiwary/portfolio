import './App.css'
import Navbar from './components/Navbar'
import FrameScroll from './components/FrameScroll'
import About from './components/About'
import Works from './components/Works'
import Tech_Stack from './components/Tech-Stack';
import Contact from './components/Contact'
import Footer from './components/Footer'
import React from 'react';
import AIAgent from './components/AIAgent';

function App() {
  return (
    <main className="relative bg-[#000000]">
      <Navbar />
      
      {/* Assign IDs that match your Navbar hrefs */}
      <div id="hero"><FrameScroll /></div>
      <div id="about"><About /></div>
      <div id="tech-stack"><Tech_Stack /></div>
      <div id="works"><Works /></div>
      <div id="contact"><Contact /></div>
      
      <Footer />
      <AIAgent />
    </main>
  )
}

export default App