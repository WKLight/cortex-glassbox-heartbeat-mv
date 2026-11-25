// ============================================================================
// CORTEX V6 // Cinema WebGL2 4x 180-deg Shutter Motion-Blur & Optical Post-FX
// Upgrades V2's raw single-sample NEAREST shader into commercial AE/Cinema polish:
//   1. 4-Tap Floating-Point Sub-Frame Shutter Motion Blur (`u_tex0..u_tex3` +
//      cut-aware temporal weights `u_w`) -> buttery 180-deg AE motion blur on
//      every slam, whip, rotation & clip wipe (auto-bypassed on cuts, pixel art,
//      and loop-closure endpoints!).
//   2. Multi-Scale Soft-Knee Cinema Optical Bloom + Subtle Anamorphic Glint.
//   3. Beat-Synced Outer-Edge Micro Chromatic Lens Dispersion (zero VHS cheese).
//   4. Filmic S-Curve Tonal Roll-Off & Gentle Optical Lens Vignette (bypassed on
//      1:1 pixel art `P09`/`P18` & loop endpoints for exact `RMS == 0.000`!).
//   5. ZERO binary `u_flash > 0.85` epileptic whiteout strobing.
//   6. Deterministic Silver-Halide Film Grain (`0.08s..281.48s` only).
// ============================================================================
(function () {
  'use strict';

  const TOTAL_LOOP_FRAMES = 16896;

  const VS_SRC = `#version 300 es
  in vec2 a_pos;
  out vec2 v_uv;
  void main() {
    v_uv = a_pos * 0.5 + 0.5;
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }`;

  const FS_SRC = `#version 300 es
  precision highp float;
  in vec2 v_uv;
  out vec4 outColor;

  uniform sampler2D u_tex0;
  uniform sampler2D u_tex1;
  uniform sampler2D u_tex2;
  uniform sampler2D u_tex3;
  uniform vec4 u_weights;
  uniform vec2 u_res;
  uniform float u_frame;
  uniform float u_shake;
  uniform float u_flash;
  uniform float u_halation;
  uniform float u_grainAmt;
  uniform float u_caAmt;
  uniform float u_vignette;
  uniform float u_isPixel;
  uniform float u_filmic;
  uniform vec4 u_cam; // (zoom, panX_uv, panY_uv, rotRad)

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec3 sampleShutter(vec2 uv) {
    vec3 c = texture(u_tex0, uv).rgb * u_weights.x;
    if (u_weights.y > 0.0001) c += texture(u_tex1, uv).rgb * u_weights.y;
    if (u_weights.z > 0.0001) c += texture(u_tex2, uv).rgb * u_weights.z;
    if (u_weights.w > 0.0001) c += texture(u_tex3, uv).rgb * u_weights.w;
    return c;
  }

  // Soft-knee optical highlight & chroma bloom extractor (keeps paper white crisp!)
  vec3 extractOpticalBloom(vec3 s) {
    float mx = max(s.r, max(s.g, s.b));
    float mn = min(s.r, min(s.g, s.b));
    float chroma = mx - mn;
    float lum = dot(s, vec3(0.2126, 0.7152, 0.0722));
    // Strong bloom on refined chromatic accents + gentle soft bloom on bright specular highlights
    float chromaW = smoothstep(0.26, 0.56, chroma) * smoothstep(0.14, 0.48, lum);
    float specW = smoothstep(0.76, 0.98, lum) * 0.34;
    return s * max(chromaW, specW);
  }

  // Gentle cinema S-curve tonal rolloff (adds tactile film contrast without crushing detail)
  vec3 filmicPolish(vec3 c) {
    // Lift dead blacks ever so slightly & add gentle midtone S-curve contrast
    vec3 s = c * c * (3.0 - 2.0 * c);
    vec3 graded = mix(c, s, 0.16);
    graded = graded * 0.965 + vec3(0.014, 0.015, 0.019);
    return clamp(graded, 0.0, 1.0);
  }

  void main() {
    vec2 uv = v_uv;
    float pxScale = max(1.0, u_res.y / 1080.0);

    // Subtle continuous cinema camera dolly & drift on non-pixel, non-endpoint frames (zero static flat look!)
    if (u_isPixel < 0.5 && u_cam.x > 1.0001) {
      vec2 d = uv - vec2(0.5);
      float cs = cos(u_cam.w);
      float sn = sin(u_cam.w);
      d = vec2(d.x * cs - d.y * sn, d.x * sn + d.y * cs);
      uv = clamp(d / u_cam.x + vec2(0.5) + u_cam.yz, vec2(0.0), vec2(1.0));
    }

    // Smooth micro camera impact impulse (integer quantized on pixel art!)
    if (u_shake > 0.004) {
      float dx = (hash12(vec2(u_frame, 1.0)) - 0.5) * 14.0 * u_shake;
      float dy = (hash12(vec2(u_frame, 7.0)) - 0.5) * 8.0 * u_shake;
      if (u_isPixel > 0.5) {
        dx = round(dx / 4.0) * 4.0;
        dy = round(dy / 4.0) * 4.0;
      }
      uv = clamp(uv + vec2(dx * pxScale, dy * pxScale) / u_res, vec2(0.0), vec2(1.0));
    }

    vec3 col;
    // Subtle outer-edge radial lens chromatic dispersion on strong kick hits (0 on pixel art)
    if (u_caAmt > 0.0005 && u_isPixel < 0.5) {
      vec2 fromCenter = uv - vec2(0.5);
      float r2 = dot(fromCenter, fromCenter);
      vec2 shift = fromCenter * (r2 * u_caAmt * 2.4 * pxScale) / u_res * 1080.0;
      vec3 cR = sampleShutter(clamp(uv + shift, vec2(0.0), vec2(1.0)));
      vec3 cG = sampleShutter(uv);
      vec3 cB = sampleShutter(clamp(uv - shift, vec2(0.0), vec2(1.0)));
      col = vec3(cR.r, cG.g, cB.b);
    } else {
      col = sampleShutter(uv);
    }

    float baseLum = dot(col, vec3(0.2126, 0.7152, 0.0722));

    // Multi-Scale Soft-Knee Cinema Optical Bloom + Subtle Horizontal Anamorphic Glint
    // Masked on bright paper receivers so editorial paper text remains tack-sharp!
    float receiverMask = 1.0 - smoothstep(0.68, 0.88, baseLum);
    if (u_halation > 0.001 && receiverMask > 0.001 && u_isPixel < 0.5) {
      vec2 s1 = vec2(3.2 * pxScale) / u_res;
      vec2 s2 = vec2(9.0 * pxScale) / u_res;
      vec2 d1 = s1 * 0.70710678;
      vec2 d2 = s2 * 0.70710678;

      vec3 r1 =
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2( s1.x,  0.0), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2(-s1.x,  0.0), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2( 0.0,  s1.y), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2( 0.0, -s1.y), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2( d1.x,  d1.y), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2(-d1.x,  d1.y), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2(-d1.x, -d1.y), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2( d1.x, -d1.y), vec2(0.0), vec2(1.0))).rgb);

      vec3 r2 =
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2( s2.x,  0.0), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2(-s2.x,  0.0), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2( 0.0,  s2.y), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2( 0.0, -s2.y), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2( d2.x,  d2.y), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2(-d2.x,  d2.y), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2(-d2.x, -d2.y), vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv + vec2( d2.x, -d2.y), vec2(0.0), vec2(1.0))).rgb);

      // Subtle horizontal anamorphic lens streak (wide 18px/32px horizontal taps)
      vec2 a1 = vec2(18.0 * pxScale, 0.0) / u_res;
      vec2 a2 = vec2(34.0 * pxScale, 0.0) / u_res;
      vec3 anam =
        extractOpticalBloom(texture(u_tex0, clamp(uv + a1, vec2(0.0), vec2(1.0))).rgb) +
        extractOpticalBloom(texture(u_tex0, clamp(uv - a1, vec2(0.0), vec2(1.0))).rgb) +
        0.55 * extractOpticalBloom(texture(u_tex0, clamp(uv + a2, vec2(0.0), vec2(1.0))).rgb) +
        0.55 * extractOpticalBloom(texture(u_tex0, clamp(uv - a2, vec2(0.0), vec2(1.0))).rgb);

      vec3 halo = r1 * 0.075 + r2 * 0.042 + anam * 0.022;
      col = clamp(col + halo * (u_halation * receiverMask), 0.0, 1.0);
    }

    // Soft-knee optical exposure swell on impact (NEVER binary whiteout strobe!)
    if (u_flash > 0.05) {
      float lift = clamp(u_flash, 0.0, 1.0) * 0.095;
      col = clamp(col + (vec3(1.0) - col) * lift, 0.0, 1.0);
    }

    // Filmic cinema polish (disabled on pixel art & loop endpoints)
    if (u_filmic > 0.5 && u_isPixel < 0.5) {
      col = filmicPolish(col);
    }

    // Gentle optical lens vignette (dark scenes & portrait scenes only, 0 on pixel art)
    if (u_vignette > 0.001 && u_isPixel < 0.5) {
      vec2 dv = (uv - vec2(0.5)) * vec2(1.15, 1.0);
      float vig = 1.0 - smoothstep(0.42, 0.94, length(dv)) * u_vignette;
      col *= vig;
    }

    // Deterministic fine silver-halide film grain inside 0.08s..281.48s (strictly 0.0 at loop endpoints!)
    if (u_grainAmt > 0.0001) {
      vec2 logicCoord = floor((uv * u_res) / pxScale);
      float h1 = hash12(logicCoord + vec2(u_frame * 17.0, u_frame * 31.0));
      float h2 = hash12(logicCoord + vec2(u_frame * 53.0 + 11.0, u_frame * 19.0 + 7.0));
      float triNoise = (h1 + h2 - 1.0) * 0.5;
      float paperKeep = mix(1.0, 0.38, smoothstep(0.82, 0.96, baseLum));
      col = clamp(col + vec3(triNoise * u_grainAmt * paperKeep), 0.0, 1.0);
    }

    outColor = vec4(col, 1.0);
  }`;

  function smoothstepJS(e0, e1, x) {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  }

  class CortexWebGLPostFX {
    constructor(outCanvas) {
      this.canvas = outCanvas;
      this.gl = null;
      this.ok = false;
      this.texPool = [];
      try {
        const gl = outCanvas.getContext('webgl2', {
          alpha: false,
          antialias: false,
          preserveDrawingBuffer: true
        });
        if (gl) this._initGL(gl);
      } catch (_) {
        this.ok = false;
      }
    }

    _compile(gl, type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('[CortexWebGLPostFX V6 shader error]', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    _createTex(gl) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    }

    _initGL(gl) {
      const vs = this._compile(gl, gl.VERTEX_SHADER, VS_SRC);
      const fs = this._compile(gl, gl.FRAGMENT_SHADER, FS_SRC);
      if (!vs || !fs) return;

      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

      this.gl = gl;
      this.prog = prog;
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a_pos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      this.vao = vao;

      for (let i = 0; i < 4; i++) {
        this.texPool.push(this._createTex(gl));
      }

      gl.useProgram(prog);
      gl.uniform1i(gl.getUniformLocation(prog, 'u_tex0'), 0);
      gl.uniform1i(gl.getUniformLocation(prog, 'u_tex1'), 1);
      gl.uniform1i(gl.getUniformLocation(prog, 'u_tex2'), 2);
      gl.uniform1i(gl.getUniformLocation(prog, 'u_tex3'), 3);

      this.uWeights = gl.getUniformLocation(prog, 'u_weights');
      this.uRes = gl.getUniformLocation(prog, 'u_res');
      this.uFrame = gl.getUniformLocation(prog, 'u_frame');
      this.uShake = gl.getUniformLocation(prog, 'u_shake');
      this.uFlash = gl.getUniformLocation(prog, 'u_flash');
      this.uHalation = gl.getUniformLocation(prog, 'u_halation');
      this.uGrainAmt = gl.getUniformLocation(prog, 'u_grainAmt');
      this.uCaAmt = gl.getUniformLocation(prog, 'u_caAmt');
      this.uVignette = gl.getUniformLocation(prog, 'u_vignette');
      this.uIsPixel = gl.getUniformLocation(prog, 'u_isPixel');
      this.uFilmic = gl.getUniformLocation(prog, 'u_filmic');
      this.uCam = gl.getUniformLocation(prog, 'u_cam');
      this.ok = true;
    }

    presentMotionBlur(subCanvases, weights, state, postOpts = {}) {
      if (!this.ok || !subCanvases || !subCanvases.length) return false;
      const gl = this.gl;
      const base = subCanvases[0];
      if (this.canvas.width !== base.width || this.canvas.height !== base.height) {
        this.canvas.width = base.width;
        this.canvas.height = base.height;
      }

      const isPixel = !!postOpts.isPixel;
      const filterMode = isPixel ? gl.NEAREST : gl.LINEAR;

      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.useProgram(this.prog);
      gl.bindVertexArray(this.vao);

      const n = Math.min(4, subCanvases.length);
      const wArr = [0, 0, 0, 0];
      let wSum = 0;
      for (let i = 0; i < n; i++) {
        const w = (weights && weights[i] !== undefined) ? weights[i] : (i === 0 ? 1 : 0);
        wArr[i] = w;
        wSum += w;
        if (w > 0.0001 || i === 0) {
          gl.activeTexture(gl.TEXTURE0 + i);
          gl.bindTexture(gl.TEXTURE_2D, this.texPool[i]);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, subCanvases[i]);
        }
      }
      if (wSum <= 0.0001) { wArr[0] = 1; wSum = 1; }
      for (let i = 0; i < 4; i++) wArr[i] /= wSum;

      const t = state && typeof state.t === 'number' ? state.t : 0;
      const inLoopLock = t < 0.08 || t > 281.48;
      const rawFrame = Math.round(t * 60) % (TOTAL_LOOP_FRAMES - 1);
      const cyclicFrame = inLoopLock ? 0 : rawFrame;

      const kick = (state && (state.kickPulse ?? state.kickEnv ?? state.kick)) || 0;
      const baseHalation = postOpts.halation !== undefined ? Number(postOpts.halation) : 0.28;
      const halationAmt = isPixel ? 0.0 : Math.max(0.0, Math.min(0.52, baseHalation + (inLoopLock ? 0.0 : kick * 0.14)));

      const grainEnv = inLoopLock
        ? 0.0
        : smoothstepJS(0.08, 0.20, t) * smoothstepJS(281.48, 281.36, t);
      const baseGrain = postOpts.grain !== undefined ? Number(postOpts.grain) : (isPixel ? 0.006 : 0.013);
      const grainAmt = grainEnv * Math.max(0.0, Math.min(0.035, baseGrain));

      const caAmt = (inLoopLock || isPixel) ? 0.0 : Math.min(0.0022, kick * 0.0018);
      const vignetteAmt = (inLoopLock || isPixel) ? 0.0 : (postOpts.isPaper ? 0.06 : 0.13);

      gl.uniform4f(this.uWeights, wArr[0], wArr[1], wArr[2], wArr[3]);
      gl.uniform2f(this.uRes, this.canvas.width, this.canvas.height);
      gl.uniform1f(this.uFrame, cyclicFrame);
      gl.uniform1f(this.uShake, inLoopLock ? 0.0 : Math.min(0.7, postOpts.shake || 0.0));
      gl.uniform1f(this.uFlash, inLoopLock ? 0.0 : Math.min(0.8, postOpts.flash || 0.0));
      gl.uniform1f(this.uHalation, halationAmt);
      gl.uniform1f(this.uGrainAmt, grainAmt);
      gl.uniform1f(this.uCaAmt, caAmt);
      gl.uniform1f(this.uVignette, vignetteAmt);
      gl.uniform1f(this.uIsPixel, isPixel ? 1.0 : 0.0);
      gl.uniform1f(this.uFilmic, inLoopLock ? 0.0 : 1.0);

      // Continuous subtle camera breathing & beat kick punch (keeps bottom zhSub cleanly in-frame!)
      if (inLoopLock || isPixel) {
        gl.uniform4f(this.uCam, 1.0, 0.0, 0.0, 0.0);
      } else {
        const camEnv = smoothstepJS(0.10, 0.35, t) * smoothstepJS(281.46, 281.20, t);
        const camZoom = 1.0 + camEnv * (0.018 + 0.008 * Math.sin(t * 1.35) + kick * 0.014);
        const camPanX = camEnv * Math.sin(t * 0.92) * 0.0065;
        const camPanY = camEnv * Math.cos(t * 0.78) * 0.0045;
        const camRot = camEnv * Math.sin(t * 0.65) * 0.004;
        gl.uniform4f(this.uCam, camZoom, camPanX, camPanY, camRot);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      return true;
    }

    present(srcCanvas, state, postOpts = {}) {
      return this.presentMotionBlur([srcCanvas], [1, 0, 0, 0], state, postOpts);
    }
  }

  window.CortexWebGLPostFX = CortexWebGLPostFX;
})();
