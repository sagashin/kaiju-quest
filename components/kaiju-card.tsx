'use client';

import React, { useState } from 'react';
import { Volume2, Sparkles, Zap } from 'lucide-react';
import { KaijuData, getElementMeta, getTypeMeta } from '@/lib/kaiju-data';
import { KaijuSvgIllustration } from '@/components/kaiju-artwork';
import { playSpecialAttackSound, speakJapanese, fireSummonConfetti } from '@/lib/sound-and-speech';

interface KaijuCardProps {
  kaiju: KaijuData;
  soundEnabled: boolean;
  isNewUnlock?: boolean;
  onClose?: () => void;
  closeButtonLabel?: string;
}

export function KaijuHeroCard({
  kaiju,
  soundEnabled,
  isNewUnlock = false,
  onClose,
  closeButtonLabel = 'とじる',
}: KaijuCardProps) {
  const [isAttacking, setIsAttacking] = useState(false);
  const elMeta = getElementMeta(kaiju.element);
  const typeMeta = getTypeMeta(kaiju.type);

  const handlePlayVoiceAndAttack = () => {
    setIsAttacking(true);
    playSpecialAttackSound();
    fireSummonConfetti(elMeta.confettiColors);
    speakJapanese(
      `ブンブン！${kaiju.roar} ぼくは、${kaiju.name}！ ひっさつわざは、${kaiju.specialMove} だ！これマジでやばいねー！`,
      soundEnabled
    );
    setTimeout(() => {
      setIsAttacking(false);
    }, 1100);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* キラキラ黄金＆属性グラデーション枠の怪獣カード */}
      <div
        className={`relative rounded-3xl p-1.5 bg-gradient-to-br ${elMeta.bgGradient} shadow-[0_0_40px_rgba(250,204,21,0.5)] transition-transform duration-200 ${
          isAttacking ? 'scale-[1.03]' : ''
        }`}
      >
        {/* NEWバッジ */}
        {isNewUnlock && (
          <div className="absolute -top-4 -right-2 z-30 bg-amber-400 text-slate-950 font-black text-base px-4 py-1.5 rounded-full border-2 border-white shadow-lg animate-bounce">
            ✨ あたらしい かいじゅう！
          </div>
        )}

        <div className="relative rounded-[20px] bg-slate-900/95 p-4 sm:p-5 overflow-hidden border border-white/25">
          {/* ホログラムのキラキラ反射レイヤー */}
          <div className="pointer-events-none absolute inset-0 animate-holo opacity-40" />

          {/* カード上部：図鑑ナンバー・属性・タイプ */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-sm font-black text-amber-300 tabular-nums">
              <span>No.{String(kaiju.dexNumber).padStart(2, '0')}</span>
              <span aria-hidden="true">·</span>
              <span className="text-white/90">{kaiju.titleBadge}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xl bg-slate-800/90 px-3 py-1 rounded-xl border border-white/15">
              <span>{elMeta.emoji}</span>
              <span>{typeMeta.emoji}</span>
            </div>
          </div>

          {/* 怪獣の名前 */}
          <div className="relative z-10 text-center my-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {kaiju.name}
            </h2>
          </div>

          {/* つよさ星マーク */}
          <div className="relative z-10 flex items-center justify-center gap-1 my-1.5">
            <span className="text-xs font-extrabold text-amber-200 mr-1">つよさ</span>
            {Array.from({ length: 5 }).map((_, idx) => (
              <span
                key={idx}
                className={`text-xl leading-none ${
                  idx < kaiju.stars
                    ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]'
                    : 'text-slate-600'
                }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* 中央：怪獣SVGイラストステージ（タップでも必殺技発動！） */}
          <button
            type="button"
            onClick={handlePlayVoiceAndAttack}
            className="relative z-10 w-full h-56 sm:h-64 my-2 rounded-2xl bg-slate-950/80 border-2 border-white/20 flex items-center justify-center overflow-hidden group cursor-pointer active:scale-95 transition-transform"
            aria-label={`${kaiju.name}のひっさつわざを発動`}
          >
            {/* 鳴き声吹き出し */}
            <div className="absolute top-2.5 left-2.5 z-20 bg-white text-slate-950 font-black text-sm sm:text-base px-3 py-1 rounded-xl shadow-md border-2 border-amber-400">
              {kaiju.roar}
            </div>

            <div className="w-48 h-48 sm:w-56 sm:h-56">
              <KaijuSvgIllustration
                element={kaiju.element}
                type={kaiju.type}
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

          {/* 必殺技ボックス */}
          <div
            className={`relative z-10 rounded-2xl p-3.5 bg-gradient-to-r ${elMeta.bgGradient} text-white shadow-lg border-2 border-white/40 mt-2`}
          >
            <div className="flex items-center gap-1.5 text-xs font-black text-yellow-200">
              <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span>ひっさつわざ</span>
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-tight mt-0.5 drop-shadow">
              {kaiju.specialMove}
            </div>
          </div>

          {/* せつめい文 */}
          <p className="relative z-10 text-sm font-bold text-slate-200 mt-3 leading-relaxed bg-slate-800/70 rounded-xl p-3 border border-white/10">
            {kaiju.description}
          </p>

          {/* アクションボタン（60px以上の特大タップ領域） */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              onClick={handlePlayVoiceAndAttack}
              className="min-h-[62px] w-full rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-lg flex items-center justify-center gap-2 shadow-[0_5px_0_#b45309] transition-all cursor-pointer px-4 whitespace-nowrap shrink-0"
            >
              <Volume2 className="w-6 h-6 shrink-0" />
              <span>ひっさつわざ！</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="min-h-[62px] w-full rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-lg flex items-center justify-center gap-2 border-2 border-white/25 transition-all cursor-pointer px-4 whitespace-nowrap shrink-0"
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
