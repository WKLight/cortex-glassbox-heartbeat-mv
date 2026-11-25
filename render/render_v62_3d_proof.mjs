// ============================================================================
// CORTEX V6.2 // 3D Scenes & Rebuilt Paper-Airplane Odyssey Proof Reel (36.8s)
// Renders 5 clips in 1920x1080 @ 60fps (MB=4x) with real synced master audio:
//   Clip 1: P19 3D Watchmaker Titanium & Crystal Iris     [3.51s .. 7.36s]   (3.85s)
//   Clip 2: P24 3D Faceted Ruby Mechanical Rotor Heart    [83.55s .. 86.13s] (2.58s)
//   Clip 3: P26 3D Brushed-Steel Synchrotron 160Hz Dive   [116.40s .. 123.17s](6.77s)
//   Clip 4: P31 3D Sunlit Ivory & Gold 6-Wing Cathedral   [206.42s .. 211.75s](5.33s)
//   Clip 5: P17B FULL 6-Act 3D Paper-Airplane Odyssey -> P18 Dawn Handoff
//                                                         [232.30s .. 251.50s](19.20s)
// ============================================================================
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = process.env.CORTEX_WORK_DIR || (fs.existsSync('F:\\') ? 'F:\\tmp\\cortex_v62_proof' : path.join(os.tmpdir(), 'cortex_v62_proof'));
const OUT_REEL = path.join(ROOT, 'CORTEX_V62_3D_PaperAirplane_ProofReel_37s_1080p60.mp4');
const RENDERER = path.join(ROOT, 'render', 'render_mv_mp4.mjs');

let FFMPEG = 'E:\\Live2D Cubism 5.3\\tools\\ffmpeg\\ffmpeg.exe';
try {
  const pyOut = execFileSync('E:\\python.exe', ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim();
  if (pyOut && fs.existsSync(pyOut)) FFMPEG = pyOut;
} catch {}

fs.mkdirSync(TMP, { recursive: true });

const CLIPS = [
  { name: 'clip1_p19_3d_iris',          t0: 3.51,   t1: 7.36   },
  { name: 'clip2_p24_3d_rotor_heart',   t0: 83.55,  t1: 86.13  },
  { name: 'clip3_p26_3d_synchrotron',   t0: 116.40, t1: 123.17 },
  { name: 'clip4_p31_3d_cathedral',     t0: 206.42, t1: 211.75 },
  { name: 'clip5_p17b_3d_paper_odyssey',t0: 232.30, t1: 251.50 }
];

const listLines = [];
for (const c of CLIPS) {
  const f0 = Math.round(c.t0 * 60);
  const f1 = Math.round(c.t1 * 60);
  const clipMp4 = path.join(TMP, `${c.name}.mp4`);
  console.log(`\n>>> Rendering ${c.name} [${c.t0}s .. ${c.t1}s] (frames ${f0}..${f1})...`);
  execFileSync(process.execPath, [
    RENDERER,
    '--f0', String(f0),
    '--f1', String(f1),
    '--workers', '4',
    '--mb', '4',
    '--out', clipMp4
  ], { stdio: 'inherit' });
  listLines.push(`file '${clipMp4.replace(/\\/g, '/')}'`);
}

const concatList = path.join(TMP, 'concat_v62.txt');
fs.writeFileSync(concatList, listLines.join('\n') + '\n', 'utf8');

console.log('\n>>> Concatenating 5 V6.2 3D Proof Clips...');
execFileSync(FFMPEG, [
  '-y', '-f', 'concat', '-safe', '0',
  '-i', concatList,
  '-c', 'copy',
  '-movflags', '+faststart',
  OUT_REEL
], { stdio: 'inherit' });

const szMb = (fs.statSync(OUT_REEL).size / (1024 * 1024)).toFixed(2);
console.log(`\n=== V6.2 3D & PAPER-AIRPLANE PROOF REEL READY: ${OUT_REEL} (${szMb} MB) ===`);
