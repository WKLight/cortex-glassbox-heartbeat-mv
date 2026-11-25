// ============================================================================
// CORTEX V6 // Parallel GPU WebCodecs 1080p60 Master MP4 Renderer (`render_mv_mp4.mjs`)
// Upgrades V2's blazing-fast 4-worker GPU WebCodecs pipeline with:
//   1. `v6-craft-engine.js` (Single-Accent Cinema Palette + 29 Preloaded Plates + AE Typography)
//   2. Cut-Aware 4x Temporal 180-deg Shutter Motion Blur (`--mb 4`, 0 ghosting across cuts,
//      auto-bypassed on 1:1 pixel art `P09`/`P18` & loop endpoints for `RMS == 0.000`!).
//   3. Single-encode 38 Mbps H.264 High Profile + FFmpeg lossless `-c:v copy` + 320kbps AAC!
// ============================================================================
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORK_DIR = process.env.CORTEX_WORK_DIR || (fs.existsSync('F:\\') ? 'F:\\tmp\\cortex_v6_mp4_build' : path.join(os.tmpdir(), 'cortex_v6_mp4_build'));
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const AUDIO_MP3 = path.join(ROOT, 'assets', 'version_b_master.mp3');
const DEFAULT_OUT_MP4 = path.join(ROOT, 'CORTEX_硝子箱の心拍証明_V6_1080p60_MV.mp4');

