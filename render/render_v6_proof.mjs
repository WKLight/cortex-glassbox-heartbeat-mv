// ============================================================================
// CORTEX V6 // 5-Clip Multi-Segment 1080p60 Real-Audio Proof Reel Builder
// Renders 5 iconic V6-upgraded V2 segments in parallel via `render_mv_mp4.mjs`
// (with 4x 180-deg Temporal Shutter Motion Blur + Cinema WebGL2 Post-FX)
// and concatenates them cleanly into `CORTEX_V6_ProofReel_36s_1080p60.mp4`.
// ============================================================================
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RENDERER = path.join(ROOT, 'render', 'render_mv_mp4.mjs');
const WORK_DIR = process.env.CORTEX_WORK_DIR || (fs.existsSync('F:\\') ? 'F:\\tmp\\cortex_v6_proof' : path.join(os.tmpdir(), 'cortex_v6_proof'));
const OUT_MP4 = path.join(ROOT, 'CORTEX_V6_ProofReel_36s_1080p60.mp4');
const FPS = 60;

let FFMPEG = 'E:\\Live2D Cubism 5.3\\tools\\ffmpeg\\ffmpeg.exe';
try {
  const pyOut = execFileSync('E:\\python.exe', ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim();
  if (pyOut && fs.existsSync(pyOut)) FFMPEG = pyOut;
} catch {}

fs.mkdirSync(WORK_DIR, { recursive: true });

const CLIPS = [
  { name: 'clip1_p02_overdrive',  t0: 22.85,  t1: 27.75  }, // 4.90s: Monument + Corridor + C04/C03/C05
  { name: 'clip2_p07_p08_chorus', t0: 87.50,  t1: 94.80  }, // 7.30s: Rotor/Odometer -> Hex Wipe -> P08 C13 Gaze
  { name: 'clip3_p09_pixel',      t0: 101.80, t1: 109.20 }, // 7.40s: PX09_A Train+Sakura+Loafers -> PX09_B Close
  { name: 'clip4_p17_climax_m14', t0: 221.36, t1: 232.30 }, // 10.94s: M1 -> M2 -> M3 -> M4 Single-Pass Metamorphosis!
  { name: 'clip5_p18_dawn_pixel', t0: 250.14, t1: 255.80 }  // 5.66s: PX18_A Dawn Sakura+Loafers -> PX18_B Desk
];

const clipFiles = [];
for (const c of CLIPS) {
  const f0 = Math.round(c.t0 * FPS);
  const f1 = Math.round(c.t1 * FPS);
  const outClip = path.join(WORK_DIR, `${c.name}.mp4`);
  console.log(`\n>>> Rendering ${c.name} [${c.t0}s .. ${c.t1}s] (frames ${f0}..${f1})...`);
  execFileSync(process.execPath, [
    RENDERER,
    '--f0', String(f0),
    '--f1', String(f1),
    '--workers', '4',
    '--mb', '4',
    '--out', outClip
  ], { stdio: 'inherit' });
  clipFiles.push(outClip);
}

const listFile = path.join(WORK_DIR, 'concat_list.txt');
fs.writeFileSync(listFile, clipFiles.map((f) => `file '${f.replace(/\\/g, '/')}'`).join('\n'), 'utf8');

console.log('\n>>> Concatenating 5 V6 Proof Clips via lossless stream copy...');
execFileSync(FFMPEG, [
  '-y',
  '-f', 'concat',
  '-safe', '0',
  '-i', listFile,
  '-c', 'copy',
  '-movflags', '+faststart',
  OUT_MP4
], { stdio: 'inherit' });

const mb = (fs.statSync(OUT_MP4).size / (1024 * 1024)).toFixed(2);
console.log(`\n=== V6 PROOF REEL READY: ${OUT_MP4} (${mb} MB) ===`);
