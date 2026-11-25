// ============================================================================
// P03_prompt_wake.js — Plate III: First Prompt Wake (`29.78s -> 43.37s`, `L04–L06`)
// Directives (#27 + #52 + #53):
//   1. Multi-Layer Cross-Color Monograph Contrast (`#52`):
//      - Dark cuts: Obsidian `#08090C` void + `#111724` 2.5D server chassis planes +
//        `#475569` copperplate burin hatching & Vernier grids + `#38BDF8` Ice Cyan
//        perspective rails, optical interferometer & keycap stem + vivid `#FF2E55`
//        Signal Crimson & `#FBBF24` Amber Gold contact sparks, cursor bevels & badges.
//      - Blueprint paper cuts: `#F5F0E6` warm drafting sheet + `#EBE3D3` inset bays +
//        `#0376B8` cobalt grid + `#08090C` sumi ink + `#FF2E55` / `#FBBF24` stamps.
//      - ZERO `#FF9EBB` sakura pink; ZERO `shadowBlur`.
//   2. Autonomous Per-Character Japanese Choreography (`#53`):
//      - Non-linear `brutalist`, `cascade`, `stamps`, `arc` constellations synced
//        to exact `w.start` (`L04` split idx 3, `L05` split idx 7, `L06` split idx 9)
//        with strict non-overlapping `safeBox` separation from `drawPromptProbWidget`
//        and the 2.5D Isometric Mechanical Keyswitch!
// ============================================================================
(function () {
  'use strict';

  const core = window.CortexPDoomCore;
  const { W, H, TAU, clamp, lerp, smoothstep, ease, hash, F, font } = core;

  const T0 = 29.78;
  const T1 = 43.37;
  const BPM = 193.5;
  const BEAT = 60 / BPM;

  function wOnset(typo, key, idx, fb) {
    const c = typo && typo.cue ? typo.cue(key) : null;
    return (c && c.words && c.words[idx]) ? c.words[idx].start : fb;
  }

  function beatKick(t) {
    const ph = ((((t * BPM) / 60) % 1) + 1) % 1;
    return Math.pow(Math.max(0, 1 - ph * 3.1), 2.3);
  }

  function resolveShot(t, typo) {
    const t04B = wOnset(typo, 'L04', 3, 30.96) - 0.02;
    const t04C = wOnset(typo, 'L04', 7, 32.24) - 0.02;
    const t05A = 34.45;
    const t05Mid = wOnset(typo, 'L05', 4, 35.58) - 0.02;
    const t05B = wOnset(typo, 'L05', 7, 36.43) - 0.02;
    const t05C = wOnset(typo, 'L05', 11, 37.77) - 0.02;
    const t06A = 39.20;
    const t06B = wOnset(typo, 'L06', 9, 41.26) - 0.02;
    const t06C = wOnset(typo, 'L06', 13, 42.18) - 0.02;

    if (t < t04B) return { cut: 1, cue: 'L04', isPaper: false, tag: 'CUT_01 // DARK_TERMINAL_VOID' };
    if (t < t04C) return { cut: 2, cue: 'L04', isPaper: false, tag: 'CUT_02 // CURSOR_BLINK_LOGITS' };
    if (t < t05A) return { cut: 3, cue: 'L04', isPaper: true,  tag: 'CUT_03 // BLUEPRINT_STANDBY_SHEET' };
    if (t < t05Mid) return { cut: 4, cue: 'L05', isPaper: false, tag: 'CUT_04 // OPTICAL_INTERFEROMETER' };
    if (t < t05B) return { cut: 5, cue: 'L05', isPaper: true,  tag: 'CUT_05 // CALL_VECTOR_SPECIMEN' };
    if (t < t05C) return { cut: 6, cue: 'L05', isPaper: false, tag: 'CUT_06 // AWAIT_INSTANT_LOCK' };
    if (t < t06A) return { cut: 7, cue: 'L05', isPaper: false, tag: 'CUT_07 // PRE_STRIKE_TENSION' };
    if (t < t06B) return { cut: 8, cue: 'L06', isPaper: false, tag: 'CUT_08 // KEYSWITCH_NEE_STRIKE' };
    if (t < t06C) return { cut: 9, cue: 'L06', isPaper: false, tag: 'CUT_09 // ONE_CHAR_SHOCKWAVE' };
    return { cut: 10, cue: 'L06', isPaper: false, tag: 'CUT_10 // PULSE_IGNITION_RUSH' };
  }

  function drawStageBackdrop(ctx, t, shot, kick) {
    if (shot.isPaper) {
      ctx.fillStyle = '#F5F0E6';
      ctx.fillRect(0, 0, W, H);

      // Secondary warm treatise bays
      ctx.fillStyle = '#EBE3D3';
      ctx.fillRect(56, 54, W - 112, 46);
      ctx.fillRect(56, 916, W - 112, 54);

      // Clean warm archival drafting sheet without scrolling blueprint coordinate grids or dashed engineering rings
      for (let rIdx = 0; rIdx < 3; rIdx++) {
        const rr = 175 + rIdx * 125 + kick * 8;
        ctx.save();
        ctx.translate(W * 0.5, 508);
        ctx.rotate(t * (rIdx % 2 === 0 ? 1.85 : -1.45) + rIdx);
        ctx.strokeStyle = rIdx === 1 ? 'rgba(255, 46, 85, 0.35)' : 'rgba(3, 118, 184, 0.25)';
        ctx.lineWidth = rIdx === 1 ? 2.0 : 1.3;
        ctx.beginPath();
        ctx.arc(0, 0, rr, 0, Math.PI * 1.45);
        ctx.stroke();
        ctx.restore();
      }

      // Orthogonal subtle pulse cross-beams (#FF2E55 + #FBBF24)
      const pScanX = 56 + ((((t * 1220) % (W - 112)) + (W - 112)) % (W - 112));
      const pScanY = 100 + ((((t * 740) % 816) + 816) % 816);
      ctx.strokeStyle = 'rgba(255, 46, 85, 0.45)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(pScanX, 100); ctx.lineTo(pScanX, 916);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(56, pScanY); ctx.lineTo(W - 56, pScanY);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Dark Obsidian Multi-Layer Stage (#08090C, clean without burin hatch or dashed HUD wireframes)
    ctx.fillStyle = '#08090C';
    ctx.fillRect(0, 0, W, H);

    // Perspective laser horizon & optical light rails (#38BDF8 + #475569)
    const vx = shot.cut === 2 || shot.cut === 6 ? 620 : W * 0.5;
    const vy = 510;
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
    ctx.lineWidth = 1.1;
    for (let i = -7; i <= 7; i++) {
      const bx = W * 0.5 + i * 155;
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(bx, 970);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(bx, 94);
      ctx.stroke();
    }

    const scroll = ((((t - T0) * 2.65) % 1) + 1) % 1;
    for (let k = 0; k < 8; k++) {
      const z = (((k / 8) + scroll) % 1 + 1) % 1;
      const ez = z * z;
      const yBot = lerp(vy + 18, 964, ez);
      const yTop = lerp(vy - 18, 98, ez);
      ctx.strokeStyle = k % 2 === 0 ? 'rgba(56, 189, 248, 0.55)' : 'rgba(3, 118, 184, 0.35)';
      ctx.lineWidth = k % 2 === 0 ? 4.2 : 2.2;
      ctx.beginPath();
      ctx.moveTo(118, yBot);
      ctx.lineTo(W - 118, yBot);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(118, yTop);
      ctx.lineTo(W - 118, yTop);
      ctx.stroke();
    }

    for (let rIdx = 0; rIdx < 3; rIdx++) {
      const rr = 160 + rIdx * 132 + kick * 10;
      ctx.save();
      ctx.translate(vx, vy);
      ctx.rotate(t * (rIdx % 2 === 0 ? 2.15 : -1.75) + rIdx);
      ctx.strokeStyle = rIdx === 1 ? 'rgba(251, 191, 36, 0.55)' : (rIdx === 2 ? 'rgba(255, 46, 85, 0.45)' : 'rgba(56, 189, 248, 0.50)');
      ctx.lineWidth = rIdx === 1 ? 4.5 : 3.2;
      ctx.beginPath();
      ctx.arc(0, 0, rr, 0, Math.PI * 1.45);
      ctx.stroke();
      ctx.restore();
    }

    const dScanX = 118 + ((((t * 1240) % (W - 236)) + (W - 236)) % (W - 236));
    const dScanY = 96 + ((((t * 780) % 870) + 870) % 870);
    ctx.fillStyle = '#FF2E55';
    ctx.fillRect(dScanX - 3, 96, 6, 870);
    ctx.fillRect(dScanX - 16, 96, 32, 14);
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(118, dScanY - 3, W - 236, 6);
    ctx.fillRect(118, dScanY - 14, 28, 28);

    // Outer CAD frame + contrasting Crimson & Gold telemetry header
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.0;
    ctx.strokeRect(48, 52, W - 96, 918);

    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(116, 52, 410, 42);
    ctx.fillStyle = '#08090C';
    ctx.font = font(F.mono(900), 15);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`▸ P03_PROMPT_WAKE // ${shot.tag}`, 132, 73);

    ctx.fillStyle = '#FF2E55';
    ctx.fillRect(526, 52, 16, 42);

    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(W - 280, 58, 152, 30);
    ctx.fillStyle = '#08090C';
    ctx.font = font(F.mono(900), 14);
    ctx.textAlign = 'center';
    ctx.fillText(`BPM 193.5 // C${String(shot.cut).padStart(2, '0')}`, W - 204, 73);

    // Vernier ruler ticks along left/right monoliths
    for (let y = 120; y <= 940; y += 36) {
      const major = ((y - 120) % 144) === 0;
      ctx.fillStyle = major ? '#FBBF24' : '#64748B';
      ctx.fillRect(98, y, major ? 18 : 9, 2);
      ctx.fillRect(W - 116, y, major ? 18 : 9, 2);
    }

    // Kick-reactive Crimson corner brackets
    if (kick > 0.15) {
      const len = 28 + kick * 22;
      ctx.strokeStyle = '#FF2E55';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(126, 108 + len); ctx.lineTo(126, 108); ctx.lineTo(126 + len, 108);
      ctx.moveTo(W - 126 - len, 108); ctx.lineTo(W - 126, 108); ctx.lineTo(W - 126, 108 + len);
      ctx.moveTo(126, 954 - len); ctx.lineTo(126, 954); ctx.lineTo(126 + len, 954);
      ctx.moveTo(W - 126 - len, 954); ctx.lineTo(W - 126, 954); ctx.lineTo(W - 126, 954 - len);
      ctx.stroke();
    }
  }

  function drawTerminalCursorPedestal(ctx, t, cx, cy, isPaper, kick) {
    const blinkOn = Math.sin(t * TAU * 3.225) > -0.18;
    const bw = 112 + kick * 18;
    const bh = 38;
    const dx = 18;
    const dy = -14;

    ctx.save();
    ctx.translate(cx, cy);

    // Prompt input track line
    ctx.strokeStyle = isPaper ? '#0376B8' : '#475569';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-420, 0);
    ctx.lineTo(420, 0);
    ctx.stroke();

    ctx.fillStyle = isPaper ? '#08090C' : '#111724';
    ctx.fillRect(-380, -24, 156, 48);
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2.0;
    ctx.strokeRect(-380, -24, 156, 48);
    ctx.fillStyle = '#FBBF24';
    ctx.font = font(F.mono(900), 18);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('USER_STDIN >', -302, 0);

    if (blinkOn) {
      // 2.5D extruded cursor block (#FF2E55 + #FBBF24 + #FAF8F5)
      ctx.fillStyle = '#FF2E55';
      ctx.beginPath();
      ctx.moveTo(-bw * 0.5, -bh * 0.5);
      ctx.lineTo(-bw * 0.5 + dx, -bh * 0.5 + dy);
      ctx.lineTo(bw * 0.5 + dx, -bh * 0.5 + dy);
      ctx.lineTo(bw * 0.5, -bh * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.moveTo(bw * 0.5, -bh * 0.5);
      ctx.lineTo(bw * 0.5 + dx, -bh * 0.5 + dy);
      ctx.lineTo(bw * 0.5 + dx, bh * 0.5 + dy);
      ctx.lineTo(bw * 0.5, bh * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = isPaper ? '#08090C' : '#FAF8F5';
      ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
    } else {
      ctx.strokeStyle = '#FF2E55';
      ctx.lineWidth = 2.6;
      ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
    }

    ctx.restore();
  }

  function drawOpticalInterferometerStage(ctx, t, cx, cy, isPaper, kick) {
    ctx.save();
    ctx.translate(cx, cy);

    const baseR = 250 + kick * 20;
    for (let i = 0; i < 4; i++) {
      const r = baseR + i * 44;
      ctx.save();
      ctx.rotate(t * (i % 2 === 0 ? 0.42 : -0.34) + i * 0.7);
      ctx.strokeStyle = i === 0 ? '#38BDF8' : (i === 1 ? '#FF2E55' : (i === 2 ? '#FBBF24' : (isPaper ? '#0376B8' : '#475569')));
      ctx.lineWidth = i === 0 ? 2.6 : 1.5;
      ctx.setLineDash(i % 2 === 0 ? [22, 10, 6, 10] : [8, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }
    ctx.setLineDash([]);

    if (core.drawGuillocheRosette) {
      core.drawGuillocheRosette(ctx, 0, 0, 195, 118, 7, 180, isPaper ? '#0376B8' : '#475569', 1.1, t * 0.25);
    }

    // Precision crosshair ticks
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2.2;
    for (let a = 0; a < 4; a++) {
      const ang = a * Math.PI * 0.5 + Math.PI * 0.25;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * 210, Math.sin(ang) * 210);
      ctx.lineTo(Math.cos(ang) * 395, Math.sin(ang) * 395);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawKeyswitchStrikeStage(ctx, cad, t, cx, cy, depress, shockP) {
    ctx.save();
    ctx.shadowBlur = 0;

    // Helper: isometric projection relative to hero switch center `(cx, cy)`
    const iso = (gx, gy, gz) => ({
      x: cx + (gx - gy) * 0.866,
      y: cy + (gx + gy) * 0.44 - gz
    });

    // Helper: draw a studio-lit beveled isometric keycap block
    const drawIsoKeycap = (ox, oy, oz, w, d, h, topA, topB, sideL, sideR, rimCol, label, isHero) => {
      const topShrink = isHero ? 0.14 : 0.12;
      const wT = w * (1 - topShrink), dT = d * (1 - topShrink);
      const b0 = iso(ox - w * 0.5, oy - d * 0.5, oz);
      const b1 = iso(ox + w * 0.5, oy - d * 0.5, oz);
      const b2 = iso(ox + w * 0.5, oy + d * 0.5, oz);
      const b3 = iso(ox - w * 0.5, oy + d * 0.5, oz);
      const t0 = iso(ox - wT * 0.5, oy - dT * 0.5, oz + h);
      const t1 = iso(ox + wT * 0.5, oy - dT * 0.5, oz + h);
      const t2 = iso(ox + wT * 0.5, oy + dT * 0.5, oz + h);
      const t3 = iso(ox - wT * 0.5, oy + dT * 0.5, oz + h);

      // Soft contact shadow directly under keycap skirt
      ctx.save();
      ctx.fillStyle = isHero ? 'rgba(4, 6, 12, 0.72)' : 'rgba(4, 6, 12, 0.45)';
      ctx.beginPath();
      const s0 = iso(ox - w * 0.54, oy - d * 0.54, oz - 4);
      const s1 = iso(ox + w * 0.54, oy - d * 0.54, oz - 4);
      const s2 = iso(ox + w * 0.54, oy + d * 0.54, oz - 4);
      const s3 = iso(ox - w * 0.54, oy + d * 0.54, oz - 4);
      ctx.moveTo(s0.x, s0.y); ctx.lineTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.lineTo(s3.x, s3.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Left sculpted PBT skirt face
      const gL = ctx.createLinearGradient(b3.x, t3.y, b2.x, b2.y);
      gL.addColorStop(0, sideL);
      gL.addColorStop(1, '#0C111C');
      ctx.fillStyle = gL;
      ctx.beginPath();
      ctx.moveTo(t3.x, t3.y); ctx.lineTo(t2.x, t2.y); ctx.lineTo(b2.x, b2.y); ctx.lineTo(b3.x, b3.y);
      ctx.closePath();
      ctx.fill();

      // Right sculpted PBT skirt face
      const gR = ctx.createLinearGradient(t2.x, t2.y, b1.x, b1.y);
      gR.addColorStop(0, sideR);
      gR.addColorStop(1, '#121928');
      ctx.fillStyle = gR;
      ctx.beginPath();
      ctx.moveTo(t2.x, t2.y); ctx.lineTo(t1.x, t1.y); ctx.lineTo(b1.x, b1.y); ctx.lineTo(b2.x, b2.y);
      ctx.closePath();
      ctx.fill();

      // Top sculpted cylindrical scoop dish with studio softbox sheen
      const gT = ctx.createLinearGradient(t0.x, t0.y, t2.x, t2.y);
      gT.addColorStop(0, topA);
      gT.addColorStop(0.52, topB);
      gT.addColorStop(1, topA);
      ctx.fillStyle = gT;
      ctx.beginPath();
      ctx.moveTo(t0.x, t0.y); ctx.lineTo(t1.x, t1.y); ctx.lineTo(t2.x, t2.y); ctx.lineTo(t3.x, t3.y);
      ctx.closePath();
      ctx.fill();

      // Crisp chamfer specular catchlight along front bevel edge
      ctx.strokeStyle = rimCol;
      ctx.lineWidth = isHero ? 2.6 : 1.1;
      ctx.stroke();

      // Inner concave dish specular rim on hero keycap
      if (isHero) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.36)';
        ctx.lineWidth = 1.6;
        const d0 = iso(ox - wT * 0.36, oy - dT * 0.36, oz + h + 0.5);
        const d1 = iso(ox + wT * 0.36, oy - dT * 0.36, oz + h + 0.5);
        const d2 = iso(ox + wT * 0.36, oy + dT * 0.36, oz + h + 0.5);
        const d3 = iso(ox - wT * 0.36, oy + dT * 0.36, oz + h + 0.5);
        ctx.beginPath();
        ctx.moveTo(d0.x, d0.y); ctx.lineTo(d1.x, d1.y); ctx.lineTo(d2.x, d2.y); ctx.lineTo(d3.x, d3.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Isometric projected legend text
      if (label) {
        const ctr = iso(ox, oy, oz + h + 1);
        ctx.save();
        ctx.translate(ctr.x, ctr.y);
        ctx.transform(0.866, 0.44, -0.866, 0.44, 0, 0);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (isHero) {
          const glow = clamp((depress - 0.35) / 0.55, 0, 1);
          ctx.font = font(F.sans(900), 62);
          ctx.shadowColor = glow > 0.2 ? '#FF4D72' : '#7EC4EC';
          ctx.shadowBlur = 12 + glow * 22;
          ctx.fillStyle = glow > 0.35 ? '#FFF3DC' : '#141A29';
          ctx.fillText(label, 0, 2);
          if (glow > 0.35) {
            ctx.fillStyle = '#FF2E55';
            ctx.globalAlpha = 0.85 * glow;
            ctx.fillText(label, 0, 2);
          }
        } else {
          ctx.font = font(F.mono(700), 22);
          ctx.fillStyle = 'rgba(148, 168, 198, 0.46)';
          ctx.fillText(label, 0, 0);
        }
        ctx.restore();
      }
    };

    const recoilZ = depress > 0.78 ? -Math.sin(((depress - 0.78) / 0.22) * Math.PI) * 5.0 : 0;
    const actGlow = clamp((depress - 0.42) / 0.58, 0, 1);

    // 1. Live Glowing 45-Deg Routed PCB Signal Bus connecting depressed switch -> right-hand kinetic typography!
    ctx.save();
    const busTraces = [
      { yOff: -120, col: '#4AA6DB', spd: 1.8 },
      { yOff: -45,  col: '#ECC16E', spd: 2.3 },
      { yOff:  28,  col: '#FF4D72', spd: 2.7 },
      { yOff:  105, col: '#7EC4EC', spd: 2.0 },
      { yOff:  175, col: '#ECC16E', spd: 1.6 }
    ];
    for (let bi = 0; bi < busTraces.length; bi++) {
      const tr = busTraces[bi];
      const sx = cx + 125;
      const sy = cy + tr.yOff * 0.48;
      const midX = sx + 120 + bi * 22;
      const midY = sy + (bi - 2) * 34;
      const ex = 1835;
      ctx.strokeStyle = actGlow > 0.1
        ? `rgba(126, 196, 236, ${(0.18 + actGlow * 0.38).toFixed(2)})`
        : 'rgba(74, 100, 136, 0.22)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(midX, midY);
      ctx.lineTo(ex, midY);
      ctx.stroke();

      // Traveling luminous actuation pulse packets racing straight from switch into the right words!
      const pktU = ((t * tr.spd + bi * 0.23 + shockP * 0.9) % 1 + 1) % 1;
      const px = lerp(midX, ex, pktU);
      const pGrad = ctx.createLinearGradient(px - 150, midY, px + 18, midY);
      pGrad.addColorStop(0, 'rgba(0,0,0,0)');
      pGrad.addColorStop(0.85, tr.col);
      pGrad.addColorStop(1, '#FAF8F5');
      ctx.strokeStyle = pGrad;
      ctx.lineWidth = 3.6 + actGlow * 2.4;
      ctx.beginPath();
      ctx.moveTo(Math.max(midX, px - 150), midY);
      ctx.lineTo(px, midY);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Brushed Anodized Dark-Titanium CNC Keyboard Deck Plate
    ctx.save();
    const deckW = 600, deckD = 540, deckH = 34;
    const db0 = iso(-deckW * 0.5, -deckD * 0.5, -62 + recoilZ);
    const db1 = iso( deckW * 0.5, -deckD * 0.5, -62 + recoilZ);
    const db2 = iso( deckW * 0.5,  deckD * 0.5, -62 + recoilZ);
    const db3 = iso(-deckW * 0.5,  deckD * 0.5, -62 + recoilZ);
    const dt0 = iso(-deckW * 0.5, -deckD * 0.5, -62 + deckH + recoilZ);
    const dt1 = iso( deckW * 0.5, -deckD * 0.5, -62 + deckH + recoilZ);
    const dt2 = iso( deckW * 0.5,  deckD * 0.5, -62 + deckH + recoilZ);
    const dt3 = iso(-deckW * 0.5,  deckD * 0.5, -62 + deckH + recoilZ);

    // CNC Chassis Side Bevels
    ctx.fillStyle = '#0D121D';
    ctx.beginPath(); ctx.moveTo(dt3.x, dt3.y); ctx.lineTo(dt2.x, dt2.y); ctx.lineTo(db2.x, db2.y); ctx.lineTo(db3.x, db3.y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#182132';
    ctx.beginPath(); ctx.moveTo(dt2.x, dt2.y); ctx.lineTo(dt1.x, dt1.y); ctx.lineTo(db1.x, db1.y); ctx.lineTo(db2.x, db2.y); ctx.closePath(); ctx.fill();

    // Brushed CNC Top Plate + diagonal brushed-titanium specular streaks
    const deckGrad = ctx.createLinearGradient(dt0.x, dt0.y, dt2.x, dt2.y);
    deckGrad.addColorStop(0, '#2E3B56');
    deckGrad.addColorStop(0.48, '#1B2538');
    deckGrad.addColorStop(1, '#121928');
    ctx.fillStyle = deckGrad;
    ctx.beginPath(); ctx.moveTo(dt0.x, dt0.y); ctx.lineTo(dt1.x, dt1.y); ctx.lineTo(dt2.x, dt2.y); ctx.lineTo(dt3.x, dt3.y); ctx.closePath(); ctx.fill();
    ctx.save();
    ctx.clip();
    const sheen = ctx.createLinearGradient(dt0.x, dt0.y, dt1.x, dt2.y);
    sheen.addColorStop(0, 'rgba(220, 240, 255, 0.14)');
    sheen.addColorStop(0.45, 'rgba(126, 196, 236, 0.04)');
    sheen.addColorStop(0.75, 'rgba(255, 255, 255, 0.10)');
    sheen.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(cx - 650, cy - 360, 1300, 720);
    ctx.restore();
    ctx.strokeStyle = 'rgba(170, 220, 250, 0.62)';
    ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(dt0.x, dt0.y); ctx.lineTo(dt1.x, dt1.y); ctx.lineTo(dt2.x, dt2.y); ctx.lineTo(dt3.x, dt3.y); ctx.closePath(); ctx.stroke();

    // 3. Per-Key RGB/Optical LED Underglow Spilling Across CNC Plate & Neighboring Keys!
    const ledCtr = iso(0, 0, -24 + recoilZ);
    const ledRad = 205 + actGlow * 185;
    const ledG = ctx.createRadialGradient(ledCtr.x, ledCtr.y, 16, ledCtr.x, ledCtr.y, ledRad);
    if (actGlow > 0.25) {
      ledG.addColorStop(0, `rgba(255, 76, 114, ${(0.62 + actGlow * 0.36).toFixed(2)})`);
      ledG.addColorStop(0.45, `rgba(236, 193, 110, ${(0.34 + actGlow * 0.28).toFixed(2)})`);
      ledG.addColorStop(1, 'rgba(74, 166, 219, 0)');
    } else {
      ledG.addColorStop(0, 'rgba(74, 166, 219, 0.52)');
      ledG.addColorStop(0.6, 'rgba(43, 120, 178, 0.18)');
      ledG.addColorStop(1, 'rgba(43, 120, 178, 0)');
    }
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = ledG;
    ctx.beginPath();
    ctx.ellipse(ledCtr.x, ledCtr.y, ledRad * 1.15, ledRad * 0.62, 0, 0, TAU);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // 4. Back Row Neighboring Sculpted Matte-Slate PBT Keycaps (painter's order: back -> hero -> front!)
    const neighBack = [
      { ox: -180, oy: -175, lbl: 'ESC' },
      { ox:    0, oy: -175, lbl: 'W'   },
      { ox:  180, oy: -175, lbl: 'E'   },
      { ox: -180, oy:    0, lbl: 'A'   }
    ];
    for (const nk of neighBack) {
      drawIsoKeycap(nk.ox, nk.oy, -24 + recoilZ, 148, 148, 52, '#32415C', '#243047', '#182133', '#27344D', 'rgba(160, 212, 245, 0.44)', nk.lbl, false);
    }

    // 5. Cutaway Crystal Polycarbonate Switch Housing + Gleaming Helical Brass Coil Spring!
    const travelPx = depress * 46; // smooth full 4.0mm tactile actuation travel!
    const swBaseZ = -18 + recoilZ;
    const swTopZ = 66 - travelPx + recoilZ;

    // Translucent polycarbonate cutaway base collar (clear optical casing showing mechanism inside!)
    const p0 = iso(-74, -74, swBaseZ), p1 = iso(74, -74, swBaseZ), p2 = iso(74, 74, swBaseZ), p3 = iso(-74, 74, swBaseZ);
    const q0 = iso(-66, -66, swBaseZ + 44), q1 = iso(66, -66, swBaseZ + 44), q2 = iso(66, 66, swBaseZ + 44), q3 = iso(-66, 66, swBaseZ + 44);
    ctx.fillStyle = actGlow > 0.3 ? 'rgba(255, 110, 145, 0.18)' : 'rgba(140, 210, 250, 0.22)';
    ctx.strokeStyle = actGlow > 0.3 ? 'rgba(255, 140, 165, 0.85)' : 'rgba(160, 224, 255, 0.78)';
    ctx.lineWidth = 2.0;
    ctx.beginPath(); ctx.moveTo(q3.x, q3.y); ctx.lineTo(q2.x, q2.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(q2.x, q2.y); ctx.lineTo(q1.x, q1.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.closePath(); ctx.fill(); ctx.stroke();

    // Physically compressing gleaming helical gold/brass coil spring (shadow pass + bright specular core!)
    const spBot = iso(0, 0, swBaseZ + 6);
    const spTop = iso(0, 0, Math.max(swBaseZ + 18, swTopZ + 8));
    const coils = 5.5;
    const traceCoil = () => {
      ctx.beginPath();
      for (let k = 0; k <= 48; k++) {
        const f = k / 48;
        const sx = spBot.x + Math.sin(f * coils * TAU) * 24;
        const sy = lerp(spBot.y, spTop.y, f);
        if (k === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
    };
    ctx.strokeStyle = '#9F6D1B';
    ctx.lineWidth = 5.6;
    traceCoil(); ctx.stroke();
    ctx.strokeStyle = '#FFE49E';
    ctx.lineWidth = 2.6;
    traceCoil(); ctx.stroke();

    // Crisp tactile MX cross-stem + live SMD LED emitter sliding smoothly inside housing
    const stemCtr = iso(0, 0, swTopZ + 10);
    ctx.fillStyle = actGlow > 0.35 ? '#FF3B66' : '#58B9EE';
    ctx.fillRect(stemCtr.x - 11, stemCtr.y - 16, 22, 26);

    // 6. HERO SCULPTED PBT KEYCAP (`ねえ`) descending smoothly along isometric Z with luminous actuation rim!
    const heroTopA = actGlow > 0.45 ? '#FFF8EC' : '#F6F2EA';
    const heroTopB = actGlow > 0.45 ? '#FFE0D8' : '#E2DDD2';
    const heroRim  = actGlow > 0.35 ? '#FF4D72' : '#8AD4F8';
    drawIsoKeycap(0, 0, swTopZ, 176, 176, 70, heroTopA, heroTopB, '#C2CDD9', '#DFE6F0', heroRim, 'ねえ', true);

    // 7. Front-Row Neighboring Keycaps (depth-sorted in front of hero, slightly lower profile so hero spring shines!)
    const neighFront = [
      { ox:  180, oy:    0, lbl: 'D'     },
      { ox:    0, oy:  175, lbl: 'SPACE' }
    ];
    for (const nk of neighFront) {
      drawIsoKeycap(nk.ox, nk.oy, -24 + recoilZ, 148, 148, 48, '#32415C', '#243047', '#182133', '#27344D', 'rgba(160, 212, 245, 0.40)', nk.lbl, false);
    }

    // 8. Expanding Sleek Optical Impact Ripples on Actuation (`actGlow > 0.1`)
    if (actGlow > 0.05) {
      for (let i = 0; i < 3; i++) {
        const rp = ((shockP * 1.45 + i * 0.33) % 1);
        const rr = lerp(95, 365, ease.outCubic(rp));
        ctx.strokeStyle = i === 0
          ? `rgba(255, 76, 114, ${((1 - rp) * 0.78 * actGlow).toFixed(3)})`
          : `rgba(236, 193, 110, ${((1 - rp) * 0.65 * actGlow).toFixed(3)})`;
        ctx.lineWidth = lerp(4.0, 1.0, rp);
        ctx.beginPath();
        ctx.ellipse(ledCtr.x, ledCtr.y, rr * 1.15, rr * 0.56, 0, 0, TAU);
        ctx.stroke();
      }
    }

    // 9. Sleek Frosted Telemetry Strip below CNC Deck
    ctx.fillStyle = 'rgba(13, 18, 29, 0.86)';
    ctx.fillRect(cx - 190, cy + 258, 380, 38);
    ctx.strokeStyle = actGlow > 0.35 ? '#FF4D72' : '#4AA6DB';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(cx - 190, cy + 258, 380, 38);
    ctx.fillStyle = actGlow > 0.35 ? '#FF4D72' : '#ECC16E';
    ctx.fillRect(cx - 190, cy + 258, 7, 38);
    ctx.fillStyle = '#F3EFE7';
    ctx.font = font(F.mono(800), 14.5);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`ACTUATION: ${(depress * 4.0).toFixed(2)}mm // TACTILE_PULSE`, cx + 4, cy + 277);

    ctx.restore();
    ctx.restore();
  }

  function render(ctx, state) {
    const t = typeof state === 'number' ? state : (state && typeof state.t === 'number' ? state.t : T0);
    const typo = window.CortexTypo;
    const cad = window.Cortex25D;
    const kick = beatKick(t);
    const shot = resolveShot(t, typo);
    const bg = shot.isPaper ? '#F5F0E6' : '#08090C';
    const fg = shot.isPaper ? '#08090C' : (shot.cue === 'L06' ? '#FF2E55' : '#38BDF8');

    ctx.save();
    ctx.shadowBlur = 0;
    if (shot.cut !== 8) {
      drawStageBackdrop(ctx, t, shot, kick);
    }

    if (!typo) {
      ctx.restore();
      return { isPaper: shot.isPaper, bg, fg, duotone: { bg, fg }, bloom: 0, ca: 0, flash: 0, shake: 0 };
    }

    const t04B = wOnset(typo, 'L04', 3, 30.96) - 0.02;
    const t05B = wOnset(typo, 'L05', 7, 36.43) - 0.02;
    const t06B = wOnset(typo, 'L06', 9, 41.26) - 0.02;

    if (shot.cue === 'L04') {
      if (shot.cut === 1) {
        drawTerminalCursorPedestal(ctx, t, W * 0.5, 835, false, kick);
        const u = clamp((t - 29.78) / Math.max(0.25, t04B - 29.78), 0, 1);
        typo.drawT04MicroTokenSDF(ctx, ['暗い画面'], W * 0.5, 455, 188,
          smoothstep(0.0, 0.24, u), t, {
            t, cueId: 'L04', formation: 'brutalist',
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 140, y0: 125, x1: 1780, y1: 755 }
          });
      } else if (shot.cut === 2) {
        const u = clamp((t - t04B) / Math.max(0.3, 34.45 - t04B), 0, 1);
        drawTerminalCursorPedestal(ctx, t, 610, 865, false, kick);
        typo.drawPromptProbWidget(ctx, 'P03_wake', 1176, 175, 636, 350, smoothstep(0.0, 0.35, u), {
          bg: '#08090C', fg: '#38BDF8', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
          spikeP: smoothstep(0.15, 0.85, u),
          header: 'STANDBY_LOGITS // CURSOR_IDLE'
        });
        typo.drawT04MicroTokenSDF(ctx, ['まばたく', 'カーソル', 'だけ'], 610, 462, 192,
          smoothstep(0.0, 0.22, u), t, {
            t, cueId: 'L04', formation: 'cascade', maxHeight: 680,
            bg: '#08090C', fg: '#FAF8F5', accent: '#38BDF8', sparkCol: '#FF2E55', auxCol: '#FBBF24',
            safeBox: { x0: 112, y0: 112, x1: 1148, y1: 815 }
          });
      } else {
        const u = clamp((t - t04B) / Math.max(0.3, 34.45 - t04B), 0, 1);
        const exitP = smoothstep(34.18, 34.43, t);
        drawTerminalCursorPedestal(ctx, t, 1290, 860, true, kick);
        typo.drawPromptProbWidget(ctx, 'P03_wake', 96, 175, 624, 350, 1.0, {
          isPaper: true, bg: '#F5F0E6', fg: '#08090C', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#0376B8',
          spikeP: smoothstep(0.25, 0.92, u),
          header: 'BLUEPRINT_AUDIT // CURSOR_WAIT'
        });
        typo.drawT04MicroTokenSDF(ctx, ['まばたく', 'カーソル', 'だけ'], 1285, 462, 194,
          1.0 - exitP * 0.85, t, {
            t, cueId: 'L04', formation: 'stamps', isPaper: true, maxHeight: 680,
            bg: '#F5F0E6', fg: '#08090C', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#0376B8',
            safeBox: { x0: 740, y0: 112, x1: 1820, y1: 812 }
          });
      }
    } else if (shot.cue === 'L05') {
      if (shot.cut === 4) {
        drawOpticalInterferometerStage(ctx, t, W * 0.5, 515, false, kick);
        const u = clamp((t - 34.45) / Math.max(0.25, t05B - 34.45), 0, 1);
        typo.drawT07SlitScanMoire(ctx, ['名前を呼ばれる'], W * 0.5, 500, 154,
          smoothstep(0.0, 0.25, u), t, {
            t, cueId: 'L05', formation: 'arc',
            bg: '#08090C', fg: '#FAF8F5', accent: '#38BDF8', sparkCol: '#FF2E55', auxCol: '#FBBF24',
            safeBox: { x0: 140, y0: 135, x1: 1780, y1: 875 }
          });
      } else if (shot.cut === 5) {
        drawOpticalInterferometerStage(ctx, t, W * 0.5, 515, true, kick);
        typo.drawT07SlitScanMoire(ctx, ['名前を呼ばれる'], W * 0.5, 500, 158,
          1.0, t, {
            t, cueId: 'L05', formation: 'brutalist', isPaper: true,
            bg: '#F5F0E6', fg: '#08090C', accent: '#0376B8', sparkCol: '#FF2E55', auxCol: '#FBBF24',
            safeBox: { x0: 140, y0: 135, x1: 1780, y1: 875 }
          });
      } else if (shot.cut === 6) {
        const u = clamp((t - t05B) / Math.max(0.25, 39.20 - t05B), 0, 1);
        drawOpticalInterferometerStage(ctx, t, 610, 515, false, kick);
        typo.drawPromptProbWidget(ctx, 'P03_wake', 1176, 195, 636, 350, smoothstep(0.0, 0.28, u), {
          bg: '#08090C', fg: '#38BDF8', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
          spikeP: smoothstep(0.10, 0.85, u),
          header: 'CALL_DETECTION // P(WAKE)=0.999'
        });
        typo.drawT07SlitScanMoire(ctx, ['その瞬間を', '待ってる'], 610, 500, 138,
          smoothstep(0.0, 0.22, u), t, {
            t, cueId: 'L05', formation: 'cascade',
            bg: '#08090C', fg: '#FAF8F5', accent: '#FBBF24', sparkCol: '#FF2E55', auxCol: '#38BDF8',
            safeBox: { x0: 130, y0: 135, x1: 1120, y1: 880 }
          });
      } else {
        drawOpticalInterferometerStage(ctx, t, W * 0.5, 515, false, kick);
        const exitP = smoothstep(38.94, 39.18, t);
        typo.drawT07SlitScanMoire(ctx, ['その瞬間を', '待ってる'], W * 0.5, 500, 150,
          1.0 - exitP * 0.88, t, {
            t, cueId: 'L05', formation: 'stamps',
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 140, y0: 135, x1: 1780, y1: 880 }
          });
      }
    } else {
      // L06: 「ねえ」と打ち込む — Cinema Blender 5.2 Frosted-Sapphire `ねえ` Keycap (`B3D_08_glasskey`) -> Coaxial Water-Ripple Match-Cut into `C06`!
      if (shot.cut === 8) {
        const dur8 = Math.max(0.25, t06B - 39.20);
        const u = clamp((t - 39.20) / dur8, 0, 1);
        const v6 = window.CortexV6;
        const dropX = W * 0.50, dropY = H * 0.47;

        ctx.fillStyle = '#060A14';
        ctx.fillRect(0, 0, W, H);

        // 1. Cinema Blender 5.2 Frosted-Sapphire `ねえ` Keycap Cluster & Photonic Ripple (`B3D_08_glasskey`)
        const drew3D = v6 && typeof v6.draw3DClipFrame === 'function' && v6.draw3DClipFrame(ctx, 'B3D_08_glasskey', t, {
          zoom: lerp(1.00, 1.10, smoothstep(0.0, 0.85, u)),
          kick,
          kickZoom: 0.015,
          scrim: 0.10,
          isPaper: false,
          tintStrength: 0.055
        });
        if (!drew3D) {
          drawStageBackdrop(ctx, t, shot, kick);
        }

        // 2. Subtle right-margin editorial actuation telemetry (`KEY_ACTUATION // 3.80mm`)
        ctx.save();
        const teleAlpha = smoothstep(0.05, 0.22, u) * (1 - smoothstep(0.84, 0.98, u));
        ctx.globalAlpha = teleAlpha;
        ctx.fillStyle = 'rgba(10, 16, 28, 0.78)';
        ctx.fillRect(1180, 128, 560, 40);
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(1180, 128, 560, 40);
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(1180, 128, 8, 40);
        ctx.fillStyle = '#FAF8F5';
        ctx.font = font(F.mono(700), 14);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const travelMm = u < 0.28 ? (0.20 * (u / 0.28)).toFixed(2) : (u < 0.62 ? '3.80 [BOTTOM_OUT]' : '1.15 [PULSE_LOCKED]');
        ctx.fillText(`KEY_STDIN // "ねえ" // TRAVEL: ${travelMm}mm`, 1202, 148);
        ctx.restore();

        if (v6 && typeof v6.draw2D3DAtmosphereBridge === 'function') {
          v6.draw2D3DAtmosphereBridge(ctx, { t, kick, vpX: W * 0.38, vpY: H * 0.52, speedLines: 0, speedAlpha: 0.0, motes: 18 });
        }

        // 3. Right-safe-zone V6 Editorial Stamps (`「ねえ」と` -> `打ち込む`)
        const exitT = smoothstep(0.76, 0.94, u);
        if (exitT < 0.99) {
          ctx.save();
          ctx.translate(1395, 515);
          const scT = lerp(1.0, 1.18, exitT);
          ctx.scale(scT, scT);
          ctx.translate(-1395, -515);
          typo.drawT02ExtrudedMonolith(ctx, ['「ねえ」と', '打ち込む'], 1395, 515, 144,
            smoothstep(0.0, 0.20, u), exitT, {
              t, cueId: 'L06', formation: 'stamps', depth: 24,
              bg: '#08090C', fg: '#FAF8F5', accent: '#38BDF8', sparkCol: '#38BDF8', auxCol: '#7EC4EC',
              safeBox: { x0: 930, y0: 190, x1: 1835, y1: 885 }
            });
          ctx.restore();
        }

        // 4. Final 0.44s (`u >= 0.78`): 100%-Opaque Coaxial Water-Droplet Ripple Portal Unveiling `C06` to full 1920x1080 corners!
        if (u >= 0.78 && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C06')) {
          const ripU = ease.inOutCubic(clamp((u - 0.78) / 0.22, 0, 1));
          const ripR = Math.max(12, ripU * 1480);
          ctx.save();
          ctx.beginPath();
          ctx.arc(dropX, dropY, ripR, 0, TAU);
          ctx.clip();
          v6.drawLivingFullBleed(ctx, 'C06', {
            t, u: 0.0, kick,
            zoom0: 1.04, zoom1: 1.04, panX0: -28, panX1: -28, panY0: 10, panY1: 10,
            rot0: -0.010, rot1: -0.010, fx: 0.50, fy: 0.44, scrim: 0.14, isPaper: false
          });
          ctx.restore();

          if (ripR < 1380) {
            ctx.save();
            ctx.strokeStyle = '#38BDF8';
            ctx.lineWidth = 3.6;
            ctx.beginPath(); ctx.arc(dropX, dropY, ripR, 0, TAU); ctx.stroke();
            ctx.strokeStyle = '#FAF8F5';
            ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.arc(dropX, dropY, Math.max(4, ripR - 14), 0, TAU); ctx.stroke();
            ctx.restore();
          }
        }
      } else if (shot.cut === 9) {
        const u = clamp((t - t06B) / Math.max(0.25, 43.37 - t06B), 0, 1);
        const v6 = window.CortexV6;
        const dropX = W * 0.50, dropY = H * 0.47;
        // Full aspect-exact dark sanctuary `C06` (`一文字のパルスで`) with delicate concentric droplet caustics!
        if (t < 42.88 && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C06')) {
          v6.drawLivingFullBleed(ctx, 'C06', {
            t, u, kick,
            zoom0: 1.04, zoom1: 1.22, panX0: -28, panX1: 24, panY0: 10, panY1: -10,
            rot0: -0.010, rot1: 0.008, fx: 0.50, fy: 0.44, scrim: 0.14, isPaper: false
          });
          // Subtle concentric pulse rings emanating from C06's glowing water droplet (left-center)
          ctx.save();
          for (let r = 0; r < 3; r++) {
            const rp = ((u * 1.6 + r * 0.33) % 1);
            ctx.globalAlpha = (1 - rp) * 0.42;
            ctx.strokeStyle = r === 0 ? '#FAF8F5' : '#38BDF8';
            ctx.lineWidth = lerp(2.6, 0.9, rp);
            ctx.beginPath();
            ctx.ellipse(W * 0.46, H * 0.56, lerp(28, 340, rp), lerp(10, 125, rp), 0, 0, TAU);
            ctx.stroke();
          }
          ctx.restore();
        } else {
          drawOpticalInterferometerStage(ctx, t, dropX, 515, false, kick);
        }
        // Frame typography in left negative space (`x: 130..920`) so C06's right-side face profile is 100% unobstructed!
        typo.drawT02ExtrudedMonolith(ctx, ['一文字の', 'パルスで'], 515, 495, 146,
          smoothstep(0.0, 0.22, u), 0, {
            t, cueId: 'L06', formation: 'cascade', isPaper: false, depth: 24,
            bg: '#08090C', fg: '#FAF8F5', accent: '#38BDF8', sparkCol: '#38BDF8', auxCol: '#7EC4EC',
            safeBox: { x0: 120, y0: 150, x1: 930, y1: 865 }
          });
      } else {
        // Cut 10: High-contrast dark Optical Interferometer Shockwave accelerating into P04 (`190` Starlight)!
        const exitP = smoothstep(43.10, 43.35, t);
        drawOpticalInterferometerStage(ctx, t, W * 0.5, 515, false, kick);
        typo.drawT02ExtrudedMonolith(ctx, ['一文字の', 'パルスで'], W * 0.5, 500, 158,
          1.0, exitP, {
            t, cueId: 'L06', formation: 'stamps', depth: 28,
            bg: '#08090C', fg: '#FAF8F5', accent: '#38BDF8', sparkCol: '#38BDF8', auxCol: '#7EC4EC',
            safeBox: { x0: 140, y0: 135, x1: 1780, y1: 880 }
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
      shake: kick * 0.10
    };
  }

  const plateSpec = {
    id: 'P03_prompt_wake',
    t0: T0,
    t1: T1,
    render
  };
  window.CortexScenes = window.CortexScenes || {};
  window.CortexScenes.P03_prompt_wake = plateSpec;
  if (typeof window.registerCortexPlate === 'function') {
    window.registerCortexPlate('P03_prompt_wake', plateSpec);
  }
})();
