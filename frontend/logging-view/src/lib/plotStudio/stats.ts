import type { NoiseFloor, NoiseStats, SignalPoint } from "../../types/plotStudio";

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function variance(arr: number[]): number {
  if (arr.length === 0) return 0;
  const m = mean(arr);
  return arr.reduce((sum, val) => sum + (val - m) ** 2, 0) / arr.length;
}

function stdDev(arr: number[]): number {
  return Math.sqrt(variance(arr));
}

function rms(arr: number[]): number {
  if (arr.length === 0) return 0;
  return Math.sqrt(arr.reduce((sum, val) => sum + val * val, 0) / arr.length);
}

export function computeNoiseStats(
  data: SignalPoint[],
  startTime?: number,
  endTime?: number,
): NoiseStats | null {
  let values: number[];
  if (startTime !== undefined && endTime !== undefined) {
    values = data.filter((p) => p.time >= startTime && p.time <= endTime).map((p) => p.value);
  } else {
    values = data.map((p) => p.value);
  }

  if (values.length === 0) return null;

  const m = mean(values);
  const std = stdDev(values);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  return {
    count: values.length,
    mean: m,
    std,
    rms: rms(values),
    min: minVal,
    max: maxVal,
    peakToPeak: maxVal - minVal,
    variance: variance(values),
  };
}

export function estimateNoiseFloor(data: SignalPoint[], windowSize = 100): NoiseFloor {
  const windows: { variance: number; std: number }[] = [];

  for (let i = 0; i < data.length - windowSize; i += Math.floor(windowSize / 2)) {
    const windowData = data.slice(i, i + windowSize).map((p) => p.value);
    const v = variance(windowData);
    windows.push({ variance: v, std: Math.sqrt(v) });
  }

  if (windows.length === 0) return { noiseFloor: 0 };

  windows.sort((a, b) => a.variance - b.variance);
  const staticWindows = windows.slice(0, Math.max(1, Math.floor(windows.length * 0.2)));
  const avgNoiseFloor = mean(staticWindows.map((w) => w.std));

  return { noiseFloor: avgNoiseFloor };
}
