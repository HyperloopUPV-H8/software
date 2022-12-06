import "./App.css";
import { OrderService } from "@services/OrderService";
import { HomePage } from "@pages/HomePage/HomePage";
import { useEffect } from "react";
import dataService from "@services/DataService";
import { useDispatch } from "react-redux";
import { initializePodData, updatePodData } from "@slices/podDataSlice";
import { PacketUpdate } from "@adapters/PacketUpdate";
import { updateConnection } from "@slices/connectionsSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dataService.fetchPodDataStructure().then((podData) => {
      dispatch(initializePodData(podData));
    });

    let packetSocket = dataService.createPacketWebSocket(
      (ev) => {
        let packetUpdates = JSON.parse(ev.data) as {
          [id: number]: PacketUpdate;
        };
        dispatch(updatePodData(packetUpdates));
      },
      (conn) => {
        dispatch(updateConnection(conn));
      }
    );

    return () => {
      packetSocket.close();
    };
  }, []);

  return (
    <div className="App">
      {/* <OrderService> */}
      <HomePage />
      {/* </OrderService> */}
    </div>
  );
}

export default App;
