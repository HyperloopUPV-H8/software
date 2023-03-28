import { Packet } from "models/PodData/Packet";
import styles from "./PacketRow.module.scss";
import { MeasurementRows } from "./MeasurementRows/MeasurementRows";
import { Measurement } from "models/PodData/Measurement";
import { memo, useRef, useEffect } from "react";
type Props = {
    packet: Packet;
    style: React.CSSProperties;
};

const PacketRow = ({ packet, style }: Props) => {
    let packetContainer = useRef<HTMLDivElement>(null);

    return (
        <div
            className={styles.wrapper}
            ref={packetContainer}
            style={style}
        >
            <div className={`${styles.packetInfo} tableRow`}>
                <div>{packet.id}</div>
                <div>{packet.name}</div>
                <div className={styles.hexValue}>{packet.hexValue}</div>
                <div>{packet.count}</div>
                <div>{packet.cycleTime}</div>
            </div>
            <MeasurementRows measurements={packet.measurements} />
        </div>
    );
};

export default memo(PacketRow);
