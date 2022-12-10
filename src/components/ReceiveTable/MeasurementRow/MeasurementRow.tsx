import { Measurement } from "@models/PodData/Measurement";
import styles from "@components/ReceiveTable/MeasurementRow/MeasurementRow.module.scss";
type Props = {
  measurement: Measurement;
};

export const MeasurementRow = ({ measurement }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div>{measurement.name}</div>
      <div>{measurement.value}</div>
      <div>{measurement.units}</div>
    </div>
  );
};
