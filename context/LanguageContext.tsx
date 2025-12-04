"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TRANSLATIONS, type LanguageCode } from "@/lib/translations";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const LANGUAGE_STORAGE_KEY = "koreatrip_language";
const DEFAULT_LANGUAGE: LanguageCode = "vi";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Load language from localStorage or default to Vietnamese
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null;
      if (stored && (stored === "vi" || stored === "zh-TW")) {
        return stored;
      }
    }
    return DEFAULT_LANGUAGE;
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const value = useMemo<LanguageContextValue>(() => {
    const t = (key: string): string => {
      const dict = TRANSLATIONS[language];
      return dict[key] ?? key;
    };

    return {
      language,
      setLanguage,
      t,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}





