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
  KAIJU_LIST,
  ElementId,
  KaijuTypeId,
  KaijuData,
  KaijuProgress,
  QuestItem,
  findKaijuForSummon,
  getKaijuStats,
  getElementMeta,
  getTypeMeta,
} from '@/lib/kaiju-data';
import { MonsterEggSvg, KaijuSvgIllustration } from '@/components/kaiju-artwork';
import { KaijuHeroCard } from '@/components/kaiju-card';
import { KaijuBattle } from '@/components/kaiju-battle';
import {
  playTapSound,
  playQuestClearSound,
  playEggChargeSound,
  playSummonExplosionAndFanfare,
  playSpecialAttackSound,
  playLevelUpSound,
  playEvolutionSound,
  speakJapanese,
  fireQuestConfetti,
  fireSummonConfetti,
} from '@/lib/sound-and-speech';

type ActiveTab = 'quest' | 'summon' | 'zukan' | 'battle';

interface SavedAppState {
  energy: number;
  completedQuests: string[];
  unlockedKaijuIds: string[];
  soundEnabled: boolean;
  kaijuProgress: Record<string, KaijuProgress>;
  expOrbs: number;
  partnerKaijuId: string | null;
}

const STORAGE_KEY = 'kaiju_oshitaku_quest_v1';

