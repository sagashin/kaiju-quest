export type ElementId = 'fire' | 'water' | 'thunder' | 'nature';
export type KaijuTypeId = 'dino' | 'dragon' | 'robot' | 'beast';

export interface QuestItem {
  id: string;
  emoji: string;
  title: string;
  shortSpeechName: string;
  cardBg: string;
  borderAccent: string;
  iconBg: string;
}

export const QUEST_LIST: QuestItem[] = [
  {
    id: 'breakfast',
    emoji: '🍙',
    title: 'あさごはんを たべる',
    shortSpeechName: 'あさごはん',
    cardBg: 'from-orange-500/25 to-amber-500/15',
    borderAccent: 'border-orange-400/60',
    iconBg: 'bg-orange-500/30',
  },
  {
    id: 'morning-teeth',
    emoji: '🪥',
    title: 'あさはみがきを する',
    shortSpeechName: 'あさはみがき',
    cardBg: 'from-cyan-500/25 to-sky-500/15',
    borderAccent: 'border-cyan-400/60',
    iconBg: 'bg-cyan-500/30',
  },
  {
    id: 'toilet',
    emoji: '🚽',
    title: 'トイレに いく',
    shortSpeechName: 'トイレ',
    cardBg: 'from-rose-500/25 to-pink-500/15',
    borderAccent: 'border-rose-400/60',
    iconBg: 'bg-rose-500/30',
  },
  {
    id: 'shoes',
    emoji: '👟',
    title: 'くつを そろえる',
    shortSpeechName: 'くつそろえ',
    cardBg: 'from-emerald-500/25 to-teal-500/15',
    borderAccent: 'border-emerald-400/60',
    iconBg: 'bg-emerald-500/30',
  },
  {
    id: 'toys',
    emoji: '📦',
    title: 'おもちゃの おかたづけ',
    shortSpeechName: 'おもちゃの おかたづけ',
    cardBg: 'from-amber-500/25 to-yellow-500/15',
    borderAccent: 'border-amber-400/60',
    iconBg: 'bg-amber-500/30',
  },
  {
    id: 'dinner',
    emoji: '🍛',
    title: 'よるごはんを たべる',
    shortSpeechName: 'よるごはん',
    cardBg: 'from-orange-500/25 to-rose-500/15',
    borderAccent: 'border-orange-400/60',
    iconBg: 'bg-orange-500/30',
  },
  {
    id: 'bath',
    emoji: '🛁',
    title: 'おふろに はいる',
    shortSpeechName: 'おふろ',
    cardBg: 'from-blue-500/25 to-cyan-500/15',
    borderAccent: 'border-blue-400/60',
    iconBg: 'bg-blue-500/30',
  },
  {
    id: 'night-teeth',
    emoji: '🪥',
    title: 'よるはみがきを する',
    shortSpeechName: 'よるはみがき',
    cardBg: 'from-purple-500/25 to-indigo-500/15',
    borderAccent: 'border-purple-400/60',
    iconBg: 'bg-purple-500/30',
  },
  {
    id: 'pajamas',
    emoji: '👕',
    title: 'パジャマに きがえる',
    shortSpeechName: 'お着替え',
    cardBg: 'from-indigo-500/25 to-blue-500/15',
    borderAccent: 'border-indigo-400/60',
    iconBg: 'bg-indigo-500/30',
  },
];

export interface ElementOption {
  id: ElementId;
  emoji: string;
  label: string;
  speechLabel: string;
  bgGradient: string;
  borderClass: string;
  activeRing: string;
  confettiColors: string[];
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
}

