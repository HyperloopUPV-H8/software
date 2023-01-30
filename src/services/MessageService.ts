// import { createConnection } from "models/Connection";
// import { updateWebsocketConnection } from "slices/connectionsSlice";
// import { Message } from "adapters/Message";
// import { updateMessages } from "slices/messagesSlice";
// import { store } from "../store";
// import { createWebSocketToBackend } from "services/HTTPHandler";

// function createMessageWebSocket(): WebSocket {
//     let dispatch = store.dispatch;
//     let messageSocket = createWebSocketToBackend(
//         import.meta.env.VITE_MESSAGES_PATH
//     );

//     dispatch(updateWebsocketConnection(createConnection("Messages", false)));
//     messageSocket.onopen = () => {
//         dispatch(updateWebsocketConnection(createConnection("Messages", true)));
//     };

//     messageSocket.onmessage = (ev) => {
//         let message = JSON.parse(ev.data) as Message;
//         dispatch(updateMessages(message));
//     };

//     messageSocket.onclose = () => {
//         dispatch(
//             updateWebsocketConnection(createConnection("Messages", false))
//         );
//     };

//     return messageSocket;
// }

// const messageService = {
//     createMessageWebSocket,
// };

// export default messageService;
