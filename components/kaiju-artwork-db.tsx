'use client';

import React from 'react';

export interface DbSvgPartProps {
  primary: string;
  secondary: string;
  accent: string;
  eyeColor: string;
  outline: string;
  silhouette: boolean;
}

/** No.171 孫悟飯 (孫悟飯ビースト・銀髪超ロング・赤い瞳・紫の魔族道着・魔貫光殺砲) */
export function GohanSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const giPurple = silhouette ? primary : '#6b21a8';
  const hairSilver = silhouette ? secondary : '#e2e8f0';
  const eyeRed = silhouette ? accent : '#ef4444';
  const skinTan = silhouette ? accent : '#fed7aa';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <path d="M102 164 L92 224 L124 224 L126 172 Z" fill={giPurple} />
      <path d="M158 164 L168 224 L136 224 L134 172 Z" fill={giPurple} />
      <path d="M96 116 L88 172 L172 172 L164 116 Z" fill={giPurple} />
      <rect x="96" y="156" width="68" height="12" rx="3" fill={eyeRed} />
      <path d="M96 122 L66 146 L76 158 L104 136 Z" fill={skinTan} />
      <path d="M164 122 L188 128 L152 86 L142 94 Z" fill={skinTan} />
      {!silhouette && (
        <g strokeLinecap="round">
          <line x1="142" y1="80" x2="248" y2="42" stroke="#a855f7" strokeWidth="6" />
          <line x1="142" y1="80" x2="248" y2="42" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="142" cy="80" r="8" fill={eyeRed} stroke="none" />
        </g>
      )}
      <ellipse cx="130" cy="92" rx="24" ry="23" fill={skinTan} />
      <path d="M94 82 L68 38 L96 46 L94 12 L118 36 L130 4 L142 36 L166 12 L164 46 L192 38 L166 82 Z" fill={hairSilver} />
      <polygon points="124,68 134,94 138,68" fill={hairSilver} />
      <polygon points="112,86 125,84 123,91 111,90" fill="#ffffff" />
      <circle cx="118" cy="88" r="2.2" fill={eyeRed} stroke="none" />
      <polygon points="148,86 135,84 137,91 149,90" fill="#ffffff" />
      <circle cx="142" cy="88" r="2.2" fill={eyeRed} stroke="none" />
      <line x1="123" y1="102" x2="137" y2="102" stroke="#78350f" strokeWidth="2.5" />
    </g>
  );
}

/** No.172 トランクス (ラベンダー紫髪・青ジャケット・背中の大剣＆輝くホープソード) */
export function TrunksSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const jacketBlue = silhouette ? primary : '#2563eb';
  const hairLavender = silhouette ? secondary : '#c084fc';
  const swordGold = silhouette ? accent : '#facc15';
  const skinTan = silhouette ? accent : '#fed7aa';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <rect x="78" y="64" width="14" height="90" rx="3" transform="rotate(-28 78 64)" fill="#dc2626" />
      <polygon points="196,138 248,40 236,34 186,132" fill={swordGold} />
      {!silhouette && (
        <polygon points="198,132 244,44 238,40 192,128" fill="#ffffff" stroke="none" opacity="0.7" />
      )}
      <path d="M104 164 L98 224 L124 224 L126 172 Z" fill="#1e293b" />
      <path d="M156 164 L162 224 L136 224 L134 172 Z" fill="#1e293b" />
      <path d="M98 116 L94 156 L166 156 L162 116 Z" fill={jacketBlue} />
      <rect x="104" y="148" width="52" height="16" fill="#0f172a" />
      <path d="M108 116 Q130 132, 152 116 L142 136 L118 136 Z" fill="#dc2626" />
      <path d="M98 122 L70 148 L80 158 L104 134 Z" fill={jacketBlue} />
      <path d="M162 122 L192 136 L186 148 L156 134 Z" fill={jacketBlue} />
      <ellipse cx="130" cy="90" rx="25" ry="24" fill={skinTan} />
      <path d="M98 86 Q102 52, 130 56 Q158 52, 162 86 Q146 68, 130 82 Q114 68, 98 86 Z" fill={hairLavender} />
      <circle cx="118" cy="88" r="3.8" fill="#0284c7" />
      <circle cx="142" cy="88" r="3.8" fill="#0284c7" />
      <line x1="122" y1="102" x2="138" y2="102" stroke="#78350f" strokeWidth="2.5" />
    </g>
  );
}

