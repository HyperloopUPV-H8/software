import "./App.css";
import { OrderService } from "services/OrderService";
import { HomePage } from "pages/HomePage/HomePage";

import { useEffect } from "react";
import dataService from "services/DataService";
import messageService from "services/MessageService";
import connectionService from "services/ConnectionService";
import { useDispatch } from "react-redux";
import { initializePodData } from "slices/podDataSlice";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dataService.fetchPodDataStructure().then((podData) => {
            dispatch(initializePodData(podData));
        });

        let packetSocket = dataService.createPacketWebSocket();
        let messageSocket = messageService.createMessageWebSocket();
        let connectionSocket = connectionService.createConnectionsSocket();

        return () => {
            packetSocket.close();
            messageSocket.close();
            connectionSocket.close();
        };
    }, []);

    return (
        <div className="App">
            <OrderService>
                <HomePage />
            </OrderService>
        </div>
    );
}

export default App;
