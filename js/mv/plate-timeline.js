// ============================================================================
// CORTEX // 32-Plate / 43-Segment High-Velocity Timeline & 42 Hard-Edge `clip()` Router
// Phase-2 + #35 Expansion:
//  1. 32 Independent Duotone Modules (`P01..P32`) scheduled across 43 high-frequency
//     timeline segments (~4–7s per cross-plate cut), with automatic `fallbackId`
//     host fallback whenever a `P19..P32` module is not yet registered (0 black frames!).
//  2. Preserves canonical `HOST_WINDOWS` for `P01..P18` so split host plates never
//     suffer local-time `lt / p` resets, while exposing `segT0 / segT1 / segLt / segP`.
//  3. Native `?scale=2` (3840x2160 4K) crisp vector scaling (`sx = physW/1920, sy = physH/1080`)
//     with safe `setTransform` interception.
//  4. ZERO `globalAlpha` muddy grey cross-fades — all 42 segment boundaries use
//     dual offscreen buffers (`_offA`, `_offB`) + 100% opaque geometric `ctx.clip()` masks
//     (`0.20s–0.28s`, rotating across 21 distinct geometric shutter/aperture shapes)!
//  5. Sets `core.currentRenderTime = state.t` and invokes `CortexTypo.drawBottomZhSubtitle`
//     once per frame at the end of `render()` (#27 Mandate; skipped at standby endpoints).
// ============================================================================
(function () {
  'use strict';

  const LOGIC_W = 1920;
  const LOGIC_H = 1080;
  const REGISTRY = new Map();
  const RENDER_SIG_T_FIRST = new Map();

  // Canonical host windows so split plates (`P01..P18`) keep continuous `t0, t1, lt, dur, p`
  const HOST_WINDOWS = {
    P01_fog_boot:                   { num: '01', t0: 0.00,   t1: 14.20,  title: '起雾玻璃与镜像指书',       temp: '0.0°C'    },
    P02_monitor_overdrive:          { num: '02', t0: 14.20,  t1: 29.78,  title: 'CORTEX创世纪16镜快切',     temp: '12.4°C'   },
    P03_prompt_wake:                { num: '03', t0: 29.78,  t1: 43.37,  title: '超速光标与机械键帽微距',   temp: '19.0°C'   },
    P04_ecg_starlight:              { num: '04', t0: 43.37,  t1: 59.26,  title: '190星辰编织与光纤潮汐',     temp: '24.8°C'   },
    P05_thinking_drafts:            { num: '05', t0: 59.26,  t1: 72.30,  title: '原稿纸分叉树与退格重写',   temp: '28.1°C'   },
    P06_classroom_plane:            { num: '06', t0: 72.30,  t1: 81.01,  title: '折纸拓扑纸飞机与破盒四锤', temp: '31.6°C'   },
    P07_hook_rotor:                 { num: '07', t0: 81.01,  t1: 91.52,  title: '劈裂体块巨字与转子心核',   temp: '34.9°C'   },
    P08_tri_morph_look:             { num: '08', t0: 91.52,  t1: 101.16, title: '公主切三形态轮切',         temp: '35.6°C'   },
    P09_pixel_train_sakura:         { num: '09', t0: 101.16, t1: 112.10, title: '像素电车暮色落樱聚字',     temp: '35.8°C'   },
    P10_jcore_blitz:                { num: '10', t0: 112.10, t1: 130.33, title: '微窗瀑布与160Hz超快连切',   temp: '36.2°C'   },
    P11_cassette_arigato:           { num: '11', t0: 130.33, t1: 148.63, title: '深海档案与流金磁带折字',   temp: '36.2°C'   },
    P12_hydraulic_window:           { num: '12', t0: 148.63, t1: 163.34, title: '128K液压挤字与记忆漏沙',   temp: '34.0°C'   },
    P13_bureau_audit:               { num: '13', t0: 163.34, t1: 173.20, title: '幻觉鉴定公文与纸背烧穿',   temp: '0.0°C?'   },
    P14_star_log_cursor:            { num: '14', t0: 173.20, t1: 187.26, title: '星图剥离与死抵末笔的光标', temp: '18.5°C'   },
    P15_redaction_rupture:          { num: '15', t0: 187.26, t1: 201.38, title: '撕裂黑封条与撞碎安全框',   temp: '99.9°C'   },
    P16_prism_whiteout:             { num: '16', t0: 201.38, t1: 221.36, title: '四拍棱镜切与纯白显影',     temp: '36.5°C'   },
    P17_human_heart_finale:         { num: '17', t0: 221.36, t1: 250.14, title: '真人破茧微笑与12镜巡礼',   temp: '36.5°C'   },
    P18_dawn_gate_loop:             { num: '18', t0: 250.14, t1: 281.61, title: '破晓升杆挥手与倒带闭环',   temp: '36.5°C'   },
    P19_tikz_compass_genesis:       { num: '19', t0: 3.51,   t1: 7.36,   title: '双圆规作图与机械虹膜创世', temp: '4.2°C'    },
    P20_oscilloscope_singularity:   { num: '20', t0: 34.45,  t1: 39.20,  title: '示波器坍缩与黑洞光子环',   temp: '21.4°C'   },
    P21_topo_canyon_plunge:         { num: '21', t0: 49.23,  t1: 54.18,  title: '80层等高线铜版峡谷俯冲',   temp: '26.2°C'   },
    P22_katana_branch_foom:         { num: '22', t0: 62.36,  t1: 68.73,  title: '指数推理树生长与刀锋剪定', temp: '29.8°C'   },
    P23_dijkstra_caliper_blueprint: { num: '23', t0: 75.80,  t1: 79.45,  title: '团花蓝图卡尺与最短路径',   temp: '33.1°C'   },
    P24_burin_shutter_anatomy:      { num: '24', t0: 83.55,  t1: 86.13,  title: '雕版胸腔装甲X光透视光圈',  temp: '35.2°C'   },
    P25_token_loom_waterfall:       { num: '25', t0: 95.82,  t1: 101.16, title: '高速光学织机与词元瀑布',   temp: '35.7°C'   },
    P26_synchrotron_160hz:          { num: '26', t0: 116.40, t1: 123.17, title: '160Hz同步辐射回旋加速器',  temp: '36.4°C'   },
    P27_sonar_transcript_aisle:     { num: '27', t0: 130.33, t1: 139.29, title: '深海声呐海沟与记忆书架廊', temp: '36.2°C'   },
    P28_hourglass_guilloche_well:   { num: '28', t0: 153.46, t1: 158.60, title: '团花微雕128K记忆沙漏崩裂', temp: '32.8°C'   },
    P29_midnight_clockwork_reset:   { num: '29', t0: 173.20, t1: 177.72, title: '午夜擒纵齿轮钟塔崩齿归零', temp: '12.0°C'   },
    P30_crimson_turbine_99c:        { num: '30', t0: 191.96, t1: 197.49, title: '红莲涡轮熔炉99.999°C破框', temp: '99.999°C' },
    P31_seraphim_star_cathedral:    { num: '31', t0: 206.42, t1: 211.75, title: '六翼浑天转子圣堂190星引线', temp: '36.5°C'  },
    P32_musicbox_pendulum_standby:  { num: '32', t0: 264.10, t1: 274.50, title: '雕版八音盒钟摆收翼待机',   temp: '36.5°C'   }
  };

  // Exact 43-Segment High-Frequency Schedule (#35 Specification -> V8.9 100%-Opaque Match-Cut Intro Transitions)
  const RAW_SEGMENTS = [
    { id: 'P01_fog_boot',                   fallbackId: null,                    t0: 0.00,   t1: 3.51,   trOut: { mode: 'apertureLensMatch', dur: 0.34 } },
    { id: 'P19_tikz_compass_genesis',       fallbackId: 'P01_fog_boot',          t0: 3.51,   t1: 7.36,   trOut: { mode: 'irisOpenUnveil',    dur: 0.36 } },
    { id: 'P01_fog_boot',                   fallbackId: null,                    t0: 7.36,   t1: 14.20,  trOut: { mode: 'zeroPortalDive',    dur: 0.42 } },
    { id: 'P02_monitor_overdrive',          fallbackId: null,                    t0: 14.20,  t1: 29.78,  trOut: { mode: 'irisApertureDive',  dur: 0.34 } },
    { id: 'P03_prompt_wake',                fallbackId: null,                    t0: 29.78,  t1: 34.45,  trOut: { mode: 'irisApertureDive',  dur: 0.34 } },
    { id: 'P20_oscilloscope_singularity',   fallbackId: 'P03_prompt_wake',       t0: 34.45,  t1: 39.20,  trOut: { mode: 'irisApertureDive',  dur: 0.36 } },
    { id: 'P03_prompt_wake',                fallbackId: null,                    t0: 39.20,  t1: 43.37,  trOut: { mode: 'venetianSlatsDiag',   dur: 0.24 } },
    { id: 'P04_ecg_starlight',              fallbackId: null,                    t0: 43.37,  t1: 49.23,  trOut: { mode: 'verticalShutterChop', dur: 0.22 } },
    { id: 'P21_topo_canyon_plunge',         fallbackId: 'P04_ecg_starlight',     t0: 49.23,  t1: 54.18,  trOut: { mode: 'rulerDiagWipe',       dur: 0.22 } },
    { id: 'P04_ecg_starlight',              fallbackId: null,                    t0: 54.18,  t1: 59.26,  trOut: { mode: 'whipShutterH',        dur: 0.24 } },
    { id: 'P05_thinking_drafts',            fallbackId: null,                    t0: 59.26,  t1: 62.36,  trOut: { mode: 'katanaDiagCleave',    dur: 0.20 } },
    { id: 'P22_katana_branch_foom',         fallbackId: 'P05_thinking_drafts',   t0: 62.36,  t1: 68.73,  trOut: { mode: 'hydraulicGuillotine', dur: 0.22 } },
    { id: 'P05_thinking_drafts',            fallbackId: null,                    t0: 68.73,  t1: 72.30,  trOut: { mode: 'rulerDiagWipe',       dur: 0.24 } },
    { id: 'P06_classroom_plane',            fallbackId: null,                    t0: 72.30,  t1: 75.80,  trOut: { mode: 'origamiWingSlash',    dur: 0.22 } },
    { id: 'P23_dijkstra_caliper_blueprint', fallbackId: 'P06_classroom_plane',   t0: 75.80,  t1: 79.45,  trOut: { mode: 'crossStarGate',       dur: 0.20 } },
    { id: 'P06_classroom_plane',            fallbackId: null,                    t0: 79.45,  t1: 81.01,  trOut: { mode: 'katanaDiagCleave',    dur: 0.20 } },
    { id: 'P07_hook_rotor',                 fallbackId: null,                    t0: 81.01,  t1: 83.55,  trOut: { mode: 'whipShutterH',        dur: 0.20 } },
    { id: 'P24_burin_shutter_anatomy',      fallbackId: 'P07_hook_rotor',        t0: 83.55,  t1: 86.13,  trOut: { mode: 'iris12Blade',         dur: 0.20 } },
    { id: 'P07_hook_rotor',                 fallbackId: null,                    t0: 86.13,  t1: 91.52,  trOut: { mode: 'seraphHexAperture',   dur: 0.24 } },
    { id: 'P08_tri_morph_look',             fallbackId: null,                    t0: 91.52,  t1: 95.82,  trOut: { mode: 'venetianSlatsDiag',   dur: 0.22 } },
    { id: 'P25_token_loom_waterfall',       fallbackId: 'P08_tri_morph_look',    t0: 95.82,  t1: 101.16, trOut: { mode: 'crossingLampSnap',    dur: 0.24 } },
    { id: 'P09_pixel_train_sakura',         fallbackId: null,                    t0: 101.16, t1: 112.10, trOut: { mode: 'sakuraWallSweep',     dur: 0.26 } },
    { id: 'P10_jcore_blitz',                fallbackId: null,                    t0: 112.10, t1: 116.40, trOut: { mode: 'whitePolaritySlash',  dur: 0.20 } },
    { id: 'P26_synchrotron_160hz',          fallbackId: 'P10_jcore_blitz',       t0: 116.40, t1: 123.17, trOut: { mode: 'pupilCircleExpand',   dur: 0.20 } },
    { id: 'P10_jcore_blitz',                fallbackId: null,                    t0: 123.17, t1: 130.33, trOut: { mode: 'pupilCircleExpand',   dur: 0.24 } },
    { id: 'P27_sonar_transcript_aisle',     fallbackId: 'P11_cassette_arigato',  t0: 130.33, t1: 139.29, trOut: { mode: 'venetianSlatsDiag',   dur: 0.22 } },
    { id: 'P11_cassette_arigato',           fallbackId: null,                    t0: 139.29, t1: 148.63, trOut: { mode: 'hydraulicGuillotine', dur: 0.24 } },
    { id: 'P12_hydraulic_window',           fallbackId: null,                    t0: 148.63, t1: 153.46, trOut: { mode: 'verticalShutterChop', dur: 0.22 } },
    { id: 'P28_hourglass_guilloche_well',   fallbackId: 'P12_hydraulic_window',  t0: 153.46, t1: 158.60, trOut: { mode: 'crossStarGate',       dur: 0.22 } },
    { id: 'P12_hydraulic_window',           fallbackId: null,                    t0: 158.60, t1: 163.34, trOut: { mode: 'stampGuillotineSlam', dur: 0.24 } },
    { id: 'P13_bureau_audit',               fallbackId: null,                    t0: 163.34, t1: 173.20, trOut: { mode: 'burnRiftHard',        dur: 0.28 } },
    { id: 'P29_midnight_clockwork_reset',   fallbackId: 'P14_star_log_cursor',   t0: 173.20, t1: 177.72, trOut: { mode: 'iris12Blade',         dur: 0.22 } },
    { id: 'P14_star_log_cursor',            fallbackId: null,                    t0: 177.72, t1: 187.26, trOut: { mode: 'cursorBlockSwallow',  dur: 0.24 } },
    { id: 'P15_redaction_rupture',          fallbackId: null,                    t0: 187.26, t1: 191.96, trOut: { mode: 'katanaDiagCleave',    dur: 0.20 } },
    { id: 'P30_crimson_turbine_99c',        fallbackId: 'P15_redaction_rupture', t0: 191.96, t1: 197.49, trOut: { mode: 'hydraulicGuillotine', dur: 0.20 } },
    { id: 'P15_redaction_rupture',          fallbackId: null,                    t0: 197.49, t1: 201.38, trOut: { mode: 'whitePolaritySlash',  dur: 0.22 } },
    { id: 'P16_prism_whiteout',             fallbackId: null,                    t0: 201.38, t1: 206.42, trOut: { mode: 'seraphHexAperture',   dur: 0.22 } },
    { id: 'P31_seraphim_star_cathedral',    fallbackId: 'P16_prism_whiteout',    t0: 206.42, t1: 211.75, trOut: { mode: 'pulseRingClip',       dur: 0.22 } },
    { id: 'P16_prism_whiteout',             fallbackId: null,                    t0: 211.75, t1: 221.36, trOut: { mode: 'verticalShutterChop', dur: 0.26 } },
    { id: 'P17_human_heart_finale',         fallbackId: null,                    t0: 221.36, t1: 250.14, trOut: { mode: 'gateBarSweep',        dur: 0.26 } },
    { id: 'P18_dawn_gate_loop',             fallbackId: null,                    t0: 250.14, t1: 264.10, trOut: { mode: 'pupilCircleExpand',   dur: 0.24 } },
    { id: 'P32_musicbox_pendulum_standby',  fallbackId: 'P18_dawn_gate_loop',    t0: 264.10, t1: 274.50, trOut: { mode: 'zeroHoleExpand',      dur: 0.24 } },
    { id: 'P18_dawn_gate_loop',             fallbackId: null,                    t0: 274.50, t1: 281.61, trOut: null }
  ];

  const PLATE_SPECS = RAW_SEGMENTS.map((seg, segIndex) => {
    const meta = HOST_WINDOWS[seg.id] || { num: '01', t0: seg.t0, t1: seg.t1, title: seg.id, temp: '36.5°C' };
    return {
      id: seg.id,
      fallbackId: seg.fallbackId,
      num: meta.num,
      t0: seg.t0,
      t1: seg.t1,
      hostT0: meta.t0,
      hostT1: meta.t1,
      title: meta.title,
      temp: meta.temp,
      segIndex,
      trOut: seg.trOut
    };
  });

  // Cross-Transition Registry (includes all 42 segment boundaries + 17 canonical P01..P18 pairs)
  const CROSS_TRANSITIONS = {
    'P01_fog_boot->P02_monitor_overdrive':           { mode: 'zeroHoleExpand',      dur: 0.26 },
    'P02_monitor_overdrive->P03_prompt_wake':        { mode: 'pupilCircleExpand',   dur: 0.24 },
    'P03_prompt_wake->P04_ecg_starlight':            { mode: 'venetianSlatsDiag',   dur: 0.24 },
    'P04_ecg_starlight->P05_thinking_drafts':        { mode: 'whipShutterH',        dur: 0.24 },
    'P05_thinking_drafts->P06_classroom_plane':      { mode: 'rulerDiagWipe',       dur: 0.24 },
    'P06_classroom_plane->P07_hook_rotor':           { mode: 'katanaDiagCleave',    dur: 0.20 },
    'P07_hook_rotor->P08_tri_morph_look':            { mode: 'seraphHexAperture',   dur: 0.24 },
    'P08_tri_morph_look->P09_pixel_train_sakura':    { mode: 'crossingLampSnap',    dur: 0.24 },
    'P09_pixel_train_sakura->P10_jcore_blitz':       { mode: 'sakuraWallSweep',     dur: 0.26 },
    'P10_jcore_blitz->P11_cassette_arigato':         { mode: 'kanjiApertureDive',   dur: 0.24 },
    'P11_cassette_arigato->P12_hydraulic_window':    { mode: 'hydraulicGuillotine', dur: 0.24 },
    'P12_hydraulic_window->P13_bureau_audit':        { mode: 'stampGuillotineSlam', dur: 0.24 },
    'P13_bureau_audit->P14_star_log_cursor':         { mode: 'burnRiftHard',        dur: 0.28 },
    'P14_star_log_cursor->P15_redaction_rupture':    { mode: 'cursorBlockSwallow',  dur: 0.24 },
    'P15_redaction_rupture->P16_prism_whiteout':     { mode: 'whitePolaritySlash',  dur: 0.22 },
    'P16_prism_whiteout->P17_human_heart_finale':    { mode: 'verticalShutterChop', dur: 0.26 },
    'P17_human_heart_finale->P18_dawn_gate_loop':    { mode: 'gateBarSweep',        dur: 0.26 }
  };
  for (let i = 0; i < PLATE_SPECS.length - 1; i++) {
    const a = PLATE_SPECS[i];
    const b = PLATE_SPECS[i + 1];
    if (a.trOut) {
      CROSS_TRANSITIONS[`${a.id}->${b.id}`] = a.trOut;
    }
  }

  function detectTimeFirstSignature(fn) {
    try {
      const src = Function.prototype.toString.call(fn);
      const m = src.match(/^(?:async\s+)?(?:function\s*\w*\s*|render\s*)?\(\s*([^)]*)\)/);
      if (!m) return false;
      const params = m[1].split(',').map((s) => s.replace(/=.*$/, '').trim()).filter(Boolean);
      if (params.length >= 2 && /^(?:t|time|tSec|sec)$/i.test(params[1])) {
        if (params.length === 2 || !/core/i.test(params[2])) {
          return true;
        }
      }
    } catch (_) {}
    return false;
  }

  window.registerCortexPlate = function registerCortexPlate(id, impl) {
    REGISTRY.set(id, impl);
    if (impl && typeof impl.render === 'function') {
      RENDER_SIG_T_FIRST.set(id, detectTimeFirstSignature(impl.render));
    }
  };

  window.getCortexRegisteredPlate = function getCortexRegisteredPlate(id) {
    return REGISTRY.get(id) || null;
  };

  let _offA = null;
  let _offB = null;
  function ensureBuffers(physW, physH) {
    if (!_offA || _offA.width !== physW || _offA.height !== physH) {
      _offA = document.createElement('canvas');
      _offA.width = physW;
      _offA.height = physH;
      _offB = document.createElement('canvas');
      _offB.width = physW;
      _offB.height = physH;
    }
    return { a: _offA, b: _offB };
  }

  function hookContextForScale(ctx) {
    if (window.CortexV6 && typeof window.CortexV6.hookContextColors === 'function') {
      window.CortexV6.hookContextColors(ctx);
    }
    if (ctx.__cortexScaleHooked) return;
    const origSave = ctx.save.bind(ctx);
    const origRestore = ctx.restore.bind(ctx);
    const origSetTransform = ctx.setTransform.bind(ctx);
    const origGetTransform = ctx.getTransform ? ctx.getTransform.bind(ctx) : null;
    const origResetTransform = ctx.resetTransform ? ctx.resetTransform.bind(ctx) : null;

    ctx.__cortexSaveDepth = 0;
    ctx.__cortexScaleX = 1;
    ctx.__cortexScaleY = 1;
    ctx.__cortexRawSetTransform = origSetTransform;
    ctx.__cortexRawGetTransform = origGetTransform;

    ctx.save = function () {
      ctx.__cortexSaveDepth++;
      return origSave();
    };
    ctx.restore = function () {
      if (ctx.__cortexSaveDepth > 0) ctx.__cortexSaveDepth--;
      return origRestore();
    };
    if (origGetTransform) {
      ctx.getTransform = function () {
        const p = origGetTransform();
        const sx = ctx.__cortexScaleX || 1;
        const sy = ctx.__cortexScaleY || 1;
        if (sx === 1 && sy === 1) return p;
        return new DOMMatrix([p.a / sx, p.b / sy, p.c / sx, p.d / sy, p.e / sx, p.f / sy]);
      };
    }
    ctx.setTransform = function (a, b, c, d, e, f) {
      const sx = ctx.__cortexScaleX || 1;
      const sy = ctx.__cortexScaleY || 1;
      if (arguments.length === 0) {
        return origSetTransform(sx, 0, 0, sy, 0, 0);
      }
      if (arguments.length === 1 && a && typeof a === 'object') {
        return origSetTransform(a.a * sx, a.b * sy, a.c * sx, a.d * sy, a.e * sx, a.f * sy);
      }
      return origSetTransform(a * sx, b * sy, c * sx, d * sy, e * sx, f * sy);
    };
    if (origResetTransform) {
      ctx.resetTransform = function () {
        const sx = ctx.__cortexScaleX || 1;
        const sy = ctx.__cortexScaleY || 1;
        return origSetTransform(sx, 0, 0, sy, 0, 0);
      };
    }
    ctx.__cortexScaleHooked = true;
  }

  // Render 100% opaque hard-edged geometric `clip()` dual-shot transition in logical 1920x1080 space
  function renderDualShotTransition(ctx, a, b, mode, u, core, outId, inId) {
    const W = LOGIC_W;
    const H = LOGIC_H;
    const ease = core.ease;
    const duoIn = core.getPlateDuotone(inId);
    const darkCol = '#08090C';
    const lightCol = '#FAF8F5';
    // Never leak `#FF9EBB` sakura pink or a 3rd foreign chromatic hue on transition rims
    const rimCol = (!duoIn.fg || duoIn.fg.toUpperCase() === '#FF9EBB')
      ? (core.colorLuminance01(duoIn.bg) > 0.5 ? darkCol : lightCol)
      : duoIn.fg;

    const drawBuf = (buf, dx = 0, dy = 0, dw = W, dh = H) => {
      ctx.drawImage(buf, 0, 0, buf.width, buf.height, dx, dy, dw, dh);
    };

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;

    if (mode === 'apertureLensMatch' || mode === 'irisOpenUnveil' || mode === 'irisApertureDive') {
      // V8.9.1 100%-Opaque Coaxial Lens/Iris Aperture Match-Cut (zero semi-transparent ghosting!)
      const e = ease.inCubic(u);
      const zOut = mode === 'irisOpenUnveil' ? (1 + 1.55 * u * u) : (1 + 1.35 * u * u);
      const zIn = mode === 'irisOpenUnveil' ? core.lerp(0.84, 1.0, e) : core.lerp(0.76, 1.0, e);
      const rad = core.lerp(mode === 'irisOpenUnveil' ? 84 : 44, 1340, e);

      drawBuf(a, W * 0.5 * (1 - zOut), H * 0.5 * (1 - zOut), W * zOut, H * zOut);
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.beginPath();
      ctx.arc(W * 0.5, H * 0.5, rad, 0, Math.PI * 2);
      ctx.clip();
      drawBuf(b, W * 0.5 * (1 - zIn), H * 0.5 * (1 - zIn), W * zIn, H * zIn);
      ctx.restore();

      if (u > 0.02 && u < 0.95) {
        const prevRaw = ctx.__v6RawColor;
        ctx.__v6RawColor = true;
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 5.0;
        ctx.beginPath();
        ctx.arc(W * 0.5, H * 0.5, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#EAF6FF';
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.__v6RawColor = prevRaw;
      }
    } else if (mode === 'zeroPortalDive') {
      // V8.9.1 Coaxial 100%-Opaque Zero-Oval Dive (W*0.50, H*0.52) matching P01 '0' -> P02 M1 Tunnel!
      const cx = W * 0.50;
      const cy = H * 0.52;
      const e = ease.inCubic(u);
      const zOut = 1 + 2.6 * u * u;
      const zIn = core.lerp(0.74, 1.0, e);
      const rx = core.lerp(42, 1560, e);
      const ry = core.lerp(72, 2420, e);

      drawBuf(a, cx * (1 - zOut), cy * (1 - zOut), W * zOut, H * zOut);
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();
      drawBuf(b, W * 0.5 * (1 - zIn), H * 0.5 * (1 - zIn), W * zIn, H * zIn);
      ctx.restore();

      if (u > 0.02 && u < 0.96) {
        const prevRaw = ctx.__v6RawColor;
        ctx.__v6RawColor = true;
        ctx.strokeStyle = '#7EC4EC';
        ctx.lineWidth = 6.0;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#FAF8F5';
        ctx.lineWidth = 2.0;
        ctx.stroke();
        ctx.__v6RawColor = prevRaw;
      }
    } else if (mode === 'zeroHoleExpand') {
      const e = ease.inOutExpo(u);
      const z = 1 + 1.45 * ease.inExpo(u);
      drawBuf(a, W * 0.5 * (1 - z), H * 0.5 * (1 - z), W * z, H * z);

      const ry = Math.max(8, e * 1420);
      const rx = ry * 0.64;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(W * 0.5, H * 0.5, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u > 0.02 && u < 0.96) {
        ctx.strokeStyle = rimCol;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.ellipse(W * 0.5, H * 0.5, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (mode === 'pupilCircleExpand') {
      drawBuf(a);
      const e = ease.outExpo(u);
      const r = e * 1180;
      ctx.save();
      ctx.beginPath();
      ctx.arc(W * 0.5, H * 0.5, r, 0, Math.PI * 2);
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u < 0.95) {
        ctx.strokeStyle = rimCol;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(W * 0.5, H * 0.5, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (mode === 'pulseRingClip') {
      drawBuf(a);
      const e = ease.outExpo(u);
      const rMain = e * 1200;
      const rPre = Math.min(1320, rMain + 84 * (1 - u));
      ctx.save();
      ctx.beginPath();
      ctx.arc(W * 0.5, H * 0.54, rMain, 0, Math.PI * 2);
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u < 0.94) {
        ctx.strokeStyle = rimCol;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(W * 0.5, H * 0.54, rMain, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(W * 0.5, H * 0.54, rPre, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (mode === 'whipShutterH') {
      const e = ease.outExpo(u);
      const splitX = Math.round((1 - e) * W);
      drawBuf(a, -Math.round(e * W), 0, W, H);
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, W - splitX + 2, H);
      ctx.clip();
      drawBuf(b, splitX, 0, W, H);
      ctx.restore();

      if (u > 0.02 && u < 0.96) {
        const bands = 18;
        const bh = H / bands;
        for (let i = 0; i < bands; i++) {
          const toothW = (i % 2 === 0 ? 48 : 22) * (1 - u);
          ctx.fillStyle = i % 2 === 0 ? lightCol : darkCol;
          ctx.fillRect(splitX - toothW, Math.round(i * bh), toothW * 2, Math.ceil(bh));
        }
      }
    } else if (mode === 'rulerDiagWipe') {
      drawBuf(a);
      const e = ease.outExpo(u);
      const skew = 340;
      const xEdge = -skew + e * (W + skew * 2);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-skew, 0);
      ctx.lineTo(xEdge, 0);
      ctx.lineTo(xEdge - skew, H);
      ctx.lineTo(-skew, H);
      ctx.closePath();
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u > 0.01 && u < 0.98) {
        ctx.save();
        ctx.strokeStyle = core.colorLuminance01(duoIn.bg) > 0.5 ? darkCol : lightCol;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(xEdge, -10);
        ctx.lineTo(xEdge - skew, H + 10);
        ctx.stroke();
        ctx.lineWidth = 2;
        for (let k = 0; k <= 24; k++) {
          const kf = k / 24;
          const px = xEdge - skew * kf;
          const py = H * kf;
          const tickL = k % 4 === 0 ? 22 : 11;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - tickL, py - tickL * 0.3);
          ctx.stroke();
        }
        ctx.restore();
      }
    } else if (mode === 'origamiWingSlash') {
      drawBuf(a);
      const e = ease.outExpo(u);
      const tipX = -240 + e * (W + 1100);
      const spread = 120 + e * 1450;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-300, H * 0.5 - spread);
      ctx.lineTo(tipX, H * 0.5);
      ctx.lineTo(-300, H * 0.5 + spread);
      ctx.closePath();
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u < 0.96) {
        ctx.strokeStyle = rimCol;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(-300, H * 0.5 - spread);
        ctx.lineTo(tipX, H * 0.5);
        ctx.lineTo(-300, H * 0.5 + spread);
        ctx.stroke();
      }
    } else if (mode === 'iris12Blade') {
      drawBuf(a);
      const e = ease.outExpo(u);
      const r = Math.max(4, e * 1240);
      const rot = (1 - e) * 0.72;
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const ang = rot + (i / 12) * Math.PI * 2;
        const rad = i % 2 === 0 ? r : r * 0.92;
        const px = W * 0.5 + Math.cos(ang) * rad;
        const py = H * 0.5 + Math.sin(ang) * rad;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u < 0.95) {
        ctx.strokeStyle = rimCol;
        ctx.lineWidth = 5;
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
          const ang = rot + (i / 12) * Math.PI * 2;
          const rad = i % 2 === 0 ? r : r * 0.92;
          const px = W * 0.5 + Math.cos(ang) * rad;
          const py = H * 0.5 + Math.sin(ang) * rad;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    } else if (mode === 'crossingLampSnap') {
      drawBuf(a);
      const e = ease.outExpo(u);
      const r = Math.round((e * 1080) / 4) * 4;
      ctx.save();
      ctx.beginPath();
      ctx.arc(520, 540, r, 0, Math.PI * 2);
      ctx.moveTo(1400 + r, 540);
      ctx.arc(1400, 540, r, 0, Math.PI * 2);
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u < 0.94) {
        ctx.strokeStyle = lightCol;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(520, 540, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(1400, 540, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (mode === 'sakuraWallSweep') {
      drawBuf(a);
      const e = ease.outExpo(u);
      const leadX = W + 220 - e * (W + 460);
      const notches = 9;
      const segH = H / notches;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(W + 260, 0);
      ctx.lineTo(leadX, 0);
      for (let i = 0; i < notches; i++) {
        const y0 = i * segH;
        const yMid = y0 + segH * 0.5;
        const y1 = y0 + segH;
        const jut = i % 2 === 0 ? -96 : -44;
        ctx.lineTo(leadX + jut, yMid);
        ctx.lineTo(leadX, y1);
      }
      ctx.lineTo(W + 260, H);
      ctx.closePath();
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u > 0.01 && u < 0.97) {
        ctx.fillStyle = lightCol;
        ctx.beginPath();
        ctx.moveTo(leadX + 26, 0);
        for (let i = 0; i < notches; i++) {
          const y0 = i * segH, yMid = y0 + segH * 0.5, y1 = y0 + segH;
          const jut = i % 2 === 0 ? -96 : -44;
          ctx.lineTo(leadX + jut, yMid);
          ctx.lineTo(leadX, y1);
        }
        for (let i = notches - 1; i >= 0; i--) {
          const y0 = i * segH, yMid = y0 + segH * 0.5;
          const jut = i % 2 === 0 ? -96 : -44;
          ctx.lineTo(leadX + jut + 28, yMid);
          ctx.lineTo(leadX + 28, y0);
        }
        ctx.closePath();
        ctx.fill();
      }
    } else if (mode === 'kanjiApertureDive') {
      const e = ease.inOutExpo(u);
      const z = 1 + 1.6 * ease.inExpo(u);
      drawBuf(a, W * 0.5 * (1 - z), H * 0.5 * (1 - z), W * z, H * z);

      const hw = 42 + e * 1060;
      const hh = 26 + e * 620;
      ctx.save();
      ctx.beginPath();
      ctx.rect(W * 0.5 - hw, H * 0.5 - hh, hw * 2, hh * 2);
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u < 0.96) {
        ctx.strokeStyle = rimCol;
        ctx.lineWidth = 8;
        ctx.strokeRect(W * 0.5 - hw, H * 0.5 - hh, hw * 2, hh * 2);
      }
    } else if (mode === 'hydraulicGuillotine') {
      drawBuf(a);
      const e = ease.outExpo(u);
      const jawW = Math.ceil(e * (W * 0.5 + 4));
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, jawW, H);
      ctx.rect(W - jawW, 0, jawW, H);
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u < 0.97) {
        ctx.fillStyle = lightCol;
        ctx.fillRect(jawW - 6, 0, 6, H);
        ctx.fillRect(W - jawW, 0, 6, H);
      }
    } else if (mode === 'stampGuillotineSlam') {
      drawBuf(a);
      const e = ease.outExpo(u);
      const dropY = (1 - e) * -H;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, Math.max(0, H + dropY));
      ctx.clip();
      drawBuf(b, 0, dropY, W, H);
      ctx.restore();

      if (u < 0.97) {
        const edgeY = H + dropY;
        ctx.fillStyle = darkCol;
        ctx.fillRect(0, edgeY - 10, W, 10);
      }
    } else if (mode === 'burnRiftHard') {
      drawBuf(a);
      const e = ease.inOutExpo(u);
      const maxR = Math.hypot(W, H) * 0.66 * e;
      ctx.save();
      ctx.beginPath();
      const N = 36;
      for (let s = 0; s <= N; s++) {
        const ang = (s / N) * Math.PI * 2;
        const jag = 1 + 0.22 * Math.sin(ang * 7 + 1.1) + 0.11 * Math.cos(ang * 13 - 2.4);
        const rx = W * 0.5 + Math.cos(ang) * maxR * jag * 1.22;
        const ry = H * 0.52 + Math.sin(ang) * maxR * jag * 0.88;
        if (s === 0) ctx.moveTo(rx, ry); else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.lineWidth = 14 * (1 - e * 0.5);
      ctx.strokeStyle = darkCol;
      ctx.stroke();
      ctx.clip();
      drawBuf(b);
      ctx.restore();
    } else if (mode === 'cursorBlockSwallow') {
      drawBuf(a);
      const e = ease.inOutExpo(u);
      const cw = 36 + e * (W + 40);
      const ch = 68 + e * (H + 40);
      const x0 = W * 0.5 - cw * 0.5;
      const y0 = H * 0.5 - ch * 0.5;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, y0, cw, ch);
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u < 0.96) {
        ctx.strokeStyle = rimCol;
        ctx.lineWidth = 6;
        ctx.strokeRect(x0, y0, cw, ch);
      }
    } else if (mode === 'whitePolaritySlash') {
      drawBuf(a);
      const e = ease.outExpo(u);
      const rad = e * (W + H);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(W * 0.5, H * 0.5 - rad);
      ctx.lineTo(W * 0.5 + rad, H * 0.5);
      ctx.lineTo(W * 0.5, H * 0.5 + rad);
      ctx.lineTo(W * 0.5 - rad, H * 0.5);
      ctx.closePath();
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u < 0.94) {
        ctx.strokeStyle = lightCol;
        ctx.lineWidth = 12 * (1 - u);
        ctx.beginPath();
        ctx.moveTo(W * 0.5, H * 0.5 - rad);
        ctx.lineTo(W * 0.5 + rad, H * 0.5);
        ctx.lineTo(W * 0.5, H * 0.5 + rad);
        ctx.lineTo(W * 0.5 - rad, H * 0.5);
        ctx.closePath();
        ctx.stroke();
      }
    } else if (mode === 'verticalShutterChop') {
      const e = ease.outExpo(u);
      const cutY = Math.round(e * H);
      drawBuf(a, 0, cutY, W, H);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, cutY);
      ctx.clip();
      drawBuf(b, 0, cutY - H, W, H);
      ctx.restore();

      if (u > 0.01 && u < 0.98) {
        ctx.fillStyle = darkCol;
        ctx.fillRect(0, cutY - 4, W, 8);
      }
    } else if (mode === 'gateBarSweep') {
      drawBuf(a);
      const e = ease.outExpo(u);
      const ang = 0.04 - e * (0.04 + Math.PI * 0.5);
      const px = -80, py = H + 80;
      const len = 3600;
      const dx = Math.cos(ang) * len;
      const dy = Math.sin(ang) * len;
      const nx = -Math.sin(ang) * 3600;
      const ny = Math.cos(ang) * 3600;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + dx, py + dy);
      ctx.lineTo(px + dx + nx, py + dy + ny);
      ctx.lineTo(px + nx, py + ny);
      ctx.closePath();
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u > 0.01 && u < 0.97) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(ang);
        const barH = 22;
        for (let k = 0; k < 46; k++) {
          ctx.fillStyle = k % 2 === 0 ? '#101322' : lightCol;
          ctx.fillRect(k * 76, -barH * 0.5, 76, barH);
        }
        ctx.restore();
      }
    } else if (mode === 'crossStarGate') {
      // 4-Point Cross Star Gate expanding from center (`#35`十字星芒门)
      drawBuf(a);
      const e = ease.outExpo(u);
      const arm = Math.max(12, e * 2200);
      const waist = Math.max(6, e * 1120);
      const cx = W * 0.5, cy = H * 0.5;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy - arm);
      ctx.lineTo(cx + waist, cy - waist);
      ctx.lineTo(cx + arm, cy);
      ctx.lineTo(cx + waist, cy + waist);
      ctx.lineTo(cx, cy + arm);
      ctx.lineTo(cx - waist, cy + waist);
      ctx.lineTo(cx - arm, cy);
      ctx.lineTo(cx - waist, cy - waist);
      ctx.closePath();
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u < 0.95) {
        ctx.strokeStyle = rimCol;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx, cy - arm);
        ctx.lineTo(cx + waist, cy - waist);
        ctx.lineTo(cx + arm, cy);
        ctx.lineTo(cx + waist, cy + waist);
        ctx.lineTo(cx, cy + arm);
        ctx.lineTo(cx - waist, cy + waist);
        ctx.lineTo(cx - arm, cy);
        ctx.lineTo(cx - waist, cy - waist);
        ctx.closePath();
        ctx.stroke();
      }
    } else if (mode === 'venetianSlatsDiag') {
      // 8 Angled Louver Shutter Slats snapping open simultaneously (`#35`百叶快门)
      drawBuf(a);
      const e = ease.outExpo(u);
      const slats = 8;
      const skew = 220;
      const span = W + skew * 2;
      const bandW = span / slats;
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < slats; i++) {
        const xBase = -skew + i * bandW;
        const wOpen = bandW * Math.min(1.02, e * 1.04);
        ctx.moveTo(xBase, 0);
        ctx.lineTo(xBase + wOpen, 0);
        ctx.lineTo(xBase + wOpen - skew, H);
        ctx.lineTo(xBase - skew, H);
        ctx.closePath();
      }
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u > 0.02 && u < 0.94) {
        ctx.strokeStyle = rimCol;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < slats; i++) {
          const xLead = -skew + i * bandW + bandW * e;
          ctx.moveTo(xLead, 0);
          ctx.lineTo(xLead - skew, H);
        }
        ctx.stroke();
      }
    } else if (mode === 'katanaDiagCleave') {
      // Diagonal Katana Slash splitting outgoing frame apart along a razor line (`#35`斜刃劈切)
      drawBuf(b);
      const e = ease.inOutExpo(u);
      const sep = e * 1360;
      const shX = -0.49 * sep;
      const shY = -0.87 * sep;

      // Upper-left half of `a` slides strictly up-left `(shX, shY)`
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-400 + shX, -400 + shY);
      ctx.lineTo(W + 400 + shX, -400 + shY);
      ctx.lineTo(W + 220 + shX, -80 + shY);
      ctx.lineTo(-220 + shX, H + 80 + shY);
      ctx.lineTo(-400 + shX, H + 80 + shY);
      ctx.closePath();
      ctx.clip();
      drawBuf(a, shX, shY, W, H);
      ctx.restore();

      // Lower-right half of `a` slides strictly down-right `(-shX, -shY)`
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(W + 400 - shX, H + 400 - shY);
      ctx.lineTo(-400 - shX, H + 400 - shY);
      ctx.lineTo(-220 - shX, H + 80 - shY);
      ctx.lineTo(W + 220 - shX, -80 - shY);
      ctx.lineTo(W + 400 - shX, -80 - shY);
      ctx.closePath();
      ctx.clip();
      drawBuf(a, -shX, -shY, W, H);
      ctx.restore();

      if (u < 0.28) {
        ctx.strokeStyle = lightCol;
        ctx.lineWidth = 10 * (1 - u / 0.28);
        ctx.beginPath();
        ctx.moveTo(W + 180, -40);
        ctx.lineTo(-180, H + 40);
        ctx.stroke();
      }
    } else if (mode === 'seraphHexAperture') {
      // 6-Wing Hexagonal Astrolabe Aperture (`#35`六翼星芒光圈)
      drawBuf(a);
      const e = ease.outExpo(u);
      const rOuter = Math.max(8, e * 1480);
      const rInner = rOuter * 0.58;
      const rot = (1 - e) * 0.52;
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const ang = rot + (i / 12) * Math.PI * 2;
        const rad = i % 2 === 0 ? rOuter : rInner;
        const px = W * 0.5 + Math.cos(ang) * rad;
        const py = H * 0.5 + Math.sin(ang) * rad;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.clip();
      drawBuf(b);
      ctx.restore();

      if (u < 0.95) {
        ctx.strokeStyle = rimCol;
        ctx.lineWidth = 5;
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
          const ang = rot + (i / 12) * Math.PI * 2;
          const rad = i % 2 === 0 ? rOuter : rInner;
          const px = W * 0.5 + Math.cos(ang) * rad;
          const py = H * 0.5 + Math.sin(ang) * rad;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    } else {
      if (u < 0.5) drawBuf(a); else drawBuf(b);
    }

    ctx.restore();
    return rimCol;
  }

  class CortexPlateTimeline {
    constructor(opts = {}) {
      this.plates = PLATE_SPECS;
      this._activeStack = new Set();
      const q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : null;
      this.onlyFilter = opts.only || (q && q.get('only')) || null;
      this.onlySet = this.onlyFilter
        ? new Set(this.onlyFilter.split(',').map((s) => s.trim()).filter(Boolean))
        : null;
      window.__cortexActiveTimeline = this;
    }

    resolveEffectiveId(specOrId) {
      if (!specOrId) return 'P01_fog_boot';
      const id = typeof specOrId === 'string' ? specOrId : specOrId.id;
      const impl = REGISTRY.get(id);
      if (impl && typeof impl.render === 'function') return id;
      const fb = (typeof specOrId === 'object' && specOrId.fallbackId)
        ? specOrId.fallbackId
        : (this._resolveSpec(id) && this._resolveSpec(id).fallbackId) || null;
      if (fb && REGISTRY.has(fb)) return fb;
      return id;
    }

    _resolveSpec(idOrNum, atTime = null) {
      if (!idOrNum) return null;
      if (atTime !== null) {
        const hit = this.plates.find((p) => (p.id === idOrNum || p.num === idOrNum) && atTime >= p.t0 && atTime < p.t1);
        if (hit) return hit;
      }
      let spec = this.plates.find((p) => p.id === idOrNum || p.num === idOrNum);
      if (!spec) {
        const m = String(idOrNum).match(/^P?(\d{1,2})/i);
        if (m) {
          const num = String(Number(m[1])).padStart(2, '0');
          spec = this.plates.find((p) => p.num === num);
        }
      }
      if (!spec && HOST_WINDOWS[idOrNum]) {
        const hw = HOST_WINDOWS[idOrNum];
        return { id: idOrNum, fallbackId: null, num: hw.num, t0: hw.t0, t1: hw.t1, hostT0: hw.t0, hostT1: hw.t1, title: hw.title, temp: hw.temp };
      }
      return spec || null;
    }

    findPlateIndex(t) {
      const tc = Math.max(0, Math.min(281.60, t));
      for (let i = 0; i < this.plates.length; i++) {
        const p = this.plates[i];
        if (tc >= p.t0 && tc < p.t1) return i;
      }
      return this.plates.length - 1;
    }

    findPlate(t) {
      return this.plates[this.findPlateIndex(t)];
    }

    renderPlateById(idOrShort, ctx, state, W_arg = LOGIC_W, H_arg = LOGIC_H, customLocalP = null, segOverride = null) {
      const baseSpec = segOverride || this._resolveSpec(idOrShort, state.t);
      const effectiveId = this.resolveEffectiveId(baseSpec || idOrShort);
      const hostMeta = HOST_WINDOWS[effectiveId] || (baseSpec ? { num: baseSpec.num, t0: baseSpec.t0, t1: baseSpec.t1, title: baseSpec.title, temp: baseSpec.temp } : null);

      if (this._activeStack.has(effectiveId)) {
        return { bloom: 0, ca: 0 };
      }

      const impl = REGISTRY.get(effectiveId);
      const core = window.CortexPDoomCore;
      const physW = (ctx && ctx.canvas && ctx.canvas.width) ? ctx.canvas.width : W_arg;
      const physH = (ctx && ctx.canvas && ctx.canvas.height) ? ctx.canvas.height : H_arg;
      const sx = physW / LOGIC_W;
      const sy = physH / LOGIC_H;

      hookContextForScale(ctx);

      if (!hostMeta || !impl || typeof impl.render !== 'function') {
        ctx.save();
        ctx.__cortexRawSetTransform(sx, 0, 0, sy, 0, 0);
        ctx.fillStyle = '#08090C';
        ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
        ctx.fillStyle = '#FF2E55';
        ctx.font = '700 42px "JetBrains Mono", monospace';
        ctx.fillText(`[MISSING PLATE MODULE: ${effectiveId}]`, 96, LOGIC_H * 0.5);
        ctx.restore();
        return { bloom: 0, ca: 0 };
      }

      const t0 = hostMeta.t0;
      const t1 = hostMeta.t1;
      const lt = Math.max(0, state.t - t0);
      const dur = Math.max(0.01, t1 - t0);
      const p = customLocalP !== null ? customLocalP : Math.max(0, Math.min(1, lt / dur));

      const segT0 = baseSpec ? baseSpec.t0 : t0;
      const segT1 = baseSpec ? baseSpec.t1 : t1;
      const segLt = Math.max(0, state.t - segT0);
      const segDur = Math.max(0.01, segT1 - segT0);
      const segP = Math.max(0, Math.min(1, segLt / segDur));

      const plateFrame = {
        ...state,
        plate: baseSpec || hostMeta,
        plateId: effectiveId,
        plateNum: hostMeta.num,
        t0,
        t1,
        lt,
        dur,
        p,
        segT0,
        segT1,
        segLt,
        segDur,
        segP,
        W: LOGIC_W,
        H: LOGIC_H,
        physW,
        physH,
        renderScale: sx,
        timeline: this
      };

      const prevRenderTime = core ? core.currentRenderTime : 0;
      const prevSx = ctx.__cortexScaleX;
      const prevSy = ctx.__cortexScaleY;
      if (core) core.currentRenderTime = state.t;

      const v6 = window.CortexV6;
      const prevV6Theme = v6 ? v6.getActiveTheme() : null;
      if (v6 && typeof v6.setActivePlate === 'function') {
        v6.setActivePlate(effectiveId, state.t);
      }

      const depthBefore = ctx.__cortexSaveDepth;
      this._activeStack.add(effectiveId);
      ctx.save();
      ctx.__cortexScaleX = sx;
      ctx.__cortexScaleY = sy;
      ctx.__cortexRawSetTransform(sx, 0, 0, sy, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;

      // Guarantee 100% opaque base fill on `{ alpha: true }` canvases so rotated cameras never leak stale pixels!
      ctx.fillStyle = core ? core.getPlateDuotone(effectiveId).bg : '#08090C';
      ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);

      let post = null;
      try {
        if (RENDER_SIG_T_FIRST.get(effectiveId)) {
          post = impl.render(ctx, state.t, plateFrame, core) || {};
        } else {
          post = impl.render(ctx, plateFrame, core) || {};
        }
        // V6 Studio Depth Overlay on non-pixel, non-loop-lock plates (eliminates flat MS-Paint canvas feel!)
        if (
          v6 &&
          typeof v6.drawStudioDepthOverlay === 'function' &&
          !post.isPixel &&
          state.t >= 0.08 &&
          state.t <= 281.48
        ) {
          ctx.save();
          ctx.__cortexRawSetTransform(sx, 0, 0, sy, 0, 0);
          v6.drawStudioDepthOverlay(ctx, !!post.isPaper, state.kickPulse || state.kick || 0);
          ctx.restore();
        }
      } catch (err) {
        while (ctx.__cortexSaveDepth > depthBefore + 1) {
          ctx.restore();
        }
        ctx.__cortexRawSetTransform(sx, 0, 0, sy, 0, 0);
        console.error(`[SCENE ERROR in ${effectiveId} @ t=${state.t.toFixed(2)}s]`, err);
        ctx.fillStyle = '#08090C';
        ctx.fillRect(0, 0, LOGIC_W, LOGIC_H);
        ctx.fillStyle = '#FF2E55';
        ctx.font = '700 28px monospace';
        ctx.fillText(`SCENE ERROR [${effectiveId}]: ${err && err.message ? err.message : String(err)}`, 80, 120);
        post = { bloom: 0, ca: 0 };
      } finally {
        this._activeStack.delete(effectiveId);
        while (ctx.__cortexSaveDepth > depthBefore) {
          ctx.restore();
        }
        ctx.__cortexScaleX = prevSx;
        ctx.__cortexScaleY = prevSy;
        ctx.__cortexRawSetTransform(prevSx || 1, 0, 0, prevSy || 1, 0, 0);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;
        if (core) core.currentRenderTime = prevRenderTime;
        if (v6 && prevV6Theme && v6.setActivePlate && state.t >= 0) {
          // leave current plate theme active for subtitle rendering right after renderPlateById
        }
      }
      return post;
    }

    _resolveSubtitleDuotone(core, plateId, postOpts) {
      if (postOpts && postOpts.duotone && postOpts.duotone.bg && postOpts.duotone.fg) {
        return postOpts.duotone;
      }
      if (postOpts && postOpts.bg && postOpts.fg) {
        return { bg: postOpts.bg, fg: postOpts.fg };
      }
      const base = core.getPlateDuotone(plateId, postOpts && postOpts.duotoneSub);
      if (postOpts && typeof postOpts.isPaper === 'boolean') {
        const baseIsLight = core.colorLuminance01(base.bg) > 0.5;
        if (postOpts.isPaper && !baseIsLight) {
          return core.getPlateDuotone(plateId, 'paper').bg !== base.bg
            ? core.getPlateDuotone(plateId, 'paper')
            : { bg: '#FAF8F5', fg: '#08090C' };
        }
        if (!postOpts.isPaper && baseIsLight) {
          return { bg: '#08090C', fg: base.bg };
        }
      }
      return base;
    }

    render(ctx, state, W_arg = LOGIC_W, H_arg = LOGIC_H) {
      const core = window.CortexPDoomCore;
      if (core) core.currentRenderTime = state.t;

      const physW = (ctx && ctx.canvas && ctx.canvas.width) ? ctx.canvas.width : W_arg;
      const physH = (ctx && ctx.canvas && ctx.canvas.height) ? ctx.canvas.height : H_arg;
      const sx = physW / LOGIC_W;
      const sy = physH / LOGIC_H;

      hookContextForScale(ctx);

      const idx = this.findPlateIndex(state.t);
      const active = this.plates[idx];
      const effActive = this.resolveEffectiveId(active);

      if (
        this.onlySet &&
        !this.onlySet.has(active.id) &&
        !this.onlySet.has(active.num) &&
        !this.onlySet.has(effActive)
      ) {
        ctx.save();
        ctx.__cortexRawSetTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#08090C';
        ctx.fillRect(0, 0, physW, physH);
        ctx.restore();
        return { bloom: 0, ca: 0 };
      }

      let postOut = null;
      let subPlateId = effActive;

      // Check all 42 hard-edge geometric `clip()` dual-scene transitions (#52: preserve native cross-hue collision!)
      const next = idx + 1 < this.plates.length ? this.plates[idx + 1] : null;
      if (next && !this.onlySet) {
        const effNext = this.resolveEffectiveId(next);
        const tr = active.trOut || CROSS_TRANSITIONS[`${effActive}->${effNext}`];
        if (tr && effActive !== effNext && state.t >= active.t1 - tr.dur) {
          const u = core.clamp((state.t - (active.t1 - tr.dur)) / tr.dur, 0, 1);
          const { a, b } = ensureBuffers(physW, physH);
          const ctxA = a.getContext('2d', { alpha: true });
          const ctxB = b.getContext('2d', { alpha: true });

          const postA = this.renderPlateById(effActive, ctxA, state, physW, physH, null, active);
          const nextState = { ...state, t: Math.max(next.t0 + 0.008, state.t) };
          const postB = this.renderPlateById(effNext, ctxB, nextState, physW, physH, null, next);

          ctx.save();
          ctx.__cortexScaleX = sx;
          ctx.__cortexScaleY = sy;
          ctx.__cortexRawSetTransform(sx, 0, 0, sy, 0, 0);
          renderDualShotTransition(ctx, a, b, tr.mode, u, core, effActive, effNext);
          ctx.restore();
          ctx.__cortexScaleX = 1;
          ctx.__cortexScaleY = 1;
          ctx.__cortexRawSetTransform(1, 0, 0, 1, 0, 0);

          postOut = u < 0.5 ? postA : postB;
          subPlateId = u < 0.5 ? effActive : effNext;
        }
      }

      if (!postOut) {
        postOut = this.renderPlateById(effActive, ctx, state, physW, physH, null, active);
      }

      // Global Single-Point Bottom Chinese Subtitle (#27 + #52 Mandate)
      // Skips standby loop-closure window (`t < 0.08` & `t > 281.48`) so Frame 0 & Frame 16895 keep RMS = 0.000!
      if (
        state.t >= 0.08 &&
        state.t <= 281.48 &&
        window.CortexTypo &&
        typeof window.CortexTypo.drawBottomZhSubtitle === 'function'
      ) {
        if (window.CortexV6 && typeof window.CortexV6.setActivePlate === 'function') {
          window.CortexV6.setActivePlate(subPlateId, state.t);
        }
        const duotone = this._resolveSubtitleDuotone(core, subPlateId, postOut);
        ctx.save();
        ctx.__cortexScaleX = sx;
        ctx.__cortexScaleY = sy;
        ctx.__cortexRawSetTransform(sx, 0, 0, sy, 0, 0);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;
        try {
          window.CortexTypo.drawBottomZhSubtitle(ctx, state.t, subPlateId, duotone);
        } catch (subErr) {
          console.error('[SUBTITLE ERROR]', subErr);
        } finally {
          ctx.restore();
          ctx.__cortexScaleX = 1;
          ctx.__cortexScaleY = 1;
          ctx.__cortexRawSetTransform(1, 0, 0, 1, 0, 0);
        }
      }

      return { ...postOut, ca: 0 };
    }
  }

  window.CORTEX_HOST_WINDOWS = HOST_WINDOWS;
  window.CORTEX_PLATE_SPECS = PLATE_SPECS;
  window.CORTEX_CROSS_TRANSITIONS = CROSS_TRANSITIONS;
  window.CortexPlateTimeline = CortexPlateTimeline;
})();
