import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
{ 
  id: 1,
  title: 'Gesture File Transfer',
  tech: 'React, Node.js, Express.js',
  img: '/work images/gesture file transfer.png',
  height: 'h-96'
},
  { 
    id: 2, 
    title: 'Just Divide Game', 
    tech: 'React, Tailwind', 
    img: '/work images/just divide.png', 
    height: 'h-80' 
  },
  { 
    id: 3, 
     title: 'Brain Tumor Detection with gesture Control', 
    tech: 'Python, Tailwind, React.js, fastAPI, CNN model, Resnet18 model,', 
    img: '/work images/brain tumor detection.png', 
    height: 'h-[32rem]'
  }
];

const Works = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    // Header fade-in animation
    gsap.fromTo(headerRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1, 
        y: 0, 
        duration: 1, 
        stagger: 0.2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        }
      }
    );

    // Gallery masonry item stagger
    const projectCards = gsap.utils.toArray('.project-card');
    gsap.fromTo(projectCards,
      { opacity: 0, y: 100 },
      {
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        stagger: 0.15, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 75%",
        }
      }
    );

  }, []);

  return (
    <section 
      id="works" 
      ref={sectionRef} 
      className="relative w-full min-h-screen bg-[#050505] py-32 overflow-hidden"
    >
      {/* Anti-gravity particles isolated to the works section */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30 z-0">
        <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-[80%] left-[10%] animate-[float-up_17s_linear_infinite]" style={{boxShadow: '0 0 10px 2px white'}}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-[40%] left-[85%] animate-[float-up_22s_linear_infinite]" style={{boxShadow: '0 0 15px 3px rgba(59,130,246,0.5)'}}></div>
        <div className="w-1 h-1 bg-purple-500 rounded-full absolute top-[70%] left-[30%] animate-[float-up_14s_linear_infinite]" style={{boxShadow: '0 0 12px 2px rgba(168,85,247,0.5)'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div ref={headerRef} className="flex flex-col items-center justify-center text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-sans font-black text-white tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Selected Works
          </h2>
          <p className="text-lg md:text-xl font-sans font-light text-gray-400 tracking-wide uppercase">
            A collection of my recent creations
          </p>
        </div>

        {/* Masonry Gallery */}
        <div 
          ref={galleryRef} 
          className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8"
        >
          {projects.map((project) => (
            <div 
              key={project.id} 
              className={`project-card group relative break-inside-avoid rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/5 ${project.height}`}
            >
              {/* Soft glow behind item */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] pointer-events-none mix-blend-screen"></div>
              
              {/* Image with zoom effect */}
              <img 
                src={project.img} 
                alt={project.title}
                className="w-full h-full object-cover origin-center transition-transform duration-[800ms] ease-out group-hover:scale-105"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>

              {/* Project Info appearing on hover */}
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                <span className="text-blue-400 font-sans font-semibold text-xs tracking-[0.2em] uppercase mb-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {project.tech}
                </span>
                <h3 className="text-3xl font-sans font-bold text-white tracking-tight opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-150 drop-shadow-md">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Works;
