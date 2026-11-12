import Reveal from './Reveal';
import Spot from './Spot';
import { experience } from '../data';

export default function Experience() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 border-t border-line">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">02 · Experience</p>
        <h2 className="mt-3 font-display text-5xl md:text-6xl">From notebooks to production.</h2>
      </Reveal>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {experience.map((e) => (
          <Reveal key={e.org}><Spot className="h-full rounded-2xl border border-line bg-panel p-7">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-white">
                <img src={e.logo} alt="" className="h-8 w-8 object-contain" />
              </span>
              <div>
                <h3 className="font-display text-2xl leading-tight">{e.org}</h3>
                <p className="font-mono text-xs text-muted">{e.dates}</p>
              </div>
            </div>
            <p className="mt-5 text-sm font-medium text-accent-ink">{e.role}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted leading-relaxed">
              {e.points.map((t) => <li key={t}>— {t}</li>)}
            </ul>
            {e.docs && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
                {e.docs.map((d) => (
                  <a key={d.href} href={d.href} target="_blank" rel="noreferrer"
                    className="rounded-full border border-line bg-paper px-3 py-1 text-xs hover:border-ink">{d.label} ↗</a>
                ))}
              </div>
            )}
          </Spot></Reveal>
        ))}
      </div>
    </section>
  );
}
