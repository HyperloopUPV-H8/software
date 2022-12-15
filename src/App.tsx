import "./App.css";
import { OrderService } from "@services/OrderService";
import { HomePage } from "@pages/HomePage/HomePage";

import { useEffect } from "react";
import dataService from "@services/DataService";
import messageService from "@services/MessageService";
import connectionService from "@services/ConnectionService";
import { useDispatch } from "react-redux";
import { initializePodData } from "@slices/podDataSlice";
import { PacketUpdate } from "@adapters/PacketUpdate";
import { warningMessages, faultMessages } from "@mocks/messages";
import { updateMessages } from "@slices/messagesSlice";
import { Message } from "@adapters/Message";

function App() {
  const dispatch = useDispatch();

  function getRandomMessage(messages: Message[]) {
    let randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

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
      //clearInterval(intervalId);
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
