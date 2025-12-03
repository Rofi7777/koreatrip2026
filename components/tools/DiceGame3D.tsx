"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface DiceRotation {
  x: number;
  y: number;
}

interface DiceResult {
  die1: number;
  die2: number;
  total: number;
  isDouble: boolean;
  isLucky7: boolean;
  isSnakeEyes: boolean;
}

// Mapping: value -> {x, y} rotations in degrees
// Each face requires specific rotations to show on top
const DICE_ROTATIONS: Record<number, DiceRotation> = {
  1: { x: 0, y: 0 }, // Front face
  2: { x: 0, y: -90 }, // Right face
  3: { x: -90, y: 0 }, // Top face
  4: { x: 90, y: 0 }, // Bottom face
  5: { x: 0, y: 90 }, // Left face
  6: { x: 180, y: 0 }, // Back face
};

function getDiceDots(value: number) {
  const positions: Record<number, number[][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
  };

  const positionsForValue = positions[value] || [];
  const dots = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const hasDot = positionsForValue.some(([r, c]) => r === row && c === col);
      dots.push(
        <div
          key={`${row}-${col}`}
          className={`relative ${hasDot ? "w-3 h-3" : "w-2 h-2"}`}
        >
          {hasDot && (
            <div className="absolute inset-0 rounded-full bg-gray-800 shadow-inner">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-gray-700"></div>
              <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white/30"></div>
            </div>
          )}
        </div>
      );
    }
  }
  return dots;
}

function DiceFace({ value, face }: { value: number; face: string }) {
  return (
    <div
      className={`absolute w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-xl border-2 border-white/50 flex items-center justify-center grid grid-cols-3 gap-1.5 p-3 ${
        face === "front" || face === "back"
          ? "backface-hidden"
          : face === "right" || face === "left"
          ? "backface-hidden"
          : "backface-hidden"
      }`}
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {getDiceDots(value)}
      {/* Top highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent rounded-xl pointer-events-none"></div>
    </div>
  );
}

function Dice3D({
  value,
  rotation,
  isRolling,
}: {
  value: number;
  rotation: DiceRotation;
  isRolling: boolean;
}) {
  const size = 80; // Size of the dice in pixels
  const halfSize = size / 2;

  return (
    <div
      className="relative"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transformStyle: "preserve-3d",
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: isRolling ? "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
      }}
    >
      {/* Front face (1) */}
      <div
        style={{
          position: "absolute",
          width: `${size}px`,
          height: `${size}px`,
          transform: `translateZ(${halfSize}px)`,
        }}
      >
        <DiceFace value={1} face="front" />
      </div>

      {/* Back face (6) */}
      <div
        style={{
          position: "absolute",
          width: `${size}px`,
          height: `${size}px`,
          transform: `translateZ(-${halfSize}px) rotateY(180deg)`,
        }}
      >
        <DiceFace value={6} face="back" />
      </div>

      {/* Right face (2) */}
      <div
        style={{
          position: "absolute",
          width: `${size}px`,
          height: `${size}px`,
          transform: `rotateY(90deg) translateZ(${halfSize}px)`,
        }}
      >
        <DiceFace value={2} face="right" />
      </div>

      {/* Left face (5) */}
      <div
        style={{
          position: "absolute",
          width: `${size}px`,
          height: `${size}px`,
          transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
        }}
      >
        <DiceFace value={5} face="left" />
      </div>

      {/* Top face (3) */}
      <div
        style={{
          position: "absolute",
          width: `${size}px`,
          height: `${size}px`,
          transform: `rotateX(90deg) translateZ(${halfSize}px)`,
        }}
      >
        <DiceFace value={3} face="top" />
      </div>

      {/* Bottom face (4) */}
      <div
        style={{
          position: "absolute",
          width: `${size}px`,
          height: `${size}px`,
          transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
        }}
      >
        <DiceFace value={4} face="bottom" />
      </div>
    </div>
  );
}