/** No.173 フリーザ (白＆紫クリスタル・長い尻尾・赤い瞳・指先のスーパーノヴァ) */
export function FriezaSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const bodyWhite = silhouette ? primary : '#f8fafc';
  const gemPurple = silhouette ? secondary : '#7c3aed';
  const auraGold = silhouette ? accent : '#facc15';
  const eyeRed = silhouette ? accent : '#dc2626';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {!silhouette && (
        <g stroke="none">
          <circle cx="218" cy="58" r="24" fill="#f97316" opacity="0.85" />
          <circle cx="218" cy="58" r="14" fill={auraGold} />
          <circle cx="218" cy="58" r="6" fill="#ffffff" />
        </g>
      )}
      <path d="M100 184 Q42 192, 30 144 Q46 134, 52 152 Q62 174, 102 172 Z" fill={bodyWhite} />
      <path d="M106 168 L100 226 L124 226 L126 174 Z" fill={bodyWhite} />
      <path d="M154 168 L160 226 L136 226 L134 174 Z" fill={bodyWhite} />
      <path d="M104 114 L98 172 L162 172 L156 114 Z" fill={bodyWhite} />
      <ellipse cx="130" cy="134" rx="18" ry="12" fill={gemPurple} />
      <path d="M104 120 L74 146 L84 156 L110 132 Z" fill={bodyWhite} />
      <path d="M156 120 L212 76 L202 68 L150 112 Z" fill={bodyWhite} />
      <ellipse cx="130" cy="84" rx="26" ry="26" fill={bodyWhite} />
      <ellipse cx="130" cy="68" rx="18" ry="12" fill={gemPurple} />
      <polygon points="114,84 126,87 124,93 112,90" fill={eyeRed} />
      <polygon points="146,84 134,87 136,93 148,90" fill={eyeRed} />
      <path d="M120 100 Q130 106, 140 98" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/** No.174 セル (緑の斑点模様・黒い頭冠・紫黒の虫羽・パーフェクトかめはめ波) */
export function CellSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const shellGreen = silhouette ? primary : '#16a34a';
  const limeGreen = silhouette ? primary : '#84cc16';
  const armorBlack = silhouette ? secondary : '#0f172a';
  const wingPurple = silhouette ? accent : '#581c87';
  const beamBlue = silhouette ? accent : '#38bdf8';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="104,128 38,88 46,162 102,164" fill={armorBlack} />
      <polygon points="156,128 222,88 214,162 158,164" fill={armorBlack} />
      <path d="M104 166 L94 226 L124 226 L126 174 Z" fill={shellGreen} />
      <path d="M156 166 L166 226 L136 226 L134 174 Z" fill={shellGreen} />
      <path d="M98 114 L94 172 L166 172 L162 114 Z" fill={shellGreen} />
      <ellipse cx="130" cy="134" rx="22" ry="13" fill={armorBlack} />
      <ellipse cx="130" cy="134" rx="12" ry="7" fill={wingPurple} />
      {!silhouette && (
        <g fill={armorBlack} stroke="none" opacity="0.65">
          <circle cx="104" cy="156" r="4" />
          <circle cx="156" cy="156" r="4" />
          <circle cx="116" cy="162" r="3.5" />
          <circle cx="144" cy="162" r="3.5" />
        </g>
      )}
      <path d="M98 122 L66 144 L76 156 L104 134 Z" fill={limeGreen} />
      <path d="M162 122 L194 144 L184 156 L156 134 Z" fill={limeGreen} />
      {!silhouette && (
        <g stroke="none">
          <circle cx="62" cy="148" r="16" fill={beamBlue} opacity="0.85" />
          <circle cx="62" cy="148" r="8" fill="#ffffff" />
        </g>
      )}
      <polygon points="104,78 78,24 116,44 130,62 144,44 182,24 156,78" fill={armorBlack} />
      <ellipse cx="130" cy="86" rx="23" ry="23" fill="#e2e8f0" />
      <polygon points="114,82 126,86 124,92 112,88" fill="#ec4899" />
      <polygon points="146,82 134,86 136,92 148,88" fill="#ec4899" />
      <path d="M120 100 Q130 106, 140 98" fill="none" stroke="#0f172a" strokeWidth="2.5" />
    </g>
  );
}

