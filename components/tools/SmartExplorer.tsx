"use client";

import { useState } from "react";
import { CATEGORIES, CITIES, type Recommendation } from "./ExplorerData";
import { useLanguage } from "@/context/LanguageContext";

export function SmartExplorer() {
  const { language } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const selectedCategoryData = CATEGORIES.find((c) => c.value === selectedCategory);
  const subCategories = selectedCategoryData?.subCategories || [];

  const handleSearch = async () => {
    if (!selectedCity || !selectedCategory || !selectedSubCategory) {
      setError("Vui lòng chọn đầy đủ thành phố, danh mục và danh mục con.");
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const res = await fetch("/api/explorer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: selectedCity,
          category: selectedCategory,
          subCategory: selectedSubCategory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? "Không thể tải đề xuất.");
      }

      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("Explorer error:", err);
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setSelectedSubCategory(""); // Reset subcategory when category changes
  };

  const openGoogleMaps = (name: string, city: string) => {
    const query = encodeURIComponent(`${name} ${city}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
        <span className="text-lg">🔍</span>
        <span>Khám phá Hàn Quốc</span>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* City Select */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Thành phố
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent bg-white"
            >
              <option value="">Chọn thành phố</option>
              {CITIES.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.labelVi}
                </option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent bg-white"
            >
              <option value="">Chọn danh mục</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.labelVi} ({cat.label})
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Category Select */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Danh mục con
            </label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              disabled={!selectedCategory || subCategories.length === 0}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <option value="">
                {selectedCategory ? "Chọn danh mục con" : "Chọn danh mục trước"}
              </option>
              {subCategories.map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.labelVi} ({sub.label})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || !selectedCity || !selectedCategory || !selectedSubCategory}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#6D28D9] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5B21B6] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Đang tìm kiếm...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Hỏi AI Gemini</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="space-y-3 mt-4">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Top 5 Đề xuất
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="rounded-xl bg-gray-50 border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {rec.name}
                    </h4>
                    {rec.korean_name && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-purple-100 text-[#6D28D9] rounded-full mb-1">
                        {rec.korean_name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 flex-shrink-0">
                    <span>⭐</span>
                    <span>{rec.estimated_rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {rec.reason}
                </p>
                <button
                  type="button"
                  onClick={() => openGoogleMaps(rec.name, selectedCity)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-[#6D28D9] hover:text-[#6D28D9] transition-colors"
                >
                  <span>🗺️</span>
                  <span>Xem trên Google Maps</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

