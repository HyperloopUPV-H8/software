import styles from "@components/ChartMenu/Chart/Legend/Legend.module.scss";
import {
  LegendItem,
  LegendItemData,
} from "@components/ChartMenu/Chart/Legend/LegendItem/LegendItem";
import { memo } from "react";
type Props = {
  removeItem: (id: string) => void;
  legendItems: Map<string, LegendItemData>;
};

const Legend = ({ legendItems, removeItem }: Props) => {
  return (
    <div id={styles.wrapper}>
      {Array.from(legendItems.entries()).map(([name, data]) => {
        return (
          <LegendItem
            key={name}
            data={data}
            removeItem={() => {
              removeItem(name);
            }}
          />
        );
      })}
    </div>
  );
};

export default memo(Legend);