/** No.175 魔人ブウ (ピンクのもっちりボディ・頭の触角・M字ベルト・白いマント・お菓子光線) */
export function MajinBuuSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const buuPink = silhouette ? primary : '#f472b6';
  const beltGold = silhouette ? accent : '#facc15';
  const vestBlack = silhouette ? secondary : '#0f172a';
  const capeWhite = silhouette ? accent : '#ffffff';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <path d="M84 112 L42 198 L108 196 Z" fill={capeWhite} />
      <path d="M176 112 L218 198 L152 196 Z" fill={capeWhite} />
      <ellipse cx="106" cy="204" rx="22" ry="18" fill={capeWhite} />
      <ellipse cx="154" cy="204" rx="22" ry="18" fill={capeWhite} />
      <ellipse cx="102" cy="226" rx="16" ry="9" fill={beltGold} />
      <ellipse cx="158" cy="226" rx="16" ry="9" fill={beltGold} />
      <ellipse cx="130" cy="156" rx="46" ry="38" fill={buuPink} />
      <path d="M90 120 L84 156 L104 156 L108 120 Z" fill={vestBlack} />
      <path d="M170 120 L176 156 L156 156 L152 120 Z" fill={vestBlack} />
      <rect x="86" y="168" width="88" height="14" rx="4" fill={vestBlack} />
      <circle cx="130" cy="175" r="13" fill={beltGold} />
      {!silhouette && (
        <path d="M123 180 L123 170 L130 176 L137 170 L137 180" fill="none" stroke="#0f172a" strokeWidth="2.8" strokeLinejoin="round" />
      )}
      <path d="M88 124 L52 146 L62 162 L94 142 Z" fill={buuPink} />
      <path d="M172 124 L208 146 L198 162 L166 142 Z" fill={buuPink} />
      <path d="M130 64 Q138 30, 166 44 Q152 58, 138 68 Z" fill={buuPink} />
      <ellipse cx="130" cy="92" rx="34" ry="30" fill={buuPink} />
      <path d="M108 88 Q116 82, 124 88" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M136 88 Q144 82, 152 88" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M114 102 Q130 118, 146 102 Z" fill="#ffffff" />
    </g>
  );
}

/** No.176 ベジット (青逆立ちサイヤ髪・黄色ポタラ・青道着×オレンジインナー・青いスピリッツソード) */
export function VegettoSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const giBlue = silhouette ? primary : '#1d4ed8';
  const underOrange = silhouette ? secondary : '#f97316';
  const hairBlue = silhouette ? accent : '#38bdf8';
  const skinTan = silhouette ? accent : '#fed7aa';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="194,142 252,118 252,134 192,154" fill={hairBlue} />
      {!silhouette && (
        <polygon points="196,144 248,122 248,130 194,150" fill="#ffffff" stroke="none" opacity="0.85" />
      )}
      <path d="M102 164 L94 224 L124 224 L126 172 Z" fill={giBlue} />
      <path d="M158 164 L166 224 L136 224 L134 172 Z" fill={giBlue} />
      <rect x="94" y="206" width="28" height="20" rx="3" fill="#f8fafc" />
      <rect x="138" y="206" width="28" height="20" rx="3" fill="#f8fafc" />
      <path d="M96 116 L88 168 L172 168 L164 116 Z" fill={giBlue} />
      <polygon points="116,116 144,116 130,148" fill={underOrange} />
      <rect x="96" y="156" width="68" height="12" rx="3" fill="#38bdf8" />
      <path d="M96 120 L66 146 L76 158 L104 134 Z" fill={underOrange} />
      <circle cx="68" cy="154" r="10" fill="#f8fafc" />
      <path d="M164 120 L194 142 L186 154 L156 134 Z" fill={underOrange} />
      <circle cx="192" cy="148" r="10" fill="#f8fafc" />
      <circle cx="102" cy="96" r="5" fill="#facc15" />
      <circle cx="158" cy="96" r="5" fill="#facc15" />
      <ellipse cx="130" cy="90" rx="25" ry="23" fill={skinTan} />
      <path d="M94 82 L76 46 L100 50 L102 18 L120 38 L130 12 L140 38 L158 18 L160 50 L184 46 L166 82 Z" fill={hairBlue} />
      <polygon points="122,68 130,90 138,68" fill={hairBlue} />
      <circle cx="118" cy="88" r="4" fill={hairBlue} />
      <circle cx="142" cy="88" r="4" fill={hairBlue} />
      <path d="M120 100 Q130 106, 142 98" fill="none" stroke="#78350f" strokeWidth="2.5" />
    </g>
  );
}

