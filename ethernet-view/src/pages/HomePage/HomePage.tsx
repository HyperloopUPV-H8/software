import { SplitLayout } from "layouts/SplitLayout/SplitLayout";
import { Orientation } from "hooks/useSplit/Orientation";
import { ReceiveColumn } from "pages/HomePage/ReceiveColumn/ReceiveColumn";
import { OrderColumn } from "pages/HomePage/OrderColumn/OrderColumn";
import { MessagesColumn } from "pages/HomePage/MessagesColumn/MessagesColumn";
import { ChartsColumn } from "./ChartsColumn/ChartsColumn";
import styles from "pages/HomePage/HomePage.module.scss";
import incomingMessage from "assets/svg/incoming-message.svg"
import paperAirplane from "assets/svg/paper-airplane.svg"
import outgoingMessage from "assets/svg/outgoing-message.svg"
import chart from "assets/svg/chart.svg"

export const HomePage = () => {
    return (
        <div id={styles.wrapper}>
            <div id={styles.body}>
                <SplitLayout
                    components={[
                        {
                            component: <ChartsColumn />,
                            collapsedIcon: chart
                        },
                        {
                            component: <ReceiveColumn />,
                            collapsedIcon: incomingMessage
                        },
                        { 
                            component: <OrderColumn />,
                            collapsedIcon: paperAirplane
                        },
                        { 
                            component: <MessagesColumn />,
                            collapsedIcon: outgoingMessage
                        },
                    ]}
                    orientation={Orientation.HORIZONTAL}
                ></SplitLayout>
            </div>
        </div>
    );
};
