"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { ItineraryItem, Task, InfoCard } from "@/types";

type TableType = "itinerary" | "tasks" | "info_cards";

interface RowData {
  id: string | number;
  title: string;
  title_zh?: string | null;
  description?: string | null;
  description_zh?: string | null;
  content?: string | null;
  content_zh?: string | null;
  [key: string]: any;
}

export default function TranslationManagerPage() {
  const [activeTab, setActiveTab] = useState<TableType>("itinerary");
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translatingIds, setTranslatingIds] = useState<Set<string | number>>(new Set());
  const [translatingAll, setTranslatingAll] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: fetchedData, error: fetchError } = await supabase
        .from(activeTab)
        .select("*")
        .order("created_at", { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setData(fetchedData || []);
    } catch (err) {
      console.error("[Translation Manager] Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (row: RowData) => {
    const rowId = row.id;
    setTranslatingIds((prev) => new Set(prev).add(rowId));

    try {
      // Prepare source text - prioritize Vietnamese fields
      const sourceText: Record<string, string> = {
        title: (row.title_vi || row.title || "").trim(),
      };

      if (activeTab === "info_cards") {
        const content = (row.content_vi || row.content || "").trim();
        if (content) {
          sourceText.content = content;
        }
      } else {
        const description = (row.description_vi || row.description || "").trim();
        if (description) {
          sourceText.description = description;
        }
      }

      if (!sourceText.title) {
        throw new Error("Source title is empty");
      }

      const response = await fetch("/api/admin/translate-row", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: activeTab,
          id: rowId,
          sourceText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Translation failed");
      }

      const result = await response.json();

      // Update local state immediately
      setData((prevData) =>
        prevData.map((item) =>
          item.id === rowId
            ? {
                ...item,
                title_zh: result.data.title_zh,
                ...(activeTab === "info_cards"
                  ? { content_zh: result.data.content_zh }
                  : { description_zh: result.data.description_zh }),
              }
            : item
        )
      );
    } catch (err) {
      console.error("[Translation Manager] Translate error:", err);
      alert(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setTranslatingIds((prev) => {
        const next = new Set(prev);
        next.delete(rowId);
        return next;
      });
    }
  };

  const handleTranslateAll = async () => {
    const rowsToTranslate = data.filter(
      (row) => !row.title_zh || row.title_zh.trim() === ""
    );

    if (rowsToTranslate.length === 0) {
      alert("All rows already have Chinese translations!");
      return;
    }

    const confirmed = window.confirm(
      `Translate ${rowsToTranslate.length} rows? This may take a few minutes.`
    );

    if (!confirmed) return;

    setTranslatingAll(true);

    for (let i = 0; i < rowsToTranslate.length; i++) {
      const row = rowsToTranslate[i];
      await handleTranslate(row);

      // Small delay to avoid rate limits (500ms between requests)
      if (i < rowsToTranslate.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    setTranslatingAll(false);
    alert(`Translation completed for ${rowsToTranslate.length} rows!`);
  };

  const getTableLabel = () => {
    switch (activeTab) {
      case "itinerary":
        return "Itinerary";
      case "tasks":
        return "Tasks";
      case "info_cards":
        return "Info Cards";
      default:
        return "";
    }
  };

  const getSourceText = (row: RowData) => {
    if (activeTab === "info_cards") {
      return {
        title: row.title_vi || row.title || "",
        content: row.content_vi || row.content || "",
      };
    }
    return {
      title: row.title_vi || row.title || "",
      description: row.description_vi || row.description || "",
    };
  };

  const getTargetText = (row: RowData) => {
    if (activeTab === "info_cards") {
      return {
        title: row.title_zh || "",
        content: row.content_zh || "",
      };
    }
    return {
      title: row.title_zh || "",
      description: row.description_zh || "",
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[95%] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          🌐 Translation Manager
        </h1>
        <p className="text-sm text-gray-600">
          Manage Vietnamese to Traditional Chinese translations for all content
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-200">
          {(["itinerary", "tasks", "info_cards"] as TableType[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "itinerary"
                ? "Itinerary"
                : tab === "tasks"
                ? "Tasks"
                : "Info Cards"}
            </button>
          ))}
        </div>
      </div>

      {/* Translate All Button */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            {data.length} total rows ·{" "}
            {data.filter((row) => !row.title_zh || row.title_zh.trim() === "")
              .length}{" "}
            need translation
          </p>
        </div>
        <button
          type="button"
          onClick={handleTranslateAll}
          disabled={translatingAll}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {translatingAll ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Translating...
            </>
          ) : (
            <>
              <span>🚀</span>
              Translate All Empty Rows
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Vietnamese (Source)
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Traditional Chinese (Target)
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((row) => {
                  const source = getSourceText(row);
                  const target = getTargetText(row);
                  const isTranslating = translatingIds.has(row.id);
                  const hasTranslation = target.title && target.title.trim() !== "";

                  return (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {source.title}
                        </div>
                        {source.description && (
                          <div className="text-xs text-gray-600 mt-1">
                            {source.description}
                          </div>
                        )}
                        {source.content && (
                          <div className="text-xs text-gray-600 mt-1">
                            {source.content}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {hasTranslation ? (
                          <>
                            <div className="text-sm font-medium text-gray-900">
                              {target.title}
                            </div>
                            {target.description && (
                              <div className="text-xs text-gray-600 mt-1">
                                {target.description}
                              </div>
                            )}
                            {target.content && (
                              <div className="text-xs text-gray-600 mt-1">
                                {target.content}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-sm text-orange-600 italic">
                            (待翻譯)
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleTranslate(row)}
                          disabled={isTranslating || translatingAll}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-purple-300 px-3 py-1.5 text-xs font-medium text-purple-700 bg-white hover:bg-purple-50 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isTranslating ? (
                            <>
                              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-700"></span>
                              Translating...
                            </>
                          ) : (
                            <>
                              <span>⚡</span>
                              Translate
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

