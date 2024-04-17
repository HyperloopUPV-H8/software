import { ChartId } from "components/ChartMenu/ChartMenu"
import { AiOutlineCloseCircle } from "react-icons/ai"
import styles from "components/ChartMenu/ChartElement/ChartElement.module.scss"
import { ChartCanvas } from "./ChartCanvas";
import { ChartPoint } from "pages/LoggerPage/LogsColumn/LogLoader/LogsProcessor";

interface Props {
    chartId: ChartId;
    removeChart: (chartId: ChartId) => void;
    getDataFromLogSession: (measurement: ChartId) => ChartPoint[];
}

export const ChartElement = ({ chartId, removeChart, getDataFromLogSession }: Props) => {
    
    const data = getDataFromLogSession(chartId);

    return (
        <div className={styles.chartWrapper}>
            <div className={styles.chart}> 
                <AiOutlineCloseCircle
                    size={30}
                    cursor="pointer"
                    onClick={() => removeChart(chartId)}
                />
                <ChartCanvas
                    data={data}
                />
            </div>
        </div>
    )
}
