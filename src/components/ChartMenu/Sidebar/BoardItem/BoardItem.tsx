import styles from "@components/ChartMenu/Sidebar/BoardItem/BoardItem.module.scss";
import { Board } from "@models/PodData/Board";
import PacketItem from "@components/ChartMenu/Sidebar/PacketItem/PacketItem";
import { TreeNode } from "@components/ChartMenu/TreeNode";
import { Caret } from "@components/Caret/Caret";
import { useState } from "react";

type Props = {
    name: string;
    packetNodes: TreeNode;
};

export const BoardItem = ({ name, packetNodes }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <Caret
                    isOpen={isOpen}
                    onClick={() => {
                        setIsOpen((prev) => !prev);
                    }}
                />
                {name}
            </div>
            <PacketItems packetNodes={packetNodes} isVisible={isOpen} />
        </div>
    );
};

const PacketItems = ({
    packetNodes,
    isVisible,
}: {
    packetNodes: TreeNode;
    isVisible: boolean;
}) => {
    return (
        <div
            className={`${styles.packetList} treeNode`}
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
