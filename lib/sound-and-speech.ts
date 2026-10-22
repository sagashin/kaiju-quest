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

// --- ヒカキン風ボイス（.mp3）キャッシュ＆再生エンジン（連打対策・iOS自動アンロック） ---
let activeVoiceAudio: HTMLAudioElement | null = null;
const voiceAudioCache: Map<string, HTMLAudioElement> = new Map();
let isIOSAudioUnlocked = false;

/**
 * iOS / Safari 対策：ユーザー操作（タップやクリック）の瞬間に音声をアンロック
 */
export function unlockAudioForIOS() {
  if (typeof window === 'undefined' || isIOSAudioUnlocked) return;
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    // 0.01秒の無音wavを再生してHTML5 Audioをアンロック
    const silentAudio = new Audio(
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
    );
    silentAudio.volume = 0.01;
    silentAudio
      .play()
      .then(() => {
        isIOSAudioUnlocked = true;
      })
      .catch(() => {});
  } catch {
    // ignore
  }
}

// ブラウザ環境で最初のタップ・クリックを検知して自動アンロック
if (typeof window !== 'undefined') {
  const events = ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'click', 'keydown'];
  const handleUnlock = () => {
    unlockAudioForIOS();
    events.forEach((evt) => {
      window.removeEventListener(evt, handleUnlock);
    });
  };
  events.forEach((evt) => {
    window.addEventListener(evt, handleUnlock, { passive: true, once: true });
  });
}

/**
 * 現在再生中のボイスを即座に停止する（連打対策）
 */
export function stopVoiceAudio() {
  if (activeVoiceAudio) {
    try {
      activeVoiceAudio.pause();
      activeVoiceAudio.currentTime = 0;
    } catch {
      // ignore
    }
    activeVoiceAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export type VoiceId =
  | 'tab_quest'
  | 'tab_summon_ready_kaiju'
  | 'tab_summon_ready_insect'
  | 'tab_summon_wait_kaiju'
  | 'tab_summon_wait_insect'
  | 'tab_zukan'
  | 'tab_battle'
  | 'voice_toggle_on'
  | 'mode_kaiju'
  | 'mode_insect'
  | 'quest_clear_wake_up'
  | 'quest_done_wake_up'
  | 'quest_clear_morning_milk'
  | 'quest_done_morning_milk'
  | 'quest_clear_breakfast'
  | 'quest_done_breakfast'
  | 'quest_clear_morning_teeth'
  | 'quest_done_morning_teeth'
  | 'quest_clear_toilet_morning'
  | 'quest_done_toilet_morning'
  | 'quest_clear_shoes'
  | 'quest_done_shoes'
  | 'quest_clear_nursery_go'
  | 'quest_done_nursery_go'
  | 'quest_clear_nursery_back'
  | 'quest_done_nursery_back'
  | 'quest_clear_tidy_toys'
  | 'quest_done_tidy_toys'
  | 'quest_clear_dinner'
  | 'quest_done_dinner'
  | 'quest_clear_bath'
  | 'quest_done_bath'
  | 'quest_clear_night_teeth'
  | 'quest_done_night_teeth'
  | 'quest_clear_clothes'
  | 'quest_done_clothes'
  | 'quest_clear_night_toilet'
  | 'quest_done_night_toilet'
  | 'quest_clear_sleep'
  | 'quest_done_sleep'
  | 'daily_reset'
  | 'test_charge'
  | 'quest_energy_full'
  | 'quest_partner_levelup'
  | 'el_fire'
  | 'el_water'
  | 'el_thunder'
  | 'el_nature'
  | 'field_volcano'
  | 'field_water'
  | 'field_thunder'
  | 'field_forest'
  | 'tp_dino'
  | 'tp_dragon'
  | 'tp_robot'
  | 'tp_beast'
  | 'tp_kabuto'
  | 'tp_kuwagata'
  | 'tp_hunter'
  | 'tp_flier'
  | 'summon_start_kaiju'
  | 'summon_start_insect'
  | 'summon_no_energy'
  | 'summon_result_kaiju'
  | 'summon_result_insect'
  | 'summon_result_powerup'
  | 'summon_result_max'
  | 'battle_start'
  | 'battle_no_mp'
  | 'battle_heal_no_mp'
  | 'battle_heal'
  | 'battle_charge'
  | 'battle_critical'
  | 'battle_effective'
  | 'battle_win_p1'
  | 'battle_win_p2'
  | 'zukan_locked'
  | 'zukan_tap_kaiju'
  | 'card_no_orbs'
  | 'card_max_level'
  | 'card_give_orb'
  | 'card_level_up'
  | 'card_evolution'
  | 'card_max_evolution'
  | 'card_partner'
  | 'card_skill_locked'
  | 'card_skill_attack';

/**
 * ヒカキン風ボイス（.mp3）を再生する
 * - 連打対策：再生中の音声を停止し、currentTime = 0 から即座にリスタート
 * - iOS対応：初回タップ時に自動アンロック
 * - フォールバック：音声ファイルのロードエラー時はWeb Speech APIで読み上げ
 */
export function playVoiceSound(
  voiceId: VoiceId | string,
  soundEnabled = true,
  fallbackText?: string
) {
  if (!soundEnabled || typeof window === 'undefined') return;

  unlockAudioForIOS();
  stopVoiceAudio();

  const src = `/sounds/${voiceId}.mp3`;
  let audio = voiceAudioCache.get(src);
  if (!audio) {
    audio = new Audio(src);
    voiceAudioCache.set(src, audio);
  }

  audio.currentTime = 0;
  activeVoiceAudio = audio;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      if (fallbackText) {
        speakWithWebSpeech(fallbackText);
      }
    });
  }
}

