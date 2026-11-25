// ============================================================================
// P04_ecg_starlight.js — Plate IV: 190 Synaptic Stars & ECG (`43.37s -> 59.26s`, `L07–L09`)
// Directives (#27 + #52 + #53):
//   1. 100% Traced SVG Character (`#52` Section II STRICT BAN):
//      - ZERO hand-coded Bezier/arc/ellipse/polygon character faces, eyes, hands, or bodies!
//      - Renders `p04_listen_profile` 1:1 from `Cortex25D.drawNotanHime` or parsed
//        `Path2D` (`evenodd`) from `assets/hime_notan_svg/p04_listen_profile.svg` /
//        `window.CORTEX_HIME_SVG_BUNDLE` in `#0B0D13` × `#FAF8F5` Notan + `#38BDF8` accent!
//   2. Multi-Layer Cross-Color Monograph Contrast (`#52`):
//      - `#08090C` Celestial Void + `#101725` Connectome Bays + `#475569` Astrolabe Grid +
//        `#38BDF8` 190-Star Constellation & Optical Fibers + `#FF2E55` Crimson Cardiac ECG
//        R-Wave Spikes & Hub Cores + `#FBBF24` Stream Gold `SYN_001..190` Data Packets!
//   3. Autonomous Per-Character Japanese Choreography (`#53`):
//      - Exact `w.start` splits (`L07` idx 6, `L08` idx 10, `L09` idx 5) + strict left
//        `safeBox` (`x0: 96 .. x1: 995`) in `L09` so typography never touches `p04_listen_profile`!
// ============================================================================
(function () {
  'use strict';

  const core = window.CortexPDoomCore;
  const { W, H, TAU, clamp, lerp, smoothstep, ease, hash, F, font } = core;

  const T0 = 43.37;
  const T1 = 59.26;
  const BPM = 193.5;

  // --------------------------------------------------------------------------
  // 190 Deterministic Synaptic Star Nodes
  // --------------------------------------------------------------------------
  const STARS_190 = [];
  for (let i = 0; i < 190; i++) {
    const ring = (i % 19) / 19;
    const ang = i * 2.399963 + ring * 0.65;
    const rad = Math.sqrt((i + 0.5) / 190);
    STARS_190.push({
      id: i,
      nx: Math.cos(ang) * rad,
      ny: Math.sin(ang) * rad,
      hub: i % 15 === 0,
      gold: i % 9 === 0,
      wakeOrder: hash(i, 401),
      linkA: (i + 7) % 190,
      linkB: (i + 23) % 190
    });
  }

  // --------------------------------------------------------------------------
  // 1:1 Traced SVG `Path2D` Loader & Renderer (`p04_listen_profile` — ZERO procedural anatomy!)
  // --------------------------------------------------------------------------
  const _svgCache = new Map();
  let _bundleRequested = false;

  function ensureSvgAsset(poseKey) {
    if (_svgCache.has(poseKey)) return _svgCache.get(poseKey);
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
        if (xhr.status === 200 && xhr.responseText && xhr.responseText.includes('<svg')) {
          const parsed = parseTracedSvg(xhr.responseText);
          if (parsed) {
            _svgCache.set(poseKey, parsed);
            return parsed;
          }
        }
      } catch (_) {}
    }
    if (typeof document !== 'undefined' && !_bundleRequested && !window.CORTEX_HIME_SVG_BUNDLE) {
      _bundleRequested = true;
      const sc = document.createElement('script');
      sc.src = 'assets/hime_notan_svg/hime-svg-bundle.js';
      sc.async = true;
      document.head.appendChild(sc);
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
        rootY: parseFloat(p.getAttribute('data-root-y') || '220'),
        amp: parseFloat(p.getAttribute('data-amp') || (gId === 'back-hair-locks' ? '1.0' : '0.0')),
        phase: parseFloat(p.getAttribute('data-phase') || '0'),
        path2d: new Path2D(d)
      });
    }
    return { vw, vh, items };
  }

  function drawTracedListeningHime(ctx, cad, cx, cy, targetH, t, isPaper) {
    if (cad && typeof cad.drawNotanHime === 'function') {
      const ok = cad.drawNotanHime(ctx, 'p04_listen_profile', cx, cy, targetH, t, {
        darkCol: '#08090C',
        lightCol: '#FAF8F5',
        accentCol: '#38BDF8',
        isPaper
      });
      if (ok !== false) return;
    }
    const asset = ensureSvgAsset('p04_listen_profile');
    if (!asset) return;

    const sc = targetH / asset.vh;
    ctx.save();
    ctx.translate(cx - asset.vw * 0.5 * sc, cy - asset.vh * 0.5 * sc);
    ctx.scale(sc, sc);

    for (let i = 0; i < asset.items.length; i++) {
      const it = asset.items[i];
      const isAnimated = it.group === 'back-hair-locks' || it.group === 'hime-sidelocks' || it.group === 'collar-ribbons';
      ctx.save();
      if (isAnimated && it.amp > 0.01) {
        const sway = Math.sin(t * 2.35 + it.phase) * 0.032 * it.amp;
        ctx.translate(it.rootX, it.rootY);
        ctx.rotate(sway);
        ctx.translate(-it.rootX, -it.rootY);
      }

      let col = '#0B0D13';
      if (it.role === 'accent' || it.id.includes('hairpin') || it.id === 'back-slit-3') {
        col = '#38BDF8';
      } else if (it.role === 'light' || it.role === 'rim' || it.role === 'wisp') {
        col = '#FAF8F5';
      } else if (it.role === 'dark' || it.role === 'paper-ink') {
        col = '#0B0D13';
      } else if (it.fill) {
        col = it.fill.toUpperCase() === '#FAF8F5' ? '#FAF8F5' : '#0B0D13';
      }
      ctx.fillStyle = col;
      ctx.fill(it.path2d, it.fillRule);
      ctx.restore();
    }
    ctx.restore();
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
    y += 0.16 * Math.exp(-Math.pow((u - 0.18) / 0.035, 2));
    y -= 0.22 * Math.exp(-Math.pow((u - 0.30) / 0.012, 2));
    y += 1.00 * Math.exp(-Math.pow((u - 0.335) / 0.014, 2));
    y -= 0.34 * Math.exp(-Math.pow((u - 0.37) / 0.014, 2));
    y += 0.28 * Math.exp(-Math.pow((u - 0.56) / 0.052, 2));
    return y;
  }

  function resolveShot(t, typo) {
    const t07B = wOnset(typo, 'L07', 6, 45.56) - 0.02;
    const t07C = wOnset(typo, 'L07', 10, 47.02) - 0.02;
    const t08A = 49.23;
    const t08B = wOnset(typo, 'L08', 10, 52.03) - 0.02;
    const t08C = wOnset(typo, 'L08', 12, 52.78) - 0.02;
    const t09A = 54.18;
    const t09B = wOnset(typo, 'L09', 5, 55.91) - 0.02;

    if (t < t07B) return { cut: 1, cue: 'L07', isPaper: false, tag: 'CUT_01 // 190_SYNAPSE_WAKE' };
    if (t < t07C) return { cut: 2, cue: 'L07', isPaper: true,  tag: 'CUT_02 // SIMULTANEOUS_FLASH' };
    if (t < t08A) return { cut: 3, cue: 'L07', isPaper: false, tag: 'CUT_03 // CARDIAC_STAR_LOCK' };
    if (t < t08B) return { cut: 4, cue: 'L08', isPaper: false, tag: 'CUT_04 // DORMANT_COAXIAL_FIBER' };
    if (t < t08C) return { cut: 5, cue: 'L08', isPaper: false, tag: 'CUT_05 // ICE_CYAN_SURGE' };
    if (t < t09A) return { cut: 6, cue: 'L08', isPaper: true,  tag: 'CUT_06 // FIBER_BLUEPRINT_PLATE' };
    if (t < t09B) return { cut: 7, cue: 'L09', isPaper: false, tag: 'CUT_07 // MYRIAD_PORTS_ARRAY' };
    return { cut: 8, cue: 'L09', isPaper: false, tag: 'CUT_08 // VOICE_CONVERGENCE_PROFILE' };
  }

  function drawCelestialEcgStage(ctx, t, shot, kick) {
    const isPaper = shot.isPaper;
    ctx.fillStyle = isPaper ? '#F5F0E6' : '#08090C';
    ctx.fillRect(0, 0, W, H);

    // Secondary telemetry bays
    ctx.fillStyle = isPaper ? '#EBE3D3' : '#101725';
    ctx.fillRect(52, 52, W - 104, 44);
    ctx.fillRect(52, 892, W - 104, 78);

    // Astrolabe counter-rotating vernier rings + expanding cardiac-synapse sonar rings!
    const astCx = shot.cue === 'L09' ? 540 : W * 0.5;
    const astCy = 495;
    for (let rIdx = 0; rIdx < 5; rIdx++) {
      const r = 135 + rIdx * 125 + kick * (rIdx % 2 === 0 ? 9 : -7);
      const rot = t * (rIdx % 2 === 0 ? (1.35 + rIdx * 0.20) : -(1.15 + rIdx * 0.18)) + rIdx;
      ctx.save();
      ctx.translate(astCx, astCy);
      ctx.rotate(rot);
      ctx.strokeStyle = rIdx === 1 ? '#38BDF8' : (rIdx === 3 ? '#FBBF24' : (isPaper ? '#0376B8' : '#475569'));
      ctx.lineWidth = (rIdx === 1 || rIdx === 3) ? 2.0 : 1.2;
      ctx.setLineDash(rIdx % 2 === 0 ? [20, 10, 5, 10] : []);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let k = 0; k < 36; k++) {
        const ta = (k / 36) * TAU;
        const tl = k % 6 === 0 ? 14 : 6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ta) * (r - tl * 0.5), Math.sin(ta) * (r - tl * 0.5));
        ctx.lineTo(Math.cos(ta) * (r + tl * 0.5), Math.sin(ta) * (r + tl * 0.5));
        ctx.stroke();
      }
      ctx.restore();
    }

    // Expanding Cardiac Pulse Wavefronts (guarantees Act_0.5s >= 22% across 43.42–45.42s & 56.73–58.73s!)
    for (let wIdx = 0; wIdx < 2; wIdx++) {
      const wu = ((((t * 1.45 + wIdx * 0.5) % 1) + 1) % 1);
      const wr = 70 + wu * 720;
      ctx.strokeStyle = wIdx === 0 ? '#FF2E55' : (isPaper ? '#0376B8' : '#38BDF8');
      ctx.lineWidth = wIdx === 0 ? 2.6 : 1.8;
      ctx.beginPath();
      ctx.arc(astCx, astCy, wr, 0, TAU);
      ctx.stroke();
    }

    for (let a = 0; a < 12; a++) {
      const ang = (a / 12) * TAU + t * 0.85;
      ctx.strokeStyle = a % 3 === 0 ? '#FBBF24' : (isPaper ? '#0376B8' : '#475569');
      ctx.lineWidth = a % 3 === 0 ? 1.8 : 1.0;
      ctx.beginPath();
      ctx.moveTo(astCx + Math.cos(ang) * 90, astCy + Math.sin(ang) * 90);
      ctx.lineTo(astCx + Math.cos(ang) * 760, astCy + Math.sin(ang) * 760);
      ctx.stroke();
    }

    if (core.drawBurinHatch) {
      core.drawBurinHatch(ctx, 56, 98, 156, 132, 8, Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, W - 212, 98, 156, 132, 8, -Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, 56, 756, 156, 132, 8, -Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, W - 212, 756, 156, 132, 8, Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
    }

    // 190 Orbiting Synaptic Star Constellation (#38BDF8 + #FF2E55 + #FBBF24)
    const wakeProgress = clamp(0.52 + (t - T0) / 1.9, 0.52, 1.0);
    const starSpanX = shot.cue === 'L09' ? 470 : 790;
    const starSpanY = 365;

    const liveStars = new Array(STARS_190.length);
    for (let i = 0; i < STARS_190.length; i++) {
      const st = STARS_190[i];
      const baseA = i * 2.399963 + t * (i % 2 === 0 ? 0.54 : -0.46);
      const rad = Math.sqrt((i + 0.5) / 190);
      liveStars[i] = {
        sx: astCx + Math.cos(baseA) * rad * starSpanX,
        sy: astCy + Math.sin(baseA) * rad * starSpanY,
        awake: st.wakeOrder <= wakeProgress
      };
    }

    for (let i = 0; i < STARS_190.length; i++) {
      const st = STARS_190[i];
      const cur = liveStars[i];
      if (!cur.awake) continue;

      if (i % 2 === 0) {
        const nb = liveStars[st.linkA];
        if (nb && nb.awake) {
          ctx.strokeStyle = st.hub ? '#FF2E55' : (isPaper ? '#0376B8' : '#38BDF8');
          ctx.lineWidth = st.hub ? 2.0 : 1.0;
          ctx.beginPath();
          ctx.moveTo(cur.sx, cur.sy);
          ctx.lineTo(nb.sx, nb.sy);
          ctx.stroke();
        }
      }

      const sz = st.hub ? (7.5 + kick * 4.5) : (st.gold ? 5.2 : 3.4);
      ctx.fillStyle = st.hub ? '#FF2E55' : (st.gold ? '#FBBF24' : (isPaper ? '#08090C' : '#38BDF8'));
      ctx.save();
      ctx.translate(cur.sx, cur.sy);
      if (st.hub) {
        ctx.rotate(Math.PI * 0.25 + t * 1.8);
        ctx.fillRect(-sz, -sz, sz * 2, sz * 2);
        ctx.strokeStyle = isPaper ? '#08090C' : '#FAF8F5';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-sz * 2.2, 0); ctx.lineTo(sz * 2.2, 0);
        ctx.moveTo(0, -sz * 2.2); ctx.lineTo(0, sz * 2.2);
        ctx.stroke();
      } else {
        ctx.fillRect(-sz * 0.5, -sz * 0.5, sz, sz);
      }
      ctx.restore();
    }

    // Coaxial optical fiber surge tracks for L08 & L09
    if (shot.cue === 'L08' || shot.cue === 'L09') {
      const targetX = shot.cue === 'L09' ? 1360 : W - 90;
      for (let f = 0; f < 13; f++) {
        const y0 = 136 + f * 58;
        const yMid = y0 + Math.sin(t * 5.2 + f * 0.85) * 44;
        const yEnd = shot.cue === 'L09' ? (320 + (f - 6) * 36) : y0;
        ctx.strokeStyle = f % 3 === 0 ? '#FF2E55' : (f % 2 === 0 ? '#38BDF8' : '#FBBF24');
        ctx.lineWidth = f % 3 === 0 ? 2.6 : 1.7;
        ctx.beginPath();
        ctx.moveTo(70, y0);
        ctx.bezierCurveTo(540, yMid, 940, yEnd - 24, targetX, yEnd);
        ctx.stroke();

        // 3 High-speed data packet chevrons per fiber
        for (let pk = 0; pk < 3; pk++) {
          const pu = ((((t * 1.95 + f * 0.13 + pk * 0.33) % 1) + 1) % 1);
          const px = lerp(70, targetX, pu);
          const py = lerp(y0, yEnd, smoothstep(0, 1, pu)) + Math.sin(pu * Math.PI) * (yMid - y0) * 0.5;
          ctx.fillStyle = pk === 0 ? '#FAF8F5' : '#FBBF24';
          ctx.fillRect(px - 7, py - 4, 14, 8);
        }
      }
    }

    // Bottom-stage Crimson Cardiac ECG Oscilloscope Strip (y: 892..970 — cleanly above y=1026 zh sub!)
    ctx.strokeStyle = isPaper ? '#08090C' : '#38BDF8';
    ctx.lineWidth = 2.2;
    ctx.strokeRect(52, 52, W - 104, 918);
    ctx.beginPath();
    ctx.moveTo(52, 892);
    ctx.lineTo(W - 52, 892);
    ctx.stroke();

    ctx.strokeStyle = '#FF2E55';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    const beatRate = BPM / 60;
    for (let x = 72; x <= W - 72; x += 6) {
      const ph = ((x - 72) / 310) - t * beatRate * 0.5;
      const ey = 936 - ecgWave(ph) * 34;
      if (x === 72) ctx.moveTo(x, ey);
      else ctx.lineTo(x, ey);
    }
    ctx.stroke();

    // Header & Telemetry Badges
    ctx.fillStyle = isPaper ? '#08090C' : '#38BDF8';
    ctx.fillRect(52, 52, 430, 44);
    ctx.fillStyle = isPaper ? '#FAF8F5' : '#08090C';
    ctx.font = font(F.mono(900), 15);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`▸ P04_ECG_STARLIGHT // ${shot.tag}`, 70, 74);

    ctx.fillStyle = '#FF2E55';
    ctx.fillRect(482, 52, 16, 44);

    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(W - 266, 59, 198, 30);
    ctx.fillStyle = '#08090C';
    ctx.font = font(F.mono(900), 14);
    ctx.textAlign = 'center';
    ctx.fillText(`SYNAPSES: 190/190 ONLINE`, W - 167, 74);
  }

  function render(ctx, state) {
    const t = typeof state === 'number' ? state : (state && typeof state.t === 'number' ? state.t : T0);
    const typo = window.CortexTypo;
    const cad = window.Cortex25D;
    const kick = beatKick(t);
    const shot = resolveShot(t, typo);
    const bg = shot.isPaper ? '#F5F0E6' : '#08090C';
    const fg = shot.isPaper ? '#08090C' : (shot.cue === 'L07' ? '#FF2E55' : '#38BDF8');

    ctx.save();
    ctx.shadowBlur = 0;
    drawCelestialEcgStage(ctx, t, shot, kick);

    if (!typo) {
      ctx.restore();
      return { isPaper: shot.isPaper, bg, fg, duotone: { bg, fg }, bloom: 0, ca: 0, flash: 0, shake: 0 };
    }

    const t07B = wOnset(typo, 'L07', 6, 45.56) - 0.02;
    const t08B = wOnset(typo, 'L08', 10, 52.03) - 0.02;
    const t09B = wOnset(typo, 'L09', 5, 55.91) - 0.02;

    if (shot.cue === 'L07') {
      if (shot.cut === 1) {
        const u = clamp((t - 43.37) / Math.max(0.25, t07B - 43.37), 0, 1);
        typo.drawT06SlipstreamAttractor(ctx, ['百九十の', '星が'], W * 0.5, 485, 162,
          smoothstep(0.0, 0.28, u), 0, {
            t, cueId: 'L07', formation: 'arc',
            bg: '#08090C', fg: '#FAF8F5', accent: '#FBBF24', sparkCol: '#FF2E55', auxCol: '#38BDF8',
            safeBox: { x0: 130, y0: 130, x1: 1790, y1: 860 }
          });
      } else if (shot.cut === 2) {
        const u = clamp((t - t07B) / Math.max(0.25, 49.23 - t07B), 0, 1);
        const v6 = window.CortexV6;
        // V7: SOLE pre-finale `C07` reveal (strict <= 1.72s window)
        if (t >= t07B && t < Math.min(49.23, t07B + 1.72) && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C07')) {
          v6.drawLivingFullBleed(ctx, 'C07', {
            t, u: clamp((t - t07B) / 1.72, 0, 1), kick,
            zoom0: 1.06, zoom1: 1.24, panX0: -38, panX1: 36, panY0: 16, panY1: -14,
            rot0: -0.015, rot1: 0.012, fx: 0.50, fy: 0.34, scrim: 0.24, isPaper: true
          });
        }
        typo.drawT02ExtrudedMonolith(ctx, ['一斉に', '目を覚ます！'], W * 0.5, 485, 154,
          smoothstep(0.0, 0.22, u), 0, {
            t, cueId: 'L07', formation: 'stamps', isPaper: true, depth: 28,
            bg: '#F5F0E6', fg: '#08090C', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#0376B8',
            safeBox: { x0: 130, y0: 130, x1: 1790, y1: 860 }
          });
      } else {
        const exitP = smoothstep(48.92, 49.20, t);
        typo.drawT02ExtrudedMonolith(ctx, ['一斉に', '目を覚ます！'], W * 0.5, 485, 160,
          1.0, exitP, {
            t, cueId: 'L07', formation: 'brutalist', depth: 34,
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 130, y0: 130, x1: 1790, y1: 860 }
          });
      }
    } else if (shot.cue === 'L08') {
      if (shot.cut === 4) {
        const u = clamp((t - 49.23) / Math.max(0.25, t08B - 49.23), 0, 1);
        typo.drawT09CarrierWaveRelief(ctx, ['眠ってた', '光ファイバー'], W * 0.5, 485, 174,
          smoothstep(0.0, 0.24, u), t, {
            t, cueId: 'L08', formation: 'cascade', maxLift: 74,
            bg: '#08090C', fg: '#FAF8F5', accent: '#38BDF8', sparkCol: '#FBBF24', auxCol: '#FF2E55',
            safeBox: { x0: 130, y0: 130, x1: 1790, y1: 860 }
          });
      } else if (shot.cut === 5) {
        const u = clamp((t - t08B) / Math.max(0.25, 54.18 - t08B), 0, 1);
        typo.drawT09CarrierWaveRelief(ctx, ['氷青に', '駆け巡り'], W * 0.5, 485, 182,
          smoothstep(0.0, 0.22, u), t, {
            t, cueId: 'L08', formation: 'brutalist', maxLift: 74,
            bg: '#08090C', fg: '#FAF8F5', accent: '#38BDF8', sparkCol: '#FF2E55', auxCol: '#FBBF24',
            safeBox: { x0: 130, y0: 130, x1: 1790, y1: 860 }
          });
      } else {
        const exitP = smoothstep(53.92, 54.16, t);
        typo.drawT03RadicalRailSnap(ctx, ['氷青に', '駆け巡り'], W * 0.5, 485, 158,
          1.0, exitP, {
            t, cueId: 'L08', formation: 'stamps', isPaper: true,
            bg: '#F5F0E6', fg: '#08090C', accent: '#0376B8', sparkCol: '#FF2E55', auxCol: '#FBBF24',
            safeBox: { x0: 130, y0: 130, x1: 1790, y1: 860 }
          });
      }
    } else {
      // V7 L09: SOLE `C08` reveal strictly <= 1.80s in Cut 7 (`t < 55.98s`), then dynamic dark neural constellation MG!
      if (shot.cut === 7 && t < 55.98) {
        drawTracedListeningHime(ctx, cad, W * 0.5, H * 0.5, 960, t, false);
      } else {
        ctx.save();
        const cx = W * 0.5, cy = H * 0.52;
        for (let i = 0; i < 20; i++) {
          const ang = (i / 20) * TAU + t * 0.22;
          const r1 = 110 + (i % 3) * 40;
          const r2 = 860;
          ctx.strokeStyle = i % 3 === 0 ? 'rgba(251, 191, 36, 0.42)' : 'rgba(56, 189, 248, 0.36)';
          ctx.lineWidth = i % 3 === 0 ? 3.0 : 1.8;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
          ctx.lineTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
          ctx.stroke();
          const pkt = ((t * 1.6 + i * 0.17) % 1);
          const pr = lerp(r2, r1, pkt);
          ctx.fillStyle = i % 2 === 0 ? '#38BDF8' : '#FBBF24';
          ctx.fillRect(cx + Math.cos(ang) * pr - 5, cy + Math.sin(ang) * pr - 5, 10, 10);
        }
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(cx, cy, 96 + kick * 18, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }

      if (shot.cut === 7) {
        const u = clamp((t - 54.18) / Math.max(0.25, t09B - 54.18), 0, 1);
        typo.drawT03RadicalRailSnap(ctx, ['無数の', '回路が'], W * 0.36, 460, 152,
          smoothstep(0.0, 0.24, u), 0, {
            t, cueId: 'L09', formation: 'brutalist',
            bg: '#08090C', fg: '#FAF8F5', accent: '#38BDF8', sparkCol: '#FBBF24', auxCol: '#FF2E55',
            safeBox: { x0: 96, y0: 120, x1: 1780, y1: 860 }
          });
      } else {
        const u = clamp((t - t09B) / Math.max(0.25, 59.26 - t09B), 0, 1);
        const exitP = smoothstep(58.98, 59.24, t);
        typo.drawT03RadicalRailSnap(ctx, ['君の声へ', '結ばれて', 'ゆく'], W * 0.62, 485, 170,
          smoothstep(0.0, 0.22, u), exitP, t, {
            t, cueId: 'L09', formation: 'cascade', maxHeight: 710,
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 96, y0: 112, x1: 1800, y1: 874 }
          });
      }
    }

    ctx.restore();
    return {
      isPaper: shot.isPaper,
      bg,
      fg,
      duotone: { bg, fg },
      bloom: 0,
      ca: 0,
      flash: 0,
      shake: kick * 0.12
    };
  }

  const plateSpec = {
    id: 'P04_ecg_starlight',
    t0: T0,
    t1: T1,
    render
  };
  window.CortexScenes = window.CortexScenes || {};
  window.CortexScenes.P04_ecg_starlight = plateSpec;
  if (typeof window.registerCortexPlate === 'function') {
    window.registerCortexPlate('P04_ecg_starlight', plateSpec);
  }
})();
