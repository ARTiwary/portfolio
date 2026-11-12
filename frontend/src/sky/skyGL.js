import { VERT, FRAG } from './shaders';
import { pointer } from '../pointer';

const hex = (h) => { const n = parseInt(h.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
const SCAL = ['sunA', 'moonA', 'sunRh', 'moonRh', 'sunFx', 'sunFy', 'moonFx', 'moonFy', 'detail', 'corona', 'flare', 'rays', 'cloudCov', 'cloudA', 'night', 'exposure', 'set'];
const VEC3 = ['c0', 'c1', 'c2', 'c3', 'haze', 'sunCore', 'sunLimb', 'sunGlow', 'moonGlow', 'cloudLit', 'cloudShade', 'mouseCol'];

// flatten a PHASES[x].scene into one lerp-able object
function flatten(s) {
  const S = s.sun, M = s.moon, C = s.cloud;
  return {
    sunA: S.a, moonA: M.a, sunRh: S.rh, moonRh: M.rh, sunFx: S.fx, sunFy: S.fy, moonFx: M.fx, moonFy: M.fy,
    detail: S.detail, corona: S.corona, flare: S.flare, rays: S.rays,
    cloudCov: C.cov, cloudA: C.a, night: s.night, exposure: s.exposure, set: 0,
    c0: hex(s.sky[0]), c1: hex(s.sky[1]), c2: hex(s.sky[2]), c3: hex(s.sky[3]), haze: hex(s.haze),
    sunCore: S.core, sunLimb: S.limb, sunGlow: S.glow, moonGlow: M.glow, cloudLit: C.lit, cloudShade: C.shade, mouseCol: s.mouseCol,
    _k: s.k, _setAmt: s.setAmt,
  };
}
const clone = (o) => { const c = {}; for (const k in o) c[k] = Array.isArray(o[k]) ? o[k].slice() : o[k]; return c; };

export function createSky(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  if (!gl) return null;

  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('[sky] shader error', gl.getShaderInfoLog(s)); return null; }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn('[sky] link error', gl.getProgramInfoLog(prog)); return null; }
  gl.useProgram(prog);

  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  ['uRes', 'uTime', 'uExposure', 'uNight', 'uSet', 'uC0', 'uC1', 'uC2', 'uC3', 'uHaze', 'uSunPos', 'uSunR', 'uSunA', 'uSunCore', 'uSunLimb', 'uSunGlow',
    'uDetail', 'uCorona', 'uFlare', 'uRays', 'uMoonPos', 'uMoonR', 'uMoonA', 'uMoonGlow', 'uCloudCov', 'uCloudA', 'uCloudLit', 'uCloudShade', 'uPar',
    'uMouse', 'uMouseA', 'uMouseCol'].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = null, tgt = null, quality = 1;   // quality drops automatically on slow GPUs
  let cssW = 1, cssH = 1, raf = 0, last = 0, vis = true, dead = false, frames = 0, slow = 0;
  const m = { x: 0.6, y: 0.4, a: 0 };
  let lostCb = null;

  // pixel budget: sharp on phones (small screen, high density), lighter on huge desktop heroes
  const scaleNow = () => Math.max(0.4, Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(950000 / Math.max(1, cssW * cssH))) * quality);
  const apply = () => {
    const scale = scaleNow();
    const w = Math.max(2, Math.round(cssW * scale)), h = Math.max(2, Math.round(cssH * scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  };
  const ro = new ResizeObserver(([e]) => { cssW = e.contentRect.width || 1; cssH = e.contentRect.height || 1; apply(); kick(); });
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) kick(); });
  io.observe(canvas);
  const onVis = () => { if (!document.hidden) kick(); };
  document.addEventListener('visibilitychange', onVis);
  const onLost = (e) => { e.preventDefault(); dead = true; lostCb && lostCb(); };
  canvas.addEventListener('webglcontextlost', onLost);

  function setScene(scene) {
    tgt = flatten(scene);
    if (!cur) {
      cur = clone(tgt);
      if (!reduce) { cur.sunFy += 0.5; cur.moonFy += 0.5; cur.exposure = 0.25; }   // page-load sunrise / moonrise
    }
    if (reduce) cur = clone(tgt);
    kick();
  }

  function step(dt, now) {
    const k = reduce ? 1 : 1 - Math.exp(-dt * 1.35);
    for (const key of SCAL) cur[key] += (tgt[key] - cur[key]) * k;
    for (const key of VEC3) for (let i = 0; i < 3; i++) cur[key][i] += (tgt[key][i] - cur[key][i]) * k;
    cur._k = tgt._k; cur._setAmt = tgt._setAmt;

    // pointer (or an idle drifting light when there is no mouse)
    const r = canvas.getBoundingClientRect();
    const idle = !pointer.seen || !pointer.fine || now - pointer.t > 5000;
    let nx, ny, a;
    if (idle) { nx = 0.5 + 0.30 * Math.sin(now / 3300); ny = 0.42 + 0.16 * Math.sin(now / 2400 + 1); a = 0.5; }
    else {
      nx = (pointer.x - r.left) / r.width; ny = (pointer.y - r.top) / r.height;
      a = nx > -0.1 && nx < 1.1 && ny > -0.1 && ny < 1.1 ? 1 : 0;
    }
    const km = reduce ? 1 : 1 - Math.exp(-dt * 8), ka = reduce ? 1 : 1 - Math.exp(-dt * 4);
    m.x += (nx - m.x) * km; m.y += (ny - m.y) * km; m.a += (a - m.a) * ka;
    return r;
  }

  function draw(now, r) {
    const aspect = r.width / Math.max(1, r.height);
    const sy = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
    const kfrac = (cur._k || 0) / Math.max(1, r.height) * sy;
    const px = m.x - 0.5, py = m.y - 0.5;
    const ox = -px * 26 / Math.max(1, r.width), oy = -py * 26 / Math.max(1, r.height);
    const cap = 0.21 * aspect;
    const sunR = Math.min(cur.sunRh, cap), moonR = Math.min(cur.moonRh, cap);
    const sunFy = cur.sunFy + kfrac, moonFy = cur.moonFy + kfrac * 0.4;

    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, reduce ? 24 : 20 + now / 1000);
    gl.uniform1f(U.uExposure, cur.exposure);
    gl.uniform1f(U.uNight, cur.night);
    gl.uniform1f(U.uSet, sy * (cur._setAmt || 0));
    gl.uniform3fv(U.uC0, cur.c0); gl.uniform3fv(U.uC1, cur.c1); gl.uniform3fv(U.uC2, cur.c2); gl.uniform3fv(U.uC3, cur.c3); gl.uniform3fv(U.uHaze, cur.haze);
    gl.uniform2f(U.uSunPos, (cur.sunFx - 0.5) * aspect + ox * aspect, 0.5 - sunFy + oy);
    gl.uniform1f(U.uSunR, sunR); gl.uniform1f(U.uSunA, cur.sunA);
    gl.uniform3fv(U.uSunCore, cur.sunCore); gl.uniform3fv(U.uSunLimb, cur.sunLimb); gl.uniform3fv(U.uSunGlow, cur.sunGlow);
    gl.uniform1f(U.uDetail, cur.detail); gl.uniform1f(U.uCorona, cur.corona); gl.uniform1f(U.uFlare, cur.flare); gl.uniform1f(U.uRays, cur.rays);
    gl.uniform2f(U.uMoonPos, (cur.moonFx - 0.5) * aspect + ox * aspect, 0.5 - moonFy + oy);
    gl.uniform1f(U.uMoonR, moonR); gl.uniform1f(U.uMoonA, cur.moonA); gl.uniform3fv(U.uMoonGlow, cur.moonGlow);
    gl.uniform1f(U.uCloudCov, cur.cloudCov); gl.uniform1f(U.uCloudA, cur.cloudA);
    gl.uniform3fv(U.uCloudLit, cur.cloudLit); gl.uniform3fv(U.uCloudShade, cur.cloudShade);
    gl.uniform2f(U.uPar, px * aspect, -py);
    gl.uniform2f(U.uMouse, (m.x - 0.5) * aspect, 0.5 - m.y); gl.uniform1f(U.uMouseA, m.a); gl.uniform3fv(U.uMouseCol, cur.mouseCol);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame(now) {
    raf = 0;
    if (dead || !vis || document.hidden || !cur) return;
    const dt = Math.max(0.001, Math.min(0.1, (now - last) / 1000 || 0.016)); last = now;
    const r = step(dt, now);
    draw(now, r);
    // adaptive resolution: stay smooth on weak GPUs
    if (++frames > 40 && dt < 0.09) {
      slow = dt > 0.028 ? slow + 1 : Math.max(0, slow - 1);
      if (slow > 45 && quality > 0.45) { quality *= 0.85; slow = 0; apply(); }
    }
    if (!reduce) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && !dead) { last = performance.now(); raf = requestAnimationFrame(frame); } }

  return {
    setScene,
    onLost: (cb) => { lostCb = cb; },
    destroy() {
      dead = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis); canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
    },
  };
}
