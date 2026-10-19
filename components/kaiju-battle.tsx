'use client';

import React, { useState, useEffect } from 'react';
import { Swords, Zap, Bot, User, Trophy, RotateCcw, Sparkles, Shield } from 'lucide-react';
import {
  KAIJU_LIST,
  KaijuData,
  KaijuProgress,
  KaijuSkill,
  KaijuComputedStats,
  getKaijuStats,
  getElementMeta,
  getTypeMeta,
} from '@/lib/kaiju-data';
import { KaijuSvgIllustration } from '@/components/kaiju-artwork';
import {
  playTapSound,
  playBattleAttackSound,
  playMpChargeSound,
  playBattleVictorySound,
  speakJapanese,
} from '@/lib/sound-and-speech';

type BattlePhase = 'select' | 'battle' | 'result';
type PapaDifficulty = 'easy' | 'normal' | 'hard';

interface KaijuBattleProps {
  unlockedKaijuIds: string[];
  kaijuProgress: Record<string, KaijuProgress>;
  soundEnabled: boolean;
  onBattleComplete: (p1KaijuId: string) => void;
}

export function KaijuBattle({
  unlockedKaijuIds,
  kaijuProgress,
  soundEnabled,
  onBattleComplete,
}: KaijuBattleProps) {
  // 1Pが選べる怪獣リスト（未解放が0体の場合は先頭4体をレンタル解放）
  const p1AvailableList =
    unlockedKaijuIds.length > 0
      ? KAIJU_LIST.filter((k) => unlockedKaijuIds.includes(k.id))
      : KAIJU_LIST.slice(0, 4);

  const [phase, setPhase] = useState<BattlePhase>('select');
  const [p1KaijuId, setP1KaijuId] = useState<string>(p1AvailableList[0]?.id ?? KAIJU_LIST[0].id);
  const [p2KaijuId, setP2KaijuId] = useState<string>(KAIJU_LIST[9]?.id ?? KAIJU_LIST[1].id);
  const [papaDifficulty, setPapaDifficulty] = useState<PapaDifficulty>('easy');
  const [isPapaCpu, setIsPapaCpu] = useState<boolean>(false);

  // バトル進行ステート
  const [turn, setTurn] = useState<1 | 2>(1);
  const [isAnimatingAction, setIsAnimatingAction] = useState<boolean>(false);
  const [p1Hp, setP1Hp] = useState<number>(100);
  const [p1Mp, setP1Mp] = useState<number>(30);
  const [p2Hp, setP2Hp] = useState<number>(100);
  const [p2Mp, setP2Mp] = useState<number>(30);
  const [p1Charged, setP1Charged] = useState<boolean>(false);
  const [p2Charged, setP2Charged] = useState<boolean>(false);

  // アニメーション用フラグ
  const [p1Attacking, setP1Attacking] = useState<boolean>(false);
  const [p2Attacking, setP2Attacking] = useState<boolean>(false);
  const [p1Damaged, setP1Damaged] = useState<boolean>(false);
  const [p2Damaged, setP2Damaged] = useState<boolean>(false);
  const [criticalFlash, setCriticalFlash] = useState<boolean>(false);
  const [battleLogs, setBattleLogs] = useState<string[]>([
    '⚔️ かいじゅうバトル スタート！ わざを えらんで たたかおう！',
  ]);
  const [winner, setWinner] = useState<1 | 2 | null>(null);

  const p1Kaiju: KaijuData =
    KAIJU_LIST.find((k) => k.id === p1KaijuId) ?? p1AvailableList[0] ?? KAIJU_LIST[0];
  const p2Kaiju: KaijuData = KAIJU_LIST.find((k) => k.id === p2KaijuId) ?? KAIJU_LIST[1];

  const p1Stats: KaijuComputedStats = getKaijuStats(
    p1Kaiju,
    kaijuProgress[p1Kaiju.id] ?? { level: 1, exp: 0 }
  );

  // 2P（パパ）のレベル計算（ハンデ設定に対応）
  const p2Level =
    papaDifficulty === 'easy'
      ? 1
      : papaDifficulty === 'normal'
      ? p1Stats.level
      : Math.max(5, p1Stats.level + 1);

  const p2BaseStats: KaijuComputedStats = getKaijuStats(p2Kaiju, {
    level: p2Level,
    exp: 0,
  });

  // 「やさしい」の場合はパパの最大HP・攻撃力を少し控えめにして4歳児が気持ちよく勝てるように調整
  const p2Stats: KaijuComputedStats =
    papaDifficulty === 'easy'
      ? {
          ...p2BaseStats,
          maxHp: Math.max(85, Math.round(p2BaseStats.maxHp * 0.85)),
          attack: Math.max(18, Math.round(p2BaseStats.attack * 0.78)),
        }
      : p2BaseStats;

  // バトル開始処理
  const handleStartBattle = () => {
    playTapSound(680);
    setP1Hp(p1Stats.maxHp);
    setP1Mp(p1Stats.maxMp);
    setP2Hp(p2Stats.maxHp);
    setP2Mp(p2Stats.maxMp);
    setP1Charged(false);
    setP2Charged(false);
    setTurn(1);
    setWinner(null);
    setIsAnimatingAction(false);
    setBattleLogs([
      `🔥 ${p1Stats.displayName} (Lv.${p1Stats.level}) VS ${p2Stats.displayName} (Lv.${p2Stats.level})！`,
      '👦 まずは 1P（むすこ）の ターン！ わざボタンを タップしてね！',
    ]);
    setPhase('battle');
    speakJapanese(
      `バトルスタート！${p1Stats.displayName} たい パパの ${p2Stats.displayName}！まずは 1Pのターンだ！わざを えらんでね！レッツゴー！`,
      soundEnabled
    );
  };

  // 攻撃またはエネルギーチャージ実行
  const executeCommand = (actor: 1 | 2, skill: KaijuSkill | 'charge') => {
    if (isAnimatingAction || phase !== 'battle') return;

    const isP1 = actor === 1;
    const attackerStats = isP1 ? p1Stats : p2Stats;
    const defenderStats = isP1 ? p2Stats : p1Stats;
    const attackerMp = isP1 ? p1Mp : p2Mp;
    const defenderHp = isP1 ? p2Hp : p1Hp;
    const isCharged = isP1 ? p1Charged : p2Charged;
    const actorTitle = isP1 ? '👦 1P' : '👨 2P(パパ)';

    // MPチャージ（ためる）を選んだ場合
    if (skill === 'charge') {
      setIsAnimatingAction(true);
      playMpChargeSound();

      const nextMp = Math.min(attackerStats.maxMp, attackerMp + 20);
      if (isP1) {
        setP1Mp(nextMp);
        setP1Charged(true);
      } else {
        setP2Mp(nextMp);
        setP2Charged(true);
      }

      const logs = [
        `⚡ ${actorTitle}の ${attackerStats.displayName}は エネルギーを ためた！`,
        '✨ MPが 20 かいふく！ つぎの こうげきで「かいしんの いちげき」が でるぞ！！',
      ];
      setBattleLogs(logs);
      speakJapanese(
        `${attackerStats.displayName}は パワーを ためた！MPが かいふくして、つぎの こうげきが ちょうパワーアップだ！`,
        soundEnabled
      );

      setTimeout(() => {
        setTurn(isP1 ? 2 : 1);
        setIsAnimatingAction(false);
      }, 1150);
      return;
    }

    // MP不足チェック
    if (attackerMp < skill.mpCost) {
      playTapSound(320);
      speakJapanese(
        'おっと！MPが たりないよ！エネルギーを ためる ボタンをおして MPを かいふくしよう！',
        soundEnabled
      );
      return;
    }

    setIsAnimatingAction(true);

    // MP消費＆チャージ解除
    const updatedMp = Math.max(0, attackerMp - skill.mpCost);
    if (isP1) {
      setP1Mp(updatedMp);
      setP1Charged(false);
      setP1Attacking(true);
    } else {
      setP2Mp(updatedMp);
      setP2Charged(false);
      setP2Attacking(true);
    }

    // かいしんのいちげき判定（チャージ後は100%確定、通常でも1Pは35%、2Pは25%で発生）
    const critChance = isCharged ? 1.0 : isP1 ? 0.35 : 0.25;
    const isCritical = Math.random() < critChance;

    // ダメージ計算（4歳児が爽快に遊べるテンポの良いバランス）
    const baseDmg = skill.power + attackerStats.attack * 0.65 - defenderStats.defense * 0.28;
    const variance = 0.92 + Math.random() * 0.16;
    const rawDamage = Math.max(15, Math.round(baseDmg * variance * (isCritical ? 1.6 : 1.0)));
    const nextDefenderHp = Math.max(0, defenderHp - rawDamage);

    playBattleAttackSound(isCritical);
    if (isCritical) {
      setCriticalFlash(true);
      setTimeout(() => setCriticalFlash(false), 500);
    }

    setTimeout(() => {
      if (isP1) {
        setP1Attacking(false);
        setP2Damaged(true);
        setP2Hp(nextDefenderHp);
      } else {
        setP2Attacking(false);
        setP1Damaged(true);
        setP1Hp(nextDefenderHp);
      }

      const logs: string[] = [
        `▶ ${actorTitle}の ${attackerStats.displayName}の こうげき！`,
        `🔥『${skill.name}』を はなった！`,
      ];

      if (isCritical) {
        logs.push(
          `💥 かいしんの いちげき！！ ${defenderStats.displayName}に ${rawDamage} の大ダメージ！！`
        );
      } else {
        logs.push(`⚡ ${defenderStats.displayName}に ${rawDamage} のダメージをあたえた！`);
      }

      setBattleLogs(logs);

      const critVoice = isCritical ? 'かいしんの いちげきーっ！！やばすぎるー！' : '';
      speakJapanese(
        `${attackerStats.displayName}の、${skill.name}！ ${critVoice} ${rawDamage} のダメージ！`,
        soundEnabled
      );

      setTimeout(() => {
        setP1Damaged(false);
        setP2Damaged(false);

        // 勝敗判定
        if (nextDefenderHp <= 0) {
          setWinner(actor);
          setPhase('result');
          setIsAnimatingAction(false);
          playBattleVictorySound();
          onBattleComplete(p1Kaiju.id);

          const winName = attackerStats.displayName;
          const winSpeech =
            actor === 1
              ? `キターーー！1P、${winName}の だいしょうりーっ！おめでとう！ごほうびに けいけんち玉 2こと、けいけんち 50 をゲットしたよ！神ってるー！`
              : `うわあああ！パパの ${winName}の しょうり！でも さいごまで たたかった ごほうびに けいけんち玉 2こと、けいけんち 50 をゲットしたよ！つぎは ぜったい 勝とうね！`;
          speakJapanese(winSpeech, soundEnabled);
        } else {
          setTurn(isP1 ? 2 : 1);
          setIsAnimatingAction(false);
        }
      }, 650);
    }, 350);
  };

  // パパがCPU（オート）モードのときの自動行動
  useEffect(() => {
    if (phase !== 'battle' || turn !== 2 || !isPapaCpu || isAnimatingAction) return;

    const timer = setTimeout(() => {
      const usableSkills = p2Stats.unlockedSkills.filter((s) => p2Mp >= s.mpCost);
      if (usableSkills.length === 0 || (p2Mp < 15 && Math.random() < 0.45)) {
        executeCommand(2, 'charge');
      } else {
        const chosen = usableSkills[Math.floor(Math.random() * usableSkills.length)];
        executeCommand(2, chosen);
      }
    }, 1100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turn, isPapaCpu, isAnimatingAction]);

  const currentActorStats = turn === 1 ? p1Stats : p2Stats;
  const currentActorMp = turn === 1 ? p1Mp : p2Mp;
  const currentActorCharged = turn === 1 ? p1Charged : p2Charged;

  return (
    <section className="space-y-5">
      {/* ============================================================
          PHASE 1: 怪獣えらびフェーズ ('select')
         ============================================================ */}
      {phase === 'select' && (
        <div className="space-y-5">
          {/* タイトルヘッダー */}
          <div className="dq-window p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-yellow-300 flex items-center gap-2">
                <Swords className="w-7 h-7 text-amber-400 shrink-0" />
                <span>⚔️ ふたりで かいじゅうバトル！</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-300 mt-1">
                1P（むすこ）と 2P（パパ）の かいじゅうを えらんで たいけつ しよう！
              </p>
            </div>

            {/* パパをCPU（オート）にするトグル */}
            <button
              type="button"
              onClick={() => {
                playTapSound(560);
                setIsPapaCpu((prev) => !prev);
              }}
              className={`min-h-[48px] px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 transition-all cursor-pointer ${
                isPapaCpu
                  ? 'bg-cyan-400 text-slate-950 border-white shadow-md'
                  : 'bg-slate-800 text-slate-200 border-white/25'
              }`}
            >
              {isPapaCpu ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              <span>{isPapaCpu ? '🤖 パパ：オート(CPU)' : '👨 パパ：じぶんで操作'}</span>
            </button>
          </div>

          {/* 1P VS 2P 選択プレビューカード */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 👦 1P（むすこ）怪獣選択 */}
            <div className="rounded-3xl bg-slate-900/95 border-2 border-amber-400/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-sm">
                  👦 1P（むすこ）の かいじゅう
                </span>
                <span className="text-xs font-black text-amber-300">
                  そだてたレベルで たたかうよ！
                </span>
              </div>

              {/* 選択中の1P怪獣プレビュー */}
              <div className="dq-window p-3 flex items-center gap-4">
                <div className="w-24 h-24 shrink-0">
                  <KaijuSvgIllustration
                    element={p1Kaiju.element}
                    type={p1Kaiju.type}
                    evolutionStage={p1Stats.stage}
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="text-xs font-black text-yellow-300">
                    Lv.{p1Stats.level} · {p1Stats.stageTitle}
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white truncate">
                    {p1Stats.displayName}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-black">
                    <span className="text-emerald-300">HP {p1Stats.maxHp}</span>
                    <span className="text-cyan-300">MP {p1Stats.maxMp}</span>
                    <span className="text-orange-300">ちから {p1Stats.attack}</span>
                  </div>
                </div>
              </div>

              {/* 1P 怪獣リスト */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {p1AvailableList.map((k) => {
                  const st = getKaijuStats(k, kaijuProgress[k.id]);
                  const isSelected = k.id === p1Kaiju.id;
                  const el = getElementMeta(k.element);
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => {
                        playTapSound(580);
                        setP1KaijuId(k.id);
                      }}
                      className={`min-h-[64px] rounded-2xl p-2 text-left border-2 flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? `bg-gradient-to-r ${el.bgGradient} text-white border-white shadow-lg`
                          : 'bg-slate-950/90 text-slate-200 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="w-11 h-11 shrink-0">
                        <KaijuSvgIllustration
                          element={k.element}
                          type={k.type}
                          evolutionStage={st.stage}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-black text-yellow-300">Lv.{st.level}</div>
                        <div className="text-xs font-black truncate">{st.displayName}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 👨 2P（パパ・ライバル）怪獣選択 */}
            <div className="rounded-3xl bg-slate-900/95 border-2 border-cyan-400/60 p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-400 text-slate-950 font-black text-sm">
                  👨 2P（パパ・ライバル）
                </span>

                {/* ハンデ設定（パパの強さ） */}
                <div className="flex items-center gap-1">
                  {(
                    [
                      { id: 'easy', label: 'やさしい(Lv.1)' },
                      { id: 'normal', label: 'ふつう(おなじLv)' },
                      { id: 'hard', label: 'つよい(👑キング)' },
                    ] as { id: PapaDifficulty; label: string }[]
                  ).map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        playTapSound(520);
                        setPapaDifficulty(h.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                        papaDifficulty === h.id
                          ? 'bg-cyan-400 text-slate-950 border-white shadow'
                          : 'bg-slate-950 text-slate-300 border-slate-700'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 選択中の2P怪獣プレビュー */}
              <div className="dq-window p-3 flex items-center gap-4">
                <div className="w-24 h-24 shrink-0">
                  <KaijuSvgIllustration
                    element={p2Kaiju.element}
                    type={p2Kaiju.type}
                    evolutionStage={p2Stats.stage}
                    flipHorizontal
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="text-xs font-black text-cyan-300">
                    Lv.{p2Stats.level} · {p2Stats.stageTitle}
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white truncate">
                    {p2Stats.displayName}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-black">
                    <span className="text-emerald-300">HP {p2Stats.maxHp}</span>
                    <span className="text-cyan-300">MP {p2Stats.maxMp}</span>
                    <span className="text-orange-300">ちから {p2Stats.attack}</span>
                  </div>
                </div>
              </div>

              {/* 2P 怪獣リスト（全怪獣からレンタル選択可能！） */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {KAIJU_LIST.map((k) => {
                  const isSelected = k.id === p2Kaiju.id;
                  const el = getElementMeta(k.element);
                  const tp = getTypeMeta(k.type);
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => {
                        playTapSound(600);
                        setP2KaijuId(k.id);
                      }}
                      className={`min-h-[64px] rounded-2xl p-2 text-left border-2 flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? `bg-gradient-to-r ${el.bgGradient} text-white border-white shadow-lg`
                          : 'bg-slate-950/90 text-slate-200 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="w-11 h-11 shrink-0">
                        <KaijuSvgIllustration
                          element={k.element}
                          type={k.type}
                          evolutionStage={p2Stats.stage}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-black text-cyan-300">
                          {el.emoji}
                          {tp.emoji}
                        </div>
                        <div className="text-xs font-black truncate">{k.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 特大「⚔️ バトル スタート！！」ボタン */}
          <button
            type="button"
            onClick={handleStartBattle}
            className="min-h-[76px] w-full rounded-3xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center gap-3 border-4 border-white shadow-[0_8px_0_#9f1239,0_0_35px_rgba(244,63,94,0.8)] transition-all cursor-pointer"
          >
            <Swords className="w-8 h-8 shrink-0" />
            <span>⚔️ バトル スタート！！</span>
          </button>
        </div>
      )}

      {/* ============================================================
          PHASE 2: ドラクエ風コマンド対戦フェーズ ('battle')
         ============================================================ */}
      {phase === 'battle' && (
        <div
          className={`space-y-4 transition-colors duration-200 ${
            criticalFlash ? 'bg-yellow-300/30 rounded-3xl p-2' : ''
          }`}
        >
          {/* 上部：1P と 2P のドラクエ風ステータスウィンドウ */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1P ステータス窓 */}
            <div
              className={`dq-window p-3 text-white transition-all ${
                turn === 1 ? 'ring-4 ring-yellow-300' : 'opacity-85'
              }`}
            >
              <div className="flex items-center justify-between gap-1 border-b-2 border-white/20 pb-1 mb-2">
                <span className="text-xs sm:text-sm font-black text-amber-300 truncate">
                  👦 {p1Stats.displayName}
                </span>
                <span className="text-xs font-black text-yellow-300 shrink-0">
                  Lv.{p1Stats.level}
                </span>
              </div>

              {/* HPゲージ */}
              <div className="space-y-1 mb-2">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-emerald-300">HP</span>
                  <span className="tabular-nums">
                    {p1Hp} / {p1Stats.maxHp}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/25">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.round((p1Hp / p1Stats.maxHp) * 100))}%` }}
                  />
                </div>
              </div>

              {/* MPゲージ */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-cyan-300">MP</span>
                  <span className="tabular-nums">
                    {p1Mp} / {p1Stats.maxMp}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/25">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.round((p1Mp / p1Stats.maxMp) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2P ステータス窓 */}
            <div
              className={`dq-window p-3 text-white transition-all ${
                turn === 2 ? 'ring-4 ring-cyan-300' : 'opacity-85'
              }`}
            >
              <div className="flex items-center justify-between gap-1 border-b-2 border-white/20 pb-1 mb-2">
                <span className="text-xs sm:text-sm font-black text-cyan-300 truncate">
                  👨 {p2Stats.displayName}
                </span>
                <span className="text-xs font-black text-yellow-300 shrink-0">
                  Lv.{p2Stats.level}
                </span>
              </div>

              {/* HPゲージ */}
              <div className="space-y-1 mb-2">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-emerald-300">HP</span>
                  <span className="tabular-nums">
                    {p2Hp} / {p2Stats.maxHp}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/25">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.round((p2Hp / p2Stats.maxHp) * 100))}%` }}
                  />
                </div>
              </div>

              {/* MPゲージ */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-cyan-300">MP</span>
                  <span className="tabular-nums">
                    {p2Mp} / {p2Stats.maxMp}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/25">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.round((p2Mp / p2Stats.maxMp) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 中央：1P怪獣（左）と 2P怪獣（右・左右反転）が向かい合うバトルステージ */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/80 to-slate-950 border-2 border-white/20 p-4 sm:p-6 overflow-hidden">
            {/* 会心の一撃カットイン演出 */}
            {criticalFlash && (
              <div className="absolute inset-0 z-30 bg-amber-400/35 flex items-center justify-center pointer-events-none">
                <div className="bg-rose-600 text-yellow-200 font-black text-2xl sm:text-4xl px-6 py-3 rounded-2xl border-4 border-white shadow-2xl animate-bounce">
                  💥 かいしんの いちげき！！
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 items-center gap-4 min-h-[190px] sm:min-h-[230px]">
              {/* 左：1P怪獣 */}
              <div className="flex flex-col items-center justify-center relative">
                {p1Charged && (
                  <div className="mb-1 px-2.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-black text-xs animate-bounce">
                    ⚡ かいしんチャージ中！
                  </div>
                )}
                <div
                  className={`w-36 h-36 sm:w-48 sm:h-48 transition-transform duration-200 ${
                    p1Attacking ? 'translate-x-8 scale-110' : ''
                  }`}
                >
                  <KaijuSvgIllustration
                    element={p1Kaiju.element}
                    type={p1Kaiju.type}
                    evolutionStage={p1Stats.stage}
                    isAttacking={p1Attacking}
                    isDamaged={p1Damaged}
                  />
                </div>
              </div>

              {/* 右：2P怪獣（左向きに反転） */}
              <div className="flex flex-col items-center justify-center relative">
                {p2Charged && (
                  <div className="mb-1 px-2.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-black text-xs animate-bounce">
                    ⚡ かいしんチャージ中！
                  </div>
                )}
                <div
                  className={`w-36 h-36 sm:w-48 sm:h-48 transition-transform duration-200 ${
                    p2Attacking ? '-translate-x-8 scale-110' : ''
                  }`}
                >
                  <KaijuSvgIllustration
                    element={p2Kaiju.element}
                    type={p2Kaiju.type}
                    evolutionStage={p2Stats.stage}
                    isAttacking={p2Attacking}
                    isDamaged={p2Damaged}
                    flipHorizontal
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ドラクエ風バトル実況メッセージウィンドウ（.dq-window） */}
          <div className="dq-window p-4 text-white space-y-1.5 min-h-[96px]">
            {battleLogs.map((line, idx) => (
              <p
                key={idx}
                className={`text-sm sm:text-lg font-black leading-snug ${
                  line.includes('かいしん') ? 'text-yellow-300' : 'text-white'
                }`}
              >
                {line}
              </p>
            ))}
          </div>

          {/* ドラクエ風コマンド選択パネル（.dq-window） */}
          <div className="dq-window p-4 text-white space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-white/20 pb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full font-black text-sm sm:text-base ${
                    turn === 1 ? 'bg-amber-400 text-slate-950' : 'bg-cyan-400 text-slate-950'
                  }`}
                >
                  {turn === 1
                    ? `👦 1P（${p1Stats.displayName}）の ターン！`
                    : `👨 2P パパ（${p2Stats.displayName}）の ターン！`}
                </span>
                {currentActorCharged && (
                  <span className="text-xs font-black text-yellow-300">
                    💥 つぎのわざで かいしんのいちげき確定！
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPapaCpu((prev) => !prev)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-cyan-300 border border-white/20 cursor-pointer"
                >
                  {isPapaCpu ? '🤖 パパCPU: ON' : '👨 パパ手動: ON'}
                </button>
                <button
                  type="button"
                  onClick={() => setPhase('select')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-300 border border-white/20 cursor-pointer"
                >
                  えらびなおす
                </button>
              </div>
            </div>

            {turn === 2 && isPapaCpu ? (
              <div className="py-6 text-center text-lg font-black text-cyan-300 animate-pulse">
                🤖 パパの {p2Stats.displayName} が わざを かんがえているよ…！
              </div>
            ) : (
              <div className="space-y-3">
                {/* 習得している技ボタン（最大4つ） */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentActorStats.unlockedSkills.map((skill) => {
                    const canPayMp = currentActorMp >= skill.mpCost;
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        disabled={isAnimatingAction}
                        onClick={() => executeCommand(turn, skill)}
                        className={`min-h-[64px] rounded-2xl p-3 text-left border-2 flex items-center justify-between gap-2 transition-all active:scale-95 cursor-pointer ${
                          !canPayMp
                            ? 'bg-slate-900/60 border-slate-700 text-slate-500'
                            : skill.isUltimate
                            ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white border-yellow-200 shadow-lg'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border-white/40 shadow'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-base sm:text-lg font-black truncate flex items-center gap-1.5">
                            <span>{skill.isUltimate ? '👑' : '⚔️'}</span>
                            <span>{skill.name}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-200 truncate">
                            💥 威力 {skill.power} {canPayMp ? '' : '（MPが たりないよ！）'}
                          </div>
                        </div>
                        <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-cyan-400/50 text-xs font-black text-cyan-300 tabular-nums shrink-0">
                          MP {skill.mpCost}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ⚡ エネルギーためる（MP回復＆次回会心確定！）特大ボタン */}
                <button
                  type="button"
                  disabled={isAnimatingAction}
                  onClick={() => executeCommand(turn, 'charge')}
                  className="min-h-[60px] w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 active:scale-95 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2 border-2 border-white shadow-lg cursor-pointer"
                >
                  <Zap className="w-6 h-6 fill-yellow-300 text-yellow-300 shrink-0" />
                  <span>⚡ エネルギーを ためる（MP +20 ＆ つぎの攻撃 かいしん確定！）</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          PHASE 3: 勝敗結果＆ごほうびフェーズ ('result')
         ============================================================ */}
      {phase === 'result' && (
        <div className="dq-window p-5 sm:p-6 text-center text-white space-y-5">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-base sm:text-lg shadow-lg">
            <Trophy className="w-6 h-6" />
            <span>
              {winner === 1 ? '🎉 1P（むすこ）の だいしょうり！！' : '👏 2P（パパ）の しょうり！！'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-yellow-300 drop-shadow">
            {winner === 1
              ? `${p1Stats.displayName} の かち！！`
              : `${p2Stats.displayName} の かち！！`}
          </h2>

          {/* 勝った怪獣のイラスト */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto">
            <KaijuSvgIllustration
              element={winner === 1 ? p1Kaiju.element : p2Kaiju.element}
              type={winner === 1 ? p1Kaiju.type : p2Kaiju.type}
              evolutionStage={winner === 1 ? p1Stats.stage : p2Stats.stage}
              isAttacking
            />
          </div>

          {/* バトルごほうびボックス（勝っても負けてももらえる！） */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-emerald-500/25 border-2 border-yellow-300 p-4 max-w-md mx-auto space-y-1.5">
            <div className="text-sm font-black text-yellow-300 flex items-center justify-center gap-1.5">
              <Sparkles className="w-5 h-5" />
              <span>バトルを さいごまで がんばった ごほうび！</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              🌟 けいけんち玉 ＋2こ ゲット！
            </div>
            <div className="text-sm sm:text-base font-black text-emerald-300">
              💪 {p1Stats.displayName} に けいけんち ＋50！
            </div>
          </div>

          {/* もういちどバトル / 怪獣をえらびなおす */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2">
            <button
              type="button"
              onClick={handleStartBattle}
              className="min-h-[64px] rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 text-slate-950 font-black text-lg flex items-center justify-center gap-2 border-2 border-white shadow-[0_5px_0_#b45309] active:scale-95 cursor-pointer"
            >
              <Swords className="w-6 h-6" />
              <span>もういちど バトルする！</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playTapSound(520);
                setPhase('select');
              }}
              className="min-h-[64px] rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-lg flex items-center justify-center gap-2 border-2 border-white/30 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-6 h-6" />
              <span>かいじゅうを えらびなおす</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

