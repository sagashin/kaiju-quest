'use client';

import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Gift,
  Swords,
  Sparkles,
  Shield,
  Zap,
  Volume2,
  CheckCircle2,
  Crown,
  Flame,
} from 'lucide-react';
import {
  KaijuData,
  KaijuProgress,
  KaijuSkill,
  EquipmentItem,
  KAIJU_LIST,
  EQUIPMENT_LIST,
  getKaijuStats,
  getElementMeta,
  getElementAdvantage,
  getAwakeningOverrideColors,
  rollTreasureChestEquipment,
} from '@/lib/kaiju-data';
import { KaijuSvgIllustration } from '@/components/kaiju-artwork';
import {
  playTapSound,
  playBattleAttackSound,
  playMpChargeSound,
  playTagUltimateSound,
  playBattleVictorySound,
  playTreasureChestSound,
  playTournamentGongSound,
  playEquipSound,
  speakJapanese,
} from '@/lib/sound-and-speech';

export interface KaijuTournamentProps {
  partnerKaiju: KaijuData;
  papaPartnerKaiju?: KaijuData;
  partnerProgress?: KaijuProgress;
  unlockedEquipmentIds: string[];
  chestKeys: number;
  tournamentWins: number;
  soundEnabled: boolean;
  onOpenChest: (obtainedItem: EquipmentItem) => void;
  onEquipItem: (kaijuId: string, itemId: string | undefined) => void;
  onTournamentWinReward: () => void;
}

interface TournamentOpponent {
  round: 1 | 2 | 3;
  roundTitle: string;
  kaiju: KaijuData;
  level: number;
  awakeningStar: 0 | 1 | 2 | 3;
}

