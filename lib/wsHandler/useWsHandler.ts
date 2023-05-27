import { useContext } from "react";
import { WsHandlerContext } from "./WsHandlerContext";

export function useWsHandler() {
    return useContext(WsHandlerContext)!;
}
