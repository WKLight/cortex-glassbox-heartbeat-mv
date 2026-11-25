// ============================================================================
// Plate 22 — `P22_katana_branch_foom.js` (`62.36s – 68.73s`)
// Cue: `L11_THOUSAND_BRANCHES` (`幾千の分岐咲かせては剪定して`)
// Treatise Palette (#52 Multi-Layer FOOM & Katana Contrast):
//   - Dark Overdrive Cuts: Obsidian `#08090C` + Slate Grid `#1E293B` + Severed Graphite `#475569`
//     + Golden/Bone Surviving Spine (`#FBBF24` / `#FAF8F5`) + Crimson `#FF2E55` FOOM Canopy
//     + Ice-Cyan `#38BDF8` & Gold `#FBBF24` Guilloché Hypothesis Blooms!
//   - Manuscript Cuts: Warm Genkō-yōshi `#F5F0E6` + Ruled `#DFD7C5` + Sumi Ink `#08090C`
//     + Vermilion Katana Cleave `#FF2E55` + Cobalt `#0376B8` Telemetry!
// Autonomous Per-Character Choreography (#53):
//   - Nonlinear Branching Canopy + Tategaki Stem + Diagonal Katana-Cleaved Kanji Stamps!
// ============================================================================
(function () {
  'use strict';

  const C_DARK = '#08090C';
  const C_CARD = '#131926';
  const C_PAPER = '#F5F0E6';
  const C_BONE = '#FAF8F5';
  const C_GRID_DARK = '#263145';
  const C_GRID_PAPER = '#D8CEB8';
  const C_SLATE = '#64748B';
  const C_CRIMSON = '#FF2E55';
  const C_EMBER = '#FF8A3D';
  const C_GOLD = '#FBBF24';
  const C_CYAN = '#38BDF8';
  const C_COBALT = '#0376B8';

  const JA_SERIF = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif SC", serif`;
  const JA_SANS = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", sans-serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", Consolas, monospace`;

  const PRUNED_TAGS = [
    'PRUNED // p=0.004', 'DEAD_BRANCH #042', 'KL_DIV > 3.10', 'VERBOSE_DRAFT',
    'COLD_TONE [CUT]', 'LOOP_DETECTED', 'SUBOPT_NODE #19', 'HALLUC_GUARD'
  ];

  // 13 Autonomous Branching & Katana-Cleaved Entities for `幾千の分岐咲かせては剪定して` (#53)
  const L11_LAYOUT = [
    { x: 255,  y: 215, sz: 206, rot: -0.20, dx: -170, dy: -110, style: 'stamp',  col: C_CRIMSON, kanji: true  }, // 0: 幾
    { x: 455,  y: 295, sz: 214, rot:  0.14, dx: -120, dy:  130, style: 'stamp',  col: C_GOLD,    kanji: true  }, // 1: 千
    { x: 612,  y: 210, sz: 82,  rot: -0.24, dx:   0,  dy: -100, style: 'circle', col: C_CYAN,    kanji: false }, // 2: の (shoulder seal!)
    { x: 1455, y: 235, sz: 220, rot: -0.13, dx:  220, dy: -120, style: 'hero',   col: C_CRIMSON, kanji: true  }, // 3: 分岐
    { x: 285,  y: 525, sz: 222, rot:  0.16, dx: -190, dy:   80, style: 'stamp',  col: C_GOLD,    kanji: true  }, // 4: 咲
    { x: 465,  y: 470, sz: 90,  rot: -0.15, dx: -90,  dy:  -80, style: 'tag',    col: C_CYAN,    kanji: false }, // 5: か (tategaki stem!)
    { x: 515,  y: 568, sz: 88,  rot:  0.18, dx:  90,  dy:   60, style: 'tag',    col: C_BONE,    kanji: false }, // 6: せ
    { x: 475,  y: 666, sz: 90,  rot: -0.14, dx: -90,  dy:   80, style: 'tag',    col: C_EMBER,   kanji: false }, // 7: て
    { x: 535,  y: 762, sz: 86,  rot:  0.22, dx:  80,  dy:  100, style: 'circle', col: C_GOLD,    kanji: false }, // 8: は
    { x: 1095, y: 695, sz: 238, rot: -0.18, dx: -180, dy:  160, style: 'katana', col: C_CRIMSON, kanji: true  }, // 9: 剪
    { x: 1365, y: 785, sz: 236, rot:  0.14, dx:  190, dy:  160, style: 'katana', col: C_CRIMSON, kanji: true  }, // 10: 定
    { x: 1585, y: 665, sz: 92,  rot: -0.22, dx:  160, dy: -110, style: 'tag',    col: C_GOLD,    kanji: false }, // 11: し
    { x: 1685, y: 765, sz: 94,  rot:  0.19, dx:  160, dy:  120, style: 'circle', col: C_CYAN,    kanji: false }  // 12: て
  ];

  let _treeSegments = null;
  function getTreeSegments(core) {
    if (_treeSegments) return _treeSegments;
    const segs = [];
    function grow(x0, y0, ang, len, depth, pathMask) {
      const x1 = x0 + Math.cos(ang) * len;
      const y1 = y0 + Math.sin(ang) * len;
      const isGoldenSurvivor = (pathMask % 8 === 0) || depth <= 1;
      segs.push({ x0, y0, x1, y1, ang, len, depth, pathMask, isGoldenSurvivor });
      if (depth >= 6) return;
      const spread = 0.44 * Math.pow(0.84, depth);
      const jitterA = (core.hash(depth, pathMask, 11) - 0.5) * 0.14;
      const jitterB = (core.hash(depth, pathMask, 29) - 0.5) * 0.14;
      grow(x1, y1, ang - spread + jitterA, len * 0.79, depth + 1, pathMask * 2);
      grow(x1, y1, ang + spread + jitterB, len * 0.79, depth + 1, pathMask * 2 + 1);
    }
    grow(960, 930, -Math.PI * 0.5, 225, 0, 0);
    _treeSegments = segs;
    return segs;
  }

  function drawGuillocheBloom(ctx, cx, cy, R, petals, rot, petalCol, coreCol, bgCol) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.fillStyle = bgCol;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.92, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = petalCol;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const steps = 96;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const rad = R * (0.52 + 0.46 * Math.cos(petals * a));
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = coreCol;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawFoomWorld(ctx, core, t, subCut, isPaper, kick, pruneProg, camTransformFn) {
    const { W, H, clamp, lerp, ease, beatAt, hash } = core;
    const segs = getTreeSegments(core);
    const eigths = Math.max(0, (beatAt(t) - beatAt(62.36)) * 2.0);

    const bg = isPaper ? C_PAPER : C_DARK;
    const gridCol = isPaper ? C_GRID_PAPER : C_GRID_DARK;

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 1. Genkō-yōshi Manuscript / Swiss Cutting-Mat Registration Grid
    ctx.strokeStyle = gridCol;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let x = 96; x < W; x += 64) {
      ctx.moveTo(x, 48); ctx.lineTo(x, H - 84);
    }
    for (let y = 72; y < H - 80; y += 64) {
      ctx.moveTo(56, y); ctx.lineTo(W - 56, y);
    }
    ctx.stroke();

    ctx.save();
    if (camTransformFn) camTransformFn(ctx);

    // 2. FOOM Shockwave O-Rings
    if (subCut <= 2) {
      for (let r = 0; r < 5; r++) {
        const rr = (((eigths * 95 + r * 170) % 980) + 980) % 980 + 40;
        ctx.strokeStyle = r % 2 === 0 ? C_CRIMSON : (isPaper ? C_COBALT : C_GOLD);
        ctx.lineWidth = r % 2 === 0 ? 2.6 : 1.4;
        if (r % 2 === 1) ctx.setLineDash([12, 8]);
        else ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(960, 520, rr, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // 3. Exponential `1 -> 2 -> 4 -> 8 -> 16 -> 32 -> 64` Branches with Multi-Tier Color!
    const bloomU = clamp((t - 64.40) / 0.85, 0, 1);
    for (let i = 0; i < segs.length; i++) {
      const sg = segs[i];
      const growU = ease.outExpo(clamp(eigths - sg.depth * 1.15, 0, 1));
      if (growU <= 0.01) continue;

      let ox = 0, oy = 0, rot = 0;
      const isSevered = pruneProg > 0.01 && sg.depth >= 2 && (sg.pathMask % 4 !== 0);
      if (isSevered) {
        const dir = (sg.pathMask % 2 === 0) ? -1 : 1;
        const fly = ease.inQuad(pruneProg) * (280 + sg.depth * 95);
        ox = dir * fly + (hash(i, 5) - 0.5) * fly * 0.6;
        oy = fly * 0.55;
        rot = dir * pruneProg * (0.45 + (i % 5) * 0.12);
      }

      const ex = lerp(sg.x0, sg.x1, growU);
      const ey = lerp(sg.y0, sg.y1, growU);

      ctx.save();
      if (ox !== 0 || oy !== 0) {
        const mx = (sg.x0 + ex) * 0.5;
        const my = (sg.y0 + ey) * 0.5;
        ctx.translate(mx + ox, my + oy);
        ctx.rotate(rot);
        ctx.translate(-mx, -my);
      }

      const baseLW = Math.max(1.8, (7 - sg.depth) * 2.4 + (sg.depth <= 1 ? kick * 3 : 0));
      if (isSevered) {
        ctx.strokeStyle = C_SLATE;
      } else if (sg.isGoldenSurvivor) {
        ctx.strokeStyle = isPaper ? C_CRIMSON : C_GOLD;
      } else {
        ctx.strokeStyle = isPaper ? C_DARK : (sg.depth >= 4 ? C_CRIMSON : C_BONE);
      }
      ctx.lineWidth = isSevered ? Math.max(1.4, baseLW * 0.65) : baseLW;
      if (isSevered) ctx.setLineDash([10, 6]);
      ctx.beginPath();
      ctx.moveTo(sg.x0, sg.y0);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.setLineDash([]);

      if (growU > 0.92 && sg.depth <= 4) {
        const boxR = Math.max(4, 11 - sg.depth * 1.6);
        ctx.fillStyle = sg.isGoldenSurvivor ? C_GOLD : (isPaper ? C_PAPER : C_CARD);
        ctx.fillRect(ex - boxR, ey - boxR, boxR * 2, boxR * 2);
        ctx.strokeStyle = sg.isGoldenSurvivor ? C_CRIMSON : (isPaper ? C_DARK : C_CYAN);
        ctx.lineWidth = 1.8;
        ctx.strokeRect(ex - boxR, ey - boxR, boxR * 2, boxR * 2);
      }

      if (bloomU > 0.05 && (sg.depth === 4 || sg.depth === 5) && i % 2 === 0 && !isSevered) {
        drawGuillocheBloom(
          ctx, ex, ey,
          (sg.depth === 4 ? 32 : 22) * bloomU + kick * 5,
          6, t * 1.8 + i,
          i % 4 === 0 ? C_CRIMSON : (isPaper ? C_COBALT : C_CYAN),
          C_GOLD,
          bg
        );
      }

      ctx.restore();
    }

    ctx.restore(); // end camera transform

    // 4. Hurtling Foreground Severed Draft Cards with Vermilion Strike-Slashes
    if (pruneProg > 0.02 || subCut >= 5) {
      const cardActive = clamp((t - 65.85) / 2.6, 0, 1);
      const nCards = 14;
      for (let c = 0; c < nCards; c++) {
        const life = ((cardActive * 3.4 + c * 0.21) % 1);
        if (life < 0.05) continue;
        const persp = Math.pow(life, 2.2);
        const ang = (c / nCards) * Math.PI * 2 + 0.35;
        const cxCard = W * 0.5 + Math.cos(ang) * (120 + persp * 1150);
        const cyCard = H * 0.48 + Math.sin(ang) * (70 + persp * 680);
        if (cxCard < -220 || cxCard > W + 220 || cyCard < -140 || cyCard > H + 140) continue;

        const sc = 0.32 + persp * 1.55;
        ctx.save();
        ctx.translate(cxCard, cyCard);
        ctx.rotate(ang * 0.4 + life * (c % 2 === 0 ? 1.8 : -1.8));
        ctx.scale(sc, sc);

        const cw = 216, ch = 64;
        ctx.fillStyle = isPaper ? C_BONE : C_CARD;
        ctx.fillRect(-cw * 0.5, -ch * 0.5, cw, ch);
        ctx.strokeStyle = isPaper ? C_DARK : C_SLATE;
        ctx.lineWidth = 2.8;
        ctx.strokeRect(-cw * 0.5, -ch * 0.5, cw, ch);

        ctx.strokeStyle = C_CRIMSON;
        ctx.lineWidth = 3.6;
        ctx.beginPath();
        ctx.moveTo(-cw * 0.46, ch * 0.42);
        ctx.lineTo(cw * 0.46, -ch * 0.42);
        ctx.stroke();

        ctx.fillStyle = isPaper ? C_DARK : C_BONE;
        ctx.font = MONO(700, 14);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(PRUNED_TAGS[c % PRUNED_TAGS.length], 0, 0);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // Autonomous Per-Character Woodblock & Katana-Cleaved Renderer (#53)
  function drawL11BranchVocalTokens(ctx, core, cue, t, isPaper, kick) {
    const words = (cue && cue.words) ? cue.words : [];
    if (!words.length) return;
    const { clamp, ease, pulse } = core;

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const sp = L11_LAYOUT[Math.min(i, L11_LAYOUT.length - 1)];

      if (t < w.start) {
        continue;
      }

      const dt = t - w.start;
      const enterU = ease.outBack(clamp(dt / 0.17, 0, 1));
      const hitP = pulse(t, w.start, 0.13);
      const isSinging = t <= (w.end || w.start + 0.30) + 0.08;

      const curX = sp.x + sp.dx * (1 - enterU);
      const curY = sp.y + sp.dy * (1 - enterU) + Math.sin(t * 4.4 + i * 1.5) * 5;
      const sc = (0.38 + 0.62 * clamp(enterU, 0, 1.15)) * (1 + hitP * 0.26 + kick * 0.05);
      const sz = sp.sz;

      ctx.save();
      ctx.translate(curX, curY);
      ctx.rotate(sp.rot + hitP * (i % 2 === 0 ? -0.10 : 0.10));
      ctx.scale(sc, sc);

      ctx.font = sp.kanji ? JA_SERIF(900, sz) : JA_SANS(900, sz);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const gw = Math.max(sz * 0.80, ctx.measureText(w.w).width);
      const bw = gw + (sp.kanji ? 32 : 20);
      const bh = sz * 0.94 + (sp.kanji ? 16 : 10);
      const activeCol = isSinging ? C_CRIMSON : sp.col;

      if (sp.style === 'circle') {
        const rad = Math.max(gw, sz) * 0.56;
        ctx.fillStyle = activeCol === C_CYAN && isPaper ? C_COBALT : activeCol;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isPaper ? C_DARK : C_BONE;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = activeCol === C_GOLD ? C_DARK : C_BONE;
        ctx.fillText(w.w, 0, sz * 0.04);
      } else if (sp.style === 'stamp' || sp.style === 'hero' || sp.style === 'katana' || isSinging) {
        ctx.fillStyle = isPaper ? C_DARK : C_GOLD;
        ctx.fillRect(-bw * 0.5 + 9, -bh * 0.5 + 9, bw, bh);
        ctx.fillStyle = activeCol;
        ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
        ctx.strokeStyle = C_BONE;
        ctx.lineWidth = 3.5;
        ctx.strokeRect(-bw * 0.5 + 5, -bh * 0.5 + 5, bw - 10, bh - 10);
        ctx.fillStyle = activeCol === C_GOLD ? C_DARK : C_BONE;
        ctx.fillText(w.w, 0, sz * 0.04);

        if (sp.style === 'katana') {
          ctx.strokeStyle = C_GOLD;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-bw * 0.68, bh * 0.48);
          ctx.lineTo(bw * 0.68, -bh * 0.48);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = activeCol === C_BONE ? C_CRIMSON : activeCol;
        ctx.fillRect(-bw * 0.5 + 6, -bh * 0.5 + 6, bw, bh);
        ctx.fillStyle = isPaper ? C_BONE : C_CARD;
        ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
        ctx.strokeStyle = isPaper ? C_DARK : C_CYAN;
        ctx.lineWidth = 2.8;
        ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
        ctx.fillStyle = isPaper ? C_DARK : C_BONE;
        ctx.fillText(w.w, 0, sz * 0.04);
      }
      ctx.restore();

      if (dt < 0.20) {
        core.drawSparkHead(ctx, curX + bw * 0.38, curY - bh * 0.38, t, 1.55, 1.0, { fg: C_GOLD, bg: C_CRIMSON });
      }
    }
  }

  window.registerCortexPlate('P22_katana_branch_foom', {
    render(ctx, arg2, arg3) {
      const core = (arg3 && arg3.W) ? arg3 : window.CortexPDoomCore;
      const st = (typeof arg2 === 'number') ? { ...(arg3 || {}), t: arg2 } : (arg2 || { t: 62.36 });
      const { W, H, clamp, lerp, prog, ease, beatAt } = core;

      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const snare = st.snareSnap ?? st.snareEnv ?? st.snare ?? 0;
      const cue = core.cueById('L11_THOUSAND_BRANCHES');
      const beat = beatAt(t);

      let subCut = 0;
      if (t < 63.20) subCut = 0;
      else if (t < 64.05) subCut = 1;
      else if (t < 64.90) subCut = 2;
      else if (t < 65.75) subCut = 3;
      else if (t < 66.636) subCut = 4;
      else if (t < 67.50) subCut = 5;
      else if (t < 68.18) subCut = 6;
      else subCut = 7;

      const isPaper = (subCut === 0 || subCut === 2 || subCut === 4 || subCut === 6);
      const bg = isPaper ? C_PAPER : C_DARK;
      const fg = isPaper ? C_DARK : C_CRIMSON;

      const camFn = (c) => {
        if (subCut === 0) {
          const u = prog(t, 62.36, 63.20, ease.outExpo);
          const z = lerp(1.38, 1.02, u) + kick * 0.05;
          c.translate(W * 0.5, H * 0.72);
          c.scale(z, z);
          c.translate(-W * 0.5, -H * 0.72);
        } else if (subCut === 1) {
          const u = prog(t, 63.20, 64.05, ease.outExpo);
          const z = lerp(0.84, 1.14, u) + kick * 0.07;
          c.translate(W * 0.5, H * 0.52);
          c.rotate(lerp(-0.18, 0.0, u));
          c.scale(z, z);
          c.translate(-W * 0.5, -H * 0.52);
        } else if (subCut === 2) {
          const u = prog(t, 64.05, 64.90, ease.outExpo);
          const z = lerp(1.15, 1.62, u) + kick * 0.06;
          c.translate(W * 0.5, H * 0.36);
          c.rotate(lerp(0.24, 0.06, u));
          c.scale(z, z);
          c.translate(-W * 0.5, -H * 0.36);
        } else if (subCut === 3) {
          const u = prog(t, 64.90, 65.75, ease.outExpo);
          c.translate(W * 0.5, H * 0.48);
          c.rotate(lerp(-0.28, -0.08, u));
          c.scale(1.22 + kick * 0.06, 1.22 + kick * 0.06);
          c.translate(-W * 0.5, -H * 0.48);
        } else if (subCut === 4) {
          const u = prog(t, 65.75, 66.636, ease.inOutCubic);
          c.translate(W * 0.5, H * 0.5);
          c.scale(lerp(1.0, 1.26, u), lerp(1.0, 1.26, u));
          c.translate(-W * 0.5, -H * 0.5);
        } else if (subCut === 5 || subCut === 6) {
          const z = 1.10 + kick * 0.08 + snare * 0.06;
          c.translate(W * 0.5, H * 0.5);
          c.rotate(subCut === 5 ? -0.10 : 0.12);
          c.scale(z, z);
          c.translate(-W * 0.5, -H * 0.5);
        } else {
          const u = prog(t, 68.18, 68.73, ease.inOutExpo);
          const z = lerp(1.05, 1.75, u);
          c.translate(W * 0.5, H * 0.55);
          c.scale(z, z);
          c.translate(-W * 0.5, -H * 0.55);
        }
      };

      const wSenteiStart = (cue && cue.words && cue.words[9]) ? cue.words[9].start : 66.636;
      const pruneProg = clamp((t - wSenteiStart) / 1.45, 0, 1);

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      drawFoomWorld(ctx, core, t, subCut, isPaper, kick, pruneProg, camFn);

      if (subCut === 5 || subCut === 6) {
        const slashU = subCut === 5
          ? ease.outExpo(clamp((t - 66.636) / 0.22, 0, 1))
          : ease.outExpo(clamp((t - 67.50) / 0.22, 0, 1));
        const slashSlope = subCut === 5 ? -360 : 340;
        const midY = H * 0.50;
        const shearShift = slashU * 44;

        // Lower half cleaved & flipped to opposite paper/dark state along razor Katana line!
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-120, midY - slashSlope * 0.5);
        ctx.lineTo(W + 120, midY + slashSlope * 0.5);
        ctx.lineTo(W + 120, H + 120);
        ctx.lineTo(-120, H + 120);
        ctx.closePath();
        ctx.clip();

        ctx.translate(shearShift, 8);
        drawFoomWorld(ctx, core, t, subCut, !isPaper, kick, pruneProg, camFn);
        ctx.restore();

        // Blazing Crimson + Gold + Bone-White Katana Blade Flash Seam!
        ctx.save();
        const bladeW = lerp(34, 10, slashU) + kick * 8;
        ctx.strokeStyle = C_CRIMSON;
        ctx.lineWidth = bladeW;
        ctx.beginPath();
        ctx.moveTo(-80, midY - slashSlope * 0.5);
        ctx.lineTo(-80 + (W + 160) * slashU, midY - slashSlope * 0.5 + slashSlope * slashU);
        ctx.stroke();

        ctx.strokeStyle = C_GOLD;
        ctx.lineWidth = Math.max(4, bladeW * 0.48);
        ctx.stroke();

        ctx.strokeStyle = C_BONE;
        ctx.lineWidth = Math.max(2, bladeW * 0.20);
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.strokeStyle = isPaper ? C_DARK : C_SLATE;
      ctx.lineWidth = 2.4;
      ctx.strokeRect(48, 38, W - 96, H - 102);

      const branchCount = t < wSenteiStart
        ? Math.min(4096, Math.round(Math.pow(2, clamp((t - 62.36) * 3.4, 0, 12))))
        : Math.max(1, Math.round(lerp(4096, 1, ease.outExpo(pruneProg))));
      const tempVal = lerp(29.8, 30.9, prog(t, 62.36, 68.73));

      ctx.fillStyle = C_DARK;
      ctx.fillRect(68, 52, 548, 34);
      ctx.strokeStyle = C_GOLD;
      ctx.lineWidth = 2.0;
      ctx.strokeRect(68, 52, 548, 34);
      ctx.fillStyle = C_GOLD;
      ctx.font = MONO(800, 15);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `COT_FOOM // ACTIVE_BRANCHES: ${String(branchCount).padStart(4, '0')} // TEMP: ${tempVal.toFixed(1)}°C`,
        80, 69
      );

      ctx.fillStyle = C_CRIMSON;
      ctx.fillRect(W - 430, 52, 362, 34);
      ctx.fillStyle = C_BONE;
      ctx.textAlign = 'right';
      ctx.fillText(
        `CUT 0${subCut + 1}/08 · BEAT ${beat.toFixed(1)} · KATANA_PRUNE`,
        W - 80, 69
      );
      ctx.restore();

      drawL11BranchVocalTokens(ctx, core, cue, t, isPaper, kick);

      ctx.restore();
      return {
        bg,
        fg: isPaper ? C_DARK : C_BONE,
        duotone: { bg, fg },
        isPaper,
        bloom: 0.42,
        ca: 0,
        flash: 0,
        shake: 0
      };
    }
  });
})();
