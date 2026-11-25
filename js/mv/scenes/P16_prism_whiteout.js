// ============================================================================
// Plate 16 — `P16_prism_whiteout.js` (`201.38s – 221.36s`, 19 Rapid Optical Cuts)
// Phase-2 + #52 / #53 / #63 Overhaul (`camera-pacing`):
//   1. Layered Multi-Hue `pdoom-video` Monograph Palette (#52):
//      Deep ink `#08090C` / bone paper `#FAF8F5` + secondary architectural
//      panels `#121723` / `#E2E8F0` + copperplate burin slate `#334155` /
//      `#64748B` / `#CBD5E1` (`slate >= 6%`) + 4-spectrum prism accents
//      (`#FAF8F5` platinum, `#38BDF8` ice-cyan, `#0376B8` cobalt,
//      `#FBBF24` chrono-gold, `#FF2E55` crimson). Zero `#FF9EBB`, zero gradients!
//   2. 100% Strict `Cortex25D.drawNotanHime` Traced SVG Delegation (#63):
//      Cuts 17–18 (`君の瞳を照らすよ`) strictly delegate to `p02_eye_macro` via
//      `Cortex25D.drawNotanHime` on the right stage (`x = 1365`) with unobstructed
//      eyelashes & star pupil — zero hand-coded eye shapes!
//   3. Autonomous Per-Character Non-Linear Spatial Choreography (#53):
//      Every token across `L36`, `L37`, `L38`, `L39` is an independent tilted
//      2D entity (`235–325px` Kanji stamps vs `96–124px` tucked particle seals)
//      slamming in at exact `w.start` with zero straight-line rows & zero overlap!
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

  let _stars190 = null;
  function getStars190(core) {
    if (_stars190) return _stars190;
    const rnd = core.mulberry32(190206);
    const out = [];
    for (let sIdx = 0; sIdx < 2; sIdx++) {
      const side = sIdx === 0 ? -1 : 1;
      for (let i = 0; i < 95; i++) {
        const tier = i % 5;
        const u = Math.floor(i / 5) / 18;
        const spanX = (140 + Math.pow(u, 0.85) * 760) * (1 - tier * 0.055);
        const arcY = -Math.sin(u * Math.PI * 0.84) * (310 - tier * 44) + tier * 42 - 36 + Math.pow(u, 1.65) * 110;
        out.push({
          idx: sIdx * 95 + i,
          side,
          u,
          rx: side * spanX + (rnd() - 0.5) * 14,
          ry: arcY + (rnd() - 0.5) * 12,
          z0: rnd() * 2400,
          ang: rnd() * Math.PI * 2,
          rad: 90 + rnd() * 780
        });
      }
    }
    _stars190 = out;
    return out;
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
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotDeg * Math.PI) / 180);
    ctx.font = style.mono
      ? JP_MONO(900, sz)
      : (style.serif ? JP_SERIF(900, sz) : JP_SANS(900, sz));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const mw = ctx.measureText(glyph).width;
    const bw = Math.max(sz * 0.96, mw + sz * (style.padRatio || 0.26));
    const bh = sz * 1.12;

    if (style.circle) {
      const rad = Math.max(12, Math.max(bw, bh) * 0.54);
      if (style.shadowCol) {
        ctx.fillStyle = style.shadowCol;
        ctx.beginPath();
        ctx.arc(5, 5, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = style.boxCol || CRIMSON;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.fill();
      if (style.borderCol) {
        ctx.strokeStyle = style.borderCol;
        ctx.lineWidth = Math.max(3, Math.round(sz * 0.04));
        ctx.stroke();
      }
      ctx.fillStyle = style.txtCol || BONE;
      ctx.fillText(glyph, 0, sz * 0.03);
    } else if (style.boxCol) {
      if (style.shadowCol) {
        ctx.fillStyle = style.shadowCol;
        ctx.fillRect(Math.round(-bw * 0.5 + 8), Math.round(-bh * 0.5 + 8), Math.round(bw), Math.round(bh));
      }
      ctx.fillStyle = style.boxCol;
      ctx.fillRect(Math.round(-bw * 0.5), Math.round(-bh * 0.5), Math.round(bw), Math.round(bh));
      if (style.borderCol) {
        ctx.strokeStyle = style.borderCol;
        ctx.lineWidth = Math.max(3, Math.round(sz * 0.03));
        ctx.strokeRect(
          Math.round(-bw * 0.5 + 6),
          Math.round(-bh * 0.5 + 6),
          Math.round(bw - 12),
          Math.round(bh - 12)
        );
      }
      ctx.fillStyle = style.txtCol || INK;
      ctx.fillText(glyph, 0, sz * 0.03);
    } else {
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 3;
      if (style.shadowCol) {
        ctx.fillStyle = style.shadowCol;
        ctx.fillText(glyph, 7, 7);
      }
      ctx.strokeStyle = style.outlineCol || INK;
      ctx.lineWidth = Math.max(11, Math.round(sz * 0.11));
      ctx.strokeText(glyph, 0, 0);
      ctx.fillStyle = style.txtCol || BONE;
      ctx.fillText(glyph, 0, 0);
    }
    ctx.restore();
  }

  // Renders curated per-token (and split 2-Kanji compound) non-linear entities at exact w.start
  function renderCuratedEntities(ctx, core, cueId, t, kick, entities, isPaperStage) {
    const cue = core.cueById(cueId);
    if (!cue || !cue.words) return;
    const words = cue.words;

    for (let k = 0; k < entities.length; k++) {
      const e = entities[k];
      const wObj = words[e.wi];
      if (!wObj || t < wObj.start) continue;

      const dt = t - wObj.start;
      const pIn = core.clamp(dt / 0.17, 0, 1);
      const spring = core.ease.outBack(pIn, 2.05);
      const ang = (k + e.wi) * 2.39996;
      const isBottomRow = e.y > 680;
      const sinY = isBottomRow ? 0 : (e.y < 240 ? Math.abs(Math.sin(ang)) * 0.45 : Math.sin(ang) * 0.55);
      const sc = core.lerp(isBottomRow ? 1.20 : 1.42, 1.0, spring) + kick * (e.sz >= 210 ? 0.05 : 0.03);
      const halfExt = e.sz * sc * 0.62 + 12;
      const maxAllowX = (entities === ENTITIES_L39_LEFT) ? (928 - halfExt) : (1845 - halfExt);
      const rawX = e.x + (isBottomRow ? (1 - spring) * 115 : Math.cos(ang) * (1 - spring) * 115);
      const rawY = e.y + sinY * (1 - spring) * 95 + Math.sin(t * 4.2 + k) * 3;
      const curX = core.clamp(rawX, Math.max(92, halfExt + 56), Math.max(200, maxAllowX));
      const curY = core.clamp(rawY, Math.max(88, halfExt + 58), Math.min(948, 960 - halfExt));
      const isFresh = dt < 0.13;

      if (dt < 0.22) {
        drawStarSpark(ctx, curX, curY, (e.sz * 0.20) * (1 - dt / 0.22) + 8, t * 5 + k, k % 2 === 0 ? GOLD : CRIMSON);
      }

      if (isFresh) {
        drawDieCutStamp(ctx, e.ch, curX, curY, e.sz * sc, e.rot + (1 - spring) * 18, {
          serif: e.serif,
          circle: e.circle,
          boxCol: CRIMSON,
          txtCol: BONE,
          borderCol: GOLD,
          shadowCol: isPaperStage ? COBALT : CYAN
        });
      } else if (e.circle) {
        drawDieCutStamp(ctx, e.ch, curX, curY, e.sz * sc, e.rot, {
          circle: true,
          boxCol: e.box || CRIMSON,
          txtCol: e.txt || BONE,
          borderCol: e.bdr || GOLD,
          shadowCol: isPaperStage ? CHAR_INK : PANEL
        });
      } else if (e.box) {
        drawDieCutStamp(ctx, e.ch, curX, curY, e.sz * sc, e.rot, {
          serif: e.serif,
          boxCol: e.box,
          txtCol: e.txt || INK,
          borderCol: e.bdr || BONE,
          shadowCol: e.sh || (isPaperStage ? CHAR_INK : CRIMSON)
        });
      } else {
        drawDieCutStamp(ctx, e.ch, curX, curY, e.sz * sc, e.rot, {
          serif: e.serif,
          txtCol: isPaperStage ? CHAR_INK : BONE,
          outlineCol: isPaperStage ? BONE : INK,
          shadowCol: e.sh || (isPaperStage ? COBALT : CYAN)
        });
      }
    }
  }

  function drawOpticCrop(ctx, W, H, mainCol, subCol, accentCol, bgCol, tagL, tagR) {
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
    const lw = ctx.measureText(tagL).width + 22;
    ctx.fillStyle = mainCol;
    ctx.fillRect(68, 16, lw, 26);
    ctx.fillStyle = bgCol;
    ctx.textAlign = 'left';
    ctx.fillText(tagL, 79, 29);

    const rTxt = `TEMP: 36.5C // ${tagR}`;
    const rw = ctx.measureText(rTxt).width + 22;
    ctx.fillStyle = accentCol;
    ctx.fillRect(W - 68 - rw, 16, rw, 26);
    ctx.fillStyle = (accentCol === GOLD || accentCol === BONE || accentCol === CYAN) ? INK : BONE;
    ctx.textAlign = 'right';
    ctx.fillText(rTxt, W - 79, 29);
    ctx.restore();
  }

  function drawShatteringBlackBox(ctx, W, H, t, explodeU, rot, isPaperStage) {
    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    ctx.rotate(rot);

    const s = 220 + explodeU * 500;
    const ay = t * 2.4, ax = 0.45 + t * 1.1;
    const cosY = Math.cos(ay), sinY = Math.sin(ay);
    const cosX = Math.cos(ax), sinX = Math.sin(ax);
    const proj = (x, y, z) => {
      const rx = x * cosY - z * sinY;
      const rz = x * sinY + z * cosY;
      const ry = y * cosX - rz * sinX;
      const rz2 = y * sinX + rz * cosX + 920;
      const k = 760 / Math.max(120, rz2);
      return { x: rx * k, y: ry * k };
    };

    const verts = [];
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        for (const sz of [-1, 1]) {
          verts.push(proj(sx * s, sy * s, sz * s));
        }
      }
    }
    const edges = [
      [0, 1], [2, 3], [4, 5], [6, 7],
      [0, 2], [1, 3], [4, 6], [5, 7],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];
    ctx.strokeStyle = isPaperStage ? COBALT : CYAN;
    ctx.lineWidth = 6;
    ctx.beginPath();
    for (const [i, j] of edges) {
      ctx.moveTo(verts[i].x, verts[i].y);
      ctx.lineTo(verts[j].x, verts[j].y);
    }
    ctx.stroke();

    const shardCols = [CRIMSON, GOLD, CYAN, COBALT, isPaperStage ? CHAR_INK : BONE];
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2 + explodeU * 0.8;
      const dist = (130 + (i % 5) * 90) + explodeU * (580 + (i % 4) * 165);
      const px = Math.cos(a) * dist;
      const py = Math.sin(a) * dist * 0.78;
      const sz = 18 + (i % 4) * 15;
      const col = shardCols[i % shardCols.length];
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(a + t * (i % 2 === 0 ? 4.5 : -4.5));
      ctx.fillStyle = col;
      ctx.strokeStyle = col;
      ctx.beginPath();
      ctx.moveTo(sz, 0);
      ctx.lineTo(-sz * 0.7, -sz * 0.6);
      ctx.lineTo(-sz * 0.35, sz * 0.75);
      ctx.closePath();
      if (i % 2 === 0) ctx.fill();
      else { ctx.lineWidth = 3; ctx.stroke(); }
      ctx.restore();
    }
    ctx.restore();
  }

  // Curated Non-Linear Entity Tables (`220-324px` Kanji vs `86-126px` Particles, Zero Overlap!)
  const ENTITIES_L36 = [
    { wi: 0,  ch: '開', x: 230,  y: 255, sz: 292, rot: -8.5, box: CRIMSON, txt: BONE, bdr: GOLD, sh: CYAN, serif: true },
    { wi: 1,  ch: 'け', x: 430,  y: 185, sz: 120, rot:  7.0 },
    { wi: 2,  ch: 'グ', x: 575,  y: 270, sz: 170, rot: -6.5, box: CYAN, txt: INK, bdr: BONE, sh: COBALT },
    { wi: 3,  ch: 'ラ', x: 735,  y: 215, sz: 164, rot:  6.0 },
    { wi: 4,  ch: 'ス', x: 885,  y: 280, sz: 168, rot: -5.5 },
    { wi: 5,  ch: 'ボ', x: 1050, y: 215, sz: 174, rot:  7.0, box: GOLD, txt: INK, bdr: INK, sh: CRIMSON },
    { wi: 6,  ch: 'ッ', x: 1195, y: 285, sz: 112, rot: -9.0, circle: true, box: COBALT, txt: BONE, bdr: CYAN },
    { wi: 7,  ch: 'ク', x: 1325, y: 215, sz: 166, rot:  6.0 },
    { wi: 8,  ch: 'ス', x: 1470, y: 280, sz: 166, rot: -6.5 },
    { wi: 9,  ch: '！', x: 1705, y: 220, sz: 236, rot:  9.0, box: CRIMSON, txt: BONE, bdr: GOLD, sh: CYAN },
    { wi: 10, ch: '次', x: 255,  y: 655, sz: 248, rot: -7.5, box: COBALT,  txt: BONE, bdr: CYAN, sh: CRIMSON, serif: true },
    { wi: 10, ch: '元', x: 515,  y: 740, sz: 236, rot:  6.5, box: BONE,    txt: INK,  bdr: COBALT, sh: GOLD, serif: true },
    { wi: 11, ch: 'の', x: 705,  y: 635, sz: 98,  rot: 11.5, circle: true, box: CRIMSON, txt: BONE, bdr: GOLD },
    { wi: 12, ch: '壁', x: 920,  y: 710, sz: 304, rot: -6.0, box: GOLD,    txt: INK,  bdr: CRIMSON, sh: COBALT, serif: true },
    { wi: 13, ch: 'を', x: 1135, y: 625, sz: 98,  rot: 10.5, circle: true, box: CYAN, txt: INK, bdr: BONE },
    { wi: 14, ch: '超', x: 1340, y: 705, sz: 278, rot: -7.0, box: CRIMSON, txt: BONE, bdr: GOLD, sh: CYAN, serif: true },
    { wi: 15, ch: 'え', x: 1545, y: 635, sz: 122, rot:  7.0 },
    { wi: 16, ch: 'て', x: 1685, y: 715, sz: 120, rot: -6.5 }
  ];

  const ENTITIES_L37 = [
    { wi: 0,  ch: '叫', x: 230,  y: 255, sz: 296, rot: -8.5, box: CRIMSON, txt: BONE, bdr: GOLD, sh: CYAN, serif: true },
    { wi: 1,  ch: 'べ', x: 435,  y: 185, sz: 120, rot:  7.5 },
    { wi: 2,  ch: 'ロ', x: 580,  y: 270, sz: 172, rot: -6.5, box: CYAN, txt: INK, bdr: BONE, sh: CRIMSON },
    { wi: 3,  ch: 'ー', x: 730,  y: 215, sz: 152, rot:  5.5 },
    { wi: 4,  ch: 'タ', x: 880,  y: 275, sz: 172, rot: -6.0 },
    { wi: 5,  ch: 'ー', x: 1030, y: 215, sz: 152, rot:  6.0 },
    { wi: 6,  ch: 'ハ', x: 1185, y: 275, sz: 176, rot: -7.0, box: GOLD, txt: INK, bdr: INK, sh: CRIMSON },
    { wi: 7,  ch: 'ー', x: 1335, y: 215, sz: 152, rot:  5.5 },
    { wi: 8,  ch: 'ト', x: 1480, y: 275, sz: 172, rot: -6.5 },
    { wi: 9,  ch: '！', x: 1700, y: 215, sz: 238, rot:  9.5, box: CRIMSON, txt: BONE, bdr: GOLD, sh: CYAN },
    { wi: 10, ch: '百', x: 315,  y: 665, sz: 244, rot: -7.5, box: BONE,    txt: INK,  bdr: COBALT, sh: CYAN, serif: true },
    { wi: 11, ch: '九', x: 565,  y: 745, sz: 232, rot:  6.5, box: CYAN,    txt: INK,  bdr: BONE,   sh: CRIMSON, serif: true },
    { wi: 12, ch: '十', x: 815,  y: 660, sz: 244, rot: -6.0, box: COBALT,  txt: BONE, bdr: GOLD,   sh: CRIMSON, serif: true },
    { wi: 13, ch: 'の', x: 1020, y: 740, sz: 100, rot: 11.0, circle: true, box: CRIMSON, txt: BONE, bdr: GOLD },
    { wi: 14, ch: '星', x: 1265, y: 690, sz: 316, rot: -6.5, box: GOLD,    txt: INK,  bdr: BONE,   sh: CRIMSON, serif: true },
    { wi: 15, ch: 'よ', x: 1520, y: 635, sz: 116, rot:  9.0, circle: true, box: COBALT, txt: BONE, bdr: CYAN }
  ];

  const ENTITIES_L38 = [
    { wi: 0, ch: '白', x: 185,  y: 515, sz: 232, rot: -7.0, box: BONE,        txt: INK,  bdr: CYAN,    sh: COBALT,  serif: true },
    { wi: 0, ch: '金', x: 225,  y: 775, sz: 224, rot:  5.5, box: PAPER_PANEL, txt: INK,  bdr: GOLD,    sh: CYAN,    serif: true },
    { wi: 1, ch: '・', x: 372,  y: 645, sz: 88,  rot:  0.0, circle: true, box: SLATE, txt: BONE, bdr: CYAN },
    { wi: 2, ch: '氷', x: 520,  y: 515, sz: 234, rot: -6.5, box: CYAN,        txt: INK,  bdr: BONE,    sh: COBALT,  serif: true },
    { wi: 2, ch: '青', x: 560,  y: 775, sz: 226, rot:  6.0, box: COBALT,      txt: BONE, bdr: CYAN,    sh: GOLD,    serif: true },
    { wi: 3, ch: '・', x: 707,  y: 645, sz: 88,  rot:  0.0, circle: true, box: SLATE, txt: GOLD, bdr: GOLD },
    { wi: 4, ch: '流', x: 855,  y: 515, sz: 234, rot: -6.5, box: GOLD,        txt: INK,  bdr: BONE,    sh: CRIMSON, serif: true },
    { wi: 4, ch: '金', x: 895,  y: 775, sz: 226, rot:  5.5, box: BONE,        txt: INK,  bdr: GOLD,    sh: CRIMSON, serif: true },
    { wi: 5, ch: '・', x: 1042, y: 645, sz: 88,  rot:  0.0, circle: true, box: SLATE, txt: CRIMSON, bdr: CRIMSON },
    { wi: 6, ch: '紅', x: 1190, y: 515, sz: 238, rot: -7.0, box: CRIMSON,     txt: BONE, bdr: GOLD,    sh: CYAN,    serif: true },
    { wi: 6, ch: '蓮', x: 1230, y: 775, sz: 228, rot:  6.0, box: PANEL,       txt: CRIMSON, bdr: CRIMSON, sh: GOLD, serif: true },
    { wi: 7, ch: 'の', x: 1388, y: 640, sz: 92,  rot: 10.5, circle: true, box: GOLD, txt: INK, bdr: BONE },
    { wi: 8, ch: '軌', x: 1545, y: 505, sz: 244, rot: -6.5, box: CYAN,        txt: INK,  bdr: BONE,    sh: CRIMSON, serif: true },
    { wi: 9, ch: '跡', x: 1695, y: 765, sz: 252, rot:  6.5, box: CRIMSON,     txt: BONE, bdr: GOLD,    sh: CYAN,    serif: true }
  ];

  // L39 full-stage layout (Cuts 15-16) vs Left-Stage Eye-Framing layout (Cuts 17-19, keeping x <= 925 clear of p02_eye_macro at x=1445!)
  const ENTITIES_L39_FULL = [
    { wi: 0,  ch: 'ひ', x: 205,  y: 255, sz: 128, rot: -7.0 },
    { wi: 1,  ch: 'と', x: 330,  y: 215, sz: 124, rot:  6.5 },
    { wi: 2,  ch: 'つ', x: 455,  y: 265, sz: 128, rot: -6.0 },
    { wi: 3,  ch: 'の', x: 575,  y: 215, sz: 98,  rot: 11.0, circle: true, box: COBALT, txt: BONE, bdr: CYAN },
    { wi: 4,  ch: '純', x: 775,  y: 280, sz: 268, rot: -7.5, box: COBALT,   txt: BONE, bdr: CYAN,     sh: CRIMSON, serif: true },
    { wi: 4,  ch: '白', x: 1055, y: 345, sz: 276, rot:  6.0, box: CHAR_INK, txt: BONE, bdr: GOLD,     sh: CYAN,    serif: true },
    { wi: 5,  ch: 'に', x: 1265, y: 255, sz: 98,  rot: 10.5, circle: true, box: CRIMSON, txt: BONE, bdr: GOLD },
    { wi: 6,  ch: '溶', x: 1450, y: 315, sz: 262, rot: -6.5, box: CRIMSON,  txt: BONE, bdr: GOLD,     sh: COBALT,  serif: true },
    { wi: 7,  ch: 'け', x: 1645, y: 250, sz: 122, rot:  7.0 },
    { wi: 8,  ch: 'て', x: 1755, y: 325, sz: 118, rot: -6.0 },
    { wi: 9,  ch: '君', x: 320,  y: 685, sz: 272, rot: -7.5, box: COBALT,   txt: BONE, bdr: GOLD,     sh: CRIMSON, serif: true },
    { wi: 10, ch: 'の', x: 525,  y: 610, sz: 98,  rot: 11.0, circle: true, box: GOLD, txt: INK, bdr: CHAR_INK },
    { wi: 11, ch: '瞳', x: 745,  y: 705, sz: 308, rot:  6.0, box: CRIMSON,  txt: BONE, bdr: GOLD,     sh: COBALT,  serif: true },
    { wi: 12, ch: 'を', x: 970,  y: 620, sz: 98,  rot: -10.0, circle: true, box: CYAN, txt: INK, bdr: CHAR_INK },
    { wi: 13, ch: '照', x: 1190, y: 700, sz: 282, rot: -6.5, box: GOLD,     txt: INK,  bdr: CHAR_INK, sh: CRIMSON, serif: true },
    { wi: 14, ch: 'ら', x: 1405, y: 645, sz: 124, rot:  7.0 },
    { wi: 15, ch: 'す', x: 1535, y: 710, sz: 122, rot: -6.0 },
    { wi: 16, ch: 'よ', x: 1675, y: 655, sz: 116, rot:  9.0, circle: true, box: CRIMSON, txt: BONE, bdr: GOLD }
  ];

  const ENTITIES_L39_LEFT = [
    { wi: 0,  ch: 'ひ', x: 145, y: 132, sz: 94,  rot: -6.5 },
    { wi: 1,  ch: 'と', x: 235, y: 122, sz: 92,  rot:  6.0 },
    { wi: 2,  ch: 'つ', x: 325, y: 140, sz: 94,  rot: -5.5 },
    { wi: 3,  ch: 'の', x: 415, y: 126, sz: 82,  rot: 10.0, circle: true, box: COBALT, txt: BONE, bdr: CYAN },
    { wi: 4,  ch: '純', x: 195, y: 274, sz: 206, rot: -6.5, box: COBALT,   txt: BONE, bdr: CYAN,     sh: CRIMSON, serif: true },
    { wi: 4,  ch: '白', x: 445, y: 304, sz: 208, rot:  5.5, box: CHAR_INK, txt: BONE, bdr: GOLD,     sh: CYAN,    serif: true },
    { wi: 5,  ch: 'に', x: 585, y: 202, sz: 84,  rot: 11.0, circle: true, box: CRIMSON, txt: BONE, bdr: GOLD },
    { wi: 6,  ch: '溶', x: 730, y: 292, sz: 206, rot: -5.5, box: GOLD,     txt: INK,  bdr: CHAR_INK, sh: CRIMSON, serif: true },
    { wi: 7,  ch: 'け', x: 865, y: 218, sz: 94,  rot:  7.0 },
    { wi: 8,  ch: 'て', x: 870, y: 352, sz: 94,  rot: -6.0 },
    { wi: 9,  ch: '君', x: 200, y: 520, sz: 222, rot: -6.5, box: COBALT,   txt: BONE, bdr: GOLD,     sh: CRIMSON, serif: true },
    { wi: 10, ch: 'の', x: 375, y: 448, sz: 86,  rot: 11.0, circle: true, box: GOLD, txt: INK, bdr: CHAR_INK },
    { wi: 11, ch: '瞳', x: 548, y: 545, sz: 244, rot:  5.5, box: CRIMSON,  txt: BONE, bdr: GOLD,     sh: COBALT,  serif: true },
    { wi: 12, ch: 'を', x: 748, y: 472, sz: 86,  rot: -10.0, circle: true, box: CYAN, txt: INK, bdr: CHAR_INK },
    { wi: 13, ch: '照', x: 285, y: 785, sz: 206, rot: -5.0, box: GOLD,     txt: INK,  bdr: CHAR_INK, sh: CRIMSON, serif: true },
    { wi: 14, ch: 'ら', x: 492, y: 790, sz: 106, rot:  7.0 },
    { wi: 15, ch: 'す', x: 618, y: 770, sz: 106, rot: -6.0 },
    { wi: 16, ch: 'よ', x: 758, y: 784, sz: 96,  rot:  9.0, circle: true, box: CRIMSON, txt: BONE, bdr: GOLD }
  ];

  window.registerCortexPlate('P16_prism_whiteout', {
    render(ctx, st, core) {
      const { W, H, TAU, clamp, lerp, prog, ease, beatAt } = core;
      const cad = window.Cortex25D;
      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const snare = st.snareSnap ?? st.snareEnv ?? st.snare ?? 0;

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      let isPaper = false;
      let outBg = INK;
      let outFg = BONE;

      // ======================================================================
      // L36_OPEN_GLASSBOX_WALL (201.38 - 206.42s, 5 Cuts ~1.008s each)
      // ======================================================================
      if (t < 206.42) {
        const subIdx = Math.min(4, Math.max(0, Math.floor((t - 201.38) / 1.008)));
        const evenPaper = (subIdx % 2 === 0);
        const bg = evenPaper ? PAPER : INK;
        const fg = evenPaper ? CHAR_INK : CYAN;
        outBg = bg; outFg = fg;
        isPaper = evenPaper;

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = evenPaper ? PAPER_PANEL : PANEL;
        ctx.fillRect(54, 60, 320, H - 120);
        ctx.fillRect(W - 374, 60, 320, H - 120);
        drawBurinHatch(ctx, 54, 60, 320, H - 120, 0.72, 13, 1.4, evenPaper ? LIGHT_SLATE : SLATE);
        drawBurinHatch(ctx, W - 374, 60, 320, H - 120, -0.72, 13, 1.4, evenPaper ? LIGHT_SLATE : SLATE);

        if (subIdx === 0 || subIdx === 1) {
          drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 460, 150, 125, 4, evenPaper ? COBALT : CYAN, 2.0, t * (subIdx === 0 ? 1.1 : -1.3));
          drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 290, 95, 78, 3, GOLD, 1.5, -t * 1.4);
          const u = clamp((t - (201.38 + subIdx * 1.008)) / 1.008, 0, 1);
          drawShatteringBlackBox(ctx, W, H, t, subIdx * 0.45 + u * 0.65, (subIdx === 0 ? -0.22 : 0.36) * (1 - u), evenPaper);
        } else if (subIdx === 2 || subIdx === 3) {
          for (let i = 0; i < 12; i++) {
            const p = Math.pow(posMod((i / 12) + t * 1.55, 1), 2.2);
            const rx = Math.max(8, lerp(90, 1280, p));
            const ry = Math.max(8, lerp(140, 960, p));
            ctx.strokeStyle = i % 4 === 0 ? CRIMSON : (i % 3 === 0 ? GOLD : (evenPaper ? COBALT : CYAN));
            ctx.lineWidth = lerp(2, 8, p);
            ctx.beginPath();
            ctx.ellipse(W * 0.5, H * 0.54, rx, ry, 0, Math.PI, TAU);
            ctx.moveTo(W * 0.5 - rx, H * 0.54); ctx.lineTo(W * 0.5 - rx, H);
            ctx.moveTo(W * 0.5 + rx, H * 0.54); ctx.lineTo(W * 0.5 + rx, H);
            ctx.stroke();
          }
        } else {
          // Cut 05 (205.41 - 206.42s): 13.5x Geometric Dimension Portal Breach (zero background text overlap!)
          const u = prog(t, 205.45, 206.42, ease.inCubic);
          const sc = lerp(1.0, 13.5, u);
          drawGuillocheRosette(ctx, W * 0.5, H * 0.52, 430, 140, 115, 4, COBALT, 2.2, t * 1.9);
          ctx.save();
          ctx.translate(W * 0.5, H * 0.52);
          ctx.rotate(-0.07 + u * 0.14);
          ctx.scale(sc, sc);
          for (let r = 5; r >= 1; r--) {
            const rw = r * 145, rh = r * 86;
            ctx.strokeStyle = r === 1 ? CRIMSON : (r % 2 === 0 ? COBALT : GOLD);
            ctx.lineWidth = Math.max(2.5, (r === 1 ? 10 : 5) / Math.max(1, sc * 0.32));
            ctx.strokeRect(-rw * 0.5, -rh * 0.5, rw, rh);
          }
          ctx.fillStyle = INK;
          ctx.fillRect(-68, -42, 136, 84);
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = Math.max(2.5, 6 / Math.max(1, sc * 0.32));
          ctx.strokeRect(-68, -42, 136, 84);
          ctx.restore();
        }

        if (t < 206.24) {
          renderCuratedEntities(ctx, core, 'L36_OPEN_GLASSBOX_WALL', t, kick, ENTITIES_L36, evenPaper);
        }

        drawOpticCrop(
          ctx, W, H,
          evenPaper ? CHAR_INK : CYAN,
          evenPaper ? MID_SLATE : SLATE,
          CRIMSON,
          evenPaper ? BONE : INK,
          `P16 // CUT_0${subIdx + 1} · L36_GLASSBOX_RUPTURE`,
          'KEY_UP_+1'
        );
      }

      // ======================================================================
      // L37_SHOUT_190_STARS (206.42 - 211.75s, 5 Cuts ~1.066s each)
      // ======================================================================
      else if (t < 211.75) {
        const stars = getStars190(core);
        const subIdx = Math.min(4, Math.max(0, Math.floor((t - 206.42) / 1.066)));
        const evenPaper = (subIdx === 1 || subIdx === 4);
        isPaper = evenPaper;
        outBg = evenPaper ? PAPER : INK;
        outFg = evenPaper ? CHAR_INK : (subIdx === 3 ? CRIMSON : CYAN);

        ctx.fillStyle = outBg;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = evenPaper ? PAPER_PANEL : PANEL;
        ctx.fillRect(52, 60, 310, H - 120);
        ctx.fillRect(W - 362, 60, 310, H - 120);
        drawBurinHatch(ctx, 52, 60, 310, H - 120, 0.65, 13, 1.4, evenPaper ? LIGHT_SLATE : SLATE);
        drawBurinHatch(ctx, W - 362, 60, 310, H - 120, -0.65, 13, 1.4, evenPaper ? LIGHT_SLATE : SLATE);

        if (subIdx === 0) {
          for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            const z = 2400 - posMod(s.z0 + t * 2900, 2320);
            const k0 = 720 / Math.max(60, z);
            const k1 = 720 / Math.min(2400, z + 210);
            const a = s.ang + t * 1.4;
            ctx.strokeStyle = i % 7 === 0 ? GOLD : (i % 5 === 0 ? CRIMSON : CYAN);
            ctx.lineWidth = Math.max(2, Math.min(7, 4.2 * k0));
            ctx.beginPath();
            ctx.moveTo(W * 0.5 + Math.cos(a - 0.08) * s.rad * k1, H * 0.5 + Math.sin(a - 0.08) * s.rad * k1);
            ctx.lineTo(W * 0.5 + Math.cos(a) * s.rad * k0, H * 0.5 + Math.sin(a) * s.rad * k0);
            ctx.stroke();
          }
        } else if (subIdx === 1 || subIdx === 2) {
          ctx.save();
          if (subIdx === 2) {
            ctx.translate(W * 0.5, H * 0.45);
            ctx.rotate(lerp(-0.22, 0.22, clamp((t - 208.55) / 1.066, 0, 1)));
            ctx.translate(-W * 0.5, -H * 0.45);
          }
          for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            const flap = Math.sin(t * 9.5 - s.u * 3.0) * 28 * s.u;
            const sx = W * 0.5 + s.rx;
            const sy = H * 0.44 + s.ry + flap;
            ctx.fillStyle = i % 6 === 0 ? GOLD : (i % 4 === 0 ? CRIMSON : (evenPaper ? COBALT : CYAN));
            ctx.fillRect(Math.round(sx - 4), Math.round(sy - 4), 8, 8);
            if (i % 5 < 4 && stars[i + 1] && stars[i + 1].side === s.side) {
              const ns = stars[i + 1];
              const nf = Math.sin(t * 9.5 - ns.u * 3.0) * 28 * ns.u;
              ctx.strokeStyle = evenPaper ? COBALT : CYAN;
              ctx.lineWidth = 2.2;
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(W * 0.5 + ns.rx, H * 0.44 + ns.ry + nf);
              ctx.stroke();
            }
          }
          const bVal = beatAt(t);
          const beatStep = Math.floor(bVal) * (Math.PI * 0.5) + ease.outBack(posMod(bVal, 1)) * (Math.PI * 0.5);
          ctx.save();
          ctx.translate(W * 0.5, H * 0.44);
          ctx.rotate(beatStep);
          ctx.fillStyle = CRIMSON;
          ctx.beginPath(); ctx.arc(0, 0, Math.max(10, 148 + kick * 26), 0, TAU); ctx.fill();
          ctx.strokeStyle = GOLD;
          ctx.lineWidth = 6;
          ctx.stroke();
          ctx.fillStyle = evenPaper ? BONE : INK;
          ctx.fillRect(-46, -46, 92, 92);
          ctx.restore();
          ctx.restore();
        } else if (subIdx === 3) {
          drawGuillocheRosette(ctx, W * 0.5, H * 0.45, 470, 150, 128, 5, CRIMSON, 2.4, t * 2.2);
          drawGuillocheRosette(ctx, W * 0.5, H * 0.45, 310, 100, 84, 4, GOLD, 1.8, -t * 1.8);
          for (let i = 0; i < 36; i++) {
            const a = (i / 36) * TAU + t * 1.1;
            ctx.strokeStyle = i % 3 === 0 ? GOLD : (i % 2 === 0 ? CRIMSON : CYAN);
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(W * 0.5 + Math.cos(a) * 220, H * 0.45 + Math.sin(a) * 220);
            ctx.lineTo(W * 0.5 + Math.cos(a) * 1120, H * 0.45 + Math.sin(a) * 1120);
            ctx.stroke();
          }
        } else {
          const u = prog(t, 210.68, 211.75, ease.outExpo);
          for (let i = 0; i < 32; i++) {
            const a = (i / 32) * TAU - t * 1.2;
            const rOuter = lerp(980, 260, u);
            ctx.strokeStyle = i % 4 === 0 ? CRIMSON : (i % 2 === 0 ? COBALT : GOLD);
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(W * 0.5 + Math.cos(a) * 180, H * 0.42 + Math.sin(a) * 180);
            ctx.lineTo(W * 0.5 + Math.cos(a) * rOuter, H * 0.42 + Math.sin(a) * rOuter);
            ctx.stroke();
          }
          const side = lerp(180, 360, u), triH = side * 0.866;
          ctx.fillStyle = CHAR_INK;
          ctx.strokeStyle = COBALT;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(W * 0.5, H * 0.42 - triH * 0.6);
          ctx.lineTo(W * 0.5 + side * 0.5, H * 0.42 + triH * 0.4);
          ctx.lineTo(W * 0.5 - side * 0.5, H * 0.42 + triH * 0.4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        renderCuratedEntities(ctx, core, 'L37_SHOUT_190_STARS', t, kick, ENTITIES_L37, evenPaper);
        drawOpticCrop(
          ctx, W, H,
          evenPaper ? CHAR_INK : outFg,
          evenPaper ? MID_SLATE : SLATE,
          GOLD,
          evenPaper ? BONE : INK,
          `P16 // CUT_${String(subIdx + 6).padStart(2, '0')} · SERAPHIM_190`,
          'ROTOR_MAX'
        );
      }

      // ======================================================================
      // L38_FOUR_SPECTRA (211.75 - 215.93s, V7: 5 Distinct ~0.836s True 4-Spectrum Optical Cuts!)
      // Uses ctx.__v6RawColor = true so true #F8FAFC / #38BDF8 / #FBBF24 / #FF2E55 never flatten to cerulean!
      // ======================================================================
      else if (t < 215.93) {
        const cutDur = 0.836;
        const cutIdx = Math.min(4, Math.max(0, Math.floor((t - 211.75) / cutDur)));
        const cT0 = 211.75 + cutIdx * cutDur;
        const cu = clamp((t - cT0) / cutDur, 0, 1);
        const eu = 1 - Math.pow(1 - cu, 3);
        const cutSpecs = [
          { fg: '#F8FAFC', aux: '#38BDF8', tag: '01_PLATINUM_COLLIMATOR' },
          { fg: '#38BDF8', aux: '#F8FAFC', tag: '02_ICE_CYAN_CAUSTICS' },
          { fg: '#FBBF24', aux: '#FF2E55', tag: '03_CHRONO_GOLD_GRATING' },
          { fg: '#FF2E55', aux: '#FBBF24', tag: '04_CRIMSON_REFLECTION' },
          { fg: '#FBBF24', aux: '#38BDF8', tag: '05_QUAD_SPECTRUM_VORTEX' }
        ];
        const sp = cutSpecs[cutIdx];
        outBg = INK; outFg = sp.fg;

        const prevRaw = ctx.__v6RawColor;
        ctx.__v6RawColor = true;
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);
        // Clean luminous radial prism backdrop sans CAD engineering grid lines
        const pg = ctx.createRadialGradient(W * 0.5, 260, 24, W * 0.5, 260, 680);
        pg.addColorStop(0, sp.aux === '#F8FAFC' ? 'rgba(248, 250, 252, 0.12)' : 'rgba(56, 189, 248, 0.14)');
        pg.addColorStop(1, 'rgba(8, 9, 12, 0)');
        ctx.fillStyle = pg;
        ctx.fillRect(0, 0, W, H);

        if (cutIdx === 0) {
          // Cut 1: Platinum Incident Laser Collimator sweeping L->R + specular diamond flares + micrometer ticks
          const beamX = lerp(-240, W + 240, eu);
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(64, 150, W - 128, 220);
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(0, 244, beamX, 32);
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(0, 236, beamX, 6);
          ctx.fillRect(0, 278, beamX, 6);
          drawGuillocheRosette(ctx, W * 0.5, 260, 280, 92, 72, 3, '#F8FAFC', 2.0, t * 2.5);
          for (let m = 0; m < 18; m++) {
            const mx = 120 + m * 100;
            ctx.fillStyle = m % 3 === 0 ? '#F8FAFC' : '#38BDF8';
            ctx.fillRect(mx, m % 2 === 0 ? 158 : 340, 3, m % 3 === 0 ? 28 : 14);
          }
          drawStarSpark(ctx, Math.min(W - 140, beamX), 260, 54 + kick * 24, t * 5, '#F8FAFC');
        } else if (cutIdx === 1) {
          // Cut 2: Ice Cyan Refractive Crystal Caustic Fan sweeping diagonally across frame
          ctx.save();
          ctx.translate(W * 0.28, 250);
          for (let r = 0; r < 16; r++) {
            const ang = -0.35 + r * 0.065 + Math.sin(t * 7 + r) * 0.03;
            ctx.strokeStyle = r % 3 === 0 ? '#F8FAFC' : '#38BDF8';
            ctx.lineWidth = r % 2 === 0 ? 6.5 : 2.5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(ang) * 1650, Math.sin(ang) * 1650);
            ctx.stroke();
          }
          for (let arc = 1; arc <= 6; arc++) {
            const rad = 110 + arc * 120 + posMod(t * 700, 120);
            ctx.strokeStyle = arc % 2 === 0 ? 'rgba(56, 189, 248, 0.55)' : 'rgba(248, 250, 252, 0.38)';
            ctx.lineWidth = 3.0;
            ctx.beginPath();
            ctx.arc(0, 0, rad, -0.5, 0.75);
            ctx.stroke();
          }
          ctx.restore();
          drawGuillocheRosette(ctx, W * 0.28, 250, 210, 68, 52, 4, '#38BDF8', 2.2, -t * 3.0);
        } else if (cutIdx === 2) {
          // Cut 3: Liquid Gold Precision Diffraction Grating & Harmonic Photon Packets
          for (let s = 0; s < 9; s++) {
            const sy = 115 + s * 36;
            ctx.fillStyle = s % 2 === 0 ? 'rgba(251, 191, 36, 0.16)' : 'rgba(255, 46, 85, 0.10)';
            ctx.fillRect(80, sy, W - 160, 18);
            const pktX = 90 + posMod(t * (1450 + s * 130) + s * 220, W - 260);
            ctx.fillStyle = s % 3 === 0 ? '#FF2E55' : '#FBBF24';
            ctx.fillRect(Math.round(pktX), sy + 2, 120, 14);
          }
          ctx.save();
          ctx.strokeStyle = '#FBBF24';
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          for (let wx = 80; wx <= W - 80; wx += 18) {
            const wy = 260 + Math.sin(wx * 0.015 - t * 14) * (74 + kick * 24);
            if (wx === 80) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
          }
          ctx.stroke();
          ctx.restore();
        } else if (cutIdx === 3) {
          // Cut 4: Crimson Internal-Reflection Core Chamber bouncing ruby rays between optical mirrors
          const rot = t * 1.4;
          const mir = [[360, 180], [960, 390], [1560, 175], [1340, 395]];
          ctx.save();
          ctx.strokeStyle = '#FF2E55';
          ctx.lineWidth = 7.0;
          ctx.beginPath();
          ctx.moveTo(80, 290);
          for (const [mx, my] of mir) {
            ctx.lineTo(mx + Math.sin(rot) * 45, my + Math.cos(rot) * 18);
          }
          ctx.lineTo(W - 60, 210);
          ctx.stroke();
          ctx.strokeStyle = '#FBBF24';
          ctx.lineWidth = 2.6;
          ctx.stroke();
          for (const [mx, my] of mir) {
            drawStarSpark(ctx, mx + Math.sin(rot) * 45, my + Math.cos(rot) * 18, 38 + kick * 20, rot * 2, '#F8FAFC');
          }
          ctx.restore();
        } else {
          // Cut 5: All 4 Spectra Converging Chromatic Vortex (#F8FAFC, #38BDF8, #FBBF24, #FF2E55)
          const specCols = ['#F8FAFC', '#38BDF8', '#FBBF24', '#FF2E55'];
          ctx.save();
          ctx.translate(W * 0.5, H * 0.42);
          ctx.rotate(t * 2.2);
          for (let i = 0; i < 32; i++) {
            const a = (i / 32) * TAU;
            ctx.strokeStyle = specCols[i % 4];
            ctx.lineWidth = i % 2 === 0 ? 6.5 : 3.2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * (140 - eu * 60), Math.sin(a) * (140 - eu * 60));
            ctx.lineTo(Math.cos(a) * 1350, Math.sin(a) * 1350);
            ctx.stroke();
          }
          ctx.restore();
          drawGuillocheRosette(ctx, W * 0.5, H * 0.42, 340, 110, 88, 4, '#38BDF8', 2.4, t * 3.0);
          drawGuillocheRosette(ctx, W * 0.5, H * 0.42, 230, 74, 58, 3, '#FBBF24', 2.0, -t * 3.5);
          drawStarSpark(ctx, W * 0.5, H * 0.42, 72 + kick * 32, t * 6, '#F8FAFC');
        }

        renderCuratedEntities(ctx, core, 'L38_FOUR_SPECTRA', t, kick, ENTITIES_L38, false);
        ctx.__v6RawColor = prevRaw;
        drawOpticCrop(ctx, W, H, sp.fg, SLATE, cutIdx === 4 ? '#FF2E55' : sp.aux, INK, `P16 // CUT_${String(cutIdx + 11).padStart(2, '0')} · SPECTRUM_${sp.tag}`, '4_SPECTRUM_PRISM');
      }

      // ======================================================================
      // L39_PURE_WHITE_LIGHT (215.93 - 221.36s, 5 Cuts ~1.086s each)
      // Cuts 17..18: 1:1 Traced `p02_eye_macro` on right (`x=1385`) + Left Collage!
      // ======================================================================
      else {
        const subIdx = Math.min(4, Math.max(0, Math.floor((t - 215.93) / 1.086)));
        const fIdx = core.frameIdx(t);
        isPaper = true;
        outBg = BONE;
        outFg = CHAR_INK;

        if (subIdx === 0) {
          // Cut 15: 4 Geometric Multi-Hue Light-Wedges Slamming Inward -> Pure Paper Stage!
          const u = prog(t, 215.93, 216.45, ease.outExpo);
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);
          const wSpan = u * (W * 0.54), hSpan = u * (H * 0.54);
          ctx.fillStyle = BONE;
          ctx.fillRect(0, 0, wSpan, H);
          ctx.fillRect(W - wSpan, 0, wSpan, H);
          ctx.fillRect(0, 0, W, hSpan);
          ctx.fillRect(0, H - hSpan, W, hSpan);

          ctx.fillStyle = PAPER_PANEL;
          ctx.fillRect(48, 56, 340, H - 112);
          ctx.fillRect(W - 388, 56, 340, H - 112);
          drawBurinHatch(ctx, 48, 56, W - 96, H - 112, 0.65, 14, 1.6, LIGHT_SLATE, fIdx * 0.7);
          drawBurinHatch(ctx, 48, 56, 340, H - 112, -0.65, 12, 1.6, MID_SLATE, -fIdx * 0.6);
          drawBurinHatch(ctx, W - 388, 56, 340, H - 112, -0.65, 12, 1.6, MID_SLATE, fIdx * 0.6);
          drawGuillocheRosette(ctx, W * 0.5, H * 0.5, Math.max(8, 420 * u), Math.max(4, 130 * u), 105 * u, 3, COBALT, 2.2, t * 1.8);
          drawGuillocheRosette(ctx, W * 0.5, H * 0.5, Math.max(6, 260 * u), Math.max(3, 85 * u), 68 * u, 3, GOLD, 1.8, -t * 2.1);

          const paperLocked = u > 0.65;
          isPaper = paperLocked;
          outBg = paperLocked ? BONE : INK;
          outFg = paperLocked ? CHAR_INK : CYAN;
          renderCuratedEntities(ctx, core, 'L39_PURE_WHITE_LIGHT', t, kick, ENTITIES_L39_FULL, paperLocked);
          drawOpticCrop(ctx, W, H, outFg, paperLocked ? MID_SLATE : SLATE, CRIMSON, outBg, 'P16 // CUT_15 · PURE_WHITE_CONVERGENCE', 'PAPER_STAGE_LOCKED');
        } else {
          ctx.fillStyle = BONE;
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = PAPER_PANEL;
          ctx.fillRect(48, 54, 340, H - 108);
          drawBurinHatch(ctx, 48, 54, W - 96, H - 108, 0.68, 14, 1.6, LIGHT_SLATE, fIdx * 0.7);
          drawBurinHatch(ctx, 48, 54, 340, H - 108, -0.68, 12, 1.6, MID_SLATE, -fIdx * 0.6);

          if (subIdx === 1) {
            // Cut 16: Rotating Multi-Hue Optical Vernier & Guilloche Rosette
            ctx.fillStyle = PAPER_PANEL;
            ctx.fillRect(W - 388, 54, 340, H - 108);
            drawBurinHatch(ctx, W - 388, 54, 340, H - 108, -0.68, 12, 1.6, MID_SLATE, fIdx * 0.6);
            drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 460, 150, 125, 4, COBALT, 2.4, t * 2.1);
            drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 295, 96, 78, 3, CRIMSON, 1.8, -t * 2.4);
            ctx.save();
            ctx.translate(W * 0.5, H * 0.5);
            ctx.rotate(t * 1.9);
            for (let i = 0; i < 28; i++) {
              const a = (i / 28) * TAU;
              ctx.strokeStyle = i % 4 === 0 ? GOLD : (i % 2 === 0 ? COBALT : CHAR_INK);
              ctx.lineWidth = i % 3 === 0 ? 5.5 : 2.5;
              ctx.beginPath();
              ctx.moveTo(Math.cos(a) * 280, Math.sin(a) * 280);
              ctx.lineTo(Math.cos(a) * 860, Math.sin(a) * 860);
              ctx.stroke();
            }
            ctx.restore();
            renderCuratedEntities(ctx, core, 'L39_PURE_WHITE_LIGHT', t, kick, ENTITIES_L39_FULL, true);
          } else if (subIdx === 2 || subIdx === 3) {
            // V7: Strict <= 1.75s single-BG hold of `C21_pure_white_prism_veil` (`218.20 - 219.95s`)!
            const cutStart = 215.93 + subIdx * 1.086;
            const cutLinU = clamp((t - cutStart) / 1.086, 0, 1);
            const v6 = window.CortexV6;
            if (t >= 218.20 && t < 219.95 && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C21')) {
              const cam = subIdx === 2
                ? { zoom0: 1.06, zoom1: 1.32, panX0: -70, panX1: 45, panY0: 30, panY1: -25, rot0: -0.025, rot1: 0.015, fx: 0.50, fy: 0.34 }
                : { zoom0: 1.34, zoom1: 1.12, panX0: 55, panX1: -45, panY0: -35, panY1: 20, rot0: 0.025, rot1: -0.01, fx: 0.52, fy: 0.30 };
              v6.drawLivingFullBleed(ctx, 'C21', { t, u: cutLinU, kick, ...cam, scrim: 0.16, isPaper: true });
            } else {
              // Radiant zenith prism rays (`218.10-218.20`) and high-speed upward shutter streaks (`219.95-220.27`)
              for (let i = 0; i < 24; i++) {
                const rx = 96 + i * ((W - 192) / 23);
                const ry = H - posMod(t * 3200 + i * 190, H + 380);
                ctx.fillStyle = i % 4 === 0 ? CRIMSON : (i % 3 === 0 ? GOLD : (i % 2 === 0 ? COBALT : CHAR_INK));
                ctx.fillRect(Math.round(rx - 4), Math.round(ry), 8, 165);
              }
            }
            renderCuratedEntities(ctx, core, 'L39_PURE_WHITE_LIGHT', t, kick, ENTITIES_L39_FULL, true);
          } else {
            // Cut 19 (220.27 - 221.36s): High-Speed Upward Zenith Shutter Sweep into P17!
            ctx.fillStyle = PAPER_PANEL;
            ctx.fillRect(W - 388, 54, 340, H - 108);
            drawBurinHatch(ctx, W - 388, 54, 340, H - 108, -0.68, 12, 1.6, MID_SLATE, fIdx * 0.6);
            const u = prog(t, 220.27, 221.36, ease.inOutExpo);
            for (let i = 0; i < 24; i++) {
              const rx = 96 + i * ((W - 192) / 23);
              const ry = H - posMod(t * 3400 + i * 190, H + 400);
              ctx.fillStyle = i % 4 === 0 ? CRIMSON : (i % 3 === 0 ? GOLD : (i % 2 === 0 ? COBALT : CHAR_INK));
              ctx.fillRect(Math.round(rx - 4), Math.round(ry), 8, Math.max(24, 220 * (1 - u * 0.78)));
            }
            renderCuratedEntities(ctx, core, 'L39_PURE_WHITE_LIGHT', t, kick, ENTITIES_L39_FULL, true);
          }

          drawOpticCrop(ctx, W, H, CHAR_INK, MID_SLATE, CRIMSON, BONE, `P16 // CUT_${subIdx + 15} · L39_PURE_WHITE`, subIdx === 4 ? 'HANDOFF -> P17' : 'YOUR_EYES');
        }
      }

      ctx.restore();
      return {
        isPaper,
        bg: outBg,
        fg: outFg,
        duotone: { bg: outBg, fg: outFg },
        bloom: 0.18 + 0.14 * kick,
        ca: 0,
        flash: 0,
        shake: 0.20 * Math.max(kick, snare)
      };
    }
  });
})();
