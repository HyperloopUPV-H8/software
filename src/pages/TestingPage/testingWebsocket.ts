import { useState, useEffect } from "react";
import { FormDescription } from "./TestControls/TestAttributes";
import { json } from "react-router-dom";

const SERVER_URL = `${import.meta.env.VITE_SERVER_IP_HIL}:${
    import.meta.env.VITE_SERVER_PORT_HIL
}${import.meta.env.VITE_BACKEND_WEBSOCKET_PATH}`;

const WEBSOCKET_URL = `ws://${SERVER_URL}`;

export type VehicleState1 = {
    xDistance: number;
    current: number;
    duty: number; //FIXME: Check it is a correct value
    temperature: number;
};

export function WebSocketClient() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    //const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newSocket = new WebSocket(WEBSOCKET_URL); //FIXME: It's correct?

        newSocket.onopen = () => {
            console.log("Open connection");
        };

        newSocket.onmessage = (event) => {
            const json: VehicleState1 = JSON.parse(event.data);
            console.log("Receive message: ", json);
            // try {
            //     if ((json.event = "data")) {
            //         //TODO: Pasar json a struct
            //     }
            // } catch (err) {
            //     console.log(err);
            // }
            // setMessages((prevMessages) => [...prevMessages, event.data]);
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

    const sendMessage = (controlForm: FormDescription) => {
        const jsonFormDescription = JSON.stringify(controlForm);
        socket!.send(jsonFormDescription);
    };
}
