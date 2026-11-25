// ============================================================================
// Plate 19 — `P19_tikz_compass_genesis.js` (`3.51s – 7.36s`)
// Cue: `L01_BOOT_SHELL` (`... boot ing cor tex shell .`)
// Treatise Palette (#52 Multi-Layer Contrast):
//   - Deep Obsidian `#08090C` + Blueprint Slate Card `#111827` + Graphite Grid `#334155` / `#64748B`
//   - Primary Ice-Cyan `#38BDF8` TikZ Arcs & PCB Bus + Bone-White `#FAF8F5` Machined Compasses
//   - Focal Accents: Amber Gold `#FBBF24` (`r=0.10mm` / `-log p`) + Crimson `#FF2E55` & Ember `#FF8A3D` Sparks
// Autonomous Per-Token Choreography (#53):
//   - Zero flat horizontal lines: each token (`...`, `boot`, `ing`, `cor`, `tex`, `shell`, `.`)
//     occupies an independent orbital/diagonal coordinate, rotation (`±7°..±16°`), scale hierarchy,
//     and directional spring-slam vector at `w.start`!
// ============================================================================
(function () {
  'use strict';

  const C_BG = '#08090C';
  const C_CARD = '#111827';
  const C_GRID = '#334155';
  const C_SLATE = '#64748B';
  const C_BONE = '#FAF8F5';
  const C_CYAN = '#38BDF8';
  const C_COBALT = '#0376B8';
  const C_GOLD = '#FBBF24';
  const C_CRIMSON = '#FF2E55';
  const C_EMBER = '#FF8A3D';

  const JA_SANS = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Inter", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", sans-serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", Consolas, monospace`;

  const TIKZ_LINES = [
    '\\documentclass[tikz,treatise]{cortex}',
    '\\usetikzlibrary{calc,optics,pcb.routing}',
    '\\begin{tikzpicture}[scale=10.0, cap=rect]',
    '  \\coordinate (O) at (0.000, 0.000);',
    '  \\draw[compass,cyan] (O) circle [r=0.10mm];',
    '  \\foreach \\k in {1,...,12} {',
    '    \\draw[burin] (\\k*30:1.8) -- (\\k*30+18:4.2);',
    '  }',
    '  \\node[kernel,gold] {CORTEX\\_SHELL // 4.2C};',
    '  \\route[pcb,45deg] (L01) |- (IRIS_BUS);',
    '\\end{tikzpicture} % surprisal -> 0.00 nats'
  ];

  // Autonomous Per-Token Spatial Entities (`#53` — Nonlinear Orbital / Diagonal Collage!)
  const TOKEN_SPECS = [
    { x: 205,  y: 635, sz: 92,  rot: -0.22, dx: -160, dy: 90,   style: 'pill',    accent: C_GOLD    }, // 0: ...
    { x: 395,  y: 795, sz: 158, rot: -0.13, dx: -190, dy: 140,  style: 'stamp',   accent: C_CYAN    }, // 1: boot
    { x: 645,  y: 665, sz: 96,  rot:  0.19, dx:  0,   dy: -160, style: 'tag',     accent: C_EMBER   }, // 2: ing (compact shoulder tag!)
    { x: 1095, y: 785, sz: 158, rot: -0.11, dx:  180, dy: 130,  style: 'outline', accent: C_CYAN    }, // 3: cor
    { x: 1335, y: 595, sz: 156, rot:  0.14, dx:  210, dy: -120, style: 'stamp',   accent: C_CRIMSON }, // 4: tex
    { x: 1545, y: 825, sz: 174, rot: -0.09, dx:  240, dy: 150,  style: 'hero',    accent: C_GOLD    }, // 5: shell
    { x: 1795, y: 675, sz: 132, rot:  0.26, dx:  140, dy: -140, style: 'seal',    accent: C_CRIMSON }  // 6: .
  ];

  function drawBurinRect(ctx, x, y, w, h, angle, spacing, lw, col) {
    if (w <= 1 || h <= 1) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.translate(x + w * 0.5, y + h * 0.5);
    ctx.rotate(angle);
    const diag = Math.hypot(w, h) * 0.5 + 8;
    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    for (let u = -diag; u <= diag; u += spacing) {
      ctx.moveTo(u, -diag);
      ctx.lineTo(u, diag);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawAnnulusHatch(ctx, cx, cy, r0, r1, a0, a1, count, lw, col, twist = 0) {
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const u = i / Math.max(1, count);
      const ang = a0 + u * (a1 - a0);
      ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0);
      ctx.lineTo(cx + Math.cos(ang + twist) * r1, cy + Math.sin(ang + twist) * r1);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawSwissConstructionSheet() {
    // V8: Disabled engineering coordinate grid, + registration crosshairs, vernier ticks & outer CAD rect
    return;
  }

  function drawDraftingCompass(ctx, core, pivotX, pivotY, radius, aStart, aCurr, arcCol, legCol, sparkCol, bgCol, t, kick) {
    const nibX = pivotX + Math.cos(aCurr) * radius;
    const nibY = pivotY + Math.sin(aCurr) * radius;
    const hingeX = (pivotX + nibX) * 0.5 - (nibY - pivotY) * 0.42;
    const hingeY = (pivotY + nibY) * 0.5 + (nibX - pivotX) * 0.42;

    ctx.save();
    // Delicate translucent optical orbit ring (zero dashed construction wireframes)
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.22)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Active luminous construction arc
    ctx.strokeStyle = arcCol;
    ctx.lineWidth = 3.6 + kick * 1.8;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, radius, aStart, aCurr, aCurr < aStart);
    ctx.stroke();

    // Needle pivot target in amber gold
    ctx.fillStyle = bgCol;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = C_GOLD;
    ctx.lineWidth = 2.6;
    ctx.stroke();
    ctx.fillStyle = C_GOLD;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Twin machined bone-white compass legs with dark slot groove
    ctx.strokeStyle = legCol;
    ctx.lineWidth = 5.6;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(hingeX, hingeY);
    ctx.lineTo(nibX, nibY);
    ctx.stroke();

    ctx.lineWidth = 2.0;
    ctx.strokeStyle = bgCol;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(hingeX, hingeY);
    ctx.lineTo(nibX, nibY);
    ctx.stroke();

    // Crown wheel at hinge
    ctx.fillStyle = C_GOLD;
    ctx.beginPath();
    ctx.arc(hingeX, hingeY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bgCol;
    ctx.beginPath();
    ctx.arc(hingeX, hingeY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Blazing contrasting crimson/ember arc-weld spark at nib!
    core.drawSparkHead(ctx, nibX, nibY, t, 1.55 + kick * 0.6, 1.0, { fg: sparkCol, bg: C_GOLD });
    ctx.restore();
    return { x: nibX, y: nibY };
  }

  function drawTikzIrisKernel(ctx, core, cx, cy, R, blades, buildU, rot, isPaperMode, kick, anomalyMode) {
    const ringCol = isPaperMode ? C_BG : C_CYAN;
    const boneCol = isPaperMode ? C_BG : C_BONE;
    const hatchCol = isPaperMode ? C_COBALT : C_SLATE;
    const baseFill = isPaperMode ? C_BONE : C_CARD;
    const accentCol = anomalyMode ? C_CRIMSON : C_CYAN;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // 1. Outer degree protractor ring
    ctx.strokeStyle = ringCol;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2 * buildU);
    ctx.stroke();

    const tickN = 72;
    const maxTicks = Math.floor(tickN * buildU);
    ctx.strokeStyle = boneCol;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < maxTicks; i++) {
      const a = (i / tickN) * Math.PI * 2;
      const rIn = i % 6 === 0 ? R - 22 : i % 2 === 0 ? R - 12 : R - 6;
      ctx.moveTo(Math.cos(a) * rIn, Math.sin(a) * rIn);
      ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
    }
    ctx.stroke();

    // 2. Graphite / Cobalt burin-hatched outer stator annulus
    if (buildU > 0.25) {
      drawAnnulusHatch(ctx, 0, 0, R * 0.78, R * 0.90, 0, Math.PI * 2 * Math.min(1, (buildU - 0.2) * 1.3), 108, 1.5, hatchCol, 0.08);
      ctx.strokeStyle = accentCol;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.78, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. 12 Interlocking TikZ Shutter Blades with layered color contrast
    const activeBlades = Math.max(1, Math.ceil(blades * buildU));
    const innerAperture = R * (0.23 + kick * 0.05);
    for (let i = 0; i < activeBlades; i++) {
      const baseA = (i / blades) * Math.PI * 2;
      const isGlitchBlade = anomalyMode && (i === 2 || i === 5);
      const glitchJut = isGlitchBlade ? 1.28 : 1.0;
      const a0 = baseA;
      const a1 = baseA + (Math.PI * 2) / blades * 0.88;
      const p0x = Math.cos(a0) * R * 0.76 * glitchJut;
      const p0y = Math.sin(a0) * R * 0.76 * glitchJut;
      const p1x = Math.cos(a1) * R * 0.64;
      const p1y = Math.sin(a1) * R * 0.64;
      const p2x = Math.cos(a0 + 0.48) * innerAperture;
      const p2y = Math.sin(a0 + 0.48) * innerAperture;

      ctx.beginPath();
      ctx.moveTo(p0x, p0y);
      ctx.lineTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.closePath();

      if (isGlitchBlade) {
        ctx.fillStyle = C_CRIMSON;
        ctx.fill();
        ctx.strokeStyle = C_BONE;
        ctx.lineWidth = 2.6;
        ctx.stroke();
      } else if (i % 3 === 0) {
        ctx.fillStyle = accentCol;
        ctx.fill();
        ctx.strokeStyle = isPaperMode ? C_BONE : C_BG;
        ctx.lineWidth = 2.4;
        ctx.stroke();
      } else if (i % 3 === 1) {
        ctx.fillStyle = boneCol;
        ctx.fill();
        ctx.strokeStyle = isPaperMode ? C_BONE : C_BG;
        ctx.lineWidth = 2.4;
        ctx.stroke();
      } else {
        ctx.fillStyle = baseFill;
        ctx.fill();
        ctx.strokeStyle = accentCol;
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.strokeStyle = hatchCol;
        ctx.beginPath();
        for (let s = 0.2; s <= 0.82; s += 0.15) {
          ctx.moveTo(core.lerp(p0x, p2x, s), core.lerp(p0y, p2y, s));
          ctx.lineTo(core.lerp(p1x, p2x, s), core.lerp(p1y, p2y, s));
        }
        ctx.stroke();
      }

      // Gold pivot pin on each blade
      ctx.fillStyle = C_GOLD;
      ctx.beginPath();
      ctx.arc(p0x * 0.82, p0y * 0.82, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Inner aperture ring & crimson/gold precision pupil dot (`r = 0.10mm`)
    ctx.strokeStyle = C_GOLD;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(0, 0, innerAperture, 0, Math.PI * 2);
    ctx.stroke();

    const dotR = Math.max(7, R * 0.048);
    ctx.fillStyle = C_CRIMSON;
    ctx.beginPath();
    ctx.arc(0, 0, dotR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C_BONE;
    ctx.beginPath();
    ctx.arc(0, 0, dotR * 0.40, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawPcbTraceNetwork(ctx, core, W, H, progressU, isPaperMode, t, kick) {
    if (progressU <= 0.01) return;
    ctx.save();
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';

    const cx = W * 0.5;
    const cy = H * 0.46;
    const lanes = 28;

    for (let i = 0; i < lanes; i++) {
      const side = i < 14 ? -1 : 1;
      const idx = i % 14;
      const yBase = 118 + idx * 58;
      const xEdge = side < 0 ? 72 : W - 72;
      const elbow1X = cx + side * (560 - idx * 24);
      const dyDiag = (cy + (idx - 6.5) * 26) - yBase;
      const elbow2X = elbow1X - side * Math.abs(dyDiag);
      const yTarget = cy + (idx - 6.5) * 26;
      const xTarget = cx + side * (165 + (idx % 3) * 24);

      const pts = [
        { x: xEdge, y: yBase },
        { x: elbow1X, y: yBase },
        { x: elbow2X, y: yTarget },
        { x: xTarget, y: yTarget }
      ];
      const L = core.polylineLengths(pts);
      const total = L[L.length - 1];
      const drawLen = total * core.clamp(progressU * 1.25 - idx * 0.025, 0, 1);
      if (drawLen <= 2) continue;

      const isHotTrace = idx % 4 === 0;
      const isMidTrace = idx % 2 === 0;
      ctx.strokeStyle = isHotTrace
        ? C_GOLD
        : (isMidTrace ? (isPaperMode ? C_COBALT : C_CYAN) : C_SLATE);
      ctx.lineWidth = isHotTrace ? 3.4 + kick * 1.4 : (isMidTrace ? 2.1 : 1.4);
      const head = core.drawPartialPolyline(ctx, pts, L, drawLen);

      ctx.fillStyle = isHotTrace ? C_CRIMSON : C_CYAN;
      ctx.beginPath();
      ctx.arc(xEdge, yBase, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isPaperMode ? C_BONE : C_BG;
      ctx.beginPath();
      ctx.arc(xEdge, yBase, 2.2, 0, Math.PI * 2);
      ctx.fill();

      if (head && progressU < 0.96 && isHotTrace) {
        core.drawSparkHead(ctx, head.x, head.y, t + i * 0.1, 0.95, 1.0, { fg: C_EMBER, bg: C_BONE });
      }
    }
    ctx.restore();
  }

  // Autonomous Per-Token Vocal Renderer (`#52` Contrast Sparks + `#53` Nonlinear Spatial Entities!)
  function drawL01VocalTokens(ctx, core, cue, t, isPaperMode, pcbMode, kick) {
    const words = (cue && cue.words) ? cue.words : [];
    if (!words.length) return;
    const W = core.W;

    ctx.save();
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const sp = TOKEN_SPECS[Math.min(i, TOKEN_SPECS.length - 1)];

      // Orbital layout on Cut 2 vs Diagonal Scattered Collage on other cuts (NEVER a horizontal row!)
      let tx = sp.x;
      let ty = sp.y;
      let baseRot = sp.rot;
      if (!pcbMode && i <= 6 && t >= 4.75 && t < 5.37) {
        const orbAtoms = [
          [210,  430, -0.22],
          [420,  220, -0.14],
          [695,  175,  0.16],
          [1160, 210, -0.11],
          [1480, 310,  0.15],
          [1560, 650, -0.12],
          [1740, 480,  0.22]
        ];
        tx = orbAtoms[i][0];
        ty = orbAtoms[i][1];
        baseRot = orbAtoms[i][2];
      }

      if (t < w.start) {
        // V6.2: Removed floating square pre-aim reticles for clean 3D optics
        continue;
      }

      const dt = t - w.start;
      const slamFn = (window.CortexV6 && window.CortexV6.aeSlam) ? window.CortexV6.aeSlam : core.ease.outExpo;
      const enterU = slamFn(core.clamp(dt / 0.16, 0, 1));
      const hitPulse = core.pulse(t, w.start, 0.14);
      const isSinging = t <= (w.end || w.start + 0.35) + 0.10;
      const driftY = Math.sin(t * 3.6 + i * 1.7) * 3;
      const driftRot = hitPulse * (i % 2 === 0 ? -0.05 : 0.05);

      const curX = tx + sp.dx * (1 - enterU);
      const curY = ty + sp.dy * (1 - enterU) + driftY;
      const scale = (0.45 + 0.55 * core.clamp(enterU, 0, 1.08)) * (1 + hitPulse * 0.14 + kick * 0.04);
      const sz = sp.sz;

      const v6 = window.CortexV6;
      if (v6 && typeof v6.drawEditorialStamp === 'function') {
        const kind = sp.style === 'seal' ? 'seal' : ((sp.style === 'stamp' || sp.style === 'hero' || isSinging) ? (isSinging ? 'accent' : 'frosted') : 'mono');
        v6.drawEditorialStamp(ctx, w.w, curX, curY, sz, baseRot + driftRot, {
          kind,
          isPaper: isPaperMode,
          isHot: isSinging,
          scX: scale,
          scY: scale
        });
        continue;
      }

      ctx.save();
      ctx.translate(curX, curY);
      ctx.rotate(baseRot + driftRot);
      ctx.scale(scale, scale);

      ctx.font = JA_SANS(900, sz);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const tw = Math.max(52, ctx.measureText(w.w).width);
      const boxW = tw + 36;
      const boxH = sz * 0.94;

      const hotCol = isSinging ? C_CRIMSON : sp.accent;
      const cardGround = isPaperMode ? C_BONE : C_CARD;
      const textMain = isPaperMode ? C_BG : C_BONE;

      if (sp.style === 'seal') {
        // Circular crimson/gold die-cut seal for terminal `.`!
        const rad = Math.max(boxW, boxH) * 0.52;
        ctx.fillStyle = C_CRIMSON;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = C_GOLD;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = C_BONE;
        ctx.fillText(w.w, 0, -sz * 0.08);
      } else if (sp.style === 'stamp' || sp.style === 'hero' || isSinging) {
        // Hard-edged offset bevel shadow + contrasting die-cut stamp block
        ctx.fillStyle = isPaperMode ? C_BG : C_GOLD;
        ctx.fillRect(-boxW * 0.5 + 8, -boxH * 0.5 + 8, boxW, boxH);

        ctx.fillStyle = hotCol;
        ctx.fillRect(-boxW * 0.5, -boxH * 0.5, boxW, boxH);
        ctx.strokeStyle = C_BONE;
        ctx.lineWidth = 3.2;
        ctx.strokeRect(-boxW * 0.5 + 5, -boxH * 0.5 + 5, boxW - 10, boxH - 10);

        if (pcbMode) {
          ctx.fillStyle = C_GOLD;
          const pins = Math.max(3, Math.floor(boxW / 26));
          for (let p = 0; p < pins; p++) {
            const px = -boxW * 0.42 + (p / Math.max(1, pins - 1)) * boxW * 0.84;
            ctx.fillRect(px - 3, -boxH * 0.5 - 10, 6, 10);
            ctx.fillRect(px - 3, boxH * 0.5, 6, 10);
          }
        }

        ctx.fillStyle = hotCol === C_GOLD ? C_BG : C_BONE;
        ctx.fillText(w.w, 0, sz * 0.04);
      } else {
        // Architectural CAD block with colored bevel & crisp bone/ink typography
        ctx.fillStyle = sp.accent;
        ctx.fillRect(-boxW * 0.5 + 7, -boxH * 0.5 + 7, boxW, boxH);
        ctx.fillStyle = cardGround;
        ctx.fillRect(-boxW * 0.5, -boxH * 0.5, boxW, boxH);
        ctx.strokeStyle = sp.accent;
        ctx.lineWidth = 3.4;
        ctx.strokeRect(-boxW * 0.5, -boxH * 0.5, boxW, boxH);
        ctx.fillStyle = textMain;
        ctx.fillText(w.w, 0, sz * 0.04);
      }

      // Micro telemetry tag in amber gold
      ctx.fillStyle = C_BG;
      ctx.fillRect(-boxW * 0.5, -boxH * 0.5 - 22, 108, 19);
      ctx.fillStyle = C_GOLD;
      ctx.font = MONO(700, 12);
      ctx.textAlign = 'left';
      ctx.fillText(`T0${i}//${w.start.toFixed(2)}s`, -boxW * 0.5 + 5, -boxH * 0.5 - 12);
      ctx.restore();

      // Multi-color spark splinters on vocal onset (`dt < 0.24s`)
      if (dt < 0.24) {
        const burstR = 26 + dt * 380;
        for (let r = 0; r < 8; r++) {
          const a = (r / 8) * Math.PI * 2 + i * 0.45;
          ctx.strokeStyle = r % 2 === 0 ? C_CRIMSON : C_GOLD;
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(curX + Math.cos(a) * (burstR * 0.45), curY + Math.sin(a) * (burstR * 0.45));
          ctx.lineTo(curX + Math.cos(a) * burstR, curY + Math.sin(a) * burstR);
          ctx.stroke();
        }
        core.drawSparkHead(ctx, curX + boxW * 0.42, curY - boxH * 0.38, t, 1.55, 1.0, { fg: C_EMBER, bg: C_BONE });
      }
    }
    ctx.restore();
  }

  window.registerCortexPlate('P19_tikz_compass_genesis', {
    render(ctx, arg2, arg3) {
      const core = (arg3 && arg3.W) ? arg3 : window.CortexPDoomCore;
      const st = (typeof arg2 === 'number') ? { ...(arg3 || {}), t: arg2 } : (arg2 || { t: 3.51 });
      const { W, H, clamp, lerp, prog, ease, beatAt, frameIdx } = core;

      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const snare = st.snareSnap ?? st.snareEnv ?? st.snare ?? 0;
      const cue = core.cueById('L01_BOOT_SHELL');
      const beat = beatAt(t);
      const fIdx = frameIdx(t);

      // 6 High-Velocity Sub-Cuts (`3.51s – 7.36s`, avg `0.64s`/cut!)
      let subCut = 0;
      if (t < 4.13) subCut = 0;
      else if (t < 4.75) subCut = 1;
      else if (t < 5.37) subCut = 2;
      else if (t < 6.15) subCut = 3;
      else if (t < 6.76) subCut = 4;
      else subCut = 5;

      // Cut 0..2 (`3.51–5.37s`): Crisp Archival Blueprint + Vesica Piscis Twin Drafting Compasses (`... boot ing`)!
      // Cut 3..5 (`5.37–7.36s`): Coaxial Aperture opens into Watchmaker 3D Titanium Iris (`B3D_01_iris`, `cor tex shell`) with subtle coaxial compass lock!
      const isPaperMode = subCut <= 1;
      const bg = isPaperMode ? C_BONE : C_BG;
      const fg = isPaperMode ? C_COBALT : C_CYAN;
      const panelBg = isPaperMode ? '#E6EEF6' : C_CARD;
      const gridCol = isPaperMode ? '#CBD5E1' : '#1E293B';
      const axisCol = isPaperMode ? '#94A3B8' : C_GRID;

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      const v6 = window.CortexV6;
      const want3D = t >= 5.37;
      const irisOpenU = want3D ? ease.outExpo(clamp((t - 5.37) / 0.30, 0, 1)) : 0;
      const f3D = Math.round(lerp(78, 153, clamp((t - 5.37) / (7.36 - 5.37), 0, 1)));

      // Base 2D Optical Drafting & Twin Compasses (always rendered for t < 5.67s or if 3D not yet fully expanded)
      let drew3D = false;
      if (!want3D || irisOpenU < 0.995) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
      }

      if (!want3D || irisOpenU < 0.995) {
      ctx.save();
      if (subCut === 0) {
        const u = prog(t, 3.51, 4.13, ease.outExpo);
        const z = lerp(1.32, 1.04, u) + kick * 0.05;
        ctx.translate(W * 0.5, H * 0.46);
        ctx.rotate(lerp(-0.20, -0.05, u));
        ctx.scale(z, z);
        ctx.translate(-W * 0.5, -H * 0.46);
      } else if (subCut === 1) {
        const u = prog(t, 4.13, 4.75, ease.outExpo);
        const z = lerp(0.94, 1.14, u) + kick * 0.05;
        ctx.translate(W * 0.5, H * 0.46);
        ctx.rotate(lerp(0.14, 0.0, u));
        ctx.scale(z, z);
        ctx.translate(-W * 0.5, -H * 0.46);
      } else {
        const u = prog(t, 4.75, 5.37, ease.inOutCubic);
        const z = lerp(1.04, 1.95, u) + kick * 0.08;
        ctx.translate(W * 0.5, H * 0.46);
        ctx.rotate(lerp(0.0, -0.14, u));
        ctx.scale(z, z);
        ctx.translate(-W * 0.5, -H * 0.46);
      }

      // 1. Multi-tier Swiss Millimeter Coordinate Sheet
      drawSwissConstructionSheet(ctx, W, H, gridCol, axisCol, fg, 96, -t * 140, Math.sin(t * 2.2) * 24);

      // 2. Left Margin Live TikZ Listing Card
      if (subCut !== 2) {
        ctx.save();
        const panelX = 82, panelY = 124, panelW = 428, panelH = 316;
        ctx.fillStyle = panelBg;
        ctx.fillRect(panelX, panelY, panelW, panelH);
        ctx.strokeStyle = fg;
        ctx.lineWidth = 2.2;
        ctx.strokeRect(panelX, panelY, panelW, panelH);

        ctx.fillStyle = fg;
        ctx.fillRect(panelX, panelY, panelW, 28);
        ctx.fillStyle = isPaperMode ? C_BONE : C_BG;
        ctx.font = MONO(800, 14);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('TIKZ_GENESIS.TEX // COMPILER: LIVE', panelX + 12, panelY + 14);

        const typedLines = Math.min(TIKZ_LINES.length, Math.floor(prog(t, 3.51, 6.60) * (TIKZ_LINES.length + 1)));
        ctx.font = MONO(600, 14);
        for (let li = 0; li < typedLines; li++) {
          const lineStr = TIKZ_LINES[li];
          const charFrac = li === typedLines - 1 ? clamp((prog(t, 3.51, 6.60) * TIKZ_LINES.length) - li, 0.2, 1) : 1;
          const sub = lineStr.slice(0, Math.ceil(lineStr.length * charFrac));
          ctx.fillStyle = lineStr.includes('cyan') ? fg : (isPaperMode ? C_BG : C_BONE);
          ctx.fillText(sub, panelX + 12, panelY + 48 + li * 24);
        }
        ctx.restore();
      }

      // 3. Central Mechanical Iris + Vesica Piscis Twin Compasses
      const irisCx = W * 0.5;
      const irisCy = H * 0.46;
      const irisR = 268 + kick * 16;
      const blades = 12;
      const ckptTag = 'CKPT_12 // CONVERGED';

      const buildU = clamp((t - 3.51) / 1.15, 0.28, 1.0);
      const irisRot = t * 0.95 + subCut * 0.36;
      drawTikzIrisKernel(ctx, core, irisCx, irisCy, irisR, blades, buildU, irisRot, isPaperMode, kick, false);

      const aSweep = (t - 3.51) * 3.8;
      drawDraftingCompass(
        ctx, core,
        irisCx - 165, irisCy,
        248, -1.1, -1.1 + (aSweep % 4.6),
        fg, isPaperMode ? C_BG : C_BONE, fg, bg, t, kick
      );
      drawDraftingCompass(
        ctx, core,
        irisCx + 165, irisCy,
        248, Math.PI - 1.1, Math.PI - 1.1 - (aSweep % 4.6),
        fg, isPaperMode ? C_BG : C_BONE, fg, bg, t + 0.3, kick
      );

      // 4. Precision Callout `r = 0.10mm`
      ctx.save();
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.2;
      const leadX0 = irisCx + 10, leadY0 = irisCy - 10;
      const leadX1 = irisCx + 195, leadY1 = irisCy - 175;
      const leadX2 = irisCx + 465;
      ctx.beginPath();
      ctx.moveTo(leadX0, leadY0);
      ctx.lineTo(leadX1, leadY1);
      ctx.lineTo(leadX2, leadY1);
      ctx.stroke();

      ctx.fillStyle = fg;
      ctx.fillRect(leadX1 + 6, leadY1 - 36, 272, 32);
      ctx.fillStyle = isPaperMode ? C_BONE : C_BG;
      ctx.font = MONO(800, 17);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('r = 0.10mm // PUPIL_GAP', leadX1 + 16, leadY1 - 20);
      ctx.fillStyle = isPaperMode ? C_BG : C_BONE;
      ctx.font = MONO(700, 13);
      ctx.fillText(ckptTag, leadX1 + 12, leadY1 + 16);
      ctx.restore();

      ctx.restore(); // end 2D camera rig
      }

      // Coaxial Circular Portal Unveil into Watchmaker 3D Titanium Iris (`5.37–7.36s`)
      if (want3D && v6 && typeof v6.draw3DClipFrame === 'function') {
        const clipR = Math.max(18, irisOpenU * 1320);
        ctx.save();
        if (irisOpenU < 0.995) {
          ctx.beginPath();
          ctx.arc(W * 0.5, H * 0.46, clipR, 0, Math.PI * 2);
          ctx.clip();
        }
        drew3D = v6.draw3DClipFrame(ctx, 'B3D_01_iris', t, {
          fIdx: f3D,
          zoom: lerp(1.06, 1.24, clamp((t - 5.37) / 1.99, 0, 1)),
          kick,
          kickZoom: 0.015,
          scrim: 0.18,
          isPaper: false,
          tintStrength: 0.075
        });
        if (drew3D && typeof v6.draw2D3DAtmosphereBridge === 'function') {
          v6.draw2D3DAtmosphereBridge(ctx, {
            t,
            kick,
            vpX: W * 0.5,
            vpY: H * 0.49,
            speedLines: 0,
            speedAlpha: 0.0,
            motes: 22,
            moteAlpha: 0.80
          });
        }
        ctx.restore();
        if (drew3D && irisOpenU > 0.02 && irisOpenU < 0.96) {
          ctx.save();
          ctx.strokeStyle = C_CYAN;
          ctx.lineWidth = 4.0;
          ctx.beginPath();
          ctx.arc(W * 0.5, H * 0.46, clipR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      const effPaper = drew3D ? false : isPaperMode;
      const effPanelBg = drew3D ? 'rgba(11, 14, 22, 0.72)' : panelBg;
      const effFg = drew3D ? C_CYAN : fg;

      // V8: Removed boxy top-right CAD `-log p` HUD rectangle -> clean unobstructed 3D iris cinema framing!
      // NONLINEAR AUTONOMOUS VOCAL TOKENS (`L01_BOOT_SHELL`)
      drawL01VocalTokens(ctx, core, cue, t, effPaper, subCut >= 3, kick);

      // Final Cut 5 (`t >= 6.768s`, `.` onset): Subtle luminous glass badge
      const lastWord = cue && cue.words && cue.words[6];
      if (lastWord && t >= lastWord.start) {
        const uFinal = ease.outExpo(clamp((t - lastWord.start) / 0.18, 0, 1));
        ctx.save();
        ctx.globalAlpha = uFinal;
        ctx.translate(W * 0.5, 138);
        ctx.fillStyle = 'rgba(11, 14, 22, 0.72)';
        ctx.fillRect(-310, -24, 620, 48);
        ctx.fillStyle = C_CYAN;
        ctx.font = MONO(700, 22);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CORTEX_SHELL // KERNEL AWAKENING', 0, 1);
        ctx.restore();
      }

      ctx.restore();
      return {
        bg: effPaper ? C_BONE : C_BG,
        fg: effPaper ? C_BG : C_BONE,
        duotone: { bg: effPaper ? C_BONE : C_BG, fg: effFg },
        isPaper: effPaper,
        bloom: 0.24,
        ca: 0,
        flash: 0,
        shake: 0
      };
    }
  });
})();
