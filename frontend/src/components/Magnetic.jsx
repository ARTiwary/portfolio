import { useRef } from 'react';

export default function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px,${(e.clientY - r.top - r.height / 2) * strength}px)`;
  };
  return (
    <span ref={ref} onPointerMove={move} onPointerLeave={() => (ref.current.style.transform = '')}
      className="inline-block transition-transform duration-200 ease-out">{children}</span>
  );
}
