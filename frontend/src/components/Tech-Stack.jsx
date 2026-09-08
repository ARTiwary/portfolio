import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TECH_STACK = [
  {
    id: '01',
    title: 'AI & Computer Vision',
    desc: 'Designing computer vision models for image classification and real-time object detection.',
    tech: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'Scikit-learn'],
  },
  {
    id: '02',
    title: 'Generative AI Systems',
    desc: 'Building autonomous AI agents with RAG architectures and vector-based retrieval.',
    tech: ['Vector Databases', 'ChromaDB', 'LLM Orchestration', 'NLP', 'Data Pipelines'],
  },
  {
    id: '03',
    title: 'Full-Stack Architecture',
    desc: 'Engineering scalable, high-concurrency web systems from client to server.',
    tech: ['Next.js', 'React.js', 'Node.js', 'PostgreSQL', 'RESTful APIs'],
  },
  {
    id: '04',
    title: 'Infrastructure & DevOps',
    desc: 'Managing deployment lifecycles with containerization and automated CI/CD workflows.',
    tech: ['Docker', 'Linux', 'Vercel', 'Git', 'Cloud Deployment'],
  },
  {
    id: '05',
    title: 'Software Engineering',
    desc: 'Optimizing performance through data structures, algorithms, and modular design.',
    tech: ['Java', 'C++', 'System Design', 'Algorithms', 'OOP'],
  },
];

const Tech_Stack = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Depth 0 = front-most (fully visible). Higher depth = further back,
    // smaller, dimmer, and blurrier — this is what actually reads as "3D"
    // rather than just a fade stack.
    const setDepth = (card, depth) => {
      if (!card) return;
      gsap.set(card, {
        z: -900 * depth,
        y: depth === 0 ? 0 : depth * 24,
        scale: 1 - depth * 0.06,
        opacity: depth === 0 ? 1 : Math.max(0, 0.45 - depth * 0.12),
        filter: `blur(${depth * 5}px)`,
        rotateX: 0,
      });
    };

    cardsRef.current.forEach((card, i) => setDepth(card, i));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        // Scroll distance scales with the number of cards, so adding a 6th
        // card later doesn't throw off the pacing.
        end: `+=${TECH_STACK.length * 1000}`,
        onUpdate: (self) => {
          const idx = Math.min(
            TECH_STACK.length - 1,
            Math.round(self.progress * (TECH_STACK.length - 1))
          );
          setActiveIndex(idx);
        },
      },
    });

    TECH_STACK.forEach((_, step) => {
      if (step === TECH_STACK.length - 1) return;
      const stepLabel = `step${step}`;

      // The current front card lifts, tilts back slightly, and drifts off
      // to the side while dissolving — feels like it's being set aside
      // rather than just fading in place.
      tl.to(
        cardsRef.current[step],
        {
          z: 400,
          x: () => (window.innerWidth > 768 ? -640 : -280),
          y: -80,
          rotateX: -10,
          scale: 1.02,
          opacity: 0,
          filter: 'blur(24px)',
          duration: 1.4,
          ease: 'power3.inOut',
        },
        stepLabel
      );

      // Every remaining card advances one position closer to the front
      for (let j = step + 1; j < TECH_STACK.length; j++) {
        const newDepth = j - step - 1;
        tl.to(
          cardsRef.current[j],
          {
            z: -900 * newDepth,
            y: newDepth === 0 ? 0 : newDepth * 24,
            scale: 1 - newDepth * 0.06,
            opacity: newDepth === 0 ? 1 : Math.max(0, 0.45 - newDepth * 0.12),
            filter: `blur(${newDepth * 5}px)`,
            duration: 1.4,
            ease: 'power3.inOut',
          },
          stepLabel
        );
      }
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      id="tech-stack"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col pt-32 lg:pt-40"
      style={{ perspective: '1600px' }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20 bg-gradient-to-b from-blue-900/10 via-transparent to-purple-900/10" />

      <div className="absolute top-8 md:top-16 left-6 md:left-12 z-50">
        <p className="text-blue-400 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-2">
          My Core Expertise & Stack
        </p>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Technical Capabilities
        </h2>
      </div>

      {/* Scroll progress rail */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-3">
        {TECH_STACK.map((item, i) => (
          <div key={item.id} className="flex items-center gap-3 justify-end">
            <span
              className={`text-[10px] tracking-widest transition-colors duration-300 ${
                i === activeIndex ? 'text-blue-400' : 'text-white/30'
              }`}
            >
              {item.id}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-6 h-1.5 bg-blue-400' : 'w-1.5 h-1.5 bg-white/20'
              }`}
            />
          </div>
        ))}
      </div>

      {/* 3D Cards Container */}
      <div
        className="relative w-full h-[80vh] flex items-center justify-center mt-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {TECH_STACK.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="absolute flex flex-col justify-start w-[85vw] max-w-[450px] p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(59,130,246,0.1)] will-change-transform"
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
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

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tech_Stack;