import { BoardOrders } from "components/BoardOrders/BoardOrders";
import styles from "./ControlPage.module.scss";
import { Connections, Logger, MessagesContainer } from "common";
import { Window } from "components/Window/Window";
import { EmergencyOrders } from "components/EmergencyOrders/EmergencyOrders";

export const ControlPage = () => {
    return (
        <div className={styles.controlPage}>
            <BoardOrders name="VCU" />
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
            <EmergencyOrders />
        </div>
    );
};
