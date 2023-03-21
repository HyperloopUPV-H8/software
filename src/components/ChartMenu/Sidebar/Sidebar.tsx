import styles from "./Sidebar.module.scss";
import "./treeNode.scss";
import { BoardItem } from "./BoardItem/BoardItem";
import { memo } from "react";
import { TreeNode } from "./TreeNode";

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
