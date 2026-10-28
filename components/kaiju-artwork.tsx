'use client';

import React from 'react';
import { ElementId, KaijuTypeId, CreatureCategory, InsectVisualStyle, getElementMeta } from '@/lib/kaiju-data';

interface EggProps {
  element: ElementId;
  type: KaijuTypeId;
  category?: CreatureCategory;
  isShaking?: boolean;
}

export function MonsterEggSvg({ element, type, category = 'kaiju', isShaking = false }: EggProps) {
  const elMeta = getElementMeta(element);

  // 🪲 昆虫モードのときは「🌳 甘い黄金の樹液が光るクヌギのご神木」を描画
  if (category === 'insect') {
    return (
      <div className={`relative flex items-center justify-center select-none ${isShaking ? 'animate-egg-shake' : ''}`}>
        {/* 背面の森のオーラ発光 */}
        <div
          className="absolute w-48 h-48 rounded-full blur-2xl opacity-75 transition-all duration-300"
          style={{
            background: `radial-gradient(circle, #fde047 0%, ${elMeta.accentHex} 40%, ${elMeta.primaryHex} 70%, transparent 100%)`,
          }}
        />

        <svg
          viewBox="0 0 220 240"
          className="w-44 h-48 relative z-10 drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)]"
          aria-label="クヌギのご神木"
        >
          <defs>
            <linearGradient id="treeTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="50%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#291102" />
            </linearGradient>
            <radialGradient id="goldenSapGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            <radialGradient id="leavesGrad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#14532d" />
            </radialGradient>
          </defs>

          {/* 大地・コケ台座 */}
          <ellipse cx="110" cy="216" rx="72" ry="14" fill="rgba(15,23,42,0.8)" stroke="#22c55e" strokeWidth="2.5" />
          <ellipse cx="110" cy="216" rx="52" ry="8" fill="#15803d" opacity="0.6" />

          {/* クヌギの太い幹 */}
          <path
            d="M86 215 C82 170, 75 140, 68 115 C95 125, 125 125, 152 115 C145 140, 138 170, 134 215 Z"
            fill="url(#treeTrunkGrad)"
            stroke="#1c1917"
            strokeWidth="3.5"
          />
          {/* 樹皮のゴツゴツ溝模様 */}
          <path d="M96 212 Q94 165, 88 128" fill="none" stroke="#291102" strokeWidth="3" />
          <path d="M110 210 Q112 160, 108 125" fill="none" stroke="#291102" strokeWidth="2.5" />
          <path d="M124 212 Q126 168, 132 128" fill="none" stroke="#291102" strokeWidth="3" />

          {/* クヌギの豊かな緑の葉（樹冠） */}
          <g fill="url(#leavesGrad)" stroke="#052e16" strokeWidth="3.5">
            <circle cx="68" cy="88" r="38" />
            <circle cx="152" cy="88" r="38" />
            <circle cx="110" cy="58" r="46" />
            <circle cx="82" cy="52" r="34" />
            <circle cx="138" cy="52" r="34" />
          </g>

          {/* 幹からとろ〜り溢れ出る黄金の樹液（SAP DROPLET） */}
          <g>
            <circle cx="112" cy="165" r="20" fill="#fde047" opacity="0.35" />
            <path
              d="M112 140 C104 150, 98 162, 98 172 C98 184, 104 192, 112 192 C120 192, 126 184, 126 172 C126 162, 120 150, 112 140 Z"
              fill="url(#goldenSapGrad)"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            <ellipse cx="107" cy="166" rx="3.5" ry="8" transform="rotate(-15 107 166)" fill="#ffffff" opacity="0.9" />
            <circle cx="118" cy="180" r="2.5" fill="#ffffff" opacity="0.8" />
          </g>

          {/* 揺れているときの葉っぱ＆樹液しぶき飛び散りエフェクト */}
          {isShaking && (
            <g>
              <circle cx="48" cy="120" r="5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="172" cy="130" r="4.5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M52 65 C40 55, 35 70, 52 75 Z" fill="#4ade80" />
              <path d="M168 65 C180 55, 185 70, 168 75 Z" fill="#4ade80" />
              <polygon points="110,18 116,28 104,28" fill="#facc15" />
            </g>
          )}
        </svg>

        {/* 昆虫タイプバッジ */}
        <div className="absolute -bottom-1 right-2 z-20 w-14 h-14 rounded-2xl bg-slate-900/95 border-2 border-emerald-400 shadow-xl flex items-center justify-center text-3xl">
          {type === 'kabuto' && '🪲'}
          {type === 'kuwagata' && '✂️'}
          {type === 'hunter' && '🐝'}
          {type === 'flier' && '🦋'}
          {type !== 'kabuto' && type !== 'kuwagata' && type !== 'hunter' && type !== 'flier' && '🪲'}
        </div>
      </div>
    );
  }

  // 🦖 怪獣モードのタマゴ表示
  return (
    <div className={`relative flex items-center justify-center select-none ${isShaking ? 'animate-egg-shake' : ''}`}>
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

export interface KaijuArtProps {
  element: ElementId;
  type: KaijuTypeId;
  kaijuId?: string;
  category?: CreatureCategory;
  insectStyle?: InsectVisualStyle;
  realColors?: { primary: string; secondary: string; accent: string };
  silhouette?: boolean;
  isAttacking?: boolean;
  isFloating?: boolean;
  evolutionStage?: 1 | 2 | 3;
  isDamaged?: boolean;
  flipHorizontal?: boolean;
  className?: string;
}

interface SvgPartProps {
  primary: string;
  secondary: string;
  accent: string;
  eyeColor: string;
  outline: string;
  silhouette: boolean;
}

/* ==========================================================================
   🦖 きょうりゅう (DINOS) - 個別SVGデザイン
   ========================================================================== */

/** No.1 マグマティラノ (火口とメラメラ炎、ティラノの巨大アゴ) */
function MagmaTyrannoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 尻尾と炎の尾先 */}
      <path d="M75 185 Q22 175, 20 120 Q38 142, 78 152 Z" fill={primary} />
      {!silhouette && (
        <path d="M22 122 Q5 95, 25 75 Q15 105, 38 118 Z" fill="#ef4444" stroke="none" />
      )}

      {/* 背中の活火山と噴火トゲ */}
      <path d="M82 76 L48 55 L72 95 L42 98 L68 132 L44 140 L76 160 Z" fill={accent} />
      {!silhouette && (
        <g stroke="none">
          <circle cx="48" cy="52" r="7" fill="#facc15" />
          <circle cx="38" cy="40" r="5" fill="#f97316" />
          <circle cx="58" cy="38" r="4" fill="#ef4444" />
        </g>
      )}

      {/* どっしりした胴体 */}
      <ellipse cx="116" cy="162" rx="52" ry="48" fill={primary} />
      {/* お腹のマグマ亀裂 */}
      <ellipse cx="128" cy="166" rx="32" ry="34" fill={accent} stroke="none" opacity="0.9" />
      {!silhouette && (
        <path d="M115 150 L126 165 L120 178 L134 190" fill="none" stroke="#fef08a" strokeWidth="3" />
      )}

      {/* 太い脚と鋭い爪 */}
      <rect x="76" y="192" width="28" height="34" rx="10" fill={secondary} />
      <rect x="130" y="192" width="28" height="34" rx="10" fill={secondary} />
      <polygon points="72,226 82,216 88,226" fill={accent} />
      <polygon points="86,226 96,216 102,226" fill={accent} />
      <polygon points="126,226 136,216 142,226" fill={accent} />
      <polygon points="140,226 150,216 156,226" fill={accent} />

      {/* 巨大なティラノヘッドと強靭なアゴ */}
      <path
        d="M84 115 C80 58, 128 44, 180 54 C218 60, 226 90, 214 108 L158 112 L208 128 C198 150, 154 154, 114 138 Z"
        fill={secondary}
      />

      {/* ギラギラしたキバ */}
      {!silhouette && (
        <g fill="#ffffff" stroke="#0f172a" strokeWidth="2">
          <polygon points="166,109 173,122 180,109" />
          <polygon points="183,109 190,123 197,109" />
          <polygon points="199,108 205,120 211,108" />
        </g>
      )}

      {/* 頭上のマグマホーン */}
      <polygon points="120,54 96,20 142,48" fill={accent} />

      {/* 小さな前足 */}
      <path d="M140 142 L176 148 L168 164 L134 156 Z" fill={secondary} />

      {/* 鋭い目 */}
      {!silhouette && (
        <g>
          <polygon points="136,70 170,76 146,90" fill={eyeColor} stroke="#0f172a" strokeWidth="3" />
          <circle cx="154" cy="78" r="4.5" fill="#0f172a" stroke="none" />
        </g>
      )}
    </g>
  );
}

/** No.5 アクアスピノ (巨大な半円帆ヒレ、ワニのような細長い口、魚捕りキバ) */
function AquaSpinoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 尾ビレ（パドル形状） */}
      <path d="M72 178 Q20 185, 12 140 Q32 125, 75 152 Z" fill={primary} />
      <path d="M14 138 C8 115, 30 110, 42 128 Z" fill={accent} />

      {/* スピノサウルス最大の特徴：背中の巨大な帆ヒレ (Sail) */}
      <path
        d="M55 155 C38 65, 115 32, 152 90 L140 148 Z"
        fill={accent}
      />
      {/* 帆の骨組みライン＆水しぶきグラデ */}
      {!silhouette && (
        <g stroke={secondary} strokeWidth="3" opacity="0.85">
          <line x1="68" y1="150" x2="65" y2="95" />
          <line x1="88" y1="145" x2="90" y2="58" />
          <line x1="108" y1="145" x2="114" y2="48" />
          <line x1="126" y1="145" x2="135" y2="65" />
          <circle cx="100" cy="78" r="6" fill="#ffffff" stroke="none" opacity="0.6" />
        </g>
      )}

      {/* 流線型の胴体 */}
      <ellipse cx="118" cy="164" rx="50" ry="42" fill={primary} />
      <ellipse cx="128" cy="168" rx="30" ry="28" fill={secondary} stroke="none" />

      {/* 足と水かき爪 */}
      <rect x="76" y="190" width="26" height="34" rx="8" fill={secondary} />
      <rect x="128" y="190" width="26" height="34" rx="8" fill={secondary} />
      <polygon points="70,225 82,216 88,225" fill={accent} />
      <polygon points="86,225 96,216 102,225" fill={accent} />
      <polygon points="124,225 136,216 142,225" fill={accent} />
      <polygon points="138,225 148,216 154,225" fill={accent} />

      {/* スピノ特有の細長いワニ状ヘッド */}
      <path
        d="M88 120 C85 75, 125 65, 155 70 L236 84 C244 95, 238 108, 222 110 L156 112 L215 120 C205 138, 155 142, 118 135 Z"
        fill={secondary}
      />

      {/* 多数の細い魚捕りキバ */}
      {!silhouette && (
        <g fill="#ffffff" stroke="#0f172a" strokeWidth="1.5">
          <polygon points="160,111 165,120 170,111" />
          <polygon points="174,111 179,121 184,111" />
          <polygon points="188,111 193,121 198,111" />
          <polygon points="202,110 207,120 212,110" />
          <polygon points="216,110 220,118 224,110" />
        </g>
      )}

      {/* 頭上の水流クレスト */}
      <path d="M125 66 Q145 38, 168 55 Q145 60, 138 68 Z" fill={accent} />

      {/* 鋭い目 */}
      {!silhouette && (
        <g>
          <ellipse cx="148" cy="84" rx="14" ry="10" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="152" cy="84" r="4.5" fill="#0f172a" stroke="none" />
        </g>
      )}
    </g>
  );
}

/** No.9 サンダーレックス (帯電ティラノ、頭部と背中の稲妻スパイク、雷矢印の尻尾) */
function ThunderRexSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 尻尾と先端のイナズマ矢印 */}
      <path d="M78 180 Q32 172, 35 130 Z" fill={primary} />
      {/* 尾先の雷矢印 */}
      <polygon points="36,132 12,115 28,145 8,155 42,150" fill={accent} />

      {/* 背中に並ぶギザギザの避雷スパイク */}
      <polygon points="75,68 38,55 64,88" fill={accent} />
      <polygon points="62,94 28,90 56,118" fill={accent} />
      <polygon points="56,122 22,128 54,148" fill={accent} />

      {/* 強靭な胴体 */}
      <ellipse cx="118" cy="162" rx="52" ry="46" fill={primary} />
      {/* 胸部の電撃マーク */}
      <polygon points="122,142 108,166 126,166 114,192 144,160 128,160" fill={accent} stroke="none" />

      {/* 脚と爪 */}
      <rect x="76" y="190" width="28" height="34" rx="8" fill={secondary} />
      <rect x="130" y="190" width="28" height="34" rx="8" fill={secondary} />
      <polygon points="70,225 80,214 86,225" fill={accent} />
      <polygon points="84,225 94,214 100,225" fill={accent} />
      <polygon points="125,225 135,214 141,225" fill={accent} />
      <polygon points="139,225 149,214 155,225" fill={accent} />

      {/* 鋭利なティラノヘッド */}
      <path
        d="M86 112 C82 58, 126 46, 175 54 C212 60, 224 88, 214 106 L160 110 L208 126 C196 146, 150 150, 114 136 Z"
        fill={secondary}
      />

      {/* 稲妻型の後方ホーン */}
      <polygon points="115,54 75,18 108,38 98,12 142,48" fill={accent} />

      {/* キバ */}
      {!silhouette && (
        <g fill="#ffffff" stroke="#0f172a" strokeWidth="2">
          <polygon points="166,108 174,122 181,108" />
          <polygon points="184,108 192,122 199,108" />
          <polygon points="201,107 207,118 213,107" />
        </g>
      )}

      {/* 鋭い稲妻アイ */}
      {!silhouette && (
        <g>
          <polygon points="135,70 172,74 148,88" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="152" cy="77" r="4" fill="#0f172a" stroke="none" />
        </g>
      )}
    </g>
  );
}

/** No.13 ガイアトリケラ (3本の巨大ツノ、フリル襟飾り盾、重装甲四足ボディ) */
function GaiaTriceraSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 短く頑丈な尻尾 */}
      <path d="M68 175 Q25 180, 22 152 Q44 146, 68 156 Z" fill={primary} />

      {/* 重装甲四足胴体 */}
      <ellipse cx="125" cy="166" rx="58" ry="44" fill={primary} />
      <ellipse cx="120" cy="168" rx="36" ry="26" fill={secondary} stroke="none" opacity="0.8" />

      {/* 4本のどっしりした柱脚 */}
      <rect x="58" y="184" width="24" height="38" rx="8" fill={secondary} />
      <rect x="94" y="188" width="24" height="34" rx="8" fill={secondary} />
      <rect x="142" y="188" width="24" height="34" rx="8" fill={secondary} />
      <rect x="176" y="184" width="24" height="38" rx="8" fill={secondary} />
      {/* ヒヅメ */}
      <circle cx="70" cy="222" r="7" fill={accent} />
      <circle cx="106" cy="222" r="7" fill={accent} />
      <circle cx="154" cy="222" r="7" fill={accent} />
      <circle cx="188" cy="222" r="7" fill={accent} />

      {/* トリケラトプス最大の特徴：巨大なフリル（襟飾りシールド） */}
      <path
        d="M98 140 C80 62, 192 62, 178 140 Z"
        fill={accent}
      />
      {/* フリル周囲の波状トゲ飾り＆エメラルド宝石 */}
      {!silhouette && (
        <g fill={secondary}>
          <circle cx="104" cy="98" r="6" fill="#fef08a" stroke={outline} strokeWidth="2" />
          <circle cx="122" cy="74" r="7" fill="#fef08a" stroke={outline} strokeWidth="2" />
          <circle cx="148" cy="70" r="8" fill="#fef08a" stroke={outline} strokeWidth="2" />
          <circle cx="172" cy="85" r="6" fill="#fef08a" stroke={outline} strokeWidth="2" />
        </g>
      )}

      {/* 頭部とクチバシ */}
      <path
        d="M112 118 C112 90, 160 88, 185 105 L222 134 C212 152, 178 158, 142 152 Z"
        fill={secondary}
      />
      {/* クチバシ先 */}
      <polygon points="214,130 234,142 216,146" fill={accent} />

      {/* ★ 3本の巨大なツノ (TRICERATOPS HORNS) ★ */}
      {/* 額の長大な2本角 */}
      <polygon points="145,95 168,18 156,98" fill="#ffffff" />
      <polygon points="168,102 208,24 178,108" fill="#ffffff" />
      {/* 鼻先の頑丈な角 */}
      <polygon points="204,118 238,90 216,128" fill="#ffffff" />

      {/* つぶらで力強い目 */}
      {!silhouette && (
        <g>
          <circle cx="165" cy="118" r="10" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="168" cy="118" r="4.5" fill="#0f172a" stroke="none" />
        </g>
      )}
    </g>
  );
}

/** No.20 エンシェントガイアレックス (古代鎧竜、背中の巨大水晶板、棘鉄球ハンマー尾) */
function AncientGaiaRexSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 尻尾と巨大なトゲ付き鉄球（ハンマーテイル） */}
      <path d="M72 178 Q28 180, 22 145 Z" fill={primary} />
      <circle cx="20" cy="142" r="16" fill={secondary} />
      <polygon points="20,122 25,130 15,130" fill={accent} />
      <polygon points="4,142 12,147 12,137" fill={accent} />
      <polygon points="20,162 15,154 25,154" fill={accent} />
      <polygon points="36,142 28,137 28,147" fill={accent} />

      {/* 背中に並ぶ巨大な古代クリスタルプレート */}
      <polygon points="68,90 45,45 80,72" fill={accent} />
      <polygon points="98,75 80,24 116,60" fill={accent} />
      <polygon points="128,78 120,30 148,68" fill={accent} />

      {/* 重装甲ボディ */}
      <ellipse cx="120" cy="162" rx="55" ry="46" fill={primary} />
      <rect x="74" y="188" width="28" height="36" rx="8" fill={secondary} />
      <rect x="132" y="188" width="28" height="36" rx="8" fill={secondary} />

      {/* 古代鎧竜ヘッド */}
      <path
        d="M84 115 C80 58, 128 46, 178 56 C216 62, 226 92, 214 110 L160 114 L210 130 C198 150, 154 154, 114 138 Z"
        fill={secondary}
      />
      {/* 兜のトゲ角 */}
      <polygon points="116,56 88,22 136,48" fill={accent} />
      <polygon points="168,58 198,28 184,65" fill={accent} />

      {!silhouette && (
        <g>
          <polygon points="138,74 168,78 145,92" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="154" cy="80" r="4.5" fill="#0f172a" stroke="none" />
        </g>
      )}
    </g>
  );
}

/* ==========================================================================
   🐉 ドラゴン (DRAGONS) - 個別SVGデザイン
   ========================================================================== */

/** No.2 バーニングドラゴ (巨大な炎のコウモリ翼、2本の湾曲角、炎の尾) */
function BurningDragoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 左右の巨大な炎の翼 */}
      <path d="M96 125 L16 48 L28 112 L16 148 L56 145 L46 175 L102 155 Z" fill={secondary} />
      <path d="M164 125 L244 48 L232 112 L244 148 L204 145 L214 175 L158 155 Z" fill={secondary} />
      {/* 翼の炎膜 */}
      <path d="M88 130 L32 72 L46 135 Z" fill={accent} stroke="none" opacity="0.85" />
      <path d="M172 130 L228 72 L214 135 Z" fill={accent} stroke="none" opacity="0.85" />

      {/* 炎のスペード尾 */}
      <path d="M130 190 Q185 228, 226 192 L238 175 L214 178 Q178 202, 145 178 Z" fill={primary} />
      <polygon points="238,175 255,160 248,185" fill={accent} />

      {/* ドラゴンボディ */}
      <ellipse cx="130" cy="155" rx="44" ry="52" fill={primary} />
      <ellipse cx="130" cy="160" rx="26" ry="38" fill={accent} stroke="none" opacity="0.9" />
      {!silhouette && (
        <g stroke={primary} strokeWidth="3">
          <line x1="108" y1="142" x2="152" y2="142" />
          <line x1="106" y1="160" x2="154" y2="160" />
          <line x1="110" y1="178" x2="150" y2="178" />
        </g>
      )}

      {/* 2本の大きな曲がり角 */}
      <path d="M106 64 L68 16 L92 74 Z" fill={accent} />
      <path d="M154 64 L192 16 L168 74 Z" fill={accent} />

      {/* ドラゴンフェイス */}
      <path d="M94 82 C94 54, 166 54, 166 82 L176 108 C154 124, 106 124, 84 108 Z" fill={primary} />

      {!silhouette && (
        <g>
          <polygon points="100,82 124,90 105,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="160,82 136,90 155,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
        </g>
      )}

      {/* 爪 */}
      <circle cx="96" cy="204" r="16" fill={secondary} />
      <circle cx="164" cy="204" r="16" fill={secondary} />
    </g>
  );
}

/** No.6 ポセイドンドラゴ (優雅なヒレ翼、龍の立派なヒゲ、額の真珠オーブ、水尾) */
function PoseidonDragoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 扇状に広がる波型ヒレ翼 */}
      <path d="M96 130 C45 110, 15 50, 28 35 C52 75, 75 105, 100 148 Z" fill={accent} />
      <path d="M164 130 C215 110, 245 50, 232 35 C208 75, 185 105, 160 148 Z" fill={accent} />

      {/* クジラ/人魚のような優雅な尾ビレ */}
      <path d="M130 190 Q180 230, 218 190 Z" fill={primary} />
      <path d="M216 188 C238 170, 252 185, 238 210 C215 205, 210 198, 216 188 Z" fill={accent} />

      {/* ボディ */}
      <ellipse cx="130" cy="155" rx="44" ry="50" fill={primary} />
      <ellipse cx="130" cy="160" rx="26" ry="36" fill={secondary} stroke="none" />

      {/* 背ビレ */}
      <path d="M130 70 L130 120" stroke={accent} strokeWidth="6" />

      {/* ドラゴンヘッド */}
      <path d="M96 82 C96 52, 164 52, 164 82 L172 108 C152 122, 108 122, 88 108 Z" fill={primary} />

      {/* 額の真珠オーブ */}
      {!silhouette && (
        <circle cx="130" cy="62" r="8" fill="#ffffff" stroke={accent} strokeWidth="3" />
      )}

      {/* 左右に優雅に波打つ龍のヒゲ */}
      <path d="M96 102 Q55 95, 32 120" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <path d="M164 102 Q205 95, 228 120" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />

      {!silhouette && (
        <g>
          <polygon points="102,82 124,90 106,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="158,82 136,90 154,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
        </g>
      )}

      <circle cx="96" cy="204" r="16" fill={secondary} />
      <circle cx="164" cy="204" r="16" fill={secondary} />
    </g>
  );
}

/** No.10 イナズマドラゴ (超音速ワイバーン、ギザギザ稲妻翼、V字避雷アンテナ) */
function InazumaDragoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 鋭利なジグザグ稲妻ウイング */}
      <polygon points="95,130 10,65 42,98 18,138 58,138 34,175 102,152" fill={accent} />
      <polygon points="165,130 250,65 218,98 242,138 202,138 226,175 158,152" fill={accent} />

      {/* 尾と2股の稲妻フォーク */}
      <path d="M130 190 Q180 225, 220 185 Z" fill={primary} />
      <polygon points="218,184 250,172 235,188 252,204 224,196" fill={accent} />

      <ellipse cx="130" cy="155" rx="42" ry="50" fill={primary} />
      <polygon points="120,135 130,165 140,135 130,185" fill={accent} stroke="none" />

      {/* V字型避雷針アンテナ角 */}
      <polygon points="112,65 72,12 100,58" fill={accent} />
      <polygon points="148,65 188,12 160,58" fill={accent} />

      {/* シャープなクチバシ顔 */}
      <path d="M96 82 C96 56, 164 56, 164 82 L178 106 L130 125 L82 106 Z" fill={primary} />

      {!silhouette && (
        <g>
          <polygon points="102,80 126,88 106,96" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="158,80 134,88 154,96" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
        </g>
      )}

      <circle cx="96" cy="204" r="16" fill={secondary} />
      <circle cx="164" cy="204" r="16" fill={secondary} />
    </g>
  );
}

/** No.14 エメラルドドラゴ (木の葉の聖竜翼、枝分かれ鹿角、花の尾) */
function EmeraldDragoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 重なり合う木の葉型の翼 (Leaf Wings) */}
      <g fill={accent}>
        <path d="M98 128 C55 105, 20 48, 45 32 C75 62, 85 98, 102 142 Z" />
        <path d="M85 142 C45 130, 22 85, 38 78 C65 98, 75 125, 90 152 Z" />
        <path d="M162 128 C205 105, 240 48, 215 32 C185 62, 175 98, 158 142 Z" />
        <path d="M175 142 C215 130, 238 85, 222 78 C195 98, 185 125, 170 152 Z" />
      </g>

      {/* 尻尾と若葉のファン */}
      <path d="M130 190 Q180 225, 215 188 Z" fill={primary} />
      <path d="M214 186 C238 165, 248 185, 235 208 Z" fill={accent} />

      <ellipse cx="130" cy="155" rx="44" ry="50" fill={primary} />
      <ellipse cx="130" cy="160" rx="26" ry="36" fill={secondary} stroke="none" />

      {/* 大鹿・神木のような枝分かれ角 (Antlers) */}
      <path d="M108 65 L78 22 L92 38 L72 12 L102 52 Z" fill={accent} />
      <path d="M152 65 L182 22 L168 38 L188 12 L158 52 Z" fill={accent} />

      <path d="M96 82 C96 54, 164 54, 164 82 L174 108 C152 122, 108 122, 86 108 Z" fill={primary} />

      {!silhouette && (
        <g>
          <circle cx="130" cy="98" r="5" fill="#fef08a" stroke={outline} strokeWidth="1.5" />
          <polygon points="102,82 124,90 106,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="158,82 136,90 154,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
        </g>
      )}

      <circle cx="96" cy="204" r="16" fill={secondary} />
      <circle cx="164" cy="204" r="16" fill={secondary} />
    </g>
  );
}

/** No.17 メテオレックスドラゴ (宇宙隕石コア、星雲ネビュラ翼、彗星尾) */
function MeteorRexDragoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 星雲の翼 */}
      <path d="M96 125 L10 40 L28 112 L12 148 L56 145 L42 178 L102 155 Z" fill={secondary} />
      <path d="M164 125 L250 40 L232 112 L248 148 L204 145 L218 178 L158 155 Z" fill={secondary} />
      {!silhouette && (
        <g fill="#fef08a" stroke="none">
          <circle cx="48" cy="85" r="4" />
          <circle cx="68" cy="115" r="3" />
          <circle cx="212" cy="85" r="4" />
          <circle cx="192" cy="115" r="3" />
        </g>
      )}

      {/* 彗星の尾 */}
      <path d="M130 190 Q190 230, 230 185 Z" fill={primary} />
      <polygon points="228,182 258,165 242,198" fill={accent} />

      <ellipse cx="130" cy="155" rx="46" ry="52" fill={primary} />
      {/* 隕石クレーターコア */}
      <circle cx="130" cy="156" r="18" fill="#facc15" stroke={outline} strokeWidth="3" />
      <circle cx="130" cy="156" r="10" fill="#ef4444" stroke="none" />

      {/* 暗黒物質クリスタル角 */}
      <polygon points="106,64 62,8 96,70" fill={accent} />
      <polygon points="154,64 198,8 164,70" fill={accent} />

      <path d="M92 82 C92 50, 168 50, 168 82 L178 108 C154 124, 106 124, 82 108 Z" fill={primary} />

      {!silhouette && (
        <g>
          <polygon points="98,82 124,90 104,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="162,82 136,90 156,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
        </g>
      )}

      <circle cx="96" cy="204" r="16" fill={secondary} />
      <circle cx="164" cy="204" r="16" fill={secondary} />
    </g>
  );
}

/* ==========================================================================
   🤖 ロボット (ROBOTS) - 個別SVGデザイン
   ========================================================================== */

