// ============================================================================
// Plate 20 — `P20_oscilloscope_singularity.js` (`34.45s – 39.20s`)
// Cue: `L05_WAIT_NAME` (`名前を呼ばれるその瞬間を待ってる`)
// Treatise Palette (#52 Relativistic Multi-Layer Contrast):
//   - Dark Void `#08090C` + Tektronix Slate `#111827` + Warped Geodesic Grid `#334155`
//   - Relativistic Doppler Accretion: Approaching Blueshift `#38BDF8` + Receding Ember `#FF8A3D`
//     & Amber Gold `#FBBF24` Photon Sphere + Bone-White `#FAF8F5` Einstein Halo + Crimson `#FF2E55` Rim!
//   - Alternating Archival Paper Cuts (`#FAF8F5` + `#64748B` burin + `#08090C` shadow + `#0376B8` / `#FF2E55`)
// Autonomous Per-Character Choreography (#53):
//   - Strong Kanji (`名 前 呼 瞬間 待`, `190–248px`) vs Hiragana (`を ばれる その ってる`, `82–96px`)
//     scale contrast, asymmetric orbital & diagonal/tategaki scatter, independent lensing trajectories!
// ============================================================================
(function () {
  'use strict';

  const C_VOID = '#08090C';
  const C_CARD = '#111827';
  const C_GRID = '#334155';
  const C_SLATE = '#64748B';
  const C_BONE = '#FAF8F5';
  const C_CYAN = '#38BDF8';
  const C_COBALT = '#0376B8';
  const C_GOLD = '#FBBF24';
  const C_EMBER = '#FF8A3D';
  const C_CRIMSON = '#FF2E55';

  const JA_DISPLAY = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", sans-serif`;
  const JA_SERIF = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif SC", serif`;
  const MONO = (w, sz) =>
    `${w} ${sz.toFixed(1)}px "JetBrains Mono", "Cascadia Mono", Consolas, monospace`;

  // 15 Autonomous Spatial Entities for `名前を呼ばれるその瞬間を待ってる` (#53 Nonlinear Collage!)
  const L05_LAYOUT = [
    { x: 255,  y: 255, sz: 196, rot: -0.19, style: 'stamp',   col: C_CYAN,    kanji: true  }, // 0: 名
    { x: 445,  y: 185, sz: 188, rot:  0.13, style: 'outline', col: C_BONE,    kanji: true  }, // 1: 前
    { x: 585,  y: 278, sz: 84,  rot: -0.24, style: 'circle',  col: C_GOLD,    kanji: false }, // 2: を (shoulder particle!)
    { x: 1385, y: 210, sz: 206, rot: -0.15, style: 'stamp',   col: C_CRIMSON, kanji: true  }, // 3: 呼
    { x: 1565, y: 175, sz: 88,  rot:  0.18, style: 'tag',     col: C_GOLD,    kanji: false }, // 4: ば (vertical cascade!)
    { x: 1610, y: 278, sz: 86,  rot: -0.14, style: 'bare',    col: C_CYAN,    kanji: false }, // 5: れ
    { x: 1665, y: 378, sz: 88,  rot:  0.21, style: 'tag',     col: C_EMBER,   kanji: false }, // 6: る
    { x: 245,  y: 650, sz: 88,  rot: -0.17, style: 'tag',     col: C_CYAN,    kanji: false }, // 7: そ
    { x: 338,  y: 740, sz: 84,  rot:  0.22, style: 'circle',  col: C_GOLD,    kanji: false }, // 8: の
    { x: 615,  y: 775, sz: 224, rot: -0.11, style: 'hero',    col: C_CRIMSON, kanji: true  }, // 9: 瞬間 (hero stamp!)
    { x: 865,  y: 845, sz: 82,  rot:  0.25, style: 'circle',  col: C_EMBER,   kanji: false }, // 10: を
    { x: 1275, y: 760, sz: 218, rot:  0.12, style: 'stamp',   col: C_GOLD,    kanji: true  }, // 11: 待
    { x: 1475, y: 685, sz: 84,  rot: -0.22, style: 'bare',    col: C_BONE,    kanji: false }, // 12: っ
    { x: 1565, y: 768, sz: 92,  rot:  0.16, style: 'tag',     col: C_CYAN,    kanji: false }, // 13: て
    { x: 1665, y: 842, sz: 92,  rot: -0.18, style: 'stamp',   col: C_CRIMSON, kanji: false }  // 14: る
  ];

  function drawCornerBurinBezel() {
    // V8.5: Removed CAD corner boxes & diagonal burin bezel
    return;
  }

  function drawOscilloscopeStage(ctx, core, t, collapseU, isPaper, kick) {
    const { W, H, lerp } = core;
    const gw = W - 260;
    const cy = H * 0.50;
    const prevRaw = ctx.__v6RawColor;

    ctx.save();
    ctx.__v6RawColor = true;
    // Deep void space + soft radial volumetric glow (ZERO Tektronix square box, ZERO 10x8 graticule grid!)
    ctx.fillStyle = '#040712';
    ctx.fillRect(0, 0, W, H);
    const rg = ctx.createRadialGradient(W * 0.5, cy, 12, W * 0.5, cy, lerp(620, 220, collapseU));
    rg.addColorStop(0, `rgba(56, 189, 248, ${(0.22 + collapseU * 0.30).toFixed(2)})`);
    rg.addColorStop(0.55, 'rgba(3, 118, 184, 0.08)');
    rg.addColorStop(1, 'rgba(4, 7, 18, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);

    // 3 multi-color solid harmonic carrier traces collapsing cleanly into center singularity point
    const traceCols = ['#38BDF8', '#7DD3FC', '#FAF8F5'];
    const ampScale = (1 - collapseU) * (215 + kick * 65);
    const widthCollapse = lerp(1.0, 0.06, Math.pow(collapseU, 2.4));
    const xSpan = gw * widthCollapse;
    const xStart = W * 0.5 - xSpan * 0.5;

    for (let tr = 2; tr >= 0; tr--) {
      ctx.strokeStyle = traceCols[tr];
      ctx.lineWidth = tr === 0 ? 4.8 : tr === 1 ? 2.4 : 1.5;
      const phase = t * 18.0 - tr * 0.55;
      ctx.beginPath();
      const N = 220;
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const env = Math.sin(u * Math.PI);
        const wave =
          Math.sin(u * 26 + phase) * 0.58 +
          Math.cos(u * 53 - phase * 1.4) * 0.28 +
          Math.sin(u * 111 + phase * 2.3) * 0.14;
        const px = xStart + u * xSpan;
        const py = cy + wave * ampScale * env + (tr - 1) * 10 * (1 - collapseU);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    if (collapseU > 0.25) {
      core.drawSparkHead(ctx, W * 0.5, cy, t, 2.0 + collapseU * 2.6, 1.0, { fg: '#38BDF8', bg: '#FAF8F5' });
    }
    ctx.__v6RawColor = prevRaw;
    ctx.restore();
  }

  function drawCurvedSingularityArc(ctx, core, cx, cy, t, kick, zoomScale = 1.0) {
    const { clamp, lerp, ease } = core;
    if (t < 35.18) return;
    const exitFade = t > 38.76 ? 1 - clamp((t - 38.76) / 0.40, 0, 1) : 1;
    if (exitFade <= 0.01) return;
    const letters = 'SINGULARITY';
    const rxBase = (256 + kick * 8) * zoomScale;
    const ryBase = (238 + kick * 8) * zoomScale;
    const angStart = -Math.PI * 0.72;
    const angEnd   = -Math.PI * 0.28;
    const rock = Math.sin((t - 35.2) * 0.85) * 0.032;
    const prevRaw = ctx.__v6RawColor;

    ctx.save();
    ctx.__v6RawColor = true;
    ctx.font = `900 ${Math.round(38 * Math.min(1.30, zoomScale))}px "Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < letters.length; i++) {
      const enterU = ease.outCubic(clamp((t - (35.22 + i * 0.038)) / 0.26, 0, 1));
      if (enterU <= 0.02) continue;
      const frac = i / (letters.length - 1);
      const th = lerp(angStart, angEnd, frac) + rock;
      const rx = lerp(rxBase + 34, rxBase, enterU);
      const ry = lerp(ryBase + 34, ryBase, enterU);
      const px = cx + Math.cos(th) * rx;
      const py = cy + Math.sin(th) * ry;
      const tanAng = Math.atan2(ry * Math.cos(th), -rx * Math.sin(th));

      ctx.save();
      ctx.globalAlpha = enterU * exitFade * 0.94;
      ctx.translate(px, py);
      ctx.rotate(tanAng);
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 14;
      ctx.strokeStyle = 'rgba(4, 10, 24, 0.85)';
      ctx.lineWidth = 6.0;
      ctx.strokeText(letters[i], 0, 0);
      ctx.fillStyle = '#EAF6FF';
      ctx.fillText(letters[i], 0, 0);
      ctx.shadowBlur = 0;
      ctx.restore();
    }
    ctx.__v6RawColor = prevRaw;
    ctx.restore();
  }

  function drawEngravedBlackHole(ctx, core, cx, cy, bhR, tiltRad, spinPhase, isPaper, kick, zoomScale) {
    const { TAU, clamp, lerp } = core;
    const prevRaw = ctx.__v6RawColor;

    ctx.save();
    ctx.__v6RawColor = true;
    ctx.translate(cx, cy);
    ctx.rotate(tiltRad * 0.65);
    ctx.scale(zoomScale, zoomScale);

    // =========================================================================
    // 1. TRUE 3D PERSPECTIVE SPACETIME GRAVITY-WELL FUNNEL GRID (`网格牵引效果`)
    //    Bends a full 26x26 3D coordinate sheet deeply downward AND pinches it
    //    radially inward into the black hole throat with animated traction waves!
    // =========================================================================
    const N = 24;
    const span = 1360;
    const pitch = 0.66; // ~38 deg cinema camera elevation looking down at warped spacetime sheet!
    const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
    const yaw = Math.sin(spinPhase * 0.14) * 0.18;
    const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
    const fov = 1120;
    const camDist = 1580;
    const wellDepth = (440 + kick * 85) * (bhR / 200);
    const wellCore = Math.max(95, bhR * 1.18);

    function projectWell(wx, wz) {
      const r = Math.hypot(wx, wz);
      // Radial gravitational pinch + inward-propagating spacetime traction wave!
      const wave = 0.055 * Math.sin(r * 0.018 + spinPhase * 3.4) * Math.exp(-r / 980);
      const pinch = clamp(0.46 * Math.exp(-r / (bhR * 2.4)) + wave, -0.08, 0.56);
      const px = wx * (1 - pinch);
      const pz = wz * (1 - pinch);
      const rp = Math.hypot(px, pz);
      // Deep Schwarzschild gravity funnel dipping downward (+Y in screen space!)
      const wy = -125 + wellDepth / (1.0 + Math.pow(rp / wellCore, 1.72));

      // Yaw around Y, then Pitch around X
      const rx = px * cosY - pz * sinY;
      const rz0 = px * sinY + pz * cosY;
      const ry = wy * cosP - rz0 * sinP;
      const rz = wy * sinP + rz0 * cosP;
      const sc = fov / Math.max(260, camDist + rz);
      return { x: rx * sc, y: ry * sc + 70, r: rp, sc };
    }

    // Precompute warped 3D spacetime grid vertices
    const grid = new Array(N + 1);
    for (let i = 0; i <= N; i++) {
      grid[i] = new Array(N + 1);
      const wz = -span + (i / N) * (span * 2);
      for (let j = 0; j <= N; j++) {
        const wx = -span + (j / N) * (span * 2);
        grid[i][j] = projectWell(wx, wz);
      }
    }

    // Draw warped latitude & longitude geodesic curves with proximity luminance boost!
    for (let dir = 0; dir < 2; dir++) {
      for (let i = 0; i <= N; i++) {
        const isMajor = (i % 4 === 0);
        for (let j = 0; j < N; j++) {
          const p0 = dir === 0 ? grid[i][j] : grid[j][i];
          const p1 = dir === 0 ? grid[i][j + 1] : grid[j + 1][i];
          const rMid = (p0.r + p1.r) * 0.5;
          const pullProx = clamp(1.0 - rMid / 820, 0, 1);

          if (isPaper) {
            ctx.strokeStyle = pullProx > 0.55
              ? `rgba(217, 59, 88, ${(0.35 + pullProx * 0.50).toFixed(2)})`
              : (isMajor
                  ? `rgba(43, 120, 178, ${(0.32 + pullProx * 0.45).toFixed(2)})`
                  : `rgba(77, 90, 110, ${(0.20 + pullProx * 0.32).toFixed(2)})`);
          } else {
            ctx.strokeStyle = pullProx > 0.62
              ? `rgba(236, 193, 110, ${(0.32 + pullProx * 0.62).toFixed(2)})`
              : (isMajor || pullProx > 0.25
                  ? `rgba(74, 166, 219, ${(0.22 + pullProx * 0.58).toFixed(2)})`
                  : 'rgba(65, 82, 110, 0.24)');
          }
          ctx.lineWidth = (isMajor ? 2.1 : 1.15) + pullProx * 1.65;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      }
    }

    // Animated radial gravitational-traction streams visibly pulling light particles down the funnel!
    const nStreams = 28;
    for (let s = 0; s < nStreams; s++) {
      const ang = (s / nStreams) * TAU + spinPhase * 0.12;
      const phase = ((spinPhase * 0.55 + s * 0.37) % 1 + 1) % 1;
      const rHead = lerp(1180, bhR * 0.92, Math.pow(phase, 0.72));
      const rTail = Math.min(1300, rHead + lerp(190, 75, phase));
      const pH = projectWell(Math.cos(ang) * rHead, Math.sin(ang) * rHead);
      const pT = projectWell(Math.cos(ang) * rTail, Math.sin(ang) * rTail);
      ctx.strokeStyle = s % 3 === 0
        ? (isPaper ? 'rgba(217, 59, 88, 0.72)' : 'rgba(236, 193, 110, 0.78)')
        : (isPaper ? 'rgba(43, 120, 178, 0.68)' : 'rgba(126, 196, 236, 0.72)');
      ctx.lineWidth = 2.4 * (0.6 + phase * 0.7);
      ctx.beginPath();
      ctx.moveTo(pT.x, pT.y);
      ctx.lineTo(pH.x, pH.y);
      ctx.stroke();
    }

    // =========================================================================
    // 2. RELATIVISTIC GARGANTUA RINGED BLACK HOLE (BACK HALO + LENSED ARCHES)
    // =========================================================================
    const bhY = -28; // Suspended majestically above the stretched spacetime funnel throat!
    ctx.save();
    ctx.translate(0, bhY);

    // Wide ambient gravitational corona bloom
    const ambG = ctx.createRadialGradient(0, 0, bhR * 0.9, 0, 0, bhR * 3.4);
    if (isPaper) {
      ambG.addColorStop(0, 'rgba(43, 120, 178, 0.24)');
      ambG.addColorStop(0.45, 'rgba(217, 158, 52, 0.14)');
      ambG.addColorStop(1, 'rgba(245, 240, 230, 0)');
    } else {
      ambG.addColorStop(0, 'rgba(255, 224, 156, 0.34)');
      ambG.addColorStop(0.35, 'rgba(74, 166, 219, 0.22)');
      ambG.addColorStop(0.72, 'rgba(217, 59, 88, 0.08)');
      ambG.addColorStop(1, 'rgba(8, 9, 12, 0)');
    }
    ctx.fillStyle = ambG;
    ctx.beginPath();
    ctx.arc(0, 0, bhR * 3.4, 0, TAU);
    ctx.fill();

    // Gravitationally Lensed UPPER & LOWER Einstein Halo Arches (far side of ring bent over the poles!)
    for (let k = 0; k < 14; k++) {
      const u = k / 13;
      const rx = bhR * lerp(1.06, 1.92, u) + kick * 8;
      const ryTop = bhR * lerp(1.05, 1.54, u) + kick * 6;
      const ryBot = bhR * lerp(1.04, 1.34, u) + kick * 5;
      const alpha = (1 - u * 0.72) * (k < 3 ? 0.92 : 0.62);

      // Upper lensed arch (passes ABOVE black hole shadow!)
      ctx.strokeStyle = k < 2
        ? (isPaper ? `rgba(18, 22, 32, ${alpha.toFixed(2)})` : `rgba(250, 248, 242, ${alpha.toFixed(2)})`)
        : (k < 7
            ? `rgba(236, 193, 110, ${alpha.toFixed(2)})`
            : `rgba(74, 166, 219, ${(alpha * 0.85).toFixed(2)})`);
      ctx.lineWidth = k < 3 ? 3.2 : (k % 2 === 0 ? 2.0 : 1.2);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ryTop, 0, Math.PI, TAU);
      ctx.stroke();

      // Lower secondary lensed arch (passes BENEATH black hole shadow!)
      ctx.strokeStyle = k < 3
        ? `rgba(236, 193, 110, ${(alpha * 0.75).toFixed(2)})`
        : `rgba(74, 166, 219, ${(alpha * 0.55).toFixed(2)})`;
      ctx.lineWidth = k < 3 ? 2.2 : 1.1;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * 0.94, ryBot, 0, 0, Math.PI);
      ctx.stroke();
    }

    // Back half of equatorial accretion ring (passing BEHIND event horizon)
    const diskRx = bhR * 3.55;
    const diskRy = bhR * 0.44;
    for (let k = 0; k < 16; k++) {
      const u = k / 15;
      const rx = lerp(bhR * 1.18, diskRx, u);
      const ry = lerp(diskRy * 0.35, diskRy, u);
      const al = (1 - u * 0.65) * 0.68;
      ctx.strokeStyle = k % 3 === 0
        ? `rgba(236, 193, 110, ${al.toFixed(2)})`
        : `rgba(74, 166, 219, ${al.toFixed(2)})`;
      ctx.lineWidth = k < 4 ? 3.0 : 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, Math.PI, TAU);
      ctx.stroke();
    }

    // =========================================================================
    // 3. EVENT HORIZON SHADOW + BLAZING PHOTON RING
    // =========================================================================
    ctx.save();
    ctx.shadowColor = isPaper ? 'rgba(43, 120, 178, 0.55)' : 'rgba(255, 214, 138, 0.90)';
    ctx.shadowBlur = 26 + kick * 14;
    ctx.fillStyle = '#04060B';
    ctx.beginPath();
    ctx.arc(0, 0, bhR, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = isPaper ? '#2B78B2' : '#FFF6E0';
    ctx.lineWidth = 3.8 + kick * 1.8;
    ctx.stroke();
    ctx.restore();

    // Inner razor photon ring hairline + secondary golden caustics
    ctx.strokeStyle = '#ECC16E';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, bhR * 1.035, 0, TAU);
    ctx.stroke();

    // =========================================================================
    // 4. FOREGROUND EQUATORIAL RELATIVISTIC ACCRETION RING (SWEEPING IN FRONT!)
    //    Asymmetric Relativistic Doppler Beaming: Blazing Cyan-White Left -> Amber-Gold Right!
    // =========================================================================
    ctx.save();
    const diskGrad = ctx.createLinearGradient(-diskRx, 0, diskRx, 0);
    if (isPaper) {
      diskGrad.addColorStop(0.0, 'rgba(43, 120, 178, 0.15)');
      diskGrad.addColorStop(0.28, 'rgba(74, 166, 219, 0.92)');
      diskGrad.addColorStop(0.50, 'rgba(255, 248, 232, 0.96)');
      diskGrad.addColorStop(0.74, 'rgba(217, 158, 52, 0.88)');
      diskGrad.addColorStop(1.0, 'rgba(217, 59, 88, 0.18)');
    } else {
      diskGrad.addColorStop(0.0, 'rgba(74, 166, 219, 0.08)');
      diskGrad.addColorStop(0.25, 'rgba(148, 224, 255, 0.96)');
      diskGrad.addColorStop(0.46, 'rgba(255, 250, 238, 1.00)');
      diskGrad.addColorStop(0.72, 'rgba(242, 184, 78, 0.92)');
      diskGrad.addColorStop(1.0, 'rgba(217, 59, 88, 0.12)');
    }

    // Soft glowing ribbon base across foreground of black hole
    ctx.fillStyle = diskGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, diskRx * 0.92, diskRy * 0.95, 0, 0.04, Math.PI - 0.04);
    ctx.ellipse(0, 0, bhR * 1.04, diskRy * 0.24, 0, Math.PI - 0.04, 0.04, true);
    ctx.closePath();
    ctx.fill();

    // Swirling individual relativistic plasma rings & orbiting luminous streaks
    for (let k = 0; k < 22; k++) {
      const u = k / 21;
      const rx = lerp(bhR * 1.06, diskRx, u);
      const ry = lerp(diskRy * 0.24, diskRy * 1.12, u);
      const al = (1 - u * 0.62) * (k < 5 ? 0.96 : 0.72);
      ctx.lineWidth = k < 3 ? 3.2 : (k % 3 === 0 ? 2.2 : 1.15);

      // Left approaching arc (blueshifted bright cyan/white!)
      ctx.strokeStyle = k < 4
        ? `rgba(255, 252, 245, ${al.toFixed(2)})`
        : `rgba(126, 196, 236, ${al.toFixed(2)})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 0.46, Math.PI + 0.08);
      ctx.stroke();

      // Right receding arc (redshifted molten gold & ember!)
      ctx.strokeStyle = k % 3 === 0
        ? `rgba(255, 212, 118, ${al.toFixed(2)})`
        : `rgba(238, 115, 138, ${(al * 0.78).toFixed(2)})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, -0.08, Math.PI * 0.54);
      ctx.stroke();

      // Swirling plasma filaments orbiting at Keplerian shear speed (`omega ~ r^-1.5`)
      if (k % 2 === 0) {
        const keplerSpeed = 2.6 / Math.pow(0.45 + u, 1.15);
        for (let m = 0; m < 4; m++) {
          const a0 = ((m * 1.57 + spinPhase * keplerSpeed + k * 0.7) % Math.PI);
          const aLen = lerp(0.28, 0.14, u);
          ctx.strokeStyle = Math.cos(a0) < 0 ? 'rgba(255, 252, 244, 0.90)' : 'rgba(255, 206, 108, 0.85)';
          ctx.lineWidth = k < 6 ? 2.8 : 1.8;
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, a0, Math.min(Math.PI, a0 + aLen));
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    ctx.restore(); // end bhY
    ctx.__v6RawColor = prevRaw;
    ctx.restore();
  }

  function drawWormholeThroatVortex(ctx, core, t, isPaper, kick) {
    const { W, H, TAU, clamp } = core;
    const cx = W * 0.5;
    const cy = H * 0.47;

    ctx.save();
    const speed = (t * 3.8) % 1;
    for (let i = 22; i >= 1; i--) {
      const z = (i - speed) * 0.14;
      if (z <= 0.08) continue;
      const r = 195 / z + kick * 18;
      if (r > 1500) continue;
      const twist = z * 2.4 - t * 3.2;

      ctx.strokeStyle = i % 4 === 0 ? C_CRIMSON : (i % 2 === 0 ? C_CYAN : C_SLATE);
      ctx.lineWidth = i % 3 === 0 ? clamp(4.2 / z, 1.2, 6.0) : 1.3;
      ctx.beginPath();
      const segs = 36;
      for (let s = 0; s <= segs; s++) {
        const a = (s / segs) * TAU + twist;
        const radMod = r * (1 + 0.06 * Math.sin(a * 6));
        const px = cx + Math.cos(a) * radMod * 1.18;
        const py = cy + Math.sin(a) * radMod * 0.86;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    for (let f = 0; f < 48; f++) {
      const baseA = (f / 48) * TAU;
      ctx.strokeStyle = f % 6 === 0 ? C_GOLD : (isPaper ? C_COBALT : C_GRID);
      ctx.lineWidth = f % 6 === 0 ? 2.4 : 1.4;
      ctx.beginPath();
      for (let step = 0; step <= 18; step++) {
        const u = step / 18;
        const r = 34 + Math.pow(u, 2.1) * 1080;
        const a = baseA + u * 1.35 - t * 2.8;
        const px = cx + Math.cos(a) * r * 1.16;
        const py = cy + Math.sin(a) * r * 0.86;
        if (step === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    ctx.fillStyle = C_VOID;
    ctx.beginPath();
    ctx.arc(cx, cy, 48 + kick * 12, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = C_GOLD;
    ctx.lineWidth = 4.5;
    ctx.stroke();

    ctx.restore();
  }

  // Autonomous Per-Character Gravitational Lensing Renderer (#53)
  function drawL05PhotonVocalTokens(ctx, core, cue, t, subCut, isPaper, kick) {
    const words = (cue && cue.words) ? cue.words : [];
    if (!words.length) return;
    const { W, H, clamp, lerp, ease, pulse } = core;
    const cx = W * 0.5;
    const cy = H * 0.50;

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const sp = L05_LAYOUT[Math.min(i, L05_LAYOUT.length - 1)];

      let tx = sp.x;
      let ty = sp.y;
      let rot = sp.rot;
      if (subCut === 0) {
        // Diagonal standing-wave scatter across oscilloscope screen
        tx = clamp(sp.x + Math.sin(i * 1.7) * 40, 165, W - 165);
        ty = clamp(sp.y + Math.sin(t * 7.5 + i * 1.2) * 38, 145, 855);
      } else {
        // Subtle orbital breathe around black hole
        tx = clamp(sp.x + Math.cos(t * 2.8 + i * 0.9) * 14, 155, W - 155);
        ty = clamp(sp.y + Math.sin(t * 3.1 + i * 1.1) * 12, 145, 860);
      }

      if (t < w.start) {
        continue;
      }

      const dt = t - w.start;
      const enterU = ease.outBack(clamp(dt / 0.17, 0, 1));
      const hitP = pulse(t, w.start, 0.13);
      const isSinging = t <= (w.end || w.start + 0.30) + 0.08;

      // Gravitational slingshot outward from Schwarzschild core `(cx, cy)`!
      const px = lerp(cx, tx, clamp(enterU, 0, 1.08));
      const py = lerp(cy, ty, clamp(enterU, 0, 1.08));
      const sc = (0.30 + 0.70 * clamp(enterU, 0, 1.14)) * (1 + hitP * 0.26 + kick * 0.05);
      const lensShear = (1 - clamp(enterU, 0, 1)) * 0.55 + hitP * 0.15 * (i % 2 === 0 ? 1 : -1);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot + hitP * (i % 2 === 0 ? -0.10 : 0.10));
      ctx.transform(sc, 0, lensShear * sc, sc, 0, 0);

      const sz = sp.sz;
      ctx.font = sp.kanji ? JA_SERIF(900, sz) : JA_DISPLAY(900, sz);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const gw = Math.max(sz * 0.78, ctx.measureText(w.w).width);
      const padX = sp.kanji ? 22 : 14;
      const padY = sp.kanji ? 12 : 8;
      const activeCol = isSinging ? C_CRIMSON : sp.col;

      if (sp.style === 'circle') {
        const rad = Math.max(gw, sz) * 0.58;
        ctx.fillStyle = activeCol;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isPaper ? C_VOID : C_BONE;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = activeCol === C_GOLD ? C_VOID : C_BONE;
        ctx.fillText(w.w, 0, sz * 0.04);
      } else if (sp.style === 'stamp' || sp.style === 'hero' || isSinging) {
        const bw = gw + padX * 2;
        const bh = sz * 0.94 + padY * 2;
        ctx.fillStyle = isPaper ? C_VOID : C_GOLD;
        ctx.fillRect(-bw * 0.5 + 8, -bh * 0.5 + 8, bw, bh);
        ctx.fillStyle = activeCol === C_BONE && isPaper ? C_COBALT : activeCol;
        ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
        ctx.strokeStyle = C_BONE;
        ctx.lineWidth = 3.2;
        ctx.strokeRect(-bw * 0.5 + 5, -bh * 0.5 + 5, bw - 10, bh - 10);
        ctx.fillStyle = (activeCol === C_GOLD || activeCol === C_BONE) ? C_VOID : C_BONE;
        ctx.fillText(w.w, 0, sz * 0.04);
      } else if (sp.style === 'tag') {
        const bw = gw + padX * 1.6;
        const bh = sz * 0.92 + padY * 1.4;
        ctx.fillStyle = isPaper ? C_BONE : C_CARD;
        ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
        ctx.strokeStyle = activeCol === C_BONE ? C_CYAN : activeCol;
        ctx.lineWidth = 2.8;
        ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
        ctx.fillStyle = isPaper ? C_VOID : C_BONE;
        ctx.fillText(w.w, 0, sz * 0.04);
      } else {
        // High-contrast bare knockout glyph with multi-layer rim
        ctx.lineJoin = 'miter';
        ctx.miterLimit = 3;
        ctx.strokeStyle = isPaper ? C_BONE : C_VOID;
        ctx.lineWidth = 15;
        ctx.strokeText(w.w, 0, sz * 0.04);
        ctx.fillStyle = isPaper ? (activeCol === C_BONE ? C_VOID : activeCol) : activeCol;
        ctx.fillText(w.w, 0, sz * 0.04);
      }
      ctx.restore();

      if (dt < 0.22) {
        core.drawSparkHead(ctx, px, py - sz * 0.42, t, 1.55, 1.0, { fg: C_EMBER, bg: C_GOLD });
      }
    }

    // Event-horizon gravitational shockwave rings on `瞬間` (`w[9]`) onset (`37.00 – 37.48s`)
    const wShunkan = words[9];
    if (wShunkan && t >= wShunkan.start && t < 37.48) {
      const dtS = t - wShunkan.start;
      const uS = ease.outExpo(clamp(dtS / 0.36, 0, 1));
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = C_CRIMSON;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.arc(0, 0, 140 + uS * 420, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = C_GOLD;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, 0, 95 + uS * 310, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  window.registerCortexPlate('P20_oscilloscope_singularity', {
    render(ctx, arg2, arg3) {
      const core = (arg3 && arg3.W) ? arg3 : window.CortexPDoomCore;
      const st = (typeof arg2 === 'number') ? { ...(arg3 || {}), t: arg2 } : (arg2 || { t: 34.45 });
      const { W, H, clamp, lerp, prog, ease, beatAt } = core;

      const t = st.t;
      const kick = st.kickPulse ?? st.kickEnv ?? st.kick ?? 0;
      const snare = st.snareSnap ?? st.snareEnv ?? st.snare ?? 0;
      const cue = core.cueById('L05_WAIT_NAME');
      const beat = beatAt(t);

      let subCut = 0;
      if (t < 35.25) subCut = 0;
      else if (t < 35.95) subCut = 1;
      else if (t < 36.68) subCut = 2;
      else if (t < 37.48) subCut = 3;
      else if (t < 38.18) subCut = 4;
      else if (t < 38.76) subCut = 5;
      else subCut = 6;

      const isPaper = false;
      const bg = C_VOID;
      const fg = C_CYAN;
      const v6 = window.CortexV6;
      const has3DBH = v6 && typeof v6.draw3DClipFrame === 'function';

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const blendBH = t >= 35.05 ? clamp((t - 35.05) / 0.37, 0, 1) : 0;
      if (t < 35.42) {
        const collapseU = prog(t, 35.00, 35.25, ease.inExpo);
        drawOscilloscopeStage(ctx, core, t, collapseU, false, kick);
      }
      if (t >= 35.05) {
        // Continuous HDR WebGL2 Spacetime Funnel & Warped Metric Grid (`B3D_06_singularity`) across 35.05-39.20s
        // 100%-opaque Schwarzschild Horizon Eruption from collapsed oscilloscope point (zero alpha fade!)
        let zoom3D = 1.0;
        if (subCut === 1) {
          zoom3D = lerp(0.95, 1.02, prog(t, 35.25, 35.95, ease.outExpo));
        } else if (subCut === 4) {
          const u4 = prog(t, 37.48, 38.18, ease.linear);
          zoom3D = 1.0 + Math.sin(u4 * Math.PI) * 0.065;
        } else if (subCut === 6) {
          zoom3D = lerp(1.0, 1.38, prog(t, 38.76, 39.20, ease.inExpo));
        }
        const horizonRad = Math.max(12, ease.outExpo(blendBH) * 1320);
        const prevRaw = ctx.__v6RawColor;
        ctx.save();
        ctx.globalAlpha = 1.0;
        if (blendBH < 0.99) {
          ctx.beginPath();
          ctx.arc(W * 0.5, H * 0.50, horizonRad, 0, Math.PI * 2);
          ctx.clip();
        }
        ctx.__v6RawColor = true;
        const drew3D = has3DBH && v6.draw3DClipFrame(ctx, 'B3D_06_singularity', t, {
          zoom: zoom3D,
          kick,
          kickZoom: 0.022,
          scrim: 0.02,
          isPaper: false,
          tintStrength: 0.0
        });
        ctx.__v6RawColor = prevRaw;
        if (!drew3D) {
          drawEngravedBlackHole(ctx, core, W * 0.5, H * 0.50, 220 + kick * 18, -0.18, t * 3.4, false, kick, zoom3D);
        } else if (typeof v6.draw2D3DAtmosphereBridge === 'function') {
          v6.draw2D3DAtmosphereBridge(ctx, {
            t, kick, vpX: W * 0.5, vpY: H * 0.50,
            speedLines: subCut === 3 || subCut === 6 ? 16 : 0,
            speedAlpha: 0.16,
            motes: 14,
            accent: C_CYAN
          });
        }
        drawCurvedSingularityArc(ctx, core, W * 0.5, H * 0.50, t, kick, zoom3D);
        ctx.restore();

        if (blendBH > 0.02 && blendBH < 0.96) {
          ctx.save();
          ctx.__v6RawColor = true;
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 6.0;
          ctx.beginPath();
          ctx.arc(W * 0.5, H * 0.50, horizonRad, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = '#EAF6FF';
          ctx.lineWidth = 2.2;
          ctx.stroke();
          ctx.__v6RawColor = prevRaw;
          ctx.restore();
        }
      }

      drawL05PhotonVocalTokens(ctx, core, cue, t, subCut, isPaper, kick);

      ctx.restore();
      return {
        bg,
        fg: isPaper ? C_VOID : C_BONE,
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
