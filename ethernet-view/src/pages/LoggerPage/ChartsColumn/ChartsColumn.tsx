import { TabLayout } from "layouts/TabLayout/TabLayout";
import { ChartMenu } from "components/ChartMenu/ChartMenu";
import { ReactComponent as Chart } from "assets/svg/chart.svg";
import { useMemo } from "react";
import { usePodDataStore } from "common";
import { createSidebarSections } from "components/ChartMenu/sidebar";

export const ChartsColumn = () => {
    const podData = usePodDataStore(state => state.podData);

    const sections = useMemo(() => {
        return createSidebarSections(podData);
    }, []);

    const chartsColumnTabItems = [
            {
                id: "charts",
                name: "Charts",
                icon: <Chart />,
                component: <ChartMenu sidebarSections={sections} />,
            },
        ]

    return <TabLayout tabs={chartsColumnTabItems}></TabLayout>;
};