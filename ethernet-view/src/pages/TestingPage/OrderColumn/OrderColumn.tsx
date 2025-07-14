import { TabLayout } from "layouts/TabLayout/TabLayout";
import { nanoid } from "nanoid";
import { OrdersContainer } from "components/OrdersContainer/OrdersContainer";
import { useRef } from "react";
import { ReactComponent as OutgoingMessage } from "assets/svg/outgoing-message.svg";
import styles from "./OrderColumn.module.scss";

export const OrderColumn = () => {
    const orderTabItems = useRef([
        {
            id: nanoid(),
            name: "Orders",
            icon: <OutgoingMessage />,
            component: <OrdersContainer />,
        },
    ]);

    return <div className={styles.orderColumn}>
        <TabLayout tabs={orderTabItems.current}></TabLayout>
    </div>;
};