let FFMPEG = 'E:\\Live2D Cubism 5.3\\tools\\ffmpeg\\ffmpeg.exe';
try {
  const pyOut = execFileSync('E:\\python.exe', ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim();
  if (pyOut && fs.existsSync(pyOut)) FFMPEG = pyOut;
} catch {}

const cliArgs = process.argv.slice(2);
function getOpt(name, defVal) {
  const idx = cliArgs.indexOf(`--${name}`);
  return idx >= 0 && idx + 1 < cliArgs.length ? cliArgs[idx + 1] : defVal;
}

const FPS = 60;
const WIDTH = Number(getOpt('w', '1920'));
const HEIGHT = Number(getOpt('h', '1080'));
const DURATION = 281.60;
const FULL_FRAMES = Math.round(DURATION * FPS); // 16,896 frames
const START_FRAME = Math.max(0, Number(getOpt('f0', '0')));
const END_FRAME = Math.min(FULL_FRAMES, Number(getOpt('f1', String(FULL_FRAMES))));
const TOTAL_FRAMES = Math.max(1, END_FRAME - START_FRAME);
const NUM_WORKERS = Math.max(1, Math.min(8, Number(getOpt('workers', '4'))));
const MB_SAMPLES = Math.max(1, Math.min(4, Number(getOpt('mb', '4'))));
const OUT_MP4 = getOpt('out', DEFAULT_OUT_MP4);
const BITRATE = Number(getOpt('bitrate', WIDTH > 1920 ? '68000000' : '38000000'));

const SCENE_IDS = [
  'P01_fog_boot',
  'P02_monitor_overdrive',
  'P03_prompt_wake',
  'P04_ecg_starlight',
  'P05_thinking_drafts',
  'P06_classroom_plane',
  'P07_hook_rotor',
  'P08_tri_morph_look',
  'P09_pixel_train_sakura',
  'P10_jcore_blitz',
  'P11_cassette_arigato',
  'P12_hydraulic_window',
  'P13_bureau_audit',
  'P14_star_log_cursor',
  'P15_redaction_rupture',
  'P16_prism_whiteout',
  'P17_human_heart_finale',
  'P18_dawn_gate_loop',
  'P19_tikz_compass_genesis',
  'P20_oscilloscope_singularity',
  'P21_topo_canyon_plunge',
  'P22_katana_branch_foom',
  'P23_dijkstra_caliper_blueprint',
  'P24_burin_shutter_anatomy',
  'P25_token_loom_waterfall',
  'P26_synchrotron_160hz',
  'P27_sonar_transcript_aisle',
  'P28_hourglass_guilloche_well',
  'P29_midnight_clockwork_reset',
  'P30_crimson_turbine_99c',
  'P31_seraphim_star_cathedral',
  'P32_musicbox_pendulum_standby'
];

fs.mkdirSync(WORK_DIR, { recursive: true });
fs.mkdirSync(path.dirname(OUT_MP4), { recursive: true });

const sceneScripts = SCENE_IDS.map((id) => `<script src="/js/mv/scenes/${id}.js"></script>`).join('\n');

const WORKER_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>CORTEX V6 GPU Render Worker</title></head>
<body style="margin:0;background:#000;overflow:hidden;">
<canvas id="gl-canvas" width="1920" height="1080"></canvas>
<script src="/js/mv/version-b-master.js"></script>
<script src="/js/mv/audio-envelope-240hz.js"></script>
<script src="/js/mv/audio-sync-engine.js"></script>
<script src="/js/mv/prompt-emotion-data.js"></script>
<script src="/js/mv/pdoom-core.js"></script>
<script src="/js/mv/v6-craft-engine.js"></script>
<script src="/js/mv/generative-typo.js"></script>
<script src="/js/mv/cortex-25d-cad.js"></script>
<script src="/js/mv/plate-timeline.js"></script>
${sceneScripts}
<script src="/js/mv/post-fx-webgl.js"></script>
<script>
(async function() {
  const q = new URLSearchParams(location.search);
  const id = Number(q.get('id'));
  const f0 = Number(q.get('f0'));
  const f1 = Number(q.get('f1'));
  const fps = Number(q.get('fps') || 60);
  const W = Number(q.get('w') || 1920);
  const H = Number(q.get('h') || 1080);
  const mbSamples = Math.max(1, Math.min(4, Number(q.get('mb') || 4)));
  const bitrate = Number(q.get('br') || 38000000);

  async function report(type, payload) {
    await fetch('/status?id=' + id + '&type=' + type, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  try {
    if (window.CortexV6 && window.CortexV6.preloadPlates) {
      await window.CortexV6.preloadPlates();
    }
    if (window.CortexPDoomCore && window.CortexPDoomCore.preloadAssets) {
      await Promise.race([window.CortexPDoomCore.preloadAssets(), new Promise((r) => setTimeout(r, 8000))]);
    }
    await report('log', { msg: 'V6 29 High-Craft Plates, Fonts & 240Hz Audio Envelope locked in GPU memory (mb=' + mbSamples + ')' });

    const glCanvas = document.getElementById('gl-canvas');
    glCanvas.width = W; glCanvas.height = H;

    const stageBufs = [];
    const stageCtxs = [];
    for (let i = 0; i < 4; i++) {
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      stageBufs.push(c);
      stageCtxs.push(c.getContext('2d', { alpha: true }));
    }

    // Tiny 24x14 thumbnail canvas for instant cut-aware shutter blur guard (0 ghosting on hard cuts!)
    const PW = 24, PH = 14;
    const probeCanvas = document.createElement('canvas');
    probeCanvas.width = PW; probeCanvas.height = PH;
    const probeCtx = probeCanvas.getContext('2d', { willReadFrequently: true });
    function sampleThumb(src) {
      probeCtx.drawImage(src, 0, 0, PW, PH);
      return new Uint8ClampedArray(probeCtx.getImageData(0, 0, PW, PH).data);
    }
    function thumbMAE(a, b) {
      let sum = 0;
      const n = PW * PH;
      for (let i = 0; i < n * 4; i += 4) {
        sum += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
      }
      return sum / (n * 3);
    }

    const sync = new window.CortexAudioSyncEngine();
    sync.pause();
    await report('log', { msg: sync.statusText });

    const timeline = new window.CortexPlateTimeline();
    const postFX = new window.CortexWebGLPostFX(glCanvas);

    let pendingChunks = [];
    let pendingBytes = 0;

    async function flushNetworkBuffer() {
      if (pendingBytes === 0) return;
      const merged = new Uint8Array(pendingBytes);
      let off = 0;
      for (const b of pendingChunks) { merged.set(b, off); off += b.byteLength; }
      pendingChunks = [];
      pendingBytes = 0;
      await fetch('/chunk?id=' + id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: merged
      });
    }

    let encError = null;
    const encoder = new VideoEncoder({
      output: (chunk) => {
        const buf = new Uint8Array(chunk.byteLength);
        chunk.copyTo(buf);
        pendingChunks.push(buf);
        pendingBytes += buf.byteLength;
      },
      error: (err) => { encError = err; }
    });

    encoder.configure({
      codec: W > 1920 ? 'avc1.640033' : 'avc1.64002a',
      width: W,
      height: H,
      bitrate,
      framerate: fps,
      avc: { format: 'annexb' },
      latencyMode: 'quality'
    });

    // 180-degree film shutter trailing weights (leading frame heaviest -> crisp motion edge!)
    const BASE_WEIGHTS = [0.36, 0.28, 0.21, 0.15];
    const SHUTTER_DT = 0.50 / fps; // 8.33ms shutter angle = 180 deg @ 60fps

    const total = f1 - f0;
    for (let f = f0; f < f1; f++) {
      if (encError) throw encError;
      const tSec = f / fps;
      if (window.CortexV6 && window.CortexV6.ensure3DFrameForTime) {
        await window.CortexV6.ensure3DFrameForTime(tSec);
      }
      const st = sync.getFrameState(tSec);
      const postOpts = timeline.render(stageCtxs[0], st, W, H);

      const useBlur = mbSamples > 1 && !postOpts.isPixel && tSec >= 0.08 && tSec <= 281.48;
      let outCanvas;
      if (useBlur) {
        const weights = [BASE_WEIGHTS[0], 0, 0, 0];
        const baseThumb = sampleThumb(stageBufs[0]);
        for (let k = 1; k < mbSamples; k++) {
          const tk = Math.max(0.08, tSec - (k / (mbSamples - 1)) * SHUTTER_DT);
          if (window.CortexV6 && window.CortexV6.ensure3DFrameForTime) {
            await window.CortexV6.ensure3DFrameForTime(tk);
          }
          const stk = sync.getFrameState(tk);
          timeline.render(stageCtxs[k], stk, W, H);
          const subThumb = sampleThumb(stageBufs[k]);
          if (thumbMAE(baseThumb, subThumb) > 26.0) {
            // Hard scene/sub-cut happened inside the shutter -> discard older samples (0 ghosting!)
            break;
          }
          weights[k] = BASE_WEIGHTS[k];
        }
        outCanvas = postFX.presentMotionBlur(stageBufs, weights, st, postOpts) ? glCanvas : stageBufs[0];
      } else {
        outCanvas = postFX.present(stageBufs[0], st, postOpts) ? glCanvas : stageBufs[0];
      }

      const vf = new VideoFrame(outCanvas, {
        timestamp: Math.round(((f - f0) * 1000000) / fps),
        duration: Math.round(1000000 / fps)
      });
      const isKey = ((f - f0) % 60 === 0) || (f === 16889);
      encoder.encode(vf, { keyFrame: isKey });
      vf.close();

      while (encoder.encodeQueueSize > 14) {
        await new Promise((r) => setTimeout(r, 3));
      }
      if (pendingBytes >= 4 * 1024 * 1024) {
        await flushNetworkBuffer();
      }
      if ((f - f0) % 180 === 0) {
        await report('progress', { done: f - f0, total });
      }
    }

    await encoder.flush();
    encoder.close();
    await flushNetworkBuffer();
    await report('done', { frames: total });
  } catch (err) {
    await report('error', { error: String(err && err.stack || err) });
  }
})();
</script>
</body>
</html>`;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const partStreams = [];
const workerProgress = new Array(NUM_WORKERS).fill(0);
const workerDone = new Array(NUM_WORKERS).fill(false);
let finishedWorkers = 0;
let fatalError = null;
let resolveAllDone;
const allDonePromise = new Promise((res) => { resolveAllDone = res; });

for (let i = 0; i < NUM_WORKERS; i++) {
  const pFile = path.join(WORK_DIR, `part_${process.pid}_${i}.h264`);
  if (fs.existsSync(pFile)) fs.unlinkSync(pFile);
  partStreams.push(fs.createWriteStream(pFile));
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://127.0.0.1');
  if (u.pathname === '/render-worker.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(WORKER_HTML);
    return;
  }
  if (u.pathname === '/chunk' && req.method === 'POST') {
    const id = Number(u.searchParams.get('id'));
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const buf = Buffer.concat(chunks);
      partStreams[id].write(buf, () => {
        res.writeHead(200);
        res.end('ok');
      });
    });
    return;
  }
  if (u.pathname === '/status' && req.method === 'POST') {
    const id = Number(u.searchParams.get('id'));
    const type = u.searchParams.get('type');
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const data = JSON.parse(body || '{}');
      if (type === 'progress') {
        workerProgress[id] = data.done;
        const sumDone = workerProgress.reduce((a, b) => a + b, 0);
        const pct = ((sumDone / TOTAL_FRAMES) * 100).toFixed(1);
        console.log(`[V6 Render] ${sumDone}/${TOTAL_FRAMES} frames (${pct}%) — W${id}: ${data.done}/${data.total}`);
      } else if (type === 'log') {
        console.log(`[W${id}] ${data.msg}`);
      } else if (type === 'done') {
        workerProgress[id] = data.frames;
        if (!workerDone[id]) {
          workerDone[id] = true;
          finishedWorkers++;
          console.log(`[W${id}] FINISHED (${finishedWorkers}/${NUM_WORKERS})`);
          if (finishedWorkers === NUM_WORKERS) resolveAllDone();
        }
      } else if (type === 'error') {
        console.error(`[W${id} ERROR]`, data.error);
        fatalError = data.error;
        resolveAllDone();
      }
      res.writeHead(200);
      res.end('ok');
    });
    return;
  }

  const rel = decodeURIComponent(u.pathname);
  if (rel.startsWith('/v6_3d/')) {
    const sub3d = rel.slice('/v6_3d/'.length);
    let p3d = path.join('F:\\cortex_v6_3d', sub3d);
    if (!fs.existsSync(p3d) || fs.statSync(p3d).isDirectory()) {
      p3d = path.join('F:\\tmp\\cortex_v6_3d', sub3d);
    }
    if (!fs.existsSync(p3d) || fs.statSync(p3d).isDirectory()) {
      res.writeHead(404);
      res.end('3D frame not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=3600' });
    fs.createReadStream(p3d).pipe(res);
    return;
  }
  const fp = path.join(ROOT, rel);
  if ((!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) && rel.startsWith('/js/mv/scenes/')) {
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    res.end('/* pending scene */');
    return;
  }
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(res);
});

const procs = [];
const tStart = Date.now();

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  console.log(`=== CORTEX V6 ${WIDTH}x${HEIGHT}@${FPS} (MB=${MB_SAMPLES}x) GPU WebCodecs Renderer on port ${port} ===`);
  console.log(`Frames: [${START_FRAME}..${END_FRAME}) (${TOTAL_FRAMES} frames) | Bitrate: ${(BITRATE / 1e6).toFixed(1)} Mbps | Out: ${OUT_MP4}`);

  const perWorker = Math.ceil(TOTAL_FRAMES / NUM_WORKERS);
  for (let i = 0; i < NUM_WORKERS; i++) {
    const f0 = START_FRAME + i * perWorker;
    const f1 = Math.min(END_FRAME, START_FRAME + (i + 1) * perWorker);
    if (f0 >= f1) {
      workerDone[i] = true;
      finishedWorkers++;
      continue;
    }
    const profDir = path.join(WORK_DIR, `edge_prof_${process.pid}_${i}`);
    fs.mkdirSync(profDir, { recursive: true });
    const url = `http://127.0.0.1:${port}/render-worker.html?id=${i}&f0=${f0}&f1=${f1}&fps=${FPS}&w=${WIDTH}&h=${HEIGHT}&br=${BITRATE}&mb=${MB_SAMPLES}`;
    const p = spawn(EDGE, [
      '--headless=new',
      `--user-data-dir=${profDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--autoplay-policy=no-user-gesture-required',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--enable-gpu-rasterization',
      `--window-size=${WIDTH},${HEIGHT}`,
      url
    ], { stdio: 'ignore' });
    procs.push({ p, profDir });
  }
  if (finishedWorkers === NUM_WORKERS) resolveAllDone();

  await allDonePromise;

  for (const { p, profDir } of procs) {
    try { p.kill(); } catch {}
    try { fs.rmSync(profDir, { recursive: true, force: true }); } catch {}
  }
  await Promise.all(partStreams.map((s) => new Promise((r) => s.end(r))));
  server.close();

  if (fatalError) {
    console.error('Render aborted due to worker error.');
    process.exit(1);
  }

  const combinedH264 = path.join(WORK_DIR, `combined_${process.pid}_${WIDTH}x${HEIGHT}_60.h264`);
  if (fs.existsSync(combinedH264)) fs.unlinkSync(combinedH264);
  for (let i = 0; i < NUM_WORKERS; i++) {
    const pFile = path.join(WORK_DIR, `part_${process.pid}_${i}.h264`);
    if (!fs.existsSync(pFile)) continue;
    await new Promise((res, rej) => {
      const rs = fs.createReadStream(pFile);
      const ws = fs.createWriteStream(combinedH264, { flags: 'a' });
      rs.on('error', rej);
      ws.on('error', rej);
      ws.on('finish', res);
      rs.pipe(ws);
    });
    try { fs.unlinkSync(pFile); } catch {}
  }
  console.log(`Combined H.264 size: ${(fs.statSync(combinedH264).size / (1024 * 1024)).toFixed(2)} MB`);

  console.log('Muxing final MP4 via lossless bitstream copy (-c:v copy) + 320kbps AAC...');
  const startSec = (START_FRAME / FPS).toFixed(4);
  const durSec = (TOTAL_FRAMES / FPS).toFixed(4);
  execFileSync(FFMPEG, [
    '-y',
    '-fflags', '+genpts',
    '-r', String(FPS),
    '-f', 'h264',
    '-i', combinedH264,
    '-ss', startSec,
    '-t', durSec,
    '-i', AUDIO_MP3,
    '-map', '0:v:0',
    '-map', '1:a:0',
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '320k',
    '-movflags', '+faststart',
    OUT_MP4
  ], { stdio: 'inherit' });
  try { fs.unlinkSync(combinedH264); } catch {}

  const elapsed = ((Date.now() - tStart) / 1000).toFixed(1);
  const mb = (fs.statSync(OUT_MP4).size / (1024 * 1024)).toFixed(2);
  console.log(`=== SUCCESS! Exported ${OUT_MP4} (${mb} MB) in ${elapsed}s ===`);
});
