import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const bioRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef(null);
  const skillsRef = useRef(null);
  const resumeRef = useRef(null);

  const bioText =
    "I'm Ayush Raj Tiwary, an AI/ML engineer and full-stack developer. On the ML side I work with PyTorch, LangChain, and vector search for GenAI and RAG; on the product side I ship it with FastAPI, React, and Node.js — turning models into things people can actually use.";
  const bioWords = bioText.split(' ');

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );

    gsap.fromTo(
      statsRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
        },
      }
    );

    // Words start dim and light up one by one as the bio line scrolls
    // through view — tied directly to scroll position (scrub: true), not
    // time, so it feels connected to the user's own scrolling rather than
    // an autoplaying animation.
    const bioWordEls = bioRef.current.querySelectorAll('.reveal-word');
    gsap.fromTo(
      bioWordEls,
      { opacity: 0.2 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.04,
        scrollTrigger: {
          trigger: bioRef.current,
          start: 'top 85%',
          end: 'top 35%',
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      skillsRef.current.children,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: skillsRef.current,
          start: 'top 90%',
        },
      }
    );

    gsap.fromTo(
      resumeRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
        },
      }
    );

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      }
    );
  }, []);

  const skills = [
    'Python & PyTorch',
    'LLMs & GenAI',
    'Vector Search / RAG',
    'Computer Vision',
    'FastAPI',
    'React & Node.js',
    'Next.js',
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden py-24"
    >
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40 z-0">
        <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-[15%] left-[10%] animate-[float-up_15s_linear_infinite]" />
        <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-[60%] left-[85%] animate-[float-up_20s_linear_infinite]" />
        <div className="w-1 h-1 bg-purple-500 rounded-full absolute top-[80%] left-[20%] animate-[float-up_12s_linear_infinite]" />
        <div className="w-2 h-2 bg-indigo-400 rounded-full absolute top-[30%] left-[70%] animate-[float-up_18s_linear_infinite]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16">

        {/* LEFT CONTENT */}
        <div
          ref={contentRef}
          className="flex-1 w-full flex flex-col justify-center"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
            About Me
          </h2>

          <p ref={bioRef} className="text-xl md:text-2xl text-white leading-relaxed mb-6">
            {bioWords.map((word, i) => (
              <span key={i} className="reveal-word inline-block mr-[0.35em]">
                {word}
              </span>
            ))}
          </p>

          <p className="text-sm md:text-base text-gray-500 mb-8">
            4th-year B.Tech student, Artificial Intelligence & Machine Learning
          </p>

          {/* SKILL PILLS */}
          <div ref={skillsRef} className="flex flex-wrap gap-2.5 mb-10">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-1.5 rounded-full text-xs md:text-sm font-medium text-gray-300 bg-white/5 border border-white/10 backdrop-blur-md"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* STATS */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-4 md:gap-6"
          >
            {/* Projects */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-5 py-6 text-center transition-transform duration-300 hover:-translate-y-2 hover:bg-white/10">
              <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500 mb-1">
                6+
              </h3>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Projects
              </p>
            </div>

            {/* Specialization */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-5 py-6 text-center transition-transform duration-300 hover:-translate-y-2 hover:bg-white/10">
              <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-500 mb-1">
                AI/ML
              </h3>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Specialization
              </p>
            </div>

            {/* Engineering */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-5 py-6 text-center transition-transform duration-300 hover:-translate-y-2 hover:bg-white/10">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-1">
                Full Stack
              </h3>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Engineering
              </p>
            </div>
          </div>

          {/* RESUME ACTIONS */}
          <div ref={resumeRef} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/resume.pdf"
              download="Ayush_Raj_Tiwary_Resume.pdf"
              className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold text-sm tracking-wide shadow-[0_8px_30px_rgba(99,102,241,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_40px_rgba(147,51,234,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
            >
              <svg
                className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="relative z-10">Download Resume</span>
              <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/15 text-gray-300 font-semibold text-sm tracking-wide transition-all duration-300 hover:text-white hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View Online
            </a>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div
          ref={imageRef}
          className="flex-1 w-full flex items-center justify-center mt-16 lg:mt-0"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96">

            {/* Glow Effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse" />

            <div className="absolute inset-4 bg-gradient-to-bl from-indigo-500/20 via-transparent to-pink-500/20 rounded-full blur-2xl animate-pulse" />

            {/* Image Container */}
            <div className="absolute inset-8 rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl">

              <img
                src="/profile.jpg"
                alt="Ayush Raj Tiwary"
                className="w-full h-full object-cover rounded-3xl transition-transform duration-500 hover:scale-105"
              />

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;