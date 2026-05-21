"use client";

import { useEffect, useState } from "react";

export type SidebarState = "expanded" | "collapsed";

const STORAGE_KEY = "skillset_sidebar_state";

// Sidebar is click-controlled only. No hover expansion — the previous
// hover-to-peek behavior made the menu jump unexpectedly when the cursor
// passed nearby. State persists in localStorage, toggled only via
// SidebarToggle at the top of the menu.
export function useSidebarState() {
  const [state, setState] = useState<SidebarState>("expanded");

  useEffect(() => {
    // Defer the setState by a microtask so React doesn't flag this as
    // a sync setState-in-effect cascade. localStorage is read post-hydration
    // anyway — SSR defaults to "expanded".
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
      return nextState;
    });
  }

  return {
    isCollapsed: state === "collapsed",
    persistentState: state,
    toggle,
  };
}
