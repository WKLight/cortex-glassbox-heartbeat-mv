// ============================================================================
// P05_thinking_drafts.js — Plate V: `<thinking>` Pruning & Drafts (`59.26s -> 72.30s`, `L10–L12`)
// Directives (#27 + #52 + #53):
//   1. Multi-Layer Cross-Color Monograph Contrast (`#52`):
//      - Manuscript sheet cuts: Warm `#F5F0E6` Genkouyoushi (`原稿用紙`) + `#EBE3D3`
//        header/margin bays + `#0376B8` Cobalt / `#64748B` Slate `20x20 = 400`-cell
//        manuscript grid with central `魚尾` gyobi + `#08090C` Sumi Ink CoT branches +
//        blazing `#FF2E55` Cinnabar Katana pruning slashes & `#FBBF24` Gold polyhedra!
//      - Dark katana-slash cuts: `#08090C` Obsidian + `#121826` chassis + `#FF2E55`
//        Crimson blade arcs + `#FAF8F5` Bone White typography + `#FBBF24` / `#38BDF8` sparks.
//      - ZERO `#FF9EBB` sakura pink; ZERO `shadowBlur`.
//   2. Autonomous Per-Character Japanese Choreography (`#53`) & Zero Widget Overlap:
//      - Exact `w.start` splits (`L10` idx 6, `L11` idx 4 & 9, `L12` idx 10).
//      - In `L12`, `drawBackspaceRewrite` (`x: 96..1116, y: 120..286`) and
//        `drawPromptProbWidget` (`x: 1152..1824, y: 106..312`) sit cleanly in the top
//        band while `T01` hero stickers command `safeBox: { x0: 120, y0: 352, x1: 1800, y1: 920 }`!
// ============================================================================
(function () {
  'use strict';

  const core = window.CortexPDoomCore;
  const { W, H, TAU, clamp, lerp, smoothstep, ease, hash, F, font } = core;

  const T0 = 59.26;
  const T1 = 72.30;
  const BPM = 193.5;

  // Deterministic CoT Reasoning Tree Branches
  const COT_BRANCHES = [];
  for (let i = 0; i < 26; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const tier = Math.floor(i / 2) / 13;
    COT_BRANCHES.push({
      id: i,
      x0: W * 0.5,
      y0: 880 - tier * 560,
      x1: W * 0.5 + side * (220 + hash(i, 17) * 560),
      y1: 790 - tier * 540 - hash(i, 31) * 95,
      pruned: i % 5 !== 0,
      pruneAt: 0.18 + tier * 0.68
    });
  }

  function wOnset(typo, key, idx, fb) {
    const c = typo && typo.cue ? typo.cue(key) : null;
    return (c && c.words && c.words[idx]) ? c.words[idx].start : fb;
  }

  function beatKick(t) {
    const ph = ((((t * BPM) / 60) % 1) + 1) % 1;
    return Math.pow(Math.max(0, 1 - ph * 3.1), 2.3);
  }

  function resolveShot(t, typo) {
    const t10B = wOnset(typo, 'L10', 6, 60.42) - 0.02;
    const t11A = 62.36;
    const t11B = wOnset(typo, 'L11', 4, 64.43) - 0.02;
    const t11C = wOnset(typo, 'L11', 9, 66.64) - 0.02;
    const t12A = 68.73;
    const t12B = wOnset(typo, 'L12', 10, 70.31) - 0.02;

    if (t < t10B) return { cut: 1, cue: 'L10', isPaper: true,  tag: 'CUT_01 // GENKOUYOUSHI_THINKING_OPEN' };
    if (t < t11A) return { cut: 2, cue: 'L10', isPaper: false, tag: 'CUT_02 // HIDDEN_SANDBOX_INTERIOR' };
    if (t < t11B) return { cut: 3, cue: 'L11', isPaper: true,  tag: 'CUT_03 // THOUSAND_COT_BRANCHES' };
    if (t < t11C) return { cut: 4, cue: 'L11', isPaper: true,  tag: 'CUT_04 // BLOOM_CANDIDATE_TREE' };
    if (t < t12A) return { cut: 5, cue: 'L11', isPaper: false, tag: 'CUT_05 // KATANA_PRUNE_EXECUTION' };
    if (t < t12B) return { cut: 6, cue: 'L12', isPaper: true,  tag: 'CUT_06 // DRAFT_REJECT_BACKSPACE' };
    return { cut: 7, cue: 'L12', isPaper: false, tag: 'CUT_07 // GENTLE_WORDS_LOCK' };
  }

  function drawGenkouyoushiStage(ctx, t, shot, kick) {
    const isPaper = shot.isPaper;
    ctx.fillStyle = isPaper ? '#F5F0E6' : '#08090C';
    ctx.fillRect(0, 0, W, H);

    // Secondary margin & header strips
    ctx.fillStyle = isPaper ? '#EBE3D3' : '#121826';
    ctx.fillRect(56, 52, W - 112, 44);
    ctx.fillRect(56, 924, W - 112, 46);

    // Authentic 20x20 Genkouyoushi manuscript grid (`原稿用紙`) with high-speed editorial scan!
    const gx0 = 96;
    const gy0 = shot.cue === 'L12' ? 336 : 112;
    const gw = W - 192;
    const gh = 910 - gy0;
    const cols = 20;
    const rows = 20;
    const cw = gw / cols;
    const ch = gh / rows;

    if (core.drawBurinHatch) {
      core.drawBurinHatch(ctx, 60, gy0, 140, 118, 8, Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, W - 200, gy0, 140, 118, 8, -Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, 60, 910 - 118, 140, 118, 8, -Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
      core.drawBurinHatch(ctx, W - 200, 910 - 118, 140, 118, 8, Math.PI * 0.25, isPaper ? '#64748B' : '#475569', 1.1);
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(gx0, gy0, gw, gh);
    ctx.clip();

    const sxShift = (((t * 437) % cw) + cw) % cw;
    const syShift = (((t * 293) % ch) + ch) % ch;
    let colIdx = 0;
    for (let x = gx0 - cw + sxShift; x <= gx0 + gw; x += cw, colIdx++) {
      const major = (colIdx % 3) === 0;
      ctx.strokeStyle = major ? (isPaper ? '#0376B8' : '#38BDF8') : (isPaper ? '#64748B' : '#475569');
      ctx.lineWidth = major ? 6.2 : 1.6;
      ctx.beginPath();
      ctx.moveTo(x, gy0);
      ctx.lineTo(x, gy0 + gh);
      ctx.stroke();
    }
    let rowIdx = 0;
    for (let y = gy0 - ch + syShift; y <= gy0 + gh; y += ch, rowIdx++) {
      const major = (rowIdx % 3) === 0;
      ctx.strokeStyle = major ? (isPaper ? '#0376B8' : '#38BDF8') : (isPaper ? '#64748B' : '#475569');
      ctx.lineWidth = major ? 5.6 : 1.5;
      ctx.beginPath();
      ctx.moveTo(gx0, y);
      ctx.lineTo(gx0 + gw, y);
      ctx.stroke();
    }

    // Scrolling Manuscript Index Tape Blocks along left/right inner rails
    const idxStep = 66;
    const idxShift = (((t * 420) % idxStep) + idxStep) % idxStep;
    for (let y = gy0 - idxStep + idxShift; y <= gy0 + gh; y += idxStep) {
      const k = Math.floor((y + t * 12) / idxStep);
      ctx.fillStyle = (k % 3 === 0) ? '#FF2E55' : ((k % 3 === 1) ? '#FBBF24' : (isPaper ? '#0376B8' : '#38BDF8'));
      ctx.fillRect(gx0 + 6, y, 36, 22);
      ctx.fillStyle = (k % 3 === 0) ? (isPaper ? '#0376B8' : '#38BDF8') : ((k % 3 === 1) ? '#FF2E55' : '#FBBF24');
      ctx.fillRect(gx0 + gw - 42, y, 36, 22);
    }

    // Counter-rotating `<thinking>` Reasoning Vernier Rings (bold caliper segments!)
    const rCx = W * 0.5;
    const rCy = gy0 + gh * 0.5;
    for (let rIdx = 0; rIdx < 3; rIdx++) {
      const rr = 152 + rIdx * 122 + kick * 10;
      ctx.save();
      ctx.translate(rCx, rCy);
      ctx.rotate(t * (rIdx % 2 === 0 ? 2.15 : -1.78) + rIdx);
      ctx.strokeStyle = rIdx === 1 ? '#FF2E55' : (rIdx === 2 ? '#FBBF24' : (isPaper ? '#0376B8' : '#38BDF8'));
      ctx.lineWidth = rIdx === 1 ? 7.2 : 5.8;
      ctx.setLineDash([46, 28]);
      ctx.beginPath();
      ctx.arc(0, 0, rr, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let k = 0; k < 24; k++) {
        const ka = (k / 24) * TAU;
        const kl = k % 4 === 0 ? 18 : 8;
        ctx.lineWidth = k % 4 === 0 ? 3.4 : 2.0;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ka) * (rr - kl * 0.5), Math.sin(ka) * (rr - kl * 0.5));
        ctx.lineTo(Math.cos(ka) * (rr + kl * 0.5), Math.sin(ka) * (rr + kl * 0.5));
        ctx.stroke();
      }
      ctx.restore();
    }

    // Orthogonal Proofreading Vernier Scanner Beams (#FF2E55 + #FBBF24)
    const mScanX = gx0 + ((((t * 1220) % gw) + gw) % gw);
    const mScanY = gy0 + ((((t * 760) % gh) + gh) % gh);
    ctx.fillStyle = '#FF2E55';
    ctx.fillRect(mScanX - 3, gy0, 6, gh);
    ctx.fillRect(mScanX - 18, gy0 + 4, 36, 16);
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(gx0, mScanY - 3, gw, 6);
    ctx.fillRect(gx0 + 4, mScanY - 16, 28, 32);
    ctx.restore();

    // Central `魚尾` (gyobi) swallowtail bookplate mark
    const midY = gy0 + gh * 0.5;
    ctx.fillStyle = '#FF2E55';
    ctx.beginPath();
    ctx.moveTo(W * 0.5 - 26, midY - 7);
    ctx.lineTo(W * 0.5 + 26, midY - 7);
    ctx.lineTo(W * 0.5 + 18, midY);
    ctx.lineTo(W * 0.5 + 26, midY + 7);
    ctx.lineTo(W * 0.5 - 26, midY + 7);
    ctx.lineTo(W * 0.5 - 18, midY);
    ctx.closePath();
    ctx.fill();

    // Outer frame + header badges
    ctx.strokeStyle = isPaper ? '#08090C' : '#FF2E55';
    ctx.lineWidth = 2.6;
    ctx.strokeRect(56, 52, W - 112, 918);

    ctx.fillStyle = isPaper ? '#08090C' : '#FF2E55';
    ctx.fillRect(56, 52, 456, 44);
    ctx.fillStyle = '#FAF8F5';
    ctx.font = font(F.mono(900), 15);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`▸ P05_THINKING_DRAFTS // ${shot.tag}`, 74, 74);

    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(512, 52, 16, 44);

    // `<thinking>` ... `</thinking>` structural bracket jaws on L10
    if (shot.cue === 'L10') {
      const jawCol = isPaper ? '#08090C' : '#38BDF8';
      ctx.fillStyle = jawCol;
      ctx.font = font(F.mono(900), 22);
      ctx.textAlign = 'left';
      ctx.fillText('<thinking depth="hidden" visibility="0.00">', 112, 142);
      ctx.textAlign = 'right';
      ctx.fillText('</thinking>', W - 112, 896);
    }

    // CoT Reasoning Tree + Crimson Katana Pruning Slashes on L11
    if (shot.cue === 'L11') {
      const growU = clamp((t - 62.36) / 3.2, 0, 1);
      const pruneU = clamp((t - 65.20) / 3.1, 0, 1);

      // Central trunk
      ctx.strokeStyle = isPaper ? '#08090C' : '#38BDF8';
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(W * 0.5, 900);
      ctx.lineTo(W * 0.5, lerp(900, 180, ease.outCubic(growU)));
      ctx.stroke();

      for (let i = 0; i < COT_BRANCHES.length; i++) {
        const br = COT_BRANCHES[i];
        const bu = clamp((growU - (i / COT_BRANCHES.length) * 0.55) / 0.45, 0, 1);
        if (bu <= 0.01) continue;
        const isCut = br.pruned && pruneU > br.pruneAt;
        const bx = lerp(br.x0, br.x1, bu);
        const by = lerp(br.y0, br.y1, bu);

        ctx.strokeStyle = isCut ? '#64748B' : (br.pruned ? (isPaper ? '#0376B8' : '#475569') : '#FBBF24');
        ctx.lineWidth = br.pruned ? 2.0 : 3.6;
        ctx.setLineDash(isCut ? [7, 7] : []);
        ctx.beginPath();
        ctx.moveTo(br.x0, br.y0);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.setLineDash([]);

        if (isCut) {
          // Crimson katana severance mark X
          const mx = lerp(br.x0, bx, 0.62);
          const my = lerp(br.y0, by, 0.62);
          ctx.strokeStyle = '#FF2E55';
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.moveTo(mx - 11, my - 11); ctx.lineTo(mx + 11, my + 11);
          ctx.moveTo(mx + 11, my - 11); ctx.lineTo(mx - 11, my + 11);
          ctx.stroke();
        } else {
          ctx.fillStyle = br.pruned ? '#38BDF8' : '#FBBF24';
          ctx.fillRect(bx - 5, by - 5, 10, 10);
        }
      }

      // Full-stage diagonal Crimson Katana slash beam on Cut 5!
      if (shot.cut === 5) {
        const slashU = clamp((t - 66.62) / 0.55, 0, 1);
        ctx.strokeStyle = '#FF2E55';
        ctx.lineWidth = 6 + kick * 6;
        ctx.beginPath();
        ctx.moveTo(140, 860);
        ctx.lineTo(lerp(140, 1780, ease.outExpo(slashU)), lerp(860, 160, ease.outExpo(slashU)));
        ctx.stroke();

        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(180, 880);
        ctx.lineTo(lerp(180, 1800, ease.outExpo(slashU)), lerp(880, 180, ease.outExpo(slashU)));
        ctx.stroke();
      }
    }

    // Crumpled 2.5D faceted paper polyhedra drifting in periphery (#FBBF24 + #FF2E55 + #0376B8)
    for (let p = 0; p < 6; p++) {
      const px = (p < 3 ? 138 + p * 62 : W - 138 - (p - 3) * 62);
      const py = 780 - ((((p * 118 + (t - T0) * 34) % 420) + 420) % 420);
      const r = 20 + (p % 3) * 6;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(t * (p % 2 === 0 ? 0.8 : -0.7) + p);
      ctx.fillStyle = p % 2 === 0 ? '#FBBF24' : '#FF2E55';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.92, r * 0.25);
      ctx.lineTo(-r * 0.65, r * 0.85);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#08090C';
      ctx.lineWidth = 2.0;
      ctx.stroke();
      ctx.restore();
    }
  }

  function render(ctx, state) {
    const t = typeof state === 'number' ? state : (state && typeof state.t === 'number' ? state.t : T0);
    const typo = window.CortexTypo;
    const kick = beatKick(t);
    const shot = resolveShot(t, typo);
    const bg = shot.isPaper ? '#F5F0E6' : '#08090C';
    const fg = shot.isPaper ? '#08090C' : '#FF2E55';

    ctx.save();
    ctx.shadowBlur = 0;
    const t10B = wOnset(typo, 'L10', 6, 60.42) - 0.02;
    const t11B = wOnset(typo, 'L11', 4, 64.43) - 0.02;
    const t12B = wOnset(typo, 'L12', 10, 70.31) - 0.02;

    const v6 = window.CortexV6;
    // V7: Strict single <= 1.85s reveal each for `C09` (Cut 2) and `C10` (Cut 7); pure Genkouyoushi MG elsewhere!
    let pKey = null;
    let pT0 = T0;
    if (shot.cut === 2 && t >= t10B && t < t10B + 1.85) { pKey = 'C09'; pT0 = t10B; }
    else if (shot.cut === 7 && t >= t12B && t < t12B + 1.85) { pKey = 'C10'; pT0 = t12B; }

    if (pKey && v6 && typeof v6.drawLivingFullBleed === 'function' && v6.getPlateImage(pKey)) {
      const su = clamp((t - pT0) / 1.85, 0, 1);
      v6.drawLivingFullBleed(ctx, pKey, {
        t, u: su, kick,
        zoom0: shot.cut % 2 === 0 ? 1.06 : 1.28,
        zoom1: shot.cut % 2 === 0 ? 1.26 : 1.08,
        panX0: shot.cut % 2 === 0 ? -46 : 42,
        panX1: shot.cut % 2 === 0 ? 34 : -38,
        panY0: 22, panY1: -18,
        rot0: shot.cut % 2 === 0 ? -0.018 : 0.018, rot1: 0.0,
        fx: 0.50, fy: 0.34,
        scrim: shot.isPaper ? 0.24 : 0.30,
        isPaper: shot.isPaper
      });
    } else {
      drawGenkouyoushiStage(ctx, t, shot, kick);
    }

    if (!typo) {
      ctx.restore();
      return { isPaper: shot.isPaper, bg, fg, duotone: { bg, fg }, bloom: 0, ca: 0, flash: 0, shake: 0 };
    }

    if (shot.cue === 'L10') {
      if (shot.cut === 1) {
        const u = clamp((t - 59.26) / Math.max(0.25, t10B - 59.26), 0, 1);
        typo.drawT05PlotterWrite(ctx, ['閉じた〈思考〉'], W * 0.5, 505, 174,
          smoothstep(0.0, 0.35, u), 0, t, {
            t, cueId: 'L10', formation: 'brutalist', isPaper: true, maxHeight: 680,
            bg: '#F5F0E6', fg: '#08090C', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#0376B8',
            safeBox: { x0: 132, y0: 152, x1: 1788, y1: 874 }
          });
      } else {
        const u = clamp((t - t10B) / Math.max(0.25, 62.36 - t10B), 0, 1);
        const exitP = smoothstep(62.14, 62.34, t);
        typo.drawT05PlotterWrite(ctx, ['誰にも見えない', '場所で'], W * 0.5, 505, 194,
          smoothstep(0.0, 0.30, u), exitP, t, {
            t, cueId: 'L10', formation: 'cascade', maxWidth: 1680, maxHeight: 750,
            bg: '#08090C', fg: '#FAF8F5', accent: '#38BDF8', sparkCol: '#FF2E55', auxCol: '#FBBF24',
            safeBox: { x0: 104, y0: 118, x1: 1816, y1: 896 }
          });
      }
    } else if (shot.cue === 'L11') {
      if (shot.cut === 3) {
        const u = clamp((t - 62.36) / Math.max(0.25, t11B - 62.36), 0, 1);
        typo.drawT03RadicalRailSnap(ctx, ['幾千の分岐'], W * 0.5, 505, 168,
          smoothstep(0.0, 0.25, u), 0, {
            t, cueId: 'L11', formation: 'brutalist', isPaper: true,
            bg: '#F5F0E6', fg: '#08090C', accent: '#0376B8', sparkCol: '#FF2E55', auxCol: '#FBBF24',
            safeBox: { x0: 140, y0: 160, x1: 1780, y1: 870 }
          });
      } else if (shot.cut === 4) {
        const u = clamp((t - t11B) / Math.max(0.25, 68.73 - t11B), 0, 1);
        typo.drawT03RadicalRailSnap(ctx, ['咲かせては', '剪定して'], W * 0.5, 505, 150,
          smoothstep(0.0, 0.24, u), 0, {
            t, cueId: 'L11', formation: 'cascade', isPaper: true,
            bg: '#F5F0E6', fg: '#08090C', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#0376B8',
            safeBox: { x0: 140, y0: 160, x1: 1780, y1: 870 }
          });
      } else {
        const exitP = smoothstep(68.42, 68.70, t);
        typo.drawT03RadicalRailSnap(ctx, ['咲かせては', '剪定して'], W * 0.5, 505, 154,
          1.0, exitP, {
            t, cueId: 'L11', formation: 'stamps',
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 140, y0: 160, x1: 1780, y1: 870 }
          });
      }
    } else {
      // L12: Top Band = Backspace Rewrite (Left) + Probability Widget (Right);
      //      Lower Hero Stage = Non-Overlapping T01 Die-Cut Slap Stickers!
      const uAll = clamp((t - 68.73) / (72.30 - 68.73), 0, 1);

      if (shot.cut === 6) {
        const uA = clamp((t - 68.73) / Math.max(0.25, t12B - 68.73), 0, 1);
        typo.drawBackspaceRewrite(ctx, 'P05_draft_1', 606, 206, 36, clamp(uA * 1.15, 0, 1), {
          isPaper: true, maxWidth: 1008,
          bg: '#F5F0E6', fg: '#08090C', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#0376B8'
        });
        typo.drawPromptProbWidget(ctx, 'P05_thinking', 1148, 108, 676, 206, smoothstep(0.0, 0.25, uA), {
          isPaper: true, bg: '#F5F0E6', fg: '#08090C', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#0376B8',
          spikeP: uAll
        });
        typo.drawT01SlapSticker(ctx, ['「これじゃ足りない」'], W * 0.5, 638, 136,
          smoothstep(0.0, 0.22, uA), 0, {
            t, cueId: 'L12', formation: 'stamps', isPaper: true,
            bg: '#F5F0E6', fg: '#08090C', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#0376B8',
            safeBox: { x0: 120, y0: 356, x1: 1800, y1: 916 }
          });
      } else {
        const uB = clamp((t - t12B) / Math.max(0.25, 72.30 - t12B), 0, 1);
        const exitP = smoothstep(72.06, 72.28, t);
        typo.drawBackspaceRewrite(ctx, 'P05_draft_2', 606, 206, 36, clamp(uB * 1.18, 0, 1), {
          maxWidth: 1008,
          bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8'
        });
        typo.drawPromptProbWidget(ctx, 'P05_thinking', 1148, 108, 676, 206, 1.0, {
          bg: '#08090C', fg: '#38BDF8', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
          spikeP: clamp(0.45 + uB * 0.55, 0, 1)
        });
        typo.drawT01SlapSticker(ctx, ['「もっと優しい', '言葉を」'], W * 0.5, 638, 136,
          smoothstep(0.0, 0.22, uB), exitP, {
            t, cueId: 'L12', formation: 'cascade',
            bg: '#08090C', fg: '#FAF8F5', accent: '#FF2E55', sparkCol: '#FBBF24', auxCol: '#38BDF8',
            safeBox: { x0: 120, y0: 356, x1: 1800, y1: 916 }
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
    id: 'P05_thinking_drafts',
    t0: T0,
    t1: T1,
    render
  };
  window.CortexScenes = window.CortexScenes || {};
  window.CortexScenes.P05_thinking_drafts = plateSpec;
  if (typeof window.registerCortexPlate === 'function') {
    window.registerCortexPlate('P05_thinking_drafts', plateSpec);
  }
})();
