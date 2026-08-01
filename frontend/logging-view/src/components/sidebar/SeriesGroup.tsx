// Sidebar group for selecting which measurement series to display.
// Visible only after a session folder is loaded.
// Boards are collapsible sections; each measurement shows name, type, units, and packet frequency.
// Series keys use the format "BOARD/measurementId". Rows are also draggable
// (dnd-kit) onto a plot card to assign them — see useSignalDnd.ts.
import { useDraggable } from "@dnd-kit/core";
import {
  Badge,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components";
import { ChevronRight, GripVertical } from "@workspace/ui/icons";
import { cn, getTypeBadgeClass } from "@workspace/ui/lib";
import type { AdjMeasurement, AdjPacket } from "../../types/session";
import { useStore } from "../../store/store";

// Converts a packet period+unit to a compact display string (e.g. "500 µs", "2 ms").
const formatPeriod = (period?: number, unit?: string): string | null => {
  if (!period || !unit) return null;
  const u = unit.toLowerCase();
  if (u === "us") return period >= 1000 ? `${period / 1000} ms` : `${period} µs`;
  if (u === "ms") return period >= 1000 ? `${period / 1000} s` : `${period} ms`;
  return `${period} ${unit}`;
};

interface SeriesRowProps {
  dragKey: string; // "BOARD/measId"
  measId: string;
  checked: boolean;
  meta?: AdjMeasurement;
  period: string | null;
  onToggle: () => void;
  /** Ids to drag when a drag starts from this row (whole selection, or just this row). */
  dragIds: string[];
}

// Own component (not inlined in the .map() below) because useDraggable is a
// hook — it must be called once per row, not once for the whole list.
function SeriesRow({ dragKey, measId, checked, meta, period, onToggle, dragIds }: SeriesRowProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragKey,
    data: { ids: dragIds },
  });

  const label = meta?.name ?? measId;
  const displayUnits = meta?.displayUnits;
  const isEnum = meta?.type === "enum";

  return (
    <SidebarMenuSubItem>
      {/* SidebarMenuSubButton/Item are plain function components (no ref
          forwarding) — the drag ref/listeners go on this wrapping div instead;
          it's a no-op for layout (Tailwind's group/peer selectors used by the
          sidebar primitives are descendant-based, unaffected by the extra nesting). */}
      <div ref={setNodeRef} {...attributes} {...listeners} className={cn(isDragging && "opacity-30")}>
      <SidebarMenuSubButton
        onClick={onToggle}
        className="group/row h-auto min-w-0 cursor-grab gap-2 py-1.5 active:cursor-grabbing"
      >
        <Checkbox
          checked={checked}
          onCheckedChange={onToggle}
          className="pointer-events-none size-3.5 shrink-0"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          {/* Measurement name, falls back to raw ID */}
          <span className="truncate text-xs">{label}</span>

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px]">
            {/* Data type */}
            {meta?.type && (
              <Badge
                variant="secondary"
                className={cn(
                  "shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase leading-none",
                  getTypeBadgeClass(meta.type),
                )}
              >
                {meta.type}
              </Badge>
            )}
            {/* Display units */}
            {displayUnits && (
              <span className="truncate">{displayUnits}</span>
            )}
            {/* Enum value count */}
            {isEnum && meta.enumValues && meta.enumValues.length > 0 && (
              <span className="opacity-60">{meta.enumValues.length} values</span>
            )}
            {/* Packet update period */}
            {period && (
              <span className="text-muted-foreground/60 font-mono">
                {period}
              </span>
            )}
          </div>

          {/* Enum value list for quick reference */}
          {isEnum && meta?.enumValues && meta.enumValues.length > 0 && (
            <span className="text-muted-foreground/50 truncate text-[9px]">
              {meta.enumValues.join(" · ")}
            </span>
          )}
        </div>

        <GripVertical className="text-muted-foreground/40 ml-auto size-3 shrink-0 opacity-0 transition-opacity group-hover/row:opacity-100" />
      </SidebarMenuSubButton>
      </div>
    </SidebarMenuSubItem>
  );
}

