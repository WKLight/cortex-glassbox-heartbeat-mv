// ============================================================================
// CORTEX // Strict Duotone Treatise Core Engine (`pdoom-core.js`)
// Phase-2 + #27 + #35 Upgrade:
//  1. Dual-Script Font System: Japanese-first (`Hiragino` / `Yu Gothic UI` / `Yu Mincho`)
//     for main vocal typography + `F.zhSub` (`Noto Sans SC` first) for bottom Chinese subtitles.
//  2. Canonical 32-Plate Duotone Registry (`PLATE_DUOTONES` P01..P32, `getPlateDuotone`).
//  3. Strict Duotone Sprite Baker (`bakeStrictDuotoneCanvas`) + GPU Counter-Change
//     Positive/Negative Compositor (`withXorText` — zero grey fringe, zero 3rd color).
//  4. Museum-grade Copperplate Primitives (`drawBurinHatch`, `drawGuillocheRosette`,
//     Revision-4 `bookendFrameK` / `drawBookendCropFrame`).
//  5. Zero `shadowBlur` / zero radial-glow / zero muddy-grey across all core helpers.
// ============================================================================
(function () {
  'use strict';

  const W = 1920;
  const H = 1080;
  const TAU = Math.PI * 2;

  const insetRect = (k) => ({
    x0: (W * (1 - k)) / 2,
    y0: (H * (1 - k)) / 2,
    x1: W - (W * (1 - k)) / 2,
    y1: H - (H * (1 - k)) / 2,
    w: W * k,
    h: H * k
  });

  const TITLE_SAFE = insetRect(0.90);  // 96px L/R, 54px T/B
  const ACTION_SAFE = insetRect(0.93);

  // --------------------------------------------------------------------------
  // Layered Treatise & High-Contrast Notan Palette (`#52` `pdoom-video` Spec)
  // --------------------------------------------------------------------------
  const PAL = {
    ink:       [8, 9, 12],        // #08090C Obsidian ink
    charInk:   [11, 13, 19],      // #0B0D13 Character Notan woodcut ink
    ink2:      [16, 19, 34],      // #101322 Pixel railway indigo ink
    panel:     [18, 23, 35],      // #121723 Secondary structural treatise panel
    graphite:  [71, 85, 105],     // #475569 Copperplate hatching & Swiss grid slate
    slate:     [100, 116, 139],   // #64748B Structural / unvoiced token slate
    ash:       [148, 163, 184],   // #94A3B8 Fine hairline rule silver-ash
    silver:    [226, 232, 240],   // #E2E8F0 Specular hairpin silver
    bone:      [250, 248, 245],   // #FAF8F5 Crisp Notan bone white
    paper:     [245, 240, 230],   // #F5F0E6 Drafting/audit sheet
    paper2:    [245, 240, 230],
    signal:    [255, 46, 85],     // #FF2E55 Crimson signal highlight
    crimson:   [255, 46, 85],     // #FF2E55
    ember:     [255, 138, 61],    // #FF8A3D Active vocal / spark ember orange
    blood:     [255, 46, 85],
    cyan:      [56, 189, 248],    // #38BDF8 Ice-cyan laser
    cyanInk:   [56, 189, 248],
    blueprint: [3, 118, 184],     // #0376B8 Blueprint cobalt cyan (P23)
    gold:      [251, 191, 36],    // #FBBF24 Chrono-gold highlight
    sakura:    [255, 158, 187],   // #FF9EBB Dawn/twilight sakura pink
    pureWhite: [250, 248, 245],   // #FAF8F5
    white:     [250, 248, 245],
    whiteHot:  [250, 248, 245]
  };

  // Canonical 32-Plate Duotone Contract (Phase-2 Shared Spec + #35 Expansion P01..P32)
  const PLATE_DUOTONES = {
    P01: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      invert:  { bg: '#38BDF8', fg: '#08090C' },
      notan:   { bg: '#08090C', fg: '#FAF8F5' }
    },
    P02: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      alert:   { bg: '#08090C', fg: '#FF2E55' },
      crimson: { bg: '#08090C', fg: '#FF2E55' },
      alt:     { bg: '#FAF8F5', fg: '#08090C' },
      notan:   { bg: '#08090C', fg: '#FAF8F5' }
    },
    P03: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      alt:     { bg: '#FAF8F5', fg: '#08090C' }
    },
    P04: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      notan:   { bg: '#08090C', fg: '#FAF8F5' }
    },
    P05: {
      default: { bg: '#F5F0E6', fg: '#08090C' },
      prune:   { bg: '#08090C', fg: '#FF2E55' },
      alert:   { bg: '#08090C', fg: '#FF2E55' },
      crimson: { bg: '#08090C', fg: '#FF2E55' },
      alt:     { bg: '#08090C', fg: '#FF2E55' },
      invert:  { bg: '#08090C', fg: '#F5F0E6' }
    },
    P06: {
      default: { bg: '#FAF8F5', fg: '#08090C' },
      L14:     { bg: '#08090C', fg: '#FF2E55' },
      pierce:  { bg: '#08090C', fg: '#FF2E55' },
      alert:   { bg: '#08090C', fg: '#FF2E55' },
      crimson: { bg: '#08090C', fg: '#FF2E55' },
      alt:     { bg: '#08090C', fg: '#FF2E55' },
      invert:  { bg: '#08090C', fg: '#FAF8F5' }
    },
    P07: {
      default: { bg: '#08090C', fg: '#FF2E55' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      alt:     { bg: '#FAF8F5', fg: '#08090C' }
    },
    P08: {
      default: { bg: '#08090C', fg: '#FAF8F5' },
      0:       { bg: '#08090C', fg: '#FAF8F5' },
      robot:   { bg: '#08090C', fg: '#FAF8F5' },
      1:       { bg: '#08090C', fg: '#38BDF8' },
      ai:      { bg: '#08090C', fg: '#38BDF8' },
      cyan:    { bg: '#08090C', fg: '#38BDF8' },
      2:       { bg: '#FAF8F5', fg: '#08090C' },
      human:   { bg: '#FAF8F5', fg: '#08090C' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      alt:     { bg: '#08090C', fg: '#38BDF8' }
    },
    P09: {
      default: { bg: '#101322', fg: '#FAF8F5', sakura: '#FF9EBB' },
      dark:    { bg: '#070914', fg: '#FAF8F5', sakura: '#FF9EBB' },
      after:   { bg: '#070914', fg: '#FAF8F5', sakura: '#FF9EBB' },
      sakura:  { bg: '#101322', fg: '#FF9EBB', sakura: '#FF9EBB' },
      alert:   { bg: '#101322', fg: '#FF2E55' },
      invert:  { bg: '#FAF8F5', fg: '#101322' },
      alt:     { bg: '#070914', fg: '#FAF8F5', sakura: '#FF9EBB' }
    },
    P10: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      0:       { bg: '#08090C', fg: '#38BDF8' },
      cyan:    { bg: '#08090C', fg: '#38BDF8' },
      1:       { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      2:       { bg: '#08090C', fg: '#FF2E55' },
      crimson: { bg: '#08090C', fg: '#FF2E55' },
      alert:   { bg: '#08090C', fg: '#FF2E55' },
      3:       { bg: '#08090C', fg: '#FBBF24' },
      gold:    { bg: '#08090C', fg: '#FBBF24' },
      notan:   { bg: '#08090C', fg: '#FAF8F5' }
    },
    P11: {
      default: { bg: '#08090C', fg: '#FBBF24' },
      invert:  { bg: '#FBBF24', fg: '#08090C' },
      alt:     { bg: '#FBBF24', fg: '#08090C' }
    },
    P12: {
      default: { bg: '#08090C', fg: '#FAF8F5' },
      alert:   { bg: '#08090C', fg: '#FF2E55' },
      crimson: { bg: '#08090C', fg: '#FF2E55' },
      alt:     { bg: '#08090C', fg: '#FF2E55' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' }
    },
    P13: {
      default: { bg: '#F5F0E6', fg: '#08090C' },
      stamp:   { bg: '#F5F0E6', fg: '#FF2E55' },
      alert:   { bg: '#F5F0E6', fg: '#FF2E55' },
      crimson: { bg: '#F5F0E6', fg: '#FF2E55' },
      alt:     { bg: '#F5F0E6', fg: '#FF2E55' },
      invert:  { bg: '#08090C', fg: '#F5F0E6' }
    },
    P14: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      L32:     { bg: '#08090C', fg: '#FAF8F5' },
      bone:    { bg: '#08090C', fg: '#FAF8F5' },
      white:   { bg: '#08090C', fg: '#FAF8F5' },
      alt:     { bg: '#08090C', fg: '#FAF8F5' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' }
    },
    P15: {
      default:  { bg: '#08090C', fg: '#FF2E55' },
      invert:   { bg: '#FF2E55', fg: '#08090C' },
      alt:      { bg: '#FF2E55', fg: '#08090C' },
      whiteout: { bg: '#FAF8F5', fg: '#08090C' },
      paper:    { bg: '#FAF8F5', fg: '#08090C' },
      end:      { bg: '#FAF8F5', fg: '#08090C' },
      notan:    { bg: '#08090C', fg: '#FAF8F5' }
    },
    P16: {
      default:  { bg: '#08090C', fg: '#FAF8F5' },
      L36:      { bg: '#08090C', fg: '#FAF8F5' },
      0:        { bg: '#08090C', fg: '#FAF8F5' },
      silver:   { bg: '#08090C', fg: '#FAF8F5' },
      L37:      { bg: '#08090C', fg: '#38BDF8' },
      1:        { bg: '#08090C', fg: '#38BDF8' },
      cyan:     { bg: '#08090C', fg: '#38BDF8' },
      2:        { bg: '#08090C', fg: '#FBBF24' },
      gold:     { bg: '#08090C', fg: '#FBBF24' },
      3:        { bg: '#08090C', fg: '#FF2E55' },
      crimson:  { bg: '#08090C', fg: '#FF2E55' },
      L39:      { bg: '#FAF8F5', fg: '#08090C' },
      paper:    { bg: '#FAF8F5', fg: '#08090C' },
      whiteout: { bg: '#FAF8F5', fg: '#08090C' },
      invert:   { bg: '#FAF8F5', fg: '#08090C' },
      alt:      { bg: '#FAF8F5', fg: '#08090C' }
    },
    P17: {
      default: { bg: '#FAF8F5', fg: '#08090C' },
      partA:   { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      invert:  { bg: '#08090C', fg: '#FAF8F5' },
      alt:     { bg: '#08090C', fg: '#FAF8F5' }
    },
    P18: {
      default: { bg: '#101322', fg: '#FF9EBB', sakura: '#FF9EBB' },
      L42:     { bg: '#101322', fg: '#FF9EBB', sakura: '#FF9EBB' },
      sakura:  { bg: '#101322', fg: '#FF9EBB', sakura: '#FF9EBB' },
      L43:     { bg: '#FAF8F5', fg: '#08090C' },
      L44:     { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      L45:     { bg: '#08090C', fg: '#38BDF8' },
      S04:     { bg: '#08090C', fg: '#38BDF8' },
      loop:    { bg: '#08090C', fg: '#38BDF8' },
      cyan:    { bg: '#08090C', fg: '#38BDF8' },
      alt:     { bg: '#08090C', fg: '#38BDF8' }
    },
    P19: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      inv:     { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      white:   { bg: '#FAF8F5', fg: '#08090C' },
      alt:     { bg: '#38BDF8', fg: '#08090C' }
    },
    P20: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      inv:     { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      white:   { bg: '#FAF8F5', fg: '#08090C' },
      alt:     { bg: '#FAF8F5', fg: '#08090C' }
    },
    P21: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      inv:     { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      white:   { bg: '#FAF8F5', fg: '#08090C' },
      alt:     { bg: '#38BDF8', fg: '#08090C' }
    },
    P22: {
      default: { bg: '#08090C', fg: '#FF2E55' },
      invert:  { bg: '#F5F0E6', fg: '#08090C' },
      inv:     { bg: '#F5F0E6', fg: '#08090C' },
      paper:   { bg: '#F5F0E6', fg: '#08090C' },
      crimson: { bg: '#08090C', fg: '#FF2E55' },
      alert:   { bg: '#08090C', fg: '#FF2E55' },
      alt:     { bg: '#F5F0E6', fg: '#08090C' }
    },
    P23: {
      default: { bg: '#FAF8F5', fg: '#0376B8' },
      paper:   { bg: '#FAF8F5', fg: '#0376B8' },
      invert:  { bg: '#0376B8', fg: '#FAF8F5' },
      inv:     { bg: '#0376B8', fg: '#FAF8F5' },
      dark:    { bg: '#08090C', fg: '#38BDF8' },
      alt:     { bg: '#0376B8', fg: '#FAF8F5' }
    },
    P24: {
      default: { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      xray:    { bg: '#08090C', fg: '#FF2E55' },
      red:     { bg: '#08090C', fg: '#FF2E55' },
      crimson: { bg: '#08090C', fg: '#FF2E55' },
      alert:   { bg: '#08090C', fg: '#FF2E55' },
      invert:  { bg: '#08090C', fg: '#FF2E55' },
      inv:     { bg: '#08090C', fg: '#FF2E55' },
      alt:     { bg: '#08090C', fg: '#FF2E55' }
    },
    P25: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      inv:     { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      white:   { bg: '#FAF8F5', fg: '#08090C' },
      alt:     { bg: '#FAF8F5', fg: '#08090C' }
    },
    P26: {
      default: { bg: '#08090C', fg: '#FBBF24' },
      gold:    { bg: '#08090C', fg: '#FBBF24' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      inv:     { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      white:   { bg: '#FAF8F5', fg: '#08090C' },
      alt:     { bg: '#FAF8F5', fg: '#08090C' }
    },
    P27: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      cyan:    { bg: '#08090C', fg: '#38BDF8' },
      gold:    { bg: '#08090C', fg: '#FBBF24' },
      aisle:   { bg: '#08090C', fg: '#FBBF24' },
      alt:     { bg: '#08090C', fg: '#FBBF24' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' }
    },
    P28: {
      default: { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      red:     { bg: '#08090C', fg: '#FF2E55' },
      rupture: { bg: '#08090C', fg: '#FF2E55' },
      crimson: { bg: '#08090C', fg: '#FF2E55' },
      alert:   { bg: '#08090C', fg: '#FF2E55' },
      invert:  { bg: '#08090C', fg: '#FF2E55' },
      inv:     { bg: '#08090C', fg: '#FF2E55' },
      alt:     { bg: '#08090C', fg: '#FF2E55' }
    },
    P29: {
      default: { bg: '#08090C', fg: '#FAF8F5' },
      notan:   { bg: '#08090C', fg: '#FAF8F5' },
      cyan:    { bg: '#08090C', fg: '#38BDF8' },
      alt:     { bg: '#08090C', fg: '#38BDF8' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' }
    },
    P30: {
      default: { bg: '#FF2E55', fg: '#08090C' },
      invert:  { bg: '#08090C', fg: '#FF2E55' },
      inv:     { bg: '#08090C', fg: '#FF2E55' },
      dark:    { bg: '#08090C', fg: '#FF2E55' },
      crimson: { bg: '#08090C', fg: '#FF2E55' },
      alt:     { bg: '#08090C', fg: '#FF2E55' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' }
    },
    P31: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      cyan:    { bg: '#08090C', fg: '#38BDF8' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      inv:     { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      white:   { bg: '#FAF8F5', fg: '#08090C' },
      alt:     { bg: '#FAF8F5', fg: '#08090C' }
    },
    P32: {
      default: { bg: '#08090C', fg: '#38BDF8' },
      cyan:    { bg: '#08090C', fg: '#38BDF8' },
      invert:  { bg: '#FAF8F5', fg: '#08090C' },
      inv:     { bg: '#FAF8F5', fg: '#08090C' },
      paper:   { bg: '#FAF8F5', fg: '#08090C' },
      white:   { bg: '#FAF8F5', fg: '#08090C' },
      alt:     { bg: '#FAF8F5', fg: '#08090C' }
    }
  };

  function normalizePlateKey(plateId) {
    if (typeof plateId === 'number') {
      return 'P' + String(Math.max(1, Math.min(32, Math.round(plateId)))).padStart(2, '0');
    }
    const s = String(plateId || 'P01').trim();
    const m = s.match(/^P?(\d{1,2})/i);
    if (m) return 'P' + String(Math.max(1, Math.min(32, Number(m[1])))).padStart(2, '0');
    return 'P01';
  }

  function getPlateDuotone(plateId, sub = 'default') {
    const pk = normalizePlateKey(plateId);
    // Support `getPlateDuotone('P17', 'P04')` for P17 Part-B 12-mirror memory tour!
    if (sub && typeof sub === 'string' && /^P\d{2}/i.test(sub)) {
      const refKey = normalizePlateKey(sub);
      if (PLATE_DUOTONES[refKey]) return { ...PLATE_DUOTONES[refKey].default };
    }
    const entry = PLATE_DUOTONES[pk] || PLATE_DUOTONES.P01;
    const picked = (sub !== undefined && sub !== null && entry[sub]) ? entry[sub] : entry.default;
    return { bg: picked.bg, fg: picked.fg, ...(picked.sakura ? { sakura: picked.sakura } : {}) };
  }

  function parseHexRgb(col) {
    if (Array.isArray(col)) return [col[0] | 0, col[1] | 0, col[2] | 0];
    if (PAL[col]) return PAL[col];
    const s = String(col || '#FAF8F5').trim();
    if (s.startsWith('#')) {
      const hex = s.slice(1);
      if (hex.length === 3) {
        return [
          parseInt(hex[0] + hex[0], 16),
          parseInt(hex[1] + hex[1], 16),
          parseInt(hex[2] + hex[2], 16)
        ];
      }
      if (hex.length >= 6) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16)
        ];
      }
    }
    const m = s.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (m) return [Number(m[1]) | 0, Number(m[2]) | 0, Number(m[3]) | 0];
    return [250, 248, 245];
  }

  function colorLuminance01(col) {
    const [r, g, b] = parseHexRgb(col);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function clamp(x, a = 0, b = 1) {
    return x < a ? a : x > b ? b : x;
  }

  function rgba(name, a = 1) {
    if (typeof name === 'string' && name.startsWith('#')) {
      const [r, g, b] = parseHexRgb(name);
      return a >= 0.999 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${clamp(a, 0, 1).toFixed(4)})`;
    }
    const c = PAL[name] || PAL.bone;
    return a >= 0.999 ? `rgb(${c[0]},${c[1]},${c[2]})` : `rgba(${c[0]},${c[1]},${c[2]},${clamp(a, 0, 1).toFixed(4)})`;
  }

  function mixCol(nameA, nameB, k, a = 1) {
    // Snap at 0.5 to prevent intermediate multi-hue gradient pollution in strict duotone mode
    const pick = clamp(k, 0, 1) < 0.5 ? nameA : nameB;
    return rgba(pick, a >= 0.5 ? 1 : 0);
  }

  // --------------------------------------------------------------------------
  // Strict Duotone Sprite / Snapshot Baker (`bakeStrictDuotoneCanvas`)
  // Purifies any image/SVG/canvas into 100% binary `{ bg, fg }` (0 grey, 0 3rd hue!)
  // --------------------------------------------------------------------------
  let _nextBakeObjId = 1;
  const _bakeObjIds = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  const _duotoneBakeCache = new Map();

  function _getImgId(img) {
    if (img.src) return img.src;
    if (_bakeObjIds) {
      let id = _bakeObjIds.get(img);
      if (!id) {
        id = 'cv_' + (_nextBakeObjId++);
        _bakeObjIds.set(img, id);
      }
      return id;
    }
    return 'img';
  }

  function bakeStrictDuotoneCanvas(img, bg = '#08090C', fg = '#FAF8F5', thresh = 0.5, opts = {}) {
    if (!img) return null;
    const srcW = img.naturalWidth || img.videoWidth || img.width || 0;
    const srcH = img.naturalHeight || img.videoHeight || img.height || 0;
    if (srcW <= 0 || srcH <= 0) return null;

    const normThresh = thresh > 1 ? clamp(thresh / 255, 0.02, 0.98) : clamp(thresh, 0.02, 0.98);
    const opaque = !!opts.opaque;
    const invert = !!opts.invert;
    const maxDim = opts.maxDim || 0;
    const cacheable = opts.cache !== false && !(img instanceof HTMLCanvasElement && opts.dynamic);
    const key = cacheable
      ? `${_getImgId(img)}|${bg}|${fg}|${normThresh.toFixed(3)}|${opaque ? 1 : 0}|${invert ? 1 : 0}|${maxDim}`
      : null;

    if (key && _duotoneBakeCache.has(key)) {
      return _duotoneBakeCache.get(key);
    }

    let dw = srcW, dh = srcH;
    if (maxDim > 0 && Math.max(dw, dh) > maxDim) {
      const sc = maxDim / Math.max(dw, dh);
      dw = Math.max(1, Math.round(dw * sc));
      dh = Math.max(1, Math.round(dh * sc));
    }

    const cv = document.createElement('canvas');
    cv.width = dw;
    cv.height = dh;
    const c = cv.getContext('2d', { willReadFrequently: true });
    c.imageSmoothingEnabled = opts.nearest ? false : true;
    c.clearRect(0, 0, dw, dh);
    c.drawImage(img, 0, 0, dw, dh);

    const imgData = c.getImageData(0, 0, dw, dh);
    const d = imgData.data;
    const [br, bgG, bb] = parseHexRgb(bg);
    const [fr, fgG, fb] = parseHexRgb(fg);
    const t255 = normThresh * 255;
    const alphaCut = opts.alphaThreshold !== undefined ? opts.alphaThreshold : 120;

    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3];
      if (!opaque && a < alphaCut) {
        d[i] = 0;
        d[i + 1] = 0;
        d[i + 2] = 0;
        d[i + 3] = 0;
        continue;
      }
      const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      const isFg = invert ? (lum < t255) : (lum >= t255);
      if (isFg) {
        d[i] = fr;
        d[i + 1] = fgG;
        d[i + 2] = fb;
      } else {
        d[i] = br;
        d[i + 1] = bgG;
        d[i + 2] = bb;
      }
      d[i + 3] = 255;
    }
    c.putImageData(imgData, 0, 0);

    if (key) {
      if (_duotoneBakeCache.size > 180) {
        const firstKey = _duotoneBakeCache.keys().next().value;
        _duotoneBakeCache.delete(firstKey);
      }
      _duotoneBakeCache.set(key, cv);
    }
    return cv;
  }

  // --------------------------------------------------------------------------
  // GPU-Accelerated Hard-Edge Duotone Positive/Negative Counter-Change (`withXorText`)
  // Guarantees:
  //  - Works whether `drawFn` draws onto `(c)` OR outer `ctx`!
  //  - Works at both 1080p and 4K (`?scale=2`) with zero `getImageData` CPU stall!
  //  - Over dark background -> exact `brightCol`; over bright hair/paper -> exact `darkCol`!
  //  - Outside the drawn glyphs -> 100% untouched original scene pixels!
  //  - ZERO semi-transparent grey edges and ZERO 3rd-color complement artifacts!
  // --------------------------------------------------------------------------
  let _xorSnapBg = null;
  let _xorMask = null;
  let _xorMaskInv = null;
  let _xorPol = null;
  let _xorPolInv = null;
  let _xorInside = null;
  let _xorTmp = null;

  function _ensureXorCanvases(cw, ch) {
    if (!_xorSnapBg || _xorSnapBg.width !== cw || _xorSnapBg.height !== ch) {
      const mk = () => {
        const cv = document.createElement('canvas');
        cv.width = cw;
        cv.height = ch;
        return cv;
      };
      _xorSnapBg = mk();
      _xorMask = mk();
      _xorMaskInv = mk();
      _xorPol = mk();
      _xorPolInv = mk();
      _xorInside = mk();
      _xorTmp = mk();
    }
  }

  function _rawResetTransform(ctx) {
    if (ctx.__cortexRawSetTransform) {
      ctx.__cortexRawSetTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  function withXorText(ctx, fg = '#FAF8F5', bg = '#08090C', drawFn) {
    if (typeof drawFn !== 'function' || !ctx || !ctx.canvas) return;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    if (cw <= 0 || ch <= 0) return;

    _ensureXorCanvases(cw, ch);

    const fgLum = colorLuminance01(fg);
    const bgLum = colorLuminance01(bg);
    const fgRgb = rgba(fg, 1);
    const bgRgb = rgba(bg, 1);
    const overDarkCol = fgLum >= bgLum ? fgRgb : bgRgb;
    const overLightCol = fgLum >= bgLum ? bgRgb : fgRgb;
    const useBlackSentinel = fgLum >= 0.20;

    // 1. Snapshot untouched scene `B_orig` (`{ alpha: true }` eliminates Chromium ClearType LCD fringes!)
    const snapCtx = _xorSnapBg.getContext('2d', { alpha: true });
    snapCtx.globalCompositeOperation = 'source-over';
    snapCtx.filter = 'none';
    snapCtx.fillStyle = bgRgb;
    snapCtx.fillRect(0, 0, cw, ch);
    snapCtx.drawImage(ctx.canvas, 0, 0);

    // 2. Clear `ctx` to high-contrast sentinel while preserving caller transform/font for `drawFn`
    const savedXform = ctx.__cortexRawGetTransform ? ctx.__cortexRawGetTransform() : ctx.getTransform();
    ctx.save();
    _rawResetTransform(ctx);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.filter = 'none';
    ctx.fillStyle = useBlackSentinel ? '#000000' : '#FFFFFF';
    ctx.fillRect(0, 0, cw, ch);
    ctx.restore();

    ctx.save();
    if (ctx.__cortexRawSetTransform) {
      ctx.__cortexRawSetTransform(savedXform.a, savedXform.b, savedXform.c, savedXform.d, savedXform.e, savedXform.f);
    } else {
      ctx.setTransform(savedXform);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    const drawColor = useBlackSentinel ? '#FFFFFF' : '#000000';
    ctx.fillStyle = drawColor;
    ctx.strokeStyle = drawColor;
    try {
      drawFn(ctx);
    } finally {
      ctx.restore();
    }

    // 3. Extract razor-sharp binary glyph mask `M` (#FFFFFF inside glyph, #000000 outside)
    const mCtx = _xorMask.getContext('2d', { alpha: true });
    mCtx.globalCompositeOperation = 'source-over';
    mCtx.filter = useBlackSentinel
      ? 'grayscale(100%) brightness(280%) contrast(9000%)'
      : 'invert(100%) grayscale(100%) brightness(280%) contrast(9000%)';
    mCtx.drawImage(ctx.canvas, 0, 0);
    mCtx.filter = 'none';

    const mInvCtx = _xorMaskInv.getContext('2d', { alpha: true });
    mInvCtx.globalCompositeOperation = 'source-over';
    mInvCtx.fillStyle = '#FFFFFF';
    mInvCtx.fillRect(0, 0, cw, ch);
    mInvCtx.globalCompositeOperation = 'difference';
    mInvCtx.drawImage(_xorMask, 0, 0);

    // 4. Extract binary background polarity `P` (#000000 where dark, #FFFFFF where bright)
    const pCtx = _xorPol.getContext('2d', { alpha: true });
    pCtx.globalCompositeOperation = 'source-over';
    pCtx.filter = 'grayscale(100%) brightness(195%) contrast(9000%)';
    pCtx.drawImage(_xorSnapBg, 0, 0);
    pCtx.filter = 'none';

    const pInvCtx = _xorPolInv.getContext('2d', { alpha: true });
    pInvCtx.globalCompositeOperation = 'source-over';
    pInvCtx.fillStyle = '#FFFFFF';
    pInvCtx.fillRect(0, 0, cw, ch);
    pInvCtx.globalCompositeOperation = 'difference';
    pInvCtx.drawImage(_xorPol, 0, 0);

    // 5. Build exact counter-changed color plate `C_inside = (1 - P) * overDarkCol + P * overLightCol`
    const inCtx = _xorInside.getContext('2d', { alpha: true });
    const tCtx = _xorTmp.getContext('2d', { alpha: true });

    inCtx.globalCompositeOperation = 'source-over';
    inCtx.drawImage(_xorPolInv, 0, 0);
    inCtx.globalCompositeOperation = 'multiply';
    inCtx.fillStyle = overDarkCol;
    inCtx.fillRect(0, 0, cw, ch);

    tCtx.globalCompositeOperation = 'source-over';
    tCtx.drawImage(_xorPol, 0, 0);
    tCtx.globalCompositeOperation = 'multiply';
    tCtx.fillStyle = overLightCol;
    tCtx.fillRect(0, 0, cw, ch);

    inCtx.globalCompositeOperation = 'lighter';
    inCtx.drawImage(_xorTmp, 0, 0);

    // 6. Composite `Final = (1 - M) * B_orig + M * C_inside` back onto `ctx`
    tCtx.globalCompositeOperation = 'source-over';
    tCtx.drawImage(_xorInside, 0, 0);
    tCtx.globalCompositeOperation = 'multiply';
    tCtx.drawImage(_xorMask, 0, 0);

    ctx.save();
    _rawResetTransform(ctx);
    ctx.filter = 'none';
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(_xorSnapBg, 0, 0);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(_xorMaskInv, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(_xorTmp, 0, 0);
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // Deterministic Math, Easing & Keyframe Helpers
  // --------------------------------------------------------------------------
  const lerp = (a, b, t) => a + (b - a) * t;
  const invLerp = (a, b, x) => (a === b ? 0 : (x - a) / (b - a));
  const remap = (x, a, b, c, d, clampIt = true) => {
    const t = invLerp(a, b, x);
    return lerp(c, d, clampIt ? clamp(t, 0, 1) : t);
  };
  const smoothstep = (a, b, x) => {
    const t = clamp((x - a) / Math.max(1e-6, b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const smootherstep = (a, b, x) => {
    const t = clamp((x - a) / Math.max(1e-6, b - a), 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10);
  };
  const window01 = (x, a, b, fadeIn = 0.2, fadeOut = 0.2) =>
    Math.min(smoothstep(a, a + Math.max(1e-4, fadeIn), x), 1 - smoothstep(b - Math.max(1e-4, fadeOut), b, x));

  const ease = {
    linear: (t) => t,
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    inQuad: (t) => t * t,
    outQuad: (t) => 1 - (1 - t) * (1 - t),
    inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    inCubic: (t) => t * t * t,
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    inQuart: (t) => t * t * t * t,
    outQuart: (t) => 1 - Math.pow(1 - t, 4),
    inOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
    outQuint: (t) => 1 - Math.pow(1 - t, 5),
    inExpo: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
    outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    inOutExpo: (t) =>
      t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
    outBack: (t, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
    outBounce: (t) => {
      const n1 = 7.5625, d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
      if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  };

  const prog = (x, a, b, fn = ease.linear) => fn(clamp((x - a) / Math.max(1e-6, b - a), 0, 1));

  const springStep = (t, freq = 4.0, damping = 0.36) => {
    if (t <= 0) return 0;
    const w = TAU * freq;
    return 1 - Math.exp(-damping * w * t) * Math.cos(w * Math.sqrt(Math.max(0.01, 1 - damping * damping)) * t);
  };

  const pulse = (t, t0, hl = 0.10) => (t < t0 ? 0 : Math.pow(0.5, (t - t0) / Math.max(1e-4, hl)));
  const frameIdx = (t) => Math.round(t * 60);

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash(...xs) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < xs.length; i++) {
      h ^= Math.floor(xs[i] * 1000003) | 0;
      h = Math.imul(h, 16777619);
      h ^= h >>> 13;
      h = Math.imul(h, 0x5bd1e995);
      h ^= h >>> 15;
    }
    return (h >>> 0) / 4294967296;
  }

  const fade5 = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  function noise1(x, seed = 0) {
    const i = Math.floor(x);
    const f = x - i;
    return lerp(hash(i, seed) * 2 - 1, hash(i + 1, seed) * 2 - 1, fade5(f));
  }
  function noise2(x, y, seed = 0) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = fade5(x - ix), fy = fade5(y - iy);
    const a = hash(ix, iy, seed), b = hash(ix + 1, iy, seed);
    const c = hash(ix, iy + 1, seed), d = hash(ix + 1, iy + 1, seed);
    return lerp(lerp(a, b, fx), lerp(c, d, fx), fy) * 2 - 1;
  }
  function fbm1(x, oct = 4, seed = 0) {
    let s = 0, a = 0.5, f = 1;
    for (let i = 0; i < oct; i++) { s += a * noise1(x * f, seed + i * 7); f *= 2; a *= 0.5; }
    return s;
  }

  function keys(t, ks) {
    if (!ks || !ks.length) return 0;
    if (t <= ks[0][0]) return ks[0][1];
    for (let i = 1; i < ks.length; i++) {
      const k = ks[i];
      if (t <= k[0]) {
        const p = ks[i - 1];
        const u = clamp((t - p[0]) / Math.max(1e-6, k[0] - p[0]), 0, 1);
        return lerp(p[1], k[1], (k[2] || ease.inOutCubic)(u));
      }
    }
    return ks[ks.length - 1][1];
  }

  function polylineLengths(pts) {
    const L = new Float32Array(pts.length);
    for (let i = 1; i < pts.length; i++) {
      L[i] = L[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    }
    return L;
  }

  function pointAtLength(pts, L, s) {
    const n = pts.length;
    if (n === 0) return { x: 0, y: 0, angle: 0 };
    if (n === 1) return { x: pts[0].x, y: pts[0].y, angle: 0 };
    const total = L[n - 1];
    const sc = clamp(s, 0, total);
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (L[mid] < sc) lo = mid; else hi = mid;
    }
    const a = pts[lo], b = pts[hi];
    const seg = L[hi] - L[lo];
    const u = seg > 1e-6 ? (sc - L[lo]) / seg : 0;
    return {
      x: lerp(a.x, b.x, u),
      y: lerp(a.y, b.y, u),
      angle: Math.atan2(b.y - a.y, b.x - a.x)
    };
  }

  function drawPartialPolyline(ctx, pts, L, len) {
    if (!pts.length || len <= 0) return null;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    let j = 1;
    for (; j < pts.length && L[j] <= len; j++) {
      ctx.lineTo(pts[j].x, pts[j].y);
    }
    let head = null;
    if (j < pts.length) {
      const a = pts[j - 1], b = pts[j];
      const u = (len - L[j - 1]) / Math.max(1e-6, L[j] - L[j - 1]);
      const hx = lerp(a.x, b.x, u), hy = lerp(a.y, b.y, u);
      ctx.lineTo(hx, hy);
      head = { x: hx, y: hy, angle: Math.atan2(b.y - a.y, b.x - a.x) };
    } else {
      const a = pts[Math.max(0, pts.length - 2)], b = pts[pts.length - 1];
      head = { x: b.x, y: b.y, angle: Math.atan2(b.y - a.y, b.x - a.x) };
    }
    ctx.stroke();
    return head;
  }

  // --------------------------------------------------------------------------
  // Piecewise Beat-Grid & Word-Aligned Lyric Timing Index
  // --------------------------------------------------------------------------
  const MASTER = window.CORTEX_MV_MASTER;
  const ANCHORS = MASTER.beatAnchors;

  function beatAt(t) {
    const tc = clamp(t, 0, MASTER.duration);
    for (let i = 0; i < ANCHORS.length - 1; i++) {
      const [t0, b0] = ANCHORS[i];
      const [t1, b1] = ANCHORS[i + 1];
      if (tc <= t1 || i === ANCHORS.length - 2) {
        const u = clamp((tc - t0) / Math.max(1e-4, t1 - t0), 0, 1);
        return b0 + u * (b1 - b0);
      }
    }
    return 0;
  }

  function timeOfBeat(b) {
    const maxB = ANCHORS[ANCHORS.length - 1][1];
    const bc = clamp(b, 0, maxB);
    for (let i = 0; i < ANCHORS.length - 1; i++) {
      const [t0, b0] = ANCHORS[i];
      const [t1, b1] = ANCHORS[i + 1];
      if (bc <= b1 || i === ANCHORS.length - 2) {
        const u = clamp((bc - b0) / Math.max(1e-4, b1 - b0), 0, 1);
        return t0 + u * (t1 - t0);
      }
    }
    return MASTER.duration;
  }

  function nearestBeat(t) {
    return timeOfBeat(Math.round(beatAt(t)));
  }

  function beatsIn(t0, t1, step = 1) {
    const out = [];
    const bStart = Math.ceil((beatAt(t0) - 1e-3) / step) * step;
    const bEnd = beatAt(t1) + 1e-3;
    for (let b = bStart; b <= bEnd; b += step) {
      out.push(timeOfBeat(b));
    }
    return out;
  }

  const CUE_MAP = new Map();
  const ENRICHED_CUES = MASTER.cues.map((cue, idx) => {
    const toks = cue.tokens || [];
    const vocEnd = cue.tVocEnd || (cue.t1 - 0.15);
    const dur = Math.max(0.20, vocEnd - cue.t0);
    const weights = toks.map((tk) => Math.max(1, Array.from(tk).length * 0.85));
    const sumW = weights.reduce((a, b) => a + b, 0) || 1;
    let accW = 0;
    let charCursor = 0;
    const words = toks.map((tk, wi) => {
      const wStart = cue.t0 + (accW / sumW) * dur;
      accW += weights[wi];
      const wEnd = cue.t0 + (accW / sumW) * dur;
      const chars = Array.from(tk);
      const obj = {
        w: tk,
        start: wStart,
        end: wEnd,
        index: wi,
        charStart: charCursor,
        charLen: chars.length
      };
      charCursor += chars.length;
      return obj;
    });
    const joinedJa = toks.join('');
    const spacedJa = toks.join(' ');
    const enriched = { ...cue, index: idx, words, joinedJa, spacedJa, totalChars: charCursor };
    CUE_MAP.set(cue.id, enriched);
    return enriched;
  });

  function cueById(id) {
    return CUE_MAP.get(id) || ENRICHED_CUES[0];
  }

  function cuesIn(t0, t1) {
    return ENRICHED_CUES.filter((c) => c.t1 > t0 + 0.02 && c.t0 < t1 - 0.02);
  }

  function wordProgress(w, t) {
    if (t <= w.start) return 0;
    if (t >= w.end) return 1;
    return (t - w.start) / Math.max(1e-3, w.end - w.start);
  }

  function cueSungChars(cue, t, withSpaces = false) {
    if (!cue || !cue.words || !cue.words.length) return 0;
    if (t <= cue.t0) return 0;
    let chars = 0;
    for (let i = 0; i < cue.words.length; i++) {
      const w = cue.words[i];
      const p = wordProgress(w, t);
      chars += p * w.charLen;
      if (p < 1) break;
      if (withSpaces && i < cue.words.length - 1) chars += 1;
    }
    return chars;
  }

  // --------------------------------------------------------------------------
  // Dual-Script Typography System (Phase-2 #27 Mandate):
  //  - Japanese-first (`Hiragino Kaku Gothic ProN` / `Yu Gothic UI` / `Yu Mincho`) for
  //    authentic Japanese hero vocal typography (`F.display`, `F.sans`, `F.serif`)
  //  - Dedicated `F.zhSub` (`Noto Sans SC` first) for zero-missing-glyph bottom Chinese subtitles!
  // --------------------------------------------------------------------------
  const F = {
    display: (weight = 900) =>
      `${weight} __SZ__px "Inter", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", "Microsoft YaHei UI", sans-serif`,
    condensed: (weight = 900) =>
      `${weight} __SZ__px "Bahnschrift Condensed", "Arial Narrow", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", sans-serif`,
    sans: (weight = 700) =>
      `${weight} __SZ__px "Inter", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Noto Sans SC", "Microsoft YaHei UI", sans-serif`,
    mono: (weight = 500) =>
      `${weight} __SZ__px "JetBrains Mono", "Cascadia Mono", "Noto Sans SC", monospace`,
    serif: (weight = 600, italic = false) =>
      `${italic ? 'italic ' : ''}${weight} __SZ__px "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif SC", "Cormorant Garamond", "Georgia", serif`,
    zhSub: (weight = 700) =>
      `${weight} __SZ__px "Noto Sans SC", "Source Han Sans SC", "Microsoft YaHei UI", "PingFang SC", sans-serif`
  };

  function font(tmpl, sizePx) {
    return tmpl.replace('__SZ__', sizePx.toFixed(2));
  }

  let _mctx = null;
  function mctx() {
    if (!_mctx) _mctx = document.createElement('canvas').getContext('2d');
    return _mctx;
  }

  const _layCache = new Map();
  function layoutText(text, fontTmpl, sizePx, trackingPx = 0) {
    const key = `${text}|${fontTmpl}|${sizePx.toFixed(1)}|${trackingPx.toFixed(2)}`;
    const hit = _layCache.get(key);
    if (hit) return hit;
    if (_layCache.size > 2400) _layCache.clear();

    const c = mctx();
    const fStr = font(fontTmpl, sizePx);
    c.font = fStr;
    const chars = Array.from(text || '');
    const glyphs = [];
    let prefix = '';
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      prefix += ch;
      const w = c.measureText(ch).width;
      const x = c.measureText(prefix).width - w + i * trackingPx;
      glyphs.push({ ch, i, x, w });
    }
    const totalW = (chars.length ? c.measureText(text).width : 0) + Math.max(0, chars.length - 1) * trackingPx;
    const out = {
      text,
      fontStr: fStr,
      size: sizePx,
      tracking: trackingPx,
      width: totalW,
      cap: sizePx * 0.72,
      glyphs
    };
    _layCache.set(key, out);
    return out;
  }

  function xAtGlyph(lay, fracChars) {
    if (fracChars <= 0 || !lay.glyphs.length) return 0;
    if (fracChars >= lay.glyphs.length) return lay.width;
    const i = Math.floor(fracChars);
    const f = fracChars - i;
    const x0 = lay.glyphs[i].x;
    const x1 = i + 1 < lay.glyphs.length ? lay.glyphs[i + 1].x : lay.width;
    return lerp(x0, x1, f);
  }

  function fitSize(text, fontTmpl, maxWidth, maxSize = 360, trackingEm = 0) {
    const ref = layoutText(text, fontTmpl, 100, trackingEm * 100);
    if (ref.width <= 0.1) return maxSize;
    return Math.min(maxSize, (100 * maxWidth) / ref.width);
  }

  // Curve-riding glyphs (strictly solid duotone, zero semi-transparent unsung karaoke!)
  function drawTextOnCurve(ctx, text, pts, L, sStart, fontTmpl, sizePx, fracChars, opts = {}) {
    const tracking = opts.tracking || 2;
    const normalOff = opts.normalOffset || -12;
    const lay = layoutText(text, fontTmpl, sizePx, tracking);
    const total = L[L.length - 1] || 1;
    const fgCol = opts.fg || opts.done || opts.sung || rgba('bone', 1);
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.font = lay.fontStr;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';
    for (let i = 0; i < lay.glyphs.length; i++) {
      if (fracChars !== undefined && i >= fracChars) break;
      const g = lay.glyphs[i];
      const s = sStart + g.x + g.w * 0.5;
      if (s < 0 || s > total) continue;
      const p = pointAtLength(pts, L, s);
      const nx = -Math.sin(p.angle) * normalOff;
      const ny = Math.cos(p.angle) * normalOff;
      const lit = fracChars !== undefined ? clamp(fracChars - i, 0, 1) : 1;
      ctx.save();
      ctx.translate(p.x + nx, p.y + ny);
      ctx.rotate(p.angle);
      const pop = lit > 0 && lit < 1 ? ease.outBack(lit) : 1;
      ctx.scale(pop, pop);
      ctx.fillStyle = fgCol;
      ctx.fillText(g.ch, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  const _atomCache = new Map();
  function sampleTextAtoms(text, fontTmpl, sizePx, step = 6, seed = 17) {
    const key = `${text}|${fontTmpl}|${sizePx}|${step}|${seed}`;
    if (_atomCache.has(key)) return _atomCache.get(key);
    const lay = layoutText(text, fontTmpl, sizePx, 0);
    const pad = Math.ceil(sizePx * 0.25);
    const cw = Math.max(16, Math.ceil(lay.width + pad * 2));
    const ch = Math.max(16, Math.ceil(sizePx * 1.45));
    const cv = document.createElement('canvas');
    cv.width = cw;
    cv.height = ch;
    const c = cv.getContext('2d', { willReadFrequently: true });
    c.font = lay.fontStr;
    c.fillStyle = '#fff';
    c.textBaseline = 'alphabetic';
    const base = Math.round(sizePx * 1.05);
    c.fillText(text, pad, base);
    const data = c.getImageData(0, 0, cw, ch).data;
    const rnd = mulberry32(seed);
    const pts = [];
    for (let y = 0; y < ch; y += step) {
      for (let x = 0; x < cw; x += step) {
        const jx = x + (rnd() - 0.5) * step * 0.75;
        const jy = y + (rnd() - 0.5) * step * 0.75;
        const ix = clamp(Math.round(jx), 0, cw - 1);
        const iy = clamp(Math.round(jy), 0, ch - 1);
        if (data[(iy * cw + ix) * 4 + 3] > 120) {
          pts.push({ x: jx - pad - lay.width * 0.5, y: jy - base + sizePx * 0.36 });
        }
      }
    }
    _atomCache.set(key, pts);
    return pts;
  }

  // --------------------------------------------------------------------------
  // Single-Stroke Technical Plotter Font
  // --------------------------------------------------------------------------
  const PLOT_GLYPHS = {
    A: [[[0, 1], [0.5, 0], [1, 1]], [[0.2, 0.65], [0.8, 0.65]]],
    B: [[[0, 0], [0, 1], [0.75, 1], [0.95, 0.82], [0.75, 0.5], [0, 0.5]], [[0, 0], [0.7, 0], [0.9, 0.22], [0.75, 0.5]]],
    C: [[[0.95, 0.18], [0.7, 0], [0.25, 0], [0, 0.25], [0, 0.75], [0.25, 1], [0.7, 1], [0.95, 0.82]]],
    D: [[[0, 0], [0, 1], [0.65, 1], [0.95, 0.72], [0.95, 0.28], [0.65, 0], [0, 0]]],
    E: [[[0.9, 0], [0, 0], [0, 1], [0.9, 1]], [[0, 0.5], [0.72, 0.5]]],
    F: [[[0.9, 0], [0, 0], [0, 1]], [[0, 0.5], [0.72, 0.5]]],
    G: [[[0.95, 0.18], [0.7, 0], [0.25, 0], [0, 0.25], [0, 0.75], [0.25, 1], [0.85, 1], [0.85, 0.52], [0.5, 0.52]]],
    H: [[[0, 0], [0, 1]], [[0.95, 0], [0.95, 1]], [[0, 0.5], [0.95, 0.5]]],
    I: [[[0.15, 0], [0.85, 0]], [[0.5, 0], [0.5, 1]], [[0.15, 1], [0.85, 1]]],
    J: [[[0.2, 0], [0.9, 0]], [[0.65, 0], [0.65, 0.8], [0.4, 1], [0.1, 0.82]]],
    K: [[[0, 0], [0, 1]], [[0.92, 0], [0, 0.55], [0.95, 1]]],
    L: [[[0, 0], [0, 1], [0.9, 1]]],
    M: [[[0, 1], [0, 0], [0.5, 0.62], [1, 0], [1, 1]]],
    N: [[[0, 1], [0, 0], [0.95, 1], [0.95, 0]]],
    O: [[[0.25, 0], [0.75, 0], [1, 0.25], [1, 0.75], [0.75, 1], [0.25, 1], [0, 0.75], [0, 0.25], [0.25, 0]]],
    P: [[[0, 1], [0, 0], [0.75, 0], [0.95, 0.22], [0.75, 0.5], [0, 0.5]]],
    Q: [[[0.25, 0], [0.75, 0], [1, 0.25], [1, 0.75], [0.75, 1], [0.25, 1], [0, 0.75], [0, 0.25], [0.25, 0]], [[0.6, 0.68], [1.05, 1.08]]],
    R: [[[0, 1], [0, 0], [0.75, 0], [0.95, 0.22], [0.75, 0.5], [0, 0.5]], [[0.55, 0.5], [0.95, 1]]],
    S: [[[0.9, 0.16], [0.68, 0], [0.22, 0], [0, 0.2], [0.18, 0.45], [0.82, 0.56], [0.96, 0.8], [0.72, 1], [0.22, 1], [0, 0.82]]],
    T: [[[0, 0], [1, 0]], [[0.5, 0], [0.5, 1]]],
    U: [[[0, 0], [0, 0.76], [0.25, 1], [0.72, 1], [0.96, 0.76], [0.96, 0]]],
    V: [[[0, 0], [0.5, 1], [1, 0]]],
    W: [[[0, 0], [0.24, 1], [0.5, 0.35], [0.76, 1], [1, 0]]],
    X: [[[0, 0], [0.96, 1]], [[0.96, 0], [0, 1]]],
    Y: [[[0, 0], [0.5, 0.52], [1, 0]], [[0.5, 0.52], [0.5, 1]]],
    Z: [[[0, 0], [0.96, 0], [0, 1], [0.96, 1]]],
    '0': [[[0.25, 0], [0.75, 0], [0.96, 0.25], [0.96, 0.75], [0.75, 1], [0.25, 1], [0, 0.75], [0, 0.25], [0.25, 0]], [[0.14, 0.84], [0.82, 0.16]]],
    '1': [[[0.22, 0.22], [0.52, 0], [0.52, 1]], [[0.2, 1], [0.84, 1]]],
    '2': [[[0.06, 0.22], [0.28, 0], [0.72, 0], [0.94, 0.22], [0.94, 0.44], [0, 1], [0.96, 1]]],
    '3': [[[0.08, 0.16], [0.3, 0], [0.72, 0], [0.94, 0.22], [0.68, 0.48], [0.4, 0.48]], [[0.68, 0.48], [0.96, 0.74], [0.72, 1], [0.28, 1], [0.06, 0.82]]],
    '4': [[[0.74, 1], [0.74, 0], [0, 0.68], [0.96, 0.68]]],
    '5': [[[0.9, 0], [0.08, 0], [0.04, 0.46], [0.68, 0.42], [0.94, 0.66], [0.72, 1], [0.24, 1], [0.04, 0.82]]],
    '6': [[[0.84, 0.12], [0.62, 0], [0.24, 0], [0, 0.3], [0, 0.78], [0.24, 1], [0.74, 1], [0.94, 0.76], [0.72, 0.5], [0, 0.54]]],
    '7': [[[0, 0], [0.96, 0], [0.34, 1]]],
    '8': [[[0.26, 0.48], [0.06, 0.24], [0.26, 0], [0.7, 0], [0.9, 0.24], [0.7, 0.48], [0.26, 0.48], [0.02, 0.76], [0.26, 1], [0.7, 1], [0.94, 0.76], [0.7, 0.48]]],
    '9': [[[0.94, 0.46], [0.26, 0.5], [0.04, 0.26], [0.26, 0], [0.72, 0], [0.94, 0.24], [0.94, 0.74], [0.68, 1], [0.22, 1]]],
    '.': [[[0.42, 0.9], [0.52, 0.9], [0.52, 1], [0.42, 1], [0.42, 0.9]]],
    ':': [[[0.44, 0.28], [0.52, 0.28], [0.52, 0.36], [0.44, 0.36]], [[0.44, 0.82], [0.52, 0.82], [0.52, 0.9], [0.44, 0.9]]],
    '-': [[[0.15, 0.52], [0.85, 0.52]]],
    '_': [[[0, 1.05], [1, 1.05]]],
    '/': [[[0.08, 1.04], [0.92, -0.04]]],
    '+': [[[0.5, 0.18], [0.5, 0.86]], [[0.14, 0.52], [0.86, 0.52]]],
    '=': [[[0.14, 0.38], [0.86, 0.38]], [[0.14, 0.66], [0.86, 0.66]]],
    '%': [[[0.12, 0.96], [0.88, 0.04]], [[0.14, 0.08], [0.34, 0.08], [0.34, 0.28], [0.14, 0.28], [0.14, 0.08]], [[0.66, 0.72], [0.86, 0.72], [0.86, 0.92], [0.66, 0.92], [0.66, 0.72]]],
    '<': [[[0.82, 0.12], [0.14, 0.52], [0.82, 0.92]]],
    '>': [[[0.18, 0.12], [0.86, 0.52], [0.18, 0.92]]],
    '(': [[[0.68, -0.04], [0.32, 0.28], [0.32, 0.72], [0.68, 1.04]]],
    ')': [[[0.32, -0.04], [0.68, 0.28], [0.68, 0.72], [0.32, 1.04]]],
    '[': [[[0.72, -0.04], [0.28, -0.04], [0.28, 1.04], [0.72, 1.04]]],
    ']': [[[0.28, -0.04], [0.72, -0.04], [0.72, 1.04], [0.28, 1.04]]],
    '!': [[[0.5, 0], [0.5, 0.7]], [[0.46, 0.9], [0.54, 0.9], [0.54, 1], [0.46, 1]]],
    '?': [[[0.12, 0.22], [0.32, 0], [0.72, 0], [0.92, 0.22], [0.92, 0.4], [0.5, 0.58], [0.5, 0.72]], [[0.46, 0.92], [0.54, 0.92]]]
  };

  function buildPlotText(str, x0, baseY, capH, tracking = 0.28) {
    if (capH === undefined) {
      const ch = typeof x0 === 'number' ? x0 : 52;
      const tr = typeof baseY === 'number' ? (baseY / Math.max(12, ch)) : 0.22;
      return buildPlotText(str, 0, ch, ch, tr);
    }
    const chars = Array.from((str || '').toUpperCase());
    const strokes = [];
    const lens = [];
    const startLen = [];
    const charW = capH * 0.66;
    let cx = x0;
    let total = 0;
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (ch === ' ') {
        cx += charW * 0.72;
        continue;
      }
      const def = PLOT_GLYPHS[ch];
      if (def) {
        for (const poly of def) {
          const pts = poly.map(([px, py]) => ({ x: cx + px * charW, y: baseY - (1 - py) * capH }));
          const L = polylineLengths(pts);
          strokes.push(pts);
          lens.push(L);
          startLen.push(total);
          total += L[L.length - 1] || 0;
        }
      }
      cx += charW * (1 + tracking);
    }
    return { strokes, lens, startLen, total, width: cx - x0 };
  }

  function drawPlotText(ctx, plotObj, xOrProg, yOpt, progOpt, strokeColOpt, lineWidthOpt) {
    if (yOpt !== undefined && typeof progOpt === 'number') {
      const ox = xOrProg, oy = yOpt;
      const targetLen = clamp(progOpt, 0, 1) * plotObj.total;
      if (targetLen <= 0.01) return { x: ox, y: oy };
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.translate(ox, oy);
      ctx.strokeStyle = strokeColOpt || rgba('bone', 1);
      ctx.lineWidth = lineWidthOpt || 2.4;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';
      let head = { x: 0, y: 0 };
      for (let i = 0; i < plotObj.strokes.length; i++) {
        const s0 = plotObj.startLen[i];
        if (s0 >= targetLen) break;
        const h = drawPartialPolyline(ctx, plotObj.strokes[i], plotObj.lens[i], targetLen - s0);
        if (h) head = h;
      }
      ctx.restore();
      return { x: ox + head.x, y: oy + head.y };
    }
    const targetLen = clamp(xOrProg, 0, 1) * plotObj.total;
    if (targetLen <= 0.01) return { x: W * 0.5, y: H * 0.5 };
    let head = { x: W * 0.5, y: H * 0.5 };
    for (let i = 0; i < plotObj.strokes.length; i++) {
      const s0 = plotObj.startLen[i];
      if (s0 >= targetLen) break;
      const h = drawPartialPolyline(ctx, plotObj.strokes[i], plotObj.lens[i], targetLen - s0);
      if (h) head = h;
    }
    return head;
  }

  // --------------------------------------------------------------------------
  // Strict Duotone Shared Motifs (ZERO radial glow, ZERO `lighter`, ZERO `shadowBlur`)
  // --------------------------------------------------------------------------
  function drawSparkHead(ctx, x, y, t, scale = 1, intensity = 1, tint = 'signal') {
    let bgCol = null;
    if (typeof scale === 'string') {
      tint = scale;
      scale = (typeof t === 'number' && Number.isFinite(t)) ? t : 1;
      t = (Number.isFinite(x) ? x * 0.013 : 0) + (Number.isFinite(y) ? y * 0.017 : 0);
      intensity = 1;
    } else if (typeof intensity === 'string') {
      tint = intensity;
      intensity = 1;
    } else if (typeof tint === 'object' && tint !== null) {
      bgCol = tint.bg || null;
      tint = tint.fg || 'signal';
    }
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    t = Number.isFinite(t) ? t : 0;
    scale = (Number.isFinite(scale) && scale > 0) ? scale : 1;
    intensity = Number.isFinite(intensity) ? intensity : 1;
    if (intensity <= 0.05) return;

    const fgCol = typeof tint === 'string' && tint.startsWith('#') ? tint : rgba(tint, 1);
    const step = Math.floor(frameIdx(t) / 2);
    const rot = (step % 8) * (Math.PI / 16);
    const arm = Math.max(4, (14 + 5 * hash(step, 3)) * scale * clamp(intensity, 0.35, 1.25));
    const waist = arm * 0.22;

    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate(x, y);
    ctx.rotate(rot);

    // V6.2: Replaced clunky 4-point cartoon star with sleek optical pinpoint glint dot
    const rDot = Math.max(2.5, arm * 0.22);
    ctx.fillStyle = fgCol;
    ctx.beginPath();
    ctx.arc(0, 0, rDot, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = fgCol;
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.arc(0, 0, rDot * 2.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawSparkParticles(ctx, t, headAtFn, opts = {}) {
    const rate = opts.rate || 72;
    const life = opts.life || 0.38;
    const speed = opts.speed || 260;
    const grav = opts.gravity !== undefined ? opts.gravity : 460;
    const intensity = opts.intensity !== undefined ? opts.intensity : 1;
    const seed = opts.seed || 7;
    const fgCol = opts.fg || (opts.tint && String(opts.tint).startsWith('#') ? opts.tint : rgba(opts.tint || 'signal', 1));
    if (intensity <= 0.05 || rate <= 0) return;

    const n0 = Math.floor((t - life) * rate);
    const n1 = Math.floor(t * rate);
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = fgCol;
    ctx.lineCap = 'square';
    for (let n = n0; n <= n1; n++) {
      const tb = n / rate;
      if (tb > t) continue;
      const age = t - tb;
      const lf = life * (0.35 + 0.65 * hash(n, seed + 2));
      if (age > lf) continue;
      const h = headAtFn(tb);
      if (!h) continue;
      const a = hash(n, seed) * TAU;
      const sp = speed * (0.28 + Math.pow(hash(n, seed + 1), 2) * 1.25);
      const vx = Math.cos(a) * sp;
      const vy = Math.sin(a) * sp - speed * 0.28;
      const x = h.x + vx * age;
      const y = h.y + vy * age + 0.5 * grav * age * age;
      const k = 1 - age / lf;
      if (k < 0.14) continue;
      const dt = 0.024 * k;
      const age0 = Math.max(0, age - dt);
      const x0 = h.x + vx * age0;
      const y0 = h.y + vy * age0 + 0.5 * grav * age0 * age0;
      ctx.lineWidth = Math.max(1.2, (opts.width || 2.0) * k);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSpecimenGuides(ctx, baseY, capH, inkName = 'bone', alpha = 1, tagL = 'baseline', tagR = '') {
    if (typeof baseY === 'object' && baseY !== null) {
      const o = baseY;
      return drawSpecimenGuides(ctx, o.baseY || H * 0.62, o.capH || 76, o.fg || o.inkName || 'bone', o.alpha ?? 1, o.tagL || 'baseline', o.tagR || 'CORTEX // 2D_SPECIMEN');
    }
    if (alpha <= 0.05) return;
    const col = String(inkName).startsWith('#') ? inkName : rgba(inkName, 1);
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = col;
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 10]);
    ctx.beginPath();
    ctx.moveTo(0, Math.round(baseY) + 0.5);
    ctx.lineTo(W, Math.round(baseY) + 0.5);
    ctx.moveTo(0, Math.round(baseY - capH) + 0.5);
    ctx.lineTo(W, Math.round(baseY - capH) + 0.5);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = font(F.mono(600), 12);
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = col;
    ctx.textAlign = 'left';
    ctx.fillText(tagL, 96, Math.round(baseY) + 18);
    ctx.fillText(`cap-height · ${(capH).toFixed(0)} px`, 96, Math.round(baseY - capH) - 9);
    if (tagR) {
      ctx.textAlign = 'right';
      ctx.fillText(tagR, W - 96, Math.round(baseY - capH) - 9);
    }
    ctx.restore();
  }

  function drawInstrumentReadout(ctx, x, y, val01, opts = {}, extraPaper = false) {
    if (typeof x === 'string') {
      const leftLabel = x;
      const rightMeta = typeof y === 'string' ? y : '';
      const o = (typeof val01 === 'object' && val01 !== null) ? val01 : {};
      const isPaper = !!o.isPaper;
      const fgCol = o.fg || (isPaper ? '#08090C' : '#38BDF8');
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.font = font(F.mono(700), 14);
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = fgCol;
      ctx.textAlign = 'left';
      ctx.fillText(leftLabel, TITLE_SAFE.x0, TITLE_SAFE.y0 - 12);
      ctx.textAlign = 'right';
      ctx.fillText(rightMeta, TITLE_SAFE.x1, TITLE_SAFE.y0 - 12);
      ctx.strokeStyle = fgCol;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(TITLE_SAFE.x0, TITLE_SAFE.y0 - 3.5);
      ctx.lineTo(TITLE_SAFE.x1, TITLE_SAFE.y0 - 3.5);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (typeof val01 === 'string') {
      const isPaper = typeof extraPaper === 'boolean' ? extraPaper : !!(opts && opts.isPaper);
      const subText = typeof opts === 'string' ? opts : (opts && opts.sub) || '';
      const fgCol = (opts && opts.fg) || (isPaper ? '#08090C' : '#FAF8F5');
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.translate(x, y);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.font = font(F.mono(700), 14);
      ctx.fillStyle = fgCol;
      ctx.fillText(val01, 0, 0);
      if (subText) {
        ctx.font = font(F.mono(500), 12.5);
        ctx.fillText(subText, 0, 20);
      }
      ctx.fillRect(0, 28, 220, 1.5);
      ctx.restore();
      return;
    }
    const numVal = Number.isFinite(val01) ? val01 : 0;
    const sc = opts.scale || 1;
    const isPaper = !!opts.isPaper;
    const fgCol = opts.fg || opts.digitCol || (isPaper ? '#08090C' : '#FAF8F5');
    const accentCol = opts.barCol || opts.labelCol || fgCol;
    const label = opts.label || 'P(HEARTBEAT)';
    const textVal = opts.text !== undefined ? opts.text : numVal.toFixed(4);
    const sub = opts.sub || '';
    const barW = (opts.barW || 240) * sc;

    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.translate(x, y);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    ctx.font = font(F.mono(700), 13 * sc);
    ctx.fillStyle = accentCol;
    ctx.fillText(label, 0, -54 * sc);

    ctx.font = font(F.mono(700), 52 * sc);
    ctx.fillStyle = fgCol;
    ctx.fillText(textVal, 0, 0);

    if (opts.bar !== false) {
      const by = 14 * sc;
      ctx.fillStyle = fgCol;
      ctx.fillRect(0, by, barW, Math.max(1, 1.2 * sc));
      for (let i = 0; i <= 10; i++) {
        const tx = (barW * i) / 10;
        const th = (i % 5 === 0 ? 6 : 3.2) * sc;
        ctx.fillRect(tx, by - th, Math.max(1, sc), th);
      }
      ctx.fillStyle = accentCol;
      ctx.fillRect(0, by - 1.5 * sc, barW * clamp(numVal, 0, 1.35), 3.2 * sc);
    }

    if (sub) {
      ctx.font = font(F.mono(500), 11.5 * sc);
      ctx.fillStyle = fgCol;
      ctx.fillText(sub, 0, 34 * sc);
    }
    ctx.restore();
  }

  // Strict Duotone Paper Sheet (zero dirty grey/brown fibers; crisp solid bg + 1px binary ink registration ticks)
  function fillPaperSheet(ctx, opts = {}) {
    if (typeof opts !== 'object' || opts === null) opts = {};
    const bgCol = opts.bg || (opts.pureWhite ? '#FAF8F5' : '#F5F0E6');
    const fgCol = opts.fg || '#08090C';
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, W, H);

    if (opts.grid !== false) {
      const step = opts.gridStep || 96;
      ctx.fillStyle = fgCol;
      for (let y = step; y < H; y += step) {
        for (let x = step; x < W; x += step) {
          ctx.fillRect(x - 2, y, 5, 1);
          ctx.fillRect(x, y - 2, 1, 5);
        }
      }
    }

    if (opts.binderHoles) {
      ctx.fillStyle = fgCol;
      for (const hy of [H * 0.26, H * 0.50, H * 0.74]) {
        ctx.beginPath();
        ctx.arc(54, hy, 16, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // Museum-Grade Copperplate Burin Hatching & Banknote Guilloché Primitives (#35)
  // 100% Pure Solid Duotone (Zero `globalAlpha` grey, Zero `shadowBlur`)
  // --------------------------------------------------------------------------
  function drawBurinHatch(ctx, x, y, w, h, angle = -Math.PI / 4, spacing = 8, lineW = 1.2, col = '#FAF8F5') {
    if (!ctx || !(w > 0) || !(h > 0)) return;
    const step = Math.max(2, Number(spacing) || 8);
    const lw = Math.max(0.6, Number(lineW) || 1.2);
    const ang = Number.isFinite(angle) ? angle : -Math.PI / 4;
    const strokeCol = (typeof col === 'string' && (col.startsWith('#') || col.startsWith('rgb')))
      ? col
      : rgba(col || 'bone', 1);
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;
    const diag = Math.hypot(w, h) * 0.5 + step;

    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    ctx.translate(cx, cy);
    ctx.rotate(ang);
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = lw;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    for (let oy = -diag; oy <= diag; oy += step) {
      ctx.moveTo(-diag, oy);
      ctx.lineTo(diag, oy);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawGuillocheRosette(ctx, cx, cy, R = 260, r = 72, d = 110, petals = 24, col = '#FAF8F5', lineW = 1.2) {
    if (!ctx || !Number.isFinite(cx) || !Number.isFinite(cy)) return;
    const N = Math.max(3, Math.round(Number(petals) || 24));
    // V8: Block low-petal (`<= 4`) wireframe rotating triangles that pollute frames as engineering artifacts
    if (N <= 4) return;
    const baseR = Math.max(8, Number(R) || 260);
    const ampR = Number.isFinite(r) ? r : 72;
    const loopD = Number.isFinite(d) ? d : 110;
    const lw = Math.max(0.6, Number(lineW) || 1.2);
    const strokeCol = (typeof col === 'string' && (col.startsWith('#') || col.startsWith('rgb')))
      ? col
      : rgba(col || 'bone', 1);
    const steps = Math.min(720, Math.max(240, N * 16));
    const phaseTwist = loopD / Math.max(40, baseR * 2.35);

    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = lw;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let strand = 0; strand < 3; strand++) {
      const ph = (strand * TAU) / 3;
      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        const ang = u * TAU;
        const rad = baseR
          + ampR * Math.cos(N * ang + ph)
          + (loopD * 0.30) * Math.cos((N * 2 + 1) * ang - ph);
        const theta = ang + phaseTwist * Math.sin(N * ang + ph);
        const px = cx + Math.cos(theta) * rad;
        const py = cy + Math.sin(theta) * rad;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }
    ctx.stroke();
    ctx.restore();
  }

  function bookendFrameK(t) {
    const curT = Number.isFinite(t) ? t : 0;
    if (curT < 3.51) return 1 - smoothstep(3.05, 3.51, curT);
    if (curT > 274.50) return smoothstep(274.50, 275.10, curT);
    return 0;
  }

  function drawBookendCropFrame(ctx, frameK, isPaper = false, leftMeta = 'PLATE I · CORTEX SHELL', rightMeta = 'PID:19527 // 0.1MM', customFg = null) {
    if (typeof isPaper === 'string') {
      rightMeta = typeof leftMeta === 'string' ? leftMeta : rightMeta;
      leftMeta = isPaper;
      isPaper = false;
    }
    // `pdoom-video` Revision 4 Bookend Law (#35): crop frame converges ONLY at opening `t < 3.51s`
    // and closing `t > 274.50s` — 100% full-bleed across all middle plates!
    const liveT = (typeof window !== 'undefined' && window.CortexPDoomCore && Number.isFinite(window.CortexPDoomCore.currentRenderTime))
      ? window.CortexPDoomCore.currentRenderTime
      : 0;
    const gateK = bookendFrameK(liveT);
    const effK = clamp(frameK, 0, 1) * gateK;
    if (effK <= 0.005) return;
    const fly = (1 - ease.outCubic(effK)) * 160;
    const x0 = Math.round(56 - fly);
    const y0 = Math.round(42 - fly * 0.6);
    const x1 = Math.round(W - 56 + fly);
    const y1 = Math.round(H - 42 + fly * 0.6);
    const fgCol = customFg || (isPaper ? '#08090C' : '#38BDF8');

    ctx.save();
    ctx.shadowBlur = 0;
    // V8: Clean full-bleed atmospheric hairline margin only — ZERO dashed CAD frame or `+` engineering crosshairs!
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = fgCol;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x0, y0); ctx.lineTo(x0 + 34, y0);
    ctx.moveTo(x1, y0); ctx.lineTo(x1 - 34, y0);
    ctx.moveTo(x0, y1); ctx.lineTo(x0 + 34, y1);
    ctx.moveTo(x1, y1); ctx.lineTo(x1 - 34, y1);
    ctx.stroke();

    ctx.font = font(F.mono(600), 12);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = fgCol;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillText(leftMeta, x0 + 8, y0 - 10);
    ctx.textAlign = 'right';
    ctx.fillText(rightMeta, x1 - 8, y0 - 10);
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // Asset Preloader + `Cortex25D.whenReady()` Chain (`#46/#52`: Zero Legacy Raster/Curly-Girl Preloads!)
  // --------------------------------------------------------------------------
  const ASSET_URLS = {};

  const _loadedAssets = new Map();
  let _basePreloadPromise = null;

  function _preloadCoreImages() {
    if (_basePreloadPromise) return _basePreloadPromise;
    const entries = Object.entries(ASSET_URLS);
    _basePreloadPromise = Promise.all(
      entries.map(([key, url]) => new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = async () => {
          try { if (img.decode) await img.decode(); } catch (_) {}
          if (img.naturalWidth > 0) _loadedAssets.set(key, img);
          resolve();
        };
        img.onerror = () => resolve();
        const cleanUrl = (typeof location !== 'undefined' && location.protocol === 'file:')
          ? url.replace(/^\//, '')
          : url;
        img.src = cleanUrl + '?v=v30';
      }))
    );
    return _basePreloadPromise;
  }

  async function preloadAssets() {
    await _preloadCoreImages();
    if (typeof window !== 'undefined' && window.Cortex25D && typeof window.Cortex25D.whenReady === 'function') {
      try {
        await window.Cortex25D.whenReady();
      } catch (_) {}
    }
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (_) {}
    }
  }

  if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
    setTimeout(() => { preloadAssets(); }, 10);
  }

  function getAsset(key) {
    return _loadedAssets.get(key) || null;
  }

  // --------------------------------------------------------------------------
  // Strict Duotone Kinetic Typography Primitives (Zero `shadowBlur`, Zero Grey)
  // --------------------------------------------------------------------------
  function drawKineticWord(ctx, text, cx, cy, sizePx, opts = {}) {
    if (!text) return 0;
    const fontTmpl = opts.font || F.display(900);
    const widthScale = opts.widthScale !== undefined ? opts.widthScale : 1.0;
    const heightScale = opts.heightScale !== undefined ? opts.heightScale : 1.0;
    const shear = opts.shear || 0;
    const rot = opts.rot || 0;
    const align = opts.align || 'center';
    const fStr = font(fontTmpl, sizePx);
    const fgCol = opts.fg || opts.col || '#FAF8F5';

    const renderBody = (targetCtx) => {
      targetCtx.save();
      targetCtx.shadowBlur = 0;
      targetCtx.globalAlpha = 1;
      targetCtx.font = fStr;
      const rawW = targetCtx.measureText(text).width;
      targetCtx.translate(cx, cy);
      if (rot) targetCtx.rotate(rot);
      if (shear || widthScale !== 1 || heightScale !== 1) {
        targetCtx.transform(widthScale, 0, shear * widthScale, heightScale, 0, 0);
      }
      const x0 = align === 'center' ? -rawW * 0.5 : align === 'right' ? -rawW : 0;
      const y0 = opts.baselineOffset !== undefined ? opts.baselineOffset : sizePx * 0.34;
      targetCtx.textAlign = 'left';
      targetCtx.textBaseline = 'alphabetic';

      if (opts.outlineOnly) {
        targetCtx.strokeStyle = fgCol;
        targetCtx.lineWidth = (opts.lineWidth || 2.8) / Math.max(0.4, widthScale);
        targetCtx.lineJoin = 'miter';
        targetCtx.strokeText(text, x0, y0);
      } else {
        if (opts.bgPlate && opts.bg) {
          const padX = sizePx * 0.14, padY = sizePx * 0.10;
          targetCtx.fillStyle = opts.bg;
          targetCtx.fillRect(x0 - padX, y0 - sizePx * 0.86 - padY, rawW + padX * 2, sizePx * 1.02 + padY * 2);
        }
        targetCtx.fillStyle = fgCol;
        targetCtx.fillText(text, x0, y0);
      }
      targetCtx.restore();
    };

    ctx.save();
    ctx.font = fStr;
    const effW = ctx.measureText(text).width * widthScale;
    ctx.restore();

    if (opts.xor && opts.bg) {
      withXorText(ctx, fgCol, opts.bg, renderBody);
    } else {
      renderBody(ctx);
    }
    return effW;
  }

  function drawOdometer(ctx, x, y, numVal, fmtOpts = {}) {
    const decimals = fmtOpts.decimals !== undefined ? fmtOpts.decimals : 1;
    const intDigits = fmtOpts.intDigits || 3;
    const sizePx = fmtOpts.size || 240;
    const fgCol = fmtOpts.fg || fmtOpts.col || '#FAF8F5';
    const suffix = fmtOpts.suffix || '';
    const fStr = font(F.mono(700), sizePx);

    const clamped = Math.max(0, numVal);
    const scalePow = Math.pow(10, decimals);
    const scaled = clamped * scalePow;
    const baseInt = Math.floor(scaled);
    const frac = scaled - baseInt;
    const strNow = String(baseInt).padStart(intDigits + decimals, '0');
    const strNext = String(baseInt + 1).padStart(intDigits + decimals, '0');

    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.font = fStr;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    const chW = ctx.measureText('0').width * 1.02;
    const cellH = sizePx * 1.04;

    // Tight clip window so rolled digits NEVER bleed into headers above or lyrics below
    ctx.beginPath();
    ctx.rect(x - 12, y - sizePx * 0.84, chW * (strNow.length + 4) + 32, sizePx * 0.98);
    ctx.clip();

    let cx = x;
    for (let i = 0; i < strNow.length; i++) {
      if (decimals > 0 && i === strNow.length - decimals) {
        ctx.fillStyle = fmtOpts.dotCol || fgCol;
        ctx.fillText('.', cx, y);
        cx += chW * 0.56;
      }
      const d0 = strNow[i];
      const d1 = strNext[i];
      const roll = d0 !== d1 ? ease.outExpo(frac) : 0;
      ctx.fillStyle = fgCol;
      ctx.fillText(d0, cx, y - roll * cellH);
      if (roll > 0.001) {
        ctx.fillText(d1, cx, y + (1 - roll) * cellH);
      }
      cx += chW;
    }
    if (suffix) {
      ctx.font = font(F.mono(700), sizePx * 0.34);
      ctx.fillStyle = fmtOpts.suffixCol || fgCol;
      ctx.fillText(suffix, cx + sizePx * 0.10, y - sizePx * 0.06);
    }
    ctx.restore();
  }

  function drawRubberStamp(ctx, mainText, subText, cx, cy, angleRad, slamP, opts = {}) {
    if (slamP <= 0.001) return;
    const s = lerp(1.55, 1.0, ease.outExpo(clamp(slamP, 0, 1)));
    const mainSz = opts.size || 108;
    const fgCol = opts.fg || opts.col || rgba(opts.colName || 'signal', 1);
    const bgCol = opts.bg || opts.voidCol || '#F5F0E6';

    ctx.save();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.translate(cx, cy);
    ctx.rotate(angleRad);
    ctx.scale(s, s);

    ctx.font = font(F.condensed(900), mainSz);
    const mw = ctx.measureText(mainText).width;
    const bw = mw + 76;
    const bh = subText ? mainSz * 1.48 : mainSz * 1.16;

    // Opaque backing plate prevents underlying form lines from muddying the stamp!
    if (opts.opaqueBack !== false) {
      ctx.fillStyle = bgCol;
      ctx.fillRect(-bw * 0.5 - 4, -bh * 0.5 - 4, bw + 8, bh + 8);
    }

    ctx.strokeStyle = fgCol;
    ctx.lineWidth = 7;
    ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
    ctx.lineWidth = 2.4;
    ctx.strokeRect(-bw * 0.5 + 10, -bh * 0.5 + 10, bw - 20, bh - 20);

    ctx.fillStyle = fgCol;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(mainText, 0, subText ? mainSz * 0.14 : mainSz * 0.34);

    if (subText) {
      ctx.font = font(F.mono(700), Math.round(mainSz * 0.22));
      ctx.fillText(subText, 0, bh * 0.36);
    }

    // Crisp binary dry-ink cutouts in exact `bgCol` (zero grey wash!)
    const rnd = mulberry32(911);
    ctx.fillStyle = bgCol;
    for (let i = 0; i < 72; i++) {
      const vx = (rnd() - 0.5) * bw;
      const vy = (rnd() - 0.5) * bh;
      ctx.fillRect(Math.round(vx), Math.round(vy), Math.round(2 + rnd() * 4), Math.round(1 + rnd() * 2));
    }
    ctx.restore();
  }

  // Crisp Integer Nearest-Neighbor 2D Pixel Art Buffer (`480x270` -> `1920x1080` / `3840x2160`)
  const _pixelStageCache = new Map();
  function getPixelStage(pw = 480, ph = 270) {
    const key = `${pw}x${ph}`;
    if (_pixelStageCache.has(key)) return _pixelStageCache.get(key);
    const canvas = document.createElement('canvas');
    canvas.width = pw;
    canvas.height = ph;
    const ctx = canvas.getContext('2d', { alpha: true });
    ctx.imageSmoothingEnabled = false;
    const obj = { canvas, ctx, pw, ph };
    _pixelStageCache.set(key, obj);
    return obj;
  }

  function presentPixelStage(dstCtx, pxStage, dstW = W, dstH = H) {
    dstCtx.save();
    dstCtx.imageSmoothingEnabled = false;
    dstCtx.drawImage(pxStage.canvas, 0, 0, pxStage.pw, pxStage.ph, 0, 0, dstW, dstH);
    dstCtx.restore();
  }

  window.CortexPDoomCore = {
    W,
    H,
    TAU,
    currentRenderTime: 0,
    TITLE_SAFE,
    ACTION_SAFE,
    PAL,
    PLATE_DUOTONES,
    getPlateDuotone,
    parseHexRgb,
    colorLuminance01,
    bakeStrictDuotoneCanvas,
    withXorText,
    rgba,
    mixCol,
    clamp,
    lerp,
    invLerp,
    remap,
    smoothstep,
    smootherstep,
    window01,
    ease,
    prog,
    springStep,
    pulse,
    mulberry32,
    frameIdx,
    hash,
    noise1,
    noise2,
    fbm1,
    keys,
    polylineLengths,
    pointAtLength,
    drawPartialPolyline,
    beatAt,
    timeOfBeat,
    nearestBeat,
    beatsIn,
    cues: ENRICHED_CUES,
    cueById,
    cuesIn,
    wordProgress,
    cueSungChars,
    F,
    font,
    layoutText,
    xAtGlyph,
    fitSize,
    drawTextOnCurve,
    sampleTextAtoms,
    buildPlotText,
    drawPlotText,
    drawSparkHead,
    drawSparkParticles,
    drawSpecimenGuides,
    drawInstrumentReadout,
    fillPaperSheet,
    drawBurinHatch,
    drawGuillocheRosette,
    bookendFrameK,
    drawBookendCropFrame,
    preloadAssets,
    getAsset,
    drawKineticWord,
    drawOdometer,
    drawRubberStamp,
    getPixelStage,
    presentPixelStage
  };
})();
