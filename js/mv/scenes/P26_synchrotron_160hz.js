// ============================================================================
// Plate 26 — `P26_synchrotron_160hz.js` (`116.40s – 123.17s`)
// Upgraded per #52 (Multi-Layer Architectural & Complementary Accent Palette)
// and #53 (Autonomous Per-Character PV Choreography — ZERO flat horizontal rows!):
//   - Layered Palette: Deep Ink `#08090C` + Chamber Panel `#121723` + Graphite
//     `#475569` / Slate `#94A3B8` Swiss grids & burin hatching + Synchrotron Gold
//     `#FBBF24` + Relativistic Crimson `#FF2E55` & Cherenkov Cyan `#38BDF8` &
//     Cobalt `#0376B8` sparks + Archival Paper `#F5F0E6` / Bone `#FAF8F5`!
//   - Zero `shadowBlur`, zero translucent `rgba`, zero gradients, zero `#FF9EBB`!
//   - 10 High-Velocity 193.5 BPM Sub-Cuts (`0.58s – 0.73s` each) with per-token
//     `w.start` autonomous 2D scatter/orbit/diagonal-cascade slams!
// ============================================================================
(function () {
  'use strict';

  const INK     = '#08090C';
  const PANEL   = '#121723';
  const SLATE   = '#475569';
  const SILVER  = '#94A3B8';
  const PAPER   = '#F5F0E6';
  const BONE    = '#FAF8F5';
  const GOLD    = '#FBBF24';
  const CRIMSON = '#FF2E55';
  const EMBER   = '#FF8A3D';
  const CYAN    = '#38BDF8';
  const COBALT  = '#0376B8';

  const JA_DISP = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Inter", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", sans-serif`;
  const MONO_FONT = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", monospace`;

  function resolveArgs(arg1, arg2) {
    const core = (arg2 && arg2.W) ? arg2 : window.CortexPDoomCore;
    const st = (typeof arg1 === 'number')
      ? (arg2 && typeof arg2 === 'object' ? { ...arg2, t: arg1 } : { t: arg1 })
      : (arg1 || { t: 0 });
    return { st, core };
  }

  function drawBurinRect(ctx, x, y, w, h, angle, spacing, lineW, col) {
    if (w <= 1 || h <= 1) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.translate(x + w * 0.5, y + h * 0.5);
    ctx.rotate(angle);
    const diag = Math.hypot(w, h) * 0.55;
    const step = Math.max(3, spacing);
    ctx.strokeStyle = col;
    ctx.lineWidth = lineW;
    ctx.beginPath();
    for (let p = -diag; p <= diag; p += step) {
      ctx.moveTo(-diag, p);
      ctx.lineTo(diag, p);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawGuilloche(ctx, cx, cy, R, r, d, loops, steps, col, lineW, phase = 0) {
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = lineW;
    ctx.beginPath();
    const maxT = Math.PI * 2 * loops;
    const k = (R - r) / r;
    for (let i = 0; i <= steps; i++) {
      const th = (i / steps) * maxT;
      const px = cx + (R - r) * Math.cos(th + phase) + d * Math.cos(k * th - phase);
      const py = cy + (R - r) * Math.sin(th + phase) - d * Math.sin(k * th - phase);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawSwissSynchroHud(ctx, W, H, isLight, primaryCol, accentCol, cutTag, freqHz, tempC, beat) {
    const frameCol = isLight ? INK : SILVER;
    const badgeBg  = isLight ? INK : PANEL;
    const badgeFg  = isLight ? BONE : BONE;
    ctx.save();
    ctx.strokeStyle = frameCol;
    ctx.lineWidth = 2;

    const x0 = 54, y0 = 38, x1 = W - 54, y1 = H - 108;
    const arm = 28;
    ctx.beginPath();
    ctx.moveTo(x0, y0 + arm); ctx.lineTo(x0, y0); ctx.lineTo(x0 + arm, y0);
    ctx.moveTo(x1 - arm, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + arm);
    ctx.moveTo(x0, y1 - arm); ctx.lineTo(x0, y1); ctx.lineTo(x0 + arm, y1);
    ctx.moveTo(x1 - arm, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - arm);
    ctx.stroke();

    ctx.strokeStyle = isLight ? SLATE : SLATE;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let x = x0 + 48; x <= x1 - 48; x += 24) {
      const th = (x % 96 === 0) ? 11 : 5;
      ctx.moveTo(x, y0); ctx.lineTo(x, y0 + th);
    }
    for (let y = y0 + 40; y <= y1 - 40; y += 24) {
      const tw = (y % 96 === 0) ? 10 : 5;
      ctx.moveTo(x0, y); ctx.lineTo(x0 + tw, y);
      ctx.moveTo(x1, y); ctx.lineTo(x1 - tw, y);
    }
    ctx.stroke();

    ctx.font = MONO_FONT(700, 15);
    ctx.textBaseline = 'middle';
    const leftTxt = `P26 // ${cutTag} · B:${beat.toFixed(1)}`;
    const rightTxt = `RF:${freqHz.toFixed(2)}Hz // CORE_TEMP:${tempC.toFixed(2)}°C`;

    const lw = ctx.measureText(leftTxt).width + 24;
    ctx.fillStyle = badgeBg;
    ctx.strokeStyle = primaryCol;
    ctx.lineWidth = 2;
    ctx.fillRect(x0 + 36, y0 - 12, lw, 24);
    ctx.strokeRect(x0 + 36, y0 - 12, lw, 24);
    ctx.fillStyle = primaryCol;
    ctx.fillRect(x0 + 36, y0 - 12, 6, 24);
    ctx.fillStyle = badgeFg;
    ctx.textAlign = 'left';
    ctx.fillText(leftTxt, x0 + 50, y0 + 1);

    const rw = ctx.measureText(rightTxt).width + 24;
    ctx.fillStyle = accentCol;
    ctx.fillRect(x1 - 36 - rw, y0 - 12, rw, 24);
    ctx.strokeStyle = INK;
    ctx.strokeRect(x1 - 36 - rw, y0 - 12, rw, 24);
    ctx.fillStyle = (accentCol === GOLD || accentCol === CYAN) ? INK : BONE;
    ctx.textAlign = 'right';
    ctx.fillText(rightTxt, x1 - 46, y0 + 1);
    ctx.restore();
  }

  function drawAutonomousSynchroGlyph(ctx, ch, spec, wd, t, kick, isLight) {
    const dt = t - wd.start;
    const { x, y, sz, rot, boxType, enterAng } = spec;

    if (dt < 0) {
      // V6.2: Removed floating square pre-aim reticles for clean 3D optics
      return;
    }

    const dur = Math.max(0.20, (wd.end || wd.start + 0.24) - wd.start);
    const isSinging = dt <= dur + 0.08;
    const slamFn = (window.CortexV6 && window.CortexV6.aeSlam) ? window.CortexV6.aeSlam : ((u) => 1 - Math.pow(1 - u, 3));
    const u = Math.min(1, dt / 0.12);
    const back = slamFn(u);

    const flyDist = (1 - Math.min(1, dt / 0.09)) * 120;
    const px = x + Math.cos(enterAng) * flyDist;
    const py = y + Math.sin(enterAng) * flyDist;
    const liveRot = rot + (1 - u) * (spec.seed % 2 === 0 ? 0.28 : -0.28);
    const sc = (0.45 + 0.55 * back) * (1 + (isSinging ? 0.09 : 0) + kick * 0.05);

    const v6 = window.CortexV6;
    if (v6 && typeof v6.drawEditorialStamp === 'function') {
      const kind = boxType === 1 ? 'seal' : (boxType === 2 ? 'bare' : (isSinging ? 'accent' : 'frosted'));
      v6.drawEditorialStamp(ctx, ch, px, py, sz, liveRot, {
        kind,
        isPaper: false,
        isHot: isSinging,
        scX: sc,
        scY: sc
      });
      return;
    }

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(liveRot);
    ctx.scale(sc, sc);

    // High-saturation complementary spark burst while actively sung (#52 + #53)
    if (dt < 0.24) {
      const kSpk = dt / 0.24;
      const sparkCol = isSinging ? accent : secAccent;
      ctx.strokeStyle = sparkCol;
      ctx.fillStyle = sparkCol;
      ctx.lineWidth = 3.5;
      for (let a = 0; a < 10; a++) {
        const sa = (a / 10) * Math.PI * 2 + spec.seed * 0.4;
        const r0 = sz * (0.42 + kSpk * 0.28);
        const r1 = sz * (0.64 + kSpk * 0.52);
        ctx.beginPath();
        ctx.moveTo(Math.cos(sa) * r0, Math.sin(sa) * r0);
        ctx.lineTo(Math.cos(sa) * r1, Math.sin(sa) * r1);
        ctx.stroke();
        if (a % 2 === 0) {
          ctx.fillRect(Math.cos(sa) * (r1 + 8) - 4, Math.sin(sa) * (r1 + 8) - 4, 8, 8);
        }
      }
    }

    ctx.font = JA_DISP(900, sz);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const mw = Math.max(sz * 0.56, ctx.measureText(ch).width + 26);
    const mh = sz * 1.08;

    // 4 Die-Cut Architectural Individual Block Styles (never monotonous!)
    if (boxType === 0) {
      // Solid Die-Cut Stamp Plaque with contrasting shadow block
      const fillC = isSinging ? accent : (isLight ? INK : GOLD);
      const txtC  = (fillC === GOLD || fillC === CYAN || fillC === BONE) ? INK : BONE;
      ctx.fillStyle = isLight ? COBALT : CRIMSON;
      ctx.fillRect(-mw * 0.5 + 10, -mh * 0.5 + 10, mw, mh);
      ctx.fillStyle = fillC;
      ctx.strokeStyle = isLight ? INK : BONE;
      ctx.lineWidth = 5;
      ctx.fillRect(-mw * 0.5, -mh * 0.5, mw, mh);
      ctx.strokeRect(-mw * 0.5, -mh * 0.5, mw, mh);
      ctx.fillStyle = txtC;
      ctx.fillText(ch, 0, 4);
    } else if (boxType === 1) {
      // Chamfered Octagonal / Seal Medallion Stamp
      const rOct = Math.max(mw, mh) * 0.54;
      const fillC = isSinging ? CRIMSON : (isLight ? GOLD : CYAN);
      const txtC  = (fillC === GOLD || fillC === CYAN) ? INK : BONE;
      ctx.fillStyle = INK;
      ctx.beginPath();
      for (let k = 0; k < 8; k++) {
        const oa = (k / 8) * Math.PI * 2 + Math.PI / 8;
        const ox = Math.cos(oa) * rOct + 9;
        const oy = Math.sin(oa) * rOct + 9;
        if (k === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = fillC;
      ctx.strokeStyle = isLight ? INK : BONE;
      ctx.lineWidth = 5;
      ctx.beginPath();
      for (let k = 0; k < 8; k++) {
        const oa = (k / 8) * Math.PI * 2 + Math.PI / 8;
        const ox = Math.cos(oa) * rOct;
        const oy = Math.sin(oa) * rOct;
        if (k === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = txtC;
      ctx.fillText(ch, 0, 4);
    } else if (boxType === 2) {
      // Naked 3D Isometric Extruded Monument Glyph (no box — pure spatial form!)
      const faceC = isSinging ? accent : (isLight ? INK : BONE);
      const extC  = isSinging ? GOLD : (isLight ? CRIMSON : CYAN);
      const collarC = isLight ? PAPER : INK;
      for (let s = 4; s >= 1; s--) {
        ctx.fillStyle = s === 4 ? extC : collarC;
        ctx.strokeStyle = extC;
        ctx.lineWidth = 4;
        ctx.lineJoin = 'miter';
        ctx.strokeText(ch, s * 5, s * 5);
        ctx.fillText(ch, s * 5, s * 5);
      }
      ctx.strokeStyle = collarC;
      ctx.lineWidth = Math.max(14, sz * 0.10);
      ctx.strokeText(ch, 0, 0);
      ctx.fillStyle = faceC;
      ctx.fillText(ch, 0, 0);
    } else {
      // Double-Ruled Technical Blueprint Frame with Corner Ticks
      const fillC = isSinging ? secAccent : (isLight ? BONE : PANEL);
      const txtC  = isSinging ? INK : (isLight ? INK : GOLD);
      ctx.fillStyle = fillC;
      ctx.strokeStyle = isSinging ? BONE : CYAN;
      ctx.lineWidth = 4.5;
      ctx.fillRect(-mw * 0.5, -mh * 0.5, mw, mh);
      ctx.strokeRect(-mw * 0.5, -mh * 0.5, mw, mh);
      ctx.strokeStyle = CRIMSON;
      ctx.lineWidth = 2;
      ctx.strokeRect(-mw * 0.5 + 8, -mh * 0.5 + 8, mw - 16, mh - 16);
      ctx.fillStyle = txtC;
      ctx.fillText(ch, 0, 4);
    }

    ctx.restore();
  }

  // Render S02 instrumental telemetry tokens (`// 1 9 3 B P M _ D R O P ]`) along a
  // sweeping curved cyclotron orbital arc + staggered angled badges (NO flat bottom rail!)
  function drawS02OrbitalTokens(ctx, s02Words, t, W, H, isLight, kick) {
    if (!s02Words || !s02Words.length) return;
    const sub = s02Words.filter((w) => w.end >= 116.35);
    if (!sub.length) return;

    const palette = [GOLD, CYAN, CRIMSON, EMBER];
    ctx.save();
    for (let i = 0; i < sub.length; i++) {
      const wd = sub[i];
      const f = i / Math.max(1, sub.length - 1);
      // Curved elliptical trajectory across lower-to-mid flanks (`y = 720..860`, staggered!)
      const ang = Math.PI * 0.86 - f * Math.PI * 0.72;
      const rx = 740;
      const ry = 215;
      const gx = W * 0.5 + Math.cos(ang) * rx;
      const gy = 650 + Math.sin(ang) * ry + (i % 2 === 0 ? -24 : 22);
      const rot = (f - 0.5) * 0.34 + (i % 2 === 0 ? -0.08 : 0.08);
      const dt = t - wd.start;
      const acc = palette[i % palette.length];

      if (dt < 0) {
        ctx.strokeStyle = isLight ? SLATE : SLATE;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(gx, gy, 8, 0, Math.PI * 2);
        ctx.stroke();
        continue;
      }

      const activeNow = dt < 0.26;
      const pop = Math.min(1, dt / 0.09);
      const sc = (0.48 + 0.52 * pop) * (activeNow ? 1.24 + kick * 0.10 : 1.0);

      ctx.save();
      ctx.translate(gx, gy - (1 - pop) * 36);
      ctx.rotate(rot);
      ctx.scale(sc, sc);

      const bw = 66, bh = 66;
      ctx.fillStyle = INK;
      ctx.fillRect(-bw * 0.5 + 5, -bh * 0.5 + 5, bw, bh);
      ctx.fillStyle = activeNow ? acc : (isLight ? BONE : PANEL);
      ctx.strokeStyle = activeNow ? BONE : acc;
      ctx.lineWidth = 3.2;
      ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
      ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);

      ctx.font = MONO_FONT(800, 38);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = activeNow ? ((acc === GOLD || acc === CYAN) ? INK : BONE) : (isLight ? INK : BONE);
      ctx.fillText(wd.w, 0, 2);
      ctx.restore();
    }
    ctx.restore();
  }

  window.registerCortexPlate('P26_synchrotron_160hz', {
    render(ctx, arg1, arg2) {
      const { st, core } = resolveArgs(arg1, arg2);
      const { W, H, TAU, clamp, lerp, prog, ease, beatAt } = core;
      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const snare = st.snareSnap ?? st.snareEnv ?? st.snare ?? 0;
      const beat = beatAt(t);

      const cueS02 = core.cueById('S02_JCORE_DROP_A');
      const cueL21 = core.cueById('L21_TRACE_SYNC');
      const s02Words = (cueS02 && cueS02.words) || [];
      const l21Words = (cueL21 && cueL21.words) || [];

      const tTrace = l21Words[0] ? l21Words[0].start : 120.730;
      const tSync  = l21Words[6] ? l21Words[6].start : 121.426;
      const t160   = l21Words[11] ? l21Words[11].start : 122.006;
      const tHertz = l21Words[14] ? l21Words[14].start : 122.354;

      let bg = INK;
      let fg = GOLD;
      let isLight = false;
      let shake = 0;

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // V6.2: Full-Bleed 60fps Blender 5.2 3D Brushed-Steel & Crystal Synchrotron Dive (`B3D_03_synchro`)!
      const v6 = window.CortexV6;
      const drew3D = v6 && typeof v6.draw3DClipFrame === 'function' && v6.draw3DClipFrame(ctx, 'B3D_03_synchro', t, {
        kick,
        kickZoom: 0.020,
        scrim: 0.22,
        isPaper: false
      });

      if (drew3D) {
        bg = INK;
        fg = CYAN;
        isLight = false;
        const uAll = clamp((t - 116.40) / (123.17 - 116.40), 0, 1);
        const freqNow = lerp(72.0, 160.0, uAll);

        // 2D+3D Fusion 1: Perspective-matched 2D anime cel speed-lines + subtle guilloche resonance halo around 3D tunnel!
        if (typeof v6.draw2D3DAtmosphereBridge === 'function') {
          v6.draw2D3DAtmosphereBridge(ctx, {
            t,
            kick,
            vpX: W * 0.5,
            vpY: H * 0.48,
            rollRad: Math.sin(t * 2.2) * 0.22,
            speedLines: t < tTrace ? 26 : 38,
            speedAlpha: t < tTrace ? 0.24 : 0.34,
            motes: 20,
            moteAlpha: 0.72,
            accent: '#ECC16E'
          });
        }
        ctx.save();
        ctx.globalAlpha = 0.24 + kick * 0.12;
        drawGuilloche(ctx, W * 0.5, H * 0.48, 390 + kick * 24, 78, 180, 4, 240, GOLD, 1.5, t * 2.4);
        ctx.restore();

        if (t < tTrace) {
          drawS02OrbitalTokens(ctx, s02Words, t, W, H, false, kick);
          drawSwissSynchroHud(ctx, W, H, false, CYAN, GOLD, '3D_SYNCHROTRON // 160HZ_DIVE', freqNow, 36.2 + uAll * 0.35, beat);
          shake = kick * 0.25;
        } else if (t < tSync) {
          // V7: Pure 2D Harmonic Spectrum Slash Band (ZERO C12 duplicate)
          const sp1 = clamp((t - tTrace) / 0.28, 0, 1);
          ctx.save();
          ctx.globalAlpha = 0.86 * (1 - sp1 * 0.25);
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(W - 420 * sp1, 140, 420, 14);
          ctx.fillStyle = '#FBBF24';
          ctx.fillRect(W - 320 * sp1, 162, 320, 6);
          ctx.restore();
          const traceSpecs = [
            { x: 430,  y: 655, sz: 255, rot: -0.20, boxType: 0, enterAng: 2.2,  seed: 1 },
            { x: 675,  y: 545, sz: 230, rot:  0.14, boxType: 2, enterAng: -1.4, seed: 2 },
            { x: 925,  y: 625, sz: 265, rot: -0.15, boxType: 1, enterAng: 1.6,  seed: 3 },
            { x: 1170, y: 465, sz: 240, rot:  0.18, boxType: 0, enterAng: -0.9, seed: 4 },
            { x: 1410, y: 555, sz: 250, rot: -0.12, boxType: 0, enterAng: 0.5,  seed: 5 },
            { x: 1655, y: 355, sz: 330, rot:  0.22, boxType: 1, enterAng: -1.8, seed: 6 }
          ];
          for (let k = 0; k < traceSpecs.length && k < l21Words.length; k++) {
            drawAutonomousSynchroGlyph(ctx, l21Words[k].w, traceSpecs[k], l21Words[k], t, kick, false);
          }
          drawSwissSynchroHud(ctx, W, H, false, CYAN, CRIMSON, '3D_SYNCHROTRON // HAMMER_01_TRACE', 160.00, 36.50, beat);
          shake = 0.45 + kick * 0.30;
        } else if (t < t160) {
          // V7: Pure 2D Harmonic Spectrum Slash Band (ZERO C13 duplicate)
          const sp2 = clamp((t - tSync) / 0.28, 0, 1);
          ctx.save();
          ctx.globalAlpha = 0.86 * (1 - sp2 * 0.25);
          ctx.fillStyle = '#FBBF24';
          ctx.fillRect(W - 440 * sp2, H - 175, 440, 12);
          ctx.restore();
          const syncSpecs = [
            { x: 390,  y: 445, sz: 295, rot: -0.18, boxType: 0, enterAng: 3.0,  seed: 11 },
            { x: 710,  y: 595, sz: 260, rot:  0.16, boxType: 1, enterAng: 1.5,  seed: 12 },
            { x: 1025, y: 410, sz: 285, rot: -0.13, boxType: 2, enterAng: -1.5, seed: 13 },
            { x: 1320, y: 585, sz: 265, rot:  0.20, boxType: 0, enterAng: 1.3,  seed: 14 },
            { x: 1595, y: 435, sz: 340, rot:  0.22, boxType: 1, enterAng: -0.4, seed: 15 }
          ];
          for (let k = 0; k < syncSpecs.length && (6 + k) < l21Words.length; k++) {
            drawAutonomousSynchroGlyph(ctx, l21Words[6 + k].w, syncSpecs[k], l21Words[6 + k], t, kick, false);
          }
          drawSwissSynchroHud(ctx, W, H, false, CYAN, GOLD, '3D_SYNCHROTRON // HAMMER_02_SYNC', 160.00, 36.52, beat);
          shake = 0.50 + kick * 0.30;
        } else if (t < tHertz) {
          // V7: Pure 2D Harmonic Spectrum Slash Band (ZERO C14 duplicate)
          const sp3 = clamp((t - t160) / 0.28, 0, 1);
          ctx.save();
          ctx.globalAlpha = 0.88 * (1 - sp3 * 0.22);
          ctx.fillStyle = '#FF2E55';
          ctx.fillRect(W - 460 * sp3, 210, 460, 16);
          ctx.restore();
          const numSpecs = [
            { x: 540,  y: 340, sz: 325, rot: -0.18, boxType: 0, enterAng: -2.2, seed: 21 },
            { x: 960,  y: 495, sz: 365, rot:  0.11, boxType: 1, enterAng: 1.57, seed: 22 },
            { x: 1385, y: 635, sz: 335, rot: -0.15, boxType: 0, enterAng: 0.6,  seed: 23 }
          ];
          for (let k = 0; k < numSpecs.length && (11 + k) < l21Words.length; k++) {
            drawAutonomousSynchroGlyph(ctx, l21Words[11 + k].w, numSpecs[k], l21Words[11 + k], t, kick, false);
          }
          drawSwissSynchroHud(ctx, W, H, false, GOLD, CRIMSON, '3D_SYNCHROTRON // 160_HARMONIC', 160.00, 36.55, beat);
          shake = 0.52 + kick * 0.30;
        } else {
          // V7: Pure 2D Harmonic Spectrum Slash Band (ZERO C16 duplicate)
          const sp4 = clamp((t - tHertz) / 0.28, 0, 1);
          ctx.save();
          ctx.globalAlpha = 0.88 * (1 - sp4 * 0.22);
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(0, 128, 460 * sp4, 14);
          ctx.restore();
          const hertzSpecs = [
            { x: 325,  y: 545, sz: 280, rot: -0.17, boxType: 0, enterAng: 2.8,  seed: 31 },
            { x: 605,  y: 415, sz: 245, rot:  0.15, boxType: 2, enterAng: -1.6, seed: 32 },
            { x: 885,  y: 625, sz: 275, rot: -0.14, boxType: 1, enterAng: 1.5,  seed: 33 },
            { x: 1165, y: 435, sz: 260, rot:  0.18, boxType: 0, enterAng: -1.2, seed: 34 },
            { x: 1430, y: 615, sz: 270, rot: -0.16, boxType: 0, enterAng: 1.1,  seed: 35 },
            { x: 1675, y: 455, sz: 355, rot:  0.22, boxType: 1, enterAng: -0.3, seed: 36 }
          ];
          for (let k = 0; k < hertzSpecs.length && (14 + k) < l21Words.length; k++) {
            drawAutonomousSynchroGlyph(ctx, l21Words[14 + k].w, hertzSpecs[k], l21Words[14 + k], t, kick, false);
          }
          drawSwissSynchroHud(ctx, W, H, false, GOLD, CRIMSON, '3D_SYNCHROTRON // 160_HERTZ_LOCK', 160.00, 36.58, beat);
          shake = 0.58 + kick * 0.30;
        }

        ctx.restore();
        return {
          bg: INK,
          fg: CYAN,
          duotone: { bg: INK, fg: GOLD },
          isPaper: false,
          bloom: 0.22 + kick * 0.14,
          ca: 0,
          flash: 0,
          shake
        };
      }

      // ======================================================================
      // CUT 01 (`116.40 – 117.12s`): Engraved Cyclotron Injector (Fallback)
      // ======================================================================
      if (t < 117.12) {
        const u = prog(t, 116.40, 117.12, ease.outExpo);
        bg = INK;
        fg = GOLD;
        isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W * 0.5, cy = H * 0.44;
        // Recessed architectural accelerator chamber octagon (`#121723`)
        ctx.fillStyle = PANEL;
        ctx.strokeStyle = SLATE;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 460, 0, TAU);
        ctx.fill();
        ctx.stroke();

        // Kinetic synchrotron wavefront rings & rotating magnetic sector spokes (`#475569` + `#38BDF8`)
        for (let r = 0; r < 9; r++) {
          const rWave = 95 + (((r * 95 + t * 290) % 855 + 855) % 855);
          ctx.strokeStyle = (r % 3 === 0) ? COBALT : SLATE;
          ctx.lineWidth = (r % 3 === 0) ? 2.0 : 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, rWave, 0, TAU);
          ctx.stroke();
        }
        ctx.strokeStyle = SLATE;
        ctx.lineWidth = 1.3;
        for (let a = 0; a < 24; a++) {
          const ang = (a / 24) * TAU + t * 1.25;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * 85, cy + Math.sin(ang) * 85);
          ctx.lineTo(cx + Math.cos(ang) * 980, cy + Math.sin(ang) * 980);
          ctx.stroke();
        }

        // 8 Burin-Hatched Dipole Electromagnet Yokes (alternating Gold & Cyan coils!)
        const mainR = lerp(300, 385, u) + kick * 24;
        for (let m = 0; m < 8; m++) {
          const ang = (m / 8) * TAU - t * 1.5;
          const coilCol = (m % 2 === 0) ? GOLD : CYAN;
          ctx.save();
          ctx.translate(cx + Math.cos(ang) * mainR, cy + Math.sin(ang) * mainR);
          ctx.rotate(ang);
          ctx.fillStyle = INK;
          ctx.strokeStyle = coilCol;
          ctx.lineWidth = 3.5;
          ctx.fillRect(-44, -32, 88, 64);
          drawBurinRect(ctx, -40, -28, 80, 56, 0.65, 6, 1.6, coilCol);
          ctx.strokeRect(-44, -32, 88, 64);
          ctx.restore();
        }

        // 160-tooth precision cyclotron degree ring in Gold + Crimson cardinal markers
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let k = 0; k < 160; k++) {
          const ang = (k / 160) * TAU + t * 2.6;
          const rIn = mainR - (k % 5 === 0 ? 22 : 10);
          ctx.moveTo(cx + Math.cos(ang) * rIn, cy + Math.sin(ang) * rIn);
          ctx.lineTo(cx + Math.cos(ang) * (mainR + 6), cy + Math.sin(ang) * (mainR + 6));
        }
        ctx.stroke();

        // Central Banknote Guilloché Beam Rosette (Cyan + Gold dual lacework!) + Crimson Spark Head
        drawGuilloche(ctx, cx, cy, 240, 60, 135, 4, 340, CYAN, 1.5, -t * 3.4);
        drawGuilloche(ctx, cx, cy, 200, 50, 110, 4, 320, GOLD, 1.8, t * 4.4);
        const beamAng = t * 18.0;
        const bx = cx + Math.cos(beamAng) * mainR;
        const by = cy + Math.sin(beamAng) * mainR;
        ctx.fillStyle = CRIMSON;
        ctx.beginPath();
        ctx.arc(bx, by, 22 + kick * 10, 0, TAU);
        ctx.fill();
        ctx.fillStyle = BONE;
        ctx.beginPath();
        ctx.arc(bx, by, 9, 0, TAU);
        ctx.fill();

        drawS02OrbitalTokens(ctx, s02Words, t, W, H, false, kick);
        drawSwissSynchroHud(ctx, W, H, false, GOLD, CRIMSON, 'CUT_01 // CYCLOTRON_INJECTOR', lerp(64, 98, u), 36.20, beat);
        shake = kick * 0.25;
      }

      // ======================================================================
      // CUT 02 (`117.12 – 117.84s`): 3D Curved Synchrotron Beam-Pipe Dive (`#F5F0E6`)
      // ======================================================================
      else if (t < 117.84) {
        bg = PAPER;
        fg = INK;
        isLight = true;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const speed = (t - 117.12) * 14.0;
        for (let i = 34; i >= 1; i--) {
          const z = ((i - (speed % 1)) / 34);
          const invZ = 1 / Math.max(0.06, z * 1.35);
          const rad = 175 * invZ;
          const bendX = W * 0.5 + Math.pow(1 - z, 2) * 340 - (z * 160);
          const bendY = H * 0.44 + Math.sin(z * 4 + t * 6) * 36;

          ctx.strokeStyle = (i % 6 === 0) ? CRIMSON : (i % 3 === 0 ? COBALT : INK);
          ctx.lineWidth = Math.min(6.5, 0.9 * invZ);
          ctx.beginPath();
          ctx.ellipse(bendX, bendY, rad * 1.32, rad * 0.88, 0.08 * (1 - z), 0, TAU);
          ctx.stroke();

          if (i % 4 === 0 && rad > 45 && rad < 1100) {
            ctx.strokeStyle = SLATE;
            for (let b = 0; b < 12; b++) {
              const a = (b / 12) * TAU + z * 2.0;
              ctx.beginPath();
              ctx.moveTo(bendX + Math.cos(a) * rad * 1.32, bendY + Math.sin(a) * rad * 0.88);
              ctx.lineTo(bendX + Math.cos(a) * rad * 1.46, bendY + Math.sin(a) * rad * 0.98);
              ctx.stroke();
            }
          }
        }

        // Relativistic Cherenkov + Crimson particle tracks converging into portal
        for (let s = 0; s < 16; s++) {
          const a = (s / 16) * TAU + t * 1.8;
          ctx.strokeStyle = (s % 4 === 0) ? CRIMSON : (s % 2 === 0 ? COBALT : INK);
          ctx.lineWidth = (s % 4 === 0) ? 3.2 : 1.8;
          ctx.beginPath();
          for (let stp = 0; stp <= 18; stp++) {
            const z = Math.max(0.06, stp / 18);
            const invZ = 1 / (z * 1.35);
            const rad = 175 * invZ;
            const bendX = W * 0.5 + Math.pow(1 - z, 2) * 340 - (z * 160);
            const bendY = H * 0.44 + Math.sin(z * 4 + t * 6) * 36;
            const px = bendX + Math.cos(a) * rad * 1.32;
            const py = bendY + Math.sin(a) * rad * 0.88;
            if (stp === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }

        drawS02OrbitalTokens(ctx, s02Words, t, W, H, true, kick);
        drawSwissSynchroHud(ctx, W, H, true, COBALT, CRIMSON, 'CUT_02 // CURVED_BEAM_PIPE_DIVE', 112.4, 36.28, beat);
        shake = kick * 0.28;
      }

      // ======================================================================
      // CUT 03 (`117.84 – 118.56s`): Quadrupole Hyperbolic Magnet Cross-Section
      // ======================================================================
      else if (t < 118.56) {
        bg = INK;
        fg = GOLD;
        isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W * 0.5, cy = H * 0.44;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((t - 117.84) * 0.95);

        // Background slate field grid
        ctx.strokeStyle = SLATE;
        ctx.lineWidth = 1.2;
        for (let g = -900; g <= 900; g += 90) {
          ctx.beginPath();
          ctx.moveTo(g, -650); ctx.lineTo(g, 650);
          ctx.moveTo(-950, g); ctx.lineTo(950, g);
          ctx.stroke();
        }

        // 4 Burin-Hatched Hyperbolic Magnet Poles (North=Gold, South=Cyan!)
        for (let q = 0; q < 4; q++) {
          const poleCol = (q % 2 === 0) ? GOLD : CYAN;
          ctx.save();
          ctx.rotate((q * Math.PI) / 2);
          ctx.beginPath();
          ctx.moveTo(110, -980);
          ctx.quadraticCurveTo(115, 0, 110, 980);
          ctx.lineTo(980, 980);
          ctx.lineTo(980, -980);
          ctx.closePath();
          ctx.fillStyle = PANEL;
          ctx.fill();
          ctx.save();
          ctx.clip();
          drawBurinRect(ctx, 100, -680, 760, 1360, 0.78, 8, 2.0, poleCol);
          ctx.restore();
          ctx.strokeStyle = poleCol;
          ctx.lineWidth = 5;
          ctx.stroke();
          ctx.restore();
        }

        // Crimson Relativistic Crosshair Core Singularity
        const rPulse = 32 + kick * 28;
        ctx.fillStyle = CRIMSON;
        ctx.beginPath();
        ctx.arc(0, 0, rPulse, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();

        drawS02OrbitalTokens(ctx, s02Words, t, W, H, false, kick);
        drawSwissSynchroHud(ctx, W, H, false, CYAN, GOLD, 'CUT_03 // QUADRUPOLE_HYPERBOLA', 128.0, 36.34, beat);
        shake = kick * 0.30;
      }

      // ======================================================================
      // CUT 04 (`118.56 – 119.28s`): Exponential Luminosity Escalation (`#F5F0E6`)
      // ======================================================================
      else if (t < 119.28) {
        bg = PAPER;
        fg = INK;
        isLight = true;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const u = prog(t, 118.56, 119.28, ease.outCubic);
        // Fine Slate architectural graph paper
        ctx.strokeStyle = SILVER;
        ctx.lineWidth = 1.0;
        for (let gx = 100; gx <= W - 100; gx += 60) {
          ctx.beginPath(); ctx.moveTo(gx, 90); ctx.lineTo(gx, 800); ctx.stroke();
        }
        for (let gy = 110; gy <= 800; gy += 60) {
          ctx.beginPath(); ctx.moveTo(100, gy); ctx.lineTo(W - 100, gy); ctx.stroke();
        }

        const nBars = 22;
        const x0 = 130, x1 = W - 130, baseY = 660;
        const bw = (x1 - x0) / nBars;
        for (let i = 0; i < nBars; i++) {
          const f = i / (nBars - 1);
          const hVal = Math.pow(f, 2.5) * 480 * (0.35 + 0.65 * u) + 18 + (i % 3 === 0 ? kick * 26 : 0);
          const bx = x0 + i * bw + 4;
          const by = baseY - hVal;
          const barW = bw - 8;
          const isPeak = i >= 18;
          ctx.fillStyle = isPeak ? CRIMSON : (i % 2 === 0 ? INK : PAPER);
          ctx.fillRect(bx, by, barW, hVal);
          if (!isPeak && i % 2 === 1) {
            drawBurinRect(ctx, bx, by, barW, hVal, 0.62, 6, 1.8, COBALT);
          }
          ctx.strokeStyle = INK;
          ctx.lineWidth = 2.6;
          ctx.strokeRect(bx, by, barW, hVal);
        }

        // Crimson Exponential Trajectory Curve + Cobalt Guilloché Rosette
        drawGuilloche(ctx, W * 0.78, 250, 210, 42, 120, 5, 320, COBALT, 1.8, t * 3.8);
        ctx.strokeStyle = CRIMSON;
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const f = i / 60;
          const px = lerp(x0, x1, f);
          const py = baseY - Math.pow(f, 2.5) * 510 * (0.35 + 0.65 * u) - 28;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.fillStyle = INK;
        ctx.font = MONO_FONT(800, 34);
        ctx.textAlign = 'left';
        ctx.fillText('LUMINOSITY // 8.42e34 cm⁻²s⁻¹ [FOOM_RAMP]', 138, 152);

        drawS02OrbitalTokens(ctx, s02Words, t, W, H, true, kick);
        drawSwissSynchroHud(ctx, W, H, true, INK, GOLD, 'CUT_04 // HARMONIC_RAMP_CURVE', lerp(128, 148, u), 36.41, beat);
      }

      // ======================================================================
      // CUT 05 (`119.28 – 120.00s`): Violent 180° World Barrel-Roll!
      // ======================================================================
      else if (t < 120.00) {
        const u = prog(t, 119.28, 120.00, ease.inOutExpo);
        bg = INK;
        fg = GOLD;
        isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.translate(W * 0.5, H * 0.45);
        ctx.rotate(u * Math.PI);

        // Dual-color horizon grid: Gold upper synchrotron plane, Cyan lower sub-plane!
        for (let side of [-1, 1]) {
          ctx.strokeStyle = side < 0 ? CYAN : GOLD;
          for (let k = 1; k <= 14; k++) {
            const yOff = side * Math.pow(k / 14, 2.1) * 540;
            ctx.lineWidth = k % 4 === 0 ? 3.2 : 1.3;
            ctx.beginPath();
            ctx.moveTo(-1150, yOff);
            ctx.lineTo(1150, yOff);
            ctx.stroke();
          }
          ctx.strokeStyle = SLATE;
          ctx.lineWidth = 1.4;
          for (let r = -12; r <= 12; r++) {
            ctx.beginPath();
            ctx.moveTo(r * 18, side * 28);
            ctx.lineTo(r * 165, side * 560);
            ctx.stroke();
          }
        }

        // Crimson Roll-Angle Plaque at Origin
        ctx.fillStyle = CRIMSON;
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 4;
        ctx.fillRect(-250, -34, 500, 68);
        ctx.strokeRect(-250, -34, 500, 68);
        ctx.fillStyle = BONE;
        ctx.font = MONO_FONT(800, 32);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`BARREL_ROLL: ${Math.round(u * 180)}° // 160Hz_ARM`, 0, 2);
        ctx.restore();

        drawS02OrbitalTokens(ctx, s02Words, t, W, H, false, kick);
        drawSwissSynchroHud(ctx, W, H, false, CYAN, CRIMSON, 'CUT_05 // 180_DEG_BARREL_ROLL', lerp(148, 158, u), 36.45, beat);
        shake = 0.30 + kick * 0.25;
      }

      // ======================================================================
      // CUT 06 (`120.00 – tTrace`): 64-Blade Collimator & 160Hz Odometer
      // ======================================================================
      else if (t < tTrace) {
        const u = prog(t, 120.00, tTrace, ease.inCubic);
        bg = PAPER;
        fg = INK;
        isLight = true;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W * 0.5, cy = H * 0.44;
        const apertureR = lerp(340, 125, u);
        for (let b = 0; b < 24; b++) {
          const ang = (b / 24) * TAU + t * 2.2;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(ang);
          ctx.beginPath();
          ctx.moveTo(apertureR, -16);
          ctx.lineTo(780, -92);
          ctx.lineTo(780, 42);
          ctx.lineTo(apertureR, 18);
          ctx.closePath();
          ctx.fillStyle = (b % 3 === 0) ? CRIMSON : (b % 2 === 0 ? INK : PAPER);
          ctx.fill();
          if (b % 3 !== 0 && b % 2 === 1) {
            ctx.save();
            ctx.clip();
            drawBurinRect(ctx, apertureR, -92, 620, 140, 0.5, 6, 1.6, COBALT);
            ctx.restore();
          }
          ctx.strokeStyle = INK;
          ctx.lineWidth = 2.4;
          ctx.stroke();
          ctx.restore();
        }

        const freqNow = lerp(96.0, 160.0, u);
        ctx.fillStyle = INK;
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 6;
        ctx.fillRect(cx - 295, cy - 80, 590, 160);
        ctx.strokeRect(cx - 295, cy - 80, 590, 160);
        core.drawOdometer(ctx, cx - 255, cy + 42, freqNow, {
          intDigits: 3,
          decimals: 1,
          size: 112,
          fg: GOLD,
          suffix: 'Hz'
        });

        drawS02OrbitalTokens(ctx, s02Words, t, W, H, true, kick);
        drawSwissSynchroHud(ctx, W, H, true, INK, CRIMSON, 'CUT_06 // COLLIMATOR_LOCK_160HZ', freqNow, 36.49, beat);
        shake = u * 0.35 + kick * 0.30;
      }

      // ======================================================================
      // CUT 07 (`tTrace .. tSync`): HAMMER 1 — `TRACE!` (`w[0..5]` Diagonal Cascade!)
      // ======================================================================
      else if (t < tSync) {
        const dtHit = t - tTrace;
        bg = PAPER;
        fg = INK;
        isLight = true;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Vertex collision fan in Slate + Cobalt + Crimson high-energy tracks!
        const vx = 210, vy = 560;
        for (let i = 0; i < 54; i++) {
          const ang = -1.18 + (i / 53) * 2.15;
          const curv = (i % 5 - 2) * 0.16;
          ctx.strokeStyle = (i % 7 === 0) ? CRIMSON : (i % 4 === 0 ? COBALT : SLATE);
          ctx.lineWidth = (i % 7 === 0) ? 3.8 : 1.4;
          ctx.beginPath();
          for (let s = 0; s <= 20; s++) {
            const r = (s / 20) * 1820 * Math.min(1, dtHit / 0.22 + 0.38);
            const a = ang + curv * (s / 20);
            const px = vx + Math.cos(a) * r;
            const py = vy + Math.sin(a) * r;
            if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
        drawGuilloche(ctx, vx, vy, 175, 35, 102, 5, 260, CRIMSON, 2.2, t * 5.0);

        // `T` `R` `A` `C` `E` `!` — Diagonal Ballistic Cascade (`y = 660 -> 285`), independent stamps!
        const traceSpecs = [
          { x: 430,  y: 655, sz: 265, rot: -0.21, boxType: 0, enterAng: 2.2,  accent: CRIMSON, secAccent: GOLD,   seed: 1 },
          { x: 675,  y: 545, sz: 235, rot:  0.14, boxType: 2, enterAng: -1.4, accent: COBALT,  secAccent: CRIMSON,seed: 2 },
          { x: 925,  y: 625, sz: 275, rot: -0.15, boxType: 1, enterAng: 1.6,  accent: GOLD,    secAccent: CRIMSON,seed: 3 },
          { x: 1170, y: 465, sz: 245, rot:  0.19, boxType: 3, enterAng: -0.9, accent: CRIMSON, secAccent: CYAN,   seed: 4 },
          { x: 1410, y: 555, sz: 260, rot: -0.12, boxType: 0, enterAng: 0.5,  accent: COBALT,  secAccent: GOLD,   seed: 5 },
          { x: 1655, y: 355, sz: 345, rot:  0.22, boxType: 1, enterAng: -1.8, accent: CRIMSON, secAccent: GOLD,   seed: 6 }
        ];
        for (let k = 0; k < traceSpecs.length && k < l21Words.length; k++) {
          drawAutonomousSynchroGlyph(ctx, l21Words[k].w, traceSpecs[k], l21Words[k], t, kick, true);
        }

        drawSwissSynchroHud(ctx, W, H, true, INK, CRIMSON, 'CUT_07 // HAMMER_01_TRACE', 160.00, 36.50, beat);
        shake = 0.55 + kick * 0.35;
      }

      // ======================================================================
      // CUT 08 (`tSync .. t160`): HAMMER 2 — `SYNC!` (Brutalist Interlocking Collage!)
      // ======================================================================
      else if (t < t160) {
        const dtHit = t - tSync;
        bg = INK;
        fg = CYAN;
        isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Twin counter-rotating vernier phase-lock jaws in Panel + Cyan + Gold!
        const jawClose = prog(t, tSync, tSync + 0.24, ease.outExpo);
        const jawYTop = lerp(68, 195, jawClose);
        const jawYBot = lerp(930, 805, jawClose);

        ctx.fillStyle = PANEL;
        ctx.fillRect(88, 78, W - 176, jawYTop - 78);
        ctx.fillRect(88, jawYBot, W - 176, 920 - jawYBot);
        drawBurinRect(ctx, 88, 78, W - 176, jawYTop - 78, 0.52, 8, 2.0, SLATE);
        drawBurinRect(ctx, 88, jawYBot, W - 176, 920 - jawYBot, -0.52, 8, 2.0, SLATE);
        ctx.strokeStyle = CYAN;
        ctx.lineWidth = 4.5;
        ctx.strokeRect(88, 78, W - 176, jawYTop - 78);
        ctx.strokeRect(88, jawYBot, W - 176, 920 - jawYBot);

        // Gold & Crimson vernier teeth along the locking jaws
        for (let x = 116; x <= W - 116; x += 36) {
          const isMaj = (x % 108 === 0);
          ctx.fillStyle = isMaj ? GOLD : CYAN;
          const hT = isMaj ? 26 : 13;
          ctx.fillRect(x, jawYTop, 6, hT);
          ctx.fillRect(x, jawYBot - hT, 6, hT);
        }

        // Angled Stamp Badge `TRACE! [LOCKED]` in upper-left corner
        ctx.save();
        ctx.translate(285, 138);
        ctx.rotate(-0.06);
        ctx.fillStyle = GOLD;
        ctx.fillRect(-165, -26, 330, 52);
        ctx.fillStyle = INK;
        ctx.font = MONO_FONT(800, 28);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓ TRACE! [LOCKED]', 0, 1);
        ctx.restore();

        // `S` `Y` `N` `C` `!` (`w[6..10]`) — Zig-Zagging Brutalist Scatter across center!
        const syncSpecs = [
          { x: 390,  y: 445, sz: 315, rot: -0.18, boxType: 0, enterAng: 3.0,  accent: CYAN,    secAccent: GOLD,   seed: 11 },
          { x: 710,  y: 595, sz: 270, rot:  0.16, boxType: 1, enterAng: 1.5,  accent: GOLD,    secAccent: CRIMSON,seed: 12 },
          { x: 1025, y: 410, sz: 300, rot: -0.13, boxType: 2, enterAng: -1.5, accent: CRIMSON, secAccent: CYAN,   seed: 13 },
          { x: 1320, y: 585, sz: 275, rot:  0.20, boxType: 3, enterAng: 1.3,  accent: CYAN,    secAccent: GOLD,   seed: 14 },
          { x: 1595, y: 435, sz: 360, rot:  0.24, boxType: 0, enterAng: -0.4, accent: CRIMSON, secAccent: GOLD,   seed: 15 }
        ];
        for (let k = 0; k < syncSpecs.length && (6 + k) < l21Words.length; k++) {
          drawAutonomousSynchroGlyph(ctx, l21Words[6 + k].w, syncSpecs[k], l21Words[6 + k], t, kick, false);
        }

        drawSwissSynchroHud(ctx, W, H, false, CYAN, GOLD, 'CUT_08 // HAMMER_02_PHASE_SYNC', 160.00, 36.52, beat);
        shake = 0.62 + kick * 0.35;
      }

      // ======================================================================
      // CUT 09 (`t160 .. tHertz`): HAMMER 3A — `1 · 6 · 0` Diagonal Triad Detonation!
      // ======================================================================
      else if (t < tHertz) {
        bg = PAPER;
        fg = INK;
        isLight = true;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const cx = W * 0.5, cy = H * 0.48;
        for (let r = 0; r < 160; r++) {
          const ang = (r / 160) * TAU + t * 1.5;
          const rIn = 170 + (r % 4) * 28;
          ctx.strokeStyle = (r % 10 === 0) ? CRIMSON : (r % 5 === 0 ? COBALT : SILVER);
          ctx.lineWidth = (r % 10 === 0) ? 3.4 : 1.2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * rIn, cy + Math.sin(ang) * rIn);
          ctx.lineTo(cx + Math.cos(ang) * 980, cy + Math.sin(ang) * 980);
          ctx.stroke();
        }
        drawGuilloche(ctx, cx, cy, 420, 84, 210, 5, 360, INK, 2.0, -t * 4.0);

        // `1`, `6`, `0` (`w[11..13]`) — Giant Diagonal Numeral Staircase!
        const numSpecs = [
          { x: 540,  y: 340, sz: 340, rot: -0.18, boxType: 0, enterAng: -2.2, accent: CRIMSON, secAccent: GOLD,   seed: 21 },
          { x: 960,  y: 495, sz: 390, rot:  0.11, boxType: 1, enterAng: 1.57, accent: GOLD,    secAccent: CRIMSON,seed: 22 },
          { x: 1385, y: 635, sz: 350, rot: -0.15, boxType: 3, enterAng: 0.6,  accent: COBALT,  secAccent: CRIMSON,seed: 23 }
        ];
        for (let k = 0; k < numSpecs.length && (11 + k) < l21Words.length; k++) {
          drawAutonomousSynchroGlyph(ctx, l21Words[11 + k].w, numSpecs[k], l21Words[11 + k], t, kick, true);
        }

        drawSwissSynchroHud(ctx, W, H, true, COBALT, CRIMSON, 'CUT_09 // HAMMER_03A_160_HARMONIC', 160.00, 36.55, beat);
        shake = 0.65 + kick * 0.35;
      }

      // ======================================================================
      // CUT 10 (`tHertz .. 123.17s`): HAMMER 3B — `160` + `H E R T Z !` Lightning Cascade!
      // ======================================================================
      else {
        bg = INK;
        fg = GOLD;
        isLight = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // 32 Plucked 160Hz Standing-Wave Resonance Strings in Slate + Cyan + Gold + Crimson!
        for (let s = 0; s < 32; s++) {
          const baseY = 92 + s * 26;
          const amp = (12 + kick * 28) * Math.sin((s / 31) * Math.PI);
          ctx.strokeStyle = (s % 8 === 0) ? CRIMSON : (s % 4 === 0 ? CYAN : SLATE);
          ctx.lineWidth = (s % 4 === 0) ? 2.6 : 1.1;
          ctx.beginPath();
          for (let x = 76; x <= W - 76; x += 28) {
            const wy = baseY + Math.sin(x * 0.028 - t * 62 + s * 0.7) * amp;
            if (x === 76) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
          }
          ctx.stroke();
        }

        // Angled Brutalist Stamp Cluster for `TRACE!` `SYNC!` `160` in upper quadrants (NO flat bar!)
        const stamps = [
          { txt: 'TRACE!', x: 290,  y: 168, rot: -0.09, fill: CYAN,    ink: INK },
          { txt: 'SYNC!',  x: 645,  y: 145, rot:  0.07, fill: CRIMSON, ink: BONE },
          { txt: '160',    x: 1580, y: 185, rot:  0.11, fill: GOLD,    ink: INK }
        ];
        for (const stp of stamps) {
          ctx.save();
          ctx.translate(stp.x, stp.y);
          ctx.rotate(stp.rot);
          ctx.fillStyle = INK;
          ctx.fillRect(-145 + 6, -42 + 6, 290, 84);
          ctx.fillStyle = stp.fill;
          ctx.strokeStyle = BONE;
          ctx.lineWidth = 4;
          ctx.fillRect(-145, -42, 290, 84);
          ctx.strokeRect(-145, -42, 290, 84);
          ctx.fillStyle = stp.ink;
          ctx.font = JA_DISP(900, 58);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(stp.txt, 0, 3);
          ctx.restore();
        }

        // `H` `E` `R` `T` `Z` `!` (`w[14..19]`) — High-voltage Zig-Zagging Cascade across full stage!
        const hertzSpecs = [
          { x: 325,  y: 545, sz: 295, rot: -0.17, boxType: 0, enterAng: 2.8,  accent: GOLD,    secAccent: CRIMSON,seed: 31 },
          { x: 605,  y: 415, sz: 255, rot:  0.15, boxType: 2, enterAng: -1.6, accent: CYAN,    secAccent: GOLD,   seed: 32 },
          { x: 885,  y: 625, sz: 290, rot: -0.14, boxType: 1, enterAng: 1.5,  accent: CRIMSON, secAccent: GOLD,   seed: 33 },
          { x: 1165, y: 435, sz: 270, rot:  0.18, boxType: 3, enterAng: -1.2, accent: GOLD,    secAccent: CYAN,   seed: 34 },
          { x: 1430, y: 615, sz: 285, rot: -0.16, boxType: 0, enterAng: 1.1,  accent: CYAN,    secAccent: CRIMSON,seed: 35 },
          { x: 1675, y: 455, sz: 375, rot:  0.23, boxType: 1, enterAng: -0.3, accent: CRIMSON, secAccent: GOLD,   seed: 36 }
        ];
        for (let k = 0; k < hertzSpecs.length && (14 + k) < l21Words.length; k++) {
          drawAutonomousSynchroGlyph(ctx, l21Words[14 + k].w, hertzSpecs[k], l21Words[14 + k], t, kick, false);
        }

        drawSwissSynchroHud(ctx, W, H, false, GOLD, CRIMSON, 'CUT_10 // 160_HERTZ_FULL_LOCK', 160.00, 36.58, beat);
        shake = 0.72 + kick * 0.35;
      }

      ctx.restore();

      return {
        bg,
        fg,
        duotone: { bg: isLight ? PAPER : INK, fg: isLight ? INK : GOLD },
        isPaper: isLight,
        bloom: 0,
        ca: 0,
        flash: 0,
        shake
      };
    }
  });
})();
