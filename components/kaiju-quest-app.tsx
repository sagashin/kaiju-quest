'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  HelpCircle,
  Flame,
  BookOpen,
  Swords,
  HeartHandshake,
} from 'lucide-react';
import {
  QUEST_LIST,
  ELEMENT_OPTIONS,
  KAIJU_TYPE_OPTIONS,
  INSECT_TYPE_OPTIONS,
  KAIJU_LIST,
  ElementId,
  KaijuTypeId,
  CreatureCategory,
  KaijuData,
  KaijuProgress,
  QuestItem,
  findKaijuForSummon,
  getKaijuStats,
  getElementMeta,
  getTypeMeta,
  getHeroRank,
  MAX_KAIJU_LEVEL,
} from '@/lib/kaiju-data';
import { MonsterEggSvg, KaijuSvgIllustration } from '@/components/kaiju-artwork';
import { KaijuHeroCard } from '@/components/kaiju-card';
import { KaijuBattle } from '@/components/kaiju-battle';
import { KaijuQuiz } from '@/components/kaiju-quiz';
import {
  playTapSound,
  playQuestClearSound,
  playEggChargeSound,
  playSummonExplosionAndFanfare,
  playSpecialAttackSound,
  playLevelUpSound,
  playEvolutionSound,
  playBeatboxIntroSound,
  playYoutuberAirhornSound,
  playShenronSummonSound,
  speakJapanese,
  fireQuestConfetti,
  fireSummonConfetti,
} from '@/lib/sound-and-speech';

type ActiveTab = 'quest' | 'summon' | 'zukan' | 'quiz' | 'battle';

interface SavedAppState {
  energy: number;
  completedQuests: string[];
  unlockedKaijuIds: string[];
  soundEnabled: boolean;
  kaijuProgress: Record<string, KaijuProgress>;
  expOrbs: number;
  partnerKaijuId: string | null;
  starBalls?: number;
  rewardedMorningBonus?: boolean;
  rewardedNightBonus?: boolean;
  recruitedBossKaijuIds?: string[];
}

const STORAGE_KEY = 'kaiju_oshitaku_quest_v1';

