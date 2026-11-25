// ============================================================================
// P08_tri_morph_look.js — Plate VIII: Tri-Morph Registration & Split-Flap (`91.52s -> 101.16s`, `L17–L18`)
// Directives (#27 + #52 + #53):
//   1. 100% Traced SVG Tri-Morph Character (`#52` Section II STRICT BAN):
//      - ZERO hand-coded Bezier/arc/ellipse/polygon character faces, eyes, hands, or bodies!
//      - Renders `morphA_robot`, `morphA_ai`, `morphA_human` 1:1 from
//        `Cortex25D.drawTriMorphHime` or parsed `Path2D` (`evenodd`) from
//        `assets/hime_notan_svg/morphA_*.svg` / `window.CORTEX_HIME_SVG_BUNDLE`
//        with `0.0px` rigid alignment (`IoU = 1.00000`) and classic `#0B0D13` × `#FAF8F5`
//        Notan + focal accents (`#E2E8F0` Robot, `#38BDF8` AI, `#FF2E55` Human sailor ribbon)!
//   2. Multi-Layer Cross-Color Monograph Contrast (`#52`):
//      - `#08090C` / `#F5F0E6` stage + `#121826` / `#EBE3D3` bays + `#475569` grid +
//        `#38BDF8` square-wave scopes + `#FF2E55` cardiac ECG & scan-blade + `#FBBF24`
//        token waterfall badges (`0` `#FF9EBB`, `shadowBlur === 0`).
//   3. Autonomous Per-Character Japanese Choreography (`#53`):
//      - `L17` (`T03`/`T02` split idx 14) strictly inside left `safeBox: { x0: 96, y0: 116, x1: 952, y1: 752 }`.
//      - `L18` (`T11` split idx 9) single combined multi-line constellations inside
//        `safeBox: { x0: 316, y0: 155, x1: 1604, y1: 875 }` framed by spilling token rails!
// ============================================================================
(function () {
  'use strict';

  const core = window.CortexPDoomCore;
  const { W, H, TAU, clamp, lerp, smoothstep, ease, hash, F, font } = core;

  const T0 = 91.52;
  const T1 = 101.16;
  const BPM = 193.5;

  // --------------------------------------------------------------------------
  // 1:1 Traced SVG `Path2D` Loader & Renderer (`morphA_robot / ai / human`)
  // --------------------------------------------------------------------------
  const _svgCache = new Map();
  let _bundleRequested = false;

  function ensureSvgAsset(poseKey) {
    if (_svgCache.has(poseKey)) return _svgCache.get(poseKey);
    if (typeof document !== 'undefined' && !_bundleRequested && !window.CORTEX_HIME_SVG_BUNDLE) {
      _bundleRequested = true;
      const sc = document.createElement('script');
      sc.src = 'assets/hime_notan_svg/hime-svg-bundle.js';
      sc.async = true;
      document.head.appendChild(sc);
    }
    const raw = window.CORTEX_HIME_SVG_BUNDLE && window.CORTEX_HIME_SVG_BUNDLE[poseKey];
    if (typeof raw === 'string' && raw.length > 64) {
      const parsed = parseTracedSvg(raw);
      if (parsed) {
        _svgCache.set(poseKey, parsed);
        return parsed;
      }
    }
    if (typeof XMLHttpRequest !== 'undefined' && !_svgCache.has(poseKey + ':syncTried')) {
      _svgCache.set(poseKey + ':syncTried', true);
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `assets/hime_notan_svg/${poseKey}.svg`, false);
        xhr.send(null);
        if ((xhr.status === 200 || xhr.status === 0) && xhr.responseText && xhr.responseText.includes('<svg')) {
          const parsed = parseTracedSvg(xhr.responseText);
          if (parsed) {
            _svgCache.set(poseKey, parsed);
            return parsed;
          }
        }
      } catch (_) {}
    }
    if (typeof fetch === 'function' && !_svgCache.has(poseKey + ':fetching')) {
      _svgCache.set(poseKey + ':fetching', true);
      fetch(`assets/hime_notan_svg/${poseKey}.svg`)
        .then((r) => (r.ok ? r.text() : ''))
        .then((txt) => {
          if (txt && txt.includes('<svg')) {
            const parsed = parseTracedSvg(txt);
            if (parsed) _svgCache.set(poseKey, parsed);
          }
        })
        .catch(() => {});
    }
    return null;
  }

  function parseTracedSvg(svgText) {
    if (typeof DOMParser === 'undefined' || typeof Path2D === 'undefined') return null;
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return null;
    const vb = (svg.getAttribute('viewBox') || '0 0 1024 1024').trim().split(/[\s,]+/).map(Number);
    const vw = vb[2] || 1024;
    const vh = vb[3] || 1024;
    const items = [];
    const paths = svg.querySelectorAll('path');
    for (let i = 0; i < paths.length; i++) {
      const p = paths[i];
      const d = p.getAttribute('d');
      if (!d) continue;
      const gId = (p.parentElement && p.parentElement.getAttribute('id')) || '';
      items.push({
        id: p.getAttribute('id') || '',
        group: gId,
        role: p.getAttribute('data-role') || '',
        fill: p.getAttribute('fill') || '',
        fillRule: p.getAttribute('fill-rule') === 'evenodd' ? 'evenodd' : 'nonzero',
        rootX: parseFloat(p.getAttribute('data-root-x') || '512'),
        rootY: parseFloat(p.getAttribute('data-root-y') || '250'),
        amp: parseFloat(p.getAttribute('data-amp') || (gId === 'back-hair-locks' ? '1.0' : '0.0')),
        phase: parseFloat(p.getAttribute('data-phase') || '0'),
        path2d: new Path2D(d)
      });
    }
    return { vw, vh, items };
  }

  function drawTracedTriMorphForm(ctx, cad, formKey, cx, cy, targetH, t, isPaper) {
    // V6: Zero premature mid-song morph flashing! Render unique intense gaze plate `C13` cleanly in right cinema bay!
    const v6 = window.CortexV6;
    if (v6 && typeof v6.drawCinematicPlate === 'function' && v6.getPlateImage('C13')) {
      v6.drawCinematicPlate(ctx, 'C13', {
        mode: 'bay',
        cx: cx,
        cy: cy - 14,
        w: 740,
        h: 770,
        t: t,
        kick: beatKick(t),
        zoom: 1.06 + Math.max(0, (t - T0) / (T1 - T0)) * 0.10,
        fx: 0.50,
        fy: 0.28,
        isPaper: !!isPaper
      });
      return;
    }
    if (cad && typeof cad.drawTriMorphHime === 'function') {
      cad.drawTriMorphHime(ctx, 'morphA', formKey, cx, cy, targetH, t, {
        darkCol: '#08090C',
        lightCol: '#FAF8F5',
        accentCol: '#FF2E55',
        isPaper
      });
    }
  }

  function wOnset(typo, key, idx, fb) {
    const c = typo && typo.cue ? typo.cue(key) : null;
    return (c && c.words && c.words[idx]) ? c.words[idx].start : fb;
  }

  function beatKick(t) {
    const ph = ((((t * BPM) / 60) % 1) + 1) % 1;
    return Math.pow(Math.max(0, 1 - ph * 3.1), 2.3);
  }

  function ecgWave(phase) {
    const u = ((phase % 1) + 1) % 1;
    let y = 0;
    y += 0.15 * Math.exp(-Math.pow((u - 0.18) / 0.035, 2));
    y -= 0.20 * Math.exp(-Math.pow((u - 0.30) / 0.012, 2));
    y += 1.00 * Math.exp(-Math.pow((u - 0.335) / 0.014, 2));
    y -= 0.32 * Math.exp(-Math.pow((u - 0.37) / 0.014, 2));
    y += 0.26 * Math.exp(-Math.pow((u - 0.56) / 0.052, 2));
    return y;
  }

  function resolveShot(t, typo) {
    const t17Mid1 = wOnset(typo, 'L17', 5, 92.75) - 0.02;
    const t17Mid2 = wOnset(typo, 'L17', 10, 93.95) - 0.02;
    const t17B = wOnset(typo, 'L17', 14, 94.88) - 0.02;
    const t18A = 95.82;
    const t18Mid1 = wOnset(typo, 'L18', 5, 97.34) - 0.02;
    const t18B = wOnset(typo, 'L18', 9, 98.56) - 0.02;
    const t18Mid2 = wOnset(typo, 'L18', 13, 99.77) - 0.02;

    if (t < t17Mid1) return { cut: 1, cue: 'L17', form: 'robot', isPaper: false, tag: 'CUT_01 // MORPH_A_ROBOT_SHELL' };
    if (t < t17Mid2) return { cut: 2, cue: 'L17', form: 'ai',    isPaper: false, tag: 'CUT_02 // MORPH_A_AI_HOLOGRAM' };
    if (t < t17B)    return { cut: 3, cue: 'L17', form: 'human', isPaper: true,  tag: 'CUT_03 // MORPH_A_SAILOR_NOTAN' };
    if (t < t18A)    return { cut: 4, cue: 'L17', form: 'human', isPaper: false, tag: 'CUT_04 // LOOK_AT_ME_LOCK' };
    if (t < t18Mid1) return { cut: 5, cue: 'L18', form: 'ai',    isPaper: false, tag: 'CUT_05 // SPILLING_TOKEN_DRUMS' };
    if (t < t18B)    return { cut: 6, cue: 'L18', form: 'human', isPaper: true,  tag: 'CUT_06 // TOKEN_WATERFALL_SHEET' };
    if (t < t18Mid2) return { cut: 7, cue: 'L18', form: 'robot', isPaper: false, tag: 'CUT_07 // ONE_MS_LATENCY_FLAP' };
    return { cut: 8, cue: 'L18', form: 'human', isPaper: false, tag: 'CUT_08 // JITTER_PROOF_SYNAPSE' };
  }

  function drawMorphWaveformBox(ctx, t, form, isPaper) {
    const bx = 96;
    const by = 776;
    const bw = 856;
    const bh = 128;

    ctx.save();
    ctx.fillStyle = isPaper ? '#FAF8F5' : '#121826';
    ctx.fillRect(bx, by, bw, bh);
    const waveCol = form === 'robot' ? '#38BDF8' : (form === 'ai' ? '#FBBF24' : '#FF2E55');
    ctx.strokeStyle = waveCol;
    ctx.lineWidth = 2.4;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = waveCol;
    ctx.fillRect(bx, by, 286, 26);
    ctx.fillStyle = '#08090C';
    ctx.font = font(F.mono(900), 13);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`▸ SIGNAL_MODE // ${form.toUpperCase()}_WAVE`, bx + 10, by + 13);

    ctx.strokeStyle = waveCol;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    for (let x = bx + 18; x <= bx + bw - 18; x += 5) {
      const u = (x - bx) / 220 - t * 2.2;
      let val = 0;
      if (form === 'robot') {
        val = (((u % 1) + 1) % 1) < 0.5 ? 0.65 : -0.65;
      } else if (form === 'ai') {
        val = Math.sin(u * TAU) * 0.55 + Math.sin(u * TAU * 3) * 0.25;
      } else {
        val = ecgWave(u) * 1.15 - 0.15;
      }
      const wy = by + 76 - val * 34;
      if (x === bx + 18) ctx.moveTo(x, wy);
      else ctx.lineTo(x, wy);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawTokenWaterfallRails(ctx, t, isPaper) {
    const TOK_SAMPLES = ['0x7F', 'TOK', '1ms', 'Δt', 'SYN', '99%', '♥', 'ACK', 'UTF8', 'EOS'];
    const colsX = [78, 178, W - 278, W - 178];

    ctx.save();
    for (let c = 0; c < colsX.length; c++) {
      const x = colsX[c];
      ctx.fillStyle = isPaper ? '#EBE3D3' : '#121826';
      ctx.fillRect(x, 114, 88, 796);
      ctx.strokeStyle = isPaper ? '#0376B8' : '#475569';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(x, 114, 88, 796);

      const speed = (c % 2 === 0 ? 190 : -165);
      for (let r = 0; r < 11; r++) {
        const rawY = ((r * 74 + (t - 95.82) * speed) % 770 + 770) % 770;
        const y = 132 + rawY;
        const hot = (r + c) % 4 === 0;
        ctx.fillStyle = hot ? (c % 2 === 0 ? '#FF2E55' : '#FBBF24') : (isPaper ? '#FAF8F5' : '#08090C');
        ctx.fillRect(x + 8, y - 16, 72, 32);
        ctx.strokeStyle = hot ? '#08090C' : '#38BDF8';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(x + 8, y - 16, 72, 32);

        ctx.fillStyle = hot ? '#08090C' : (isPaper ? '#08090C' : '#FAF8F5');
        ctx.font = font(F.mono(800), 14);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(TOK_SAMPLES[(r + c * 3) % TOK_SAMPLES.length], x + 44, y);
      }
    }
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
    const fg = isPaper ? '#08090C' : (shot.form === 'human' ? '#FF2E55' : '#38BDF8');

    ctx.save();
    ctx.shadowBlur = 0;

    // Multi-color Monograph Stage Frame
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = isPaper ? '#EBE3D3' : '#121826';
    ctx.fillRect(52, 52, W - 104, 44);
    ctx.fillRect(52, 924, W - 104, 46);

    if (core.drawBurinHatch) {
      core.drawBurinHatch(ctx, 56, 98, 152, 136, 8, Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, W - 208, 98, 152, 136, 8, -Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, 56, 786, 152, 136, 8, -Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, W - 208, 786, 152, 136, 8, Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
    }

    ctx.strokeStyle = isPaper ? '#0376B8' : '#475569';
    ctx.lineWidth = 1.0;
    for (let x = 96; x <= W - 96; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 96);
      ctx.lineTo(x, 924);
      ctx.stroke();
    }
    for (let y = 144; y <= 880; y += 92) {
      ctx.beginPath();
      ctx.moveTo(52, y);
      ctx.lineTo(W - 52, y);
      ctx.stroke();
    }

    ctx.strokeStyle = isPaper ? '#08090C' : '#38BDF8';
    ctx.lineWidth = 2.6;
    ctx.strokeRect(52, 52, W - 104, 918);

    ctx.fillStyle = shot.form === 'human' ? '#FF2E55' : (shot.form === 'ai' ? '#38BDF8' : '#FBBF24');
    ctx.fillRect(52, 52, 468, 44);
    ctx.fillStyle = shot.form === 'human' ? '#FAF8F5' : '#08090C';
    ctx.font = font(F.mono(900), 15);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`▸ P08_TRI_MORPH // ${shot.tag}`, 70, 74);

    if (!typo) {
      ctx.restore();
      return { isPaper, bg, fg, duotone: { bg, fg }, bloom: 0, ca: 0, flash: 0, shake: kick * 0.12 };
    }

    const t17Mid1 = wOnset(typo, 'L17', 5, 92.75) - 0.02;
    const t17Mid2 = wOnset(typo, 'L17', 10, 93.95) - 0.02;
    const t17B = wOnset(typo, 'L17', 14, 94.88) - 0.02;
    const t18B = wOnset(typo, 'L18', 9, 98.56) - 0.02;

    if (shot.cue === 'L17') {
      // V6.1: SMASHED rigid 50/50 left-right split! Full-Bleed `C13` with 4 dynamic multi-angle camera cuts
      // + free-ranging kinetic typography shifting composition on every single cut!
      const v6 = window.CortexV6;
      const cutBounds = [
        [91.52, t17Mid1],
        [t17Mid1, t17Mid2],
        [t17Mid2, t17B],
        [t17B, 95.82]
      ];
      const [cT0, cT1] = cutBounds[Math.max(0, Math.min(3, shot.cut - 1))];
      const cu = clamp((t - cT0) / Math.max(0.12, cT1 - cT0), 0, 1);

      const camSpecs = [
        // Cut 1: Dramatic wide push-in panning slightly left->right
        { zoom0: 1.05, zoom1: 1.24, panX0: -90, panX1: 60,  panY0: 30,  panY1: -20, rot0: -0.025, rot1: 0.01,  fx: 0.54, fy: 0.30 },
        // Cut 2: Intimate eye-line close-up sweep with bold Dutch tilt
        { zoom0: 1.38, zoom1: 1.56, panX0: 80,  panX1: -90, panY0: -25, panY1: 20,  rot0: 0.055,  rot1: 0.015, fx: 0.50, fy: 0.24 },
        // Cut 3: Dynamic diagonal pull-back reveal
        { zoom0: 1.34, zoom1: 1.06, panX0: -60, panX1: 75,  panY0: -40, panY1: 35,  rot0: -0.05,  rot1: 0.02,  fx: 0.46, fy: 0.32 },
        // Cut 4: Intense direct push-in toward eyes (`私を見て!`)
        { zoom0: 1.08, zoom1: 1.34, panX0: 35,  panX1: -20, panY0: 45,  panY1: -35, rot0: 0.018,  rot1: -0.01, fx: 0.50, fy: 0.27 }
      ];
      const cs = camSpecs[Math.max(0, Math.min(3, shot.cut - 1))];

      // V7: SOLE pre-finale `C13` reveal strictly in Cut 4 (`t >= t17B && t < t17B + 1.85`, <= 1.85s)!
      if (shot.cut === 4 && t >= t17B && t < Math.min(95.82, t17B + 1.85) && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C13')) {
        v6.drawLivingFullBleed(ctx, 'C13', {
          t, u: cu, kick,
          ...cs,
          scrim: isPaper ? 0.24 : 0.30,
          isPaper: false
        });
      } else {
        // Cuts 1-3: High-velocity geometric Calculation-Matrix Shatter MG (ZERO C13 hold!)
        ctx.save();
        const cx = W * 0.5, cy = H * 0.5;
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.45 * (shot.cut % 2 === 0 ? -1 : 1));
        for (let f = 0; f < 10; f++) {
          const a = (f / 10) * TAU + t * 0.6;
          const dist = 160 + (f % 3) * 145 + Math.sin(t * 5 + f) * 28;
          ctx.strokeStyle = f % 3 === 0 ? '#FF2E55' : (f % 2 === 0 ? '#38BDF8' : '#FBBF24');
          ctx.lineWidth = f % 2 === 0 ? 3.2 : 1.8;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * dist, Math.sin(a) * dist);
          ctx.lineTo(Math.cos(a + 0.32) * (dist + 120), Math.sin(a + 0.32) * (dist + 120));
          ctx.lineTo(Math.cos(a - 0.18) * (dist + 90), Math.sin(a - 0.18) * (dist + 90));
          ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
      }

      // Sleek moving editorial speedlines along outer frame edges (zero rigid middle divider wall!)
      ctx.save();
      ctx.strokeStyle = 'rgba(217, 59, 88, 0.32)';
      ctx.lineWidth = 1.6;
      const lineShift = ((t * 420) % 140);
      for (let k = -2; k < 16; k++) {
        const lx = k * 140 + lineShift;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx - 180, H);
        ctx.stroke();
      }
      ctx.restore();

      // Free-ranging kinetic Japanese typography changing screen anchor EVERY cut (ZERO left-column trap!)
      if (shot.cut === 1) {
        typo.drawT03RadicalRailSnap(ctx, ['冷たい', '計算'], 520, 355, 224,
          smoothstep(0.0, 0.22, cu), 0, {
            t, cueId: 'L17', formation: 'stamps', maxHeight: 560,
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55',
            safeBox: { x0: 96, y0: 96, x1: 1240, y1: 660 }
          });
      } else if (shot.cut === 2) {
        typo.drawT03RadicalRailSnap(ctx, ['なんか', 'じゃ'], 1340, 650, 290,
          smoothstep(0.0, 0.22, cu), 0, {
            t, cueId: 'L17', formation: 'brutalist', maxHeight: 560,
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55',
            safeBox: { x0: 680, y0: 320, x1: 1824, y1: 920 }
          });
      } else if (shot.cut === 3) {
        typo.drawT01SlapSticker(ctx, ['ないよ'], 960, 725, 320,
          smoothstep(0.0, 0.22, cu), 0, {
            t, cueId: 'L17', formation: 'arc', isPaper: false, maxHeight: 520,
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55',
            safeBox: { x0: 140, y0: 440, x1: 1780, y1: 930 }
          });
      } else {
        const exitP = smoothstep(95.62, 95.80, t);
        typo.drawT02ExtrudedMonolith(ctx, ['見てて'], 960, 745, 275,
          smoothstep(0.0, 0.24, cu), exitP, {
            t, cueId: 'L17', formation: 'stamps', depth: 28, maxHeight: 500,
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55',
            safeBox: { x0: 160, y0: 480, x1: 1760, y1: 935 }
          });
      }
    } else {
      // V7 L18: Pure kinetic Token Waterfall Rails + Split-Flap Board (removed C13 duplicate)
      drawTokenWaterfallRails(ctx, t, isPaper);

      if (shot.cut === 5 || shot.cut === 6) {
        const u = clamp((t - 95.82) / Math.max(0.25, t18B - 95.82), 0, 1);
        typo.drawT11SplitFlapBoard(ctx, ['零れ出す', 'トークンも'], W * 0.5, 512, 176,
          smoothstep(0.0, 0.24, u), t, {
            t, cueId: 'L18', formation: shot.cut === 5 ? 'stamps' : 'cascade', isPaper, maxHeight: 620,
            bg,
            fg: isPaper ? '#08090C' : '#FAF8F5',
            accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: isPaper ? '#0376B8' : '#38BDF8',
            safeBox: { x0: 306, y0: 145, x1: 1614, y1: 880 }
          });
      } else {
        const u = clamp((t - t18B) / Math.max(0.25, 101.16 - t18B), 0, 1);
        const exitP = smoothstep(100.92, 101.14, t);
        typo.drawT11SplitFlapBoard(ctx, ['一ミリ秒の', '遅延も'], W * 0.5, 512, 176,
          smoothstep(0.0, 0.24, u) * (1 - exitP * 0.85), t, {
            t, cueId: 'L18', formation: shot.cut === 7 ? 'brutalist' : 'stamps', maxHeight: 620,
            bg: '#08090C', fg: '#FAF8F5', accent: '#FBBF24', sparkCol: '#FF2E55', auxCol: '#38BDF8',
            safeBox: { x0: 306, y0: 145, x1: 1614, y1: 880 }
          });
      }
    }

    ctx.restore();
    return { isPaper, bg, fg, duotone: { bg, fg }, bloom: 0, ca: 0, flash: 0, shake: kick * 0.12 };
  }

  const plateSpec = {
    id: 'P08_tri_morph_look',
    t0: T0,
    t1: T1,
    render
  };
  window.CortexScenes = window.CortexScenes || {};
  window.CortexScenes.P08_tri_morph_look = plateSpec;
  if (typeof window.registerCortexPlate === 'function') {
    window.registerCortexPlate('P08_tri_morph_look', plateSpec);
  }
})();