export const ELEMENT_OPTIONS: ElementOption[] = [
  {
    id: 'fire',
    emoji: '🔥',
    label: 'ほのお',
    speechLabel: 'ほのおタイプ！メラメラあついぞ！これマジでやばいねー！',
    bgGradient: 'from-red-600 via-orange-500 to-amber-400',
    borderClass: 'border-orange-400',
    activeRing: 'ring-4 ring-yellow-300 shadow-[0_0_25px_rgba(249,115,22,0.8)]',
    confettiColors: ['#ef4444', '#f97316', '#facc15', '#fef08a'],
    primaryHex: '#ef4444',
    secondaryHex: '#f97316',
    accentHex: '#fde047',
  },
  {
    id: 'water',
    emoji: '💧',
    label: 'みず',
    speechLabel: 'みずタイプ！ザブーンと超ビッグウェーブ！つよすぎるー！',
    bgGradient: 'from-blue-600 via-cyan-500 to-sky-300',
    borderClass: 'border-cyan-300',
    activeRing: 'ring-4 ring-cyan-200 shadow-[0_0_25px_rgba(6,182,212,0.8)]',
    confettiColors: ['#2563eb', '#06b6d4', '#38bdf8', '#e0f2fe'],
    primaryHex: '#0284c7',
    secondaryHex: '#06b6d4',
    accentHex: '#bae6fd',
  },
  {
    id: 'thunder',
    emoji: '⚡',
    label: 'かみなり',
    speechLabel: 'かみなりタイプ！ビリビリしびれるー！神ってるね！',
    bgGradient: 'from-amber-500 via-yellow-400 to-lime-300',
    borderClass: 'border-yellow-300',
    activeRing: 'ring-4 ring-white shadow-[0_0_25px_rgba(250,204,21,0.9)]',
    confettiColors: ['#eab308', '#facc15', '#fde047', '#ffffff'],
    primaryHex: '#eab308',
    secondaryHex: '#facc15',
    accentHex: '#fef9c3',
  },
  {
    id: 'nature',
    emoji: '🌿',
    label: 'しぜん',
    speechLabel: 'しぜんタイプ！もりもりパワー全開！レッツゴー！',
    bgGradient: 'from-emerald-600 via-green-500 to-lime-400',
    borderClass: 'border-lime-300',
    activeRing: 'ring-4 ring-lime-200 shadow-[0_0_25px_rgba(34,197,94,0.8)]',
    confettiColors: ['#16a34a', '#22c55e', '#84cc16', '#dcfce7'],
    primaryHex: '#16a34a',
    secondaryHex: '#4ade80',
    accentHex: '#d9f99d',
  },
];

export interface KaijuTypeOption {
  id: KaijuTypeId;
  emoji: string;
  label: string;
  speechLabel: string;
}

export const KAIJU_TYPE_OPTIONS: KaijuTypeOption[] = [
  {
    id: 'dino',
    emoji: '🦖',
    label: 'きょうりゅう',
    speechLabel: 'きょうりゅう！ドッスン！超でっかくてかっこいいー！',
  },
  {
    id: 'dragon',
    emoji: '🐉',
    label: 'ドラゴン',
    speechLabel: 'ドラゴン！ブンブンお空をとぶぞ！やばいねー！',
  },
  {
    id: 'robot',
    emoji: '🤖',
    label: 'ロボット',
    speechLabel: 'ロボット！ガシーン！超ハイテクで神ってるー！',
  },
  {
    id: 'beast',
    emoji: '🦁',
    label: 'ビースト',
    speechLabel: 'ビースト！ガルルル！スピードマックス！レッツゴー！',
  },
];

export type EvolutionStage = 1 | 2 | 3; // 1:キッズ期(Lv1-2), 2:成長期(Lv3-4), 3:究極キング期(Lv5+)

export interface KaijuSkill {
  id: string;
  name: string;
  unlockLevel: number; // 1, 2, 3, 5
  mpCost: number;      // 例: 0, 10, 20, 35
  power: number;       // 例: 28, 50, 80, 130
  description: string;
  isUltimate?: boolean;
}

export interface KaijuProgress {
  level: number;
  exp: number;
}

export interface KaijuComputedStats {
  level: number;
  exp: number;
  nextLevelExp: number;
  stage: EvolutionStage;
  displayName: string;
  stageTitle: string;
  maxHp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  unlockedSkills: KaijuSkill[];
  allSkills: KaijuSkill[];
}

export interface KaijuData {
  id: string;
  dexNumber: number;
  element: ElementId;
  type: KaijuTypeId;
  name: string;
  roar: string;
  specialMove: string;
  stars: number;
  titleBadge: string;
  description: string;
  stageNames?: [string, string, string];
  baseStats?: { hp: number; mp: number; atk: number; def: number; spd: number };
  skills?: KaijuSkill[];
}

/**
 * 今後のモンスター追加を簡単にするヘルパー関数
 */
