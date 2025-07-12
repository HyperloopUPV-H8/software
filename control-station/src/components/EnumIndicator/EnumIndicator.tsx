import { useGlobalTicker, useMeasurementsStore } from "common";
import styles from "./EnumIndicator.module.scss";
import { memo, useContext, useState } from "react";
import { LostConnectionContext } from "services/connections";

interface Props {
  measurementId: string;
  icon: string;
}

export const EnumIndicator = memo(({ measurementId, icon }: Props) => {
  const getValue = useMeasurementsStore(
    (state) => state.getEnumMeasurementInfo(measurementId).getUpdate,
  );

  const lostConnection = useContext(LostConnectionContext);

  const [variant, setVariant] = useState(getValue());
  const state = lostConnection ? "DISCONNECTED" : variant;

  useGlobalTicker(() => {
    setVariant(getValue());
  });

  return (
    <div
      className={styles.enum_indicator}
      style={{
        backgroundColor:
          enumToColor[state.toUpperCase()] || enumToColor.default,
      }}
    >
      <img className={styles.icon} src={icon} />

      <p className={styles.title}>{lostConnection ? "DISCONNECTED" : state}</p>

      <img className={styles.icon} src={icon} />
    </div>
  );
});

const enumToColor: { [key: string]: string } = {
    'DISCONNECTED': "#cccccc",
    'NOT_CHARGING' : '#EBF6FF',
    'CHARGING' : '#F583F8',
    'CHARGED' : '#FBD15B',

    'HV OPEN' : '#83C0F8',
    'HV CLOSED' : '#ACF293',

    'OPEN' : '#83C0F8',
    'PRECHARGE' : '#BB83F8',
    'CLOSED' : '#ACF293',
    'CLOSE' : '#ACF293',

    'DISENGAGED' : '#FBD15B',
    'ENGAGED' : '#ACF293',
    'FAULT': "#EF9A87",

  default: "#EBF6FF",
};
