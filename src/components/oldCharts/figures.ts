export function getPath(
    data: number[],
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    width: number,
    height: number
): string {
    const figurePoints = getFigurePoints(
        data,
        minX,
        maxX,
        minY,
        maxY,
        width,
        height
    );

    return getPathFromFigurePoints(figurePoints);
}

function getFigurePoints(
    data: number[],
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
    width: number,
    height: number
): [number, number][] {
    return data.map((y, index) => {
        if (y > maxY) {
            console.log(`surpassed maximum (${minY}): ${y}`);
        }
        let figureX = ((index - minX) * width) / (maxX - minX);

        if (isNaN(figureX)) {
            figureX = width / 2;
        }

        let figureY = height - ((y - minY) * height) / (maxY - minY);

        if (isNaN(figureY)) {
            figureY = height / 2;
        }

        return [figureX, figureY];
    });
}

function getPathFromFigurePoints(figurePoints: [number, number][]): string {
    if (figurePoints.length >= 2) {
        const path = figurePoints.map(([x, y]) => `L ${x} ${y}`).join(" ");
        return "M " + path.slice(2);
    } else {
        return "";
    }
}

export function getMinMaxY(points: number[]) {
    let minY = Infinity;
    let maxY = -Infinity;

    for (let value of points) {
        minY = value < minY ? value : minY;
        maxY = value > maxY ? value : maxY;
    }

    return [minY, maxY];
}
