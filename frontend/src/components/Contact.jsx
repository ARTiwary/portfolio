import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const formRef = useRef(null);

  // 1. Form States
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Fade in left side content
    gsap.fromTo(leftRef.current.children,
      { opacity: 0, x: -30 },
      {
        opacity: 1, 
        x: 0, 
        duration: 1, 
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      }
    );

    // Fade in form fields (only runs if form exists in DOM)
    if (formRef.current) {
      gsap.fromTo(formRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }
  }, [isSubmitted]); // Re-run or handle cleanly if visibility shifts

  // 2. Handle Inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear errors inline as user types
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  // 3. Form Validation Logic
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) newErrors.message = 'Message cannot be empty';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // --- CHOOSE YOUR BACKEND HERE (See Step 2) ---
      // For now, we simulate an API call timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // If success:
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' }); // Clear data
    } catch (error) {
      console.error("Submission failed", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className="relative w-full min-h-screen bg-[#050505] flex items-center justify-center py-24 overflow-hidden"
    >
      {/* Calm subtle particles */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20 z-0">
        <div className="w-1 h-1 bg-white rounded-full absolute top-[20%] left-[10%] animate-[float-up_20s_linear_infinite]" style={{boxShadow: '0 0 10px 2px white'}}></div>
        <div className="w-1.5 h-1.5 bg-blue-300 rounded-full absolute top-[70%] left-[80%] animate-[float-up_25s_linear_infinite]" style={{boxShadow: '0 0 15px 3px rgba(96,165,250,0.5)'}}></div>
        <div className="w-1 h-1 bg-purple-300 rounded-full absolute top-[50%] left-[50%] animate-[float-up_18s_linear_infinite]" style={{boxShadow: '0 0 12px 2px rgba(168,85,247,0.5)'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 md:gap-8 items-center justify-between">
        
        {/* Left Side: Header and Subtext */}
        <div ref={leftRef} className="flex-1 w-full flex flex-col justify-center">
          <h2 className="text-5xl md:text-7xl font-sans font-black text-white tracking-tight mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Let’s Work Together
          </h2>
          <p className="text-xl md:text-2xl font-sans font-light text-gray-300 leading-relaxed mb-10 max-w-md tracking-wide">
            Have a project in mind? Let’s build something amazing. Fill out the form or reach out via social media.
          </p>

          {/* Social Icons row */}
          <div className="flex gap-6 items-center">
            <a href="https://www.linkedin.com/in/ayush-raj-tiwary-3b4392227" target="_blank" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://github.com/ARTiwary" target="_blank" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="mailto:ayushrajtiwary07@gmail.com" target="_blank" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/></svg>
            </a>
          </div>
        </div>

        {/* Right Side: Form / Success Box */}
        <div className="flex-1 w-full max-w-xl bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] min-h-[450px] flex flex-col justify-center">
          
          {!isSubmitted ? (
            <form ref={formRef} className="flex flex-col gap-6" onSubmit={handleSubmit}>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-sans font-medium text-gray-400 ml-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ayush Raj Tiwary" 
                    className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-white font-sans placeholder-gray-600 focus:outline-none focus:ring-1 transition-all duration-300 ${errors.name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/50 focus:bg-white/10'}`}
                  />
                  {errors.name && <span className="text-xs text-red-400 ml-1">{errors.name}</span>}
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-sans font-medium text-gray-400 ml-1">Email</label>
                  <input 
                    type="text" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ayush@example.com" 
                    className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-white font-sans placeholder-gray-600 focus:outline-none focus:ring-1 transition-all duration-300 ${errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/50 focus:bg-white/10'}`}
                  />
                  {errors.email && <span className="text-xs text-red-400 ml-1">{errors.email}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-sans font-medium text-gray-400 ml-1">Message</label>
                <textarea 
                  id="message" 
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..." 
                  className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-white font-sans placeholder-gray-600 focus:outline-none focus:ring-1 transition-all duration-300 resize-none ${errors.message ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/50 focus:bg-white/10'}`}
                ></textarea>
                {errors.message && <span className="text-xs text-red-400 ml-1">{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-4 relative overflow-hidden group w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-sans font-bold text-lg tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:scale-100"
              >
                <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </button>

            </form>
          ) : (
            // --- Success Section ---
            <div className="text-center flex flex-col items-center justify-center animate-[fadeIn_0.5s_ease-out]">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-sans font-bold text-white mb-3">Message Sent!</h3>
              <p className="text-gray-400 max-w-sm text-center font-light leading-relaxed">
                Thanks for reaching out, Ayush. I have received your details and will get back to you shortly.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-8 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200 underline underline-offset-4"
              >
                Send another message
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Contact;