import "./App.css";
import { OrderService } from "@services/OrderService";
import { HomePage } from "@pages/HomePage/HomePage";

import { useEffect } from "react";
import dataService from "@services/DataService";
import connectionService from "@services/ConnectionService";
import { useDispatch } from "react-redux";
import { initializePodData, updatePodData } from "@slices/podDataSlice";
import { PacketUpdate } from "@adapters/PacketUpdate";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dataService.fetchPodDataStructure().then((podData) => {
      dispatch(initializePodData(podData));
    });

    let packetSocket = dataService.createPacketWebSocket();
    let connectionSocket = connectionService.createOrderWebSocket();
    return () => {
      packetSocket.close();
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
