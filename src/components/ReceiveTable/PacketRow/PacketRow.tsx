import { Packet } from "models/PodData/Packet";
import styles from "components/ReceiveTable/PacketRow/PacketRow.module.scss";
import { MeasurementRow } from "components/ReceiveTable/MeasurementRow/MeasurementRow";
import { memo, useRef, useEffect } from "react";
import { Measurement } from "models/PodData/Measurement";
type Props = {
    packet: Packet;
    style: React.CSSProperties;
};

const Measurements = ({
    measurements,
}: {
    measurements: { [name: string]: Measurement };
}) => {
    return (
        <div className={styles.measurements}>
            {Object.values(measurements).map((measurement) => {
                return (
                    <MeasurementRow
                        key={measurement.name}
                        measurement={measurement}
                    ></MeasurementRow>
                );
            })}
        </div>
    );
};

const PacketRow = ({ packet, style }: Props) => {
    let packetContainer = useRef<HTMLDivElement>(null);

    return (
        <div className={styles.wrapper} ref={packetContainer} style={style}>
            <div className={`${styles.packetInfo} tableRow`}>
                <div>{packet.id}</div>
                <div>{packet.name}</div>
                <div>{packet.hexValue}</div>
                <div>{packet.count}</div>
                <div>{packet.cycleTime}</div>
            </div>
            <Measurements measurements={packet.measurements} />
        </div>
    );
};

export default memo(PacketRow);
