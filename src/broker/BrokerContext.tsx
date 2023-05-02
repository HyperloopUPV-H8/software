import { createContext } from "react";
import * as React from "react";
import { Broker } from "./Broker";

export const BrokerContext = createContext<Broker | undefined>(undefined);

type Props = {
    broker: Broker;
    children: React.ReactNode;
};

export const BrokerProvider = ({ broker, children }: Props) => {
    return (
        <BrokerContext.Provider value={broker}>
            {children}
        </BrokerContext.Provider>
    );
};
