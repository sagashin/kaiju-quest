'use client';

import confetti from 'canvas-confetti';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Поップなボタン選択音（ポチッ♪）
 */
export function playTapSound(freq = 520) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.45, now + 0.09);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.095);
}

/**
 * クエスト達成音「ピロリロリン♪」
 */
export function playQuestClearSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // C5, E5, G5, C6, E6, G6, C7
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093.0];

  notes.forEach((freq, idx) => {
    const start = now + idx * 0.065;
    const duration = idx === notes.length - 1 ? 0.45 : 0.16;

    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    subOsc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    subOsc.frequency.setValueAtTime(freq * 1.5, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.28, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    subOsc.start(start);
    osc.stop(start + duration + 0.02);
    subOsc.stop(start + duration + 0.02);
  });
}

/**
 * 卵がガタガタ揺れるチャージ音（ドラムロール＆上昇シンセ）
 */
export function playEggChargeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. ガタガタ揺れる低音パルス（1.5秒間）
  for (let i = 0; i < 14; i++) {
    const t = now + i * 0.1;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const baseFreq = 110 + i * 28;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, t + 0.08);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.085);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  // 2. キュイーーーン！と上がるエネルギー音
  const riser = ctx.createOscillator();
  const riserGain = ctx.createGain();
  riser.type = 'sine';
  riser.frequency.setValueAtTime(220, now);
  riser.frequency.exponentialRampToValueAtTime(1480, now + 1.45);

  riserGain.gain.setValueAtTime(0.05, now);
  riserGain.gain.linearRampToValueAtTime(0.28, now + 1.35);
  riserGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  riser.connect(riserGain);
  riserGain.connect(ctx.destination);
  riser.start(now);
  riser.stop(now + 1.5);
}

/**
 * 召喚成功！「ズドーン！！＋勝利ファンファーレ♪」
 */
export function playSummonExplosionAndFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. ズドーン！（重低音サブベース＋ホワイトノイズ爆発）
  const boomOsc = ctx.createOscillator();
  const boomGain = ctx.createGain();
  boomOsc.type = 'sine';
  boomOsc.frequency.setValueAtTime(160, now);
  boomOsc.frequency.exponentialRampToValueAtTime(28, now + 0.65);

  boomGain.gain.setValueAtTime(0.55, now);
  boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

  boomOsc.connect(boomGain);
  boomGain.connect(ctx.destination);
  boomOsc.start(now);
  boomOsc.stop(now + 0.72);

  // ホワイトノイズで迫力の衝撃音
  const bufferSize = ctx.sampleRate * 0.55;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(950, now);
  filter.frequency.exponentialRampToValueAtTime(120, now + 0.5);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.38, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

  whiteNoise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  whiteNoise.start(now);
  whiteNoise.stop(now + 0.55);

  // 2. ファンファーレ♪（パパパパーン！）
  const fanfareNotes = [
    { freq: 523.25, delay: 0.28, dur: 0.13 }, // C5
    { freq: 523.25, delay: 0.43, dur: 0.13 }, // C5
    { freq: 523.25, delay: 0.58, dur: 0.13 }, // C5
    { freq: 659.25, delay: 0.73, dur: 0.26 }, // E5
    { freq: 587.33, delay: 1.02, dur: 0.22 }, // D5
    { freq: 659.25, delay: 1.26, dur: 0.22 }, // E5
    { freq: 783.99, delay: 1.50, dur: 0.65 }, // G5
    { freq: 1046.5, delay: 1.50, dur: 0.65 }, // C6 (和音)
  ];

  fanfareNotes.forEach(({ freq, delay, dur }) => {
    const start = now + delay;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, start);
    osc2.frequency.setValueAtTime(freq * 0.5, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(start);
    osc2.start(start);
    osc1.stop(start + dur + 0.02);
    osc2.stop(start + dur + 0.02);
  });
}

/**
 * 図鑑で怪獣の必殺技を発動したときのド派手サウンド
 */
export function playSpecialAttackSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // レーザー＋衝撃音
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(980, now);
  osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.36);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.37);

  // キラキラ和音
  const chord = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  chord.forEach((f, idx) => {
    const t = now + 0.15 + idx * 0.05;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.46);
  });
}

/**
 * 軽快なヒューマンビートボックス風リズム音（バスドラム 80Hz → ハイハット → スネア 0.35秒）
 */
