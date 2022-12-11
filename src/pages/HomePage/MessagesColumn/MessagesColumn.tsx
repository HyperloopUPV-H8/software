import styles from "@pages/HomePage/MessagesColumn.module.scss";
import { SplitLayout, Direction } from "@layouts/SplitLayout/SplitLayout";
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
              name: "MessageList",
              icon: <BiLineChart />,

              component: <FaultsAndWarningList />,
            },
          ]}
        ></TabLayout>,
        <TabLayout
          items={[
            {
              id: nanoid(),
              name: "ConnectionsTable",
              icon: <BiLineChart />,

              component: <ConnectionsTable />,
            },
          ]}
        ></TabLayout>,
      ]}
      direction={Direction.VERTICAL}
      initialPortions={[0.666, 0.333]}
    ></SplitLayout>
  );
};
