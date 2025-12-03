 "use client";

import { useEffect, useMemo, useState } from "react";
import type { ItineraryItem } from "@/types";
import { AIChatWidget } from "@/components/AIChatWidget";
import { EditItineraryModal } from "@/components/EditItineraryModal";
import { useLanguage } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { WeatherWidget } from "@/components/tools/WeatherWidget";
import { PlaceReviewCard } from "@/components/tools/PlaceReviewCard";
import { GoogleMapWidget } from "@/components/tools/GoogleMapWidget";
import { TranslatorWidget } from "@/components/tools/TranslatorWidget";
import { LuckyWheel } from "@/components/tools/LuckyWheel";
import { DiceGame3D } from "@/components/tools/DiceGame3D";
import { SmartExplorer } from "@/components/tools/SmartExplorer";
import { CustomSearchWidget } from "@/components/tools/CustomSearchWidget";
import { TaxiCardModal } from "@/components/tools/TaxiCardModal";
import { TaskList } from "@/components/TaskList";
import { InfoList } from "@/components/InfoList";
import { MoodboardGallery } from "@/components/MoodboardGallery";
import { HeroWeather } from "@/components/HeroWeather";
import { HeroCurrency } from "@/components/HeroCurrency";
import { HeroTranslateBtn } from "@/components/HeroTranslateBtn";
import { HeroSnowfall } from "@/components/HeroSnowfall";

const TARGET_DATE = new Date("2026-01-07T00:00:00+09:00").getTime();

