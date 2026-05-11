"use client";

import { useEffect, useRef, useState } from "react";

export function useRevealOnView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || revealed || typeof window === "undefined") {
      return;
    }

    const reducedMotion = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

    if (reducedMotion) {
      return;
    }

    if (typeof window.IntersectionObserver === "undefined") {
      const fallbackTimer = window.setTimeout(() => setRevealed(true), 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.15 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [revealed]);

  return { ref, revealed };
}