/** No.177 ゴジータ (フュージョンベスト黒×黄・ゴジータブルー髪・虹色のスターダストブレイカー) */
export function GogetaSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const vestBlack = silhouette ? primary : '#0f172a';
  const padYellow = silhouette ? secondary : '#facc15';
  const hairBlue = silhouette ? accent : '#38bdf8';
  const skinTan = silhouette ? accent : '#fed7aa';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {!silhouette && (
        <g stroke="none">
          <circle cx="48" cy="108" r="20" fill="#ec4899" opacity="0.7" />
          <circle cx="48" cy="108" r="13" fill="#facc15" opacity="0.85" />
          <circle cx="48" cy="108" r="7" fill="#38bdf8" />
          <circle cx="48" cy="108" r="4" fill="#ffffff" />
        </g>
      )}
      <path d="M100 164 L92 224 L124 224 L126 172 Z" fill="#f8fafc" />
      <path d="M160 164 L168 224 L136 224 L134 172 Z" fill="#f8fafc" />
      <path d="M96 116 L90 168 L170 168 L164 116 Z" fill={skinTan} />
      <path d="M96 116 L116 116 L116 164 L92 164 Z" fill={vestBlack} />
      <path d="M164 116 L144 116 L144 164 L168 164 Z" fill={vestBlack} />
      <ellipse cx="94" cy="120" rx="18" ry="11" fill={padYellow} />
      <ellipse cx="166" cy="120" rx="18" ry="11" fill={padYellow} />
      <rect x="96" y="156" width="68" height="12" rx="3" fill={hairBlue} />
      <path d="M92 126 L56 122 L54 138 L94 142 Z" fill={skinTan} />
      <path d="M168 126 L196 150 L184 162 L158 140 Z" fill={skinTan} />
      <ellipse cx="130" cy="90" rx="25" ry="23" fill={skinTan} />
      <path d="M94 82 L76 46 L100 50 L102 18 L120 38 L130 12 L140 38 L158 18 L160 50 L184 46 L166 82 Z" fill={hairBlue} />
      <polygon points="124,68 130,94 136,68" fill={hairBlue} />
      <circle cx="118" cy="88" r="4" fill={hairBlue} />
      <circle cx="142" cy="88" r="4" fill={hairBlue} />
      <path d="M122 100 Q130 106, 140 99" fill="none" stroke="#78350f" strokeWidth="2.5" />
    </g>
  );
}

/** No.178 ゴテンクス (ちびっこフュージョンベスト・金髪＆周りに浮かぶ可愛い爆発オバケ) */
export function GotenksSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const hairGold = silhouette ? primary : '#facc15';
  const vestBlack = silhouette ? secondary : '#0f172a';
  const ghostWhite = silhouette ? accent : '#ffffff';
  const skinTan = silhouette ? accent : '#fed7aa';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <g>
        <ellipse cx="44" cy="96" rx="18" ry="22" fill={ghostWhite} />
        <path d="M26 106 Q36 124, 44 114 Q52 124, 62 106 Z" fill={ghostWhite} />
        {!silhouette && (
          <g fill="#0f172a" stroke="none">
            <circle cx="38" cy="92" r="2.5" />
            <circle cx="50" cy="92" r="2.5" />
            <ellipse cx="44" cy="100" rx="4" ry="3" fill="#ef4444" />
          </g>
        )}
        <ellipse cx="216" cy="96" rx="18" ry="22" fill={ghostWhite} />
        <path d="M198 106 Q208 124, 216 114 Q224 124, 234 106 Z" fill={ghostWhite} />
        {!silhouette && (
          <g fill="#0f172a" stroke="none">
            <circle cx="210" cy="92" r="2.5" />
            <circle cx="222" cy="92" r="2.5" />
            <ellipse cx="216" cy="100" rx="4" ry="3" fill="#ef4444" />
          </g>
        )}
      </g>
      <path d="M106 168 L102 220 L124 220 L126 174 Z" fill="#f8fafc" />
      <path d="M154 168 L158 220 L136 220 L134 174 Z" fill="#f8fafc" />
      <path d="M100 124 L96 170 L164 170 L160 124 Z" fill={skinTan} />
      <path d="M100 124 L118 124 L118 166 L96 166 Z" fill={vestBlack} />
      <path d="M160 124 L142 124 L142 166 L164 166 Z" fill={vestBlack} />
      <ellipse cx="98" cy="128" rx="15" ry="9" fill={hairGold} />
      <ellipse cx="162" cy="128" rx="15" ry="9" fill={hairGold} />
      <rect x="100" y="160" width="60" height="10" rx="3" fill="#38bdf8" />
      <path d="M98 134 L72 150 L80 160 L102 146 Z" fill={skinTan} />
      <path d="M162 134 L188 150 L180 160 L158 146 Z" fill={skinTan} />
      <ellipse cx="130" cy="96" rx="26" ry="23" fill={skinTan} />
      <path d="M94 88 L76 48 L102 52 L106 20 L122 40 L130 14 L138 40 L154 20 L158 52 L184 48 L166 88 Z" fill={hairGold} />
      <circle cx="118" cy="94" r="4" fill="#06b6d4" />
      <circle cx="142" cy="94" r="4" fill="#06b6d4" />
      <path d="M118 106 Q130 116, 142 106 Z" fill="#ffffff" />
    </g>
  );
}

