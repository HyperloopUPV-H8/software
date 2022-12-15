import styles from "@components/ChartMenu/Chart/Legend/LegendItem/LegendItem.module.scss";
import { HSLColor, hslToHex } from "@utils/color";
import { MdClose } from "react-icons/md";
type Props = {
  data: LegendItemData;
  removeItem: () => void;
};

export type LegendItemData = {
  name: string;
  color: HSLColor;
};

export const LegendItem = ({ data, removeItem }: Props) => {
  let hexColor = hslToHex(data.color);
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.lineColor}
        style={{ backgroundColor: `#${hexColor.r}${hexColor.g}${hexColor.b}` }}
      ></div>
      <div className={styles.name}>{data.name}</div>
      <div className={styles.removeBtn} onClick={removeItem}>
        <MdClose />
      </div>
    </div>
  );
};
