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
    height: 'h-80'
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
    height: 'h-80'
  },
  { 
    id: 4, 
    title: 'Suraksha-Setu Tourist Safety System', 
    tech: 'Python, Tailwind, React.js', 
    img: '/work images/Suraksha setu.png', 
    link: 'https://github.com/ARTiwary/compass-comfort-kit',
    height: 'h-80'
  },
  {
    id: 5,
    title: 'Road Accident Detection System',
    tech: 'Python, Tailwind, React.js, CNN Model, Jupyter Notebook, FastAPI',
    img: '/work images/Road accident.png',
    link: 'https://github.com/ARTiwary/Road_accident-_alert_system',
    height: 'h-80'
  }, 
  {
    id: 6,
    title: 'Smart Dinning Assistent',
    tech: 'Next.Js, Tailwind, Node.Js, Express.Js, Groq + LangChain',
    img: '/work images/Smart Dinning Assistent.png',
    link: 'https://github.com/ARTiwary/smart-dinning-assistent',
    liveLink: 'https://smart-dinning-assistent.vercel.app',
    height: 'h-[40rem]'
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
         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
  <div
    key={project.id}
    // Perspective wrapper
    className={`project-card group h-80 [perspective:1000px]`} 
  >
    {/* Flip Container */}
    <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
      
      {/* FRONT FACE: Image and Title */}
      <div className="absolute inset-0 w-full h-full bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 [backface-visibility:hidden]">
        <img
          src={project.img}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
        </div>
      </div>

      {/* BACK FACE: Links and Tech */}
      <div className="absolute inset-0 w-full h-full bg-neutral-900 rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center gap-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
        <h3 className="text-xl font-bold text-white text-center">{project.title}</h3>
        <p className="text-xs text-blue-400 text-center px-4">{project.tech}</p>
        
        <div className="flex flex-col gap-3 w-full mt-4">
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="text-center text-white bg-white/10 py-3 rounded-full hover:bg-white/20 transition-all">
              GitHub →
            </a>
          )}
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-center text-white bg-emerald-600 py-3 rounded-full hover:bg-emerald-500 transition-all">
              Live Demo 🚀
            </a>
          )}
        </div>
      </div>
      
    </div>
  </div>
))}
        </div>
      </div>
    </section>
  );
};

export default Works;