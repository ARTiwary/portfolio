import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TECH_STACK = [
  { 
    id: '01', 
    title: 'AI & Computer Vision', 
    desc: 'Designing computer vision models for image classification and real-time object detection.', 
    tech: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'Scikit-learn'] 
  },
  { 
    id: '02', 
    title: 'Generative AI Systems', 
    desc: 'Building autonomous AI agents with RAG architectures and vector-based retrieval.', 
    tech: ['Vector Databases', 'ChromaDB', 'LLM Orchestration', 'NLP', 'Data Pipelines'] 
  },
  { 
    id: '03', 
    title: 'Full-Stack Architecture', 
    desc: 'Engineering scalable, high-concurrency web systems from client to server.', 
    tech: ['Next.js', 'React.js', 'Node.js', 'PostgreSQL', 'RESTful APIs'] 
  },
  { 
    id: '04', 
    title: 'Infrastructure & DevOps', 
    desc: 'Managing deployment lifecycles with containerization and automated CI/CD workflows.', 
    tech: ['Docker', 'Linux', 'Vercel', 'Git', 'Cloud Deployment'] 
  },
  { 
    id: '05', 
    title: 'Software Engineering', 
    desc: 'Optimizing performance through data structures, algorithms, and modular design.', 
    tech: ['Java', 'C++', 'System Design', 'Algorithms', 'OOP'] 
  },
];

const Tech_Stack = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const getAsideTranslation = () => (window.innerWidth > 768 ? -600 : -300);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.set(card, { 
        z: -1000 * i, 
        opacity: i === 0 ? 1 : Math.max(0, 0.4 - (i * 0.1)), 
        filter: `blur(${i * 4}px)`,
        y: i * 20
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1.5,
        start: 'top top',
        end: '+=5000',
      }
    });

    TECH_STACK.forEach((_, step) => {
      if (step < TECH_STACK.length - 1) {
        tl.to(cardsRef.current[step], {
          z: 500,
          x: getAsideTranslation(),
          y: -100,
          opacity: 0,
          filter: 'blur(20px)',
          duration: 2,
          ease: 'power2.inOut'
        }, `step${step}`);

        for (let j = step + 1; j < TECH_STACK.length; j++) {
          const newIndex = j - step - 1;
          tl.to(cardsRef.current[j], {
            z: -1000 * newIndex,
            opacity: newIndex === 0 ? 1 : Math.max(0, 0.4 - (newIndex * 0.1)),
            filter: `blur(${newIndex * 4}px)`,
            y: newIndex === 0 ? 0 : newIndex * 20,
            duration: 2,
            ease: 'power2.inOut'
          }, `step${step}`);
        }
      }
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section 
     id="tech-stack"
      ref={containerRef} 
      className="relative w-full h-screen bg-[#050505] perspective-1500 overflow-hidden flex flex-col pt-32 lg:pt-40"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20 bg-gradient-to-b from-blue-900/10 via-transparent to-purple-900/10"></div>
      
      <div className="absolute top-8 md:top-16 left-6 md:left-12 z-50">
        <p className="text-blue-400 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-2">My Core Expertise & Stack</p>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Technical Capabilities
        </h2>
      </div>

      {/* 3D Cards Container */}
      <div className="relative w-full h-[80vh] flex items-center justify-center transform-style-3d mt-10">
        {TECH_STACK.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="absolute flex flex-col justify-start w-[85vw] max-w-[450px] p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(59,130,246,0.1)] transform-style-3d will-change-transform"
          >
            <div className="absolute top-6 right-8 text-white/10 font-black text-7xl font-sans tracking-tighter mix-blend-screen select-none">
              {item.id}
            </div>

            <div className="relative z-10 mt-12">
              <h3 className="text-3xl font-bold text-white mb-4 tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                {item.title}
              </h3>
              <p className="text-gray-300 font-light text-base md:text-lg leading-relaxed mb-6">
                {item.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tech.map((t) => (
                  <span 
                    key={t}
                    className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-full font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-transparent"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tech_Stack;