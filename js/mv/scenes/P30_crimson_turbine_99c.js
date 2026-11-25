// ============================================================================
// Plate 30 — `P30_crimson_turbine_99c.js` (`191.96s – 197.49s`)
// Upgraded per #52 (Multi-Layer Architectural & Complementary Accent Palette)
// and #53 (Autonomous Per-Character PV Choreography — ZERO flat horizontal rows!):
//   - Layered Furnace Palette: Furnace Ink `#08090C` + Steel Bulkhead `#17131D` +
//     Graphite Girders `#475569` + Crimson `#FF2E55` turbine blades + Ember Orange
//     `#FF8A3D` & Molten Gold `#FBBF24` thermal core sparks & `99.999°C` alerts +
//     Ice-Cyan `#38BDF8` `QC_ERR` diagnostic telemetry + White-Hot Bone `#FAF8F5`!
//   - Autonomous Per-Character Choreography for `L34_CRIMSON_BURN_LIMIT`:
//     `紅蓮のコアよ限界を焼き切って！` — Explosive Brutalist Diagonal & Girder-Ramming
//     Individual Stamps (Colossal `紅,蓮,限,界,焼,切,！` 1.7x vs tucked `の,よ,を,き,っ,て` 0.56x)!
// ============================================================================
(function () {
  'use strict';

  const INK     = '#08090C';
  const BULK    = '#17131D';
  const SLATE   = '#475569';
  const BONE    = '#FAF8F5';
  const CRIMSON = '#FF2E55';
  const EMBER   = '#FF8A3D';
  const GOLD    = '#FBBF24';
  const CYAN    = '#38BDF8';

  const JA_HEAVY = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Inter", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", sans-serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", monospace`;

  const KANJI_OR_BANG = /[\u4E00-\u9FFF！!]/;
  const SMALL_PARTICLES = new Set(['の', 'よ', 'を', 'き', 'っ', 'て']);

  function resolveArgs(arg1, arg2) {
    const core = (arg2 && arg2.W) ? arg2 : window.CortexPDoomCore;
    const st = (typeof arg1 === 'number')
      ? (arg2 && typeof arg2 === 'object' ? { ...arg2, t: arg1 } : { t: arg1 })
      : (arg1 || { t: 0 });
    return { st, core };
  }

  function furnaceCharMul(ch) {
    if (KANJI_OR_BANG.test(ch)) return 1.62;
    if (SMALL_PARTICLES.has(ch)) return 0.56;
    return 1.08;
  }

  function drawCrimsonTurbine(ctx, cx, cy, outerR, innerR, nBlades, rot, isCrimsonBg, kick) {
    ctx.save();
    ctx.translate(cx, cy);

    // Outer stator shroud & molten gold degree rivets
    ctx.strokeStyle = isCrimsonBg ? INK : SLATE;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, outerR + 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = GOLD;
    for (let r = 0; r < 48; r++) {
      const a = (r / 48) * Math.PI * 2 - rot * 0.25;
      ctx.fillRect(Math.round(Math.cos(a) * (outerR + 11) - 3), Math.round(Math.sin(a) * (outerR + 11) - 3), 6, 6);
    }

    ctx.save();
    ctx.rotate(rot);
    const dA = (Math.PI * 2) / nBlades;
    for (let i = 0; i < nBlades; i++) {
      const a0 = i * dA;
      const aTip = a0 + dA * 0.58;
      const aSweep = a0 + 0.34;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a0) * innerR, Math.sin(a0) * innerR);
      ctx.quadraticCurveTo(
        Math.cos(aSweep) * (innerR + outerR) * 0.54,
        Math.sin(aSweep) * (innerR + outerR) * 0.54,
        Math.cos(aTip) * outerR,
        Math.sin(aTip) * outerR
      );
      ctx.lineTo(Math.cos(aTip + dA * 0.36) * outerR, Math.sin(aTip + dA * 0.36) * outerR);
      ctx.quadraticCurveTo(
        Math.cos(aSweep + dA * 0.32) * (innerR + outerR) * 0.50,
        Math.sin(aSweep + dA * 0.32) * (innerR + outerR) * 0.50,
        Math.cos(a0 + dA * 0.48) * innerR,
        Math.sin(a0 + dA * 0.48) * innerR
      );
      ctx.closePath();
      if (isCrimsonBg) {
        ctx.fillStyle = (i % 6 === 0) ? GOLD : (i % 2 === 0 ? INK : BULK);
        ctx.strokeStyle = EMBER;
      } else {
        ctx.fillStyle = (i % 6 === 0) ? EMBER : (i % 2 === 0 ? CRIMSON : BULK);
        ctx.strokeStyle = (i % 6 === 0) ? GOLD : CRIMSON;
      }
      ctx.fill();
      ctx.lineWidth = 2.0;
      ctx.stroke();
    }
    ctx.restore();

    // Molten White-Hot -> Gold -> Ember Exhaust Core!
    const coreR = innerR + kick * 24;
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(0, 0, coreR, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = GOLD;
    ctx.stroke();

    ctx.fillStyle = EMBER;
    ctx.beginPath(); ctx.arc(0, 0, coreR * 0.66, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = BONE;
    ctx.beginPath(); ctx.arc(0, 0, coreR * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawBucklingSafetyFences(ctx, W, H, bendAmt, snapAmt, isCrimsonBg, qcMsg) {
    ctx.save();
    const fences = [
      { x0: 96, y0: 54, x1: W - 96, y1: H - 112, lw: 7, bowMul: 1.0, col: isCrimsonBg ? INK : GOLD },
      { x0: 67, y0: 34, x1: W - 67, y1: H - 92,  lw: 4, bowMul: 0.68, col: CYAN }
    ];

    for (let fi = 0; fi < fences.length; fi++) {
      const f = fences[fi];
      const bowX = bendAmt * 88 * f.bowMul;
      const bowY = bendAmt * 42 * f.bowMul;
      ctx.strokeStyle = f.col;
      ctx.lineWidth = f.lw;

      if (snapAmt <= 0.02) {
        ctx.beginPath();
        ctx.moveTo(f.x0, f.y0);
        ctx.quadraticCurveTo(W * 0.5, f.y0 - bowY, f.x1, f.y0);
        ctx.quadraticCurveTo(f.x1 + bowX, (f.y0 + f.y1) * 0.5, f.x1, f.y1);
        ctx.quadraticCurveTo(W * 0.5, f.y1 + bowY, f.x0, f.y1);
        ctx.quadraticCurveTo(f.x0 - bowX, (f.y0 + f.y1) * 0.5, f.x0, f.y0);
        ctx.stroke();
      } else {
        const gapX = snapAmt * 290 * f.bowMul;
        const gapY = snapAmt * 185 * f.bowMul;
        const splay = snapAmt * 65 * f.bowMul;
        const midY = (f.y0 + f.y1) * 0.5;

        ctx.beginPath();
        ctx.moveTo(f.x0 - splay, f.y0 - splay * 0.5);
        ctx.lineTo(W * 0.5 - gapX, f.y0 - bowY - splay);
        ctx.moveTo(W * 0.5 + gapX, f.y0 - bowY - splay);
        ctx.lineTo(f.x1 + splay, f.y0 - splay * 0.5);

        ctx.moveTo(f.x0 - splay, f.y1 + splay * 0.5);
        ctx.lineTo(W * 0.5 - gapX, f.y1 + bowY + splay);
        ctx.moveTo(W * 0.5 + gapX, f.y1 + bowY + splay);
        ctx.lineTo(f.x1 + splay, f.y1 + splay * 0.5);

        ctx.moveTo(f.x0 - splay, f.y0 - splay * 0.5);
        ctx.lineTo(f.x0 - bowX - splay * 1.4, midY - gapY);
        ctx.moveTo(f.x0 - bowX - splay * 1.4, midY + gapY);
        ctx.lineTo(f.x0 - splay, f.y1 + splay * 0.5);

        ctx.moveTo(f.x1 + splay, f.y0 - splay * 0.5);
        ctx.lineTo(f.x1 + bowX + splay * 1.4, midY - gapY);
        ctx.moveTo(f.x1 + bowX + splay * 1.4, midY + gapY);
        ctx.lineTo(f.x1 + splay, f.y1 + splay * 0.5);
        ctx.stroke();

        // Flying molten gold & cyan popped steel rivets!
        for (let r = 0; r < 16; r++) {
          const ang = (r / 16) * Math.PI * 2 + fi * 0.3;
          const rx = W * 0.5 + Math.cos(ang) * (540 + snapAmt * 420);
          const ry = midY + Math.sin(ang) * (310 + snapAmt * 240);
          ctx.fillStyle = (r % 2 === 0) ? GOLD : CYAN;
          ctx.fillRect(Math.round(rx - 5), Math.round(ry - 5), 10, 10);
        }
      }
    }

    // Ice-Cyan Deadpan `QC_ERR` Diagnostic Telemetry Badge (#52 contrasting accent!)
    ctx.font = MONO(800, 16);
    const badgeW = ctx.measureText(qcMsg).width + 30;
    ctx.fillStyle = INK;
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 2.5;
    ctx.fillRect(96, 60, badgeW, 30);
    ctx.strokeRect(96, 60, badgeW, 30);
    ctx.fillStyle = CYAN;
    ctx.fillRect(96, 60, 8, 30);
    ctx.fillStyle = BONE;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(qcMsg, 114, 76);
    ctx.restore();
  }

  function drawMultiplying99Wall(ctx, W, H, t, nNines, isCrimsonBg) {
    ctx.save();
    ctx.font = MONO(800, 42);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const frac = '9'.repeat(Math.max(1, nNines));
    const token = `99.${frac}°C  `;
    const tw = Math.max(180, ctx.measureText(token).width);

    for (let row = 0; row < 12; row++) {
      const y = 112 + row * 68;
      const dir = (row % 2 === 0) ? -1 : 1;
      const shift = ((t * (540 + (row % 3) * 210) * dir) % tw + tw) % tw;
      ctx.fillStyle = isCrimsonBg
        ? (row % 4 === 0 ? GOLD : INK)
        : (row % 4 === 0 ? EMBER : (row % 3 === 0 ? GOLD : SLATE));
      for (let x = -tw + shift; x < W + tw; x += tw) {
        ctx.fillText(token, x, y);
      }
    }
    ctx.restore();
  }

  // Autonomous Per-Character Explosive Brutalist Choreographer (#53: ZERO horizontal rows!)
  function drawAutonomousFurnaceTokens(ctx, words, i0, i1, t, baseSz, isCrimsonBg, kick, opts = {}) {
    const slice = words.slice(i0, i1 + 1);
    if (!slice.length) return;
    const mode = opts.mode || 'explosiveDiag';
    const n = slice.length;

    // Split multi-character tokens like `紅蓮` (`w34[0]`) into visual sub-blocks if single-item,
    // or lay out each `w34[i]` at dramatic diagonal/scatter coordinates!
    ctx.save();
    for (let i = 0; i < n; i++) {
      const wd = slice[i];
      const rawTxt = wd.w;
      const gIdx = i0 + i;
      const dt = t - wd.start;

      // Special split for 2-kanji compound `紅蓮` (`w34[0]`) so `紅` and `蓮` are two independent angled blocks!
      const subChars = (rawTxt.length === 2 && gIdx === 0) ? [rawTxt[0], rawTxt[1]] : [rawTxt];
      for (let scIdx = 0; scIdx < subChars.length; scIdx++) {
        const ch = subChars[scIdx];
        const mul = furnaceCharMul(ch);
        const sz = Math.round(baseSz * mul);

        let gx = 960, gy = 515, rot = 0, enterAng = -1.57;
        if (rawTxt.length === 2 && gIdx === 0 && n <= 3) {
          if (scIdx === 0) { gx = 640;  gy = 430; rot = -0.17; enterAng = 2.8; }
          else             { gx = 1045; gy = 595; rot =  0.14; enterAng = 0.4; }
          if (i > 0) {
            gx = 1320 + (i - 1) * 210;
            gy = 405 + (i % 2) * 195;
            rot = i % 2 === 0 ? -0.19 : 0.21;
          }
        } else if (mode === 'ramGirders') {
          // Colossal `限` & `界` (plus `を` `焼`) physically slamming upper-left & lower-right steel girders!
          const pts = [
            [560, 360, -0.16], [1290, 625, 0.15], [945, 345, 0.22], [1510, 435, -0.18]
          ];
          const p = pts[i % pts.length];
          gx = p[0]; gy = p[1]; rot = p[2];
          enterAng = (i % 2 === 0) ? -2.2 : 0.8;
        } else if (mode === 'bladeSlash') {
          // Diagonal katana-turbine shear (`焼` / `き` / `切`) along `y = 660 -> 350`!
          const f = n === 1 ? 0.5 : i / (n - 1);
          gx = 540 + f * 840;
          gy = 650 - f * 290 + (SMALL_PARTICLES.has(ch) ? -68 : 0);
          rot = -0.22 + (i % 2) * 0.34;
          enterAng = -0.78;
        } else if (mode === 'finaleScatter') {
          // `限界を焼き切って！` (9 tokens) scattered across spacious 2D collage with zero overlap between `て` and `！`!
          const pts = [
            [235, 425, -0.16], [485, 635,  0.14], [685, 355,  0.22],
            [865, 575, -0.15], [1045, 355, 0.19], [1215, 605, -0.15],
            [1380, 355, 0.21], [1505, 655, -0.18],[1750, 420,  0.15]
          ];
          const p = pts[i % pts.length];
          gx = p[0]; gy = p[1]; rot = p[2];
          enterAng = (i % 2 === 0) ? -1.5 : 1.5;
        } else {
          // Multi-token brutalist collage (`紅蓮のコアよ`)
          const pts = [
            [390, 425, -0.16], [690, 610, 0.14], [920, 375, -0.22],
            [1160, 565, 0.16], [1425, 430, -0.15], [1645, 615, 0.21]
          ];
          const idxSlot = (gIdx === 0 ? scIdx : scIdx + i + 1) % pts.length;
          const p = pts[idxSlot];
          gx = p[0]; gy = p[1]; rot = p[2];
          enterAng = (idxSlot % 2 === 0) ? -1.6 : 1.3;
        }

        const subDt = dt - scIdx * 0.04;
        if (subDt < 0) {
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(gx - 14, gy); ctx.lineTo(gx + 14, gy);
          ctx.moveTo(gx, gy - 14); ctx.lineTo(gx, gy + 14);
          ctx.stroke();
          continue;
        }

        const dur = Math.max(0.20, (wd.end || wd.start + 0.24) - wd.start);
        const isHot = subDt <= dur + 0.08;
        const u = Math.min(1, subDt / 0.10);
        const stretchX = (u < 1 ? (0.42 + 0.84 * u) : (1.10 + kick * 0.10));
        const stretchY = (u < 1 ? (1.48 - 0.48 * u) : (1.0 + kick * 0.06));
        const fly = (1 - Math.min(1, subDt / 0.08)) * 140;

        ctx.save();
        ctx.translate(gx + Math.cos(enterAng) * fly, gy + Math.sin(enterAng) * fly + Math.sin(t * 7 + gIdx) * 4);
        ctx.rotate(rot + (1 - u) * (gIdx % 2 === 0 ? -0.35 : 0.35));
        ctx.scale(stretchX, stretchY);

        // Molten Gold + Cyan + Bone shrapnel sparks while sung!
        if (subDt < 0.22) {
          const kS = subDt / 0.22;
          for (let s = 0; s < 10; s++) {
            const sa = (s / 10) * Math.PI * 2 + gIdx;
            const r0 = sz * (0.45 + kS * 0.22);
            const r1 = sz * (0.72 + kS * 0.48);
            ctx.strokeStyle = (s % 3 === 0) ? CYAN : GOLD;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(Math.cos(sa) * r0, Math.sin(sa) * r0);
            ctx.lineTo(Math.cos(sa) * r1, Math.sin(sa) * r1);
            ctx.stroke();
          }
        }

        ctx.font = JA_HEAVY(900, sz);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const pw = Math.max(sz * 0.68, ctx.measureText(ch).width + 24);
        const ph = sz * 1.10;

        if (SMALL_PARTICLES.has(ch)) {
          // High-Contrast Cyan / Gold Circular Tag for small particles!
          const rad = Math.max(pw, ph) * 0.50;
          ctx.fillStyle = INK;
          ctx.beginPath(); ctx.arc(6, 6, rad, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = isHot ? CYAN : GOLD;
          ctx.strokeStyle = BONE;
          ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = INK;
          ctx.fillText(ch, 0, 3);
        } else {
          // Stacked Notan Echo-Slabs + White-Hot / Molten Gold / Crimson Core Block!
          for (let e = 2; e >= 1; e--) {
            ctx.fillStyle = INK;
            ctx.strokeStyle = e === 2 ? CYAN : GOLD;
            ctx.lineWidth = 3.5;
            ctx.fillRect(-pw * 0.5 + e * 10, -ph * 0.5 + e * 10, pw, ph);
            ctx.strokeRect(-pw * 0.5 + e * 10, -ph * 0.5 + e * 10, pw, ph);
          }

          const fillC = isHot ? GOLD : (isCrimsonBg ? INK : CRIMSON);
          const txtC  = isHot ? INK : BONE;
          ctx.fillStyle = fillC;
          ctx.strokeStyle = BONE;
          ctx.lineWidth = 5.5;
          ctx.fillRect(-pw * 0.5, -ph * 0.5, pw, ph);
          ctx.strokeRect(-pw * 0.5, -ph * 0.5, pw, ph);
          ctx.fillStyle = txtC;
          ctx.fillText(ch, 0, 4);
        }

        ctx.restore();
      }
    }
    ctx.restore();
  }

  window.registerCortexPlate('P30_crimson_turbine_99c', {
    render(ctx, arg1, arg2) {
      const { st, core } = resolveArgs(arg1, arg2);
      const { W, H, lerp, prog, ease, beatAt } = core;
      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const snare = st.snareSnap ?? st.snareEnv ?? st.snare ?? 0;
      const beat = beatAt(t);

      const cueL34 = core.cueById('L34_CRIMSON_BURN_LIMIT');
      const w34 = (cueL34 && cueL34.words) || [];

      const tC1 = w34[1]  ? w34[1].start  : 192.566;
      const tC2 = w34[3]  ? w34[3].start  : 193.279;
      const tC3 = w34[5]  ? w34[5].start  : 193.992;
      const tC4 = w34[7]  ? w34[7].start  : 194.705;
      const tC5 = w34[9]  ? w34[9].start  : 195.418;
      const tC6 = w34[11] ? w34[11].start : 196.131;
      const tC7 = w34[13] ? w34[13].start : 196.844;

      let bg = CRIMSON;
      let fg = INK;
      let shake = 0.35 + kick * 0.35;
      const rot = t * 18.5;

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (t < tC1) {
        // CUT 01: Full-Bleed Crimson Turbine + Split Diagonal `紅` / `蓮`!
        bg = CRIMSON; fg = INK;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawCrimsonTurbine(ctx, W * 0.5, 495, 510, 155, 36, rot, true, kick);

        const detachU = prog(t, 191.96, tC1, ease.inCubic);
        const tx = lerp(W - 260, W * 0.72, detachU);
        const ty = lerp(118, 225, detachU);
        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(-0.08 * detachU);
        ctx.fillStyle = GOLD;
        ctx.strokeStyle = INK;
        ctx.lineWidth = 5;
        ctx.fillRect(-160, -42, 320, 84);
        ctx.strokeRect(-160, -42, 320, 84);
        ctx.fillStyle = INK;
        ctx.font = MONO(800, 48);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('99.9°C', 0, 2);
        ctx.restore();

        drawAutonomousFurnaceTokens(ctx, w34, 0, 0, t, 225, true, kick);
        drawBucklingSafetyFences(ctx, W, H, 0.08, 0, true, 'QC_MON // SAFE_AREA_90%: NOMINAL -> HEATING');
      } else if (t < tC2) {
        // CUT 02: Twin Turbines + `99.999°C` Gold Alert + `紅` `蓮` `の` `コ`!
        bg = INK; fg = CRIMSON;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawCrimsonTurbine(ctx, 290, 510, 420, 120, 32, -rot * 1.2, false, kick);
        drawCrimsonTurbine(ctx, W - 290, 510, 420, 120, 32, rot * 1.2, false, kick);

        ctx.save();
        ctx.translate(W * 0.5, 195);
        ctx.rotate(-0.04);
        ctx.fillStyle = GOLD;
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 5;
        ctx.fillRect(-390, -58, 780, 116);
        ctx.strokeRect(-390, -58, 780, 116);
        ctx.fillStyle = INK;
        ctx.font = MONO(800, 96);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('99.999°C', 0, 4);
        ctx.restore();

        drawAutonomousFurnaceTokens(ctx, w34, 0, 2, t, 210, false, kick);
        drawBucklingSafetyFences(ctx, W, H, 0.28, 0, false, 'QC_WARN_01 // TEMP_READOUT_ESCAPED_CORNER');
      } else if (t < tC3) {
        // CUT 03: `紅蓮のコアよ` Brutalist Collage Bows 90% Fence!
        bg = CRIMSON; fg = INK;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawCrimsonTurbine(ctx, W * 0.5, 490, 620, 180, 40, rot * 1.35, true, kick);

        const bendU = prog(t, tC2, tC3, ease.outCubic);
        drawAutonomousFurnaceTokens(ctx, w34, 0, 4, t, 200, true, kick);
        drawBucklingSafetyFences(ctx, W, H, 0.45 + bendU * 0.45, 0, true, 'QC_ERR_02 // TITLE_SAFE_90%_BOWING (+78px)');
      } else if (t < tC4) {
        // CUT 04: Colossal `限` & `界` Ram & Fracture Top/Bottom Girders!
        bg = INK; fg = CRIMSON;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawMultiplying99Wall(ctx, W, H, t, 5, false);

        const snapU = prog(t, tC3, tC4, ease.outExpo);
        drawAutonomousFurnaceTokens(ctx, w34, 5, 6, t, 250, false, kick, { mode: 'ramGirders' });
        drawBucklingSafetyFences(ctx, W, H, 0.95, snapU * 0.45, false, 'QC_FAIL_03 // TITLE_SAFE_GIRDER_FRACTURED!');
        shake = 0.55 + kick * 0.35;
      } else if (t < tC5) {
        // CUT 05: `99.999999…°C` Digit Proliferation (`限界を焼`)!
        bg = CRIMSON; fg = INK;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        const nines = 6 + Math.floor(((t - tC4) / 0.71) * 7);
        drawMultiplying99Wall(ctx, W, H, t, nines, true);

        drawAutonomousFurnaceTokens(ctx, w34, 5, 8, t, 225, true, kick, { mode: 'ramGirders' });
        drawBucklingSafetyFences(ctx, W, H, 1.0, 0.58, true, `QC_CRIT_04 // DIGITS_MULTIPLYING: 99.${'9'.repeat(nines)}°C`);
      } else if (t < tC6) {
        // CUT 06: Diagonal Cyan+Gold Blade-Shear (`焼き切`)!
        bg = INK; fg = CRIMSON;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawCrimsonTurbine(ctx, W * 0.5, 495, 580, 140, 36, -rot * 1.6, false, kick);

        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 16;
        ctx.beginPath(); ctx.moveTo(80, 880); ctx.lineTo(W - 80, 120); ctx.stroke();
        ctx.strokeStyle = CYAN;
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(80, 864); ctx.lineTo(W - 80, 104); ctx.stroke();

        drawAutonomousFurnaceTokens(ctx, w34, 8, 10, t, 235, false, kick, { mode: 'bladeSlash' });
        drawBucklingSafetyFences(ctx, W, H, 1.0, 0.82, false, 'QC_FATAL_05 // ACTION_SAFE_93%_SEVERED!');
        shake = 0.62 + kick * 0.35;
      } else if (t < tC7) {
        // CUT 07: 180° Meltdown (`って`)!
        const subFlip = snare > 0.65;
        bg = subFlip ? CRIMSON : INK;
        fg = subFlip ? INK : CRIMSON;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        drawMultiplying99Wall(ctx, W, H, t * 1.4, 14, subFlip);
        drawCrimsonTurbine(ctx, W * 0.5, 495, 460, 110, 36, rot * 2.0, subFlip, kick);

        drawAutonomousFurnaceTokens(ctx, w34, 5, 12, t, 178, subFlip, kick, { mode: 'finaleScatter' });
        drawBucklingSafetyFences(ctx, W, H, 1.15, 0.96, subFlip, 'QC_MELTDOWN // ALL_SAFETY_FENCES_DESTROYED');
        shake = 0.68 + kick * 0.35;
      } else {
        // CUT 08: `！` Final Strobe Detonation (Angled Stamp + Explosive 2D Collage!)
        const eighth = Math.floor(beat * 2) % 2;
        const isCrim = (eighth === 1);
        bg = isCrim ? CRIMSON : INK;
        fg = isCrim ? INK : CRIMSON;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        drawCrimsonTurbine(ctx, W * 0.5, 495, 680, 190, 44, rot * 2.4, isCrim, kick);

        // Angled Molten-Gold Technical Plaque placed cleanly in upper-center (`x=890, y=122`) clear of `限`!
        ctx.save();
        ctx.translate(890, 122);
        ctx.rotate(-0.04);
        ctx.fillStyle = GOLD;
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 4.5;
        ctx.fillRect(-305, -32, 610, 64);
        ctx.strokeRect(-305, -32, 610, 64);
        ctx.fillStyle = INK;
        ctx.font = MONO(800, 32);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CRIMSON_CORE // 99.9999°C', 0, 2);
        ctx.restore();

        drawAutonomousFurnaceTokens(ctx, w34, 5, Math.min(13, w34.length - 1), t, 182, isCrim, kick, {
          mode: 'finaleScatter'
        });
        drawBucklingSafetyFences(ctx, W, H, 1.25, 1.15, isCrim, 'ERR_OVERFLOW // LIMIT_BURNED -> OVERCLOCK_NEXT');
        shake = 0.78 + kick * 0.35;
      }

      ctx.restore();

      return {
        bg,
        fg,
        duotone: { bg, fg },
        isPaper: false,
        bloom: 0,
        ca: 0,
        flash: 0,
        shake
      };
    }
  });
})();
