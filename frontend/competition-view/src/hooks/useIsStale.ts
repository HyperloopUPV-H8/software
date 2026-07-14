import { useRef, useSyncExternalStore } from "react";
import { isStale, subscribeTick } from "../lib/freshness";

/**
 * True when the measurement stopped arriving (see STALE_THRESHOLD_MS).
 * Driven by the shared freshness ticker; the component only re-renders
 * when the flag actually flips.
 */
export const useIsStale = (board: string, id: string): boolean =>
  useSyncExternalStore(subscribeTick, () => isStale(board, id));

/**
 * True when EVERY listed measurement is stale — used by charts to tint the
 * whole card when its data stream stopped. `pairs` should be a stable
 * reference (module constant or memoised).
 */
export const useAllStale = (
  pairs: readonly { board: string; measurementKey: string }[],
): boolean =>
  useSyncExternalStore(subscribeTick, () =>
    pairs.every(({ board, measurementKey }) => isStale(board, measurementKey)),
  );

/**
 * Stale flags for several measurements of one board in a single
 * subscription. Returns a stable array reference while no flag changes.
 * `ids` should be a stable reference (module constant or memoised).
 */
export const useStaleFlags = (board: string, ids: readonly string[]): boolean[] => {
  const cacheRef = useRef<boolean[]>([]);
  return useSyncExternalStore(subscribeTick, () => {
    const next = ids.map((id) => isStale(board, id));
    const prev = cacheRef.current;
    if (next.length === prev.length && next.every((v, i) => v === prev[i])) return prev;
    cacheRef.current = next;
    return next;
  });
};