export function DiceGame3D() {
  const { language } = useLanguage();
  const [diceRotation, setDiceRotation] = useState<{
    d1: DiceRotation;
    d2: DiceRotation;
  }>({
    d1: { x: 0, y: 0 },
    d2: { x: 0, y: 0 },
  });
  const [diceValues, setDiceValues] = useState({ die1: 1, die2: 1 });
  const [isRolling, setIsRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<DiceResult | null>(null);

  const rollDice = () => {
    setIsRolling(true);
    setShowResult(false);

    // Generate random results
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;

    // Get base rotations for target faces
    const target1 = DICE_ROTATIONS[die1];
    const target2 = DICE_ROTATIONS[die2];

    // Add extra spins for visual effect (multiple full rotations)
    const extraSpins = 3; // Number of full spins
    const spinX1 = target1.x + extraSpins * 360 + Math.random() * 360;
    const spinY1 = target1.y + extraSpins * 360 + Math.random() * 360;
    const spinX2 = target2.x + extraSpins * 360 + Math.random() * 360;
    const spinY2 = target2.y + extraSpins * 360 + Math.random() * 360;

    // Update rotations to trigger animation
    setDiceRotation({
      d1: { x: spinX1, y: spinY1 },
      d2: { x: spinX2, y: spinY2 },
    });

    // After animation completes, set final values and calculate result
    setTimeout(() => {
      setDiceValues({ die1, die2 });
      setDiceRotation({
        d1: target1,
        d2: target2,
      });

      const total = die1 + die2;
      const isDouble = die1 === die2;
      const isLucky7 = total === 7;
      const isSnakeEyes = die1 === 1 && die2 === 1;

      setResult({ die1, die2, total, isDouble, isLucky7, isSnakeEyes });
      setIsRolling(false);
      setShowResult(true);
    }, 1200);
  };

  const getResultMessage = () => {
    if (!result) return "";
    if (result.isSnakeEyes) {
      return language === "vi"
        ? "🐍 Xui Xẻo - Uống Cả Đội!"
        : language === "zh-TW"
        ? "🐍 倒霉 - 全隊喝！"
        : "🐍 Bad Luck - Everyone Drinks!";
    }
    if (result.isDouble) {
      return language === "vi"
        ? "🎉 DOUBLE! Uống 2 Ly!"
        : language === "zh-TW"
        ? "🎉 雙倍！喝2杯！"
        : "🎉 DOUBLE! Drink 2 Glasses!";
    }
    if (result.isLucky7) {
      return language === "vi"
        ? "🍀 7 Nút - May Mắn!"
        : language === "zh-TW"
        ? "🍀 7點 - 幸運！"
        : "🍀 Lucky 7!";
    }
    return language === "vi"
      ? `${result.total} Nút`
      : language === "zh-TW"
      ? `${result.total} 點`
      : `${result.total} Points`;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
        <i className="fas fa-dice text-white" />
        <span>
          {language === "vi"
            ? "Lắc Xúc Xắc"
            : language === "zh-TW"
            ? "擲骰子"
            : "Roll Dice"}
        </span>
      </div>

      {/* 3D Dice Display */}
      <div
        className="flex items-center justify-center gap-6 mb-4"
        style={{
          perspective: "1000px",
          perspectiveOrigin: "center center",
        }}
      >
        {/* Die 1 */}
        <div className="flex flex-col items-center">
          <Dice3D
            value={diceValues.die1}
            rotation={diceRotation.d1}
            isRolling={isRolling}
          />
        </div>

        {/* Plus Sign */}
        <span className="text-3xl font-bold text-white drop-shadow-lg">+</span>

        {/* Die 2 */}
        <div className="flex flex-col items-center">
          <Dice3D
            value={diceValues.die2}
            rotation={diceRotation.d2}
            isRolling={isRolling}
          />
        </div>
      </div>

      {/* Result Display */}
      {showResult && result && (
        <div
          className={`mb-4 p-3 rounded-lg text-center font-bold text-sm transition-all duration-300 ${
            result.isSnakeEyes
              ? "bg-red-500/30 text-red-100 border border-red-300/50"
              : result.isDouble
              ? "bg-yellow-500/30 text-yellow-100 border border-yellow-300/50"
              : result.isLucky7
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

