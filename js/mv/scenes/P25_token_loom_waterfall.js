// ============================================================================
// Plate 25 — `P25_token_loom_waterfall.js` (`95.82s – 101.16s`, `L18_SPILLING_TOKENS`)
// Cue: `零れ出すトークンも一ミリ秒の遅延も` (16 Japanese tokens)
// Multi-Layer Optical Jacquard Loom Treatise (#52 & #53):
//   - Rich Multi-Tier Treatise Palettes:
//     * Dark Optical Mode (`#08090C` ground + `#111827` Jacquard housings +
//       `#334155`/`#64748B` weave grid & pruned candidates + `#38BDF8` cyan warp
//       + `#FAF8F5` bone glyphs + `#FBBF24` amber gold vernier & Guilloché seals
//       + `#FF2E55` crimson & `#FF8A3D` ember vocal burst stamps!)
//     * Jacquard Paper Mode (`#FAF8F5` cotton paper + `#E6EEF6` recesses +
//       `#94A3B8` weave grid + `#08090C` engraving ink + `#0376B8` cobalt shuttles
//       + `#FBBF24` gold vernier carriage + `#FF2E55` crimson active stamps!)
//   - Autonomous Nonlinear Per-Character Choreography across all 7 Sub-Cuts:
//     * Strong Kanji (`零 出 一 秒 遅延`) vs Katakana (`トークン ミリ`) vs
//       compact Hiragana (`れ す も の` shoulder seals & tags) scale contrast,
//       diagonal cascades, Tategaki columns, and woven constellation collage!
// ============================================================================
(function () {
  'use strict';

  const PLATE_ID = 'P25_token_loom_waterfall';
  const CUE_ID = 'L18_SPILLING_TOKENS';
  const T0 = 95.82;
  const T1 = 101.16;
  const W = 1920;
  const H = 1080;

  const PAL_CYAN = {
    bg: '#08090C',
    fg: '#38BDF8',
    card: '#111827',
    grid: '#1E293B',
    muted: '#64748B',
    ink: '#FAF8F5',
    cyan: '#38BDF8',
    cobalt: '#0284C7',
    gold: '#FBBF24',
    crimson: '#FF2E55',
    ember: '#FF8A3D',
    isPaper: false,
    tag: 'OPTICAL_WARP // MULTI_SIGNAL'
  };

  const PAL_PAPER = {
    bg: '#FAF8F5',
    fg: '#08090C',
    card: '#E6EEF6',
    grid: '#CBD5E1',
    muted: '#64748B',
    ink: '#08090C',
    cyan: '#0376B8',
    cobalt: '#0376B8',
    gold: '#FBBF24',
    crimson: '#FF2E55',
    ember: '#FF8A3D',
    isPaper: true,
    tag: 'JACQUARD_PLATE // BLUEPRINT_INK'
  };

  const ALT_CANDIDATES = [
    ['<eos>', '0.012'], ['の', '0.019'], ['が', '0.008'], ['に', '0.006'],
    ['は', '0.014'], ['を', '0.011'], ['<nl>', '0.005'], ['て', '0.009'],
    ['と', '0.007'], ['で', '0.004'], ['<pad>', '0.002'], ['から', '0.006']
  ];

  const FALLBACK_WORDS = [
    { w: '零', start: 95.820, end: 96.124 },
    { w: 'れ', start: 96.124, end: 96.428 },
    { w: '出', start: 96.428, end: 96.733 },
    { w: 'す', start: 96.733, end: 97.037 },
    { w: 'ト', start: 97.037, end: 97.341 },
    { w: 'ー', start: 97.341, end: 97.645 },
    { w: 'ク', start: 97.645, end: 97.949 },
    { w: 'ン', start: 97.949, end: 98.254 },
    { w: 'も', start: 98.254, end: 98.558 },
    { w: '一', start: 98.558, end: 98.862 },
    { w: 'ミ', start: 98.862, end: 99.166 },
    { w: 'リ', start: 99.166, end: 99.470 },
    { w: '秒', start: 99.470, end: 99.774 },
    { w: 'の', start: 99.774, end: 100.079 },
    { w: '遅延', start: 100.079, end: 100.596 },
    { w: 'も', start: 100.596, end: 100.900 }
  ];

  // Cut 6 Nonlinear Diagonal × Tategaki Woven Tapestry Collage (all 16 tokens, ZERO flat grid!)
  const TAPESTRY_COLLAGE_SPECS = [
    { x: 280,  y: 258, w: 206, h: 212, rot: -0.15, style: 'crimson' }, // 0: 零 (Kanji)
    { x: 432,  y: 178, w: 104, h: 108, rot:  0.22, style: 'circle'  }, // 1: れ (shoulder seal)
    { x: 375,  y: 528, w: 204, h: 210, rot:  0.12, style: 'cobalt'  }, // 2: 出 (Kanji)
    { x: 525,  y: 662, w: 106, h: 110, rot: -0.18, style: 'gold'    }, // 3: す (corner tag)
    { x: 678,  y: 238, w: 146, h: 148, rot: -0.10, style: 'ink'     }, // 4: ト (Tategaki #1)
    { x: 716,  y: 396, w: 140, h: 142, rot:  0.11, style: 'cobalt'  }, // 5: ー (Tategaki #2)
    { x: 674,  y: 556, w: 146, h: 148, rot: -0.12, style: 'ink'     }, // 6: ク (Tategaki #3)
    { x: 724,  y: 718, w: 146, h: 148, rot:  0.14, style: 'gold'    }, // 7: ン (Tategaki #4)
    { x: 892,  y: 785, w: 104, h: 108, rot: -0.20, style: 'circle'  }, // 8: も (particle seal)
    { x: 998,  y: 302, w: 214, h: 196, rot: -0.13, style: 'crimson' }, // 9: 一 (Kanji)
    { x: 1185, y: 214, w: 144, h: 146, rot:  0.16, style: 'cobalt'  }, // 10: ミ (Katakana)
    { x: 1242, y: 374, w: 144, h: 146, rot: -0.14, style: 'gold'    }, // 11: リ (Katakana)
    { x: 1102, y: 618, w: 222, h: 226, rot:  0.11, style: 'ink'     }, // 12: 秒 (Hero Kanji)
    { x: 1278, y: 536, w: 102, h: 106, rot:  0.23, style: 'circle'  }, // 13: の (shoulder seal)
    { x: 1515, y: 405, w: 282, h: 228, rot: -0.10, style: 'crimson' }, // 14: 遅延 (Compound Kanji)
    { x: 1608, y: 712, w: 138, h: 142, rot:  0.19, style: 'final'   }  // 15: も (Final Crimson/Gold Seal!)
  ];

  function wordLabel(wObj) {
    if (!wObj) return '';
    return String(wObj.w || wObj.word || '');
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function outExpo(x) {
    const c = clamp(x, 0, 1);
    return c >= 1 ? 1 : 1 - Math.pow(2, -10 * c);
  }

  function outBack(x) {
    const c = clamp(x, 0, 1);
    const k1 = 1.70158;
    const k3 = k1 + 1;
    return 1 + k3 * Math.pow(c - 1, 3) + k1 * Math.pow(c - 1, 2);
  }

  function hash01(n) {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return s - Math.floor(s);
  }

  function monoFont(weight, px) {
    return `${weight} ${Math.round(px)}px "JetBrains Mono", "Cascadia Mono", "Consolas", monospace`;
  }

  function jpFont(weight, px) {
    return `${weight} ${Math.round(px)}px "Noto Serif JP", "Yu Mincho", "MS PMincho", "Hiragino Mincho ProN", "Yu Gothic UI", serif`;
  }

  function jpSans(weight, px) {
    return `${weight} ${Math.round(px)}px "Hiragino Kaku Gothic ProN", "Yu Gothic UI", sans-serif`;
  }

  function getWords(core) {
    const cue = core && typeof core.cueById === 'function' ? core.cueById(CUE_ID) : null;
    if (cue && Array.isArray(cue.words) && cue.words.length > 0) {
      return cue.words;
    }
    return FALLBACK_WORDS;
  }

  function drawBurinBox(ctx, x, y, w, h, angle, pitch, lw, col) {
    if (w <= 2 || h <= 2) return;
    const step = Math.max(3, pitch);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.translate(x + w * 0.5, y + h * 0.5);
    ctx.rotate(angle);
    const diag = Math.hypot(w, h) * 0.62;
    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.beginPath();
    for (let yy = -diag; yy <= diag; yy += step) {
      ctx.moveTo(-diag, yy);
      ctx.lineTo(diag, yy);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawGuillocheWheel(ctx, cx, cy, R, r, d, loops, steps, lw, col, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.beginPath();
    const diff = R - r;
    const ratio = diff / r;
    const maxA = Math.PI * 2 * loops;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * maxA;
      const px = diff * Math.cos(a) + d * Math.cos(ratio * a);
      const py = diff * Math.sin(a) - d * Math.sin(ratio * a);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, R + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(6, Math.abs(diff - d) * 0.55), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Multi-Layer Tactile Split-Flap / Seal Renderer (`opts`: `{ rot, cardBg, glyphCol, rimCol, badgeCol, circle }`)
  function drawSplitFlapToken(ctx, text, cx, cy, cardW, cardH, openU, fg, bg, idxTag, probTag, opts) {
    const o = opts || {};
    const u = clamp(openU, 0, 1);
    const e = outExpo(u);
    const str = String(text ?? '');
    const rot = o.rot || 0;
    const cardBg = o.cardBg || bg;
    const glyphCol = o.glyphCol || fg;
    const rimCol = o.rimCol || fg;
    const badgeCol = o.badgeCol || '#FBBF24';
    const bevelCol = o.bevelCol || '#08090C';

    ctx.save();
    ctx.translate(cx, cy);
    if (rot !== 0) ctx.rotate(rot);

    if (o.circle) {
      const rad = Math.min(cardW, cardH) * 0.48;
      ctx.fillStyle = bevelCol;
      ctx.beginPath();
      ctx.arc(6, 7, rad, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = cardBg;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = rimCol;
      ctx.lineWidth = 3.2;
      ctx.stroke();

      if (u > 0.02 && str.length > 0) {
        ctx.font = jpSans(900, rad * 1.12);
        ctx.fillStyle = glyphCol;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(str, 0, rad * 0.05);
      }
      ctx.restore();
      return;
    }

    const x = -cardW * 0.5;
    const y = -cardH * 0.5;
    const bev = Math.round(6 + (1 - e) * 10);

    // Outer architectural drop-bevel (zero shadowBlur!)
    ctx.fillStyle = bevelCol;
    ctx.fillRect(x + bev, y + bev, cardW, cardH);

    // Card body
    ctx.fillStyle = cardBg;
    ctx.fillRect(x, y, cardW, cardH);
    ctx.strokeStyle = rimCol;
    ctx.lineWidth = 3.4;
    ctx.strokeRect(x, y, cardW, cardH);

    if (u < 0.45) {
      drawBurinBox(ctx, x + 5, y + 5, cardW - 10, cardH * 0.46, 0.42, 7, 1.5, rimCol);
    }

    // Mechanical hinge lugs
    ctx.fillStyle = badgeCol;
    ctx.fillRect(x - 6, -10, 8, 20);
    ctx.fillRect(x + cardW - 2, -10, 8, 20);

    // Glyph clipped with vertical flap-unfold scale
    if (u > 0.02 && str.length > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x + 4, y + 4, cardW - 8, cardH - 8);
      ctx.clip();
      ctx.translate(0, 4);
      ctx.scale(1, Math.max(0.18, e));
      const fSize = str.length > 1
        ? Math.min(cardH * 0.56, cardW * 0.44)
        : Math.min(cardH * 0.68, cardW * 0.72);
      ctx.font = cardW >= 180 ? jpFont(900, fSize) : jpSans(900, fSize);
      ctx.fillStyle = glyphCol;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(str, 0, 0);
      ctx.restore();
    }

    // Split-flap equatorial axle gap line
    ctx.fillStyle = cardBg;
    ctx.fillRect(x + 3, -2.5, cardW - 6, 5);
    ctx.strokeStyle = rimCol;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + cardW, 0);
    ctx.stroke();

    if (u > 0 && u < 0.85) {
      const flapY = y + cardH * e;
      ctx.fillStyle = '#FF2E55';
      ctx.fillRect(x + 2, flapY - 3, cardW - 4, 5);
    }

    if (idxTag) {
      ctx.fillStyle = badgeCol;
      ctx.fillRect(x, y, Math.min(cardW, 88), 20);
      ctx.fillStyle = '#08090C';
      ctx.font = monoFont(800, 11.5);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(idxTag, x + 6, y + 10);
    }
    if (probTag && cardH >= 135) {
      ctx.fillStyle = glyphCol;
      ctx.font = monoFont(700, 11.5);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(probTag, x + cardW - 7, y + cardH - 5);
    }
    ctx.restore();
  }

  function drawLoomPerimeterRulers(ctx, t, beat, kick, pal) {
    ctx.save();
    const xL = 36, xR = W - 36, yT = 28, yB = 964;
    ctx.strokeStyle = pal.fg;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(xL, yT, xR - xL, yB - yT);
    ctx.strokeStyle = pal.muted;
    ctx.lineWidth = 1.0;
    ctx.strokeRect(xL + 8, yT + 8, xR - xL - 16, yB - yT - 16);

    const scrollY = (t * 420) % 40;
    ctx.strokeStyle = pal.cyan;
    ctx.beginPath();
    for (let y = yT + 44; y <= yB - 32; y += 10) {
      const yy = y + (scrollY % 10);
      if (yy > yB - 24) continue;
      const idx = Math.round((y - yT) / 10);
      const major = idx % 5 === 0;
      const len = major ? 26 : (idx % 2 === 0 ? 15 : 9);
      ctx.moveTo(xL + 8, yy);
      ctx.lineTo(xL + 8 + len, yy);
      ctx.moveTo(xR - 8, yy);
      ctx.lineTo(xR - 8 - len, yy);
    }
    for (let x = xL + 40; x <= xR - 40; x += 24) {
      const idx = Math.round((x - xL) / 24);
      const major = idx % 4 === 0;
      const len = major ? 18 : 9;
      ctx.moveTo(x, yT + 8);
      ctx.lineTo(x, yT + 8 + len);
      ctx.moveTo(x, yB - 8);
      ctx.lineTo(x, yB - 8 - len);
    }
    ctx.stroke();

    ctx.fillStyle = pal.gold;
    ctx.font = monoFont(700, 11);
    ctx.textBaseline = 'middle';
    for (let k = 0; k < 7; k++) {
      const yy = 128 + k * 124;
      const msVal = (((t - T0) * 1000 + k * 1.0) % 16).toFixed(2);
      ctx.textAlign = 'left';
      ctx.fillText(`${msVal}ms`, xL + 38, yy);
      ctx.textAlign = 'right';
      ctx.fillText(`W${String(k * 8 + (Math.floor(beat * 4) % 8)).padStart(2, '0')}`, xR - 38, yy);
    }

    const corners = [
      [xL + 26, yT + 26], [xR - 26, yT + 26],
      [xL + 26, yB - 26], [xR - 26, yB - 26]
    ];
    const cr = 9 + kick * 4;
    ctx.strokeStyle = pal.crimson;
    ctx.lineWidth = 2.2;
    for (let i = 0; i < corners.length; i++) {
      const [cx, cy] = corners[i];
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.moveTo(cx - cr - 6, cy);
      ctx.lineTo(cx + cr + 6, cy);
      ctx.moveTo(cx, cy - cr - 6);
      ctx.lineTo(cx, cy + cr + 6);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHudStrip(ctx, cutIdx, cutLabel, tempC, activeCount, totalCount, latencyMs, pal) {
    ctx.save();
    const leftText = `P25 // CUT_0${cutIdx + 1} // ${cutLabel}`;
    ctx.font = monoFont(800, 15);
    const lw = Math.ceil(ctx.measureText(leftText).width) + 24;
    ctx.fillStyle = '#08090C';
    ctx.fillRect(56, 44, lw, 28);
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(56, 44, lw, 28);
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(leftText, 68, 58);

    const rightText = `TEMP: ${tempC.toFixed(1)}°C // Δt=${latencyMs}ms // TOK:${String(activeCount).padStart(2, '0')}/${totalCount}`;
    const rw = Math.ceil(ctx.measureText(rightText).width) + 24;
    ctx.fillStyle = pal.crimson;
    ctx.fillRect(W - 56 - rw, 44, rw, 28);
    ctx.fillStyle = '#FAF8F5';
    ctx.textAlign = 'right';
    ctx.fillText(rightText, W - 68, 58);

    ctx.strokeStyle = pal.muted;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(64, 922);
    ctx.lineTo(W - 64, 922);
    ctx.stroke();

    ctx.fillStyle = pal.isPaper ? '#0376B8' : '#FBBF24';
    ctx.font = monoFont(700, 13);
    ctx.textAlign = 'left';
    ctx.fillText(`JACQUARD_OPTICAL_LOOM // 193.5_BPM_SYNC // WEFT_LOCKED`, 68, 940);
    ctx.textAlign = 'right';
    ctx.fillText(`QUEUE_SPILL: ${(activeCount * 6.25).toFixed(1)}% // JITTER: ±0.00ms`, W - 68, 940);
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // CUT 0 (`95.82 – 96.58s`): Jacquard Punch-Drum & Tumbling Waterfall (`零 れ 出`)
  // --------------------------------------------------------------------------
  function renderCut0JacquardWaterfall(ctx, t, beat, kick, words, pal) {
    const uCut = clamp((t - 95.82) / (96.58 - 95.82), 0, 1);
    const camZoom = 1.0 + 0.05 * outExpo(uCut) + kick * 0.025;

    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    ctx.scale(camZoom, camZoom);
    ctx.rotate(-0.035 + 0.02 * Math.sin(beat * Math.PI));
    ctx.translate(-W * 0.5, -H * 0.5);

    drawGuillocheWheel(ctx, 210, 210, 96, 24, 54, 4, 220, 1.5, pal.gold, beat * 0.55);
    drawGuillocheWheel(ctx, W - 210, 210, 96, 24, 54, 4, 220, 1.5, pal.cyan, -beat * 0.55);
    drawGuillocheWheel(ctx, 210, 770, 82, 20, 46, 4, 180, 1.4, pal.cyan, -beat * 0.65);
    drawGuillocheWheel(ctx, W - 210, 770, 82, 20, 46, 4, 180, 1.4, pal.gold, beat * 0.65);

    // Top mechanical Jacquard punched-card cylinder
    const drumX = 290, drumY = 96, drumW = W - 580, drumH = 136;
    ctx.fillStyle = pal.card;
    ctx.fillRect(drumX, drumY, drumW, drumH);
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 3.2;
    ctx.strokeRect(drumX, drumY, drumW, drumH);
    drawBurinBox(ctx, drumX + 6, drumY + 6, 46, drumH - 12, 0.78, 6, 1.5, pal.muted);
    drawBurinBox(ctx, drumX + drumW - 52, drumY + 6, 46, drumH - 12, -0.78, 6, 1.5, pal.muted);

    const cols = 48, rows = 6;
    const cellW = (drumW - 130) / cols;
    const cellH = (drumH - 24) / rows;
    const rowShift = Math.floor(beat * 4);
    ctx.lineWidth = 1.2;
    for (let r = 0; r < rows; r++) {
      const py = drumY + 14 + r * cellH;
      for (let c = 0; c < cols; c++) {
        const px = drumX + 65 + c * cellW;
        const hVal = hash01((r + rowShift) * 71 + c * 17);
        if (hVal > 0.78) {
          ctx.fillStyle = pal.gold;
          ctx.fillRect(px + 2, py + 2, cellW - 5, cellH - 5);
        } else if (hVal > 0.44) {
          ctx.fillStyle = pal.cyan;
          ctx.fillRect(px + 2, py + 2, cellW - 5, cellH - 5);
        } else {
          ctx.strokeStyle = pal.muted;
          ctx.strokeRect(px + 3, py + 3, cellW - 7, cellH - 7);
        }
      }
    }

    // 56 high-tension vertical optical warp threads + multi-color binary token beads
    const warpN = 56;
    const warpX0 = 150;
    const warpSpan = W - 300;
    for (let i = 0; i < warpN; i++) {
      const wx = warpX0 + (i / (warpN - 1)) * warpSpan;
      const vib = Math.sin(t * 48 + i * 0.9) * (kick * 4.5 + (i % 4 === 0 ? 1.8 : 0.5));
      ctx.strokeStyle = i % 4 === 0 ? pal.cyan : pal.grid;
      ctx.lineWidth = i % 4 === 0 ? 2.2 : 1.1;
      ctx.beginPath();
      ctx.moveTo(wx, drumY + drumH);
      ctx.lineTo(wx + vib, 380);
      ctx.lineTo(wx - vib * 0.7, 680);
      ctx.lineTo(wx, 916);
      ctx.stroke();

      for (let p = 0; p < 3; p++) {
        const speed = 520 + (i % 7) * 65;
        const rawP = (t - T0) * speed + hash01(i * 19 + p * 7) * 680;
        const yPacket = drumY + drumH + (((rawP % 660) + 660) % 660);
        if ((i + p) % 7 === 0) {
          ctx.fillStyle = pal.crimson;
          ctx.fillRect(wx - 4, yPacket, 8, 20);
        } else if (i % 2 === p % 2) {
          ctx.fillStyle = pal.cyan;
          ctx.fillRect(wx - 3.5, yPacket, 7, 16);
        } else {
          ctx.strokeStyle = pal.gold;
          ctx.strokeRect(wx - 3, yPacket, 6, 12);
        }
      }
    }

    // Horizontal heddle & reed bars
    const reedA = 340 + Math.sin(beat * Math.PI * 2) * 34;
    const reedB = 745 - Math.sin(beat * Math.PI * 2) * 34;
    for (const ry of [reedA, reedB]) {
      ctx.fillStyle = pal.card;
      ctx.fillRect(130, ry - 11, W - 260, 22);
      ctx.strokeStyle = pal.gold;
      ctx.lineWidth = 2.4;
      ctx.strokeRect(130, ry - 11, W - 260, 22);
      drawBurinBox(ctx, 134, ry - 8, W - 268, 16, 0.55, 8, 1.4, pal.cyan);
    }

    // Nonlinear Diagonal Tumbling Waterfall: `零` (295x305), compact `れ` (146x150), `出` (295x305)!
    const slots = [
      { idx: 0, cx: 438,  cy: 412, w: 296, h: 306, rot: -0.17, cardBg: '#FF2E55', glyph: '#FAF8F5', rim: '#FBBF24', circle: false },
      { idx: 1, cx: 760,  cy: 558, w: 152, h: 156, rot:  0.23, cardBg: '#FBBF24', glyph: '#08090C', rim: '#FAF8F5', circle: true  },
      { idx: 2, cx: 1318, cy: 642, w: 298, h: 308, rot: -0.14, cardBg: '#111827', glyph: '#FAF8F5', rim: '#38BDF8', circle: false }
    ];
    for (let s = 0; s < slots.length; s++) {
      const sl = slots[s];
      const wObj = words[sl.idx] || FALLBACK_WORDS[sl.idx];
      if (t >= wObj.start) {
        const u = clamp((t - wObj.start) / 0.22, 0, 1);
        const dropY = sl.cy - (1 - outExpo(u)) * 155;
        const dropX = sl.cx + (1 - outExpo(u)) * (s === 0 ? -90 : 90);
        if (u < 0.75) {
          ctx.strokeStyle = s === 0 ? pal.gold : pal.crimson;
          ctx.lineWidth = 2.8;
          const rr = 120 + outExpo(u) * 115;
          ctx.strokeRect(dropX - rr, dropY - rr * 0.72, rr * 2, rr * 1.44);
        }
        drawSplitFlapToken(
          ctx, wordLabel(wObj), dropX, dropY, sl.w, sl.h, u, pal.fg, pal.bg,
          `TOK_0${sl.idx + 1}`, `t=${wObj.start.toFixed(2)}s`,
          { rot: sl.rot + (1 - outExpo(u)) * 0.28, cardBg: sl.cardBg, glyphCol: sl.glyph, rimCol: sl.rim, circle: sl.circle }
        );
      } else {
        ctx.save();
        ctx.translate(sl.cx, sl.cy);
        ctx.rotate(sl.rot);
        ctx.strokeStyle = pal.muted;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(-sl.w * 0.42, -sl.h * 0.42, sl.w * 0.84, sl.h * 0.84);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // CUT 1 (`96.58 – 97.34s`): Low-Angle Oblique Flying-Shuttle Cross-Weave (`す ト`)
  // --------------------------------------------------------------------------
  function renderCut1ShuttleCrossWeave(ctx, t, beat, kick, words, pal) {
    const uCut = clamp((t - 96.58) / (97.34 - 96.58), 0, 1);

    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    ctx.rotate(0.19 - 0.05 * uCut);
    const sc = 1.14 + kick * 0.03;
    ctx.scale(sc, sc);
    ctx.translate(-W * 0.5 + (0.5 - uCut) * 110, -H * 0.5);

    const gx0 = -160, gy0 = -140, gx1 = W + 160, gy1 = H + 140;
    const pitchX = 44;
    const pitchY = 58;
    const phaseShift = Math.floor(beat * 4);

    for (let x = gx0, ci = 0; x <= gx1; x += pitchX, ci++) {
      ctx.strokeStyle = ci % 3 === 0 ? pal.cobalt : pal.grid;
      ctx.lineWidth = ci % 3 === 0 ? 2.4 : 1.3;
      ctx.beginPath();
      ctx.moveTo(x, gy0);
      ctx.lineTo(x, gy1);
      ctx.stroke();
    }

    for (let y = gy0, ri = 0; y <= gy1; y += pitchY, ri++) {
      const dir = ri % 2 === 0 ? 1 : -1;
      const shuttleX = dir > 0
        ? gx0 + (((t - 96.50) * 2400 + ri * 310) % (gx1 - gx0))
        : gx1 - (((t - 96.50) * 2400 + ri * 310) % (gx1 - gx0));

      ctx.strokeStyle = pal.muted;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(gx0, y);
      ctx.lineTo(gx1, y);
      ctx.stroke();

      for (let x = gx0, ci = 0; x <= gx1; x += pitchX, ci++) {
        if ((ci + ri + phaseShift) % 5 === 0) {
          ctx.fillStyle = pal.cobalt;
          ctx.fillRect(x - 6, y - 6, 12, 12);
        } else if ((ci + ri) % 7 === 0) {
          ctx.fillStyle = pal.gold;
          ctx.fillRect(x - 6, y - 6, 12, 12);
        }
      }

      if (ri >= 2 && ri <= 18 && ri % 2 === 0) {
        const sw = 158, sh = 26;
        ctx.save();
        ctx.translate(shuttleX, y);
        if (dir < 0) ctx.scale(-1, 1);
        ctx.beginPath();
        ctx.moveTo(-sw * 0.5, 0);
        ctx.lineTo(-sw * 0.32, -sh * 0.5);
        ctx.lineTo(sw * 0.32, -sh * 0.5);
        ctx.lineTo(sw * 0.5, 0);
        ctx.lineTo(sw * 0.32, sh * 0.5);
        ctx.lineTo(-sw * 0.32, sh * 0.5);
        ctx.closePath();
        ctx.fillStyle = ri % 4 === 0 ? '#0376B8' : '#08090C';
        ctx.fill();
        ctx.lineWidth = 2.4;
        ctx.strokeStyle = '#FBBF24';
        ctx.stroke();
        ctx.fillStyle = '#FF2E55';
        ctx.beginPath();
        ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();

    // Nonlinear Staggered Shuttle Tokens: `出` echo (top-left), compact `す` (mid-upper), hero `ト` (lower-right)!
    const w2 = words[2] || FALLBACK_WORDS[2];
    const w3 = words[3] || FALLBACK_WORDS[3];
    const w4 = words[4] || FALLBACK_WORDS[4];

    drawSplitFlapToken(
      ctx, wordLabel(w2), 296, 318, 198, 206, 1.0, pal.fg, pal.bg, 'TOK_03', 'LOCKED',
      { rot: -0.15, cardBg: '#0376B8', glyphCol: '#FAF8F5', rimCol: '#08090C' }
    );

    if (t >= w3.start) {
      const u3 = clamp((t - w3.start) / 0.20, 0, 1);
      const sx3 = 824 + (1 - outExpo(u3)) * 220;
      ctx.strokeStyle = '#FF2E55';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(120, 426);
      ctx.lineTo(sx3, 426);
      ctx.stroke();
      drawSplitFlapToken(
        ctx, wordLabel(w3), sx3, 426, 168, 172, u3, pal.fg, pal.bg, 'WEFT_04', 'v=160m/s',
        { rot: 0.21, cardBg: '#FBBF24', glyphCol: '#08090C', rimCol: '#08090C', circle: true }
      );
    }

    if (t >= w4.start) {
      const u4 = clamp((t - w4.start) / 0.20, 0, 1);
      const sx4 = 1398 - (1 - outExpo(u4)) * 240;
      ctx.strokeStyle = '#0376B8';
      ctx.lineWidth = 5.0;
      ctx.beginPath();
      ctx.moveTo(W - 120, 646);
      ctx.lineTo(sx4, 646);
      ctx.stroke();
      drawSplitFlapToken(
        ctx, wordLabel(w4), sx4, 646, 312, 304, u4, pal.fg, pal.bg, 'WEFT_05', 'p=0.982',
        { rot: -0.16, cardBg: '#FF2E55', glyphCol: '#FAF8F5', rimCol: '#08090C' }
      );
    }
  }

  // --------------------------------------------------------------------------
  // CUT 2 (`97.34 – 98.25s`): Janus Multiverse Continuation Loom (`ー ク ン`)
  // --------------------------------------------------------------------------
  function renderCut2MultiverseLoom(ctx, t, beat, kick, words, pal) {
    const uCut = clamp((t - 97.34) / (98.25 - 97.34), 0, 1);
    const camPanY = (uCut - 0.5) * 46;

    ctx.save();
    ctx.translate(0, -camPanY * 0.35);

    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    for (let x = 96; x <= W - 96; x += 60) {
      ctx.moveTo(x, 86);
      ctx.lineTo(x, 906);
    }
    for (let y = 110; y <= 900; y += 54) {
      ctx.moveTo(96, y);
      ctx.lineTo(W - 96, y);
    }
    ctx.stroke();

    drawGuillocheWheel(ctx, 185, 495, 92, 23, 52, 4, 200, 1.5, pal.gold, beat * 0.4);
    drawGuillocheWheel(ctx, W - 185, 495, 92, 23, 52, 4, 200, 1.5, pal.cyan, -beat * 0.4);

    // 4-Column Nonlinear Continuation Loom (`ト` -> `ー` -> `ク` -> `ン`)
    const colXs = [355, 755, 1165, 1565];
    const heroIndices = [4, 5, 6, 7];
    const heroYs = [528, 342, 636, 442];
    const heroRots = [-0.11, 0.16, -0.15, 0.14];

    for (let c = 0; c < 3; c++) {
      const x0 = colXs[c] + 108;
      const y0 = heroYs[c];
      const x1 = colXs[c + 1] - 108;
      const wNext = words[heroIndices[c + 1]] || FALLBACK_WORDS[heroIndices[c + 1]];
      const chosenActive = t >= wNext.start;

      for (let b = 0; b < 4; b++) {
        const candY = 205 + b * 190;
        const targetY = b === (c + 1) % 4 ? heroYs[c + 1] : candY;
        const isHeroEdge = b === (c + 1) % 4;
        ctx.strokeStyle = isHeroEdge && chosenActive ? pal.crimson : pal.muted;
        ctx.lineWidth = isHeroEdge && chosenActive ? 6.0 : 1.5;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.bezierCurveTo(x0 + 110, y0, x1 - 110, targetY, x1, targetY);
        ctx.stroke();

        if (isHeroEdge && chosenActive) {
          ctx.strokeStyle = pal.gold;
          ctx.lineWidth = 2.2;
          ctx.stroke();
        }

        if (!isHeroEdge) {
          const alt = ALT_CANDIDATES[(c * 4 + b) % ALT_CANDIDATES.length];
          const bx = colXs[c + 1] - 92;
          const by = targetY - 30;
          ctx.fillStyle = pal.card;
          ctx.fillRect(bx, by, 184, 60);
          ctx.strokeStyle = pal.muted;
          ctx.lineWidth = 1.6;
          ctx.strokeRect(bx, by, 184, 60);
          if (chosenActive) {
            drawBurinBox(ctx, bx + 4, by + 4, 176, 52, 0.45, 9, 1.1, pal.muted);
            ctx.strokeStyle = pal.crimson;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(bx + 8, by + 8);
            ctx.lineTo(bx + 176, by + 52);
            ctx.stroke();
          }
          ctx.fillStyle = pal.bg;
          ctx.fillRect(bx + 12, by + 14, 160, 32);
          ctx.fillStyle = pal.muted;
          ctx.font = monoFont(700, 14);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(alt[0], bx + 20, by + 30);
          ctx.textAlign = 'right';
          ctx.fillText(`p=${alt[1]}`, bx + 166, by + 30);
        }
      }
    }

    const cardStyles = [
      { cardBg: '#111827', glyph: '#38BDF8', rim: '#38BDF8' },
      { cardBg: '#FF2E55', glyph: '#FAF8F5', rim: '#FBBF24' },
      { cardBg: '#FBBF24', glyph: '#08090C', rim: '#FAF8F5' },
      { cardBg: '#0284C7', glyph: '#FAF8F5', rim: '#FBBF24' }
    ];

    for (let c = 0; c < 4; c++) {
      const wIdx = heroIndices[c];
      const wObj = words[wIdx] || FALLBACK_WORDS[wIdx];
      const cx = colXs[c];
      const cy = heroYs[c];
      const stC = cardStyles[c];
      if (t >= wObj.start) {
        const u = c === 0 ? 1.0 : clamp((t - wObj.start) / 0.21, 0, 1);
        const sc = c === 0 ? 1.0 : (0.76 + 0.24 * outBack(u)) + kick * 0.03;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(sc, sc);
        drawSplitFlapToken(
          ctx, wordLabel(wObj), 0, 0, 218, 224, u, pal.fg, pal.bg,
          `STEP_0${wIdx + 1}`, `SAMPLED`,
          { rot: heroRots[c], cardBg: stC.cardBg, glyphCol: stC.glyph, rimCol: stC.rim }
        );
        ctx.restore();

        if (c > 0 && u < 0.92) {
          ctx.fillStyle = pal.gold;
          ctx.fillRect(cx - 98, cy - 154, 196, 26);
          ctx.fillStyle = '#08090C';
          ctx.font = monoFont(800, 13);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`► ARGMAX LOCKED`, cx, cy - 141);
        }
      } else {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(heroRots[c]);
        ctx.fillStyle = pal.card;
        ctx.fillRect(-98, -98, 196, 196);
        ctx.strokeStyle = pal.cyan;
        ctx.lineWidth = 2.0;
        ctx.strokeRect(-98, -98, 196, 196);
        ctx.fillStyle = pal.gold;
        ctx.font = monoFont(800, 13);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`SAMPLING...`, 0, 0);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // CUT 3 (`98.25 – 99.16s`): Macro `1.00ms` Vernier Phase Caliper (`も 一 ミ`)
  // --------------------------------------------------------------------------
  function renderCut3VernierMillisecond(ctx, t, beat, kick, words, pal) {
    const uCut = clamp((t - 98.25) / (99.16 - 98.25), 0, 1);

    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    ctx.rotate(-0.075 * (1 - uCut * 0.65));
    const sc = 1.03 + kick * 0.02;
    ctx.scale(sc, sc);
    ctx.translate(-W * 0.5, -H * 0.5);

    // Upper & lower precision square-wave phase-clock traces
    for (const [baseY, amp, freq, col] of [[166, 34, 18, pal.cobalt], [826, 30, 24, pal.crimson]]) {
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      const shift = (t - 98.25) * 920;
      const stepW = (W - 220) / freq;
      for (let i = 0; i < freq; i++) {
        const x0 = 110 + i * stepW;
        const xMid = x0 + stepW * 0.5;
        const x1 = x0 + stepW;
        const hi = ((i + Math.floor(shift / stepW)) % 2 === 0) ? -amp : amp;
        if (i === 0) ctx.moveTo(x0, baseY + hi);
        ctx.lineTo(xMid, baseY + hi);
        ctx.lineTo(xMid, baseY - hi);
        ctx.lineTo(x1, baseY - hi);
      }
      ctx.stroke();

      for (let i = 0; i < freq; i += 2) {
        const x0 = 110 + i * stepW;
        drawBurinBox(ctx, x0 + 3, baseY - amp + 3, stepW * 0.5 - 6, amp * 2 - 6, 0.6, 6, 1.2, pal.muted);
      }
    }

    // Master horizontal Vernier Caliper Beam (`y = 244..328`)
    const beamX = 96, beamY = 244, beamW = W - 192, beamH = 84;
    ctx.fillStyle = pal.card;
    ctx.fillRect(beamX, beamY, beamW, beamH);
    ctx.strokeStyle = '#08090C';
    ctx.lineWidth = 3.4;
    ctx.strokeRect(beamX, beamY, beamW, beamH);

    ctx.strokeStyle = '#08090C';
    ctx.fillStyle = '#08090C';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const totalTicks = 80;
    for (let i = 0; i <= totalTicks; i++) {
      const tx = beamX + 36 + (i / totalTicks) * (beamW - 72);
      const major = i % 10 === 0;
      const med = i % 5 === 0;
      const hTick = major ? 38 : (med ? 24 : 14);
      ctx.moveTo(tx, beamY + beamH);
      ctx.lineTo(tx, beamY + beamH - hTick);
      if (major) {
        ctx.font = monoFont(800, 14);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`${(i * 0.05).toFixed(2)}ms`, tx, beamY + 12);
      }
    }
    ctx.stroke();

    // Nonlinear Diagonal Vernier Stair-Step: compact `も` (435, 458), huge `一` (955, 622), `ミ` (1475, 488)!
    const w8 = words[8] || FALLBACK_WORDS[8];
    const w9 = words[9] || FALLBACK_WORDS[9];
    const w10 = words[10] || FALLBACK_WORDS[10];
    const gateSpecs = [
      { wObj: w8,  gx: 435,  gy: 458, cw: 158, ch: 162, rot: -0.21, tag: '0.33ms', cardBg: '#FBBF24', glyph: '#08090C', rim: '#08090C', circle: true  },
      { wObj: w9,  gx: 958,  gy: 622, cw: 306, ch: 288, rot:  0.11, tag: '0.67ms', cardBg: '#FF2E55', glyph: '#FAF8F5', rim: '#08090C', circle: false },
      { wObj: w10, gx: 1475, gy: 488, cw: 242, ch: 248, rot: -0.16, tag: '1.00ms', cardBg: '#0376B8', glyph: '#FAF8F5', rim: '#FBBF24', circle: false }
    ];

    let activeStage = 0;
    if (t >= w10.start) activeStage = 2;
    else if (t >= w9.start) activeStage = 1;

    const jawPrev = activeStage === 0 ? 280 : gateSpecs[activeStage - 1].gx;
    const stageStart = gateSpecs[activeStage].wObj.start;
    const jawU = outExpo(clamp((t - stageStart) / 0.19, 0, 1));
    const jawX = jawPrev + (gateSpecs[activeStage].gx - jawPrev) * jawU;

    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(jawX - 134, beamY - 20, 268, 28);
    ctx.strokeStyle = '#08090C';
    ctx.lineWidth = 2.4;
    ctx.strokeRect(jawX - 134, beamY - 20, 268, 28);
    ctx.fillStyle = '#08090C';
    ctx.font = monoFont(800, 13);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`VERNIER_LOCK // 1.000ms`, jawX, beamY - 6);

    ctx.strokeStyle = pal.crimson;
    ctx.lineWidth = 3.0;
    ctx.strokeRect(jawX - 156, beamY - 20, 312, 535);

    for (let g = 0; g < 3; g++) {
      const sp = gateSpecs[g];
      if (t >= sp.wObj.start) {
        const ug = clamp((t - sp.wObj.start) / 0.18, 0, 1);
        const clampGap = (1 - outExpo(ug)) * 95;
        ctx.fillStyle = '#08090C';
        ctx.fillRect(sp.gx - sp.cw * 0.58 - clampGap, sp.gy - 36, 20, 72);
        ctx.fillRect(sp.gx + sp.cw * 0.58 - 20 + clampGap, sp.gy - 36, 20, 72);
        drawSplitFlapToken(
          ctx, wordLabel(sp.wObj), sp.gx, sp.gy, sp.cw, sp.ch, ug, pal.fg, pal.bg,
          `TOK_${g + 9}`, sp.tag,
          { rot: sp.rot, cardBg: sp.cardBg, glyphCol: sp.glyph, rimCol: sp.rim, circle: sp.circle }
        );
      } else {
        ctx.save();
        ctx.translate(sp.gx, sp.gy);
        ctx.rotate(sp.rot);
        ctx.strokeStyle = pal.cobalt;
        ctx.lineWidth = 2.2;
        ctx.strokeRect(-sp.cw * 0.45, -sp.ch * 0.45, sp.cw * 0.9, sp.ch * 0.9);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // CUT 4 (`99.16 – 100.07s`): 3D 4-Wall Optical Loom Shaft Dive (`リ 秒 の`)
  // --------------------------------------------------------------------------
  function renderCut4LoomShaftDive(ctx, t, beat, kick, words, pal) {
    const uCut = clamp((t - 99.16) / (100.07 - 99.16), 0, 1);
    const vpX = W * 0.5 + Math.sin(uCut * Math.PI * 2) * 55;
    const vpY = 500 + Math.cos(uCut * Math.PI * 2) * 28;

    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    ctx.rotate(0.24 - uCut * 0.48);
    const sc = 1.08 + kick * 0.035;
    ctx.scale(sc, sc);
    ctx.translate(-W * 0.5, -H * 0.5);

    const perimPts = [];
    for (let i = 0; i <= 14; i++) perimPts.push([-120 + (i / 14) * (W + 240), -80]);
    for (let i = 1; i <= 9; i++) perimPts.push([W + 120, -80 + (i / 9) * (H + 160)]);
    for (let i = 14; i >= 0; i--) perimPts.push([-120 + (i / 14) * (W + 240), H + 80]);
    for (let i = 8; i >= 1; i--) perimPts.push([-120, -80 + (i / 9) * (H + 160)]);

    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < perimPts.length; i++) {
      ctx.moveTo(vpX, vpY);
      ctx.lineTo(perimPts[i][0], perimPts[i][1]);
    }
    ctx.stroke();

    const ringCount = 16;
    const zScroll = ((t - 99.16) * 3.2) % 1;
    for (let r = 0; r < ringCount; r++) {
      const uRing = (r + zScroll) / ringCount;
      const depth = Math.pow(uRing, 2.35);
      const rw = 54 + depth * (W + 220);
      const rh = 34 + depth * (H + 140);
      const rx = vpX - rw * 0.5;
      const ry = vpY - rh * 0.5;
      ctx.strokeStyle = r % 4 === 0 ? pal.gold : (r % 2 === 0 ? pal.cyan : pal.muted);
      ctx.lineWidth = 1.0 + depth * 3.4;
      ctx.strokeRect(rx, ry, rw, rh);

      if (r % 2 === 0 && rw > 140 && rw < W - 80) {
        const bw = Math.max(12, depth * 56);
        const bh = Math.max(8, depth * 28);
        ctx.fillStyle = r % 4 === 0 ? pal.crimson : pal.cyan;
        ctx.fillRect(rx, ry, bw, bh);
        ctx.fillRect(rx + rw - bw, ry, bw, bh);
        ctx.fillRect(rx, ry + rh - bh, bw, bh);
        ctx.fillRect(rx + rw - bw, ry + rh - bh, bw, bh);
      }
    }

    ctx.fillStyle = pal.card;
    ctx.fillRect(vpX - 58, vpY - 40, 116, 80);
    ctx.strokeStyle = pal.gold;
    ctx.lineWidth = 3.0;
    ctx.strokeRect(vpX - 58, vpY - 40, 116, 80);
    drawGuillocheWheel(ctx, vpX, vpY, 34, 9, 20, 3, 120, 1.4, pal.crimson, -beat * 1.2);

    ctx.restore();

    // Asymmetric 3D Spiral Ejection: `リ` (Katakana), huge `秒` (330x338 Kanji hero), compact `の` (148px seal)!
    const shaftSpec = [
      { idx: 11, tx: 405,  ty: 368, cw: 232, ch: 238, rot: -0.18, tag: 'SHAFT_12', cardBg: '#111827', glyph: '#38BDF8', rim: '#38BDF8', circle: false },
      { idx: 12, tx: 982,  ty: 612, cw: 332, ch: 340, rot:  0.12, tag: 'SHAFT_13', cardBg: '#FF2E55', glyph: '#FAF8F5', rim: '#FBBF24', circle: false },
      { idx: 13, tx: 1502, ty: 412, cw: 152, ch: 156, rot:  0.24, tag: 'SHAFT_14', cardBg: '#FBBF24', glyph: '#08090C', rim: '#FAF8F5', circle: true  }
    ];
    for (let s = 0; s < shaftSpec.length; s++) {
      const sp = shaftSpec[s];
      const wObj = words[sp.idx] || FALLBACK_WORDS[sp.idx];
      if (t >= wObj.start) {
        const u = clamp((t - wObj.start) / 0.22, 0, 1);
        const e = outExpo(u);
        const cx = vpX + (sp.tx - vpX) * e;
        const cy = vpY + (sp.ty - vpY) * e;
        const sc = 0.28 + 0.72 * e + kick * 0.03;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(sc, sc);
        drawSplitFlapToken(
          ctx, wordLabel(wObj), 0, 0, sp.cw, sp.ch, u, pal.fg, pal.bg,
          sp.tag, `1.00ms`,
          { rot: sp.rot, cardBg: sp.cardBg, glyphCol: sp.glyph, rimCol: sp.rim, circle: sp.circle }
        );
        ctx.restore();
      }
    }
  }

  // --------------------------------------------------------------------------
  // CUT 5 (`100.07 – 100.62s`): `遅延` 7-Band Multi-Color Phase-Shear Snap!
  // --------------------------------------------------------------------------
  function drawCut5SceneLayer(ctx, t, beat, kick, wDelay, wMo, inkCol, groundCol, accentCol) {
    ctx.fillStyle = groundCol;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = groundCol === '#08090C' ? '#1E293B' : '#94A3B8';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (let x = 72; x <= W - 72; x += 36) {
      ctx.moveTo(x, 64);
      ctx.lineTo(x, 930);
    }
    for (let y = 84; y <= 920; y += 44) {
      ctx.moveTo(72, y);
      ctx.lineTo(W - 72, y);
    }
    ctx.stroke();

    drawGuillocheWheel(ctx, 215, 500, 138, 34, 78, 5, 240, 1.8, accentCol, beat * 0.9);
    drawGuillocheWheel(ctx, W - 215, 500, 138, 34, 78, 5, 240, 1.8, inkCol, -beat * 0.9);

    drawBurinBox(ctx, 96, 92, W - 192, 42, 0.68, 7, 1.8, accentCol);
    drawBurinBox(ctx, 96, 858, W - 192, 42, -0.68, 7, 1.8, accentCol);

    // Tilted `-0.09 rad` Colossal Engraved Plate for `遅延` (`w[14].start = 100.079s`)
    const activeDelay = t >= wDelay.start;
    const uDelay = activeDelay ? clamp((t - wDelay.start) / 0.24, 0, 1) : 0;
    const plateW = 920, plateH = 500;

    ctx.save();
    ctx.translate(W * 0.48, 492);
    ctx.rotate(-0.09);

    ctx.fillStyle = groundCol;
    ctx.fillRect(-plateW * 0.5, -plateH * 0.5, plateW, plateH);
    ctx.strokeStyle = inkCol;
    ctx.lineWidth = 5.0;
    ctx.strokeRect(-plateW * 0.5, -plateH * 0.5, plateW, plateH);
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(-plateW * 0.5 + 12, -plateH * 0.5 + 12, plateW - 24, plateH - 24);

    ctx.fillStyle = accentCol;
    ctx.fillRect(-plateW * 0.5 + 24, -plateH * 0.5 + 24, 254, 30);
    ctx.fillStyle = '#08090C';
    ctx.font = monoFont(800, 15);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`PHASE_SHEAR // Δt=1.00ms`, -plateW * 0.5 + 34, -plateH * 0.5 + 39);

    if (activeDelay) {
      const sc = 0.88 + 0.12 * outExpo(uDelay) + kick * 0.03;
      ctx.save();
      ctx.translate(0, 18);
      ctx.scale(sc, sc);
      ctx.font = jpFont(900, 306);
      ctx.fillStyle = inkCol;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(wordLabel(wDelay), 0, 0);
      ctx.restore();
    } else {
      drawBurinBox(ctx, -plateW * 0.5 + 30, -plateH * 0.5 + 70, plateW - 60, plateH - 100, 0.5, 10, 1.6, inkCol);
    }
    ctx.restore();

    // Compact tilted particle seal `も` (`w[15].start = 100.596s`)
    if (t >= wMo.start) {
      const uMo = clamp((t - wMo.start) / 0.16, 0, 1);
      drawSplitFlapToken(
        ctx, wordLabel(wMo), 1565, 695, 158, 162, uMo, inkCol, groundCol, 'TOK_16', 'FINAL',
        { rot: 0.22, cardBg: '#FF2E55', glyphCol: '#FAF8F5', rimCol: '#FBBF24', circle: true }
      );
    }
  }

  function renderCut5PhaseShearDelay(ctx, t, beat, kick, words, pal) {
    const wDelay = words[14] || FALLBACK_WORDS[14];
    const wMo = words[15] || FALLBACK_WORDS[15];
    const uShear = t >= wDelay.start ? outExpo(clamp((t - wDelay.start) / 0.24, 0, 1)) : 0;
    const shearAmp = t >= wDelay.start ? (1 - uShear) * 165 + kick * 14 : 52;

    const bands = 7;
    const yStart = 84;
    const yEnd = 908;
    const bandH = (yEnd - yStart) / bands;

    drawCut5SceneLayer(ctx, t, beat, kick, wDelay, wMo, '#FAF8F5', '#08090C', '#38BDF8');

    for (let b = 0; b < bands; b++) {
      const by = yStart + b * bandH;
      const dir = b % 2 === 0 ? 1 : -1;
      const dx = dir * shearAmp * (1 - (b % 3) * 0.22);

      let bInk = '#FAF8F5', bGround = '#08090C', bAcc = '#38BDF8';
      if (b === 2) {
        bInk = '#FAF8F5'; bGround = '#FF2E55'; bAcc = '#FBBF24';
      } else if (b === 4) {
        bInk = '#08090C'; bGround = '#FBBF24'; bAcc = '#FF2E55';
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(52, by, W - 104, bandH + 0.6);
      ctx.clip();
      ctx.translate(dx, 0);
      drawCut5SceneLayer(ctx, t, beat, kick, wDelay, wMo, bInk, bGround, bAcc);
      ctx.restore();

      ctx.strokeStyle = b % 2 === 0 ? '#38BDF8' : '#FBBF24';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(52, by);
      ctx.lineTo(W - 52, by);
      ctx.stroke();
    }
  }

  // --------------------------------------------------------------------------
  // CUT 6 (`100.62 – 101.16s`): Nonlinear Diagonal × Tategaki Woven Tapestry Collage!
  // --------------------------------------------------------------------------
  function renderCut6MasterTapestry(ctx, t, beat, kick, words, pal) {
    const uCut = clamp((t - 100.62) / (101.16 - 100.62), 0, 1);
    const zoomOut = 1.16 - 0.16 * outExpo(uCut) + kick * 0.018;

    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    ctx.scale(zoomOut, zoomOut);
    ctx.translate(-W * 0.5, -H * 0.5);

    // Full-frame Jacquard warp/weft tapestry underlay
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let x = 76; x <= W - 76; x += 28) {
      ctx.moveTo(x, 82);
      ctx.lineTo(x, 912);
    }
    for (let y = 92; y <= 908; y += 28) {
      ctx.moveTo(76, y);
      ctx.lineTo(W - 76, y);
    }
    ctx.stroke();

    drawGuillocheWheel(ctx, 158, 285, 96, 24, 54, 4, 200, 1.5, pal.cobalt, beat * 0.5);
    drawGuillocheWheel(ctx, 158, 725, 96, 24, 54, 4, 200, 1.5, pal.gold, -beat * 0.5);
    drawGuillocheWheel(ctx, W - 158, 285, 96, 24, 54, 4, 200, 1.5, pal.gold, -beat * 0.5);
    drawGuillocheWheel(ctx, W - 158, 725, 96, 24, 54, 4, 200, 1.5, pal.cobalt, beat * 0.5);

    // Woven shuttle thread polyline connecting all 16 nonlinear tokens!
    ctx.strokeStyle = pal.crimson;
    ctx.lineWidth = 3.6;
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const sp = TAPESTRY_COLLAGE_SPECS[i];
      if (i === 0) ctx.moveTo(sp.x, sp.y);
      else ctx.lineTo(sp.x, sp.y);
    }
    ctx.stroke();

    // Render all 16 tokens in strong Kanji vs Katakana vs Hiragana collage hierarchy!
    for (let idx = 0; idx < 16; idx++) {
      const sp = TAPESTRY_COLLAGE_SPECS[idx];
      const wObj = words[idx] || FALLBACK_WORDS[idx];
      const isFinalToken = idx === 15;
      const active = t >= wObj.start;
      const uTok = isFinalToken ? clamp((t - wObj.start) / 0.20, 0, 1) : 1.0;

      let cardBg = '#08090C', glyph = '#FAF8F5', rim = '#0376B8', circle = false;
      if (sp.style === 'crimson') {
        cardBg = '#FF2E55'; glyph = '#FAF8F5'; rim = '#08090C';
      } else if (sp.style === 'cobalt') {
        cardBg = '#0376B8'; glyph = '#FAF8F5'; rim = '#FBBF24';
      } else if (sp.style === 'gold') {
        cardBg = '#FBBF24'; glyph = '#08090C'; rim = '#08090C';
      } else if (sp.style === 'circle') {
        cardBg = '#FBBF24'; glyph = '#08090C'; rim = '#08090C'; circle = true;
      } else if (sp.style === 'final') {
        cardBg = '#FF2E55'; glyph = '#FAF8F5'; rim = '#FBBF24'; circle = true;
      }

      const sc = isFinalToken && active ? (0.80 + 0.24 * outBack(uTok) + kick * 0.04) : 1.0;
      ctx.save();
      ctx.translate(sp.x, sp.y);
      ctx.scale(sc, sc);
      drawSplitFlapToken(
        ctx, wordLabel(wObj), 0, 0, sp.w, sp.h, active ? uTok : 0.0, pal.fg, pal.bg,
        `T${String(idx + 1).padStart(2, '0')}`, isFinalToken ? 'SEALED' : '1.00ms',
        { rot: sp.rot, cardBg, glyphCol: glyph, rimCol: rim, circle }
      );
      ctx.restore();
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // MAIN ENTRY
  // --------------------------------------------------------------------------
  function render(ctx, arg2, arg3) {
    let t = T0;
    let st = {};
    let core = window.CortexPDoomCore;

    if (typeof arg2 === 'number') {
      t = arg2;
      st = arg3 || {};
    } else if (arg2 && typeof arg2 === 'object') {
      st = arg2;
      t = typeof st.t === 'number' ? st.t : T0;
      if (arg3 && typeof arg3 === 'object') core = arg3;
    }
    if (!core) core = window.CortexPDoomCore;

    const kick = clamp(Number(st.kickPulse ?? st.kickEnv ?? st.kick ?? 0), 0, 1);
    const beat = core && typeof core.timeToBeat === 'function'
      ? core.timeToBeat(t)
      : (t * 193.5) / 60;

    let cutIdx = 0;
    let pal = PAL_CYAN;
    let cutLabel = 'JACQUARD_DRUM_WATERFALL';

    if (t < 96.58) {
      cutIdx = 0;
      pal = PAL_CYAN;
      cutLabel = 'JACQUARD_DRUM_WATERFALL';
    } else if (t < 97.34) {
      cutIdx = 1;
      pal = PAL_PAPER;
      cutLabel = 'OBLIQUE_SHUTTLE_WEAVE';
    } else if (t < 98.25) {
      cutIdx = 2;
      pal = PAL_CYAN;
      cutLabel = 'MULTIVERSE_TOKEN_LOOM';
    } else if (t < 99.16) {
      cutIdx = 3;
      pal = PAL_PAPER;
      cutLabel = 'MACRO_1MS_VERNIER_LOCK';
    } else if (t < 100.07) {
      cutIdx = 4;
      pal = PAL_CYAN;
      cutLabel = 'SHAFT_WATERFALL_PLUNGE';
    } else if (t < 100.62) {
      cutIdx = 5;
      pal = PAL_CYAN;
      cutLabel = 'PHASE_SHEAR_DELAY_SNAP';
    } else {
      cutIdx = 6;
      pal = PAL_PAPER;
      cutLabel = 'TAPESTRY_COLLAGE_SEAL';
    }

    const bg = pal.bg;
    const fg = pal.fg;
    const words = getWords(core);
    let activeCount = 0;
    for (let i = 0; i < words.length; i++) {
      if (t >= words[i].start) activeCount++;
    }

    const uPlate = clamp((t - T0) / (T1 - T0), 0, 1);
    const tempC = 35.6 + 0.2 * uPlate;
    const latencyMs = (1.0).toFixed(2);

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    if (cutIdx === 0) {
      renderCut0JacquardWaterfall(ctx, t, beat, kick, words, pal);
    } else if (cutIdx === 1) {
      renderCut1ShuttleCrossWeave(ctx, t, beat, kick, words, pal);
    } else if (cutIdx === 2) {
      renderCut2MultiverseLoom(ctx, t, beat, kick, words, pal);
    } else if (cutIdx === 3) {
      renderCut3VernierMillisecond(ctx, t, beat, kick, words, pal);
    } else if (cutIdx === 4) {
      renderCut4LoomShaftDive(ctx, t, beat, kick, words, pal);
    } else if (cutIdx === 5) {
      renderCut5PhaseShearDelay(ctx, t, beat, kick, words, pal);
    } else {
      renderCut6MasterTapestry(ctx, t, beat, kick, words, pal);
    }

    drawLoomPerimeterRulers(ctx, t, beat, kick, pal);
    drawHudStrip(ctx, cutIdx, cutLabel, tempC, activeCount, words.length, latencyMs, pal);

    ctx.restore();

    return {
      bg,
      fg,
      duotone: { bg, fg },
      isPaper: pal.isPaper,
      bloom: pal.isPaper ? 0.22 : 0.36,
      ca: 0,
      flash: 0,
      shake: 0
    };
  }

  if (typeof window !== 'undefined' && typeof window.registerCortexPlate === 'function') {
    window.registerCortexPlate(PLATE_ID, { render });
  }
})();
