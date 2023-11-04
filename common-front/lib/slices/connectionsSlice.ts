import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Connection } from "..";

export const connectionsSlice = createSlice({
    name: "connections",
    initialState: {
        websocket: { name: "Backend WebSocket", isConnected: false },
        boards: [] as Connection[],
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
            for (const update of action.payload) {
                const connIndex = connections.boards.findIndex(
                    (conn) => conn.name == update.name
                );

                if (connIndex != -1) {
                    connections.boards[connIndex].isConnected =
                        update.isConnected;
                } else {
                    connections.boards.push({
                        name: update.name,
                        isConnected: update.isConnected,
                    });
                }
            }
        },
    },
});