/** No.3 ブレイズカイザー (両肩の煙突マフラー火炎放射、胸の回転タービン、ロケットパンチ) */
function BlazeKaiserSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 背面ウイング */}
      <polygon points="85,105 20,62 36,135 85,145" fill={secondary} />
      <polygon points="175,105 240,62 224,135 175,145" fill={secondary} />

      {/* 両肩の煙突マフラー (Exhaust Smokestacks) */}
      <rect x="34" y="60" width="16" height="38" rx="4" fill={secondary} />
      <rect x="210" y="60" width="16" height="38" rx="4" fill={secondary} />
      {/* マフラーから吹き出す炎 */}
      {!silhouette && (
        <g fill="#ef4444" stroke="none">
          <polygon points="42,60 34,35 44,48 50,28 54,60" fill="#facc15" />
          <polygon points="218,60 210,35 220,48 226,28 230,60" fill="#facc15" />
        </g>
      )}

      {/* 両肩ブロック */}
      <rect x="42" y="90" width="42" height="42" rx="6" fill={primary} />
      <rect x="176" y="90" width="42" height="42" rx="6" fill={primary} />

      {/* 脚 */}
      <rect x="82" y="176" width="34" height="50" rx="6" fill={secondary} />
      <rect x="144" y="176" width="34" height="50" rx="6" fill={secondary} />
      <polygon points="74,226 122,226 114,208 82,208" fill={primary} />
      <polygon points="138,226 186,226 178,208 146,208" fill={primary} />

      {/* 胴体装甲 */}
      <polygon points="72,92 188,92 172,182 88,182" fill={primary} />

      {/* 胸の回転ファイヤータービン */}
      <circle cx="130" cy="136" r="24" fill={secondary} stroke={outline} strokeWidth="3" />
      <circle cx="130" cy="136" r="14" fill={accent} stroke="none" />
      {!silhouette && (
        <path d="M130 124 L134 136 L146 136 L136 142 L140 152 L130 144 L120 152 L124 142 L114 136 L126 136 Z" fill="#ffffff" stroke="none" />
      )}

      {/* ロボットヘッド＆炎クラウン */}
      <rect x="92" y="44" width="76" height="50" rx="10" fill={secondary} />
      <polygon points="130,48 80,14 100,52" fill={accent} />
      <polygon points="130,48 180,14 160,52" fill={accent} />
      <polygon points="130,22 120,48 140,48" fill={accent} />

      {/* バイザーアイ */}
      {!silhouette && (
        <polygon points="100,64 130,74 160,64 154,82 130,86 106,82" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
      )}

      {/* ロケットパンチ拳 */}
      <rect x="24" y="136" width="38" height="38" rx="10" fill={accent} />
      <rect x="198" y="136" width="38" height="38" rx="10" fill={accent} />
    </g>
  );
}

/** No.7 ハイドロメカオー (潜水ドームバイザー、両肩のツインウォーターバズーカ、潜水スクリュー) */
function HydroMechaOhSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 背面の潜水推進スクリュー */}
      <circle cx="48" cy="115" r="20" fill={secondary} />
      <circle cx="212" cy="115" r="20" fill={secondary} />
      {!silhouette && (
        <g stroke={accent} strokeWidth="4">
          <line x1="48" y1="98" x2="48" y2="132" />
          <line x1="32" y1="115" x2="64" y2="115" />
          <line x1="212" y1="98" x2="212" y2="132" />
          <line x1="196" y1="115" x2="228" y2="115" />
        </g>
      )}

      {/* ★ 両肩の巨大ツイン・ウォーターバズーカ砲 ★ */}
      <rect x="20" y="75" width="46" height="26" rx="6" fill={accent} />
      <circle cx="18" cy="88" r="10" fill={secondary} stroke={outline} strokeWidth="3" />
      <rect x="194" y="75" width="46" height="26" rx="6" fill={accent} />
      <circle cx="242" cy="88" r="10" fill={secondary} stroke={outline} strokeWidth="3" />

      {/* 脚部 */}
      <rect x="82" y="176" width="34" height="50" rx="6" fill={secondary} />
      <rect x="144" y="176" width="34" height="50" rx="6" fill={secondary} />
      <polygon points="74,226 122,226 114,208 82,208" fill={primary} />
      <polygon points="138,226 186,226 178,208 146,208" fill={primary} />

      {/* 潜水艦ハル胴体 */}
      <polygon points="72,92 188,92 172,182 88,182" fill={primary} />
      <circle cx="130" cy="140" r="18" fill={secondary} stroke={outline} strokeWidth="3" />
      <circle cx="130" cy="140" r="10" fill="#38bdf8" stroke="none" />

      {/* ★ 潜水服風の丸型ドームヘッド ★ */}
      <circle cx="130" cy="68" r="32" fill={secondary} />
      {/* 発光潜水グラスバイザー */}
      {!silhouette && (
        <g>
          <ellipse cx="130" cy="70" rx="22" ry="16" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <ellipse cx="124" cy="66" rx="8" ry="4" fill="#ffffff" opacity="0.75" />
        </g>
      )}

      <rect x="24" y="136" width="38" height="38" rx="10" fill={secondary} />
      <rect x="198" y="136" width="38" height="38" rx="10" fill={secondary} />
    </g>
  );
}

/** No.11 ボルトタイタン (両肩のテスラコイルタワー、高圧ボルトメーター胸、避雷針アンテナ) */
function BoltTitanSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 両肩のテスラコイルタワー (Tesla Coils) ★ */}
      <g fill={secondary}>
        <rect x="32" y="55" width="26" height="42" rx="4" />
        <ellipse cx="45" cy="54" rx="18" ry="6" fill={accent} />
        <ellipse cx="45" cy="68" rx="16" ry="5" fill={accent} />
        <circle cx="45" cy="40" r="10" fill="#ffffff" stroke={outline} strokeWidth="3" />

        <rect x="202" y="55" width="26" height="42" rx="4" />
        <ellipse cx="215" cy="54" rx="18" ry="6" fill={accent} />
        <ellipse cx="215" cy="68" rx="16" ry="5" fill={accent} />
        <circle cx="215" cy="40" r="10" fill="#ffffff" stroke={outline} strokeWidth="3" />
      </g>

      {/* 脚 */}
      <rect x="82" y="176" width="34" height="50" rx="6" fill={secondary} />
      <rect x="144" y="176" width="34" height="50" rx="6" fill={secondary} />
      <polygon points="74,226 122,226 114,208 82,208" fill={primary} />
      <polygon points="138,226 186,226 178,208 146,208" fill={primary} />

      {/* 胴体装甲 */}
      <polygon points="72,92 188,92 172,182 88,182" fill={primary} />

      {/* 胸の高電圧ボルトメーター */}
      <rect x="100" y="120" width="60" height="34" rx="6" fill="#0f172a" stroke={outline} strokeWidth="3" />
      {!silhouette && (
        <polygon points="128,126 118,138 132,138 124,150 142,135 130,135" fill="#facc15" stroke="none" />
      )}

      {/* ヘッド＆避雷針クラウン */}
      <rect x="94" y="44" width="72" height="50" rx="10" fill={secondary} />
      <polygon points="130,12 122,46 138,46" fill={accent} />

      {!silhouette && (
        <polygon points="102,64 130,72 158,64 152,80 130,84 108,80" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
      )}

      <rect x="24" y="136" width="38" height="38" rx="10" fill={accent} />
      <rect x="198" y="136" width="38" height="38" rx="10" fill={accent} />
    </g>
  );
}

/** No.15 フォレストガーディアン (右腕が超巨大スパイラルドリル！古代遺跡ゴーレム装甲) */
function ForestGuardianSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 脚部 */}
      <rect x="80" y="176" width="36" height="50" rx="6" fill={secondary} />
      <rect x="144" y="176" width="36" height="50" rx="6" fill={secondary} />
      <polygon points="72,226 122,226 114,208 80,208" fill={primary} />
      <polygon points="138,226 188,226 180,208 146,208" fill={primary} />

      {/* 古代石造りボディ */}
      <polygon points="70,92 190,92 174,182 86,182" fill={primary} />
      {/* ツタ模様 */}
      {!silhouette && (
        <path d="M95 105 Q120 120, 105 145 Q125 160, 115 178" fill="none" stroke="#22c55e" strokeWidth="4" />
      )}

      {/* 左腕：岩石パンチ */}
      <rect x="198" y="125" width="42" height="48" rx="8" fill={secondary} />

      {/* ★ 右腕：超巨大スパイラルドリル (GIANT SPIRAL DRILL) ★ */}
      <g>
        {/* ドリル基部マウント */}
        <circle cx="58" cy="148" r="24" fill={secondary} />
        {/* 円錐ドリル本体 */}
        <polygon points="58,124 58,172 -12,148" fill={accent} />
        {/* ドリルの回転スクリュー溝 */}
        {!silhouette && (
          <g stroke="#ffffff" strokeWidth="3" opacity="0.9">
            <line x1="42" y1="130" x2="30" y2="166" />
            <line x1="24" y1="136" x2="12" y2="160" />
            <line x1="6" y1="142" x2="0" y2="154" />
          </g>
        )}
      </g>

      {/* 古代ゴーレムヘッド＆単眼ルーン */}
      <rect x="94" y="44" width="72" height="50" rx="8" fill={secondary} />
      <rect x="106" y="38" width="48" height="10" rx="4" fill={accent} />
      {/* 額のゴーレムアイ（単眼） */}
      {!silhouette && (
        <g>
          <circle cx="130" cy="70" r="14" fill="#0f172a" stroke={outline} strokeWidth="2.5" />
          <circle cx="130" cy="70" r="8" fill={eyeColor} stroke="none" />
        </g>
      )}
    </g>
  );
}

/** No.18 アビスポセイドンロボ (右腕に黄金の三叉槍トライデント、深海戦艦装甲) */
function AbyssPoseidonRoboSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      <rect x="82" y="176" width="34" height="50" rx="6" fill={secondary} />
      <rect x="144" y="176" width="34" height="50" rx="6" fill={secondary} />
      <polygon points="74,226 122,226 114,208 82,208" fill={primary} />
      <polygon points="138,226 186,226 178,208 146,208" fill={primary} />

      <polygon points="72,92 188,92 172,182 88,182" fill={primary} />

      {/* ★ 右腕の三叉槍 (GOLDEN TRIDENT) ★ */}
      <g>
        <line x1="42" y1="210" x2="42" y2="40" stroke="#facc15" strokeWidth="6" />
        {/* 三叉の穂先 */}
        <polygon points="42,20 34,45 50,45" fill="#facc15" />
        <polygon points="22,35 16,55 30,52" fill="#facc15" />
        <polygon points="62,35 68,55 54,52" fill="#facc15" />
        <line x1="20" y1="52" x2="64" y2="52" stroke="#facc15" strokeWidth="5" />
      </g>

      <rect x="94" y="44" width="72" height="50" rx="10" fill={secondary} />
      <polygon points="130,22 118,46 142,46" fill={accent} />

      {!silhouette && (
        <polygon points="102,66 130,76 158,66 150,82 130,86 110,82" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
      )}

      <rect x="198" y="136" width="38" height="38" rx="10" fill={accent} />
    </g>
  );
}

/* ==========================================================================
   🦁 ビースト (BEASTS) - 個別SVGデザイン
   ========================================================================== */

/** No.4 フレイムレオ (太陽のように燃え盛る巨大なたてがみ、百獣の王ライオン) */
function FlameLeoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 燃え盛る巨大なたてがみ (Blazing Lion Mane) ★ */}
      <polygon
        points="130,14 152,38 188,24 182,58 220,66 195,96 226,128 190,142 192,176 156,172 130,195 104,172 68,176 70,142 34,128 65,96 40,66 78,58 72,24 108,38"
        fill={accent}
      />

      {/* 強靭な胴体 */}
      <ellipse cx="130" cy="168" rx="56" ry="46" fill={primary} />
      <polygon points="96,140 130,185 164,140 144,132 130,152 116,132" fill={secondary} />

      {/* ライオンの顔 */}
      <circle cx="130" cy="98" r="46" fill={secondary} />
      {/* 丸い耳 */}
      <circle cx="88" cy="62" r="14" fill={primary} />
      <circle cx="172" cy="62" r="14" fill={primary} />

      {/* 額の王冠マーク */}
      <polygon points="115,60 130,42 145,60 130,74" fill={accent} />

      {!silhouette && (
        <g>
          <polygon points="98,84 124,94 102,104" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="162,84 136,94 158,104" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="120,104 140,104 130,116" fill="#0f172a" stroke="none" />
          <polygon points="106,118 114,138 122,118" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          <polygon points="138,118 146,138 154,118" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
        </g>
      )}

      {/* 巨大な前足 */}
      <circle cx="72" cy="196" r="24" fill={secondary} />
      <circle cx="188" cy="196" r="24" fill={secondary} />
      <polygon points="54,210 62,230 70,212" fill={accent} />
      <polygon points="68,212 76,232 84,212" fill={accent} />
      <polygon points="176,212 184,232 192,212" fill={accent} />
      <polygon points="190,212 198,230 206,210" fill={accent} />
    </g>
  );
}

/** No.8 スプラッシュウルフ (ピンと尖った三角耳、シャープなマズル、氷柱の首輪、三日月尾) */
function SplashWolfSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 大きくふさふさの三日月オオカミ尾 (Bushy Wolf Tail) ★ */}
      <path
        d="M75 185 C22 215, 6 142, 42 105 C32 138, 58 172, 85 178 Z"
        fill={accent}
      />

      {/* スラリとしたオオカミの胴体 */}
      <ellipse cx="130" cy="168" rx="52" ry="44" fill={primary} />
      <path d="M100 135 L130 180 L160 135 Z" fill={secondary} />

      {/* 首周りの氷柱襟巻き (Icicle Ruff Collar) */}
      <polygon points="80,125 55,145 92,142 80,165 110,152 130,175 150,152 180,165 168,142 205,145 180,125" fill={accent} />

      {/* ★ ピンと尖った三角オオカミ耳 (WOLF EARS) ★ */}
      <polygon points="88,64 56,16 108,48" fill={primary} />
      <polygon points="72,50 64,28 92,44" fill={accent} stroke="none" />
      <polygon points="172,64 204,16 152,48" fill={primary} />
      <polygon points="188,50 196,28 168,44" fill={accent} stroke="none" />

      {/* オオカミヘッド＆細長いマズル */}
      <circle cx="130" cy="94" r="42" fill={secondary} />
      {/* 尖った鼻先マズル */}
      <polygon points="112,100 148,100 130,132" fill={primary} />
      <circle cx="130" cy="128" r="5" fill="#0f172a" stroke="none" />

      {!silhouette && (
        <g>
          {/* シャープなオオカミアイ */}
          <polygon points="98,82 124,90 104,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="162,82 136,90 156,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
        </g>
      )}

      {/* 前足 */}
      <rect x="74" y="184" width="26" height="38" rx="8" fill={secondary} />
      <rect x="160" y="184" width="26" height="38" rx="8" fill={secondary} />
      <polygon points="70,222 78,212 84,222" fill={accent} />
      <polygon points="84,222 92,212 98,222" fill={accent} />
      <polygon points="156,222 164,212 170,222" fill={accent} />
      <polygon points="170,222 178,212 184,222" fill={accent} />
    </g>
  );
}

/** No.12 ライジンタイガー (黒と黄色のトラ縞模様、2本の長いサーベルキバ、丸耳) */
function RaijinTigerSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      <path d="M78 180 Q30 190, 22 145 Q42 140, 72 160 Z" fill={primary} />
      <ellipse cx="130" cy="168" rx="55" ry="45" fill={primary} />

      {/* ★ 体の黒いトラ縞模様 (TIGER STRIPES) ★ */}
      {!silhouette && (
        <g fill="#0f172a" stroke="none">
          <polygon points="82,148 105,152 86,160" />
          <polygon points="85,168 108,170 90,178" />
          <polygon points="178,148 155,152 174,160" />
          <polygon points="175,168 152,170 170,178" />
        </g>
      )}

      {/* トラヘッド */}
      <circle cx="130" cy="95" r="46" fill={primary} />
      {/* トラの丸耳 */}
      <circle cx="84" cy="58" r="16" fill={secondary} />
      <circle cx="84" cy="58" r="8" fill="#0f172a" stroke="none" />
      <circle cx="176" cy="58" r="16" fill={secondary} />
      <circle cx="176" cy="58" r="8" fill="#0f172a" stroke="none" />

      {/* 額のトラ柄王マーク */}
      {!silhouette && (
        <g stroke="#0f172a" strokeWidth="3" fill="none">
          <line x1="116" y1="58" x2="144" y2="58" />
          <line x1="120" y1="68" x2="140" y2="68" />
          <line x1="130" y1="52" x2="130" y2="76" />
        </g>
      )}

      {/* 頬のヒゲ袋と鼻 */}
      <ellipse cx="118" cy="110" rx="14" ry="10" fill={secondary} />
      <ellipse cx="142" cy="110" rx="14" ry="10" fill={secondary} />
      <polygon points="122,102 138,102 130,112" fill="#0f172a" stroke="none" />

      {/* ★ 2本の長大なサーベルキバ (SABER FANGS) ★ */}
      <polygon points="106,112 114,146 122,112" fill="#ffffff" />
      <polygon points="138,112 146,146 154,112" fill="#ffffff" />

      {!silhouette && (
        <g>
          <polygon points="96,82 122,92 100,102" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="164,82 138,92 160,102" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
        </g>
      )}

      {/* 前足 */}
      <circle cx="72" cy="196" r="24" fill={secondary} />
      <circle cx="188" cy="196" r="24" fill={secondary} />
      <polygon points="54,210 62,230 70,212" fill={accent} />
      <polygon points="68,212 76,232 84,212" fill={accent} />
      <polygon points="176,212 184,232 192,212" fill={accent} />
      <polygon points="190,212 198,230 206,210" fill={accent} />
    </g>
  );
}

/** No.16 ジャングルコング (圧倒的な肩幅・胸を叩くドラミング剛腕ポーズ、ゴリラ王) */
function JungleKongSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* どっしりしたゴリラの下半身 */}
      <ellipse cx="130" cy="180" rx="58" ry="40" fill={secondary} />
      <rect x="76" y="196" width="30" height="28" rx="8" fill={primary} />
      <rect x="154" y="196" width="30" height="28" rx="8" fill={primary} />

      {/* ★ 巨大な胸筋と肩 (Chest for Drumming) ★ */}
      <ellipse cx="130" cy="148" rx="66" ry="46" fill={primary} />
      {/* 盛り上がった大胸筋 */}
      <ellipse cx="110" cy="142" rx="20" ry="24" fill={secondary} />
      <ellipse cx="150" cy="142" rx="20" ry="24" fill={secondary} />

      {/* ★ ドラミングポーズの両剛腕＆巨大な拳 (DRUMMING ARMS) ★ */}
      {/* 左腕（画面向かって右） */}
      <path d="M190 120 C215 130, 218 165, 185 165 L175 150 Z" fill={primary} />
      <circle cx="172" cy="148" r="18" fill={secondary} />
      {/* 右腕（画面向かって左） */}
      <path d="M70 120 C45 130, 42 165, 75 165 L85 150 Z" fill={primary} />
      <circle cx="88" cy="148" r="18" fill={secondary} />

      {/* リストバンド */}
      <rect x="68" y="142" width="12" height="18" rx="4" fill={accent} />
      <rect x="180" y="142" width="12" height="18" rx="4" fill={accent} />

      {/* ★ ゴリラヘッド（盛り上がった頭頂骨トサカ） ★ */}
      {/* 頭頂部の盛り上がり */}
      <path d="M102 70 C102 38, 158 38, 158 70 Z" fill={primary} />
      {/* ゴリラフェイス */}
      <rect x="96" y="62" width="68" height="52" rx="14" fill={secondary} />
      {/* 広い鼻先口元 */}
      <ellipse cx="130" cy="98" rx="26" ry="15" fill={primary} />
      <circle cx="124" cy="95" r="3.5" fill="#0f172a" stroke="none" />
      <circle cx="136" cy="95" r="3.5" fill="#0f172a" stroke="none" />

      {!silhouette && (
        <g>
          {/* 太い眉骨と目 */}
          <rect x="104" y="68" width="52" height="8" rx="3" fill="#0f172a" stroke="none" />
          <circle cx="116" cy="80" r="5" fill={eyeColor} stroke="#0f172a" strokeWidth="2" />
          <circle cx="144" cy="80" r="5" fill={eyeColor} stroke="#0f172a" strokeWidth="2" />
        </g>
      )}
    </g>
  );
}

/** No.19 ゴッドサンダーフェンリル (背中に浮かぶ雷神光背リング、3本の神聖雷尾) */
function GodThunderFenrirSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 神聖な雷神光背リング (Raijin Thunder Halo) ★ */}
      <circle cx="130" cy="120" r="82" fill="none" stroke={accent} strokeWidth="5" strokeDasharray="18 12" />
      {!silhouette && (
        <g fill="#fef08a" stroke={outline} strokeWidth="2">
          <circle cx="130" cy="38" r="9" />
          <circle cx="208" cy="85" r="9" />
          <circle cx="208" cy="165" r="9" />
          <circle cx="52" cy="85" r="9" />
          <circle cx="52" cy="165" r="9" />
        </g>
      )}

      {/* 3本の神聖な雷光尾 */}
      <path d="M75 180 C20 195, 10 135, 45 105 Z" fill={accent} />
      <path d="M70 190 C30 225, 20 170, 48 145 Z" fill={secondary} />
      <path d="M80 195 C45 240, 35 195, 60 170 Z" fill={accent} />

      <ellipse cx="130" cy="168" rx="54" ry="44" fill={primary} />

      {/* 神狼ヘッド */}
      <polygon points="90,64 58,14 110,46" fill={primary} />
      <polygon points="170,64 202,14 150,46" fill={primary} />
      <circle cx="130" cy="94" r="42" fill={secondary} />
      <polygon points="112,100 148,100 130,132" fill={primary} />

      {/* 額の第三の目 */}
      {!silhouette && (
        <polygon points="130,58 136,68 130,78 124,68" fill="#fef08a" stroke={outline} strokeWidth="1.5" />
      )}

      {!silhouette && (
        <g>
          <polygon points="98,82 124,90 104,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
          <polygon points="162,82 136,90 156,98" fill={eyeColor} stroke="#0f172a" strokeWidth="2.5" />
        </g>
      )}

      <rect x="74" y="184" width="26" height="38" rx="8" fill={secondary} />
      <rect x="160" y="184" width="26" height="38" rx="8" fill={secondary} />
    </g>
  );
}

/* ==========================================================================
   💥 鳥山明風コラボ怪獣 (TORIYAMA-STYLE MONSTERS)
   ========================================================================== */

/** No.21 スーパーティラノ (超サイヤ人風の逆立つ金髪炎ヘア、気功波ポーズ、武道着の青帯) */
function SuperTyrannoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 尻尾 */}
      <path d="M75 185 Q22 175, 20 120 Q38 142, 78 152 Z" fill={primary} />
      {/* 尾先の金髪トゲ */}
      <polygon points="20,122 5,105 24,95 18,75 38,115" fill="#facc15" />

      {/* 強靭な二足ティラノ胴体 */}
      <ellipse cx="116" cy="162" rx="52" ry="46" fill={primary} />
      <ellipse cx="126" cy="164" rx="30" ry="32" fill={secondary} stroke="none" />

      {/* ★ 武道着の青い帯 (MARTIAL ARTS OBI SASH) ★ */}
      {!silhouette && (
        <g>
          <rect x="74" y="160" width="84" height="12" rx="4" fill="#1d4ed8" stroke={outline} strokeWidth="2.5" />
          <path d="M78 166 Q65 185, 60 210 L70 212 Q75 190, 84 172 Z" fill="#1d4ed8" stroke={outline} strokeWidth="2" />
          <path d="M84 168 Q75 192, 74 218 L82 220 Q84 195, 90 172 Z" fill="#2563eb" stroke={outline} strokeWidth="2" />
        </g>
      )}

      {/* 足と青いリストバンド風アンクル */}
      <rect x="76" y="192" width="28" height="34" rx="8" fill={secondary} />
      <rect x="130" y="192" width="28" height="34" rx="8" fill={secondary} />
      {!silhouette && (
        <g fill="#1d4ed8" stroke="none">
          <rect x="76" y="192" width="28" height="8" rx="2" />
          <rect x="130" y="192" width="28" height="8" rx="2" />
        </g>
      )}
      <polygon points="72,226 82,216 88,226" fill={accent} />
      <polygon points="86,226 96,216 102,226" fill={accent} />
      <polygon points="126,226 136,216 142,226" fill={accent} />
      <polygon points="140,226 150,216 156,226" fill={accent} />

      {/* ★ 超サイヤ人風の黄金に逆立つ大迫力ヘア (SUPER SAIYAN SPIKY HAIR) ★ */}
      <polygon
        points="95,70 65,25 90,40 75,5 112,30 115,-5 138,25 152,0 160,32 188,10 178,45 208,35 185,68"
        fill="#facc15"
      />
      {!silhouette && (
        <polygon
          points="102,65 82,30 98,42 88,18 116,35 120,8 136,30 148,12 152,36 172,22 165,48 185,42 172,66"
          fill="#fef08a"
          stroke="none"
        />
      )}

      {/* ティラノヘッド */}
      <path
        d="M86 115 C82 65, 126 50, 175 58 C212 65, 222 92, 212 110 L160 114 L205 130 C194 148, 150 152, 114 138 Z"
        fill={primary}
      />

      {/* 鋭いキバ */}
      {!silhouette && (
        <g fill="#ffffff" stroke="#0f172a" strokeWidth="2">
          <polygon points="166,110 173,122 180,110" />
          <polygon points="183,110 190,123 197,110" />
          <polygon points="199,109 205,121 211,109" />
        </g>
      )}

      {/* ★ ドラゴンボール風の鋭い目元 (DBZ EYE) ★ */}
      {!silhouette && (
        <g>
          {/* 太い眉ライン */}
          <polygon points="132,66 172,74 165,80 134,74" fill="#0f172a" stroke="none" />
          {/* 目と瞳 */}
          <polygon points="138,75 166,80 145,92" fill="#22d3ee" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="154" cy="82" r="3.5" fill="#0f172a" stroke="none" />
        </g>
      )}

      {/* ★ かめはめ波ポーズの両手 ＆ 輝く気功波エネルギー弾 ★ */}
      <path d="M125 140 L160 142 L168 158 L130 155 Z" fill={secondary} />
      {!silhouette && (
        <g>
          <circle cx="182" cy="148" r="22" fill="#38bdf8" opacity="0.45" stroke="none" />
          <circle cx="182" cy="148" r="15" fill="#06b6d4" stroke="#ffffff" strokeWidth="3" />
          <circle cx="182" cy="148" r="8" fill="#ffffff" stroke="none" />
          <polygon points="182,120 186,130 178,130" fill="#fef08a" stroke="none" />
          <polygon points="182,176 186,166 178,166" fill="#fef08a" stroke="none" />
          <polygon points="208,148 198,152 198,144" fill="#fef08a" stroke="none" />
        </g>
      )}
    </g>
  );
}

/** No.22 カプセルポッポ (Dr.スランプ アラレちゃん風の天使の羽つきキャップ、丸型レトロメカ、んちゃ砲) */
function CapsulePoppoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 背面のゼンマイネジまたは排気管 */}
      <rect x="52" y="130" width="16" height="24" rx="4" fill={secondary} />
      <circle cx="44" cy="142" r="10" fill={accent} stroke={outline} strokeWidth="3" />

      {/* 丸っこい足＆赤いスニーカー風シューズ */}
      <rect x="85" y="188" width="28" height="26" rx="8" fill={secondary} />
      <rect x="145" y="188" width="28" height="26" rx="8" fill={secondary} />
      <ellipse cx="98" cy="218" rx="20" ry="10" fill="#ef4444" />
      <ellipse cx="160" cy="218" rx="20" ry="10" fill="#ef4444" />
      {!silhouette && (
        <g fill="#ffffff" stroke="none">
          <ellipse cx="98" cy="218" rx="14" ry="4" opacity="0.6" />
          <ellipse cx="160" cy="218" rx="14" ry="4" opacity="0.6" />
        </g>
      )}

      {/* ★ まるっこいカプセル型の胴体 (Chubby Capsule Body) ★ */}
      <ellipse cx="130" cy="154" rx="55" ry="44" fill={primary} />
      <circle cx="130" cy="154" r="24" fill="#0f172a" stroke={outline} strokeWidth="3" />
      <circle cx="130" cy="154" r="18" fill="#38bdf8" stroke="none" />
      {!silhouette && (
        <g stroke="none" fill="#ffffff">
          <ellipse cx="124" cy="148" rx="6" ry="4" opacity="0.8" />
          <circle cx="138" cy="162" r="3" opacity="0.7" />
          <circle cx="125" cy="164" r="2" opacity="0.7" />
        </g>
      )}

      {/* ★ 左腕：白いアニメ手袋で元気に「んちゃ！」バイバイ ★ */}
      <path d="M175 145 Q198 135, 205 115" stroke={primary} strokeWidth="12" strokeLinecap="round" />
      <circle cx="206" cy="112" r="16" fill="#ffffff" stroke={outline} strokeWidth="3" />
      <circle cx="216" cy="108" r="6" fill="#ffffff" stroke={outline} strokeWidth="2.5" />

      {/* ★ 右腕：ラッパ型の「んちゃ砲」ウォーターバズーカ ★ */}
      <rect x="42" y="142" width="38" height="22" rx="6" fill={secondary} />
      <polygon points="42,136 18,124 18,172 42,160" fill={accent} />
      {!silhouette && (
        <g stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.85">
          <ellipse cx="14" cy="148" rx="4" ry="16" />
          <ellipse cx="6" cy="148" rx="4" ry="22" />
        </g>
      )}

      {/* ★ 丸型ヘッド (Round Head) ★ */}
      <circle cx="130" cy="80" r="38" fill={primary} />

      {/* ★ アラレちゃん風の天使の羽つきキャップ (ARALE WING CAP) ★ */}
      <path d="M94 65 C94 30, 166 30, 166 65 Z" fill="#ec4899" />
      <path d="M88 65 C88 56, 172 56, 172 65 L178 72 C178 75, 82 75, 82 72 Z" fill="#f43f5e" />
      {!silhouette && (
        <circle cx="130" cy="46" r="6" fill="#facc15" stroke={outline} strokeWidth="1.5" />
      )}
      <g fill="#ffffff">
        <path d="M96 52 C65 42, 60 22, 85 25 C75 32, 82 42, 94 48 Z" />
        <path d="M164 52 C195 42, 200 22, 175 25 C185 32, 178 42, 166 48 Z" />
      </g>

      {/* ★ アラレちゃん風のクリクリ大きな丸目 ＆ 笑顔 ★ */}
      {!silhouette && (
        <g>
          <circle cx="114" cy="82" r="10" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="115" cy="82" r="5" fill="#0f172a" stroke="none" />
          <circle cx="117" cy="80" r="2" fill="#ffffff" stroke="none" />

          <circle cx="146" cy="82" r="10" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="145" cy="82" r="5" fill="#0f172a" stroke="none" />
          <circle cx="147" cy="80" r="2" fill="#ffffff" stroke="none" />

          <ellipse cx="104" cy="94" rx="6" ry="4" fill="#fb7185" stroke="none" opacity="0.7" />
          <ellipse cx="156" cy="94" rx="6" ry="4" fill="#fb7185" stroke="none" opacity="0.7" />

          <path d="M120 95 Q130 110, 140 95 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
        </g>
      )}
    </g>
  );
}

