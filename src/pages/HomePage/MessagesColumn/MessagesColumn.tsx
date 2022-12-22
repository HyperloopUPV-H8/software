import styles from "@pages/HomePage/MessagesColumn.module.scss";
import { SplitLayout } from "@layouts/SplitLayout/SplitLayout";
import { Direction } from "@layouts/SplitLayout/Direction";
import { TabLayout } from "@layouts/TabLayout/TabLayout";
import { BiLineChart } from "react-icons/bi";
import { nanoid } from "nanoid";
import { FaultsAndWarningList } from "@components/MessageLogger/FaultsAndWarningList/FaultsAndWarningList";
import { ConnectionsTable } from "@components/ConnectionsTable/ConnectionsTable";
export const MessagesColumn = () => {
    return (
        <SplitLayout
            components={[
                <TabLayout
                    items={[
                        {
                            id: nanoid(),
                            name: "Messages",
                            icon: <BiLineChart />,

                            component: <FaultsAndWarningList />,
                        },
                    ]}
                ></TabLayout>,
                <TabLayout
                    items={[
                        {
                            id: nanoid(),
                            name: "Connections",
                            icon: <BiLineChart />,

                            component: <ConnectionsTable />,
                        },
                    ]}
                ></TabLayout>,
            ]}
            direction={Direction.VERTICAL}
            minSizes={[0.2, 0.2]}
        ></SplitLayout>
    );
};
