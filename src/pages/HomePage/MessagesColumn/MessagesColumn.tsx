import styles from "@pages/HomePage/MessagesColumn.module.scss";
import { SplitLayout, Direction } from "@layouts/SplitLayout/SplitLayout";
import { TabLayout } from "@layouts/TabLayout/TabLayout";
import { BiLineChart } from "react-icons/bi";
import { nanoid } from "nanoid";
import { ReceiveTable } from "@components/PacketTable/ReceiveTable/ReceiveTable";

export const MessagesColumn = () => {
  return (
    <SplitLayout
      components={[
        <TabLayout
          items={[
            {
              id: nanoid(),
              name: "ReceiveTable",
              icon: <BiLineChart />,

              component: <ReceiveTable />,
            },
          ]}
        ></TabLayout>,
        <TabLayout
          items={[
            {
              id: nanoid(),
              name: "ReceiveTable",
              icon: <BiLineChart />,
              component: <ReceiveTable />,
            },
          ]}
        ></TabLayout>,
      ]}
      direction={Direction.VERTICAL}
    ></SplitLayout>
  );
};