export function createCustomKaiju(
  partial: Partial<KaijuData> & Pick<KaijuData, 'id' | 'name' | 'element' | 'type' | 'specialMove'>
): KaijuData {
  return {
    dexNumber: partial.dexNumber ?? 99,
    roar: partial.roar ?? 'ガオーッ！',
    stars: partial.stars ?? 5,
    titleBadge: partial.titleBadge ?? 'でんせつの かいじゅう',
    description: partial.description ?? 'すごい パワーを ひめた まぼろしの かいじゅうだ！',
    ...partial,
  };
}

export const defineKaiju = createCustomKaiju;

export const KAIJU_LIST: KaijuData[] = [
  // 🔥 ほのお × 4タイプ
  {
    id: 'fire-dino',
    dexNumber: 1,
    element: 'fire',
    type: 'dino',
    name: 'マグマティラノ',
    roar: 'ガオーッ！',
    specialMove: 'しゃくねつ メテオバイト',
    stars: 5,
    titleBadge: 'ばくねつ きょうりゅう',
    description: 'せなかの かざんから メラメラほのおを ふきだす 最強のティラノかいじゅう！',
  },
  {
    id: 'fire-dragon',
    dexNumber: 2,
    element: 'fire',
    type: 'dragon',
    name: 'バーニングドラゴ',
    roar: 'ギュオォーン！',
    specialMove: 'フレア・トルネード',
    stars: 5,
    titleBadge: 'かえん ドラゴン',
    description: 'おおきな ほのおの つばさで たいようまで とんでいく 伝説のドラゴン！',
  },
  {
    id: 'fire-robot',
    dexNumber: 3,
    element: 'fire',
    type: 'robot',
    name: 'ブレイズカイザー',
    roar: 'ピピピ・ガシーン！',
    specialMove: 'ロケット・ファイヤーパンチ',
    stars: 5,
    titleBadge: 'しゃくねつ きょだいロボ',
    description: 'むねの ファイヤーエンジンが フル回転！どんな いわも パンチで くだくぞ！',
  },
  {
    id: 'fire-beast',
    dexNumber: 4,
    element: 'fire',
    type: 'beast',
    name: 'フレイムレオ',
    roar: 'ガルルルッ！',
    specialMove: 'バーニング・クロー',
    stars: 4,
    titleBadge: 'ほのおの らいおん王',
    description: '黄金に もえる たてがみが カッコいい！ほのおの 爪で 闇を きりさくぞ！',
  },

  // 💧 みず × 4タイプ
  {
    id: 'water-dino',
    dexNumber: 5,
    element: 'water',
    type: 'dino',
    name: 'アクアスピノ',
    roar: 'ザッパーン！ガオー！',
    specialMove: 'うずしお テイルスマッシュ',
    stars: 5,
    titleBadge: 'しんかい きょうりゅう',
    description: 'せなかの 巨大な ヒレで うみを まっぷたつに わって すすむ かいじゅう！',
  },
  {
    id: 'water-dragon',
    dexNumber: 6,
    element: 'water',
    type: 'dragon',
    name: 'ポセイドンドラゴ',
    roar: 'シャアァーッ！',
    specialMove: 'ハイドロ・レーザーストリーム',
    stars: 5,
    titleBadge: 'うみの 守護神ドラゴン',
    description: 'クリスタルのように かがやく ウロコをもつ、うみの 王様ドラゴン！',
  },
  {
    id: 'water-robot',
    dexNumber: 7,
    element: 'water',
    type: 'robot',
    name: 'ハイドロメカオー',
    roar: 'ガシャン・スプラッシュ！',
    specialMove: 'ちょうこうあつ ウォーターキャノン',
    stars: 4,
    titleBadge: 'しんかい せんとうロボ',
    description: 'りょうかたの キャノン砲から ジェット水流を 発射する レスキューロボ！',
  },
  {
    id: 'water-beast',
    dexNumber: 8,
    element: 'water',
    type: 'beast',
    name: 'スプラッシュウルフ',
    roar: 'アオーーン！',
    specialMove: 'ブリザード・ファング',
    stars: 4,
    titleBadge: 'ひょうがの おおカミ',
    description: 'みずの うえを 音もなく はしりぬける、こおりと みずの スピードスター！',
  },

  // ⚡ かみなり × 4タイプ
  {
    id: 'thunder-dino',
    dexNumber: 9,
    element: 'thunder',
    type: 'dino',
    name: 'サンダーレックス',
    roar: 'バリバリッ！ガオー！',
    specialMove: 'ひゃくまんボルト かみつき',
    stars: 5,
    titleBadge: 'いなずま きょうりゅう',
    description: 'ほえるだけで カミナリが おちる！黄金の トゲを もつ 超発電きょうりゅう！',
  },
  {
    id: 'thunder-dragon',
    dexNumber: 10,
    element: 'thunder',
    type: 'dragon',
    name: 'イナズマドラゴ',
    roar: 'ゴロゴロ・ギャオー！',
    specialMove: 'ライトニング・ノヴァ',
    stars: 5,
    titleBadge: 'らいじん ドラゴン',
    description: 'カミナリ雲の なかから 光の スピードで おりてくる 無敵の 黄金ドラゴン！',
  },
  {
    id: 'thunder-robot',
    dexNumber: 11,
    element: 'thunder',
    type: 'robot',
    name: 'ボルトタイタン',
    roar: 'ピピピ・ボルテージマックス！',
    specialMove: 'ギガボルト・サンダービーム',
    stars: 5,
    titleBadge: 'ちょうでんじ ロボ',
    description: '全身が プラズマエネルギーで 動く 最先端の スーパーロボットかいじゅう！',
  },
  {
    id: 'thunder-beast',
    dexNumber: 12,
    element: 'thunder',
    type: 'beast',
    name: 'ライジンタイガー',
    roar: 'ガォォーーン！',
    specialMove: 'イナズマ・ソニックダッシュ',
    stars: 4,
    titleBadge: 'せんこうの トラかいじゅう',
    description: 'カミナリよりも はやく 走る！黄金の しまもようが バチバチ 光るぞ！',
  },

  // 🌿 しぜん × 4タイプ
  {
    id: 'nature-dino',
    dexNumber: 13,
    element: 'nature',
    type: 'dino',
    name: 'ガイアトリケラ',
    roar: 'ドシーーーン！ガオー！',
    specialMove: 'だいちの メガホーン突撃',
    stars: 4,
    titleBadge: 'たいぼくの きょうりゅう',
    description: '3本の 巨大な ツノと エメラルドの よろいで どんな 攻撃も はじきかえす！',
  },
  {
    id: 'nature-dragon',
    dexNumber: 14,
    element: 'nature',
    type: 'dragon',
    name: 'エメラルドドラゴ',
    roar: 'キュルル・ギャオー！',
    specialMove: 'リーフストーム・ブレス',
    stars: 5,
    titleBadge: 'しんりんの 聖竜',
    description: '宝石の ような みどりの つばさを もつ、森と 地球を まもる ドラゴン！',
  },
  {
    id: 'nature-robot',
    dexNumber: 15,
    element: 'nature',
    type: 'robot',
    name: 'フォレストガーディアン',
    roar: 'ガシーン・システム起動！',
    specialMove: 'ガイア・ドリルクラッシャー',
    stars: 4,
    titleBadge: 'こだい 遺跡の 巨神ロボ',
    description: 'ジャングルの 古代遺跡から 目覚めた、草木と クリスタルで 輝く メカ巨人！',
  },
  {
    id: 'nature-beast',
    dexNumber: 16,
    element: 'nature',
    type: 'beast',
    name: 'ジャングルコング',
    roar: 'ウホホーッ！ドゴーン！',
    specialMove: 'アースシェイカー・ドラミング',
    stars: 5,
    titleBadge: 'もりの 剛腕キング',
    description: '両手で むねを 叩くと 大地が ゆれる！やさしい 心と 怪力を もつ 王様！',
  },

  // 🌟 追加モンスター No.17〜20（createCustomKaiju による拡張）
  createCustomKaiju({
    id: 'fire-dragon-2',
    dexNumber: 17,
    element: 'fire',
    type: 'dragon',
    name: 'メテオレックスドラゴ',
    roar: 'ドゴォォーン！ギャオー！',
    specialMove: 'コズミック・メテオストライク',
    stars: 5,
    titleBadge: 'うちゅう ほのお竜',
    description: 'うちゅうから いんせきと いっしょに やってきた 超パワフルな ほのおドラゴン！',
  }),
  createCustomKaiju({
    id: 'water-robot-2',
    dexNumber: 18,
    element: 'water',
    type: 'robot',
    name: 'アビスポセイドンロボ',
    roar: 'ピピピ・アクアバースト！',
    specialMove: 'ディープオーシャン・トライデント',
    stars: 5,
    titleBadge: 'しんかい 王様ロボ',
    description: 'うみの そこから あらわれた 黄金のトライデントを もつ 最強クラスの水中ロボ！',
  }),
  createCustomKaiju({
    id: 'thunder-beast-2',
    dexNumber: 19,
    element: 'thunder',
    type: 'beast',
    name: 'ゴッドサンダーフェンリル',
    roar: 'バリバリ・アオォォーン！',
    specialMove: 'プラズマ・ファングラッシュ',
    stars: 5,
    titleBadge: 'しんわの 雷狼',
    description: '神話に でてくる カミナリの オオカミ！ひとっとびで 雲の上まで かけあがるぞ！',
  }),
  createCustomKaiju({
    id: 'nature-dino-2',
    dexNumber: 20,
    element: 'nature',
    type: 'dino',
    name: 'エンシェントガイアレックス',
    roar: 'ズシィィーン！ガオーッ！',
    specialMove: 'ジュラシック・フォレストロア',
    stars: 5,
    titleBadge: 'こだい 森林王ティラノ',
    description: '何億年も 生きる 森の 巨大ティラノ！せなかに 大きな クリスタルツリーが そびえるぞ！',
  }),
];

