"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface DiceResult {
  die1: number;
  die2: number;
  total: number;
  isDouble: boolean;
  isLucky7: boolean;
  isSnakeEyes: boolean;
}

export function DiceGame() {
  const { language } = useLanguage();
  const [dice, setDice] = useState<DiceResult>({ die1: 1, die2: 1, total: 2, isDouble: true, isLucky7: false, isSnakeEyes: true });
  const [isRolling, setIsRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setShowResult(false);

    // Shake animation duration
    setTimeout(() => {
      const die1 = Math.floor(Math.random() * 6) + 1;
      const die2 = Math.floor(Math.random() * 6) + 1;
      const total = die1 + die2;
      const isDouble = die1 === die2;
      const isLucky7 = total === 7;
      const isSnakeEyes = die1 === 1 && die2 === 1;

      setDice({ die1, die2, total, isDouble, isLucky7, isSnakeEyes });
      setIsRolling(false);
      setShowResult(true);
    }, 500);
  };

  const getDiceDots = (value: number) => {
    const dots = [];
    const positions: Record<number, number[][]> = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
    };

    const positionsForValue = positions[value] || [];
    
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const hasDot = positionsForValue.some(([r, c]) => r === row && c === col);
        dots.push(
          <div
            key={`${row}-${col}`}
            className={`w-2 h-2 rounded-full ${
              hasDot ? "bg-gray-800" : "bg-transparent"
            }`}
          />
        );
      }
    }
    return dots;
  };

  const getResultMessage = () => {
    if (dice.isSnakeEyes) {
      return language === "vi"
        ? "🐍 Xui Xẻo - Uống Cả Đội!"
        : language === "zh-TW"
        ? "🐍 倒霉 - 全隊喝！"
        : "🐍 Bad Luck - Everyone Drinks!";
    }
    if (dice.isDouble) {
      return language === "vi"
        ? "🎉 DOUBLE! Uống 2 Ly!"
        : language === "zh-TW"
        ? "🎉 雙倍！喝2杯！"
        : "🎉 DOUBLE! Drink 2 Glasses!";
    }
    if (dice.isLucky7) {
      return language === "vi"
        ? "🍀 7 Nút - May Mắn!"
        : language === "zh-TW"
        ? "🍀 7點 - 幸運！"
        : "🍀 Lucky 7!";
    }
    return language === "vi"
      ? `${dice.total} Nút`
      : language === "zh-TW"
      ? `${dice.total} 點`
      : `${dice.total} Points`;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
        <i className="fas fa-dice text-white" />
        <span>{language === "vi" ? "Lắc Xúc Xắc" : language === "zh-TW" ? "擲骰子" : "Roll Dice"}</span>
      </div>

      {/* Dice Display */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* Die 1 */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg shadow-lg flex items-center justify-center grid grid-cols-3 gap-1 p-2 ${
            isRolling ? "animate-shake" : ""
          }`}
        >
          {getDiceDots(dice.die1)}
        </div>

        {/* Plus Sign */}
        <span className="text-2xl font-bold text-white">+</span>

        {/* Die 2 */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg shadow-lg flex items-center justify-center grid grid-cols-3 gap-1 p-2 ${
            isRolling ? "animate-shake" : ""
          }`}
        >
          {getDiceDots(dice.die2)}
        </div>
      </div>

      {/* Result Display */}
      {showResult && (
        <div
          className={`mb-4 p-3 rounded-lg text-center font-bold text-sm transition-all duration-300 ${
            dice.isSnakeEyes
              ? "bg-red-500/30 text-red-100 border border-red-300/50"
              : dice.isDouble
              ? "bg-yellow-500/30 text-yellow-100 border border-yellow-300/50"
              : dice.isLucky7
              ? "bg-green-500/30 text-green-100 border border-green-300/50"
              : "bg-white/20 text-white border border-white/30"
          }`}
        >
          {getResultMessage()}
        </div>
      )}

      {/* Roll Button */}
      <button
        type="button"
        onClick={rollDice}
        disabled={isRolling}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-orange-600 px-4 py-3 text-sm font-bold shadow-lg hover:bg-white/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
      >
        {isRolling ? (
          <>
            <span className="animate-spin text-lg">⚡</span>
            <span>
              {language === "vi"
                ? "Đang lắc..."
                : language === "zh-TW"
                ? "搖骰中..."
                : "Rolling..."}
            </span>
          </>
        ) : (
          <>
            <i className="fas fa-dice text-base" />
            <span>
              {language === "vi"
                ? "Lắc Xúc Xắc"
                : language === "zh-TW"
                ? "擲骰子"
                : "Roll Dice"}
            </span>
          </>
        )}
      </button>

      {/* Instructions */}
      <div className="mt-4 text-xs text-white/80 text-center space-y-1">
        <p>
          {language === "vi"
            ? "🎲 Double = Uống 2 ly"
            : language === "zh-TW"
            ? "🎲 雙倍 = 喝2杯"
            : "🎲 Double = Drink 2 glasses"}
        </p>
        <p>
          {language === "vi"
            ? "🍀 7 nút = May mắn!"
            : language === "zh-TW"
            ? "🍀 7點 = 幸運！"
            : "🍀 7 points = Lucky!"}
        </p>
        <p>
          {language === "vi"
            ? "🐍 Snake Eyes = Cả đội uống"
            : language === "zh-TW"
            ? "🐍 蛇眼 = 全隊喝"
            : "🐍 Snake Eyes = Everyone drinks"}
        </p>
      </div>
    </div>
  );
}

