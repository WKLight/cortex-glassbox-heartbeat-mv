# -*- coding: utf-8 -*-
"""
5-Gate Automated + Visual Quality Assurance Pipeline for CORTEX MV V6
Pure PyAV + NumPy + PIL (zero cv2 dependency). Grounded in `motion-design-judgment`.
"""
import argparse
import os
import re
import subprocess
import sys
import av
import numpy as np
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding="utf-8")

V6_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART_DIR = os.environ.get("CORTEX_QA_OUT", os.path.join(V6_ROOT, "qa_out")); os.makedirs(ART_DIR, exist_ok=True)


def resize_rgb(arr, w, h):
    return np.asarray(Image.fromarray(arr).resize((w, h), Image.Resampling.BILINEAR), dtype=np.uint8)


def grad_mag(gray_f32):
    gx = np.abs(np.diff(gray_f32, axis=1, prepend=gray_f32[:, :1]))
    gy = np.abs(np.diff(gray_f32, axis=0, prepend=gray_f32[:1, :]))
    return np.hypot(gx, gy)


def fft_max_ncc(img, tpl):
    """Fast 2D normalized cross-correlation peak via FFT."""
    ih, iw = img.shape
    th, tw = tpl.shape
    if th >= ih - 2 or tw >= iw - 2 or th < 16 or tw < 16:
        return -1.0
    tpl0 = tpl - tpl.mean()
    t_norm = float(np.sqrt((tpl0 * tpl0).sum()))
    if t_norm < 1e-6:
        return -1.0
    # Cross-correlation via FFT
    f_img = np.fft.rfft2(img, s=(ih, iw))
    f_tpl = np.fft.rfft2(tpl0[::-1, ::-1], s=(ih, iw))
    cc = np.fft.irfft2(f_img * f_tpl, s=(ih, iw))[th - 1 :, tw - 1 :]
    # Local energy of img via integral image
    s1 = np.pad(img, ((1, 0), (1, 0))).cumsum(0).cumsum(1)
    s2 = np.pad(img * img, ((1, 0), (1, 0))).cumsum(0).cumsum(1)
    win_sum = s1[th:, tw:] - s1[:-th, tw:] - s1[th:, :-tw] + s1[:-th, :-tw]
    win_sq = s2[th:, tw:] - s2[:-th, tw:] - s2[th:, :-tw] + s2[:-th, :-tw]
    n = float(th * tw)
    win_var = np.maximum(win_sq - (win_sum * win_sum) / n, 1e-6)
    ncc = cc / (np.sqrt(win_var) * t_norm)
    return float(ncc.max())


def check_plate_aspect_ratio(frame_rgb, plate_path):
    """Verify rendered character plate is never horizontally or vertically stretched."""
    if not os.path.exists(plate_path):
        return 1.0, 0.0
    p_rgb = np.asarray(Image.open(plate_path).convert("RGB"), dtype=np.uint8)
    fh, fw = frame_rgb.shape[:2]
    ph, pw = p_rgb.shape[:2]

    # Downsample to 480x270 for sub-second FFT aspect scan
    f_sm = resize_rgb(frame_rgb, 480, 270).astype(np.float32)
    f_gray = f_sm[:, :, 0] * 0.299 + f_sm[:, :, 1] * 0.587 + f_sm[:, :, 2] * 0.114
    f_edge = grad_mag(f_gray)

    p_f = p_rgb.astype(np.float32)
    p_gray = p_f[:, :, 0] * 0.299 + p_f[:, :, 1] * 0.587 + p_f[:, :, 2] * 0.114
    cy0, cy1 = int(ph * 0.18), int(ph * 0.78)
    cx0, cx1 = int(pw * 0.20), int(pw * 0.80)
    crop_pil = Image.fromarray(np.clip(p_gray[cy0:cy1, cx0:cx1], 0, 255).astype(np.uint8))

    base_scale = max(480.0 / pw, 270.0 / ph)
    best_sc = -1.0
    best_ar = 1.0
    for zoom in [0.96, 1.02, 1.08, 1.14, 1.20]:
        for ar in [0.84, 0.91, 0.96, 1.00, 1.04, 1.09, 1.16]:
            tw = int(round(crop_pil.width * base_scale * zoom * ar))
            th = int(round(crop_pil.height * base_scale * zoom))
            if tw >= 474 or th >= 264 or tw < 40 or th < 40:
                continue
            t_gray = np.asarray(crop_pil.resize((tw, th), Image.Resampling.BILINEAR), dtype=np.float32)
            t_edge = grad_mag(t_gray)
            sc = fft_max_ncc(f_edge, t_edge)
            if sc > best_sc:
                best_sc = sc
                best_ar = ar
    return best_ar, best_sc