export default function KaijuQuestApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('quest');
  const [energy, setEnergy] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [unlockedKaijuIds, setUnlockedKaijuIds] = useState<string[]>(['fire-dino']);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [kaijuProgress, setKaijuProgress] = useState<Record<string, KaijuProgress>>({
    'fire-dino': { level: 1, exp: 0 },
  });
  const [expOrbs, setExpOrbs] = useState<number>(3);
  const [partnerKaijuId, setPartnerKaijuId] = useState<string | null>('fire-dino');
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // ドラクエ風レベルアップトースト通知（クエスト達成であいぼうがレベルアップした時など）
  const [dqToastMessages, setDqToastMessages] = useState<string[] | null>(null);

  // 召喚タブの選択ステート
  const [selectedElement, setSelectedElement] = useState<ElementId>('fire');
  const [selectedType, setSelectedType] = useState<KaijuTypeId>('dino');
  const [isHatching, setIsHatching] = useState<boolean>(false);
  const [summonedKaiju, setSummonedKaiju] = useState<{
    kaiju: KaijuData;
    isNew: boolean;
    powerUpLevel?: number;
  } | null>(null);

  // 図鑑タブの選択・フィルターステート
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

          const loadedUnlocked =
            Array.isArray(parsed.unlockedKaijuIds) && parsed.unlockedKaijuIds.length > 0
              ? parsed.unlockedKaijuIds
              : ['fire-dino'];
          setUnlockedKaijuIds(loadedUnlocked);

          if (typeof parsed.soundEnabled === 'boolean') setSoundEnabled(parsed.soundEnabled);

          // kaijuProgress の初期化・補完
          const loadedProgress: Record<string, KaijuProgress> = {
            ...(parsed.kaijuProgress || {}),
          };
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

          if (parsed.partnerKaijuId && KAIJU_LIST.some((k) => k.id === parsed.partnerKaijuId)) {
            setPartnerKaijuId(parsed.partnerKaijuId);
          } else {
            setPartnerKaijuId(loadedUnlocked[0] || 'fire-dino');
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
    isHydrated,
  ]);

  // 指定した怪獣に経験値を加算し、100ごとにレベルアップさせる共通関数
  const addExpToKaiju = (
    kaijuId: string,
    expAmount: number,
    options?: { showToast?: boolean }
  ): { leveledUp: boolean; newLevel: number; evolved: boolean } => {
    const targetKaiju = KAIJU_LIST.find((k) => k.id === kaijuId) || KAIJU_LIST[0];
    const currentProg = kaijuProgress[kaijuId] || { level: 1, exp: 0 };
    const oldStats = getKaijuStats(targetKaiju, currentProg);

    let nextLevel = currentProg.level;
    let nextExp = currentProg.exp + expAmount;

    while (nextExp >= 100) {
      nextExp -= 100;
      nextLevel += 1;
    }

    const nextProg: KaijuProgress = { level: nextLevel, exp: nextExp };
    const nextStats = getKaijuStats(targetKaiju, nextProg);
    const leveledUp = nextLevel > currentProg.level;
    const evolved = nextStats.stage > oldStats.stage;

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
      if (evolved) {
        msgs.push(`👑 『${nextStats.displayName}』に しんかしたぞ！！`);
        playEvolutionSound();
      } else {
        playLevelUpSound();
      }
      setDqToastMessages(msgs);
    }

    return { leveledUp, newLevel: nextLevel, evolved };
  };

  // ワンタップ「🌟けいけんち玉でレベルアップ！」ハンドラ
  const handleUseExpOrb = (kaijuId: string) => {
    if (expOrbs <= 0) return;
    setExpOrbs((prev) => Math.max(0, prev - 1));
    addExpToKaiju(kaijuId, 100);
  };

  // タブ切り替え処理
  const handleSelectTab = (tab: ActiveTab) => {
    playTapSound(580);
    setActiveTab(tab);
    setSummonedKaiju(null);
    setSelectedZukanKaiju(null);

    if (tab === 'quest') {
      speakJapanese(
        'ブンブンハローかいじゅうクエスト！できたものをタップしてね！あいぼうの かいじゅうも いっしょに つよくなるよ！',
        soundEnabled
      );
    } else if (tab === 'summon') {
      if (energy >= 3) {
        speakJapanese(
          'ブンブン！かいじゅうしょうかんタイム！すきなパワーとタイプをえらんでね！いくぞー！',
          soundEnabled
        );
      } else {
        speakJapanese(
          `あと ${3 - energy}こ エネルギーをためると しょうかんできるよ！いっしょにがんばろう！`,
          soundEnabled
        );
      }
    } else if (tab === 'zukan') {
      speakJapanese(
        `かいじゅうずかん！いま ${unlockedKaijuIds.length}たい あつまったよ！けいけんち玉で レベルアップさせよう！`,
        soundEnabled
      );
    } else if (tab === 'battle') {
      speakJapanese(
        'ふたりで かいじゅうバトル！むすこくんと パパで たいけつだ！レッツゴー！',
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

    // あいぼう怪獣に経験値 +50
    const activePartnerId = partnerKaijuId || unlockedKaijuIds[0] || 'fire-dino';
    const partnerKaiju = KAIJU_LIST.find((k) => k.id === activePartnerId) || KAIJU_LIST[0];
    const expResult = addExpToKaiju(partnerKaiju.id, 50, { showToast: true });

    if (!expResult.leveledUp) {
      playQuestClearSound();
    }
    fireQuestConfetti();

    if (expResult.leveledUp) {
      const updatedPartnerStats = getKaijuStats(partnerKaiju, {
        level: expResult.newLevel,
        exp: 0,
      });
      speakJapanese(
        `キターーー！${quest.shortSpeechName} クリア！さらに、あいぼうの ${updatedPartnerStats.displayName} が レベル ${expResult.newLevel} に レベルアップしたよ！やばすぎるー！`,
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
    setDqToastMessages(null);
    speakJapanese(
      'ブンブン！あたらしい1にちのスタート！きょうもクエストがんばろう！レッツゴー！',
      soundEnabled
    );
  };

  // おためしチャージ（エネルギー +3 ＆ 🌟けいけんち玉 +3）
  const handleTestCharge = () => {
    playQuestClearSound();
    fireQuestConfetti();
    setEnergy((prev) => prev + 3);
    setExpOrbs((prev) => prev + 3);
    speakJapanese(
      'キターーー！おためしチャージ！エネルギー 3こと、けいけんち玉 3こを ゲットしたよ！やばすぎるー！',
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
    speakJapanese(
      'うおおおー！タマゴがひかってゆれてるぞ！なにがでるかな！？ドキドキするねー！',
      soundEnabled
    );

    const targetKaiju = findKaijuForSummon(selectedElement, selectedType, unlockedKaijuIds);
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
        // すでに持っている怪獣が召喚された場合は「限界突破ボーナス」でレベル +1！
        const currentProg = kaijuProgress[targetKaiju.id] || { level: 1, exp: 0 };
        const nextLv = currentProg.level + 1;
        powerUpLevel = nextLv;
        setKaijuProgress((prev) => ({
          ...prev,
          [targetKaiju.id]: { level: nextLv, exp: currentProg.exp },
        }));
      }

      setIsHatching(false);
      setSummonedKaiju({ kaiju: targetKaiju, isNew, powerUpLevel });

      playSummonExplosionAndFanfare();
      fireSummonConfetti(elMeta.confettiColors);

      const currentStats = getKaijuStats(
        targetKaiju,
        powerUpLevel ? { level: powerUpLevel, exp: 0 } : { level: 1, exp: 0 }
      );

      if (isNew) {
        speakJapanese(
          `キターーー！あたらしい かいじゅう、${currentStats.displayName}のとうじょうだ！ひっさつわざは ${targetKaiju.specialMove}！これマジでやばいねー！`,
          soundEnabled
        );
      } else {
        speakJapanese(
          `キターーー！パワーアップしょうかん！${currentStats.displayName}の レベルが ${powerUpLevel} に あがったぞ！つよすぎるー！`,
          soundEnabled
        );
      }
    }, 1550);
  };

  // ③ 図鑑のカードをタップしたとき
  const handleZukanCardTap = (kaiju: KaijuData, isUnlocked: boolean) => {
    const elMeta = getElementMeta(kaiju.element);
    const typeMeta = getTypeMeta(kaiju.type);

    if (!isUnlocked) {
      playTapSound(380);
      speakJapanese(
        `おっと！まだみつかっていない かいじゅうだよ！${elMeta.label} と ${typeMeta.label} をえらんで しょうかんしてみよう！レッツゴー！`,
        soundEnabled
      );
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

  // バトル終了時のごほうび付与（🌟けいけんち玉 +2 ＆ 1P怪獣に経験値 +50）
  const handleBattleReward = (p1Id: string) => {
    setExpOrbs((prev) => prev + 2);
    addExpToKaiju(p1Id, 50, { showToast: true });
  };

  const canSummon = energy >= 3;
  const meterSlots = Math.min(3, energy);
  const filteredZukanList =
    zukanFilter === 'all'
      ? KAIJU_LIST
      : KAIJU_LIST.filter((k) => k.element === zukanFilter);

  // 現在のあいぼう怪獣データ
  const activePartnerId = partnerKaijuId || unlockedKaijuIds[0] || 'fire-dino';
  const partnerKaiju = KAIJU_LIST.find((k) => k.id === activePartnerId) || KAIJU_LIST[0];
  const partnerStats = getKaijuStats(partnerKaiju, kaijuProgress[partnerKaiju.id]);

  // 選択中の属性×タイプに未解放の怪獣がいるかチェック
  const hasLockedCandidateForSelection = KAIJU_LIST.some(
    (k) =>
      k.element === selectedElement &&
      k.type === selectedType &&
      !unlockedKaijuIds.includes(k.id)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-28">
      {/* ==================== コンパクト・トップヘッダー ==================== */}
      <header className="sticky top-0 z-30 h-14 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="text-2xl" aria-hidden="true">
            🦖
          </span>
          <span className="text-base sm:text-lg font-black tracking-tight text-white">
            かいじゅうクエスト
          </span>
        </div>

        {/* 中央：現在のエネルギー＆けいけんち玉＆図鑑数 */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-black text-slate-200 tabular-nums">
          <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-amber-400/40 text-amber-300">
            ⚡ {energy}
          </span>
          <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-yellow-300/40 text-yellow-300">
            🌟玉 {expOrbs}こ
          </span>
          <span className="hidden md:inline text-slate-300">
            📖 ずかん: {unlockedKaijuIds.length}/{KAIJU_LIST.length}
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
                    evolutionStage={partnerStats.stage}
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-400/50">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>あいぼう</span>
                    </span>
                    <span className="text-sm font-black text-yellow-300 tabular-nums">
                      Lv.{partnerStats.level}
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-white truncate">
                    {partnerStats.displayName}
                  </div>
                  <div className="text-[11px] font-bold text-slate-300">
                    クエストクリアで けいけんち＋50！
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

            {/* 9つのクエストカードグリッド（スマホ1〜2列、PC3列） */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {QUEST_LIST.map((quest) => {
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
                      <span className={isDone ? 'animate-bounce' : ''}>{quest.emoji}</span>
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
                          <span>タップして クリア！（あいぼうEXP+50）</span>
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
                {/* 上部：エネルギー残量＆テスト用「おためしチャージ（+3）」ボタン */}
                <div className="rounded-3xl bg-slate-900/90 border-2 border-white/15 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-3.5 py-2 rounded-2xl border border-amber-400/50">
                      <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      <span className="text-xl font-black text-amber-300 tabular-nums">
                        {energy}
                      </span>
                      <span className="text-xs font-bold text-slate-400">/ 3</span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-white">
                      {canSummon
                        ? '⚡ エネルギーOK！すきな かいじゅうを つくろう！'
                        : `あと ${3 - energy}こ エネルギーが いるよ`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestCharge}
                    className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 border border-amber-400/40 text-xs font-extrabold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>おためしチャージ（⚡+3 🌟+3）</span>
                  </button>
                </div>

                {/* 2カラム対応レイアウト：左に2ステップ選択、右（スマホでは下）にタマゴ＆召喚ボタン */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  {/* 左カラム：2ステップ選択ボタン */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* ステップ1：属性をえらぶ */}
                    <div className="rounded-3xl bg-slate-900/90 border-2 border-white/15 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center shrink-0">
                          1
                        </span>
                        <h2 className="text-lg sm:text-xl font-black text-white">
                          パワー（ぞくせい）を えらぼう！
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {ELEMENT_OPTIONS.map((el) => {
                          const isSelected = selectedElement === el.id;
                          return (
                            <button
                              key={el.id}
                              type="button"
                              onClick={() => {
                                playTapSound(540);
                                setSelectedElement(el.id);
                                speakJapanese(el.speechLabel, soundEnabled);
                              }}
                              className={`min-h-[74px] rounded-2xl p-3 flex items-center gap-3 border-2 transition-all active:scale-95 cursor-pointer ${
                                isSelected
                                  ? `bg-gradient-to-r ${el.bgGradient} border-white ${el.activeRing} text-white`
                                  : 'bg-slate-950/90 border-slate-700 text-slate-200 hover:border-slate-500'
                              }`}
                            >
                              <span className="text-4xl shrink-0">{el.emoji}</span>
                              <span className="text-xl font-black tracking-tight whitespace-nowrap">
                                {el.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ステップ2：タイプをえらぶ */}
                    <div className="rounded-3xl bg-slate-900/90 border-2 border-white/15 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 font-black text-base flex items-center justify-center shrink-0">
                          2
                        </span>
                        <h2 className="text-lg sm:text-xl font-black text-white">
                          かいじゅうの タイプを えらぼう！
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {KAIJU_TYPE_OPTIONS.map((tp) => {
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
                              className={`min-h-[74px] rounded-2xl p-3 flex items-center gap-3 border-2 transition-all active:scale-95 cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-white ring-4 ring-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.75)] text-white'
                                  : 'bg-slate-950/90 border-slate-700 text-slate-200 hover:border-slate-500'
                              }`}
                            >
                              <span className="text-4xl shrink-0">{tp.emoji}</span>
                              <span className="text-lg sm:text-xl font-black tracking-tight whitespace-nowrap">
                                {tp.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 右カラム：タマゴ召喚ステージ＆「しょうかんする！」特大ボタン */}
                  <div className="lg:col-span-5 rounded-3xl bg-slate-900/95 border-2 border-white/20 p-5 flex flex-col items-center justify-between text-center relative overflow-hidden">
                    <div className="text-sm font-black text-amber-300 bg-slate-950/80 px-4 py-1.5 rounded-full border border-amber-400/40">
                      {getElementMeta(selectedElement).emoji} {getElementMeta(selectedElement).label} ×{' '}
                      {getTypeMeta(selectedType).emoji} {getTypeMeta(selectedType).label}
                    </div>

                    {/* タマゴSVG */}
                    <div className="my-4">
                      <MonsterEggSvg
                        element={selectedElement}
                        type={selectedType}
                        isShaking={isHatching}
                      />
                    </div>

                    <p className="text-sm font-extrabold text-slate-300 mb-3">
                      {isHatching
                        ? '⚡ ガタガタッ！うまれるぞーーっ！！'
                        : hasLockedCandidateForSelection
                        ? '❓ まだ みつかっていない 新種のかいじゅう が でるぞ！'
                        : '⚡ もういちど しょうかんすると レベルが +1 あがるよ！'}
                    </p>

                    {/* 「しょうかんする！」特大ボタン（最小76px高） */}
                    <button
                      type="button"
                      onClick={handleSummonKaiju}
                      disabled={isHatching}
                      className={`min-h-[78px] w-full rounded-3xl font-black text-2xl flex items-center justify-center gap-3 border-4 transition-all active:scale-95 cursor-pointer px-4 whitespace-nowrap shrink-0 ${
                        canSummon
                          ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 text-slate-950 border-white shadow-[0_8px_0_#b45309,0_0_35px_rgba(250,204,21,0.85)]'
                          : 'bg-slate-800 text-slate-300 border-slate-600'
                      }`}
                    >
                      <Flame className="w-8 h-8 shrink-0 fill-current" />
                      <span>{isHatching ? 'しょうかんちゅう…！' : 'しょうかんする！'}</span>
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
                  <span>📖 かいじゅう ずかん＆いくせい</span>
                </h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-yellow-300 font-black text-sm sm:text-base">
                    🌟 けいけんち玉: {expOrbs}こ
                  </span>
                  <span className="text-base sm:text-xl font-black text-amber-300 tabular-nums">
                    {unlockedKaijuIds.length} / {KAIJU_LIST.length} たい
                  </span>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-white/15">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500"
                  style={{
                    width: `${Math.round((unlockedKaijuIds.length / KAIJU_LIST.length) * 100)}%`,
                  }}
                />
              </div>

              {/* 属性フィルターボタン */}
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
                {ELEMENT_OPTIONS.map((el) => (
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
                    <span className="text-lg">{el.emoji}</span>
                    <span>{el.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 怪獣コレクション一覧グリッド（2列〜4列） */}
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
                      {isUnlocked && (
                        <div className="pointer-events-none absolute inset-0 animate-holo opacity-25" />
                      )}

                      {/* ナンバー＆Lv・進化段階バッジ */}
                      <div className="flex items-center justify-between gap-1 text-xs font-black">
                        <span className="text-amber-300 tabular-nums">
                          No.{String(kaiju.dexNumber).padStart(2, '0')}
                        </span>
                        {isUnlocked ? (
                          <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[11px] font-black tabular-nums">
                            Lv.{stats.level} {'★'.repeat(stats.stage)}
                          </span>
                        ) : (
                          <span className="text-base">
                            {elMeta.emoji}
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
                        <div className="w-28 h-28 sm:w-32 sm:h-32">
                          <KaijuSvgIllustration
                            element={kaiju.element}
                            type={kaiju.type}
                            evolutionStage={isUnlocked ? stats.stage : 2}
                            silhouette={!isUnlocked}
                          />
                        </div>

                        {!isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border-2 border-slate-500 flex items-center justify-center text-2xl shadow-lg">
                              ❓
                            </div>
                          </div>
                        )}
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
                            <span className="truncate">タップで レベルアップ！</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-black text-slate-400">？？？</div>
                          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-500">
                            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">
                              {elMeta.label}×{typeMeta.label}
                            </span>
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
            TAB 4: ⚔️ バトルタブ（パパ vs むすこ 2P対戦モード）
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

      {/* ==================== 画面下部：4つの大きな切り替えタブ ==================== */}
      <nav
        aria-label="メインメニュー"
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t-2 border-white/15 px-2 sm:px-3 py-2"
      >
        <div className="max-w-xl mx-auto grid grid-cols-4 gap-2">
          {/* ① ⚡クエスト */}
          <button
            type="button"
            onClick={() => handleSelectTab('quest')}
            className={`min-h-[64px] rounded-2xl font-black flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border-2 ${
              activeTab === 'quest'
                ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-slate-950 border-white shadow-[0_0_20px_rgba(250,204,21,0.6)]'
                : 'bg-slate-800/90 text-slate-200 border-white/10 hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl leading-none">⚡</span>
            <span className="text-xs sm:text-sm mt-1">クエスト</span>
          </button>

          {/* ② 🥚しょうかん（エネルギー3つ以上のときピカピカ光る演出） */}
          <button
            type="button"
            onClick={() => handleSelectTab('summon')}
            className={`relative min-h-[64px] rounded-2xl font-black flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border-2 ${
              activeTab === 'summon'
                ? 'bg-gradient-to-b from-rose-500 to-orange-500 text-white border-white shadow-[0_0_22px_rgba(244,63,94,0.7)]'
                : canSummon
                ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 text-slate-950 border-white shadow-[0_0_25px_rgba(250,204,21,0.95)] animate-bounce'
                : 'bg-slate-800/90 text-slate-200 border-white/10 hover:bg-slate-800'
            }`}
          >
            {canSummon && activeTab !== 'summon' && (
              <span className="absolute -top-2.5 right-1 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow">
                OK!
              </span>
            )}
            <span className="text-2xl leading-none">🥚</span>
            <span className="text-xs sm:text-sm mt-1">しょうかん</span>
          </button>

          {/* ③ 📖ずかん */}
          <button
            type="button"
            onClick={() => handleSelectTab('zukan')}
            className={`relative min-h-[64px] rounded-2xl font-black flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border-2 ${
              activeTab === 'zukan'
                ? 'bg-gradient-to-b from-cyan-400 to-blue-600 text-white border-white shadow-[0_0_20px_rgba(56,189,248,0.6)]'
                : 'bg-slate-800/90 text-slate-200 border-white/10 hover:bg-slate-800'
            }`}
          >
            {expOrbs > 0 && activeTab !== 'zukan' && (
              <span className="absolute -top-2.5 right-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white shadow">
                🌟{expOrbs}
              </span>
            )}
            <span className="text-2xl leading-none">📖</span>
            <span className="text-xs sm:text-sm mt-1">
              ずかん ({unlockedKaijuIds.length})
            </span>
          </button>

          {/* ④ ⚔️バトル */}
          <button
            type="button"
            onClick={() => handleSelectTab('battle')}
            className={`min-h-[64px] rounded-2xl font-black flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border-2 ${
              activeTab === 'battle'
                ? 'bg-gradient-to-b from-purple-500 to-rose-600 text-white border-white shadow-[0_0_20px_rgba(168,85,247,0.7)]'
                : 'bg-slate-800/90 text-slate-200 border-white/10 hover:bg-slate-800'
            }`}
          >
            <Swords className="w-6 h-6 leading-none text-amber-300" />
            <span className="text-xs sm:text-sm mt-1">バトル</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
