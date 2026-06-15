import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = ['Home', 'About', 'Works', 'Tech-Stack', 'Contact'];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 rounded-2xl bg-[#050505]/40 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] border-b-white/5 transition-all duration-300">
      
      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none mix-blend-screen opacity-50">
        <div className="w-1 h-1 bg-white rounded-full absolute top-[20%] left-[10%] animate-pulse shadow-[0_0_8px_1px_white]"></div>
        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full absolute top-[70%] left-[80%] animate-bounce shadow-[0_0_10px_2px_rgba(96,165,250,0.8)]" style={{animationDuration: '4s'}}></div>
        <div className="w-1 h-1 bg-purple-400 rounded-full absolute top-[40%] left-[50%] animate-ping shadow-[0_0_8px_2px_rgba(192,132,252,0.8)]" style={{animationDuration: '5s'}}></div>
      </div>

      <div className="relative z-10 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer">
          <span className="text-white font-sans font-bold text-2xl tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            Ayush Raj Tiwary
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-1 items-center justify-center space-x-8">
          {links.map((link) => (
            <a key={link} href={`#${link === 'Home' ? 'hero' : link.toLowerCase()}`} className="text-gray-200 font-sans font-medium text-base tracking-wide transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              {link}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block flex-shrink-0">
          <a href="#contact" className="relative overflow-hidden group px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-sans font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            <span className="relative z-10">Open to Opportunities</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </a>
        </div>

        {/* Hamburger Icon */}
        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          <div className={`w-6 h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : 'opacity-100'}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`}></div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-white/10"
          >
            <div className="flex flex-col items-center py-6 space-y-4">
              {links.map((link) => (
                <a key={link} href={`#${link === 'Home' ? 'hero' : link.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-gray-200 font-sans font-medium text-lg">
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;