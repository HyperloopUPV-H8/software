import styles from "./PacketItems.module.scss";
import { TreeNode } from "components/ChartMenu/Sidebar/TreeNode";
import PacketItem from "./PacketItem/PacketItem";

export const PacketItems = ({
    packetNodes,
    isVisible,
}: {
    packetNodes: TreeNode;
    isVisible: boolean;
}) => {
    return (
        <div
            className={`${styles.packetItemsWrapper} treeNode`}
            style={{ height: isVisible ? "auto" : "0" }}
        >
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
    );
};
