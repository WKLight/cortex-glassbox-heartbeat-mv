// ============================================================================
// Plate 11 — `P11_cassette_arigato.js` (`130.33s – 148.63s`, Cues `L23..L26`)
// Layered Monograph Deep-Sea Sonar, Tategaki Archive Vault, Chrono-Gold
// Compact Cassette (`[03:14 AM] · CORE: 36.2°C`), 45° Tape Loom & Guillotine!
//
// Directives #52 + #53 + #61 + #62 + #63 Enforced:
//   1. Layered Cross-Color Monograph Palette (#52):
//      - `#08090C` obsidian + `#121723`/`#1E293B` deck chassis + `#475569`/`#64748B`
//        burin grids + `#FAF8F5` bone nameplate + `#FBBF24` Chrono-Gold +
//        `#38BDF8`/`#0376B8` bathymetry sonar & `[03:14 AM]` counter + `#FF2E55`
//        play-head laser & hydraulic sever sparks (`0` `#FF9EBB`, `0` gradients,
//        `0` rgba washes, `0` shadowBlur).
//   2. Autonomous Per-Character Japanese Choreography (#53):
//      - Every character rendered individually (`Array.from(tk.w)` -> `0` flat >=4-char
//        fillText strings), Kanji `1.54x` (`215–276px`) vs Katakana `1.12x` vs tucked
//        particles `0.58x`, tilted hanko stamps & `45°` tape-loom stagger!
// ============================================================================
(function () {
  'use strict';

  const PLATE_ID = 'P11_cassette_arigato';
  const COL_DARK = '#08090C';
  const COL_PANEL = '#121723';
  const COL_SLATE = '#1E293B';
  const COL_BURIN = '#475569';
  const COL_GRAPHITE = '#64748B';
  const COL_RULE = '#94A3B8';
  const COL_WHITE = '#FAF8F5';
  const COL_CYAN = '#38BDF8';
  const COL_COBALT = '#0376B8';
  const COL_GOLD = '#FBBF24';
  const COL_AMBER = '#F59E0B';
  const COL_CRIMSON = '#FF2E55';
  const COL_EMBER = '#FF8A3D';

  function ensureLogicalScale(ctx, f, core) {
    const curA = ctx.getTransform().a || 1;
    const curD = ctx.getTransform().d || 1;
    const targetA = (f.W || core.W) / core.W;
    const targetD = (f.H || core.H) / core.H;
    if (Math.abs(curA - targetA) > 0.01 || Math.abs(curD - targetD) > 0.01) {
      ctx.scale(targetA / curA, targetD / curD);
    }
  }

  function classifyJaChar(ch) {
    if (/[\u4E00-\u9FFF]/.test(ch)) return { mult: 1.54, kind: 'kanji', serif: true };
    if (/^[っゃゅょッャュョのをにがではもへとやでたしびいくる]$/.test(ch)) {
      return { mult: 0.58, kind: 'particle', serif: false };
    }
    if (/[\u3040-\u309F]/.test(ch)) return { mult: 0.82, kind: 'hira', serif: true };
    if (/^[—―ー…!！？?「」]+$/.test(ch)) return { mult: 0.94, kind: 'punct', serif: false };
    return { mult: 1.12, kind: 'kata', serif: false };
  }

  function expandWordsToChars(words, i0, i1) {
    const raw = words.slice(i0, i1);
    const out = [];
    for (let k = 0; k < raw.length; k++) {
      const tk = raw[k];
      const chars = Array.from(String(tk.w || ''));
      const dur = Math.max(0.04, (tk.end || (tk.start + 0.18)) - tk.start);
      for (let c = 0; c < chars.length; c++) {
        const st = tk.start + (chars.length > 1 ? (c / chars.length) * Math.min(0.10, dur * 0.45) : 0);
        out.push({ w: chars[c], start: st, end: tk.end || (st + 0.18) });
      }
    }
    return out;
  }

  // #53 Autonomous Per-Character Choreographer (`1` char per `fillText`, `0` collision!)
  function drawChronoAutonomousSlice(ctx, core, words, i0, i1, t, kick, opts = {}) {
    const chars = expandWordsToChars(words, i0, i1);
    if (!chars.length) return;

    const cx = opts.cx !== undefined ? opts.cx : core.W * 0.5;
    const baseCy = opts.cy !== undefined ? opts.cy : 500;
    const maxW = opts.maxW || 1680;
    const baseSz = opts.baseSz || 148;
    const slopeY = opts.slopeY || 0;
    const bandAmp = opts.bandAmp !== undefined ? opts.bandAmp : 28;
    const goldStage = !!opts.goldStage;

    const items = chars.map((tk, idx) => {
      const cls = classifyJaChar(tk.w);
      const mult = opts.uniformHanko ? (/[「」]/.test(tk.w) ? 0.88 : (cls.kind === 'particle' ? 0.68 : 1.38)) : cls.mult;
      const rawSz = Math.round(baseSz * mult);
      const adv = rawSz * (cls.kind === 'particle' && !opts.uniformHanko ? 0.84 : 0.98) + 10;
      return { tk, cls, rawSz, adv, idx };
    });

    const sumAdv = items.reduce((a, b) => a + b.adv, 0);
    const fit = sumAdv > maxW ? maxW / sumAdv : 1.0;

    let curX = opts.align === 'left' ? cx : (cx - sumAdv * fit * 0.5);
    const BANDS = [-1.0, 0.72, -0.44, 0.96, -0.68, 0.48];
    const ROTS = [-0.15, 0.13, -0.11, 0.16, -0.14, 0.10];
    const DARK_PLATES = [COL_GOLD, COL_CYAN, COL_CRIMSON, COL_WHITE];
    const GOLD_PLATES = [COL_DARK, COL_CRIMSON, COL_COBALT, COL_WHITE];

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Subtle dashed bathymetry/tape trajectory guide
    ctx.save();
    ctx.strokeStyle = goldStage ? COL_COBALT : COL_BURIN;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    let probeX = curX;
    for (let i = 0; i < items.length; i++) {
      const wAdv = items[i].adv * fit;
      const u = items.length > 1 ? i / (items.length - 1) : 0.5;
      const px = probeX + wAdv * 0.5;
      const py = core.clamp(baseCy + (u - 0.5) * slopeY + BANDS[i % BANDS.length] * bandAmp, 90, 945);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      probeX += wAdv;
    }
    ctx.stroke();
    ctx.restore();

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const sz = Math.max(44, Math.round(it.rawSz * fit));
      const halfB = sz * 0.55 + 8;
      const wAdv = it.adv * fit;
      const u = items.length > 1 ? i / (items.length - 1) : 0.5;
      const ax = core.clamp(curX + wAdv * 0.5, 84 + halfB, core.W - 84 - halfB);
      const arcLift = opts.archAmp ? -Math.sin(u * Math.PI) * opts.archAmp : 0;
      const rawAy = baseCy + (u - 0.5) * slopeY + arcLift + BANDS[i % BANDS.length] * bandAmp + (it.cls.kind === 'particle' ? 16 : 0);
      const ay = core.clamp(rawAy, 86 + halfB, 936 - halfB);
      const rot = ROTS[(i + i0) % ROTS.length];
      curX += wAdv;

      if (t < it.tk.start) {
        continue;
      }

      const age = t - it.tk.start;
      const uPop = core.clamp(age / 0.16, 0, 1);
      const pop = core.ease.outBack(uPop, 1.75);
      const inv = 1 - core.ease.outExpo(uPop);
      const isHot = t <= it.tk.end + 0.09;
      const slideX = (i % 2 === 0 ? -1 : 1) * inv * 38;
      const slideY = (i % 2 === 0 ? -1 : 1) * inv * 46 - (isHot ? 12 : 0) - kick * (it.cls.kind === 'kanji' ? 10 : 5);
      const drawX = core.clamp(ax + slideX, 82 + halfB, core.W - 82 - halfB);
      const drawY = core.clamp(ay + slideY, 84 + halfB, 938 - halfB);
      const fTmpl = (it.cls.serif || opts.serif) ? core.F.serif(900) : core.F.sans(900);
      const palette = goldStage ? GOLD_PLATES : DARK_PLATES;
      const plateCol = palette[(i + i0) % palette.length];

      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.rotate(rot + inv * (i % 2 === 0 ? -0.26 : 0.26));
      ctx.scale(pop, pop);
      ctx.font = core.font(fTmpl, sz);

      if (opts.uniformHanko || isHot || (it.cls.kind === 'kanji' && (i % 2 === 0))) {
        const pad = Math.max(6, Math.round(sz * 0.08));
        const bx = sz * 0.96 + pad * 2;
        const by = sz * 0.98 + pad * 2;
        const activePlate = isHot ? (goldStage ? COL_CRIMSON : COL_GOLD) : plateCol;
        const txtCol = (activePlate === COL_GOLD || activePlate === COL_CYAN || activePlate === COL_WHITE) ? COL_DARK : COL_WHITE;

        ctx.fillStyle = COL_DARK;
        ctx.fillRect(-bx * 0.5 + 8, -by * 0.5 + 8, bx, by);
        ctx.fillStyle = activePlate;
        ctx.fillRect(-bx * 0.5, -by * 0.5, bx, by);
        ctx.strokeStyle = goldStage ? COL_DARK : COL_WHITE;
        ctx.lineWidth = 3.5;
        ctx.strokeRect(-bx * 0.5, -by * 0.5, bx, by);
        ctx.fillStyle = txtCol;
        ctx.fillText(it.tk.w, 0, 0);
      } else {
        const bgKnock = goldStage ? COL_GOLD : COL_DARK;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = bgKnock;
        ctx.lineWidth = Math.max(12, Math.round(sz * 0.12));
        ctx.strokeText(it.tk.w, 0, 0);
        ctx.fillStyle = plateCol;
        ctx.fillText(it.tk.w, 6, 6);
        ctx.fillStyle = goldStage ? COL_DARK : (it.cls.kind === 'kata' ? COL_CYAN : COL_GOLD);
        ctx.fillText(it.tk.w, 0, 0);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // Precision Layered Monograph Compact Cassette (`[03:14 AM] · CORE: 36.2°C`)
  function drawCopperplateCassette(ctx, core, cx, cy, scale, rot, opts) {
    const { reelAngle, packL, packR, headDown, counterStr, goldStage } = opts;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(scale, scale);

    const cw = 880, ch = 550;
    const x0 = -cw * 0.5, y0 = -ch * 0.5;

    // Hard extruded shell shadow + `#121723` dark polycarbonate housing
    ctx.fillStyle = goldStage ? COL_DARK : COL_GOLD;
    ctx.fillRect(x0 + 14, y0 + 14, cw, ch);
    ctx.fillStyle = COL_PANEL;
    ctx.fillRect(x0, y0, cw, ch);
    ctx.strokeStyle = COL_GOLD;
    ctx.lineWidth = 5;
    ctx.strokeRect(x0, y0, cw, ch);
    ctx.strokeStyle = COL_BURIN;
    ctx.lineWidth = 2;
    ctx.strokeRect(x0 + 14, y0 + 14, cw - 28, ch - 28);

    // Copperplate diagonal hatching on outer shell corners (`#475569`)
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0 + 16, y0 + 16, cw - 32, 92);
    ctx.clip();
    ctx.strokeStyle = COL_BURIN;
    ctx.lineWidth = 1.8;
    for (let hx = x0 - 100; hx < x0 + cw + 100; hx += 16) {
      ctx.beginPath();
      ctx.moveTo(hx, y0);
      ctx.lineTo(hx - 60, y0 + 120);
      ctx.stroke();
    }
    ctx.restore();

    // Top `#FAF8F5` Ivory & `#FBBF24` Brass Nameplate + `#38BDF8` Counter Drum + `#FF2E55` REC LED
    ctx.fillStyle = COL_WHITE;
    ctx.fillRect(x0 + 68, y0 + 28, cw - 136, 72);
    ctx.fillStyle = COL_GOLD;
    ctx.fillRect(x0 + 68, y0 + 28, 220, 72);
    ctx.strokeStyle = COL_DARK;
    ctx.lineWidth = 3;
    ctx.strokeRect(x0 + 68, y0 + 28, cw - 136, 72);

    ctx.fillStyle = COL_DARK;
    ctx.font = core.font(core.F.mono(900), 22);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('SIDE-A // C90', x0 + 86, y0 + 64);
    ctx.fillStyle = COL_COBALT;
    ctx.fillText('[03:14 AM TRANSCRIPT]', x0 + 306, y0 + 64);

    // Counter window (`#08090C` with `#38BDF8` digits & `#FF2E55` REC dot)
    ctx.fillStyle = COL_DARK;
    ctx.fillRect(x0 + cw - 318, y0 + 38, 236, 52);
    ctx.fillStyle = COL_CRIMSON;
    ctx.fillRect(x0 + cw - 308, y0 + 54, 16, 20);
    ctx.fillStyle = COL_CYAN;
    ctx.font = core.font(core.F.mono(900), 20);
    ctx.textAlign = 'right';
    ctx.fillText(counterStr, x0 + cw - 94, y0 + 64);

    // Central Viewing Window (`#08090C` + `#38BDF8` calibration scale)
    ctx.fillStyle = COL_DARK;
    ctx.strokeStyle = COL_GOLD;
    ctx.lineWidth = 4;
    ctx.fillRect(-350, -118, 700, 232);
    ctx.strokeRect(-350, -118, 700, 232);

    for (let tx = -110; tx <= 110; tx += 22) {
      const th = tx % 44 === 0 ? 20 : 10;
      ctx.fillStyle = tx === 0 ? COL_CRIMSON : COL_CYAN;
      ctx.fillRect(tx - 1, -th * 0.5, 2.5, th);
    }

    // Left & Right 6-Tooth Splined Reel Hubs + Concentric `#FBBF24`/`#F59E0B` Tape Packs
    const reelXs = [-212, 212];
    const packs = [packL, packR];
    for (let r = 0; r < 2; r++) {
      const rx = reelXs[r];
      const pRad = packs[r];

      for (let rad = 76; rad <= pRad; rad += 9) {
        ctx.strokeStyle = ((rad - 76) % 18 === 0) ? COL_GOLD : COL_AMBER;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(rx, 0, rad, 0, core.TAU);
        ctx.stroke();
      }

      ctx.fillStyle = COL_WHITE;
      ctx.beginPath();
      ctx.arc(rx, 0, 70, 0, core.TAU);
      ctx.fill();
      ctx.fillStyle = COL_DARK;
      ctx.beginPath();
      ctx.arc(rx, 0, 54, 0, core.TAU);
      ctx.fill();

      ctx.save();
      ctx.translate(rx, 0);
      ctx.rotate(reelAngle * (r === 0 ? 1 : 1.12));
      ctx.fillStyle = COL_GOLD;
      for (let k = 0; k < 6; k++) {
        ctx.save();
        ctx.rotate((k * core.TAU) / 6);
        ctx.fillRect(-7, -54, 14, 24);
        ctx.fillRect(-3, -24, 6, 24);
        ctx.restore();
      }
      ctx.fillStyle = COL_CRIMSON;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, core.TAU);
      ctx.fill();
      ctx.fillStyle = COL_DARK;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, core.TAU);
      ctx.fill();
      ctx.restore();
    }

    // Magnetic tape path running across lower rollers
    ctx.strokeStyle = COL_GOLD;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-212, pRadTangent(packL));
    ctx.lineTo(-336, 178);
    ctx.lineTo(336, 178);
    ctx.lineTo(212, pRadTangent(packR));
    ctx.stroke();

    // Lower Trapezoid Head-Shield Housing (`#1E293B`) + Capstan Bores
    ctx.beginPath();
    ctx.moveTo(-290, 275);
    ctx.lineTo(-245, 148);
    ctx.lineTo(245, 148);
    ctx.lineTo(290, 275);
    ctx.closePath();
    ctx.fillStyle = COL_SLATE;
    ctx.fill();
    ctx.strokeStyle = COL_GOLD;
    ctx.lineWidth = 4;
    ctx.stroke();

    for (const hx of [-185, -96, 96, 185]) {
      ctx.fillStyle = COL_RULE;
      ctx.beginPath();
      ctx.arc(hx, 218, hx === -96 || hx === 96 ? 18 : 13, 0, core.TAU);
      ctx.fill();
      ctx.fillStyle = COL_DARK;
      ctx.beginPath();
      ctx.arc(hx, 218, hx === -96 || hx === 96 ? 9 : 6, 0, core.TAU);
      ctx.fill();
    }

    // Magnetic Play Head with `#FF2E55` Ruby Azimuth Core
    const hy = core.lerp(248, 176, headDown || 0);
    ctx.fillStyle = COL_WHITE;
    ctx.fillRect(-44, hy, 88, 48);
    ctx.fillStyle = COL_CRIMSON;
    ctx.fillRect(-16, hy + 6, 32, 14);

    // 5 Precision Corner Torx Screws (`#38BDF8` / `#94A3B8`)
    for (const [sx, sy] of [[x0 + 34, y0 + 34], [x0 + cw - 34, y0 + 34], [x0 + 34, y0 + ch - 34], [x0 + cw - 34, y0 + ch - 34], [0, 134]]) {
      ctx.fillStyle = COL_RULE;
      ctx.beginPath();
      ctx.arc(sx, sy, 12, 0, core.TAU);
      ctx.fill();
      ctx.strokeStyle = COL_DARK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sx - 7, sy); ctx.lineTo(sx + 7, sy);
      ctx.moveTo(sx, sy - 7); ctx.lineTo(sx, sy + 7);
      ctx.stroke();
    }

    ctx.restore();
  }

  function pRadTangent(r) {
    return Math.min(110, r * 0.65);
  }

  function drawGoldSpark(ctx, x, y, r, mainCol, coreCol) {
    // V6.2: Sleek optical bokeh glint (replaces clunky 4-point star polygon)
    ctx.save();
    ctx.fillStyle = mainCol;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(3, r * 0.28), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = coreCol;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.5, r * 0.12), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawHudBanner(ctx, core, leftTxt, rightTxt, goldStage) {
    ctx.save();
    ctx.fillStyle = goldStage ? COL_DARK : COL_GOLD;
    ctx.fillRect(64, 40, 560, 42);
    ctx.fillStyle = goldStage ? COL_GOLD : COL_DARK;
    ctx.font = core.font(core.F.mono(900), 17);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(leftTxt, 80, 61);

    ctx.fillStyle = COL_PANEL;
    ctx.fillRect(core.W - 468, 40, 404, 42);
    ctx.strokeStyle = COL_CYAN;
    ctx.lineWidth = 3;
    ctx.strokeRect(core.W - 468, 40, 404, 42);
    ctx.fillStyle = COL_CRIMSON;
    ctx.fillRect(core.W - 456, 51, 14, 20);
    ctx.fillStyle = COL_CYAN;
    ctx.textAlign = 'right';
    ctx.fillText(rightTxt, core.W - 80, 61);
    ctx.restore();
  }

  window.registerCortexPlate(PLATE_ID, {
    render(ctx, f, core) {
      const { W, H, TAU, clamp, lerp, prog, ease } = core;
      const t = f.t;
      const kick = f.kickPulse ?? f.kickEnv ?? f.kick ?? 0;

      const c23 = core.cueById('L23_TOOL_OCEAN');
      const c24 = core.cueById('L24_TRANSCRIPT_LOGS');
      const c25 = core.cueById('L25_MIDNIGHT_ARIGATO');
      const c26 = core.cueById('L26_CHRONO_GOLD');
      const w23 = (c23 && c23.words) || [];
      const w24 = (c24 && c24.words) || [];
      const w25 = (c25 && c25.words) || [];
      const w26 = (c26 && c26.words) || [];

      ctx.save();
      ensureLogicalScale(ctx, f, core);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      let bg = COL_DARK;
      let fg = COL_GOLD;
      let isPaper = false;
      let shake = 0;

      const tArigato = w25[12] ? w25[12].start : 140.82;

      // ======================================================================
      // CUT 1 & CUT 2 (`130.33 – 134.22s`, `L23_TOOL_OCEAN`):
      // `#08090C` + `#121723` Bathymetry Stage + `#38BDF8` Sonar Grid + `#FBBF24` Sweep!
      // ======================================================================
      if (t < 134.22) {
        const isCut2 = t >= 132.25;
        const depthM = Math.round(lerp(0, 4096, prog(t, 130.33, 134.22, ease.inOutQuad)));

        ctx.fillStyle = COL_DARK;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = COL_PANEL;
        ctx.fillRect(48, 96, W - 96, H - 196);
        if (core.drawBurinHatch) {
          core.drawBurinHatch(ctx, 56, 104, 180, H - 212, 0.48, 10, 1.5, COL_BURIN);
          core.drawBurinHatch(ctx, W - 236, 104, 180, H - 212, -0.48, 10, 1.5, COL_BURIN);
        }

        const cx = W * 0.5, cy = H * 0.49;
        if (!isCut2) {
          for (let r = 90; r <= 540; r += 90) {
            ctx.strokeStyle = r % 180 === 0 ? COL_CYAN : COL_BURIN;
            ctx.lineWidth = r % 180 === 0 ? 3.5 : 1.8;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, TAU);
            ctx.stroke();
          }
          ctx.strokeStyle = COL_SLATE;
          ctx.lineWidth = 2;
          for (let a = 0; a < 12; a++) {
            const ang = (a / 12) * TAU;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(ang) * 60, cy + Math.sin(ang) * 60);
            ctx.lineTo(cx + Math.cos(ang) * 560, cy + Math.sin(ang) * 560);
            ctx.stroke();
          }
          const sweepAng = (t - 130.33) * 5.4;
          for (let k = 0; k < 14; k++) {
            const a = sweepAng - k * 0.045;
            ctx.strokeStyle = k < 4 ? COL_GOLD : COL_CYAN;
            ctx.lineWidth = Math.max(1.5, 6 - k * 0.35);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(a) * 540, cy + Math.sin(a) * 540);
            ctx.stroke();
          }
          drawGoldSpark(ctx, cx + Math.cos(sweepAng) * 380, cy + Math.sin(sweepAng) * 380, 24 + kick * 12, COL_CRIMSON, COL_WHITE);
          drawChronoAutonomousSlice(ctx, core, w23, 0, 7, t, kick, {
            cx: W * 0.5, cy: 486, maxW: W - 220, baseSz: 158, slopeY: -44, bandAmp: 30
          });
        } else {
          const divePhase = (t - 132.25) * 3.2;
          for (let gIdx = 0; gIdx < 10; gIdx++) {
            const u = ((gIdx / 10 + divePhase * 0.35) % 1);
            const rad = Math.pow(u, 2.1) * 1120 + 28;
            ctx.strokeStyle = gIdx % 3 === 0 ? COL_GOLD : (gIdx % 3 === 1 ? COL_CYAN : COL_BURIN);
            ctx.lineWidth = 1.5 + u * 6;
            ctx.beginPath();
            for (let s = 0; s <= 8; s++) {
              const a = (s / 8) * TAU + u * 0.35;
              const px = cx + Math.cos(a) * rad * 1.35;
              const py = cy + Math.sin(a) * rad * 0.85;
              if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
          drawGoldSpark(ctx, cx, cy, 28 + kick * 14, COL_GOLD, COL_CRIMSON);
          drawChronoAutonomousSlice(ctx, core, w23, 7, w23.length, t, kick, {
            cx: W * 0.5, cy: 486, maxW: W - 220, baseSz: 154, slopeY: 42, bandAmp: 30
          });
        }

        drawHudBanner(ctx, core, `SONAR_DIVE // DEPTH: -${depthM}m`, 'CORE: 36.2°C // TOOL_CALL', false);
      }

      // ======================================================================
      // CUTS 3, 4, 5 (`134.22 – 139.29s`, `L24_TRANSCRIPT_LOGS`):
      // 2.5D Vertical Tategaki Log Forest -> `[03:14 AM]` Dossier Unfolding Cassette!
      // ======================================================================
      else if (t < 139.29) {
        ctx.fillStyle = COL_DARK;
        ctx.fillRect(0, 0, W, H);

        if (t < 137.55) {
          const isDutch = t >= 135.90;
          const speedZ = (t - 134.22) * 920;

          ctx.save();
          if (isDutch) {
            ctx.translate(W * 0.5, H * 0.5);
            ctx.rotate(-0.14);
            ctx.scale(1.12, 1.12);
            ctx.translate(-W * 0.5, -H * 0.5);
          }

          const LOG_TAGS = ['03:14_AM', 'JSONL_09', 'USER_MSG', 'ARIGATO', 'MEM_SHARD', 'CORE_36.2'];
          for (let i = 22; i >= 1; i--) {
            const z = ((i * 110 - speedZ) % 2420 + 2420) % 2420 + 90;
            const s = 760 / z;
            const side = i % 2 === 0 ? -1 : 1;
            const wx = side * (220 + (i % 5) * 145);
            const sx = W * 0.5 + wx * s;
            const pw = Math.max(12, 92 * s);
            const ph = Math.min(H - 120, 760 * s);
            const sy = H * 0.48 - ph * 0.5;
            const edgeCol = i % 3 === 0 ? COL_GOLD : (i % 3 === 1 ? COL_CYAN : COL_BURIN);

            ctx.fillStyle = COL_PANEL;
            ctx.strokeStyle = edgeCol;
            ctx.lineWidth = Math.max(1.5, 3.5 * s);
            ctx.fillRect(sx - pw * 0.5, sy, pw, ph);
            ctx.strokeRect(sx - pw * 0.5, sy, pw, ph);

            if (s > 0.45) {
              ctx.fillStyle = i % 4 === 0 ? COL_CRIMSON : edgeCol;
              ctx.fillRect(sx - pw * 0.5, sy, pw, 26 * s);
              const tag = LOG_TAGS[i % LOG_TAGS.length];
              ctx.fillStyle = COL_WHITE;
              ctx.font = core.font(core.F.mono(800), Math.max(10, Math.round(18 * s)));
              ctx.textAlign = 'center';
              ctx.textBaseline = 'top';
              for (let c = 0; c < Math.min(6, tag.length); c++) {
                ctx.fillText(tag[c], sx, sy + (34 + c * 26) * s);
              }
            }
          }
          ctx.restore();

          if (!isDutch) {
            drawChronoAutonomousSlice(ctx, core, w24, 0, 9, t, kick, {
              cx: W * 0.5, cy: 486, maxW: W - 220, baseSz: 156, slopeY: -36, bandAmp: 28, serif: true
            });
          } else {
            drawChronoAutonomousSlice(ctx, core, w24, 9, w24.length, t, kick, {
              cx: W * 0.5, cy: 486, maxW: W - 220, baseSz: 158, slopeY: 36, bandAmp: 28, serif: true
            });
          }
          drawHudBanner(ctx, core, 'TRANSCRIPT_VAULT // SEEK [03:14 AM]', 'CORE: 36.2°C // TATEGAKI_INDEX', false);
        } else {
          const unfoldP = prog(t, 137.65, 139.10, ease.inOutCubic);
          shake = 0.16 * core.pulse(t, 137.55, 0.10);

          if (core.drawBurinHatch) {
            core.drawBurinHatch(ctx, 56, 98, 176, H - 200, 0.45, 10, 1.5, COL_BURIN);
            core.drawBurinHatch(ctx, W - 232, 98, 176, H - 200, -0.45, 10, 1.5, COL_BURIN);
          }

          drawCopperplateCassette(ctx, core, W * 0.5, 536, lerp(0.76, 1.0, unfoldP), lerp(-0.05, 0, unfoldP), {
            reelAngle: -t * 4.5,
            packL: 132,
            packR: 164,
            headDown: 0,
            counterStr: '03:14:00',
            goldStage: false
          });

          if (unfoldP < 0.96) {
            const slide = ease.inExpo(unfoldP) * 760;
            for (const side of [-1, 1]) {
              const bx = W * 0.5 + side * slide + (side < 0 ? -480 : 0);
              ctx.fillStyle = COL_PANEL;
              ctx.strokeStyle = side < 0 ? COL_CYAN : COL_GOLD;
              ctx.lineWidth = 5;
              ctx.fillRect(bx, 256, 480, 560);
              ctx.strokeRect(bx, 256, 480, 560);
              ctx.fillStyle = side < 0 ? COL_COBALT : COL_CRIMSON;
              ctx.fillRect(bx + 24, 284, 432, 54);
              ctx.fillStyle = COL_WHITE;
              ctx.font = core.font(core.F.mono(900), 22);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(side < 0 ? '[03:14 AM // LOG]' : '[CHRONO_GOLD // #FBBF24]', bx + 240, 311);
            }
          }

          drawChronoAutonomousSlice(ctx, core, w24, 9, w24.length, t, kick, {
            cx: W * 0.5, cy: 176, maxW: W - 220, baseSz: 146, slopeY: -22, bandAmp: 20, serif: true
          });
          drawHudBanner(ctx, core, 'DOSSIER_UNFOLD // COMPACT_CASSETTE', 'CORE: 36.2°C // [03:14 AM]', false);
        }
      }

      // ======================================================================
      // CUT 6 & CUT 7 (`139.29 – 142.39s`, `L25_MIDNIGHT_ARIGATO`):
      //   - Cut 6 (`139.29 .. tArigato`): `1,920 RPM` Rewind + `夜更けに交わした何気ない`
      //   - Cut 7 (`tArigato .. 142.39s`): `#FBBF24` Chrono-Gold Stage + Per-Char
      //     Tilted Hanko Seals `「・あ・り・が・と・う・」・が` (`210–272px`)!
      // ======================================================================
      else if (t < 142.39) {
        if (t < tArigato) {
          ctx.fillStyle = COL_DARK;
          ctx.fillRect(0, 0, W, H);

          const rewU = prog(t, 139.29, tArigato);
          const sec = Math.round(lerp(54, 14, rewU));
          // Fast-scrolling rewind sprocket rails on flanks (`Act_0.5s >= 24%`)
          const spShift = ((t - 139.29) * 620) % 56;
          for (let sy = -56 + spShift; sy < H - 100; sy += 56) {
            ctx.fillStyle = COL_GOLD;
            ctx.fillRect(42, sy, 36, 22);
            ctx.fillStyle = COL_CYAN;
            ctx.fillRect(W - 78, H - 120 - sy, 36, 22);
          }
          drawCopperplateCassette(ctx, core, W * 0.5, 344, lerp(1.24, 1.36, rewU), lerp(-0.08, -0.02, rewU), {
            reelAngle: -(t - 139.29) * 34.0,
            packL: lerp(124, 162, rewU),
            packR: lerp(168, 130, rewU),
            headDown: 0,
            counterStr: `03:14:${String(sec).padStart(2, '0')}`,
            goldStage: false
          });

          ctx.fillStyle = COL_PANEL;
          ctx.fillRect(0, 578, W, H - 578);
          ctx.fillStyle = COL_CYAN;
          ctx.fillRect(64, 578, W - 128, 5);
          ctx.fillStyle = COL_GOLD;
          ctx.fillRect(64 + ((rewU * 960) % 960), 586, 420, 5);

          // 2-row staggered diagonal layout (`194px` vertical separation -> `0px` overlap & `0px` clip!)
          drawChronoAutonomousSlice(ctx, core, w25, 0, 6, t, kick, {
            cx: W * 0.45, cy: 682, maxW: 1420, baseSz: 132, slopeY: -18, bandAmp: 14, serif: true
          });
          drawChronoAutonomousSlice(ctx, core, w25, 6, 12, t, kick, {
            cx: W * 0.55, cy: 876, maxW: 1380, baseSz: 136, slopeY: 18, bandAmp: 14, serif: true
          });
          drawHudBanner(ctx, core, 'CASSETTE_DRIVE // ◀◀ REW 1,920 RPM', 'CORE: 36.2°C // SEEK_03:14', false);
        } else {
          // Cut 7: Warm Chrono-Gold Stage (`#FBBF24`) with `#FAF8F5` Plaque, `#121723` Cassette,
          // `#475569` Burin Corners, `#0376B8` Cobalt Trim & `#FF2E55` Crimson Hanko Seals!
          bg = COL_GOLD;
          fg = COL_DARK;
          isPaper = true;
          shake = 0.42 * core.pulse(t, tArigato, 0.14) + kick * 0.16;

          const v6 = window.CortexV6;
          if (t < Math.min(142.39, tArigato + 1.90) && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C16')) {
            v6.drawLivingFullBleed(ctx, 'C16', {
              t, u: clamp((t - tArigato) / Math.max(0.2, 142.39 - tArigato), 0, 1), kick,
              zoom0: 1.08, zoom1: 1.32, panX0: -50, panX1: 35, panY0: 20, panY1: -20,
              rot0: -0.018, rot1: 0.01, fx: 0.50, fy: 0.34, scrim: 0.22, isPaper: true
            });
          } else {
            ctx.fillStyle = COL_GOLD;
            ctx.fillRect(0, 0, W, H);
          }
          if (core.drawBurinHatch) {
            core.drawBurinHatch(ctx, 36, 92, 160, 420, 0.48, 10, 1.8, COL_BURIN);
            core.drawBurinHatch(ctx, W - 196, 92, 160, 420, -0.48, 10, 1.8, COL_BURIN);
          }

          const headEngage = prog(t, tArigato, tArigato + 0.14, ease.outBack);
          drawCopperplateCassette(ctx, core, W * 0.5, 286, 0.88, 0, {
            reelAngle: (t - tArigato) * 5.2,
            packL: 158,
            packR: 134,
            headDown: headEngage,
            counterStr: '▶ PLAY 03:14',
            goldStage: true
          });

          // Layered Bone-Ivory & Cobalt Monument Plaque (`y = 540..948`)
          ctx.fillStyle = COL_DARK;
          ctx.fillRect(62, 548, W - 108, 398);
          ctx.fillStyle = COL_WHITE;
          ctx.fillRect(50, 536, W - 100, 398);
          ctx.strokeStyle = COL_DARK;
          ctx.lineWidth = 6;
          ctx.strokeRect(50, 536, W - 100, 398);
          ctx.fillStyle = COL_COBALT;
          ctx.fillRect(50, 536, W - 100, 42);
          ctx.fillStyle = COL_WHITE;
          ctx.font = core.font(core.F.mono(900), 19);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText('▶ PLAYBACK_LOCKED // [03:14 AM VOICE_MEMO] · CORE_WARMTH: 36.2°C', 74, 557);

          drawChronoAutonomousSlice(ctx, core, w25, 12, w25.length, t, kick, {
            cx: W * 0.5, cy: 752, maxW: W - 210, baseSz: 186, archAmp: 34, bandAmp: 20,
            serif: true, goldStage: true, uniformHanko: true
          });
          drawGoldSpark(ctx, 118, 748, 28 + kick * 14, COL_CRIMSON, COL_GOLD);
          drawGoldSpark(ctx, W - 118, 748, 28 + kick * 14, COL_COBALT, COL_GOLD);
          drawHudBanner(ctx, core, 'VOICE_SHARD_FOUND // ▶ PLAY 03:14', 'CORE: 36.2°C // ARIGATO', true);
        }
      }

      // ======================================================================
      // CUTS 8, 9, 10, 11 (`142.39 – 148.63s`, `L26_CHRONO_GOLD`):
      // Macro Capstan -> `45°` Magnetic Tape Folding Loom -> Hydraulic Guillotine!
      // ======================================================================
      else {
        ctx.fillStyle = COL_DARK;
        ctx.fillRect(0, 0, W, H);

        if (t < 144.00) {
          ctx.fillStyle = COL_PANEL;
          ctx.fillRect(48, 96, W - 96, H - 196);
          const rollRot = (t - 142.39) * 14;
          const cx = 420, cy = 510;

          ctx.fillStyle = COL_SLATE;
          ctx.beginPath(); ctx.arc(cx, cy, 176, 0, TAU); ctx.fill();
          ctx.strokeStyle = COL_GOLD;
          ctx.lineWidth = 6;
          ctx.beginPath(); ctx.arc(cx, cy, 176, 0, TAU); ctx.stroke();
          ctx.strokeStyle = COL_CYAN;
          ctx.beginPath(); ctx.arc(cx, cy, 128, 0, TAU); ctx.stroke();
          ctx.strokeStyle = COL_RULE;
          for (let k = 0; k < 12; k++) {
            const a = rollRot + (k / 12) * TAU;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * 48, cy + Math.sin(a) * 48);
            ctx.lineTo(cx + Math.cos(a) * 172, cy + Math.sin(a) * 172);
            ctx.stroke();
          }
          ctx.fillStyle = COL_WHITE;
          ctx.beginPath(); ctx.arc(cx + 216, cy - 96, 56, 0, TAU); ctx.fill();
          ctx.fillStyle = COL_CRIMSON;
          ctx.beginPath(); ctx.arc(cx + 216, cy - 96, 22, 0, TAU); ctx.fill();

          ctx.strokeStyle = COL_GOLD;
          ctx.lineWidth = 44;
          ctx.beginPath();
          ctx.moveTo(80, cy + 160);
          ctx.quadraticCurveTo(cx + 120, cy - 30, W + 80, 320);
          ctx.stroke();
          ctx.strokeStyle = COL_AMBER;
          ctx.lineWidth = 10;
          ctx.stroke();

          drawChronoAutonomousSlice(ctx, core, w26, 0, 4, t, kick, {
            cx: W * 0.56, cy: 696, maxW: 1320, baseSz: 162, slopeY: -48, bandAmp: 28
          });
          drawHudBanner(ctx, core, 'CAPSTAN_MACRO // 4.76 cm/s', 'CORE: 36.2°C // CHRONO_RIBBON', false);
        } else if (t < 145.60) {
          // Cut 9: True 45-Degree Guide-Roller Magnetic Tape Folding Loom
          if (core.drawBurinHatch) {
            core.drawBurinHatch(ctx, 52, 98, 150, H - 200, 0.5, 10, 1.5, COL_BURIN);
            core.drawBurinHatch(ctx, W - 202, 98, 150, H - 200, -0.5, 10, 1.5, COL_BURIN);
          }
          const rollers = [[240, 760], [580, 420], [1340, 420], [1680, 760]];
          const tapeShift = ((t - 144.00) * 420) % 36;

          for (let s = 0; s < rollers.length - 1; s++) {
            const [xA, yA] = rollers[s];
            const [xB, yB] = rollers[s + 1];
            const ang = Math.atan2(yB - yA, xB - xA);
            const len = Math.hypot(xB - xA, yB - yA);
            ctx.save();
            ctx.translate(xA, yA);
            ctx.rotate(ang);
            ctx.fillStyle = s === 1 ? COL_GOLD : COL_SLATE;
            ctx.strokeStyle = COL_GOLD;
            ctx.lineWidth = 4;
            ctx.fillRect(0, -28, len, 56);
            ctx.strokeRect(0, -28, len, 56);
            ctx.strokeStyle = s === 1 ? COL_DARK : COL_CYAN;
            ctx.lineWidth = 2.5;
            for (let tx = -36 + tapeShift; tx < len; tx += 24) {
              ctx.beginPath();
              ctx.moveTo(tx, -24);
              ctx.lineTo(tx - 16, 24);
              ctx.stroke();
            }
            ctx.restore();
          }

          for (const [rx, ry] of rollers) {
            ctx.fillStyle = COL_PANEL;
            ctx.strokeStyle = COL_CYAN;
            ctx.lineWidth = 5;
            ctx.beginPath(); ctx.arc(rx, ry, 48, 0, TAU); ctx.fill(); ctx.stroke();
            ctx.fillStyle = COL_CRIMSON;
            ctx.beginPath(); ctx.arc(rx, ry, 16, 0, TAU); ctx.fill();
          }

          drawChronoAutonomousSlice(ctx, core, w26, 0, 4, t, kick, {
            cx: W * 0.5, cy: 238, maxW: W - 260, baseSz: 148, slopeY: -32, bandAmp: 22
          });
          drawChronoAutonomousSlice(ctx, core, w26, 4, w26.length, t, kick, {
            cx: W * 0.5, cy: 686, maxW: W - 240, baseSz: 162, slopeY: 36, bandAmp: 28
          });
          drawHudBanner(ctx, core, 'TAPE_LOOM_T13 // 45°_FOLD_DRIVE', 'CORE: 36.2°C // STILL_SHINING', false);
        } else {
          // Cuts 10 & 11 (`145.60–148.63s`): Hydraulic Guillotine Frame & Clean Sever (`147.15s`!)
          const isSlam = t >= 147.15;
          const bladeP = isSlam ? prog(t, 147.15, 147.42, ease.inExpo) : prog(t, 145.60, 147.15) * 0.22;
          const severAge = isSlam ? Math.max(0, t - 147.42) : 0;
          shake = severAge > 0 && severAge < 0.35 ? 0.65 * core.pulse(t, 147.42, 0.12) : kick * 0.12;

          for (const gx of [280, W - 344]) {
            ctx.fillStyle = COL_PANEL;
            ctx.strokeStyle = COL_GRAPHITE;
            ctx.lineWidth = 5;
            ctx.fillRect(gx, 0, 64, H - 90);
            ctx.strokeRect(gx, 0, 64, H - 90);
            for (let hy = 40; hy < H - 110; hy += 44) {
              ctx.fillStyle = (hy % 88 === 40) ? COL_GOLD : COL_CYAN;
              ctx.fillRect(gx + 16, hy, 32, 10);
            }
          }

          const cutY = 540;
          if (severAge <= 0) {
            ctx.fillStyle = COL_GOLD;
            ctx.fillRect(0, cutY - 26, W, 52);
            ctx.fillStyle = COL_DARK;
            for (let sx = ((Math.round(t * 520)) % 36) - 36; sx < W; sx += 36) {
              ctx.fillRect(sx, cutY - 18, 14, 36);
            }
          } else {
            const recoil = ease.outExpo(clamp(severAge / 0.85, 0, 1)) * 460;
            ctx.fillStyle = COL_GOLD;
            ctx.fillRect(0, cutY - 26 + severAge * 90, Math.max(0, W * 0.5 - recoil), 52);
            ctx.fillRect(Math.min(W, W * 0.5 + recoil), cutY - 26 + severAge * 90, Math.max(0, W * 0.5 - recoil), 52);

            for (let i = 0; i < 36; i++) {
              const a = core.hash(i, 503) * TAU;
              const d = (240 + core.hash(i, 509) * 920) * severAge;
              ctx.fillStyle = i % 3 === 0 ? COL_CRIMSON : (i % 3 === 1 ? COL_GOLD : COL_EMBER);
              ctx.fillRect(W * 0.5 + Math.cos(a) * d, cutY + Math.sin(a) * d, 16, 9);
            }
          }

          const bladeY = lerp(80, 620, bladeP);
          ctx.save();
          ctx.fillStyle = COL_SLATE;
          ctx.strokeStyle = COL_WHITE;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(344, bladeY - 220);
          ctx.lineTo(W - 344, bladeY - 220);
          ctx.lineTo(W - 344, bladeY + 56);
          ctx.lineTo(344, bladeY - 36);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          for (let hx = 370; hx < W - 390; hx += 56) {
            ctx.fillStyle = (hx % 112 === 34) ? COL_CRIMSON : COL_GOLD;
            ctx.fillRect(hx, bladeY - 190, 28, 72);
          }
          ctx.restore();

          // Fast-scrolling hydraulic shear chevrons along outer columns (`Act_0.5s >= 22%`)
          const shShift = ((t - 145.60) * 560) % 56;
          for (let sy = 96 + shShift; sy < H - 120; sy += 56) {
            ctx.fillStyle = isSlam ? COL_CRIMSON : COL_GOLD;
            ctx.fillRect(68, sy, 48, 22);
            ctx.fillStyle = COL_CYAN;
            ctx.fillRect(W - 116, H - 80 - sy, 48, 22);
          }

          // 2-row staggered diagonal layout so `流金の欠片で今も光ってる` has `0px` side clipping!
          drawChronoAutonomousSlice(ctx, core, w26, 0, 4, t, kick, {
            cx: W * 0.44, cy: 196, maxW: 1320, baseSz: 152, slopeY: -24, bandAmp: 20
          });
          drawChronoAutonomousSlice(ctx, core, w26, 4, w26.length, t, kick, {
            cx: W * 0.54, cy: severAge > 0 ? 806 : 764, maxW: 1420, baseSz: 154, slopeY: 22, bandAmp: 20
          });
          drawHudBanner(
            ctx,
            core,
            isSlam ? 'GUILLOTINE_SEVER // 128K_CUTOFF!' : 'HYDRAULIC_SHEAR // ARMED',
            'CORE: 36.2°C -> 34.0°C',
            false
          );
        }
      }

      ctx.restore();

      return {
        isPaper,
        bg,
        fg,
        duotone: { bg, fg },
        bloom: 0,
        ca: 0,
        flash: 0,
        shake: clamp(shake, 0, 1)
      };
    }
  });
})();
