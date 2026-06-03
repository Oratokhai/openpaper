"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

/**
 * Drives the contextual ("Dynamic Island") morph of the desktop nav pill.
 * - `state`: persistent contextual face pushed by a page (writing / reading). `null` = default nav.
 * - `activity`: a transient live event (e.g. "Draft saved ✓") that briefly takes over the pill,
 *   then auto-clears back to whatever `state`/nav is current.
 */
export type IslandState =
  | { mode: "writing"; words: number; saved: boolean; isNew: boolean }
  | { mode: "reading"; progress: number };

export type IslandActivity = {
  icon: "check" | "bell" | "heart";
  label: string;
  tone?: "ok" | "accent";
};

type IslandContextValue = {
  state: IslandState | null;
  setIsland: (s: IslandState | null) => void;
  activity: IslandActivity | null;
  pushActivity: (a: IslandActivity, ms?: number) => void;
};

const IslandContext = createContext<IslandContextValue | null>(null);

export function IslandProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IslandState | null>(null);
  const [activity, setActivity] = useState<IslandActivity | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setIsland = useCallback((s: IslandState | null) => setState(s), []);

  const pushActivity = useCallback((a: IslandActivity, ms = 2400) => {
    if (timer.current) clearTimeout(timer.current);
    setActivity(a);
    timer.current = setTimeout(() => setActivity(null), ms);
  }, []);

  return (
    <IslandContext.Provider value={{ state, setIsland, activity, pushActivity }}>
      {children}
    </IslandContext.Provider>
  );
}

/** Safe no-op default when rendered outside a provider. */
export function useIsland(): IslandContextValue {
  return (
    useContext(IslandContext) ?? {
      state: null,
      setIsland: () => {},
      activity: null,
      pushActivity: () => {},
    }
  );
}