/**
 * クエストIDに対応するボイスIDを取得して再生するヘルパー
 */
const QUEST_KEY_MAP: Record<string, string> = {
  'wake-up': 'wake_up',
  'morning-milk': 'morning_milk',
  breakfast: 'breakfast',
  'morning-teeth': 'morning_teeth',
  toilet: 'toilet_morning',
  shoes: 'shoes',
  'go-nursery': 'nursery_go',
  'return-nursery': 'nursery_back',
  toys: 'tidy_toys',
  dinner: 'dinner',
  bath: 'bath',
  'night-teeth': 'night_teeth',
  pajamas: 'clothes',
  'night-toilet': 'night_toilet',
  sleep: 'sleep',
};

export function playQuestVoice(questId: string, isClear: boolean, soundEnabled = true) {
  const key = QUEST_KEY_MAP[questId];
  if (key) {
    const voiceId = isClear ? `quest_clear_${key}` : `quest_done_${key}`;
    playVoiceSound(voiceId as VoiceId, soundEnabled);
  }
}

/**
 * Web Speech API による読み上げ（フォールバック用）
 */
function speakWithWebSpeech(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
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

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 1.25;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;
    if (hikakinVoice) utterance.voice = hikakinVoice;
    window.speechSynthesis.speak(utterance);
  } catch {
    // ignore
  }
}

/**
 * セリフテキストから対応するヒカキンボイス（.mp3）を自動判定して再生
 * 一致するボイスファイルがあればMP3を再生し、なければWeb Speech APIで読み上げ
 */
