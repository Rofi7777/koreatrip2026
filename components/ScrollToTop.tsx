"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on page load and route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Instant scroll, no animation
    });
  }, [pathname]);

  return null;
}

