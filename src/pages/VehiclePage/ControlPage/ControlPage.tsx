import { Order, Orders, useOrders, useSendOrder } from "common";
import styles from "./ControlPage.module.scss";
import { Connections, Logger, MessagesContainer } from "common";
import { Window } from "components/Window/Window";
import { EmergencyOrders } from "components/EmergencyOrders/EmergencyOrders";
import {
    BrakeOrder,
    OpenContactorsOrder,
    ResetVehicleOrder,
    StopOrder,
    getHardcodedOrders,
} from "./hardcodedOrders";
import { BootloaderContainer } from "components/BootloaderContainer/BootloaderContainer";

export const ControlPage = () => {
    const sendOrder = useSendOrder();
    const boardOrders = useOrders();

    return (
        <div className={styles.controlPage}>
            <Window
                title="Orders"
                height="fill"
            >
                <Orders orders={getHardcodedOrders(boardOrders)} />
            </Window>
            <div className={styles.column}>
                <Window
                    title="Messages"
                    height="fill"
                >
                    <MessagesContainer />
                </Window>
                <BootloaderContainer />
            </div>
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
                    sendOrder(ResetVehicleOrder);
                }}
                stop={() => {
                    console.log("stop");
                    sendOrder(StopOrder);
                }}
            />
        </div>
    );
};
