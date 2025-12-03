"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";

const MEMBERS = ["Zoe", "Rofi", "Trieu", "Diem", "Juli", "Tham", "My", "Binh"];
const COLORS = ["#6D28D9", "#8B5CF6", "#A78BFA", "#C4B5FD", "#6D28D9", "#8B5CF6", "#A78BFA", "#C4B5FD"];

// Punishment levels with probabilities (for random selection)
const PUNISHMENTS = [
  "Uống Tùy Ý 🍺", // 5x (high chance)
  "Uống Tùy Ý 🍺",
  "Uống Tùy Ý 🍺",
  "Uống Tùy Ý 🍺",
  "Uống Tùy Ý 🍺",
  "Uống 25% 🥃", // 1x
  "Uống 50% 🍷", // 1x
  "Uống 100% ☠️", // 1x (rare)
];

// Unique punishment levels for wheel display (8 segments)
// Interleaved arrangement: percentages scattered between "Tùy Ý" items
const PUNISHMENT_WHEEL_ITEMS = [
  "Uống Tùy Ý 🍺",
  "Uống 25% 🥃",
  "Uống Tùy Ý 🍺",
  "Uống 50% 🍷",
  "Uống Tùy Ý 🍺",
  "Uống 100% ☠️",
  "Uống Tùy Ý 🍺",
  "Uống Tùy Ý 🍺",
];

const PUNISHMENT_COLORS = ["#6D28D9", "#8B5CF6", "#A78BFA", "#C4B5FD", "#6D28D9", "#8B5CF6", "#A78BFA", "#C4B5FD"];

type GameStage = "idle" | "spinning" | "stopped" | "punishmentSpinning";
type GamePhase = "who" | "punishment";

