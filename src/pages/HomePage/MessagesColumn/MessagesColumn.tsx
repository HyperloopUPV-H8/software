import styles from "@pages/HomePage/MessagesColumn.module.scss";
import { SplitLayout, Direction } from "@layouts/SplitLayout/SplitLayout";
import { TabLayout } from "@layouts/TabLayout/TabLayout";
import { BiLineChart } from "react-icons/bi";
import { nanoid } from "nanoid";
import { ConnectionsList } from "@components/ConnectionsTable/ConnectionsList";
import { ConsoleList } from "@components/MessageLogger/ConsoleList";
export const MessagesColumn = () => {
  return (
    <SplitLayout
      components={[
        <TabLayout
          items={[
            {
              id: nanoid(),
              name: "ConnectionsTable",
              icon: <BiLineChart />,

              component: (
                <ConsoleList
                  title="Test"
                  messages={[{ id: 1, type: "warning", description: "Heelo" }]}
                />
              ),
            },
          ]}
        ></TabLayout>,
        <TabLayout
          items={[
            {
              id: nanoid(),
              name: "ConnectionsTable",
              icon: <BiLineChart />,

              component: <ConnectionsList />,
            },
          ]}
        ></TabLayout>,
      ]}
      direction={Direction.VERTICAL}
    ></SplitLayout>
  );
};
