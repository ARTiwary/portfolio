import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiencePreview = [
  {
    title: 'Backend – AI & SaaS Innovation Intern',
    company: 'AXENTRA OS',
    dates: 'Aug 2026 — Present',
  },
  {
    title: 'Machine Learning Engineering Intern',
    company: 'FlyRank.ai',
    dates: 'Jul 2026 — Sep 2026',
  },
];

const skills = [
  'Python & PyTorch',
  'LLMs & GenAI',
  'Vector Search / RAG',
  'Computer Vision',
  'FastAPI',
  'React & Node.js',
  'Next.js',
];

const About = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const headerRef = useRef(null);
  const underlineRef = useRef(null);
  const metaRef = useRef(null);
  const bioRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const resumeRef = useRef(null);

  const bioText =
    "I'm Ayush Raj Tiwary, an AI/ML engineer and full-stack developer. On the ML side I work with PyTorch, LangChain, and vector search for GenAI and RAG; on the product side I ship it with FastAPI, React, and Node.js — turning models into things people can actually use.";
  const bioWords = bioText.split(' ');

  useEffect(() => {
    const path = underlineRef.current;
    const pathLength = path.getTotalLength();
    gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    const mm = gsap.matchMedia();

    mm.add(
      { reduce: '(prefers-reduced-motion: reduce)', full: '(prefers-reduced-motion: no-preference)' },
      (context) => {
        const { reduce } = context.conditions;
        const headlineWords = headerRef.current.querySelectorAll('.headline-word');

        if (reduce) {
          gsap.set([headlineWords, contentRef.current, imageRef.current, metaRef.current], { clearProps: 'all' });
          gsap.set(path, { strokeDashoffset: 0 });
        } else {
          // Single orchestrated entrance: headline rises like a curtain,
          // then one hand-drawn underline stroke ties the moment together.
          gsap
            .timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 68%',
                toggleActions: 'play none none reverse',
              },
              defaults: { ease: 'power4.out' },
            })
            .fromTo(headlineWords, { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.09 })
            .to(path, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, '-=0.45')
            .fromTo(metaRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
            .fromTo(
              imageRef.current,
              { opacity: 0, scale: 0.94, x: 20 },
              { opacity: 1, scale: 1, x: 0, duration: 1.1, ease: 'power3.out' },
              '-=0.8'
            );

          // Bio reads in as a quiet, fast cascade.
          gsap.fromTo(
            bioRef.current.querySelectorAll('.reveal-word'),
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.012,
              scrollTrigger: { trigger: bioRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
            }
          );

          gsap.fromTo(
            skillsRef.current.children,
            { opacity: 0, y: 6 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.04,
              ease: 'power2.out',
              scrollTrigger: { trigger: skillsRef.current, start: 'top 90%' },
            }
          );

          gsap.fromTo(
            statsRef.current.children,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: { trigger: statsRef.current, start: 'top 88%' },
            }
          );

          gsap.fromTo(
            experienceRef.current.children,
            { opacity: 0, x: -16 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.14,
              ease: 'power3.out',
              scrollTrigger: { trigger: experienceRef.current, start: 'top 90%' },
            }
          );

          gsap.fromTo(
            resumeRef.current,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: { trigger: resumeRef.current, start: 'top 95%' },
            }
          );
        }
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden py-28"
    >
      {/* Ambient background — kept quiet so it never competes with content */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30 z-0">
        <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-[15%] left-[10%] animate-[float-up_15s_linear_infinite]" />
        <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-[60%] left-[85%] animate-[float-up_20s_linear_infinite]" />
        <div className="w-1 h-1 bg-purple-500 rounded-full absolute top-[80%] left-[20%] animate-[float-up_12s_linear_infinite]" />
        <div className="w-2 h-2 bg-indigo-400 rounded-full absolute top-[30%] left-[70%] animate-[float-up_18s_linear_infinite]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[88rem] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-14 lg:gap-16">
        {/* LEFT CONTENT */}
        <div ref={contentRef} className="w-full lg:w-[62%] flex flex-col justify-center lg:-ml-4 xl:-ml-8">
          {/* Headline + single accent flourish */}
          <div className="relative inline-block mb-4 w-fit">
            <h2
              ref={headerRef}
              className="text-5xl md:text-7xl font-black text-white tracking-tight flex flex-wrap gap-x-4"
            >
              <span className="overflow-hidden inline-block pb-1">
                <span className="headline-word inline-block">About</span>
              </span>
              <span className="overflow-hidden inline-block pb-1">
                <span className="headline-word inline-block">Me</span>
              </span>
            </h2>
            <svg
              className="absolute -bottom-1 left-1 w-[92%] h-3"
              viewBox="0 0 320 12"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                ref={underlineRef}
                d="M2 8 C 70 2, 170 11, 318 4"
                stroke="url(#aboutUnderlineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="aboutUnderlineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="55%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <p ref={metaRef} className="text-sm md:text-base text-gray-500 mb-7">
            4th-year B.Tech student, Artificial Intelligence &amp; Machine Learning
          </p>

          <p ref={bioRef} className="text-xl md:text-2xl text-white leading-relaxed mb-9 font-light max-w-2xl">
            {bioWords.map((word, i) => (
              <span key={i} className="reveal-word inline-block mr-[0.32em]">
                {word}
              </span>
            ))}
          </p>

          {/* SKILLS */}
          <div ref={skillsRef} className="flex flex-wrap gap-x-5 gap-y-2.5 mb-11 text-sm md:text-[0.95rem]">
            {skills.map((skill) => (
              <span
                key={skill}
                className="pb-0.5 border-b border-white/10 text-gray-400 hover:text-white hover:border-indigo-400/60 transition-colors duration-300 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* STATS */}
          <div ref={statsRef} className="grid grid-cols-3 gap-6 sm:gap-8">
            <div className="border-t border-white/10 pt-4">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">6+</h3>
              <p className="text-xs md:text-sm text-gray-500">Projects shipped</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500 mb-1">
                AI/ML
              </h3>
              <p className="text-xs md:text-sm text-gray-500">Specialization</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-1">Full-stack</h3>
              <p className="text-xs md:text-sm text-gray-500">Engineering</p>
            </div>
          </div>

          {/* EXPERIENCE PREVIEW — a genuine timeline */}
          <div className="mt-12">
            <h3 className="text-sm text-gray-500 mb-4">Experience</h3>
            <div ref={experienceRef} className="relative flex flex-col gap-6 pl-6 border-l border-white/10">
              {experiencePreview.map((exp) => (
                <div key={exp.company} className="relative">
                  <span className="absolute -left-7 top-1.5 w-2 h-2 rounded-full bg-indigo-400 ring-4 ring-[#050505]" />
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <p className="text-sm md:text-base font-semibold text-white">{exp.title}</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{exp.dates}</span>
                  </div>
                  <p className="text-sm text-gray-400">{exp.company}</p>
                </div>
              ))}

              <Link
                to="/experience"
                className="relative z-20 inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 group w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
              >
                View full experience
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* RESUME ACTIONS */}
          <div ref={resumeRef} className="mt-11 flex flex-wrap items-center gap-4">
            <a
              href="/resume.pdf"
              download="Ayush_Raj_Tiwary_Resume.pdf"
              className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold text-sm tracking-wide shadow-[0_8px_30px_rgba(99,102,241,0.3)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_40px_rgba(147,51,234,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
            >
              <svg
                className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
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
                aria-hidden="true"
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
        <div ref={imageRef} className="w-full lg:w-[38%] flex items-center justify-center mt-4 lg:mt-0">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-[26rem] md:h-[26rem]">
            <div className="absolute -inset-6 bg-gradient-to-br from-blue-600/25 via-purple-500/10 to-transparent rounded-[2rem] blur-3xl" />
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-[1.75rem] border border-indigo-400/25" />
            <div className="relative w-full h-full rounded-[1.75rem] overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl">
              <img
                src="/profile.jpg"
                alt="Ayush Raj Tiwary"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;