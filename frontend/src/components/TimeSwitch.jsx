import { order } from '../phase';
import PhaseIcon from './PhaseIcon';

export default function TimeSwitch({ mode, setMode, auto }) {
  const btn = (on) => `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${on ? 'bg-ink text-paper' : 'hover:bg-panel'}`;
  return (
    <div role="group" aria-label="Time of day" className="fixed bottom-5 left-5 z-50 flex items-center gap-1 rounded-full border border-line bg-paper/90 p-1 shadow-lg backdrop-blur">
      <button className={btn(mode === 'auto')} aria-pressed={mode === 'auto'} onClick={() => setMode('auto')} title="Follow my local time">
        Auto <PhaseIcon phase={auto} size={15} />
      </button>
      {order.map((p) => (
        <button key={p} className={btn(mode === p)} aria-pressed={mode === p} onClick={() => setMode(p)} title={`Preview ${p}`} aria-label={`Preview ${p}`}><PhaseIcon phase={p} size={17} /></button>
      ))}
    </div>
  );
}
