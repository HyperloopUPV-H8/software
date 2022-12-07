import styles from "@pages/HomePage/TransmitColumn/TransmitColumn.module.scss";
import { TabLayout } from "@layouts/TabLayout/TabLayout";
import { nanoid } from "nanoid";
import { HiInboxArrowDown } from "react-icons/hi2";
import { ReceiveTable } from "@components/PacketTable/ReceiveTable/ReceiveTable";
import { TransmitTable } from "@components/PacketTable/TransmitTable/TransmitTable";

export const TransmitColumn = () => {
  return (
    <TabLayout
      items={[
        {
          id: nanoid(),
          name: "Transmit",
          //FIXME: CHANGE ICON TO OUTGOING ARROW
          icon: <HiInboxArrowDown />,
          component: <TransmitTable />,
        },
      ]}
    ></TabLayout>
  );
};
