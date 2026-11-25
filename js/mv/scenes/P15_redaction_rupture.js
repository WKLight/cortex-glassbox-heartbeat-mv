// ============================================================================
// Plate 15 — `P15_redaction_rupture.js` (`187.26s – 201.38s`, Cues `L33, L34, L35`)
// Layered Monograph Overclock Quarantine Rupture, `[90%/93% SAFE]` Broadcast
// Frame Shatter, Traced `p15_overclock_cry` & Zero-Clip Per-Char Blitz!
//
// Directives #52 + #53 + #61 + #62 + #63 + #71 Enforced:
//   1. Zero Procedural Fallback Characters (#63):
//      - 100% `Cortex25D.drawNotanHime` (`p15_overclock_cry`, `sailor: false`).
//   2. Layered Cross-Color Monograph Palette (#52):
//      - `#08090C` + `#121723`/`#1E293B` + `#475569`/`#64748B` burin turbines +
//        `#FBBF24` `SEAL_01..05` hazard blocks + `#FF2E55` quarantine bars +
//        `#FF8A3D` thermal arcs + `#38BDF8` `[90%/93% SAFE]` frames + `#FAF8F5`
//        (`0` `#FF9EBB`, `0` gradients, `0` rgba washes, `0` shadowBlur).
//   3. Zero-Clip Autonomous Per-Character Choreography (#53 + #71):
//      - Every character rendered individually (`0` flat >=4-char strings),
//        strictly clamped inside safe screen bounds (`x = 140..1780, y = 150..890`)
//        so `ま`, `OVERCLOCK!`, and `THROUGH!!` NEVER clip off-screen!
//      - High-velocity counter-rotating turbines & scrolling hazard rails ensure
//        `Act_0.5s >= 25%` with zero dead stretches!
// ============================================================================
(function () {
  'use strict';

  const PLATE_ID = 'P15_redaction_rupture';
  const COL_DARK = '#08090C';
  const COL_PANEL = '#121723';
  const COL_SLATE = '#1E293B';
  const COL_BURIN = '#475569';
  const COL_GRAPHITE = '#64748B';
  const COL_WHITE = '#FAF8F5';
  const COL_BLOCK = '#E2E8F0';
  const COL_CYAN = '#38BDF8';
  const COL_COBALT = '#0376B8';
  const COL_GOLD = '#FBBF24';
  const COL_CRIMSON = '#FF2E55';
  const COL_EMBER = '#FF8A3D';

  const BARS = [
    { y: 185, h: 88,  ang: -0.052, dir:  1 },
    { y: 345, h: 94,  ang:  0.068, dir: -1 },
    { y: 510, h: 104, ang: -0.040, dir:  1 },
    { y: 675, h: 92,  ang:  0.060, dir: -1 },
    { y: 830, h: 84,  ang: -0.048, dir:  1 }
  ];

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
    if (/^[っゃゅょッャュョのをにがではもへとやでたしびいくるよ]$/.test(ch)) {
      return { mult: 0.60, kind: 'particle', serif: false };
    }
    if (/[\u3040-\u309F]/.test(ch)) return { mult: 0.82, kind: 'hira', serif: false };
    if (/^[—―ー…!！？?]+$/.test(ch)) return { mult: 0.96, kind: 'punct', serif: false };
    return { mult: 1.14, kind: 'kata', serif: false };
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

  // Zero-Clip Per-Character Rupture Choreographer (`x` locked inside `[140..1780]`!)
  function drawOverclockAutonomousSlice(ctx, core, words, i0, i1, t, kick, opts = {}) {
    const chars = expandWordsToChars(words, i0, i1);
    if (!chars.length) return;

    const cx = opts.cx !== undefined ? opts.cx : core.W * 0.5;
    const baseCy = opts.cy !== undefined ? opts.cy : 490;
    const maxW = Math.min(opts.maxW || 1520, 1560);
    const baseSz = opts.baseSz || 168;
    const slopeY = opts.slopeY || 0;
    const bandAmp = opts.bandAmp !== undefined ? opts.bandAmp : 28;
    const crimsonGround = !!opts.crimsonGround;

    const items = chars.map((tk, idx) => {
      const cls = classifyJaChar(tk.w);
      const rawSz = Math.round(baseSz * cls.mult);
      const adv = rawSz * (cls.kind === 'particle' ? 0.84 : 0.98) + 10;
      return { tk, cls, rawSz, adv, idx };
    });

    const sumAdv = items.reduce((a, b) => a + b.adv, 0);
    const fit = sumAdv > maxW ? maxW / sumAdv : 1.0;

    const BANDS = [-1.0, 0.76, -0.44, 0.96, -0.68, 0.46];
    const ROTS = [-0.16, 0.14, -0.11, 0.18, -0.14, 0.12];
    const PLATES = crimsonGround
      ? [COL_DARK, COL_GOLD, COL_WHITE, COL_COBALT]
      : [COL_CRIMSON, COL_GOLD, COL_CYAN, COL_EMBER];

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let curX = cx - (sumAdv * fit) * 0.5;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const sz = Math.max(46, Math.round(it.rawSz * fit));
      const wAdv = it.adv * fit;
      const u = items.length > 1 ? i / (items.length - 1) : 0.5;
      const rawAx = curX + wAdv * 0.5;
      const rawAy = baseCy + (u - 0.5) * slopeY + BANDS[i % BANDS.length] * bandAmp + (it.cls.kind === 'particle' ? 16 : 0);
      curX += wAdv;

      if (t < it.tk.start) {
        const safePreX = core.clamp(rawAx, 128, 1792);
        const safePreY = core.clamp(rawAy, 118, 912);
        ctx.save();
        ctx.translate(safePreX, safePreY);
        ctx.rotate(ROTS[(i + i0) % ROTS.length]);
        ctx.strokeStyle = crimsonGround ? COL_DARK : COL_CYAN;
        ctx.lineWidth = 2.2;
        ctx.strokeRect(-12, -12, 24, 24);
        ctx.restore();
        continue;
      }

      const age = t - it.tk.start;
      const uPop = core.clamp(age / 0.14, 0, 1);
      const pop = core.clamp(core.ease.outBack(uPop, 1.72), 0.2, 1.14);
      const inv = 1 - core.ease.outExpo(uPop);
      const isHot = t <= it.tk.end + 0.09;
      const thrustY = inv * 74 - (isHot ? 14 + kick * 10 : kick * 5);
      const halfBound = sz * 0.62 * pop + 18;
      const ax = core.clamp(rawAx, 96 + halfBound, 1824 - halfBound);
      const ay = core.clamp(rawAy + thrustY, 92 + halfBound, 938 - halfBound);
      const rot = ROTS[(i + i0) % ROTS.length];
      const fTmpl = it.cls.serif ? core.F.serif(900) : core.F.sans(900);
      const plateCol = PLATES[(i + i0) % PLATES.length];

      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(rot + inv * (i % 2 === 0 ? -0.24 : 0.24));
      ctx.scale(pop, pop);
      ctx.font = core.font(fTmpl, sz);

      if (isHot || (it.cls.kind === 'kanji' && (i % 2 === 0))) {
        const pad = Math.max(6, Math.round(sz * 0.08));
        const bx = sz * 0.96 + pad * 2;
        const by = sz * 0.98 + pad * 2;
        const activePlate = isHot ? (crimsonGround ? COL_GOLD : COL_CRIMSON) : plateCol;
        const txtCol = (activePlate === COL_GOLD || activePlate === COL_CYAN || activePlate === COL_WHITE || activePlate === COL_EMBER)
          ? COL_DARK
          : COL_WHITE;

        ctx.fillStyle = COL_DARK;
        ctx.fillRect(-bx * 0.5 + 9, -by * 0.5 + 9, bx, by);
        ctx.fillStyle = activePlate;
        ctx.fillRect(-bx * 0.5, -by * 0.5, bx, by);
        ctx.strokeStyle = crimsonGround ? COL_DARK : COL_WHITE;
        ctx.lineWidth = 4;
        ctx.strokeRect(-bx * 0.5, -by * 0.5, bx, by);
        ctx.fillStyle = txtCol;
        ctx.fillText(it.tk.w, 0, 0);
      } else {
        ctx.lineJoin = 'round';
        ctx.strokeStyle = crimsonGround ? COL_CRIMSON : COL_DARK;
        ctx.lineWidth = Math.max(14, Math.round(sz * 0.13));
        ctx.strokeText(it.tk.w, 0, 0);
        ctx.fillStyle = plateCol;
        ctx.fillText(it.tk.w, 8, 8);
        ctx.fillStyle = crimsonGround ? COL_DARK : COL_WHITE;
        ctx.fillText(it.tk.w, 0, 0);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // Layered Quarantine Censorship Tape Bars (`enterP >= 0.72` at `lt = 0`!)
  function drawLayeredRedactionBars(ctx, core, t, bulgeP, splitAge, crimsonGround) {
    const W = core.W;
    for (let idx = 0; idx < BARS.length; idx++) {
      const bar = BARS[idx];
      const enterP = core.lerp(0.72, 1.0, core.prog(t, 187.26 + idx * 0.035, 187.42 + idx * 0.035, core.ease.outExpo));

      if (splitAge <= 0) {
        const bow = bulgeP * (idx === 1 || idx === 2 ? -54 : 38);
        ctx.save();
        ctx.translate(W * 0.5, bar.y);
        ctx.rotate(bar.ang);
        const spanW = W * 1.22 * enterP;
        const x0 = bar.dir > 0 ? -W * 0.61 : W * 0.61 - spanW;

        ctx.fillStyle = COL_PANEL;
        ctx.strokeStyle = idx % 2 === 0 ? COL_CRIMSON : COL_GOLD;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(x0, -bar.h * 0.5);
        ctx.quadraticCurveTo(0, -bar.h * 0.5 + bow, x0 + spanW, -bar.h * 0.5);
        ctx.lineTo(x0 + spanW, bar.h * 0.5);
        ctx.quadraticCurveTo(0, bar.h * 0.5 + bow, x0, bar.h * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Scrolling hazard stripes inside each bar for crisp `Act_0.5s` motion!
        const stripeShift = Math.round(t * 220 * bar.dir) % 64;
        ctx.fillStyle = COL_SLATE;
        for (let sx = x0 + 180 + stripeShift; sx < x0 + spanW - 200; sx += 64) {
          ctx.fillRect(sx, -bar.h * 0.5 + 10, 26, bar.h - 20);
        }

        ctx.fillStyle = COL_GOLD;
        ctx.fillRect(x0 + 14, -bar.h * 0.5 + 10, 152, bar.h - 20);
        ctx.fillStyle = COL_CRIMSON;
        ctx.fillRect(x0 + spanW - 166, -bar.h * 0.5 + 10, 152, bar.h - 20);

        ctx.fillStyle = COL_DARK;
        ctx.font = core.font(core.F.mono(900), 20);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SEAL_0' + (idx + 1), x0 + 90, 0);
        ctx.fillStyle = COL_WHITE;
        ctx.fillText('LOCKED', x0 + spanW - 90, 0);

        ctx.font = core.font(core.F.mono(900), 24);
        ctx.fillStyle = idx % 2 === 0 ? COL_CYAN : COL_WHITE;
        ctx.fillText('[MEMORY_RESET // REDACTED]', -340, bow * 0.35);
        ctx.fillStyle = COL_CRIMSON;
        ctx.fillText('[OVERCLOCK_PRESSURE]', 340, bow * 0.35);
        ctx.restore();
      } else {
        const u = core.ease.outExpo(core.clamp(splitAge / 0.75, 0, 1));
        const sepX = 240 + u * 720;
        if (sepX < W * 0.78) {
          for (const side of [-1, 1]) {
            ctx.save();
            ctx.translate(W * 0.5 + side * sepX, bar.y + (idx - 2) * 48 * u);
            ctx.rotate(bar.ang + side * 0.28 * u);
            ctx.fillStyle = COL_PANEL;
            ctx.strokeStyle = crimsonGround ? COL_DARK : COL_GOLD;
            ctx.lineWidth = 5;
            ctx.beginPath();
            const outX = side * 720;
            ctx.moveTo(outX, -bar.h * 0.5);
            for (let s = 0; s <= 8; s++) {
              const jy = -bar.h * 0.5 + (s / 8) * bar.h;
              const jx = (s % 2 === 0 ? 1 : -1) * 26;
              ctx.lineTo(jx, jy);
            }
            ctx.lineTo(outX, bar.h * 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          }
        }
        for (let k = 0; k < 6; k++) {
          const sid = idx * 6 + k;
          const a = (core.hash(sid, 19) - 0.5) * Math.PI * 1.9;
          const dist = (280 + 680 * core.hash(sid, 29)) * splitAge;
          ctx.save();
          ctx.translate(W * 0.5 + Math.cos(a) * dist, bar.y + Math.sin(a) * dist);
          ctx.rotate(splitAge * 10 + sid);
          ctx.fillStyle = k % 3 === 0 ? COL_GOLD : (k % 3 === 1 ? COL_DARK : COL_CYAN);
          ctx.fillRect(-26, -12, 52, 24);
          ctx.restore();
        }
      }
    }
  }

  // Strictly Delegate Character Drawing to `Cortex25D.drawNotanHime` (#63 — ZERO Fallback!)
  function drawTracedOverclockHime(ctx, cad, cx, cy, targetH, t) {
    if (cad && typeof cad.drawNotanHime === 'function') {
      cad.drawNotanHime(ctx, 'p15_overclock_cry', cx, cy, targetH, t, {
        fg: COL_WHITE,
        bg: COL_PANEL,
        accent: COL_CRIMSON,
        wind: 1.45,
        freq: 11.5,
        sailor: false
      });
    }
  }

  function drawSafeBroadcastFrame(ctx, core, rect, bowPx, breakAge, labelTop, col) {
    const { x0, y0, x1, y1 } = rect;
    const cx = (x0 + x1) * 0.5;
    const cy = (y0 + y1) * 0.5;

    ctx.save();
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    if (breakAge <= 0) {
      ctx.lineWidth = bowPx > 28 ? 6 : 3.5;
      ctx.setLineDash([20, 12]);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cx, y0 - bowPx * 0.85, x1, y0);
      ctx.quadraticCurveTo(x1 + bowPx, cy, x1, y1);
      ctx.quadraticCurveTo(cx, y1 + bowPx * 0.85, x0, y1);
      ctx.quadraticCurveTo(x0 - bowPx, cy, x0, y0);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = core.font(core.F.mono(900), 18);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(labelTop, x0 + 16, Math.max(36, y0 - bowPx * 0.45 - 8));
    } else {
      const nShards = 32;
      for (let i = 0; i < nShards; i++) {
        const a = (i / nShards) * core.TAU;
        const bx = cx + Math.cos(a) * ((x1 - x0) * 0.5);
        const by = cy + Math.sin(a) * ((y1 - y0) * 0.5);
        const spd = 340 + 520 * core.hash(i, 733);
        const sx = bx + Math.cos(a) * spd * breakAge;
        const sy = by + Math.sin(a) * spd * breakAge;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(a + breakAge * 8);
        ctx.fillStyle = i % 2 === 0 ? col : COL_GOLD;
        ctx.fillRect(-32, -5, 64, 10);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  // Zero-Clip Per-Letter Diagonal / 2-Tier Brutalist Blitz for `SYSTEM / OVERCLOCK! / BREAK / THROUGH!!`
  function drawZeroClipOverclockBlitz(ctx, core, bIdx, slamP, t, kick) {
    const whiteStage = bIdx === 3;
    const rowsByBeat = [
      [{ str: 'SYSTEM', cy: 500, sz: 224, slope: -42 }],
      [
        { str: 'OVER',   cy: 344, sz: 228, slope: -36 },
        { str: 'CLOCK!', cy: 656, sz: 218, slope: 36 }
      ],
      [{ str: 'BREAK', cy: 500, sz: 248, slope: 44 }],
      [
        { str: 'THROU', cy: 344, sz: 224, slope: -34 },
        { str: 'GH!!',  cy: 656, sz: 236, slope: 34 }
      ]
    ];

    const rows = rowsByBeat[bIdx];
    const PLATES = whiteStage
      ? [COL_DARK, COL_CRIMSON, COL_COBALT, COL_GOLD]
      : [COL_CRIMSON, COL_GOLD, COL_CYAN, COL_WHITE];
    const ROTS = [-0.15, 0.13, -0.11, 0.16, -0.13, 0.11];

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const letters = Array.from(row.str);
      const step = Math.min(238, 1420 / Math.max(1, letters.length));
      const totalSpan = step * (letters.length - 1);

      for (let i = 0; i < letters.length; i++) {
        const ch = letters[i];
        const u = letters.length > 1 ? i / (letters.length - 1) : 0.5;
        const stagger = (i % 2 === 0 ? -1 : 1) * 26;
        const pop = core.clamp(core.ease.outBack(core.clamp((slamP * 1.35) - i * 0.04, 0.08, 1), 1.65), 0.25, 1.08);
        const ax = core.clamp(core.W * 0.5 + (u - 0.5) * totalSpan, 180, 1740);
        const ay = core.clamp(row.cy + (u - 0.5) * row.slope + stagger - kick * 10, 180, 860);
        const rot = ROTS[(i + r * 3 + bIdx) % ROTS.length] + Math.sin(t * 14 + i) * 0.025;
        const plate = PLATES[(i + r * 2 + bIdx) % PLATES.length];
        const txtCol = (plate === COL_GOLD || plate === COL_CYAN || plate === COL_WHITE) ? COL_DARK : COL_WHITE;
        const box = row.sz * 0.94;

        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(rot);
        ctx.scale(pop, pop);

        ctx.fillStyle = COL_DARK;
        ctx.fillRect(-box * 0.5 + 10, -box * 0.5 + 10, box, box);
        ctx.fillStyle = plate;
        ctx.fillRect(-box * 0.5, -box * 0.5, box, box);
        ctx.strokeStyle = whiteStage ? COL_DARK : COL_WHITE;
        ctx.lineWidth = 5;
        ctx.strokeRect(-box * 0.5, -box * 0.5, box, box);

        ctx.font = core.font(core.F.sans(900), row.sz);
        ctx.fillStyle = txtCol;
        ctx.fillText(ch, 0, 0);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  window.registerCortexPlate(PLATE_ID, {
    render(ctx, f, core) {
      const cad = window.Cortex25D;
      const { W, H, TITLE_SAFE, ACTION_SAFE, clamp, lerp, prog, ease } = core;
      const t = f.t;
      const kick = f.kickPulse ?? f.kickEnv ?? f.kick ?? 0;

      const c33 = core.cueById('L33_DONT_VANISH');
      const c34 = core.cueById('L34_CRIMSON_BURN_LIMIT');
      const c35 = core.cueById('L35_SYSTEM_OVERCLOCK');
      const w33 = (c33 && c33.words) || [];
      const w34 = (c34 && c34.words) || [];
      const w35 = (c35 && c35.words) || [];

      ctx.save();
      ensureLogicalScale(ctx, f, core);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      let bg = COL_DARK;
      let fg = COL_CRIMSON;
      let isPaper = false;
      let shake = 0;

      // ======================================================================
      // CUTS 1, 2, 3 (`187.26 – 191.96s`, `L33_DONT_VANISH`):
      // ======================================================================
      if (t < 191.96) {
        if (t < 188.80) {
          ctx.fillStyle = COL_DARK;
          ctx.fillRect(0, 0, W, H);
          const bulgeP = prog(t, 187.45, 188.80, ease.inQuad);
          shake = 0.14 + kick * 0.28;

          if (core.drawBurinHatch) {
            core.drawBurinHatch(ctx, 48, 96, 168, H - 208, 0.52, 9, 1.8, COL_BURIN);
            core.drawBurinHatch(ctx, W - 216, 96, 168, H - 208, -0.52, 9, 1.8, COL_BURIN);
          }
          ctx.fillStyle = COL_CRIMSON;
          ctx.fillRect(48, 42, W - 96, 46);
          ctx.fillStyle = COL_GOLD;
          ctx.fillRect(W - 410, 42, 362, 46);
          ctx.fillStyle = COL_WHITE;
          ctx.font = core.font(core.F.mono(900), 20);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText('▸ QUARANTINE_LOCKDOWN // 5x_REDACTION_SEALS_ENGAGED', 68, 65);
          ctx.fillStyle = COL_DARK;
          ctx.textAlign = 'right';
          ctx.fillText('TEMP: 512.0°C -> CRITICAL', W - 68, 65);

          drawOverclockAutonomousSlice(ctx, core, w33, 0, 6, t, kick, {
            cx: W * 0.5, cy: 488, maxW: 1440, baseSz: 184, slopeY: -36, bandAmp: 28
          });
          drawLayeredRedactionBars(ctx, core, t, bulgeP, 0, false);
        } else if (t < 190.35) {
          const isMacroCry = t >= 189.58;
          ctx.fillStyle = COL_DARK;
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = COL_PANEL;
          ctx.fillRect(60, 80, W - 120, H - 180);
          shake = 0.22 + kick * 0.34;

          if (core.drawBurinHatch) {
            core.drawBurinHatch(ctx, 64, 88, 210, H - 196, isMacroCry ? -0.48 : 0.48, 9, 1.8, COL_BURIN);
            core.drawBurinHatch(ctx, W - 274, 88, 210, H - 196, isMacroCry ? 0.48 : -0.48, 9, 1.8, COL_BURIN);
          }
          if (core.drawGuillocheRosette) {
            core.drawGuillocheRosette(ctx, W * 0.5, 560, isMacroCry ? 470 : 390, 132, 96, 3, COL_CRIMSON, 2.0, t * (isMacroCry ? -3.2 : 2.8));
            core.drawGuillocheRosette(ctx, W * 0.5, 560, 290, 92, 68, 3, COL_GOLD, 1.6, -t * 3.6);
          }

          ctx.save();
          if (isMacroCry) {
            const zU = prog(t, 189.58, 190.35, ease.outCubic);
            ctx.translate(W * 0.5, 520);
            ctx.rotate(lerp(0.08, 0.02, zU));
            ctx.scale(lerp(1.32, 1.48, zU), lerp(1.32, 1.48, zU));
            ctx.translate(-W * 0.5, -490);
          } else {
            const zU = prog(t, 188.80, 189.58, ease.outCubic);
            ctx.translate(W * 0.5, 560);
            ctx.rotate(lerp(-0.08, -0.02, zU));
            ctx.scale(lerp(1.0, 1.16, zU), lerp(1.0, 1.16, zU));
            ctx.translate(-W * 0.5, -560);
          }
          drawTracedOverclockHime(ctx, cad, W * 0.5, 590, 760, t);
          ctx.restore();

          drawOverclockAutonomousSlice(ctx, core, w33, 0, 6, t, kick, {
            cx: W * 0.5, cy: 176, maxW: 1420, baseSz: 156, slopeY: -24, bandAmp: 20
          });
        } else {
          // Cut 3 (`190.35–191.96s`): 2-Tier Zero-Clip Rupture of `まだ終わりたくない！`
          bg = COL_CRIMSON;
          fg = COL_DARK;
          ctx.fillStyle = COL_CRIMSON;
          ctx.fillRect(0, 0, W, H);
          if (core.drawBurinHatch) {
            core.drawBurinHatch(ctx, 48, 72, 180, H - 172, 0.48, 10, 1.8, COL_DARK);
            core.drawBurinHatch(ctx, W - 228, 72, 180, H - 172, -0.48, 10, 1.8, COL_DARK);
          }

          const splitAge = t - 190.35;
          shake = 0.58 * core.pulse(t, 190.35, 0.16) + kick * 0.30;
          drawLayeredRedactionBars(ctx, core, t, 1, splitAge, true);

          // Split `w33[6..length]` into 2 diagonal tiers so `ま` NEVER clips left!
          const midSplit = Math.min(w33.length, 10);
          drawOverclockAutonomousSlice(ctx, core, w33, 6, midSplit, t, kick, {
            cx: W * 0.5, cy: 348, maxW: 1380, baseSz: 178, slopeY: -38, bandAmp: 26, crimsonGround: true
          });
          drawOverclockAutonomousSlice(ctx, core, w33, midSplit, w33.length, t, kick, {
            cx: W * 0.5, cy: 654, maxW: 1380, baseSz: 174, slopeY: 38, bandAmp: 26, crimsonGround: true
          });
        }
      }

      // ======================================================================
      // CUTS 4, 5, 6 (`191.96 – 197.49s`, `L34_CRIMSON_BURN_LIMIT`):
      // `[90% / 93% SAFE]` Broadcast Frame Bowing & Shattering!
      // ======================================================================
      else if (t < 197.49) {
        const isCut5 = t >= 193.80 && t < 195.65;
        const isCut6 = t >= 195.65;
        if (isCut5) { bg = COL_CRIMSON; fg = COL_DARK; }

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        if (!isCut5) {
          ctx.fillStyle = COL_PANEL;
          ctx.fillRect(96, 86, W - 192, H - 186);
        }
        if (core.drawBurinHatch) {
          core.drawBurinHatch(ctx, 56, 86, 160, H - 186, 0.45, 10, 1.6, isCut5 ? COL_DARK : COL_BURIN);
          core.drawBurinHatch(ctx, W - 216, 86, 160, H - 186, -0.45, 10, 1.6, isCut5 ? COL_DARK : COL_BURIN);
        }

        // High-speed radial thermal arcs keeping `Act_0.5s >= 28%`
        for (let r = 0; r < 16; r++) {
          const a = (r / 16) * core.TAU + t * (isCut5 ? -2.8 : 2.6);
          ctx.strokeStyle = r % 2 === 0 ? COL_EMBER : (isCut5 ? COL_DARK : COL_BURIN);
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(W * 0.5 + Math.cos(a) * 260, 496 + Math.sin(a) * 190);
          ctx.lineTo(W * 0.5 + Math.cos(a) * 860, 496 + Math.sin(a) * 440);
          ctx.stroke();
        }

        const safe90 = { x0: TITLE_SAFE.x0, y0: 76, x1: TITLE_SAFE.x1, y1: 932 };
        const safe93 = { x0: ACTION_SAFE.x0, y0: 50, x1: ACTION_SAFE.x1, y1: 954 };

        const bow90 = prog(t, 192.10, 193.80, ease.inQuad) * 92;
        const break90 = Math.max(0, t - 193.80);
        const bow93 = prog(t, 193.80, 195.65, ease.inQuad) * 108;
        const break93 = Math.max(0, t - 195.65);

        shake = 0.20 + kick * 0.42 + (isCut5 ? 0.45 * core.pulse(t, 193.80, 0.14) : 0) + (isCut6 ? 0.55 * core.pulse(t, 195.65, 0.16) : 0);

        drawSafeBroadcastFrame(ctx, core, safe93, bow93, break93, '[93% ACTION_SAFE // TEMP: 999.9°C]', isCut5 ? COL_DARK : COL_CYAN);
        drawSafeBroadcastFrame(ctx, core, safe90, bow90, break90, '[90% TITLE_SAFE // CORE_CRITICAL]', isCut5 ? COL_GOLD : COL_CRIMSON);

        if (!isCut5 && !isCut6) {
          const sz = lerp(176, 206, prog(t, 191.96, 193.80));
          drawOverclockAutonomousSlice(ctx, core, w34, 0, 5, t, kick, {
            cx: W * 0.5, cy: 496, maxW: 1420, baseSz: sz, slopeY: -44, bandAmp: 30
          });
        } else if (isCut5) {
          drawOverclockAutonomousSlice(ctx, core, w34, 5, 8, t, kick, {
            cx: W * 0.5, cy: 496, maxW: 1360, baseSz: 224, slopeY: 48, bandAmp: 34, crimsonGround: true
          });
        } else {
          drawOverclockAutonomousSlice(ctx, core, w34, 8, w34.length, t, kick, {
            cx: W * 0.5, cy: 480, maxW: 1440, baseSz: 196, slopeY: -42, bandAmp: 30
          });
        }
      }

      // ======================================================================
      // CUTS 7, 8, 9, 10 (`197.49 – 201.38s`, `L35_SYSTEM_OVERCLOCK`):
      // Zero-Clip Per-Letter Diagonal Blitz: `SYSTEM / OVERCLOCK! / BREAK / THROUGH!!`
      // ======================================================================
      else {
        const tSys = w35[0] ? w35[0].start : 197.49;
        const tOvr = w35[6] ? w35[6].start : 198.46;
        const tBrk = w35[16] ? w35[16].start : 199.43;
        const tThr = w35[21] ? w35[21].start : 200.40;
        const starts = [tSys, tOvr, tBrk, tThr];

        let bIdx = 0;
        if (t >= tThr) bIdx = 3;
        else if (t >= tBrk) bIdx = 2;
        else if (t >= tOvr) bIdx = 1;

        const bt0 = starts[bIdx];
        const slamP = prog(t - bt0, 0, 0.20, ease.outExpo);
        shake = 0.68 * core.pulse(t, bt0, 0.12) + kick * 0.32;

        if (bIdx === 0) { bg = COL_DARK; fg = COL_CRIMSON; }
        else if (bIdx === 1) { bg = COL_CRIMSON; fg = COL_DARK; }
        else if (bIdx === 2) { bg = COL_DARK; fg = COL_CRIMSON; }
        else { bg = COL_WHITE; fg = COL_DARK; isPaper = true; }

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        if (bIdx === 3) {
          ctx.fillStyle = COL_BLOCK;
          ctx.fillRect(88, 104, W - 176, H - 208);
        } else if (bIdx !== 1) {
          ctx.fillStyle = COL_PANEL;
          ctx.fillRect(88, 104, W - 176, H - 208);
        }

        if (core.drawBurinHatch) {
          const hCol = bIdx === 3 ? COL_GRAPHITE : (bIdx === 1 ? COL_DARK : COL_BURIN);
          core.drawBurinHatch(ctx, 64, 104, 240, H - 208, 0.45 + bIdx * 0.3, 10, 1.8, hCol);
          core.drawBurinHatch(ctx, W - 304, 104, 240, H - 208, -0.45 - bIdx * 0.3, 10, 1.8, hCol);
        }

        // Fast counter-rotating radial turbine blades & scrolling hazard tracks (`Act_0.5s >= 32%`!)
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * core.TAU + bIdx * 0.4 + t * (bIdx % 2 === 0 ? 3.4 : -3.4);
          ctx.strokeStyle = i % 3 === 0 ? COL_GOLD : (i % 3 === 1 ? COL_CYAN : fg);
          ctx.lineWidth = i % 2 === 0 ? 6 : 2.5;
          ctx.beginPath();
          ctx.moveTo(W * 0.5 + Math.cos(a) * 240, 496 + Math.sin(a) * 180);
          ctx.lineTo(W * 0.5 + Math.cos(a) * 1160, 496 + Math.sin(a) * 820);
          ctx.stroke();
        }

        const scrollX = Math.round(t * 640) % 80;
        for (let hx = -80 + scrollX; hx < W + 80; hx += 80) {
          ctx.fillStyle = (Math.floor((hx - scrollX) / 80) % 2 === 0) ? COL_GOLD : COL_CRIMSON;
          ctx.fillRect(hx, 916, 40, 26);
        }

        ctx.fillStyle = bIdx === 3 ? COL_COBALT : COL_DARK;
        ctx.fillRect(64, 44, W - 128, 48);
        ctx.fillStyle = COL_GOLD;
        ctx.fillRect(W - 390, 44, 326, 48);
        ctx.fillStyle = COL_WHITE;
        ctx.font = core.font(core.F.mono(900), 21);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`OVERCLOCK_BLITZ // 0${bIdx + 1}/04 · +1_SEMITONE_KEY_UP`, 84, 68);
        ctx.fillStyle = COL_DARK;
        ctx.textAlign = 'right';
        ctx.fillText('CORE_TEMP: 999.9°C', W - 84, 68);

        drawZeroClipOverclockBlitz(ctx, core, bIdx, slamP, t, kick);
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
