import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Connection } from "models/Connection";

const connectionsSlice = createSlice({
    name: "connections",
    initialState: {
        websocket: { name: "Backend WebSocket", isConnected: false },
        boards: {} as Record<string, Connection>,
    },
    reducers: {
        setWebSocketConnection: (
            connections,
            action: PayloadAction<boolean>
        ) => {
            connections.websocket.isConnected = action.payload;
        },

        updateBoardConnections: (
            connections,
            action: PayloadAction<Record<string, Connection>>
        ) => {
            Object.values(action.payload).forEach(({ name, isConnected }) => {
                const conn = connections.boards[name];

                if (conn) {
                    conn.isConnected = isConnected;
                } else {
                    connections.boards[name] = { name, isConnected };
                }
            });
        },
    },
});

export const { setWebSocketConnection, updateBoardConnections } =
    connectionsSlice.actions;

export default connectionsSlice.reducer;
