import { TabLayout } from "layouts/TabLayout/TabLayout";
import { ChartMenu } from "components/ChartMenu/ChartMenu";
import { ReactComponent as IncomingMessage } from "assets/svg/incoming-message.svg";
import { ReactComponent as Chart } from "assets/svg/chart.svg";
import { ReceiveTable } from "components/ReceiveTable/ReceiveTable";
import { useMemo } from "react";
import { useMeasurementsStore, usePodDataStore, useSubscribe } from "common";
import { createSidebarSections } from "components/ChartMenu/sidebar";

export const ReceiveColumn = () => {

    const {podData, updatePodData} = usePodDataStore(state => ({podData: state.podData, updatePodData: state.updatePodData}))
    const updateMeasurements = useMeasurementsStore(state => state.updateMeasurements)

    useSubscribe("podData/update", (update) => {
        updatePodData(update);
        updateMeasurements(update);
    });

    const sections = useMemo(() => {
        return createSidebarSections(podData);
    }, []);

    const receiveColumnTabItems = [
            {
                id: "receiveTable",
                name: "Packets",
                icon: <IncomingMessage />,
                component: (
                    <ReceiveTable boards={podData.boards} />
                ),
            },
            {
                id: "charts",
                name: "Charts",
                icon: <Chart />,
                component: <ChartMenu sidebarSections={sections} />,
            },
        ]

    return <TabLayout items={receiveColumnTabItems}></TabLayout>;
};