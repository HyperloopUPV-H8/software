import type { BoardOrdersData, CommandCatalogItem } from "../../../types/catalog";
import { BOARDS } from "../../../constants/measurements";
import { VCU_GATED_ORDER_IDS, VCU_PARAMETERIZED_ORDER_IDS } from "../../../constants/vcuStateMachine";
import OrderRow from "./OrderRow";

/** State-machine orders plus their parameterized variants (Propulsion/Static/Dynamic Levitation Parameterized). */
const CATALOG_ORDER_IDS: readonly number[] = [...VCU_GATED_ORDER_IDS, ...VCU_PARAMETERIZED_ORDER_IDS];

interface OrdersCatalogListProps {
  /** Full catalog, keyed by board name (as received from the backend). */
  commandsCatalog: Record<string, BoardOrdersData>;
  filter: string;
  isConnected: boolean;
}

const matchesFilter = (item: CommandCatalogItem, filter: string) => {
  if (!filter) return true;
  const q = filter.toLowerCase();
  return item.name.toLowerCase().includes(q) || String(item.id).includes(q);
};

/**
 * Classic flat catalog list (name + id badge + outline Send button per row,
 * search filtering, expandable parameter forms) — used in the Orders side
 * sheet. Restricted to the orders defined by the vehicle state machine
 * (constants/vcuStateMachine.ts) plus their parameterized variants: no
 * per-board grouping, and orders outside that set (other boards) aren't
 * rendered at all. Every order in the set is always shown; OrderRow
 * disables + tooltips the ones the current vehicle state doesn't allow.
 */
const OrdersCatalogList = ({ commandsCatalog, filter, isConnected }: OrdersCatalogListProps) => {
  const vcuOrders = commandsCatalog[BOARDS.VCU]?.orders ?? [];

  const items = CATALOG_ORDER_IDS
    .map((id) => vcuOrders.find((o) => o.id === id))
    .filter((o): o is CommandCatalogItem => o !== undefined)
    .filter((o) => matchesFilter(o, filter));

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground flex h-full items-center justify-center p-4 text-center text-sm">
        {filter ? "No orders match your search." : "No orders available — check the backend connection."}
      </p>
    );
  }

  return (
    <div className="bg-card rounded-xl border">
      {items.map((order) => (
        <OrderRow key={order.id} item={order} board={BOARDS.VCU} isConnected={isConnected} />
      ))}
    </div>
  );
};

export default OrdersCatalogList;