/** No.179 クリリン (ツルツル頭におでこの6つの点・オレンジ亀仙流道着・黄金の気円斬円盤！) */
export function KrillinSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const giOrange = silhouette ? primary : '#f97316';
  const sashBlue = silhouette ? secondary : '#1d4ed8';
  const discGold = silhouette ? accent : '#facc15';
  const skinTan = silhouette ? accent : '#fed7aa';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <ellipse cx="208" cy="68" rx="36" ry="12" fill={discGold} />
      {!silhouette && (
        <ellipse cx="208" cy="68" rx="26" ry="7" fill="#ffffff" stroke="none" opacity="0.7" />
      )}
      <path d="M104 166 L98 222 L124 222 L126 174 Z" fill={giOrange} />
      <path d="M156 166 L162 222 L136 222 L134 174 Z" fill={giOrange} />
      <path d="M98 120 L92 172 L168 172 L162 120 Z" fill={giOrange} />
      <rect x="98" y="158" width="64" height="11" rx="3" fill={sashBlue} />
      <path d="M98 126 L72 150 L82 160 L104 138 Z" fill={skinTan} />
      <path d="M162 126 L198 86 L186 78 L156 118 Z" fill={skinTan} />
      <circle cx="130" cy="88" r="28" fill={skinTan} />
      {!silhouette && (
        <g fill="#78350f" stroke="none">
          <circle cx="122" cy="70" r="2.2" />
          <circle cx="130" cy="70" r="2.2" />
          <circle cx="138" cy="70" r="2.2" />
          <circle cx="122" cy="77" r="2.2" />
          <circle cx="130" cy="77" r="2.2" />
          <circle cx="138" cy="77" r="2.2" />
        </g>
      )}
      <circle cx="118" cy="90" r="5" fill="#ffffff" />
      <circle cx="142" cy="90" r="5" fill="#ffffff" />
      <circle cx="118" cy="90" r="2.5" fill="#0f172a" stroke="none" />
      <circle cx="142" cy="90" r="2.5" fill="#0f172a" stroke="none" />
      <path d="M118 104 Q130 112, 142 104" fill="none" stroke="#78350f" strokeWidth="2.8" strokeLinecap="round" />
    </g>
  );
}

/** No.180 亀仙人 (背中の大きな亀の甲羅・赤いアロハ・サングラス・立派な白いヒゲ) */
export function RoshiSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const alohaRed = silhouette ? primary : '#dc2626';
  const shellGreen = silhouette ? secondary : '#16a34a';
  const beardWhite = silhouette ? accent : '#f8fafc';
  const skinTan = silhouette ? accent : '#fed7aa';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <ellipse cx="92" cy="146" rx="34" ry="40" fill={shellGreen} />
      <ellipse cx="168" cy="146" rx="34" ry="40" fill={shellGreen} />
      <path d="M104 168 L98 222 L124 222 L126 174 Z" fill="#ca8a04" />
      <path d="M156 168 L162 222 L136 222 L134 174 Z" fill="#ca8a04" />
      <path d="M96 118 L92 174 L168 174 L164 118 Z" fill={alohaRed} />
      <path d="M96 124 L68 152 L78 162 L104 136 Z" fill={skinTan} />
      <path d="M164 124 L192 152 L182 162 L156 136 Z" fill={skinTan} />
      <circle cx="130" cy="86" r="27" fill={skinTan} />
      <circle cx="117" cy="82" r="10" fill="#7f1d1d" />
      <circle cx="143" cy="82" r="10" fill="#7f1d1d" />
      <line x1="127" y1="82" x2="133" y2="82" stroke="#0f172a" strokeWidth="3" />
      <path d="M104 94 Q130 88, 156 94 L148 128 Q130 140, 112 128 Z" fill={beardWhite} />
    </g>
  );
}

