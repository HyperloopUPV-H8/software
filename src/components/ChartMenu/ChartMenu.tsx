import styles from "components/ChartMenu/ChartMenu.module.scss";
import { useSelector } from "react-redux";
import Sidebar from "components/ChartMenu/Sidebar/Sidebar";
import lodash from "lodash";
import { ChartList } from "components/ChartMenu/ChartList/ChartList";
import { createSections } from "./createSidebar";
import { useMemo } from "react";
import { store } from "store";

export const ChartMenu = () => {
    const sections = useMemo(() => {
        return createSections(store.getState().podData);
    }, []);

    if (sections.length == 0) {
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
                <Sidebar sections={sections} />
                <ChartList></ChartList>
            </div>
        );
    }
};
