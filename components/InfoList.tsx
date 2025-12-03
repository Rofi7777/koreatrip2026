"use client";

import { useState, useEffect } from "react";
import type { InfoCard as InfoCardType } from "@/types";
import { InfoCard } from "./InfoCard";
import { EditInfoModal } from "./EditInfoModal";

export function InfoList() {
  const [cards, setCards] = useState<InfoCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<InfoCardType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCards = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch("/api/info", {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const json = await res.json();

      if (!res.ok) {
        // If table doesn't exist, just show empty state instead of error
        if (json.message?.includes("Could not find the table") || json.message?.includes("relation")) {
          console.warn("[InfoList] Table does not exist, showing empty state");
          setCards([]);
          setLoading(false);
          return;
        }
        throw new Error(json.message ?? "Failed to load info cards.");
      }

      setCards(json.data ?? []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching info cards:", err);
      if (err instanceof Error && err.name === "AbortError") {
        setError("Request timeout. Please check your connection.");
      } else {
        setError("Failed to load info cards.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleEditClick = (card: InfoCardType) => {
    setEditingCard(card);
    setIsCreating(false);
  };

  const handleAddNewClick = () => {
    setEditingCard(null);
    setIsCreating(true);
  };

  const handleSave = async (
    updates: {
      id?: InfoCardType["id"];
      language: "vi" | "zh-TW" | "en";
      title: string;
      content: string;
      autoTranslate: boolean;
    } & Partial<InfoCardType>
  ) => {
    const isCreate = !updates.id;
    setSaving(true);

    try {
      const res = await fetch("/api/info", {
        method: isCreate ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message ?? `Failed to ${isCreate ? "create" : "update"} info card.`);
      }

      // Refresh the list
      await fetchCards();
      setEditingCard(null);
      setIsCreating(false);
      setSaving(false);
    } catch (err) {
      console.error(err);
      setSaving(false);
      throw err;
    }
  };

  const handleDelete = async (id: InfoCardType["id"]) => {
    try {
      const res = await fetch(`/api/info?id=${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message ?? "Failed to delete info card.");
      }

      // Refresh the list
      await fetchCards();
      setEditingCard(null);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleAddNewClick}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#6D28D9] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#5B21B6] transition-colors"
        >
          <i className="fas fa-plus text-[10px]" />
          Add Info Card
        </button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {cards.map((card) => (
          <InfoCard key={card.id} card={card} onEdit={handleEditClick} />
        ))}
        {cards.length === 0 && (
          <div className="col-span-full text-sm text-gray-500 text-center py-8">
            No info cards yet. Click "Add Info Card" to create one.
          </div>
        )}
      </div>

      {(editingCard !== null || isCreating) && (
        <EditInfoModal
          card={editingCard}
          onClose={() => {
            if (!saving) {
              setEditingCard(null);
              setIsCreating(false);
            }
          }}
          onSave={handleSave}
          onDelete={editingCard ? handleDelete : undefined}
        />
      )}
    </>
  );
}


