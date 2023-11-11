import { ChartInfo } from "components/ChartMenu/types";
import styles from "./ChartElement.module.scss";
import { Chart } from "./Chart";

type Props = {
    chartInfo: ChartInfo;
    removeElement: () => void;
    removeMeasurement: (id: string) => void;
};

export const ChartElement = ({ chartInfo, removeElement, removeMeasurement }: Props) => {

    // function handleDrop(ev: DragEvent<HTMLDivElement>) {
    //     ev.stopPropagation();
    //     const id = ev.dataTransfer.getData("id");
    //     console.log(id)
    // }

    return (
        <div
            className={styles.chartWrapper}
            onDragEnter={(ev) => ev.preventDefault()}
            onDragOver={(ev) => ev.preventDefault()}
            // onDrop={handleDrop}
        >

            <div className={styles.chart}>
                <Chart
                    chartInfo={chartInfo}
                />
            </div>
        </div>
    );
};
