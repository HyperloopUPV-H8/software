import { Badge } from "@workspace/ui/components";

interface ConnectionBadgeProps {
  /** Clear label identifying what this badge reports on, e.g. "Backend" or "VCU". */
  label: string;
  connected: boolean;
}

const ConnectionBadge = ({ label, connected }: ConnectionBadgeProps) => (
  // Fixed-width slot: "Connected" vs "Disconnected" differ in length, so without
  // this the badge (and anything after it) would shift as connection state changes.
  // Wide enough for the longest case, e.g. "Backend: Disconnected".
  <div className="w-48">
    <Badge
      variant="outline"
      className={`w-fit gap-1.5 px-2.5 py-1 text-sm whitespace-nowrap ${
        connected
          ? "border-green-500 text-green-600 dark:text-green-400"
          : "border-red-500 text-red-600 dark:text-red-400"
      }`}
    >
      <span
        className={`size-2 rounded-full ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {label}: {connected ? "Connected" : "Disconnected"}
    </Badge>
  </div>
);

export default ConnectionBadge;
