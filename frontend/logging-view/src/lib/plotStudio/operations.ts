import type { OperationType, SignalPoint } from "../../types/plotStudio";

function interpolate(data: SignalPoint[], idx: number, t: number): number {
  if (idx >= data.length - 1) return data[data.length - 1].value;
  const p1 = data[idx];
  const p2 = data[idx + 1];
  const ratio = (t - p1.time) / (p2.time - p1.time);
  return p1.value + ratio * (p2.value - p1.value);
}

export function performOperation(
  dataA: SignalPoint[],
  dataB: SignalPoint[],
  type: OperationType,
): SignalPoint[] {
  const minTime = Math.max(dataA[0].time, dataB[0].time);
  const maxTime = Math.min(dataA[dataA.length - 1].time, dataB[dataB.length - 1].time);

  const avgDtA = (dataA[dataA.length - 1].time - dataA[0].time) / (dataA.length - 1);
  const avgDtB = (dataB[dataB.length - 1].time - dataB[0].time) / (dataB.length - 1);
  const dt = Math.max(1, Math.min(avgDtA, avgDtB));

  const result: SignalPoint[] = [];
  let idxA = 0;
  let idxB = 0;

  for (let t = minTime; t <= maxTime; t += dt) {
    while (idxA < dataA.length - 1 && dataA[idxA + 1].time < t) idxA++;
    while (idxB < dataB.length - 1 && dataB[idxB + 1].time < t) idxB++;

    const valueA = interpolate(dataA, idxA, t);
    const valueB = interpolate(dataB, idxB, t);

    let resultValue: number;
    switch (type) {
      case "subtract": resultValue = valueA - valueB; break;
      case "add":      resultValue = valueA + valueB; break;
      case "multiply": resultValue = valueA * valueB; break;
      case "divide":   resultValue = valueB !== 0 ? valueA / valueB : 0; break;
    }

    result.push({ time: t, value: resultValue });
  }

  return result;
}