/** No.23 スカウタードラゴ (神龍シェンロン風東洋龍、赤いスカウター、筋斗雲風の雷雲、ドラゴンボール) */
function ScouterDragoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 筋斗雲・雷雲のふわふわ台座 */}
      <g fill="#fef08a" opacity="0.95">
        <circle cx="70" cy="205" r="22" />
        <circle cx="105" cy="215" r="26" />
        <circle cx="145" cy="215" r="26" />
        <circle cx="185" cy="205" r="22" />
        <circle cx="130" cy="195" r="24" />
      </g>

      {/* 東洋龍の波打つ胴体 */}
      <path
        d="M60 170 Q130 140, 150 185 Q170 215, 205 175"
        fill="none"
        stroke={primary}
        strokeWidth="32"
        strokeLinecap="round"
      />
      {!silhouette && (
        <path
          d="M60 170 Q130 140, 150 185 Q170 215, 205 175"
          fill="none"
          stroke={accent}
          strokeWidth="16"
          strokeLinecap="round"
        />
      )}

      {/* 2本の神龍の鹿角 */}
      <path d="M105 60 L75 15 L95 35 L75 8 L105 48 Z" fill="#facc15" />
      <path d="M155 60 L185 15 L165 35 L185 8 L155 48 Z" fill="#facc15" />

      {/* ドラゴンヘッド */}
      <path
        d="M92 78 C92 48, 168 48, 168 78 L180 106 C158 126, 102 126, 80 106 Z"
        fill={primary}
      />
      <polygon points="130,28 118,52 142,52" fill={accent} />

      {/* 神龍のヒゲ */}
      <path d="M92 105 Q45 95, 20 125" fill="none" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
      <path d="M168 105 Q215 95, 240 125" fill="none" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />

      {/* 右目 */}
      {!silhouette && (
        <g>
          <polygon points="98,82 122,88 102,96" fill="#ef4444" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="112" cy="88" r="3" fill="#0f172a" stroke="none" />
        </g>
      )}

      {/* ★ 鳥山明名物：左目の赤いスカウター (SAIYAN SCOUTER) ★ */}
      {!silhouette && (
        <g>
          <rect x="172" y="70" width="16" height="24" rx="4" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
          <circle cx="180" cy="82" r="4" fill="#facc15" stroke="none" />
          <line x1="180" y1="70" x2="195" y2="48" stroke="#0f172a" strokeWidth="3" />
          <polygon
            points="140,75 174,74 170,102 138,98"
            fill="#ef4444"
            opacity="0.88"
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <circle cx="152" cy="86" r="4" fill="#ffffff" opacity="0.8" stroke="none" />
          <line x1="144" y1="86" x2="160" y2="86" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
        </g>
      )}

      {/* ドラゴンボール */}
      <circle cx="130" cy="165" r="18" fill="#f97316" stroke="#ffffff" strokeWidth="3" />
      {!silhouette && (
        <g fill="#ef4444" stroke="none">
          <polygon points="130,158 132,163 137,163 133,166 135,171 130,168 125,171 127,166 123,163 128,163" />
          <ellipse cx="124" cy="160" rx="4" ry="2" fill="#ffffff" opacity="0.75" />
        </g>
      )}
    </g>
  );
}

/** No.24 ガッチャビースト (Dr.スランプ ガッちゃん風の天使の輪、妖精の羽、うんちステッキ、なんでも食べるキバ) */
function GatchaBeastSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 天使の黄金の輪っか */}
      <ellipse cx="130" cy="38" rx="28" ry="8" fill="none" stroke="#facc15" strokeWidth="4.5" />

      {/* 背中の小さな妖精ウイング */}
      <path d="M96 125 C65 105, 52 125, 74 146 Z" fill="#c084fc" />
      <path d="M164 125 C195 105, 208 125, 186 146 Z" fill="#c084fc" />

      {/* まるまるボディ */}
      <ellipse cx="130" cy="165" rx="55" ry="46" fill={primary} />
      <ellipse cx="130" cy="168" rx="34" ry="32" fill={accent} stroke="none" opacity="0.9" />

      {/* まるい足 */}
      <ellipse cx="90" cy="208" rx="16" ry="12" fill={secondary} />
      <ellipse cx="170" cy="208" rx="16" ry="12" fill={secondary} />

      {/* ★ 右手：アラレちゃん名物「ピンクのうんちステッキ」 ★ */}
      <line x1="58" y1="185" x2="38" y2="120" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
      <path
        d="M38 120 C24 120, 22 100, 38 100 C28 92, 48 85, 42 78 C38 88, 54 94, 52 105 C58 115, 48 120, 38 120 Z"
        fill="#f43f5e"
      />
      <circle cx="38" cy="148" r="10" fill={secondary} />

      {/* 左手 */}
      <circle cx="182" cy="158" r="10" fill={secondary} />

      {/* 大きくて丸い顔 */}
      <circle cx="130" cy="95" r="44" fill={primary} />
      <polygon points="130,52 118,28 130,42 142,28" fill={accent} />

      {!silhouette && (
        <g>
          <ellipse cx="112" cy="88" rx="12" ry="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          <ellipse cx="114" cy="88" rx="7" ry="9" fill="#0f172a" stroke="none" />
          <circle cx="116" cy="84" r="3" fill="#ffffff" stroke="none" />

          <ellipse cx="148" cy="88" rx="12" ry="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          <ellipse cx="146" cy="88" rx="7" ry="9" fill="#0f172a" stroke="none" />
          <circle cx="148" cy="84" r="3" fill="#ffffff" stroke="none" />

          <circle cx="98" cy="104" r="7" fill="#fb7185" stroke="none" opacity="0.75" />
          <circle cx="162" cy="104" r="7" fill="#fb7185" stroke="none" opacity="0.75" />

          <path d="M116 108 Q130 126, 144 108 Z" fill="#0f172a" stroke="none" />
          <polygon points="120,108 125,116 130,108" fill="#ffffff" stroke="none" />
          <polygon points="130,108 135,116 140,108" fill="#ffffff" stroke="none" />
        </g>
      )}
    </g>
  );
}

/** No.25 キン斗ゴクウ (黄金の筋斗雲、赤い如意棒、緊箍児の輪、炎の逆立ちヘアの孫悟空風モンキー獣) */
function KintoGokuBeastSvg({ primary, secondary, accent, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* くるんと伸びるサルのシッポ */}
      <path
        d="M170 165 C215 160, 232 115, 205 100 C188 92, 185 115, 202 118"
        fill="none"
        stroke="#b45309"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* ★ 背中で斜めに構える伸縮自在の「赤い如意棒（にょいぼう）」 ★ */}
      <g transform="rotate(-28 130 135)">
        <rect x="20" y="128" width="220" height="14" rx="6" fill="#dc2626" />
        <rect x="20" y="128" width="24" height="14" rx="4" fill="#facc15" />
        <rect x="216" y="128" width="24" height="14" rx="4" fill="#facc15" />
      </g>

      {/* オレンジの道着ボディ＆青い帯 */}
      <path d="M92 125 L168 125 L178 182 L82 182 Z" fill="#f97316" />
      <polygon points="112,125 130,152 148,125" fill="#1d4ed8" />
      <rect x="86" y="162" width="88" height="12" rx="5" fill="#1d4ed8" />

      {/* 両腕・リストバンド */}
      <ellipse cx="75" cy="142" rx="18" ry="12" fill={secondary} />
      <rect x="62" y="135" width="10" height="14" rx="3" fill="#1d4ed8" />
      <ellipse cx="185" cy="142" rx="18" ry="12" fill={secondary} />
      <rect x="188" y="135" width="10" height="14" rx="3" fill="#1d4ed8" />

      {/* ツンツン逆立つ悟空＆炎ヘア */}
      <polygon
        points="130,12 108,45 72,22 92,62 52,55 82,84 178,84 208,55 168,62 188,22 152,45"
        fill={primary}
      />
      <polygon points="130,22 115,52 90,38 104,68 156,68 170,38 145,52" fill="#facc15" stroke="none" />

      {/* サルの耳＆丸い顔 */}
      <circle cx="84" cy="92" r="14" fill={secondary} />
      <circle cx="176" cy="92" r="14" fill={secondary} />
      <circle cx="130" cy="92" r="36" fill="#fed7aa" />

      {/* 黄金の緊箍児（きんこじ）ヘッドバンド */}
      <path d="M94 74 Q130 82, 166 74" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
      <circle cx="130" cy="74" r="6" fill="#ef4444" />

      {/* 元気いっぱいの目と笑顔 */}
      {!silhouette && (
        <g>
          <ellipse cx="114" cy="92" rx="8" ry="10" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="115" cy="92" r="5" fill="#0f172a" stroke="none" />
          <circle cx="117" cy="89" r="2" fill="#ffffff" stroke="none" />

          <ellipse cx="146" cy="92" rx="8" ry="10" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="145" cy="92" r="5" fill="#0f172a" stroke="none" />
          <circle cx="147" cy="89" r="2" fill="#ffffff" stroke="none" />

          <path d="M116 108 Q130 120, 144 108 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="2.5" />
        </g>
      )}

      {/* ★ 足元のモクモク黄金「筋斗雲（きんとうん）」 ★ */}
      <path
        d="M25 205 C10 195, 20 175, 42 182 C55 168, 82 178, 92 182 C108 166, 152 166, 168 182 C185 168, 218 175, 212 196 C230 205, 210 225, 185 218 C160 228, 100 228, 72 218 C48 225, 20 218, 25 205 Z"
        fill="#facc15"
      />
      {!silhouette && (
        <ellipse cx="130" cy="198" rx="62" ry="12" fill="#fef08a" stroke="none" opacity="0.7" />
      )}
    </g>
  );
}

/** No.26 ブリザードプレシオ (長い首の首長竜プレシオサウルス × 氷河クリスタル背ビレ × 4枚のヒレ) */
function BlizzardPlesioSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 背中の巨大氷河クリスタル群 */}
      <polygon points="110,145 125,95 142,145" fill="#e0f2fe" />
      <polygon points="135,142 158,82 175,145" fill="#bae6fd" />
      <polygon points="165,148 188,105 198,155" fill="#7dd3fc" />

      {/* しなやかな長いシッポ */}
      <path d="M180 175 Q225 170, 242 135 Q232 195, 178 195 Z" fill={secondary} />

      {/* どっしりした首長竜の胴体 */}
      <ellipse cx="145" cy="175" rx="56" ry="36" fill={primary} />
      <ellipse cx="142" cy="184" rx="42" ry="20" fill={accent} stroke="none" opacity="0.85" />

      {/* 4枚の大きな遊泳ヒレ（フリッパー） */}
      <path d="M105 188 C75 205, 62 228, 92 225 C112 220, 122 202, 120 190 Z" fill={secondary} />
      <path d="M168 188 C185 212, 208 228, 218 215 C215 198, 192 188, 180 185 Z" fill={secondary} />

      {/* ★ プレシオサウルス特有の長く美しいS字の首 ★ */}
      <path
        d="M105 168 C78 150, 72 95, 92 55 L112 62 C98 98, 102 140, 126 158 Z"
        fill={primary}
      />

      {/* 首長竜の頭＆氷のクラウン角 */}
      <polygon points="95,48 112,18 118,46 134,24 128,54" fill="#e0f2fe" />
      <path d="M62 56 C62 36, 122 36, 124 58 C124 72, 65 74, 52 64 Z" fill={primary} />

      {/* 口元の氷結ブリザードエネルギー球 */}
      {!silhouette && (
        <g>
          <circle cx="42" cy="62" r="12" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="3" />
          <ellipse cx="86" cy="52" rx="8" ry="6" fill={eyeColor} stroke="#0f172a" strokeWidth="2" />
          <circle cx="84" cy="52" r="3" fill="#0f172a" stroke="none" />
        </g>
      )}
    </g>
  );
}

/** No.27 ライジンショーグンロボ (黄金の三日月兜、背中の雷神連太鼓、二刀流イナズマ刀の将軍メカ) */
function RaijinShogunRoboSvg({ primary, secondary, accent, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 背中の「雷神・連太鼓（かみなりリング）」 ★ */}
      <circle cx="130" cy="115" r="78" fill="none" stroke="#facc15" strokeWidth="5" />
      {[
        [52, 115],
        [72, 58],
        [130, 36],
        [188, 58],
        [208, 115],
      ].map(([cx, cy], idx) => (
        <g key={idx}>
          <circle cx={cx} cy={cy} r="13" fill="#fef08a" stroke="#b45309" strokeWidth="3" />
          {!silhouette && (
            <circle cx={cx} cy={cy} r="5" fill="#0f172a" stroke="none" />
          )}
        </g>
      ))}

      {/* ★ 両手に構える二刀流「イナズマレーザー日本刀」 ★ */}
      <polygon points="48,145 12,42 26,38 62,140" fill="#38bdf8" />
      <rect x="42" y="138" width="24" height="8" rx="2" fill="#facc15" />
      <polygon points="212,145 248,42 234,38 198,140" fill="#38bdf8" />
      <rect x="194" y="138" width="24" height="8" rx="2" fill="#facc15" />

      {/* 戦国大鎧アーマー脚・胴体 */}
      <rect x="86" y="182" width="32" height="38" rx="6" fill={secondary} />
      <rect x="142" y="182" width="32" height="38" rx="6" fill={secondary} />
      <polygon points="78,118 182,118 170,188 90,188" fill={primary} />

      {/* 胸の雷神コア＆大袖（肩アーマー） */}
      <polygon points="52,112 88,108 82,148 46,144" fill={secondary} />
      <polygon points="208,112 172,108 178,148 214,144" fill={secondary} />
      <circle cx="130" cy="150" r="18" fill="#38bdf8" />
      <polygon points="134,136 120,152 132,152 124,166 142,148 130,148" fill="#fef08a" stroke="none" />

      {/* 将軍ロボ頭部＆武者兜（カブト） */}
      <path d="M84 95 C84 58, 176 58, 176 95 L186 112 L74 112 Z" fill="#1e293b" />
      <rect x="96" y="75" width="68" height="34" rx="6" fill={primary} />

      {/* ★ 兜の巨大黄金三日月前立て ★ */}
      <path
        d="M130 68 C95 68, 72 32, 86 14 C88 36, 108 52, 130 52 C152 52, 172 36, 174 14 C188 32, 165 68, 130 68 Z"
        fill="#facc15"
      />

      {/* ツインアイ（ガンダム・戦国メカ風） */}
      {!silhouette && (
        <g>
          <polygon points="102,86 124,90 104,96" fill="#4ade80" stroke="none" />
          <polygon points="158,86 136,90 156,96" fill="#4ade80" stroke="none" />
          <rect x="114" y="98" width="32" height="8" rx="2" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
        </g>
      )}
    </g>
  );
}

/** No.28 クリスタルシェンロン (うねる東洋龍ボディ、エメラルド宝玉7つ、若葉とクリスタルの鹿角) */
function CrystalShenronSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 周囲に浮かぶ7つの森のクリスタル宝玉 ★ */}
      {[
        [42, 75],
        [68, 32],
        [130, 18],
        [192, 32],
        [218, 75],
        [48, 145],
        [212, 145],
      ].map(([cx, cy], idx) => (
        <g key={idx}>
          <circle cx={cx} cy={cy} r="10" fill="#34d399" stroke="#fef08a" strokeWidth="2.5" />
          {!silhouette && (
            <polygon
              points={`${cx},${cy - 5} ${cx + 4},${cy} ${cx},${cy + 5} ${cx - 4},${cy}`}
              fill="#fef08a"
              stroke="none"
            />
          )}
        </g>
      ))}

      {/* とぐろを巻く東洋神龍の長い身体 */}
      <path
        d="M65 205 C30 175, 55 125, 130 135 C205 145, 225 195, 175 215 C135 228, 85 220, 65 205 Z"
        fill={primary}
      />
      <path
        d="M82 195 C62 175, 82 148, 130 152 C178 158, 192 188, 160 202 Z"
        fill={accent}
      />

      {/* 背中のクリスタル背ビレ列 */}
      <polygon points="85,128 96,105 108,130 124,104 138,130 154,106 168,132" fill="#a7f3d0" />

      {/* クリスタルの鹿角（2本） */}
      <path d="M104 62 L78 24 L96 42 L88 18 L112 54 Z" fill="#6ee7b7" />
      <path d="M156 62 L182 24 L164 42 L172 18 L148 54 Z" fill="#6ee7b7" />

      {/* 神龍の顔＆長い龍のヒゲ */}
      <path d="M90 82 C90 50, 170 50, 170 82 L182 112 C158 132, 102 132, 78 112 Z" fill={primary} />
      <path d="M88 106 Q42 98, 22 128" fill="none" stroke="#fde047" strokeWidth="5" strokeLinecap="round" />
      <path d="M172 106 Q218 98, 238 128" fill="none" stroke="#fde047" strokeWidth="5" strokeLinecap="round" />

      {/* 額の虹色クリスタル＆神秘的な瞳 */}
      <polygon points="130,52 140,68 130,82 120,68" fill="#facc15" />
      {!silhouette && (
        <g>
          <polygon points="96,86 120,92 100,100" fill={eyeColor} stroke="#0f172a" strokeWidth="2" />
          <polygon points="164,86 140,92 160,100" fill={eyeColor} stroke="#0f172a" strokeWidth="2" />
        </g>
      )}
    </g>
  );
}

/* ==========================================================================
   ⚡ ポケモン風モンスター 8体 (POKEMON-STYLE MONSTERS No.29〜36)
   ========================================================================== */

/** No.29 サラマンドラ (しっぽの先で炎が燃えさかる小さな竜戦士・リザードン/ヒトカゲ風) */
function SalamandraSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 燃えさかる炎のしっぽ */}
      <path d="M78 178 Q28 185, 22 135 Q45 145, 82 156 Z" fill="#ea580c" />
      {/* 尾先の三層ファイヤー（赤・橙・黄・白） */}
      {!silhouette ? (
        <g stroke="none">
          <path d="M24 136 C6 112, 4 72, 22 52 C38 80, 52 98, 24 136 Z" fill="#ef4444" />
          <path d="M24 125 C12 104, 10 78, 24 64 C34 85, 44 100, 24 125 Z" fill="#f97316" />
          <path d="M23 112 C16 96, 15 82, 23 72 C30 87, 36 98, 23 112 Z" fill="#fde047" />
          <circle cx="23" cy="88" r="3.5" fill="#ffffff" />
        </g>
      ) : (
        <path d="M24 136 C6 112, 4 72, 22 52 C38 80, 52 98, 24 136 Z" fill={secondary} />
      )}

      {/* 背中のドラゴンウイング（外側オレンジ・内膜エメラルドブルー） */}
      <polygon points="92,135 48,72 74,88 56,58 98,98" fill="#0284c7" />
      <polygon points="152,125 204,65 178,85 198,52 148,96" fill="#0284c7" />
      <path d="M48 72 L74 88 L56 58 L98 98" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
      <path d="M204 65 L178 85 L198 52 L148 96" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />

      {/* まあるいオレンジの胴体 */}
      <ellipse cx="125" cy="165" rx="50" ry="44" fill="#f97316" />
      {/* やさしいクリーム色のお腹 */}
      <ellipse cx="132" cy="168" rx="30" ry="32" fill="#fef08a" stroke="none" />
      {!silhouette && (
        <g stroke="#f59e0b" strokeWidth="2.5" fill="none" opacity="0.7">
          <path d="M112 158 Q132 166, 150 158" />
          <path d="M114 172 Q132 180, 150 172" />
        </g>
      )}

      {/* 二足歩行の足と白い爪 */}
      <rect x="80" y="195" width="26" height="30" rx="8" fill="#ea580c" />
      <rect x="136" y="195" width="26" height="30" rx="8" fill="#ea580c" />
      <polygon points="76,225 84,216 90,225" fill="#ffffff" />
      <polygon points="88,225 96,216 102,225" fill="#ffffff" />
      <polygon points="132,225 140,216 146,225" fill="#ffffff" />
      <polygon points="144,225 152,216 158,225" fill="#ffffff" />

      {/* 元気なドラゴンの腕と小さな爪 */}
      <path d="M100 148 L80 162 L88 172 L106 160 Z" fill="#ea580c" />
      <path d="M148 148 L170 160 L164 172 L142 160 Z" fill="#ea580c" />

      {/* ドラゴンヘッド＆後ろへ伸びる2本のツノ */}
      <path d="M102 78 Q78 42, 62 32 Q84 55, 108 72 Z" fill="#c2410c" />
      <path d="M140 75 Q168 38, 186 28 Q164 54, 144 70 Z" fill="#c2410c" />
      <ellipse cx="125" cy="95" rx="38" ry="34" fill="#f97316" />
      <ellipse cx="132" cy="106" rx="28" ry="18" fill="#f97316" />

      {/* 表情豊かなアニメ風ドラゴンEYE＆小さなキバ */}
      {!silhouette && (
        <g>
          {/* 青く輝く瞳 */}
          <ellipse cx="112" cy="88" rx="8" ry="11" fill="#0284c7" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="112" cy="88" rx="4" ry="7" fill="#082f49" stroke="none" />
          <circle cx="110" cy="84" r="3" fill="#ffffff" stroke="none" />

          <ellipse cx="140" cy="88" rx="8" ry="11" fill="#0284c7" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="140" cy="88" rx="4" ry="7" fill="#082f49" stroke="none" />
          <circle cx="138" cy="84" r="3" fill="#ffffff" stroke="none" />

          {/* 笑顔の口と白いちびキバ */}
          <path d="M120 110 Q132 120, 144 110" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="124,110 128,116 132,110" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
        </g>
      )}
    </g>
  );
}

/** No.30 ヒノキツネ (ふさふさ炎の九尾の尻尾、大きなキツネ耳、モフモフ胸毛・ロコン/フォッコ風) */
function HinoKitsuneSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ ふわもこに立ちのぼる炎の尻尾（3段カール） ★ */}
      <path
        d="M92 170 C38 185, 12 135, 26 95 C40 62, 78 78, 60 112 C82 96, 102 112, 92 145 Z"
        fill="#f97316"
      />
      <path
        d="M78 160 C42 165, 24 125, 38 95 C48 75, 72 88, 58 115 Z"
        fill="#fde047"
        stroke="none"
      />

      {/* お行儀よく座るキツネの身体 */}
      <ellipse cx="130" cy="170" rx="44" ry="38" fill="#f97316" />

      {/* ★ 胸元のモフモフ白い毛並み (FLUFFY WHITE CHEST RUFF) ★ */}
      <path
        d="M102 132 C95 158, 130 168, 130 168 C130 168, 165 158, 158 132 C146 142, 130 138, 130 138 C130 138, 114 142, 102 132 Z"
        fill="#fffbeb"
      />

      {/* 前足の白いソックス */}
      <rect x="105" y="182" width="18" height="26" rx="8" fill="#fffbeb" />
      <rect x="137" y="182" width="18" height="26" rx="8" fill="#fffbeb" />

      {/* まあるい子ギツネの頭部 */}
      <circle cx="130" cy="98" r="38" fill="#f97316" />

      {/* ★ 大きな三角キツネ耳＆中の炎の毛束 ★ */}
      <polygon points="96,82 62,18 118,62" fill="#ea580c" />
      <polygon points="96,78 74,32 110,65" fill="#fef08a" />
      <polygon points="164,82 198,18 142,62" fill="#ea580c" />
      <polygon points="164,78 186,32 150,65" fill="#fef08a" />

      {/* 頭の上の炎カール毛（3つのまあるい毛束） */}
      <circle cx="118" cy="64" r="10" fill="#ea580c" />
      <circle cx="130" cy="56" r="12" fill="#fde047" />
      <circle cx="142" cy="64" r="10" fill="#ea580c" />

      {/* キラキラした大きなアニメ子ギツネEYE＆ピンクのほっぺ */}
      {!silhouette && (
        <g>
          {/* くりくり大きな瞳 */}
          <ellipse cx="112" cy="96" rx="9" ry="12" fill="#451a03" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="112" cy="96" rx="5" ry="8" fill="#d97706" stroke="none" />
          <circle cx="110" cy="92" r="3.5" fill="#ffffff" stroke="none" />
          <circle cx="114" cy="102" r="1.5" fill="#ffffff" stroke="none" />

          <ellipse cx="148" cy="96" rx="9" ry="12" fill="#451a03" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="148" cy="96" rx="5" ry="8" fill="#d97706" stroke="none" />
          <circle cx="146" cy="92" r="3.5" fill="#ffffff" stroke="none" />
          <circle cx="150" cy="102" r="1.5" fill="#ffffff" stroke="none" />

          {/* ほんのりピンクのほっぺ */}
          <ellipse cx="98" cy="108" rx="6" ry="4" fill="#fb7185" stroke="none" opacity="0.8" />
          <ellipse cx="162" cy="108" rx="6" ry="4" fill="#fb7185" stroke="none" opacity="0.8" />

          {/* ちっちゃな黒鼻＆にっこりお口 */}
          <polygon points="130,105 127,108 133,108" fill="#0f172a" stroke="none" />
          <path d="M124 112 Q130 117, 136 112" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/** No.31 アクアカメドン (2門の水流キャノン砲、頑丈な甲羅、うずまき尾・カメックス/ゼニガメ風) */
function AquaKamedonSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 両肩から突き出る2門のハイドロキャノン砲身 ★ */}
      <rect x="65" y="65" width="22" height="42" rx="4" transform="rotate(-25 76 86)" fill="#94a3b8" />
      <rect x="173" y="65" width="22" height="42" rx="4" transform="rotate(25 184 86)" fill="#94a3b8" />
      {/* キャノン先端のリング */}
      <ellipse cx="68" cy="62" rx="10" ry="5" transform="rotate(-25 68 62)" fill="#cbd5e1" />
      <ellipse cx="192" cy="62" rx="10" ry="5" transform="rotate(25 192 62)" fill="#cbd5e1" />
      {!silhouette && (
        <g stroke="none">
          <circle cx="58" cy="50" r="9" fill="#38bdf8" opacity="0.8" />
          <circle cx="48" cy="38" r="5" fill="#bae6fd" opacity="0.75" />
          <circle cx="202" cy="50" r="9" fill="#38bdf8" opacity="0.8" />
          <circle cx="212" cy="38" r="5" fill="#bae6fd" opacity="0.75" />
        </g>
      )}

      {/* くるんと巻いた水色のシッポ */}
      <path d="M180 180 Q215 190, 222 165 Q215 145, 192 165" fill="#38bdf8" />

      {/* ★ どっしりとした亀甲羅（フチはクリーム色、甲羅はダークブラウン） ★ */}
      <ellipse cx="130" cy="162" rx="60" ry="50" fill="#fef3c7" />
      <ellipse cx="130" cy="162" rx="52" ry="42" fill="#78350f" />
      {/* 甲羅の六角形模様 */}
      {!silhouette && (
        <g fill="none" stroke="#b45309" strokeWidth="3">
          <polygon points="130,132 146,142 146,160 130,170 114,160 114,142" />
          <line x1="130" y1="132" x2="130" y2="120" />
          <line x1="146" y1="142" x2="168" y2="136" />
          <line x1="146" y1="160" x2="168" y2="172" />
          <line x1="130" y1="170" x2="130" y2="198" />
          <line x1="114" y1="160" x2="92" y2="172" />
          <line x1="114" y1="142" x2="92" y2="136" />
        </g>
      )}

      {/* 頑丈な水色の足＆3つの白いツメ */}
      <rect x="76" y="194" width="28" height="28" rx="8" fill="#38bdf8" />
      <rect x="156" y="194" width="28" height="28" rx="8" fill="#38bdf8" />
      <polygon points="72,222 78,214 84,222" fill="#ffffff" />
      <polygon points="84,222 90,214 96,222" fill="#ffffff" />
      <polygon points="152,222 158,214 164,222" fill="#ffffff" />
      <polygon points="164,222 170,214 176,222" fill="#ffffff" />

      {/* まあるい水色のカメ頭部 */}
      <circle cx="130" cy="98" r="38" fill="#38bdf8" />

      {/* 元気な大きな瞳＆頼もしいお口 */}
      {!silhouette && (
        <g>
          <ellipse cx="114" cy="94" rx="8" ry="11" fill="#1e1b4b" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="114" cy="94" rx="4" ry="7" fill="#6366f1" stroke="none" />
          <circle cx="112" cy="90" r="3" fill="#ffffff" stroke="none" />

          <ellipse cx="146" cy="94" rx="8" ry="11" fill="#1e1b4b" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="146" cy="94" rx="4" ry="7" fill="#6366f1" stroke="none" />
          <circle cx="144" cy="90" r="3" fill="#ffffff" stroke="none" />

          {/* にっかり笑った口と小さなキバ */}
          <path d="M120 114 Q130 124, 140 114" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="122,114 125,119 128,114" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
          <polygon points="132,114 135,119 138,114" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
        </g>
      )}
    </g>
  );
}

