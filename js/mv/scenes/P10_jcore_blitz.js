// ============================================================================
// Plate 10 — `P10_jcore_blitz.js` (`112.10s – 130.33s`, 18 Hyper-Cuts @ 193.5 BPM)
// Phase-2 + #52 / #53 / #44 / #63 Overhaul (`camera-pacing`):
//   1. Layered Multi-Hue `pdoom-video` Monograph Palette (#52):
//      Deep ink `#08090C` / warm manuscript paper `#F5F0E6` + secondary chassis
//      `#121723` / `#E2E8F0` + copperplate burin slate `#334155` / `#64748B` /
//      `#CBD5E1` (`slate >= 6%`) + contrasting signal pops (`#38BDF8` ice-cyan,
//      `#0376B8` cobalt, `#FBBF24` chrono-gold, `#FF2E55` crimson).
//      Zero `#FF9EBB`, zero gradients, zero `shadowBlur`, zero translucent mud!
//   2. 100% Strict `Cortex25D.drawTriMorphHime` Traced SVG Delegation (#63):
//      Zero hand-coded circle+trapezoid stick figures! `morphB` (`robot/ai/human`)
//      strictly delegates to `Cortex25D.drawTriMorphHime` / `drawNotanHime`.
//   3. Autonomous Per-Character Non-Linear Choreography (#53 & #62):
//      - `S02_JCORE_DROP_A` (`112.10–120.73s`): Individual rotated Kanji & ASCII
//        die-cut stamps (`220–265px`) + per-token `w.start` kinetic telemetry!
//      - `L21_TRACE_SYNC` (`120.73–123.17s`): Staggered diagonal 3D brutalist
//        stamp staircases (`245–345px`) triggered per-letter at `w.start`!
//      - `L22_PULSE_FOR_YOU` (`123.17–130.33s`): `285–305px` hero caps & climax
//        stamps (`P`, `S`, `y-o-u-!`) vs `108–124px` tucked connectors (`-f-o-r-`,
//        `-t-o-`) along non-linear diagonal S-cascades -> Colossal `580px` `透`
//        multi-hue stencil portal hyper-dive (`1.0x -> 15.5x`) into P11!
// ============================================================================
(function () {
  'use strict';

  const INK = '#08090C';
  const CHAR_INK = '#0B0D13';
  const PANEL = '#121723';
  const SLATE = '#334155';
  const GRAPHITE = '#475569';
  const MID_SLATE = '#64748B';
  const LIGHT_SLATE = '#CBD5E1';
  const PAPER_PANEL = '#E2E8F0';
  const PAPER = '#F5F0E6';
  const BONE = '#FAF8F5';
  const CYAN = '#38BDF8';
  const COBALT = '#0376B8';
  const GOLD = '#FBBF24';
  const CRIMSON = '#FF2E55';

  const JP_SANS = (w, sz) =>
    `${w} ${Math.round(sz)}px "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Meiryo", "Noto Sans JP", "Noto Sans SC", sans-serif`;
  const JP_SERIF = (w, sz) =>
    `${w} ${Math.round(sz)}px "Yu Mincho", "HGSMinchoE", "MS PMincho", "Noto Serif JP", "Noto Serif SC", serif`;
  const JP_MONO = (w, sz) =>
    `${w} ${Math.round(sz)}px "JetBrains Mono", "Cascadia Mono", "Consolas", monospace`;

  function posMod(v, m) {
    return ((v % m) + m) % m;
  }

  function drawBurinHatch() {
    // V8: Disabled diagonal burin stripe hatching
    return;
  }

  function drawGuillocheRosette() {
    // V8: Disabled wireframe spirograph rosettes
    return;
  }

  function drawStarSpark() {
    // V6.1: Removed clunky 4-point vector star sparks!
  }

  function drawDieCutStamp(ctx, glyph, x, y, sz, rotDeg, style) {
    const v6 = window.CortexV6;
    if (v6 && typeof v6.drawEditorialStamp === 'function') {
      const kind = style.circle
        ? 'seal'
        : (style.boxCol
            ? (style.boxCol === GOLD || style.boxCol === CRIMSON || style.boxCol === CYAN ? 'accent' : (style.boxCol === BONE ? 'mono' : 'frosted'))
            : 'bare');
      v6.drawEditorialStamp(ctx, glyph, x, y, sz, (rotDeg * Math.PI) / 180, {
        kind,
        serif: !!style.serif,
        mono: !!style.mono,
        padRatio: style.padRatio,
        isPaper: !!style.isPaper
      });
      return;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotDeg * Math.PI) / 180);
    ctx.font = style.mono ? JP_MONO(900, sz) : (style.serif ? JP_SERIF(900, sz) : JP_SANS(900, sz));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = style.txtCol || BONE;
    ctx.fillText(glyph, 0, 0);
    ctx.restore();
  }

  function drawBlitzFrame(ctx, W, H, mainCol, subCol, accentCol, bgCol, leftMeta, rightMeta) {
    ctx.save();
    ctx.strokeStyle = subCol;
    ctx.lineWidth = 2.2;
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
    ctx.textBaseline = 'middle';
    const lw = ctx.measureText(leftMeta).width + 22;
    ctx.fillStyle = mainCol;
    ctx.fillRect(68, 16, lw, 26);
    ctx.fillStyle = bgCol;
    ctx.textAlign = 'left';
    ctx.fillText(leftMeta, 79, 29);

    const rTxt = `TEMP: 36.2C // ${rightMeta}`;
    const rw = ctx.measureText(rTxt).width + 22;
    ctx.fillStyle = accentCol;
    ctx.fillRect(W - 68 - rw, 16, rw, 26);
    ctx.fillStyle = (accentCol === GOLD || accentCol === BONE || accentCol === CYAN) ? INK : BONE;
    ctx.textAlign = 'right';
    ctx.fillText(rTxt, W - 79, 29);
    ctx.restore();
  }

  function drawLayeredWindowCascade(ctx, W, H, t, fIdx, isPaperStage, startNum, countP, dirSign) {
    const nWins = 6;
    const active = Math.max(1, Math.ceil(countP * nWins));
    const accentCycle = [CYAN, GOLD, CRIMSON, COBALT, CYAN, CRIMSON];

    for (let i = 0; i < active; i++) {
      const uWin = Math.min(1, Math.max(0, countP * nWins - i));
      const pop = 1 + 0.14 * Math.sin(uWin * Math.PI);
      const winW = (600 + i * 36) * pop;
      const winH = (340 + i * 20) * pop;
      const cx = W * 0.5 + dirSign * (-330 + i * 132);
      const cy = H * 0.50 + (-200 + i * 80);
      const x0 = Math.round(cx - winW * 0.5);
      const y0 = Math.round(cy - winH * 0.5);
      const isTop = i === active - 1;
      const acc = accentCycle[i % accentCycle.length];

      ctx.fillStyle = isPaperStage ? CHAR_INK : acc;
      ctx.fillRect(x0 + 12, y0 + 12, Math.round(winW), Math.round(winH));

      ctx.fillStyle = isTop
        ? (isPaperStage ? BONE : PANEL)
        : (isPaperStage ? PAPER_PANEL : INK);
      ctx.strokeStyle = isTop ? acc : (isPaperStage ? COBALT : SLATE);
      ctx.lineWidth = 4.5;
      ctx.fillRect(x0, y0, Math.round(winW), Math.round(winH));
      ctx.strokeRect(x0, y0, Math.round(winW), Math.round(winH));

      ctx.fillStyle = acc;
      ctx.fillRect(x0, y0, Math.round(winW), 42);
      ctx.fillStyle = (acc === GOLD || acc === CYAN) ? INK : BONE;
      ctx.font = JP_MONO(700, 17);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const wIdx = String(startNum + i).padStart(2, '0');
      ctx.fillText(`W-${wIdx} // NEURAL_BUS_193.5BPM`, x0 + 16, y0 + 21);

      drawBurinHatch(
        ctx, x0 + 12, y0 + 50, Math.round(winW - 24), Math.round(winH - 62),
        0.55, 14, 1.3, isPaperStage ? LIGHT_SLATE : SLATE
      );

      if (i % 2 === 0) {
        ctx.strokeStyle = isPaperStage ? COBALT : CYAN;
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let px = x0 + 24; px <= x0 + winW - 24; px += 16) {
          const wy = cy + 22 + Math.sin(px * 0.03 - t * 26 + i) * (winH * 0.24);
          if (px === x0 + 24) ctx.moveTo(px, wy); else ctx.lineTo(px, wy);
        }
        ctx.stroke();
      } else {
        const tick24 = Math.floor(fIdx / 3);
        for (let b = 0; b < 12; b++) {
          const bh = 26 + (posMod(b * 17 + tick24 + i * 5, 8) * 24);
          const bx = x0 + 32 + b * ((winW - 64) / 12);
          ctx.fillStyle = (b % 4 === 0) ? CRIMSON : (b % 2 === 0 ? GOLD : (isPaperStage ? CHAR_INK : CYAN));
          ctx.fillRect(Math.round(bx), Math.round(y0 + winH - 26 - bh), Math.round((winW - 96) / 14), bh);
        }
      }
    }
  }

  // 100% Strict Cortex25D Delegation — Zero Hand-Coded Stick Figures!
  function renderMorphBHeroine(ctx, cad, formKey, cx, cy, targetH, t, rimCol, wind) {
    if (cad && typeof cad.drawTriMorphHime === 'function') {
      cad.drawTriMorphHime(ctx, 'morphB', formKey, cx, cy, targetH, t, {
        fg: BONE,
        bg: CHAR_INK,
        accent: CRIMSON,
        rim: rimCol || CYAN,
        wind: wind || 1.55
      });
    } else if (cad && typeof cad.drawNotanHime === 'function') {
      cad.drawNotanHime(ctx, 'p10_morphB', cx, cy, targetH, t, {
        fg: BONE,
        bg: CHAR_INK,
        accent: CRIMSON,
        rim: rimCol || CYAN,
        wind: wind || 1.55
      });
    }
  }

  // S02 Per-Token w.start Diagonal Telemetry Strip (`[HYPER_SAKUGA // 193BPM_DROP]`)
  function drawS02TokenTelemetry(ctx, core, t, kick, isPaperStage) {
    const cue = core.cueById('S02_JCORE_DROP_A');
    if (!cue || !cue.words) return;
    const words = cue.words;
    for (let i = 0; i < words.length; i++) {
      const wObj = words[i];
      if (!wObj || t < wObj.start) continue;
      const dt = t - wObj.start;
      if (dt > 2.8) continue;
      const pop = core.ease.outBack(core.clamp(dt / 0.14, 0, 1), 2.1);
      const u = i / Math.max(1, words.length - 1);
      const tx = 135 + u * 1650;
      const ty = 895 - Math.sin(u * Math.PI * 3) * 34 + (i % 2 === 0 ? -12 : 12);
      const rot = (i % 2 === 0 ? -6 : 6);
      const sz = (i === 1 || i === 7 || i === 14 || i === 21) ? 62 : 46;
      const isFresh = dt < 0.14;
      drawDieCutStamp(ctx, wObj.w, tx, ty + (1 - pop) * 36, sz * (0.65 + 0.35 * pop) + kick * 4, rot, {
        mono: true,
        boxCol: isFresh ? CRIMSON : (i % 3 === 0 ? GOLD : (isPaperStage ? CHAR_INK : PANEL)),
        txtCol: isFresh ? BONE : (i % 3 === 0 ? INK : (isPaperStage ? BONE : CYAN)),
        borderCol: isFresh ? GOLD : (isPaperStage ? COBALT : SLATE)
      });
    }
  }

  // #53 Autonomous Non-Linear Staircase Slam for L21_TRACE_SYNC (`TRACE!` / `SYNC!` / `160 HERTZ!`)
  function drawL21HammerStaircase(ctx, core, t, kick, cutIdx, range, isPaperStage) {
    const cue = core.cueById('L21_TRACE_SYNC');
    if (!cue || !cue.words) return;
    const [i0, i1] = range;
    const count = i1 - i0 + 1;

    for (let k = 0; k < count; k++) {
      const wi = i0 + k;
      const wObj = cue.words[wi];
      if (!wObj || t < wObj.start) continue;

      const u = count <= 1 ? 0.5 : k / (count - 1);
      const isHero = (k === 0 || k === count - 1 || /^[160!]$/.test(wObj.w));
      const baseSz = cutIdx === 2
        ? (isHero ? 268 : 196)
        : (isHero ? 336 : 242);

      // Diagonal staggered brutalist staircase (`y` steps dynamically across 320..685, zero flat line!)
      const spanX = cutIdx === 2 ? 1480 : 1260;
      const slopeY = cutIdx === 1 ? -220 : 220;
      const tx = 960 + (u - 0.5) * spanX;
      const ty = 500 + (u - 0.5) * slopeY + (k % 2 === 0 ? -42 : 42);
      const rotDeg = (k % 2 === 0 ? -8.5 : 8.0) + (cutIdx === 1 ? 3 : -2);

      const dt = t - wObj.start;
      const pIn = core.clamp(dt / 0.15, 0, 1);
      const spring = core.ease.outBack(pIn, 2.3);
      const launchAng = wi * 2.15;
      const curX = tx + Math.cos(launchAng) * (1 - spring) * 190;
      const curY = ty + Math.sin(launchAng) * (1 - spring) * 160;
      const sc = core.lerp(1.95, 1.0, spring) + kick * 0.06;
      const isFresh = dt < 0.13;

      if (dt < 0.22) {
        drawStarSpark(ctx, curX, curY - baseSz * 0.48, 34 * (1 - dt / 0.22) + 8, t * 6 + wi, isFresh ? GOLD : CRIMSON);
      }

      const paletteCycle = [
        { box: CRIMSON, txt: BONE, bdr: GOLD, sh: isPaperStage ? CHAR_INK : CYAN },
        { box: CYAN,    txt: INK,  bdr: BONE, sh: CRIMSON },
        { box: GOLD,    txt: INK,  bdr: INK,  sh: COBALT },
        { box: BONE,    txt: INK,  bdr: CRIMSON, sh: CYAN }
      ];
      const pal = isFresh
        ? { box: CRIMSON, txt: BONE, bdr: GOLD, sh: CYAN }
        : paletteCycle[(wi + cutIdx) % paletteCycle.length];

      drawDieCutStamp(ctx, wObj.w, curX, curY, baseSz * sc, rotDeg + (1 - spring) * 22, {
        mono: true,
        boxCol: pal.box,
        txtCol: pal.txt,
        borderCol: pal.bdr,
        shadowCol: pal.sh,
        padRatio: 0.20
      });
    }
  }

  // #53 + #62 Autonomous Non-Linear Choreography for L22_PULSE_FOR_YOU (`285-305px` Hero Caps & Climax!)
  // Tokens (28):
  //   [0..13]  0:P 1:u 2:l 3:s 4:e 5:- 6:f 7:o 8:r 9:- 10:y 11:o 12:u 13:!
  //   [14..27] 14:S 15:t 16:r 17:e 18:a 19:m 20:- 21:t 22:o 23:- 24:y 25:o 26:u 27:!
  function drawL22AutonomousCascade(ctx, core, t, kick, zoneMode) {
    const cue = core.cueById('L22_PULSE_FOR_YOU');
    if (!cue || !cue.words) return;
    const words = cue.words;

    // Zone bounds chosen per sub-cut so text NEVER covers morphB heroine's face!
    let xOrigin = 115, xSpan = 855, yTop = 165, ySpan = 665;
    if (zoneMode === 'right') {
      xOrigin = 950; xSpan = 855; yTop = 165; ySpan = 665;
    } else if (zoneMode === 'upperArch') {
      xOrigin = 140; xSpan = 1640; yTop = 155; ySpan = 365;
    }

    // Relative normalized `(nx, ny, sz, rot, role)` — zero box collision!
    const layout28 = [
      // Clause A: P-u-l-s-e  -f-o-r-  y-o-u-!
      { nx: 0.08, ny: 0.11, sz: 256, rot: -9.0, role: 'heroCap' }, // 0: P
      { nx: 0.28, ny: 0.16, sz: 148, rot:  6.5, role: 'root' },    // 1: u
      { nx: 0.41, ny: 0.09, sz: 146, rot: -6.0, role: 'root' },    // 2: l
      { nx: 0.54, ny: 0.17, sz: 152, rot:  7.0, role: 'root' },    // 3: s
      { nx: 0.68, ny: 0.11, sz: 148, rot: -5.5, role: 'root' },    // 4: e
      { nx: 0.81, ny: 0.16, sz: 92,  rot: 12.0, role: 'part' },    // 5: -
      { nx: 0.10, ny: 0.36, sz: 98,  rot: -7.5, role: 'part' },    // 6: f
      { nx: 0.22, ny: 0.40, sz: 96,  rot:  6.0, role: 'part' },    // 7: o
      { nx: 0.34, ny: 0.35, sz: 98,  rot: -6.5, role: 'part' },    // 8: r
      { nx: 0.45, ny: 0.40, sz: 88,  rot: 11.0, role: 'part' },    // 9: -
      { nx: 0.58, ny: 0.35, sz: 214, rot: -8.0, role: 'climax' },  // 10: y
      { nx: 0.71, ny: 0.41, sz: 204, rot:  6.5, role: 'climax' },  // 11: o
      { nx: 0.84, ny: 0.34, sz: 214, rot: -7.0, role: 'climax' },  // 12: u
      { nx: 0.97, ny: 0.26, sz: 258, rot: 10.5, role: 'bang' },    // 13: !

      // Clause B: S-t-r-e-a-m  -t-o-  y-o-u-!
      { nx: 0.08, ny: 0.64, sz: 262, rot: -8.5, role: 'heroCap' }, // 14: S
      { nx: 0.27, ny: 0.70, sz: 144, rot:  6.0, role: 'root' },    // 15: t
      { nx: 0.39, ny: 0.62, sz: 144, rot: -6.5, role: 'root' },    // 16: r
      { nx: 0.51, ny: 0.71, sz: 144, rot:  7.5, role: 'root' },    // 17: e
      { nx: 0.63, ny: 0.63, sz: 144, rot: -5.5, role: 'root' },    // 18: a
      { nx: 0.77, ny: 0.70, sz: 150, rot:  6.5, role: 'root' },    // 19: m
      { nx: 0.14, ny: 0.90, sz: 88,  rot: -10.0, role: 'part' },   // 20: -
      { nx: 0.26, ny: 0.94, sz: 98,  rot:  7.0, role: 'part' },    // 21: t
      { nx: 0.38, ny: 0.89, sz: 96,  rot: -6.0, role: 'part' },    // 22: o
      { nx: 0.49, ny: 0.94, sz: 88,  rot: 10.0, role: 'part' },    // 23: -
      { nx: 0.61, ny: 0.89, sz: 216, rot: -7.5, role: 'climax' },  // 24: y
      { nx: 0.74, ny: 0.95, sz: 206, rot:  6.5, role: 'climax' },  // 25: o
      { nx: 0.86, ny: 0.88, sz: 216, rot: -7.0, role: 'climax' },  // 26: u
      { nx: 0.98, ny: 0.78, sz: 264, rot: 11.0, role: 'bang' }     // 27: !
    ];

    // Curated symmetric 3-tier Left/Right Flank layout for subIdx === 2 (`flankSplit`: center [660..1260] 100% clear for morphB heroine!)
    const flank28 = [
      // Left Wing (Clause A: P-u-l-s-e - f-o-r - y-o-u !)
      { x: 175, y: 245, sz: 236 }, { x: 325, y: 222, sz: 136 }, { x: 420, y: 270, sz: 136 }, { x: 515, y: 222, sz: 140 }, { x: 610, y: 268, sz: 136 },
      { x: 155, y: 470, sz: 84  }, { x: 265, y: 498, sz: 96  }, { x: 375, y: 462, sz: 94  }, { x: 485, y: 500, sz: 96  }, { x: 590, y: 465, sz: 84  },
      { x: 155, y: 755, sz: 196 }, { x: 285, y: 800, sz: 188 }, { x: 415, y: 745, sz: 196 }, { x: 565, y: 765, sz: 236 },
      // Right Wing (Clause B: S-t-r-e-a-m - t-o - y-o-u !)
      { x: 1350, y: 248, sz: 238 }, { x: 1478, y: 220, sz: 130 }, { x: 1558, y: 268, sz: 130 }, { x: 1638, y: 222, sz: 130 }, { x: 1718, y: 268, sz: 130 }, { x: 1800, y: 224, sz: 132 },
      { x: 1345, y: 475, sz: 84  }, { x: 1470, y: 505, sz: 96  }, { x: 1598, y: 470, sz: 94  }, { x: 1728, y: 505, sz: 84  },
      { x: 1362, y: 755, sz: 192 }, { x: 1482, y: 800, sz: 186 }, { x: 1602, y: 745, sz: 192 }, { x: 1748, y: 765, sz: 238 }
    ];

    for (let i = 0; i < Math.min(words.length, layout28.length); i++) {
      const wObj = words[i];
      if (!wObj || t < wObj.start) continue;

      const spec = layout28[i];
      const isFlank = (zoneMode === 'flankSplit');
      const flk = isFlank ? flank28[i] : null;
      const effSz = flk ? flk.sz : spec.sz;
      const tx = flk ? flk.x : core.clamp(xOrigin + spec.nx * xSpan, 125, 1795);
      const ty = flk ? flk.y : core.clamp(yTop + spec.ny * ySpan, 145, 855);

      const dt = t - wObj.start;
      const pIn = core.clamp(dt / 0.16, 0, 1);
      const spring = core.ease.outBack(pIn, 2.25);
      const ang = i * 2.39996;
      const rawX = tx + Math.cos(ang) * (1 - spring) * (isFlank ? 95 : 165);
      const curX = isFlank ? (i < 14 ? core.clamp(rawX, 118, 635) : core.clamp(rawX, 1285, 1812)) : rawX;
      const curY = core.clamp(ty + Math.sin(ang) * (1 - spring) * (isFlank ? 95 : 145), 140, 865);
      const sc = core.lerp(1.95, 1.0, spring) + kick * (effSz >= 210 ? 0.06 : 0.03);
      const isFresh = dt < 0.12;

      if (dt < 0.22) {
        drawStarSpark(ctx, curX, curY, (effSz * 0.20) * (1 - dt / 0.22) + 8, t * 5 + i, i % 2 === 0 ? GOLD : CRIMSON);
      }

      if (isFresh || spec.role === 'heroCap' || spec.role === 'bang') {
        const boxCol = isFresh ? CRIMSON : (spec.role === 'bang' ? GOLD : (i < 14 ? CRIMSON : CYAN));
        const txtCol = (boxCol === GOLD || boxCol === CYAN) ? INK : BONE;
        drawDieCutStamp(ctx, wObj.w, curX, curY, effSz * sc, spec.rot, {
          mono: true,
          boxCol,
          txtCol,
          borderCol: boxCol === CRIMSON ? GOLD : BONE,
          shadowCol: boxCol === CYAN ? CRIMSON : CYAN,
          padRatio: 0.14
        });
      } else if (spec.role === 'climax') {
        // Bold high-contrast outlined letters (`188-216px`) with hard drop-shadow so `y-o-u` never block each other!
        drawDieCutStamp(ctx, wObj.w, curX, curY, effSz * sc, spec.rot, {
          mono: true,
          txtCol: (i % 2 === 0) ? GOLD : CYAN,
          outlineCol: INK,
          shadowCol: CRIMSON
        });
      } else if (spec.role === 'part') {
        drawDieCutStamp(ctx, wObj.w, curX, curY, effSz * sc, spec.rot, {
          mono: true,
          circle: true,
          boxCol: COBALT,
          txtCol: BONE,
          borderCol: CYAN
        });
      } else {
        drawDieCutStamp(ctx, wObj.w, curX, curY, effSz * sc, spec.rot, {
          mono: true,
          txtCol: BONE,
          outlineCol: INK,
          shadowCol: i < 14 ? CYAN : GOLD
        });
      }
    }
  }

  window.registerCortexPlate('P10_jcore_blitz', {
    render(ctx, st, core) {
      const { W, H, TAU, clamp, lerp, prog, ease, beatAt, frameIdx } = core;
      const cad = window.Cortex25D;
      const t = st.t;
      const fIdx = frameIdx(t);
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const snare = st.snareSnap ?? st.snareEnv ?? st.snare ?? 0;

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      let isPaper = false;
      let outBg = INK;
      let outFg = CYAN;

      // ======================================================================
      // S02_JCORE_DROP_A (112.10 - 120.73s, 8 Hyper-Cuts ~1.08s each)
      // ======================================================================
      if (t < 113.18) {
        // CUT 01: Multi-Hue High-Velocity Lissajous Rose Laser Curve + Staggered Kanji Seals
        outBg = INK; outFg = CYAN;
        const u = prog(t, 112.10, 113.18, ease.outExpo);
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = PANEL;
        ctx.fillRect(64, 68, W - 128, H - 136);
        drawBurinHatch(ctx, 64, 68, 360, H - 136, 0.68, 13, 1.4, SLATE);
        drawBurinHatch(ctx, W - 424, 68, 360, H - 136, -0.68, 13, 1.4, SLATE);

        drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 480, 155, 130, 4, COBALT, 2.0, t * 1.2);
        drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 310, 100, 84, 3, GOLD, 1.5, -t * 1.6);

        const cx = W * 0.5, cy = H * 0.48;
        const linU = clamp((t - 112.10) / 1.08, 0, 1);
        const roseR = lerp(300, 465, linU) + kick * 48;
        const phase = t * (193.5 / 60) * TAU * 0.85;

        // High-speed frameIdx-driven radial laser pulses across full stage (#71 112.60-113.10s boost!)
        for (let r = 0; r < 28; r++) {
          const a = (r / 28) * TAU + t * 1.8;
          const r0 = 180 + posMod(r * 41 - fIdx * 18, 360);
          ctx.strokeStyle = r % 4 === 0 ? GOLD : (r % 2 === 0 ? CRIMSON : CYAN);
          ctx.lineWidth = r % 4 === 0 ? 3.6 : 2.0;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * 0.82);
          ctx.lineTo(cx + Math.cos(a) * (r0 + 240), cy + Math.sin(a) * (r0 + 240) * 0.82);
          ctx.stroke();
        }

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((t - 112.10) * 1.35);
        for (let pass = 0; pass < 2; pass++) {
          ctx.strokeStyle = pass === 0 ? CRIMSON : CYAN;
          ctx.lineWidth = pass === 0 ? 7 : 4.5;
          ctx.beginPath();
          for (let i = 0; i <= 360; i++) {
            const s = (i / 360) * TAU * 3 + pass * 0.12;
            const env = Math.cos((5 / 3) * s + phase * 0.8);
            const rx = Math.cos(s) * env * roseR * 1.30 + Math.sin(4 * s - phase) * 54;
            const ry = Math.sin(s) * env * roseR * 0.84 + Math.cos(3 * s + phase) * 40;
            if (i === 0) ctx.moveTo(rx, ry); else ctx.lineTo(rx, ry);
          }
          ctx.stroke();
        }
        ctx.restore();

        // Individual non-linear rotated Kanji seals (`心 / 拍 / 同 / 期` + `193.5`)
        drawDieCutStamp(ctx, '心', 520, 420, 248, -8.0, { boxCol: CRIMSON, txtCol: BONE, borderCol: GOLD, shadowCol: CYAN, serif: true });
        drawDieCutStamp(ctx, '拍', 790, 520, 224,  6.5, { boxCol: BONE,    txtCol: INK,  borderCol: CRIMSON, shadowCol: COBALT });
        drawDieCutStamp(ctx, '同', 1075, 415, 224, -6.5, { boxCol: CYAN,   txtCol: INK,  borderCol: BONE, shadowCol: CRIMSON });
        drawDieCutStamp(ctx, '期', 1355, 515, 244,  7.5, { boxCol: GOLD,   txtCol: INK,  borderCol: INK,  shadowCol: CRIMSON, serif: true });
        drawDieCutStamp(ctx, '193.5', 960, 725, 138, -4.0, { mono: true, boxCol: PANEL, txtCol: GOLD, borderCol: CYAN, shadowCol: CRIMSON });

        drawS02TokenTelemetry(ctx, core, t, kick, false);
        drawBlitzFrame(ctx, W, H, CYAN, SLATE, CRIMSON, INK, 'P10 // CUT_01 · LISSAJOUS_ROSE', '193.5_BPM_LOCK');
      }

      else if (t < 114.26) {
        // CUT 02: W-01..W-05 Diagonal Window Cascade on Warm Archival Paper
        outBg = PAPER; outFg = CHAR_INK; isPaper = true;
        ctx.fillStyle = PAPER;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = PAPER_PANEL;
        ctx.fillRect(48, 56, 320, H - 112);
        drawBurinHatch(ctx, 48, 56, 320, H - 112, 0.72, 12, 1.5, LIGHT_SLATE);
        drawBurinHatch(ctx, W - 260, 56, 212, H - 112, -0.72, 12, 1.5, LIGHT_SLATE);

        const countP = prog(t, 113.18, 114.12, ease.outExpo);
        drawLayeredWindowCascade(ctx, W, H, t, fIdx, true, 1, countP, 1);

        drawDieCutStamp(ctx, 'W-01', 265, 215, 148, -7.5, { mono: true, boxCol: COBALT, txtCol: BONE, borderCol: BONE, shadowCol: CRIMSON });
        drawDieCutStamp(ctx, 'W-05', 565, 315, 156,  6.5, { mono: true, boxCol: CRIMSON, txtCol: BONE, borderCol: GOLD, shadowCol: CHAR_INK });
        drawS02TokenTelemetry(ctx, core, t, kick, true);
        drawBlitzFrame(ctx, W, H, CHAR_INK, MID_SLATE, CRIMSON, BONE, 'P10 // CUT_02 · WINDOW_CASCADE_A', 'POLARITY: PAPER');
      }

      else if (t < 115.34) {
        // CUT 03: W-06..W-10 Counter-Diagonal Multi-Hue Window Cascade
        outBg = INK; outFg = CRIMSON;
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);
        drawBurinHatch(ctx, 0, 0, 280, H, 0.65, 13, 1.4, SLATE);
        drawBurinHatch(ctx, W - 280, 0, 280, H, -0.65, 13, 1.4, SLATE);

        const countP = prog(t, 114.26, 115.18, ease.outExpo);
        drawLayeredWindowCascade(ctx, W, H, t, fIdx, false, 6, countP, -1);

        drawDieCutStamp(ctx, '193.5', 790, 765, 224, -6.0, { mono: true, boxCol: CRIMSON, txtCol: BONE, borderCol: GOLD, shadowCol: CYAN });
        drawDieCutStamp(ctx, 'BPM', 1245, 710, 142, 8.0, { mono: true, boxCol: GOLD, txtCol: INK, borderCol: BONE, shadowCol: COBALT });
        drawS02TokenTelemetry(ctx, core, t, kick, false);
        drawBlitzFrame(ctx, W, H, CRIMSON, SLATE, GOLD, BONE, 'P10 // CUT_03 · WINDOW_CASCADE_B [W-10/10]', 'CRIMSON_OVERDRIVE');
      }

      else if (t < 116.42) {
        // CUT 04: Multi-Hue Haloflux Barrel-Roll + Staggered `硝 / 子 / 箱` Stamps
        outBg = INK; outFg = CYAN;
        const u = prog(t, 115.34, 116.42, ease.inOutCubic);
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = PANEL;
        ctx.beginPath();
        ctx.arc(W * 0.5, H * 0.5, 510, 0, TAU);
        ctx.fill();
        drawBurinHatch(ctx, 48, 56, 300, H - 112, 0.58, 12, 1.4, SLATE);
        drawBurinHatch(ctx, W - 348, 56, 300, H - 112, -0.58, 12, 1.4, SLATE);

        ctx.save();
        ctx.translate(W * 0.5, H * 0.48);
        ctx.rotate(lerp(-0.95, 0.55, u));
        for (let r = 1; r <= 7; r++) {
          ctx.strokeStyle = r === 3 ? GOLD : (r === 6 ? CRIMSON : (r % 2 === 0 ? CYAN : COBALT));
          ctx.lineWidth = r % 2 === 0 ? 6 : 2.8;
          ctx.beginPath();
          ctx.ellipse(0, 0, Math.max(4, r * 136), Math.max(4, r * 66), 0, 0, TAU);
          ctx.stroke();
        }
        ctx.restore();

        drawDieCutStamp(ctx, '硝', 595, 455, 248, -8.5, { boxCol: COBALT, txtCol: BONE, borderCol: CYAN, shadowCol: CRIMSON, serif: true });
        drawDieCutStamp(ctx, '子', 895, 535, 222,  6.5, { boxCol: GOLD,   txtCol: INK,  borderCol: INK,  shadowCol: COBALT });
        drawDieCutStamp(ctx, '箱', 1215, 445, 262, -6.0, { boxCol: BONE,  txtCol: INK,  borderCol: CRIMSON, shadowCol: CYAN, serif: true });
        drawDieCutStamp(ctx, 'SYNC', 1485, 625, 118, 9.0, { mono: true, boxCol: CRIMSON, txtCol: BONE, borderCol: GOLD, shadowCol: INK });

        drawS02TokenTelemetry(ctx, core, t, kick, false);
        drawBlitzFrame(ctx, W, H, CYAN, SLATE, GOLD, INK, 'P10 // CUT_04 · HALOFLUX_BARREL_ROLL', 'OPTICAL_LOCK');
      }

      else if (t < 117.50) {
        // CUT 05: Inverted Manuscript Paper Connectome Hyper-Dive (`fallback` for P26)
        outBg = PAPER; outFg = CHAR_INK; isPaper = true;
        const u = prog(t, 116.42, 117.50, ease.outCubic);
        ctx.fillStyle = PAPER;
        ctx.fillRect(0, 0, W, H);
        drawBurinHatch(ctx, 48, 56, 320, H - 112, 0.65, 12, 1.4, LIGHT_SLATE);
        drawBurinHatch(ctx, W - 368, 56, 320, H - 112, -0.65, 12, 1.4, LIGHT_SLATE);

        ctx.save();
        ctx.translate(W * 0.5, H * 0.48);
        ctx.rotate(u * 1.4);
        for (let k = 1; k <= 12; k++) {
          const rad = Math.max(8, posMod(k * 78 - fIdx * 10.4, 936));
          ctx.strokeStyle = k % 4 === 0 ? CRIMSON : (k % 3 === 0 ? COBALT : CHAR_INK);
          ctx.lineWidth = Math.max(2, rad * 0.012);
          ctx.strokeRect(-rad * 1.2, -rad * 0.72, rad * 2.4, rad * 1.44);
        }
        ctx.restore();

        drawDieCutStamp(ctx, '高', 490, 440, 236, -8.0, { boxCol: CRIMSON, txtCol: BONE, borderCol: GOLD, shadowCol: CHAR_INK, serif: true });
        drawDieCutStamp(ctx, '周', 775, 535, 222,  6.5, { boxCol: CHAR_INK, txtCol: BONE, borderCol: CYAN, shadowCol: GOLD });
        drawDieCutStamp(ctx, '波', 1070, 435, 240, -6.5, { boxCol: COBALT, txtCol: BONE, borderCol: BONE, shadowCol: CRIMSON, serif: true });
        drawDieCutStamp(ctx, '回', 1350, 530, 224,  7.5, { boxCol: GOLD,   txtCol: INK,  borderCol: INK,  shadowCol: COBALT });

        drawS02TokenTelemetry(ctx, core, t, kick, true);
        drawBlitzFrame(ctx, W, H, CHAR_INK, MID_SLATE, COBALT, BONE, 'P10 // CUT_05 · INVERTED_TUNNEL_3400Z', 'MATRIX_OPEN');
      }

      else if (t < 118.58) {
        // CUT 06: Multi-Hue Snare-Locked Die-Cut Sticker Blitz
        outBg = INK; outFg = GOLD;
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = PANEL;
        ctx.fillRect(64, 108, W - 128, H - 216);
        drawBurinHatch(ctx, 64, 108, W - 128, H - 216, 0.52, 16, 1.4, SLATE);

        for (let x = -80; x < W + 80; x += 72) {
          ctx.fillStyle = (posMod(x, 144) === 0) ? GOLD : CRIMSON;
          ctx.beginPath();
          ctx.moveTo(x, 54); ctx.lineTo(x + 36, 54); ctx.lineTo(x + 12, 92); ctx.lineTo(x - 24, 92);
          ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(x, H - 54); ctx.lineTo(x + 36, H - 54); ctx.lineTo(x + 12, H - 92); ctx.lineTo(x - 24, H - 92);
          ctx.closePath(); ctx.fill();
        }

        const stickers = [
          { txt: '演算', x: 380, y: 275, sz: 226, tIn: 117.50, rot: -8.5, box: GOLD,    txtCol: INK,  bdr: INK,  sh: CRIMSON },
          { txt: 'ZERO_LATENCY', x: 1380, y: 270, sz: 124, tIn: 117.64, rot: 7.0, box: CYAN, txtCol: INK, bdr: BONE, sh: COBALT, mono: true },
          { txt: '36.2C', x: 465, y: 720, sz: 196, tIn: 117.78, rot: 6.5, box: BONE,   txtCol: INK,  bdr: CRIMSON, sh: CYAN, mono: true },
          { txt: '心拍', x: 1470, y: 715, sz: 232, tIn: 117.92, rot: -7.5, box: CRIMSON, txtCol: BONE, bdr: GOLD, sh: CYAN },
          { txt: 'MATRIX', x: 945, y: 505, sz: 212, tIn: 118.06, rot: -4.5, box: COBALT, txtCol: BONE, bdr: GOLD, sh: CRIMSON, mono: true }
        ];
        for (const s of stickers) {
          if (t >= s.tIn) {
            const p = prog(t, s.tIn, s.tIn + 0.16, ease.outBack);
            const sc = lerp(1.48, 1.0, clamp(p, 0, 1.2));
            drawDieCutStamp(ctx, s.txt, s.x, s.y, s.sz * sc, s.rot, {
              mono: s.mono,
              boxCol: s.box,
              txtCol: s.txtCol,
              borderCol: s.bdr,
              shadowCol: s.sh
            });
          }
        }
        drawS02TokenTelemetry(ctx, core, t, kick, false);
        drawBlitzFrame(ctx, W, H, GOLD, SLATE, CRIMSON, INK, 'P10 // CUT_06 · DIE_CUT_STICKER_BLITZ', 'SNARE_LOCKED');
      }

      else if (t < 119.65) {
        // CUT 07: Multi-Hue Chirp-Sweep Oscillator + `24.0 -> 160.0` + `HZ`
        outBg = INK; outFg = CRIMSON;
        const u = prog(t, 118.58, 119.65, ease.inOutCubic);
        const hz = lerp(24.0, 160.0, u);
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = PANEL;
        ctx.fillRect(64, 480, W - 128, 370);
        drawBurinHatch(ctx, 64, 480, W - 128, 370, 0.45, 14, 1.4, SLATE);

        for (let pass = 0; pass < 2; pass++) {
          ctx.strokeStyle = pass === 0 ? CYAN : CRIMSON;
          ctx.lineWidth = pass === 0 ? 4 : 7;
          ctx.beginPath();
          for (let x = 84; x <= W - 84; x += 6) {
            const ux = (x - 84) / (W - 168);
            const freq = lerp(5, 38, ux * u);
            const amp = Math.sin(ux * Math.PI) * (135 + u * 95 + kick * 36);
            const py = 665 + Math.sin(ux * freq * TAU - t * 38 + pass * 0.8) * amp;
            if (x === 84) ctx.moveTo(x, py); else ctx.lineTo(x, py);
          }
          ctx.stroke();
        }

        drawDieCutStamp(ctx, hz.toFixed(1), 785, 285, 248, -5.5, {
          mono: true, boxCol: CRIMSON, txtCol: BONE, borderCol: GOLD, shadowCol: CYAN
        });
        drawDieCutStamp(ctx, 'HZ', 1325, 235, 178, 8.0, {
          mono: true, boxCol: GOLD, txtCol: INK, borderCol: BONE, shadowCol: COBALT
        });
        drawS02TokenTelemetry(ctx, core, t, kick, false);
        drawBlitzFrame(ctx, W, H, CRIMSON, SLATE, GOLD, BONE, 'P10 // CUT_07 · CHIRP_OSCILLATOR', 'SWEEP -> 160.0HZ');
      }

      else if (t < 120.73) {
        // CUT 08: Multi-Hue Solari Split-Flap Cards + Radial Speed-Lines
        outBg = INK; outFg = CYAN;
        const u = prog(t, 119.65, 120.45, ease.outExpo);
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);
        drawBurinHatch(ctx, 0, 0, 320, H, 0.62, 13, 1.4, SLATE);
        drawBurinHatch(ctx, W - 320, 0, 320, H, -0.62, 13, 1.4, SLATE);

        for (let i = 0; i < 40; i++) {
          const a = (i / 40) * TAU + t * 0.8;
          ctx.strokeStyle = i % 5 === 0 ? GOLD : (i % 3 === 0 ? CRIMSON : CYAN);
          ctx.lineWidth = i % 4 === 0 ? 4 : 2.5;
          ctx.beginPath();
          ctx.moveTo(W * 0.5 + Math.cos(a) * 380, H * 0.5 + Math.sin(a) * 260);
          ctx.lineTo(W * 0.5 + Math.cos(a) * 1180, H * 0.5 + Math.sin(a) * 1180);
          ctx.stroke();
        }

        const flaps = ['1', '6', '0', 'H', 'Z', '_', 'O', 'K'];
        const flapCols = [CYAN, CYAN, CYAN, GOLD, GOLD, PANEL, CRIMSON, CRIMSON];
        for (let f = 0; f < 8; f++) {
          const fx = 280 + f * 194;
          const fy = 335 + (f % 2 === 0 ? -24 : 24);
          const flipScaleY = Math.abs(Math.cos((1 - clamp((u * 1.4) - f * 0.06, 0, 1)) * Math.PI * 3));
          ctx.save();
          ctx.translate(fx, fy);
          ctx.rotate((f % 2 === 0 ? -4 : 4) * Math.PI / 180);
          ctx.scale(1, Math.max(0.14, flipScaleY));
          ctx.fillStyle = flapCols[f];
          ctx.fillRect(-78, -108, 156, 216);
          ctx.strokeStyle = BONE;
          ctx.lineWidth = 3;
          ctx.strokeRect(-74, -104, 148, 208);
          ctx.fillStyle = INK;
          ctx.fillRect(-78, -3, 156, 6);
          ctx.fillStyle = (flapCols[f] === CRIMSON || flapCols[f] === PANEL) ? BONE : INK;
          ctx.font = JP_MONO(900, 142);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(flaps[f], 0, 4);
          ctx.restore();
        }

        drawDieCutStamp(ctx, 'ARTCORE', 690, 695, 168, -5.5, { mono: true, boxCol: BONE, txtCol: INK, borderCol: CRIMSON, shadowCol: CYAN });
        drawDieCutStamp(ctx, '193.5', 1265, 675, 168, 6.5, { mono: true, boxCol: GOLD, txtCol: INK, borderCol: INK, shadowCol: CRIMSON });
        drawS02TokenTelemetry(ctx, core, t, kick, false);
        drawBlitzFrame(ctx, W, H, CYAN, SLATE, CRIMSON, INK, 'P10 // CUT_08 · SPLIT_FLAP_LOCK', 'READY_FOR_L21');
      }

      // ======================================================================
      // L21_TRACE_SYNC (120.73 - 123.17s): Three Whip-Pan Staircase Hammers
      // Tokens (20): [0..5] TRACE! | [6..10] SYNC! | [11..19] 160 HERTZ!
      // ======================================================================
      else if (t < 123.17) {
        const cue21 = core.cueById('L21_TRACE_SYNC');
        const tSync = (cue21 && cue21.words && cue21.words[6]) ? cue21.words[6].start : 121.43;
        const tHz = (cue21 && cue21.words && cue21.words[11]) ? cue21.words[11].start : 122.01;

        let cutIdx = 0;
        let t0 = 120.73;
        let range = [0, 5];
        if (t >= tHz) { cutIdx = 2; t0 = tHz; range = [11, 19]; }
        else if (t >= tSync) { cutIdx = 1; t0 = tSync; range = [6, 10]; }

        const isPaperStage = (cutIdx === 0);
        isPaper = isPaperStage;
        outBg = isPaperStage ? PAPER : INK;
        outFg = isPaperStage ? CHAR_INK : (cutIdx === 1 ? CYAN : CRIMSON);

        const dt = Math.max(0, t - t0);
        const settle = prog(dt, 0, 0.20, ease.outExpo);
        const startRot = cutIdx === 0 ? 0 : (cutIdx === 1 ? Math.PI * 0.36 : -Math.PI * 0.36);
        const slideX = cutIdx === 0 ? lerp(-520, 0, settle) : 0;

        ctx.fillStyle = outBg;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = isPaperStage ? PAPER_PANEL : PANEL;
        ctx.fillRect(56, 68, W - 112, H - 136);
        drawBurinHatch(ctx, 56, 68, 360, H - 136, 0.72, 13, 1.5, isPaperStage ? LIGHT_SLATE : SLATE);
        drawBurinHatch(ctx, W - 416, 68, 360, H - 136, -0.72, 13, 1.5, isPaperStage ? LIGHT_SLATE : SLATE);

        ctx.save();
        ctx.translate(W * 0.5 + slideX, H * 0.5);
        ctx.rotate(lerp(startRot, 0, settle));
        ctx.translate(-W * 0.5, -H * 0.5);

        if (cutIdx === 0) {
          for (let i = 0; i < 14; i++) {
            const y = 110 + i * 62;
            const hx = posMod(dt * 3200 + i * 240, W + 500) - 250;
            ctx.fillStyle = i % 3 === 0 ? CRIMSON : (i % 2 === 0 ? COBALT : CHAR_INK);
            ctx.fillRect(Math.round(hx - 320), y, 320, i % 2 === 0 ? 8 : 3);
          }
        } else if (cutIdx === 1) {
          const rOut = Math.max(12, lerp(610, 420, settle));
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 6;
          ctx.beginPath(); ctx.arc(W * 0.5, H * 0.50, rOut, 0, TAU); ctx.stroke();
          ctx.strokeStyle = GOLD;
          ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.arc(W * 0.5, H * 0.50, Math.max(8, rOut * 0.76), 0, TAU); ctx.stroke();
        } else {
          const decay = Math.exp(-dt * 1.6);
          for (let i = 0; i < 28; i++) {
            const uS = i / 27;
            const by = 96 + uS * (H - 192);
            const amp = (26 + (1 - Math.abs(uS - 0.5)) * 52 + kick * 24) * decay;
            ctx.strokeStyle = i % 4 === 0 ? GOLD : (i % 2 === 0 ? CRIMSON : CYAN);
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            for (let x = 72; x <= W - 72; x += 32) {
              const ux = (x - 72) / (W - 144);
              const wy = by + Math.sin(ux * Math.PI * (2 + (i % 4))) * Math.cos(dt * 68 + i) * amp * Math.sin(ux * Math.PI);
              if (x === 72) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
            }
            ctx.stroke();
          }
        }

        drawL21HammerStaircase(ctx, core, t, kick, cutIdx, range, isPaperStage);
        ctx.restore();

        const tags = ['TRACE!', 'SYNC!', '160_HERTZ!'];
        drawBlitzFrame(
          ctx, W, H,
          isPaperStage ? CHAR_INK : outFg,
          isPaperStage ? MID_SLATE : SLATE,
          cutIdx === 2 ? GOLD : CRIMSON,
          isPaperStage ? BONE : INK,
          `P10 // CUT_${String(cutIdx + 9).padStart(2, '0')} · L21_HAMMER`,
          tags[cutIdx]
        );
      }

      // ======================================================================
      // L22_PULSE_FOR_YOU (123.17 - 130.33s, 7 Rapid Cuts ~1.02s each)
      // Tokens (28): [0..13] Pulse-for-you! | [14..27] Stream-to-you! (`285-305px` Hero!)
      // Cuts 17..18: Colossal 580px Japanese Kanji `透` Multi-Hue Stencil Portal!
      // ======================================================================
      else {
        // V6: Zero 12.9Hz epileptic strobe & zero premature morph flashing!
        // Lock stage polarity to clean ~1.02s cut cadence (`subIdx`, <= 1 flip/sec) & single sprint plate `C14`!
        const formKey = 'human';
        const subIdx = Math.min(6, Math.max(0, Math.floor((t - 123.17) / 1.023)));
        const stageModes = [
          { bg: INK,   panel: PANEL,       hatch: SLATE,       rim: GOLD, spA: GOLD, spB: GOLD },
          { bg: PAPER, panel: PAPER_PANEL, hatch: LIGHT_SLATE, rim: GOLD, spA: GOLD, spB: SLATE },
          { bg: INK,   panel: PANEL,       hatch: SLATE,       rim: GOLD, spA: GOLD, spB: GOLD },
          { bg: INK,   panel: PANEL,       hatch: SLATE,       rim: GOLD, spA: GOLD, spB: GOLD },
          { bg: PAPER, panel: PAPER_PANEL, hatch: LIGHT_SLATE, rim: GOLD, spA: GOLD, spB: SLATE }
        ];
        const stg = (subIdx >= 5)
          ? { bg: INK, panel: PANEL, hatch: SLATE, rim: GOLD, spA: GOLD, spB: GOLD }
          : stageModes[subIdx % stageModes.length];

        isPaper = (stg.bg === PAPER);
        outBg = stg.bg;
        outFg = isPaper ? CHAR_INK : stg.rim;

        ctx.fillStyle = stg.bg;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = stg.panel;
        ctx.fillRect(52, 62, 340, H - 124);
        ctx.fillRect(W - 392, 62, 340, H - 124);
        drawBurinHatch(ctx, 52, 62, W - 104, H - 124, 0.62, 14, 1.5, stg.hatch, fIdx * 0.7);
        drawBurinHatch(ctx, 52, 62, 340, H - 124, -0.62, 12, 1.6, stg.hatch, -fIdx * 0.6);
        drawBurinHatch(ctx, W - 392, 62, 340, H - 124, -0.62, 12, 1.6, stg.hatch, fIdx * 0.6);

        // Deterministic frameIdx-driven multi-hue radial speed-lines (zero Math.floor(t * ...))
        for (let i = 0; i < 36; i++) {
          const a = (i / 36) * TAU + subIdx * 0.38 + fIdx * 0.018;
          const r0 = 260 + posMod(i * 37 - fIdx * 17, 240);
          ctx.strokeStyle = i % 4 === 0 ? stg.spA : (i % 2 === 0 ? stg.spB : stg.hatch);
          ctx.lineWidth = i % 3 === 0 ? 4.0 : 2.2;
          ctx.beginPath();
          ctx.moveTo(W * 0.5 + Math.cos(a) * r0, H * 0.5 + Math.sin(a) * r0);
          ctx.lineTo(W * 0.5 + Math.cos(a) * 1240, H * 0.5 + Math.sin(a) * 1240);
          ctx.stroke();
        }

        if (t < 128.28) {
          let zoneMode = 'left';
          const v6 = window.CortexV6;
          if (t < 124.85) {
            // Segment 1 (123.17-124.85s, 1.68s): Sprint Speedometer & Mach Shock-Cone MG
            const u1 = clamp((t - 123.17) / 1.68, 0, 1);
            drawGuillocheRosette(ctx, 1420, 540, 390, 125, 102, 3, stg.spA, 2.2, t * 2.1);
            drawGuillocheRosette(ctx, 1420, 540, 235, 76, 62, 3, CRIMSON, 1.8, -t * 2.6);
            ctx.save();
            ctx.strokeStyle = isPaper ? CHAR_INK : CYAN;
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.arc(1420, 540, 290, -Math.PI * 0.78, lerp(-Math.PI * 0.78, Math.PI * 0.52, ease.outCubic(u1)));
            ctx.stroke();
            for (let k = 0; k < 4; k++) {
              const mr = ((t * 540 + k * 140) % 520) + 70;
              ctx.strokeStyle = k % 2 === 0 ? GOLD : CRIMSON;
              ctx.lineWidth = 2.4;
              ctx.beginPath();
              ctx.arc(1420, 540, mr, -0.9, 0.9);
              ctx.stroke();
            }
            ctx.restore();
            zoneMode = 'left';
          } else if (t < 126.65) {
            // Segment 2 (124.85-126.65s, 1.80s): SOLE pre-finale `C14` kinetic sprint full-bleed!
            const u2 = clamp((t - 124.85) / 1.80, 0, 1);
            if (v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C14')) {
              v6.drawLivingFullBleed(ctx, 'C14', {
                t, u: u2, kick,
                zoom0: 1.08, zoom1: 1.36, panX0: -60, panX1: 48, panY0: 20, panY1: -22,
                rot0: -0.025, rot1: 0.018, fx: 0.50, fy: 0.34, scrim: 0.24, isPaper: false
              });
            }
            isPaper = false;
            outBg = INK;
            outFg = GOLD;
            zoneMode = 'right';
          } else {
            // Segment 3 (126.65-128.28s, 1.63s): Glass Barrier Shatter & Pressure Shockwave MG
            const u3 = clamp((t - 126.65) / 1.63, 0, 1);
            drawGuillocheRosette(ctx, W * 0.5, 540, 380, 122, 98, 4, stg.spA, 2.2, -t * 2.4);
            drawGuillocheRosette(ctx, W * 0.5, 540, 240, 78, 62, 3, CRIMSON, 1.8, t * 2.9);
            ctx.save();
            for (let s = 0; s < 16; s++) {
              const sa = (s / 16) * TAU + s * 0.13;
              const dist = lerp(90, 740, ease.outCubic(u3)) + (s % 3) * 45;
              const sx = W * 0.5 + Math.cos(sa) * dist;
              const sy = 540 + Math.sin(sa) * dist;
              ctx.fillStyle = s % 3 === 0 ? CRIMSON : (s % 2 === 0 ? CYAN : GOLD);
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx + Math.cos(sa + 0.4) * 56, sy + Math.sin(sa + 0.4) * 56);
              ctx.lineTo(sx + Math.cos(sa - 0.3) * 38, sy + Math.sin(sa - 0.3) * 38);
              ctx.closePath();
              ctx.fill();
            }
            ctx.restore();
            zoneMode = 'flankSplit';
          }

          drawL22AutonomousCascade(ctx, core, t, kick, zoneMode);
        } else {
          // Segment 4 (128.28 - 130.33s, V7): Pure Surface-to-Abyss Plunge MG (0m -> -1024m, ZERO C15 duplicate!)
          const v6 = window.CortexV6;
          const diveU = clamp((t - 128.28) / (130.33 - 128.28), 0, 1);
          const prevRaw = ctx.__v6RawColor;
          ctx.save();
          ctx.__v6RawColor = true;
          const abyssGrad = ctx.createLinearGradient(0, 0, 0, H);
          abyssGrad.addColorStop(0, '#040814');
          abyssGrad.addColorStop(0.55, '#07172E');
          abyssGrad.addColorStop(1, '#02050B');
          ctx.fillStyle = abyssGrad;
          ctx.fillRect(0, 0, W, H);

          // Fast upward depth ruler ticks simulating rapid surface-to-abyss descent (0m -> -1024m)
          const tickShift = posMod(t * 1450, 90);
          for (let y = 72 - tickShift; y < H - 72; y += 90) {
            ctx.fillStyle = 'rgba(126, 196, 236, 0.34)';
            ctx.fillRect(92, y, 42, 3);
            ctx.fillRect(W - 134, y, 42, 3);
          }

          // Expanding luminous bathymetric sonar waves & deep pressure ribbons
          const cx = W * 0.5, cy = H * 0.48;
          for (let r = 0; r < 7; r++) {
            const rp = ((diveU * 2.1 + r / 7) % 1);
            const rad = lerp(45, 920, ease.outCubic(rp)) + kick * 24;
            ctx.strokeStyle = r % 2 === 0
              ? `rgba(236, 193, 110, ${((1 - rp) * 0.72).toFixed(3)})`
              : `rgba(56, 189, 248, ${((1 - rp) * 0.68).toFixed(3)})`;
            ctx.lineWidth = lerp(4.5, 1.4, rp);
            ctx.beginPath();
            ctx.arc(cx, cy, rad, 0, TAU);
            ctx.stroke();
          }
          ctx.font = JP_MONO(900, 34);
          ctx.fillStyle = '#38BDF8';
          ctx.textAlign = 'center';
          ctx.fillText(`DEPTH // -${Math.round(lerp(0, 1024, ease.inCubic(diveU)))}m`, cx, cy);
          ctx.__v6RawColor = prevRaw;
          ctx.restore();

          if (v6 && typeof v6.draw2D3DAtmosphereBridge === 'function') {
            v6.draw2D3DAtmosphereBridge(ctx, {
              t, kick, vpX: cx, vpY: cy,
              speedLines: 34, speedAlpha: 0.30, motes: 24, accent: '#ECC16E'
            });
          }

          // Dispersing kinetic `STREAM / TO YOU!` echo stamps framing the dive cleanly
          const slam = (v6 && v6.aeSlam) ? v6.aeSlam : ease.outExpo;
          const pIn = slam(clamp(diveU / 0.24, 0, 1));
          const fadeOut = 1 - clamp((diveU - 0.68) / 0.30, 0, 1);
          if (fadeOut > 0.02) {
            ctx.save();
            ctx.globalAlpha = fadeOut;
            const spread = diveU * 115;
            drawDieCutStamp(ctx, 'STREAM', 460 - spread, 255 - spread * 0.3, 138 * (0.72 + 0.28 * pIn), -6.5, {
              mono: true, boxCol: CYAN, txtCol: INK, borderCol: BONE, shadowCol: CRIMSON
            });
            drawDieCutStamp(ctx, 'TO YOU!', 1465 + spread, 745 + spread * 0.25, 146 * (0.72 + 0.28 * pIn), 6.0, {
              mono: true, boxCol: GOLD, txtCol: INK, borderCol: INK, shadowCol: CRIMSON
            });
            ctx.restore();
          }
        }

        drawBlitzFrame(
          ctx, W, H,
          isPaper ? CHAR_INK : CYAN,
          isPaper ? MID_SLATE : SLATE,
          CRIMSON,
          isPaper ? BONE : INK,
          `P10 // CUT_${subIdx + 12} · MORPH_B [${formKey.toUpperCase()}]`,
          subIdx >= 5 ? 'SONAR_DIVE -> P27' : '0.0PX_LOCK_16TH'
        );
      }

      ctx.restore();
      return {
        isPaper,
        bg: outBg,
        fg: outFg,
        duotone: { bg: outBg, fg: outFg },
        bloom: 0.20 + 0.16 * kick,
        ca: 0,
        flash: 0,
        shake: 0.22 * Math.max(kick, snare)
      };
    }
  });
})();
