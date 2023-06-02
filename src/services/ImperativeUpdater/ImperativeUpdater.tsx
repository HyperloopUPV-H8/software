import { store } from "store";
import React, { createContext, useCallback, useRef } from "react";
import { isNumericMeasurement } from "common";
import { useGlobalTicker } from "hooks/GlobalTicker/useGlobalTicker";

export type Handler = (value: any) => void;

type Updater = {
    add: (id: string, receiver: Handler) => void;
    remove: (id: string, receiver: Handler) => void;
};

export const ImperativeUpdaterContext = createContext<Updater>({
    add() {},
    remove() {},
});

type Props = {
    children?: React.ReactNode;
};

type Id = string;

type IdToNodes = Record<Id, Handler[] | undefined>;

export const ImperativeUpdater = ({ children }: Props) => {
    const idToNodes = useRef<IdToNodes>({});

    const updateNodes = useCallback(() => {
        const measurements = store.getState().measurements;

        for (const id in idToNodes.current) {
            for (const receiver of idToNodes.current[id] ?? []) {
                const measurement = measurements[id];

                const comparation = isNumericMeasurement(measurement);

                const newValue = comparation
                    ? measurement.value.average.toFixed(2)
                    : measurement.value.toString();

                receiver(newValue);
            }
        }
    }, []);

    useGlobalTicker(updateNodes);

    return (
        <ImperativeUpdaterContext.Provider
            value={{
                add: (id, node) => {
                    if (!idToNodes.current[id]) {
                        idToNodes.current[id] = [];
                    }

                    idToNodes.current[id]!.push(node);
                },
                remove: (id, node) => {
                    idToNodes.current[id] = idToNodes.current[id]?.filter(
                        (item) => item != node
                    );
                },
            }}
        >
            {children}
        </ImperativeUpdaterContext.Provider>
    );
};
