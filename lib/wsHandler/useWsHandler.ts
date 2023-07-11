import { useContext } from "react";
import { WsHandlerContext } from "./WsHandlerProvider";

export function useWsHandler() {
    return useContext(WsHandlerContext)!;
}
