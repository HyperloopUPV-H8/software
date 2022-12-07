export function getVectorLimits(vector: number[]): [number, number] {
  let max = -Infinity;
  let min = Infinity;

  vector.forEach((value) => {
    max = value > max ? value : max;
    min = value < min ? value : min;
  });

  return [max, min];
}