/** No.32 アクアカイリュー (額のクリスタル角、真珠の首飾り、ヒレ耳、イルカ尾・ラプラス/ハクリュー風) */
function AquaKairyuSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 優雅なマーメイド／イルカ型の尾ビレ ★ */}
      <path
        d="M165 175 C215 185, 235 145, 215 120 C238 105, 248 145, 228 185 C208 215, 165 195, 165 175 Z"
        fill="#38bdf8"
      />
      {!silhouette && (
        <path d="M195 170 Q215 150, 222 135" fill="none" stroke="#e0f2fe" strokeWidth="2.5" />
      )}

      {/* しなやかな水竜の胴体 */}
      <ellipse cx="130" cy="168" rx="52" ry="38" fill="#0284c7" />
      {/* まっしろなお腹 */}
      <ellipse cx="130" cy="174" rx="36" ry="24" fill="#f0f9ff" stroke="none" />

      {/* 両側のヒレ翼 */}
      <path d="M84 165 C52 160, 48 180, 78 185 Z" fill="#38bdf8" />
      <path d="M176 165 C208 160, 212 180, 182 185 Z" fill="#38bdf8" />

      {/* 優雅に伸びる長い首 */}
      <path d="M114 155 Q118 105, 126 78 L146 80 Q144 110, 146 155 Z" fill="#0284c7" />

      {/* ★ 首元の3つの神秘的なブルークリスタル真珠 ★ */}
      {!silhouette && (
        <g stroke="#ffffff" strokeWidth="2">
          <circle cx="118" cy="142" r="7" fill="#67e8f9" />
          <circle cx="130" cy="146" r="9" fill="#06b6d4" />
          <circle cx="142" cy="142" r="7" fill="#67e8f9" />
        </g>
      )}

      {/* 水竜の頭部 */}
      <ellipse cx="130" cy="74" rx="30" ry="26" fill="#0284c7" />

      {/* ★ 額の神秘的なクリスタル角 ★ */}
      <polygon points="126,52 130,16 134,52" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2.5" />
      <circle cx="130" cy="18" r="4.5" fill="#ffffff" stroke="none" />

      {/* ★ 両耳の水滴ヒレ (WEB-FIN EARS) ★ */}
      <path d="M102 70 Q75 54, 80 82 Q94 80, 102 76 Z" fill="#38bdf8" />
      <path d="M158 70 Q185 54, 180 82 Q166 80, 158 76 Z" fill="#38bdf8" />

      {/* 澄んだ美しい海の瞳 */}
      {!silhouette && (
        <g>
          <ellipse cx="116" cy="74" rx="7" ry="10" fill="#082f49" stroke="#0f172a" strokeWidth="1.5" />
          <ellipse cx="116" cy="74" rx="4" ry="6" fill="#38bdf8" stroke="none" />
          <circle cx="115" cy="70" r="2.5" fill="#ffffff" stroke="none" />

          <ellipse cx="144" cy="74" rx="7" ry="10" fill="#082f49" stroke="#0f172a" strokeWidth="1.5" />
          <ellipse cx="144" cy="74" rx="4" ry="6" fill="#38bdf8" stroke="none" />
          <circle cx="143" cy="70" r="2.5" fill="#ffffff" stroke="none" />

          <path d="M125 86 Q130 90, 135 86" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/** No.33 ボルトチュウ (イナズマ尻尾、赤いほっぺ電気袋、黒先三角耳、黄色い丸ボディ・ピカチュウ風) */
function BoltChuSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 大人気のギザギザ・イナズマ尻尾 (ZIGZAG LIGHTNING TAIL) ★ */}
      <polygon
        points="165,160 196,145 186,130 222,110 206,95 246,65 220,85 236,100 200,120 210,135 174,155"
        fill="#facc15"
      />
      {/* 尻尾の根元の茶色バンド */}
      <rect x="160" y="152" width="16" height="16" rx="3" fill="#78350f" stroke="none" />

      {/* まあるく太った黄色い胴体 */}
      <ellipse cx="130" cy="168" rx="52" ry="44" fill="#facc15" />

      {/* 背中の2本の茶色いシマ模様 */}
      {!silhouette && (
        <g stroke="#78350f" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M96 150 Q130 160, 164 150" />
          <path d="M98 168 Q130 178, 162 168" />
        </g>
      )}

      {/* ちょこんとそろえた前足 */}
      <circle cx="112" cy="164" r="10" fill="#facc15" />
      <circle cx="148" cy="164" r="10" fill="#facc15" />

      {/* まるまる下半身・後ろ足 */}
      <ellipse cx="92" cy="204" rx="18" ry="10" fill="#facc15" />
      <ellipse cx="168" cy="204" rx="18" ry="10" fill="#facc15" />

      {/* まあるく可愛い頭部 */}
      <ellipse cx="130" cy="98" rx="44" ry="40" fill="#facc15" />

      {/* ★ 長い立ち耳＆黒い耳先 ★ */}
      <polygon points="102,74 62,16 92,60" fill="#facc15" />
      <polygon points="76,36 62,16 70,28" fill="#0f172a" />
      <polygon points="158,74 198,16 168,60" fill="#facc15" />
      <polygon points="184,36 198,16 190,28" fill="#0f172a" />

      {/* ★ 赤い丸いほっぺの電気袋 ＆ バチバチ電撃スパーク ★ */}
      <circle cx="94" cy="112" r="13" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
      <circle cx="166" cy="112" r="13" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
      {!silhouette && (
        <g fill="#fde047" stroke="none">
          <polygon points="76,110 84,105 82,112 88,112 80,122 82,115" />
          <polygon points="184,110 176,105 178,112 172,112 180,122 178,115" />
        </g>
      )}

      {/* くりくり黒目＆にっこり笑顔 */}
      {!silhouette && (
        <g>
          <circle cx="112" cy="95" r="9" fill="#0f172a" stroke="none" />
          <circle cx="114" cy="93" r="3.5" fill="#ffffff" stroke="none" />

          <circle cx="148" cy="95" r="9" fill="#0f172a" stroke="none" />
          <circle cx="146" cy="93" r="3.5" fill="#ffffff" stroke="none" />

          {/* ちょこんとした鼻とピンクの舌 */}
          <circle cx="130" cy="104" r="2" fill="#0f172a" stroke="none" />
          <path d="M124 110 Q130 124, 136 110 Z" fill="#f43f5e" stroke="#0f172a" strokeWidth="2" />
        </g>
      )}
    </g>
  );
}

/** No.34 プラズマギア (単眼レンズ、赤青の蹄鉄磁石、上部スクリュー放電アンテナ・コイル/ロトム風) */
function PlasmaGearSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 左右の赤青マグネット（蹄鉄型磁石） ★ */}
      {/* 左磁石：上が赤、下が青 */}
      <g>
        <path d="M52 105 Q30 105, 30 130 Q30 155, 52 155" fill="none" stroke="#64748b" strokeWidth="16" strokeLinecap="round" />
        <rect x="42" y="97" width="18" height="16" rx="3" fill="#ef4444" />
        <rect x="42" y="147" width="18" height="16" rx="3" fill="#3b82f6" />
      </g>
      {/* 右磁石：上が青、下が赤 */}
      <g>
        <path d="M208 105 Q230 105, 230 130 Q230 155, 208 155" fill="none" stroke="#64748b" strokeWidth="16" strokeLinecap="round" />
        <rect x="200" y="97" width="18" height="16" rx="3" fill="#3b82f6" />
        <rect x="200" y="147" width="18" height="16" rx="3" fill="#ef4444" />
      </g>

      {/* 磁石と本体をつなぐバチバチ電撃アーク */}
      {!silhouette && (
        <g stroke="#fde047" strokeWidth="3.5" fill="none" strokeLinecap="round">
          <path d="M62 125 L78 120 L74 135 L88 130" />
          <path d="M198 125 L182 120 L186 135 L172 130" />
        </g>
      )}

      {/* 頭上の巨大ネジ／放電アンテナ */}
      <rect x="122" y="65" width="16" height="22" rx="4" fill="#94a3b8" />
      <circle cx="130" cy="56" r="12" fill="#facc15" stroke="#ffffff" strokeWidth="2.5" />

      {/* スチール製まんまる球体ボディ */}
      <circle cx="130" cy="130" r="46" fill="#64748b" />
      <ellipse cx="118" cy="112" rx="20" ry="12" fill="#94a3b8" opacity="0.6" stroke="none" />

      {/* ★ 中央の巨大単眼レンズ (BIG CYCLOPS OPTIC EYE) ★ */}
      <circle cx="130" cy="130" r="26" fill="#ffffff" stroke="#0f172a" strokeWidth="3.5" />
      <circle cx="130" cy="130" r="16" fill="#06b6d4" stroke="none" />
      <circle cx="130" cy="130" r="9" fill="#0f172a" stroke="none" />
      {!silhouette && (
        <circle cx="134" cy="126" r="3.5" fill="#ffffff" stroke="none" />
      )}

      {/* 下部の2本の小さなネジピン */}
      <rect x="105" y="170" width="10" height="14" rx="2" fill="#94a3b8" />
      <rect x="145" y="170" width="10" height="14" rx="2" fill="#94a3b8" />
    </g>
  );
}

/** No.35 ハナブラキオ (背中に大輪のピンクの花、つるのムチ、首の葉っぱ首輪・フシギバナ/メガニウム風) */
function HanaBrachioSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 背中に咲く大輪のトロピカルフラワー（大葉4枚＋ピンクの花びら5枚＋黄色い雄しべ） ★ */}
      {/* 放射状に広がる深緑の大葉 */}
      <path d="M130 145 C78 122, 58 152, 78 175 Z" fill="#15803d" />
      <path d="M130 145 C182 122, 202 152, 182 175 Z" fill="#15803d" />
      <path d="M130 145 C108 95, 152 95, 130 145 Z" fill="#16a34a" />

      {/* ピンクの花びら5枚 */}
      <circle cx="106" cy="134" r="17" fill="#f43f5e" />
      <circle cx="154" cy="134" r="17" fill="#f43f5e" />
      <circle cx="116" cy="156" r="17" fill="#f43f5e" />
      <circle cx="144" cy="156" r="17" fill="#f43f5e" />
      <circle cx="130" cy="120" r="17" fill="#f43f5e" />
      {/* 花の中心の黄色いドーム */}
      <circle cx="130" cy="140" r="15" fill="#fde047" stroke="#ffffff" strokeWidth="2.5" />

      {/* 花から伸びる元気な緑の「つるのムチ (VINE WHIP)」 */}
      {!silhouette && (
        <g stroke="#22c55e" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M82 145 C48 132, 42 102, 58 92" />
          <path d="M178 145 C212 132, 218 102, 202 92" />
        </g>
      )}

      {/* ミントグリーンの首長竜ボディ */}
      <ellipse cx="130" cy="180" rx="52" ry="34" fill="#4ade80" />

      {/* どっしりした柱のような足＆白いツメ */}
      <rect x="85" y="194" width="24" height="26" rx="8" fill="#4ade80" />
      <rect x="151" y="194" width="24" height="26" rx="8" fill="#4ade80" />
      <polygon points="82,220 86,214 90,220" fill="#ffffff" />
      <polygon points="90,220 94,214 98,220" fill="#ffffff" />
      <polygon points="148,220 152,214 156,220" fill="#ffffff" />
      <polygon points="156,220 160,214 164,220" fill="#ffffff" />

      {/* 首の根本の若葉ネックレス（首輪） */}
      <circle cx="112" cy="150" r="7" fill="#bbf7d0" />
      <circle cx="122" cy="154" r="8" fill="#86efac" />
      <circle cx="132" cy="150" r="7" fill="#bbf7d0" />

      {/* ゆるやかに伸びる長い首 */}
      <path d="M106 170 Q100 115, 114 85 L136 88 Q126 125, 130 170 Z" fill="#4ade80" />

      {/* やさしい顔立ちの恐竜ヘッド */}
      <ellipse cx="132" cy="85" rx="26" ry="22" fill="#4ade80" />
      {/* 頭の上のちっちゃな芽吹きツノ */}
      <path d="M128 65 Q125 50, 130 44 Q135 50, 132 65 Z" fill="#22c55e" />

      {/* やさしい大きな緑色の瞳＆にっこり笑顔 */}
      {!silhouette && (
        <g>
          <ellipse cx="122" cy="82" rx="6" ry="9" fill="#14532d" stroke="#0f172a" strokeWidth="1.5" />
          <ellipse cx="122" cy="82" rx="3" ry="5" fill="#86efac" stroke="none" />
          <circle cx="121" cy="79" r="2" fill="#ffffff" stroke="none" />

          <ellipse cx="144" cy="82" rx="6" ry="9" fill="#14532d" stroke="#0f172a" strokeWidth="1.5" />
          <ellipse cx="144" cy="82" rx="3" ry="5" fill="#86efac" stroke="none" />
          <circle cx="143" cy="79" r="2" fill="#ffffff" stroke="none" />

          <path d="M130 94 Q136 99, 142 94" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/** No.36 フォレストゴーレム (古代遺跡の緑苔ロボ、エメラルドシード胸コア、リーフブレード腕・ゴルーグ風) */
function ForestGolemSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 古代の角ばった石ブロック胴体 */}
      <rect x="85" y="115" width="90" height="70" rx="12" fill="#15803d" />
      {/* 苔むしたパッチ */}
      {!silhouette && (
        <g fill="#86efac" stroke="none" opacity="0.6">
          <rect x="92" y="122" width="18" height="12" rx="3" />
          <rect x="148" y="155" width="20" height="14" rx="4" />
        </g>
      )}

      {/* ★ 胸の古代エメラルドシード・コア（緑に輝く生命結晶） ★ */}
      <circle cx="130" cy="150" r="18" fill="#10b981" stroke="#ffffff" strokeWidth="3.5" />
      <polygon points="130,136 142,150 130,164 118,150" fill="#a7f3d0" stroke="none" />

      {/* がっしりした肩装甲ブロック＆双葉の芽 */}
      <rect x="52" y="105" width="34" height="34" rx="8" fill="#166534" />
      <path d="M64 105 C55 90, 75 90, 68 105 Z" fill="#4ade80" />
      <rect x="174" y="105" width="34" height="34" rx="8" fill="#166534" />
      <path d="M196 105 C205 90, 185 90, 192 105 Z" fill="#4ade80" />

      {/* 両腕の強力なリーフブレード（緑のエネルギー刃） */}
      <polygon points="56,145 32,175 42,205 66,165" fill="#34d399" />
      <polygon points="204,145 228,175 218,205 194,165" fill="#34d399" />

      {/* どっしりとした古代石柱の脚 */}
      <rect x="90" y="185" width="32" height="38" rx="6" fill="#14532d" />
      <rect x="138" y="185" width="32" height="38" rx="6" fill="#14532d" />

      {/* ゴーレム頭部 */}
      <rect x="96" y="65" width="68" height="42" rx="10" fill="#166534" />
      <polygon points="130,42 120,65 140,65" fill="#34d399" />

      {/* ★ 光るエメラルド・バイザーアイ（一筋のルーン光） ★ */}
      <rect x="104" y="80" width="52" height="12" rx="4" fill="#064e3b" stroke="#0f172a" strokeWidth="2" />
      <rect x="108" y="83" width="44" height="6" rx="2" fill="#34d399" stroke="none" />
      {!silhouette && (
        <circle cx="130" cy="86" r="3.5" fill="#ffffff" stroke="none" />
      )}
    </g>
  );
}

/* ==========================================================================
   ⭐ じょうくん大興奮！大人気ポケモン・スーパースター 8体 (No.37〜44)
   ========================================================================== */

/** No.37 リザードン (灼熱のメガ進化かえん竜・ヒトカゲ ➔ リザードン ➔ メガリザードン) */
function CharizardSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const bodyColor = silhouette ? primary : '#ea580c';
  const darkHornColor = silhouette ? secondary : '#c2410c';
  const wingInner = silhouette ? secondary : '#06b6d4';
  const wingEdge = silhouette ? secondary : '#ea580c';
  const bellyColor = silhouette ? secondary : '#fef08a';

  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* 太くたくましい炎のしっぽ */}
      <path d="M78 180 Q24 185, 20 130 Q44 142, 82 156 Z" fill={bodyColor} />
      {/* 尾先の青＆橙のメガ進化炎 */}
      {!silhouette ? (
        <g stroke="none">
          <path d="M22 132 C2 108, 0 68, 22 45 C38 75, 50 95, 22 132 Z" fill="#ef4444" />
          <path d="M22 120 C10 100, 8 75, 22 60 C32 80, 42 98, 22 120 Z" fill="#38bdf8" />
          <path d="M22 108 C14 92, 14 78, 22 68 C28 82, 34 94, 22 108 Z" fill="#ffffff" />
        </g>
      ) : (
        <path d="M22 132 C2 108, 0 68, 22 45 C38 75, 50 95, 22 132 Z" fill={secondary} />
      )}

      {/* ★ 大空を駆けるメガリザードン風の巨大なドラゴン翼 ★ */}
      <polygon points="90,135 42,65 72,85 52,50 98,95" fill={wingInner} />
      <polygon points="155,122 212,55 182,80 206,45 152,94" fill={wingInner} />
      <path d="M42 65 L72 85 L52 50 L98 95" fill="none" stroke={wingEdge} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M212 55 L182 80 L206 45 L152 94" fill="none" stroke={wingEdge} strokeWidth="4.5" strokeLinecap="round" />

      {/* たくましい二足歩行胴体 */}
      <ellipse cx="126" cy="164" rx="52" ry="46" fill={bodyColor} />
      {/* 黄色いお腹 */}
      <ellipse cx="132" cy="166" rx="30" ry="32" fill={bellyColor} stroke="none" />
      {!silhouette && (
        <g stroke="#f59e0b" strokeWidth="2" fill="none" opacity="0.6">
          <path d="M114 156 Q132 164, 150 156" />
          <path d="M116 170 Q132 178, 148 170" />
        </g>
      )}

      {/* 強靭な脚＆鋭い3本の白いツメ */}
      <rect x="78" y="194" width="28" height="32" rx="8" fill={bodyColor} />
      <rect x="138" y="194" width="28" height="32" rx="8" fill={bodyColor} />
      <polygon points="74,226 82,216 88,226" fill={silhouette ? secondary : '#ffffff'} />
      <polygon points="86,226 94,216 100,226" fill={silhouette ? secondary : '#ffffff'} />
      <polygon points="134,226 142,216 148,226" fill={silhouette ? secondary : '#ffffff'} />
      <polygon points="146,226 154,216 160,226" fill={silhouette ? secondary : '#ffffff'} />

      {/* 力強い両腕 */}
      <path d="M98 145 L76 158 L84 170 L104 158 Z" fill={bodyColor} />
      <path d="M150 145 L174 158 L168 170 L144 158 Z" fill={bodyColor} />

      {/* ★ リザードン特有の後ろへ湾曲して伸びる2本の長いツノ ★ */}
      <path d="M102 75 Q72 35, 54 24 Q78 50, 106 70 Z" fill={darkHornColor} />
      <path d="M142 72 Q174 32, 194 20 Q168 50, 146 68 Z" fill={darkHornColor} />
      <ellipse cx="125" cy="94" rx="38" ry="34" fill={bodyColor} />
      <ellipse cx="132" cy="105" rx="28" ry="18" fill={bodyColor} />

      {/* 誇り高きドラゴンの瞳＆キバ */}
      {!silhouette && (
        <g>
          {/* 青く鋭い眼光 */}
          <polygon points="106,82 120,86 110,95" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />
          <circle cx="112" cy="86" r="2.5" fill="#ffffff" stroke="none" />
          <polygon points="144,82 130,86 140,95" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />
          <circle cx="138" cy="86" r="2.5" fill="#ffffff" stroke="none" />

          {/* 牙の並ぶ口元 */}
          <path d="M118 108 Q132 118, 146 108" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="122,108 126,116 130,108" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
          <polygon points="134,108 138,116 142,108" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
        </g>
      )}
    </g>
  );
}

/** No.38 ヒバニー (元気いっぱい炎ウサギ・ヒバニー ➔ ラビフット ➔ エースバーン) */
function ScorbunnySvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const furColor = silhouette ? primary : '#ffffff';
  const orangeAccent = silhouette ? secondary : '#f97316';
  const yellowAccent = silhouette ? secondary : '#fde047';

  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ちょこんと丸い白ウサギのしっぽ */}
      <circle cx="82" cy="178" r="14" fill={furColor} />

      {/* スラッと元気な白ウサギの体 */}
      <ellipse cx="130" cy="170" rx="42" ry="38" fill={furColor} />

      {/* 首元のオレンジの襟カラー */}
      <path d="M110 132 L130 148 L150 132 L142 124 L130 132 L118 124 Z" fill={orangeAccent} />

      {/* ★ キック力抜群の後ろ足＆オレンジの炎パッドソール ★ */}
      <rect x="96" y="184" width="22" height="32" rx="9" fill={furColor} />
      <rect x="142" y="184" width="22" height="32" rx="9" fill={furColor} />
      <ellipse cx="107" cy="214" rx="14" ry="7" fill={orangeAccent} />
      <ellipse cx="153" cy="214" rx="14" ry="7" fill={orangeAccent} />
      {!silhouette && (
        <g fill={yellowAccent} stroke="none">
          <circle cx="107" cy="214" r="3.5" />
          <circle cx="153" cy="214" r="3.5" />
        </g>
      )}

      {/* まあるい元気なウサギ頭部 */}
      <circle cx="130" cy="98" r="38" fill={furColor} />

      {/* ★ 長い白ウサギ耳＆オレンジの耳先＆黄色い毛束 ★ */}
      <polygon points="98,82 72,12 114,64" fill={furColor} />
      <polygon points="85,38 72,12 96,28" fill={orangeAccent} />
      <polygon points="90,52 82,28 102,44" fill={yellowAccent} />

      <polygon points="162,82 188,12 146,64" fill={furColor} />
      <polygon points="175,38 188,12 164,28" fill={orangeAccent} />
      <polygon points="170,52 178,28 158,44" fill={yellowAccent} />

      {/* ★ 鼻の上のトレードマーク「黄色いバンドエイドパッチ」 ★ */}
      <rect
        x="116"
        y="98"
        width="28"
        height="12"
        rx="4"
        transform="rotate(-5 130 104)"
        fill={yellowAccent}
        stroke={outline}
        strokeWidth="2.5"
      />

      {/* くりくり大きな瞳＆元気いっぱいの前歯スマイル */}
      {!silhouette && (
        <g>
          {/* 赤みがかった大きな瞳 */}
          <ellipse cx="112" cy="92" rx="9" ry="12" fill="#78350f" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="112" cy="92" rx="5" ry="8" fill="#ea580c" stroke="none" />
          <circle cx="110" cy="88" r="3.5" fill="#ffffff" stroke="none" />

          <ellipse cx="148" cy="92" rx="9" ry="12" fill="#78350f" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="148" cy="92" rx="5" ry="8" fill="#ea580c" stroke="none" />
          <circle cx="146" cy="88" r="3.5" fill="#ffffff" stroke="none" />

          {/* 前歯がチャームポイントの口 */}
          <path d="M122 114 Q130 124, 138 114 Z" fill="#f43f5e" stroke="#0f172a" strokeWidth="2" />
          <rect x="127" y="114" width="6" height="5" rx="1" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
        </g>
      )}
    </g>
  );
}

/** No.39 ゲッコウガ (神出鬼没の水流ニンジャ・ケロマツ ➔ ゲコガシラ ➔ サトシゲッコウガ) */
function GreninjaSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const blueNinja = silhouette ? primary : '#1d4ed8';
  const yellowChest = silhouette ? secondary : '#fef08a';
  const pinkScarf = silhouette ? secondary : '#f43f5e';
  const shurikenColor = silhouette ? secondary : '#38bdf8';

  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 背中に背負う巨大な「水手裏剣 (GIANT WATER SHURIKEN)」 ★ */}
      <polygon
        points="130,42 146,88 192,104 146,120 130,166 114,120 68,104 114,88"
        fill={shurikenColor}
      />
      {!silhouette && (
        <circle cx="130" cy="104" r="10" fill="#ffffff" stroke={shurikenColor} strokeWidth="3" />
      )}

      {/* スラリとしなやかなニンジャ脚部 */}
      <ellipse cx="98" cy="190" rx="18" ry="24" fill={blueNinja} />
      <ellipse cx="162" cy="190" rx="18" ry="24" fill={blueNinja} />
      {/* 白い関節水玉ウェビング */}
      <circle cx="86" cy="182" r="7" fill={silhouette ? secondary : '#ffffff'} />
      <circle cx="174" cy="182" r="7" fill={silhouette ? secondary : '#ffffff'} />

      {/* 逆三角形の青い胴体＆黄色い胸当て */}
      <polygon points="108,135 152,135 142,176 118,176" fill={blueNinja} />
      <polygon points="116,135 144,135 138,162 122,162" fill={yellowChest} stroke="none" />

      {/* ★ 首に巻き付けたピンクの舌マフラー (TONGUE SCARF) ★ */}
      <ellipse cx="130" cy="128" rx="36" ry="16" fill={pinkScarf} />
      <path d="M156 130 Q188 145, 195 180 Q178 175, 150 142 Z" fill={pinkScarf} />

      {/* ★ ニンジャ頭部＆左右に張り出す大きな頭ビレ ★ */}
      <polygon points="102,112 58,82 110,88" fill={blueNinja} />
      <polygon points="158,112 202,82 150,88" fill={blueNinja} />
      <polygon points="110,88 130,62 150,88 142,118 118,118" fill={blueNinja} />

      {/* 鋭いニンジャEYE */}
      {!silhouette && (
        <g>
          <polygon points="110,92 124,94 114,102" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
          <polygon points="150,92 136,94 146,102" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
          <circle cx="116" cy="95" r="2" fill="#ffffff" stroke="none" />
          <circle cx="144" cy="95" r="2" fill="#ffffff" stroke="none" />
        </g>
      )}
    </g>
  );
}

/** No.40 ポッチャマ (プライド高き水のペンギン・ポッチャマ ➔ ポッタイシ ➔ エンペルト) */
function PiplupSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const lightBlue = silhouette ? primary : '#38bdf8';
  const navyBlue = silhouette ? secondary : '#0369a1';
  const yellowBeak = silhouette ? secondary : '#facc15';

  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* まあるい水色のペンギン胴体 */}
      <ellipse cx="130" cy="168" rx="48" ry="42" fill={lightBlue} />

      {/* 背中の濃い青いマント／羽 */}
      <path d="M85 140 Q62 165, 75 195 Q88 175, 95 150 Z" fill={navyBlue} />
      <path d="M175 140 Q198 165, 185 195 Q172 175, 165 150 Z" fill={navyBlue} />

      {/* 黄色いペンギンの足 */}
      <ellipse cx="110" cy="208" rx="14" ry="8" fill={yellowBeak} />
      <ellipse cx="150" cy="208" rx="14" ry="8" fill={yellowBeak} />

      {/* ★ 胸の2つの白いボタンスポット (TWO WHITE CHEST BUTTONS) ★ */}
      {!silhouette ? (
        <g fill="#ffffff" stroke={navyBlue} strokeWidth="2.5">
          <circle cx="118" cy="165" r="7" />
          <circle cx="142" cy="165" r="7" />
        </g>
      ) : (
        <g fill={secondary}>
          <circle cx="118" cy="165" r="7" />
          <circle cx="142" cy="165" r="7" />
        </g>
      )}

      {/* まあるく大きな頭部 */}
      <circle cx="130" cy="98" r="40" fill={lightBlue} />

      {/* 頭の上の濃い青いクラウンキャップ模様 */}
      <path d="M92 92 C92 62, 168 62, 168 92 C152 82, 130 92, 130 92 C130 92, 108 82, 92 92 Z" fill={navyBlue} />

      {/* ★ 黄色い小さなくちばし (YELLOW BEAK) ★ */}
      <polygon points="122,102 138,102 130,118" fill={yellowBeak} />

      {/* つぶらで誇り高き大きな瞳 */}
      {!silhouette && (
        <g>
          <ellipse cx="110" cy="92" rx="8" ry="12" fill="#082f49" stroke="#0f172a" strokeWidth="2" />
          <circle cx="108" cy="88" r="3.5" fill="#ffffff" stroke="none" />

          <ellipse cx="150" cy="92" rx="8" ry="12" fill="#082f49" stroke="#0f172a" strokeWidth="2" />
          <circle cx="148" cy="88" r="3.5" fill="#ffffff" stroke="none" />

          {/* 自信満々なピンクのほっぺ */}
          <ellipse cx="96" cy="104" rx="6" ry="4" fill="#fb7185" stroke="none" opacity="0.75" />
          <ellipse cx="164" cy="104" rx="6" ry="4" fill="#fb7185" stroke="none" opacity="0.75" />
        </g>
      )}
    </g>
  );
}

