import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    // Fade in animation for footer contents
    gsap.fromTo(footerRef.current.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
        }
      }
    );
  }, []);

  return (
    <footer className="relative w-full bg-[#050505] pt-24 pb-8 overflow-hidden border-t border-white/5">
      {/* Subtle floating particles confined to footer */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20 z-0">
        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full absolute top-[30%] left-[20%] animate-[float-up_12s_linear_infinite]" style={{boxShadow: '0 0 10px 2px rgba(96,165,250,0.6)'}}></div>
        <div className="w-1 h-1 bg-white rounded-full absolute top-[60%] left-[80%] animate-[float-up_18s_linear_infinite]" style={{boxShadow: '0 0 8px 1px white'}}></div>
        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full absolute top-[40%] left-[50%] animate-[float-up_15s_linear_infinite]" style={{boxShadow: '0 0 10px 2px rgba(192,132,252,0.6)'}}></div>
      </div>

      {/* Gentle ambient glow near center floor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-[50vw] h-[30vh] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div ref={footerRef} className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Top: Call to Action */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-sans font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-4">
            Let’s Build Something Amazing Together
          </h2>
          <p className="text-gray-400 font-sans text-lg tracking-wide">
            Open for freelance and collaborations
          </p>
        </div>

        {/* Center / Layout: Navigation Links & Socials wrapped in a glassmorphism pill (optional layout flair) or just flex */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 py-8 border-t border-b border-white/10">
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6 md:gap-10">
            {['Home', 'About', 'Works', 'Services', 'Contact'].map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`}
                className="text-gray-300 font-sans font-medium text-sm tracking-widest uppercase transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {/* GitHub */}
            <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] hover:scale-110">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] hover:scale-110">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] hover:scale-110">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>

        </div>

        {/* Bottom: Copyright */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 font-sans text-xs tracking-wider">
            © 2026 Ayush Raj Tiwary. All rights reserved
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
