import { Packet } from "@models/PodData/Packet";
import styles from "@components/PacketTable/ReceiveTable/PacketRow.module.scss";
import { MeasurementRow } from "@components/PacketTable/ReceiveTable/MeasurementRow";
type Props = {
  packet: Packet;
};

export const PacketRow = ({ packet }: Props) => {
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
