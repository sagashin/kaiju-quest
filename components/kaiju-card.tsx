'use client';

import React, { useState } from 'react';
import { Volume2, Sparkles, Zap, Lock, Crown, HeartHandshake } from 'lucide-react';
import {
  KaijuData,
  KaijuProgress,
  KaijuSkill,
  EvolutionStage,
  getElementMeta,
  getTypeMeta,
  getKaijuStats,
  MAX_KAIJU_LEVEL,
} from '@/lib/kaiju-data';
import { KaijuSvgIllustration } from '@/components/kaiju-artwork';
import {
  playTapSound,
  playSpecialAttackSound,
  playLevelUpSound,
  playEvolutionSound,
  speakJapanese,
  fireSummonConfetti,
} from '@/lib/sound-and-speech';

export interface KaijuCardProps {
  kaiju: KaijuData;
  soundEnabled: boolean;
  isNewUnlock?: boolean;
  progress?: KaijuProgress;
  expOrbs?: number;
  isPartner?: boolean;
  onLevelUp?: (kaijuId: string) => void;
  onSelectPartner?: (kaijuId: string) => void;
  onClose?: () => void;
  closeButtonLabel?: string;
}

export function KaijuHeroCard({
  kaiju,
  soundEnabled,
  isNewUnlock = false,
  progress,
  expOrbs = 0,
  isPartner = false,
  onLevelUp,
  onSelectPartner,
  onClose,
  closeButtonLabel = 'とじる',
}: KaijuCardProps) {
  const [isAttacking, setIsAttacking] = useState(false);
  const [activeSkillBanner, setActiveSkillBanner] = useState<string | null>(null);
  const [previewStage, setPreviewStage] = useState<EvolutionStage | null>(null);
  const [levelUpMessages, setLevelUpMessages] = useState<string[] | null>(null);

  const elMeta = getElementMeta(kaiju.element);
  const typeMeta = getTypeMeta(kaiju.type);
  const stats = getKaijuStats(kaiju, progress);
  const isInsect = kaiju.category === 'insect';

  // プレビュー選択中ならその形態、未選択なら現在のレベルの進化形態を表示
  const displayedStage: EvolutionStage =
    previewStage && previewStage <= stats.stage ? previewStage : stats.stage;

  const displayedName =
    displayedStage === 1
      ? kaiju.stageNames?.[0] ?? (isInsect ? `ちび${kaiju.name}` : `プチ${kaiju.name}`)
      : displayedStage === 2
      ? kaiju.stageNames?.[1] ?? kaiju.name
      : kaiju.stageNames?.[2] ?? (isInsect ? `ギネス級${kaiju.name}` : `キング${kaiju.name}`);

  const handlePlaySkillAttack = (skill?: KaijuSkill) => {
    const moveName = skill ? skill.name : kaiju.specialMove;
    setIsAttacking(true);
    setActiveSkillBanner(moveName);
    playSpecialAttackSound();
    fireSummonConfetti(elMeta.confettiColors);
    speakJapanese(
      `ブンブン！${kaiju.roar} ぼくは、${displayedName}！ くらえっ、${moveName} だーっ！これマジでやばいねー！`,
      soundEnabled
    );
    setTimeout(() => {
      setIsAttacking(false);
    }, 1200);
  };

  const handleOneTapLevelUp = () => {
    if (!onLevelUp) return;

    if (stats.level >= MAX_KAIJU_LEVEL) {
      playTapSound(320);
      speakJapanese(
        'この なかまは もう レベルMAX（Lv.10）の 究極キングだよ！ほかの なかまを そだててね！',
        soundEnabled
      );
      return;
    }

    if (expOrbs <= 0) {
      playTapSound(340);
      speakJapanese(
        'おっとー！けいけんち玉が たりないよ！お支度クエストをクリアするか、バトルをして けいけんち玉を ゲットしよう！',
        soundEnabled
      );
      return;
    }

    const oldStats = stats;
    // 親コンポーネントのレベルアップ処理を実行（EXP+50加算）
    onLevelUp(kaiju.id);
    setPreviewStage(null);

    // 次の予測ステータス（100EXPごとにレベルアップ）
    const nextExpTotal = oldStats.exp + 50;
    const nextLvCandidate = Math.min(
      MAX_KAIJU_LEVEL,
      oldStats.level + (nextExpTotal >= 100 ? 1 : 0)
    );
    const nextStats = getKaijuStats(kaiju, {
      level: nextLvCandidate,
      exp: nextExpTotal >= 100 ? nextExpTotal - 100 : nextExpTotal,
    });
    const leveledUp = nextStats.level > oldStats.level;
    const didEvolve = nextStats.stage > oldStats.stage;
    const reachedMax = nextStats.level >= MAX_KAIJU_LEVEL && oldStats.level < MAX_KAIJU_LEVEL;
    const newlyUnlockedSkill = nextStats.allSkills.find((s) => s.unlockLevel === nextStats.level);

    if (leveledUp) {
      const hpDiff = nextStats.maxHp - oldStats.maxHp;
      const mpDiff = nextStats.maxMp - oldStats.maxMp;
      const atkDiff = nextStats.attack - oldStats.attack;

      const msgs: string[] = [
        `🎉 ${oldStats.displayName}は レベル ${nextStats.level} に あがった！`,
        `💪 さいだいHP ＋${hpDiff} ／ MP ＋${mpDiff} ／ ちから ＋${atkDiff} アップ！`,
      ];

      let speech = `テレレレッテッテッテー！${oldStats.displayName}は レベル ${nextStats.level} に あがったぞ！ちからが ぐんぐん あがった！`;

      if (newlyUnlockedSkill) {
        msgs.push(`✨ あたらしい わざ『${newlyUnlockedSkill.name}』を おぼえた！`);
        speech += ` さらに、あたらしい わざ、${newlyUnlockedSkill.name} を おぼえたよ！`;
      }

      if (reachedMax) {
        msgs.push(
          `👑 ついに レベルMAX（Lv.10）とうたつ！！ 『${nextStats.displayName}』の 究極完全体になったぞーーっ！！`
        );
        speech += ` ついに、レベルMAXの 究極完全体になったぞーっ！やばすぎるーー！！`;
        playEvolutionSound();
        fireSummonConfetti(['#facc15', '#fef08a', '#f97316', '#ffffff', '#ec4899']);
      } else if (didEvolve) {
        msgs.push(
          `🌟 おや…！？ ${oldStats.displayName}の ようすが…！ 『${nextStats.displayName}』に しんかした！！`
        );
        speech += ` うおおおーっ！おや！？ ${oldStats.displayName}の ようすが…！ なんと、${nextStats.displayName} に しんかしたーっ！神ってるー！`;
        playEvolutionSound();
        fireSummonConfetti(['#facc15', '#fef08a', '#f97316', '#ffffff']);
      } else {
        playLevelUpSound();
        fireSummonConfetti(elMeta.confettiColors);
      }

      setLevelUpMessages(msgs);
      setIsAttacking(true);
      speakJapanese(speech, soundEnabled);
    } else {
      playTapSound(520);
      setLevelUpMessages([
        `🌟 ${oldStats.displayName}に けいけんち＋50 を あたえた！`,
        `📈 つぎのレベルまで あと ${100 - (oldStats.exp + 50)} EXP！`,
      ]);
      speakJapanese(
        `けいけんち玉を あげたよ！あとちょっとで レベルアップだ！`,
        soundEnabled
      );
    }

    setTimeout(() => {
      setIsAttacking(false);
    }, 1100);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* キラキラ黄金＆属性グラデーション枠の怪獣カード */}
      <div
        className={`relative rounded-3xl p-1.5 bg-gradient-to-br ${elMeta.bgGradient} shadow-[0_0_40px_rgba(250,204,21,0.5)] transition-transform duration-200 ${
          isAttacking ? 'scale-[1.02]' : ''
        }`}
      >
        {/* NEWバッジ */}
        {isNewUnlock && (
          <div className="absolute -top-4 -right-2 z-30 bg-amber-400 text-slate-950 font-black text-base px-4 py-1.5 rounded-full border-2 border-white shadow-lg animate-bounce">
            {isInsect ? '✨ あたらしい こんちゅう！' : '✨ あたらしい かいじゅう！'}
          </div>
        )}

        <div className="relative rounded-[20px] bg-slate-900/95 p-4 sm:p-5 overflow-hidden border border-white/25 space-y-3">
          {/* ホログラムのキラキラ反射レイヤー */}
          <div className="pointer-events-none absolute inset-0 animate-holo opacity-35" />

          {/* カード上部：図鑑ナンバー・形態タイトル・属性・タイプ */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-black text-amber-300 tabular-nums">
              <span>No.{String(kaiju.dexNumber).padStart(2, '0')}</span>
              <span aria-hidden="true">·</span>
              <span className="bg-amber-400/20 text-amber-200 border border-amber-400/50 px-2 py-0.5 rounded-full text-xs">
                {stats.stageTitle}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xl bg-slate-800/90 px-3 py-1 rounded-xl border border-white/15 shrink-0">
              <span>{elMeta.emoji}</span>
              <span>{typeMeta.emoji}</span>
            </div>
          </div>

          {/* 怪獣の名前＆レベルバッジ */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-slate-950/90 border-2 border-amber-400 px-3.5 py-0.5 rounded-full mb-1 shadow">
              <span className="text-xs font-black text-amber-300">レベル</span>
              <span className="text-lg sm:text-xl font-black text-yellow-300 tabular-nums">
                Lv.{stats.level} / {MAX_KAIJU_LEVEL}
              </span>
              {stats.level >= MAX_KAIJU_LEVEL && (
                <span className="bg-gradient-to-r from-yellow-400 via-rose-500 to-purple-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow">
                  👑 MAX
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {displayedName}
            </h2>
          </div>

          {/* 進化段階プレビュー切り替えボタン（Lv3以上で解放された形態を見比べられる） */}
          {stats.stage >= 2 && (
            <div className="relative z-10 flex items-center justify-center gap-1.5">
              {([1, 2, 3] as EvolutionStage[]).map((st) => {
                const isUnlockedStage = st <= stats.stage;
                const isSelected = displayedStage === st;
                const label = isInsect
                  ? st === 1
                    ? '🌱ちび'
                    : st === 2
                    ? '🪲成虫'
                    : '👑ギネス級'
                  : st === 1
                  ? '★キッズ'
                  : st === 2
                  ? '★★せいちょう'
                  : '★★★キング';
                return (
                  <button
                    key={st}
                    type="button"
                    disabled={!isUnlockedStage}
                    onClick={() => {
                      playTapSound(580);
                      setPreviewStage(st);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-white shadow'
                        : isUnlockedStage
                        ? 'bg-slate-800 text-slate-200 border-white/20 hover:bg-slate-700'
                        : 'bg-slate-950/60 text-slate-600 border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {isUnlockedStage ? label : `🔒${label}`}
                  </button>
                );
              })}
            </div>
          )}

          {/* 中央：怪獣SVGイラストステージ（タップでも必殺技発動！） */}
          <button
            type="button"
            onClick={() => handlePlaySkillAttack()}
            className="relative z-10 w-full h-52 sm:h-60 rounded-2xl bg-slate-950/80 border-2 border-white/20 flex items-center justify-center overflow-hidden group cursor-pointer active:scale-95 transition-transform"
            aria-label={`${displayedName}のひっさつわざを発動`}
          >
            {/* 鳴き声吹き出し */}
            <div className="absolute top-2.5 left-2.5 z-20 bg-white text-slate-950 font-black text-xs sm:text-sm px-3 py-1 rounded-xl shadow-md border-2 border-amber-400">
              {kaiju.roar}
            </div>

            {/* 発動中の技名カットイン */}
            {isAttacking && activeSkillBanner && (
              <div className="absolute top-2.5 right-2.5 z-30 bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs sm:text-sm px-3 py-1 rounded-xl border-2 border-white shadow-xl animate-bounce">
                ⚡ {activeSkillBanner}！
              </div>
            )}

            <div className="w-44 h-44 sm:w-52 sm:h-52">
              <KaijuSvgIllustration
                element={kaiju.element}
                type={kaiju.type}
                kaijuId={kaiju.id}
                category={kaiju.category}
                insectStyle={kaiju.insectStyle}
                realColors={kaiju.realColors}
                evolutionStage={displayedStage}
                isAttacking={isAttacking}
              />
            </div>

            {/* 必殺技フラッシュ演出 */}
            {isAttacking && (
              <div className="absolute inset-0 bg-white/30 animate-ping pointer-events-none" />
            )}

            <div className="absolute bottom-2 right-2.5 z-20 flex items-center gap-1 text-xs font-bold text-amber-300 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-amber-400/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>タップで ほえる！</span>
            </div>
          </button>

          {/* 4歳児向けワンタップ「⚡レベルアップ！」特大ボタン ＆ あいぼうボタン */}
          {(onLevelUp || onSelectPartner) && (
            <div className="relative z-10 space-y-2">
              {onLevelUp && (
                stats.level >= MAX_KAIJU_LEVEL ? (
                  <button
                    type="button"
                    disabled
                    className="min-h-[64px] w-full rounded-2xl p-3 font-black text-base sm:text-lg flex items-center justify-center gap-2 border-2 bg-slate-900/90 border-yellow-400/60 text-yellow-300 shadow cursor-default"
                  >
                    <span className="text-2xl">👑</span>
                    <span>レベルMAX（究極完全体）！</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleOneTapLevelUp}
                    className={`min-h-[64px] w-full rounded-2xl p-3 font-black text-base sm:text-lg flex items-center justify-center gap-2 border-2 transition-all active:scale-95 cursor-pointer shadow-lg ${
                      expOrbs > 0
                        ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 text-slate-950 border-white shadow-[0_5px_0_#b45309,0_0_25px_rgba(250,204,21,0.7)]'
                        : 'bg-slate-800 text-slate-400 border-slate-600'
                    }`}
                  >
                    <span className="text-2xl">🌟</span>
                    <span>けいけんち玉で 育成！（のこり {expOrbs}こ・EXP+50）</span>
                  </button>
                )
              )}

              {onSelectPartner && (
                <button
                  type="button"
                  onClick={() => {
                    playTapSound(640);
                    onSelectPartner(kaiju.id);
                    speakJapanese(
                      `やったー！${displayedName}を あいぼうに したよ！いっしょに クエストを がんばろう！`,
                      soundEnabled
                    );
                  }}
                  className={`min-h-[52px] w-full rounded-2xl px-4 py-2 font-black text-sm sm:text-base flex items-center justify-center gap-2 border-2 transition-all active:scale-95 cursor-pointer ${
                    isPartner
                      ? 'bg-emerald-500 text-slate-950 border-white shadow-md'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border-emerald-400/50'
                  }`}
                >
                  <HeartHandshake className="w-5 h-5 shrink-0" />
                  <span>
                    {isPartner
                      ? '🤝 いまの「あいぼう」だよ！（いっしょに成長中）'
                      : '🤝 この かいじゅうを「あいぼう」にする'}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* ドラクエ風レベルアップ＆進化実況ウィンドウ（レベルアップ時に出現！） */}
          {levelUpMessages && (
            <div className="relative z-20 dq-window p-3.5 text-white space-y-1.5 animate-bounce">
              <div className="text-xs font-black text-yellow-300 flex items-center justify-between">
                <span>🎺 レベルアップ じっきょう！</span>
                <button
                  type="button"
                  onClick={() => setLevelUpMessages(null)}
                  className="text-[11px] text-slate-300 underline cursor-pointer"
                >
                  とじる
                </button>
              </div>
              {levelUpMessages.map((line, i) => (
                <p key={i} className="text-sm sm:text-base font-black leading-snug">
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* ドラゴンクエスト風ステータスボックス（.dq-window） */}
          <div className="relative z-10 dq-window p-3.5 text-white space-y-2.5">
            <div className="flex items-center justify-between border-b-2 border-white/20 pb-2">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400 shrink-0" />
                <span className="text-base sm:text-lg font-black text-yellow-300 tabular-nums">
                  Lv.{stats.level} / {MAX_KAIJU_LEVEL}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  （つぎの進化: {stats.level < 5 ? 'Lv.5 せいちょう期' : stats.level < 10 ? 'Lv.10 キング形態' : '👑究極キングMAX！'}）
                </span>
              </div>
              <span className="text-xs font-black text-amber-200 tabular-nums">
                EXP {stats.exp}/100
              </span>
            </div>

            {/* EXPバー */}
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/20">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
                style={{ width: `${Math.min(100, stats.exp)}%` }}
              />
            </div>

            {/* HP / MP ゲージ */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-slate-900/90 rounded-xl p-2 border border-emerald-400/40">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-emerald-300">ＨＰ（たいりょく）</span>
                  <span className="text-white tabular-nums">{stats.maxHp}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden mt-1">
                  <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-lime-400" />
                </div>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-2 border border-cyan-400/40">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-cyan-300">ＭＰ（マジック）</span>
                  <span className="text-white tabular-nums">{stats.maxMp}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden mt-1">
                  <div className="h-full w-full bg-gradient-to-r from-cyan-500 to-sky-400" />
                </div>
              </div>
            </div>

            {/* ちから / みのまもり / すばやさ */}
            <div className="grid grid-cols-3 gap-2 text-center pt-0.5">
              <div className="bg-slate-900/80 rounded-lg py-1.5 px-2 border border-white/10">
                <div className="text-[11px] font-bold text-orange-300">⚔️ ちから</div>
                <div className="text-base font-black text-white tabular-nums">{stats.attack}</div>
              </div>
              <div className="bg-slate-900/80 rounded-lg py-1.5 px-2 border border-white/10">
                <div className="text-[11px] font-bold text-sky-300">🛡️ まもり</div>
                <div className="text-base font-black text-white tabular-nums">{stats.defense}</div>
              </div>
              <div className="bg-slate-900/80 rounded-lg py-1.5 px-2 border border-white/10">
                <div className="text-[11px] font-bold text-lime-300">💨 すばやさ</div>
                <div className="text-base font-black text-white tabular-nums">{stats.speed}</div>
              </div>
            </div>
          </div>

          {/* 習得した「わざリスト」セクション（全4つ） */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-amber-300 px-1">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                おぼえた わざ（タップで わざを だすよ！）
              </span>
              <span>{stats.unlockedSkills.length} / 4</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {stats.allSkills.map((skill) => {
                const isUnlocked = stats.level >= skill.unlockLevel;
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => {
                      if (isUnlocked) {
                        handlePlaySkillAttack(skill);
                      } else {
                        playTapSound(350);
                        speakJapanese(
                          `このわざは レベル ${skill.unlockLevel} に なると おぼえるよ！たのしみだね！`,
                          soundEnabled
                        );
                      }
                    }}
                    className={`w-full rounded-xl p-2.5 text-left border-2 transition-all flex items-center justify-between gap-2 cursor-pointer active:scale-95 ${
                      isUnlocked
                        ? skill.isUltimate
                          ? 'bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-purple-600/30 border-yellow-300 text-white shadow'
                          : 'bg-slate-800/90 hover:bg-slate-800 border-white/25 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {isUnlocked ? (
                          <span className="text-sm font-black text-yellow-300">
                            {skill.isUltimate ? '👑究極' : `Lv.${skill.unlockLevel}`}
                          </span>
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="text-sm sm:text-base font-black truncate">
                          {isUnlocked ? skill.name : `🔒 Lv.${skill.unlockLevel} で おぼえる！`}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-300 truncate mt-0.5">
                        {isUnlocked ? skill.description : 'レベルアップすると 強力な わざが つかえるぞ！'}
                      </p>
                    </div>

                    {isUnlocked && (
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-cyan-300 tabular-nums">
                          MP {skill.mpCost}
                        </div>
                        <div className="text-xs font-black text-amber-300 tabular-nums">
                          💥威力 {skill.power}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* せつめい文 */}
          <p className="relative z-10 text-xs sm:text-sm font-bold text-slate-200 leading-relaxed bg-slate-800/70 rounded-xl p-3 border border-white/10">
            {kaiju.description}
          </p>

          {/* 🎓 こんちゅう はかせメモ（昆虫モード時のみ出現） */}
          {kaiju.insectInfo && (
            <div className="relative z-10 rounded-2xl bg-gradient-to-br from-emerald-950/90 to-slate-900/95 border-2 border-emerald-400/50 p-3.5 space-y-2 text-white shadow-lg">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-1.5">
                <div className="flex items-center gap-1.5 text-emerald-300 font-black text-xs sm:text-sm">
                  <span>🎓</span>
                  <span>こんちゅう はかせメモ（ほんものの知識）</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playTapSound(600);
                    speakJapanese(
                      `${kaiju.name}の はかせメモ！ すんでいる場所は、${kaiju.insectInfo!.habitat}！ すきな食べ物は、${kaiju.insectInfo!.food}！ 大きさは、${kaiju.insectInfo!.realSize}！ はかせのヒミツ！ ${kaiju.insectInfo!.trivia}`,
                      soundEnabled
                    );
                  }}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow cursor-pointer active:scale-95 transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>はかせメモを きく！</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                <div className="bg-slate-900/80 rounded-xl p-2 border border-emerald-500/20">
                  <span className="text-emerald-400 font-black">🌍 すんでいる場所: </span>
                  <span className="text-slate-200 font-bold">{kaiju.insectInfo.habitat}</span>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-2 border border-emerald-500/20">
                  <span className="text-amber-300 font-black">🍯 すきな食べ物: </span>
                  <span className="text-slate-200 font-bold">{kaiju.insectInfo.food}</span>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-2 border border-emerald-500/20 sm:col-span-2">
                  <span className="text-cyan-300 font-black">📏 ほんものの大きさ: </span>
                  <span className="text-slate-200 font-bold">{kaiju.insectInfo.realSize}</span>
                </div>
              </div>

              <div className="bg-emerald-900/40 rounded-xl p-2.5 border border-emerald-400/30">
                <div className="text-xs font-black text-yellow-300 flex items-center gap-1 mb-1">
                  <span>💡</span>
                  <span>はかせのヒミツ！</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-emerald-100 leading-relaxed">
                  {kaiju.insectInfo.trivia}
                </p>
              </div>
            </div>
          )}

          {/* アクションボタン（60px以上の特大タップ領域） */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => handlePlaySkillAttack()}
              className="min-h-[60px] w-full rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-lg flex items-center justify-center gap-2 shadow-[0_5px_0_#b45309] transition-all cursor-pointer px-4 whitespace-nowrap shrink-0"
            >
              <Volume2 className="w-6 h-6 shrink-0" />
              <span>ひっさつわざ！</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="min-h-[60px] w-full rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-lg flex items-center justify-center gap-2 border-2 border-white/25 transition-all cursor-pointer px-4 whitespace-nowrap shrink-0"
              >
                <span>{closeButtonLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
