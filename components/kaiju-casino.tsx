'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Coins, RotateCcw, Trophy, Flame, Gift } from 'lucide-react';
import { EQUIPMENT_LIST } from '@/lib/kaiju-data';
import {
  playTapSound,
  playBattleVictorySound,
  playTreasureChestSound,
  playMpChargeSound,
  playYoutuberAirhornSound,
  speakJapanese,
  fireQuestConfetti,
} from '@/lib/sound-and-speech';

export interface CasinoPrize {
  type: 'equipment' | 'expOrbs' | 'chestKey' | 'starBall';
  cost: number;
  equipmentId?: string;
  amount?: number;
  name: string;
}

export type CasinoPrizePayload = CasinoPrize;

export interface KaijuCasinoProps {
  medals: number;
  expOrbs: number;
  unlockedEquipmentIds: string[];
  soundEnabled: boolean;
  onChangeMedals: (delta: number) => void;
  onExchangeOrbForMedals: () => void;
  onClaimAllowance: () => void;
  onRedeemPrize: (prize: CasinoPrize) => void;
}

type CasinoSubTab = 'slot' | 'roulette' | 'poker' | 'exchange';

/* ============================================================================
 * 🎰 1. スロット定義（5ライン・3×3リール・メタルチェンジフリースピン）
 * ========================================================================== */
type SlotSymbolId = 'seven' | 'metal' | 'dragon' | 'sword' | 'star' | 'cherry';

interface SlotSymbolDef {
  id: SlotSymbolId;
  emoji: string;
  label: string;
  payout3: number; // 1ライン BET あたりの倍率
  weightNormal: number;
  weightMetal: number;
}

const SLOT_SYMBOLS: SlotSymbolDef[] = [
  { id: 'seven', emoji: '👑', label: '777', payout3: 300, weightNormal: 3, weightMetal: 7 },
  { id: 'metal', emoji: '💎', label: 'メタル', payout3: 100, weightNormal: 5, weightMetal: 10 },
  { id: 'dragon', emoji: '🐉', label: 'しんりゅう', payout3: 40, weightNormal: 9, weightMetal: 14 },
  { id: 'sword', emoji: '⚔️', label: 'ロト剣', payout3: 20, weightNormal: 14, weightMetal: 18 },
  { id: 'star', emoji: '🌟', label: 'ほし', payout3: 10, weightNormal: 22, weightMetal: 24 },
  { id: 'cherry', emoji: '🍒', label: 'チェリー', payout3: 4, weightNormal: 34, weightMetal: 27 },
];

const SLOT_LINES: { name: string; coords: [number, number][] }[] = [
  { name: '上ライン', coords: [[0, 0], [0, 1], [0, 2]] },
  { name: '中ライン', coords: [[1, 0], [1, 1], [1, 2]] },
  { name: '下ライン', coords: [[2, 0], [2, 1], [2, 2]] },
  { name: '右下がり斜め', coords: [[0, 0], [1, 1], [2, 2]] },
  { name: '右上がり斜め', coords: [[2, 0], [1, 1], [0, 2]] },
];

function pickWeightedSlotSymbol(isMetalMode: boolean): SlotSymbolId {
  const total = SLOT_SYMBOLS.reduce(
    (sum, s) => sum + (isMetalMode ? s.weightMetal : s.weightNormal),
    0
  );
  let r = Math.random() * total;
  for (const s of SLOT_SYMBOLS) {
    r -= isMetalMode ? s.weightMetal : s.weightNormal;
    if (r <= 0) return s.id;
  }
  return 'cherry';
}

function getSlotSymbolDef(id: SlotSymbolId): SlotSymbolDef {
  return SLOT_SYMBOLS.find((s) => s.id === id) || SLOT_SYMBOLS[5];
}

/* ============================================================================
 * 🎡 2. ルーレット定義（0〜12 + 👑JP 計14ポケット・本格SVG回転盤）
 * ========================================================================== */
interface RoulettePocket {
  key: string;
  label: string;
  color: 'gold' | 'green' | 'red' | 'black';
  num: number | null; // JPはnull
}

const ROULETTE_POCKETS: RoulettePocket[] = [
  { key: 'jp', label: '👑', color: 'gold', num: null },
  { key: '1', label: '1', color: 'red', num: 1 },
  { key: '8', label: '8', color: 'black', num: 8 },
  { key: '3', label: '3', color: 'red', num: 3 },
  { key: '10', label: '10', color: 'black', num: 10 },
  { key: '5', label: '5', color: 'red', num: 5 },
  { key: '12', label: '12', color: 'black', num: 12 },
  { key: '0', label: '0', color: 'green', num: 0 },
  { key: '7', label: '7', color: 'red', num: 7 },
  { key: '2', label: '2', color: 'black', num: 2 },
  { key: '9', label: '9', color: 'red', num: 9 },
  { key: '4', label: '4', color: 'black', num: 4 },
  { key: '11', label: '11', color: 'red', num: 11 },
  { key: '6', label: '6', color: 'black', num: 6 },
];

type RouletteBetKey =
  | 'jp'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | 'red'
  | 'black'
  | 'even'
  | 'odd'
  | 'low'
  | 'mid'
  | 'high';

function evaluateRouletteBet(betKey: RouletteBetKey, pocket: RoulettePocket): number {
  if (betKey === 'jp') return pocket.key === 'jp' ? 50 : 0;
  if (betKey === '0') return pocket.key === '0' ? 14 : 0;
  if (pocket.num === null || pocket.num === 0) return 0;

  if (betKey === String(pocket.num)) return 12;
  if (betKey === 'red') return pocket.color === 'red' ? 2 : 0;
  if (betKey === 'black') return pocket.color === 'black' ? 2 : 0;
  if (betKey === 'even') return pocket.num % 2 === 0 ? 2 : 0;
  if (betKey === 'odd') return pocket.num % 2 === 1 ? 2 : 0;
  if (betKey === 'low') return pocket.num >= 1 && pocket.num <= 4 ? 3 : 0;
  if (betKey === 'mid') return pocket.num >= 5 && pocket.num <= 8 ? 3 : 0;
  if (betKey === 'high') return pocket.num >= 9 && pocket.num <= 12 ? 3 : 0;
  return 0;
}

/* ============================================================================
 * 🃏 3. ポーカー定義（53枚デッキ＋JOKER＋ダブルアップ）
 * ========================================================================== */
type CardSuit = '♠' | '♥' | '♦' | '♣' | '👑';

interface PlayingCard {
  id: string;
  suit: CardSuit;
  rank: number; // 2..14 (14=A), 99=JOKER
  label: string;
  isJoker?: boolean;
}

