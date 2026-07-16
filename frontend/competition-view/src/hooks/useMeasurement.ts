import { useStore } from "../store/store";

/**
 * Reads a single telemetry measurement from the store.
 * Both board and id must match what the backend sends in `measurementUpdates`.
 * Use the BOARDS and per-board constants from `constants/measurements.ts`.
 */
const useMeasurement = (board: string, id: string) =>
  useStore((s) => s.getMeasurement(board, id));

export default useMeasurement;
