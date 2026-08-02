import type { NoiseFloor, NoiseStats, SeriesData } from "../../types/plotStudio";
import { lowerBound, upperBound } from "./range";

// Single pass, no allocation, no Math.min/max spread — spreading hundreds of
// thousands of arguments into Math.min/max throws "Maximum call stack size
// exceeded" well before signals this size.
export function computeNoiseStats(values: Float64Array): NoiseStats | null {
  const n = values.length;
  if (n === 0) return null;

  let sum = 0;
  let sumSq = 0;
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < n; i++) {
    const v = values[i];
    sum += v;
    sumSq += v * v;
    if (v < min) min = v;
    if (v > max) max = v;
  }

  const mean = sum / n;
  const variance = Math.max(0, sumSq / n - mean * mean);

  return {
    count: n,
    mean,
    std: Math.sqrt(variance),
    rms: Math.sqrt(sumSq / n),
    min,
    max,
    peakToPeak: max - min,
    variance,
  };
}

// Prefix-sum windowed variance: O(n) total with two extra Float64Array
// allocations, vs. the previous O(n·windowSize/2) approach that allocated a
// fresh slice+map array per window (thousands of allocations for large signals).
export function estimateNoiseFloor(values: Float64Array, windowSize = 100): NoiseFloor {
  const n = values.length;
  if (n <= windowSize) return { noiseFloor: 0 };

  const prefixSum = new Float64Array(n + 1);
  const prefixSumSq = new Float64Array(n + 1);
  for (let i = 0; i < n; i++) {
    prefixSum[i + 1] = prefixSum[i] + values[i];
    prefixSumSq[i + 1] = prefixSumSq[i] + values[i] * values[i];
  }

  const step = Math.max(1, Math.floor(windowSize / 2));
  const variances: number[] = [];
  for (let i = 0; i + windowSize <= n; i += step) {
    const sum = prefixSum[i + windowSize] - prefixSum[i];
    const sumSq = prefixSumSq[i + windowSize] - prefixSumSq[i];
    const windowMean = sum / windowSize;
    variances.push(Math.max(0, sumSq / windowSize - windowMean * windowMean));
  }
  if (variances.length === 0) return { noiseFloor: 0 };

  variances.sort((a, b) => a - b);
  const staticCount = Math.max(1, Math.floor(variances.length * 0.2));
  let sum = 0;
  for (let i = 0; i < staticCount; i++) sum += Math.sqrt(variances[i]);

  return { noiseFloor: sum / staticCount };
}

/**
 * Single entry point for the Stats panel: binary-searches the visible time
 * range once, then hands zero-copy `.subarray()` views to the two functions
 * above — no `.filter()`/`.slice()`/`.map()` over the full array, ever, which
 * matters since this runs on every live zoom/pan update.
 */
export function computeRangeStats(
  series: SeriesData,
  range: [number, number] | null,
  windowSize = 100,
): { stats: NoiseStats; floor: NoiseFloor; count: number } | null {
  let lo = 0;
  let hi = series.time.length;
  if (range) {
    lo = lowerBound(series.time, range[0]);
    hi = upperBound(series.time, range[1]);
  }
  if (hi - lo < 2) return null;

  const valueView = series.value.subarray(lo, hi);
  const stats = computeNoiseStats(valueView);
  if (!stats) return null;

  return { stats, floor: estimateNoiseFloor(valueView, windowSize), count: hi - lo };
}
