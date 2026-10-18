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
 * Web Speech API で元気よく日本語を読み上げる
 */
export function speakJapanese(text: string, soundEnabled = true) {
  if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    // ヒカキン風のハイテンションで親しみやすい男性YouTuberボイス設定
    utterance.rate = 1.22; // テンポよくノリのいいYouTuberトーク速度
    utterance.pitch = 0.92; // 男性らしい声帯の響きを保ちつつハリのあるトーン
    utterance.volume = 1.0;

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

    if (hikakinVoice) {
      utterance.voice = hikakinVoice;
    }

    window.speechSynthesis.speak(utterance);
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
