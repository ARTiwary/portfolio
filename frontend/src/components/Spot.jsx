import { useRef } from 'react';

export default function Spot({ className = '', tilt = false, children }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current, r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`); el.style.setProperty('--my', `${y}px`);
    if (tilt) el.style.transform = `perspective(1000px) rotateX(${(y / r.height - 0.5) * -6}deg) rotateY(${(x / r.width - 0.5) * 8}deg)`;
  };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={() => (ref.current.style.transform = '')} className={`spot ${className}`}>
      {children}<span className="spot-glow" aria-hidden="true" />
    </div>
  );
}
