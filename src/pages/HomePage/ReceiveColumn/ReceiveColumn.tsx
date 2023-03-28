import styles from "./ReceiveColumn.module.scss";

import { ReceiveTable } from "components/ReceiveTable/ReceiveTable";
import { BiLineChart } from "react-icons/bi";
import { TabLayout } from "layouts/TabLayout/TabLayout";
import { HiInboxArrowDown } from "react-icons/hi2";
import { ChartMenu } from "components/ChartMenu/ChartMenu";
import { RequestState, useFetchPodData } from "./useFetchPodData";

const receiveColumnTabItem = [
    {
        id: "receiveTable",
        name: "Packets",
        icon: <HiInboxArrowDown />,
        component: <ReceiveTable />,
    },
    {
        id: "charts",
        name: "Charts",
        icon: <BiLineChart />,
        component: <ChartMenu />,
    },
];

export const ReceiveColumn = () => {
    const requestState = useFetchPodData();

    if (requestState == RequestState.PENDING) {
        return <div className={styles.loadingMessages}>Loading PodData...</div>;
    } else if (requestState == RequestState.FULFILLED) {
        return <TabLayout items={receiveColumnTabItem}></TabLayout>;
    } else {
        return (
            <div className={styles.loadingMessages}>Error fetching PodData</div>
        );
    }
};
