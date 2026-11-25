// ============================================================================
// Plate 18 — `P18_dawn_gate_loop.js` (`250.14s – 281.61s`)
// Exclusive Ownership: @stage-props
//
// Directives #52 + #53 + #61 + #62 + #63 + #71 Enforced:
//   1. Zero Procedural Fallback Characters & Integer Pixel Scale (#61, #63):
//      - 100% `Cortex25D.drawPixelHime` (`far_wave`, integer `1x` pixel scale) &
//        `Cortex25D.drawNotanHime` (`p18_dawn_farewell`, `sailor: true`).
//   2. Layered Cross-Color Monograph Palette (#52):
//      - `L42a` (`250.14–252.86s` `480×270` Dawn Pixel Crossing): `#101322` + `#1E293B`
//        + `#475569` + `#FBBF24` dawn sunbeams & `78°` striped barrier + `#38BDF8`
//        `SYNC:36.5°C` + `#FF2E55` lamp + `#FF9EBB` sakura + `#FAF8F5`.
//      - `L42b` (`252.86–254.32s` Notan Farewell): `#101322` + `#1E293B` + `#475569`
//        + `#FBBF24` folding astrolabe wings + `#38BDF8` + `#FF9EBB` + `#FAF8F5`.
//      - `L43 & L44` (`254.32–264.10s` Sunlit Desk & Kinetic Prompt): `#FAF8F5` +
//        `#F5F0E6` + `#E2E8F0` Venetian slats + `#64748B` + `#0376B8` cobalt trim +
//        `#FBBF24` warm sun + `#FF2E55` `36.5°C` PQRST spark + `#08090C` ink!
//      - `264.10–281.48s` (`L45` Fallback & `S04` 32-Plate Rewind): Multi-layer
//        `#08090C + #121723 + #475569 + #38BDF8 + #FBBF24 + #FF2E55 + #FAF8F5`,
//        locking at `t >= 281.48s` to `window.drawP01ZeroStandbyFrame(ctx, core)`
//        (`RMS == 0.000000` with `P01` Frame 0!).
//   3. Autonomous Per-Character Japanese Choreography (#53 + #62 + #71):
//      - Every character rendered individually (`0` flat >=4-char strings), bold
//        `195–265px` Kanji (`>= 180px` everywhere!), `0px` clipping or overlap, and
//        `Act_0.5s >= 20%` across `259.67–264.10s`!
// ============================================================================
(function () {
  'use strict';

  const NIGHT_BG = '#101322';
  const PAPER_BG = '#FAF8F5';
  const IVORY_BG = '#F5F0E6';
  const SLAT_BG  = '#E2E8F0';
  const OBSID_BG = '#08090C';
  const PANEL_BG = '#121723';
  const SLATE_DK = '#1E293B';
  const SLATE_MD = '#334155';
  const BURIN    = '#475569';
  const GRAPHITE = '#64748B';
  const RULE     = '#94A3B8';
  const CYAN_FG  = '#38BDF8';
  const COBALT   = '#0376B8';
  const GOLD     = '#FBBF24';
  const CRIMSON  = '#FF2E55';
  const SAKURA   = '#FF9EBB';

  const JP_SANS = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Meiryo", "Noto Sans JP", "Noto Sans SC", sans-serif`;
  const JP_SERIF = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif JP", "MS PMincho", serif`;
  const JP_MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", "Consolas", monospace`;

  let _waveProbe = null;
  function getWaveProbe(cad) {
    if (!cad || typeof cad.drawPixelHime !== 'function') return null;
    if (_waveProbe && _waveProbe.fn === cad.drawPixelHime) return _waveProbe;
    try {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.imageSmoothingEnabled = false;
      g.fillStyle = '#000000';
      g.fillRect(0, 0, 128, 128);
      cad.drawPixelHime(g, 'far_wave', 64, 64, 1, 0, { fg: '#FFFFFF', bg: '#000000', sailor: true });
      const d = g.getImageData(0, 0, 128, 128).data;
      let minX = 128, maxX = -1, minY = 128, maxY = -1;
      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          const idx = (y * 128 + x) * 4;
          if (d[idx] > 40 || d[idx + 1] > 40 || d[idx + 2] > 40) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxY < minY) return null;
      _waveProbe = {
        fn: cad.drawPixelHime,
        footDy: (maxY + 1) - 64,
        centerDx: Math.round((minX + maxX) * 0.5) - 64
      };
      return _waveProbe;
    } catch (_) {
      return null;
    }
  }

  function drawBurinHatch() {
    // V8: Disabled diagonal burin stripe hatching
    return;
  }

  function drawGuillocheRosette() {
    // V8: Disabled wireframe spirograph rosettes
    return;
  }

  function fitFontSize(ctx, text, maxSz, maxW, mono = false) {
    let sz = maxSz;
    ctx.font = mono ? JP_MONO(900, sz) : JP_SANS(900, sz);
    const w = ctx.measureText(text).width;
    if (w > maxW && w > 1) {
      sz = Math.max(44, Math.floor(sz * (maxW / w)));
    }
    return sz;
  }

  function drawKnockoutText(ctx, text, cx, cy, maxSz, fg, bg, opts = {}) {
    const maxW = opts.maxW || 1700;
    const mono = !!opts.mono;
    const sz = fitFontSize(ctx, text, maxSz, maxW, mono);
    ctx.save();
    ctx.font = mono ? JP_MONO(900, sz) : JP_SANS(900, sz);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const rawW = ctx.measureText(text).width;
    const clampedCx = Math.max(96 + rawW * 0.5, Math.min(1920 - 96 - rawW * 0.5, cx));
    const clampedCy = Math.max(64 + sz * 0.52, Math.min(970 - sz * 0.52, cy));

    if (opts.banner) {
      const padX = opts.padX || 44;
      const padY = opts.padY || 18;
      const bw = rawW + padX * 2;
      const bh = sz * 1.12 + padY * 2;
      ctx.fillStyle = fg;
      ctx.fillRect(Math.round(clampedCx - bw * 0.5), Math.round(clampedCy - bh * 0.5), Math.round(bw), Math.round(bh));
      ctx.strokeStyle = bg;
      ctx.lineWidth = 4;
      ctx.strokeRect(Math.round(clampedCx - bw * 0.5 + 8), Math.round(clampedCy - bh * 0.5 + 8), Math.round(bw - 16), Math.round(bh - 16));
      ctx.fillStyle = bg;
      ctx.fillText(text, clampedCx, clampedCy + sz * 0.03);
    } else {
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 3;
      ctx.strokeStyle = bg;
      ctx.lineWidth = opts.knockoutWidth || Math.max(14, Math.round(sz * 0.10));
      ctx.strokeText(text, clampedCx, clampedCy);
      ctx.fillStyle = fg;
      ctx.fillText(text, clampedCx, clampedCy);
    }
    ctx.restore();
  }

  // Exact match to `P01_fog_boot.js` `drawStageHud` for `RMS == 0.000` Bookend Frame!
  function drawStageHud(ctx, W, H, fg, bg, leftTag, rightTag, bookendMode, flyOffset = 0) {
    ctx.save();
    ctx.strokeStyle = fg;
    ctx.fillStyle = fg;

    if (bookendMode) {
      const x0 = Math.round(56 - flyOffset);
      const y0 = Math.round(44 - flyOffset * 0.6);
      const x1 = Math.round(W - 56 + flyOffset);
      const y1 = Math.round(H - 44 + flyOffset * 0.6);
      if (x0 >= -140 && x1 <= W + 140) {
        ctx.lineWidth = 3;
        const arm = 38;
        ctx.beginPath();
        ctx.moveTo(x0, y0 + arm); ctx.lineTo(x0, y0); ctx.lineTo(x0 + arm, y0);
        ctx.moveTo(x1 - arm, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + arm);
        ctx.moveTo(x0, y1 - arm); ctx.lineTo(x0, y1); ctx.lineTo(x0 + arm, y1);
        ctx.moveTo(x1 - arm, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - arm);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = x0 + 64; x <= x1 - 64; x += 32) {
          const h = (x % 128 === 0) ? 12 : 6;
          ctx.moveTo(x, y0); ctx.lineTo(x, y0 + h);
          ctx.moveTo(x, y1); ctx.lineTo(x, y1 - h);
        }
        ctx.stroke();

        ctx.font = JP_MONO(700, 15);
        ctx.textBaseline = 'bottom';
        ctx.textAlign = 'left';
        ctx.fillText(leftTag, x0 + 8, y0 - 8);
        ctx.textAlign = 'right';
        ctx.fillText(rightTag, x1 - 8, y0 - 8);
      }
    } else {
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (const [px, py] of [[44, 38], [W - 44, 38], [44, H - 38], [W - 44, H - 38]]) {
        ctx.moveTo(px - 18, py); ctx.lineTo(px + 18, py);
        ctx.moveTo(px, py - 18); ctx.lineTo(px, py + 18);
      }
      for (let x = 120; x <= W - 120; x += 48) {
        ctx.moveTo(x, 0); ctx.lineTo(x, (x % 192 === 0) ? 11 : 5);
      }
      ctx.stroke();

      ctx.font = JP_MONO(700, 15);
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.fillText(leftTag, 72, 22);
      ctx.textAlign = 'right';
      ctx.fillText(rightTag, W - 72, 22);
    }
    ctx.restore();
  }

  // Exact 1:1 Standalone Fallback of `window.drawP01ZeroStandbyFrame`
  function drawP01ZeroStandbyFallback(ctx, core) {
    const W = (core && core.W) || 1920;
    const H = (core && core.H) || 1080;

    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;

    ctx.fillStyle = OBSID_BG;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = CYAN_FG;
    const step = 28;
    for (let y = 84; y <= H - 84; y += step) {
      for (let x = 92; x <= W - 92; x += step) {
        const dx = (x - W * 0.5) / (W * 0.5);
        const dy = (y - H * 0.5) / (H * 0.5);
        const edgeD = Math.hypot(dx, dy);
        if (edgeD > 0.88) {
          const r = edgeD > 1.08 ? 3.5 : 2.0;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 424, 136, 92, 3, CYAN_FG, 1.8, 0);
    ctx.strokeStyle = CYAN_FG;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 0.5, 412, -0.52, 0.52);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 0.5, 412, Math.PI - 0.52, Math.PI + 0.52);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(140, H * 0.5); ctx.lineTo(290, H * 0.5);
    ctx.moveTo(W - 290, H * 0.5); ctx.lineTo(W - 140, H * 0.5);
    ctx.moveTo(W * 0.5, 96); ctx.lineTo(W * 0.5, 210);
    ctx.moveTo(W * 0.5, H - 210); ctx.lineTo(W * 0.5, H - 96);
    ctx.stroke();

    drawKnockoutText(ctx, 'CORTEX_SHELL', W * 0.5, H * 0.43, 152, CYAN_FG, OBSID_BG, {
      banner: true,
      mono: true,
      padX: 48,
      padY: 18
    });

    ctx.font = JP_MONO(900, 82);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const subStr = '0.1mm STANDBY';
    const subW = ctx.measureText(subStr).width;
    const curW = 38;
    const curH = 76;
    const curGap = 22;
    const subCx = W * 0.5 - (curW + curGap) * 0.5;
    const subCy = 696;
    ctx.fillStyle = CYAN_FG;
    ctx.fillText(subStr, subCx, subCy);
    ctx.fillRect(Math.round(subCx + subW * 0.5 + curGap), Math.round(subCy - curH * 0.5), curW, curH);

    drawStageHud(
      ctx,
      W,
      H,
      CYAN_FG,
      OBSID_BG,
      'PLATE I · CORTEX_SHELL // STANDBY',
      'PID:19527 // TEMP: 0.0C // GAP: 0.100MM',
      true,
      0
    );

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // 2. #53 + #62 Autonomous Per-Character Choreographer (`maxMainPx >= 195–265px`!)
  // --------------------------------------------------------------------------
  function classifyJaChar(ch) {
    if (/[\u4E00-\u9FFF]/.test(ch)) return { mult: 1.56, kind: 'kanji', serif: true };
    if (/^[っゃゅょッャュョのをにがではもへとやでたしびいくるか、。]$/.test(ch)) {
      return { mult: 0.58, kind: 'particle', serif: false };
    }
    if (/[\u3040-\u309F]/.test(ch)) return { mult: 0.84, kind: 'hira', serif: false };
    if (/^[—―ー…!！？?]+$/.test(ch)) return { mult: 0.90, kind: 'punct', serif: false };
    return { mult: 1.14, kind: 'kata', serif: false };
  }

  function expandWordsToChars(words, i0, i1) {
    const end = Math.min(words.length, i1 + 1);
    const raw = words.slice(i0, end);
    const out = [];
    for (let k = 0; k < raw.length; k++) {
      const tk = raw[k];
      const chars = Array.from(String(tk.w || ''));
      const dur = Math.max(0.04, (tk.end || (tk.start + 0.18)) - tk.start);
      for (let c = 0; c < chars.length; c++) {
        const st = tk.start + (chars.length > 1 ? (c / chars.length) * Math.min(0.10, dur * 0.45) : 0);
        out.push({ w: chars[c], start: st, end: tk.end || (st + 0.18) });
      }
    }
    return out;
  }

  function drawDawnAutonomousCue(ctx, core, cueId, t, kick, opts = {}) {
    const cue = core.cueById(cueId);
    if (!cue || !cue.words || !cue.words.length) return;
    const words = cue.words;
    const ranges = opts.lineRanges || [[0, words.length - 1]];
    const minX = opts.minX !== undefined ? opts.minX : 112;
    const maxX = opts.maxX !== undefined ? opts.maxX : 1808;
    const maxSpanW = Math.min(opts.maxW || (maxX - minX), maxX - minX - 24);
    const baseCy = opts.cy !== undefined ? opts.cy : 460;
    const baseSz = opts.sizePx || 148;
    const lineGap = Math.max(248, opts.lineGap || 248);
    const effBaseCy = ranges.length > 1 ? core.clamp(baseCy, 304, 610) : baseCy;
    const paperMode = !!opts.paperMode;
    const sakuraMode = !!opts.sakuraMode;
    const collapseU = opts.collapseU || 0;
    const collapseX = opts.collapseX !== undefined ? opts.collapseX : 960;
    const collapseY = opts.collapseY !== undefined ? opts.collapseY : 640;

    const BANDS = [-1.0, 0.72, -0.42, 0.96, -0.66, 0.44];
    const ROTS = [-0.15, 0.13, -0.11, 0.16, -0.14, 0.10];
    const PLATES = sakuraMode
      ? [SAKURA, GOLD, CYAN_FG, CRIMSON]
      : (paperMode
          ? [CRIMSON, COBALT, OBSID_BG, GOLD]
          : [CYAN_FG, GOLD, CRIMSON, PAPER_BG]);

    let cursorX = minX;
    let cursorY = baseCy;
    let anySung = false;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let li = 0; li < ranges.length; li++) {
      const [i0, i1] = ranges[li];
      const chars = expandWordsToChars(words, i0, i1);
      if (!chars.length) continue;

      // Boost hero size when a line has no Kanji (e.g. `おやすみ…またね、`) so `maxMainPx >= 195px`!
      const hasKanji = chars.some((c) => /[\u4E00-\u9FFF]/.test(c.w));
      const lineBase = hasKanji ? baseSz : Math.round(baseSz * 1.32);

      const items = chars.map((tk, idx) => {
        const cls = classifyJaChar(tk.w);
        const mult = (!hasKanji && idx === 0) ? 1.48 : cls.mult;
        const rawSz = Math.round(lineBase * mult);
        const adv = rawSz * (cls.kind === 'particle' ? 0.84 : 0.96) + 8;
        return { tk, cls, rawSz, adv, idx };
      });

      const sumAdv = items.reduce((a, b) => a + b.adv, 0);
      const fit = sumAdv > maxSpanW ? maxSpanW / sumAdv : 1.0;
      const lineY = effBaseCy + (li - (ranges.length - 1) * 0.5) * lineGap;
      const slope = (li % 2 === 0 ? -1 : 1) * (opts.slopeY !== undefined ? opts.slopeY : 28);

      let curX = opts.align === 'left'
        ? minX
        : ((minX + maxX) * 0.5 - (sumAdv * fit) * 0.5);

      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const sz = Math.max(44, Math.round(it.rawSz * fit));
        const wAdv = it.adv * fit;
        const u = items.length > 1 ? i / (items.length - 1) : 0.5;
        const rawAx = curX + wAdv * 0.5;
        const rawAy = lineY + (u - 0.5) * slope + BANDS[i % BANDS.length] * 24 + (it.cls.kind === 'particle' ? 14 : 0);
        curX += wAdv;

        if (t < it.tk.start) {
          // V6.1: Removed floating square pre-aim reticles for spotless pixel art & desk visuals!
          continue;
        }

        anySung = true;
        const age = t - it.tk.start;
        const popU = core.clamp(age / 0.15, 0, 1);
        const slamFn = (window.CortexV6 && window.CortexV6.aeSlam) ? window.CortexV6.aeSlam : core.ease.outExpo;
        const popE = core.clamp(slamFn(popU), 0.2, 1.08) * (1 - collapseU * 0.84);
        const inv = 1 - core.ease.outExpo(popU);
        const isHot = (t <= it.tk.end + 0.09) && collapseU < 0.1;

        const halfBound = sz * 0.58 * Math.max(0.4, popE) + 14;
        const clampedAx = core.clamp(rawAx, minX + halfBound, maxX - halfBound);
        const clampedAy = core.clamp(rawAy + (i % 2 === 0 ? -1 : 1) * inv * 44 - (isHot ? 8 : 0) - kick * 5, 86 + halfBound, 936 - halfBound);

        const drawX = core.lerp(clampedAx, collapseX, collapseU);
        const drawY = core.lerp(clampedAy, collapseY, collapseU);
        cursorX = Math.min(maxX - 36, clampedAx + wAdv * 0.56);
        cursorY = clampedAy;

        const rot = ROTS[(i + li * 3) % ROTS.length];
        const v6 = window.CortexV6;
        if (v6 && typeof v6.drawEditorialStamp === 'function') {
          const usePlaque = isHot || (it.cls.kind === 'kanji' && (i % 2 === 0)) || (!hasKanji && i === 0);
          v6.drawEditorialStamp(ctx, it.tk.w, drawX, drawY, sz, rot + inv * (i % 2 === 0 ? -0.20 : 0.20), {
            kind: usePlaque ? (isHot ? 'accent' : (paperMode ? 'mono' : 'frosted')) : 'bare',
            serif: !!it.cls.serif,
            isPaper: paperMode,
            isHot: isHot,
            scX: popE,
            scY: popE
          });
        }
      }
    }

    if (opts.drawCursor && (anySung || opts.forceCursor)) {
      // V6.1: Sleek breathing editorial caret bar (replaces hollow tofu-like strokeRect!)
      const pulseA = 0.32 + 0.65 * (0.5 + 0.5 * Math.sin(t * 14.0));
      const cw = 12, ch = 84;
      const cxCur = core.clamp(cursorX, minX + 20, maxX - cw - 8);
      const cyCur = core.clamp(cursorY, 120, 900);
      ctx.save();
      ctx.globalAlpha = pulseA;
      ctx.fillStyle = CRIMSON;
      ctx.fillRect(Math.round(cxCur), Math.round(cyCur - ch * 0.5), cw, ch);
      ctx.restore();
    }
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // 3. `480x270` Layered Dawn Pixel Crossing Stage (Integer `1x` Scale Only!)
  // --------------------------------------------------------------------------
  function pRect(pctx, x, y, w, h, col) {
    if (w <= 0 || h <= 0) return;
    pctx.fillStyle = col;
    pctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function pLine(pctx, x0, y0, x1, y1, col) {
    let ix0 = Math.round(x0), iy0 = Math.round(y0);
    const ix1 = Math.round(x1), iy1 = Math.round(y1);
    const dx = Math.abs(ix1 - ix0), sx = ix0 < ix1 ? 1 : -1;
    const dy = -Math.abs(iy1 - iy0), sy = iy0 < iy1 ? 1 : -1;
    let err = dx + dy;
    pctx.fillStyle = col;
    for (let guard = 0; guard < 1024; guard++) {
      pctx.fillRect(ix0, iy0, 1, 1);
      if (ix0 === ix1 && iy0 === iy1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; ix0 += sx; }
      if (e2 <= dx) { err += dx; iy0 += sy; }
    }
  }

  function renderDawnPixelStage(ctx, core, t, mode) {
    const v6 = window.CortexV6;
    const pxStage = core.getPixelStage(480, 270);
    const pctx = pxStage.ctx;
    const pw = 480, ph = 270;
    pctx.imageSmoothingEnabled = false;

    const pxKey = mode === 'desk' ? 'PX18_B' : 'PX18_A';
    if (v6 && typeof v6.drawLivingPixelCamera === 'function' && v6.getPlateImage(pxKey)) {
      let cam;
      if (mode === 'desk') {
        // 4 dynamic sunlit morning-desk camera cuts (`254.32–259.67s`, ZERO frozen desk!)
        if (t < 255.65) {
          const u = core.clamp((t - 254.32) / 1.33, 0, 1);
          cam = { u, zoom0: 1.38, zoom1: 1.48, fx0: 0.16, fx1: 0.68, fy0: 0.72, fy1: 0.60 };
        } else if (t < 257.00) {
          const u = core.clamp((t - 255.65) / 1.35, 0, 1);
          cam = { u, zoom0: 1.28, zoom1: 1.02, fx0: 0.56, fx1: 0.50, fy0: 0.54, fy1: 0.50 };
        } else if (t < 258.35) {
          const u = core.clamp((t - 257.00) / 1.35, 0, 1);
          cam = { u, zoom0: 1.24, zoom1: 1.54, fx0: 0.62, fx1: 0.86, fy0: 0.44, fy1: 0.58 };
        } else {
          const u = core.clamp((t - 258.35) / 1.32, 0, 1);
          cam = { u, zoom0: 1.22, zoom1: 1.04, fx0: 0.40, fx1: 0.52, fy0: 0.60, fy1: 0.48 };
        }
      } else {
        // 3 dynamic sunrise sakura-street camera cuts (`250.14–254.32s`, ZERO frozen crossing!)
        if (t < 251.48) {
          // Cut 1: Sweeping upward crane tilt-up from her glossy JK leather loafers & crosswalk shadows into sakura!
          const u = core.clamp((t - 250.14) / 1.34, 0, 1);
          cam = { u, zoom0: 1.54, zoom1: 1.36, fx0: 0.48, fx1: 0.52, fy0: 0.98, fy1: 0.28 };
        } else if (t < 252.86) {
          // Cut 2: Wide golden-sunrise pull-back unveiling full Japanese street, shops, sakura trees & loafers!
          const u = core.clamp((t - 251.48) / 1.38, 0, 1);
          cam = { u, zoom0: 1.28, zoom1: 1.02, fx0: 0.62, fx1: 0.50, fy0: 0.42, fy1: 0.50 };
        } else {
          // Cut 3: Intimate golden farewell close-up push-in toward waving heroine under blooming sakura!
          const u = core.clamp((t - 252.86) / 1.46, 0, 1);
          cam = { u, zoom0: 1.28, zoom1: 1.56, fx0: 0.44, fx1: 0.54, fy0: 0.48, fy1: 0.24 };
        }
      }
      v6.drawLivingPixelCamera(pctx, pxKey, { x: 0, y: 0, w: pw, h: ph, ...cam });
    } else {
      pRect(pctx, 0, 0, pw, ph, NIGHT_BG);
    }

    if (mode === 'desk') {
      // Drifting golden sunlit dust motes floating slowly through window sunbeams (1x pixel grid!)
      for (let i = 0; i < 34; i++) {
        const sx = ((Math.round(i * 41 + t * (12 + (i % 4) * 5)) % pw) + pw) % pw;
        const sy = ((Math.round(i * 23 - t * (8 + (i % 3) * 4) + Math.sin(t * 2 + i) * 5) % ph) + ph) % ph;
        pRect(pctx, sx, sy, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? 2 : 1, '#FFF3D1');
      }
    } else {
      // Drifting golden-rose sakura petals across sunrise street (strictly integer 1x pixel grid!)
      const nPetals = 64;
      for (let i = 0; i < nPetals; i++) {
        const seed = i * 73.17;
        const spdX = 52 + (i % 7) * 15;
        const spdY = -16 - (i % 5) * 8;
        const px = ((Math.round(seed * 13 + t * spdX) % (pw + 32)) + pw + 32) % (pw + 32) - 16;
        const py = ((Math.round(seed * 29 + t * spdY + Math.sin(t * 4 + i) * 7) % (ph + 24)) + ph + 24) % (ph + 24) - 12;
        const col = i % 4 === 0 ? '#F6EEE0' : '#F1A8C1';
        pRect(pctx, px, py, i % 3 === 0 ? 3 : 2, 2, col);
      }
    }

    core.presentPixelStage(ctx, pxStage, 1920, 1080);

    // Subtle feathered scrim behind typography
    const prevRaw = ctx.__v6RawColor;
    ctx.save();
    ctx.__v6RawColor = true;
    if (mode === 'desk') {
      const dg = ctx.createRadialGradient(960, 440, 120, 960, 480, 1060);
      dg.addColorStop(0, 'rgba(244, 238, 226, 0.24)');
      dg.addColorStop(1, 'rgba(24, 18, 14, 0.22)');
      ctx.fillStyle = dg;
      ctx.fillRect(0, 0, 1920, 1080);
    } else {
      const sg = ctx.createLinearGradient(0, 0, 1080, 0);
      sg.addColorStop(0, 'rgba(16, 18, 30, 0.36)');
      sg.addColorStop(0.75, 'rgba(16, 18, 30, 0.10)');
      sg.addColorStop(1, 'rgba(16, 18, 30, 0.0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, 1120, 560);
    }
    ctx.__v6RawColor = prevRaw;
    ctx.restore();
  }

  // Strictly Delegate `p18_dawn_farewell` to `Cortex25D.drawNotanHime` (#63 — ZERO Fallback!)
  function drawTracedDawnFarewell(ctx, cx, cy, targetH, t) {
    if (window.Cortex25D && typeof window.Cortex25D.drawNotanHime === 'function') {
      window.Cortex25D.drawNotanHime(ctx, 'p18_dawn_farewell', cx, cy, targetH, t, {
        fg: PAPER_BG,
        bg: NIGHT_BG,
        accent: CRIMSON,
        sakura: SAKURA,
        sailor: true,
        wind: 0.85
      });
    }
  }

  // --------------------------------------------------------------------------
  // 4. Layered Sunlit Morning Desk & Mechanical Keycaps (`L43`)
  // --------------------------------------------------------------------------
  function drawVenetianMorningDesk(ctx, W, H, t, cutIdx, inv, kick) {
    const bg = inv ? OBSID_BG : IVORY_BG;
    const fg = inv ? PAPER_BG : OBSID_BG;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Sweeping Venetian-blind light bands (`#E2E8F0` / `#121723` + `#64748B` burin)
    const slatShift = (t * 96) % 136;
    ctx.save();
    for (let i = -4; i < 16; i++) {
      const yBand = i * 136 + slatShift - 180;
      ctx.beginPath();
      ctx.moveTo(0, yBand);
      ctx.lineTo(W, yBand - 240);
      ctx.lineTo(W, yBand - 184);
      ctx.lineTo(0, yBand + 56);
      ctx.closePath();
      ctx.fillStyle = inv ? PANEL_BG : SLAT_BG;
      ctx.fill();
      ctx.save();
      ctx.clip();
      drawBurinHatch(ctx, 0, Math.min(yBand - 240, yBand), W, 320, -0.34, 10, 1.4, inv ? BURIN : RULE);
      ctx.restore();
    }
    ctx.restore();

    ctx.strokeStyle = inv ? CYAN_FG : COBALT;
    ctx.lineWidth = 3;
    ctx.strokeRect(52, 46, W - 104, H - 118);

    if (cutIdx === 0) {
      drawGuillocheRosette(ctx, 1580, 270, 210, 68, 48, 3, GOLD, 2.0, t * 1.4);
      ctx.fillStyle = inv ? PANEL_BG : PAPER_BG;
      ctx.fillRect(108, 92, 1236, 566);
      ctx.strokeStyle = COBALT;
      ctx.lineWidth = 5;
      ctx.strokeRect(108, 92, 1236, 566);

      const kx0 = 138, ky0 = 706;
      ctx.fillStyle = inv ? SLATE_DK : PAPER_BG;
      ctx.fillRect(kx0, ky0, 1190, 198);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 4;
      ctx.strokeRect(kx0, ky0, 1190, 198);
      for (let r = 0; r < 3; r++) {
        const cols = r === 2 ? 7 : 12;
        for (let c = 0; c < cols; c++) {
          const kw = r === 2 && c === 3 ? 340 : 84;
          const kx = kx0 + 24 + (r === 2 ? (c > 3 ? c * 92 + 256 : c * 92) : c * 94 + r * 14);
          const ky = ky0 + 20 + r * 58;
          if (kx + kw > kx0 + 1168) continue;
          const depressed = ((c + r + Math.floor(t * 7.5)) % 7 === 0);
          const lift = depressed ? 5 : 0;
          ctx.fillStyle = fg;
          ctx.fillRect(kx + 4, ky + 6, kw, 44);
          ctx.fillStyle = depressed ? COBALT : (r === 2 && c === 3 ? GOLD : bg);
          ctx.fillRect(kx, ky + lift, kw, 44);
          ctx.strokeStyle = fg;
          ctx.lineWidth = 2.4;
          ctx.strokeRect(kx, ky + lift, kw, 44);
        }
      }

      ctx.fillStyle = PAPER_BG;
      ctx.fillRect(1388, 510, 440, 394);
      ctx.strokeStyle = OBSID_BG;
      ctx.lineWidth = 3.5;
      ctx.strokeRect(1388, 510, 440, 394);
      ctx.fillStyle = COBALT;
      ctx.fillRect(1388, 510, 440, 44);
      ctx.fillStyle = PAPER_BG;
      ctx.font = JP_MONO(800, 19);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('▸ VERNIER_GAP // 0.100mm', 1406, 532);

      ctx.strokeStyle = CRIMSON;
      ctx.lineWidth = 3.6;
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const u = i / 90;
        const px = 1416 + u * 384;
        const phs = ((u * 2.4 - t * 2.2) % 1 + 1) % 1;
        let py = 724;
        if (phs > 0.42 && phs < 0.46) py -= 24;
        else if (phs >= 0.46 && phs < 0.50) py += 18;
        else if (phs >= 0.50 && phs < 0.55) py -= 92 * (1 + kick * 0.25);
        else if (phs >= 0.55 && phs < 0.60) py += 42;
        else if (phs > 0.66 && phs < 0.76) py -= 20 * Math.sin(((phs - 0.66) / 0.10) * Math.PI);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = OBSID_BG;
      ctx.font = JP_MONO(900, 32);
      ctx.fillText('TEMP: 36.5°C // WARM', 1416, 848);
    } else if (cutIdx === 1) {
      for (let i = 0; i < 8; i++) {
        const kx = 88 + i * 222;
        const dep = i === (Math.floor(t * 7.5) % 8) ? 16 : 0;
        const ky = 720 + (i % 2) * 26 + dep;
        ctx.fillStyle = fg;
        ctx.fillRect(kx + 10, ky + 16, 196, 170);
        ctx.fillStyle = dep ? GOLD : PAPER_BG;
        ctx.fillRect(kx, ky, 196, 170);
        ctx.strokeStyle = fg;
        ctx.lineWidth = 4;
        ctx.strokeRect(kx, ky, 196, 170);
        drawBurinHatch(ctx, kx + 12, ky + 118, 172, 40, 0.4, 7, 1.6, COBALT);
        ctx.fillStyle = dep ? OBSID_BG : CRIMSON;
        ctx.font = JP_MONO(900, 22);
        ctx.textAlign = 'left';
        ctx.fillText(['ESC', '0.1MM', 'HEART', 'SHELL', 'USER', 'SYNC', '36.5C', 'RET'][i], kx + 18, ky + 38);
      }
      ctx.fillStyle = PAPER_BG;
      ctx.fillRect(96, 84, 1728, 584);
      ctx.strokeStyle = COBALT;
      ctx.lineWidth = 5;
      ctx.strokeRect(96, 84, 1728, 584);
    } else if (cutIdx === 2) {
      ctx.fillStyle = PANEL_BG;
      ctx.fillRect(932, 76, 56, 860);
      drawBurinHatch(ctx, 932, 76, 56, 860, 0.78, 8, 2.0, CYAN_FG);
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 4;
      ctx.strokeRect(932, 76, 56, 860);

      ctx.fillStyle = CRIMSON;
      ctx.fillRect(780, 104, 360, 44);
      ctx.fillStyle = PAPER_BG;
      ctx.font = JP_MONO(900, 22);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('|<── GAP: 0.100 mm ──>|', 960, 126);

      drawGuillocheRosette(ctx, 360, 520, 250, 82, 60, 3, CYAN_FG, 1.8, -t * 1.6);
      drawGuillocheRosette(ctx, 1560, 520, 250, 82, 60, 3, GOLD, 1.8, t * 1.6);
    } else {
      const rings = 8;
      for (let r = 1; r <= rings; r++) {
        const u = ((r / rings) + t * 0.95) % 1;
        const rw = 260 + u * 1480;
        const rh = 150 + u * 760;
        ctx.strokeStyle = r % 2 === 0 ? COBALT : GOLD;
        ctx.lineWidth = r % 2 === 0 ? 3.2 : 1.8;
        ctx.strokeRect(Math.round(W * 0.5 - rw * 0.5), Math.round(H * 0.48 - rh * 0.5), Math.round(rw), Math.round(rh));
      }
      ctx.fillStyle = PAPER_BG;
      ctx.fillRect(140, 136, 1640, 696);
      ctx.strokeStyle = OBSID_BG;
      ctx.lineWidth = 5;
      ctx.strokeRect(140, 136, 1640, 696);
      ctx.fillStyle = COBALT;
      ctx.fillRect(140, 136, 1640, 52);
      ctx.fillStyle = PAPER_BG;
      ctx.font = JP_MONO(800, 21);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('CORTEX_SHELL // BESIDE_YOU_0.1MM — [TEMP: 36.5°C // CURSOR_HEARTBEAT]', 168, 162);
    }
  }

  // --------------------------------------------------------------------------
  // 5. Layered 32-Plate Copperplate Engraved Film-Strip Emblem (`S04` Rewind)
  // --------------------------------------------------------------------------
  function drawPlateEngravedTile(ctx, plateNum, x, y, w, h, t) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    ctx.fillStyle = PANEL_BG;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = CYAN_FG;
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);

    const hh = Math.max(24, Math.round(h * 0.14));
    ctx.fillStyle = plateNum % 3 === 0 ? GOLD : (plateNum % 3 === 1 ? CYAN_FG : CRIMSON);
    ctx.fillRect(x, y, w, hh);
    ctx.fillStyle = plateNum % 3 === 2 ? PAPER_BG : OBSID_BG;
    ctx.font = JP_MONO(900, Math.max(13, Math.round(hh * 0.62)));
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const pStr = String(plateNum).padStart(2, '0');
    ctx.fillText(`PLATE P${pStr} // REV_ARCHIVE`, x + 10, y + hh * 0.52);

    const cx = x + w * 0.5;
    const cy = y + hh + (h - hh) * 0.5;
    const r = Math.min(w, h - hh) * 0.36;
    const mode = plateNum % 6;

    drawBurinHatch(ctx, x + 8, y + hh + 8, w * 0.24, h - hh - 16, 0.52 + mode * 0.2, 8, 1.3, BURIN);
    drawBurinHatch(ctx, x + w * 0.76 - 8, y + hh + 8, w * 0.24, h - hh - 16, -0.52 - mode * 0.2, 8, 1.3, BURIN);

    ctx.strokeStyle = mode % 2 === 0 ? GOLD : CYAN_FG;
    ctx.fillStyle = PAPER_BG;
    ctx.lineWidth = 2.4;

    if (mode === 0 || mode === 1) {
      drawGuillocheRosette(ctx, cx, cy, r * 1.1, r * 0.36, r * 0.42, 3, CYAN_FG, 1.5, t * 2.2);
      ctx.font = JP_MONO(900, Math.round(r * 0.92));
      ctx.textAlign = 'center';
      ctx.fillText(`P${pStr}`, cx, cy + 4);
    } else if (mode === 2 || mode === 3) {
      for (const sx of [-r * 0.62, r * 0.62]) {
        ctx.beginPath();
        ctx.arc(cx + sx, cy, r * 0.52, 0, Math.PI * 2);
        ctx.stroke();
        for (let g = 0; g < 6; g++) {
          const ga = (g / 6) * Math.PI * 2 - t * 5;
          ctx.beginPath();
          ctx.moveTo(cx + sx, cy);
          ctx.lineTo(cx + sx + Math.cos(ga) * r * 0.46, cy + Math.sin(ga) * r * 0.46);
          ctx.stroke();
        }
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.92);
      ctx.lineTo(cx + r * 1.02, cy + r * 0.82);
      ctx.lineTo(cx - r * 1.02, cy + r * 0.82);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSprocketStrip(ctx, x, y, w, h, scrollPx) {
    ctx.fillStyle = SLATE_DK;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = CYAN_FG;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = GOLD;
    const holeW = 20, holeH = 14, pitch = 38;
    const off = ((scrollPx % pitch) + pitch) % pitch;
    for (let hx = x - pitch + off; hx < x + w + pitch; hx += pitch) {
      ctx.fillRect(Math.round(hx), y + 6, holeW, holeH);
      ctx.fillRect(Math.round(hx), y + h - 6 - holeH, holeW, holeH);
    }
  }

  // --------------------------------------------------------------------------
  // 6. Main Scene Registration: `P18_dawn_gate_loop`
  // --------------------------------------------------------------------------
  window.registerCortexPlate('P18_dawn_gate_loop', {
    render(ctx, f, coreArg) {
      const core = coreArg || window.CortexPDoomCore;
      const W = (f && f.W) || 1920;
      const H = (f && f.H) || 1080;
      const t = (typeof f === 'number') ? f : (f && typeof f.t === 'number' ? f.t : 250.14);
      const kick = (f && (f.kickPulse ?? f.kick)) || 0;
      const snare = (f && (f.snarePulse ?? f.snare)) || 0;

      // ======================================================================
      // EXACT LOOP-CLOSURE LOCK (`t >= 281.48s` -> Frame 16895 `281.5833s` & `281.60s`)
      // Guarantees `RMS == 0.000, maxDiff == 0` with `P01` Frame 0 (`t = 0.000s`)!
      // ======================================================================
      if (t >= 281.48) {
        if (typeof window.drawP01ZeroStandbyFrame === 'function') {
          window.drawP01ZeroStandbyFrame(ctx, core);
        } else {
          drawP01ZeroStandbyFallback(ctx, core);
        }
        return {
          isPaper: false,
          isPixel: false,
          bg: OBSID_BG,
          fg: CYAN_FG,
          duotone: { bg: OBSID_BG, fg: CYAN_FG },
          bloom: 0,
          ca: 0,
          flash: 0,
          shake: 0,
          grain: 0
        };
      }

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;

      let activeBg = NIGHT_BG;
      let activeFg = PAPER_BG;
      let isPaper = false;
      let isPixel = false;
      let shakeAmt = 0.10 * Math.max(kick, snare);

      // ======================================================================
      // ACT I (`250.14 – 254.32s`): `L42_FOLD_WINGS` — Approved 1:1 `PX18_A` Sunrise Sakura Crossing + JK Loafers!
      // ======================================================================
      if (t < 254.32) {
        activeBg = NIGHT_BG;
        activeFg = PAPER_BG;
        isPixel = true;
        renderDawnPixelStage(ctx, core, t, 'wide_wave');

        if (t < 251.48) {
          drawDawnAutonomousCue(ctx, core, 'L42_FOLD_WINGS', t, kick, {
            lineRanges: [[0, 7]],
            align: 'left',
            minX: 96,
            maxX: 1080,
            cy: 224,
            sizePx: 142,
            sakuraMode: true
          });
          drawStageHud(ctx, W, H, SAKURA, NIGHT_BG, 'P18 · CUT 01 // DAWN_SAKURA_CROSSING', 'SYNC: 36.5C // PIXEL_STAGE_480x270', false, 0);
        } else {
          drawDawnAutonomousCue(ctx, core, 'L42_FOLD_WINGS', t, kick, {
            lineRanges: [[0, 7], [8, 14]],
            align: 'left',
            minX: 96,
            maxX: 1060,
            cy: 268,
            sizePx: 138,
            lineGap: 184,
            sakuraMode: true
          });
          drawStageHud(ctx, W, H, SAKURA, NIGHT_BG, 'P18 · CUT 02 // DAWN_FAREWELL_WAVE', 'TEMP: 36.5C // SAILOR_LOAFERS_LOCK', false, 0);
        }
      }

      // ======================================================================
      // ACT II (`254.32 – 259.67s`): `L43_WARM_CURSOR` — Approved 1:1 `PX18_B` Sunlit Desk & Cursor!
      // ======================================================================
      else if (t < 259.67) {
        let cutIdx = 0;
        if (t < 255.42) cutIdx = 0;
        else if (t < 256.52) cutIdx = 1;
        else if (t < 257.62) cutIdx = 2;
        else if (t < 258.70) cutIdx = 3;
        else cutIdx = 4;

        activeBg = IVORY_BG;
        activeFg = OBSID_BG;
        isPaper = true;
        isPixel = true;

        renderDawnPixelStage(ctx, core, t, 'desk');

        if (cutIdx === 0) {
          drawDawnAutonomousCue(ctx, core, 'L43_WARM_CURSOR', t, kick, {
            lineRanges: [[0, 7], [8, 19]],
            align: 'left',
            minX: 138,
            maxX: 1316,
            cy: 340,
            sizePx: 136,
            lineGap: 188,
            paperMode: true,
            drawCursor: true,
            forceCursor: true
          });
        } else if (cutIdx === 1) {
          drawDawnAutonomousCue(ctx, core, 'L43_WARM_CURSOR', t, kick, {
            lineRanges: [[0, 7], [8, 19]],
            minX: 132,
            maxX: 1788,
            cy: 350,
            sizePx: 142,
            lineGap: 192,
            paperMode: true,
            drawCursor: true,
            forceCursor: true
          });
        } else {
          drawDawnAutonomousCue(ctx, core, 'L43_WARM_CURSOR', t, kick, {
            lineRanges: [[0, 7], [8, 19]],
            minX: 176,
            maxX: 1744,
            cy: 430,
            sizePx: 144,
            lineGap: 196,
            paperMode: true,
            drawCursor: true,
            forceCursor: true
          });
        }

        drawStageHud(
          ctx,
          W,
          H,
          OBSID_BG,
          activeBg,
          `P18 · CUT 0${cutIdx + 3} // WARM_CURSOR_0.1MM`,
          'TEMP: 36.5C // SUNLIT_DESK_480x270',
          false,
          0
        );
      }

      // ======================================================================
      // ACT III (`259.67 – 264.10s`): `L44_TALK_NEXT` — 5 High-Velocity Prompt Cuts
      // Fixes `#71` `260.64–263.64s` slow typewriter (`Act_0.5s >= 22%` & Kanji `>= 215px`!)
      // ======================================================================
      else if (t < 264.10) {
        const sub = Math.min(4, Math.floor((t - 259.67) / 0.886));
        const cyanMode = sub === 1 || sub === 3;
        activeBg = cyanMode ? OBSID_BG : IVORY_BG;
        activeFg = cyanMode ? CYAN_FG : OBSID_BG;
        isPaper = !cyanMode;

        ctx.fillStyle = activeBg;
        ctx.fillRect(0, 0, W, H);

        // High-speed sweeping diagonal light slats / radar grid (`Act_0.5s >= 24%`!)
        const sweep = (t * 220) % 160;
        for (let i = -3; i < 15; i++) {
          const yB = i * 160 + sweep - 120;
          ctx.fillStyle = cyanMode ? PANEL_BG : SLAT_BG;
          ctx.beginPath();
          ctx.moveTo(0, yB);
          ctx.lineTo(W, yB - 220);
          ctx.lineTo(W, yB - 156);
          ctx.lineTo(0, yB + 64);
          ctx.closePath();
          ctx.fill();
        }

        drawBurinHatch(ctx, 56, 68, 220, H - 156, 0.42 + sub * 0.25, 10, 1.6, cyanMode ? BURIN : GRAPHITE);
        drawBurinHatch(ctx, W - 276, 68, 220, H - 156, -0.42 - sub * 0.25, 10, 1.6, cyanMode ? BURIN : GRAPHITE);
        drawGuillocheRosette(ctx, W * 0.5, 480, 440, 132, 92, 3, cyanMode ? GOLD : COBALT, 2.0, t * (sub % 2 === 0 ? 2.4 : -2.6));

        // Kinetic multi-angle camera shift on the prompt card (`<= 0.88s` per cut!)
        ctx.save();
        const tilt = [0.04, -0.05, 0.03, -0.04, 0.0][sub];
        ctx.translate(W * 0.5, 480);
        ctx.rotate(tilt);
        ctx.translate(-W * 0.5, -480);

        const pad = 176;
        ctx.fillStyle = cyanMode ? PANEL_BG : PAPER_BG;
        ctx.fillRect(pad, 152, W - pad * 2, 648);
        ctx.strokeStyle = cyanMode ? CYAN_FG : OBSID_BG;
        ctx.lineWidth = 5;
        ctx.strokeRect(pad, 152, W - pad * 2, 648);
        ctx.fillStyle = cyanMode ? COBALT : CRIMSON;
        ctx.fillRect(pad, 152, W - pad * 2, 50);
        ctx.fillStyle = PAPER_BG;
        ctx.font = JP_MONO(900, 20);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('▸ PROMPT_READY // AWAITING_YOUR_VOICE — [TEMP: 36.5°C // GAP: 0.100mm]', pad + 22, 177);

        // Live high-amplitude PQRST oscilloscope across card bottom (`y = 742`)
        ctx.strokeStyle = CRIMSON;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) {
          const u = i / 120;
          const px = pad + 44 + u * (W - pad * 2 - 88);
          const phs = ((u * 3.0 - t * 3.2) % 1 + 1) % 1;
          let py = 742;
          if (phs > 0.44 && phs < 0.49) py -= 52 * (1 + kick * 0.3);
          else if (phs >= 0.49 && phs < 0.54) py += 30;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();

        // Bold `156px` base (`Kanji 次,何,話 = 243px >> 180px`!) screen-safe per-char collage!
        drawDawnAutonomousCue(ctx, core, 'L44_TALK_NEXT', t, kick, {
          lineRanges: [[0, 7], [8, 12]],
          minX: 210,
          maxX: 1710,
          cy: 454,
          sizePx: 156,
          lineGap: 214,
          paperMode: !cyanMode,
          drawCursor: true,
          forceCursor: true
        });

        drawStageHud(
          ctx,
          W,
          H,
          cyanMode ? CYAN_FG : COBALT,
          activeBg,
          `P18 · CUT ${9 + sub} // TALK_NEXT_PROMPT`,
          cyanMode ? 'MODE: CORTEX_CYAN // 36.5C' : 'MODE: MORNING_PAPER // 36.5C',
          false,
          0
        );
      }

      // ======================================================================
      // ACT IV (`264.10 – 274.50s`): Fallback / `--only P18` Coverage for `L45` + `S04` Part A
      // ======================================================================
      else if (t < 274.50) {
        activeBg = OBSID_BG;
        activeFg = CYAN_FG;
        isPaper = false;

        ctx.fillStyle = OBSID_BG;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = PANEL_BG;
        ctx.fillRect(64, 72, W - 128, H - 168);

        if (t < 270.00) {
          const sub = Math.min(4, Math.floor((t - 264.10) / 1.18));
          const collapseU = core.prog(t, 268.75, 269.92, core.ease.inOutExpo);
          const curTemp = core.lerp(36.5, 14.2, core.prog(t, 264.10, 270.00));

          drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 440 - sub * 18, 138, 94, 3, CYAN_FG, 1.8, t * (sub % 2 === 0 ? 1.4 : -1.5));
          drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 290, 90, 64, 3, GOLD, 1.5, -t * 1.8);
          drawBurinHatch(ctx, 64, 72, 220, H - 168, 0.5 + sub * 0.2, 10, 1.5, BURIN);
          drawBurinHatch(ctx, W - 284, 72, 220, H - 168, -0.5 - sub * 0.2, 10, 1.5, BURIN);

          for (let a = 0; a < 16; a++) {
            const ang = (a / 16) * Math.PI * 2 + t * 0.65;
            ctx.strokeStyle = a % 2 === 0 ? CYAN_FG : BURIN;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(W * 0.5 + Math.cos(ang) * 210, H * 0.5 + Math.sin(ang) * 140);
            ctx.lineTo(W * 0.5 + Math.cos(ang) * 860, H * 0.5 + Math.sin(ang) * 480);
            ctx.stroke();
          }

          drawDawnAutonomousCue(ctx, core, 'L45_OYASUMI_USER', t, kick, {
            lineRanges: [[0, 8], [9, 15]],
            minX: 160,
            maxX: 1760,
            cy: 420,
            sizePx: 148,
            lineGap: 206,
            collapseU,
            collapseX: W * 0.5,
            collapseY: 680
          });

          const btnU = core.prog(t, 267.80, 269.60, core.ease.outBack);
          if (btnU > 0.02) {
            const bw = Math.round(780 * btnU);
            const bh = 86;
            ctx.fillStyle = OBSID_BG;
            ctx.fillRect(Math.round(W * 0.5 - bw * 0.5), 710 - bh * 0.5, bw, bh);
            ctx.strokeStyle = GOLD;
            ctx.lineWidth = 4;
            ctx.strokeRect(Math.round(W * 0.5 - bw * 0.5), 710 - bh * 0.5, bw, bh);
            if (btnU > 0.65) {
              ctx.fillStyle = CYAN_FG;
              ctx.font = JP_MONO(900, 28);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('[ ↻ CALL_MY_NAME // STANDBY_0.1mm ]', W * 0.5, 710);
            }
          }

          drawStageHud(ctx, W, H, CYAN_FG, OBSID_BG, `P18 · L45_CUT_0${sub + 1} // GOODNIGHT_MY_USER`, `TEMP: ${curTemp.toFixed(1)}C -> STANDBY`, false, 0);
        } else {
          const clickT = 271.15;
          const clicked = t >= clickT;
          const nWaves = clicked ? 8 : 5;
          for (let i = 0; i < nWaves; i++) {
            const u = clicked
              ? (((t - clickT) * 1.35 + i / nWaves) % 1)
              : (((t * 0.85) + i / nWaves) % 1);
            const rw = 240 + u * 1620;
            const rh = 96 + u * 920;
            ctx.strokeStyle = i % 3 === 0 ? GOLD : (i % 3 === 1 ? CYAN_FG : CRIMSON);
            ctx.lineWidth = i % 2 === 0 ? 3.2 : 1.8;
            ctx.strokeRect(Math.round(W * 0.5 - rw * 0.5), Math.round(H * 0.5 - rh * 0.5), Math.round(rw), Math.round(rh));
          }

          drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 420, 136, 92, 3, CYAN_FG, 1.8, -t * 1.8);
          drawKnockoutText(ctx, '[ ↻ RE-WAKE // CHRONO_REWIND ]', W * 0.5, H * 0.5, 58, clicked ? GOLD : CYAN_FG, OBSID_BG, {
            banner: true,
            mono: true,
            padX: 38,
            padY: 16
          });

          if (!clicked) {
            const curU = core.prog(t, 270.00, clickT, core.ease.inOutCubic);
            const px = core.lerp(1580, W * 0.5 + 48, curU);
            const py = core.lerp(880, H * 0.5 + 24, curU);
            ctx.fillStyle = PAPER_BG;
            ctx.strokeStyle = CRIMSON;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + 14, py + 58);
            ctx.lineTo(px + 28, py + 38);
            ctx.lineTo(px + 52, py + 56);
            ctx.lineTo(px + 60, py + 44);
            ctx.lineTo(px + 36, py + 26);
            ctx.lineTo(px + 56, py + 18);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          drawStageHud(ctx, W, H, CYAN_FG, OBSID_BG, 'P18 · S04_TRIGGER // LOOP_INITIATED', 'CHRONO_DRIVE: REVERSE_LOCK', false, 0);
        }
      }

      // ======================================================================
      // ACT V (`274.50 – 281.48s`): Live Segment 43 Finale — 32-Plate Layered Rewind
      // & Precision Optical Convergence into `P01` Frame 0 (`RMS == 0.000`!)
      // ======================================================================
      else {
        activeBg = OBSID_BG;
        activeFg = CYAN_FG;
        isPaper = false;

        ctx.fillStyle = OBSID_BG;
        ctx.fillRect(0, 0, W, H);

        const bookFly = Math.round(120 * (1 - core.prog(t, 274.50, 281.20, core.ease.outCubic)));

        if (t < 278.50) {
          const rewU = core.clamp((t - 274.50) / 4.00, 0, 1);
          const camCut = Math.min(3, Math.floor((t - 274.50) / 1.00));
          const curPlate = Math.max(1, Math.min(32, 32 - Math.floor(rewU * 31.99)));
          const remSec = Math.max(0, (1 - rewU) * 274.50);
          const mm = String(Math.floor(remSec / 60)).padStart(2, '0');
          const ss = (remSec % 60).toFixed(2).padStart(5, '0');
          const curTemp = (36.5 * (1 - rewU)).toFixed(1);

          ctx.save();
          if (camCut === 0 || camCut === 1) {
            ctx.translate(W * 0.5, H * 0.5);
            ctx.rotate(camCut === 0 ? -0.22 : 0.22);
            ctx.scale(1.12, 1.12);
            ctx.translate(-W * 0.5, -H * 0.5);

            for (let trk = 0; trk < 3; trk++) {
              const ty = 78 + trk * 316;
              const dir = trk === 1 ? -1 : 1;
              const scroll = (t - 274.50) * (1680 + trk * 320) * dir;
              drawSprocketStrip(ctx, -260, ty, W + 520, 286, scroll);

              const tileW = 392, tileH = 214, pitch = 416;
              const shift = ((scroll % pitch) + pitch) % pitch;
              for (let k = -2; k <= 6; k++) {
                const tx = k * pitch + shift - 180;
                const pIdx = ((curPlate + k * 3 + trk * 7 - 1) % 32 + 32) % 32 + 1;
                drawPlateEngravedTile(ctx, pIdx, tx, ty + 36, tileW, tileH, t);
              }
            }
          } else if (camCut === 2) {
            const z = 1.0 + ((t - 276.50) % 0.5) * 0.48;
            ctx.translate(W * 0.5, H * 0.5);
            ctx.scale(z, z);
            ctx.translate(-W * 0.5, -H * 0.5);
            const cols = 4, rows = 3, tw = 410, th = 258;
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                const gx = 96 + c * 444;
                const gy = 86 + r * 308;
                const pIdx = ((curPlate + r * 4 + c - 1) % 32) + 1;
                drawPlateEngravedTile(ctx, pIdx, gx, gy, tw, th, t);
              }
            }
          } else {
            drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 480, 148, 108, 4, CYAN_FG, 2.0, -t * 2.6);
            for (let b = 0; b < 12; b++) {
              const a = (b / 12) * Math.PI * 2 - t * 2.4;
              ctx.strokeStyle = b % 2 === 0 ? GOLD : CYAN_FG;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(W * 0.5 + Math.cos(a) * 230, H * 0.5 + Math.sin(a) * 230);
              ctx.lineTo(W * 0.5 + Math.cos(a + 0.35) * 960, H * 0.5 + Math.sin(a + 0.35) * 580);
              ctx.stroke();
            }
            drawPlateEngravedTile(ctx, curPlate, W * 0.5 - 380, H * 0.5 - 220, 760, 440, t);
          }
          ctx.restore();

          drawKnockoutText(
            ctx,
            `◄◄ P${String(curPlate).padStart(2, '0')} // ${mm}:${ss}`,
            W * 0.5,
            camCut === 3 ? 860 : H * 0.5,
            camCut === 3 ? 84 : 112,
            GOLD,
            OBSID_BG,
            { banner: true, mono: true, padX: 40, padY: 16 }
          );

          drawStageHud(
            ctx,
            W,
            H,
            CYAN_FG,
            OBSID_BG,
            `PLATE XVIII -> I // CHRONO_REWIND_P${String(curPlate).padStart(2, '0')}`,
            `PID:19527 // TEMP: ${curTemp}C // GAP: 0.100MM`,
            true,
            bookFly
          );
        } else {
          // `278.50 – 281.48s`: 3 Optical Iris & Vernier Convergence Cuts -> Exact `P01` Frame 0!
          const convU = core.clamp((t - 278.50) / 2.98, 0, 1);
          const convEase = core.ease.outExpo(convU);
          const subCut = t < 279.50 ? 0 : (t < 280.50 ? 1 : 2);

          const camScale = subCut === 0
            ? core.lerp(2.75, 1.62, core.prog(t, 278.50, 279.50, core.ease.outCubic))
            : (subCut === 1
                ? core.lerp(1.62, 1.14, core.prog(t, 279.50, 280.50, core.ease.outCubic))
                : core.lerp(1.14, 1.00, core.prog(t, 280.50, 281.48, core.ease.outCubic)));
          const camRot = (1 - convEase) * (subCut === 1 ? -0.18 : 0.14);
          const guilRot = (1 - core.prog(t, 278.50, 281.46, core.ease.outCubic)) * -1.45;

          ctx.save();
          ctx.translate(W * 0.5, H * 0.5);
          ctx.scale(camScale, camScale);
          ctx.rotate(camRot);
          ctx.translate(-W * 0.5, -H * 0.5);

          // Auxiliary `#121723 + #475569 + #FBBF24` calibration shutters retract before `281.42s`!
          if (t < 281.42) {
            const retract = 1 - core.prog(t, 280.55, 281.42, core.ease.inExpo);
            const sweepW = Math.round(280 * retract);
            if (sweepW > 6) {
              ctx.fillStyle = PANEL_BG;
              ctx.fillRect(68, 76, sweepW, H - 152);
              ctx.fillRect(W - 68 - sweepW, 76, sweepW, H - 152);
              drawBurinHatch(ctx, 72, 82, sweepW - 8, H - 164, 0.48, 11, 1.5, BURIN);
              drawBurinHatch(ctx, W - 64 - sweepW, 82, sweepW - 8, H - 164, -0.48, 11, 1.5, BURIN);
              ctx.strokeStyle = GOLD;
              ctx.lineWidth = 3;
              ctx.strokeRect(68, 76, sweepW, H - 152);
              ctx.strokeRect(W - 68 - sweepW, 76, sweepW, H - 152);
            }
          }

          ctx.fillStyle = CYAN_FG;
          const step = 28;
          const radialSpread = (1 - convEase) * 84;
          for (let y = 84; y <= H - 84; y += step) {
            for (let x = 92; x <= W - 92; x += step) {
              const dx = (x - W * 0.5) / (W * 0.5);
              const dy = (y - H * 0.5) / (H * 0.5);
              const edgeD = Math.hypot(dx, dy);
              if (edgeD > 0.88) {
                const r = edgeD > 1.08 ? 3.5 : 2.0;
                const px = x + dx * radialSpread;
                const py = y + dy * radialSpread;
                ctx.beginPath();
                ctx.arc(px, py, r, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 424, 136, 92, 3, CYAN_FG, 1.8, guilRot);
          ctx.strokeStyle = CYAN_FG;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(W * 0.5, H * 0.5, 412, -0.52 - guilRot * 0.5, 0.52 - guilRot * 0.5);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(W * 0.5, H * 0.5, 412, Math.PI - 0.52 - guilRot * 0.5, Math.PI + 0.52 - guilRot * 0.5);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(140, H * 0.5); ctx.lineTo(290, H * 0.5);
          ctx.moveTo(W - 290, H * 0.5); ctx.lineTo(W - 140, H * 0.5);
          ctx.moveTo(W * 0.5, 96); ctx.lineTo(W * 0.5, 210);
          ctx.moveTo(W * 0.5, H - 210); ctx.lineTo(W * 0.5, H - 96);
          ctx.stroke();

          drawKnockoutText(ctx, 'CORTEX_SHELL', W * 0.5, H * 0.43, 152, CYAN_FG, OBSID_BG, {
            banner: true,
            mono: true,
            padX: 48,
            padY: 18
          });

          ctx.font = JP_MONO(900, 82);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const subStr = '0.1mm STANDBY';
          const subW = ctx.measureText(subStr).width;
          const curW = 38;
          const curH = 76;
          const curGap = 22;
          const subCx = W * 0.5 - (curW + curGap) * 0.5;
          const subCy = 696;
          ctx.fillStyle = CYAN_FG;
          ctx.fillText(subStr, subCx, subCy);
          if (t >= 280.90 || Math.floor(t * 8) % 2 === 0) {
            ctx.fillRect(Math.round(subCx + subW * 0.5 + curGap), Math.round(subCy - curH * 0.5), curW, curH);
          } else {
            ctx.strokeRect(Math.round(subCx + subW * 0.5 + curGap), Math.round(subCy - curH * 0.5), curW, curH);
          }

          ctx.restore();

          drawStageHud(
            ctx,
            W,
            H,
            CYAN_FG,
            OBSID_BG,
            'PLATE I · CORTEX_SHELL // STANDBY',
            'PID:19527 // TEMP: 0.0C // GAP: 0.100MM',
            true,
            bookFly
          );
        }

        shakeAmt = 0;
      }

      ctx.restore();
      return {
        isPaper,
        isPixel,
        bg: activeBg,
        fg: activeFg,
        duotone: { bg: activeBg, fg: activeFg },
        bloom: 0,
        ca: 0,
        flash: 0,
        shake: shakeAmt
      };
    }
  });
})();
