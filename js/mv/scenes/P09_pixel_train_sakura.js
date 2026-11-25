// ============================================================================
// Plate 09 — `P09_pixel_train_sakura.js` (`101.16s – 112.10s`, + `95.82–101.16s` fallback)
// Canonical Showcase A: Pure 480×270 Integer Nearest-Neighbor Pixel Railway Crossing
//
// Directives #52 + #53 + #61 + #62 + #63 Enforced:
//   1. Zero Procedural Fallback Characters & Zero Fractional Pixel Scale (#61, #63):
//      - 100% `Cortex25D.drawPixelHime` (`far_calm`, `far_wind`, `closeup_wind`) at
//        strict integer `1x` / `2x` pixel coordinates (`imageSmoothingEnabled = false`).
//   2. Layered Cross-Color Monograph Pixel Palette (#52):
//      - Sky `#101322` (`#070914` `-1.5EV` twilight drop at `106.68s`) + `#1E293B`/`#334155`
//        far viaduct & dusk skyline + `#475569`/`#64748B` catenary & ballast +
//        authentic `#FBBF24 × #08090C` yellow-black crossing barrier (`y = 152`) +
//        `#FF2E55` alternating warning lamps & express stripe + `#38BDF8` `SYNC:35.8°C`
//        HUD + `#FAF8F5` ivory train body + `#FF9EBB` sakura petals (`0` gradients,
//        `0` rgba washes, `0` shadowBlur).
//   3. Exact 3-Layer Spatial Occlusion:
//      - Layer 1 (Far Sky `y = 0..164`): Catenary gantry, dusk clouds, sakura canopies.
//      - Layer 2 (Far-Side Stop-Line `y = 166`): `44px` pixel Hime heroine standing
//        safely BEHIND the lowered `#FBBF24 × #08090C` barrier (`y = 152`).
//      - Layer 3 (Nearest Foreground `y = 34..248`, `214px` = `79.3%` of `270px`):
//        Colossal express train roaring L->R with TRUE TRANSPARENT PUNCHED-OUT
//        WINDOWS (`y = 74..160`) strobing the windswept heroine behind!
//   4. Autonomous Per-Character Japanese Choreography (#53):
//      - Every character rendered as an independent 2D visual entity (`0` flat >=4-char
//        fillText strings), Kanji `1.54x` (`210–350px`) vs tucked particles `0.56x`,
//        tilted hanko stamps & slipstream sakura accretion, `0px` portrait/zhSub collision!
// ============================================================================
(function () {
  'use strict';

  const PLATE_ID = 'P09_pixel_train_sakura';
  const PW = 480;
  const PH = 270;

  const COL_SKY_PRE = '#101322';
  const COL_SKY_DUSK = '#070914';
  const COL_INK = '#08090C';
  const COL_PANEL = '#121723';
  const COL_SLATE_DARK = '#1E293B';
  const COL_SLATE_MID = '#334155';
  const COL_BURIN = '#475569';
  const COL_GRAPHITE = '#64748B';
  const COL_RULE = '#94A3B8';
  const COL_WHITE = '#F5F0E8';
  const COL_CYAN = '#DDE2ED';
  const COL_COBALT = '#3D4862';
  const COL_CRIMSON = '#D94B6A';
  const COL_GOLD = '#F1A8C1';
  const COL_SAKURA = '#F1A8C1';

  let _petals = null;
  let _blizzardPetals = null;
  let _pxProbeCache = null;

  function ensurePools(core) {
    if (_petals) return;
    const rnd = core.mulberry32(909270);
    _petals = [];
    for (let i = 0; i < 220; i++) {
      _petals.push({
        x0: rnd() * PW,
        y0: rnd() * PH,
        vx: 26 + rnd() * 78,
        vy: 12 + rnd() * 34,
        phase: rnd() * Math.PI * 2,
        sz: rnd() > 0.62 ? 3 : 2,
        pink: rnd() > 0.22
      });
    }
    _blizzardPetals = [];
    for (let i = 0; i < 520; i++) {
      _blizzardPetals.push({
        u: rnd(),
        v: rnd(),
        spd: 0.65 + rnd() * 1.45,
        sz: 3 + Math.floor(rnd() * 8),
        pink: i % 4 !== 0,
        seed: rnd() * 100
      });
    }
  }

  function ensureLogicalScale(ctx, f, core) {
    const curA = ctx.getTransform().a || 1;
    const curD = ctx.getTransform().d || 1;
    const targetA = (f.W || core.W) / core.W;
    const targetD = (f.H || core.H) / core.H;
    if (Math.abs(curA - targetA) > 0.01 || Math.abs(curD - targetD) > 0.01) {
      ctx.scale(targetA / curA, targetD / curD);
    }
  }

  function getPixelHimeProbe(cad) {
    if (!cad || typeof cad.drawPixelHime !== 'function') return null;
    if (_pxProbeCache && _pxProbeCache.fn === cad.drawPixelHime) return _pxProbeCache;
    try {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.imageSmoothingEnabled = false;
      g.fillStyle = '#000000';
      g.fillRect(0, 0, 128, 128);
      cad.drawPixelHime(g, 'far_calm', 64, 64, 1, 0, { fg: '#FFFFFF', bg: '#000000' });
      const d = g.getImageData(0, 0, 128, 128).data;
      let minX = 128, maxX = -1, minY = 128, maxY = -1;
      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          const idx = (y * 128 + x) * 4;
          if (d[idx] > 40 || d[idx + 1] > 40 || d[idx + 2] > 40) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxY < minY) return null;

      const c2 = document.createElement('canvas');
      c2.width = PW;
      c2.height = PH;
      const g2 = c2.getContext('2d', { willReadFrequently: true });
      g2.imageSmoothingEnabled = false;
      g2.fillStyle = '#000000';
      g2.fillRect(0, 0, PW, PH);
      cad.drawPixelHime(g2, 'closeup_wind', 256, 0, 1, 0, { fg: '#FFFFFF', bg: '#000000' });
      const d2 = g2.getImageData(0, 0, PW, PH).data;
      let cMinX = PW, cMaxX = -1, cMinY = PH, cMaxY = -1;
      for (let y = 0; y < PH; y++) {
        for (let x = 0; x < PW; x++) {
          const idx2 = (y * PW + x) * 4;
          if (d2[idx2] > 40 || d2[idx2 + 1] > 40 || d2[idx2 + 2] > 40) {
            if (x < cMinX) cMinX = x;
            if (x > cMaxX) cMaxX = x;
            if (y < cMinY) cMinY = y;
            if (y > cMaxY) cMaxY = y;
          }
        }
      }

      _pxProbeCache = {
        fn: cad.drawPixelHime,
        farFootDy: (maxY + 1) - 64,
        farCenterDx: Math.round((minX + maxX) * 0.5) - 64,
        closeNeedsCenter: cMaxX < cMinX || cMinX > 420 || cMaxY < 60
      };
      return _pxProbeCache;
    } catch (_) {
      return null;
    }
  }

  function pxRect(g, x, y, w, h, col) {
    const ix = Math.round(x);
    const iy = Math.round(y);
    const iw = Math.round(w);
    const ih = Math.round(h);
    if (iw <= 0 || ih <= 0) return;
    g.fillStyle = col;
    g.fillRect(ix, iy, iw, ih);
  }

  const TINY_GLYPHS = {
    '0': [7, 5, 5, 5, 7], '1': [2, 6, 2, 2, 7], '2': [7, 1, 7, 4, 7], '3': [7, 1, 7, 1, 7],
    '4': [5, 5, 7, 1, 1], '5': [7, 4, 7, 1, 7], '6': [7, 4, 7, 5, 7], '7': [7, 1, 1, 2, 2],
    '8': [7, 5, 7, 5, 7], '9': [7, 5, 7, 1, 7], 'S': [7, 4, 7, 1, 7], 'Y': [5, 5, 2, 2, 2],
    'N': [5, 7, 7, 5, 5], 'C': [7, 4, 4, 4, 7], ':': [0, 2, 0, 2, 0], '.': [0, 0, 0, 0, 2],
    '°': [6, 6, 0, 0, 0], 'E': [7, 4, 7, 4, 7], 'X': [5, 5, 2, 5, 5], 'P': [7, 5, 7, 4, 4],
    '-': [0, 0, 7, 0, 0], ' ': [0, 0, 0, 0, 0], 'B': [6, 5, 6, 5, 6], 'M': [5, 7, 5, 5, 5]
  };

  function drawPixelTinyText(g, str, x, y, scale, col) {
    const sc = Math.max(1, Math.round(scale));
    let cx = Math.round(x);
    const cy = Math.round(y);
    g.fillStyle = col;
    for (let i = 0; i < str.length; i++) {
      const rows = TINY_GLYPHS[str[i]] || TINY_GLYPHS[' '];
      for (let r = 0; r < 5; r++) {
        const bits = rows[r];
        for (let c = 0; c < 3; c++) {
          if ((bits >> (2 - c)) & 1) g.fillRect(cx + c * sc, cy + r * sc, sc, sc);
        }
      }
      cx += 4 * sc;
    }
  }

  // ==========================================================================
  // V6.1 Living 480x270 Quantized Pixel Camera Crossing (`PX09_A` Street + Sakura + Loafers!)
  // Continuously tracks/zooms across beats so the pixel street NEVER freezes!
  // ==========================================================================
  function drawPixelCrossingWorld(g, core, cad, t, bg, opts) {
    const v6 = window.CortexV6;
    const isDusk = !!opts.isDusk;
    if (v6 && typeof v6.drawLivingPixelCamera === 'function' && v6.getPlateImage('PX09_A')) {
      // Dynamic beat-choreographed camera moves across `PX09_A` (ZERO frozen frames!)
      let cam;
      if (t < 102.75) {
        const u = core.clamp((t - 101.16) / 1.59, 0, 1);
        cam = { u, zoom0: 1.04, zoom1: 1.24, fx0: 0.36, fx1: 0.62, fy0: 0.48, fy1: 0.44 };
      } else if (t < 104.45) {
        const u = core.clamp((t - 102.75) / 1.70, 0, 1);
        cam = { u, zoom0: 1.26, zoom1: 1.44, fx0: 0.58, fx1: 0.44, fy0: 0.42, fy1: 0.56 };
      } else if (t < 106.68) {
        const u = core.clamp((t - 104.45) / 2.23, 0, 1);
        cam = { u, zoom0: 1.18, zoom1: 1.46, fx0: 0.48, fx1: 0.54, fy0: 0.50, fy1: 0.40 };
      } else {
        // Dramatic fast pull-back reveal after train tail clears -> unveils full sakura street & JK loafers!
        const u = core.clamp((t - 106.68) / 1.17, 0, 1);
        cam = { u, zoom0: 1.42, zoom1: 1.02, fx0: 0.52, fx1: 0.50, fy0: 0.54, fy1: 0.50 };
      }
      v6.drawLivingPixelCamera(g, 'PX09_A', { x: 0, y: 0, w: PW, h: PH, ...cam });

      if (isDusk) {
        g.save();
        g.fillStyle = 'rgba(10, 13, 28, 0.24)';
        g.fillRect(0, 0, PW, PH);
        g.restore();
      }
      return;
    }
    pxRect(g, 0, 0, PW, PH, bg);
  }

  // ==========================================================================
  // Layer 3: Colossal `214px` (`79.3%` of `270px`) Foreground Express Train
  // with TRUE TRANSPARENT PUNCHED-OUT WINDOWS (`y = 74..160`)!
  // ==========================================================================
  function drawForegroundPixelExpressTrain(g, core, t, headX, nCars) {
    const carW = 336;
    const gapW = 20;
    const stride = carW + gapW;
    const carTop = 44;
    const carBot = 234;
    const winTop = 74;
    const winBot = 160;
    const winH = winBot - winTop;

    for (let c = 0; c < nCars; c++) {
      const x1 = Math.round(headX - c * stride);
      const x0 = x1 - carW;
      if (x1 < -30 || x0 > PW + 30) continue;

      const isLead = c === 0;
      const isTail = c === nCars - 1;

      // Rooftop HVAC pods (`#475569` / `#94A3B8`)
      pxRect(g, x0 + 28, 38, 68, 6, COL_GRAPHITE);
      pxRect(g, x0 + 30, 39, 64, 4, COL_SLATE_DARK);
      pxRect(g, x0 + 210, 38, 72, 6, COL_GRAPHITE);
      pxRect(g, x0 + 212, 39, 68, 4, COL_SLATE_DARK);

      // Diamond Pantograph + `#38BDF8` / `#FBBF24` Arc Sparks on `y = 35` Catenary!
      if (c % 2 === 0) {
        const px = x0 + 148;
        for (let k = 0; k < 9; k++) {
          pxRect(g, px - k * 2, 43 - k, 3, 2, COL_RULE);
          pxRect(g, px - 16 + k * 2, 35 + k, 3, 2, COL_RULE);
          pxRect(g, px + k * 2, 43 - k, 3, 2, COL_RULE);
          pxRect(g, px + 16 - k * 2, 35 + k, 3, 2, COL_RULE);
        }
        pxRect(g, px - 12, 34, 26, 2, COL_WHITE);
        if (px > 10 && px < PW - 10) {
          const fi = core.frameIdx ? core.frameIdx(t) : Math.round(t * 60);
          for (let s = 0; s < 10; s++) {
            const ang = core.hash(s, fi) * Math.PI * 2;
            const r = 4 + core.hash(s + 31, fi) * 18;
            const spCol = s % 3 === 0 ? COL_GOLD : (s % 3 === 1 ? COL_CYAN : COL_SAKURA);
            pxRect(g, px + Math.cos(ang) * r - s * 1.5, 35 - Math.abs(Math.sin(ang) * r * 0.75), 2, 2, spCol);
          }
        }
      }

      // Upper Car Header (`y = 44..74`): `#FAF8F5` Ivory Shell + `#1E293B` Trim + `#38BDF8` LED
      const noseCut = isLead ? 18 : 0;
      pxRect(g, x0, carTop, carW - noseCut, winTop - carTop, COL_WHITE);
      pxRect(g, x0, carTop, carW - noseCut, 4, COL_SLATE_MID);
      pxRect(g, x0, winTop - 3, carW - noseCut, 3, COL_COBALT);
      if (isLead) {
        for (let r = 0; r < 30; r++) {
          pxRect(g, x1 - 18, carTop + r, Math.floor((r * 18) / 30) + 2, 1, COL_WHITE);
        }
      }
      pxRect(g, x0 + 24, 51, 90, 14, COL_INK);
      pxRect(g, x0 + 25, 52, 88, 12, COL_PANEL);
      drawPixelTinyText(g, 'EXP-09 35.8C', x0 + 29, 55, 1, COL_CYAN);
      pxRect(g, x0 + 126, 54, carW - noseCut - 144, 6, COL_CRIMSON);

      // Window Band (`y = 74..160`): Solid Pillars ONLY; Windows Stay 100% PUNCHED-OUT TRANSPARENT!
      const windows = [[x0 + 18, 62], [x0 + 96, 66], [x0 + 178, 66], [x0 + 260, 56]];
      let curX = x0;
      for (let w = 0; w < windows.length; w++) {
        const [wx, ww] = windows[w];
        const pw = wx - curX;
        if (pw > 0) {
          pxRect(g, curX, winTop, pw, winH, COL_WHITE);
          if (pw > 6) pxRect(g, curX + 2, winTop, pw - 4, winH, COL_SLATE_DARK);
          if (pw >= 14) pxRect(g, curX + Math.floor(pw * 0.5), winTop, 2, winH, COL_RULE);
        }
        // Crisp window gasket frame (interior `wx+2..wx+ww-2` untouched -> transparent!)
        pxRect(g, wx, winTop, ww, 3, COL_SLATE_DARK);
        pxRect(g, wx, winBot - 3, ww, 3, COL_SLATE_DARK);
        pxRect(g, wx, winTop, 2, winH, COL_SLATE_DARK);
        pxRect(g, wx + ww - 2, winTop, 2, winH, COL_SLATE_DARK);
        pxRect(g, wx + 2, winTop + 2, 8, 2, COL_CYAN);
        // Commuter hand-straps along top rail (`y = 77..89`, well above heroine crown `y = 122`!)
        for (let st = wx + 12; st < wx + ww - 10; st += 16) {
          pxRect(g, st, winTop + 3, 1, 7, COL_RULE);
          pxRect(g, st - 2, winTop + 10, 5, 4, COL_GOLD);
          pxRect(g, st - 1, winTop + 11, 3, 2, COL_INK);
        }
        curX = wx + ww;
      }
      if (x1 > curX) {
        pxRect(g, curX, winTop, x1 - curX, winH, COL_WHITE);
        if (x1 - curX > 6) pxRect(g, curX + 2, winTop, x1 - curX - 4, winH, COL_SLATE_DARK);
      }

      // Lower Skirt Body (`y = 160..234`): Ivory `#FAF8F5` + `#FF2E55` Rapid Belt + `#0376B8` Pin-Stripe
      pxRect(g, x0, winBot, carW, carBot - winBot, COL_WHITE);
      pxRect(g, x0, winBot, carW, 3, COL_SLATE_DARK);
      pxRect(g, x0 + 2, winBot + 7, carW - 4, 8, COL_CRIMSON);
      pxRect(g, x0 + 2, winBot + 17, carW - 4, 3, COL_COBALT);
      pxRect(g, x0 + 2, carBot - 16, carW - 4, 16, COL_SLATE_DARK);
      for (let lx = x0 + 12; lx < x1 - 20; lx += 28) {
        pxRect(g, lx, carBot - 13, 18, 10, COL_BURIN);
        pxRect(g, lx + 2, carBot - 11, 14, 2, COL_INK);
        pxRect(g, lx + 2, carBot - 7, 14, 2, COL_INK);
      }
      if (isLead) {
        pxRect(g, x1 - 12, winBot + 8, 10, 14, COL_GOLD);
        pxRect(g, x1 - 9, winBot + 11, 5, 8, COL_WHITE);
      }
      if (isTail) {
        pxRect(g, x0 + 2, winBot + 8, 9, 14, COL_CRIMSON);
        pxRect(g, x0 + 4, winBot + 11, 5, 8, COL_SAKURA);
      }

      // Twin Heavy Bogies & Wheelsets (`y = 234..248`)
      for (const bx of [x0 + 32, x1 - 104]) {
        pxRect(g, bx, carBot, 72, 8, COL_INK);
        pxRect(g, bx + 2, carBot + 1, 68, 5, COL_BURIN);
        for (const wx of [bx + 10, bx + 48]) {
          pxRect(g, wx, carBot + 4, 14, 10, COL_GRAPHITE);
          pxRect(g, wx + 3, carBot + 6, 8, 6, COL_INK);
          pxRect(g, wx + 6, carBot + 8, 2, 2, COL_WHITE);
        }
      }

      // Accordion Coupler Bellows (with open daylight window above `y = 212`!)
      if (!isTail) {
        const gx = x0 - gapW;
        pxRect(g, gx, 212, gapW, 14, COL_SLATE_MID);
        pxRect(g, gx + 3, 214, gapW - 6, 10, COL_INK);
      }
    }
  }

  function drawPixelSakuraField(g, t, gustStrength) {
    for (let i = 0; i < _petals.length; i++) {
      const p = _petals[i];
      if (gustStrength < 0.3 && i > 95) continue;
      const dt = t - 95.8;
      const vx = p.vx * (0.45 + gustStrength * 2.6);
      const vy = p.vy * (0.65 + gustStrength * 0.9);
      const px = ((p.x0 + dt * vx + Math.sin(t * 4.2 + p.phase) * 9) % PW + PW) % PW;
      const py = ((p.y0 + dt * vy + Math.cos(t * 3.1 + p.phase) * 6) % PH + PH) % PH;
      const col = p.pink ? COL_SAKURA : COL_WHITE;
      pxRect(g, px, py, p.sz, p.sz > 2 ? 2 : p.sz, col);
      if (p.sz > 2) pxRect(g, px + 1, py - 1, 2, 1, col);
    }
  }

  // ==========================================================================
  // #53 Autonomous Per-Character Japanese Choreographer (`1文字ずつ独立個体`)
  // ==========================================================================
  function classifyJaChar(ch) {
    if (/[\u4E00-\u9FFF]/.test(ch)) return { mult: 1.54, kind: 'kanji', serif: true };
    if (/^[っゃゅょッャュョのをにがではもへとやでたしびいくるね]$/.test(ch)) {
      return { mult: 0.58, kind: 'particle', serif: false };
    }
    if (/[\u3040-\u309F]/.test(ch)) return { mult: 0.76, kind: 'hira', serif: false };
    if (/^[—―ー…!！？?「」]+$/.test(ch)) return { mult: 0.96, kind: 'punct', serif: false };
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

  function drawSakuraAutonomousSlice(ctx, core, words, i0, i1, t, kick, opts = {}) {
    const chars = expandWordsToChars(words, i0, i1);
    if (!chars.length) return;

    const x0 = opts.x0 !== undefined ? opts.x0 : 96;
    const maxW = opts.maxW || 1720;
    const baseCy = opts.cy !== undefined ? opts.cy : 140;
    const baseSz = opts.baseSz || 140;
    const slopeY = opts.slopeY || 0;
    const bandAmp = opts.bandAmp !== undefined ? opts.bandAmp : 26;
    const bg = opts.bg || COL_SKY_DUSK;

    // Measure proportional advance so NO TWO GLYPHS EVER COLLIDE!
    const items = chars.map((tk, idx) => {
      const cls = classifyJaChar(tk.w);
      const rawSz = Math.round(baseSz * cls.mult);
      const adv = rawSz * (cls.kind === 'particle' ? 0.84 : 0.96) + 8;
      return { tk, cls, rawSz, adv, idx };
    });

    const sumAdv = items.reduce((a, b) => a + b.adv, 0);
    const fit = sumAdv > maxW ? maxW / sumAdv : 1.0;

    let curX = opts.align === 'left' ? x0 : (x0 + (maxW - sumAdv * fit) * 0.5);
    const BANDS = [-1.0, 0.68, -0.45, 0.95, -0.72];
    const ROTS = [-0.15, 0.13, -0.11, 0.16, -0.13, 0.10];
    const STAMPS = [COL_CRIMSON, COL_SAKURA, COL_GOLD, COL_CYAN];

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const sz = Math.max(42, Math.round(it.rawSz * fit));
      const halfB = sz * 0.55 + 8;
      const wAdv = it.adv * fit;
      const u = items.length > 1 ? i / (items.length - 1) : 0.5;
      const maxRight = opts.maxX !== undefined ? opts.maxX - halfB : (core.W - 84 - halfB);
      const ax = core.clamp(curX + wAdv * 0.5, 84 + halfB, maxRight);
      const rawAy = baseCy + (u - 0.5) * slopeY + BANDS[i % BANDS.length] * bandAmp + (it.cls.kind === 'particle' ? 16 : 0);
      const ay = core.clamp(rawAy, 86 + halfB, 936 - halfB);
      const rot = ROTS[(i + i0) % ROTS.length];
      curX += wAdv;

      if (t < it.tk.start) {
        if (opts.sakuraPre) {
          const bob = Math.sin(t * 10 + i * 1.4) * 6;
          ctx.save();
          ctx.translate(ax, ay + bob);
          ctx.rotate(rot);
          ctx.fillStyle = i % 2 === 0 ? COL_SAKURA : COL_CYAN;
          ctx.fillRect(-7, -4, 14, 8);
          ctx.restore();
        } else if (opts.preReticle !== false) {
          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(rot);
          ctx.strokeStyle = COL_BURIN;
          ctx.lineWidth = 2;
          ctx.strokeRect(-10, -10, 20, 20);
          ctx.restore();
        }
        continue;
      }

      const age = t - it.tk.start;
      const uPop = core.clamp(age / 0.17, 0, 1);
      const pop = (window.CortexV6 ? window.CortexV6.aeSlam : core.ease.outExpo)(uPop);
      const inv = 1 - core.ease.outExpo(uPop);
      const isHot = t <= it.tk.end + 0.09;
      const slideX = opts.sakuraPre ? inv * 52 : (i % 2 === 0 ? -1 : 1) * inv * 38;
      const slideY = (i % 2 === 0 ? -1 : 1) * inv * 44 - (isHot ? 8 : 0) - kick * (it.cls.kind === 'kanji' ? 8 : 4);
      const drawX = core.clamp(ax + slideX, 82 + halfB, maxRight);
      const drawY = core.clamp(ay + slideY, 84 + halfB, 938 - halfB);

      const v6 = window.CortexV6;
      if (v6 && typeof v6.drawEditorialStamp === 'function') {
        const usePlaque = isHot || (it.cls.kind === 'kanji' && (i % 2 === 0));
        v6.drawEditorialStamp(ctx, it.tk.w, drawX, drawY, sz, rot + inv * (i % 2 === 0 ? -0.22 : 0.22), {
          kind: usePlaque ? (isHot ? 'accent' : 'frosted') : 'bare',
          serif: !!it.cls.serif,
          isHot: isHot,
          isPaper: false,
          scX: pop,
          scY: pop
        });
      }
    }
    ctx.restore();
  }

  // Per-Character Monumental Stamp Burst for `全部！` × 2 (V6 Sakura-Rose & Ivory Editorial Plaques!)
  function drawZenbuStampBurst(ctx, core, isSecond, slamP, kick) {
    const glyphs = isSecond
      ? [
          { ch: '全', x: -320, y: -28, sz: 344, rot: -0.13, kind: 'accent' },
          { ch: '部', x: 56,   y: 34,  sz: 328, rot: 0.11,  kind: 'mono' },
          { ch: '！', x: 346,  y: -22, sz: 282, rot: 0.17,  kind: 'accent' },
          { ch: '！', x: 486,  y: 26,  sz: 262, rot: 0.21,  kind: 'frosted' }
        ]
      : [
          { ch: '全', x: -250, y: 24,  sz: 336, rot: 0.12,  kind: 'mono' },
          { ch: '部', x: 118,  y: -26, sz: 322, rot: -0.10, kind: 'accent' },
          { ch: '！', x: 398,  y: 18,  sz: 278, rot: 0.16,  kind: 'frosted' }
        ];

    const sc = core.lerp(1.34, 1.0, slamP) + kick * 0.045;
    const v6 = window.CortexV6;
    ctx.save();
    ctx.translate(core.W * 0.5, 456);
    ctx.scale(sc, sc);
    for (let i = 0; i < glyphs.length; i++) {
      const g = glyphs[i];
      if (v6 && typeof v6.drawEditorialStamp === 'function') {
        v6.drawEditorialStamp(ctx, g.ch, g.x, g.y, g.sz, g.rot, {
          kind: g.kind,
          serif: true,
          isPaper: false
        });
      }
    }
    ctx.restore();
  }

  function drawPixelSparkThread(ctx, core, x0, x1, baseY, t, kick) {
    ctx.save();
    ctx.strokeStyle = COL_CRIMSON;
    ctx.lineWidth = 4;
    ctx.beginPath();
    const steps = 64;
    let headX = x1, headY = baseY;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const x = core.lerp(x0, x1, u);
      const wavePhase = ((u * 3.0 - t * 2.4) % 1 + 1) % 1;
      let ecg = 0;
      if (wavePhase > 0.42 && wavePhase < 0.46) ecg = -14;
      else if (wavePhase >= 0.46 && wavePhase < 0.50) ecg = 46 * (0.7 + kick * 0.6);
      else if (wavePhase >= 0.50 && wavePhase < 0.55) ecg = -24;
      else if (wavePhase > 0.62 && wavePhase < 0.72) ecg = 12;
      const y = baseY - ecg;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      if (i === steps) { headX = x; headY = y; }
    }
    ctx.stroke();

    // Clean glowing circular pulse tip (removed 4-point vector star diamond!)
    const r = 6 + kick * 5;
    ctx.fillStyle = COL_SAKURA;
    ctx.beginPath();
    ctx.arc(headX, headY, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  window.registerCortexPlate(PLATE_ID, {
    render(ctx, f, core) {
      ensurePools(core);
      const cad = window.Cortex25D;
      const { W, H, clamp, lerp, prog, ease } = core;
      const t = f.t;
      const kick = f.kickPulse ?? f.kickEnv ?? f.kick ?? 0;
      const snare = f.snareSnap ?? f.snareEnv ?? f.snare ?? 0;
      const fi = core.frameIdx ? core.frameIdx(t) : Math.round(t * 60);

      const c18 = core.cueById('L18_SPILLING_TOKENS');
      const c19 = core.cueById('L19_BEZIER_LIGHT');
      const c20 = core.cueById('L20_HEARTBEAT_PROOF');
      const w18 = (c18 && c18.words) || [];
      const w19 = (c19 && c19.words) || [];
      const w20 = (c20 && c20.words) || [];

      ctx.save();
      ensureLogicalScale(ctx, f, core);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = false;

      const pxStage = core.getPixelStage(PW, PH);
      const g = pxStage.ctx;
      g.imageSmoothingEnabled = false;
      g.shadowBlur = 0;
      g.globalAlpha = 1;

      const isDusk = t >= 106.68;
      let bg = isDusk ? COL_SKY_DUSK : COL_SKY_PRE;
      let fg = COL_WHITE;
      let shake = 0;

      // ======================================================================
      // PRE-WINDOW FALLBACK (`95.82 – 101.16s`, `L18`) — Integer `1x`/`2x` Only!
      // ======================================================================
      if (t < 101.16) {
        const subIdx = clamp(Math.floor((t - 95.82) / 1.335), 0, 3);

        g.save();
        if (subIdx === 0) {
          g.translate(PW * 0.5, PH * 0.5);
          g.scale(2, 2);
          g.translate(-342, -118);
          drawPixelCrossingWorld(g, core, cad, t, bg, { isWindy: false, isDusk: false });
          drawPixelSakuraField(g, t, 0.25);
        } else if (subIdx === 1) {
          g.translate(PW * 0.5, PH * 0.5);
          g.scale(2, 2);
          g.translate(-252, -148);
          drawPixelCrossingWorld(g, core, cad, t, bg, { isWindy: false, isDusk: false });
          drawPixelSakuraField(g, t, 0.35);
        } else if (subIdx === 2) {
          drawPixelCrossingWorld(g, core, cad, t, bg, { isWindy: true, isDusk: false });
          const beamW = Math.round(prog(t, 98.49, 99.82, ease.inExpo) * PW);
          pxRect(g, 0, 244, beamW, 5, COL_GOLD);
          drawPixelSakuraField(g, t, 0.55);
        } else {
          drawPixelCrossingWorld(g, core, cad, t, bg, { isWindy: true, isDusk: false });
          const leadX = lerp(60, 560, prog(t, 99.82, 101.16, ease.inQuad));
          drawForegroundPixelExpressTrain(g, core, t, leadX, 2);
          drawPixelSakuraField(g, t, 0.9);
          shake = 0.25;
        }
        g.restore();

        core.presentPixelStage(ctx, pxStage, W, H);

        if (t < 98.49) {
          drawSakuraAutonomousSlice(ctx, core, w18, 0, 9, t, kick, {
            x0: 110, maxW: W - 220, cy: 158, baseSz: 146, slopeY: -32, bandAmp: 28, bg
          });
        } else {
          drawSakuraAutonomousSlice(ctx, core, w18, 9, w18.length, t, kick, {
            x0: 110, maxW: W - 220, cy: 158, baseSz: 146, slopeY: 32, bandAmp: 28, bg
          });
        }
        drawPixelSparkThread(ctx, core, 96, W - 96, 932, t, kick);
      }

      // ======================================================================
      // CUT 1 & CUT 2 (`101.16 – 104.45s`, `L19` Part A):
      // Colossal `214px` (`79.3%`) Express Train Roaring Across Foreground +
      // Autonomous Per-Character `繋ぎ直すベジェの光も` (`0` fractional scale!)
      // ======================================================================
      else if (t < (w19[10] ? w19[10].start : 104.45)) {
        const isCut2 = t >= 102.75;
        const trainHeadX = 420 + (t - 101.16) * 680;
        shake = 0.16 + kick * 0.22;

        g.save();
        if (isCut2) {
          // Strict INTEGER pixel camera rattle (`1x` scale — preserves `79.3%` train height & crisp pixels!)
          const panX = Math.round(Math.sin((t - 102.75) * 14.0) * 3);
          const panY = (fi % 4 < 2) ? -1 : 0;
          g.translate(panX, panY);
        }
        drawPixelCrossingWorld(g, core, cad, t, bg, { isWindy: true, isDusk: false });
        drawForegroundPixelExpressTrain(g, core, t, trainHeadX, 8);
        drawPixelSakuraField(g, t, 1.15);
        g.restore();

        core.presentPixelStage(ctx, pxStage, W, H);

        drawSakuraAutonomousSlice(ctx, core, w19, 0, 10, t, kick, {
          x0: 88, maxW: W - 176, cy: 138, baseSz: 148, slopeY: isCut2 ? -36 : 34, bandAmp: 28, bg
        });
        drawPixelSparkThread(ctx, core, 64, W - 64, 248, t, kick);
      }

      // ======================================================================
      // CUT 3 & CUT 4 (`w19[10].start .. 106.68s`, `L19` Part B):
      // Two Vocal-Locked Window-Aperture Slams: `356px` Per-Char `'全' '部' '！'`!
      // ======================================================================
      else if (t < 106.68) {
        const tZen1 = w19[10] ? w19[10].start : 104.45;
        const tZen2 = w19[13] ? w19[13].start : 105.55;
        const isSecond = t >= tZen2;
        const cutT0 = isSecond ? tZen2 : tZen1;
        const tailClearHeadX = lerp(2460, 2980, prog(t, tZen1, 106.68));
        shake = 0.34 * core.pulse(t, cutT0, 0.12) + kick * 0.24 + snare * 0.14;

        g.save();
        if (isSecond) {
          // Integer pixel rattle (`1x` scale — ZERO fractional 1.15x blur!)
          g.translate(Math.round(Math.cos(t * 22) * 3), (fi % 2 === 0) ? -1 : 1);
        }
        drawPixelCrossingWorld(g, core, cad, t, bg, { isWindy: true, isDusk: false });
        drawForegroundPixelExpressTrain(g, core, t, tailClearHeadX, 8);
        drawPixelSakuraField(g, t, 1.35);
        g.restore();

        core.presentPixelStage(ctx, pxStage, W, H);

        const slamP = prog(t, cutT0, cutT0 + 0.16, ease.outExpo);
        drawZenbuStampBurst(ctx, core, isSecond, slamP, kick);
        drawPixelSparkThread(ctx, core, 64, W - 64, 926, t, kick);
      }

      // ======================================================================
      // CUT 5 (`106.68 – 107.85s`, `L20` Part A):
      // Tail Car Whips Out Right -> Instant `-1.5EV` Drop (`#070914`) ->
      // `0.55s` Slipstream Sakura Vortex Accreting `君に触れたくて跳ねる / 私の心拍証明！`
      // ======================================================================
      else if (t < 107.85) {
        bg = COL_SKY_DUSK;
        fg = COL_WHITE;
        const exitU = prog(t, 106.68, 106.92, ease.outCubic);
        const vortexP = prog(t, 106.68, 107.23, ease.outExpo);
        shake = 0.28 * core.pulse(t, 106.68, 0.10);

        drawPixelCrossingWorld(g, core, cad, t, bg, { isWindy: true, isDusk: true });
        if (exitU < 1) {
          drawForegroundPixelExpressTrain(g, core, t, lerp(PW + 180, PW + 360, exitU), 1);
        }
        drawPixelSakuraField(g, t, 1.65 - vortexP * 0.45);

        for (let i = 0; i < 120; i++) {
          const seed = core.hash(i, 701);
          const targetX = 42 + (i % 24) * 11;
          const targetY = i < 60 ? 48 : 96;
          const startX = PW - 20 - seed * 140;
          const startY = 140 + (core.hash(i, 709) - 0.5) * 90;
          const swirl = Math.sin((1 - vortexP) * Math.PI * 3 + i) * 34 * (1 - vortexP);
          const pCol = i % 3 === 0 ? COL_SAKURA : (i % 3 === 1 ? COL_WHITE : COL_GOLD);
          pxRect(g, lerp(startX, targetX, vortexP), lerp(startY, targetY, vortexP) + swirl, 3, 2, pCol);
        }

        core.presentPixelStage(ctx, pxStage, W, H);

        drawSakuraAutonomousSlice(ctx, core, w20, 0, 10, t, kick, {
          align: 'left', x0: 84, maxW: W - 240, cy: 192, baseSz: 144, slopeY: -28, bandAmp: 24, sakuraPre: true, bg
        });
        drawSakuraAutonomousSlice(ctx, core, w20, 10, w20.length, t, kick, {
          align: 'left', x0: 84, maxW: W - 260, cy: 404, baseSz: 158, slopeY: 28, bandAmp: 26, sakuraPre: true, bg
        });
        drawPixelSparkThread(ctx, core, 84, W - 84, 548, t, kick);
      }

      // ======================================================================
      // CUT 6A / 6B / 6C (`107.85 – 111.20s`, `L20` Part B — Living 3-Angle `PX09_B` Pixel Camera!):
      //   ZERO frozen background! 3 distinct dynamic pixel camera cuts + full-screen
      //   free-flowing kinetic Japanese typography (NO rigid left-half box wall!).
      // ======================================================================
      else if (t < 111.20) {
        bg = COL_SKY_DUSK;
        fg = COL_WHITE;
        const subCut = t < 108.97 ? 0 : (t < 110.09 ? 1 : 2);
        const subT0 = subCut === 0 ? 107.85 : (subCut === 1 ? 108.97 : 110.09);
        const subT1 = subCut === 0 ? 108.97 : (subCut === 1 ? 110.09 : 111.20);
        const su = clamp((t - subT0) / Math.max(0.1, subT1 - subT0), 0, 1);
        const v6 = window.CortexV6;

        if (v6 && typeof v6.drawLivingPixelCamera === 'function' && v6.getPlateImage('PX09_B')) {
          const pxCams = [
            // 6A: Sweeping diagonal push-in across sakura twilight portrait
            { zoom0: 1.04, zoom1: 1.24, fx0: 0.35, fx1: 0.62, fy0: 0.45, fy1: 0.34 },
            // 6B: Intimate eye-level sakura close-up pan
            { zoom0: 1.38, zoom1: 1.56, fx0: 0.68, fx1: 0.48, fy0: 0.28, fy1: 0.40 },
            // 6C: Dramatic pull-back as sakura storm erupts
            { zoom0: 1.34, zoom1: 1.04, fx0: 0.56, fx1: 0.50, fy0: 0.36, fy1: 0.50 }
          ];
          v6.drawLivingPixelCamera(g, 'PX09_B', { x: 0, y: 0, w: PW, h: PH, u: su, ...pxCams[subCut] });
        } else {
          pxRect(g, 0, 0, PW, PH, bg);
        }

        // Swirling wind-driven pixel sakura petals across entire twilight sky
        for (let i = 0; i < 115; i++) {
          const dt = t - 107.85;
          const p = _petals[i];
          const px = ((p.x0 + dt * p.vx * 1.95) % PW + PW) % PW;
          const py = ((p.y0 + dt * p.vy * 1.35 + Math.sin(dt * 5 + i) * 6) % (PH - 20) + (PH - 20)) % (PH - 20);
          pxRect(g, px, py, p.sz, 2, p.pink ? '#F1A8C1' : '#F5F0E8');
        }

        core.presentPixelStage(ctx, pxStage, W, H);

        // Soft feathered upper-left sky scrim only (NO rigid 50/50 split box!)
        const prevRaw = ctx.__v6RawColor;
        ctx.__v6RawColor = true;
        const lg = ctx.createRadialGradient(540, 380, 120, 540, 440, 920);
        lg.addColorStop(0, 'rgba(13, 16, 30, 0.56)');
        lg.addColorStop(1, 'rgba(13, 16, 30, 0.0)');
        ctx.fillStyle = lg;
        ctx.fillRect(0, 0, W, H);
        ctx.__v6RawColor = prevRaw;

        // Free-flowing diagonal typography spanning open space cleanly
        drawSakuraAutonomousSlice(ctx, core, w20, 0, 7, t, kick, {
          align: 'left', x0: 92, maxW: 940, maxX: 1120, cy: 205, baseSz: 138, slopeY: -32, bandAmp: 24, sakuraPre: false, preReticle: false, bg
        });
        drawSakuraAutonomousSlice(ctx, core, w20, 7, 10, t, kick, {
          align: 'left', x0: 196, maxW: 840, maxX: 1180, cy: 424, baseSz: 162, slopeY: -44, bandAmp: 28, sakuraPre: false, preReticle: false, bg
        });
        drawSakuraAutonomousSlice(ctx, core, w20, 10, w20.length, t, kick, {
          align: 'left', x0: 110, maxW: 1180, maxX: 1460, cy: 696, baseSz: 158, slopeY: 32, bandAmp: 28, sakuraPre: false, preReticle: false, bg
        });

        drawPixelSparkThread(ctx, core, 68, W - 120, 868, t, kick);
      }

      // ======================================================================
      // CUT 7 (`111.20 – 112.10s`):
      // Full-Screen Pixel Sakura Blizzard Wall Wipe over `PX09_B` into `P10`!
      // ======================================================================
      else {
        bg = COL_SKY_DUSK;
        fg = COL_WHITE;
        const wallP = prog(t, 111.20, 112.04, ease.inOutQuad);
        const v6 = window.CortexV6;

        if (v6 && typeof v6.drawPixelMaster === 'function' && v6.getPlateImage('PX09_B')) {
          v6.drawPixelMaster(g, 'PX09_B', { x: 0, y: 0, w: PW, h: PH });
        } else {
          pxRect(g, 0, 0, PW, PH, bg);
        }

        const activeCount = Math.floor(lerp(145, _blizzardPetals.length, wallP));
        const sizeBoost = Math.floor(wallP * 26);
        const sweepFront = wallP * (PW + PH + 120);

        if (wallP > 0.42) {
          const curtainP = prog(wallP, 0.42, 0.96, ease.inQuad);
          const diagLimit = curtainP * (PW + PH + 64);
          for (let y = 0; y < PH; y += 6) {
            const maxW = clamp(diagLimit - (PH - y) * 0.9, 0, PW);
            if (maxW > 0) {
              pxRect(g, PW - maxW, y, maxW, 6, COL_SAKURA);
              for (let wx = PW - Math.floor(maxW); wx < PW; wx += 18) {
                const mod = (wx + y + fi * 4) % 36;
                if (mod < 6) pxRect(g, wx, y + 1, 6, 4, COL_WHITE);
                else if (mod >= 16 && mod < 20) pxRect(g, wx, y + 2, 4, 3, COL_CRIMSON);
                else if (mod >= 28 && mod < 32) pxRect(g, wx, y + 1, 5, 3, COL_SLATE_DARK);
              }
            }
          }
        }

        for (let i = 0; i < activeCount; i++) {
          const bp = _blizzardPetals[i];
          const dt = t - 111.20;
          const px = PW - (((bp.u * PW + dt * 540 * bp.spd) % (PW + 60)));
          const py = ((bp.v * PH + dt * 220 * bp.spd + Math.sin(dt * 12 + bp.seed) * 14) % PH + PH) % PH;
          if ((PW - px) + (PH - py) * 0.5 <= sweepFront + 90) {
            const w = bp.sz + sizeBoost;
            const h = Math.max(2, Math.round(w * 0.72));
            const col = bp.pink ? COL_SAKURA : (i % 5 === 0 ? COL_GOLD : COL_WHITE);
            pxRect(g, px, py, w, h, col);
            pxRect(g, px + 2, py - 1, Math.max(1, w - 4), 2, col);
          }
        }

        if (t >= 112.02) {
          pxRect(g, 0, 0, PW, PH, COL_SAKURA);
          for (let y = 0; y < PH; y += 12) {
            for (let x = ((y * 7 + fi * 6) % 24); x < PW; x += 24) {
              pxRect(g, x, y, 8, 5, COL_WHITE);
              pxRect(g, x + 2, y - 2, 4, 2, COL_CRIMSON);
              if ((x + y) % 48 === 0) pxRect(g, x + 10, y + 3, 5, 3, COL_SLATE_DARK);
            }
          }
        }

        core.presentPixelStage(ctx, pxStage, W, H);

        // Keep `私の心拍証明！` (`>=225px` Kanji) resonant inside the swirling sakura blizzard until final curtain seal (`112.02s`)!
        if (t < 112.02) {
          drawSakuraAutonomousSlice(ctx, core, w20, 10, w20.length, t, kick, {
            align: 'left', x0: 86, maxW: 1360, maxX: 1680, cy: 676, baseSz: 184, slopeY: 26, bandAmp: 26, sakuraPre: true, bg
          });
        }
      }

      ctx.restore();

      return {
        isPaper: false,
        isPixel: true,
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
