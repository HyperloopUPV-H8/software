import { SplitLayout } from "layouts/SplitLayout/SplitLayout";
import { Orientation } from "hooks/useSplit/Orientation";
import { ReceiveColumn } from "pages/HomePage/ReceiveColumn/ReceiveColumn";
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
                        <OrderColumn />,
                        <MessagesColumn />,
                    ]}
                    orientation={Orientation.HORIZONTAL}
                ></SplitLayout>
            </div>
        </div>
    );
};
