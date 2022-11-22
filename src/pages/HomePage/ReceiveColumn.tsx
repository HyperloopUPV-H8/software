import styles from "@pages/HomePage/ReceiveColumn.module.scss";
import { ReceiveTable } from "@components/PacketTable/ReceiveTable/ReceiveTable";
import { BiLineChart } from "react-icons/bi";
import { TabLayout } from "@layouts/TabLayout/TabLayout";
import { nanoid } from "nanoid";
import { HiInboxArrowDown } from "react-icons/hi2";

export const ReceiveColumn = () => {
  return (
    <TabLayout
      items={[
        {
          id: nanoid(),
          name: "ReceiveTable",
          icon: <HiInboxArrowDown />,
          component: <ReceiveTable />,
        },
        {
          id: nanoid(),
          name: "Charts",
          icon: <BiLineChart />,

          component: <div>Hello Charts</div>,
        },
      ]}
    ></TabLayout>
  );
};
