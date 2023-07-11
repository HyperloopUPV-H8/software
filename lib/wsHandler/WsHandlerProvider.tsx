import { createContext } from "react";
import * as React from "react";
import { WsHandler } from "./WsHandler";

export const WsHandlerContext = createContext<WsHandler | null>(null);

type Props = {
    handler: WsHandler;
    children: React.ReactNode;
};

export const WsHandlerProvider = ({ handler, children }: Props) => {
    return (
        <WsHandlerContext.Provider value={handler}>
            {children}
        </WsHandlerContext.Provider>
    );
};
