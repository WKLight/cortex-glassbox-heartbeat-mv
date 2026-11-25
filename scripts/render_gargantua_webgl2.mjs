// ============================================================================
// CORTEX V8.5 // Singularity Kerr Spacetime Funnel & Warped Metric Grid Renderer
// Multi-pass HDR RGBA16F WebGL2 Shader (with seamless RGBA8 fallback)
// Renders 285 frames (1920x1080 @ 60fps, t = 34.45..39.20s) -> B3D_06_singularity
// Visual Geometry: Oblique 3D spacetime funnel + fwidth-AA Einstein/Kerr grid
//   + 3D circular photon sphere shadow + high-velocity wispy spiral filaments
// Palette: CORTEX Void Indigo / Deep Sapphire / Electric Ice-Cyan / Platinum HDR
// ============================================================================
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = 'F:\\cortex_v6_3d\\B3D_06_singularity';
const TOTAL_FRAMES = 285;
const FPS = 60;
const W = 1920;
const H = 1080;
const IS_LOOKDEV = process.argv.includes('--lookdev');
const RENDER_INDICES = IS_LOOKDEV ? [12, 60, 114, 168, 222, 270] : Array.from({ length: TOTAL_FRAMES }, (_, i) => i);

fs.mkdirSync(OUT_DIR, { recursive: true });
if (!IS_LOOKDEV) {
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (/^f\d+\.jpg$/.test(f)) fs.unlinkSync(path.join(OUT_DIR, f));
  }
}

