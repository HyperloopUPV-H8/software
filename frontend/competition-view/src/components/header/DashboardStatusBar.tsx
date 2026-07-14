import { Button, Separator, Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components";
import { AlertTriangle, Square, Unplug } from "@workspace/ui/icons";
import { formatAxisValue } from "../../constants/chartConfig";
import { BOARDS, HVAL_THRESHOLD_V, HVBMS, VCU } from "../../constants/measurements";
import {
  BRAKE_ORDERS,
  EMERGENCY_STOP_ORDERS,
  OPEN_CONTACTORS_ORDERS,
} from "../../constants/orders";
import { useIsStale } from "../../hooks/useIsStale";
import useMeasurement from "../../hooks/useMeasurement";
import useSendOrder from "../../hooks/useSendOrder";
import { STALE_BADGE_CLASS, STALE_TEXT_CLASS } from "../../lib/freshness";
import { stateBadgeClass } from "../../lib/stateColor";

/* ─── Icon-only order button (half the footprint of a labelled button) ──── */

const OrderIconButton = ({
  label,
  className,
  onClick,
  children,
}: {
  label: string;
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button size="icon" variant="outline" onClick={onClick} aria-label={label} className={className}>
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

/* ─── Shared vertical rhythm for the status blocks ───────────────────────── */

const VDivider = () => <Separator orientation="vertical" className="data-[orientation=vertical]:h-6" />;

const StatBlock = ({ heading, children }: { heading: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-muted-foreground text-xs leading-none font-medium uppercase tracking-widest">
      {heading}
    </span>
    {/* Fixed-height value row so a bare text value and a bordered badge line up identically. */}
    <div className="flex h-8 items-center">{children}</div>
  </div>
);

const StatValue = ({
  value,
  valueClass = "text-foreground",
  width,
}: {
  value: string;
  valueClass?: string;
  /** Fixed width so a longer/shorter value doesn't shift the elements after it. */
  width?: string;
}) => (
  <div className={`${width} overflow-hidden`}>
    <span className={`block w-fit max-w-full truncate text-base font-bold leading-tight ${valueClass}`}>{value}</span>
  </div>
);

/* ─── DashboardStatusBar ─────────────────────────────────────────────────── */

const DashboardStatusBar = () => {
  const sendOrder = useSendOrder();

  const state    = useMeasurement(BOARDS.VCU, VCU.state);
  const brakeRaw = useMeasurement(BOARDS.VCU, VCU.activeBrakes);
  const dcLinkV  = useMeasurement(BOARDS.HVBMS, HVBMS.voltageReading) as number | undefined;

  const stateStale  = useIsStale(BOARDS.VCU, VCU.state);
  const brakeStale  = useIsStale(BOARDS.VCU, VCU.activeBrakes);
  const dcLinkStale = useIsStale(BOARDS.HVBMS, HVBMS.voltageReading);

  const dcLinkActive = dcLinkV !== undefined && dcLinkV > HVAL_THRESHOLD_V;
  const dcLinkClass = dcLinkStale
    ? STALE_TEXT_CLASS
    : dcLinkV === undefined
      ? "text-muted-foreground"
      : dcLinkActive ? "text-red-500" : "text-green-500";

  const brakeLabel = brakeRaw === undefined ? "—" : brakeRaw ? "BRAKED" : "UNBRAKED";
  const brakeClass =
    brakeStale         ? STALE_TEXT_CLASS :
    brakeRaw === true  ? "text-red-500"  :
    brakeRaw === false ? "text-blue-500" :
    "text-muted-foreground";

  return (
    <div className="flex items-center gap-3">
      <StatBlock heading="DC Link">
        <StatValue value={dcLinkV !== undefined ? `${formatAxisValue(dcLinkV)} V` : "—"} valueClass={dcLinkClass} width="w-28" />
      </StatBlock>

      <VDivider />

      <StatBlock heading="Vehicle State">
        {/* Fixed-width slot so a longer/shorter state string doesn't shift the elements after it. */}
        <div className="w-44 overflow-hidden">
          <span className={`inline-block max-w-full truncate rounded-md border px-2.5 py-1 text-base font-bold leading-tight ${stateStale ? STALE_BADGE_CLASS : stateBadgeClass(state)}`}>
            {state !== undefined ? String(state) : "—"}
          </span>
        </div>
      </StatBlock>

      <VDivider />

      <StatBlock heading="Brake">
        <StatValue value={brakeLabel} valueClass={brakeClass} width="w-24" />
      </StatBlock>

      <VDivider />

      <div className="flex items-center gap-1">
        <OrderIconButton label="Brake" onClick={() => sendOrder(BRAKE_ORDERS)}>
          <Square className="size-5" />
        </OrderIconButton>

        <OrderIconButton
          label="Open Contactors"
          className="border-amber-500 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
          onClick={() => sendOrder(OPEN_CONTACTORS_ORDERS)}
        >
          <Unplug className="size-5" />
        </OrderIconButton>

        <OrderIconButton
          label="Emergency Stop"
          className="border-red-500 text-red-600 hover:bg-red-500/10 dark:text-red-400"
          onClick={() => sendOrder(EMERGENCY_STOP_ORDERS)}
        >
          <AlertTriangle className="size-5" />
        </OrderIconButton>
      </div>
    </div>
  );
};

export default DashboardStatusBar;
