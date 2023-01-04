import { clamp } from "@utils/math";

export type HSLAColor = {
    h: number;
    s: number;
    l: number;
    a: number;
};

type RGBAColor = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export function hslaToHex({ h, s, l, a }: HSLAColor): RGBAColor {
    l /= 100;
    const a2 = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0"); // convert to Hex and prefix "0" if needed
    };
    return {
        r: parseInt(f(0)),
        g: parseInt(f(8)),
        b: parseInt(f(4)),
        a: a,
    };
}

export function getSofterHSLAColor(
    { h, s, l, a }: HSLAColor,
    lightnessOffset: number
): HSLAColor {
    return { h, s, l: l + clamp(lightnessOffset, 0, 100), a: a } as HSLAColor;
}

export function hslaToString({ h, s, l, a }: HSLAColor): string {
    return `hsl(${h},${s}%,${l}%,${a})`;
}
