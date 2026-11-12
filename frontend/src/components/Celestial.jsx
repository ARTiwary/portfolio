import { useEffect, useRef, useState } from 'react';
import { PHASES, usePhase } from '../phase';

const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FS = `precision highp float;
uniform vec2 uRes,uPos,uMouse; uniform float uT,uR,uMode,uClick; uniform vec3 uTint;
float h1(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
vec3 h3(vec3 p){p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));return fract(sin(p)*43758.5453);}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(h1(i),h1(i+vec3(1,0,0)),f.x),mix(h1(i+vec3(0,1,0)),h1(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(h1(i+vec3(0,0,1)),h1(i+vec3(1,0,1)),f.x),mix(h1(i+vec3(0,1,1)),h1(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fb3(vec3 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n3(p);p=p*2.02+vec3(3.1,1.7,5.3);a*=.5;}return v;}
float fb(vec2 p){return fb3(vec3(p,1.7));}

float crater(vec3 p,float sc,float dens,out vec3 g){
 vec3 q=p*sc,ic=floor(q),bc=vec3(0.);float bx=9.;
 for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)for(int z=-1;z<=1;z++){
  vec3 cell=ic+vec3(float(x),float(y),float(z));vec3 h=h3(cell);
  if(h.x>dens)continue;
  vec3 c=cell+h;float r=.25+.35*h1(cell+7.7);float xx=length(q-c)/r;
  if(xx<bx){bx=xx;bc=c;}
 }
 g=vec3(0.);if(bx>1.6)return 0.;
 float rim=exp(-pow((bx-1.)/.16,2.))*.32;
 float df=(bx<1.?bx:0.)+rim*(-2.*(bx-1.)/.0256);
 vec3 d=q-bc;g=df*d/max(length(d),1e-4);
 return (bx<1.?-.5*(1.-bx*bx):0.)+rim;
}

vec4 moon(vec2 p,float r){
 float z=sqrt(max(0.,1.-r*r));vec3 n=vec3(p,z);
 float a=sin(uT*.05)*.1,ca=cos(a),sa=sin(a);
 vec3 o=vec3(ca*n.x+sa*n.z,n.y,-sa*n.x+ca*n.z);
 vec2 m=clamp((uMouse-uPos)/uR,-7.,7.);vec3 L=normalize(vec3(m*.5,1.));
 float aa=1.3/uR,disc=smoothstep(1.,1.-aa,r);
 vec3 col=vec3(0.);
 if(r<1.){
  vec3 g1,g2,g3;crater(o,3.,.5,g1);crater(o,8.,.55,g2);crater(o,20.,.6,g3);
  vec3 g=g1*.9+g2*.6+g3*.35;g-=o*dot(g,o);
  vec3 gv=vec3(ca*g.x-sa*g.z,g.y,sa*g.x+ca*g.z);
  vec3 N=normalize(n-.34*gv);
  float mare=smoothstep(.46,.6,fb3(o*1.5+vec3(4.,2.,1.)));
  float alb=mix(.82,.34,mare)*(.86+.28*fb3(o*13.));
  float diff=max(dot(N,L),0.)*smoothstep(-.03,.2,dot(n,L));
  col=vec3(.95,.93,.88)*alb*diff*1.25+vec3(.42,.52,.8)*.05*alb;
 }
 float d=max(r-1.,0.),lit=.35+.65*(.5+.5*L.z);
 vec3 gl=vec3(.76,.84,1.)*(exp(-d*6.)*.45+exp(-d*1.5)*.15)*lit;
 float ring=exp(-pow((r-(1.+uClick*1.6))*9.,2.))*exp(-uClick*1.6)*step(uClick,2.5);
 gl+=vec3(.8,.88,1.)*ring*.7;
 vec3 pm=col*disc+gl*(1.-disc);
 float al=disc+(1.-disc)*clamp(max(gl.r,max(gl.g,gl.b))*1.1,0.,1.);
 return vec4(min(pm,vec3(al)),al);
}

vec4 sun(vec2 p,float r){
 float t=uT;vec2 m=(uMouse-uPos)/uR;float md=length(m);vec2 md2=m/max(md,1e-3);
 float near=smoothstep(8.,1.5,md),ma=atan(md2.y,md2.x);
 float aa=1.3/uR,disc=smoothstep(1.,1.-aa,r);vec3 col=vec3(0.);
 if(r<1.){
  float mu=sqrt(1.-r*r);vec2 uv=p/(.4+.6*mu);
  vec2 w=vec2(fb(uv*3.+t*.03),fb(uv*3.+vec2(5.2,1.3)-t*.025));
  float gr=fb(uv*10.+2.*w+t*.05),cells=smoothstep(.28,.82,gr);
  vec3 base=mix(vec3(1.,.4,.07),vec3(1.,.93,.7),pow(mu,.55));
  float sp=smoothstep(.7,.78,fb(uv*1.8+vec2(11.,3.)+t*.004));
  col=base*(.8+.3*cells)*(1.-.5*sp);
  col+=vec3(1.,.9,.6)*pow(1.-mu,3.)*.22*cells+pow(mu,3.)*.32;
  col*=uTint*1.2;
 }
 float d=max(r-1.,0.),ang=atan(p.y,p.x);
 float lean=exp(-pow(abs(atan(sin(ang-ma),cos(ang-ma))),2.)*5.)*near;
 float str=smoothstep(.36,.85,fb(vec2(ang*2.2+t*.02,3.7+d*.6)));
 float glow=exp(-d*7.)*1.05+exp(-d*2.4)*.42+exp(-d*(.9-.55*lean))*.14;
 float rays=str*exp(-d*(1.7-1.*lean))*(.55+1.7*lean);
 float arc=exp(-pow((length(p-md2*1.02)-.34)*22.,2.))*smoothstep(1.,1.05,r)*near*(.65+.35*sin(t*3.+ang*8.));
 float ct=uClick,ring=exp(-pow((r-(1.+ct*2.4))*7.,2.))*exp(-ct*1.1)*step(ct,3.5);
 vec3 cc=(vec3(1.,.62,.22)*(glow+rays*.7)+vec3(1.,.82,.5)*(arc*1.5+ring*1.2))*uTint;
 vec3 pm=col*disc+cc*(1.-disc);
 float al=disc+(1.-disc)*clamp(max(cc.r,max(cc.g,cc.b))*.95,0.,1.);
 return vec4(min(pm,vec3(al)),al);
}
void main(){
 vec2 p=(gl_FragCoord.xy-uPos)/uR;float r=length(p);
 if(r>(uMode<.5?4.5:3.5)){gl_FragColor=vec4(0.);return;}
 gl_FragColor=uMode<.5?sun(p,r):moon(p,r);
}`;

