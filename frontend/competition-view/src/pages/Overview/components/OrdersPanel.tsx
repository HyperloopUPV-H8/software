import { InputGroup, InputGroupInput, Skeleton } from "@workspace/ui/components";
import { useWebSocket } from "@workspace/ui/hooks";
import { useState } from "react";
import useOrdersCatalog from "../../../hooks/useOrdersCatalog";
import { useStore } from "../../../store/store";
import BoardSection from "../../Orders/components/BoardSection";

const OrdersPanel = () => {
  const { isConnected } = useWebSocket();
  const boards          = useStore((s) => s.boards);
  const commandsCatalog = useStore((s) => s.commandsCatalog);
  const [filter, setFilter] = useState("");

  const { loading } = useOrdersCatalog(isConnected);

  return (
    <div className="bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border shadow-sm">
      <div className="flex shrink-0 items-center gap-2 border-b px-3 py-2">
        <span className="text-muted-foreground flex-1 text-xs font-medium uppercase tracking-widest">
          Orders
        </span>
        <InputGroup className="w-32">
          <InputGroupInput
            placeholder="Search…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-6 py-0 text-xs"
          />
        </InputGroup>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-2 p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : boards.length === 0 ? (
          <p className="text-muted-foreground flex h-full items-center justify-center text-xs">
            No orders available
          </p>
        ) : (
          <div className="flex flex-col gap-1.5 p-2">
            {boards.map((boardName) => {
              const board = commandsCatalog[boardName];
              if (!board) return null;
              return (
                <BoardSection
                  key={boardName}
                  board={board}
                  filter={filter}
                  isConnected={isConnected}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPanel;
