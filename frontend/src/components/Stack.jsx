import { useState } from 'react';
import Reveal from './Reveal';
import { stack } from '../data';

export default function Stack() {
  const [i, setI] = useState(0);
  return (
    <section id="tech-stack" className="mx-auto max-w-6xl px-6 py-24 border-t border-line">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">03 · Stack</p>
        <h2 className="mt-3 font-display text-5xl md:text-6xl">What I work with.</h2>
      </Reveal>
      <Reveal className="mt-12 grid gap-8 md:grid-cols-3">
        <div role="tablist" aria-label="Skill areas" className="flex gap-2 md:flex-col overflow-x-auto">
          {stack.map(([k], n) => (
            <button key={k} role="tab" aria-selected={i === n} onClick={() => setI(n)}
              className={`whitespace-nowrap rounded-xl border px-5 py-3 text-left font-display text-2xl transition-colors ${i === n ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}`}>
              {k}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="md:col-span-2 rounded-2xl border border-line bg-panel p-8">
          <div className="flex flex-wrap gap-2">
            {stack[i][1].map((t) => (
              <span key={t} className="rounded-full border border-line bg-paper px-4 py-2 text-sm lift">{t}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
