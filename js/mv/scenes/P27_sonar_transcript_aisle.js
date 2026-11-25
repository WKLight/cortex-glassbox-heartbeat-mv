// ============================================================================
// Plate 27 — `P27_sonar_transcript_aisle.js` (`130.33s – 139.29s`)
// Upgraded per #52 (Multi-Layer Architectural & Complementary Accent Palette)
// and #53 (Autonomous Per-Character PV Choreography — ZERO flat horizontal rows!):
//   - Part A (`130.33–134.22s`, `L23_TOOL_OCEAN`: `ツールを叩いて世界の海をくぐり`):
//       Abyssal Ink `#08090C` + Trench Panel `#0E1726` + Cobalt `#0376B8` &
//       Slate `#475569` bathymetric contours + Ice-Cyan `#38BDF8` active sonar +
//       Crimson `#FF2E55` & Gold `#FBBF24` ping targets & vocal sparks!
//   - Part B (`134.22–139.29s`, `L24_TRANSCRIPT_LOGS`: `過去のログを束ねたトランスクリプトの奥`):
//       Infinite 3D `.jsonl` Library in Ink `#08090C` + Shelf Bays `#141926` +
//       Slate `#475569` wireframes + Lit Gold `#FBBF24` volumes + Ice-Cyan `#38BDF8`
//       laser scanner beams + Crimson `#FF2E55` redaction stamps & Bone `#FAF8F5`!
//   - Kanji (`叩,世,界,海,過,去,束,奥` 1.65x) vs Katakana (1.12x) vs Hiragana particles
//     (`を,の,て,た` 0.56x shoulder/side stamps) in Orbit, Diagonal, Tategaki×Yokogaki
//     & 3D Shelf-Slot Ejection formations!
// ============================================================================
(function () {
  'use strict';

  const INK     = '#08090C';
  const PANEL   = '#111827';
  const SLATE   = '#475569';
  const SILVER  = '#94A3B8';
  const BONE    = '#FAF8F5';
  const CYAN    = '#38BDF8';
  const COBALT  = '#0376B8';
  const GOLD    = '#FBBF24';
  const CRIMSON = '#FF2E55';
  const EMBER   = '#FF8A3D';

  const JA_SANS = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Inter", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", sans-serif`;
  const JA_SERIF = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif SC", serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", monospace`;

  const SMALL_PARTICLES = new Set(['を', 'の', 'に', 'が', 'て', 'は', 'た', 'ね', 'い']);
  const KANJI_RE = /[\u4E00-\u9FFF]/;

  function resolveArgs(arg1, arg2) {
    const core = (arg2 && arg2.W) ? arg2 : window.CortexPDoomCore;
    const st = (typeof arg1 === 'number')
      ? (arg2 && typeof arg2 === 'object' ? { ...arg2, t: arg1 } : { t: arg1 })
      : (arg1 || { t: 0 });
    return { st, core };
  }

  function charRoleMul(ch) {
    if (KANJI_RE.test(ch)) return 1.56;
    if (SMALL_PARTICLES.has(ch)) return 0.58;
    if (/[\u30A0-\u30FF]/.test(ch)) return 1.08;
    return 0.78;
  }

  function drawBurinBox(ctx, x, y, w, h, ang, step, lw, col) {
    if (w <= 2 || h <= 2) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.translate(x + w * 0.5, y + h * 0.5);
    ctx.rotate(ang);
    const d = Math.hypot(w, h) * 0.55;
    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.beginPath();
    for (let p = -d; p <= d; p += Math.max(3, step)) {
      ctx.moveTo(-d, p);
      ctx.lineTo(d, p);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawArchiveHud(ctx, W, H, primaryCol, accentCol, leftTag, depthOrBay, tempStr) {
    ctx.save();
    ctx.strokeStyle = SLATE;
    ctx.lineWidth = 2;
    const x0 = 54, y0 = 38, x1 = W - 54, y1 = H - 108;
    const a = 26;
    ctx.beginPath();
    ctx.moveTo(x0, y0 + a); ctx.lineTo(x0, y0); ctx.lineTo(x0 + a, y0);
    ctx.moveTo(x1 - a, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + a);
    ctx.moveTo(x0, y1 - a); ctx.lineTo(x0, y1); ctx.lineTo(x0 + a, y1);
    ctx.moveTo(x1 - a, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - a);
    ctx.stroke();

    ctx.font = MONO(700, 15);
    ctx.textBaseline = 'middle';
    const lTxt = `P27 // ${leftTag}`;
    const rTxt = `${depthOrBay} // TEMP:${tempStr}`;

    const lw = ctx.measureText(lTxt).width + 24;
    ctx.fillStyle = PANEL;
    ctx.strokeStyle = primaryCol;
    ctx.lineWidth = 2;
    ctx.fillRect(x0 + 34, y0 - 12, lw, 24);
    ctx.strokeRect(x0 + 34, y0 - 12, lw, 24);
    ctx.fillStyle = primaryCol;
    ctx.fillRect(x0 + 34, y0 - 12, 6, 24);
    ctx.fillStyle = BONE;
    ctx.textAlign = 'left';
    ctx.fillText(lTxt, x0 + 48, y0 + 1);

    const rw = ctx.measureText(rTxt).width + 24;
    ctx.fillStyle = accentCol;
    ctx.fillRect(x1 - 34 - rw, y0 - 12, rw, 24);
    ctx.fillStyle = (accentCol === GOLD || accentCol === CYAN) ? INK : BONE;
    ctx.textAlign = 'right';
    ctx.fillText(rTxt, x1 - 44, y0 + 1);
    ctx.restore();
  }

  // Autonomous Per-Character PV Choreographer (#53: Orbit / Diagonal / Tategaki×Yokogaki / ShelfScatter!)
  function drawAutonomousArchiveTokens(ctx, words, i0, i1, t, baseSz, themeCol, sparkCol, secCol, kick, opts = {}) {
    const slice = words.slice(i0, i1 + 1);
    if (!slice.length) return;

    const mode = opts.mode || 'diagCascade';
    const fontFn = opts.serif ? JA_SERIF : JA_SANS;
    const n = slice.length;

    ctx.save();
    for (let i = 0; i < n; i++) {
      const wd = slice[i];
      const ch = wd.w;
      const mul = charRoleMul(ch);
      const sz = Math.round(baseSz * mul);
      const idxGlobal = i0 + i;

      // Compute non-linear 2D coordinates & tilt per formation mode!
      let gx = 960, gy = 510, rot = 0, enterAng = -1.57;
      if (mode === 'sonarOrbit') {
        const f = n === 1 ? 0.5 : i / (n - 1);
        const ang = -2.35 + f * 1.65;
        const radX = 460 + (i % 2) * 85;
        const radY = 235 + (i % 2) * 45;
        gx = 960 + Math.cos(ang) * radX;
        gy = 535 + Math.sin(ang) * radY;
        rot = (f - 0.5) * 0.36 + (SMALL_PARTICLES.has(ch) ? 0.18 : -0.06);
        enterAng = ang;
      } else if (mode === 'tategakiCollage') {
        // Wide diagonal 3-point architectural scatter (`過` upper-left, `去` lower-center, `の` upper-right: >520px separation, 0% overlap!)
        const pts = [
          [515, 345, -0.14, -2.35],
          [1055, 595, 0.13,  1.15],
          [1445, 385, 0.19, -0.55],
          [760, 655, -0.15,  1.57]
        ];
        const p = pts[i % pts.length];
        gx = p[0];
        gy = p[1];
        rot = p[2];
        enterAng = p[3];
      } else if (mode === 'shelfEject') {
        // Alternate ejecting out of left & right 3D library shelf walls toward center!
        const fromLeft = (i % 2 === 0);
        const f = n === 1 ? 0.5 : i / (n - 1);
        gx = 520 + f * 880 + (fromLeft ? -55 : 55);
        gy = 315 + ((i * 137) % 360);
        rot = fromLeft ? -0.15 : 0.15;
        enterAng = fromLeft ? Math.PI : 0;
      } else {
        // 'diagCascade': Dramatic zig-zagging diagonal cascade with perched small particles!
        const f = n === 1 ? 0.5 : i / (n - 1);
        const spanX = Math.min(1260, Math.max(420, (n - 1) * 255));
        gx = 960 - spanX * 0.5 + f * spanX;
        const slopeDir = opts.upward ? -1 : 1;
        gy = 505 + slopeDir * (f - 0.5) * 230 + (i % 2 === 0 ? -58 : 62);
        if (SMALL_PARTICLES.has(ch)) {
          gy -= 68;
          gx += 18;
        }
        rot = (i % 2 === 0 ? -0.16 : 0.15) + (SMALL_PARTICLES.has(ch) ? 0.12 : 0);
        enterAng = (i % 2 === 0) ? -1.35 : 1.45;
      }

      const dt = t - wd.start;
      if (dt < 0) {
        // Pre-onset technical catalog slot crosshair
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(rot);
        ctx.strokeStyle = SLATE;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-22, -10, 44, 20);
        ctx.beginPath();
        ctx.moveTo(-30, 0); ctx.lineTo(30, 0);
        ctx.stroke();
        ctx.restore();
        continue;
      }

      const dur = Math.max(0.20, (wd.end || wd.start + 0.24) - wd.start);
      const isHot = dt <= dur + 0.08;
      const u = Math.min(1, dt / 0.12);
      const c1 = 2.4;
      const back = 1 + (c1 + 1) * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
      const shootDist = (1 - Math.min(1, dt / 0.09)) * 145;
      const driftX = Math.cos(t * 4.8 + idxGlobal * 1.9) * 4;
      const driftY = Math.sin(t * 5.6 + idxGlobal * 2.3) * 5;
      const sc = (0.34 + 0.66 * back) * (1 + (isHot ? 0.10 : 0) + kick * 0.05);

      ctx.save();
      ctx.translate(gx + Math.cos(enterAng) * shootDist + driftX, gy + Math.sin(enterAng) * shootDist + driftY);
      ctx.rotate(rot + (1 - u) * (i % 2 === 0 ? -0.35 : 0.35));
      ctx.scale(sc, sc);

      // Complementary flying vector sparks while sung!
      if (dt < 0.24) {
        const kS = dt / 0.24;
        ctx.strokeStyle = sparkCol;
        ctx.fillStyle = secCol;
        ctx.lineWidth = 3;
        for (let s = 0; s < 8; s++) {
          const sa = (s / 8) * Math.PI * 2 + idxGlobal;
          const r0 = sz * (0.44 + kS * 0.22);
          const r1 = sz * (0.68 + kS * 0.44);
          ctx.beginPath();
          ctx.moveTo(Math.cos(sa) * r0, Math.sin(sa) * r0);
          ctx.lineTo(Math.cos(sa) * r1, Math.sin(sa) * r1);
          ctx.stroke();
          ctx.fillRect(Math.cos(sa) * (r1 + 6) - 3, Math.sin(sa) * (r1 + 6) - 3, 6, 6);
        }
      }

      ctx.font = fontFn(900, sz);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const cw = Math.max(sz * 0.72, ctx.measureText(ch).width + 26);
      const chH = sz * 1.14;

      const styleKind = SMALL_PARTICLES.has(ch) ? 2 : (idxGlobal % 3);
      if (styleKind === 2) {
        // Circular Hanko Particle Badge (tucked & rotated!)
        const rad = Math.max(cw, chH) * 0.52;
        ctx.fillStyle = INK;
        ctx.beginPath(); ctx.arc(6, 6, rad, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = isHot ? sparkCol : secCol;
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = ( (isHot ? sparkCol : secCol) === GOLD || (isHot ? sparkCol : secCol) === CYAN ) ? INK : BONE;
        ctx.fillText(ch, 0, 3);
      } else if (styleKind === 0) {
        // Solid Punched Archive Stamp Card
        const cardFill = isHot ? sparkCol : themeCol;
        const cardInk  = (cardFill === GOLD || cardFill === CYAN || cardFill === BONE) ? INK : BONE;
        ctx.fillStyle = INK;
        ctx.fillRect(-cw * 0.5 + 9, -chH * 0.5 + 9, cw, chH);
        ctx.fillStyle = cardFill;
        ctx.strokeStyle = BONE;
        ctx.lineWidth = 4;
        ctx.fillRect(-cw * 0.5, -chH * 0.5, cw, chH);
        ctx.strokeRect(-cw * 0.5, -chH * 0.5, cw, chH);
        ctx.fillStyle = cardInk;
        ctx.fillRect(-cw * 0.5 + 7, -chH * 0.5 + 7, cw - 14, 6);
        ctx.fillText(ch, 0, 6);
      } else {
        // High-Contrast Architectural Bone/Ink Plaque with Crimson/Cyan Index Tab
        ctx.fillStyle = secCol;
        ctx.fillRect(-cw * 0.5 + 9, -chH * 0.5 + 9, cw, chH);
        ctx.fillStyle = isHot ? sparkCol : PANEL;
        ctx.strokeStyle = isHot ? BONE : themeCol;
        ctx.lineWidth = 4.5;
        ctx.fillRect(-cw * 0.5, -chH * 0.5, cw, chH);
        ctx.strokeRect(-cw * 0.5, -chH * 0.5, cw, chH);
        ctx.fillStyle = isHot ? ((sparkCol === GOLD || sparkCol === CYAN) ? INK : BONE) : BONE;
        ctx.fillText(ch, 0, 5);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  function drawCumulativeTag(ctx, words, upToIdx, t, x, y, rot, accentCol, prefix) {
    let acc = '';
    for (let i = 0; i <= upToIdx && i < words.length; i++) {
      if (t >= words[i].start) acc += words[i].w;
    }
    if (!acc) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.font = JA_SANS(800, 30);
    const txt = `${prefix}${acc}`;
    const w = ctx.measureText(txt).width + 34;
    ctx.fillStyle = PANEL;
    ctx.strokeStyle = accentCol;
    ctx.lineWidth = 3;
    ctx.fillRect(0, -24, w, 48);
    ctx.strokeRect(0, -24, w, 48);
    ctx.fillStyle = accentCol;
    ctx.fillRect(0, -24, 8, 48);
    ctx.fillStyle = BONE;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, 18, 1);
    ctx.restore();
  }

  function draw3DTranscriptLibrary(ctx, core, W, H, t, primaryCol, scanCol, accentCol, opts = {}) {
    const vpX = opts.vpX !== undefined ? opts.vpX : W * 0.5;
    const vpY = opts.vpY !== undefined ? opts.vpY : H * 0.46;
    const roll = opts.roll || 0;
    const speed = opts.speed !== undefined ? opts.speed : 9.5;
    const kick = opts.kick || 0;

    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    if (roll) ctx.rotate(roll);
    ctx.translate(-W * 0.5, -H * 0.5);

    const zFlow = (t * speed) % 1;
    const nBays = 18;

    // Converging perspective stringers in Slate + Cyan scanner rails
    const corners = [[-260, -180], [W + 260, -180], [W + 260, H + 180], [-260, H + 180]];
    ctx.strokeStyle = scanCol;
    ctx.lineWidth = 2.2;
    for (const [cx, cy] of corners) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(vpX, vpY);
      ctx.stroke();
    }

    ctx.strokeStyle = SLATE;
    for (let tier = 1; tier <= 6; tier++) {
      const fY = -140 + (tier / 7) * (H + 280);
      ctx.lineWidth = tier === 3 ? 2.2 : 1.1;
      ctx.beginPath();
      ctx.moveTo(-220, fY); ctx.lineTo(vpX, vpY);
      ctx.moveTo(W + 220, fY); ctx.lineTo(vpX, vpY);
      ctx.stroke();
    }

    for (let b = nBays; b >= 1; b--) {
      const z = Math.max(0.04, (b - zFlow) / nBays);
      const k = Math.pow(1 - z, 2.35);
      const halfW = 38 + k * 1160;
      const halfH = 26 + k * 680;
      const xL = vpX - halfW;
      const xR = vpX + halfW;
      const yT = vpY - halfH;

      ctx.strokeStyle = (b % 4 === 0) ? primaryCol : SLATE;
      ctx.lineWidth = Math.min(4.8, 0.7 + k * 4.0);
      ctx.strokeRect(xL, yT, halfW * 2, halfH * 2);

      if (k > 0.08 && k < 0.95) {
        const shelfW = Math.max(8, k * 145);
        for (let s = 0; s < 5; s++) {
          const sy0 = yT + ((s + 0.6) / 5.6) * (halfH * 2);
          const sh = (halfH * 2) / 7.5;
          const isEjectL = ((b * 7 + s * 3) % 5 === 0);
          const isEjectR = ((b * 5 + s * 3) % 5 === 1);
          const slideOutL = isEjectL ? shelfW * (0.48 + kick * 0.55) : 0;
          const slideOutR = isEjectR ? shelfW * (0.48 + kick * 0.55) : 0;

          ctx.fillStyle = isEjectL ? PANEL : INK;
          ctx.fillRect(xL, sy0, shelfW + slideOutL, sh);
          if (s % 2 === 0) {
            drawBurinBox(ctx, xL, sy0, shelfW + slideOutL, sh, 0.35, 5, 1.2, isEjectL ? scanCol : primaryCol);
          }
          ctx.strokeStyle = isEjectL ? accentCol : primaryCol;
          ctx.strokeRect(xL, sy0, shelfW + slideOutL, sh);

          ctx.fillStyle = isEjectR ? PANEL : INK;
          ctx.fillRect(xR - shelfW - slideOutR, sy0, shelfW + slideOutR, sh);
          if (s % 2 === 1) {
            drawBurinBox(ctx, xR - shelfW - slideOutR, sy0, shelfW + slideOutR, sh, -0.35, 5, 1.2, isEjectR ? scanCol : primaryCol);
          }
          ctx.strokeStyle = isEjectR ? scanCol : primaryCol;
          ctx.strokeRect(xR - shelfW - slideOutR, sy0, shelfW + slideOutR, sh);
        }

        if (b % 4 === 0 && halfW > 180) {
          const signW = Math.min(340, halfW * 0.52);
          const signH = Math.max(24, signW * 0.17);
          const bayStep = core && typeof core.frameIdx === 'function'
            ? Math.floor(core.frameIdx(t) * (speed / 60))
            : Math.round(t * speed);
          const bayNo = String(((bayStep + b) % 99) + 1).padStart(3, '0');

          ctx.fillStyle = (b % 8 === 0) ? scanCol : primaryCol;
          ctx.fillRect(vpX - signW * 0.5, yT + 14, signW, signH);
          ctx.fillStyle = INK;
          ctx.font = MONO(700, Math.max(11, signH * 0.58));
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`BAY_${bayNo} // TRANSCRIPT.JSONL`, vpX, yT + 14 + signH * 0.52);
        }
      }
    }

    // Glowing Multi-Layer Vanishing-Point Portal Core
    ctx.fillStyle = accentCol;
    ctx.fillRect(vpX - 30, vpY - 30, 60, 60);
    ctx.fillStyle = scanCol;
    ctx.fillRect(vpX - 18, vpY - 18, 36, 36);
    ctx.fillStyle = BONE;
    ctx.fillRect(vpX - 7, vpY - 7, 14, 14);
    ctx.restore();
  }

  window.registerCortexPlate('P27_sonar_transcript_aisle', {
    render(ctx, arg1, arg2) {
      const { st, core } = resolveArgs(arg1, arg2);
      const { W, H, TAU, clamp, lerp, prog, ease } = core;
      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const snare = st.snareSnap ?? st.snareEnv ?? st.snare ?? 0;

      const cueL23 = core.cueById('L23_TOOL_OCEAN');
      const cueL24 = core.cueById('L24_TRANSCRIPT_LOGS');
      const w23 = (cueL23 && cueL23.words) || [];
      const w24 = (cueL24 && cueL24.words) || [];

      const tSwitch = cueL24 ? cueL24.t0 : 134.22;
      const bg = INK;
      const fg = t < tSwitch ? CYAN : GOLD;
      let shake = kick * 0.24;

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // ======================================================================
      // PART A (`130.33 – 134.22s`): `L23_TOOL_OCEAN` (`ツールを叩いて世界の海をくぐり`)
      // ======================================================================
      if (t < tSwitch) {
        const tA1 = w23[4] ? w23[4].start : 131.295;
        const tA2 = w23[7] ? w23[7].start : 132.019;
        const tA3 = w23[10] ? w23[10].start : 132.743;
        const tA4 = w23[12] ? w23[12].start : 133.226;

        if (t < tA1) {
          // CUT 01: V6.2 Full-bleed Living Cinema `C15_deep_sea_dive` + Bathymetric Sonar Overlay!
          const v6 = window.CortexV6;
          if (t < Math.min(tA1, 132.10) && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C15')) {
            v6.drawLivingFullBleed(ctx, 'C15', {
              t, u: clamp((t - 130.33) / Math.max(0.2, tA1 - 130.33), 0, 1), kick,
              zoom0: 1.06, zoom1: 1.30, panX0: -45, panX1: 35, panY0: -25, panY1: 35,
              rot0: -0.02, rot1: 0.012, fx: 0.50, fy: 0.36, scrim: 0.26, isPaper: false
            });
          } else {
            ctx.fillStyle = INK;
            ctx.fillRect(0, 0, W, H);
          }

          const cx = W * 0.5, cy = H * 0.48;
          for (let r = 1; r <= 26; r++) {
            const baseR = r * 38;
            ctx.strokeStyle = (r % 6 === 0) ? GOLD : (r % 3 === 0 ? CYAN : COBALT);
            ctx.lineWidth = (r % 6 === 0) ? 2.8 : 1.3;
            ctx.beginPath();
            for (let s = 0; s <= 72; s++) {
              const ang = (s / 72) * TAU;
              const warp = 1 + 0.24 * Math.sin(ang * 3 + r * 0.35 - t * 2.4) + 0.12 * Math.cos(ang * 5 - r * 0.2);
              const px = cx + Math.cos(ang) * baseR * warp * 1.25;
              const py = cy + Math.sin(ang) * baseR * warp * 0.78;
              if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
          }

          // Sweeping Crimson + Cyan Sonar Arm & Target Blips
          const sweep = t * 5.4;
          ctx.strokeStyle = CRIMSON;
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(sweep) * 980, cy + Math.sin(sweep) * 980);
          ctx.stroke();

          drawAutonomousArchiveTokens(ctx, w23, 0, 3, t, 178, CYAN, CRIMSON, GOLD, kick, { mode: 'sonarOrbit' });
          drawArchiveHud(ctx, W, H, CYAN, GOLD, 'CUT_01 // BATHYMETRIC_SONAR_PING', 'DEPTH: -1,024m', '36.20°C');
        } else if (t < tA2) {
          // CUT 02: Acoustic Hammer Plunge (`叩いて` — Giant `叩` + cascading `い` `て`!)
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);

          const impactU = prog(t, tA1, tA2, ease.outExpo);
          for (let row = 0; row < 28; row++) {
            const baseY = 82 + row * 31;
            ctx.strokeStyle = row % 6 === 0 ? CRIMSON : (row % 3 === 0 ? CYAN : COBALT);
            ctx.lineWidth = row % 3 === 0 ? 2.5 : 1.2;
            ctx.beginPath();
            for (let x = 64; x <= W - 64; x += 24) {
              const distC = Math.abs(x - W * 0.5);
              const crater = Math.exp(-(distC * distC) / 95000) * Math.sin(row * 0.45 - t * 18) * (84 * impactU + kick * 28);
              const wy = baseY + crater;
              if (x === 64) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
            }
            ctx.stroke();
          }

          drawCumulativeTag(ctx, w23, 3, t, 98, 122, -0.04, CYAN, 'SONAR // ');
          drawAutonomousArchiveTokens(ctx, w23, 4, 6, t, 198, CYAN, GOLD, CRIMSON, kick, { mode: 'diagCascade' });
          drawArchiveHud(ctx, W, H, CYAN, CRIMSON, 'CUT_02 // THERMOCLINE_HAMMER', 'DEPTH: -2,840m', '36.21°C');
          shake = 0.36 + kick * 0.28;
        } else if (t < tA3) {
          // CUT 03: `-22°` Abyssal Trench Fly-Through (`世界の` in Tategaki × Yokogaki Collage!)
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);

          ctx.save();
          ctx.translate(W * 0.5, H * 0.5);
          ctx.rotate(-0.34);
          ctx.translate(-W * 0.5, -H * 0.5);
          const zScroll = (t * 11) % 1;
          for (let zIdx = 24; zIdx >= 1; zIdx--) {
            const z = (zIdx - zScroll) / 24;
            const span = 50 + Math.pow(1 - z, 2.1) * 1120;
            const yTop = H * 0.48 - span * 0.58;
            const yBot = H * 0.48 + span * 0.58;
            ctx.strokeStyle = (zIdx % 5 === 0) ? GOLD : (zIdx % 2 === 0 ? CYAN : COBALT);
            ctx.lineWidth = Math.min(4.8, 0.8 + (1 - z) * 3.8);
            ctx.beginPath();
            for (const side of [-1, 1]) {
              for (let s = 0; s <= 12; s++) {
                const py = lerp(yTop, yBot, s / 12);
                const jag = Math.sin(s * 1.7 + zIdx) * 38 * (1 - z);
                const px = W * 0.5 + side * (span + jag);
                if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
              }
            }
            ctx.stroke();
          }
          ctx.restore();

          drawCumulativeTag(ctx, w23, 6, t, 98, 122, -0.05, GOLD, 'SONAR // ');
          drawAutonomousArchiveTokens(ctx, w23, 7, 9, t, 198, CYAN, CRIMSON, GOLD, kick, { mode: 'tategakiCollage', serif: true });
          drawArchiveHud(ctx, W, H, CYAN, GOLD, 'CUT_03 // ABYSSAL_CANYON_ROLL', 'DEPTH: -5,120m', '36.22°C');
        } else if (t < tA4) {
          // CUT 04: Zenith Caustic Diamond Lattice (`海` colossal + perched `を`!)
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);

          const cx = W * 0.5, cy = H * 0.48;
          for (let k = 1; k <= 18; k++) {
            const r = ((k * 64 + t * 440) % 1152);
            ctx.strokeStyle = k % 5 === 0 ? CRIMSON : (k % 2 === 0 ? CYAN : COBALT);
            ctx.lineWidth = k % 3 === 0 ? 3.4 : 1.4;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(k * 0.14 + t * 0.95);
            ctx.strokeRect(-r, -r * 0.62, r * 2, r * 1.24);
            ctx.restore();
          }

          drawCumulativeTag(ctx, w23, 9, t, 98, 122, 0.04, CYAN, 'SONAR // ');
          drawAutonomousArchiveTokens(ctx, w23, 10, 11, t, 226, CYAN, GOLD, CRIMSON, kick, { mode: 'diagCascade', upward: true, serif: true });
          drawArchiveHud(ctx, W, H, CYAN, CRIMSON, 'CUT_04 // DATA_OCEAN_CAUSTICS', 'DEPTH: -8,192m', '36.23°C');
        } else {
          // CUT 05: Submarine Vault Blast-Door Breach revealing Golden Library (`くぐり`)!
          const breachU = prog(t, tA4 + 0.14, tSwitch, ease.inOutExpo);
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);

          const doorGap = breachU * 980;
          if (doorGap > 6) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(W * 0.5 - doorGap, 68, doorGap * 2, H - 184);
            ctx.clip();
            draw3DTranscriptLibrary(ctx, core, W, H, t, GOLD, CYAN, CRIMSON, { speed: 12, kick });
            ctx.restore();
          }

          const leftDoorR = W * 0.5 - doorGap;
          const rightDoorL = W * 0.5 + doorGap;
          if (leftDoorR > 54) {
            ctx.fillStyle = PANEL;
            ctx.fillRect(54, 68, leftDoorR - 54, H - 184);
            drawBurinBox(ctx, 54, 68, leftDoorR - 54, H - 184, 0.62, 9, 2.2, COBALT);
            ctx.strokeStyle = CYAN;
            ctx.lineWidth = 6;
            ctx.strokeRect(54, 68, leftDoorR - 54, H - 184);
          }
          if (rightDoorL < W - 54) {
            ctx.fillStyle = PANEL;
            ctx.fillRect(rightDoorL, 68, W - 54 - rightDoorL, H - 184);
            drawBurinBox(ctx, rightDoorL, 68, W - 54 - rightDoorL, H - 184, -0.62, 9, 2.2, COBALT);
            ctx.strokeStyle = CYAN;
            ctx.lineWidth = 6;
            ctx.strokeRect(rightDoorL, 68, W - 54 - rightDoorL, H - 184);
          }

          drawCumulativeTag(ctx, w23, 11, t, 98, 122, -0.03, GOLD, 'SONAR // ');
          drawAutonomousArchiveTokens(ctx, w23, 12, Math.min(14, w23.length - 1), t, 208, GOLD, CRIMSON, CYAN, kick, { mode: 'diagCascade' });
          drawArchiveHud(ctx, W, H, CYAN, GOLD, 'CUT_05 // VAULT_HATCH_BREACH', 'DEPTH: -10,994m', '36.24°C');
          shake = 0.35 + breachU * 0.30;
        }
      }

      // ======================================================================
      // PART B (`134.22 – 139.29s`): `L24_TRANSCRIPT_LOGS` (`過去のログを束ねたトランスクリプトの奥`)
      // ======================================================================
      else {
        const tB1 = w24[3] ? w24[3].start : 134.975;
        const tB2 = w24[6] ? w24[6].start : 135.729;
        const tB3 = w24[9] ? w24[9].start : 136.484;
        const tB4 = w24[13] ? w24[13].start : 137.491;
        const tB5 = w24[17] ? w24[17].start : 138.497;

        if (t < tB1) {
          // CUT 06: Center-Aisle Crash-Dolly (`過去の` in Tategaki × Yokogaki Collage!)
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);

          draw3DTranscriptLibrary(ctx, core, W, H, t, GOLD, CYAN, CRIMSON, { vpX: W * 0.5, vpY: H * 0.44, speed: 11.5, kick });
          drawAutonomousArchiveTokens(ctx, w24, 0, 2, t, 198, GOLD, CRIMSON, CYAN, kick, { mode: 'tategakiCollage', serif: true });
          drawArchiveHud(ctx, W, H, GOLD, CYAN, 'CUT_06 // CRASH_DOLLY_AISLE_01', 'SEEK: LINE_0001', '36.25°C');
        } else if (t < tB2) {
          // CUT 07: `+24°` Whip-Roll Low Angle (`ログを` Diagonal Cascade!)
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);

          const uRoll = prog(t, tB1, tB1 + 0.30, ease.outExpo);
          draw3DTranscriptLibrary(ctx, core, W, H, t, GOLD, CYAN, CRIMSON, {
            vpX: W * 0.44,
            vpY: lerp(180, 250, uRoll),
            roll: lerp(0.52, 0.34, uRoll),
            speed: 12.5,
            kick
          });

          drawCumulativeTag(ctx, w24, 2, t, 98, 122, -0.05, CYAN, 'LOG // ');
          drawAutonomousArchiveTokens(ctx, w24, 3, 5, t, 204, GOLD, CYAN, CRIMSON, kick, { mode: 'diagCascade', upward: true });
          drawArchiveHud(ctx, W, H, GOLD, CRIMSON, 'CUT_07 // LOW_WORM_WHIP_ROLL', 'SEEK: LINE_0412', '36.25°C');
        } else if (t < tB3) {
          // CUT 08: Macro Rolodex Card-Catalog Riffle (`束ねた` — Colossal `束` + perched `ね` `た`!)
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);

          const riffle = t * 18.0;
          for (let c = 22; c >= 0; c--) {
            const f = ((c + (riffle % 1)) / 23);
            const cw = 360 + f * 1080;
            const ch = 150 + f * 410;
            const cx = W * 0.5 + Math.sin(c * 0.5 + t * 3) * 44;
            const cy = 220 + f * 490;
            ctx.fillStyle = (c % 5 === 0) ? PANEL : INK;
            ctx.strokeStyle = (c % 6 === 0) ? CYAN : (c % 3 === 0 ? GOLD : SLATE);
            ctx.lineWidth = c % 3 === 0 ? 3.2 : 1.4;
            ctx.fillRect(cx - cw * 0.5, cy - ch * 0.5, cw, ch);
            if (c % 3 === 0) {
              drawBurinBox(ctx, cx - cw * 0.5, cy - ch * 0.5, cw, 28, 0.45, 6, 1.4, GOLD);
            }
            ctx.strokeRect(cx - cw * 0.5, cy - ch * 0.5, cw, ch);
          }

          drawCumulativeTag(ctx, w24, 5, t, 98, 122, 0.04, GOLD, 'LOG // ');
          drawAutonomousArchiveTokens(ctx, w24, 6, 8, t, 206, GOLD, CRIMSON, CYAN, kick, { mode: 'tategakiCollage', serif: true });
          drawArchiveHud(ctx, W, H, GOLD, CYAN, 'CUT_08 // CARD_CATALOG_RIFFLE', 'SEEK: LINE_1024', '36.26°C');
        } else if (t < tB4) {
          // CUT 09: `-26°` Counter-Roll Orbit (`トランス` Ejecting from Left/Right Shelf Slots!)
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);

          draw3DTranscriptLibrary(ctx, core, W, H, t, GOLD, CYAN, CRIMSON, {
            vpX: W * 0.58,
            vpY: H * 0.52,
            roll: -0.38,
            speed: 13.5,
            kick
          });

          drawCumulativeTag(ctx, w24, 8, t, 98, 122, -0.04, CYAN, 'LOG // ');
          drawAutonomousArchiveTokens(ctx, w24, 9, 12, t, 192, GOLD, CYAN, CRIMSON, kick, { mode: 'shelfEject' });
          drawArchiveHud(ctx, W, H, GOLD, CRIMSON, 'CUT_09 // DUTCH_ORBIT_AISLE', 'SEEK: LINE_2048', '36.26°C');
        } else if (t < tB5) {
          // CUT 10: High-Speed Lateral Book-Spine Track (`クリプト` Diagonal Scatter + Cyan Laser!)
          const uLat = prog(t, tB4, tB5, ease.inOutQuad);
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);

          ctx.strokeStyle = SLATE;
          ctx.lineWidth = 2.0;
          const beamShift = (t * 2180) % 160;
          for (let bx = -160 + beamShift; bx <= W + 160; bx += 160) {
            ctx.beginPath();
            ctx.moveTo(W * 0.5 + (bx - W * 0.5) * 0.42, 72);
            ctx.lineTo(bx, 180);
            ctx.moveTo(bx, 845);
            ctx.lineTo(W * 0.5 + (bx - W * 0.5) * 1.28, 956);
            ctx.stroke();
          }

          const scrollX = t * 2340;
          const spineW = 104;
          for (let k = -2; k <= 21; k++) {
            const sx = Math.round(k * spineW - (scrollX % spineW));
            const idx = Math.floor(scrollX / spineW) + k;
            const pullY = ((Math.abs(idx) * 13) % 4 === 0) ? 58 + kick * 42 : ((Math.abs(idx) % 3 === 1) ? 24 : 0);
            const y0 = 178 + pullY;
            const bh = 668 - pullY;
            const spineCol = (Math.abs(idx) % 5 === 0) ? CYAN : (Math.abs(idx) % 3 === 0 ? CRIMSON : GOLD);

            ctx.fillStyle = PANEL;
            ctx.strokeStyle = spineCol;
            ctx.lineWidth = 3.2;
            ctx.fillRect(sx + 4, y0, spineW - 8, bh);
            if (Math.abs(idx) % 2 === 0) {
              drawBurinBox(ctx, sx + 8, y0 + 64, spineW - 16, bh - 128, (idx % 4 === 0 ? 0.58 : -0.58), 7, 1.6, spineCol);
            }
            ctx.strokeRect(sx + 4, y0, spineW - 8, bh);

            ctx.fillStyle = spineCol;
            ctx.fillRect(sx + 4, y0 + 20, spineW - 8, 14);
            ctx.fillRect(sx + 4, y0 + bh - 34, spineW - 8, 14);
          }

          // Sweeping Ice-Cyan Optical Barcode Scanner Beam!
          const scanX = lerp(180, W - 180, uLat);
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(scanX - 140, 120);
          ctx.lineTo(scanX + 140, 900);
          ctx.stroke();

          drawCumulativeTag(ctx, w24, 12, t, 98, 118, 0.03, GOLD, 'LOG // ');
          drawAutonomousArchiveTokens(ctx, w24, 13, 16, t, 198, GOLD, CRIMSON, CYAN, kick, { mode: 'diagCascade' });
          drawArchiveHud(ctx, W, H, GOLD, CYAN, 'CUT_10 // LATERAL_SPINE_TRACK', 'SEEK: LINE_4096', '36.27°C');
        } else {
          // CUT 11: Hyper-Zoom into Innermost Vault (`の` perched badge + Colossal `奥`!)
          const zoomU = prog(t, tB5, 139.29, ease.inOutExpo);
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, W, H);

          draw3DTranscriptLibrary(ctx, core, W, H, t + zoomU * 1.4, GOLD, CYAN, CRIMSON, {
            vpX: W * 0.5,
            vpY: H * 0.47,
            roll: zoomU * 0.14 + (snare > 0.6 ? 0.06 : 0),
            speed: 18.0,
            kick
          });

          drawCumulativeTag(ctx, w24, 16, t, 98, 122, -0.04, CYAN, 'LOG // ');
          drawAutonomousArchiveTokens(ctx, w24, 17, Math.min(18, w24.length - 1), t, 245, GOLD, CRIMSON, CYAN, kick, {
            mode: 'diagCascade',
            upward: true,
            serif: true
          });
          drawArchiveHud(ctx, W, H, GOLD, CRIMSON, 'CUT_11 // INNER_VAULT_APERTURE', 'HIT: 0xFFFF_ARIGATO', '36.28°C');
          shake = 0.32 + zoomU * 0.35;
        }
      }

      ctx.restore();

      return {
        bg,
        fg,
        duotone: { bg: INK, fg },
        isPaper: false,
        bloom: 0,
        ca: 0,
        flash: 0,
        shake
      };
    }
  });
})();