/** No.41 ルカリオ (あおき波導のオーラ戦士・リオル ➔ ルカリオ ➔ メガルカリオ) */
function LucarioSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const blueColor = silhouette ? primary : '#0284c7';
  const blackColor = silhouette ? secondary : '#0f172a';
  const creamColor = silhouette ? secondary : '#fef08a';
  const spikeColor = silhouette ? secondary : '#e2e8f0';

  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* しなやかな青いしっぽ */}
      <path d="M80 185 Q40 195, 32 155 Q55 162, 85 174 Z" fill={blueColor} />

      {/* ★ 4本の後ろ頭部のオーラセンサーリボン (AURA APPENDAGES) ★ */}
      <path d="M96 85 C65 95, 52 135, 62 165 C68 140, 80 110, 102 95 Z" fill={blackColor} />
      <path d="M92 90 C55 110, 48 150, 52 180 C60 152, 75 125, 96 100 Z" fill={blackColor} />
      <path d="M164 85 C195 95, 208 135, 198 165 C192 140, 180 110, 158 95 Z" fill={blackColor} />
      <path d="M168 90 C205 110, 212 150, 208 180 C200 152, 185 125, 164 100 Z" fill={blackColor} />

      {/* 青いもも＆黒い脚部 */}
      <ellipse cx="100" cy="188" rx="20" ry="16" fill={blueColor} />
      <ellipse cx="160" cy="188" rx="20" ry="16" fill={blueColor} />
      <rect x="94" y="194" width="16" height="28" rx="6" fill={blackColor} />
      <rect x="150" y="194" width="16" height="28" rx="6" fill={blackColor} />

      {/* 黒い腰バンド */}
      <ellipse cx="130" cy="172" rx="42" ry="14" fill={blackColor} />

      {/* ★ クリーム色のモフモフ胸部 ＆ 胸元の輝くシルバースパイク ★ */}
      <ellipse cx="130" cy="148" rx="34" ry="24" fill={creamColor} />
      <polygon points="130,132 124,148 136,148" fill={spikeColor} />

      {/* 前脚の黒い腕＆手の甲の白いスパイク */}
      <path d="M96 142 L72 165 L84 172 L105 152 Z" fill={blackColor} />
      <polygon points="70,162 62,158 68,170" fill={spikeColor} />
      <path d="M164 142 L188 165 L176 172 L155 152 Z" fill={blackColor} />
      <polygon points="190,162 198,158 192,170" fill={spikeColor} />

      {/* ★ 両手の間に浮かぶ青く輝く「波導弾 (AURA SPHERE)」 ★ */}
      {!silhouette && (
        <g>
          <circle cx="130" cy="175" r="18" fill="#38bdf8" opacity="0.4" stroke="none" />
          <circle cx="130" cy="175" r="12" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="130" cy="175" r="6" fill="#ffffff" stroke="none" />
          {/* バチバチオーラスパーク */}
          <path d="M120 168 L126 175 L122 182" fill="none" stroke="#fde047" strokeWidth="2" />
          <path d="M140 168 L134 175 L138 182" fill="none" stroke="#fde047" strokeWidth="2" />
        </g>
      )}

      {/* ★ ルカリオの精悍なジャッカル頭部＆黒マスク ★ */}
      <polygon points="104,75 80,18 118,55" fill={blueColor} />
      <polygon points="156,75 180,18 142,55" fill={blueColor} />
      <circle cx="130" cy="85" r="32" fill={blueColor} />
      {/* 目のまわりの黒いアイマスク模様 */}
      <polygon points="102,75 158,75 168,95 130,105 92,95" fill={blackColor} />

      {/* 誇り高きルビーレッドの瞳 */}
      {!silhouette && (
        <g>
          <polygon points="108,82 122,86 112,94" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="114" cy="86" r="2" fill="#ffffff" stroke="none" />
          <polygon points="152,82 138,86 148,94" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="146" cy="86" r="2" fill="#ffffff" stroke="none" />
        </g>
      )}
    </g>
  );
}

/** No.42 ミライドン (未来から来た伝説の雷竜・ちびミライドン ➔ ミライドン ➔ アルティメットミライドン) */
function MiraidonSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const violetBody = silhouette ? primary : '#4f46e5';
  const darkIndigo = silhouette ? secondary : '#312e81';
  const electricCyan = silhouette ? secondary : '#38bdf8';
  const lightningYellow = silhouette ? secondary : '#fde047';
  const silverArmor = silhouette ? secondary : '#e2e8f0';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* ★ 背後のジェットスラスター尾＆青白く光るプラズマ噴射 ★ */}
      <path
        d="M135 178 Q185 195, 215 160 Q225 145, 218 135 Q195 155, 145 168 Z"
        fill={violetBody}
      />
      {/* 尾先のサイバージェットノズル */}
      <rect x="210" y="132" width="16" height="24" rx="4" transform="rotate(-30 218 144)" fill={darkIndigo} />
      {!silhouette ? (
        <g stroke="none">
          {/* 青と黄色のプラズマジェット炎 */}
          <polygon points="228,138 255,120 236,152 248,158" fill={electricCyan} opacity="0.85" />
          <polygon points="226,142 245,130 232,150" fill={lightningYellow} />
          {/* 稲妻スパーク */}
          <polygon points="215,115 224,122 220,128 230,126 222,136" fill={lightningYellow} />
        </g>
      ) : (
        <polygon points="228,138 250,124 236,152" fill={secondary} />
      )}

      {/* 背中のエアロダイナミック・サイバーウィング（青く光るエネルギー翼） */}
      <polygon points="108,125 55,75 88,95 62,55 115,100" fill={violetBody} />
      <polygon points="152,118 205,68 172,90 198,48 145,95" fill={violetBody} />
      {!silhouette && (
        <g stroke={electricCyan} strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M58 76 L86 95 L64 57" />
          <path d="M202 70 L174 90 L195 50" />
        </g>
      )}

      {/* スラリと伸びる未来サイバードラゴンの胴体 */}
      <ellipse cx="130" cy="165" rx="46" ry="40" fill={violetBody} />
      {/* メタリックシルバーの腹部装甲 */}
      <path
        d="M115 140 Q130 148, 145 140 L140 188 Q130 194, 120 188 Z"
        fill={darkIndigo}
      />

      {/* ★ 胸の象徴「ハドロンエンジン・ジェットタービン (HADRON ENGINE TURBINE)」 ★ */}
      <circle cx="130" cy="154" r="22" fill={darkIndigo} stroke={silhouette ? secondary : electricCyan} strokeWidth="3.5" />
      <circle cx="130" cy="154" r="16" fill="#1e1b4b" stroke="none" />
      {/* タービンの回転ブレード */}
      {!silhouette ? (
        <g fill={electricCyan}>
          <polygon points="130,140 134,152 130,154 126,152" />
          <polygon points="144,154 132,158 130,154 132,150" />
          <polygon points="130,168 126,156 130,154 134,156" />
          <polygon points="116,154 128,150 130,154 128,158" />
          {/* コアの超高輝度プラズマ発電球 */}
          <circle cx="130" cy="154" r="8" fill={lightningYellow} stroke="#ffffff" strokeWidth="2" />
          <circle cx="130" cy="154" r="4" fill="#ffffff" stroke="none" />
        </g>
      ) : (
        <circle cx="130" cy="154" r="9" fill={secondary} />
      )}

      {/* 強靭でしなやかなサイバードラゴン脚部＆シルバーの鉤爪 */}
      <rect x="85" y="185" width="22" height="34" rx="8" fill={violetBody} />
      <rect x="153" y="185" width="22" height="34" rx="8" fill={violetBody} />
      <polygon points="82,222 88,212 94,222" fill={silverArmor} />
      <polygon points="94,222 100,212 106,222" fill={silverArmor} />
      <polygon points="150,222 156,212 162,222" fill={silverArmor} />
      <polygon points="162,222 168,212 174,222" fill={silverArmor} />

      {/* 首のネオンブルー発光ライン */}
      <path d="M118 135 Q115 100, 122 75 L138 75 Q145 100, 142 135 Z" fill={violetBody} />
      {!silhouette && (
        <g stroke={electricCyan} strokeWidth="2.5" fill="none" opacity="0.9">
          <line x1="122" y1="92" x2="138" y2="92" />
          <line x1="120" y1="108" x2="140" y2="108" />
          <line x1="118" y1="124" x2="142" y2="124" />
        </g>
      )}

      {/* ★ 精悍なサイバードラゴンヘッド (CYBER DRAGON HEAD) ★ */}
      <polygon points="112,85 148,85 140,60 120,60" fill={violetBody} />
      <ellipse cx="130" cy="78" rx="26" ry="20" fill={violetBody} />
      {/* 前方に突き出す鋭いサイバーノズル口元 */}
      <polygon points="120,78 140,78 134,92 126,92" fill={darkIndigo} />

      {/* ★ ミライドン最大のトレードマーク「後方へ伸びる巨大な稲妻型アンテナ角」 ★ */}
      {/* 左角：ジグザグのイナズマホーン */}
      <polygon points="118,65 72,28 88,48 58,16 102,48" fill={electricCyan} />
      <polygon points="112,62 82,36 94,48 76,26 102,48" fill={lightningYellow} />
      {/* 右角：ジグザグのイナズマホーン */}
      <polygon points="142,65 188,28 172,48 202,16 158,48" fill={electricCyan} />
      <polygon points="148,62 178,36 166,48 184,26 158,48" fill={lightningYellow} />

      {/* ★ デジタルネオンバイザーの瞳 (CYBER DIGITAL VISOR EYES) ★ */}
      {!silhouette ? (
        <g>
          {/* 青く光るデジタルアイ */}
          <polygon points="112,74 124,76 116,84" fill={electricCyan} stroke="#0f172a" strokeWidth="1.5" />
          <rect x="114" y="76" width="6" height="4" fill="#ffffff" rx="1" stroke="none" />
          <polygon points="148,74 136,76 144,84" fill={electricCyan} stroke="#0f172a" strokeWidth="1.5" />
          <rect x="140" y="76" width="6" height="4" fill="#ffffff" rx="1" stroke="none" />
          {/* 額のネオンシンボル */}
          <circle cx="130" cy="68" r="3.5" fill={lightningYellow} stroke="#ffffff" strokeWidth="1.5" />
        </g>
      ) : (
        <g fill={secondary}>
          <polygon points="112,74 124,76 116,84" />
          <polygon points="148,74 136,76 144,84" />
        </g>
      )}

      {/* 前脚のサイバークロー */}
      <path d="M102 142 L84 158 L92 166 L108 152 Z" fill={violetBody} />
      <polygon points="80,160 74,156 78,168" fill={silverArmor} />
      <path d="M158 142 L176 158 L168 166 L152 152 Z" fill={violetBody} />
      <polygon points="180,160 186,156 182,168" fill={silverArmor} />
    </g>
  );
}

/** No.43 イーブイ (可能性無限のもふもふ進化獣・イーブイ ➔ ニンフィア ➔ レインボーイーブイキング) */
function EeveeSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const coatColor = silhouette ? primary : '#92400e';
  const ruffColor = silhouette ? secondary : '#fef3c7';
  const darkBrown = silhouette ? secondary : '#78350f';

  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 大きくふさふさした茶色＆クリーム先のしっぽ ★ */}
      <path
        d="M85 165 C35 175, 15 125, 30 85 C45 55, 85 75, 65 110 C85 98, 105 112, 95 142 Z"
        fill={coatColor}
      />
      <path
        d="M45 78 C65 65, 82 85, 65 110 C78 100, 92 110, 85 130 C65 135, 45 105, 45 78 Z"
        fill={ruffColor}
        stroke="none"
      />

      {/* お行儀よく座るかわいい身体 */}
      <ellipse cx="130" cy="172" rx="42" ry="36" fill={coatColor} />

      {/* ★ イーブイ名物「首回りのモフモフ大きなクリーム襟巻き」 (GIANT CREAM RUFF) ★ */}
      <path
        d="M94 135 C80 165, 110 178, 130 178 C150 178, 180 165, 166 135 C178 145, 158 155, 150 148 C144 158, 130 156, 130 156 C130 156, 116 158, 110 148 C102 155, 82 145, 94 135 Z"
        fill={ruffColor}
      />

      {/* まあるい前足 */}
      <rect x="108" y="186" width="16" height="24" rx="8" fill={coatColor} />
      <rect x="136" y="186" width="16" height="24" rx="8" fill={coatColor} />

      {/* 愛くるしいまんまる頭部 */}
      <circle cx="130" cy="98" r="38" fill={coatColor} />

      {/* ★ 長く大きなキツネ/ウサギ耳 ★ */}
      <polygon points="98,82 58,16 115,62" fill={coatColor} />
      <polygon points="98,78 70,30 108,64" fill={darkBrown} />
      <polygon points="162,82 202,16 145,62" fill={coatColor} />
      <polygon points="162,78 190,30 152,64" fill={darkBrown} />

      {/* 頭の上のちっちゃな3本毛束 */}
      <polygon points="130,55 125,44 135,44" fill={coatColor} />
      <polygon points="122,58 116,48 126,50" fill={coatColor} />
      <polygon points="138,58 144,48 134,50" fill={coatColor} />

      {/* ★ 進化の可能性を象徴するキラキラ虹の星 ★ */}
      {!silhouette && (
        <polygon
          points="180,48 184,56 193,58 186,64 188,73 180,68 172,73 174,64 167,58 176,56"
          fill="#fde047"
          stroke="#f59e0b"
          strokeWidth="1.5"
        />
      )}

      {/* 吸い込まれそうに大きくて可愛い茶色の瞳 */}
      {!silhouette && (
        <g>
          <ellipse cx="112" cy="96" rx="9" ry="13" fill="#451a03" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="112" cy="96" rx="5" ry="8" fill="#92400e" stroke="none" />
          <circle cx="110" cy="91" r="3.5" fill="#ffffff" stroke="none" />
          <circle cx="114" cy="102" r="1.5" fill="#ffffff" stroke="none" />

          <ellipse cx="148" cy="96" rx="9" ry="13" fill="#451a03" stroke="#0f172a" strokeWidth="2" />
          <ellipse cx="148" cy="96" rx="5" ry="8" fill="#92400e" stroke="none" />
          <circle cx="146" cy="91" r="3.5" fill="#ffffff" stroke="none" />
          <circle cx="150" cy="102" r="1.5" fill="#ffffff" stroke="none" />

          {/* ちっちゃな黒鼻とにっこりキャットマウス */}
          <polygon points="130,105 127,108 133,108" fill="#0f172a" stroke="none" />
          <path d="M124 112 Q130 117, 136 112" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/** No.44 フシギダネ (背中にタネをもつ不思議恐竜・フシギダネ ➔ フシギソウ ➔ メガフシギバナ) */
function BulbasaurSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const bodyColor = silhouette ? primary : '#2dd4bf';
  const bulbColor = silhouette ? secondary : '#15803d';
  const spotColor = silhouette ? secondary : '#0f766e';
  const petalTip = silhouette ? secondary : '#f43f5e';

  return (
    <g stroke={outline} strokeWidth="4" strokeLinejoin="round">
      {/* ★ 背中に背負った大きな植物のタネ球根 (PLANT BULB) ★ */}
      <path
        d="M130 90 C85 85, 78 140, 95 165 C115 178, 145 178, 165 165 C182 140, 175 85, 130 90 Z"
        fill={bulbColor}
      />
      {/* 球根の先のピンクのつぼみ花弁 */}
      <polygon points="130,80 124,96 136,96" fill={petalTip} />
      <polygon points="120,86 116,102 128,100" fill={petalTip} />
      <polygon points="140,86 144,102 132,100" fill={petalTip} />

      {/* どっしりした四つ足恐竜ボディ */}
      <ellipse cx="130" cy="174" rx="52" ry="36" fill={bodyColor} />

      {/* からだの緑の斑点模様 */}
      {!silhouette && (
        <g fill={spotColor} stroke="none">
          <polygon points="98,155 106,150 110,160 102,165" />
          <polygon points="148,155 158,150 162,160 152,166" />
          <polygon points="125,178 135,174 138,182 128,185" />
        </g>
      )}

      {/* 4本の足と白いツメ */}
      <rect x="85" y="194" width="22" height="25" rx="7" fill={bodyColor} />
      <rect x="153" y="194" width="22" height="25" rx="7" fill={bodyColor} />
      <polygon points="82,218 86,212 90,218" fill="#ffffff" />
      <polygon points="90,218 94,212 98,218" fill="#ffffff" />
      <polygon points="150,218 154,212 158,218" fill="#ffffff" />
      <polygon points="158,218 162,212 166,218" fill="#ffffff" />

      {/* まあるい頭部＆とがった耳 */}
      <polygon points="102,74 85,50 115,65" fill={bodyColor} />
      <polygon points="158,74 175,50 145,65" fill={bodyColor} />
      <ellipse cx="130" cy="98" rx="38" ry="32" fill={bodyColor} />

      {/* 赤い大きな瞳とにっこり笑顔＆2本の小さな牙 */}
      {!silhouette && (
        <g>
          <polygon points="110,88 122,86 116,98" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
          <circle cx="114" cy="90" r="2.5" fill="#ffffff" stroke="none" />

          <polygon points="150,88 138,86 144,98" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
          <circle cx="146" cy="90" r="2.5" fill="#ffffff" stroke="none" />

          {/* にっかり笑った口とちっちゃな牙 */}
          <path d="M116 112 Q130 124, 144 112" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="118,112 121,118 124,112" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
          <polygon points="136,112 139,118 142,112" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
        </g>
      )}
    </g>
  );
}

/* ==========================================================================
   ⭐ じょうくん大興奮！大人気ポケモン・スーパースター追加 4体 (No.45〜48)
   ========================================================================== */

/** No.45 コライドン (古代の熱血炎竜・巨大胸タイヤ・鮮やかな羽毛トサカ・強靭な四肢) */
function KoraidonSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const redBody = silhouette ? primary : '#dc2626';
  const darkRed = silhouette ? secondary : '#991b1b';
  const chestTire = silhouette ? secondary : '#1f2937';
  const orangeTread = silhouette ? secondary : '#f97316';
  const whiteFeather = silhouette ? secondary : '#f8fafc';
  const cyanCrest = silhouette ? secondary : '#06b6d4';
  const pinkCrest = silhouette ? secondary : '#ec4899';
  const yellowSpike = silhouette ? secondary : '#facc15';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 豪快なしっぽ＆白羽毛プルーム */}
      <path d="M80 180 Q35 195, 20 155 Q40 145, 85 160 Z" fill={redBody} />
      <path d="M22 155 Q5 135, 12 110 Q28 130, 32 150 Z" fill={whiteFeather} />
      <path d="M16 135 Q2 115, 15 95 Q25 115, 28 135 Z" fill={pinkCrest} />

      {/* 強靭な後ろ足 */}
      <path d="M60 165 Q45 190, 50 215 L72 215 Q68 185, 82 170 Z" fill={darkRed} />
      <polygon points="46,215 42,225 50,223" fill="#ffffff" />
      <polygon points="54,215 54,226 60,223" fill="#ffffff" />
      <polygon points="64,215 68,225 72,221" fill="#ffffff" />

      <path d="M178 165 Q195 190, 190 215 L168 215 Q172 185, 158 170 Z" fill={darkRed} />
      <polygon points="188,215 192,225 184,223" fill="#ffffff" />
      <polygon points="180,215 180,226 174,223" fill="#ffffff" />
      <polygon points="170,215 166,225 162,221" fill="#ffffff" />

      {/* 胴体 */}
      <ellipse cx="130" cy="155" rx="38" ry="42" fill={redBody} />

      {/* コライドンの象徴：胸の巨大タイヤ喉袋 */}
      <circle cx="130" cy="156" r="30" fill={chestTire} />
      <circle cx="130" cy="156" r="24" fill={darkRed} />
      {/* タイヤのトレッドパターン（突起） */}
      <rect x="126" y="126" width="8" height="6" rx="2" fill={orangeTread} />
      <rect x="126" y="180" width="8" height="6" rx="2" fill={orangeTread} />
      <rect x="100" y="152" width="6" height="8" rx="2" fill={orangeTread} />
      <rect x="154" y="152" width="6" height="8" rx="2" fill={orangeTread} />
      <rect x="108" y="134" width="7" height="7" rx="2" transform="rotate(45 111 137)" fill={orangeTread} />
      <rect x="145" y="134" width="7" height="7" rx="2" transform="rotate(-45 148 137)" fill={orangeTread} />
      <rect x="108" y="171" width="7" height="7" rx="2" transform="rotate(-45 111 174)" fill={orangeTread} />
      <rect x="145" y="171" width="7" height="7" rx="2" transform="rotate(45 148 174)" fill={orangeTread} />
      {/* ホイール中央ハブ */}
      <circle cx="130" cy="156" r="14" fill={orangeTread} />
      <circle cx="130" cy="156" r="7" fill={chestTire} />

      {/* 肩の白い羽毛装飾 */}
      <path d="M85 125 C70 120, 68 140, 80 148 C88 144, 92 132, 85 125 Z" fill={whiteFeather} />
      <path d="M175 125 C190 120, 192 140, 180 148 C172 144, 168 132, 175 125 Z" fill={whiteFeather} />

      {/* 前腕（力強い腕と白爪） */}
      <path d="M92 138 L65 155 L75 170 L100 152 Z" fill={redBody} />
      <polygon points="62,152 50,150 56,160" fill="#ffffff" />
      <polygon points="66,162 55,165 64,172" fill="#ffffff" />

      <path d="M168 138 L195 155 L185 170 L160 152 Z" fill={redBody} />
      <polygon points="198,152 210,150 204,160" fill="#ffffff" />
      <polygon points="194,162 205,165 196,172" fill="#ffffff" />

      {/* ★ コライドンの頭部と巨大な羽毛トサカ ★ */}
      {/* 後頭部へ広がる鮮やかなトサカ羽毛 */}
      <path d="M105 75 Q45 40, 25 20 Q55 35, 95 62 Z" fill={cyanCrest} />
      <path d="M110 70 Q60 25, 45 5 Q72 25, 102 55 Z" fill={pinkCrest} />
      <path d="M115 65 Q80 15, 75 0 Q95 20, 112 50 Z" fill={yellowSpike} />

      <path d="M155 75 Q215 40, 235 20 Q205 35, 165 62 Z" fill={cyanCrest} />
      <path d="M150 70 Q200 25, 215 5 Q188 25, 158 55 Z" fill={pinkCrest} />
      <path d="M145 65 Q180 15, 185 0 Q165 20, 148 50 Z" fill={yellowSpike} />

      {/* 竜の頭部輪郭 */}
      <path d="M102 85 Q130 60, 158 85 Q165 110, 130 118 Q95 110, 102 85 Z" fill={redBody} />
      <path d="M112 88 L130 75 L148 88 L130 96 Z" fill={darkRed} />

      {/* 眉間の触覚アンテナ */}
      <line x1="120" y1="72" x2="110" y2="48" stroke={yellowSpike} strokeWidth="4" strokeLinecap="round" />
      <line x1="140" y1="72" x2="150" y2="48" stroke={yellowSpike} strokeWidth="4" strokeLinecap="round" />
      <circle cx="110" cy="48" r="4" fill={pinkCrest} />
      <circle cx="150" cy="48" r="4" fill={pinkCrest} />

      {/* 精悍な古代竜の眼 */}
      <polygon points="112,85 125,82 122,94 110,92" fill="#facc15" stroke="#000000" strokeWidth="1.5" />
      <circle cx="118" cy="88" r="3.5" fill="#dc2626" />
      <circle cx="118" cy="88" r="1.8" fill="#000000" />
      <circle cx="120" cy="86" r="1" fill="#ffffff" />

      <polygon points="148,85 135,82 138,94 150,92" fill="#facc15" stroke="#000000" strokeWidth="1.5" />
      <circle cx="142" cy="88" r="3.5" fill="#dc2626" />
      <circle cx="142" cy="88" r="1.8" fill="#000000" />
      <circle cx="144" cy="86" r="1" fill="#ffffff" />

      {/* 鼻先の牙＆精悍な口元 */}
      <polygon points="120,114 124,122 126,114" fill="#ffffff" />
      <polygon points="140,114 136,122 134,114" fill="#ffffff" />
    </g>
  );
}

/** No.46 ギャラドス (怒りの海竜・巨大な咆哮口・3叉の冠王冠・蛇行する長大な蛇胴・長いヒゲ) */
function GyaradosSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const blueBody = silhouette ? primary : '#0284c7';
  const darkBlue = silhouette ? secondary : '#0369a1';
  const bellyYellow = silhouette ? secondary : '#fef08a';
  const mouthRed = silhouette ? secondary : '#991b1b';
  const finWhite = silhouette ? secondary : '#f8fafc';
  const crestColor = silhouette ? secondary : '#0c4a6e';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* ★ 大波を切り裂く蛇行胴体 ★ */}
      {/* 尾ヒレ (3裂の大きな白ヒレ) */}
      <polygon points="35,215 10,230 25,205 8,185 32,198 38,180 48,205" fill={finWhite} />

      {/* 蛇行する胴体セグメント */}
      <path d="M40 205 Q65 220, 95 195 Q105 175, 85 160 Q60 170, 40 205 Z" fill={blueBody} />
      <path d="M85 165 Q120 145, 135 175 Q150 205, 180 185 Q190 160, 165 140 Q130 135, 85 165 Z" fill={blueBody} />
      <path d="M155 145 Q175 110, 155 85 Q130 75, 120 100 Q130 125, 155 145 Z" fill={blueBody} />

      {/* クリーム色の腹部蛇腹プレート */}
      <path d="M52 208 Q70 216, 88 198" fill="none" stroke={bellyYellow} strokeWidth="7" strokeLinecap="round" />
      <path d="M98 175 Q125 165, 142 188" fill="none" stroke={bellyYellow} strokeWidth="8" strokeLinecap="round" />
      <path d="M150 190 Q170 185, 175 170" fill="none" stroke={bellyYellow} strokeWidth="7" strokeLinecap="round" />

      {/* 背中の白いトゲトゲ背ビレ */}
      <polygon points="50,185 58,160 68,180" fill={finWhite} />
      <polygon points="80,150 90,125 102,148" fill={finWhite} />
      <polygon points="120,128 135,105 144,130" fill={finWhite} />
      <polygon points="152,110 175,95 168,122" fill={finWhite} />

      {/* ★ ギャラドスの巨大な咆哮頭部 ★ */}
      <path d="M105 80 Q140 45, 175 75 Q195 110, 165 130 Q120 135, 105 80 Z" fill={blueBody} />

      {/* 3本角のダークブルー冠王冠 (Trident Crest) */}
      <polygon points="125,58 108,18 130,38 145,10 160,38 182,18 165,58" fill={crestColor} />
      <polygon points="135,55 145,22 155,55" fill={darkBlue} />

      {/* 威嚇する大口 (真っ赤な口内と鋭い歯) */}
      <ellipse cx="140" cy="105" rx="26" ry="18" fill={mouthRed} />
      <path d="M115 105 Q140 125, 165 105" fill="none" stroke={blueBody} strokeWidth="6" strokeLinecap="round" />
      {/* 鋭い牙（上下） */}
      <polygon points="122,96 126,104 130,96" fill="#ffffff" />
      <polygon points="134,94 138,103 142,94" fill="#ffffff" />
      <polygon points="146,94 150,103 154,94" fill="#ffffff" />
      <polygon points="126,112 130,105 134,112" fill="#ffffff" />
      <polygon points="138,114 142,106 146,114" fill="#ffffff" />
      <polygon points="150,112 154,105 158,112" fill="#ffffff" />

      {/* 左右の長大な白いヒゲ */}
      <path d="M115 100 Q80 115, 65 145 Q80 135, 110 110" fill={finWhite} />
      <path d="M165 100 Q200 115, 215 145 Q200 135, 170 110" fill={finWhite} />

      {/* 怒りの三角白眼＆黒瞳 */}
      <polygon points="120,74 136,70 134,84 118,82" fill="#ffffff" stroke="#000000" strokeWidth="2" />
      <polygon points="126,75 132,73 131,81 125,80" fill="#000000" />
      <circle cx="127" cy="76" r="1.5" fill="#ffffff" />

      <polygon points="160,74 144,70 146,84 162,82" fill="#ffffff" stroke="#000000" strokeWidth="2" />
      <polygon points="154,75 148,73 149,81 155,80" fill="#000000" />
      <circle cx="153" cy="76" r="1.5" fill="#ffffff" />

      {/* 激しい水しぶき */}
      {!silhouette && (
        <g fill="#38bdf8" opacity="0.8">
          <circle cx="35" cy="175" r="4" />
          <circle cx="48" cy="155" r="3" />
          <circle cx="195" cy="180" r="4.5" />
          <circle cx="215" cy="165" r="3.5" />
        </g>
      )}
    </g>
  );
}

