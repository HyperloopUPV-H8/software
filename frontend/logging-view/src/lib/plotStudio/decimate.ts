import type { SeriesData } from "../../types/plotStudio";

/**
 * Largest-Triangle-Three-Buckets downsampling — bounds how many points ever
 * reach Plotly's SVG renderer (which chokes on hundreds of thousands of
 * vertices) while preserving visually significant features (spikes, peaks)
 * far better than naive stride/every-Nth sampling. Always keeps the first
 * and last point. No-op (returns the input as-is, no copy) when already at
 * or below threshold.
 */
export function decimateLTTB(time: Float64Array, value: Float64Array, threshold: number): SeriesData {
  const n = time.length;
  if (threshold >= n || threshold <= 2) return { time, value };

  const outTime = new Float64Array(threshold);
  const outValue = new Float64Array(threshold);
  let outIdx = 0;

  const every = (n - 2) / (threshold - 2);

  let a = 0;
  outTime[outIdx] = time[a];
  outValue[outIdx] = value[a];
  outIdx++;

  for (let i = 0; i < threshold - 2; i++) {
    // Average point of the *next* bucket — used as the triangle's third vertex.
    const avgRangeStart = Math.floor((i + 1) * every) + 1;
    const avgRangeEnd = Math.min(Math.floor((i + 2) * every) + 1, n);
    const avgRangeLength = avgRangeEnd - avgRangeStart;

    let avgX: number;
    let avgY: number;
    if (avgRangeLength <= 0) {
      const clamped = Math.min(avgRangeStart, n - 1);
      avgX = time[clamped];
      avgY = value[clamped];
    } else {
      avgX = 0;
      avgY = 0;
      for (let j = avgRangeStart; j < avgRangeEnd; j++) {
        avgX += time[j];
        avgY += value[j];
      }
      avgX /= avgRangeLength;
      avgY /= avgRangeLength;
    }

    // This bucket's candidate range — pick whichever point forms the largest
    // triangle with the previously-picked point and the next bucket's average.
    const rangeStart = Math.floor(i * every) + 1;
    const rangeEnd = Math.floor((i + 1) * every) + 1;

    const pointAX = time[a];
    const pointAY = value[a];

    let maxArea = -1;
    let maxAreaIdx = rangeStart;
    let nextA = rangeStart;

    for (let j = rangeStart; j < rangeEnd; j++) {
      const area = Math.abs(
        (pointAX - avgX) * (value[j] - pointAY) -
        (pointAX - time[j]) * (avgY - pointAY),
      ) * 0.5;
      if (area > maxArea) {
        maxArea = area;
        maxAreaIdx = j;
        nextA = j;
      }
    }

    outTime[outIdx] = time[maxAreaIdx];
    outValue[outIdx] = value[maxAreaIdx];
    outIdx++;
    a = nextA;
  }

  outTime[outIdx] = time[n - 1];
  outValue[outIdx] = value[n - 1];
  outIdx++;

  return { time: outTime, value: outValue };
}