export default function KaijuQuestApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('quest');
  const [energy, setEnergy] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [unlockedKaijuIds, setUnlockedKaijuIds] = useState<string[]>(['fire-dino']);
  const [recruitedBossKaijuIds, setRecruitedBossKaijuIds] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [kaijuProgress, setKaijuProgress] = useState<Record<string, KaijuProgress>>({
    'fire-dino': { level: 1, exp: 0 },
  });
  const [expOrbs, setExpOrbs] = useState<number>(3);
  const [partnerKaijuId, setPartnerKaijuId] = useState<string | null>('fire-dino');
  const [starBalls, setStarBalls] = useState<number>(2); // 初回から2個持っていてすぐ集まるワクワク感！
  const [questTimeFilter, setQuestTimeFilter] = useState<'morning' | 'night' | 'all'>(() => {
    if (typeof window !== 'undefined') {
      const hour = new Date().getHours();
      return hour < 14 ? 'morning' : 'night';
    }
    return 'morning';
  });
  const [rewardedMorningBonus, setRewardedMorningBonus] = useState<boolean>(false);
  const [rewardedNightBonus, setRewardedNightBonus] = useState<boolean>(false);
  const [showShenronModal, setShowShenronModal] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // ドラクエ風レベルアップトースト通知（クエスト達成であいぼうがレベルアップした時など）
  const [dqToastMessages, setDqToastMessages] = useState<string[] | null>(null);

  // 召喚タブの選択ステート
  const [summonCategory, setSummonCategory] = useState<CreatureCategory>('kaiju');
  const [selectedElement, setSelectedElement] = useState<ElementId>('fire');
  const [selectedType, setSelectedType] = useState<KaijuTypeId>('dino');
  const [isHatching, setIsHatching] = useState<boolean>(false);
  const [summonedKaiju, setSummonedKaiju] = useState<{
    kaiju: KaijuData;
    isNew: boolean;
    powerUpLevel?: number;
  } | null>(null);

  // 図鑑タブの選択・フィルターステート
  const [zukanCategoryFilter, setZukanCategoryFilter] = useState<'all' | CreatureCategory>('all');
  const [zukanFilter, setZukanFilter] = useState<'all' | ElementId>('all');
  const [selectedZukanKaiju, setSelectedZukanKaiju] = useState<KaijuData | null>(null);

  // 初回マウント時に localStorage から読み込み
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<SavedAppState>;
          if (typeof parsed.energy === 'number') setEnergy(parsed.energy);
          if (Array.isArray(parsed.completedQuests)) {
            const migrated = parsed.completedQuests.map((q) =>
              q === 'teeth' ? 'morning-teeth' : q
            );
            setCompletedQuests(migrated);
          }

          const savedRecruitedBosses: string[] = Array.isArray(parsed.recruitedBossKaijuIds)
            ? parsed.recruitedBossKaijuIds
            : [];
          setRecruitedBossKaijuIds(savedRecruitedBosses);

          const rawUnlocked: string[] =
            Array.isArray(parsed.unlockedKaijuIds) && parsed.unlockedKaijuIds.length > 0
              ? parsed.unlockedKaijuIds
              : ['fire-dino'];
          // 大魔王（-dq-）は対戦ボス討伐でのみ仲間にできる特別な怪獣。
          // ガチャ等で誤って解放された大魔王はリセットし、対戦で正式に仲間にした大魔王のみ解放維持する。
          const loadedUnlocked = Array.from(
            new Set(
              rawUnlocked
                .map((id) =>
                  id === 'thunder-pkmn-pikachu' ? 'thunder-pkmn-miraidon' : id
                )
                .filter((id) => !id.includes('-dq-') || savedRecruitedBosses.includes(id))
            )
          );
          setUnlockedKaijuIds(loadedUnlocked.length > 0 ? loadedUnlocked : ['fire-dino']);

          if (typeof parsed.soundEnabled === 'boolean') setSoundEnabled(parsed.soundEnabled);

          // kaijuProgress の初期化・補完（旧ID移行対応）
          const loadedProgress: Record<string, KaijuProgress> = {
            ...(parsed.kaijuProgress || {}),
          };
          if (loadedProgress['thunder-pkmn-pikachu'] && !loadedProgress['thunder-pkmn-miraidon']) {
            loadedProgress['thunder-pkmn-miraidon'] = loadedProgress['thunder-pkmn-pikachu'];
          }
          loadedUnlocked.forEach((id) => {
            if (!loadedProgress[id]) {
              loadedProgress[id] = { level: 1, exp: 0 };
            }
          });
          setKaijuProgress(loadedProgress);

          if (typeof parsed.expOrbs === 'number') {
            setExpOrbs(parsed.expOrbs);
          } else {
            setExpOrbs(3);
          }

          const candidatePartner =
            parsed.partnerKaijuId === 'thunder-pkmn-pikachu'
              ? 'thunder-pkmn-miraidon'
              : parsed.partnerKaijuId;
          if (
            candidatePartner &&
            loadedUnlocked.includes(candidatePartner) &&
            KAIJU_LIST.some((k) => k.id === candidatePartner)
          ) {
            setPartnerKaijuId(candidatePartner);
          } else {
            setPartnerKaijuId(loadedUnlocked[0] || 'fire-dino');
          }

          if (typeof parsed.starBalls === 'number') setStarBalls(parsed.starBalls);
          if (typeof parsed.rewardedMorningBonus === 'boolean') {
            setRewardedMorningBonus(parsed.rewardedMorningBonus);
          }
          if (typeof parsed.rewardedNightBonus === 'boolean') {
            setRewardedNightBonus(parsed.rewardedNightBonus);
          }
        }
      } catch {
        // ignore localStorage read errors
      } finally {
        setIsHydrated(true);
      }
    });
  }, []);

  // ステート変更時に localStorage へ自動保存
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToSave: SavedAppState = {
        energy,
        completedQuests,
        unlockedKaijuIds,
        soundEnabled,
        kaijuProgress,
        expOrbs,
        partnerKaijuId,
        starBalls,
        rewardedMorningBonus,
        rewardedNightBonus,
        recruitedBossKaijuIds,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore localStorage write errors
    }
  }, [
    energy,
    completedQuests,
    unlockedKaijuIds,
    soundEnabled,
    kaijuProgress,
    expOrbs,
    partnerKaijuId,
    starBalls,
    rewardedMorningBonus,
    rewardedNightBonus,
    recruitedBossKaijuIds,
    isHydrated,
  ]);

  // 指定した怪獣に経験値を加算し、100ごとにレベルアップさせる共通関数（Lv.10 MAX）
  const addExpToKaiju = (
    kaijuId: string,
    expAmount: number,
    options?: { showToast?: boolean }
  ): { leveledUp: boolean; newLevel: number; evolved: boolean } => {
    const targetKaiju = KAIJU_LIST.find((k) => k.id === kaijuId) || KAIJU_LIST[0];
    const currentProg = kaijuProgress[kaijuId] || { level: 1, exp: 0 };
    const oldStats = getKaijuStats(targetKaiju, currentProg);

    if (currentProg.level >= MAX_KAIJU_LEVEL) {
      return { leveledUp: false, newLevel: MAX_KAIJU_LEVEL, evolved: false };
    }

    let nextLevel = currentProg.level;
    let nextExp = currentProg.exp + expAmount;

    while (nextExp >= 100 && nextLevel < MAX_KAIJU_LEVEL) {
      nextExp -= 100;
      nextLevel += 1;
    }

    if (nextLevel >= MAX_KAIJU_LEVEL) {
      nextExp = 100;
    }

    const nextProg: KaijuProgress = { level: nextLevel, exp: nextExp };
    const nextStats = getKaijuStats(targetKaiju, nextProg);
    const leveledUp = nextLevel > currentProg.level;
    const evolved = nextStats.stage > oldStats.stage;
    const reachedMax = nextLevel >= MAX_KAIJU_LEVEL && currentProg.level < MAX_KAIJU_LEVEL;

    setKaijuProgress((prev) => ({
      ...prev,
      [kaijuId]: nextProg,
    }));

    if (leveledUp && options?.showToast) {
      const msgs: string[] = [
        `🎺 あいぼうの ${oldStats.displayName}は レベル ${nextLevel} に あがった！`,
      ];
      const newSkill = nextStats.allSkills.find((s) => s.unlockLevel === nextLevel);
      if (newSkill) {
        msgs.push(`✨ あたらしい わざ『${newSkill.name}』を おぼえた！`);
      }
      if (reachedMax) {
        msgs.push(`👑 ついに レベルMAX（Lv.10）！！ 『${nextStats.displayName}』の 究極完全体になったぞーーっ！！`);
        playYoutuberAirhornSound();
        playEvolutionSound();
      } else if (evolved) {
        msgs.push(`🌟 『${nextStats.displayName}』に しんかしたぞ！！`);
        playEvolutionSound();
      } else {
        playLevelUpSound();
      }
      setDqToastMessages(msgs);
    }

    return { leveledUp, newLevel: nextLevel, evolved };
  };

  // ワンタップ「🌟けいけんち玉でレベルアップ！」ハンドラ（1個でEXP+50、2個で1Lvアップ）
  const handleUseExpOrb = (kaijuId: string) => {
    if (expOrbs <= 0) return;
    const currentProg = kaijuProgress[kaijuId] || { level: 1, exp: 0 };
    if (currentProg.level >= MAX_KAIJU_LEVEL) {
      playTapSound(320);
      speakJapanese(
        'この なかまは もう レベルMAX（Lv.10）の 究極キングだよ！ほかの なかまを そだててね！',
        soundEnabled
      );
      return;
    }
    setExpOrbs((prev) => Math.max(0, prev - 1));
    addExpToKaiju(kaijuId, 50, { showToast: true });
  };

  // タブ切り替え処理
  const handleSelectTab = (tab: ActiveTab) => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    playTapSound(580);
    setActiveTab(tab);
    setSummonedKaiju(null);
    setSelectedZukanKaiju(null);

    if (tab === 'quest') {
      playBeatboxIntroSound();
      speakJapanese(
        'ブンブンハローかいじゅうクエスト！どうもヒカキンです！できたものをタップしてね！レッツゴー！',
        soundEnabled
      );
    } else if (tab === 'summon') {
      playBeatboxIntroSound();
      if (energy >= 3) {
        if (summonCategory === 'insect') {
          speakJapanese(
            'ブンブン！こんちゅう つかまえるタイム！クヌギの木にしゅうごうだ！いくぞー！',
            soundEnabled
          );
        } else {
          speakJapanese(
            'ブンブン！かいじゅうしょうかんタイム！すきなわざとタイプをえらんでね！いくぞー！',
            soundEnabled
          );
        }
      } else {
        speakJapanese(
          `あと ${3 - energy}こ エネルギーをためると ${
            summonCategory === 'insect' ? 'こんちゅうを つかまえられるよ' : 'しょうかんできるよ'
          }！いっしょにがんばろう！`,
          soundEnabled
        );
      }
    } else if (tab === 'zukan') {
      speakJapanese(
        `かいじゅうずかん！いま ${unlockedKaijuIds.length}たい あつまったよ！やばいね！神ってるー！`,
        soundEnabled
      );
    } else if (tab === 'quiz') {
      playBeatboxIntroSound();
      speakJapanese(
        'はかせの 3たくクイズたいかい！全問せいかいして ほし玉を ゲットしよう！',
        soundEnabled
      );
    } else if (tab === 'battle') {
      playBeatboxIntroSound();
      speakJapanese(
        'ふたりで かいじゅうバトル！じょうくんと パパで 力をあわせて たたかおう！レッツゴー！',
        soundEnabled
      );
    }
  };

  // ① クエストカードをタップしたとき
  const handleQuestTap = (quest: QuestItem) => {
    const isAlreadyDone = completedQuests.includes(quest.id);

    if (isAlreadyDone) {
      playTapSound(680);
      speakJapanese(`${quest.shortSpeechName}は もうバッチリクリアしてるよ！さすがだね！`, soundEnabled);
      return;
    }

    const nextCompleted = [...completedQuests, quest.id];
    const nextEnergy = energy + 1;

    setCompletedQuests(nextCompleted);
    setEnergy(nextEnergy);
    setExpOrbs((prev) => prev + 1);

    // ☀️朝のクエスト(7個) または 🌙夜のクエスト(8個) コンプリートボーナス判定！
    const morningQuestIds = QUEST_LIST.filter((q) => q.timeOfDay === 'morning').map((q) => q.id);
    const nightQuestIds = QUEST_LIST.filter((q) => q.timeOfDay === 'night').map((q) => q.id);
    const isAllMorningDone = morningQuestIds.every((id) => nextCompleted.includes(id));
    const isAllNightDone = nightQuestIds.every((id) => nextCompleted.includes(id));

    let gotBonusStarBall = false;
    if (isAllMorningDone && !rewardedMorningBonus) {
      setRewardedMorningBonus(true);
      setStarBalls((prev) => prev + 1);
      setExpOrbs((prev) => prev + 2);
      gotBonusStarBall = true;
    } else if (isAllNightDone && !rewardedNightBonus) {
      setRewardedNightBonus(true);
      setStarBalls((prev) => prev + 1);
      setExpOrbs((prev) => prev + 2);
      gotBonusStarBall = true;
    }

    // あいぼう怪獣に経験値 +20（1日15クエストで約3レベルアップ！）
    const activePartnerId = partnerKaijuId || unlockedKaijuIds[0] || 'fire-dino';
    const partnerKaiju = KAIJU_LIST.find((k) => k.id === activePartnerId) || KAIJU_LIST[0];
    const expResult = addExpToKaiju(partnerKaiju.id, 20, { showToast: true });

    if (!expResult.leveledUp) {
      playQuestClearSound();
    }
    fireQuestConfetti();

    if (gotBonusStarBall) {
      playYoutuberAirhornSound();
      setDqToastMessages((prev) => [
        ...(prev || []),
        '🎁 コンプリートたからばこ！🟠ほし玉 ＋1こ ＆ 🌟けいけんち玉 ＋2こ ゲット！！',
      ]);
    }

    if (expResult.leveledUp) {
      const updatedPartnerStats = getKaijuStats(partnerKaiju, {
        level: expResult.newLevel,
        exp: 0,
      });
      speakJapanese(
        `キターーー！${quest.shortSpeechName} クリア！さらに、あいぼうの ${updatedPartnerStats.displayName} が レベル ${expResult.newLevel} に レベルアップしたよ！やばすぎるー！`,
        soundEnabled
      );
    } else if (gotBonusStarBall) {
      speakJapanese(
        `キターーー！ぜんぶクリアで たからばこ オープン！ほし玉と けいけんち玉を ゲットしたぞー！`,
        soundEnabled
      );
    } else if (nextEnergy >= 3) {
      speakJapanese(
        `キターーー！${quest.shortSpeechName} クリア！エネルギーがまんたんになったよ！けいけんち玉も ゲット！`,
        soundEnabled
      );
    } else {
      speakJapanese(
        `やったー！${quest.shortSpeechName} クリア！エネルギーと けいけんち玉を ゲットしたよ！`,
        soundEnabled
      );
    }
  };

  // 日付リセット（スタンプを戻す）
  const handleResetDailyQuests = () => {
    playTapSound(420);
    setCompletedQuests([]);
    setRewardedMorningBonus(false);
    setRewardedNightBonus(false);
    setDqToastMessages(null);
    speakJapanese(
      'ブンブン！あたらしい1にちのスタート！きょうもクエストがんばろう！レッツゴー！',
      soundEnabled
    );
  };

  // おためしチャージ（エネルギー +3 ＆ 🌟けいけんち玉 +3 ＆ 🟠ほし玉 +2）
  const handleTestCharge = () => {
    playQuestClearSound();
    fireQuestConfetti();
    setEnergy((prev) => prev + 3);
    setExpOrbs((prev) => prev + 3);
    setStarBalls((prev) => prev + 2);
    speakJapanese(
      'キターーー！おためしチャージ！エネルギーと けいけんち玉と ほし玉を ゲットしたよ！やばすぎるー！',
      soundEnabled
    );
  };

  // ② 怪獣を召喚する！ボタン
  const handleSummonKaiju = () => {
    if (isHatching) return;

    if (energy < 3) {
      playTapSound(320);
      speakJapanese(
        `おっとー！エネルギーがあと ${3 - energy}こ たりないよ！クエストをクリアするか、おためしチャージをおしてね！`,
        soundEnabled
      );
      return;
    }

    // エネルギーを3消費して孵化演出開始
    setEnergy((prev) => Math.max(0, prev - 3));
    setIsHatching(true);
    setSummonedKaiju(null);
    playEggChargeSound();
    if (summonCategory === 'insect') {
      speakJapanese(
        'うおおおー！クヌギの木が ゆれてるぞ！なにがでてくるかな！？ドキドキするねー！',
        soundEnabled
      );
    } else {
      speakJapanese(
        'うおおおー！タマゴがひかってゆれてるぞ！なにがでるかな！？ドキドキするねー！',
        soundEnabled
      );
    }

    const targetKaiju = findKaijuForSummon(
      selectedElement,
      selectedType,
      unlockedKaijuIds,
      summonCategory
    );
    const elMeta = getElementMeta(selectedElement);

    setTimeout(() => {
      const isNew = !unlockedKaijuIds.includes(targetKaiju.id);
      let powerUpLevel: number | undefined = undefined;

      if (isNew) {
        setUnlockedKaijuIds((prev) => [...prev, targetKaiju.id]);
        setKaijuProgress((prev) => ({
          ...prev,
          [targetKaiju.id]: prev[targetKaiju.id] || { level: 1, exp: 0 },
        }));
      } else {
        // すでに持っている怪獣が召喚された場合は「限界突破ボーナス」でレベル +1！（Lv.10 MAX時はけいけんち玉+3個）
        const currentProg = kaijuProgress[targetKaiju.id] || { level: 1, exp: 0 };
        if (currentProg.level >= MAX_KAIJU_LEVEL) {
          setExpOrbs((prev) => prev + 3);
          powerUpLevel = MAX_KAIJU_LEVEL;
        } else {
          const nextLv = Math.min(MAX_KAIJU_LEVEL, currentProg.level + 1);
          powerUpLevel = nextLv;
          setKaijuProgress((prev) => ({
            ...prev,
            [targetKaiju.id]: { level: nextLv, exp: currentProg.exp },
          }));
        }
      }

      setIsHatching(false);
      setSummonedKaiju({ kaiju: targetKaiju, isNew, powerUpLevel });

      playSummonExplosionAndFanfare();
      playYoutuberAirhornSound();
      fireSummonConfetti(elMeta.confettiColors);

      const currentStats = getKaijuStats(
        targetKaiju,
        powerUpLevel ? { level: powerUpLevel, exp: 0 } : { level: 1, exp: 0 }
      );

      if (isNew) {
        if (targetKaiju.category === 'insect') {
          speakJapanese(
            `キターーー！ほんものの こんちゅう、${currentStats.displayName}を つかまえたぞ！${targetKaiju.specialMove}！やばいねー！`,
            soundEnabled
          );
        } else {
          speakJapanese(
            `キターーー！あたらしい かいじゅう、${currentStats.displayName}のとうじょうだ！ひっさつわざは ${targetKaiju.specialMove}！これマジでやばいねー！`,
            soundEnabled
          );
        }
      } else {
        if (targetKaiju.category === 'insect') {
          speakJapanese(
            `キターーー！${currentStats.displayName}の こたいレベルが ${powerUpLevel} に あがったぞ！つよすぎるー！`,
            soundEnabled
          );
        } else {
          speakJapanese(
            `キターーー！パワーアップしょうかん！${currentStats.displayName}の レベルが ${powerUpLevel} に あがったぞ！つよすぎるー！`,
            soundEnabled
          );
        }
      }
    }, 1550);
  };

  // ③ 図鑑のカードをタップしたとき
  const handleZukanCardTap = (kaiju: KaijuData, isUnlocked: boolean) => {
    const elMeta = getElementMeta(kaiju.element);
    const typeMeta = getTypeMeta(kaiju.type);

    if (!isUnlocked) {
      playTapSound(380);
      if (kaiju.id.includes('-dq-')) {
        speakJapanese(
          `おっと！これは 伝説の大魔王だよ！バトル画面で たおすと、まれに おきあがって なかまに なるぞ！レッツゴー！`,
          soundEnabled
        );
      } else {
        speakJapanese(
          `おっと！まだみつかっていない かいじゅうだよ！${elMeta.label} と ${typeMeta.label} をえらんで しょうかんしてみよう！レッツゴー！`,
          soundEnabled
        );
      }
      return;
    }

    const st = getKaijuStats(kaiju, kaijuProgress[kaiju.id]);
    setSelectedZukanKaiju(kaiju);
    playSpecialAttackSound();
    fireSummonConfetti(elMeta.confettiColors);
    speakJapanese(
      `キターーー！レベル ${st.level}、${st.displayName}！けいけんち玉で レベルアップや しんかも できるよ！`,
      soundEnabled
    );
  };

  // バトル終了時のごほうび付与（VS対戦・親子タッグボス討伐・大魔王スカウト対応）
  const handleBattleReward = (
    p1Id: string,
    p2Id?: string,
    rewardOrbs: number = 2,
    rewardExp: number = 30,
    isBossWin: boolean = false,
    recruitedBossKaijuId?: string
  ) => {
    setExpOrbs((prev) => prev + rewardOrbs);
    if (isBossWin) {
      setStarBalls((prev) => prev + 1);
    }
    if (recruitedBossKaijuId) {
      setRecruitedBossKaijuIds((prev) =>
        prev.includes(recruitedBossKaijuId) ? prev : [...prev, recruitedBossKaijuId]
      );
      setUnlockedKaijuIds((prev) =>
        prev.includes(recruitedBossKaijuId) ? prev : [...prev, recruitedBossKaijuId]
      );
      setKaijuProgress((prev) => {
        const existing = prev[recruitedBossKaijuId];
        if (existing) {
          return {
            ...prev,
            [recruitedBossKaijuId]: {
              level: Math.min(MAX_KAIJU_LEVEL, existing.level + 1),
              exp: existing.exp,
            },
          };
        }
        return {
          ...prev,
          [recruitedBossKaijuId]: { level: 3, exp: 0 },
        };
      });
    }
    addExpToKaiju(p1Id, rewardExp, { showToast: true });
    if (p2Id && p2Id !== p1Id) {
      addExpToKaiju(p2Id, rewardExp, { showToast: false });
    }
  };

  // 🐉 7つのほし玉（神龍のお願い）を叶えるハンドラ
  const handleGrantShenronWish = (wishType: 'new-kaiju' | 'level-plus-3' | 'orbs-10') => {
    if (starBalls < 7) return;
    setStarBalls((prev) => Math.max(0, prev - 7));
    setShowShenronModal(false);
    playSummonExplosionAndFanfare();
    playYoutuberAirhornSound();
    fireSummonConfetti(['#facc15', '#fb923c', '#34d399', '#38bdf8']);

    const activePartnerId = partnerKaijuId || unlockedKaijuIds[0] || 'fire-dino';

    if (wishType === 'new-kaiju') {
      const lockedPool = KAIJU_LIST.filter(
        (k) => !unlockedKaijuIds.includes(k.id) && !k.id.includes('-dq-')
      );
      if (lockedPool.length > 0) {
        const picked = lockedPool[Math.floor(Math.random() * lockedPool.length)];
        setUnlockedKaijuIds((prev) => [...prev, picked.id]);
        setKaijuProgress((prev) => ({
          ...prev,
          [picked.id]: { level: 3, exp: 0 }, // 神龍ボーナスで最初からLv.3で加入！
        }));
        setSelectedZukanKaiju(picked);
        speakJapanese(
          `ねがいを かなえてやろう！あたらしい なかま、${picked.name} が レベル3で なかまになったぞー！`,
          soundEnabled
        );
      } else {
        setExpOrbs((prev) => prev + 15);
        speakJapanese(
          'すべての なかまが そろっているから、けいけんち玉 15こを プレゼントするぞ！',
          soundEnabled
        );
      }
    } else if (wishType === 'level-plus-3') {
      addExpToKaiju(activePartnerId, 300, { showToast: true });
      speakJapanese(
        'ねがいを かなえてやろう！あいぼうの レベルが いっきに 3 あがって パワーアップしたぞーーっ！',
        soundEnabled
      );
    } else {
      setExpOrbs((prev) => prev + 10);
      setEnergy((prev) => prev + 3);
      setDqToastMessages([
        '🐉 神龍のおねがい達成！🌟けいけんち玉 ＋10こ ＆ ⚡エネルギー ＋3 ゲット！！',
      ]);
      speakJapanese(
        'ねがいを かなえてやろう！けいけんち玉 10こと エネルギー 3こを プレゼントだ！',
        soundEnabled
      );
    }
  };

  const canSummon = energy >= 3;
  const meterSlots = Math.min(3, energy);

  // プレイヤーの合計レベル＆勇者ランク称号
  const totalKaijuLevelSum = Object.values(kaijuProgress).reduce(
    (sum, p) => sum + (p?.level || 1),
    0
  );
  const heroRank = getHeroRank(unlockedKaijuIds.length, totalKaijuLevelSum);

  // クエストの朝・夜フィルターリスト
  const filteredQuestList =
    questTimeFilter === 'all'
      ? QUEST_LIST
      : QUEST_LIST.filter((q) => q.timeOfDay === questTimeFilter);

  const morningQuests = QUEST_LIST.filter((q) => q.timeOfDay === 'morning');
  const nightQuests = QUEST_LIST.filter((q) => q.timeOfDay === 'night');
  const morningDoneCount = morningQuests.filter((q) => completedQuests.includes(q.id)).length;
  const nightDoneCount = nightQuests.filter((q) => completedQuests.includes(q.id)).length;
  const categoryFilteredZukanList =
    zukanCategoryFilter === 'all'
      ? KAIJU_LIST
      : KAIJU_LIST.filter((k) => (k.category || 'kaiju') === zukanCategoryFilter);

  const filteredZukanList =
    zukanFilter === 'all'
      ? categoryFilteredZukanList
      : categoryFilteredZukanList.filter((k) => k.element === zukanFilter);

  // 現在のあいぼう怪獣データ
  const activePartnerId = partnerKaijuId || unlockedKaijuIds[0] || 'fire-dino';
  const partnerKaiju = KAIJU_LIST.find((k) => k.id === activePartnerId) || KAIJU_LIST[0];
  const partnerStats = getKaijuStats(partnerKaiju, kaijuProgress[partnerKaiju.id]);

  // 選択中の属性×タイプに未解放の怪獣がいるかチェック（大魔王は対戦限定のため除外）
  const hasLockedCandidateForSelection = KAIJU_LIST.some(
    (k) =>
      (k.category || 'kaiju') === summonCategory &&
      !k.id.includes('-dq-') &&
      k.element === selectedElement &&
      k.type === selectedType &&
      !unlockedKaijuIds.includes(k.id)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-28">
      {/* ==================== コンパクト・トップヘッダー ==================== */}
      <header className="sticky top-0 z-30 h-14 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-3 sm:px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="text-2xl" aria-hidden="true">
            {heroRank.badge}
          </span>
          <div className="leading-tight">
            <div className="text-[10px] font-black text-amber-300">{heroRank.title}</div>
            <div className="text-sm sm:text-base font-black tracking-tight text-white">
              かいじゅうクエスト
            </div>
          </div>
        </div>

        {/* 中央：現在のエネルギー＆けいけんち玉＆ほし玉 */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-black text-slate-200 tabular-nums">
          <span className="bg-slate-800 px-2 py-1 rounded-lg border border-amber-400/40 text-amber-300">
            ⚡ {energy}
          </span>
          <span className="bg-slate-800 px-2 py-1 rounded-lg border border-yellow-300/40 text-yellow-300">
            🌟 {expOrbs}
          </span>
          <span className="bg-slate-800 px-2 py-1 rounded-lg border border-orange-400/50 text-orange-300">
            🟠 {starBalls}/7
          </span>
        </div>

        {/* 右：音声読み上げON/OFFボタン（最小44px以上） */}
        <button
          type="button"
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            playTapSound(next ? 660 : 400);
            if (next) {
              speakJapanese('ブンブンハロー！こえがでるようになったよ！', true);
            }
          }}
          className={`min-h-[44px] px-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            soundEnabled
              ? 'bg-amber-400 text-slate-950 border-white'
              : 'bg-slate-800 text-slate-300 border-white/20'
          }`}
          aria-label={soundEnabled ? '音声読み上げをオフにする' : '音声読み上げをオンにする'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'こえ ON' : 'こえ OFF'}</span>
        </button>
      </header>

      {/* ==================== メインコンテンツコンテナ ==================== */}
      <main className="max-w-5xl mx-auto px-4 pt-4 space-y-4">
        {/* ドラクエ風レベルアップ通知バナー（クエスト達成等でレベルアップしたとき表示） */}
        {dqToastMessages && (
          <div className="dq-window p-4 text-white flex items-center justify-between gap-3 animate-bounce">
            <div className="space-y-1">
              {dqToastMessages.map((msg, i) => (
                <p key={i} className="text-sm sm:text-base font-black text-yellow-300">
                  {msg}
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDqToastMessages(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-black text-white border border-white/30 shrink-0 cursor-pointer"
            >
              OK
            </button>
          </div>
        )}

        {/* ============================================================
            TAB 1: ⚡ クエストタブ（毎日の習慣 ＋ あいぼう怪獣育成）
           ============================================================ */}
        {activeTab === 'quest' && (
          <section className="space-y-5">
            {/* 上部2カラム：左にしょうかんエネルギーメーター、右にあいぼう怪獣ステータス */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* しょうかんエネルギーメーター（0〜3個） */}
              <div
                className={`lg:col-span-7 rounded-3xl p-4 sm:p-5 border-2 transition-all flex flex-col justify-between ${
                  canSummon
                    ? 'bg-gradient-to-r from-amber-500/30 via-orange-500/25 to-yellow-500/30 border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.35)]'
                    : 'bg-slate-900/90 border-white/15'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-black text-amber-300">
                        ⚡ しょうかんエネルギー
                      </span>
                      <span className="text-sm font-black text-white/80 tabular-nums">
                        ({energy} / 3)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-300 mt-0.5">
                      {canSummon
                        ? 'やったー！エネルギーまんたん！かいじゅうを しょうかん しよう！'
                        : `あと ${3 - meterSlots}こ クエストを クリアすると かいじゅうが でるよ！`}
                    </p>
                  </div>

                  {/* 3つの特大エネルギー稲妻アイコン */}
                  <div className="flex items-center justify-center gap-3 py-1">
                    {[0, 1, 2].map((slotIdx) => {
                      const isFilled = slotIdx < meterSlots;
                      return (
                        <div
                          key={slotIdx}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                            isFilled
                              ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 border-white scale-105 shadow-[0_0_22px_rgba(250,204,21,0.9)]'
                              : 'bg-slate-950/80 border-slate-700 opacity-50'
                          }`}
                        >
                          <Zap
                            className={`w-9 h-9 transition-transform duration-300 ${
                              isFilled
                                ? 'text-slate-950 fill-slate-950 scale-110'
                                : 'text-slate-600'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3つ貯まったときの特大召喚ショートカットボタン */}
                {canSummon && (
                  <button
                    type="button"
                    onClick={() => handleSelectTab('summon')}
                    className="mt-4 w-full min-h-[60px] rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-[0_6px_0_#b45309] border-2 border-white transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span className="text-2xl">🥚</span>
                    <span>いますぐ かいじゅうを しょうかんする！</span>
                  </button>
                )}
              </div>

              {/* 🤝 あいぼう怪獣ミニステータスボックス（クエストクリアで一緒にレベルアップ！） */}
              <button
                type="button"
                onClick={() => {
                  playTapSound(600);
                  setSelectedZukanKaiju(partnerKaiju);
                }}
                className="lg:col-span-5 dq-window p-4 text-left text-white flex items-center gap-3.5 hover:border-yellow-300 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-slate-900/90 rounded-2xl border border-white/20 p-1">
                  <KaijuSvgIllustration
                    element={partnerKaiju.element}
                    type={partnerKaiju.type}
                    kaijuId={partnerKaiju.id}
                    evolutionStage={partnerStats.stage}
                    category={partnerKaiju.category}
                    insectStyle={partnerKaiju.insectStyle}
                    realColors={partnerKaiju.realColors}
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-400/50">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>あいぼう</span>
                    </span>
                    <span className="text-sm font-black text-yellow-300 tabular-nums">
                      Lv.{partnerStats.level} / {MAX_KAIJU_LEVEL}
                      {partnerStats.level >= MAX_KAIJU_LEVEL && ' 👑MAX'}
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-white truncate">
                    {partnerStats.displayName}
                  </div>
                  <div className="text-[11px] font-bold text-slate-300">
                    {partnerStats.level >= MAX_KAIJU_LEVEL
                      ? '👑 レベルMAXの 究極キング！！'
                      : 'クエストクリアで けいけんち＋20！'}
                  </div>
                  {/* EXPバー */}
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/25">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
                      style={{ width: `${Math.min(100, partnerStats.exp)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-black text-amber-300">
                    <span>🌟 けいけんち玉: {expOrbs}こ</span>
                    <span className="underline">タップで そだてる▶</span>
                  </div>
                </div>
              </button>
            </div>

            {/* 🟠 7つのほし玉（神龍のお願い）コレクションバー */}
            <div
              className={`rounded-3xl p-3.5 sm:p-4 border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                starBalls >= 7
                  ? 'bg-gradient-to-r from-emerald-600/40 via-amber-500/35 to-orange-500/40 border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.5)]'
                  : 'bg-slate-900/90 border-white/15'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🐉</span>
                <div>
                  <div className="text-xs sm:text-sm font-black text-orange-300">
                    7つの ほし玉（シェンロンのおねがい）: {starBalls} / 7こ
                  </div>
                  <div className="text-[11px] font-bold text-slate-300">
                    {starBalls >= 7
                      ? '✨ 7つそろったぞ！黄金の神龍（シェンロン）を よびだそう！！'
                      : 'あさ・よるのコンプリートや、クイズ・ボス討伐で 🟠ほし玉が もらえるよ！'}
                  </div>
                </div>
              </div>

              {/* 一星球〜七星球アイコン */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                  const filled = num <= starBalls;
                  return (
                    <div
                      key={num}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all ${
                        filled
                          ? 'bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 border-yellow-200 text-red-950 shadow-[0_0_12px_rgba(251,146,60,0.9)] scale-105'
                          : 'bg-slate-950 border-slate-700 text-slate-600 opacity-45'
                      }`}
                    >
                      {'★'.repeat(Math.min(num, 3))}
                    </div>
                  );
                })}
              </div>

              {starBalls >= 7 && (
                <button
                  type="button"
                  onClick={() => {
                    playShenronSummonSound();
                    setShowShenronModal(true);
                    speakJapanese(
                      'いでよ シェンロン！そして ねがいを かなえたまえーっ！！さあ、3つの おねがいから 1つ えらんでね！',
                      soundEnabled
                    );
                  }}
                  className="w-full sm:w-auto min-h-[52px] px-5 rounded-2xl bg-gradient-to-r from-emerald-400 via-yellow-300 to-amber-400 text-slate-950 font-black text-sm sm:text-base border-2 border-white shadow-[0_5px_0_#065f46] hover:scale-105 active:scale-95 transition-transform cursor-pointer whitespace-nowrap shrink-0"
                >
                  🐉 いでよ神龍！おねがいをする！
                </button>
              )}
            </div>

            {/* ☀️ あさのクエスト ／ 🌙 よるのクエスト 切り替えタブ */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-white/15">
              <button
                type="button"
                onClick={() => {
                  playTapSound(520);
                  setQuestTimeFilter('morning');
                  speakJapanese('あさの クエスト！ぜんぶクリアで たからばこだ！', soundEnabled);
                }}
                className={`min-h-[48px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  questTimeFilter === 'morning'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-2 border-white shadow-lg'
                    : 'bg-slate-950/70 text-slate-300 hover:text-white'
                }`}
              >
                <span>☀️ あさ ({morningDoneCount}/{morningQuests.length})</span>
                {rewardedMorningBonus && <span>🎁✨</span>}
              </button>

              <button
                type="button"
                onClick={() => {
                  playTapSound(520);
                  setQuestTimeFilter('night');
                  speakJapanese('よるの クエスト！ぜんぶクリアで たからばこだ！', soundEnabled);
                }}
                className={`min-h-[48px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  questTimeFilter === 'night'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-2 border-white shadow-lg'
                    : 'bg-slate-950/70 text-slate-300 hover:text-white'
                }`}
              >
                <span>🌙 よる ({nightDoneCount}/{nightQuests.length})</span>
                {rewardedNightBonus && <span>🎁✨</span>}
              </button>

              <button
                type="button"
                onClick={() => {
                  playTapSound(520);
                  setQuestTimeFilter('all');
                }}
                className={`min-h-[48px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  questTimeFilter === 'all'
                    ? 'bg-white text-slate-950 border-2 border-amber-300 shadow-lg'
                    : 'bg-slate-950/70 text-slate-300 hover:text-white'
                }`}
              >
                <span>🌟 すべて ({completedQuests.length}/{QUEST_LIST.length})</span>
              </button>
            </div>

            {/* お支度クエストカードグリッド（スマホ1〜2列、PC3列） */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredQuestList.map((quest) => {
                const isDone = completedQuests.includes(quest.id);
                return (
                  <button
                    key={quest.id}
                    type="button"
                    onClick={() => handleQuestTap(quest)}
                    className={`relative min-h-[108px] w-full rounded-3xl p-4 text-left flex items-center gap-4 border-2 transition-all duration-200 active:scale-95 cursor-pointer overflow-hidden ${
                      isDone
                        ? 'bg-gradient-to-br from-amber-500/30 to-emerald-500/20 border-yellow-300 shadow-[0_0_24px_rgba(250,204,21,0.3)]'
                        : `bg-gradient-to-br ${quest.cardBg} ${quest.borderAccent} hover:border-white/80 shadow-lg`
                    }`}
                  >
                    {/* 特大イラスト絵文字アイコン */}
                    <div
                      className={`w-20 h-20 rounded-2xl ${quest.iconBg} border-2 border-white/25 flex items-center justify-center text-5xl shrink-0 shadow-inner`}
                    >
                      <span>{quest.emoji}</span>
                    </div>

                    {/* クエスト名と状態 */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-xs font-extrabold text-amber-300 mb-0.5 flex items-center gap-1">
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-emerald-300">クリア！ ⚡+1 🌟+1</span>
                          </>
                        ) : (
                          <span>タップして クリア！（あいぼうEXP+20）</span>
                        )}
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white leading-snug">
                        {quest.title}
                      </div>
                    </div>

                    {/* 達成時の特大💮スタンプ演出 */}
                    {isDone && (
                      <div className="animate-stamp absolute right-3 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-rose-600/95 border-4 border-yellow-300 shadow-xl flex flex-col items-center justify-center text-white pointer-events-none">
                        <span className="text-3xl leading-none">💮</span>
                        <span className="text-[10px] font-black tracking-tighter text-yellow-200 mt-0.5">
                          よくできました
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 親向け：画面の隅に小さく「日付リセット（スタンプを戻す）」ボタン */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 text-xs text-slate-400">
              <span>おうちのかたへ：スタンプは毎日リセットできます</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestCharge}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-amber-300 border border-amber-400/30 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>おためしチャージ（⚡+3 🌟+3）</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDailyQuests}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-300 border border-white/15 flex items-center gap-1.5 font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>日付リセット（スタンプを戻す）</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================
            TAB 2: 🥚 しょうかんタブ（怪獣クリエイト＆ダブり限界突破）
           ============================================================ */}
        {activeTab === 'summon' && (
          <section className="space-y-5">
            {/* 召喚結果カードが出ている場合 */}
            {summonedKaiju ? (
              <div className="py-2 space-y-4">
                {/* ダブり召喚でレベルアップしたときのドラクエ風お祝いバナー */}
                {summonedKaiju.powerUpLevel && (
                  <div className="max-w-md mx-auto dq-window p-3.5 text-center text-white animate-bounce">
                    <div className="text-base sm:text-lg font-black text-yellow-300">
                      ⚡ パワーアップしょうかん せいこう！！
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">
                      すでに なかまの かいじゅうだったから、限界突破で{' '}
                      <span className="text-amber-300 font-black">
                        Lv.{summonedKaiju.powerUpLevel}
                      </span>{' '}
                      に レベルアップしたぞ！
                    </p>
                  </div>
                )}

                <KaijuHeroCard
                  kaiju={summonedKaiju.kaiju}
                  soundEnabled={soundEnabled}
                  isNewUnlock={summonedKaiju.isNew}
                  progress={kaijuProgress[summonedKaiju.kaiju.id]}
                  expOrbs={expOrbs}
                  isPartner={partnerKaijuId === summonedKaiju.kaiju.id}
                  onLevelUp={handleUseExpOrb}
                  onSelectPartner={(id) => setPartnerKaijuId(id)}
                  onClose={() => {
                    playTapSound(520);
                    setSummonedKaiju(null);
                  }}
                  closeButtonLabel="つぎの しょうかんへ"
                />

                <div className="max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => handleSelectTab('zukan')}
                    className="min-h-[60px] w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-lg flex items-center justify-center gap-2 border-2 border-indigo-300 shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-6 h-6" />
                    <span>ずかんで みんなを みる！</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 1行コンパクトエネルギーバー＆テスト用チャージボタン */}
                <div className="rounded-2xl bg-slate-900/90 border border-white/15 px-3 py-2 flex items-center justify-between gap-2 shadow">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-xl border border-amber-400/50 shrink-0">
                      <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-base font-black text-amber-300 tabular-nums">
                        {energy}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">/ 3</span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-white truncate">
                      {canSummon
                        ? '⚡ エネルギーOK！しょうかんできるよ！'
                        : `あと ${3 - energy}こ エネルギーが いるよ`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestCharge}
                    className="min-h-[38px] px-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 border border-amber-400/40 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>チャージ（+3）</span>
                  </button>
                </div>

                {/* 1画面完結：縦スクロールなしでステップ1・ステップ2・タマゴ・召喚ボタンが並ぶレイアウト */}
                <div className="space-y-2.5">
                  {/* しょうかんモード切り替え（🦖 かいじゅう を しょうかん ⇄ 🪲 こんちゅう を つかまえる） */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-2xl border border-white/15">
                    <button
                      type="button"
                      onClick={() => {
                        playTapSound(500);
                        setSummonCategory('kaiju');
                        if (!['dino', 'dragon', 'robot', 'beast'].includes(selectedType)) {
                          setSelectedType('dino');
                        }
                        speakJapanese('かいじゅうしょうかんモード！', soundEnabled);
                      }}
                      className={`min-h-[50px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        summonCategory === 'kaiju'
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg border-2 border-white'
                          : 'text-slate-400 hover:text-white bg-slate-950/60'
                      }`}
                    >
                      <span className="text-xl">🦖</span>
                      <span>かいじゅう ({KAIJU_LIST.filter((k) => (k.category || 'kaiju') === 'kaiju').length}種)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playTapSound(500);
                        setSummonCategory('insect');
                        if (!['kabuto', 'kuwagata', 'hunter', 'flier'].includes(selectedType)) {
                          setSelectedType('kabuto');
                        }
                        speakJapanese('こんちゅう つかまえるモード！クヌギの木にしゅうごうだ！', soundEnabled);
                      }}
                      className={`min-h-[50px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        summonCategory === 'insect'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg border-2 border-white'
                          : 'text-slate-400 hover:text-white bg-slate-950/60'
                      }`}
                    >
                      <span className="text-xl">🪲</span>
                      <span>ほんもの昆虫 (36種)</span>
                    </button>
                  </div>

                  {/* ステップ1：属性/むしとりフィールド（横1列・4分割ボタン） */}
                  <div className="rounded-2xl bg-slate-900/90 border border-white/15 p-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                        1
                      </span>
                      <h2 className="text-xs sm:text-sm font-black text-white">
                        {summonCategory === 'insect'
                          ? 'むしとりフィールド（ばしょ）を えらぼう！'
                          : 'パワー（ぞくせい）を えらぼう！'}
                      </h2>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                      {ELEMENT_OPTIONS.map((el) => {
                        const isSelected = selectedElement === el.id;
                        const icon =
                          summonCategory === 'insect' && el.insectFieldEmoji
                            ? el.insectFieldEmoji
                            : el.emoji;
                        const labelText =
                          summonCategory === 'insect' && el.insectFieldLabel
                            ? el.insectFieldLabel
                            : el.label;
                        const speechText =
                          summonCategory === 'insect' && el.insectFieldLabel
                            ? `${el.insectFieldLabel}フィールド！`
                            : el.speechLabel;

                        return (
                          <button
                            key={el.id}
                            type="button"
                            onClick={() => {
                              playTapSound(540);
                              setSelectedElement(el.id);
                              speakJapanese(speechText, soundEnabled);
                            }}
                            className={`min-h-[64px] rounded-xl p-1 flex flex-col items-center justify-center border-2 transition-all active:scale-95 cursor-pointer ${
                              isSelected
                                ? `bg-gradient-to-r ${el.bgGradient} border-white ${el.activeRing} text-white`
                                : 'bg-slate-950/90 border-slate-700 text-slate-200 hover:border-slate-500'
                            }`}
                          >
                            <span className="text-2xl sm:text-3xl leading-none">{icon}</span>
                            <span className="text-[11px] sm:text-xs font-black mt-1 truncate">
                              {labelText}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ステップ2：タイプ（横1列・4分割ボタン） */}
                  <div className="rounded-2xl bg-slate-900/90 border border-white/15 p-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                        2
                      </span>
                      <h2 className="text-xs sm:text-sm font-black text-white">
                        {summonCategory === 'insect'
                          ? 'こんちゅうの なかまを えらぼう！'
                          : 'かいじゅうの タイプを えらぼう！'}
                      </h2>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                      {(summonCategory === 'insect' ? INSECT_TYPE_OPTIONS : KAIJU_TYPE_OPTIONS).map(
                        (tp) => {
                          const isSelected = selectedType === tp.id;
                          return (
                            <button
                              key={tp.id}
                              type="button"
                              onClick={() => {
                                playTapSound(620);
                                setSelectedType(tp.id);
                                speakJapanese(tp.speechLabel, soundEnabled);
                              }}
                              className={`min-h-[64px] rounded-xl p-1 flex flex-col items-center justify-center border-2 transition-all active:scale-95 cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-white ring-2 ring-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.7)] text-white'
                                  : 'bg-slate-950/90 border-slate-700 text-slate-200 hover:border-slate-500'
                              }`}
                            >
                              <span className="text-2xl sm:text-3xl leading-none">{tp.emoji}</span>
                              <span className="text-[11px] sm:text-xs font-black mt-1 truncate">
                                {tp.label}
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* タマゴ＆「しょうかんする！」ボタンエリア */}
                  <div className="rounded-2xl bg-slate-900/95 border-2 border-white/20 p-3 sm:p-4 flex flex-col items-center text-center relative overflow-hidden shadow-xl">
                    <div className="text-xs font-black text-amber-300 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-400/40">
                      {summonCategory === 'insect' ? (
                        <>
                          {getElementMeta(selectedElement).insectFieldEmoji ||
                            getElementMeta(selectedElement).emoji}{' '}
                          {getElementMeta(selectedElement).insectFieldLabel ||
                            getElementMeta(selectedElement).label}{' '}
                          × {getTypeMeta(selectedType).emoji} {getTypeMeta(selectedType).label}
                        </>
                      ) : (
                        <>
                          {getElementMeta(selectedElement).emoji} {getElementMeta(selectedElement).label}{' '}
                          × {getTypeMeta(selectedType).emoji} {getTypeMeta(selectedType).label}
                        </>
                      )}
                    </div>

                    {/* タマゴまたはクヌギの御神木SVG */}
                    <div className="my-2 max-h-36 sm:max-h-44 flex items-center justify-center">
                      <MonsterEggSvg
                        element={selectedElement}
                        type={selectedType}
                        isShaking={isHatching}
                        category={summonCategory}
                      />
                    </div>

                    <p className="text-xs font-extrabold text-slate-300 mb-2">
                      {isHatching
                        ? summonCategory === 'insect'
                          ? '🌳 ガサガサッ！木から なにか が でてくるぞー！！'
                          : '⚡ ガタガタッ！うまれるぞーーっ！！'
                        : hasLockedCandidateForSelection
                        ? summonCategory === 'insect'
                          ? '❓ まだ つかまえていない ほんものの昆虫 が でるぞ！'
                          : '❓ まだ みつかっていない 新種のかいじゅう が でるぞ！'
                        : summonCategory === 'insect'
                        ? '⚡ もういちど つかまえると 個体レベルが +1 あがるよ！'
                        : '⚡ もういちど しょうかんすると レベルが +1 あがるよ！'}
                    </p>

                    {/* 「しょうかんする！ / むしをつかまえる！」特大ボタン */}
                    <button
                      type="button"
                      onClick={handleSummonKaiju}
                      disabled={isHatching}
                      className={`min-h-[68px] w-full rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center gap-2.5 border-4 transition-all active:scale-95 cursor-pointer px-4 whitespace-nowrap shrink-0 ${
                        canSummon
                          ? summonCategory === 'insect'
                            ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-slate-950 border-white shadow-[0_6px_0_#065f46,0_0_30px_rgba(52,211,153,0.85)]'
                            : 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 text-slate-950 border-white shadow-[0_6px_0_#b45309,0_0_30px_rgba(250,204,21,0.85)]'
                          : 'bg-slate-800 text-slate-300 border-slate-600'
                      }`}
                    >
                      {summonCategory === 'insect' ? (
                        <span className="text-2xl">🪲</span>
                      ) : (
                        <Flame className="w-7 h-7 shrink-0 fill-current" />
                      )}
                      <span>
                        {isHatching
                          ? summonCategory === 'insect'
                            ? 'つかまえちゅう…！'
                            : 'しょうかんちゅう…！'
                          : summonCategory === 'insect'
                          ? '🌳 むしを つかまえる！'
                          : 'しょうかんする！'}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {/* ============================================================
            TAB 3: 📖 ずかんタブ（コレクション＆レベルアップ育成）
           ============================================================ */}
        {activeTab === 'zukan' && (
          <section className="space-y-5">
            {/* 図鑑ヘッダー＆コンプリート進捗メーター＆けいけんち玉残数 */}
            <div className="rounded-3xl bg-slate-900/90 border-2 border-white/15 p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>📖 大図鑑＆いくせい</span>
                </h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-yellow-300 font-black text-sm sm:text-base">
                    🌟 けいけんち玉: {expOrbs}こ
                  </span>
                  <span className="text-base sm:text-xl font-black text-amber-300 tabular-nums">
                    {
                      unlockedKaijuIds.filter((id) => {
                        if (zukanCategoryFilter === 'all') return true;
                        const k = KAIJU_LIST.find((item) => item.id === id);
                        return (k?.category || 'kaiju') === zukanCategoryFilter;
                      }).length
                    }{' '}
                    / {categoryFilteredZukanList.length} たい
                  </span>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-white/15">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (unlockedKaijuIds.filter((id) => {
                        if (zukanCategoryFilter === 'all') return true;
                        const k = KAIJU_LIST.find((item) => item.id === id);
                        return (k?.category || 'kaiju') === zukanCategoryFilter;
                      }).length /
                        Math.max(1, categoryFilteredZukanList.length)) *
                        100
                    )}%`,
                  }}
                />
              </div>

              {/* カテゴリ切り替えボタン（すべて 64種 / かいじゅう 28種 / ほんもの昆虫 36種） */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playTapSound(500);
                    setZukanCategoryFilter('all');
                  }}
                  className={`min-h-[46px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    zukanCategoryFilter === 'all'
                      ? 'bg-amber-400 text-slate-950 border-white shadow-md'
                      : 'bg-slate-950 text-slate-300 border-white/15 hover:border-slate-500'
                  }`}
                >
                  <span>🌟 すべて ({KAIJU_LIST.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTapSound(500);
                    setZukanCategoryFilter('kaiju');
                  }}
                  className={`min-h-[46px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    zukanCategoryFilter === 'kaiju'
                      ? 'bg-amber-400 text-slate-950 border-white shadow-md'
                      : 'bg-slate-950 text-slate-300 border-white/15 hover:border-slate-500'
                  }`}
                >
                  <span>🦖 かいじゅう ({KAIJU_LIST.filter((k) => (k.category || 'kaiju') === 'kaiju').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTapSound(500);
                    setZukanCategoryFilter('insect');
                  }}
                  className={`min-h-[46px] rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    zukanCategoryFilter === 'insect'
                      ? 'bg-amber-400 text-slate-950 border-white shadow-md'
                      : 'bg-slate-950 text-slate-300 border-white/15 hover:border-slate-500'
                  }`}
                >
                  <span>🪲 こんちゅう ({KAIJU_LIST.filter((k) => k.category === 'insect').length})</span>
                </button>
              </div>

              {/* 属性・フィールドフィルターボタン */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playTapSound(520);
                    setZukanFilter('all');
                  }}
                  className={`min-h-[52px] rounded-xl font-black text-xs sm:text-sm flex flex-col items-center justify-center border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    zukanFilter === 'all'
                      ? 'bg-white text-slate-950 border-white shadow-md'
                      : 'bg-slate-950 text-slate-300 border-white/15'
                  }`}
                >
                  <span className="text-lg">🌟</span>
                  <span>すべて</span>
                </button>
                {ELEMENT_OPTIONS.map((el) => {
                  const icon =
                    zukanCategoryFilter === 'insect' && el.insectFieldEmoji
                      ? el.insectFieldEmoji
                      : el.emoji;
                  const label =
                    zukanCategoryFilter === 'insect' && el.insectFieldLabel
                      ? el.insectFieldLabel
                      : el.label;

                  return (
                    <button
                      key={el.id}
                      type="button"
                      onClick={() => {
                        playTapSound(560);
                        setZukanFilter(el.id);
                      }}
                      className={`min-h-[52px] rounded-xl font-black text-xs sm:text-sm flex flex-col items-center justify-center border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        zukanFilter === el.id
                          ? `bg-gradient-to-br ${el.bgGradient} text-white border-white shadow-md`
                          : 'bg-slate-950 text-slate-300 border-white/15'
                      }`}
                    >
                      <span className="text-lg">{icon}</span>
                      <span className="truncate max-w-full px-0.5">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 怪獣・昆虫コレクション一覧グリッド（2列〜4列） */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredZukanList.map((kaiju) => {
                const isUnlocked = unlockedKaijuIds.includes(kaiju.id);
                const elMeta = getElementMeta(kaiju.element);
                const typeMeta = getTypeMeta(kaiju.type);
                const stats = getKaijuStats(kaiju, kaijuProgress[kaiju.id]);
                const isCurrentPartner = activePartnerId === kaiju.id;

                return (
                  <button
                    key={kaiju.id}
                    type="button"
                    onClick={() => handleZukanCardTap(kaiju, isUnlocked)}
                    className={`group relative rounded-3xl p-1 transition-all active:scale-95 cursor-pointer text-left ${
                      isUnlocked
                        ? `bg-gradient-to-br ${elMeta.bgGradient} shadow-lg hover:shadow-[0_0_25px_rgba(250,204,21,0.5)]`
                        : 'bg-slate-800/80 border border-white/10'
                    }`}
                  >
                    <div className="rounded-[20px] bg-slate-950/95 p-3 h-full flex flex-col justify-between relative overflow-hidden">

                      {/* ナンバー＆Lv・進化段階バッジ */}
                      <div className="flex items-center justify-between gap-1 text-xs font-black">
                        <span className="text-amber-300 tabular-nums flex items-center gap-1">
                          {kaiju.category === 'insect' && <span>🪲</span>}
                          <span>No.{String(kaiju.dexNumber).padStart(2, '0')}</span>
                        </span>
                        {isUnlocked ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-black tabular-nums ${
                              stats.level >= MAX_KAIJU_LEVEL
                                ? 'bg-gradient-to-r from-yellow-400 via-rose-500 to-purple-500 text-white shadow'
                                : 'bg-amber-400 text-slate-950'
                            }`}
                          >
                            Lv.{stats.level}{' '}
                            {stats.level >= MAX_KAIJU_LEVEL ? '👑MAX' : '★'.repeat(stats.stage)}
                          </span>
                        ) : (
                          <span className="text-base">
                            {kaiju.category === 'insect' && elMeta.insectFieldEmoji
                              ? elMeta.insectFieldEmoji
                              : elMeta.emoji}
                            {typeMeta.emoji}
                          </span>
                        )}
                      </div>

                      {/* あいぼうバッジ */}
                      {isUnlocked && isCurrentPartner && (
                        <div className="mt-1 inline-flex items-center gap-1 self-start bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                          🤝 あいぼう
                        </div>
                      )}

                      {/* イラストまたは未発見シルエット */}
                      <div className="relative w-full h-32 sm:h-36 my-1.5 flex items-center justify-center">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 transition-all">
                          <KaijuSvgIllustration
                            element={kaiju.element}
                            type={kaiju.type}
                            kaijuId={kaiju.id}
                            evolutionStage={isUnlocked ? stats.stage : 2}
                            silhouette={!isUnlocked}
                            category={kaiju.category}
                            insectStyle={kaiju.insectStyle}
                            realColors={kaiju.realColors}
                          />
                        </div>
                      </div>

                      {/* 名前＆ステータス概要 */}
                      {isUnlocked ? (
                        <div>
                          <div className="text-sm sm:text-base font-black text-white truncate">
                            {stats.displayName}
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-black text-slate-300 mt-0.5">
                            <span className="text-emerald-300">HP {stats.maxHp}</span>
                            <span className="text-orange-300">⚔️ {stats.attack}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-amber-300">
                            <Zap className="w-3.5 h-3.5 fill-amber-300 shrink-0" />
                            <span className="truncate">タップで べんきょう＆育成！</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-black text-slate-400">？？？</div>
                          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-500">
                            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                            {kaiju.id.includes('-dq-') ? (
                              <span className="truncate text-rose-400 font-black">
                                ⚔️ ボス討伐で なかまになる！
                              </span>
                            ) : (
                              <span className="truncate">
                                {kaiju.category === 'insect' && elMeta.insectFieldLabel
                                  ? elMeta.insectFieldLabel
                                  : elMeta.label}
                                ×{typeMeta.label}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================
            TAB 4: 🎓 クイズタブ（音声つき3択クイズ大会）
           ============================================================ */}
        {activeTab === 'quiz' && (
          <KaijuQuiz
            soundEnabled={soundEnabled}
            onQuizClearReward={() => {
              setExpOrbs((prev) => prev + 2);
              setStarBalls((prev) => prev + 1);
              addExpToKaiju(activePartnerId, 60, { showToast: true });
            }}
          />
        )}

        {/* ============================================================
            TAB 5: ⚔️ バトルタブ（親子タッグ大魔王討伐 ＆ 2P対戦モード）
           ============================================================ */}
        {activeTab === 'battle' && (
          <KaijuBattle
            unlockedKaijuIds={unlockedKaijuIds}
            kaijuProgress={kaijuProgress}
            soundEnabled={soundEnabled}
            onBattleComplete={handleBattleReward}
          />
        )}
      </main>

      {/* ==================== 🐉 黄金の神龍（シェンロン）お願いモーダル ==================== */}
      {showShenronModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto"
          onClick={() => setShowShenronModal(false)}
        >
          <div
            className="w-full max-w-md dq-window p-5 text-white space-y-4 border-4 border-yellow-300 shadow-[0_0_50px_rgba(250,204,21,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-1">
              <div className="text-6xl animate-bounce">🐉✨</div>
              <h2 className="text-xl sm:text-2xl font-black text-yellow-300">
                おうごんの シェンロン
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-200">
                「7つの ほし玉を あつめた ゆうしゃ じょうよ… 3つの なかから すきな ねがいを 1つ かなえてやろう！」
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleGrantShenronWish('new-kaiju')}
                className="w-full min-h-[64px] p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-left flex items-center gap-3 border-2 border-white shadow-lg active:scale-95 cursor-pointer"
              >
                <span className="text-3xl shrink-0">🥚</span>
                <div>
                  <div className="text-sm sm:text-base">① あたらしい なかまが ほしい！</div>
                  <div className="text-[11px] text-yellow-200">
                    まだ持っていない 怪獣・昆虫が Lv.3 でかならず仲間になる！
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGrantShenronWish('level-plus-3')}
                className="w-full min-h-[64px] p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-left flex items-center gap-3 border-2 border-white shadow-lg active:scale-95 cursor-pointer"
              >
                <span className="text-3xl shrink-0">👑</span>
                <div>
                  <div className="text-sm sm:text-base">
                    ② あいぼうを いっきに つよくして！
                  </div>
                  <div className="text-[11px] text-emerald-100">
                    いまの「あいぼう（{partnerStats.displayName}）」のレベルが ＋3 あがる！
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGrantShenronWish('orbs-10')}
                className="w-full min-h-[64px] p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-left flex items-center gap-3 border-2 border-white shadow-lg active:scale-95 cursor-pointer"
              >
                <span className="text-3xl shrink-0">🌟</span>
                <div>
                  <div className="text-sm sm:text-base">
                    ③ けいけんち玉と エネルギーを たくさんちょうだい！
                  </div>
                  <div className="text-[11px] text-indigo-100">
                    🌟けいけんち玉 ＋10こ ＆ ⚡しょうかんエネルギー ＋3 ゲット！
                  </div>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowShenronModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-black text-xs border border-white/20 cursor-pointer"
            >
              あとで おねがいする（とじる）
            </button>
          </div>
        </div>
      )}

      {/* ==================== 図鑑の怪獣拡大＆育成モーダル ==================== */}
      {selectedZukanKaiju && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto"
          onClick={() => setSelectedZukanKaiju(null)}
        >
          <div className="w-full max-w-md my-auto py-4" onClick={(e) => e.stopPropagation()}>
            <KaijuHeroCard
              kaiju={selectedZukanKaiju}
              soundEnabled={soundEnabled}
              progress={kaijuProgress[selectedZukanKaiju.id]}
              expOrbs={expOrbs}
              isPartner={activePartnerId === selectedZukanKaiju.id}
              onLevelUp={handleUseExpOrb}
              onSelectPartner={(id) => setPartnerKaijuId(id)}
              onClose={() => {
                playTapSound(480);
                setSelectedZukanKaiju(null);
              }}
              closeButtonLabel="とじる"
            />
          </div>
        </div>
      )}

      {/* ==================== 画面下部：5つの大きな切り替えタブ ==================== */}
      <nav
        aria-label="メインメニュー"
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t-2 border-white/15 px-1.5 sm:px-3 py-2"
      >
        <div className="max-w-xl mx-auto grid grid-cols-5 gap-1.5 sm:gap-2">
          {/* ① ⚡クエスト */}
          <button
            type="button"
            onClick={() => handleSelectTab('quest')}
            className={`relative min-h-[62px] rounded-2xl font-black flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border-2 ${
              activeTab === 'quest'
                ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-slate-950 border-white shadow-[0_0_20px_rgba(250,204,21,0.6)]'
                : 'bg-slate-800/90 text-slate-200 border-white/10 hover:bg-slate-800'
            }`}
          >
            {starBalls >= 7 && activeTab !== 'quest' && (
              <span className="absolute -top-2.5 right-0.5 bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white shadow">
                🐉神龍!
              </span>
            )}
            <span className="text-xl sm:text-2xl leading-none">⚡</span>
            <span className="text-[11px] sm:text-xs mt-1">クエスト</span>
          </button>

          {/* ② 🥚しょうかん（エネルギー3つ以上のときピカピカ光る演出） */}
          <button
            type="button"
            onClick={() => handleSelectTab('summon')}
            className={`relative min-h-[62px] rounded-2xl font-black flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border-2 ${
              activeTab === 'summon'
                ? 'bg-gradient-to-b from-rose-500 to-orange-500 text-white border-white shadow-[0_0_22px_rgba(244,63,94,0.7)]'
                : canSummon
                ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 text-slate-950 border-white shadow-[0_0_25px_rgba(250,204,21,0.95)] ring-2 ring-yellow-300'
                : 'bg-slate-800/90 text-slate-200 border-white/10 hover:bg-slate-800'
            }`}
          >
            {canSummon && activeTab !== 'summon' && (
              <span className="absolute -top-2.5 right-0.5 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white shadow">
                OK!
              </span>
            )}
            <span className="text-xl sm:text-2xl leading-none">🥚</span>
            <span className="text-[11px] sm:text-xs mt-1">しょうかん</span>
          </button>

          {/* ③ 📖ずかん */}
          <button
            type="button"
            onClick={() => handleSelectTab('zukan')}
            className={`relative min-h-[62px] rounded-2xl font-black flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border-2 ${
              activeTab === 'zukan'
                ? 'bg-gradient-to-b from-cyan-400 to-blue-600 text-white border-white shadow-[0_0_20px_rgba(56,189,248,0.6)]'
                : 'bg-slate-800/90 text-slate-200 border-white/10 hover:bg-slate-800'
            }`}
          >
            {expOrbs > 0 && activeTab !== 'zukan' && (
              <span className="absolute -top-2.5 right-0.5 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white shadow">
                🌟{expOrbs}
              </span>
            )}
            <span className="text-xl sm:text-2xl leading-none">📖</span>
            <span className="text-[11px] sm:text-xs mt-1">
              ずかん({unlockedKaijuIds.length})
            </span>
          </button>

          {/* ④ 🎓クイズ */}
          <button
            type="button"
            onClick={() => handleSelectTab('quiz')}
            className={`min-h-[62px] rounded-2xl font-black flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border-2 ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-b from-emerald-400 to-teal-600 text-slate-950 border-white shadow-[0_0_20px_rgba(52,211,153,0.7)]'
                : 'bg-slate-800/90 text-slate-200 border-white/10 hover:bg-slate-800'
            }`}
          >
            <span className="text-xl sm:text-2xl leading-none">🎓</span>
            <span className="text-[11px] sm:text-xs mt-1">クイズ</span>
          </button>

          {/* ⑤ ⚔️バトル */}
          <button
            type="button"
            onClick={() => handleSelectTab('battle')}
            className={`min-h-[62px] rounded-2xl font-black flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border-2 ${
              activeTab === 'battle'
                ? 'bg-gradient-to-b from-purple-500 to-rose-600 text-white border-white shadow-[0_0_20px_rgba(168,85,247,0.7)]'
                : 'bg-slate-800/90 text-slate-200 border-white/10 hover:bg-slate-800'
            }`}
          >
            <Swords className="w-5 h-5 sm:w-6 sm:h-6 leading-none text-amber-300" />
            <span className="text-[11px] sm:text-xs mt-1">バトル</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