export function playBeatboxIntroSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. バスドラム（ドンッ！95Hz -> 32Hz）
  const kick = ctx.createOscillator();
  const kickGain = ctx.createGain();
  kick.type = 'sine';
  kick.frequency.setValueAtTime(95, now);
  kick.frequency.exponentialRampToValueAtTime(32, now + 0.08);

  kickGain.gain.setValueAtTime(0.45, now);
  kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  kick.connect(kickGain);
  kickGain.connect(ctx.destination);
  kick.start(now);
  kick.stop(now + 0.095);

  // 2. ハイハット（チッ！ノイズ 0.11秒付近）
  const hhTime = now + 0.11;
  const bufferSize = Math.floor(ctx.sampleRate * 0.04);
  const hhBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const hhData = hhBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    hhData[i] = Math.random() * 2 - 1;
  }
  const hhSource = ctx.createBufferSource();
  hhSource.buffer = hhBuffer;

  const hhFilter = ctx.createBiquadFilter();
  hhFilter.type = 'highpass';
  hhFilter.frequency.setValueAtTime(8000, hhTime);

  const hhGain = ctx.createGain();
  hhGain.gain.setValueAtTime(0.25, hhTime);
  hhGain.gain.exponentialRampToValueAtTime(0.001, hhTime + 0.038);

  hhSource.connect(hhFilter);
  hhFilter.connect(hhGain);
  hhGain.connect(ctx.destination);
  hhSource.start(hhTime);
  hhSource.stop(hhTime + 0.04);

  // 3. スネア（パァン！トーン+ノイズ 0.22秒付近）
  const snTime = now + 0.22;
  const snOsc = ctx.createOscillator();
  const snOscGain = ctx.createGain();
  snOsc.type = 'triangle';
  snOsc.frequency.setValueAtTime(220, snTime);
  snOsc.frequency.exponentialRampToValueAtTime(80, snTime + 0.1);

  snOscGain.gain.setValueAtTime(0.3, snTime);
  snOscGain.gain.exponentialRampToValueAtTime(0.001, snTime + 0.11);
  snOsc.connect(snOscGain);
  snOscGain.connect(ctx.destination);
  snOsc.start(snTime);
  snOsc.stop(snTime + 0.12);

  const snBufSize = Math.floor(ctx.sampleRate * 0.12);
  const snBuffer = ctx.createBuffer(1, snBufSize, ctx.sampleRate);
  const snData = snBuffer.getChannelData(0);
  for (let i = 0; i < snBufSize; i++) {
    snData[i] = Math.random() * 2 - 1;
  }
  const snSource = ctx.createBufferSource();
  snSource.buffer = snBuffer;

  const snFilter = ctx.createBiquadFilter();
  snFilter.type = 'bandpass';
  snFilter.frequency.setValueAtTime(2500, snTime);

  const snGain = ctx.createGain();
  snGain.gain.setValueAtTime(0.35, snTime);
  snGain.gain.exponentialRampToValueAtTime(0.001, snTime + 0.12);

  snSource.connect(snFilter);
  snFilter.connect(snGain);
  snGain.connect(ctx.destination);
  snSource.start(snTime);
  snSource.stop(snTime + 0.13);
}

/**
 * YouTuber定番エアホーンサウンド（プァー！プァー！プァーーー！）
 */
export function playYoutuberAirhornSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // エアホーンの代表的な和音ピッチ（F#5, A5, C#6）
  const chord = [739.99, 880.0, 1108.73];

  const bursts = [
    { start: 0.0, dur: 0.08, vol: 0.28 },
    { start: 0.11, dur: 0.08, vol: 0.32 },
    { start: 0.22, dur: 0.36, vol: 0.38 },
  ];

  bursts.forEach(({ start, dur, vol }) => {
    const t = now + start;
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol / chord.length, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    });
  });
}

/**
 * ドラクエ定番ホイミ風回復サウンド（E5→G5→B5→E6→G6の上昇アルペジオ）
 */
export function playHealSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98]; // E5, G5, B5, E6, G6

  notes.forEach((freq, idx) => {
    const start = now + idx * 0.07;
    const dur = 0.28;
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    sub.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    sub.frequency.setValueAtTime(freq * 0.5, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.24, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    sub.start(start);
    osc.stop(start + dur + 0.02);
    sub.stop(start + dur + 0.02);
  });
}

/**
 * Web Speech API でヒカキン風の抑揚をつけて日本語を読み上げる
 */
