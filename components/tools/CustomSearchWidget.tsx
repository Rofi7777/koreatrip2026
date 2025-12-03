"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { PlaceReviewCard } from "./PlaceReviewCard";

interface SearchResult {
  name: string;
  place_id: string;
  formatted_address: string;
  rating: number;
  total_ratings: number;
}

export function CustomSearchWidget() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError(
        language === "vi"
          ? "Vui lòng nhập tên địa điểm"
          : language === "zh-TW"
          ? "請輸入地點名稱"
          : "Please enter a place name"
      );
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    setSelectedPlace(null);

    try {
      const res = await fetch(
        `/api/places/search?query=${encodeURIComponent(searchQuery)}&lang=${encodeURIComponent(language)}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Search failed");
      }

      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchError(
          language === "vi"
            ? "Không tìm thấy địa điểm nào"
            : language === "zh-TW"
            ? "找不到地點"
            : "No places found"
        );
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchError(
        err instanceof Error
          ? err.message
          : language === "vi"
          ? "Đã xảy ra lỗi khi tìm kiếm"
          : language === "zh-TW"
          ? "搜尋時發生錯誤"
          : "An error occurred while searching"
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = (place: SearchResult) => {
    setSelectedPlace(place);
  };

  const handleBackToSearch = () => {
    setSelectedPlace(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden text-white p-4 md:p-6">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
        <i className="fas fa-search text-[120px] -mr-8 -mb-8"></i>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
          <span className="text-lg">🔍</span>
          <span>
            {language === "vi"
              ? "Tìm kiếm Địa điểm"
              : language === "zh-TW"
              ? "搜尋地點"
              : "Search Places"}
          </span>
        </div>

        {!selectedPlace ? (
          <>
            {/* Search Input */}
            <div className="space-y-3 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    language === "vi"
                      ? "Nhập tên địa điểm (VD: Olive Young)..."
                      : language === "zh-TW"
                      ? "輸入地點名稱（例如：Olive Young）..."
                      : "Enter place name (e.g., Olive Young)..."
                  }
                  className="flex-1 px-3 py-2 text-sm border border-white/30 bg-white/20 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
                  disabled={isSearching}
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-white/90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      <span className="text-xs">
                        {language === "vi"
                          ? "Đang tìm..."
                          : language === "zh-TW"
                          ? "搜尋中..."
                          : "Searching..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search"></i>
                      <span className="text-xs">
                        {language === "vi"
                          ? "Tìm"
                          : language === "zh-TW"
                          ? "搜尋"
                          : "Search"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {searchError && (
                <div className="p-2 bg-red-500/30 border border-red-300/50 rounded-lg backdrop-blur-md">
                  <p className="text-xs text-white">{searchError}</p>
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-white/90 uppercase tracking-wide">
                    {language === "vi"
                      ? "Kết quả tìm kiếm"
                      : language === "zh-TW"
                      ? "搜尋結果"
                      : "Search Results"}
                  </p>
                  <div className="space-y-2">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectPlace(result)}
                        className="w-full text-left p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg hover:bg-white/30 hover:border-white/50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white mb-1 truncate">
                              {result.name}
                            </h4>
                            <p className="text-xs text-white/80 line-clamp-1">
                              {result.formatted_address}
                            </p>
                          </div>
                          {result.rating > 0 && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="text-yellow-400 text-xs">⭐</span>
                              <span className="text-xs font-semibold text-white">
                                {result.rating.toFixed(1)}
                              </span>
                              {result.total_ratings > 0 && (
                                <span className="text-xs text-white/70">
                                  ({result.total_ratings})
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Selected Place View */}
            <div className="mb-3">
              <button
                type="button"
                onClick={handleBackToSearch}
                className="inline-flex items-center gap-2 text-xs text-white/90 hover:text-white mb-3"
              >
                <i className="fas fa-arrow-left"></i>
                <span>
                  {language === "vi"
                    ? "Quay lại tìm kiếm"
                    : language === "zh-TW"
                    ? "返回搜尋"
                    : "Back to search"}
                </span>
              </button>
            </div>
            <PlaceReviewCard
              placeId={selectedPlace.place_id}
              locationName={selectedPlace.name}
            />
          </>
        )}
      </div>
    </div>
  );
}

