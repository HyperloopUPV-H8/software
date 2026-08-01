import type { OperationType, SeriesData } from "../../types/plotStudio";

function interpolate(time: Float64Array, value: Float64Array, idx: number, t: number): number {
  if (idx >= time.length - 1) return value[value.length - 1];
  const t1 = time[idx];
  const t2 = time[idx + 1];
  const ratio = (t - t1) / (t2 - t1);
  return value[idx] + ratio * (value[idx + 1] - value[idx]);
}

export function performOperation(
  dataA: SeriesData,
  dataB: SeriesData,
  type: OperationType,
): SeriesData {
  const { time: aTime, value: aValue } = dataA;
  const { time: bTime, value: bValue } = dataB;

  const minTime = Math.max(aTime[0], bTime[0]);
  const maxTime = Math.min(aTime[aTime.length - 1], bTime[bTime.length - 1]);

  const avgDtA = (aTime[aTime.length - 1] - aTime[0]) / (aTime.length - 1);
  const avgDtB = (bTime[bTime.length - 1] - bTime[0]) / (bTime.length - 1);
  const dt = Math.max(1, Math.min(avgDtA, avgDtB));

  const estN = Math.max(0, Math.floor((maxTime - minTime) / dt) + 2);
  const outTime = new Float64Array(estN);
  const outValue = new Float64Array(estN);
  let idxA = 0;
  let idxB = 0;
  let i = 0;

  for (let t = minTime; t <= maxTime; t += dt, i++) {
    while (idxA < aTime.length - 1 && aTime[idxA + 1] < t) idxA++;
    while (idxB < bTime.length - 1 && bTime[idxB + 1] < t) idxB++;

    const valueA = interpolate(aTime, aValue, idxA, t);
    const valueB = interpolate(bTime, bValue, idxB, t);

    let resultValue: number;
    switch (type) {
      case "subtract": resultValue = valueA - valueB; break;
      case "add":      resultValue = valueA + valueB; break;
      case "multiply": resultValue = valueA * valueB; break;
      case "divide":   resultValue = valueB !== 0 ? valueA / valueB : 0; break;
    }

    outTime[i] = t;
    outValue[i] = resultValue;
  }

  return { time: outTime.subarray(0, i), value: outValue.subarray(0, i) };
}