export function speakJapanese(text: string, soundEnabled = true) {
  if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    // 男性ボイス（Otoya, Ichiro, Hattori, Keita 等）を最優先で選択
    const hikakinVoice =
      voices.find(
        (v) =>
          v.lang.includes('ja') &&
          (v.name.includes('Otoya') ||
            v.name.includes('Ichiro') ||
            v.name.includes('Keita') ||
            v.name.includes('Hattori') ||
            v.name.includes('Takumi'))
      ) ||
      voices.find((v) => v.lang.includes('ja') && v.name.includes('Google')) ||
      voices.find((v) => v.lang.includes('ja'));

    // 感嘆詞（「ブンブン！」「キターーー！」「うおおおー！」等）が含まれる場合、前半と後半に分割して抑揚をつける
    const exclamationMatch = text.match(/^([^！!]+[！!]+)\s*(.+)$/);

    if (exclamationMatch && exclamationMatch[1] && exclamationMatch[2]) {
      const part1 = exclamationMatch[1].trim();
      const part2 = exclamationMatch[2].trim();

      // 1つ目の感嘆詞Utterance（ハイテンションな高めの声）
      const u1 = new SpeechSynthesisUtterance(part1);
      u1.lang = 'ja-JP';
      u1.pitch = 1.18;
      u1.rate = 1.35;
      u1.volume = 1.0;
      if (hikakinVoice) u1.voice = hikakinVoice;

      // 2つ目の本文Utterance（聞き取りやすくノリの良い男性トーン）
      const u2 = new SpeechSynthesisUtterance(part2);
      u2.lang = 'ja-JP';
      u2.pitch = 0.95;
      u2.rate = 1.22;
      u2.volume = 1.0;
      if (hikakinVoice) u2.voice = hikakinVoice;

      window.speechSynthesis.speak(u1);
      window.speechSynthesis.speak(u2);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 1.22;
      utterance.pitch = 0.95;
      utterance.volume = 1.0;
      if (hikakinVoice) utterance.voice = hikakinVoice;
      window.speechSynthesis.speak(utterance);
    }
  } catch {
    // Web Speech API 非対応環境でもエラーにしない
  }
}

/**
 * クエスト達成時の紙吹雪
 */
export function fireQuestConfetti() {
  if (typeof window === 'undefined') return;
  try {
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.62 },
      colors: ['#facc15', '#f97316', '#38bdf8', '#4ade80', '#f43f5e', '#a855f7'],
    });
  } catch {
    // ignore
  }
}

/**
 * 怪獣召喚時のド派手な紙吹雪
 */
export function fireSummonConfetti(colors: string[] = ['#facc15', '#ef4444', '#3b82f6', '#22c55e']) {
  if (typeof window === 'undefined') return;
  try {
    // 中央ドカン！
    confetti({
      particleCount: 110,
      spread: 100,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.55 },
      colors,
    });

    // 左右から時間差キャノン
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 65,
        origin: { x: 0.05, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 65,
        origin: { x: 0.95, y: 0.7 },
        colors,
      });
    }, 280);
  } catch {
    // ignore
  }
}

/**
 * 1. ドラクエのレベルアップ風ファンファーレ（F5, F5, F5, F5, D#5, G5, F5）
 */
export function playLevelUpSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // F5=698.46, D#5=622.25, G5=783.99, A5=880.0, C6=1046.50
  const melody = [
    { freq: 698.46, delay: 0.0, dur: 0.11 },  // F5
    { freq: 698.46, delay: 0.13, dur: 0.11 }, // F5
    { freq: 698.46, delay: 0.26, dur: 0.11 }, // F5
    { freq: 698.46, delay: 0.39, dur: 0.24 }, // F5
    { freq: 622.25, delay: 0.66, dur: 0.22 }, // D#5
    { freq: 783.99, delay: 0.91, dur: 0.22 }, // G5
    { freq: 698.46, delay: 1.16, dur: 0.65 }, // F5 (Long)
    { freq: 1046.5, delay: 1.16, dur: 0.65 }, // C6 (Harmony)
  ];

  melody.forEach(({ freq, delay, dur }) => {
    const start = now + delay;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, start);
    osc2.frequency.setValueAtTime(freq * 0.5, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.22, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(start);
    osc2.start(start);
    osc1.stop(start + dur + 0.02);
    osc2.stop(start + dur + 0.02);
  });
}

/**
 * 2. 進化時の神秘的な上昇アルペジオ＋祝福の和音ファンファーレ（C5→E5→G5→B5→C6→E6→G6）
 */
