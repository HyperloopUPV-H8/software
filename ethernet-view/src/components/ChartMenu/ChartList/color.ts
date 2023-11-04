const INITIAL_COLOR = "hsl(21, 84%, 57%)";
let colorOffset = -1;

export function getNextColor(): string {
    const matches = INITIAL_COLOR.replaceAll(" ", "").match(
        /hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)/
    )!;
    const h = matches[1];
    const s = matches[2];
    const l = matches[3];
    colorOffset++;
    return `hsl(${(parseInt(h) + 20 * colorOffset) % 360},${s}%,${l}%)`;
}
