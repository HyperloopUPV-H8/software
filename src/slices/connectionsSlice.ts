import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Connection } from "models/Connection";
const connectionsSlice = createSlice({
    name: "connections",
    initialState: {
        websocket: { name: "BackendWebSocket", isConnected: false },
        board: [] as Connection[],
    } as { websocket: Connection; board: Connection[] },
    reducers: {
        setWebSocketConnection: (connections, action) => {
            connections.websocket.isConnected = action.payload;
        },

        updateBoardConnectionsArray: (
            connections,
            action: PayloadAction<Connection[]>
        ) => {
            action.payload.forEach((element) => {
                let conn = connections.board.find(
                    (conn) => conn.name == element.name
                )!;
                if (conn) {
                    conn.isConnected = element.isConnected;
                } else {
                    connections.board.push(element);
                }
            });
        },

        setDisconnectionBoardState: (connections) => {
            connections.board.forEach((element) => {
                element.isConnected = false;
            });
        },

        initializeMockConnections: (connections, action) => {
            return action.payload;
        },
    },
});

export const {
    setWebSocketConnection,
    updateBoardConnectionsArray,
    setDisconnectionBoardState,
    initializeMockConnections,
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
