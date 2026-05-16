"use client";

import { useEffect } from "react";

export default function BfCacheProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ye function check karta hai jab page cache se (back button) load hota hai
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        // Agar back button press kiya gaya hai, toh page ko ek baar forcefully fresh load kar do
        // Isse framer-motion aur Next.js router cache ki wajah se aane wali blank screen hamesha ke liye khatam ho jayegi
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return <>{children}</>;
}