/** No.47 レックウザ (天空のオゾン緑竜・幾何学リング文様・黒赤フィン角・雷光オーラ) */
function RayquazaSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const greenBody = silhouette ? primary : '#16a34a';
  const darkGreen = silhouette ? secondary : '#14532d';
  const ringYellow = silhouette ? secondary : '#facc15';
  const finRed = silhouette ? secondary : '#ef4444';
  const finBlack = silhouette ? secondary : '#0f172a';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* ★ 大空を翔ける緑の竜胴ループ ★ */}
      {/* 尾部のフィン */}
      <polygon points="45,215 15,225 32,200 12,185 40,195" fill={darkGreen} />
      <polygon points="18,220 28,205 20,195" fill={finRed} />

      {/* 胴体のうねりループ */}
      <path d="M42 200 Q80 230, 130 205 Q175 180, 195 135 Q180 115, 160 135 Q140 160, 105 175 Q60 185, 42 200 Z" fill={greenBody} />
      <path d="M175 125 Q165 95, 140 85 Q115 95, 125 125 Q140 145, 175 125 Z" fill={greenBody} />

      {/* 胴体の象徴的な黄色い円環リング文様 (Rune Rings) */}
      <circle cx="65" cy="195" r="11" fill="none" stroke={ringYellow} strokeWidth="4.5" />
      <circle cx="105" cy="192" r="12" fill="none" stroke={ringYellow} strokeWidth="4.5" />
      <circle cx="150" cy="175" r="12" fill="none" stroke={ringYellow} strokeWidth="4.5" />
      <circle cx="180" cy="142" r="11" fill="none" stroke={ringYellow} strokeWidth="4.5" />
      <circle cx="145" cy="115" r="10" fill="none" stroke={ringYellow} strokeWidth="4" />

      {/* 胴体側面の空気力学フィン (舵角) */}
      <polygon points="90,170 70,145 98,155" fill={finBlack} />
      <polygon points="78,152 70,145 88,152" fill={finRed} />
      <polygon points="160,160 185,150 168,175" fill={finBlack} />
      <polygon points="175,153 185,150 170,168" fill={finRed} />

      {/* 前脚（鋭い2本の小腕） */}
      <path d="M125 128 L100 138 L105 146 L130 135 Z" fill={greenBody} />
      <polygon points="98,138 90,142 98,145" fill="#ffffff" />
      <polygon points="102,146 95,150 104,152" fill="#ffffff" />

      <path d="M152 128 L175 138 L170 146 L148 135 Z" fill={greenBody} />
      <polygon points="176,138 184,142 176,145" fill="#ffffff" />
      <polygon points="172,146 179,150 170,152" fill="#ffffff" />

      {/* ★ レックウザの幾何学的ヘッド＆2対のロングホーン ★ */}
      {/* 後頭部の大型上部ホーン（黒と赤のアクセント） */}
      <polygon points="112,65 72,15 95,45 118,52" fill={finBlack} />
      <polygon points="75,20 88,38 78,32" fill={finRed} />

      <polygon points="148,65 188,15 165,45 142,52" fill={finBlack} />
      <polygon points="185,20 172,38 182,32" fill={finRed} />

      {/* 頬の下部ホーン */}
      <polygon points="105,78 68,68 95,85" fill={finBlack} />
      <polygon points="72,70 88,80 78,76" fill={finRed} />

      <polygon points="155,78 192,68 165,85" fill={finBlack} />
      <polygon points="188,70 172,80 182,76" fill={finRed} />

      {/* 竜頭メイン */}
      <polygon points="130,48 105,68 108,95 130,105 152,95 155,68" fill={greenBody} />
      <polygon points="130,58 116,72 118,90 130,96 142,90 144,72" fill={darkGreen} />

      {/* 黄色い眼＆黒の縁取り */}
      <circle cx="118" cy="76" r="6" fill="#facc15" stroke="#000000" strokeWidth="2" />
      <circle cx="118" cy="76" r="3" fill="#000000" />
      <circle cx="120" cy="74" r="1.2" fill="#ffffff" />

      <circle cx="142" cy="76" r="6" fill="#facc15" stroke="#000000" strokeWidth="2" />
      <circle cx="142" cy="76" r="3" fill="#000000" />
      <circle cx="144" cy="74" r="1.2" fill="#ffffff" />

      {/* 鋭い牙 */}
      <polygon points="120,95 124,103 127,95" fill="#ffffff" />
      <polygon points="140,95 136,103 133,95" fill="#ffffff" />

      {/* メガレックウザ風の黄金の光のリボンオーラ */}
      {!silhouette && (
        <g stroke="#fde047" strokeWidth="3" fill="none" opacity="0.85">
          <path d="M85 55 Q50 90, 30 140 Q45 120, 65 110" />
          <path d="M175 55 Q210 90, 230 140 Q215 120, 195 110" />
        </g>
      )}
    </g>
  );
}

/** No.48 ニャオハ (甘えんぼう草ねこ・大きな瞳・葉っぱの首輪・愛らしいピンクの鼻と肉球) */
function SprigatitoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const mintFur = silhouette ? primary : '#86efac';
  const darkMint = silhouette ? secondary : '#4ade80';
  const leafGreen = silhouette ? secondary : '#16a34a';
  const innerEar = silhouette ? secondary : '#fbcfe8';
  const eyePink = silhouette ? secondary : '#ec4899';
  const nosePink = silhouette ? secondary : '#f43f5e';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* ふわふわのしっぽ（立ち上がった葉っぱ状の尾） */}
      <path d="M165 175 Q215 170, 218 125 Q195 135, 172 165 Z" fill={mintFur} />
      <path d="M205 138 Q218 125, 210 115 Q198 128, 205 138 Z" fill={leafGreen} />

      {/* まあるい後ろ足 */}
      <ellipse cx="90" cy="185" rx="18" ry="16" fill={darkMint} />
      <ellipse cx="170" cy="185" rx="18" ry="16" fill={darkMint} />

      {/* 小さな前足 */}
      <path d="M108 170 L104 212 Q115 218, 122 212 L120 170 Z" fill={mintFur} />
      <path d="M138 170 L136 212 Q145 218, 154 212 L150 170 Z" fill={mintFur} />
      {/* 肉球ステッチ */}
      <circle cx="113" cy="210" r="2" fill={nosePink} stroke="none" />
      <circle cx="145" cy="210" r="2" fill={nosePink} stroke="none" />

      {/* まるっこい胴体 */}
      <ellipse cx="130" cy="165" rx="34" ry="30" fill={mintFur} />

      {/* ★ ニャオハの葉っぱの首輪 (Leaf Ruff Collar) ★ */}
      <path
        d="M130 135 L105 152 L116 134 L85 132 L112 120 L130 128 L148 120 L175 132 L144 134 L155 152 Z"
        fill={leafGreen}
      />

      {/* ★ 愛らしいニャオハの大きな顔 ★ */}
      {/* 大きな三角の猫耳 */}
      <polygon points="85,85 62,32 105,58" fill={mintFur} />
      <polygon points="82,78 68,42 98,60" fill={innerEar} />

      <polygon points="175,85 198,32 155,58" fill={mintFur} />
      <polygon points="178,78 192,42 162,60" fill={innerEar} />

      {/* ほっぺのふっくらした輪郭 */}
      <path d="M85 85 Q70 108, 92 128 Q130 138, 168 128 Q190 108, 175 85 Q130 68, 85 85 Z" fill={mintFur} />

      {/* 額から目の周りを飾る葉っぱ模様 (Leaf Mask Marking) */}
      <path
        d="M130 82 Q120 95, 102 96 Q115 115, 130 112 Q145 115, 158 96 Q140 95, 130 82 Z"
        fill={leafGreen}
      />
      <polygon points="130,72 124,84 136,84" fill={leafGreen} />

      {/* ★ じょうくんを魅了する大きなキラキラピンクの瞳 ★ */}
      {/* 左目 */}
      <ellipse cx="108" cy="102" rx="13" ry="16" fill={eyePink} stroke="#000000" strokeWidth="2.5" />
      <ellipse cx="108" cy="104" rx="9" ry="12" fill="#9d174d" stroke="none" />
      <circle cx="105" cy="97" r="5" fill="#ffffff" stroke="none" />
      <circle cx="112" cy="108" r="2.5" fill="#ffffff" stroke="none" />

      {/* 右目 */}
      <ellipse cx="152" cy="102" rx="13" ry="16" fill={eyePink} stroke="#000000" strokeWidth="2.5" />
      <ellipse cx="152" cy="104" rx="9" ry="12" fill="#9d174d" stroke="none" />
      <circle cx="149" cy="97" r="5" fill="#ffffff" stroke="none" />
      <circle cx="156" cy="108" r="2.5" fill="#ffffff" stroke="none" />

      {/* ピンクの小さな鼻＆ωの口元 */}
      <polygon points="130,114 126,110 134,110" fill={nosePink} stroke="none" />
      <path d="M124 116 Q127 121, 130 117 Q133 121, 136 116" fill="none" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />

      {/* ほっぺの愛らしいピンクチーク */}
      {!silhouette && (
        <g fill="#f472b6" opacity="0.6" stroke="none">
          <ellipse cx="90" cy="115" rx="6" ry="4" />
          <ellipse cx="170" cy="115" rx="6" ry="4" />
        </g>
      )}
    </g>
  );
}

/* ==========================================================================
   🦸 アベンジャーズ・伝説のスーパーヒーロー怪獣 4体 (No.49〜52)
   ========================================================================== */

/** No.49 アイアンマン (真紅＆ゴールドのハイテクパワードスーツ・輝くアークリアクター・リパルサーキャノン) */
function IronManSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const redArmor = silhouette ? primary : '#dc2626';
  const darkRed = silhouette ? secondary : '#991b1b';
  const goldPlate = silhouette ? secondary : '#facc15';
  const darkGold = silhouette ? secondary : '#ca8a04';
  const arcCyan = silhouette ? secondary : '#38bdf8';
  const arcWhite = silhouette ? secondary : '#ffffff';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 頑強な脚部アーマー */}
      <path d="M92 175 L85 220 L108 220 L115 175 Z" fill={redArmor} />
      <rect x="88" y="195" width="22" height="10" rx="3" fill={goldPlate} />
      <path d="M82 220 L110 220 L112 228 L80 228 Z" fill={darkRed} />

      <path d="M168 175 L175 220 L152 220 L145 175 Z" fill={redArmor} />
      <rect x="150" y="195" width="22" height="10" rx="3" fill={goldPlate} />
      <path d="M148 220 L178 220 L180 228 L146 228 Z" fill={darkRed} />

      {/* 腰部＆腹筋プレート */}
      <path d="M102 155 L96 180 L164 180 L158 155 Z" fill={goldPlate} />
      <line x1="130" y1="155" x2="130" y2="180" stroke={darkGold} strokeWidth="3" />

      {/* 胴体胸部アーマー */}
      <path d="M88 105 L172 105 L160 160 L100 160 Z" fill={redArmor} />

      {/* ★ 胸中央のアークリアクター (Arc Reactor) ★ */}
      <circle cx="130" cy="132" r="17" fill="#0f172a" />
      <circle cx="130" cy="132" r="14" fill="#0284c7" />
      <circle cx="130" cy="132" r="9" fill={arcCyan} />
      <circle cx="130" cy="132" r="5" fill={arcWhite} />
      {!silhouette && (
        <g stroke={arcCyan} strokeWidth="2" opacity="0.9">
          <line x1="130" y1="112" x2="130" y2="116" />
          <line x1="130" y1="148" x2="130" y2="152" />
          <line x1="110" y1="132" x2="114" y2="132" />
          <line x1="146" y1="132" x2="150" y2="132" />
        </g>
      )}

      {/* 左肩＆左腕（握り拳） */}
      <ellipse cx="78" cy="115" rx="14" ry="12" fill={goldPlate} />
      <path d="M74 125 L65 160 L82 165 L88 128 Z" fill={redArmor} />
      <circle cx="72" cy="170" r="10" fill={goldPlate} />

      {/* 右肩＆右腕（手のひらリパルサーキャノン発射ポーズ！） */}
      <ellipse cx="182" cy="115" rx="14" ry="12" fill={goldPlate} />
      <path d="M185 125 L205 140 L195 155 L178 135 Z" fill={redArmor} />
      {/* 前方に向けた掌パーム */}
      <circle cx="212" cy="148" r="16" fill={goldPlate} />
      <circle cx="212" cy="148" r="9" fill={arcCyan} />
      <circle cx="212" cy="148" r="4.5" fill={arcWhite} />
      {!silhouette && (
        <g stroke={arcCyan} strokeWidth="2.5" fill="none">
          <circle cx="212" cy="148" r="22" strokeDasharray="6 6" />
          <polygon points="230,135 245,148 230,161" fill={arcCyan} stroke="none" />
        </g>
      )}

      {/* ★ アイアンマンの象徴的マスク (Helmet) ★ */}
      <path d="M102 52 Q130 38, 158 52 Q168 85, 155 105 Q130 115, 105 105 Q92 85, 102 52 Z" fill={redArmor} />
      {/* ゴールドフェイスプレート */}
      <path
        d="M112 55 L148 55 L154 82 L144 102 L116 102 L106 82 Z"
        fill={goldPlate}
      />
      {/* 鋭い額のシャープライン */}
      <polygon points="120,55 130,68 140,55" fill={redArmor} />

      {/* 青白く光るアイコニックなスリットアイ */}
      <polygon points="114,75 126,76 124,80 113,79" fill={arcWhite} stroke="#0284c7" strokeWidth="1.5" />
      <polygon points="146,75 134,76 136,80 147,79" fill={arcWhite} stroke="#0284c7" strokeWidth="1.5" />

      {/* 口元スリット */}
      <line x1="122" y1="94" x2="138" y2="94" stroke={darkGold} strokeWidth="3" />
    </g>
  );
}

/** No.50 キャプテン・アメリカ (伝説の星条旗スーツ・星のヴィブラニウムシールド・白翼ヘルメット・不屈のリーダー) */
function CaptainAmericaSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const suitBlue = silhouette ? primary : '#1d4ed8';
  const darkBlue = silhouette ? secondary : '#1e3a8a';
  const shieldRed = silhouette ? secondary : '#dc2626';
  const whiteStar = silhouette ? secondary : '#ffffff';
  const leatherBrown = silhouette ? secondary : '#78350f';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 頑強な脚部 */}
      <path d="M95 175 L90 220 L112 220 L115 175 Z" fill={suitBlue} />
      <path d="M86 215 L114 215 L112 226 L84 226 Z" fill={shieldRed} />

      <path d="M165 175 L170 220 L148 220 L145 175 Z" fill={suitBlue} />
      <path d="M144 215 L172 215 L170 226 L142 226 Z" fill={shieldRed} />

      {/* ブラウンのユーティリティベルト */}
      <rect x="94" y="162" width="72" height="12" rx="2" fill={leatherBrown} />
      <rect x="124" y="160" width="12" height="16" rx="2" fill="#e2e8f0" />

      {/* 腹部の赤白ストライプ */}
      <rect x="98" y="138" width="64" height="24" fill="#ffffff" />
      <rect x="106" y="138" width="10" height="24" fill={shieldRed} />
      <rect x="125" y="138" width="10" height="24" fill={shieldRed} />
      <rect x="144" y="138" width="10" height="24" fill={shieldRed} />

      {/* 胸部タクティカルスーツ＆ホワイトスター */}
      <path d="M88 98 L172 98 L162 140 L98 140 Z" fill={suitBlue} />
      <polygon
        points="130,105 133,115 143,115 135,121 138,130 130,124 122,130 125,121 117,115 127,115"
        fill={whiteStar}
      />

      {/* 右腕（勇ましい握り拳） */}
      <ellipse cx="178" cy="108" rx="13" ry="12" fill={suitBlue} />
      <path d="M178 116 L195 150 L180 156 L168 125 Z" fill={suitBlue} />
      <circle cx="195" cy="158" r="11" fill={shieldRed} />

      {/* ★ キャプテンの代名詞：ヴィブラニウム円形シールド (Vibranium Shield) ★ */}
      <g transform="translate(68, 140)">
        {/* 外枠赤リング */}
        <circle cx="0" cy="0" r="38" fill={shieldRed} />
        {/* 白リング */}
        <circle cx="0" cy="0" r="30" fill="#ffffff" />
        {/* 内枠赤リング */}
        <circle cx="0" cy="0" r="22" fill={shieldRed} />
        {/* 中央青ディスク */}
        <circle cx="0" cy="0" r="14" fill={suitBlue} />
        {/* 星条旗の中央ホワイトスター */}
        <polygon
          points="0,-12 3.5,-3 12,-3 5,2 8,11 0,6 -8,11 -5,2 -12,-3 -3.5,-3"
          fill={whiteStar}
        />
        {/* 金属の光沢ハイライト */}
        {!silhouette && (
          <path d="M-28 -20 A 34 34 0 0 1 20 -28" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        )}
      </g>

      {/* ★ キャプテンのヘルメット＆凛々しいマスク ★ */}
      <path d="M104 50 Q130 38, 156 50 Q165 78, 152 98 Q130 108, 108 98 Q95 78, 104 50 Z" fill={suitBlue} />
      {/* チンストラップ＆露出した顎 */}
      <path d="M112 88 Q130 106, 148 88 Z" fill="#fed7aa" stroke={leatherBrown} strokeWidth="2.5" />

      {/* 額のホワイト「A」マーク */}
      <polygon points="130,48 122,66 128,66 130,60 132,66 138,66" fill={whiteStar} />
      <polygon points="127,58 130,52 133,58" fill={suitBlue} />

      {/* 側頭部の小さな白翼ウィング */}
      <polygon points="102,62 88,54 98,70" fill={whiteStar} />
      <polygon points="158,62 172,54 162,70" fill={whiteStar} />

      {/* 強い意志を宿した英雄の瞳 */}
      <circle cx="118" cy="74" r="4.5" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
      <circle cx="119" cy="74" r="2.5" fill={darkBlue} />
      <circle cx="120" cy="73" r="1" fill="#ffffff" />

      <circle cx="142" cy="74" r="4.5" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
      <circle cx="141" cy="74" r="2.5" fill={darkBlue} />
      <circle cx="140" cy="73" r="1" fill="#ffffff" />
    </g>
  );
}

/** No.51 ソー (アスガルド雷神・真紅のマント・6枚の銀ディスク・ムジョルニアの轟雷・翼の兜) */
function ThorSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const capeRed = silhouette ? primary : '#dc2626';
  const darkCape = silhouette ? secondary : '#991b1b';
  const cuirassBlack = silhouette ? secondary : '#1e293b';
  const silverDisc = silhouette ? secondary : '#e2e8f0';
  const goldHair = silhouette ? secondary : '#facc15';
  const lightningBlue = silhouette ? secondary : '#38bdf8';
  const hammerSteel = silhouette ? secondary : '#64748b';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* なびく真紅の大マント */}
      <path d="M78 95 Q25 125, 20 220 Q55 210, 80 190 Z" fill={capeRed} />
      <path d="M182 95 Q235 125, 240 220 Q205 210, 180 190 Z" fill={capeRed} />

      {/* 脚部アーマー */}
      <path d="M98 175 L92 222 L114 222 L116 175 Z" fill={cuirassBlack} />
      <path d="M162 175 L168 222 L146 222 L144 175 Z" fill={cuirassBlack} />
      <rect x="90" y="215" width="26" height="12" rx="3" fill="#475569" />
      <rect x="144" y="215" width="26" height="12" rx="3" fill="#475569" />

      {/* 胴体ブラックキュイラス */}
      <path d="M92 105 L168 105 L158 175 L102 175 Z" fill={cuirassBlack} />

      {/* ★ ソーの象徴：胴体の6枚のシルバーサークルディスク ★ */}
      <circle cx="114" cy="120" r="11" fill={silverDisc} />
      <circle cx="146" cy="120" r="11" fill={silverDisc} />
      <circle cx="114" cy="142" r="11" fill={silverDisc} />
      <circle cx="146" cy="142" r="11" fill={silverDisc} />
      <circle cx="118" cy="162" r="9" fill={silverDisc} />
      <circle cx="142" cy="162" r="9" fill={silverDisc} />

      {/* 左腕（拳） */}
      <ellipse cx="78" cy="112" rx="13" ry="12" fill={silverDisc} />
      <path d="M76 120 L62 155 L78 160 L86 128 Z" fill={cuirassBlack} />
      <circle cx="66" cy="165" r="10" fill="#475569" />

      {/* 右腕＆掲げられた雷神の槌ムジョルニア (Mjolnir) */}
      <ellipse cx="182" cy="112" rx="13" ry="12" fill={silverDisc} />
      <path d="M182 118 L202 85 L215 92 L192 128 Z" fill={cuirassBlack} />
      {/* ハンマーの柄 */}
      <rect x="206" y="55" width="8" height="35" rx="2" fill="#78350f" transform="rotate(-15 210 72)" />
      {/* 鋼鉄の四角いハンマーヘッド */}
      <rect x="180" y="32" width="46" height="28" rx="4" fill={hammerSteel} stroke="#ffffff" strokeWidth="2.5" />
      <circle cx="203" cy="46" r="6" fill="#475569" />
      {/* ハンマーから迸る電撃スパーク */}
      {!silhouette && (
        <g stroke={lightningBlue} strokeWidth="3" fill="none">
          <path d="M203 32 L215 12 L225 25 L245 8" />
          <path d="M180 40 L165 25 L172 15 L158 5" />
          <path d="M226 46 L242 42 L236 58 L252 55" />
        </g>
      )}

      {/* 肩の赤いマント留め */}
      <circle cx="92" cy="102" r="7" fill={silverDisc} />
      <circle cx="168" cy="102" r="7" fill={silverDisc} />

      {/* ★ ソーの波打つ金髪＆翼のシルバー兜 ★ */}
      {/* なびく金髪 */}
      <path d="M96 65 Q70 85, 75 125 Q92 120, 98 95 Z" fill={goldHair} />
      <path d="M164 65 Q190 85, 185 125 Q168 120, 162 95 Z" fill={goldHair} />

      {/* シルバーヘルメット */}
      <path d="M106 50 Q130 38, 154 50 Q162 75, 150 92 Q130 100, 110 92 Q98 75, 106 50 Z" fill={silverDisc} />
      {/* 兜の左右の大翼フェザーウィング */}
      <polygon points="104,58 72,25 92,50 82,62 102,68" fill="#ffffff" stroke={silverDisc} strokeWidth="2" />
      <polygon points="156,58 188,25 168,50 178,62 158,68" fill="#ffffff" stroke={silverDisc} strokeWidth="2" />

      {/* 凛々しい金髭 */}
      <path d="M116 82 Q130 96, 144 82 Q138 98, 130 100 Q122 98, 116 82 Z" fill={goldHair} />

      {/* 蒼く輝く雷神の瞳 */}
      <circle cx="120" cy="72" r="4.5" fill={lightningBlue} stroke="#000000" strokeWidth="1.5" />
      <circle cx="120" cy="72" r="2" fill="#ffffff" />

      <circle cx="140" cy="72" r="4.5" fill={lightningBlue} stroke="#000000" strokeWidth="1.5" />
      <circle cx="140" cy="72" r="2" fill="#ffffff" />
    </g>
  );
}

/** No.52 スパイダーマン (親愛なる隣人・鮮やかな赤青スーツ・細密ウェブパターン・特大ホワイトアイ・糸噴射) */
function SpiderManSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const suitRed = silhouette ? primary : '#ef4444';
  const suitBlue = silhouette ? secondary : '#2563eb';
  const darkBlue = silhouette ? secondary : '#1d4ed8';
  const webBlack = silhouette ? secondary : '#0f172a';
  const spiderGold = silhouette ? secondary : '#facc15';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 背中のアイアン・スパイダー金色アーム（4本のアクロバティック脚） */}
      {!silhouette && (
        <g stroke={spiderGold} strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M110 115 Q60 65, 45 100 Q35 125, 20 120" />
          <path d="M110 125 Q55 130, 38 165 Q25 190, 15 185" />
          <path d="M150 115 Q200 65, 215 100 Q225 125, 240 120" />
          <path d="M150 125 Q205 130, 222 165 Q235 190, 245 185" />
        </g>
      )}

      {/* アクロバティックに屈んだ下半身（ブルーのタイツ） */}
      <path d="M85 160 Q60 185, 68 218 L92 218 Q88 190, 105 168 Z" fill={suitBlue} />
      <path d="M66 212 L94 212 L92 226 L64 226 Z" fill={suitRed} />

      <path d="M175 160 Q200 185, 192 218 L168 218 Q172 190, 155 168 Z" fill={suitBlue} />
      <path d="M166 212 L194 212 L196 226 L168 226 Z" fill={suitRed} />

      {/* 胴体（中央レッド、両脇ブルー） */}
      <path d="M92 108 L168 108 L158 165 L102 165 Z" fill={suitRed} />
      <path d="M92 108 L112 112 L106 165 L102 165 Z" fill={suitBlue} />
      <path d="M168 108 L148 112 L154 165 L158 165 Z" fill={suitBlue} />

      {/* 胴体のウェブパターンモールド */}
      <line x1="130" y1="108" x2="130" y2="165" stroke={webBlack} strokeWidth="1.8" />
      <line x1="112" y1="120" x2="148" y2="120" stroke={webBlack} strokeWidth="1.8" />
      <line x1="110" y1="138" x2="150" y2="138" stroke={webBlack} strokeWidth="1.8" />
      <line x1="108" y1="154" x2="152" y2="154" stroke={webBlack} strokeWidth="1.8" />

      {/* 胸の中央のブラックスパイダーエンブレム */}
      <ellipse cx="130" cy="132" rx="4" ry="6" fill={webBlack} />
      <g stroke={webBlack} strokeWidth="2" fill="none">
        <path d="M130 128 Q120 120, 118 114" />
        <path d="M130 130 Q118 130, 116 125" />
        <path d="M130 134 Q118 136, 117 145" />
        <path d="M130 136 Q120 144, 119 152" />
        <path d="M130 128 Q140 120, 142 114" />
        <path d="M130 130 Q142 130, 144 125" />
        <path d="M130 134 Q142 136, 143 145" />
        <path d="M130 136 Q140 144, 141 152" />
      </g>

      {/* 右腕（地面に手を突くポーズ） */}
      <path d="M92 114 L65 142 L78 152 L100 125 Z" fill={suitBlue} />
      <circle cx="62" cy="150" r="12" fill={suitRed} />

      {/* 左腕（ウェブシューターを正面に発射するポーズ！🤟） */}
      <path d="M168 114 L195 130 L188 144 L162 125 Z" fill={suitBlue} />
      <circle cx="204" cy="136" r="13" fill={suitRed} />

      {/* 手首から放たれるスパイダーウェブ（白いクモの糸とエフェクト） */}
      {!silhouette && (
        <g stroke="#ffffff" strokeWidth="2.5" fill="none">
          <path d="M214 134 Q235 125, 252 115" />
          <path d="M214 136 Q238 136, 256 135" />
          <path d="M214 138 Q235 148, 252 155" />
          <ellipse cx="245" cy="135" rx="8" ry="14" stroke="#38bdf8" strokeWidth="2" />
          <line x1="245" y1="121" x2="245" y2="149" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="237" y1="135" x2="253" y2="135" stroke="#38bdf8" strokeWidth="1.5" />
        </g>
      )}

      {/* ★ スパイダーマンの象徴：マスク＆特大ホワイトアイ ★ */}
      <ellipse cx="130" cy="72" rx="34" ry="38" fill={suitRed} />

      {/* マスク上の放射状ウェブライン */}
      <g stroke={webBlack} strokeWidth="1.8" fill="none">
        <line x1="130" y1="72" x2="130" y2="34" />
        <line x1="130" y1="72" x2="158" y2="45" />
        <line x1="130" y1="72" x2="164" y2="72" />
        <line x1="130" y1="72" x2="158" y2="98" />
        <line x1="130" y1="72" x2="130" y2="110" />
        <line x1="130" y1="72" x2="102" y2="98" />
        <line x1="130" y1="72" x2="96" y2="72" />
        <line x1="130" y1="72" x2="102" y2="45" />
        <ellipse cx="130" cy="72" rx="16" ry="18" />
        <ellipse cx="130" cy="72" rx="28" ry="32" />
      </g>

      {/* 特大ホワイトアイレンズ（太い黒枠フレーム＆鋭い目つき） */}
      {/* 左目 */}
      <path
        d="M100 60 Q124 58, 126 80 Q112 85, 96 74 Z"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* 右目 */}
      <path
        d="M160 60 Q136 58, 134 80 Q148 85, 164 74 Z"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </g>
  );
}

/* ==========================================================================
   😈 ドラクエ風・伝説の4大魔王 (No.45〜48: りゅうおう・ハーゴン＆シドー・ダークドレアム・デスピサロ)
   ========================================================================== */

