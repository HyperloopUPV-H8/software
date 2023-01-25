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

export const MessagesColumn = () => {
    return (
        <div className={styles.messageColumnWrapper}>
            <SplitLayout
                components={[
                    <TabLayout
                        items={[
                            {
                                id: nanoid(),
                                name: "Messages",
                                icon: <BiLineChart />,

                                component: <FaultsAndWarningLogger />,
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
            <Logger />
            <BootloaderUploader />
        </div>
    );
};
