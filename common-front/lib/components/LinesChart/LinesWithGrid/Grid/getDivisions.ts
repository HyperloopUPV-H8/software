export function getDivisions(totalLength: number, divisions: number): number[] {
    const positions: number[] = [];
    for (let i = 0; i < divisions + 1; i++) {
        positions.push((i * totalLength) / divisions);
    }

    return positions;
}
