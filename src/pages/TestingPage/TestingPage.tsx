import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import style from "./TestingPage.module.scss";
import { TestControls } from "./TestControls/TestControls";
import { ThreeJsVehicle } from "./ThreeJs/ThreeJsVehicle";
import { useEffect, useState } from "react";
import { FormDescription } from "./TestControls/TestAttributes";

const SERVER_URL = `${import.meta.env.VITE_SERVER_IP_HIL}:${
    import.meta.env.VITE_SERVER_PORT_HIL
}${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`;

const WEBSOCKET_URL = `ws://${SERVER_URL}`;

export type VehicleState = {
    xDistance: number;
    current: number;
    duty: number; //FIXME: Check it is a correct value
    temperature: number;
};

export function TestingPage() {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const sendMessage = (controlForm: FormDescription) => {
        const jsonFormDescription = JSON.stringify(controlForm);
        socket!.send(jsonFormDescription);
    }; //TODO: websocket as a prop to TestControl

    useEffect(() => {
        const newSocket = new WebSocket(WEBSOCKET_URL); //FIXME: It's correct?

        newSocket.onopen = () => {
            console.log("Open connection");
        };

        newSocket.onmessage = (event) => {
            const json: VehicleState = JSON.parse(event.data); //TODO: This info to ThreeJsVehicle
            console.log("Receive message: ", json);
        };

        newSocket.onclose = () => {
            console.log("Conexión cerrada");
        };

        newSocket.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };

        // Actualizamos el estado del componente con la nueva instancia de WebSocket
        setSocket(newSocket);

        // TODO: Cerramos la conexión WebSocket al desmontar el componente, is it correct?
        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <PageWrapper title="Testing">
            <div className={style.testingPageWrapper}>
                <TestControls />
                <div className={style.podRepresentation}>
                    <div className={style.threeJSAndInfo}>
                        <div className={style.threeJS}>
                            <ThreeJsVehicle />
                        </div>

                        <div className={style.info}></div>
                    </div>
                    <div className={style.graphics}></div>
                </div>
            </div>
        </PageWrapper>
    );
}
