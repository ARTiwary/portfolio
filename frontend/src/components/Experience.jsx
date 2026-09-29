import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: 'axentra',
    title: 'Backend – AI & SaaS Innovation Intern',
    company: 'AXENTRA OS',
    logo: '/logos/axentra.png',
    location: 'Mumbai, Maharashtra, India (Remote)',
    type: 'Internship',
    dates: 'Aug 2026 — Present',
    gradient: 'from-blue-400 to-purple-500',
    summary:
      'Building backend systems for an AI-powered SaaS platform using FastAPI and PostgreSQL.',
    highlights: [
      'Developed a CRUD application with Pydantic-validated endpoints to manage customer and product records, covering the full data lifecycle from creation to deletion.',
      'Designed a customer product-recommendation and replenishment engine for a skincare e-commerce client — predicts consumption cycles (e.g. a face wash lasting ~30 days), triggers a repurchase prompt on day 25, and re-engages with a follow-up reminder 10–15 days later if the customer declines.',
    ],
    skills: ['FastAPI', 'PostgreSQL', 'Python', 'Docker', 'Pydantic'],
    documents: [],
  },
  {
    id: 'flyrank',
    title: 'Machine Learning Engineering Intern',
    company: 'FlyRank.ai',
    logo: '/logos/flyrank.png',
    location: 'Chicago, Illinois, United States (Remote)',
    type: 'Internship',
    dates: 'Jul 2026 — Sep 2026',
    gradient: 'from-purple-400 to-pink-500',
    summary:
      "Completed FlyRank's AI Internship Program, specializing in Machine Learning with an additional AI Fluency track.",
    highlights: [
      'Completed 36 practical assignments spanning data wrangling, embeddings and clustering, intent and opportunity modeling, and insight-to-action pipelines — 190+ verified hours in total.',
      "Shipped the capstone project 'Send the Link — Launch, Demo & Story,' reviewed and accepted by the lead track mentor.",
      'Completed 20 verified Anthropic Academy courses and independently qualified in two tracks: Machine Learning and AI Fluency, covering Claude Code, the Claude API, and MCP.',
    ],
    skills: ['TensorFlow', 'PyTorch', 'Machine Learning', 'Python', 'Claude API', 'MCP'],
    documents: [
      { label: 'ML certificate', href: '/certificates/flyrank-ml-certificate.pdf' },
      { label: 'AI Fluency certificate', href: '/certificates/flyrank-ai-fluency-certificate.pdf' },
      { label: 'Recommendation letter', href: '/certificates/flyrank-recommendation-letter.pdf' },
    ],
  },
];

const Experience = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: headerRef.current, start: 'top 92%', once: true },
        });

        // One trigger per card, so a tall card reveals as soon as its own top
        // enters the viewport instead of waiting on the whole list.
        gsap.utils.toArray(cardsRef.current.children).forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 28,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
            scrollTrigger: { trigger: card, start: 'top 92%', once: true },
          });
        });
      });
    }, sectionRef);

    // Re-measure trigger positions once images/fonts have loaded and whenever
    // the section's height changes, so nothing stays hidden or cut off.
    let timer;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    window.addEventListener('load', refresh);
    const ro = new ResizeObserver(refresh);
    ro.observe(sectionRef.current);
    refresh();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', refresh);
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#050505] overflow-x-clip py-28 px-6 md:px-12"
    >
      {/* Ambient background — same quiet particles as About */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30 z-0">
        <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-[15%] left-[10%] animate-[float-up_15s_linear_infinite]" />
        <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-[60%] left-[85%] animate-[float-up_20s_linear_infinite]" />
        <div className="w-1 h-1 bg-purple-500 rounded-full absolute top-[80%] left-[20%] animate-[float-up_12s_linear_infinite]" />
        <div className="w-2 h-2 bg-indigo-400 rounded-full absolute top-[30%] left-[70%] animate-[float-up_18s_linear_infinite]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* BACK TO ABOUT */}
        <Link
          to="/#about"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-white transition-colors duration-300 mb-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
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
            <path d="M19 12H5" />
            <path d="M11 18l-6-6 6-6" />
          </svg>
          Back to About
        </Link>

        {/* HEADER */}
        <div ref={headerRef} className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
            Experience
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl">
            Two internships that took me from notebooks to production — backend systems for a live
            SaaS client, and a structured machine-learning program with a shipped capstone.
          </p>
        </div>

        {/* CARDS */}
        <div ref={cardsRef} className="flex flex-col gap-8">
          {experiences.map((exp) => (
            <article
              key={exp.id}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10 transition-colors duration-300 hover:border-indigo-400/30 hover:bg-white/[0.05]"
            >
              {/* Card header */}
              <div className="flex items-start gap-5 mb-6">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-lg shadow-black/30">
                  <img
                    src={exp.logo}
                    alt={`${exp.company} logo`}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
                    {exp.title}
                  </h3>
                  <p
                    className={`text-sm md:text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r ${exp.gradient} mt-0.5`}
                  >
                    {exp.company}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{exp.location}</p>
                  <p className="text-xs md:text-sm text-gray-500">
                    {exp.type} &nbsp;·&nbsp; {exp.dates}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <p className="text-base text-gray-200 leading-relaxed mb-6">{exp.summary}</p>

              {/* Highlights */}
              <ul className="flex flex-col gap-3 mb-7">
                {exp.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm md:text-base text-gray-400 leading-relaxed"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Skills */}
              <div className="flex flex-wrap gap-x-5 gap-y-2.5 mb-6 text-sm">
                {exp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="pb-0.5 border-b border-white/10 text-gray-400 hover:text-white hover:border-indigo-400/60 transition-colors duration-300 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Documents */}
              {exp.documents.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
                  {exp.documents.map((doc) => (
                    <a
                      key={doc.href}
                      href={doc.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-gray-300 font-semibold text-xs md:text-sm tracking-wide transition-all duration-300 hover:text-white hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
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
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {doc.label}
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;