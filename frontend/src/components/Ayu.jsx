import { useEffect, useId, useRef, useState } from 'react';
import { usePhase } from '../phase';
import { pointer } from '../pointer';

// Ayu: a small round creature. A sun by day, a moon at night.
// Eyes follow the cursor, it blinks, waves, thinks, talks and falls asleep.
const SKIN = {
  morning:   { a: '#ffe0b0', b: '#ff9d60', rim: '#f2803f', cheek: '#ff7b86', glow: '255,150,70',  day: true },
  afternoon: { a: '#fff5b8', b: '#ffc93f', rim: '#ffb21e', cheek: '#ff8d8d', glow: '255,200,60',  day: true },
  evening:   { a: '#ffcdb0', b: '#ff7d88', rim: '#f2616f', cheek: '#ff5f80', glow: '255,110,110', day: true },
  night:     { a: '#fbfcff', b: '#b7c3f3', rim: '#9fadea', cheek: '#ff9fbb', glow: '150,175,255', day: false },
};
const INK = '#2a1d2e';
const RAYS = Array.from({ length: 10 }, (_, i) => {
  const a = ((i * 36 + 18) * Math.PI) / 180, long = i % 2 === 0, r1 = 34, r2 = long ? 43 : 40;
  return { x1: 50 + r1 * Math.cos(a), y1: 48 + r1 * Math.sin(a), x2: 50 + r2 * Math.cos(a), y2: 48 + r2 * Math.sin(a) };
});
const SPARK = 'M0 -5 Q0 0 5 0 Q0 0 0 5 Q0 0 -5 0 Q0 0 0 -5Z';

export default function Ayu({ size = 64, mood = 'idle', look = true, mini = false, wave = false, className = '' }) {
  const phase = usePhase(), S = SKIN[phase];
  const id = useId().replace(/:/g, ''), root = useRef(null);
  const [delay] = useState(() => (Math.random() * 3).toFixed(2));

  // eyes follow the pointer
  useEffect(() => {
    if (!look || mood === 'sleep' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current; let raf = 0, x = 0, y = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!pointer.seen || document.hidden) return;
      const r = el.getBoundingClientRect(), dx = pointer.x - (r.left + r.width / 2), dy = pointer.y - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 240);
      x += (dx / d * 2.6 * k - x) * 0.14; y += (dy / d * 2.1 * k - y) * 0.14;
      el.style.setProperty('--ex', x.toFixed(2) + 'px'); el.style.setProperty('--ey', y.toFixed(2) + 'px');
    };
    loop(); return () => cancelAnimationFrame(raf);
  }, [look, mood]);

  const eye = (cx) => (
    <g className="ay-eye">
      <ellipse cx={cx} cy="50" rx="4.3" ry="5.3" fill={INK} />
      <circle cx={cx - 1.3} cy="48" r="1.7" fill="#fff" />
      <circle cx={cx + 1.4} cy="52.2" r=".8" fill="#fff" opacity=".8" />
    </g>
  );

  return (
    <svg ref={root} className={`ay ay-${mood} ${mini ? 'is-mini' : ''} ${wave ? 'is-wave' : ''} ${className}`} width={size} height={size} viewBox="0 0 100 100"
      style={{ '--ay-glow': S.glow, '--ay-delay': `${delay}s` }} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}b`} cx="36%" cy="28%" r="85%"><stop offset="0" stopColor={S.a} /><stop offset="1" stopColor={S.b} /></radialGradient>
      </defs>
      {!mini && <ellipse className="ay-shadow" cx="50" cy="94" rx="20" ry="3.6" />}
      <g className="ay-bob">
        {!mini && S.day && (<g className="ay-rays">{RAYS.map((r, i) => (<line key={i} {...r} stroke={S.rim} strokeWidth="5.4" strokeLinecap="round" opacity=".95" />))}</g>)}
        {!mini && !S.day && [[15, 24, 1], [86, 32, .7], [80, 80, .85]].map(([x, y, s], i) => (<path key={i} className="ay-twinkle" d={SPARK} transform={`translate(${x} ${y}) scale(${s})`} fill="#e4e9ff" style={{ animationDelay: `${i * .6}s` }} />))}
        {!mini && (<>
          <circle cx="22.5" cy="66" r="5.4" fill={S.rim} />
          <g className="ay-hand"><circle cx="77.5" cy="66" r="5.4" fill={S.rim} /></g>
        </>)}
        <circle cx="50" cy="48" r="28" fill={`url(#${id}b)`} />
        <ellipse cx="38.5" cy="31.5" rx="9" ry="4.6" fill="#fff" opacity=".38" transform="rotate(-28 38.5 31.5)" />
        {!S.day && (<g fill={S.rim} opacity=".28"><circle cx="64" cy="37" r="4" /><circle cx="33" cy="60" r="3" /><circle cx="63" cy="62" r="2.4" /><circle cx="52" cy="27" r="1.8" /></g>)}
        <ellipse cx="33.5" cy="58.5" rx="4.8" ry="3.1" fill={S.cheek} opacity=".55" />
        <ellipse cx="66.5" cy="58.5" rx="4.8" ry="3.1" fill={S.cheek} opacity=".55" />

        {mood === 'sleep' ? (
          <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round"><path d="M36 51 q5 4.2 10 0" /><path d="M54 51 q5 4.2 10 0" /><path d="M47.6 59 q2.4 1.8 4.8 0" strokeWidth="1.8" /></g>
        ) : (
          <>
            <g className="ay-look" style={{ transform: mood === 'think' ? 'translate(2.4px,-2.2px)' : 'translate(var(--ex,0px), var(--ey,0px))' }}>{eye(41)}{eye(59)}</g>
            {mood === 'speak' ? <ellipse className="ay-talk" cx="50" cy="59" rx="3.6" ry="3.4" fill={INK} />
              : mood === 'think' ? <circle cx="50" cy="59" r="1.9" fill="none" stroke={INK} strokeWidth="1.8" />
              : <path d="M45.4 57.6 q4.6 4.4 9.2 0" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />}
          </>
        )}
        {mood === 'think' && (<g className="ay-orbit">{[0, 120, 240].map((a) => (<path key={a} d={SPARK} transform={`rotate(${a} 50 48) translate(50 6) scale(.9)`} fill={S.day ? '#fff' : '#e4e9ff'} />))}</g>)}
        {mood === 'sleep' && (<g fill={INK} opacity=".55" fontFamily="Georgia, serif" fontStyle="italic"><text className="ay-z" x="70" y="26" fontSize="12">z</text><text className="ay-z" x="78" y="16" fontSize="9" style={{ animationDelay: '.7s' }}>z</text></g>)}
      </g>
    </svg>
  );
}
