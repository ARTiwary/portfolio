import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.35-3.87-1.35-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const projects = [
  {
    id: 1,
    title: 'Gesture File Transfer',
    tech: 'React, Node.js, Express.js',
    img: '/work images/gesture file transfer.png',
    link: 'https://github.com/ARTiwary/Air-gesture-recognition',
    liveLink: 'https://air-gesture-drop.netlify.app/',
  },
  {
    id: 2,
    title: 'Just Divide Game',
    tech: 'React, Tailwind',
    img: '/work images/just divide.png',
    link: 'https://github.com/ARTiwary/just-divide-game',
    liveLink: 'https://artiwary-just-divide.netlify.app/',
  },
  {
    id: 3,
    title: 'Brain Tumor Detection with Gesture Control',
    tech: 'Python, Tailwind, React.js, FastAPI, CNN Model, ResNet18, Jupyter Notebook',
    img: '/work images/brain tumor detection.png',
    link: 'https://github.com/ARTiwary/MRI-brain-tumour-detection-with-gesture-control-',
    liveLink: 'https://brain-tumor-with-gesture.netlify.app/',
  },
  {
    id: 4,
    title: 'Suraksha-Setu Tourist Safety System',
    tech: 'Python, Tailwind, React.js',
    img: '/work images/Suraksha setu.png',
    link: 'https://github.com/ARTiwary/compass-comfort-kit',
  },
  {
    id: 5,
    title: 'Road Accident Detection System',
    tech: 'Python, Tailwind, React.js, CNN Model, Jupyter Notebook, FastAPI',
    img: '/work images/Road accident.png',
    link: 'https://github.com/ARTiwary/Road_accident-_alert_system',
  },
  {
    id: 6,
    title: 'Smart Dining Assistant',
    tech: 'Next.js, Tailwind, Node.js, Express.js, Groq + LangChain',
    img: '/work images/Smart Dinning Assistent.png',
    link: 'https://github.com/ARTiwary/smart-dinning-assistent',
    liveLink: 'https://smart-dinning-assistent.vercel.app',
    featured: true,
  },
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
        },
      }
    );

    const projectCards = gsap.utils.toArray('.project-card');

    gsap.fromTo(
      projectCards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 75%',
        },
      }
    );
  }, []);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#050505] py-32 overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12">

        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col items-center justify-center text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
            Selected Work
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            AI/ML and full-stack projects I've shipped
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
              className={`project-card group rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] flex flex-col ${
                project.featured ? 'md:col-span-2' : ''
              }`}
            >
              {/* Image */}
              <div
                className={`relative w-full overflow-hidden ${
                  project.featured ? 'aspect-[21/9]' : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
                {project.featured && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-medium tracking-wide backdrop-blur-md">
                    Featured — GenAI
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-5">
                  {project.tech}
                </p>

                <div className="flex gap-3 mt-auto">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-white bg-white/5 border border-white/10 py-2.5 rounded-full transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                    >
                      <GithubIcon />
                      Code
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-500 py-2.5 rounded-full transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200"
                    >
                      <ExternalLinkIcon />
                      Live Demo
                    </a>
                  )}
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