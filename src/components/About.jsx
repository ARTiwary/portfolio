import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Fade in text content block
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, 
        y: 0, 
        duration: 1.5, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );

    // Render Stats stagger
    gsap.fromTo(statsRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1, 
        y: 0, 
        duration: 1, 
        stagger: 0.2, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 85%",
        }
      }
    );

    // Glowing abstraction fade in
    gsap.fromTo(imageRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        }
      }
    );
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="relative w-full min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden py-24"
    >
      {/* Subtle anti-gravity floating particles specific to About section */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40 z-0">
        <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-[15%] left-[10%] animate-[float-up_15s_linear_infinite]" style={{boxShadow: '0 0 10px 2px white'}}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-[60%] left-[85%] animate-[float-up_20s_linear_infinite]" style={{boxShadow: '0 0 15px 3px rgba(59,130,246,0.5)'}}></div>
        <div className="w-1 h-1 bg-purple-500 rounded-full absolute top-[80%] left-[20%] animate-[float-up_12s_linear_infinite]" style={{boxShadow: '0 0 12px 2px rgba(168,85,247,0.5)'}}></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full absolute top-[30%] left-[70%] animate-[float-up_18s_linear_infinite]" style={{boxShadow: '0 0 10px 2px rgba(129,140,248,0.4)'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Side: Content */}
        <div ref={contentRef} className="flex-1 w-full flex flex-col justify-center">
          <h2 className="text-5xl md:text-7xl font-sans font-black text-white tracking-tight mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            About Me
          </h2>
          
          <p className="text-xl md:text-2xl font-sans font-light text-gray-200 leading-relaxed mb-6">
           I’m Ayush Raj Tiwary, a Full Stack Developer passionate about building scalable web applications and intelligent AI-driven solutions.
          </p>
          
          <p className="text-base md:text-lg font-sans font-light text-gray-400 leading-loose mb-12">
            I blend deep technical expertise with a creative, problem-solving mindset. Whether it’s building scalable MERN stack applications, developing intelligent machine learning models with Python and PyTorch, or crafting pixel-perfect UI experiences, I bridge the gap between engineering, AI, and creativity.
          </p>

          {/* Stats Section */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* Project Stat */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
               <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500 mb-2">5</h3>
               <p className="text-sm tracking-wide text-gray-400 uppercase font-medium">Projects</p>
            </div>
            {/* Experience Stat */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
               <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-500 mb-2">0</h3>
               <p className="text-sm tracking-wide text-gray-400 uppercase font-medium">Experience</p>
            </div>
            {/* Clients Stat */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] col-span-2 md:col-span-1">
               <h3 className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] mb-2">100%</h3>
               <p className="text-sm tracking-wide text-gray-400 uppercase font-medium">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Right Side: Abstract Glowing Representation */}
        <div ref={imageRef} className="flex-1 w-full flex items-center justify-center mt-16 lg:mt-0">
           <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Soft glow accents / Abstract 3D silhouette representation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s'}}></div>
              <div className="absolute inset-4 bg-gradient-to-bl from-indigo-500/20 via-transparent to-pink-500/20 rounded-full blur-2xl animate-pulse" style={{animationDuration: '8s', animationDirection: 'reverse'}}></div>
              
              {/* Central structure containing an abstract visual or placeholder for developer image */}
              <div className="absolute inset-8 rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(168,85,247,0.15)] flex items-center justify-center overflow-hidden group">
                 {/* This represents the 'particles forming a silhouette' / clean developer image */}
                 <div className="w-full h-full relative opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl mix-blend-screen"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-xl mix-blend-screen"></div>
                    
                    {/* Minimal geometric placeholder for silhouette */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                       <div className="w-16 h-20 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm mb-3"></div>
                       <div className="w-32 h-24 bg-white/5 border border-white/10 rounded-t-3xl backdrop-blur-sm"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        
      </div>
    </section>
  );
};

export default About;
