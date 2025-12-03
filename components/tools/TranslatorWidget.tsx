"use client";

import { useState } from "react";

type TranslationDirection = "vi2ko" | "ko2vi";

export function TranslatorWidget() {
  const [direction, setDirection] = useState<TranslationDirection>("vi2ko");
  const [inputText, setInputText] = useState("");
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Vui lòng nhập nội dung cần dịch.");
      return;
    }

    setLoading(true);
    setError(null);
    setTranslation(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          direction,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message ?? "Dịch thất bại. Vui lòng thử lại.");
      }

      setTranslation(json.translation || "");
    } catch (err) {
      console.error("Translation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleDirection = () => {
    setDirection(direction === "vi2ko" ? "ko2vi" : "vi2ko");
    // Clear previous translation when switching direction
    setTranslation(null);
    setError(null);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
        <i className="fas fa-language text-white" />
        <span>Phiên dịch viên AI</span>
      </div>

      {/* Language Direction Toggle */}
      <button
        type="button"
        onClick={toggleDirection}
        className="w-full mb-3 inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 backdrop-blur-md px-3 py-2 text-xs font-medium text-white hover:bg-white/30 transition-colors border border-white/30"
      >
        {direction === "vi2ko" ? (
          <>
            <span>🇻🇳</span>
            <span>Tiếng Việt</span>
            <i className="fas fa-arrow-right text-[10px]" />
            <span>🇰🇷</span>
            <span>Tiếng Hàn</span>
          </>
        ) : (
          <>
            <span>🇰🇷</span>
            <span>Tiếng Hàn</span>
            <i className="fas fa-arrow-right text-[10px]" />
            <span>🇻🇳</span>
            <span>Tiếng Việt</span>
          </>
        )}
        <i className="fas fa-exchange-alt ml-1 text-[10px]" />
      </button>

      {/* Input Area */}
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Nhập nội dung cần dịch..."
        className="w-full min-h-[80px] px-3 py-2 text-sm border border-white/30 bg-white/20 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none text-white placeholder-white/60"
        disabled={loading}
      />

      {/* Translate Button */}
      <button
        type="button"
        onClick={handleTranslate}
        disabled={loading || !inputText.trim()}
        className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white text-indigo-600 px-4 py-2 text-xs font-semibold shadow-sm hover:bg-white/90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
            <span>Đang dịch...</span>
          </>
        ) : (
          <>
            <i className="fas fa-magic" />
            <span>Dịch ngay</span>
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-500/30 border border-red-300/50 rounded-lg backdrop-blur-md">
          <p className="text-xs text-white">{error}</p>
        </div>
      )}

      {/* Translation Result */}
      {translation && (
        <div className="mt-3 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg">
          <p className="text-xs font-medium text-white/90 mb-1">Kết quả dịch:</p>
          <p className="text-sm text-white whitespace-pre-wrap">{translation}</p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(translation);
              // Optional: show a toast notification
            }}
            className="mt-2 text-xs text-white hover:text-white/80 flex items-center gap-1"
          >
            <i className="fas fa-copy" />
            <span>Sao chép</span>
          </button>
        </div>
      )}
    </div>
  );
}

