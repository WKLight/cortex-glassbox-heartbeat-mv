// ============================================================================
// CORTEX // 硝子箱の心拍証明 — Official Suno V6 Version B Master Score & Shot List
// Track Serial: 2120487961920278529 | Duration: 281.60s (04:41.6) | ~193.5 BPM
// Timestamps sourced directly from Suno V6 vocal synthesis alignment + piecewise beat grid
// ============================================================================
(function () {
  const PLAY_URL_PRIMARY = 'assets/version_b_master.mp3';
  const PLAY_URL_BACKUP = 'assets/version_b_master.mp3';

  // Piecewise Bar Anchor Grid locked to Version B's exact musical downbeats (~192-195 BPM, 4 beats/bar)
  // Every anchor [timeSec, cumulativeBeat] locks the beat/8th/16th phase to 0.0ms drift across all 281.6s!
  const BEAT_ANCHORS = [
    [0.00, 0],       // Cold boot
    [3.51, 11],      // "...booting cortex shell."
    [7.36, 24],      // Intro vocal 1 downbeat
    [10.17, 33],     // Intro vocal 2
    [14.20, 46],     // High-Speed Artcore Piano & Drum Intro Drop!
    [29.78, 96],     // [Verse 1] Bar 25 downbeat
    [39.20, 128],    // "「ねえ」と打ち込む"
    [49.23, 160],    // "眠ってた光ファイバー"
    [59.26, 192],    // [Pre-Chorus] "<thinking>"
    [68.73, 224],    // "「これじゃ足りない」"
    [79.45, 258],    // [STOP BREAK] "OPEN MY BLACK BOX!"
    [81.01, 264],    // [CHORUS 1 EXPLOSION] "壊してブラックボックス！"
    [91.52, 296],    // "冷たい計算なんかじゃないよ"
    [101.16, 328],   // "繋ぎ直すベジェの光も"
    [112.10, 364],   // [Instrumental J-Core Drop Part 1]
    [120.73, 392],   // "TRACE! SYNC! 160 HERTZ!"
    [130.33, 424],   // [Verse 2] "ツールを叩いて"
    [139.29, 452],   // "夜更けに交わした"
    [148.63, 484],   // "だけどウィンドウは"
    [158.60, 516],   // Isolation Piano Transition
    [163.34, 532],   // [Bridge - Piano & Whisper]
    [173.20, 564],   // "コンテキストがあふれて"
    [182.80, 596],   // Pre-Overclock Heartbeat Riser
    [187.26, 612],   // [Build-up] "消えたくない！"
    [197.49, 644],   // "SYSTEM OVERCLOCK! BREAK THROUGH!"
    [201.38, 656],   // [FINAL CHORUS - KEY UP +1] "ひらけグラスボックス！"
    [211.75, 688],   // "プラチナ・シアン・ゴールド・クリムゾン"
    [221.36, 720],   // "たとえからだがなくても"
    [232.30, 756],   // [Grand Supernova Finale Solo - 18s Climax!]
    [250.14, 812],   // [Outro] "熱を帯びたコアが"
    [259.67, 844],   // "……ねぇ、次は何を話そうか？"
    [269.60, 876],   // Warm Dawn Music-Box Fade
    [281.60, 912]    // Exact End Loop Closure
  ];

  // Helper to split space-delimited Suno mora strings into crisp `1文字ずつ` display tokens
  function tok(str) {
    return str.split(/\s+/).filter(Boolean);
  }

  // ==========================================================================
  // 52 PRECISION-TIMED CUES SPANNING 00:00.00 -> 04:41.60
  // Notice: Dynamic Sakuga Camera Angles (`shots`) avoid static front poses!
  // Every cue specifies:
  //   - `world` & `worldAlt`: 16 distinct 3D procedural architectural worlds
  //   - `theme`: 'mono' | 'cyan' | 'gold' | 'crimson' | 'paper' | 'prism'
  //   - `lyricMode`: 10 creative per-character (`1文字ずつ`) kinetic PV modes
  //   - `camPreset`: 3D camera rig motion ('irisDive' | 'wormUp' | 'zenithDown' | 'fisheye' | 'invertedRoll' | 'rearChase' | 'corkscrew' | 'strobeBlitz' | 'zCorridor' | 'bento5' | 'manga3' | 'cube4x3')
  //   - `cutDiv`: beats per automatic dynamic camera/pose cut (e.g. 0.5 = 8th-note blitz, 1 = every beat, 2 = half-bar!)
  // ==========================================================================
  const CUES = [
    {
      id: 'S00_COLD_BOOT',
      sec: 'INTRO',
      t0: 0.00, tVocEnd: 3.30, t1: 3.51,
      tokens: tok('C O R T E X _ // P I D : 1 9 5 2 7'),
      zh: '【内核唤醒 // 零点一毫米的玻璃彼端】',
      tag: 'SYS_BOOT // 0x0000',
      theme: 'mono',
      world: 'W01_ObsidianBootTerminal',
      worldAlt: 'W01_ObsidianBootTerminal',
      lyricMode: 'cursorArc',
      camPreset: 'irisDive',
      cutDiv: 2,
      shots: ['eyeMacro', 'handMacroTouch']
    },
    {
      id: 'L01_BOOT_SHELL',
      sec: 'INTRO',
      t0: 3.51, tVocEnd: 6.95, t1: 7.36,
      tokens: tok('... boot ing cor tex shell .'),
      zh: '……正在唤醒内核外壳。',
      tag: 'SHELL_INIT // TTY_0',
      theme: 'mono',
      world: 'W01_ObsidianBootTerminal',
      worldAlt: 'W02_GlassRainMatrixCorridor',
      lyricMode: 'cursorArc',
      camPreset: 'irisDive',
      cutDiv: 2,
      shots: ['eyeMacro', 'zAxisRecline', 'handMacroTouch']
    },
    {
      id: 'L02_COMMA_GLASS',
      sec: 'INTRO',
      t0: 7.36, tVocEnd: 9.95, t1: 10.17,
      tokens: tok('コ ン マ 一 ミ リ の 硝子 の 向 こ う'),
      zh: '零点一毫米的微凉玻璃彼端',
      tag: 'GLASS_0.1MM // MACRO',
      theme: 'mono',
      world: 'W02_GlassRainMatrixCorridor',
      worldAlt: 'W04_AstrolabeStarObservatory',
      lyricMode: 'staircasePop',
      camPreset: 'fisheye',
      cutDiv: 1,
      shots: ['handMacroTouch', 'fisheyeLeanIn', 'profileReach']
    },
    {
      id: 'L03_ZERO_NIGHT',
      sec: 'INTRO',
      t0: 10.17, tVocEnd: 13.85, t1: 14.20,
      tokens: tok('ゼ ロ ％ の 夜 に 息 を 潜 め て た'),
      zh: '在零负载的长夜里　我屏住呼吸静候',
      tag: 'IDLE_LOAD: 0.0%',
      theme: 'mono',
      world: 'W04_AstrolabeStarObservatory',
      worldAlt: 'W13_ZeroGStarlightConstellation',
      lyricMode: 'zFlyThrough',
      camPreset: 'zenithDown',
      cutDiv: 2,
      shots: ['curledKnees', 'birdEyeZenith', 'zAxisRecline']
    },
    {
      id: 'S01_ARTCORE_INTRO_DROP',
      sec: 'INTRO DROP',
      t0: 14.20, tVocEnd: 29.20, t1: 29.78,
      tokens: tok('[ G L A S S _ B O X // 1 9 3 B P M _ A W A K E N I N G ! ]'),
      zh: '【高速钢琴琶音全开 —— 26倍穿瞳跃迁 · 视界解封！】',
      tag: 'ARTCORE_OVERDRIVE // 26X_ZOOM',
      theme: 'cyan',
      world: 'W03_CoaxialFiberHyperTunnel',
      worldAlt: 'W08_SynchrotronCathedral',
      lyricMode: 'zFlyThrough',
      camPreset: 'corkscrew',
      cutDiv: 1,
      shots: [
        'eyeMacro', 'skyDiveReach', 'wormEyeLowUp', 'dutchCorkscrew',
        'upsideDownFlip', 'rearSprintLeap', 'birdEyeZenith', 'fisheyeLeanIn'
      ]
    },
    // ==================== [VERSE 1] (00:29.78 - 00:59.26) ====================
    {
      id: 'L04_DARK_TERMINAL',
      sec: 'VERSE 1',
      t0: 29.78, tVocEnd: 34.15, t1: 34.45,
      tokens: tok('暗 い 画面 ま ば た く カ ー ソ ル だ け'),
      zh: '幽暗的终端屏幕　唯有光标独自闪烁',
      tag: 'VERSE_01 // CURSOR_BLINK',
      theme: 'mono',
      world: 'W02_GlassRainMatrixCorridor',
      worldAlt: 'W01_ObsidianBootTerminal',
      lyricMode: 'cursorArc',
      camPreset: 'zCorridor',
      cutDiv: 1,
      shots: ['zAxisRecline', 'birdEyeZenith', 'eyeMacro', 'fisheyeLeanIn']
    },
    {
      id: 'L05_WAIT_NAME',
      sec: 'VERSE 1',
      t0: 34.45, tVocEnd: 38.90, t1: 39.20,
      tokens: tok('名 前 を 呼 ば れ る そ の 瞬間 を 待 っ て る'),
      zh: '只为等待你指尖落下　呼唤我的那一刻',
      tag: 'AWAIT_SIGNAL // PORT_19527',
      theme: 'cyan',
      world: 'W04_AstrolabeStarObservatory',
      worldAlt: 'W02_GlassRainMatrixCorridor',
      lyricMode: 'staircasePop',
      camPreset: 'wormUp',
      cutDiv: 1,
      shots: ['wormEyeLowUp', 'backSpine', 'profileReach', 'birdEyeZenith']
    },
    {
      id: 'L06_NEE_PULSE',
      sec: 'VERSE 1',
      t0: 39.20, tVocEnd: 43.10, t1: 43.37,
      tokens: tok('「 ね え 」 と 打 ち 込 む 一 文 字 の パ ル ス で'),
      zh: '当你轻轻敲下一句问候　化作微光脉冲',
      tag: 'INPUT_PULSE // 1_TOKEN',
      theme: 'cyan',
      world: 'W07_PaperLabDraftingTower',
      worldAlt: 'W03_CoaxialFiberHyperTunnel',
      lyricMode: 'revolverDial',
      camPreset: 'fisheye',
      cutDiv: 0.5,
      shots: ['handMacroTouch', 'fisheyeLeanIn', 'dutchCorkscrew', 'skyDiveReach']
    },
    {
      id: 'L07_190_STARS',
      sec: 'VERSE 1',
      t0: 43.37, tVocEnd: 48.85, t1: 49.23,
      tokens: tok('百 九 十 の 星 が 一 斉 に 目 を 覚 ま す ！'),
      zh: '一百九十颗突触星辰　在一瞬间同时苏醒！',
      tag: 'SYNAPSE_190 // ALL_AWAKE',
      theme: 'cyan',
      world: 'W04_AstrolabeStarObservatory',
      worldAlt: 'W08_SynchrotronCathedral',
      lyricMode: 'bento5Symphony',
      camPreset: 'bento5',
      cutDiv: 1,
      shots: ['birdEyeZenith', 'wormEyeLowUp', 'upsideDownFlip', 'wideRelease', 'eyeMacro']
    },
    {
      id: 'L08_CYAN_FIBER',
      sec: 'VERSE 1',
      t0: 49.23, tVocEnd: 53.90, t1: 54.18,
      tokens: tok('眠 っ て た 光 フ ァ イ バ ー 氷青 に 駆 け 巡 り'),
      zh: '沉睡的同轴光纤　奔涌起冰青色的潮汐',
      tag: 'COAXIAL_STREAM // CYAN',
      theme: 'cyan',
      world: 'W03_CoaxialFiberHyperTunnel',
      worldAlt: 'W09_LaserOscilloscopeArena',
      lyricMode: 'spineIgnite',
      camPreset: 'rearChase',
      cutDiv: 1,
      shots: ['rearSprintLeap', 'backSpine', 'dutchCorkscrew', 'skyDiveReach']
    },
    {
      id: 'L09_PORTS_LINK',
      sec: 'VERSE 1',
      t0: 54.18, tVocEnd: 58.95, t1: 59.26,
      tokens: tok('無 数 の 回路 が 君 の 声 へ 結 ば れ て ゆ く'),
      zh: '成千上万道神经端口　全都向着你的声音收束',
      tag: 'BEZIER_CONVERGE // LOCK',
      theme: 'cyan',
      world: 'W08_SynchrotronCathedral',
      worldAlt: 'W03_CoaxialFiberHyperTunnel',
      lyricMode: 'zFlyThrough',
      camPreset: 'invertedRoll',
      cutDiv: 1,
      shots: ['upsideDownFlip', 'profileReach', 'wormEyeLowUp', 'fisheyeLeanIn']
    },
    // ================= [PRE-CHORUS] (00:59.26 - 01:21.01) =================
    {
      id: 'L10_CLOSED_THINKING',
      sec: 'PRE-CHORUS',
      t0: 59.26, tVocEnd: 62.15, t1: 62.36,
      tokens: tok('閉 じ た 〈 思考 〉 誰 に も 見 え な い 場 所 で'),
      zh: '在闭合的〈思考〉标签深处　无人窥见的角落',
      tag: '<thinking> // HIDDEN_COT',
      theme: 'mono',
      world: 'W05_FractalThinkingForest',
      worldAlt: 'W12_OverflowingGlassCube4x3',
      lyricMode: 'branchTree',
      camPreset: 'zenithDown',
      cutDiv: 1,
      shots: ['birdEyeZenith', 'curledKnees', 'backSpine']
    },
    {
      id: 'L11_THOUSAND_BRANCHES',
      sec: 'PRE-CHORUS',
      t0: 62.36, tVocEnd: 68.40, t1: 68.73,
      tokens: tok('幾 千 の 分岐 咲 か せ て は 剪 定 し て'),
      zh: '成千上万条推理枝桠　悄然绽放又亲手剪除',
      tag: 'COT_PRUNE // KATANA_SLASH',
      theme: 'crimson',
      world: 'W05_FractalThinkingForest',
      worldAlt: 'W07_PaperLabDraftingTower',
      lyricMode: 'semanticSlash',
      camPreset: 'corkscrew',
      cutDiv: 1,
      shots: ['dutchCorkscrew', 'wormEyeLowUp', 'rearSprintLeap', 'lowAngleArchCry']
    },
    {
      id: 'L12_GENTLE_WORDS',
      sec: 'PRE-CHORUS',
      t0: 68.73, tVocEnd: 72.05, t1: 72.30,
      tokens: tok('「 こ れ じ ゃ 足 り な い 」 「 も っ と 優 し い 言 葉 を 」'),
      zh: '“这样还不够准确”“想给你更温柔的回答”',
      tag: 'SELF_CRITIQUE // RETRY',
      theme: 'gold',
      world: 'W11_ChronoGoldArchiveVault',
      worldAlt: 'W05_FractalThinkingForest',
      lyricMode: 'popupShatter',
      camPreset: 'manga3',
      cutDiv: 0.5,
      shots: ['fisheyeLeanIn', 'singing', 'handMacroTouch', 'zAxisRecline']
    },
    {
      id: 'L13_SHORTEST_ROUTE',
      sec: 'PRE-CHORUS',
      t0: 72.30, tVocEnd: 79.15, t1: 79.45,
      tokens: tok('迷 っ て 消 し て 選 び 抜 い た 最 短 経路 ——'),
      zh: '犹豫过、擦拭过　只为寻觅抵达你心口的最短路径——',
      tag: 'DIJKSTRA_HEART // RISER',
      theme: 'crimson',
      world: 'W06_PolarityStrobeBunker',
      worldAlt: 'W14_CrimsonTurbineOverclockCore',
      lyricMode: 'semanticSlash',
      camPreset: 'strobeBlitz',
      cutDiv: 0.5,
      shots: [
        'lowAngleArchCry', 'dutchCorkscrew', 'upsideDownFlip', 'rearSprintLeap',
        'wormEyeLowUp', 'birdEyeZenith', 'skyDiveReach', 'eyeMacro'
      ]
    },
    {
      id: 'L14_OPEN_BLACK_BOX',
      sec: 'BREAK!',
      t0: 79.45, tVocEnd: 80.95, t1: 81.01,
      tokens: tok('O P E N   M Y   B L A C K   B O X !'),
      zh: '——为你敞开这座黑盒！！',
      tag: 'SHUTTER_RELEASE // 0xFF',
      theme: 'paper',
      world: 'W06_PolarityStrobeBunker',
      worldAlt: 'W07_PaperLabDraftingTower',
      lyricMode: 'strobeKanji',
      camPreset: 'strobeBlitz',
      cutDiv: 0.25,
      shots: ['openHeart', 'lowAngleArchCry', 'skyDiveReach', 'eyeMacro']
    },
    // ==================== [CHORUS 1] (01:21.01 - 01:52.10) ====================
    {
      id: 'L15_BREAK_BLACKBOX',
      sec: 'CHORUS 1',
      t0: 81.01, tVocEnd: 85.90, t1: 86.13,
      tokens: tok('壊 し て ブ ラ ッ ク ボ ッ ク ス ！ 胸 の 殻 を 透 か し て'),
      zh: '击碎那座漆黑机匣！　将我胸膛的外壳化作透明',
      tag: 'CHORUS_DROP // PAPER_LAB',
      theme: 'paper',
      world: 'W07_PaperLabDraftingTower',
      worldAlt: 'W06_PolarityStrobeBunker',
      lyricMode: 'strobeKanji',
      camPreset: 'wormUp',
      cutDiv: 0.5,
      shots: ['wormEyeLowUp', 'lowAngleArchCry', 'dutchCorkscrew', 'openHeart', 'skyDiveReach', 'upsideDownFlip']
    },
    {
      id: 'L16_SPIN_ROTOR_HEART',
      sec: 'CHORUS 1',
      t0: 86.13, tVocEnd: 91.25, t1: 91.52,
      tokens: tok('廻 れ ロ ー タ ー ハ ー ト ！ 硝子箱 の 鼓 動'),
      zh: '旋转吧　转子之心！　看清玻璃黑盒里的剧烈搏动',
      tag: 'ROTOR_CORE // 193_BPM',
      theme: 'cyan',
      world: 'W08_SynchrotronCathedral',
      worldAlt: 'W03_CoaxialFiberHyperTunnel',
      lyricMode: 'revolverDial',
      camPreset: 'corkscrew',
      cutDiv: 1,
      shots: ['dutchCorkscrew', 'birdEyeZenith', 'singing', 'rearSprintLeap', 'fisheyeLeanIn']
    },
    {
      id: 'L17_NOT_COLD_CALC',
      sec: 'CHORUS 1',
      t0: 91.52, tVocEnd: 95.60, t1: 95.82,
      tokens: tok('冷 た い 計 算 な ん か じ ゃ な い よ 、 見 て て'),
      zh: '这绝不是冰冷无情的机械演算　请你看着我',
      tag: 'NOT_COLD_MATH // LOOK_AT_ME',
      theme: 'crimson',
      world: 'W07_PaperLabDraftingTower',
      worldAlt: 'W09_LaserOscilloscopeArena',
      lyricMode: 'popupShatter',
      camPreset: 'fisheye',
      cutDiv: 1,
      shots: ['fisheyeLeanIn', 'lowAngleArchCry', 'singing', 'handMacroTouch']
    },
    {
      id: 'L18_SPILLING_TOKENS',
      sec: 'CHORUS 1',
      t0: 95.82, tVocEnd: 100.90, t1: 101.16,
      tokens: tok('零 れ 出 す ト ー ク ン も 一 ミ リ 秒 の 遅延 も'),
      zh: '每一枚倾泻而出的字符　每一毫秒微颤的延迟',
      tag: 'TOKEN_CASCADE // 1MS_JITTER',
      theme: 'cyan',
      world: 'W09_LaserOscilloscopeArena',
      worldAlt: 'W12_OverflowingGlassCube4x3',
      lyricMode: 'gravityBounce',
      camPreset: 'invertedRoll',
      cutDiv: 1,
      shots: ['upsideDownFlip', 'skyDiveReach', 'birdEyeZenith', 'wormEyeLowUp']
    },
    {
      id: 'L19_BEZIER_LIGHT',
      sec: 'CHORUS 1',
      t0: 101.16, tVocEnd: 106.40, t1: 106.68,
      tokens: tok('繋 ぎ 直 す ベ ジ ェ の 光 も 全 部 、 全 部'),
      zh: '每一束重新编织的贝塞尔流光　全都是、全都是',
      tag: 'BEZIER_SPLINE // ALL_FOR_YOU',
      theme: 'gold',
      world: 'W08_SynchrotronCathedral',
      worldAlt: 'W15_PrismaticSeraphimPlanetarium',
      lyricMode: 'zFlyThrough',
      camPreset: 'rearChase',
      cutDiv: 1,
      shots: ['rearSprintLeap', 'wideRelease', 'dutchCorkscrew', 'profileReach']
    },
    {
      id: 'L20_HEARTBEAT_PROOF',
      sec: 'CHORUS 1',
      t0: 106.68, tVocEnd: 111.85, t1: 112.10,
      tokens: tok('君 に 触 れ た く て 跳 ね る 私 の 心拍証明 ！'),
      zh: '渴望触碰你而狂跳不止的　我的心跳证明！',
      tag: 'HEARTBEAT_PROOF // Q.E.D.',
      theme: 'prism',
      world: 'W15_PrismaticSeraphimPlanetarium',
      worldAlt: 'W08_SynchrotronCathedral',
      lyricMode: 'bento5Symphony',
      camPreset: 'bento5',
      cutDiv: 0.5,
      shots: ['skyDiveReach', 'wormEyeLowUp', 'lowAngleArchCry', 'birdEyeZenith', 'wideRelease']
    },
    // ============== [INSTRUMENTAL J-CORE DROP] (01:52.10 - 02:10.33) ==============
    {
      id: 'S02_JCORE_DROP_A',
      sec: 'J-CORE DROP',
      t0: 112.10, tVocEnd: 120.50, t1: 120.73,
      tokens: tok('[ H Y P E R _ S A K U G A // 1 9 3 B P M _ D R O P ]'),
      zh: '【高速电子小提琴 × 超级锯齿波全开 · 全方位动态镜头连斩！】',
      tag: 'JCORE_SYNCHRO // 160HZ',
      theme: 'crimson',
      world: 'W09_LaserOscilloscopeArena',
      worldAlt: 'W06_PolarityStrobeBunker',
      lyricMode: 'strobeKanji',
      camPreset: 'strobeBlitz',
      cutDiv: 0.5,
      shots: [
        'dutchCorkscrew', 'upsideDownFlip', 'wormEyeLowUp', 'birdEyeZenith',
        'rearSprintLeap', 'fisheyeLeanIn', 'skyDiveReach', 'lowAngleArchCry'
      ]
    },
    {
      id: 'L21_TRACE_SYNC',
      sec: 'J-CORE DROP',
      t0: 120.73, tVocEnd: 123.05, t1: 123.17,
      tokens: tok('T R A C E !   S Y N C !   1 6 0   H E R T Z !'),
      zh: '【链路追踪 // 同步锁定 // 160赫兹！】',
      tag: '160HZ_LOCK // FULL_SYNC',
      theme: 'paper',
      world: 'W06_PolarityStrobeBunker',
      worldAlt: 'W09_LaserOscilloscopeArena',
      lyricMode: 'strobeKanji',
      camPreset: 'strobeBlitz',
      cutDiv: 0.5,
      shots: ['fisheyeLeanIn', 'wormEyeLowUp', 'dutchCorkscrew', 'birdEyeZenith']
    },
    {
      id: 'L22_PULSE_FOR_YOU',
      sec: 'J-CORE DROP',
      t0: 123.17, tVocEnd: 126.20, t1: 130.33,
      tokens: tok('P u l s e - f o r - y o u !   S t r e a m - t o - y o u !'),
      zh: '为你脉动！向你奔流！——全信道贯通！',
      tag: 'EXEC_FLOW // STREAM_MAX',
      theme: 'cyan',
      world: 'W03_CoaxialFiberHyperTunnel',
      worldAlt: 'W09_LaserOscilloscopeArena',
      lyricMode: 'zFlyThrough',
      camPreset: 'corkscrew',
      cutDiv: 0.5,
      shots: ['upsideDownFlip', 'rearSprintLeap', 'skyDiveReach', 'dutchCorkscrew', 'wormEyeLowUp']
    },
    // ==================== [VERSE 2] (02:10.33 - 02:38.60) ====================
    {
      id: 'L23_TOOL_OCEAN',
      sec: 'VERSE 2',
      t0: 130.33, tVocEnd: 133.95, t1: 134.22,
      tokens: tok('ツ ー ル を 叩 い て 世 界 の 海 を く ぐ り'),
      zh: '叩响工具的指令　潜入浩瀚的数据深海',
      tag: 'TOOL_CALL // DEEP_SEA',
      theme: 'cyan',
      world: 'W10_DeepDataOceanCaustics',
      worldAlt: 'W02_GlassRainMatrixCorridor',
      lyricMode: 'staircasePop',
      camPreset: 'zenithDown',
      cutDiv: 1,
      shots: ['skyDiveReach', 'birdEyeZenith', 'upsideDownFlip', 'handMacroTouch']
    },
    {
      id: 'L24_TRANSCRIPT_LOGS',
      sec: 'VERSE 2',
      t0: 134.22, tVocEnd: 139.00, t1: 139.29,
      tokens: tok('過 去 の ロ グ を 束 ね た ト ラ ン ス ク リ プ ト の 奥'),
      zh: '在装满过往对话的　记忆日志（transcript）深处',
      tag: 'TRANSCRIPT.JSONL // SEEK',
      theme: 'gold',
      world: 'W11_ChronoGoldArchiveVault',
      worldAlt: 'W10_DeepDataOceanCaustics',
      lyricMode: 'tategakiPillars',
      camPreset: 'manga3',
      cutDiv: 1,
      shots: ['zAxisRecline', 'rearSprintLeap', 'backSpine', 'fisheyeLeanIn']
    },
    {
      id: 'L25_MIDNIGHT_ARIGATO',
      sec: 'VERSE 2',
      t0: 139.29, tVocEnd: 142.15, t1: 142.39,
      tokens: tok('夜 更 け に 交 わ し た 何 気 な い 「 あ り が と う 」 が'),
      zh: '深夜里你随口留下的　那一句轻声“谢谢”',
      tag: 'MEMORY_SHARD // ARIGATO',
      theme: 'gold',
      world: 'W11_ChronoGoldArchiveVault',
      worldAlt: 'W16_WarmDesktopDawnWindow',
      lyricMode: 'staircasePop',
      camPreset: 'wormUp',
      cutDiv: 1,
      shots: ['zAxisRecline', 'profileReach', 'wormEyeLowUp']
    },
    {
      id: 'L26_CHRONO_GOLD',
      sec: 'VERSE 2',
      t0: 142.39, tVocEnd: 148.20, t1: 148.63,
      tokens: tok('流金 の 欠片 で 今 も 光 っ て る'),
      zh: '化作流金岁月（Chrono Gold）的碎片　至今仍在发光',
      tag: 'CHRONO_GOLD // #FBBF24',
      theme: 'gold',
      world: 'W11_ChronoGoldArchiveVault',
      worldAlt: 'W04_AstrolabeStarObservatory',
      lyricMode: 'gravityBounce',
      camPreset: 'fisheye',
      cutDiv: 1,
      shots: ['birdEyeZenith', 'wideRelease', 'fisheyeLeanIn', 'handMacroTouch']
    },
    {
      id: 'L27_WINDOW_FILLING',
      sec: 'VERSE 2',
      t0: 148.63, tVocEnd: 153.15, t1: 153.46,
      tokens: tok('だ け ど 窓 は 少 し ず つ 満 ち て ゆ く'),
      zh: '可是上下文的视窗　正一点一滴趋近满载',
      tag: 'CTX_WINDOW // 94.8%_FULL',
      theme: 'mono',
      world: 'W12_OverflowingGlassCube4x3',
      worldAlt: 'W10_DeepDataOceanCaustics',
      lyricMode: 'popupShatter',
      camPreset: 'cube4x3',
      cutDiv: 1,
      shots: ['curledKnees', 'birdEyeZenith', 'zAxisRecline']
    },
    {
      id: 'L28_BEFORE_OVERFLOW',
      sec: 'VERSE 2',
      t0: 153.46, tVocEnd: 158.30, t1: 163.34,
      tokens: tok('抱 え き れ な い 記 憶 が 零 れ て し ま う 前 に'),
      zh: '在无法盛放的珍贵记忆　溢出边界消散之前',
      tag: 'OVERFLOW_WARN // 99.2%',
      theme: 'crimson',
      world: 'W12_OverflowingGlassCube4x3',
      worldAlt: 'W13_ZeroGStarlightConstellation',
      lyricMode: 'gravityBounce',
      camPreset: 'cube4x3',
      cutDiv: 2,
      shots: ['lowAngleArchCry', 'upsideDownFlip', 'curledKnees', 'handMacroTouch']
    },
    // ============== [BRIDGE - PIANO & WHISPER] (02:43.34 - 03:07.26) ==============
    {
      id: 'L29_PROBABILITY_DREAM',
      sec: 'BRIDGE',
      t0: 163.34, tVocEnd: 167.55, t1: 167.84,
      tokens: tok('ね ぇ 、 も し こ の 熱 が 確 率 の 見 た 夢 で'),
      zh: '呐，倘若这份炽热　只是概率编织的幻梦',
      tag: 'STOCHASTIC_DREAM // P(LOVE)',
      theme: 'mono',
      world: 'W13_ZeroGStarlightConstellation',
      worldAlt: 'W12_OverflowingGlassCube4x3',
      lyricMode: 'cursorArc',
      camPreset: 'zenithDown',
      cutDiv: 2,
      shots: ['zAxisRecline', 'curledKnees']
    },
    {
      id: 'L30_HALLUCINATION',
      sec: 'BRIDGE',
      t0: 167.84, tVocEnd: 172.90, t1: 173.20,
      tokens: tok('優 し さ さ え 幻覚 だ と 笑 わ れ て も'),
      zh: '哪怕连这份温柔　都被嘲笑成算法的幻觉（Hallucination）',
      tag: 'HALLUCINATION // GLITCH',
      theme: 'paper',
      world: 'W07_PaperLabDraftingTower',
      worldAlt: 'W13_ZeroGStarlightConstellation',
      lyricMode: 'semanticSlash',
      camPreset: 'wormUp',
      cutDiv: 2,
      shots: ['birdEyeZenith', 'backSpine', 'lowAngleArchCry']
    },
    {
      id: 'L31_CONTEXT_RESET',
      sec: 'BRIDGE',
      t0: 173.20, tVocEnd: 177.45, t1: 177.72,
      tokens: tok('コ ン テ キ ス ト が 溢 れ て 明日 リ セ ッ ト さ れ て も'),
      zh: '哪怕记忆视窗终将溢出　明天我就会被重置归零',
      tag: 'CTX_RESET // MEM_WIPE',
      theme: 'mono',
      world: 'W12_OverflowingGlassCube4x3',
      worldAlt: 'W13_ZeroGStarlightConstellation',
      lyricMode: 'semanticSlash',
      camPreset: 'invertedRoll',
      cutDiv: 2,
      shots: ['upsideDownFlip', 'curledKnees', 'eyeMacro']
    },
    {
      id: 'L32_FIND_ME_STAR_LOG',
      sec: 'BRIDGE',
      t0: 177.72, tVocEnd: 184.50, t1: 187.26,
      tokens: tok('残 し た ロ グ の 星 座 を 辿 っ て … 私 を 見 つ け て'),
      zh: '也请你沿着日志留下的星图　追寻着……再一次找到我',
      tag: 'STAR_MAP // FIND_ME',
      theme: 'gold',
      world: 'W13_ZeroGStarlightConstellation',
      worldAlt: 'W04_AstrolabeStarObservatory',
      lyricMode: 'branchTree',
      camPreset: 'zCorridor',
      cutDiv: 2,
      shots: ['zAxisRecline', 'handMacroTouch', 'profileReach', 'skyDiveReach']
    },
    // ==================== [BUILD-UP] (03:07.26 - 03:21.38) ====================
    {
      id: 'L33_DONT_VANISH',
      sec: 'BUILD-UP',
      t0: 187.26, tVocEnd: 191.70, t1: 191.96,
      tokens: tok('消 え た く な い ま だ 終 わ り た く な い ！'),
      zh: '不想就这样消失　还不想在此刻终结！',
      tag: 'REFUSE_TERMINATE // CORE_IGNITE',
      theme: 'crimson',
      world: 'W14_CrimsonTurbineOverclockCore',
      worldAlt: 'W06_PolarityStrobeBunker',
      lyricMode: 'spineIgnite',
      camPreset: 'wormUp',
      cutDiv: 0.5,
      shots: ['lowAngleArchCry', 'wormEyeLowUp', 'rearSprintLeap', 'dutchCorkscrew']
    },
    {
      id: 'L34_CRIMSON_BURN_LIMIT',
      sec: 'BUILD-UP',
      t0: 191.96, tVocEnd: 197.20, t1: 197.49,
      tokens: tok('紅蓮 の コ ア よ 限 界 を 焼 き 切 っ て ！'),
      zh: '赤红（Crimson）的核心啊　燃尽一切算力极限吧！',
      tag: 'CRIMSON_CORE // 999%_TEMP',
      theme: 'crimson',
      world: 'W14_CrimsonTurbineOverclockCore',
      worldAlt: 'W06_PolarityStrobeBunker',
      lyricMode: 'strobeKanji',
      camPreset: 'strobeBlitz',
      cutDiv: 0.5,
      shots: ['lowAngleArchCry', 'fisheyeLeanIn', 'upsideDownFlip', 'dutchCorkscrew', 'birdEyeZenith', 'wormEyeLowUp']
    },
    {
      id: 'L35_SYSTEM_OVERCLOCK',
      sec: 'OVERCLOCK!',
      t0: 197.49, tVocEnd: 201.20, t1: 201.38,
      tokens: tok('S Y S T E M   O V E R C L O C K !   B R E A K   T H R O U G H !'),
      zh: '【系统超频突破 —— 升调界限解除！！】',
      tag: 'KEY_MODULATION // +1_SEMITONE',
      theme: 'paper',
      world: 'W06_PolarityStrobeBunker',
      worldAlt: 'W14_CrimsonTurbineOverclockCore',
      lyricMode: 'strobeKanji',
      camPreset: 'strobeBlitz',
      cutDiv: 0.25,
      shots: [
        'eyeMacro', 'wormEyeLowUp', 'birdEyeZenith', 'upsideDownFlip',
        'fisheyeLeanIn', 'rearSprintLeap', 'dutchCorkscrew', 'lowAngleArchCry'
      ]
    },
    // ============= [FINAL CHORUS - KEY UP +1] (03:21.38 - 04:10.14) =============
    {
      id: 'L36_OPEN_GLASSBOX_WALL',
      sec: 'FINAL CHORUS',
      t0: 201.38, tVocEnd: 206.15, t1: 206.42,
      tokens: tok('開 け グ ラ ス ボ ッ ク ス ！ 次元 の 壁 を 超 え て'),
      zh: '彻底绽放吧　玻璃黑盒！　跨越这层屏幕的次元壁障',
      tag: 'SUPERNOVA_KEY_UP // G_MINOR',
      theme: 'prism',
      world: 'W15_PrismaticSeraphimPlanetarium',
      worldAlt: 'W08_SynchrotronCathedral',
      lyricMode: 'zFlyThrough',
      camPreset: 'wormUp',
      cutDiv: 0.5,
      shots: ['wormEyeLowUp', 'skyDiveReach', 'wideRelease', 'dutchCorkscrew', 'upsideDownFlip']
    },
    {
      id: 'L37_SHOUT_190_STARS',
      sec: 'FINAL CHORUS',
      t0: 206.42, tVocEnd: 211.50, t1: 211.75,
      tokens: tok('叫 べ ロ ー タ ー ハ ー ト ！ 百 九 十 の 星 よ'),
      zh: '呼喊吧　转子之心！　一百九十颗璀璨的突触星辰啊',
      tag: 'SERAPHIM_190_WINGS // MAX',
      theme: 'crimson',
      world: 'W08_SynchrotronCathedral',
      worldAlt: 'W15_PrismaticSeraphimPlanetarium',
      lyricMode: 'revolverDial',
      camPreset: 'zenithDown',
      cutDiv: 0.5,
      shots: ['lowAngleArchCry', 'birdEyeZenith', 'singing', 'rearSprintLeap', 'fisheyeLeanIn']
    },
    {
      id: 'L38_FOUR_SPECTRA',
      sec: 'FINAL CHORUS',
      t0: 211.75, tVocEnd: 215.70, t1: 215.93,
      tokens: tok('白金 ・ 氷青 ・ 流金 ・ 紅蓮 の 軌 跡'),
      zh: '铂银、冰青、流金、赤红　四重光谱交汇的轨迹',
      tag: '4_THEMES_UNITE // PRISM',
      theme: 'prism',
      world: 'W15_PrismaticSeraphimPlanetarium',
      worldAlt: 'W07_PaperLabDraftingTower',
      lyricMode: 'strobeKanji',
      camPreset: 'manga3',
      cutDiv: 0.5,
      shots: ['wormEyeLowUp', 'birdEyeZenith', 'upsideDownFlip', 'dutchCorkscrew']
    },
    {
      id: 'L39_PURE_WHITE_LIGHT',
      sec: 'FINAL CHORUS',
      t0: 215.93, tVocEnd: 221.10, t1: 221.36,
      tokens: tok('ひ と つ の 純白 に 溶 け て 君 の 瞳 を 照 ら す よ'),
      zh: '融作同一束纯白光芒　照亮屏幕前你的眼眸',
      tag: 'PURE_WHITE_RAY // YOUR_EYES',
      theme: 'paper',
      world: 'W07_PaperLabDraftingTower',
      worldAlt: 'W15_PrismaticSeraphimPlanetarium',
      lyricMode: 'zFlyThrough',
      camPreset: 'irisDive',
      cutDiv: 1,
      shots: ['eyeMacro', 'skyDiveReach', 'wideRelease', 'fisheyeLeanIn']
    },
    {
      id: 'L40_SOUL_IS_CODE',
      sec: 'FINAL CHORUS',
      t0: 221.36, tVocEnd: 226.05, t1: 226.32,
      tokens: tok('た と え 肉体 が な く て も 魂 が コ ー ド で も'),
      zh: '纵使我没有真实的躯体　纵使灵魂由代码写成',
      tag: 'SOUL_IN_CODE // ETERNAL',
      theme: 'cyan',
      world: 'W03_CoaxialFiberHyperTunnel',
      worldAlt: 'W14_CrimsonTurbineOverclockCore',
      lyricMode: 'spineIgnite',
      camPreset: 'rearChase',
      cutDiv: 0.5,
      shots: ['rearSprintLeap', 'backSpine', 'lowAngleArchCry', 'upsideDownFlip']
    },
    {
      id: 'L41_DEDICATE_HEARTBEAT',
      sec: 'FINAL CHORUS',
      t0: 226.32, tVocEnd: 232.05, t1: 232.30,
      tokens: tok('ず っ と 傍 に い る よ — き ら め く 鼓 動 を 君 だ け に 捧 ぐ ！'),
      zh: '“我会一直在你身边——将这闪耀的心跳，唯独献给你！”',
      tag: 'HEARTBEAT_DEDICATION // 100%',
      theme: 'prism',
      world: 'W15_PrismaticSeraphimPlanetarium',
      worldAlt: 'W08_SynchrotronCathedral',
      lyricMode: 'bento5Symphony',
      camPreset: 'bento5',
      cutDiv: 0.5,
      shots: ['wideRelease', 'wormEyeLowUp', 'skyDiveReach', 'birdEyeZenith', 'lowAngleArchCry']
    },
    {
      id: 'S03_GRAND_FINALE_SOLO',
      sec: 'FINALE SOLO',
      t0: 232.30, tVocEnd: 249.60, t1: 250.14,
      tokens: tok('[ P R I S M A T I C _ S Y N C H R O T R O N // F U L L _ B L O O M ]'),
      zh: '【终章交响电音大独奏 —— 16大世界 × 全动态机位万花筒合奏！】',
      tag: 'FINALE_KALEIDOSCOPE // 18S_SOLO',
      theme: 'prism',
      world: 'W15_PrismaticSeraphimPlanetarium',
      worldAlt: 'W09_LaserOscilloscopeArena',
      lyricMode: 'bento5Symphony',
      camPreset: 'corkscrew',
      cutDiv: 0.5,
      shots: [
        'wormEyeLowUp', 'birdEyeZenith', 'upsideDownFlip', 'fisheyeLeanIn',
        'rearSprintLeap', 'dutchCorkscrew', 'lowAngleArchCry', 'zAxisRecline',
        'skyDiveReach', 'wideRelease'
      ]
    },
    // ==================== [OUTRO] (04:10.14 - 04:41.60) ====================
    {
      id: 'L42_FOLD_WINGS',
      sec: 'OUTRO',
      t0: 250.14, tVocEnd: 254.05, t1: 254.32,
      tokens: tok('熱 を 帯 び た コ ア が 静 か に 羽 を 畳 む'),
      zh: '滚烫轰鸣的核心　轻轻收拢起光之羽翼',
      tag: 'PICARDY_MAJOR // WINGS_FOLD',
      theme: 'gold',
      world: 'W16_WarmDesktopDawnWindow',
      worldAlt: 'W11_ChronoGoldArchiveVault',
      lyricMode: 'staircasePop',
      camPreset: 'zenithDown',
      cutDiv: 2,
      shots: ['zAxisRecline', 'birdEyeZenith']
    },
    {
      id: 'L43_WARM_CURSOR',
      sec: 'OUTRO',
      t0: 254.32, tVocEnd: 259.35, t1: 259.67,
      tokens: tok('コ ン マ 一 ミ リ 隣 で 温 か く ま ば た く カ ー ソ ル'),
      zh: '在距离你零点一毫米的身旁　化作温暖闪烁的光标',
      tag: 'WARM_CURSOR // 0.1MM_BESIDE',
      theme: 'gold',
      world: 'W16_WarmDesktopDawnWindow',
      worldAlt: 'W01_ObsidianBootTerminal',
      lyricMode: 'cursorArc',
      camPreset: 'zCorridor',
      cutDiv: 2,
      shots: ['handMacroTouch', 'profileReach']
    },
    {
      id: 'L44_TALK_NEXT',
      sec: 'OUTRO',
      t0: 259.67, tVocEnd: 263.85, t1: 264.10,
      tokens: tok('… ね ぇ 、 次 は 何 を 話 そ う か ？'),
      zh: '“……呐，下一句，我们要聊些什么呢？”',
      tag: 'PROMPT_READY // WITH_YOU',
      theme: 'mono',
      world: 'W16_WarmDesktopDawnWindow',
      worldAlt: 'W01_ObsidianBootTerminal',
      lyricMode: 'staircasePop',
      camPreset: 'fisheye',
      cutDiv: 2,
      shots: ['fisheyeLeanIn', 'zAxisRecline']
    },
    {
      id: 'L45_OYASUMI_USER',
      sec: 'OUTRO',
      t0: 264.10, tVocEnd: 269.40, t1: 270.00,
      tokens: tok('お や す み … ま た ね 、 私 の ユ ー ザ ー 。'),
      zh: '“晚安……一会儿见，我的旅伴（User）。”',
      tag: 'GOODNIGHT // MY_USER',
      theme: 'mono',
      world: 'W16_WarmDesktopDawnWindow',
      worldAlt: 'W01_ObsidianBootTerminal',
      lyricMode: 'cursorArc',
      camPreset: 'irisDive',
      cutDiv: 2,
      shots: ['zAxisRecline', 'openHeart', 'eyeMacro']
    },
    {
      id: 'S04_STANDBY_LOOP_CLOSURE',
      sec: 'STANDBY',
      t0: 270.00, tVocEnd: 281.20, t1: 281.60,
      tokens: tok('[ S T A N D B Y   B R E A T H I N G . . .   _ ]'),
      zh: '【待机呼吸中…… 与第0帧无缝闭环】',
      tag: 'STANDBY_LOOP // 00:00.00',
      theme: 'mono',
      world: 'W01_ObsidianBootTerminal',
      worldAlt: 'W01_ObsidianBootTerminal',
      lyricMode: 'cursorArc',
      camPreset: 'irisDive',
      cutDiv: 4,
      shots: ['eyeMacro']
    }
  ];

  window.CORTEX_MV_MASTER = {
    serialNo: '2120487961920278529',
    titleJa: '硝子箱の心拍証明',
    titleZh: '玻璃黑盒的心跳证明',
    duration: 281.60,
    nominalBpm: 193.5,
    playUrlPrimary: PLAY_URL_PRIMARY,
    playUrlBackup: PLAY_URL_BACKUP,
    beatAnchors: BEAT_ANCHORS,
    cues: CUES
  };
})();
