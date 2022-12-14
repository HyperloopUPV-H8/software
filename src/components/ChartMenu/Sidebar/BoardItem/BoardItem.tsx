import styles from "@components/ChartMenu/Sidebar/BoardItem/BoardItem.module.scss";
import { Board } from "@models/PodData/Board";
import PacketItem from "@components/ChartMenu/Sidebar/PacketItem/PacketItem";
import { TreeNode } from "@components/ChartMenu/TreeNode";
type Props = {
  name: string;
  packetNodes: TreeNode;
};

export const BoardItem = ({ name, packetNodes }: Props) => {
  return (
    <div id={styles.wrapper}>
      <div id={styles.header}>{name}</div>
      <div id={`${styles.packetList} ${styles.treeNode}`}>
        {Object.entries(packetNodes).map(([name, measurementNodes]) => {
          return (
            <PacketItem
              key={name}
              name={name}
              measurementNodes={measurementNodes!}
            />
          );
        })}
      </div>
    </div>
  );
};
