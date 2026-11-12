import { useRef } from 'react';
import { LINKS } from '../data';
import DotField from './DotField';
import Sky from './Sky';
import { PHASES, usePhase } from '../phase';
import Magnetic from './Magnetic';
import PhaseIcon from './PhaseIcon';

const w = (t, i) => <span key={i} className="word" style={{ animationDelay: `${0.08 * i + 0.1}s` }}>{t}&nbsp;</span>;
const first = 'I build AI that people can'.split(' ');
const last = ['actually', 'use.'];

export default function Hero() {
  const phase = usePhase(), P = PHASES[phase];
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    ref.current.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  return (
    <section id="hero" ref={ref} onPointerMove={move} className="relative overflow-hidden">
      <Sky />
      {phase !== 'night' && <div className="absolute inset-0" style={{ maskImage: 'linear-gradient(90deg,#000 0%,#000 26%,transparent 54%)', WebkitMaskImage: 'linear-gradient(90deg,#000 0%,#000 26%,transparent 54%)' }}><DotField base={P.dot.base} hot={P.dot.hot} /></div>}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-36 pb-24 md:pt-44">
        <p className="font-display text-3xl italic text-accent-ink" key={phase}>
          <span className="mr-2 inline-block translate-y-1 not-italic"><PhaseIcon phase={phase} size={28} /></span>{P.hi}<span className="text-ink/60 not-italic">. {P.line}</span>
        </p>
        <h1 className="mt-10 font-display text-6xl md:text-8xl leading-[0.95] tracking-tight max-w-4xl">
          {first.map(w)}
          <span className="mark">{last.map((t, i) => w(t, first.length + i))}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-muted leading-relaxed">
          Ayush Raj Tiwary. AI/ML engineer and full-stack developer. I train and deploy models, build the
          APIs behind them, and ship the interface on top. Two internships, six shipped projects.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-sm font-medium">
          <Magnetic><a href="#works" className="inline-block rounded-full bg-ink px-6 py-3 text-paper">See the work</a></Magnetic>
          <Magnetic><a href={`mailto:${LINKS.email}`} className="inline-block rounded-full border border-line bg-paper px-6 py-3 hover:border-ink">Email me</a></Magnetic>
          <Magnetic><a href={LINKS.github} target="_blank" rel="noreferrer" className="inline-block rounded-full border border-line bg-paper px-6 py-3 hover:border-ink">GitHub</a></Magnetic>
          <Magnetic><a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="inline-block rounded-full border border-line bg-paper px-6 py-3 hover:border-ink">LinkedIn</a></Magnetic>
        </div>
      </div>
    </section>
  );
}
