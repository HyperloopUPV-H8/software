import styles from "./BoardItem.module.scss";
import { TreeNode } from "components/ChartMenu/Sidebar/TreeNode";
import { Caret } from "components/Caret/Caret";
import { useState } from "react";
import { PacketItems } from "./PacketItems/PacketItems";

type Props = {
    name: string;
    packetNodes: TreeNode;
};

export const BoardItem = ({ name, packetNodes }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={styles.wrapper}>
            <div
                className={styles.header}
                onClick={() => {
                    setIsOpen((prev) => !prev);
                }}
            >
                <Caret isOpen={isOpen} />
                {name}
            </div>
            <PacketItems
                packetNodes={packetNodes}
                isVisible={isOpen}
            />
        </div>
    );
};