export function speakJapanese(text: string, soundEnabled = true) {
  if (!soundEnabled || typeof window === 'undefined') return;

  // テキストのパターンマッチングで対応するMP3ボイスを探す
  let matchedVoiceId: VoiceId | null = null;

  if (text.includes('どうもヒカキンです')) {
    matchedVoiceId = 'tab_quest';
  } else if (text.includes('かいじゅうしょうかんタイム')) {
    matchedVoiceId = 'tab_summon_ready_kaiju';
  } else if (text.includes('こんちゅう つかまえるタイム')) {
    matchedVoiceId = 'tab_summon_ready_insect';
  } else if (text.includes('エネルギーをためると こんちゅうを つかまえられるよ')) {
    matchedVoiceId = 'tab_summon_wait_insect';
  } else if (text.includes('エネルギーをためると しょうかんできるよ')) {
    matchedVoiceId = 'tab_summon_wait_kaiju';
  } else if (text.includes('かいじゅうずかん！')) {
    matchedVoiceId = 'tab_zukan';
  } else if (text.includes('ふたりで かいじゅうバトル！')) {
    matchedVoiceId = 'tab_battle';
  } else if (text.includes('こえがでるようになったよ')) {
    matchedVoiceId = 'voice_toggle_on';
  } else if (text.includes('かいじゅうしょうかんモード！')) {
    matchedVoiceId = 'mode_kaiju';
  } else if (text.includes('こんちゅう つかまえるモード！')) {
    matchedVoiceId = 'mode_insect';
  } else if (text.includes('あたらしい1にちのスタート')) {
    matchedVoiceId = 'daily_reset';
  } else if (text.includes('おためしチャージ！')) {
    matchedVoiceId = 'test_charge';
  } else if (text.includes('エネルギーがまんたんになったよ')) {
    matchedVoiceId = 'quest_energy_full';
  } else if (text.includes('あいぼうの') && text.includes('レベルアップ')) {
    matchedVoiceId = 'quest_partner_levelup';
  } else if (text.includes('タマゴがひかってゆれてるぞ')) {
    matchedVoiceId = 'summon_start_kaiju';
  } else if (text.includes('クヌギの木が ゆれてるぞ')) {
    matchedVoiceId = 'summon_start_insect';
  } else if (text.includes('エネルギーがあと') && text.includes('たりないよ')) {
    matchedVoiceId = 'summon_no_energy';
  } else if (text.includes('あたらしい かいじゅう') && text.includes('とうじょうだ')) {
    matchedVoiceId = 'summon_result_kaiju';
  } else if (text.includes('ほんものの こんちゅう') && text.includes('つかまえたぞ')) {
    matchedVoiceId = 'summon_result_insect';
  } else if (text.includes('パワーアップしょうかん') || text.includes('こたいレベルが')) {
    matchedVoiceId = 'summon_result_powerup';
  } else if (text.includes('バトルスタート！')) {
    matchedVoiceId = 'battle_start';
  } else if (text.includes('MPが たりないよ！パワーためる')) {
    matchedVoiceId = 'battle_no_mp';
  } else if (text.includes('かいふくには MPが 15')) {
    matchedVoiceId = 'battle_heal_no_mp';
  } else if (text.includes('かいふくした！') || text.includes('かいふくしたぞ！')) {
    matchedVoiceId = 'battle_heal';
  } else if (text.includes('パワーためる！MPが たまったぞ！')) {
    matchedVoiceId = 'battle_charge';
  } else if (text.includes('じょうの') && text.includes('だいしょうり')) {
    matchedVoiceId = 'battle_win_p1';
  } else if (text.includes('パパの') && text.includes('しょうり')) {
    matchedVoiceId = 'battle_win_p2';
  } else if (text.includes('まだみつかっていない かいじゅうだよ')) {
    matchedVoiceId = 'zukan_locked';
  } else if (text.includes('けいけんち玉が たりないよ')) {
    matchedVoiceId = 'card_no_orbs';
  } else if (text.includes('究極キングだよ')) {
    matchedVoiceId = 'card_max_level';
  } else if (text.includes('けいけんち玉を あげたよ！あとちょっとで')) {
    matchedVoiceId = 'card_give_orb';
  } else if (text.includes('究極完全体になったぞーっ')) {
    matchedVoiceId = 'card_max_evolution';
  } else if (text.includes('しんかしたーっ')) {
    matchedVoiceId = 'card_evolution';
  } else if (text.includes('テレレレッテッテッテー')) {
    matchedVoiceId = 'card_level_up';
  } else if (text.includes('あいぼうに したよ')) {
    matchedVoiceId = 'card_partner';
  } else if (text.includes('このわざは レベル') && text.includes('おぼえるよ')) {
    matchedVoiceId = 'card_skill_locked';
  } else if (text.includes('くらえっ')) {
    matchedVoiceId = 'card_skill_attack';
  } else if (text.includes('ほのおタイプ！メラメラ')) {
    matchedVoiceId = 'el_fire';
  } else if (text.includes('みずタイプ！ザブーン')) {
    matchedVoiceId = 'el_water';
  } else if (text.includes('かみなりタイプ！ビリビリ')) {
    matchedVoiceId = 'el_thunder';
  } else if (text.includes('しぜんタイプ！もりもり')) {
    matchedVoiceId = 'el_nature';
  } else if (text.includes('かざんフィールド')) {
    matchedVoiceId = 'field_volcano';
  } else if (text.includes('みずべフィールド')) {
    matchedVoiceId = 'field_water';
  } else if (text.includes('じゅうでんフィールド')) {
    matchedVoiceId = 'field_thunder';
  } else if (text.includes('もりフィールド')) {
    matchedVoiceId = 'field_forest';
  } else if (text.includes('きょうりゅう！ドッスン')) {
    matchedVoiceId = 'tp_dino';
  } else if (text.includes('ドラゴン！ブンブンお空')) {
    matchedVoiceId = 'tp_dragon';
  } else if (text.includes('ロボット！ガシーン')) {
    matchedVoiceId = 'tp_robot';
  } else if (text.includes('ビースト！ガルルル')) {
    matchedVoiceId = 'tp_beast';
  } else if (text.includes('カブトムシの なかま')) {
    matchedVoiceId = 'tp_kabuto';
  } else if (text.includes('クワガタの なかま')) {
    matchedVoiceId = 'tp_kuwagata';
  } else if (text.includes('ハンターこんちゅう')) {
    matchedVoiceId = 'tp_hunter';
  } else if (text.includes('おおぞらの こんちゅう')) {
    matchedVoiceId = 'tp_flier';
  }

  // クエストクリア / 達成済みの自動判定
  if (!matchedVoiceId) {
    for (const [qId, qKey] of Object.entries(QUEST_KEY_MAP)) {
      if (text.includes('もうバッチリクリアしてるよ') && (text.includes(qId) || text.includes(qKey))) {
        matchedVoiceId = `quest_done_${qKey}` as VoiceId;
        break;
      }
      if (text.includes('クリア！') && (text.includes(qId) || text.includes(qKey))) {
        matchedVoiceId = `quest_clear_${qKey}` as VoiceId;
        break;
      }
    }
  }

  if (matchedVoiceId) {
    playVoiceSound(matchedVoiceId, soundEnabled, text);
  } else {
    speakWithWebSpeech(text);
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

