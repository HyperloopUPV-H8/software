import { Packet } from "common";
import styles from "./PacketView.module.scss";
import { MeasurementView } from "./MeasurementView/MeasurementView";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { memo, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { TableContext } from "components/ReceiveTableContainer/ReceiveTable/TableUpdater";
import { useUpdater } from "./useUpdater";

type Props = {
    packet: Packet;
};

export const PacketView = memo(({ packet }: Props) => {
    const columns = useSelector((state: RootState) => state.columns);

    const { countRef, cycleTimeRef } = useUpdater(packet);

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
