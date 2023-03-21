import styles from "./MeasurementItem.module.scss";
import { DragEvent } from "react";
import { FiBox } from "react-icons/fi";
type Props = {
    id: string;
};

const MeasurementItem = ({ id }: Props) => {
    function handleDragStart(ev: DragEvent<HTMLDivElement>) {
        ev.dataTransfer.setData("text/plain", id);
    }

    return (
        <div
            className={`${styles.wrapper} treeNode`}
            draggable="true"
            onDragStart={handleDragStart}
        >
            <FiBox /> {id}
        </div>
    );
};

export default MeasurementItem;
