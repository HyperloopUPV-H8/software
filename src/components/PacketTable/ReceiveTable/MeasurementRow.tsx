import { Measurement } from "@models/PodData/Measurement";
import styles from "@components/PacketTable/ReceiveTable/MeasurementRow.module.scss";
type Props = {
  measurement: Measurement;
};

export const MeasurementRow = ({ measurement }: Props) => {
  return (
    <tr>
      <td colSpan={5}>
        <div className={styles.measurementWrapper}>
          <div>{measurement.name}</div>
          <div>{measurement.value}</div>
          <div>{measurement.units}</div>
        </div>
      </td>
    </tr>
  );
};