export function KaijuTournamentAndChest({
  partnerKaiju,
  papaPartnerKaiju,
  partnerProgress,
  unlockedEquipmentIds,
  chestKeys,
  tournamentWins,
  soundEnabled,
  onOpenChest,
  onEquipItem,
  onTournamentWinReward,
}: KaijuTournamentProps) {
  const [subTab, setSubTab] = useState<'tournament' | 'chest'>('tournament');

  // --- たからばこ開封ステート ---
  const [isOpeningChest, setIsOpeningChest] = useState(false);
  const [newlyObtainedItem, setNewlyObtainedItem] = useState<{
    item: EquipmentItem;
    isNew: boolean;
  } | null>(null);
  const [selectedEquipmentDetail, setSelectedEquipmentDetail] = useState<EquipmentItem | null>(
    null
  );

  // --- 天下一武道会（3連戦）ステート ---
  const [opponents, setOpponents] = useState<TournamentOpponent[] | null>(null);
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1);
  const [playerHp, setPlayerHp] = useState<number>(200);
  const [playerMp, setPlayerMp] = useState<number>(50);
  const [enemyHp, setEnemyHp] = useState<number>(200);
  const [enemyMaxHp, setEnemyMaxHp] = useState<number>(200);
  const [isCharged, setIsCharged] = useState<boolean>(false);
  const [usedPapaTag, setUsedPapaTag] = useState<boolean>(false);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [isPlayerAnimating, setIsPlayerAnimating] = useState<boolean>(false);
  const [isEnemyDamaged, setIsEnemyDamaged] = useState<boolean>(false);
  const [isPlayerDamaged, setIsPlayerDamaged] = useState<boolean>(false);
  const [roundCleared, setRoundCleared] = useState<boolean>(false);
  const [isChampion, setIsChampion] = useState<boolean>(false);
  const [isDefeated, setIsDefeated] = useState<boolean>(false);

  const playerStats = useMemo(
    () => getKaijuStats(partnerKaiju, partnerProgress),
    [partnerKaiju, partnerProgress]
  );

  const currentOpponent = useMemo(() => {
    if (!opponents) return null;
    return opponents.find((o) => o.round === currentRound) ?? opponents[0];
  }, [opponents, currentRound]);

  const enemyStats = useMemo(() => {
    if (!currentOpponent) return null;
    return getKaijuStats(currentOpponent.kaiju, {
      level: currentOpponent.level,
      exp: 0,
      awakeningStar: currentOpponent.awakeningStar,
    });
  }, [currentOpponent]);

  // --- 🎁 たからばこを開ける処理 ---
  const handleOpenTreasureChest = () => {
    if (chestKeys <= 0 || isOpeningChest) {
      playTapSound(340);
      speakJapanese(
        '金のたからばこが ないよ！お支度クエストをクリアするか、天下一トーナメントで優勝して ゲットしよう！',
        soundEnabled
      );
      return;
    }

    setIsOpeningChest(true);
    setNewlyObtainedItem(null);
    playTapSound(620);
    speakJapanese('ドキドキ…！金のたからばこを あけるぞーっ！なにが でるかな！？', soundEnabled);

    setTimeout(() => {
      const result = rollTreasureChestEquipment(unlockedEquipmentIds);
      setIsOpeningChest(false);
      setNewlyObtainedItem(result);
      onOpenChest(result.item);
      playTreasureChestSound();
      speakJapanese(
        `キターーー！ファンファーレ！でんせつの そうび、${result.item.name} を ゲットしたぞーっ！${result.item.description}`,
        soundEnabled
      );
    }, 1100);
  };

  // --- 🏆 トーナメント開始処理（3連戦の対戦相手を抽選） ---
  const handleStartTournament = () => {
    const pool = KAIJU_LIST.filter((k) => k.id !== partnerKaiju.id);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    const r1Lv = Math.max(2, Math.min(6, playerStats.level - 1));
    const r2Lv = Math.max(4, Math.min(8, playerStats.level));
    const r3Lv = Math.max(6, Math.min(10, playerStats.level + 1));

    const newOpponents: TournamentOpponent[] = [
      {
        round: 1,
        roundTitle: '🔥 第1回戦（ファーストラウンド）',
        kaiju: shuffled[0],
        level: r1Lv,
        awakeningStar: 0,
      },
      {
        round: 2,
        roundTitle: '⚡ 準決勝（セミファイナル）',
        kaiju: shuffled[1],
        level: r2Lv,
        awakeningStar: r2Lv >= 8 ? 1 : 0,
      },
      {
        round: 3,
        roundTitle: '👑 決勝戦（グランドファイナル）',
        kaiju: shuffled[2],
        level: r3Lv,
        awakeningStar: r3Lv >= 10 ? 2 : 1,
      },
    ];

    const firstEnemyStats = getKaijuStats(newOpponents[0].kaiju, {
      level: newOpponents[0].level,
      exp: 0,
      awakeningStar: newOpponents[0].awakeningStar,
    });

    setOpponents(newOpponents);
    setCurrentRound(1);
    setPlayerHp(playerStats.maxHp);
    setPlayerMp(playerStats.maxMp);
    setEnemyHp(firstEnemyStats.maxHp);
    setEnemyMaxHp(firstEnemyStats.maxHp);
    setIsCharged(false);
    setUsedPapaTag(false);
    setRoundCleared(false);
    setIsChampion(false);
    setIsDefeated(false);
    setBattleLogs([
      `🎺 カーン！！ 天下一・最強バトルトーナメント 第1回戦！`,
      `⚔️ 『${firstEnemyStats.displayName}（Lv.${newOpponents[0].level}）』が あらわれた！`,
    ]);

    playTournamentGongSound();
    speakJapanese(
      `カーン！天下一バトルトーナメント、だい 1 かいせん！あいては、${firstEnemyStats.displayName} だ！がんばれ、${playerStats.displayName}！`,
      soundEnabled
    );
  };

  // --- プレイヤーの技攻撃 ---
  const handleUseSkill = (skill: KaijuSkill) => {
    if (!currentOpponent || !enemyStats || roundCleared || isDefeated || isPlayerAnimating) return;

    if (playerMp < skill.mpCost) {
      playTapSound(320);
      speakJapanese(
        'MPが たりないよ！「元気玉チャージ」ボタンで MPを まんたんに しよう！',
        soundEnabled
      );
      return;
    }

    setIsPlayerAnimating(true);
    setPlayerMp((prev) => Math.max(0, prev - skill.mpCost));

    const adv = getElementAdvantage(partnerKaiju.element, currentOpponent.kaiju.element);
    const chargeMult = isCharged ? 1.85 : 1.0;
    const isCrit = Math.random() < 0.25 || isCharged;
    const critMult = isCrit ? 1.35 : 1.0;

    const rawDamage =
      (playerStats.attack * 0.9 + skill.power * 1.15 - enemyStats.defense * 0.35) *
      adv.multiplier *
      chargeMult *
      critMult;
    const damage = Math.max(25, Math.round(rawDamage));

    playBattleAttackSound(isCrit);
    setIsEnemyDamaged(true);
    setIsCharged(false);

    const nextEnemyHp = Math.max(0, enemyHp - damage);
    setEnemyHp(nextEnemyHp);

    const newLogs: string[] = [
      `⚡ ${playerStats.displayName}の『${skill.name}』！！`,
      ...(isCrit ? ['💥 かいしんの いちげき！！'] : []),
      ...(adv.label ? [adv.label] : []),
      `🎯 ${enemyStats.displayName}に ${damage} のダメージ！`,
    ];
    setBattleLogs(newLogs);

    setTimeout(() => {
      setIsEnemyDamaged(false);
      setIsPlayerAnimating(false);

      if (nextEnemyHp <= 0) {
        handleWinRound();
      } else {
        executeEnemyTurn(nextEnemyHp);
      }
    }, 650);
  };

  // --- ⚡ 元気玉チャージ（MP回復＋次回威力約2倍） ---
  const handleChargeMp = () => {
    if (!currentOpponent || !enemyStats || roundCleared || isDefeated || isPlayerAnimating) return;

    setIsPlayerAnimating(true);
    playMpChargeSound();
    const mpRecover = Math.round(playerStats.maxMp * 0.65);
    const hpRecover = Math.round(playerStats.maxHp * 0.2);

    setPlayerMp((prev) => Math.min(playerStats.maxMp, prev + mpRecover));
    setPlayerHp((prev) => Math.min(playerStats.maxHp, prev + hpRecover));
    setIsCharged(true);

    setBattleLogs([
      `🙌 みんなから 元気を わけてもらった！`,
      `✨ MPが ${mpRecover}、HPが ${hpRecover} かいふく！つぎの こうげきが 超パワーアップ！`,
    ]);
    speakJapanese(
      'オラに 元気を わけてくれーっ！MPが かいふくして、つぎの わざが 超パワーアップしたぞ！',
      soundEnabled
    );

    setTimeout(() => {
      setIsPlayerAnimating(false);
      executeEnemyTurn(enemyHp);
    }, 650);
  };

  // --- 🤝 パパ＆じょうの合体必殺技（1試合に1回使える超切り札！） ---
  const handlePapaTagUltimate = () => {
    if (
      !currentOpponent ||
      !enemyStats ||
      roundCleared ||
      isDefeated ||
      isPlayerAnimating ||
      usedPapaTag
    )
      return;

    setIsPlayerAnimating(true);
    setUsedPapaTag(true);
    playTagUltimateSound();
    setIsEnemyDamaged(true);

    const papaName = papaPartnerKaiju?.name ?? 'パパのかいじゅう';
    const damage = Math.round(playerStats.attack * 2.4 + 140);
    const nextEnemyHp = Math.max(0, enemyHp - damage);
    setEnemyHp(nextEnemyHp);

    setBattleLogs([
      `🤝 パパの『${papaName}』が かけつけた！！`,
      `🌈 ふたりで 超合体必殺技『おやこ・ギャラクシーノヴァ』！！`,
      `💥 ドゴォォーン！！ ${enemyStats.displayName}に ${damage} の超特大ダメージ！！`,
    ]);
    speakJapanese(
      `キターーー！パパの ${papaName} と ふたりで 合体必殺技！おやこ・ギャラクシーノヴァだーっ！${damage} の超ダメージ！`,
      soundEnabled
    );

    setTimeout(() => {
      setIsEnemyDamaged(false);
      setIsPlayerAnimating(false);
      if (nextEnemyHp <= 0) {
        handleWinRound();
      } else {
        executeEnemyTurn(nextEnemyHp);
      }
    }, 800);
  };

  // --- 敵の反撃ターン ---
  const executeEnemyTurn = (currentEnemyHp: number) => {
    if (!currentOpponent || !enemyStats || currentEnemyHp <= 0) return;

    const enemyMove =
      Math.random() < 0.4 ? currentOpponent.kaiju.specialMove : enemyStats.allSkills[0].name;
    const rawEnemyDmg = enemyStats.attack * 0.85 - playerStats.defense * 0.42;
    const enemyDmg = Math.max(15, Math.round(rawEnemyDmg));

    setIsPlayerDamaged(true);
    playTapSound(220);

    setPlayerHp((prevHp) => {
      let nextHp = prevHp - enemyDmg;
      // 4歳児が泣かない親切設計：1回だけHP1でふんばる可能性！
      if (nextHp <= 0 && prevHp > 1 && Math.random() < 0.5) {
        nextHp = 1;
        setBattleLogs((prev) => [
          ...prev,
          `😈 ${enemyStats.displayName}の『${enemyMove}』！`,
          `🔥 ${playerStats.displayName}は じょうくんの 応援で HP1 で ふんばった！！`,
        ]);
      } else {
        nextHp = Math.max(0, nextHp);
        setBattleLogs((prev) => [
          ...prev,
          `😈 ${enemyStats.displayName}の『${enemyMove}』！ ${enemyDmg} のダメージを うけた！`,
        ]);
      }

      if (nextHp <= 0) {
        setIsDefeated(true);
        speakJapanese(
          'あちゃー！やられちゃった！でも だいじょうぶ！仙豆を たべて もういちど ちょうせんしよう！',
          soundEnabled
        );
      }
      return nextHp;
    });

    setTimeout(() => {
      setIsPlayerDamaged(false);
    }, 450);
  };

  // --- ラウンド勝利処理 ---
  const handleWinRound = () => {
    if (!currentOpponent || !enemyStats) return;

    playBattleVictorySound();

    if (currentRound < 3) {
      setRoundCleared(true);
      setBattleLogs([
        `🎉 やったー！！ ${currentOpponent.roundTitle} 突破！！`,
        `🫘 カリン様の 仙豆で HPとMPが まんたんに かいふくしたぞ！`,
      ]);
      speakJapanese(
        `やったー！${enemyStats.displayName} に 勝ったぞ！つぎの 試合へ すすもう！`,
        soundEnabled
      );
    } else {
      // 決勝戦（第3回戦）勝利＝天下一トーナメント完全優勝！！
      setIsChampion(true);
      onTournamentWinReward();
      setBattleLogs([
        `🏆 キターーー！！ 天下一・最強バトルトーナメント 完全優勝！！`,
        `🎁 ごほうび：『金のたからばこ ＋1こ』『けいけんち玉 ＋2こ』『🟠ほし玉 ＋1こ』ゲット！！`,
      ]);
      speakJapanese(
        `キターーー！天下一バトルトーナメント、3連勝で 完全優勝だーっ！じょうくんと ${playerStats.displayName} が 世界一の チャンピオンだよ！金のたからばこも ゲットしたぞ！神ってるー！`,
        soundEnabled
      );
    }
  };

  // --- 次のラウンドへ進む ---
  const handleNextRound = () => {
    if (!opponents || currentRound >= 3) return;
    const nextR = (currentRound + 1) as 2 | 3;
    const nextOpp = opponents.find((o) => o.round === nextR)!;
    const nextEStats = getKaijuStats(nextOpp.kaiju, {
      level: nextOpp.level,
      exp: 0,
      awakeningStar: nextOpp.awakeningStar,
    });

    setCurrentRound(nextR);
    setPlayerHp(playerStats.maxHp);
    setPlayerMp(playerStats.maxMp);
    setEnemyHp(nextEStats.maxHp);
    setEnemyMaxHp(nextEStats.maxHp);
    setIsCharged(false);
    setUsedPapaTag(false);
    setRoundCleared(false);
    setBattleLogs([
      `🎺 カーン！！ ${nextOpp.roundTitle} スタート！！`,
      `⚔️ 『${nextEStats.displayName}（Lv.${nextOpp.level}）』が 立ちはだかる！`,
    ]);

    playTournamentGongSound();
    speakJapanese(
      `カーン！${nextOpp.roundTitle}！あいては、強敵 ${nextEStats.displayName} だ！レッツゴー！`,
      soundEnabled
    );
  };

  return (
    <div className="space-y-4">
      {/* サブタブ切り替え：「🏆 天下一武道会」 ＆ 「🎁 たからばこ＆装備図鑑」 */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => {
            playTapSound(560);
            setSubTab('tournament');
          }}
          className={`min-h-[58px] rounded-2xl p-2.5 font-black text-sm sm:text-base flex items-center justify-center gap-2 border-2 transition-all cursor-pointer active:scale-95 ${
            subTab === 'tournament'
              ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 border-white shadow-[0_0_20px_rgba(249,115,22,0.7)]'
              : 'bg-slate-900/90 text-slate-300 border-white/15 hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-5 h-5 shrink-0" />
          <span>🏆 天下一トーナメント</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playTapSound(560);
            setSubTab('chest');
          }}
          className={`relative min-h-[58px] rounded-2xl p-2.5 font-black text-sm sm:text-base flex items-center justify-center gap-2 border-2 transition-all cursor-pointer active:scale-95 ${
            subTab === 'chest'
              ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-slate-950 border-white shadow-[0_0_20px_rgba(250,204,21,0.7)]'
              : 'bg-slate-900/90 text-slate-300 border-white/15 hover:bg-slate-800'
          }`}
        >
          <Gift className="w-5 h-5 shrink-0" />
          <span>🎁 たからばこ＆そうび</span>
          {chestKeys > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black border border-white animate-bounce">
              {chestKeys}こ
            </span>
          )}
        </button>
      </div>

      {/* ===================================================================== */}
      {/* タブ1：🏆 天下一・最強バトルトーナメント（3連戦勝ち抜きモード）      */}
      {/* ===================================================================== */}
      {subTab === 'tournament' && (
        <div className="space-y-3">
          {/* トーナメント上部バナー */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-400/60 p-3.5 flex flex-wrap items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-sm sm:text-base font-black text-yellow-300">
                  天下一・最強バトルトーナメント（3連戦）
                </div>
                <div className="text-xs font-bold text-slate-300">
                  3連勝で「🎁金のたからばこ」ゲット＆「😈まぼろしの裏ボス」出現！
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-400/20 border border-amber-300 text-amber-200 font-black text-xs sm:text-sm">
              🏆 優勝回数：{tournamentWins} かい
            </div>
          </div>

          {/* まだ試合開始していない時のエントリー画面 */}
          {!opponents ? (
            <div className="dq-window p-5 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 font-black text-xs">
                <span>🔥 1回戦 ➔ ⚡ 準決勝 ➔ 👑 決勝戦</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                あいぼう『{playerStats.displayName}』で 出場しよう！
              </h3>

              {/* 出場するあいぼうプレビュー */}
              <div className="w-36 h-36 mx-auto bg-slate-900/90 rounded-2xl border-2 border-amber-400/50 flex items-center justify-center p-2">
                <KaijuSvgIllustration
                  element={partnerKaiju.element}
                  type={partnerKaiju.type}
                  kaijuId={partnerKaiju.id}
                  category={partnerKaiju.category}
                  insectStyle={partnerKaiju.insectStyle}
                  realColors={getAwakeningOverrideColors(partnerKaiju, playerStats.awakeningStar)}
                  evolutionStage={playerStats.stage}
                  isFloating={true}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-black">
                <span className="px-3 py-1 rounded-lg bg-slate-800 text-yellow-300 border border-white/15">
                  Lv.{playerStats.level}
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-white/15">
                  HP {playerStats.maxHp}
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-800 text-orange-300 border border-white/15">
                  ⚔️ちから {playerStats.attack}
                </span>
                {playerStats.equippedItem && (
                  <span className="px-3 py-1 rounded-lg bg-amber-500/30 text-yellow-200 border border-yellow-300">
                    {playerStats.equippedItem.emoji} {playerStats.equippedItem.name} 装備中！
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleStartTournament}
                className="min-h-[64px] w-full max-w-md mx-auto rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 font-black text-lg sm:text-xl border-2 border-white shadow-[0_5px_0_#9a3412,0_0_25px_rgba(249,115,22,0.8)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Swords className="w-6 h-6" />
                <span>トーナメントに 出場する！（ゴング！）</span>
              </button>
            </div>
          ) : isChampion ? (
            /* 🏆 3連戦完全制覇・優勝画面 */
            <div className="rounded-3xl bg-gradient-to-b from-amber-500/30 via-purple-950 to-slate-950 border-4 border-yellow-300 p-5 text-center space-y-4 shadow-[0_0_45px_rgba(250,204,21,0.5)]">
              <div className="text-5xl animate-bounce">🏆👑🎁</div>
              <h3 className="text-2xl sm:text-3xl font-black text-yellow-300">
                天下一トーナメント 優勝おめでとう！！
              </h3>
              <p className="text-sm sm:text-base font-bold text-white">
                3連戦を すべて 勝ちぬいた じょうくんと『{playerStats.displayName}』が 世界一だ！！
              </p>

              <div className="dq-window p-4 max-w-md mx-auto space-y-2">
                <div className="text-xs font-black text-yellow-300">🎉 チャンピオンごほうび！</div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-black">
                  <span className="px-3 py-1.5 rounded-xl bg-yellow-400 text-slate-950">
                    🎁 金のたからばこ ＋1こ
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/30 border border-amber-300 text-amber-200">
                    🌟 けいけんち玉 ＋2こ
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-orange-500/30 border border-orange-300 text-orange-200">
                    🟠 ほし玉 ＋1こ
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-300 pt-1">
                  😈 さらに！レイドバトルに『まぼろしの裏ボス4体（ゾーマ・エスターク・レックウドラゴ・黄金ヘラクレス）』が出現したぞ！
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    playTapSound(640);
                    setSubTab('chest');
                  }}
                  className="min-h-[60px] rounded-2xl bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 text-slate-950 font-black text-base border-2 border-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Gift className="w-5 h-5" />
                  <span>🎁 金のたからばこを あける！</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartTournament}
                  className="min-h-[60px] rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-base border-2 border-white/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Swords className="w-5 h-5" />
                  <span>もういちど 出場する！</span>
                </button>
              </div>
            </div>
          ) : (
            /* ⚔️ トーナメント試合中ステージ */
            <div className="space-y-3">
              {/* トーナメント進行バー（1回戦 → 準決勝 → 決勝戦） */}
              <div className="grid grid-cols-3 gap-2">
                {opponents.map((opp) => {
                  const isCurrent = opp.round === currentRound;
                  const isDone = opp.round < currentRound || (isCurrent && roundCleared);
                  return (
                    <div
                      key={opp.round}
                      className={`rounded-xl p-2 text-center border-2 transition-all ${
                        isCurrent
                          ? 'bg-amber-400/25 border-yellow-300 text-yellow-200 shadow'
                          : isDone
                          ? 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300'
                          : 'bg-slate-900/70 border-white/10 text-slate-500'
                      }`}
                    >
                      <div className="text-[11px] font-black">
                        {isDone ? '⭕ 突破！' : opp.round === 1 ? '第1回戦' : opp.round === 2 ? '準決勝' : '👑決勝戦'}
                      </div>
                      <div className="text-xs font-black truncate">{opp.kaiju.name}</div>
                    </div>
                  );
                })}
              </div>

              {/* VS バトルアリーナ */}
              {currentOpponent && enemyStats && (
                <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-950 border-2 border-white/20 p-3.5 space-y-3">
                  <div className="grid grid-cols-2 gap-3 items-center">
                    {/* 左：じょうくんのあいぼう */}
                    <div
                      className={`rounded-2xl bg-slate-900/90 border-2 border-emerald-400/50 p-3 text-center space-y-1.5 transition-transform ${
                        isPlayerAnimating ? 'scale-105' : ''
                      } ${isPlayerDamaged ? 'animate-damage-shake' : ''}`}
                    >
                      <div className="text-[11px] font-black text-emerald-300 truncate">
                        🤝 {playerStats.displayName} (Lv.{playerStats.level})
                      </div>
                      <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto">
                        <KaijuSvgIllustration
                          element={partnerKaiju.element}
                          type={partnerKaiju.type}
                          kaijuId={partnerKaiju.id}
                          category={partnerKaiju.category}
                          insectStyle={partnerKaiju.insectStyle}
                          realColors={getAwakeningOverrideColors(
                            partnerKaiju,
                            playerStats.awakeningStar
                          )}
                          evolutionStage={playerStats.stage}
                          isAttacking={isPlayerAnimating}
                        />
                      </div>
                      {/* HP / MP バー */}
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-[11px] font-black">
                          <span className="text-emerald-300">HP</span>
                          <span className="tabular-nums">
                            {playerHp}/{playerStats.maxHp}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all"
                            style={{
                              width: `${Math.max(0, (playerHp / playerStats.maxHp) * 100)}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-black">
                          <span className="text-cyan-300">MP</span>
                          <span className="tabular-nums">
                            {playerMp}/{playerStats.maxMp}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all"
                            style={{
                              width: `${Math.max(0, (playerMp / playerStats.maxMp) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 右：トーナメント対戦相手 */}
                    <div
                      className={`rounded-2xl bg-slate-900/90 border-2 border-rose-400/50 p-3 text-center space-y-1.5 ${
                        isEnemyDamaged ? 'animate-damage-shake' : ''
                      }`}
                    >
                      <div className="text-[11px] font-black text-rose-300 truncate">
                        ⚔️ {enemyStats.displayName} (Lv.{currentOpponent.level})
                      </div>
                      <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto">
                        <KaijuSvgIllustration
                          element={currentOpponent.kaiju.element}
                          type={currentOpponent.kaiju.type}
                          kaijuId={currentOpponent.kaiju.id}
                          category={currentOpponent.kaiju.category}
                          insectStyle={currentOpponent.kaiju.insectStyle}
                          realColors={getAwakeningOverrideColors(
                            currentOpponent.kaiju,
                            currentOpponent.awakeningStar
                          )}
                          evolutionStage={enemyStats.stage}
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-[11px] font-black">
                          <span className="text-rose-300">あいてのHP</span>
                          <span className="tabular-nums">
                            {enemyHp}/{enemyMaxHp}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all"
                            style={{ width: `${Math.max(0, (enemyHp / enemyMaxHp) * 100)}%` }}
                          />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 text-center pt-1">
                          {getElementMeta(currentOpponent.kaiju.element).emoji}{' '}
                          {currentOpponent.kaiju.titleBadge}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ドラクエ風バトル実況ウィンドウ */}
                  <div className="dq-window p-3 text-white space-y-1 min-h-[76px]">
                    {battleLogs.map((log, idx) => (
                      <p key={idx} className="text-xs sm:text-sm font-black leading-snug">
                        {log}
                      </p>
                    ))}
                  </div>

                  {/* ラウンド突破時 or 敗北時 or コマンド選択 */}
                  {roundCleared ? (
                    <button
                      type="button"
                      onClick={handleNextRound}
                      className="min-h-[60px] w-full rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-lg border-2 border-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                    >
                      <Flame className="w-6 h-6 fill-slate-950" />
                      <span>
                        つぎの 試合（{currentRound === 1 ? '準決勝' : '決勝戦'}）へ すすむ！
                      </span>
                    </button>
                  ) : isDefeated ? (
                    <button
                      type="button"
                      onClick={handleStartTournament}
                      className="min-h-[60px] w-full rounded-2xl bg-amber-400 text-slate-950 font-black text-lg border-2 border-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>🫘 仙豆で復活して もういちど ちょうせん！</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {playerStats.unlockedSkills.map((sk) => {
                          const canUse = playerMp >= sk.mpCost;
                          return (
                            <button
                              key={sk.id}
                              type="button"
                              onClick={() => handleUseSkill(sk)}
                              className={`min-h-[54px] rounded-xl p-2.5 text-left border-2 flex items-center justify-between gap-2 transition-all active:scale-95 cursor-pointer ${
                                canUse
                                  ? sk.isUltimate
                                    ? 'bg-gradient-to-r from-amber-500/40 via-rose-500/40 to-purple-600/40 border-yellow-300 text-white'
                                    : 'bg-slate-800 hover:bg-slate-700 border-white/25 text-white'
                                  : 'bg-slate-950/70 border-slate-800 text-slate-500'
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="text-sm font-black truncate">
                                  ⚡ {sk.name}
                                </div>
                                <div className="text-[11px] font-bold text-amber-300">
                                  💥威力 {sk.power} / MP {sk.mpCost}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={handleChargeMp}
                          className="min-h-[52px] rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs sm:text-sm border-2 border-cyan-200 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        >
                          <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                          <span>🙌 元気玉チャージ（MP回復）</span>
                        </button>

                        <button
                          type="button"
                          disabled={usedPapaTag}
                          onClick={handlePapaTagUltimate}
                          className={`min-h-[52px] rounded-xl font-black text-xs sm:text-sm border-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                            usedPapaTag
                              ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                              : 'bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600 text-white border-white shadow cursor-pointer'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>
                            {usedPapaTag ? '🤝 合体技 しようずみ' : '🤝 パパと超合体必殺技！'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* タブ2：🎁 金のたからばこ開封 ＆ でんせつの装備図鑑（全12種）          */}
      {/* ===================================================================== */}
      {subTab === 'chest' && (
        <div className="space-y-4">
          {/* 金のたからばこ開封ステージ */}
          <div className="rounded-3xl bg-gradient-to-b from-amber-500/25 via-slate-900 to-slate-950 border-2 border-yellow-400/60 p-5 text-center space-y-3 shadow-lg">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow">
              <Gift className="w-4 h-4" />
              <span>金のたからばこ のこり：{chestKeys} こ</span>
            </div>

            <div
              className={`text-6xl sm:text-7xl py-2 select-none ${
                isOpeningChest ? 'animate-egg-shake' : 'animate-float'
              }`}
            >
              🎁
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-200">
              お支度クエストや トーナメント優勝で「金のたからばこ」が もらえるよ！
              <br />
              あけると『ロトのつるぎ』や『にょいぼう』など 伝説のそうびが 手に入るぞ！
            </p>

            <button
              type="button"
              onClick={handleOpenTreasureChest}
              className={`min-h-[64px] w-full max-w-md mx-auto rounded-2xl p-3 font-black text-base sm:text-lg border-2 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                chestKeys > 0
                  ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 text-slate-950 border-white shadow-[0_5px_0_#b45309,0_0_25px_rgba(250,204,21,0.8)]'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Sparkles className="w-6 h-6" />
              <span>
                {isOpeningChest
                  ? 'ガタガタ…！あけているよ…！'
                  : chestKeys > 0
                  ? `🎁 金のたからばこを あける！（のこり${chestKeys}こ）`
                  : '🎁 金のたからばこ（クエストや大会でゲット！）'}
              </span>
            </button>

            {/* 新しく出たアイテムのドラクエ風ファンファーレ表示 */}
            {newlyObtainedItem && (
              <div className="dq-window p-4 max-w-md mx-auto text-white space-y-2 animate-bounce">
                <div className="text-xs font-black text-yellow-300">
                  {newlyObtainedItem.isNew
                    ? '✨ あたらしい でんせつのそうび ゲット！！'
                    : '🎉 でんせつのそうび ゲット！！'}
                </div>
                <div className="text-4xl">{newlyObtainedItem.item.emoji}</div>
                <div className="text-lg sm:text-xl font-black text-yellow-200">
                  【{newlyObtainedItem.item.rarity}】{newlyObtainedItem.item.name}
                </div>
                <p className="text-xs font-bold text-slate-200">
                  {newlyObtainedItem.item.description}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    playEquipSound();
                    onEquipItem(partnerKaiju.id, newlyObtainedItem.item.id);
                    speakJapanese(
                      `シャキィーン！あいぼうの ${playerStats.displayName} に、${newlyObtainedItem.item.name} を すぐ そうびしたよ！`,
                      soundEnabled
                    );
                  }}
                  className="min-h-[48px] w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm border-2 border-white shadow cursor-pointer"
                >
                  ⚔️ いまの「あいぼう」に すぐ装備する！
                </button>
              </div>
            )}
          </div>

          {/* ⚔️ でんせつの装備図鑑（全12種） */}
          <div className="dq-window p-4 space-y-3">
            <div className="flex items-center justify-between border-b-2 border-white/20 pb-2">
              <div className="flex items-center gap-2 font-black text-sm sm:text-base text-yellow-300">
                <Shield className="w-5 h-5" />
                <span>⚔️ でんせつの そうび図鑑</span>
              </div>
              <span className="text-xs sm:text-sm font-black text-amber-200 tabular-nums">
                あつめた数：{unlockedEquipmentIds.length} / {EQUIPMENT_LIST.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {EQUIPMENT_LIST.map((item) => {
                const isUnlocked = unlockedEquipmentIds.includes(item.id);
                const isEquippedByPartner = playerStats.equippedItem?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (!isUnlocked) {
                        playTapSound(340);
                        speakJapanese(
                          'この そうびは まだ みつかっていないよ！金のたからばこを あけて ゲットしよう！',
                          soundEnabled
                        );
                        return;
                      }
                      playEquipSound();
                      setSelectedEquipmentDetail(item);
                      onEquipItem(
                        partnerKaiju.id,
                        isEquippedByPartner ? undefined : item.id
                      );
                      speakJapanese(
                        `${item.name}！${item.description} あいぼうの ${playerStats.displayName} に そうびしたよ！`,
                        soundEnabled
                      );
                    }}
                    className={`rounded-2xl p-3 border-2 text-left transition-all flex flex-col justify-between gap-2 cursor-pointer active:scale-95 ${
                      isEquippedByPartner
                        ? 'bg-gradient-to-b from-amber-500/40 to-emerald-950 border-yellow-300 ring-2 ring-yellow-300 shadow'
                        : isUnlocked
                        ? 'bg-slate-900 hover:bg-slate-800 border-white/20'
                        : 'bg-slate-950/60 border-slate-800 opacity-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-3xl">{isUnlocked ? item.emoji : '🔒'}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          item.rarity === 'SSR'
                            ? 'bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 text-slate-950'
                            : item.rarity === 'SR'
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-sky-400 text-slate-950'
                        }`}
                      >
                        {item.rarity}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-black text-white truncate">
                        {isUnlocked ? item.name : '？？？？？'}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 truncate">
                        {isUnlocked ? item.titleBadge : 'たからばこで発見'}
                      </div>
                    </div>

                    {isUnlocked && (
                      <div className="text-[10px] font-black text-emerald-300 bg-slate-950/80 rounded-lg px-2 py-1">
                        {isEquippedByPartner
                          ? '✅ あいぼうが装備中！'
                          : `⚔️+${item.atkBonus} ❤️+${item.hpBonus} 💨+${item.spdBonus}`}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedEquipmentDetail && (
              <div className="rounded-xl bg-slate-900/95 border border-yellow-400/50 p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-3xl shrink-0">{selectedEquipmentDetail.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-yellow-300">
                      {selectedEquipmentDetail.name}（{selectedEquipmentDetail.titleBadge}）
                    </div>
                    <p className="text-xs font-bold text-slate-200 leading-relaxed">
                      {selectedEquipmentDetail.description}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    speakJapanese(
                      `${selectedEquipmentDetail.name}！${selectedEquipmentDetail.description}`,
                      soundEnabled
                    )
                  }
                  className="px-3 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>きく</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}