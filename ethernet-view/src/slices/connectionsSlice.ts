import { connectionsSlice } from "common";

export const connectionsReducer = connectionsSlice.reducer;

export const { setWebSocketConnection, updateBoardConnections } =
    connectionsSlice.actions;
