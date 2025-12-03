"use client";

import { useMemo, useState } from "react";
import type { ItineraryItem } from "@/types";
import { ItineraryCard } from "./ItineraryCard";

interface ItineraryListProps {
  items: ItineraryItem[];
  onEdit?: (item: ItineraryItem) => void;
}

const MAX_DAYS = 5;

export function ItineraryList({ items, onEdit }: ItineraryListProps) {
  const days = useMemo(() => {
    const uniqueDays = Array.from(
      new Set(items.map((i) => i.day_number).filter((d) => typeof d === "number"))
    ).sort((a, b) => a - b);
    return uniqueDays.slice(0, MAX_DAYS);
  }, [items]);

  const [activeTab, setActiveTab] = useState<"all" | number>(
    days[0] ?? "all"
  );

  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter((item) => item.day_number === activeTab);

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
          Itinerary
        </h2>
        <p className="text-xs text-gray-400">
          {items.length} item{items.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            activeTab === "all"
              ? "bg-[#6D28D9] text-white border-[#6D28D9] shadow-sm"
              : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
          }`}
        >
          All
        </button>

        {days.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setActiveTab(day)}
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === day
                ? "bg-[#6D28D9] text-white border-[#6D28D9] shadow-sm"
                : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-sm text-gray-500">
          No itinerary items for this day yet.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <ItineraryCard key={item.id} item={item} onEdit={onEdit} />
          ))}
        </div>
      )}
    </section>
  );
}


