"use client";

import type { Task } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { language } = useLanguage();

  const getLocalizedContent = () => {
    if (language === "vi") {
      return {
        title: task.title_vi || task.title || "",
        description: task.description_vi || task.description || "",
      };
    }
    if (language === "zh-TW") {
      // Priority: title_zh > title_vi > title_en > title
      return {
        title: task.title_zh || task.title_vi || task.title_en || task.title || "",
        description: task.description_zh || task.description_vi || task.description_en || task.description || "",
      };
    }
    if (language === "en") {
      return {
        title: task.title_en || task.title_vi || task.title_zh || task.title || "",
        description: task.description_en || task.description_vi || task.description_zh || task.description || "",
      };
    }
    return {
      title: task.title || "",
      description: task.description || "",
    };
  };

  const { title, description } = getLocalizedContent();

  // Map icon to FontAwesome class
  const getIconClass = (icon?: string | null) => {
    if (!icon) return "fas fa-tasks";
    const iconMap: Record<string, string> = {
      "🚐": "fas fa-plane-departure",
      "👥": "fas fa-users",
      "❤️": "fas fa-heart",
      "plane": "fas fa-plane-departure",
      "users": "fas fa-users",
      "heart": "fas fa-heart",
    };
    return iconMap[icon] || "fas fa-tasks";
  };

  const iconClass = getIconClass(task.icon);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 relative group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
            task.icon === "🚐" || task.icon === "plane" ? "bg-indigo-50 text-[#4C51BF]" :
            task.icon === "👥" || task.icon === "users" ? "bg-purple-50 text-[#6D28D9]" :
            task.icon === "❤️" || task.icon === "heart" ? "bg-pink-50 text-pink-500" :
            "bg-gray-50 text-gray-600"
          }`}>
            {task.icon && task.icon.length <= 2 ? (
              <span className="text-sm">{task.icon}</span>
            ) : (
              <i className={`${iconClass} text-xs`} />
            )}
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {title}
            </h3>
            {description && (
              <p className="mt-2 text-xs text-gray-600">
                {description}
              </p>
            )}
          </div>
        </div>
        {task.assignee && (
          <span className="inline-flex items-center rounded-full bg-[#F3E8FF] px-2 py-0.5 text-[11px] font-medium text-[#6D28D9] mr-2">
            {task.assignee}
          </span>
        )}
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-[#6D28D9] hover:border-[#6D28D9] opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <i className="fas fa-pen text-[10px]" />
        </button>
      </div>
    </div>
  );
}

