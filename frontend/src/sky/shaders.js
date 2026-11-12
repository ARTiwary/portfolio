// Procedural sky: photosphere sun, cratered moon, lit clouds, milky way.
// No textures. Everything is computed per pixel.
// Coordinates: p = (frag - res/2) / res.y  ->  y up, height spans -0.5..0.5

export const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;
uniform float uTime, uExposure, uNight, uSet;
uniform vec3  uC0, uC1, uC2, uC3, uHaze;

uniform vec2  uSunPos;  uniform float uSunR, uSunA;
uniform vec3  uSunCore, uSunLimb, uSunGlow;
uniform float uDetail, uCorona, uFlare, uRays;

uniform vec2  uMoonPos; uniform float uMoonR, uMoonA;
uniform vec3  uMoonGlow;

uniform float uCloudCov, uCloudA;
uniform vec3  uCloudLit, uCloudShade;
uniform vec2  uPar;

uniform vec2  uMouse;   uniform float uMouseA;
uniform vec3  uMouseCol;

// ---------------------------------------------------------------- noise
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx)*.1031); q += dot(q, q.yzx+33.33); return fract((q.x+q.y)*q.z); }
vec2  h22(vec2 p){ vec3 q = fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); q += dot(q, q.yzx+33.33); return fract((q.xx+q.yz)*q.zy); }

float vn(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1.,0.)), f.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), f.x), f.y);
}
const mat2 M2 = mat2(1.6, 1.2, -1.2, 1.6);
float fbm5(vec2 p){ float a=.5,s=0.; for(int i=0;i<5;i++){ s+=a*vn(p); p=M2*p; a*=.5; } return s; }
float fbm4(vec2 p){ float a=.5,s=0.; for(int i=0;i<4;i++){ s+=a*vn(p); p=M2*p; a*=.5; } return s; }
float fbm3(vec2 p){ float a=.5,s=0.; for(int i=0;i<3;i++){ s+=a*vn(p); p=M2*p; a*=.5; } return s; }

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

// animated worley (F1). Cell points breathe over time.
float worley(vec2 p, float t){
  vec2 i = floor(p), f = fract(p); float d = 8.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g = vec2(float(x), float(y));
    vec2 o = h22(i+g); o = .5+.5*sin(t+6.2831*o);
    vec2 r = g+o-f; d = min(d, dot(r,r));
  }
  return sqrt(d);
}

// ---------------------------------------------------------------- sun
// photosphere colour for a point q on the disc (unit radius)
vec3 photosphere(vec2 q, float t){
  float r2 = dot(q,q);
  float mu = sqrt(max(0., 1.-r2));
  vec3 P = vec3(q, mu);
  float lon = atan(P.x, P.z), lat = asin(clamp(P.y,-1.,1.));
  vec2 s = vec2(lon*cos(lat), lat);

  // convection: big supergranules + small granules, bright cell cores, dark lanes
  float g1 = worley(s*9.0 + 3.1, t*.16);
  float g2 = worley(s*23. + 9.7, t*.30);
  float g3 = worley(s*47. + 1.3, t*.55);
  float cell = (1.-smoothstep(.10,.80,g1))*.30 + (1.-smoothstep(.08,.62,g2))*.50 + (1.-smoothstep(.10,.60,g3))*.20;
  float lanes = mix(.46, 1.16, cell);
  float mott  = .90 + .20*fbm3(s*2.2 + vec2(0., t*.02));

  // sunspots with umbra + penumbra, only in the active belt
  float sp  = fbm4(s*3.4 + vec2(4.2, 1.7));
  float belt = smoothstep(.70,.30,abs(lat));
  float pen = smoothstep(.62,.68,sp)*belt;
  float umb = smoothstep(.68,.74,sp)*belt;
  float spot = 1. - pen*.30 - umb*.50;

  // faculae: bright veins close to the limb
  float fac = smoothstep(.55,.95,1.-mu) * smoothstep(.45,.75,vn(s*7.+1.3)) * .22;

  // limb darkening (real sun: I = 1 - u(1-mu))
  float ld = 1. - .50*(1.-mu);
  vec3 col = mix(uSunLimb, uSunCore, pow(mu, .55)) * ld;
  col *= mix(1., lanes*mott*spot, uDetail);
  col += fac * uSunCore * uDetail;
  return col;
}

