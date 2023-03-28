import { TabLayout } from "layouts/TabLayout/TabLayout";
import { nanoid } from "nanoid";
import { HiInboxArrowDown } from "react-icons/hi2";
import { OrderTable } from "components/OrderTable/OrderTable";
import { useRef } from "react";
export const OrderColumn = () => {
    const orderTabItems = useRef([
        {
            id: nanoid(),
            name: "Orders",
            //FIXME: CHANGE ICON TO OUTGOING ARROW
            icon: <HiInboxArrowDown />,
            component: <OrderTable />,
        },
    ]);

    return <TabLayout items={orderTabItems.current}></TabLayout>;
};
