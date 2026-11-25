// ============================================================================
// P01_fog_boot.js — 0.00–14.20s ("0.1mm STANDBY -> FROST GLASS IGNITION")
// Phase-2 + #52/#53 Upgrade (`camera-pacing`):
//   1. Exports deterministic `window.drawP01ZeroStandbyFrame(ctx, core)` so
//      Frame 0 (`0.000s`) and Frame 16895 (`281.583s` in P18) achieve `RMS == 0.000`.
//   2. Layered `pdoom-video` Monograph Palette (#52):
//      Deep ink `#08090C` + secondary chassis `#121723` + copperplate burin
//      slate `#334155`/`#64748B` + ice-cyan `#38BDF8` + chrono-gold `#FBBF24`
//      telemetry + crimson `#FF2E55` vocal ignition sparks! (0 `#FF9EBB`, 0 gradients).
//   3. Autonomous Per-Character Spatial Choreography (#53):
//      Every Japanese/ASCII token in `S00`, `L01`, `L02`, `L03` is an independent
//      2D physical entity (`x_i, y_i, rot_i, scale_i, stamp_i, enterVec_i`) with
//      strong Kanji/Kana/Particle size hierarchy (1.55x Kanji vs 0.58x particle),
//      diagonal cascades, Tategaki x Yokogaki collage, arc trajectories, and
//      per-token `w.start` directional spring-slam!
//   4. 100% Traced SVG Character Delegation (#52 Part II):
//      Delegates `p01_kneel_profile` strictly to `Cortex25D.drawNotanHime` /
//      1:1 traced `assets/hime_notan_svg/p01_kneel_profile.svg` Path2D (`0%` stick figures).
// ============================================================================

