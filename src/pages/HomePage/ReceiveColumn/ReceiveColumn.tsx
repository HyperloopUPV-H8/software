import styles from "./ReceiveColumn.module.scss";
import { TabLayout } from "layouts/TabLayout/TabLayout";
import { ChartMenu } from "components/ChartMenu/ChartMenu";
import { ReactComponent as IncomingMessage } from "assets/svg/incoming-message.svg";
import { ReactComponent as Chart } from "assets/svg/chart.svg";
import { ReceiveTable } from "components/ReceiveTable/ReceiveTable";
import { useMemo } from "react";
import { store } from "store";

export const ReceiveColumn = () => {
    const receiveColumnTabItem = useMemo(
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
                component: <ChartMenu />,
            },
        ],

        []
    );

    return <TabLayout items={receiveColumnTabItem}></TabLayout>;
};
