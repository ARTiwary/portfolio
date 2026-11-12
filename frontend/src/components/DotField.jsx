import { useEffect, useRef } from 'react';

export default function DotField({ base = [207, 212, 220], hot = [245, 184, 46] }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gap = 28;
    let w = 0, h = 0, mx = -999, my = -999, raf = 0, on = true;
    const size = () => {
      const r = c.parentElement.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
      w = r.width; h = r.height; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let x = gap / 2; x < w; x += gap) for (let y = gap / 2; y < h; y += gap) {
        const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy), k = Math.max(0, 1 - d / 170), p = k * k * 14;
        ctx.beginPath();
        ctx.arc(x + (d ? (dx / d) * p : 0), y + (d ? (dy / d) * p : 0), 1.2 + k * 3.4, 0, 6.283);
        ctx.fillStyle = `rgb(${base[0] + (hot[0] - base[0]) * k},${base[1] + (hot[1] - base[1]) * k},${base[2] + (hot[2] - base[2]) * k})`;
        ctx.fill();
      }
      if (on && !reduce) raf = requestAnimationFrame(draw);
    };
    const move = (e) => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) { cancelAnimationFrame(raf); draw(); } });
    size(); draw(); io.observe(c);
    window.addEventListener('resize', size); window.addEventListener('pointermove', move);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', size); window.removeEventListener('pointermove', move); };
  }, [base, hot]);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true" />;
}
