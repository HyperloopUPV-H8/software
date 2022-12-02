export type Point = { x: number; y: number };

export function getValueFromVector(
  vector: Point[],
  coordinate: keyof Point,
  compareFn: (value: number, currentBest: number) => boolean,
  initialValue: number
): number {
  let currentBest = initialValue;
  vector.forEach((point) => {
    if (compareFn(point[coordinate], currentBest)) {
      currentBest = point[coordinate];
    }
  });
  return currentBest;
}

export function concatenateVectors(vectors: Point[][]): Point[] {
  return [...vectors].flat();
}

export function getMaxX(points: Point[]): number {
  return points.reduce(
    (prevPoint, currentPoint) => {
      if (currentPoint.x > prevPoint.x) {
        return currentPoint;
      } else {
        return prevPoint;
      }
    },
    { x: -Infinity, y: 0 }
  ).x;
}

export function getMinX(points: Point[]): number {
  return points.reduce(
    (prevPoint, currentPoint) => {
      if (currentPoint.x < prevPoint.x) {
        return currentPoint;
      } else {
        return prevPoint;
      }
    },
    { x: Infinity, y: 0 }
  ).x;
}

export function getMaxY(points: Point[]): number {
  return points.reduce(
    (prevPoint, currentPoint) => {
      if (currentPoint.y > prevPoint.y) {
        return currentPoint;
      } else {
        return prevPoint;
      }
    },
    { x: 0, y: -Infinity }
  ).y;
}

export function getMinY(points: Point[]): number {
  return points.reduce(
    (prevPoint, currentPoint) => {
      if (currentPoint.y < prevPoint.y) {
        return currentPoint;
      } else {
        return prevPoint;
      }
    },
    { x: 0, y: Infinity }
  ).y;
}

export function getNormalizedPoints(
  points: Point[],
  xFactor: number = 1,
  yFactor: number = 1
): Point[] {
  let maxX = getMaxX(points);
  let minX = getMinX(points);
  let maxY = getMaxY(points);
  let minY = getMinY(points);
  return points.map((point) => {
    let newPoint = { ...point };
    if (maxY == minY) {
      newPoint.y = 0.5;
    } else {
      newPoint.x = (point.x - minX) / (maxX - minX);
      newPoint.y = (point.y - minY) / (maxY - minY);
    }

    newPoint.x *= xFactor;
    newPoint.y *= yFactor;
    return newPoint;
  });
}
