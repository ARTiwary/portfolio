// Small drawn glyphs that replace the emoji. They inherit currentColor.
export default function PhaseIcon({ phase, size = 18 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (phase === 'night') return (<svg {...p}><path d="M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2Z" fill="currentColor" fillOpacity=".18" /><circle cx="17.5" cy="6" r=".6" fill="currentColor" /><circle cx="20.2" cy="9.4" r=".5" fill="currentColor" /></svg>);
  if (phase === 'afternoon') return (<svg {...p}><circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity=".2" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" /></svg>);
  const up = phase === 'morning';
  return (<svg {...p}><path d="M3 18h18" /><path d="M7 18a5 5 0 0 1 10 0" fill="currentColor" fillOpacity=".2" /><path d={up ? 'M12 4.5V8M5.6 8.2l1.7 1.7M18.4 8.2l-1.7 1.7' : 'M12 8V4.5M5.6 9.9l1.7-1.7M18.4 9.9l-1.7-1.7'} />{up ? <path d="M9.8 6.2 12 4l2.2 2.2" /> : <path d="M9.8 2.3 12 4.5l2.2-2.2" />}</svg>);
}
