"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const navItems = [
  { id: "hero", icon: "🏠", key: "nav_home" },
  { id: "schedule", icon: "📅", key: "nav_schedule" },
  { id: "tasks", icon: "✅", key: "nav_tasks" },
  { id: "info", icon: "ℹ️", key: "nav_info" },
  { id: "tools", icon: "🛠️", key: "nav_tools" },
  { id: "gallery", icon: "🖼️", key: "nav_gallery" },
];

export function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/90 border-b border-gray-100">
      {/* Two-Row Layout on Mobile, One-Row on Desktop */}
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Row 1: Branding (Mobile) / Full Header with Navigation (Desktop) */}
        <div className="flex items-center justify-between px-4 py-3 w-full">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#6D28D9] text-white">
              <i className="fas fa-mountain" />
            </span>
            {/* Mobile: Short Title */}
            <div className="md:hidden">
              <p className="text-lg font-bold text-gray-900">
                Korea Trip 2026
              </p>
            </div>
            {/* Desktop: Full Title with Subtitle */}
            <div className="hidden md:block">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                {t("nav_brand_subtitle")}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {t("app_title")}
              </p>
            </div>
          </div>

          {/* Right: Language Toggle + Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 md:ml-auto">
            {/* Language Toggle */}
            <div className="bg-purple-600/20 backdrop-blur-md rounded-full p-1 flex items-center gap-0.5 border border-purple-300/30">
              <button
                type="button"
                onClick={() => setLanguage("vi")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  language === "vi"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                🇻🇳 VI
              </button>
              <button
                type="button"
                onClick={() => setLanguage("zh-TW")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  language === "zh-TW"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                🇹🇼 繁中
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  language === "en"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                🇺🇸 EN
              </button>
            </div>

            {/* Desktop Navigation - Floating Pill Style */}
            <nav className="flex items-center">
              <div className="bg-purple-500/10 backdrop-blur-md rounded-full p-1 flex items-center gap-1 border border-purple-200/30">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        isActive
                          ? "bg-white text-purple-700 shadow-sm rounded-full"
                          : "text-gray-600 hover:text-purple-700 hover:bg-purple-50/50 rounded-full"
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{t(item.key)}</span>
                    </a>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Row 2: Language Toggle + Navigation Tabs (Mobile Only) */}
        <div className="sm:hidden w-full px-2 pb-2 space-y-2">
          {/* Mobile Language Toggle */}
          <div className="flex justify-center">
            <div className="bg-purple-600/20 backdrop-blur-md rounded-full p-1 flex items-center gap-0.5 border border-purple-300/30">
              <button
                type="button"
                onClick={() => setLanguage("vi")}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-200 ${
                  language === "vi"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                🇻🇳 VI
              </button>
              <button
                type="button"
                onClick={() => setLanguage("zh-TW")}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-200 ${
                  language === "zh-TW"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                🇹🇼 繁中
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-200 ${
                  language === "en"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                🇺🇸 EN
              </button>
            </div>
          </div>

          {/* Mobile Navigation Tabs */}
          <nav className="w-full overflow-x-auto scrollbar-hide relative">
            <div className="bg-purple-500/10 backdrop-blur-md rounded-full p-1 flex items-center gap-1 min-w-max px-4 border border-purple-200/30">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? "bg-white text-purple-700 shadow-sm rounded-full"
                        : "text-gray-600 hover:text-purple-700 hover:bg-purple-50/50 rounded-full"
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{t(item.key)}</span>
                  </a>
                );
              })}
              {/* Right spacing for mobile scroll */}
              <div className="w-4 flex-shrink-0"></div>
            </div>
            {/* Gradient fade hint on right edge */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/80 pointer-events-none"></div>
          </nav>
        </div>
      </div>
    </header>
  );
}





