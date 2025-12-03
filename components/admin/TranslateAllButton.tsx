"use client";

import { useState } from "react";

export function TranslateAllButton() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (isTranslating) return;

    const confirmed = window.confirm(
      "This will translate all itinerary items from Chinese to Vietnamese and set Vietnamese as the base content. This may take 30-60 seconds. Continue?"
    );

    if (!confirmed) return;

    setIsTranslating(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/translate-to-vietnamese", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Translation failed");
      }

      setMessage(
        `✅ Vietnamese Translation Complete! Updated ${data.updated} out of ${data.attempted} items. Please refresh the page to see changes.`
      );

      // Show alert and reload after a short delay
      setTimeout(() => {
        alert(
          `Vietnamese Translation Complete!\n\nUpdated: ${data.updated} items\nTotal: ${data.total} items\n\nVietnamese content is now set as the base content.\n\nPlease refresh the page to see the changes.`
        );
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Translation error:", error);
      setMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <i className="fas fa-language text-[#6D28D9]" />
          <span>Database Translation</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 mb-3">
        Translate all itinerary items from Chinese to Vietnamese and set Vietnamese as the base content.
      </p>

      <button
        type="button"
        onClick={handleTranslate}
        disabled={isTranslating}
        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isTranslating
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#6D28D9] text-white hover:bg-[#5B21B6] shadow-sm"
        }`}
      >
        {isTranslating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            AI đang dịch sang tiếng Việt... có thể mất 30-60 giây
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            ✨ Dịch Tất Cả Sang Tiếng Việt
          </span>
        )}
      </button>

      {message && (
        <div
          className={`mt-3 text-xs p-2 rounded ${
            message.startsWith("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

