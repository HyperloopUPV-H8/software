import styles from "@components/ChartMenu/Sidebar/PacketItem/PacketItem.module.scss";
import MeasurementItem from "@components/ChartMenu/Sidebar/MeasurementItem/MeasurementItem";
import { TreeNode } from "@components/ChartMenu/TreeNode";

type Props = {
    name: string;
    measurementNodes: TreeNode;
};

const PacketItem = ({ name, measurementNodes }: Props) => {
    return (
        <div id={styles.wrapper} className={`${styles.treeNode}`}>
            <div id={styles.name}>{name}</div>
            <MeasurementItems measurementNodes={measurementNodes} />
        </div>
    );
};

const MeasurementItems = ({
    measurementNodes,
}: {
    measurementNodes: TreeNode;
}) => {
    return (
        <div id={styles.measurementList}>
            {Object.keys(measurementNodes).map((name) => {
                return <MeasurementItem key={name} name={name} />;
            })}
        </div>
    );
};

export default PacketItem;
