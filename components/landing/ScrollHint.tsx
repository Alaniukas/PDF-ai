"use client";

import { useCallback, useEffect, useState } from "react";

export function ScrollHint() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = useCallback(() => {
    if (atTop) {
      const target = document.getElementById("kaip-veikia") ?? document.getElementById("pavyzdys");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [atTop]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={atTop ? "Slinkite žemyn — sužinokite daugiau" : "Grįžti į puslapio viršų"}
      className="fixed bottom-6 right-4 z-30 flex flex-col items-center gap-1 rounded-full border border-cream-dark bg-white/95 px-3 py-2.5 text-sage shadow-md backdrop-blur-sm transition-all hover:border-sage/40 hover:bg-white hover:shadow-lg cursor-pointer sm:bottom-8 sm:right-8"
    >
      <span
        className={`inline-block text-lg leading-none transition-transform duration-300 ${atTop ? "" : "rotate-180"}`}
        aria-hidden
      >
        ↓
      </span>
      <span className="max-w-[4.5rem] text-center text-[10px] font-medium leading-tight text-ink-muted">
        {atTop ? "Sužinokite daugiau" : "Į viršų"}
      </span>
    </button>
  );
}
