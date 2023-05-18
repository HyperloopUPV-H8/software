import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import style from "./TestingPage.module.scss";
import { TestControls } from "./TestControls/TestControls";
import { ThreeJsVehicle } from "./ThreeJs/ThreeJsVehicle";
import { useCallback, useEffect, useState } from "react";
import { FormDescription } from "./TestControls/TestAttributes";
import useWebSocket from "react-use-websocket";
import { VehiclePage } from "pages/VehiclePage/VehiclePage";

const SERVER_URL = `${import.meta.env.VITE_SERVER_IP_HIL}:${
    import.meta.env.VITE_SERVER_PORT_HIL
}${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`;

const WEBSOCKET_URL = `ws://${SERVER_URL}`;

export type VehicleState = {
    yDistance: number;
    current: number;
    duty: number;
    temperature: number;
};

export function TestingPage() {
    const [vehicleState, setVehicleState] = useState<VehicleState>({
        current: 0,
        duty: 0,
        temperature: 0,
        yDistance: 0,
    } as VehicleState);

    const {
        sendMessage,
        sendJsonMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    } = useWebSocket(WEBSOCKET_URL, {
        onOpen: () => console.log("opened"),
        shouldReconnect: (closeEvent) => {
            console.log("Disconnected");
            return true;
        },
    });

    useEffect(() => {
        if (lastJsonMessage !== null) {
            const newVehicleState = lastJsonMessage as VehicleState;
            if (newVehicleState.duty >= 0 && newVehicleState.duty < 256) {
                setVehicleState(newVehicleState);
            } else {
                console.log("Incorrect duty");
            }
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        console.log(vehicleState);
    }, [vehicleState]);

    return (
        <PageWrapper title="Testing">
            <div className={style.testingPageWrapper}>
                <TestControls sendJsonMessage={sendJsonMessage} />
                <div className={style.podRepresentation}>
                    <div className={style.threeJSAndInfo}>
                        <div className={style.threeJS}>
                            <ThreeJsVehicle
                                yDistance={vehicleState.yDistance}
                            />
                        </div>

                        <div className={style.info}></div>
                    </div>
                    <div className={style.graphics}></div>
                </div>
            </div>
        </PageWrapper>
    );
}