def rgb_hue_families(sm_rgb):
    """Vectorized HSV hue-family pixel fractions on 320x180 RGB."""
    f = sm_rgb.astype(np.float32)
    r, g, b = f[:, :, 0], f[:, :, 1], f[:, :, 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    ch = mx - mn
    hi_sat = (ch >= 85.0) & (mx >= 95.0) & ((ch / np.maximum(mx, 1.0)) >= 0.45)

    hue = np.zeros_like(mx)
    m_r = (mx == r) & (ch > 0)
    m_g = (mx == g) & (ch > 0) & (~m_r)
    m_b = (ch > 0) & (~m_r) & (~m_g)
    hue[m_r] = (60.0 * ((g[m_r] - b[m_r]) / ch[m_r])) % 360.0
    hue[m_g] = 60.0 * ((b[m_g] - r[m_g]) / ch[m_g]) + 120.0
    hue[m_b] = 60.0 * ((r[m_b] - g[m_b]) / ch[m_b]) + 240.0

    tot = float(sm_rgb.shape[0] * sm_rgb.shape[1])
    f_cyan_blue = float((hi_sat & (hue >= 165.0) & (hue <= 260.0)).sum()) / tot
    f_crimson = float((hi_sat & ((hue >= 318.0) | (hue <= 22.0))).sum()) / tot
    f_yellow = float((hi_sat & (hue >= 34.0) & (hue <= 74.0)).sum()) / tot
    f_green = float((hi_sat & (hue >= 84.0) & (hue <= 156.0)).sum()) / tot
    return f_cyan_blue, f_crimson, f_yellow, f_green


def gate1_static_check(strict_legacy=True):
    print("\n================ [GATE 1] STATIC & ARCHITECTURE QA ================")
    errors = []
    warnings = []

    node_check = subprocess.run(
        [
            "node",
            "-e",
            """
            const fs = require('fs'), path = require('path'), vm = require('vm');
            const root = path.join(process.cwd(), 'js');
            let n = 0;
            function walk(d) {
              for (const f of fs.readdirSync(d)) {
                const p = path.join(d, f);
                if (fs.statSync(p).isDirectory()) walk(p);
                else if (f.endsWith('.js')) { new vm.Script(fs.readFileSync(p, 'utf8'), { filename: p }); n++; }
              }
            }
            walk(root);
            console.log('JS_SYNTAX_OK=' + n);
            """,
        ],
        capture_output=True,
        text=True,
    )
    if node_check.returncode != 0:
        errors.append(f"JS Syntax Error: {node_check.stderr.strip()}")
    else:
        print("  [PASS]", node_check.stdout.strip())

    v9_path = os.path.join(V6_ROOT, "js", "mv", "v9-cinema-shaders.js")
    if os.path.exists(v9_path):
        errors.append("v9-cinema-shaders.js still exists on disk!")
    mv_html = open(os.path.join(V6_ROOT, "mv.html"), encoding="utf-8").read()
    if "v9-cinema-shaders" in mv_html:
        errors.append("mv.html still references v9-cinema-shaders!")

    intro_scenes = [
        "P01_fog_boot.js",
        "P19_tikz_compass_genesis.js",
        "P02_monitor_overdrive.js",
        "P03_prompt_wake.js",
    ]
    for sc in intro_scenes:
        p = os.path.join(V6_ROOT, "js", "mv", "scenes", sc)
        txt = open(p, encoding="utf-8").read()
        raw_hits = len(re.findall(r"__v6RawColor\s*=\s*true", txt))
        if raw_hits > 0:
            msg = f"{sc} sets __v6RawColor = true ({raw_hits} places — bypasses V6ColorDirector single-accent budget!)"
            if strict_legacy:
                errors.append(msg)
            else:
                warnings.append(msg)
        if "v6_depth" in txt or "drawDepthPlate" in txt:
            errors.append(f"{sc} uses depth-map warping (risks background stretching)!")
        glass_calls = len(re.findall(r"\bdrawGlassCard3D\s*\(", txt)) - len(
            re.findall(r"function\s+drawGlassCard3D\s*\(", txt)
        )
        wing_calls = len(re.findall(r"\bdrawWing\s*\(", txt)) - len(
            re.findall(r"function\s+drawWing\s*\(", txt)
        )
        b3d07_calls = len(re.findall(r"B3D_07_keyswitch", txt))
        if glass_calls > 0 or wing_calls > 0 or b3d07_calls > 0:
            msg = f"{sc} legacy weak visuals: drawGlassCard3D={glass_calls}, drawWing={wing_calls}, B3D_07_keyswitch={b3d07_calls}"
            if strict_legacy:
                errors.append(msg)
            else:
                warnings.append(msg)

    pt_txt = open(os.path.join(V6_ROOT, "js", "mv", "plate-timeline.js"), encoding="utf-8").read()
    if "opticalZoomBlend" in pt_txt or "tunnelVelocityMatch" in pt_txt or "waveHorizonDissolve" in pt_txt:
        errors.append("plate-timeline.js still contains V10 muddy cross-fade modes!")

    for w in warnings:
        print("  [WARN]", w)
    for e in errors:
        print("  [FAIL]", e)
    print(f"  -> Gate 1 Result: {'PASS' if not errors else 'FAIL'} ({len(errors)} errors, {len(warnings)} warnings)")
    return len(errors) == 0


def audit_preview_video(video_path, tag, strict_legacy=True):
    g1_ok = gate1_static_check(strict_legacy=strict_legacy)

    print(f"\n================ [GATES 2-4] PIXEL, COLOR & CUT QA ({os.path.basename(video_path)}) ================")
    container = av.open(video_path)
    stream = container.streams.video[0]
    fps = float(stream.average_rate or 60)

    lumas = []
    d_abs = []
    hue_counts = []
    clash_frames = []
    rainbow_bar_frames = []

    sample_frames = {}
    plate_probes = {
        int(round(9.20 * 60)): ("C01", os.path.join(V6_ROOT, "assets", "v6_plates", "C01_fog_fingertip.png")),
        int(round(12.50 * 60)): ("C02", os.path.join(V6_ROOT, "assets", "v6_plates", "C02_zero_night_curled.png")),
        int(round(19.60 * 60)): ("C04", os.path.join(V6_ROOT, "assets", "v6_plates", "C04_terminal_chin_rest.png")),
        int(round(25.30 * 60)): ("C05", os.path.join(V6_ROOT, "assets", "v6_plates", "C05_await_name_turn.png")),
        int(round(26.30 * 60)): ("C03", os.path.join(V6_ROOT, "assets", "v6_plates", "C03_overdrive_pupil.png")),
        int(round(41.80 * 60)): ("C06", os.path.join(V6_ROOT, "assets", "v6_plates", "C06_nee_pulse_ripple.png")),
    }
    plate_frames = {}

    story_ts = [round(i * (43.5 / 47.0), 2) for i in range(48)]
    story_fidxs = {int(round(t * 60)): t for t in story_ts}

    prev_small = None
    small_cache = []

    fidx = 0
    for frame in container.decode(video=0):
        arr = frame.to_ndarray(format="rgb24")
        # Fast 6x stride subsample (320x180)
        sm = arr[3::6, 3::6]
        small_cache.append(sm)

        y_mean = float(sm[:, :, 0].mean() * 0.299 + sm[:, :, 1].mean() * 0.587 + sm[:, :, 2].mean() * 0.114)
        lumas.append(y_mean)

        if prev_small is not None:
            diff = float(np.abs(sm.astype(np.int16) - prev_small.astype(np.int16)).mean())
            d_abs.append(diff)
        else:
            d_abs.append(0.0)
        prev_small = sm

        fcb, fcr, fyl, fgr = rgb_hue_families(sm)
        active_hues = sum(1 for c in (fcb, fcr, fyl, fgr) if c >= 0.015)
        hue_counts.append(active_hues)
        if active_hues >= 3:
            clash_frames.append((fidx, round(fidx / fps, 2), round(fcb, 3), round(fcr, 3), round(fyl, 3), round(fgr, 3)))
        if fgr >= 0.0025 and fyl >= 0.0025 and fcr >= 0.0025:
            rainbow_bar_frames.append((fidx, round(fidx / fps, 2)))

        if fidx in story_fidxs:
            sample_frames[fidx] = resize_rgb(arr, 400, 225)
        if fidx in plate_probes:
            plate_frames[fidx] = arr.copy()

        fidx += 1

    container.close()
    n_frames = fidx
    print(f"  Decoded {n_frames} frames ({n_frames/fps:.2f}s @ {fps:.1f}fps)")

    print("\n--- [GATE 2] Aspect-Ratio & Anti-Stretch Check ---")
    g2_ok = True
    for pf, (pid, ppath) in sorted(plate_probes.items()):
        if pf in plate_frames:
            ar, sc = check_plate_aspect_ratio(plate_frames[pf], ppath)
            ok = (abs(ar - 1.0) <= 0.045) if sc >= 0.22 else True
            if not ok:
                g2_ok = False
            print(f"  [{'PASS' if ok else 'FAIL'}] {pid} @ {pf/fps:.2f}s (f{pf}): best_aspect={ar:.2f} (edge_ncc={sc:.3f})")

    print("\n--- [GATE 3] Color Budget & Photosensitive Safety Check ---")
    black_frames = [i for i, y in enumerate(lumas) if y < 2.0]
    low_secs = []
    for sec in range(int(n_frames // 60)):
        sy = float(np.mean(lumas[sec * 60 : (sec + 1) * 60]))
        if sy < 3.0:
            low_secs.append((sec, round(sy, 2)))

    dy = np.abs(np.diff(np.array(lumas, dtype=np.float32)))
    flash_spikes = (dy > 64.0).astype(np.int32)
    max_flashes_1s = int(np.convolve(flash_spikes, np.ones(60, dtype=np.int32), mode="valid").max()) if len(flash_spikes) >= 60 else 0

    g3_ok = (len(black_frames) == 0) and (len(low_secs) == 0) and (len(clash_frames) == 0) and (len(rainbow_bar_frames) == 0) and (max_flashes_1s <= 3)
    print(f"  Black frames (Y<2.0): {len(black_frames)}")
    print(f"  Low-luma seconds (Y<3.0): {len(low_secs)} {low_secs[:5]}")
    print(f"  3-Hue circus clash frames: {len(clash_frames)} {[x[:2] for x in clash_frames[:10]]}")
    print(f"  Rainbow widget frames (R+Y+G): {len(rainbow_bar_frames)} {[x[1] for x in rainbow_bar_frames[:10]]}")
    print(f"  Max whole-frame flashes in 1.0s: {max_flashes_1s} (limit <= 3)")
    print(f"  -> Gate 3 Result: {'PASS' if g3_ok else 'FAIL'}")

    print("\n--- [GATE 4] Cut Continuity & Visual Audit Sheets ---")
    d_arr = np.array(d_abs, dtype=np.float32)
    cuts = []
    for i in range(600, n_frames - 6):
        local_med = float(np.median(d_arr[max(1, i - 18) : min(n_frames, i + 19)]))
        if d_arr[i] > max(22.0, local_med * 2.8) and d_arr[i] >= d_arr[i - 1] and d_arr[i] >= d_arr[i + 1]:
            if not cuts or (i - cuts[-1][0]) >= 12:
                ga = small_cache[i - 1].astype(np.float32).mean(2)
                gb = small_cache[i].astype(np.float32).mean(2)
                ea = grad_mag(ga).ravel()
                eb = grad_mag(gb).ravel()
                ea0, eb0 = ea - ea.mean(), eb - eb.mean()
                ecorr = float((ea0 * eb0).sum() / (np.sqrt((ea0 * ea0).sum() * (eb0 * eb0).sum()) + 1e-6))
                cuts.append((i, round(i / fps, 2), round(float(d_arr[i]), 1), round(ecorr, 3)))

    print(f"  Detected {len(cuts)} sharp cuts in 10.0s..{n_frames/fps:.1f}s:")
    for c in cuts:
        print(f"    f{c[0]:04d} ({c[1]:5.2f}s) | dRGB={c[2]:5.1f} | edge_corr={c[3]:+.3f}")

    tw, th = 400, 225
    story_img = Image.new("RGB", (tw * 6, th * 8), (10, 12, 16))
    draw_s = ImageDraw.Draw(story_img)
    for idx_s, sf in enumerate(sorted(sample_frames.keys())):
        col = idx_s % 6
        row = idx_s // 6
        story_img.paste(Image.fromarray(sample_frames[sf]), (col * tw, row * th))
        lbl = f"{sf/fps:05.2f}s f{sf:04d} Y={lumas[sf]:.0f} H={hue_counts[sf]}"
        draw_s.rectangle([col * tw, row * th, col * tw + 235, row * th + 20], fill=(0, 0, 0))
        draw_s.text((col * tw + 5, row * th + 3), lbl, fill=(125, 211, 252) if hue_counts[sf] <= 2 else (255, 80, 80))

    story_out = os.path.join(ART_DIR, f"qa_{tag}_story_0_44s.jpg")
    story_img.save(story_out, quality=90)
    print(f"  Saved 48-frame storyboard sheet -> {story_out}")

    probe_centers = [10.17, 11.95, 13.95, 14.20, 15.95, 17.30, 18.95, 20.40, 21.95, 23.60, 24.95, 25.95, 26.85, 28.20, 29.78, 34.45, 39.20, 41.25]
    for c in cuts:
        if all(abs(c[1] - pc) > 0.25 for pc in probe_centers):
            probe_centers.append(c[1])
    probe_centers = sorted(p for p in probe_centers if p * 60 + 6 < n_frames)[:20]

    cw, ch = 320, 180
    cut_img = Image.new("RGB", (cw * 4, ch * max(1, len(probe_centers))), (10, 12, 16))
    draw_c = ImageDraw.Draw(cut_img)
    offsets = [-4, -1, 1, 5]
    for r_idx, pc in enumerate(probe_centers):
        cf = int(round(pc * 60))
        for c_idx, off in enumerate(offsets):
            ff = max(0, min(n_frames - 1, cf + off))
            cut_img.paste(Image.fromarray(small_cache[ff]), (c_idx * cw, r_idx * ch))
            lbl = f"{ff/fps:05.2f}s (f{ff:04d}) d={d_abs[ff]:.1f}"
            draw_c.rectangle([c_idx * cw, r_idx * ch, c_idx * cw + 205, r_idx * ch + 18], fill=(0, 0, 0))
            draw_c.text((c_idx * cw + 4, r_idx * ch + 2), lbl, fill=(248, 250, 252))

    cut_out = os.path.join(ART_DIR, f"qa_{tag}_cuts_10_44s.jpg")
    cut_img.save(cut_out, quality=90)
    print(f"  Saved {len(probe_centers)}x4 cut-continuity strips -> {cut_out}")

    all_ok = g1_ok and g2_ok and g3_ok
    print(f"\n================ OVERALL PREVIEW QA ({tag}): {'PASS' if all_ok else 'FAIL'} ================")
    return all_ok


def audit_master_pair(master_path, compressed_path, tag):
    g1_ok = gate1_static_check(strict_legacy=True)
    all_ok = g1_ok

    for label, vpath in [("MASTER", master_path), ("COMPRESSED", compressed_path)]:
        print(f"\n================ [GATE 5] FULL 16,896-FRAME AUDIT: {label} ================")
        c = av.open(vpath)
        n = 0
        black = 0
        sec_sum = 0.0
        low_secs = []
        f0_rgb = None
        flast_rgb = None
        key_stills = {}
        key_targets = {
            0: "00.00s LoopStart",
            180: "03.00s P01 Frost",
            288: "04.80s P19 TwinCompass",
            396: "06.60s P19 3DIris",
            552: "09.20s P01 C01",
            750: "12.50s P01 C02+0%",
            900: "15.00s P02 Vortex",
            1092: "18.20s P02 R340Compass",
            1176: "19.60s P02 C04",
            1356: "22.60s P02 Title",
            1518: "25.30s P02 C05",
            1578: "26.30s P02 C03Eye",
            1740: "29.00s P02 B3DIris",
            1950: "32.50s P03 Blueprint",
            2220: "37.00s P20 Gargantua",
            2400: "40.00s P03 Keycap3D",
            2448: "40.80s P03 PulseMatch",
            2508: "41.80s P03 C06Ripple",
            3350: "55.83s P06 Classroom",
            5550: "92.50s P09 SakuraTrain",
            8520: "142.0s P12 Hydraulic",
            14220: "237.0s P17 Odyssey",
            16500: "275.0s P18 Dawn",
            16895: "281.58s LoopEnd",
        }
        for frame in c.decode(video=0):
            arr = frame.to_ndarray(format="rgb24")
            sm = arr[::8, ::8]
            y = float(sm[:, :, 0].mean() * 0.299 + sm[:, :, 1].mean() * 0.587 + sm[:, :, 2].mean() * 0.114)
            if y < 2.0:
                black += 1
            sec_sum += y
            if (n + 1) % 60 == 0:
                if sec_sum / 60.0 < 3.0:
                    low_secs.append((n // 60, round(sec_sum / 60.0, 2)))
                sec_sum = 0.0
            if n == 0:
                f0_rgb = arr.copy()
            flast_rgb = arr
            if label == "MASTER" and n in key_targets:
                key_stills[n] = resize_rgb(arr, 480, 270)
            n += 1
        c.close()

        loop_rms = float(np.sqrt(np.mean((f0_rgb.astype(np.float32) - flast_rgb.astype(np.float32)) ** 2)))
        mb = os.path.getsize(vpath) / (1024 * 1024)
        v_ok = (n == 16896) and (black == 0) and (len(low_secs) == 0) and (loop_rms < 7.0)
        if not v_ok:
            all_ok = False
        print(f"  File: {os.path.basename(vpath)} ({mb:.2f} MB)")
        print(f"  Frames: {n} (expected 16896) | Black: {black} | LowSecs: {len(low_secs)} | LoopRMS(f0,f16895): {loop_rms:.3f}")
        print(f"  -> {label} Gate 5: {'PASS' if v_ok else 'FAIL'}")

        if label == "MASTER" and key_stills:
            tw, th = 480, 270
            grid = Image.new("RGB", (tw * 4, th * 6), (10, 12, 16))
            dg = ImageDraw.Draw(grid)
            for k_i, kf in enumerate(sorted(key_stills.keys())):
                col = k_i % 4
                row = k_i // 4
                grid.paste(Image.fromarray(key_stills[kf]), (col * tw, row * th))
                dg.rectangle([col * tw, row * th, col * tw + 260, row * th + 24], fill=(0, 0, 0))
                dg.text((col * tw + 6, row * th + 5), f"f{kf:05d} | {key_targets[kf]}", fill=(125, 211, 252))
            out_sheet = os.path.join(ART_DIR, f"qa_{tag}_master_24frames.jpg")
            grid.save(out_sheet, quality=92)
            print(f"  Saved 24-frame full-MV contact sheet -> {out_sheet}")

    return all_ok


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=["preview", "master"], required=True)
    ap.add_argument("--video", required=True)
    ap.add_argument("--compressed", default="")
    ap.add_argument("--tag", default="run")
    ap.add_argument("--allow-legacy", action="store_true")
    args = ap.parse_args()

    if args.mode == "preview":
        ok = audit_preview_video(args.video, args.tag, strict_legacy=not args.allow_legacy)
    else:
        ok = audit_master_pair(args.video, args.compressed, args.tag)
    sys.exit(0 if ok else 1)
