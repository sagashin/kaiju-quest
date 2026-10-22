'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Sparkles, CheckCircle2, HelpCircle, ArrowRight, Trophy } from 'lucide-react';
import {
  KaijuData,
  QuizQuestion,
  generateQuizQuestion,
  getElementMeta,
  getTypeMeta,
} from '@/lib/kaiju-data';
import { KaijuSvgIllustration } from '@/components/kaiju-artwork';
import {
  playTapSound,
  playQuizCorrectSound,
  playQuizWrongSound,
  playBattleVictorySound,
  speakJapanese,
} from '@/lib/sound-and-speech';

export interface KaijuQuizProps {
  soundEnabled: boolean;
  onQuizClearReward: () => void;
}

export function KaijuQuiz({ soundEnabled, onQuizClearReward }: KaijuQuizProps) {
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedWrongIds, setSelectedWrongIds] = useState<string[]>([]);
  const [isCorrectAnswered, setIsCorrectAnswered] = useState<boolean>(false);
  const [wrongMessage, setWrongMessage] = useState<string | null>(null);
  const [isSetCompleted, setIsSetCompleted] = useState<boolean>(false);

  const loadNewQuestion = useCallback(
    (qNum: number, excludeList: string[]) => {
      const q = generateQuizQuestion(excludeList);
      setCurrentQuestion(q);
      setSelectedWrongIds([]);
      setIsCorrectAnswered(false);
      setWrongMessage(null);
      setTimeout(() => {
        speakJapanese(`だい ${qNum} もん！ ${q.speechQuestion}`, soundEnabled);
      }, 150);
    },
    [soundEnabled]
  );

  useEffect(() => {
    loadNewQuestion(1, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRepeatQuestion = () => {
    if (!currentQuestion) return;
    playTapSound(580);
    speakJapanese(`だい ${questionNumber} もん！ ${currentQuestion.speechQuestion}`, soundEnabled);
  };

  const handleSelectChoice = (choice: KaijuData) => {
    if (!currentQuestion || isCorrectAnswered) return;

    if (choice.id === currentQuestion.correctKaiju.id) {
      // 正解！
      setIsCorrectAnswered(true);
      setWrongMessage(null);
      playQuizCorrectSound();
      speakJapanese(
        `ピンポンピンポーン！だいせいかい！さすが じょうくん、天才だね！ ${currentQuestion.explanation}`,
        soundEnabled
      );
    } else {
      // 不正解（もういちど選べる親切設計）
      if (!selectedWrongIds.includes(choice.id)) {
        setSelectedWrongIds((prev) => [...prev, choice.id]);
      }
      playQuizWrongSound();
      setWrongMessage(`「${choice.name}」じゃ ないみたい！ おしい！ もういちど えらんでみてね！`);
      speakJapanese(
        `おっとー！${choice.name} じゃないみたい！おしい！もういちど えらんでみてね！`,
        soundEnabled
      );
    }
  };

  const handleNextStep = () => {
    if (!currentQuestion) return;
    playTapSound(640);

    const nextUsed = [...usedIds, currentQuestion.correctKaiju.id];
    setUsedIds(nextUsed);

    if (questionNumber >= 3) {
      // 3問クリア！ごほうび画面へ
      setIsSetCompleted(true);
      playBattleVictorySound();
      onQuizClearReward();
      speakJapanese(
        'キターーー！クイズ 3もん ぜんぶ クリア！おめでとう！ごほうびに けいけんち玉 2こと、ほし玉 1こを ゲットしたよ！神ってるー！',
        soundEnabled
      );
    } else {
      const nextNum = questionNumber + 1;
      setQuestionNumber(nextNum);
      loadNewQuestion(nextNum, nextUsed);
    }
  };

  const handleStartNextSet = () => {
    playTapSound(660);
    setIsSetCompleted(false);
    setQuestionNumber(1);
    loadNewQuestion(1, usedIds.slice(-12));
  };

  if (!currentQuestion) return null;

  // 3問クリア時のごほうびリザルト画面
  if (isSetCompleted) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="rounded-3xl bg-gradient-to-b from-amber-500/30 via-purple-900/80 to-slate-950 border-4 border-yellow-300 p-5 text-center shadow-[0_0_40px_rgba(250,204,21,0.4)] space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400 text-slate-950 font-black text-sm shadow">
            <Trophy className="w-4 h-4" />
            <span>クイズたいかい パーフェクト達成！！</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow">
            🎉 3もん ぜんぶ クリア！
            <br />
            <span className="text-yellow-300 text-xl sm:text-2xl">
              こんちゅう＆かいじゅう はかせだね！
            </span>
          </h2>

          {/* スター3つ点灯 */}
          <div className="flex items-center justify-center gap-3 text-4xl sm:text-5xl py-1">
            <span className="animate-bounce">⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>
              🌟
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
              ⭐
            </span>
          </div>

          {/* ごほうびボックス */}
          <div className="dq-window p-4 text-white space-y-2 max-w-md mx-auto">
            <div className="text-xs font-black text-yellow-300">🎁 はかせからの ごほうび！</div>
            <div className="flex items-center justify-center gap-4 text-base sm:text-lg font-black">
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/30 border border-amber-300 text-amber-200">
                🌟 けいけんち玉 ＋2こ
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-orange-500/30 border border-orange-300 text-orange-200">
                🟠 ほし玉 ＋1こ
              </span>
            </div>
            <p className="text-xs font-bold text-slate-300">
              ほし玉が 7つ あつまると、でんせつの 神龍（シェンロン）を よべるぞ！
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartNextSet}
            className="min-h-[64px] w-full max-w-md mx-auto rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black text-lg sm:text-xl border-2 border-white shadow-[0_0_25px_rgba(52,211,153,0.7)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-6 h-6 fill-slate-950" />
            <span>つぎの 3もんに ちょうせんする！</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 上部ヘッダー：問題番号 ＆ スター進行度 */}
      <div className="rounded-2xl bg-slate-900/90 border-2 border-indigo-400/50 p-3 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm sm:text-base shadow">
            だい {questionNumber} もん / 3
          </span>
          <span className="text-xs sm:text-sm font-black text-indigo-200">
            🎓 3もんクリアで 🟠ほし玉ゲット！
          </span>
        </div>

        {/* スター表示 */}
        <div className="flex items-center gap-1 text-xl sm:text-2xl">
          {[1, 2, 3].map((num) => {
            const earned =
              num < questionNumber || (num === questionNumber && isCorrectAnswered);
            return (
              <span
                key={num}
                className={`transition-all duration-300 ${
                  earned ? 'scale-110 opacity-100' : 'opacity-30 grayscale'
                }`}
              >
                ⭐
              </span>
            );
          })}
        </div>
      </div>

      {/* 問題文ウィンドウ ＆ 音声読み上げボタン */}
      <div className="dq-window p-3.5 sm:p-4 text-white space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-yellow-300 font-black text-xs sm:text-sm">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>どーれだ！？ 3つの中から タップしてね！</span>
          </div>

          <button
            type="button"
            onClick={handleRepeatQuestion}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>🔊 もんだいを きく</span>
          </button>
        </div>

        <p className="text-sm sm:text-base font-black leading-relaxed whitespace-pre-line text-white">
          {currentQuestion.questionText}
        </p>
      </div>

      {/* おしい！メッセージ（不正解時） */}
      {wrongMessage && !isCorrectAnswered && (
        <div className="rounded-2xl bg-rose-950/90 border-2 border-rose-400 p-2.5 text-center text-rose-100 font-black text-xs sm:text-sm animate-bounce">
          💡 {wrongMessage}
        </div>
      )}

      {/* 正解時のドラクエ風解説＆次へボタン */}
      {isCorrectAnswered && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border-2 border-yellow-300 p-3.5 text-white shadow-[0_0_25px_rgba(52,211,153,0.4)] space-y-2.5 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-yellow-300 font-black text-base sm:text-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <span>⭕ だいせいかい！！ さすがだね！</span>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/30 border border-emerald-300 text-emerald-200">
              {currentQuestion.correctKaiju.name}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed">
            🎓 {currentQuestion.explanation}
          </p>

          <button
            type="button"
            onClick={handleNextStep}
            className="min-h-[54px] w-full rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-slate-950 font-black text-base sm:text-lg border-2 border-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>
              {questionNumber >= 3
                ? '🎁 ごほうびを うけとる！'
                : `つぎの もんだいへ すすむ！（${questionNumber + 1}/3）`}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 3択イラストカードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {currentQuestion.choices.map((choice, idx) => {
          const elMeta = getElementMeta(choice.element);
          const typeMeta = getTypeMeta(choice.type);
          const isWrongPicked = selectedWrongIds.includes(choice.id);
          const isThisCorrect =
            isCorrectAnswered && choice.id === currentQuestion.correctKaiju.id;

          return (
            <button
              key={choice.id}
              type="button"
              disabled={isCorrectAnswered || isWrongPicked}
              onClick={() => handleSelectChoice(choice)}
              className={`relative rounded-2xl p-3 border-2 transition-all flex sm:flex-col items-center gap-3 text-left sm:text-center cursor-pointer active:scale-95 ${
                isThisCorrect
                  ? 'bg-gradient-to-b from-amber-500/40 to-emerald-900/80 border-yellow-300 ring-4 ring-yellow-300/60 shadow-[0_0_25px_rgba(250,204,21,0.6)] scale-[1.02]'
                  : isWrongPicked
                  ? 'bg-slate-950/60 border-slate-800 opacity-45 cursor-not-allowed'
                  : 'bg-slate-900/90 hover:bg-slate-800/90 border-white/20 hover:border-amber-300 shadow-md'
              }`}
            >
              {/* 番号バッジ */}
              <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-slate-950/90 border border-white/30 text-amber-300 font-black text-xs flex items-center justify-center">
                {idx + 1}
              </div>

              {/* 正解・不正解スタンプ */}
              {isThisCorrect && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-black text-xs shadow">
                  ⭕ せいかい！
                </div>
              )}
              {isWrongPicked && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-xs">
                  ✖ ちがうよ
                </div>
              )}

              {/* イラスト */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center mx-auto">
                <KaijuSvgIllustration
                  element={choice.element}
                  type={choice.type}
                  kaijuId={choice.id}
                  category={choice.category}
                  realColors={choice.realColors}
                  insectStyle={choice.insectStyle}
                  evolutionStage={2}
                />
              </div>

              {/* 名前＆属性バッジ */}
              <div className="flex-1 min-w-0 sm:w-full">
                <div className="flex items-center sm:justify-center gap-1 text-[11px] font-bold text-slate-300 mb-0.5">
                  <span>{elMeta.emoji}</span>
                  <span>{typeMeta.emoji}</span>
                  <span className="truncate">{choice.titleBadge}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-white truncate">
                  {choice.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
