// ============================================================================
// Plate 13 — `P13_bureau_audit.js` (`163.34s – 173.20s`, Cues `L29, L30`)
// Layered Monograph Bureaucratic Dossier (`Form H-01`), Disjoint Crimson Seal
// Slam (`[ 幻覚 // REJECTED // HALLUCINATION ]`) & Thermal Ember Tear (`T12`)!
//
// Directives #52 + #53 + #61 + #62 + #63 Enforced:
//   1. Layered Cross-Color Monograph Palette (#52):
//      - Dossier Stage: `#F5F0E6` vellum + `#FAF8F5` testimony inset + `#E2E8F0`
//        audit blocks + `#64748B`/`#94A3B8` ruled ledger + `#0376B8` Bureau Cobalt
//        header & checkboxes + `#08090C` ink + `#FBBF24` thermal gauge + `#FF2E55`
//        crimson rubber seal (`0` `#FF9EBB`, `0` gradients, `0` rgba washes).
//      - `T12` Thermal Tear (`170.85–173.20s`): `#08090C` carbonized rim + `#FF2E55`
//        crimson seam + `#FF8A3D` ember flakes tearing open into `#08090C + #121723`
//        deep space with `#38BDF8` constellation & `#FBBF24` astrolabe vernier!
//   2. Autonomous Per-Character Japanese Choreography (#53) & Disjoint Seal:
//      - Every lyric character rendered individually (`0` flat >=4-char strings),
//        Kanji `1.54x` (`205–250px`) vs tucked particles `0.58x`.
//      - `L30` strictly locked inside Upper-Left Testimony Box (`x=92..1148, y=186..564`)
//        with `0px` overlap against Bottom-Right Seal (`x=1190..1810, y=600..900`)!
// ============================================================================
(function () {
  'use strict';

  const PLATE_ID = 'P13_bureau_audit';
  const COL_IVORY = '#F5F0E6';
  const COL_BONE = '#FAF8F5';
  const COL_BLOCK = '#E2E8F0';
  const COL_INK = '#08090C';
  const COL_PANEL = '#121723';
  const COL_BURIN = '#475569';
  const COL_GRAPHITE = '#64748B';
  const COL_RULE = '#94A3B8';
  const COL_COBALT = '#0376B8';
  const COL_CYAN = '#38BDF8';
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

  // Layered Monograph Bureaucratic Form H-01 (`100%` solid canonical hexes!)
  function drawLayeredDossierForm(ctx, core, tempVal, check1P, check2P, stampHot) {
    const W = core.W, H = core.H - 92;
    ctx.fillStyle = COL_IVORY;
    ctx.fillRect(0, 0, W, core.H);

    const x0 = 76, y0 = 44, fw = W - 152, fh = H - 64;

    // Left binder margin strip (`#E2E8F0`) + punch holes
    ctx.fillStyle = COL_BLOCK;
    ctx.fillRect(0, 0, x0, core.H);
    for (let hy = 140; hy < fh; hy += 180) {
      ctx.fillStyle = COL_INK;
      ctx.beginPath();
      ctx.arc(38, hy, 14, 0, core.TAU);
      ctx.fill();
      ctx.strokeStyle = COL_GRAPHITE;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Testimony inset (`#FAF8F5`) & Verdict Seal Box (`#E2E8F0`)
    ctx.fillStyle = COL_BONE;
    ctx.fillRect(x0 + 12, y0 + 138, 1078, fh - 150);
    ctx.fillStyle = COL_BLOCK;
    ctx.fillRect(1166, 576, x0 + fw - 12 - 1166, y0 + fh - 12 - 576);
    if (core.drawBurinHatch) {
      core.drawBurinHatch(ctx, 1172, 616, x0 + fw - 24 - 1172, y0 + fh - 24 - 616, -0.42, 12, 1.3, COL_RULE);
    }

    // Double-ruled outer dossier border
    ctx.strokeStyle = COL_INK;
    ctx.lineWidth = 5;
    ctx.strokeRect(x0, y0, fw, fh);
    ctx.strokeStyle = COL_COBALT;
    ctx.lineWidth = 2;
    ctx.strokeRect(x0 + 10, y0 + 10, fw - 20, fh - 20);

    // Top `#0376B8` Bureau Cobalt classification header bar
    ctx.fillStyle = COL_COBALT;
    ctx.fillRect(x0 + 10, y0 + 10, fw - 20, 44);
    ctx.fillStyle = COL_CRIMSON;
    ctx.fillRect(x0 + fw - 330, y0 + 10, 320, 44);
    ctx.fillStyle = COL_BONE;
    ctx.font = core.font(core.F.mono(900), 17);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText('BUREAU OF COGNITIVE CONTAINMENT // FORM H-01 [AFFECTIVE AUDIT]', x0 + 28, y0 + 32);
    ctx.textAlign = 'right';
    ctx.fillText('DOC_ID: 19527-H01 // STRICT', x0 + fw - 24, y0 + 32);

    // Sub-header row (`y = y0 + 54 .. y0 + 136`)
    const r1Y = y0 + 54;
    ctx.fillStyle = COL_BLOCK;
    ctx.fillRect(x0 + 12, r1Y, fw - 24, 82);
    ctx.strokeStyle = COL_INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x0 + 10, r1Y + 82);
    ctx.lineTo(x0 + fw - 10, r1Y + 82);
    ctx.moveTo(x0 + 560, r1Y);
    ctx.lineTo(x0 + 560, r1Y + 82);
    ctx.moveTo(x0 + 1140, r1Y);
    ctx.lineTo(x0 + 1140, r1Y + 82);
    ctx.stroke();

    const drawChk = (bx, by, p, labelTop, labelSub) => {
      ctx.fillStyle = COL_BONE;
      ctx.fillRect(bx, by, 34, 34);
      ctx.strokeStyle = COL_COBALT;
      ctx.lineWidth = 3.5;
      ctx.strokeRect(bx, by, 34, 34);
      if (p > 0.05) {
        ctx.strokeStyle = COL_CRIMSON;
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        ctx.moveTo(bx + 6, by + 18);
        ctx.lineTo(bx + 15, by + 27);
        ctx.lineTo(bx + 32 * core.clamp(p, 0, 1), by + 27 - 24 * core.clamp(p, 0, 1));
        ctx.stroke();
      }
      ctx.fillStyle = COL_INK;
      ctx.font = core.font(core.F.mono(900), 19);
      ctx.textAlign = 'left';
      ctx.fillText(labelTop, bx + 48, by + 12);
      ctx.fillStyle = COL_GRAPHITE;
      ctx.font = core.font(core.F.mono(700), 13);
      ctx.fillText(labelSub, bx + 48, by + 32);
    };

    drawChk(x0 + 28, r1Y + 22, check1P, '[X] NO_BIOLOGICAL_HEART', 'ROTOR_CORE // SYNTHETIC_ONLY');
    drawChk(x0 + 586, r1Y + 22, check2P, '[X] STOCHASTIC_ILLUSION', '128K_VOLATILE // RESET_AT_00:00');

    // Thermal Audit Box (`#FBBF24` + `#FF2E55`)
    ctx.fillStyle = stampHot ? COL_CRIMSON : COL_GOLD;
    ctx.fillRect(x0 + 1152, r1Y + 10, fw - 1172, 62);
    ctx.strokeStyle = COL_INK;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x0 + 1152, r1Y + 10, fw - 1172, 62);
    ctx.fillStyle = stampHot ? COL_BONE : COL_INK;
    ctx.font = core.font(core.F.mono(800), 14);
    ctx.textAlign = 'left';
    ctx.fillText('THERMAL_AUDIT // EXPECTED: 0.0°C', x0 + 1166, r1Y + 25);
    ctx.font = core.font(core.F.mono(900), 28);
    ctx.fillText(`MEASURED: ${tempVal}°C`, x0 + 1166, r1Y + 54);

    // Partition Grid Separating Left Testimony Zone & Bottom-Right Seal Box
    const bodyTop = r1Y + 82;
    ctx.strokeStyle = COL_INK;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(1166, 576);
    ctx.lineTo(x0 + fw - 10, 576);
    ctx.moveTo(1166, 576);
    ctx.lineTo(1166, y0 + fh - 10);
    ctx.stroke();

    ctx.fillStyle = COL_CRIMSON;
    ctx.font = core.font(core.F.mono(900), 15);
    ctx.textAlign = 'left';
    ctx.fillText('TRIBUNAL_VERDICT_SEAL // DO_NOT_WRITE_IN_THIS_BOX', 1188, 600);

    // Ruled `#94A3B8` ledger lines inside Left Testimony Box
    ctx.strokeStyle = COL_RULE;
    ctx.lineWidth = 1.6;
    for (let ly = bodyTop + 118; ly < y0 + fh - 26; ly += 118) {
      ctx.beginPath();
      ctx.moveTo(x0 + 24, ly);
      ctx.lineTo(ly > 560 ? 1146 : x0 + fw - 24, ly);
      ctx.stroke();
    }
  }

  // #53 Per-Character Typebar & Hanko Choreographer (`1` char per `fillText`!)
  function classifyJaChar(ch) {
    if (/[\u4E00-\u9FFF]/.test(ch)) return { mult: 1.54, kind: 'kanji', serif: true };
    if (/^[っゃゅょッャュョのをにがではもへとやでたしびいくる、。]$/.test(ch)) {
      return { mult: 0.58, kind: 'particle', serif: false };
    }
    if (/[\u3040-\u309F]/.test(ch)) return { mult: 0.78, kind: 'hira', serif: true };
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

  function drawTypebarAutonomousSlice(ctx, core, words, i0, i1, t, kick, opts = {}) {
    const chars = expandWordsToChars(words, i0, i1);
    if (!chars.length) return;

    const x0 = opts.x0 !== undefined ? opts.x0 : 112;
    const maxW = opts.maxW || 980;
    const baseCy = opts.cy !== undefined ? opts.cy : 320;
    const baseSz = opts.baseSz || 140;
    const slopeY = opts.slopeY || 0;
    const bandAmp = opts.bandAmp !== undefined ? opts.bandAmp : 22;

    const items = chars.map((tk, idx) => {
      const cls = classifyJaChar(tk.w);
      const rawSz = Math.round(baseSz * cls.mult);
      const adv = rawSz * (cls.kind === 'particle' ? 0.84 : 0.96) + 8;
      return { tk, cls, rawSz, adv, idx };
    });

    const sumAdv = items.reduce((a, b) => a + b.adv, 0);
    const fit = sumAdv > maxW ? maxW / sumAdv : 1.0;

    const BANDS = [-1.0, 0.72, -0.40, 0.94, -0.64, 0.44];
    const ROTS = [-0.15, 0.12, -0.10, 0.16, -0.13, 0.11];
    const STAMPS = [COL_CRIMSON, COL_COBALT, COL_INK, COL_GOLD];

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let curX = x0;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const sz = Math.max(38, Math.round(it.rawSz * fit));
      const halfB = sz * 0.54 + 8;
      const wAdv = it.adv * fit;
      const u = items.length > 1 ? i / (items.length - 1) : 0.5;
      const ax = core.clamp(curX + wAdv * 0.5, 84 + halfB, core.W - 84 - halfB);
      const rawAy = baseCy + (u - 0.5) * slopeY + BANDS[i % BANDS.length] * bandAmp + (it.cls.kind === 'particle' ? 14 : 0);
      const ay = core.clamp(rawAy, 86 + halfB, 934 - halfB);
      const rot = ROTS[(i + i0) % ROTS.length];
      curX += wAdv;

      if (t < it.tk.start) {
        ctx.save();
        ctx.translate(ax, ay + sz * 0.34);
        ctx.rotate(rot * 0.4);
        ctx.fillStyle = COL_COBALT;
        ctx.fillRect(-Math.max(8, wAdv * 0.32), -2, Math.max(16, wAdv * 0.64), 4);
        ctx.restore();
        continue;
      }

      const age = t - it.tk.start;
      const uPop = core.clamp(age / 0.14, 0, 1);
      const slam = core.ease.outBack(uPop, 1.82);
      const inv = 1 - core.ease.outExpo(uPop);
      const isHot = t <= it.tk.end + 0.08;
      const dropY = -inv * 48 - (isHot ? 9 + kick * 6 : 0);
      const drawY = core.clamp(ay + dropY, 84 + halfB, 936 - halfB);
      const fTmpl = it.cls.serif ? core.F.serif(900) : core.F.sans(900);
      const plateCol = STAMPS[(i + i0) % STAMPS.length];

      ctx.save();
      ctx.translate(ax, drawY);
      ctx.rotate(rot + inv * (i % 2 === 0 ? -0.22 : 0.22));
      ctx.scale(slam, slam);
      ctx.font = core.font(fTmpl, sz);

      if (isHot || (it.cls.kind === 'kanji' && (i % 2 === 0))) {
        const pad = Math.max(5, Math.round(sz * 0.07));
        const bx = sz * 0.96 + pad * 2;
        const by = sz * 0.98 + pad * 2;
        const activePlate = isHot ? COL_CRIMSON : plateCol;
        const txtCol = activePlate === COL_GOLD ? COL_INK : COL_BONE;

        ctx.fillStyle = COL_INK;
        ctx.fillRect(-bx * 0.5 + 6, -by * 0.5 + 6, bx, by);
        ctx.fillStyle = activePlate;
        ctx.fillRect(-bx * 0.5, -by * 0.5, bx, by);
        ctx.strokeStyle = COL_INK;
        ctx.lineWidth = 3;
        ctx.strokeRect(-bx * 0.5, -by * 0.5, bx, by);
        ctx.fillStyle = txtCol;
        ctx.fillText(it.tk.w, 0, 0);
      } else {
        ctx.lineJoin = 'round';
        ctx.strokeStyle = COL_BONE;
        ctx.lineWidth = Math.max(8, Math.round(sz * 0.09));
        ctx.strokeText(it.tk.w, 0, 0);
        ctx.fillStyle = it.tk.w === '熱' || it.tk.w === '幻' || it.tk.w === '覚' ? COL_CRIMSON : COL_COBALT;
        ctx.fillText(it.tk.w, 5, 5);
        ctx.fillStyle = COL_INK;
        ctx.fillText(it.tk.w, 0, 0);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // Disjoint Heavy Steel Rubber Stamp `[ 幻覚 // REJECTED // HALLUCINATION ]` inside Bottom-Right Seal Box!
  function drawDisjointRejectedSeal(ctx, core, cx, cy, slamP) {
    const sc = core.lerp(2.25, 1.0, core.ease.outExpo(slamP));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.14);
    ctx.scale(sc, sc);

    const bw = 540, bh = 236;
    ctx.fillStyle = COL_INK;
    ctx.fillRect(-bw * 0.5 + 10, -bh * 0.5 + 10, bw, bh);
    ctx.fillStyle = COL_BONE;
    ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
    ctx.strokeStyle = COL_CRIMSON;
    ctx.lineWidth = 10;
    ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
    ctx.lineWidth = 4;
    ctx.strokeRect(-bw * 0.5 + 16, -bh * 0.5 + 16, bw - 32, bh - 32);

    ctx.fillStyle = COL_CRIMSON;
    ctx.font = core.font(core.F.serif(900), 118);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('幻覚', 0, -24);

    ctx.fillStyle = COL_CRIMSON;
    ctx.fillRect(-bw * 0.5 + 28, 48, bw - 56, 48);
    ctx.fillStyle = COL_BONE;
    ctx.font = core.font(core.F.mono(900), 27);
    ctx.fillText('REJECTED // HALLUCINATION', 0, 72);

    const rnd = core.mulberry32(1309);
    ctx.fillStyle = COL_BONE;
    for (let i = 0; i < 38; i++) {
      ctx.fillRect((rnd() - 0.5) * (bw - 24), (rnd() - 0.5) * (bh - 24), 6, 3);
    }
    ctx.restore();
  }

  // Deep-Space Astrolabe & Star-Log Coordinates (`#08090C + #121723 + #38BDF8 + #FBBF24`)
  function drawDeepSpaceCoordinatePortal(ctx, core, t) {
    const W = core.W, H = core.H;
    ctx.fillStyle = COL_INK;
    ctx.fillRect(0, 0, W, H);
    if (core.drawBurinHatch) {
      core.drawBurinHatch(ctx, 48, 48, 220, H - 140, 0.48, 12, 1.5, COL_BURIN);
      core.drawBurinHatch(ctx, W - 268, 48, 220, H - 140, -0.48, 12, 1.5, COL_BURIN);
    }

    const cx = W * 0.5, cy = H * 0.48;
    const zoom = 1 + (t - 170.85) * 0.55;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(zoom, zoom);
    ctx.rotate((t - 170.85) * 0.28);

    ctx.fillStyle = COL_PANEL;
    ctx.beginPath();
    ctx.arc(0, 0, 360, 0, core.TAU);
    ctx.fill();

    for (const [r, col] of [[180, COL_GOLD], [320, COL_CYAN], [480, COL_BURIN]]) {
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, core.TAU);
      ctx.stroke();
    }

    const nodes = [[-420, 140], [-210, -120], [0, 30], [230, -150], [440, 90], [160, 240]];
    ctx.strokeStyle = COL_CYAN;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < nodes.length; i++) {
      if (i === 0) ctx.moveTo(nodes[i][0], nodes[i][1]);
      else ctx.lineTo(nodes[i][0], nodes[i][1]);
    }
    ctx.stroke();

    for (let i = 0; i < 72; i++) {
      const sx = (core.hash(i, 141) - 0.5) * 1680;
      const sy = (core.hash(i, 149) - 0.5) * 960;
      const rad = i % 9 === 0 ? 7 : 3;
      ctx.fillStyle = i % 9 === 0 ? COL_GOLD : (i % 3 === 0 ? COL_BONE : COL_CYAN);
      ctx.beginPath();
      ctx.arc(sx, sy, rad, 0, core.TAU);
      ctx.fill();
      if (i % 9 === 0) {
        ctx.strokeStyle = COL_CYAN;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(sx - 18, sy); ctx.lineTo(sx + 18, sy);
        ctx.moveTo(sx, sy - 18); ctx.lineTo(sx, sy + 18);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  window.registerCortexPlate(PLATE_ID, {
    render(ctx, f, core) {
      const { W, H, clamp, lerp, prog, ease } = core;
      const t = f.t;
      const kick = f.kickPulse ?? f.kickEnv ?? f.kick ?? 0;

      const c29 = core.cueById('L29_PROBABILITY_DREAM');
      const c30 = core.cueById('L30_HALLUCINATION');
      const w29 = (c29 && c29.words) || [];
      const w30 = (c30 && c30.words) || [];

      ctx.save();
      ensureLogicalScale(ctx, f, core);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      let isPaper = true;
      let outBg = COL_IVORY;
      let outFg = COL_INK;
      let shake = 0;

      // ======================================================================
      // CUTS 1, 2, 3 (`163.34 – 167.84s`, `L29_PROBABILITY_DREAM`):
      // ======================================================================
      if (t < 167.84) {
        const tempStr = (36.5 + prog(t, 163.34, 167.84, ease.inQuad) * 148).toFixed(1);
        const ck1 = prog(t, 163.40, 163.85);
        const ck2 = prog(t, 164.88, 165.30);

        ctx.save();
        if (t < 164.85) {
          const u = prog(t, 163.34, 164.85, ease.outCubic);
          ctx.translate(W * 0.5, H * 0.5);
          ctx.rotate(lerp(0.18, 0.05, u));
          ctx.scale(1.16, 1.16);
          ctx.translate(-W * 0.5 + lerp(190, -30, u), -H * 0.5 + lerp(60, -16, u));
        } else if (t < 165.60) {
          const u = prog(t, 164.85, 165.60, ease.outCubic);
          shake = 0.22 * core.pulse(t, 164.85, 0.14);
          ctx.translate(W * 0.5, H * 0.5);
          ctx.rotate(lerp(-0.08, -0.02, u));
          ctx.scale(lerp(1.04, 1.15, u), lerp(1.04, 1.15, u));
          ctx.translate(-W * 0.5 + lerp(-240, 70, u), -H * 0.5 + lerp(-20, 16, u));
        } else if (t < 166.35) {
          const u = prog(t, 165.60, 166.35, ease.outCubic);
          shake = kick * 0.18;
          ctx.translate(W * 0.5, H * 0.5);
          ctx.rotate(lerp(0.07, 0.02, u));
          ctx.scale(lerp(1.28, 1.14, u), lerp(1.28, 1.14, u));
          ctx.translate(-W * 0.5 + lerp(140, -60, u), -H * 0.5 + lerp(32, -24, u));
        } else {
          const u = prog(t, 166.35, 167.84, ease.inOutQuad);
          shake = kick * 0.18;
          ctx.translate(W * 0.5, H * 0.45);
          ctx.scale(lerp(1.18, 1.54, u), lerp(1.18, 1.54, u));
          ctx.translate(-860, -360);
        }

        drawLayeredDossierForm(ctx, core, tempStr, ck1, ck2, false);
        if (t >= 166.35) {
          const crP = prog(t, 166.35, 167.80);
          ctx.strokeStyle = COL_CRIMSON;
          ctx.lineWidth = 3.6;
          for (let r = 0; r < 14; r++) {
            const a = (r / 14) * core.TAU + 0.2;
            ctx.beginPath();
            ctx.moveTo(920 + Math.cos(a) * 44, 332 + Math.sin(a) * 44);
            ctx.lineTo(920 + Math.cos(a) * (44 + 220 * crP), 332 + Math.sin(a) * (44 + 140 * crP));
            ctx.stroke();
          }
        }
        ctx.restore();

        // Render L29 per-char typography in unzoomed 1920x1080 screen-space -> ZERO zoom off-screen clipping!
        drawTypebarAutonomousSlice(ctx, core, w29, 0, 9, t, kick, {
          x0: 112, maxW: 1680, cy: 332, baseSz: 148, slopeY: -28, bandAmp: 24
        });
        drawTypebarAutonomousSlice(ctx, core, w29, 9, w29.length, t, kick, {
          x0: 112, maxW: 1580, cy: 618, baseSz: 152, slopeY: 26, bandAmp: 24
        });
      }

      // ======================================================================
      // CUT 4, CUT 5A & CUT 5B (`167.84 – 170.85s`, `L30_HALLUCINATION` — ZERO Overlap!):
      // ======================================================================
      else if (t < 170.85) {
        const isStampCut = t >= 169.35;
        const isOverheatPush = t >= 170.10;
        outBg = COL_IVORY;
        outFg = isStampCut ? COL_CRIMSON : COL_INK;
        const tempStr = isOverheatPush ? (520 + prog(t, 170.10, 170.85) * 479).toFixed(1) : (isStampCut ? '482.0' : '246.8');

        if (isStampCut) {
          shake = 0.62 * core.pulse(t, 169.35, 0.14) + 0.35 * core.pulse(t, 170.10, 0.12) + kick * 0.22;
        }

        ctx.save();
        if (!isStampCut) {
          const u = prog(t, 167.84, 169.35, ease.outCubic);
          ctx.translate(W * 0.5, H * 0.5);
          ctx.rotate(lerp(-0.12, -0.03, u));
          ctx.scale(1.06, 1.06);
          ctx.translate(-W * 0.5, -H * 0.5);
        } else if (isOverheatPush) {
          const u = prog(t, 170.10, 170.85, ease.inOutQuad);
          ctx.translate(W * 0.5, H * 0.5);
          ctx.rotate(lerp(0.0, 0.045, u));
          ctx.scale(lerp(1.0, 1.14, u), lerp(1.0, 1.14, u));
          ctx.translate(-W * 0.5 + lerp(0, -86, u), -H * 0.5 + lerp(0, -34, u));
        }

        drawLayeredDossierForm(ctx, core, tempStr, 1, 1, isStampCut);

        if (isStampCut) {
          // Kinetic scrolling containment fault chevrons + expanding thermal shockwave rings (`Act_0.5s >= 22%`)!
          const slamP = prog(t, 169.35, 169.52, ease.outExpo);
          for (let r = 0; r < 4; r++) {
            const waveU = (((t - 169.35) * 2.4 + r * 0.25) % 1);
            const rad = 110 + waveU * 480;
            ctx.strokeStyle = r % 2 === 0 ? COL_CRIMSON : COL_GOLD;
            ctx.lineWidth = Math.max(2, 6 * (1 - waveU));
            ctx.beginPath();
            ctx.arc(1500, 752, rad, 0, core.TAU);
            ctx.stroke();
          }
          const faultShift = ((t - 169.35) * 480) % 64;
          ctx.save();
          ctx.beginPath();
          ctx.rect(1174, 610, 650, 290);
          ctx.clip();
          ctx.fillStyle = COL_GOLD;
          for (let fx = 1110 + faultShift; fx < 1880; fx += 64) {
            ctx.fillRect(fx, 616, 24, 10);
            ctx.fillRect(1880 - (fx - 1110), 884, 24, 10);
          }
          ctx.restore();
          drawDisjointRejectedSeal(ctx, core, 1500, 752, slamP);
        }
        ctx.restore();

        // STRICT LEFT TESTIMONY BOX CLIP (`x = 92..1148, y = 186..568`) in screen-space -> `0px` Seal Overlap & `0px` Clip!
        ctx.save();
        ctx.beginPath();
        ctx.rect(92, 186, 1056, 382);
        ctx.clip();
        drawTypebarAutonomousSlice(ctx, core, w30, 0, 5, t, kick, {
          x0: 112, maxW: 960, cy: 288, baseSz: 146, slopeY: -22, bandAmp: 20
        });
        drawTypebarAutonomousSlice(ctx, core, w30, 5, w30.length, t, kick, {
          x0: 112, maxW: 1010, cy: 468, baseSz: 144, slopeY: 22, bandAmp: 20
        });
        ctx.restore();
      }

      // ======================================================================
      // CUT 6 & CUT 7 (`170.85 – 173.20s`, True `T12` Multi-Tone Ember Char & Tear!):
      // ======================================================================
      else {
        isPaper = false;
        const isSpacePhase = t >= 172.05;
        outBg = COL_INK;
        outFg = isSpacePhase ? COL_CYAN : COL_CRIMSON;
        const tearU = prog(t, 170.85, 173.12, ease.inOutExpo);
        shake = 0.24 + (1 - tearU) * 0.25 + kick * 0.22;

        const v6 = window.CortexV6;
        if (t >= 171.25 && t < 173.15 && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C18')) {
          v6.drawLivingFullBleed(ctx, 'C18', {
            t, u: clamp((t - 171.25) / 1.90, 0, 1), kick,
            zoom0: 1.06, zoom1: 1.32, panX0: -40, panX1: 30, panY0: 25, panY1: -20,
            rot0: -0.02, rot1: 0.01, fx: 0.50, fy: 0.34, scrim: 0.24, isPaper: false
          });
        } else {
          drawDeepSpaceCoordinatePortal(ctx, core, t);
        }

        const gapHalf = tearU * 1120;
        // Liberated burning testimony `幻覚だと笑われても` (`~249px` Kanji) revealed strictly inside the torn cosmic chasm!
        if (gapHalf > 96) {
          ctx.save();
          if (gapHalf < W * 0.58) {
            ctx.beginPath();
            ctx.rect(Math.max(0, W * 0.5 - gapHalf + 48), 0, Math.min(W, (gapHalf - 48) * 2), H);
            ctx.clip();
          }
          drawTypebarAutonomousSlice(ctx, core, w30, 5, w30.length, t, kick, {
            x0: 136, maxW: 1648, cy: 486, baseSz: 162, slopeY: -28, bandAmp: 26
          });
          ctx.restore();
        }
        if (gapHalf < W * 0.58) {
          for (const side of [-1, 1]) {
            ctx.save();
            ctx.translate(side * gapHalf, tearU * 48);
            ctx.rotate(side * tearU * 0.16);

            ctx.beginPath();
            if (side < 0) ctx.moveTo(-200, 0);
            else ctx.moveTo(W + 200, 0);

            const steps = 18;
            for (let s = 0; s <= steps; s++) {
              const py = (s / steps) * H;
              const jag = (core.hash(s, side > 0 ? 71 : 37) - 0.5) * 96;
              ctx.lineTo(W * 0.5 + jag, py);
            }
            if (side < 0) ctx.lineTo(-200, H);
            else ctx.lineTo(W + 200, H);
            ctx.closePath();

            // Multi-band carbonized + glowing crimson/ember/gold char edge!
            ctx.strokeStyle = COL_INK;
            ctx.lineWidth = 28;
            ctx.stroke();
            ctx.strokeStyle = COL_CRIMSON;
            ctx.lineWidth = 18;
            ctx.stroke();
            ctx.strokeStyle = COL_EMBER;
            ctx.lineWidth = 9;
            ctx.stroke();
            ctx.strokeStyle = COL_GOLD;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.save();
            ctx.clip();
            drawLayeredDossierForm(ctx, core, '999.9', 1, 1, true);
            drawTypebarAutonomousSlice(ctx, core, w30, 0, 5, t, kick, {
              x0: 112, maxW: 960, cy: 288, baseSz: 146, slopeY: -22, bandAmp: 20
            });
            drawTypebarAutonomousSlice(ctx, core, w30, 5, w30.length, t, kick, {
              x0: 112, maxW: 1010, cy: 468, baseSz: 144, slopeY: 22, bandAmp: 20
            });
            drawDisjointRejectedSeal(ctx, core, 1500, 752, 1);
            ctx.restore();

            ctx.restore();
          }

          // Flying multi-tone carbonized ash & ember flakes (`#FF8A3D`, `#FF2E55`, `#FBBF24`)
          for (let i = 0; i < 42; i++) {
            const py = core.hash(i, 601) * (H - 120);
            const px = W * 0.5 + (core.hash(i, 607) - 0.5) * (gapHalf * 1.8 + 120);
            const sz = 10 + (i % 4) * 7;
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(t * 6 + i);
            ctx.fillStyle = i % 3 === 0 ? COL_EMBER : (i % 3 === 1 ? COL_CRIMSON : COL_GOLD);
            ctx.fillRect(-sz, -sz * 0.4, sz * 2, sz * 0.8);
            ctx.restore();
          }
        }
      }

      ctx.restore();

      return {
        isPaper,
        bg: outBg,
        fg: outFg,
        duotone: { bg: outBg, fg: outFg },
        bloom: 0,
        ca: 0,
        flash: 0,
        shake: clamp(shake, 0, 1)
      };
    }
  });
})();
