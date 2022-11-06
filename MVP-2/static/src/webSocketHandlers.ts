import { Packet } from "./modals";
import { updateReceiveTable } from "./receiveTableBuilder";

let dataSocket = new WebSocket("ws://127.0.0.1:4000/backend/data");

dataSocket.onopen = (ev) => {
  alert("Established WS connection");
};

dataSocket.onmessage = (ev) => {
  let packetsObject = JSON.parse(ev.data);
  let packets = new Map(Object.entries(packetsObject)) as Map<string, Packet>;

  updateReceiveTable(packets);
};
