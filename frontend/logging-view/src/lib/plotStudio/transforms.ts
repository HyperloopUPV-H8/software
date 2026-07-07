import type { SignalPoint } from "../../types/plotStudio";

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

export function applyTransform(data: SignalPoint[], expression: string): SignalPoint[] {
  return data
    .map((point) => ({ time: point.time, value: safeEval(expression, point.value) }))
    .filter((p) => isFinite(p.value));
}
