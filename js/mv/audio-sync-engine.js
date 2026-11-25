// ============================================================================
// CORTEX // Dual-Lock Sub-Millisecond Audio & 240Hz Real Envelope Engine
// Phase-2 Upgrade:
//  1. Instant lock onto pre-baked `window.CORTEX_AUDIO_ENV_240HZ` (48kHz zero-phase
//     FFT + sliding-window P95 adaptive transient pulses, zero CORS/async race).
//  2. Deterministic `getFrameState(explicitTimeSec)` completely isolated from
//     browser `localStorage` offset pollution.
//  3. High-contrast `kickPulse`, `snareSnap`, `arp16Tick`, `vocalGate`, `whipPre`
//     + upgraded `kick`, `snare`, `beatPulse`, `kickEnv`, `snareEnv`, `arp16Env`, `vocalEnv`.
//  4. Strict loop-closure zeroing (`t < 0.05` & `t > 281.50`) for RMS = 0.000 loop!
// ============================================================================
(function () {
  'use strict';

  const MASTER = window.CORTEX_MV_MASTER;
  const ANCHORS = MASTER.beatAnchors;
  const CUES = MASTER.cues;
  const SCAN_HZ = 240; // 4.1667ms resolution

  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  function smoothRamp(e0, e1, x) {
    const u = clamp((x - e0) / Math.max(1e-6, e1 - e0), 0, 1);
    return u * u * (3 - 2 * u);
  }

  class CortexAudioSyncEngine {
    constructor() {
      this.mode = 'stream'; // 'stream' | 'buffer' | 'synth'
      this.playing = false;
      let savedMs = 0;
      try {
        savedMs = Number(localStorage.getItem('cortex_mv_offset_ms') || 0);
        if (!Number.isFinite(savedMs)) savedMs = 0;
      } catch (_) {
        savedMs = 0;
      }
      this.syncOffsetSec = clamp(savedMs, -300, 300) / 1000;
      this.duration = MASTER.duration;

      // Prefer local master MP3 first, with Suno CDN backup
      this.audioEl = new Audio();
      this.audioEl.preload = 'auto';
      this.audioEl.src = 'assets/version_b_master.mp3';
      this.triedPrimaryUrl = false;
      this.triedBackupUrl = false;

      // Monotonic PLL state for live playback only
      this._pllAudioRef = 0;
      this._pllPerfRef = typeof performance !== 'undefined' ? performance.now() : 0;
      this._lastRawAudioTime = -1;
      this._virtualTime = 0;
      this._lastRafPerf = this._pllPerfRef;

      // WebAudio Buffer Mode + Pre-Baked 240Hz Zero-Phase Envelope Lock!
      this.audioCtx = null;
      this.audioBuffer = null;
      this.bufferSource = null;
      this._bufStartCtxTime = 0;
      this._bufOffsetTime = 0;
      this.bakedEnv = (typeof window !== 'undefined' && window.CORTEX_AUDIO_ENV_240HZ) || null;
      this.scanData = this.bakedEnv
        ? {
            kick: this.bakedEnv.kickPulse,
            snare: this.bakedEnv.snareSnap,
            arp16: this.bakedEnv.arp16Tick,
            vocal: this.bakedEnv.vocalGate,
            whipPre: this.bakedEnv.whipPre,
            length: this.bakedEnv.length,
            hz: this.bakedEnv.hz || SCAN_HZ,
            isBakedP95: true
          }
        : null;

      // Synth fallback state
      this.synthEnabled = false;
      this._lastSynthStep16 = -1;

      this.statusText = this.scanData
        ? '⚡ 240Hz 零相位 P95 真音频包络已锁定 (点击播放启动母带)'
        : '就绪 · 版本B直连流 (点击播放自动对轨)';
      this.onStatusChange = null;

      this._bindAudioEvents();
      if (!this.bakedEnv) {
        this._tryAutoCorsFetch('assets/version_b_master.mp3', MASTER.playUrlPrimary);
      }
    }

    _emitStatus(msg) {
      this.statusText = msg;
      if (typeof this.onStatusChange === 'function') this.onStatusChange(msg, this.mode);
    }

    _bindAudioEvents() {
      this.audioEl.addEventListener('loadedmetadata', () => {
        if (this.audioEl.duration && isFinite(this.audioEl.duration)) {
          this.duration = this.audioEl.duration;
        }
        if (this.mode === 'stream') {
          this._emitStatus(`⚡ 240Hz 真包络 + 母带就绪 (${this.duration.toFixed(1)}s · PLL 0.1ms 锁相环)`);
        }
      });

      this.audioEl.addEventListener('error', () => {
        if (!this.triedPrimaryUrl && MASTER.playUrlPrimary) {
          this.triedPrimaryUrl = true;
          this.audioEl.src = MASTER.playUrlPrimary;
          this.audioEl.load();
        } else if (!this.triedBackupUrl && MASTER.playUrlBackup) {
          this.triedBackupUrl = true;
          this.audioEl.src = MASTER.playUrlBackup;
          this.audioEl.load();
          this._emitStatus('切换备用版本B音源流...');
        } else if (this.mode === 'stream') {
          this.mode = 'synth';
          this.synthEnabled = true;
          this._emitStatus('已切换 193.5BPM 电音合成器 (240Hz预烘焙包络仍全程生效)');
        }
      });

      this.audioEl.addEventListener('ended', () => {
        this.seek(0);
        this.play();
      });
    }

    async _tryAutoCorsFetch(localUrl, remoteUrl) {
      for (const u of [localUrl, remoteUrl]) {
        if (!u) continue;
        try {
          const resp = await fetch(u);
          if (!resp.ok) continue;
          const arr = await resp.arrayBuffer();
          await this.decodeAndPreScanBuffer(arr, '版本B 240Hz PCM母带');
          return;
        } catch (_) {}
      }
    }

    ensureAudioContext() {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    }

    async loadLocalFile(file) {
      if (!file) return;
      this._emitStatus(`正在解码并执行 240Hz 自适应 P95 瞬态扫描: ${file.name} ...`);
      const wasPlaying = this.playing;
      const curT = this.getCurrentTime();
      this.pause();
      const arr = await file.arrayBuffer();
      await this.decodeAndPreScanBuffer(arr, file.name);
      this.seek(curT);
      if (wasPlaying) this.play();
    }

    async decodeAndPreScanBuffer(arrayBuffer, label = '本地音频') {
      const ctx = this.ensureAudioContext();
      const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
      this.audioBuffer = decoded;
      this.duration = decoded.duration;
      // Keep pre-baked zero-phase FFT envelope for default master unless user loaded a custom file
      if (!this.bakedEnv || (label && !label.includes('版本B'))) {
        this.scanData = this._preScanPCM240Hz(decoded);
      }
      const wasStreamPlaying = this.playing && this.mode === 'stream';
      const resumeT = this.getCurrentTime();
      if (wasStreamPlaying) {
        this.audioEl.pause();
      }
      this.mode = 'buffer';
      this.synthEnabled = false;
      this._emitStatus(`⚡ 240Hz 硬件采样级同步已锁定: ${label} (${decoded.duration.toFixed(2)}s)`);
      if (wasStreamPlaying) {
        this._startBufferAt(resumeT);
      }
    }

    // Drift-free 240Hz adaptive P95 scanner for custom user-dropped audio files
    _preScanPCM240Hz(audioBuffer) {
      if (this.bakedEnv && Math.abs(audioBuffer.duration - MASTER.duration) < 0.25) {
        return {
          kick: this.bakedEnv.kickPulse,
          snare: this.bakedEnv.snareSnap,
          arp16: this.bakedEnv.arp16Tick,
          vocal: this.bakedEnv.vocalGate,
          whipPre: this.bakedEnv.whipPre,
          length: this.bakedEnv.length,
          hz: this.bakedEnv.hz || SCAN_HZ,
          isBakedP95: true
        };
      }
      const sr = audioBuffer.sampleRate;
      const ch0 = audioBuffer.getChannelData(0);
      const ch1 = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : ch0;
      const totalFrames = Math.ceil(audioBuffer.duration * SCAN_HZ);

      const kRms = new Float32Array(totalFrames);
      const sRms = new Float32Array(totalFrames);
      const aRms = new Float32Array(totalFrames);
      const vRms = new Float32Array(totalFrames);

      let lp1 = 0, lp2 = 0, mp = 0;
      const aLow = clamp((2 * Math.PI * 130) / sr, 0.005, 0.25);
      const aMid = clamp((2 * Math.PI * 2400) / sr, 0.02, 0.65);

      for (let f = 0; f < totalFrames; f++) {
        // Exact floating-point sample boundaries: zero cumulative drift!
        const s0 = Math.floor((f * sr) / SCAN_HZ);
        const s1 = Math.min(ch0.length, Math.floor(((f + 1) * sr) / SCAN_HZ));
        let eLow = 0, eMid = 0, eHigh = 0;
        for (let i = s0; i < s1; i++) {
          const x = 0.5 * (ch0[i] + ch1[i]);
          lp1 += aLow * (x - lp1);
          lp2 += aLow * (lp1 - lp2);
          mp += aMid * (x - mp);
          const bL = lp2;
          const bM = mp - lp2;
          const bH = x - mp;
          eLow += bL * bL;
          eMid += bM * bM;
          eHigh += bH * bH;
        }
        const n = Math.max(1, s1 - s0);
        const kv = Math.sqrt(eLow / n);
        const mv = Math.sqrt(eMid / n);
        const hv = Math.sqrt(eHigh / n);
        kRms[f] = kv;
        vRms[f] = mv;
        sRms[f] = hv * 0.72 + mv * 0.28;
        aRms[f] = hv;
      }

      const buildPulse = (rms, fluxGain, hlSec) => {
        const raw = new Float32Array(totalFrames);
        const gamma = Math.pow(0.5, 1 / Math.max(1, hlSec * SCAN_HZ));
        let cur = 0;
        for (let f = 0; f < totalFrames; f++) {
          const d1 = f > 0 ? Math.max(0, rms[f] - rms[f - 1]) : 0;
          const d2 = f > 1 ? Math.max(0, rms[f] - rms[f - 2]) : 0;
          const v = rms[f] * 0.06 + (0.6 * d1 + 0.4 * d2) * fluxGain;
          cur = v >= cur * gamma ? v : cur * gamma;
          raw[f] = cur;
        }
        // Sliding window P95 normalization (every 48 bins = 0.2s)
        const out = new Float32Array(totalFrames);
        const win = Math.round(3.2 * SCAN_HZ);
        const tmp = [];
        let ref = 1e-4;
        for (let f = 0; f < totalFrames; f++) {
          if (f % 48 === 0) {
            tmp.length = 0;
            const lo = Math.max(0, f - win);
            const hi = Math.min(totalFrames, f + win);
            for (let j = lo; j < hi; j += 4) tmp.push(raw[j]);
            tmp.sort((a, b) => a - b);
            ref = Math.max(1e-4, tmp[Math.min(tmp.length - 1, Math.floor(tmp.length * 0.95))] || 1e-4);
          }
          out[f] = Math.pow(clamp(raw[f] / ref, 0, 1), 1.15);
        }
        return out;
      };

      const kick = buildPulse(kRms, 2.8, 0.042);
      const snare = buildPulse(sRms, 3.0, 0.034);
      const arp16 = buildPulse(aRms, 2.6, 0.020);
      const vocal = buildPulse(vRms, 0.8, 0.060);
      const whipPre = new Float32Array(totalFrames);
      const preFrames = Math.round(0.065 * SCAN_HZ);
      for (let f = 0; f < totalFrames; f++) {
        let best = 0;
        const lim = Math.min(totalFrames - 1, f + preFrames);
        for (let j = f + 1; j <= lim; j++) {
          const imp = Math.max(kick[j], snare[j] * 0.95);
          if (imp > 0.56) {
            const u = 1 - (j - f) / preFrames;
            if (u * imp > best) best = u * imp;
          }
        }
        whipPre[f] = clamp(best, 0, 1);
      }

      return { kick, snare, arp16, vocal, whipPre, length: totalFrames, hz: SCAN_HZ, isBakedP95: true };
    }

    setSyncOffsetMs(ms) {
      this.syncOffsetSec = clamp(ms, -300, 300) / 1000;
      try {
        localStorage.setItem('cortex_mv_offset_ms', String(Math.round(ms)));
      } catch (_) {}
    }

    setCustomStreamUrl(url) {
      if (!url) return;
      const wasPlaying = this.playing;
      this.pause();
      this.mode = 'stream';
      this.synthEnabled = false;
      this.audioEl.src = url.trim();
      this.audioEl.load();
      this._tryAutoCorsFetch(url.trim());
      if (wasPlaying) this.play();
    }

    enableSynthFallback() {
      const t = this.getCurrentTime();
      const wasPlaying = this.playing;
      this.pause();
      this.ensureAudioContext();
      this.mode = 'synth';
      this.synthEnabled = true;
      this._virtualTime = t;
      this._emitStatus('🎹 193.5 BPM J-Core 内置合成器同频模式');
      if (wasPlaying) this.play();
    }

    _startBufferAt(offsetSec) {
      const ctx = this.ensureAudioContext();
      this._stopBufferSource();
      const src = ctx.createBufferSource();
      src.buffer = this.audioBuffer;
      src.connect(ctx.destination);
      const clamped = clamp(offsetSec, 0, Math.max(0, this.duration - 0.05));
      this._bufOffsetTime = clamped;
      this._bufStartCtxTime = ctx.currentTime;
      src.onended = () => {
        if (this.playing && this.mode === 'buffer') {
          const elapsed = ctx.currentTime - this._bufStartCtxTime + this._bufOffsetTime;
          if (elapsed >= this.duration - 0.15) {
            this._startBufferAt(0);
          }
        }
      };
      src.start(0, clamped);
      this.bufferSource = src;
    }

    _stopBufferSource() {
      if (this.bufferSource) {
        try {
          this.bufferSource.onended = null;
          this.bufferSource.stop();
          this.bufferSource.disconnect();
        } catch (_) {}
        this.bufferSource = null;
      }
    }

    async play() {
      this.playing = true;
      this._lastRafPerf = performance.now();
      if (this.mode === 'buffer' && this.audioBuffer) {
        this._startBufferAt(this._virtualTime);
      } else if (this.mode === 'stream') {
        try {
          await this.audioEl.play();
          this._pllAudioRef = this.audioEl.currentTime;
          this._pllPerfRef = performance.now();
        } catch (_) {
          this.ensureAudioContext();
          this.mode = 'synth';
          this.synthEnabled = true;
          this._emitStatus('已启用 193.5 BPM 内置电音合成预览 (240Hz真包络同步驱动)');
        }
      } else {
        this.ensureAudioContext();
      }
    }

    pause() {
      this._virtualTime = this.getCurrentTime();
      this.playing = false;
      if (this.mode === 'buffer') {
        this._stopBufferSource();
      } else if (this.mode === 'stream') {
        this.audioEl.pause();
      }
    }

    toggle() {
      if (this.playing) this.pause();
      else this.play();
      return this.playing;
    }

    seek(timeSec) {
      const t = clamp(timeSec, 0, this.duration);
      this._virtualTime = t;
      this._lastSynthStep16 = -1;
      if (this.mode === 'buffer' && this.audioBuffer) {
        if (this.playing) this._startBufferAt(t);
        else this._bufOffsetTime = t;
      } else if (this.mode === 'stream') {
        try {
          this.audioEl.currentTime = t;
        } catch (_) {}
        this._pllAudioRef = t;
        this._pllPerfRef = performance.now();
      }
    }

    getCurrentTime() {
      const now = performance.now();
      if (!this.playing) return this._virtualTime;

      if (this.mode === 'buffer' && this.audioCtx && this.bufferSource) {
        const t = (this.audioCtx.currentTime - this._bufStartCtxTime) + this._bufOffsetTime;
        this._virtualTime = t % this.duration;
        return this._virtualTime;
      }

      if (this.mode === 'stream' && !this.audioEl.paused) {
        const rawT = this.audioEl.currentTime;
        if (rawT !== this._lastRawAudioTime) {
          this._lastRawAudioTime = rawT;
          const predicted = this._pllAudioRef + (now - this._pllPerfRef) / 1000;
          const err = rawT - predicted;
          this._pllAudioRef = Math.abs(err) > 0.09 ? rawT : predicted + err * 0.35;
          this._pllPerfRef = now;
        }
        this._virtualTime = clamp(this._pllAudioRef + (now - this._pllPerfRef) / 1000, 0, this.duration);
        return this._virtualTime;
      }

      const dt = Math.min(0.1, (now - this._lastRafPerf) / 1000);
      this._lastRafPerf = now;
      this._virtualTime = (this._virtualTime + dt) % this.duration;
      return this._virtualTime;
    }

    mapTimeToBeat(t) {
      const tc = clamp(t, 0, MASTER.duration);
      for (let i = 0; i < ANCHORS.length - 1; i++) {
        const [t0, b0] = ANCHORS[i];
        const [t1, b1] = ANCHORS[i + 1];
        if (tc <= t1 || i === ANCHORS.length - 2) {
          const span = Math.max(0.001, t1 - t0);
          const u = clamp((tc - t0) / span, 0, 1);
          const cumBeat = b0 + u * (b1 - b0);
          const localBpm = ((b1 - b0) / span) * 60;
          return { cumBeat, localBpm };
        }
      }
      return { cumBeat: 0, localBpm: MASTER.nominalBpm };
    }

    findActiveCue(t) {
      const tc = clamp(t, 0, MASTER.duration);
      for (let i = 0; i < CUES.length; i++) {
        if (tc >= CUES[i].t0 && tc < CUES[i].t1) {
          return { cue: CUES[i], cueIndex: i, nextCue: CUES[Math.min(CUES.length - 1, i + 1)] };
        }
      }
      const last = CUES.length - 1;
      return { cue: CUES[last], cueIndex: last, nextCue: CUES[0] };
    }

    _triggerSynthIfNeeded(step16, secName) {
      if (!this.synthEnabled || !this.playing || !this.audioCtx) return;
      if (step16 === this._lastSynthStep16) return;
      this._lastSynthStep16 = step16;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const inBar = ((step16 % 16) + 16) % 16;
      const quiet = secName === 'INTRO' || secName === 'BRIDGE' || secName === 'OUTRO' || secName === 'STANDBY';
      const build = secName === 'BUILD-UP' || secName === 'OVERCLOCK!' || secName === 'BREAK!';

      const isKick = build
        ? inBar % 2 === 0
        : !quiet && (inBar === 0 || inBar === 4 || inBar === 8 || inBar === 12 || inBar === 14);

      if (isKick) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(39, now + 0.10);
        g.gain.setValueAtTime(0.24, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
        osc.connect(g).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      }

      const scale = secName === 'FINAL CHORUS' || secName === 'FINALE SOLO'
        ? [74, 77, 79, 82, 86, 89, 91, 94]
        : [73, 76, 78, 81, 85, 88, 90, 93];
      if (inBar % 2 === 0 || (!quiet && inBar % 3 === 0)) {
        const note = scale[(step16 * 3 + (inBar >> 1)) % scale.length];
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = quiet ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(440 * Math.pow(2, (note - 69) / 12), now);
        g.gain.setValueAtTime(quiet ? 0.045 : 0.065, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(g).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      }
    }

    _sampleEnv(arr, fPos, len) {
      if (!arr || !len) return 0;
      const i0 = clamp(Math.floor(fPos), 0, len - 1);
      const i1 = clamp(i0 + 1, 0, len - 1);
      return lerp(arr[i0], arr[i1], fPos - i0);
    }

    getFrameState(explicitTimeSec = null) {
      const isExplicit = explicitTimeSec !== null && explicitTimeSec !== undefined;
      const rawTime = isExplicit ? Number(explicitTimeSec) : this.getCurrentTime();
      // Deterministic offline export MUST NEVER be polluted by browser localStorage syncOffsetSec!
      const t = clamp(isExplicit ? rawTime : (rawTime + this.syncOffsetSec), 0, MASTER.duration);

      const { cumBeat, localBpm } = this.mapTimeToBeat(t);
      const barIdx = Math.floor(cumBeat / 4);
      const beatInBar = cumBeat - barIdx * 4;
      const beatPhase = cumBeat - Math.floor(cumBeat);
      const eighthStep = Math.floor(cumBeat * 2);
      const sixteenthStep = Math.floor(cumBeat * 4);

      const { cue, cueIndex, nextCue } = this.findActiveCue(t);
      if (!isExplicit) {
        this._triggerSynthIfNeeded(sixteenthStep, cue.sec);
      }

      const isDropOrChorus =
        cue.sec === 'CHORUS 1' || cue.sec === 'FINAL CHORUS' ||
        cue.sec === 'J-CORE DROP' || cue.sec === 'FINALE SOLO' || cue.sec === 'INTRO DROP';
      const isBuild = cue.sec === 'BUILD-UP' || cue.sec === 'OVERCLOCK!' || cue.sec === 'BREAK!';
      const isQuiet = cue.sec === 'INTRO' || cue.sec === 'BRIDGE' || cue.sec === 'OUTRO' || cue.sec === 'STANDBY';
      const isInstrumentalCue = !cue.tokens || cue.tokens.length === 0 || String(cue.id || '').startsWith('S0');

      // Sharp beat-grid skeleton (sub-frame locked to 193.5 BPM piecewise anchors)
      const gridKick = isQuiet
        ? Math.pow(1 - beatPhase, 7.5) * 0.28
        : Math.pow(1 - (isBuild ? (cumBeat * 2) % 1 : beatPhase), 5.2) * (isDropOrChorus ? 0.92 : 0.72);
      const snarePhase = ((cumBeat - 1) % 2 + 2) % 2;
      const gridSnare = isQuiet
        ? 0.04
        : (snarePhase < 1 ? Math.pow(1 - snarePhase, 6.2) : 0) * (isDropOrChorus || isBuild ? 0.92 : 0.62);
      const gridArp16 = Math.pow(1 - ((cumBeat * 4) % 1), 3.6) * (isQuiet ? 0.30 : 0.85);
      const cutDiv = cue.cutDiv || 1;
      const cutPhase = (cumBeat / cutDiv) % 1;
      const gridWhipPre = smoothRamp(0.78, 1.0, cutPhase);

      let kickPulse = gridKick;
      let snareSnap = gridSnare;
      let arp16Tick = gridArp16;
      let vocalGate = (!isInstrumentalCue && t <= (cue.tVocEnd || cue.t1))
        ? 0.55 + 0.45 * Math.abs(Math.sin(cumBeat * Math.PI * 2))
        : 0.0;
      let whipPre = gridWhipPre;

      // Primary drive: real 240Hz zero-phase P95 transient envelopes!
      const envSrc = this.scanData || (typeof window !== 'undefined' && window.CORTEX_AUDIO_ENV_240HZ
        ? {
            kick: window.CORTEX_AUDIO_ENV_240HZ.kickPulse,
            snare: window.CORTEX_AUDIO_ENV_240HZ.snareSnap,
            arp16: window.CORTEX_AUDIO_ENV_240HZ.arp16Tick,
            vocal: window.CORTEX_AUDIO_ENV_240HZ.vocalGate,
            whipPre: window.CORTEX_AUDIO_ENV_240HZ.whipPre,
            length: window.CORTEX_AUDIO_ENV_240HZ.length,
            hz: window.CORTEX_AUDIO_ENV_240HZ.hz || SCAN_HZ
          }
        : null);

      if (envSrc && envSrc.length > 0) {
        const hz = envSrc.hz || SCAN_HZ;
        const fPos = t * hz;
        const rKick = this._sampleEnv(envSrc.kick, fPos, envSrc.length);
        const rSnare = this._sampleEnv(envSrc.snare, fPos, envSrc.length);
        const rArp = this._sampleEnv(envSrc.arp16, fPos, envSrc.length);
        const rVoc = this._sampleEnv(envSrc.vocal, fPos, envSrc.length);
        const rWhip = this._sampleEnv(envSrc.whipPre, fPos, envSrc.length);

        kickPulse = clamp(Math.max(rKick, gridKick * (isQuiet ? 0.18 : 0.42)), 0, 1);
        snareSnap = clamp(Math.max(rSnare, gridSnare * (isQuiet ? 0.10 : 0.38)), 0, 1);
        arp16Tick = clamp(Math.max(rArp, gridArp16 * 0.32), 0, 1);
        vocalGate = isInstrumentalCue
          ? rVoc * 0.12
          : clamp(t <= (cue.tVocEnd || cue.t1) + 0.12 ? rVoc : rVoc * 0.25, 0, 1);
        whipPre = clamp(Math.max(rWhip, gridWhipPre * 0.55), 0, 1);
      }

      // Loop-closure exact zeroing at start & end standby frames (RMS = 0.000 guarantee)
      if (t < 0.05 || t > 281.50) {
        kickPulse = 0;
        snareSnap = 0;
        arp16Tick = 0;
        vocalGate = 0;
        whipPre = 0;
      }

      const beatPulse = (t < 0.05 || t > 281.50) ? 0 : clamp(Math.max(kickPulse, Math.pow(1 - beatPhase, 4.8)), 0, 1);

      const cueStartBeat = this.mapTimeToBeat(cue.t0).cumBeat;
      const beatsIntoCue = Math.max(0, cumBeat - cueStartBeat);
      const subCutIdx = Math.floor(beatsIntoCue / cutDiv);
      const shotKey = cue.shots[subCutIdx % cue.shots.length];
      const prevShotKey = cue.shots[(subCutIdx - 1 + cue.shots.length) % cue.shots.length];
      const cutAgeBeats = (beatsIntoCue / cutDiv) - subCutIdx;

      const cueProgress = clamp((t - cue.t0) / Math.max(0.05, cue.t1 - cue.t0), 0, 1);
      const useAltWorld = cue.worldAlt && cue.worldAlt !== cue.world && (
        isDropOrChorus ? (Math.floor(beatsIntoCue / 2) % 2 === 1) : (cueProgress > 0.52)
      );
      const activeWorld = useAltWorld ? cue.worldAlt : cue.world;

      return {
        t,
        rawTime,
        cumBeat,
        localBpm,
        barIdx,
        beatInBar,
        beatPhase,
        eighthStep,
        sixteenthStep,
        cue,
        cueIndex,
        nextCue,
        cueProgress,
        shotKey,
        prevShotKey,
        subCutIdx,
        cutAgeBeats,
        activeWorld,
        // Canonical Phase-2 high-contrast 240Hz real audio envelopes
        kickPulse,
        snareSnap,
        arp16Tick,
        vocalGate,
        whipPre,
        // Full backward-compatible aliases so every scene responds punchily
        kick: kickPulse,
        snare: snareSnap,
        beatPulse,
        kickEnv: kickPulse,
        snareEnv: snareSnap,
        arp16Env: arp16Tick,
        vocalEnv: vocalGate,
        isDropOrChorus,
        isBuild,
        isQuiet
      };
    }
  }

  window.CortexAudioSyncEngine = CortexAudioSyncEngine;
})();
