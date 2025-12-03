import type { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}


