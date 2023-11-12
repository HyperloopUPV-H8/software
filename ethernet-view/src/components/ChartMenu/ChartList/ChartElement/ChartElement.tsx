import { ChartInfo } from "components/ChartMenu/types";
import styles from "./ChartElement.module.scss";
import { Chart } from "./Chart";
import { AiOutlineCloseCircle } from 'react-icons/ai'

type Props = {
    chartInfo: ChartInfo;
    removeElement: (id: string) => void;
};

export const ChartElement = ({ chartInfo, removeElement }: Props) => {

    // function handleDrop(ev: DragEvent<HTMLDivElement>) {
    //     ev.stopPropagation();
    //     const id = ev.dataTransfer.getData("id");
    // }

    return (
        <div
            className={styles.chartWrapper}
            onDragEnter={(ev) => ev.preventDefault()}
            onDragOver={(ev) => ev.preventDefault()}
            // onDrop={handleDrop}
        >

            <div className={styles.chart}>
                <AiOutlineCloseCircle 
                    size={30}
                    cursor="pointer"
                    onClick={() => removeElement(chartInfo.name)}
                />
                <Chart
                    chartInfo={chartInfo}
                    removeElement={removeElement}
                />
            </div>
        </div>
    );
};
