import { Packet } from "@models/PodData/Packet";
import styles from "@components/ReceiveTable/PacketRow/PacketRow.module.scss";
import { MeasurementRow } from "@components/ReceiveTable/MeasurementRow/MeasurementRow";
import { memo, useRef, useEffect } from "react";
type Props = {
  packet: Packet;
  scrollContainer: HTMLDivElement;
  style: React.CSSProperties;
};

const PacketRow = ({ packet, scrollContainer, style }: Props) => {
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
      <div className={styles.measurements}>
        {Object.values(packet.measurements).map((measurement) => {
          return (
            <MeasurementRow
              key={measurement.name}
              measurement={measurement}
            ></MeasurementRow>
          );
        })}
      </div>
    </div>
  );
};

export default memo(PacketRow);
