import styles from "components/ChartMenu/ChartMenu.module.scss";
import { DragEvent } from "react";
import Sidebar from "components/ChartMenu/Sidebar/Sidebar";
import { Section } from "./Sidebar/Section/Section";
import { useMeasurementsStore } from "common";
import { useChartStore } from "./ChartStore";
import { nanoid } from "nanoid";
import { ChartElement } from "./ChartElement/ChartElement";

type Props = {
    sidebarSections: Section[];
};

export const ChartMenu = ({ sidebarSections }: Props) => {
    const getNumericMeasurementInfo = useMeasurementsStore((state) => state.getNumericMeasurementInfo);
    const charts = useChartStore((state) => state.charts);
    const addChart = useChartStore((state) => state.addChart);

    const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        const id = ev.dataTransfer.getData("id");
        const initialMeasurementInfo = getNumericMeasurementInfo(id);
        addChart(nanoid(), initialMeasurementInfo);
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
                        />
                    ))}
                </div>
            </div>
        );
    }
};
