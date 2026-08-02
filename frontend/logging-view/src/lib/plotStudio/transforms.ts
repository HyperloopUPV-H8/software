import type { SeriesData } from "../../types/plotStudio";

function safeEval(expr: string, x: number): number {
  const processed = expr
    .replace(/\^/g, "**")
    .replace(/(\d)x/g, "$1*x")
    .replace(/x(\d)/g, "x*$1")
    .replace(/\babs\b/g, "Math.abs")
    .replace(/\bsin\b/g, "Math.sin")
    .replace(/\bcos\b/g, "Math.cos")
    .replace(/\btan\b/g, "Math.tan")
    .replace(/\bsqrt\b/g, "Math.sqrt")
    .replace(/\blog10\b/g, "Math.log10")
    .replace(/\blog\b/g, "Math.log")
    .replace(/\bexp\b/g, "Math.exp")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E");

  try {
    const fn = new Function("x", "Math", `return (${processed})`);
    return fn(x, Math) as number;
  } catch {
    return NaN;
  }
}

export function applyTransform(data: SeriesData, expression: string): SeriesData {
  const n = data.value.length;
  const outTime = new Float64Array(n);
  const outValue = new Float64Array(n);
  let count = 0;

  for (let i = 0; i < n; i++) {
    const v = safeEval(expression, data.value[i]);
    if (isFinite(v)) {
      outTime[count] = data.time[i];
      outValue[count] = v;
      count++;
    }
  }

  return { time: outTime.subarray(0, count), value: outValue.subarray(0, count) };
}
