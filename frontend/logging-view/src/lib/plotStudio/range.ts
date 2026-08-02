// Binary search over a time axis — assumes non-decreasing time (holds here:
// parseCSV only shifts by a constant offset, never reorders samples).

/** First index whose time is >= target. */
export function lowerBound(time: Float64Array, target: number): number {
  let lo = 0;
  let hi = time.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (time[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** First index whose time is > target. */
export function upperBound(time: Float64Array, target: number): number {
  let lo = 0;
  let hi = time.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (time[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
