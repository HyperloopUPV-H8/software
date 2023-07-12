import { Order, Orders, useSendOrder } from "common";
import styles from "./ControlPage.module.scss";
import { Connections, Logger, MessagesContainer } from "common";
import { Window } from "components/Window/Window";
import { EmergencyOrders } from "components/EmergencyOrders/EmergencyOrders";

const RestartTubeOrder: Order = {
    id: 203,
    fields: {},
};

const RestartVehicleOrder: Order = {
    id: 203,
    fields: {},
};

const StopTubeOrder: Order = {
    id: 203,
    fields: {},
};

const StopVehicleOrder: Order = {
    id: 203,
    fields: {},
};

export const ControlPage = () => {
    const sendOrder = useSendOrder();

    return (
        <div className={styles.controlPage}>
            <Window
                title="Orders"
                height="fill"
            >
                <Orders boards={["VCU", "BLCU", "LCU_MASTER"]} />
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
                restartTube={() => sendOrder(RestartTubeOrder)}
                restartVehicle={() => sendOrder(RestartVehicleOrder)}
                stopTube={() => sendOrder(StopTubeOrder)}
                stopVehicle={() => sendOrder(StopVehicleOrder)}
            />
        </div>
    );
};
