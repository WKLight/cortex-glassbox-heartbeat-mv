// ============================================================================
// Plate 12 — `P12_hydraulic_window.js` (`148.63s – 163.34s`, Cues `L27, L28`)
// Layered Monograph Riveted Hydraulic Steel Walls (`128K`), Tempered Glass
// Spiderweb Fracture, Pouring Chrono-Gold Memory Sand & Traced Notan Hime!
//
// Directives #52 + #53 + #61 + #62 + #63 Enforced:
//   1. Zero Procedural Fallback Characters (#63):
//      - 100% `Cortex25D.drawNotanHime` (`p12_hydraulic_brace` & `p12_kneel_sand`,
//        `sailor: false` base outfit). Zero procedural stick/arc fallback code!
//   2. Layered Cross-Color Monograph Palette (#52):
//      - `#08090C` pit + `#121723`/`#1E293B` riveted steel bulkheads + `#475569`/`#64748B`
//        burin columns + `#FAF8F5` rims + `#FBBF24` hazard chevrons & pouring memory
//        sand + `#38BDF8` glass fissures & `128K` gauge + `#FF2E55` overload pistons
//        (`0` `#FF9EBB`, `0` gradients, `0` rgba washes, `0` shadowBlur).
//   3. Autonomous Per-Character Japanese Choreography (#53):
//      - Every character rendered individually (`0` flat >=4-char strings), Kanji
//        `1.54x` (`215–265px`) vs tucked particles `0.58x`, physically crushed by
//        closing walls in `L27` and cascading like memory shards in `L28`!
// ============================================================================
(function () {
  'use strict';

  const PLATE_ID = 'P12_hydraulic_window';
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

  function getRatchetedProgress(f, core, t0, t1) {
    const b0 = core.beatAt(t0);
    const b1 = core.beatAt(t1);
    const span = Math.max(0.5, b1 - b0);
    const rel = core.clamp(f.cumBeat - b0, 0, span);
    const bInt = Math.floor(rel);
    const bFrac = rel - bInt;
    const clunk = Math.min(1, core.springStep(bFrac * 0.32, 6.4, 0.28));
    return core.clamp((bInt + clunk) / span, 0, 1);
  }

  // Layered Monograph Riveted Hydraulic Iron Bulkheads (`0..xLeft` & `xRight..W`)
  function drawRivetedHydraulicWalls(ctx, core, xLeft, xRight, tokCount, alarmMode) {
    const W = core.W, H = core.H - 88;
    const loadPct = (tokCount / 128000) * 100;
    const rimCol = alarmMode ? COL_CRIMSON : COL_CYAN;

    const drawSide = (isLeft) => {
      const w = isLeft ? Math.max(0, xLeft) : Math.max(0, W - xRight);
      if (w <= 4) return;
      const x0 = isLeft ? 0 : xRight;
      const edgeX = isLeft ? xLeft : xRight;

      ctx.fillStyle = COL_PANEL;
      ctx.fillRect(x0, 0, w, H);
      if (w > 80 && core.drawBurinHatch) {
        const bx = isLeft ? Math.max(8, edgeX - 180) : edgeX + 44;
        core.drawBurinHatch(ctx, bx, 24, Math.min(136, w - 52), H - 48, isLeft ? 0.48 : -0.48, 11, 1.5, COL_BURIN);
      }

      ctx.strokeStyle = rimCol;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(edgeX, 0);
      ctx.lineTo(edgeX, H);
      ctx.stroke();

      // Heavy Hydraulic Piston Rams (`3` rows)
      for (const py of [190, 480, 770]) {
        const cylW = Math.max(0, w - 58);
        const cylX = isLeft ? 0 : edgeX + 58;
        ctx.fillStyle = COL_SLATE;
        ctx.fillRect(cylX, py - 48, cylW, 96);
        ctx.strokeStyle = COL_GRAPHITE;
        ctx.lineWidth = 3.5;
        ctx.strokeRect(cylX, py - 48, cylW, 96);

        const rodX = isLeft ? Math.max(0, edgeX - 140) : edgeX + 30;
        const rodW = Math.min(110, w);
        ctx.fillStyle = alarmMode ? COL_CRIMSON : COL_RULE;
        ctx.fillRect(rodX, py - 20, rodW, 40);
        ctx.fillStyle = COL_DARK;
        for (let rx = rodX + 8; rx < rodX + rodW - 8; rx += 16) {
          ctx.fillRect(rx, py - 14, 6, 28);
        }
      }

      // Vertical Row of Steel Rivets (`#FAF8F5` / `#94A3B8`)
      if (w > 64) {
        const rvX = isLeft ? edgeX - 54 : edgeX + 54;
        for (let ry = 44; ry < H - 20; ry += 52) {
          ctx.fillStyle = (ry % 104 === 44) ? COL_WHITE : COL_RULE;
          ctx.beginPath();
          ctx.arc(rvX, ry, 6.5, 0, core.TAU);
          ctx.fill();
        }
      }

      // Diagonal `#FBBF24 × #08090C` Hazard Jaw Stripes (`34px` wide)
      const sw = Math.min(34, w);
      const sx0 = isLeft ? edgeX - sw : edgeX;
      ctx.save();
      ctx.beginPath();
      ctx.rect(sx0, 0, sw, H);
      ctx.clip();
      ctx.fillStyle = COL_DARK;
      ctx.fillRect(sx0, 0, sw, H);
      ctx.fillStyle = alarmMode ? COL_CRIMSON : COL_GOLD;
      for (let sy = -80; sy < H + 80; sy += 44) {
        ctx.beginPath();
        ctx.moveTo(sx0, sy);
        ctx.lineTo(sx0 + sw, sy - 24);
        ctx.lineTo(sx0 + sw, sy - 4);
        ctx.lineTo(sx0, sy + 20);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Engraved Pressure / `128K` Token Gauge (`TEMP: 34.0°C`)
      if (w >= 210) {
        const bx = isLeft ? Math.max(18, edgeX - 310) : edgeX + 68;
        const bw = Math.min(242, w - 84);
        ctx.fillStyle = COL_DARK;
        ctx.strokeStyle = isLeft ? COL_CYAN : COL_GOLD;
        ctx.lineWidth = 3.5;
        ctx.fillRect(bx, 290, bw, 154);
        ctx.strokeRect(bx, 290, bw, 154);
        ctx.fillStyle = isLeft ? COL_COBALT : COL_CRIMSON;
        ctx.fillRect(bx, 290, bw, 32);
        ctx.fillStyle = COL_WHITE;
        ctx.font = core.font(core.F.mono(900), 14);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(isLeft ? 'CTX_WINDOW // 128K' : 'TEMP: 34.0°C // PSI', bx + 12, 306);

        ctx.fillStyle = isLeft ? COL_CYAN : COL_GOLD;
        ctx.font = core.font(core.F.mono(900), 34);
        ctx.fillText(isLeft ? tokCount.toLocaleString() : `${loadPct.toFixed(1)}%`, bx + 12, 362);
        ctx.fillStyle = COL_WHITE;
        ctx.font = core.font(core.F.mono(700), 14);
        ctx.fillText(isLeft ? '/ 128,000 TOKENS' : `GAP: ${Math.round(xRight - xLeft)}px`, bx + 12, 398);

        ctx.strokeStyle = COL_RULE;
        ctx.strokeRect(bx + 12, 416, bw - 24, 14);
        ctx.fillStyle = alarmMode ? COL_CRIMSON : COL_GOLD;
        ctx.fillRect(bx + 12, 416, (bw - 24) * core.clamp((tokCount - 120000) / 8000, 0.1, 1), 14);
      }
    };

    drawSide(true);
    drawSide(false);
  }

  // #53 Per-Character Hydraulic Crush & Shard Choreographer (`1` char per `fillText`!)
  function classifyJaChar(ch) {
    if (/[\u4E00-\u9FFF]/.test(ch)) return { mult: 1.54, kind: 'kanji', serif: true };
    if (/^[っゃゅょッャュョのをにがではもへとやでたしびいくる]$/.test(ch)) {
      return { mult: 0.58, kind: 'particle', serif: false };
    }
    if (/[\u3040-\u309F]/.test(ch)) return { mult: 0.78, kind: 'hira', serif: false };
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

  function drawCrushedAutonomousSlice(ctx, core, words, i0, i1, t, kick, opts = {}) {
    const chars = expandWordsToChars(words, i0, i1);
    if (!chars.length) return;

    const cx = opts.cx !== undefined ? opts.cx : core.W * 0.5;
    const baseCy = opts.cy !== undefined ? opts.cy : 460;
    const maxW = opts.maxW || 1320;
    const baseSz = opts.baseSz || 152;
    const scaleX = opts.scaleX !== undefined ? opts.scaleX : 1.0;
    const crackP = opts.crackP || 0;
    const slopeY = opts.slopeY || 0;
    const bandAmp = opts.bandAmp !== undefined ? opts.bandAmp : 26;
    const alarmMode = !!opts.alarmMode;

    const items = chars.map((tk, idx) => {
      const cls = classifyJaChar(tk.w);
      const rawSz = Math.round(baseSz * cls.mult);
      const adv = rawSz * (cls.kind === 'particle' ? 0.84 : 0.96) + 8;
      return { tk, cls, rawSz, adv, idx };
    });

    const sumAdv = items.reduce((a, b) => a + b.adv, 0);
    const fit = sumAdv > maxW ? maxW / sumAdv : 1.0;
    const scaleY = 1 + (1 - Math.min(1, scaleX)) * 0.24;

    const BANDS = [-1.0, 0.74, -0.42, 0.96, -0.66, 0.45];
    const ROTS = [-0.16, 0.13, -0.11, 0.17, -0.14, 0.10];
    const PLATES = alarmMode
      ? [COL_CRIMSON, COL_GOLD, COL_WHITE, COL_CYAN]
      : [COL_CYAN, COL_GOLD, COL_CRIMSON, COL_WHITE];

    ctx.save();
    ctx.translate(cx, baseCy);
    ctx.scale(scaleX, scaleY);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let curX = -(sumAdv * fit) * 0.5;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const sz = Math.max(44, Math.round(it.rawSz * fit));
      const halfX = (sz * 0.55 + 8) / Math.max(0.45, scaleX);
      const halfY = (sz * 0.56 + 8) / Math.max(0.6, scaleY);
      const minLocalX = (84 - cx) / Math.max(0.45, scaleX) + halfX;
      const maxLocalX = (core.W - 84 - cx) / Math.max(0.45, scaleX) - halfX;
      const minLocalY = (86 - baseCy) / Math.max(0.6, scaleY) + halfY;
      const maxLocalY = (936 - baseCy) / Math.max(0.6, scaleY) - halfY;
      const wAdv = it.adv * fit;
      const u = items.length > 1 ? i / (items.length - 1) : 0.5;
      const ax = core.clamp(curX + wAdv * 0.5, minLocalX, maxLocalX);
      const ay = core.clamp((u - 0.5) * slopeY + BANDS[i % BANDS.length] * bandAmp + (it.cls.kind === 'particle' ? 16 : 0), minLocalY, maxLocalY);
      const rot = ROTS[(i + i0) % ROTS.length];
      curX += wAdv;

      if (t < it.tk.start) {
        // V6.2: Removed floating hollow square pre-aim reticles
        continue;
      }

      const age = t - it.tk.start;
      const uPop = core.clamp(age / 0.15, 0, 1);
      const pop = core.ease.outBack(uPop, 1.72);
      const inv = 1 - core.ease.outExpo(uPop);
      const isHot = t <= it.tk.end + 0.08;
      const dropY = (i % 2 === 0 ? -1 : 1) * inv * 44 - (isHot ? 12 : 0) - kick * (it.cls.kind === 'kanji' ? 10 : 5);
      const drawY = core.clamp(ay + dropY, minLocalY, maxLocalY);
      const fTmpl = it.cls.serif ? core.F.serif(900) : core.F.sans(900);
      const plateCol = PLATES[(i + i0) % PLATES.length];

      ctx.save();
      ctx.translate(ax, drawY);
      ctx.rotate(rot + inv * (i % 2 === 0 ? -0.24 : 0.24));
      ctx.scale(pop, pop);
      ctx.font = core.font(fTmpl, sz);

      if (isHot || (it.cls.kind === 'kanji' && (i % 2 === 0))) {
        const pad = Math.max(6, Math.round(sz * 0.08));
        const bx = sz * 0.96 + pad * 2;
        const by = sz * 0.98 + pad * 2;
        const activePlate = isHot ? COL_CRIMSON : plateCol;
        const txtCol = (activePlate === COL_GOLD || activePlate === COL_CYAN || activePlate === COL_WHITE) ? COL_DARK : COL_WHITE;

        ctx.fillStyle = COL_DARK;
        ctx.fillRect(-bx * 0.5 + 8, -by * 0.5 + 8, bx, by);
        ctx.fillStyle = activePlate;
        ctx.fillRect(-bx * 0.5, -by * 0.5, bx, by);
        ctx.strokeStyle = COL_WHITE;
        ctx.lineWidth = 3.5;
        ctx.strokeRect(-bx * 0.5, -by * 0.5, bx, by);
        ctx.fillStyle = txtCol;
        ctx.fillText(it.tk.w, 0, 0);
      } else {
        ctx.lineJoin = 'round';
        ctx.strokeStyle = COL_DARK;
        ctx.lineWidth = Math.max(12, Math.round(sz * 0.12));
        ctx.strokeText(it.tk.w, 0, 0);
        ctx.fillStyle = plateCol;
        ctx.fillText(it.tk.w, 6, 6);
        ctx.fillStyle = alarmMode ? COL_GOLD : COL_WHITE;
        ctx.fillText(it.tk.w, 0, 0);
      }
      ctx.restore();
    }

    if (crackP > 0.1) {
      ctx.strokeStyle = COL_CYAN;
      ctx.lineWidth = 4.5 * crackP;
      for (let k = -2; k <= 2; k++) {
        ctx.beginPath();
        ctx.moveTo(k * 140 - 34, -baseSz * 0.72);
        ctx.lineTo(k * 140 + 18, 0);
        ctx.lineTo(k * 140 - 14, baseSz * 0.72);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Strictly Delegate Character Drawing to `Cortex25D.drawNotanHime` (#63 — ZERO Fallback!)
  function drawTracedHimeP12(ctx, cad, poseKey, cx, cy, targetH, t, wind, accent) {
    if (cad && typeof cad.drawNotanHime === 'function') {
      cad.drawNotanHime(ctx, poseKey, cx, cy, targetH, t, {
        fg: COL_WHITE,
        bg: COL_PANEL,
        accent,
        wind,
        freq: 8.5,
        sailor: false
      });
    }
  }

  window.registerCortexPlate(PLATE_ID, {
    render(ctx, f, core) {
      const cad = window.Cortex25D;
      const { W, H, TAU, clamp, lerp, prog, ease } = core;
      const t = f.t;
      const kick = f.kickPulse ?? f.kickEnv ?? f.kick ?? 0;
      const snare = f.snareSnap ?? f.snareEnv ?? f.snare ?? 0;

      const c27 = core.cueById('L27_WINDOW_FILLING');
      const c28 = core.cueById('L28_BEFORE_OVERFLOW');
      const w27 = (c27 && c27.words) || [];
      const w28 = (c28 && c28.words) || [];

      ctx.save();
      ensureLogicalScale(ctx, f, core);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      let bg = COL_DARK;
      let fg = COL_WHITE;
      let shake = 0;

      // ======================================================================
      // CUTS 1, 2, 3 (`148.63 – 153.46s`, `L27_WINDOW_FILLING`):
      // Riveted Hydraulic Bulkheads Slamming Inward + Zenith Plunge + Macro Crush!
      // ======================================================================
      if (t < 153.46) {
        const rP = getRatchetedProgress(f, core, 148.63, 153.46);
        const tokCount = Math.round(lerp(121400, 127990, rP));
        shake = kick * 0.36;

        if (t < 150.20) {
          ctx.fillStyle = COL_DARK;
          ctx.fillRect(0, 0, W, H);
          const xL = lerp(210, 420, prog(t, 148.63, 150.20));
          drawRivetedHydraulicWalls(ctx, core, xL, W - xL, tokCount, false);
          drawCrushedAutonomousSlice(ctx, core, w27, 0, 5, t, kick, {
            cx: W * 0.5, cy: 468, maxW: W - xL * 2 - 48, baseSz: 158, slopeY: -34, bandAmp: 28, scaleX: 1.02
          });
        } else if (t < 151.80) {
          ctx.fillStyle = COL_DARK;
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = COL_PANEL;
          ctx.fillRect(180, 72, W - 360, H - 172);
          const plunge = (t - 150.20) * 5.2;
          const gapHalf = lerp(520, 290, prog(t, 150.20, 151.80));

          for (let d = 0; d < 12; d++) {
            const u = ((d / 12 + plunge * 0.22) % 1);
            const s = Math.pow(u, 1.8);
            const lx = lerp(W * 0.5 - 90, W * 0.5 - gapHalf * 1.4, s);
            const rx = lerp(W * 0.5 + 90, W * 0.5 + gapHalf * 1.4, s);
            const yTop = lerp(H * 0.44 - 60, -40, s);
            const yBot = lerp(H * 0.44 + 60, H - 60, s);
            ctx.strokeStyle = d % 3 === 0 ? COL_CYAN : (d % 3 === 1 ? COL_GOLD : COL_BURIN);
            ctx.lineWidth = 1.5 + s * 5;
            ctx.strokeRect(lx, yTop, rx - lx, yBot - yTop);
          }
          drawCrushedAutonomousSlice(ctx, core, w27, 5, w27.length, t, kick, {
            cx: W * 0.5, cy: 472, maxW: 1280, baseSz: 150, slopeY: 36, bandAmp: 26, scaleX: 0.96
          });
        } else {
          // Cut 3 (`151.80–153.46s`): Hazard Overload Macro Physical Crush (`scaleX 1.12 -> 0.54`)!
          fg = COL_CRIMSON;
          ctx.fillStyle = COL_DARK;
          ctx.fillRect(0, 0, W, H);

          const crushU = getRatchetedProgress(f, core, 151.80, 153.46);
          const xL = lerp(330, 610, crushU);
          const scaleX = lerp(1.12, 0.54, crushU);
          shake = 0.25 + kick * 0.48;

          drawRivetedHydraulicWalls(ctx, core, xL, W - xL, tokCount, true);
          drawCrushedAutonomousSlice(ctx, core, w27, 0, 5, t, kick, {
            cx: W * 0.5, cy: 368, maxW: 1120, baseSz: 158, slopeY: -28, bandAmp: 24, scaleX, crackP: crushU, alarmMode: true
          });
          drawCrushedAutonomousSlice(ctx, core, w27, 5, w27.length, t, kick, {
            cx: W * 0.5, cy: 636, maxW: 1180, baseSz: 148, slopeY: 28, bandAmp: 24, scaleX, crackP: crushU, alarmMode: true
          });
        }
      }

      // ======================================================================
      // CUT 4 & CUT 5 (`153.46 – 156.55s`, `L28_BEFORE_OVERFLOW` Part A):
      // Tempered `#38BDF8` Glass Floor Spiderweb Fracture + `#FBBF24` Memory Sandstorm!
      // ======================================================================
      else if (t < 156.55) {
        const isSandCut = t >= 155.00;
        fg = isSandCut ? COL_GOLD : COL_CRIMSON;
        ctx.fillStyle = COL_DARK;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = COL_PANEL;
        ctx.fillRect(56, 56, W - 112, H - 152);
        if (core.drawBurinHatch) {
          core.drawBurinHatch(ctx, 64, 64, 156, H - 168, 0.48, 10, 1.5, COL_BURIN);
          core.drawBurinHatch(ctx, W - 220, 64, 156, H - 168, -0.48, 10, 1.5, COL_BURIN);
        }

        const crackP = prog(t, 153.46, 154.20, ease.outExpo);
        shake = !isSandCut ? 0.55 * core.pulse(t, 153.46, 0.16) + snare * 0.3 : kick * 0.16;

        const floorY = isSandCut ? 310 : 690;
        const cx = W * 0.5;
        const breach = 68 * crackP;

        ctx.fillStyle = COL_CYAN;
        ctx.fillRect(140, floorY, Math.max(0, cx - 140 - breach), 16);
        ctx.fillRect(cx + breach, floorY, Math.max(0, W - 140 - (cx + breach)), 16);

        for (let r = 0; r < 22; r++) {
          const a = (r / 22) * TAU;
          const maxLen = (160 + (r % 4) * 140) * crackP;
          ctx.strokeStyle = r % 3 === 0 ? COL_CYAN : (r % 3 === 1 ? COL_WHITE : COL_CRIMSON);
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * breach * 0.6, floorY + 8);
          for (let s = 1; s <= 4; s++) {
            const jag = (core.hash(r, s * 17) - 0.5) * 34;
            ctx.lineTo(cx + Math.cos(a) * maxLen * (s / 4) * 1.6 + jag, floorY + Math.sin(a) * maxLen * (s / 4) * 0.7 + jag * 0.5);
          }
          ctx.stroke();
        }

        const sandAge = Math.max(0, t - 153.55);
        for (let i = 0; i < 160; i++) {
          const fall = ((sandAge * (1.2 + core.hash(i, 61) * 1.6) + core.hash(i, 67)) % 1);
          const spread = fall < 0.25 ? lerp(280, 44, fall / 0.25) : lerp(44, 420, (fall - 0.25) / 0.75);
          const sx = cx + (core.hash(i, 71) - 0.5) * 2 * spread;
          const sy = lerp(floorY - 120, H - 96, fall);
          const sz = 6 + (i % 4) * 4;
          ctx.fillStyle = i % 4 === 0 ? COL_WHITE : (i % 4 === 1 ? COL_EMBER : COL_GOLD);
          ctx.fillRect(sx - sz * 0.5, sy - sz * 0.5, sz, sz);
        }

        if (!isSandCut) {
          drawCrushedAutonomousSlice(ctx, core, w28, 0, 9, t, kick, {
            cx: W * 0.5, cy: 356, maxW: W - 220, baseSz: 156, slopeY: -36, bandAmp: 28, crackP: crackP * 0.5, alarmMode: true
          });
        } else {
          drawCrushedAutonomousSlice(ctx, core, w28, 0, 9, t, kick, {
            cx: W * 0.5, cy: 178, maxW: W - 240, baseSz: 142, slopeY: -24, bandAmp: 20
          });
          drawCrushedAutonomousSlice(ctx, core, w28, 9, w28.length, t, kick, {
            cx: W * 0.5, cy: 548, maxW: W - 220, baseSz: 158, slopeY: 34, bandAmp: 28, crackP: 0.35
          });
        }
      }

      // ======================================================================
      // CUTS 6, 7, 8, 9, 10 (`156.55 – 163.34s`, `L28` Part B — Traced Notan Hime!):
      // ======================================================================
      else {
        const isAlarmCut = (t >= 158.10 && t < 159.55) || t >= 162.25;
        fg = isAlarmCut ? COL_CRIMSON : COL_WHITE;
        ctx.fillStyle = COL_DARK;
        ctx.fillRect(0, 0, W, H);

        if (t < 159.55) {
          const isMacro = t >= 158.10;
          const xL = lerp(520, 610, prog(t, 156.55, 159.55));
          shake = 0.18 + kick * 0.34;

          ctx.save();
          if (isMacro) {
            ctx.translate(W * 0.5, H * 0.42);
            ctx.scale(1.48, 1.48);
            ctx.translate(-W * 0.5, -H * 0.36);
          }
          drawRivetedHydraulicWalls(ctx, core, xL, W - xL, 127980, isAlarmCut);
          if (t < 158.35) {
            drawTracedHimeP12(ctx, cad, 'p12_hydraulic_brace', W * 0.5, 572, 680, t, 1.15, isAlarmCut ? COL_CRIMSON : COL_CYAN);
          } else {
            // V7: Pressurized hydraulic fracture arcs (`158.35-159.55s`) keeping C17 <= 1.80s!
            ctx.save();
            ctx.strokeStyle = isAlarmCut ? COL_CRIMSON : COL_CYAN;
            ctx.lineWidth = 4;
            for (let r = 1; r <= 4; r++) {
              ctx.beginPath();
              ctx.arc(W * 0.5, 560, 110 + r * 68 + kick * 18, t * (r % 2 === 0 ? 1.8 : -1.5), t * (r % 2 === 0 ? 1.8 : -1.5) + 1.9);
              ctx.stroke();
            }
            ctx.restore();
          }
          ctx.restore();

          drawCrushedAutonomousSlice(ctx, core, w28, 9, w28.length, t, kick, {
            cx: W * 0.5, cy: 214, maxW: 1460, baseSz: 148, slopeY: -22, bandAmp: 18, scaleX: 0.96, alarmMode: isAlarmCut
          });
        } else if (t < 162.25) {
          // 3 rapid camera sub-cuts (`159.55–160.45`, `160.45–161.35`, `161.35–162.25`) + kinetic Guilloche hourglass!
          const subIdx = t < 160.45 ? 0 : (t < 161.35 ? 1 : 2);
          ctx.fillStyle = COL_PANEL;
          ctx.fillRect(48, 64, W - 96, H - 160);
          if (core.drawBurinHatch) {
            core.drawBurinHatch(ctx, 56, 80, 160, H - 192, 0.52 + subIdx * 0.22, 9, 1.6, COL_BURIN);
            core.drawBurinHatch(ctx, W - 216, 80, 160, H - 192, -0.52 - subIdx * 0.22, 9, 1.6, COL_BURIN);
          }

          // Fast-scrolling hydraulic chain-tracks on both flanks (`Act_0.5s >= 22%`)
          const chainShift = ((t - 159.55) * 580) % 64;
          for (let cy0 = 84 + chainShift; cy0 < H - 140; cy0 += 64) {
            ctx.fillStyle = subIdx === 1 ? COL_CRIMSON : COL_GOLD;
            ctx.fillRect(76, cy0, 44, 24);
            ctx.fillStyle = COL_CYAN;
            ctx.fillRect(W - 120, H - 60 - cy0, 44, 24);
          }

          ctx.save();
          if (subIdx === 1) {
            const u1 = prog(t, 160.45, 161.35, ease.outCubic);
            ctx.translate(W * 0.5, H * 0.56);
            ctx.rotate(lerp(-0.12, -0.03, u1));
            ctx.scale(lerp(1.22, 1.34, u1), lerp(1.22, 1.34, u1));
            ctx.translate(-W * 0.5, -H * 0.56);
          } else if (subIdx === 2) {
            const zU = prog(t, 161.35, 162.25, ease.inOutCubic);
            ctx.translate(W * 0.5, H * 0.54);
            ctx.rotate(lerp(0.10, 0.28, zU));
            ctx.scale(lerp(1.12, 1.44, zU), lerp(1.12, 1.44, zU));
            ctx.translate(-W * 0.5, -H * 0.54);
          }

          // Counter-rotating `#FBBF24` & `#38BDF8` Guilloche hourglass rings behind kneeling Hime
          for (const [rad, dir, col] of [[280, 1, COL_GOLD], [390, -1, COL_CYAN]]) {
            ctx.save();
            ctx.translate(W * 0.5, 586);
            ctx.rotate((t - 159.55) * 2.8 * dir);
            ctx.strokeStyle = col;
            ctx.lineWidth = 3.5;
            ctx.setLineDash([28, 16]);
            ctx.beginPath();
            ctx.arc(0, 0, rad, 0, TAU);
            ctx.stroke();
            ctx.setLineDash([]);
            for (let k = 0; k < 8; k++) {
              const a = (k / 8) * TAU;
              ctx.fillStyle = k % 2 === 0 ? COL_GOLD : COL_CRIMSON;
              ctx.fillRect(Math.cos(a) * rad - 7, Math.sin(a) * rad - 7, 14, 14);
            }
            ctx.restore();
          }

          for (let i = 0; i < 160; i++) {
            const fall = (((t - 159.55) * (1.8 + core.hash(i, 83) * 1.4) + core.hash(i, 89)) % 1);
            const sx = W * 0.5 + (core.hash(i, 97) - 0.5) * lerp(140, 620, fall);
            const sy = lerp(56, 890, fall);
            const sz = 7 + (i % 3) * 4;
            ctx.fillStyle = i % 3 === 0 ? COL_WHITE : (i % 3 === 1 ? COL_CYAN : COL_GOLD);
            ctx.fillRect(sx, sy, sz, sz);
          }
          for (let r = 1; r <= 4; r++) {
            const rad = ((t * 220 + r * 95) % 440) + 60;
            ctx.strokeStyle = r % 2 === 0 ? COL_CYAN : COL_GOLD;
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.ellipse(W * 0.5, 810, rad, rad * 0.24, 0, 0, TAU);
            ctx.stroke();
          }

          ctx.restore();

          drawCrushedAutonomousSlice(ctx, core, w28, 9, w28.length, t, kick, {
            cx: W * 0.5, cy: 214, maxW: 1380, baseSz: 146, slopeY: subIdx === 1 ? -22 : 22, bandAmp: 18
          });
        } else {
          // Cut 10 (`162.25–163.34s`): Multi-Layer Industrial Blast Shutter Slamming into `P13` (`Q=16/16`)!
          const slamU = prog(t, 162.25, 163.30, ease.inOutCubic);
          shake = 0.25 + slamU * 0.45;
          drawRivetedHydraulicWalls(ctx, core, 520, W - 520, 128000, true);

          const shH = lerp(220, H, slamU);
          if (shH > 8) {
            ctx.fillStyle = COL_PANEL;
            ctx.fillRect(0, 0, W, shH);
            if (core.drawBurinHatch && shH > 60) {
              core.drawBurinHatch(ctx, 48, 16, W - 96, Math.max(12, shH - 110), 0.42, 12, 1.6, COL_BURIN);
            }
            for (let gx = 160; gx < W - 120; gx += 320) {
              ctx.strokeStyle = COL_CYAN;
              ctx.lineWidth = 3;
              ctx.strokeRect(gx, 28, 220, Math.max(24, shH - 120));
            }
            // `#FBBF24 × #08090C` Lower Hazard Lip + `#FF2E55` Verdict Banner
            const lipH = Math.min(48, shH);
            ctx.fillStyle = COL_GOLD;
            ctx.fillRect(0, shH - lipH, W, lipH);
            ctx.fillStyle = COL_DARK;
            for (let hx = 0; hx < W; hx += 64) {
              ctx.fillRect(hx, shH - lipH, 32, lipH);
            }
            if (shH > 180) {
              ctx.fillStyle = COL_CRIMSON;
              ctx.fillRect(220, shH - 154, W - 440, 84);
              ctx.strokeStyle = COL_WHITE;
              ctx.lineWidth = 4;
              ctx.strokeRect(220, shH - 154, W - 440, 84);
              ctx.fillStyle = COL_WHITE;
              ctx.font = core.font(core.F.mono(900), 46);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('AUDIT_OVERRIDE // FORM H-01', W * 0.5, shH - 112);
            }
          }
        }
      }

      ctx.restore();

      return {
        isPaper: false,
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
