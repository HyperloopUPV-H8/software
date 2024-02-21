import styles from "components/ChartMenu/ChartMenu.module.scss";
import { DragEvent, useState } from "react";
import Sidebar from "components/ChartMenu/Sidebar/Sidebar";
import { Section } from "./Sidebar/Section/Section";
import { NumericMeasurementInfo, useMeasurementsStore } from "common";
import { nanoid } from "nanoid";
import { ChartElement } from "./ChartElement/ChartElement";

type Props = {
    sidebarSections: Section[];
};

export type ChartId = string;
export type ChartInfo = {
    chartId: ChartId, 
    initialMeasurement: NumericMeasurementInfo
};

export const ChartMenu = ({ sidebarSections }: Props) => {
    const [charts, setCharts] = useState<ChartInfo[]>([]);
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);

    const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        const id = ev.dataTransfer.getData("id");
        const initialMeasurementInfo = getNumericMeasurementInfo(id);
        setCharts([...charts, { chartId: nanoid(), initialMeasurement: initialMeasurementInfo }]);
    };

    if (sidebarSections.length == 0) {
        return (
            <div className={styles.noValues}>
                No available values to chart. This might happen if none of the
                measurements are numeric (only numeric measurements are
                chartable).
            </div>
        );
    } else {
        return (
            <div className={styles.chartMenuWrapper}>
                <Sidebar sections={sidebarSections} />
                <div
                    className={styles.chartListWrapper}
                    onDrop={handleDrop}
                    onDragEnter={(ev) => ev.preventDefault()}
                    onDragOver={(ev) => ev.preventDefault()}
                >
                    {charts.map((chart) => (
                        <ChartElement
                            key={chart.chartId}
                            chartId={chart.chartId}
                            initialMeasurement={chart.initialMeasurement}
                            removeChart={(chartId) => setCharts(charts.filter((chart) => chart.chartId !== chartId))}
                        />
                    ))}
                </div>
            </div>
        );
    }
};
