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
    link: 'https://github.com/ARTiwary/Air-gesture-recognition',
    liveLink: 'https://air-gesture-drop.netlify.app/',
    height: 'h-96'
  },
  { 
    id: 2, 
    title: 'Just Divide Game', 
    tech: 'React, Tailwind', 
    img: '/work images/just divide.png', 
    link: 'https://github.com/ARTiwary/just-divide-game',
    liveLink: 'https://artiwary-just-divide.netlify.app/',
    height: 'h-80' 
  },
  { 
    id: 3, 
    title: 'Brain Tumor Detection with Gesture Control', 
    tech: 'Python, Tailwind, React.js, FastAPI, CNN Model, ResNet18, Jupyter Notebook', 
    img: '/work images/brain tumor detection.png', 
    link: 'https://github.com/ARTiwary/MRI-brain-tumour-detection-with-gesture-control-',
    liveLink: 'https://brain-tumor-with-gesture.netlify.app/',
    height: 'h-[32rem]'
  },
  { 
    id: 4, 
    title: 'Suraksha-Setu Tourist Safety System', 
    tech: 'Python, Tailwind, React.js', 
    img: '/work images/Suraksha setu.png', 
    link: 'https://github.com/ARTiwary/compass-comfort-kit',
    height: 'h-[32rem]'
  },
  {
    id: 5,
    title: 'Road Accident Detection System',
    tech: 'Python, Tailwind, React.js, CNN Model, Jupyter Notebook, FastAPI',
    img: '/work images/Road accident.png',
    link: 'https://github.com/ARTiwary/Road_accident-_alert_system',
    height: 'h-[42rem]'
  }
];

const Works = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
        }
      }
    );

    const projectCards = gsap.utils.toArray('.project-card');

    gsap.fromTo(
      projectCards,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 75%',
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
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30 z-0" />

      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12">

        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col items-center justify-center text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
            Selected Works and Problem Solving Projects
          </h2>

          <p className="text-lg md:text-xl text-gray-400 uppercase">
            A collection of my recent creations
          </p>
        </div>

        {/* Gallery */}
        <div
          ref={galleryRef}
          className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8"
        >
          {projects.map((project) => {
            return (
              <div
                key={project.id}
                className={`project-card group relative break-inside-avoid rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md ${project.height}`}
              >
                {/* IMAGE CONTAINER */}
                <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden relative">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30">
                    <div className="flex gap-3">
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-white text-sm md:text-lg font-semibold bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
                        >
                          Code →
                        </a>
                      )}
                      
                      {project.liveLink && (
                        <a 
                          href={project.liveLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-white text-sm md:text-lg font-semibold bg-emerald-500/20 px-6 py-3 rounded-full backdrop-blur-md border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                        >
                          Live Demo 🚀
                        </a>
                      )}

                      {!project.link && !project.liveLink && (
                        <div className="text-white text-sm md:text-lg font-semibold bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/20 opacity-50">
                          No link available
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* PROJECT INFO */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-20 pointer-events-none">
                  <span className="text-blue-400 text-xs uppercase tracking-[0.2em]">
                    {project.tech}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                    {project.title}
                  </h3>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Works;