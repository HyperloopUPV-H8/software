export function lightenHSL(color: string): string {
    const matches = color
        .replaceAll(" ", "")
        .match(/hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)/)!;
    const h = matches[1];
    const s = matches[2];
    const l = matches[3];
    const newLightness = Math.min(parseInt(l) + 35, 100);
    return `hsl(${h}, ${s}%, ${newLightness}%)`;
}