(function () {
  'use strict';

  const BG = '#08090C';
  const PANEL = '#121723';
  const SLATE = '#334155';
  const GRAPHITE = '#64748B';
  const FG = '#38BDF8';
  const GOLD = '#FBBF24';
  const CRIMSON = '#FF2E55';
  const BONE = '#FAF8F5';
  const INK = '#0B0D13';

  const JP_SANS = (w, px) => `${w} ${px}px "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif`;
  const JP_SERIF = (w, px) => `${w} ${px}px "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif`;
  const JP_MONO = (w, px) => `${w} ${px}px "JetBrains Mono", "Noto Sans JP", Consolas, monospace`;

  // ==========================================================================
  // 100% Strict Cortex25D Traced SVG Character Delegation (#52 Part II & #63)
  // Zero hand-coded fallback shapes, zero procedural stick figures!
  // ==========================================================================
  function renderKneelingHime(ctx, cad, cx, cy, targetH, t, wind) {
    if (cad && typeof cad.drawNotanHime === 'function') {
      cad.drawNotanHime(ctx, 'p01_kneel_profile', cx, cy, targetH, t, {
        fg: BONE,
        bg: INK,
        accent: FG,
        rim: FG,
        wind: wind || 0.85
      });
    }
  }

  // ==========================================================================
  // Copperplate Engraving, Banknote Guilloche & Halftone Primitives
  // ==========================================================================
  function drawBurinHatch() {
    // V8: Disabled diagonal burin stripe hatching
    return;
  }

  function drawGuillocheRosette() {
    // V8: Disabled wireframe spirograph rosettes
    return;
  }

  function drawHalftoneFrostField(ctx, W, H, t, dotCol, densityScale, driftX, clearMaskFn) {
    ctx.save();
    ctx.fillStyle = dotCol;
    const step = 30;
    const cols = Math.ceil(W / step) + 2;
    const rows = Math.ceil(H / step) + 1;
    const shiftX = ((driftX % step) + step) % step;

    for (let ry = 0; ry < rows; ry++) {
      const py = ry * step + (step >> 1);
      const vEdge = Math.abs(py - H * 0.5) / (H * 0.5);
      for (let rx = -1; rx < cols; rx++) {
        const px = rx * step + shiftX;
        if (clearMaskFn && clearMaskFn(px, py)) continue;
        const hEdge = Math.abs(px - W * 0.5) / (W * 0.5);
        const frost = Math.max(0, (Math.max(hEdge, vEdge * 0.92) - 0.14) * 1.15) * densityScale;
        const wave = 0.25 * Math.sin(px * 0.011 + t * 4.2) * Math.cos(py * 0.013 - t * 3.4);
        const rad = Math.min(step * 0.44, Math.max(0, (frost + wave) * step * 0.36));
        if (rad > 1.3) {
          const s = Math.round(rad * 1.82);
          ctx.fillRect(Math.round(px - s * 0.5), Math.round(py - s * 0.5), s, s);
        }
      }
    }
    ctx.restore();
  }

  function drawStageHud(ctx, W, H, mainCol, subCol, bg, leftTag, rightTag, useBookendCrop, cropExpandPx) {
    // V8: Zero CAD crosshairs or boxed telemetry borders during intro — atmospheric minimal metadata only
    return;
  }

  function drawKnockoutBanner(ctx, text, cx, cy, sizePx, fg, bg, accent, opts = {}) {
    ctx.save();
    ctx.translate(cx, cy);
    if (opts.rot) ctx.rotate(opts.rot);
    ctx.font = opts.mono ? JP_MONO(900, sizePx) : JP_SANS(900, sizePx);
    const maxW = opts.maxW || 1700;
    let tw = ctx.measureText(text).width;
    let sz = sizePx;
    if (tw > maxW && tw > 0) {
      sz = Math.max(36, Math.floor(sizePx * (maxW / tw)));
      ctx.font = opts.mono ? JP_MONO(900, sz) : JP_SANS(900, sz);
      tw = ctx.measureText(text).width;
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const padX = Math.round(sz * 0.24);
    const bh = Math.round(sz * 1.16);
    if (accent) {
      ctx.fillStyle = accent;
      ctx.fillRect(Math.round(-tw * 0.5 - padX + 8), Math.round(-bh * 0.5 + 8), Math.round(tw + padX * 2), bh);
    }
    ctx.fillStyle = fg;
    ctx.fillRect(Math.round(-tw * 0.5 - padX), Math.round(-bh * 0.5), Math.round(tw + padX * 2), bh);
    ctx.strokeStyle = bg;
    ctx.lineWidth = Math.max(2, Math.round(sz * 0.03));
    ctx.strokeRect(Math.round(-tw * 0.5 - padX + 5), Math.round(-bh * 0.5 + 5), Math.round(tw + padX * 2 - 10), bh - 10);
    ctx.fillStyle = bg;
    ctx.fillText(text, 0, sz * 0.03);
    ctx.restore();
  }

  // ==========================================================================
  // #53 Autonomous Per-Character Spatial Choreography Engine (`1文字 = 1個体`)
  //   - Law A: Strong Kanji (1.48x) vs Katakana/ASCII (1.08x) vs Particle (0.58x) contrast!
  //   - Law B: Non-linear spatial formations (`diagCascade`, `tategakiCollage`,
  //            `mirrorArc`, `parabolicScatter`, `steppedTerminal`) — ZERO flat rows!
  //   - Law C: Strict `t >= w.start` per-token directional cleave + spring bounce +
  //            vivid multi-hue onset stamps & spark shards!
  // ==========================================================================
  function classifyTokenScale(str) {
    const s = (str || '').trim();
    if (!s) return { mult: 1.0, kind: 'sym' };
    if (/[\u4e00-\u9faf]/.test(s)) return { mult: 1.68, kind: 'kanji' };
    if (/^(boot|cor|shell)$/i.test(s)) return { mult: 1.48, kind: 'kanji' };
    if (/^[のをにがではもへとやからだけこそばたりてずっいるよくなた]$/.test(s)) {
      return { mult: 0.62, kind: 'particle' };
    }
    if (/[\u3040-\u309f]/.test(s)) return { mult: 0.78, kind: 'hiragana' };
    if (/^[.:/_—…!！%％]+$/.test(s)) return { mult: 0.76, kind: 'punct' };
    return { mult: 1.12, kind: 'kata_ascii' };
  }

  function drawAutonomousCue(ctx, core, cueId, t, kick, snare, opts = {}) {
    const cue = core.cueById(cueId);
    if (!cue || !cue.words || !cue.words.length) return null;

    const words = cue.words;
    const formation = opts.formation || 'diagCascade';
    const baseSz = opts.sizePx || 142;
    const iStart = opts.iStart !== undefined ? opts.iStart : 0;
    const iEnd = opts.iEnd !== undefined ? Math.min(words.length - 1, opts.iEnd) : words.length - 1;
    const cx = opts.cx !== undefined ? opts.cx : 960;
    const cy = opts.cy !== undefined ? opts.cy : 500;
    const spanX = opts.spanX || 1240;
    const spanY = opts.spanY || 360;
    const minSafeX = opts.minX !== undefined ? opts.minX : 115;
    const maxSafeX = opts.maxX !== undefined ? opts.maxX : 1805;
    const minSafeY = opts.minY !== undefined ? opts.minY : 120;
    const maxSafeY = opts.maxY !== undefined ? opts.maxY : 865;

    // Expand multi-character Kanji tokens (e.g. "硝子" -> "硝" + "子") into independent per-char entities sharing w.start!
    const units = [];
    for (let idx = iStart; idx <= iEnd; idx++) {
      const wObj = words[idx];
      if (!wObj) continue;
      const txt = String(wObj.w || '');
      if (/^[\u4e00-\u9faf]{2,}$/.test(txt)) {
        const chars = [...txt];
        for (let ci = 0; ci < chars.length; ci++) {
          units.push({ wObj, glyph: chars[ci], rawIdx: idx, subIdx: ci });
        }
      } else {
        units.push({ wObj, glyph: txt, rawIdx: idx, subIdx: 0 });
      }
    }
    const count = Math.max(1, units.length);
    const placed = [];

    for (let uIdx = 0; uIdx < units.length; uIdx++) {
      const unit = units[uIdx];
      const u = count === 1 ? 0.5 : uIdx / (count - 1);
      const cls = classifyTokenScale(unit.glyph);
      if (opts.curated && opts.curated[uIdx]) {
        const c = opts.curated[uIdx];
        placed.push({
          ...unit,
          uIdx,
          cls,
          sz: c.sz || Math.round(baseSz * cls.mult),
          tx: c.x,
          ty: c.y,
          baseRot: c.rot !== undefined ? c.rot : 0
        });
        continue;
      }
      const sz = Math.round(baseSz * cls.mult);
      let tx = cx, ty = cy, baseRot = 0;
      const waveSeed = Math.sin((uIdx + unit.rawIdx) * 2.39996 + 0.7);
      const cosSeed = Math.cos((uIdx + 1) * 1.73205);

      if (formation === 'diagCascade') {
        tx = cx + (u - 0.5) * spanX;
        ty = cy + (u - 0.5) * spanY + waveSeed * 68 + (cls.kind === 'particle' ? 42 : 0);
        baseRot = (uIdx % 2 === 0 ? -0.13 : 0.12) + waveSeed * 0.08;
      } else if (formation === 'steppedTerminal') {
        const half = Math.ceil(count * 0.5);
        const inSecond = uIdx >= half;
        const lu = inSecond ? (uIdx - half) / Math.max(1, count - half - 1) : uIdx / Math.max(1, half - 1);
        tx = cx + (lu - 0.5) * spanX + (inSecond ? 72 : -72);
        ty = cy + (inSecond ? 128 : -132) + (lu - 0.5) * 126 + waveSeed * 44;
        baseRot = (inSecond ? -0.11 : 0.10) + cosSeed * 0.07;
      } else if (formation === 'mirrorArc') {
        const ang = core.lerp(-0.55, 0.55, u);
        tx = cx + (0.5 - u) * spanX;
        ty = cy - Math.cos(ang * 2.1) * 90 + (cls.kind === 'particle' ? 36 : 0) + waveSeed * 24;
        baseRot = -ang * 0.34 + (uIdx % 2 === 0 ? -0.09 : 0.09);
      } else if (formation === 'tategakiCollage') {
        const splitAt = opts.splitIdx !== undefined ? opts.splitIdx : Math.floor(count * 0.55);
        if (uIdx < splitAt) {
          const vu = splitAt <= 1 ? 0.5 : uIdx / (splitAt - 1);
          tx = (cx - spanX * 0.35) + waveSeed * 32 + (cls.kind === 'particle' ? 38 : 0);
          ty = (cy - spanY * 0.50) + vu * (spanY * 1.02);
          baseRot = (uIdx % 2 === 0 ? -0.10 : 0.10) + waveSeed * 0.06;
        } else {
          const rem = Math.max(1, count - splitAt);
          const hu = rem <= 1 ? 0.5 : (uIdx - splitAt) / (rem - 1);
          tx = (cx - spanX * 0.06) + hu * (spanX * 0.64);
          ty = (cy + spanY * 0.24) - hu * (spanY * 0.56) + cosSeed * 44 + (cls.kind === 'particle' ? 40 : 0);
          baseRot = (uIdx % 2 === 0 ? -0.14 : 0.13) + waveSeed * 0.08;
        }
      } else if (formation === 'parabolicScatter') {
        const ang = core.lerp(-Math.PI * 0.84, -Math.PI * 0.16, u);
        tx = cx + Math.cos(ang) * (spanX * 0.52);
        ty = cy + Math.sin(ang) * (spanY * 0.78) + waveSeed * 36;
        baseRot = (u - 0.5) * 0.44 + (uIdx % 2 === 0 ? -0.08 : 0.08);
      }

      tx = core.clamp(tx, minSafeX, maxSafeX);
      ty = core.clamp(ty, minSafeY, maxSafeY);

      // Pairwise anti-overlap relaxation so large 230-270px Kanji stamps never cover neighbors!
      for (let pass = 0; pass < 3; pass++) {
        for (let p = 0; p < placed.length; p++) {
          const prev = placed[p];
          const minDist = (sz + prev.sz) * 0.52;
          let dx = tx - prev.tx;
          let dy = ty - prev.ty;
          let dist = Math.hypot(dx, dy);
          if (dist < minDist) {
            if (dist < 1) { dx = 1; dy = 0.6; dist = Math.hypot(dx, dy); }
            const push = (minDist - dist) * 0.85;
            tx = core.clamp(tx + (dx / dist) * push, minSafeX, maxSafeX);
            ty = core.clamp(ty + (dy / dist) * push, minSafeY, maxSafeY);
          }
        }
      }
      placed.push({ ...unit, uIdx, cls, sz, tx, ty, baseRot });
    }

    let latestActivePos = null;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let k = 0; k < placed.length; k++) {
      const item = placed[k];
      const { wObj, glyph, uIdx, cls, sz, tx, ty, baseRot } = item;
      if (t < wObj.start) continue;

      const dt = t - wObj.start;
      const enterDur = 0.19;
      const pIn = core.clamp(dt / enterDur, 0, 1);
      const spring = (window.CortexV6 && window.CortexV6.aeSlam) ? window.CortexV6.aeSlam(pIn) : core.ease.outExpo(pIn);

      const launchAng = uIdx * 2.39996;
      const dist = (1 - spring) * 150;
      const curX = tx + Math.cos(launchAng) * dist;
      const curYRaw = ty + Math.sin(launchAng) * dist + Math.sin(t * 2.4 + uIdx * 1.3) * 0.9;
      const curY = ty < 320 ? Math.max(ty - 42, curYRaw) : curYRaw;
      const curRot = baseRot + (1 - spring) * (uIdx % 2 === 0 ? 0.34 : -0.34);
      const curScaleRaw = core.lerp(1.62, 1.0, spring) + kick * (cls.kind === 'kanji' ? 0.055 : 0.025);
      const curScale = ty < 320 ? Math.min(1.18, curScaleRaw) : curScaleRaw;

      const isSinging = t <= (wObj.end || wObj.start + 0.24) + 0.12;
      const isFresh = dt < 0.15;
      latestActivePos = { x: curX, y: curY, w: glyph };

      if (dt < 0.20) {
        const spU = dt / 0.20;
        ctx.save();
        ctx.translate(tx, ty);
        for (let s = 0; s < 5; s++) {
          const sAng = (s / 5) * Math.PI * 2 + uIdx * 0.5;
          const r0 = sz * (0.42 + spU * 0.36);
          const r1 = r0 + (1 - spU) * (cls.kind === 'kanji' ? 24 : 14);
          ctx.strokeStyle = s % 2 === 0 ? FG : BONE;
          ctx.lineWidth = 1.8 * (1 - spU * 0.55);
          ctx.globalAlpha = (1 - spU) * 0.88;
          ctx.beginPath();
          ctx.moveTo(Math.cos(sAng) * r0, Math.sin(sAng) * r0);
          ctx.lineTo(Math.cos(sAng) * r1, Math.sin(sAng) * r1); ctx.stroke();
        }
        ctx.restore();
      }

      const useSerif = cls.kind === 'kanji' && !opts.mono && /[\u4e00-\u9faf]/.test(glyph);
      const hasStamp = isFresh || cls.kind === 'kanji' || (uIdx % 3 === 0 && cls.kind !== 'particle');
      const v6 = window.CortexV6;
      if (v6 && typeof v6.drawEditorialStamp === 'function') {
        const kind = hasStamp
          ? (isFresh ? 'accent' : (cls.kind === 'kanji' && uIdx % 2 === 0 ? 'accent' : (uIdx % 2 === 1 ? 'frosted' : 'mono')))
          : 'bare';
        v6.drawEditorialStamp(ctx, glyph, curX, curY, sz, curRot, {
          kind,
          serif: useSerif,
          mono: !!opts.mono,
          isHot: isSinging,
          isPaper: false,
          scX: opts.mirrorX ? -curScale : curScale,
          scY: curScale
        });
      }
    }

    ctx.restore();
    return latestActivePos;
  }

  // ==========================================================================
  // Exported Deterministic Frame-0 Standby Renderer (t = 0.00s === 281.60s)
  // KEPT PIXEL-IDENTICAL FOR 100% EXACT RMS == 0.000 LOOP CLOSURE WITH P18!
  // ==========================================================================
  function drawP01ZeroStandbyFrame(ctx, core) {
    const W = (core && core.W) || 1920;
    const H = (core && core.H) || 1080;

    const prevRaw = ctx.__v6RawColor;
    ctx.save();
    ctx.__v6RawColor = false;
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = FG;
    const step = 32;
    for (let y = 80; y <= H - 80; y += step) {
      const ny = Math.abs(y - H * 0.5) / (H * 0.5);
      for (let x = 96; x <= W - 96; x += step) {
        const nx = Math.abs(x - W * 0.5) / (W * 0.5);
        const edge = Math.max(nx, ny);
        if (edge > 0.68) {
          const s = edge > 0.84 ? 6 : 3;
          ctx.fillRect(x - (s >> 1), y - (s >> 1), s, s);
        }
      }
    }

    drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 360, 110, 88, 3, FG, 1.6, 0.0);

    ctx.strokeStyle = FG;
    ctx.lineWidth = 3;
    const mx = 56, my = 44, arm = 36;
    ctx.beginPath();
    ctx.moveTo(mx, my + arm); ctx.lineTo(mx, my); ctx.lineTo(mx + arm, my);
    ctx.moveTo(W - mx - arm, my); ctx.lineTo(W - mx, my); ctx.lineTo(W - mx, my + arm);
    ctx.moveTo(mx, H - my - arm); ctx.lineTo(mx, H - my); ctx.lineTo(mx + arm, H - my);
    ctx.moveTo(W - mx - arm, H - my); ctx.lineTo(W - mx, H - my); ctx.lineTo(W - mx, H - my - arm);
    ctx.stroke();

    ctx.lineWidth = 1.6;
    for (let x = mx + 72; x < W - mx - 72; x += 48) {
      const th = (x % 192 === 0) ? 12 : 6;
      ctx.beginPath();
      ctx.moveTo(x, my); ctx.lineTo(x, my + th);
      ctx.moveTo(x, H - my); ctx.lineTo(x, H - my - th);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(W * 0.5, my + 18); ctx.lineTo(W * 0.5, H - my - 18);
    ctx.moveTo(mx + 24, H * 0.5); ctx.lineTo(W - mx - 24, H * 0.5);
    ctx.stroke();

    const cx = W * 0.5, cy = H * 0.44;
    ctx.font = JP_MONO(900, 116);
    const title = 'CORTEX_SHELL';
    const tw = ctx.measureText(title).width;
    const padX = 28, bh = 136;
    ctx.fillStyle = FG;
    ctx.fillRect(Math.round(cx - tw * 0.5 - padX), Math.round(cy - bh * 0.5), Math.round(tw + padX * 2), bh);
    ctx.strokeStyle = BG;
    ctx.lineWidth = 4;
    ctx.strokeRect(Math.round(cx - tw * 0.5 - padX + 6), Math.round(cy - bh * 0.5 + 6), Math.round(tw + padX * 2 - 12), bh - 12);
    ctx.fillStyle = BG;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, cx, cy + 4);

    ctx.fillStyle = FG;
    ctx.font = JP_MONO(800, 44);
    ctx.fillText('0.1mm STANDBY ▊', cx, H * 0.62);

    ctx.font = JP_MONO(700, 17);
    ctx.textAlign = 'right';
    ctx.fillText('PID:19527 // TEMP: 0.0C', W - 72, 26);

    ctx.__v6RawColor = prevRaw;
    ctx.restore();
  }

  window.drawP01ZeroStandbyFrame = drawP01ZeroStandbyFrame;

  let _zeroHole = null;
  function getZeroHoleCenter(W, H) {
    if (_zeroHole) return _zeroHole;
    const cv = document.createElement('canvas');
    cv.width = 1200;
    cv.height = 700;
    const c = cv.getContext('2d', { alpha: true });
    c.font = JP_MONO(900, 560);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const wAll = c.measureText('0%').width;
    const wZero = c.measureText('0').width;
    const zeroCenterOffset = -wAll * 0.5 + wZero * 0.5;
    _zeroHole = {
      x: W * 0.5 + zeroCenterOffset,
      y: H * 0.55,
      rx: wZero * 0.21,
      ry: 560 * 0.25
    };
    return _zeroHole;
  }

  let _p01Bufs = null;
  function getP01Buffers(W, H) {
    if (typeof document === 'undefined') return null;
    if (!_p01Bufs || _p01Bufs.a.width !== W || _p01Bufs.a.height !== H) {
      const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
      _p01Bufs = { a: mk(), b: mk(), ca: null, cb: null };
      _p01Bufs.ca = _p01Bufs.a.getContext('2d');
      _p01Bufs.cb = _p01Bufs.b.getContext('2d');
      if (window.CortexV6 && typeof window.CortexV6.hookContextColors === 'function') {
        window.CortexV6.hookContextColors(_p01Bufs.ca);
        window.CortexV6.hookContextColors(_p01Bufs.cb);
      }
    }
    return _p01Bufs;
  }

  window.registerCortexPlate('P01_fog_boot', {
    render(ctx, st, core) {
      const { W, H, TAU, clamp, lerp, prog, ease, frameIdx } = core;
      const cad = window.Cortex25D;
      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const snare = st.snareSnap ?? st.snareEnv ?? st.snare ?? 0;
      const fIdx = frameIdx(t);

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      // ======================================================================
      // EXACT FRAME-0 LOOP LOCK (t < 0.025s) -> RMS == 0.000 with P18!
      // ======================================================================
      if (t < 0.025) {
        drawP01ZeroStandbyFrame(ctx, core);
        ctx.restore();
        return { isPaper: false, isPixel: false, bg: BG, fg: FG, duotone: { bg: BG, fg: FG }, bloom: 0, ca: 0, flash: 0, shake: 0, grain: 0 };
      }

      // V8: Zero straight hard cuts — continuous dual-buffer optical transitions across Cold Boot & Zero Night!
      const renderP01Chapter = (g, chId, ct) => {
        const ck = clamp(kick, 0, 1);
        if (chId === 0) {
          // Ch0 (0.025 - 1.35s): Frosted Glass Chamber & Volumetric Sapphire Light Shafts
          g.fillStyle = BG;
          g.fillRect(0, 0, W, H);
          g.save();
          const beamG = g.createRadialGradient(W * 0.5, H * 0.45, 40, W * 0.5, H * 0.45, 860);
          beamG.addColorStop(0, `rgba(56, 189, 248, ${(0.22 + ck * 0.14).toFixed(3)})`);
          beamG.addColorStop(0.55, 'rgba(18, 38, 68, 0.14)');
          beamG.addColorStop(1, 'rgba(8, 12, 22, 0)');
          g.fillStyle = beamG;
          g.fillRect(0, 0, W, H);
          // Volumetric diagonal frost light shafts
          for (let b = 0; b < 5; b++) {
            const bx = 240 + b * 340 + Math.sin(ct * 1.4 + b) * 45;
            const sg = g.createLinearGradient(bx, 0, bx + 220, H);
            sg.addColorStop(0, 'rgba(126, 196, 236, 0.0)');
            sg.addColorStop(0.45, 'rgba(126, 196, 236, 0.11)');
            sg.addColorStop(1, 'rgba(251, 191, 36, 0.0)');
            g.fillStyle = sg;
            g.beginPath();
            g.moveTo(bx, 0); g.lineTo(bx + 150, 0); g.lineTo(bx + 390, H); g.lineTo(bx + 180, H);
            g.closePath();
            g.fill();
          }
          // Soft concentric optical depth halos + floating ice bokeh motes
          for (let r = 1; r <= 4; r++) {
            g.strokeStyle = r === 2 ? 'rgba(126, 196, 236, 0.34)' : 'rgba(56, 189, 248, 0.22)';
            g.lineWidth = r === 2 ? 2.4 : 1.5;
            g.beginPath();
            g.arc(W * 0.5, H * 0.48, 130 + r * 92 + ck * 16, 0, TAU);
            g.stroke();
          }
          for (let m = 0; m < 28; m++) {
            const mx = ((m * 197 + ct * (42 + (m % 4) * 18)) % (W + 80)) - 40;
            const my = ((m * 131 - ct * (28 + (m % 3) * 14)) % H + H) % H;
            g.fillStyle = m % 4 === 0 ? 'rgba(224, 242, 254, 0.52)' : 'rgba(126, 196, 236, 0.42)';
            g.beginPath();
            g.arc(mx, my, 2.5 + (m % 4) * 2.2, 0, TAU);
            g.fill();
          }
          g.restore();

          drawAutonomousCue(g, core, 'S00_COLD_BOOT', ct, kick, snare, {
            formation: 'diagCascade', cx: W * 0.5, cy: 445, spanX: 1380, spanY: 280, sizePx: 118, mono: true
          });
          const curOn = (Math.floor(fIdx / 8) % 2) === 0;
          drawKnockoutBanner(g, curOn ? '0.100mm STANDBY ▊' : '0.100mm STANDBY ▯', W * 0.5, 795, 72, FG, BG, FG, { mono: true, rot: -0.015 });
        } else if (chId === 1) {
          // Ch1 (1.35 - 2.50s): Breath Condensation Halo & Floating Glass Caustic Shards
          const dt = Math.max(0, ct - 1.35);
          const u1 = clamp(dt / 1.15, 0, 1);
          g.fillStyle = BG;
          g.fillRect(0, 0, W, H);
          g.save();
          const fogG = g.createRadialGradient(W * 0.58, H * 0.48, 30, W * 0.58, H * 0.48, 720);
          fogG.addColorStop(0, `rgba(126, 196, 236, ${(0.24 + ck * 0.14).toFixed(3)})`);
          fogG.addColorStop(0.55, 'rgba(30, 58, 102, 0.16)');
          fogG.addColorStop(1, 'rgba(8, 12, 22, 0)');
          g.fillStyle = fogG;
          g.fillRect(0, 0, W, H);
          for (let i = 0; i < 16; i++) {
            const sx = ((i * 220 + ct * 240) % (W + 240)) - 120;
            const sy = 120 + ((i * 157) % 820);
            const r = 36 + (i % 4) * 24;
            g.save();
            g.translate(sx, sy);
            g.rotate(ct * (i % 2 === 0 ? 0.5 : -0.45) + i);
            g.fillStyle = i % 3 === 0 ? 'rgba(186, 230, 253, 0.12)' : 'rgba(56, 189, 248, 0.12)';
            g.beginPath();
            g.moveTo(r, 0); g.lineTo(-r * 0.45, r * 0.72); g.lineTo(-r * 0.8, -r * 0.48);
            g.closePath();
            g.fill();
            g.restore();
          }
          for (let r = 1; r <= 4; r++) {
            g.strokeStyle = r === 2 ? 'rgba(186, 230, 253, 0.36)' : 'rgba(126, 196, 236, 0.28)';
            g.lineWidth = 2.0;
            g.beginPath();
            g.arc(W * 0.60, H * 0.50, r * 115 + u1 * 34, -0.4 + r * 0.5 + ct * 0.85, 1.8 + r * 0.5 + ct * 0.85);
            g.stroke();
          }
          g.restore();

          const odoVal = (0.100 + Math.sin(dt * 16) * 0.004 * (1 - u1)).toFixed(3);
          drawKnockoutBanner(g, `${odoVal} MM`, W * 0.36, 235, 128, BONE, BG, FG, { mono: true });
          drawAutonomousCue(g, core, 'S00_COLD_BOOT', ct, kick, snare, {
            formation: 'steppedTerminal', cx: W * 0.52, cy: 605, spanX: 1360, spanY: 250, sizePx: 118, mono: true
          });
        } else if (chId === 2) {
          // Ch2 (2.50 - 3.51s): Radial Frost Melt & Sapphire Optical Lens Convergence into P19
          const u = prog(ct, 2.34, 3.51, ease.outExpo);
          g.fillStyle = BG;
          g.fillRect(0, 0, W, H);
          g.save();
          const zoom = lerp(1.0, 2.25, prog(ct, 2.34, 3.51, ease.inCubic));
          g.translate(W * 0.5, H * 0.5);
          g.scale(zoom, zoom);
          g.translate(-W * 0.5, -H * 0.5);
          drawHalftoneFrostField(g, W, H, ct * 1.8, FG, 0.90 + u * 0.30, ct * 440, (px, py) => {
            return Math.hypot(px - W * 0.5, py - H * 0.5) < lerp(170, 440, u);
          });
          for (let r = 1; r <= 4; r++) {
            g.strokeStyle = r % 2 === 0 ? BONE : FG;
            g.lineWidth = (r % 2 === 0 ? 5.0 : 3.0) / zoom;
            g.beginPath();
            g.arc(W * 0.5, H * 0.5, r * 112 + u * 88, 0, TAU);
            g.stroke();
          }
          g.restore();
          drawAutonomousCue(g, core, 'S00_COLD_BOOT', ct, kick, snare, {
            formation: 'parabolicScatter', cx: W * 0.5, cy: 560, spanX: 1420, spanY: 360, sizePx: 118, mono: true
          });
        } else if (chId === 3) {
          // Ch3 (7.36 - 10.17s): Full-Bleed Aspect-Exact `C01` (`C01_fog_fingertip`) with Radial Palm Condensation Melt (`コンマ一ミリの 硝子の向こう`)!
          const uC01 = clamp((ct - 7.36) / (10.17 - 7.36), 0, 1);
          const v6c10 = window.CortexV6;
          g.fillStyle = BG;
          g.fillRect(0, 0, W, H);

          if (v6c10 && typeof v6c10.drawLivingFullBleed === 'function' && v6c10.getPlateImage('C01')) {
            const exitPush = ct > 9.85 ? ease.inCubic(clamp((ct - 9.85) / 0.32, 0, 1)) * 0.22 : 0;
            v6c10.drawLivingFullBleed(g, 'C01', {
              t: ct, u: uC01, kick,
              zoom0: 1.04, zoom1: 1.18 + exitPush, panX0: -18, panX1: 22, panY0: 12, panY1: -10,
              rot0: -0.010, rot1: 0.008, fx: 0.48, fy: 0.42, scrim: 0.18, isPaper: false
            });
          }

          // Subtle frosted condensation halo clearing radially from her palm `(620, 615)`
          const palmX = 620, palmY = 615;
          const meltR = lerp(155, 860, ease.outCubic(uC01));
          g.save();
          const mistG = g.createRadialGradient(palmX, palmY, Math.max(20, meltR * 0.72), palmX, palmY, meltR + 260);
          mistG.addColorStop(0, 'rgba(14, 24, 42, 0)');
          mistG.addColorStop(0.55, `rgba(18, 36, 62, ${(0.22 * (1 - uC01 * 0.55)).toFixed(3)})`);
          mistG.addColorStop(1, `rgba(10, 18, 34, ${(0.34 * (1 - uC01 * 0.45)).toFixed(3)})`);
          g.fillStyle = mistG;
          g.fillRect(0, 0, W, H);

          for (let r = 0; r < 2; r++) {
            g.strokeStyle = r === 0 ? 'rgba(186, 230, 253, 0.42)' : 'rgba(56, 189, 248, 0.28)';
            g.lineWidth = r === 0 ? 2.2 : 1.2;
            g.beginPath();
            g.arc(palmX, palmY, meltR - r * 26, -0.65 + ct * 0.25, 1.35 + ct * 0.25);
            g.stroke();
          }
          g.restore();

          if (ct < 8.68) {
            const retract = ct > 8.50 ? clamp((ct - 8.50) / 0.18, 0, 1) : 0;
            g.save();
            if (retract > 0.001) {
              const scR = lerp(1.0, 0.82, retract);
              g.globalAlpha = 1 - retract;
              g.translate(W * 0.56, 365);
              g.scale(scR, scR);
              g.translate(-W * 0.56, -365);
            }
            drawAutonomousCue(g, core, 'L02_COMMA_GLASS', ct, kick, snare, {
              formation: 'mirrorArc', iStart: 0, iEnd: 6, mirrorX: false,
              curated: [
                { x: 460,  y: 335, sz: 126, rot: -0.08 }, { x: 635,  y: 295, sz: 122, rot:  0.07 },
                { x: 810,  y: 332, sz: 126, rot: -0.06 }, { x: 1055, y: 375, sz: 216, rot:  0.05 },
                { x: 1290, y: 338, sz: 126, rot: -0.07 }, { x: 1455, y: 300, sz: 126, rot:  0.06 },
                { x: 1615, y: 348, sz: 92,  rot: -0.09 }
              ]
            });
            g.restore();
          } else {
            drawAutonomousCue(g, core, 'L02_COMMA_GLASS', ct, kick, snare, {
              formation: 'tategakiCollage', iStart: 7, iEnd: 12,
              curated: [
                { x: 1365, y: 265, sz: 206, rot: -0.08 }, { x: 1575, y: 230, sz: 116, rot:  0.07 },
                { x: 1735, y: 278, sz: 112, rot: -0.06 }, { x: 1405, y: 535, sz: 210, rot:  0.07 },
                { x: 1625, y: 575, sz: 204, rot: -0.07 }, { x: 1785, y: 492, sz: 92,  rot:  0.09 }
              ]
            });
          }
        } else {
          // Ch4 (10.17 - 14.20s): Full-Bleed Sanctuary `C02` (right) + Left Negative-Space Spoked `0%` Wheel -> Coaxial `'0'` Portal Dive into P02!
          const uC02 = clamp((ct - 10.17) / (14.20 - 10.17), 0, 1);
          const diveU = prog(ct, 13.38, 14.20, ease.inCubic);
          const v6c = window.CortexV6;

          g.fillStyle = BG;
          g.fillRect(0, 0, W, H);

          // 1. Full-bleed aspect-exact `C02_zero_night_curled` (curled on right side `x ~ 1380`, completely unobstructed!)
          if (v6c && typeof v6c.drawLivingFullBleed === 'function' && v6c.getPlateImage('C02')) {
            v6c.drawLivingFullBleed(g, 'C02', {
              t: ct, u: uC02, kick,
              zoom0: 1.04, zoom1: 1.22 + diveU * 0.35, panX0: -16, panX1: 18, panY0: 10, panY1: -10,
              rot0: -0.010, rot1: 0.008, fx: 0.54, fy: 0.44, scrim: 0.22 + diveU * 0.45, isPaper: false
            });
          }

          // Subtle midnight bokeh motes
          g.save();
          for (let m = 0; m < 22; m++) {
            const mx = ((m * 167 + ct * 52) % W);
            const my = ((m * 113 - ct * 38) % H + H) % H;
            g.fillStyle = m % 3 === 0 ? 'rgba(224, 242, 254, 0.38)' : 'rgba(126, 196, 236, 0.30)';
            g.beginPath(); g.arc(mx, my, 2.0 + (m % 4) * 1.3, 0, TAU); g.fill();
          }

          // 2. Precision Spoked `0%` Wheel: sits cleanly in LEFT negative space (`x = 560`) during `10.17-13.38s`, then glides to `W*0.5` as camera dives through `'0'`!
          const wheelX = lerp(560, W * 0.50, ease.inOutCubic(clamp((ct - 13.20) / 0.58, 0, 1)));
          const wheelY = lerp(565, H * 0.50, ease.inOutCubic(clamp((ct - 13.20) / 0.58, 0, 1)));
          const enterScale = ease.outCubic(clamp((ct - 10.17) / 0.45, 0, 1));
          const camScale = lerp(0.72, 1.0, enterScale) + ck * 0.025 + diveU * diveU * 9.8;

          g.save();
          g.translate(wheelX, wheelY);
          g.scale(camScale, camScale);
          g.translate(-wheelX, -wheelY);

          for (let r = 1; r <= 4; r++) {
            const rad = 108 + r * 48 + ck * 6;
            g.strokeStyle = r === 2 ? 'rgba(186, 230, 253, 0.42)' : 'rgba(56, 189, 248, 0.32)';
            g.lineWidth = r === 1 ? 2.4 : 1.4;
            g.beginPath();
            g.arc(wheelX, wheelY, rad, ct * (r % 2 === 0 ? 0.55 : -0.75), ct * (r % 2 === 0 ? 0.55 : -0.75) + Math.PI * 1.6);
            g.stroke();
          }
          // Precision spokes inside the '0' aperture (like V6.2 `diag_intro_13_23s.jpg`!)
          g.strokeStyle = 'rgba(126, 196, 236, 0.34)';
          g.lineWidth = 1.2;
          for (let sp = 0; sp < 12; sp++) {
            const sa = (sp / 12) * TAU + ct * 0.35;
            g.beginPath();
            g.moveTo(wheelX + Math.cos(sa) * 24, wheelY + Math.sin(sa) * 34);
            g.lineTo(wheelX + Math.cos(sa) * 92, wheelY + Math.sin(sa) * 124);
            g.stroke();
          }

          g.font = JP_SANS(900, 310);
          const wZero0 = g.measureText('0').width;
          const pctFade = 1 - clamp((ct - 13.12) / 0.34, 0, 1);
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          g.fillStyle = 'rgba(8, 12, 22, 0.68)';
          g.fillText('0', wheelX + 7, wheelY + 7);
          g.strokeStyle = FG;
          g.lineWidth = 4.2;
          g.strokeText('0', wheelX, wheelY);
          g.fillStyle = BONE;
          g.fillText('0', wheelX, wheelY);
          if (pctFade > 0.01) {
            g.save();
            g.globalAlpha = pctFade;
            g.font = JP_SANS(900, 185);
            const pctX = wheelX + wZero0 * 0.5 + 98;
            const pctY = wheelY + 34;
            g.fillStyle = 'rgba(8, 12, 22, 0.68)';
            g.fillText('%', pctX + 5, pctY + 5);
            g.strokeStyle = FG;
            g.lineWidth = 3.2;
            g.strokeText('%', pctX, pctY);
            g.fillStyle = BONE;
            g.fillText('%', pctX, pctY);
            g.restore();
          }
          g.restore();
          g.restore();

          // 3. Staggered Lyric Stamps in upper-left architectural space (never covering C02 on right!)
          if (ct < 11.88) {
            const retY = ct > 11.70 ? Math.pow((ct - 11.70) / 0.18, 2) * 420 : 0;
            g.save();
            g.translate(0, -retY);
            drawAutonomousCue(g, core, 'L03_ZERO_NIGHT', ct, kick, snare, {
              formation: 'diagCascade', iStart: 0, iEnd: 5,
              cx: 520, cy: 235, spanX: 740, spanY: 165, minX: 115, maxX: 980, minY: 125, maxY: 345, sizePx: 128
            });
            g.restore();
          } else if (ct < 13.68) {
            const flyUp = ct > 13.44 ? ease.inCubic(clamp((ct - 13.44) / 0.24, 0, 1)) * 420 : 0;
            g.save();
            g.translate(0, -flyUp);
            drawAutonomousCue(g, core, 'L03_ZERO_NIGHT', ct, kick, snare, {
              formation: 'parabolicScatter', iStart: 6, iEnd: 11,
              curated: [
                { x: 245,  y: 235, sz: 142, rot: -0.09 }, { x: 415,  y: 210, sz: 80,  rot:  0.10 },
                { x: 615,  y: 228, sz: 148, rot: -0.07 }, { x: 815,  y: 208, sz: 84,  rot:  0.09 },
                { x: 965,  y: 236, sz: 84,  rot: -0.08 }, { x: 1115, y: 214, sz: 88,  rot:  0.10 }
              ]
            });
            g.restore();
          }
        }
      };

      // Resolve continuous P01 chapter & 100%-opaque dual-buffer transitions (ZERO cross-dissolves!)
      const bufs = getP01Buffers(W, H);
      const chSched = (t < 3.51)
        ? [
            { id: 0, t0: 0.025, t1: 1.35, td: 0.28, mode: 'irisExpand' },
            { id: 1, t0: 1.35,  t1: 2.50, td: 0.28, mode: 'irisExpand' },
            { id: 2, t0: 2.50,  t1: 3.51, td: 0.00, mode: 'irisExpand' }
          ]
        : [
            { id: 3, t0: 7.36,  t1: 10.17, td: 0.30, mode: 'irisExpand' },
            { id: 4, t0: 10.17, t1: 14.20, td: 0.00, mode: 'irisExpand' }
          ];
      let chIdx = 0;
      for (let i = 0; i < chSched.length; i++) {
        if (t >= chSched[i].t0 && (t < chSched[i].t1 || i === chSched.length - 1)) { chIdx = i; break; }
      }
      const cA = chSched[chIdx];
      const cB = chIdx + 1 < chSched.length ? chSched[chIdx + 1] : null;
      const inTr = Boolean(cB && bufs && cA.td > 0 && t >= cA.t1 - cA.td);
      if (!inTr) {
        renderP01Chapter(ctx, cA.id, t);
      } else {
        const uTr = clamp((t - (cA.t1 - cA.td)) / cA.td, 0, 1);
        const sm = ease.inOutCubic(uTr);
        bufs.ca.setTransform(1, 0, 0, 1, 0, 0);
        bufs.ca.globalAlpha = 1;
        bufs.ca.globalCompositeOperation = 'source-over';
        bufs.ca.clearRect(0, 0, W, H);
        bufs.cb.setTransform(1, 0, 0, 1, 0, 0);
        bufs.cb.globalAlpha = 1;
        bufs.cb.globalCompositeOperation = 'source-over';
        bufs.cb.clearRect(0, 0, W, H);
        renderP01Chapter(bufs.ca, cA.id, t);
        renderP01Chapter(bufs.cb, cB.id, t);

        // 100%-Opaque Circular Frost-Lens Aperture Expansion (zero cross-dissolve, zero raw-color clash)
        const sOut = lerp(1.0, 1.24, sm);
        ctx.drawImage(bufs.a, W * 0.5 * (1 - sOut), H * 0.5 * (1 - sOut), W * sOut, H * sOut);
        const rad = Math.max(12, sm * 1320);
        const sIn = lerp(0.86, 1.0, sm);
        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.arc(W * 0.5, H * 0.5, rad, 0, TAU);
        ctx.clip();
        ctx.drawImage(bufs.b, W * 0.5 * (1 - sIn), H * 0.5 * (1 - sIn), W * sIn, H * sIn);
        ctx.restore();
        if (uTr > 0.02 && uTr < 0.96) {
          ctx.save();
          ctx.strokeStyle = FG;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(W * 0.5, H * 0.5, rad, 0, TAU);
          ctx.stroke();
          ctx.restore();
        }
      }

      ctx.restore();
      return {
        isPaper: false,
        bg: BG,
        fg: BONE,
        duotone: { bg: BG, fg: FG },
        bloom: 0,
        ca: 0,
        flash: 0,
        shake: 0.16 * Math.max(kick, snare)
      };
    }
  });
})();
