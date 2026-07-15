import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components";
import { Check, Send } from "@workspace/ui/icons";
import { useState } from "react";
import useSendOrder from "../../../hooks/useSendOrder";
import useMeasurement from "../../../hooks/useMeasurement";
import type { CommandCatalogItem } from "../../../types/catalog";
import { BOARDS, VCU } from "../../../constants/measurements";
import { isVcuOrderAllowedInState } from "../../../constants/vcuStateMachine";

interface OrderRowProps {
  item: CommandCatalogItem;
  /** Name of the board this order belongs to, as reported by the catalog. */
  board: string;
  isConnected: boolean;
}

/**
 * Classic catalog-style order row: name + id badge, with an outline
 * Send button (used in the Orders side sheet — the always-visible
 * dashboard Orders panel uses the colour-coded grid instead, see
 * OrdersList.tsx/OrderButton.tsx).
 *
 * - Send is disabled while the WS is disconnected, or (for VCU orders) the
 *   current vehicle state doesn't allow it — either way a tooltip explains why.
 * - After a successful dispatch the button briefly shows a checkmark.
 */
const OrderRow = ({ item, board, isConnected }: OrderRowProps) => {
  const sendOrder = useSendOrder();
  const vcuState  = useMeasurement(BOARDS.VCU, VCU.state);

  const [sent, setSent] = useState(false);

  // Only VCU orders are gated by the vehicle state machine.
  const stateAllowsOrder =
    board !== BOARDS.VCU || isVcuOrderAllowedInState(item.id, vcuState as string | undefined);

  const canSend = isConnected && !sent && stateAllowsOrder;

  const handleSend = () => {
    if (!canSend) return;
    sendOrder([{ id: item.id, fields: {} }]);
    setSent(true);
    setTimeout(() => setSent(false), 1500);
  };

  const sendButton = (
    <Button
      size="sm"
      variant={sent ? "default" : "outline"}
      disabled={!canSend}
      onClick={handleSend}
      className={sent ? "border-green-500 bg-green-500 text-white hover:bg-green-600" : ""}
    >
      {sent ? <Check className="mr-1 size-3" /> : <Send className="mr-1 size-3" />}
      {sent ? "Sent" : "Send"}
    </Button>
  );

  const sendButtonWithTooltip = !isConnected ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{sendButton}</span>
      </TooltipTrigger>
      <TooltipContent>Not connected to backend</TooltipContent>
    </Tooltip>
  ) : !stateAllowsOrder ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{sendButton}</span>
      </TooltipTrigger>
      <TooltipContent>Not available in current vehicle state{vcuState ? ` (${vcuState})` : ""}</TooltipContent>
    </Tooltip>
  ) : (
    sendButton
  );

  return (
    <div className="flex items-center justify-between gap-3 border-b px-4 py-2 last:border-0">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-foreground truncate text-sm font-medium">{item.name}</span>
        <Badge variant="outline" className="shrink-0 font-mono text-xs">{item.id}</Badge>
      </div>
      {sendButtonWithTooltip}
    </div>
  );
};

export default OrderRow;
