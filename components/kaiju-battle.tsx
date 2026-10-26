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
  Heart,
  Plus,
  Minus,
  Users,
  Flame,
  Crown,
} from 'lucide-react';
import {
  KAIJU_LIST,
  RAID_BOSS_LIST,
  RaidBossData,
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
  playTagUltimateSound,
  speakJapanese,
} from '@/lib/sound-and-speech';

type BattleMode = 'coop' | 'vs';
type BattlePhase = 'select' | 'battle' | 'result';
type PapaDifficulty = 'easy' | 'normal' | 'hard';

interface KaijuBattleProps {
  unlockedKaijuIds: string[];
  kaijuProgress: Record<string, KaijuProgress>;
  soundEnabled: boolean;
  onBattleComplete: (
    p1KaijuId: string,
    p2KaijuId?: string,
    rewardOrbs?: number,
    rewardExp?: number,
    isBossWin?: boolean,
    recruitedBossKaijuId?: string
  ) => void;
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
  // 選択可能な怪獣リスト（解放済みの怪獣のみ。大魔王もレイド討伐で仲間にすると選択可能）
  const availableList =
    unlockedKaijuIds.length > 0
      ? KAIJU_LIST.filter((k) => unlockedKaijuIds.includes(k.id))
      : KAIJU_LIST.slice(0, 4);

  const p1AvailableList = availableList;
  const p2AvailableList = availableList;

  const [battleMode, setBattleMode] = useState<BattleMode>('coop');
  const [phase, setPhase] = useState<BattlePhase>('select');
  const [recruitedBossKaiju, setRecruitedBossKaiju] = useState<KaijuData | null>(null);
  const [p1KaijuId, setP1KaijuId] = useState<string>(p1AvailableList[0]?.id ?? KAIJU_LIST[0].id);
  const [p2KaijuId, setP2KaijuId] = useState<string>(
    p2AvailableList[1]?.id ?? p2AvailableList[0]?.id ?? KAIJU_LIST[0].id
  );
  const [selectedBossId, setSelectedBossId] = useState<string>(RAID_BOSS_LIST[0].id);

  // VSモード用の難易度＆レベル設定
  const [papaDifficulty, setPapaDifficulty] = useState<PapaDifficulty>('normal');
  const [p2ManualLevel, setP2ManualLevel] = useState<number | null>(null);
  const [isPapaCpu, setIsPapaCpu] = useState<boolean>(false);

  // バトル進行ステート（turn: 1=じょう, 2=パパ, 3=大魔王ボス[coopのみ]）
  const [turn, setTurn] = useState<1 | 2 | 3>(1);
  const [isAnimatingAction, setIsAnimatingAction] = useState<boolean>(false);

  // VS時は p1Hp=1P, p2Hp=2P / COOP時は p1Hp=タッグ合計HP, p2Hp=大魔王ボスHP
  const [p1Hp, setP1Hp] = useState<number>(300);
  const [p1Mp, setP1Mp] = useState<number>(50);
  const [p2Hp, setP2Hp] = useState<number>(300);
  const [p2Mp, setP2Mp] = useState<number>(50);
  const [p1Charged, setP1Charged] = useState<boolean>(false);
  const [p2Charged, setP2Charged] = useState<boolean>(false);

  // COOPタッグ用「🔥 合体必殺技ゲージ（0〜100%）」＆ カットイン演出
  const [tagGauge, setTagGauge] = useState<number>(40);
  const [tagUltimateFlash, setTagUltimateFlash] = useState<boolean>(false);

  // パワーチャージ・ルーレット（タイミングタップ）ステート
  const [rouletteSkill, setRouletteSkill] = useState<KaijuSkill | null>(null);
  const [rouletteZone, setRouletteZone] = useState<number>(50);
  const rouletteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ダメージ／回復ポップアップ
  const [damagePopup, setDamagePopup] = useState<DamagePopup | null>(null);

  // アニメーション用フラグ
  const [p1Attacking, setP1Attacking] = useState<boolean>(false);
  const [p2Attacking, setP2Attacking] = useState<boolean>(false);
  const [bossAttacking, setBossAttacking] = useState<boolean>(false);
  const [p1Damaged, setP1Damaged] = useState<boolean>(false);
  const [p2Damaged, setP2Damaged] = useState<boolean>(false);
  const [criticalFlash, setCriticalFlash] = useState<boolean>(false);
  const [battleLogs, setBattleLogs] = useState<string[]>([
    '⚔️ かいじゅうバトル スタート！ わざを えらんで たたかおう！',
  ]);
  const [winner, setWinner] = useState<1 | 2 | null>(null);

  const p1Kaiju: KaijuData =
    KAIJU_LIST.find((k) => k.id === p1KaijuId) ?? p1AvailableList[0] ?? KAIJU_LIST[0];
  const p2Kaiju: KaijuData =
    KAIJU_LIST.find((k) => k.id === p2KaijuId) ?? p2AvailableList[0] ?? KAIJU_LIST[0];
  const selectedBoss: RaidBossData =
    RAID_BOSS_LIST.find((b) => b.id === selectedBossId) ?? RAID_BOSS_LIST[0];

  const p1Stats: KaijuComputedStats = getKaijuStats(
    p1Kaiju,
    kaijuProgress[p1Kaiju.id] ?? { level: 1, exp: 0 }
  );

  // COOP時はパパ怪獣の実際の育成レベルを使用、VS時は難易度設定レベルを使用
  const baseLevelFromDiff =
    papaDifficulty === 'easy'
      ? p1Stats.level
      : papaDifficulty === 'normal'
      ? p1Stats.level
      : p1Stats.level + 2;

  const p2Level =
    battleMode === 'coop'
      ? kaijuProgress[p2Kaiju.id]?.level ?? p1Stats.level
      : p2ManualLevel !== null
      ? p2ManualLevel
      : Math.max(1, baseLevelFromDiff);

  const p2BaseStats: KaijuComputedStats = getKaijuStats(p2Kaiju, {
    level: p2Level,
    exp: 0,
  });

  const hpMult =
    battleMode === 'coop'
      ? 1.0
      : papaDifficulty === 'easy'
      ? 0.85
      : papaDifficulty === 'hard'
      ? 1.4
      : 1.0;

  const p2Stats: KaijuComputedStats = {
    ...p2BaseStats,
    maxHp: Math.max(80, Math.round(p2BaseStats.maxHp * hpMult)),
  };

  // COOPタッグ時の合算最大HP / 最大MP
  const tagMaxHp = p1Stats.maxHp + p2Stats.maxHp;
  const tagMaxMp = p1Stats.maxMp + p2Stats.maxMp;

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
    setP1Charged(false);
    setP2Charged(false);
    setTurn(1);
    setWinner(null);
    setIsAnimatingAction(false);
    setRouletteSkill(null);
    setDamagePopup(null);
    setTagUltimateFlash(false);
    setRecruitedBossKaiju(null);

