
import { useEffect, createContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { createConnection } from "@models/Connection";
import { updateConnection } from "@slices/connectionsSlice";
import { Message } from "@adapters/Message";
import { updateFaultMessages, updateWarningMessages } from "@slices/messagesSlice";

export const MessageService = ({ children }: any) => {
  const dispatch = useDispatch();
  let messageSocket = useRef<WebSocket>();

  useEffect(() => {
    messageSocket.current = new WebSocket(
      `ws://${import.meta.env.VITE_SERVER_IP}:${
        import.meta.env.VITE_SERVER_PORT
      }${import.meta.env.VITE_MESSAGES_URL}`
    );
    dispatch(updateConnection(createConnection("Messages", false)));
    messageSocket.current.onopen = () => {
      dispatch(updateConnection(createConnection("Messages", true)));
    };

    messageSocket.current.onmessage = (ev) => {
        let message = JSON.parse(ev.data) as Message;
        
        if(message.type === "warning") {
          dispatch(updateWarningMessages(message));
        } else if(message.type === "fault") {
          dispatch(updateFaultMessages(message));
        } //watch out if type is none of them
    };

    messageSocket.current.onclose = () => {
      dispatch(updateConnection(createConnection("Messages", false)));
    };

    return () => {
      if (messageSocket.current) {
        messageSocket.current.close();
      }
    };
  }, []);

  return <>{children}</>;
};