export function LuckyWheel() {
  const [rotation, setRotation] = useState(0);
  const [punishmentRotation, setPunishmentRotation] = useState(0);
  const [gameStage, setGameStage] = useState<GameStage>("idle");
  const [gamePhase, setGamePhase] = useState<GamePhase>("who");
  const [punishment, setPunishment] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleSpin = () => {
    if (gameStage === "spinning" || gameStage === "punishmentSpinning") return;

    setGameStage("spinning");
    setGamePhase("who");
    setPunishment(null);
    setShowConfetti(false);

    // Simple visual spin: random rotation with multiple full spins
    const randomAngle = Math.random() * 360;
    const fullSpins = 360 * (5 + Math.floor(Math.random() * 3)); // 5-7 full spins
    const totalRotation = rotation + fullSpins + randomAngle;

    setRotation(totalRotation);

    // After 4 seconds, wheel stops
    setTimeout(() => {
      setGameStage("stopped");
    }, 4000);
  };

  const handleDrawPunishment = () => {
    if (gameStage !== "stopped") return;

    setGameStage("punishmentSpinning");
    setGamePhase("punishment");
    setPunishment(null);
    setShowConfetti(false);

    // PRE-DETERMINED OUTCOME: Pick punishment first, then calculate rotation
    const randomIndex = Math.floor(Math.random() * PUNISHMENTS.length);
    const selectedPunishment = PUNISHMENTS[randomIndex];

    // Find the index in the wheel items array (they might be duplicated)
    // Since we have duplicates, find all matching indices and pick one randomly
    const matchingIndices: number[] = [];
    PUNISHMENT_WHEEL_ITEMS.forEach((item, idx) => {
      if (item === selectedPunishment) {
        matchingIndices.push(idx);
      }
    });
    const finalWheelIndex =
      matchingIndices.length > 0
        ? matchingIndices[Math.floor(Math.random() * matchingIndices.length)]
        : Math.floor(Math.random() * PUNISHMENT_WHEEL_ITEMS.length);

    // Calculate angle to land on the selected punishment
    const SEGMENT_ANGLE = 360 / PUNISHMENT_WHEEL_ITEMS.length; // 45 degrees
    const targetAngle = 360 - (finalWheelIndex * SEGMENT_ANGLE);
    const centerOffset = SEGMENT_ANGLE / 2; // 22.5 degrees
    let finalAngle = targetAngle - centerOffset;

    // Normalize to positive angle (0-360)
    if (finalAngle < 0) {
      finalAngle = 360 + finalAngle;
    }

    // Add full spins for visual effect (fixed 5 spins, same as first wheel)
    const fullSpins = 360 * 5; // 5 full spins
    const totalRotation = punishmentRotation + finalAngle + fullSpins;

    setPunishmentRotation(totalRotation);

    // After 4 seconds, wheel stops (no result card, just visual)
    setTimeout(() => {
      setGameStage("stopped");
      // Don't show confetti or result card - just let users see the pointer
    }, 4000);
  };

  const handlePlayAgain = () => {
    setGameStage("idle");
    setGamePhase("who");
    setPunishment(null);
    setShowConfetti(false);
    // Reset rotations for fresh start
    setRotation(0);
    setPunishmentRotation(0);
  };

  // Check if we should show "Play Again" button
  const showPlayAgain = gameStage === "stopped" && gamePhase === "punishment";

  // Create conic gradient for the member wheel
  const memberWheelStyle = {
    background: `conic-gradient(
      ${COLORS.map((color, i) => {
        const startAngle = (i * 360) / MEMBERS.length;
        const endAngle = ((i + 1) * 360) / MEMBERS.length;
        return `${color} ${startAngle}deg ${endAngle}deg`;
      }).join(", ")}
    )`,
    transform: `rotate(${rotation}deg)`,
    transition: gameStage === "spinning" ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
  };

  // Create conic gradient for the punishment wheel
  const punishmentWheelStyle = {
    background: `conic-gradient(
      ${PUNISHMENT_COLORS.map((color, i) => {
        const startAngle = (i * 360) / PUNISHMENT_WHEEL_ITEMS.length;
        const endAngle = ((i + 1) * 360) / PUNISHMENT_WHEEL_ITEMS.length;
        return `${color} ${startAngle}deg ${endAngle}deg`;
      }).join(", ")}
    )`,
    transform: `rotate(${punishmentRotation}deg)`,
    transition: gameStage === "punishmentSpinning" ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
  };

  // Determine which wheel to show and its style
  const isShowingPunishmentWheel = gamePhase === "punishment";
  const currentWheelStyle = isShowingPunishmentWheel ? punishmentWheelStyle : memberWheelStyle;
  const currentItems = isShowingPunishmentWheel ? PUNISHMENT_WHEEL_ITEMS : MEMBERS;
  const isSpinning = gameStage === "spinning" || gameStage === "punishmentSpinning";

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
          <i className="fas fa-dice text-[#6D28D9]" />
          Ai Uống? 🍺
        </div>

        <div className="flex flex-col items-center">
          {/* Title for current phase */}
          {gamePhase === "punishment" && (
            <div className="mb-4 text-center animate-fadeIn">
              <h3 className="text-lg font-bold text-[#6D28D9]">
                Uống Bao Nhiêu?
              </h3>
            </div>
          )}

          {/* Wheel Container */}
          <div className="relative w-full max-w-[320px] aspect-square mb-6">
            {/* Pointer - Enhanced visibility */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-30">
              <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[30px] border-l-transparent border-r-transparent border-t-[#6D28D9] drop-shadow-2xl" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-1 h-2 bg-[#6D28D9] rounded-full" />
            </div>

            {/* Wheel */}
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg border-4 border-white">
              <div className="w-full h-full rounded-full" style={currentWheelStyle}>
                {/* Items Overlay (Members or Punishments) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {currentItems.map((item, index) => {
                    const angle = (index * 360) / currentItems.length + 360 / currentItems.length / 2;
                    const radian = (angle * Math.PI) / 180;
                    const radius = 35; // Percentage from center
                    const x = 50 + radius * Math.cos(radian);
                    const y = 50 + radius * Math.sin(radian);

                    return (
                      <div
                        key={`${item}-${index}`}
                        className="absolute text-white font-bold text-[10px] sm:text-xs leading-tight"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                          textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                          width: isShowingPunishmentWheel ? "70px" : "50px",
                          textAlign: "center",
                          lineHeight: "1.2",
                        }}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>

                {/* Center Circle (for spin button) */}
                {gamePhase === "who" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white shadow-lg border-4 border-[#6D28D9] flex items-center justify-center z-10">
                      <button
                        type="button"
                        onClick={handleSpin}
                        disabled={isSpinning}
                        className="w-full h-full rounded-full bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:active:scale-100"
                      >
                        {gameStage === "spinning" ? (
                          <span className="animate-spin text-lg">⚡</span>
                        ) : (
                          "QUAY NGAY"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phase 2: Punishment Draw Button */}
          {gameStage === "stopped" && gamePhase === "who" && (
            <div className="w-full max-w-[320px] animate-fadeIn">
              <button
                type="button"
                onClick={handleDrawPunishment}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                🎴 Rút Thăm Mức Phạt
              </button>
            </div>
          )}

          {/* Play Again Button - Show after punishment wheel stops */}
          {showPlayAgain && (
            <div className="w-full max-w-[320px] mt-4 animate-fadeIn">
              <button
                type="button"
                onClick={handlePlayAgain}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                Chơi Lại
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
