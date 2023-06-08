import { useLayoutEffect, useRef, useContext } from "react";
import { TableContext } from "components/ReceiveTable/TableUpdater";

//TODO: receive just one id prop, or, even better, a getValue function (make it decoupled from store basically)
export function useUpdater(
    boardId: string,
    measId: string,
    initialValue: string
) {
    const updater = useContext(TableContext);
    const valueRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const valueNode = document.createTextNode(initialValue);
        valueRef.current?.appendChild(valueNode);

        updater.addMeasurement({
            boardId: boardId,
            measId: measId,
            value: valueNode,
        });

        return () => {
            updater.removeMeasurement(boardId, measId);
            valueRef.current!.removeChild(valueNode);
        };
    }, []);

    return { valueRef };
}
