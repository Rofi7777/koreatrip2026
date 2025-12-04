"use client";

import {
  Bed,
  Bus,
  MapPin,
  Plane,
  Utensils,
  CalendarClock,
} from "lucide-react";
import type { ItineraryItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

function getCategoryIcon(category?: ItineraryItem["category"]) {
  switch (category) {
    case "flight":
      return Plane;
    case "transport":
      return Bus;
    case "food":
      return Utensils;
    case "hotel":
      return Bed;
    case "activity":
      return MapPin;
    default:
      return CalendarClock;
  }
}

interface ItineraryCardProps {
  item: ItineraryItem;
  onEdit?: (item: ItineraryItem) => void;
}

export function ItineraryCard({ item, onEdit }: ItineraryCardProps) {
  const { language } = useLanguage();
  const Icon = getCategoryIcon(item.category ?? undefined);

  // Debug: Log item data to check if title_zh is present
  console.log('Itinerary Item:', item.id, 'Lang:', language, 'TitleZH:', item.title_zh, 'Title:', item.title);

  const timeLabel =
    item.start_time && item.end_time
      ? `${item.start_time}–${item.end_time}`
      : item.start_time || "";

  // Enforce Display Logic (The Fix)
  const isChinese = language === 'zh-TW';
  const hasChineseTitle = Boolean(item.title_zh && item.title_zh.trim() !== '');
  const hasChineseDesc = Boolean(item.description_zh && item.description_zh.trim() !== '');

  let displayTitle = item.title || ''; // Default to Vietnamese
  if (isChinese && hasChineseTitle) {
    displayTitle = item.title_zh!;
  } else if (isChinese && !hasChineseTitle) {
    // Show indicator if Chinese is selected but translation is missing
    displayTitle = `(待翻譯) ${item.title_vi || item.title || ''}`;
  } else if (language === 'vi') {
    // Vietnamese: prefer title_vi, fallback to title
    displayTitle = item.title_vi || item.title || '';
  }

  let displayDesc = item.description || '';
  if (isChinese && hasChineseDesc) {
    displayDesc = item.description_zh!;
  } else if (isChinese && !hasChineseDesc) {
    // Show Vietnamese description if Chinese is missing
    displayDesc = item.description_vi || item.description || '';
  } else if (language === 'vi') {
    // Vietnamese: prefer description_vi, fallback to description
    displayDesc = item.description_vi || item.description || '';
  }

  const needsTranslation = isChinese && !hasChineseTitle;

  return (
    <article className="flex gap-4 rounded-2xl bg-white/90 backdrop-blur-sm shadow-md border border-gray-100 px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex flex-col items-center justify-center min-w-[72px]">
        <p className="text-sm uppercase tracking-wide text-gray-400 mb-1">
          Time
        </p>
        <p className="text-base sm:text-lg font-semibold text-gray-900">
          {timeLabel}
        </p>
      </div>

      <div className="w-px bg-gray-100 flex-shrink-0" />

      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F3E8FF] text-[#6D28D9] flex-shrink-0">
              <Icon className="h-4 w-4" />
            </span>
            <h3 className={`text-base sm:text-lg font-semibold break-words ${
              needsTranslation ? "text-orange-600 italic" : "text-gray-900"
            }`}>
              {displayTitle}
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {item.owner && (
              <span className="inline-flex items-center rounded-full bg-[#F3E8FF] px-2 py-0.5 text-[11px] font-medium text-[#6D28D9] whitespace-nowrap">
                {item.owner}
              </span>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-[#6D28D9] hover:border-[#6D28D9] text-[11px] flex-shrink-0"
              >
                <i className="fas fa-pen" />
              </button>
            )}
          </div>
        </div>

        {displayDesc && (
          <p className="text-xs sm:text-sm text-gray-600 break-words whitespace-normal">
            {displayDesc}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {item.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500">
              <MapPin className="h-3 w-3" />
              {item.location}
            </span>
          )}

          {item.category && (
            <span className="inline-flex items-center rounded-full bg-[#6D28D9]/5 px-2 py-0.5 text-[11px] font-medium text-[#6D28D9]">
              {String(item.category).toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}


