import { createConnection } from "@models/Connection";
import { updateWebsocketConnection } from "@slices/connectionsSlice";
import { Message } from "@adapters/Message";
import { updateMessages } from "@slices/messagesSlice";
import { store } from "../store";

function createMessageWebSocket(): WebSocket {
  let dispatch = store.dispatch;
  let messageSocket = new WebSocket(
    `ws://${import.meta.env.VITE_SERVER_IP}:${
      import.meta.env.VITE_SERVER_PORT
    }${import.meta.env.VITE_MESSAGES_URL}`
  );
  dispatch(updateWebsocketConnection(createConnection("Messages", false)));
  messageSocket.onopen = () => {
    dispatch(updateWebsocketConnection(createConnection("Messages", true)));
  };

  messageSocket.onmessage = (ev) => {
    console.log("On message");
    let message = JSON.parse(ev.data) as Message;

    if (message.type === "warning") {
      dispatch(updateMessages(message));
    } else if (message.type === "fault") {
      dispatch(updateMessages(message));
    } //watch out if type is none of them
  };

  messageSocket.onclose = () => {
    dispatch(updateWebsocketConnection(createConnection("Messages", false)));
  };

  return messageSocket;
}

const messageService = {
  createMessageWebSocket,
};

export default messageService;
