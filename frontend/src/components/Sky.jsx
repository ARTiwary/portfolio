import { useEffect, useRef, useState } from 'react';
import { PHASES, usePhase } from '../phase';
import { createSky } from '../sky/skyGL';
import Stars from './Stars';

// Real-time sky. A WebGL shader draws the sun (granulated photosphere, sunspots, corona,
// prominences), the moon (maria, craters, Tycho rays), lit clouds and the milky way.
// Without WebGL it falls back to the old CSS version.
export default function Sky() {
  const phase = usePhase(), P = PHASES[phase], b = P.body;
  const wrap = useRef(null), cv = useRef(null), sky = useRef(null);
  const [gl, setGl] = useState(true);

  useEffect(() => {
    const s = createSky(cv.current);
    if (!s) { setGl(false); return; }
    sky.current = s;
    s.onLost(() => setGl(false));
    s.setScene(PHASES[document.documentElement.dataset.phase || phase].scene);
    return () => { s.destroy(); sky.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { sky.current?.setScene(P.scene); }, [P]);

  useEffect(() => {
    const on = () => wrap.current?.style.setProperty('--sy', Math.min(1, scrollY / Math.max(1, wrap.current.offsetHeight)).toFixed(3));
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  return (
    <div ref={wrap} aria-hidden="true" className="scene-in absolute inset-0 overflow-hidden pointer-events-none" style={{ background: P.sky }}>
      {gl ? (
        <canvas ref={cv} className="absolute inset-0 h-full w-full" />
      ) : (
        <>
          {Array.from({ length: P.clouds }, (_, i) => (
            <span key={i} className="cloud" style={{ top: `${14 + i * 17}%`, width: 320 + i * 70, height: 70 + i * 14, background: P.cloud, animationDuration: `${70 + i * 28}s`, animationDelay: `${-i * 24}s` }} />
          ))}
          <div className="body-rise absolute" style={{ left: b.left, top: b.top, width: b.size, height: b.size, '--rise': `${P.rise}px` }}>
            <div className="h-full w-full rounded-full" style={{ background: b.bg, boxShadow: b.glow }} />
          </div>
        </>
      )}
      {phase === 'night' && <Stars />}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
