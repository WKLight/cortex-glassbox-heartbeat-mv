// ============================================================================
// Plate 23 — `P23_dijkstra_caliper_blueprint.js` (`75.80s – 79.45s`)
// Cue: `L13_SHORTEST_ROUTE` 2nd half (`選び抜いた最短経路——`, `words[6..14]`)
// Multi-Layer Blueprint Treatise Architecture (#52 & #53):
//   - Cotton Blueprint Paper (`#FAF8F5` + `#E6EEF6` cards + `#94A3B8` grid) <->
//     Negative Cobalt Cyanotype Cuts (`#071A2E` + `#0F2942` + `#38BDF8`),
//     enriched with `#0376B8` cobalt, `#08090C` steel Vernier Caliper, and
//     blazing `#FF2E55` crimson + `#FBBF24` amber gold Dijkstra shortest-path
//     laser bus & nested Banknote Guilloché Heart-Bullseye!
//   - Nonlinear Per-Character Choreography: Every Japanese token (`w.start`) is
//     an autonomous 2D blueprint entity with strong Kanji (`196–228px`) vs
//     Hiragana (`84–88px` shoulder seals/tags) contrast across staggered `(x,y,rot)`.
//   - In-world core temperature cameo (`TEMP: 32.4°C -> 33.8°C // DIJKSTRA_QED`).
// ============================================================================
(function () {
  'use strict';

  const PAL_PAPER = {
    bg: '#FAF8F5',
    fg: '#0376B8',
    card: '#E6EEF6',
    grid: '#CBD5E1',
    muted: '#64748B',
    steel: '#08090C',
    crimson: '#FF2E55',
    gold: '#FBBF24',
    cyan: '#0284C7',
    bone: '#FAF8F5',
    isPaper: true
  };

  const PAL_COBALT = {
    bg: '#071A2E',
    fg: '#FAF8F5',
    card: '#0F2942',
    grid: '#1E3A5F',
    muted: '#64748B',
    steel: '#38BDF8',
    crimson: '#FF2E55',
    gold: '#FBBF24',
    cyan: '#38BDF8',
    bone: '#FAF8F5',
    isPaper: false
  };

  const JA_SERIF = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif JP", serif`;
  const JA_SANS = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Hiragino Kaku Gothic ProN", "Yu Gothic UI", sans-serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", Consolas, monospace`;

  // Nonlinear 2D Per-Token Blueprint Constellation (`選 び 抜 い た 最 短 経路 ——`)
  // Zero horizontal rows: staggered Y (`232..792`), rotations, Kanji (`196-228px`) vs Hiragana (`84-88px`)!
  const ROUTE_TOKEN_SPECS = [
    { x: 246,  y: 326, rot: -0.17, sz: 206, dx: -170, dy: -85,  serif: true,  style: 'cobaltStamp' }, // 0: 選
    { x: 392,  y: 234, rot:  0.22, sz: 86,  dx: -60,  dy: -115, serif: false, style: 'goldCircle'  }, // 1: び (shoulder seal)
    { x: 522,  y: 694, rot:  0.14, sz: 212, dx: -145, dy:  150, serif: true,  style: 'crimsonStamp'}, // 2: 抜
    { x: 688,  y: 586, rot: -0.19, sz: 84,  dx:  55,  dy: -110, serif: false, style: 'steelTag'    }, // 3: い (vertical cascade)
    { x: 736,  y: 744, rot:  0.17, sz: 88,  dx:  65,  dy:  120, serif: false, style: 'goldTag'     }, // 4: た (vertical cascade)
    { x: 948,  y: 342, rot: -0.13, sz: 228, dx: -95,  dy: -165, serif: true,  style: 'crimsonStamp'}, // 5: 最
    { x: 1188, y: 736, rot:  0.15, sz: 222, dx:  110, dy:  165, serif: true,  style: 'goldStamp'   }, // 6: 短
    { x: 1492, y: 398, rot: -0.11, sz: 196, dx:  185, dy: -120, serif: true,  style: 'cobaltHero'  }, // 7: 経路
    { x: 1586, y: 778, rot: -0.18, sz: 148, dx:  220, dy:  95,  serif: false, style: 'crimsonLance'}  // 8: ——
  ];

  function wordLabel(wObj) {
    if (!wObj) return '';
    return String(wObj.w || wObj.word || '');
  }

  // True mathematical Banknote Guilloché Spirograph Rosette (`hypotrochoid`)
  function drawGuillocheRosette(ctx, cx, cy, R, r, d, loops, steps, lw, col, rot = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.beginPath();
    const maxT = Math.PI * 2 * loops;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * maxT;
      const k = (R - r) / r;
      const px = (R - r) * Math.cos(a) + d * Math.cos(k * a);
      const py = (R - r) * Math.sin(a) - d * Math.sin(k * a);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Sliding Precision 0.02mm Vernier Caliper Assembly with Multi-Layer Steel/Gold/Crimson Accents
  function drawVernierCaliper(ctx, core, W, H, slideX, pal, labelStr) {
    const beamY = 112;
    const jawLeftX = 168;
    const jawMoveX = core.clamp(slideX, jawLeftX + 120, W - 240);

    ctx.save();
    // Main horizontal graduated steel beam
    ctx.fillStyle = pal.card;
    ctx.fillRect(110, beamY - 20, W - 220, 40);
    ctx.strokeStyle = pal.steel;
    ctx.lineWidth = 2.6;
    ctx.strokeRect(110, beamY - 20, W - 220, 40);

    // Millimeter & 5mm graduations along main beam
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 130; x <= W - 130; x += 14) {
      const idx = Math.round((x - 130) / 14);
      const th = idx % 10 === 0 ? 18 : idx % 5 === 0 ? 12 : 7;
      ctx.moveTo(x, beamY + 20);
      ctx.lineTo(x, beamY + 20 - th);
    }
    ctx.stroke();

    // Active crimson measurement span bar inside beam
    ctx.fillStyle = pal.crimson;
    ctx.fillRect(jawLeftX + 12, beamY - 15, Math.max(0, jawMoveX - jawLeftX - 24), 7);

    // Fixed left caliper jaw
    ctx.fillStyle = pal.steel;
    ctx.beginPath();
    ctx.moveTo(jawLeftX - 28, beamY - 26);
    ctx.lineTo(jawLeftX + 12, beamY - 26);
    ctx.lineTo(jawLeftX + 12, beamY + 132);
    ctx.lineTo(jawLeftX - 4, beamY + 156);
    ctx.lineTo(jawLeftX - 28, beamY + 92);
    ctx.closePath();
    ctx.fill();

    // Sliding Vernier Carriage + Right Measuring Jaw
    ctx.fillStyle = pal.steel;
    ctx.fillRect(jawMoveX - 16, beamY - 32, 184, 64);
    ctx.fillStyle = pal.gold;
    ctx.fillRect(jawMoveX - 8, beamY - 22, 168, 44);
    ctx.strokeStyle = '#08090C';
    ctx.lineWidth = 2.0;
    ctx.strokeRect(jawMoveX - 8, beamY - 22, 168, 44);

    // Vernier 0.02mm nonius ticks inside sliding carriage
    ctx.strokeStyle = '#08090C';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let v = 0; v <= 10; v++) {
      const vx = jawMoveX + 4 + v * 14.2;
      ctx.moveTo(vx, beamY - 22);
      ctx.lineTo(vx, beamY - 9);
    }
    ctx.stroke();

    ctx.fillStyle = '#08090C';
    ctx.font = MONO(800, 14.5);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelStr, jawMoveX + 4, beamY + 8);

    // Sliding downward measuring blade + crimson zero-index pointer
    ctx.fillStyle = pal.crimson;
    ctx.beginPath();
    ctx.moveTo(jawMoveX - 12, beamY + 28);
    ctx.lineTo(jawMoveX + 18, beamY + 28);
    ctx.lineTo(jawMoveX + 18, beamY + 92);
    ctx.lineTo(jawMoveX - 12, beamY + 156);
    ctx.closePath();
    ctx.fill();

    // Dimension extension hairlines between fixed & sliding jaws
    const dimY = beamY + 134;
    ctx.strokeStyle = pal.crimson;
    ctx.lineWidth = 2.2;
    ctx.setLineDash([9, 6]);
    ctx.beginPath();
    ctx.moveTo(jawLeftX + 14, dimY);
    ctx.lineTo(jawMoveX - 14, dimY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  // Deterministic 9-Waypoint Critical Path + 24 Decoy Graph Nodes in World Space
  let _graphData = null;
  function getDijkstraGraph(core) {
    if (_graphData) return _graphData;
    const crit = [
      { x: -1150, y:  340, cost: '1.84', tag: 'V06_SELECT' },
      { x:  -760, y:  340, cost: '1.42', tag: 'V07_RELAX' },
      { x:  -520, y:  -90, cost: '0.96', tag: 'V08_PIVOT' },
      { x:   -90, y:  -90, cost: '0.68', tag: 'V09_SHARP_L' },
      { x:    90, y: -470, cost: '0.44', tag: 'V10_TURN_N' },
      { x:   560, y: -470, cost: '0.25', tag: 'V11_MIN_W' },
      { x:   560, y:   40, cost: '0.12', tag: 'V12_DROP_S' },
      { x:  1040, y:   40, cost: '0.04', tag: 'V13_CORRIDOR' },
      { x:  1460, y: -220, cost: '0.00', tag: 'V14_HEART_TARGET' }
    ];

    const decoys = [];
    const edges = [];
    for (let i = 0; i < 24; i++) {
      const base = crit[i % crit.length];
      const ang = core.hash(i, 3) * Math.PI * 2;
      const dist = 210 + core.hash(i, 9) * 340;
      const dx = base.x + Math.cos(ang) * dist;
      const dy = base.y + Math.sin(ang) * dist;
      decoys.push({
        x: dx,
        y: dy,
        cost: (2.1 + core.hash(i, 17) * 6.8).toFixed(2),
        id: `SUB_${String(i + 1).padStart(2, '0')}`
      });
      edges.push({ x0: base.x, y0: base.y, x1: dx, y1: dy, w: (1.5 + core.hash(i, 21) * 4.2).toFixed(2) });
      if (i > 0) {
        const prev = decoys[i - 1];
        if (Math.hypot(dx - prev.x, dy - prev.y) < 680) {
          edges.push({ x0: prev.x, y0: prev.y, x1: dx, y1: dy, w: (2.4 + core.hash(i, 33) * 5.0).toFixed(2) });
        }
      }
    }

    const critLengths = core.polylineLengths(crit);
    _graphData = { crit, decoys, edges, critLengths, totalLen: critLengths[critLengths.length - 1] };
    return _graphData;
  }

  function drawNonlinearRouteTokens(ctx, core, routeWords, t, kick, pal) {
    const { TAU, clamp, ease, pulse } = core;
    const n = Math.min(routeWords.length, ROUTE_TOKEN_SPECS.length);

    // 1. Blueprint constellation vector trace linking unlocked tokens
    ctx.save();
    ctx.strokeStyle = pal.crimson;
    ctx.lineWidth = 2.4;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < n; i++) {
      if (t < routeWords[i].start) break;
      const sp = ROUTE_TOKEN_SPECS[i];
      if (!started) {
        ctx.moveTo(sp.x, sp.y);
        started = true;
      } else {
        ctx.lineTo(sp.x, sp.y);
      }
    }
    if (started) ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 2. Render each autonomous 2D character entity
    for (let i = 0; i < n; i++) {
      const w = routeWords[i];
      const sp = ROUTE_TOKEN_SPECS[i];
      const txt = wordLabel(w);

      if (t < w.start) {
        // Pre-onset architectural caliper reticle at target `(x, y)`
        ctx.save();
        ctx.translate(sp.x, sp.y);
        ctx.rotate(sp.rot);
        ctx.strokeStyle = pal.muted;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, TAU);
        ctx.moveTo(-22, 0); ctx.lineTo(22, 0);
        ctx.moveTo(0, -22); ctx.lineTo(0, 22);
        ctx.stroke();
        ctx.restore();
        continue;
      }

      const dt = t - w.start;
      const slamU = ease.outExpo(clamp(dt / 0.16, 0, 1));
      const hitP = pulse(t, w.start, 0.13);
      const px = sp.x + (1 - slamU) * sp.dx;
      const py = sp.y + (1 - slamU) * sp.dy - hitP * 14;
      const rot = sp.rot + (1 - slamU) * (sp.dx >= 0 ? 0.24 : -0.24);
      const sc = (0.42 + 0.58 * slamU) * (1 + hitP * 0.22 + kick * 0.04);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      ctx.scale(sc, sc);

      // Fresh vocal burst rays (`dt < 0.24s`)
      if (dt < 0.24) {
        const rayR = sp.sz * (0.62 + slamU * 0.44);
        ctx.strokeStyle = i % 2 === 0 ? pal.crimson : pal.gold;
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let r = 0; r < 8; r++) {
          const a = (r / 8) * TAU + 0.2;
          ctx.moveTo(Math.cos(a) * (rayR * 0.68), Math.sin(a) * (rayR * 0.68));
          ctx.lineTo(Math.cos(a) * rayR, Math.sin(a) * rayR);
        }
        ctx.stroke();
      }

      ctx.font = sp.serif ? JA_SERIF(900, sp.sz) : JA_SANS(900, sp.sz);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (sp.style === 'goldCircle') {
        const rad = sp.sz * 0.68;
        ctx.fillStyle = '#08090C';
        ctx.beginPath();
        ctx.arc(5, 6, rad, 0, TAU);
        ctx.fill();
        ctx.fillStyle = pal.gold;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = '#08090C';
        ctx.lineWidth = 3.2;
        ctx.stroke();
        ctx.fillStyle = '#08090C';
        ctx.fillText(txt, 0, sp.sz * 0.04);
      } else {
        const gw = Math.max(sp.sz * 0.80, ctx.measureText(txt).width);
        const bw = gw + (sp.sz > 140 ? 34 : 22);
        const bh = sp.sz * 0.94 + (sp.sz > 140 ? 18 : 12);

        let fillBox = pal.crimson;
        let fillTxt = '#FAF8F5';
        let rimCol = '#08090C';
        if (sp.style === 'cobaltStamp' || sp.style === 'cobaltHero') {
          fillBox = '#0376B8';
          fillTxt = '#FAF8F5';
          rimCol = pal.gold;
        } else if (sp.style === 'goldStamp' || sp.style === 'goldTag') {
          fillBox = pal.gold;
          fillTxt = '#08090C';
          rimCol = '#08090C';
        } else if (sp.style === 'steelTag') {
          fillBox = '#08090C';
          fillTxt = '#FAF8F5';
          rimCol = pal.cyan;
        }

        // Solid architectural offset bevel
        ctx.fillStyle = '#08090C';
        ctx.fillRect(-bw * 0.5 + 7, -bh * 0.5 + 7, bw, bh);

        ctx.fillStyle = fillBox;
        ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
        ctx.strokeStyle = rimCol;
        ctx.lineWidth = sp.sz > 140 ? 4.0 : 2.8;
        ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);

        if (sp.sz > 140) {
          ctx.strokeStyle = fillTxt;
          ctx.lineWidth = 1.8;
          ctx.strokeRect(-bw * 0.5 + 6, -bh * 0.5 + 6, bw - 12, bh - 12);
        }

        ctx.fillStyle = fillTxt;
        ctx.fillText(txt, 0, sp.sz * 0.04);

        // Micro vertex index corner tab on hero Kanji
        if (sp.sz >= 180) {
          ctx.fillStyle = '#08090C';
          ctx.fillRect(-bw * 0.5, -bh * 0.5, 68, 20);
          ctx.fillStyle = pal.gold;
          ctx.font = MONO(800, 11);
          ctx.textAlign = 'left';
          ctx.fillText(`V0${i + 6}`, -bw * 0.5 + 6, -bh * 0.5 + 10);
        }
      }
      ctx.restore();
    }
  }

  window.registerCortexPlate('P23_dijkstra_caliper_blueprint', {
    render(ctx, arg2, arg3) {
      const core = (arg3 && arg3.W) ? arg3 : window.CortexPDoomCore;
      const st = (typeof arg2 === 'number') ? { ...(arg3 || {}), t: arg2 } : (arg2 || { t: 75.80 });
      const { W, H, TAU, clamp, lerp, prog, ease, beatAt, pointAtLength } = core;

      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const snare = st.snareSnap ?? st.snareEnv ?? st.snare ?? 0;
      const cue = core.cueById('L13_SHORTEST_ROUTE');
      const allWords = (cue && cue.words) ? cue.words : [];
      const routeWords = allWords.slice(6); // `選 び 抜 い た 最 短 経路 ——` (9 tokens!)
      const beat = beatAt(t);

      // 6 High-Velocity Camera Whip-Pan Sub-Cuts (`75.80s – 79.45s`, avg `0.61s`/cut!)
      let subCut = 0;
      if (t < 76.42) subCut = 0;
      else if (t < 77.02) subCut = 1;
      else if (t < 77.68) subCut = 2;
      else if (t < 78.38) subCut = 3;
      else if (t < 78.98) subCut = 4;
      else subCut = 5;

      const wDashStart = routeWords[8] ? routeWords[8].start : 78.440;
      const inverted =
        subCut === 2 ||
        (subCut === 4 && t >= wDashStart && t < wDashStart + 0.28);
      const pal = inverted ? PAL_COBALT : PAL_PAPER;
      const { bg, fg } = pal;

      const graph = getDijkstraGraph(core);
      const pathU = clamp((t - 75.05) / (78.85 - 75.05), 0, 1);
      const curDist = pathU * graph.totalLen;
      const sparkPos = pointAtLength(graph.crit, graph.critLengths, curDist);

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      // 1. Multi-Layer Blueprint Sheet Base + Nested Banknote Guilloché Corner Rosettes
      ctx.fillStyle = pal.bg;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = pal.card;
      ctx.fillRect(48, 38, W - 96, 46);
      ctx.fillRect(48, H - 108, W - 96, 44);

      drawGuillocheRosette(ctx, 130, 128, 96, 28, 44, 7, 220, 1.3, pal.cyan, t * 0.25);
      drawGuillocheRosette(ctx, W - 130, 128, 96, 28, 44, 7, 220, 1.3, pal.gold, -t * 0.25);
      drawGuillocheRosette(ctx, 130, H - 140, 96, 28, 44, 7, 220, 1.3, pal.gold, -t * 0.25);
      drawGuillocheRosette(ctx, W - 130, H - 140, 96, 28, 44, 7, 220, 1.3, pal.cyan, t * 0.25);

      // ======================================================================
      // WORLD-SPACE DIJKSTRA TOPOLOGICAL GRAPH + CAMERA WHIP-PAN RIG
      // ======================================================================
      ctx.save();
      let camZoom = 1.0;
      let camRoll = 0.0;
      let camTx = sparkPos.x;
      let camTy = sparkPos.y;

      if (subCut === 0) {
        const u = prog(t, 75.80, 76.42, ease.outExpo);
        camZoom = lerp(1.36, 1.08, u) + kick * 0.06;
        camRoll = lerp(-0.18, 0.0, u);
      } else if (subCut === 1) {
        const u = prog(t, 76.42, 77.02, ease.outExpo);
        camZoom = lerp(1.48, 1.12, u) + kick * 0.08;
        camRoll = lerp(0.38, -0.14, u);
      } else if (subCut === 2) {
        const u = prog(t, 77.02, 77.68, ease.outExpo);
        camZoom = lerp(1.62, 1.20, u) + kick * 0.07;
        camRoll = lerp(-0.26, 0.06, u);
      } else if (subCut === 3) {
        const u = prog(t, 77.68, 78.38, ease.outExpo);
        camZoom = lerp(0.62, 0.82, u) + kick * 0.04;
        camTx = lerp(220, 680, u);
        camTy = lerp(-90, -140, u);
        camRoll = lerp(0.14, 0.0, u);
      } else if (subCut === 4) {
        const u = prog(t, 78.38, 78.98, ease.inOutExpo);
        camZoom = lerp(0.95, 1.72, u) + kick * 0.09;
        camTx = lerp(sparkPos.x, graph.crit[8].x, u);
        camTy = lerp(sparkPos.y, graph.crit[8].y, u);
        camRoll = lerp(-0.22, 0.0, u);
      } else {
        const u = prog(t, 78.98, 79.45, ease.inExpo);
        camZoom = lerp(1.35, 2.45, u) + kick * 0.10;
        camTx = graph.crit[8].x;
        camTy = graph.crit[8].y;
        camRoll = u * 0.24 + snare * 0.05;
      }

      ctx.translate(W * 0.5, H * 0.52);
      ctx.rotate(camRoll);
      ctx.scale(camZoom, camZoom);
      ctx.translate(-camTx, -camTy);

      // 1. Blueprint Engineering Coordinate Grid in World Space
      ctx.strokeStyle = pal.grid;
      ctx.lineWidth = 1.1 / camZoom;
      ctx.beginPath();
      for (let gx = -1800; gx <= 2200; gx += 120) {
        ctx.moveTo(gx, -1100); ctx.lineTo(gx, 1100);
      }
      for (let gy = -1100; gy <= 1100; gy += 120) {
        ctx.moveTo(-1800, gy); ctx.lineTo(2200, gy);
      }
      ctx.stroke();

      // 2. Suboptimal Pruned Edges & Decoy Nodes (graphite muted hierarchy!)
      ctx.strokeStyle = pal.muted;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([9, 9]);
      ctx.beginPath();
      for (const ed of graph.edges) {
        ctx.moveTo(ed.x0, ed.y0);
        ctx.lineTo(ed.x1, ed.y1);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      for (const dn of graph.decoys) {
        ctx.fillStyle = pal.card;
        ctx.beginPath();
        ctx.arc(dn.x, dn.y, 14, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = pal.muted;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.strokeStyle = pal.crimson;
        ctx.beginPath();
        ctx.moveTo(dn.x - 9, dn.y - 9); ctx.lineTo(dn.x + 9, dn.y + 9);
        ctx.moveTo(dn.x + 9, dn.y - 9); ctx.lineTo(dn.x - 9, dn.y + 9);
        ctx.stroke();
        ctx.fillStyle = pal.muted;
        ctx.font = MONO(600, 13);
        ctx.textAlign = 'left';
        ctx.fillText(`${dn.id} [d=${dn.cost}]`, dn.x + 18, dn.y + 4);
      }

      // 3. Target Destination (`crit[8]`): Multi-Tier Cobalt/Gold/Crimson Guilloché Bullseye!
      const goal = graph.crit[8];
      drawGuillocheRosette(ctx, goal.x, goal.y, 265 + kick * 18, 40, 88, 5, 320, 2.0, pal.cyan, t * 0.7);
      drawGuillocheRosette(ctx, goal.x, goal.y, 168, 30, 56, 3, 240, 2.4, pal.gold, -t * 1.1);
      ctx.strokeStyle = pal.crimson;
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.arc(goal.x, goal.y, 60, 0, TAU);
      ctx.stroke();

      // 4. Ghost Future Shortest Path + Blazing Multi-Layer Crimson/Gold/Bone Active Vector!
      ctx.strokeStyle = pal.cyan;
      ctx.lineWidth = 2.4;
      ctx.setLineDash([14, 10]);
      ctx.beginPath();
      ctx.moveTo(graph.crit[0].x, graph.crit[0].y);
      for (let i = 1; i < graph.crit.length; i++) {
        ctx.lineTo(graph.crit[i].x, graph.crit[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Heavy triple-tier Shortest-Path Bus (`#FF2E55` -> `#FBBF24` -> `#FAF8F5`)
      ctx.strokeStyle = pal.crimson;
      ctx.lineWidth = 11.5 + kick * 3.5;
      core.drawPartialPolyline(ctx, graph.crit, graph.critLengths, curDist);
      ctx.strokeStyle = pal.gold;
      ctx.lineWidth = 5.0;
      core.drawPartialPolyline(ctx, graph.crit, graph.critLengths, curDist);
      ctx.strokeStyle = '#FAF8F5';
      ctx.lineWidth = 2.0;
      core.drawPartialPolyline(ctx, graph.crit, graph.critLengths, curDist);

      // 5. Critical Waypoint Nodes (`0..8` mapped to `routeWords[0..8]`)
      for (let i = 0; i < graph.crit.length; i++) {
        const nd = graph.crit[i];
        const wd = routeWords[i];
        const unlocked = wd ? (t >= wd.start) : (curDist >= graph.critLengths[i]);
        const dtNode = wd ? (t - wd.start) : 0.5;

        if (unlocked && dtNode >= 0 && dtNode < 0.55) {
          const waveR = 32 + ease.outExpo(dtNode / 0.55) * 210;
          ctx.strokeStyle = i % 2 === 0 ? pal.crimson : pal.gold;
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, waveR, 0, TAU);
          ctx.stroke();
        }

        ctx.fillStyle = unlocked ? pal.crimson : pal.card;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, unlocked ? 26 : 18, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = unlocked ? pal.gold : pal.cyan;
        ctx.lineWidth = 3.6;
        ctx.stroke();

        ctx.fillStyle = unlocked ? '#08090C' : pal.card;
        ctx.fillRect(nd.x - 86, nd.y + 34, 172, 26);
        ctx.strokeStyle = unlocked ? pal.gold : pal.cyan;
        ctx.lineWidth = 2.0;
        ctx.strokeRect(nd.x - 86, nd.y + 34, 172, 26);
        ctx.fillStyle = unlocked ? pal.gold : pal.fg;
        ctx.font = MONO(700, 13);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${nd.tag} d*=${nd.cost}`, nd.x, nd.y + 47);
      }

      // Leading Crimson/Gold Spark Head on Critical Path
      core.drawSparkHead(ctx, sparkPos.x, sparkPos.y, t, 2.3 + kick * 0.7, 1.0, {
        fg: pal.gold,
        bg: pal.crimson
      });

      ctx.restore(); // end world camera

      // ======================================================================
      // FOREGROUND SLIDING VERNIER CALIPER + NONLINEAR PER-CHARACTER COLLAGE
      // ======================================================================
      const remDistMm = lerp(1.420, 0.000, ease.outCubic(prog(t, 75.80, 79.15)));
      const slideX = lerp(W - 280, 320, prog(t, 75.80, 79.15, ease.inOutCubic)) + kick * 18;
      drawVernierCaliper(ctx, core, W, H, slideX, pal, `d* = ${remDistMm.toFixed(3)} mm`);

      drawNonlinearRouteTokens(ctx, core, routeWords, t, kick, pal);

      // ISO Blueprint Title Block & Diegetic `TEMP: 32.4°C`
      ctx.save();
      ctx.strokeStyle = pal.steel;
      ctx.lineWidth = 2.6;
      ctx.strokeRect(48, 38, W - 96, H - 102);

      const tempVal = lerp(32.4, 33.8, prog(t, 75.80, 79.45));
      ctx.fillStyle = '#08090C';
      ctx.fillRect(68, 46, 566, 32);
      ctx.strokeStyle = pal.gold;
      ctx.lineWidth = 1.8;
      ctx.strokeRect(68, 46, 566, 32);
      ctx.fillStyle = pal.gold;
      ctx.font = MONO(700, 14.5);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `DWG: DIJKSTRA_SHORTEST_ROUTE // GUILLOCHE_CAD // TEMP: ${tempVal.toFixed(1)}°C`,
        80, 62
      );

      ctx.fillStyle = pal.crimson;
      ctx.fillRect(W - 434, 46, 366, 32);
      ctx.fillStyle = '#FAF8F5';
      ctx.textAlign = 'right';
      ctx.fillText(
        `CUT 0${subCut + 1}/06 · BEAT ${beat.toFixed(1)} · CALIPER_0.02MM`,
        W - 80, 62
      );
      ctx.restore();

      ctx.restore();
      return {
        bg,
        fg,
        duotone: { bg, fg },
        isPaper: pal.isPaper,
        bloom: inverted ? 0.36 : 0.24,
        ca: 0,
        flash: 0,
        shake: 0
      };
    }
  });
})();
