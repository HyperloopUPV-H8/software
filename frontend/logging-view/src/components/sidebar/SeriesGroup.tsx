// Sidebar group for selecting which measurement series to display.
// Visible only after a session folder is loaded.
// Boards are collapsible sections; each measurement shows name, type, units, and packet frequency.
// Series keys use the format "BOARD/measurementId".
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
import { ChevronRight } from "@workspace/ui/icons";
import { cn, getTypeBadgeClass } from "@workspace/ui/lib";
import { encodeSignalIds, SIGNAL_IDS_MIME } from "../../lib/plotStudio/dnd";
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

const SeriesGroup = () => {
  const availableSeries = useStore((s) => s.availableSeries);
  const adjData = useStore((s) => s.adjData);
  const selectedSeries = useStore((s) => s.selectedSeries);
  const toggleSeries = useStore((s) => s.toggleSeries);

  const boards = Object.keys(availableSeries);
  if (boards.length === 0) return null;

  const totalSelectedCount = Object.values(selectedSeries).filter(Boolean).length;

  // Dragging a checked row while others are also checked drags the whole
  // selection (Explorer/Finder-style multi-drag); otherwise just this row.
  const handleDragStart = (e: React.DragEvent, key: string) => {
    const ids = selectedSeries[key] && totalSelectedCount > 1
      ? Object.keys(selectedSeries).filter((k) => selectedSeries[k])
      : [key];
    e.dataTransfer.setData(SIGNAL_IDS_MIME, encodeSignalIds(ids));
    e.dataTransfer.effectAllowed = "copy";
  };

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
                    <SidebarMenuSub>
                      {[...measurements]
                        .sort((a, b) =>
                          (measurementMeta[a]?.name ?? a).localeCompare(measurementMeta[b]?.name ?? b),
                        )
                        .map((measId) => {
                        const key = `${boardName}/${measId}`;
                        const checked = !!selectedSeries[key];
                        const meta = measurementMeta[measId];
                        const label = meta?.name ?? measId;
                        const displayUnits = meta?.displayUnits;
                        const pkt = measPacket[key];
                        const period = formatPeriod(pkt?.period, pkt?.period_type);
                        const isEnum = meta?.type === "enum";

                        return (
                          <SidebarMenuSubItem key={measId}>
                            <SidebarMenuSubButton
                              onClick={() => toggleSeries(key)}
                              draggable
                              onDragStart={(e) => handleDragStart(e, key)}
                              className="h-auto min-w-0 cursor-grab gap-2 py-1.5 active:cursor-grabbing"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() => toggleSeries(key)}
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
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
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
