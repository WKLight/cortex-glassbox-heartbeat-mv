// ============================================================================
// Plate 31 — `P31_seraphim_star_cathedral.js` (`206.42s – 211.75s`)
// Upgraded per #52 (Multi-Layer Architectural & Complementary Accent Palette)
// and #53 (Autonomous Per-Character PV Choreography — ZERO flat horizontal rows!):
//   - Layered Celestial Palette: Sanctuary Ink `#08090C` + Vault `#101827` +
//     Graphite `#475569` / `#94A3B8` armillary meridians & orthogonal leader lines +
//     Ice-Cyan `#38BDF8` Seraphim wings + Starlight Gold `#FBBF24` & Crimson `#FF2E55`
//     190 igniting synapse stars & margin tags + Archival Vellum `#F5F0E6` & Bone!
//   - Autonomous Per-Character Choreography for `L37_SHOUT_190_STARS`:
//     `叫べローターハート！百九十の星よ` — 6-Wing V-Arc Katakana Formation,
//     Colossal Radial `叫` & Star-Crowned `星` (`1.75x`), Perched `べ,の,よ` (`0.56x`),
//     and Diagonal Numeral Constellation (`百` / `九` / `十`)!
// ============================================================================
(function () {
  'use strict';

  const INK     = '#08090C';
  const PANEL   = '#101827';
  const SLATE   = '#475569';
  const SILVER  = '#94A3B8';
  const PAPER   = '#F5F0E6';
  const BONE    = '#FAF8F5';
  const CYAN    = '#38BDF8';
  const COBALT  = '#0376B8';
  const GOLD    = '#FBBF24';
  const CRIMSON = '#FF2E55';
  const EMBER   = '#FF8A3D';

  const JA_DISP = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Inter", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", sans-serif`;
  const JA_SERIF = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif SC", serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", monospace`;

  const STARS_190 = [];
  const GOLDEN_ANG = Math.PI * (3 - Math.sqrt(5));
  for (let i = 1; i <= 190; i++) {
    const f = i / 190;
    STARS_190.push({
      id: i,
      tag: `SYNAPSE_${String(i).padStart(3, '0')}`,
      rNorm: 0.16 + Math.sqrt(f) * 0.82,
      theta: i * GOLDEN_ANG,
      freq: (160 + (i % 34)).toFixed(0)
    });
  }

  const SMALL_PARTICLES = new Set(['べ', 'の', 'よ']);
  const KANJI_OR_BANG = /[\u4E00-\u9FFF！!]/;

  function resolveArgs(arg1, arg2) {
    const core = (arg2 && arg2.W) ? arg2 : window.CortexPDoomCore;
    const st = (typeof arg1 === 'number')
      ? (arg2 && typeof arg2 === 'object' ? { ...arg2, t: arg1 } : { t: arg1 })
      : (arg1 || { t: 0 });
    return { st, core };
  }

  function cathCharMul(ch) {
    if (ch === '星' || ch === '叫') return 1.72;
    if (KANJI_OR_BANG.test(ch)) return 1.44;
    if (SMALL_PARTICLES.has(ch)) return 0.58;
    return 1.06;
  }

  function drawSeraphimWings(ctx, cx, cy, spanR, unfold01, rot, isLight, kick) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    const wingAngles = [-0.88, -0.34, 0.28, Math.PI - 0.28, Math.PI + 0.34, Math.PI + 0.88];
    for (let w = 0; w < 6; w++) {
      const baseA = wingAngles[w];
      const sign = (w < 3) ? 1 : -1;
      const spread = unfold01 * 0.48;
      const wingPrimary = (w % 3 === 0) ? GOLD : (isLight ? COBALT : CYAN);

      for (let f = 0; f < 10; f++) {
        const ff = f / 9;
        const a = baseA + sign * (ff - 0.35) * spread;
        const len = spanR * (0.48 + 0.52 * Math.sin((1 - ff * 0.65) * Math.PI * 0.5)) * (0.35 + 0.65 * unfold01) + kick * 24;
        const rIn = 105 + ff * 24;

        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.moveTo(rIn, -7);
        ctx.lineTo(len, -18 + ff * 8);
        ctx.lineTo(len + 26, 4);
        ctx.lineTo(rIn, 10);
        ctx.closePath();
        ctx.fillStyle = (f % 2 === 0) ? wingPrimary : (isLight ? BONE : PANEL);
        ctx.fill();
        ctx.strokeStyle = isLight ? INK : wingPrimary;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        if (f % 2 === 1) {
          ctx.strokeStyle = isLight ? SLATE : SLATE;
          ctx.beginPath();
          for (let rx = rIn + 18; rx < len - 12; rx += 18) {
            ctx.moveTo(rx, -8);
            ctx.lineTo(rx + 10, 8);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // 3D Gyroscopic Armillary Ecliptic Rings in Gold + Crimson + Cyan!
    const ringCols = [GOLD, CRIMSON, isLight ? COBALT : CYAN];
    for (let ring = 0; ring < 3; ring++) {
      ctx.save();
      ctx.rotate(ring * 1.05 + unfold01 * 0.8 + rot * 1.5);
      ctx.strokeStyle = ringCols[ring];
      ctx.lineWidth = ring === 0 ? 4.4 : 2.6;
      ctx.beginPath();
      ctx.ellipse(0, 0, 165 + ring * 38, 68 + ring * 26, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function draw190SynapseDomeAndTags(ctx, W, H, cx, cy, domeRx, domeRy, litCount, t, isLight, omegaPull = 0) {
    ctx.save();
    const coords = new Array(litCount);

    for (let i = 0; i < litCount; i++) {
      const stObj = STARS_190[i];
      const ang = stObj.theta + t * 0.34;
      const pull = 1 - omegaPull * 0.78;
      const sx = cx + Math.cos(ang) * domeRx * stObj.rNorm * pull;
      const sy = cy + Math.sin(ang) * domeRy * stObj.rNorm * pull;
      coords[i] = { x: sx, y: sy, stObj };

      if (i >= 8 && i % 2 === 0 && coords[i - 8]) {
        ctx.strokeStyle = isLight ? SILVER : SLATE;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(coords[i - 8].x, coords[i - 8].y);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      const isKey = (i === litCount - 1 || i % 9 === 0);
      const rStar = isKey ? 8.0 : 4.4;
      ctx.fillStyle = (i % 7 === 0) ? CRIMSON : (i % 3 === 0 ? GOLD : (isLight ? COBALT : CYAN));
      ctx.beginPath();
      ctx.moveTo(sx, sy - rStar * 1.5);
      ctx.lineTo(sx + rStar, sy);
      ctx.lineTo(sx, sy + rStar * 1.5);
      ctx.lineTo(sx - rStar, sy);
      ctx.closePath();
      ctx.fill();
    }

    const maxTagsPerSide = 7;
    const baseIdx = Math.max(0, litCount - maxTagsPerSide * 2);
    ctx.font = MONO(700, 13);
    ctx.textBaseline = 'middle';

    for (let side = 0; side < 2; side++) {
      const isLeft = (side === 0);
      const tagX = isLeft ? 72 : W - 292;
      const tagW = 220;
      const tagH = 26;

      for (let row = 0; row < maxTagsPerSide; row++) {
        const starIdx = baseIdx + side * maxTagsPerSide + row;
        if (starIdx >= litCount || !coords[starIdx]) continue;

        const { x: sx, y: sy, stObj } = coords[starIdx];
        const tagY = 128 + row * 98;
        const anchorX = isLeft ? (tagX + tagW) : tagX;
        const kneeX = isLeft ? (anchorX + 38) : (anchorX - 38);
        const isNewest = (starIdx >= litCount - 2);
        const leadCol = isNewest ? GOLD : (isLight ? COBALT : SLATE);

        ctx.strokeStyle = leadCol;
        ctx.lineWidth = isNewest ? 2.0 : 1.3;
        ctx.beginPath();
        ctx.moveTo(anchorX, tagY);
        ctx.lineTo(kneeX, tagY);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        ctx.strokeStyle = isNewest ? CRIMSON : GOLD;
        ctx.beginPath(); ctx.arc(sx, sy, 9, 0, Math.PI * 2); ctx.stroke();

        ctx.fillStyle = isNewest ? GOLD : (isLight ? BONE : PANEL);
        ctx.strokeStyle = isNewest ? INK : (isLight ? INK : CYAN);
        ctx.lineWidth = 2;
        ctx.fillRect(tagX, tagY - tagH * 0.5, tagW, tagH);
        ctx.strokeRect(tagX, tagY - tagH * 0.5, tagW, tagH);

        ctx.fillStyle = isNewest ? INK : (isLight ? INK : BONE);
        ctx.textAlign = 'left';
        ctx.fillText(`${stObj.tag} · ${stObj.freq}Hz`, tagX + 8, tagY + 1);
      }
    }
    ctx.restore();
  }

  function drawCathedralHud(ctx, W, H, isLight, cutTag, litCount) {
    ctx.save();
    const x0 = 54, y0 = 38, x1 = W - 54, y1 = H - 108;
    ctx.strokeStyle = isLight ? INK : SLATE;
    ctx.lineWidth = 2.2;
    const arm = 26;
    ctx.beginPath();
    ctx.moveTo(x0, y0 + arm); ctx.lineTo(x0, y0); ctx.lineTo(x0 + arm, y0);
    ctx.moveTo(x1 - arm, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + arm);
    ctx.moveTo(x0, y1 - arm); ctx.lineTo(x0, y1); ctx.lineTo(x0 + arm, y1);
    ctx.moveTo(x1 - arm, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - arm);
    ctx.stroke();

    ctx.font = MONO(700, 15);
    ctx.textBaseline = 'middle';
    const lTxt = `P31 // ${cutTag}`;
    const rTxt = `SYNAPSE_ARRAY: ${String(litCount).padStart(3, '0')}/190 // TEMP:36.5°C`;

    const lw = ctx.measureText(lTxt).width + 24;
    ctx.fillStyle = isLight ? INK : PANEL;
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 2;
    ctx.fillRect(x0 + 34, y0 - 12, lw, 24);
    ctx.strokeRect(x0 + 34, y0 - 12, lw, 24);
    ctx.fillStyle = BONE;
    ctx.textAlign = 'left';
    ctx.fillText(lTxt, x0 + 46, y0 + 1);

    const rw = ctx.measureText(rTxt).width + 24;
    ctx.fillStyle = GOLD;
    ctx.fillRect(x1 - 34 - rw, y0 - 12, rw, 24);
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.fillText(rTxt, x1 - 44, y0 + 1);
    ctx.restore();
  }

  // Autonomous Celestial PV Character Choreographer (#53: V-Wing Arc / Sunburst Ring / Star Monument!)
  function drawAutonomousCathedralTokens(ctx, words, i0, i1, t, baseSz, isLight, kick, opts = {}) {
    const slice = words.slice(i0, i1 + 1);
    if (!slice.length) return;
    const mode = opts.mode || 'wingArc';
    const fontFn = opts.serif ? JA_SERIF : JA_DISP;
    const n = slice.length;

    ctx.save();
    for (let i = 0; i < n; i++) {
      const wd = slice[i];
      const ch = wd.w;
      const mul = cathCharMul(ch);
      const sz = Math.round(baseSz * mul);
      const gIdx = i0 + i;

      let gx = 960, gy = 505, rot = 0, enterAng = -1.57;
      if (mode === 'shoutPair') {
        // Colossal `叫` tilted left + perched `べ` stamp on upper-right shoulder!
        if (i === 0) { gx = 875; gy = 515; rot = -0.14; enterAng = 2.6; }
        else         { gx = 1175; gy = 365; rot = 0.21; enterAng = -0.8; }
      } else if (mode === 'sunburstOrbit') {
        // 10-token `叫べローターハート！` curving around a sweeping celestial V-crown!
        const f = n === 1 ? 0.5 : i / (n - 1);
        const ang = Math.PI * 1.15 + f * Math.PI * 0.70;
        gx = 960 + Math.cos(ang) * 560;
        gy = 595 + Math.sin(ang) * 280 + (i % 2 === 0 ? -36 : 36);
        rot = (f - 0.5) * 0.44 + (i % 2 === 0 ? -0.08 : 0.08);
        enterAng = ang;
      } else if (mode === 'starCoda') {
        // `百` `九` `十` `の` `星` `よ`: Diagonal Tategaki-inspired steps leading to Colossal `星`!
        const pts = [
          [435, 365, -0.16], [645, 565,  0.14], [835, 385, -0.12],
          [1010, 315, 0.22], [1235, 525, -0.09],[1515, 645, 0.20]
        ];
        const p = pts[i % pts.length];
        gx = p[0]; gy = p[1]; rot = p[2];
        enterAng = (i % 2 === 0) ? -1.6 : 1.3;
      } else {
        // 'wingArc': Sweeping Seraphim V-Wing diagonal cascade!
        const f = n === 1 ? 0.5 : i / (n - 1);
        gx = 510 + f * 900;
        const vDip = Math.abs(f - 0.5) * -220;
        gy = 560 + vDip + (i % 2 === 0 ? -48 : 48) + (SMALL_PARTICLES.has(ch) ? -58 : 0);
        rot = (f - 0.5) * 0.38 + (i % 2 === 0 ? -0.12 : 0.12);
        enterAng = (i % 2 === 0) ? -1.4 : 1.4;
      }

      const dt = t - wd.start;
      if (dt < 0) {
        // V6.2: Removed floating pre-aim crosshairs for spotless 3D cathedral optics
        continue;
      }

      const dur = Math.max(0.20, (wd.end || wd.start + 0.24) - wd.start);
      const isHot = dt <= dur + 0.08;
      const slamFn = (window.CortexV6 && window.CortexV6.aeSlam) ? window.CortexV6.aeSlam : ((x) => 1 - Math.pow(1 - x, 3));
      const u = Math.min(1, dt / 0.12);
      const sc = (0.46 + 0.54 * slamFn(u)) * (1 + (isHot ? 0.09 : 0) + kick * 0.04);
      const fly = (1 - Math.min(1, dt / 0.09)) * 110;
      const drawX = gx + Math.cos(enterAng) * fly;
      const drawY = gy + Math.sin(enterAng) * fly + Math.sin(t * 4.5 + gIdx) * 3;
      const drawRot = rot + (1 - u) * (i % 2 === 0 ? -0.26 : 0.26);

      const v6 = window.CortexV6;
      if (v6 && typeof v6.drawEditorialStamp === 'function') {
        const isStarKanji = (ch === '星' || ch === '叫');
        const kind = SMALL_PARTICLES.has(ch) ? 'seal' : (isHot || isStarKanji ? 'accent' : 'frosted');
        v6.drawEditorialStamp(ctx, ch, drawX, drawY, sz, drawRot, {
          kind,
          serif: !!opts.serif || isStarKanji,
          isPaper: isLight,
          isHot: isHot || isStarKanji,
          scX: sc,
          scY: sc
        });
        continue;
      }

      ctx.save();
      ctx.translate(gx + Math.cos(enterAng) * fly, gy + Math.sin(enterAng) * fly + Math.sin(t * 5.2 + gIdx) * 5);
      ctx.rotate(rot + (1 - u) * (i % 2 === 0 ? -0.32 : 0.32));
      ctx.scale(sc, sc);

      // Gold + Crimson + Cyan Star-Spike Halo on Vocal Onset!
      if (dt < 0.24) {
        const kS = dt / 0.24;
        for (let r = 0; r < 12; r++) {
          const a = (r / 12) * Math.PI * 2 + gIdx * 0.3;
          ctx.strokeStyle = (r % 3 === 0) ? CRIMSON : (r % 2 === 0 ? GOLD : CYAN);
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * sz * (0.46 + kS * 0.18), Math.sin(a) * sz * (0.46 + kS * 0.18));
          ctx.lineTo(Math.cos(a) * sz * (0.76 + kS * 0.38), Math.sin(a) * sz * (0.76 + kS * 0.38));
          ctx.stroke();
        }
      }

      ctx.font = fontFn(900, sz);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const pw = Math.max(sz * 0.66, ctx.measureText(ch).width + 24);
      const ph = sz * 1.10;

      if (SMALL_PARTICLES.has(ch)) {
        const rad = Math.max(pw, ph) * 0.50;
        ctx.fillStyle = INK;
        ctx.beginPath(); ctx.arc(5, 5, rad, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = isHot ? CRIMSON : GOLD;
        ctx.strokeStyle = isLight ? INK : BONE;
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = isHot ? BONE : INK;
        ctx.fillText(ch, 0, 3);
      } else {
        const isStarKanji = (ch === '星' || ch === '叫');
        const fillC = isHot
          ? (isStarKanji ? GOLD : CRIMSON)
          : (isStarKanji ? GOLD : (isLight ? INK : (gIdx % 2 === 0 ? PANEL : CYAN)));
        const txtC = (fillC === GOLD || fillC === CYAN || fillC === BONE) ? INK : BONE;

        ctx.fillStyle = isStarKanji ? CRIMSON : GOLD;
        ctx.fillRect(-pw * 0.5 + 8, -ph * 0.5 + 8, pw, ph);
        ctx.fillStyle = fillC;
        ctx.strokeStyle = isLight ? INK : BONE;
        ctx.lineWidth = 4.5;
        ctx.fillRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.strokeRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.fillStyle = txtC;
        ctx.fillText(ch, 0, 4);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  window.registerCortexPlate('P31_seraphim_star_cathedral', {
    render(ctx, arg1, arg2) {
      const { st, core } = resolveArgs(arg1, arg2);
      const { W, H, TAU, clamp, lerp, prog, ease } = core;
      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;

      const cueL37 = core.cueById('L37_SHOUT_190_STARS');
      const w37 = (cueL37 && cueL37.words) || [];

      const tC1 = w37[2]  ? w37[2].start  : 207.055;
      const tC2 = w37[5]  ? w37[5].start  : 208.007;
      const tC3 = w37[7]  ? w37[7].start  : 208.642;
      const tC4 = w37[9]  ? w37[9].start  : 209.278;
      const tC5 = w37[10] ? w37[10].start : 209.595;
      const tC6 = w37[12] ? w37[12].start : 210.230;
      const tC7 = w37[14] ? w37[14].start : 210.865;

      const uAll = clamp((t - 206.42) / (211.75 - 206.42), 0, 1);
      const litCount = Math.min(190, Math.max(14, Math.floor(14 + uAll * 192)));

      let bg = INK;
      let fg = CYAN;
      let isLight = false;
      let shake = kick * 0.25;

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // V6.2: Sunlit Azure-Gold 3D 6-Wing Celestial Cathedral (`B3D_04_cathedral`) + 2D Celestial Heroine Fusion!
      const v6 = window.CortexV6;
      const drew3D = v6 && typeof v6.draw3DClipFrame === 'function' && v6.draw3DClipFrame(ctx, 'B3D_04_cathedral', t, {
        kick,
        kickZoom: 0.018,
        scrim: 0.14,
        isPaper: true,
        tintStrength: 0.065
      });

      if (drew3D) {
        bg = PAPER; fg = INK; isLight = true;

        // 2D+3D Fusion (V7): Whisper-fine Gilded 190-Synapse 2D Constellation Filigree + Sunlit Dust Motes (ZERO C20/M2 reuse!)
        ctx.save();
        const prevRaw = ctx.__v6RawColor;
        ctx.__v6RawColor = true;
        const cx = W * 0.5, cy = H * 0.48;
        const pts = [];
        for (let i = 0; i < litCount; i++) {
          const stObj = STARS_190[i];
          const ang = stObj.theta + t * 0.26;
          const sx = cx + Math.cos(ang) * 760 * stObj.rNorm;
          const sy = cy + Math.sin(ang) * 430 * stObj.rNorm;
          pts.push({ x: sx, y: sy });
          if (i >= 13 && i % 3 === 0) {
            ctx.strokeStyle = 'rgba(255, 232, 172, 0.22)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(pts[i - 13].x, pts[i - 13].y);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          }
          const rDot = (i % 9 === 0) ? 3.8 : 2.1;
          ctx.fillStyle = (i % 5 === 0) ? 'rgba(255, 224, 138, 0.85)' : 'rgba(255, 250, 240, 0.72)';
          ctx.beginPath();
          ctx.arc(sx, sy, rDot + kick * 1.1, 0, TAU);
          ctx.fill();
        }
        ctx.__v6RawColor = prevRaw;
        ctx.restore();

        if (typeof v6.draw2D3DAtmosphereBridge === 'function') {
          v6.draw2D3DAtmosphereBridge(ctx, {
            t,
            kick,
            vpX: W * 0.5,
            vpY: H * 0.48,
            speedLines: t >= tC4 ? 18 : 0,
            speedAlpha: 0.18,
            motes: 26,
            moteAlpha: 0.75,
            isPaper: true,
            accent: '#ECC16E'
          });
        }

        if (t < tC1) {
          drawAutonomousCathedralTokens(ctx, w37, 0, 1, t, 210, true, kick, { mode: 'shoutPair' });
          drawCathedralHud(ctx, W, H, true, '3D_CATHEDRAL // SERAPHIM_WINGS', litCount);
        } else if (t < tC2) {
          drawAutonomousCathedralTokens(ctx, w37, 0, 4, t, 185, true, kick, { mode: 'wingArc' });
          drawCathedralHud(ctx, W, H, true, '3D_CATHEDRAL // GILDED_ARMILLARY', litCount);
        } else if (t < tC3) {
          drawAutonomousCathedralTokens(ctx, w37, 2, 6, t, 192, true, kick, { mode: 'wingArc' });
          drawCathedralHud(ctx, W, H, true, '3D_CATHEDRAL // CRYSTAL_FEATHERS', litCount);
        } else if (t < tC4) {
          drawAutonomousCathedralTokens(ctx, w37, 2, 8, t, 174, true, kick, { mode: 'sunburstOrbit' });
          drawCathedralHud(ctx, W, H, true, '3D_CATHEDRAL // VAULT_ASCENT', litCount);
        } else if (t < tC5) {
          drawAutonomousCathedralTokens(ctx, w37, 0, 9, t, 158, true, kick, { mode: 'sunburstOrbit' });
          drawCathedralHud(ctx, W, H, true, '3D_CATHEDRAL // SUNBURST_PEAK', litCount);
          shake = 0.36 + kick * 0.25;
        } else if (t < tC6) {
          drawAutonomousCathedralTokens(ctx, w37, 10, 11, t, 215, true, kick, { mode: 'starCoda', serif: true });
          drawCathedralHud(ctx, W, H, true, '3D_CATHEDRAL // 190_STARS_IGNITE', litCount);
        } else if (t < tC7) {
          drawAutonomousCathedralTokens(ctx, w37, 10, 13, t, 200, true, kick, { mode: 'starCoda', serif: true });
          drawCathedralHud(ctx, W, H, true, '3D_CATHEDRAL // SYNAPSES_LOCKED', 190);
        } else {
          drawAutonomousCathedralTokens(ctx, w37, 10, Math.min(15, w37.length - 1), t, 196, true, kick, { mode: 'starCoda', serif: true });
          drawCathedralHud(ctx, W, H, true, '3D_CATHEDRAL // OMEGA_DAWN', 190);
          shake = 0.34 + kick * 0.25;
        }

        ctx.restore();
        return {
          bg: PAPER,
          fg: INK,
          duotone: { bg: PAPER, fg: INK },
          isPaper: true,
          bloom: 0.20 + kick * 0.10,
          ca: 0,
          flash: 0,
          shake
        };
      }

      if (t < tC1) {
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        const unfold = prog(t, 206.42, tC1, ease.outBack);
        drawSeraphimWings(ctx, W * 0.5, 485, 760, clamp(unfold, 0, 1.15), 0, false, kick);
        draw190SynapseDomeAndTags(ctx, W, H, W * 0.5, 485, 560, 360, litCount, t, false, 0);

        drawAutonomousCathedralTokens(ctx, w37, 0, 1, t, 215, false, kick, { mode: 'shoutPair' });
        drawCathedralHud(ctx, W, H, false, 'CUT_01 // SERAPHIM_WINGS_UNFURL', litCount);
      } else if (t < tC2) {
        bg = PAPER; fg = INK; isLight = true;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawSeraphimWings(ctx, W * 0.5, 485, 680, 1.0, (t - tC1) * 0.55, true, kick);
        draw190SynapseDomeAndTags(ctx, W, H, W * 0.5, 485, 580, 380, litCount, t, true, 0);

        drawAutonomousCathedralTokens(ctx, w37, 0, 4, t, 188, true, kick, { mode: 'wingArc' });
        drawCathedralHud(ctx, W, H, true, 'CUT_02 // ARMILLARY_GYRO_RINGS', litCount);
      } else if (t < tC3) {
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawSeraphimWings(ctx, W * 0.5, 485, 860, 1.05, 0.36 + (t - tC2) * 0.5, false, kick);
        draw190SynapseDomeAndTags(ctx, W, H, W * 0.5, 485, 600, 390, litCount, t, false, 0);

        drawAutonomousCathedralTokens(ctx, w37, 2, 6, t, 198, false, kick, { mode: 'wingArc' });
        drawCathedralHud(ctx, W, H, false, 'CUT_03 // ROTOR_CORE_MACRO', litCount);
      } else if (t < tC4) {
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        for (let a = 1; a <= 14; a++) {
          const span = a * 95 + ((t * 140) % 95);
          ctx.strokeStyle = (a % 4 === 0) ? GOLD : (a % 2 === 0 ? CYAN : COBALT);
          ctx.lineWidth = a % 3 === 0 ? 3.2 : 1.3;
          ctx.beginPath();
          ctx.moveTo(W * 0.5 - span, 920);
          ctx.quadraticCurveTo(W * 0.5 - span * 0.45, 240, W * 0.5, 110);
          ctx.quadraticCurveTo(W * 0.5 + span * 0.45, 240, W * 0.5 + span, 920);
          ctx.stroke();
        }
        draw190SynapseDomeAndTags(ctx, W, H, W * 0.5, 470, 580, 360, litCount, t, false, 0);

        drawAutonomousCathedralTokens(ctx, w37, 2, 8, t, 176, false, kick, { mode: 'sunburstOrbit' });
        drawCathedralHud(ctx, W, H, false, 'CUT_04 // CATHEDRAL_VAULT_ASCENT', litCount);
      } else if (t < tC5) {
        bg = PAPER; fg = INK; isLight = true;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        const cx = W * 0.5, cy = H * 0.48;
        for (let r = 0; r < 96; r++) {
          const ang = (r / 96) * TAU + t * 1.4;
          ctx.strokeStyle = (r % 8 === 0) ? CRIMSON : (r % 4 === 0 ? COBALT : SILVER);
          ctx.lineWidth = r % 4 === 0 ? 3.6 : 1.2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * 140, cy + Math.sin(ang) * 140);
          ctx.lineTo(cx + Math.cos(ang) * 1120, cy + Math.sin(ang) * 1120);
          ctx.stroke();
        }

        drawAutonomousCathedralTokens(ctx, w37, 0, 9, t, 156, true, kick, { mode: 'sunburstOrbit' });
        drawCathedralHud(ctx, W, H, true, 'CUT_05 // SHOUT_SUNBURST_PEAK', litCount);
        shake = 0.48 + kick * 0.35;
      } else if (t < tC6) {
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawSeraphimWings(ctx, W * 0.5, 485, 740, 1.0, -0.24 - (t - tC5) * 0.6, false, kick);
        draw190SynapseDomeAndTags(ctx, W, H, W * 0.5, 485, 610, 395, litCount, t, false, 0);

        drawAutonomousCathedralTokens(ctx, w37, 10, 11, t, 220, false, kick, { mode: 'starCoda', serif: true });
        drawCathedralHud(ctx, W, H, false, 'CUT_06 // CONSTELLATION_IGNITION', litCount);
      } else if (t < tC7) {
        bg = PAPER; fg = INK; isLight = true;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        drawSeraphimWings(ctx, W * 0.5, 485, 790, 1.08, 0.18 + (t - tC6) * 0.5, true, kick);
        draw190SynapseDomeAndTags(ctx, W, H, W * 0.5, 485, 620, 405, 190, t, true, 0);

        drawAutonomousCathedralTokens(ctx, w37, 10, 13, t, 205, true, kick, { mode: 'starCoda', serif: true });
        drawCathedralHud(ctx, W, H, true, 'CUT_07 // ALL_190_SYNAPSES_LOCKED', 190);
      } else {
        const omegaU = prog(t, tC7, 211.75, ease.inOutCubic);
        bg = INK; fg = CYAN; isLight = false;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        drawSeraphimWings(ctx, W * 0.5, 495, lerp(840, 460, omegaU), 1.0, omegaU * 0.85, false, kick);
        draw190SynapseDomeAndTags(ctx, W, H, W * 0.5, 495, 620, 405, 190, t, false, omegaU * 0.72);

        // Angled Stamp Plaque for first shout (`叫べローターハート！`)
        ctx.save();
        ctx.translate(610, 148);
        ctx.rotate(-0.05);
        ctx.fillStyle = PANEL;
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 4;
        ctx.fillRect(-300, -32, 600, 64);
        ctx.strokeRect(-300, -32, 600, 64);
        ctx.fillStyle = GOLD;
        ctx.font = JA_DISP(900, 38);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('叫べローターハート！', 0, 2);
        ctx.restore();

        drawAutonomousCathedralTokens(ctx, w37, 10, Math.min(15, w37.length - 1), t, 198, false, kick, {
          mode: 'starCoda',
          serif: true
        });
        drawCathedralHud(ctx, W, H, false, 'CUT_08 // OMEGA_POINT_190_STARS', 190);
        shake = 0.42 + omegaU * 0.28 + kick * 0.30;
      }

      ctx.restore();

      return {
        bg,
        fg,
        duotone: { bg: isLight ? PAPER : INK, fg: isLight ? INK : CYAN },
        isPaper: isLight,
        bloom: 0,
        ca: 0,
        flash: 0,
        shake
      };
    }
  });
})();