/**
 * レベルに応じた進化段階（1:キッズ期, 2:せいちょう期, 3:究極キング期）を返す
 */
export function getEvolutionStage(level: number): EvolutionStage {
  if (level <= 2) return 1;
  if (level <= 4) return 2;
  return 3;
}

/**
 * 怪獣の4つの習得技リストを返す（未指定の場合は属性×タイプから自動生成）
 */
export function getKaijuSkills(kaiju: KaijuData): KaijuSkill[] {
  if (kaiju.skills && kaiju.skills.length > 0) {
    return kaiju.skills;
  }

  const basicByType: Record<KaijuTypeId, { name: string; desc: string }> = {
    dino: { name: 'メガかみつき', desc: 'おおきな アゴで ガブッと かみつく 基本わざ！' },
    dragon: { name: 'ドラゴンクロー', desc: 'するどい ツメで シュバッと きりさく 基本わざ！' },
    robot: { name: 'ロケットナックル', desc: '鋼鉄の パンチを うちこむ 基本わざ！' },
    beast: { name: 'スピードひっかき', desc: '目にも とまらぬ 速さで ひっかく 基本わざ！' },
  };

  const elemSkillByElement: Record<ElementId, { name: string; desc: string }> = {
    fire: { name: 'メラメラ火炎弾', desc: 'あつい ほのおの タマを 連続で はっしゃする！' },
    water: { name: 'ザブーン水流砲', desc: 'うずまく みずの レーザーで 相手を 吹きとばす！' },
    thunder: { name: 'ビリビリ電撃波', desc: 'しびれる カミナリを まわりに 放電する！' },
    nature: { name: 'リーフカッター', desc: '光る はっぱの カッターを 竜巻にして とばす！' },
  };

  const ultimateByElement: Record<ElementId, { name: string; desc: string }> = {
    fire: {
      name: 'ギガ・プロミネンス・ノヴァ',
      desc: 'たいようの ような 超巨大ファイヤーボールで すべてを やきつくす 究極奥義！',
    },
    water: {
      name: 'アルティメット・タイダルストーム',
      desc: '大津波の うずしおで すべてを のみこむ 水の究極奥義！',
    },
    thunder: {
      name: '神雷・ファイナルサンダー',
      desc: '空から 1億ボルトの 黄金イナズマを おとす 雷の究極奥義！',
    },
    nature: {
      name: 'ガイア・エメラルド・バースト',
      desc: '地球すべての 自然エネルギーを 爆発させる 森の究極奥義！',
    },
  };

  const tBasic = basicByType[kaiju.type];
  const eMid = elemSkillByElement[kaiju.element];
  const eUlt = ultimateByElement[kaiju.element];

  return [
    {
      id: `${kaiju.id}-skill-1`,
      name: tBasic.name,
      unlockLevel: 1,
      mpCost: 0,
      power: 28,
      description: tBasic.desc,
    },
    {
      id: `${kaiju.id}-skill-2`,
      name: eMid.name,
      unlockLevel: 2,
      mpCost: 10,
      power: 50,
      description: eMid.desc,
    },
    {
      id: `${kaiju.id}-skill-3`,
      name: kaiju.specialMove,
      unlockLevel: 3,
      mpCost: 20,
      power: 80,
      description: `${kaiju.name} だけの ちょうきょうりょくな 必殺技だ！`,
    },
    {
      id: `${kaiju.id}-skill-4`,
      name: eUlt.name,
      unlockLevel: 5,
      mpCost: 35,
      power: 130,
      description: eUlt.desc,
      isUltimate: true,
    },
  ];
}

