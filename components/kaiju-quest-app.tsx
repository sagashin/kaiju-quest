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
  Egg,
} from 'lucide-react';
import {
  QUEST_LIST,
  ELEMENT_OPTIONS,
  KAIJU_TYPE_OPTIONS,
  KAIJU_LIST,
  ElementId,
  KaijuTypeId,
  KaijuData,
  QuestItem,
  findKaiju,
  getElementMeta,
  getTypeMeta,
} from '@/lib/kaiju-data';
import { MonsterEggSvg, KaijuSvgIllustration } from '@/components/kaiju-artwork';
import { KaijuHeroCard } from '@/components/kaiju-card';
import {
  playTapSound,
  playQuestClearSound,
  playEggChargeSound,
  playSummonExplosionAndFanfare,
  playSpecialAttackSound,
  speakJapanese,
  fireQuestConfetti,
  fireSummonConfetti,
} from '@/lib/sound-and-speech';

type ActiveTab = 'quest' | 'summon' | 'zukan';

interface SavedAppState {
  energy: number;
  completedQuests: string[];
  unlockedKaijuIds: string[];
  soundEnabled: boolean;
}

const STORAGE_KEY = 'kaiju_oshitaku_quest_v1';

export default function KaijuQuestApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('quest');
  const [energy, setEnergy] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [unlockedKaijuIds, setUnlockedKaijuIds] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // 召喚タブの選択ステート
  const [selectedElement, setSelectedElement] = useState<ElementId>('fire');
  const [selectedType, setSelectedType] = useState<KaijuTypeId>('dino');
  const [isHatching, setIsHatching] = useState<boolean>(false);
  const [summonedKaiju, setSummonedKaiju] = useState<{
    kaiju: KaijuData;
    isNew: boolean;
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
          if (Array.isArray(parsed.completedQuests)) setCompletedQuests(parsed.completedQuests);
          if (Array.isArray(parsed.unlockedKaijuIds)) setUnlockedKaijuIds(parsed.unlockedKaijuIds);
          if (typeof parsed.soundEnabled === 'boolean') setSoundEnabled(parsed.soundEnabled);
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
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore localStorage write errors
    }
  }, [energy, completedQuests, unlockedKaijuIds, soundEnabled, isHydrated]);

  // タブ切り替え処理
  const handleSelectTab = (tab: ActiveTab) => {
    playTapSound(580);
    setActiveTab(tab);
    setSummonedKaiju(null);
    setSelectedZukanKaiju(null);

    if (tab === 'quest') {
      speakJapanese('おしたく クエスト！できたものを タップしよう！', soundEnabled);
    } else if (tab === 'summon') {
      if (energy >= 3) {
        speakJapanese('かいじゅう しょうかん！すきな わざと タイプを えらぼう！', soundEnabled);
      } else {
        speakJapanese(`あと ${3 - energy}こ エネルギーを ためると しょうかん できるよ！`, soundEnabled);
      }
    } else if (tab === 'zukan') {
      speakJapanese(`かいじゅう ずかん！いま ${unlockedKaijuIds.length}たい あつめたよ！`, soundEnabled);
    }
  };

  // ① クエストカードをタップしたとき
  const handleQuestTap = (quest: QuestItem) => {
    const isAlreadyDone = completedQuests.includes(quest.id);

    if (isAlreadyDone) {
      playTapSound(680);
      speakJapanese(`${quest.shortSpeechName}は もう クリアしたよ！すごいね！`, soundEnabled);
      return;
    }

    const nextCompleted = [...completedQuests, quest.id];
    const nextEnergy = energy + 1;

    setCompletedQuests(nextCompleted);
    setEnergy(nextEnergy);

    playQuestClearSound();
    fireQuestConfetti();

    if (nextEnergy >= 3) {
      speakJapanese(
        `すごい！${quest.shortSpeechName} クリア！エネルギーが まったんに なったよ！かいじゅうを しょうかん できるよ！`,
        soundEnabled
      );
    } else {
      speakJapanese(
        `すごい！${quest.shortSpeechName} クリア！エネルギーが たまったよ！`,
        soundEnabled
      );
    }
  };

  // 日付リセット（スタンプを戻す）
  const handleResetDailyQuests = () => {
    playTapSound(420);
    setCompletedQuests([]);
    speakJapanese('あたらしい 1にちの スタート！きょうも クエスト がんばろう！', soundEnabled);
  };

  // おためしチャージ（+3）
  const handleTestCharge = () => {
    playQuestClearSound();
    fireQuestConfetti();
    const next = energy + 3;
    setEnergy(next);
    speakJapanese('エネルギー まんたん チャージ！かいじゅうを しょうかん できるよ！', soundEnabled);
  };

  // ② 怪獣を召喚する！ボタン
  const handleSummonKaiju = () => {
    if (isHatching) return;

    if (energy < 3) {
      playTapSound(320);
      speakJapanese(
        `エネルギーが あと ${3 - energy}こ たりないよ！クエストを クリアするか、おためしチャージを おしてね！`,
        soundEnabled
      );
      return;
    }

    // エネルギーを3消費して孵化演出開始
    setEnergy((prev) => Math.max(0, prev - 3));
    setIsHatching(true);
    setSummonedKaiju(null);
    playEggChargeSound();
    speakJapanese('タマゴが ひかって ゆれているぞ！なにが でるかな！？', soundEnabled);

    const targetKaiju = findKaiju(selectedElement, selectedType);
    const elMeta = getElementMeta(selectedElement);

    setTimeout(() => {
      const isNew = !unlockedKaijuIds.includes(targetKaiju.id);
      if (isNew) {
        setUnlockedKaijuIds((prev) => [...prev, targetKaiju.id]);
      }

      setIsHatching(false);
      setSummonedKaiju({ kaiju: targetKaiju, isNew });

      playSummonExplosionAndFanfare();
      fireSummonConfetti(elMeta.confettiColors);

      // 登場時ボイス
      speakJapanese(
        `ガオー！ぼくは ${targetKaiju.name}！ひっさつわざは ${targetKaiju.specialMove} だ！`,
        soundEnabled
      );
    }, 1550);
  };

  // ③ 図鑑のカードをタップしたとき
  const handleZukanCardTap = (kaiju: KaijuData, isUnlocked: boolean) => {
    const elMeta = getElementMeta(kaiju.element);
    const typeMeta = getTypeMeta(kaiju.type);

    if (!isUnlocked) {
      playTapSound(380);
      speakJapanese(
        `まだ みつかって いない かいじゅう だよ！${elMeta.label} と ${typeMeta.label} を えらんで しょうかん してみよう！`,
        soundEnabled
      );
      return;
    }

    setSelectedZukanKaiju(kaiju);
    playSpecialAttackSound();
    fireSummonConfetti(elMeta.confettiColors);
    speakJapanese(`${kaiju.name}！ひっさつわざ、${kaiju.specialMove}！`, soundEnabled);
  };

  const canSummon = energy >= 3;
  const meterSlots = Math.min(3, energy);
  const filteredZukanList =
    zukanFilter === 'all'
      ? KAIJU_LIST
      : KAIJU_LIST.filter((k) => k.element === zukanFilter);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-28">
      {/* ==================== コンパクト・トップヘッダー ==================== */}
      <header className="sticky top-0 z-30 h-14 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="text-2xl" aria-hidden="true">🦖</span>
          <span className="text-base sm:text-lg font-black tracking-tight text-white">
            かいじゅうクエスト
          </span>
        </div>

        {/* 中央：現在のエネルギー＆図鑑数 */}
        <div className="hidden sm:flex items-center gap-3 text-sm font-black text-slate-300 tabular-nums">
          <span>⚡ エネルギー: {energy}</span>
          <span aria-hidden="true">·</span>
          <span>📖 ずかん: {unlockedKaijuIds.length}/16</span>
        </div>

        {/* 右：音声読み上げON/OFFボタン（最小44px以上） */}
        <button
          type="button"
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            playTapSound(next ? 660 : 400);
            if (next) {
              speakJapanese('こえが でるよ！', true);
            }
          }}
          className={`min-h-[44px] px-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
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
      <main className="max-w-5xl mx-auto px-4 pt-4">
        {/* ============================================================
            TAB 1: ⚡ クエストタブ（毎日の習慣）
           ============================================================ */}
        {activeTab === 'quest' && (
          <section className="space-y-5">
            {/* 画面上部：しょうかんエネルギーメーター（0〜3個） */}
            <div
              className={`rounded-3xl p-4 sm:p-5 border-2 transition-all ${
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
                        className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                          isFilled
                            ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 border-white scale-105 shadow-[0_0_22px_rgba(250,204,21,0.9)]'
                            : 'bg-slate-950/80 border-slate-700 opacity-50'
                        }`}
                      >
                        <Zap
                          className={`w-10 h-10 transition-transform duration-300 ${
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
                  className="mt-4 w-full min-h-[64px] rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center gap-2.5 shadow-[0_6px_0_#b45309] border-2 border-white transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span className="text-2xl">🥚</span>
                  <span>いますぐ かいじゅうを しょうかんする！</span>
                </button>
              )}
            </div>

            {/* 8つのクエストカードグリッド（スマホ1〜2列、PC3列） */}
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
                            <span className="text-emerald-300">クリア！ ⚡+1</span>
                          </>
                        ) : (
                          <span>タップして クリア！</span>
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
            <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs text-slate-400">
              <span>おうちのかたへ：スタンプは毎日リセットできます</span>
              <button
                type="button"
                onClick={handleResetDailyQuests}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-300 border border-white/15 flex items-center gap-1.5 font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>日付リセット（スタンプを戻す）</span>
              </button>
            </div>
          </section>
        )}

        {/* ============================================================
            TAB 2: 🥚 しょうかんタブ（怪獣クリエイト）
           ============================================================ */}
        {activeTab === 'summon' && (
          <section className="space-y-5">
            {/* 召喚結果カードが出ている場合 */}
            {summonedKaiju ? (
              <div className="py-2 space-y-4">
                <KaijuHeroCard
                  kaiju={summonedKaiju.kaiju}
                  soundEnabled={soundEnabled}
                  isNewUnlock={summonedKaiju.isNew}
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

                  {/* テストしやすいように「おためしチャージ（+3）」の隠しボタンも小さく配置 */}
                  <button
                    type="button"
                    onClick={handleTestCharge}
                    className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 border border-amber-400/40 text-xs font-extrabold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>おためしチャージ（+3）</span>
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
                        : unlockedKaijuIds.includes(findKaiju(selectedElement, selectedType).id)
                        ? '✨ この組み合わせは ずかんに いるよ！もういちど よぶ？'
                        : '❓ まだ みつかっていない 新種のかいじゅう だ！'}
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
            TAB 3: 📖 ずかんタブ（コレクション＆音声再生）
           ============================================================ */}
        {activeTab === 'zukan' && (
          <section className="space-y-5">
            {/* 図鑑ヘッダー＆コンプリート進捗メーター */}
            <div className="rounded-3xl bg-slate-900/90 border-2 border-white/15 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>📖 かいじゅう ずかん</span>
                </h2>
                <div className="text-lg sm:text-xl font-black text-amber-300 tabular-nums">
                  {unlockedKaijuIds.length} / {KAIJU_LIST.length} たい ゲット！
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

              {/* 属性フィルターボタン（インタラクティブ） */}
              <div className="grid grid-cols-5 gap-2 mt-4">
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

                      {/* ナンバー＆属性・タイプヒント */}
                      <div className="flex items-center justify-between gap-1 text-xs font-black">
                        <span className="text-amber-300 tabular-nums">
                          No.{String(kaiju.dexNumber).padStart(2, '0')}
                        </span>
                        <span className="text-base">
                          {elMeta.emoji}
                          {typeMeta.emoji}
                        </span>
                      </div>

                      {/* イラストまたは未発見シルエット */}
                      <div className="relative w-full h-32 sm:h-36 my-1.5 flex items-center justify-center">
                        <div className="w-28 h-28 sm:w-32 sm:h-32">
                          <KaijuSvgIllustration
                            element={kaiju.element}
                            type={kaiju.type}
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

                      {/* 名前＆星マーク */}
                      {isUnlocked ? (
                        <div>
                          <div className="text-xs text-yellow-400 font-black tracking-tight leading-none mb-1">
                            {'★'.repeat(kaiju.stars)}
                          </div>
                          <div className="text-sm sm:text-base font-black text-white truncate">
                            {kaiju.name}
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-amber-300">
                            <Volume2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">タップで しゃべる！</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-black text-slate-400">
                            ？？？
                          </div>
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
      </main>

      {/* ==================== 図鑑の怪獣拡大モーダル ==================== */}
      {selectedZukanKaiju && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto"
          onClick={() => setSelectedZukanKaiju(null)}
        >
          <div
            className="w-full max-w-md my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <KaijuHeroCard
              kaiju={selectedZukanKaiju}
              soundEnabled={soundEnabled}
              onClose={() => {
                playTapSound(480);
                setSelectedZukanKaiju(null);
              }}
              closeButtonLabel="ずかんに もどる"
            />
          </div>
        </div>
      )}

      {/* ==================== 画面下部：3つの大きな切り替えタブ ==================== */}
      <nav
        aria-label="メインメニュー"
        className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t-2 border-white/15 px-3 py-2"
      >
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-2.5">
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
            <span className="text-sm sm:text-base mt-1">クエスト</span>
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
              <span className="absolute -top-2.5 right-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow">
                OK!
              </span>
            )}
            <span className="text-2xl leading-none">🥚</span>
            <span className="text-sm sm:text-base mt-1">しょうかん</span>
          </button>

          {/* ③ 📖ずかん */}
          <button
            type="button"
            onClick={() => handleSelectTab('zukan')}
            className={`min-h-[64px] rounded-2xl font-black flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border-2 ${
              activeTab === 'zukan'
                ? 'bg-gradient-to-b from-cyan-400 to-blue-600 text-white border-white shadow-[0_0_20px_rgba(56,189,248,0.6)]'
                : 'bg-slate-800/90 text-slate-200 border-white/10 hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl leading-none">📖</span>
            <span className="text-sm sm:text-base mt-1">
              ずかん ({unlockedKaijuIds.length})
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
