import { useWebSocketBroker } from "services/WebSocketBroker/useWebSocketBroker";
import { addMessage } from "slices/messagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { ProtectionMessageAdapter } from "adapters/ProtectionMessage";
import { Violation } from "models/ProtectionMessage";

function createRandomMessage(): ProtectionMessageAdapter {
    return {
        kind: (["fault", "warning"] as const)[Math.floor(Math.random() * 2)],
        board: "LCU_MASTER",
        name: "current_1",
        violation: createRandomViolation(),
        timestamp: {
            counter: 13233,
            day: Math.floor(Math.random() * 31) + 1,
            month: Math.floor(Math.random() * 12) + 1,
            hours: Math.floor(Math.random() * 24),
            minutes: Math.floor(Math.random() * 60),
            seconds: Math.floor(Math.random() * 60),
            year: Math.floor(Math.random() * 100) + 2000,
        },
    };
}

function createRandomViolation(): Violation {
    const kinds = [
        "EQUALS",
        "LOWER_BOUND",
        "NOT_EQUALS",
        "OUT_OF_BOUNDS",
        "UPPER_BOUND",
    ] as const;

    const randomKind = kinds[Math.floor(Math.random() * kinds.length)];

    switch (randomKind) {
        case "EQUALS":
            return {
                kind: randomKind,
                got: 10,
            };
        case "LOWER_BOUND":
            return {
                kind: randomKind,
                got: 10,
                want: 20,
            };
        case "NOT_EQUALS":
            return {
                kind: randomKind,
                got: 10,
                want: 20,
            };
        case "OUT_OF_BOUNDS":
            return {
                kind: randomKind,
                got: 12,
                want: [5, 10],
            };
        case "UPPER_BOUND":
            return {
                kind: randomKind,
                got: 10,
                want: 7,
            };
    }
}

export function useMessages() {
    const dispatch = useDispatch();

    useWebSocketBroker("message/update", (msg) => {
        dispatch(addMessage(msg));
    });

    return useSelector((state: RootState) => state.messages);
}
