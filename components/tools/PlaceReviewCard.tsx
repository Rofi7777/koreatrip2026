"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Review {
  author_name: string;
  text: string;
  rating: number;
  relative_time_description: string;
}

interface PlaceData {
  name?: string;
  rating: number;
  total_ratings: number;
  reviews: Review[];
}

interface PlaceReviewCardProps {
  placeId: string;
  locationName: string;
}

export function PlaceReviewCard({
  placeId,
  locationName,
}: PlaceReviewCardProps) {
  const { t, language } = useLanguage();
  const [data, setData] = useState<PlaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/places?placeId=${encodeURIComponent(placeId)}&lang=${encodeURIComponent(language)}`
        );
        
        if (!response.ok) {
          let errorMessage = `Failed to fetch place data (HTTP ${response.status})`;
          try {
            const contentType = response.headers.get("content-type");
            const text = await response.text();
            
            if (contentType && contentType.includes("application/json") && text && text.trim()) {
              try {
                const json = JSON.parse(text);
                // Only use json.message if it exists and is not empty
                if (json && typeof json === 'object' && json.message && typeof json.message === 'string' && json.message.trim()) {
                  errorMessage = json.message;
                  console.error(`[PlaceReviewCard] API error (${response.status}):`, json.message);
                } else if (json && typeof json === 'object' && Object.keys(json).length > 0) {
                  // Has other properties but no message
                  const jsonStr = JSON.stringify(json);
                  errorMessage = `API error: ${jsonStr}`;
                  console.error(`[PlaceReviewCard] API error (${response.status}):`, jsonStr);
                } else {
                  // Empty object or invalid structure
                  console.error(`[PlaceReviewCard] API error (${response.status}): Empty or invalid JSON response`);
                }
              } catch (parseErr) {
                // Invalid JSON
                console.error(`[PlaceReviewCard] API error (${response.status}): Invalid JSON -`, text.substring(0, 100));
              }
            } else if (text && text.trim()) {
              // Non-JSON response
              errorMessage = `API error: ${text.substring(0, 200)}`;
              console.error(`[PlaceReviewCard] API error (${response.status}):`, text.substring(0, 200));
            } else {
              // Empty response
              console.error(`[PlaceReviewCard] API error (${response.status}): Empty response body`);
            }
          } catch (readErr) {
            console.error(`[PlaceReviewCard] API error (${response.status}): Failed to read response -`, readErr);
          }
          throw new Error(errorMessage);
        }
        
        const placeData = await response.json();
        setData(placeData);
      } catch (err) {
        console.error("[PlaceReviewCard] Error fetching place data:", err);
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceData();
  }, [placeId, language]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">
            ⭐
          </span>
        ))}
        {hasHalfStar && (
          <span className="text-yellow-400" style={{ fontSize: "0.8em" }}>
            ⭐
          </span>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {data?.name || locationName}
          </h3>
          {loading ? (
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : data && data.rating > 0 ? (
            <div className="flex items-center gap-2">
              {renderStars(data.rating)}
              <span className="text-xs font-semibold text-gray-700">
                {data.rating.toFixed(1)}
              </span>
              {data.total_ratings > 0 && (
                <span className="text-xs text-gray-500">
                  ({data.total_ratings.toLocaleString()})
                </span>
              )}
            </div>
          ) : null}
        </div>
        <i className="fas fa-map-marker-alt text-[#6D28D9] text-sm"></i>
      </div>

      {loading && (
        <div className="space-y-3 py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-xs text-red-500 py-2">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {data.reviews.length > 0 ? (
            data.reviews.map((review, index) => (
              <div
                key={index}
                className="pb-3 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900">
                      {review.author_name}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-[10px]">
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {review.relative_time_description}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-500 py-2 text-center">
              {t("reviews_no_reviews")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