/**
 * 怪獣の現在のレベル・進化段階・ドラクエ風ステータス・習得技を計算する
 */
export function getKaijuStats(kaiju: KaijuData, progress?: KaijuProgress): KaijuComputedStats {
  const level = Math.max(1, progress?.level ?? 1);
  const exp = Math.max(0, progress?.exp ?? 0);
  const nextLevelExp = 100;
  const stage = getEvolutionStage(level);

  let displayName = kaiju.name;
  if (stage === 1) {
    displayName = kaiju.stageNames?.[0] ?? `プチ${kaiju.name}`;
  } else if (stage === 2) {
    displayName = kaiju.stageNames?.[1] ?? kaiju.name;
  } else {
    displayName = kaiju.stageNames?.[2] ?? `キング${kaiju.name}`;
  }

  const stageTitle =
    stage === 1 ? '★ キッズ形態' : stage === 2 ? '★★ せいちょう形態' : '★★★ 究極キング形態';

  const maxHp = 80 + kaiju.stars * 12 + (level - 1) * 28 + (stage - 1) * 35;
  const maxMp = 30 + kaiju.stars * 6 + (level - 1) * 12 + (stage - 1) * 15;
  const attack = 25 + kaiju.stars * 5 + (level - 1) * 11 + (stage - 1) * 15;
  const defense = 20 + kaiju.stars * 4 + (level - 1) * 9 + (stage - 1) * 12;
  const speed = 22 + (kaiju.type === 'beast' || kaiju.type === 'dragon' ? 12 : 5) + (level - 1) * 8;

  const allSkills = getKaijuSkills(kaiju);
  const unlockedSkills = allSkills.filter((s) => s.unlockLevel <= level);

  return {
    level,
    exp,
    nextLevelExp,
    stage,
    displayName,
    stageTitle,
    maxHp,
    maxMp,
    attack,
    defense,
    speed,
    unlockedSkills,
    allSkills,
  };
}

export function findKaiju(element: ElementId, type: KaijuTypeId): KaijuData {
  return (
    KAIJU_LIST.find((k) => k.element === element && k.type === type) ||
    KAIJU_LIST[0]
  );
}

/**
 * 召喚時に同じ属性×タイプの怪獣から、未解放のものを優先して返す（すべて解放済みならランダム抽選）
 */
export function findKaijuForSummon(
  element: ElementId,
  type: KaijuTypeId,
  unlockedIds: string[]
): KaijuData {
  const candidates = KAIJU_LIST.filter((k) => k.element === element && k.type === type);
  if (candidates.length === 0) return KAIJU_LIST[0];

  const lockedCandidates = candidates.filter((k) => !unlockedIds.includes(k.id));
  if (lockedCandidates.length > 0) {
    return lockedCandidates[0];
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

export function getElementMeta(element: ElementId): ElementOption {
  return ELEMENT_OPTIONS.find((e) => e.id === element) || ELEMENT_OPTIONS[0];
}

export function getTypeMeta(type: KaijuTypeId): KaijuTypeOption {
  return KAIJU_TYPE_OPTIONS.find((t) => t.id === type) || KAIJU_TYPE_OPTIONS[0];
}