/** No.181 人造人間18号 (金髪ショートボブ・青いデニムジャケット・水色の無限エネルギー弾) */
export function Android18Svg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const denimBlue = silhouette ? primary : '#2563eb';
  const hairGold = silhouette ? secondary : '#facc15';
  const energyCyan = silhouette ? accent : '#38bdf8';
  const skinTan = silhouette ? accent : '#fed7aa';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {!silhouette && (
        <g stroke="none">
          <circle cx="52" cy="142" r="16" fill={energyCyan} opacity="0.82" />
          <circle cx="52" cy="142" r="8" fill="#ffffff" />
          <circle cx="208" cy="142" r="16" fill={energyCyan} opacity="0.82" />
          <circle cx="208" cy="142" r="8" fill="#ffffff" />
        </g>
      )}
      <path d="M104 166 L98 226 L124 226 L126 172 Z" fill="#0f172a" />
      <path d="M156 166 L162 226 L136 226 L134 172 Z" fill="#0f172a" />
      <polygon points="98,154 162,154 168,180 92,180" fill={denimBlue} />
      <path d="M100 116 L96 156 L164 156 L160 116 Z" fill={denimBlue} />
      <path d="M100 122 L62 140 L68 152 L106 134 Z" fill="#ffffff" />
      <path d="M160 122 L198 140 L192 152 L154 134 Z" fill="#ffffff" />
      <ellipse cx="130" cy="88" rx="25" ry="24" fill={skinTan} />
      <path d="M98 104 Q98 54, 130 56 Q162 54, 162 104 L150 76 L130 82 L106 72 Z" fill={hairGold} />
      <circle cx="118" cy="88" r="4.5" fill={denimBlue} />
      <circle cx="142" cy="88" r="4.5" fill={denimBlue} />
      <line x1="122" y1="102" x2="138" y2="102" stroke="#9a3412" strokeWidth="2.5" />
    </g>
  );
}

/** No.182 人造人間17号 (黒髪ミディアム・緑のレンジャー服・オレンジスカーフ・緑の無敵バリヤー) */
export function Android17Svg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const jacketGreen = silhouette ? primary : '#16a34a';
  const scarfOrange = silhouette ? secondary : '#f97316';
  const barrierCyan = silhouette ? accent : '#4ade80';
  const skinTan = silhouette ? accent : '#fed7aa';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {!silhouette && (
        <circle cx="130" cy="136" r="96" fill={barrierCyan} opacity="0.2" stroke={barrierCyan} strokeWidth="3.5" />
      )}
      <path d="M104 166 L98 226 L124 226 L126 174 Z" fill="#1e3a8a" />
      <path d="M156 166 L162 226 L136 226 L134 174 Z" fill="#1e3a8a" />
      <path d="M98 116 L94 170 L166 170 L162 116 Z" fill={jacketGreen} />
      <polygon points="110,116 150,116 130,142" fill={scarfOrange} />
      <path d="M98 122 L68 148 L78 158 L104 134 Z" fill={jacketGreen} />
      <path d="M162 122 L192 148 L182 158 L156 134 Z" fill={jacketGreen} />
      <ellipse cx="130" cy="88" rx="25" ry="24" fill={skinTan} />
      <path d="M98 98 Q98 54, 130 56 Q162 54, 162 98 L148 72 L130 80 L112 72 Z" fill="#0f172a" />
      <circle cx="118" cy="88" r="4" fill="#0284c7" />
      <circle cx="142" cy="88" r="4" fill="#0284c7" />
      <path d="M120 102 Q130 107, 140 100" fill="none" stroke="#78350f" strokeWidth="2.5" />
    </g>
  );
}

/** No.183 ビルス (紫の猫神・大きくピンと立った耳・エジプト風首飾り・太陽のような破壊玉！) */
export function BeerusSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const skinPurple = silhouette ? primary : '#7c3aed';
  const collarCyan = silhouette ? secondary : '#06b6d4';
  const collarGold = silhouette ? accent : '#facc15';
  const hakaiOrange = silhouette ? accent : '#f97316';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {!silhouette && (
        <g stroke="none">
          <circle cx="214" cy="86" r="28" fill={hakaiOrange} opacity="0.88" />
          <circle cx="214" cy="86" r="16" fill={collarGold} />
          <circle cx="214" cy="86" r="7" fill="#ffffff" />
        </g>
      )}
      <path d="M104 184 Q44 188, 34 140 Q48 134, 54 152 Q64 174, 108 174 Z" fill={skinPurple} />
      <path d="M104 166 L98 226 L124 226 L126 174 Z" fill="#0284c7" />
      <path d="M156 166 L162 226 L136 226 L134 174 Z" fill="#0284c7" />
      <path d="M106 116 L102 170 L158 170 L154 116 Z" fill={skinPurple} />
      <polygon points="94,114 166,114 152,140 108,140" fill={collarCyan} />
      <polygon points="106,118 154,118 144,132 116,132" fill={collarGold} />
      <rect x="104" y="158" width="52" height="12" rx="3" fill={collarGold} />
      <path d="M104 124 L74 148 L84 158 L108 136 Z" fill={skinPurple} />
      <path d="M156 124 L200 100 L194 88 L150 112 Z" fill={skinPurple} />
      <polygon points="104,76 82,18 120,62" fill={skinPurple} />
      <polygon points="156,76 178,18 140,62" fill={skinPurple} />
      <ellipse cx="130" cy="88" rx="23" ry="22" fill={skinPurple} />
      <ellipse cx="130" cy="96" rx="16" ry="12" fill="#a78bfa" />
      <circle cx="118" cy="84" r="4.5" fill={collarGold} />
      <circle cx="142" cy="84" r="4.5" fill={collarGold} />
      <circle cx="118" cy="84" r="2" fill="#0f172a" stroke="none" />
      <circle cx="142" cy="84" r="2" fill="#0f172a" stroke="none" />
      <ellipse cx="130" cy="94" rx="4" ry="3" fill="#0f172a" />
    </g>
  );
}

