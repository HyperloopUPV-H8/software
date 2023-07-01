import { TabLayout } from "layouts/TabLayout/TabLayout";
import { ChartMenu } from "components/ChartMenu/ChartMenu";
import { ReactComponent as IncomingMessage } from "assets/svg/incoming-message.svg";
import { ReactComponent as Chart } from "assets/svg/chart.svg";
import { store } from "store";
import { ReceiveTable } from "components/ReceiveTable/ReceiveTable";
import { useMemo } from "react";
import { useSubscribe } from "common";
import { useDispatch } from "react-redux";
import { updateMeasurements } from "slices/measurementsSlice";
import { updatePodData } from "slices/podDataSlice";
import { createSidebarSections } from "components/ChartMenu/sidebar";

export const ReceiveColumn = () => {
    const dispatch = useDispatch();

    useSubscribe("podData/update", (update) => {
        dispatch(updatePodData(update));
        dispatch(updateMeasurements(update));
    });

    const sections = useMemo(() => {
        return createSidebarSections(store.getState().podData);
    }, []);

    const receiveColumnTabItems = useMemo(
        () => [
            {
                id: "receiveTable",
                name: "Packets",
                icon: <IncomingMessage />,
                component: (
                    <ReceiveTable boards={store.getState().podData.boards} />
                ),
            },
            {
                id: "charts",
                name: "Charts",
                icon: <Chart />,
                component: <ChartMenu sidebarSections={sections} />,
            },
        ],
        [store]
    );

    return <TabLayout items={receiveColumnTabItems}></TabLayout>;
};
