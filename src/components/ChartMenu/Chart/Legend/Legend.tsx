import styles from "@components/ChartMenu/Chart/Legend/Legend.module.scss";
import { LegendItem } from "@components/ChartMenu/Chart/Legend/LegendItem";

type Props = {
  names: string[];
};

export const Legend = ({ names }: Props) => {
  return (
    <div id={styles.wrapper}>
      {names.map((name) => {
        return <LegendItem key={name} name={name} />;
      })}
    </div>
  );
};