export default function Celestial() {
  const phase = usePhase(), P = PHASES[phase], ref = useRef(null), [fb, setFb] = useState(false);
  useEffect(() => {
    const c = ref.current, gl = c.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) { setFb(true); return; }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s)); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n) => gl.getUniformLocation(pr, n);
    const u = { res: U('uRes'), pos: U('uPos'), mouse: U('uMouse'), t: U('uT'), r: U('uR'), mode: U('uMode'), click: U('uClick'), tint: U('uTint') };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(1.5, devicePixelRatio || 1), t0 = performance.now();
    let W = 0, H = 0, raf = 0, on = true, target = null, sm = null, par = [0, 0], clickAt = -99;
    const resize = () => { const r = c.parentElement.getBoundingClientRect(); W = r.width; H = r.height; c.width = W * dpr; c.height = H * dpr; gl.viewport(0, 0, c.width, c.height); };
    const move = (e) => { const r = c.getBoundingClientRect(); target = [e.clientX - r.left, e.clientY - r.top]; };
    const down = (e) => { const r = c.getBoundingClientRect(); if (e.clientY >= r.top && e.clientY <= r.bottom && !e.target.closest('a,button,input,textarea')) clickAt = (performance.now() - t0) / 1000; };
    const frame = (now) => {
      const t = reduce ? 4 : (now - t0) / 1000, k = Math.min(1.25, Math.max(0.6, W / 1280)), R = P.cel.r * k;
      const eo = 1 - Math.pow(1 - Math.min(1, t / 2.8), 3), s = Math.min(1, scrollY / Math.max(1, H));
      let x = P.cel.x * W, y = P.cel.y * H + s * P.k + (reduce ? 0 : (1 - eo) * P.rise);
      const aim = target || [x - (P.cel.mode ? 4.2 : 12) * R, y - (P.cel.mode ? 1.6 : 0) * R];
      sm = sm || aim.slice(); sm[0] += (aim[0] - sm[0]) * 0.12; sm[1] += (aim[1] - sm[1]) * 0.12;
      par[0] += ((sm[0] - W / 2) * -0.016 - par[0]) * 0.08; par[1] += ((sm[1] - H / 2) * -0.016 - par[1]) * 0.08;
      x += par[0]; y += par[1];
      gl.uniform2f(u.res, c.width, c.height); gl.uniform2f(u.pos, x * dpr, (H - y) * dpr); gl.uniform2f(u.mouse, sm[0] * dpr, (H - sm[1]) * dpr);
      gl.uniform1f(u.t, t); gl.uniform1f(u.r, R * dpr); gl.uniform1f(u.mode, P.cel.mode); gl.uniform1f(u.click, Math.max(0, t - clickAt)); gl.uniform3f(u.tint, ...P.cel.tint);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (on && !reduce) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } });
    resize(); io.observe(c); raf = requestAnimationFrame(frame);
    addEventListener('resize', resize); addEventListener('pointermove', move); addEventListener('pointerdown', down);
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', resize); removeEventListener('pointermove', move); removeEventListener('pointerdown', down); gl.getExtension('WEBGL_lose_context')?.loseContext(); };
  }, []);
  if (fb) { const b = P.body; return <div className="absolute rounded-full" style={{ left: `${P.cel.x * 100}%`, top: `${P.cel.y * 100}%`, width: b.size, height: b.size, transform: 'translate(-50%,-50%)', background: b.bg, boxShadow: b.glow }} />; }
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
