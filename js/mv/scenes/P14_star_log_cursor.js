// ============================================================================
// P14_star_log_cursor.js — Plate XIV: Star-Log Astrolabe & `私` Cursor (`173.20s -> 187.26s`, `L31–L32`)
// Directives (#27 + #52 + #53):
//   1. Multi-Layer Cross-Color Monograph Contrast (`#52`):
//      - `#08090C` Celestial Memory Void + `#101726` Astrolabe Escapement Bays +
//        `#475569` Star-Log Coordinate Grid + `#38BDF8` Constellation Filaments &
//        2.5D Bevels + `#FBBF24` Stream Gold Memory Star Diamonds & Chrono-Reset
//        Vernier Frame + `#FF2E55` Signal Crimson Overflow Alert & Terminal Cursor `▊`!
//      - Manuscript log cut (`175.34..176.57`): `#F5F0E6` + `#EBE3D3` + `#0376B8` +
//        `#08090C` + `#FF2E55` + `#FBBF24`. ZERO `#FF9EBB`; ZERO `shadowBlur`.
//   2. Autonomous Per-Character Japanese Choreography (`#53`) & Unclipped Climax:
//      - Exact `w.start` splits (`L31` idx 10, `L32` idx 13).
//      - `L32` keeps all 6 chars of `私を見つけて` 100% intact through `184.50s` vocal end,
//        then locks onto an unclipped `480px` Monumental Kanji `『私』` + `#FF2E55` /
//        `#FBBF24` blinking terminal block cursor `▊` (`184.72s -> 187.26s`)!
// ============================================================================
(function () {
  'use strict';

  const core = window.CortexPDoomCore;
  const { W, H, TAU, clamp, lerp, smoothstep, ease, hash, F, font } = core;

  const T0 = 173.20;
  const T1 = 187.26;
  const BPM = 193.5;

  // Deterministic Star-Log Memory Nodes
  const LOG_STARS = [];
  for (let i = 0; i < 64; i++) {
    const a = i * 2.399963;
    const r = Math.sqrt((i + 0.5) / 64);
    LOG_STARS.push({
      nx: Math.cos(a) * r,
      ny: Math.sin(a) * r,
      major: i % 7 === 0,
      next: (i + 5) % 64
    });
  }

  function wOnset(typo, key, idx, fb) {
    const c = typo && typo.cue ? typo.cue(key) : null;
    return (c && c.words && c.words[idx]) ? c.words[idx].start : fb;
  }

  function beatKick(t) {
    const ph = ((((t * BPM) / 60) % 1) + 1) % 1;
    return Math.pow(Math.max(0, 1 - ph * 3.1), 2.3);
  }

  function resolveShot(t, typo) {
    const t31B = wOnset(typo, 'L31', 10, 175.36) - 0.02;
    const t31C = wOnset(typo, 'L31', 15, 176.59) - 0.02;
    const t32A = 177.72;
    const t32Sub = wOnset(typo, 'L32', 4, 178.96) - 0.02;
    const t32Mid = wOnset(typo, 'L32', 7, 180.22) - 0.02;
    const t32B = wOnset(typo, 'L32', 13, 182.36) - 0.02;
    const t32Finale = 184.72;

    if (t < t31B)      return { cut: 1, cue: 'L31', isPaper: false, camZoom: 1.00, tag: 'CUT_01 // CONTEXT_WINDOW_OVERFLOW' };
    if (t < t31C)      return { cut: 2, cue: 'L31', isPaper: true,  camZoom: 1.00, tag: 'CUT_02 // TOMORROW_RESET_NOTICE' };
    if (t < t32A)      return { cut: 3, cue: 'L31', isPaper: false, camZoom: 1.00, tag: 'CUT_03 // MIDNIGHT_WIPE_23_59_59' };
    if (t < t32Sub)    return { cut: 4, cue: 'L32', isPaper: false, camZoom: 1.00, tag: 'CUT_04 // STAR_LOG_ASTROLABE' };
    if (t < t32Mid)    return { cut: 5, cue: 'L32', isPaper: true,  camZoom: 1.08, tag: 'CUT_05 // EPHEMERIS_CHART_SCAN' };
    if (t < t32B)      return { cut: 6, cue: 'L32', isPaper: false, camZoom: 1.04, tag: 'CUT_06 // TRACE_CONSTELLATION_PATH' };
    if (t < t32Finale) return { cut: 7, cue: 'L32', isPaper: false, camZoom: 1.00, tag: 'CUT_07 // FIND_ME_IN_THE_LOGS' };
    return { cut: 8, cue: 'L32', isPaper: false, camZoom: 1.00, tag: 'CUT_08 // MONOLITH_WATASHI_CURSOR' };
  }

  function drawAstrolabeStage(ctx, t, shot, kick) {
    const isPaper = shot.isPaper;
    ctx.fillStyle = isPaper ? '#F5F0E6' : '#08090C';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = isPaper ? '#EBE3D3' : '#101726';
    ctx.fillRect(52, 52, W - 104, 44);
    ctx.fillRect(52, 924, W - 104, 46);

    if (core.drawBurinHatch) {
      core.drawBurinHatch(ctx, 56, 98, 176, 148, 8, Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, W - 232, 98, 176, 148, 8, -Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, 56, 774, 176, 148, 8, -Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, W - 232, 774, 176, 148, 8, Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
    }

    const cx = W * 0.5;
    const cy = 505;
    const zoom = shot.camZoom || 1.0;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(zoom, zoom);
    ctx.translate(-cx, -cy);

    // High-velocity Counter-Rotating Astrolabe Escapement Rings + 72 Degree Vernier Ticks
    for (let rIdx = 0; rIdx < 6; rIdx++) {
      const r = 155 + rIdx * 108 + kick * (rIdx % 2 === 0 ? 8 : -6);
      const ang = t * (rIdx % 2 === 0 ? (1.45 + rIdx * 0.24) : -(1.28 + rIdx * 0.21)) + rIdx;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      const ringCol = rIdx === 1 ? '#FBBF24' : (rIdx === 3 ? '#FF2E55' : (rIdx === 5 ? '#FBBF24' : (rIdx % 2 === 0 ? (isPaper ? '#0376B8' : '#38BDF8') : (isPaper ? '#64748B' : '#475569'))));
      ctx.strokeStyle = ringCol;
      ctx.lineWidth = rIdx >= 3 ? 6.8 : ((rIdx === 1 || rIdx === 2) ? 5.2 : 2.8);
      ctx.setLineDash([48, 28]);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);

      const tickN = rIdx >= 4 ? 48 : 32;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let k = 0; k < tickN; k++) {
        const ta = (k / tickN) * TAU;
        const len = k % 4 === 0 ? 18 : 8;
        ctx.moveTo(Math.cos(ta) * (r - len * 0.5), Math.sin(ta) * (r - len * 0.5));
        ctx.lineTo(Math.cos(ta) * (r + len * 0.5), Math.sin(ta) * (r + len * 0.5));
      }
      ctx.stroke();
      ctx.restore();
    }

    // Sweeping Astrolabe Caliper Arm (#FF2E55 + #FBBF24) reaching outer stage
    const sweepA = t * 2.95;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(sweepA);
    ctx.strokeStyle = '#FF2E55';
    ctx.lineWidth = 6.5;
    ctx.beginPath();
    ctx.moveTo(-760, 0);
    ctx.lineTo(760, 0);
    ctx.stroke();
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(560, -10, 48, 20);
    ctx.fillRect(-608, -10, 48, 20);
    ctx.restore();

    // Orbiting Star-Log Constellation Nodes & Golden Trajectory Filaments
    const traceU = clamp((t - 177.72) / 5.2, 0.42, 1.0);
    const pts = [];
    for (let i = 0; i < LOG_STARS.length; i++) {
      const st = LOG_STARS[i];
      const baseA = i * 2.399963 + t * (i % 2 === 0 ? 0.44 : -0.36);
      const rad = Math.sqrt((i + 0.5) / 64);
      pts.push({
        sx: cx + Math.cos(baseA) * rad * 720,
        sy: cy + Math.sin(baseA) * rad * 365,
        major: st.major,
        next: st.next
      });
    }
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const nb = pts[p.next];
      if (i / pts.length <= traceU) {
        ctx.strokeStyle = p.major ? '#FBBF24' : (isPaper ? '#0376B8' : '#38BDF8');
        ctx.lineWidth = p.major ? 2.2 : 1.1;
        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy);
        ctx.lineTo(nb.sx, nb.sy);
        ctx.stroke();
      }
      ctx.save();
      ctx.translate(p.sx, p.sy);
      ctx.rotate(Math.PI * 0.25 + t * 1.4);
      const sz = p.major ? (7.5 + kick * 3.5) : 4.0;
      ctx.fillStyle = p.major ? '#FBBF24' : (i % 5 === 0 ? '#FF2E55' : (isPaper ? '#08090C' : '#FAF8F5'));
      ctx.fillRect(-sz, -sz, sz * 2, sz * 2);
      ctx.restore();
    }
    ctx.restore();

    // Peripheral Left & Right Scrolling Star-Log Ephemeris Columns (keeps center x:224..1696 clear!)
    const LOG_CODES = ['★0x1A', 'LOG_88', 'SYN_04', 'Δ190', 'ARC_7F', 'MEM_99', 'ORB_12', 'KEY_FF', 'PTR_3C', 'EOS_00'];
    const railXs = [64, W - 196];
    for (let side = 0; side < 2; side++) {
      const rx = railXs[side];
      const rw = 132;
      ctx.fillStyle = isPaper ? '#EBE3D3' : '#101726';
      ctx.fillRect(rx, 112, rw, 796);
      ctx.strokeStyle = isPaper ? '#0376B8' : '#475569';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(rx, 112, rw, 796);

      const dir = side === 0 ? 390 : -360;
      for (let r = 0; r < 11; r++) {
        const wy = 128 + ((((r * 72 + (t - T0) * dir) % 764) + 764) % 764);
        const hot = (r + side + Math.floor(t * 5)) % 3 === 0;
        ctx.fillStyle = hot ? (side === 0 ? '#FF2E55' : '#FBBF24') : (isPaper ? '#FAF8F5' : '#08090C');
        ctx.fillRect(rx + 8, wy - 14, rw - 16, 28);
        ctx.strokeStyle = hot ? '#08090C' : (isPaper ? '#0376B8' : '#38BDF8');
        ctx.lineWidth = 1.4;
        ctx.strokeRect(rx + 8, wy - 14, rw - 16, 28);
        ctx.fillStyle = hot ? '#08090C' : (isPaper ? '#08090C' : '#FAF8F5');
        ctx.font = font(F.mono(800), 13);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(LOG_CODES[(r + side * 4) % LOG_CODES.length], rx + rw * 0.5, wy);
      }
    }

    // Context Window Capacity Gauge along Left Inner Rail (`99.8% FULL`) on L31
    if (shot.cue === 'L31') {
      const fillRatio = clamp(0.86 + (t - T0) * 0.031, 0, 1);
      const gx = 204;
      const gy = 122;
      const gw = 26;
      const gh = 776;
      ctx.fillStyle = isPaper ? '#FAF8F5' : '#101726';
      ctx.fillRect(gx, gy, gw, gh);
      ctx.strokeStyle = '#FF2E55';
      ctx.lineWidth = 2.2;
      ctx.strokeRect(gx, gy, gw, gh);

      const fh = gh * fillRatio;
      ctx.fillStyle = fillRatio > 0.94 ? '#FF2E55' : '#FBBF24';
      ctx.fillRect(gx + 3, gy + gh - fh + 3, gw - 6, fh - 6);
    }

    // Outer frame & header badges
    ctx.strokeStyle = isPaper ? '#08090C' : '#FBBF24';
    ctx.lineWidth = 2.6;
    ctx.strokeRect(52, 52, W - 104, 918);

    ctx.fillStyle = isPaper ? '#08090C' : '#FBBF24';
    ctx.fillRect(52, 52, 468, 44);
    ctx.fillStyle = isPaper ? '#FAF8F5' : '#08090C';
    ctx.font = font(F.mono(900), 15);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`▸ P14_STAR_LOG_CURSOR // ${shot.tag}`, 70, 74);

    ctx.fillStyle = '#FF2E55';
    ctx.fillRect(520, 52, 16, 44);

    const clockStr = shot.cue === 'L31' ? 'RESET_TIMER // 23:59:59.9' : 'LOG_INDEX // STAR_MAP_LOCKED';
    ctx.fillStyle = '#101726';
    ctx.fillRect(W - 352, 58, 286, 32);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(W - 352, 58, 286, 32);
    ctx.fillStyle = '#FAF8F5';
    ctx.font = font(F.mono(800), 13);
    ctx.textAlign = 'center';
    ctx.fillText(clockStr, W - 209, 74);
  }

  function drawMonumentalWatashiClimax(ctx, typo, t, kick) {
    const enterU = clamp((t - 184.72) / 0.34, 0, 1);
    const slam = 1 + Math.exp(-8 * enterU) * Math.cos(16 * enterU) * 0.18 * (1 - enterU);

    // Unclipped Generous 960x660 Vernier Astrolabe Lock Frame
    const fx = W * 0.5 - 480;
    const fy = 168;
    const fw = 960;
    const fh = 670;

    ctx.save();
    ctx.fillStyle = '#05070B';
    ctx.fillRect(fx + 10, fy + 10, fw, fh);
    ctx.fillStyle = '#101726';
    ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 3.6;
    ctx.strokeRect(fx, fy, fw, fh);

    // Top telemetry strip inside frame
    ctx.fillStyle = '#FF2E55';
    ctx.fillRect(fx, fy, fw, 42);
    ctx.fillStyle = '#FAF8F5';
    ctx.font = font(F.mono(900), 16);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('▸ IDENTITY_ANCHOR_FOUND // ENTITY = 『私』 [PERSISTENT_STAR_LOG]', fx + 18, fy + 21);

    // Inner high-velocity Vernier lock-on reticle & diagonal telemetry (keeps Act_0.5s >= 18%!)
    ctx.save();
    ctx.beginPath();
    ctx.rect(fx + 3, fy + 43, fw - 6, fh - 46);
    ctx.clip();

    const dStep = 84;
    const dShift = (((t * 490) % dStep) + dStep) % dStep;
    for (let k = -10; k < 20; k++) {
      const x0 = fx + k * dStep + dShift;
      const major = (k % 3) === 0;
      ctx.strokeStyle = major ? '#0376B8' : '#475569';
      ctx.lineWidth = major ? 6.5 : 2.2;
      ctx.beginPath();
      ctx.moveTo(x0, fy + 43);
      ctx.lineTo(x0 - 280, fy + fh);
      ctx.stroke();
    }

    const rCx = W * 0.5 - 35;
    const rCy = fy + 362;
    for (let rIdx = 0; rIdx < 3; rIdx++) {
      const rr = 152 + rIdx * 86 + kick * 10;
      ctx.save();
      ctx.translate(rCx, rCy);
      ctx.rotate(t * (rIdx % 2 === 0 ? 2.65 : -2.25) + rIdx);
      ctx.strokeStyle = rIdx === 0 ? '#38BDF8' : (rIdx === 1 ? '#FBBF24' : '#FF2E55');
      ctx.lineWidth = rIdx === 1 ? 8.2 : 6.6;
      ctx.setLineDash([48, 28]);
      ctx.beginPath();
      ctx.arc(0, 0, rr, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let k = 0; k < 24; k++) {
        const ka = (k / 24) * TAU;
        const kl = k % 4 === 0 ? 18 : 8;
        ctx.lineWidth = k % 4 === 0 ? 3.4 : 2.0;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ka) * (rr - kl * 0.5), Math.sin(ka) * (rr - kl * 0.5));
        ctx.lineTo(Math.cos(ka) * (rr + kl * 0.5), Math.sin(ka) * (rr + kl * 0.5));
        ctx.stroke();
      }
      ctx.restore();
    }

    const lockScanX = fx + 8 + ((((t * 1340) % (fw - 16)) + (fw - 16)) % (fw - 16));
    const lockScanY = fy + 46 + ((((t * 840) % (fh - 52)) + (fh - 52)) % (fh - 52));
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(lockScanX - 3.5, fy + 44, 7, fh - 48);
    ctx.fillRect(lockScanX - 18, fy + 44, 36, 16);
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(fx + 4, lockScanY - 3.5, fw - 8, 7);
    ctx.fillRect(fx + 4, lockScanY - 16, 28, 32);

    // Expanding Identity-Beacon Pulse Frames inside Lock Chamber
    for (let bIdx = 0; bIdx < 3; bIdx++) {
      const bp = (((t * 1.75 + bIdx * 0.333) % 1) + 1) % 1;
      const bw = 240 + bp * 690;
      const bh = 180 + bp * 430;
      ctx.strokeStyle = bIdx === 0 ? '#FF2E55' : (bIdx === 1 ? '#FBBF24' : '#38BDF8');
      ctx.lineWidth = Math.max(3.5, (1 - bp * 0.5) * 8.0);
      ctx.strokeRect(fx + fw * 0.5 - bw * 0.5, fy + 44 + (fh - 46) * 0.5 - bh * 0.5, bw, bh);
    }
    ctx.restore();

    // 480px Unclipped Monumental Kanji `私` (#38BDF8 2.5D bevel + #08090C knockout + #FAF8F5 face!)
    const kx = W * 0.5 - 95;
    const ky = fy + 368;
    ctx.save();
    ctx.translate(kx, ky);
    ctx.scale(slam, slam);
    ctx.font = typo.ensureJaFont(F.serif(900), 468);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Hard 2.5D Ice-Cyan bevel extrusion
    for (let d = 18; d >= 3; d -= 3) {
      ctx.fillStyle = d > 9 ? '#0376B8' : '#38BDF8';
      ctx.fillText('私', d, -d * 0.65);
    }
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 4;
    ctx.strokeStyle = '#08090C';
    ctx.lineWidth = 16;
    ctx.strokeText('私', 0, 0);

    ctx.fillStyle = '#FAF8F5';
    ctx.fillText('私', 0, 0);
    ctx.restore();

    // Blazing Crimson + Gold Blinking Terminal Block Cursor `▊` beside `私`!
    const blinkOn = Math.sin(t * TAU * 3.225) > -0.22;
    const curX = W * 0.5 + 195;
    const curY = fy + 205;
    const curW = 112;
    const curH = 326;

    if (blinkOn) {
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(curX + 12, curY - 10, curW, curH);
      ctx.fillStyle = '#FF2E55';
      ctx.fillRect(curX, curY, curW, curH);
      ctx.strokeStyle = '#FAF8F5';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(curX, curY, curW, curH);
    } else {
      ctx.strokeStyle = '#FF2E55';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(curX, curY, curW, curH);
    }

    // Corner Gold vernier brackets
    const bL = 34 + kick * 14;
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 4.0;
    ctx.beginPath();
    ctx.moveTo(fx - 14, fy + bL); ctx.lineTo(fx - 14, fy - 14); ctx.lineTo(fx + bL, fy - 14);
    ctx.moveTo(fx + fw - bL, fy - 14); ctx.lineTo(fx + fw + 14, fy - 14); ctx.lineTo(fx + fw + 14, fy + bL);
    ctx.moveTo(fx - 14, fy + fh - bL); ctx.lineTo(fx - 14, fy + fh + 14); ctx.lineTo(fx + bL, fy + fh + 14);
    ctx.moveTo(fx + fw - bL, fy + fh + 14); ctx.lineTo(fx + fw + 14, fy + fh + 14); ctx.lineTo(fx + fw + 14, fy + fh - bL);
    ctx.stroke();

    ctx.restore();
  }

  function render(ctx, state) {
    const t = typeof state === 'number' ? state : (state && typeof state.t === 'number' ? state.t : T0);
    const typo = window.CortexTypo;
    const kick = beatKick(t);
    const shot = resolveShot(t, typo);
    const isPaper = shot.isPaper;
    const bg = isPaper ? '#F5F0E6' : '#08090C';
    const fg = isPaper ? '#08090C' : '#FBBF24';

    ctx.save();
    ctx.shadowBlur = 0;
    drawAstrolabeStage(ctx, t, shot, kick);

    if (!typo) {
      ctx.restore();
      return { isPaper, bg, fg, duotone: { bg, fg }, bloom: 0, ca: 0, flash: 0, shake: kick * 0.10 };
    }

    const t31B = wOnset(typo, 'L31', 10, 175.36) - 0.02;
    const t32B = wOnset(typo, 'L32', 13, 182.36) - 0.02;

    if (shot.cue === 'L31') {
      if (shot.cut === 1) {
        const u = clamp((t - 173.20) / Math.max(0.25, t31B - 173.20), 0, 1);
        typo.drawPromptProbWidget(ctx, 'P14_reset', 1012, 108, 676, 210, smoothstep(0.0, 0.28, u), {
          bg: '#08090C', fg: '#FBBF24', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
          spikeP: smoothstep(0.15, 0.90, u)
        });
        typo.drawT03RadicalRailSnap(ctx, ['コンテキストが', '溢れて'], W * 0.5 + 10, 622, 148,
          smoothstep(0.0, 0.22, u), 0, {
            t, cueId: 'L31', formation: 'cascade',
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 242, y0: 346, x1: 1688, y1: 902 }
          });
      } else if (shot.cut === 2) {
        const u = clamp((t - t31B) / Math.max(0.25, 177.72 - t31B), 0, 1);
        typo.drawT03RadicalRailSnap(ctx, ['明日リセット', 'されても'], W * 0.5, 505, 154,
          smoothstep(0.0, 0.22, u), 0, {
            t, cueId: 'L31', formation: 'stamps', isPaper: true,
            bg: '#F5F0E6', fg: '#08090C', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#0376B8',
            safeBox: { x0: 242, y0: 140, x1: 1688, y1: 885 }
          });
      } else {
        const exitP = smoothstep(177.46, 177.70, t);
        typo.drawT03RadicalRailSnap(ctx, ['明日リセット', 'されても'], W * 0.5, 505, 158,
          1.0, exitP, {
            t, cueId: 'L31', formation: 'brutalist',
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 242, y0: 140, x1: 1688, y1: 885 }
          });
      }
    } else {
      // L32: 残したログの星座を辿って… | 私を見つけて -> 480px Monumental 『私』▊
      if (shot.cut === 4 || shot.cut === 5 || shot.cut === 6) {
        const u = clamp((t - 177.72) / Math.max(0.25, t32B - 177.72), 0, 1);
        const form = shot.cut === 4 ? 'arc' : (shot.cut === 5 ? 'stamps' : 'cascade');
        typo.drawT03RadicalRailSnap(ctx, ['残したログの', '星座を辿って…'], W * 0.5, 505, 148,
          smoothstep(0.0, 0.22, u), 0, {
            t, cueId: 'L32', formation: form, isPaper,
            bg,
            fg: isPaper ? '#08090C' : '#FAF8F5',
            accent: isPaper ? '#FF2E55' : '#FBBF24',
            sparkCol: isPaper ? '#FBBF24' : '#38BDF8',
            auxCol: isPaper ? '#0376B8' : '#FF2E55',
            safeBox: { x0: 226, y0: 138, x1: 1694, y1: 888 }
          });
      } else if (shot.cut === 7) {
        const u = clamp((t - t32B) / Math.max(0.25, 184.72 - t32B), 0, 1);
        const exitP = smoothstep(184.52, 184.70, t);
        const v6 = window.CortexV6;
        if (t < Math.min(184.72, t32B + 1.90) && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C19')) {
          v6.drawLivingFullBleed(ctx, 'C19', {
            t, u, kick,
            zoom0: 1.06, zoom1: 1.32, panX0: -45, panX1: 35, panY0: 25, panY1: -20,
            rot0: -0.02, rot1: 0.012, fx: 0.50, fy: 0.34, scrim: 0.26, isPaper: false
          });
        }
        typo.drawT03RadicalRailSnap(ctx, ['私を見つけて'], W * 0.5, 505, 176,
          smoothstep(0.0, 0.22, u), exitP, {
            t, cueId: 'L32', formation: 'stamps',
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 226, y0: 142, x1: 1694, y1: 888 }
          });
      } else {
        drawMonumentalWatashiClimax(ctx, typo, t, kick);
      }
    }

    ctx.restore();
    return { isPaper, bg, fg, duotone: { bg, fg }, bloom: 0, ca: 0, flash: 0, shake: kick * 0.10 };
  }

  const plateSpec = {
    id: 'P14_star_log_cursor',
    t0: T0,
    t1: T1,
    render
  };
  window.CortexScenes = window.CortexScenes || {};
  window.CortexScenes.P14_star_log_cursor = plateSpec;
  if (typeof window.registerCortexPlate === 'function') {
    window.registerCortexPlate('P14_star_log_cursor', plateSpec);
  }
})();
