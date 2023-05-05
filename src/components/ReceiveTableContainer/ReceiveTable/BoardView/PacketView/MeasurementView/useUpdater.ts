import { useLayoutEffect, useRef, useContext } from "react";
import { TableContext } from "components/ReceiveTableContainer/ReceiveTable/TableUpdater";

export function useUpdater(id: string, initialValue: string) {
    const updater = useContext(TableContext);
    const valueRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const valueNode = document.createTextNode(initialValue);
        valueRef.current?.appendChild(valueNode);

        updater.addMeasurement(id, {
            value: valueNode,
        });

        return () => {
            updater.removeMeasurement(id);
            valueRef.current!.removeChild(valueNode);
        };
    }, []);

    return { valueRef };
}
