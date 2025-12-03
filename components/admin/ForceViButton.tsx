"use client";

import { useState } from "react";

export function ForceViButton() {
  const [translating, setTranslating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = async () => {
    const confirmed = window.confirm(
      "This will translate all Chinese content to Vietnamese. This may take a few minutes. Continue?"
    );
    if (!confirmed) return;

    setTranslating(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/force-vi-only", {
        method: "POST",
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message ?? "Failed to translate.");
      }

      setMessage("✅ Translation complete! Please refresh the page.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={translating}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {translating ? (
          <>
            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
            Translating...
          </>
        ) : (
          <>
            <i className="fas fa-language" />
            🔄 Force Translate All to Vietnamese (One-Time)
          </>
        )}
      </button>
      {message && (
        <p className="mt-2 text-xs text-center text-gray-600">{message}</p>
      )}
    </div>
  );
}


