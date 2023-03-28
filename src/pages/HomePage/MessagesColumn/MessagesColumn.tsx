import styles from "pages/HomePage/MessagesColumn/MessagesColumn.module.scss";
import { SplitLayout } from "layouts/SplitLayout/SplitLayout";
import { Direction } from "layouts/SplitLayout/Direction";
import { TabLayout } from "layouts/TabLayout/TabLayout";
import { BiLineChart } from "react-icons/bi";
import { nanoid } from "nanoid";
import { FaultsAndWarningLogger } from "components/FaultsAndWarningLogger/FaultsAndWarningLogger";
import { ConnectionsTable } from "components/ConnectionsTable/ConnectionsTable";
import { Logger } from "components/Logger/Logger";
import { BootloaderUploader } from "components/BootloaderUploader/BootloaderUploader";
import { useRef } from "react";
export const MessagesColumn = () => {
    const messagesTabItems = useRef([
        {
            id: nanoid(),
            name: "Messages",
            icon: <BiLineChart />,

            component: <FaultsAndWarningLogger />,
        },
    ]);

    const connectionsTabItems = useRef([
        {
            id: nanoid(),
            name: "Connections",
            icon: <BiLineChart />,

            component: <ConnectionsTable />,
        },
    ]);

    return (
        <div className={styles.messageColumnWrapper}>
            <SplitLayout
                components={[
                    <TabLayout items={messagesTabItems.current}></TabLayout>,
                    <TabLayout items={connectionsTabItems.current}></TabLayout>,
                ]}
                direction={Direction.VERTICAL}
            ></SplitLayout>
            <Logger />
            <BootloaderUploader />
        </div>
    );
};
