import styles from "components/ChartMenu/ChartMenu.module.scss";
import Sidebar from "components/ChartMenu/Sidebar/Sidebar";
import { ChartList } from "components/ChartMenu/ChartList/ChartList";
import { Section } from "./Sidebar/Section/Section";
import { NumericMeasurement, getMeasurement, useMeasurementsStore } from "common";

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
}

type Props = {
    sidebarSections: Section[];
};

export const ChartMenu = ({ sidebarSections }: Props) => {

    const measurements = useMeasurementsStore((state) => state.measurements);

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
                <ChartList
                    getMeasurementInfo={(id) => {
                        const meas = getMeasurement(measurements, id) as NumericMeasurement;
                        return {
                            id: id,
                            name: meas.name,
                            units: meas.units,
                            range: meas.safeRange,
                            getUpdate: () => {
                                const meas = getMeasurement(measurements, id) as NumericMeasurement;
                                if (meas == undefined) return 0
                                return meas.value.last;
                            },
                            color: getRandomColor(),
                        };
                    }}
                />
            </div>
        );
    }
};