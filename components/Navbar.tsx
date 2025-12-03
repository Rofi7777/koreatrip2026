"use client";

import { useLanguage } from "@/context/LanguageContext";

interface NavbarProps {
  onLogout: () => void;
  loggingOut: boolean;
}

export function Navbar({ onLogout, loggingOut }: NavbarProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-gray-100">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#6D28D9] text-white">
            <i className="fas fa-mountain" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              {t("nav_brand_subtitle")}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {t("app_title")}
            </p>
          </div>
        </div>

        <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-gray-600">
          <a href="#hero" className="hover:text-[#6D28D9]">
            {t("nav_home")}
          </a>
          <a href="#schedule" className="hover:text-[#6D28D9]">
            {t("nav_schedule")}
          </a>
          <a href="#tasks" className="hover:text-[#6D28D9]">
            {t("nav_tasks")}
          </a>
          <a href="#info" className="hover:text-[#6D28D9]">
            {t("nav_info")}
          </a>
          <a href="#tools" className="hover:text-[#6D28D9]">
            {t("nav_tools")}
          </a>
          <a href="#gallery" className="hover:text-[#6D28D9]">
            {t("nav_gallery")}
          </a>

          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="ml-2 inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 shadow-sm disabled:opacity-70"
          >
            <i className="fas fa-sign-out-alt mr-1" />
            {loggingOut ? "..." : t("nav_logout")}
          </button>
        </nav>
      </div>
    </header>
  );
}





