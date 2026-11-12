import { createContext, useContext } from 'react';

export const order = ['morning', 'afternoon', 'evening', 'night'];
export const phaseOf = (d = new Date()) => {
  const h = d.getHours();
  return h >= 5 && h < 12 ? 'morning' : h >= 12 && h < 17 ? 'afternoon' : h >= 17 && h < 20 ? 'evening' : 'night';
};

export const PHASES = {
  morning: { icon: '🌅', hi: 'Good morning', line: 'Fresh start. Here is what I have been building.', dot: { base: [232, 205, 170], hot: [255, 140, 20] },
    sky: 'linear-gradient(180deg,#ffd2a1 0%,#ffe6c7 42%,#fff4e4 80%)', k: -90, rise: 150, cloud: 'rgba(255,255,255,.55)', clouds: 3,
    body: { size: 240, left: '12%', top: '44%', bg: 'radial-gradient(circle at 40% 35%,#fff1b8,#ffb84d 62%,#ff9a3c)', glow: '0 0 140px 70px rgba(255,160,60,.5)' },
    scene: { k: -90, setAmt: 0, night: 0, exposure: 1, sky: ['#f2a688', '#ffc89d', '#ffe3c0', '#fff6e8'], haze: '#ffd7a6', mouseCol: [1, .72, .36],
      sun: { a: 1, fx: .76, fy: .50, rh: .165, core: [1.6, .98, .36], limb: [.95, .27, .06], glow: [1, .5, .18], detail: .95, corona: 1, flare: .6, rays: 1.1 },
      moon: { a: 0, fx: .78, fy: 1.35, rh: .15, glow: [.55, .65, 1] }, cloud: { cov: .52, a: .80, lit: [1, .90, .78], shade: [.86, .66, .62] } } },
  afternoon: { icon: '☀️', hi: 'Good afternoon', line: 'Peak hours. Go explore the projects.', dot: { base: [176, 200, 230], hot: [47, 120, 240] },
    sky: 'linear-gradient(180deg,#bfe0ff 0%,#dff0ff 48%,#f6faff 84%)', k: 0, rise: 40, cloud: 'rgba(255,255,255,.9)', clouds: 4,
    body: { size: 120, left: '78%', top: '14%', bg: 'radial-gradient(circle at 40% 35%,#fffbe0,#ffe27a 70%)', glow: '0 0 90px 40px rgba(255,226,122,.7)' },
    scene: { k: 0, setAmt: 0, night: 0, exposure: 1, sky: ['#74aff0', '#a6d0fa', '#d9ecfe', '#f6faff'], haze: '#eaf4ff', mouseCol: [1, .82, .45],
      sun: { a: 1, fx: .82, fy: .23, rh: .10, core: [2.1, 1.95, 1.4], limb: [1.4, 1.1, .6], glow: [1, .9, .6], detail: .42, corona: .7, flare: 1, rays: .9 },
      moon: { a: 0, fx: .78, fy: 1.35, rh: .15, glow: [.55, .65, 1] }, cloud: { cov: .56, a: .95, lit: [1, 1, 1], shade: [.62, .72, .88] } } },
  evening: { icon: '🌇', hi: 'Good evening', line: 'Winding down? Scroll and watch the sun set.', dot: { base: [232, 184, 200], hot: [249, 100, 80] },
    sky: 'linear-gradient(180deg,#c8b5f0 0%,#f6b3c6 38%,#ffc9a0 70%,#fff0e4 100%)', k: 170, rise: 40, cloud: 'rgba(255,205,215,.7)', clouds: 3,
    body: { size: 300, left: '58%', top: '44%', bg: 'radial-gradient(circle at 40% 40%,#ffc38a,#ff7d52 65%,#ff5f4a)', glow: '0 0 160px 80px rgba(255,110,80,.45)' },
    scene: { k: 170, setAmt: 1, night: 0, exposure: 1, sky: ['#8f82d8', '#e898b8', '#ffb78e', '#fff0e4'], haze: '#ffc3a0', mouseCol: [1, .6, .4],
      sun: { a: 1, fx: .775, fy: .45, rh: .185, core: [1.9, .92, .38], limb: [1.1, .30, .10], glow: [1, .4, .18], detail: .9, corona: .9, flare: .8, rays: 1.5 },
      moon: { a: 0, fx: .78, fy: 1.35, rh: .15, glow: [.55, .65, 1] }, cloud: { cov: .56, a: .78, lit: [1, .76, .66], shade: [.66, .46, .64] } } },
  night: { icon: '🌙', hi: 'Good night', line: 'Burning the midnight oil? Move your cursor, touch the stars.', dot: { base: [40, 48, 84], hot: [255, 209, 102] },
    sky: 'linear-gradient(180deg,#050816 0%,#0c1331 62%,#080c1c 100%)', k: -40, rise: 40, cloud: 'transparent', clouds: 0,
    body: { size: 130, left: '80%', top: '16%', bg: 'radial-gradient(circle at 35% 35%,#fffdf2,#dfe3f5 70%)', glow: '0 0 110px 40px rgba(180,195,255,.35)' },
    scene: { k: -40, setAmt: 0, night: 1, exposure: 1, sky: ['#02040d', '#081027', '#0c1536', '#0a1030'], haze: '#16204a', mouseCol: [.55, .7, 1],
      sun: { a: 0, fx: .78, fy: 1.35, rh: .12, core: [1.9, 1.76, 1.2], limb: [1.3, 1, .55], glow: [1, .9, .6], detail: .6, corona: .6, flare: 0, rays: 0 },
      moon: { a: 1, fx: .865, fy: .30, rh: .14, glow: [.55, .65, 1] }, cloud: { cov: .40, a: .55, lit: [.34, .40, .66], shade: [.02, .03, .08] } } },
};

export const PhaseCtx = createContext('afternoon');
export const usePhase = () => useContext(PhaseCtx);