const HTML = String.raw`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>html,body,canvas{margin:0;padding:0;width:1920px;height:1080px;background:#000;overflow:hidden}</style></head>
<body>
<canvas id="gl" width="1920" height="1080"></canvas>
<script>
(async () => {
  const canvas = document.getElementById('gl');
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('WebGL2 unavailable');

  const extFloat = gl.getExtension('EXT_color_buffer_float');
  gl.getExtension('OES_texture_float_linear');

  const QUAD_VS = '#version 300 es\nin vec2 aPos; out vec2 vUv; void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }';

  const GARGANTUA_FS = '#version 300 es\n' + [
    'precision highp float;',
    'in vec2 vUv;',
    'out vec4 fragColor;',
    'uniform float uTime;',
    'uniform float uDur;',
    'uniform vec2 uRes;',
    'uniform vec3 uCamPos;',
    'uniform vec3 uCamFwd;',
    'uniform vec3 uCamRight;',
    'uniform vec3 uCamUp;',
    'uniform float uFovScale;',
    'uniform float uSub4Surge;',
    'const float PI = 3.14159265359;',
    'const float TAU = 6.28318530718;',
    'const float R_EH = 0.42;',
    'float hash31(vec3 p){ p = fract(p * vec3(443.897, 441.423, 437.195)); p += dot(p, p.yzx + 19.19); return fract((p.x + p.y) * p.z); }',
    'float noise3(vec3 p){ vec3 i = floor(p); vec3 f = fract(p); f = f*f*(3.0-2.0*f);',
    '  float n000=hash31(i), n100=hash31(i+vec3(1,0,0)), n010=hash31(i+vec3(0,1,0)), n110=hash31(i+vec3(1,1,0));',
    '  float n001=hash31(i+vec3(0,0,1)), n101=hash31(i+vec3(1,0,1)), n011=hash31(i+vec3(0,1,1)), n111=hash31(i+vec3(1,1,1));',
    '  return mix(mix(mix(n000,n100,f.x),mix(n010,n110,f.x),f.y), mix(mix(n001,n101,f.x),mix(n011,n111,f.x),f.y), f.z); }',
    'float fbm3(vec3 p){ float v = 0.0, a = 0.5; for(int i=0;i<5;i++){ v += a*noise3(p); p = p*2.09 + vec3(7.3,-4.1,2.9); a *= 0.5; } return v; }',
    'float ridge3(vec3 p){ float v = 0.0, a = 0.52; for(int i=0;i<4;i++){ float n = 1.0 - abs(2.0 * noise3(p) - 1.0); v += a * n * n; p = p * 2.15 + vec3(-3.7, 6.1, 4.3); a *= 0.5; } return v; }',
    'float funnelZ(float r){ return -0.22 * exp(-max(0.0, r - R_EH) * 1.45); }',
    'void main(){',
    '  vec2 uv = (vUv * uRes - 0.5 * uRes) / uRes.y;',
    '  vec3 d = normalize(uCamFwd * uFovScale + uv.x * uCamRight + uv.y * uCamUp);',
    '  // Intersect ray with 3D smooth funnel surface z = funnelZ(|xy|) unconditionally (no branches before fwidth!)',
    '  float tHit = -uCamPos.z / min(d.z, -0.08);',
    '  for(int it=0; it<5; it++){',
    '    vec3 pS = uCamPos + d * tHit;',
    '    float rz = funnelZ(length(pS.xy));',
    '    tHit += (rz - pS.z) / min(d.z, -0.08);',
    '  }',
    '  vec3 hp3 = uCamPos + d * tHit;',
    '  vec2 hp = hp3.xy;',
    '  float r = length(hp);',
    '  float phi = atan(hp.y, hp.x);',
    '  float rSafe = max(r, R_EH * 1.004);',
    '',
    '  // Unified Einstein-Lensed + Kerr Frame-Dragged Spacetime Grid (analytic fwidth anti-aliased)',
    '  float u = R_EH / rSafe;',
    '  float rLens = rSafe * (1.0 - 0.88 * pow(u, 1.42));',
    '  float swirl = (2.85 + uSub4Surge * 0.42) * pow(u, 1.48) + uTime * (0.16 + uSub4Surge * 0.08) * pow(u, 0.85);',
    '  vec2 gridUv = vec2(cos(phi - swirl), sin(phi - swirl)) * rLens * 4.75;',
    '  vec2 gd = max(fwidth(gridUv), vec2(1e-4));',
    '  vec2 cell = abs(fract(gridUv - 0.5) - 0.5) / gd;',
    '  float hair = (1.0 - smoothstep(0.32, 1.25, min(cell.x, cell.y))) * smoothstep(0.60, 0.14, max(gd.x, gd.y));',
    '',
    '  // Subtle 4-arm spacetime fold highlight hugging grid curvature (sharp glint, zero soft blob!)',
    '  float armCos = max(0.0, cos(4.0 * (phi - swirl * 0.88)));',
    '  float crossCatch = pow(armCos, 16.0) * smoothstep(R_EH * 1.04, R_EH * 1.48, r) * smoothstep(R_EH * 2.8, R_EH * 1.4, r);',
    '',
    '  // Distance of pixel ray to 3D spherical Schwarzschild shadow core centered at (0, 0, -0.22)',
    '  vec3 bhC = vec3(0.0, 0.0, -0.22);',
    '  float b = length(cross(bhC - uCamPos, d));',
    '  float horizonMask = smoothstep(R_EH * 0.996, R_EH * 1.005, b);',
    '',
    '  // Deep obsidian void backdrop (rich dark space so glowing cyan/platinum grid & filaments pop with cinema HDR!)',
    '  float rNorm = b / R_EH;',
    '  vec3 col = mix(vec3(0.001, 0.002, 0.006), vec3(0.004, 0.010, 0.024), exp(-max(0.0, rNorm - 1.0) * 1.4));',
    '',
    '  // Grid illumination extending cleanly across all 4 corners -> electric ice-cyan near gravity throat',
    '  float gridFade = smoothstep(R_EH * 1.008, R_EH * 1.12, b) * smoothstep(13.5, 2.8, r);',
    '  float gridProx = smoothstep(3.2, 0.50, r);',
    '  float ripple = 0.88 + 0.12 * sin(r * 5.0 + uTime * 3.2);',
    '  vec3 cGridOut = vec3(0.32, 0.52, 0.78) * 0.48;',
    '  vec3 cGridIn  = vec3(0.76, 0.95, 1.00) * 1.32;',
    '  vec3 gridCol = mix(cGridOut, cGridIn, gridProx) * ripple;',
    '  col += gridCol * hair * gridFade * (0.48 + 0.76 * gridProx + 0.85 * crossCatch);',
    '  col += vec3(0.32, 0.76, 1.0) * crossCatch * 0.075;',
    '',
    '  // Whirling Relativistic Filament Vortex (razor needle-fine spiral needles & spark arcs, crisp dark gaps!)',
    '  // Uses seamless periodic coordinates (cos(k*a), sin(k*a), log(r)) -> ZERO +/-PI seam!',
    '  float omega = 2.05 / pow(max(rNorm, 1.0), 1.34);',
    '  float rotTime = uTime * (1.60 + uSub4Surge * 0.65);',
    '  float spiralA1 = phi + 9.2 * log(max(rNorm, 1.0)) - omega * rotTime;',
    '  float spiralA2 = phi * 2.0 + 17.5 * log(max(rNorm, 1.0)) - omega * rotTime * 1.40;',
    '  float spiralA3 = phi * 4.0 + 28.0 * log(max(rNorm, 1.0)) - omega * rotTime * 1.85;',
    '',
    '  vec3 pFil1 = vec3(cos(spiralA1) * 3.6, sin(spiralA1) * 3.6, log(max(rNorm, 1.0)) * 8.4);',
    '  vec3 pFil2 = vec3(cos(spiralA2) * 6.0, sin(spiralA2) * 6.0, log(max(rNorm, 1.0)) * 13.5 + 4.2);',
    '  vec3 pFil3 = vec3(cos(spiralA3) * 9.5, sin(spiralA3) * 9.5, log(max(rNorm, 1.0)) * 20.0 + 9.1);',
    '',
    '  float f1 = pow(clamp(ridge3(pFil1), 0.0, 1.0), 5.6);',
    '  float f2 = pow(clamp(ridge3(pFil2), 0.0, 1.0), 6.5);',
    '  float f3 = pow(clamp(ridge3(pFil3), 0.0, 1.0), 7.2);',
    '',
    '  // Tight exponential shells + high-contrast azimuthal gaps so fine needle filaments silhouette sharply against void',
    '  float envInner = exp(-max(0.0, rNorm - 1.012) * 5.6) * smoothstep(0.996, 1.015, rNorm);',
    '  float envMid   = exp(-max(0.0, rNorm - 1.035) * 3.15) * smoothstep(0.998, 1.030, rNorm);',
    '  float envOuter = exp(-max(0.0, rNorm - 1.10) * 2.15) * smoothstep(1.02, 1.14, rNorm);',
    '',
    '  float streakMod = smoothstep(0.25, 0.98, 0.50 + 0.52 * sin(phi * 15.0 - 13.0 * log(max(rNorm, 1.0)) - uTime * 3.6));',
    '  float filEnergy = f1 * 1.85 * envMid + f2 * 2.85 * envInner + f3 * 1.85 * envOuter * streakMod;',
    '  float coreGlow  = exp(-max(0.0, rNorm - 1.006) * 14.0) * 0.34 * smoothstep(0.996, 1.014, rNorm);',
    '',
    '  // CORTEX Ice-Cyan / Deep Cobalt / Platinum HDR Palette (ZERO orange/brown)',
    '  vec3 cCobalt = vec3(0.07, 0.32, 0.94);',
    '  vec3 cCyan   = vec3(0.24, 0.84, 1.00);',
    '  vec3 cGlacier= vec3(0.86, 0.98, 1.00);',
    '  vec3 cOpal   = vec3(0.76, 0.85, 1.00);',
    '',
    '  vec3 vortCol = mix(cCobalt, cCyan, smoothstep(0.05, 0.42, filEnergy + coreGlow * 0.3));',
    '  vortCol = mix(vortCol, mix(cGlacier, cOpal, 0.18), smoothstep(0.36, 1.08, filEnergy + coreGlow * 0.6));',
    '  col += vortCol * (filEnergy * 2.65 + coreGlow);',
    '',
    '  // Pitch-black Schwarzschild event horizon shadow + razor incandescent HDR platinum photon sphere',
    '  col *= horizonMask;',
    '  float azimShimmer = 0.82 + 0.18 * sin(phi * 5.0 - uTime * 4.4 + f1 * 8.0);',
    '  float phRim  = exp(-pow((b - R_EH * 1.005) / 0.0044, 2.0)) * 3.45 * azimShimmer;',
    '  float phHalo = exp(-pow((b - R_EH * 1.012) / 0.011, 2.0)) * 0.28;',
    '  col += (vec3(2.9, 3.15, 3.55) * phRim + vec3(0.38, 0.84, 1.0) * phHalo) * horizonMask;',
    '',
    '  // Pure deep interior void',
    '  col = mix(vec3(0.001, 0.002, 0.006), col, horizonMask);',
    '  fragColor = vec4(max(col, vec3(0.0)), 1.0);',
    '}'
  ].join('\n');

  const BLUR_FS = '#version 300 es\n' + [
    'precision highp float;',
    'in vec2 vUv; out vec4 fragColor;',
    'uniform sampler2D uTex; uniform vec2 uDir; uniform float uThresh;',
    'void main(){',
    '  float w[5] = float[](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);',
    '  vec3 sum = vec3(0.0);',
    '  for(int i=-4; i<=4; i++){',
    '    vec3 s = texture(uTex, clamp(vUv + uDir * float(i), 0.001, 0.999)).rgb;',
    '    if(uThresh > 0.0){',
    '      float lum = dot(s, vec3(0.2126, 0.7152, 0.0722));',
    '      s *= smoothstep(uThresh, uThresh + 0.55, lum);',
    '    }',
    '    sum += s * w[abs(i)];',
    '  }',
    '  fragColor = vec4(sum, 1.0);',
    '}'
  ].join('\n');

  const COMPOSITE_FS = '#version 300 es\n' + [
    'precision highp float;',
    'in vec2 vUv; out vec4 fragColor;',
    'uniform sampler2D uScene; uniform sampler2D uBloom; uniform float uHasBloom;',
    'vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }',
    'void main(){',
    '  vec3 hdr = texture(uScene, vUv).rgb;',
    '  if(uHasBloom > 0.5) hdr += texture(uBloom, vUv).rgb * 0.38;',
    '  float vig = 1.0 - 0.14 * dot(vUv - 0.5, vUv - 0.5);',
    '  vec3 ldr = aces(hdr * 1.15 * vig);',
    '  ldr = pow(ldr, vec3(1.0 / 2.2));',
    '  fragColor = vec4(ldr, 1.0);',
    '}'
  ].join('\n');

  function compileShader(type, src){
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function makeProg(vsSrc, fsSrc){
    const p = gl.createProgram();
    gl.attachShader(p, compileShader(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(p, compileShader(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(p);
    if(!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  const pRay = makeProg(QUAD_VS, GARGANTUA_FS);
  const pBlur = makeProg(QUAD_VS, BLUR_FS);
  const pComp = makeProg(QUAD_VS, COMPOSITE_FS);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const bindQuad = (prog) => {
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  };

  function makeFbo(w, h, useFloat){
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, useFloat ? gl.RGBA16F : gl.RGBA8, w, h, 0, gl.RGBA, useFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { fbo, tex, ok, w, h };
  }

  let hdrMain = extFloat ? makeFbo(1920, 1080, true) : { ok: false };
  let bloomA  = extFloat ? makeFbo(960, 540, true)   : { ok: false };
  let bloomB  = extFloat ? makeFbo(960, 540, true)   : { ok: false };
  const useHDR = hdrMain.ok && bloomA.ok && bloomB.ok;
  if(!useHDR){
    hdrMain = makeFbo(1920, 1080, false);
  }

  const normalize = (v) => { const l = Math.hypot(v[0],v[1],v[2]) || 1; return [v[0]/l, v[1]/l, v[2]/l]; };
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const lerp = (a,b,u) => a + (b-a)*u;
  const easeInOut = (u) => u < 0.5 ? 4*u*u*u : 1 - Math.pow(-2*u+2, 3)/2;

  const indices = __INDICES__;
  for (let step = 0; step < indices.length; step++) {
    const fi = indices[step];
    const t = fi / __FPS__;
    const dur = __TOTAL__ / __FPS__;
    const u = Math.min(1, t / dur);
    const eu = easeInOut(u);

    // High-oblique top-down 3D spacetime camera (72-76 deg elevation, wider initial framing matching reference!)
    const dist = lerp(4.05, 3.18, eu);
    const elev = lerp(1.22, 1.29, eu); // ~70 -> 74 deg above spacetime plane
    const orbYaw = lerp(-0.14, 0.16, eu);
    const camPos = [
      Math.sin(orbYaw) * Math.cos(elev) * dist,
      -Math.cos(orbYaw) * Math.cos(elev) * dist,
      Math.sin(elev) * dist
    ];
    const target = [0.0, 0.0, -0.10];
    const fwd = normalize([target[0]-camPos[0], target[1]-camPos[1], target[2]-camPos[2]]);
    const right0 = normalize(cross(fwd, [0, 1, 0]));
    const up0 = normalize(cross(right0, fwd));
    // Gentle camera roll (~ -8 deg -> +4.5 deg) matching oblique tilted coordinate grid
    const roll = lerp(-0.14, 0.08, eu);
    const cr = Math.cos(roll), sr = Math.sin(roll);
    const camRight = [right0[0]*cr + up0[0]*sr, right0[1]*cr + up0[1]*sr, right0[2]*cr + up0[2]*sr];
    const camUp = [up0[0]*cr - right0[0]*sr, up0[1]*cr - right0[1]*sr, up0[2]*cr - right0[2]*sr];

    // Smooth energy boost in 37.48-38.18s (t inside 4.75s clip: 3.03..3.73s) replacing the old wireframe cut!
    const surgeEnv = Math.exp(-Math.pow((t - 3.38) / 0.42, 2.0));

    // Pass 1: Kerr Spacetime Funnel & Filament Vortex -> hdrMain
    gl.bindFramebuffer(gl.FRAMEBUFFER, hdrMain.fbo);
    gl.viewport(0, 0, 1920, 1080);
    gl.useProgram(pRay);
    bindQuad(pRay);
    gl.uniform1f(gl.getUniformLocation(pRay, 'uTime'), t);
    gl.uniform1f(gl.getUniformLocation(pRay, 'uDur'), dur);
    gl.uniform2f(gl.getUniformLocation(pRay, 'uRes'), 1920, 1080);
    gl.uniform3fv(gl.getUniformLocation(pRay, 'uCamPos'), camPos);
    gl.uniform3fv(gl.getUniformLocation(pRay, 'uCamFwd'), fwd);
    gl.uniform3fv(gl.getUniformLocation(pRay, 'uCamRight'), camRight);
    gl.uniform3fv(gl.getUniformLocation(pRay, 'uCamUp'), camUp);
    gl.uniform1f(gl.getUniformLocation(pRay, 'uFovScale'), lerp(1.48, 1.36, eu));
    gl.uniform1f(gl.getUniformLocation(pRay, 'uSub4Surge'), surgeEnv);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (useHDR) {
      // Pass 2: Horizontal thresholded bloom -> bloomA
      gl.bindFramebuffer(gl.FRAMEBUFFER, bloomA.fbo);
      gl.viewport(0, 0, 960, 540);
      gl.useProgram(pBlur);
      bindQuad(pBlur);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, hdrMain.tex);
      gl.uniform1i(gl.getUniformLocation(pBlur, 'uTex'), 0);
      gl.uniform2f(gl.getUniformLocation(pBlur, 'uDir'), 2.6 / 960.0, 0.0);
      gl.uniform1f(gl.getUniformLocation(pBlur, 'uThresh'), 0.85);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Pass 3: Vertical bloom -> bloomB (2 iterations wide soft aura)
      for(let it=0; it<2; it++){
        gl.bindFramebuffer(gl.FRAMEBUFFER, bloomB.fbo);
        gl.bindTexture(gl.TEXTURE_2D, bloomA.tex);
        gl.uniform2f(gl.getUniformLocation(pBlur, 'uDir'), 0.0, (2.4 + it * 2.2) / 540.0);
        gl.uniform1f(gl.getUniformLocation(pBlur, 'uThresh'), 0.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindFramebuffer(gl.FRAMEBUFFER, bloomA.fbo);
        gl.bindTexture(gl.TEXTURE_2D, bloomB.tex);
        gl.uniform2f(gl.getUniformLocation(pBlur, 'uDir'), (3.8 + it * 3.0) / 960.0, 0.0);
        gl.uniform1f(gl.getUniformLocation(pBlur, 'uThresh'), 0.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }

    // Pass 4: ACES Composite -> default framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, 1920, 1080);
    gl.useProgram(pComp);
    bindQuad(pComp);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, hdrMain.tex);
    gl.uniform1i(gl.getUniformLocation(pComp, 'uScene'), 0);
    if (useHDR) {
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, bloomA.tex);
      gl.uniform1i(gl.getUniformLocation(pComp, 'uBloom'), 1);
    }
    gl.uniform1f(gl.getUniformLocation(pComp, 'uHasBloom'), useHDR ? 1.0 : 0.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.95));
    await fetch('/frame/' + fi, { method: 'POST', body: blob });
    if (step % 30 === 0 || step === indices.length - 1) {
      await fetch('/log?m=' + encodeURIComponent('rendered ' + (step + 1) + '/' + indices.length + ' (f' + fi + ') hdr=' + useHDR));
    }
  }
  await fetch('/done', { method: 'POST' });
})().catch(async (e) => {
  await fetch('/err?m=' + encodeURIComponent(e.stack || e.message));
});
</script>
</body>
</html>`.replace(/__TOTAL__/g, String(TOTAL_FRAMES)).replace(/__FPS__/g, String(FPS)).replace(/__INDICES__/g, JSON.stringify(RENDER_INDICES));