/** No.45 りゅうおう (紫の巨大悪魔竜、コウモリの大翼、黄金の2本角＆首輪、灼熱の業火) */
function RyuoSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const purpleScale = silhouette ? primary : '#7e22ce';
  const darkPurple = silhouette ? secondary : '#4c1d95';
  const wingMembrane = silhouette ? secondary : '#c026d3';
  const goldTrim = silhouette ? secondary : '#facc15';
  const bellyCream = silhouette ? secondary : '#fde047';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* ★ 背中に広がる巨大な悪魔コウモリ翼 ★ */}
      <polygon points="108,132 16,45 48,96 20,126 62,135 45,165 104,155" fill={wingMembrane} />
      <polygon points="152,132 244,45 212,96 240,126 198,135 215,165 156,155" fill={wingMembrane} />
      <path d="M108 132 L16 45 L48 96 L20 126" fill="none" stroke={darkPurple} strokeWidth="5" strokeLinecap="round" />
      <path d="M152 132 L244 45 L212 96 L240 126" fill="none" stroke={darkPurple} strokeWidth="5" strokeLinecap="round" />

      {/* 太く長大な紫ドラゴンの尻尾＆トゲ */}
      <path d="M90 185 Q28 205, 18 158 Q45 168, 95 168 Z" fill={purpleScale} />
      <polygon points="22,158 10,145 28,148" fill={goldTrim} />

      {/* 威風堂々たる竜王の巨体＆黄金の蛇腹お腹 */}
      <ellipse cx="130" cy="168" rx="48" ry="44" fill={purpleScale} />
      <ellipse cx="130" cy="172" rx="28" ry="32" fill={bellyCream} stroke="none" />
      {!silhouette && (
        <g stroke="#b45309" strokeWidth="2.5" fill="none">
          <line x1="106" y1="156" x2="154" y2="156" />
          <line x1="104" y1="170" x2="156" y2="170" />
          <line x1="108" y1="184" x2="152" y2="184" />
        </g>
      )}

      {/* 強靭な後ろ足と鋭い黄金のツメ */}
      <rect x="82" y="194" width="26" height="30" rx="8" fill={darkPurple} />
      <rect x="152" y="194" width="26" height="30" rx="8" fill={darkPurple} />
      <polygon points="78,224 86,214 92,224" fill={goldTrim} />
      <polygon points="92,224 100,214 106,224" fill={goldTrim} />
      <polygon points="148,224 156,214 162,224" fill={goldTrim} />
      <polygon points="162,224 170,214 176,224" fill={goldTrim} />

      {/* 首元の黄金のトゲ付き魔王カラー（首輪） */}
      <ellipse cx="130" cy="126" rx="34" ry="12" fill={goldTrim} />
      <polygon points="98,126 84,118 96,118" fill="#ffffff" />
      <polygon points="162,126 176,118 164,118" fill="#ffffff" />

      {/* たくましい両腕 */}
      <path d="M94 140 L64 158 L74 172 L102 154 Z" fill={purpleScale} />
      <path d="M166 140 L196 158 L186 172 L158 154 Z" fill={purpleScale} />

      {/* ★ 天を衝く2本の巨大な黄金の竜王角 ★ */}
      <path d="M108 72 Q70 30, 52 14 Q84 36, 116 62 Z" fill={goldTrim} />
      <path d="M152 72 Q190 30, 208 14 Q176 36, 144 62 Z" fill={goldTrim} />

      {/* 竜王の威厳あるドラゴンヘッド */}
      <ellipse cx="130" cy="86" rx="36" ry="30" fill={purpleScale} />
      <ellipse cx="130" cy="100" rx="28" ry="16" fill={darkPurple} />

      {/* 口から溢れ出す灼熱の煉獄火炎（ベギラゴン） */}
      {!silhouette && (
        <g stroke="none">
          <circle cx="130" cy="112" r="10" fill="#ef4444" opacity="0.85" />
          <circle cx="130" cy="112" r="6" fill="#fde047" />
        </g>
      )}

      {/* 紅蓮に輝く魔王の眼光＆鋭い牙 */}
      {!silhouette && (
        <g>
          <polygon points="104,76 122,82 110,90" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
          <circle cx="114" cy="82" r="2.5" fill="#fef08a" stroke="none" />
          <polygon points="156,76 138,82 150,90" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
          <circle cx="146" cy="82" r="2.5" fill="#fef08a" stroke="none" />
          <polygon points="114,102 118,114 122,102" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
          <polygon points="138,102 142,114 146,102" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
        </g>
      )}
    </g>
  );
}

/** No.46 ハーゴン＆シドー (6本腕の蒼き破壊神シドー、ドクロ冠、大蛇の尾、邪神官の魔杖) */
function HargonSidohSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const cyanBody = silhouette ? primary : '#0284c7';
  const deepBlue = silhouette ? secondary : '#1e3a8a';
  const hornGold = silhouette ? secondary : '#fde047';
  const robePurple = silhouette ? secondary : '#7e22ce';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 背中の邪神ウイング */}
      <polygon points="105,120 28,68 48,118 24,142 98,145" fill={deepBlue} />
      <polygon points="155,120 232,68 212,118 236,142 162,145" fill={deepBlue} />

      {/* とぐろを巻く長い大蛇の尻尾 */}
      <path d="M95 190 Q28 210, 22 168 Q40 148, 62 172 Q82 182, 102 178 Z" fill={cyanBody} />

      {/* ★ 破壊神シドー象徴の「6本の剛腕（左右3対）」 ★ */}
      <path d="M96 122 L46 102 L54 118 L92 134 Z" fill={cyanBody} />
      <path d="M92 144 L42 142 L48 158 L92 156 Z" fill={cyanBody} />
      <path d="M96 164 L56 176 L64 190 L100 176 Z" fill={cyanBody} />

      <path d="M164 122 L214 102 L206 118 L168 134 Z" fill={cyanBody} />
      <path d="M168 144 L218 142 L212 158 L168 156 Z" fill={cyanBody} />
      <path d="M164 164 L204 176 L196 190 L160 176 Z" fill={cyanBody} />

      {/* 右手に握る大神官ハーゴンの邪神の杖 */}
      <line x1="214" y1="62" x2="202" y2="195" stroke={hornGold} strokeWidth="5" strokeLinecap="round" />
      <circle cx="214" cy="58" r="11" fill={robePurple} stroke={hornGold} strokeWidth="3" />

      {/* 筋骨隆々の蒼き邪神の胴体 */}
      <ellipse cx="130" cy="164" rx="46" ry="42" fill={cyanBody} />
      <ellipse cx="130" cy="168" rx="28" ry="28" fill={deepBlue} stroke="none" />

      {/* 強靭な両脚 */}
      <rect x="86" y="194" width="26" height="28" rx="8" fill={cyanBody} />
      <rect x="148" y="194" width="26" height="28" rx="8" fill={cyanBody} />

      {/* ★ 湾曲する2本の巨大な悪魔角 ＆ 頭上のドクロ紋章 ★ */}
      <path d="M104 72 Q58 28, 44 58 Q68 58, 108 82 Z" fill={hornGold} />
      <path d="M156 72 Q202 28, 216 58 Q192 58, 152 82 Z" fill={hornGold} />

      {/* 破壊神の猛々しい頭部 */}
      <ellipse cx="130" cy="86" rx="36" ry="30" fill={cyanBody} />
      <circle cx="130" cy="62" r="9" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />

      {/* 邪悪に光る黄金の瞳と大口の牙 */}
      {!silhouette && (
        <g>
          <polygon points="106,78 122,84 110,92" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <polygon points="154,78 138,84 150,92" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
          <rect x="112" y="98" width="36" height="12" rx="4" fill="#991b1b" stroke="#0f172a" strokeWidth="2" />
          <polygon points="116,98 120,106 124,98" fill="#ffffff" stroke="none" />
          <polygon points="136,98 140,106 144,98" fill="#ffffff" stroke="none" />
        </g>
      )}
    </g>
  );
}

/** No.47 ダークドレアム (二刀流の巨大魔神剣、4本角の魔神兜、真紅のマント、筋骨隆々の破壊神) */
function DarkDreambSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const armorPurple = silhouette ? primary : '#4338ca';
  const capeRed = silhouette ? secondary : '#dc2626';
  const goldArmor = silhouette ? secondary : '#facc15';
  const bladeSilver = silhouette ? secondary : '#e2e8f0';
  const bladeGlow = silhouette ? secondary : '#38bdf8';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* ★ 背後に大きくひるがえる真紅の魔王マント ★ */}
      <path
        d="M84 102 C38 125, 26 185, 42 220 C85 208, 175 208, 218 220 C234 185, 222 125, 176 102 Z"
        fill={capeRed}
      />

      {/* ★ 左右に構えた超巨大な「二刀流の魔神剣 (DUAL DEMON GOD SWORDS)」 ★ */}
      {/* 左の大剣 */}
      <g>
        <polygon points="36,152 10,24 34,14 54,144" fill={bladeSilver} />
        {!silhouette && (
          <line x1="24" y1="22" x2="44" y2="144" stroke={bladeGlow} strokeWidth="3" />
        )}
        <rect x="26" y="144" width="36" height="10" rx="3" transform="rotate(-12 44 149)" fill={goldArmor} />
        <rect x="38" y="154" width="12" height="24" rx="3" transform="rotate(-12 44 166)" fill="#78350f" />
      </g>
      {/* 右の大剣 */}
      <g>
        <polygon points="224,152 250,24 226,14 206,144" fill={bladeSilver} />
        {!silhouette && (
          <line x1="236" y1="22" x2="216" y2="144" stroke={bladeGlow} strokeWidth="3" />
        )}
        <rect x="198" y="144" width="36" height="10" rx="3" transform="rotate(12 216 149)" fill={goldArmor} />
        <rect x="210" y="154" width="12" height="24" rx="3" transform="rotate(12 216 166)" fill="#78350f" />
      </g>

      {/* 鋼の重厚な両脚ブーツ */}
      <rect x="92" y="186" width="28" height="36" rx="6" fill={armorPurple} />
      <rect x="140" y="186" width="28" height="36" rx="6" fill={armorPurple} />
      <rect x="90" y="198" width="32" height="10" rx="3" fill={goldArmor} />
      <rect x="138" y="198" width="32" height="10" rx="3" fill={goldArmor} />

      {/* 鍛え抜かれた魔神の紫ボディ＆黄金のベルト・胸当て */}
      <polygon points="86,108 174,108 160,188 100,188" fill={armorPurple} />
      {/* 胸のクロス黄金アーマー */}
      <polygon points="92,110 168,110 138,152 122,152" fill={goldArmor} />
      <circle cx="130" cy="132" r="10" fill={capeRed} stroke="#ffffff" strokeWidth="2" />
      <rect x="96" y="174" width="68" height="14" rx="4" fill={goldArmor} />

      {/* 黄金のトゲ付き巨大肩アーマー（ショルダーパッド） */}
      <ellipse cx="80" cy="116" rx="24" ry="16" fill={goldArmor} />
      <polygon points="62,108 48,92 72,102" fill="#ffffff" />
      <ellipse cx="180" cy="116" rx="24" ry="16" fill={goldArmor} />
      <polygon points="198,108 212,92 188,102" fill="#ffffff" />

      {/* 剣を握る剛腕 */}
      <path d="M72 126 L44 152 L56 164 L86 140 Z" fill={armorPurple} />
      <path d="M188 126 L216 152 L204 164 L174 140 Z" fill={armorPurple} />

      {/* ★ ダークドレアム象徴の「4本角の黄金バイキング魔神兜」 ★ */}
      <path d="M102 68 Q62 32, 54 12 Q82 32, 110 58 Z" fill={goldArmor} />
      <path d="M98 80 Q58 64, 48 48 Q76 58, 104 74 Z" fill="#ffffff" />
      <path d="M158 68 Q198 32, 206 12 Q178 32, 150 58 Z" fill={goldArmor} />
      <path d="M162 80 Q202 64, 212 48 Q184 58, 156 74 Z" fill="#ffffff" />

      {/* 兜本体＆フェイスマスク */}
      <ellipse cx="130" cy="76" rx="32" ry="28" fill={armorPurple} />
      <polygon points="102,68 158,68 150,52 110,52" fill={goldArmor} />
      {/* 顎の白い髭・装甲 */}
      <polygon points="112,92 148,92 138,112 122,112" fill={bladeSilver} />

      {/* 兜の奥で眼光鋭く光る赤い双眸 */}
      {!silhouette && (
        <g>
          <polygon points="108,76 124,80 112,86" fill="#ef4444" stroke="#fef08a" strokeWidth="1.5" />
          <polygon points="152,76 136,80 148,86" fill="#ef4444" stroke="#fef08a" strokeWidth="1.5" />
        </g>
      )}
    </g>
  );
}

/** No.48 デスピサロ (エメラルドグリーンの4本腕の巨獣、トゲ甲殻、腹部の第二の魔眼フェイス) */
function DespisaroSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  const tealBody = silhouette ? primary : '#0d9488';
  const darkTeal = silhouette ? secondary : '#115e59';
  const hornYellow = silhouette ? secondary : '#fde047';
  const bellyRed = silhouette ? secondary : '#e11d48';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* ★ デスピサロ特有の「4本の巨大な剛腕」＆鋭い白爪 ★ */}
      {/* 上段の巨大腕 */}
      <path d="M88 112 L28 78 L18 98 L44 118 L86 132 Z" fill={tealBody} />
      <polygon points="18,98 8,92 14,106" fill="#ffffff" />
      <polygon points="24,106 14,104 20,114" fill="#ffffff" />

      <path d="M172 112 L232 78 L242 98 L216 118 L174 132 Z" fill={tealBody} />
      <polygon points="242,98 252,92 246,106" fill="#ffffff" />
      <polygon points="236,106 246,104 240,114" fill="#ffffff" />

      {/* 下段の剛腕 */}
      <path d="M88 148 L36 154 L42 172 L92 166 Z" fill={darkTeal} />
      <polygon points="36,154 24,152 32,164" fill="#ffffff" />
      <path d="M172 148 L224 154 L218 172 L168 166 Z" fill={darkTeal} />
      <polygon points="224,154 236,152 228,164" fill="#ffffff" />

      {/* 両肩の巨大なトゲ付き甲殻アーマー */}
      <ellipse cx="82" cy="108" rx="26" ry="18" fill={darkTeal} />
      <polygon points="68,94 56,72 80,90" fill={hornYellow} />
      <ellipse cx="178" cy="108" rx="26" ry="18" fill={darkTeal} />
      <polygon points="192,94 204,72 180,90" fill={hornYellow} />

      {/* 圧倒的な巨躯の胴体 */}
      <ellipse cx="130" cy="158" rx="50" ry="46" fill={tealBody} />

      {/* ★ 胸部・腹部に浮かび上がる不気味な「第二の魔眼フェイス」 ★ */}
      <ellipse cx="130" cy="162" rx="34" ry="26" fill={darkTeal} />
      {!silhouette && (
        <g>
          <polygon points="108,150 122,156 112,162" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
          <polygon points="152,150 138,156 148,162" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
          <path d="M110 172 Q130 182, 150 172" fill="none" stroke={bellyRed} strokeWidth="4" strokeLinecap="round" />
          <polygon points="116,172 120,180 124,172" fill="#ffffff" stroke="none" />
          <polygon points="136,172 140,180 144,172" fill="#ffffff" stroke="none" />
        </g>
      )}

      {/* 強靭な脚と巨爪 */}
      <rect x="82" y="192" width="28" height="30" rx="8" fill={tealBody} />
      <rect x="150" y="192" width="28" height="30" rx="8" fill={tealBody} />
      <polygon points="78,222 86,212 92,222" fill="#ffffff" />
      <polygon points="92,222 100,212 106,222" fill="#ffffff" />
      <polygon points="146,222 154,212 160,222" fill="#ffffff" />
      <polygon points="160,222 168,212 174,222" fill="#ffffff" />

      {/* ★ 頭上の長大な2本の大角＆トゲ冠 ★ */}
      <path d="M106 68 Q68 24, 52 16 Q82 40, 114 62 Z" fill={hornYellow} />
      <path d="M154 68 Q192 24, 208 16 Q178 40, 146 62 Z" fill={hornYellow} />
      <polygon points="130,38 122,60 138,60" fill={hornYellow} />

      {/* 魔族の王の頭部 */}
      <ellipse cx="130" cy="80" rx="30" ry="24" fill={tealBody} />

      {/* 紅く燃える魔眼 */}
      {!silhouette && (
        <g>
          <polygon points="110,74 124,78 114,84" fill="#ef4444" stroke="#0f172a" strokeWidth="1.5" />
          <polygon points="150,74 136,78 146,84" fill="#ef4444" stroke="#0f172a" strokeWidth="1.5" />
        </g>
      )}
    </g>
  );
}

/* ==========================================================================
   🪲 実在昆虫 16スタイル別SVGアートワーク (REAL INSECT SVGS)
   ========================================================================== */

/** 1. y-horn：日本のカブトムシ型（Y字4叉の頭角＋胸角、ツヤのある鞘翅） */
function YHornBeetleSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 6本の脚 */}
      <g stroke={secondary} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M85 130 Q50 120, 35 95 L25 105" />
        <path d="M175 130 Q210 120, 225 95 L235 105" />
        <path d="M80 155 Q45 155, 30 145 L22 155" />
        <path d="M180 155 Q215 155, 230 145 L238 155" />
        <path d="M85 180 Q55 195, 45 220 L35 225" />
        <path d="M175 180 Q205 195, 215 220 L225 225" />
      </g>
      {/* どっしりした腹部・鞘翅（Elytra） */}
      <ellipse cx="130" cy="165" rx="55" ry="48" fill={primary} />
      <line x1="130" y1="120" x2="130" y2="213" stroke={secondary} strokeWidth="3" />
      {!silhouette && (
        <path d="M100 135 Q115 175, 105 200" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.35" strokeLinecap="round" />
      )}
      {/* 前胸背板（Pronotum） */}
      <path d="M88 126 C88 95, 172 95, 172 126 Z" fill={secondary} />
      {/* 小さな胸角 */}
      <polygon points="124,106 130,82 136,106" fill={secondary} />
      {/* 頭部 */}
      <circle cx="130" cy="100" r="18" fill={primary} />
      {/* ★ 先端がY字（4叉）に分かれた立派な頭角 (Y-HORN) ★ */}
      <path d="M130 96 L130 36 L112 16 L104 22 L112 16 L110 8 L114 16 L130 32 L146 16 L148 8 L150 16 L158 22 L146 16 L130 36 Z" fill={secondary} />
      {!silhouette && (
        <g fill="#ef4444" stroke="#0f172a" strokeWidth="1.5">
          <circle cx="118" cy="98" r="3.5" />
          <circle cx="142" cy="98" r="3.5" />
        </g>
      )}
    </g>
  );
}

/** 2. long-horn：ヘラクレス・サタン型（超ロング胸角＆毛の生えた挟み角） */
function LongHornBeetleSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 脚 */}
      <g stroke={secondary} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M85 130 Q50 115, 30 85 L20 95" />
        <path d="M175 130 Q210 115, 230 85 L240 95" />
        <path d="M80 155 Q45 155, 28 145 L20 155" />
        <path d="M180 155 Q215 155, 232 145 L240 155" />
        <path d="M85 180 Q55 195, 42 225 L32 230" />
        <path d="M175 180 Q205 195, 218 225 L228 230" />
      </g>
      {/* 鞘翅（ヘラクレスの黄色・斑点、またはサタンの黒） */}
      <ellipse cx="130" cy="165" rx="55" ry="48" fill={primary} />
      <line x1="130" y1="120" x2="130" y2="213" stroke={secondary} strokeWidth="3" />
      {/* ヘラクレスの黒い斑点模様 */}
      {!silhouette && (
        <g fill="#1e293b" opacity="0.75" stroke="none">
          <circle cx="105" cy="150" r="5" />
          <circle cx="115" cy="175" r="6" />
          <circle cx="102" cy="190" r="4" />
          <circle cx="155" cy="150" r="5" />
          <circle cx="145" cy="175" r="6" />
          <circle cx="158" cy="190" r="4" />
        </g>
      )}
      {/* 前胸背板 */}
      <path d="M88 126 C88 95, 172 95, 172 126 Z" fill={secondary} />
      {/* 頭部 */}
      <circle cx="130" cy="100" r="18" fill={secondary} />
      {/* ★ 下の頭角（内側にトゲのある受け角） ★ */}
      <path d="M126 95 Q115 60, 128 35 Q130 55, 134 95 Z" fill={secondary} />
      <polygon points="126,52 136,55 128,62" fill={secondary} />
      {/* ★ 胸から前方へ長く伸びる超巨大胸角 (LONG HORN) ＆ オレンジ毛 ★ */}
      <path d="M125 110 Q122 35, 130 8 Q138 35, 135 110 Z" fill={secondary} />
      {!silhouette && (
        <path d="M124 45 Q125 75, 126 95" stroke="#f97316" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
      )}
      {!silhouette && (
        <g fill="#ef4444" stroke="#0f172a" strokeWidth="1.5">
          <circle cx="118" cy="100" r="3.5" />
          <circle cx="142" cy="100" r="3.5" />
        </g>
      )}
    </g>
  );
}

/** 3. three-horn：コーカサス・アトラス型（左右の湾曲長角＋頭角の合計3〜5本角） */
function ThreeHornBeetleSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <g stroke={secondary} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M85 130 Q45 115, 25 85 L15 95" />
        <path d="M175 130 Q215 115, 235 85 L245 95" />
        <path d="M80 155 Q45 155, 28 145 L20 155" />
        <path d="M180 155 Q215 155, 232 145 L240 155" />
        <path d="M85 180 Q55 195, 42 225 L32 230" />
        <path d="M175 180 Q205 195, 218 225 L228 230" />
      </g>
      <ellipse cx="130" cy="165" rx="56" ry="48" fill={primary} />
      <line x1="130" y1="120" x2="130" y2="213" stroke={secondary} strokeWidth="3" />
      <path d="M86 126 C86 92, 174 92, 174 126 Z" fill={secondary} />
      <circle cx="130" cy="100" r="18" fill={primary} />
      {/* ★ 左右の鋭い湾曲胸角 ★ */}
      <path d="M96 102 C70 65, 82 25, 108 18 C95 35, 102 70, 110 98 Z" fill={secondary} />
      <path d="M164 102 C190 65, 178 25, 152 18 C165 35, 158 70, 150 98 Z" fill={secondary} />
      {/* ★ 中央の長い頭角 ★ */}
      <path d="M125 96 Q122 45, 130 12 Q138 45, 135 96 Z" fill={secondary} />
      <polygon points="126,45 134,48 128,55" fill={secondary} />
      {!silhouette && (
        <g fill="#facc15" stroke="#0f172a" strokeWidth="1.5">
          <circle cx="118" cy="98" r="3.5" />
          <circle cx="142" cy="98" r="3.5" />
        </g>
      )}
    </g>
  );
}

/** 4. heavy-beetle：ゾウカブト・ゴライアス型（重戦車ボディ＆模様） */
function HeavyBeetleSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <g stroke={secondary} strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M78 135 Q40 120, 22 95 L15 105" />
        <path d="M182 135 Q220 120, 238 95 L245 105" />
        <path d="M75 160 Q38 160, 24 150 L16 160" />
        <path d="M185 160 Q222 160, 236 150 L244 160" />
        <path d="M78 185 Q48 200, 38 225 L28 230" />
        <path d="M182 185 Q212 200, 222 225 L232 230" />
      </g>
      {/* 重戦車級の極太ボディ */}
      <ellipse cx="130" cy="165" rx="64" ry="50" fill={primary} />
      <line x1="130" y1="120" x2="130" y2="215" stroke={secondary} strokeWidth="3.5" />
      {/* ゴライアスの白黒ストライプまたはゾウカブトの毛並み */}
      {!silhouette && (
        <g fill={accent} opacity="0.8" stroke="none">
          <path d="M90 135 Q110 170, 95 205 Q85 170, 90 135 Z" />
          <path d="M170 135 Q150 170, 165 205 Q175 170, 170 135 Z" />
        </g>
      )}
      <path d="M80 125 C80 88, 180 88, 180 125 Z" fill={secondary} />
      <circle cx="130" cy="98" r="22" fill={secondary} />
      {/* ゾウカブトの前方二叉シャベル角 */}
      <path d="M124 94 L120 45 L106 32 L114 26 L128 42 L132 42 L146 26 L154 32 L140 45 L136 94 Z" fill={secondary} />
      {!silhouette && (
        <g fill="#ef4444" stroke="#0f172a" strokeWidth="1.5">
          <circle cx="116" cy="98" r="4" />
          <circle cx="144" cy="98" r="4" />
        </g>
      )}
    </g>
  );
}

/** 5. o-jaw：オオクワガタ・パラワン型（極太内湾曲大アゴ＋内歯） */
function OJawStagSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <g stroke={secondary} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M85 130 Q45 115, 25 85 L15 95" />
        <path d="M175 130 Q215 115, 235 85 L245 95" />
        <path d="M80 155 Q45 155, 28 145 L20 155" />
        <path d="M180 155 Q215 155, 232 145 L240 155" />
        <path d="M85 180 Q55 195, 42 225 L32 230" />
        <path d="M175 180 Q205 195, 218 225 L228 230" />
      </g>
      <ellipse cx="130" cy="165" rx="55" ry="48" fill={primary} />
      <line x1="130" y1="120" x2="130" y2="213" stroke={secondary} strokeWidth="3" />
      <rect x="85" y="105" width="90" height="25" rx="6" fill={secondary} />
      {/* 幅広いクワガタ頭部 */}
      <rect x="92" y="80" width="76" height="30" rx="8" fill={secondary} />
      {/* 触角 */}
      <path d="M96 82 L82 72 L72 74" fill="none" stroke={secondary} strokeWidth="3" />
      <path d="M164 82 L178 72 L188 74" fill="none" stroke={secondary} strokeWidth="3" />
      {/* ★ 太く内側に丸く湾曲する大アゴ (O-JAW) ＆ 内歯 ★ */}
      <path d="M102 85 C82 55, 82 22, 118 18 C102 32, 105 58, 116 85 Z" fill={secondary} />
      <polygon points="98,42 114,48 104,56" fill={secondary} />
      <path d="M158 85 C178 55, 178 22, 142 18 C158 32, 155 58, 144 85 Z" fill={secondary} />
      <polygon points="162,42 146,48 156,56" fill={secondary} />
      {!silhouette && (
        <g fill="#facc15" stroke="#0f172a" strokeWidth="1.5">
          <circle cx="100" cy="94" r="3.5" />
          <circle cx="160" cy="94" r="3.5" />
        </g>
      )}
    </g>
  );
}

/** 6. long-jaw：ギラファ・オウゴンオニ型（超ロングギザギザ大アゴ） */
function LongJawStagSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <g stroke={secondary} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M85 130 Q45 115, 25 85 L15 95" />
        <path d="M175 130 Q215 115, 235 85 L245 95" />
        <path d="M80 155 Q45 155, 28 145 L20 155" />
        <path d="M180 155 Q215 155, 232 145 L240 155" />
        <path d="M85 180 Q55 195, 42 225 L32 230" />
        <path d="M175 180 Q205 195, 218 225 L228 230" />
      </g>
      <ellipse cx="130" cy="165" rx="52" ry="48" fill={primary} />
      <line x1="130" y1="120" x2="130" y2="213" stroke={secondary} strokeWidth="3" />
      <rect x="88" y="105" width="84" height="24" rx="6" fill={secondary} />
      <rect x="94" y="80" width="72" height="28" rx="8" fill={secondary} />
      {/* ★ 前方へ非常に長く伸びる大アゴ (LONG JAW) ＆ ギザギザ内歯 ★ */}
      <path d="M104 82 L76 10 L88 8 L114 82 Z" fill={secondary} />
      <polygon points="86,30 96,32 88,38" fill={secondary} />
      <polygon points="90,46 100,48 92,54" fill={secondary} />
      <polygon points="94,62 104,64 96,70" fill={secondary} />
      <path d="M156 82 L184 10 L172 8 L146 82 Z" fill={secondary} />
      <polygon points="174,30 164,32 172,38" fill={secondary} />
      <polygon points="170,46 160,48 168,54" fill={secondary} />
      <polygon points="166,62 156,64 164,70" fill={secondary} />
      {!silhouette && (
        <g fill="#facc15" stroke="#0f172a" strokeWidth="1.5">
          <circle cx="102" cy="94" r="3.5" />
          <circle cx="158" cy="94" r="3.5" />
        </g>
      )}
    </g>
  );
}

/** 7. curved-jaw：ノコギリ・ニジイロ型（水牛型湾曲アゴ） */
function CurvedJawStagSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <g stroke={secondary} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M85 130 Q45 115, 25 85 L15 95" />
        <path d="M175 130 Q215 115, 235 85 L245 95" />
        <path d="M80 155 Q45 155, 28 145 L20 155" />
        <path d="M180 155 Q215 155, 232 145 L240 155" />
        <path d="M85 180 Q55 195, 42 225 L32 230" />
        <path d="M175 180 Q205 195, 218 225 L228 230" />
      </g>
      {/* 虹色・赤褐色ボディ */}
      <ellipse cx="130" cy="165" rx="54" ry="48" fill={primary} />
      <line x1="130" y1="120" x2="130" y2="213" stroke={secondary} strokeWidth="3" />
      {!silhouette && (
        <ellipse cx="130" cy="165" rx="36" ry="32" fill={accent} opacity="0.3" stroke="none" />
      )}
      <rect x="88" y="105" width="84" height="24" rx="6" fill={secondary} />
      <rect x="94" y="80" width="72" height="28" rx="8" fill={secondary} />
      {/* ★ 水牛の角のように大きく湾曲する大アゴ ★ */}
      <path d="M102 85 C70 58, 80 16, 122 12 C96 22, 94 56, 114 85 Z" fill={secondary} />
      <path d="M158 85 C190 58, 180 16, 138 12 C164 22, 166 56, 146 85 Z" fill={secondary} />
      {!silhouette && (
        <g fill="#ef4444" stroke="#0f172a" strokeWidth="1.5">
          <circle cx="102" cy="94" r="3.5" />
          <circle cx="158" cy="94" r="3.5" />
        </g>
      )}
    </g>
  );
}

