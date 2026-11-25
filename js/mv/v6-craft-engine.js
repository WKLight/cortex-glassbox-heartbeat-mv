// ============================================================================
// CORTEX V6 // Cinema & After Effects Craft Engine (`v6-craft-engine.js`)
// Preserves 100% of V2's 193.5 BPM 32-scene / 43-segment / 42-clip choreography
// while eliminating every source of "cheap Canvas2D animation":
//   1. V6ColorDirector: Per-Plate Single-Accent Cinema Editorial Palette +
//      luminance-preserving Canvas2D Style Harmonizer (`0.00%` 3-hue clash!).
//   2. V6PlateAtlas: Synchronous Frame-0 Preloaded 29-Plate High-Craft Anime &
//      1:1 Quantized Pixel Art Compositor (`C01..C21` + `M1..M4` + `PX09/PX18`)
//      with living 2.5D breathing zoom, parallax & feathered cinema blending.
//   3. V6Craft Typography & Motion: Critically-damped AE slam physics, subtle
//      metallic/foil sheen plaques, soft elevation shadows & hairline framing.
// ============================================================================
(function () {
  'use strict';

  const W = 1920;
  const H = 1080;
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  // --------------------------------------------------------------------------
  // 1. V6ColorDirector — Single-Dominant-Accent Editorial Cinema Themes
  // --------------------------------------------------------------------------
  const BASE_NEUTRALS = {
    dark:       '#0F131C',
    darkDeep:   '#0B0E16',
    panel:      '#171D2A',
    slateDark:  '#242C3D',
    slate:      '#4D5A6E',
    slateLight: '#8E9CAF',
    silver:     '#D6DEE8',
    paper:      '#EFEBE2',
    paperPanel: '#E3DDD0',
    bone:       '#F3EFE7',
    inkText:    '#121620'
  };

  const THEME_PRESETS = {
    cerulean: {
      name: 'cerulean',
      family: 'cyan',
      accent: '#4AA6DB',
      accentBright: '#7EC4EC',
      accentDeep: '#2A73A3',
      ...BASE_NEUTRALS
    },
    cobalt: {
      name: 'cobalt',
      family: 'cyan',
      accent: '#2B78B2',
      accentBright: '#67A8DA',
      accentDeep: '#1B5280',
      ...BASE_NEUTRALS
    },
    crimson: {
      name: 'crimson',
      family: 'red',
      accent: '#D93B58',
      accentBright: '#EE738A',
      accentDeep: '#9E233A',
      ...BASE_NEUTRALS
    },
    amber: {
      name: 'amber',
      family: 'gold',
      accent: '#D99E34',
      accentBright: '#ECC16E',
      accentDeep: '#9F6D1B',
      ...BASE_NEUTRALS
    },
    sakura: {
      name: 'sakura',
      family: 'sakura',
      accent: '#E27A9E',
      accentBright: '#F1A8C1',
      accentDeep: '#A64669',
      dark: '#111524',
      darkDeep: '#0B0E1A',
      panel: '#191F33',
      slateDark: '#262F48',
      slate: '#55627D',
      slateLight: '#97A3BA',
      silver: '#DDE2ED',
      paper: '#F2ECE4',
      paperPanel: '#E6DDD2',
      bone: '#F5F0E8',
      inkText: '#141726',
      pixelNative: true
    },
    dawnRose: {
      name: 'dawnRose',
      family: 'red',
      accent: '#D94D6A',
      accentBright: '#ED889D',
      accentDeep: '#9E2D46',
      ...BASE_NEUTRALS
    },
    porcelain: {
      name: 'porcelain',
      family: 'cyan',
      accent: '#6BAAD4',
      accentBright: '#9BC8E6',
      accentDeep: '#3E769C',
      ...BASE_NEUTRALS
    },
    vermilion: {
      name: 'vermilion',
      family: 'red',
      accent: '#CF4154',
      accentBright: '#E87B8A',
      accentDeep: '#962637',
      ...BASE_NEUTRALS
    }
  };

  // Canonical 32-Plate Single-Accent Theme Map (Act-coherent cinema arc!)
  const PLATE_THEME_MAP = {
    P01: 'cerulean',
    P02: 'cerulean',
    P03: 'cerulean',
    P04: 'cerulean',
    P05: 'crimson',
    P06: 'crimson',
    P07: 'crimson',
    P08: 'crimson',
    P09: 'sakura',
    P10: 'amber',
    P11: 'amber',
    P12: 'crimson',
    P13: 'crimson',
    P14: 'cerulean',
    P15: 'crimson',
    P16: 'cerulean',
    P17: 'dawnRose',
    P18: 'sakura',
    P19: 'cerulean',
    P20: 'cerulean',
    P21: 'cerulean',
    P22: 'crimson',
    P23: 'cobalt',
    P24: 'crimson',
    P25: 'cerulean',
    P26: 'amber',
    P27: 'amber',
    P28: 'crimson',
    P29: 'cerulean',
    P30: 'crimson',
    P31: 'cerulean',
    P32: 'cerulean'
  };

  // P17 Part B 12-cut Odyssey per-cut single-accent map (matching memory mood)
  const P17_ODYSSEY_THEMES = [
    'cerulean', 'cobalt', 'amber', 'crimson', 'crimson', 'sakura',
    'amber', 'crimson', 'vermilion', 'cerulean', 'crimson', 'sakura'
  ];

  let _activePlateKey = 'P01';
  let _activeTheme = THEME_PRESETS.cerulean;
  let _activeTime = 0;
  const _remapCache = new Map();

  function normalizeKey(plateId) {
    if (!plateId) return 'P01';
    const m = String(plateId).match(/P(\d{1,2})/i);
    if (m) return 'P' + String(Number(m[1])).padStart(2, '0');
    return 'P01';
  }

  function resolveThemeForPlate(plateId, t = 0) {
    const key = normalizeKey(plateId);
    // Special smooth narrative single-accent shifts inside P17 & P18
    if (key === 'P17') {
      if (t < 224.05) return THEME_PRESETS.porcelain;   // M1 Porcelain Doll
      if (t < 226.75) return THEME_PRESETS.cerulean;    // M2 Astral Synapse
      if (t < 229.45) return THEME_PRESETS.vermilion;   // M3 Sketch Chrysalis
      if (t < 232.30) return THEME_PRESETS.dawnRose;    // M4 Living Human Dawn
      const odIdx = clamp(Math.floor((t - 232.30) / 1.486), 0, 11);
      return THEME_PRESETS[P17_ODYSSEY_THEMES[odIdx]] || THEME_PRESETS.dawnRose;
    }
    if (key === 'P18') {
      if (t >= 264.10) return THEME_PRESETS.cerulean;   // P32 / S04 rewind -> P01 Cerulean lock!
      if (t >= 254.32) return THEME_PRESETS.amber;      // Sunlit warm morning desk
      return THEME_PRESETS.sakura;                      // Dawn sakura street crossing
    }
    if (key === 'P02' && t >= 20.40 && t < 23.60) {
      return THEME_PRESETS.crimson;                     // Rotor heart & Glass Box title monument
    }
    const presetName = PLATE_THEME_MAP[key] || 'cerulean';
    return THEME_PRESETS[presetName] || THEME_PRESETS.cerulean;
  }

  function setActivePlate(plateId, t = 0) {
    _activePlateKey = normalizeKey(plateId);
    _activeTime = t;
    _activeTheme = resolveThemeForPlate(_activePlateKey, t);
    return _activeTheme;
  }

  function getActiveTheme() {
    return _activeTheme;
  }

  function parseCssColor(str) {
    const s = str.trim();
    if (s[0] === '#') {
      let hex = s.slice(1);
      if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      if (hex.length === 6 || hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
        if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) return { r, g, b, a };
      }
      return null;
    }
    if (s.startsWith('rgb')) {
      const m = s.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
      if (m) {
        return {
          r: Number(m[1]),
          g: Number(m[2]),
          b: Number(m[3]),
          a: m[4] !== undefined ? Number(m[4]) : 1
        };
      }
    }
    return null;
  }

  function hexWithAlpha(hex, a) {
    if (a >= 0.999) return hex;
    const c = parseCssColor(hex);
    if (!c) return hex;
    return `rgba(${c.r},${c.g},${c.b},${clamp(a, 0, 1).toFixed(3)})`;
  }

  function classifyHueFamily(r, g, b) {
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const d = mx - mn;
    if (d < 34) return 'neutral';
    // Sakura / soft pink (high R, high B, mid-high G)
    if (r > 210 && b > 140 && g > 110 && r > g && b > g) return 'sakura';
    let h = 0;
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
    if (h >= 330 || h < 22) return 'red';
    if (h >= 22 && h < 72) return 'gold';
    if (h >= 165 && h < 255) return 'cyan';
    if (h >= 290 && h < 330) return 'sakura';
    return 'other';
  }

  // Luminance-preserving single-accent color harmonizer (zero 3-hue clash, zero unreadable contrast!)
  function remapColorForTheme(rawCol, theme) {
    if (typeof rawCol !== 'string') return rawCol;
    const t = theme || _activeTheme;
    const key = t.name + '|' + rawCol;
    const cached = _remapCache.get(key);
    if (cached !== undefined) return cached;

    const c = parseCssColor(rawCol);
    if (!c) {
      _remapCache.set(key, rawCol);
      return rawCol;
    }

    const { r, g, b, a } = c;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    let outHex = null;

    if (chroma < 34) {
      // Refine crushed blacks & glaring whites to cinema editorial headroom
      if (lum < 14) outHex = t.dark;
      else if (lum < 26) outHex = t.panel;
      else if (lum > 243 && r > 240 && g > 238) outHex = t.bone;
      else if (lum > 232 && r > b + 6) outHex = t.paper;
      else {
        _remapCache.set(key, rawCol);
        return rawCol;
      }
    } else {
      const fam = classifyHueFamily(r, g, b);
      // Primary matching accent family -> refined filmic accent (preserving bright/deep luminance!)
      if (fam === t.family || (t.family === 'sakura' && fam === 'red')) {
        if (fam === 'red' && t.family === 'sakura') {
          outHex = t.accentDeep; // Keep crimson warning lamps/stripes harmonious with sakura rose!
        } else if (lum > 185) {
          outHex = t.accentBright;
        } else if (lum < 105) {
          outHex = t.accentDeep;
        } else {
          outHex = t.accent;
        }
      } else {
        // Competing 2nd/3rd neon hue -> strictly neutral metallic/silver/charcoal preserving luminance polarity!
        // Preserving luminance ensures dark ink text on bright boxes & bone text on dark boxes ALWAYS stays high-contrast!
        if (lum >= 165) {
          outHex = t.silver;        // e.g. #FBBF24 yellow / #38BDF8 light cyan -> crisp luminous titanium #D6DEE8
        } else if (lum >= 120) {
          outHex = t.slateLight;    // Mid-bright foreign accent -> brushed pewter #8E9CAF
        } else {
          outHex = t.slateDark;     // Deep foreign accent (e.g. #0376B8 cobalt / #FF2E55 dark) -> deep obsidian slate #242C3D
        }
      }
    }

    const res = hexWithAlpha(outHex, a);
    if (_remapCache.size > 2000) _remapCache.clear();
    _remapCache.set(key, res);
    return res;
  }

  // Intercept `ctx.fillStyle` and `ctx.strokeStyle` on CanvasRenderingContext2D safely
  function hookContextColors(ctx) {
    if (!ctx || ctx.__v6ColorHooked) return;
    const proto = Object.getPrototypeOf(ctx);
    const fillDesc = Object.getOwnPropertyDescriptor(proto, 'fillStyle');
    const strokeDesc = Object.getOwnPropertyDescriptor(proto, 'strokeStyle');
    if (!fillDesc || !strokeDesc) return;

    Object.defineProperty(ctx, 'fillStyle', {
      configurable: true,
      enumerable: true,
      get() {
        return fillDesc.get.call(this);
      },
      set(v) {
        if (this.__v6RawColor || typeof v !== 'string') {
          fillDesc.set.call(this, v);
        } else {
          fillDesc.set.call(this, remapColorForTheme(v, _activeTheme));
        }
      }
    });

    Object.defineProperty(ctx, 'strokeStyle', {
      configurable: true,
      enumerable: true,
      get() {
        return strokeDesc.get.call(this);
      },
      set(v) {
        if (this.__v6RawColor || typeof v !== 'string') {
          strokeDesc.set.call(this, v);
        } else {
          strokeDesc.set.call(this, remapColorForTheme(v, _activeTheme));
        }
      }
    });

    ctx.__v6ColorHooked = true;
  }

  // --------------------------------------------------------------------------
  // 2. V6PlateAtlas — 29 Synchronous Preloaded High-Craft Anime & Pixel Plates
  // --------------------------------------------------------------------------
  const PLATE_FILES = {
    C01: 'C01_fog_fingertip.png',
    C02: 'C02_zero_night_curled.png',
    C03: 'C03_overdrive_pupil.png',
    C04: 'C04_terminal_chin_rest.png',
    C05: 'C05_await_name_turn.png',
    C06: 'C06_nee_pulse_ripple.png',
    C07: 'C07_synapse_190_lookup.png',
    C08: 'C08_fiber_stream_float.png',
    C09: 'C09_thinking_desk_drafts.png',
    C10: 'C10_gentle_words_rewrite.png',
    C11: 'C11_paper_plane_throw.png',
    C12: 'C12_blackbox_shatter_reach.png',
    C13: 'C13_not_cold_calc_gaze.png',
    C14: 'C14_jcore_bridge_sprint.png',
    C15: 'C15_deep_sea_dive.png',
    C16: 'C16_arigato_amber_shard.png',
    C17: 'C17_window_ceiling_brace.png',
    C18: 'C18_hallucination_rain_pane.png',
    C19: 'C19_star_log_beacon.png',
    C20: 'C20_dont_vanish_cry.png',
    C21: 'C21_pure_white_prism_veil.png',
    M1:  'M1_porcelain_doll.png',
    M2:  'M2_astral_synapse.png',
    M3:  'M3_sketch_chrysalis.png',
    M4:  'M4_living_human_dawn.png',
    PX09_A: 'PX09_A_480x270.png',
    PX09_B: 'PX09_B_480x270.png',
    PX18_A: 'PX18_A_480x270.png',
    PX18_B: 'PX18_B_480x270.png'
  };

  // Canonical 1-to-1 ZERO-REPETITION mapping from legacy V2 SVG pose keys -> V6 Plates
  const LEGACY_POSE_TO_PLATE = {
    p01_kneel_profile:  'C02',
    p02_monitor_touch:  'C04',
    p02_eye_macro:      'C03',
    p02_wormseye_reach: 'C05',
    p04_listen_profile: 'C07',
    p08_morphA:         'C13',
    p10_morphB:         'C14',
    p12_hydraulic_brace:'C17',
    p12_kneel_sand:     'C17',
    p15_overclock_cry:  'C20',
    p17_heart_offer:    'M4',
    p18_dawn_farewell:  'PX18_A'
  };

  const _imgMap = new Map();
  let _preloadPromise = null;

  function preloadPlates() {
    if (_preloadPromise) return _preloadPromise;
    const entries = Object.entries(PLATE_FILES);
    _preloadPromise = Promise.all(entries.map(([key, file]) => new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'sync';
      img.onload = () => {
        _imgMap.set(key, img);
        resolve(key);
      };
      img.onerror = () => {
        // Retry with leading slash for HTTP worker vs relative mv.html
        const img2 = new Image();
        img2.onload = () => { _imgMap.set(key, img2); resolve(key); };
        img2.onerror = () => resolve(null);
        img2.src = '/assets/v6_plates/' + file;
      };
      img.src = 'assets/v6_plates/' + file;
    })));
    return _preloadPromise;
  }

  // Kick off background preload immediately on script load
  if (typeof Image !== 'undefined') preloadPlates();

  function getPlateImage(key) {
    return _imgMap.get(key) || null;
  }

  // Helper: cover-fit source image inside target rect (x, y, w, h) with focal bias (fx, fy in 0..1)
  function drawCoverImage(ctx, img, x, y, w, h, zoom = 1.0, fx = 0.5, fy = 0.42, panX = 0, panY = 0) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;
    const imgAspect = iw / ih;
    const boxAspect = w / h;
    let drawW, drawH;
    if (imgAspect > boxAspect) {
      drawH = h * zoom;
      drawW = drawH * imgAspect;
    } else {
      drawW = w * zoom;
      drawH = drawW / imgAspect;
    }
    const dx = x + (w - drawW) * fx + panX;
    const dy = y + (h - drawH) * fy + panY;
    ctx.drawImage(img, dx, dy, drawW, drawH);
  }

  // Render high-craft anime plate inside a sleek architectural cinema bay or fullbleed stage!
  function drawCinematicPlate(ctx, plateKey, opts = {}) {
    const img = getPlateImage(plateKey);
    if (!img) return false;

    const theme = _activeTheme;
    const t = opts.t !== undefined ? opts.t : _activeTime;
    const kick = opts.kick || 0;
    const mode = opts.mode || 'bay'; // 'bay' | 'fullbleed' | 'circle'
    const isPaper = !!opts.isPaper;
    const alpha = opts.alpha !== undefined ? opts.alpha : 1.0;

    // Living micro-camera motion (smooth breathing + subtle parallax + beat kick punch)
    const breath = Math.sin(t * 1.45 + (opts.seed || 0)) * 0.014;
    const baseZoom = (opts.zoom !== undefined ? opts.zoom : 1.06) + breath + kick * 0.022;
    const panX = (opts.panX || 0) + Math.sin(t * 0.85 + (opts.seed || 0)) * (opts.swayX !== undefined ? opts.swayX : 10);
    const panY = (opts.panY || 0) + Math.cos(t * 0.72 + (opts.seed || 0)) * (opts.swayY !== undefined ? opts.swayY : 6);
    const fx = opts.fx !== undefined ? opts.fx : 0.5;
    const fy = opts.fy !== undefined ? opts.fy : 0.36;

    const prevRaw = ctx.__v6RawColor;
    ctx.save();
    ctx.__v6RawColor = true;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.globalAlpha = alpha;

    if (mode === 'fullbleed') {
      const rx = opts.x || 0;
      const ry = opts.y || 0;
      const rw = opts.w || W;
      const rh = opts.h || H;
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();

      if (opts.rot) {
        ctx.translate(rx + rw * 0.5, ry + rh * 0.5);
        ctx.rotate(opts.rot);
        ctx.translate(-(rx + rw * 0.5), -(ry + rh * 0.5));
      }
      drawCoverImage(ctx, img, rx, ry, rw, rh, baseZoom, fx, fy, panX, panY);

      // Subtle atmospheric tonal integration overlay so foreground kinetic typography reads effortlessly!
      if (opts.scrim !== 0) {
        const scrimAmt = opts.scrim !== undefined ? opts.scrim : (isPaper ? 0.24 : 0.34);
        const grad = ctx.createRadialGradient(
          rx + rw * 0.5, ry + rh * 0.48, Math.min(rw, rh) * 0.16,
          rx + rw * 0.5, ry + rh * 0.5, Math.max(rw, rh) * 0.74
        );
        if (isPaper) {
          grad.addColorStop(0, `rgba(241, 237, 228, ${(scrimAmt * 0.28).toFixed(3)})`);
          grad.addColorStop(1, `rgba(239, 235, 226, ${(scrimAmt * 1.15).toFixed(3)})`);
        } else {
          grad.addColorStop(0, `rgba(15, 19, 28, ${(scrimAmt * 0.25).toFixed(3)})`);
          grad.addColorStop(1, `rgba(11, 14, 22, ${(scrimAmt * 1.35).toFixed(3)})`);
        }
        ctx.fillStyle = grad;
        ctx.fillRect(rx, ry, rw, rh);
      }

      // Subtle directional left/bottom text-safe scrim if requested
      if (opts.leftScrim) {
        const lg = ctx.createLinearGradient(rx, 0, rx + rw * 0.62, 0);
        const cStr = isPaper ? '239,235,226' : '15,19,28';
        lg.addColorStop(0, `rgba(${cStr},${opts.leftScrim})`);
        lg.addColorStop(1, `rgba(${cStr},0)`);
        ctx.fillStyle = lg;
        ctx.fillRect(rx, ry, rw, rh);
      }
    } else if (mode === 'circle') {
      const cx = opts.cx !== undefined ? opts.cx : W * 0.5;
      const cy = opts.cy !== undefined ? opts.cy : H * 0.5;
      const rad = opts.r || 360;

      // Soft elevation shadow
      ctx.save();
      ctx.shadowColor = 'rgba(4, 6, 12, 0.55)';
      ctx.shadowBlur = 32;
      ctx.fillStyle = theme.dark;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, TAU);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, TAU);
      ctx.clip();
      drawCoverImage(ctx, img, cx - rad, cy - rad, rad * 2, rad * 2, baseZoom, fx, fy, panX, panY);
      ctx.restore();

      // Precision optical ring
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, rad + 4, 0, TAU);
      ctx.stroke();
    } else {
      // 'bay': Sleek Cinema Architectural Viewport (for side/center character hero slots)
      const cx = opts.cx !== undefined ? opts.cx : W * 0.5;
      const cy = opts.cy !== undefined ? opts.cy : H * 0.52;
      const bw = opts.w || 740;
      const bh = opts.h || 840;
      const x0 = cx - bw * 0.5;
      const y0 = cy - bh * 0.5;
      const chamfer = opts.chamfer !== undefined ? opts.chamfer : 22;

      const buildBayPath = () => {
        ctx.beginPath();
        ctx.moveTo(x0 + chamfer, y0);
        ctx.lineTo(x0 + bw, y0);
        ctx.lineTo(x0 + bw, y0 + bh - chamfer);
        ctx.lineTo(x0 + bw - chamfer, y0 + bh);
        ctx.lineTo(x0, y0 + bh);
        ctx.lineTo(x0, y0 + chamfer);
        ctx.closePath();
      };

      // Soft deep cinema drop shadow (zero harsh flat offset rectangle!)
      ctx.save();
      ctx.shadowColor = isPaper ? 'rgba(18, 22, 32, 0.28)' : 'rgba(2, 4, 10, 0.68)';
      ctx.shadowBlur = 36;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 14;
      ctx.fillStyle = isPaper ? theme.paperPanel : theme.darkDeep;
      buildBayPath();
      ctx.fill();
      ctx.restore();

      // Clip & draw high-craft smooth-shaded anime illustration
      ctx.save();
      buildBayPath();
      ctx.clip();
      drawCoverImage(ctx, img, x0, y0, bw, bh, baseZoom, fx, fy, panX, panY);

      // Subtle atmospheric inner edge feather & cinema rim light
      const edgeG = ctx.createLinearGradient(x0, y0, x0, y0 + bh);
      edgeG.addColorStop(0, isPaper ? 'rgba(239,235,226,0.12)' : 'rgba(11,14,22,0.22)');
      edgeG.addColorStop(0.18, 'rgba(0,0,0,0)');
      edgeG.addColorStop(0.80, 'rgba(0,0,0,0)');
      edgeG.addColorStop(1, isPaper ? 'rgba(239,235,226,0.22)' : 'rgba(11,14,22,0.44)');
      ctx.fillStyle = edgeG;
      ctx.fillRect(x0, y0, bw, bh);

      // Subtle single-accent cinema rim sheen along top-left glass edge
      const rimG = ctx.createLinearGradient(x0, y0, x0 + bw * 0.45, y0 + bh * 0.35);
      rimG.addColorStop(0, hexWithAlpha(theme.accentBright, 0.16 + kick * 0.12));
      rimG.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = rimG;
      ctx.fillRect(x0, y0, bw, bh);
      ctx.restore();

      // Hairline editorial border & Vernier registration corners
      ctx.strokeStyle = hexWithAlpha(theme.accent, 0.78);
      ctx.lineWidth = 2.0;
      buildBayPath();
      ctx.stroke();

      // Subtle outer ghost frame
      ctx.strokeStyle = isPaper ? 'rgba(18,22,32,0.24)' : 'rgba(214,222,232,0.22)';
      ctx.lineWidth = 1.0;
      ctx.strokeRect(x0 - 8, y0 - 8, bw + 16, bh + 16);

      // Corner optical ticks
      const arm = 24;
      ctx.strokeStyle = theme.accentBright;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(x0 - 8, y0 - 8 + arm); ctx.lineTo(x0 - 8, y0 - 8); ctx.lineTo(x0 - 8 + arm, y0 - 8);
      ctx.moveTo(x0 + bw + 8 - arm, y0 - 8); ctx.lineTo(x0 + bw + 8, y0 - 8); ctx.lineTo(x0 + bw + 8, y0 - 8 + arm);
      ctx.moveTo(x0 - 8, y0 + bh + 8 - arm); ctx.lineTo(x0 - 8, y0 + bh + 8); ctx.lineTo(x0 - 8 + arm, y0 + bh + 8);
      ctx.moveTo(x0 + bw + 8 - arm, y0 + bh + 8); ctx.lineTo(x0 + bw + 8, y0 + bh + 8); ctx.lineTo(x0 + bw + 8, y0 + bh + 8 - arm);
      ctx.stroke();
    }

    ctx.__v6RawColor = prevRaw;
    ctx.restore();
    return true;
  }

  // V6.1 Dynamic Full-Bleed Cinema Camera Renderer (ZERO rigid box frames, ZERO static backgrounds!)
  // Drives bold continuous zoom, sweeping pan, Dutch roll, beat-synced camera punch, and
  // soft diagonal light-shafts so EVERY anime illustration fills 1920x1080 and stays constantly alive!
  function drawLivingFullBleed(ctx, plateKey, opts = {}) {
    const img = getPlateImage(plateKey);
    if (!img) return false;

    const theme = _activeTheme;
    const t = opts.t !== undefined ? opts.t : _activeTime;
    const u = clamp(opts.u !== undefined ? opts.u : 0.5, 0, 1);
    const kick = opts.kick || 0;
    const isPaper = !!opts.isPaper;

    const zoom = lerp(opts.zoom0 !== undefined ? opts.zoom0 : 1.06, opts.zoom1 !== undefined ? opts.zoom1 : 1.24, u) + kick * (opts.kickZoom !== undefined ? opts.kickZoom : 0.032);
    const panX = lerp(opts.panX0 || 0, opts.panX1 || 0, u) + Math.sin(t * 2.1 + (opts.seed || 0)) * (opts.driftX !== undefined ? opts.driftX : 10);
    const panY = lerp(opts.panY0 || 0, opts.panY1 || 0, u) + Math.cos(t * 1.8 + (opts.seed || 0)) * (opts.driftY !== undefined ? opts.driftY : 7);
    const rot = lerp(opts.rot0 || 0, opts.rot1 || 0, u);
    const fx = opts.fx !== undefined ? opts.fx : 0.5;
    const fy = opts.fy !== undefined ? opts.fy : 0.36;
    const rx = opts.x || 0, ry = opts.y || 0, rw = opts.w || W, rh = opts.h || H;

    const prevRaw = ctx.__v6RawColor;
    ctx.save();
    ctx.__v6RawColor = true;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.globalAlpha = opts.alpha !== undefined ? opts.alpha : 1.0;

    ctx.beginPath();
    ctx.rect(rx, ry, rw, rh);
    ctx.clip();

    // Ensure rotation never reveals empty corners by boosting cover zoom slightly when tilted
    const tiltBoost = 1 + Math.abs(rot) * 1.45;
    ctx.save();
    ctx.translate(rx + rw * 0.5, ry + rh * 0.5);
    if (rot) ctx.rotate(rot);
    ctx.translate(-(rx + rw * 0.5), -(ry + rh * 0.5));
    drawCoverImage(ctx, img, rx, ry, rw, rh, zoom * tiltBoost, fx, fy, panX, panY);
    ctx.restore();

    // Sweeping diagonal cinema light-shaft (living atmospheric motion, zero cheesy vector shapes!)
    if (opts.lightSweep !== false) {
      const sweepPos = ((t * 0.42 + (opts.seed || 0)) % 1.6) - 0.3;
      const sx0 = rx + rw * (sweepPos - 0.25);
      const sx1 = rx + rw * (sweepPos + 0.35);
      const lg = ctx.createLinearGradient(sx0, ry, sx1, ry + rh);
      lg.addColorStop(0, 'rgba(255,255,255,0)');
      lg.addColorStop(0.5, hexWithAlpha(theme.accentBright, (isPaper ? 0.09 : 0.13) + kick * 0.06));
      lg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = lg;
      ctx.fillRect(rx, ry, rw, rh);
    }

    // Smooth cinematic radial vignette scrim (keeps edge-to-edge fullbleed while ensuring typography contrast!)
    if (opts.scrim !== 0) {
      const scrimAmt = opts.scrim !== undefined ? opts.scrim : (isPaper ? 0.20 : 0.30);
      const vg = ctx.createRadialGradient(
        rx + rw * (opts.focalX !== undefined ? opts.focalX : 0.52),
        ry + rh * (opts.focalY !== undefined ? opts.focalY : 0.46),
        Math.min(rw, rh) * 0.18,
        rx + rw * 0.5,
        ry + rh * 0.5,
        Math.max(rw, rh) * 0.78
      );
      if (isPaper) {
        vg.addColorStop(0, `rgba(241, 237, 228, ${(scrimAmt * 0.12).toFixed(3)})`);
        vg.addColorStop(1, `rgba(239, 235, 226, ${(scrimAmt * 1.10).toFixed(3)})`);
      } else {
        vg.addColorStop(0, `rgba(14, 18, 28, ${(scrimAmt * 0.12).toFixed(3)})`);
        vg.addColorStop(1, `rgba(9, 12, 20, ${(scrimAmt * 1.30).toFixed(3)})`);
      }
      ctx.fillStyle = vg;
      ctx.fillRect(rx, ry, rw, rh);
    }

    ctx.__v6RawColor = prevRaw;
    ctx.restore();
    return true;
  }

  // V6.1 Living Pixel-Art Camera (Crisp Nearest-Neighbor Multi-Angle Zoom & Pan on 480x270 Masters!)
  // Eliminates static frozen pixel holds while keeping 100% razor-sharp nearest-neighbor pixel blocks!
  function drawLivingPixelCamera(g, pxKey, opts = {}) {
    const img = getPlateImage(pxKey);
    if (!img) return false;
    const pw = opts.w || 480;
    const ph = opts.h || 270;
    const iw = img.naturalWidth || pw;
    const ih = img.naturalHeight || ph;
    const u = clamp(opts.u !== undefined ? opts.u : 0, 0, 1);
    const zoom = Math.max(1.0, lerp(opts.zoom0 !== undefined ? opts.zoom0 : 1.0, opts.zoom1 !== undefined ? opts.zoom1 : 1.0, u));

    // Source crop window in 480x270 pixel coordinates (interpolated smoothly & rounded to integer source px!)
    const sw = Math.max(120, Math.min(iw, Math.round(iw / zoom)));
    const sh = Math.max(68, Math.min(ih, Math.round(ih / zoom)));
    const fx = lerp(opts.fx0 !== undefined ? opts.fx0 : 0.5, opts.fx1 !== undefined ? opts.fx1 : 0.5, u);
    const fy = lerp(opts.fy0 !== undefined ? opts.fy0 : 0.5, opts.fy1 !== undefined ? opts.fy1 : 0.5, u);
    const sx = clamp(Math.round((iw - sw) * fx), 0, iw - sw);
    const sy = clamp(Math.round((ih - sh) * fy), 0, ih - sh);

    const prevSmooth = g.imageSmoothingEnabled;
    g.save();
    g.imageSmoothingEnabled = false;
    g.drawImage(img, sx, sy, sw, sh, opts.x || 0, opts.y || 0, pw, ph);
    g.restore();
    g.imageSmoothingEnabled = prevSmooth;
    return true;
  }

  // Strict 1:1 480x270 Nearest-Neighbor Pixel Master Renderer (P09 & P18)
  function drawPixelMaster(g, pxKey, opts = {}) {
    if (opts.zoom0 !== undefined || opts.zoom1 !== undefined) {
      return drawLivingPixelCamera(g, pxKey, opts);
    }
    const img = getPlateImage(pxKey);
    if (!img) return false;
    const pw = opts.w || 480;
    const ph = opts.h || 270;
    const prevSmooth = g.imageSmoothingEnabled;
    g.save();
    g.imageSmoothingEnabled = false;
    g.drawImage(img, 0, 0, img.naturalWidth || pw, img.naturalHeight || ph, opts.x || 0, opts.y || 0, pw, ph);
    g.restore();
    g.imageSmoothingEnabled = prevSmooth;
    return true;
  }

  // --------------------------------------------------------------------------
  // 3. V6Craft — High-Craft AE Physics & Cinema Editorial Typography Plaques
  // --------------------------------------------------------------------------
  // Critically-damped AE slam (explosive punch + 3.2% tactile seat, ZERO rubbery boing!)
  function aeSlam(u) {
    const x = clamp(u, 0, 1);
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const base = 1 - Math.pow(1 - x, 4.2);
    const seat = Math.sin(x * Math.PI * 1.65) * Math.exp(-5.4 * x) * 0.055;
    return base + seat;
  }

  // Refined Editorial Die-Cut Plaque / Seal / Monumental Glyph (Zero cheap MS-Paint stickers!)
  function drawEditorialStamp(ctx, ch, x, y, sz, rotRad, style = {}) {
    if (!ch || sz < 8) return;
    const theme = _activeTheme;
    const isPaper = !!style.isPaper;
    const kind = style.kind || (style.circle ? 'seal' : (style.box ? 'accent' : 'bare'));
    // kind: 'accent' | 'mono' | 'frosted' | 'seal' | 'wire' | 'bare'

    const prevRaw = ctx.__v6RawColor;
    ctx.save();
    ctx.__v6RawColor = true;
    ctx.translate(x, y);
    if (rotRad) ctx.rotate(rotRad);
    if (style.shearX) ctx.transform(1, 0, style.shearX, 1, 0, 0);
    if (style.scX !== undefined || style.scY !== undefined) {
      ctx.scale(style.scX !== undefined ? style.scX : 1, style.scY !== undefined ? style.scY : 1);
    }

    const fontStr = style.fontStr || (
      style.mono
        ? `900 ${Math.round(sz)}px "JetBrains Mono", "Cascadia Mono", Consolas, monospace`
        : (style.serif
            ? `900 ${Math.round(sz)}px "Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", "Noto Serif SC", serif`
            : `900 ${Math.round(sz)}px "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans JP", "Noto Sans SC", sans-serif`)
    );
    ctx.font = fontStr;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const mw = ctx.measureText(ch).width;
    const padRatio = style.padRatio !== undefined ? style.padRatio : 0.24;
    const bw = Math.max(sz * 1.02, mw + sz * padRatio);
    const bh = sz * 1.10;

    if (kind === 'seal') {
      const rad = Math.max(10, Math.max(bw, bh) * 0.53);
      const isAcc = style.useAccent !== false;
      const bgA = isAcc ? theme.accent : (isPaper ? theme.inkText : theme.bone);
      const bgB = isAcc ? theme.accentDeep : (isPaper ? theme.slateDark : theme.silver);
      const txtCol = isAcc
        ? (theme.name === 'amber' ? theme.inkText : theme.bone)
        : (isPaper ? theme.bone : theme.inkText);

      ctx.save();
      ctx.shadowColor = isPaper ? 'rgba(15,19,28,0.22)' : 'rgba(2,4,10,0.58)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      const g = ctx.createLinearGradient(-rad, -rad, rad, rad);
      g.addColorStop(0, bgA);
      g.addColorStop(1, bgB);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, TAU);
      ctx.fill();
      ctx.restore();

      // Double precision hanko hairline ring
      ctx.strokeStyle = hexWithAlpha(txtCol, 0.72);
      ctx.lineWidth = Math.max(1.5, sz * 0.024);
      ctx.beginPath();
      ctx.arc(0, 0, rad - Math.max(4, sz * 0.06), 0, TAU);
      ctx.stroke();

      ctx.fillStyle = txtCol;
      ctx.fillText(ch, 0, sz * 0.03);
    } else if (kind === 'accent' || kind === 'mono' || kind === 'frosted') {
      const chm = Math.min(14, sz * 0.09);
      const hw = bw * 0.5;
      const hh = bh * 0.5;

      const buildPlaque = () => {
        ctx.beginPath();
        ctx.moveTo(-hw + chm, -hh);
        ctx.lineTo(hw, -hh);
        ctx.lineTo(hw, hh - chm);
        ctx.lineTo(hw - chm, hh);
        ctx.lineTo(-hw, hh);
        ctx.lineTo(-hw, -hh + chm);
        ctx.closePath();
      };

      let bgA, bgB, txtCol, borderCol;
      if (kind === 'accent') {
        bgA = theme.accentBright;
        bgB = theme.accentDeep;
        txtCol = theme.name === 'amber' ? theme.inkText : theme.bone;
        borderCol = hexWithAlpha(theme.bone, 0.65);
      } else if (kind === 'frosted') {
        bgA = isPaper ? 'rgba(243,239,231,0.92)' : 'rgba(20,26,39,0.88)';
        bgB = isPaper ? 'rgba(227,221,208,0.94)' : 'rgba(13,17,26,0.92)';
        txtCol = isPaper ? theme.inkText : theme.bone;
        borderCol = hexWithAlpha(theme.accent, 0.82);
      } else {
        // High-contrast editorial monochrome foil plaque
        bgA = isPaper ? '#1B2232' : '#F6F2EA';
        bgB = isPaper ? '#0E121B' : '#DCD6C8';
        txtCol = isPaper ? theme.bone : theme.inkText;
        borderCol = hexWithAlpha(theme.accent, 0.72);
      }

      // Soft cinema elevation shadow (replaces crude 9px solid flat block!)
      ctx.save();
      ctx.shadowColor = isPaper ? 'rgba(15,19,28,0.24)' : 'rgba(2,4,10,0.62)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 9;
      const grad = ctx.createLinearGradient(-hw, -hh, hw, hh);
      grad.addColorStop(0, bgA);
      grad.addColorStop(1, bgB);
      ctx.fillStyle = grad;
      buildPlaque();
      ctx.fill();
      ctx.restore();

      // Subtle diagonal specular foil highlight across upper third
      ctx.save();
      buildPlaque();
      ctx.clip();
      const spec = ctx.createLinearGradient(-hw, -hh, hw * 0.6, hh * 0.4);
      spec.addColorStop(0, 'rgba(255,255,255,0.16)');
      spec.addColorStop(0.55, 'rgba(255,255,255,0.03)');
      spec.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = spec;
      ctx.fillRect(-hw, -hh, bw, bh);
      ctx.restore();

      // Crisp 1.8px editorial trim border + thin accent bar along left flank
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = Math.max(1.8, sz * 0.018);
      buildPlaque();
      ctx.stroke();

      if (kind !== 'accent') {
        ctx.fillStyle = theme.accent;
        ctx.fillRect(-hw, -hh + chm, Math.max(4, sz * 0.045), bh - chm);
      }

      ctx.fillStyle = txtCol;
      ctx.fillText(ch, 0, sz * 0.03);
    } else if (kind === 'wire') {
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 3;
      ctx.save();
      ctx.shadowColor = hexWithAlpha(theme.accent, 0.35);
      ctx.shadowBlur = 12;
      ctx.strokeStyle = isPaper ? theme.inkText : theme.bone;
      ctx.lineWidth = Math.max(2.5, sz * 0.034);
      ctx.strokeText(ch, 0, sz * 0.03);
      ctx.restore();
      ctx.fillStyle = isPaper ? 'rgba(239,235,226,0.55)' : 'rgba(15,19,28,0.55)';
      ctx.fillText(ch, 0, sz * 0.03);
    } else {
      // 'bare': Monumental cinema hero glyph with soft depth shadow & razor-clean micro-knockout!
      const isHot = !!style.isHot;
      const txtCol = isHot ? theme.accentBright : (isPaper ? theme.inkText : theme.bone);
      const knockCol = isPaper ? 'rgba(241,237,228,0.88)' : 'rgba(11,14,22,0.86)';

      ctx.save();
      ctx.shadowColor = isPaper ? 'rgba(15,19,28,0.22)' : 'rgba(2,4,10,0.72)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 7;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = knockCol;
      ctx.lineWidth = Math.max(5, sz * 0.055);
      ctx.strokeText(ch, 0, sz * 0.03);
      ctx.fillStyle = txtCol;
      ctx.fillText(ch, 0, sz * 0.03);
      ctx.restore();
    }

    ctx.__v6RawColor = prevRaw;
    ctx.restore();
  }

  // Subtle ambient studio depth lighting over raw flat Canvas2D backgrounds (zero cheap flatness!)
  function drawStudioDepthOverlay(ctx, isPaper, kick = 0) {
    const theme = _activeTheme;
    const prevRaw = ctx.__v6RawColor;
    ctx.save();
    ctx.__v6RawColor = true;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;

    // Gentle directional studio falloff (never muddy, preserves clean contrast!)
    const g = ctx.createRadialGradient(W * 0.5, H * 0.45, 180, W * 0.5, H * 0.5, 1280);
    if (isPaper) {
      g.addColorStop(0, 'rgba(255, 253, 248, 0.08)');
      g.addColorStop(0.68, 'rgba(239, 235, 226, 0.0)');
      g.addColorStop(1, 'rgba(28, 34, 48, 0.14)');
    } else {
      g.addColorStop(0, hexWithAlpha(theme.accent, 0.055 + kick * 0.035));
      g.addColorStop(0.62, 'rgba(15, 19, 28, 0.0)');
      g.addColorStop(1, 'rgba(4, 6, 12, 0.34)');
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.__v6RawColor = prevRaw;
    ctx.restore();
  }

  // Hook into CortexPDoomCore.preloadAssets & tighten rubbery outBack across all 32 scenes!
  if (window.CortexPDoomCore) {
    if (typeof window.CortexPDoomCore.preloadAssets === 'function') {
      const origPreload = window.CortexPDoomCore.preloadAssets.bind(window.CortexPDoomCore);
      window.CortexPDoomCore.preloadAssets = function () {
        return Promise.all([origPreload(), preloadPlates()]);
      };
    }
    if (window.CortexPDoomCore.ease && typeof window.CortexPDoomCore.ease.outBack === 'function') {
      window.CortexPDoomCore.ease.outBack = function (x, s) {
        const u = clamp(x, 0, 1);
        const c1 = Math.min(0.52, s !== undefined ? Number(s) * 0.28 : 0.45);
        const c3 = c1 + 1;
        const v = u - 1;
        return 1 + c3 * v * v * v + c1 * v * v;
      };
    }
  }

  // ==========================================================================
  // V6.2: Deterministic 60fps Blender 5.2 Cinema 3D Frame Cache & Compositor
  // ==========================================================================
  const CLIPS_3D = {
    B3D_01_iris:        { t0: 5.37,   t1: 7.36,   fps: 60, count: 231  },
    B3D_02_rotor:       { t0: 83.55,  t1: 86.13,  fps: 60, count: 155  },
    B3D_03_synchro:     { t0: 116.40, t1: 123.17, fps: 60, count: 407  },
    B3D_04_cathedral:   { t0: 206.42, t1: 211.75, fps: 60, count: 320  },
    B3D_05_odyssey:     { t0: 232.30, t1: 250.14, fps: 60, count: 1071 },
    B3D_06_singularity: { t0: 34.45,  t1: 39.20,  fps: 60, count: 285  },
    B3D_08_glasskey:    { t0: 39.20,  t1: 41.28,  fps: 60, count: 125  }
  };
  const REMAP_3D_WINDOWS = [
    { clipId: 'B3D_01_iris',    t0: 5.37,   t1: 7.36,   f0: 78,  f1: 153 },
    { clipId: 'B3D_01_iris',    t0: 28.10,  t1: 29.78,  f0: 78,  f1: 153 },
    { clipId: 'B3D_05_odyssey', t0: 237.40, t1: 239.40, f0: 378, f1: 498 },
    { clipId: 'B3D_05_odyssey', t0: 242.35, t1: 244.35, f0: 576, f1: 696 }
  ];
  const _cache3D = new Map();
  const _inflight3D = new Map();
  const MAX_3D_CACHE = 56;

  function pad4(n) {
    return String(Math.max(0, Math.floor(n))).padStart(4, '0');
  }

  function load3DFrameImage(clipId, fIdx) {
    const meta = CLIPS_3D[clipId];
    if (!meta) return Promise.resolve(null);
    const clampedIdx = clamp(Math.floor(fIdx), 0, meta.count - 1);
    const key = clipId + ':' + clampedIdx;
    if (_cache3D.has(key)) {
      const val = _cache3D.get(key);
      _cache3D.delete(key);
      _cache3D.set(key, val);
      return Promise.resolve(val);
    }
    if (_inflight3D.has(key)) return _inflight3D.get(key);
    const url = '/v6_3d/' + clipId + '/f' + pad4(clampedIdx) + '.jpg';
    const prom = new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'sync';
      img.onload = () => {
        _inflight3D.delete(key);
        _cache3D.set(key, img);
        while (_cache3D.size > MAX_3D_CACHE) {
          const oldest = _cache3D.keys().next().value;
          _cache3D.delete(oldest);
        }
        resolve(img);
      };
      img.onerror = () => {
        _inflight3D.delete(key);
        resolve(null);
      };
      img.src = url;
    });
    _inflight3D.set(key, prom);
    return prom;
  }

  function ensure3DFrameForTime(tSec) {
    const jobs = [];
    for (const clipId of Object.keys(CLIPS_3D)) {
      const m = CLIPS_3D[clipId];
      if (tSec >= m.t0 - 0.35 && tSec <= m.t1 + 0.35) {
        const fIdx = clamp(Math.round((tSec - m.t0) * m.fps), 0, m.count - 1);
        jobs.push(load3DFrameImage(clipId, fIdx));
        if (fIdx + 1 < m.count) load3DFrameImage(clipId, fIdx + 1);
        if (fIdx + 2 < m.count) load3DFrameImage(clipId, fIdx + 2);
      }
    }
    for (const rw of REMAP_3D_WINDOWS) {
      if (tSec >= rw.t0 - 0.35 && tSec <= rw.t1 + 0.35) {
        const u = clamp((tSec - rw.t0) / Math.max(0.01, rw.t1 - rw.t0), 0, 1);
        const fIdx = Math.round(lerp(rw.f0, rw.f1, u));
        jobs.push(load3DFrameImage(rw.clipId, fIdx));
        if (fIdx > 0) jobs.push(load3DFrameImage(rw.clipId, fIdx - 1));
        load3DFrameImage(rw.clipId, fIdx + 1);
        load3DFrameImage(rw.clipId, fIdx + 2);
      }
    }
    return jobs.length ? Promise.all(jobs) : Promise.resolve();
  }

  function draw3DClipFrame(ctx, clipId, tSec, opts = {}) {
    const meta = CLIPS_3D[clipId];
    if (!meta) return false;
    const fIdx = opts.fIdx !== undefined
      ? clamp(Math.round(opts.fIdx), 0, meta.count - 1)
      : clamp(Math.round((tSec - meta.t0) * meta.fps), 0, meta.count - 1);
    const key = clipId + ':' + fIdx;
    let img = _cache3D.get(key) || null;
    if (!img) {
      // Fallback to nearest cached frame in same clip for interactive mv.html preview
      for (let d = 1; d <= 6 && !img; d++) {
        img = _cache3D.get(clipId + ':' + (fIdx - d)) || _cache3D.get(clipId + ':' + (fIdx + d)) || null;
      }
      load3DFrameImage(clipId, fIdx);
    }
    if (!img) return false;

    const kick = opts.kick || 0;
    const zoom = (opts.zoom !== undefined ? opts.zoom : 1.0) + kick * (opts.kickZoom !== undefined ? opts.kickZoom : 0.016);
    const prevRaw = ctx.__v6RawColor;
    ctx.save();
    ctx.__v6RawColor = true;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    drawCoverImage(ctx, img, 0, 0, W, H, zoom, 0.5, 0.5, 0, 0);

    if (opts.scrim && opts.scrim > 0) {
      const g = ctx.createRadialGradient(W * 0.5, H * 0.5, 220, W * 0.5, H * 0.5, 1180);
      const isPaper = !!opts.isPaper;
      if (isPaper) {
        g.addColorStop(0, `rgba(241, 237, 228, ${(opts.scrim * 0.15).toFixed(3)})`);
        g.addColorStop(1, `rgba(24, 28, 40, ${(opts.scrim * 0.65).toFixed(3)})`);
      } else {
        g.addColorStop(0, `rgba(11, 14, 22, ${(opts.scrim * 0.12).toFixed(3)})`);
        g.addColorStop(1, `rgba(7, 10, 18, ${(opts.scrim * 1.10).toFixed(3)})`);
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // Subtle 2D-to-3D Filmic Palette Glue & Edge Light-Wrap so 3D blends natively with 2D anime plates!
    if (opts.tintStrength !== 0) {
      const theme = _activeTheme;
      const tStr = opts.tintStrength !== undefined ? opts.tintStrength : 0.085;
      ctx.globalCompositeOperation = opts.isPaper ? 'multiply' : 'screen';
      const hg = ctx.createLinearGradient(0, 0, 0, H);
      hg.addColorStop(0, hexWithAlpha(theme.accent, tStr * 0.65));
      hg.addColorStop(0.52, 'rgba(0,0,0,0)');
      hg.addColorStop(1, hexWithAlpha(theme.accentDeep, tStr * 0.90));
      ctx.fillStyle = hg;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.__v6RawColor = prevRaw;
    ctx.restore();
    return true;
  }

  // --------------------------------------------------------------------------
  // V6.2: 2D + 3D Seamless Hybrid Compositing Suite
  //   1. draw2D3DAtmosphereBridge: Perspective-matched 2D cel speed-lines +
  //      optical bokeh dust/petals (ZERO 4-point cartoon stars!)
  //   2. draw2DAnimeSakugaSlash: Dynamic angled 2D anime cut-in slash strip
  //      triggered on 193.5 BPM beat hammers inside 3D action scenes!
  //   3. draw2DAnimeLightWrapGhost: Backlit feathered 2D anime apparition
  //      fusing 2D character art directly into 3D sunlit / dawn worlds!
  // --------------------------------------------------------------------------
  function draw2D3DAtmosphereBridge(ctx, opts = {}) {
    const t = opts.t || 0;
    const kick = opts.kick || 0;
    const theme = _activeTheme;
    const vpX = opts.vpX !== undefined ? opts.vpX : W * 0.5;
    const vpY = opts.vpY !== undefined ? opts.vpY : H * 0.48;
    const speedLines = opts.speedLines || 0;
    const motes = opts.motes || 0;
    const petals = opts.petals || 0;
    const accentCol = opts.accent || theme.accentBright;
    const prevRaw = ctx.__v6RawColor;

    ctx.save();
    ctx.__v6RawColor = true;
    ctx.shadowBlur = 0;

    // 1. Perspective-Matched 2D Anime Cel Speed-Lines (outer rim only, never clutters center!)
    if (speedLines > 0) {
      const count = Math.min(48, Math.round(speedLines));
      const baseAlpha = (opts.speedAlpha !== undefined ? opts.speedAlpha : 0.32) + kick * 0.16;
      const roll = opts.rollRad || 0;
      ctx.save();
      ctx.translate(vpX, vpY);
      ctx.rotate(roll);
      for (let i = 0; i < count; i++) {
        const seed = i * 1.6180339;
        const ang = (i / count) * TAU + Math.sin(seed * 7.3) * 0.06;
        const phase = ((t * (2.6 + (i % 4) * 0.55) + seed * 3.1) % 1 + 1) % 1;
        const rInner = lerp(420, 680, phase) - kick * 45;
        const rOuter = rInner + lerp(160, 420, (i % 5) / 4);
        const w = (i % 4 === 0 ? 3.2 : 1.5) * (1 - phase * 0.5);
        ctx.strokeStyle = (i % 5 === 0)
          ? hexWithAlpha(accentCol, baseAlpha * (1 - phase * 0.65))
          : `rgba(248, 246, 240, ${(baseAlpha * 0.65 * (1 - phase * 0.65)).toFixed(3)})`;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * rInner, Math.sin(ang) * rInner);
        ctx.lineTo(Math.cos(ang) * rOuter, Math.sin(ang) * rOuter);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Soft Optical Bokeh Light Motes (pinpoint/soft radial dots — ZERO 4-point cartoon stars!)
    if (motes > 0) {
      const nM = Math.min(36, Math.round(motes));
      ctx.globalCompositeOperation = opts.isPaper ? 'source-over' : 'screen';
      for (let i = 0; i < nM; i++) {
        const s = i * 2.39996;
        const px = ((Math.sin(s * 3.7) * 0.5 + 0.5) * W + t * (28 + (i % 5) * 18) * (i % 2 === 0 ? 1 : -0.7)) % W;
        const py = ((Math.cos(s * 2.9) * 0.5 + 0.5) * H - t * (22 + (i % 4) * 14)) % H;
        const x = px < 0 ? px + W : px;
        const y = py < 0 ? py + H : py;
        const rad = 2.5 + (i % 4) * 2.4 + kick * 2.0;
        const al = (0.18 + 0.22 * Math.abs(Math.sin(t * 2.8 + s))) * (opts.moteAlpha !== undefined ? opts.moteAlpha : 1.0);
        const col = i % 3 === 0 ? accentCol : '#FFF6E4';
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad * 2.2);
        g.addColorStop(0, hexWithAlpha(col, al));
        g.addColorStop(1, hexWithAlpha(col, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad * 2.2, 0, TAU);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    // 3. Hand-Drawn 2D Cel Sakura Petals drifting across foreground lens (bridges Act 6 -> P18!)
    if (petals > 0) {
      const nP = Math.min(32, Math.round(petals));
      for (let i = 0; i < nP; i++) {
        const s = i * 1.91;
        const spd = 145 + (i % 5) * 55;
        const x = ((i * 197 + t * spd) % (W + 180)) - 90;
        const y = ((i * 131 + t * (45 + (i % 3) * 25) + Math.sin(t * 2.4 + s) * 38) % (H + 140)) - 70;
        const sz = 9 + (i % 4) * 5.5;
        const rot = t * (1.8 + (i % 3) * 0.7) + s;
        const flutter = 0.45 + 0.55 * Math.abs(Math.cos(t * 3.2 + s));
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.scale(1, flutter);
        ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 224, 236, 0.82)' : 'rgba(255, 186, 212, 0.74)';
        ctx.beginPath();
        ctx.moveTo(0, -sz);
        ctx.bezierCurveTo(sz * 0.9, -sz * 0.55, sz * 0.8, sz * 0.75, 0, sz);
        ctx.bezierCurveTo(-sz * 0.8, sz * 0.75, -sz * 0.9, -sz * 0.55, 0, -sz);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.__v6RawColor = prevRaw;
    ctx.restore();
  }

  function draw2DAnimeSakugaSlash(ctx, plateKey, opts = {}) {
    const img = getPlateImage(plateKey);
    if (!img) return false;
    const progress = clamp(opts.progress !== undefined ? opts.progress : 1, 0, 1);
    if (progress <= 0.01) return false;

    const theme = _activeTheme;
    const side = opts.side || 'right'; // 'right' | 'left' | 'top'
    const alpha = (opts.alpha !== undefined ? opts.alpha : 0.94) * Math.min(1, progress * 2.2);
    const slam = aeSlam(Math.min(1, progress * 1.8));
    const slideOff = (1 - slam) * ((side === 'left' || side === 'topLeft') ? -420 : 420);
    const accent = opts.accent || theme.accentBright;
    const prevRaw = ctx.__v6RawColor;

    ctx.save();
    ctx.__v6RawColor = true;
    ctx.globalAlpha = alpha;

    // Sleek angled anime sakuga parallelogram band (NOT a rigid vertical split box!)
    let boxX, boxY, boxW, boxH;
    ctx.beginPath();
    if (side === 'right') {
      ctx.moveTo(W - 640 + slideOff, 72);
      ctx.lineTo(W - 44 + slideOff, 72);
      ctx.lineTo(W - 140 + slideOff, 425);
      ctx.lineTo(W - 790 + slideOff, 425);
      boxX = W - 820 + slideOff; boxY = 68; boxW = 790; boxH = 368;
    } else if (side === 'bottomRight') {
      ctx.moveTo(W - 680 + slideOff, 595);
      ctx.lineTo(W - 44 + slideOff, 595);
      ctx.lineTo(W - 135 + slideOff, 925);
      ctx.lineTo(W - 785 + slideOff, 925);
      boxX = W - 800 + slideOff; boxY = 590; boxW = 770; boxH = 342;
    } else if (side === 'topLeft') {
      ctx.moveTo(44 + slideOff, 72);
      ctx.lineTo(685 + slideOff, 72);
      ctx.lineTo(565 + slideOff, 395);
      ctx.lineTo(125 + slideOff, 395);
      boxX = 36 + slideOff; boxY = 68; boxW = 665; boxH = 334;
    } else if (side === 'left') {
      ctx.moveTo(44 + slideOff, 560);
      ctx.lineTo(680 + slideOff, 560);
      ctx.lineTo(540 + slideOff, 920);
      ctx.lineTo(140 + slideOff, 920);
      boxX = 30 + slideOff; boxY = 556; boxW = 790; boxH = 368;
    } else {
      ctx.moveTo(220 + slideOff, 86);
      ctx.lineTo(W - 120 + slideOff, 86);
      ctx.lineTo(W - 220 + slideOff, 376);
      ctx.lineTo(120 + slideOff, 376);
      boxX = 110 + slideOff; boxY = 80; boxW = W - 220; boxH = 300;
    }
    ctx.closePath();

    // Soft cinema drop shadow beneath cut-in band
    ctx.save();
    ctx.shadowColor = 'rgba(4, 7, 15, 0.72)';
    ctx.shadowBlur = 28;
    ctx.fillStyle = '#0D121D';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.clip();
    const zoom = (opts.zoom || 1.24) + (opts.kick || 0) * 0.04;
    const fx = opts.fx !== undefined ? opts.fx : 0.50;
    const fy = opts.fy !== undefined ? opts.fy : 0.28;
    drawCoverImage(ctx, img, boxX, boxY, boxW, boxH, zoom, fx, fy, (opts.t || 0) * 14 % 28, 0);

    // Optical light-wrap along cut-in edge
    const lg = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
    lg.addColorStop(0, hexWithAlpha(accent, 0.22));
    lg.addColorStop(0.5, 'rgba(0,0,0,0)');
    lg.addColorStop(1, 'rgba(8,11,20,0.38)');
    ctx.fillStyle = lg;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.restore();

    // Crisp razor anime cut-in border
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3.2;
    ctx.stroke();

    ctx.__v6RawColor = prevRaw;
    ctx.restore();
    return true;
  }

  function draw2DAnimeLightWrapGhost(ctx, plateKey, opts = {}) {
    const img = getPlateImage(plateKey);
    if (!img) return false;
    const alpha = clamp(opts.alpha !== undefined ? opts.alpha : 0.34, 0, 1);
    if (alpha <= 0.005) return false;

    const prevRaw = ctx.__v6RawColor;
    ctx.save();
    ctx.__v6RawColor = true;
    ctx.globalCompositeOperation = opts.blend || 'screen';
    ctx.globalAlpha = alpha;
    const cx = opts.cx !== undefined ? opts.cx : W * 0.5;
    const cy = opts.cy !== undefined ? opts.cy : H * 0.48;
    const rx = opts.rx !== undefined ? opts.rx : 560;
    const ry = opts.ry !== undefined ? opts.ry : 480;

    // Soft elliptical mask so 2D anime character dissolves organically into 3D light!
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU);
    ctx.clip();

    const zoom = (opts.zoom || 1.06) + (opts.kick || 0) * 0.02;
    drawCoverImage(ctx, img, cx - rx, cy - ry, rx * 2, ry * 2, zoom, opts.fx || 0.5, opts.fy || 0.34, opts.panX || 0, opts.panY || 0);

    // Feathered radial edge fade (masking smoothly into 3D sky/atmosphere)
    ctx.globalCompositeOperation = 'source-over';
    const rg = ctx.createRadialGradient(cx, cy, Math.min(rx, ry) * 0.32, cx, cy, Math.max(rx, ry));
    rg.addColorStop(0, 'rgba(0,0,0,0)');
    rg.addColorStop(1, opts.edgeCol || 'rgba(11,14,22,0.75)');
    ctx.fillStyle = rg;
    ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);

    ctx.__v6RawColor = prevRaw;
    ctx.restore();
    return true;
  }

  window.CortexV6 = {
    THEMES: THEME_PRESETS,
    PLATE_THEME_MAP,
    LEGACY_POSE_TO_PLATE,
    CLIPS_3D,
    setActivePlate,
    getActiveTheme,
    resolveThemeForPlate,
    remapColorForTheme,
    hookContextColors,
    preloadPlates,
    getPlateImage,
    drawCinematicPlate,
    drawLivingFullBleed,
    drawLivingPixelCamera,
    drawPixelMaster,
    drawEditorialStamp,
    drawStudioDepthOverlay,
    ensure3DFrameForTime,
    draw3DClipFrame,
    draw2D3DAtmosphereBridge,
    draw2DAnimeSakugaSlash,
    draw2DAnimeLightWrapGhost,
    aeSlam,
    hexWithAlpha
  };
})();
