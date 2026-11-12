import { useRef, useState } from 'react';
import Reveal from './Reveal';
import Spot from './Spot';
import { featured, more, filters } from '../data';

const btn = 'rounded-full px-5 py-2 text-sm font-medium transition-colors';

function Media({ p, onPlay }) {
  if (p.loop) {
    return (
      <div className="relative">
        <video src={p.loop} poster={p.poster} autoPlay muted loop playsInline preload="metadata"
          className="w-full aspect-video object-cover" aria-label={`${p.title} demo`} />
        {p.full && (
          <button onClick={onPlay}
            className="absolute bottom-3 left-3 rounded-full bg-black/70 px-4 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-white hover:text-black">
            ▶ Watch full walkthrough
          </button>
        )}
      </div>
    );
  }
  return <img src={p.poster} alt={`${p.title} screenshot`} loading="lazy" className="w-full aspect-video object-cover object-top" />;
}

export default function Work() {
  const [tag, setTag] = useState('All');
  const show = (x) => tag === 'All' || x.tags.includes(tag);
  const feat = featured.filter(show);
  const rest = more.filter(show);
  const dlg = useRef(null);
  const vid = useRef(null);
  const open = (src) => { vid.current.src = src; dlg.current.showModal(); vid.current.play(); };
  const close = () => { vid.current.pause(); dlg.current.close(); };

  return (
    <section id="works" className="mx-auto max-w-6xl px-6 py-24 border-t border-line">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">01 · Selected work</p>
        <h2 className="mt-3 font-display text-5xl md:text-6xl">Projects with results, not just screenshots.</h2>
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button key={f} onClick={() => setTag(f)} aria-pressed={tag === f}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${tag === f ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}>{f}</button>
        ))}
      </div>

      <div className="mt-14 flex flex-col gap-20">
        {feat.map((p, i) => (
          <Reveal as="article" key={p.title} className="grid gap-8 lg:grid-cols-5 lg:gap-12 items-start">
            <Spot tilt className={`lg:col-span-3 overflow-hidden rounded-2xl border border-line bg-panel ${i % 2 ? 'lg:order-2' : ''}`}>
              <Media p={p} onPlay={() => open(p.full)} />
            </Spot>
            <div className="lg:col-span-2">
              <p className="font-mono text-xs uppercase tracking-widest text-accent-ink">{p.kind}</p>
              <h3 className="mt-2 font-display text-4xl">{p.title}</h3>
              <p className="mt-4 text-muted leading-relaxed">{p.blurb}</p>
              <ul className="mt-5 space-y-2 text-sm leading-relaxed">
                {p.points.map((t) => (
                  <li key={t} className="flex gap-3"><span className="mt-2 h-1 w-3 shrink-0 bg-accent" />{t}</li>
                ))}
              </ul>
              <p className="mt-5 font-mono text-xs text-muted">{p.stack.join(' · ')}</p>
              <div className="mt-6 flex gap-3">
                {p.live && <a href={p.live} target="_blank" rel="noreferrer" className={`${btn} bg-ink text-paper hover:opacity-85`}>Live demo</a>}
                <a href={p.code} target="_blank" rel="noreferrer" className={`${btn} border border-line hover:border-ink`}>Code</a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-24">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted">More projects</h3>
        {rest.length === 0 && <p className="mt-4 text-sm text-muted">Nothing else in this category yet.</p>}
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {rest.map((m) => (
            <li key={m.title} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <span className="font-display text-2xl">{m.title}</span>
              <span className="font-mono text-xs text-muted">{m.stack}</span>
              <span className="flex gap-4 text-sm">
                {m.live && <a href={m.live} target="_blank" rel="noreferrer" className="text-accent-ink hover:underline">Live</a>}
                <a href={m.code} target="_blank" rel="noreferrer" className="hover:text-accent-ink">Code ↗</a>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <dialog ref={dlg} onClick={(e) => e.target === dlg.current && close()}
        className="m-auto w-[min(92vw,1100px)] rounded-2xl border border-line bg-panel p-0 backdrop:bg-black/80">
        <button onClick={close} className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 text-sm text-white">Close ✕</button>
        <video ref={vid} controls playsInline className="w-full" />
      </dialog>
    </section>
  );
}
