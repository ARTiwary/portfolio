import { useEffect, useRef, useState } from 'react';
import { usePhase } from '../phase';

// The twin's face: a miniature sun by day, a miniature moon at night.
// It boils faster and throws flares while the twin thinks, and pulses while it speaks.
const PAL = {
  morning:   { core: [1.5, .95, .4],  limb: [.95, .3, .08], glow: [1, .5, .2],  moon: 0 },
  afternoon: { core: [1.9, 1.7, 1.1], limb: [1.3, .95, .45], glow: [1, .85, .5], moon: 0 },
  evening:   { core: [1.8, .9, .4],   limb: [1.05, .3, .1], glow: [1, .42, .2], moon: 0 },
  night:     { core: [1, 1, 1],       limb: [1, 1, 1],      glow: [.55, .68, 1], moon: 1 },
};
const VERT = 'attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0., 1.); }';
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform float uTime, uMoon, uThink, uSpeak; uniform vec3 uCore, uLimb, uGlow;
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx)*.1031); q += dot(q, q.yzx+33.33); return fract((q.x+q.y)*q.z); }
vec2  h22(vec2 p){ vec3 q = fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); q += dot(q, q.yzx+33.33); return fract((q.xx+q.yz)*q.zy); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
const mat2 M2 = mat2(1.6,1.2,-1.2,1.6);
float fbm3(vec2 p){ float a=.5,s=0.; for(int i=0;i<3;i++){ s+=a*vn(p); p=M2*p; a*=.5; } return s; }
float worley(vec2 p, float t){
  vec2 i=floor(p), f=fract(p); float d=8.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g=vec2(float(x),float(y)); vec2 o=h22(i+g); o=.5+.5*sin(t+6.2831*o);
    vec2 r=g+o-f; d=min(d,dot(r,r));
  } return sqrt(d);
}
float crater(vec2 p){
  vec2 i=floor(p), f=fract(p); float h=0.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g=vec2(float(x),float(y)); vec2 id=i+g;
    vec2 o=.2+.6*h22(id); float rad=.22+.25*h21(id+3.7);
    float d=length(g+o-f)/rad;
    h += step(.4,h21(id+7.3))*rad*(-(1.-d*d)*step(d,1.) + .55*exp(-pow((d-1.02)*4.,2.)));
  } return h;
}
void main(){
  vec2 q = gl_FragCoord.xy/uRes*2.-1.;
  float pulse = .5+.5*sin(uTime*8.5);
  float R = .64*(1.+.035*uSpeak*pulse);
  vec2 d = q/R; float r = length(d);
  float aa = 2./(uRes.y*R);
  vec3 surf = vec3(0.);
  if (r < 1.+aa){
    vec2 dd = d*min(1.,1./max(r,1.));
    float m2 = sqrt(max(0.,1.-dot(dd,dd)));
    vec3 P = vec3(dd,m2);
    float lon=atan(P.x,P.z), lat=asin(clamp(P.y,-1.,1.));
    vec2 s = vec2(lon*cos(lat), lat);
    if (uMoon < .5){
      float t = uTime*(.25+.9*uThink);
      float g1 = worley(s*7.+3.1, t*.5), g2 = worley(s*16.+9., t);
      float cell = (1.-smoothstep(.1,.75,g1))*.45 + (1.-smoothstep(.08,.6,g2))*.55;
      float sp = fbm3(s*2.6+4.);
      float spot = 1. - smoothstep(.60,.70,sp)*.5*smoothstep(.7,.3,abs(lat));
      float ld = 1. - .5*(1.-m2);
      surf = mix(uLimb, uCore, pow(m2,.55)) * ld * mix(.5,1.15,cell) * spot;
    } else {
      float mare = smoothstep(.50,.60,fbm3(s*1.7+vec2(2.,5.)));
      float alb = mix(.84,.34,mare);
      float e = .02, h0 = crater(s*5.), hx = crater(s*5.+vec2(e,0.)), hy = crater(s*5.+vec2(0.,e));
      vec3 T = normalize(cross(vec3(0.,1.,0.),P)+vec3(1e-4,0.,0.)); vec3 B = cross(P,T);
      vec3 N = normalize(P - ((hx-h0)*T + (hy-h0)*B)/e*.30);
      vec3 L = normalize(vec3(-.75,.35,.55));
      float mu0 = max(dot(N,L),0.), mv = max(N.z,.06);
      float day = smoothstep(-.02,.10,dot(P,L));
      vec3 lit = vec3(1.,.975,.93)*alb*(mu0/(mu0+mv))*2.3;
      surf = mix(vec3(.55,.68,1.)*alb*.05, lit, day);
    }
  }
  float mask = 1.-smoothstep(1.-aa,1.+aa,r);
  float outside = smoothstep(.96,1.04,r);
  vec2 dir = d/max(r,1e-4);
  float st = pow(clamp(fbm3(dir*2.4+vec2(0.,uTime*(.06+.35*uThink)))*1.5,0.,1.),2.);
  float halo = exp(-max(r-1.,0.)*(2.6-1.1*uThink)) * (.50+.30*uThink+.30*uSpeak*pulse);
  float cor = st*exp(-(r-1.)*1.6)*(.5+.9*uThink)*(1.-uMoon);
  float fe = 1.-smoothstep(.78,1.,length(q));
  vec3 emit = uGlow*(halo*(1.-.25*uMoon)+cor)*outside*fe;
  float ea = clamp(max(emit.r,max(emit.g,emit.b)),0.,1.);
  gl_FragColor = vec4(mix(emit, min(surf,vec3(1.)), mask), mix(ea,1.,mask));
}
`;

export default function TwinOrb({ size = 64, mood = 'idle', className = '' }) {
  const phase = usePhase();
  const cv = useRef(null);
  const live = useRef({ mood, phase, kick: null });
  const [ok, setOk] = useState(true);

  useEffect(() => { live.current.mood = mood; live.current.phase = phase; live.current.kick?.(); }, [mood, phase]);

  useEffect(() => {
    const c = cv.current;
    const gl = c.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl) { setOk(false); return; }
    const mk = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const vs = mk(gl.VERTEX_SHADER, VERT), fs = mk(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs) { setOk(false); return; }
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setOk(false); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {}; ['uRes', 'uTime', 'uMoon', 'uThink', 'uSpeak', 'uCore', 'uLimb', 'uGlow'].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

    const dpr = Math.min(2, devicePixelRatio || 1);
    c.width = c.height = Math.round(size * dpr * 1.0); gl.viewport(0, 0, c.width, c.height);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const P0 = PAL[live.current.phase];
    const state = live.current;
    const cur = { think: 0, speak: 0, moon: P0.moon, core: P0.core.slice(), limb: P0.limb.slice(), glow: P0.glow.slice() };
    let raf = 0, last = 0, vis = true, dead = false;

    const frame = (now) => {
      raf = 0; if (dead || !vis || document.hidden) return;
      const dt = Math.max(0.001, Math.min(0.1, (now - last) / 1000 || 0.016)); last = now;
      const L = live.current, T = PAL[L.phase], k = reduce ? 1 : 1 - Math.exp(-dt * 4);
      cur.think += ((L.mood === 'think' ? 1 : 0) - cur.think) * k;
      cur.speak += ((L.mood === 'speak' ? 1 : 0) - cur.speak) * k;
      cur.moon += (T.moon - cur.moon) * k;
      for (let i = 0; i < 3; i++) { cur.core[i] += (T.core[i] - cur.core[i]) * k; cur.limb[i] += (T.limb[i] - cur.limb[i]) * k; cur.glow[i] += (T.glow[i] - cur.glow[i]) * k; }
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.uRes, c.width, c.height); gl.uniform1f(U.uTime, reduce ? 6 : 6 + now / 1000);
      gl.uniform1f(U.uMoon, cur.moon); gl.uniform1f(U.uThink, cur.think); gl.uniform1f(U.uSpeak, cur.speak);
      gl.uniform3fv(U.uCore, cur.core); gl.uniform3fv(U.uLimb, cur.limb); gl.uniform3fv(U.uGlow, cur.glow);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && !dead) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    live.current.kick = kick;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) kick(); }); io.observe(c);
    const onVis = () => { if (!document.hidden) kick(); }; document.addEventListener('visibilitychange', onVis);
    kick();
    return () => {
      dead = true; cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener('visibilitychange', onVis);
      state.kick = null; gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf);
    };
  }, [size]);

  if (!ok) return <span className={`twin-fallback ${className}`} style={{ width: size, height: size }} aria-hidden="true" />;
  return <canvas ref={cv} className={className} style={{ width: size, height: size }} aria-hidden="true" />;
}
