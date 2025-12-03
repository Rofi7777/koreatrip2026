"use client";

import { useState } from "react";
import { X } from "lucide-react";

type TranslationDirection = "vi2ko" | "ko2vi";

export function HeroTranslateBtn() {
  const [isOpen, setIsOpen] = useState(false);
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
    setTranslation(null);
    setError(null);
  };

  return (
    <>
      {/* Quick Translate Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm font-medium transition-colors border border-white/30"
      >
        <span className="text-base">🗣️</span>
        <span className="hidden sm:inline">Dịch Nhanh</span>
        <span className="sm:hidden">Dịch</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Phiên dịch viên AI
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setInputText("");
                  setTranslation(null);
                  setError(null);
                }}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-4 space-y-3">
              {/* Language Direction Toggle */}
              <button
                type="button"
                onClick={toggleDirection}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-xs font-medium text-[#6D28D9] hover:bg-purple-100 transition-colors"
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
                className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent resize-none"
                disabled={loading}
              />

              {/* Translate Button */}
              <button
                type="button"
                onClick={handleTranslate}
                disabled={loading || !inputText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#6D28D9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#5B21B6] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
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
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {/* Translation Result */}
              {translation && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-1">Kết quả dịch:</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{translation}</p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(translation);
                    }}
                    className="mt-2 text-xs text-[#6D28D9] hover:text-[#5B21B6] flex items-center gap-1"
                  >
                    <i className="fas fa-copy" />
                    <span>Sao chép</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

