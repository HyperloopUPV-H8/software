import { Packet } from "common";
import styles from "./PacketView.module.scss";
import { MeasurementView } from "./MeasurementView/MeasurementView";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { HexValue } from "./HexValue/HexValue";

type Props = {
    packetId: number;
};

function packetSelector(state: RootState, packetId: number): Packet {
    const board = state.podData.packetToBoard[packetId];
    return state.podData.boards[board].packets[packetId];
}

export const PacketView = ({ packetId }: Props) => {
    const packet = useSelector((state: RootState) =>
        packetSelector(state, packetId)
    );
    const columns = useSelector((state: RootState) => state.columns);

    return (
        <div className={styles.packetView}>
            <div className={styles.data}>
                <div style={{ flexBasis: columns[0] }}>{packet.id}</div>
                <div style={{ flexBasis: columns[1] }}>{packet.name}</div>
                <div style={{ flexBasis: columns[2] }}>{packet.count}</div>
                <div style={{ flexBasis: columns[3] }}>{packet.cycleTime}</div>
            </div>
            <div className={styles.body}>
                <HexValue hex={packet.hexValue}></HexValue>
                <div className={styles.measurements}>
                    {Object.values(packet.measurements).map((measurement) => {
                        return (
                            <MeasurementView
                                key={measurement.id}
                                id={measurement.id}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
