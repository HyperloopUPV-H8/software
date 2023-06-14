import styles from "components/ChartMenu/ChartMenu.module.scss";
import Sidebar from "components/ChartMenu/Sidebar/Sidebar";
import { ChartList } from "components/ChartMenu/ChartList/ChartList";
import { store } from "store";
import { Section } from "./Sidebar/Section/Section";
import { NumericMeasurement, getMeasurement } from "common";
import { parseId } from "./parseId";

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
                    getLine={(id) => {
                        const ids = parseId(id);

                        const meas = getMeasurement(
                            store.getState().measurements,
                            ids.boardId,
                            ids.measId
                        ) as NumericMeasurement;

                        return {
                            id: id,
                            name: meas.name,
                            units: meas.units,
                            range: meas.safeRange,
                            getUpdate: () => {
                                //TODO: change to getNumericMeasurement and return undefined if its not numeric (or doesnt exist)
                                const meas = getMeasurement(
                                    store.getState().measurements,
                                    ids.boardId,
                                    ids.measId
                                ) as NumericMeasurement;

                                if (!meas) {
                                    return 0;
                                }

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
