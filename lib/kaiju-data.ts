export type ElementId = 'fire' | 'water' | 'thunder' | 'nature';
export type CreatureCategory = 'kaiju' | 'insect';

export type KaijuTypeId =
  | 'dino'
  | 'dragon'
  | 'robot'
  | 'beast'
  | 'kabuto'
  | 'kuwagata'
  | 'hunter'
  | 'flier';

export type InsectVisualStyle =
  | 'y-horn'
  | 'long-horn'
  | 'three-horn'
  | 'heavy-beetle'
  | 'o-jaw'
  | 'long-jaw'
  | 'curved-jaw'
  | 'crown-jaw'
  | 'mantis'
  | 'hornet'
  | 'aquatic'
  | 'ladybug-jewel'
  | 'dragonfly'
  | 'butterfly'
  | 'hopper'
  | 'cicada';

export interface InsectEducationalInfo {
  habitat: string;
  food: string;
  realSize: string;
  trivia: string;
}

export interface QuestItem {
  id: string;
  emoji: string;
  title: string;
  shortSpeechName: string;
  timeOfDay: 'morning' | 'night';
  cardBg: string;
  borderAccent: string;
  iconBg: string;
}

export const QUEST_LIST: QuestItem[] = [
  {
    id: 'wake-up',
    emoji: '☀️',
    title: 'あさ おきる',
    shortSpeechName: 'あさ おきる',
    timeOfDay: 'morning',
    cardBg: 'from-yellow-400/25 to-amber-500/15',
    borderAccent: 'border-yellow-400/60',
    iconBg: 'bg-yellow-400/30',
  },
  {
    id: 'morning-milk',
    emoji: '🥛',
    title: 'あさ ぎゅうにゅうを のむ',
    shortSpeechName: 'あさの ぎゅうにゅう',
    timeOfDay: 'morning',
    cardBg: 'from-sky-400/25 to-blue-500/15',
    borderAccent: 'border-sky-300/60',
    iconBg: 'bg-sky-400/30',
  },
  {
    id: 'breakfast',
    emoji: '🍙',
    title: 'あさごはんを たべる',
    shortSpeechName: 'あさごはん',
    timeOfDay: 'morning',
    cardBg: 'from-orange-500/25 to-amber-500/15',
    borderAccent: 'border-orange-400/60',
    iconBg: 'bg-orange-500/30',
  },
  {
    id: 'morning-teeth',
    emoji: '🪥',
    title: 'あさはみがきを する',
    shortSpeechName: 'あさはみがき',
    timeOfDay: 'morning',
    cardBg: 'from-cyan-500/25 to-sky-500/15',
    borderAccent: 'border-cyan-400/60',
    iconBg: 'bg-cyan-500/30',
  },
  {
    id: 'toilet',
    emoji: '🚽',
    title: 'トイレに いく',
    shortSpeechName: 'トイレ',
    timeOfDay: 'morning',
    cardBg: 'from-rose-500/25 to-pink-500/15',
    borderAccent: 'border-rose-400/60',
    iconBg: 'bg-rose-500/30',
  },
  {
    id: 'shoes',
    emoji: '👟',
    title: 'くつを そろえる',
    shortSpeechName: 'くつそろえ',
    timeOfDay: 'morning',
    cardBg: 'from-emerald-500/25 to-teal-500/15',
    borderAccent: 'border-emerald-400/60',
    iconBg: 'bg-emerald-500/30',
  },
  {
    id: 'go-nursery',
    emoji: '🎒',
    title: 'ほいくえんに いく',
    shortSpeechName: 'ほいくえんに いく',
    timeOfDay: 'morning',
    cardBg: 'from-lime-500/25 to-green-500/15',
    borderAccent: 'border-lime-400/60',
    iconBg: 'bg-lime-500/30',
  },
  {
    id: 'return-nursery',
    emoji: '🏠',
    title: 'ほいくえんから かえる',
    shortSpeechName: 'ほいくえんから かえる',
    timeOfDay: 'night',
    cardBg: 'from-teal-500/25 to-cyan-500/15',
    borderAccent: 'border-teal-400/60',
    iconBg: 'bg-teal-500/30',
  },
  {
    id: 'toys',
    emoji: '📦',
    title: 'おもちゃの おかたづけ',
    shortSpeechName: 'おもちゃの おかたづけ',
    timeOfDay: 'night',
    cardBg: 'from-amber-500/25 to-yellow-500/15',
    borderAccent: 'border-amber-400/60',
    iconBg: 'bg-amber-500/30',
  },
  {
    id: 'dinner',
    emoji: '🍛',
    title: 'よるごはんを たべる',
    shortSpeechName: 'よるごはん',
    timeOfDay: 'night',
    cardBg: 'from-orange-500/25 to-rose-500/15',
    borderAccent: 'border-orange-400/60',
    iconBg: 'bg-orange-500/30',
  },
  {
    id: 'bath',
    emoji: '🛁',
    title: 'おふろに はいる',
    shortSpeechName: 'おふろ',
    timeOfDay: 'night',
    cardBg: 'from-blue-500/25 to-cyan-500/15',
    borderAccent: 'border-blue-400/60',
    iconBg: 'bg-blue-500/30',
  },
  {
    id: 'night-teeth',
    emoji: '🪥',
    title: 'よるはみがきを する',
    shortSpeechName: 'よるはみがき',
    timeOfDay: 'night',
    cardBg: 'from-purple-500/25 to-indigo-500/15',
    borderAccent: 'border-purple-400/60',
    iconBg: 'bg-purple-500/30',
  },
  {
    id: 'pajamas',
    emoji: '👕',
    title: 'パジャマに きがえる',
    shortSpeechName: 'お着替え',
    timeOfDay: 'night',
    cardBg: 'from-indigo-500/25 to-blue-500/15',
    borderAccent: 'border-indigo-400/60',
    iconBg: 'bg-indigo-500/30',
  },
  {
    id: 'night-toilet',
    emoji: '🚽',
    title: 'ねるまえ トイレに いく',
    shortSpeechName: 'ねるまえの トイレ',
    timeOfDay: 'night',
    cardBg: 'from-indigo-600/30 to-purple-800/25',
    borderAccent: 'border-indigo-400/60',
    iconBg: 'bg-indigo-600/30',
  },
  {
    id: 'sleep',
    emoji: '🛌',
    title: 'お布団で ねる',
    shortSpeechName: 'おやすみ',
    timeOfDay: 'night',
    cardBg: 'from-slate-700/40 to-indigo-900/30',
    borderAccent: 'border-indigo-400/60',
    iconBg: 'bg-indigo-600/30',
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
  insectFieldEmoji: string;
  insectFieldLabel: string;
  insectSpeechLabel: string;
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
    insectFieldEmoji: '☀️',
    insectFieldLabel: 'せかいのジャングル',
    insectSpeechLabel: 'せかいのジャングル！でっかい むしが いっぱいだ！',
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
    insectFieldEmoji: '💧',
    insectFieldLabel: 'みずべ・おおぞら',
    insectSpeechLabel: 'みずべと おおぞら！きれいな むしや およぐ むしが いるぞ！',
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
    insectFieldEmoji: '⚡',
    insectFieldLabel: '黄金・レアの森',
    insectSpeechLabel: 'おうごんと レアの森！まぼろしの むしを さがそう！',
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
    insectFieldEmoji: '🌳',
    insectFieldLabel: 'にほんの雑木林',
    insectSpeechLabel: 'にほんの ぞうきばやし！カブトムシや クワガタが いるぞ！',
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

export const INSECT_TYPE_OPTIONS: KaijuTypeOption[] = [
  {
    id: 'kabuto',
    emoji: '🪲',
    label: 'カブトムシ系',
    speechLabel: 'カブトムシの なかま！おおきな ツノで つきあげるぞ！',
  },
  {
    id: 'kuwagata',
    emoji: '✂️',
    label: 'クワガタ系',
    speechLabel: 'クワガタの なかま！おおアゴで ガッチリ はさむぞ！',
  },
  {
    id: 'hunter',
    emoji: '🐝',
    label: 'カマキリ・ハチ系',
    speechLabel: 'ハンターこんちゅう！カマや ハリで ねらいうちだ！',
  },
  {
    id: 'flier',
    emoji: '🦋',
    label: 'トンボ・チョウ系',
    speechLabel: 'おおぞらの こんちゅう！すごい スピードで とぶぞ！',
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
  category?: CreatureCategory;
  insectStyle?: InsectVisualStyle;
  realColors?: { primary: string; secondary: string; accent: string };
  insectInfo?: InsectEducationalInfo;
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

const RAW_KAIJU_LIST: KaijuData[] = [
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

  // 💥 鳥山明風・特別コラボレーション怪獣 No.21〜24
  createCustomKaiju({
    id: 'fire-db-tyranno',
    dexNumber: 21,
    element: 'fire',
    type: 'dino',
    name: 'スーパーティラノ',
    roar: 'ハァァッ！カメハメ・ガオーッ！',
    specialMove: 'ちょうかえん気功波',
    stars: 5,
    titleBadge: '超サイヤせんし恐竜',
    description: '黄金に 逆立つ ほのおの 髪型！両手から はなつ『ちょうかえん気功波』は どんな 敵も ふきとばすぞ！',
  }),
  createCustomKaiju({
    id: 'water-arale-robo',
    dexNumber: 22,
    element: 'water',
    type: 'robot',
    name: 'カプセルポッポ',
    roar: 'キーン！んちゃ・ガシャン！',
    specialMove: 'んちゃ砲・ジェットスプラッシュ',
    stars: 5,
    titleBadge: 'ペンギン村の丸型メカ',
    description: '天使の 羽がついた まるっこい カプセルロボ！『んちゃ砲』から すさまじい 水流ビームを 発射するぞ！',
  }),
  createCustomKaiju({
    id: 'thunder-db-dragon',
    dexNumber: 23,
    element: 'thunder',
    type: 'dragon',
    name: 'スカウタードラゴ',
    roar: 'いでよ神龍！ピピッ！',
    specialMove: '戦闘力53万ボルト・サンダー',
    stars: 5,
    titleBadge: '戦闘力計測ドラゴン',
    description: '片目に 赤い スカウターを つけた 神秘の ドラゴン！あいての パワーを 計測して 電撃を お見舞いするぞ！',
  }),
  createCustomKaiju({
    id: 'nature-arale-gatchan',
    dexNumber: 24,
    element: 'nature',
    type: 'beast',
    name: 'ガッチャビースト',
    roar: 'クピポーーッ！バリバリッ！',
    specialMove: 'クピポ・メガバイト',
    stars: 5,
    titleBadge: 'むじゃきな天使モンスター',
    description: '頭に 天使の 輪と 小さな 羽を もつ 元気いっぱいビースト！どんな 硬い ものも バリバリ 食べちゃうぞ！',
  }),

  // 🔥💧⚡🌿 新追加・超個性派レジェンド怪獣 No.25〜28（各属性1体ずつ）
  createCustomKaiju({
    id: 'fire-goku-beast',
    dexNumber: 25,
    element: 'fire',
    type: 'beast',
    name: 'キン斗ゴクウ',
    roar: 'オッス！オラと しょうぶだーっ！',
    specialMove: 'にょいぼう・大車輪ファイヤー',
    stars: 5,
    titleBadge: '筋斗雲の 炎神モンキー',
    description: '黄金の 筋斗雲に のって 空を とぶ ほのおの バトルモンキー！のびる 如意棒で どんな 悪者も ぶっとばすぞ！',
    stageNames: ['プチキン斗ゴクウ', 'キン斗ゴクウ', '超ゴッドキン斗ゴクウ'],
  }),
  createCustomKaiju({
    id: 'water-plesio-dino',
    dexNumber: 26,
    element: 'water',
    type: 'dino',
    name: 'ブリザードプレシオ',
    roar: 'キュォォォーン！ザッパーン！',
    specialMove: 'ぜったいれいど・ブリザードカノン',
    stars: 5,
    titleBadge: 'ひょうがの 首長竜王',
    description: 'ながい 首と 氷の クリスタルアーマーを もつ 巨大な 首長竜！口から 絶対零度の 冷凍ビームを はっしゃするぞ！',
    stageNames: ['プチプレシオ', 'ブリザードプレシオ', 'キングブリザードプレシオ'],
  }),
  createCustomKaiju({
    id: 'thunder-shogun-robo',
    dexNumber: 27,
    element: 'thunder',
    type: 'robot',
    name: 'ライジンショーグンロボ',
    roar: 'イザ尋常に・サンダー斬り！！',
    specialMove: 'らいじん二刀流・イナズマスラッシュ',
    stars: 5,
    titleBadge: '二刀流・雷神武者ロボ',
    description: '黄金の 三日月カブトと 雷神太鼓を せおった 戦国将軍ロボット！2本の イナズマレーザー刀で 電光石火の 斬撃を くりだすぞ！',
    stageNames: ['プチショーグンロボ', 'ライジンショーグンロボ', '大将軍ライジンカイザー'],
  }),
  createCustomKaiju({
    id: 'nature-crystal-dragon',
    dexNumber: 28,
    element: 'nature',
    type: 'dragon',
    name: 'クリスタルシェンロン',
    roar: 'フォォォーン！ねがいを かなえよう！',
    specialMove: 'しんりん七星・エメラルドノヴァ',
    stars: 5,
    titleBadge: '七宝玉の 森林神龍',
    description: 'エメラルドと 虹色の クリスタルに かがやく 森の 東洋神龍！7つの 森の 宝玉から 神秘の エネルギー波を 放つぞ！',
    stageNames: ['プチシェンロン', 'クリスタルシェンロン', '神龍王クリスタルシェンロン'],
  }),

  // ⚡ ポケモン風・大人気モンスター No.29〜36（各属性2体ずつ・全8体）
  createCustomKaiju({
    id: 'fire-pkmn-salamander',
    dexNumber: 29,
    element: 'fire',
    type: 'dragon',
    name: 'サラマンドラ',
    roar: 'グワオーッ！メラメラッ！',
    specialMove: 'だいもんじ・フレアドライブ',
    stars: 5,
    titleBadge: 'しっぽに炎がともる 竜戦士',
    description: 'しっぽの 先に 炎を やどす 小さな 竜の せんし！ピンチに なると 炎が 爆発して 巨大な 竜の パワーを 発揮するぞ！',
    stageNames: ['プチサラマン', 'サラマンドラ', '紅蓮メガサラマンドラ'],
  }),
  createCustomKaiju({
    id: 'fire-pkmn-fox',
    dexNumber: 30,
    element: 'fire',
    type: 'beast',
    name: 'ヒノキツネ',
    roar: 'コンコン！フレアッ！',
    specialMove: 'かえんほうしゃ・きゅうびのまい',
    stars: 5,
    titleBadge: 'ふわもこ 炎の 子ギツネ',
    description: 'モフモフした 炎の しっぽを もつ チャーミングな 子ギツネ！うれしいと しっぽから キラキラした 火の粉を まきちらすぞ！',
    stageNames: ['プチヒノコ', 'ヒノキツネ', '炎神九尾・ヒノエンペラー'],
  }),
  createCustomKaiju({
    id: 'water-pkmn-turtle',
    dexNumber: 31,
    element: 'water',
    type: 'dino',
    name: 'アクアカメドン',
    roar: 'カメーッ！ザッパーン！',
    specialMove: 'ハイドロキャノン・ロケット体当たり',
    stars: 5,
    titleBadge: 'こうかく砲撃甲羅竜',
    description: 'かたい 甲羅の せなかに ２門の 水流キャノンを つんだ カメ恐竜！甲羅に こもって ロケットの ように 突撃するぞ！',
    stageNames: ['プチカメドン', 'アクアカメドン', '甲殻巨神ギガカメドン'],
  }),
  createCustomKaiju({
    id: 'water-pkmn-dragon',
    dexNumber: 32,
    element: 'water',
    type: 'dragon',
    name: 'アクアカイリュー',
    roar: 'キュロロローン！スプラッシュ！',
    specialMove: 'りゅうのいぶき・オーシャングライド',
    stars: 5,
    titleBadge: 'うみを泳ぐ 優雅な波乗り竜',
    description: 'クリスタルのような 角と 水滴の つばさを もつ やさしい 海竜！海を すべるように およぎ、大きな 波を あやつるぞ！',
    stageNames: ['プチウミリュウ', 'アクアカイリュー', '蒼海龍神ネオカイリュー'],
  }),
  createCustomKaiju({
    id: 'thunder-pkmn-mouse',
    dexNumber: 33,
    element: 'thunder',
    type: 'beast',
    name: 'ボルトチュウ',
    roar: 'ピッピカ！チューッ！',
    specialMove: 'ひゃくまんボルト・ボルテッカー',
    stars: 5,
    titleBadge: 'でんき袋の でんげきネズミ',
    description: '赤い ほっぺに 電気袋を もつ 大人気のでんきネズミ！イナズマ型の しっぽを ふりまわして 100万ボルトの 電撃を 放つぞ！',
    stageNames: ['プチボルト', 'ボルトチュウ', '超雷神ギガボルトチュウ'],
  }),
  createCustomKaiju({
    id: 'thunder-pkmn-gear',
    dexNumber: 34,
    element: 'thunder',
    type: 'robot',
    name: 'プラズマギア',
    roar: 'ピピピ・ジジジッ！電磁誘導！',
    specialMove: 'ちょうでんじ砲・マグネットボム',
    stars: 5,
    titleBadge: '空中浮遊の 磁石メカ',
    description: 'りょうてに 磁石を つけて 空中に フワフワ うく 不思議な ロボット！まわりの 金属を ひきよせて 強力な 電磁波ビームを うつぞ！',
    stageNames: ['プチギア', 'プラズマギア', '超電磁合体マグネカイザー'],
  }),
  createCustomKaiju({
    id: 'nature-pkmn-brachio',
    dexNumber: 35,
    element: 'nature',
    type: 'dino',
    name: 'ハナブラキオ',
    roar: 'パオーン！フワフワッ！',
    specialMove: 'ソーラービーム・つるのムチ',
    stars: 5,
    titleBadge: 'せなかに大輪が咲く 巨樹恐竜',
    description: 'せなかに 色あざやかな 巨大な 花を さかせた 首長恐竜！たいようの 光を 吸収して 強烈な ソーラービームを はっしゃするぞ！',
    stageNames: ['プチハナツボミ', 'ハナブラキオ', '大樹神メガハナブラキオ'],
  }),
  createCustomKaiju({
    id: 'nature-pkmn-golem',
    dexNumber: 36,
    element: 'nature',
    type: 'robot',
    name: 'フォレストゴーレム',
    roar: 'ゴゴゴ…森ヲマモル！',
    specialMove: 'ウッドハンマー・リーフセイバー',
    stars: 5,
    titleBadge: 'こけむす 古代植物メカ',
    description: '古代の 遺跡と 植物が 合体して うまれた 守護神ゴーレム！胸の エメラルドコアから 森の エネルギーを 両腕の 剣に 集めて 叩き斬る！',
    stageNames: ['プチゴーレム', 'フォレストゴーレム', '古代樹神エンペラーゴーレム'],
  }),

  // ⭐ じょうくん大興奮！大人気ポケモン・スーパースター No.37〜44（全8体）
  createCustomKaiju({
    id: 'fire-pkmn-charizard',
    dexNumber: 37,
    element: 'fire',
    type: 'dragon',
    name: 'リザードン',
    roar: 'ウォォォーッ！かえんほうしゃ！',
    specialMove: 'ブラストバーン・フレアドライブ',
    stars: 5,
    titleBadge: '灼熱のメガ進化かえん竜',
    description: 'しっぽの 先に 炎を やどす 伝説のかえん竜！キング形態に しんかすると メガリザードンに なり、青い炎の 翼で 大空から 究極の 一撃を 放つぞ！',
    stageNames: ['ヒトカゲ', 'リザードン', 'メガリザードン'],
  }),
  createCustomKaiju({
    id: 'fire-pkmn-scorbunny',
    dexNumber: 38,
    element: 'fire',
    type: 'beast',
    name: 'ヒバニー',
    roar: 'バニバニッ！ファイヤーー！',
    specialMove: 'かえんボール・ニトロチャージ',
    stars: 5,
    titleBadge: 'げんきいっぱい 炎のウサギ',
    description: '鼻に バンドエイドを つけた 元気いっぱいの 炎ウサギ！キング形態に しんかすると エースバーンに なり、足技と 巨大な 火炎ボールで ゴールを 奪うぞ！',
    stageNames: ['ヒバニー', 'ラビフット', 'エースバーン'],
  }),
  createCustomKaiju({
    id: 'water-pkmn-greninja',
    dexNumber: 39,
    element: 'water',
    type: 'beast',
    name: 'ゲッコウガ',
    roar: 'コォォッ！水遁・みずしゅりけん！',
    specialMove: 'きょだい水しゅりけん・アクアブレイク',
    stars: 5,
    titleBadge: '神出鬼没の水流ニンジャ',
    description: '舌のマフラーを 首に まいた 水の ニンジャ！キング形態に しんかすると サトシゲッコウガに なり、背中の 巨大な 水手裏剣を 投げつけるぞ！',
    stageNames: ['ケロマツ', 'ゲコガシラ', 'サトシゲッコウガ'],
  }),
  createCustomKaiju({
    id: 'water-pkmn-piplup',
    dexNumber: 40,
    element: 'water',
    type: 'dino',
    name: 'ポッチャマ',
    roar: 'ポチャポチャッ！ザッパーン！',
    specialMove: 'ハイドロポンプ・ドリルくちばし',
    stars: 5,
    titleBadge: 'プライド高き 水のペンギン',
    description: 'まあるい 姿と つぶらな 瞳が 大人気！キング形態に しんかすると 鋼鉄の 翼をもつ 皇帝エンペルトに なり、荒波を 切り裂くぞ！',
    stageNames: ['ポッチャマ', 'ポッタイシ', 'エンペルト'],
  }),
  createCustomKaiju({
    id: 'thunder-pkmn-lucario',
    dexNumber: 41,
    element: 'thunder',
    type: 'beast',
    name: 'ルカリオ',
    roar: 'ウォォッ！波導は 我にあり！',
    specialMove: 'はどうだん・インファイト',
    stars: 5,
    titleBadge: 'あおき波導の オーラ戦士',
    description: 'あいての 考えや 動きを 波導で 見通す かっこいい オーラ戦士！キング形態に しんかすると メガルカリオに なり、すべての 悪を 打ち砕く！',
    stageNames: ['リオル', 'ルカリオ', 'メガルカリオ'],
  }),
  createCustomKaiju({
    id: 'thunder-pkmn-miraidon',
    dexNumber: 42,
    element: 'thunder',
    type: 'dragon',
    name: 'ミライドン',
    roar: 'アギャッス！バリバリバーン！',
    specialMove: 'イナズマドライブ・ハドロンエンジン',
    stars: 5,
    titleBadge: 'みらいの いなずま伝説竜',
    description: '未来の 世界から やってきた 伝説の 雷竜！胸の ジェットエンジンから 超電撃を 放ち、光の スピードで 大空を かけぬけるぞ！',
    stageNames: ['ちびミライドン', 'ミライドン', 'アルティメットミライドン'],
  }),
  createCustomKaiju({
    id: 'nature-pkmn-eevee',
    dexNumber: 43,
    element: 'nature',
    type: 'beast',
    name: 'イーブイ',
    roar: 'ブイブイッ！♪',
    specialMove: 'とっておき・ナインエボルブースト',
    stars: 5,
    titleBadge: '可能性無限の もふもふ進化獣',
    description: 'もふもふの 首毛と 愛くるしい 瞳を もつ 大人気の モンスター！キング形態に しんかすると ぜんぶの 属性の 力を 宿した 奇跡の姿に なるぞ！',
    stageNames: ['イーブイ', 'ニンフィア', 'レインボーイーブイキング'],
  }),
  createCustomKaiju({
    id: 'nature-pkmn-bulbasaur',
    dexNumber: 44,
    element: 'nature',
    type: 'dino',
    name: 'フシギダネ',
    roar: 'ダネダネッ！フシギッ！',
    specialMove: 'ソーラービーム・はなふぶき',
    stars: 5,
    titleBadge: '背中にタネをもつ 不思議恐竜',
    description: '背中に 植物の タネを せおった ふしぎな 恐竜！キング形態に しんかすると メガフシギバナに なり、大自然の ソーラービームを はなつぞ！',
    stageNames: ['フシギダネ', 'フシギソウ', 'メガフシギバナ'],
  }),

  // =========================================================================
  // 😈 ドラクエ風・伝説の4大魔王（ボス討伐でまれに仲間になる！ No.45〜No.48）
  // =========================================================================
  createCustomKaiju({
    id: 'fire-dq-ryuo',
    dexNumber: 45,
    element: 'fire',
    type: 'dragon',
    name: 'りゅうおう',
    roar: 'フォッフォッフォ！世界の半分を やろう！',
    specialMove: 'しゃくねつの 業火・ベギラゴン',
    stars: 5,
    titleBadge: '世界の半分を統べる 悪の化身',
    description: '紫の 魔道士から 巨大な 紫の ドラゴンへと 変身する 伝説の大魔王！キング形態に しんかすると 闇の覇者・真りゅうおうとなり 灼熱の 煉獄炎を 吐きだすぞ！',
    stageNames: ['りゅうおう(魔道士)', '竜王(ドラゴン)', '闇の覇者・真りゅうおう'],
  }),
  createCustomKaiju({
    id: 'water-dq-hargon',
    dexNumber: 46,
    element: 'water',
    type: 'dino',
    name: 'ハーゴン＆シドー',
    roar: 'グオォォォッ！すべてを 破壊する！！',
    specialMove: '絶対零度・邪神イオナズン',
    stars: 5,
    titleBadge: '邪神官が呼び出しし 破壊の邪神',
    description: '邪神の 杖を あやつる 大神官ハーゴンと、6本腕をもつ 破壊神シドーの 最強大魔王タッグ！キング形態に しんかすると 邪神の 真の力が 解き放たれるぞ！',
    stageNames: ['大神官ハーゴン', '破壊神シドー', '邪神ハーゴン＆真シドー'],
  }),
  createCustomKaiju({
    id: 'thunder-dq-dreamb',
    dexNumber: 47,
    element: 'thunder',
    type: 'robot',
    name: 'ダークドレアム',
    roar: 'ワタシハ 破壊ト 殺リクノ 神ナリ！！',
    specialMove: 'ギガスロー・グランドクロス',
    stars: 5,
    titleBadge: '二刀流の魔剣をもつ 破壊と殺りくの神',
    description: '巨大な 二刀流の 魔神剣を ふるい、黄金の 雷で すべてを なぎ払う 伝説の魔神！キング形態に しんかすると どんな 大魔王をも 圧倒する 究極の力を 得るぞ！',
    stageNames: ['プチドレアム', '魔神ダークドレアム', '破壊神・真ダークドレアム'],
  }),
  createCustomKaiju({
    id: 'nature-dq-pisaro',
    dexNumber: 48,
    element: 'nature',
    type: 'beast',
    name: 'デスピサロ',
    roar: 'グガァァァッ！進化の秘法よ！！',
    specialMove: 'いてつく波動・暗黒マダンテ',
    stars: 5,
    titleBadge: '進化の秘法で 覚醒せし 魔族の王',
    description: '黄金の うでわで「進化の秘法」を つかい、4本の 剛腕をもつ 巨大魔獣へと 変貌した 魔族の王！キング形態に しんかすると 神をも 超える 究極進化をとげるぞ！',
    stageNames: ['魔剣士ピサロ', 'デスピサロ', '究極進化・真デスピサロ'],
  }),

  // =========================================================================
  // 🪲 実在こんちゅう大図鑑 No.25〜No.60（全36種）
  // =========================================================================

  // --- カブトムシ系（kabuto：10種 No.25〜No.34） ---
  createCustomKaiju({
    id: 'nature-kabuto-1',
    dexNumber: 25,
    category: 'insect',
    element: 'nature',
    type: 'kabuto',
    name: 'カブトムシ',
    insectStyle: 'y-horn',
    roar: 'ブォォン！ガツン！',
    specialMove: 'すくいあげ ツノなげ',
    stars: 5,
    titleBadge: '日本の森の王様',
    description: '先が4つに分かれたY字のツノで、あいてを豪快に投げ飛ばす日本の大人気カブトムシ！',
    realColors: { primary: '#5c2818', secondary: '#3e1a0f', accent: '#fbbf24' },
    insectInfo: {
      habitat: '日本のクヌギやコナラの雑木林',
      food: 'あまい樹液・昆虫ゼリー',
      realSize: '約 6〜8 センチ',
      trivia: '先が4つに分かれたY字のツノを相手のお腹の下に入れて、豪快に投げ飛ばす日本の森の王様！',
    },
  }),
  createCustomKaiju({
    id: 'nature-kabuto-2',
    dexNumber: 26,
    category: 'insect',
    element: 'nature',
    type: 'kabuto',
    name: 'コカブト',
    insectStyle: 'y-horn',
    roar: 'ブブッ！カチッ！',
    specialMove: 'ミニホーン・タックル',
    stars: 4,
    titleBadge: '肉食のミニカブト',
    description: '小柄だけど力持ち！樹液ではなく他の小さな虫を食べる珍しい肉食カブトムシ！',
    realColors: { primary: '#1e293b', secondary: '#334155', accent: '#94a3b8' },
    insectInfo: {
      habitat: '日本の森や林',
      food: 'ほかの小さな虫（肉食）',
      realSize: '約 2 センチ',
      trivia: '樹液ではなく他の虫を食べる珍しいカブトムシ！胸に丸いへこみがあるのが特徴だよ！',
    },
  }),
  createCustomKaiju({
    id: 'fire-kabuto-1',
    dexNumber: 27,
    category: 'insect',
    element: 'fire',
    type: 'kabuto',
    name: 'ヘラクレスオオカブト',
    insectStyle: 'long-horn',
    roar: 'ブォォォン！ガシィッ！',
    specialMove: 'ヘラクレス・ギガホーン投げ',
    stars: 5,
    titleBadge: '世界最大のカブトムシ',
    description: '世界最長の巨大なツノをもつ無敵の王者！自分の体重の100倍を持ち上げる怪力！',
    realColors: { primary: '#eab308', secondary: '#1e293b', accent: '#fef08a' },
    insectInfo: {
      habitat: '中南米の熱帯雨林（ジャングル）',
      food: '樹液や腐ったフルーツ',
      realSize: '約 15〜17 センチ（世界最大！）',
      trivia: '世界でいちばん大きなカブトムシ！自分の体重の100倍もの重さを持ち上げられる超ちからもち！',
    },
  }),
  createCustomKaiju({
    id: 'fire-kabuto-2',
    dexNumber: 28,
    category: 'insect',
    element: 'fire',
    type: 'kabuto',
    name: 'エレファスゾウカブト',
    insectStyle: 'heavy-beetle',
    roar: 'ズシィィン！ブォン！',
    specialMove: 'ヘビー級 メガスタンプ',
    stars: 5,
    titleBadge: '世界最重量の重戦車',
    description: 'カブトムシの中で体重世界一！全身に黄金色のビロード毛が生えた巨大重戦車！',
    realColors: { primary: '#ca8a04', secondary: '#422006', accent: '#fde047' },
    insectInfo: {
      habitat: 'メキシコ〜中央アメリカの森',
      food: '樹液や甘い果物',
      realSize: '約 12〜13 センチ（世界最重量！）',
      trivia: 'カブトムシの中で体重が世界一おもい重戦車！体中に黄色くて細かいビロードのような毛が生えているよ！',
    },
  }),
  createCustomKaiju({
    id: 'fire-kabuto-3',
    dexNumber: 29,
    category: 'insect',
    element: 'fire',
    type: 'kabuto',
    name: 'ゴライアスオオツノハナムグリ',
    insectStyle: 'heavy-beetle',
    roar: 'ブォォォーーン！',
    specialMove: 'ゴライアス・ジェット体当たり',
    stars: 5,
    titleBadge: '世界最大級のコガネムシ',
    description: '白と黒の幾何学模様が超クール！ジェット機のように高速飛行する巨大甲虫！',
    realColors: { primary: '#f8fafc', secondary: '#451a03', accent: '#f59e0b' },
    insectInfo: {
      habitat: 'アフリカのジャングル',
      food: '樹液や熟した果物',
      realSize: '約 10〜11 センチ',
      trivia: '白と黒のカッコいいしま模様！後ろ羽だけを広げてジェット機のように速く飛ぶ世界最大級のコガネムシ！',
    },
  }),
  createCustomKaiju({
    id: 'water-kabuto-1',
    dexNumber: 30,
    category: 'insect',
    element: 'water',
    type: 'kabuto',
    name: 'ネプチューンオオカブト',
    insectStyle: 'three-horn',
    roar: 'ブォン！ザッパーン！',
    specialMove: 'ネプチューン・4本ヅノホールド',
    stars: 5,
    titleBadge: '海の神の名をもつ漆黒大角',
    description: '長い胸角の横に2本の小角を持つ合計4本ツノ！漆黒のボディが神々しい大カブト！',
    realColors: { primary: '#0f172a', secondary: '#1e293b', accent: '#38bdf8' },
    insectInfo: {
      habitat: '南米アンデス山脈の涼しい森',
      food: '木や果物の汁',
      realSize: '約 13〜14 センチ',
      trivia: '海の神様（ネプチューン）の名前を持ち、長いツノの横に小さなツノがある合計4本ツノの黒い大カブト！',
    },
  }),
  createCustomKaiju({
    id: 'water-kabuto-2',
    dexNumber: 31,
    category: 'insect',
    element: 'water',
    type: 'kabuto',
    name: 'サタンオオカブト',
    insectStyle: 'long-horn',
    roar: 'ブォォン！シュバッ！',
    specialMove: 'サタン・クラウドバスター',
    stars: 5,
    titleBadge: '霧の森の幻黒カブト',
    description: '雲の上の霧深い森に棲む幻の黒カブト！胸角の裏側に生えるオレンジ色の毛が目印！',
    realColors: { primary: '#1e293b', secondary: '#0f172a', accent: '#f97316' },
    insectInfo: {
      habitat: 'ボリビアの霧が深い山の森',
      food: '樹液や果物',
      realSize: '約 10〜11 センチ',
      trivia: '雲の上の涼しい森にだけ住む幻の黒カブト！上のツノの裏側にオレンジ色のフサフサした毛が生えているよ！',
    },
  }),
  createCustomKaiju({
    id: 'thunder-kabuto-1',
    dexNumber: 32,
    category: 'insect',
    element: 'thunder',
    type: 'kabuto',
    name: 'コーカサスオオカブト',
    insectStyle: 'three-horn',
    roar: 'バリバリッ！ブォォン！',
    specialMove: 'スリーホーン・フルチャージ',
    stars: 5,
    titleBadge: 'アジア最強の暴れん坊',
    description: '金属光沢の青緑ボディと3本の長大なツノ！相手を挟み上げてへし折るアジア最強格！',
    realColors: { primary: '#064e3b', secondary: '#0f172a', accent: '#facc15' },
    insectInfo: {
      habitat: '東南アジアのジャングル',
      food: '樹液や甘い果物',
      realSize: '約 12〜13 センチ',
      trivia: '3本の長いツノと青緑に光る金属のようなボディを持つ、アジア最強の暴れん坊カブトムシ！',
    },
  }),
  createCustomKaiju({
    id: 'thunder-kabuto-2',
    dexNumber: 33,
    category: 'insect',
    element: 'thunder',
    type: 'kabuto',
    name: 'アトラスオオカブト',
    insectStyle: 'three-horn',
    roar: 'ブォン！ガシィッ！',
    specialMove: 'アトラス・トリプルホーン',
    stars: 4,
    titleBadge: '巨人神のトリプルホーン',
    description: '天を支える巨人の名をもつ3本角！敏捷な動きと激しい闘争心で大人気のカブト！',
    realColors: { primary: '#451a03', secondary: '#1c1917', accent: '#fbbf24' },
    insectInfo: {
      habitat: '東南アジアの森',
      food: '樹液や果物',
      realSize: '約 8〜10 センチ',
      trivia: '地球を支える巨人の神様「アトラス」の名前がついた、3本ツノがカッコいい大人気カブトムシ！',
    },
  }),
  createCustomKaiju({
    id: 'thunder-kabuto-3',
    dexNumber: 34,
    category: 'insect',
    element: 'thunder',
    type: 'kabuto',
    name: 'ゴホンヅノカブト',
    insectStyle: 'three-horn',
    roar: 'ブォォン！ドゴォン！',
    specialMove: 'ファイブホーン・クラッシュ',
    stars: 5,
    titleBadge: '驚異の五本角甲虫',
    description: '頭と胸に合計5本ものツノ！鮮やかな黄褐色の上羽をもち、竹林に集まる珍種！',
    realColors: { primary: '#d97706', secondary: '#1e293b', accent: '#fde047' },
    insectInfo: {
      habitat: '東南アジアの高い山の竹林',
      food: '竹から出る樹液',
      realSize: '約 7〜8 センチ',
      trivia: 'なんと頭と胸に合計5本ものツノが生えているびっくりカブトムシ！黄色い羽もおしゃれだね！',
    },
  }),

  // --- クワガタムシ系（kuwagata：9種 No.35〜No.43） ---
  createCustomKaiju({
    id: 'nature-kuwagata-1',
    dexNumber: 35,
    category: 'insect',
    element: 'nature',
    type: 'kuwagata',
    name: 'オオクワガタ',
    insectStyle: 'o-jaw',
    roar: 'ガシィッ！ギチチッ！',
    specialMove: 'おおアゴ まんりきばさみ',
    stars: 5,
    titleBadge: '日本の黒いダイヤ',
    description: '極太の大アゴと重厚な黒光り！3〜4年も長生きする日本を代表するクワガタの王様！',
    realColors: { primary: '#1e293b', secondary: '#0f172a', accent: '#ef4444' },
    insectInfo: {
      habitat: '日本のクヌギの古い森',
      food: 'クヌギの甘い樹液',
      realSize: '約 5〜7.5 センチ',
      trivia: '「黒いダイヤ」と呼ばれる日本のクワガタの王様！木の穴（ウロ）に隠れて冬眠し、3〜4年も長生きするよ！',
    },
  }),
  createCustomKaiju({
    id: 'nature-kuwagata-2',
    dexNumber: 36,
    category: 'insect',
    element: 'nature',
    type: 'kuwagata',
    name: 'ノコギリクワガタ',
    insectStyle: 'curved-jaw',
    roar: 'ジャキィン！ガシッ！',
    specialMove: 'すいぎゅう ギザギザなげ',
    stars: 4,
    titleBadge: '水牛大顎のファイター',
    description: '水牛のツノのように湾曲したギザギザ大アゴ！赤褐色で戦闘力バツグンの人気者！',
    realColors: { primary: '#7c2d12', secondary: '#431407', accent: '#fb923c' },
    insectInfo: {
      habitat: '日本の雑木林',
      food: 'クヌギやコナラの樹液',
      realSize: '約 5〜7 センチ',
      trivia: '水牛（ウシ）のツノのように大きく曲がったギザギザの大アゴが自慢！木を蹴るとポロッと落ちてくるよ！',
    },
  }),
  createCustomKaiju({
    id: 'nature-kuwagata-3',
    dexNumber: 37,
    category: 'insect',
    element: 'nature',
    type: 'kuwagata',
    name: 'ミヤマクワガタ',
    insectStyle: 'crown-jaw',
    roar: 'ギチチッ！ガシィン！',
    specialMove: 'おうかん ミヤマホールド',
    stars: 5,
    titleBadge: '深山の王冠クワガタ',
    description: '頭の後ろに王冠状の突起と金色の微毛！涼しい高山を好む気品あふれるクワガタ！',
    realColors: { primary: '#78350f', secondary: '#451a03', accent: '#facc15' },
    insectInfo: {
      habitat: '日本の涼しい山の森',
      food: '樹液',
      realSize: '約 5〜7.5 センチ',
      trivia: '「ミヤマ」は深い山という意味！頭の後ろに王冠のような出っ張りがあり、体に金色のうぶ毛が生えているよ！',
    },
  }),
  createCustomKaiju({
    id: 'fire-kuwagata-1',
    dexNumber: 38,
    category: 'insect',
    element: 'fire',
    type: 'kuwagata',
    name: 'ギラファノコギリクワガタ',
    insectStyle: 'long-jaw',
    roar: 'シャキィィン！ガシッ！',
    specialMove: 'ロングシザー・ギロチン',
    stars: 5,
    titleBadge: '世界最長のキリンクワガタ',
    description: '体長の半分を占める超長大なギザギザ大アゴ！キリンの名をもつ世界最長のクワガタ！',
    realColors: { primary: '#1e293b', secondary: '#ea580c', accent: '#fde047' },
    insectInfo: {
      habitat: '東南アジアの森',
      food: '広葉樹の樹液',
      realSize: '約 11〜12 センチ（世界最長！）',
      trivia: '「ギラファ」はキリンという意味！体の半分くらいある超ロングな大アゴを持つ、世界でいちばん長いクワガタ！',
    },
  }),
  createCustomKaiju({
    id: 'fire-kuwagata-2',
    dexNumber: 39,
    category: 'insect',
    element: 'fire',
    type: 'kuwagata',
    name: 'パラワンオオヒラタクワガタ',
    insectStyle: 'o-jaw',
    roar: 'ゴキィッ！ガシィィン！',
    specialMove: 'パラワン・クラッシュバイス',
    stars: 5,
    titleBadge: '挟力世界最強の巨兵',
    description: '太く長い大アゴの挟む力は甲虫界最強！どんな相手も真っ二つにする無敗のファイター！',
    realColors: { primary: '#0f172a', secondary: '#334155', accent: '#f43f5e' },
    insectInfo: {
      habitat: 'フィリピンのパラワン島',
      food: '樹液や果物',
      realSize: '約 10〜11 センチ',
      trivia: '挟む力がクワガタの中で世界最強クラス！指を挟まれると血が出るほどパワフルなファイターだよ！',
    },
  }),
  createCustomKaiju({
    id: 'water-kuwagata-1',
    dexNumber: 40,
    category: 'insect',
    element: 'water',
    type: 'kuwagata',
    name: 'ニジイロクワガタ',
    insectStyle: 'curved-jaw',
    roar: 'キララン♪ ガシッ！',
    specialMove: 'レインボー・プリズムはさみ',
    stars: 5,
    titleBadge: '世界一美しい七色甲虫',
    description: '緑・赤・金の七色に輝く奇跡のクワガタ！反り上がった大アゴも特徴的な美の象徴！',
    realColors: { primary: '#0d9488', secondary: '#db2777', accent: '#facc15' },
    insectInfo: {
      habitat: 'オーストラリアの熱帯雨林',
      food: '樹液',
      realSize: '約 5〜6 センチ',
      trivia: '光の当たり方で緑・赤・青の七色にピカピカ輝く、世界でいちばん美しいクワガタムシ！',
    },
  }),
  createCustomKaiju({
    id: 'water-kuwagata-2',
    dexNumber: 41,
    category: 'insect',
    element: 'water',
    type: 'kuwagata',
    name: 'ルリクワガタ',
    insectStyle: 'o-jaw',
    roar: 'キラーン♪ カチッ！',
    specialMove: 'サファイア・ミニピンチ',
    stars: 4,
    titleBadge: '瑠璃色の宝石ミニクワガタ',
    description: '青く美しく輝く小さな宝石クワガタ！ブナの高山林でひっそり暮らす幻の美虫！',
    realColors: { primary: '#2563eb', secondary: '#1e3a8a', accent: '#93c5fd' },
    insectInfo: {
      habitat: '日本の高い山のブナ林',
      food: '木の芽の汁',
      realSize: '約 1.2 センチ',
      trivia: '小指の爪くらい小さいけれど、青い宝石サファイアのようにキラキラ輝く森の宝物だよ！',
    },
  }),
  createCustomKaiju({
    id: 'thunder-kuwagata-1',
    dexNumber: 42,
    category: 'insect',
    element: 'thunder',
    type: 'kuwagata',
    name: 'オウゴンオニクワガタ',
    insectStyle: 'long-jaw',
    roar: 'ピカーン！ジャキィン！',
    specialMove: 'ゴールデン・シザーブレイク',
    stars: 5,
    titleBadge: '全身黄金の金メダル甲虫',
    description: '乾くと全身が金メダルのように眩しく輝く！波打つ大アゴをもつ黄金の鬼クワガタ！',
    realColors: { primary: '#eab308', secondary: '#a16207', accent: '#fef08a' },
    insectInfo: {
      habitat: '東南アジアの高い山の森',
      food: '樹液',
      realSize: '約 7〜8 センチ',
      trivia: '全身が金メダルのようにピカピカの黄金色！雨が降ると黒っぽくなり、乾くとまた金色に戻る不思議なクワガタ！',
    },
  }),
  createCustomKaiju({
    id: 'thunder-kuwagata-2',
    dexNumber: 43,
    category: 'insect',
    element: 'thunder',
    type: 'kuwagata',
    name: 'タランドゥスオオツヤクワガタ',
    insectStyle: 'o-jaw',
    roar: 'ブルブルッ！ガシィン！',
    specialMove: 'バイブレーション・クラッシュ',
    stars: 5,
    titleBadge: '漆黒ピアノ光沢の震動王',
    description: 'ピアノのように艶やかな黒漆の体！威嚇するときに全身をバイブレーション震動させる！',
    realColors: { primary: '#090d16', secondary: '#334155', accent: '#fde047' },
    insectInfo: {
      habitat: 'アフリカのコンゴの森',
      food: '樹液やキノコ',
      realSize: '約 8〜9 センチ',
      trivia: 'グランドピアノのように黒くてツヤツヤ！威嚇するときに携帯電話みたいにブルブル体を震わせるよ！',
    },
  }),

  // --- カマキリ・ハチ・水生・甲虫系（hunter：9種 No.44〜No.52） ---
  createCustomKaiju({
    id: 'nature-hunter-1',
    dexNumber: 44,
    category: 'insect',
    element: 'nature',
    type: 'hunter',
    name: 'オオカマキリ',
    insectStyle: 'mantis',
    roar: 'シャキィン！シュバッ！',
    specialMove: 'でんこうせっか カマおとし',
    stars: 5,
    titleBadge: '草むらの名ハンター',
    description: 'トゲの生えた2本の大カマを電光石火で振り下ろす！草むら最強のプレデター！',
    realColors: { primary: '#16a34a', secondary: '#15803d', accent: '#bbf7d0' },
    insectInfo: {
      habitat: '日本の草原や森のまわり',
      food: 'バッタやチョウなどの虫',
      realSize: '約 8〜9.5 センチ',
      trivia: 'ギザギザのトゲがついた2本の大きなカマを0.1秒以下の速さで振り下ろす、草むらの名ハンター！',
    },
  }),
  createCustomKaiju({
    id: 'nature-hunter-2',
    dexNumber: 45,
    category: 'insect',
    element: 'nature',
    type: 'hunter',
    name: 'ナナホシテントウ',
    insectStyle: 'ladybug-jewel',
    roar: 'プイーン♪ キラッ！',
    specialMove: 'ラッキー・セブンアタック',
    stars: 4,
    titleBadge: '畑をまもる赤の星',
    description: '鮮やかな赤い背中に黒い星が7つ！害虫アブラムシを退治してくれる畑の味方！',
    realColors: { primary: '#ef4444', secondary: '#0f172a', accent: '#fde047' },
    insectInfo: {
      habitat: '日本中の野原・畑・公園',
      food: 'アブラムシ（野菜の害虫）',
      realSize: '約 0.8 センチ',
      trivia: '真っ赤な背中に黒い星が7つ！大切な野菜を枯らすアブラムシを毎日たくさん食べてくれる正義の味方！',
    },
  }),
  createCustomKaiju({
    id: 'nature-hunter-3',
    dexNumber: 46,
    category: 'insect',
    element: 'nature',
    type: 'hunter',
    name: 'ヤマトタマムシ',
    insectStyle: 'ladybug-jewel',
    roar: 'キラーン！ブーン♪',
    specialMove: 'エメラルド・ジュエルフラッシュ',
    stars: 5,
    titleBadge: '千年褪せぬ虹色の国宝虫',
    description: '緑と赤の金属光沢ストライプ！死後も何千年も色あせない日本の伝統的な宝石昆虫！',
    realColors: { primary: '#10b981', secondary: '#e11d48', accent: '#fde047' },
    insectInfo: {
      habitat: '日本のエノキやケヤキの森',
      food: 'エノキの葉っぱ',
      realSize: '約 3〜4 センチ',
      trivia: '何千年も色が消えない緑と赤の虹色ボディ！昔のお姫様の宝箱（玉虫厨子）の飾りにも使われた日本の宝石昆虫！',
    },
  }),
  createCustomKaiju({
    id: 'fire-hunter-1',
    dexNumber: 47,
    category: 'insect',
    element: 'fire',
    type: 'hunter',
    name: 'ハナカマキリ',
    insectStyle: 'mantis',
    roar: 'ヒラヒラ♪ シャキィン！',
    specialMove: 'フラワー・カモフラージュ斬り',
    stars: 5,
    titleBadge: '蘭の花に擬態する妖精',
    description: 'ピンクと白のランの花びらに完全擬態！蜜を吸いに来た獲物を一撃で仕留める！',
    realColors: { primary: '#f472b6', secondary: '#fdf2f8', accent: '#fde047' },
    insectInfo: {
      habitat: '東南アジアの熱帯雨林',
      food: '花に来るチョウやハチ',
      realSize: '約 6 センチ',
      trivia: 'ピンクと白の美しいランのお花にそっくり！自分がお花になりきって、蜜を吸いに来た虫をキャッチするよ！',
    },
  }),
  createCustomKaiju({
    id: 'fire-hunter-2',
    dexNumber: 48,
    category: 'insect',
    element: 'fire',
    type: 'hunter',
    name: 'カレハカマキリ',
    insectStyle: 'mantis',
    roar: 'カサカサ…シュバッ！',
    specialMove: 'かれは・シャドウストライク',
    stars: 4,
    titleBadge: '枯葉に溶け込む忍者',
    description: '胸の広がりも羽も本物の枯れ葉そのもの！見破ることが不可能な擬態の達人！',
    realColors: { primary: '#92400e', secondary: '#451a03', accent: '#fcd34d' },
    insectInfo: {
      habitat: '東南アジアの森',
      food: '小さな昆虫',
      realSize: '約 8 センチ',
      trivia: '胸や足に葉っぱのようなヒラヒラがついていて、茶色い枯れ葉にしか見えないかくれんぼの天才忍者！',
    },
  }),
  createCustomKaiju({
    id: 'water-hunter-1',
    dexNumber: 49,
    category: 'insect',
    element: 'water',
    type: 'hunter',
    name: 'タガメ',
    insectStyle: 'aquatic',
    roar: 'ザブッ！ガシィッ！',
    specialMove: 'すいちゅう タガメホールド',
    stars: 5,
    titleBadge: '水中の肉食王者',
    description: '強力な前足で魚やカエルを捕獲！お尻の呼吸管で水中に潜伏する日本最大の水生昆虫！',
    realColors: { primary: '#475569', secondary: '#1e293b', accent: '#38bdf8' },
    insectInfo: {
      habitat: 'きれいな田んぼや池',
      food: '小魚やカエル・オタマジャクシ',
      realSize: '約 5〜6.5 センチ',
      trivia: '水の中の最強ハンター！お尻の先にあるストローのような管を水面に出して息をしながら獲物を待ち伏せするよ！',
    },
  }),
  createCustomKaiju({
    id: 'water-hunter-2',
    dexNumber: 50,
    category: 'insect',
    element: 'water',
    type: 'hunter',
    name: 'ゲンゴロウ',
    insectStyle: 'aquatic',
    roar: 'スイスイ♪ ザッパーン！',
    specialMove: 'ハイドロ・スイムタックル',
    stars: 4,
    titleBadge: '水中のスピードスイマー',
    description: 'オールのような毛深い後ろ足で高速遊泳！水生甲虫界きってのトップスイマー！',
    realColors: { primary: '#064e3b', secondary: '#0f172a', accent: '#fbbf24' },
    insectInfo: {
      habitat: '水草のあるきれいな池や小川',
      food: '水の中の小さな生き物',
      realSize: '約 3.5〜4 センチ',
      trivia: '毛がたくさん生えた後ろ足をボートのオールのように同時に動かして、水の中をスイスイ高速で泳ぐ名人！',
    },
  }),
  createCustomKaiju({
    id: 'thunder-hunter-1',
    dexNumber: 51,
    category: 'insect',
    element: 'thunder',
    type: 'hunter',
    name: 'オオスズメバチ',
    insectStyle: 'hornet',
    roar: 'ブォォォン！カチカチッ！',
    specialMove: 'マッハ40・ニードルストライク',
    stars: 5,
    titleBadge: '時速40キロの空の猛毒針',
    description: '時速40キロで飛行する世界最大のスズメバチ！強力な毒針と大アゴをもつ最強ハンター！',
    realColors: { primary: '#f59e0b', secondary: '#0f172a', accent: '#fef08a' },
    insectInfo: {
      habitat: '日本やアジアの森',
      food: '樹液やほかの昆虫',
      realSize: '約 4〜5 センチ（世界最大のハチ！）',
      trivia: '時速40キロのスピードで1日に100キロも飛べる世界最大のハチ！森で見かけても絶対に近づかないでね！',
    },
  }),
  createCustomKaiju({
    id: 'thunder-hunter-2',
    dexNumber: 52,
    category: 'insect',
    element: 'thunder',
    type: 'hunter',
    name: 'プラチナコガネ',
    insectStyle: 'ladybug-jewel',
    roar: 'ピカーーン！キラッ！',
    specialMove: 'プラチナ・ミラーリフレクト',
    stars: 5,
    titleBadge: '白銀の純銀ミラー甲虫',
    description: '本物のプラチナ鏡のように景色を反射する！雲霧林に住む奇跡の白銀コガネムシ！',
    realColors: { primary: '#e2e8f0', secondary: '#94a3b8', accent: '#fef08a' },
    insectInfo: {
      habitat: '中央アメリカ・コスタリカの森',
      food: '木の葉っぱ',
      realSize: '約 2.5〜3 センチ',
      trivia: '塗装したのではなく、本物の銀や鏡のように自分の顔が映るほどピカピカ反射する奇跡の宝石コガネムシ！',
    },
  }),

  // --- トンボ・チョウ・バッタ・セミ系（flier：8種 No.53〜No.60） ---
  createCustomKaiju({
    id: 'nature-flier-1',
    dexNumber: 53,
    category: 'insect',
    element: 'nature',
    type: 'flier',
    name: 'トノサマバッタ',
    insectStyle: 'hopper',
    roar: 'ビョーーーン！バサバサッ！',
    specialMove: 'スーパージャンプ・キック',
    stars: 4,
    titleBadge: '大跳躍の草原の殿様',
    description: 'ビル5階分に相当する圧倒的跳躍力！後ろ足の超ハイジャンプと力強い羽ばたき！',
    realColors: { primary: '#22c55e', secondary: '#78350f', accent: '#bbf7d0' },
    insectInfo: {
      habitat: '広い草原や川のちかく',
      food: 'ススキなどのイネ科の草',
      realSize: '約 5〜6.5 センチ',
      trivia: '太くて筋肉モリモリの後ろ足でハイジャンプ！人間でいうとビル5階建てを飛び越えるほどのジャンプ力だよ！',
    },
  }),
  createCustomKaiju({
    id: 'nature-flier-2',
    dexNumber: 54,
    category: 'insect',
    element: 'nature',
    type: 'flier',
    name: 'クマゼミ',
    insectStyle: 'cicada',
    roar: 'シャワシャワシャワーーッ！',
    specialMove: 'シャワシャワ・ソニックボイス',
    stars: 4,
    titleBadge: '大合唱の夏将軍',
    description: '透明な大羽と黒い剛健ボディ！夏の朝に大音量「シャワシャワ」と鳴く日本最大級のセミ！',
    realColors: { primary: '#1e293b', secondary: '#0f172a', accent: '#38bdf8' },
    insectInfo: {
      habitat: '日本の公園や森の木',
      food: '木の枝の汁（ストローの口で吸う）',
      realSize: '約 6〜7 センチ',
      trivia: '透明でキラキラした羽を持つ日本最大級のセミ！何年も土の中で暮らしてから、夏に地上へ出て大合唱するよ！',
    },
  }),
  createCustomKaiju({
    id: 'fire-flier-1',
    dexNumber: 55,
    category: 'insect',
    element: 'fire',
    type: 'flier',
    name: 'アレキサンドラトリバネアゲハ',
    insectStyle: 'butterfly',
    roar: 'バサバサッ！キラキラ♪',
    specialMove: 'ジャングル・ウイングストーム',
    stars: 5,
    titleBadge: '世界最大の伝説の巨蝶',
    description: '開長約28cm！鳥のように巨大でエメラルドと黄金に輝く、世界で最も大きな蝶！',
    realColors: { primary: '#10b981', secondary: '#0f172a', accent: '#fde047' },
    insectInfo: {
      habitat: 'パプアニューギニアの熱帯雨林',
      food: 'ハイビスカスなどの花の蜜',
      realSize: '羽を広げて 約 28 センチ（世界最大！）',
      trivia: '鳥（トリ）の羽のように大きくてエメラルド色に輝く、世界でいちばん大きな伝説のチョウチョ！',
    },
  }),
  createCustomKaiju({
    id: 'fire-flier-2',
    dexNumber: 56,
    category: 'insect',
    element: 'fire',
    type: 'flier',
    name: 'ナミアゲハ',
    insectStyle: 'butterfly',
    roar: 'ヒラヒラ♪ フワッ！',
    specialMove: 'スワローテイル・ダンス',
    stars: 4,
    titleBadge: '親しみ深き黄の燕尾蝶',
    description: '黄色と黒の優雅なアゲハ模様！お庭や野原を軽やかに舞う日本で最も身近な名蝶！',
    realColors: { primary: '#facc15', secondary: '#1e293b', accent: '#ef4444' },
    insectInfo: {
      habitat: '日本中の庭・公園・野原',
      food: 'お花の蜜（幼虫はミカンの葉）',
      realSize: '羽を広げて 約 9〜11 センチ',
      trivia: '緑色の幼虫（アオムシ）は、鳥に食べられないように頭からオレンジ色の臭いツノを出してビックリさせるよ！',
    },
  }),
  createCustomKaiju({
    id: 'water-flier-1',
    dexNumber: 57,
    category: 'insect',
    element: 'water',
    type: 'flier',
    name: 'モルフォチョウ',
    insectStyle: 'butterfly',
    roar: 'キラリーン♪ ヒラヒラ！',
    specialMove: 'かがやく りんぷんフラッシュ',
    stars: 5,
    titleBadge: '生きた宝石の青の翅',
    description: '飛行機からも輝きが見える神秘のメタリックブルー！アマゾンに舞う生きた青い宝石！',
    realColors: { primary: '#0284c7', secondary: '#38bdf8', accent: '#e0f2fe' },
    insectInfo: {
      habitat: '中南米のアマゾン川流域の森',
      food: '熟した果物の汁や樹液',
      realSize: '羽を広げて 約 12〜15 センチ',
      trivia: '「生きた宝石」と呼ばれる青い羽は、飛行機の上からでもキラッと見えるほど強く光るんだよ！',
    },
  }),
  createCustomKaiju({
    id: 'water-flier-2',
    dexNumber: 58,
    category: 'insect',
    element: 'water',
    type: 'flier',
    name: 'ギンヤンマ',
    insectStyle: 'dragonfly',
    roar: 'ビュウウウン！ピタッ！',
    specialMove: 'ハイスピード・アクアグライド',
    stars: 5,
    titleBadge: '水辺の超音速グライダー',
    description: '鮮やかな黄緑と水色のボディ！水面すれすれを超高速で飛びピタッと止まる空中名人！',
    realColors: { primary: '#06b6d4', secondary: '#22c55e', accent: '#bae6fd' },
    insectInfo: {
      habitat: '池や田んぼ・小川の上空',
      food: '空を飛んでいる蚊やハエ',
      realSize: '約 7〜8 センチ',
      trivia: '胸が緑色でお腹が鮮やかな水色！日本最速クラスのスピードで飛び、空中でピタッと止まるホバリングも得意！',
    },
  }),
  createCustomKaiju({
    id: 'thunder-flier-1',
    dexNumber: 59,
    category: 'insect',
    element: 'thunder',
    type: 'flier',
    name: 'オニヤンマ',
    insectStyle: 'dragonfly',
    roar: 'ブォォォン！ギュイーン！',
    specialMove: 'じそく70キロ スカイダイブ',
    stars: 5,
    titleBadge: '時速70キロの空の王者',
    description: 'エメラルドグリーンの複眼と黄黒ストライプ！時速70kmで飛びハチすら捕食する日本最大のトンボ！',
    realColors: { primary: '#1e293b', secondary: '#facc15', accent: '#4ade80' },
    insectInfo: {
      habitat: '日本のきれいな小川や森',
      food: 'ハチやアブ・ほかのトンボ',
      realSize: '約 9〜11 センチ（日本最大のトンボ！）',
      trivia: 'エメラルドグリーンの大きな複眼と黄色と黒のしま模様！時速70キロで飛び、スズメバチさえ捕まえて食べる空の王者！',
    },
  }),
  createCustomKaiju({
    id: 'thunder-flier-2',
    dexNumber: 60,
    category: 'insect',
    element: 'thunder',
    type: 'flier',
    name: 'オオムラサキ',
    insectStyle: 'butterfly',
    roar: 'バサッ！ビシッ！',
    specialMove: 'エンペラー・パープルストーム',
    stars: 5,
    titleBadge: '日本の国蝶・紫の皇帝',
    description: '高貴な紫に輝く日本の国蝶！樹液の餌場でスズメバチも蹴散らす力強いタテハチョウ！',
    realColors: { primary: '#7c3aed', secondary: '#1e1b4b', accent: '#fde047' },
    insectInfo: {
      habitat: '日本のクヌギやエノキの雑木林',
      food: 'クヌギの樹液や熟した果物',
      realSize: '羽を広げて 約 10〜11 センチ',
      trivia: '日本の「国のチョウ（国蝶）」に選ばれている王様！花の蜜ではなく、カブトムシと一緒に木の樹液を飲みに来る力強いチョウだよ！',
    },
  }),
];

export const KAIJU_LIST: KaijuData[] = RAW_KAIJU_LIST.map((k, index) => ({
  ...k,
  dexNumber: index + 1,
}));

export const MAX_KAIJU_LEVEL = 10;

/**
 * レベルに応じた進化段階（1:キッズ期, 2:せいちょう期, 3:究極キング期）を返す
 * ★ プランA（Lv.10 MAX）：Lv.1〜4 キッズ期、Lv.5〜9 せいちょう期、Lv.10 究極キング
 */
export function getEvolutionStage(level: number): EvolutionStage {
  if (level <= 4) return 1;
  if (level <= 9) return 2;
  return 3;
}

/**
 * 怪獣の4つの習得技リストを返す（未指定の場合は属性×タイプから自動生成）
 * ★ レベル10までの成長に合わせて技を順次習得（Lv.1, Lv.3, Lv.7, Lv.10）
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
    kabuto: { name: 'ツノつきあげ', desc: 'じまんの ツノで したから ガツンと つきあげる 基本わざ！' },
    kuwagata: { name: 'おおアゴはさみ', desc: 'つよい おおアゴで ガッチリ はさみこむ 基本わざ！' },
    hunter: { name: 'ハンターストライク', desc: 'するどい カマや ハリで すばやく こうげきする 基本わざ！' },
    flier: { name: 'ハイスピード飛行', desc: '空から すごいスピードで たいあたりする 基本わざ！' },
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
      unlockLevel: 3,
      mpCost: 10,
      power: 50,
      description: eMid.desc,
    },
    {
      id: `${kaiju.id}-skill-3`,
      name: kaiju.specialMove,
      unlockLevel: 7,
      mpCost: 20,
      power: 80,
      description: `${kaiju.name} だけの ちょうきょうりょくな 必殺技だ！`,
    },
    {
      id: `${kaiju.id}-skill-4`,
      name: eUlt.name,
      unlockLevel: 10,
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
  const level = Math.min(MAX_KAIJU_LEVEL, Math.max(1, progress?.level ?? 1));
  const exp = Math.max(0, progress?.exp ?? 0);
  const nextLevelExp = 100;
  const stage = getEvolutionStage(level);
  const isMaxLevel = level >= MAX_KAIJU_LEVEL;

  let displayName = kaiju.name;
  let stageTitle =
    stage === 1
      ? '★ キッズ形態'
      : stage === 2
      ? '★★ せいちょう形態'
      : isMaxLevel
      ? '★★★ 究極キング形態【MAX】'
      : '★★★ キング形態';

  if (kaiju.category === 'insect') {
    if (stage === 1) {
      displayName = kaiju.stageNames?.[0] ?? `ちび${kaiju.name}`;
      stageTitle = '🌱 小型個体';
    } else if (stage === 2) {
      displayName = kaiju.stageNames?.[1] ?? kaiju.name;
      stageTitle = '🪲 成虫';
    } else {
      displayName = kaiju.stageNames?.[2] ?? `ギネス級${kaiju.name}`;
      stageTitle = isMaxLevel ? '👑 ギネス最大個体【MAX】' : '👑 ギネス級個体';
    }
  } else {
    if (stage === 1) {
      displayName = kaiju.stageNames?.[0] ?? `プチ${kaiju.name}`;
    } else if (stage === 2) {
      displayName = kaiju.stageNames?.[1] ?? kaiju.name;
    } else {
      displayName = kaiju.stageNames?.[2] ?? `キング${kaiju.name}`;
    }
  }

  // 3〜4ターン前後で白熱してサクッと決着がつくスピーディなバトルバランス
  const maxHp = 140 + kaiju.stars * 12 + (level - 1) * 22 + (stage - 1) * 35;
  const maxMp = 35 + kaiju.stars * 5 + (level - 1) * 6 + (stage - 1) * 12;
  const attack = 34 + kaiju.stars * 5 + (level - 1) * 9 + (stage - 1) * 14;
  const defense = 18 + kaiju.stars * 3 + (level - 1) * 4 + (stage - 1) * 8;
  const speed = 22 + (kaiju.type === 'beast' || kaiju.type === 'dragon' ? 10 : 4) + (level - 1) * 5;

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
  unlockedIds: string[],
  category: CreatureCategory = 'kaiju'
): KaijuData {
  const candidates = KAIJU_LIST.filter(
    (k) => (k.category ?? 'kaiju') === category && k.element === element && k.type === type
  );
  if (candidates.length === 0) {
    const fallback = KAIJU_LIST.filter((k) => (k.category ?? 'kaiju') === category);
    return fallback[0] ?? KAIJU_LIST[0];
  }

  const normalLocked = candidates.filter(
    (k) => !unlockedIds.includes(k.id) && !k.id.includes('-dq-')
  );
  if (normalLocked.length > 0) {
    return normalLocked[0];
  }

  const normalPool = candidates.filter((k) => !k.id.includes('-dq-'));
  const poolToPick = normalPool.length > 0 ? normalPool : candidates;
  const randomIndex = Math.floor(Math.random() * poolToPick.length);
  return poolToPick[randomIndex];
}

export function getElementMeta(element: ElementId): ElementOption {
  return ELEMENT_OPTIONS.find((e) => e.id === element) || ELEMENT_OPTIONS[0];
}

export function getTypeMeta(type: KaijuTypeId): KaijuTypeOption {
  const all = [...KAIJU_TYPE_OPTIONS, ...INSECT_TYPE_OPTIONS];
  return all.find((t) => t.id === type) || KAIJU_TYPE_OPTIONS[0];
}

/**
 * 属性相性判定関数
 * 相性ループ：fire（🔥ほのお）＞ nature（🌿しぜん）＞ thunder（⚡かみなり）＞ water（💧みず）＞ fire（🔥ほのお）
 */
export function getElementAdvantage(
  attackerEl: ElementId,
  defenderEl: ElementId
): { multiplier: number; label: string } {
  const winMap: Record<ElementId, ElementId> = {
    fire: 'nature',
    nature: 'thunder',
    thunder: 'water',
    water: 'fire',
  };

  if (winMap[attackerEl] === defenderEl) {
    return { multiplier: 1.3, label: '⚡ こうかは ばつぐんだ！！' };
  }
  if (winMap[defenderEl] === attackerEl) {
    return { multiplier: 0.8, label: '🛡️ いまひとつの ようだ…' };
  }
  return { multiplier: 1.0, label: '' };
}



export interface HeroRankInfo {
  title: string;
  badge: string;
  nextHint: string;
}

/**
 * 勇者称号判定ヘルパー
 */
export function getHeroRank(unlockedCount: number, totalLevelSum: number): HeroRankInfo {
  const score = unlockedCount * 2 + totalLevelSum;
  if (score < 10) {
    return {
      badge: '🌱',
      title: 'みならいキッズ',
      nextHint: 'クエストをクリアして なかまを ふやそう！',
    };
  }
  if (score < 25) {
    return {
      badge: '🪲',
      title: 'むしとり＆かいじゅう名人',
      nextHint: 'ずかんを もっと あつめよう！',
    };
  }
  if (score < 50) {
    return {
      badge: '⚔️',
      title: 'ベテランバトラー',
      nextHint: 'レベルをあげて キングに しんかさせよう！',
    };
  }
  if (score < 85) {
    return {
      badge: '🛡️',
      title: 'ドラクエゆうしゃ',
      nextHint: '大魔王ボスを たおそう！',
    };
  }
  return {
    badge: '👑',
    title: 'でんせつの大勇者',
    nextHint: 'すべての なかまと わざを きわめた 最強の勇者！',
  };
}

export interface RaidBossData {
  id: string;
  name: string;
  titleBadge: string;
  element: ElementId;
  type: KaijuTypeId;
  kaijuId?: string;
  level: number;
  maxHp: number;
  attack: number;
  defense: number;
  roar: string;
  specialMove: string;
  description: string;
  rewardOrbs: number;
  rewardExp: number;
}

/**
 * 親子タッグで挑む「ドラクエ風・伝説の4大魔王ボス」（倒すとまれに起き上がって仲間になる！）
 */
export const RAID_BOSS_LIST: RaidBossData[] = [
  {
    id: 'boss-ryuo',
    name: 'りゅうおう',
    titleBadge: '😈 世界の半分を統べる 悪の化身',
    element: 'fire',
    type: 'dragon',
    kaijuId: 'fire-dq-ryuo',
    level: 3,
    maxHp: 650,
    attack: 48,
    defense: 22,
    roar: 'フォッフォッフォ！世界の半分を やろう！',
    specialMove: 'しゃくねつの 業火・ベギラゴン',
    description: '紫の魔道士から 巨大ドラゴンへ 変身する 伝説の大魔王！倒すと まれに 仲間になるぞ！',
    rewardOrbs: 3,
    rewardExp: 80,
  },
  {
    id: 'boss-hargon',
    name: 'ハーゴン＆シドー',
    titleBadge: '😈 邪神官が呼び出しし 破壊神シドー',
    element: 'water',
    type: 'dino',
    kaijuId: 'water-dq-hargon',
    level: 5,
    maxHp: 850,
    attack: 62,
    defense: 28,
    roar: 'グオォォォッ！すべてを 破壊する！！',
    specialMove: '絶対零度・邪神イオナズン',
    description: '大神官ハーゴンと 6本腕の破壊神シドー！倒すと まれに 起き上がって 仲間になるぞ！',
    rewardOrbs: 4,
    rewardExp: 100,
  },
  {
    id: 'boss-pisaro',
    name: 'デスピサロ',
    titleBadge: '😈 進化の秘法で 覚醒せし 魔族の王',
    element: 'nature',
    type: 'beast',
    kaijuId: 'nature-dq-pisaro',
    level: 7,
    maxHp: 1100,
    attack: 76,
    defense: 35,
    roar: 'グガァァァッ！進化の秘法よ！！',
    specialMove: 'いてつく波動・暗黒マダンテ',
    description: '進化の秘法で 4本腕の 究極形態へ 変貌した 魔族の王！倒すと まれに 仲間になるぞ！',
    rewardOrbs: 5,
    rewardExp: 120,
  },
  {
    id: 'boss-dreamb',
    name: 'ダークドレアム',
    titleBadge: '👑 二刀流の魔剣をもつ 破壊と殺りくの神',
    element: 'thunder',
    type: 'robot',
    kaijuId: 'thunder-dq-dreamb',
    level: 9,
    maxHp: 1350,
    attack: 90,
    defense: 42,
    roar: 'ワタシハ 破壊ト 殺リクノ 神ナリ！！',
    specialMove: 'ギガスロー・グランドクロス',
    description: '巨大な二刀流の魔神剣で すべてを なぎ払う 裏ボス大魔王！倒すと まれに 仲間になるぞ！',
    rewardOrbs: 6,
    rewardExp: 150,
  },
];

export interface QuizQuestion {
  id: string;
  questionText: string;
  speechQuestion: string;
  correctKaiju: KaijuData;
  choices: KaijuData[];
  explanation: string;
}

/**
 * 知育3択クイズ生成関数
 */
export function generateQuizQuestion(excludeIds: string[] = []): QuizQuestion {
  const pool = KAIJU_LIST.filter((k) => !excludeIds.includes(k.id));
  const candidatePool = pool.length >= 3 ? pool : KAIJU_LIST;

  const correctIndex = Math.floor(Math.random() * candidatePool.length);
  const correctKaiju = candidatePool[correctIndex];

  // ダミー選択肢を2体選ぶ（できるだけ同じカテゴリから選ぶと楽しい）
  const others = KAIJU_LIST.filter((k) => k.id !== correctKaiju.id);
  const sameCategoryOthers = others.filter(
    (k) => (k.category ?? 'kaiju') === (correctKaiju.category ?? 'kaiju')
  );
  const dummyPool = sameCategoryOthers.length >= 2 ? sameCategoryOthers : others;

  const shuffledDummies = [...dummyPool].sort(() => Math.random() - 0.5).slice(0, 2);
  const choices = [correctKaiju, ...shuffledDummies].sort(() => Math.random() - 0.5);

  let questionText = '';
  let speechQuestion = '';
  let explanation = '';

  if (correctKaiju.insectInfo) {
    const info = correctKaiju.insectInfo;
    const pattern = Math.floor(Math.random() * 3);
    if (pattern === 0) {
      questionText = `🎓 ヒミツクイズ！\n「${info.trivia}」\nこの こんちゅうは どれかな？`;
      speechQuestion = `デデドン！もんだい！ ${info.trivia} この こんちゅうは どれかな？`;
    } else if (pattern === 1) {
      questionText = `🎓 いきものクイズ！\nすんでいる場所は「${info.habitat}」、おおきさは「${info.realSize}」！\n『${correctKaiju.titleBadge}』とよばれる こんちゅうは どれかな？`;
      speechQuestion = `デデドン！もんだい！ すんでいるばしょは ${info.habitat}、おおきさは ${info.realSize}！ ${correctKaiju.titleBadge} とよばれる こんちゅうは どれかな？`;
    } else {
      questionText = `🎓 ひっさつわざクイズ！\n『${correctKaiju.specialMove}』をつかう、「${correctKaiju.titleBadge}」は どれかな？`;
      speechQuestion = `デデドン！もんだい！ ${correctKaiju.specialMove} をつかう、${correctKaiju.titleBadge} は どれかな？`;
    }
    explanation = `せいかいは『${correctKaiju.name}』！ ${info.trivia}`;
  } else {
    const pattern = Math.floor(Math.random() * 2);
    if (pattern === 0) {
      questionText = `🦖 かいじゅうクイズ！\n「${correctKaiju.description}」\nこの かいじゅうは どれかな？`;
      speechQuestion = `デデドン！もんだい！ ${correctKaiju.description} この かいじゅうは どれかな？`;
    } else {
      questionText = `⚡ ひっさつわざクイズ！\n『${correctKaiju.titleBadge}』とよばれ、ひっさつわざ『${correctKaiju.specialMove}』を つかうのは どれかな？`;
      speechQuestion = `デデドン！もんだい！ ${correctKaiju.titleBadge} とよばれ、ひっさつわざ ${correctKaiju.specialMove} を つかうのは どれかな？`;
    }
    explanation = `せいかいは『${correctKaiju.name}』！ ひっさつわざは ${correctKaiju.specialMove} だよ！`;
  }

  return {
    id: `${correctKaiju.id}-${Date.now()}`,
    questionText,
    speechQuestion,
    correctKaiju,
    choices,
    explanation,
  };
}
