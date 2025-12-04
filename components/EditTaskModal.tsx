"use client";

import { useState } from "react";
import type { Task } from "@/types";

interface EditTaskModalProps {
  task: Task | null; // null for create mode
  onClose: () => void;
  onSave: (
    updates: {
      id?: Task["id"];
      language: "vi" | "zh-TW";
      title: string;
      description: string;
      autoTranslate: boolean;
    } & Partial<Task>
  ) => Promise<void>;
  onDelete?: (id: Task["id"]) => Promise<void>;
}

const TEAM_MEMBERS = ["Zoe", "Rofi", "Trieu", "Diem", "Juli", "Tham", "My", "Binh"];
const ICON_OPTIONS = [
  { value: "🚐", label: "🚐 Transport" },
  { value: "🎿", label: "🎿 Ski" },
  { value: "🍖", label: "🍖 Food" },
  { value: "💰", label: "💰 Budget" },
  { value: "📸", label: "📸 Media" },
  { value: "🏥", label: "🏥 Health" },
  { value: "📱", label: "📱 Communication" },
  { value: "🛍️", label: "🛍️ Shopping" },
  { value: "🎤", label: "🎤 MC" },
  { value: "👥", label: "👥 Team" },
  { value: "❤️", label: "❤️ Fun" },
];

export function EditTaskModal({
  task,
  onClose,
  onSave,
  onDelete,
}: EditTaskModalProps) {
  const isCreateMode = task === null;

  const initialTitle = isCreateMode
    ? ""
    : task.title_vi || task.title || "";

  const initialDescription = isCreateMode
    ? ""
    : task.description_vi || task.description || "";

  const [title, setTitle] = useState(initialTitle ?? "");
  const [description, setDescription] = useState(initialDescription);
  const [assignee, setAssignee] = useState(isCreateMode ? "" : (task.assignee ?? ""));
  const [icon, setIcon] = useState(isCreateMode ? "🚐" : (task.icon ?? "🚐"));
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
        ...(isCreateMode ? {} : { id: (task as Task).id }),
        title,
        description,
        language: "vi",
        autoTranslate: false,
        assignee: assignee || null,
        icon: icon || null,
      });
    } catch (err) {
      console.error("[EditTaskModal] Save error:", err);
      setError("Failed to save changes. Please try again.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isCreateMode || !onDelete) return;
    
    const confirmed = window.confirm("Are you sure you want to delete this task? This action cannot be undone.");
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    
    try {
      await onDelete((task as Task).id);
    } catch (err) {
      console.error("[EditTaskModal] Delete error:", err);
      setError("Failed to delete task. Please try again.");
      setDeleting(false);
    }
  };

  const handleSyncToChinese = async () => {
    if (isCreateMode || !task) return;

    setSyncing(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/sync-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "tasks",
          id: (task as Task).id,
          sourceData: {
            // Use Vietnamese fields as source, fallback to title/description if not available
            title: (task as Task).title_vi || title || (task as Task).title || "",
            description: (task as Task).description_vi || description || (task as Task).description || "",
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to sync translation");
      }

      setError(null);
      setSyncSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("[EditTaskModal] Sync error:", err);
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
            {isCreateMode ? "Add New Task" : "Edit Task"}
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
                Icon (Emoji)
              </label>
              <div className="flex gap-1">
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-xs bg-white focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="🚐"
                  maxLength={2}
                  className="w-12 rounded-lg border border-gray-300 px-2 py-1.5 text-xs bg-white focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20 outline-none text-center"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
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

