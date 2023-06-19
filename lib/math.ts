export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(min, value), max);
}

export function normalize(value: number, min: number, max: number) {
    return (value - min) / (max - min);
}

export function clampAndNormalize(value: number, min: number, max: number) {
    return normalize(clamp(value, min, max), min, max);
}

export function toRadians(angleInDegrees: number): number {
    return angleInDegrees * (Math.PI / 180);
}
