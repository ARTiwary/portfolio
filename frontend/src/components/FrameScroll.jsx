import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FrameScroll() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const popupRef = useRef(null);

  // Generate sparse particle fields
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 15 + 15}s`,
      delay: `${Math.random() * -30}s`,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Single source of truth for frame count. Everything else scales off this,
    // so bumping the frame count later won't desync the text timing.
    const frameCount = 288;

    const currentFrame = (index) =>
      `/frameimage/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.jpg`;

    const images = [];
    const sequence = { frame: 0 };
    let lastDrawnFrame = -1; // avoids re-drawing the same image every tick

    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      // Walk backwards from the target frame to the nearest already-loaded
      // image, so a slow-loading frame holds the last good frame instead of
      // flashing blank while scrolling.
      let frameToDraw = sequence.frame;
      while (frameToDraw > 0 && !(images[frameToDraw] && images[frameToDraw].complete)) {
        frameToDraw--;
      }

      if (frameToDraw === lastDrawnFrame) return;
      const img = images[frameToDraw];
      if (!img || !img.complete) return;

      lastDrawnFrame = frameToDraw;
      context.clearRect(0, 0, canvas.width, canvas.height);

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      const scale = Math.max(scaleX, scaleY); // cover

      const x = canvas.width / 2 - (img.width / 2) * scale;
      const y = canvas.height / 2 - (img.height / 2) * scale;

      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    if (images[0]) {
      images[0].onload = render;
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        lastDrawnFrame = -1; // force a redraw at the new canvas size
        render();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // The timeline's internal "duration" is just an abstract time unit, but
    // tying it directly to frameCount keeps every keyframe below expressed
    // as a simple fraction of the whole sequence — easier to reason about
    // and safe if frameCount ever changes.
    const timelineDuration = frameCount;
    const at = (fraction) => timelineDuration * fraction;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 0.75, // slightly tighter than 1 for a more responsive, less "laggy" feel
        start: "top top",
        end: "+=4000",
      },
    });

    // Scrub frames 0 -> frameCount-1 across the whole scroll duration
    tl.to(
      sequence,
      {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        duration: timelineDuration,
        onUpdate: render,
      },
      0
    );

    // Initial resets for texts
    gsap.set([text1Ref.current, text2Ref.current, text3Ref.current], { opacity: 0 });
    gsap.set(popupRef.current, { opacity: 1, y: 0 });

    // Popup fades (and lifts slightly) out right as scrolling begins
    tl.to(
      popupRef.current,
      { opacity: 0, y: -12, duration: at(1 / 120), ease: "power1.inOut" },
      0
    );

    /*
      FRAME LOGIC MAP (as fractions of the full sequence)
      0%     - 25%  : empty
      25%    - ~42% : "I am Ayush Raj Tiwary" fades in, holds, dissolves
      42%    - 75%  : "AI/ML Engineer & Full Stack Developer" fades in, holds, fades out
      75%    - 100% : "Let's Build Something That Matters" fades in and stays
    */

    // --- Block 1 ---
    tl.fromTo(
      text1Ref.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: at(1 / 12), ease: "power2.out" },
      at(0.25)
    );
    tl.to(
      text1Ref.current,
      { opacity: 0, y: -15, duration: at(1 / 12), ease: "power2.in" },
      at(0.4167)
    );

    // --- Block 2 ---
    tl.fromTo(
      text2Ref.current,
      { opacity: 0 },
      { opacity: 1, duration: at(1 / 12), ease: "power1.inOut" },
      at(0.5)
    );
    tl.to(
      text2Ref.current,
      { opacity: 0, duration: at(1 / 12), ease: "power1.inOut" },
      at(0.75)
    );

    // --- Block 3 ---
    tl.fromTo(
      text3Ref.current,
      { opacity: 0 },
      { opacity: 1, duration: at(1 / 12), ease: "power1.inOut" },
      at(0.8333)
    );
    // Stays visible to the end

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-black overflow-hidden relative flex items-center justify-center p-0 m-0"
    >
      {/* Ambient particles */}
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

      {/* Frame sequence canvas */}
      <canvas ref={canvasRef} className="w-full h-full block relative z-10 opacity-70" />

      {/* Intro caption — matches the page's own palette: black, white, blue-400 */}
      <div
        ref={popupRef}
        className="absolute inset-0 z-50 flex flex-col justify-end pointer-events-none px-8 md:px-16 pb-16 md:pb-20"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        <div className="relative max-w-xl">
          <div className="pl-5 md:pl-6 border-l-2 border-blue-400/70">
            <h1 className="text-[2.2rem] md:text-[3.4rem] leading-[1.05] font-black text-white tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
              Ayush Raj Tiwary
            </h1>
            <p className="mt-3 text-sm md:text-base font-medium text-blue-400 tracking-wide">
              AI/ML Engineer — Full Stack Developer
            </p>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <span className="scroll-cue-dash w-8 h-px bg-white/50" />
            <span className="text-[11px] tracking-[0.2em] text-white/60">
              Scroll to explore
            </span>
          </div>
        </div>

        <style>{`
          .scroll-cue-dash {
            transform-origin: left;
            animation: scrollCueDrift 2.4s ease-in-out infinite;
          }
          @keyframes scrollCueDrift {
            0%, 100% { transform: scaleX(0.6); opacity: 0.4; }
            50%      { transform: scaleX(1);   opacity: 0.9; }
          }
        `}</style>
      </div>

      {/* Scroll-driven text */}
      <div className="absolute inset-0 flex flex-col justify-center z-20 pointer-events-none text-white tracking-wide px-10 md:px-20">
        <h1
          ref={text1Ref}
          className="absolute self-start text-left text-5xl md:text-7xl font-sans font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          I am Ayush <br /> Raj Tiwary
        </h1>

        <h2
          ref={text2Ref}
          className="absolute self-end text-right text-4xl md:text-6xl font-sans font-bold drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] tracking-wider"
        >
          AI/ML Engineer & <br /> Full Stack Developer
        </h2>

        <h3
  ref={text3Ref}
  className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 self-center text-center text-3xl md:text-[3rem] font-sans font-bold drop-shadow-[0_0_25px_rgba(255,255,255,0.6)] tracking-widest w-full"
>
  Let's Build Something That Matters
  <br />
  <span className="text-blue-400">Open to Work — Let's Connect</span>
</h3>
      </div>
    </div>
  );
}