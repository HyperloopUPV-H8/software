import styles from "components/ChartMenu/Sidebar/MeasurementItem/MeasurementItem.module.scss";
import { Measurement } from "models/PodData/Measurement";
import { DragEvent, memo } from "react";
import { FiBox } from "react-icons/fi";
type Props = {
    name: string;
};

const MeasurementItem = ({ name }: Props) => {
    function handleDragStart(ev: DragEvent<HTMLDivElement>) {
        ev.dataTransfer.setData("text/plain", name);
    }

    return (
        <div
            key={name}
            className={`${styles.wrapper} treeNode`}
            draggable="true"
            onDragStart={handleDragStart}
        >
            <FiBox /> {name}
        </div>
    );
};

export default MeasurementItem;