/** No.184 ジレン (灰色の宇宙人ヘッド・大きく丸い瞳・赤黒プライドトルーパーズ戦闘服・燃え上がる炎オーラ) */
export function JirenSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const suitRed = silhouette ? primary : '#dc2626';
  const suitBlack = silhouette ? secondary : '#0f172a';
  const skinGrey = silhouette ? accent : '#94a3b8';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {!silhouette && (
        <polygon
          points="130,12 82,66 102,60 66,120 88,116 56,184 204,184 172,116 194,120 158,60 178,66"
          fill={suitRed}
          opacity="0.35"
          stroke="none"
        />
      )}
      <path d="M96 164 L88 226 L124 226 L126 174 Z" fill={suitBlack} />
      <path d="M164 164 L172 226 L136 226 L134 174 Z" fill={suitBlack} />
      <path d="M84 110 L82 172 L178 172 L176 110 Z" fill={suitRed} />
      <polygon points="84,132 176,132 172,172 88,172" fill={suitBlack} />
      <path d="M84 114 L52 146 L66 160 L92 134 Z" fill={suitRed} />
      <path d="M176 114 L208 146 L194 160 L168 134 Z" fill={suitRed} />
      <circle cx="58" cy="154" r="14" fill="#f8fafc" />
      <circle cx="202" cy="154" r="14" fill="#f8fafc" />
      <ellipse cx="130" cy="84" rx="28" ry="26" fill={skinGrey} />
      <ellipse cx="116" cy="84" rx="7" ry="9" fill="#0f172a" />
      <ellipse cx="144" cy="84" rx="7" ry="9" fill="#0f172a" />
      {!silhouette && (
        <g fill="#ef4444" stroke="none">
          <circle cx="116" cy="84" r="2.5" />
          <circle cx="144" cy="84" r="2.5" />
        </g>
      )}
      <line x1="120" y1="100" x2="140" y2="100" stroke="#334155" strokeWidth="2.8" />
    </g>
  );
}

/** No.185 ゴクウブラック (超サイヤ人ロゼ・バラ色の逆立ち髪・黒道着・ピンクの気の剣「神裂斬」) */
export function GokuBlackSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const hairRose = silhouette ? primary : '#ec4899';
  const giBlack = silhouette ? secondary : '#0f172a';
  const giGrey = silhouette ? secondary : '#334155';
  const bladePink = silhouette ? accent : '#f472b6';
  const skinTan = silhouette ? accent : '#fed7aa';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      <polygon points="190,144 252,102 252,124 190,158" fill={bladePink} />
      {!silhouette && (
        <polygon points="194,146 248,108 248,120 192,154" fill="#ffffff" stroke="none" opacity="0.7" />
      )}
      <path d="M102 164 L94 224 L124 224 L126 172 Z" fill={giBlack} />
      <path d="M158 164 L166 224 L136 224 L134 172 Z" fill={giBlack} />
      <path d="M96 116 L90 170 L170 170 L164 116 Z" fill={giGrey} />
      <polygon points="116,116 144,116 130,152" fill={giBlack} />
      <rect x="96" y="156" width="68" height="12" rx="3" fill="#dc2626" />
      <path d="M96 122 L66 148 L76 158 L104 134 Z" fill={giBlack} />
      <path d="M164 122 L192 144 L184 156 L156 134 Z" fill={giBlack} />
      <circle cx="158" cy="96" r="5" fill="#22c55e" />
      <ellipse cx="130" cy="90" rx="25" ry="23" fill={skinTan} />
      <path d="M94 82 L74 48 L100 52 L104 18 L122 40 L130 10 L138 40 L156 18 L160 52 L186 48 L166 82 Z" fill={hairRose} />
      <circle cx="118" cy="88" r="4" fill={hairRose} />
      <circle cx="142" cy="88" r="4" fill={hairRose} />
      <path d="M120 100 Q130 106, 142 98" fill="none" stroke="#78350f" strokeWidth="2.5" />
    </g>
  );
}

