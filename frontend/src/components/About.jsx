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

          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-6">
            I’m Ayush Raj Tiwary, a 4th-year B.Tech student specializing in
            Artificial Intelligence and Machine Learning, and a Full Stack
            Developer focused on building modern, scalable web applications.
          </p>

          <p className="text-base md:text-lg text-gray-400 leading-loose mb-12">
            I work primarily with the MERN stack while also exploring AI/ML
            concepts like deep learning, computer vision, and model deployment.
            I enjoy turning ideas into real-world applications by combining
            software engineering with intelligent systems.
          </p>

          {/* STATS */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-6"
          >
            {/* Projects */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2 hover:bg-white/10">
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500 mb-2">
                6+
              </h3>

              <p className="text-sm text-gray-400 uppercase">
                Projects Built
              </p>
            </div>

            {/* Experience */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2 hover:bg-white/10">
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-500 mb-2">
                4th Year
              </h3>

              <p className="text-sm text-gray-400 uppercase">
                B.Tech Student
              </p>
            </div>

            {/* Focus */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2 hover:bg-white/10 col-span-2 md:col-span-1">
              <h3 className="text-4xl font-black text-white mb-2">
                Full Stack
              </h3>

              <p className="text-sm text-gray-400 uppercase">
                Developer Focus
              </p>
            </div>
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