const SeriesGroup = () => {
  const availableSeries = useStore((s) => s.availableSeries);
  const adjData = useStore((s) => s.adjData);
  const selectedSeries = useStore((s) => s.selectedSeries);
  const toggleSeries = useStore((s) => s.toggleSeries);

  const boards = Object.keys(availableSeries);
  if (boards.length === 0) return null;

  const totalSelectedCount = Object.values(selectedSeries).filter(Boolean).length;

  // Build measurement metadata and packet-frequency lookups from the ADJ archive.
  // Archive structure: boards[boardName][`${boardName}_measurements`] = AdjMeasurement[]
  //                    boards[boardName]["packets"] = AdjPacket[]
  const measurementMeta: Record<string, AdjMeasurement> = {};
  // Key: "BOARD/measId" → packet for that measurement
  const measPacket: Record<string, AdjPacket> = {};

  if (adjData) {
    for (const [boardName, boardGroup] of Object.entries(adjData.boards)) {
      const group = boardGroup as Record<string, unknown>;

      const measurements = group[`${boardName}_measurements`];
      if (Array.isArray(measurements)) {
        for (const meas of measurements) {
          if (typeof meas === "object" && meas !== null && "id" in meas) {
            measurementMeta[(meas as AdjMeasurement).id] = meas as AdjMeasurement;
          }
        }
      }

      const packets = group["packets"];
      if (Array.isArray(packets)) {
        for (const pkt of packets as AdjPacket[]) {
          for (const varId of pkt.variables ?? []) {
            measPacket[`${boardName}/${varId}`] = pkt;
          }
        }
      }
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Series</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {boards.map((boardName) => {
            const measurements = availableSeries[boardName];
            const selectedCount = measurements.filter(
              (id) => selectedSeries[`${boardName}/${id}`],
            ).length;

            return (
              <Collapsible key={boardName} defaultOpen={false} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={boardName}>
                      <ChevronRight className="size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      <span className="font-medium">{boardName}</span>
                      {selectedCount > 0 && (
                        <span className="bg-primary text-primary-foreground ml-auto rounded-full px-1.5 py-0.5 text-xs leading-none">
                          {selectedCount}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub
                      className={cn(
                        "max-h-72 overflow-y-auto pr-0.5",
                        // Soft fade at the top/bottom edges — a lightweight,
                        // JS-free hint that the list keeps going, instead of
                        // an abrupt hard-clip when a board has many rows.
                        "[-webkit-mask-image:linear-gradient(to_bottom,transparent,black_8px,black_calc(100%-8px),transparent)]",
                        "[mask-image:linear-gradient(to_bottom,transparent,black_8px,black_calc(100%-8px),transparent)]",
                      )}
                    >
                      {[...measurements]
                        .sort((a, b) =>
                          (measurementMeta[a]?.name ?? a).localeCompare(measurementMeta[b]?.name ?? b),
                        )
                        .map((measId) => {
                        const key = `${boardName}/${measId}`;
                        const checked = !!selectedSeries[key];
                        const meta = measurementMeta[measId];
                        const pkt = measPacket[key];
                        const period = formatPeriod(pkt?.period, pkt?.period_type);
                        // Dragging a checked row while others are also checked
                        // drags the whole selection (Explorer/Finder-style
                        // multi-drag); otherwise just this row.
                        const dragIds = checked && totalSelectedCount > 1
                          ? Object.keys(selectedSeries).filter((k) => selectedSeries[k])
                          : [key];

                        return (
                          <SeriesRow
                            key={measId}
                            dragKey={key}
                            measId={measId}
                            checked={checked}
                            meta={meta}
                            period={period}
                            onToggle={() => toggleSeries(key)}
                            dragIds={dragIds}
                          />
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SeriesGroup;
