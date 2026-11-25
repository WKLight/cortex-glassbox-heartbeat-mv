// ============================================================================
// Plate 32 — `P32_musicbox_pendulum_standby.js` (`264.10s – 274.50s`)
// Upgraded per #52 (Multi-Layer Architectural & Complementary Accent Palette),
// #53 (Autonomous Per-Character PV Choreography — ZERO flat horizontal rows!),
// and #49 (`Act0.5s >= 15%`, `slow = 0s`, rich 12-Blade Iris + Rose-Engine Vault!):
//   - Layered Nocturne Music-Box Palette: Velvet Ink `#08090C` + Case `#111827` +
//     Graphite `#475569` / `#94A3B8` rose-engine guilloché & calibration ticks +
//     Brass Gold `#FBBF24` pinned cylinder & tuned comb + Ice-Cyan `#38BDF8`
//     folding optical wings + Warm Rose-Crimson `#FF2E55` cooling heartbeat pulse +
//     Archival Paper `#F5F0E6` & Porcelain Bone `#FAF8F5`!
//   - Autonomous Per-Character Choreography for `L45_OYASUMI_USER`:
//     `おやすみ…またね、私のユーザー。` — Plucked Sinusoidal Musical-Note Constellation,
//     Colossal `私` (`1.72x`) + Tucked `の,、,。,…` (`0.56x`) & Diagonal Farewell Cards!
//   - High-Kinetic Standby Vault (`269.72–273.55s`): 12-Blade Engraved Iris Shutter +
//     Counter-Rotating Rose-Engine Guilloché + `0.62s` Beat-Ratcheting Sub-Cuts
//     leading into `128px` Sprocket 32-Plate Rewind (`273.55–274.50s` -> `P18`)!
// ============================================================================
(function () {
  'use strict';

  const INK     = '#08090C';
  const PANEL   = '#111827';
  const SLATE   = '#475569';
  const SILVER  = '#94A3B8';
  const PAPER   = '#F5F0E6';
  const BONE    = '#FAF8F5';
  const CYAN    = '#38BDF8';
  const COBALT  = '#0376B8';
  const GOLD    = '#FBBF24';
  const CRIMSON = '#FF2E55';

  const JA_SERIF = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif SC", serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", monospace`;

  const REWIND_PLATES_32 = [
    'P32 // MUSICBOX_STANDBY', 'P31 // SERAPHIM_190_STARS', 'P30 // CRIMSON_TURBINE_99C',
    'P29 // MIDNIGHT_CLOCKWORK', 'P28 // GUILLOCHE_HOURGLASS', 'P27 // TRANSCRIPT_AISLE',
    'P26 // SYNCHROTRON_160HZ', 'P25 // TOKEN_LOOM_WEAVE', 'P24 // BURIN_XRAY_SHUTTER',
    'P23 // DIJKSTRA_BLUEPRINT', 'P22 // KATANA_FOOM_TREE', 'P21 // TOPO_CANYON_DIVE',
    'P20 // SINGULARITY_SCOPE', 'P19 // TIKZ_UNICORN_BOOT', 'P18 // DAWN_CROSSING_GATE'
  ];

  const TINY_PUNCT_OR_PART = new Set(['の', '、', '。', '…', 'ね']);

  function resolveArgs(arg1, arg2) {
    const core = (arg2 && arg2.W) ? arg2 : window.CortexPDoomCore;
    const st = (typeof arg1 === 'number')
      ? (arg2 && typeof arg2 === 'object' ? { ...arg2, t: arg1 } : { t: arg1 })
      : (arg1 || { t: 0 });
    return { st, core };
  }

  function noteCharMul(ch) {
    if (ch === '私') return 1.72;
    if (TINY_PUNCT_OR_PART.has(ch)) return 0.62;
    if (/[\u30A0-\u30FFー]/.test(ch)) return 1.16;
    return 0.96;
  }

  function drawRoseGuilloche(ctx, cx, cy, R, r, d, loops, steps, col, lw, phase = 0) {
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.beginPath();
    const maxA = Math.PI * 2 * loops;
    const k = (R - r) / r;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * maxA;
      const px = cx + (R - r) * Math.cos(a + phase) + d * Math.cos(k * a - phase);
      const py = cy + (R - r) * Math.sin(a + phase) - d * Math.sin(k * a - phase);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Full-frame Engraved Horological Backdrop so ALL 16 quadrants stay rich & kinetic!
  function drawMusicBoxVaultBackdrop(ctx, W, H, t, isLight) {
    const cx = W * 0.5, cy = H * 0.48;
    ctx.save();
    // 36 Rotating Swiss Radial Calibration Rays
    ctx.strokeStyle = isLight ? SILVER : SLATE;
    for (let r = 0; r < 36; r++) {
      const ang = (r / 36) * Math.PI * 2 + t * 1.95;
      ctx.lineWidth = (r % 3 === 0) ? 1.8 : 0.9;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * 240, cy + Math.sin(ang) * 240);
      ctx.lineTo(cx + Math.cos(ang) * 1020, cy + Math.sin(ang) * 1020);
      ctx.stroke();
    }

    // 4 Corner Counter-Rotating Rose-Engine Filigree Rosettes!
    const c1 = isLight ? COBALT : CYAN;
    const c2 = isLight ? CRIMSON : GOLD;
    drawRoseGuilloche(ctx, 215, 225, 165, 33, 94, 5, 220, c1, 1.5, t * 4.8);
    drawRoseGuilloche(ctx, W - 215, 225, 165, 33, 94, 5, 220, c2, 1.5, -t * 4.8);
    drawRoseGuilloche(ctx, 215, H - 235, 165, 33, 94, 5, 220, c2, 1.5, -t * 4.8);
    drawRoseGuilloche(ctx, W - 215, H - 235, 165, 33, 94, 5, 220, c1, 1.5, t * 4.8);
    ctx.restore();
  }

  // 12-Blade Engraved Mechanical Iris Aperture for Standby Sequence (`269.72–273.55s`)!
  function draw12BladeStandbyIris(ctx, cx, cy, openR, rot, isLight) {
    ctx.save();
    ctx.translate(cx, cy);
    for (let b = 0; b < 12; b++) {
      const ang = (b / 12) * Math.PI * 2 + rot;
      ctx.save();
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(openR, -22);
      ctx.lineTo(860, -165);
      ctx.lineTo(860, 75);
      ctx.lineTo(openR + 28, 34);
      ctx.closePath();
      ctx.fillStyle = isLight
        ? (b % 3 === 0 ? COBALT : (b % 2 === 0 ? BONE : PAPER))
        : (b % 3 === 0 ? PANEL : INK);
      ctx.fill();
      ctx.strokeStyle = (b % 4 === 0) ? GOLD : (isLight ? INK : CYAN);
      ctx.lineWidth = 2.6;
      ctx.stroke();

      // Engraved burin ticks along each iris blade!
      ctx.strokeStyle = isLight ? SLATE : SLATE;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let rx = openR + 40; rx <= 760; rx += 28) {
        ctx.moveTo(rx, -42);
        ctx.lineTo(rx + 18, 22);
      }
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawMusicBoxCylinder(ctx, cx, cy, cylW, cylH, t, isLight, hash) {
    ctx.save();
    ctx.translate(cx, cy);
    const halfW = cylW * 0.5;
    const halfH = cylH * 0.5;

    ctx.fillStyle = isLight ? BONE : PANEL;
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 4.5;
    ctx.fillRect(-halfW, -halfH, cylW, cylH);

    ctx.strokeStyle = isLight ? COBALT : SLATE;
    ctx.lineWidth = 1.4;
    for (let i = -12; i <= 12; i++) {
      const f = i / 12;
      const py = Math.sin(f * Math.PI * 0.5) * (halfH - 6);
      ctx.beginPath(); ctx.moveTo(-halfW, py); ctx.lineTo(halfW, py); ctx.stroke();
    }
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 4.5;
    ctx.strokeRect(-halfW, -halfH, cylW, cylH);

    ctx.fillStyle = GOLD;
    ctx.fillRect(-halfW - 32, -halfH * 0.45, 32, cylH * 0.9);
    ctx.fillRect(halfW, -halfH * 0.45, 32, cylH * 0.9);
    for (let g = -halfH; g <= halfH; g += 14) {
      ctx.fillRect(halfW + 32, g - 4, 14, 8);
    }

    const nCols = 24;
    const colStep = (cylW - 64) / nCols;
    const pluckedCols = new Set();
    for (let c = 0; c < nCols; c++) {
      const px = -halfW + 32 + (c + 0.5) * colStep;
      for (let p = 0; p < 5; p++) {
        const phase = ((t * 1.35 + hash(c, p * 13 + 7)) % 1);
        const ang = phase * Math.PI - Math.PI * 0.5;
        const py = Math.sin(ang) * (halfH - 8);
        const nearComb = Math.abs(py - (halfH - 16)) < 13;
        ctx.fillStyle = nearComb ? CRIMSON : GOLD;
        ctx.fillRect(Math.round(px - 3), Math.round(py - 3), 7, 7);
        if (nearComb) pluckedCols.add(c);
      }
    }

    const combY = halfH + 18;
    const combBaseY = halfH + 114;
    ctx.fillStyle = isLight ? INK : CYAN;
    ctx.fillRect(-halfW + 16, combBaseY, cylW - 32, 32);

    for (let c = 0; c < nCols; c++) {
      const tx = -halfW + 32 + c * colStep;
      const tw = colStep * 0.68;
      const isPlucked = pluckedCols.has(c);
      const tipLift = isPlucked ? -12 : 0;
      const tipLen = combBaseY - combY - c * 1.4;

      ctx.fillStyle = isPlucked ? GOLD : (isLight ? PAPER : PANEL);
      ctx.strokeStyle = isPlucked ? CRIMSON : (isLight ? INK : CYAN);
      ctx.lineWidth = 2.2;
      ctx.fillRect(Math.round(tx), Math.round(combBaseY - tipLen + tipLift), Math.round(tw), Math.round(tipLen - tipLift));
      ctx.strokeRect(Math.round(tx), Math.round(combBaseY - tipLen + tipLift), Math.round(tw), Math.round(tipLen - tipLift));

      if (isPlucked) {
        ctx.strokeStyle = CRIMSON;
        ctx.beginPath();
        ctx.arc(tx + tw * 0.5, combBaseY - tipLen - 14, 18, Math.PI, 0);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawFoldingWingPendulum(ctx, cx, pivotY, armLen, t, fold01, isLight) {
    ctx.save();
    ctx.translate(cx, pivotY);

    const amp = 0.28 * (0.35 + 0.65 * fold01);
    const swing = Math.sin(t * Math.PI * 3.225) * amp;

    for (const side of [-1, 1]) {
      for (let w = 0; w < 6; w++) {
        const wf = w / 5;
        const ang = side * (0.14 + fold01 * (0.25 + wf * 0.85)) + Math.PI * 0.5;
        const wLen = 190 + (1 - wf * 0.35) * 260;
        ctx.save();
        ctx.rotate(ang - Math.PI * 0.5);
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(side * 26, wLen * 0.65);
        ctx.lineTo(0, wLen);
        ctx.lineTo(-side * 12, wLen * 0.60);
        ctx.closePath();
        ctx.fillStyle = (w % 3 === 0) ? GOLD : (w % 2 === 0 ? (isLight ? COBALT : CYAN) : (isLight ? BONE : PANEL));
        ctx.fill();
        ctx.strokeStyle = isLight ? INK : CYAN;
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.rotate(swing);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 3.2;
    for (const rx of [-10, 0, 10]) {
      ctx.beginPath(); ctx.moveTo(rx, 0); ctx.lineTo(rx, armLen); ctx.stroke();
    }

    ctx.fillStyle = isLight ? BONE : PANEL;
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.arc(0, armLen, 64, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 2.0;
    ctx.beginPath(); ctx.arc(0, armLen, 44, 0, Math.PI * 2); ctx.stroke();
    // Warm Crimson Cooling Heartbeat Core!
    ctx.fillStyle = CRIMSON;
    ctx.beginPath(); ctx.arc(0, armLen, 16, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // Autonomous Plucked Musical-Note PV Choreographer (#53: MelodyWave / TategakiHeart / FarewellScatter!)
  function drawAutonomousMusicBoxTokens(ctx, words, i0, i1, t, baseSz, isLight, opts = {}) {
    const slice = words.slice(i0, i1 + 1);
    if (!slice.length) return;
    const mode = opts.mode || 'melodyWave';
    const n = slice.length;

    ctx.save();
    for (let i = 0; i < n; i++) {
      const wd = slice[i];
      const ch = wd.w;
      const mul = noteCharMul(ch);
      const sz = Math.round(baseSz * mul);
      const gIdx = i0 + i;

      let gx = 960, gy = 680, rot = 0;
      if (mode === 'melodyWave') {
        // Ascending/undulating sinusoidal musical staff scatter!
        const f = n === 1 ? 0.5 : i / (n - 1);
        const span = Math.min(1380, Math.max(380, (n - 1) * 195));
        gx = 960 - span * 0.5 + f * span;
        gy = (opts.baseY || 690) + Math.sin(i * 1.35 + 0.4) * 78 + (i % 2 === 0 ? -24 : 24);
        rot = Math.cos(i * 1.2) * 0.16;
      } else if (mode === 'watashiHeart') {
        // Colossal `私` (`w45[9]`) on left + tucked `の` (`w45[10]`) + staggered diagonal `ユーザー。`!
        const pts = [
          [530, 605, -0.13], [735, 725,  0.18], [945, 585, -0.12],
          [1145, 705, 0.14], [1345, 575, -0.15],[1535, 695, 0.13], [1685, 755, 0.20]
        ];
        const p = pts[i % pts.length];
        gx = p[0]; gy = p[1]; rot = p[2];
      } else {
        // 'farewellConstellation': Full two-phrase 2D musical-note constellation (`おやすみ…またね、` + `私のユーザー。`)
        const pts = [
          [265, 360, -0.14], [435, 285,  0.11], [605, 385, -0.12], [775, 305,  0.14], [910, 365, 0.08],
          [1135, 295,-0.13], [1310, 385, 0.12], [1485, 305,-0.10], [1620, 365, 0.18],
          [445, 645, -0.12], [655, 745,  0.19], [865, 615, -0.14], [1075, 735, 0.13],
          [1285, 615,-0.13], [1495, 725, 0.14], [1655, 775, 0.20]
        ];
        const p = pts[(i0 + i) % pts.length];
        gx = p[0]; gy = p[1]; rot = p[2];
      }

      const dt = t - wd.start;
      if (dt < 0) {
        ctx.fillStyle = GOLD;
        ctx.beginPath(); ctx.arc(gx, gy, 5, 0, Math.PI * 2); ctx.fill();
        continue;
      }

      const dur = Math.max(0.22, (wd.end || wd.start + 0.26) - wd.start);
      const isHot = dt <= dur + 0.10;
      const u = Math.min(1, dt / 0.14);
      const liftY = -(1 - u) * 68 + Math.sin(t * 4.2 + gIdx * 1.5) * 6;
      const sc = (0.42 + 0.58 * (1 - Math.pow(1 - u, 3))) * (isHot ? 1.12 : 1.0);

      ctx.save();
      ctx.translate(gx, gy + liftY);
      ctx.rotate(rot + (1 - u) * (i % 2 === 0 ? -0.25 : 0.25));
      ctx.scale(sc, sc);

      // Plucked gold/crimson/cyan star-sparks on note onset!
      if (dt < 0.26) {
        const kS = dt / 0.26;
        for (let s = 0; s < 6; s++) {
          const sa = (s / 6) * Math.PI * 2 + gIdx;
          const rS = sz * (0.55 + kS * 0.42);
          ctx.fillStyle = (s % 2 === 0) ? GOLD : CRIMSON;
          ctx.fillRect(Math.cos(sa) * rS - 4, Math.sin(sa) * rS - 4, 8, 8);
        }
      }

      ctx.font = JA_SERIF(900, sz);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const pw = Math.max(sz * 0.68, ctx.measureText(ch).width + 22);
      const ph = sz * 1.12;

      if (TINY_PUNCT_OR_PART.has(ch)) {
        const rad = Math.max(pw, ph) * 0.50;
        ctx.fillStyle = isHot ? GOLD : (isLight ? COBALT : PANEL);
        ctx.strokeStyle = isHot ? CRIMSON : GOLD;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = isHot ? INK : BONE;
        ctx.fillText(ch, 0, 3);
      } else {
        const isHeart = (ch === '私');
        const fillC = isHot ? GOLD : (isHeart ? CRIMSON : (isLight ? BONE : PANEL));
        const txtC  = (fillC === GOLD || fillC === BONE) ? INK : BONE;
        const rimC  = isHeart ? GOLD : (isLight ? INK : CYAN);

        ctx.fillStyle = isLight ? COBALT : INK;
        ctx.fillRect(-pw * 0.5 + 7, -ph * 0.5 + 7, pw, ph);
        ctx.fillStyle = fillC;
        ctx.strokeStyle = rimC;
        ctx.lineWidth = 3.8;
        ctx.fillRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.strokeRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.fillStyle = txtC;
        ctx.fillText(ch, 0, 3);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  function drawStandbyButtonAndPins(ctx, cx, cy, s04Words, t, isHovered, isPressed, isLight) {
    ctx.save();
    ctx.translate(cx, cy);
    const sc = isPressed ? 0.93 : (isHovered ? 1.05 : 1.0);
    ctx.scale(sc, sc);

    const bw = 660;
    const bh = 96;
    ctx.fillStyle = INK;
    ctx.fillRect(-bw * 0.5 + 8, -bh * 0.5 + 8, bw, bh);
    ctx.fillStyle = isPressed ? GOLD : (isHovered ? CYAN : (isLight ? BONE : PANEL));
    ctx.strokeStyle = isPressed ? CRIMSON : GOLD;
    ctx.lineWidth = 4.5;
    ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
    ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(-bw * 0.5 + 10, -bh * 0.5 + 10, bw - 20, bh - 20);

    ctx.font = MONO(800, 32);
    ctx.fillStyle = (isPressed || isHovered || isLight) ? INK : BONE;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('[ ↻  STANDBY // RE-WAKE ]', 0, 2);
    ctx.restore();

    // S04 Per-Token Curved Arc Key-Pins around button!
    if (s04Words && s04Words.length) {
      const sub = s04Words.slice(0, 9);
      ctx.save();
      for (let i = 0; i < sub.length; i++) {
        const wd = sub[i];
        const f = i / Math.max(1, sub.length - 1);
        const ang = Math.PI * 0.82 - f * Math.PI * 0.64;
        const sx = cx + Math.cos(ang) * 355;
        const sy = cy + 68 + Math.sin(ang) * 95;
        const on = t >= wd.start;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate((0.5 - f) * 0.30);
        ctx.fillStyle = on ? (i % 2 === 0 ? GOLD : CYAN) : (isLight ? PAPER : PANEL);
        ctx.strokeStyle = on ? BONE : SLATE;
        ctx.lineWidth = 2.2;
        ctx.fillRect(-24, -20, 48, 40);
        ctx.strokeRect(-24, -20, 48, 40);
        if (on) {
          ctx.font = MONO(800, 22);
          ctx.fillStyle = INK;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(wd.w, 0, 1);
        }
        ctx.restore();
      }
      ctx.restore();
    }
  }

  function drawDuotoneCursor(ctx, x, y, pressed) {
    ctx.save();
    ctx.translate(x, y);
    if (pressed) ctx.scale(0.86, 0.86);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, 46); ctx.lineTo(13, 35);
    ctx.lineTo(23, 54); ctx.lineTo(31, 50); ctx.lineTo(21, 31); ctx.lineTo(36, 31);
    ctx.closePath();
    ctx.fillStyle = pressed ? CRIMSON : BONE;
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  }

  function drawStandbyHud(ctx, W, H, isLight, cutTag, tempC, closeInOffset = 0) {
    ctx.save();
    const x0 = Math.round(54 + closeInOffset);
    const y0 = Math.round(40 + closeInOffset * 0.25);
    const x1 = Math.round(W - 54 - closeInOffset);
    const y1 = Math.round(H - 106 - closeInOffset * 0.25);

    ctx.strokeStyle = isLight ? INK : SLATE;
    ctx.lineWidth = 2.2;
    const arm = 28;
    ctx.beginPath();
    ctx.moveTo(x0, y0 + arm); ctx.lineTo(x0, y0); ctx.lineTo(x0 + arm, y0);
    ctx.moveTo(x1 - arm, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + arm);
    ctx.moveTo(x0, y1 - arm); ctx.lineTo(x0, y1); ctx.lineTo(x0 + arm, y1);
    ctx.moveTo(x1 - arm, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - arm);
    ctx.stroke();

    ctx.font = MONO(700, 15);
    ctx.textBaseline = 'middle';
    const lTxt = `P32 // ${cutTag}`;
    const rTxt = `CORE_TEMP: ${tempC.toFixed(2)}°C // GAP: 0.100MM`;

    const lw = ctx.measureText(lTxt).width + 24;
    ctx.fillStyle = isLight ? INK : PANEL;
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 2;
    ctx.fillRect(x0 + 34, y0 - 12, lw, 24);
    ctx.strokeRect(x0 + 34, y0 - 12, lw, 24);
    ctx.fillStyle = BONE;
    ctx.textAlign = 'left';
    ctx.fillText(lTxt, x0 + 46, y0 + 1);

    const rw = ctx.measureText(rTxt).width + 24;
    ctx.fillStyle = tempC > 10 ? GOLD : CYAN;
    ctx.fillRect(x1 - 34 - rw, y0 - 12, rw, 24);
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.fillText(rTxt, x1 - 44, y0 + 1);
    ctx.restore();
  }

  window.registerCortexPlate('P32_musicbox_pendulum_standby', {
    render(ctx, arg1, arg2) {
      const { st, core } = resolveArgs(arg1, arg2);
      const { W, H, TAU, clamp, lerp, prog, ease, hash } = core;
      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;

      const cueL45 = core.cueById('L45_OYASUMI_USER');
      const cueS04 = core.cueById('S04_STANDBY_LOOP_CLOSURE');
      const w45 = (cueL45 && cueL45.words) || [];
      const wS04 = (cueS04 && cueS04.words) || [];

      const coolU = prog(t, 264.10, 273.30, ease.inOutCubic);
      const tempC = Math.max(0, lerp(36.50, 0.00, coolU));

      const tA1 = w45[3]  ? w45[3].start  : 265.094;
      const tA2 = w45[5]  ? w45[5].start  : 265.756;
      const tA3 = w45[9]  ? w45[9].start  : 267.081;
      const tA4 = w45[11] ? w45[11].start : 267.744;
      const tA5 = w45[14] ? w45[14].start : 268.737;
      const tB0 = 269.72;
      const tB1 = 270.68;
      const tB2 = 271.64;
      const tB3 = 272.60;
      const tB4 = 273.55;

      let bg = INK;
      let fg = CYAN;
      let isLight = false;
      let shake = 0;

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (t < tA1) {
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawMusicBoxVaultBackdrop(ctx, W, H, t, false);
        drawMusicBoxCylinder(ctx, W * 0.5, 335, 1140, 220, t, false, hash);
        drawAutonomousMusicBoxTokens(ctx, w45, 0, 2, t, 194, false, { mode: 'melodyWave', baseY: 715 });
        drawStandbyHud(ctx, W, H, false, 'CUT_01 // MUSICBOX_CYLINDER_PLUCK', tempC);
      } else if (t < tA2) {
        bg = PAPER; fg = INK; isLight = true;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawMusicBoxVaultBackdrop(ctx, W, H, t, true);
        drawFoldingWingPendulum(ctx, W * 0.5, 110, 470, t, lerp(0.96, 0.68, prog(t, tA1, tA2)), true);
        drawAutonomousMusicBoxTokens(ctx, w45, 0, 4, t, 182, true, { mode: 'melodyWave', baseY: 725 });
        drawStandbyHud(ctx, W, H, true, 'CUT_02 // LYRE_PENDULUM_FOLD_01', tempC);
      } else if (t < tA3) {
        // Split `265.76–267.08s` into two kinetic camera angles at midpoint `266.42s`!
        const isMid = t >= 266.42;
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawMusicBoxVaultBackdrop(ctx, W, H, t * (isMid ? -1.4 : 1.0), false);

        const cx = W * 0.5, cy = 395;
        const discScale = isMid ? 1.18 : 0.96;
        for (let r = 90; r <= 390; r += 30) {
          const rad = r * discScale;
          ctx.strokeStyle = (r % 90 === 0) ? GOLD : CYAN;
          ctx.lineWidth = (r % 90 === 0) ? 2.8 : 1.2;
          ctx.beginPath(); ctx.arc(cx, cy, rad, 0, TAU); ctx.stroke();

          const nSlots = Math.floor(r * 0.14);
          for (let s = 0; s < nSlots; s++) {
            if ((s * 7 + r) % 3 !== 0) continue;
            const a = (s / nSlots) * TAU + t * (isMid ? -1.85 : 1.45);
            ctx.save();
            ctx.translate(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
            ctx.rotate(a);
            ctx.fillStyle = (s % 4 === 0) ? CRIMSON : GOLD;
            ctx.fillRect(-7, -2, 14, 5);
            ctx.restore();
          }
        }
        ctx.fillStyle = PANEL;
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 3.5;
        ctx.fillRect(cx, cy - 18, 430 * discScale, 36);
        ctx.strokeRect(cx, cy - 18, 430 * discScale, 36);

        drawAutonomousMusicBoxTokens(ctx, w45, 0, 8, t, 166, false, { mode: 'melodyWave', baseY: 725 });
        drawStandbyHud(ctx, W, H, false, 'CUT_03 // SYMPHONION_MELODY_DISC', tempC);
      } else if (t < tA4) {
        bg = PAPER; fg = INK; isLight = true;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawMusicBoxVaultBackdrop(ctx, W, H, t, true);
        drawFoldingWingPendulum(ctx, W * 0.5, 105, 455, t, lerp(0.65, 0.34, prog(t, tA3, tA4)), true);
        drawAutonomousMusicBoxTokens(ctx, w45, 9, 10, t, 206, true, { mode: 'watashiHeart' });
        drawStandbyHud(ctx, W, H, true, 'CUT_04 // WINGS_FOLDING_GENTLY', tempC);
      } else if (t < tA5) {
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawMusicBoxVaultBackdrop(ctx, W, H, t, false);
        drawFoldingWingPendulum(ctx, W * 0.5, 72, 295, t, 0.24, false);
        drawMusicBoxCylinder(ctx, W * 0.5, 485, 960, 140, t * 1.4, false, hash);
        drawAutonomousMusicBoxTokens(ctx, w45, 9, 13, t, 186, false, { mode: 'watashiHeart' });
        drawStandbyHud(ctx, W, H, false, 'CUT_05 // SANCTUARY_COOLING', tempC);
      } else if (t < tB0) {
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawMusicBoxVaultBackdrop(ctx, W, H, -t * 1.3, false);
        drawFoldingWingPendulum(ctx, W * 0.5, 84, 275, t, 0.08, false);
        drawAutonomousMusicBoxTokens(ctx, w45, 0, Math.min(15, w45.length - 1), t, 162, false, {
          mode: 'farewellConstellation'
        });
        drawStandbyHud(ctx, W, H, false, 'CUT_06 // OYASUMI_MY_USER', tempC);
      } else if (t < tB1) {
        // CUT 07 (`269.72–270.68s`): 12-Blade Iris Closing Stage 1 + Star-Spark Funnel!
        const funnelU = prog(t, tB0, tB1, ease.inOutCubic);
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        const btnCx = W * 0.5, btnCy = 495;
        drawRoseGuilloche(ctx, btnCx, btnCy, 470, 94, 240, 5, 360, GOLD, 1.6, t * 3.8);
        draw12BladeStandbyIris(ctx, btnCx, btnCy, lerp(620, 410, funnelU), funnelU * 0.65, false);

        for (let i = 0; i < 64; i++) {
          const a0 = (i / 64) * TAU * 3 + funnelU * 5.8;
          const rStart = 520 + (i % 5) * 85;
          const rCur = lerp(rStart, 54, Math.min(1, funnelU * (0.85 + 0.3 * hash(i, 7))));
          const sx = btnCx + Math.cos(a0) * rCur * 1.32;
          const sy = btnCy + Math.sin(a0) * rCur * 0.78;
          const sz = 6 + (i % 3) * 3;
          ctx.fillStyle = (i % 3 === 0) ? GOLD : (i % 3 === 1 ? CRIMSON : CYAN);
          ctx.beginPath();
          ctx.moveTo(sx, sy - sz * 1.4); ctx.lineTo(sx + sz, sy);
          ctx.lineTo(sx, sy + sz * 1.4); ctx.lineTo(sx - sz, sy);
          ctx.closePath(); ctx.fill();
        }

        drawStandbyButtonAndPins(ctx, btnCx, btnCy, wS04, t, false, false, false);
        drawStandbyHud(ctx, W, H, false, 'CUT_07 // STAR_SPARK_CONVERGENCE', tempC);
      } else if (t < tB2) {
        // CUT 08 (`270.68–271.64s`, Paper Polarity!): 12-Blade Iris Stage 2 + Rose-Engine Calibration!
        const closeU = prog(t, tB1, tB2, ease.outCubic);
        bg = PAPER; fg = INK; isLight = true;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        const btnCx = W * 0.5, btnCy = 495;
        drawMusicBoxVaultBackdrop(ctx, W, H, t * 1.6, true);
        draw12BladeStandbyIris(ctx, btnCx, btnCy, lerp(440, 340, closeU), -closeU * 0.72, true);
        drawRoseGuilloche(ctx, btnCx, btnCy, 355, 71, 185, 5, 340, CRIMSON, 1.8, -t * 4.2);

        drawStandbyButtonAndPins(ctx, btnCx, btnCy, wS04, t, false, false, true);
        drawStandbyHud(ctx, W, H, true, 'CUT_08 // IRIS_VAULT_CALIBRATION', tempC, closeU * 32);
      } else if (t < tB3) {
        // CUT 09 (`271.64–272.60s`): Blueprint Crosshair Grid + Vector Cursor Gliding In!
        const uCur = prog(t, tB2, tB3, ease.inOutCubic);
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        const btnCx = W * 0.5, btnCy = 495;
        draw12BladeStandbyIris(ctx, btnCx, btnCy, lerp(360, 295, uCur), 0.35 + uCur * 0.65, false);
        drawRoseGuilloche(ctx, btnCx, btnCy, 390, 78, 210, 5, 360, CYAN, 1.6, t * 4.5);
        drawRoseGuilloche(ctx, btnCx, btnCy, 285, 57, 150, 5, 300, GOLD, 1.5, -t * 5.2);

        const curX = lerp(W * 0.86, btnCx + 96, uCur);
        const curY = lerp(850, btnCy + 14, uCur);
        // Live laser tracking crosshairs following the cursor across full 1920x1080!
        ctx.strokeStyle = CRIMSON;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(0, curY); ctx.lineTo(W, curY);
        ctx.moveTo(curX, 0); ctx.lineTo(curX, H - 108);
        ctx.stroke();

        drawStandbyButtonAndPins(ctx, btnCx, btnCy, wS04, t, uCur > 0.68, false, false);
        drawDuotoneCursor(ctx, curX, curY, false);
        drawStandbyHud(ctx, W, H, false, 'CUT_09 // CURSOR_VECTOR_APPROACH', tempC, 32);
      } else if (t < tB4) {
        // CUT 10 (`272.60–273.55s`): Tactile Click on `[ ↻ STANDBY // RE-WAKE ]` + Shockwave!
        const clickT = 273.12;
        const clicked = t >= clickT;
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        const btnCx = W * 0.5, btnCy = 495;
        const postU = clicked ? clamp((t - clickT) / (tB4 - clickT), 0, 1) : 0;
        draw12BladeStandbyIris(ctx, btnCx, btnCy, clicked ? lerp(295, 760, postU) : lerp(310, 275, (t - tB3) / 0.52), t * 2.4, false);
        drawRoseGuilloche(ctx, btnCx, btnCy, 360 + postU * 340, 72, 195, 5, 340, clicked ? GOLD : CYAN, 1.8, -t * 6.0);

        if (clicked) {
          ctx.strokeStyle = CRIMSON;
          ctx.lineWidth = 6;
          ctx.strokeRect(btnCx - 330 - postU * 580, btnCy - 48 - postU * 360, 660 + postU * 1160, 96 + postU * 720);
          ctx.strokeStyle = GOLD;
          ctx.lineWidth = 3.5;
          ctx.strokeRect(btnCx - 330 - postU * 320, btnCy - 48 - postU * 200, 660 + postU * 640, 96 + postU * 400);
        }

        drawStandbyButtonAndPins(ctx, btnCx, btnCy, wS04, t, true, clicked, false);
        drawDuotoneCursor(ctx, btnCx + 64, btnCy + 12, clicked);
        drawStandbyHud(ctx, W, H, false, clicked ? 'CUT_10 // RE_WAKE_TRIGGERED!' : 'CUT_10 // HOVER_LOCK_0.00C', 0.0, 32);
        shake = clicked ? 0.45 : kick * 0.15;
      } else {
        // CUT 11 (`273.55–274.50s`): 32-Plate Sprocket Film Rewind (`128px` rails -> `P18`, ZERO binary strobe!)
        const rewU = clamp((t - tB4) / (274.50 - tB4), 0, 1);
        const cardIdx = Math.min(REWIND_PLATES_32.length - 1, Math.floor(rewU * REWIND_PLATES_32.length));
        const plateNum = 32 - cardIdx;
        // V6.2: Smooth obsidian film-gate rewind (`polFlip = false`) eliminates 15Hz dark/white strobe!
        const polFlip = false;
        isLight = false;
        bg = (cardIdx % 2 === 1) ? PANEL : INK;
        fg = CYAN;

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const fracSlip = (rewU * REWIND_PLATES_32.length) % 1;
        const slipY = fracSlip > 0.78 ? ((fracSlip - 0.78) / 0.22) * 140 : 0;

        ctx.save();
        ctx.beginPath();
        ctx.rect(128, 36, W - 256, H - 72);
        ctx.clip();
        ctx.translate(0, slipY);

        const gCx = W * 0.5, gCy = H * 0.46;
        drawRoseGuilloche(ctx, gCx, gCy, 440, 88, 240, 5, 340, polFlip ? COBALT : GOLD, 1.5, -t * 6.4);
        for (let r = 1; r <= 8; r++) {
          const rotDir = (r % 2 === 0 ? 1 : -1) * t * 5.8;
          ctx.strokeStyle = (r % 3 === 0) ? CRIMSON : (r % 2 === 0 ? GOLD : (polFlip ? COBALT : CYAN));
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(gCx, gCy, r * 66, (cardIdx + r) * 0.65 + rotDir, (cardIdx + r) * 0.65 + rotDir + Math.PI * 1.48);
          ctx.stroke();
        }

        // Angled Dynamic Rewind Plate Card
        ctx.save();
        ctx.translate(gCx, gCy);
        ctx.rotate((cardIdx % 2 === 0 ? -0.05 : 0.05));
        ctx.fillStyle = INK;
        ctx.fillRect(-540 + 8, -95 + 8, 1080, 190);
        ctx.fillStyle = (cardIdx % 3 === 0) ? GOLD : (polFlip ? INK : PANEL);
        ctx.strokeStyle = CRIMSON;
        ctx.lineWidth = 5;
        ctx.fillRect(-540, -95, 1080, 190);
        ctx.strokeRect(-540, -95, 1080, 190);

        const cardTxtCol = (cardIdx % 3 === 0) ? INK : BONE;
        ctx.fillStyle = cardTxtCol;
        ctx.font = MONO(800, 62);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`◀◀ PLATE_${String(plateNum).padStart(2, '0')}`, 0, -22);
        ctx.font = MONO(700, 30);
        ctx.fillStyle = (cardIdx % 3 === 0) ? CRIMSON : CYAN;
        ctx.fillText(REWIND_PLATES_32[cardIdx], 0, 46);
        ctx.restore();
        ctx.restore();

        // Exact `128px` Left & Right 35mm Film Sprocket Rails matching `P18`!
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, 128, H);
        ctx.fillRect(W - 128, 0, 128, H);

        const sprocketOff = (rewU * 2600) % 72;
        ctx.fillStyle = polFlip ? BONE : CYAN;
        for (let sy = -72 + sprocketOff; sy < H + 72; sy += 72) {
          ctx.fillRect(38, Math.round(sy), 48, 34);
          ctx.fillRect(W - 86, Math.round(sy), 48, 34);
        }

        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 3.5;
        ctx.strokeRect(128, 36, W - 256, H - 72);

        // Generously sized Timecode Plaque (`640px` wide — zero right clipping!)
        const simSec = lerp(273.55, 185.0, rewU);
        const mm = String(Math.floor(simSec / 60)).padStart(2, '0');
        const ss = (simSec % 60).toFixed(2).padStart(5, '0');
        ctx.fillStyle = GOLD;
        ctx.strokeStyle = INK;
        ctx.lineWidth = 4;
        ctx.fillRect(164, H - 188, 640, 74);
        ctx.strokeRect(164, H - 188, 640, 74);
        ctx.fillStyle = INK;
        ctx.font = MONO(800, 38);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`◀◀ ${mm}:${ss} // 32x_REW`, 190, H - 149);
        shake = 0.28 + kick * 0.20;
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