function formatTime(value?: string | null) {
  if (!value) return "";
  // Assume HH:mm or HH:mm:ss and only display HH:mm
  return value.slice(0, 5);
}

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const res = await fetch("/api/itinerary", {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        const json = await res.json();

        if (!res.ok) {
          console.warn("[Dashboard] API error:", json.message);
          setError(json.message ?? "Failed to load itinerary.");
          // Still set empty array to allow page to render
          setItems([]);
          setLoading(false);
          return;
        }

        setItems(json.data ?? []);
        setLoading(false);
      } catch (err) {
        console.error("[Dashboard] Fetch error:", err);
        if (err instanceof Error && err.name === "AbortError") {
          setError("Request timeout. Please check your connection.");
        } else {
          setError("Unexpected error loading itinerary.");
        }
        // Set empty array to allow page to render
        setItems([]);
        setLoading(false);
      }
    };

    fetchItinerary();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = TARGET_DATE - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setCountdown({ days, hours, minutes });
    }, 60000);

    // run once immediately
    const now = Date.now();
    const diff = TARGET_DATE - now;
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setCountdown({ days, hours, minutes });
    }

    return () => clearInterval(interval);
  }, []);

  const days = useMemo(() => {
    const uniqueDays = Array.from(
      new Set(items.map((i) => i.day_number).filter((d) => typeof d === "number"))
    ).sort((a, b) => a - b);
    return uniqueDays.length ? uniqueDays : [1, 2, 3, 4, 5];
  }, [items]);

  const filteredItems = useMemo(
    () => items.filter((item) => item.day_number === activeDay),
    [items, activeDay]
  );

  const getLocalizedContent = (item: ItineraryItem) => {
    // Simplified: Always use Vietnamese or main fields
    return {
      title: item.title_vi || item.title || "",
      desc: item.description_vi || item.description || "",
    };
  };

  const handleEditClick = (item: ItineraryItem) => {
    setEditingItem(item);
    setIsCreating(false);
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setIsCreating(true);
  };

  const handleSaveEdit = async (
    updates: {
      id?: ItineraryItem["id"];
      language: "vi" | "zh-TW" | "en";
      title: string;
      description: string;
      autoTranslate: boolean;
    } & Partial<ItineraryItem>
  ) => {
    const isCreate = !updates.id;
    console.log("[Frontend] Saving with updates:", {
      mode: isCreate ? "CREATE" : "UPDATE",
      id: updates.id || "NEW",
      language: updates.language,
      title: updates.title?.substring(0, 50),
      description: updates.description?.substring(0, 50),
      autoTranslate: updates.autoTranslate,
      date: updates.date,
      owner: updates.owner,
    });
    
    setSavingEdit(true);
    try {
      const res = await fetch("/api/itinerary", {
        method: isCreate ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      
      console.log("[Frontend] API response:", {
        ok: res.ok,
        data: json.data ? {
          id: json.data.id,
          title: json.data.title,
          title_vi: json.data.title_vi?.substring(0, 30),
          title_en: json.data.title_en?.substring(0, 30),
          title_zh: json.data.title_zh?.substring(0, 30),
        } : null,
      });

      if (!res.ok) {
        throw new Error(json.message ?? `Failed to ${isCreate ? "create" : "update"} itinerary item.`);
      }

      // Refresh the entire list from server to get all translations
      const refreshRes = await fetch("/api/itinerary");
      const refreshJson = await refreshRes.json();
      
      if (refreshRes.ok && refreshJson.data) {
        setItems(refreshJson.data);
        console.log("[Frontend] ✅ List refreshed with all translations");
      } else {
        // Fallback: update local state
        if (isCreate) {
          const newItem = json.data as ItineraryItem;
          setItems((prev) => [...prev, newItem].sort((a, b) => {
            if (a.day_number !== b.day_number) {
              return a.day_number - b.day_number;
            }
            return (a.start_time || "").localeCompare(b.start_time || "");
          }));
        } else {
          const updated = json.data as ItineraryItem;
          setItems((prev) =>
            prev.map((it) => (it.id === updated.id ? { ...it, ...updated } : it))
          );
        }
      }
      
      setEditingItem(null);
      setIsCreating(false);
      setSavingEdit(false);
    } catch (err) {
      console.error(err);
      setSavingEdit(false);
      throw err;
    }
  };

  const handleDeleteItem = async (id: ItineraryItem["id"]) => {
    console.log("[Frontend] Deleting item:", id);
    
    try {
      const res = await fetch(`/api/itinerary?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message ?? "Failed to delete itinerary item.");
      }

      // Refresh the entire list from server
      const refreshRes = await fetch("/api/itinerary");
      const refreshJson = await refreshRes.json();
      
      if (refreshRes.ok && refreshJson.data) {
        setItems(refreshJson.data);
        console.log("[Frontend] ✅ List refreshed after delete");
      } else {
        // Fallback: update local state
        setItems((prev) => prev.filter((it) => it.id !== id));
      }
      
      setEditingItem(null);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <>
      <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 md:px-8">
        <Navbar />

        <main className="space-y-10 pb-16">
        {/* Hero */}
        <section
          id="hero"
          className="relative bg-hero-gradient text-white rounded-3xl px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 shadow-md overflow-hidden"
        >
          {/* Snowfall Effect */}
          <HeroSnowfall />
          
          {/* Mobile: Stack vertically, Desktop: Side-by-side */}
          <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-6">
            {/* Left: Title & Date */}
            <div className="text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">
                {t("hero_badge")}
              </p>
              <h1 className="mt-2 text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
                🇰🇷 {t("hero_title")}
              </h1>
              <p className="mt-2 text-lg md:text-xl font-medium text-purple-100">
                {t("hero_subtitle")}
              </p>
            </div>

            {/* Center: Weather, Currency & Quick Translate */}
            <div className="flex flex-col items-center gap-3 w-full md:w-auto">
              <HeroWeather />
              <HeroCurrency />
              <HeroTranslateBtn />
            </div>

            {/* Right: Countdown Timer */}
            <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
              <p className="text-xs uppercase tracking-wide text-indigo-100">
                {t("countdown_title")}
              </p>
              <div className="flex items-center gap-2 sm:gap-3 text-center">
                <div className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10">
                  <p className="text-base sm:text-lg font-semibold">
                    {countdown.days.toString().padStart(2, "0")}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-indigo-200">
                    {t("countdown_days")}
                  </p>
                </div>
                <div className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10">
                  <p className="text-base sm:text-lg font-semibold">
                    {countdown.hours.toString().padStart(2, "0")}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-indigo-200">
                    {t("countdown_hours")}
                  </p>
                </div>
                <div className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10">
                  <p className="text-base sm:text-lg font-semibold">
                    {countdown.minutes.toString().padStart(2, "0")}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-indigo-200">
                    {t("countdown_minutes")}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-indigo-100 text-center md:text-right">
                {t("countdown_simulated_date")}
              </p>
            </div>
          </div>
        </section>

        {/* Schedule / Vertical Timeline */}
        <section id="schedule" className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl md:text-4xl">📅</span>
              <div className="flex flex-col">
                <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 tracking-tight">
                  {t("schedule_title")}
                </h2>
                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full mt-1"></div>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              {items.length} {t("schedule_items_label")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {days.map((day) => {
              // Calculate date for this day (trip starts 2026-01-07)
              const baseDate = new Date("2026-01-07");
              const dayOffset = day - 1;
              baseDate.setDate(baseDate.getDate() + dayOffset);
              
              // Try to get actual date from items for this day
              const dayItems = items.filter((item) => item.day_number === day);
              let displayDate = baseDate;
              if (dayItems.length > 0 && dayItems[0].date) {
                const itemDate = new Date(dayItems[0].date);
                if (!isNaN(itemDate.getTime())) {
                  displayDate = itemDate;
                }
              }
              
              // Format date as "Jan 7"
              const monthNames = language === "vi" 
                ? ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"]
                : language === "zh-TW"
                ? ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
                : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              
              const dateStr = `${monthNames[displayDate.getMonth()]} ${displayDate.getDate()}`;
              
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeDay === day
                      ? "bg-[#6D28D9] text-white border-[#6D28D9] shadow-sm"
                      : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-1">
                    <i className="fas fa-calendar-day" />
                  </span>
                  {t("schedule_day_prefix")} {day} ({dateStr})
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl bg-white/90 backdrop-blur-sm shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                {loading && (
                  <p className="text-sm text-gray-500">
                    {t("schedule_loading")}
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-600" role="alert">
                    {t("schedule_error")}
                  </p>
                )}
                {!loading && !error && filteredItems.length === 0 && (
                  <p className="text-sm text-gray-500">
                    {t("schedule_empty_day")}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddNewClick}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#6D28D9] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#5B21B6] transition-colors"
              >
                <i className="fas fa-plus text-[10px]" />
                Add New Item
              </button>
            </div>

            {!loading && !error && filteredItems.length > 0 && (
              <div className="mt-1 space-y-4 sm:space-y-5">
                {filteredItems.map((item) => {
                  const { title, desc } = getLocalizedContent(item);
                  return (
                    <div
                      key={item.id}
                      className="relative flex gap-3 sm:gap-4 md:gap-6 items-start"
                    >
                      {/* 1. Time column */}
                      <div className="w-16 sm:w-20 flex-shrink-0 text-right font-semibold text-[#6D28D9] pt-2 text-xs sm:text-sm md:text-base">
                        {formatTime(item.start_time)}
                      </div>

                      {/* 2. Line + Dot */}
                      <div className="relative flex flex-col items-center pt-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#6D28D9] border-2 border-white z-10 shadow" />
                        <div className="w-0.5 bg-purple-100 absolute top-3 sm:top-4 bottom-0" />
                      </div>

                      {/* 3. Content card */}
                      <div className="flex-grow pb-6 sm:pb-8">
                        <div className="rounded-xl bg-gray-50/90 backdrop-blur-sm border border-gray-100 p-3 sm:p-4 md:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-[#6D28D9] shadow-sm flex-shrink-0">
                                <i className="fas fa-map-marker-alt text-xs sm:text-sm" />
                              </span>
                              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate sm:truncate-none">
                                {title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {item.owner && (
                                <span className="inline-flex items-center rounded-full bg-[#F3E8FF] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[#6D28D9]">
                                  {item.owner}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleEditClick(item)}
                                className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-[#6D28D9] hover:border-[#6D28D9] text-[10px] sm:text-[11px]"
                              >
                                <i className="fas fa-pen" />
                              </button>
                            </div>
                          </div>
                          {desc && (
                            <p className="mt-2 text-xs sm:text-sm text-gray-600">
                              {desc}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
                            {item.location && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2 py-0.5 text-gray-600">
                                <i className="fas fa-location-dot" />
                                <span className="truncate max-w-[120px] sm:max-w-none">{item.location}</span>
                              </span>
                            )}
                            {item.category && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#6D28D9]/5 px-2 py-0.5 text-[#6D28D9]">
                                <i className="fas fa-tag" />
                                {String(item.category).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Tasks */}
        <section id="tasks" className="space-y-3">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl md:text-4xl">🚀</span>
            <div className="flex flex-col">
              <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 tracking-tight">
                {t("tasks_title")}
              </h2>
              <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full mt-1"></div>
            </div>
          </div>
          <TaskList />
        </section>

        {/* Info */}
        <section id="info" className="space-y-3">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl md:text-4xl">ℹ️</span>
            <div className="flex flex-col">
              <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 tracking-tight">
                {t("info_title")}
              </h2>
              <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full mt-1"></div>
            </div>
          </div>
          <InfoList />
        </section>

        {/* Tools */}
        <section id="tools" className="space-y-3">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl md:text-4xl">🛠️</span>
            <div className="flex flex-col">
              <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 tracking-tight">
                {t("tools_title")}
              </h2>
              <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full mt-1"></div>
            </div>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Weather Widget - Blue/Cyan Gradient */}
            <div className="bg-gradient-to-br from-blue-400 to-cyan-300 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden text-white">
              <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                <i className="fas fa-cloud-sun text-[120px] -mr-8 -mb-8"></i>
              </div>
              <div className="relative z-10">
                <WeatherWidget />
              </div>
            </div>

            {/* Translator Widget - Indigo/Purple Gradient */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden text-white">
              <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                <i className="fas fa-language text-[120px] -mr-8 -mb-8"></i>
              </div>
              <div className="relative z-10">
                <TranslatorWidget />
              </div>
            </div>

            {/* Lucky Wheel - Pink/Rose Gradient */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden text-white">
              <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                <i className="fas fa-dice text-[120px] -mr-8 -mb-8"></i>
              </div>
              <div className="relative z-10">
                <LuckyWheel />
              </div>
            </div>

            {/* Dice Game 3D - Orange/Red Gradient */}
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden text-white">
              <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                <i className="fas fa-dice text-[120px] -mr-8 -mb-8"></i>
              </div>
              <div className="relative z-10">
                <DiceGame3D />
              </div>
            </div>

            {/* Google Maps Widget - Emerald/Teal Gradient */}
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden text-white">
              <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                <i className="fas fa-map-marked-alt text-[120px] -mr-8 -mb-8"></i>
              </div>
              <div className="relative z-10">
                <GoogleMapWidget />
              </div>
            </div>

            {/* Taxi Card Modal - Yellow/Orange Gradient */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden text-white">
              <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                <i className="fas fa-taxi text-[120px] -mr-8 -mb-8"></i>
              </div>
              <div className="relative z-10">
                <TaxiCardModal />
              </div>
            </div>
          </div>
        </section>

        {/* AI Smart Explorer */}
        <section id="explorer" className="space-y-3">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl md:text-4xl">🔍</span>
            <div className="flex flex-col">
              <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 tracking-tight">
                Khám phá Hàn Quốc
              </h2>
              <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full mt-1"></div>
            </div>
          </div>
          <SmartExplorer />
        </section>

        {/* Live Reviews */}
        <section id="reviews" className="space-y-3">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl md:text-4xl">⭐</span>
            <div className="flex flex-col">
              <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 tracking-tight">
                {t("reviews_title")}
              </h2>
              <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full mt-1"></div>
            </div>
          </div>
          
          {/* Custom Search Widget */}
          <div className="mb-6">
            <CustomSearchWidget />
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <PlaceReviewCard
              placeId="ChIJP5lg3YuKYTURjTAS46G5TWc"
              locationName="InterContinental Alpensia"
            />
            <PlaceReviewCard
              placeId="ChIJJXcc9--ifDURb8zmFI_J64s"
              locationName="Myeongdong"
            />
            <PlaceReviewCard
              placeId="ChIJod7tSseifDUR9hXHLFNGMIs"
              locationName="Gyeongbokgung"
            />
            <PlaceReviewCard
              placeId="ChIJWfpeOoOaezUR1L5cy5agS40"
              locationName="Incheon Airport"
            />
          </div>
        </section>

        {/* Gallery / Moodboard */}
        <section id="gallery" className="space-y-3">
          <MoodboardGallery />
        </section>
      </main>
      </div>

      {(editingItem !== null || isCreating) && (
        <EditItineraryModal
          item={editingItem}
          onClose={() => {
            if (!savingEdit) {
              setEditingItem(null);
              setIsCreating(false);
            }
          }}
          onSave={handleSaveEdit}
          onDelete={editingItem ? handleDeleteItem : undefined}
        />
      )}

      <AIChatWidget />
    </>
  );
}


