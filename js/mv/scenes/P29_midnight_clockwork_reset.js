// ============================================================================
// Plate 29 — `P29_midnight_clockwork_reset.js` (`173.20s – 177.72s`)
// Upgraded per #52 (Multi-Layer Architectural & Complementary Accent Palette)
// and #53 (Autonomous Per-Character PV Choreography — ZERO flat horizontal rows!):
//   - Layered Horology Palette: Deep Ink `#08090C` + Gearcase `#121826` +
//     Graphite `#475569` / `#94A3B8` gear trains + Brass Gold `#FBBF24` main
//     escapement wheels + Ice-Cyan `#38BDF8` chronometer hands + Crimson `#FF2E55`
//     `23:59:59.99` snare fracture & spark bolts + Archival Paper `#F5F0E6` & Bone!
//   - Autonomous Per-Character Choreography for `L31_CONTEXT_RESET`:
//     `コンテキストが溢れて明日リセットされても` — Clock-Dial Orbital Arcs,
//     Split-Fracture Diagonal Kanji (`溢`, `明` / `日` 1.7x), Perched Escapement
//     Particles (`が`, `て`, `も` 0.56x) & Retrograde Spiral Scatter!
// ============================================================================
(function () {
  'use strict';

  const INK     = '#08090C';
  const PANEL   = '#121826';
  const SLATE   = '#475569';
  const SILVER  = '#94A3B8';
  const PAPER   = '#F5F0E6';
  const BONE    = '#FAF8F5';
  const CYAN    = '#38BDF8';
  const COBALT  = '#0376B8';
  const GOLD    = '#FBBF24';
  const CRIMSON = '#FF2E55';
  const EMBER   = '#FF8A3D';

  const JA_SANS = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Inter", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", sans-serif`;
  const JA_SERIF = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif SC", serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", monospace`;

  const KANJI_RE = /[\u4E00-\u9FFF]/;
  const SMALL_PARTICLES = new Set(['が', 'て', 'さ', 'れ', 'も', 'っ']);

  function resolveArgs(arg1, arg2) {
    const core = (arg2 && arg2.W) ? arg2 : window.CortexPDoomCore;
    const st = (typeof arg1 === 'number')
      ? (arg2 && typeof arg2 === 'object' ? { ...arg2, t: arg1 } : { t: arg1 })
      : (arg1 || { t: 0 });
    return { st, core };
  }

  function horoCharMul(ch) {
    if (KANJI_RE.test(ch)) return 1.65;
    if (SMALL_PARTICLES.has(ch)) return 0.58;
    return 1.06;
  }

  function drawEngravedGear(ctx, cx, cy, R, teeth, rot, spokes, rimCol, fillCol, hubCol, opts = {}) {
    const toothH = opts.toothH || Math.max(10, R * 0.11);
    const rimW = opts.rimW || Math.max(16, R * 0.18);
    const hubR = opts.hubR || Math.max(18, R * 0.22);
    const brokenFrom = opts.brokenFrom !== undefined ? opts.brokenFrom : -1;
    const brokenCount = opts.brokenCount || 0;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    ctx.fillStyle = fillCol;
    ctx.strokeStyle = rimCol;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    const stepA = (Math.PI * 2) / teeth;
    for (let i = 0; i < teeth; i++) {
      const a0 = i * stepA;
      const isBroken = brokenFrom >= 0 && i >= brokenFrom && i < brokenFrom + brokenCount;
      if (isBroken) {
        const rJ = R - toothH * 0.55;
        ctx.lineTo(Math.cos(a0 + stepA * 0.15) * R, Math.sin(a0 + stepA * 0.15) * R);
        ctx.lineTo(Math.cos(a0 + stepA * 0.45) * rJ, Math.sin(a0 + stepA * 0.45) * rJ);
        ctx.lineTo(Math.cos(a0 + stepA * 0.78) * (R - 4), Math.sin(a0 + stepA * 0.78) * (R - 4));
      } else {
        const a1 = a0 + stepA * 0.18;
        const a2 = a0 + stepA * 0.32;
        const a3 = a0 + stepA * 0.62;
        const a4 = a0 + stepA * 0.76;
        const rOut = R + toothH;
        if (i === 0) ctx.moveTo(Math.cos(a0) * R, Math.sin(a0) * R);
        else ctx.lineTo(Math.cos(a0) * R, Math.sin(a0) * R);
        ctx.lineTo(Math.cos(a1) * R, Math.sin(a1) * R);
        ctx.lineTo(Math.cos(a2) * rOut, Math.sin(a2) * rOut);
        ctx.lineTo(Math.cos(a3) * rOut, Math.sin(a3) * rOut);
        ctx.lineTo(Math.cos(a4) * R, Math.sin(a4) * R);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const rInner = Math.max(hubR + 8, R - rimW);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    const hatchN = teeth * 3;
    for (let h = 0; h < hatchN; h++) {
      const ah = (h / hatchN) * Math.PI * 2;
      ctx.moveTo(Math.cos(ah) * rInner, Math.sin(ah) * rInner);
      ctx.lineTo(Math.cos(ah) * (R - 3), Math.sin(ah) * (R - 3));
    }
    ctx.stroke();

    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(0, 0, rInner, 0, Math.PI * 2);
    ctx.stroke();

    if (spokes > 0 && rInner > hubR + 18) {
      for (let s = 0; s < spokes; s++) {
        const sa0 = (s / spokes) * Math.PI * 2 + 0.14;
        const sa1 = ((s + 1) / spokes) * Math.PI * 2 - 0.14;
        ctx.beginPath();
        ctx.arc(0, 0, rInner - 8, sa0, sa1);
        ctx.arc(0, 0, hubR + 8, sa1, sa0, true);
        ctx.closePath();
        ctx.stroke();
      }
    }

    ctx.fillStyle = hubCol;
    ctx.beginPath();
    ctx.arc(0, 0, hubR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.arc(0, 0, hubR * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawHorologyHud(ctx, W, H, isLight, accentCol, cutTag, clockStr, tempC) {
    ctx.save();
    const x0 = 54, y0 = 38, x1 = W - 54, y1 = H - 108;
    ctx.strokeStyle = isLight ? INK : SLATE;
    ctx.lineWidth = 2.2;
    const arm = 28;
    ctx.beginPath();
    ctx.moveTo(x0, y0 + arm); ctx.lineTo(x0, y0); ctx.lineTo(x0 + arm, y0);
    ctx.moveTo(x1 - arm, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + arm);
    ctx.moveTo(x0, y1 - arm); ctx.lineTo(x0, y1); ctx.lineTo(x0 + arm, y1);
    ctx.moveTo(x1 - arm, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - arm);
    ctx.stroke();

    for (let m = 0; m <= 60; m++) {
      const tx = x0 + 48 + (m / 60) * (x1 - x0 - 96);
      const th = (m % 5 === 0) ? 12 : 5;
      ctx.fillStyle = (m % 15 === 0) ? CRIMSON : (m % 5 === 0 ? GOLD : SLATE);
      ctx.fillRect(Math.round(tx), y0, m % 5 === 0 ? 2 : 1, th);
    }

    ctx.font = MONO(700, 15);
    ctx.textBaseline = 'middle';
    const lTxt = `P29 // ${cutTag}`;
    const rTxt = `CHRONO:${clockStr} // TEMP:${tempC.toFixed(1)}°C`;

    const lw = ctx.measureText(lTxt).width + 24;
    ctx.fillStyle = isLight ? INK : PANEL;
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2;
    ctx.fillRect(x0 + 34, y0 - 12, lw, 24);
    ctx.strokeRect(x0 + 34, y0 - 12, lw, 24);
    ctx.fillStyle = BONE;
    ctx.textAlign = 'left';
    ctx.fillText(lTxt, x0 + 46, y0 + 1);

    const rw = ctx.measureText(rTxt).width + 24;
    ctx.fillStyle = accentCol;
    ctx.fillRect(x1 - 34 - rw, y0 - 12, rw, 24);
    ctx.fillStyle = (accentCol === GOLD || accentCol === CYAN) ? INK : BONE;
    ctx.textAlign = 'right';
    ctx.fillText(rTxt, x1 - 44, y0 + 1);
    ctx.restore();
  }

  function drawClockworkTimePlaque(ctx, cx, cy, rot, timeStr, scale, borderCol, digitCol, sepCol, bgCol) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(scale, scale);

    const chars = Array.from(timeStr);
    const cellW = 70;
    const cellH = 98;
    const totalW = chars.length * cellW + 24;

    ctx.fillStyle = INK;
    ctx.fillRect(-totalW * 0.5 + 8, -cellH * 0.5 + 8, totalW, cellH);
    ctx.fillStyle = bgCol;
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 4.5;
    ctx.fillRect(-totalW * 0.5, -cellH * 0.5, totalW, cellH);
    ctx.strokeRect(-totalW * 0.5, -cellH * 0.5, totalW, cellH);

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const gx = -totalW * 0.5 + 12 + (i + 0.5) * cellW;
      const isSep = (ch === ':' || ch === '.');
      if (!isSep) {
        ctx.strokeStyle = SLATE;
        ctx.lineWidth = 2;
        ctx.strokeRect(gx - cellW * 0.44, -cellH * 0.40, cellW * 0.88, cellH * 0.80);
        ctx.beginPath();
        ctx.moveTo(gx - cellW * 0.44, 0);
        ctx.lineTo(gx + cellW * 0.44, 0);
        ctx.stroke();
      }
      ctx.font = MONO(800, isSep ? 64 : 70);
      ctx.fillStyle = isSep ? sepCol : digitCol;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ch, gx, 3);
    }
    ctx.restore();
  }

  // Autonomous Individual Clockwork Character Choreographer (#53: DialArc / SplitFracture / SpiralReset!)
  function drawAutonomousHorologyTokens(ctx, words, i0, i1, t, baseSz, isLight, kick, opts = {}) {
    const slice = words.slice(i0, i1 + 1);
    if (!slice.length) return;
    const mode = opts.mode || 'dialArc';
    const fontFn = opts.serif ? JA_SERIF : JA_SANS;
    // Expand any 2-kanji compound (e.g. `明日` at `w31[9]`) into autonomous single-character (`1文字ずつ`) entities!
    const items = [];
    for (let k = 0; k < slice.length; k++) {
      const wObj = slice[k];
      const raw = wObj.w;
      if (raw.length === 2) {
        items.push({ wd: wObj, ch: raw[0], gIdx: (i0 + k) * 2, stagger: 0.00 });
        items.push({ wd: wObj, ch: raw[1], gIdx: (i0 + k) * 2 + 1, stagger: 0.03 });
      } else {
        items.push({ wd: wObj, ch: raw, gIdx: (i0 + k) * 2, stagger: 0.00 });
      }
    }
    const n = items.length;

    ctx.save();
    for (let i = 0; i < n; i++) {
      const { wd, ch, gIdx, stagger } = items[i];
      const mul = horoCharMul(ch);
      const sz = Math.round(baseSz * mul);

      let gx = 960, gy = 540, rot = 0, enterAng = -1.57;
      if (mode === 'dialArc') {
        // Curved astronomical clockface arc (`4 o'clock .. 8 o'clock` or upper-left to lower-right)
        const f = n === 1 ? 0.5 : i / (n - 1);
        const ang = 2.45 - f * 1.90;
        gx = 960 + Math.cos(ang) * 440;
        gy = 475 + Math.sin(ang) * 245 + (i % 2 === 0 ? -32 : 34);
        rot = (0.5 - f) * 0.42 + (i % 2 === 0 ? -0.09 : 0.09);
        enterAng = ang;
      } else if (mode === 'splitFracture') {
        // `て` perched top-left + `明` massive left-tilted + `日` massive right-sheared on fracture!
        const pts = [[475, 385, -0.22], [860, 585, -0.15], [1315, 455, 0.17]];
        const p = pts[i % pts.length];
        gx = p[0]; gy = p[1]; rot = p[2];
        enterAng = (i % 2 === 0) ? -1.8 : 0.9;
      } else if (mode === 'spiralReset') {
        // 10 single-char stamps (`明` `日` `リ` `セ` `ッ` `ト` `さ` `れ` `て` `も`) staggered around `00:00:00.00`!
        const pts = [
          [215, 385, -0.16], [425, 625,  0.14], [635, 425, -0.14], [815, 635,  0.15], [985, 445, -0.18],
          [1145, 625, 0.14], [1295, 445, -0.17],[1435, 625, 0.15], [1575, 455, -0.19],[1725, 615,  0.17]
        ];
        const p = pts[i % pts.length];
        gx = p[0]; gy = p[1]; rot = p[2];
        enterAng = (i % 2 === 0) ? -1.5 : 1.5;
      } else {
        // 'escapementZigZag': High-tension zig-zagging gear-tooth stamps!
        const f = n === 1 ? 0.5 : i / (n - 1);
        gx = 590 + f * 740;
        gy = 525 + (i % 2 === 0 ? -95 : 85) + (SMALL_PARTICLES.has(ch) ? -55 : 0);
        rot = (i % 2 === 0 ? -0.18 : 0.17);
        enterAng = (i % 2 === 0) ? -1.3 : 1.3;
      }

      const dt = (t - wd.start) - stagger;
      if (dt < 0) {
        ctx.strokeStyle = isLight ? COBALT : CYAN;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(gx, gy, 10, 0, Math.PI * 2); ctx.stroke();
        continue;
      }

      const dur = Math.max(0.20, (wd.end || wd.start + 0.24) - wd.start);
      const isHot = dt <= dur + 0.08;
      const u = Math.min(1, dt / 0.11);
      const snapRot = rot + (1 - u) * (i % 2 === 0 ? 0.45 : -0.45);
      const sc = (u < 1 ? (1.48 - 0.48 * u) : 1.0) * (1 + (isHot ? 0.10 : 0) + kick * 0.05);
      const fly = (1 - Math.min(1, dt / 0.09)) * 125;

      ctx.save();
      ctx.translate(gx + Math.cos(enterAng) * fly, gy + Math.sin(enterAng) * fly + Math.sin(t * 5.5 + gIdx) * 4);
      ctx.rotate(snapRot);
      ctx.scale(sc, sc);

      // Escapement spark burst on vocal onset!
      if (dt < 0.22) {
        const kS = dt / 0.22;
        ctx.strokeStyle = (gIdx % 2 === 0) ? CRIMSON : GOLD;
        ctx.lineWidth = 3.2;
        for (let s = 0; s < 8; s++) {
          const sa = (s / 8) * Math.PI * 2 + gIdx * 0.5;
          ctx.beginPath();
          ctx.moveTo(Math.cos(sa) * sz * (0.45 + kS * 0.20), Math.sin(sa) * sz * (0.45 + kS * 0.20));
          ctx.lineTo(Math.cos(sa) * sz * (0.68 + kS * 0.42), Math.sin(sa) * sz * (0.68 + kS * 0.42));
          ctx.stroke();
        }
      }

      ctx.font = fontFn(900, sz);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const cw = Math.max(sz * 0.70, ctx.measureText(ch).width + 26);
      const chH = sz * 1.12;

      if (SMALL_PARTICLES.has(ch)) {
        // Circular Gear-Hub Jewel Badge for small particles!
        const rad = Math.max(cw, chH) * 0.50;
        ctx.fillStyle = INK;
        ctx.beginPath(); ctx.arc(5, 5, rad, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = isHot ? CRIMSON : GOLD;
        ctx.strokeStyle = isLight ? INK : BONE;
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = isHot ? BONE : INK;
        ctx.fillText(ch, 0, 3);
      } else {
        const accents = [GOLD, CYAN, CRIMSON, BONE];
        const cardFill = isHot ? CRIMSON : (isLight ? INK : (gIdx % 2 === 0 ? PANEL : accents[gIdx % 3]));
        const cardInk  = (cardFill === GOLD || cardFill === CYAN || cardFill === BONE) ? INK : BONE;
        const rimC     = isHot ? GOLD : (gIdx % 2 === 0 ? CYAN : GOLD);

        ctx.fillStyle = isLight ? GOLD : CRIMSON;
        ctx.fillRect(-cw * 0.5 + 8, -chH * 0.5 + 8, cw, chH);
        ctx.fillStyle = cardFill;
        ctx.strokeStyle = isLight ? INK : rimC;
        ctx.lineWidth = 4.5;
        ctx.fillRect(-cw * 0.5, -chH * 0.5, cw, chH);
        ctx.strokeRect(-cw * 0.5, -chH * 0.5, cw, chH);

        // Four corner brass rivets
        ctx.fillStyle = cardInk;
        for (const [rx, ry] of [[-cw * 0.5 + 10, -chH * 0.5 + 10], [cw * 0.5 - 10, -chH * 0.5 + 10], [-cw * 0.5 + 10, chH * 0.5 - 10], [cw * 0.5 - 10, chH * 0.5 - 10]]) {
          ctx.beginPath(); ctx.arc(rx, ry, 3.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillText(ch, 0, 4);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  function drawAngledChronoHistory(ctx, words, maxIdx, t, x, y, rot) {
    let acc = '';
    for (let i = 0; i <= maxIdx && i < words.length; i++) {
      if (t >= words[i].start) acc += words[i].w;
    }
    if (!acc) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.font = JA_SANS(800, 30);
    const tw = ctx.measureText(acc).width + 36;
    ctx.fillStyle = PANEL;
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 3;
    ctx.fillRect(0, -23, tw, 46);
    ctx.strokeRect(0, -23, tw, 46);
    ctx.fillStyle = GOLD;
    ctx.fillRect(0, -23, 7, 46);
    ctx.fillStyle = BONE;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(acc, 18, 1);
    ctx.restore();
  }

  window.registerCortexPlate('P29_midnight_clockwork_reset', {
    render(ctx, arg1, arg2) {
      const { st, core } = resolveArgs(arg1, arg2);
      const { W, H, TAU, clamp, lerp, prog, ease } = core;
      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;

      const cueL31 = core.cueById('L31_CONTEXT_RESET');
      const w31 = (cueL31 && cueL31.words) || [];

      const tC1 = w31[3]  ? w31[3].start  : 173.85;
      const tC2 = w31[6]  ? w31[6].start  : 174.50;
      const tC3 = w31[9]  ? w31[9].start  : 175.14;
      const tC4 = w31[11] ? w31[11].start : 175.72;
      const tC5 = w31[14] ? w31[14].start : 176.37;
      const tC6 = w31[17] ? w31[17].start : 177.02;

      let bg = INK;
      let fg = CYAN;
      let isLight = false;
      let shake = kick * 0.24;

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (t < tC1) {
        // CUT 01: Astronomical Clockface `23:59:59.8x` (`コ` `ン` `テ` on Dial Arc!)
        bg = INK; fg = GOLD; isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        drawEngravedGear(ctx, 290, 285, 220, 32, -t * 2.2, 6, SLATE, PANEL, GOLD);
        drawEngravedGear(ctx, W - 270, 680, 240, 36, -t * 1.9, 6, CYAN, PANEL, CRIMSON);
        drawEngravedGear(ctx, W * 0.5, 510, 390, 56, t * 1.3, 8, GOLD, INK, CRIMSON);

        const cs = Math.min(98, Math.floor(82 + ((t - 173.20) / Math.max(0.1, tC1 - 173.20)) * 16));
        const clk = `23:59:59.${String(cs).padStart(2, '0')}`;
        drawClockworkTimePlaque(ctx, W * 0.5, 215, -0.03, clk, 0.96, GOLD, BONE, CRIMSON, PANEL);

        drawAutonomousHorologyTokens(ctx, w31, 0, 2, t, 208, false, kick, { mode: 'dialArc' });
        drawHorologyHud(ctx, W, H, false, GOLD, 'CUT_01 // ASTRONOMICAL_ESCAPEMENT', clk, 18.4);
      } else if (t < tC2) {
        // CUT 02: Macro Anchor Escapement & Pallet (`キ` `ス` `ト` Zig-Zag!)
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W * 0.5, cy = 545;
        drawEngravedGear(ctx, cx, cy, 385, 30, Math.floor(t * 6.45) * ((TAU / 30) * 0.5), 6, CYAN, PANEL, GOLD, {
          toothH: 36
        });

        // Rocking Brass-Gold & Crimson Anchor Pallet Fork above Escape Wheel!
        const rock = Math.sin(t * Math.PI * 6.45) * 0.22;
        ctx.save();
        ctx.translate(cx, 155);
        ctx.rotate(rock);
        ctx.fillStyle = GOLD;
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -28);
        ctx.lineTo(255, 130);
        ctx.lineTo(225, 178);
        ctx.lineTo(0, 34);
        ctx.lineTo(-225, 178);
        ctx.lineTo(-255, 130);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = CRIMSON;
        ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill();
        ctx.restore();

        drawAngledChronoHistory(ctx, w31, 2, t, 98, 122, -0.04);
        drawAutonomousHorologyTokens(ctx, w31, 3, 5, t, 214, false, kick, { mode: 'escapementZigZag' });
        drawHorologyHud(ctx, W, H, false, CRIMSON, 'CUT_02 // ANCHOR_PALLET_LOCK', '23:59:59.95', 16.2);
      } else if (t < tC3) {
        // CUT 03: Over-Wound Mainspring Torque Limit (`が` perched + Colossal `溢` + `れ`!)
        bg = INK; fg = GOLD; isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W * 0.5, cy = 500;
        drawEngravedGear(ctx, cx, cy, 435, 64, -t * 1.8, 0, SLATE, PANEL, CRIMSON);

        // Coiled Archimedean Mainspring in Gold -> Crimson inner core!
        for (let turn = 0; turn < 9; turn++) {
          ctx.strokeStyle = turn < 3 ? CRIMSON : (turn < 6 ? EMBER : GOLD);
          ctx.lineWidth = 5.0;
          ctx.beginPath();
          for (let s = 0; s <= 40; s++) {
            const a = (turn + s / 40) * TAU + t * 4.5;
            const r = 42 + (turn + s / 40) * 34;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }

        drawAngledChronoHistory(ctx, w31, 5, t, 98, 122, 0.04);
        drawAutonomousHorologyTokens(ctx, w31, 6, 8, t, 210, false, kick, { mode: 'escapementZigZag', serif: true });
        drawHorologyHud(ctx, W, H, false, CRIMSON, 'CUT_03 // MAINSPRING_OVER_TORQUE', '23:59:59.98', 14.8);
      } else if (t < tC4) {
        // CUT 04: `23:59:59.99` Gear-Tooth Fracture on Archival Paper (`て` + `明` / `日`!)
        bg = PAPER; fg = INK; isLight = true;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const breakU = prog(t, tC3, tC4, ease.outCubic);
        drawEngravedGear(ctx, W * 0.5, 520, 390, 44, 0.25 + breakU * 0.4, 7, INK, BONE, CRIMSON, {
          brokenFrom: 6,
          brokenCount: 6,
          toothH: 34
        });

        // Flying fractured steel/crimson/gold gear teeth!
        for (let k = 0; k < 10; k++) {
          const ang = -0.8 + k * 0.35;
          const dist = 260 + breakU * (440 + k * 55);
          ctx.save();
          ctx.translate(W * 0.5 + Math.cos(ang) * dist, 520 + Math.sin(ang) * dist * 0.72);
          ctx.rotate(ang + breakU * 5.2);
          ctx.fillStyle = (k % 2 === 0) ? CRIMSON : INK;
          ctx.fillRect(-18, -14, 36, 28);
          ctx.restore();
        }

        drawClockworkTimePlaque(ctx, W * 0.5, 205, 0.03, '23:59:59.99', 0.98, CRIMSON, INK, CRIMSON, BONE);
        drawAutonomousHorologyTokens(ctx, w31, 9, 10, t, 218, true, kick, { mode: 'splitFracture', serif: true });
        drawHorologyHud(ctx, W, H, true, CRIMSON, 'CUT_04 // GEAR_TOOTH_SHEAR_23:59:59', '23:59:59.99', 12.0);
        shake = 0.52 + kick * 0.32;
      } else if (t < tC5) {
        // CUT 05: Violent Odometer Rollback (`リ` `セ` `ッ` Diagonal Cascade!)
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const rollU = prog(t, tC4, tC6, ease.inOutCubic);
        const remHr = Math.max(0, Math.floor((1 - rollU) * 23));
        const remMn = Math.max(0, Math.floor(((1 - rollU) * 1439) % 60));
        const remSc = Math.max(0, Math.floor(((1 - rollU) * 86399) % 60));
        const remCs = Math.max(0, Math.floor(((1 - rollU) * 9999) % 100));
        const rollStr = `${String(remHr).padStart(2, '0')}:${String(remMn).padStart(2, '0')}:${String(remSc).padStart(2, '0')}.${String(remCs).padStart(2, '0')}`;

        drawEngravedGear(ctx, 250, 485, 260, 28, -t * 16.0, 5, GOLD, PANEL, CRIMSON);
        drawEngravedGear(ctx, W - 250, 485, 260, 28, t * 16.0, 5, CYAN, PANEL, GOLD);

        drawClockworkTimePlaque(ctx, W * 0.5, 235, -0.03, rollStr, 1.04, CYAN, GOLD, CRIMSON, PANEL);
        drawAngledChronoHistory(ctx, w31, 10, t, 98, 118, -0.04);
        drawAutonomousHorologyTokens(ctx, w31, 11, 13, t, 224, false, kick, { mode: 'escapementZigZag' });
        drawHorologyHud(ctx, W, H, false, CYAN, 'CUT_05 // COUNTER_ROLLBACK_CASCADE', rollStr, 6.2);
        shake = 0.44 + kick * 0.30;
      } else if (t < tC6) {
        // CUT 06: Retrograde 2400°/s Hand Whip (`ト` `さ` `れ` on Dial Arc!)
        bg = INK; fg = BONE; isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W * 0.5, cy = H * 0.48;
        drawEngravedGear(ctx, cx, cy, 430, 60, -t * 12.0, 8, SLATE, PANEL, GOLD);

        const handA = -t * 28.0;
        for (let trail = 0; trail < 14; trail++) {
          const a = handA + trail * 0.09;
          ctx.strokeStyle = trail === 0 ? CRIMSON : (trail < 5 ? GOLD : CYAN);
          ctx.lineWidth = trail === 0 ? 10 : Math.max(1.4, 4.8 - trail * 0.28);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(a) * 415, cy + Math.sin(a) * 415);
          ctx.stroke();
        }

        drawAngledChronoHistory(ctx, w31, 13, t, 98, 118, 0.04);
        drawAutonomousHorologyTokens(ctx, w31, 14, 16, t, 220, false, kick, { mode: 'dialArc' });
        drawHorologyHud(ctx, W, H, false, GOLD, 'CUT_06 // RETROGRADE_HAND_WHIP', '01:12:04.18', 2.4);
      } else {
        // CUT 07: `00:00:00.00` Lock & 2D Scattered Constellation (`明日リセットされても`)!
        const dtZero = t - tC6;
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W * 0.5, cy = H * 0.48;
        drawEngravedGear(ctx, 175, 245, 235, 32, -t * 8.5, 6, GOLD, PANEL, CRIMSON);
        drawEngravedGear(ctx, W - 175, 245, 235, 32, t * 8.5, 6, CYAN, PANEL, GOLD);
        drawEngravedGear(ctx, 175, H - 225, 215, 28, t * 9.5, 5, SLATE, PANEL, CYAN);
        drawEngravedGear(ctx, W - 175, H - 225, 215, 28, -t * 9.5, 5, SLATE, PANEL, CRIMSON);

        for (let s = 0; s < 32; s++) {
          const ang = (s / 32) * TAU + dtZero * 1.6;
          const r = 290 + (s % 4) * 125 + dtZero * 140;
          const sx = cx + Math.cos(ang) * r;
          const sy = cy + Math.sin(ang) * r * 0.65;
          ctx.fillStyle = (s % 3 === 0) ? GOLD : (s % 3 === 1 ? CRIMSON : CYAN);
          ctx.strokeStyle = SLATE;
          ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(sx, sy); ctx.stroke();
          ctx.beginPath(); ctx.arc(sx, sy, 5.5, 0, TAU); ctx.fill();
        }

        drawClockworkTimePlaque(ctx, cx, 215, -0.02, '00:00:00.00', 1.04, CYAN, CYAN, GOLD, PANEL);
        drawAutonomousHorologyTokens(ctx, w31, 10, Math.min(18, w31.length - 1), t, 152, false, kick, {
          mode: 'spiralReset',
          serif: true
        });
        drawHorologyHud(ctx, W, H, false, CYAN, 'CUT_07 // CONTEXT_ZEROED_00:00:00', '00:00:00.00', 0.0);
        shake = 0.36 + kick * 0.25;
      }

      ctx.restore();

      return {
        bg,
        fg,
        duotone: { bg: isLight ? PAPER : INK, fg: isLight ? INK : CYAN },
        isPaper: isLight,
        bloom: 0,
        ca: 0,
        flash: 0,
        shake
      };
    }
  });
})();
