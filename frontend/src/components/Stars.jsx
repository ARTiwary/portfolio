import { useEffect, useRef } from 'react';

export default function Stars() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, mx = -999, my = -999, raf = 0, on = true, last = 0;
    const stars = Array.from({ length: 150 }, () => ({ x: Math.random(), y: Math.random() * 0.95, r: Math.random() * 1.3 + 0.3, ph: Math.random() * 6.28, sp: 0.6 + Math.random() * 1.6 }));
    let shots = [];
    const shoot = (x, y) => shots.push({ x, y, vx: 9 + Math.random() * 5, vy: 4 + Math.random() * 3, life: 1 });
    const size = () => { const r = c.parentElement.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); w = r.width; h = r.height; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s) => {
        const x = s.x * w, y = s.y * h, k = Math.max(0, 1 - Math.hypot(x - mx, y - my) / 170);
        const a = Math.min(1, (0.45 + 0.45 * Math.sin(t / 1000 * s.sp + s.ph)) * (0.7 + k * 1.2));
        ctx.beginPath(); ctx.arc(x, y, s.r * (1 + k * 1.8), 0, 6.283); ctx.fillStyle = `rgba(255,244,214,${a})`; ctx.fill();
      });
      shots = shots.filter((s) => s.life > 0);
      shots.forEach((s) => {
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 9, s.y - s.vy * 9);
        g.addColorStop(0, `rgba(255,255,255,${s.life})`); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 9, s.y - s.vy * 9); ctx.stroke();
        s.x += s.vx; s.y += s.vy; s.life -= 0.018;
      });
    };
    const loop = (t) => {
      if (t - last > 7000 + Math.random() * 3000) { last = t; shoot(Math.random() * w * 0.6, Math.random() * h * 0.3); }
      draw(t); if (on && !reduce) raf = requestAnimationFrame(loop);
    };
    const move = (e) => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const click = (e) => { const r = c.getBoundingClientRect(); if (e.clientY >= r.top && e.clientY <= r.bottom && !e.target.closest('a,button')) shoot(e.clientX - r.left, e.clientY - r.top); };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); } });
    size(); io.observe(c); raf = requestAnimationFrame(loop);
    window.addEventListener('resize', size); window.addEventListener('pointermove', move); window.addEventListener('pointerdown', click);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', size); window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', click); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true" />;
}
