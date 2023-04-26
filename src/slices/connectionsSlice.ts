import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Connection } from "common";

const connectionsSlice = createSlice({
    name: "connections",
    initialState: {
        websocket: { name: "Backend WebSocket", isConnected: false },
        boards: [] as Array<Connection>,
    },
    reducers: {
        setWebSocketConnection: (
            connections,
            action: PayloadAction<boolean>
        ) => {
            connections.websocket.isConnected = action.payload;

            if (!action.payload) {
                connections.boards.forEach((board) => {
                    board.isConnected = false;
                });
            }
        },

        updateBoardConnections: (
            connections,
            action: PayloadAction<Array<Connection>>
        ) => {
            action.payload.forEach(({ name, isConnected }) => {
                const conn = connections.boards.find(
                    (conn) => conn.name == name
                );

                if (conn) {
                    conn.isConnected = isConnected;
                } else {
                    connections.boards.push({ name, isConnected });
                }
            });
        },
    },
});

export const { setWebSocketConnection, updateBoardConnections } =
    connectionsSlice.actions;

export default connectionsSlice.reducer;
