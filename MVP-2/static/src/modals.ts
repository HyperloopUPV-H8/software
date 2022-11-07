export type Packet = {
  id: number;
  name: string;
  hexValue: string;
  count: number;
  cycleTime: number;
  measurements: Measurement[];
};

export type Measurement = {
  name: string;
  value: string;
  units: string;
};
