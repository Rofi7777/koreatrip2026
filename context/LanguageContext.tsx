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
  // Lock language to Vietnamese only
  const [language] = useState<LanguageCode>("vi");
  
  // Disabled language switching - always Vietnamese
  const setLanguage = (_lang: LanguageCode) => {
    // Do nothing - language is locked to Vietnamese
  };

  const value = useMemo<LanguageContextValue>(() => {
    const t = (key: string): string => {
      // Always return Vietnamese translations
      const dict = TRANSLATIONS.vi;
      return dict[key] ?? key;
    };

    return {
      language: "vi",
      setLanguage,
      t,
    };
  }, []);

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





