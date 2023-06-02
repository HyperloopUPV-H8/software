export function dataToPath(
    data: number[],
    chartLength: number,
    minY: number,
    maxY: number,
    width: number,
    height: number
): string {
    return data
        .map((value, index) => {
            const chartPoint = valueToChartPoint(
                index,
                value,
                data.length,
                chartLength,
                minY,
                maxY,
                width,
                height
            );

            return pointToPathString(chartPoint, index);
        })
        .join(" ");
}

function valueToChartPoint(
    x: number,
    y: number,
    dataLength: number,
    chartLength: number,
    minY: number,
    maxY: number,
    width: number,
    height: number
): [number, number] {
    let normX = ((chartLength - dataLength + x) * width) / chartLength;

    if (isNaN(normX)) {
        normX = chartLength - 1;
    }

    let normY = height - ((y - minY) * height) / (maxY - minY);

    if (isNaN(normY)) {
        normY = height / 2;
    }

    return [normX, normY];
}

function pointToPathString(point: [number, number], index: number): string {
    if (index == 0) {
        return `M ${point[0]} ${point[1]}`;
    } else {
        return `L ${point[0]} ${point[1]}`;
    }
}
