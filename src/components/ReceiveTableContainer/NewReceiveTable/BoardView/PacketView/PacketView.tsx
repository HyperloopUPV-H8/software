import { Packet } from "common";
import styles from "./PacketView.module.scss";
import { MeasurementView } from "./MeasurementView/MeasurementView";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { HexValue } from "./HexValue/HexValue";
import { memo } from "react";

type Props = {
    packetId: number;
};

function packetSelector(state: RootState, packetId: number): Packet {
    const board = state.podData.packetToBoard[packetId];
    return state.podData.boards[board].packets[packetId];
}

export const PacketView = memo(({ packetId }: Props) => {
    const packet = useSelector((state: RootState) =>
        packetSelector(state, packetId)
    );

    const items = [packet.id, packet.name, packet.count, packet.cycleTime];

    const columns = useSelector((state: RootState) => state.columns);

    return (
        <div className={styles.packetView}>
            <div className={styles.data}>
                {items.map((item, index) => {
                    return (
                        <div style={{ flexBasis: columns[index] }}>{item}</div>
                    );
                })}
            </div>
            <div className={styles.body}>
                <HexValue hex={packet.hexValue}></HexValue>
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
            </div>
        </div>
    );
});