export function playEvolutionSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const arp = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5, 1567.98];

  arp.forEach((freq, idx) => {
    const start = now + idx * 0.09;
    const dur = 0.22;
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    sub.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, start);
    sub.frequency.setValueAtTime(freq * 0.5, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    sub.start(start);
    osc.stop(start + dur + 0.02);
    sub.stop(start + dur + 0.02);
  });

  // 祝福の壮大なメジャーコード和音
  const chordStart = now + 0.68;
  const chordFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
  chordFreqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, chordStart);

    gain.gain.setValueAtTime(0.001, chordStart);
    gain.gain.linearRampToValueAtTime(0.14, chordStart + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 0.95);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(chordStart);
    osc.stop(chordStart + 0.98);
  });
}

/**
 * 3. バトル攻撃音（通常打撃＆レーザー / 会心の一撃の重低音爆発＋高音金属クラッシュ音）
 */
export function playBattleAttackSound(isCritical = false) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (!isCritical) {
    // 通常攻撃：レーザー＋打撃インパクト
    const laser = ctx.createOscillator();
    const laserGain = ctx.createGain();
    laser.type = 'sawtooth';
    laser.frequency.setValueAtTime(760, now);
    laser.frequency.exponentialRampToValueAtTime(90, now + 0.24);

    laserGain.gain.setValueAtTime(0.28, now);
    laserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    laser.connect(laserGain);
    laserGain.connect(ctx.destination);
    laser.start(now);
    laser.stop(now + 0.26);

    // 打撃パンチ音
    const hit = ctx.createOscillator();
    const hitGain = ctx.createGain();
    hit.type = 'square';
    hit.frequency.setValueAtTime(180, now + 0.08);
    hit.frequency.exponentialRampToValueAtTime(42, now + 0.28);

    hitGain.gain.setValueAtTime(0.35, now + 0.08);
    hitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.29);

    hit.connect(hitGain);
    hitGain.connect(ctx.destination);
    hit.start(now + 0.08);
    hit.stop(now + 0.3);
  } else {
    // かいしんのいちげき！！：重低音爆発＋高音金属クラッシュ音
    const boom = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boom.type = 'sawtooth';
    boom.frequency.setValueAtTime(240, now);
    boom.frequency.exponentialRampToValueAtTime(24, now + 0.6);

    boomGain.gain.setValueAtTime(0.55, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.62);

    boom.connect(boomGain);
    boomGain.connect(ctx.destination);
    boom.start(now);
    boom.stop(now + 0.64);

    // ホワイトノイズクラッシュ
    const bufferSize = Math.floor(ctx.sampleRate * 0.45);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.Q.setValueAtTime(0.7, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.45);

    // 高音金属クラッシュ（ザシュッ！キラーン！）
    const metalFreqs = [1174.66, 1567.98, 2093.0, 2637.02];
    metalFreqs.forEach((f, idx) => {
      const start = now + idx * 0.04;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, start);
      g.gain.setValueAtTime(0.2, start);
      g.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.36);
    });
  }
}

/**
 * 4. MPチャージ・回復時の「ピロリロリン♪」という上昇キラキラ音
 */
export function playMpChargeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [587.33, 739.99, 880.0, 1174.66, 1479.98, 1760.0];

  notes.forEach((freq, idx) => {
    const start = now + idx * 0.06;
    const dur = 0.2;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.24, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.01);
  });
}

/**
 * 5. バトル勝利時の華やかな勝利ファンファーレ＋fireSummonConfetti()
 */
export function playBattleVictorySound() {
  fireSummonConfetti(['#facc15', '#f97316', '#38bdf8', '#4ade80', '#f43f5e']);
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const victoryNotes = [
    { freq: 523.25, delay: 0.0, dur: 0.12 },  // C5
    { freq: 523.25, delay: 0.14, dur: 0.12 }, // C5
    { freq: 523.25, delay: 0.28, dur: 0.12 }, // C5
    { freq: 523.25, delay: 0.42, dur: 0.32 }, // C5
    { freq: 415.3, delay: 0.76, dur: 0.3 },   // G#4
    { freq: 466.16, delay: 1.08, dur: 0.3 },  // A#4
    { freq: 523.25, delay: 1.4, dur: 0.2 },   // C5
    { freq: 466.16, delay: 1.64, dur: 0.14 }, // A#4
    { freq: 523.25, delay: 1.8, dur: 0.8 },   // C5 (Long)
    { freq: 1046.5, delay: 1.8, dur: 0.8 },   // C6
  ];

  victoryNotes.forEach(({ freq, delay, dur }) => {
    const start = now + delay;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, start);
    osc2.frequency.setValueAtTime(freq * 0.5, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(start);
    osc2.start(start);
    osc1.stop(start + dur + 0.02);
    osc2.stop(start + dur + 0.02);
  });
}


