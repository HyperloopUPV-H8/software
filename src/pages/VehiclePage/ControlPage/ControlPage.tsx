import { Order, Orders, useSendOrder } from "common";
import styles from "./ControlPage.module.scss";
import { Connections, Logger, MessagesContainer } from "common";
import { Window } from "components/Window/Window";
import { EmergencyOrders } from "components/EmergencyOrders/EmergencyOrders";
import {
    BrakeOrder,
    OpenContactorsOrder,
    RestartOrders,
    StopOrder,
    hardcodedOrders,
} from "./hardcodedOrders";

export const ControlPage = () => {
    const sendOrder = useSendOrder();

    return (
        <div className={styles.controlPage}>
            <Window
                title="Orders"
                height="fill"
            >
                <Orders orders={hardcodedOrders} />
            </Window>
            <Window
                title="Messages"
                height="fill"
            >
                <MessagesContainer />
            </Window>
            <Window
                title="Connections"
                height="fill"
            >
                <Connections />
            </Window>
            <Window title="Logger">
                <Logger />
            </Window>
            <EmergencyOrders
                brake={() => {
                    console.log("brake");
                    sendOrder(BrakeOrder);
                }}
                openContactors={() => {
                    console.log("open contactors");
                    sendOrder(OpenContactorsOrder);
                }}
                reset={() => {
                    console.log("reset");
                    for (const resetOrder of RestartOrders) {
                        sendOrder(resetOrder);
                    }
                }}
                stop={() => {
                    console.log("stop");
                    sendOrder(StopOrder);
                }}
            />
        </div>
    );
};
