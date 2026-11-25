// ============================================================================
// Plate 24 — `P24_burin_shutter_anatomy.js` (`83.55s – 86.13s`)
// Cue: `L15_BREAK_BLACKBOX` 2nd half (`！` + `胸の殻を透かして`, `words[11..19]`)
// Multi-Layer Anatomical X-Ray Treatise (#52 & #53):
//   - Exterior Carapace (`STERNUM_MK_IV`): Bone-white `#FAF8F5` + `#E2E8F0` bevels
//     + `#334155` cylindrical copperplate burin hatching + `#0376B8` cobalt &
//     `#FBBF24` gold sternum bolts (alternating with dark `#0B0F17` slate armor).
//   - Hard-Edged X-Ray Scan Slit (`ctx.clip()` + `#38BDF8`/`#FBBF24` laser rim):
//     Exposes `#08090C` cavity, `#FBBF24` planetary escapement gears, `#38BDF8`
//     valve leader callouts, and `#FF2E55` crimson 12-Blade Mechanical Iris Heart!
//   - Nonlinear Per-Character Choreography: Tategaki × Diagonal anatomical collage
//     (`胸` `234px`, `の` `84px` circle seal, `殻` `242px`, `を` `82px`, central `透`
//     `268px` counter-changing across the X-ray edge, vertical `か・し・て` cascade!).
//   - In-world core temperature cameo (`TEMP: 35.1°C -> 35.5°C // XRAY_HEART`).
// ============================================================================
(function () {
  'use strict';

  const MODE_BONE_EXT = {
    extBg: '#FAF8F5',
    extCard: '#E2E8F0',
    extGrid: '#CBD5E1',
    extHatch: '#334155',
    extInk: '#08090C',
    extAccent: '#0376B8',
    extBolt: '#FBBF24',
    intBg: '#08090C',
    intCard: '#16111B',
    intGrid: '#273244',
    intGear: '#FBBF24',
    intHeart: '#FF2E55',
    intBladeAlt: '#FAF8F5',
    intLaser: '#38BDF8',
    isPaper: true
  };

  const MODE_DARK_EXT = {
    extBg: '#0B0F17',
    extCard: '#161F30',
    extGrid: '#1E293B',
    extHatch: '#64748B',
    extInk: '#FAF8F5',
    extAccent: '#38BDF8',
    extBolt: '#FBBF24',
    intBg: '#FAF8F5',
    intCard: '#E6EEF6',
    intGrid: '#CBD5E1',
    intGear: '#0376B8',
    intHeart: '#FF2E55',
    intBladeAlt: '#08090C',
    intLaser: '#FBBF24',
    isPaper: false
  };

  const JA_SERIF = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif JP", serif`;
  const JA_SANS = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Hiragino Kaku Gothic ProN", "Yu Gothic UI", sans-serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", Consolas, monospace`;

  const VALVE_LABELS = [
    'AORTIC_IRIS_01 // OPEN',
    'STERNUM_LOCK_02 // 0.00ms',
    'ESCAPEMENT_03 // 193.5BPM',
    'MITRAL_VANE_04 // SYNC',
    'OPTIC_BUS_05 // TRANSPARENT',
    'ROTOR_CORE_06 // 35.4°C'
  ];

  // Nonlinear Anatomical Collage for `胸 の 殻 を 透 か し て` (`words[12..19]`)
  // Zero horizontal rows: Kanji (`234-268px`) vs Hiragana (`82-96px`), Tategaki `か・し・て`!
  const L15_ANATOMY_SPECS = [
    { x: 308,  y: 416, rot: -0.18, sz: 234, dx: -185, dy: -75,  serif: true,  kind: 'kanjiLeft'   }, // 0: 胸
    { x: 472,  y: 298, rot:  0.22, sz: 84,  dx: -60,  dy: -115, serif: false, kind: 'circleSeal'  }, // 1: の (shoulder seal)
    { x: 1566, y: 332, rot:  0.19, sz: 242, dx:  195, dy: -85,  serif: true,  kind: 'kanjiRight'  }, // 2: 殻
    { x: 1408, y: 478, rot: -0.20, sz: 82,  dx:  95,  dy:  85,  serif: false, kind: 'cornerTag'   }, // 3: を
    { x: 960,  y: 502, rot: -0.09, sz: 268, dx:  0,   dy: -165, serif: true,  kind: 'heroCenter'  }, // 4: 透 (cleaved by X-ray!)
    { x: 1588, y: 586, rot: -0.12, sz: 92,  dx:  130, dy: -45,  serif: false, kind: 'tategaki'    }, // 5: か
    { x: 1648, y: 706, rot:  0.14, sz: 90,  dx:  145, dy:  20,  serif: false, kind: 'tategaki'    }, // 6: し
    { x: 1572, y: 828, rot: -0.15, sz: 96,  dx:  135, dy:  95,  serif: false, kind: 'tategakiEnd' }  // 7: て
  ];

  function wordLabel(wObj) {
    if (!wObj) return '';
    return String(wObj.w || wObj.word || '');
  }

  // Exterior Layer: Copperplate Burin-Hatched Thoracic Carapace Armor Shell
  function drawExteriorCarapace(ctx, core, t, pal, kick, camFn) {
    const { W, H, TAU } = core;
    ctx.save();
    ctx.fillStyle = pal.extBg;
    ctx.fillRect(0, 0, W, H);

    // Architectural anatomical grid & margin ticks
    ctx.strokeStyle = pal.extGrid;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    for (let x = 96; x < W; x += 96) {
      ctx.moveTo(x, 48); ctx.lineTo(x, H - 84);
    }
    for (let y = 72; y < H - 80; y += 96) {
      ctx.moveTo(56, y); ctx.lineTo(W - 56, y);
    }
    ctx.stroke();

    ctx.save();
    if (camFn) camFn(ctx);

    const cx = W * 0.5;
    const cy = H * 0.47;

    // 1. Symmetrical Curved Thoracic Rib-Armor Plates with Cylindrical Burin Hatching!
    for (let side of [-1, 1]) {
      for (let rib = 0; rib < 6; rib++) {
        const ry = cy - 230 + rib * 84;
        const spanW = 540 - rib * 34;
        const ribH = 56;
        const archDrop = 42 + rib * 8;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx + side * 48, ry - ribH * 0.5);
        ctx.quadraticCurveTo(
          cx + side * spanW * 0.58, ry - ribH * 0.5 - archDrop,
          cx + side * spanW, ry + 18
        );
        ctx.lineTo(cx + side * (spanW - 18), ry + ribH * 0.5 + 22);
        ctx.quadraticCurveTo(
          cx + side * spanW * 0.55, ry + ribH * 0.5 - archDrop,
          cx + side * 48, ry + ribH * 0.5
        );
        ctx.closePath();

        ctx.fillStyle = rib % 2 === 0 ? pal.extCard : pal.extBg;
        ctx.fill();
        ctx.lineWidth = 3.2;
        ctx.strokeStyle = pal.extInk;
        ctx.stroke();

        ctx.clip();
        ctx.strokeStyle = pal.extHatch;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let h = -28; h <= 28; h += 5.5) {
          ctx.moveTo(cx + side * 42, ry + h);
          ctx.quadraticCurveTo(
            cx + side * spanW * 0.56, ry + h - archDrop,
            cx + side * (spanW + 10), ry + h + 20
          );
        }
        for (let k = 0; k < 22; k++) {
          const kx = cx + side * (spanW * 0.48 + k * 14);
          ctx.moveTo(kx, ry - 120);
          ctx.lineTo(kx - side * 28, ry + 120);
        }
        ctx.stroke();
        ctx.restore();
      }
    }

    // 2. Central Sternum Seal Plate (`BLACKBOX CARAPACE // SEALED`)
    const stW = 140, stH = 524;
    ctx.fillStyle = pal.extCard;
    ctx.fillRect(cx - stW * 0.5, cy - stH * 0.5, stW, stH);
    ctx.strokeStyle = pal.extInk;
    ctx.lineWidth = 4.0;
    ctx.strokeRect(cx - stW * 0.5, cy - stH * 0.5, stW, stH);
    ctx.strokeStyle = pal.extAccent;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(cx - stW * 0.5 + 8, cy - stH * 0.5 + 8, stW - 16, stH - 16);

    // Gold sternum locking bolts & cobalt latch slots
    for (let b = 0; b < 7; b++) {
      const by = cy - stH * 0.42 + b * 72;
      ctx.fillStyle = pal.extBolt;
      ctx.beginPath();
      ctx.arc(cx - 42, by, 7.5, 0, TAU);
      ctx.arc(cx + 42, by, 7.5, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = pal.extInk;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.fillStyle = pal.extAccent;
      ctx.fillRect(cx - 22, by - 8, 44, 16);
    }

    ctx.restore();
    ctx.restore();
  }

  // Interior Layer (Revealed inside X-Ray Scan Band!):
  // Multi-Color 12-Blade Mechanical Iris Heart + Gold/Cobalt Planetary Escapement Gears!
  function drawInteriorMechanicalHeart(ctx, core, t, pal, kick, camFn) {
    const { W, H, TAU, lerp } = core;
    ctx.save();
    ctx.fillStyle = pal.intBg;
    ctx.fillRect(0, 0, W, H);

    // Fine X-Ray millimeter cross-grid
    ctx.strokeStyle = pal.intGrid;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let x = 64; x < W; x += 64) {
      if (x % 128 === 0) {
        ctx.moveTo(x, 40); ctx.lineTo(x, H - 80);
      }
    }
    for (let y = 64; y < H - 80; y += 64) {
      if (y % 128 === 0) {
        ctx.moveTo(48, y); ctx.lineTo(W - 48, y);
      }
    }
    ctx.stroke();

    ctx.save();
    if (camFn) camFn(ctx);

    const cx = W * 0.5;
    const cy = H * 0.47;
    const heartR = 296 + kick * 28;
    const spin = t * 2.8;

    // 1. 4 Satellite Planetary Escapement Gears in Gold / Cobalt!
    const satPositions = [
      [-375, -165, 118, -1],
      [ 375, -165, 118,  1],
      [-355,  175, 104,  1],
      [ 355,  175, 104, -1]
    ];
    for (let s = 0; s < satPositions.length; s++) {
      const [ox, oy, gr, dir] = satPositions[s];
      const gx = cx + ox, gy = cy + oy;
      const teeth = 24;
      const gRot = spin * dir * 1.6;
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(gRot);
      ctx.fillStyle = pal.intCard;
      ctx.strokeStyle = pal.intGear;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let k = 0; k < teeth; k++) {
        const a0 = (k / teeth) * TAU;
        const a1 = ((k + 0.45) / teeth) * TAU;
        const a2 = ((k + 0.55) / teeth) * TAU;
        const a3 = ((k + 1.0) / teeth) * TAU;
        ctx.lineTo(Math.cos(a0) * (gr - 10), Math.sin(a0) * (gr - 10));
        ctx.lineTo(Math.cos(a1) * (gr + 8), Math.sin(a1) * (gr + 8));
        ctx.lineTo(Math.cos(a2) * (gr + 8), Math.sin(a2) * (gr + 8));
        ctx.lineTo(Math.cos(a3) * (gr - 10), Math.sin(a3) * (gr - 10));
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      for (let sp = 0; sp < 6; sp++) {
        const sa = (sp / 6) * TAU;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(sa) * (gr - 14), Math.sin(sa) * (gr - 14));
        ctx.stroke();
      }
      ctx.fillStyle = pal.intHeart;
      ctx.beginPath();
      ctx.arc(0, 0, 19, 0, TAU);
      ctx.fill();
      ctx.fillStyle = pal.intBg;
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    // 2. Central 12-Blade Mechanical Iris Heart (`#FF2E55` Crimson × Bone/Ink × Gold Ring)!
    ctx.save();
    ctx.translate(cx, cy);

    ctx.strokeStyle = pal.intLaser;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(0, 0, heartR + 10, 0, TAU);
    ctx.stroke();

    ctx.strokeStyle = pal.intHeart;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, heartR - 4, 0, TAU);
    ctx.stroke();

    const apertureOpen = 0.26 + 0.18 * Math.sin(t * 20.2) + kick * 0.14;
    const innerR = heartR * apertureOpen;

    for (let i = 0; i < 12; i++) {
      const a0 = spin + (i / 12) * TAU;
      const a1 = spin + ((i + 0.92) / 12) * TAU;
      const p0x = Math.cos(a0) * (heartR * 0.91);
      const p0y = Math.sin(a0) * (heartR * 0.91);
      const p1x = Math.cos(a1) * (heartR * 0.77);
      const p1y = Math.sin(a1) * (heartR * 0.77);
      const p2x = Math.cos(a0 + 0.56) * innerR;
      const p2y = Math.sin(a0 + 0.56) * innerR;

      ctx.beginPath();
      ctx.moveTo(p0x, p0y);
      ctx.lineTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.closePath();

      if (i % 2 === 0) {
        ctx.fillStyle = pal.intHeart;
        ctx.fill();
        ctx.strokeStyle = pal.intBladeAlt;
        ctx.lineWidth = 2.6;
        ctx.stroke();
      } else {
        ctx.fillStyle = pal.intCard;
        ctx.fill();
        ctx.strokeStyle = pal.intGear;
        ctx.lineWidth = 2.4;
        ctx.stroke();
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let s = 0.2; s <= 0.8; s += 0.15) {
          ctx.moveTo(lerp(p0x, p2x, s), lerp(p0y, p2y, s));
          ctx.lineTo(lerp(p1x, p2x, s), lerp(p1y, p2y, s));
        }
        ctx.stroke();
      }
    }

    // Glowing Heart Spark Core inside the 12-blade aperture!
    core.drawSparkHead(ctx, 0, 0, t, 2.5 + kick * 0.9, 1.0, {
      fg: '#FBBF24',
      bg: '#FF2E55'
    });
    ctx.restore();

    // 3. Leader-Line Anatomical Valve Tags (`pdoom` `shoggoth` margin tags homage!)
    ctx.lineWidth = 1.8;
    for (let v = 0; v < VALVE_LABELS.length; v++) {
      const isLeft = v < 3;
      const idx = v % 3;
      const tagX = isLeft ? 92 : W - 362;
      const tagY = 175 + idx * 142;
      const targetAng = (v / 6) * TAU + spin * 0.25;
      const vx = cx + Math.cos(targetAng) * (heartR * 0.65);
      const vy = cy + Math.sin(targetAng) * (heartR * 0.65);

      ctx.strokeStyle = pal.intLaser;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(isLeft ? tagX + 270 : tagX, tagY + 15);
      ctx.stroke();

      ctx.fillStyle = '#08090C';
      ctx.fillRect(tagX, tagY, 270, 30);
      ctx.strokeStyle = v % 2 === 0 ? pal.intLaser : '#FBBF24';
      ctx.strokeRect(tagX, tagY, 270, 30);
      ctx.fillStyle = v % 2 === 0 ? '#FAF8F5' : '#FBBF24';
      ctx.font = MONO(700, 13);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(VALVE_LABELS[v], tagX + 10, tagY + 15);
    }

    ctx.restore();
    ctx.restore();
  }

  // Nonlinear Anatomical Vocal Collage (`！` @ `w[11]` + `胸 の 殻 を 透 か し て` @ `w[12..19]`)
  // Counter-changes seamlessly across the hard-edged X-Ray scan boundary!
  function drawL15AnatomyVocalTokens(ctx, core, cue, t, pal, kick, isXrayInterior) {
    const allWords = (cue && cue.words) ? cue.words : [];
    if (allWords.length < 20) return;
    const { TAU, clamp, ease, pulse } = core;

    // 1. Opening Shatter Alert Stamp `！` (`words[11]`, `83.700s`) — tilted upper-left seal!
    const wBang = allWords[11];
    if (wBang && t >= wBang.start && t < 84.35) {
      const dtB = t - wBang.start;
      const uB = ease.outExpo(clamp(dtB / 0.12, 0, 1));
      ctx.save();
      ctx.translate(310, 198);
      ctx.rotate(-0.21 + (1 - uB) * -0.18);
      const scB = (0.48 + 0.52 * uB) * (1 + kick * 0.08);
      ctx.scale(scB, scB);

      ctx.fillStyle = '#08090C';
      ctx.fillRect(-195 + 7, -54 + 7, 390, 108);
      ctx.fillStyle = isXrayInterior ? '#FF2E55' : '#FBBF24';
      ctx.fillRect(-195, -54, 390, 108);
      ctx.strokeStyle = isXrayInterior ? '#FAF8F5' : '#08090C';
      ctx.lineWidth = 4.0;
      ctx.strokeRect(-195, -54, 390, 108);
      ctx.fillStyle = isXrayInterior ? '#FAF8F5' : '#08090C';
      ctx.font = JA_SANS(900, 68);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`X-RAY${wordLabel(wBang)}`, 0, 3);
      ctx.restore();
    }

    // 2. Vertical Tategaki guide spine for `か・し・て` (`specs[5..7]`)
    const subWords = allWords.slice(12, 20);
    if (subWords[5] && t >= subWords[5].start) {
      ctx.save();
      ctx.strokeStyle = isXrayInterior ? pal.intLaser : pal.extAccent;
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(L15_ANATOMY_SPECS[5].x, L15_ANATOMY_SPECS[5].y - 50);
      ctx.lineTo(L15_ANATOMY_SPECS[6].x, L15_ANATOMY_SPECS[6].y);
      ctx.lineTo(L15_ANATOMY_SPECS[7].x, L15_ANATOMY_SPECS[7].y + 50);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Autonomous Per-Character Entities (`胸`, `の`, `殻`, `を`, `透`, `か`, `し`, `て`)
    for (let i = 0; i < subWords.length; i++) {
      const w = subWords[i];
      const sp = L15_ANATOMY_SPECS[i];
      const txt = wordLabel(w);

      if (t < w.start) {
        // V6.2: Removed floating pre-aim square reticles
        continue;
      }

      const dt = t - w.start;
      const slamFn = (window.CortexV6 && window.CortexV6.aeSlam) ? window.CortexV6.aeSlam : ease.outExpo;
      const slamU = slamFn(clamp(dt / 0.14, 0, 1));
      const hitP = pulse(t, w.start, 0.12);
      const px = sp.x + (1 - slamU) * sp.dx;
      const py = sp.y + (1 - slamU) * sp.dy - hitP * 10;
      const rot = sp.rot + (1 - slamU) * (i % 2 === 0 ? -0.18 : 0.18);
      const sc = (0.48 + 0.52 * slamU) * (1 + hitP * 0.16 + kick * 0.04);

      const v6 = window.CortexV6;
      if (v6 && typeof v6.drawEditorialStamp === 'function') {
        const kind = sp.kind === 'circleSeal' ? 'seal' : (sp.kind === 'heroCenter' ? 'bare' : (hitP > 0.25 ? 'accent' : (sp.sz > 140 ? 'frosted' : 'mono')));
        v6.drawEditorialStamp(ctx, txt, px, py, sp.sz, rot, {
          kind,
          serif: !!sp.serif,
          isPaper: false,
          isHot: hitP > 0.25 || sp.kind === 'heroCenter',
          scX: sc,
          scY: sc
        });
        continue;
      }

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      ctx.scale(sc, sc);

      if (dt < 0.22) {
        const rr = sp.sz * (0.58 + slamU * 0.42);
        ctx.strokeStyle = isXrayInterior ? '#FBBF24' : '#FF2E55';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * TAU + 0.3;
          ctx.moveTo(Math.cos(a) * rr * 0.7, Math.sin(a) * rr * 0.7);
          ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.stroke();
      }

      ctx.font = sp.serif ? JA_SERIF(900, sp.sz) : JA_SANS(900, sp.sz);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (sp.kind === 'circleSeal') {
        const rad = sp.sz * 0.68;
        ctx.fillStyle = isXrayInterior ? '#FBBF24' : pal.extAccent;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = isXrayInterior ? '#08090C' : '#FAF8F5';
        ctx.lineWidth = 3.2;
        ctx.stroke();
        ctx.fillStyle = isXrayInterior ? '#08090C' : '#FAF8F5';
        ctx.fillText(txt, 0, sp.sz * 0.04);
      } else if (sp.kind === 'heroCenter') {
        // Colossal `透` (`268px`) cleaved right across the X-Ray boundary!
        ctx.lineJoin = 'miter';
        ctx.miterLimit = 3;
        if (isXrayInterior) {
          ctx.strokeStyle = '#08090C';
          ctx.lineWidth = 22;
          ctx.strokeText(txt, 0, 10);
          ctx.strokeStyle = '#FBBF24';
          ctx.lineWidth = 8;
          ctx.strokeText(txt, 0, 10);
          ctx.fillStyle = '#FF2E55';
          ctx.fillText(txt, 0, 10);
        } else {
          ctx.strokeStyle = pal.extBg;
          ctx.lineWidth = 20;
          ctx.strokeText(txt, 0, 10);
          ctx.fillStyle = pal.extAccent;
          ctx.fillText(txt, 0, 10);
        }
      } else {
        const gw = Math.max(sp.sz * 0.80, ctx.measureText(txt).width);
        const bw = gw + (sp.sz > 140 ? 34 : 22);
        const bh = sp.sz * 0.94 + (sp.sz > 140 ? 16 : 12);

        ctx.fillStyle = '#08090C';
        ctx.fillRect(-bw * 0.5 + 7, -bh * 0.5 + 7, bw, bh);

        if (isXrayInterior) {
          const boxCol = sp.sz > 140 ? '#FF2E55' : (i % 2 === 0 ? '#38BDF8' : '#FBBF24');
          const txtCol = (boxCol === '#FF2E55') ? '#FAF8F5' : '#08090C';
          ctx.fillStyle = boxCol;
          ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
          ctx.strokeStyle = '#FAF8F5';
          ctx.lineWidth = sp.sz > 140 ? 4.0 : 2.8;
          ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
          ctx.fillStyle = txtCol;
          ctx.fillText(txt, 0, sp.sz * 0.04);
        } else {
          const boxCol = sp.sz > 140 ? pal.extInk : pal.extCard;
          const txtCol = sp.sz > 140 ? pal.extBg : pal.extInk;
          ctx.fillStyle = boxCol;
          ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
          ctx.strokeStyle = pal.extAccent;
          ctx.lineWidth = sp.sz > 140 ? 3.8 : 2.6;
          ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
          ctx.fillStyle = txtCol;
          ctx.fillText(txt, 0, sp.sz * 0.04);
        }
      }
      ctx.restore();
    }
  }

  function buildXrayClipPath(ctx, core, subCut, t, kick) {
    const { W, H, lerp, prog, ease } = core;
    ctx.beginPath();
    if (subCut === 0) {
      const u = prog(t, 83.55, 84.06, ease.inOutCubic);
      const bandW = 560 + kick * 65;
      const bx = lerp(-80, W - bandW + 80, u);
      ctx.rect(bx, 38, bandW, H - 102);
    } else if (subCut === 1) {
      const u = prog(t, 84.06, 84.58, ease.inOutCubic);
      const cxBand = lerp(260, W - 260, u);
      const bw = 590;
      const skew = 260;
      ctx.moveTo(cxBand - bw * 0.5 + skew, 38);
      ctx.lineTo(cxBand + bw * 0.5 + skew, 38);
      ctx.lineTo(cxBand + bw * 0.5 - skew, H - 64);
      ctx.lineTo(cxBand - bw * 0.5 - skew, H - 64);
      ctx.closePath();
    } else if (subCut === 2) {
      const u = prog(t, 84.58, 85.10, ease.outExpo);
      const vw = lerp(240, 700, u);
      const hh = lerp(170, 400, u);
      ctx.rect(W * 0.5 - vw * 0.5, 38, vw, H - 102);
      ctx.rect(48, H * 0.47 - hh * 0.5, W - 96, hh);
    } else if (subCut === 3) {
      const u = prog(t, 85.10, 85.62, ease.outExpo);
      const r = lerp(330, 665, u) + kick * 36;
      ctx.arc(W * 0.5, H * 0.47, r, 0, Math.PI * 2);
    } else {
      const u = prog(t, 85.62, 86.13, ease.outExpo);
      const wOpen = lerp(540, W - 96, u);
      ctx.rect(W * 0.5 - wOpen * 0.5, 38, wOpen, H - 102);
    }
  }

  window.registerCortexPlate('P24_burin_shutter_anatomy', {
    render(ctx, arg2, arg3) {
      const core = (arg3 && arg3.W) ? arg3 : window.CortexPDoomCore;
      const st = (typeof arg2 === 'number') ? { ...(arg3 || {}), t: arg2 } : (arg2 || { t: 83.55 });
      const { W, H, lerp, prog, ease, beatAt } = core;

      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const cue = core.cueById('L15_BREAK_BLACKBOX');
      const beat = beatAt(t);

      // 5 Ultra-Fast Sub-Cuts (`83.55s – 86.13s`, avg `0.51s`/cut!)
      let subCut = 0;
      if (t < 84.06) subCut = 0;
      else if (t < 84.58) subCut = 1;
      else if (t < 85.10) subCut = 2;
      else if (t < 85.62) subCut = 3;
      else subCut = 4;

      const useDarkExt = (subCut === 1 || subCut === 3);
      const pal = useDarkExt ? MODE_DARK_EXT : MODE_BONE_EXT;
      const bg = pal.extBg;
      const fg = useDarkExt ? '#FF2E55' : '#08090C';

      const camFn = (c) => {
        if (subCut === 0) {
          const u = prog(t, 83.55, 84.06, ease.outExpo);
          const z = lerp(1.22, 1.0, u) + kick * 0.05;
          c.translate(W * 0.5, H * 0.47);
          c.scale(z, z);
          c.translate(-W * 0.5, -H * 0.47);
        } else if (subCut === 1) {
          const u = prog(t, 84.06, 84.58, ease.outExpo);
          const z = lerp(1.08, 1.32, u) + kick * 0.07;
          c.translate(W * 0.5, H * 0.47);
          c.rotate(lerp(-0.24, -0.10, u));
          c.scale(z, z);
          c.translate(-W * 0.5, -H * 0.47);
        } else if (subCut === 2) {
          const u = prog(t, 84.58, 85.10, ease.outExpo);
          const z = lerp(0.92, 1.16, u) + kick * 0.06;
          c.translate(W * 0.5, H * 0.47);
          c.rotate(lerp(0.18, 0.0, u));
          c.scale(z, z);
          c.translate(-W * 0.5, -H * 0.47);
        } else if (subCut === 3) {
          const u = prog(t, 85.10, 85.62, ease.outExpo);
          const z = lerp(1.45, 2.08, u) + kick * 0.10;
          c.translate(W * 0.5, H * 0.47);
          c.rotate(lerp(-0.16, 0.08, u));
          c.scale(z, z);
          c.translate(-W * 0.5, -H * 0.47);
        } else {
          const u = prog(t, 85.62, 86.13, ease.inOutExpo);
          const z = lerp(1.05, 1.65, u) + kick * 0.08;
          c.translate(W * 0.5, H * 0.47);
          c.scale(z, z);
          c.translate(-W * 0.5, -H * 0.47);
        }
      };

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      // V6.2: SIGNATURE 2D↔3D X-RAY APERTURE COMPOSITE (`胸の殻を透かして`)!
      // Outer Hero Layer = Full-bleed living 2D anime portrait (`C14`/`C15`) + engraved millimeter scan grid.
      // Inner X-Ray Window = Real Blender 5.2 3D Faceted Ruby-Jewel Mechanical Heart (`B3D_02_rotor`) revealed
      // through P24's kinetic sweeping/circular X-ray aperture with glowing laser scan rim & counter-changed kanji!
      const v6 = window.CortexV6;
      const has3D = v6 && typeof v6.draw3DClipFrame === 'function';
      let drew3D = false;

      // 1. OUTER 2D ANIME LAYER (V7: SOLE pre-finale `C12` showcase, strict <= 1.80s `83.55-85.35s`, ZERO C14/C15 reuse!)
      const extPlateKey = 'C12';
      const cutStarts = [83.55, 84.06, 84.58, 85.10, 85.62];
      const cutEnds   = [84.06, 84.58, 85.10, 85.62, 86.13];
      const subU = prog(t, cutStarts[subCut], cutEnds[subCut], ease.outCubic);
      if (t < 85.35 && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage(extPlateKey)) {
        v6.drawLivingFullBleed(ctx, extPlateKey, {
          t,
          u: subU,
          kick,
          zoom0: subCut % 2 === 0 ? 1.12 : 1.24,
          zoom1: subCut % 2 === 0 ? 1.24 : 1.10,
          panX0: subCut % 2 === 0 ? -42 : 46,
          panX1: subCut % 2 === 0 ? 38 : -36,
          panY0: 12,
          panY1: -16,
          rot0: subCut % 2 === 0 ? -0.022 : 0.020,
          rot1: subCut % 2 === 0 ? 0.012 : -0.014,
          fx: 0.50,
          fy: 0.36,
          scrim: 0.34,
          isPaper: false
        });
      } else {
        drawExteriorCarapace(ctx, core, t, pal, kick, camFn);
      }

      // Exterior 2D Japanese kanji (`胸の殻を透かして`) on 2D anime portrait layer
      drawL15AnatomyVocalTokens(ctx, core, cue, t, MODE_DARK_EXT, kick, false);

      // 2. INNER 3D X-RAY APERTURE: Peels open the 2D chest carapace to expose real 3D Ruby Heart (`B3D_02_rotor`)!
      ctx.save();
      buildXrayClipPath(ctx, core, subCut, t, kick);
      ctx.clip();
      drew3D = has3D && v6.draw3DClipFrame(ctx, 'B3D_02_rotor', t, {
        kick,
        kickZoom: 0.024,
        scrim: 0.18,
        isPaper: false,
        tintStrength: 0.09
      });
      if (!drew3D) {
        drawInteriorMechanicalHeart(ctx, core, t, pal, kick, camFn);
      } else if (typeof v6.draw2D3DAtmosphereBridge === 'function') {
        v6.draw2D3DAtmosphereBridge(ctx, {
          t,
          kick,
          vpX: W * 0.5,
          vpY: H * 0.47,
          speedLines: subCut >= 3 ? 20 : 0,
          speedAlpha: 0.24,
          motes: 18,
          moteAlpha: 0.85,
          accent: '#EE738A'
        });
      }
      // Interior counter-changed kanji locked cleanly inside the 3D X-ray scan aperture!
      drawL15AnatomyVocalTokens(ctx, core, cue, t, MODE_DARK_EXT, kick, true);
      ctx.restore();

      // 3. RAZOR-CRISP LUMINOUS X-RAY LASER SCAN RIM welding the 2D exterior & 3D interior seamlessly!
      const prevRaw = ctx.__v6RawColor;
      ctx.save();
      ctx.__v6RawColor = true;
      buildXrayClipPath(ctx, core, subCut, t, kick);
      ctx.shadowColor = '#EE738A';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#EE738A';
      ctx.lineWidth = 4.2 + kick * 1.8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#FAF8F5';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.__v6RawColor = prevRaw;
      ctx.restore();

      // In-World `TEMP: 35.1°C` Telemetry (without boxy CAD border rectangle)
      ctx.save();
      const tempVal = lerp(35.1, 35.5, prog(t, 83.55, 86.13));
      ctx.fillStyle = '#08090C';
      ctx.fillRect(68, 48, 528, 32);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(68, 48, 528, 32);
      ctx.fillStyle = '#38BDF8';
      ctx.font = MONO(700, 14.5);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `XRAY_SHUTTER // 12_BLADE_HEART // TEMP: ${tempVal.toFixed(1)}°C`,
        80, 64
      );

      ctx.fillStyle = '#FF2E55';
      ctx.fillRect(W - 426, 48, 358, 32);
      ctx.fillStyle = '#FAF8F5';
      ctx.textAlign = 'right';
      ctx.fillText(
        `CUT 0${subCut + 1}/05 · BEAT ${beat.toFixed(1)} · SHELL_XRAY`,
        W - 80, 64
      );
      ctx.restore();

      ctx.restore();
      return {
        bg: drew3D ? '#0B0F17' : bg,
        fg: drew3D ? '#FF2E55' : fg,
        duotone: { bg: drew3D ? '#0B0F17' : bg, fg: drew3D ? '#FF2E55' : fg },
        isPaper: drew3D ? false : pal.isPaper,
        bloom: 0.26 + kick * 0.12,
        ca: 0,
        flash: 0,
        shake: 0
      };
    }
  });
})();
