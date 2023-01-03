import styles from "@components/ChartMenu/Sidebar/Sidebar.module.scss";
import "@components/ChartMenu/Sidebar/treeNode.scss";
import { BoardItem } from "@components/ChartMenu/Sidebar/BoardItem/BoardItem";
import { memo } from "react";
import { TreeNode } from "@components/ChartMenu/TreeNode";

type Props = {
    boardNodes: TreeNode;
};

const Sidebar = ({ boardNodes }: Props) => {
    return (
        <div className={styles.wrapper}>
            {Object.entries(boardNodes).map(([name, packetNodes]) => {
                return (
                    <BoardItem
                        key={name}
                        name={name}
                        packetNodes={packetNodes!}
                    />
                );
            })}
        </div>
    );
};

export default memo(Sidebar);
