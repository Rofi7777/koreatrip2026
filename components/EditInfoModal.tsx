"use client";

import { useState } from "react";
import type { InfoCard as InfoCardType } from "@/types";

interface EditInfoModalProps {
  card: InfoCardType | null; // null for create mode
  onClose: () => void;
  onSave: (
    updates: {
      id?: InfoCardType["id"];
      language: "vi" | "zh-TW" | "en";
      title: string;
      content: string;
      autoTranslate: boolean;
    } & Partial<InfoCardType>
  ) => Promise<void>;
  onDelete?: (id: InfoCardType["id"]) => Promise<void>;
}

const ICON_OPTIONS = [
  { value: "passport", label: "📄 Passport/Docs" },
  { value: "phone", label: "📱 Phone/Apps" },
  { value: "luggage", label: "🧳 Luggage/Packing" },
  { value: "train", label: "🚇 Train/Transport" },
  { value: "cloud", label: "☁️ Weather" },
  { value: "credit-card", label: "💳 Money" },
  { value: "utensils", label: "🍽️ Food" },
  { value: "heart", label: "❤️ Culture" },
  { value: "phone-call", label: "📞 Emergency" },
  { value: "wifi", label: "📶 WiFi" },
];

export function EditInfoModal({
  card,
  onClose,
  onSave,
  onDelete,
}: EditInfoModalProps) {
  const isCreateMode = card === null;

  const initialTitle = isCreateMode
    ? ""
    : card.title_vi || card.title || "";

  const initialContent = isCreateMode
    ? ""
    : card.content_vi || card.content || "";

  const [title, setTitle] = useState(initialTitle ?? "");
  const [content, setContent] = useState(initialContent);
  const [icon, setIcon] = useState(isCreateMode ? "train" : (card.icon ?? "train"));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    
    try {
      await onSave({
        ...(isCreateMode ? {} : { id: (card as InfoCardType).id }),
        title,
        content,
        language: "vi",
        autoTranslate: false,
        icon: icon || null,
      });
    } catch (err) {
      console.error("[EditInfoModal] Save error:", err);
      setError("Failed to save changes. Please try again.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isCreateMode || !onDelete) return;
    
    const confirmed = window.confirm("Are you sure you want to delete this info card? This action cannot be undone.");
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    
    try {
      await onDelete((card as InfoCardType).id);
    } catch (err) {
      console.error("[EditInfoModal] Delete error:", err);
      setError("Failed to delete info card. Please try again.");
      setDeleting(false);
    }
  };

  const handleSyncToChinese = async () => {
    if (isCreateMode || !card) return;

    setSyncing(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/sync-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "info_cards",
          id: (card as InfoCardType).id,
          sourceData: {
            title: title || (card as InfoCardType).title_vi || (card as InfoCardType).title || "",
            content: content || (card as InfoCardType).content_vi || (card as InfoCardType).content || "",
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to sync translation");
      }

      alert("Translation synced to Chinese successfully!");
      window.location.reload();
    } catch (err) {
      console.error("[EditInfoModal] Sync error:", err);
      setError(err instanceof Error ? err.message : "Failed to sync translation. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            {isCreateMode ? "Add New Info Card" : "Edit Info Card"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            disabled={saving || deleting}
          >
            <i className="fas fa-xmark text-xs" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Icon
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs bg-white focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-gray-500">
              Icon name (e.g., "passport", "phone", "luggage") or emoji
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {!isCreateMode && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving || deleting}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-70"
              >
                {deleting ? (
                  <>
                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash text-[10px]" />
                    Delete
                  </>
                )}
              </button>
            )}
            {isCreateMode && <div />}
            <div className="flex gap-2 ml-auto">
              {!isCreateMode && (
                <button
                  type="button"
                  onClick={handleSyncToChinese}
                  disabled={saving || deleting || syncing}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {syncing ? (
                    <>
                      <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-700"></span>
                      Translating...
                    </>
                  ) : (
                    <>
                      <span>🌏</span>
                      Sync to Chinese
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={saving || deleting || syncing}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || deleting || syncing}
                className="inline-flex items-center rounded-full bg-[#6D28D9] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#5B21B6] disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5"></span>
                    Saving...
                  </>
                ) : (
                  isCreateMode ? "Create" : "Save"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