/**
 * 6. クイズ正解音「ピンポン・ピンポーン♪」（A5→F5 ×2 の明るいチャイム音＋紙吹雪）
 */
export function playQuizCorrectSound() {
  fireQuestConfetti();
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 880.0, delay: 0.0, dur: 0.14 },
    { freq: 698.46, delay: 0.14, dur: 0.22 },
    { freq: 880.0, delay: 0.38, dur: 0.14 },
    { freq: 698.46, delay: 0.52, dur: 0.42 },
    { freq: 1046.5, delay: 0.52, dur: 0.42 },
  ];

  notes.forEach(({ freq, delay, dur }) => {
    const start = now + delay;
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    sub.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    sub.frequency.setValueAtTime(freq * 2, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.28, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    sub.start(start);
    osc.stop(start + dur + 0.02);
    sub.stop(start + dur + 0.02);
  });
}

/**
 * 7. クイズ不正解時の優しいコミカルな「ブッブー♪」（4歳児が怖がらない柔らかい音）
 */
export function playQuizWrongSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const pulses = [
    { freq: 240, delay: 0.0, dur: 0.14 },
    { freq: 195, delay: 0.17, dur: 0.26 },
  ];

  pulses.forEach(({ freq, delay, dur }) => {
    const start = now + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    osc.frequency.linearRampToValueAtTime(freq * 0.92, start + dur);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + dur + 0.02);
  });
}

/**
 * 8. 7つのほし玉が揃って神龍（シェンロン）を呼び出す神秘的な雷鳴＆東洋風ペンタトニック上昇音
 */
export function playShenronSummonSound() {
  fireSummonConfetti(['#facc15', '#f97316', '#fde047', '#ffffff']);
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const bufferSize = Math.floor(ctx.sampleRate * 1.2);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(420, now);
  filter.frequency.exponentialRampToValueAtTime(90, now + 1.15);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.32, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.18);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 1.2);

  const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98];
  scale.forEach((freq, idx) => {
    const start = now + 0.15 + idx * 0.085;
    const dur = idx === scale.length - 1 ? 0.9 : 0.28;
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    sub.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    sub.frequency.setValueAtTime(freq * 0.5, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.24, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    sub.start(start);
    osc.stop(start + dur + 0.02);
    sub.stop(start + dur + 0.02);
  });
}

/**
 * 9. パパ＆じょうの「ふたりで合体必殺技！」超ド派手ダブルレーザー＋大爆発＋エアホーン音
 */
export function playTagUltimateSound() {
  fireSummonConfetti(['#facc15', '#ef4444', '#38bdf8', '#a855f7', '#ffffff']);
  playYoutuberAirhornSound();
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  [220, 330].forEach((startFreq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 6, now + 0.45);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.48);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  });

  setTimeout(() => {
    playBattleAttackSound(true);
  }, 320);
}

/**
 * 10. 超キラキラ色違い覚醒サウンド（ポケモンの色違いキラーン音＋超サイヤ人風オーラ＋祝福ファンファーレ）
 */
export function playAwakeningSound() {
  fireSummonConfetti(['#facc15', '#fef08a', '#38bdf8', '#e879f9', '#f43f5e', '#4ade80']);
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. 色違い特有の「キラーン✨（超高音クリスタルチャイム）」
  const sparkleNotes = [1567.98, 2093.0, 2637.02, 3135.96, 4186.01]; // G6, C7, E7, G7, C8
  sparkleNotes.forEach((freq, idx) => {
    const start = now + idx * 0.055;
    const dur = 0.35;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.28, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  });

  // 2. 黄金・虹色の壮大な覚醒ファンファーレ
  const fanfare = [
    { freq: 523.25, delay: 0.3, dur: 0.14 },  // C5
    { freq: 659.25, delay: 0.45, dur: 0.14 }, // E5
    { freq: 783.99, delay: 0.6, dur: 0.14 },  // G5
    { freq: 1046.5, delay: 0.75, dur: 0.25 }, // C6
    { freq: 987.77, delay: 1.02, dur: 0.18 }, // B5
    { freq: 1046.5, delay: 1.22, dur: 0.18 }, // C6
    { freq: 1318.5, delay: 1.42, dur: 0.85 }, // E6
    { freq: 1567.98, delay: 1.42, dur: 0.85 }, // G6 (Harmony)
  ];

  fanfare.forEach(({ freq, delay, dur }) => {
    const start = now + delay;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, start);
    osc2.frequency.setValueAtTime(freq * 0.5, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(start);
    osc2.start(start);
    osc1.stop(start + dur + 0.02);
    osc2.stop(start + dur + 0.02);
  });
}