// ---------------------------------------------------------------- moon
float mare(vec2 q, vec2 c, vec2 sz, float wob){
  vec2 v = (q-c)/sz; float d = length(v);
  d += (vn(q*9.+c*13.)-.5)*wob;
  return 1. - smoothstep(.68, 1., d);
}

// crater height field. p in cell space, returns height (negative = bowl)
float craterLayer(vec2 p, float seed, float density){
  vec2 i = floor(p), f = fract(p); float h = 0.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g = vec2(float(x), float(y));
    vec2 id = i+g+seed;
    float present = step(1.-density, h21(id+7.3));
    vec2 o = .2+.6*h22(id);
    float rad = .20 + .26*h21(id+3.7);
    float d = length(g+o-f)/rad;
    float bowl = -(1.-d*d)*step(d,1.);
    float rim  = exp(-pow((d-1.02)*4.2, 2.))*.55;
    float peak = exp(-d*d*28.)*.25 * step(.38,rad);
    h += present*rad*(bowl*1.05 + rim + peak);
  }
  return h;
}
float lunarH(vec2 s, float mareMask){
  float k = 1. - .75*mareMask;
  return craterLayer(s*3.6, 11., .55)*1.00
       + craterLayer(s*8.2, 37., .60)*.55*k
       + craterLayer(s*19., 71., .62)*.30*k
       + (fbm3(s*28.)-.5)*.05;
}

vec4 moonSurface(vec2 q, vec3 L){
  float r2 = dot(q,q);
  float mu = sqrt(max(0., 1.-r2));
  vec3 P = vec3(q, mu);
  P.xy = rot(.30) * P.xy;                         // tilt so the face reads like the real one
  float lon = atan(P.x, P.z), lat = asin(clamp(P.y,-1.,1.));
  vec2 s = vec2(lon*cos(lat), lat);
  vec2 f = rot(.30) * q;                          // disc-space for maria placement

  // maria: dark basaltic seas in their real places
  float m = 0.;
  m = max(m, mare(f, vec2(-.30, .40), vec2(.26,.22), .30));   // Imbrium
  m = max(m, mare(f, vec2( .10, .44), vec2(.14,.12), .22));   // Serenitatis
  m = max(m, mare(f, vec2( .29, .18), vec2(.21,.13), .28));   // Tranquillitatis
  m = max(m, mare(f, vec2( .60, .33), vec2(.10,.07), .18));   // Crisium
  m = max(m, mare(f, vec2( .56,-.10), vec2(.10,.16), .26));   // Fecunditatis
  m = max(m, mare(f, vec2( .40,-.14), vec2(.07,.06), .20));   // Nectaris
  m = max(m, mare(f, vec2( .00, .21), vec2(.09,.08), .22));   // Vaporum
  m = max(m, mare(f, vec2(-.62, .04), vec2(.26,.34), .34));   // Oceanus Procellarum
  m = max(m, mare(f, vec2(-.17,-.36), vec2(.17,.11), .26));   // Nubium
  m = max(m, mare(f, vec2(-.50,-.42), vec2(.09,.08), .20));   // Humorum
  m = max(m, mare(f, vec2(-.30,-.13), vec2(.10,.08), .22));   // Cognitum
  m = max(m, mare(f, vec2(-.02, .80), vec2(.34,.055), .20));  // Frigoris
  float mareMask = smoothstep(.1,.9,m);

  float alb = mix(.80, .30, mareMask);
  alb *= .90 + .20*fbm4(s*6. + 2.);               // soft mottling
  alb *= 1. - .18*mareMask*vn(s*17.);             // streaks inside the maria

  // bright rayed craters: Tycho (south) and Copernicus
  vec2 tv = f - vec2(-.10,-.66); float tr = length(tv); vec2 td = tv/max(tr,1e-3);
  float tray = pow(vn(td*5.5 + 2.), 3.) * exp(-tr*2.4) * smoothstep(.02,.07,tr);
  alb += tray*.55 + exp(-tr*tr*900.)*.5;
  vec2 cv = f - vec2(-.36,.20); float cr = length(cv); vec2 cd = cv/max(cr,1e-3);
  float cray = pow(vn(cd*6. + 8.), 3.) * exp(-cr*5.) * smoothstep(.012,.04,cr);
  alb += cray*.35 + exp(-cr*cr*2500.)*.45;

  // relief from the crater field via finite differences
  float e = .018;
  float h0 = lunarH(s, mareMask);
  float hx = lunarH(s+vec2(e,0.), mareMask);
  float hy = lunarH(s+vec2(0.,e), mareMask);
  vec3 T = normalize(cross(vec3(0.,1.,0.), P) + vec3(1e-4,0.,0.));
  vec3 B = cross(P, T);
  vec3 N = normalize(P - ((hx-h0)*T + (hy-h0)*B) * (.55/e) * .2);
  N.xy = rot(-.30) * N.xy;                        // undo the tilt so light stays in screen space
  vec3 Pv = vec3(q, mu);

  float mu0 = max(dot(N, L), 0.);
  float mv  = max(N.z, .06);
  float ls  = mu0/(mu0+mv) * 2.0;                  // Lommel-Seeliger: flat like the real moon, no limb darkening
  float cavity = clamp(.78 + 1.2*(h0*.5 + .25), .55, 1.25);
  vec3 lit = vec3(1.0,.975,.93) * alb * ls * (.86+.14*cavity) * 1.18;

  float dayside = smoothstep(-.02, .10, dot(Pv, L));
  vec3 earth = vec3(.55,.68,1.) * alb * .045 * mu;  // faint earthshine on the dark side
  vec3 col = mix(earth, lit, dayside);

  float edge = 1. - smoothstep(.985, 1., sqrt(r2));
  return vec4(col, edge);
}

