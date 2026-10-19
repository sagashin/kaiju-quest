'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Zap,
  Bot,
  User,
  Trophy,
  RotateCcw,
  Sparkles,
  Shield,
  Heart,
  Plus,
  Minus,
} from 'lucide-react';
import {
  KAIJU_LIST,
  KaijuData,
  KaijuProgress,
  KaijuSkill,
  KaijuComputedStats,
  getKaijuStats,
  getElementMeta,
  getTypeMeta,
  getElementAdvantage,
} from '@/lib/kaiju-data';
import { KaijuSvgIllustration } from '@/components/kaiju-artwork';
import {
  playTapSound,
  playBattleAttackSound,
  playMpChargeSound,
  playBattleVictorySound,
  playHealSound,
  playYoutuberAirhornSound,
  playBeatboxIntroSound,
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

interface DamagePopup {
  target: 1 | 2;
  text: string;
  isHeal?: boolean;
  isCritical?: boolean;
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
  // 初期値を 'normal'（1Pと同じレベルで白熱）に設定
  const [papaDifficulty, setPapaDifficulty] = useState<PapaDifficulty>('normal');
  const [p2ManualLevel, setP2ManualLevel] = useState<number | null>(null);
  const [isPapaCpu, setIsPapaCpu] = useState<boolean>(false);

  // バトル進行ステート
  const [turn, setTurn] = useState<1 | 2>(1);
  const [isAnimatingAction, setIsAnimatingAction] = useState<boolean>(false);
  const [p1Hp, setP1Hp] = useState<number>(300);
  const [p1Mp, setP1Mp] = useState<number>(50);
  const [p2Hp, setP2Hp] = useState<number>(300);
  const [p2Mp, setP2Mp] = useState<number>(50);
  const [p1Charged, setP1Charged] = useState<boolean>(false);
  const [p2Charged, setP2Charged] = useState<boolean>(false);

  // パワーチャージ・ルーレット（タイミングタップ）ステート
  const [rouletteSkill, setRouletteSkill] = useState<KaijuSkill | null>(null);
  const [rouletteZone, setRouletteZone] = useState<number>(50);
  const rouletteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ダメージ／回復ポップアップ
  const [damagePopup, setDamagePopup] = useState<DamagePopup | null>(null);

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

  // 2P（パパ）のレベル計算（難易度モード＋手動調整）
  const baseLevelFromDiff =
    papaDifficulty === 'easy'
      ? p1Stats.level
      : papaDifficulty === 'normal'
      ? p1Stats.level
      : p1Stats.level + 2;

  const p2Level = p2ManualLevel !== null ? p2ManualLevel : Math.max(1, baseLevelFromDiff);

  const p2BaseStats: KaijuComputedStats = getKaijuStats(p2Kaiju, {
    level: p2Level,
    exp: 0,
  });

  // モード別HP倍率（easy: 0.85倍, normal: 1.0倍, hard: 1.4倍ボスHP）
  const hpMult = papaDifficulty === 'easy' ? 0.85 : papaDifficulty === 'hard' ? 1.4 : 1.0;
  const p2Stats: KaijuComputedStats = {
    ...p2BaseStats,
    maxHp: Math.max(140, Math.round(p2BaseStats.maxHp * hpMult)),
  };

  // スクロールトップ移動ヘルパー
  const resetScrollTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ルーレットのバー往復アニメーション
  useEffect(() => {
    if (!rouletteSkill) return;

    let dir = 1;
    const interval = setInterval(() => {
      setRouletteZone((prev) => {
        let next = prev + dir * 14;
        if (next >= 95) {
          next = 95;
          dir = -1;
        } else if (next <= 5) {
          next = 5;
          dir = 1;
        }
        return next;
      });
    }, 45);

    // 1.2秒後に自動で通常攻撃（4歳児が押せなくてもスムーズに進行する安全タイマー）
    rouletteTimerRef.current = setTimeout(() => {
      handleStopRoulette(false);
    }, 1200);

    return () => {
      clearInterval(interval);
      if (rouletteTimerRef.current) clearTimeout(rouletteTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rouletteSkill]);

  // バトル開始処理
  const handleStartBattle = () => {
    playTapSound(680);
    resetScrollTop();
    setP1Hp(p1Stats.maxHp);
    setP1Mp(p1Stats.maxMp);
    setP2Hp(p2Stats.maxHp);
    setP2Mp(p2Stats.maxMp);
    setP1Charged(false);
    setP2Charged(false);
    setTurn(1);
    setWinner(null);
    setIsAnimatingAction(false);
    setRouletteSkill(null);
    setDamagePopup(null);
    setBattleLogs([
      `🔥 ${p1Stats.displayName} (Lv.${p1Stats.level}) VS ${p2Stats.displayName} (Lv.${p2Stats.level})！`,
      '👦 1Pの ターン！ わざ・かいふく・ためる を えらんでね！',
    ]);
    setPhase('battle');
    speakJapanese(
      `ブンブン！バトルスタート！${p1Stats.displayName} たい パパの ${p2Stats.displayName}！1Pのターンだ！いくぞー！`,
      soundEnabled
    );
  };

  // 1Pが技ボタンを押した時のルーレット開始
  const handleSelectSkillForP1 = (skill: KaijuSkill) => {
    if (isAnimatingAction || phase !== 'battle' || turn !== 1) return;
    if (p1Mp < skill.mpCost) {
      playTapSound(320);
      speakJapanese(
        'おっと！MPが たりないよ！パワーためる ボタンで MPを かいふくしよう！',
        soundEnabled
      );
      return;
    }

    playTapSound(620);
    // チャージ済みなら即発動、そうでなければルーレットチャンス！
    if (p1Charged) {
      executeSkill(1, skill, true);
    } else {
      setRouletteSkill(skill);
      setRouletteZone(30);
    }
  };

  // ルーレットストップボタンを押した時
  const handleStopRoulette = (isManualPress = true) => {
    if (rouletteTimerRef.current) clearTimeout(rouletteTimerRef.current);
    const skill = rouletteSkill;
    if (!skill) return;

    setRouletteSkill(null);

    // 中央付近（35%〜65%）なら会心成功！手動プッシュ時は当たり判定を広めに優しく設定
    const isSuccess = isManualPress && rouletteZone >= 30 && rouletteZone <= 70;
    if (isSuccess) {
      playYoutuberAirhornSound();
    }
    executeSkill(1, skill, isSuccess);
  };

  // 💚 ドラクエ風「かいふく（ホイミ）」コマンドの実行
  const executeHeal = (actor: 1 | 2) => {
    if (isAnimatingAction || phase !== 'battle') return;

    const isP1 = actor === 1;
    const actorStats = isP1 ? p1Stats : p2Stats;
    const actorMp = isP1 ? p1Mp : p2Mp;
    const actorHp = isP1 ? p1Hp : p2Hp;
    const actorTitle = isP1 ? '👦 1P' : '👨 2P(パパ)';

    const HEAL_MP_COST = 15;
    if (actorMp < HEAL_MP_COST) {
      playTapSound(320);
      speakJapanese('おっと！かいふくには MPが 15 ひつようだよ！ためてみよう！', soundEnabled);
      return;
    }

    setIsAnimatingAction(true);
    playHealSound();

    const healAmount = Math.round(actorStats.maxHp * 0.35);
    const nextHp = Math.min(actorStats.maxHp, actorHp + healAmount);
    const nextMp = Math.max(0, actorMp - HEAL_MP_COST);

    if (isP1) {
      setP1Hp(nextHp);
      setP1Mp(nextMp);
    } else {
      setP2Hp(nextHp);
      setP2Mp(nextMp);
    }

    setDamagePopup({
      target: actor,
      text: `+${healAmount}`,
      isHeal: true,
    });

    const logs = [
      `💚 ${actorTitle}の ${actorStats.displayName}は かいふくじゅもんを となえた！`,
      `✨ HPが ${healAmount} かいふく！ げんきモリモリだー！`,
    ];
    setBattleLogs(logs);
    speakJapanese(
      `キターーー！${actorStats.displayName}は かいふくした！HPが ${healAmount} ふっかつだ！`,
      soundEnabled
    );

    setTimeout(() => {
      setDamagePopup(null);
      setTurn(isP1 ? 2 : 1);
      setIsAnimatingAction(false);
    }, 1350);
  };

  // ⚡ パワーためる（MP +25 & 次回会心確定）
  const executeCharge = (actor: 1 | 2) => {
    if (isAnimatingAction || phase !== 'battle') return;

    const isP1 = actor === 1;
    const actorStats = isP1 ? p1Stats : p2Stats;
    const actorMp = isP1 ? p1Mp : p2Mp;
    const actorTitle = isP1 ? '👦 1P' : '👨 2P(パパ)';

    setIsAnimatingAction(true);
    playMpChargeSound();

    const nextMp = Math.min(actorStats.maxMp, actorMp + 25);
    if (isP1) {
      setP1Mp(nextMp);
      setP1Charged(true);
    } else {
      setP2Mp(nextMp);
      setP2Charged(true);
    }

    setDamagePopup({
      target: actor,
      text: `MP+25 ⚡`,
      isHeal: true,
    });

    const logs = [
      `⚡ ${actorTitle}の ${actorStats.displayName}は パワーを ためた！`,
      '✨ MPが 25 かいふく！ つぎの こうげきで「かいしんの いちげき」が でるぞ！！',
    ];
    setBattleLogs(logs);
    speakJapanese(
      `パワーためる！MPが たまったぞ！つぎは かいしんの いちげき 確定だ！`,
      soundEnabled
    );

    setTimeout(() => {
      setDamagePopup(null);
      setTurn(isP1 ? 2 : 1);
      setIsAnimatingAction(false);
    }, 1300);
  };

  // 技の実行（ダメージ計算・相性判定・アニメーション）
  const executeSkill = (actor: 1 | 2, skill: KaijuSkill, forceCritical = false) => {
    if (isAnimatingAction || phase !== 'battle') return;

    const isP1 = actor === 1;
    const attackerStats = isP1 ? p1Stats : p2Stats;
    const defenderStats = isP1 ? p2Stats : p1Stats;
    const attackerKaiju = isP1 ? p1Kaiju : p2Kaiju;
    const defenderKaiju = isP1 ? p2Kaiju : p1Kaiju;
    const attackerMp = isP1 ? p1Mp : p2Mp;
    const defenderHp = isP1 ? p2Hp : p1Hp;
    const isCharged = isP1 ? p1Charged : p2Charged;
    const actorTitle = isP1 ? '👦 1P' : '👨 2P(パパ)';

    // MPチェック
    if (attackerMp < skill.mpCost) {
      playTapSound(320);
      speakJapanese('MPが たりないよ！パワーを ためよう！', soundEnabled);
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

    // 会心判定（チャージ中またはルーレット成功時は確定）
    const isCritical = forceCritical || isCharged || Math.random() < (isP1 ? 0.25 : 0.18);

    // 属性相性判定
    const adv = getElementAdvantage(attackerKaiju.element, defenderKaiju.element);

    // ワンパン防止の3〜5ターンバランス計算式
    const baseDmg =
      skill.power * 0.85 + attackerStats.attack * 0.55 - defenderStats.defense * 0.25;
    const variance = 0.94 + Math.random() * 0.12;
    const critMult = isCritical ? 1.45 : 1.0;
    const rawDamage = Math.max(
      18,
      Math.round(baseDmg * adv.multiplier * critMult * variance)
    );
    const nextDefenderHp = Math.max(0, defenderHp - rawDamage);

    if (isCritical) {
      playYoutuberAirhornSound();
      setCriticalFlash(true);
      setTimeout(() => setCriticalFlash(false), 450);
    } else {
      playBattleAttackSound(false);
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

      setDamagePopup({
        target: isP1 ? 2 : 1,
        text: `-${rawDamage}`,
        isCritical,
      });

      const logs: string[] = [
        `▶ ${actorTitle}の ${attackerStats.displayName}の『${skill.name}』！`,
      ];

      if (adv.label) {
        logs.push(adv.label);
      }

      if (isCritical) {
        logs.push(`💥 かいしんの いちげき！！ ${rawDamage} の大ダメージ！！`);
      } else {
        logs.push(`⚡ ${rawDamage} のダメージを あたえた！`);
      }

      setBattleLogs(logs);

      const critSpeech = isCritical ? 'かいしんの いちげきーっ！！' : '';
      const advSpeech = adv.multiplier > 1.0 ? 'こうかは ばつぐんだ！' : '';
      speakJapanese(
        `${attackerStats.displayName}の ${skill.name}！${advSpeech} ${critSpeech} ${rawDamage} のダメージ！`,
        soundEnabled
      );

      setTimeout(() => {
        setP1Damaged(false);
        setP2Damaged(false);
        setDamagePopup(null);

        // 勝敗判定
        if (nextDefenderHp <= 0) {
          setWinner(actor);
          setPhase('result');
          setIsAnimatingAction(false);
          resetScrollTop();
          playBattleVictorySound();
          onBattleComplete(p1Kaiju.id);

          const winName = attackerStats.displayName;
          const winSpeech =
            actor === 1
              ? `キターーー！1P、${winName}の だいしょうりーっ！おめでとう！ごほうびに けいけんち玉 2こと、けいけんち 50 をゲットしたよ！神ってるー！`
              : `うおおお！パパの ${winName}の しょうり！でも さいごまで たたかった ごほうびに けいけんち玉 2こと、けいけんち 50 をゲットしたよ！`;
          speakJapanese(winSpeech, soundEnabled);
        } else {
          setTurn(isP1 ? 2 : 1);
          setIsAnimatingAction(false);
        }
      }, 750);
    }, 400);
  };

  // パパがCPU（オート）モードのときの自動行動
  useEffect(() => {
    if (phase !== 'battle' || turn !== 2 || !isPapaCpu || isAnimatingAction) return;

    const timer = setTimeout(() => {
      // ピンチ時（HP30%以下）は確率で回復
      if (p2Hp <= p2Stats.maxHp * 0.35 && p2Mp >= 15 && Math.random() < 0.6) {
        executeHeal(2);
        return;
      }

      const usableSkills = p2Stats.unlockedSkills.filter((s) => p2Mp >= s.mpCost);
      if (usableSkills.length === 0 || (p2Mp < 15 && Math.random() < 0.5)) {
        executeCharge(2);
      } else {
        // パパの技選択（少し強い技を優先）
        const chosen = usableSkills[Math.floor(Math.random() * usableSkills.length)];
        executeSkill(2, chosen);
      }
    }, 1100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turn, isPapaCpu, isAnimatingAction, p2Hp, p2Mp]);

  const currentActorStats = turn === 1 ? p1Stats : p2Stats;
  const currentActorMp = turn === 1 ? p1Mp : p2Mp;
  const currentActorCharged = turn === 1 ? p1Charged : p2Charged;

  return (
    <section className="space-y-4">
      {/* ============================================================
          PHASE 1: 怪獣えらびフェーズ ('select')
         ============================================================ */}
      {phase === 'select' && (
        <div className="space-y-4">
          {/* タイトルヘッダー */}
          <div className="dq-window p-3.5 sm:p-4 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-yellow-300 flex items-center gap-2">
                <Swords className="w-6 h-6 text-amber-400 shrink-0" />
                <span>⚔️ ふたりで かいじゅうバトル！</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-300 mt-0.5">
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
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 transition-all cursor-pointer ${
                isPapaCpu
                  ? 'bg-cyan-400 text-slate-950 border-white shadow-md'
                  : 'bg-slate-800 text-slate-200 border-white/25'
              }`}
            >
              {isPapaCpu ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              <span>{isPapaCpu ? '🤖 パパ：オート(CPU)' : '👨 パパ：じぶんで操作'}</span>
            </button>
          </div>

          {/* 1P VS 2P 選択プレビューカード */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 👦 1P（むすこ）怪獣選択 */}
            <div className="rounded-3xl bg-slate-900/95 border-2 border-amber-400/60 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs sm:text-sm">
                  👦 1P（むすこ）の かいじゅう
                </span>
                <span className="text-xs font-black text-amber-300">
                  Lv.{p1Stats.level} / HP {p1Stats.maxHp}
                </span>
              </div>

              {/* 選択中の1P怪獣プレビュー */}
              <div className="dq-window p-2.5 flex items-center gap-3">
                <div className="w-20 h-20 shrink-0">
                  <KaijuSvgIllustration
                    element={p1Kaiju.element}
                    type={p1Kaiju.type}
                    evolutionStage={p1Stats.stage}
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="text-xs font-black text-amber-300">
                    {getElementMeta(p1Kaiju.element).emoji} {getElementMeta(p1Kaiju.element).label} ·{' '}
                    {getTypeMeta(p1Kaiju.type).emoji} {getTypeMeta(p1Kaiju.type).label}
                  </div>
                  <div className="text-base sm:text-lg font-black text-white truncate">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {p1AvailableList.map((k) => {
                  const isSelected = k.id === p1Kaiju.id;
                  const el = getElementMeta(k.element);
                  const tp = getTypeMeta(k.type);
                  const prog = kaijuProgress[k.id];
                  const stats = getKaijuStats(k, prog);
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => {
                        playTapSound(580);
                        setP1KaijuId(k.id);
                      }}
                      className={`min-h-[58px] rounded-2xl p-2 text-left border-2 flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? `bg-gradient-to-r ${el.bgGradient} text-white border-white shadow-lg`
                          : 'bg-slate-950/90 text-slate-200 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="w-10 h-10 shrink-0">
                        <KaijuSvgIllustration
                          element={k.element}
                          type={k.type}
                          evolutionStage={stats.stage}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-black text-yellow-300">
                          Lv.{stats.level} {el.emoji}
                        </div>
                        <div className="text-xs font-black truncate">{stats.displayName}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 👨 2P（パパ）怪獣選択 ＆ レベル調整 */}
            <div className="rounded-3xl bg-slate-900/95 border-2 border-cyan-400/60 p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm">
                  👨 2P（パパ）の かいじゅう
                </span>

                {/* パパのレベル微調整ボタン [ー] [＋] */}
                <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-white/20">
                  <span className="text-xs font-black text-yellow-300 mr-1">Lv.{p2Level}</span>
                  <button
                    type="button"
                    onClick={() => {
                      playTapSound(440);
                      setP2ManualLevel(Math.max(1, p2Level - 1));
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center font-black cursor-pointer border border-white/20"
                    title="パパのレベルを下げる"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playTapSound(580);
                      setP2ManualLevel(Math.min(15, p2Level + 1));
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-yellow-300 flex items-center justify-center font-black cursor-pointer border border-white/20"
                    title="パパのレベルを上げる"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* パパの強さ3段階モード */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'easy' as const, label: 'おなじLv(やさしい)', desc: 'HP 0.85倍' },
                  { id: 'normal' as const, label: 'おなじLv(ガチ)', desc: '互角勝負！' },
                  { id: 'hard' as const, label: '😈大魔王パパ', desc: 'Lv+2 & ボスHP' },
                ].map((mode) => {
                  const isActive = papaDifficulty === mode.id && p2ManualLevel === null;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        playTapSound(540);
                        setPapaDifficulty(mode.id);
                        setP2ManualLevel(null);
                      }}
                      className={`min-h-[44px] rounded-xl p-1 text-center border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 font-black border-white shadow'
                          : 'bg-slate-950/80 text-slate-300 border-white/15 hover:bg-slate-800 text-xs'
                      }`}
                    >
                      <div className="text-[11px] font-black truncate">{mode.label}</div>
                      <div className="text-[9px] opacity-80">{mode.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* 選択中の2P怪獣プレビュー */}
              <div className="dq-window p-2.5 flex items-center gap-3">
                <div className="w-20 h-20 shrink-0">
                  <KaijuSvgIllustration
                    element={p2Kaiju.element}
                    type={p2Kaiju.type}
                    evolutionStage={p2Stats.stage}
                    flipHorizontal
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="text-xs font-black text-cyan-300">
                    {getElementMeta(p2Kaiju.element).emoji} {getElementMeta(p2Kaiju.element).label} ·{' '}
                    {getTypeMeta(p2Kaiju.type).emoji} {getTypeMeta(p2Kaiju.type).label}
                  </div>
                  <div className="text-base sm:text-lg font-black text-white truncate">
                    {p2Stats.displayName}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-black">
                    <span className="text-emerald-300">HP {p2Stats.maxHp}</span>
                    <span className="text-cyan-300">MP {p2Stats.maxMp}</span>
                    <span className="text-orange-300">ちから {p2Stats.attack}</span>
                  </div>
                </div>
              </div>

              {/* 2P 怪獣リスト */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {KAIJU_LIST.map((k) => {
                  const isSelected = k.id === p2Kaiju.id;
                  const el = getElementMeta(k.element);
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => {
                        playTapSound(600);
                        setP2KaijuId(k.id);
                      }}
                      className={`min-h-[58px] rounded-2xl p-2 text-left border-2 flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? `bg-gradient-to-r ${el.bgGradient} text-white border-white shadow-lg`
                          : 'bg-slate-950/90 text-slate-200 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="w-10 h-10 shrink-0">
                        <KaijuSvgIllustration
                          element={k.element}
                          type={k.type}
                          evolutionStage={p2Stats.stage}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-black text-cyan-300">{el.emoji}</div>
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
            className="min-h-[72px] w-full rounded-3xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center gap-3 border-4 border-white shadow-[0_6px_0_#9f1239,0_0_35px_rgba(244,63,94,0.8)] transition-all cursor-pointer"
          >
            <Swords className="w-8 h-8 shrink-0" />
            <span>⚔️ バトル スタート！！</span>
          </button>
        </div>
      )}

      {/* ============================================================
          PHASE 2: ドラクエ風コマンド対戦フェーズ ('battle')
          ★ ノンスクロール・1画面完結レイアウト！
         ============================================================ */}
      {phase === 'battle' && (
        <div
          className={`space-y-3 transition-colors duration-200 ${
            criticalFlash ? 'bg-yellow-300/30 rounded-3xl p-1' : ''
          }`}
        >
          {/* ==================== 1. 一体化バトルステージ（HP/MPオーバーレイ） ==================== */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-white/20 p-3 sm:p-4 overflow-hidden shadow-2xl">
            {/* 上部オーバーレイ：1P & 2P コンパクトステータスバー */}
            <div className="grid grid-cols-2 gap-2 mb-2 z-10 relative">
              {/* 1P ステータス */}
              <div
                className={`rounded-2xl p-2 bg-slate-950/85 border transition-all ${
                  turn === 1 ? 'border-amber-400 ring-2 ring-yellow-300' : 'border-white/20 opacity-85'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-black text-amber-300 truncate">
                  <span>👦 {p1Stats.displayName}</span>
                  <span className="text-yellow-300 text-[10px] shrink-0">Lv.{p1Stats.level}</span>
                </div>
                {/* HPバー */}
                <div className="mt-1 space-y-0.5">
                  <div className="flex justify-between text-[10px] font-black">
                    <span className="text-emerald-300">HP</span>
                    <span className="text-white tabular-nums">
                      {p1Hp} / {p1Stats.maxHp}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/20">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.round((p1Hp / p1Stats.maxHp) * 100))}%` }}
                    />
                  </div>
                </div>
                {/* MPバー */}
                <div className="mt-0.5 flex items-center justify-between text-[9px] font-black text-cyan-300">
                  <span>MP</span>
                  <span className="tabular-nums">
                    {p1Mp}/{p1Stats.maxMp}
                  </span>
                </div>
              </div>

              {/* 2P ステータス */}
              <div
                className={`rounded-2xl p-2 bg-slate-950/85 border transition-all ${
                  turn === 2 ? 'border-cyan-400 ring-2 ring-cyan-300' : 'border-white/20 opacity-85'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-black text-cyan-300 truncate">
                  <span>👨 {p2Stats.displayName}</span>
                  <span className="text-yellow-300 text-[10px] shrink-0">Lv.{p2Stats.level}</span>
                </div>
                {/* HPバー */}
                <div className="mt-1 space-y-0.5">
                  <div className="flex justify-between text-[10px] font-black">
                    <span className="text-emerald-300">HP</span>
                    <span className="text-white tabular-nums">
                      {p2Hp} / {p2Stats.maxHp}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/20">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.round((p2Hp / p2Stats.maxHp) * 100))}%` }}
                    />
                  </div>
                </div>
                {/* MPバー */}
                <div className="mt-0.5 flex items-center justify-between text-[9px] font-black text-cyan-300">
                  <span>MP</span>
                  <span className="tabular-nums">
                    {p2Mp}/{p2Stats.maxMp}
                  </span>
                </div>
              </div>
            </div>

            {/* 会心の一撃カットイン演出 */}
            {criticalFlash && (
              <div className="absolute inset-0 z-30 bg-amber-400/40 flex items-center justify-center pointer-events-none">
                <div className="bg-rose-600 text-yellow-200 font-black text-xl sm:text-3xl px-5 py-2.5 rounded-2xl border-4 border-white shadow-2xl animate-bounce">
                  💥 かいしんの いちげき！！
                </div>
              </div>
            )}

            {/* 怪獣グラフィック対決エリア */}
            <div className="grid grid-cols-2 items-center gap-2 min-h-[140px] sm:min-h-[180px] relative">
              {/* 1P 怪獣 */}
              <div className="flex flex-col items-center justify-center relative">
                {/* ダメージ/回復ポップアップバッジ */}
                {damagePopup && damagePopup.target === 1 && (
                  <div
                    className={`absolute -top-3 z-30 px-3 py-1 rounded-full font-black text-sm sm:text-base border-2 shadow-xl animate-bounce ${
                      damagePopup.isHeal
                        ? 'bg-emerald-500 text-white border-white'
                        : 'bg-rose-600 text-yellow-200 border-white'
                    }`}
                  >
                    {damagePopup.text}
                  </div>
                )}
                {p1Charged && (
                  <div className="mb-0.5 px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-black text-[10px] animate-bounce">
                    ⚡ かいしんチャージ中！
                  </div>
                )}
                <div
                  className={`w-28 h-28 sm:w-40 sm:h-40 transition-transform duration-200 ${
                    p1Attacking ? 'translate-x-6 scale-110' : ''
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

              {/* 2P 怪獣 */}
              <div className="flex flex-col items-center justify-center relative">
                {/* ダメージ/回復ポップアップバッジ */}
                {damagePopup && damagePopup.target === 2 && (
                  <div
                    className={`absolute -top-3 z-30 px-3 py-1 rounded-full font-black text-sm sm:text-base border-2 shadow-xl animate-bounce ${
                      damagePopup.isHeal
                        ? 'bg-emerald-500 text-white border-white'
                        : 'bg-rose-600 text-yellow-200 border-white'
                    }`}
                  >
                    {damagePopup.text}
                  </div>
                )}
                {p2Charged && (
                  <div className="mb-0.5 px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-black text-[10px] animate-bounce">
                    ⚡ かいしんチャージ中！
                  </div>
                )}
                <div
                  className={`w-28 h-28 sm:w-40 sm:h-40 transition-transform duration-200 ${
                    p2Attacking ? '-translate-x-6 scale-110' : ''
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

          {/* ==================== 2. ドラクエ方式：コマンド入力 ⇄ 実況ウィンドウ自動切り替え ==================== */}

          {/* A. 技・回復アクション実行中の大画面実況メッセージウィンドウ */}
          {isAnimatingAction ? (
            <div className="dq-window p-4 text-white min-h-[170px] flex flex-col justify-center space-y-2 animate-fadeIn">
              <div className="text-xs font-black text-amber-300">⚔️ バトルじっきょう</div>
              {battleLogs.map((line, idx) => (
                <p
                  key={idx}
                  className={`text-base sm:text-xl font-black leading-snug ${
                    line.includes('かいしん')
                      ? 'text-yellow-300 animate-pulse'
                      : line.includes('ばつぐん')
                      ? 'text-amber-300'
                      : 'text-white'
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          ) : rouletteSkill ? (
            /* B. 4歳児が熱狂する「パワーチャージ・ルーレット（タイミングタップ）」 */
            <div className="dq-window p-4 text-white space-y-3 text-center animate-fadeIn">
              <div className="text-sm sm:text-base font-black text-yellow-300 animate-pulse">
                ⚡ タイミングよく ボタンをおして「かいしん」を ねらえ！！
              </div>

              {/* ルーレットゲージ */}
              <div className="relative w-full h-8 bg-slate-950 rounded-full overflow-hidden border-2 border-white/40 p-1">
                {/* 当たりゾーン（中央の黄金エリア） */}
                <div className="absolute left-[30%] right-[30%] top-0 bottom-0 bg-yellow-400/40 border-x-2 border-yellow-300 flex items-center justify-center">
                  <span className="text-[10px] font-black text-yellow-200 tracking-wider">
                    ★ 会心ゾーン ★
                  </span>
                </div>

                {/* 往復するパワーポインター */}
                <div
                  className="absolute top-1 bottom-1 w-6 -ml-3 bg-gradient-to-r from-red-500 to-amber-400 rounded-full shadow-[0_0_15px_#f59e0b] border-2 border-white transition-all duration-75"
                  style={{ left: `${rouletteZone}%` }}
                />
              </div>

              {/* 特大ストップボタン */}
              <button
                type="button"
                onClick={() => handleStopRoulette(true)}
                className="min-h-[58px] w-full rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center gap-2 border-2 border-white shadow-lg cursor-pointer"
              >
                <Zap className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                <span>⚡ パワーストップ！！（タップ！）</span>
              </button>
            </div>
          ) : (
            /* C. コマンド待機中（2列グリッドのコンパクトなドラクエ風コマンドパネル） */
            <div className="dq-window p-3 sm:p-3.5 text-white space-y-2.5">
              {/* 手番ヘッダー ＆ ミニ実況 */}
              <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-1.5">
                <span
                  className={`px-3 py-1 rounded-full font-black text-xs sm:text-sm ${
                    turn === 1 ? 'bg-amber-400 text-slate-950' : 'bg-cyan-400 text-slate-950'
                  }`}
                >
                  {turn === 1
                    ? `👦 1P（${p1Stats.displayName}）のターン！`
                    : `👨 2P パパ（${p2Stats.displayName}）のターン！`}
                </span>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsPapaCpu((prev) => !prev)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-bold text-cyan-300 border border-white/20 cursor-pointer"
                  >
                    {isPapaCpu ? '🤖 パパCPU' : '👨 パパ手動'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetScrollTop();
                      setPhase('select');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-bold text-slate-300 border border-white/20 cursor-pointer"
                  >
                    えらび直す
                  </button>
                </div>
              </div>

              {turn === 2 && isPapaCpu ? (
                <div className="py-6 text-center text-sm sm:text-base font-black text-cyan-300 animate-pulse">
                  🤖 パパの {p2Stats.displayName} が わざを かんがえているよ…！
                </div>
              ) : (
                /* 2列グリッドのコマンドパネル（技＋回復＋パワーためる） */
                <div className="grid grid-cols-2 gap-2">
                  {/* 習得技ボタン */}
                  {currentActorStats.unlockedSkills.map((skill) => {
                    const canPayMp = currentActorMp >= skill.mpCost;
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => {
                          if (turn === 1) {
                            handleSelectSkillForP1(skill);
                          } else {
                            executeSkill(2, skill);
                          }
                        }}
                        disabled={!canPayMp}
                        className={`min-h-[54px] rounded-xl p-2 text-left border-2 flex items-center justify-between gap-1.5 transition-all active:scale-95 cursor-pointer ${
                          !canPayMp
                            ? 'bg-slate-900/60 border-slate-700 text-slate-500 opacity-60'
                            : skill.isUltimate
                            ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white border-yellow-200 shadow'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border-white/30'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-black truncate flex items-center gap-1">
                            <span>{skill.isUltimate ? '👑' : '⚔️'}</span>
                            <span className="truncate">{skill.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-300">威力 {skill.power}</div>
                        </div>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-950/80 border border-cyan-400/40 text-cyan-300 shrink-0 tabular-nums">
                          MP {skill.mpCost}
                        </span>
                      </button>
                    );
                  })}

                  {/* 💚 ドラクエ定番「かいふく（ホイミ）」ボタン */}
                  <button
                    type="button"
                    onClick={() => executeHeal(turn)}
                    disabled={currentActorMp < 15}
                    className={`min-h-[54px] rounded-xl p-2 text-left border-2 flex items-center justify-between gap-1.5 transition-all active:scale-95 cursor-pointer ${
                      currentActorMp < 15
                        ? 'bg-slate-900/60 border-slate-700 text-slate-500 opacity-60'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-300 shadow'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-black truncate flex items-center gap-1 text-emerald-200">
                        <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 shrink-0" />
                        <span>かいふく（ホイミ）</span>
                      </div>
                      <div className="text-[10px] text-emerald-100">HP 35% かいふく</div>
                    </div>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-950/80 border border-emerald-400/40 text-emerald-300 shrink-0 tabular-nums">
                      MP 15
                    </span>
                  </button>

                  {/* ⚡ パワーためるボタン */}
                  <button
                    type="button"
                    onClick={() => executeCharge(turn)}
                    className="min-h-[54px] rounded-xl p-2 text-left border-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-300 flex items-center justify-between gap-1.5 transition-all active:scale-95 cursor-pointer shadow"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-black truncate flex items-center gap-1 text-yellow-300">
                        <Zap className="w-3.5 h-3.5 fill-yellow-300 shrink-0" />
                        <span>パワーためる</span>
                      </div>
                      <div className="text-[10px] text-cyan-100">MP+25 ＆ 会心確定</div>
                    </div>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-950/80 border border-yellow-400/40 text-yellow-300 shrink-0">
                      無料
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          PHASE 3: 勝敗結果＆ごほうびフェーズ ('result')
         ============================================================ */}
      {phase === 'result' && (
        <div className="dq-window p-5 sm:p-6 text-center text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-base sm:text-lg shadow-lg">
            <Trophy className="w-6 h-6" />
            <span>
              {winner === 1 ? '🎉 1P（むすこ）の だいしょうり！！' : '👏 2P（パパ）の しょうり！！'}
            </span>
          </div>

          <div className="max-w-md mx-auto py-2">
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto">
              <KaijuSvgIllustration
                element={winner === 1 ? p1Kaiju.element : p2Kaiju.element}
                type={winner === 1 ? p1Kaiju.type : p2Kaiju.type}
                evolutionStage={winner === 1 ? p1Stats.stage : p2Stats.stage}
              />
            </div>
            <h3 className="text-2xl font-black text-yellow-300 mt-2">
              {winner === 1 ? p1Stats.displayName : p2Stats.displayName}
            </h3>
          </div>

          {/* ごほうびボックス */}
          <div className="rounded-2xl bg-amber-500/20 border-2 border-amber-300 p-4 max-w-md mx-auto text-left space-y-2">
            <div className="text-sm font-black text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>たたかいの ごほうび ゲット！</span>
            </div>
            <div className="flex items-center justify-around text-center py-1">
              <div className="flex flex-col items-center">
                <span className="text-2xl">🌟</span>
                <span className="text-sm font-black text-yellow-300 mt-0.5">けいけんち玉 ×2</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl">⚡</span>
                <span className="text-sm font-black text-cyan-300 mt-0.5">EXP +50</span>
              </div>
            </div>
            <p className="text-xs text-slate-200 text-center">
              ずかんの かいじゅうたちを どんどん レベルアップさせよう！
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <button
              type="button"
              onClick={handleStartBattle}
              className="min-h-[56px] flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-base flex items-center justify-center gap-2 border-2 border-white shadow-lg cursor-pointer"
            >
              <Swords className="w-5 h-5" />
              <span>もういっかい たたかう！</span>
            </button>
            <button
              type="button"
              onClick={() => {
                resetScrollTop();
                setPhase('select');
              }}
              className="min-h-[56px] flex-1 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-black text-base flex items-center justify-center gap-2 border border-white/25 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>かいじゅうを えらびなおす</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
