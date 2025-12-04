"use client";

import { useState } from "react";
import type { ItineraryItem } from "@/types";

interface EditItineraryModalProps {
  item: ItineraryItem | null; // null for create mode
  onClose: () => void;
  onSave: (
    updates: {
      id?: ItineraryItem["id"];
      language: "vi" | "zh-TW";
      title: string;
      description: string;
      autoTranslate: boolean;
    } & Partial<ItineraryItem>
  ) => Promise<void>;
  onDelete?: (id: ItineraryItem["id"]) => Promise<void>;
}

const TEAM_MEMBERS = ["Zoe", "Rofi", "Trieu", "Diem", "Juli", "Tham", "My", "Binh"];

export function EditItineraryModal({
  item,
  onClose,
  onSave,
  onDelete,
}: EditItineraryModalProps) {
  const isCreateMode = item === null;

  // Get initial values - always use Vietnamese or main fields
  const initialTitle = isCreateMode
    ? ""
    : item.title_vi || item.title || "";

  const initialDescription = isCreateMode
    ? ""
    : item.description_vi || item.description || "";

  // Get default date
  const getDefaultDate = () => {
    if (isCreateMode) {
      return "2026-01-07";
    }
    if ((item as any).date) {
      return (item as any).date;
    }
    const baseDate = new Date("2026-01-07");
    const dayOffset = (item as ItineraryItem).day_number - 1;
    baseDate.setDate(baseDate.getDate() + dayOffset);
    return baseDate.toISOString().split("T")[0];
  };

  const [dayNumber, setDayNumber] = useState(isCreateMode ? 1 : (item as ItineraryItem).day_number);
  const [date, setDate] = useState(getDefaultDate());
  const [startTime, setStartTime] = useState(isCreateMode ? "" : (item as ItineraryItem).start_time ?? "");
  const [endTime, setEndTime] = useState(isCreateMode ? "" : ((item as ItineraryItem).end_time ?? ""));
  const [title, setTitle] = useState(initialTitle ?? "");
  const [description, setDescription] = useState(initialDescription);
  const [location, setLocation] = useState(isCreateMode ? "" : ((item as ItineraryItem).location ?? ""));
  const [category, setCategory] = useState(
    isCreateMode ? "" : ((item as ItineraryItem).category as string | null) ?? ""
  );
  const [owner, setOwner] = useState(
    isCreateMode ? "" : ((item as ItineraryItem).owner ?? "")
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    
    try {
      await onSave({
        ...(isCreateMode ? {} : { id: (item as ItineraryItem).id }),
        title,
        description,
        language: "vi",
        autoTranslate: false,
        day_number: dayNumber,
        date,
        start_time: startTime,
        end_time: endTime || null,
        location: location || null,
        category: category || null,
        owner: owner || null,
      });
    } catch (err) {
      console.error("[EditModal] Save error:", err);
      setError("Failed to save changes. Please try again.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isCreateMode || !onDelete) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete this itinerary item? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    
    try {
      await onDelete((item as ItineraryItem).id);
    } catch (err) {
      console.error("[EditModal] Delete error:", err);
      setError("Failed to delete item. Please try again.");
      setDeleting(false);
    }
  };

  const handleSyncToChinese = async () => {
    if (isCreateMode || !item) return;

    setSyncing(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/sync-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "itinerary",
          id: (item as ItineraryItem).id,
          sourceData: {
            // Use Vietnamese fields as source, fallback to title/description if not available
            title: (item as ItineraryItem).title_vi || title || (item as ItineraryItem).title || "",
            description: (item as ItineraryItem).description_vi || description || (item as ItineraryItem).description || "",
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to sync translation");
      }

      // Show success message
      setError(null);
      setSyncSuccess(true);
      // Show "Done!" feedback briefly before reloading
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("[EditModal] Sync error:", err);
      setError(err instanceof Error ? err.message : "Failed to sync translation. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-sm font-semibold text-gray-900">
            {isCreateMode ? "Add New Itinerary Item" : "Edit Itinerary Item"}
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Day Number
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={dayNumber}
                onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="text"
                placeholder="HH:MM (e.g., 09:00)"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                End Time (Optional)
              </label>
              <input
                type="text"
                placeholder="HH:MM (e.g., 09:30)"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none"
              />
            </div>
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
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs bg-white focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none"
              >
                <option value="">Unspecified</option>
                <option value="flight">Flight</option>
                <option value="transport">Transport</option>
                <option value="food">Food</option>
                <option value="hotel">Hotel</option>
                <option value="activity">Activity</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Owner
              </label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs bg-white focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none"
              >
                <option value="">Unassigned</option>
                {TEAM_MEMBERS.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>
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
                className="inline-flex items-center gap-1.5 rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash text-[10px]" />
                    Delete Item
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
                  disabled={saving || deleting || syncing || syncSuccess}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                {syncSuccess ? (
                  <>
                    <span>✓</span>
                    Done!
                  </>
                ) : syncing ? (
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
                className="inline-flex items-center rounded-full bg-[#6D28D9] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#5B21B6] disabled:opacity-70 disabled:cursor-not-allowed"
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
