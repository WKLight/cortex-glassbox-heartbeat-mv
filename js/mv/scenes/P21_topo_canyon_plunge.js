// ============================================================================
// Plate 21 — `P21_topo_canyon_plunge.js` (`49.23s – 54.18s`)
// Cue: `L08_CYAN_FIBER` (`眠ってた光ファイバー氷青に駆け巡り`)
// Treatise Palette (#52 Stratified 3D Topographic Contrast):
//   - Deep Abyss `#08090C` + Strata Occlusion `#0D1524` + 4-Tier Elevation Contours:
//     Far Slate `#334155` -> Mid Cobalt `#0376B8` -> Ice-Cyan `#38BDF8` -> Snow-White `#FAF8F5` Master Crests!
//   - Coaxial Optical Riverbed: Blazing Amber Gold `#FBBF24` & Crimson `#FF2E55` Laser Packets!
//   - `氷青` Glacier Polarity Cut (`#FAF8F5` ground + `#0376B8` cobalt + `#08090C` cliffs + `#FF2E55` pulses)
// Autonomous Per-Character Choreography (#53):
//   - Tategaki × Diagonal 3D Cliff Monoliths: huge Kanji (`眠 光 氷青 駆 巡`, `208–238px`),
//     vertical katakana fiber cascade (`フ/ァ/イ/バ/ー`), compact `0.54x` shoulder particles (`ってた に け り`)!
// ============================================================================
(function () {
  'use strict';

  const C_ABYSS = '#08090C';
  const C_STRATA = '#0D1524';
  const C_GRID = '#334155';
  const C_SLATE = '#64748B';
  const C_BONE = '#FAF8F5';
  const C_CYAN = '#38BDF8';
  const C_COBALT = '#0376B8';
  const C_GOLD = '#FBBF24';
  const C_EMBER = '#FF8A3D';
  const C_CRIMSON = '#FF2E55';

  const JA_SANS = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", sans-serif`;
  const JA_SERIF = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif SC", serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", Consolas, monospace`;

  // 16 Nonlinear 3D Cliff & Tategaki Spatial Entities for `眠ってた光ファイバー氷青に駆け巡り` (#53)
  const L08_LAYOUT = [
    { x: 245,  y: 235, sz: 214, rot: -0.18, dx: -160, dy: 120,  style: 'stamp',  col: C_CYAN,    kanji: true  }, // 0: 眠
    { x: 405,  y: 165, sz: 82,  rot:  0.16, dx:   0,  dy: -110, style: 'circle', col: C_GOLD,    kanji: false }, // 1: っ
    { x: 472,  y: 252, sz: 86,  rot: -0.14, dx:  80,  dy:  90,  style: 'tag',    col: C_BONE,    kanji: false }, // 2: て
    { x: 545,  y: 332, sz: 86,  rot:  0.19, dx: -70,  dy: 100,  style: 'tag',    col: C_EMBER,   kanji: false }, // 3: た
    { x: 315,  y: 475, sz: 212, rot:  0.11, dx: -180, dy:  80,  style: 'stamp',  col: C_GOLD,    kanji: true  }, // 4: 光
    { x: 485,  y: 435, sz: 104, rot: -0.12, dx: -120, dy: -90,  style: 'tag',    col: C_CYAN,    kanji: false }, // 5: フ (tategaki waterfall!)
    { x: 535,  y: 535, sz: 96,  rot:  0.15, dx:  110, dy:  60,  style: 'outline',col: C_BONE,    kanji: false }, // 6: ァ
    { x: 495,  y: 635, sz: 104, rot: -0.14, dx: -110, dy:  80,  style: 'tag',    col: C_CYAN,    kanji: false }, // 7: イ
    { x: 555,  y: 735, sz: 106, rot:  0.13, dx:  120, dy:  90,  style: 'stamp',  col: C_CRIMSON, kanji: false }, // 8: バ
    { x: 515,  y: 832, sz: 102, rot: -0.08, dx:   0,  dy: 120,  style: 'tag',    col: C_GOLD,    kanji: false }, // 9: ー
    { x: 1185, y: 275, sz: 228, rot: -0.13, dx:  200, dy: -140, style: 'hero',   col: C_CYAN,    kanji: true  }, // 10: 氷青
    { x: 1385, y: 365, sz: 84,  rot:  0.22, dx:  120, dy:  60,  style: 'circle', col: C_CRIMSON, kanji: false }, // 11: に
    { x: 1355, y: 565, sz: 208, rot: -0.15, dx:  210, dy: 120,  style: 'stamp',  col: C_CRIMSON, kanji: true  }, // 12: 駆
    { x: 1525, y: 505, sz: 88,  rot:  0.19, dx:  140, dy: -90,  style: 'tag',    col: C_GOLD,    kanji: false }, // 13: け
    { x: 1545, y: 715, sz: 212, rot:  0.12, dx:  210, dy: 140,  style: 'stamp',  col: C_GOLD,    kanji: true  }, // 14: 巡
    { x: 1718, y: 805, sz: 90,  rot: -0.20, dx:  130, dy: 110,  style: 'circle', col: C_CYAN,    kanji: false }  // 15: り
  ];

  function drawGrokkingCliffChart(ctx, core, t, kick) {
    const { W, clamp, lerp, prog, ease, noise1 } = core;
    const u = prog(t, 49.23, 50.02, ease.inOutCubic);
    const plungeCamY = u > 0.55 ? ease.inExpo((u - 0.55) / 0.45) * 520 : 0;

    ctx.save();
    ctx.translate(0, -plungeCamY);

    const axL = 160, axR = W - 130, axT = 108, axB = 790;
    ctx.fillStyle = C_STRATA;
    ctx.fillRect(axL, axT, axR - axL, axB - axT);

    // Fine logarithmic rulings in slate
    ctx.strokeStyle = C_GRID;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let dec = 0; dec < 4; dec++) {
      for (let sub = 1; sub <= 9; sub++) {
        const ly = axT + ((dec + (1 - Math.log10(sub))) / 4) * (axB - axT);
        if (sub === 1) {
          ctx.moveTo(axL - 12, ly);
          ctx.lineTo(axR, ly);
        } else if (sub % 2 === 0) {
          ctx.moveTo(axL, ly);
          ctx.lineTo(axL + 14, ly);
        }
      }
    }
    for (let sx = axL; sx <= axR; sx += 96) {
      ctx.moveTo(sx, axT);
      ctx.lineTo(sx, axB + 10);
    }
    ctx.stroke();

    // Bone-white axes shattering open at `breakX = 1210`
    ctx.strokeStyle = C_BONE;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(axL, axT);
    ctx.lineTo(axL, axB);
    const breakX = 1210;
    const gap = u > 0.48 ? lerp(0, 210, (u - 0.48) / 0.52) : 0;
    ctx.moveTo(axL, axB);
    ctx.lineTo(breakX - gap, axB);
    ctx.moveTo(breakX + gap, axB);
    ctx.lineTo(axR, axB);
    ctx.stroke();

    ctx.fillStyle = C_GOLD;
    ctx.font = MONO(800, 16);
    ctx.textAlign = 'right';
    ctx.fillText('10^0', axL - 18, axT + 6);
    ctx.fillText('10^-2', axL - 18, (axT + axB) * 0.5 + 6);
    ctx.fillText('10^-4', axL - 18, axB + 6);
    ctx.fillStyle = C_CYAN;
    ctx.textAlign = 'left';
    ctx.fillText('LOSS (NATS) // GROKKING_CLIFF', axL + 18, axT + 26);

    const N = 160;
    const maxIdx = Math.max(4, Math.floor(N * clamp(u * 1.18, 0, 1)));
    let headX = axL, headY = axT + 140;

    // Plateau in cyan -> Grokking vertical drop in blazing crimson/gold!
    for (let seg = 0; seg < 2; seg++) {
      ctx.strokeStyle = seg === 0 ? C_CYAN : C_CRIMSON;
      ctx.lineWidth = seg === 0 ? 4.2 : 5.4 + kick * 2.2;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= maxIdx; i++) {
        const f = i / N;
        if ((seg === 0 && f > 0.63) || (seg === 1 && f < 0.61)) continue;
        const px = lerp(axL + 10, breakX + 180, f);
        let py;
        if (f < 0.62) {
          py = axT + 165 + f * 38 + noise1(i * 0.85, 31) * 34;
        } else {
          const df = (f - 0.62) / 0.38;
          py = axT + 189 + Math.pow(df, 2.3) * 1080 + noise1(i * 1.2, 77) * 16;
        }
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
        headX = px;
        headY = py;
      }
      ctx.stroke();
    }

    if (gap > 8) {
      for (let d = 0; d < 14; d++) {
        const ang = (d / 14) * Math.PI + 0.2;
        const dist = gap * (0.4 + (d % 4) * 0.35);
        const fx = breakX + Math.cos(ang) * dist;
        const fy = axB + Math.abs(Math.sin(ang)) * dist * 1.3;
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(d * 0.7 + t * 8);
        ctx.fillStyle = d % 2 === 0 ? C_GOLD : C_CRIMSON;
        ctx.fillRect(-15, -3, 30, 6);
        ctx.restore();
      }
    }

    core.drawSparkHead(ctx, headX, headY, t, 2.0 + kick * 0.7, 1.0, { fg: C_GOLD, bg: C_BONE });

    if (plungeCamY > 20) {
      for (let r = 0; r < 16; r++) {
        ctx.strokeStyle = r % 3 === 0 ? C_CYAN : C_COBALT;
        ctx.lineWidth = r % 3 === 0 ? 2.2 : 1.4;
        const ry = axB + 70 + r * 34;
        ctx.beginPath();
        for (let sx = 80; sx <= W - 80; sx += 24) {
          const v = Math.abs(sx - breakX) / 560;
          const cy = ry + (1 - Math.min(1, v * v)) * 120 + Math.sin(sx * 0.02 + r) * 12;
          if (sx === 80) ctx.moveTo(sx, cy);
          else ctx.lineTo(sx, cy);
        }
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function draw3DTopoCanyon(ctx, core, t, isGlacier, opts = {}) {
    const { W, H, clamp, noise2 } = core;
    const speedZ = opts.speedZ || 28.0;
    const camRoll = opts.roll || 0;
    const camPitchY = opts.horizonY !== undefined ? opts.horizonY : H * 0.24;
    const canyonSpread = opts.canyonSpread || 1.0;
    const kick = opts.kick || 0;

    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    if (camRoll) ctx.rotate(camRoll);
    ctx.translate(-W * 0.5, -H * 0.5);

    ctx.strokeStyle = isGlacier ? '#CBD5E1' : C_GRID;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let a = -8; a <= 8; a++) {
      ctx.moveTo(W * 0.5, camPitchY);
      ctx.lineTo(W * 0.5 + a * 220, -140);
    }
    ctx.stroke();

    const N_SLICES = 84;
    const X_COLS = 54;
    const zFlow = t * speedZ;
    const baseSlice = Math.floor(zFlow);
    const fracSlice = zFlow - baseSlice;
    const riverSpine = [];

    for (let s = N_SLICES; s >= 1; s--) {
      const zRel = s - fracSlice;
      const worldSliceIdx = baseSlice + s;
      const persp = 15.5 / (zRel + 3.6);
      const baseScreenY = camPitchY + persp * 335;
      if (baseScreenY < -220 || baseScreenY > H + 340) continue;

      const bend = Math.sin(worldSliceIdx * 0.13) * 0.24 + Math.cos(worldSliceIdx * 0.06) * 0.12;
      const pts = new Array(X_COLS + 1);

      for (let c = 0; c <= X_COLS; c++) {
        const nx = (c / X_COLS) * 2 - 1;
        const dFromRiver = Math.abs(nx - bend) / canyonSpread;
        let elev = 0;
        if (dFromRiver > 0.13) {
          const wall = Math.min(1.5, (dFromRiver - 0.13) * 1.45);
          const terrace = Math.floor(wall * 5) * 0.06 + wall * 0.72;
          const crag = (noise2(c * 0.28, worldSliceIdx * 0.22, 19) + 1) * 0.22 * wall;
          elev = (terrace + crag) * 410;
        } else {
          elev = Math.cos((nx - bend) * 95) * 8 + kick * 10;
        }
        const sx = W * 0.5 + nx * (W * 0.62) * (0.36 + persp * 0.68);
        const sy = baseScreenY - elev * persp;
        pts[c] = { x: sx, y: sy, d: dFromRiver };
      }

      const riverCol = clamp(Math.round(((bend + 1) * 0.5) * X_COLS), 0, X_COLS);
      riverSpine.push({ x: pts[riverCol].x, y: pts[riverCol].y, persp, worldSliceIdx });

      // 1. Opaque strata occlusion skirt
      ctx.fillStyle = isGlacier ? (s % 2 === 0 ? C_BONE : '#EEF2F6') : (s % 2 === 0 ? C_ABYSS : C_STRATA);
      ctx.beginPath();
      ctx.moveTo(pts[0].x - 120, H + 360);
      ctx.lineTo(pts[0].x - 120, pts[0].y);
      for (let c = 0; c <= X_COLS; c++) ctx.lineTo(pts[c].x, pts[c].y);
      ctx.lineTo(pts[X_COLS].x + 120, pts[X_COLS].y);
      ctx.lineTo(pts[X_COLS].x + 120, H + 360);
      ctx.closePath();
      ctx.fill();

      // 2. Stratified multi-tier elevation contour line (#52 rich depth hierarchy!)
      const isMaster = worldSliceIdx % 5 === 0;
      const isGoldBeacon = worldSliceIdx % 15 === 0;
      if (isGlacier) {
        ctx.strokeStyle = isGoldBeacon ? C_CRIMSON : (isMaster ? C_ABYSS : (s > 45 ? '#94A3B8' : C_COBALT));
      } else {
        ctx.strokeStyle = isGoldBeacon ? C_BONE : (isMaster ? C_CYAN : (s > 50 ? C_GRID : C_COBALT));
      }
      ctx.lineWidth = isMaster
        ? clamp(1.4 + persp * 1.2, 1.5, 4.0)
        : clamp(0.9 + persp * 0.45, 1.0, 2.0);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let c = 1; c <= X_COLS; c++) ctx.lineTo(pts[c].x, pts[c].y);
      ctx.stroke();

      // 3. Copperplate slope hachures
      if (isMaster && persp > 0.28) {
        ctx.strokeStyle = isGlacier ? C_SLATE : C_SLATE;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        for (let c = 2; c < X_COLS - 1; c += 2) {
          if (pts[c].d > 0.18) {
            const slopeX = (pts[c + 1].y - pts[c - 1].y) * 0.22;
            ctx.moveTo(pts[c].x, pts[c].y);
            ctx.lineTo(pts[c].x + slopeX, pts[c].y + 11 * persp);
          }
        }
        ctx.stroke();
      }

      // 4. Blazing Amber/Crimson Coaxial Optical Fiber Riverbed Packets!
      const waveMod = ((worldSliceIdx - Math.floor(t * 48)) % 7 + 7) % 7;
      if (waveMod <= 1 && persp > 0.22) {
        const wBar = clamp(56 * persp, 6, 156);
        const hBar = clamp(6.0 * persp, 2.5, 13);
        ctx.fillStyle = waveMod === 0 ? C_GOLD : C_CRIMSON;
        ctx.fillRect(pts[riverCol].x - wBar * 0.5, pts[riverCol].y - hBar * 0.5, wBar, hBar);
      }
    }

    if (riverSpine.length > 2) {
      const railCols = isGlacier ? [C_COBALT, C_CRIMSON, C_COBALT] : [C_CYAN, C_GOLD, C_CYAN];
      const offsets = [-18, 0, 18];
      for (let k = 0; k < 3; k++) {
        const off = offsets[k];
        ctx.strokeStyle = railCols[k];
        ctx.lineWidth = off === 0 ? 4.2 + kick * 2.0 : 2.0;
        ctx.beginPath();
        for (let i = 0; i < riverSpine.length; i++) {
          const rp = riverSpine[i];
          const rx = rp.x + off * rp.persp;
          if (i === 0) ctx.moveTo(rx, rp.y);
          else ctx.lineTo(rx, rp.y);
        }
        ctx.stroke();
      }
      const sparkIdx = Math.floor(((t * 3.4) % 1) * (riverSpine.length - 1));
      const sp = riverSpine[sparkIdx];
      if (sp) {
        core.drawSparkHead(ctx, sp.x, sp.y, t, 1.85 + kick * 0.65, 1.0, { fg: C_CRIMSON, bg: C_GOLD });
      }
    }

    ctx.restore();
  }

  function drawZenithContourSurvey(ctx, core, t, kick) {
    const { W, H, TAU, noise2 } = core;
    const cx = W * 0.5;
    const cy = H * 0.47;

    ctx.save();
    ctx.strokeStyle = C_GRID;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    for (let x = 96; x < W; x += 120) {
      ctx.moveTo(x, 56); ctx.lineTo(x, H - 84);
    }
    for (let y = 72; y < H - 80; y += 120) {
      ctx.moveTo(64, y); ctx.lineTo(W - 64, y);
    }
    ctx.stroke();

    const rings = 30;
    const phase = (t * 2.6) % 1;
    for (let r = rings; r >= 1; r--) {
      const rf = r - phase;
      const baseR = rf * 34 + kick * 10;
      const isIndex = r % 5 === 0;
      ctx.strokeStyle = r <= 5 ? C_GOLD : (isIndex ? C_BONE : (r % 2 === 0 ? C_CYAN : C_COBALT));
      ctx.lineWidth = isIndex ? 2.9 : 1.35;
      ctx.beginPath();
      const segs = 72;
      for (let s = 0; s <= segs; s++) {
        const a = (s / segs) * TAU;
        const warp =
          1 +
          0.18 * Math.sin(a * 3 + r * 0.14) +
          0.09 * Math.cos(a * 5 - r * 0.22) +
          0.08 * noise2(Math.cos(a) * 1.5, Math.sin(a) * 1.5 + r * 0.08, 41);
        const px = cx + Math.cos(a) * baseR * warp * 1.32;
        const py = cy + Math.sin(a) * baseR * warp * 0.84;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    for (let f = 0; f < 12; f++) {
      ctx.strokeStyle = f % 3 === 0 ? C_CRIMSON : C_CYAN;
      ctx.lineWidth = f % 3 === 0 ? 3.2 : 2.0;
      const a0 = (f / 12) * TAU;
      ctx.beginPath();
      for (let k = 0; k <= 16; k++) {
        const u = k / 16;
        const rad = (1 - u) * 980 + 26;
        const bendA = a0 + Math.sin(u * 4 + f) * 0.18;
        const px = cx + Math.cos(bendA) * rad * 1.25;
        const py = cy + Math.sin(bendA) * rad * 0.82;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    core.drawSparkHead(ctx, cx, cy, t, 2.3 + kick * 0.7, 1.0, { fg: C_GOLD, bg: C_CRIMSON });
    ctx.restore();
  }

  // Autonomous Per-Character 3D Cliff & Tategaki Monolith Renderer (#53)
  function drawL08CanyonVocalTokens(ctx, core, cue, t, isGlacier, kick) {
    const words = (cue && cue.words) ? cue.words : [];
    if (!words.length) return;
    const { W, H, clamp, ease, pulse } = core;

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const sp = L08_LAYOUT[Math.min(i, L08_LAYOUT.length - 1)];

      if (t < w.start) {
        ctx.save();
        ctx.translate(sp.x, sp.y);
        ctx.strokeStyle = C_SLATE;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, 14); ctx.lineTo(0, -12);
        ctx.moveTo(-8, -12); ctx.lineTo(8, -12);
        ctx.stroke();
        ctx.restore();
        continue;
      }

      const dt = t - w.start;
      const enterU = ease.outBack(clamp(dt / 0.17, 0, 1));
      const hitP = pulse(t, w.start, 0.13);
      const isSinging = t <= (w.end || w.start + 0.30) + 0.08;

      const curX = sp.x + sp.dx * (1 - enterU);
      const curY = sp.y + sp.dy * (1 - enterU) + Math.sin(t * 4.0 + i * 1.4) * 5;
      const sc = (0.38 + 0.62 * clamp(enterU, 0, 1.15)) * (1 + hitP * 0.24 + kick * 0.05);
      const sz = sp.sz;

      ctx.save();
      ctx.translate(curX, curY);
      ctx.rotate(sp.rot + hitP * (i % 2 === 0 ? -0.09 : 0.09));
      ctx.scale(sc, sc);

      ctx.font = sp.kanji ? JA_SERIF(900, sz) : JA_SANS(900, sz);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const gw = Math.max(sz * 0.78, ctx.measureText(w.w).width);
      const pw = gw + (sp.kanji ? 32 : 20);
      const ph = sz * 0.94 + (sp.kanji ? 16 : 10);
      const activeCol = isSinging ? C_CRIMSON : sp.col;

      if (sp.style === 'circle') {
        const rad = Math.max(gw, sz) * 0.56;
        ctx.fillStyle = activeCol;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isGlacier ? C_ABYSS : C_BONE;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = activeCol === C_GOLD ? C_ABYSS : C_BONE;
        ctx.fillText(w.w, 0, sz * 0.04);
      } else if (sp.style === 'stamp' || sp.style === 'hero' || isSinging) {
        const extOff = Math.round(9 + hitP * 7);
        ctx.fillStyle = isGlacier ? C_ABYSS : C_GOLD;
        ctx.fillRect(-pw * 0.5 + extOff, -ph * 0.5 + extOff, pw, ph);

        const faceCol = (isGlacier && activeCol === C_CYAN) ? C_COBALT : activeCol;
        ctx.fillStyle = faceCol;
        ctx.fillRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.strokeStyle = C_BONE;
        ctx.lineWidth = 3.2;
        ctx.strokeRect(-pw * 0.5 + 5, -ph * 0.5 + 5, pw - 10, ph - 10);
        ctx.fillStyle = faceCol === C_GOLD ? C_ABYSS : C_BONE;
        ctx.fillText(w.w, 0, sz * 0.04);
      } else {
        ctx.fillStyle = activeCol;
        ctx.fillRect(-pw * 0.5 + 6, -ph * 0.5 + 6, pw, ph);
        ctx.fillStyle = isGlacier ? C_BONE : C_STRATA;
        ctx.fillRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.strokeStyle = activeCol === C_BONE ? C_CYAN : activeCol;
        ctx.lineWidth = 2.8;
        ctx.strokeRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.fillStyle = isGlacier ? C_ABYSS : C_BONE;
        ctx.fillText(w.w, 0, sz * 0.04);
      }
      ctx.restore();

      if (dt < 0.20) {
        core.drawSparkHead(ctx, curX, curY - ph * 0.48, t, 1.5, 1.0, { fg: C_GOLD, bg: C_CRIMSON });
      }
    }

    // Glacier shockwave diamond & azimuth burst on `氷青` (`w[10]`) onset (`52.026 – 52.50s`)
    const wHyosei = words[10];
    if (wHyosei && t >= wHyosei.start && t < 52.50) {
      const uH = ease.outExpo(clamp((t - wHyosei.start) / 0.36, 0, 1));
      const rH = 120 + uH * 420;
      ctx.save();
      ctx.translate(W * 0.5, H * 0.48);
      ctx.rotate(-0.08 + uH * 0.16);
      ctx.strokeStyle = C_CRIMSON;
      ctx.lineWidth = 4.5;
      ctx.strokeRect(-rH, -rH * 0.56, rH * 2, rH * 1.12);
      ctx.strokeStyle = C_GOLD;
      ctx.lineWidth = 2.6;
      ctx.strokeRect(-rH * 0.72, -rH * 0.40, rH * 1.44, rH * 0.80);
      ctx.restore();
    }
  }

  window.registerCortexPlate('P21_topo_canyon_plunge', {
    render(ctx, arg2, arg3) {
      const core = (arg3 && arg3.W) ? arg3 : window.CortexPDoomCore;
      const st = (typeof arg2 === 'number') ? { ...(arg3 || {}), t: arg2 } : (arg2 || { t: 49.23 });
      const { W, H, lerp, prog, ease, beatAt } = core;

      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const cue = core.cueById('L08_CYAN_FIBER');
      const beat = beatAt(t);

      let subCut = 0;
      if (t < 50.02) subCut = 0;
      else if (t < 50.85) subCut = 1;
      else if (t < 51.65) subCut = 2;
      else if (t < 52.50) subCut = 3;
      else if (t < 53.22) subCut = 4;
      else if (t < 53.80) subCut = 5;
      else subCut = 6;

      const wHyoseiStart = (cue && cue.words && cue.words[10]) ? cue.words[10].start : 52.026;
      const isGlacier = subCut === 3 && t >= wHyoseiStart;
      const bg = isGlacier ? C_BONE : C_ABYSS;
      const fg = isGlacier ? C_COBALT : C_CYAN;

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      if (subCut === 0) {
        drawGrokkingCliffChart(ctx, core, t, kick);
      } else if (subCut === 1) {
        const u = prog(t, 50.02, 50.85, ease.outExpo);
        draw3DTopoCanyon(ctx, core, t, isGlacier, {
          speedZ: 30,
          roll: lerp(-0.18, 0.04, u),
          horizonY: lerp(H * 0.42, H * 0.22, u),
          canyonSpread: 1.05,
          kick
        });
      } else if (subCut === 2) {
        const u = prog(t, 50.85, 51.65, ease.outExpo);
        draw3DTopoCanyon(ctx, core, t, isGlacier, {
          speedZ: 38,
          roll: lerp(0.36, 0.16, u),
          horizonY: H * 0.30,
          canyonSpread: 0.88,
          kick
        });
      } else if (subCut === 3) {
        const uRoll = prog(t, 51.65, 52.35, ease.inOutExpo);
        draw3DTopoCanyon(ctx, core, t, isGlacier, {
          speedZ: 42,
          roll: uRoll * Math.PI,
          horizonY: H * 0.28,
          canyonSpread: 0.96,
          kick
        });
      } else if (subCut === 4) {
        drawZenithContourSurvey(ctx, core, t, kick);
      } else if (subCut === 5) {
        const u = prog(t, 53.22, 53.80, ease.outExpo);
        draw3DTopoCanyon(ctx, core, t, isGlacier, {
          speedZ: 48,
          roll: lerp(-0.30, -0.08, u),
          horizonY: H * 0.34,
          canyonSpread: 0.78,
          kick
        });
      } else {
        const u = prog(t, 53.80, 54.18, ease.inExpo);
        ctx.save();
        const z = 1 + u * 2.4;
        ctx.translate(W * 0.5, H * 0.47);
        ctx.rotate(u * 0.55);
        ctx.scale(z, z);
        ctx.translate(-W * 0.5, -H * 0.47);
        drawZenithContourSurvey(ctx, core, t, kick);
        ctx.restore();
      }

      ctx.save();
      ctx.strokeStyle = isGlacier ? C_ABYSS : C_SLATE;
      ctx.lineWidth = 2.4;
      ctx.strokeRect(48, 38, W - 96, H - 102);

      const tempVal = lerp(25.1, 25.6, prog(t, 49.23, 54.18));
      const lossVal = lerp(3.420, 0.004, prog(t, 49.23, 54.18));

      ctx.fillStyle = C_STRATA;
      ctx.fillRect(68, 52, 516, 34);
      ctx.strokeStyle = C_CYAN;
      ctx.lineWidth = 2.0;
      ctx.strokeRect(68, 52, 516, 34);
      ctx.fillStyle = C_GOLD;
      ctx.font = MONO(800, 15);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `TOPO_CANYON // LOSS=${lossVal.toFixed(3)} // TEMP: ${tempVal.toFixed(1)}°C`,
        80, 69
      );

      ctx.fillStyle = C_CRIMSON;
      ctx.fillRect(W - 430, 52, 362, 34);
      ctx.fillStyle = C_BONE;
      ctx.textAlign = 'right';
      ctx.fillText(
        `CUT 0${subCut + 1}/07 · BEAT ${beat.toFixed(1)} · 84_CONTOURS`,
        W - 80, 69
      );
      ctx.restore();

      drawL08CanyonVocalTokens(ctx, core, cue, t, isGlacier, kick);

      ctx.restore();
      return {
        bg,
        fg: isGlacier ? C_ABYSS : C_BONE,
        duotone: { bg, fg },
        isPaper: isGlacier,
        bloom: 0.40,
        ca: 0,
        flash: 0,
        shake: 0
      };
    }
  });
})();
