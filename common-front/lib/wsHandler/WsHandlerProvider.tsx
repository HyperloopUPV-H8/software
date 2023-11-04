import { ReactNode, createContext } from "react";
import { WsHandler } from "./WsHandler";

export const WsHandlerContext = createContext<WsHandler | null>(null);

type Props = {
    handler: WsHandler;
    children: ReactNode;
};

export const WsHandlerProvider = ({ handler, children }: Props) => {
    return (
        <WsHandlerContext.Provider value={handler}>
            {children}
        </WsHandlerContext.Provider>
    );
};
