import { Packet } from "@models/PodData/Packet";
import styles from "@components/ReceiveTable/PacketRow/PacketRow.module.scss";
import { MeasurementRow } from "@components/ReceiveTable/MeasurementRow/MeasurementRow";
import { memo } from "react";

type Props = {
  packet: Packet;
};

const PacketRow = ({ packet }: Props) => {
  return (
    <>
      <tr className={styles.packetRow}>
        <td>{packet.id}</td>
        <td>{packet.name}</td>
        <td>{packet.hexValue}</td>
        <td>{packet.count}</td>
        <td>{packet.cycleTime}</td>
      </tr>
      {Object.values(packet.measurements).map((measurement) => {
        return (
          <MeasurementRow
            key={measurement.name}
            measurement={measurement}
          ></MeasurementRow>
        );
      })}
    </>
  );
};

export default memo(PacketRow);
