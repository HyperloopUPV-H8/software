import styles from "@components/ChartMenu/Chart/Legend/LegendItem.module.scss";

type Props = {
  name: string;
};

export const LegendItem = ({ name }: Props) => {
  return (
    <div id={styles.wrapper}>
      <div id={styles.lineColor}></div>
      {name}
    </div>
  );
};
