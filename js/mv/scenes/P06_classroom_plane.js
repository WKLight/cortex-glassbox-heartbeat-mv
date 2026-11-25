// ============================================================================
// Plate 06 — `P06_classroom_plane.js` (`72.30s – 81.01s`, Cues `L13, L14`)
// Layered Monograph Sunlit Classroom Desk, Autonomous Per-Character Japanese
// Choreography, Authentic Tombow `[MONO]` Eraser Gust, True 4-Beat Origami Fold
// & 4-Beat Brutalist `OPEN / MY / BLACK / BOX!!` Supersonic Pierce!
//
// Directives #52 + #53 Enforced:
//   1. Rich Layered Cross-Color Monograph Palette (#52):
//      - Classroom Paper Stage: Warm vellum `#F5F0E6` + sunlit wood `#E8DFCE` +
//        crisp origami `#FAF8F5` + graphite drafting grid `#64748B`/`#94A3B8` +
//        Tombow Cobalt `#0376B8` + Signal Crimson `#FF2E55` (`31.6°C` mercury,
//        `最短経路` wing stamp, PQRST spark) + Chrono-Gold `#FBBF24` sun-motes +
//        razor-sharp `#08090C` woodcut ink (`0` shadowBlur, `0` gradients, `0` `#FF9EBB`).
//      - `L14` (`OPEN / MY / BLACK / BOX!!`): `#08090C` + `#121723` chassis +
//        `#475569` burin + `#FAF8F5` + `#FF2E55` + `#38BDF8` + `#FBBF24` stamps!
//   2. Autonomous Per-Character Japanese Choreography (#53):
//      - ZERO rigid horizontal equal-height rows! Kanji `1.52x` vs tucked
//        Hiragana/particles `0.56x`, tilted diagonal manuscript cascades,
//        `Tategaki × Yokogaki` brutalist origami collage, and rotated hanko stamps,
//        entering strictly at `t >= w.start` with directional spring-slam & sparks!
// ============================================================================
(function () {
  'use strict';

  const PLATE_ID = 'P06_classroom_plane';
  const PAPER = '#F5F0E6';
  const WOOD = '#E2E8F0';
  const BONE = '#FAF8F5';
  const INK = '#08090C';
  const PANEL = '#121723';
  const BURIN = '#475569';
  const GRAPHITE = '#64748B';
  const RULE = '#94A3B8';
  const COBALT = '#0376B8';
  const CYAN = '#38BDF8';
  const CRIMSON = '#FF2E55';
  const GOLD = '#FBBF24';

  function ensureLogicalScale(ctx, f, core) {
    const curA = ctx.getTransform().a || 1;
    const curD = ctx.getTransform().d || 1;
    const targetA = (f.W || core.W) / core.W;
    const targetD = (f.H || core.H) / core.H;
    if (Math.abs(curA - targetA) > 0.01 || Math.abs(curD - targetD) > 0.01) {
      ctx.scale(targetA / curA, targetD / curD);
    }
  }

  function fillPoly(ctx, pts, fillCol, strokeCol, lw = 3) {
    if (!pts || pts.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    if (fillCol) {
      ctx.fillStyle = fillCol;
      ctx.fill();
    }
    if (strokeCol) {
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = lw;
      ctx.lineJoin = 'miter';
      ctx.stroke();
    }
  }

  // Classify token for #53 Law A (Kanji 1.54x vs Particle 0.56x vs Kana 0.78x)
  function classifyJaToken(str) {
    const s = (str || '').trim();
    if (/[\u4E00-\u9FFF]/.test(s)) return { mult: 1.54, kind: 'kanji', serif: true };
    if (/^[っゃゅょッャュョのをにがではもへとやでたしびい]$/.test(s)) {
      return { mult: 0.58, kind: 'particle', serif: false };
    }
    if (/[\u3040-\u309F]/.test(s)) return { mult: 0.76, kind: 'hira', serif: false };
    if (/^[—―ー…!！]+$/.test(s)) return { mult: 0.92, kind: 'punct', serif: false };
    return { mult: 1.12, kind: 'kata', serif: false };
  }

  // #53 Autonomous Per-Character Spatial Choreographer (`diagManuscript` | `gustArc` | `tategakiOrigami` | `stampSlash`)
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

  function drawAutonomousSlice(ctx, core, words, i0, i1, t, kick, opts = {}) {
    const slice = expandWordsToChars(words, i0, i1);
    if (!slice.length) return { lastX: opts.cx || 960, lastY: opts.cy || 500 };

    const cx = opts.cx !== undefined ? opts.cx : 960;
    const cy = opts.cy !== undefined ? opts.cy : 500;
    const spanX = opts.spanX || 1060;
    const spanY = opts.spanY || 300;
    const baseSz = opts.sizePx || 138;
    const formation = opts.formation || 'diagManuscript';
    const isDarkStage = !!opts.darkStage;

    let activeX = cx - spanX * 0.42;
    let activeY = cy;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Subtle cobalt/graphite architectural trajectory guide spine
    const n = slice.length;
    const anchors = [];
    for (let i = 0; i < n; i++) {
      const tk = slice[i];
      const cls = classifyJaToken(tk.w);
      const u = n === 1 ? 0.5 : i / (n - 1);
      const hA = core.hash(i + i0 * 13, 41);
      const hB = core.hash(i + i0 * 19, 73);
      let ax = cx, ay = cy, rot = 0, stamp = 'none';

      if (formation === 'diagManuscript') {
        // Staggered diagonal genkouyoushi manuscript squares tumbling across desk!
        const prevAnchor = i > 0 ? anchors[i - 1] : null;
        if (cls.kind === 'particle' && prevAnchor && prevAnchor.cls.kind === 'kanji') {
          const up = (i % 2 === 0);
          ax = prevAnchor.ax + prevAnchor.sz * 0.56;
          ay = prevAnchor.ay + (up ? -prevAnchor.sz * 0.46 : prevAnchor.sz * 0.48);
          rot = up ? 0.22 : -0.19;
          stamp = up ? 'crimsonCircle' : 'cobaltTag';
        } else {
          ax = cx + (u - 0.5) * spanX;
          ay = cy + (u - 0.5) * (-spanY * 0.62) + ((i % 2 === 0 ? -1 : 1) * (44 + hA * 42));
          rot = -0.12 + (hB - 0.5) * 0.28;
          stamp = cls.kind === 'kanji' ? (i === 0 ? 'crimsonTilt' : 'genkoSquare') : 'genkoSquare';
        }
      } else if (formation === 'gustArc') {
        // Swept upward-right along the wind-gust & eraser trajectory!
        const s = (u - 0.5) * 2;
        ax = cx + s * spanX * 0.5;
        ay = cy - s * spanY * 0.55 - Math.sin(u * Math.PI) * 68 + (cls.kind === 'particle' ? 36 : -12);
        rot = -0.18 + (hA - 0.5) * 0.34;
        stamp = cls.kind === 'kanji' ? 'cobaltBlock' : (i % 2 === 0 ? 'crimsonTilt' : 'boneStamp');
      } else if (formation === 'tategakiOrigami') {
        // Vertical Tategaki column on left flank (`選び抜いた`) or right flank!
        const vu = n === 1 ? 0.5 : i / (n - 1);
        ax = cx + (cls.kind === 'particle' ? baseSz * 0.36 : (hA - 0.5) * 32);
        ay = cy + (vu - 0.5) * spanY;
        rot = /^[—―ー]$/.test(tk.w) ? Math.PI * 0.5 : (hB - 0.5) * 0.18;
        stamp = cls.kind === 'kanji' ? (i === 0 ? 'cobaltBlock' : 'boneStamp') : 'goldSeal';
      } else {
        // `stampSlash`: Monumental diagonal die-cut hanko blocks (`最` `短` `経` `路` `——`)
        ax = cx + (u - 0.5) * spanX;
        ay = cy + (u - 0.5) * spanY + ((i % 2 === 0 ? -1 : 1) * 38);
        rot = -0.15 + ((i % 2 === 0 ? -1 : 1) * 0.14);
        const CYCLE = ['crimsonTilt', 'cobaltBlock', 'inkStamp', 'goldSeal', 'boneStamp'];
        stamp = CYCLE[i % CYCLE.length];
      }

      anchors.push({ tk, cls, sz: Math.round(baseSz * cls.mult), ax, ay, rot, stamp, hA, hB });
    }

    // Draw dashed architectural spine connecting sung anchors
    ctx.save();
    ctx.strokeStyle = isDarkStage ? BURIN : COBALT;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < anchors.length; i++) {
      const a = anchors[i];
      if (t >= a.tk.start) {
        if (!started) { ctx.moveTo(a.ax, a.ay); started = true; }
        else ctx.lineTo(a.ax, a.ay);
      }
    }
    if (started) ctx.stroke();
    ctx.restore();

    // Render each sung character as an autonomous 2D kinetic entity!
    for (let i = 0; i < anchors.length; i++) {
      const a = anchors[i];
      if (t < a.tk.start) continue;

      const age = t - a.tk.start;
      const u = core.clamp(age / 0.20, 0, 1);
      const sp = core.ease.outBack(u, 1.78);
      const inv = 1 - core.ease.outExpo(u);
      const isHot = t <= a.tk.end + 0.10;
      const dir = i % 2 === 0 ? 1 : -1;

      // 5 distinct directional ballistic entries (#53 Law C)
      let dx = 0, dy = 0, dRot = 0, scX = sp, scY = sp;
      const mode = (i + i0) % 4;
      if (mode === 0) { dy = -inv * 125; dx = dir * inv * 36; dRot = dir * inv * 0.35; }
      else if (mode === 1) { dx = -dir * inv * 140; dy = inv * 54; dRot = -dir * inv * 0.42; }
      else if (mode === 2) { scX = core.lerp(2.15, 1.0, u); scY = scX; dRot = dir * inv * 0.48; }
      else { dy = inv * 115; scX = core.lerp(1.38, 1.0, u); scY = core.lerp(0.68, 1.0, u); }

      const driftX = Math.sin(t * 3.4 + i * 1.9) * 4 * u;
      const driftY = Math.cos(t * 2.9 + i * 2.3) * 5 * u - (isHot ? 12 : 0) - kick * (a.cls.kind === 'kanji' ? 10 : 5);
      const halfB = a.sz * 0.58 + 10;
      const px = core.clamp(a.ax + dx + driftX, 86 + halfB, core.W - 86 - halfB);
      const py = core.clamp(a.ay + dy + driftY, 86 + halfB, 936 - halfB);
      activeX = px;
      activeY = py;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(a.rot + dRot);
      ctx.scale(scX * (isHot ? 1.10 : 1.0), scY * (isHot ? 1.10 : 1.0));

      const sz = a.sz;
      const bw = sz * 1.10;
      const bh = sz * 1.10;
      const fTmpl = a.cls.serif ? core.F.serif(900) : core.F.sans(900);
      ctx.font = core.font(fTmpl, sz);

      if (a.stamp === 'genkoSquare') {
        // Authentic tilted Genkouyoushi 4-quadrant manuscript square!
        ctx.fillStyle = INK;
        ctx.fillRect(-bw * 0.5 + 6, -bh * 0.5 + 6, bw, bh);
        ctx.fillStyle = isHot ? CRIMSON : BONE;
        ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
        ctx.strokeStyle = isHot ? INK : COBALT;
        ctx.lineWidth = 3;
        ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
        // Inner quadrant crosshairs
        ctx.strokeStyle = isHot ? GOLD : RULE;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(-bw * 0.5, 0); ctx.lineTo(bw * 0.5, 0);
        ctx.moveTo(0, -bh * 0.5); ctx.lineTo(0, bh * 0.5);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = isHot ? BONE : INK;
        ctx.fillText(a.tk.w, 0, sz * 0.03);
      } else if (a.stamp === 'crimsonCircle' || a.stamp === 'goldSeal') {
        const rad = sz * 0.62;
        const fillC = a.stamp === 'crimsonCircle' ? CRIMSON : GOLD;
        ctx.fillStyle = INK;
        ctx.beginPath(); ctx.arc(5, 5, rad, 0, core.TAU); ctx.fill();
        ctx.fillStyle = fillC;
        ctx.beginPath(); ctx.arc(0, 0, rad, 0, core.TAU); ctx.fill();
        ctx.strokeStyle = INK;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, rad - 3, 0, core.TAU); ctx.stroke();
        ctx.fillStyle = a.stamp === 'crimsonCircle' ? BONE : INK;
        ctx.fillText(a.tk.w, 0, sz * 0.03);
      } else {
        // Die-cut rectangular hanko stamp (`crimsonTilt` | `cobaltBlock` | `inkStamp` | `boneStamp`)
        let bgCol = BONE, txtCol = INK, accCol = COBALT;
        if (a.stamp === 'crimsonTilt' || isHot) { bgCol = CRIMSON; txtCol = BONE; accCol = GOLD; }
        else if (a.stamp === 'cobaltBlock') { bgCol = COBALT; txtCol = BONE; accCol = GOLD; }
        else if (a.stamp === 'inkStamp') { bgCol = INK; txtCol = BONE; accCol = CRIMSON; }

        ctx.fillStyle = INK;
        ctx.fillRect(-bw * 0.5 + 7, -bh * 0.5 + 7, bw, bh);
        ctx.fillStyle = bgCol;
        ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 3.2;
        ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
        ctx.fillStyle = accCol;
        ctx.fillRect(-bw * 0.5, -bh * 0.5, Math.max(6, sz * 0.08), bh);
        ctx.fillStyle = txtCol;
        ctx.fillText(a.tk.w, sz * 0.02, sz * 0.03);
      }

      // Contrasting onset spark burst (`#FF2E55` + `#FBBF24` + `#0376B8`)
      if (age < 0.18) {
        const su = age / 0.18;
        for (let s = 0; s < 5; s++) {
          const ang = (s / 5) * core.TAU + i * 0.7;
          const rr = sz * (0.50 + su * 0.45);
          ctx.fillStyle = s % 2 === 0 ? CRIMSON : (s % 3 === 0 ? COBALT : GOLD);
          ctx.save();
          ctx.translate(Math.cos(ang) * rr, Math.sin(ang) * rr);
          ctx.rotate(ang);
          ctx.fillRect(-7, -3, 14, 6);
          ctx.restore();
        }
      }
      ctx.restore();
    }

    ctx.restore();
    return { lastX: activeX, lastY: activeY };
  }

  function drawBrutalistMonolithWord(ctx, core, text, cx, cy, sizePx, maxW, rot, fillCol, shadowCol, borderCol, accentBarCol) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const fTmpl = core.F.sans(900);
    const sz = core.fitSize ? core.fitSize(ctx, text, fTmpl, sizePx, maxW) : sizePx;
    ctx.font = core.font(fTmpl, sz);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tw = ctx.measureText(text).width;
    const bw = tw + sz * 0.34;
    const bh = sz * 1.08;

    ctx.fillStyle = shadowCol;
    ctx.fillRect(-bw * 0.5 + 16, -bh * 0.5 + 16, bw, bh);
    ctx.fillStyle = fillCol;
    ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 5;
    ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
    ctx.fillStyle = accentBarCol;
    ctx.fillRect(-bw * 0.5, -bh * 0.5, 18, bh);

    ctx.fillStyle = borderCol === INK && fillCol !== INK ? INK : BONE;
    ctx.fillText(text, 6, sz * 0.03);
    ctx.restore();
  }

  // Layered Monograph Classroom Desk, Window Mullions, Sun-Motes, Curtain & `31.6°C` Mercury Prop
  function drawLayeredClassroomStage(ctx, core, t, camMode) {
    const W = core.W, H = core.H;
    // Sky / sunlit wall upper band + warm wood desk surface
    const deskTop = camMode === 'overhead' ? 56 : 224;
    ctx.fillStyle = BONE;
    ctx.fillRect(0, 0, W, deskTop);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, deskTop, W, H - deskTop);

    const sway = Math.sin(t * 3.4) * 52 + Math.cos(t * 5.6) * 18;
    const skewShift = sway * 0.65 + (t - 72.3) * 28;

    // Warm sunlit wood bands & diagonal sunlight shadow polygons (`#E8DFCE`)
    ctx.fillStyle = WOOD;
    for (const sx of [-80, 540, 1180]) {
      fillPoly(ctx, [
        [sx + skewShift, deskTop],
        [sx + 210 + skewShift, deskTop],
        [sx - 130 + skewShift, H - 88],
        [sx - 340 + skewShift, H - 88]
      ], WOOD, null, 0);
    }

    // Desk horizon & drafting scale ruler in Cobalt `#0376B8` & Ink `#08090C`
    ctx.fillStyle = INK;
    ctx.fillRect(0, deskTop, W, 7);
    ctx.fillStyle = COBALT;
    ctx.fillRect(140, deskTop + 20, W - 280, 6);
    for (let rx = 160; rx < W - 160; rx += 32) {
      ctx.fillStyle = rx % 128 === 32 ? CRIMSON : COBALT;
      ctx.fillRect(rx, deskTop + 26, 2, rx % 128 === 32 ? 14 : 8);
    }

    // Fine woodgrain copperplate lines in `#94A3B8`
    ctx.strokeStyle = RULE;
    ctx.lineWidth = 1.8;
    const stepY = camMode === 'overhead' ? 46 : 34;
    for (let gy = deskTop + 56, idx = 0; gy < H - 94; gy += stepY, idx++) {
      ctx.beginPath();
      for (let gx = 0; gx <= W; gx += 48) {
        const wy = gy + Math.sin(gx * 0.0052 + idx * 0.85 + t * 0.6) * 8;
        if (gx === 0) ctx.moveTo(gx, wy);
        else ctx.lineTo(gx, wy);
      }
      ctx.stroke();
    }

    // Crisp Window-Frame Mullion Shadow Grid (`#64748B` + `#08090C` edge)
    ctx.save();
    ctx.strokeStyle = GRAPHITE;
    ctx.lineWidth = 12;
    for (const sx of [-120, 480, 1080, 1680]) {
      ctx.beginPath();
      ctx.moveTo(sx + skewShift, 0);
      ctx.lineTo(sx - 340 + skewShift, H - 90);
      ctx.stroke();
    }
    for (const sy of [190, 560, 880]) {
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(W, sy - 95);
      ctx.stroke();
    }
    ctx.restore();

    // Floating Chrono-Gold `#FBBF24` sunlit chalk dust motes!
    for (let m = 0; m < 22; m++) {
      const mx = (core.hash(m, 503) * W + (t - 72.0) * (34 + (m % 5) * 14)) % W;
      const my = 70 + ((core.hash(m, 509) * 820 - (t - 72.0) * 26) % 820 + 820) % 820;
      const s = m % 3 === 0 ? 7 : 5;
      ctx.fillStyle = m % 4 === 0 ? CRIMSON : GOLD;
      ctx.fillRect(Math.round(mx), Math.round(my), s, s);
    }

    if (camMode !== 'overhead') {
      // Wall Mercury Thermometer Prop (`31.6°C` with vivid `#FF2E55` mercury & `#0376B8` header!)
      ctx.fillStyle = INK;
      ctx.fillRect(50, 50, 248, 212);
      ctx.fillStyle = BONE;
      ctx.fillRect(42, 42, 248, 212);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4;
      ctx.strokeRect(42, 42, 248, 212);
      ctx.fillStyle = COBALT;
      ctx.fillRect(42, 42, 248, 36);
      ctx.fillStyle = GOLD;
      ctx.fillRect(42, 42, 10, 36);
      ctx.fillStyle = BONE;
      ctx.font = core.font(core.F.mono(800), 15);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('THERMO_GAUGE // WINDOW', 60, 60);

      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.strokeRect(68, 96, 20, 116);
      ctx.fillStyle = CRIMSON;
      ctx.fillRect(72, 124, 12, 88);
      ctx.beginPath();
      ctx.arc(78, 220, 16, 0, core.TAU);
      ctx.fill();
      ctx.fillStyle = GRAPHITE;
      for (let ty = 102; ty <= 202; ty += 12) {
        ctx.fillRect(92, ty, ty % 24 === 6 ? 14 : 8, 2);
      }
      ctx.fillStyle = CRIMSON;
      ctx.font = core.font(core.F.mono(900), 34);
      ctx.fillText('31.6°C', 116, 144);
      ctx.fillStyle = INK;
      ctx.font = core.font(core.F.mono(700), 14);
      ctx.fillText('SYNC_WIND: 4.8m/s', 116, 184);
      ctx.fillStyle = COBALT;
      ctx.fillText('DIJKSTRA: ACTIVE', 116, 208);

      // Billowing Right Window Curtain Silhouette (`#FAF8F5` cloth + `#0376B8` hem stripe + `#08090C` folds)
      ctx.save();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.moveTo(W, 0);
      ctx.lineTo(W - 214, 0);
      ctx.bezierCurveTo(
        W - 396 - sway * 1.4, H * 0.28,
        W - 476 - sway * 1.9, H * 0.56,
        W - 266 - sway * 1.2, H * 0.88
      );
      ctx.lineTo(W, H * 0.90);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = BONE;
      ctx.beginPath();
      ctx.moveTo(W, 0);
      ctx.lineTo(W - 196, 0);
      ctx.bezierCurveTo(
        W - 372 - sway * 1.4, H * 0.28,
        W - 450 - sway * 1.9, H * 0.56,
        W - 246 - sway * 1.2, H * 0.86
      );
      ctx.lineTo(W, H * 0.88);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = COBALT;
      ctx.lineWidth = 4;
      for (let r = 1; r <= 4; r++) {
        ctx.strokeStyle = r === 1 ? COBALT : GRAPHITE;
        ctx.lineWidth = r === 1 ? 4 : 2.2;
        ctx.beginPath();
        ctx.moveTo(W - r * 38, 0);
        ctx.bezierCurveTo(
          W - r * 72 - sway * (0.4 + r * 0.22), H * 0.28,
          W - r * 86 - sway * (0.5 + r * 0.25), H * 0.56,
          W - r * 48 - sway * (0.3 + r * 0.20), H * 0.84
        );
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // Layered 2.5D Dart Paper Airplane Stamped `最短経路` in `#FF2E55` Crimson + `#0376B8` Drafting Fold!
  function drawLayeredPaperAirplane(ctx, core, cx, cy, scale, angleRad, bank) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleRad);
    ctx.scale(scale, scale);

    const b = core.clamp(bank || 0, -1, 1);
    const wing = 84 * (1 - Math.abs(b) * 0.22);

    // Hard cast shadow
    fillPoly(ctx, [[174, 24], [-134, -wing + 28], [-122, wing + 28]], INK, null, 0);
    // Upper wing (`#FAF8F5`)
    fillPoly(ctx, [[172, 0], [-136, -wing - b * 24], [-88, -10]], BONE, INK, 4.2);
    // Center valley keel (`#0376B8` cobalt blueprint underside!)
    fillPoly(ctx, [[172, 0], [-88, -10], [-104, 30]], COBALT, INK, 3.5);
    // Foreground wing (`#FAF8F5` + crimson leading-edge trim)
    fillPoly(ctx, [[172, 0], [-80, 8], [-128, wing - b * 24]], BONE, INK, 4.2);
    ctx.strokeStyle = CRIMSON;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(164, 3);
    ctx.lineTo(-118, (wing - b * 24) * 0.88);
    ctx.stroke();

    // Rotated crimson hanko stamp `DIJKSTRA // 最短` on wing!
    ctx.save();
    ctx.translate(-12, 30);
    ctx.rotate(0.32);
    ctx.fillStyle = CRIMSON;
    ctx.fillRect(-52, -13, 104, 26);
    ctx.font = core.font(core.F.mono(900), 15);
    ctx.fillStyle = BONE;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MIN_PATH // 最短', 0, 1);
    ctx.restore();

    ctx.restore();
  }

  // True 4-Beat Geometric Origami Folding Stage (`76.00 – 77.90s`)
  function drawFourBeatOrigamiFold(ctx, core, t) {
    const W = core.W, H = core.H;
    const uAll = core.clamp((t - 76.00) / 1.90, 0, 1);
    const beatIdx = core.clamp(Math.floor(uAll * 4), 0, 3);
    const subU = core.ease.outBack(core.clamp(uAll * 4 - beatIdx, 0, 1), 1.35);

    const f1 = beatIdx > 0 ? 1 : subU;
    const f2 = beatIdx > 1 ? 1 : (beatIdx === 1 ? subU : 0);
    const f3 = beatIdx > 2 ? 1 : (beatIdx === 2 ? subU : 0);
    const f4 = beatIdx === 3 ? subU : 0;

    ctx.save();
    ctx.translate(W * 0.55, H * 0.55);
    const camAngles = [-0.08, 0.09, -0.14, -0.26];
    const camScales = [0.92, 1.02, 1.12, 1.22];
    const prevAng = beatIdx === 0 ? 0 : camAngles[beatIdx - 1];
    const prevSc = beatIdx === 0 ? 0.84 : camScales[beatIdx - 1];
    ctx.rotate(core.lerp(prevAng, camAngles[beatIdx], subU));
    const sc = core.lerp(prevSc, camScales[beatIdx], subU);
    ctx.scale(sc, sc);

    const S = 264;

    if (f4 < 0.88) {
      const valleySqueeze = 1 - f1 * 0.08 - f4 * 0.58;
      const topLeftX = core.lerp(-S, 0, f2) * valleySqueeze;
      const topRightX = core.lerp(S, 0, f2) * valleySqueeze;
      const sideUpperY = core.lerp(-S, 0, f2 * 0.85);
      const wingTuckX = core.lerp(S, S * 0.46, f3) * valleySqueeze;

      fillPoly(ctx, [
        [topLeftX + 14, -S + 14], [topRightX + 14, -S + 14],
        [wingTuckX + 14, sideUpperY + 14], [wingTuckX + 14, S + 14],
        [-wingTuckX + 14, S + 14], [-wingTuckX + 14, sideUpperY + 14]
      ], INK, null, 0);

      const bodyPts = [
        [topLeftX, -S], [topRightX, -S],
        [wingTuckX, sideUpperY], [wingTuckX, S],
        [-wingTuckX, S], [-wingTuckX, sideUpperY]
      ];
      fillPoly(ctx, bodyPts, BONE, INK, 5);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(bodyPts[0][0], bodyPts[0][1]);
      for (let i = 1; i < bodyPts.length; i++) ctx.lineTo(bodyPts[i][0], bodyPts[i][1]);
      ctx.closePath();
      ctx.clip();
      ctx.strokeStyle = RULE;
      ctx.lineWidth = 1.4;
      for (let gx = -S; gx <= S; gx += 36) {
        ctx.beginPath();
        ctx.moveTo(gx * valleySqueeze, -S);
        ctx.lineTo(gx * valleySqueeze, S);
        ctx.stroke();
      }
      for (let gy = -S; gy <= S; gy += 36) {
        ctx.beginPath();
        ctx.moveTo(-S, gy);
        ctx.lineTo(S, gy);
        ctx.stroke();
      }
      // Center crimson valley-fold crease!
      ctx.strokeStyle = CRIMSON;
      ctx.lineWidth = 4;
      ctx.setLineDash([14, 8]);
      ctx.beginPath();
      ctx.moveTo(0, -S);
      ctx.lineTo(0, S);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      if (f2 > 0.02) {
        const flapY = core.lerp(-S + 20, 38, f2);
        const flapInX = core.lerp(-S * 0.8, -6, f2) * valleySqueeze;
        // Cobalt blueprint reverse side revealed when folded!
        fillPoly(ctx, [[0, -S], [-wingTuckX, sideUpperY], [flapInX, flapY]], COBALT, INK, 3.5);
        fillPoly(ctx, [[0, -S], [wingTuckX, sideUpperY], [-flapInX, flapY]], COBALT, INK, 3.5);
      }

      if (f3 > 0.02) {
        const dartY = core.lerp(40, S - 18, f3);
        fillPoly(ctx, [[0, -S], [-wingTuckX, sideUpperY], [-8, dartY]], BONE, INK, 4.5);
        fillPoly(ctx, [[0, -S], [wingTuckX, sideUpperY], [8, dartY]], BONE, INK, 4.5);

        ctx.save();
        ctx.translate(42 * valleySqueeze, 48);
        ctx.rotate(Math.PI * 0.46);
        ctx.fillStyle = CRIMSON;
        ctx.fillRect(-76, -18, 152, 36);
        ctx.font = core.font(core.F.mono(900), 22);
        ctx.fillStyle = BONE;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MIN_PATH // 最短', 0, 1);
        ctx.restore();
      }
    } else {
      drawLayeredPaperAirplane(ctx, core, 0, 0, 1.95, -Math.PI * 0.5, 0.15);
    }
    ctx.restore();

    // Telemetry badge (`#0376B8` + `#FBBF24` + `#FAF8F5`)
    ctx.save();
    ctx.fillStyle = INK;
    ctx.fillRect(W - 434, 52, 356, 48);
    ctx.fillStyle = COBALT;
    ctx.fillRect(W - 440, 46, 356, 48);
    ctx.fillStyle = GOLD;
    ctx.fillRect(W - 440, 46, 12, 48);
    ctx.fillStyle = BONE;
    ctx.font = core.font(core.F.mono(800), 19);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`ORIGAMI_FOLD // STEP 0${beatIdx + 1} / 04`, W - 256, 70);
    ctx.restore();
  }

  // Contrasting Crimson PQRST Spark Trajectory (`#FF2E55` + `#FBBF24` core)
  function drawSparkTrajectory(ctx, core, pts, kick) {
    if (!pts || pts.length < 2) return;
    ctx.save();
    ctx.strokeStyle = CRIMSON;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();

    const head = pts[pts.length - 1];
    const r = 22 + kick * 12;
    ctx.fillStyle = CRIMSON;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const rad = i % 2 === 0 ? r : r * 0.30;
      const px = head[0] + Math.cos(a) * rad;
      const py = head[1] + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = GOLD;
    ctx.fillRect(head[0] - 5, head[1] - 5, 10, 10);
    ctx.restore();
  }

  window.registerCortexPlate(PLATE_ID, {
    render(ctx, f, core) {
      const { W, H, clamp, lerp, prog, ease } = core;
      const t = f.t;
      const kick = f.kickPulse ?? f.kickEnv ?? f.kick ?? 0;

      const c13 = core.cueById('L13_SHORTEST_ROUTE');
      const c14 = core.cueById('L14_OPEN_BLACK_BOX');
      const w13 = (c13 && c13.words) || [];
      const w14 = (c14 && c14.words) || [];

      ctx.save();
      ensureLogicalScale(ctx, f, core);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      let isPaper = true;
      let outBg = PAPER;
      let outFg = INK;
      let shake = 0;

      // ======================================================================
      // CUT 1 (`72.30 – 73.55s`, `1.25s`, `L13` A):
      // Sunlit Classroom Desk + Scattered Diagonal Genkouyoushi `迷って消して`
      // ======================================================================
      if (t < 73.55) {
        const zoomP = prog(t, 72.30, 73.55, ease.outCubic);
        ctx.save();
        ctx.translate(W * 0.5, H * 0.5);
        ctx.scale(lerp(1.14, 1.0, zoomP), lerp(1.14, 1.0, zoomP));
        ctx.translate(-W * 0.5, -H * 0.5);
        drawLayeredClassroomStage(ctx, core, t, 'desk');
        ctx.restore();

        // Tilted Architectural Manuscript Drafting Sheet (`#FAF8F5` + `#0376B8` rule + `#FF2E55` margin)
        ctx.save();
        ctx.translate(W * 0.47, H * 0.55);
        ctx.rotate(-0.055);
        ctx.fillStyle = INK;
        ctx.fillRect(-620 + 14, -225 + 14, 1240, 450);
        ctx.fillStyle = BONE;
        ctx.fillRect(-620, -225, 1240, 450);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 5;
        ctx.strokeRect(-620, -225, 1240, 450);
        ctx.strokeStyle = COBALT;
        ctx.lineWidth = 2;
        ctx.strokeRect(-598, -203, 1196, 406);
        ctx.fillStyle = CRIMSON;
        ctx.fillRect(-620, -225, 16, 450);
        ctx.restore();

        const res = drawAutonomousSlice(ctx, core, w13, 0, 6, t, kick, {
          formation: 'diagManuscript',
          cx: W * 0.47,
          cy: H * 0.53,
          spanX: 980,
          spanY: 240,
          sizePx: 146
        });
        drawSparkTrajectory(ctx, core, [[360, 705], [res.lastX, res.lastY + 64]], kick);
      }

      // ======================================================================
      // CUT 2 (`73.55 – 74.80s`, `1.25s`, `L13` B):
      // Dutch Macro on Authentic Cobalt-White-Black `[MONO // ERASER]` & Gust!
      // ======================================================================
      else if (t < 74.80) {
        const gustP = prog(t, 73.55, 74.80, ease.outExpo);
        const sweepP = prog(t, 73.55, 74.45, ease.inOutCubic);
        shake = 0.18 * core.pulse(t, 73.55, 0.12) + kick * 0.12;

        ctx.save();
        ctx.translate(W * 0.5, H * 0.5);
        ctx.rotate(0.085 - gustP * 0.04);
        ctx.scale(1.16, 1.16);
        ctx.translate(-W * 0.5, -H * 0.5);
        drawLayeredClassroomStage(ctx, core, t, 'desk');

        drawAutonomousSlice(ctx, core, w13, 0, 6, t, kick, {
          formation: 'gustArc',
          cx: W * 0.46,
          cy: H * 0.48,
          spanX: 1060,
          spanY: 280,
          sizePx: 148
        });

        // Authentic Japanese `[MONO // ERASER]` (White rubber + Blue/White/Black sleeve!)
        const ex = lerp(340, 1380, sweepP);
        const ey = lerp(640, 400, sweepP);
        ctx.save();
        ctx.translate(ex, ey);
        ctx.rotate(-0.36 + Math.sin(t * 28) * 0.05);
        // Hard drop shadow
        fillPoly(ctx, [[-162, -52], [188, -58], [188, 82], [-162, 76]], INK, null, 0);
        // White rubber tip
        fillPoly(ctx, [[-174, -62], [-60, -62], [-60, 62], [-174, 62]], BONE, INK, 5);
        // Iconic 3-band Cobalt / White / Ink sleeve!
        fillPoly(ctx, [[-60, -70], [180, -70], [180, -24], [-60, -24]], COBALT, INK, 4);
        fillPoly(ctx, [[-60, -24], [180, -24], [180, 24], [-60, 24]], BONE, INK, 4);
        fillPoly(ctx, [[-60, 24], [180, 24], [180, 70], [-60, 70]], INK, INK, 4);
        ctx.font = core.font(core.F.mono(900), 26);
        ctx.fillStyle = INK;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MONO // ERASER', 60, 0);
        ctx.restore();

        // 56 Curling Eraser Shavings & Crimson/Gold Trajectory Sparks Blasted Across Lens
        for (let i = 0; i < 56; i++) {
          const seed = core.hash(i, 311);
          const birth = (i / 56) * 0.55;
          const age = clamp((t - 73.55 - birth * 0.7) * 1.45, 0, 1.5);
          if (age <= 0) continue;
          const sx = lerp(420, ex, seed) + age * (480 + core.hash(i, 317) * 720);
          const sy = lerp(580, ey, seed) - age * (180 + core.hash(i, 331) * 420) + Math.sin(age * 9 + i) * 38;
          const scCrumb = 1 + age * 1.65;
          const w = (12 + (i % 5) * 7) * scCrumb;
          const h = (5 + (i % 3) * 3) * scCrumb;
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(seed * core.TAU + age * 7.5);
          ctx.fillStyle = i % 7 === 0 ? CRIMSON : (i % 5 === 0 ? COBALT : (i % 2 === 0 ? BONE : INK));
          ctx.strokeStyle = INK;
          ctx.lineWidth = 2.6;
          ctx.fillRect(-w * 0.5, -h * 0.5, w, h);
          ctx.strokeRect(-w * 0.5, -h * 0.5, w, h);
          ctx.restore();
        }
        ctx.restore();
      }

      // ======================================================================
      // CUT 3 (`74.80 – 76.00s`, `1.20s`, `L13` C):
      // Overhead Origami Blueprint + `Tategaki × Yokogaki` Collage (`選び抜いた / 最短経路——`)
      // ======================================================================
      else if (t < 76.00) {
        const snapP = prog(t, 74.80, 75.25, ease.outExpo);
        drawLayeredClassroomStage(ctx, core, t, 'overhead');

        ctx.save();
        ctx.translate(W * 0.56, H * 0.51);
        ctx.scale(lerp(1.38, 1.0, snapP), lerp(1.38, 1.0, snapP));
        const S = 292;
        ctx.fillStyle = INK;
        ctx.fillRect(-S + 16, -S + 16, S * 2, S * 2);
        ctx.fillStyle = BONE;
        ctx.fillRect(-S, -S, S * 2, S * 2);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 5;
        ctx.strokeRect(-S, -S, S * 2, S * 2);

        // Cobalt mountain folds & crimson valley folds!
        ctx.strokeStyle = COBALT;
        ctx.lineWidth = 2.8;
        ctx.setLineDash([12, 8]);
        ctx.beginPath();
        ctx.moveTo(-S, -S); ctx.lineTo(S, S);
        ctx.moveTo(S, -S);  ctx.lineTo(-S, S);
        ctx.moveTo(-S, 0);  ctx.lineTo(S, 0);
        ctx.stroke();

        ctx.strokeStyle = CRIMSON;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(0, -S);  ctx.lineTo(0, S);
        ctx.moveTo(0, -S);  ctx.lineTo(-S * 0.5, S);
        ctx.moveTo(0, -S);  ctx.lineTo(S * 0.5, S);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Left Vertical `Tategaki` Column (`選び抜いた` `6..11`) + Diagonal Stamp Slash (`最短経路——` `11..end`)!
        drawAutonomousSlice(ctx, core, w13, 6, 11, t, kick, {
          formation: 'tategakiOrigami',
          cx: 260,
          cy: 495,
          spanX: 180,
          spanY: 590,
          sizePx: 140
        });
        drawAutonomousSlice(ctx, core, w13, 11, w13.length, t, kick, {
          formation: 'stampSlash',
          cx: 1120,
          cy: 760,
          spanX: 920,
          spanY: -185,
          sizePx: 148
        });
        drawSparkTrajectory(ctx, core, [[120, 932], [lerp(180, W - 120, prog(t, 74.80, 75.95)), 932]], kick);
      }

      // ======================================================================
      // CUT 4 (`76.00 – 77.90s`, 4 Beat-Locked Origami Folds):
      // True 4-Beat Origami Folding + Left Tategaki `選び抜いた` + Top-Left Diagonal `最短経路——`!
      // ======================================================================
      else if (t < 77.90) {
        const foldBeat = Math.floor(clamp((t - 76.00) / 0.475, 0, 3));
        shake = 0.24 * core.pulse(t, 76.00 + foldBeat * 0.475, 0.09);

        drawLayeredClassroomStage(ctx, core, t, 'overhead');
        drawFourBeatOrigamiFold(ctx, core, t);

        drawAutonomousSlice(ctx, core, w13, 6, 11, t, kick, {
          formation: 'tategakiOrigami',
          cx: 250,
          cy: 505,
          spanX: 160,
          spanY: 580,
          sizePx: 136
        });
        drawAutonomousSlice(ctx, core, w13, 11, w13.length, t, kick, {
          formation: 'stampSlash',
          cx: 880,
          cy: 185,
          spanX: 840,
          spanY: 110,
          sizePx: 142
        });
      }

      // ======================================================================
      // CUT 5A & 5B (`77.90 – 79.45s`, `L13` Launch):
      // Low-angle desk skim -> Open-window nose rush straight into camera lens!
      // ======================================================================
      else if (t < 79.45) {
        const isRush = t >= 78.68;

        if (!isRush) {
          const u = prog(t, 77.90, 78.68, ease.inExpo);
          drawLayeredClassroomStage(ctx, core, t, 'desk');

          ctx.strokeStyle = COBALT;
          ctx.lineWidth = 2.8;
          for (let s = 0; s < 14; s++) {
            const sy = 140 + s * 56;
            ctx.strokeStyle = s % 4 === 0 ? CRIMSON : COBALT;
            ctx.beginPath();
            ctx.moveTo(0, sy + 90);
            ctx.lineTo(lerp(360, W, u), sy - 60);
            ctx.stroke();
          }

          const px = lerp(280, 1620, u);
          const py = lerp(740, 250, u);
          const sc = lerp(1.25, 2.35, u);
          drawSparkTrajectory(ctx, core, [[120, 820], [px * 0.55, lerp(780, 500, u)], [px - 90, py + 32]], kick);
          drawLayeredPaperAirplane(ctx, core, px, py, sc, -0.34, -0.25);

          drawAutonomousSlice(ctx, core, w13, 11, w13.length, t, kick, {
            formation: 'stampSlash',
            cx: 650,
            cy: 230,
            spanX: 780,
            spanY: -130,
            sizePx: 126
          });
        } else {
          const u = prog(t, 78.68, 79.45, ease.inQuart);
          shake = 0.15 + u * 0.45;
          ctx.fillStyle = BONE;
          ctx.fillRect(0, 0, W, H);

          const vx = W * 0.5, vy = H * 0.47;
          for (let i = 0; i < 28; i++) {
            const a0 = (i / 28) * core.TAU + u * 0.35;
            const a1 = a0 + 0.042;
            const r0 = lerp(90, 24, u) + (i % 3) * 35;
            const r1 = 1280;
            const col = i % 5 === 0 ? CRIMSON : (i % 3 === 0 ? COBALT : INK);
            fillPoly(ctx, [
              [vx + Math.cos(a0) * r0, vy + Math.sin(a0) * r0],
              [vx + Math.cos(a0) * r1, vy + Math.sin(a0) * r1],
              [vx + Math.cos(a1) * r1, vy + Math.sin(a1) * r1],
              [vx + Math.cos(a1) * r0, vy + Math.sin(a1) * r0]
            ], col, null, 0);
          }

          const winS = lerp(1.0, 0.38, u);
          ctx.strokeStyle = COBALT;
          ctx.lineWidth = 16 * winS;
          ctx.strokeRect(vx - 720 * winS, vy - 390 * winS, 1440 * winS, 780 * winS);

          const sc = lerp(1.45, 6.4, u);
          drawLayeredPaperAirplane(ctx, core, vx + Math.sin(u * 12) * 18, vy + lerp(110, 0, u), sc, -0.18 + u * 0.18, 0.32);
        }
      }

      // ======================================================================
      // CUTS 6–9 (`79.45 – 81.01s`, `L14` STOP-BREAK 4-Beat Brutalist Stamp Pileup!):
      // Synced directly to `L14_OPEN_BLACK_BOX` vocal starts: `OPEN / MY / BLACK / BOX!!`
      // ======================================================================
      else {
        const tOpen = w14[0] ? w14[0].start : 79.45;
        const tMy = w14[4] ? w14[4].start : 79.84;
        const tBlack = w14[6] ? w14[6].start : 80.23;
        const tBox = w14[11] ? w14[11].start : 80.62;
        const starts = [tOpen, tMy, tBlack, tBox];

        let bIdx = 0;
        if (t >= tBox) bIdx = 3;
        else if (t >= tBlack) bIdx = 2;
        else if (t >= tMy) bIdx = 1;

        const bt0 = starts[bIdx];
        const slamP = prog(t - bt0, 0, 0.14, ease.outExpo);
        shake = core.pulse(t, bt0, 0.10) * 0.72;

        isPaper = false;
        outBg = INK;
        outFg = CRIMSON;

        // Layered Monograph Dark Chassis (`#08090C` + `#121723` + `#475569` burin + `#38BDF8`/`#FBBF24`/`#FF2E55`)
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = PANEL;
        ctx.fillRect(56, 48, W - 112, H - 136);

        if (core.drawBurinHatch) {
          core.drawBurinHatch(ctx, 56, 96, 260, H - 196, 0.44 + bIdx * 0.28, 12, 1.6, BURIN);
          core.drawBurinHatch(ctx, W - 316, 96, 260, H - 196, -0.44 - bIdx * 0.28, 12, 1.6, BURIN);
        }

        for (let r = 0; r < 18; r++) {
          const ra = (r / 18) * core.TAU + bIdx * 0.35 + (t - bt0) * 0.65;
          ctx.strokeStyle = r % 4 === 0 ? CRIMSON : (r % 3 === 0 ? CYAN : BURIN);
          ctx.lineWidth = r % 2 === 0 ? 3.5 : 1.8;
          ctx.beginPath();
          ctx.moveTo(W * 0.5 + Math.cos(ra) * 300, H * 0.49 + Math.sin(ra) * 210);
          ctx.lineTo(W * 0.5 + Math.cos(ra) * 980, H * 0.49 + Math.sin(ra) * 560);
          ctx.stroke();
        }

        ctx.strokeStyle = bIdx >= 2 ? CRIMSON : CYAN;
        ctx.lineWidth = 5;
        ctx.strokeRect(56, 48, W - 112, H - 136);
        ctx.fillStyle = bIdx >= 2 ? CRIMSON : CYAN;
        ctx.fillRect(56, 48, 420, 46);
        ctx.fillStyle = GOLD;
        ctx.fillRect(56, 48, 12, 46);
        ctx.fillStyle = INK;
        ctx.font = core.font(core.F.mono(900), 20);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`STOP_BREAK // HAMMER 0${bIdx + 1}/04`, 78, 71);

        ctx.fillStyle = GOLD;
        ctx.textAlign = 'right';
        ctx.fillText('TEMP: 31.6°C // OPEN_MY_BLACK_BOX', W - 76, 74);

        // Cumulative Non-Linear Brutalist Multi-Angle Stamp Pileup (#53) over Living Full-Bleed `C11`!
        const v6 = window.CortexV6;
        if (v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage('C11')) {
          v6.drawLivingFullBleed(ctx, 'C11', {
            t, u: clamp((t - 79.45) / 1.56, 0, 1), kick,
            zoom0: 1.08, zoom1: 1.38, panX0: -60, panX1: 50, panY0: 25, panY1: -25,
            rot0: -0.025, rot1: 0.018, fx: 0.50, fy: 0.34, scrim: 0.28, isPaper: false
          });
        }
        if (bIdx < 3) {
          if (bIdx >= 0) {
            const sc0 = bIdx === 0 ? lerp(1.52, 1.0, slamP) : 0.72;
            const x0 = bIdx === 0 ? W * 0.48 : 490;
            const y0 = bIdx === 0 ? H * 0.48 : 265;
            ctx.save();
            ctx.translate(x0, y0);
            ctx.scale(sc0, sc0);
            drawBrutalistMonolithWord(ctx, core, 'OPEN', 0, 0, 320, 1400, -0.11, BONE, CYAN, INK, CRIMSON);
            ctx.restore();
          }
          if (bIdx >= 1) {
            const sc1 = bIdx === 1 ? lerp(1.56, 1.0, slamP) : 0.78;
            const x1 = bIdx === 1 ? W * 0.54 : 1410;
            const y1 = bIdx === 1 ? H * 0.50 : 285;
            ctx.save();
            ctx.translate(x1, y1);
            ctx.scale(sc1, sc1);
            drawBrutalistMonolithWord(ctx, core, 'MY', 0, 0, 310, 1200, 0.14, GOLD, CRIMSON, INK, CYAN);
            ctx.restore();
          }
          if (bIdx >= 2) {
            const sc2 = lerp(1.50, 1.0, slamP);
            ctx.save();
            ctx.translate(W * 0.50, H * 0.57);
            ctx.scale(sc2, sc2);
            drawBrutalistMonolithWord(ctx, core, 'BLACK', 0, 0, 350, 1520, -0.07, CRIMSON, GOLD, BONE, INK);
            ctx.restore();
          }
        } else {
          // Beat 4 (`BOX!!`): Colossal tilted die-cut stamp cleaved cleanly in two by supersonic airplane!
          const pierceStart = bt0 + 0.05;
          const pierceP = prog(t, pierceStart, 81.00, ease.outExpo);
          const sep = pierceP * 72;

          // Keep background corner stamps visible for rich collage density!
          ctx.save();
          ctx.translate(360, 225); ctx.scale(0.50, 0.50);
          drawBrutalistMonolithWord(ctx, core, 'OPEN', 0, 0, 260, 900, -0.14, BONE, CYAN, INK, CRIMSON);
          ctx.restore();
          ctx.save();
          ctx.translate(1540, 235); ctx.scale(0.52, 0.52);
          drawBrutalistMonolithWord(ctx, core, 'MY', 0, 0, 250, 900, 0.16, GOLD, CRIMSON, INK, CYAN);
          ctx.restore();

          for (const half of [-1, 1]) {
            ctx.save();
            ctx.beginPath();
            if (half < 0) {
              ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H * 0.40); ctx.lineTo(0, H * 0.62);
            } else {
              ctx.moveTo(0, H * 0.62); ctx.lineTo(W, H * 0.40); ctx.lineTo(W, H); ctx.lineTo(0, H);
            }
            ctx.closePath();
            ctx.clip();
            ctx.translate(W * 0.5 + half * sep * 0.85, H * 0.52 + half * sep);
            ctx.rotate(0.06 + half * pierceP * 0.055);
            drawBrutalistMonolithWord(ctx, core, 'BOX!!', 0, 0, 410, 1620, 0, CRIMSON, CYAN, BONE, GOLD);
            ctx.restore();
          }

          const flyU = prog(t, pierceStart, 81.01, ease.outCubic);
          const px = lerp(-180, W + 240, flyU);
          const py = lerp(H * 0.62, H * 0.40, flyU);
          const ang = Math.atan2(H * 0.40 - H * 0.62, W + 420);

          // Multi-color laser cleave line (`#38BDF8` + `#FAF8F5` + `#FBBF24`)
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 14;
          ctx.beginPath(); ctx.moveTo(0, H * 0.62); ctx.lineTo(px, py); ctx.stroke();
          ctx.strokeStyle = GOLD;
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(0, H * 0.62); ctx.lineTo(px, py); ctx.stroke();

          const shardAge = Math.max(0, t - pierceStart);
          for (let i = 0; i < 44; i++) {
            const sa = (core.hash(i, 907) - 0.5) * Math.PI * 1.95;
            const spd = 560 + core.hash(i, 919) * 1650;
            const sx = W * 0.5 + Math.cos(sa) * spd * shardAge;
            const sy = H * 0.50 + Math.sin(sa) * spd * shardAge * 0.82;
            const sz = 22 + core.hash(i, 929) * 58;
            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(shardAge * (8 + (i % 5)) + i);
            const sCol = i % 4 === 0 ? GOLD : (i % 3 === 0 ? CYAN : (i % 2 === 0 ? CRIMSON : BONE));
            fillPoly(
              ctx,
              [[-sz * 0.6, -sz * 0.3], [sz * 0.8, -sz * 0.08], [sz * 0.14, sz * 0.58]],
              sCol,
              INK,
              3
            );
            ctx.restore();
          }

          drawLayeredPaperAirplane(ctx, core, px, py, 2.35, ang, -0.20);
        }
      }

      ctx.restore();

      return {
        isPaper,
        bg: outBg,
        fg: outFg,
        duotone: { bg: outBg, fg: isPaper ? COBALT : outFg },
        bloom: 0,
        ca: 0,
        flash: 0,
        shake: clamp(shake, 0, 1)
      };
    }
  });
})();
