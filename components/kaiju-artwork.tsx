'use client';

import React from 'react';
import { ElementId, KaijuTypeId, getElementMeta } from '@/lib/kaiju-data';

interface EggProps {
  element: ElementId;
  type: KaijuTypeId;
  isShaking?: boolean;
}

export function MonsterEggSvg({ element, type, isShaking = false }: EggProps) {
  const elMeta = getElementMeta(element);

  return (
    <div className={`relative flex items-center justify-center select-none ${isShaking ? 'animate-egg-shake' : 'animate-float'}`}>
      {/* 背面の属性オーラ発光 */}
      <div
        className="absolute w-44 h-44 rounded-full blur-2xl opacity-75 transition-all duration-300"
        style={{
          background: `radial-gradient(circle, ${elMeta.accentHex} 0%, ${elMeta.primaryHex} 60%, transparent 100%)`,
        }}
      />

      <svg
        viewBox="0 0 220 240"
        className="w-44 h-48 relative z-10 drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)]"
        aria-label="かいじゅうのタマゴ"
      >
        <defs>
          <radialGradient id={`eggGrad-${element}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={elMeta.accentHex} />
            <stop offset="45%" stopColor={elMeta.secondaryHex} />
            <stop offset="100%" stopColor={elMeta.primaryHex} />
          </radialGradient>
          <linearGradient id="eggShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* 台座リング */}
        <ellipse cx="110" cy="215" rx="68" ry="14" fill="rgba(15,23,42,0.7)" stroke={elMeta.accentHex} strokeWidth="3" />
        <ellipse cx="110" cy="215" rx="48" ry="8" fill={elMeta.primaryHex} opacity="0.45" />

        {/* タマゴ本体 */}
        <path
          d="M110 20 C62 20, 36 96, 36 148 C36 192, 68 214, 110 214 C152 214, 184 192, 184 148 C184 96, 158 20, 110 20 Z"
          fill={`url(#eggGrad-${element})`}
          stroke="#ffffff"
          strokeWidth="5"
        />

        {/* 属性模様 */}
        {element === 'fire' && (
          <g fill={elMeta.accentHex} opacity="0.88">
            <path d="M75 165 C65 135, 85 115, 80 90 C98 112, 102 135, 92 165 Z" />
            <path d="M135 170 C125 140, 145 110, 138 82 C158 108, 160 140, 148 170 Z" />
            <circle cx="110" cy="70" r="10" />
          </g>
        )}
        {element === 'water' && (
          <g fill="none" stroke={elMeta.accentHex} strokeWidth="6" strokeLinecap="round" opacity="0.88">
            <path d="M55 120 Q82 105, 110 120 T165 120" />
            <path d="M48 155 Q80 140, 110 155 T172 155" />
            <circle cx="85" cy="75" r="8" fill={elMeta.accentHex} />
            <circle cx="135" cy="85" r="6" fill={elMeta.accentHex} />
          </g>
        )}
        {element === 'thunder' && (
          <g fill="#ffffff" opacity="0.92">
            <polygon points="115,42 82,105 112,105 92,175 145,100 114,100" />
          </g>
        )}
        {element === 'nature' && (
          <g fill={elMeta.accentHex} opacity="0.9">
            <path d="M110 55 C135 55, 145 85, 110 105 C75 85, 85 55, 110 55 Z" />
            <path d="M72 125 C95 120, 102 148, 75 162 C52 148, 55 125, 72 125 Z" />
            <path d="M148 125 C165 125, 168 148, 145 162 C118 148, 125 120, 148 125 Z" />
          </g>
        )}

        {/* 光沢ハイライト */}
        <ellipse
          cx="82"
          cy="78"
          rx="18"
          ry="34"
          transform="rotate(-22 82 78)"
          fill="url(#eggShine)"
        />

        {/* 揺れているときのヒビ割れ演出 */}
        {isShaking && (
          <path
            d="M80 95 L105 112 L94 134 L126 145 L115 170"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* 選択中のタイプアイコンバッジ */}
      <div className="absolute -bottom-1 right-2 z-20 w-14 h-14 rounded-2xl bg-slate-900/95 border-2 border-white shadow-xl flex items-center justify-center text-3xl">
        {type === 'dino' && '🦖'}
        {type === 'dragon' && '🐉'}
        {type === 'robot' && '🤖'}
        {type === 'beast' && '🦁'}
      </div>
    </div>
  );
}

interface KaijuArtProps {
  element: ElementId;
  type: KaijuTypeId;
  silhouette?: boolean;
  isAttacking?: boolean;
  className?: string;
}

/**
 * 16種類の属性×タイプに応じたカスタム怪獣SVGイラスト
 */
export function KaijuSvgIllustration({
  element,
  type,
  silhouette = false,
  isAttacking = false,
  className = 'w-full h-full',
}: KaijuArtProps) {
  const elMeta = getElementMeta(element);

  const primary = silhouette ? '#1e293b' : elMeta.primaryHex;
  const secondary = silhouette ? '#334155' : elMeta.secondaryHex;
  const accent = silhouette ? '#475569' : elMeta.accentHex;
  const eyeColor = silhouette ? '#0f172a' : '#fef08a';
  const outline = silhouette ? '#475569' : '#ffffff';

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 背面の属性エネルギー陣 */}
      {!silhouette && (
        <div
          className={`absolute inset-2 rounded-full blur-xl transition-transform duration-300 ${
            isAttacking ? 'scale-125 opacity-100' : 'scale-100 opacity-65'
          }`}
          style={{
            background: `radial-gradient(circle, ${accent} 0%, ${primary} 65%, transparent 100%)`,
          }}
        />
      )}

      <svg
        viewBox="0 0 260 260"
        className={`w-full h-full relative z-10 drop-shadow-[0_10px_18px_rgba(0,0,0,0.65)] ${
          isAttacking ? 'scale-110 transition-transform duration-200' : 'animate-float'
        }`}
      >
        {/* 共通の属性エフェクト背景リング */}
        {!silhouette && (
          <g opacity="0.45">
            <circle
              cx="130"
              cy="135"
              r="96"
              fill="none"
              stroke={accent}
              strokeWidth="3"
              strokeDasharray="12 8"
            />
            <circle
              cx="130"
              cy="135"
              r="82"
              fill="none"
              stroke={secondary}
              strokeWidth="2"
            />
          </g>
        )}

        {/* ==================== 1. きょうりゅう (DINO) ==================== */}
        {type === 'dino' && (
          <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
            {/* 巨大な尻尾 */}
            <path
              d="M75 185 Q22 175, 20 120 Q38 142, 78 152 Z"
              fill={primary}
            />
            {/* 背中の属性背ビレ・トゲ */}
            {element === 'fire' && (
              <path
                d="M72 72 L46 58 L68 98 L40 94 L66 128 L42 132 L72 155 Z"
                fill={accent}
              />
            )}
            {element === 'water' && (
              <path
                d="M78 65 C32 70, 28 135, 72 162 Z"
                fill={accent}
              />
            )}
            {element === 'thunder' && (
              <polygon
                points="78,60 40,75 68,100 32,115 68,138 42,155 76,165"
                fill={accent}
              />
            )}
            {element === 'nature' && (
              <g fill={accent}>
                <polygon points="85,48 45,32 72,78" />
                <polygon points="68,95 32,92 64,125" />
                <polygon points="68,132 38,142 72,160" />
              </g>
            )}

            {/* 胴体と強靭な脚 */}
            <ellipse cx="115" cy="162" rx="52" ry="48" fill={primary} />
            <ellipse cx="128" cy="166" rx="32" ry="34" fill={accent} stroke="none" opacity="0.85" />

            {/* 足とツメ */}
            <rect x="75" y="192" width="28" height="34" rx="10" fill={secondary} />
            <rect x="128" y="192" width="28" height="34" rx="10" fill={secondary} />
            <polygon points="72,226 82,216 88,226" fill={accent} />
            <polygon points="86,226 96,216 102,226" fill={accent} />
            <polygon points="125,226 135,216 141,226" fill={accent} />
            <polygon points="139,226 149,216 155,226" fill={accent} />

            {/* 恐竜の大きな頭とアゴ */}
            <path
              d="M82 115 C78 60, 125 46, 178 56 C215 62, 224 92, 212 108 L158 112 L206 128 C196 148, 152 152, 112 138 Z"
              fill={secondary}
            />

            {/* 鋭いキバ */}
            {!silhouette && (
              <g fill="#ffffff" stroke="#0f172a" strokeWidth="2">
                <polygon points="165,109 172,121 179,109" />
                <polygon points="182,109 189,122 196,109" />
                <polygon points="198,108 204,119 210,108" />
              </g>
            )}

            {/* 属性ごとの頭のツノ・クレスト */}
            <polygon points="118,56 96,24 138,50" fill={accent} />
            {element === 'nature' && (
              <polygon points="175,58 212,32 192,68" fill={accent} />
            )}

            {/* 腕 */}
            <path d="M138 142 L174 148 L166 164 L132 156 Z" fill={secondary} />

            {/* カッコいい目 */}
            {!silhouette && (
              <g>
                <polygon points="135,72 168,78 145,92" fill={eyeColor} stroke="#0f172a" strokeWidth="3" />
                <circle cx="152" cy="80" r="4" fill="#0f172a" stroke="none" />
              </g>
            )}
          </g>
        )}

        {/* ==================== 2. ドラゴン (DRAGON) ==================== */}
        {type === 'dragon' && (
          <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
            {/* 左右の巨大な翼 */}
            <path
              d="M95 125 L16 48 L28 112 L18 148 L56 145 L48 175 L102 155 Z"
              fill={secondary}
            />
            <path
              d="M165 125 L244 48 L232 112 L242 148 L204 145 L212 175 L158 155 Z"
              fill={secondary}
            />
            {/* 翼の膜ハイライト */}
            <path d="M88 130 L32 72 L46 135 Z" fill={accent} stroke="none" opacity="0.75" />
            <path d="M172 130 L228 72 L214 135 Z" fill={accent} stroke="none" opacity="0.75" />

            {/* ドラゴンの尻尾 */}
            <path d="M130 190 Q185 228, 226 192 L238 175 L214 178 Q178 202, 145 178 Z" fill={primary} />

            {/* ドラゴンのボディ＆アーマー腹 */}
            <ellipse cx="130" cy="155" rx="44" ry="52" fill={primary} />
            <ellipse cx="130" cy="160" rx="26" ry="38" fill={accent} stroke="none" opacity="0.9" />
            {/* お腹のライン */}
            {!silhouette && (
              <g stroke={primary} strokeWidth="3">
                <line x1="108" y1="142" x2="152" y2="142" />
                <line x1="106" y1="160" x2="154" y2="160" />
                <line x1="110" y1="178" x2="150" y2="178" />
              </g>
            )}

            {/* 2本の立派なツノ */}
            <path d="M106 64 L68 18 L92 74 Z" fill={accent} />
            <path d="M154 64 L192 18 L168 74 Z" fill={accent} />
            {/* 額のクリスタルクレスト */}
            <polygon points="130,34 116,62 130,74 144,62" fill={accent} />

            {/* ドラゴンの顔 */}
            <path
              d="M94 82 C94 54, 166 54, 166 82 L176 108 C154 124, 106 124, 84 108 Z"
              fill={primary}
            />

            {/* 鋭いドラゴンの瞳 */}
            {!silhouette && (
              <g>
                <polygon points="100,82 124,90 105,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
                <polygon points="160,82 136,90 155,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
              </g>
            )}

            {/* 両足のクロー */}
            <circle cx="96" cy="204" r="16" fill={secondary} />
            <circle cx="164" cy="204" r="16" fill={secondary} />
          </g>
        )}

        {/* ==================== 3. ロボット (ROBOT) ==================== */}
        {type === 'robot' && (
          <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
            {/* 背面のウイングスラスター */}
            <polygon points="85,105 20,62 36,135 85,145" fill={secondary} />
            <polygon points="175,105 240,62 224,135 175,145" fill={secondary} />

            {/* 両肩の巨大キャノン・アーマー */}
            <rect x="34" y="88" width="46" height="44" rx="8" fill={primary} />
            <rect x="180" y="88" width="46" height="44" rx="8" fill={primary} />
            <circle cx="57" cy="110" r="12" fill={accent} />
            <circle cx="203" cy="110" r="12" fill={accent} />

            {/* ロボットの脚 */}
            <rect x="82" y="176" width="34" height="50" rx="6" fill={secondary} />
            <rect x="144" y="176" width="34" height="50" rx="6" fill={secondary} />
            <polygon points="74,226 122,226 114,208 82,208" fill={primary} />
            <polygon points="138,226 186,226 178,208 146,208" fill={primary} />

            {/* 胴体アーマーと胸のエネルギーコア */}
            <polygon points="72,92 188,92 172,182 88,182" fill={primary} />
            {/* 胸のV字ブレード＆コア */}
            <polygon points="84,106 130,136 176,106 164,146 130,166 96,146" fill={accent} />
            {!silhouette && (
              <circle cx="130" cy="134" r="14" fill="#ffffff" stroke={primary} strokeWidth="4" />
            )}

            {/* ロボットヘッド＆Vアンテナ */}
            <rect x="92" y="44" width="76" height="50" rx="10" fill={secondary} />
            <polygon points="130,48 76,14 98,52" fill={accent} />
            <polygon points="130,48 184,14 162,52" fill={accent} />
            <polygon points="130,22 120,48 140,48" fill={accent} />

            {/* 発光バイザーアイ */}
            {!silhouette && (
              <polygon
                points="100,64 130,74 160,64 154,82 130,86 106,82"
                fill={eyeColor}
                stroke="#0f172a"
                strokeWidth="2.5"
              />
            )}

            {/* ロケットパンチ拳 */}
            <rect x="24" y="136" width="38" height="38" rx="10" fill={accent} />
            <rect x="198" y="136" width="38" height="38" rx="10" fill={accent} />
          </g>
        )}

        {/* ==================== 4. ビースト (BEAST) ==================== */}
        {type === 'beast' && (
          <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
            {/* 逆立つ属性たてがみ・オーラファー */}
            <polygon
              points="130,18 162,42 204,32 192,74 228,96 196,128 214,162 172,166 130,192 88,166 46,162 64,128 32,96 68,74 56,32 98,42"
              fill={accent}
            />

            {/* 強靭なボディ */}
            <ellipse cx="130" cy="168" rx="56" ry="46" fill={primary} />
            {/* 胸の稲妻・火炎ファー */}
            <polygon points="96,140 130,185 164,140 144,132 130,152 116,132" fill={accent} />

            {/* ビーストの顔 */}
            <circle cx="130" cy="96" r="46" fill={secondary} />
            {/* 耳 */}
            <polygon points="86,66 64,26 112,54" fill={primary} />
            <polygon points="174,66 196,26 148,54" fill={primary} />

            {/* 額の王冠マーク */}
            <polygon points="115,58 130,38 145,58 130,72" fill={accent} />

            {/* 鋭い目とキバ */}
            {!silhouette && (
              <g>
                <polygon points="96,82 122,92 100,102" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
                <polygon points="164,82 138,92 160,102" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
                {/* 鼻とマズル */}
                <polygon points="120,102 140,102 130,114" fill="#0f172a" stroke="none" />
                {/* 2本のキバ */}
                <polygon points="106,116 114,136 122,116" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
                <polygon points="138,116 146,136 154,116" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
              </g>
            )}

            {/* 巨大なビーストクロー（両前足） */}
            <circle cx="72" cy="196" r="24" fill={secondary} />
            <circle cx="188" cy="196" r="24" fill={secondary} />
            <polygon points="54,210 62,230 70,212" fill={accent} />
            <polygon points="68,212 76,232 84,212" fill={accent} />
            <polygon points="176,212 184,232 192,212" fill={accent} />
            <polygon points="190,212 198,230 206,210" fill={accent} />
          </g>
        )}

        {/* 必殺技発動中の稲妻＆キラキラエフェクト */}
        {!silhouette && isAttacking && (
          <g stroke="#ffffff" strokeWidth="4" fill="#fef08a">
            <polygon points="35,45 50,20 62,48 42,60" />
            <polygon points="215,40 235,18 228,52 205,48" />
            <polygon points="25,195 48,180 40,212" />
            <polygon points="225,190 245,210 212,215" />
          </g>
        )}
      </svg>
    </div>
  );
}
