import { Packet } from "./modals";
import { updateReceiveTable } from "./receiveTableBuilder";

let dataSocket = new WebSocket("ws://127.0.0.1:4000/backend/data");

dataSocket.onopen = (ev) => {
  alert("Established WS connection");
};

dataSocket.onmessage = (ev) => {
  let packetsObject = JSON.parse(ev.data);
  let packetMap = new Map<number, Packet>();
  for (let [key, value] of Object.entries(packetsObject)) {
    packetMap.set(Number.parseInt(key), value as Packet);
  }
  console.log("bruh", packetMap, packetsObject);
  updateReceiveTable(packetMap);
};