    if (battleMode === 'coop') {
      setP1Hp(tagMaxHp);
      setP1Mp(tagMaxMp);
      setP2Hp(selectedBoss.maxHp);
      setP2Mp(100);
      setTagGauge(40); // 最初から40%溜まっていてすぐ合体技が撃てる設計！
      setBattleLogs([
        `😈 ${selectedBoss.name} (HP ${selectedBoss.maxHp}) が あらわれた！！`,
        '🤝 じょう＆パパの タッグで ちからを あわせて たおそう！',
      ]);
      setPhase('battle');
      speakJapanese(
        `ブンブン！大魔王ボスバトル スタート！${selectedBoss.name}が あらわれたぞ！じょうと パパの ちからをあわせて たおそう！いくぞー！`,
        soundEnabled
      );
    } else {
      setP1Hp(p1Stats.maxHp);
      setP1Mp(p1Stats.maxMp);
      setP2Hp(p2Stats.maxHp);
      setP2Mp(p2Stats.maxMp);
      setBattleLogs([
        `🔥 ${p1Stats.displayName} (Lv.${p1Stats.level}) VS ${p2Stats.displayName} (Lv.${p2Stats.level})！`,
        '👦 1P（じょう）の ターン！ わざ・かいふく・ためる を えらんでね！',
      ]);
      setPhase('battle');
      speakJapanese(
        `ブンブン！バトルスタート！じょうの ${p1Stats.displayName} たい パパの ${p2Stats.displayName}！じょうのターンだ！いくぞー！`,
        soundEnabled
      );
    }
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
    const skillToUse = rouletteSkill;
    if (!skillToUse) return;
    setRouletteSkill(null);

