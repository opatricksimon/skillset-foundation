"use client";

import { useEffect, useRef, useState } from "react";

export type SidebarState = "expanded" | "collapsed";

const STORAGE_KEY = "skillset_sidebar_state";

export function useSidebarState() {
  const [state, setState] = useState<SidebarState>("expanded");
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const hoverTimer = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedState = window.localStorage.getItem(STORAGE_KEY);

      if (savedState === "collapsed" || savedState === "expanded") {
        setState(savedState);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function toggle() {
    setState((currentState) => {
      const nextState = currentState === "expanded" ? "collapsed" : "expanded";
      window.localStorage.setItem(STORAGE_KEY, nextState);
      setHoverExpanded(false);
      return nextState;
    });
  }

  function handleMouseEnter() {
    if (state !== "collapsed") {
      return;
    }

    const canHover = typeof window.matchMedia === "function"
      ? window.matchMedia("(hover: hover)").matches
      : true;

    if (!canHover) {
      return;
    }

    hoverTimer.current = window.setTimeout(() => {
      setHoverExpanded(true);
    }, 240);
  }

  function handleMouseLeave() {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }

    setHoverExpanded(false);
  }

  return {
    isCollapsed: state === "collapsed" && !hoverExpanded,
    persistentState: state,
    toggle,
    handleMouseEnter,
    handleMouseLeave,
  };
}
