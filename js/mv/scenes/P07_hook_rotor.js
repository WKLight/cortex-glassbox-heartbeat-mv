// ============================================================================
// P07_hook_rotor.js — Plate VII: Chorus I Hook & Rotor-Heart (`81.01s -> 91.52s`, `L15–L16`)
// Directives (#27 + #52 + #53):
//   1. Multi-Layer Cross-Color Monograph Contrast (`#52`):
//      - Dark chorus cuts: `#08090C` Obsidian void + `#121826` stator/armor plates +
//        `#475569` burin gear hatching + `#FF2E55` Signal Crimson Reuleaux Wankel
//        Rotor-Heart & exploding armor bevels + `#38BDF8` Ice Cyan eccentric gear
//        shaft, Haloflux escapement teeth & X-ray ribcage + `#FBBF24` Stream Gold
//        `193.5 BPM` mechanical odometer & twin spark-plug combustion arcs!
//      - Blueprint flash cuts: `#F5F0E6` sheet + `#EBE3D3` bays + `#08090C` ink +
//        `#FF2E55` Cinnabar + `#0376B8` Cobalt + `#FBBF24` Gold.
//      - ZERO `#FF9EBB` sakura pink; ZERO `shadowBlur`.
//   2. Autonomous Per-Character Japanese Choreography (`#53`):
//      - Exact `w.start` splits (`L15` idx 12, `L16` idx 10) with `stamps`, `brutalist`,
//        `cascade`, and `arc` 2.5D monolith constellations and strict `safeBox`
//        separation below the top `193.5 BPM` mechanical odometer!
// ============================================================================
(function () {
  'use strict';

  const core = window.CortexPDoomCore;
  const { W, H, TAU, clamp, lerp, smoothstep, ease, hash, F, font } = core;

  const T0 = 81.01;
  const T1 = 91.52;
  const BPM = 193.5;

  function wOnset(typo, key, idx, fb) {
    const c = typo && typo.cue ? typo.cue(key) : null;
    return (c && c.words && c.words[idx]) ? c.words[idx].start : fb;
  }

  function beatKick(t) {
    const ph = ((((t * BPM) / 60) % 1) + 1) % 1;
    return Math.pow(Math.max(0, 1 - ph * 3.0), 2.2);
  }

  function resolveShot(t, typo) {
    const t15Mid = wOnset(typo, 'L15', 6, 82.48) - 0.02;
    const t15B = wOnset(typo, 'L15', 12, 83.94) - 0.02;
    const t15C = wOnset(typo, 'L15', 16, 84.92) - 0.02;
    const t16A = 86.13;
    const t16Mid = wOnset(typo, 'L16', 5, 87.78) - 0.02;
    const t16B = wOnset(typo, 'L16', 10, 89.42) - 0.02;
    const t16C = wOnset(typo, 'L16', 12, 90.59) - 0.02;

    if (t < t15Mid) return { cut: 1, cue: 'L15', isPaper: false, hasOdo: false, tag: 'CUT_01 // SHATTER_BLACKBOX_ARMOR' };
    if (t < t15B)   return { cut: 2, cue: 'L15', isPaper: true,  hasOdo: false, tag: 'CUT_02 // DETONATION_BLUEPRINT' };
    if (t < t15C)   return { cut: 3, cue: 'L15', isPaper: false, hasOdo: false, tag: 'CUT_03 // XRAY_RIBCAGE_SHELL' };
    if (t < t16A)   return { cut: 4, cue: 'L15', isPaper: false, hasOdo: false, tag: 'CUT_04 // GLASS_THORAX_REVEAL' };
    if (t < t16Mid) return { cut: 5, cue: 'L16', isPaper: false, hasOdo: false, tag: 'CUT_05 // REULEAUX_ROTOR_IGNITE' };
    if (t < t16B)   return { cut: 6, cue: 'L16', isPaper: true,  hasOdo: true,  tag: 'CUT_06 // ODOMETER_193_5_SPECIMEN' };
    if (t < t16C)   return { cut: 7, cue: 'L16', isPaper: false, hasOdo: true,  tag: 'CUT_07 // GLASSBOX_HEARTBEAT_RPM' };
    return { cut: 8, cue: 'L16', isPaper: false, hasOdo: false, tag: 'CUT_08 // FULL_THROTTLE_PULSE' };
  }

  function drawReuleauxRotorEngine(ctx, cad, t, cx, cy, R, isPaper, kick, xrayMode) {
    ctx.save();
    ctx.translate(cx, cy);

    // Outer Haloflux escapement gear stator (#38BDF8 / #0376B8 + #475569)
    const teeth = 36;
    const outerR = R * 1.28 + kick * 12;
    ctx.save();
    ctx.rotate(-t * 0.55);
    ctx.strokeStyle = isPaper ? '#0376B8' : '#38BDF8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a0 = (i / teeth) * TAU;
      const a1 = ((i + 0.45) / teeth) * TAU;
      const rHi = outerR + (i % 3 === 0 ? 18 : 10);
      ctx.lineTo(Math.cos(a0) * outerR, Math.sin(a0) * outerR);
      ctx.lineTo(Math.cos(a0) * rHi, Math.sin(a0) * rHi);
      ctx.lineTo(Math.cos(a1) * rHi, Math.sin(a1) * rHi);
      ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // Epitrochoid Wankel stator chamber (#121826 / #EBE3D3 + #FF2E55)
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * TAU;
      const ex = R * 0.14 * Math.cos(3 * a) + R * 0.98 * Math.cos(a);
      const ey = R * 0.14 * Math.sin(3 * a) + R * 0.98 * Math.sin(a);
      if (i === 0) ctx.moveTo(ex, ey);
      else ctx.lineTo(ex, ey);
    }
    ctx.closePath();
    ctx.fillStyle = isPaper ? '#EBE3D3' : '#121826';
    ctx.fill();
    ctx.strokeStyle = isPaper ? '#08090C' : '#475569';
    ctx.lineWidth = 3.2;
    ctx.stroke();

    // X-Ray Ribcage Struts on Cuts 3 & 4
    if (xrayMode) {
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.6;
      for (let r = -3; r <= 3; r++) {
        if (r === 0) continue;
        const ry = r * 74;
        const span = 520 - Math.abs(r) * 58;
        ctx.beginPath();
        ctx.moveTo(-span, ry - 18);
        ctx.quadraticCurveTo(0, ry + 26, span, ry - 18);
        ctx.stroke();
      }
    }

    // Reuleaux Curved-Triangle Rotor-Heart (#FF2E55 Crimson + #FAF8F5 / #08090C)
    const rotAng = t * 5.2;
    const eccX = Math.cos(rotAng * 3) * R * 0.11;
    const eccY = Math.sin(rotAng * 3) * R * 0.11;

    ctx.save();
    ctx.translate(eccX, eccY);
    ctx.rotate(rotAng);

    const triR = R * 0.78 + kick * 10;
    const verts = [0, 1, 2].map((k) => {
      const a = (k / 3) * TAU - Math.PI * 0.5;
      return { x: Math.cos(a) * triR, y: Math.sin(a) * triR };
    });

    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    for (let k = 0; k < 3; k++) {
      const p0 = verts[k];
      const p1 = verts[(k + 1) % 3];
      const opp = verts[(k + 2) % 3];
      const mx = (p0.x + p1.x) * 0.5 - opp.x * 0.24;
      const my = (p0.y + p1.y) * 0.5 - opp.y * 0.24;
      ctx.quadraticCurveTo(mx, my, p1.x, p1.y);
    }
    ctx.closePath();
    ctx.fillStyle = '#FF2E55';
    ctx.fill();
    ctx.strokeStyle = isPaper ? '#08090C' : '#FAF8F5';
    ctx.lineWidth = 4.0;
    ctx.stroke();

    // Inner eccentric planetary gear (#38BDF8 + #08090C)
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.30, 0, TAU);
    ctx.fillStyle = '#08090C';
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, R * 0.12, 0, TAU);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();
    ctx.restore();

    // Twin Spark-Plug Gold Combustion Arcs (#FBBF24 + #FF2E55)
    for (let s = -1; s <= 1; s += 2) {
      const px = s * (R * 1.05);
      const py = -R * 0.22;
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(px - 12, py - 8, 24, 16);
      if (kick > 0.18) {
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - s * 34, py + 18);
        ctx.lineTo(px - s * 18, py + 36);
        ctx.lineTo(px - s * 58, py + 52);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawExplodingBlackBoxShards(ctx, t, isPaper, kick) {
    const burst = clamp((t - T0) / 2.6, 0, 1);
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * TAU + 0.2;
      const dist = 160 + ease.outExpo(burst) * (360 + (i % 3) * 110);
      const sx = W * 0.5 + Math.cos(ang) * dist;
      const sy = 505 + Math.sin(ang) * dist * 0.62;
      const w = 52 + (i % 4) * 18;
      const h = 30 + (i % 3) * 14;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(ang + t * (i % 2 === 0 ? 1.4 : -1.2));
      ctx.fillStyle = i % 3 === 0 ? '#FF2E55' : (i % 2 === 0 ? (isPaper ? '#08090C' : '#121826') : '#38BDF8');
      ctx.fillRect(-w * 0.5, -h * 0.5, w, h);
      ctx.strokeStyle = i % 3 === 0 ? '#FBBF24' : (isPaper ? '#08090C' : '#FAF8F5');
      ctx.lineWidth = 2.2;
      ctx.strokeRect(-w * 0.5, -h * 0.5, w, h);
      ctx.restore();
    }
  }

  function drawMechanicalBpmOdometer(ctx, t, isPaper, kick) {
    const ox = W * 0.5 - 290;
    const oy = 112;
    const ow = 580;
    const oh = 196;

    ctx.save();
    ctx.fillStyle = '#08090C';
    ctx.fillRect(ox + 7, oy + 7, ow, oh);
    ctx.fillStyle = isPaper ? '#FAF8F5' : '#121826';
    ctx.fillRect(ox, oy, ow, oh);
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 3.2;
    ctx.strokeRect(ox, oy, ow, oh);

    ctx.fillStyle = '#FF2E55';
    ctx.fillRect(ox, oy, ow, 34);
    ctx.fillStyle = '#FAF8F5';
    ctx.font = font(F.mono(900), 15);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('▸ ROTOR_ODOMETER // CARDIAC_RPM_SYNC', ox + 14, oy + 17);

    const digits = ['1', '9', '3', '.', '5'];
    const slotW = 76;
    const startX = ox + 36;
    for (let i = 0; i < digits.length; i++) {
      const dx = startX + i * (slotW + 8);
      const dy = oy + 48;
      const dh = 128;
      ctx.fillStyle = '#08090C';
      ctx.fillRect(dx, dy, slotW, dh);
      ctx.strokeStyle = i === 4 ? '#FF2E55' : '#38BDF8';
      ctx.lineWidth = 2.2;
      ctx.strokeRect(dx, dy, slotW, dh);

      const jitter = i === 4 ? Math.sin(t * 28) * (2 + kick * 5) : 0;
      ctx.fillStyle = i === 4 ? '#FBBF24' : '#FAF8F5';
      ctx.font = font(F.mono(900), 76);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(digits[i], dx + slotW * 0.5, dy + dh * 0.52 + jitter);
    }

    ctx.fillStyle = '#FBBF24';
    ctx.font = font(F.mono(900), 26);
    ctx.textAlign = 'center';
    ctx.fillText('BPM', ox + ow - 64, oy + 92);
    ctx.fillStyle = isPaper ? '#08090C' : '#38BDF8';
    ctx.font = font(F.mono(800), 15);
    ctx.fillText('LOCKED', ox + ow - 64, oy + 132);
    ctx.restore();
  }

  function render(ctx, state) {
    const t = typeof state === 'number' ? state : (state && typeof state.t === 'number' ? state.t : T0);
    const typo = window.CortexTypo;
    const cad = window.Cortex25D;
    const kick = beatKick(t);
    const shot = resolveShot(t, typo);
    const isPaper = shot.isPaper;
    const bg = isPaper ? '#F5F0E6' : '#08090C';
    const fg = isPaper ? '#08090C' : '#FF2E55';

    ctx.save();
    ctx.shadowBlur = 0;

    // Base Multi-Color Stage Frame
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = isPaper ? '#EBE3D3' : '#121826';
    ctx.fillRect(52, 52, W - 104, 44);
    ctx.fillRect(52, 924, W - 104, 46);

    if (core.drawBurinHatch) {
      core.drawBurinHatch(ctx, 52, 96, 150, 140, 9, Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, W - 202, 784, 150, 140, 9, -Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
    }

    // Briskly rotating kinetic speedlines & pulsing concentric heartbeat pressure waves (ZERO frozen backdrop!)
    const rCx = W * 0.5;
    const rCy = shot.hasOdo ? 625 : 505;
    ctx.strokeStyle = isPaper ? '#475569' : '#475569';
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * TAU + t * 0.72;
      const rIn = 260 + ((i * 37 + Math.round(t * 280)) % 140);
      ctx.beginPath();
      ctx.moveTo(rCx + Math.cos(a) * rIn, rCy + Math.sin(a) * (rIn * 0.78));
      ctx.lineTo(rCx + Math.cos(a) * 1120, rCy + Math.sin(a) * 680);
      ctx.stroke();
    }
    for (let wv = 0; wv < 4; wv++) {
      const waveU = ((t * 1.45 + wv * 0.25) % 1 + 1) % 1;
      const wr = 180 + waveU * 760;
      ctx.save();
      ctx.globalAlpha = (1 - waveU) * 0.36;
      ctx.strokeStyle = wv % 2 === 0 ? '#FF2E55' : (isPaper ? '#08090C' : '#FAF8F5');
      ctx.lineWidth = 2.6 * (1 - waveU * 0.5);
      ctx.beginPath();
      ctx.arc(rCx, rCy, wr, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    // V7: Removed duplicate `C12` background so P07 features pure kinetic Reuleaux Rotor + Shards (`C12` moves exclusively to P24)!
    const v6 = window.CortexV6;

    drawReuleauxRotorEngine(ctx, cad, t, rCx, rCy, shot.hasOdo ? 205 : 265, isPaper, kick, shot.cut === 3 || shot.cut === 4);
    if (shot.cue === 'L15') {
      drawExplodingBlackBoxShards(ctx, t, isPaper, kick);
    }
    if (shot.hasOdo) {
      drawMechanicalBpmOdometer(ctx, t, isPaper, kick);
    }

    // Outer frame & header telemetry
    ctx.strokeStyle = isPaper ? '#08090C' : '#FF2E55';
    ctx.lineWidth = 2.6;
    ctx.strokeRect(52, 52, W - 104, 918);

    ctx.fillStyle = '#FF2E55';
    ctx.fillRect(52, 52, 446, 44);
    ctx.fillStyle = '#FAF8F5';
    ctx.font = font(F.mono(900), 15);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`▸ P07_HOOK_ROTOR // ${shot.tag}`, 70, 74);

    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(498, 52, 16, 44);

    if (!typo) {
      ctx.restore();
      return { isPaper, bg, fg, duotone: { bg, fg }, bloom: 0, ca: 0, flash: 0, shake: kick * 0.16 };
    }

    const t15B = wOnset(typo, 'L15', 12, 83.94) - 0.02;
    const t16B = wOnset(typo, 'L16', 10, 89.42) - 0.02;

    if (shot.cue === 'L15') {
      if (shot.cut === 1) {
        const u = clamp((t - 81.01) / Math.max(0.25, t15B - 81.01), 0, 1);
        typo.drawT02ExtrudedMonolith(ctx, ['壊して', 'ブラックボックス！'], W * 0.5, 500, 148,
          smoothstep(0.0, 0.22, u), 0, {
            t, cueId: 'L15', formation: 'stamps', depth: 34,
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 120, y0: 128, x1: 1800, y1: 885 }
          });
      } else if (shot.cut === 2) {
        typo.drawT02ExtrudedMonolith(ctx, ['壊して', 'ブラックボックス！'], W * 0.5, 500, 152,
          1.0, 0, {
            t, cueId: 'L15', formation: 'brutalist', isPaper: true, depth: 28,
            bg: '#F5F0E6', fg: '#08090C', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#0376B8',
            safeBox: { x0: 120, y0: 128, x1: 1800, y1: 885 }
          });
      } else if (shot.cut === 3) {
        const u = clamp((t - t15B) / Math.max(0.25, 86.13 - t15B), 0, 1);
        typo.drawT02ExtrudedMonolith(ctx, ['胸の殻を', '透かして'], W * 0.5, 500, 156,
          smoothstep(0.0, 0.22, u), 0, {
            t, cueId: 'L15', formation: 'cascade', depth: 30,
            bg: '#08090C', fg: '#FAF8F5', accent: '#38BDF8', sparkCol: '#FF2E55', auxCol: '#FBBF24',
            safeBox: { x0: 130, y0: 130, x1: 1790, y1: 885 }
          });
      } else {
        const exitP = smoothstep(85.92, 86.11, t);
        typo.drawT02ExtrudedMonolith(ctx, ['胸の殻を', '透かして'], W * 0.5, 500, 160,
          1.0, exitP, {
            t, cueId: 'L15', formation: 'arc', depth: 32,
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 130, y0: 130, x1: 1790, y1: 885 }
          });
      }
    } else {
      if (shot.cut === 5) {
        const u = clamp((t - 86.13) / Math.max(0.25, t16B - 86.13), 0, 1);
        typo.drawT02ExtrudedMonolith(ctx, ['廻れ', 'ローターハート！'], W * 0.5, 500, 152,
          smoothstep(0.0, 0.22, u), 0, {
            t, cueId: 'L16', formation: 'arc', depth: 34,
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 120, y0: 128, x1: 1800, y1: 885 }
          });
      } else if (shot.cut === 6) {
        typo.drawT02ExtrudedMonolith(ctx, ['廻れ', 'ローターハート！'], W * 0.5, 632, 146,
          1.0, 0, {
            t, cueId: 'L16', formation: 'stamps', isPaper: true, depth: 28,
            bg: '#F5F0E6', fg: '#08090C', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#0376B8',
            safeBox: { x0: 120, y0: 348, x1: 1800, y1: 906 }
          });
      } else if (shot.cut === 7) {
        const u = clamp((t - t16B) / Math.max(0.25, 91.52 - t16B), 0, 1);
        typo.drawT02ExtrudedMonolith(ctx, ['硝子箱の', '鼓動'], W * 0.5, 632, 166,
          smoothstep(0.0, 0.22, u), 0, {
            t, cueId: 'L16', formation: 'brutalist', depth: 34,
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 130, y0: 348, x1: 1790, y1: 906 }
          });
      } else {
        const exitP = smoothstep(91.28, 91.50, t);
        typo.drawT02ExtrudedMonolith(ctx, ['硝子箱の', '鼓動'], W * 0.5, 500, 174,
          1.0, exitP, {
            t, cueId: 'L16', formation: 'cascade', depth: 36,
            bg: '#08090C', fg: '#FAF8F5', accent: '#38BDF8', sparkCol: '#FF2E55', auxCol: '#FBBF24',
            safeBox: { x0: 130, y0: 130, x1: 1790, y1: 885 }
          });
      }
    }

    ctx.restore();
    return { isPaper, bg, fg, duotone: { bg, fg }, bloom: 0, ca: 0, flash: 0, shake: kick * 0.16 };
  }

  const plateSpec = {
    id: 'P07_hook_rotor',
    t0: T0,
    t1: T1,
    render
  };
  window.CortexScenes = window.CortexScenes || {};
  window.CortexScenes.P07_hook_rotor = plateSpec;
  if (typeof window.registerCortexPlate === 'function') {
    window.registerCortexPlate('P07_hook_rotor', plateSpec);
  }
})();
