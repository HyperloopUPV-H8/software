import { connectionsSlice } from "common";

export const { setWebSocketConnection, updateBoardConnections } =
    connectionsSlice.actions;

export default connectionsSlice.reducer;
