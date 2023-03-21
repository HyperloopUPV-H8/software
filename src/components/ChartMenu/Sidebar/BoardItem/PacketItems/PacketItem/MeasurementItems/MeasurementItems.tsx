import { TreeNode } from "components/ChartMenu/Sidebar/TreeNode";
import MeasurementItem from "./MeasurementItem/MeasurementItem";
import styles from "./MeasurementItems.module.scss";

export const MeasurementItems = ({
    measurementNodes,
}: {
    measurementNodes: TreeNode;
}) => {
    return (
        <div className={styles.measurementList}>
            {Object.keys(measurementNodes).map((id) => {
                return (
                    <MeasurementItem
                        key={id}
                        id={id}
                    />
                );
            })}
        </div>
    );
};
