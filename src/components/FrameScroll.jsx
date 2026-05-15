import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FrameScroll() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  // Generate sparse particle fields
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`, // 1px to 3px
      duration: `${Math.random() * 15 + 15}s`, // 15s to 30s
      delay: `${Math.random() * -30}s`, // start at different points
      opacity: Math.random() * 0.5 + 0.1, // very low opacity
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const frameCount = 240; 
    
    const currentFrame = (index) =>
      `/frameimage/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.jpg`;

    const images = [];
    const sequence = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      const img = images[sequence.frame];
      if (img && img.complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.max(scaleX, scaleY); // cover
        
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        
        // Static frame rendering. No camera rotation or zoom as requested.
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    };

    if (images[0]) {
      images[0].onload = render;
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1, 
        start: "top top",
        end: "+=4000",
      },
    });

    // 1. Scrub frames from 0 to 239 over the entire scroll duration
    // Main clock: duration 240 matches exact frame logic map
    tl.to(sequence, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      duration: 240, 
      onUpdate: () => requestAnimationFrame(render),
    }, 0);

    // Initial resets for texts
    gsap.set([text1Ref.current, text2Ref.current, text3Ref.current], { opacity: 0 });

    /* 
      FRAME LOGIC MAP
      Frame 1-60: empty
      Frame 61-100: "I am Leeshark" fades in (starts at 60, ends ~80, stays till 100)
                    with slight upward floating effect.
      Frame 101-140: First text dissolves (101-120), "Full Stack Developer" fades in (120-140).
      Frame 141-180: Text 2 remains stable
      Frame 181-220: Text 2 fades out (181-200), "About Me" fades in (200-220).
      Frame 221-240: Text 3 stays visible.
    */

    // --- Block 1: "I am Leeshark" ---
    // Fade in and slight float up (Frame 60-80 visible by 80)
    tl.fromTo(text1Ref.current, 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 20, ease: "power2.out" }, 
      60
    );
    // Dissolve gently (Frame 100-120) and continue float
    tl.to(text1Ref.current, 
      { opacity: 0, y: -15, duration: 20, ease: "power2.in" }, 
      100
    );

    // --- Block 2: "Full Stack Developer" ---
    // Forms in center (stable position, no movement -> no y/scale animation)
    tl.fromTo(text2Ref.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 20, ease: "power1.inOut" }, 
      120
    );
    // Fades out smoothly 
    tl.to(text2Ref.current, 
      { opacity: 0, duration: 20, ease: "power1.inOut" }, 
      180
    );

    // --- Block 3: "About Me" ---
    // Final text appears, slightly bigger (Frame 200-220)
    tl.fromTo(text3Ref.current,
      { opacity: 0 },
      { opacity: 1, duration: 20, ease: "power1.inOut" },
      200
    );
    // Stays visible till 240

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <div 
        ref={containerRef} 
        className="w-full h-screen bg-[#000000] overflow-hidden relative flex items-center justify-center p-0 m-0"
      >
        {/* Anti-gravity subtle particles */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        {/* Video Frame Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block relative z-10 opacity-70" /* Dimmed slightly for text contrast */
        />
        
        {/* Text Area */}
        <div className="absolute inset-0 flex flex-col  justify-center z-20 pointer-events-none text-white tracking-wide">
           <h1 ref={text1Ref} className="absolute text-5xl md:text-7xl font-sans font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
             I am Ayush Raj Tiwary
           </h1>
           <h2 ref={text2Ref} className="right-2 absolute text-6xl md:text-4xl font-sans font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] tracking-wider">
             Full Stack Developer
           </h2>
           <h3 ref={text3Ref} className="absolute text-7xl md:text-[3rem] font-sans font-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.6)] tracking-widest">
             Let's Work Together to <br />
              Create Wonders with Us
           </h3>
        </div>
      </div>
      
      
    </>
  );
}
