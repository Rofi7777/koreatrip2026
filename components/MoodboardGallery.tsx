"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

interface Highlight {
  id: string;
  title: string;
  description?: string | null;
  image_url: string;
  category?: string | null;
  sort_order?: number | null;
}

export function MoodboardGallery() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "Vibe",
    sort_order: 0,
  });

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/highlights");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message ?? "Failed to load highlights.");
      }

      setHighlights(json.data ?? []);
      setError(null);
    } catch (err) {
      console.error("Error fetching highlights:", err);
      setError("Failed to load highlights.");
      setHighlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHighlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      setError("Title and Image URL are required.");
      return;
    }

    setAdding(true);
    setError(null);

    try {
      const res = await fetch("/api/highlights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message ?? "Failed to add highlight.");
      }

      // Reset form and refresh
      setFormData({
        title: "",
        description: "",
        image_url: "",
        category: "Vibe",
        sort_order: highlights.length + 1,
      });
      setShowAddForm(false);
      await fetchHighlights();
    } catch (err) {
      console.error("Error adding highlight:", err);
      setError(err instanceof Error ? err.message : "Failed to add highlight.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl md:text-4xl">🖼️</span>
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 tracking-tight">
              Moodboard
            </h2>
            <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full mt-1"></div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#6D28D9] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#5B21B6] transition-colors"
        >
          <Plus className="h-3 w-3" />
          Thêm ảnh
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          <form onSubmit={handleAddHighlight} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tiêu đề *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                placeholder="Seoul về đêm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                placeholder="Mô tả ngắn về highlight này..."
                rows={2}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                URL ảnh *
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                >
                  <option value="Vibe">Vibe</option>
                  <option value="Activity">Activity</option>
                  <option value="Food">Food</option>
                  <option value="Location">Location</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Thứ tự
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                  min="0"
                />
              </div>
            </div>
            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={adding}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#6D28D9] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#5B21B6] disabled:opacity-70"
              >
                {adding ? "Đang thêm..." : "Thêm Highlight"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setError(null);
                }}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && !showAddForm && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Gallery Grid */}
      {highlights.length === 0 ? (
        <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">
            Chưa có highlight nào. Nhấn "Thêm ảnh" để bắt đầu!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((highlight) => (
            <div
              key={highlight.id}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${highlight.image_url})` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  {highlight.category && (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-white/20 backdrop-blur-sm rounded-full mb-2">
                      {highlight.category}
                    </span>
                  )}
                  <h3 className="text-base font-semibold mb-1 line-clamp-1">
                    {highlight.title}
                  </h3>
                  {highlight.description && (
                    <p className="text-xs text-white/90 line-clamp-2">
                      {highlight.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

