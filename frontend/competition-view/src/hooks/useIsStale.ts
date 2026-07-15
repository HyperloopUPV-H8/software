import { useEffect, useState } from "react";
import { isStale, subscribeTick } from "../lib/freshness";

/**
 * These hooks poll the freshness map on the shared ticker and mirror the
 * result into component state. A plain setState is used (rather than
 * useSyncExternalStore) so a flip can never be missed: memoised chart
 * components never re-render on data updates, so a single dropped
 * notification would leave them tinted yellow forever.
 */

/** True when the measurement stopped arriving (see STALE_THRESHOLD_MS). */
export const useIsStale = (board: string, id: string): boolean => {
  const [stale, setStale] = useState(() => isStale(board, id));

  useEffect(() => {
    const update = () => setStale(isStale(board, id));
    update();
    return subscribeTick(update);
  }, [board, id]);

  return stale;
};

/**
 * True when EVERY listed measurement is stale — used by charts to tint the
 * whole card when its data stream stopped. `pairs` should be a stable
 * reference (module constant or memoised).
 */
export const useAllStale = (
  pairs: readonly { board: string; measurementKey: string }[],
): boolean => {
  const [stale, setStale] = useState(() =>
    pairs.every(({ board, measurementKey }) => isStale(board, measurementKey)),
  );

  useEffect(() => {
    const update = () =>
      setStale(pairs.every(({ board, measurementKey }) => isStale(board, measurementKey)));
    update();
    return subscribeTick(update);
  }, [pairs]);

  return stale;
};

/**
 * Stale flags for several measurements of one board in a single
 * subscription. Returns a stable array reference while no flag changes.
 * `ids` should be a stable reference (module constant or memoised).
 */
export const useStaleFlags = (board: string, ids: readonly string[]): boolean[] => {
  const [flags, setFlags] = useState<boolean[]>(() => ids.map((id) => isStale(board, id)));

  useEffect(() => {
    const update = () =>
      setFlags((prev) => {
        const next = ids.map((id) => isStale(board, id));
        return next.length === prev.length && next.every((v, i) => v === prev[i])
          ? prev
          : next;
      });
    update();
    return subscribeTick(update);
  }, [board, ids]);

  return flags;
};
