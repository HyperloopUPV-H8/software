import { TabLayout } from "layouts/TabLayout/TabLayout";
import { nanoid } from "nanoid";
import { HiInboxArrowDown } from "react-icons/hi2";
import { OrderTable } from "components/OrderTable/OrderTable";
import { useRef } from "react";
import { ReactComponent as OutgoingMessage } from "assets/svg/outgoing-message.svg";

export const OrderColumn = () => {
    const orderTabItems = useRef([
        {
            id: nanoid(),
            name: "Orders",
            icon: <OutgoingMessage />,
            component: <OrderTable />,
        },
    ]);

    return <TabLayout items={orderTabItems.current}></TabLayout>;
};