/** No.186 神龍・シェンロン (うねる長い緑の東洋龍・黄色の腹・赤い瞳・周囲を舞う7つのドラゴンボール！) */
export function ShenronSvg({ primary, secondary, accent, outline, silhouette }: DbSvgPartProps) {
  const dragonGreen = silhouette ? primary : '#16a34a';
  const bellyYellow = silhouette ? secondary : '#facc15';
  const ballOrange = silhouette ? accent : '#f97316';
  const eyeRed = silhouette ? accent : '#ef4444';

  return (
    <g stroke={outline} strokeWidth="3.5" strokeLinejoin="round">
      {!silhouette && (
        <g>
          {[
            [42, 62],
            [218, 62],
            [26, 126],
            [234, 126],
            [48, 198],
            [212, 198],
            [130, 230],
          ].map(([cx, cy], idx) => (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="13" fill={ballOrange} />
              <circle cx={cx - 4} cy={cy - 4} r="3.5" fill="#fef08a" stroke="none" />
              <circle cx={cx} cy={cy} r="2.5" fill={eyeRed} stroke="none" />
            </g>
          ))}
        </g>
      )}
      <path
        d="M54 206 C54 150, 196 196, 196 142 C196 96, 86 128, 108 78"
        fill="none"
        stroke={dragonGreen}
        strokeWidth="36"
        strokeLinecap="round"
      />
      <path
        d="M54 206 C54 150, 196 196, 196 142 C196 96, 86 128, 108 78"
        fill="none"
        stroke={bellyYellow}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray="10 10"
      />
      <path d="M104 54 L82 22 L98 20 L108 42 L114 14 L126 18 L118 52 Z" fill="#ca8a04" />
      <path d="M156 54 L178 22 L162 20 L152 42 L146 14 L134 18 L142 52 Z" fill="#ca8a04" />
      <ellipse cx="130" cy="70" rx="34" ry="24" fill={dragonGreen} />
      <path d="M100 76 Q66 86, 56 108" fill="none" stroke={dragonGreen} strokeWidth="5" strokeLinecap="round" />
      <path d="M160 76 Q194 86, 204 108" fill="none" stroke={dragonGreen} strokeWidth="5" strokeLinecap="round" />
      <polygon points="108,64 124,68 122,74 106,70" fill={eyeRed} />
      <polygon points="152,64 136,68 138,74 154,70" fill={eyeRed} />
      <path d="M110 82 Q130 92, 150 82" fill="none" stroke="#0f172a" strokeWidth="3" />
      <polygon points="116,83 120,92 124,84" fill="#ffffff" />
      <polygon points="144,83 140,92 136,84" fill="#ffffff" />
    </g>
  );
}

/** ドラゴンボール追加16体のディスパッチャー */
export function renderDragonBallExtendedSvg(resolvedId: string, partProps: DbSvgPartProps): React.ReactNode | null {
  switch (resolvedId) {
    case 'thunder-db-gohan':
      return <GohanSvg {...partProps} />;
    case 'water-db-trunks':
      return <TrunksSvg {...partProps} />;
    case 'water-db-frieza':
      return <FriezaSvg {...partProps} />;
    case 'nature-db-cell':
      return <CellSvg {...partProps} />;
    case 'fire-db-buu':
      return <MajinBuuSvg {...partProps} />;
    case 'thunder-db-vegetto':
      return <VegettoSvg {...partProps} />;
    case 'water-db-gogeta':
      return <GogetaSvg {...partProps} />;
    case 'thunder-db-gotenks':
      return <GotenksSvg {...partProps} />;
    case 'fire-db-krillin':
      return <KrillinSvg {...partProps} />;
    case 'water-db-roshi':
      return <RoshiSvg {...partProps} />;
    case 'thunder-db-android18':
      return <Android18Svg {...partProps} />;
    case 'nature-db-android17':
      return <Android17Svg {...partProps} />;
    case 'fire-db-beerus':
      return <BeerusSvg {...partProps} />;
    case 'fire-db-jiren':
      return <JirenSvg {...partProps} />;
    case 'nature-db-black':
      return <GokuBlackSvg {...partProps} />;
    case 'nature-db-shenron':
      return <ShenronSvg {...partProps} />;
    default:
      return null;
  }
}
