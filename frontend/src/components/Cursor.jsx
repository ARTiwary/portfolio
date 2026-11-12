import { useEffect, useRef } from 'react';
import { pointer } from '../pointer';
import { usePhase } from '../phase';

// A small star you carry around. It leaves an ember comet tail, snaps into a lens around
// buttons and links, turns into a labelled disc over big cards, bursts on click,
// and the sky (see Sky + shaders) lights up around it.
const PAL = {
  morning:   { a: [255, 178, 66],  b: [255, 92, 38],  glow: '255,150,50' },
  afternoon: { a: [255, 208, 64],  b: [64, 148, 255], glow: '255,196,60' },
  evening:   { a: [255, 118, 88],  b: [255, 176, 218], glow: '255,110,90' },
  night:     { a: [206, 222, 255], b: [255, 224, 150], glow: '170,195,255' },
};
const sprite = ([r, g, b]) => {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.16, `rgba(${r},${g},${b},.95)`);
  gr.addColorStop(0.55, `rgba(${r},${g},${b},.26)`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
  x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return c;
};
const HOT = 'a,button,[role="tab"],[role="button"],summary,select,[data-cursor]';
const lerp = (a, b, k) => a + (b - a) * k;

export default function Cursor() {
  const phase = usePhase();
  const pal = useRef(PAL[phase]), sprites = useRef(null);
  const cv = useRef(null), ring = useRef(null), core = useRef(null), label = useRef(null);

  useEffect(() => {
    pal.current = PAL[phase];
    sprites.current = { a: sprite(pal.current.a), b: sprite(pal.current.b) };
    core.current?.style.setProperty('--glow', pal.current.glow);
  }, [phase]);

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.body.classList.add('has-cursor');
    const c = cv.current, ctx = c.getContext('2d'), R = ring.current, K = core.current, L = label.current;
    let W = 0, H = 0, dpr = 1;
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; };
    size(); addEventListener('resize', size);

    const rg = { x: -200, y: -200, w: 40, h: 40, r: 20, s: 1 };
    let hotEl = null, mode = 'idle', text = false, visible = false, speed = 0, ang = 0, px = -200, py = -200, last = performance.now(), acc = 0, down = false, probe = 0, raf = 0;
    const trail = [], parts = [], waves = [];

    const classify = (el) => {
      text = !!el?.closest?.('input,textarea,[contenteditable="true"]');
      hotEl = text ? null : el?.closest?.(HOT) || null;
      if (!hotEl) { mode = 'idle'; L.textContent = ''; return; }
      const r = hotEl.getBoundingClientRect();
      const big = r.width > 380 || r.height > 150;
      mode = big ? 'disc' : 'lens';
      const t = hotEl.dataset.cursor || (big ? (hotEl.matches('a[target="_blank"]') ? 'Open' : hotEl.matches('a,button') ? 'View' : '') : '');
      L.textContent = t;
    };
    const move = (e) => {
      visible = true;
      trail.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (trail.length > 90) trail.shift();
      if (e.target instanceof Element) classify(e.target);
    };
    const leave = () => { visible = false; };
    const press = (e) => {
      down = true;
      const p = pal.current;
      for (let i = 0; i < 28; i++) {
        const a = Math.random() * 6.283, v = 90 + Math.random() * 330;
        parts.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * v, vy: Math.sin(a) * v, age: 0, life: 0.55 + Math.random() * 0.6, size: 8 + Math.random() * 16, s: Math.random() < 0.65 ? 'a' : 'b' });
      }
      waves.push({ x: e.clientX, y: e.clientY, t: performance.now(), c: p.a });
    };
    const release = () => { down = false; };
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerdown', press, { passive: true });
    addEventListener('pointerup', release, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.max(0.001, Math.min(0.05, (now - last) / 1000 || 0.016)); last = now;
      const P = pal.current, S = sprites.current; if (!S) return;
      const x = pointer.x, y = pointer.y;
      if (px < -100) { px = x; py = y; }                       // first frame: no velocity yet
      const vx = (x - px) / dt, vy = (y - py) / dt; px = x; py = y;
      speed = Math.max(0, lerp(speed, Math.hypot(vx, vy), 1 - Math.exp(-dt * 10)));
      if (speed > 60) ang = lerp(ang, Math.atan2(vy, vx), 1 - Math.exp(-dt * 18));

      // elements slide under a still cursor when the page scrolls, so re-probe now and then
      if (now - probe > 140) { probe = now; const el = document.elementFromPoint(x, y); if (el) classify(el); }

      // ---- target shape of the ring
      let tx = x, ty = y, tw = 40, th = 40, tr = 20, coreS = 1;
      if (mode === 'lens' && hotEl) {
        const r = hotEl.getBoundingClientRect(), cs = getComputedStyle(hotEl), rad = parseFloat(cs.borderTopLeftRadius) || 12;
        tw = r.width + 14; th = r.height + 14; tr = Math.min(rad + 7, tw / 2, th / 2);
        tx = lerp(r.left + r.width / 2, x, 0.16); ty = lerp(r.top + r.height / 2, y, 0.16); coreS = 0.55;
      } else if (mode === 'disc') {
        tw = th = L.textContent ? 78 : 58; tr = 40; coreS = L.textContent ? 0 : 0.7;
      } else {
        const st = Math.min(0.7, speed / 2600); tw = 40 * (1 + st); th = 40 / Math.sqrt(1 + st);
      }
      if (down) { tw *= 0.86; th *= 0.86; }
      const kp = 1 - Math.exp(-dt * (mode === 'lens' ? 15 : 12)), ks = 1 - Math.exp(-dt * 16);
      rg.x = lerp(rg.x, tx, kp); rg.y = lerp(rg.y, ty, kp); rg.w = lerp(rg.w, tw, ks); rg.h = lerp(rg.h, th, ks); rg.r = lerp(rg.r, tr, ks);
      const rot = mode === 'idle' ? ang : 0;
      R.style.width = rg.w + 'px'; R.style.height = rg.h + 'px'; R.style.borderRadius = rg.r + 'px';
      R.style.transform = `translate3d(${rg.x - rg.w / 2}px,${rg.y - rg.h / 2}px,0) rotate(${rot}rad)`;
      R.dataset.mode = mode;
      K.style.transform = `translate3d(${x}px,${y}px,0) scale(${coreS * (down ? 1.5 : 1)})`;
      L.style.transform = `translate3d(${rg.x}px,${rg.y}px,0) translate(-50%,-50%) scale(${L.textContent && mode === 'disc' ? 1 : 0})`;
      const show = visible && !text ? 1 : 0;
      R.style.opacity = K.style.opacity = show;

      // ---- trail + particles + shockwaves on the canvas
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      if (!show) { trail.length = 0; return; }
      const night = phase === 'night';
      ctx.globalCompositeOperation = night ? 'lighter' : 'source-over';
      while (trail.length && now - trail[0].t > 380) trail.shift();
      if (trail.length > 1) {
        ctx.lineCap = 'round';
        for (let i = 1; i < trail.length; i++) {
          const k = i / (trail.length - 1), a = trail[i - 1], b = trail[i];
          const rgb = `${Math.round(lerp(P.b[0], P.a[0], k))},${Math.round(lerp(P.b[1], P.a[1], k))},${Math.round(lerp(P.b[2], P.a[2], k))}`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${rgb},${(0.22 * k).toFixed(3)})`; ctx.lineWidth = 6 + 16 * k; ctx.stroke();      // glow
          ctx.strokeStyle = `rgba(${rgb},${(0.85 * k * k).toFixed(3)})`; ctx.lineWidth = 1 + 6 * k; ctx.stroke();   // core
        }
      }
      // embers
      acc += Math.min(110, speed * 0.075) * dt;
      while (acc >= 1 && parts.length < 280) {
        acc -= 1; const a = Math.random() * 6.283, v = 14 + Math.random() * 60;
        parts.push({ x: x + (Math.random() - 0.5) * 6, y: y + (Math.random() - 0.5) * 6, vx: -vx * 0.05 + Math.cos(a) * v, vy: -vy * 0.05 + Math.sin(a) * v - 14, age: 0, life: 0.5 + Math.random() * 0.8, size: 5 + Math.random() * 13, s: Math.random() < 0.7 ? 'a' : 'b' });
      }
      acc = Math.min(acc, 3);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]; p.age += dt;
        if (p.age >= p.life) { parts.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.985; p.vy = p.vy * 0.985 - 26 * dt;
        const f = p.age / p.life, sz = p.size * (1 - 0.55 * f);
        ctx.globalAlpha = Math.pow(1 - f, 1.4) * 0.92;
        ctx.drawImage(S[p.s], p.x - sz / 2, p.y - sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1;
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i], f = Math.max(0, (now - w.t) / 650);   // rAF time can be a hair behind the click time
        if (f >= 1) { waves.splice(i, 1); continue; }
        const e = 1 - Math.pow(1 - f, 3);
        ctx.strokeStyle = `rgba(${w.c[0]},${w.c[1]},${w.c[2]},${(0.7 * (1 - f)).toFixed(3)})`; ctx.lineWidth = 2.2 * (1 - f) + 0.4;
        ctx.beginPath(); ctx.arc(w.x, w.y, 6 + 120 * e, 0, 6.283); ctx.stroke();
      }
      // soft aura on the head
      ctx.globalAlpha = 0.5; ctx.drawImage(S.a, x - 22, y - 22, 44, 44); ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('pointermove', move);
      removeEventListener('pointerdown', press); removeEventListener('pointerup', release);
      document.documentElement.removeEventListener('pointerleave', leave); document.body.classList.remove('has-cursor');
    };
  }, [phase]);

  return (
    <>
      <canvas ref={cv} aria-hidden="true" className="cur-canvas" />
      <div ref={ring} aria-hidden="true" className="cur-ring" data-mode="idle" />
      <div ref={core} aria-hidden="true" className="cur-core" />
      <span ref={label} aria-hidden="true" className="cur-label" />
    </>
  );
}
