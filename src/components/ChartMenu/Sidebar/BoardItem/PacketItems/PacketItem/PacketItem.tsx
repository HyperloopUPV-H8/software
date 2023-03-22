import styles from "./PacketItem.module.scss";

import { TreeNode } from "components/ChartMenu/Sidebar/TreeNode";
import { MeasurementItems } from "./MeasurementItems/MeasurementItems";

type Props = {
    name: string;
    measurementNodes: TreeNode;
};

const PacketItem = ({ name, measurementNodes }: Props) => {
    return (
        <div className={`${styles.wrapper} treeNode`}>
            <div className={styles.name}>{name}</div>
            <MeasurementItems measurementNodes={measurementNodes} />
        </div>
    );
};

export default PacketItem;
