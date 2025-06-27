import { TabLayout } from "layouts/TabLayout/TabLayout";
import { ChartMenu, ChartInfo, ChartId } from "components/ChartMenu/ChartMenu";
import { ReactComponent as Chart } from "assets/svg/chart.svg";
import { useMemo } from "react";
import { useMeasurementsStore, usePodDataStore, useSubscribe } from "common";
import { createSidebarSections } from "components/ChartMenu/sidebar";

interface ChartsColumnProps {
    charts: ChartInfo[];
    setCharts: React.Dispatch<React.SetStateAction<ChartInfo[]>>;
    measurementsByChart: Record<ChartId, string[]>;
    setMeasurementsByChart: React.Dispatch<React.SetStateAction<Record<ChartId, string[]>>>;
}

export const ChartsColumn = ({ charts, setCharts, measurementsByChart, setMeasurementsByChart }: ChartsColumnProps) => {
    const podData = usePodDataStore(state => state.podData);
    const updatePodData = usePodDataStore(state => state.updatePodData)
    const updateMeasurements = useMeasurementsStore(state => state.updateMeasurements)

    useSubscribe("podData/update", (update) => {
        updatePodData(update);
        updateMeasurements(update);
    });

    const sections = useMemo(() => {
        return createSidebarSections(podData);
    }, [podData]);

    const chartsColumnTabItems = [
        {
            id: "charts",
            name: "Charts",
            icon: <Chart />,
            component: <ChartMenu 
                sidebarSections={sections} 
                charts={charts}
                setCharts={setCharts}
                measurementsByChart={measurementsByChart}
                setMeasurementsByChart={setMeasurementsByChart}
            />,
        },
    ];

    return <TabLayout tabs={chartsColumnTabItems}></TabLayout>;
};