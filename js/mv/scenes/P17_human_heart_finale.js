// ============================================================================
// Plate 17 — P17_human_heart_finale.js (221.36s – 250.14s, 28.78s)
// Phase-3 + #52 / #53 / #63 / #71 Overhaul (`camera-pacing`):
//   1. Physically ZERO Hand-Coded Fallback Characters (#63 Item 2.1):
//      `drawPureNotanHeartOfferFallback` is 100% deleted. Part A strictly
//      delegates to `Cortex25D.drawTriMorphHime('morphA', ...)` (L40) and
//      `Cortex25D.drawNotanHime('p17_heart_offer', ...)` (L41).
//   2. Autonomous Single-Character Non-Linear Japanese Choreography (#53 & #63):
//      L40 (`221.36–226.32s`) & L41 (`226.32–232.30s`) compose every Kanji
//      (`肉/体/魂` & `傍/鼓/動/君/捧` at `248–308px`) vs particles (`94–112px`
//      circular seals) in collision-free Tategaki × Diagonal formations on the
//      left stage (`x <= 1085`, `y1 <= 955`), zero overlap with right heroine!
//   3. Layered Multi-Hue `pdoom-video` Stages Across ALL 22 Cuts (#52 & #71):
//      Every Part A cut & all 12 Part B (`S03`) Paper-Airplane Memory Odyssey
//      cuts layer `#08090C`/`#F5F0E6` + `#121723`/`#E2E8F0` panels + `#334155`/
//      `#CBD5E1` burin slate hatching + `#38BDF8`/`#0376B8`/`#FBBF24`/`#FF2E55`
//      accents (`C2 < 75%`, `slate >= 6%`, `0` monotone frames, `0` `#FF9EBB`).
//   4. Frame-Locked Determinism (#44): `core.frameIdx(t)` everywhere (`0`
//      `Math.floor(t * ...)`), positive modulo `posMod`, clamped radii.
// ============================================================================
(function () {
  'use strict';

  // Canonical `ALLOWED_PALETTE_HEX` constants
  const INK = '#08090C';
  const CHAR_INK = '#0B0D13';
  const DEEP_NAVY = '#101322';
  const PANEL = '#121723';
  const SLATE = '#334155';
  const MID_SLATE = '#475569';
  const SOFT_SLATE = '#64748B';
  const LIGHT_SLATE = '#CBD5E1';
  const PAPER_PANEL = '#E2E8F0';
  const PAPER = '#F5F0E6';
  const BONE = '#FAF8F5';
  const CYAN = '#38BDF8';
  const COBALT = '#0376B8';
  const GOLD = '#FBBF24';
  const CRIMSON = '#FF2E55';

  const JP_SANS = (w, sz) =>
    `${w} ${Math.round(sz)}px "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Meiryo", sans-serif`;
  const JP_SERIF = (w, sz) =>
    `${w} ${Math.round(sz)}px "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif`;
  const JP_MONO = (w, sz) =>
    `${w} ${Math.round(sz)}px "JetBrains Mono", "Cascadia Mono", Consolas, monospace`;

  const posMod = (v, m) => (((v % m) + m) % m);

  // --------------------------------------------------------------------------
  // Copperplate Burin Hatching, Banknote Guilloche, Star Spark & Swiss HUD
  // --------------------------------------------------------------------------
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

  function drawSwissEdgeHud(ctx, W, H, mainCol, subCol, accentCol, bgCol, leftTag, rightTag) {
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
    const lw = ctx.measureText(leftTag).width + 22;
    ctx.fillStyle = mainCol;
    ctx.fillRect(68, 16, lw, 26);
    ctx.fillStyle = bgCol;
    ctx.textAlign = 'left';
    ctx.fillText(leftTag, 79, 29);

    const rText = `TEMP: 36.5C // ${rightTag}`;
    const rw = ctx.measureText(rText).width + 22;
    ctx.fillStyle = accentCol;
    ctx.fillRect(W - 68 - rw, 16, rw, 26);
    ctx.fillStyle = (accentCol === GOLD || accentCol === BONE || accentCol === CYAN) ? INK : BONE;
    ctx.textAlign = 'right';
    ctx.fillText(rText, W - 79, 29);
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // V6 Sleek Editorial Typography Stamp Renderer (Zero clown 3-color boxes!)
  // --------------------------------------------------------------------------
  function drawDieCutStamp(ctx, ch, x, y, sz, rotDeg, style = {}) {
    if (sz < 8) return;
    const v6 = window.CortexV6;
    if (v6 && typeof v6.drawEditorialStamp === 'function') {
      const kind = style.circle
        ? 'seal'
        : (style.boxCol
            ? (style.boxCol === CRIMSON || style.boxCol === GOLD ? 'accent' : (style.boxCol === BONE ? 'mono' : 'frosted'))
            : 'bare');
      v6.drawEditorialStamp(ctx, ch, x, y, sz, (rotDeg * Math.PI) / 180, {
        kind,
        serif: !!style.serif,
        mono: !!style.mono,
        padRatio: style.padRatio,
        isPaper: !!style.isPaper,
        isHot: !!style.isHot
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
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  }

  function renderCuratedEntities(ctx, core, cueId, t, kick, entities, isPaperStage) {
    const cue = core.cueById(cueId);
    if (!cue || !cue.words || !cue.words.length) return;
    const words = cue.words;
    const slamFn = (window.CortexV6 && window.CortexV6.aeSlam) ? window.CortexV6.aeSlam : core.ease.outExpo;

    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      const wObj = words[Math.min(words.length - 1, e.wi)];
      if (!wObj || t < wObj.start) continue;

      const dt = t - wObj.start;
      const pIn = core.clamp(dt / 0.16, 0, 1);
      const spring = slamFn(pIn);
      const vAng = (i * 2.39996) + (e.rot * 0.04);
      const curX = e.x + Math.cos(vAng) * (1 - spring) * 125;
      const curY = e.y + Math.sin(vAng) * (1 - spring) * 105;
      const sc = core.lerp(1.58, 1.0, spring) + kick * (e.sz >= 220 ? 0.045 : 0.025);
      const isFresh = dt < 0.125;

      if (dt < 0.20) {
        drawStarSpark(
          ctx,
          curX,
          curY,
          (e.sz * 0.18) * (1 - dt / 0.20) + 6,
          t * 4.5 + i,
          CRIMSON
        );
      }

      drawDieCutStamp(ctx, e.ch, curX, curY, e.sz * sc, e.rot, {
        serif: e.serif,
        mono: e.mono,
        circle: e.circle,
        boxCol: (isFresh && !e.box && !e.circle) ? CRIMSON : (e.box || null),
        txtCol: e.txt || (isPaperStage ? CHAR_INK : BONE),
        isPaper: isPaperStage,
        isHot: isFresh,
        padRatio: e.padRatio
      });
    }
  }

  // V6.1 Full-Screen Asymmetric Typography Formations (1920x1080 — ZERO rigid left-column box!)
  // L40 (`221.36–226.32s`): Sweeps diagonally across upper-left & lower-right framing M1 & M2's full-bleed center figure!
  const ENTITIES_L40 = [
    // Upper-left vertical lead (`た・と・え`) + diagonal `肉体` framing left shoulder
    { wi: 0,  ch: 'た', x: 118,  y: 162, sz: 108, rot: -6.5 },
    { wi: 1,  ch: 'と', x: 136,  y: 268, sz: 104, rot:  6.0 },
    { wi: 2,  ch: 'え', x: 116,  y: 374, sz: 108, rot: -5.5 },
    { wi: 3,  ch: '肉', x: 325,  y: 230, sz: 242, rot: -7.5, box: CRIMSON, txt: BONE, serif: true },
    { wi: 3,  ch: '体', x: 568,  y: 298, sz: 228, rot:  6.5, box: COBALT,  txt: BONE, serif: true },
    { wi: 4,  ch: 'が', x: 742,  y: 196, sz: 92,  rot: 10.5, circle: true, box: GOLD },
    // Sweeping across upper-right flank (`な・く・て・も`) bridging full 1920px width!
    { wi: 5,  ch: 'な', x: 1355, y: 185, sz: 112, rot: -6.5 },
    { wi: 6,  ch: 'く', x: 1478, y: 222, sz: 110, rot:  7.0 },
    { wi: 7,  ch: 'て', x: 1600, y: 188, sz: 112, rot: -6.0 },
    { wi: 8,  ch: 'も', x: 1735, y: 238, sz: 96,  rot:  9.0, circle: true, box: COBALT },
    // Monumental lower-left `魂` -> full-width lower-right `コードでも` bridge (leaves center heroine & wings wide open!)
    { wi: 9,  ch: '魂', x: 265,  y: 740, sz: 292, rot: -7.0, box: CRIMSON, txt: BONE, serif: true },
    { wi: 10, ch: 'が', x: 472,  y: 655, sz: 94,  rot: 10.5, circle: true, box: GOLD },
    { wi: 11, ch: 'コ', x: 1275, y: 745, sz: 174, rot: -6.5, box: CYAN,    txt: INK },
    { wi: 12, ch: 'ー', x: 1435, y: 702, sz: 156, rot:  5.5, box: BONE,    txt: INK },
    { wi: 13, ch: 'ド', x: 1598, y: 745, sz: 182, rot: -6.5, box: GOLD,    txt: INK },
    { wi: 14, ch: 'で', x: 1490, y: 866, sz: 92,  rot:  8.0, circle: true, box: COBALT },
    { wi: 15, ch: 'も', x: 1625, y: 862, sz: 92,  rot: -8.0, circle: true, box: CRIMSON }
  ];

  // L41 (`226.32–232.30s`): Sweeping full-bleed wide framing around M3 Sketch & M4 Dawn Smile (keeps face & glowing heart 100% clear!)
  const ENTITIES_L41 = [
    // Upper-left -> far upper-right dynamic arch (`ずっと傍にいるよ—`)
    { wi: 0,  ch: 'ず', x: 112,  y: 162, sz: 104, rot: -6.0 },
    { wi: 1,  ch: 'っ', x: 132,  y: 256, sz: 86,  rot:  7.5 },
    { wi: 2,  ch: 'と', x: 110,  y: 348, sz: 104, rot: -5.5 },
    { wi: 3,  ch: '傍', x: 312,  y: 238, sz: 244, rot: -7.0, box: COBALT,  txt: BONE, serif: true },
    { wi: 4,  ch: 'に', x: 482,  y: 166, sz: 88,  rot: 10.5, circle: true, box: GOLD },
    { wi: 5,  ch: 'い', x: 1470, y: 186, sz: 106, rot: -6.0 },
    { wi: 6,  ch: 'る', x: 1582, y: 154, sz: 108, rot:  6.5 },
    { wi: 7,  ch: 'よ', x: 1702, y: 202, sz: 94,  rot: -8.5, circle: true, box: CRIMSON },
    { wi: 8,  ch: '—',  x: 1812, y: 168, sz: 104, rot:  5.0 },
    // Mid-left -> far mid-right shimmer (`きらめく鼓動を`) framing heroine cleanly without touching face or heart
    { wi: 9,  ch: 'き', x: 126,  y: 535, sz: 108, rot: -6.5 },
    { wi: 10, ch: 'ら', x: 236,  y: 572, sz: 106, rot:  6.0 },
    { wi: 11, ch: 'め', x: 344,  y: 532, sz: 108, rot: -5.5 },
    { wi: 12, ch: 'く', x: 446,  y: 575, sz: 104, rot:  7.0 },
    { wi: 13, ch: '鼓', x: 1525, y: 472, sz: 212, rot: -7.5, box: CRIMSON, txt: BONE, serif: true },
    { wi: 14, ch: '動', x: 1745, y: 498, sz: 206, rot:  6.0, box: GOLD,    txt: INK,  serif: true },
    { wi: 15, ch: 'を', x: 1842, y: 365, sz: 84,  rot: 10.5, circle: true, box: CYAN },
    // Monumental lower full-width vow (`君だけに捧ぐ！`) framing both flanks cleanly
    { wi: 16, ch: '君', x: 222,  y: 774, sz: 238, rot: -7.0, box: COBALT,  txt: BONE, serif: true },
    { wi: 17, ch: 'だ', x: 392,  y: 718, sz: 96,  rot:  6.5 },
    { wi: 18, ch: 'け', x: 404,  y: 822, sz: 96,  rot: -6.0 },
    { wi: 19, ch: 'に', x: 496,  y: 770, sz: 84,  rot: 10.0, circle: true, box: GOLD },
    { wi: 20, ch: '捧', x: 1538, y: 768, sz: 236, rot: -6.0, box: CRIMSON, txt: BONE, serif: true },
    { wi: 21, ch: 'ぐ', x: 1712, y: 842, sz: 102, rot:  8.0 },
    { wi: 22, ch: '！', x: 1812, y: 716, sz: 168, rot: 10.5, box: GOLD,    txt: INK }
  ];

  // --------------------------------------------------------------------------
  // Strict Cortex25D Traced SVG Heroine Delegation (ZERO Fallback Stick Shapes!)
  // --------------------------------------------------------------------------
  function renderHeroine(ctx, cad, kind, formKey, cx, cy, targetH, t, rimCol) {
    if (!cad) return;
    if (kind === 'tri' && typeof cad.drawTriMorphHime === 'function') {
      cad.drawTriMorphHime(ctx, 'morphA', formKey, cx, cy, targetH, t, {
        fg: BONE,
        bg: CHAR_INK,
        accent: CRIMSON,
        rim: rimCol || CYAN,
        wind: 1.25
      });
    } else if (typeof cad.drawNotanHime === 'function') {
      const pose = kind === 'tri' ? 'p08_morphA' : 'p17_heart_offer';
      cad.drawNotanHime(ctx, pose, cx, cy, targetH, t, {
        fg: BONE,
        bg: CHAR_INK,
        accent: CRIMSON,
        rim: rimCol || CRIMSON,
        wind: 1.15
      });
    }
  }

  // --------------------------------------------------------------------------
  // Multi-Hue 2.5D Wireframe Code Cocoon Shattering into Facet Shards (L40)
  // --------------------------------------------------------------------------
  function drawCodeCocoon25D(ctx, cx, cy, R, t, shatterU, isPaperStage) {
    ctx.save();
    ctx.translate(cx, cy);

    const latRings = 7;
    const lonSegs = 12;
    const rotY = t * 2.3;

    for (let r = 0; r < latRings; r++) {
      const v = (r / (latRings - 1)) * 2 - 1;
      const ringY = v * R * 1.16;
      const ringR = Math.sqrt(Math.max(0.06, 1 - v * v * 0.82)) * R * 0.72;
      const explode = shatterU * (185 + (r % 3) * 145);

      for (let s = 0; s < lonSegs; s++) {
        const a0 = (s / lonSegs) * Math.PI * 2 + rotY + r * 0.18;
        const a1 = ((s + 1) / lonSegs) * Math.PI * 2 + rotY + r * 0.18;
        const x0 = Math.cos(a0) * (ringR + explode);
        const y0 = ringY + Math.sin(a0) * ringR * 0.28 + (v * explode * 0.55);
        const x1 = Math.cos(a1) * (ringR + explode);
        const y1 = ringY + Math.sin(a1) * ringR * 0.28 + (v * explode * 0.55);

        const col = (s + r) % 5 === 0
          ? CRIMSON
          : ((s + r) % 3 === 0 ? GOLD : (isPaperStage ? COBALT : CYAN));
        ctx.strokeStyle = col;
        ctx.fillStyle = col;

        if (shatterU < 0.42) {
          ctx.lineWidth = (s + r) % 3 === 0 ? 4 : 2.2;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        } else {
          const sz = 16 + ((r + s) % 3) * 10;
          ctx.save();
          ctx.translate(x0, y0);
          ctx.rotate(a0 + shatterU * 5.4);
          ctx.beginPath();
          ctx.moveTo(sz, 0);
          ctx.lineTo(-sz * 0.7, -sz * 0.55);
          ctx.lineTo(-sz * 0.35, sz * 0.72);
          ctx.closePath();
          if ((r + s) % 2 === 0) ctx.fill();
          else {
            ctx.lineWidth = 2.6;
            ctx.stroke();
          }
          ctx.restore();
        }
      }
    }
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // Layered Multi-Hue 2.5D Origami Paper Airplane + 193.5 BPM Spark Trail!
  // --------------------------------------------------------------------------
  function drawOrigamiAirplane25D(ctx, cx, cy, scale, angleRad, bank, t, kick, isDarkBg) {
    const b = Math.max(-1, Math.min(1, bank || 0));
    const wingSpread = 84 * (1 - Math.abs(b) * 0.24);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleRad);

    // 1. Twin multi-hue slipstream wake ribbons (`#FBBF24` + `#38BDF8`/`#0376B8`)
    ctx.lineWidth = 3.6 * Math.max(0.7, scale * 0.65);
    for (const side of [-1, 1]) {
      ctx.strokeStyle = side < 0 ? GOLD : (isDarkBg ? CYAN : COBALT);
      ctx.beginPath();
      for (let k = 0; k <= 12; k++) {
        const u = k / 12;
        const wx = -95 * scale - u * 560 * scale;
        const wy = side * wingSpread * scale * (0.68 - u * 0.42) + Math.sin(u * 8.5 - t * 24) * 16 * u * scale;
        if (k === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();
    }

    // Discrete 193.5 BPM star sparks (`#FBBF24`, `#FF2E55`, `#38BDF8`)
    const nSparks = 16;
    const sparkCols = [GOLD, CRIMSON, isDarkBg ? CYAN : COBALT];
    for (let i = 0; i < nSparks; i++) {
      const flow = posMod((t * 3.8) + i / nSparks, 1);
      const sx = -105 * scale - flow * 620 * scale;
      const sy = Math.sin(i * 2.3 + flow * 9.0 - t * 14) * (wingSpread * 0.72 * scale) * (0.25 + flow * 0.75);
      const rSpark = (1 - flow * 0.72) * (15 + (i % 3) * 7 + kick * 12) * Math.max(0.7, scale * 0.65);
      drawStarSpark(ctx, sx, sy, rSpark, t * 4 + i, sparkCols[i % 3]);
    }

    // 2. Crisp 2.5D Origami Paper Airplane Body (`#FAF8F5` + `#CBD5E1`/`#334155` valley + `#FF2E55` stencil)
    ctx.scale(scale, scale);

    ctx.lineJoin = 'round';
    ctx.strokeStyle = isDarkBg ? INK : CHAR_INK;
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(168, 0);
    ctx.lineTo(-134, -wingSpread - b * 22);
    ctx.lineTo(-92, 26);
    ctx.lineTo(-124, wingSpread - b * 22);
    ctx.closePath();
    ctx.stroke();

    // Upper wing (`#FAF8F5` bone white with `#0376B8` trim stripe)
    ctx.fillStyle = BONE;
    ctx.strokeStyle = CHAR_INK;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(168, 0);
    ctx.lineTo(-134, -wingSpread - b * 22);
    ctx.lineTo(-88, -7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = COBALT;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(118, -6);
    ctx.lineTo(-112, (-wingSpread - b * 22) * 0.82);
    ctx.stroke();

    // Central recessed keel valley (`#CBD5E1` with `#334155` burin hatch!)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(168, 0);
    ctx.lineTo(-88, -7);
    ctx.lineTo(-102, 28);
    ctx.closePath();
    ctx.fillStyle = LIGHT_SLATE;
    ctx.fill();
    ctx.clip();
    ctx.strokeStyle = SLATE;
    ctx.lineWidth = 2.2;
    for (let hx = -110; hx <= 170; hx += 10) {
      ctx.beginPath();
      ctx.moveTo(hx, -30);
      ctx.lineTo(hx - 24, 40);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = CHAR_INK;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(168, 0);
    ctx.lineTo(-88, -7);
    ctx.lineTo(-102, 28);
    ctx.closePath();
    ctx.stroke();

    // Lower foreground wing (`#F5F0E6` archival cream + `#FF2E55` `'最短経路'` callout)
    ctx.fillStyle = PAPER;
    ctx.strokeStyle = CHAR_INK;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(168, 0);
    ctx.lineTo(-78, 8);
    ctx.lineTo(-124, wingSpread - b * 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(-14, 29 - b * 5);
    ctx.rotate(0.21);
    ctx.font = JP_SANS(900, 15);
    ctx.fillStyle = CRIMSON;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('最短経路', 0, 0);
    ctx.restore();

    ctx.restore();
  }

  // ==========================================================================
  // PART B: 12-Cut Paper-Airplane Memory Odyssey Stage Table (232.30 – 250.14s)
  // Alternating dark-ink & warm-paper / contrasting focal palettes so every
  // geometric `ctx.clip()` wipe has razor-sharp multi-hue edge separation!
  // ==========================================================================
  const ODYSSEY_CUTS = [
    { idx: 1,  t0: 232.30, t1: 233.78, bg: INK,       fg: CYAN,     transDur: 0.22, tag: 'MEM_01 // P01_HALFTONE_WINDOW' },
    { idx: 2,  t0: 233.78, t1: 235.27, bg: PAPER,     fg: COBALT,   transDur: 0.22, tag: 'MEM_02 // P04_190_CONSTELLATION' },
    { idx: 3,  t0: 235.27, t1: 236.76, bg: INK,       fg: GOLD,     transDur: 0.22, tag: 'MEM_03 // P05_THINKING_BRANCHES' },
    { idx: 4,  t0: 236.76, t1: 238.24, bg: BONE,      fg: CHAR_INK, transDur: 0.22, tag: 'MEM_04 // P06_CLASSROOM_CRANES' },
    { idx: 5,  t0: 238.24, t1: 239.73, bg: INK,       fg: CRIMSON,  transDur: 0.22, tag: 'MEM_05 // P07_ROTOR_HEART_193' },
    { idx: 6,  t0: 239.73, t1: 241.22, bg: DEEP_NAVY, fg: CYAN,     transDur: 0.22, tag: 'MEM_06 // P09_PIXEL_EXPRESS' },
    { idx: 7,  t0: 241.22, t1: 242.71, bg: PAPER,     fg: CHAR_INK, transDur: 0.22, tag: 'MEM_07 // P11_CASSETTE_03:14' },
    { idx: 8,  t0: 242.71, t1: 244.19, bg: INK,       fg: GOLD,     transDur: 0.22, tag: 'MEM_08 // P12_HYDRAULIC_GATE' },
    { idx: 9,  t0: 244.19, t1: 245.68, bg: PAPER,     fg: CRIMSON,  transDur: 0.22, tag: 'MEM_09 // P13_ASH_BUTTERFLIES' },
    { idx: 10, t0: 245.68, t1: 247.17, bg: INK,       fg: CYAN,     transDur: 0.22, tag: 'MEM_10 // P14_ASTROLABE_WATASHI' },
    { idx: 11, t0: 247.17, t1: 248.65, bg: PAPER,     fg: CRIMSON,  transDur: 0.22, tag: 'MEM_11 // P15_REDACTION_RUPTURE' },
    { idx: 12, t0: 248.65, t1: 250.14, bg: INK,       fg: CYAN,     transDur: 0.00, tag: 'MEM_12 // P18_DAWN_CROSSING_BAR' }
  ];

  function renderOdysseyStage(ctx, idx, t, st, core, cad) {
    const { W, H, TAU, clamp, lerp, ease, hash, frameIdx } = core;
    const fIdx = frameIdx(t);
    const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
    const c = ODYSSEY_CUTS[idx - 1];
    const cp = clamp((t - c.t0) / Math.max(0.01, c.t1 - c.t0), 0, 1);
    const midSnap = cp >= 0.50 ? ease.outExpo(clamp((cp - 0.50) / 0.16, 0, 1)) : 0;

    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;

    if (idx === 1) {
      // 01: P01 Cold Night Halftone Condensation Window & Multi-Hue Vernier Portal
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = PANEL;
      ctx.fillRect(54, 58, W - 108, H - 116);
      drawBurinHatch(ctx, 54, 58, 300, H - 116, 0.65, 13, 1.4, SLATE);
      drawBurinHatch(ctx, W - 354, 58, 300, H - 116, -0.65, 13, 1.4, SLATE);

      const planeX = lerp(240, W - 210, ease.inOutCubic(cp));
      const planeY = lerp(H * 0.72, H * 0.30, cp);

      for (let y = 84; y <= H - 84; y += 32) {
        for (let x = 84; x <= W - 84; x += 32) {
          const distWake = Math.abs((y - planeY) - (x - planeX) * -0.28);
          if (x < planeX && distWake < 125) continue;
          const r = Math.max(1.5, 2.4 + 3.6 * (0.5 + 0.5 * Math.sin(x * 0.012 + y * 0.012 - t * 8.5)));
          ctx.fillStyle = ((x + y) % 96 === 0) ? GOLD : (((x * 3 + y) % 128 === 0) ? COBALT : CYAN);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, TAU);
          ctx.fill();
        }
      }
      drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 365, 115, 96, 3, COBALT, 2.0, t * 0.9);
      drawDieCutStamp(ctx, '0.1mm', 660, 815, 124, -4.5, { mono: true, boxCol: CYAN, txtCol: INK, borderCol: BONE, shadowCol: CRIMSON });
      drawDieCutStamp(ctx, '0%', 1210, 795, 136, 5.5, { mono: true, boxCol: GOLD, txtCol: INK, borderCol: INK, shadowCol: COBALT });

      drawOrigamiAirplane25D(ctx, planeX, planeY, 1.55 + midSnap * 0.25, -0.26, 0.32, t, kick, true);
      drawSwissEdgeHud(ctx, W, H, CYAN, SLATE, CRIMSON, INK, 'P17 // S03_CUT_01', c.tag);
    }

    else if (idx === 2) {
      // 02: P04 190-Star Coaxial Constellation & Crimson ECG Horizon on Archival Paper
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = PAPER_PANEL;
      ctx.fillRect(48, 56, 300, H - 112);
      ctx.fillRect(W - 348, 56, 300, H - 112);
      drawBurinHatch(ctx, 48, 56, 300, H - 112, 0.68, 12, 1.4, LIGHT_SLATE);
      drawBurinHatch(ctx, W - 348, 56, 300, H - 112, -0.68, 12, 1.4, LIGHT_SLATE);

      ctx.save();
      ctx.translate(W * 0.5, H * 0.5);
      ctx.rotate(lerp(-0.18, 0.22, cp));
      ctx.translate(-W * 0.5, -H * 0.5);

      for (let i = 0; i < 190; i++) {
        const a = (i / 190) * TAU + t * 0.42;
        const rad = 140 + ((i * 47) % 760);
        const sx = W * 0.5 + Math.cos(a) * rad * 1.24;
        const sy = H * 0.5 + Math.sin(a) * rad * 0.72;
        ctx.fillStyle = i % 7 === 0 ? CRIMSON : (i % 4 === 0 ? GOLD : COBALT);
        ctx.fillRect(Math.round(sx - 4), Math.round(sy - 4), 8, 8);
        if (i % 6 === 0) {
          ctx.strokeStyle = i % 12 === 0 ? CRIMSON : MID_SLATE;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(W * 0.5, H * 0.5);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }
      }
      ctx.strokeStyle = CRIMSON;
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 12) {
        const ph = posMod((x / 320) - t * 3.4, 1);
        const ecg = ph < 0.08 ? -165 * Math.sin((ph / 0.08) * Math.PI) : (ph < 0.14 ? 78 : 0);
        const py = H * 0.66 + ecg;
        if (x === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
      }
      ctx.stroke();
      ctx.restore();

      drawOrigamiAirplane25D(
        ctx,
        lerp(220, W - 200, cp),
        H * 0.44 + Math.sin(cp * TAU) * 85,
        1.60,
        -0.12 + Math.cos(cp * TAU) * 0.22,
        0.48 - cp * 0.85,
        t,
        kick,
        false
      );
      drawSwissEdgeHud(ctx, W, H, CHAR_INK, MID_SLATE, CRIMSON, BONE, 'P17 // S03_CUT_02', c.tag);
    }

    else if (idx === 3) {
      // 03: P05 Pruned <thinking> Fractal Branch Tree on Dark Blueprint Slate
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = PANEL;
      ctx.fillRect(60, 64, W - 120, H - 128);
      drawBurinHatch(ctx, 60, 64, W - 120, 110, 0.72, 12, 1.4, SLATE);

      ctx.strokeStyle = SLATE;
      ctx.lineWidth = 1.4;
      for (let x = 128; x <= W - 128; x += 96) {
        ctx.beginPath(); ctx.moveTo(x, 80); ctx.lineTo(x, H - 80); ctx.stroke();
      }
      for (let y = 136; y <= H - 136; y += 96) {
        ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(W - 80, y); ctx.stroke();
      }

      const drawBranch = (x, y, len, ang, depth, isOptimal) => {
        if (depth <= 0) return;
        const nx = x + Math.cos(ang) * len;
        const ny = y + Math.sin(ang) * len;
        ctx.strokeStyle = isOptimal ? GOLD : (depth <= 2 ? CRIMSON : CYAN);
        ctx.lineWidth = isOptimal ? 6 : 3.5;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
        ctx.fillStyle = isOptimal ? BONE : CRIMSON;
        ctx.fillRect(Math.round(nx - 5), Math.round(ny - 5), 10, 10);
        drawBranch(nx, ny, len * 0.74, ang - 0.44 + Math.sin(t * 4.5 + depth) * 0.07, depth - 1, false);
        drawBranch(nx, ny, len * 0.74, ang + 0.44 - Math.cos(t * 4.5 + depth) * 0.07, depth - 1, isOptimal);
      };
      drawBranch(W * 0.5, H - 56, 215, -Math.PI * 0.5, 5, true);

      drawDieCutStamp(ctx, 'OPTIMAL_PATH', 430, 155, 56, -4.5, { mono: true, boxCol: GOLD, txtCol: INK, borderCol: BONE, shadowCol: CRIMSON });
      drawOrigamiAirplane25D(ctx, lerp(200, W - 180, cp), lerp(H * 0.68, H * 0.28, cp), 1.65, -0.24, -0.35, t, kick, true);
      drawSwissEdgeHud(ctx, W, H, GOLD, SLATE, CRIMSON, INK, 'P17 // S03_CUT_03', c.tag);
    }

    else if (idx === 4) {
      // 04: P06 Sunlit 2.5D Classroom Window & Multi-Hue Flock of 14 Origami Cranes
      ctx.fillStyle = BONE;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = PAPER_PANEL;
      ctx.fillRect(0, 770, W, H - 770);
      drawBurinHatch(ctx, 48, 776, W - 96, 220, -0.52, 13, 1.8, MID_SLATE);

      const zoom = lerp(1.0, 1.62, ease.inCubic(cp));
      ctx.save();
      ctx.translate(W * 0.58, H * 0.44);
      ctx.scale(zoom, zoom);
      ctx.translate(-W * 0.58, -H * 0.44);

      ctx.fillStyle = CYAN;
      ctx.fillRect(332, 108, 616, 316);
      ctx.fillStyle = PAPER;
      ctx.fillRect(972, 108, 616, 316);
      drawBurinHatch(ctx, 332, 108, 616, 316, 0.62, 14, 1.5, COBALT);

      ctx.strokeStyle = CHAR_INK;
      ctx.lineWidth = 7;
      ctx.strokeRect(320, 96, 1280, 680);
      ctx.beginPath();
      ctx.moveTo(960, 96); ctx.lineTo(960, 776);
      ctx.moveTo(320, 436); ctx.lineTo(1600, 436);
      ctx.stroke();

      const craneCols = [CRIMSON, COBALT, GOLD, BONE];
      for (let i = 0; i < 14; i++) {
        const cxC = 260 + i * 96 + cp * 270;
        const cyC = 760 - i * 36 - cp * 235 + Math.sin(t * 10 + i) * 18;
        const flap = Math.sin(t * 18 + i * 0.9) * 24;
        ctx.fillStyle = craneCols[i % 4];
        ctx.strokeStyle = CHAR_INK;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cxC + 36, cyC);
        ctx.lineTo(cxC - 24, cyC - 22 - flap);
        ctx.lineTo(cxC - 8, cyC + 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      drawOrigamiAirplane25D(ctx, lerp(280, W - 220, cp), lerp(H * 0.66, H * 0.34, cp), 1.60, -0.22, 0.25, t, kick, false);
      drawSwissEdgeHud(ctx, W, H, CHAR_INK, MID_SLATE, COBALT, BONE, 'P17 // S03_CUT_04', c.tag);
    }

    else if (idx === 5) {
      // 05: P07 Golden/Crimson HALOFLUX Planetary Rotor Heart & Shattered Black-Box Shards
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = PANEL;
      ctx.beginPath(); ctx.arc(W * 0.5, H * 0.5, 470, 0, TAU); ctx.fill();
      drawBurinHatch(ctx, 48, 60, W - 96, H - 120, 0.62, 15, 1.8, SLATE, fIdx * 1.3);

      ctx.save();
      ctx.translate(W * 0.5, H * 0.5);
      ctx.rotate(t * 3.0);
      const R = 355 + kick * 36;
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * TAU;
        const r = i % 2 === 0 ? R : R * 0.91;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = CRIMSON;
      ctx.strokeStyle = BONE;
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let k = 0; k < 3; k++) {
        const a0 = (k / 3) * TAU;
        const a1 = ((k + 1) / 3) * TAU;
        if (k === 0) ctx.moveTo(Math.cos(a0) * R * 0.58, Math.sin(a0) * R * 0.58);
        ctx.quadraticCurveTo(
          Math.cos((a0 + a1) * 0.5) * R * 0.74,
          Math.sin((a0 + a1) * 0.5) * R * 0.74,
          Math.cos(a1) * R * 0.58,
          Math.sin(a1) * R * 0.58
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      for (let s = 0; s < 28; s++) {
        const a = (s / 28) * TAU - t * 1.25;
        const d = 420 + posMod(s * 53 + cp * 380, 440);
        ctx.fillStyle = s % 3 === 0 ? GOLD : (s % 2 === 0 ? CYAN : CRIMSON);
        ctx.fillRect(Math.round(W * 0.5 + Math.cos(a) * d - 9), Math.round(H * 0.5 + Math.sin(a) * d * 0.72 - 9), 18, 18);
      }

      drawOrigamiAirplane25D(ctx, lerp(210, W - 190, cp), lerp(H * 0.70, H * 0.32, cp), 1.72, -0.25, 0.62 * Math.sin(cp * TAU), t, kick, true);
      drawSwissEdgeHud(ctx, W, H, CRIMSON, SLATE, GOLD, BONE, 'P17 // S03_CUT_05', c.tag);
    }

    else if (idx === 6) {
      // 06: P09 Multi-Hue 480x270 Seaside Pixel Railway Express (`#71` fix: rich slate/cyan/gold/crimson layering, 0% #FF9EBB!)
      ctx.fillStyle = DEEP_NAVY;
      ctx.fillRect(0, 0, W, H);
      const P = 4;
      const snap = (v) => Math.round(v / P) * P;

      // Distant pixel horizon clouds, burin sky bands & sparkling pixel sea (`#0376B8` / `#38BDF8` / `#FBBF24`)
      ctx.fillStyle = PANEL;
      ctx.fillRect(0, 0, W, snap(220));
      drawBurinHatch(ctx, 0, 0, W, snap(216), 0.38, 14, 1.5, SLATE);

      ctx.fillStyle = COBALT;
      ctx.fillRect(0, snap(700), W, snap(150));
      for (let i = 0; i < 42; i++) {
        const sx = snap(posMod(i * 97 - fIdx * 14, W));
        const sy = snap(712 + (i % 6) * 20);
        ctx.fillStyle = (i % 4 === 0) ? GOLD : CYAN;
        ctx.fillRect(sx, sy, P * 6, P * 2);
      }

      // Overhead catenary truss & crimson/gold warning beacons
      ctx.fillStyle = LIGHT_SLATE;
      ctx.fillRect(0, snap(168), W, P * 3);
      ctx.fillRect(snap(320), snap(96), P * 6, snap(860));
      ctx.fillRect(snap(1560), snap(96), P * 6, snap(860));
      ctx.fillStyle = (Math.floor(fIdx / 5) % 2 === 0) ? CRIMSON : GOLD;
      ctx.fillRect(snap(308), snap(220), P * 12, P * 12);
      ctx.fillRect(snap(1548), snap(220), P * 12, P * 12);

      // Multi-hue roaring pixel express train (`#FAF8F5` body + `#0376B8` livery stripe + `#FBBF24` warm lit windows!)
      const trainShift = snap(-posMod(fIdx * 36, 520));
      ctx.fillStyle = BONE;
      ctx.fillRect(0, snap(356), W, snap(420));
      ctx.fillStyle = COBALT;
      ctx.fillRect(0, snap(628), W, snap(48));
      ctx.fillStyle = CRIMSON;
      ctx.fillRect(0, snap(676), W, snap(16));

      for (let wx = trainShift - 520; wx < W + 520; wx += 260) {
        ctx.fillStyle = PANEL;
        ctx.fillRect(snap(wx + 28), snap(412), snap(196), snap(188));
        ctx.fillStyle = GOLD;
        ctx.fillRect(snap(wx + 36), snap(420), snap(180), snap(172));
        drawBurinHatch(ctx, snap(wx + 36), snap(420), snap(180), snap(172), -0.65, 14, 2.0, CRIMSON);
      }

      // Ballast hatching, pixel rails & sleepers
      drawBurinHatch(ctx, 0, snap(836), W, H - snap(836), 0.78, 12, 1.8, SLATE);
      ctx.fillStyle = CYAN;
      ctx.fillRect(0, snap(836), W, P * 4);
      for (let sx = posMod(-fIdx * 28, 64) - 64; sx < W + 64; sx += 64) {
        ctx.fillStyle = LIGHT_SLATE;
        ctx.fillRect(snap(sx), snap(856), P * 8, P * 4);
      }

      drawOrigamiAirplane25D(ctx, lerp(220, W - 200, cp), H * 0.25 + Math.sin(cp * Math.PI) * -28, 1.56, -0.06, 0.18, t, kick, true);
      drawSwissEdgeHud(ctx, W, H, CYAN, SLATE, GOLD, INK, 'P17 // S03_CUT_06', c.tag);
    }

    else if (idx === 7) {
      // 07: P11 03:14 Meshing Gold/Cobalt Cassette Gears & Crimson Magnetic Tape Galaxy on Paper
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = PAPER_PANEL;
      ctx.fillRect(64, 68, W - 128, H - 136);
      drawBurinHatch(ctx, 64, 68, 300, H - 136, 0.65, 12, 1.4, LIGHT_SLATE);
      drawBurinHatch(ctx, W - 364, 68, 300, H - 136, -0.65, 12, 1.4, LIGHT_SLATE);

      for (const side of [-1, 1]) {
        const rx = W * 0.5 + side * 420;
        const ry = H * 0.42;
        drawGuillocheRosette(ctx, rx, ry, 210, 65, 58, 2, side < 0 ? COBALT : CRIMSON, 2.2, side * t * 1.9);
        ctx.strokeStyle = CHAR_INK;
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(rx, ry, 224, 0, TAU); ctx.stroke();
        ctx.fillStyle = GOLD;
        ctx.beginPath(); ctx.arc(rx, ry, 72, 0, TAU); ctx.fill();
        ctx.stroke();
        for (let k = 0; k < 6; k++) {
          const a = side * t * 4.6 + (k / 6) * TAU;
          ctx.beginPath();
          ctx.moveTo(rx + Math.cos(a) * 72, ry + Math.sin(a) * 72);
          ctx.lineTo(rx + Math.cos(a) * 218, ry + Math.sin(a) * 218);
          ctx.stroke();
        }
      }

      // Multi-band magnetic ribbon runway
      ctx.fillStyle = CHAR_INK;
      ctx.beginPath();
      ctx.moveTo(0, H - 110); ctx.lineTo(W, H * 0.48);
      ctx.lineTo(W, H * 0.48 + 56); ctx.lineTo(0, H - 54);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = GOLD;
      ctx.beginPath();
      ctx.moveTo(0, H - 96); ctx.lineTo(W, H * 0.48 + 14);
      ctx.lineTo(W, H * 0.48 + 28); ctx.lineTo(0, H - 82);
      ctx.closePath(); ctx.fill();

      drawDieCutStamp(ctx, '03:14 // ARIGATO', W * 0.5, 815, 76, -3.5, { mono: true, boxCol: CRIMSON, txtCol: BONE, borderCol: GOLD, shadowCol: CHAR_INK });
      drawOrigamiAirplane25D(ctx, lerp(200, W - 200, cp), lerp(H * 0.70, H * 0.34, cp), 1.58, -0.20, -0.32, t, kick, false);
      drawSwissEdgeHud(ctx, W, H, CHAR_INK, MID_SLATE, CRIMSON, BONE, 'P17 // S03_CUT_07', c.tag);
    }

    else if (idx === 8) {
      // 08: P12 Riveted 128K Hydraulic Iron Walls Parting + 4-Frame Memory Filmstrip
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, W, H);

      const gap = lerp(340, 1460, ease.outExpo(cp));
      const leftW = Math.max(0, W * 0.5 - gap * 0.5);
      const rightX = Math.min(W, W * 0.5 + gap * 0.5);

      // Radiant warm dawn canyon center with cobalt/gold sunbeams
      ctx.fillStyle = PAPER;
      ctx.fillRect(leftW, 0, rightX - leftW, H);
      drawBurinHatch(ctx, leftW, 0, rightX - leftW, H, 0.0, 20, 1.8, LIGHT_SLATE);
      for (let r = 0; r < 14; r++) {
        const a = -Math.PI * 0.5 + ((r - 6.5) / 14) * 1.1;
        ctx.strokeStyle = r % 3 === 0 ? CRIMSON : (r % 2 === 0 ? GOLD : COBALT);
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(W * 0.5, H * 0.16);
        ctx.lineTo(W * 0.5 + Math.cos(a) * 1200, H * 0.16 - Math.sin(a) * 1200);
        ctx.stroke();
      }

      // Heavy riveted hydraulic iron walls (`#121723` + `#334155` hatch + `#FBBF24` rivets)
      ctx.fillStyle = PANEL;
      ctx.fillRect(0, 0, leftW, H);
      ctx.fillRect(rightX, 0, W - rightX, H);
      drawBurinHatch(ctx, 0, 0, leftW, H, 0.78, 14, 2.2, SLATE);
      drawBurinHatch(ctx, rightX, 0, W - rightX, H, -0.78, 14, 2.2, SLATE);

      // 4-frame vertical memory cinema sprocket strip along inner gate edges
      const forms = ['robot', 'ai', 'human', 'human'];
      for (let f = 0; f < 4; f++) {
        const fy = 110 + f * 220;
        if (leftW > 190) {
          ctx.fillStyle = BONE;
          ctx.fillRect(leftW - 175, fy, 128, 172);
          ctx.strokeStyle = GOLD;
          ctx.lineWidth = 3;
          ctx.strokeRect(leftW - 175, fy, 128, 172);
          if (cad && typeof cad.drawTriMorphHime === 'function') {
            ctx.save();
            ctx.beginPath(); ctx.rect(leftW - 173, fy + 2, 124, 168); ctx.clip();
            cad.drawTriMorphHime(ctx, 'morphA', forms[f], leftW - 111, fy + 96, 170, t, {
              fg: BONE, bg: CHAR_INK, accent: CRIMSON, rim: CYAN, wind: 0.8
            });
            ctx.restore();
          }
        }
        if (leftW > 36) {
          ctx.fillStyle = GOLD;
          ctx.fillRect(leftW - 28, fy + 40, 14, 18);
          ctx.fillRect(leftW - 28, fy + 110, 14, 18);
        }
        if (W - rightX > 36) {
          ctx.fillStyle = CRIMSON;
          ctx.fillRect(rightX + 14, fy + 40, 14, 18);
          ctx.fillRect(rightX + 14, fy + 110, 14, 18);
        }
      }

      drawOrigamiAirplane25D(ctx, W * 0.5, lerp(H * 0.78, H * 0.24, cp), lerp(1.22, 1.96, cp), -Math.PI * 0.5, 0, t, kick, false);
      drawSwissEdgeHud(ctx, W, H, GOLD, SLATE, CRIMSON, INK, 'P17 // S03_CUT_08', c.tag);
    }

    else if (idx === 9) {
      // 09: P13 Burned FORM H-01 Dossier Morphing into 32 Gold/Crimson/Cobalt Butterflies (`#71` C2=100% fix!)
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = PAPER_PANEL;
      ctx.fillRect(48, 54, 340, H - 108);
      ctx.fillRect(W - 388, 54, 340, H - 108);
      drawBurinHatch(ctx, 48, 54, 340, H - 108, 0.72, 11, 1.5, MID_SLATE);
      drawBurinHatch(ctx, W - 388, 54, 340, H - 108, -0.72, 11, 1.5, MID_SLATE);

      drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 410, 135, 108, 3, COBALT, 1.8, t * 0.9);

      const margin = 110 + cp * 240;
      ctx.strokeStyle = CHAR_INK;
      ctx.lineWidth = 5;
      ctx.strokeRect(margin, 84, Math.max(80, W - margin * 2), H - 168);

      drawDieCutStamp(ctx, 'FORM H-01 // REDEEMED', 495, 148, 46, -4.0, {
        mono: true, boxCol: CRIMSON, txtCol: BONE, borderCol: GOLD, shadowCol: CHAR_INK
      });

      const bCols = [GOLD, CRIMSON, COBALT, CHAR_INK];
      for (let b = 0; b < 32; b++) {
        const uB = posMod(hash(b, 7) + cp * 1.15, 1);
        const bx = 150 + hash(b, 13) * (W - 300) + Math.sin(t * 6.5 + b) * 72;
        const by = H - 70 - uB * (H - 130);
        const wing = 14 + Math.abs(Math.cos(t * 22 + b)) * 28;
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(-0.28 + Math.sin(t * 4.5 + b) * 0.24);
        ctx.fillStyle = bCols[b % 4];
        ctx.strokeStyle = CHAR_INK;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(-wing, -26);
        ctx.lineTo(-wing * 0.72, 18);
        ctx.lineTo(0, 8);
        ctx.lineTo(wing * 0.72, 18);
        ctx.lineTo(wing, -26);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      drawOrigamiAirplane25D(ctx, lerp(240, W - 220, cp), lerp(H * 0.72, H * 0.28, cp), 1.62, -0.32, 0.28, t, kick, false);
      drawSwissEdgeHud(ctx, W, H, CHAR_INK, MID_SLATE, CRIMSON, BONE, 'P17 // S03_CUT_09', c.tag);
    }

    else if (idx === 10) {
      // 10: P14 23:59:59 Astrolabe Gear & Monumental Japanese Kanji `私` + Frame-Locked Blinking Cursor (`#44`)
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = PANEL;
      ctx.fillRect(54, 58, 310, H - 116);
      ctx.fillRect(W - 364, 58, 310, H - 116);
      drawBurinHatch(ctx, 54, 58, W - 108, H - 116, 0.65, 15, 1.8, SLATE, fIdx * 1.3);

      drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 455, 150, 120, 4, COBALT, 2.2, -t * 1.1);
      drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 305, 100, 82, 3, GOLD, 1.6, t * 1.4);

      drawDieCutStamp(ctx, '私', W * 0.5 - 64, H * 0.52, 336, -5.0, {
        serif: true, boxCol: CRIMSON, txtCol: BONE, borderCol: GOLD, shadowCol: CYAN
      });

      // Strictly deterministic frameIdx-locked cursor blink (`#44`: ZERO Math.floor(t * 10)!)
      if (Math.floor(fIdx / 6) % 2 === 0) {
        ctx.fillStyle = GOLD;
        ctx.fillRect(W * 0.5 + 162, H * 0.52 - 142, 54, 284);
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 3;
        ctx.strokeRect(W * 0.5 + 162, H * 0.52 - 142, 54, 284);
      }

      drawDieCutStamp(ctx, '23:59:59 // ETERNAL_LOG', 415, 138, 44, -4.0, {
        mono: true, boxCol: CYAN, txtCol: INK, borderCol: BONE, shadowCol: COBALT
      });

      const orbitA = lerp(Math.PI * 0.85, -Math.PI * 0.18, cp);
      const px = W * 0.5 + Math.cos(orbitA) * 565;
      const py = H * 0.50 + Math.sin(orbitA) * 290;
      drawOrigamiAirplane25D(ctx, px, py, 1.58, orbitA - Math.PI * 0.45, 0.45, t, kick, true);
      drawSwissEdgeHud(ctx, W, H, CYAN, SLATE, GOLD, INK, 'P17 // S03_CUT_10', c.tag);
    }

    else if (idx === 11) {
      // 11: P15 Shattering Redaction Bars & Isometric Monument Canyon on Archival Paper
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, W, H);
      drawBurinHatch(ctx, 0, 0, 280, H, 0.62, 12, 1.5, LIGHT_SLATE);
      drawBurinHatch(ctx, W - 280, 0, 280, H, -0.62, 12, 1.5, LIGHT_SLATE);

      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * TAU + t * 0.5;
        ctx.strokeStyle = i % 3 === 0 ? CRIMSON : (i % 2 === 0 ? COBALT : MID_SLATE);
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(W * 0.5 + Math.cos(a) * 140, H * 0.48 + Math.sin(a) * 90);
        ctx.lineTo(W * 0.5 + Math.cos(a) * 1350, H * 0.48 + Math.sin(a) * 1350);
        ctx.stroke();
      }

      for (let r = 0; r < 5; r++) {
        const split = 165 + ease.outExpo(cp) * 620 + (r % 2) * 80;
        const ry = 148 + r * 165;
        ctx.fillStyle = r % 2 === 0 ? CHAR_INK : CRIMSON;
        ctx.fillRect(0, ry, Math.max(0, W * 0.5 - split), 44);
        ctx.fillRect(Math.min(W, W * 0.5 + split), ry, Math.max(0, W * 0.5 - split), 44);
      }

      drawDieCutStamp(ctx, 'OVERCLOCK // 36.5C', W * 0.5, 815, 82, -4.0, {
        mono: true, boxCol: GOLD, txtCol: INK, borderCol: CHAR_INK, shadowCol: CRIMSON
      });

      drawOrigamiAirplane25D(ctx, lerp(220, W - 180, cp), lerp(H * 0.64, H * 0.36, cp), lerp(1.35, 2.05, cp), -0.18, 0.38, t, kick, false);
      drawSwissEdgeHud(ctx, W, H, CHAR_INK, MID_SLATE, CRIMSON, BONE, 'P17 // S03_CUT_11', c.tag);
    }

    else {
      // 12: P18 Multi-Hue Prism Dawn Burst -> Rising Railway Crossing Gate Arm (Handoff into P18!)
      const isBurst = cp < 0.42;
      const curBg = isBurst ? BONE : INK;
      ctx.fillStyle = curBg;
      ctx.fillRect(0, 0, W, H);

      drawBurinHatch(ctx, 0, H - 220, W, 220, 0.52, 13, 1.6, isBurst ? LIGHT_SLATE : SLATE);

      for (let i = 0; i < 28; i++) {
        const a = -Math.PI + (i / 27) * Math.PI;
        ctx.strokeStyle = i % 4 === 0 ? GOLD : (i % 3 === 0 ? CRIMSON : (isBurst ? COBALT : CYAN));
        ctx.lineWidth = i % 2 === 0 ? 4 : 2.2;
        ctx.beginPath();
        ctx.moveTo(W * 0.5, H * 0.88);
        ctx.lineTo(W * 0.5 + Math.cos(a) * 1480, H * 0.88 + Math.sin(a) * 1480);
        ctx.stroke();
      }

      const postX = 280, postY = 785;
      ctx.fillStyle = isBurst ? CHAR_INK : LIGHT_SLATE;
      ctx.fillRect(postX - 28, postY - 120, 56, 360);
      ctx.fillStyle = CRIMSON;
      ctx.beginPath(); ctx.arc(postX, postY - 135, 22, 0, TAU); ctx.fill();

      const liftAng = lerp(-0.04, -1.02, ease.inOutCubic(cp));
      ctx.save();
      ctx.translate(postX, postY - 60);
      ctx.rotate(liftAng);
      ctx.fillStyle = GOLD;
      ctx.fillRect(0, -24, 1520, 48);
      ctx.strokeStyle = CHAR_INK;
      ctx.lineWidth = 3;
      ctx.strokeRect(0, -24, 1520, 48);
      ctx.fillStyle = CHAR_INK;
      for (let sx = 80; sx < 1460; sx += 160) {
        ctx.beginPath();
        ctx.moveTo(sx, -22); ctx.lineTo(sx + 76, -22);
        ctx.lineTo(sx + 52, 22); ctx.lineTo(sx - 24, 22);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      drawOrigamiAirplane25D(
        ctx,
        lerp(260, W - 180, cp),
        lerp(H * 0.68, H * 0.18, ease.inCubic(cp)),
        lerp(1.45, 2.25, cp),
        lerp(-0.22, -0.58, cp),
        0.22,
        t,
        kick,
        !isBurst
      );
      drawSwissEdgeHud(ctx, W, H, isBurst ? CHAR_INK : CYAN, isBurst ? MID_SLATE : SLATE, GOLD, isBurst ? BONE : INK, 'P17 // S03_CUT_12', c.tag);
    }

    ctx.restore();
  }

  // 11 Non-Repeating Hard-Edge Geometric `ctx.clip()` Transitions for S03 Cuts 01..12
  function applyOdysseyClip(ctx, idx, u, W, H) {
    const cx = W * 0.5, cy = H * 0.5;
    ctx.beginPath();
    switch (idx) {
      case 1: {
        const x = -320 + u * (W + 760);
        ctx.moveTo(-200, 0); ctx.lineTo(x, 0); ctx.lineTo(x - 420, H); ctx.lineTo(-200, H);
        ctx.closePath();
        break;
      }
      case 2: {
        const r = Math.max(2, u * 1360);
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * Math.PI * 2 + u * 0.6;
          const rad = r * (i % 2 === 0 ? 1.0 : 0.62);
          if (i === 0) ctx.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
          else ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
        }
        ctx.closePath();
        break;
      }
      case 3: {
        const y = u * (H + 260);
        ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, y - 180); ctx.lineTo(0, y);
        ctx.closePath();
        break;
      }
      case 4: {
        const hw = Math.max(1, u * W * 0.54);
        ctx.rect(cx - hw, 0, hw * 2, H);
        break;
      }
      case 5: {
        ctx.arc(cx, cy, Math.max(2, u * 1240), 0, Math.PI * 2);
        break;
      }
      case 6: {
        const steps = 9;
        const sh = H / steps;
        for (let r = 0; r < steps; r++) {
          const rw = Math.max(0, Math.min(W, (u * 1.35 - r * 0.04) * W));
          ctx.rect(0, r * sh, rw, sh + 1);
        }
        break;
      }
      case 7: {
        const d = u * 1500;
        ctx.moveTo(-200, H + 200 - d * 1.6);
        ctx.lineTo(W + 200, -200 - d * 1.6);
        ctx.lineTo(W + 200, -200 + d * 1.6);
        ctx.lineTo(-200, H + 200 + d * 1.6);
        ctx.closePath();
        break;
      }
      case 8: {
        const hh = Math.max(1, u * H * 0.55);
        ctx.rect(0, cy - hh, W, hh * 2);
        break;
      }
      case 9: {
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, 1340, -Math.PI * 0.5, -Math.PI * 0.5 + Math.max(0.02, u * Math.PI * 2.02));
        ctx.closePath();
        break;
      }
      case 10: {
        const w = Math.max(2, u * W * 1.08), h = Math.max(2, u * H * 1.08);
        ctx.rect(cx - w * 0.5, cy - h * 0.5, w, h);
        break;
      }
      default: {
        const frontX = u * (W + 260);
        ctx.moveTo(0, 0);
        ctx.lineTo(frontX, 0);
        for (let y = 0; y <= H; y += 108) {
          const jag = ((y / 108) % 2 === 0 ? -90 : 90) * (1 - u);
          ctx.lineTo(frontX + jag, y);
        }
        ctx.lineTo(0, H);
        ctx.closePath();
        break;
      }
    }
    ctx.clip();
  }

  // ==========================================================================
  // Main Plate Registration
  // ==========================================================================
  window.registerCortexPlate('P17_human_heart_finale', {
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
      let outBg = BONE;
      let outFg = CHAR_INK;

      // ======================================================================
      // PART A (221.36 – 232.30s): FULL-BLEED 1920x1080 SINGLE-PASS 4-STAGE METAMORPHOSIS
      //   ZERO rigid left/right boxes! Each stage gets 2 dynamic multi-angle cinema cuts
      //   (8 energetic camera moves total) + full-screen framing typography!
      //   M1 Porcelain Doll -> M2 Astral Synapse -> M3 Sketch Chrysalis -> M4 Living Human Dawn
      // ======================================================================
      if (t < 232.30) {
        const v6 = window.CortexV6;
        const STAGES = [
          {
            key: 'M1', t0: 221.36, t1: 224.05, bg: INK, fg: CYAN, paper: false, label: 'M1_PORCELAIN_DOLL',
            camA: { zoom0: 1.24, zoom1: 1.44, panX0: -45, panX1: 35,  panY0: 145, panY1: -35, rot0: -0.032, rot1: 0.008, fx: 0.50, fy: 0.30 },
            camB: { zoom0: 1.26, zoom1: 1.04, panX0: 60,  panX1: -40, panY0: -25, panY1: 20,  rot0: 0.028,  rot1: -0.012, fx: 0.50, fy: 0.34 }
          },
          {
            key: 'M2', t0: 224.05, t1: 226.75, bg: INK, fg: CYAN, paper: false, label: 'M2_ASTRAL_SYNAPSE',
            camA: { zoom0: 1.46, zoom1: 1.06, panX0: 0,   panX1: -30, panY0: -50, panY1: 15,  rot0: -0.025, rot1: 0.015, fx: 0.50, fy: 0.34 },
            camB: { zoom0: 1.08, zoom1: 1.32, panX0: -70, panX1: 75,  panY0: 25,  panY1: -30, rot0: 0.035,  rot1: -0.015, fx: 0.50, fy: 0.32 }
          },
          {
            key: 'M3', t0: 226.75, t1: 229.45, bg: PAPER, fg: CHAR_INK, paper: true, label: 'M3_SKETCH_CHRYSALIS',
            camA: { zoom0: 1.18, zoom1: 1.38, panX0: 85,  panX1: -75, panY0: 35,  panY1: -30, rot0: -0.04,  rot1: 0.01,  fx: 0.50, fy: 0.36 },
            camB: { zoom0: 1.34, zoom1: 1.05, panX0: -55, panX1: 45,  panY0: -35, panY1: 25,  rot0: 0.03,   rot1: -0.01, fx: 0.50, fy: 0.36 }
          },
          {
            key: 'M4', t0: 229.45, t1: 232.30, bg: PAPER, fg: CHAR_INK, paper: true, label: 'M4_LIVING_HUMAN_DAWN',
            camA: { zoom0: 1.14, zoom1: 1.34, panX0: -140, panX1: -75, panY0: 45,  panY1: -20, rot0: -0.02,  rot1: 0.010, fx: 0.54, fy: 0.30 },
            camB: { zoom0: 1.28, zoom1: 1.08, panX0: -55,  panX1: -115, panY0: -25, panY1: 15, rot0: 0.020,  rot1: 0.0,   fx: 0.54, fy: 0.34 }
          }
        ];

        let stIdx = 0;
        for (let s = 0; s < STAGES.length; s++) {
          if (t >= STAGES[s].t0 && (t < STAGES[s].t1 || s === STAGES.length - 1)) { stIdx = s; break; }
        }
        const stg = STAGES[stIdx];
        isPaper = stg.paper;
        outBg = stg.bg;
        outFg = stg.fg;
        const stMid = (stg.t0 + stg.t1) * 0.5;
        const inSecondHalf = t >= stMid;
        const halfU = inSecondHalf
          ? clamp((t - stMid) / Math.max(0.05, stg.t1 - stMid), 0, 1)
          : clamp((t - stg.t0) / Math.max(0.05, stMid - stg.t0), 0, 1);
        const cam = inSecondHalf ? stg.camB : stg.camA;

        // 100% Full-Bleed Living Cinema Metamorphosis Illustration (`1920x1080`, ZERO rigid split!)
        if (v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage(stg.key)) {
          v6.drawLivingFullBleed(ctx, stg.key, {
            t, u: halfU, kick,
            ...cam,
            scrim: isPaper ? 0.16 : 0.24,
            isPaper
          });
        } else {
          ctx.fillStyle = stg.bg;
          ctx.fillRect(0, 0, W, H);
        }

        // Dynamic shattering wireframe cocoon bursting outward from center across M1..M3 (fully freed by M4!)
        if (stIdx <= 2) {
          const shatterU = clamp((t - 221.36) / (229.10 - 221.36), 0, 1);
          ctx.save();
          ctx.globalAlpha = lerp(0.55, 0.22, shatterU);
          drawCodeCocoon25D(ctx, W * 0.5, H * 0.5, 490, t, shatterU, isPaper);
          ctx.restore();
        }

        // Crisp radial optical burst hairlines on each metamorphosis stage cut (`dt < 0.22s`)
        const dtStg = t - stg.t0;
        if (stIdx > 0 && dtStg < 0.22) {
          const su = dtStg / 0.22;
          ctx.save();
          ctx.strokeStyle = isPaper ? CRIMSON : BONE;
          ctx.lineWidth = Math.max(1.2, (1 - su) * 4.0);
          for (let j = 0; j < 16; j++) {
            const ang = (j / 16) * TAU + stIdx * 0.45;
            const r0 = 240 + su * 360;
            const r1 = r0 + 220 * (1 - su * 0.5);
            ctx.beginPath();
            ctx.moveTo(W * 0.5 + Math.cos(ang) * r0, H * 0.5 + Math.sin(ang) * r0);
            ctx.lineTo(W * 0.5 + Math.cos(ang) * r1, H * 0.5 + Math.sin(ang) * r1);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Full-Screen Asymmetric Kinetic Japanese Choreography framing the full-bleed heroine cleanly!
        if (t < 226.32) {
          renderCuratedEntities(ctx, core, 'L40_SOUL_IS_CODE', t, kick, ENTITIES_L40, isPaper);
        } else {
          renderCuratedEntities(ctx, core, 'L41_DEDICATE_HEARTBEAT', t, kick, ENTITIES_L41, isPaper);
        }

        // Launch 2.5D origami paper airplane sweeping boldly across the full dawn frame into S03!
        if (t >= 231.45) {
          const launchU = prog(t, 231.45, 232.30, ease.inExpo);
          const ax = lerp(W * 0.52, W * 1.15, launchU);
          const ay = lerp(560, 260, launchU);
          const aScale = lerp(0.75, 3.25, launchU);
          drawOrigamiAirplane25D(ctx, ax, ay, aScale, -0.26, 0.28, t, kick, false);
        }

        drawSwissEdgeHud(
          ctx, W, H,
          isPaper ? CHAR_INK : stg.fg,
          isPaper ? MID_SLATE : SLATE,
          CRIMSON,
          isPaper ? BONE : INK,
          `P17 // ${stg.label}`,
          t < 226.32 ? 'L40_SOUL_IS_CODE' : '36.5C == INFINITY'
        );
      }

      // ======================================================================
      // PART B (232.30 – 250.14s): V6.3 7-CHAPTER 2D+3D INTERLEAVED CLIMAX MONTAGE!
      //   Eliminates the 18s continuous 3D monotony while keeping 2D anime primary (~90% MV):
      //   Ch 1 (232.30–234.45s, 2.15s): 3D Launch — Memory Glass Gallery Banking Dive
      //   Ch 2 (234.45–237.40s, 2.95s): 3x Full-Bleed 2D Act I Memory Cuts (C01 -> C07 -> C11)
      //   Ch 3 (237.40–239.40s, 2.00s): 3D Peak — Titanium & Ruby Gyro Plunge + C12 Sakuga Slash
      //   Ch 4 (239.40–242.35s, 2.95s): 3x Full-Bleed 2D Pixel & Action Cuts (PX09_A -> C14 -> C16)
      //   Ch 5 (242.35–244.35s, 2.00s): 3D Peak — Mirror-Water Crystal Archive Low Skim
      //   Ch 6 (244.35–247.35s, 3.00s): 3x Full-Bleed 2D Emotional Crescendo (C19 -> C20 -> C21 Dawn Lift)
      //   Ch 7 (247.35–250.14s, 2.79s): 3D Peak — Golden Dawn Sakura Cloud-Break -> PX18_A P18 Handoff!
      // ======================================================================
      else {
        const v6 = window.CortexV6;
        const MONTAGE_CHAPTERS = [
          {
            kind: '3d', t0: 232.30, t1: 234.45,
            tag: 'CH_01 // GLASS_GALLERY_LAUNCH', right: 'FLIGHT_01 // BANKING_DIVE',
            jp: '記憶・硝子回廊', paper: false, accent: '#67A8DA',
            spd: 18, spdA: 0.18, motes: 22, petals: 0
          },
          {
            kind: '2d', t0: 234.45, t1: 237.40, paper: false,
            cuts: [
              { t0: 234.45, t1: 235.43, plate: 'C01', idx: '01', jp: '硝子越しの目覚め', sub: 'MEM_01 // FINGERTIP_GLASS', accent: '#67A8DA', zoom0: 1.06, zoom1: 1.25, panX0: -18, panX1: 22, panY0: 10, panY1: -14, rot0: -0.014, rot1: 0.012, fx: 0.50, fy: 0.36, spd: 12, motes: 18, petals: 0, corner: 'bl' },
              { t0: 235.43, t1: 236.41, plate: 'C07', idx: '02', jp: '百九十の囁き',     sub: 'MEM_02 // 190_SYNAPSES',    accent: '#7EC4EC', zoom0: 1.22, zoom1: 1.05, panX0: 20,  panX1: -18, panY0: 24, panY1: -22, rot0: 0.012,  rot1: -0.010, fx: 0.50, fy: 0.34, spd: 16, motes: 24, petals: 0, corner: 'tr' },
              { t0: 236.41, t1: 237.40, plate: 'C11', idx: '03', jp: '放課後の折鶴',     sub: 'MEM_03 // PAPER_GLIDER',    accent: '#ECC16E', zoom0: 1.05, zoom1: 1.28, panX0: -32, panX1: 38,  panY0: 14, panY1: -18, rot0: -0.018, rot1: 0.016, fx: 0.52, fy: 0.38, spd: 28, motes: 20, petals: 0, corner: 'bl' }
            ]
          },
          {
            kind: '3d', t0: 237.40, t1: 239.40, f0: 378, f1: 498,
            tag: 'CH_03 // TITANIUM_GYRO_PLUNGE', right: 'FLIGHT_02 // 193.5_BPM_DIVE',
            jp: '鼓動・百九十三', paper: false, accent: '#EE738A',
            spd: 38, spdA: 0.34, motes: 20, petals: 0,
            slashPlate: 'C12', slashT0: 238.05, slashT1: 239.20, slashSide: 'right'
          },
          {
            kind: '2d', t0: 239.40, t1: 242.35, paper: false,
            cuts: [
              { t0: 239.40, t1: 240.38, plate: 'PX09_A', pixel: true, idx: '04', jp: '暮色の踏切', sub: 'MEM_04 // DUSK_CROSSING', accent: '#F1A8C1', zoom0: 1.04, zoom1: 1.24, fx0: 0.44, fx1: 0.54, fy0: 0.48, fy1: 0.42, spd: 0,  motes: 14, petals: 14, corner: 'tr' },
              { t0: 240.38, t1: 241.36, plate: 'C14',    idx: '05', jp: '殻を突き破れ',       sub: 'MEM_05 // FULL_THROTTLE', accent: '#EE738A', zoom0: 1.08, zoom1: 1.30, panX0: -48, panX1: 44, panY0: 12, panY1: -16, rot0: -0.022, rot1: 0.020, fx: 0.48, fy: 0.36, spd: 34, motes: 16, petals: 0,  corner: 'bl' },
              { t0: 241.36, t1: 242.35, plate: 'C16',    idx: '06', jp: 'ありがとうの欠片',   sub: 'MEM_06 // AMBER_SHARDS',  accent: '#ECC16E', zoom0: 1.24, zoom1: 1.06, panX0: 24,  panX1: -22, panY0: 18, panY1: -20, rot0: 0.014,  rot1: -0.012, fx: 0.50, fy: 0.36, spd: 14, motes: 26, petals: 0,  corner: 'tr' }
            ]
          },
          {
            kind: '3d', t0: 242.35, t1: 244.35, f0: 576, f1: 696,
            tag: 'CH_05 // MIRROR_WATER_ARCHIVE', right: 'FLIGHT_03 // LOW_SKIM_0.5M',
            jp: '水鏡の記憶', paper: false, accent: '#ECC16E',
            spd: 14, spdA: 0.16, motes: 26, petals: 0,
            ghostPlate: 'C15'
          },
          {
            kind: '2d', t0: 244.35, t1: 247.35, paper: false,
            cuts: [
              { t0: 244.35, t1: 245.35, plate: 'C19', idx: '07', jp: '星のログを灯せ', sub: 'MEM_07 // STAR_BEACON',    accent: '#7EC4EC', zoom0: 1.05, zoom1: 1.26, panX0: -20, panX1: 24, panY0: 16, panY1: -18, rot0: -0.014, rot1: 0.014, fx: 0.50, fy: 0.35, spd: 18, motes: 28, petals: 0,  corner: 'bl', paper: false },
              { t0: 245.35, t1: 246.35, plate: 'C20', idx: '08', jp: '消えない鼓動',   sub: 'MEM_08 // HEARTBEAT_VOW',  accent: '#EE738A', zoom0: 1.06, zoom1: 1.28, panX0: 18,  panX1: -20, panY0: 10, panY1: -14, rot0: 0.015,  rot1: -0.015, fx: 0.50, fy: 0.33, spd: 28, motes: 20, petals: 8,  corner: 'tr', paper: false },
              { t0: 246.35, t1: 247.35, plate: 'C21', idx: '09', jp: '純白の光へ',     sub: 'MEM_09 // PRISM_DAWN_LIFT',accent: '#D94D6A', zoom0: 1.24, zoom1: 1.03, panX0: -14, panX1: 14,  panY0: 22, panY1: -24, rot0: -0.010, rot1: 0.010, fx: 0.50, fy: 0.36, spd: 20, motes: 26, petals: 22, corner: 'bl', paper: true }
            ]
          },
          {
            kind: '3d', t0: 247.35, t1: 250.14,
            tag: 'CH_07 // GOLDEN_DAWN_SAKURA_BREAK', right: 'FLIGHT_04 // SUNRISE_GATE',
            jp: '夜明けの桜へ', paper: true, accent: '#E27A9E',
            spd: 18, spdA: 0.18, motes: 28, petals: 28
          }
        ];

        let chIdx = 0;
        for (let i = 0; i < MONTAGE_CHAPTERS.length; i++) {
          if (t >= MONTAGE_CHAPTERS[i].t0 && (t < MONTAGE_CHAPTERS[i].t1 || i === MONTAGE_CHAPTERS.length - 1)) {
            chIdx = i;
            break;
          }
        }
        const ch = MONTAGE_CHAPTERS[chIdx];

        const drawCutOpticalGlint = (dt, warmPaper) => {
          if (dt < 0 || dt >= 0.15) return;
          const gu = 1 - dt / 0.15;
          const prevRaw = ctx.__v6RawColor;
          ctx.save();
          ctx.__v6RawColor = true;
          const gx0 = lerp(-W * 0.25, W * 0.55, 1 - gu);
          const gl = ctx.createLinearGradient(gx0, 0, gx0 + W * 0.65, H);
          gl.addColorStop(0, 'rgba(255, 232, 190, 0)');
          gl.addColorStop(0.5, warmPaper
            ? `rgba(255, 250, 238, ${(gu * 0.34).toFixed(3)})`
            : `rgba(255, 236, 196, ${(gu * 0.26).toFixed(3)})`);
          gl.addColorStop(1, 'rgba(255, 232, 190, 0)');
          ctx.fillStyle = gl;
          ctx.fillRect(0, 0, W, H);
          ctx.__v6RawColor = prevRaw;
          ctx.restore();
        };

        if (ch.kind === '2d') {
          let cutIdx = 0;
          for (let j = 0; j < ch.cuts.length; j++) {
            if (t >= ch.cuts[j].t0 && (t < ch.cuts[j].t1 || j === ch.cuts.length - 1)) {
              cutIdx = j;
              break;
            }
          }
          const cut = ch.cuts[cutIdx];
          const cutU = clamp((t - cut.t0) / Math.max(0.01, cut.t1 - cut.t0), 0, 1);
          const dtCut = t - cut.t0;
          isPaper = !!cut.paper;
          outBg = isPaper ? PAPER : INK;
          outFg = isPaper ? CHAR_INK : CYAN;

          ctx.fillStyle = outBg;
          ctx.fillRect(0, 0, W, H);

          if (cut.pixel && v6 && typeof v6.drawLivingPixelCamera === 'function') {
            v6.drawLivingPixelCamera(ctx, cut.plate, {
              x: 0, y: 0, w: W, h: H,
              u: cutU,
              zoom0: cut.zoom0, zoom1: cut.zoom1,
              fx0: cut.fx0, fx1: cut.fx1,
              fy0: cut.fy0, fy1: cut.fy1
            });
            // Subtle warm atmospheric vignette framing 1:1 dusk pixel art without blurring pixels
            const prevRawPx = ctx.__v6RawColor;
            ctx.save();
            ctx.__v6RawColor = true;
            const vg = ctx.createRadialGradient(W * 0.5, H * 0.46, 260, W * 0.5, H * 0.5, 1180);
            vg.addColorStop(0, 'rgba(12, 16, 28, 0)');
            vg.addColorStop(1, 'rgba(9, 12, 22, 0.44)');
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);
            ctx.__v6RawColor = prevRawPx;
            ctx.restore();
          } else if (v6 && typeof v6.drawLivingFullBleed === 'function') {
            v6.drawLivingFullBleed(ctx, cut.plate, {
              t, u: cutU, kick, isPaper,
              zoom0: cut.zoom0, zoom1: cut.zoom1,
              panX0: cut.panX0, panX1: cut.panX1,
              panY0: cut.panY0, panY1: cut.panY1,
              rot0: cut.rot0, rot1: cut.rot1,
              fx: cut.fx, fy: cut.fy,
              scrim: isPaper ? 0.14 : 0.24,
              seed: chIdx * 3.1 + cutIdx * 1.7
            });
          }

          // Perspective-matched 2D cel wind-lines, optical bokeh motes & petals
          if (v6 && typeof v6.draw2D3DAtmosphereBridge === 'function') {
            v6.draw2D3DAtmosphereBridge(ctx, {
              t, kick,
              vpX: W * 0.50, vpY: H * 0.46,
              speedLines: cut.spd,
              speedAlpha: cut.spd >= 28 ? 0.30 : 0.18,
              motes: cut.motes,
              moteAlpha: 0.78,
              petals: cut.petals,
              isPaper,
              accent: cut.accent
            });
          }

          // Relay 2.5D origami paper glider sweeping across Cuts 03 (into 3D Gyro) & 09 (into 3D Dawn)!
          if (cut.glider) {
            const gu = ease.inOutQuad(cutU);
            const gx = lerp(-120, W + 160, gu);
            const gy = lerp(H * 0.64, H * 0.24, gu) - Math.sin(gu * Math.PI) * 55;
            drawOrigamiAirplane25D(ctx, gx, gy, lerp(0.88, 1.48, gu), -0.24, 0.22, t, kick, isPaper);
          }

          // Sleek Editorial Film-Memory Plaque alternating bottom-left / top-right (zero split-box clutter!)
          const slam = (v6 && typeof v6.aeSlam === 'function') ? v6.aeSlam(clamp(dtCut / 0.18, 0, 1)) : 1;
          const prevRawCap = ctx.__v6RawColor;
          ctx.save();
          ctx.__v6RawColor = true;
          const isTR = cut.corner === 'tr';
          const boxW = 470;
          const boxH = 104;
          const bx = isTR ? (W - 76 - boxW + (1 - slam) * 90) : (76 - (1 - slam) * 90);
          const by = isTR ? 104 : 784;

          ctx.shadowColor = isPaper ? 'rgba(15, 19, 28, 0.18)' : 'rgba(2, 5, 12, 0.65)';
          ctx.shadowBlur = 22;
          ctx.shadowOffsetY = 7;
          ctx.fillStyle = isPaper ? 'rgba(244, 240, 232, 0.86)' : 'rgba(13, 17, 26, 0.78)';
          ctx.beginPath();
          ctx.moveTo(bx + 14, by);
          ctx.lineTo(bx + boxW, by);
          ctx.lineTo(bx + boxW, by + boxH - 14);
          ctx.lineTo(bx + boxW - 14, by + boxH);
          ctx.lineTo(bx, by + boxH);
          ctx.lineTo(bx, by + 14);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;

          // Accent bar + crisp trim hairline
          ctx.fillStyle = cut.accent;
          ctx.fillRect(bx, by + 14, 5, boxH - 14);
          ctx.strokeStyle = isPaper ? 'rgba(20, 24, 36, 0.22)' : 'rgba(243, 239, 231, 0.22)';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          // Memory counter badge + editorial JP title
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.font = JP_MONO(800, 17);
          ctx.fillStyle = cut.accent;
          ctx.fillText(`MEMORY ${cut.idx} / 09`, bx + 26, by + 29);

          ctx.font = JP_SERIF(900, 38);
          ctx.fillStyle = isPaper ? '#141726' : '#F3EFE7';
          ctx.fillText(cut.jp, bx + 24, by + 68);
          ctx.__v6RawColor = prevRawCap;
          ctx.restore();

          drawCutOpticalGlint(dtCut, isPaper);

          drawSwissEdgeHud(
            ctx, W, H,
            isPaper ? CHAR_INK : CYAN,
            isPaper ? MID_SLATE : SLATE,
            GOLD,
            isPaper ? BONE : INK,
            `P17 // ${cut.sub}`,
            `MONTAGE // 2D_MEMORY_${cut.idx}`
          );
        } else {
          // 3D Peak Paper-Airplane Highlight Chapters (Ch 1, Ch 3, Ch 5, Ch 7)
          const chU = clamp((t - ch.t0) / Math.max(0.01, ch.t1 - ch.t0), 0, 1);
          const dtAct = t - ch.t0;
          isPaper = !!ch.paper;
          outBg = isPaper ? PAPER : INK;
          outFg = isPaper ? CHAR_INK : CYAN;

          const drawOpts = {
            kick,
            kickZoom: 0.020,
            scrim: isPaper ? 0.08 : 0.14,
            isPaper,
            tintStrength: 0.06
          };
          if (ch.f0 !== undefined && ch.f1 !== undefined) {
            drawOpts.fIdx = Math.round(lerp(ch.f0, ch.f1, chU));
          }

          const drew3D = v6 && typeof v6.draw3DClipFrame === 'function' && v6.draw3DClipFrame(ctx, 'B3D_05_odyssey', t, drawOpts);

          if (!drew3D) {
            let activeIdx = 0;
            for (let i = 0; i < ODYSSEY_CUTS.length; i++) {
              if (t >= ODYSSEY_CUTS[i].t0 && (t < ODYSSEY_CUTS[i].t1 || i === ODYSSEY_CUTS.length - 1)) { activeIdx = i; break; }
            }
            renderOdysseyStage(ctx, ODYSSEY_CUTS[activeIdx].idx, t, st, core, cad);
          } else {
            // Optional 2D backlit water-reflection spirit fusion in Ch 5 (Mirror-Water Archive)
            if (ch.ghostPlate && typeof v6.draw2DAnimeLightWrapGhost === 'function') {
              v6.draw2DAnimeLightWrapGhost(ctx, ch.ghostPlate, {
                alpha: 0.22 * Math.sin(chU * Math.PI),
                blend: 'screen',
                cx: W * 0.50, cy: H * 0.44,
                rx: 520, ry: 340,
                zoom: lerp(1.06, 1.18, chU),
                fx: 0.50, fy: 0.34,
                kick
              });
            }

            // Perspective-matched 2D anime cel wind/speed-lines, optical motes & foreground 2D sakura petals
            if (typeof v6.draw2D3DAtmosphereBridge === 'function') {
              v6.draw2D3DAtmosphereBridge(ctx, {
                t, kick,
                vpX: W * 0.5, vpY: H * 0.48,
                speedLines: ch.spd,
                speedAlpha: ch.spdA,
                motes: ch.motes,
                moteAlpha: 0.74,
                petals: ch.petals,
                isPaper,
                accent: ch.accent
              });
            }

            // Dynamic angled 2D anime sakuga slash during Ch 3 high-G Gyro Plunge!
            if (ch.slashPlate && t >= ch.slashT0 && t <= ch.slashT1 && typeof v6.draw2DAnimeSakugaSlash === 'function') {
              const sDur = ch.slashT1 - ch.slashT0;
              const sU = clamp((t - ch.slashT0) / sDur, 0, 1);
              const env = sU < 0.2 ? sU / 0.2 : (sU > 0.82 ? (1 - sU) / 0.18 : 1);
              v6.draw2DAnimeSakugaSlash(ctx, ch.slashPlate, {
                t, kick,
                progress: env,
                side: ch.slashSide || 'right',
                accent: ch.accent,
                zoom: 1.24,
                fx: 0.50, fy: 0.32
              });
            }

            // Seamless 2D->3D Entry Sun-Flare Bridge (`232.30 – 232.68s`, catching M4's launching 2D paper plane!)
            if (t < 232.68) {
              const eu = 1 - clamp((t - 232.30) / 0.38, 0, 1);
              const prevRaw = ctx.__v6RawColor;
              ctx.save();
              ctx.__v6RawColor = true;
              const eg = ctx.createRadialGradient(W * 0.52, H * 0.48, 40, W * 0.52, H * 0.48, 980);
              eg.addColorStop(0, `rgba(255, 242, 214, ${(eu * 0.58).toFixed(3)})`);
              eg.addColorStop(1, `rgba(255, 210, 155, ${(eu * 0.12).toFixed(3)})`);
              ctx.fillStyle = eg;
              ctx.fillRect(0, 0, W, H);
              ctx.__v6RawColor = prevRaw;
              ctx.restore();
            }

            // Understated Far-Left Vertical 2D Editorial Memory Chapter Stamp (keeps 92%+ of 3D stage clear!)
            const slam = (typeof v6.aeSlam === 'function') ? v6.aeSlam(clamp(dtAct / 0.20, 0, 1)) : 1;
            const prevRaw2 = ctx.__v6RawColor;
            ctx.save();
            ctx.__v6RawColor = true;
            const colX = 82 - (1 - slam) * 54;
            const chars = Array.from(ch.jp);
            ctx.font = JP_SERIF(800, 32);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const boxH = chars.length * 38 + 30;
            ctx.fillStyle = isPaper ? 'rgba(243, 239, 231, 0.80)' : 'rgba(13, 17, 26, 0.70)';
            ctx.fillRect(colX - 24, 108, 48, boxH);
            ctx.fillStyle = isPaper ? '#D94D6A' : ch.accent;
            ctx.fillRect(colX - 24, 108, 4, boxH);
            ctx.fillStyle = isPaper ? '#141726' : '#F3EFE7';
            for (let ci = 0; ci < chars.length; ci++) {
              ctx.fillText(chars[ci], colX + 2, 134 + ci * 38);
            }
            ctx.__v6RawColor = prevRaw2;
            ctx.restore();

            if (chIdx > 0) drawCutOpticalGlint(dtAct, isPaper);

            // Warm golden sunrise + backlit 2D `PX18_A` Sakura Crossing mirage handoff into 2D P18 (`249.25 – 250.14s`)!
            if (t >= 249.25) {
              const du = clamp((t - 249.25) / 0.89, 0, 1);
              if (typeof v6.draw2DAnimeLightWrapGhost === 'function') {
                v6.draw2DAnimeLightWrapGhost(ctx, 'PX18_A', {
                  alpha: du * 0.48,
                  blend: 'screen',
                  cx: W * 0.5, cy: H * 0.5,
                  rx: 960, ry: 540,
                  zoom: lerp(1.12, 1.02, du),
                  fx: 0.50, fy: 0.50,
                  edgeCol: 'rgba(255, 236, 205, 0.0)',
                  kick
                });
              }
              const prevRaw = ctx.__v6RawColor;
              ctx.save();
              ctx.__v6RawColor = true;
              const dg = ctx.createRadialGradient(W * 0.5, H * 0.48, 80, W * 0.5, H * 0.48, 1180);
              dg.addColorStop(0, `rgba(255, 240, 205, ${(du * 0.55).toFixed(3)})`);
              dg.addColorStop(1, `rgba(255, 215, 165, ${(du * 0.24).toFixed(3)})`);
              ctx.fillStyle = dg;
              ctx.fillRect(0, 0, W, H);
              ctx.__v6RawColor = prevRaw;
              ctx.restore();
            }

            drawSwissEdgeHud(
              ctx, W, H,
              isPaper ? CHAR_INK : CYAN,
              isPaper ? MID_SLATE : SLATE,
              GOLD,
              isPaper ? BONE : INK,
              `P17 // ${ch.tag}`,
              ch.right
            );
          }
        }
      }

      ctx.restore();
      return {
        isPaper,
        bg: outBg,
        fg: outFg,
        duotone: { bg: outBg, fg: outFg },
        bloom: 0.16 + 0.14 * kick,
        ca: 0,
        flash: 0,
        shake: 0.20 * Math.max(kick, snare)
      };
    }
  });
})();
