"use client";

import { useState } from "react";

export function BatchTranslateButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBatchTranslate = async () => {
    const confirmed = window.confirm(
      "This will translate all Vietnamese content to Traditional Chinese. This may take a few minutes. Continue?"
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/batch-translate-zh", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to translate");
      }

      setMessage(
        data.message ||
          `Translation completed! Updated: ${data.results?.itinerary?.updated || 0} itinerary, ${data.results?.tasks?.updated || 0} tasks, ${data.results?.info_cards?.updated || 0} info cards.`
      );

      // Refresh page after 2 seconds to show updated content
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("[BatchTranslate] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to translate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
        <span className="text-lg">🇹🇼</span>
        Translate All to Chinese
      </div>

      <p className="text-xs text-white/90 mb-4">
        Translate all Vietnamese content (Itinerary, Tasks, Info Cards) to Traditional Chinese. This is a one-time operation.
      </p>

      <button
        type="button"
        onClick={handleBatchTranslate}
        disabled={loading}
        className="w-full px-4 py-2.5 rounded-lg bg-white/20 backdrop-blur-md text-white text-sm font-medium hover:bg-white/30 transition-colors disabled:opacity-70 disabled:cursor-not-allowed border border-white/30"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Translating...
          </span>
        ) : (
          "🇹🇼 Translate All to Chinese"
        )}
      </button>

      {message && (
        <div className="mt-3 p-2 rounded-lg bg-green-500/20 border border-green-400/30 text-xs text-white">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-3 p-2 rounded-lg bg-red-500/20 border border-red-400/30 text-xs text-white">
          {error}
        </div>
      )}
    </div>
  );
}

