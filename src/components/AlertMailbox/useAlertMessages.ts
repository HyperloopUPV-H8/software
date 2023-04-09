import { RootState } from "./../../store";
import { useSelector } from "react-redux";
import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";
import { useDispatch } from "react-redux";
import { AlertMessage } from "models/AlertMessage";
import { addMessage } from "slices/alertMessagesSlice";
import { useState } from "react";
const mockAlertMessages: AlertMessage[] = [
    {
        kind: "fault",
        msg: {
            valueName: "current_1",
            violation: {
                kind: "OUT_OF_BOUNDS",
                want: [12, 34],
                got: 123,
            },
        },
    },
    {
        kind: "fault",
        msg: {
            valueName: "current_1",
            violation: {
                kind: "EQUALS",
                want: 12,
                got: 123,
            },
        },
    },
    {
        kind: "fault",
        msg: {
            valueName: "current_1",
            violation: {
                kind: "LOWER_BOUND",
                want: 12,
                got: 123,
            },
        },
    },
    {
        kind: "fault",
        msg: {
            valueName: "current_1",
            violation: {
                kind: "UPPER_BOUND",
                want: 12,
                got: 123,
            },
        },
    },
    {
        kind: "fault",
        msg: {
            valueName: "current_1",
            violation: {
                kind: "NOT_EQUALS",
                want: 12,
                got: 123,
            },
        },
    },
];

export function useAlertMessages() {
    const [messages, setMessages] = useState(mockAlertMessages);
    const dispatch = useDispatch();
    useWebSocketBroker("alertMessages", (msg: AlertMessage) => {
        dispatch(addMessage(msg));
    });

    return useSelector((state: RootState) => state.alertMessages);
}