let saved = 0;
let doneResolve, doneReject;
const donePromise = new Promise((res, rej) => { doneResolve = res; doneReject = rej; });

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://127.0.0.1');
  if (req.method === 'GET' && u.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
  } else if (req.method === 'POST' && u.pathname.startsWith('/frame/')) {
    const idx = Number(u.pathname.slice('/frame/'.length));
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const outPath = path.join(OUT_DIR, `f${String(idx).padStart(4, '0')}.jpg`);
      fs.writeFileSync(outPath, Buffer.concat(chunks));
      saved++;
      res.writeHead(200); res.end('ok');
    });
  } else if (u.pathname === '/log') {
    console.log('[Gargantua GLSL]', u.searchParams.get('m'));
    res.writeHead(200); res.end('ok');
  } else if (u.pathname === '/err') {
    const msg = u.searchParams.get('m');
    console.error('[Gargantua ERR]', msg);
    res.writeHead(200); res.end('ok');
    doneReject(new Error(msg));
  } else if (req.method === 'POST' && u.pathname === '/done') {
    res.writeHead(200); res.end('ok');
    doneResolve();
  } else {
    res.writeHead(404); res.end();
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const profDir = path.join('F:\\tmp', `edge_gargantua_${process.pid}`);
fs.mkdirSync(profDir, { recursive: true });

console.log(`=== Rendering B3D_06_singularity (Gargantua GLSL, ${TOTAL_FRAMES}f @ ${W}x${H}) on port ${port} ===`);
const proc = spawn(EDGE, [
  '--headless=new',
  `--user-data-dir=${profDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--use-gl=angle',
  '--use-angle=d3d11',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  `--window-size=${W},${H}`,
  `http://127.0.0.1:${port}/`
], { stdio: 'ignore' });

try {
  await donePromise;
  console.log(`=== SUCCESS! Rendered ${saved}/${TOTAL_FRAMES} Gargantua frames to ${OUT_DIR} ===`);
} finally {
  try { proc.kill(); } catch {}
  try { fs.rmSync(profDir, { recursive: true, force: true }); } catch {}
  server.close();
}
