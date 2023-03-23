import { SplitLayout } from "layouts/SplitLayout/SplitLayout";
import { Direction } from "layouts/SplitLayout/Direction";
import { ReceiveColumn } from "pages/HomePage/ReceiveColumn/ReceiveColumn";
import { OrderTable } from "components/OrderTable/OrderTable";
import { OrderColumn } from "pages/HomePage/OrderColumn/OrderColumn";
import { MessagesColumn } from "pages/HomePage/MessagesColumn/MessagesColumn";
import styles from "pages/HomePage/HomePage.module.scss";

export const HomePage = () => {
    return (
        <div id={styles.wrapper}>
            <div id={styles.body}>
                <SplitLayout
                    components={[
                        <ReceiveColumn />,
                        // <OrderColumn />,
                        // <MessagesColumn />,
                    ]}
                    direction={Direction.HORIZONTAL}
                ></SplitLayout>
            </div>
        </div>
    );
};
