import { Packet } from "@models/PodData/Packet";
import styles from "@components/ChartMenu/Sidebar/PacketItem/PacketItem.module.scss";
import MeasurementItem from "@components/ChartMenu/Sidebar/MeasurementItem/MeasurementItem";
import { memo } from "react";
import { TreeNode } from "@components/ChartMenu/TreeNode";

type Props = {
  name: string;
  measurementNodes: TreeNode;
};

const PacketItem = ({ name, measurementNodes }: Props) => {
  return (
    <div id={styles.wrapper} className={`${styles.treeNode}`}>
      <div id={styles.name}>{name}</div>
      <div id={styles.measurementList}>
        {Object.keys(measurementNodes).map((name) => {
          return <MeasurementItem key={name} name={name} />;
        })}
      </div>
    </div>
  );
};

export default PacketItem;
