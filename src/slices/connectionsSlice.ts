import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Connection } from "models/Connection";

const connectionsSlice = createSlice({
    name: "connections",
    initialState: {
        websocket: { name: "Backend WebSocket", isConnected: false },
        boards: [] as Connection[],
    },
    reducers: {
        setWebSocketConnection: (connections, action) => {
            connections.websocket.isConnected = action.payload;
        },

        updateBoardConnectionsArray: (
            connections,
            action: PayloadAction<Connection[]>
        ) => {
            // action.payload.forEach is not a function
            action.payload.forEach((element) => {
                let conn = connections.boards.find(
                    (conn) => conn.name == element.name
                )!;
                if (conn) {
                    conn.isConnected = element.isConnected;
                } else {
                    connections.boards.push(element);
                }
            });
        },

        setDisconnectionBoardState: (connections) => {
            connections.boards.forEach((element) => {
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
