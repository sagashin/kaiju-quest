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
      <div className={`relative flex items-center justify-center select-none ${isShaking ? 'animate-egg-shake' : 'animate-float'}`}>
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

export interface KaijuArtProps {
  element: ElementId;
  type: KaijuTypeId;
  kaijuId?: string;
  category?: CreatureCategory;
  insectStyle?: InsectVisualStyle;
  realColors?: { primary: string; secondary: string; accent: string };
  silhouette?: boolean;
  isAttacking?: boolean;
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

    // 💥 鳥山明風コラボ怪獣
    case 'fire-db-tyranno':
      return <SuperTyrannoSvg {...partProps} />;
    case 'water-arale-robo':
      return <CapsulePoppoSvg {...partProps} />;
    case 'thunder-db-dragon':
      return <ScouterDragoSvg {...partProps} />;
    case 'nature-arale-gatchan':
      return <GatchaBeastSvg {...partProps} />;

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
  evolutionStage = 2,
  isDamaged = false,
  flipHorizontal = false,
  className = 'w-full h-full',
}: KaijuArtProps) {
  const elMeta = getElementMeta(element);

  const primary = silhouette
    ? '#1e293b'
    : realColors?.primary ?? elMeta.primaryHex;
  const secondary = silhouette
    ? '#334155'
    : realColors?.secondary ?? elMeta.secondaryHex;
  const accent = silhouette
    ? '#475569'
    : realColors?.accent ?? elMeta.accentHex;
  const eyeColor = silhouette ? '#0f172a' : '#fef08a';
  const outline = silhouette ? '#475569' : '#ffffff';

  const resolvedId = kaijuId || `${element}-${type}`;

  const stageScaleClass =
    evolutionStage === 1
      ? 'scale-90'
      : evolutionStage === 3
      ? 'scale-105 animate-evo-glow'
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

      {/* Stage 1 キッズ期の可愛い新米マークバッジ */}
      {!silhouette && evolutionStage === 1 && (
        <div className="absolute -top-1 right-1 z-20 bg-emerald-950/90 border-2 border-emerald-300 text-emerald-200 text-xs font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5 pointer-events-none">
          <span>🌱</span>
          <span>キッズ</span>
        </div>
      )}

      <div className={`w-full h-full flex items-center justify-center ${flipHorizontal ? 'scale-x-[-1]' : ''}`}>
        <svg
          viewBox="0 0 260 260"
          className={`w-full h-full relative z-10 drop-shadow-[0_10px_18px_rgba(0,0,0,0.65)] transition-transform duration-200 ${stageScaleClass} ${
            isAttacking ? 'scale-110' : 'animate-float'
          }`}
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
