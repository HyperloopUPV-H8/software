import { Packet } from "common";
import styles from "./PacketView.module.scss";
import { MeasurementView } from "./MeasurementView/MeasurementView";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { memo, useContext, useEffect, useLayoutEffect, useRef } from "react";
import {
    PacketElement,
    TableContext,
} from "components/ReceiveTableContainer/ImperativeReceiveTable/TableUpdater";

type Props = {
    packet: Packet;
};

function packetSelector(state: RootState, packetId: number): Packet {
    const board = state.podData.packetToBoard[packetId];
    return state.podData.boards[board].packets[packetId];
}

export const PacketView = memo(({ packet }: Props) => {
    const updater = useContext(TableContext);
    const columns = useSelector((state: RootState) => state.columns);

    const countRef = useRef<HTMLDivElement>(null);
    const cycleTimeRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const countNode = document.createTextNode(packet.count.toFixed(2));
        const cycleTimeNode = document.createTextNode(
            packet.cycleTime.toFixed(0)
        );

        countRef.current!.appendChild(countNode);
        cycleTimeRef.current!.appendChild(cycleTimeNode);

        updater.addPacket(packet.id, {
            count: countNode,
            cycleTime: cycleTimeNode,
        });

        return () => {
            updater.removePacket(packet.id);

            countRef.current!.removeChild(countNode);
            cycleTimeRef.current!.removeChild(cycleTimeNode);
        };
    }, []);

    return (
        <div className={styles.packetView}>
            <div className={styles.data}>
                <div style={{ flexBasis: columns[0] }}>{packet.id}</div>
                <div style={{ flexBasis: columns[1] }}>{packet.name}</div>
                <div
                    ref={countRef}
                    className={styles.count}
                    style={{ flexBasis: columns[2] }}
                >
                    {packet.count}
                </div>
                <div
                    ref={cycleTimeRef}
                    className={styles.cycleTime}
                    style={{ flexBasis: columns[3] }}
                >
                    {packet.cycleTime}
                </div>
            </div>
            {Object.keys(packet.measurements).length > 0 && (
                <div className={styles.measurements}>
                    {Object.values(packet.measurements).map((measurement) => {
                        return (
                            <MeasurementView
                                key={measurement.id}
                                measurement={measurement}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
});
