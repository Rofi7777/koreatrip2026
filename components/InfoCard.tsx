"use client";

import type { InfoCard as InfoCardType } from "@/types";

interface InfoCardProps {
  card: InfoCardType;
  onEdit: (card: InfoCardType) => void;
}

export function InfoCard({ card, onEdit }: InfoCardProps) {

  const getLocalizedContent = () => {
    // Simplified: Always use Vietnamese or main fields
    return {
      title: card.title_vi || card.title || "",
      content: card.content_vi || card.content || "",
    };
  };

  const { title, content } = getLocalizedContent();

  // Map icon to FontAwesome class
  const getIconClass = (icon?: string | null) => {
    if (!icon) return "fas fa-info-circle";
    const iconMap: Record<string, string> = {
      "train": "fas fa-train-subway",
      "passport": "fas fa-passport",
      "transport": "fas fa-train-subway",
      "docs": "fas fa-passport",
    };
    return iconMap[icon] || "fas fa-info-circle";
  };

  const iconClass = getIconClass(card.icon);
  const iconColor = card.icon === "train" || card.icon === "transport" 
    ? "bg-indigo-50 text-[#4C51BF]"
    : card.icon === "passport" || card.icon === "docs"
    ? "bg-green-50 text-green-500"
    : "bg-gray-50 text-gray-600";

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-3 relative group">
      <div className="mt-1">
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${iconColor}`}>
          <i className={`${iconClass} text-xs`} />
        </span>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900">
          {title}
        </h3>
        {content && (
          <p className="mt-1 text-xs text-gray-600">
            {content}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onEdit(card)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-[#6D28D9] hover:border-[#6D28D9] opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <i className="fas fa-pen text-[10px]" />
      </button>
    </div>
  );
}