// ---------------------------------------------------------------- clouds
float cloudField(vec2 p, float scale, float spd, float cov){
  vec2 q = p*scale + vec2(uTime*spd, 0.);
  float w = fbm3(q*.55 + 3.1);
  float n = fbm4(q + w*.9);
  return smoothstep(1.-cov, 1.-cov+.20, n);
}

// ---------------------------------------------------------------- sky helpers
vec3 skyGrad(float t){
  vec3 c = mix(uC0, uC1, smoothstep(0., .42, t));
  c = mix(c, uC2, smoothstep(.34, .78, t));
  c = mix(c, uC3, smoothstep(.72, 1., t));
  return c;
}
float tanhf(float x){ x = clamp(x, -9., 9.); float e = exp(2.*x); return (e-1.)/(e+1.); }
float shl(float v){ return v < .82 ? v : .82 + .18*tanhf((v-.82)/.18); }
vec3 shoulder(vec3 c){ return vec3(shl(c.r), shl(c.g), shl(c.b)); }

void main(){
  vec2 p = (gl_FragCoord.xy - .5*uRes) / uRes.y;
  float t = uTime;
  float ty = 1. - (gl_FragCoord.y/uRes.y);          // 0 top .. 1 bottom

  // ---------- base sky
  vec3 col = skyGrad(ty);
  col = mix(col, col*vec3(.74,.60,.86), uSet*.65);   // dusk deepens as you scroll
  col = mix(col, uHaze, smoothstep(.55,1.,ty)*.55);  // horizon haze

  vec2 ps = uSunPos, pm = uMoonPos;
  vec2 ds = p-ps, dm = p-pm;
  float rs = length(ds)/uSunR, rm = length(dm)/uMoonR;

  // atmosphere scattering around the bodies
  float skyGlow = uSunA*(.62*exp(-rs*.55) + .30*exp(-rs*.16));
  col += uSunGlow * skyGlow * .40;
  float moonGlow = uMoonA*(.42*exp(-rm*1.15) + .12*exp(-rm*.38));
  col += uMoonGlow * moonGlow;
  col += uMoonGlow * uMoonA * .05 * exp(-pow((rm-3.1)*3.2, 2.));   // faint ice halo

  // ---------- night: fine star dust + milky way (canvas stars sit on top)
  if (uNight > .01){
    vec2 g = p*uRes.y/6.5; vec2 gi = floor(g), gf = fract(g);
    float hh = h21(gi);
    float st = 0.;
    if (hh > .935){
      vec2 o = h22(gi+3.)*.6+.2; float d = length(gf-o);
      float tw = .65 + .35*sin(t*(1.+hh*4.) + hh*60.);
      st = smoothstep(.26,0.,d) * tw * (hh-.935)/.065;
    }
    vec3 stc = mix(vec3(.75,.85,1.), vec3(1.,.88,.7), h21(gi+9.1));
    float band = dot(p - vec2(.18,.05), vec2(sin(.62), -cos(.62)));
    float core = exp(-pow(band/.21, 2.));
    vec2 mp = p*5.5;
    float dust = fbm5(mp + 4.);
    float lane = smoothstep(.46,.68, fbm4(mp*1.8 + 11.));
    float mw = core*(.45 + .85*dust)*(1. - .62*lane*core);
    vec3 mwc = mix(vec3(.30,.38,.78), vec3(.95,.72,.55), core*core*dust);
    float grain = step(.8, h21(floor(p*uRes.y/1.7)))*.55*core;
    col += (stc*st*.95 + mwc*mw*.34 + mwc*grain*.20) * uNight;
  }

  float discSun = 0., discMoon = 0.;

  // ---------- sun
  if (uSunA > .003){
    float R = uSunR;
    vec2 q = ds/R;
    float r = length(q);
    float aa = 1.6/(uRes.y*R);
    float sunMask = 0.; vec3 sunDisc = vec3(0.);
    if (r < 1.+aa){
      sunDisc = photosphere(q*min(1., 1./max(r,1.)), t);
      sunMask = 1. - smoothstep(1.-aa, 1.+aa, r);
      discSun = sunMask*uSunA;
    }
    // corona + prominences (angle via cos/sin so there is no seam), outside the limb only
    if (r > .96){
      vec2 dir = ds/max(length(ds),1e-4);
      vec2 toM = uMouse - ps; float dM = length(toM); vec2 dirM = toM/max(dM,1e-4);
      float face = pow(max(0., dot(dir, dirM)), 5.) * uMouseA * smoothstep(.9, .2, dM);   // the sun leans toward your cursor
      float st1 = fbm4(dir*3.4 + vec2(0., t*.035));
      float st2 = vn(dir*10. + vec2(5., -t*.06));
      float streak = pow(clamp(st1*1.45, 0., 1.), 2.2) * (.55 + .9*st2);
      streak *= 1. + face*1.6;
      float fall = exp(-(r-1.)*(1.15 + (1.-clamp(streak,0.,1.))*3.2));
      float cor = streak * fall * smoothstep(.96, 1.05, r) * uCorona;
      col += uSunGlow * cor * 1.25 * uSunA;

      // prominences: hydrogen-alpha arcs standing off the limb
      float ph = pow(vn(dir*2.6 + vec2(7., t*.045)), 4.) * .62;
      ph *= 1. + face*1.4;
      float rp = r - 1.;
      float inP = step(0., rp) * (1. - smoothstep(0., ph+.001, rp));
      float fil = .55 + .45*vn(vec2(rp*34., 0.) + dir*6.);
      col += vec3(1., .30, .16) * inP * fil * smoothstep(.12,.30,ph) * 1.5 * uCorona * uSunA;
    }
    col = mix(col, sunDisc, sunMask*uSunA);
  }

  // ---------- moon
  if (uMoonA > .003){
    vec2 q = dm/uMoonR;
    if (length(q) < 1.04){
      vec3 L = normalize(vec3(-.80, .34, .50));
      vec4 mo = moonSurface(q, L);
      col = mix(col, mo.rgb, mo.a*uMoonA);
      discMoon = mo.a*uMoonA;
    }
  }

  // ---------- clouds (two layers, lit from whichever body is up)
  {
    vec2 lp = uMoonA > uSunA ? pm : ps;
    float lightK = max(uSunA, uMoonA);
    float vm = .32 + .68*smoothstep(.46, -.18, p.y);

    for (int li = 0; li < 2; li++){
      float far = li == 0 ? 1. : 0.;
      float scale = far > .5 ? 3.4 : 1.9;
      float spd   = far > .5 ? .010 : .018;
      vec2 off = uPar * (far > .5 ? .025 : .06);
      vec2 q = p + off + vec2(far*7.3, far*3.1);
      float cov = uCloudCov * (far > .5 ? .92 : 1.0);
      float d  = cloudField(q, scale, spd, cov);
      vec2 toL = normalize(lp - p + 1e-4);
      float d2 = cloudField(q + toL*.03, scale, spd, cov);
      float lightEdge = clamp((d - d2)*4.0 + .55, 0., 1.);
      vec3 body = mix(uCloudShade, uCloudLit, lightEdge);
      body = mix(body, uCloudShade, smoothstep(.55,1.,d)*.30);
      // forward scattering: edges glow when they sit near the light source
      float near = exp(-length(p-lp)*2.4) * lightK;
      float rim = d*(1.-d)*4.;
      body += (uSunA > uMoonA ? uSunGlow : uMoonGlow) * rim * near * 1.1;
      // cursor as a torch
      float mt = exp(-dot(p-uMouse, p-uMouse)/.028) * uMouseA;
      body += uMouseCol * mt * (.35 + .6*d);
      float a = d * uCloudA * vm * (far > .5 ? .72 : 1.) * (1. - discSun*.9) * (1. - discMoon*.55);
      col = mix(col, body, clamp(a,0.,1.));
    }
  }

  // ---------- light that falls over everything: bloom, god rays, lens flare
  if (uSunA > .003){
    float r = length(ds)/uSunR;
    vec2 dir = ds/max(length(ds),1e-4);
    float bloom = exp(-max(r-.9,0.)*1.6) * .20 + exp(-r*.22)*.08;
    col += uSunGlow * bloom * uSunA * (1. - (1.-smoothstep(1.0,1.03,r))*.92);

    float ray = (vn(dir*7. + vec2(2., t*.02))*.6 + vn(dir*19. - t*.03)*.4);
    ray = pow(ray, 2.2) * 1.8;
    col += uSunGlow * ray * exp(-r*.34) * smoothstep(.9, 1.6, r) * uRays * uSunA * .22;

    // anamorphic streak + ghosts
    float stk = exp(-abs(ds.y)*110.) * exp(-abs(ds.x)*3.0) * .26 * uFlare;
    col += vec3(.55,.72,1.) * stk * uSunA * (1. - discSun);
    for (int i=0;i<4;i++){
      float k  = i==0 ? .42 : i==1 ? .78 : i==2 ? 1.32 : 1.85;
      float gr = i==0 ? .030 : i==1 ? .055 : i==2 ? .022 : .070;
      vec2 gp = -ps*k;
      float l = length(p-gp)/gr;
      float ring = smoothstep(1.,.86,l) * (1.-smoothstep(.55,.0,l)*.55);
      vec3 tint = i==0 ? vec3(1.,.55,.25) : i==1 ? vec3(.35,.75,1.) : i==2 ? vec3(.9,.4,.9) : vec3(.5,1.,.7);
      col += tint * ring * .075 * uFlare * uSunA * smoothstep(.2,.8,length(ps));
    }
  }
  if (uMoonA > .003){
    float r = length(dm)/uMoonR;
    col += uMoonGlow * exp(-max(r-1.,0.)*3.) * .12 * uMoonA;
  }

  // cursor glow in the open sky
  col += uMouseCol * exp(-dot(p-uMouse,p-uMouse)/.06) * uMouseA * .13;

  col *= uExposure;
  col = shoulder(col);
  col += (h21(gl_FragCoord.xy + fract(t)*91.) - .5) / 255.;   // dither, kills gradient banding
  gl_FragColor = vec4(col, 1.);
}
`;