    const isHitZone = isManualPress && rouletteZone >= 25 && rouletteZone <= 75;
    executeSkill(1, skillToUse, isHitZone);
  };

  // 🌟 COOP専用：「💥 ふたりで 合体必殺技（ダブル・ギガノヴァ・ストライク）」発動！
  const executeTagUltimate = () => {
    if (isAnimatingAction || phase !== 'battle' || battleMode !== 'coop' || tagGauge < 100) return;

    setIsAnimatingAction(true);
    setTagGauge(0);
    setP1Charged(false);
    setP2Charged(false);
    setP1Attacking(true);
    setP2Attacking(true);
    setTagUltimateFlash(true);

    playTagUltimateSound();

    // 超特大ダメージ（ボスのHPの45%〜55%相当＋1P&2P攻撃力合算）
    const combinedAtk = p1Stats.attack + p2Stats.attack;
    const rawDamage = Math.max(
      260,
      Math.round(selectedBoss.maxHp * 0.44 + combinedAtk * 1.6)
    );
    const nextBossHp = Math.max(0, p2Hp - rawDamage);

    speakJapanese(
      `キターーー！じょうと パパの 合体ひっさつわざ！ダブル・ギガノヴァ・ストライク！！ ${rawDamage} の 超特大ダメージだーっ！神ってるー！`,
      soundEnabled
    );

    setTimeout(() => {
      setP1Attacking(false);
      setP2Attacking(false);
      setP2Damaged(true);
      setP2Hp(nextBossHp);
      setDamagePopup({
        target: 2,
        text: `💥 -${rawDamage}!!`,
        isCritical: true,
      });

      setBattleLogs([
        `🌟 じょうの ${p1Stats.displayName} ＆ パパの ${p2Stats.displayName} の 合体必殺技！！`,
        `💥『ダブル・ギガノヴァ・ストライク』！！ ${selectedBoss.name}に ${rawDamage} の超特大ダメージ！！`,
      ]);

      setTimeout(() => {
        setP2Damaged(false);
        setDamagePopup(null);
        setTagUltimateFlash(false);

        if (nextBossHp <= 0) {
          handleCoopVictory();
        } else {
          setTurn(turn === 1 ? 2 : 3);
          setIsAnimatingAction(false);
        }
      }, 950);
    }, 550);
  };

  const handleCoopVictory = () => {
    setWinner(1);
    setPhase('result');
    setIsAnimatingAction(false);
    resetScrollTop();
    playBattleVictorySound();

    const bossKaijuObj = selectedBoss.kaijuId
      ? KAIJU_LIST.find((k) => k.id === selectedBoss.kaijuId) || null
      : null;
    const isAlreadyUnlocked = bossKaijuObj
      ? unlockedKaijuIds.includes(bossKaijuObj.id)
      : false;
    // 未獲得時は50%（約2回に1回）、獲得済みでも35%の確率で起き上がって仲間になる！
    const didRecruit = bossKaijuObj
      ? Math.random() < (isAlreadyUnlocked ? 0.35 : 0.5)
      : false;

    setRecruitedBossKaiju(didRecruit ? bossKaijuObj : null);

    onBattleComplete(
      p1Kaiju.id,
      p2Kaiju.id,
      selectedBoss.rewardOrbs,
      selectedBoss.rewardExp,
      true,
      didRecruit && bossKaijuObj ? bossKaijuObj.id : undefined
    );

    if (didRecruit && bossKaijuObj) {
      speakJapanese(
        `キターーー！${selectedBoss.name}を たおしたぞ！…おや！？ たおした ${bossKaijuObj.name} が おきあがり、なかまに なりたそうに こちらを みている！やったー！大魔王 ${bossKaijuObj.name} が なかまに なったぞーーっ！！`,
        soundEnabled
      );
    } else {
      speakJapanese(
        `キターーー！じょうと パパの ちからをあわせて、${selectedBoss.name}を たおしたぞーっ！ごほうびに けいけんち玉 ${selectedBoss.rewardOrbs}こと、ほし玉 1こを ゲット！やばすぎるー！`,
        soundEnabled
      );
    }
  };

  // 💚 かいふく（ホイミ）アクション
  const executeHeal = (actor: 1 | 2) => {
    if (isAnimatingAction || phase !== 'battle') return;

    const isCoop = battleMode === 'coop';
    const isP1 = actor === 1;
    const actorStats = isP1 ? p1Stats : p2Stats;
    const currentMp = isCoop ? p1Mp : isP1 ? p1Mp : p2Mp;
    const currentHp = isCoop ? p1Hp : isP1 ? p1Hp : p2Hp;
    const maxHpLimit = isCoop ? tagMaxHp : actorStats.maxHp;
    const actorTitle = isP1 ? '👦 1P(じょう)' : '👨 2P(パパ)';

    const HEAL_MP_COST = 15;
    if (currentMp < HEAL_MP_COST) {
      playTapSound(320);
      speakJapanese('おっと！かいふくには MPが 15 ひつようだよ！ためてみよう！', soundEnabled);
      return;
    }

    setIsAnimatingAction(true);
    playHealSound();

    const healAmount = Math.round(maxHpLimit * 0.35);
    const nextHp = Math.min(maxHpLimit, currentHp + healAmount);
    const nextMp = Math.max(0, currentMp - HEAL_MP_COST);

    if (isCoop || isP1) {
      setP1Hp(nextHp);
      setP1Mp(nextMp);
    } else {
      setP2Hp(nextHp);
      setP2Mp(nextMp);
    }

    if (isCoop) {
      setTagGauge((prev) => Math.min(100, prev + 25));
    }

    setDamagePopup({
      target: isCoop ? 1 : actor,
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
      if (isCoop) {
        setTurn(actor === 1 ? 2 : 3);
      } else {
        setTurn(isP1 ? 2 : 1);
      }
      setIsAnimatingAction(false);
    }, 1250);
  };

  // ⚡ パワーためる（MP +25 & 次回会心確定 ＆ タッグゲージ+50%）
  const executeCharge = (actor: 1 | 2) => {
    if (isAnimatingAction || phase !== 'battle') return;

    const isCoop = battleMode === 'coop';
    const isP1 = actor === 1;
    const actorStats = isP1 ? p1Stats : p2Stats;
    const actorTitle = isP1 ? '👦 1P(じょう)' : '👨 2P(パパ)';

    setIsAnimatingAction(true);
    playMpChargeSound();

    if (isCoop) {
      setP1Mp((prev) => Math.min(tagMaxMp, prev + 35));
      setTagGauge((prev) => Math.min(100, prev + 50));
      if (isP1) setP1Charged(true);
      else setP2Charged(true);
    } else if (isP1) {
      setP1Mp((prev) => Math.min(p1Stats.maxMp, prev + 25));
      setP1Charged(true);
    } else {
      setP2Mp((prev) => Math.min(p2Stats.maxMp, prev + 25));
      setP2Charged(true);
    }

    setDamagePopup({
      target: isCoop ? 1 : actor,
      text: isCoop ? 'MP+35 & 合体+50%⚡' : 'MP+25 ⚡',
      isHeal: true,
    });

    const logs = [
      `⚡ ${actorTitle}の ${actorStats.displayName}は パワーを ためた！`,
      isCoop
        ? '🔥 合体必殺技ゲージが ぐんと たまったぞ！つぎの こうげきは かいしん確定！！'
        : '✨ MPが 25 かいふく！ つぎの こうげきで「かいしんの いちげき」が でるぞ！！',
    ];
    setBattleLogs(logs);
    speakJapanese(
      'パワーためる！MPが たまったぞ！つぎは かいしんの いちげき 確定だ！',
      soundEnabled
    );

    setTimeout(() => {
      setDamagePopup(null);
      if (isCoop) {
        setTurn(actor === 1 ? 2 : 3);
      } else {
        setTurn(isP1 ? 2 : 1);
      }
      setIsAnimatingAction(false);
    }, 1200);
  };

  // 技の実行（1P または 2P）
  const executeSkill = (actor: 1 | 2, skill: KaijuSkill, forceCritical = false) => {
    if (isAnimatingAction || phase !== 'battle') return;

    const isCoop = battleMode === 'coop';
    const isP1 = actor === 1;
    const attackerStats = isP1 ? p1Stats : p2Stats;
    const attackerKaiju = isP1 ? p1Kaiju : p2Kaiju;
    const currentMp = isCoop ? p1Mp : isP1 ? p1Mp : p2Mp;
    const isCharged = isP1 ? p1Charged : p2Charged;
    const actorTitle = isP1 ? '👦 1P(じょう)' : '👨 2P(パパ)';

    if (currentMp < skill.mpCost) {
      playTapSound(320);
      speakJapanese('MPが たりないよ！パワーを ためよう！', soundEnabled);
      return;
    }

    setIsAnimatingAction(true);

    // MP消費＆チャージ解除
    const updatedMp = Math.max(0, currentMp - skill.mpCost);
    if (isCoop) {
      setP1Mp(updatedMp);
      setTagGauge((prev) => Math.min(100, prev + 35));
      if (isP1) {
        setP1Charged(false);
        setP1Attacking(true);
      } else {
        setP2Charged(false);
        setP2Attacking(true);
      }
    } else if (isP1) {
      setP1Mp(updatedMp);
      setP1Charged(false);
      setP1Attacking(true);
    } else {
      setP2Mp(updatedMp);
      setP2Charged(false);
      setP2Attacking(true);
    }

    const isCritical = forceCritical || isCharged || Math.random() < (isP1 ? 0.28 : 0.2);

    const defenderElement = isCoop
      ? selectedBoss.element
      : isP1
      ? p2Kaiju.element
      : p1Kaiju.element;
    const defenderDefense = isCoop
      ? selectedBoss.defense
      : isP1
      ? p2Stats.defense
      : p1Stats.defense;
    const defenderHp = isCoop ? p2Hp : isP1 ? p2Hp : p1Hp;

    const adv = getElementAdvantage(attackerKaiju.element, defenderElement);

    const baseDmg =
      skill.power * 0.95 + attackerStats.attack * 0.78 - defenderDefense * 0.25;
    const variance = 0.95 + Math.random() * 0.1;
    const critMult = isCritical ? 1.5 : 1.0;
    const rawDamage = Math.max(
      32,
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
      setP1Attacking(false);
      setP2Attacking(false);

      if (isCoop) {
        setP2Damaged(true);
        setP2Hp(nextDefenderHp);
      } else if (isP1) {
        setP2Damaged(true);
        setP2Hp(nextDefenderHp);
      } else {
        setP1Damaged(true);
        setP1Hp(nextDefenderHp);
      }

      setDamagePopup({
        target: isCoop ? 2 : isP1 ? 2 : 1,
        text: `-${rawDamage}`,
        isCritical,
      });

      const logs: string[] = [
        `▶ ${actorTitle}の ${attackerStats.displayName}の『${skill.name}』！`,
      ];
      if (adv.label) logs.push(adv.label);
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

        if (nextDefenderHp <= 0) {
          if (isCoop) {
            handleCoopVictory();
          } else {
            setWinner(actor);
            setPhase('result');
            setIsAnimatingAction(false);
            resetScrollTop();
            playBattleVictorySound();

            const isVsDemonLord = actor === 1 && p2Kaiju.id.includes('-dq-');
            const isAlreadyUnlocked = unlockedKaijuIds.includes(p2Kaiju.id);
            const didRecruitVsBoss =
              isVsDemonLord && Math.random() < (isAlreadyUnlocked ? 0.35 : 0.5);
            setRecruitedBossKaiju(didRecruitVsBoss ? p2Kaiju : null);

            onBattleComplete(
              p1Kaiju.id,
              p2Kaiju.id,
              2,
              30,
              false,
              didRecruitVsBoss ? p2Kaiju.id : undefined
            );

            const winName = attackerStats.displayName;
            const winSpeech = didRecruitVsBoss
              ? `キターーー！じょうの ${winName}の だいしょうりーっ！おや！？ たおした大魔王 ${p2Kaiju.name} が おきあがり、なかまに なったぞーーっ！！神ってるー！`
              : actor === 1
              ? `キターーー！じょうの ${winName}の だいしょうりーっ！おめでとう！ごほうびに けいけんち玉 2こと、けいけんち 30 をゲットしたよ！神ってるー！`
              : `うおおお！パパの ${winName}の しょうり！でも さいごまで たたかった ごほうびに けいけんち玉 2こと、けいけんち 30 をゲットしたよ！`;
            speakJapanese(winSpeech, soundEnabled);
          }
        } else {
          if (isCoop) {
            setTurn(actor === 1 ? 2 : 3);
          } else {
            setTurn(isP1 ? 2 : 1);
          }
          setIsAnimatingAction(false);
        }
      }, 750);
    }, 400);
  };

  // 😈 COOPモード：大魔王ボスの攻撃ターン（turn === 3）
  useEffect(() => {
    if (phase !== 'battle' || battleMode !== 'coop' || turn !== 3 || isAnimatingAction) return;

    const timer = setTimeout(() => {
      setIsAnimatingAction(true);
      setBossAttacking(true);
      playBattleAttackSound(false);

      const avgDef = (p1Stats.defense + p2Stats.defense) / 2;
      const rawBossDmg = Math.max(
        35,
        Math.round(selectedBoss.attack * 1.45 - avgDef * 0.25)
      );
      // 4歳児が負けて悲しまないよう、HP1で踏ん張る「親子きずなガード」搭載！
      const nextTagHp = Math.max(1, p1Hp - rawBossDmg);
      const kizunaSaved = p1Hp - rawBossDmg <= 0;

      setTimeout(() => {
        setBossAttacking(false);
        setP1Damaged(true);
        setP1Hp(nextTagHp);
        // ダメージを受けると合体必殺技ゲージも+25%溜まる！
        setTagGauge((prev) => Math.min(100, prev + 25));

        setDamagePopup({
          target: 1,
          text: `-${rawBossDmg}`,
        });

        const logs = [
          `😈 ${selectedBoss.name}の『${selectedBoss.specialMove}』！！`,
          kizunaSaved
            ? `🛡️ じょうと パパの「きずなガード」が 発動！ HP 1 で ギリギリ たいきったぞ！！`
            : `💥 タッグに ${rawBossDmg} のダメージ！ 負けるな、やりかえそう！`,
        ];
        setBattleLogs(logs);
        speakJapanese(
          `${selectedBoss.name}の ${selectedBoss.specialMove}！${rawBossDmg} のダメージ！まけるな、じょうくん！`,
          soundEnabled
        );

        setTimeout(() => {
          setP1Damaged(false);
          setDamagePopup(null);
          setTurn(1);
          setIsAnimatingAction(false);
        }, 850);
      }, 420);
    }, 950);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, battleMode, turn, isAnimatingAction]);

  // パパがCPU（オート）モードのときの自動行動（turn === 2）
  useEffect(() => {
    if (phase !== 'battle' || turn !== 2 || !isPapaCpu || isAnimatingAction) return;

    const timer = setTimeout(() => {
      // COOPで合体必殺技ゲージが100%なら合体必殺技を発動！
      if (battleMode === 'coop' && tagGauge >= 100) {
        executeTagUltimate();
        return;
      }

      const checkHp = battleMode === 'coop' ? p1Hp : p2Hp;
      const checkMaxHp = battleMode === 'coop' ? tagMaxHp : p2Stats.maxHp;
      const checkMp = battleMode === 'coop' ? p1Mp : p2Mp;

      if (checkHp <= checkMaxHp * 0.35 && checkMp >= 15 && Math.random() < 0.65) {
        executeHeal(2);
        return;
      }

      const usableSkills = p2Stats.unlockedSkills.filter((s) => checkMp >= s.mpCost);
      if (usableSkills.length === 0 || (checkMp < 15 && Math.random() < 0.5)) {
        executeCharge(2);
      } else {
        const chosen = usableSkills[Math.floor(Math.random() * usableSkills.length)];
        executeSkill(2, chosen);
      }
    }, 950);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turn, isPapaCpu, isAnimatingAction, p1Hp, p2Hp, p1Mp, p2Mp, tagGauge, battleMode]);

  const currentActorStats = turn === 1 ? p1Stats : p2Stats;
  const currentActorMp = battleMode === 'coop' ? p1Mp : turn === 1 ? p1Mp : p2Mp;

  return (
    <section className="space-y-3">
      {/* ============================================================
          PHASE 1: 怪獣＆モードえらびフェーズ ('select')
         ============================================================ */}
      {phase === 'select' && (
        <div className="space-y-3.5">
          {/* モード切り替え特大2択タブ：[🤝 ふたりできょうりょく] vs [⚔️ ふたりでたいけつ] */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border-2 border-white/15">
            <button
              type="button"
              onClick={() => {
                playTapSound(600);
                setBattleMode('coop');
                speakJapanese(
                  'ふたりで きょうりょくモード！じょうくんと パパの タッグで 大魔王ボスを たおそう！',
                  soundEnabled
                );
              }}
              className={`min-h-[54px] rounded-xl font-black text-xs sm:text-base flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                battleMode === 'coop'
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 border-2 border-white shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                  : 'bg-slate-950/70 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span>🤝 ふたりできょうりょく(ボス討伐)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playTapSound(560);
                setBattleMode('vs');
                speakJapanese(
                  'ふたりで たいけつモード！じょうくんと パパで どっちがつよいか しょうぶだ！',
                  soundEnabled
                );
              }}
              className={`min-h-[54px] rounded-xl font-black text-xs sm:text-base flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                battleMode === 'vs'
                  ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 border-2 border-white shadow-[0_0_20px_rgba(56,189,248,0.6)]'
                  : 'bg-slate-950/70 text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-5 h-5 shrink-0" />
              <span>⚔️ ふたりでたいけつ(VS)</span>
            </button>
          </div>

          {/* タイトル＆パパCPU設定バー */}
          <div className="dq-window p-3 sm:p-3.5 text-white flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-xl font-black text-yellow-300 flex items-center gap-2">
                {battleMode === 'coop' ? (
                  <>
                    <Flame className="w-5 h-5 text-orange-400 shrink-0" />
                    <span>🤝 じょう＆パパ タッグ！ 大魔王ボス討伐レイド！</span>
                  </>
                ) : (
                  <>
                    <Swords className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>⚔️ じょう VS パパ！ かいじゅうバトル！</span>
                  </>
                )}
              </h2>
              <p className="text-xs font-bold text-slate-300 mt-0.5">
                {battleMode === 'coop'
                  ? 'ふたりで 力をあわせて 巨大ボスを たおし、🟠ほし玉と 🌟けいけんち玉を ゲットしよう！'
                  : '1P（じょう）と 2P（パパ）の なかまを えらんで たいけつしよう！'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                playTapSound(560);
                setIsPapaCpu((prev) => !prev);
              }}
              className={`min-h-[40px] px-3 py-1 rounded-xl font-black text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                isPapaCpu
                  ? 'bg-cyan-400 text-slate-950 border-white shadow-md'
                  : 'bg-slate-800 text-slate-200 border-white/25'
              }`}
            >
              {isPapaCpu ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              <span>{isPapaCpu ? '🤖 パパ：オート(CPU)' : '👨 パパ：じぶんで操作'}</span>
            </button>
          </div>

          {/* 😈 COOPモード時：戦う大魔王ボス選択セクション */}
          {battleMode === 'coop' && (
            <div className="rounded-3xl bg-gradient-to-b from-purple-950/95 via-slate-900 to-slate-950 border-2 border-rose-400/70 p-3.5 space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-1">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span>😈 たたかう 大魔王ボスを えらぼう！</span>
                </span>
                <span className="text-xs font-black text-yellow-300">
                  勝利で 🟠ほし玉+1 ＆ 🌟玉+{selectedBoss.rewardOrbs}！
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {RAID_BOSS_LIST.map((boss) => {
                  const isSelected = boss.id === selectedBoss.id;
                  const el = getElementMeta(boss.element);
                  return (
                    <button
                      key={boss.id}
                      type="button"
                      onClick={() => {
                        playTapSound(520);
                        setSelectedBossId(boss.id);
                        speakJapanese(
                          `${boss.name}！ ${boss.titleBadge}！ ごほうびは けいけんち玉 ${boss.rewardOrbs}こだ！`,
                          soundEnabled
                        );
                      }}
                      className={`rounded-2xl p-2.5 text-left border-2 transition-all cursor-pointer active:scale-95 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-b from-rose-600/80 to-purple-900 border-yellow-300 ring-2 ring-yellow-300 text-white shadow-lg'
                          : 'bg-slate-950/85 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 shrink-0">
                          <KaijuSvgIllustration
                            element={boss.element}
                            type={boss.type}
                            kaijuId={boss.kaijuId}
                            evolutionStage={3}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-black text-yellow-300">
                            Lv.{boss.level} {el.emoji} HP {boss.maxHp}
                          </div>
                          <div className="text-xs sm:text-sm font-black text-white truncate">
                            {boss.name}
                          </div>
                        </div>
                      </div>
                      <div className="mt-1.5 pt-1 border-t border-white/15 flex items-center justify-between text-[10px] font-black text-amber-300">
                        <span>🌟玉 ×{boss.rewardOrbs}</span>
                        <span>EXP +{boss.rewardExp}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 1P ＆ 2P 怪獣選択カード */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* 👦 1P（じょう）怪獣選択 */}
            <div className="rounded-3xl bg-slate-900/95 border-2 border-amber-400/60 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs sm:text-sm">
                  👦 1P（じょう）の なかま
                </span>
                <span className="text-xs font-black text-amber-300">
                  Lv.{p1Stats.level} / HP {p1Stats.maxHp}
                </span>
              </div>

              <div className="dq-window p-2 flex items-center gap-3">
                <div className="w-16 h-16 shrink-0">
                  <KaijuSvgIllustration
                    element={p1Kaiju.element}
                    type={p1Kaiju.type}
                    kaijuId={p1Kaiju.id}
                    category={p1Kaiju.category}
                    realColors={p1Kaiju.realColors}
                    insectStyle={p1Kaiju.insectStyle}
                    evolutionStage={p1Stats.stage}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm sm:text-base font-black text-white truncate">
                    {p1Stats.displayName}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-black mt-0.5">
                    <span className="text-emerald-300">HP {p1Stats.maxHp}</span>
                    <span className="text-cyan-300">MP {p1Stats.maxMp}</span>
                    <span className="text-orange-300">ちから {p1Stats.attack}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {p1AvailableList.map((k) => {
                  const isSelected = k.id === p1Kaiju.id;
                  const el = getElementMeta(k.element);
                  const stats = getKaijuStats(k, kaijuProgress[k.id]);
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => {
                        playTapSound(580);
                        setP1KaijuId(k.id);
                      }}
                      className={`min-h-[52px] rounded-xl p-1.5 text-left border-2 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? `bg-gradient-to-r ${el.bgGradient} text-white border-white shadow`
                          : 'bg-slate-950/90 text-slate-200 border-slate-700'
                      }`}
                    >
                      <div className="w-9 h-9 shrink-0">
                        <KaijuSvgIllustration
                          element={k.element}
                          type={k.type}
                          kaijuId={k.id}
                          category={k.category}
                          realColors={k.realColors}
                          insectStyle={k.insectStyle}
                          evolutionStage={stats.stage}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-black text-yellow-300">
                          Lv.{stats.level} {el.emoji}
                        </div>
                        <div className="text-[11px] font-black truncate">{stats.displayName}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 👨 2P（パパ）怪獣選択 */}
            <div className="rounded-3xl bg-slate-900/95 border-2 border-cyan-400/60 p-3 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm">
                  👨 2P（パパ）の なかま
                </span>

                {battleMode === 'vs' && (
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-xl border border-white/20">
                    <span className="text-xs font-black text-yellow-300 mr-1">Lv.{p2Level}</span>
                    <button
                      type="button"
                      onClick={() => {
                        playTapSound(440);
                        setP2ManualLevel(Math.max(1, p2Level - 1));
                      }}
                      className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center font-black cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playTapSound(580);
                        setP2ManualLevel(Math.min(10, p2Level + 1));
                      }}
                      className="w-6 h-6 rounded bg-slate-800 text-yellow-300 flex items-center justify-center font-black cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {battleMode === 'vs' && (
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
                        className={`min-h-[40px] rounded-xl p-1 text-center border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-cyan-500 text-slate-950 font-black border-white shadow'
                            : 'bg-slate-950/80 text-slate-300 border-white/15 text-xs'
                        }`}
                      >
                        <div className="text-[10px] font-black truncate">{mode.label}</div>
                        <div className="text-[9px] opacity-80">{mode.desc}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="dq-window p-2 flex items-center gap-3">
                <div className="w-16 h-16 shrink-0">
                  <KaijuSvgIllustration
                    element={p2Kaiju.element}
                    type={p2Kaiju.type}
                    kaijuId={p2Kaiju.id}
                    category={p2Kaiju.category}
                    realColors={p2Kaiju.realColors}
                    insectStyle={p2Kaiju.insectStyle}
                    evolutionStage={p2Stats.stage}
                    flipHorizontal={battleMode === 'vs'}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm sm:text-base font-black text-white truncate">
                    {p2Stats.displayName}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-black mt-0.5">
                    <span className="text-emerald-300">HP {p2Stats.maxHp}</span>
                    <span className="text-cyan-300">MP {p2Stats.maxMp}</span>
                    <span className="text-orange-300">ちから {p2Stats.attack}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {p2AvailableList.map((k) => {
                  const isSelected = k.id === p2Kaiju.id;
                  const el = getElementMeta(k.element);
                  const stats = getKaijuStats(k, kaijuProgress[k.id]);
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => {
                        playTapSound(600);
                        setP2KaijuId(k.id);
                      }}
                      className={`min-h-[52px] rounded-xl p-1.5 text-left border-2 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? `bg-gradient-to-r ${el.bgGradient} text-white border-white shadow`
                          : 'bg-slate-950/90 text-slate-200 border-slate-700'
                      }`}
                    >
                      <div className="w-9 h-9 shrink-0">
                        <KaijuSvgIllustration
                          element={k.element}
                          type={k.type}
                          kaijuId={k.id}
                          category={k.category}
                          realColors={k.realColors}
                          insectStyle={k.insectStyle}
                          evolutionStage={stats.stage}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-black text-cyan-300 flex items-center gap-1">
                          <span>
                            Lv.{stats.level} {el.emoji}
                          </span>
                          {k.id.includes('-dq-') && (
                            <span className="px-1 rounded bg-rose-600 text-yellow-200 text-[9px]">
                              😈大魔王
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-black truncate">{stats.displayName}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 特大スタートボタン */}
          <button
            type="button"
            onClick={handleStartBattle}
            className="min-h-[68px] w-full rounded-3xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center gap-3 border-4 border-white shadow-[0_6px_0_#9f1239,0_0_35px_rgba(244,63,94,0.8)] transition-all cursor-pointer"
          >
            <Swords className="w-7 h-7 shrink-0" />
            <span>
              {battleMode === 'coop'
                ? `🤝 タッグで ${selectedBoss.name} に いどむ！！`
                : '⚔️ バトル スタート！！'}
            </span>
          </button>
        </div>
      )}

      {/* ============================================================
          PHASE 2: ドラクエ風コマンド対戦フェーズ ('battle')
          ★ ノンスクロール・1画面完結レイアウト！
         ============================================================ */}
      {phase === 'battle' && (
        <div
          className={`space-y-2.5 transition-colors duration-200 ${
            criticalFlash || tagUltimateFlash ? 'bg-yellow-300/30 rounded-3xl p-1' : ''
          }`}
        >
          {/* ==================== 1. 一体化バトルステージ ==================== */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-white/20 p-3 sm:p-4 overflow-hidden shadow-2xl">
            {/* 上部ステータスバー */}
            <div className="grid grid-cols-2 gap-2 mb-2 z-10 relative">
              {/* 左側ステータス（COOP時は親子タッグ合算HP/MP、VS時は1P） */}
              <div
                className={`rounded-2xl p-2 bg-slate-950/85 border transition-all ${
                  turn === 1 || (battleMode === 'coop' && turn === 2)
                    ? 'border-amber-400 ring-2 ring-yellow-300'
                    : 'border-white/20 opacity-85'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-black text-amber-300 truncate">
                  <span>
                    {battleMode === 'coop'
                      ? '🤝 じょう＆パパ タッグ'
                      : `👦 じょう：${p1Stats.displayName}`}
                  </span>
                  <span className="text-yellow-300 text-[10px] shrink-0">
                    {battleMode === 'coop' ? `🔥合体 ${tagGauge}%` : `Lv.${p1Stats.level}`}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5">
                  <div className="flex justify-between text-[10px] font-black">
                    <span className="text-emerald-300">HP</span>
                    <span className="text-white tabular-nums">
                      {p1Hp} / {battleMode === 'coop' ? tagMaxHp : p1Stats.maxHp}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/20">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-300"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.round(
                            (p1Hp / (battleMode === 'coop' ? tagMaxHp : p1Stats.maxHp)) * 100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="mt-0.5 flex items-center justify-between text-[9px] font-black text-cyan-300">
                  <span>MP</span>
                  <span className="tabular-nums">
                    {p1Mp}/{battleMode === 'coop' ? tagMaxMp : p1Stats.maxMp}
                  </span>
                </div>
              </div>

              {/* 右側ステータス（COOP時は大魔王ボスHP、VS時は2Pパパ） */}
              <div
                className={`rounded-2xl p-2 bg-slate-950/85 border transition-all ${
                  (battleMode === 'vs' && turn === 2) || (battleMode === 'coop' && turn === 3)
                    ? 'border-rose-400 ring-2 ring-rose-300'
                    : 'border-white/20 opacity-85'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-black text-rose-300 truncate">
                  <span>
                    {battleMode === 'coop'
                      ? `😈 ${selectedBoss.name}`
                      : `👨 パパ：${p2Stats.displayName}`}
                  </span>
                  <span className="text-yellow-300 text-[10px] shrink-0">
                    Lv.{battleMode === 'coop' ? selectedBoss.level : p2Stats.level}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5">
                  <div className="flex justify-between text-[10px] font-black">
                    <span className="text-rose-300">HP</span>
                    <span className="text-white tabular-nums">
                      {p2Hp} / {battleMode === 'coop' ? selectedBoss.maxHp : p2Stats.maxHp}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/20">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all duration-300"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.round(
                            (p2Hp /
                              (battleMode === 'coop' ? selectedBoss.maxHp : p2Stats.maxHp)) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                {battleMode === 'vs' ? (
                  <div className="mt-0.5 flex items-center justify-between text-[9px] font-black text-cyan-300">
                    <span>MP</span>
                    <span className="tabular-nums">
                      {p2Mp}/{p2Stats.maxMp}
                    </span>
                  </div>
                ) : (
                  <div className="mt-0.5 text-[9px] font-black text-amber-300 truncate">
                    わざ：{selectedBoss.specialMove}
                  </div>
                )}
              </div>
            </div>

            {/* 合体必殺技 / 会心の一撃 カットイン演出 */}
            {tagUltimateFlash && (
              <div className="absolute inset-0 z-30 bg-gradient-to-r from-amber-500/60 via-rose-500/60 to-purple-600/60 flex items-center justify-center pointer-events-none">
                <div className="bg-slate-950 text-yellow-300 font-black text-base sm:text-2xl px-5 py-3 rounded-2xl border-4 border-yellow-300 shadow-2xl animate-bounce text-center">
                  🌟 親子合体！ダブル・ギガノヴァ・ストライク！！
                </div>
              </div>
            )}
            {criticalFlash && !tagUltimateFlash && (
              <div className="absolute inset-0 z-30 bg-amber-400/40 flex items-center justify-center pointer-events-none">
                <div className="bg-rose-600 text-yellow-200 font-black text-xl sm:text-3xl px-5 py-2.5 rounded-2xl border-4 border-white shadow-2xl animate-bounce">
                  💥 かいしんの いちげき！！
                </div>
              </div>
            )}

            {/* 怪獣グラフィック対決エリア */}
            <div className="grid grid-cols-2 items-center gap-2 min-h-[135px] sm:min-h-[175px] relative">
              {/* 左陣営：COOP時は1P＆2Pの2体並び、VS時は1Pのみ */}
              <div className="flex items-center justify-center relative">
                {damagePopup && damagePopup.target === 1 && (
                  <div
                    className={`absolute -top-3 z-30 px-3 py-1 rounded-full font-black text-xs sm:text-sm border-2 shadow-xl animate-bounce ${
                      damagePopup.isHeal
                        ? 'bg-emerald-500 text-white border-white'
                        : 'bg-rose-600 text-yellow-200 border-white'
                    }`}
                  >
                    {damagePopup.text}
                  </div>
                )}

                {battleMode === 'coop' ? (
                  <div className="flex items-center justify-center -space-x-3 sm:space-x-1">
                    {/* 1P じょう */}
                    <div
                      className={`w-20 h-20 sm:w-28 sm:h-28 transition-transform duration-200 ${
                        p1Attacking ? 'translate-x-5 scale-110' : ''
                      } ${turn === 1 ? 'ring-2 ring-amber-400 rounded-2xl bg-amber-400/10' : ''}`}
                    >
                      <KaijuSvgIllustration
                        element={p1Kaiju.element}
                        type={p1Kaiju.type}
                        kaijuId={p1Kaiju.id}
                        category={p1Kaiju.category}
                        realColors={p1Kaiju.realColors}
                        insectStyle={p1Kaiju.insectStyle}
                        evolutionStage={p1Stats.stage}
                        isAttacking={p1Attacking}
                        isDamaged={p1Damaged}
                      />
                    </div>
                    {/* 2P パパ */}
                    <div
                      className={`w-20 h-20 sm:w-28 sm:h-28 transition-transform duration-200 ${
                        p2Attacking ? 'translate-x-5 scale-110' : ''
                      } ${turn === 2 ? 'ring-2 ring-cyan-400 rounded-2xl bg-cyan-400/10' : ''}`}
                    >
                      <KaijuSvgIllustration
                        element={p2Kaiju.element}
                        type={p2Kaiju.type}
                        kaijuId={p2Kaiju.id}
                        category={p2Kaiju.category}
                        realColors={p2Kaiju.realColors}
                        insectStyle={p2Kaiju.insectStyle}
                        evolutionStage={p2Stats.stage}
                        isAttacking={p2Attacking}
                        isDamaged={p1Damaged}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`w-28 h-28 sm:w-40 sm:h-40 transition-transform duration-200 ${
                      p1Attacking ? 'translate-x-6 scale-110' : ''
                    }`}
                  >
                    <KaijuSvgIllustration
                      element={p1Kaiju.element}
                      type={p1Kaiju.type}
                      kaijuId={p1Kaiju.id}
                      category={p1Kaiju.category}
                      realColors={p1Kaiju.realColors}
                      insectStyle={p1Kaiju.insectStyle}
                      evolutionStage={p1Stats.stage}
                      isAttacking={p1Attacking}
                      isDamaged={p1Damaged}
                    />
                  </div>
                )}
              </div>

              {/* 右陣営：COOP時は巨大大魔王ボス、VS時は2Pパパ */}
              <div className="flex flex-col items-center justify-center relative">
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

                {battleMode === 'coop' ? (
                  <div
                    className={`w-32 h-32 sm:w-44 sm:h-44 scale-110 drop-shadow-[0_0_25px_rgba(250,204,21,0.85)] transition-transform duration-200 ${
                      bossAttacking ? '-translate-x-6 scale-125' : ''
                    }`}
                  >
                    <KaijuSvgIllustration
                      element={selectedBoss.element}
                      type={selectedBoss.type}
                      kaijuId={selectedBoss.kaijuId}
                      evolutionStage={3}
                      isAttacking={bossAttacking}
                      isDamaged={p2Damaged}
                      isFloating={true}
                      flipHorizontal
                    />
                  </div>
                ) : (
                  <div
                    className={`w-28 h-28 sm:w-40 sm:h-40 transition-transform duration-200 ${
                      p2Attacking ? '-translate-x-6 scale-110' : ''
                    }`}
                  >
                    <KaijuSvgIllustration
                      element={p2Kaiju.element}
                      type={p2Kaiju.type}
                      kaijuId={p2Kaiju.id}
                      category={p2Kaiju.category}
                      realColors={p2Kaiju.realColors}
                      insectStyle={p2Kaiju.insectStyle}
                      evolutionStage={p2Stats.stage}
                      isAttacking={p2Attacking}
                      isDamaged={p2Damaged}
                      flipHorizontal
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==================== 2. ドラクエ方式コマンド ⇄ 実況ウィンドウ ==================== */}
          {isAnimatingAction ? (
            <div className="dq-window p-4 text-white min-h-[165px] flex flex-col justify-center space-y-2 animate-fadeIn">
              <div className="text-xs font-black text-amber-300">⚔️ バトルじっきょう</div>
              {battleLogs.map((line, idx) => (
                <p
                  key={idx}
                  className={`text-base sm:text-xl font-black leading-snug ${
                    line.includes('かいしん') || line.includes('合体')
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
            <div className="dq-window p-4 text-white space-y-3 text-center animate-fadeIn">
              <div className="text-sm sm:text-base font-black text-yellow-300 animate-pulse">
                ⚡ タイミングよく ボタンをおして「かいしん」を ねらえ！！
              </div>

              <div className="relative w-full h-8 bg-slate-950 rounded-full overflow-hidden border-2 border-white/40 p-1">
                <div className="absolute left-[30%] right-[30%] top-0 bottom-0 bg-yellow-400/40 border-x-2 border-yellow-300 flex items-center justify-center">
                  <span className="text-[10px] font-black text-yellow-200 tracking-wider">
                    ★ 会心ゾーン ★
                  </span>
                </div>
                <div
                  className="absolute top-1 bottom-1 w-6 -ml-3 bg-gradient-to-r from-red-500 to-amber-400 rounded-full shadow-[0_0_15px_#f59e0b] border-2 border-white transition-all duration-75"
                  style={{ left: `${rouletteZone}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => handleStopRoulette(true)}
                className="min-h-[56px] w-full rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center gap-2 border-2 border-white shadow-lg cursor-pointer"
              >
                <Zap className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                <span>⚡ パワーストップ！！（タップ！）</span>
              </button>
            </div>
          ) : (
            <div className="dq-window p-3 sm:p-3.5 text-white space-y-2">
              {/* 手番ヘッダー */}
              <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-1.5">
                <span
                  className={`px-3 py-1 rounded-full font-black text-xs sm:text-sm ${
                    turn === 1
                      ? 'bg-amber-400 text-slate-950'
                      : turn === 2
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {turn === 1
                    ? `👦 1P じょう（${p1Stats.displayName}）のターン！`
                    : turn === 2
                    ? `👨 2P パパ（${p2Stats.displayName}）のターン！`
                    : `😈 ${selectedBoss.name} のターン！`}
                </span>

                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsPapaCpu((prev) => !prev)}
                    className="px-2 py-1 rounded-lg bg-slate-800 text-[11px] font-bold text-cyan-300 border border-white/20 cursor-pointer"
                  >
                    {isPapaCpu ? '🤖 パパCPU' : '👨 パパ手動'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetScrollTop();
                      setPhase('select');
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-800 text-[11px] font-bold text-slate-300 border border-white/20 cursor-pointer"
                  >
                    えらび直す
                  </button>
                </div>
              </div>

              {/* 🔥 COOPモード：合体必殺技ゲージ＆発動ボタン */}
              {battleMode === 'coop' && (
                <div className="space-y-1.5">
                  {tagGauge >= 100 && (turn === 1 || (turn === 2 && !isPapaCpu)) ? (
                    <button
                      type="button"
                      onClick={executeTagUltimate}
                      className="min-h-[54px] w-full rounded-2xl bg-gradient-to-r from-yellow-300 via-rose-500 to-purple-600 text-white font-black text-base sm:text-lg border-2 border-white shadow-[0_0_25px_rgba(250,204,21,0.9)] flex items-center justify-center gap-2 animate-pulse active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-6 h-6 text-yellow-200 fill-yellow-200" />
                      <span>💥 ふたりで 合体必殺技を うつ！！（MP0）</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-950/90 px-3 py-1 rounded-xl border border-amber-400/40">
                      <span className="text-[11px] font-black text-amber-300 shrink-0">
                        🔥 合体必殺技ゲージ {tagGauge}%
                      </span>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-300"
                          style={{ width: `${tagGauge}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {turn === 3 ? (
                <div className="py-5 text-center text-sm sm:text-base font-black text-rose-300 animate-pulse">
                  😈 {selectedBoss.name} が おそろしい わざを くりだしてくるぞ…！
                </div>
              ) : turn === 2 && isPapaCpu ? (
                <div className="py-5 text-center text-sm sm:text-base font-black text-cyan-300 animate-pulse">
                  🤖 パパの {p2Stats.displayName} が わざを かんがえているよ…！
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
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
                        className={`min-h-[52px] rounded-xl p-2 text-left border-2 flex items-center justify-between gap-1.5 transition-all active:scale-95 cursor-pointer ${
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

                  {/* 💚 かいふく（ホイミ） */}
                  <button
                    type="button"
                    onClick={() => executeHeal(turn === 1 ? 1 : 2)}
                    disabled={currentActorMp < 15}
                    className={`min-h-[52px] rounded-xl p-2 text-left border-2 flex items-center justify-between gap-1.5 transition-all active:scale-95 cursor-pointer ${
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

                  {/* ⚡ パワーためる */}
                  <button
                    type="button"
                    onClick={() => executeCharge(turn === 1 ? 1 : 2)}
                    className="min-h-[52px] rounded-xl p-2 text-left border-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-300 flex items-center justify-between gap-1.5 transition-all active:scale-95 cursor-pointer shadow"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-black truncate flex items-center gap-1 text-yellow-300">
                        <Zap className="w-3.5 h-3.5 fill-yellow-300 shrink-0" />
                        <span>パワーためる</span>
                      </div>
                      <div className="text-[10px] text-cyan-100">
                        {battleMode === 'coop' ? 'MP+35 ＆ 合体+50%' : 'MP+25 ＆ 会心確定'}
                      </div>
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
              {battleMode === 'coop'
                ? `🎉 じょう＆パパ タッグで ${selectedBoss.name} を げきは！！`
                : winner === 1
                ? '🎉 1P（じょう）の だいしょうり！！'
                : '👏 2P（パパ）の しょうり！！'}
            </span>
          </div>

          <div className="max-w-md mx-auto py-2">
            {battleMode === 'coop' ? (
              <div className="flex items-center justify-center gap-4">
                <div className="w-28 h-28 sm:w-32 sm:h-32">
                  <KaijuSvgIllustration
                    element={p1Kaiju.element}
                    type={p1Kaiju.type}
                    kaijuId={p1Kaiju.id}
                    category={p1Kaiju.category}
                    realColors={p1Kaiju.realColors}
                    insectStyle={p1Kaiju.insectStyle}
                    evolutionStage={p1Stats.stage}
                  />
                </div>
                <div className="w-28 h-28 sm:w-32 sm:h-32">
                  <KaijuSvgIllustration
                    element={p2Kaiju.element}
                    type={p2Kaiju.type}
                    kaijuId={p2Kaiju.id}
                    category={p2Kaiju.category}
                    realColors={p2Kaiju.realColors}
                    insectStyle={p2Kaiju.insectStyle}
                    evolutionStage={p2Stats.stage}
                  />
                </div>
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto">
                <KaijuSvgIllustration
                  element={winner === 1 ? p1Kaiju.element : p2Kaiju.element}
                  type={winner === 1 ? p1Kaiju.type : p2Kaiju.type}
                  kaijuId={winner === 1 ? p1Kaiju.id : p2Kaiju.id}
                  category={winner === 1 ? p1Kaiju.category : p2Kaiju.category}
                  realColors={winner === 1 ? p1Kaiju.realColors : p2Kaiju.realColors}
                  insectStyle={winner === 1 ? p1Kaiju.insectStyle : p2Kaiju.insectStyle}
                  evolutionStage={winner === 1 ? p1Stats.stage : p2Stats.stage}
                />
              </div>
            )}

            <h3 className="text-xl sm:text-2xl font-black text-yellow-300 mt-2">
              {battleMode === 'coop'
                ? `${p1Stats.displayName} ＆ ${p2Stats.displayName}`
                : winner === 1
                ? p1Stats.displayName
                : p2Stats.displayName}
            </h3>
          </div>

          {/* 👑 大魔王が起き上がって仲間になったときの特別スカウト演出ウィンドウ */}
          {recruitedBossKaiju && (
            <div className="dq-window p-4 max-w-md mx-auto border-4 border-yellow-300 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 shadow-[0_0_30px_rgba(250,204,21,0.6)] space-y-2 text-left">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 shrink-0 bg-slate-950/90 rounded-2xl border-2 border-yellow-300 p-1">
                  <KaijuSvgIllustration
                    element={recruitedBossKaiju.element}
                    type={recruitedBossKaiju.type}
                    kaijuId={recruitedBossKaiju.id}
                    evolutionStage={2}
                    isFloating={true}
                  />
                </div>
                <div className="space-y-1">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-yellow-300 text-slate-950 font-black text-xs">
                    👑 大魔王スカウト大成功！！
                  </div>
                  <div className="text-base sm:text-lg font-black text-yellow-300 leading-snug">
                    おや！？『{recruitedBossKaiju.name}』が おきあがり なかまに なったぞーーっ！！
                  </div>
                  <p className="text-xs font-bold text-slate-200">
                    📖「ずかん」に とうろくされたよ！ほかの かいじゅうとおなじように レベルアップや 3段階しんかも できるぞ！
                  </p>
                </div>
              </div>
            </div>
          )}

          {!recruitedBossKaiju &&
            winner === 1 &&
            (battleMode === 'coop' || p2Kaiju.id.includes('-dq-')) && (
              <div className="max-w-md mx-auto rounded-xl bg-purple-950/70 border border-purple-400/50 px-3 py-2 text-xs font-black text-purple-200">
                💡 ヒント：大魔王を たおすと、まれに おきあがって なかまに なるよ！もういちど たたかってみよう！
              </div>
            )}

          {/* ごほうびボックス */}
          <div className="rounded-2xl bg-amber-500/20 border-2 border-amber-300 p-4 max-w-md mx-auto text-left space-y-2">
            <div className="text-sm font-black text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>たたかいの ごほうび ゲット！</span>
            </div>
            <div className="flex items-center justify-around text-center py-1">
              <div className="flex flex-col items-center">
                <span className="text-2xl">🌟</span>
                <span className="text-sm font-black text-yellow-300 mt-0.5">
                  けいけんち玉 ×{battleMode === 'coop' ? selectedBoss.rewardOrbs : 2}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl">⚡</span>
                <span className="text-sm font-black text-cyan-300 mt-0.5">
                  EXP +{battleMode === 'coop' ? selectedBoss.rewardExp : 30}
                </span>
              </div>
              {battleMode === 'coop' && (
                <div className="flex flex-col items-center">
                  <span className="text-2xl">🟠</span>
                  <span className="text-sm font-black text-orange-300 mt-0.5">ほし玉 ＋1</span>
                </div>
              )}
            </div>
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
              <span>ボスや なかまを えらびなおす</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
