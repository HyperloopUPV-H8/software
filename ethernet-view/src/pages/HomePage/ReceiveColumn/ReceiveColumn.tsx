import { TabLayout } from "layouts/TabLayout/TabLayout";
import { ReactComponent as IncomingMessage } from "assets/svg/incoming-message.svg";
import { ReceiveTable } from "components/ReceiveTable/ReceiveTable";
import { usePodDataStore } from "common";

export const ReceiveColumn = () => {
    const {podData} = usePodDataStore(state => ({podData: state.podData, updatePodData: state.updatePodData}))

    const receiveColumnTabItems = [
            {
                id: "receiveTable",
                name: "Packets",
                icon: <IncomingMessage />,
                component: (
                    <ReceiveTable boards={podData.boards} />
                ),
            },
        ]

    return <TabLayout items={receiveColumnTabItems}></TabLayout>;
};