function createShuffledDeck(): PlayingCard[] {
  const suits: CardSuit[] = ['♠', '♥', '♦', '♣'];
  const deck: PlayingCard[] = [];
  for (const suit of suits) {
    for (let rank = 2; rank <= 14; rank++) {
      const label =
        rank === 14 ? 'A' : rank === 13 ? 'K' : rank === 12 ? 'Q' : rank === 11 ? 'J' : String(rank);
      deck.push({ id: `${suit}-${rank}`, suit, rank, label });
    }
  }
  deck.push({ id: 'JOKER', suit: '👑', rank: 99, label: 'JOKER', isJoker: true });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function evaluatePokerHand(hand: PlayingCard[]): { name: string; multiplier: number } {
  const jokers = hand.filter((c) => c.isJoker).length;
  const normals = hand.filter((c) => !c.isJoker);
  const rankCounts = new Map<number, number>();
  for (const c of normals) {
    rankCounts.set(c.rank, (rankCounts.get(c.rank) ?? 0) + 1);
  }
  const counts = Array.from(rankCounts.values()).sort((a, b) => b - a);
  const maxSame = (counts[0] ?? 0) + jokers;

  const isFlush =
    normals.length === 0 || normals.every((c) => c.suit === normals[0].suit);

  // ストレート判定（ジョーカー補完あり）
  let isStraight = false;
  let isRoyal = false;
  if (rankCounts.size === normals.length) {
    const ranks = normals.map((c) => c.rank).sort((a, b) => a - b);
    const span = ranks[ranks.length - 1] - ranks[0];
    if (span <= 4) {
      isStraight = true;
      if (ranks[0] >= 10) isRoyal = true;
    } else if (ranks.includes(14)) {
      // A-2-3-4-5 ローストレートチェック
      const lowRanks = ranks.map((r) => (r === 14 ? 1 : r)).sort((a, b) => a - b);
      if (lowRanks[lowRanks.length - 1] - lowRanks[0] <= 4) {
        isStraight = true;
      }
    }
  }

  if (maxSame >= 5) return { name: '👑 ファイブカード！！', multiplier: 300 };
  if (isFlush && isRoyal) return { name: '👑 ロイヤルストレートフラッシュ！！', multiplier: 200 };
  if (isFlush && isStraight) return { name: '✨ ストレートフラッシュ！', multiplier: 100 };
  if (maxSame === 4) return { name: '🔥 フォーカード！', multiplier: 50 };
  if ((counts[0] ?? 0) + jokers === 3 && (counts[1] ?? 0) === 2) {
    return { name: '🏠 フルハウス！', multiplier: 20 };
  }
  if (isFlush) return { name: '♦️ フラッシュ！', multiplier: 12 };
  if (isStraight) return { name: '🔢 ストレート！', multiplier: 8 };
  if (maxSame === 3) return { name: '🎯 スリーカード！', multiplier: 4 };
  if ((counts[0] ?? 0) === 2 && (counts[1] ?? 0) === 2) {
    return { name: '✌️ ツーペア！', multiplier: 2 };
  }
  if (maxSame === 2) return { name: '👍 ワンペア！', multiplier: 1 };
  return { name: 'ざんねん… ノーペア', multiplier: 0 };
}

export function KaijuCasino({
  medals,
  expOrbs,
  unlockedEquipmentIds,
  soundEnabled,
  onChangeMedals,
  onExchangeOrbForMedals,
  onClaimAllowance,
  onRedeemPrize,
}: KaijuCasinoProps) {
  const [subTab, setSubTab] = useState<CasinoSubTab>('slot');

  // --- 🎰 スロットステート ---
  const [slotRate, setSlotRate] = useState<1 | 10 | 100>(10);
  const [slotGrid, setSlotGrid] = useState<SlotSymbolId[][]>([
    ['seven', 'metal', 'dragon'],
    ['star', 'seven', 'cherry'],
    ['dragon', 'sword', 'seven'],
  ]);
  const [reelSpinning, setReelSpinning] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [metalSpinsLeft, setMetalSpinsLeft] = useState<number>(0);
  const [slotWinningCells, setSlotWinningCells] = useState<string[]>([]);
  const [slotMessage, setSlotMessage] = useState<string>(
    '👑777で300倍！💎が2コ以上で5回フリースピン「メタルチェンジ(2倍)」突入！'
  );
  const slotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slotTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // --- 🎡 ルーレットステート ---
  const [rouletteChip, setRouletteChip] = useState<10 | 50 | 100 | 500>(50);
  const [rouletteBets, setRouletteBets] = useState<Partial<Record<RouletteBetKey, number>>>({});
  const [lastRouletteBets, setLastRouletteBets] = useState<Partial<Record<RouletteBetKey, number>>>({});
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [wheelDeg, setWheelDeg] = useState(0);
  const [rouletteResult, setRouletteResult] = useState<RoulettePocket | null>(null);
  const [rouletteMessage, setRouletteMessage] = useState('好きなマスにチップを置いて「スピン！」を押そう！');

  // --- 🃏 ポーカーステート ---
  const [pokerBet, setPokerBet] = useState<10 | 50 | 100 | 500>(50);
  const [pokerPhase, setPokerPhase] = useState<'bet' | 'hold' | 'result' | 'doubleup' | 'doubleResult'>('bet');
  const [pokerDeck, setPokerDeck] = useState<PlayingCard[]>([]);
  const [pokerHand, setPokerHand] = useState<PlayingCard[]>([]);
  const [pokerHolds, setPokerHolds] = useState<boolean[]>([false, false, false, false, false]);
  const [pokerWinAmount, setPokerWinAmount] = useState<number>(0);
  const [pokerHandName, setPokerHandName] = useState<string>('');
  const [doubleDealerCard, setDoubleDealerCard] = useState<PlayingCard | null>(null);
  const [doubleNextCard, setDoubleNextCard] = useState<PlayingCard | null>(null);
  const [doubleStreak, setDoubleStreak] = useState<number>(0);
  const [pokerMessage, setPokerMessage] = useState('ベットを選んで「🃏 くばる！」でスタート！');

  useEffect(() => {
    return () => {
      if (slotIntervalRef.current) clearInterval(slotIntervalRef.current);
      slotTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  /* ===================== 🎰 スロット処理 ===================== */
  const slotSpinCost = metalSpinsLeft > 0 ? 0 : slotRate * 5;
  const isAnyReelSpinning = reelSpinning[0] || reelSpinning[1] || reelSpinning[2];

  const handleSpinSlot = () => {
    if (isAnyReelSpinning) return;
    if (medals < slotSpinCost) {
      playTapSound(320);
      setSlotMessage('メダルが足りないよ！レートを下げるか、🌟玉から両替してね！');
      return;
    }

    const isMetal = metalSpinsLeft > 0;
    if (slotSpinCost > 0) onChangeMedals(-slotSpinCost);
    if (isMetal) setMetalSpinsLeft((prev) => Math.max(0, prev - 1));

    setSlotWinningCells([]);
    setReelSpinning([true, true, true]);
    playTapSound(640);
    setSlotMessage(isMetal ? '💎 メタルチェンジ中！配当2倍チャンス！！' : '🎰 リール回転中…！ねらえ 777！！');

    // 最終出目を先に抽選
    const finalGrid: SlotSymbolId[][] = [
      [pickWeightedSlotSymbol(isMetal), pickWeightedSlotSymbol(isMetal), pickWeightedSlotSymbol(isMetal)],
      [pickWeightedSlotSymbol(isMetal), pickWeightedSlotSymbol(isMetal), pickWeightedSlotSymbol(isMetal)],
      [pickWeightedSlotSymbol(isMetal), pickWeightedSlotSymbol(isMetal), pickWeightedSlotSymbol(isMetal)],
    ];

    let stoppedCols = [false, false, false];

    if (slotIntervalRef.current) clearInterval(slotIntervalRef.current);
    slotIntervalRef.current = setInterval(() => {
      setSlotGrid((prev) =>
        [0, 1, 2].map((r) =>
          [0, 1, 2].map((c) =>
            stoppedCols[c] ? finalGrid[r][c] : SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)].id
          )
        )
      );
    }, 80);

    slotTimersRef.current.forEach(clearTimeout);
    slotTimersRef.current = [];

    [0, 1, 2].forEach((colIdx) => {
      const timer = setTimeout(() => {
        stoppedCols = stoppedCols.map((v, i) => (i === colIdx ? true : v));
        setSlotGrid((prev) =>
          [0, 1, 2].map((r) => [0, 1, 2].map((c) => (stoppedCols[c] ? finalGrid[r][c] : prev[r][c])))
        );
        setReelSpinning((prev) => [
          colIdx === 0 ? false : prev[0],
          colIdx === 1 ? false : prev[1],
          colIdx === 2 ? false : prev[2],
        ]);
        playTapSound(420 + colIdx * 140);

        if (colIdx === 2) {
          if (slotIntervalRef.current) {
            clearInterval(slotIntervalRef.current);
            slotIntervalRef.current = null;
          }

          // 5ライン判定
          const winCells = new Set<string>();
          const hitNames: string[] = [];
          let totalWin = 0;
          const modeMultiplier = isMetal ? 2 : 1;

          for (const line of SLOT_LINES) {
            const [a, b, c] = line.coords.map(([r, col]) => finalGrid[r][col]);
            if (a === b && b === c) {
              const def = getSlotSymbolDef(a);
              const win = slotRate * def.payout3 * modeMultiplier;
              totalWin += win;
              hitNames.push(`${def.emoji}${def.label}`);
              line.coords.forEach(([r, col]) => winCells.add(`${r}-${col}`));
            }
          }

          // 💎が2個以上でメタルチェンジ（フリースピン+5）
          const metalCount = finalGrid.flat().filter((id) => id === 'metal').length;
          let triggeredMetal = false;
          if (metalCount >= 2) {
            setMetalSpinsLeft((prev) => prev + 5);
            triggeredMetal = true;
          }

          setSlotWinningCells(Array.from(winCells));

          if (totalWin > 0) {
            onChangeMedals(totalWin);
            if (totalWin >= slotRate * 100) {
              playYoutuberAirhornSound();
              fireQuestConfetti();
              speakJapanese(`ドカーン！大当たり！メダル ${totalWin} まい ゲットだーっ！！`, soundEnabled);
            } else {
              playTreasureChestSound();
            }
            setSlotMessage(
              `🎉 【${hitNames.join('・')}】大当たり！ ＋${totalWin.toLocaleString()}枚！${
                triggeredMetal ? ' ＆ 💎メタルチェンジ(+5回)突入！！' : ''
              }`
            );
          } else if (triggeredMetal) {
            playMpChargeSound();
            setSlotMessage('💎 メタル図柄が2コ以上！フリースピン「メタルチェンジ(5回・2倍)」突入！！');
          } else {
            setSlotMessage('もういちど スピンしよう！');
          }
        }
      }, 420 + colIdx * 380);
      slotTimersRef.current.push(timer);
    });
  };

  /* ===================== 🎡 ルーレット処理 ===================== */
  const totalRouletteBet = Object.values(rouletteBets).reduce((s, v) => s + (v ?? 0), 0);

  const handlePlaceRouletteBet = (key: RouletteBetKey) => {
    if (isWheelSpinning) return;
    if (medals < totalRouletteBet + rouletteChip) {
      playTapSound(320);
      setRouletteMessage('メダルが足りないよ！チップを下げるか、クリアしてね！');
      return;
    }
    playTapSound(680);
    setRouletteBets((prev) => ({
      ...prev,
      [key]: (prev[key] ?? 0) + rouletteChip,
    }));
  };

  const handleSpinRoulette = () => {
    if (isWheelSpinning) return;
    if (totalRouletteBet <= 0) {
      playTapSound(320);
      setRouletteMessage('まずは下のテーブルから 好きな場所にベットしてね！');
      return;
    }
    if (medals < totalRouletteBet) {
      playTapSound(320);
      setRouletteMessage('メダルが足りません！クリアして賭け直してね！');
      return;
    }

    onChangeMedals(-totalRouletteBet);
    setLastRouletteBets(rouletteBets);
    setIsWheelSpinning(true);
    setRouletteResult(null);
    playMpChargeSound();
    setRouletteMessage('🎡 ルーレット回転中… ドキドキ…どこに止まるかな！？');

    const winIndex = Math.floor(Math.random() * ROULETTE_POCKETS.length);
    const pocket = ROULETTE_POCKETS[winIndex];
    const sliceDeg = 360 / ROULETTE_POCKETS.length;
    // 上部ポインター（0度位置）に winIndex のポケット中心を合わせる回転角
    const targetMod = (360 - (winIndex * sliceDeg + sliceDeg / 2)) % 360;
    const currentMod = ((wheelDeg % 360) + 360) % 360;
    const deltaAngle = ((targetMod - currentMod + 360) % 360) + 360 * 5;
    setWheelDeg((prev) => prev + deltaAngle);

    setTimeout(() => {
      setIsWheelSpinning(false);
      setRouletteResult(pocket);
      let totalWin = 0;
      (Object.entries(rouletteBets) as [RouletteBetKey, number][]).forEach(([betKey, amount]) => {
        if (!amount) return;
        const mult = evaluateRouletteBet(betKey, pocket);
        totalWin += amount * mult;
      });

      if (totalWin > 0) {
        onChangeMedals(totalWin);
        if (totalWin >= totalRouletteBet * 8) {
          playYoutuberAirhornSound();
          fireQuestConfetti();
          speakJapanese(`ヤッター！！${pocket.label} に大当たり！メダル ${totalWin} まい ゲット！`, soundEnabled);
        } else {
          playTreasureChestSound();
        }
        setRouletteMessage(`🎉 当たり出目【${pocket.label}】！ ＋${totalWin.toLocaleString()}枚 獲得！！`);
      } else {
        playTapSound(300);
        setRouletteMessage(`出目は【${pocket.label}】！ざんねん… もういちど挑戦しよう！`);
      }
    }, 2900);
  };

  /* ===================== 🃏 ポーカー＆ダブルアップ処理 ===================== */
  const handleDealPoker = () => {
    if (medals < pokerBet) {
      playTapSound(320);
      setPokerMessage('メダルが足りません！ベット額を下げてね！');
      return;
    }
    onChangeMedals(-pokerBet);
    const deck = createShuffledDeck();
    const initialHand = deck.slice(0, 5);
    const restDeck = deck.slice(5);
    setPokerDeck(restDeck);
    setPokerHand(initialHand);
    setPokerHolds([false, false, false, false, false]);
    setPokerWinAmount(0);
    setPokerHandName('');
    setDoubleDealerCard(null);
    setDoubleNextCard(null);
    setDoubleStreak(0);
    setPokerPhase('hold');
    playTapSound(660);
    setPokerMessage('のこしたいカードを タップして「HOLD」してから「ひきなおす！」を押してね！');
  };

  const handleDrawPoker = () => {
    let deckIdx = 0;
    const nextHand = pokerHand.map((card, i) => {
      if (pokerHolds[i]) return card;
      const newCard = pokerDeck[deckIdx] ?? card;
      deckIdx++;
      return newCard;
    });
    const remainingDeck = pokerDeck.slice(deckIdx);
    const result = evaluatePokerHand(nextHand);
    const win = pokerBet * result.multiplier;

    setPokerHand(nextHand);
    setPokerDeck(remainingDeck);
    setPokerHandName(result.name);
    setPokerWinAmount(win);
    setPokerPhase('result');

    if (win > 0) {
      playTreasureChestSound();
      if (result.multiplier >= 20) fireQuestConfetti();
      setPokerMessage(`${result.name}（${win.toLocaleString()}枚）！ そのままもらう？「ダブルアップ」で2倍ねらう？`);
    } else {
      playTapSound(300);
      setPokerMessage('ざんねん ノーペア…！もういちど配ろう！');
    }
  };

  const handleStartDoubleUp = () => {
    const deck = pokerDeck.length >= 4 ? pokerDeck : createShuffledDeck();
    const dealer = deck[0];
    setDoubleDealerCard(dealer);
    setDoubleNextCard(null);
    setPokerDeck(deck.slice(1));
    setPokerPhase('doubleup');
    playTapSound(720);
    setPokerMessage(`基準カードは【${dealer.suit}${dealer.label}】！次のカードは これより大きい？小さい？`);
  };

  const handleGuessDoubleUp = (guess: 'high' | 'low') => {
    if (!doubleDealerCard) return;
    const deck = pokerDeck.length >= 2 ? pokerDeck : createShuffledDeck();
    const nextCard = deck[0];
    setDoubleNextCard(nextCard);
    setPokerDeck(deck.slice(1));
    setPokerPhase('doubleResult');

    // ジョーカーは最強として必ず勝ち、同ランクは引き分け（もう一度）
    if (nextCard.isJoker || doubleDealerCard.isJoker) {
      const doubled = pokerWinAmount * 2;
      setPokerWinAmount(doubled);
      setDoubleStreak((s) => s + 1);
      playYoutuberAirhornSound();
      setPokerMessage(`👑 JOKER 降臨！！無条件で大勝利！配当が ${doubled.toLocaleString()}枚 になった！！`);
      return;
    }

    if (nextCard.rank === doubleDealerCard.rank) {
      playTapSound(550);
      setPokerMessage(`同じ数字【${nextCard.label}】で ひきわけ！そのまま再チャレンジできるよ！`);
      return;
    }

    const isWin =
      (guess === 'high' && nextCard.rank > doubleDealerCard.rank) ||
      (guess === 'low' && nextCard.rank < doubleDealerCard.rank);

    if (isWin) {
      const doubled = pokerWinAmount * 2;
      setPokerWinAmount(doubled);
      setDoubleStreak((s) => s + 1);
      playBattleVictorySound();
      if (doubled >= 1000) fireQuestConfetti();
      setPokerMessage(`🎉 大正解！！【${nextCard.suit}${nextCard.label}】！ 獲得メダルが ${doubled.toLocaleString()}枚 に倍増！！`);
    } else {
      setPokerWinAmount(0);
      playTapSound(240);
      setPokerMessage(`💥 ざんねん…【${nextCard.suit}${nextCard.label}】で外れ！メダルは0枚になった…`);
    }
  };

  const handleCollectPokerWin = () => {
    if (pokerWinAmount > 0) {
      onChangeMedals(pokerWinAmount);
      playTreasureChestSound();
      if (pokerWinAmount >= 500) {
        speakJapanese(`ナイス！ポーカーで ${pokerWinAmount} まい ゲットしたぞ！`, soundEnabled);
      }
    }
    setPokerWinAmount(0);
    setPokerPhase('bet');
    setPokerMessage('獲得したよ！つぎの勝負に いこう！');
  };

  const casinoEquipments = EQUIPMENT_LIST.filter((e) => e.casinoOnly);

  return (
    <div className="space-y-4">
      {/* 🎰 カジノ・トップバナー＆所持メダルバー */}
      <div className="rounded-3xl bg-gradient-to-br from-rose-950 via-purple-950 to-slate-950 border-2 border-yellow-400/70 p-4 shadow-[0_0_30px_rgba(250,204,21,0.25)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-yellow-300 flex items-center gap-2">
              <span>🎰 ドラクエ風・怪獣カジノ</span>
            </h2>
            <p className="text-xs font-bold text-rose-200">
              メダルを増やして「URカジノ限定そうび」をゲットしよう！
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-950/90 border-2 border-yellow-400 flex items-center gap-2 shadow">
            <Coins className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-[10px] font-bold text-slate-400 leading-none">コイン</div>
              <div className="text-lg sm:text-xl font-black text-yellow-300 tabular-nums leading-tight">
                {medals.toLocaleString()} 枚
              </div>
            </div>
          </div>
        </div>

        {/* 両替 ＆ おこづかい救済ボタン */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            disabled={expOrbs <= 0}
            onClick={() => {
              if (expOrbs <= 0) return;
              playTapSound(660);
              onExchangeOrbForMedals();
            }}
            className={`px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 border transition-all cursor-pointer active:scale-95 ${
              expOrbs > 0
                ? 'bg-amber-400 text-slate-950 border-white shadow'
                : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>🌟けいけんち玉 1こ → 🪙100枚（のこり🌟{expOrbs}）</span>
          </button>

          {medals < 50 && (
            <button
              type="button"
              onClick={() => {
                playTreasureChestSound();
                onClaimAllowance();
              }}
              className="px-3 py-1.5 rounded-xl font-black bg-emerald-400 text-slate-950 border border-white shadow flex items-center gap-1 cursor-pointer active:scale-95 animate-pulse"
            >
              <Gift className="w-4 h-4" />
              <span>おこづかい 🪙+50枚 もらう！</span>
            </button>
          )}
        </div>

        {/* ゲーム選択サブタブ */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {[
            { id: 'slot' as const, label: '🎰 スロット' },
            { id: 'roulette' as const, label: '🎡 ルーレット' },
            { id: 'poker' as const, label: '🃏 ポーカー' },
            { id: 'exchange' as const, label: '🏆 景品交換' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                playTapSound(600);
                setSubTab(t.id);
              }}
              className={`min-h-[46px] rounded-xl font-black text-[11px] sm:text-sm border-2 transition-all cursor-pointer active:scale-95 ${
                subTab === t.id
                  ? 'bg-gradient-to-b from-yellow-300 to-amber-500 text-slate-950 border-white shadow'
                  : 'bg-slate-900/90 text-slate-300 border-white/15 hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 🎰 TAB 1: 本格5ラインスロット                                         */}
      {/* =================================================================== */}
      {subTab === 'slot' && (
        <div className="dq-window p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm sm:text-base font-black text-yellow-300">
              🎰 5ライン 怪獣スロット
            </div>
            {metalSpinsLeft > 0 && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-black text-xs border border-white animate-pulse">
                💎 メタルチェンジ中！残り {metalSpinsLeft}回（配当2倍＆無料！）
              </span>
            )}
          </div>

          {/* レート選択 */}
          <div className="flex items-center justify-center gap-2">
            {([1, 10, 100] as const).map((rate) => (
              <button
                key={rate}
                type="button"
                disabled={isAnyReelSpinning}
                onClick={() => {
                  playTapSound(620);
                  setSlotRate(rate);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black border-2 cursor-pointer transition-all ${
                  slotRate === rate
                    ? 'bg-rose-500 text-white border-yellow-300 shadow'
                    : 'bg-slate-900 text-slate-300 border-white/15'
                }`}
              >
                {rate}枚台（5ライン:{rate * 5}枚）
              </button>
            ))}
          </div>

          {/* 3×3 スロットリール枠 */}
          <div
            className={`max-w-sm mx-auto rounded-3xl p-3 sm:p-4 border-4 transition-colors ${
              metalSpinsLeft > 0
                ? 'bg-gradient-to-b from-cyan-950 via-purple-950 to-slate-950 border-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.6)]'
                : 'bg-slate-950 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]'
            }`}
          >
            <div className="grid grid-cols-3 gap-2">
              {slotGrid.map((row, rIdx) =>
                row.map((symId, cIdx) => {
                  const def = getSlotSymbolDef(symId);
                  const isWinCell = slotWinningCells.includes(`${rIdx}-${cIdx}`);
                  const spinning = reelSpinning[cIdx];
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`h-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center border-2 select-none transition-all ${
                        isWinCell
                          ? 'bg-gradient-to-b from-yellow-300 to-amber-500 border-white scale-105 shadow-[0_0_16px_rgba(250,204,21,0.9)]'
                          : spinning
                          ? 'bg-slate-800 border-slate-600'
                          : 'bg-slate-900 border-white/15'
                      }`}
                    >
                      <span className={`text-3xl sm:text-4xl ${spinning ? 'opacity-70 scale-95' : ''}`}>
                        {def.emoji}
                      </span>
                      <span
                        className={`text-[10px] font-black mt-0.5 ${
                          isWinCell ? 'text-slate-950' : 'text-slate-300'
                        }`}
                      >
                        {def.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* メッセージ ＆ スピンボタン */}
          <div className="text-center text-xs sm:text-sm font-black text-amber-200 bg-slate-900/90 rounded-xl p-2.5 border border-white/10">
            {slotMessage}
          </div>

          <button
            type="button"
            disabled={isAnyReelSpinning}
            onClick={handleSpinSlot}
            className={`min-h-[60px] w-full max-w-md mx-auto rounded-2xl font-black text-lg border-2 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
              isAnyReelSpinning
                ? 'bg-slate-700 text-slate-400 border-slate-600'
                : 'bg-gradient-to-r from-yellow-300 via-amber-400 to-rose-500 text-slate-950 border-white shadow-[0_5px_0_#9f1239]'
            }`}
          >
            <Sparkles className="w-6 h-6" />
            <span>
              {isAnyReelSpinning
                ? '回転中…！'
                : metalSpinsLeft > 0
                ? '💎 フリースピンをまわす！（無料・2倍）'
                : `🎰 スピン！（🪙${slotSpinCost}枚）`}
            </span>
          </button>

          {/* 配当表 */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center text-[11px] font-bold">
            {SLOT_SYMBOLS.map((s) => (
              <div key={s.id} className="bg-slate-900/80 rounded-xl p-1.5 border border-white/10">
                <div className="text-lg">{s.emoji}</div>
                <div className="text-white font-black">{s.label}</div>
                <div className="text-yellow-300">{s.payout3}倍</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 🎡 TAB 2: 本格ルーレット                                             */}
      {/* =================================================================== */}
      {subTab === 'roulette' && (
        <div className="dq-window p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm sm:text-base font-black text-yellow-300">
              🎡 本格ルーレット（0〜12 ＋ 👑JP）
            </div>
            <div className="text-xs font-black text-emerald-300">
              合計ベット：🪙{totalRouletteBet.toLocaleString()}枚
            </div>
          </div>

          {/* 回転するSVGルーレットホイール */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl -mb-2 z-10 text-yellow-300 drop-shadow">▼</div>
            <div className="w-52 h-52 sm:w-60 sm:h-60 relative">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-xl"
                style={{
                  transform: `rotate(${wheelDeg}deg)`,
                  transition: isWheelSpinning
                    ? 'transform 2.8s cubic-bezier(0.14, 0.85, 0.22, 1)'
                    : 'none',
                }}
              >
                <circle cx="100" cy="100" r="98" fill="#78350f" stroke="#facc15" strokeWidth="4" />
                {ROULETTE_POCKETS.map((p, idx) => {
                  const slice = 360 / ROULETTE_POCKETS.length;
                  const a1 = ((idx * slice - 90) * Math.PI) / 180;
                  const a2 = (((idx + 1) * slice - 90) * Math.PI) / 180;
                  const x1 = 100 + 92 * Math.cos(a1);
                  const y1 = 100 + 92 * Math.sin(a1);
                  const x2 = 100 + 92 * Math.cos(a2);
                  const y2 = 100 + 92 * Math.sin(a2);
                  const midAngle = idx * slice + slice / 2;
                  const fill =
                    p.color === 'gold'
                      ? '#eab308'
                      : p.color === 'green'
                      ? '#16a34a'
                      : p.color === 'red'
                      ? '#dc2626'
                      : '#0f172a';
                  return (
                    <g key={p.key}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 92 92 0 0 1 ${x2} ${y2} Z`}
                        fill={fill}
                        stroke="#f8fafc"
                        strokeWidth="1.2"
                      />
                      <text
                        x="100"
                        y="26"
                        fill={p.color === 'gold' ? '#0f172a' : '#ffffff'}
                        fontSize="11"
                        fontWeight="900"
                        textAnchor="middle"
                        transform={`rotate(${midAngle} 100 100)`}
                      >
                        {p.label}
                      </text>
                    </g>
                  );
                })}
                <circle cx="100" cy="100" r="34" fill="#1e293b" stroke="#facc15" strokeWidth="4" />
                <text x="100" y="106" fill="#fde047" fontSize="16" fontWeight="900" textAnchor="middle">
                  {rouletteResult ? rouletteResult.label : '🎡'}
                </text>
              </svg>
            </div>
          </div>

          {/* メッセージ */}
          <div className="text-center text-xs sm:text-sm font-black text-amber-200 bg-slate-900/90 rounded-xl p-2.5 border border-white/10">
            {rouletteMessage}
          </div>

          {/* チップ選択 */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-xs font-black text-slate-300">チップ：</span>
            {([10, 50, 100, 500] as const).map((chip) => (
              <button
                key={chip}
                type="button"
                disabled={isWheelSpinning}
                onClick={() => {
                  playTapSound(660);
                  setRouletteChip(chip);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-black border-2 cursor-pointer ${
                  rouletteChip === chip
                    ? 'bg-yellow-300 text-slate-950 border-white shadow'
                    : 'bg-slate-900 text-slate-300 border-white/15'
                }`}
              >
                🪙{chip}
              </button>
            ))}
          </div>

          {/* ベットテーブル */}
          <div className="space-y-2">
            {/* 👑JP と 0 */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'jp' as const, label: '👑 JP (50倍)', bg: 'bg-amber-600/80 border-yellow-300' },
                { key: '0' as const, label: '0 (14倍)', bg: 'bg-emerald-700 border-emerald-300' },
              ].map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => handlePlaceRouletteBet(b.key)}
                  className={`relative py-2.5 rounded-xl font-black text-xs sm:text-sm text-white border-2 cursor-pointer active:scale-95 ${b.bg}`}
                >
                  {b.label}
                  {(rouletteBets[b.key] ?? 0) > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-yellow-300 text-slate-950 text-[10px]">
                      {rouletteBets[b.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* 数字 1〜12（12倍） */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                const pocket = ROULETTE_POCKETS.find((p) => p.num === n);
                const key = String(n) as RouletteBetKey;
                const betVal = rouletteBets[key] ?? 0;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handlePlaceRouletteBet(key)}
                    className={`relative py-2.5 rounded-xl font-black text-sm text-white border-2 cursor-pointer active:scale-95 ${
                      pocket?.color === 'red' ? 'bg-rose-700 border-rose-300' : 'bg-slate-900 border-slate-400'
                    }`}
                  >
                    <span>{n}</span>
                    <span className="block text-[9px] text-amber-200">12倍</span>
                    {betVal > 0 && (
                      <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full bg-yellow-300 text-slate-950 text-[10px] font-black shadow">
                        {betVal}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* アウトサイドベット（2倍・3倍） */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { key: 'red' as const, label: '🔴 あか (2倍)', cls: 'bg-rose-800 border-rose-300' },
                { key: 'black' as const, label: '⚫ くろ (2倍)', cls: 'bg-slate-900 border-slate-400' },
                { key: 'even' as const, label: '偶数 (2倍)', cls: 'bg-indigo-900 border-indigo-300' },
                { key: 'odd' as const, label: '奇数 (2倍)', cls: 'bg-indigo-900 border-indigo-300' },
              ].map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => handlePlaceRouletteBet(b.key)}
                  className={`py-2 rounded-xl font-black text-xs text-white border cursor-pointer active:scale-95 ${b.cls}`}
                >
                  {b.label}
                  {(rouletteBets[b.key] ?? 0) > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-yellow-300 text-slate-950 text-[10px]">
                      {rouletteBets[b.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: 'low' as const, label: '1〜4 (3倍)' },
                { key: 'mid' as const, label: '5〜8 (3倍)' },
                { key: 'high' as const, label: '9〜12 (3倍)' },
              ].map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => handlePlaceRouletteBet(b.key)}
                  className="py-2 rounded-xl font-black text-xs text-white bg-purple-900 border border-purple-300 cursor-pointer active:scale-95"
                >
                  {b.label}
                  {(rouletteBets[b.key] ?? 0) > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-yellow-300 text-slate-950 text-[10px]">
                      {rouletteBets[b.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 操作ボタン */}
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              disabled={isWheelSpinning}
              onClick={() => {
                playTapSound(420);
                setRouletteBets({});
              }}
              className="py-3 rounded-xl bg-slate-800 text-slate-200 font-black text-xs border border-white/20 flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>クリア</span>
            </button>
            <button
              type="button"
              disabled={isWheelSpinning || Object.keys(lastRouletteBets).length === 0}
              onClick={() => {
                playTapSound(600);
                setRouletteBets(lastRouletteBets);
              }}
              className="py-3 rounded-xl bg-sky-700 text-white font-black text-xs border border-sky-300 cursor-pointer disabled:opacity-40"
            >
              同じ賭け
            </button>
            <button
              type="button"
              disabled={isWheelSpinning}
              onClick={handleSpinRoulette}
              className="col-span-2 py-3 rounded-xl bg-gradient-to-r from-yellow-300 to-amber-500 text-slate-950 font-black text-sm sm:text-base border-2 border-white shadow cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isWheelSpinning ? '回転中…！' : '🎡 スピン！！'}
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 🃏 TAB 3: ポーカー ＆ ダブルアップ                                   */}
      {/* =================================================================== */}
      {subTab === 'poker' && (
        <div className="dq-window p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm sm:text-base font-black text-yellow-300">
              🃏 ドラクエ風ポーカー（JOKER入り53枚）
            </div>
            {pokerWinAmount > 0 && (
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                獲得予定：🪙{pokerWinAmount.toLocaleString()}枚 {doubleStreak > 0 ? `(${doubleStreak}連勝!)` : ''}
              </span>
            )}
          </div>

          {/* ベット額選択 */}
          {pokerPhase === 'bet' && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-black text-slate-300">ベット額：</span>
              {([10, 50, 100, 500] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    playTapSound(620);
                    setPokerBet(b);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 cursor-pointer ${
                    pokerBet === b
                      ? 'bg-yellow-300 text-slate-950 border-white shadow'
                      : 'bg-slate-900 text-slate-300 border-white/15'
                  }`}
                >
                  🪙{b}枚
                </button>
              ))}
            </div>
          )}

          {/* カード表示エリア（ポーカー手札 OR ダブルアップ画面） */}
          {(pokerPhase === 'doubleup' || pokerPhase === 'doubleResult') && doubleDealerCard ? (
            <div className="bg-emerald-950/80 border-2 border-yellow-400 rounded-2xl p-4 space-y-3 text-center">
              <div className="text-xs font-black text-yellow-300 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>🔥 ダブルアップ挑戦！（勝てば2倍 → 負ければ0枚）</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                {/* 親カード */}
                <div className="w-24 h-36 rounded-2xl bg-white text-slate-950 border-4 border-amber-400 flex flex-col items-center justify-center shadow-xl">
                  <span
                    className={`text-2xl ${
                      doubleDealerCard.suit === '♥' || doubleDealerCard.suit === '♦'
                        ? 'text-rose-600'
                        : 'text-slate-900'
                    }`}
                  >
                    {doubleDealerCard.suit}
                  </span>
                  <span className="text-3xl font-black">{doubleDealerCard.label}</span>
                </div>
                <span className="text-2xl font-black text-yellow-300">VS</span>
                {/* 次のカード */}
                <div className="w-24 h-36 rounded-2xl bg-white text-slate-950 border-4 border-cyan-400 flex flex-col items-center justify-center shadow-xl">
                  {doubleNextCard ? (
                    <>
                      <span
                        className={`text-2xl ${
                          doubleNextCard.suit === '♥' || doubleNextCard.suit === '♦'
                            ? 'text-rose-600'
                            : 'text-slate-900'
                        }`}
                      >
                        {doubleNextCard.suit}
                      </span>
                      <span className="text-3xl font-black">{doubleNextCard.label}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-black text-purple-600">？</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {(pokerHand.length > 0
                ? pokerHand
                : Array.from({ length: 5 }, (_, i): PlayingCard => ({
                    id: `back-${i}`,
                    suit: '👑',
                    rank: 0,
                    label: '?',
                    isJoker: false,
                  }))
              ).map((card, idx) => {
                const isRed = card.suit === '♥' || card.suit === '♦';
                const isHeld = pokerHolds[idx];
                const isFaceDown = card.rank === 0;
                return (
                  <button
                    key={card.id + idx}
                    type="button"
                    disabled={pokerPhase !== 'hold'}
                    onClick={() => {
                      if (pokerPhase !== 'hold') return;
                      playTapSound(700);
                      setPokerHolds((prev) => prev.map((v, i) => (i === idx ? !v : v)));
                    }}
                    className={`relative h-24 sm:h-32 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      isFaceDown
                        ? 'bg-gradient-to-br from-indigo-900 to-purple-950 border-amber-400/60 text-amber-300'
                        : isHeld
                        ? 'bg-yellow-50 border-yellow-400 -translate-y-2 shadow-[0_0_15px_rgba(250,204,21,0.8)] cursor-pointer'
                        : 'bg-white border-slate-300 cursor-pointer'
                    }`}
                  >
                    {isFaceDown ? (
                      <span className="text-2xl">🃏</span>
                    ) : (
                      <>
                        <span className={`text-xl sm:text-2xl ${isRed ? 'text-rose-600' : 'text-slate-900'}`}>
                          {card.suit}
                        </span>
                        <span
                          className={`text-base sm:text-xl font-black ${
                            card.isJoker ? 'text-purple-700 text-xs sm:text-sm' : isRed ? 'text-rose-600' : 'text-slate-900'
                          }`}
                        >
                          {card.label}
                        </span>
                        {isHeld && (
                          <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black border border-white">
                            HOLD
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* メッセージ */}
          <div className="text-center text-xs sm:text-sm font-black text-amber-200 bg-slate-900/90 rounded-xl p-2.5 border border-white/10">
            {pokerHandName && pokerPhase === 'result' ? `【${pokerHandName}】 ` : ''}
            {pokerMessage}
          </div>

          {/* フェーズ別アクションボタン */}
          <div className="flex flex-wrap gap-2 justify-center">
            {pokerPhase === 'bet' && (
              <button
                type="button"
                onClick={handleDealPoker}
                className="min-h-[56px] w-full max-w-sm rounded-2xl bg-gradient-to-r from-yellow-300 to-amber-500 text-slate-950 font-black text-base border-2 border-white shadow cursor-pointer active:scale-95"
              >
                🃏 くばる！（🪙{pokerBet}枚）
              </button>
            )}

            {pokerPhase === 'hold' && (
              <button
                type="button"
                onClick={handleDrawPoker}
                className="min-h-[56px] w-full max-w-sm rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-base border-2 border-white shadow cursor-pointer active:scale-95"
              >
                🔄 ひきなおす！（勝負！）
              </button>
            )}

            {pokerPhase === 'result' && pokerWinAmount > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleCollectPokerWin}
                  className="min-h-[54px] flex-1 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm sm:text-base border-2 border-white shadow cursor-pointer active:scale-95"
                >
                  💰 そのまま受け取る（+{pokerWinAmount.toLocaleString()}枚）
                </button>
                <button
                  type="button"
                  onClick={handleStartDoubleUp}
                  className="min-h-[54px] flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-sm sm:text-base border-2 border-yellow-300 shadow cursor-pointer active:scale-95"
                >
                  🔥 ダブルアップ（2倍挑戦！）
                </button>
              </>
            )}

            {pokerPhase === 'result' && pokerWinAmount === 0 && (
              <button
                type="button"
                onClick={() => setPokerPhase('bet')}
                className="min-h-[54px] w-full max-w-sm rounded-2xl bg-slate-700 text-white font-black text-base border-2 border-white/30 cursor-pointer"
              >
                もういちど 勝負する！
              </button>
            )}

            {pokerPhase === 'doubleup' && (
              <>
                <button
                  type="button"
                  onClick={() => handleGuessDoubleUp('high')}
                  className="min-h-[54px] flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-base border-2 border-white shadow cursor-pointer active:scale-95"
                >
                  ⬆️ 大きい（HIGH）
                </button>
                <button
                  type="button"
                  onClick={() => handleGuessDoubleUp('low')}
                  className="min-h-[54px] flex-1 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-black text-base border-2 border-white shadow cursor-pointer active:scale-95"
                >
                  ⬇️ 小さい（LOW）
                </button>
              </>
            )}

            {pokerPhase === 'doubleResult' && pokerWinAmount > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleCollectPokerWin}
                  className="min-h-[54px] flex-1 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm sm:text-base border-2 border-white shadow cursor-pointer active:scale-95"
                >
                  💰 勝ち逃げする（+{pokerWinAmount.toLocaleString()}枚）
                </button>
                <button
                  type="button"
                  onClick={handleStartDoubleUp}
                  className="min-h-[54px] flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-sm sm:text-base border-2 border-yellow-300 shadow cursor-pointer active:scale-95"
                >
                  🔥 さらに2倍へ！（現在 {pokerWinAmount.toLocaleString()}枚）
                </button>
              </>
            )}

            {pokerPhase === 'doubleResult' && pokerWinAmount === 0 && (
              <button
                type="button"
                onClick={() => setPokerPhase('bet')}
                className="min-h-[54px] w-full max-w-sm rounded-2xl bg-slate-700 text-white font-black text-base border-2 border-white/30 cursor-pointer"
              >
                きを取り直して もういちど！
              </button>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 🏆 TAB 4: メダル景品交換所（カジノ限定 UR 装備 ＆ 育成アイテム）     */}
      {/* =================================================================== */}
      {subTab === 'exchange' && (
        <div className="dq-window p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-white/15 pb-2">
            <div className="flex items-center gap-2 font-black text-sm sm:text-base text-yellow-300">
              <Trophy className="w-5 h-5" />
              <span>🏆 カジノメダル けいひん交換所</span>
            </div>
            <span className="text-xs font-black text-amber-200">所持：🪙{medals.toLocaleString()}枚</span>
          </div>

          {/* カジノ限定・超レア UR 装備 */}
          <div className="space-y-2">
            <div className="text-xs font-black text-pink-300">
              👑 たからばこでは絶対に出ない！カジノ限定 UR 装備
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {casinoEquipments.map((item) => {
                const cost = item.casinoCost ?? 15000;
                const isOwned = unlockedEquipmentIds.includes(item.id);
                const canAfford = medals >= cost;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-3.5 border-2 flex flex-col justify-between gap-2.5 ${
                      isOwned
                        ? 'bg-emerald-950/60 border-emerald-400'
                        : 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-amber-950/50 border-yellow-400/70'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-4xl">{item.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-300 text-slate-950">
                            👑 {item.rarity}限定
                          </span>
                          <span className="text-sm font-black text-white">{item.name}</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-300 mt-1">{item.description}</p>
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-black text-emerald-300 mt-1.5">
                          <span>❤️HP+{item.hpBonus}</span>
                          <span>⚔️ちから+{item.atkBonus}</span>
                          <span>🛡️まもり+{item.defBonus}</span>
                          <span>💨はやさ+{item.spdBonus}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isOwned || !canAfford}
                      onClick={() => {
                        if (isOwned || !canAfford) return;
                        playYoutuberAirhornSound();
                        fireQuestConfetti();
                        onRedeemPrize({
                          type: 'equipment',
                          cost,
                          equipmentId: item.id,
                          name: item.name,
                        });
                        speakJapanese(
                          `すっごーーーい！！カジノ限定の ちょうレアそうび、${item.name} を ゲットしたぞーっ！！`,
                          soundEnabled
                        );
                      }}
                      className={`w-full py-2.5 rounded-xl font-black text-xs sm:text-sm border-2 transition-all ${
                        isOwned
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 cursor-default'
                          : canAfford
                          ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 text-slate-950 border-white shadow cursor-pointer active:scale-95'
                          : 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      {isOwned
                        ? '✅ ゲット済み！（そうび図鑑で装備しよう）'
                        : `🪙 ${cost.toLocaleString()} 枚で こうかんする！`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 育成＆攻略サポート景品 */}
          <div className="space-y-2 pt-2 border-t border-white/15">
            <div className="text-xs font-black text-cyan-300">✨ ぼうけん＆育成サポートアイテム</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { type: 'expOrbs' as const, amount: 3, cost: 500, emoji: '🌟', name: 'けいけんち玉 ×3' },
                { type: 'chestKey' as const, amount: 1, cost: 1500, emoji: '🎁', name: '金のたからばこ ×1' },
                { type: 'starBall' as const, amount: 1, cost: 3000, emoji: '🟠', name: 'ほし玉 ×1' },
              ].map((p) => {
                const canAfford = medals >= p.cost;
                return (
                  <button
                    key={p.name}
                    type="button"
                    disabled={!canAfford}
                    onClick={() => {
                      if (!canAfford) return;
                      playTreasureChestSound();
                      onRedeemPrize(p);
                      speakJapanese(`${p.name} と こうかんしたよ！`, soundEnabled);
                    }}
                    className={`rounded-xl p-3 border-2 text-left flex items-center justify-between gap-2 transition-all ${
                      canAfford
                        ? 'bg-slate-900 hover:bg-slate-800 border-cyan-400 cursor-pointer active:scale-95'
                        : 'bg-slate-950/60 border-slate-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="text-lg">{p.emoji}</div>
                      <div className="text-xs font-black text-white">{p.name}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs shrink-0">
                      🪙{p.cost.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
