export type PacketUpdate = {
    id: number;
    hexValue: number;
    cycleTime: number;
    count: number;
    measurementUpdates: { [name: string]: number | string | boolean };
};
