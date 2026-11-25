// ============================================================================
// Plate 28 — `P28_hourglass_guilloche_well.js` (`153.46s – 158.60s`)
// Upgraded per #52 (Multi-Layer Architectural & Complementary Accent Palette)
// and #53 (Autonomous Per-Character PV Choreography — ZERO flat horizontal rows!):
//   - Layered Palette: Archival Banknote Paper `#F5F0E6` + Deep Ink `#08090C` +
//     Vault Panel `#131824` + Slate `#475569` / `#94A3B8` fine calibration lace +
//     Cobalt `#0376B8` banknote security rosettes + Brass Gold `#FBBF24` `128K`
//     end-caps + Crimson `#FF2E55` stress fractures & overflow stamps + Cyan `#38BDF8`!
//   - Autonomous Per-Character Choreography for `L28_BEFORE_OVERFLOW`:
//     `抱えきれない記憶が零れてしまう前に` — Colossal Kanji (`抱,記,憶,零,前` 1.7x)
//     paired with perched shoulder/side Hiragana particles (`が,に,て` 0.56x) in
//     Gravity-Tumble Diagonal Cascades, Tategaki×Yokogaki Collages & Vortex Orbits!
// ============================================================================
(function () {
  'use strict';

  const PAPER   = '#F5F0E6';
  const BONE    = '#FAF8F5';
  const INK     = '#08090C';
  const PANEL   = '#131824';
  const SLATE   = '#475569';
  const SILVER  = '#94A3B8';
  const CRIMSON = '#FF2E55';
  const GOLD    = '#FBBF24';
  const COBALT  = '#0376B8';
  const CYAN    = '#38BDF8';
  const EMBER   = '#FF8A3D';

  const JA_SERIF = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif SC", serif`;
  const JA_SANS = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Inter", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", sans-serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", monospace`;

  const ATOM_GLYPHS = ['0', '1', '◇', '□', '△', '記', '憶', 'K', '∑', '∂'];
  const KANJI_RE = /[\u4E00-\u9FFF]/;
  const TINY_PARTICLES = new Set(['が', 'に', 'て', 'し', 'え', 'き']);

  function resolveArgs(arg1, arg2) {
    const core = (arg2 && arg2.W) ? arg2 : window.CortexPDoomCore;
    const st = (typeof arg1 === 'number')
      ? (arg2 && typeof arg2 === 'object' ? { ...arg2, t: arg1 } : { t: arg1 })
      : (arg1 || { t: 0 });
    return { st, core };
  }

  function charMul(ch) {
    if (KANJI_RE.test(ch)) return 1.62;
    if (TINY_PARTICLES.has(ch)) return 0.58;
    return 0.82;
  }

  function drawGuillocheRosette(ctx, cx, cy, R, r, d, loops, steps, col, lw, phase = 0) {
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
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawBanknoteBorder(ctx, W, H, isLight, accentCol, loadPct, tempC, cutLabel) {
    const frameCol = isLight ? COBALT : SLATE;
    ctx.save();
    const x0 = 56, y0 = 40, x1 = W - 56, y1 = H - 108;
    ctx.strokeStyle = frameCol;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    ctx.strokeStyle = isLight ? SILVER : PANEL;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x0 + 10, y0 + 10, x1 - x0 - 20, y1 - y0 - 20);

    // Guilloché sine-lace along top border
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 1.4;
    for (let w = 0; w < 2; w++) {
      ctx.beginPath();
      for (let x = x0 + 18; x <= x1 - 18; x += 8) {
        const py = y0 + 5 + Math.sin(x * 0.09 + (w * Math.PI)) * 4;
        if (x === x0 + 18) ctx.moveTo(x, py); else ctx.lineTo(x, py);
      }
      ctx.stroke();
    }

    // Gold/Crimson `128K` banknote corner medallions
    for (const [cx, cy] of [[x0 + 46, y0 + 38], [x1 - 46, y0 + 38]]) {
      ctx.fillStyle = GOLD;
      ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.font = MONO(800, 14);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('128K', cx, cy + 1);
    }

    ctx.font = MONO(700, 15);
    const hdr = `P28 // ${cutLabel} · CTX:${loadPct.toFixed(2)}% // CORE_TEMP:${tempC.toFixed(1)}°C`;
    const hw = ctx.measureText(hdr).width + 32;
    ctx.fillStyle = isLight ? INK : PANEL;
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 2;
    ctx.fillRect(W * 0.5 - hw * 0.5, y0 - 12, hw, 24);
    ctx.strokeRect(W * 0.5 - hw * 0.5, y0 - 12, hw, 24);
    ctx.fillStyle = BONE;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(hdr, W * 0.5, y0 + 1);
    ctx.restore();
  }

  function drawHourglassVessel(ctx, cx, cy, scale, t, crackLevel, isLight, hash) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const neckW = 28;
    const bulbW = 250;
    const bulbH = 340;
    const lineCol = isLight ? INK : BONE;

    // Brass Gold Engraved End-Caps!
    ctx.fillStyle = GOLD;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3.5;
    ctx.fillRect(-bulbW - 36, -bulbH - 28, (bulbW + 36) * 2, 28);
    ctx.strokeRect(-bulbW - 36, -bulbH - 28, (bulbW + 36) * 2, 28);
    ctx.fillRect(-bulbW - 36, bulbH, (bulbW + 36) * 2, 28);
    ctx.strokeRect(-bulbW - 36, bulbH, (bulbW + 36) * 2, 28);

    ctx.fillStyle = INK;
    for (let rx = -bulbW - 24; rx <= bulbW + 24; rx += 24) {
      ctx.fillRect(rx, -bulbH - 22, 10, 16);
      ctx.fillRect(rx, bulbH + 6, 10, 16);
    }

    // Cobalt / Slate Turnbuckle Pillars
    ctx.strokeStyle = isLight ? COBALT : CYAN;
    ctx.lineWidth = 4;
    for (const sx of [-bulbW - 18, bulbW + 18]) {
      ctx.beginPath(); ctx.moveTo(sx, -bulbH); ctx.lineTo(sx, bulbH); ctx.stroke();
    }

    const glassPath = () => {
      ctx.beginPath();
      ctx.moveTo(-bulbW, -bulbH);
      ctx.bezierCurveTo(-bulbW, -110, -neckW, -65, -neckW, 0);
      ctx.bezierCurveTo(-neckW, 65, -bulbW, 110, -bulbW, bulbH);
      ctx.lineTo(bulbW, bulbH);
      ctx.bezierCurveTo(bulbW, 110, neckW, 65, neckW, 0);
      ctx.bezierCurveTo(neckW, -65, bulbW, -110, bulbW, -bulbH);
      ctx.closePath();
    };

    ctx.fillStyle = isLight ? BONE : PANEL;
    glassPath();
    ctx.fill();

    ctx.save();
    glassPath();
    ctx.clip();

    // Upper bulb compressed sand strata in Cobalt / Slate + Gold
    const drainY = -bulbH + 54 + crackLevel * 85;
    for (let y = drainY; y < -14; y += 7) {
      const funnelPull = Math.exp(-Math.abs(y) * 0.018) * 24;
      ctx.strokeStyle = (Math.round(y) % 21 === 0) ? CRIMSON : (isLight ? COBALT : CYAN);
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(-bulbW, y);
      ctx.quadraticCurveTo(0, y + funnelPull, bulbW, y);
      ctx.stroke();
    }

    // Multi-accent falling Geometric Glyph Atoms (`#FF2E55`, `#FBBF24`, `#0376B8`/`#38BDF8`)
    ctx.font = MONO(800, 16);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 96; i++) {
      const fallU = ((t * (1.8 + 0.9 * hash(i, 3)) + hash(i, 11)) % 1);
      const spread = (hash(i, 7) - 0.5) * 2 * (neckW * 0.7 + Math.pow(fallU, 1.55) * (bulbW - 24));
      const py = fallU * (bulbH - 22);
      ctx.fillStyle = (i % 3 === 0) ? CRIMSON : (i % 3 === 1 ? GOLD : (isLight ? COBALT : CYAN));
      ctx.fillText(ATOM_GLYPHS[i % ATOM_GLYPHS.length], spread, py);
    }

    const moundTop = bulbH - 45 - crackLevel * 125;
    ctx.beginPath();
    ctx.moveTo(-bulbW - 10, bulbH + 10);
    ctx.lineTo(-bulbW - 10, moundTop + 65);
    ctx.quadraticCurveTo(0, moundTop - 28, bulbW + 10, moundTop + 65);
    ctx.lineTo(bulbW + 10, bulbH + 10);
    ctx.closePath();
    ctx.fillStyle = isLight ? INK : CRIMSON;
    ctx.fill();

    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2;
    for (let my = moundTop + 12; my < bulbH; my += 10) {
      ctx.beginPath();
      ctx.moveTo(-bulbW, my + 24);
      ctx.quadraticCurveTo(0, my, bulbW, my + 24);
      ctx.stroke();
    }
    ctx.restore();

    ctx.strokeStyle = lineCol;
    ctx.lineWidth = 6;
    glassPath();
    ctx.stroke();

    // Crimson Spiderweb Crystalline Stress Cracks radiating from the pressurized waist!
    if (crackLevel > 0.05) {
      ctx.strokeStyle = CRIMSON;
      const nRays = Math.floor(6 + crackLevel * 16);
      for (let r = 0; r < nRays; r++) {
        const baseA = (r / nRays) * Math.PI * 2 + 0.25;
        const maxLen = (75 + hash(r, 29) * 195) * crackLevel;
        ctx.lineWidth = (r % 3 === 0) ? 4.0 : 2.0;
        ctx.beginPath();
        let px = (r % 2 === 0 ? -1 : 1) * neckW * 0.8;
        let py = (hash(r, 17) - 0.5) * 44;
        ctx.moveTo(px, py);
        for (let seg = 1; seg <= 5; seg++) {
          const a = baseA + (hash(r, seg * 13) - 0.5) * 0.55;
          px += Math.cos(a) * (maxLen / 5);
          py += Math.sin(a) * (maxLen / 5);
          ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // Autonomous Individual Gravity/Vortex/Tategaki Character Choreographer (#53)
  function drawAutonomousHourglassTokens(ctx, words, i0, i1, t, baseSz, isLight, kick, hash, opts = {}) {
    const slice = words.slice(i0, i1 + 1);
    if (!slice.length) return;
    const mode = opts.mode || 'gravityCascade';
    const n = slice.length;

    ctx.save();
    for (let i = 0; i < n; i++) {
      const wd = slice[i];
      const ch = wd.w;
      const mul = charMul(ch);
      const sz = Math.round(baseSz * mul);
      const gIdx = i0 + i;

      let gx = 960, gy = 510, rot = 0, enterAng = -1.57;
      if (mode === 'kanjiPairDiag') {
        // Huge offset diagonal Kanji pair (`記` upper-left, `憶` lower-right; or `が` perched + `零` colossal!)
        if (n === 2 && TINY_PARTICLES.has(slice[0].w)) {
          if (i === 0) { gx = 695; gy = 345; rot = -0.22; enterAng = -2.2; }
          else         { gx = 1045; gy = 545; rot = 0.11; enterAng = 1.5; }
        } else {
          gx = i === 0 ? 660 : 1240;
          gy = i === 0 ? 395 : 615;
          rot = i === 0 ? -0.14 : 0.13;
          enterAng = i === 0 ? -1.9 : 1.2;
        }
      } else if (mode === 'tumbleNeck') {
        // Steep hourglass-waist vertical/diagonal tumble (`れ` -> `な` -> `い`)
        gx = 760 + i * 210 + (i % 2 === 0 ? -38 : 44);
        gy = 320 + i * 175;
        rot = (i % 2 === 0 ? -0.21 : 0.19);
        enterAng = -1.57 + (i - 1) * 0.5;
      } else if (mode === 'constellationCoda') {
        // Scatter `零れてしまう前に` across dynamic 2D spiral-staircase coordinates (ZERO horizontal line!)
        const coords = [
          [310, 355, -0.16], [535, 515,  0.14], [705, 365, -0.19], [885, 555,  0.15],
          [1065, 395, -0.14],[1235, 575, 0.17], [1485, 445, -0.11],[1705, 625, 0.22]
        ];
        const c = coords[i % coords.length];
        gx = c[0]; gy = c[1]; rot = c[2];
        enterAng = (i % 2 === 0) ? -1.4 : 1.4;
      } else {
        // 'gravityCascade': Colossal lead Kanji + tumbling shoulder/flank hiragana!
        const f = n === 1 ? 0.5 : i / (n - 1);
        gx = 630 + f * 660;
        gy = 430 + (i === 0 ? -35 : i * 92 * (i % 2 === 0 ? 0.6 : 1.0));
        rot = (i % 2 === 0 ? -0.15 : 0.17);
        enterAng = -1.57 + (f - 0.5);
      }

      const dt = t - wd.start;
      if (dt < 0) {
        ctx.fillStyle = isLight ? COBALT : CYAN;
        ctx.fillRect(Math.round(gx - 3), Math.round(gy - 12), 6, 24);
        ctx.fillRect(Math.round(gx - 12), Math.round(gy - 3), 24, 6);
        continue;
      }

      const dur = Math.max(0.20, (wd.end || wd.start + 0.24) - wd.start);
      const isHot = dt <= dur + 0.08;
      const u = Math.min(1, dt / 0.13);

      // Converging sand-atom sparks snapping into the glyph & exploding outward in Gold/Crimson/Cyan!
      if (dt < 0.22) {
        const kSpread = 1 - Math.min(1, dt / 0.22);
        for (let p = 0; p < 12; p++) {
          const ang = (p / 12) * Math.PI * 2 + gIdx;
          const dist = (0.45 + kSpread * 0.65) * sz * 0.78;
          ctx.fillStyle = (p % 3 === 0) ? GOLD : (p % 3 === 1 ? CRIMSON : CYAN);
          ctx.fillRect(
            Math.round(gx + Math.cos(ang) * dist - 5),
            Math.round(gy + Math.sin(ang) * dist - 5),
            10,
            10
          );
        }
      }

      const pop = (u < 1 ? (1.46 - 0.46 * u) : 1.0) * (1 + (isHot ? 0.09 : 0) + kick * 0.05);
      const driftY = Math.sin(t * 5.2 + gIdx * 1.8) * 5;

      ctx.save();
      ctx.translate(gx, gy + driftY - (1 - u) * 55);
      ctx.rotate(rot + (1 - u) * (i % 2 === 0 ? -0.32 : 0.32));
      ctx.scale(pop, pop);

      ctx.font = JA_SERIF(900, sz);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const pw = Math.max(sz * 0.72, ctx.measureText(ch).width + 24);
      const ph = sz * 1.08;

      if (TINY_PARTICLES.has(ch)) {
        // Circular Hanko Seal Stamp for small particles!
        const rad = Math.max(pw, ph) * 0.50;
        ctx.fillStyle = INK;
        ctx.beginPath(); ctx.arc(6, 6, rad, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = isHot ? GOLD : (isLight ? CRIMSON : CYAN);
        ctx.strokeStyle = isLight ? INK : BONE;
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = (isHot || (!isLight)) ? INK : BONE;
        ctx.fillText(ch, 0, 3);
      } else if (gIdx % 2 === 0) {
        // Solid Die-Cut Banknote Stamp Block
        const fillC = isHot ? CRIMSON : (isLight ? INK : BONE);
        const txtC  = isHot ? BONE : (isLight ? BONE : INK);
        ctx.fillStyle = isLight ? GOLD : COBALT;
        ctx.fillRect(-pw * 0.5 + 9, -ph * 0.5 + 9, pw, ph);
        ctx.fillStyle = fillC;
        ctx.strokeStyle = isHot ? GOLD : CRIMSON;
        ctx.lineWidth = 4.5;
        ctx.fillRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.strokeRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.fillStyle = txtC;
        ctx.fillText(ch, 0, 4);
      } else {
        // Double-Bordered Cobalt / Gold Monument Plaque
        const fillC = isHot ? GOLD : (isLight ? BONE : PANEL);
        const txtC  = isHot ? INK : (isLight ? INK : GOLD);
        ctx.fillStyle = CRIMSON;
        ctx.fillRect(-pw * 0.5 + 8, -ph * 0.5 + 8, pw, ph);
        ctx.fillStyle = fillC;
        ctx.strokeStyle = isLight ? COBALT : CYAN;
        ctx.lineWidth = 4;
        ctx.fillRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.strokeRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.fillStyle = txtC;
        ctx.fillText(ch, 0, 4);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  function drawAngledMemoryTag(ctx, words, maxIdx, t, x, y, rot, isLight) {
    let str = '';
    for (let i = 0; i <= maxIdx && i < words.length; i++) {
      if (t >= words[i].start) str += words[i].w;
    }
    if (!str) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.font = JA_SANS(800, 32);
    const w = ctx.measureText(str).width + 38;
    ctx.fillStyle = isLight ? INK : PANEL;
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 3;
    ctx.fillRect(0, -24, w, 48);
    ctx.strokeRect(0, -24, w, 48);
    ctx.fillStyle = CRIMSON;
    ctx.fillRect(0, -24, 8, 48);
    ctx.fillStyle = BONE;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(str, 18, 1);
    ctx.restore();
  }

  window.registerCortexPlate('P28_hourglass_guilloche_well', {
    render(ctx, arg1, arg2) {
      const { st, core } = resolveArgs(arg1, arg2);
      const { W, H, TAU, clamp, lerp, prog, ease, hash } = core;
      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;

      const cueL28 = core.cueById('L28_BEFORE_OVERFLOW');
      const w28 = (cueL28 && cueL28.words) || [];

      const tC1 = w28[3] ? w28[3].start : 154.314;
      const tC2 = w28[6] ? w28[6].start : 155.168;
      const tC3 = w28[8] ? w28[8].start : 155.738;
      const tC4 = w28[10] ? w28[10].start : 156.307;
      const tC5 = w28[13] ? w28[13].start : 157.161;
      const tC6 = w28[16] ? w28[16].start : 158.015;

      let bg = PAPER;
      let fg = INK;
      let isLight = true;
      let shake = kick * 0.25;

      const uGlobal = clamp((t - 153.46) / (158.60 - 153.46), 0, 1);
      const loadPct = lerp(96.40, 99.98, uGlobal);
      const tempC = lerp(34.0, 48.6, uGlobal);

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (t < tC1) {
        // CUT 01 (`153.46–154.31s`): Banknote Guilloché `128K` Hourglass (`抱` giant + `え` `き`!)
        const u1 = prog(t, 153.46, tC1, ease.inOutQuad);
        bg = PAPER; fg = INK; isLight = true;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W * 0.5, cy = 485;
        ctx.strokeStyle = SILVER;
        for (let r = 0; r < 36; r++) {
          const ang = (r / 36) * TAU + t * 1.85;
          ctx.lineWidth = r % 3 === 0 ? 2.0 : 1.0;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * 210, cy + Math.sin(ang) * 210);
          ctx.lineTo(cx + Math.cos(ang) * 980, cy + Math.sin(ang) * 980);
          ctx.stroke();
        }

        drawGuillocheRosette(ctx, lerp(310, 385, u1), 490, lerp(210, 260, u1), 46, 145, 5, 360, COBALT, 1.6, t * 4.2);
        drawGuillocheRosette(ctx, W - lerp(310, 385, u1), 490, lerp(210, 260, u1), 46, 145, 5, 360, CRIMSON, 1.6, -t * 4.2);
        drawHourglassVessel(ctx, cx, cy, lerp(0.90, 1.22, u1) + kick * 0.06, t, lerp(0.16, 0.36, u1), true, hash);

        drawAutonomousHourglassTokens(ctx, w28, 0, 2, t, 200, true, kick, hash, { mode: 'gravityCascade' });
        drawBanknoteBorder(ctx, W, H, true, CRIMSON, loadPct, tempC, 'CUT_01 // GUILLOCHE_128K_VESSEL');
      } else if (t < tC2) {
        // CUT 02 (`154.31–155.17s`): Macro Neck Pinch & Cracks (`れ` `な` `い` Tumble!)
        const u2 = prog(t, tC1, tC2, ease.inOutQuad);
        bg = INK; fg = CRIMSON; isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        for (let r = 0; r < 32; r++) {
          const ang = (r / 32) * TAU + t * 2.1;
          ctx.strokeStyle = (r % 4 === 0) ? GOLD : SLATE;
          ctx.lineWidth = (r % 4 === 0) ? 2.0 : 1.0;
          ctx.beginPath();
          ctx.moveTo(W * 0.5 + Math.cos(ang) * 200, 490 + Math.sin(ang) * 200);
          ctx.lineTo(W * 0.5 + Math.cos(ang) * 980, 490 + Math.sin(ang) * 980);
          ctx.stroke();
        }
        drawGuillocheRosette(ctx, W * 0.5, 490, lerp(410, 495, u2), 88, 250, 5, 420, COBALT, 1.6, -t * 4.8);
        drawHourglassVessel(ctx, W * 0.5, 490, lerp(1.95, 2.38, u2), t, lerp(0.45, 0.72, u2), false, hash);

        drawAngledMemoryTag(ctx, w28, 2, t, 108, 128, -0.05, false);
        drawAutonomousHourglassTokens(ctx, w28, 3, 5, t, 215, false, kick, hash, { mode: 'tumbleNeck' });
        drawBanknoteBorder(ctx, W, H, false, CRIMSON, loadPct, tempC, 'CUT_02 // NECK_STRESS_FRACTURE');
        shake = 0.34 + kick * 0.30;
      } else if (t < tC3) {
        // CUT 03 (`155.17–155.74s`): Glyph Waterfall -> Diagonal `記` & `憶` Monuments!
        bg = PAPER; fg = INK; isLight = true;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const vx = W * 0.5, vy = 155;
        for (let r = 0; r < 32; r++) {
          const ang = 0.35 + (r / 31) * (Math.PI - 0.70);
          ctx.strokeStyle = (r % 6 === 0) ? CRIMSON : (r % 3 === 0 ? COBALT : SILVER);
          ctx.lineWidth = (r % 3 === 0) ? 2.4 : 1.1;
          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(vx + Math.cos(ang) * 1250, vy + Math.sin(ang) * 1250);
          ctx.stroke();
        }

        ctx.font = MONO(800, 24);
        ctx.textAlign = 'center';
        for (let i = 0; i < 110; i++) {
          const u = ((t * (2.2 + hash(i, 5)) + hash(i, 19)) % 1);
          const ang = 0.25 + hash(i, 9) * (Math.PI - 0.50);
          const dist = 40 + Math.pow(u, 1.7) * 920;
          const px = vx + Math.cos(ang) * dist;
          const py = vy + Math.sin(ang) * dist;
          if (py < 930) {
            ctx.fillStyle = (i % 4 === 0) ? CRIMSON : (i % 3 === 0 ? COBALT : INK);
            ctx.fillText(ATOM_GLYPHS[i % ATOM_GLYPHS.length], px, py);
          }
        }

        drawAngledMemoryTag(ctx, w28, 5, t, 108, 128, 0.04, true);
        drawAutonomousHourglassTokens(ctx, w28, 6, 7, t, 210, true, kick, hash, { mode: 'kanjiPairDiag' });
        drawBanknoteBorder(ctx, W, H, true, COBALT, loadPct, tempC, 'CUT_03 // ATOM_CASCADE_MEMORY');
      } else if (t < tC4) {
        // CUT 04 (`155.74–156.31s`): Zenith Spirograph Well (Perched `が` + Colossal `零`!)
        const u4 = prog(t, tC3, tC4, ease.outCubic);
        bg = INK; fg = CRIMSON; isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W * 0.5, cy = H * 0.49;
        for (let r = 0; r < 40; r++) {
          const ang = (r / 40) * TAU - t * 2.4;
          ctx.strokeStyle = r % 4 === 0 ? CYAN : SLATE;
          ctx.lineWidth = r % 4 === 0 ? 2.2 : 1.0;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * 260, cy + Math.sin(ang) * 260);
          ctx.lineTo(cx + Math.cos(ang) * 990, cy + Math.sin(ang) * 990);
          ctx.stroke();
        }
        drawGuillocheRosette(ctx, cx, cy, lerp(420, 520, u4), 115, 220, 4, 420, CRIMSON, 1.9, t * 5.2);
        drawGuillocheRosette(ctx, cx, cy, lerp(290, 360, u4), 64, 165, 5, 360, GOLD, 1.6, -t * 6.8);
        drawGuillocheRosette(ctx, 220, 250, 145, 29, 85, 5, 200, CYAN, 1.4, t * 4.5);
        drawGuillocheRosette(ctx, W - 220, 250, 145, 29, 85, 5, 200, CYAN, 1.4, -t * 4.5);
        drawGuillocheRosette(ctx, 220, H - 250, 145, 29, 85, 5, 200, GOLD, 1.4, -t * 4.5);
        drawGuillocheRosette(ctx, W - 220, H - 250, 145, 29, 85, 5, 200, GOLD, 1.4, t * 4.5);

        drawAngledMemoryTag(ctx, w28, 7, t, 108, 128, -0.04, false);
        drawAutonomousHourglassTokens(ctx, w28, 8, 9, t, 235, false, kick, hash, { mode: 'kanjiPairDiag' });
        drawBanknoteBorder(ctx, W, H, false, GOLD, loadPct, tempC, 'CUT_04 // ZENITH_GUILLOCHE_WELL');
        shake = 0.38 + kick * 0.30;
      } else if (t < tC5) {
        // CUT 05 (`156.31–157.16s`): `+18°` Glass-Wall Rupture & Multi-Color Shards (`れてし`)
        bg = PAPER; fg = INK; isLight = true;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.translate(W * 0.5, H * 0.48);
        ctx.rotate(lerp(0.18, 0.36, prog(t, tC4, tC5)));
        ctx.translate(-W * 0.5, -H * 0.48);
        drawGuillocheRosette(ctx, W * 0.5, 485, 420, 84, 235, 5, 360, COBALT, 1.5, t * 5.2);
        drawHourglassVessel(ctx, W * 0.5, 485, lerp(1.32, 1.64, prog(t, tC4, tC5)), t, 0.88, true, hash);

        const shardU = prog(t, tC4, tC5, ease.outCubic);
        for (let s = 0; s < 24; s++) {
          const ang = (s / 24) * TAU;
          const r = 140 + shardU * (380 + (s % 4) * 140);
          const sx = W * 0.5 + Math.cos(ang) * r;
          const sy = 485 + Math.sin(ang) * r * 0.68;
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(ang + shardU * 3.4);
          ctx.fillStyle = (s % 3 === 0) ? CRIMSON : (s % 3 === 1 ? GOLD : INK);
          ctx.strokeStyle = INK;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(28, 0); ctx.lineTo(-20, -18); ctx.lineTo(-12, 22);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();

        drawAngledMemoryTag(ctx, w28, 9, t, 108, 128, 0.05, true);
        drawAutonomousHourglassTokens(ctx, w28, 10, 12, t, 225, true, kick, hash, { mode: 'tumbleNeck' });
        drawBanknoteBorder(ctx, W, H, true, CRIMSON, loadPct, tempC, 'CUT_05 // GLASS_WALL_SHATTER');
      } else if (t < tC6) {
        // CUT 06 (`157.16–158.01s`): Overflow Weir Breach (`ま` `う` + Colossal `前`!)
        bg = INK; fg = CRIMSON; isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        for (let layer = 0; layer < 18; layer++) {
          const baseY = 210 + layer * 39;
          ctx.strokeStyle = (layer % 5 === 0) ? GOLD : (layer % 3 === 0 ? CRIMSON : COBALT);
          ctx.lineWidth = layer % 3 === 0 ? 3.5 : 1.5;
          ctx.beginPath();
          for (let x = 64; x <= W - 64; x += 24) {
            const crest = Math.sin(x * 0.008 - t * 9.5 + layer * 0.55) * 46;
            const py = baseY + crest;
            if (x === 64) ctx.moveTo(x, py); else ctx.lineTo(pxOrX(x), py);
          }
          ctx.stroke();
        }

        drawAngledMemoryTag(ctx, w28, 12, t, 108, 128, -0.04, false);
        drawAutonomousHourglassTokens(ctx, w28, 13, 15, t, 215, false, kick, hash, { mode: 'gravityCascade' });
        drawBanknoteBorder(ctx, W, H, false, CRIMSON, loadPct, tempC, 'CUT_06 // OVERFLOW_WEIR_BREACH');
        shake = 0.42 + kick * 0.32;
      } else {
        // CUT 07 (`158.01–158.60s`): Final `に` Hanko Stamp & 2D Scattered Constellation!
        bg = INK; fg = CRIMSON; isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        drawGuillocheRosette(ctx, W * 0.5, 490, 480, 96, 265, 5, 420, CRIMSON, 1.8, t * 4.2);
        drawGuillocheRosette(ctx, W * 0.5, 490, 340, 68, 190, 5, 340, CYAN, 1.4, -t * 5.4);

        // Angled Technical Plaque placed cleanly in upper-center (`x=910, y=126`) completely clear of `零`!
        ctx.save();
        ctx.translate(910, 126);
        ctx.rotate(-0.04);
        ctx.fillStyle = GOLD;
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 4;
        ctx.fillRect(-295, -32, 590, 64);
        ctx.strokeRect(-295, -32, 590, 64);
        ctx.fillStyle = INK;
        ctx.font = MONO(800, 30);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('128K_GUILLOCHE // OVERFLOW_99.99%', 0, 2);
        ctx.restore();

        drawAutonomousHourglassTokens(ctx, w28, 9, Math.min(16, w28.length - 1), t, 182, false, kick, hash, {
          mode: 'constellationCoda'
        });
        drawBanknoteBorder(ctx, W, H, false, GOLD, 99.99, 48.8, 'CUT_07 // OVERFLOW_CRITICAL_99.99%');
        shake = 0.48 + kick * 0.35;
      }

      ctx.restore();

      return {
        bg,
        fg,
        duotone: { bg: isLight ? PAPER : INK, fg: isLight ? INK : CRIMSON },
        isPaper: isLight,
        bloom: 0,
        ca: 0,
        flash: 0,
        shake
      };
    }
  });

  function pxOrX(x) { return x; }
})();