/** 8. crown-jaw：ミヤマクワガタ型（頭部王冠突起＋大アゴ＋微毛） */
function CrownJawStagSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <g stroke={secondary} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M85 130 Q45 115, 25 85 L15 95" />
        <path d="M175 130 Q215 115, 235 85 L245 95" />
        <path d="M80 155 Q45 155, 28 145 L20 155" />
        <path d="M180 155 Q215 155, 232 145 L240 155" />
        <path d="M85 180 Q55 195, 42 225 L32 230" />
        <path d="M175 180 Q205 195, 218 225 L228 230" />
      </g>
      <ellipse cx="130" cy="165" rx="54" ry="48" fill={primary} />
      <line x1="130" y1="120" x2="130" y2="213" stroke={secondary} strokeWidth="3" />
      <rect x="88" y="105" width="84" height="24" rx="6" fill={secondary} />
      {/* ★ ミヤマ特有の王冠突起（頭の後ろの耳状突起） ★ */}
      <polygon points="90,105 82,78 108,82 130,86 152,82 178,78 170,105" fill={secondary} />
      <rect x="96" y="78" width="68" height="26" rx="6" fill={primary} />
      {/* 大アゴ */}
      <path d="M104 80 C80 50, 90 20, 116 18 C102 30, 102 55, 114 80 Z" fill={secondary} />
      <path d="M156 80 C180 50, 170 20, 144 18 C158 30, 158 55, 146 80 Z" fill={secondary} />
      {!silhouette && (
        <g fill="#facc15" stroke="#0f172a" strokeWidth="1.5">
          <circle cx="100" cy="92" r="3.5" />
          <circle cx="160" cy="92" r="3.5" />
        </g>
      )}
    </g>
  );
}

/** 9. mantis：カマキリ型（逆三角形頭＋巨大な2本カマ） */
function MantisSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 4本の中後脚 */}
      <g stroke={secondary} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M110 145 Q70 160, 45 205" />
        <path d="M150 145 Q190 160, 215 205" />
        <path d="M115 175 Q80 200, 60 235" />
        <path d="M145 175 Q180 200, 200 235" />
      </g>
      {/* 細長い胸・腹部と翅 */}
      <ellipse cx="130" cy="180" rx="34" ry="45" fill={primary} />
      <path d="M124 100 L122 145 L138 145 L136 100 Z" fill={secondary} />
      {/* ★ 2本の巨大な捕獲カマ (RAPTORIAL FORELEGS) ★ */}
      <g fill={secondary}>
        {/* 左カマ（画面向かって左） */}
        <path d="M122 105 L85 85 L70 120 L80 135 L90 105 Z" />
        <polygon points="70,120 55,100 68,110" fill={accent} />
        {/* 右カマ（画面向かって右） */}
        <path d="M138 105 L175 85 L190 120 L180 135 L170 105 Z" />
        <polygon points="190,120 205,100 192,110" fill={accent} />
      </g>
      {/* 逆三角形の頭部 */}
      <polygon points="110,65 150,65 130,95" fill={primary} />
      {/* 長い触角 */}
      <line x1="122" y1="65" x2="105" y2="25" stroke={secondary} strokeWidth="2.5" />
      <line x1="138" y1="65" x2="155" y2="25" stroke={secondary} strokeWidth="2.5" />
      {/* 巨大な複眼 */}
      {!silhouette && (
        <g fill="#22c55e" stroke="#0f172a" strokeWidth="2">
          <circle cx="112" cy="68" r="8" />
          <circle cx="148" cy="68" r="8" />
          <circle cx="112" cy="68" r="3" fill="#0f172a" stroke="none" />
          <circle cx="148" cy="68" r="3" fill="#0f172a" stroke="none" />
        </g>
      )}
    </g>
  );
}

/** 10. hornet：スズメバチ型（縞模様腹部＋毒針＋高速翅） */
function HornetSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 透明な4枚翅 */}
      <g fill="#fef08a" opacity="0.65" stroke={outline} strokeWidth="2">
        <path d="M115 105 C70 55, 30 50, 20 70 C40 95, 80 110, 115 110 Z" />
        <path d="M145 105 C190 55, 230 50, 240 70 C220 95, 180 110, 145 110 Z" />
        <path d="M115 115 C75 105, 45 115, 40 130 C65 140, 95 135, 115 120 Z" />
        <path d="M145 115 C185 105, 215 115, 220 130 C195 140, 165 135, 145 120 Z" />
      </g>
      {/* 脚 */}
      <g stroke={secondary} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M110 120 Q80 140, 65 170" />
        <path d="M150 120 Q180 140, 195 170" />
      </g>
      {/* ★ 黄黒のしま模様腹部 ＆ 毒針 ★ */}
      <ellipse cx="130" cy="165" rx="38" ry="46" fill={primary} />
      {!silhouette && (
        <g fill="#0f172a" stroke="none">
          <ellipse cx="130" cy="142" rx="34" ry="7" />
          <ellipse cx="130" cy="162" rx="37" ry="8" />
          <ellipse cx="130" cy="182" rx="33" ry="8" />
        </g>
      )}
      {/* 鋭い毒針 */}
      <polygon points="126,208 134,208 130,230" fill="#0f172a" />
      {/* 胸部 */}
      <circle cx="130" cy="112" r="22" fill="#0f172a" />
      {/* 頭部 */}
      <circle cx="130" cy="74" r="22" fill={primary} />
      {/* 触角 */}
      <path d="M124 60 L112 40 L104 44" fill="none" stroke="#0f172a" strokeWidth="3" />
      <path d="M136 60 L148 40 L156 44" fill="none" stroke="#0f172a" strokeWidth="3" />
      {/* 三日月型の黒い複眼 */}
      {!silhouette && (
        <g fill="#0f172a">
          <path d="M116 66 C112 72, 112 80, 118 84 C115 80, 115 72, 116 66 Z" />
          <path d="M144 66 C148 72, 148 80, 142 84 C145 80, 145 72, 144 66 Z" />
        </g>
      )}
    </g>
  );
}

/** 11. aquatic：タガメ・ゲンゴロウ型（水生流線型ボディ＋捕獲脚・遊泳脚） */
function AquaticBugSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* オール状の毛深い遊泳脚 */}
      <g stroke={secondary} strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M90 170 Q55 195, 30 220" />
        <path d="M170 170 Q205 195, 230 220" />
      </g>
      {/* 流線型ボディ */}
      <ellipse cx="130" cy="155" rx="54" ry="50" fill={primary} />
      <line x1="130" y1="108" x2="130" y2="204" stroke={secondary} strokeWidth="3" />
      {/* 呼吸管（タガメ） */}
      <rect x="126" y="202" width="8" height="22" rx="3" fill={secondary} />
      {/* 前胸背板 */}
      <path d="M88 116 C88 88, 172 88, 172 116 Z" fill={secondary} />
      {/* ★ タガメの強力な捕獲前足 ★ */}
      <path d="M96 95 C65 80, 55 50, 75 40 C65 60, 80 75, 105 85 Z" fill={secondary} />
      <path d="M164 95 C195 80, 205 50, 185 40 C195 60, 180 75, 155 85 Z" fill={secondary} />
      <circle cx="130" cy="85" r="16" fill={primary} />
      {!silhouette && (
        <g fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5">
          <circle cx="120" cy="84" r="4" />
          <circle cx="140" cy="84" r="4" />
        </g>
      )}
    </g>
  );
}

/** 12. ladybug-jewel：テントウムシ・タマムシ・プラチナコガネ型（丸殻・星・鏡面反射） */
function LadybugJewelSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 脚 */}
      <g stroke={secondary} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M85 130 Q55 115, 38 98" />
        <path d="M175 130 Q205 115, 222 98" />
        <path d="M80 155 Q50 155, 32 150" />
        <path d="M180 155 Q210 155, 228 150" />
        <path d="M85 180 Q58 200, 48 220" />
        <path d="M175 180 Q202 200, 212 220" />
      </g>
      {/* まあるい甲殻 */}
      <ellipse cx="130" cy="155" rx="60" ry="54" fill={primary} />
      <line x1="130" y1="104" x2="130" y2="208" stroke="#0f172a" strokeWidth="3.5" />
      {/* ナナホシテントウの7つの星、またはタマムシのストライプ */}
      {!silhouette && (
        <g fill="#0f172a" stroke="none">
          <circle cx="102" cy="135" r="8" />
          <circle cx="158" cy="135" r="8" />
          <circle cx="92" cy="165" r="9" />
          <circle cx="168" cy="165" r="9" />
          <circle cx="108" cy="190" r="7.5" />
          <circle cx="152" cy="190" r="7.5" />
          <circle cx="130" cy="116" r="6" />
        </g>
      )}
      {/* 光沢ハイライト */}
      {!silhouette && (
        <path d="M85 130 Q105 165, 88 185" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.6" strokeLinecap="round" />
      )}
      {/* 頭部 */}
      <path d="M96 106 C96 80, 164 80, 164 106 Z" fill="#0f172a" />
      {!silhouette && (
        <g fill="#ffffff" stroke="none">
          <circle cx="106" cy="98" r="4" />
          <circle cx="154" cy="98" r="4" />
        </g>
      )}
    </g>
  );
}

/** 13. dragonfly：オニヤンマ・ギンヤンマ型（水平4枚長翅＋複眼＋細長腹） */
function DragonflySvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* ★ 水平に広がる4枚の透明網目翅 (DRAGONFLY WINGS) ★ */}
      <g fill="#e0f2fe" opacity="0.75" stroke={outline} strokeWidth="2">
        <path d="M120 95 C75 75, 10 75, 4 90 C15 105, 75 105, 120 100 Z" />
        <path d="M140 95 C185 75, 250 75, 256 90 C245 105, 185 105, 140 100 Z" />
        <path d="M122 104 C80 110, 20 115, 16 128 C30 138, 85 125, 122 110 Z" />
        <path d="M138 104 C180 110, 240 115, 244 128 C230 138, 175 125, 138 110 Z" />
      </g>
      {/* 細長い縞模様の腹部 */}
      <rect x="124" y="110" width="12" height="120" rx="6" fill={primary} />
      {!silhouette && (
        <g fill={secondary} stroke="none">
          <rect x="124" y="130" width="12" height="8" />
          <rect x="124" y="150" width="12" height="8" />
          <rect x="124" y="170" width="12" height="8" />
          <rect x="124" y="190" width="12" height="8" />
          <rect x="124" y="210" width="12" height="8" />
        </g>
      )}
      {/* 胸部 */}
      <ellipse cx="130" cy="100" rx="16" ry="18" fill={secondary} />
      {/* ★ 巨大なエメラルドグリーンの複眼 ★ */}
      <circle cx="120" cy="76" r="14" fill={accent} />
      <circle cx="140" cy="76" r="14" fill={accent} />
      {!silhouette && (
        <g fill="#ffffff" opacity="0.6" stroke="none">
          <circle cx="118" cy="72" r="4" />
          <circle cx="138" cy="72" r="4" />
        </g>
      )}
    </g>
  );
}

/** 14. butterfly：モルフォ・トリバネ・オオムラサキ型（華麗な大羽） */
function ButterflySvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 前翅（左右） */}
      <path d="M125 110 C95 40, 30 15, 15 45 C5 75, 45 120, 120 125 Z" fill={primary} />
      <path d="M135 110 C165 40, 230 15, 245 45 C255 75, 215 120, 140 125 Z" fill={primary} />
      {/* 後翅（左右・尾状突起） */}
      <path d="M125 125 C85 130, 45 155, 60 195 C75 220, 115 195, 125 160 Z" fill={secondary} />
      <path d="M135 125 C175 130, 215 155, 200 195 C185 220, 145 195, 135 160 Z" fill={secondary} />
      {/* 翅の紋様・輝き */}
      {!silhouette && (
        <g fill={accent} opacity="0.75" stroke="none">
          <ellipse cx="80" cy="80" rx="28" ry="16" transform="rotate(-30 80 80)" />
          <ellipse cx="180" cy="80" rx="28" ry="16" transform="rotate(30 180 80)" />
          <circle cx="85" cy="175" r="8" />
          <circle cx="175" cy="175" r="8" />
        </g>
      )}
      {/* チョウの胴体 */}
      <rect x="126" y="90" width="8" height="75" rx="4" fill="#0f172a" />
      {/* 頭部＆ストロー口・触角 */}
      <circle cx="130" cy="85" r="7" fill="#0f172a" />
      <path d="M127 80 Q112 50, 95 42" fill="none" stroke="#0f172a" strokeWidth="2.5" />
      <circle cx="94" cy="42" r="3" fill="#0f172a" />
      <path d="M133 80 Q148 50, 165 42" fill="none" stroke="#0f172a" strokeWidth="2.5" />
      <circle cx="166" cy="42" r="3" fill="#0f172a" />
    </g>
  );
}

/** 15. hopper：トノサマバッタ型（強靭なジャンプ後脚＋バッタ頭） */
function GrasshopperSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {/* 前中脚 */}
      <g stroke={secondary} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M110 145 Q80 165, 65 195" />
        <path d="M135 145 Q165 165, 180 195" />
      </g>
      {/* 翅と胴体 */}
      <path d="M115 110 L95 195 L145 195 L135 110 Z" fill={primary} />
      {/* ★ 巨大な跳躍後脚 (POWERFUL JUMPING LEGS) ★ */}
      <g fill={primary} stroke={outline} strokeWidth="3.5">
        <path d="M105 145 Q75 90, 68 70 Q82 95, 102 155 Z" />
        <path d="M68 70 Q60 135, 45 220" fill="none" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
        <path d="M145 145 Q175 90, 182 70 Q168 95, 148 155 Z" />
        <path d="M182 70 Q190 135, 205 220" fill="none" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* 頭部 */}
      <path d="M112 115 L110 82 L150 82 L148 115 Z" fill={secondary} />
      <line x1="122" y1="82" x2="108" y2="45" stroke={secondary} strokeWidth="2.5" />
      <line x1="138" y1="82" x2="152" y2="45" stroke={secondary} strokeWidth="2.5" />
      {!silhouette && (
        <g fill="#facc15" stroke="#0f172a" strokeWidth="2">
          <ellipse cx="118" cy="92" rx="5" ry="7" />
          <ellipse cx="142" cy="92" rx="5" ry="7" />
        </g>
      )}
    </g>
  );
}

/** 16. cicada：クマゼミ型（透明翅脈羽＋幅広い頭部） */
function CicadaSvg({ primary, secondary, accent, eyeColor, outline, silhouette }: SvgPartProps) {
  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <g stroke={secondary} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M90 130 Q60 135, 42 125" />
        <path d="M170 130 Q200 135, 218 125" />
        <path d="M92 150 Q65 170, 50 185" />
        <path d="M168 150 Q195 170, 210 185" />
      </g>
      {/* がっしりした腹部 */}
      <ellipse cx="130" cy="155" rx="42" ry="46" fill="#0f172a" />
      {/* ★ 屋根型に畳まれた大きな透明翅 (CICADA WINGS) ★ */}
      <g fill="#38bdf8" opacity="0.55" stroke={outline} strokeWidth="2.5">
        <path d="M125 105 C75 115, 50 160, 68 215 C85 225, 120 180, 126 135 Z" />
        <path d="M135 105 C185 115, 210 160, 192 215 C175 225, 140 180, 134 135 Z" />
      </g>
      {/* 幅広い頭部 */}
      <path d="M95 108 L90 85 L170 85 L165 108 Z" fill={primary} />
      {/* 左右に離れた大きな複眼 */}
      <circle cx="92" cy="92" r="12" fill={secondary} />
      <circle cx="168" cy="92" r="12" fill={secondary} />
      {!silhouette && (
        <g fill="#ef4444" stroke="none">
          <circle cx="124" cy="88" r="2" />
          <circle cx="130" cy="86" r="2" />
          <circle cx="136" cy="88" r="2" />
        </g>
      )}
    </g>
  );
}

/* ==========================================================================
   怪獣イラストディスパッチャーコンポーネント
   ========================================================================== */
function KaijuSpecificSvgDispatcher({
  resolvedId,
  partProps,
  insectStyle,
}: {
  resolvedId: string;
  partProps: SvgPartProps;
  insectStyle?: InsectVisualStyle;
}) {
  // 🪲 昆虫スタイルの判定（16スタイル）
  if (insectStyle) {
    switch (insectStyle) {
      case 'y-horn':
        return <YHornBeetleSvg {...partProps} />;
      case 'long-horn':
        return <LongHornBeetleSvg {...partProps} />;
      case 'three-horn':
        return <ThreeHornBeetleSvg {...partProps} />;
      case 'heavy-beetle':
        return <HeavyBeetleSvg {...partProps} />;
      case 'o-jaw':
        return <OJawStagSvg {...partProps} />;
      case 'long-jaw':
        return <LongJawStagSvg {...partProps} />;
      case 'curved-jaw':
        return <CurvedJawStagSvg {...partProps} />;
      case 'crown-jaw':
        return <CrownJawStagSvg {...partProps} />;
      case 'mantis':
        return <MantisSvg {...partProps} />;
      case 'hornet':
        return <HornetSvg {...partProps} />;
      case 'aquatic':
        return <AquaticBugSvg {...partProps} />;
      case 'ladybug-jewel':
        return <LadybugJewelSvg {...partProps} />;
      case 'dragonfly':
        return <DragonflySvg {...partProps} />;
      case 'butterfly':
        return <ButterflySvg {...partProps} />;
      case 'hopper':
        return <GrasshopperSvg {...partProps} />;
      case 'cicada':
        return <CicadaSvg {...partProps} />;
    }
  }

  // 🦖 怪獣・鳥山明コラボの判定（No.1〜No.24）
  switch (resolvedId) {
    // 🦖 きょうりゅう
    case 'fire-dino':
      return <MagmaTyrannoSvg {...partProps} />;
    case 'water-dino':
      return <AquaSpinoSvg {...partProps} />;
    case 'thunder-dino':
      return <ThunderRexSvg {...partProps} />;
    case 'nature-dino':
      return <GaiaTriceraSvg {...partProps} />;
    case 'nature-dino-2':
      return <AncientGaiaRexSvg {...partProps} />;

    // 🐉 ドラゴン
    case 'fire-dragon':
      return <BurningDragoSvg {...partProps} />;
    case 'water-dragon':
      return <PoseidonDragoSvg {...partProps} />;
    case 'thunder-dragon':
      return <InazumaDragoSvg {...partProps} />;
    case 'nature-dragon':
      return <EmeraldDragoSvg {...partProps} />;
    case 'fire-dragon-2':
      return <MeteorRexDragoSvg {...partProps} />;

    // 🤖 ロボット
    case 'fire-robot':
      return <BlazeKaiserSvg {...partProps} />;
    case 'water-robot':
      return <HydroMechaOhSvg {...partProps} />;
    case 'thunder-robot':
      return <BoltTitanSvg {...partProps} />;
    case 'nature-robot':
      return <ForestGuardianSvg {...partProps} />;
    case 'water-robot-2':
      return <AbyssPoseidonRoboSvg {...partProps} />;

    // 🦁 ビースト
    case 'fire-beast':
      return <FlameLeoSvg {...partProps} />;
    case 'water-beast':
      return <SplashWolfSvg {...partProps} />;
    case 'thunder-beast':
      return <RaijinTigerSvg {...partProps} />;
    case 'nature-beast':
      return <JungleKongSvg {...partProps} />;
    case 'thunder-beast-2':
      return <GodThunderFenrirSvg {...partProps} />;

    // 💥 鳥山明風コラボ怪獣 ＆ 新追加レジェンド怪獣
    case 'fire-db-tyranno':
      return <SuperTyrannoSvg {...partProps} />;
    case 'water-arale-robo':
      return <CapsulePoppoSvg {...partProps} />;
    case 'thunder-db-dragon':
      return <ScouterDragoSvg {...partProps} />;
    case 'nature-arale-gatchan':
      return <GatchaBeastSvg {...partProps} />;
    case 'fire-goku-beast':
      return <KintoGokuBeastSvg {...partProps} />;
    case 'water-plesio-dino':
      return <BlizzardPlesioSvg {...partProps} />;
    case 'thunder-shogun-robo':
      return <RaijinShogunRoboSvg {...partProps} />;
    case 'nature-crystal-dragon':
      return <CrystalShenronSvg {...partProps} />;

    // ⚡ ポケモン風モンスター 8体
    case 'fire-pkmn-salamander':
      return <SalamandraSvg {...partProps} />;
    case 'fire-pkmn-fox':
      return <HinoKitsuneSvg {...partProps} />;
    case 'water-pkmn-turtle':
      return <AquaKamedonSvg {...partProps} />;
    case 'water-pkmn-dragon':
      return <AquaKairyuSvg {...partProps} />;
    case 'thunder-pkmn-mouse':
      return <BoltChuSvg {...partProps} />;
    case 'thunder-pkmn-gear':
      return <PlasmaGearSvg {...partProps} />;
    case 'nature-pkmn-brachio':
      return <HanaBrachioSvg {...partProps} />;
    case 'nature-pkmn-golem':
      return <ForestGolemSvg {...partProps} />;

    // ⭐ じょうくん大興奮！大人気ポケモン・スーパースター 8体
    case 'fire-pkmn-charizard':
      return <CharizardSvg {...partProps} />;
    case 'fire-pkmn-scorbunny':
      return <ScorbunnySvg {...partProps} />;
    case 'water-pkmn-greninja':
      return <GreninjaSvg {...partProps} />;
    case 'water-pkmn-piplup':
      return <PiplupSvg {...partProps} />;
    case 'thunder-pkmn-lucario':
      return <LucarioSvg {...partProps} />;
    case 'thunder-pkmn-miraidon':
    case 'thunder-pkmn-pikachu':
      return <MiraidonSvg {...partProps} />;
    case 'nature-pkmn-eevee':
      return <EeveeSvg {...partProps} />;
    case 'nature-pkmn-bulbasaur':
      return <BulbasaurSvg {...partProps} />;

    // ⭐ 追加ポケモン・スーパースター 4体
    case 'fire-pkmn-koraidon':
      return <KoraidonSvg {...partProps} />;
    case 'water-pkmn-gyarados':
      return <GyaradosSvg {...partProps} />;
    case 'thunder-pkmn-rayquaza':
      return <RayquazaSvg {...partProps} />;
    case 'nature-pkmn-sprigatito':
      return <SprigatitoSvg {...partProps} />;

    // 🦸 アベンジャーズ・伝説のスーパーヒーロー怪獣 4体
    case 'fire-avengers-ironman':
      return <IronManSvg {...partProps} />;
    case 'water-avengers-captain':
      return <CaptainAmericaSvg {...partProps} />;
    case 'thunder-avengers-thor':
      return <ThorSvg {...partProps} />;
    case 'nature-avengers-spiderman':
      return <SpiderManSvg {...partProps} />;

    // 😈 ドラクエ風・伝説の4大魔王
    case 'fire-dq-ryuo':
      return <RyuoSvg {...partProps} />;
    case 'water-dq-hargon':
      return <HargonSidohSvg {...partProps} />;
    case 'thunder-dq-dreamb':
      return <DarkDreambSvg {...partProps} />;
    case 'nature-dq-pisaro':
      return <DespisaroSvg {...partProps} />;

    default:
      if (resolvedId.includes('kabuto')) return <YHornBeetleSvg {...partProps} />;
      if (resolvedId.includes('kuwagata')) return <OJawStagSvg {...partProps} />;
      if (resolvedId.includes('hunter')) return <MantisSvg {...partProps} />;
      if (resolvedId.includes('flier')) return <DragonflySvg {...partProps} />;
      if (resolvedId.includes('dino')) return <MagmaTyrannoSvg {...partProps} />;
      if (resolvedId.includes('dragon')) return <BurningDragoSvg {...partProps} />;
      if (resolvedId.includes('robot')) return <BlazeKaiserSvg {...partProps} />;
      return <FlameLeoSvg {...partProps} />;
  }
}

/**
 * 属性×タイプ＋怪獣ID＋進化段階に応じた完全個別怪獣SVGイラスト
 */
export function KaijuSvgIllustration({
  element,
  type,
  kaijuId,
  category,
  insectStyle,
  realColors,
  silhouette = false,
  isAttacking = false,
  isFloating = false,
  evolutionStage = 2,
  isDamaged = false,
  flipHorizontal = false,
  className = 'w-full h-full',
}: KaijuArtProps) {
  const elMeta = getElementMeta(element);

  const primary = silhouette
    ? '#475569'
    : realColors?.primary ?? elMeta.primaryHex;
  const secondary = silhouette
    ? '#64748b'
    : realColors?.secondary ?? elMeta.secondaryHex;
  const accent = silhouette
    ? '#94a3b8'
    : realColors?.accent ?? elMeta.accentHex;
  const eyeColor = silhouette ? '#cbd5e1' : '#fef08a';
  const outline = silhouette ? '#cbd5e1' : '#ffffff';

  const resolvedId = kaijuId || `${element}-${type}`;

  const stageScaleClass =
    evolutionStage === 1
      ? 'scale-90'
      : evolutionStage === 3
      ? 'scale-105'
      : 'scale-100';

  const partProps: SvgPartProps = {
    primary,
    secondary,
    accent,
    eyeColor,
    outline,
    silhouette,
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none ${
        isDamaged ? 'animate-damage-shake' : ''
      } ${className}`}
    >
      {/* 背面の属性エネルギー陣 */}
      {!silhouette && (
        <div
          className={`absolute inset-2 rounded-full blur-xl transition-transform duration-300 ${
            isAttacking
              ? 'scale-125 opacity-100'
              : evolutionStage === 3
              ? 'scale-115 opacity-95'
              : 'scale-100 opacity-65'
          }`}
          style={{
            background:
              evolutionStage === 3
                ? `radial-gradient(circle, #fef08a 0%, ${accent} 40%, ${primary} 75%, transparent 100%)`
                : `radial-gradient(circle, ${accent} 0%, ${primary} 65%, transparent 100%)`,
          }}
        />
      )}

      <div
        className={`w-full h-full flex items-center justify-center ${flipHorizontal ? 'scale-x-[-1]' : ''}`}
      >
        <svg
          viewBox="0 0 260 260"
          className={`w-full h-full relative z-10 transition-transform duration-200 ${stageScaleClass} ${
            isAttacking ? 'scale-110 animate-float' : isFloating ? 'animate-float' : ''
          } ${
            silhouette
              ? 'opacity-90'
              : 'drop-shadow-[0_10px_18px_rgba(0,0,0,0.65)]'
          }`}
          style={silhouette ? { filter: 'grayscale(100%) brightness(85%) contrast(110%)' } : undefined}
        >
          {/* Stage 2 & 3 共通の属性エフェクト背景リング */}
          {!silhouette && evolutionStage >= 2 && (
            <g opacity={evolutionStage === 3 ? '0.85' : '0.45'}>
              <circle
                cx="130"
                cy="135"
                r="96"
                fill="none"
                stroke={evolutionStage === 3 ? '#facc15' : accent}
                strokeWidth={evolutionStage === 3 ? '4' : '3'}
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

          {/* Stage 3（究極キング期）：黄金のゴッドオーラ＆多重魔法陣 */}
          {!silhouette && evolutionStage === 3 && (
            <g opacity="0.9">
              <circle
                cx="130"
                cy="135"
                r="112"
                fill="none"
                stroke="#fef08a"
                strokeWidth="3.5"
                strokeDasharray="6 10"
              />
              {/* 黄金の後光スターバースト */}
              <polygon
                points="130,10 144,45 180,22 162,58 205,52 175,82 218,95 178,112 130,135 82,112 42,95 85,82 55,52 98,58 80,22 116,45"
                fill="rgba(250, 204, 21, 0.22)"
                stroke="#facc15"
                strokeWidth="2"
              />
            </g>
          )}

          {/* 各怪獣専用のグラフィックを描画 */}
          <KaijuSpecificSvgDispatcher resolvedId={resolvedId} partProps={partProps} insectStyle={insectStyle} />

          {/* Stage 1（キッズ期）：頭上の可愛いキラキラ星 */}
          {!silhouette && evolutionStage === 1 && (
            <g fill="#fef08a" stroke="#f59e0b" strokeWidth="2">
              <circle cx="52" cy="48" r="6" />
              <circle cx="208" cy="48" r="6" />
              <circle cx="130" cy="22" r="7" fill="#4ade80" stroke="#ffffff" />
            </g>
          )}

          {/* Stage 3（究極キング期）：黄金のキングクラウン（王冠）＆覚醒スパーク */}
          {!silhouette && evolutionStage === 3 && (
            <g>
              <polygon
                points="92,42 100,12 116,28 130,6 144,28 160,12 168,42"
                fill="#facc15"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <rect
                x="92"
                y="38"
                width="76"
                height="9"
                rx="3"
                fill="#eab308"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <circle cx="130" cy="30" r="5.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.8" />
              <circle cx="109" cy="33" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="151" cy="33" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

              <g stroke="#fef08a" strokeWidth="3.5" fill="#facc15">
                <polygon points="24,68 42,52 34,76 48,78 26,96 32,76" />
                <polygon points="236,68 218,52 226,76 212,78 234,96 228,76" />
                <circle cx="38" cy="185" r="5" />
                <circle cx="222" cy="185" r="5" />
              </g>
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
    </div>
  );
}
