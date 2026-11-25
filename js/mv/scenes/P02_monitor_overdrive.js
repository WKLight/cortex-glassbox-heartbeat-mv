// ============================================================================
// Plate 02 — `P02_monitor_overdrive.js` (`14.20s – 29.78s`)
// V6 Cinema Single-Accent Architecture (100% V6ColorDirector governed, 0 `__v6RawColor` bypass):
//   M1 (14.20–17.30s): 2.5D Connectome Tunnel (`193.5 BPM 起動`) -> Coaxial Shockwave -> 14-Panel `HALOFLUX` & `190 PORTS`
//   M2 (17.30–20.40s): Restored Archival `R=340 / 姫切90°` Drafting Compass (`覚醒前夜`) -> 360° Compass Lens Unveil of `C04`
//   M3 (20.40–23.60s): Crimson Cardiac QRS Ignition (`193.5 心拍点火`) -> Beat Shutter -> `硝子箱の心拍証明` Monument
//   M4 (23.60–26.85s): Perspective Light-Frame Corridor -> Center Unveil `C05` -> Eye-Axis Dolly Match-Cut into `C03`
//   M5 (26.85–29.78s): Pupil Dive into 12-Blade Guilloché Mechanical Iris (`共鳴解放`) -> Coaxial 3D `B3D_01_iris`
// ============================================================================
(function () {
  'use strict';

  const INK = '#08090C';
  const CHAR_INK = '#0B0D13';
  const PANEL = '#121723';
  const SLATE = '#334155';
  const GRAPHITE = '#475569';
  const PAPER = '#F5F0E6';
  const PAPER_SUB = '#E2E8F0';
  const BONE = '#FAF8F5';
  const CYAN = '#38BDF8';
  const COBALT = '#0376B8';
  const GOLD = '#FBBF24';
  const CRIMSON = '#FF2E55';

  const JP_SANS = (w, sz) =>
    `${w} ${Math.round(sz)}px "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", sans-serif`;
  const JP_SERIF = (w, sz) =>
    `${w} ${Math.round(sz)}px "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif`;
  const JP_MONO = (w, sz) =>
    `${w} ${Math.round(sz)}px "JetBrains Mono", "Cascadia Mono", Consolas, monospace`;

  const CUTS = [
    { idx: 1, t0: 14.20, t1: 17.30, bg: INK,   fg: CYAN,    accent: CYAN,    transDur: 0.28, mode: 'blueprintShutterWipe', name: 'M1_TUNNEL_TO_HALOFLUX' },
    { idx: 2, t0: 17.30, t1: 20.40, bg: PAPER, fg: COBALT,  accent: CYAN,    transDur: 0.26, mode: 'cardiacPulseIris',     name: 'M2_R340_COMPASS_TO_C04' },
    { idx: 3, t0: 20.40, t1: 23.60, bg: INK,   fg: CRIMSON, accent: CRIMSON, transDur: 0.30, mode: 'kanjiDoorwayDive',     name: 'M3_CARDIAC_TO_TITLE_MONUMENT' },
    { idx: 4, t0: 23.60, t1: 26.85, bg: INK,   fg: CYAN,    accent: CYAN,    transDur: 0.26, mode: 'pupilBurstMatch',      name: 'M4_CORRIDOR_C05_EYE_TO_C03' },
    { idx: 5, t0: 26.85, t1: 29.78, bg: INK,   fg: CYAN,    accent: CYAN,    transDur: 0.00, mode: 'pupilBurstMatch',      name: 'M5_GUILLOCHE_TO_3D_IRIS' }
  ];

  const HALOFLUX_OPS = [
    'EMBEDDING', 'QKV_PROJ', 'ATTN_190', 'ROPE_PHASE', 'MLP_GATE', 'RESIDUAL', 'LOGIT_LENS',
    'TEMP_36.2C', 'KV_CACHE', 'TOKEN_STREAM', 'SAFETY_LOCK', 'HEART_ROTOR', 'SHORTEST_PATH', 'PULSE_OUT'
  ];

  function drawDieCutGlyph(ctx, glyph, x, y, sz, rotDeg, style) {
    const v6 = window.CortexV6;
    if (v6 && typeof v6.drawEditorialStamp === 'function') {
      const kind = style.circle
        ? 'seal'
        : (style.boxCol
            ? (style.boxCol === CRIMSON || style.boxCol === CYAN || style.boxCol === COBALT ? 'accent' : (style.boxCol === BONE ? 'mono' : 'frosted'))
            : 'bare');
      v6.drawEditorialStamp(ctx, glyph, x, y, sz, (rotDeg * Math.PI) / 180, {
        kind,
        serif: !!style.serif,
        mono: !!style.mono,
        isPaper: !!style.isPaper
      });
      return;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotDeg * Math.PI) / 180);
    ctx.font = style.serif ? JP_SERIF(900, sz) : JP_SANS(900, sz);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = style.txtCol || BONE;
    ctx.fillText(glyph, 0, 0);
    ctx.restore();
  }

  // 2.5D Painter's-Occluded Connectome Tunnel (V6ColorDirector harmonized)
  function drawLayeredTunnel25D(ctx, W, H, t, speed, roll, frameIdx) {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    ctx.rotate(roll);

    const nRings = 16;
    const zSpan = 3200;
    const fov = 720;
    const zTravel = (t * speed) % (zSpan / nRings);
    const tick = Math.floor(frameIdx / 3);

    for (let i = nRings - 1; i >= 0; i--) {
      const z = Math.max(55, (i + 1) * (zSpan / nRings) - zTravel);
      const sc = fov / z;
      const rOuter = 680 * sc;
      const rInner = 470 * sc;
      const twist = i * 0.22 + t * 1.4;

      ctx.fillStyle = (i % 2 === 0) ? PANEL : INK;
      ctx.strokeStyle = (i % 3 === 0) ? BONE : (i % 2 === 0 ? CYAN : SLATE);
      ctx.lineWidth = Math.max(1.8, Math.min(7, 3.2 * sc));
      ctx.beginPath();
      for (let k = 0; k <= 12; k++) {
        const a = (k / 12) * Math.PI * 2 + twist;
        const px = Math.cos(a) * rOuter;
        const py = Math.sin(a) * rOuter * 0.68;
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      for (let k = 12; k >= 0; k--) {
        const a = (k / 12) * Math.PI * 2 + twist;
        const px = Math.cos(a) * rInner;
        const py = Math.sin(a) * rInner * 0.68;
        ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (i > 0) {
        const zNext = Math.max(40, i * (zSpan / nRings) - zTravel);
        const scNext = fov / zNext;
        const rNext = 470 * scNext;
        for (let b = 0; b < 24; b++) {
          const a0 = (b / 24) * Math.PI * 2 + twist;
          const a1 = a0 + 0.16 * Math.sin(b + t * 3);
          const x0 = Math.cos(a0) * rInner;
          const y0 = Math.sin(a0) * rInner * 0.68;
          const x1 = Math.cos(a1) * rNext;
          const y1 = Math.sin(a1) * rNext * 0.68;
          const isSignal = ((b + i + tick) % 8) === 0;
          ctx.strokeStyle = isSignal ? BONE : (b % 2 === 0 ? CYAN : COBALT);
          ctx.lineWidth = Math.max(1.2, Math.min(4.2, (isSignal ? 2.4 : 1.5) * sc));
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.quadraticCurveTo((x0 + x1) * 0.56, (y0 + y1) * 0.44, x1, y1);
          ctx.stroke();
          if (isSignal && sc > 0.40) {
            ctx.fillStyle = BONE;
            ctx.fillRect(Math.round(x0 - 2.5), Math.round(y0 - 2.5), 5, 5);
          }
        }
      }
    }
    ctx.restore();
  }

  // 14-Operator `HALOFLUX` 2.5D Barrel-Roll Ring on Archival Paper (V6.2 `diag_intro_13_23s.jpg` `t=16.50s`!)
  function drawLayeredHaloflux14(ctx, W, H, t, u, frameIdx) {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = PAPER_SUB;
    ctx.fillRect(48, 56, W - 96, 72);
    ctx.fillRect(48, H - 128, W - 96, 72);

    // Subtle millimeter grid on paper
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
    ctx.lineWidth = 1.0;
    for (let gx = 96; gx < W; gx += 96) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (let gy = 96; gy < H; gy += 96) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    ctx.save();
    ctx.translate(W * 0.5, H * 0.52);
    ctx.rotate(-0.28 + u * 0.42);

    const nSlots = 14;
    const R = 585;
    const tiltY = 0.46;
    const baseRot = t * 2.25;
    const stepTick = Math.floor(frameIdx / 4);

    const panels = [];
    for (let i = 0; i < nSlots; i++) {
      const a0 = (i / nSlots) * Math.PI * 2 + baseRot;
      const a1 = ((i + 0.86) / nSlots) * Math.PI * 2 + baseRot;
      panels.push({ i, a0, a1, depth: Math.sin((a0 + a1) * 0.5) });
    }
    panels.sort((A, B) => A.depth - B.depth);

    for (let k = 0; k < 72; k++) {
      const a = (k / 72) * Math.PI * 2 - baseRot * 0.6;
      ctx.strokeStyle = (k % 6 === 0) ? COBALT : GRAPHITE;
      ctx.lineWidth = (k % 6 === 0) ? 3.0 : 1.6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (R * 1.12), Math.sin(a) * (R * 1.12) * tiltY);
      ctx.lineTo(Math.cos(a) * (R * 1.20), Math.sin(a) * (R * 1.20) * tiltY);
      ctx.stroke();
    }

    for (const p of panels) {
      const hPanel = 144;
      const x0 = Math.cos(p.a0) * R, y0 = Math.sin(p.a0) * R * tiltY;
      const x1 = Math.cos(p.a1) * R, y1 = Math.sin(p.a1) * R * tiltY;
      const isAccent = p.depth > 0.52 && (p.i === 2 || p.i === 9);
      const isDarkCard = p.depth > 0 && (p.i % 2 === 0) && !isAccent;

      ctx.fillStyle = isAccent ? CYAN : (isDarkCard ? CHAR_INK : BONE);
      ctx.strokeStyle = p.depth > 0 ? COBALT : GRAPHITE;
      ctx.lineWidth = p.depth > 0 ? 3.2 : 1.6;

      ctx.beginPath();
      ctx.moveTo(x0, y0 - hPanel * 0.5);
      ctx.lineTo(x1, y1 - hPanel * 0.5);
      ctx.lineTo(x1, y1 + hPanel * 0.5);
      ctx.lineTo(x0, y0 + hPanel * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const mx = (x0 + x1) * 0.5;
      const my = (y0 + y1) * 0.5;
      ctx.fillStyle = isDarkCard ? BONE : CHAR_INK;
      ctx.font = JP_MONO(700, p.depth > 0 ? 14 : 11);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(HALOFLUX_OPS[p.i], mx, my - 26);

      ctx.fillStyle = isAccent ? CHAR_INK : COBALT;
      for (let b = 0; b < 5; b++) {
        const bh = 10 + (((p.i * 7 + b * 13 + stepTick) % 5) * 8);
        ctx.fillRect(mx - 32 + b * 14, my + 32 - bh, 10, bh);
      }
    }
    ctx.restore();
  }

  // Restored Beloved V6.2 Archival Blueprint `R=340 / 姫切90°` Drafting Compass (`diag_intro_13_23s.jpg` `t=18.20s`!)
  function drawArchivalHimeCompass(ctx, W, H, cx, cy, R, sweepAng, t, kick) {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, W, H);

    // Millimeter & Major Blueprint Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.26)';
    ctx.lineWidth = 1.0;
    const step = 68;
    for (let x = (cx % step); x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = (cy % step); y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Orthogonal center hairlines + tick ruler
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(80, cy); ctx.lineTo(W - 80, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 60); ctx.lineTo(cx, H - 60); ctx.stroke();
    for (let dx = -748; dx <= 748; dx += 68) {
      const major = (Math.abs(dx) % 272) === 0;
      ctx.beginPath();
      ctx.moveTo(cx + dx, cy - (major ? 12 : 6));
      ctx.lineTo(cx + dx, cy + (major ? 12 : 6));
      ctx.stroke();
    }

    // Precision `姫切90°` Inscribed Construction Square & Right-Angle Proof Marks
    const sq = 170;
    ctx.strokeStyle = CHAR_INK;
    ctx.lineWidth = 2.4;
    ctx.strokeRect(cx - sq, cy - sq, sq * 2, sq * 2);
    // 90-degree corner proof box at top-right of square
    ctx.strokeStyle = COBALT;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(cx + sq - 24, cy - sq, 24, 24);
    ctx.strokeRect(cx - sq, cy + sq - 24, 24, 24);

    // Faint outer vernier guide circle (`R * 1.18`) + ticks
    ctx.strokeStyle = 'rgba(3, 118, 184, 0.28)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.18, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const r0 = (i % 3 === 0) ? R * 1.14 : R * 1.16;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * R * 1.20, cy + Math.sin(a) * R * 1.20);
      ctx.stroke();
    }

    // Active Cerulean Arc Drawn by the Compass Lead (`-PI*0.75 -> -PI*0.75 + sweepAng`)
    const startA = -Math.PI * 0.78;
    const endA = startA + sweepAng;
    ctx.strokeStyle = COBALT;
    ctx.lineWidth = 3.6 + kick * 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, startA, endA);
    ctx.stroke();

    // Physical Mechanical Drafting Compass (Pivot needle at `(cx, cy)`, Graphite nib at `(nibX, nibY)`, Hinge crown above!)
    const nibX = cx + Math.cos(endA) * R;
    const nibY = cy + Math.sin(endA) * R;
    const midX = (cx + nibX) * 0.5;
    const midY = (cy + nibY) * 0.5;
    const dx = nibX - cx, dy = nibY - cy;
    const dist = Math.max(1, Math.hypot(dx, dy));
    // Perpendicular lift for A-frame compass hinge
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const hingeLift = 215;
    const hx = midX + perpX * hingeLift;
    const hy = midY + perpY * hingeLift;

    // Compass shadow on paper
    ctx.save();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
    ctx.lineWidth = 8.0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + 8, cy + 10); ctx.lineTo(hx + 8, hy + 10); ctx.lineTo(nibX + 8, nibY + 10);
    ctx.stroke();

    // Two machined steel compass legs
    ctx.strokeStyle = CHAR_INK;
    ctx.lineWidth = 6.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(nibX, nibY); ctx.stroke();

    ctx.strokeStyle = BONE;
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(hx, hy); ctx.stroke();

    // Crossbar Vernier screw rod between legs
    const rodA_x = cx + (hx - cx) * 0.54, rodA_y = cy + (hy - cy) * 0.54;
    const rodB_x = nibX + (hx - nibX) * 0.54, rodB_y = nibY + (hy - nibY) * 0.54;
    ctx.strokeStyle = GRAPHITE;
    ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.moveTo(rodA_x, rodA_y); ctx.lineTo(rodB_x, rodB_y); ctx.stroke();

    // Top knurled handle stem + hinge crown wheel
    const stemLen = 42;
    const sdx = hx - midX, sdy = hy - midY;
    const sNorm = Math.max(1, Math.hypot(sdx, sdy));
    ctx.strokeStyle = CHAR_INK;
    ctx.lineWidth = 7.5;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + (sdx / sNorm) * stemLen, hy + (sdy / sNorm) * stemLen);
    ctx.stroke();

    ctx.fillStyle = BONE;
    ctx.strokeStyle = CHAR_INK;
    ctx.lineWidth = 4.0;
    ctx.beginPath(); ctx.arc(hx, hy, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Center anchor needle & active drawing nib spark
    ctx.fillStyle = COBALT;
    ctx.beginPath(); ctx.arc(cx, cy, 6.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = CYAN;
    ctx.strokeStyle = CHAR_INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(nibX, nibY, 7.5 + kick * 3.0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();

    // Signature V6.2 Frosted Cerulean Callout Badges (`R=340` & `姫切90°`)
    drawDieCutGlyph(ctx, 'R=340', cx - R - 115, cy - 155, 42, -5, {
      boxCol: CYAN, txtCol: BONE, mono: true, isPaper: true
    });
    drawDieCutGlyph(ctx, '姫切90°', cx + R + 115, cy + 145, 42, 4, {
      boxCol: CYAN, txtCol: BONE, mono: false, isPaper: true
    });
  }

  // 12-Blade Mechanical Iris + Precision Vernier Ring
  function drawLayeredIris12(ctx, cx, cy, maxR, apertureOpen, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    ctx.fillStyle = PANEL;
    ctx.beginPath();
    ctx.arc(0, 0, maxR * 1.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = SLATE;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(0, 0, maxR, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const isMajor = i % 6 === 0;
      const r0 = isMajor ? maxR * 1.02 : maxR * 1.05;
      ctx.strokeStyle = isMajor ? BONE : CYAN;
      ctx.lineWidth = isMajor ? 3.2 : 1.8;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      ctx.lineTo(Math.cos(a) * (maxR * 1.11), Math.sin(a) * (maxR * 1.11));
      ctx.stroke();
    }

    const innerR = Math.max(24, maxR * (0.14 + 0.66 * apertureOpen));
    for (let b = 0; b < 12; b++) {
      const a = (b / 12) * Math.PI * 2;
      const aNext = ((b + 1.15) / 12) * Math.PI * 2;
      ctx.fillStyle = (b % 3 === 0) ? CYAN : (b % 2 === 0 ? PANEL : INK);
      ctx.strokeStyle = BONE;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * maxR * 0.98, Math.sin(a) * maxR * 0.98);
      ctx.lineTo(Math.cos(aNext) * maxR * 0.98, Math.sin(aNext) * maxR * 0.98);
      ctx.lineTo(Math.cos(aNext + 0.28) * innerR, Math.sin(aNext + 0.28) * innerR);
      ctx.lineTo(Math.cos(a + 0.18) * innerR, Math.sin(a + 0.18) * innerR);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(0, 0, innerR * 0.92, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = BONE;
    ctx.lineWidth = 3.0;
    ctx.stroke();
    ctx.restore();
  }

  let _p02BufA = null;
  let _p02BufB = null;
  function getP02Buffers(W, H) {
    if (typeof document === 'undefined') return null;
    if (!_p02BufA || _p02BufA.width !== W || _p02BufA.height !== H) {
      _p02BufA = document.createElement('canvas');
      _p02BufA.width = W;
      _p02BufA.height = H;
      _p02BufB = document.createElement('canvas');
      _p02BufB.width = W;
      _p02BufB.height = H;
      if (window.CortexV6 && typeof window.CortexV6.hookContextColors === 'function') {
        window.CortexV6.hookContextColors(_p02BufA.getContext('2d'));
        window.CortexV6.hookContextColors(_p02BufB.getContext('2d'));
      }
    }
    return { a: _p02BufA, b: _p02BufB };
  }

  function renderChapterBody(ctx, idx, t, st, core) {
    const { W, H, TAU, clamp, lerp, ease } = core;
    const frameIdx = typeof core.frameIdx === 'function' ? core.frameIdx(t) : Math.round(t * 60);
    const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
    const c = CUTS[idx - 1];
    const u = clamp((t - c.t0) / Math.max(0.01, c.t1 - c.t0), 0, 1);
    const v6 = window.CortexV6;

    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;

    if (idx === 1) {
      // M1 (14.20–17.30s): 2.5D Connectome Tunnel (`193.5 BPM 起動`) -> Coaxial Aperture -> `HALOFLUX` 14-Panel Carousel & `190 PORTS`
      const morphT = 15.80;
      const morphU = t >= morphT ? clamp((t - morphT) / 0.28, 0, 1) : 0;

      if (morphU < 0.995) {
        const uA = clamp((t - 14.20) / (morphT - 14.20), 0, 1);
        drawLayeredTunnel25D(ctx, W, H, t, 3100, -0.30 + u * 0.85, frameIdx);

        const glow = ctx.createRadialGradient(W * 0.5, H * 0.50, 20, W * 0.5, H * 0.50, 720);
        glow.addColorStop(0, `rgba(56, 189, 248, ${(0.24 + kick * 0.14).toFixed(2)})`);
        glow.addColorStop(1, 'rgba(8, 12, 22, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        for (let r = 1; r <= 4; r++) {
          const rad = 135 + r * 92 + uA * 48;
          ctx.strokeStyle = r % 2 === 0 ? BONE : CYAN;
          ctx.lineWidth = r % 2 === 0 ? 2.6 : 1.5;
          ctx.beginPath();
          ctx.arc(W * 0.5, H * 0.5, rad, t * (r % 2 === 0 ? 2.0 : -2.4), t * (r % 2 === 0 ? 2.0 : -2.4) + Math.PI * 1.45);
          ctx.stroke();
        }

        const slam = (v6 && v6.aeSlam) ? v6.aeSlam : ease.outExpo;
        const p1 = slam(clamp(uA / 0.22, 0, 1));
        const p2 = slam(clamp((uA - 0.08) / 0.22, 0, 1));
        const p3 = slam(clamp((uA - 0.15) / 0.22, 0, 1));
        const fly = t > 15.52 ? ease.inCubic(clamp((t - 15.52) / 0.28, 0, 1)) : 0;
        const scOut = 1 + fly * 2.2;
        ctx.save();
        ctx.translate(W * 0.5, H * 0.5);
        ctx.scale(scOut, scOut);
        ctx.translate(-W * 0.5, -H * 0.5);
        drawDieCutGlyph(ctx, '193.5', W * 0.35 - (1 - p1) * 140, 445, 174 * (0.7 + 0.3 * p1), -6.5, {
          boxCol: CYAN, txtCol: INK, mono: true
        });
        drawDieCutGlyph(ctx, 'BPM', W * 0.68 + (1 - p2) * 120, 345, 96 * (0.7 + 0.3 * p2), 8.5, {
          boxCol: PANEL, txtCol: BONE, mono: true
        });
        drawDieCutGlyph(ctx, '起', W * 0.58, 650 + (1 - p3) * 90, 146 * (0.7 + 0.3 * p3), -8, {
          boxCol: CYAN, txtCol: BONE, serif: true
        });
        drawDieCutGlyph(ctx, '動', W * 0.74, 685 + (1 - p3) * 110, 152 * (0.7 + 0.3 * p3), 7, {
          boxCol: BONE, txtCol: INK, serif: true
        });
        ctx.restore();
      }

      if (t >= morphT) {
        const uB = clamp((t - morphT) / (17.30 - morphT), 0, 1);
        const shockR = Math.max(12, ease.outExpo(morphU) * 1360);
        ctx.save();
        if (morphU < 0.995) {
          ctx.beginPath();
          ctx.arc(W * 0.5, H * 0.52, shockR, 0, TAU);
          ctx.clip();
        }
        drawLayeredHaloflux14(ctx, W, H, t, uB, frameIdx);
        if (core.drawGuillocheRosette) {
          core.drawGuillocheRosette(ctx, W * 0.5, H * 0.52, 165, 95, 7, 150, COBALT, 1.2, t * 0.4);
        }
        drawDieCutGlyph(ctx, '190', W * 0.5 - 115, H * 0.52 - 36, 156, -5.5, {
          boxCol: CHAR_INK, txtCol: BONE, mono: true, isPaper: true
        });
        drawDieCutGlyph(ctx, 'PORTS', W * 0.5 + 135, H * 0.52 + 54, 96, 5.0, {
          boxCol: CYAN, txtCol: BONE, mono: true, isPaper: true
        });
        ctx.restore();

        if (morphU > 0.01 && morphU < 0.97) {
          ctx.save();
          ctx.strokeStyle = COBALT;
          ctx.lineWidth = 4.5;
          ctx.beginPath(); ctx.arc(W * 0.5, H * 0.52, shockR, 0, TAU); ctx.stroke();
          ctx.restore();
        }
      }
      if (v6 && typeof v6.draw2D3DAtmosphereBridge === 'function') {
        v6.draw2D3DAtmosphereBridge(ctx, { t, kick, vpX: W * 0.5, vpY: H * 0.5, speedLines: 18, speedAlpha: 0.16, motes: 18 });
      }
    }

    else if (idx === 2) {
      // M2 (17.30–20.40s): Restored Beloved `R=340 / 姫切90°` Archival Drafting Compass (`17.30–19.04s`) -> Compass Circle Opens Directly into Aspect-Exact `C04` (`18.86–20.40s`)!
      const c04Start = 18.86;
      const lensFullAt = 19.16;
      const uComp = clamp((t - 17.30) / (c04Start - 17.30), 0, 1);
      const cx = W * 0.5, cy = H * 0.51;
      const R = 340;

      if (t < lensFullAt) {
        const pushU = t >= c04Start ? ease.inCubic(clamp((t - c04Start) / (lensFullAt - c04Start), 0, 1)) : 0;
        const camZ = lerp(0.96, 1.08, uComp) * lerp(1.0, 2.65, pushU);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(camZ, camZ);
        ctx.translate(-cx, -cy);

        const sweep = lerp(0.35, Math.PI * 2.02, ease.inOutCubic(uComp));
        drawArchivalHimeCompass(ctx, W, H, cx, cy, R, sweep, t, kick);

        // Outer corner `覚・醒・前・夜` V6 stamps framing the blueprint compass cleanly without crowding center!
        const slam = (v6 && v6.aeSlam) ? v6.aeSlam : ease.outExpo;
        const kBlocks = [
          { ch: '覚', x: 245,  y: 235, sz: 156, rot: -6, box: CHAR_INK, serif: true },
          { ch: '醒', x: 265,  y: 815, sz: 156, rot:  5, box: CYAN,     serif: false },
          { ch: '前', x: 1665, y: 235, sz: 156, rot: -5, box: BONE,     serif: true },
          { ch: '夜', x: 1650, y: 815, sz: 164, rot:  6, box: CHAR_INK, serif: false }
        ];
        for (let i = 0; i < kBlocks.length; i++) {
          const b = kBlocks[i];
          const kp = slam(clamp((uComp - i * 0.06) / 0.24, 0, 1));
          if (kp <= 0.01) continue;
          drawDieCutGlyph(ctx, b.ch, b.x, b.y + (1 - kp) * 38, b.sz * (0.76 + 0.24 * kp), b.rot, {
            boxCol: b.box, txtCol: BONE, serif: b.serif, isPaper: true
          });
        }
        ctx.restore();
      }

      // As the compass completes its 360° `R=340` circle, the inscribed circle ITSELF opens as a clean optical lens unveiling `C04`!
      if (t >= c04Start && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C04')) {
        const u4 = clamp((t - c04Start) / (20.40 - c04Start), 0, 1);
        const eLens = ease.inOutCubic(clamp((t - c04Start) / (lensFullAt - c04Start), 0, 1));
        const lensR = lerp(R * 0.18, 1360, eLens);
        const settleZ = t < lensFullAt ? lerp(1.22, 1.06, ease.outCubic(eLens)) : 1.0;

        ctx.save();
        if (t < lensFullAt) {
          ctx.beginPath();
          ctx.arc(cx, cy, lensR, 0, TAU);
          ctx.clip();
          ctx.translate(cx, cy);
          ctx.scale(settleZ, settleZ);
          ctx.translate(-cx, -cy);
        }
        v6.drawLivingFullBleed(ctx, 'C04', {
          t, u: u4, kick,
          zoom0: 1.05, zoom1: 1.22,
          panX0: 24, panX1: -18,
          panY0: 12, panY1: -10,
          rot0: -0.014, rot1: 0.010,
          fx: 0.52, fy: 0.34,
          scrim: 0.18, isPaper: false
        });
        ctx.restore();

        if (t < lensFullAt) {
          ctx.save();
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 4.5;
          ctx.beginPath(); ctx.arc(cx, cy, lensR, 0, TAU); ctx.stroke();
          ctx.strokeStyle = BONE;
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.arc(cx, cy, Math.max(4, lensR - 8), 0, TAU); ctx.stroke();
          ctx.restore();
        }
      }
      if (t >= lensFullAt && v6 && typeof v6.draw2D3DAtmosphereBridge === 'function') {
        v6.draw2D3DAtmosphereBridge(ctx, { t, kick, vpX: W * 0.5, vpY: H * 0.48, speedLines: 12, speedAlpha: 0.12, motes: 18 });
      }
    }

    else if (idx === 3) {
      // M3 (20.40–23.60s): Crimson Cardiac QRS Ignition (`193.5 心拍点火`) -> Shutter Snap -> `硝子箱の心拍証明` Monument
      const splitT = 21.92;
      const slam = (v6 && v6.aeSlam) ? v6.aeSlam : ease.outExpo;

      if (t < splitT) {
        const u1 = clamp((t - 20.40) / (splitT - 20.40), 0, 1);
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);
        const rg = ctx.createRadialGradient(W * 0.5, H * 0.50, 30, W * 0.5, H * 0.50, 760);
        rg.addColorStop(0, `rgba(217, 59, 88, ${(0.30 + kick * 0.18).toFixed(2)})`);
        rg.addColorStop(1, 'rgba(11, 13, 20, 0)');
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, W, H);

        for (let r = 0; r < 4; r++) {
          const rp = ((u1 * 1.45 + r * 0.25) % 1);
          ctx.strokeStyle = `rgba(255, 77, 114, ${((1 - rp) * 0.48).toFixed(2)})`;
          ctx.lineWidth = lerp(3.6, 1.1, rp);
          ctx.beginPath(); ctx.arc(W * 0.5, H * 0.50, lerp(75, 560, rp), 0, TAU); ctx.stroke();
        }

        const qrs = (p) => {
          if (p > 0.42 && p < 0.45) return -0.18;
          if (p >= 0.45 && p < 0.48) return 0.95;
          if (p >= 0.48 && p < 0.51) return -0.68;
          if (p >= 0.51 && p < 0.56) return 0.26;
          return Math.sin(p * 32.0) * 0.03;
        };
        for (let pass = 0; pass < 3; pass++) {
          ctx.strokeStyle = pass === 0 ? SLATE : (pass === 1 ? CRIMSON : BONE);
          ctx.lineWidth = pass === 2 ? 2.4 : (pass === 1 ? 5.8 : 3.0);
          ctx.beginPath();
          for (let x = 40; x <= W - 40; x += 10) {
            const ux = (x - 40) / (W - 80);
            const ph = ((ux - u1 * 0.35 + pass * 0.02 + 1) % 1);
            const y = H * 0.50 - qrs(ph) * (270 + kick * 85);
            if (x === 40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        drawDieCutGlyph(ctx, '193.5', 450, 365, 162, -6.0, { boxCol: CRIMSON, txtCol: BONE, mono: true });
        drawDieCutGlyph(ctx, 'BPM',   760, 290, 92,   6.0, { boxCol: PANEL,   txtCol: BONE, mono: true });
        drawDieCutGlyph(ctx, '心', 345, 705, 200, -7.5, { boxCol: BONE,    txtCol: INK, serif: true });
        drawDieCutGlyph(ctx, '拍', 625, 765, 188,  6.5, { boxCol: PANEL,   txtCol: BONE });
        drawDieCutGlyph(ctx, '点', 1365, 315, 194, -6.0, { boxCol: BONE,    txtCol: INK, serif: true });
        drawDieCutGlyph(ctx, '火', 1605, 695, 214,  7.5, { boxCol: CRIMSON, txtCol: BONE });
      } else {
        const u2 = clamp((t - splitT) / (23.60 - splitT), 0, 1);
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);

        // Radial perspective rays + crimson diagonal light ribbon (matching V6.2 `v62_master_sheet1_act1.jpg` `f01420`!)
        ctx.strokeStyle = SLATE;
        ctx.lineWidth = 1.4;
        for (let r = 0; r < 24; r++) {
          const ra = (r / 24) * TAU + t * 0.12;
          ctx.beginPath();
          ctx.moveTo(W * 0.5 + Math.cos(ra) * 90, H * 0.5 + Math.sin(ra) * 90);
          ctx.lineTo(W * 0.5 + Math.cos(ra) * 1200, H * 0.5 + Math.sin(ra) * 1200);
          ctx.stroke();
        }
        const beam = ctx.createLinearGradient(0, 620, W, 250);
        beam.addColorStop(0, 'rgba(217, 59, 88, 0.28)');
        beam.addColorStop(0.5, 'rgba(238, 115, 138, 0.16)');
        beam.addColorStop(1, 'rgba(217, 59, 88, 0.26)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(0, 610); ctx.lineTo(W, 230); ctx.lineTo(W, 510); ctx.lineTo(0, 890);
        ctx.closePath();
        ctx.fill();

        const pivotX = 475, pivotY = 675;
        const zoomIn = t > 23.30 ? lerp(1.0, 2.15, ease.inCubic(clamp((t - 23.30) / 0.30, 0, 1))) : (1.0 + kick * 0.04);
        ctx.save();
        ctx.translate(pivotX, pivotY);
        ctx.scale(zoomIn, zoomIn);
        ctx.translate(-pivotX, -pivotY);
        const blocks = [
          { ch: '硝', x: 325,  y: 255, sz: 244, rot: -7.5, box: CRIMSON, serif: true,  w: 0.00 },
          { ch: '子', x: 635,  y: 345, sz: 220, rot:  6.5, box: PANEL,   serif: false, w: 0.00 },
          { ch: '箱', x: 970,  y: 245, sz: 262, rot: -4.5, box: BONE,    serif: true,  w: 0.00 },
          { ch: 'の', x: 1215, y: 365, sz: 106, rot: 12.0, box: CRIMSON, circle: true, w: 0.00 },
          { ch: '心', x: 475,  y: 675, sz: 296, rot: -5.0, box: CRIMSON, serif: true,  w: 0.08 },
          { ch: '拍', x: 845,  y: 745, sz: 230, rot:  6.0, box: CRIMSON, serif: false, w: 0.08 },
          { ch: '証', x: 1205, y: 630, sz: 242, rot: -6.5, box: BONE,    serif: true,  w: 0.12 },
          { ch: '明', x: 1560, y: 710, sz: 266, rot:  5.5, box: PANEL,   serif: false, w: 0.12 }
        ];
        for (let i = 0; i < blocks.length; i++) {
          const b = blocks[i];
          const pop = slam(clamp((u2 - b.w) / 0.16, 0, 1));
          if (pop <= 0.01) continue;
          drawDieCutGlyph(ctx, b.ch, b.x, b.y + (1 - pop) * 48, b.sz * (0.74 + 0.26 * pop), b.rot, {
            boxCol: b.box, txtCol: BONE, circle: b.circle, serif: b.serif
          });
        }
        ctx.restore();
      }
      if (v6 && typeof v6.draw2D3DAtmosphereBridge === 'function') {
        v6.draw2D3DAtmosphereBridge(ctx, { t, kick, vpX: W * 0.5, vpY: H * 0.5, speedLines: 18, speedAlpha: 0.18, motes: 20 });
      }
    }

    else if (idx === 4) {
      // M4 (23.60–26.85s): Clean Architectural Light-Portal Corridor (`23.60–24.82s`) -> Center Frame Unveil `C05` -> Eye-Axis Dolly Match-Cut into `C03`!
      const c05Start = 24.80;
      const c05Full = 25.06;
      const c03Start = 25.92;

      if (t < c05Full) {
        const cx = W * 0.5, cy = H * 0.50;
        const push = ease.outCubic(clamp((t - 23.60) / (c05Full - 23.60), 0, 1));
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);

        const cg = ctx.createRadialGradient(cx, cy, 24, cx, cy, 820);
        cg.addColorStop(0, 'rgba(56, 189, 248, 0.26)');
        cg.addColorStop(1, 'rgba(8, 9, 12, 0)');
        ctx.fillStyle = cg;
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = SLATE;
        ctx.lineWidth = 1.6;
        for (const bx of [-860, -480, 480, 860]) {
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + bx, 0); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + bx, H); ctx.stroke();
        }

        // 12 Receding Illuminated Glass Frames (matching V6.1 `v6_proof_sheet1` `f110 Corridor`, zero rainbow bar charts!)
        for (let i = 11; i >= 0; i--) {
          const f = (((i / 12) + push * 1.35) % 1);
          const p = Math.pow(f, 2.15);
          const aw = lerp(180, 1740, p);
          const ah = lerp(102, 980, p);
          ctx.strokeStyle = i % 3 === 0 ? BONE : CYAN;
          ctx.lineWidth = lerp(1.4, 4.2, p);
          ctx.strokeRect(cx - aw * 0.5, cy - ah * 0.5, aw, ah);
        }
        // glowing central window target
        ctx.fillStyle = BONE;
        ctx.fillRect(cx - 110, cy - 64, 220, 128);
        ctx.strokeStyle = CYAN;
        ctx.lineWidth = 4.0;
        ctx.strokeRect(cx - 122, cy - 74, 244, 148);
      }

      if (t >= c05Start && t < c03Start && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C05')) {
        const u5 = clamp((t - c05Start) / (c03Start - c05Start), 0, 1);
        const eDoor = ease.outCubic(clamp((t - c05Start) / (c05Full - c05Start), 0, 1));
        const pw = lerp(220, W + 80, eDoor);
        const ph = lerp(128, H + 60, eDoor);
        const eyePush = t >= 25.58 ? lerp(1.0, 2.20, ease.inCubic(clamp((t - 25.58) / 0.34, 0, 1))) : 1.0;

        ctx.save();
        if (t < c05Full) {
          ctx.beginPath();
          ctx.rect(W * 0.5 - pw * 0.5, H * 0.5 - ph * 0.5, pw, ph);
          ctx.clip();
        }
        if (eyePush > 1.001) {
          ctx.translate(W * 0.48, H * 0.33);
          ctx.scale(eyePush, eyePush);
          ctx.translate(-W * 0.48, -H * 0.33);
        }
        v6.drawLivingFullBleed(ctx, 'C05', {
          t, u: u5, kick,
          zoom0: 1.04, zoom1: 1.18,
          panX0: -26, panX1: 22,
          panY0: 22, panY1: -14,
          rot0: 0.014, rot1: -0.010,
          fx: 0.48, fy: 0.33,
          scrim: 0.18,
          isPaper: false
        });
        ctx.restore();

        if (t < c05Full) {
          ctx.save();
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 4.5;
          ctx.strokeRect(W * 0.5 - pw * 0.5, H * 0.5 - ph * 0.5, pw, ph);
          ctx.strokeStyle = BONE;
          ctx.lineWidth = 1.6;
          ctx.strokeRect(W * 0.5 - pw * 0.5 + 5, H * 0.5 - ph * 0.5 + 5, pw - 10, ph - 10);
          ctx.restore();
        }
      }

      if (t >= c03Start && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C03')) {
        const u3 = clamp((t - c03Start) / (26.85 - c03Start), 0, 1);
        const catchU = clamp((t - c03Start) / 0.28, 0, 1);
        const zoomCatch = t < 26.20 ? lerp(1.36, 1.05, ease.outExpo(catchU)) : lerp(1.05, 1.16, clamp((t - 26.20) / 0.65, 0, 1));
        ctx.save();
        ctx.translate(W * 0.5, H * 0.44);
        ctx.scale(zoomCatch, zoomCatch);
        ctx.translate(-W * 0.5, -H * 0.44);
        v6.drawLivingFullBleed(ctx, 'C03', {
          t, u: u3, kick,
          zoom0: 1.04, zoom1: 1.18,
          panX0: -18, panX1: 18,
          panY0: 8, panY1: -8,
          rot0: -0.018, rot1: 0.014,
          fx: 0.50, fy: 0.44,
          scrim: 0.15,
          isPaper: false
        });
        ctx.restore();
      }
    }

    else {
      // M5 (26.85–29.78s): Full-Frame V6 Precision 12-Blade Mechanical Iris + Guilloché Astrolabe (`共鳴解放`) -> Coaxial 3D `B3D_01_iris` (`28.10–29.78s`)!
      const irisStart = 28.10;
      const openU = t >= irisStart ? clamp((t - irisStart) / 0.28, 0, 1) : 0;

      if (openU < 0.995) {
        const uG = clamp((t - 26.85) / (irisStart - 26.85), 0, 1);
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);

        // Rich radial optical starburst lines + concentric Guilloché astrolabe (ZERO empty dark frames!)
        ctx.save();
        const zAst = lerp(0.92, 1.24, ease.inOutCubic(uG)) + kick * 0.03;
        ctx.translate(W * 0.5, H * 0.5);
        ctx.scale(zAst, zAst);
        ctx.translate(-W * 0.5, -H * 0.5);

        ctx.strokeStyle = SLATE;
        ctx.lineWidth = 1.4;
        for (let r = 0; r < 36; r++) {
          const a = (r / 36) * TAU - t * 0.18;
          ctx.beginPath();
          ctx.moveTo(W * 0.5 + Math.cos(a) * 180, H * 0.5 + Math.sin(a) * 180);
          ctx.lineTo(W * 0.5 + Math.cos(a) * 1120, H * 0.5 + Math.sin(a) * 1120);
          ctx.stroke();
        }
        if (core.drawGuillocheRosette) {
          core.drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 420, 255, 9, 220, CYAN, 1.4, t * 0.45);
          core.drawGuillocheRosette(ctx, W * 0.5, H * 0.5, 310, 185, 7, 180, BONE, 1.1, -t * 0.35);
        }
        drawLayeredIris12(ctx, W * 0.5, H * 0.5, 345, lerp(0.24, 0.72, uG), t * 1.35);
        ctx.restore();

        const slam = (v6 && v6.aeSlam) ? v6.aeSlam : ease.outExpo;
        const ks7 = [
          { ch: '共', x: 275,  y: 265, sz: 186, rot: -7, box: CYAN,  serif: true },
          { ch: '鳴', x: 295,  y: 795, sz: 182, rot:  6, box: PANEL, serif: false },
          { ch: '解', x: 1635, y: 265, sz: 186, rot: -6, box: BONE,  serif: true },
          { ch: '放', x: 1620, y: 795, sz: 192, rot:  7, box: CYAN,  serif: false }
        ];
        for (let i = 0; i < ks7.length; i++) {
          const b = ks7[i];
          const kp = slam(clamp((uG - i * 0.05) / 0.24, 0, 1));
          if (kp <= 0.01) continue;
          drawDieCutGlyph(ctx, b.ch, b.x, b.y + (1 - kp) * 40, b.sz * (0.74 + 0.26 * kp), b.rot, {
            boxCol: b.box, txtCol: BONE, serif: b.serif
          });
        }
      }

      if (t >= irisStart) {
        const uDive = clamp((t - irisStart) / (29.78 - irisStart), 0, 1);
        const fIdx3D = Math.round(lerp(78, 153, uDive));
        const roll = lerp(-0.10, 0.20, uDive);
        const rad = Math.max(12, ease.outExpo(openU) * 1360);

        ctx.save();
        if (openU < 0.995) {
          ctx.beginPath();
          ctx.arc(W * 0.5, H * 0.50, rad, 0, TAU);
          ctx.clip();
        }
        ctx.translate(W * 0.5, H * 0.5);
        ctx.rotate(roll);
        ctx.translate(-W * 0.5, -H * 0.5);
        const drew3D = v6 && typeof v6.draw3DClipFrame === 'function' && v6.draw3DClipFrame(ctx, 'B3D_01_iris', t, {
          fIdx: fIdx3D,
          zoom: lerp(1.02, 1.58, ease.inCubic(uDive)),
          kick,
          kickZoom: 0.020,
          scrim: 0.16,
          isPaper: false,
          tintStrength: 0.08
        });
        ctx.restore();
        if (!drew3D) {
          ctx.save();
          if (openU < 0.995) {
            ctx.beginPath(); ctx.arc(W * 0.5, H * 0.50, rad, 0, TAU); ctx.clip();
          }
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);
          drawLayeredIris12(ctx, W * 0.5, H * 0.5, 440, lerp(0.24, 0.78, uDive), -t * 2.8);
          ctx.restore();
        }
        if (openU > 0.02 && openU < 0.96) {
          ctx.save();
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 4.5;
          ctx.beginPath(); ctx.arc(W * 0.5, H * 0.50, rad, 0, TAU); ctx.stroke();
          ctx.strokeStyle = BONE;
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.arc(W * 0.5, H * 0.50, Math.max(4, rad - 8), 0, TAU); ctx.stroke();
          ctx.restore();
        }
        if (v6 && typeof v6.draw2D3DAtmosphereBridge === 'function') {
          v6.draw2D3DAtmosphereBridge(ctx, { t, kick, vpX: W * 0.5, vpY: H * 0.5, speedLines: 16, speedAlpha: 0.16, motes: 18 });
        }
      }
    }

    ctx.restore();
  }

  window.registerCortexPlate('P02_monitor_overdrive', {
    render(ctx, st, core) {
      const { W, H, clamp, lerp, ease } = core;
      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const snare = st.snareSnap ?? st.snareEnv ?? st.snare ?? 0;

      let activeIdx = 0;
      for (let i = 0; i < CUTS.length; i++) {
        if (t >= CUTS[i].t0 && (t < CUTS[i].t1 || i === CUTS.length - 1)) {
          activeIdx = i;
          break;
        }
      }

      const cur = CUTS[activeIdx];
      const next = activeIdx + 1 < CUTS.length ? CUTS[activeIdx + 1] : null;
      const inTrans = Boolean(next && cur.transDur > 0 && t >= cur.t1 - cur.transDur);
      const rawU = inTrans ? clamp((t - (cur.t1 - cur.transDur)) / cur.transDur, 0, 1) : 0;
      const qU = rawU * rawU * rawU * (rawU * (rawU * 6 - 15) + 10);

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      const bufs = inTrans ? getP02Buffers(W, H) : null;
      const v6Theme = window.CortexV6;
      if (inTrans && bufs && rawU > 0.004) {
        const ctxA = bufs.a.getContext('2d');
        const ctxB = bufs.b.getContext('2d');
        ctxA.setTransform(1, 0, 0, 1, 0, 0);
        ctxA.globalAlpha = 1;
        ctxA.globalCompositeOperation = 'source-over';
        ctxA.clearRect(0, 0, W, H);
        if (v6Theme && typeof v6Theme.setActivePlate === 'function') v6Theme.setActivePlate('P02', cur.t0 + 0.08);
        renderChapterBody(ctxA, cur.idx, t, st, core);

        ctxB.setTransform(1, 0, 0, 1, 0, 0);
        ctxB.globalAlpha = 1;
        ctxB.globalCompositeOperation = 'source-over';
        ctxB.clearRect(0, 0, W, H);
        if (v6Theme && typeof v6Theme.setActivePlate === 'function') v6Theme.setActivePlate('P02', next.t0 + 0.08);
        renderChapterBody(ctxB, next.idx, t, st, core);
        if (v6Theme && typeof v6Theme.setActivePlate === 'function') v6Theme.setActivePlate('P02', t);

        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);

        if (cur.mode === 'blueprintShutterWipe') {
          // 100%-Opaque Coaxial Iris Expansion from `190 PORTS` Center Hub -> `R=340` Compass Center!
          const rad = Math.max(12, ease.inOutCubic(rawU) * 1360);
          const scA = lerp(1.0, 1.20, qU);
          const scB = lerp(0.86, 1.0, qU);
          ctx.drawImage(bufs.a, W * 0.5 * (1 - scA), H * 0.5 * (1 - scA), W * scA, H * scA);
          ctx.save();
          ctx.beginPath();
          ctx.arc(W * 0.5, H * 0.51, rad, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(bufs.b, W * 0.5 * (1 - scB), H * 0.5 * (1 - scB), W * scB, H * scB);
          ctx.restore();

          if (rawU > 0.02 && rawU < 0.96) {
            ctx.save();
            ctx.strokeStyle = COBALT;
            ctx.lineWidth = 4.5;
            ctx.beginPath(); ctx.arc(W * 0.5, H * 0.51, rad, 0, Math.PI * 2); ctx.stroke();
            ctx.restore();
          }
        } else if (cur.mode === 'cardiacPulseIris') {
          // 100%-Opaque Heartbeat Wave expanding from lower-center (`H*0.72`, ZERO face slice on C04!)
          const cxP = W * 0.50, cyP = H * 0.72;
          const rad = Math.max(10, ease.inOutCubic(rawU) * 1550);
          ctx.drawImage(bufs.a, 0, 0, W, H);
          ctx.save();
          ctx.beginPath();
          ctx.arc(cxP, cyP, rad, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(bufs.b, 0, 0, W, H);
          ctx.restore();

          if (rawU > 0.02 && rawU < 0.96) {
            ctx.save();
            ctx.strokeStyle = CRIMSON;
            ctx.lineWidth = 5.5;
            ctx.beginPath(); ctx.arc(cxP, cyP, rad, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = BONE;
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.arc(cxP, cyP, Math.max(4, rad - 8), 0, Math.PI * 2); ctx.stroke();
            ctx.restore();
          }
        } else if (cur.mode === 'kanjiDoorwayDive') {
          // 100%-Opaque Rectangular `[心]` Portal Doorway Dive from (475, 675) -> Light-Portal Corridor
          const eD = ease.inOutCubic(rawU);
          const scA = lerp(1.0, 3.6, rawU * rawU);
          const cxD = lerp(475, W * 0.5, qU);
          const cyD = lerp(675, H * 0.5, qU);
          const pw = lerp(190, W + 160, eD);
          const ph = lerp(190, H + 160, eD);
          const scB = lerp(0.82, 1.0, qU);

          ctx.save();
          ctx.translate(475, 675);
          ctx.scale(scA, scA);
          ctx.translate(-475, -675);
          ctx.drawImage(bufs.a, 0, 0, W, H);
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.rect(cxD - pw * 0.5, cyD - ph * 0.5, pw, ph);
          ctx.clip();
          ctx.drawImage(bufs.b, W * 0.5 * (1 - scB), H * 0.5 * (1 - scB), W * scB, H * scB);
          ctx.restore();

          if (rawU > 0.02 && rawU < 0.96) {
            ctx.save();
            ctx.strokeStyle = BONE;
            ctx.lineWidth = 4.5;
            ctx.strokeRect(cxD - pw * 0.5, cyD - ph * 0.5, pw, ph);
            ctx.restore();
          }
        } else {
          // pupilBurstMatch: 100%-Opaque Pupil Aperture expanding from C03 Eye Axis -> Mechanical Iris Astrolabe!
          const cxE = W * 0.50, cyE = H * 0.46;
          const rad = Math.max(10, ease.inOutCubic(rawU) * 1360);
          const scA = lerp(1.0, 1.22, qU);
          const scB = lerp(0.84, 1.0, qU);

          ctx.drawImage(bufs.a, cxE * (1 - scA), cyE * (1 - scA), W * scA, H * scA);
          ctx.save();
          ctx.beginPath();
          ctx.arc(cxE, cyE, rad, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(bufs.b, W * 0.5 * (1 - scB), H * 0.5 * (1 - scB), W * scB, H * scB);
          ctx.restore();

          if (rawU > 0.02 && rawU < 0.96) {
            ctx.save();
            ctx.strokeStyle = CYAN;
            ctx.lineWidth = 4.5;
            ctx.beginPath(); ctx.arc(cxE, cyE, rad, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = BONE;
            ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.arc(cxE, cyE, Math.max(4, rad - 8), 0, Math.PI * 2); ctx.stroke();
            ctx.restore();
          }
        }
      } else {
        renderChapterBody(ctx, cur.idx, t, st, core);
      }

      ctx.restore();
      return {
        isPaper: cur.bg === PAPER,
        bg: cur.bg,
        fg: cur.fg,
        duotone: { bg: cur.bg, fg: cur.fg },
        bloom: 0.20 + 0.16 * kick,
        ca: 0,
        flash: 0,
        shake: 0.20 * Math.max(kick, snare)
      };
    }
  });
})();
