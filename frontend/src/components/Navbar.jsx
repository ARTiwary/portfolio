import { useEffect, useState } from 'react';
import { LINKS, SWITCH_URL } from '../data';

const items = [['Work', 'works'], ['Experience', 'about'], ['Stack', 'tech-stack'], ['Contact', 'contact']];

export default function Navbar() {
  const [active, setActive] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setProgress(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    items.forEach(([, id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="absolute bottom-0 left-0 h-0.5 bg-accent" style={{ width: `${progress * 100}%` }} />
      <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between" aria-label="Main">
        <a href="#hero" className="font-display text-2xl leading-none">Ayush<span className="text-accent">.</span></a>
        <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted">
          {items.map(([l, id]) => (
            <a key={id} href={`#${id}`}
              className={`hidden md:inline transition-colors hover:text-ink ${active === id ? 'text-ink font-medium' : ''}`}>{l}</a>
          ))}
          <a href={SWITCH_URL} title="See the creative version of this portfolio"
            className="rounded-full border border-line px-3 py-1.5 text-[11px] uppercase tracking-widest text-ink hover:bg-ink hover:text-paper transition-colors">
            Switch mode
          </a>
          <a href={LINKS.resume} target="_blank" rel="noreferrer"
            className="rounded-full bg-ink px-4 py-1.5 font-medium text-paper hover:opacity-85">Resume</a>
        </div>
      </nav>
    </header>
  );
}
